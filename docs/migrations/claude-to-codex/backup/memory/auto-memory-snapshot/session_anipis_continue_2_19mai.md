---
name: Anipis Continue 2 19/Mai noite
description: User "continue com os próximos passos" → 3 deliverables: email Patricia v2 bundle expandido 5→9 anexos com honorários R$7-20k→R$12-30k; crisis-protocol flake FIXED via vi.mock('@sentry/node') (1213ms→26ms); DEV-2 integration test suite 7 tests cobrindo accept/refuse/revocation/audit/limited-mode. Suite 889/889 (era 882) zero flakes.
type: project
originSessionId: anipis-continue-batch-2-19mai-noite
---

## Sessão 19/Mai/2026 ~17h — "continue com os próximos passos"

### Trigger
User pediu continuar após `session_anipis_continue_19mai`. Orion priorizou 3 frentes autônomas: Patricia bundle expandido, flake fix, integration test E2E (Playwright pulou → integration mais valioso).

### Entregas

**1. Email Patricia v2 bundle expandido** (`12-compliance/email-Patricia-v2-READY-TO-SEND.md`):
- Subject reescrito: "Bundle legal completo Closed Beta 30/Mai — SCC v2 + DPIA v2 + Privacy Policy v2 + Termos Beta v2 + 2 LIAs · pedido revisão consolidada"
- Body atualizado: pedido formal estendido para 6 itens (era 3) — incluindo Privacy Policy v2 review, Termos Beta v2 review, LIAs Art. 7º IX formalização
- Anexos 5→9: + `Privacy-Policy-v2-draft.md` + `Termos-Beta-v2-draft.md` + `LIA-Sentry.md v1.1` + `LIA-Langfuse.md v1.1`
- Honorários R$7-20k → **R$12-30k** (bundle completo)
- Paths absolutos pra drag-drop atualizados
- Status pré-condições atualizado com sessão 19/Mai (881/882 → 889/889 após fix)

**2. Crisis-protocol flake FIXED** (`apps/api/src/__tests__/services/crisis-protocol-service.test.ts`):
- **Root cause:** `crisis-protocol-service.ts:329` faz `await import('@sentry/node')` dinâmico
- Sentry SDK pesado (~50MB module graph) → first-time load ~1.2s
- Sob parallel load (36 files) → exceeds 5s timeout → flake
- **Fix:** `vi.mock('@sentry/node', () => ({ captureMessage: vi.fn(), captureException: vi.fn(), init: vi.fn() }))` no test
- Result: **1213ms → 26ms** test execution
- Suite full agora **889/889 zero flakes** (vs 881/882 antes)

**3. DEV-2 Integration Test E2E** (`apps/api/src/__tests__/integration/dev2-international-transfer-flow.test.ts`):
- Decisão: skip Playwright (não instalado, 10MB infra adicional) → integration test API mais direto e valioso para safety proof
- 7 tests cobrindo full chain: setInternationalTransferConsent → granular_consents insert + profiles.ai_features_enabled flip + requireAiConsent middleware
- Test groups:
  - **Onboarding ACCEPT path** (1 test): grant → flag stays true → middleware allows
  - **Onboarding REFUSE path** (1 test): refuse → flag flips false → middleware blocks 403 INTERNATIONAL_TRANSFER_CONSENT_REQUIRED
  - **Settings REVOCATION path** (2 tests): accept then revoke → block; revoke then re-accept → allow
  - **Audit guarantees** (2 tests): append-only audit log + IP/user-agent forensic capture
  - **Limited mode Art. 6 IX LGPD** (1 test): refusal preserves profile (não-discriminação)
- Mock pattern: in-memory profileStore + consentLog + setCurrentUser helper para sincronizar test/middleware
- All 7 passing em 11ms

### Suite final
**889/889 passing · 39/39 test files · zero flakes · 15.82s duration**

Breakdown desde 18/Mai:
- Sprint 17/Mai: 794/827 (+58 testes P0/SCC work)
- Sprint 18/Mai DEV-5/6/7: 827/877 (+50 testes ZDR + PII regression)
- Sessão 19/Mai execution: 876/882 (+5 ai-consent-gate)
- Sessão 19/Mai continue 1: 881/882 (+? Doc-only, flake reapareceu)
- **Sessão 19/Mai continue 2: 889/889** (+7 integration + flake permanent fix)

### Action items founder pendentes (refresh)

**Imediato (hoje/amanhã):**
1. `/mcp` autenticar Gmail OU copy/paste email Patricia v2 (agora com 9 anexos)
2. Aplicar migration 011 ai_features_enabled em Supabase prod

**Esta semana:**
3. R1 Railway BR setup (~45min)
4. R2 OpenAI ZRT enrollment (5min submit + 24-48h)
5. R5 Upstash cutover São Paulo (1-2h + janela manutenção)
6. Sentry server-side scrub config (DEV-3 ops)

**D-3 (27/Mai) HARD GATE:**
7. CNPJ + Razão Social PJ
8. DPO interim nomeado
9. Emails dpo@/privacidade@/security@anipis.com.br
10. Patricia retorna bundle assinado (SCC v2 + DPIA v2 + Privacy Policy v2 + Termos Beta v2 + LIAs v1.1 + parecer formal)

### Triggers próxima sessão
- `email patricia enviado` — atualiza status + agenda follow-up D-8 (22/Mai)
- `aplicou migration 011` — confirma + smoke test
- `r5 upstash feito` — atualiza DPIA + Privacy Policy + page transferencia-internacional
- `r1 railway feito` — atualiza Closed-Beta-Checklist
- `dpia v3` — incorpora correções de Patricia após retorno
- `próximo sprint` — pode iniciar tasks pós-D-0 (e.g., Playwright setup, endpoint /me/export portability, circuit breaker R6 caminho B)

**Why:** "continue" do user na 2ª iteração foi interpretado como: (a) maximizar valor pré-Patricia (bundle expandido pronto pra envio), (b) eliminar débito técnico evidente (flake), (c) provar end-to-end o gate de segurança DEV-2 (integration test). Playwright skipped porque não estava instalado e setup teria custado mais tempo que valor entregue pro Beta de 20 usuárias.

**How to apply:** próxima sessão pode (a) confirmar founder enviou email + executou runbooks, (b) começar próximo sprint (Playwright setup, endpoint portability self-service, ou Patricia v3 pós-feedback), (c) audit final pre-D-0 com Closed-Beta-Checklist consolidado.
