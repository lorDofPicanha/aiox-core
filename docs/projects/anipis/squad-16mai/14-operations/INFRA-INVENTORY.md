# Anipis — Inventário de Servidores / Infraestrutura

**Data:** 2026-05-18
**Status:** Pre-Closed-Beta (30/Mai)
**Auditor:** Orion (aios-master) coordenando @omar-santos + @john-kindervag + @tanya-janca
**Escopo:** Toda infraestrutura que sustenta o produto Anipis em produção

---

## TL;DR

**6 serviços externos + 2 ambientes próprios.** Plataforma de deploy do API **ainda não decidida** (Dockerfile existe, mas sem `fly.toml`/`railway.json`). 1 vendor (Upstash) **precisa migrar pra São Paulo** antes da assinatura SCC. 1 vendor (Langfuse) **ainda no Cloud** — meta é self-host BR.

---

## Stack overview

```
┌────────────────────────────────────────────────────────────────────┐
│ FRONTEND (PWA)                                                     │
│   Next.js 15+ App Router → Vercel (FREE tier OK pra Closed Beta) │
│   vercel.json: filter=@serenity-ai/web, output=apps/web/.next      │
└────────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS + Bearer JWT
┌────────────────────────────────────────────────────────────────────┐
│ API BACKEND (Fastify 5.x + TypeScript)                             │
│   Node 22 alpine container (Dockerfile pronto)                     │
│   Plataforma: TBD (Railway / Fly.io / Magalu Cloud / GCP Cloud Run)│
│   Health: GET /health (porta 3001)                                 │
└────────────────────────────────────────────────────────────────────┘
                              ↓
       ┌──────────┬───────────┬──────────┬─────────┬──────────┐
       ↓          ↓           ↓          ↓         ↓          ↓
┌─────────┐ ┌──────────┐ ┌─────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│Supabase │ │ Upstash  │ │ OpenAI  │ │Anthropic│ │Sentry │ │Langfuse  │
│Postgres │ │  Redis   │ │GPT-4o-m │ │Claude H │ │ Errors│ │ LLM Obs  │
│ + Auth  │ │Rate+Cache│ │  ZDR    │ │  ZDR    │ │       │ │Self-host │
│   BR    │ │us-east-1 │ │   US    │ │   US    │ │   US  │ │  meta:BR │
└─────────┘ └──────────┘ └─────────┘ └────────┘ └────────┘ └──────────┘
   PRIMARY    MIGRATE!     ZDR PEND   ZDR PEND   ✅ DEV-3   PENDING
```

---

## Inventário detalhado

### 1. Frontend — Vercel ✅

| Atributo | Valor |
|----------|-------|
| **Plataforma** | Vercel |
| **Plano** | Hobby (free) → Pro post-launch |
| **Região** | Auto (edge global, primary US-east) |
| **Framework** | Next.js 15+ App Router |
| **Build cmd** | `npx turbo run build --filter=@serenity-ai/web` |
| **Output** | `apps/web/.next` |
| **Domain** | TBD — `anipis.com.br` ou subdomain |
| **CDN** | Vercel Edge (auto) |
| **Cost (Beta)** | $0 (gratuito até 100GB transfer/mo) |
| **Cost (estimated post-launch)** | $20/mês Pro tier |
| **Owner** | Founder |
| **SSL** | Auto via Vercel (Let's Encrypt) |
| **Headers** | Configurados via next.config.js (verificar CSP, HSTS, X-Frame-Options) |
| **Status** | ✅ Pronto pra Beta |
| **Risk** | ⚠️ Verificar CSP no `next.config.js` cobre todos os domínios (Supabase + Sentry + Langfuse) |

**Action items:**
- [ ] Confirmar domain SSL + DNS apontando
- [ ] Validar CSP em produção (script-src, connect-src, img-src)
- [ ] Habilitar Vercel Analytics (opcional, free 10k events/mo)

---

### 2. API Backend — TBD (Dockerfile pronto) ⏳

| Atributo | Valor |
|----------|-------|
| **Container** | `node:22-alpine` multi-stage (builder + runner) |
| **Runtime user** | `serenity:nodejs` UID 1001 (não-root ✅) |
| **Health check** | `wget /health` 30s interval, 3 retries |
| **Port** | 3001 |
| **Build size** | TBD (estimado 200-300MB com node_modules production) |
| **Plataforma** | **NÃO DECIDIDA** — opções: Railway / Fly.io / Magalu Cloud / GCP Cloud Run |
| **Região alvo** | **São Paulo (sa-east-1 ou equivalente BR)** |
| **CPU/RAM** | 0.5 vCPU / 512MB-1GB suficiente pra Beta (~20 users) |
| **Auto-scale** | Beta: 1 instância. Post-launch: 2-10 instâncias |
| **WebSocket** | Suportado (já no Dockerfile via @fastify/websocket) |
| **Cost (Beta)** | ~$5-20/mês dependendo de plataforma |
| **Cost (estimated post-launch)** | $30-100/mês |
| **Owner** | Founder + DevOps (a definir) |
| **Status** | ⏳ Plataforma + região + observability stack a decidir antes Beta |
| **Risk** | 🟠 Sem plataforma decidida = sem env vars provisionadas = bot blocked |

**Recomendação:**

| Plataforma | Pros | Cons | Recomendado p/ Anipis? |
|------------|------|------|------------------------|
| **Railway** | Setup 5min, BR region disponível, Postgres add-on, free trial | Pricing pode escalar | 🟢 **MELHOR pra Closed Beta** |
| **Fly.io** | Multi-region, edge BR disponível (gru-sp), pricing previsível | Mais complexo, requer `fly.toml` | 🟡 Boa pra production scale |
| **Magalu Cloud** | BR nativo, soberania de dados, sem transferência internacional do API host | Ecossistema menor, docs limitados | 🟡 Política/posicionamento BR; mais trabalho |
| **GCP Cloud Run** | Serverless, escala bem, BR region (sao-paulo) | WebSocket suporte limitado, cold start | 🔴 Não recomendo (WS é crítico) |
| **Vercel (mesma do front)** | Mesmo painel, env vars compartilhadas | Sem suporte WebSocket persistente (Edge functions têm timeout) | 🔴 Não recomendo |

**Decisão sugerida:** **Railway com região BR** para Beta. Migrar pra Fly.io ou Magalu Cloud se scale demandar.

**Action items P0:**
- [ ] **Founder decide plataforma** (Railway recomendado)
- [ ] Provisionar projeto + região BR
- [ ] Configurar **todas as env vars** (ver §3 abaixo)
- [ ] Smoke test: deploy → curl /health → 200 OK
- [ ] Configurar custom domain `api.anipis.com.br`

---

### 3. Database — Supabase ✅

| Atributo | Valor |
|----------|-------|
| **Plataforma** | Supabase |
| **Região** | **South America (São Paulo)** — sa-east-1 ✅ verificar |
| **Plano** | Free tier (500MB DB, 50k auth users) → Pro $25/mês post-launch |
| **Postgres** | 15+ |
| **Tables com RLS** | 11+ no `000_full_schema.sql` (✅ verificado) |
| **Auth provider** | Supabase Auth (JWT + magic link + email/password) |
| **Service Role Key** | Em env `SUPABASE_SERVICE_ROLE_KEY` (NÃO expor frontend) |
| **Anon Key** | Em env `SUPABASE_ANON_KEY` (safe frontend) |
| **Backup PITR** | 7 dias rolling (Pro tier) |
| **Migrations** | 14 arquivos em `apps/serenity-ai/apps/api/src/db/migrations/` |
| **ORM** | Drizzle ORM (TypeScript-first, parameterized queries) |
| **Connection pool** | Postgres.js (postgres lib) |
| **Cost (Beta)** | $0 (free tier suficiente p/ 20 users) |
| **Cost (estimated post-launch)** | $25/mês Pro |
| **Owner** | Founder |
| **Status** | ✅ Provisionado e operacional |
| **Risk** | 🟡 **F5 do audit** — verificar RLS em `deletion_requests`, `pii_audit_log`, `age_verifications` |

**Action items:**
- [ ] Confirmar região é `sa-east-1` (BR) — não US
- [ ] Validar `SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('deletion_requests','pii_audit_log','age_verifications')` em staging
- [ ] Confirmar PITR habilitado (Pro tier para Closed Beta — vale upgrade)
- [ ] Rodar `npm run db:migrate` em produção e verificar 14 migrations aplicadas

---

### 4. Cache + Rate Limit — Upstash Redis ⏳ MIGRATE

| Atributo | Valor atual | Valor alvo |
|----------|-------------|------------|
| **Plataforma** | Upstash | Upstash |
| **Região** | **us-east-1 (US)** ⚠️ | **aws-sa-east-1 (São Paulo)** 🎯 |
| **Plano** | Free tier | Pro (~$10/mês — necessário para BR region) |
| **Tipo** | Regional, HTTP REST | Regional, HTTP REST |
| **Uso** | Rate limit chat (30/h), cache de sessão, WS conn cap | (mesmo) |
| **Env vars** | `UPSTASH_REDIS_URL` + `UPSTASH_REDIS_TOKEN` | (mesmo) |
| **Eviction** | TBD (verificar `noeviction` no Upstash console) | `noeviction` obrigatório (rate limits) |
| **TLS** | Habilitado | Habilitado |
| **Cost (Beta)** | $0 free tier | $10/mês Pro |
| **Owner** | Founder |
| **Status** | 🟠 PENDING MIGRATION (ver `DEV-4-upstash-sao-paulo-migration.md`) |
| **Risk** | 🟠 Migration sai do SCC scope (Upstash deixa de ser subprocessador US) |

**Action items:**
- [ ] Founder valida plano Upstash Pro com BR region
- [ ] Criar instância nova `aws-sa-east-1`
- [ ] Smoke test local com nova URL/token
- [ ] Cutover em janela baixa (~5min downtime — rate limits resetam, aceitável)
- [ ] Atualizar SCC Anexo III com nova região

---

### 5. LLM Primary — OpenAI (GPT-4o-mini) ⏳ ZDR PENDING

| Atributo | Valor |
|----------|-------|
| **Provider** | OpenAI Enterprise |
| **Modelo primary** | GPT-4o-mini |
| **Região** | US (não há opção BR) |
| **API endpoint** | api.openai.com (padrão SDK) |
| **Auth** | API Key via `OPENAI_API_KEY` |
| **ZDR (Zero Data Retention)** | ⏳ **PENDING** — founder precisa enrollar via dashboard |
| **Env enforcement** | `OPENAI_ZDR_CONFIRMED=true` (boot fail-closed em prod — DEV-5) |
| **Rate limits** | OpenAI tier-based (geralmente 500 RPM, 60k TPM no tier 1) |
| **PII handling** | ✅ `redactedMessageTail()` no llm-router redacta input antes do send |
| **Latency target** | <10s (LLM_TIMEOUT_MS) |
| **Cost estimate (Beta)** | ~$2-5/mês (20 users × ~50 msgs × ~$0.001/msg) |
| **Cost estimate (1k users)** | ~$300-500/mês |
| **Owner** | Founder |
| **Status** | ⏳ ZDR enrollment é P0 pra Beta |

**Action items:**
- [ ] **Founder enrolla OpenAI ZDR** via https://platform.openai.com/settings/organization/data-controls
- [ ] Aguarda confirmação por email (~24h)
- [ ] Setta `OPENAI_ZDR_CONFIRMED=true` em prod
- [ ] Verifica boot log: `Server running` (não `[FATAL] Production boot requires ZDR...`)

---

### 6. LLM Fallback — Anthropic (Claude Haiku) ⏳ ZDR PENDING / OPTIONAL

| Atributo | Valor |
|----------|-------|
| **Provider** | Anthropic |
| **Modelo fallback** | Claude Haiku 3.5 |
| **Região** | US (não há opção BR) |
| **API endpoint** | api.anthropic.com |
| **Auth** | API Key via `ANTHROPIC_API_KEY` |
| **ZDR (Zero Data Retention)** | ⏳ **PENDING** — requer contrato Enterprise (~$30k/ano min) |
| **Env enforcement** | `ANTHROPIC_ZDR_CONFIRMED=true` (DEV-6) |
| **Uso** | Apenas FALLBACK após 2 tentativas falhadas OpenAI |
| **Cost estimate** | Mínimo — só dispara em falha OpenAI (~5% das requests) |
| **Owner** | Founder |
| **Status** | ⏳ Decisão founder: enrollar Enterprise OU remover Anthropic do MVP |

**Trade-off:**
- **Opção A**: Pagar Anthropic Enterprise (~$30k/ano) → ZDR ativo, fallback funcional
- **Opção B**: Remover `ANTHROPIC_API_KEY` do prod → boot passa (ANTHROPIC_ZDR não required), perde resilience multi-provider
- **Recomendação**: **Opção B para Closed Beta** ($0 extra), avaliar Opção A pós-Beta com dados de uso real

---

### 7. Error Monitoring — Sentry ✅

| Atributo | Valor |
|----------|-------|
| **Provider** | Sentry SaaS |
| **Região** | US (Sentry não tem BR region) |
| **Plano** | Free Developer (5k errors/mo) → Team $26/mês post-launch |
| **DSN backend** | `SENTRY_DSN_API` env |
| **DSN frontend** | `NEXT_PUBLIC_SENTRY_DSN` env |
| **PII scrub** | ✅ **6-layer hardening** via `SENTRY_HARDENED_OPTIONS` (DEV-3) |
| **Retention** | 90 dias |
| **Source maps** | A configurar (Next.js auto-upload) |
| **Owner** | Founder |
| **Status** | ✅ Code-side hardened. Operacional pendente DSN config |
| **Risk** | 🟡 SCC squad recomenda configurar Sentry org-level data scrubbing como defense-in-depth |

**Action items:**
- [ ] Criar projeto Sentry "Anipis API" + "Anipis Web"
- [ ] Configurar Sentry org-level scrubbing rules (regex CPF/email/phone)
- [ ] Smoke test: provocar erro síntetico com CPF → verificar Sentry UI mostra `[CPF]` redacted
- [ ] Configurar alertas — error rate spike + new error types

---

### 8. LLM Observability — Langfuse (Self-host BR alvo) ⏳

| Atributo | Valor atual | Valor alvo |
|----------|-------------|------------|
| **Provider** | Langfuse Cloud (US) | **Langfuse self-host BR** (Magalu/Render/Vercel) |
| **Plano** | Free tier | Self-hosted (custo infra) |
| **Auth** | `LANGFUSE_PUBLIC_KEY` + `LANGFUSE_SECRET_KEY` |
| **Host env** | `LANGFUSE_HOST` (default cloud) | URL self-host BR |
| **Habilitado** | `LANGFUSE_ENABLED=true` (graceful no-op se false) |
| **PII redaction** | ✅ `redactForObservability()` pré-send |
| **Retention** | Cloud: 30 dias free | Self-host: configurável |
| **Cost (Beta)** | $0 free tier | $5-20/mês self-host |
| **Owner** | Founder + DevOps |
| **Status** | 🟡 OK para Beta com Cloud, **self-host BR é meta pra production** |

**Action items:**
- [ ] Setup projeto Langfuse Cloud para Beta (Demis spec)
- [ ] Smoke test: enviar 1 trace, verificar PII redacted
- [ ] Planejar self-host BR migration pós-Beta (2-3 dias dev)

---

## Resumo de subprocessadores (para SCC v2)

| # | Vendor | Região atual | Região alvo | Status SCC | Status ZDR | Status no boot |
|---|--------|--------------|-------------|------------|------------|----------------|
| 1 | Vercel | US (edge global) | (manter) | ⏳ Anexo VI | n/a | ✅ |
| 2 | API Host (Railway?) | TBD | **BR (sa-east-1)** | ⏳ adicionar Anexo VII | n/a | ⏳ DECIDIR |
| 3 | Supabase | BR (sa-east-1) ✅ | (manter) | ✅ Anexo I | n/a (BR) | ✅ |
| 4 | Upstash Redis | US (us-east-1) ⚠️ | **BR (aws-sa-east-1)** 🎯 | ⏳ Anexo III (atualizar) | n/a (BR após migration) | 🟠 DEV-4 |
| 5 | OpenAI | US | (manter) | ⏳ Anexo II | ⏳ ZDR pending | 🟠 DEV-5 |
| 6 | Anthropic | US | (manter OR remove) | ⏳ Anexo II | ⏳ ZDR pending ou remover | 🟠 DEV-6 |
| 7 | Sentry | US | (manter) | ⏳ Anexo IV | n/a | ✅ DEV-3 done |
| 8 | Langfuse | US (cloud) ⚠️ | **BR self-host** (pós-Beta) | ⏳ Anexo V | n/a | 🟡 |

**Total US subprocessors post-Beta-fixes:** 5 (Vercel + OpenAI + Anthropic + Sentry + ??)
**Total US subprocessors após Anthropic removed + Upstash migrate + Langfuse self-host BR:** 3 (Vercel + OpenAI + Sentry)

---

## Action items consolidados (founder)

### P0 (block Beta)
1. **Decidir + provisionar API host** (Railway recomendado, região BR)
2. **OpenAI ZDR enrollment** (~24h dashboard)
3. **Anthropic decision**: Enterprise OU remover key
4. **Supabase Pro tier** (PITR backup) + verificar região BR
5. **Sentry projeto criado** + scrubbing rules

### P1 (fix em 48h pré-Beta)
6. **Upstash migration** us-east-1 → aws-sa-east-1
7. **CSP frontend** verificado em produção
8. **F5 RLS audit** em 3 tabelas

### P2 (durante Beta window)
9. **Langfuse self-host BR** planning
10. **DNS + custom domains** (`anipis.com.br`, `api.anipis.com.br`)
11. **Sentry alertas** configurados

---

**Custo total estimado Closed Beta (30/Mai - 14/Jun):** ~$50-80 (Supabase Pro + Railway BR + Upstash Pro + Sentry free + OpenAI usage)

**Custo total estimado post-Beta (1000 users/mo):** ~$400-600/mês

— Orion 🎯 coordenando @omar-santos + @john-kindervag + @tanya-janca
