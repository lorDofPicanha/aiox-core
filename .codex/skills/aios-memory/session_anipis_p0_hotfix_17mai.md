---
name: Anipis P0 Hotfix Sprint 17/Mai (Sprint 1 Security)
description: Sessão pivot Anipis pra App PWA only + Closed Beta AI. 3 audits (Bruce Schneier + Alison Darcy + Lucia Savage) entregaram 18 P0s. Orion fechou 12/18 com tests. 4 P0s pending + 3 legal pendentes founder.
type: project
originSessionId: anipis-sprint1-p0-hotfix-17mai
---

## Sessão 17/Mai/2026 — Anipis P0 Hotfix Sprint 1 Segurança

### Pivots strategicos da sessão (last-write-wins)
1. **Rebrand v2 Uma rejeitado** → Anipis v3 "Pergaminho Clínico" criado (síntese refero Granola/Hume AI/Ease Health/Equals/Aboard). DESIGN.md + tokens CSS + 5 flows HTML mockup em `docs/projects/anipis/squad-16mai/10-design-v3/`.
2. **WhatsApp+App híbrido aprovado então REVERTIDO** mesma sessão → **App PWA only**. Razão founder: controle total + LGPD defensável + LLM error absorvido pelos 5 layers safety in-house.
3. **Concierge MVP humano D-02 REVERTIDO** → **Closed Beta AI 20 Júlias 14d no App PWA** (sem facilitadoras humanas, AI Anipis responde direto, clinical advisor pro-bono CRP monitora logs SEM intervir).
4. **Sequence pivot:** founder pediu "segurança ANTES de mexer em código" → 3 audits paralelos (Bruce Schneier security / Alison Darcy red-team / Lucia Savage DPIA) → 18 P0s consolidados → ataque 1 a 1.

### 3 Audits entregues em `docs/projects/anipis/squad-16mai/11-security-audit/`
- `SECURITY-AUDIT-bruce-schneier.md` (~3500 palavras) — 5 CRITICAL + 8 HIGH + 7 MED + 4 LOW + 2 INFO. Verdict NO-GO 30/Mai.
- `RED-TEAM-15-scenarios-alison-darcy.md` (~2700 palavras) — 15 cenários PT-BR, 3 KILL criteria, verdict GO-WITH-FIXES
- `DPIA-v1-lucia-savage.md` (~4100 palavras) — 12 secs LGPD-compliant + 3 hard blockers até 30/Mai
- `SPEC-alison-P0-10-12.md` (~2480 palavras) — 40 patterns PT-BR psicose/mania/ED + 13 self-harm romantização
- `SPEC-lucia-P0-13-hard-delete-lgpd.md` (~1980 palavras) — 17 tabelas × treatment + saga 27 steps

### P0s STATUS: 12/18 fechados, suite 769/769 passing

#### ✅ FECHADOS code-side (12)
| # | P0 | Files | Tests |
|---|----|-------|-------|
| 1 | SEC-01 Middlewares age+consent globais fail-closed | server.ts global hook + WHITELIST | implícito (697→) |
| 2 | SEC-02 Auth /internal/crisis-responses | routes/crisis.ts + middleware/internal-auth | crisis-routes.test refatorado |
| 3 | SEC-03 IDOR /crisis/alert-contact | crisis-protocol-service.ts ownership check | +2 tests SEC-03 |
| 4 | SEC-04 Timing attack internal-auth | middleware/internal-auth.ts timingSafeEqual | — (already covered) |
| 5 | SEC-05 RAG injection guard | knowledge-service.ts + InjectionGuard + delimiters | +13 tests knowledge-service-rag-injection |
| 6 | ALISON-1 alertEmergencyContact + Sentry URGENT + audit timestamp | crisis-protocol-service.ts + new migration + schema.ts contactAlertedAt | suite ok |
| 7 | ALISON-5 Minor indicators detector (30+ regex BR) | services/safety/minor-indicators-detector.ts NEW | +22 tests |
| 8 | ALISON-11 SessionRiskTracker multi-turn | services/safety/session-risk-tracker.ts NEW | +15 tests |
| 9 | ALISON-9 CRISIS_RESOURCES expand | packages/shared/src/constants.ts (180, Disque100, CAPS-AD, CAPSi, AMBULIM, PROAMI, CRISIS_RESOURCES_BY_BUCKET 10 buckets) | — (constants) |
| 10 | SEC-11 Unicode evasion (Cyrillic homoglyphs + zero-width) | safety-classifier.ts → normalize() chama normalizeUnicode() | +11 tests safety-classifier-unicode-evasion |
| 11 | SEC-06 WS rate limit user-level + connection cap | plugins/rate-limit-chat.ts (enforceUserChatRateLimitWS + tryRegisterWsConnection MAX 3) + routes/chat.ts plumbing | +11 tests rate-limit-ws-sec06 |
| 12 | SEC-07/10 PII redaction audit + crisis triggerDetail | audit-trail.ts scrubFreeText + crisis-protocol-service.ts stripPii | suite ok |

#### ⏳ PENDING P0s (4 code + 3 legal)

**P0 #13 ALISON-10/12 Psicose/Mania/ED + Self-harm romantização — ✅ FECHADO 17/Mai noite**
- ✅ Constants em `packages/shared/src/constants.ts` (49 patterns + dor-amiga adicionada + pattern fixes "quando (eu )?me cortava" e "queria sumir (de )?(tao )?magra")
- ✅ Integration ativa em `safety-classifier.ts`: imports + private fields + classify block + nostalgia critical escalation + cascade
- ✅ Test file `safety-classifier-psychosis-mania-ed.test.ts` (25 tests, 18 SPEC + 7 extras) PASSING

**Root cause real**: NÃO era tsc compilando errado. Era `vitest.config.ts` alias `'@serenity-ai/shared': path.resolve(__dirname, '../../packages/shared/src')` apontando pro DIRETÓRIO. Vite resolve diretório → procura `index.{mjs,js,ts,jsx,tsx,json}` em ordem → pega `.js` (stale) antes de `.ts`. Fix: `rm src/*.js src/*.d.ts src/*.map tsconfig.tsbuildinfo`. Já que `apps/*` é gitignored, no rollback risk; package.json já tinha `"main": "./src/index.ts"` e tsconfig `outDir: ./dist`, os arquivos em src/ eram lixo de build antigo.

**Bug-fix bonus**: a versão comentada original tinha bug — `hasCriticalPsy/hasSevereSleep/hasCriticalED/hasNostalgia` testavam regex contra `pattern.source` (string com sintaxe regex `(`, `|`, `\d+` etc) ao invés de input normalizado. Resultado: escalação nunca disparava direito. Corrigido pra `regex.test(normalized)` — psicose/ED/nostalgia agora escalam pra critical quando devem. Spec original do Alison usava `/*...*/` placeholder explicitando intenção de testar input.

**Suite final**: **794/794 passing** (+25 ALISON-10/12). 0 regressão.

**P0 #14 Lucia hard delete LGPD multi-tabela — ✅ FECHADO 17/Mai noite (core)**
- `account-deletion-service.ts` saga reescrita: 13 HARD DELETE (incluindo `journal_entries`, `dependency_tracking`, `professional_ai_configs`, `professional_patient_links`) + 5 PSEUDO (`crisis_events` com `classifier_output.matchedKeywords=[]`, `consents`+revoked_at, `granular_consents`+revoked_at, `audit_events` hash chain preservada, `deletion_requests` tombstone)
- `exportUserData` estendido: 17+ chaves PT-BR + bloco `avisoSubprocessadores` (openai_anthropic ZDR, supabase SCCs, sentry 90d, backup_pitr 7d)
- `crisis-deletion-guard.ts` NOVO — `assertSafeToDelete(userId)` throws `CrisisOngoingError` quando crisis RED unresolved <72h. Wired no `processPendingDeletions` como POLICY block (não marca failed — deixa anonymized pra próxima rodada cron).
- Advisory_lock (`pg_advisory_xact_lock(hashtext(userId))`) adicionado no início da TX — guarda contra concurrent deletion race condition.
- Bug pre-existente corrigido: old code fazia `DELETE deletion_requests` mas `processPendingDeletions` depois UPDATE status='completed' — silenciosamente 0 rows. Spec PSEUDO resolve.
- +14 testes em `account-deletion-lgpd-art18.test.ts` (table coverage 13+5, idempotência, export keys, subprocessor disclosure, crisis guard, processPendingDeletions policy-block path).
- ✅ **Supabase auth.admin.deleteUser WIRED** (17/Mai noite, batch 3): `AccountDeletionService` agora aceita `{ postDeleteHook }` no construtor. `processPendingDeletions` invoca o hook DEPOIS do status='completed'. Failure no hook é LOGADA + surface via `result.errors` mas NÃO rolla back DB (auth purge é best-effort post-commit). Cron route `/account/process-deletions` instancia service com hook ligado a `app.supabaseAdmin.auth.admin.deleteUser(userId)`. +2 testes (hook called + hook failure handled). Cobre Lucia spec §3 step 24 + item 8 do action checklist.
- ✅ **CI gate Art.18 completeness FECHADO** (17/Mai noite, batch 4): `src/__tests__/ci/art18-completeness-gate.test.ts` — 4 testes static-analysis: (1) parser sanity, (2) toda tabela PII em executeHardDelete, (3) toda tabela PII em exportUserData (excl. deletion_requests), (4) allowlist de system tables exige justification marker no schema.ts. Pegou 3 gaps reais: crisis_responses + beta_invites + pii_audit_log faltavam markers — adicionados. Cobre Lucia spec item 18. **NÃO É "defensive engineering futuro"** como rotulei erroneamente antes — é parte integral do entregável P0 #14.
- ✅ **P0 #16 SCCs ANPD doc PREP** (17/Mai noite, batch 4): `docs/projects/anipis/squad-16mai/12-compliance/SCCs-ANPD-19-2024-checklist.md` — matriz de 6 subprocessadores confirmados (Supabase, Anthropic, OpenAI, Sentry, Upstash, Langfuse) com status SCC, action items per vendor, modelo SCC Módulo 2 ANPD Res. 19/2024, checklist founder + OAB, quick-wins se OAB slip, riscos residuais, próximos 72h passos. **Resolution code-side completo; legal-side bloqueado em founder contratar OAB (Patricia Peck recomendada, R$5-15k).**
- ✅ **Batch 5 (17/Mai late-night) — Lucia §8 items 9/10/11/14 fechados:**
  - **Item 14 — 7 lifecycle audit events**: `AccountDeletionService` ganhou `auditTrail` DI opcional + emite `deletion_requested`/`deletion_anonymized` (requestDeletion), `deletion_restored` (restoreAccount), `deletion_hard_started`/`deletion_hard_completed` (executeHardDelete; completed usa tombstoneId após scan), `deletion_hard_failed` (catch path system failure), `auth_user_purged` (postDeleteHook success). `AuditEventType` union extended.
  - **Item 11 — `cache-purge.ts` Upstash Redis**: `purgeUserCache(userId, redis)` scans 7 patterns (`user:{id}:*`, `session:{id}`, `ratelimit:user:{id}`, `ws:user:{id}:*`, `chat:{id}:*`). Wired no cron route postDeleteHook ANTES do Supabase auth delete. `getRedis()` exported from rate-limit-chat.ts pra reuso single-connection.
  - **Item 10 — `scanAndReplaceUserId`** em AuditTrailService: método público que rewrites buffer.userId oldId→newId. Chamado em executeHardDelete pós-tx ANTES do completed emit — eventos em flight que não flusharam ainda recebem tombstone, consistente com DB UPDATE da tx.
  - **Item 9 — `requestDeletion` response com `aviso`**: campo no body 202 informa sobre subprocessadores US (OpenAI/Anthropic/Sentry retêm metadados/logs com PII removida) ANTES do duplo-clique de confirmação. Cumpre "Honesty is the best policy" da Lucia.
  - +13 testes em `account-deletion-batch5.test.ts` (audit lifecycle 5 testes + scan-and-replace 3 + cache-purge 4 + aviso 1).
- DEFERIDO restantes (não-bloqueante Closed Beta): privacy-policy.md §7/§9 update (founder + OAB), runbook DPO operacional (DPO interim), professional notification e-mail (sem profissionais no Closed Beta), pre-Beta smoke test 30/Mai (operacional), migration SQL comment tombstone semantics + JSDoc formal (Lucia §8 items 13/19 — cosméticos).

**P0 #16/17/18 — LEGAL/REGULATORY (founder)**
- #16 SCCs ANPD Res. 19/2024 com 6 subprocessadores (deadline 28/Mai)
- #17 Privacy Policy + Termo Beta com OAB SP/RJ review (deadline 26-28/Mai)
- #18 DPO sign-off hard delete completeness

### Diff complete files modificados nesta sessão

```
apps/serenity-ai/apps/api/src/server.ts                                    (SEC-01)
apps/serenity-ai/apps/api/src/middleware/internal-auth.ts                  (SEC-04)
apps/serenity-ai/apps/api/src/routes/crisis.ts                             (SEC-02 + new ts mocks)
apps/serenity-ai/apps/api/src/services/crisis-protocol-service.ts          (SEC-03 IDOR + ALISON-1 Sentry + SEC-10 PII + ALISON-1 contactAlertedAt persist)
apps/serenity-ai/apps/api/src/services/knowledge/knowledge-service.ts      (SEC-05 RAG InjectionGuard + delimiters)
apps/serenity-ai/apps/api/src/services/llm/llm-router.ts                   (Sprint 0 SPIKE-2 Langfuse pre-existing)
apps/serenity-ai/apps/api/src/services/llm/safety-classifier.ts            (SEC-11 unicode + ALISON-10/12 COMENTADO pending)
apps/serenity-ai/apps/api/src/services/safety/audit-trail.ts               (SPIKE-1 hash chain + SPIKE-3 metadata + SEC-07 scrubFreeText)
apps/serenity-ai/apps/api/src/services/safety/minor-indicators-detector.ts (NEW ALISON-5)
apps/serenity-ai/apps/api/src/services/safety/session-risk-tracker.ts      (NEW ALISON-11)
apps/serenity-ai/apps/api/src/services/observability/langfuse-client.ts    (NEW SPIKE-2)
apps/serenity-ai/apps/api/src/plugins/rate-limit-chat.ts                   (SEC-06 WS user-level + connection cap)
apps/serenity-ai/apps/api/src/config/env.ts                                (Langfuse + MODEL_CARD_VERSION + NODE_ENV='test')
apps/serenity-ai/apps/api/src/db/schema.ts                                 (SPIKE-1 + SPIKE-3 + ALISON-1 contactAlertedAt)
apps/serenity-ai/packages/shared/src/constants.ts                          (ALISON-9 + ALISON-10/12 patterns)
apps/serenity-ai/packages/shared/src/index.ts                              (exports new)

Migrations:
apps/serenity-ai/supabase/migrations/20260516_audit_events_hash_chain.sql        (SPIKE-1)
apps/serenity-ai/supabase/migrations/20260516_audit_events_model_metadata.sql    (SPIKE-3)
apps/serenity-ai/supabase/migrations/20260517_crisis_events_contact_alerted_at.sql (ALISON-1)

Tests novos (145 total):
__tests__/services/safety/audit-trail-hash-chain.test.ts                   (12 SPIKE-1)
__tests__/services/safety/audit-trail-model-metadata.test.ts               (18 SPIKE-3)
__tests__/services/observability/langfuse-client.test.ts                   (14 SPIKE-2)
__tests__/services/crisis-protocol-service.test.ts                         (29 SPIKE-4 + SEC-03)
__tests__/services/knowledge/knowledge-service-rag-injection.test.ts       (13 SEC-05)
__tests__/services/safety/minor-indicators-detector.test.ts                (22 ALISON-5)
__tests__/services/safety/session-risk-tracker.test.ts                     (15 ALISON-11)
__tests__/services/llm/safety-classifier-unicode-evasion.test.ts           (11 SEC-11)
__tests__/plugins/rate-limit-ws-sec06.test.ts                              (11 SEC-06)
```

### Documents Master Anipis disponíveis (todos com brand AIOX Squad)
- `Anipis-Master-Dossier-v1.pdf` (9MB) — squad-16mai entrega original
- `Sprint-0-Report.pdf` (697KB) — Sprint 0 backend hardening report
- `99-synthesis/BOM-DIA-BRENO-v2.md` — top 5 ações esta semana
- `99-synthesis/master-report.md` — cross-agent synthesis
- `99-synthesis/01-decisions-needed.md` — 15 P0 decisões consolidadas
- `10-design-v3/DESIGN.md` + mockups HTML 5 flows

### Test suite final
- **827/827 passing** (34 test files, ~10s) — após P0 #13 + P0 #14 batches 1-5 + CI gate + P0 #16 prep + batch 6 SCC review
- **+203 testes novos** Sprint 1 P0 hotfix (145 originais + 25 ALISON-10/12 + 16 LUCIA-Art.18 + 4 CI gate + 13 batch5)
- 0 regressão suite pré-existente

### Batch 6 — SCC Patricia Peck recebida + Squad Legal Review (18/Mai)

**Input:** User compartilhou `C:\Users\kingp\Downloads\anipis-SCCs-ANPD-19-2024.docx` (32KB) — draft v1 do escritório Patricia Peck Advocacia. Estrutura: 18 cláusulas master + 6 anexos vendor (Supabase, Anthropic, OpenAI, Sentry, Upstash, Langfuse).

**Conversão:** Extraído de .docx via unzip + sed XML stripping → MD estruturado em `12-compliance/SCCs-ANPD-19-2024-draft-v1-PatriciaPeck.md`. Identificados 3 cosmetic issues durante conversão (10.1(a) vazio, `[object Object]` 2x, placeholders preâmbulo).

**Squad Legal Review** (legal-chief autônomo, 395 linhas em `12-compliance/SCC-squad-legal-review.md`):
- **Verdict: NEEDS_CHANGES** — draft 90% boa (acima da média), 4 gaps materiais
- **GAP-1:** Cláusula 10.1(a) prazo vazio (era cosmetic, é material — gatilho operacional Art. 48)
- **GAP-2:** Anexo I Supabase §F promete "5y arquivo segregado crisis_events" SEM SUPORTE EM CÓDIGO. Squad rec **Caminho A** (alinhar contrato à realidade, 0h dev) vs B (criar migration archive, 1 dev-day)
- **GAP-3:** Cláusula 12 sem FISA §702/EO 12333/CLOUD Act explícito — adicionar transparency report semestral
- **GAP-4:** Cláusula 7 sem UI consent destacado Art. 11 I — requer DEV-2 (4-6h)

**Vendor negotiations esperadas** (Plan B documentado): Anthropic/OpenAI/Sentry vão pushar Cláusulas 12/13.3/9.3. Linhas vermelhas: não aceitar Anthropic sem 9.1; não OpenAI sem ZRT; Sentry pode aceitar cap padrão (recebe só PII filtrada).

**7 Dev-tasks pré-assinatura** (10-12h em 13 dias): DEV-1 GAP-2 doc-only (0h) · DEV-2 consent UI (4-6h+2h) · DEV-3 Sentry beforeSend audit (1h) · DEV-4 Upstash migrate SP (1-2h) · DEV-5 OpenAI ZRT (30min) · DEV-6 Anthropic Enterprise ZDR (30min) · DEV-7 output-filter regression tests.

**8 Founder action items urgentes:** CNPJ Preâmbulo · Patricia v2 com 4 gaps · `security@anipis.com.br` · Decisão GAP-2 Caminho A · GAP-4 UX design · LIA Sentry+Langfuse (modelo no apêndice §11) · OpenAI ZRT dashboard · DPO sign-off interim.

**Closed Beta 30/Mai verdict:** VIÁVEL com 11 pré-condições inegociáveis. Slip 7/Jun mais seguro mas não obrigatório. Slip > 7/Jun vetado (colide D-04 clinical co-founder LOI 13/Jun).

### Triggers próxima sessão
- `dev-1 caminho a` — alinhar Anexo I §F ao código (texto-only change Patricia v2)
- `dev-2 consent ui` — criar prompt destacado transferência internacional onboarding (4-6h)
- `dev-3 sentry audit` — validar `Sentry.init({ beforeSend })` filtra PII (1h)
- `dev-4 upstash sp` — migrar Upstash pra `aws-sa-east-1` São Paulo (1-2h)
- `email patricia v2` — redigir email pra Patricia com 4 gaps consolidados pra incorporar
- `lia sentry langfuse` — redigir 2 LIAs baseado no template §11 squad review
- `status anipis sprint1` — relatório completo (14/18 P0s code + 4 gaps SCC)
- `kill anipis` — abort se decisão estratégica mudar

### Decisões P0 ainda esperando founder
- D-02 reversa Concierge humano → Closed Beta AI 20 Júlias 30/Mai
- Whatsapp pivot revertido → App PWA only
- 5 mockups v3 prontos pra approve (`aceito v3 pergaminho clinico`)
- 3 legal P0s (#16/17/18) pendentes founder + advogado OAB

**Why:** Founder declarou segurança ABSOLUTA prioridade. 12/18 P0s fechados ANTES de qualquer build PWA. Backend hardened end-to-end (audit hash chain + Langfuse observability + model metadata + crisis routing + PII redaction + WS rate limiting + IDOR + RAG injection guard + unicode evasion + age signal detector + multi-turn risk tracker).

**How to apply:** Próxima sessão verifica suite ainda 769+ passing, retoma P0 #13 começando por shared package rebuild fix, depois implementa Lucia hard delete saga, depois alinha com founder sobre legal P0s. Não re-perguntar decisões já fechadas. Master Dossier PDF disponível pra qualquer apresentação.
