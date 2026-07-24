-- ============================================
-- Tocks Tracking - Migration 005: Gclid captures + Tray webhook idempotency
-- Extracted from apps/tocks-sales-ai/supabase/migrations/005_gclid_captures.sql
-- with FIX E1 (RLS helper consolidation) and FIX E2 (identifier CHECK) applied.
-- ============================================
--
-- PREREQUISITES (must exist from tocks-sales-ai migrations 001-004):
--   - `tenants` table (migration 001 / 002)
--   - `get_user_tenant_id()` helper function (migration 003)
--   - `uuid_generate_v4()` extension (migration 001)
--
-- If deploying tocks-tracking to a fresh Supabase project (no tocks-sales-ai
-- schema present), you must first run tocks-sales-ai migrations 001-004, OR
-- adapt this file to create a minimal tenants table + helper inline. The
-- intent is that both apps share the same Supabase instance.

-- ============================================
-- 1. GCLID CAPTURES
-- ============================================
CREATE TABLE IF NOT EXISTS gclid_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  gclid TEXT NOT NULL,
  email_hash TEXT NULL,
  phone_hash TEXT NULL,
  session_id TEXT NULL,
  source_url TEXT NULL,
  user_agent TEXT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Upload tracking
  uploaded_to_google BOOLEAN NOT NULL DEFAULT false,
  upload_conversion_action TEXT NULL,
  uploaded_at TIMESTAMPTZ NULL,
  tied_to_order_id TEXT NULL,
  CONSTRAINT gclid_captures_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  -- FIX E2: capture must have at least one identifier to be linkable back to
  -- a Tray webhook. Capture with neither email nor phone is unusable garbage.
  CONSTRAINT gclid_captures_identifier_check
    CHECK (email_hash IS NOT NULL OR phone_hash IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_gclid_captures_gclid ON gclid_captures(gclid);
CREATE INDEX IF NOT EXISTS idx_gclid_captures_email_hash ON gclid_captures(email_hash, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_gclid_captures_phone_hash ON gclid_captures(phone_hash, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_gclid_captures_order_id ON gclid_captures(tied_to_order_id);
CREATE INDEX IF NOT EXISTS idx_gclid_captures_tenant_captured ON gclid_captures(tenant_id, captured_at DESC);

-- ============================================
-- 2. TRAY WEBHOOK EVENTS (idempotency)
-- ============================================
CREATE TABLE IF NOT EXISTS tray_webhook_events (
  -- event_id is the natural key — either X-Webhook-Id header from Tray or
  -- fallback sha256(body) computed at receive time.
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,  -- 'purchase' | 'lead' | 'capture'
  tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001',
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ NULL,
  error TEXT NULL,
  payload_excerpt JSONB NULL,
  CONSTRAINT tray_webhook_events_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX IF NOT EXISTS idx_tray_events_type_received ON tray_webhook_events(event_type, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_tray_events_tenant_received ON tray_webhook_events(tenant_id, received_at DESC);

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE gclid_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE tray_webhook_events ENABLE ROW LEVEL SECURITY;

-- FIX E1: use get_user_tenant_id() helper from migration 003 (consolidated
-- multi-tenant pattern) instead of obsolete current_setting('app.tenant_id').
-- Service role bypasses RLS by design (server-side inserts); anon/auth key
-- callers are gated by the user's active tenant via the helper.
DO $$ BEGIN
  CREATE POLICY gclid_captures_tenant_isolation ON gclid_captures
    FOR ALL
    USING (tenant_id = get_user_tenant_id());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY tray_webhook_events_tenant_isolation ON tray_webhook_events
    FOR ALL
    USING (tenant_id = get_user_tenant_id());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- 4. COMMENTS
-- ============================================
COMMENT ON TABLE gclid_captures IS 'Google Click IDs captured from tockscustom.com.br via client-side script. Used to tie Tray webhook pedido-pago/carrinho-abandonado events back to a gclid for Google Ads offline conversion upload.';
COMMENT ON TABLE tray_webhook_events IS 'Idempotency log for Tray webhook deliveries. Keyed by X-Webhook-Id header when present, else sha256(body). Prevents double-fire of offline conversion uploads during Tray retry cycles.';
COMMENT ON COLUMN gclid_captures.email_hash IS 'sha256(normalizeEmail(raw)) — same hashing as Meta CAPI. NEVER store raw email.';
COMMENT ON COLUMN gclid_captures.phone_hash IS 'sha256(normalizePhone(raw)) — E.164 BR-normalized. NEVER store raw phone.';
