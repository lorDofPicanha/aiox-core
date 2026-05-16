# Brainstorming — CRM Novo Features Design

**Skill aplicada:** `brainstorming` (Obra method, adaptado autonomous)
**Modo:** Autonomous (user opted "sem clarifying questions")
**Data:** 2026-05-15
**Status:** Design v1.0 — pré-implementation

---

## 1. Context Exploration (✅ Already done)

**Sources consumed:**
- `D:/AIOS/docs/projects/crm-novo/00-context/CONTEXT.md` — defaults + decisões aplicadas
- `D:/AIOS/docs/projects/crm-novo/10-research/06-tech-research.md` — stack + dimensões dialéticas
- `D:/AIOS/docs/projects/crm-novo/10-research/00-hydra-run-summary.md` — research aggregated

**Constraints estabelecidos:**
- Stack: Next.js 16 + Supabase + WhatsApp Cloud API + Resend + Inngest + Vercel
- 3 KILL gates não-negociáveis (Week 4 / Week 8 / Week 12)
- Multi-tenant RLS single-DB
- LGPD + ANPD SCCs obrigatórios
- 3 tenants iniciais: Tocks + Bretda + Vorza

---

## 2. Approach Exploration — 3 Approaches Considered

### Approach A — "Inbox-First CRM" (RECOMMENDED)

**Concept:** Homepage = WhatsApp inbox. Pipeline secundário. Tudo gira em volta da conversa.

**Why:** 80% do trabalho real Tocks/Bretda é em WhatsApp. Pain real é "preciso responder esse lead AGORA", não "preciso mover deal no funil".

**Trade-offs:**
- ✅ Aligned com realidade BR (WhatsApp = canal #1)
- ✅ Resolve KR pattern (lead chegando = visível)
- ✅ Reduces cognitive load (não precisa abrir 3 telas)
- ❌ Risk: vira "WhatsApp Web melhorado" se não enriquecer com contexto
- ❌ Pipeline pode ficar secundário demais

### Approach B — "Pipeline-First CRM"

**Concept:** Homepage = Kanban deals. WhatsApp como aba. Pattern Pipedrive/HubSpot tradicional.

**Trade-offs:**
- ✅ Familiar pra quem usou HubSpot/Salesforce antes
- ✅ Foco em métricas pipeline velocity
- ❌ Pain real (responder WhatsApp) fica friction (2 cliques)
- ❌ Tocks team não vem de cultura "pipeline metrics" — vai parecer overhead
- ❌ Não diferencia de SaaS BR existentes

### Approach C — "Hybrid Dashboard"

**Concept:** Homepage = split-screen (inbox top 50% + pipeline bottom 50%). Configurable per user.

**Trade-offs:**
- ✅ Flexível por persona
- ❌ Cognitive overload (3 contextos visíveis)
- ❌ Implementation 2x mais complexa
- ❌ "Configuração demais é zero configuração" (Don Norman)

### 🎯 Recommendation: **Approach A (Inbox-First)**

Razão: resolve pain real Tocks/Bretda (responder WhatsApp em <60s). Pipeline acessível 1 clique via deal_id linked em cada conversation. Power users podem trocar default pra pipeline view em settings.

---

## 3. Design Sections

### 3.1 Architecture (sistema-level)

```
┌────────────────────────────────────────────────────────┐
│                    Browser (PWA)                        │
│  ┌─────────────┬────────────┬────────────┬─────────┐  │
│  │   Inbox    │  Pipeline   │  Contacts  │ Reports │  │
│  └──────┬──────┴──────┬──────┴──────┬─────┴────┬────┘  │
│         │             │             │          │       │
└─────────┼─────────────┼─────────────┼──────────┼───────┘
          │             │             │          │
          ▼             ▼             ▼          ▼
┌─────────────────────────────────────────────────────────┐
│            Next.js 16 (Vercel Edge + Functions)         │
│  ┌──────────────┬──────────────┬─────────────────────┐ │
│  │ Server       │ Route        │ Server              │ │
│  │ Components   │ Handlers     │ Actions             │ │
│  └──────────────┴──────┬───────┴──────────┬──────────┘ │
└────────────────────────┼──────────────────┼────────────┘
                         │                  │
                         ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│         Supabase (Postgres sa-east-1 + Auth + Realtime) │
│  ┌──────────┬──────────┬──────────┬──────────────────┐ │
│  │ tenants  │ contacts │ deals    │ whatsapp_messages│ │
│  │ users    │activities│ pipelines│ consent_ledger   │ │
│  │ RLS ✓    │ RLS ✓    │ RLS ✓    │ RLS ✓ audit_log  │ │
│  └──────────┴──────────┴──────────┴──────────────────┘ │
└────────────┬─────────────┬───────────────┬──────────────┘
             │             │               │
             ▼             ▼               ▼
        ┌─────────┐  ┌──────────┐  ┌─────────────────┐
        │ Resend  │  │ Inngest  │  │ External APIs   │
        │ (email) │  │ (queue)  │  │ - Meta CAPI     │
        └─────────┘  └─────┬────┘  │ - WhatsApp Cloud│
                           │       │ - Google Ads OC │
                           ▼       │ - Google Cal    │
                  ┌────────────────┴─────────────────┐
                  │ Durable Workflows                │
                  │ - Lead Qualified → Google OC     │
                  │ - Lead created → Meta CAPI       │
                  │ - WhatsApp webhook → contact     │
                  │ - LGPD erasure cascade           │
                  └──────────────────────────────────┘
```

### 3.2 Core Components (modular boundaries)

| Module | Responsibility | Inputs | Outputs | Depends On |
|--------|----------------|--------|---------|------------|
| `auth` | Supabase Auth + JWT + tenant_id claim | Email/Google OAuth | Authenticated session | Supabase Auth |
| `tenants` | Tenant CRUD, RLS context setting | Owner user_id | Tenant record + RLS policies | Supabase Postgres |
| `contacts` | Contact dedupe by (tenant_id, phone OR email) | Phone/email/name + tenant | Contact record | Postgres + RLS |
| `whatsapp-receiver` | Webhook intake + dedupe + persist | WhatsApp webhook event | whatsapp_messages row + contact upsert | WhatsApp Cloud API + Inngest |
| `whatsapp-sender` | Send msg + HSM templates | Contact + template + variables | Message ID + status tracking | WhatsApp Cloud API |
| `inbox-view` | List conversations, filter, sort | tenant_id + filters | Conversation list + last msg | contacts + whatsapp_messages |
| `conversation-view` | Single conversation timeline + actions | contact_id | Messages timeline + deal context + quick actions | whatsapp_messages + deals |
| `pipeline` | Pipelines + deals + stages + transitions | tenant_id + deal CRUD | Deal records + stage history | RLS + deal_stage_history table |
| `deal-detail` | Single deal view + activities + linked WhatsApp | deal_id | Deal + activities + msgs linked | deals + activities + whatsapp |
| `activities` | Note/call/email/meeting logging | contact_id + activity type | Activity record | RLS |
| `conversion-bridge` | Lead Qualified → Meta CAPI + Google OC | Deal stage change event | Conversion event upload | Inngest + Meta/Google APIs |
| `consent-ledger` | LGPD consent capture + revoke + ROPA | Contact action + source | Append-only consent records | Postgres immutable table |
| `audit-log` | Who-did-what-when | Every mutation | Append-only audit row | Postgres + RLS |
| `forms` | No-code lead capture forms | Form config | Embed code + lead intake | tenants + contacts |
| `reports` | Funnel, source attribution, time-in-stage | tenant_id + filters | Aggregated metrics | deals + activities + RLS |
| `notifications` | Push (web push), email, in-app | Trigger event | Delivery status | Inngest + Resend + Web Push API |

### 3.3 Data Flow — Critical Path "WhatsApp Lead → Closed Deal"

```
1. User clicks Click-to-WhatsApp ad (Meta)
   │
   ▼
2. WhatsApp opens → user sends 1st msg
   │
   ▼
3. Meta WhatsApp Cloud API → POST /api/webhooks/whatsapp
   │  - signature verify SHA-256 HMAC
   │  - dedupe by message_id
   │  - upsert contact (tenant_id, phone)
   │  - insert whatsapp_messages row
   │  - emit Inngest event "whatsapp.message.received"
   │
   ▼
4. Inngest workflow "lead.created.v1"
   │  - check if new contact (not dup) → fire Meta CAPI "Lead" event
   │  - capture consent: implicit (CTW ad) → consent_ledger row
   │  - assign sales user (round-robin or first available)
   │  - send notification: web push + in-app
   │
   ▼
5. Inbox-view real-time update (Supabase Realtime channel)
   │  - sales user sees new conversation top of inbox
   │
   ▼
6. Sales user opens conversation
   │  - load whatsapp_messages timeline (last 100)
   │  - load deal context if linked (else show "Create deal")
   │  - quick actions: reply / template / create deal / note
   │
   ▼
7. Sales user creates deal (1 click)
   │  - deal record (tenant_id, contact_id, pipeline_id, stage='new')
   │  - deal_stage_history row
   │  - activity row (linked to whatsapp msg)
   │
   ▼
8. Conversation continues → sales user moves deal stages
   │  - each stage change → deal_stage_history append
   │
   ▼
9. Sales user marks deal "Qualified" (specific stage)
   │  - emit Inngest event "deal.qualified.v1"
   │  - workflow:
   │    - Meta CAPI "Lead Qualified" event (deduped by external_id=deal.id)
   │    - Google Ads Offline Conversion Import (batch upload)
   │    - LGPD: log purpose change in consent_ledger
   │
   ▼
10. Deal closes (won/lost)
    - emit "deal.closed.v1"
    - if won: Meta CAPI "Purchase" + Google OC "Sale"
    - cohort tracking for time-to-close report
```

### 3.4 Error Handling Strategy

| Failure mode | Detection | Response |
|--------------|-----------|----------|
| WhatsApp webhook signature invalid | HMAC check fails | 401 + audit_log row |
| WhatsApp webhook dupe | message_id exists | 200 + skip (idempotent) |
| Contact dedupe race condition | UNIQUE constraint (tenant_id, phone) | Catch + return existing |
| Inngest workflow Meta CAPI 500 | HTTP status | Retry exponential 5x, then dead-letter queue alert |
| Google Ads OC quota exceeded | API error | Batch + retry next window |
| RLS policy bug exposes cross-tenant data | E2E test suite + audit_log monitor | Block PR, alert on prod via Sentry rule |
| Supabase region outage sa-east-1 | Health check fail | Read-only mode + alert (no failover Phase 1) |
| LGPD erasure request | API endpoint /lgpd/erase | Cascade delete + 15d SLA + audit |

### 3.5 Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit (utils, parsers) | Vitest | 80%+ |
| Integration (route handlers) | Vitest + Supabase test DB | All happy paths + LGPD endpoints |
| E2E critical flows | Playwright | Lead create → conv → deal qualified → bridge upload |
| RLS policy tests | pgTAP (Postgres test framework) | EVERY table policy tested |
| Load (inbox scale) | k6 | 1000 concurrent msgs/sec sustainable |
| Security | OWASP ZAP automated | OWASP Top 10 in CI |

---

## 4. Features by Phase

### 🟢 Phase V0 — MVP (Weeks 1-8)

**Goal:** Tocks consegue operar 100% sem Sales AI. Bridge funcionando.

**Must-have features:**

#### Auth & Tenant
- F-001 Supabase Auth (magic link + Google OAuth)
- F-002 Multi-tenant context via JWT claim (`tenant_id`)
- F-003 Roles: owner / admin / sales (observer Phase 1)
- F-004 Onboarding tenant create (3 initial: Tocks, Bretda, Vorza)
- F-005 Invite users to tenant (email link with role)

#### WhatsApp Core
- F-010 WhatsApp Cloud API webhook receiver (signature verify, dedupe)
- F-011 Multi-number per tenant config (Tocks +55 47 3041-9811 etc)
- F-012 Contact upsert by (tenant_id, phone)
- F-013 Inbox view real-time (Supabase Realtime per tenant)
- F-014 Conversation view (timeline + send free-form during 24h CSW)
- F-015 HSM template send (pre-approved templates list)
- F-016 Media attachments (image, doc) via Supabase Storage
- F-017 Read receipts + delivery status
- F-018 Smoke test endpoint (`/api/whatsapp/smoke-test` — prevent KR pattern)

#### Pipeline & Deals
- F-020 Pipelines per tenant (default pre-installed: "Vendas")
- F-021 Stages configurable per pipeline
- F-022 Deal CRUD linked to contact
- F-023 Deal stage transitions tracked (deal_stage_history)
- F-024 Kanban board view (drag handle mobile-friendly)
- F-025 Deal detail page with linked WhatsApp + activities + notes

#### Conversion Bridge (KILLER FEATURE)
- F-030 Inngest workflow: deal.created → Meta CAPI "Lead" event
- F-031 Inngest workflow: deal.qualified → Meta CAPI "Lead Qualified"
- F-032 Inngest workflow: deal.qualified → Google Ads Offline Conv batch
- F-033 Idempotency keys (external_id=deal.id, hash SHA-256)
- F-034 Conversion event dashboard (status, retry, audit)
- F-035 Dead-letter queue + alert (resolve F-CRM-Upload-Void definitively)

#### LGPD Compliance
- F-040 Consent ledger append-only (capture on contact create + source)
- F-041 Audit log append-only (every mutation logged)
- F-042 Right to erasure endpoint (cascade delete + audit)
- F-043 Right to access endpoint (export JSON)
- F-044 ROPA auto-generation from schema (cron daily)

#### Reports (basic)
- F-050 Funnel by stage (count + value)
- F-051 Source attribution (Meta / Google / Direct / Referral)
- F-052 Time-in-stage per deal
- F-053 Sales user productivity (deals moved, messages sent)

**Phase V0 total: 30 features. Estimate 8 weeks solo dev + Tocks pilot Week 8.**

---

### 🟡 Phase V1 — Production-ready (Weeks 9-12)

**Goal:** Bretda + Vorza migrate. PWA offline. Real reports.

**New features:**

#### PWA & Mobile
- F-060 PWA install prompt (manifest + service worker)
- F-061 Offline inbox cache (last 100 msgs per conversation)
- F-062 Push notifications (web push)
- F-063 Bottom-sheet nav (mobile-first)
- F-064 Tap-to-call → log activity auto
- F-065 Camera quick-capture (photo attachment)

#### Email + Calendar
- F-070 Resend transactional (notifications, confirmations)
- F-071 Email outbound from CRM (track opens/clicks)
- F-072 Email inbound parse (forward CRM-specific address)
- F-073 Google Calendar 2-way sync (events appear in CRM, deals create events)
- F-074 Calendar reminder → notification

#### Forms (lead capture)
- F-080 Form builder no-code (drag fields)
- F-081 Embed code generation
- F-082 Honeypot + reCAPTCHA opt-in
- F-083 PT-BR field types (CPF, CNPJ, phone DDD auto)
- F-084 LGPD consent checkbox obrigatório
- F-085 Form submission → contact + deal (configurable mapping)

#### Reports (advanced)
- F-090 Cohort analysis (time-to-close by source)
- F-091 Win/loss reason tagging
- F-092 Revenue projections
- F-093 Export CSV/Excel
- F-094 Scheduled reports email

#### Templates & Automation
- F-100 Message templates library (per tenant)
- F-101 Saved replies (quick insert)
- F-102 Auto-assignment rules (round-robin, by source, by region)
- F-103 SLA alerts (lead not responded in 15min)
- F-104 Tagging system (contacts + deals)

**Phase V1 total: +25 features (cumulative 55). Estimate 4 more weeks.**

---

### 🔵 Phase V2 — AIOS-native Differentiators (Q3 2026)

**Goal:** Mind clones integration, AI agentes contextuais. Diferencial competitivo.

**New features:**

#### Mind Clones Integration
- F-110 In-app `@expert-consult` (consult mind clone from inside CRM)
- F-111 Auto-suggested replies via Claude/Opus 4.7 (with context)
- F-112 Deal coaching (Bretda deal → consult neil-patel / russell-brunson)
- F-113 Email/WhatsApp copy review (consult ann-handley / joanna-wiebe)

#### AI Agents Contextual
- F-120 Lead qualification AI agent (deal stage transition recommendation)
- F-121 Conversation summarizer (long threads → 3-bullet summary)
- F-122 Sentiment analysis (hot/warm/cold tagging auto)
- F-123 Next-best-action suggestions per deal
- F-124 AI-generated weekly reports (text narrative + key insights)

#### Advanced Integrations
- F-130 Meta Ads sync (campaign performance inline)
- F-131 Google Ads sync (campaign performance + offline conv attribution loop)
- F-132 Tocks/Bretda product catalog inline (link to deals)
- F-133 PIX payment links (BR-specific)
- F-134 Nota fiscal integration (BR-specific, ME/EPP)

#### Multi-channel Expansion
- F-140 Instagram DM ingestion (Meta unified inbox)
- F-141 Email as channel (Resend inbound parse mature)
- F-142 SMS fallback (Twilio when WhatsApp opt-out)
- F-143 Voice notes transcription auto (Whisper)

#### Observability + Admin
- F-150 Tenant admin dashboard (DPA, ROPA, audit access)
- F-151 Performance metrics per tenant
- F-152 Cost per tenant breakdown (WhatsApp msg, Inngest steps, Supabase rows)
- F-153 Alert thresholds per tenant

**Phase V2 total: +30 features (cumulative 85). Estimate Q3 2026 (3 months).**

---

## 5. Differentiators (AIOS-native)

**Vencem todos SaaS BR/global:**

1. **WhatsApp Cloud API direto** (não BSP wrapper)
   - Economia 60-80% per-message
   - Multi-number nativo per tenant
   - Webhook próprio (KR pattern 12/Mai prevention)

2. **Bridge bidirecional Meta CAPI + Google offline conv built-in**
   - Lead Qualificado fires automatic
   - Idempotency keys (deal.id)
   - Dead-letter queue + audit trail
   - Resolve F-CRM-Upload-Void definitivamente

3. **Multi-tenant RLS append-only audit**
   - Tocks NUNCA vê Bretda (RLS enforced + tested)
   - Every mutation logged
   - LGPD-ready

4. **Mind clones integration native**
   - Consult 115 expert clones from inside CRM
   - Deal coaching contextual
   - Copy review pre-send

5. **PT-BR mobile-first PWA**
   - Offline inbox cache
   - Push notifications
   - Camera quick-capture
   - DDD auto-detect

6. **Consent ledger + ROPA auto-gen**
   - LGPD compliance technical 100%
   - 15d response SLA enforced
   - 72h breach notification automated alert

---

## 6. YAGNI ruthlessly removed (originally considered, cut)

- ❌ AI lead scoring Phase 1 (defer Phase 3 — features V2)
- ❌ Video conferencing built-in (defer — Google Meet link suffices)
- ❌ Marketplace integrations 3rd party (Phase 3+ when API stable)
- ❌ White-label venda externa (não objetivo)
- ❌ Voice features Phase 1 (defer Phase 3 — Whisper integration)
- ❌ Native mobile app (PWA suffices Phase 1+2)
- ❌ AI sales bot Phase 1 (Sales AI deprecated = ANTI-PATTERN, don't repeat)
- ❌ Custom dashboards builder no-code (overkill MVP)
- ❌ Workflow automation builder no-code (Phase 3+)
- ❌ Forecast AI Phase 1 (defer Q3)

---

## 7. Open Questions (resolved via defaults — user pode override)

| Question | Default applied | Override how |
|----------|-----------------|--------------|
| Pipeline stages default Tocks | new → qualified → proposal → negotiation → won/lost | Tocks admin pode customizar Week 6 |
| User roles granularity Phase 1 | owner/admin/sales (3 roles) | Phase 2 adicionar observer + custom |
| Default timezone | America/Sao_Paulo | Per-user override Phase 2 |
| Currency Phase 1 | BRL only | Multi-currency Phase 3 |
| Language Phase 1 | PT-BR only | Multi-language Phase 3 |
| Pricing CRM (sale externa) | NOT FOR SALE Phase 1 | Decisão Q3 2026 |

---

## 8. Approved? (Autonomous gate)

**User não está disponível para approve (modo autônomo)** — assumindo proceed.

Se user retornar e quiser revisar:
- Pontos de override prováveis: lista de features V0, ordem de prioridade, gates Week 4/8/12
- Trigger reversão: "redesigna features", "muda approach pra B/C", "expande/reduz V0"

---

## ✅ Next Step

→ **UltraPlan** (deep technical planning) — task #5
→ Após: **Conclave** review com 5 mind clones (task #6)
→ Final: **Architecture + roadmap consolidated** (task #7)

---

*Brainstorm v1.0 | Skill `brainstorming` applied autonomous mode | Orion 2026-05-15*
