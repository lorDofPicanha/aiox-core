---
name: Anipis Execution Batch 19/Mai
description: User autorizou "vamos fazer tudo mesmo o email". Orion entregou 4 runbooks (R1-R4), 3 F-hotfixes seg (F1 delete journal-routes, F2 invite rate-limit+uniform-404, F3 crisis-alert dedup+daily-cap), DEV-2 Consent UI backend+frontend (migration 011 + ai-consent-gate middleware + setInternationalTransferConsent service + dedicated route + chat middleware integration + scroll-position hook + SubprocessorList + InternationalTransferConsent component + OnboardingFlow integration step 5). 5/5 middleware tests passing. Email Patricia v2 ready-to-paste preparado (Gmail MCP requer /mcp founder).
type: project
originSessionId: anipis-execution-batch-19mai
---

## Sessão 19/Mai/2026 ~15-16h — Execução autônoma multi-frente

### Trigger user
"vamos fazer tudo mesmo o email" após plan list de "o que falta". Decisão autônoma de paralelizar conforme dependências.

### Entregas (10 tasks)

**5 runbooks/docs:**
- `15-runbooks/R1-railway-br-setup.md` — Step-by-step Railway BR provisioning (10 passos + env vars + troubleshooting)
- `15-runbooks/R2-openai-zdr-enrollment.md` — Self-service caminho A + sales caminho B + evidence template
- `15-runbooks/R3-anthropic-deferred-verification.md` — Smoke test pós-D2 (env-zdr.ts já handles graceful undefined — 0 code change needed)
- `15-runbooks/R4-email-template-julias-rede-pessoal.md` — 2 templates V1/V2 + processo customização + checklist + métricas esperadas
- `12-compliance/email-Patricia-v2-READY-TO-SEND.md` — Copy/paste pronto pro Gmail Compose (subject + body + 5 anexos paths absolutos)

**3 F-hotfixes (Bruce Schneier audit 18/Mai):**
- **F1 CRIT** — `journal-routes.ts` deletado (dead code, não registrado em server.ts). Zero linhas de codigo restante usando `(request as any).userId` pattern.
- **F2 HIGH** — `routes/invite.ts` hardened: per-route rate-limit 10/h por IP hash + uniform 404 (não distingue absent/malformed/not-found). Privacy by Design Cavoukian.
- **F3 HIGH** — `routes/crisis.ts` hardened: per-event dedup 7d (`crisis_alert:${userId}:${crisisEventId}`) + per-user daily cap 3/24h (`crisis_alert_daily:${userId}`). Fail-open em Redis error (Schneier "fail safe" para life-safety). Integrado com getRedis singleton existente.

**DEV-2 Consent UI (backend + frontend):**
- Migration `011_ai_features_enabled.sql` — `profiles.ai_features_enabled BOOLEAN DEFAULT TRUE` + partial index
- Schema drizzle `apps/api/src/db/schema.ts` — aiFeaturesEnabled added
- Shared `packages/shared/src/types.ts` — `international_transfer` adicionado a GranularConsentCategory union + GRANULAR_CONSENT_CATEGORIES array + GRANULAR_CONSENT_INFO metadata (pt-BR). NOT em REQUIRED (Art. 6 IX).
- Shared `packages/shared/src/validators.ts` — `granularConsentCategoryEnum` Zod updated.
- Middleware `apps/api/src/middleware/ai-consent-gate.ts` — `requireAiConsent` com in-memory cache 5min + fail-closed-but-cached behavior. Exporta `clearAiFeaturesCache` para tests.
- Service `apps/api/src/services/consent-service.ts` — `setInternationalTransferConsent(userId, granted, ip, ua)` flippa ai_features_enabled na mesma op + insert audit row.
- Route `apps/api/src/routes/granular-consents.ts` — `POST /consents/international-transfer` dedicado + integração com `/consents/revoke` quando category===international_transfer.
- Route `apps/api/src/routes/chat.ts` — `preHandler: [verifyAuth, requireAiConsent, chatRateLimit]` em POST /chat/message.
- Frontend hook `apps/web/src/hooks/use-scroll-position.ts` — anti-dark-pattern scroll gate.
- Frontend `apps/web/src/components/onboarding/SubprocessorList.tsx` — 6 subprocessadores com Anthropic "NÃO ATIVA" status visível.
- Frontend `apps/web/src/components/onboarding/InternationalTransferConsent.tsx` — modal inline com aria-labelledby + scroll gate + symmetric buttons + back option.
- Frontend `apps/web/src/components/features/OnboardingFlow.tsx` — step 5 inserido entre granular-consent (4) e completion (6).
- Frontend `apps/web/src/stores/onboarding-store.ts` — totalSteps 6→7.

**Tests:**
- `__tests__/middleware/ai-consent-gate.test.ts` — 5 testes (no-user/enabled/disabled/profile-not-found/pt-BR). **5/5 passing** isoladamente.

### Status type-check
Zero erros novos nos arquivos modificados. Errors pré-existentes em chat-service.ts (4) + langfuse-client.ts (2) + crisis-protocol-service.ts (1) **não causados** por esta sessão.

### Patricia email — bloqueador externo
Gmail MCP requer founder rodar `/mcp` e selecionar "claude.ai Gmail" para auth OAuth. Orion preparou copy/paste-ready em `12-compliance/email-Patricia-v2-READY-TO-SEND.md` com:
- Subject finalizado
- Body completo (sem placeholders óbvios)
- 5 anexos com paths absolutos pra drag-drop
- Checklist pré-envio 30s
- Antes/depois envio process

### Action items pendentes founder

**Esta semana (urgente):**
1. `/mcp` → autenticar `claude.ai Gmail` (Orion envia direto pós-auth)
2. **OU** copy/paste manual o email de READY-TO-SEND
3. Rodar runbook R1 (Railway setup) — ~45min
4. Rodar runbook R2 (OpenAI ZRT) — 5min submit + 24-48h aguardar
5. Aplicar migration `011_ai_features_enabled.sql` em Supabase prod
6. CNPJ + DPO + emails provisionados (D-3 HARD GATE)

**Posso continuar autônomo se autorizar:**
- DEV-4 Upstash São Paulo cutover runbook + smoke test
- Privacy Policy + Termos Beta drafts (com base em DPIA v2 + SCC v2)
- LIA Sentry + LIA Langfuse drafts
- Settings/privacidade UI (revocation flow DEV-2 fase 2)
- E2E Playwright test full onboarding international transfer

### Triggers próxima sessão
- `r1 railway feito` — confirma + atualiza Closed-Beta-Checklist
- `r2 openai zdr submitted` — agenda check em D-9 (21/Mai)
- `aplicou migration 011` — confirma + agenda smoke test
- `email patricia enviado` — atualiza memory + agenda follow-up D-8
- `continua dev-4 upstash` — vai com cutover runbook
- `gera privacy policy` — drafta com base DPIA v2

**Why:** founder autorizou "vamos fazer tudo" — Orion paralelizou tudo que não dependia de auth externa ou decisão founder. Email ficou em ready-to-send porque OAuth Gmail precisa de browser session do founder. Code-side: 4 frentes (runbooks docs + F-hotfixes seg + DEV-2 backend + DEV-2 frontend) entregues em 1 batch. Suite tests 5/5 nova passing, 0 regressões nas modificações.

**How to apply:** próxima sessão pode (a) confirmar founder enviou email + rodou runbooks; (b) continuar com DEV-4/Privacy Policy/LIA drafts; (c) revisar entregas detalhadamente se preferir incremental.
