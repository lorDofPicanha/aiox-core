# DEV-7 — PII Leak Regression Guard (CI Gate)

**Status:** ✅ DONE
**Esforço:** estimado 2-3h · real ~1h
**Compliance:** SCC ANPD Res. 19/2024 Anexo IV (Sentry §G) · LIA Sentry §C · LIA Langfuse §C · LGPD Art. 11
**Data:** 2026-05-18
**Squad:** Orion (aios-master)

---

## Problema

A pipeline atual de filtragem PII vive em 5 lugares:

| Camada | Função-chave | Risco se removida |
|--------|-------------|-------------------|
| `llm-router.ts` → Langfuse | `redactedMessageTail()` + `redactForObservability()` | Prompts brutos com PII vão pra Langfuse (mesmo self-host BR) |
| `sentry-config.ts` → Sentry US | `beforeSendScrub` + 6 sub-scrubbers + `stripPii` | PII em error logs sai pra US |
| `langfuse-client.ts` helper | `redactForObservability()` interno | Pipeline observabilidade vaza |
| `crisis-event-logger.ts` → DB | shape-locked classifier_output (5 keys) | Adicionar campo `userMessage` ressuscitaria PII em colunas JSONB |
| `server.ts` boot | `...SENTRY_HARDENED_OPTIONS` spread | Vanilla `Sentry.init()` sem hardening = leak por default |

Cada um é uma única linha que um refactor distraído pode remover sem quebrar nenhum teste funcional. **Regressão silenciosa não detectada** = breach SCC.

---

## Solução

Static-analysis test em `apps/serenity-ai/apps/api/src/__tests__/ci/pii-leak-regression.test.ts` que lê os 5 arquivos-chave e pin as invariants:

**15 testes — 18/Mai 20:12:**
```
✓ src/__tests__/ci/pii-leak-regression.test.ts (15 tests) 7ms
Test Files  1 passed (1)
     Tests  15 passed (15)
```

### Cobertura

#### llm-router (5 testes)
- Importa `redactForObservability` ✅
- Define `redactedMessageTail()` helper ✅
- `callOpenAI` usa `this.redactedMessageTail(messages)` em `generation.input` ✅
- `callAnthropic` usa `this.redactedMessageTail(messages)` em `generation.input` ✅
- Toda `generation.end({ output })` ou usa `[ERROR]` (catch) ou usa `redactForObservability(content).sanitizedText` ✅

#### crisis-event-logger (2 testes)
- `classifier_output` insert usa só keys allowlistadas: `{ level, confidence, matchedKeywords, matchedPatterns, categories }` ✅
- `responseGiven` é bounded por `.substring(0, 2000)` ✅

#### sentry-config (3 testes)
- `SENTRY_HARDENED_OPTIONS` exporta `beforeSend`, `beforeBreadcrumb`, `sendDefaultPii: false` ✅
- `event.user` é reduzido a `{ id: hashed }` ou `{}` (drop email/username/ip) ✅
- Importa `stripPii` do pii-stripper ✅

#### langfuse-client (3 testes)
- Exporta `redactForObservability` função ✅
- Try-block contém `stripPii(text)` antes do catch ✅
- Catch fails-closed a `[REDACTION_FAILED]` placeholder ✅

#### server.ts boot (2 testes)
- Importa `SENTRY_HARDENED_OPTIONS` ✅
- `Sentry.init({ ... })` faz spread de `SENTRY_HARDENED_OPTIONS` ✅

---

## Como esses testes pegam regressão

**Cenário 1 — engenheiro remove `redactedMessageTail`:**
```typescript
// llm-router.ts before:
input: this.redactedMessageTail(messages),
// after (acidental refactor):
input: messages.map((m) => ({ role: m.role, content: m.content })),
```
→ Teste `passes redactedMessageTail (not raw messages)` falha imediato no CI.

**Cenário 2 — alguém adiciona `userMessage: event.userMessage` em classifier_output:**
→ Teste `classifierOutput insert uses only allowlisted fields` lista `userMessage` como forbidden e falha com mensagem explicando como atualizar allowlist + auditar.

**Cenário 3 — refactor de Sentry init perde o spread:**
```typescript
// before:
Sentry.init({ dsn, environment, ...SENTRY_HARDENED_OPTIONS })
// after:
Sentry.init({ dsn, environment })
```
→ Teste `Sentry.init spreads SENTRY_HARDENED_OPTIONS` falha.

**Cenário 4 — drift de `sendDefaultPii`:**
```typescript
// SENTRY_HARDENED_OPTIONS = {
//   beforeSend, beforeBreadcrumb, attachStacktrace: true,
//   // accidentally drops sendDefaultPii: false
// }
```
→ Teste `SENTRY_HARDENED_OPTIONS exports ... sendDefaultPii=false` falha.

---

## Limitações conhecidas (out-of-scope DEV-7)

Este guard pega **regressão estática** (alguém alterou o código). Não pega:

1. **Bypass dinâmico** — alguém criar `new RawSentryClient()` paralelo sem hardening
2. **Provider novo** — adicionar `bedrock` ou `gemini` sem aplicar `redactForObservability` no llm-router (mas o teste atual checa OpenAI + Anthropic explicitly, então provider novo SEM teste correspondente passaria)
3. **PII em logs Pino** — `app.log.warn({ userId, content })` que vai pro stdout/CloudWatch escapa esse guard
4. **Database leak** — INSERT direto em `audit_events.context` com PII bruto contornando `stripPii` helper

Para (1) e (2), recomenda-se code review humano + grep pre-merge. Para (3), seria DEV-8 (Pino redact config). Para (4), seria DEV-9 (DB-side trigger ou Drizzle middleware).

---

## Impacto no SCC v2

Esta verificação alimenta:
- **Anexo IV (Sentry) §G** — "medidas técnicas para prevenir vazamento de dados pessoais"
- **LIA Sentry §C** + **LIA Langfuse §C** — "salvaguardas técnicas verificáveis"
- **Cláusula 13.3** — controles técnicos auditáveis pela CONTROLADORA

Pode citar no SCC v2 (Patricia incorpora): _"DEV-7 — CI gate static-analysis test (15 testes) prevê regressão das salvaguardas técnicas de filtragem PII descritas neste Anexo. Falha automática em build se invariante for violada."_

---

## Arquivos

```
apps/serenity-ai/apps/api/src/__tests__/ci/pii-leak-regression.test.ts  (NEW 15 tests)
```

Lê e audita (não modifica):
```
apps/serenity-ai/apps/api/src/services/llm/llm-router.ts
apps/serenity-ai/apps/api/src/services/crisis-event-logger.ts
apps/serenity-ai/apps/api/src/services/observability/sentry-config.ts
apps/serenity-ai/apps/api/src/services/observability/langfuse-client.ts
apps/serenity-ai/apps/api/src/server.ts
```

---

**Reviewer signature:** Orion (aios-master)
