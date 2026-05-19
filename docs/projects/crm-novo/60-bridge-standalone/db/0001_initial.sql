-- ──────────────────────────────────────────────────────────────
-- Bridge Standalone — Initial schema
-- Run: psql $SUPABASE_DB_URL -f db/0001_initial.sql
-- Idempotent: pode rodar múltiplas vezes (CREATE IF NOT EXISTS)
-- ──────────────────────────────────────────────────────────────

-- Audit log: 1 row por chamada Meta/Google. Status final.
CREATE TABLE IF NOT EXISTS bridge_audit_log (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           text NOT NULL,
  event_type          text NOT NULL CHECK (event_type IN ('lead.qualified', 'deal.won', 'lead.created')),
  event_id            text NOT NULL,                  -- idempotency key
  entity_id           text NOT NULL,                  -- lead_id ou deal_id
  destination         text NOT NULL CHECK (destination IN ('meta_capi', 'google_oc')),
  status              text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'skipped_duplicate')),
  payload             jsonb NOT NULL,                 -- payload enviado
  response            jsonb,                          -- response do destino
  error               text,                           -- mensagem de erro se failed
  duration_ms         integer,
  inngest_run_id      text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  completed_at        timestamptz
);

CREATE INDEX IF NOT EXISTS idx_audit_event_id ON bridge_audit_log(event_id);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_created ON bridge_audit_log(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_status ON bridge_audit_log(status) WHERE status IN ('pending', 'failed');
CREATE INDEX IF NOT EXISTS idx_audit_entity ON bridge_audit_log(entity_id, event_type);

-- Idempotency keys: hash → primeira chamada (dedup)
-- UNIQUE constraint garante que retry com mesmo event_id retorna a 1ª chamada.
CREATE TABLE IF NOT EXISTS bridge_idempotency (
  event_id            text PRIMARY KEY,
  tenant_id           text NOT NULL,
  event_type          text NOT NULL,
  destination         text NOT NULL,
  first_audit_id      uuid NOT NULL REFERENCES bridge_audit_log(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  expires_at          timestamptz NOT NULL DEFAULT (now() + interval '7 days')
);

CREATE INDEX IF NOT EXISTS idx_idemp_expires ON bridge_idempotency(expires_at);

-- Dead-letter queue: falhas que esgotaram retry. Manual replay.
CREATE TABLE IF NOT EXISTS bridge_dlq (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           text NOT NULL,
  event_type          text NOT NULL,
  event_id            text NOT NULL,
  destination         text NOT NULL,
  original_payload    jsonb NOT NULL,
  last_error          text NOT NULL,
  retry_count         integer NOT NULL DEFAULT 0,
  audit_log_ids       uuid[] DEFAULT '{}',            -- todos audit logs relacionados
  status              text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'replaying', 'resolved', 'abandoned')),
  created_at          timestamptz NOT NULL DEFAULT now(),
  resolved_at         timestamptz,
  resolved_by         text,
  resolved_notes      text
);

CREATE INDEX IF NOT EXISTS idx_dlq_status_created ON bridge_dlq(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dlq_event ON bridge_dlq(event_id);

-- ──────────────────────────────────────────────────────────────
-- RLS: enable mas sem policies (acesso só via service_role token Week 0)
-- Sprint 1 adicionará policies multi-tenant
-- ──────────────────────────────────────────────────────────────
ALTER TABLE bridge_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridge_idempotency ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridge_dlq ENABLE ROW LEVEL SECURITY;

-- Service role bypassa RLS automatically.
-- Anon/authenticated não podem ler até policies serem criadas.

-- ──────────────────────────────────────────────────────────────
-- View pra dashboards
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW bridge_summary_24h AS
SELECT
  tenant_id,
  event_type,
  destination,
  status,
  COUNT(*) as count,
  AVG(duration_ms)::int as avg_duration_ms,
  MAX(created_at) as last_at
FROM bridge_audit_log
WHERE created_at >= now() - interval '24 hours'
GROUP BY tenant_id, event_type, destination, status;

-- ──────────────────────────────────────────────────────────────
-- Cleanup function: chama via Inngest cron diário
-- Remove idempotency keys expirados (7 dias) — não afeta audit_log
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION cleanup_expired_idempotency()
RETURNS integer AS $$
DECLARE
  deleted integer;
BEGIN
  DELETE FROM bridge_idempotency WHERE expires_at < now();
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ──────────────────────────────────────────────────────────────
-- Seed de teste (remover em prod)
-- ──────────────────────────────────────────────────────────────
-- INSERT INTO bridge_audit_log (tenant_id, event_type, event_id, entity_id, destination, status, payload)
-- VALUES ('tocks', 'lead.qualified', 'seed_test_001', 'lead_seed', 'meta_capi', 'completed', '{"test": true}'::jsonb);
