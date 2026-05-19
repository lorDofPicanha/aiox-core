# CRM-1.3 — Schema v0 migrations + RLS policies + pgTAP tests

**Status:** 📋 ready · **Sprint:** 1 Alpha · **Effort:** 16h · **Agent:** @data-engineer

---

## User Story

**As a** data engineer projetando o CRM multi-tenant,
**I want** schema v0 com 10 tabelas core + RLS policies + testes pgTAP cobrindo isolamento entre tenants,
**so that** todo CRUD futuro seja seguro por construção (impossível cross-tenant leak por bug de código).

---

## Acceptance Criteria

- [ ] Migration `0001_initial.sql` cria 10 tabelas core (lista abaixo)
- [ ] Todas tabelas têm `tenant_id text NOT NULL` + index composto `(tenant_id, ...)`
- [ ] RLS habilitado em todas as 10 tabelas
- [ ] Policies SELECT/INSERT/UPDATE/DELETE definidas usando `current_setting('request.jwt.claims', true)::jsonb->>'tenant_id'`
- [ ] pgTAP tests cobrem 5+ scenarios cross-tenant leak (todos passam)
- [ ] Index em `(tenant_id, created_at DESC)` em tabelas hot (lead, deal, activity)
- [ ] Foreign keys com `ON DELETE CASCADE` onde apropriado
- [ ] Migration roda em <10s contra DB vazio
- [ ] Migration é idempotente (`CREATE TABLE IF NOT EXISTS`)
- [ ] Rollback documentado (mas não necessariamente automatizado)
- [ ] Seed mínimo: 2 tenants (tocks, bretda), 3 chart_of_accounts entries genérico

---

## Technical Notes

### Tabelas v0 (10 core)

```sql
-- 1. tenant — registro de cada tenant ativo
CREATE TABLE IF NOT EXISTS tenant (
  id              text PRIMARY KEY,                -- 'tocks', 'bretda', 'anipis'
  display_name    text NOT NULL,
  business_type   text NOT NULL,                   -- 'b2b_high_ticket', 'b2c'
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  config          jsonb NOT NULL DEFAULT '{}',     -- feature flags + custom config
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 2. user (gerenciado pelo Supabase Auth, referenciamos auth.users.id)
-- 3. tenant_membership — quem tem acesso a qual tenant + role
CREATE TABLE IF NOT EXISTS tenant_membership (
  tenant_id       text NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('owner', 'admin', 'vendedor', 'leitor')),
  invited_by      uuid REFERENCES auth.users(id),
  joined_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, user_id, role)
);

-- 4. contact — pessoa/empresa que entra em contato
CREATE TABLE IF NOT EXISTS contact (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       text NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  whatsapp_e164   text,                            -- +5511999998888
  email           citext,
  name            text,
  source          text,                            -- 'whatsapp_inbound', 'manual', 'import'
  source_ad       text,                            -- 'meta_carrossel_v3', 'google_pmax', etc
  gclid           text,                            -- Google Click ID
  fbc             text,                            -- Facebook click cookie
  fbp             text,                            -- Facebook browser ID
  metadata        jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, whatsapp_e164)
);
CREATE INDEX IF NOT EXISTS idx_contact_tenant_created ON contact(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_whatsapp ON contact(tenant_id, whatsapp_e164);

-- 5. pipeline — kanban de venda (configurável por tenant)
CREATE TABLE IF NOT EXISTS pipeline (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       text NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  name            text NOT NULL,                   -- 'Vendas Padrão'
  is_default      boolean NOT NULL DEFAULT false,
  archived_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pipeline_tenant ON pipeline(tenant_id) WHERE archived_at IS NULL;

-- 6. pipeline_stage — colunas do kanban
CREATE TABLE IF NOT EXISTS pipeline_stage (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       text NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  pipeline_id     uuid NOT NULL REFERENCES pipeline(id) ON DELETE CASCADE,
  name            text NOT NULL,                   -- 'Novo', 'Qualificado', 'Proposta', 'Ganho', 'Perdido'
  sort_order      integer NOT NULL,
  is_won          boolean NOT NULL DEFAULT false,
  is_lost         boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 7. deal — oportunidade de venda
CREATE TABLE IF NOT EXISTS deal (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       text NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  contact_id      uuid NOT NULL REFERENCES contact(id) ON DELETE CASCADE,
  pipeline_id     uuid NOT NULL REFERENCES pipeline(id),
  stage_id        uuid NOT NULL REFERENCES pipeline_stage(id),
  owner_user_id   uuid REFERENCES auth.users(id),
  title           text NOT NULL,
  value_brl       numeric(15,2),
  qualified_at    timestamptz,                     -- quando virou Lead Qualificado (trigger CAPI)
  won_at          timestamptz,                     -- quando fechou venda
  lost_at         timestamptz,
  lost_reason     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_deal_tenant_stage ON deal(tenant_id, stage_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_qualified ON deal(tenant_id, qualified_at) WHERE qualified_at IS NOT NULL;

-- 8. activity — interações (WhatsApp message, call note, email)
CREATE TABLE IF NOT EXISTS activity (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       text NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  contact_id      uuid REFERENCES contact(id) ON DELETE CASCADE,
  deal_id         uuid REFERENCES deal(id) ON DELETE CASCADE,
  type            text NOT NULL CHECK (type IN ('whatsapp_in', 'whatsapp_out', 'note', 'call', 'email')),
  content         text NOT NULL,
  metadata        jsonb NOT NULL DEFAULT '{}',     -- waba_message_id, audio_url, etc
  created_by      uuid REFERENCES auth.users(id),
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_contact ON activity(tenant_id, contact_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_deal ON activity(tenant_id, deal_id, created_at DESC) WHERE deal_id IS NOT NULL;

-- 9. consent_event — LGPD ledger
CREATE TABLE IF NOT EXISTS consent_event (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       text NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
  contact_id      uuid NOT NULL REFERENCES contact(id) ON DELETE CASCADE,
  type            text NOT NULL CHECK (type IN ('opt_in', 'opt_out', 'revoke', 'export_request', 'erase_request')),
  source          text NOT NULL,                   -- 'ctw_click', 'form', 'manual'
  payload         jsonb NOT NULL DEFAULT '{}',
  occurred_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consent_contact ON consent_event(tenant_id, contact_id, occurred_at DESC);

-- 10. audit_log — toda ação CRUD via middleware
CREATE TABLE IF NOT EXISTS audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       text NOT NULL,                   -- pode ser NULL no contexto admin?
  user_id         uuid REFERENCES auth.users(id),
  action          text NOT NULL CHECK (action IN ('view', 'create', 'update', 'delete', 'export')),
  resource_type   text NOT NULL,                   -- 'contact', 'deal', 'activity', etc
  resource_id     uuid,
  ip              inet,
  user_agent      text,
  payload_before  jsonb,
  payload_after   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_tenant_created ON audit_log(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_log(tenant_id, resource_type, resource_id);
```

### RLS Policies template

```sql
-- Enable RLS em todas
ALTER TABLE tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
-- ... (todas 10)

-- Helper: extrai tenant_id do JWT claim
CREATE OR REPLACE FUNCTION auth_tenant_id() RETURNS text AS $$
  SELECT current_setting('request.jwt.claims', true)::jsonb->>'tenant_id';
$$ LANGUAGE sql STABLE;

-- Helper: usuário tem role X no tenant atual?
CREATE OR REPLACE FUNCTION auth_has_role(required_role text) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_membership
    WHERE tenant_id = auth_tenant_id()
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin', required_role)
  );
$$ LANGUAGE sql STABLE;

-- Policy genérica (aplica a contact, deal, activity, etc):
CREATE POLICY tenant_isolation_select ON contact FOR SELECT
  USING (tenant_id = auth_tenant_id());

CREATE POLICY tenant_isolation_insert ON contact FOR INSERT
  WITH CHECK (tenant_id = auth_tenant_id());

CREATE POLICY tenant_isolation_update ON contact FOR UPDATE
  USING (tenant_id = auth_tenant_id())
  WITH CHECK (tenant_id = auth_tenant_id());

CREATE POLICY tenant_isolation_delete ON contact FOR DELETE
  USING (tenant_id = auth_tenant_id() AND auth_has_role('admin'));
```

Repete pra cada tabela. `tenant_membership` tem policy especial: SELECT permite ver memberships do próprio tenant + INSERT/DELETE só `owner/admin`.

### pgTAP tests (5+ scenarios)

```sql
-- supabase/tests/0001_rls.sql
BEGIN;
SELECT plan(8);

-- Setup: 2 tenants, 2 users
INSERT INTO tenant (id, display_name, business_type) VALUES
  ('tocks', 'Tocks Mobiliário', 'b2b_high_ticket'),
  ('bretda', 'Bretda Bilhares', 'b2b_high_ticket');

-- Tests:
-- 1. User com JWT tenant_id='tocks' vê só contatos tocks
SET request.jwt.claims = '{"tenant_id": "tocks", "sub": "user-uuid"}';
SELECT is(
  (SELECT count(*)::int FROM contact WHERE tenant_id != 'tocks'),
  0,
  'tocks user cannot see other tenant contacts'
);

-- 2. INSERT com tenant_id != JWT.tenant_id bloqueado
SELECT throws_ok(
  $$ INSERT INTO contact (tenant_id, whatsapp_e164) VALUES ('bretda', '+5511999999999') $$,
  'new row violates row-level security policy',
  'cross-tenant insert blocked'
);

-- 3-5: UPDATE / DELETE / SELECT pra outros tenants
-- 6. Helper auth_tenant_id() retorna valor correto
-- 7. Anon user (sem JWT) é bloqueado em select
-- 8. owner role pode CRUD, vendedor não pode delete

SELECT * FROM finish();
ROLLBACK;
```

Roda via `supabase test db` ou `pg_prove`.

---

## Dependencies

- ✅ **CRM-1.1** (Supabase project criado)
- 🔄 Paralelo com CRM-1.2 (auth) — mas hook custom_access_token_hook precisa de `tenant_membership` table existir antes de funcionar

---

## Definition of Done

- [ ] PR `feat/crm-1.3-schema` mergeado
- [ ] Migration aplicada em Supabase prod sa-east-1
- [ ] 8 pgTAP tests passando
- [ ] EXPLAIN ANALYZE de query típica em contact (`WHERE tenant_id='tocks' ORDER BY created_at DESC LIMIT 50`) <50ms
- [ ] Documentação `docs/db-schema-v0.md` com ERD textual + decisões
- [ ] Code review @architect — 1 approval
- [ ] Backup automático Supabase ativo (PITR habilitado)

---

## File List

```
apps/crm/supabase/
├── migrations/
│   └── 0001_initial.sql
├── tests/
│   └── 0001_rls.sql
└── seed.sql                            # 2 tenants + chart_of_accounts seed

apps/crm/docs/
└── db-schema-v0.md
```

---

## Riscos específicos

| Risco | Mitigação |
|-------|-----------|
| RLS performance ruim (>3min queries) | Index composto `(tenant_id, hot_column)` em todas hot tables. Run pgbench |
| Helper function `auth_tenant_id()` recompila a cada query | Marca como `STABLE` — Postgres cacheia dentro da transaction |
| pgTAP install não suportado Supabase managed | Backup: testes shell que rodam queries via psql + assert exit code |
| Migration parcial deixa schema inconsistente | Sempre em transaction (`BEGIN/COMMIT`). Backup pre-migration |
| Esquecer RLS em tabela nova futura | Code review checklist: "RLS habilitado? Policy SELECT/INSERT/UPDATE/DELETE?" |
| Service role bypassa RLS no client (vazamento) | Code review: service_role só em `/api/*` server, nunca em components |

---

*Story CRM-1.3 · Sprint 1 Alpha · scaffold gerado 2026-05-19*
