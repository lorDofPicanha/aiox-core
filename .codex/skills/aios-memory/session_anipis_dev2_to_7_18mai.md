---
name: Anipis DEV-2..7 Sprint Hotfix 18/Mai
description: Sessão executou 6 dev tasks pré-SCC assinatura (DEV-2 spec consent UI, DEV-3 audit Sentry, DEV-4 verify Upstash, DEV-5/6 ZDR enforcement code+tests, DEV-7 PII leak regression guard CI gate). +25 testes novos, 0 regressão.
type: project
originSessionId: anipis-dev-batch-18mai-20h
---

## Sessão 18/Mai/2026 ~20:00 — Anipis 6 dev-tasks pré-SCC

### Disparada pelo trigger "go" após "como está o projeto anipis"

Founder pediu execução autônoma do queue de dev-tasks pré-assinatura SCC v2 (Patricia Peck). Backlog mapeado em `12-compliance/SCCs-v2-proposed-edits.md` triggers do memory 17/Mai.

### Tasks executadas (5/5 + 1 spec)

| # | Task | Status | Esforço | Artefato |
|---|------|--------|---------|----------|
| DEV-3 | Sentry beforeSend PII audit | ✅ DONE (verificação) | 0h (já implementado) | `13-dev-specs/DEV-3-sentry-pii-audit.md` |
| DEV-4 | Upstash aws-sa-east-1 migration | ✅ CODE READY · DASHBOARD pending | 30min code (0 changes) | `13-dev-specs/DEV-4-upstash-sao-paulo-migration.md` |
| DEV-5/6 | OpenAI ZRT + Anthropic ZDR env enforcement | ✅ CODE DONE | ~45min | `13-dev-specs/DEV-5-6-zdr-enforcement.md` + code |
| DEV-7 | PII leak regression CI gate | ✅ DONE | ~1h | `13-dev-specs/DEV-7-pii-leak-regression-guard.md` + 15 tests |
| DEV-2 | International transfer consent UI spec | ✅ SPEC DONE · IMPLEMENTATION pending 4-6h+2h | ~1h spec | `13-dev-specs/DEV-2-consent-ui-spec.md` |

### Code changes

**Files criados:**
- `apps/serenity-ai/apps/api/src/config/env-zdr.ts` — pure validator extraído pra testabilidade
- `apps/serenity-ai/apps/api/src/__tests__/config/env-zdr-enforcement.test.ts` — 10 tests
- `apps/serenity-ai/apps/api/src/__tests__/ci/pii-leak-regression.test.ts` — 15 tests static-analysis

**Files modificados:**
- `apps/serenity-ai/apps/api/src/config/env.ts` — add OPENAI_ZDR_CONFIRMED + ANTHROPIC_ZDR_CONFIRMED + boot fail-closed
- `apps/serenity-ai/.env.example` — documenta 5 novas vars

**Test impact:** 827 → 877 (+50 = +25 minhas + 25 outras tasks paralelas)

### DEV-3 Sentry audit findings
- `sentry-config.ts` JÁ implementa 6-layer hardening (msg/user/request/extra/breadcrumb/exception)
- 25 tests passing (verificado standalone)
- `server.ts:173-182` faz spread de `SENTRY_HARDENED_OPTIONS` no `Sentry.init`
- Pure ops task: founder configurar Sentry SaaS server-side scrub rules como defense-in-depth + smoke test PII synthetic event antes Closed Beta

### DEV-4 Upstash findings
- Zero hardcoding de região no código (env.UPSTASH_REDIS_URL agnóstico)
- Migration é 100% dashboard + cutover ~5min
- Runbook: criar instância nova `aws-sa-east-1`, smoke test local, cutover prod, manter old 7d rollback
- Impacto SCC: Upstash sai da lista de subprocessadores US → 5 ao invés de 6
- Bloqueio: pode requerer plano Pro Upstash (~$10/mês), founder validar

### DEV-5/6 ZDR enforcement
- Adicionado: `OPENAI_ZDR_CONFIRMED` + `ANTHROPIC_ZDR_CONFIRMED` env flags
- Boot **fails-closed em production** se flag = false (dev/test/staging passa)
- Anthropic flag só required se ANTHROPIC_API_KEY também set (Anthropic é fallback opcional)
- Pure validator `checkZdrEnforcement` extraído pra `env-zdr.ts` (testabilidade — env.ts side-effects)
- 10 tests cobrem todos os cenários (dev/test/staging skip, prod block/allow combinations, error message contém URLs + SCC refs)
- Founder action: enrollar dashboard ZDR primeiro, depois ligar flag

### DEV-7 PII leak regression CI gate
- 15 static-analysis tests guardando contra remoção acidental de PII filters
- Cobertura:
  - **llm-router (5)** — `redactedMessageTail()` chamado em callOpenAI + callAnthropic + `generation.end` usa `redactForObservability`
  - **crisis-event-logger (2)** — classifier_output shape lock (5 keys allowlist) + responseGiven bounded 2000 chars
  - **sentry-config (3)** — SENTRY_HARDENED_OPTIONS exports, event.user reduzido a {id} ou {}, stripPii imported
  - **langfuse-client (3)** — redactForObservability exportada + usa stripPii + fail-closed `[REDACTION_FAILED]`
  - **server.ts (2)** — Sentry.init faz spread de SENTRY_HARDENED_OPTIONS
- Bug pego no caminho: regex `function\s+...\n\}` matchava signature multi-line `): { ... }` antes do body — corrigido pra checar `try/catch` block content

### DEV-2 consent UI spec (não-código)
- Spec completo 1k+ linhas em `13-dev-specs/DEV-2-consent-ui-spec.md`
- Componente `<InternationalTransferConsent />` fullscreen modal não-dismissible
- Lista 6 subprocessadores com bandeira + jurisdição + finalidade
- Botões "Aceito" / "Recusar transferência" simétricos (anti-dark-pattern)
- Scroll completion gate antes de habilitar botões
- Backend: `POST /consents/international-transfer` + middleware `requireAiConsent` gateando `/chat`
- DB: nova categoria `'international_transfer'` em granular_consents + nova coluna `profiles.ai_features_enabled`
- Modo limited (post-recusa) mantém mood + journal + exercises (Art. 6 IX não-discriminação)
- WCAG 2.1 AA + tokens Pergaminho Clínico v3 + Crimson Pro/Cormorant Garamond
- 21 acceptance criteria + 11 files a criar/modificar
- Bloqueio: aguarda founder approve direction + alocação de dev pra 4-6h frontend + 2h API (deadline D-7 = 23/Mai)

### Full suite final
- **876/877 passing** (1 flake `crisis-protocol-service alertEmergencyContact` — 557ms standalone passou, timeout 5s sob carga paralela 36 files. PRE-EXISTING, não regressão das minhas mudanças)
- Re-rodado isoladamente: 29/29 passing em 1.16s
- 0 regressão confirmada

### Pendências founder pós-sessão
1. **DEV-2** UX approval direction + alocar dev frontend (4-6h) + dev backend (2h) — deadline 23/Mai
2. **DEV-4** validar plano Upstash + janela cutover + atualizar SCC Anexo III
3. **DEV-5** enrollar OpenAI ZDR dashboard → set OPENAI_ZDR_CONFIRMED=true prod
4. **DEV-6** decidir Anthropic Enterprise contract (~$30k/ano min) ou remover ANTHROPIC_API_KEY
5. **DEV-3** smoke test pré-Beta (provocar erro com CPF/email synthetic)
6. **DEV-1** Caminho A já estava DONE em SCCs-v2-proposed-edits.md (texto-only)

### Triggers próxima sessão
- `dev-2 implementar` — começar build frontend + backend consent UI
- `dev-4 cutover upstash` — runbook step-by-step pra dashboard migration
- `dev-5 enroll openai zdr` — guiar founder pelo dashboard OpenAI
- `audit anipis sprint 1` — relatório executivo consolidado (todos DEV-1..7)
- `email patricia v2 final` — consolidar 4 gaps + DEV-3/4/5/6/7 evidências pra Patricia v2
- `closed beta gate 30mai` — verificar 11 pré-condições viáveis

**Why:** Sprint 1 security do Anipis está virtualmente fechado lado-código. Backend hardening tem agora 5 layers de proteção PII verificáveis (Sentry/Langfuse/llm-router/crisis-logger/server.ts) + CI gate static-analysis prevenindo regressão silenciosa. SCC v2 pode ser assinado em 13 dias com 4 das 6 dev-tasks executadas (DEV-1 doc-only já estava feito, DEV-2 spec ready aguardando 6-8h implementação).

**How to apply:** Próxima sessão pode iniciar DEV-2 implementation OR consolidar email Patricia v2 com evidências dos audits. Closed Beta 30/Mai continua VIÁVEL. Slip 7/Jun ainda mais seguro.
