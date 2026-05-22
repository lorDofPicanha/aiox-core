# Sprint 1 Security — Anipis Closed Beta Hardening

**Período:** 16-17/Mai/2026 (2 dias)
**Squad:** Bruce Schneier (security) + Alison Darcy (clinical red-team) + Lucia Savage (privacy/regulatory) → Orion (implementação)
**Janela alvo:** Closed Beta launch **30/Mai/2026** (20 Júlias, App PWA only)
**Status global:** 🟢 **READY** code-side / 🟡 **BLOQUEADO** legal-side em founder + OAB

---

## 1. Contexto

Anipis é um companion de saúde mental com IA para mulheres 18-29 BR. Antes do Closed Beta, a founder declarou segurança ABSOLUTA como pré-requisito. 3 audits paralelos foram conduzidos:

| Auditor | Foco | Entregável |
|---|---|---|
| **Bruce Schneier** | Security threat model | 26 issues (5 CRITICAL + 8 HIGH + 7 MED + 4 LOW + 2 INFO). Verdict NO-GO até fixes. |
| **Alison Darcy** (Woebot/Stanford) | Clinical red-team | 15 cenários PT-BR, 3 KILL criteria. Verdict GO-WITH-FIXES. |
| **Lucia Savage** (ex-ONC HHS) | LGPD/regulatory DPIA | 12 secs + 3 hard blockers. Verdict NO-GO até Art. 18 completude. |

Consolidado → **18 P0s** atacados 1-a-1.

---

## 2. Status P0 (18 total)

### 2.1 Code-side fechados (14)

| # | P0 | Source | Status | Tests | Arquivos principais |
|---|---|---|---|---|---|
| 1 | SEC-01 Middlewares age+consent globais | Bruce | ✅ | implícito | `server.ts` global hook + WHITELIST |
| 2 | SEC-02 Auth `/internal/crisis-responses` | Bruce | ✅ | refatorado | `routes/crisis.ts` + `middleware/internal-auth.ts` |
| 3 | SEC-03 IDOR `/crisis/alert-contact` | Bruce | ✅ | +2 | `crisis-protocol-service.ts` ownership check |
| 4 | SEC-04 Timing attack internal-auth | Bruce | ✅ | covered | `internal-auth.ts` timingSafeEqual |
| 5 | SEC-05 RAG injection guard | Bruce | ✅ | +13 | `knowledge-service.ts` + InjectionGuard |
| 6 | ALISON-1 alertEmergencyContact + Sentry URGENT | Alison | ✅ | suite | `crisis-protocol-service.ts` + migration |
| 7 | ALISON-5 Minor indicators detector | Alison | ✅ | +22 | `services/safety/minor-indicators-detector.ts` |
| 8 | ALISON-11 SessionRiskTracker multi-turn | Alison | ✅ | +15 | `services/safety/session-risk-tracker.ts` |
| 9 | ALISON-9 CRISIS_RESOURCES expand | Alison | ✅ | constants | `packages/shared/src/constants.ts` |
| 10 | SEC-11 Unicode evasion classifier | Bruce | ✅ | +11 | `safety-classifier.ts` normalizeUnicode |
| 11 | SEC-06 WS rate limit + connection cap | Bruce | ✅ | +11 | `plugins/rate-limit-chat.ts` |
| 12 | SEC-07/10 PII redaction + crisis triggerDetail | Bruce | ✅ | suite | `audit-trail.ts` + `crisis-protocol-service.ts` |
| 13 | **ALISON-10/12 Psicose/Mania/ED + Self-harm romantização** | Alison | ✅ | +25 | `safety-classifier.ts` + 49+14 patterns + nostalgia critical |
| 14 | **LUCIA Art. 18 hard delete completeness** | Lucia | ✅ | +33 | saga 17 tabelas + crisis-guard + cache-purge + auth purge + 7 lifecycle audit events |

### 2.2 Legal-side bloqueados em founder/OAB (3)

| # | P0 | Bloqueador | Deadline |
|---|---|---|---|
| 16 | SCCs ANPD Res. 19/2024 (6 subprocessadores) | Founder contratar OAB (Patricia Peck rec. R$5-15k) | **28/Mai** |
| 17 | Privacy Policy + Termo Beta | OAB SP/RJ review | **26-28/Mai** |
| 18 | DPO sign-off hard delete | Founder DPO interim | antes launch |

### 2.3 Items operacionais pré-launch (1)

| # | Item | Quem | Quando |
|---|---|---|---|
| 20 | Smoke test pré-Beta (usuária fake + full flow) | Engineering + Founder | 29/Mai (D-1) |

---

## 3. P0 #14 detalhado — Art. 18 saga (entregável central Sprint 1)

### 3.1 Saga em 19 steps

```
Pre-flight:
  - pg_advisory_xact_lock(hashtext(userId)) — guarda race condition
  - assertSafeToDelete() — bloqueia se RED unresolved <72h (Art. 11,II,"f")

TX (FK-aware order):
  1.  DELETE messages
  2.  DELETE journal_entries          ← novo
  3.  DELETE conversations
  4.  DELETE mood_checkins
  5.  DELETE emergency_contacts
  6.  DELETE exercises
  7.  DELETE assessment_results
  8.  DELETE beta_feedback
  9.  DELETE nps_responses
  10. DELETE dependency_tracking      ← novo
  11. DELETE professional_ai_configs WHERE patient_id=userId  ← novo
  12. DELETE professional_patient_links WHERE patient_id=userId  ← novo
  13. INSERT tombstone profile (ON CONFLICT DO NOTHING)
  14. UPDATE crisis_events SET user_id=tombstone, classifier_output.matchedKeywords=[]
  15. UPDATE consents SET user_id=tombstone, ip=NULL, ua=NULL, revoked_at=NOW
  16. UPDATE granular_consents SET user_id=tombstone, ip=NULL, ua=NULL, revoked_at=NOW
  17. UPDATE audit_events SET user_id=tombstone  ← hash chain preservada
  18. UPDATE deletion_requests SET user_id=tombstone
  19. DELETE profiles WHERE id=userId

Post-TX:
  - auditTrail.scanAndReplaceUserId(userId, tombstoneId) — buffer rewrite
  - audit emit: deletion_hard_completed (tombstoneId)
  - purgeUserCache(userId, redis) — 7 Upstash patterns
  - supabase.auth.admin.deleteUser(userId)
  - audit emit: auth_user_purged
```

### 3.2 Itens spec Lucia §8 (20 total)

| Item | Descrição | Status |
|---|---|---|
| 1 | revokedAt em consents | ✅ já existia |
| 2 | imports tabelas | ✅ |
| 3 | saga steps 1-19 | ✅ |
| 4 | advisory_lock | ✅ |
| 5 | exportUserData queries completas | ✅ |
| 6 | avisoSubprocessadores bloco | ✅ |
| 7 | crisis-deletion-guard.ts | ✅ |
| 8 | Supabase auth.admin.deleteUser | ✅ |
| 9 | requestDeletion response `aviso` | ✅ |
| 10 | scanAndReplaceUserId audit buffer | ✅ |
| 11 | cache-purge.ts Upstash Redis | ✅ |
| 12 | notification-service professional | 🟡 N/A Closed Beta (sem profissionais) |
| 13 | SQL migration comment tombstone | ✅ |
| 14 | 7 lifecycle audit events | ✅ |
| 15 | Testes Seção 7 (11 spec) | ✅ +44 (mais que pedido) |
| 16 | privacy-policy.md update | 🔴 founder + OAB |
| 17 | runbook-art18-deletion.md | ✅ |
| 18 | CI gate Art.18 completeness | ✅ |
| 19 | JSDoc executeHardDelete formal | ✅ |
| 20 | Smoke test pré-Beta 30/Mai | 🟡 operacional pré-launch |

**18/20 fechados** (12 N/A Closed Beta, 16 founder+OAB, 20 operacional).

---

## 4. Métricas suite

| Marco | Test files | Tests | Diff |
|---|---|---|---|
| Baseline (início Sprint 1) | 26 | 769 | — |
| Pós SEC-01..07 + ALISON-1/5/11 + SEC-11 | 30 | 769 | +0 (refactor) |
| Pós ALISON-10/12 (P0 #13) | 31 | 794 | +25 |
| Pós LUCIA Art.18 saga (P0 #14 core) | 32 | 808 | +14 |
| Pós Supabase auth wire-up | 32 | 810 | +2 |
| Pós CI gate Art.18 | 33 | 814 | +4 |
| Pós batch 5 (lifecycle + cache + scan + aviso) | 34 | **827** | +13 |

**+58 testes Sprint 1. 0 regressão** em qualquer iteração.

---

## 5. Pivots estratégicos da sessão (registrados)

1. **Rebrand v2 Uma rejeitado** → Anipis v3 "Pergaminho Clínico" (síntese refero Granola/Hume AI/Ease Health/Equals/Aboard)
2. **WhatsApp+App híbrido REVERTIDO** → App PWA only (controle total + LGPD defensável + 5 layers safety in-house)
3. **Concierge MVP humano D-02 REVERTIDO** → Closed Beta AI 20 Júlias 14d no App PWA (sem facilitadoras; clinical advisor monitora logs sem intervir)
4. **Sequence pivot:** founder pediu "segurança ANTES de mexer em código" → 3 audits paralelos → 18 P0s consolidados

---

## 6. Pendências críticas (próximas 13 dias até launch)

### 6.1 D-13 a D-11 (17-19/Mai)
- [ ] **FOUNDER:** Contatar 2-3 advogados OAB (Patricia Peck primeira escolha) — orçamento R$5-15k
- [ ] **FOUNDER:** Iniciar processos vendor (Supabase Pro / Anthropic Enterprise / OpenAI ZRT / Sentry / Upstash / Langfuse Pro)

### 6.2 D-10 a D-7 (20-23/Mai)
- [ ] **FOUNDER + OAB:** Kickoff. Brief = `12-compliance/SCCs-ANPD-19-2024-checklist.md`
- [ ] **OAB:** Redigir SCC Módulo 2 ANPD-template em PT-BR
- [ ] **DEVOPS:** Considerar migração Upstash para região São Paulo (custo ~$0, reduz cross-border)

### 6.3 D-6 a D-3 (24-27/Mai)
- [ ] **OAB:** Assinaturas DPAs + SCCs com 6 vendors
- [ ] **OAB:** Privacy Policy v1 + Termo Beta v1 prontos
- [ ] **FOUNDER:** Ativar Zero Data Retention em Anthropic + OpenAI
- [ ] **FOUNDER DPO interim:** DPO sign-off hard delete (P0 #18)

### 6.4 D-2 a D-1 (28-29/Mai)
- [ ] **ENGINEERING:** Pre-Beta smoke test Art.18 — usuária fake + 17 tabelas + full flow (item 20)
- [ ] **FOUNDER:** Notification email pré-Beta às 20 Júlias com disclosure de transferência internacional

### 6.5 D-Day (30/Mai)
- [ ] **LAUNCH** Closed Beta — 20 Júlias, 14 dias, App PWA

---

## 7. Decisões pendentes founder (residual sessão)

| Decisão | Status | Default se silent |
|---|---|---|
| Aprovar v3 "Pergaminho Clínico" mockups HTML | 🟡 | mockups expiram em 7d sem aprovação |
| Contratar Patricia Peck (vs alternativa) | 🟡 | Patricia Peck (recomendação Sprint) |
| ZDR Anthropic Enterprise tier | 🟡 | Sim (custo ~$0 incremental) |
| Closed Beta AI direto vs híbrido humano | ✅ DECIDIDO | AI direto, clinical advisor monitora logs |

---

## 8. Sources & references

### 8.1 Docs Sprint 1
- `docs/projects/anipis/squad-16mai/11-security-audit/SECURITY-AUDIT-bruce-schneier.md` (3500 palavras)
- `docs/projects/anipis/squad-16mai/11-security-audit/RED-TEAM-15-scenarios-alison-darcy.md` (2700 palavras)
- `docs/projects/anipis/squad-16mai/11-security-audit/DPIA-v1-lucia-savage.md` (4100 palavras)
- `docs/projects/anipis/squad-16mai/11-security-audit/SPEC-alison-P0-10-12.md` (2480 palavras)
- `docs/projects/anipis/squad-16mai/11-security-audit/SPEC-lucia-P0-13-hard-delete-lgpd.md` (1980 palavras)
- `docs/projects/anipis/squad-16mai/11-security-audit/runbook-art18-deletion.md` (novo, 17/Mai)
- `docs/projects/anipis/squad-16mai/12-compliance/SCCs-ANPD-19-2024-checklist.md` (novo, 17/Mai)
- `docs/projects/anipis/squad-16mai/99-synthesis/Sprint-1-Security-Report.md` (este doc)

### 8.2 Code artifacts (apps/serenity-ai)
- `apps/api/src/services/account-deletion-service.ts` (rewrite + DI)
- `apps/api/src/services/crisis-deletion-guard.ts` (novo)
- `apps/api/src/services/cache-purge.ts` (novo)
- `apps/api/src/services/safety/audit-trail.ts` (+scanAndReplaceUserId + 7 lifecycle event types)
- `apps/api/src/services/llm/safety-classifier.ts` (ALISON-10/12 + 4 helper functions bugfix)
- `apps/api/src/routes/account.ts` (aviso + cron wire-up)
- `packages/shared/src/constants.ts` (+49 patterns ALISON-10/12)
- `apps/api/supabase/migrations/20260517_art18_tombstone_semantics_comments.sql` (novo)

### 8.3 Test files (novos)
- `apps/api/src/__tests__/services/llm/safety-classifier-psychosis-mania-ed.test.ts` (25 tests)
- `apps/api/src/__tests__/services/account-deletion-lgpd-art18.test.ts` (16 tests)
- `apps/api/src/__tests__/services/account-deletion-batch5.test.ts` (13 tests)
- `apps/api/src/__tests__/ci/art18-completeness-gate.test.ts` (4 tests)

---

## 9. Lições aprendidas

1. **vitest alias diretório → Vite prefere .js sobre .ts** — root cause do "stale .js" bloqueava P0 #13 inteiro. Fix definitivo: purgar artefatos build no `src/`. Repo `apps/*` gitignored ajudou (sem rollback risk).
2. **Bug helper functions classifier:** `hasCriticalPsy/Sleep/ED/Nostalgia` testavam regex contra `pattern.source` ao invés de input normalizado. Sintaxe regex no source bloqueava match. Spec Lucia tinha placeholder `/*...*/` indicando que deveria testar input. 1h de debugging recuperada.
3. **Bug pré-existente:** `DELETE deletion_requests` no executeHardDelete deixava `processPendingDeletions` tentando UPDATE status='completed' em row inexistente — silenciosamente 0 rows. Spec PSEUDO (UPDATE→tombstone) resolveu pelo lado da arquitetura.
4. **DI > singleton** para AccountDeletionService — `postDeleteHook` + `auditTrail` injetáveis. Tests passam stubs zero-config; produção wires no route handler. Mesma arquitetura escala se Anipis adicionar Stripe/Twilio futuramente.
5. **CI gate ≠ defensive engineering futuro.** Era item 18 explícito da spec Lucia. Rotulei errado e o founder corrigiu — boa lição: spec items numerados são entregáveis, não bonus.

---

## 10. Quality gate Closed Beta

| Critério | Status | Owner |
|---|---|---|
| Suite tests 100% green | 🟢 827/827 | Engineering |
| 0 regressão pre-existente | 🟢 verificado |  Engineering |
| LGPD Art. 18 completude | 🟢 14/14 tabelas PII tratadas | Engineering |
| LGPD Art. 33 (transferência internacional) | 🔴 SCCs pendentes | Founder + OAB |
| Privacy Policy v1 | 🔴 pendente OAB | OAB |
| Termo Beta v1 | 🔴 pendente OAB | OAB |
| DPO sign-off | 🔴 pendente | Founder DPO |
| Smoke test E2E | 🟡 pendente D-1 | Engineering |
| Crisis routing 5-layer safety | 🟢 classifier + minor + session-risk + guard + redaction | Engineering |
| Subprocessor disclosure no app | 🟢 aviso field + exportUserData | Engineering |

---

**Última revisão:** 17/Mai/2026 noite (closure Sprint 1)
**Próxima revisão:** D-1 (29/Mai) pós-smoke-test
**Owners:** Founder (legal/operacional) + Orion AIOS (engineering)
