# Bridge Standalone — Meta CAPI + Google Offline Conv

**Status:** 🟢 Scaffold pronto (sem deploy ainda)
**Owner:** Breno
**Sprint:** Week 0 Day 3 (preparar antes do dogfooding Day 5)

---

## O que é

Workflow Inngest standalone (sem CRM UI) que dispara conversion events em paralelo pra:

1. **Meta CAPI** (Conversions API) v21 — eventos server-side com idempotency
2. **Google Ads** offline conversion upload (uploadClickConversions)

Cada disparo é registrado em audit log no Supabase. Falhas vão pra dead-letter queue pra replay manual.

**É o moat do produto.** O CRM full vem depois — este bridge **é o que precisa funcionar primeiro**. Pode rodar standalone alimentado por curl/Inngest dashboard durante o dogfooding Week 0.

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│  Vercel staging (Hobby tier ok)                              │
│                                                              │
│  /api/inngest ─► Inngest webhook handler                     │
│                                                              │
│  Inngest functions:                                          │
│   • lead-qualified-bridge                                    │
│     ├─ step "audit" → Supabase audit_log                    │
│     ├─ step "meta-capi" → graph.facebook.com (idempotent)   │
│     ├─ step "google-oc" → googleads.googleapis.com          │
│     └─ on-fail → audit_log.status=failed + DLQ row          │
│   • deal-won-bridge (mesma estrutura, value real)           │
│   • dlq-replay (manual trigger pra retry DLQ)               │
└─────────────────────────────────────────────────────────────┘
            │                          │                  │
            ▼                          ▼                  ▼
   ┌──────────────┐         ┌──────────────────┐    ┌──────────────┐
   │ Supabase     │         │ Meta Graph API   │    │ Google Ads   │
   │ Postgres     │         │ /events          │    │ API v20      │
   │ audit_log    │         │ idempotency:     │    │ upload conv  │
   │ dlq_events   │         │ event_id         │    │              │
   │ idempotency  │         └──────────────────┘    └──────────────┘
   └──────────────┘
```

**Princípios:**
- **Idempotency-first:** cada event tem `event_id = hash(tenant + entity + type + version)`. Retry seguro.
- **Audit-trail completo:** toda chamada vira row em `audit_log` com timestamp, status, response.
- **Dead-letter queue:** falha definitiva → row em `dlq_events` com payload completo pra replay.
- **Multi-tenant ready:** schema já tem `tenant_id` (suporta Tocks + Bretda + qualquer futuro).
- **Sem CRM no caminho:** dispara por curl manual / Inngest dashboard / webhook externo.

---

## Stack

| Camada | Tech | Justificativa |
|--------|------|---------------|
| Runtime | Node 20+ TypeScript strict | Stack padrão Vercel |
| Framework | Next.js 16 (App Router, só pra hostear webhook Inngest) | Reusa setup CRM futuro |
| Workflows | Inngest | Retry, idempotency, dashboard, DLQ nativo |
| DB | Supabase Postgres sa-east-1 | Multi-tenant RLS, audit, DLQ |
| Validation | zod | Schema validation eventos |
| Meta CAPI | fetch nativo + zod | Sem SDK (controle total) |
| Google Ads | google-ads-api (`google-ads-api` npm) | SDK oficial mantido |
| Crypto | Node crypto.subtle | SHA-256 pra hashing PII |
| Deploy | Vercel staging | Free tier suficiente fase 1 |

---

## Setup local (15min)

### Pré-requisitos

- Node 20+
- pnpm 9+
- Supabase project criado (sa-east-1)
- Meta Business Manager + Pixel ID + System User Token
- Google Ads Manager Account + OAuth client + Developer Token

### 1. Install

```bash
cd docs/projects/crm-novo/60-bridge-standalone
cp .env.example .env.local
pnpm install
```

### 2. Configurar Supabase

```bash
# Em outro terminal, no Supabase project:
psql $SUPABASE_DB_URL -f db/0001_initial.sql
```

### 3. Configurar env vars

Edite `.env.local` com:

- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- `META_PIXEL_ID` + `META_ACCESS_TOKEN` (System User token)
- `META_TEST_EVENT_CODE` (TEST12345 enquanto não saiu de test mode)
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CLIENT_ID` + `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN` (gerado via OAuth flow inicial — ver `scripts/google-oauth.ts`)
- `GOOGLE_ADS_CUSTOMER_ID` (sem hifens)
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` (MCC ID, se aplicável)
- `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY`

### 4. Run dev

```bash
pnpm dev    # Next.js + Inngest dev server
```

Inngest dev server abre em `http://localhost:8288` — UI pra disparar events manual.

### 5. Test event

```bash
pnpm test:event   # Roda scripts/test-event.ts
```

Envia 1 evento de teste pra cada função. Verifica:
- audit_log row criada
- Meta Events Manager test events recebeu o ping
- Google Ads logs upload (pode demorar até 24h pra aparecer)

---

## Deploy staging (10min)

### Vercel

```bash
cd 60-bridge-standalone
vercel link
# Conecta ao projeto Vercel `crm-bridge-staging`

# Configura env vars no Vercel Dashboard:
# Settings → Environment Variables → Add all from .env.local
# Mark all as "preview" environment (não production yet)

vercel deploy
```

### Inngest

1. Vai em `https://app.inngest.com`
2. Add new App → Connect Vercel deploy URL
3. Inngest auto-descobre functions via `/api/inngest`

---

## Como disparar (Week 0 dogfooding)

### Opção A: via curl direto

```bash
curl -X POST https://YOUR-VERCEL-URL/api/manual-trigger \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $MANUAL_TRIGGER_TOKEN" \
  -d '{
    "type": "lead.qualified",
    "tenant": "tocks",
    "lead_id": "lead_abc123",
    "whatsapp_e164": "+5511999998888",
    "valor_estimado": 18000,
    "ad_source": "meta_carrossel_v3",
    "gclid": "Cj0KCQiAxxxxxxxxxxx"
  }'
```

### Opção B: via Inngest UI

1. Abre Inngest dashboard
2. Send event → name `tocks/lead.qualified`
3. Cola payload como JSON

### Opção C: via planilha (custom Apps Script)

Ver `scripts/sheets-trigger.gs` (Google Apps Script) — coluna `disparar` na planilha aciona webhook.

---

## Validação smoke test

Após cada disparo, verifica:

1. **Inngest dashboard** → function executou ✓ todos os steps
2. **Supabase `audit_log`** → 1 row com `status='completed'`, `meta_response`/`google_response` populados
3. **Meta Events Manager** → seu Pixel mostra event "Lead" em Test Events (TEST12345)
4. **Google Ads** → Conversion log na conta MCC mostra "1 uploaded" (pode demorar até 24h)

**Se algum falhar:**
- Row em `dlq_events` com payload + erro
- Resolva manualmente (config, token, schema, etc)
- Rode `pnpm dlq:replay <event_id>` pra reprocessar

---

## Customer Need (Week 0 Day 5 dogfooding)

Durante o dogfooding, monitora:

- **Bridge success rate:** quantos lead.qualified events disparados × quantos chegaram both Meta+Google = % verde
- **Latência média:** segundos do dispatch ao success
- **Idempotency working:** dispare 2x mesmo `event_id` → audit_log tem apenas 1 row com `status=completed`, 2ª chamada retorna do cache
- **DLQ activity:** quantas vezes caiu em DLQ?

Estes números entram no Gate 0 (Day 7) como "Bridge funcional?" check.

---

## Limitações conhecidas (Week 0)

| Limitação | Por quê | Quando resolver |
|-----------|---------|-----------------|
| Sem rate limiting próprio | Inngest já tem retry exponencial | Sprint 1 se volume passar de 100/dia |
| Sem alertas Slack/email em DLQ | Bridge standalone não precisa | Sprint 2 (integrar com Resend) |
| Sem dashboard custom | Inngest UI suficiente | Sprint 3 (UI CRM) |
| Sem multi-currency | BRL hardcoded | Quando entrar tenant fora BR |
| Sem auth no manual-trigger | Token simples Bearer | Sprint 1 (Supabase JWT) |
| Sem schema versioning estrito | Zod valida payload mas não migra | Sprint 1 (event_schema_version) |
| Google OAuth refresh token expira | 7 dias se app em test-mode no GCP | Pré-go-live: GCP app verification |

---

## Arquivos importantes

```
60-bridge-standalone/
├── README.md                              # Este arquivo
├── package.json                           # Dependencies
├── tsconfig.json                          # TS strict
├── .env.example                           # Vars necessárias
├── src/
│   ├── client.ts                          # Inngest client + env validation
│   ├── api/
│   │   ├── inngest.ts                     # Inngest webhook handler
│   │   └── manual-trigger.ts              # Endpoint disparar manual
│   ├── functions/
│   │   ├── lead-qualified-bridge.ts       # Function principal
│   │   ├── deal-won-bridge.ts             # Function deal won
│   │   └── dlq-replay.ts                  # Replay DLQ manual
│   └── lib/
│       ├── supabase.ts                    # Supabase client singleton
│       ├── meta-capi.ts                   # Meta CAPI client + zod
│       ├── google-oc.ts                   # Google Ads OC client
│       ├── audit.ts                       # Audit logger
│       └── idempotency.ts                 # Hash + dedup key
├── db/
│   └── 0001_initial.sql                   # Schema: audit_log + dlq_events + idempotency_keys
└── scripts/
    ├── test-event.ts                      # CLI: dispara test events
    └── google-oauth.ts                    # CLI: gera refresh token Google
```

---

## Próximos passos

- [ ] Reservar 60min pra `pnpm install + cp .env + psql migration` (Day 3 manhã)
- [ ] Conseguir Google Ads Developer Token (formulário, ~24h aprovação) — **bloqueia tudo se não tiver**
- [ ] Conseguir Meta System User Token (Business Manager → Users → System Users)
- [ ] Rodar `pnpm dev` + 1 test event (Day 3 tarde)
- [ ] Deploy Vercel staging (Day 3 noite)
- [ ] Integrar com planilha dogfooding ou Inngest UI (Day 5 morning)
- [ ] Monitorar bridge success rate durante o dia (Day 5)
- [ ] Compilar métricas pra Gate 0 review (Day 7)

---

## Migração pra produção (Sprint 1+)

Quando Gate 0 fechar verde:

1. **Move pra apps/bridge/** no monorepo principal (de `docs/projects/crm-novo/60-bridge-standalone/`)
2. **Migra schema** pra DB de produção (Supabase prod sa-east-1)
3. **Deploy production** Vercel (env vars production)
4. **Google Ads GCP verification** (sair de test-mode, evitar 7d refresh token expiry)
5. **Meta sair de test event code** (deixar `META_TEST_EVENT_CODE` vazio em prod)
6. **Alertas DLQ** via Resend (email pro Breno toda vez que DLQ row criada)
7. **Webhook real do CRM** futuro substitui `/api/manual-trigger`

---

*Bridge é o moat. Constrói direito. Audit + idempotency são non-negotiable.*
