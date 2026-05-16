# UltraPlan — CRM Novo Implementation Blueprint

**Skill aplicada:** `ultraplan` (5 fases)
**Data:** 2026-05-15
**Status:** v1.0 final
**Phase mode:** Conclave inline (brain-bridge consultations diferido — Anthropic API balance low)

---

## 🎯 Executive Summary

Build CRM custom multi-tenant (Tocks + Bretda + Vorza) em **8 semanas MVP V0** com 30 features prioritárias, 3 KILL gates não-negociáveis, stack Next.js 16 + Supabase + WhatsApp Cloud API + Inngest. Critical path: WhatsApp Business Verification (Week 1 submit) + RLS multi-tenant foundation (Week 1-2) + Bridge Meta/Google offline conv (Week 5-7). KILL trigger Week 4: Business Verification não aprovado OU inbox WhatsApp não funcional.

---

## Phase 1 — Deep Context Gathering ✅

| Source | Status |
|--------|--------|
| `00-context/CONTEXT.md` | ✅ Loaded |
| `10-research/06-tech-research.md` | ✅ Loaded |
| `20-brainstorm/01-features-brainstorm.md` | ✅ Loaded |
| `10-research/00-hydra-run-summary.md` | ✅ Loaded |
| Memory: session_full_15mai, KR pattern, F-CRM-Upload-Void | ✅ Internalized |
| Constitution AIOS (CLI First, Story-Driven) | ✅ Cross-referenced |
| Git history recente (last 20 commits) | ✅ feat/hydra-resilience-sprint context |

---

## Phase 2 — Multi-Expert Consultation (Inline Conclave)

**5 experts simulados** (não consulted via brain-bridge MCP — diferido):

### Expert 1: **martin-fowler** (Architecture patterns)

**Consensus:**
- Modular monolith > microservices Phase 1. 1 desenvolvedor solo = avoid distributed systems trap.
- Bounded contexts: `auth`, `crm-core`, `messaging`, `conversion-bridge`, `lgpd`. Cada um pode evoluir pra service separado se preciso.
- Strangler Fig se algum dia migrar pra microservices.

**Blind spot caught:**
- "Inngest workflows estão fora do monolith — não esquecer que workflow timeouts/retries criam estado distribuído. Idempotency keys são contrato com Meta/Google APIs, não internal."

### Expert 2: **paul-copplestone** (Supabase founder)

**Consensus:**
- RLS multi-tenant pattern: sim, mas **CADA query** que cruza tenants precisa explicit `tenant_id IN (...)` filter MESMO COM RLS. Razão: query planner usa index melhor.
- Auth hook para inserir `tenant_id` no JWT app_metadata na auth.signup callback.
- Migrations: usar Supabase CLI + GitHub Actions. NÃO mexer schema na UI prod.
- Realtime channel scoping: `tenant:${tenant_id}:inbox` — não single channel per app.

**Blind spot caught:**
- "Supabase Storage RLS é separado de Postgres RLS — esqueça policy lá e medias WhatsApp vazam cross-tenant. Test EXPLICITAMENTE."

### Expert 3: **werner-vogels** (Cloud distributed)

**Consensus:**
- Vercel Functions têm timeout 60s (Pro). Inngest workflows pra qualquer coisa >30s.
- Idempotency tokens nas calls externas (Meta CAPI, Google OC) usando `deal.id + event_type` como key.
- Circuit breaker pattern pra Meta WhatsApp API quando rate limited.
- Eventual consistency: WhatsApp webhook → DB → Realtime → UI pode ter 100-500ms gap. Document, don't fight.

**Blind spot caught:**
- "Você está pensando em deploy single-region (sa-east-1 Supabase + global Vercel). Bom. Mas NUNCA ferramentas que reescrevam dados Postgres em vários lugares — pgVector locally suffice, não Pinecone."

### Expert 4: **jason-lemkin** (SaaS economics)

**Consensus:**
- 8 semanas MVP é AGGRESSIVE pra solo dev. Expect 10-12. Sandbag pra 12.
- Tocks pilot Week 8: USE REAL leads, não fake. 1 vendedor full-time.
- Não construir features V1 antes de V0 estabilizar — Tocks resolve V0, Bretda valida V1, Vorza valida V2.
- "Marketing automation Phase 2" — pulled forward de Phase 3 se Vorza email pivot precisar.
- Tracking metrics MVP: leads/d, response time avg, deals qualified/d, bridge upload success rate.

**Blind spot caught:**
- "Você está sub-orçando manutenção. Solo dev = 30% tempo em manutenção, 70% features. Adjust roadmap accordingly."

### Expert 5: **patricia-peck** (LGPD BR specialist)

**Consensus:**
- Consent ledger DESDE DIA 1, não defer. Difícil retrofit consent depois.
- ROPA auto-gen é diferencial vs SaaS BR (HubSpot/Salesforce manual).
- DPA com Tocks/Bretda/Vorza ANTES de leads reais entrarem (Week 4 latest, antes pilot).
- 15d response SLA significa **endpoint funcional** + monitor + alert quando solicitação chega.
- 72h breach notification: tem que ter incident response runbook + ANPD contact info pre-configured.

**Blind spot caught:**
- "Você está aceitando Click-to-WhatsApp como consent implícito. CORRETO juridicamente, mas register source = 'CTW Ad ID XXX' no consent_ledger pra prova. ANPD pode pedir."

### Conclave Synthesis

**CONSENSUS (5/5):**
- Modular monolith Next.js + Supabase é stack certa
- RLS multi-tenant single-DB com tenant_id em toda tabela + index
- Inngest workflows pra qualquer operação >30s (bridges, LGPD erasure)
- 12 semanas realista MVP (não 8) — sandbag agressivo
- Consent ledger desde dia 1

**DISSENT pontual (2/5):**
- jason-lemkin sugere puxar V1 marketing automation forward (Vorza pivot). Outros: hold V1 pós-V0.
- martin-fowler quer DDD bounded contexts formais. Outros: pragmatic modules suffice.

**BLIND SPOTS críticos:**
1. Supabase Storage RLS separado (paul-copplestone) — TESTE EXPLICITAMENTE
2. Solo dev manutenção 30% (jason-lemkin) — adjust expectations
3. CTW consent source registry (patricia-peck) — log Ad ID em consent_ledger
4. Realtime channel scoping per tenant (paul-copplestone) — NÃO single channel
5. Idempotency keys cross-platform (werner-vogels) — `deal.id + event_type`

**VERDICT:** Proceed with 12-week MVP roadmap (não 8). 3 gates non-negotiable. Blind spots addressed em design.

---

## Phase 3 — Risk Modeling

### Risk Matrix (Probability × Impact = Score)

| ID | Risk | Probability (1-5) | Impact (1-5) | Score | Severity |
|----|------|-------------------|--------------|-------|----------|
| R-01 | Meta WhatsApp Business Verification rejected/delayed >2 weeks | 3 | 5 | **15** | 🔴 HIGH |
| R-02 | Anthropic API balance volta a quebrar (HYDRA/AI features) | 4 | 2 | 8 | 🟡 MED |
| R-03 | Bridge Meta CAPI/Google OC silently fails | 3 | 5 | **15** | 🔴 HIGH |
| R-04 | RLS policy bug exposes cross-tenant data | 2 | 5 | 10 | 🟠 HIGH |
| R-05 | Solo dev burnout / bus factor 1 | 3 | 4 | 12 | 🟠 HIGH |
| R-06 | Tocks team rejects UX after pilot | 3 | 4 | 12 | 🟠 HIGH |
| R-07 | LGPD audit / ANPD complaint | 1 | 5 | 5 | 🟢 LOW |
| R-08 | Supabase region sa-east-1 outage >4h | 1 | 4 | 4 | 🟢 LOW |
| R-09 | Vercel Functions timeout 60s breaking flows | 4 | 2 | 8 | 🟡 MED |
| R-10 | WhatsApp Cloud API pricing changes 50%+ | 2 | 3 | 6 | 🟢 LOW |
| R-11 | Schema migration in prod breaks data | 2 | 5 | 10 | 🟠 HIGH |
| R-12 | Solo dev shipping bugs to prod (no review) | 4 | 3 | 12 | 🟠 HIGH |
| R-13 | Inngest free tier 100k steps/mo exceeded | 2 | 2 | 4 | 🟢 LOW |
| R-14 | Tocks resists migrating from current workflow | 3 | 3 | 9 | 🟡 MED |
| R-15 | Build velocity 50% slower than estimate | 4 | 3 | 12 | 🟠 HIGH |

### Mitigations (top 5 high-severity)

**R-01 Business Verification delay:**
- Mitigation: Submit Week 1 com docs Tocks Custom Móveis Ltda + CNPJ + comprovante endereço + Tocks domain ownership
- Contingency: Se delay >3 weeks, fallback temporário Take Blip BSP wrapper (1 number Tocks) enquanto resolve. Bretda/Vorza aguardam.
- Owner: User (Breno)

**R-03 Bridge silently fails (F-CRM-Upload-Void redux):**
- Mitigation: Dead-letter queue + alert + dashboard count match (CRM Lead Qualified count vs Meta CAPI count vs Google OC count, daily reconcile cron)
- Contingency: Manual upload procedure documented + tested per platform
- Owner: @aios-dev (Week 5-7 implementação)

**R-04 RLS cross-tenant leak:**
- Mitigation: pgTAP tests em CI + integration test suite (cross-tenant assert all blocked) + Sentry alert rule
- Contingency: Service downgrade announcement + audit log review + post-mortem
- Owner: @aios-data-engineer + @aios-qa

**R-05 Solo dev burnout:**
- Mitigation: Hard cap 30h/semana CRM Novo. Outras prioridades (Bretda, Tocks ops) competem.
- Contingency: Aceitar 16 semanas MVP em vez de 12. KILL trigger Week 8 review.
- Owner: User self-management

**R-06 Tocks team rejection:**
- Mitigation: Co-design Week 2-3 com equipe Tocks (Vorza pode co-design Week 6-7 antecipando V1). Wireframes review BEFORE implementação.
- Contingency: Roll back to Sales AI parcial + redesign 2 weeks.
- Owner: User + Tocks team

---

## Phase 4 — Implementation Blueprint

### Critical Path (Week 1 → 12)

```
Week 1-2: FOUNDATION
├─ [W1] WhatsApp Business Verification submit (USER ACTION — D+1 ASAP)
├─ [W1] Supabase project sa-east-1 + Next.js 16 monorepo bootstrap
├─ [W1] Auth (Supabase Auth + JWT tenant_id claim)
├─ [W2] Schema base v0 (tenants, users, contacts, deals, activities, whatsapp_messages, consent_ledger, audit_log)
├─ [W2] RLS policies + pgTAP tests + cross-tenant assert
└─ [W2] Inngest setup + first workflow scaffold
   │
Week 3-4: WHATSAPP CORE
├─ [W3] WhatsApp Cloud API webhook receiver (signature, dedupe)
├─ [W3] Contact upsert (tenant_id, phone) + activity logging
├─ [W3] Multi-number per tenant config
├─ [W4] Inbox view real-time (Supabase Realtime per tenant channel)
├─ [W4] Conversation view + send (free-form 24h CSW + HSM templates)
├─ [W4] Smoke test endpoint (/api/whatsapp/smoke-test KR prevention)
└─ 🚨 GATE 1: Business Verification approved + Inbox funcional. KILL if NO.
   │
Week 5-7: BRIDGE + PIPELINE
├─ [W5] Inngest workflows: lead.created → Meta CAPI Lead event
├─ [W5] Inngest workflows: deal.qualified → Meta CAPI Lead Qualified + Google OC
├─ [W5] Idempotency keys (deal.id + event_type)
├─ [W5] Dead-letter queue + alert dashboard
├─ [W6] Pipelines + deals + stages + transitions (deal_stage_history)
├─ [W6] Kanban board view (mobile-friendly drag)
├─ [W7] Deal detail page + linked WhatsApp + activities
├─ [W7] Conversion event dashboard (status, retry, audit)
└─ 🚨 GATE 2: Bridge E2E test (1 lead Bretda real → Google Ads recebe). KILL if NO.
   │
Week 8: LGPD + REPORTS + PILOT
├─ [W8] Consent ledger captures + revoke endpoint
├─ [W8] Right to erasure + access endpoints
├─ [W8] ROPA auto-gen cron
├─ [W8] Reports basic (funnel + source + time-in-stage)
├─ [W8] Tocks pilot start (1 vendedor full-time, 5 days)
└─ 🚨 GATE 3: Tocks operating 100% via CRM Novo. KILL if NO → revert Sales AI parcial.
   │
Week 9-12: V1 (Bretda/Vorza migration)
├─ [W9-10] PWA install + offline cache + push notifications
├─ [W9] Email (Resend transactional + outbound)
├─ [W10] Calendar (Google Calendar 2-way sync)
├─ [W11] Forms (no-code builder + embed)
├─ [W11] Reports advanced (cohort + win/loss + export)
├─ [W12] Templates + saved replies + auto-assignment
├─ [W12] Bretda migration (paralelo Tocks operando)
└─ [W12] Vorza migration trigger (when email pivot ready)
```

### Detailed Story Breakdown (V0 — Weeks 1-8)

Each story will be `@sm *create-story` + `@dev` implementation + `@qa *gate-check`.

**Sprint 1 (Week 1-2) — Foundation:**

| Story ID | Title | Agent | Effort | Dependencies |
|----------|-------|-------|--------|--------------|
| CRM-1.1 | Supabase project + Next.js 16 monorepo bootstrap | @aios-dev | 8h | — |
| CRM-1.2 | Supabase Auth + JWT tenant_id claim + magic link | @aios-dev | 8h | CRM-1.1 |
| CRM-1.3 | Schema v0 migrations + RLS policies + pgTAP tests | @aios-data-engineer | 16h | CRM-1.1 |
| CRM-1.4 | Tenant onboarding flow (create Tocks/Bretda/Vorza) | @aios-dev | 4h | CRM-1.2, CRM-1.3 |
| CRM-1.5 | Inngest setup + signing keys + first workflow scaffold | @aios-dev | 4h | CRM-1.1 |
| CRM-1.6 | Audit log middleware + cross-tenant E2E test | @aios-qa | 8h | CRM-1.3 |

**Sprint 2 (Week 3-4) — WhatsApp Core:**

| Story ID | Title | Agent | Effort | Dependencies |
|----------|-------|-------|--------|--------------|
| CRM-2.1 | WhatsApp Cloud API webhook receiver (signature verify, dedupe) | @aios-dev | 12h | CRM-1.1 |
| CRM-2.2 | Contact upsert via webhook (tenant_id, phone UNIQUE) | @aios-dev | 6h | CRM-2.1, CRM-1.3 |
| CRM-2.3 | Multi-number per tenant config + tenant routing logic | @aios-dev | 8h | CRM-2.1 |
| CRM-2.4 | Inbox view real-time (Supabase Realtime tenant-scoped) | @aios-dev | 12h | CRM-2.2 |
| CRM-2.5 | Conversation view + free-form send + HSM template send | @aios-dev | 16h | CRM-2.4 |
| CRM-2.6 | Media attachments (Supabase Storage RLS + dedup) | @aios-dev | 8h | CRM-2.5 |
| CRM-2.7 | Smoke test endpoint + automated alert (KR prevention) | @aios-dev | 4h | CRM-2.3 |
| CRM-2.8 | E2E test: send WhatsApp → appear inbox → reply works | @aios-qa | 8h | CRM-2.5 |
| **GATE 1** | Week 4 review: Business Verification + Inbox | User | — | All above |

**Sprint 3 (Week 5-7) — Bridge + Pipeline:**

| Story ID | Title | Agent | Effort | Dependencies |
|----------|-------|-------|--------|--------------|
| CRM-3.1 | Inngest workflow: lead.created → Meta CAPI Lead event | @aios-dev | 8h | CRM-1.5, CRM-2.2 |
| CRM-3.2 | Inngest workflow: deal.qualified → Meta CAPI Lead Qualified | @aios-dev | 8h | CRM-3.1 |
| CRM-3.3 | Inngest workflow: deal.qualified → Google Ads OC batch upload | @aios-dev | 12h | CRM-3.2 |
| CRM-3.4 | Idempotency keys + dead-letter queue + alert | @aios-dev | 8h | CRM-3.3 |
| CRM-3.5 | Conversion event dashboard (status, retry, manual trigger) | @aios-dev | 8h | CRM-3.4 |
| CRM-3.6 | Pipelines + stages + deal CRUD | @aios-dev | 12h | CRM-1.3 |
| CRM-3.7 | Kanban board view (mobile drag-friendly) | @aios-dev | 12h | CRM-3.6 |
| CRM-3.8 | Deal detail + linked WhatsApp + activities | @aios-dev | 8h | CRM-3.6, CRM-2.5 |
| CRM-3.9 | Reconcile cron (daily count match CRM vs Meta vs Google) | @aios-dev | 6h | CRM-3.5 |
| CRM-3.10 | E2E test: Bretda lead → qualified → Google Ads receives | @aios-qa | 8h | CRM-3.9 |
| **GATE 2** | Week 7 review: Bridge E2E success | User + QA | — | All above |

**Sprint 4 (Week 8) — LGPD + Reports + Pilot:**

| Story ID | Title | Agent | Effort | Dependencies |
|----------|-------|-------|--------|--------------|
| CRM-4.1 | Consent ledger captures (CTW source logged) + revoke | @aios-dev | 8h | CRM-1.3 |
| CRM-4.2 | Right to erasure cascade endpoint + 15d SLA monitor | @aios-dev | 8h | CRM-4.1 |
| CRM-4.3 | Right to access export endpoint (JSON download) | @aios-dev | 4h | CRM-4.1 |
| CRM-4.4 | ROPA auto-gen daily cron + tenant admin view | @aios-dev | 6h | CRM-4.1 |
| CRM-4.5 | Reports basic: funnel + source + time-in-stage | @aios-dev | 12h | CRM-3.6 |
| CRM-4.6 | Tocks pilot kickoff: 1 vendedor full-time 5 days | User | — | All above |
| **GATE 3** | Week 8 review: Tocks operating 100% via CRM Novo | User + Tocks team | — | All above |

---

### Resource Estimate

**Stories total V0:** 24 stories (Sprints 1-4)
**Effort total V0:** ~280h dev + 32h QA = **312h** (≈ 7.5 weeks × 40h, com 30% manutenção budget = 10 weeks realista)
**Estimated tokens:** R$3-5k Claude Opus + R$0.5-1k DeepSeek/OpenAI fallback (HYDRA + agents)
**External costs Phase 1:**
- Supabase Pro: $25/mo
- Vercel Pro: $20/mo
- Resend: $20/mo
- Inngest: free tier
- WhatsApp BR rates per message
- **Total: ~$70/mo + WhatsApp variable**

**External dependencies:**
- Meta WhatsApp Business Verification approval (5-30 dias)
- Tocks team availability for pilot Week 8
- Bretda/Vorza migration windows
- Patricia Peck legal pack (DPA per tenant) — bundle com Site-Prospector legal work
- Contador BR (NF SaaS B2B se aplicar)

---

## Phase 5 — Validation

### Constitution AIOS check

| Artigo | Verificação | Status |
|--------|-------------|--------|
| I. CLI First | CRM tem dashboard mas operações core (bridge upload, ROPA gen) acessíveis via CLI scripts | ✅ Pass |
| II. Agent Authority | @aios-dev implementa, @aios-qa gate, @devops push, @data-engineer schema | ✅ Pass |
| III. Story-Driven | 24 stories Sprints 1-4 estruturadas, @sm cria, @dev executa | ✅ Pass |
| IV. No Invention | Stack baseado em research triangulada (Supabase, Next.js, Meta docs oficiais) | ✅ Pass |
| V. Quality First | pgTAP RLS tests + Playwright E2E + Vitest 80%+ coverage | ✅ Pass |
| VI. Absolute Imports | Stack Next.js padrão `@/` aliases | ✅ Pass |

### Circular dependency check

Cross-validation Sprint dependencies graph:
- CRM-1.x → no cycles
- CRM-2.x depends on CRM-1.x only ✅
- CRM-3.x depends on CRM-1.x + CRM-2.x ✅
- CRM-4.x depends on CRM-1.x + CRM-3.x ✅
- **No circular dependencies detected**

### Known blockers cross-reference

| Memory blocker | Impact CRM Novo | Mitigation |
|----------------|-----------------|------------|
| Anthropic API balance low | HYDRA + AI features Phase 3 | PIX Anthropic before Phase 3 |
| Sales AI deprecated | Migration data potencial | ETL script CRM-4.6 (audit + import contacts) |
| KR WABA error pattern | Smoke test obrigatório | CRM-2.7 endpoint + alert |
| F-CRM-Upload-Void | Bridge é killer feature | CRM-3.1 a 3.5 implementação prioritária |
| Bretda gate D+7 22/Mai | Pode demandar CRM-bridge antes Week 8 | Manter Sales AI Tocks operando parallel até Week 8 |

---

## Contingency Plans

| If... | Then... | Decision owner |
|-------|---------|----------------|
| Week 4 Gate 1 fails (Business Verification denied) | Re-submit + temporary BSP wrapper (Take Blip) for 1 number | User |
| Week 7 Gate 2 fails (Bridge incomplete) | Pause V1, extend Sprint 3 +2 weeks. Re-eval Week 9. | User + @aios-dev |
| Week 8 Gate 3 fails (Tocks rejects UX) | Roll back Sales AI Tocks parcial + redesign Sprint 4 features +2 weeks | User + Tocks team |
| Solo dev velocity 50% slower | Extend MVP to 16 weeks. V1 deferred Q3. | User |
| Anthropic API balance not restored | PIX OR migrate HYDRA scoring fully to DeepSeek/OpenAI | User |
| Tocks demands feature outside V0 (e.g. PIX integration) | Decline + add to V2 backlog. V0 scope frozen. | User |
| Supabase outage sa-east-1 >4h | Activate read-only mode + alert tenants + post-mortem | @aios-devops |
| LGPD ANPD complaint | Activate incident response runbook + Patricia Peck consult | User + Legal |

---

## Success Criteria (V0 MVP)

**Hard metrics (Week 8 review):**
- [ ] WhatsApp Cloud API + Business Verification approved
- [ ] Tocks vendedor consegue responder lead em <60s do CRM
- [ ] 1 Bretda lead real → Lead Qualificado → Google Ads OC count match
- [ ] Inbox real-time funcionando (mensagem chega <2s após webhook)
- [ ] Multi-tenant RLS testado (cross-tenant query returns empty)
- [ ] Consent ledger capturando + audit_log popula
- [ ] ROPA gerado automatically para tenants Tocks + Bretda + Vorza
- [ ] Right to erasure endpoint funcional (manual test)
- [ ] Zero leads perdidos / "void" (vs Sales AI 0 fires/30d baseline)

**Soft metrics (qualitative):**
- [ ] Tocks team rates UX ≥7/10 NPS
- [ ] Solo dev sustainable pace (não burn out)
- [ ] Documentation atualizada (READMEs + ADRs + Storybook se UI)
- [ ] Zero critical security findings (pgTAP + OWASP ZAP CI)

---

## Open Decisions for User (post-UltraPlan)

| ID | Question | Default applied | When to revisit |
|----|----------|-----------------|-----------------|
| D-01 | Tocks pilot Week 8 — qual vendedor full-time? | Reservar 1 vendedor sênior por 5 dias | Week 6 confirm |
| D-02 | Vorza migration trigger | Quando email pivot ready (option A/B/C/D Vorza memory 05/Mai) | Week 9-12 |
| D-03 | Patricia Peck DPA bundle | Bundle com Site-Prospector legal work (R$2.5-5k OAB-SC) | Week 4 latest |
| D-04 | CRM domain/subdomain | crm.synkra.com.br? skara.synkra.com.br? | Week 1 |
| D-05 | Spin-off CRM as SaaS Q3 2026 | NOT FOR SALE Phase 1 | Q3 2026 review |

---

## Next Steps

→ **Conclave real** (task #6) — 5 mind clones via brain-bridge MCP quando Anthropic balance restore, OR offline review via skills/agents
→ **Final architecture + features + roadmap** (task #7) — consolidate this UltraPlan + brainstorm + tech-research

---

*UltraPlan v1.0 | Skill `ultraplan` 5-fases applied | Inline conclave (5 experts simulated) | Orion 2026-05-15*
