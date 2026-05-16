# CRM Novo — Architecture v1.0 Final

**Status:** Locked v1.0 — pós research/brainstorm/ultraplan/conclave
**Date:** 2026-05-15
**Owner:** Breno (lordofpicanha)

---

## 🎯 Architecture Statement (the Moat)

> **CRM Novo é uma plataforma multi-tenant cuja diferenciação central é o Bridge bidirecional Meta CAPI + Google offline conv com idempotency, dead-letter queue e audit trail completo.** Tudo o resto é commodity bem-feita.

**Tenants strategy:**
- Phase 1 primários: **Tocks** + **Bretda**
- Phase 2+ futuros (multi-tenant ready): qualquer novo negócio Breno criar. Onboarding <1 dia via arquitetura RLS. Não há tenant hardcoded.

**Stay in this circle:** WhatsApp inbox real-time + Pipeline + Bridge automático + LGPD + Multi-tenant RLS.
**Out of circle (defer ou never):** Lead scoring AI, sales bot, voice features, forecasting, custom workflow builders no-code, white-label venda externa.

---

## 1. System Architecture

### 1.1 High-Level (3-tier modular monolith)

```
┌──────────────────────────────────────────────────────────────────┐
│                    LAYER 1 — Browser (PWA)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Next.js 16 React 19 client                                │  │
│  │  ├─ Inbox view (default homepage)                          │  │
│  │  ├─ Conversation view                                       │  │
│  │  ├─ Pipeline kanban                                         │  │
│  │  ├─ Deal detail                                             │  │
│  │  ├─ Contacts list/detail                                    │  │
│  │  ├─ Reports                                                 │  │
│  │  ├─ Forms builder (V1)                                      │  │
│  │  └─ Admin/Settings                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│  Tailwind + shadcn/ui + Zustand (client state)                   │
│  Service Worker (offline cache last 100 msgs/conv)               │
│  Web Push API (notifications)                                    │
└─────────────────────────┬────────────────────────────────────────┘
                          │ HTTPS + JWT
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│         LAYER 2 — Next.js 16 (Vercel Pro Edge + Functions)        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Server Components + Route Handlers + Server Actions       │  │
│  │  Modules (bounded contexts):                                │  │
│  │  ├─ auth (Supabase Auth + JWT validation)                   │  │
│  │  ├─ tenants (CRUD + RLS context)                            │  │
│  │  ├─ contacts (dedupe by tenant_id + phone OR email)         │  │
│  │  ├─ deals + pipelines + stages                              │  │
│  │  ├─ activities (note/call/email/meeting/whatsapp_log)       │  │
│  │  ├─ whatsapp-receiver (webhook handler)                     │  │
│  │  ├─ whatsapp-sender (Cloud API client + templates)          │  │
│  │  ├─ inbox + conversation (real-time channels)               │  │
│  │  ├─ conversion-bridge (orchestrator — calls Inngest)        │  │
│  │  ├─ consent-ledger (LGPD)                                   │  │
│  │  ├─ audit-log (every mutation)                              │  │
│  │  ├─ reports (aggregations)                                  │  │
│  │  └─ admin (settings, DPA, ROPA)                             │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────┬──────────────────────┬──────────────────────┬─────────────┘
       │                      │                      │
       ▼                      ▼                      ▼
┌─────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│   Supabase   │    │     Inngest      │    │  External APIs       │
│  Postgres    │    │  (Workflows)     │    │  ├─ Meta WhatsApp    │
│  sa-east-1   │    │                  │    │  │  Cloud API        │
│              │    │  Workflows:      │    │  ├─ Meta CAPI        │
│  ├─ tables  │    │  ├─ lead.created │    │  ├─ Google Ads OC API│
│  ├─ RLS     │    │  ├─ deal.qual    │    │  ├─ Resend (email)   │
│  ├─ Realtime│    │  ├─ deal.closed  │    │  └─ Google Calendar  │
│  ├─ Auth    │    │  ├─ lgpd.erase   │    │                      │
│  └─ Storage │    │  └─ reconcile    │    │  All idempotent      │
│             │    │     cron daily   │    │  + dead-letter queue │
└─────────────┘    └──────────────────┘    └──────────────────────┘
```

### 1.2 Bounded Contexts (DDD-light)

| Context | Responsibility | Public API | Internal |
|---------|----------------|-----------|----------|
| **auth-tenants** | Authentication + tenant context | Supabase Auth + middleware | JWT claims, RLS setup |
| **crm-core** | Contacts + deals + pipelines + activities | REST + Server Actions | RLS-aware queries |
| **messaging** | WhatsApp webhook + send + inbox | Webhook receiver + send API | Multi-number routing, dedupe |
| **conversion-bridge** | Lead Qualified → Meta + Google upload | Internal events emitter | Inngest workflows, idempotency, DLQ |
| **lgpd-compliance** | Consent + audit + ROPA + erasure | LGPD-specific endpoints | Append-only tables, cron jobs |
| **reports** | Funnel + source + time metrics | Reports API | Pre-computed materialized views |

---

## 2. Data Model

### 2.1 Core Schema (Postgres + RLS)

```sql
-- ===== Multi-tenant foundation =====
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,                -- 'tocks', 'bretda', futuros: any new business
  name text NOT NULL,
  legal_name text NOT NULL,                 -- 'Tocks Custom Móveis Ltda', etc
  cnpj text,
  owner_user_id uuid NOT NULL,
  whatsapp_phone_id text,                   -- Meta WABA phone ID (per tenant)
  settings jsonb DEFAULT '{}',              -- per-tenant config (timezone, currency, etc)
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at timestamptz DEFAULT now()
);
-- Multi-tenant ready: qualquer novo negócio Breno = INSERT INTO tenants + onboarding workflow

CREATE TABLE tenant_users (
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,                    -- Supabase Auth user
  role text CHECK (role IN ('owner', 'admin', 'sales')),
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  PRIMARY KEY (tenant_id, user_id)
);

-- ===== Contacts (deduped by tenant_id + phone OR email) =====
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  phone text,                               -- E.164 format
  email text,
  name text,
  source text,                              -- 'ctw_ad_meta', 'form_lp', 'manual', etc
  source_metadata jsonb,                    -- ad_id, campaign_id, form_id
  consent_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_contacts_phone ON contacts(tenant_id, phone) WHERE phone IS NOT NULL;
CREATE UNIQUE INDEX idx_contacts_email ON contacts(tenant_id, email) WHERE email IS NOT NULL;
CREATE INDEX idx_contacts_tenant ON contacts(tenant_id);
CREATE INDEX idx_contacts_source ON contacts(tenant_id, source);

-- ===== Pipelines + Deals =====
CREATE TABLE pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  name text NOT NULL,
  is_default boolean DEFAULT false,
  stages jsonb NOT NULL,                    -- [{id, name, probability}, ...]
  created_at timestamptz DEFAULT now()
);

CREATE TABLE deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  contact_id uuid NOT NULL REFERENCES contacts(id),
  pipeline_id uuid NOT NULL REFERENCES pipelines(id),
  stage_id text NOT NULL,                   -- references pipeline.stages.id
  title text NOT NULL,
  value numeric(12,2),
  expected_close_date date,
  assigned_user_id uuid,
  status text DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
  win_loss_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

CREATE INDEX idx_deals_tenant ON deals(tenant_id);
CREATE INDEX idx_deals_contact ON deals(tenant_id, contact_id);
CREATE INDEX idx_deals_stage ON deals(tenant_id, pipeline_id, stage_id, status);
CREATE INDEX idx_deals_assigned ON deals(tenant_id, assigned_user_id);

CREATE TABLE deal_stage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  from_stage_id text,
  to_stage_id text NOT NULL,
  changed_by_user_id uuid,
  changed_at timestamptz DEFAULT now(),
  reason text
);

CREATE INDEX idx_deal_history_deal ON deal_stage_history(deal_id, changed_at DESC);

-- ===== Activities (note, call, email, meeting) =====
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  contact_id uuid REFERENCES contacts(id),
  deal_id uuid REFERENCES deals(id),
  type text NOT NULL CHECK (type IN ('note', 'call', 'email', 'meeting', 'whatsapp_summary', 'system')),
  content text,
  metadata jsonb,
  user_id uuid,                             -- who performed
  occurred_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activities_contact ON activities(tenant_id, contact_id, occurred_at DESC);
CREATE INDEX idx_activities_deal ON activities(tenant_id, deal_id, occurred_at DESC);

-- ===== WhatsApp messages (separate table for perf) =====
CREATE TABLE whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  contact_id uuid NOT NULL REFERENCES contacts(id),
  message_id text UNIQUE NOT NULL,          -- Meta WA message_id (idempotency)
  direction text CHECK (direction IN ('inbound', 'outbound')),
  type text NOT NULL,                       -- text, image, document, audio, template
  content jsonb NOT NULL,                   -- {body, media_url, template_id, vars}
  status text,                              -- sent, delivered, read, failed
  template_id text,
  raw_webhook jsonb,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_wa_msgs_inbox ON whatsapp_messages(tenant_id, contact_id, occurred_at DESC);
CREATE INDEX idx_wa_msgs_tenant_time ON whatsapp_messages(tenant_id, occurred_at DESC);

-- ===== Conversion events (Bridge) =====
CREATE TABLE conversion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  deal_id uuid REFERENCES deals(id),
  contact_id uuid REFERENCES contacts(id),
  event_type text NOT NULL,                 -- 'lead', 'lead_qualified', 'purchase'
  platform text NOT NULL,                   -- 'meta_capi', 'google_offline_conv'
  external_id text NOT NULL,                -- idempotency key (deal.id + event_type)
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'failed', 'dead_lettered')),
  payload jsonb NOT NULL,
  upload_response jsonb,
  retry_count int DEFAULT 0,
  next_retry_at timestamptz,
  uploaded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_conv_events_idem ON conversion_events(tenant_id, external_id, platform);
CREATE INDEX idx_conv_events_pending ON conversion_events(status, next_retry_at) WHERE status IN ('pending', 'failed');

-- ===== LGPD: Consent ledger (APPEND-ONLY) =====
CREATE TABLE consent_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  contact_id uuid NOT NULL REFERENCES contacts(id),
  consent_type text NOT NULL,               -- 'marketing', 'transactional', 'profiling'
  action text NOT NULL CHECK (action IN ('granted', 'revoked')),
  purpose text NOT NULL,                    -- 'CTW Ad ID 120246823605310268', 'form_lp_x'
  legal_basis text NOT NULL,                -- 'consentimento', 'legitimo_interesse', 'execucao_contrato'
  evidence jsonb,                           -- {ip, user_agent, source_url, ad_id}
  granted_at timestamptz DEFAULT now()
);

CREATE INDEX idx_consent_contact ON consent_ledger(tenant_id, contact_id, granted_at DESC);
-- NOTE: NO DELETE allowed on this table (append-only), enforced by trigger

-- ===== Audit log (APPEND-ONLY, every mutation) =====
CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  user_id uuid,
  action text NOT NULL,                     -- 'contact.create', 'deal.update', 'whatsapp.send'
  resource_type text NOT NULL,
  resource_id uuid,
  before_state jsonb,
  after_state jsonb,
  ip_address inet,
  user_agent text,
  occurred_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_tenant_time ON audit_log(tenant_id, occurred_at DESC);
CREATE INDEX idx_audit_resource ON audit_log(tenant_id, resource_type, resource_id);
```

### 2.2 RLS Policies (critical sample)

```sql
-- All tables: enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
-- ... (etc for all tables)

-- Helper: get tenant_id from JWT
CREATE OR REPLACE FUNCTION auth.tenant_id() RETURNS uuid AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Tenant isolation policy (applies to most tables)
CREATE POLICY tenant_isolation ON contacts
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

CREATE POLICY tenant_isolation ON deals
  USING (tenant_id = auth.tenant_id())
  WITH CHECK (tenant_id = auth.tenant_id());

-- Role-based deal access (sales sees only own deals)
CREATE POLICY sales_own_deals ON deals
  FOR SELECT USING (
    tenant_id = auth.tenant_id()
    AND (
      auth.jwt() -> 'app_metadata' ->> 'role' IN ('owner', 'admin')
      OR assigned_user_id = auth.uid()
    )
  );

-- WhatsApp messages: same as deals
CREATE POLICY tenant_isolation ON whatsapp_messages
  USING (tenant_id = auth.tenant_id());

-- Append-only enforce on consent_ledger
CREATE POLICY no_modify_consent ON consent_ledger
  FOR UPDATE USING (false);

CREATE POLICY no_delete_consent ON consent_ledger
  FOR DELETE USING (false);
```

### 2.3 pgTAP Tests (CI mandatory)

```sql
-- Sample cross-tenant assertion
SELECT plan(3);

-- Setup: 2 tenants, 2 contacts each
INSERT INTO tenants ...;
INSERT INTO contacts ...;

-- Test 1: tenant_a sees only own contacts
SET ROLE tenant_a_user;
SELECT bag_eq(
  'SELECT COUNT(*) FROM contacts',
  'VALUES (2)',
  'Tenant A sees 2 contacts (own)'
);

-- Test 2: tenant_a CANNOT see tenant_b contacts
SELECT is_empty(
  'SELECT * FROM contacts WHERE tenant_id = (SELECT id FROM tenants WHERE slug = ''bretda'')',
  'Tenant A returns empty for Bretda data'
);

-- Test 3: insert into other tenant blocked
SELECT throws_ok(
  'INSERT INTO contacts (tenant_id, phone) VALUES ((SELECT id FROM tenants WHERE slug = ''bretda''), ''+5511...'')',
  '42501',                                  -- insufficient privilege
  'Tenant A cannot insert into Bretda contacts'
);

SELECT * FROM finish();
```

---

## 3. Workflows (Inngest)

### 3.1 `lead.created.v1` workflow

```typescript
inngest.createFunction(
  { id: "lead-created-v1" },
  { event: "crm/lead.created" },
  async ({ event, step }) => {
    const { tenantId, contactId, source, sourceMetadata } = event.data;

    // Step 1: Capture consent (CTW = implicit consent + log Ad ID)
    await step.run("log-consent", async () => {
      return logConsent({ tenantId, contactId, source, sourceMetadata });
    });

    // Step 2: Fire Meta CAPI 'Lead' event (idempotent)
    const capiResult = await step.run("meta-capi-lead", async () => {
      return uploadMetaCAPI({
        tenantId,
        eventName: "Lead",
        externalId: `lead_${contactId}`,
        userData: { /* SHA-256 hashed */ },
        customData: sourceMetadata,
      });
    });

    // Step 3: Assign sales user (round-robin)
    await step.run("assign-sales", async () => {
      return assignSalesUser(tenantId, contactId);
    });

    // Step 4: Send notification
    await step.run("notify", async () => {
      return notifyAssignedUser({ tenantId, contactId });
    });

    return { capiResult };
  }
);
```

### 3.2 `deal.qualified.v1` workflow

```typescript
inngest.createFunction(
  { id: "deal-qualified-v1", retries: 5 },
  { event: "crm/deal.qualified" },
  async ({ event, step }) => {
    const { tenantId, dealId, contactId, value } = event.data;

    // Step 1: Meta CAPI 'Lead Qualified' (custom event)
    const metaResult = await step.run("meta-capi-qualified", async () => {
      return uploadMetaCAPI({
        tenantId,
        eventName: "LeadQualified",
        externalId: `qualified_${dealId}`,    // idempotency key
        value,
        userData: { /* hashed */ },
      });
    });

    // Step 2: Google Ads Offline Conversion Import (batch enqueue)
    const googleResult = await step.run("google-oc-enqueue", async () => {
      return enqueueGoogleOC({
        tenantId,
        dealId,
        eventName: "Lead Qualificado",
        value,
        conversionTime: new Date(),
      });
    });

    // Step 3: Update conversion_events status
    await step.run("update-status", async () => {
      return updateConversionEvents({
        tenantId,
        dealId,
        platforms: [{ platform: "meta_capi", result: metaResult }, { platform: "google_offline_conv", result: googleResult }],
      });
    });

    return { metaResult, googleResult };
  }
);
```

### 3.3 `reconcile.daily.v1` workflow (cron)

```typescript
inngest.createFunction(
  { id: "reconcile-daily" },
  { cron: "0 6 * * *", timezone: "America/Sao_Paulo" },
  async ({ step }) => {
    // For each tenant: count CRM events vs Meta CAPI vs Google OC
    // Alert if mismatch >5%
    // F-CRM-Upload-Void detection definitivamente resolved
  }
);
```

---

## 4. Frontend Architecture

### 4.1 Routes (Next.js 16 App Router)

```
app/
├─ layout.tsx                  # Root layout + theme
├─ page.tsx                    # Redirect to /inbox or /onboarding
├─ (auth)/
│  ├─ login/page.tsx
│  └─ callback/route.ts        # OAuth callback
├─ (app)/                      # Auth required
│  ├─ layout.tsx               # Sidebar nav + tenant selector
│  ├─ inbox/
│  │  ├─ page.tsx              # Inbox list (homepage)
│  │  └─ [contactId]/page.tsx  # Conversation view
│  ├─ pipeline/
│  │  ├─ page.tsx              # Kanban
│  │  └─ [dealId]/page.tsx     # Deal detail
│  ├─ contacts/
│  │  ├─ page.tsx              # List
│  │  └─ [contactId]/page.tsx  # Detail
│  ├─ reports/page.tsx
│  ├─ admin/
│  │  ├─ settings/page.tsx
│  │  ├─ users/page.tsx
│  │  ├─ pipelines/page.tsx
│  │  └─ lgpd/
│  │     ├─ ropa/page.tsx
│  │     └─ requests/page.tsx
│  └─ onboarding/page.tsx
└─ api/
   ├─ webhooks/
   │  └─ whatsapp/route.ts     # Meta WhatsApp webhook
   ├─ inngest/route.ts         # Inngest endpoint
   ├─ lgpd/
   │  ├─ access/route.ts       # Right to access
   │  ├─ erase/route.ts        # Right to erasure
   │  └─ ropa/route.ts         # ROPA download
   └─ whatsapp/
      ├─ send/route.ts
      └─ smoke-test/route.ts   # KR pattern prevention
```

### 4.2 State Management

- **Server state:** Supabase Realtime subscriptions + Server Components
- **Client state:** Zustand store (active conversation, draft message, filters)
- **Form state:** react-hook-form + zod validation
- **Optimistic updates:** Server Actions com optimistic UI

---

## 5. Security Architecture

### 5.1 Authentication & Authorization

```
User → Supabase Auth (magic link / Google OAuth)
       ↓
       JWT generated with custom claim 'tenant_id' (via Auth Hook)
       ↓
       Browser stores JWT (httpOnly cookie via Supabase SDK)
       ↓
       Each request: JWT → middleware verifies + injects tenant_id
       ↓
       Postgres queries: RLS uses auth.jwt() → auth.tenant_id() helper
```

### 5.2 Defense in Depth

| Layer | Control |
|-------|---------|
| Network | HTTPS only, Vercel WAF, rate limiting per IP |
| Application | Zod validation all inputs, CSRF tokens, OWASP Top 10 |
| Database | RLS policies + pgTAP tests + service_role minimal |
| Audit | Every mutation logs to audit_log (append-only) |
| Monitoring | Sentry + Supabase logs + custom alert rules |
| Backup | Supabase Pro PITR (7 days) + nightly logical dump |
| LGPD | Consent ledger + 15d SLA monitor + 72h breach runbook |

### 5.3 Secrets Management

- Supabase keys (anon + service_role): Vercel env vars
- Meta WhatsApp tokens: Vercel env vars + rotation quarterly
- Webhook signing: HMAC SHA-256 with secret per tenant
- Internal API keys: rotated quarterly, audit log every use

---

## 6. Integration Architecture

### 6.1 WhatsApp Cloud API (direto, NÃO BSP)

```
Tocks phone (+55 47 3041-9811) registered Meta Cloud API
  ↓
Display Name approved (Tocks Custom Móveis)
  ↓
HSM templates approved (5-10 initial)
  ↓
Webhook URL: https://crm.synkra.com.br/api/webhooks/whatsapp
  ↓
Signature: SHA-256 HMAC verified with WEBHOOK_SECRET_TOCKS
  ↓
Each tenant has own phone_id + webhook_secret + display_name
```

### 6.2 Meta CAPI

```
Inngest workflow → Meta CAPI POST /events
  Headers: access_token (per tenant)
  Body: {
    data: [{
      event_name: "LeadQualified",
      event_time: unix,
      event_source_url: ...,
      action_source: "system_generated",
      user_data: { em: sha256, ph: sha256, fbc, fbp },
      custom_data: { value, currency },
      event_id: "qualified_${deal.id}"  // idempotency
    }]
  }
```

### 6.3 Google Ads Offline Conversion Import

```
Inngest workflow → Google Ads API
  Upload conversion: ConversionUploadService.UploadClickConversions
  Batch up to 2000 conversions per call
  Conversion action: "Lead Qualificado" (resource name per account)
  GCLID (preferred) OR enhanced conversions (email/phone hashed)
  Conversion DateTime: ISO 8601
  Conversion value: BRL
  External attribution model: per tenant config
```

---

## 7. Deployment & Operations

### 7.1 Hosting

| Component | Provider | Plan |
|-----------|----------|------|
| Frontend + Functions | Vercel | Pro $20/mo |
| Database + Auth + Realtime + Storage | Supabase | Pro $25/mo (sa-east-1) |
| Workflows | Inngest | Free → Team if >100k steps/mo |
| Email | Resend | Free → Pro $20/mo |
| Monitoring | Sentry | Free tier |
| **Total** | | **~$70/mo + WhatsApp usage** |

### 7.2 CI/CD

- GitHub Actions: lint + typecheck + unit + pgTAP + integration on PR
- Playwright E2E: critical flows on main merge
- Vercel preview per PR
- Supabase migrations via CLI (`supabase db push` only on green CI)

### 7.3 Observability

- Sentry: error tracking + performance
- Supabase Logs: SQL slow queries
- Inngest: workflow runs visible per tenant
- Custom dashboard: conversion event reconcile daily

---

## 8. Architectural Decisions (ADR list)

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Multi-tenant RLS single-DB (vs schema-per-tenant) | ✅ Locked |
| ADR-002 | WhatsApp Cloud API direto (vs BSP) | ✅ Locked |
| ADR-003 | Inngest workflows (vs BullMQ) | ✅ Locked |
| ADR-004 | Supabase região sa-east-1 (vs us-east-1) | ✅ Locked |
| ADR-005 | Mobile PWA first (vs native React Native) | ✅ Locked |
| ADR-006 | Inbox-first homepage (vs Pipeline-first) | ✅ Locked |
| ADR-007 | Modular monolith (vs microservices) | ✅ Locked |
| ADR-008 | Append-only consent_ledger + audit_log | ✅ Locked |

---

## 9. Architecture Constraints

**Non-negotiable:**
- Every table has `tenant_id` + RLS enabled
- Every mutation logged to `audit_log`
- Every external API call idempotent (Meta CAPI, Google OC)
- `consent_ledger` append-only (DB-enforced)
- pgTAP cross-tenant tests in CI

**Encouraged:**
- Server Components default, Client Components opt-in
- Inngest for >30s operations
- Supabase Realtime for live updates
- TypeScript strict mode

**Forbidden Phase 1:**
- Bypass RLS via service_role in user-facing routes
- Schema migration in prod UI
- Hard delete on append-only tables
- Cross-tenant queries without explicit assertion

---

*Architecture v1.0 Final | CRM Novo | Orion 2026-05-15*
