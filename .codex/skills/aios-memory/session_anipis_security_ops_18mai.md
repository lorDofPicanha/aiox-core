---
name: Anipis Full Security Review + Ops 18/Mai
description: Full Security Audit combination executada (Bruce+Peter+Jim+Chris+Omar). 6 novos achados security + 4 deliverables ops (security review + infra inventory + deploy gates + smoke tests + Beta checklist).
type: project
originSessionId: anipis-full-security-ops-18mai
---

## Sessão 18/Mai/2026 ~21:30 — Anipis Full Security Review + Operations

### Disparada por user pós squad-security v2.0 reorg
User pediu "review geral incluindo rotas e possíveis ataques" + "checkout, lista e servidores para Anipis". Aproveitou-se o squad-security recém-materializado para invocar o Full Security Audit combination (definido em squad.yaml).

### Squad invocado
Combination "Full Security Audit" coordenada por Orion:
- @bruce-schneier — strategic framing + STRIDE + regulatory matrix
- @peter-kim — attack surface map + adversary persona + scenario ranking
- @jim-manico — OWASP API Top 10 + Top 10 Web + code findings
- @chris-sanders — detection coverage gap + telemetry inventory
- @omar-santos — residual risk register + compliance matrix

### Findings F1-F6 (6 novos sobre os 14 P0 já fechados)

| # | Sev | Title | Effort | Owner |
|---|-----|-------|--------|-------|
| **F1** | 🔴 CRITICAL | `journal-routes.ts` declarado sem `verifyAuth` (4 rotas, dead code mas time-bomb se registrado futuro) | 5min | dev |
| **F2** | 🟠 HIGH | `/api/invite/validate` enumera emails (sem rate limit + 404 vs 400 vaza shape) | 30min | dev |
| **F3** | 🟠 HIGH | `/crisis/alert-contact` sem cooldown (vetor harassment via spam alert emergency contact) | 1h | dev |
| **F4** | 🟡 MED | Professional invite code 47-bit entropy (8 chars × 55 alphabet); recomendo 10 chars = 58-bit | 30min | dev |
| **F5** | 🟡 MED | RLS audit em 3 tabelas — `deletion_requests`, `pii_audit_log`, `age_verifications` (verify service-only) | 1h | data |
| **F6** | 🔵 LOW | `/journal/prompt` sem auth (aceitável mas inconsistente — document or fix) | 5min | dev |

### Attack scenarios ranqueados (top 8)
- **S1 (CRIT)** Crisis-template extraction via chat — mitigado mas precisa per-user spike alert
- **S2 (HIGH)** JWT theft → account takeover — short TTL ok, falta step-up auth post-Beta
- **S3 (HIGH)** Professional IDOR via :patientId — verifyLinkOwnership ok, falta test coverage assert
- **S4 (HIGH)** Invite email enumeration → **F2 fix needed**
- **S5 (HIGH)** Crisis-alert spam abuse → **F3 fix needed**
- **S6 (CRIT)** Future journal-routes auth bypass → **F1 fix needed**
- **S7 (MED)** LLM token-burning (denial of wallet) — rate-limited; Langfuse alert recomendado
- **S8 (MED)** Prompt injection via customInstructions — InjectionGuard ativo; test PT-BR adversarial corpus

### OWASP coverage
- **API Top 10**: 9/10 com mitigação ativa, apenas API6 (F3) e API9 (F1 dead-code drift) pendentes
- **Top 10 Web**: 8/10 ✅, A06 (deps audit não no CI), A07 (sem MFA, sem step-up)

### Postura defensiva confirmada
- ✅ 5-layer PII pipeline (Sentry/Langfuse/audit/crisis-logger/CI gate)
- ✅ Audit hash chain tamper-evident
- ✅ RLS em 11+ tabelas core (3 pendentes verify)
- ✅ WS rate limit + conn cap (3/user)
- ✅ CSRF Origin check + helmet + CORS allowlist
- ✅ Sprint 1 P0 14 closed + DEV-3/5/6/7 + spec DEV-2

### 4 Deliverables ops criados em `docs/projects/anipis/squad-16mai/14-operations/`

**1. FULL-SECURITY-REVIEW-18mai.md** (em `11-security-audit/`)
- Executive summary + attack surface map (24 declared + 5 internal routes)
- 8 attack scenarios ranqueados
- OWASP coverage matrix
- Detection gap analysis com SOC capability recommendation
- STRIDE + trust boundaries + regulatory alignment (12 regulações)
- Residual risk register + action plan P0/P1/P2/P3

**2. INFRA-INVENTORY.md**
- 6 vendors mapeados: Vercel + API Host (TBD!) + Supabase + Upstash + OpenAI + Anthropic + Sentry + Langfuse
- **Railway BR recomendado** pra API host (decision pendente founder)
- Upstash migration us-east-1 → aws-sa-east-1 detalhada
- OpenAI ZDR enrollment runbook
- Anthropic decision: Enterprise (~$30k/ano) OR remover (recomendo remover Beta)
- Custo Beta estimado: $50-80/mês

**3. DEPLOY-CHECKOUT-GATES.md**
- **DESCOBERTO: CI atual não roda testes!** 876 testes existem mas ci.yml só roda lint+typecheck+build
- 8 gates obrigatórios: lint+typecheck+test+build+security-scan+secret-scan+pii-regression+boot-validation
- Workflow CI completo proposto (substitui .github/workflows/ci.yml)
- Pre-push hook local (.husky/pre-push)
- Deploy pipeline 5 stages (build container → smoke local → staging → manual approval → prod)

**4. SMOKE-TEST-LIST.md**
- 56 testes em 12 tiers (liveness → security-specific → fuzzing)
- Tier 0 (1) → Tier 11 Security (5) → Tier 12 Negative (5)
- Tier 4 Crisis flow inclui abuse test (Smoke 4.4 valida F3 fix)
- Tier 11.5 IDOR probe (valida S3 mitigation)
- Tier 12.5 invite enum probe (valida F2 fix)
- Script template `smoke-test.sh` com Mode A/B/C

**5. CLOSED-BETA-CHECKLIST-30mai.md**
- 26 itens consolidados: 12 P0 (block) + 9 P1 (fix 48h) + 5 P2 (Beta window)
- 11 pré-condições inegociáveis (squad legal review reforço)
- Sprint 1.5 timeline 19-30/Mai (D-12 hoje)
- GO/NO-GO criteria 29/Mai
- Day-0 runbook (morning/afternoon/evening)
- Post-Beta cadence D+1 a D+14
- KPIs com targets quantificados (NPS ≥40, retention D+14 60%, PII leak = 0 tolerance)
- Rollback procedure
- Comunicação pra Júlias/clinical advisor/Patricia/ANPD

### Files modificados
- `docs/projects/anipis/squad-16mai/11-security-audit/FULL-SECURITY-REVIEW-18mai.md` (NEW)
- `docs/projects/anipis/squad-16mai/14-operations/INFRA-INVENTORY.md` (NEW)
- `docs/projects/anipis/squad-16mai/14-operations/DEPLOY-CHECKOUT-GATES.md` (NEW)
- `docs/projects/anipis/squad-16mai/14-operations/SMOKE-TEST-LIST.md` (NEW)
- `docs/projects/anipis/squad-16mai/14-operations/CLOSED-BETA-CHECKLIST-30mai.md` (NEW)

### Beta-readiness verdict final
**VIÁVEL com 12 P0 fechados até 28/Mai. Slip seguro 7/Jun.** Slip > 7/Jun = VETADO (colide D-04 clinical co-founder LOI 13/Jun).

### Triggers próxima sessão
- `fix f1 journal` — delete or fix journal-routes.ts (5min)
- `fix f2 invite` — rate limit + uniform 404 em /api/invite/validate (30min)
- `fix f3 crisis cooldown` — Redis cooldown em /crisis/alert-contact (1h)
- `dev2 implementar` — começar build consent UI international transfer (4-6h frontend + 2h API)
- `provisionar railway` — guiar founder pelo Railway setup com região BR
- `migrar upstash sp` — runbook cutover Upstash region
- `ci adicionar tests` — atualizar .github/workflows/ci.yml com test job + security gates
- `smoke test staging` — executar 56 smokes contra staging
- `go/no-go 29mai` — final readiness call
- `update kpi dashboard` — setup Langfuse + Sentry dashboards para KPIs do Beta

**Why:** Squad-security v2.0 recém-materializado provou valor imediatamente — combination "Full Security Audit" detectou 6 novos achados (incluindo 1 CRITICAL latente em dead code) + gap crítico no CI (sem tests) + inventário completo de infra com decisões pendentes. Tudo isso ANTES de qualquer push pra produção evita incidente regulatório/reputacional.

**How to apply:** Founder usa Closed-Beta-Checklist como roadmap operacional. Cada item tem owner + estimativa + dependência. Sprint 1.5 timeline integra todos os fixes em janela viável. P0 fixes (F1-F3) tomam ~2h dev total — pode rodar em qualquer momento esta semana.
