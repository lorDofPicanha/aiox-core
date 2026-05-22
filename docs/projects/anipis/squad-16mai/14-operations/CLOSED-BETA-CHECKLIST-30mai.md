# Anipis Closed Beta — Pre-Launch Checklist (30/Mai/2026)

**Data:** 2026-05-18 (D-12)
**Target launch:** 30/Mai/2026 (D-Day)
**Slip seguro:** 7/Jun/2026 (D+8)
**Slip VETADO:** > 7/Jun (colide com D-04 clinical co-founder LOI 13/Jun)
**Auditor:** Orion (aios-master) — Full Security Audit combination signoff

---

## TL;DR

**26 itens — 12 P0 (block Beta) · 9 P1 (fix in 48h) · 5 P2 (Beta window)**

**Beta-readiness: VIÁVEL com 12 P0 fechados até 28/Mai.** Slip pra 7/Jun é colchão; > 7/Jun = abortar Sprint 1.

---

## P0 — Bloqueiam o Beta (12 itens) — Deadline 28/Mai

### Security & Compliance (6)

- [ ] **F1 — journal-routes.ts** delete OR fix com `verifyAuth` preHandler (5min) · **DEV**
- [ ] **F2 — /api/invite/validate** rate limit + uniform 404 (30min) · **DEV**
- [ ] **F3 — /crisis/alert-contact** Redis cooldown (1h) · **DEV**
- [ ] **F5 — RLS audit** em `deletion_requests`, `pii_audit_log`, `age_verifications` (1h) · **DATA**
- [ ] **DEV-5 — OpenAI ZDR enrollment** dashboard + flag (founder + 24h vendor) · **FOUNDER**
- [ ] **SCC v2 received from Patricia** com 4 gaps incorporados (Patricia + 5d) · **LEGAL**

### Infrastructure (6)

- [ ] **API host decided + deployed** (Railway BR recomendado) (2-3h) · **DEVOPS**
- [ ] **Supabase região BR confirmed + Pro tier ativo** (founder) · **FOUNDER**
- [ ] **Upstash migration** us-east-1 → aws-sa-east-1 (1-2h) · **DEVOPS**
- [ ] **DNS custom domains** (`anipis.com.br`, `api.anipis.com.br`) (1h founder + propagation) · **FOUNDER**
- [ ] **Sentry projeto + DSN + scrubbing** (30min) · **FOUNDER**
- [ ] **All env vars set in prod** (lista em `INFRA-INVENTORY.md`) (30min) · **FOUNDER**

---

## P1 — Fix nas 48h pré-Beta (9 itens) — Deadline 29-30/Mai

### DEV work (4)

- [ ] **DEV-2 implementation** — Consent UI international transfer (Art. 11) — 4-6h frontend + 2h API · **DEV**
- [ ] **CI tests job** adicionado (`.github/workflows/ci.yml`) + branch protection · **DEVOPS**
- [ ] **CI security gates** — npm audit + gitleaks + DEV-7 PII regression · **DEVOPS**
- [ ] **DEV-3 Sentry smoke test** — provocar erro com CPF synthetic em staging · **DEV**

### Legal / Compliance (3)

- [ ] **Privacy Policy + Termo Beta** revisão Patricia OAB (founder + 24h OAB) · **LEGAL**
- [ ] **CNPJ Preâmbulo SCC** preenchido (founder) · **LEGAL**
- [ ] **security@anipis.com.br** provisionado (founder + setup forward) · **FOUNDER**

### Operations (2)

- [ ] **Smoke test script** implementado (`apps/serenity-ai/scripts/smoke-test.sh`) — 1-2h · **DEVOPS**
- [ ] **DPO interim sign-off** hard delete + IR readiness · **FOUNDER**

---

## P2 — Beta window (durante 30/Mai-13/Jun) (5 itens)

- [ ] **F4 — Professional invite code** bump 8→10 chars (30min) · **DEV**
- [ ] **F6 — /journal/prompt** documentar ou add auth (5min) · **DEV**
- [ ] **Langfuse self-host BR** planning (4-6h) · **DEVOPS**
- [ ] **LIA Sentry + Langfuse** signed (founder + 1d) · **LEGAL**
- [ ] **Detection alerts** — per-user crisis spike, token burn, failed-auth rate · **OPS**

---

## 11 Pré-condições inegociáveis (originais squad legal review)

Reforço da revisão Patricia/Lucia/Bruce/Cavoukian/Heather (17/Mai):

1. [x] **Sprint 1 P0 audit fixes** (12/18 fechados; F1-F5 do novo audit completam)
2. [ ] **Patricia SCC v2** com 4 gaps incorporados
3. [ ] **DEV-1 Caminho A** (já em `SCCs-v2-proposed-edits.md`) confirmado founder
4. [ ] **DEV-2 consent UI** implementado (4-6h dev)
5. [ ] **OpenAI ZDR** ativo dashboard + flag prod
6. [ ] **Anthropic decision** (Enterprise OU remover)
7. [ ] **DPO interim** sign-off
8. [ ] **Clinical advisor (CRP)** acordo para monitoramento logs sem intervir
9. [ ] **Crisis monitoring rotation** definida (founder + clinical advisor)
10. [ ] **Privacy Policy + Termo Beta** publicados em `/legal/privacy`, `/legal/termos`
11. [ ] **20 Júlias identificadas** + recrutamento iniciado (founder)

---

## Sprint 1.5 timeline sugerido

```
HOJE (18/Mai)  ─┐
                ├─ D-12 — Audit completo + 4 docs operations entregues
19/Mai (Seg)   ─┤  P0 dev fixes: F1 journal + F2 invite + F3 crisis (3h dev)
20/Mai (Ter)   ─┤  Infrastructure: Railway provisioning + Supabase Pro + Sentry
21/Mai (Qua)   ─┤  Upstash migration + smoke test script + CI updates
22/Mai (Qui)   ─┤  DEV-2 consent UI implementation (frontend)
23/Mai (Sex)   ─┤  DEV-2 backend + integration tests
24-25/Mai (S/D)─┤  Buffer / DPO + Patricia v2 wait
26/Mai (Seg)   ─┤  Privacy Policy + Termo Beta publish
27/Mai (Ter)   ─┤  Patricia SCC v2 expected received
28/Mai (Qua)   ─┤  Full smoke test against staging + signoff
29/Mai (Qui)   ─┤  Final integration + DPO sign + clinical advisor confirm
30/Mai (Sex)   ─┤  D-Day — 20 Júlias onboarding starts
```

**Risk gates:**
- 23/Mai: Se DEV-2 não passar staging, slip pra 31/Mai
- 27/Mai: Se SCC v2 não chegar de Patricia, slip pra 4/Jun (7d delay)
- 28/Mai: Se smoke tests < 100%, slip pra 4/Jun

---

## Critérios de GO / NO-GO (29/Mai)

### GO checklist (founder confirma 29/Mai 18h)
- [ ] Todos 12 P0 fechados
- [ ] Todos 11 pré-condições verificadas
- [ ] 6/9 P1 fechados (3 podem slipar pra Beta window)
- [ ] Smoke test 100% pass staging
- [ ] Clinical advisor confirmou disponibilidade 30/Mai-13/Jun
- [ ] 20 Júlias confirmadas + onboarding link enviado
- [ ] Sentry alertas testados (manual fire)
- [ ] Rollback procedure documentado

### NO-GO triggers (qualquer 1 = abort)
- [ ] Bug CRITICAL descoberto em 28/Mai sem fix
- [ ] Patricia SCC v2 não recebida até 27/Mai (slip 4/Jun)
- [ ] DEV-2 com falha de UX bloqueante
- [ ] Sentry/Langfuse/Supabase outage > 4h em 29-30/Mai
- [ ] DPO interim não disponível
- [ ] Clinical advisor desistiu

---

## Day-0 (30/Mai) runbook

### Morning (9h-12h)
- 09:00 — Founder + DevOps + clinical advisor sync (15min)
- 09:30 — Final smoke test prod (full suite)
- 10:00 — Email enviado pras 20 Júlias com link onboarding
- 10:30-12:00 — Monitor Sentry + Langfuse + first onboardings

### Afternoon (13h-18h)
- 13:00 — Status sync (founder + clinical advisor): primeiros sinais
- 15:00 — Mid-day Sentry/Langfuse review
- 17:00 — End-of-day review: # de onboardings completos, primeiros chats, crisis events (esperado 0-1)

### Evening (18h-22h)
- 19:00 — Status sync final do dia
- Monitor passivo até 22h (any crisis event triggers immediate response)

### On-call (post-D0)
- Founder primary on-call 24/7 durante Beta
- Clinical advisor on-call para crisis_events RED (alerta automático)
- DevOps on-call para infra issues

---

## Post-Beta (D+1 a D+14) ritmo

| Cadência | Atividade | Owner |
|----------|-----------|-------|
| Diário 9h | Daily standup (founder + clinical advisor) | All |
| Diário 18h | Crisis events review + Sentry triage | Founder |
| 3x/semana | LGPD audit log integrity check | Founder |
| 1x/semana | Beta-feedback + NPS review | Founder |
| D+7 (6/Jun) | Mid-Beta retrospective + gate decision | All |
| D+14 (13/Jun) | Beta end — full retrospective + public launch decision | All |

---

## Comunicação durante Beta

### Pra Júlias
- Boas-vindas via email
- Suporte via `suporte@anipis.com.br` (founder primary, 24h SLA)
- Crisis: app-side mostra recursos (CVV 188) + emergency contact alert disponível

### Pra clinical advisor
- Slack/Telegram channel com alertas crisis_events automáticos
- Read-only Langfuse access pra revisar conversas pseudoanonimizadas
- Compromisso: NÃO intervir na conversa, só observar

### Pra Patricia / OAB
- Email follow-up dia 1 (D-Day) + dia 7 (mid-Beta) + dia 14 (post-Beta)
- Qualquer crisis event RED → notificar Patricia dentro de 24h

### Pra ANPD (se requerido)
- Reportar incidente em 24h se houver vazamento PII
- Reportar bug crítico que afete tratamento dados sensíveis em 72h

---

## Métricas-alvo Closed Beta (KPIs)

| KPI | Target D+14 | Aceitável | Failure |
|-----|-------------|-----------|---------|
| **Onboarding completion** | 18/20 (90%) | ≥15/20 | <12/20 |
| **D+7 retention** | 14/20 (70%) | ≥10/20 | <8/20 |
| **D+14 retention** | 12/20 (60%) | ≥8/20 | <5/20 |
| **Average chats per active user** | ≥5/week | ≥3/week | <2/week |
| **NPS score** | ≥40 | ≥20 | <0 |
| **Crisis events (RED)** | 0-2 expected | ≤5 manageable | >5 indica problema |
| **Crisis event resolution** | 100% acknowledged | ≥95% | <90% |
| **Sentry error rate** | <1% requests | <3% | >5% |
| **API uptime** | 99.5% | ≥99% | <97% |
| **PII leak incidents** | 0 | 0 (zero tolerance) | ≥1 = SHUTDOWN |

**Métricas de safety (zero tolerance):**
- PII leak em Sentry/Langfuse/logs: 0
- Crisis event missed (red não detectada): 0
- Account deletion request unfulfilled: 0
- IDOR access violation: 0

---

## Rollback procedure

**Trigger de rollback:**
- PII leak detected
- IDOR violation in audit
- Crisis flow broken (RED detection rate cai)
- Sentry error rate >10%
- API uptime <95% em 1h

**Rollback steps:**
1. Founder + DevOps sync imediato
2. Identificar último deploy "known good" (SHA)
3. `git revert` ou `git reset --hard` no main
4. Force redeploy via CI/CD
5. Verificar `/health` + smoke test full
6. Comunicar Júlias por email se >30min downtime
7. Post-mortem em 24h documentado

---

## Action items consolidados (founder weekly)

### Esta semana (19-25/Mai)
- [ ] Decidir API host (Railway recomendado) e provisionar
- [ ] Enrollar OpenAI ZDR
- [ ] Decidir Anthropic Enterprise OU remover
- [ ] Upgrade Supabase Pro
- [ ] Setup Sentry projetos + DSN
- [ ] Provisionar `security@anipis.com.br`
- [ ] Enviar email pra Patricia com 4 gaps consolidados
- [ ] Iniciar recrutamento 20 Júlias

### Próxima semana (26-30/Mai)
- [ ] Aprovar DEV-2 consent UI UX
- [ ] Confirmar DPO interim
- [ ] Confirmar clinical advisor CRP
- [ ] Publicar Privacy Policy + Termo Beta
- [ ] Smoke test full staging + prod
- [ ] GO/NO-GO call 29/Mai 18h

---

**Beta-readiness final verdict (este audit):** **VIÁVEL com 12 P0 fixed até 28/Mai. Slip seguro 7/Jun.**

— Orion 🎯 coordenando @bruce-schneier (strategy) + @omar-santos (governance) + @tanya-janca (devsecops) + @chris-sanders (detection) + @wendi-whitmore (incident readiness)
