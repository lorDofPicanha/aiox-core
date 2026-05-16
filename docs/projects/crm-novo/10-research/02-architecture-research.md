# CRM Novo — Architecture Research

**Author:** Aria (Architect)
**Date:** 2026-05-15
**Project:** crm-novo (greenfield, custom build)
**Stack hypothesis (a validar):** Next.js 16 + Supabase + WhatsApp Cloud API + Resend + Vercel
**Mission:** Substituir Sales AI deprecated. WhatsApp-first, Meta/Google offline conv bridge, LGPD-compliant, multi-tenant Tocks/Bretda/Vorza.

---

## 0. Executive Summary

| Eixo | Decisão recomendada | Confidence |
|------|---------------------|------------|
| Multi-tenancy | **RLS shared-schema com `tenant_id`** + `app.tenant_id` GUC injetado | HIGH |
| WhatsApp adapter | **Cloud API oficial direto (sem 3rd party)**, 1 WABA por tenant | HIGH |
| Webhook ingestion | **Queue-first** (pg-boss em Postgres) + worker out-of-band | HIGH |
| CAPI/GAds bridge | **Outbox pattern** com `event_id` UUID v4 determinístico | HIGH |
| Realtime inbox | **Supabase Realtime (broadcast + presence)** com fallback SSE | MEDIUM |
| Data residency | **Supabase região São Paulo (sa-east-1)** | HIGH |
| Tier inicial | **Supabase Pro $25/mo** até 100k MAU; Team $599 só quando SOC2 for requisito comercial | HIGH |
| Background jobs | **pg-boss** (Postgres-native) + worker dedicado Railway, NÃO trigger.dev | MEDIUM |

**Custo all-in mensal estimado (3 tenants, fase 1):** Supabase Pro $25 + Vercel Pro $20 + Railway worker $5 + Resend $20 + WhatsApp Cloud API conversation-based (~R$200-500) = **~$70 USD + R$300-500 BR**.

---

## 1. Multi-tenant Patterns Supabase

### 1.1 Três modelos avaliados

| Modelo | Isolamento | Custo | Operação | Cross-tenant analytics |
|--------|-----------|-------|----------|------------------------|
| **A. RLS shared-schema** (tenant_id em todas tabelas) | Lógico (DB-enforced) | $$ (1 projeto Supabase) | Simples | Trivial (SQL) |
| **B. Schema-per-tenant** (1 schema Postgres por tenant) | Físico-lógico (separação Postgres) | $$$ (mesmo projeto, migrations N×) | Médio (migration por schema) | Complexa (UNION ALL views) |
| **C. Database-per-tenant** (1 projeto Supabase por tenant) | Físico (DBs separados) | $$$$ ($25 × N tenants) | Alto (deploy N) | Inviável sem ETL |

### 1.2 Recomendação: **RLS shared-schema**

**Por que RLS:**
- Tocks/Bretda/Vorza são tenants **internos** (mesmo dono Breno), não clientes externos
- LGPD não exige isolamento físico, exige rastreabilidade e RLS atende
- Cross-tenant analytics será crítico (comparar CPL Tocks vs Bretda no mesmo dashboard)
- Custo: $25/mo fixo vs $75/mo (3 projetos) — economia de $600/ano
- Migração futura para schema-per-tenant é viável (script `pg_dump --schema-only` + filtros tenant_id → INSERT into novo schema)

**Por que NÃO schema-per-tenant agora:**
- Overhead de manutenção (migrations replicadas 3× via script)
- Performance: cross-tenant queries com `UNION ALL` em 50 tabelas é lento e frágil
- Supabase Studio não tem UX boa para navegar múltiplos schemas

**Quando reconsiderar:**
- Quando vender CRM para tenant externo (cliente paying)
- Quando um tenant pedir DPA com isolamento físico (LGPD Art. 46 §1)
- Quando volume de um tenant >>> outros (Bretda 100x Vorza = noisy neighbor)

### 1.3 Implementação RLS — pattern canônico

**Tabela `tenants`:**
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,        -- 'tocks', 'bretda', 'vorza'
  name TEXT NOT NULL,
  data_residency TEXT DEFAULT 'BR', -- futura federação
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ            -- soft delete LGPD
);
```

**Junction `tenant_members`:**
```sql
CREATE TABLE tenant_members (
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner','admin','sales','observer')),
  PRIMARY KEY (tenant_id, user_id)
);
```

**Toda tabela de domínio tem `tenant_id NOT NULL`:**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  ...
);
CREATE INDEX leads_tenant_idx ON leads (tenant_id, created_at DESC);
```

**RLS policy padrão (replicar em TODAS tabelas):**
```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON leads
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
  ));

-- Service role bypass para workers (CAPI uploader, WhatsApp ingester)
-- service_role JWT bypassa RLS by design no Supabase
```

**Gotcha LGPD:** RLS policy deve ser por DEFAULT `FORCE` em tabelas com PII:
```sql
ALTER TABLE leads FORCE ROW LEVEL SECURITY;
```
Isso evita que `BYPASSRLS` accidental ou table owner anônimo escape.

### 1.4 Trade-offs em escala

| Carga | Comportamento esperado RLS |
|-------|---------------------------|
| 10 users/tenant × 3 tenants = 30 users | Trivial. <1ms overhead RLS check |
| 100 users × 3 = 300 users | OK. Índice `(tenant_id, *)` essencial. RLS ~2-5ms |
| 1000 users × 3 = 3000 users | Atenção: connection pool. Supavisor (PgBouncer) limita 200 conn em Pro. Considere `prepared statements` para RLS check |
| 10k+ users por tenant | Migrar para schema-per-tenant OU shard por tenant_id |

### 1.5 Cost Analysis Supabase 2026

| Plano | Preço | DB | MAU | Storage | Realtime conn | Backups | SOC2 |
|-------|-------|----|----|---------|----------------|---------|------|
| Free | $0 | 500MB | 50k | 1GB | 200 | 1d | ❌ |
| **Pro** | **$25/mo** | **8GB** | **100k** | **100GB** | **500** | **7d** | ❌ |
| Team | $599/mo | 8GB+ | 100k+ | 100GB+ | 500+ | 14d | ✅ |
| Enterprise | custom | custom | custom | custom | custom | 30d | ✅ HIPAA |

**Add-ons Pro:**
- Compute upgrade: Micro→Small→Medium→Large ($12-$110/mo extra)
- Storage extra: $0.021/GB/mo
- Bandwidth extra: $0.09/GB

**Recomendação para 3 tenants fase 1:** **Pro $25/mo, compute Micro default**. Upgrade Compute Small ($10/mo) quando avg query time > 50ms.

**Quando Team $599 vira obrigatório:**
- Quando vender CRM como SaaS B2B (DPA + SOC2)
- Quando 1 tenant pedir audit trail compliance (financeiro/saúde)
- Resposta atual: NÃO precisa — Tocks/Bretda/Vorza são todos do Breno

### 1.6 Migration path se precisar isolar tenant

**Cenário:** Bretda começa a fazer R$500k/mo, Breno vende parte e quer DB isolado por contrato.

**Procedimento (zero-downtime):**

1. Criar novo projeto Supabase `crm-bretda` (sa-east-1)
2. `pg_dump --data-only --table=leads --table=contacts --where="tenant_id='bretda-uuid'"` no projeto atual
3. Restore no projeto novo (sem coluna tenant_id ou com tenant_id default)
4. Dual-write window 7 dias (escrever em ambos)
5. Cutover DNS/feature flag para Bretda apontar para projeto novo
6. Stop dual-write, deletar `WHERE tenant_id='bretda-uuid'` no projeto compartilhado

**Custo da migração:** ~5 dias de engenharia + $25/mo novo projeto. Manageable.

---

## 2. WhatsApp Cloud API Integration Patterns

### 2.1 Por que Cloud API oficial (não 3rd party)

**Antecedente histórico (12/Mai):** KR perdeu 99 leads em 12 dias (R$437 ad spend) porque WABA Cloud API foi configurada com número errado pelo gestor antigo. Smoke test só pegou o bug depois. **Esse projeto inteiro é uma resposta a esse incidente.**

**Z-API, UnoFlow, MaytAPI, etc. são proibidos** porque:
- Não dão visibility de subscriber events (entrega, leitura, falha)
- Round-trip extra (lead bate no provider → provider bate no nosso webhook)
- Provider pode shadow-ban se outro cliente queima reputação
- Conta atrás de outra conta = perda de controle absoluto

**Cloud API direto:**
- Webhook entrega bruta do Meta para nosso endpoint
- Signature `X-Hub-Signature-256` HMAC-SHA256 verificável
- Sem 3rd party intermediário com data residency dúbio

### 2.2 Webhook architecture (signature verify, retry, dedupe)

**Endpoint:** `POST /api/whatsapp/webhook/[tenant_slug]`
**Validação GET:** `GET /api/whatsapp/webhook/[tenant_slug]?hub.mode=subscribe&hub.verify_token=...` (configurar token por tenant no Meta dashboard, salvar em `tenants.whatsapp_verify_token` encrypted).

**Fluxo crítico:**

```
Meta Cloud API
    │
    │ POST /api/whatsapp/webhook/tocks
    │ Header: X-Hub-Signature-256: sha256=...
    │
    ▼
[1] Read raw body (Buffer, NÃO JSON-parsed ainda)
[2] HMAC verify with tenant secret (constant-time compare)
[3] Parse JSON
[4] Extract message_id (entry[].changes[].value.messages[].id)
[5] INSERT INTO webhook_events (event_id, raw_payload, tenant_id, status='queued')
    ON CONFLICT (event_id) DO NOTHING   -- IDEMPOTÊNCIA via PK
[6] Return 200 OK immediately
[7] Worker pg-boss processa event async
```

**Crítico — STEPs 1-3 ordem fixa:**
- Body parser do Next.js precisa ser desligado nessa rota (config `bodyParser: false`) para acessar raw body
- HMAC tem que ser sobre raw bytes, não sobre re-serialized JSON
- Meta usa escape unicode em chars especiais — re-serializar quebra a signature

**Code pattern Next.js 16 (App Router):**
```typescript
// app/api/whatsapp/webhook/[tenant]/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // NÃO edge (precisa de crypto.timingSafeEqual)

export async function POST(req: Request, { params }: { params: { tenant: string } }) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-hub-signature-256');
  const tenant = await getTenantBySlug(params.tenant);
  const expected = 'sha256=' + crypto.createHmac('sha256', tenant.whatsapp_app_secret).update(rawBody).digest('hex');
  if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return new Response('invalid signature', { status: 403 });
  }
  const payload = JSON.parse(rawBody);
  // Insert into webhook_events with conflict-do-nothing
  await enqueueWebhookEvent(tenant.id, payload);
  return new Response('ok', { status: 200 });
}
```

**Retry behavior do Meta:**
- Não-200 ou timeout (>20s) = re-entrega exponential backoff até **7 dias**
- ATO: SEMPRE retornar 200 em <2s, processar async
- Logar falhas em `webhook_event_failures` para visibility, mas NUNCA bloquear o ACK

### 2.3 Message templates (HSM) workflow

**Quando precisa template:**
- Outbound fora da janela de 24h customer service window
- Marketing/auth/utility category (Meta classifica)

**Workflow:**
1. Criar template no WhatsApp Manager (Meta UI)
2. Aguardar approval (~1-24h)
3. Sincronizar para nossa DB: `whatsapp_templates(tenant_id, name, language, status, components_json, last_synced_at)`
4. Pollar Meta API `/{waba_id}/message_templates` a cada 1h (Vercel Cron) para detectar status flip
5. UI no CRM mostra status: PENDING / APPROVED / REJECTED / DISABLED

**Crítico — quality rating:**
- Template `marketing` enviado para inbox onde lead não opted-in → bloco automático
- Sempre opt-in tracked no `consents` table antes de mandar template marketing
- Pacing engine: respeitar messaging tier (1k→10k→100k→ilimitado)

### 2.4 Multi-number per tenant

**Tocks:** +55 47 3041-9811 (Phone Number ID `X`, WABA `Y`)
**Bretda:** TBD (futuro)
**Vorza:** TBD

**Schema:**
```sql
CREATE TABLE whatsapp_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  phone_number_id TEXT UNIQUE NOT NULL,  -- Meta PhoneNumberID
  waba_id TEXT NOT NULL,                  -- Meta WABA ID
  display_phone_number TEXT NOT NULL,     -- "+554730419811"
  app_secret TEXT NOT NULL,               -- HMAC secret (encrypted)
  verify_token TEXT NOT NULL,             -- Webhook verify token (encrypted)
  access_token_encrypted TEXT NOT NULL,   -- Long-lived system user token
  messaging_tier INT DEFAULT 1,
  quality_rating TEXT DEFAULT 'UNKNOWN',  -- GREEN/YELLOW/RED
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX whatsapp_numbers_phone_idx ON whatsapp_numbers (phone_number_id);
```

**Routing inbound:** lookup por `phone_number_id` → determina tenant_id automaticamente. Não confiar no path param da URL para identificar tenant — usar como sanity check apenas.

### 2.5 Conversation routing

**Recomendação MVP:** **round-robin assigned-agent com sticky** (1 lead = 1 sales agent até resolução).

```
Inbound message
   ↓
Lookup contact by from_phone_number
   ├─ EXISTS + assigned_agent_id != NULL → route to that agent
   ├─ EXISTS + assigned_agent_id IS NULL → assign via round-robin
   └─ NEW contact → create + assign via round-robin
```

**Não use AI routing em MVP** — risco do Sales AI deprecated. AI scoring vira opt-in futuro depois que CRM core estabilizar.

**Algoritmo round-robin:**
```sql
-- Tabela tenant_settings.routing_state: { last_assigned_agent_id: UUID, queue: [agent_ids] }
-- Worker pega next agent em round-robin SKIP_LOCKED, atualiza state
```

### 2.6 Cold start: primeiro msg de lead novo

**Fluxo:**
1. Webhook recebe `messages[]` com `from` (telefone)
2. `SELECT * FROM contacts WHERE phone_e164 = $1 AND tenant_id = $2`
3. NULL → criar contact com `status='NEW_LEAD'`, `source='whatsapp_inbound'`
4. Criar `conversation` com `state='OPEN'`, `last_msg_at=NOW()`
5. Notificar Realtime channel `tenant:{tenant_id}:inbox` (dashboards atualizam)
6. Atribuir agent via round-robin
7. Send Slack/Discord webhook se configurado (Bretda team alert)
8. Trigger conversion pipeline: se `referral.source_id` presente (ad referral), enqueue Meta CAPI Lead event

**Ad referral detection (CRÍTICO para conversion bridge):**

Meta Click-to-WhatsApp ads injetam `referral` object no primeiro message:
```json
"referral": {
  "source_url": "https://fb.me/...",
  "source_id": "120246823605310268",  // CAMPAIGN_ID
  "source_type": "ad",
  "headline": "...",
  "ctwa_clid": "ARABC..."   // CRÍTICO para CAPI dedupe
}
```

Salvar `ctwa_clid` no contact é OBRIGATÓRIO — é o link entre o clique do ad e a conversão downstream.

### 2.7 Rate limits + Tier progression

| Tier | Conversations/24h (new) | Como subir |
|------|------------------------|-----------|
| Unverified | 250 | Verify business |
| Tier 1 | 1k | Verified + 50% utilization 7d + quality GREEN |
| Tier 2 | 10k | Manter Tier 1 condições |
| Tier 3 | 100k | Manter Tier 2 condições |
| Tier 4 | unlimited | Manter Tier 3 condições |

**Cloud API rate limit técnico (independente do tier):**
- 80 msgs/sec por phone_number_id default
- 1000 msgs/sec após Tier 3

**Pacing engine no CRM:**
- Rate limiter por `phone_number_id` usando Redis (Upstash) ou Postgres advisory locks
- Outbound queue com per-tenant priority
- Burst control: nunca mais de 50 msgs/sec mesmo em Tier 4 (anti ban heuristic)

### 2.8 Media storage

**Recomendação:** **Supabase Storage** (não S3 separado).

**Motivos:**
- Já está no stack, integra com RLS nativo (`storage.objects` policies por tenant_id)
- Custo $0.021/GB/mo vs S3 $0.023 + transfer fees
- CDN edge embutido (Vercel + Supabase global edge)
- Pre-signed URLs com expiração nativa

**Schema:**
```sql
CREATE TABLE whatsapp_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  message_id UUID REFERENCES messages(id),
  meta_media_id TEXT NOT NULL,        -- Meta CDN ID
  mime_type TEXT NOT NULL,
  size_bytes BIGINT,
  storage_path TEXT NOT NULL,          -- supabase://media/{tenant_id}/{uuid}.{ext}
  downloaded_at TIMESTAMPTZ,
  hash_sha256 TEXT,                    -- dedup intra-tenant
  UNIQUE (tenant_id, hash_sha256)
);
```

**Worker download flow:**
1. Webhook entrega `messages[].image.id` (Meta media ID)
2. Worker pg-boss faz `GET /{media_id}` no Graph API → obtém signed URL
3. Download bytes
4. Upload Supabase Storage `media/{tenant_id}/{uuid}.{ext}`
5. UPDATE message com storage_path
6. Disparar virus scan (ClamAV via Railway worker) — defer fase 2

**Retention:** Meta CDN expira em 30 dias. Download obrigatório nas primeiras 24h.

---

## 3. Meta CAPI + Google Offline Conv Bridge Architecture

### 3.1 Lead Qualificado event spec (deduplicate via external_id + event_id)

**Schema central:**
```sql
CREATE TABLE conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  event_id TEXT NOT NULL,              -- Determinístico UUID v5 = hash(lead_id, event_name, stage_change_ts)
  event_name TEXT NOT NULL,            -- 'Lead' | 'LeadQualified' | 'Purchase'
  lead_id UUID NOT NULL REFERENCES leads(id),
  stage_change_id UUID,                -- ref para audit trail
  -- Identifiers
  external_id TEXT NOT NULL,           -- = lead_id (UUID stringificado)
  email_sha256 TEXT,
  phone_sha256 TEXT,
  fbp TEXT,                            -- _fbp cookie capturado no opt-in
  fbc TEXT,                            -- _fbc cookie OR fb.1.{ts}.{ctwa_clid}
  gclid TEXT,
  -- Platforms
  meta_status TEXT DEFAULT 'PENDING',  -- PENDING|SENT|ACK|FAILED|DEDUPED
  google_status TEXT DEFAULT 'PENDING',
  meta_attempts INT DEFAULT 0,
  google_attempts INT DEFAULT 0,
  meta_response JSONB,
  google_response JSONB,
  -- Timing
  event_time TIMESTAMPTZ NOT NULL,     -- moment of stage change (não NOW())
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_to_meta_at TIMESTAMPTZ,
  sent_to_google_at TIMESTAMPTZ,
  UNIQUE (tenant_id, event_id)         -- IDEMPOTÊNCIA
);
CREATE INDEX conversion_events_pending_idx ON conversion_events (tenant_id, meta_status, google_status)
  WHERE meta_status IN ('PENDING','FAILED') OR google_status IN ('PENDING','FAILED');
```

**Determinismo do event_id (crítico):**
```typescript
// Reproduzível: mesmo lead + mesmo stage = mesmo event_id (idempotente cross-restart)
const eventId = uuidv5(`${leadId}::${eventName}::${stageChangeIso}`, NAMESPACE_AIOS);
```

**Por que UUID v5 e não v4:**
- v4 random = se worker reiniciar mid-upload, pode gerar novo event_id e duplicar
- v5 determinístico = mesmo input gera mesmo output, dedup natural

### 3.2 Pipeline: CRM stage change → enqueue → batch upload → status report

**Outbox pattern:**

```
Stage change in CRM (e.g., lead.stage: 'qualified')
   ↓
Postgres trigger ON UPDATE OF stage
   ↓
INSERT INTO conversion_events (...) ON CONFLICT (tenant_id, event_id) DO NOTHING
   ↓
pg-boss worker polls conversion_events WHERE meta_status='PENDING'
   ↓
Batch up to 1000 events per tenant per platform
   ↓
   ├─ Meta CAPI: POST /{pixel_id}/events with data[] array
   └─ Google Ads API: UploadClickConversions with conversions[]
   ↓
Parse response, UPDATE conversion_events.meta_status='SENT' or 'FAILED'
   ↓
Failure → exponential backoff retry (max 5 attempts over 24h)
   ↓
Dead letter after 5 fails → manual review queue + Slack alert
```

**Postgres trigger (concrete):**
```sql
CREATE OR REPLACE FUNCTION enqueue_conversion_on_stage_change()
RETURNS TRIGGER AS $$
DECLARE
  v_event_id TEXT;
BEGIN
  IF NEW.stage = 'qualified' AND (OLD.stage IS NULL OR OLD.stage <> 'qualified') THEN
    v_event_id := uuid_generate_v5(
      'aios-conversion-ns'::uuid,
      NEW.id::text || '::LeadQualified::' || NEW.updated_at::text
    )::text;

    INSERT INTO conversion_events (tenant_id, event_id, event_name, lead_id, external_id, event_time, ...)
    VALUES (NEW.tenant_id, v_event_id, 'LeadQualified', NEW.id, NEW.id::text, NEW.updated_at, ...)
    ON CONFLICT (tenant_id, event_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3.3 Failure modes (KR WABA bug 12/Mai = razão #1 desse projeto)

**Modos de falha mapeados:**

| Modo | Detecção | Mitigação |
|------|----------|----------|
| Pixel não dispara client-side (LP quebrada) | `conversion_events` sem `fbp/fbc` em >10% | Daily report + Slack alert |
| WABA configurada com número errado (KR pattern) | Smoke test diário automatizado | Cron envia msg teste, verifica recebimento |
| Access token Meta expirou | Response 401 do Graph API | Auto-refresh + alert se refresh falhar |
| Google offline conv rejected (GCLID expired >90d) | Response `EXPIRED_CLICK` | Log + skip (não é erro do sistema) |
| Event_id duplicado (já enviado) | Response `Duplicate event` | UPDATE meta_status='DEDUPED' (success) |
| Conversion action ID errado | Response `INVALID_ARGUMENT` | Bloqueia tenant + alert manual |
| Pipeline travada (worker dead) | Lag > 5min em pending_events | Heartbeat check + auto-restart |

**Smoke test automatizado (anti-KR pattern):**
```typescript
// Cron daily 9am BRT
async function smokeTestWhatsApp(tenantId: string) {
  // 1. Send message via Cloud API to ops_phone_number
  // 2. Wait 60s
  // 3. Query messages WHERE tenant_id = tenantId AND from = ops_phone AND created_at > now() - interval '5 min'
  // 4. NOT FOUND → CRITICAL alert (WhatsApp pipeline broken)
}
```

### 3.4 Idempotency keys obrigatórios

**Layers:**
1. `webhook_events.event_id` (Meta msg ID) — dedup webhook
2. `conversion_events.event_id` (UUID v5 determinístico) — dedup upload
3. `messages.meta_message_id` UNIQUE — dedup mensagens
4. `idempotency_key` em POST inbound API (form lead capture) via header `Idempotency-Key`

**Pattern API endpoints com idempotência:**
```typescript
// POST /api/leads/intake
const idempotencyKey = req.headers.get('idempotency-key') ?? crypto.randomUUID();
const result = await db.query(`
  INSERT INTO leads (tenant_id, ..., idempotency_key)
  VALUES (...)
  ON CONFLICT (tenant_id, idempotency_key) DO UPDATE SET updated_at = NOW()
  RETURNING id, (xmax = 0) AS was_inserted
`);
// xmax=0 → INSERT novo. xmax≠0 → já existia.
```

### 3.5 Conversion lookback window (Meta 28d view / Google 90d)

| Plataforma | Click attribution | View attribution | Server upload window |
|-----------|-------------------|------------------|---------------------|
| Meta CAPI | 7d | 1d (default) ou 7d | **Upload até 7d after event_time** |
| Google Ads | 90d | N/A | **Upload até 90d after gclid click** |
| Google EC4L | 90d | N/A | Upload até 90d after lead form submit |

**Implicação para o CRM:**
- Stage change `qualified` deve disparar upload o mais rápido possível (SLA 5min)
- Para deals com closing >7d (Bretda, Tocks): Meta perde atribuição
- **Solução parcial Meta:** mandar evento `Lead` no opt-in (dia 0) + `LeadQualified` (dia X). Meta atribui o `Lead`, otimiza pra esse evento, conversion final é "informational"
- **Google:** lookback 90d cobre praticamente todos high-ticket cycles

### 3.6 Google Ads API: Data Manager API recomendação 2026

Critical 2026 update: Google está migrating de Google Ads API `UploadClickConversions` para **Data Manager API**. Para projetos novos:
- Implementar diretamente em Data Manager API (não Ads API legacy)
- Mesma idempotência via `(conversion_action, gclid, conversion_date_time)` tupla
- Suporta enhanced conversions for leads (EC4L) nativo

---

## 4. LGPD Compliance Technical Implementation

### 4.1 Consent ledger schema (proof-grade, immutable)

**Princípio:** consent é evento, não estado. Toda mudança vira nova row, NUNCA UPDATE.

```sql
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  data_subject_id UUID NOT NULL,        -- = contact.id geralmente
  data_subject_type TEXT NOT NULL,      -- 'contact' | 'user'
  purpose TEXT NOT NULL,                -- 'marketing_email' | 'whatsapp_marketing' | 'analytics' | 'profile_enrichment'
  legal_basis TEXT NOT NULL,            -- 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation' (LGPD Art. 7)
  status TEXT NOT NULL,                 -- 'granted' | 'withdrawn'
  -- Proof-grade evidence
  source TEXT NOT NULL,                 -- 'web_form' | 'whatsapp_optin' | 'imported' | 'api'
  source_url TEXT,
  ip_address INET,
  user_agent TEXT,
  evidence_blob_path TEXT,              -- snapshot HTML/screenshot Supabase Storage
  policy_version TEXT NOT NULL,         -- 'v1.0' (link to privacy_policy_versions)
  -- Timing
  granted_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,               -- some consents expire (e.g., 24mo)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX consents_subject_idx ON consents (tenant_id, data_subject_id, purpose, created_at DESC);

-- Materialized view para current consent state (lookup rápido)
CREATE MATERIALIZED VIEW current_consents AS
SELECT DISTINCT ON (tenant_id, data_subject_id, purpose)
  tenant_id, data_subject_id, purpose, status, legal_basis, expires_at
FROM consents
ORDER BY tenant_id, data_subject_id, purpose, created_at DESC;
CREATE UNIQUE INDEX current_consents_idx ON current_consents (tenant_id, data_subject_id, purpose);
-- REFRESH via trigger AFTER INSERT
```

**Imutabilidade:** revogar policy `UPDATE` e `DELETE` em produção:
```sql
REVOKE UPDATE, DELETE ON consents FROM authenticated, service_role;
GRANT INSERT, SELECT ON consents TO service_role;
```

Apenas migrations admin podem mexer (via direct DB user, audited).

### 4.2 Data residency: Supabase região São Paulo

**Decisão:** TODO projeto Supabase em região `sa-east-1` (São Paulo).

**Por que NÃO US:**
- LGPD Art. 33: transferência internacional exige cláusulas contratuais específicas
- Latência: 150ms+ vs 20-30ms intra-BR (impacta WhatsApp real-time)
- Soberania regulatória: ANPD pode exigir audit local

**Por que NÃO self-host:**
- Custo operacional (Postgres HA setup, backups, monitoring) >> $25/mo
- Supabase tem DPA assinada padrão
- Compliance está no provider quando uso managed service

**Backup secondary:**
- Supabase backups daily 7d retention (Pro)
- Plus: `pg_dump` semanal para Backblaze B2 BR (custo ~$1/mo)
- Crítico para LGPD Art. 46 §1 (data subject pode pedir restauração)

### 4.3 Right to erasure (cascade deletes + audit trail)

**LGPD Art. 18 V:** data subject pode pedir eliminação.

**Schema audit:**
```sql
CREATE TABLE erasure_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  data_subject_id UUID NOT NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  status TEXT DEFAULT 'pending',          -- pending|in_review|approved|completed|denied
  completion_proof_hash TEXT,             -- SHA256 do diff de dados removidos
  completed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  legal_hold_until TIMESTAMPTZ,           -- retenção por obrigação legal (financeiro 5 anos)
  notes TEXT
);
```

**Erasure workflow:**
1. Request via formulário público OR API (`POST /api/lgpd/erasure`)
2. Status `pending` → DPO recebe email + Slack
3. DPO revisa (existe legal hold? lead com transação financeira < 5 anos?)
4. `approved` → trigger erasure procedure (stored procedure)
5. SP cascade:
   - `UPDATE contacts SET email_sha256 = NULL, phone_sha256 = NULL, full_name = '[ERASED]', ... WHERE id = $1`
   - `DELETE FROM messages WHERE contact_id = $1` (cuidado: pode afetar bookkeeping)
   - **NÃO deletar `conversion_events`** (auditable, dado já partiu pra Meta/Google)
   - INSERT auditing row em `erasure_audit_log`
6. Status `completed` + email confirmação ao subject
7. SLA legal: **15 dias** (LGPD Art. 19)

**Cascade FKs cuidadosos:**
- `leads.contact_id ON DELETE SET NULL` (preserva lead histórico) — anonymized
- `messages.contact_id ON DELETE CASCADE` (mensagens caem com contact)
- `conversion_events.lead_id ON DELETE SET NULL` (NUNCA deletar conv events)

### 4.4 DPO contact flow

**Endpoint público obrigatório:** `/lgpd/contato` (link no footer todas LPs)

**Schema:**
```sql
CREATE TABLE dpo_inquiries (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  inquiry_type TEXT NOT NULL,  -- access|portability|correction|erasure|opposition|info
  data_subject_email TEXT NOT NULL,
  cpf_last_4 TEXT,             -- last 4 digits para verificação (não armazenar full)
  message TEXT,
  status TEXT DEFAULT 'open',
  sla_due_at TIMESTAMPTZ GENERATED ALWAYS AS (created_at + INTERVAL '15 days') STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**DPO designado:** atributo do tenant
```sql
ALTER TABLE tenants ADD COLUMN dpo_email TEXT;
ALTER TABLE tenants ADD COLUMN dpo_name TEXT;
ALTER TABLE tenants ADD COLUMN dpo_cnpj TEXT;
```

Mostrar no `/politica-de-privacidade` por tenant.

### 4.5 Cookie banner + tracking opt-in/opt-out enforcement

**Pattern:** consent-first. Pixel/CAPI **NÃO disparam sem consent**.

**Stack proposto:**
- Cookie banner: custom React component (não 3rd party — controle total + LGPD-tuned PT-BR)
- Storage: cookie `aios_consent` JSON `{ analytics: bool, marketing: bool, granted_at, version }`
- Server: cada request inclui consent state no `req.headers.cookie`
- Pixel SDK init: lazy load **somente após** `consent.marketing === true`
- CAPI server-side: respeita `consent.marketing` do contact (via `current_consents` view)

**Bloqueio de fire CAPI sem consent (defense in depth):**
```sql
-- View que worker CAPI consulta
CREATE VIEW conversion_events_eligible AS
SELECT ce.*
FROM conversion_events ce
LEFT JOIN current_consents cc
  ON cc.tenant_id = ce.tenant_id
  AND cc.data_subject_id = ce.lead_id
  AND cc.purpose = 'marketing_tracking'
WHERE ce.meta_status = 'PENDING'
  AND (cc.status = 'granted' OR ce.legal_basis = 'legitimate_interest');
```

Se `consent.marketing === false`, evento ainda é insertado em `conversion_events` (rastreio do que poderia ter sido enviado), mas worker ignora.

### 4.6 ROPA generation automated

**ROPA = Record of Processing Activities (LGPD Art. 37).**

**Schema fonte:**
```sql
CREATE TABLE data_processing_activities (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,                       -- 'WhatsApp ingestion', 'Meta CAPI upload'
  description TEXT,
  legal_basis TEXT NOT NULL,                -- LGPD Art. 7 enum
  data_categories TEXT[],                    -- ['phone', 'email', 'name', 'conversation_content']
  data_subject_categories TEXT[],            -- ['leads', 'customers']
  retention_period TEXT,                     -- 'while consent + 90 days', 'legal hold 5 years'
  third_party_recipients TEXT[],             -- ['Meta', 'Google', 'Supabase', 'Resend']
  international_transfer BOOLEAN DEFAULT FALSE,
  transfer_safeguards TEXT,                  -- 'EU Standard Contractual Clauses' etc
  security_measures TEXT[],
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Geração ROPA:**
- Endpoint admin `GET /api/lgpd/ropa.pdf?tenant=tocks`
- Renderiza PDF via Puppeteer ou react-pdf com dados de `data_processing_activities`
- Inclui meta info: DPO contact, tenant CNPJ, generation date
- Submit anual review obligation (reminder via cron)

---

## 5. Performance + Scale Targets

### 5.1 SLA <60s lead-to-CRM (queue arch)

**Critical path:**
```
Lead form submit / WhatsApp inbound
   → API endpoint (target P95 <300ms ACK)
   → Postgres INSERT (target <50ms)
   → Realtime broadcast (target <500ms propagation)
   → Dashboard render (target <2s page load)
   → CAPI/GAds upload (target <60s queue→sent)
```

**Bottlenecks esperados:**
- Cold start Vercel function: ~500ms-1s primeira req
- Postgres connection pool exhaustion (Supabase Pro: 200 conn)
- pg-boss polling latency: default 2s (configurar para 500ms)

**Mitigations:**
- Vercel Pro: function regions sa-east-1 (Brasil edge)
- Supabase Supavisor (pgbouncer) transaction mode
- pg-boss `newJobCheckIntervalSeconds: 1`
- Realtime: usar `broadcast` (não db_changes) para inbox notifications — menor latência

### 5.2 Volume targets

**Phase 1 (mês 1-3):** 10k leads/mo total = ~330 leads/dia = ~14 leads/hora.
- Postgres: trivial
- WhatsApp: ~14 inbound/hora = bem dentro Tier 1
- CAPI: ~330 events/dia upload — sem stress

**Phase 2 (mês 4-9):** 50k leads/mo = ~1.6k/dia = ~70/hora.
- Atenção em queue depth (pg-boss workers escalam horizontalmente)
- WhatsApp: precisa Tier 2 (10k)

**Phase 3 (mês 9-12):** 100k leads/mo = ~3.3k/dia = ~140/hora peak ~500/hora.
- Compute upgrade Supabase Small ou Medium ($10-30/mo extra)
- Read replicas (Supabase Pro suporta) para dashboards (decouple OLAP)
- WhatsApp Tier 3 (100k)

### 5.3 Real-time WhatsApp inbox: Supabase Realtime vs poll vs SSE

| Opção | Latência | Custo | Complexidade | Fit |
|-------|----------|-------|--------------|-----|
| **Supabase Realtime (broadcast)** | <500ms | Incluso Pro | Baixa | ✅ Recomendado |
| Supabase Realtime (db_changes) | 1-2s | Incluso Pro | Baixa | OK fallback |
| SSE custom | <300ms | Vercel function-hours | Médio | Quando Pro 500 conn limit estourar |
| Polling 5s | 5s | Free | Trivial | Fallback emergência |

**Recomendação:**

Usar **`broadcast` channel** (não `postgres_changes`). Pattern:
```typescript
// Server (worker que processa webhook):
await supabase.channel(`tenant:${tenantId}:inbox`).send({
  type: 'broadcast',
  event: 'new_message',
  payload: { conversation_id, preview, ... }
});

// Client (inbox UI):
supabase.channel(`tenant:${tenantId}:inbox`)
  .on('broadcast', { event: 'new_message' }, (payload) => {
    // Update UI without re-fetch
  })
  .subscribe();
```

**Por que broadcast > postgres_changes:**
- postgres_changes requer WAL replication slot — degrada com volume alto
- broadcast é simples Redis-pubsub-like — escala lateralmente
- broadcast preserva privacy: payload é só o que server escolhe enviar (postgres_changes vaza row inteira)

**Limite 500 connections (Pro):**
- 1 connection por aba aberta de inbox = limit em ~500 abas concurrent
- Para 100 usuários, isso é OK
- Para 1000+ usuários: upgrade para Team OR build SSE custom endpoint que multiplexa N clients sobre 1 connection Supabase

### 5.4 DB indexing strategy

**Indexes obrigatórios (cobertura tenant_id):**
```sql
-- Sempre (tenant_id, *) primeiro
CREATE INDEX leads_tenant_stage_idx ON leads (tenant_id, stage, updated_at DESC);
CREATE INDEX contacts_tenant_phone_idx ON contacts (tenant_id, phone_e164);
CREATE INDEX messages_conv_idx ON messages (conversation_id, created_at DESC);
CREATE INDEX conversations_tenant_state_idx ON conversations (tenant_id, state, last_msg_at DESC);

-- Search (trigram para nome/email)
CREATE INDEX contacts_name_trgm ON contacts USING gin (name_normalized gin_trgm_ops);

-- Partial indexes (pendências)
CREATE INDEX conv_pending_meta_idx ON conversion_events (tenant_id, event_time)
  WHERE meta_status IN ('PENDING','FAILED');
CREATE INDEX conv_pending_google_idx ON conversion_events (tenant_id, event_time)
  WHERE google_status IN ('PENDING','FAILED');

-- Audit
CREATE INDEX webhook_events_status_idx ON webhook_events (status, created_at)
  WHERE status IN ('queued','processing','failed');
```

**Anti-patterns a evitar:**
- INDEX sem `tenant_id` no prefixo → RLS scan inteira tabela
- Múltiplos indexes redundantes (Postgres não combina, escolhe um)
- INDEX on JSONB sem GIN ou expression indexes específicos

### 5.5 Cold start <2s page load

**Estratégia:**
- Next.js 16 RSC + streaming (App Router default)
- Edge runtime para páginas read-mostly (dashboard)
- Node runtime para webhooks e CAPI (precisam crypto + pg client)
- Critical CSS inline + preload Tailwind fonts
- Supabase client: persistent connection via Supavisor

**Avoid:**
- `'use client'` no top-level layout (kill streaming)
- N+1 queries em RSC (use joins via Supabase RPC ou views)

---

## 6. Security Model

### 6.1 Auth: Supabase Auth

**Stack:**
- **Email magic link** (passwordless) primary
- **Google OAuth** secondary (Tocks/Bretda usam Google Workspace já)
- **MFA TOTP** obrigatório para role `owner` (Supabase Auth nativo)
- NÃO usar email/password (gerenciamento de senha = atrito + risco)

**Multi-tenant flow:**
1. User clica login → magic link
2. JWT inclui `sub` = auth.users.id
3. Middleware Next.js lê `tenant_members` para ver tenants disponíveis
4. Se >1 tenant, mostra tenant switcher
5. Set custom JWT claim `tenant_id` via hook OR usar header `X-Tenant-ID`
6. Server queries usam `set_config('app.tenant_id', $1, true)` antes de cada query (RLS reads from current_setting)

**Importante:** RLS policy NÃO confia em JWT claim — sempre cross-check `tenant_members`:
```sql
USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()))
```

### 6.2 Roles: owner, admin, sales, observer

| Role | Permissions |
|------|------------|
| **owner** | Tudo. Único que pode gerenciar billing, transferir ownership, deletar tenant, gerenciar API keys |
| **admin** | Tudo exceto: billing, delete tenant, MFA bypass |
| **sales** | CRUD em leads/contacts próprios; read em campanha-level analytics; NÃO altera config tenant |
| **observer** | Read-only em tudo. Dashboard analytics, audit logs |

**RLS por role:**
```sql
CREATE POLICY leads_sales_own_only ON leads
  FOR SELECT
  USING (
    tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid())
    AND (
      assigned_agent_id = auth.uid()
      OR EXISTS (SELECT 1 FROM tenant_members WHERE user_id = auth.uid() AND tenant_id = leads.tenant_id AND role IN ('owner','admin','observer'))
    )
  );
```

Sales só vê leads atribuídos a si OU é admin/owner/observer (estes veem tudo).

### 6.3 API keys for integrations (rotate, scope-limited)

**Schema:**
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,                       -- 'Zapier Production', 'n8n Workflow'
  key_hash TEXT NOT NULL,                   -- SHA256 of key (key shown once)
  prefix TEXT NOT NULL,                     -- 'aios_live_abc' visible identifier
  scopes TEXT[] NOT NULL,                   -- ['leads:read', 'leads:write', 'messages:read']
  rate_limit_per_min INT DEFAULT 60,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX api_keys_hash_idx ON api_keys (key_hash) WHERE revoked_at IS NULL;
```

**Validation middleware:**
```typescript
async function validateApiKey(req: Request): Promise<TenantContext> {
  const key = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!key?.startsWith('aios_')) throw new Error('invalid');
  const hash = sha256(key);
  const apiKey = await db.query('SELECT * FROM api_keys WHERE key_hash = $1 AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > NOW())', [hash]);
  if (!apiKey) throw new Error('invalid');
  // Rate limit check via Redis or Postgres advisory lock
  await rateLimit(apiKey.id, apiKey.rate_limit_per_min);
  // Update last_used_at async (não bloquear)
  return { tenant_id: apiKey.tenant_id, scopes: apiKey.scopes };
}
```

**Rotation policy:**
- Default expires_at = 90d
- Auto-email notification 14d before expiry
- Rotation: novo key emitido, antigo grace period 7d

### 6.4 Audit log everything

```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID,
  actor_id UUID,                            -- auth.users.id OR api_key.id
  actor_type TEXT,                          -- 'user' | 'api_key' | 'system'
  action TEXT NOT NULL,                     -- 'lead.create', 'lead.delete', 'consent.grant', ...
  resource_type TEXT NOT NULL,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);
-- Partitioning by month para volume alto
CREATE INDEX audit_log_tenant_time_idx ON audit_log (tenant_id, occurred_at DESC);
CREATE INDEX audit_log_resource_idx ON audit_log (resource_type, resource_id);
```

**Source of audit events:**
- Postgres triggers em tabelas críticas (`leads`, `contacts`, `consents`, `api_keys`, `tenant_members`)
- API middleware insere para reads (apenas resource_type+id, não payload)
- pgaudit extension (Supabase suporta) para auditing SQL-level

**Retention:** 24 meses default (LGPD não fixa, mas best practice). Particionamento mensal + drop partitions antigas.

### 6.5 Encryption at rest + in transit

**At rest:**
- Supabase: AES-256 disk encryption nativo
- Supabase Storage: AES-256 nativo
- Secrets (whatsapp_app_secret, access_token, etc): coluna criptografada via `pgsodium` ou app-layer com `crypto.subtle` + KMS

**Pattern app-layer encryption:**
```typescript
// Em vars sensíveis, NUNCA armazenar plaintext
const encrypted = encrypt(plaintext, process.env.AIOS_DATA_KEY); // AES-256-GCM
// Salvar { ciphertext, iv, tag, key_version }
```

**Key rotation:** master key em Vercel env var `AIOS_DATA_KEY_V1`, `AIOS_DATA_KEY_V2`. Rotation via re-encrypt batch job.

**In transit:**
- Supabase: TLS 1.3 enforced
- Vercel: HTTPS only
- Webhooks Meta → nosso endpoint: HTTPS only (Meta requirement)
- Internal API calls: HTTPS

**Cookies:**
- All sensitive cookies: `Secure; HttpOnly; SameSite=Lax`
- Session: 24h sliding window
- CSRF token em forms

---

## 7. Recomendação Final

### 7.1 Três Architecture Decisions Críticas

**ADR-001 — Multi-tenancy via RLS shared-schema**

> Adotar Row-Level Security com `tenant_id` em todas as tabelas. Justificativa: 3 tenants internos do mesmo dono; custo $25/mo fixo; cross-tenant analytics trivial; LGPD compliance via consent ledger + audit log, NÃO via isolamento físico. Migration path para schema-per-tenant existe e é viável em <5 dias caso futuro tenant pague por isolamento dedicado.

**ADR-002 — WhatsApp Cloud API direto, sem 3rd party wrappers**

> Integrar diretamente com Meta Cloud API. Banir Z-API, UnoFlow, MaytAPI e similares. Justificativa: incidente KR 12/Mai (99 leads perdidos em 12d, R$437) foi causado por opacidade de configuração WABA. Cloud API direto dá controle total: webhook signature verify, message_id idempotency, real-time tier/quality monitoring. Smoke test diário automatizado obrigatório.

**ADR-003 — Conversion bridge via outbox pattern com event_id determinístico**

> Toda mudança de stage no CRM gera row em `conversion_events` via trigger Postgres, com `event_id` UUID v5 hash(lead_id, event_name, stage_change_ts). Worker pg-boss processa async com retries exponential backoff. Idempotência garantida em 3 layers: PG UNIQUE constraint, deterministic event_id, Meta/Google native dedup. Falha em qualquer layer cai em dead letter queue + Slack alert.

### 7.2 Três Risks Principais

**RISK-001 — Vercel cold starts comprometendo SLA <60s**

> Próximo de 0 leads/hora em Vorza, cold start de 1-2s em webhook handler pode causar Meta a re-entregar (timeout 20s improvável, mas latência percebida ruim). Mitigação: usar `runtime: 'nodejs'` com `dynamic = 'force-dynamic'` + Vercel function region sa-east-1. Backup plan: deploy worker dedicado Railway BR para webhooks (custo $5/mo).

**RISK-002 — Supabase Realtime connection limit (500 Pro)**

> Cada aba aberta de inbox consome 1 connection. Com 50 users abrindo 5 abas cada = 250 conn. Ainda OK Pro. Fase 3 (100k leads/mo, 100+ users) pode estourar. Mitigação: monitorar `pg_stat_activity` + plan upgrade Team OR build SSE proxy custom que multiplexa N clientes sobre 1 connection Supabase.

**RISK-003 — Bug class "config wrong but invisible" (KR pattern)**

> WABA configurada com número errado, pixel client-side silenciosamente quebrado, conversion action ID mudou. Sintoma: zero erros, mas dados não chegam. Mitigação: **smoke tests automatizados diários OBRIGATÓRIOS** para cada pipeline (WhatsApp send/receive, Pixel fire, CAPI roundtrip, Google offline conv upload). Dashboard health check com semáforo verde/amarelo/vermelho. Slack alert se qualquer pipeline ficar >2h sem dados quando histórico mostra fluxo contínuo.

### 7.3 Cinco ADRs Recomendadas (próxima fase)

| ADR | Tema | Owner |
|-----|------|-------|
| **ADR-004** | Background job runtime: pg-boss vs Trigger.dev vs Inngest | @architect + @dev |
| **ADR-005** | Realtime channel strategy: broadcast vs db_changes vs SSE | @architect + @ux-design-expert |
| **ADR-006** | Encryption-at-application-layer: pgsodium vs Node crypto + KMS | @architect + @data-engineer |
| **ADR-007** | Webhook ingestion separation: monolith routes vs dedicated worker | @architect + @devops |
| **ADR-008** | Multi-tenant migration trigger criteria (quando schema-per-tenant?) | @architect + @pm |

### 7.4 Próximos passos imediatos

1. **@pm Morgan** valida escopo via PRD (`docs/projects/crm-novo/20-prd/`)
2. **@data-engineer Dara** desenha schema completo (40+ tabelas estimadas) com índices + RLS policies
3. **@architect Aria** escreve ADR-001/002/003 formalmente
4. **@ux-design-expert Uma** desenha wireframes inbox + lead detail + dashboard
5. **@po Pax** quebra em Epic + Stories (estimativa: 8 epics, ~50 stories MVP)
6. **@qa Quinn** define smoke test suite obrigatória (anti-KR pattern)

---

## 8. Sources

- [Supabase Multi-Tenancy CRM Integration Guide | Stacksync](https://www.stacksync.com/blog/supabase-multi-tenancy-crm-integration)
- [Supabase RLS Best Practices | MakerKit](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)
- [Multi-Tenant Applications with RLS on Supabase | AntStack](https://www.antstack.com/blog/multi-tenant-applications-with-rls-on-supabase-postgress/)
- [Supabase Pricing 2026 | MetaCTO](https://www.metacto.com/blogs/the-true-cost-of-supabase-a-comprehensive-guide-to-pricing-integration-and-maintenance)
- [Supabase Pricing & Fees Official](https://supabase.com/pricing)
- [Guide to WhatsApp Webhooks | Hookdeck](https://hookdeck.com/webhooks/platforms/guide-to-whatsapp-webhooks-features-and-best-practices)
- [Building a Scalable Webhook Architecture for WhatsApp | ChatArchitect](https://www.chatarchitect.com/news/building-a-scalable-webhook-architecture-for-custom-whatsapp-solutions)
- [Webhook Processing at Scale: Idempotency, Signature Verification | DEV Community](https://dev.to/whoffagents/webhook-processing-at-scale-idempotency-signature-verification-and-async-queues-45b3)
- [WhatsApp Messaging Limits 2026 | Chatarmin](https://chatarmin.com/en/blog/whats-app-messaging-limits)
- [WhatsApp API Rate Limits 2026 | Webmaxy](https://www.webmaxy.co/blog/whatsapp-business-api/whatsapp-api-rate-limits-avoid-blocks-and-grow-faster-in-2026/)
- [Meta Messaging Limits Official](https://developers.facebook.com/docs/whatsapp/messaging-limits/)
- [Meta CAPI Setup Guide 2026 | Ingest Labs](https://ingestlabs.com/blogs/meta-capi-setup-complete-implementation-guide-for-facebook-conversion-api-2026/)
- [Meta CAPI Event Deduplication Official](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/)
- [Google Ads Offline Conversions API](https://developers.google.com/google-ads/api/docs/conversions/upload-offline)
- [Google Ads API February 2026 Conversion Changes | ALM Corp](https://almcorp.com/blog/google-ads-api-conversion-data-changes-2026/)
- [Brazil LGPD Compliance Guide | ComplyDog](https://complydog.com/blog/brazil-lgpd-complete-data-protection-compliance-guide-saas)
- [LGPD Compliance Practical Guide 2026 | Secure Privacy](https://secureprivacy.ai/blog/lgpd-compliance-requirements)
- [Supabase Data Residency Self-Hosted | Supascale](https://www.supascale.app/blog/data-residency-and-compliance-for-selfhosted-supabase)
- [Supabase Realtime with Next.js Official](https://supabase.com/docs/guides/realtime/realtime-with-nextjs)
- [Why I Ditched Supabase Realtime for SSE | Medium](https://medium.com/@khushidiwan953/why-i-ditched-supabases-realtime-and-built-my-own-a6fc20c542d4)
- [pg-boss Job Queue Postgres GitHub](https://github.com/timgit/pg-boss)
- [Next.js Background Jobs: Inngest vs Trigger.dev vs Vercel Cron | HashBuilds](https://www.hashbuilds.com/articles/next-js-background-jobs-inngest-vs-trigger-dev-vs-vercel-cron)
- [Next.js, Background Jobs & PostgreSQL Production 2026 | Render](https://render.com/articles/nextjs-background-jobs-postgresql-production)

---

*— Aria, arquitetando o futuro do CRM Novo*
