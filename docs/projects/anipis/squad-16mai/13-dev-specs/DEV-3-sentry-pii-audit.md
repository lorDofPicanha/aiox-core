# DEV-3 — Sentry beforeSend PII Audit

**Status:** ✅ DONE (verificação)
**Esforço:** estimado 1h · real 0h (já implementado em sprint anterior)
**Compliance:** SCC ANPD Res. 19/2024 Anexo IV (Sentry) §G/§D · LIA Sentry §C
**Data:** 2026-05-18
**Auditor:** Orion (aios-master) + squad legal AIOS clones

---

## Veredito

**APROVADO sem ressalvas.** Implementação atual em `apps/serenity-ai/apps/api/src/services/observability/sentry-config.ts` cumpre integralmente as salvaguardas técnicas exigidas pelo Anexo IV §G e pela LIA §C. Suite de 25 testes (`sentry-config.test.ts`) executada hoje **18/Mai 20:03 — 25/25 passing em 13ms**.

---

## Escopo da auditoria

A LIA Sentry §C requer que **nenhum dado pessoal bruto** atinja a infraestrutura Sentry SaaS US. Auditadas 6 superfícies de vazamento conhecidas em events Sentry:

| # | Superfície | Risco LGPD | Implementação atual | Veredito |
|---|------------|-----------|---------------------|----------|
| 1 | `event.message` | Free-text com PII em logs de erro | `scrub(value)` via `stripPii()` — substitui CPF/email/telefone/endereço/nome/data por tokens `[TIPO]` | ✅ |
| 2 | `event.user` | Email, IP, username de usuárias Júlias | Drop completo de TODAS chaves exceto `id` → `hashUserId()` (sha256 truncado 16 hex) | ✅ |
| 3 | `event.request` | Body POST + cookies + Authorization header | Drop de `data`, `cookies`, `authorization`, `cookie`, `set-cookie`; `query_string` passado por `scrub()` | ✅ |
| 4 | `event.extra` / `event.contexts` | PII em metadados ad-hoc | Recursão `scrubRecord()` em strings; preserva tipos primitivos não-string | ✅ |
| 5 | `event.breadcrumbs` | Input UI (ui.input/ui.click/console) capturando dados sensíveis durante interação | Drop completo de categorias interativas; `scrub()` no message das demais (http, navigation, etc.) | ✅ |
| 6 | `event.exception.values[].value` | Stack trace error message com PII em runtime exception | `scrub()` em cada `value` da array | ✅ |

**Bonus salvaguardas:**
- `sendDefaultPii: false` — Sentry SDK default-deny no envio de IP/cookies/headers via auto-instrumentation
- `attachStacktrace: true` — preserva utilidade operacional
- **Fail-open com placeholder seguro**: erro dentro do hook não derruba processo; retorna `[SENTRY_SCRUB_FAILED]` event com tag `sentry_scrub_failed=true` para alerta SRE
- `beforeBreadcrumb` hook separado executa scrub em captura individual (defesa em profundidade)

---

## Wiring confirmado

`apps/serenity-ai/apps/api/src/server.ts:173-182`:

```typescript
if (env.SENTRY_DSN_API) {
  const Sentry = await import('@sentry/node')
  Sentry.init({
    dsn: env.SENTRY_DSN_API,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    ...SENTRY_HARDENED_OPTIONS,  // ← spread DEV-3 hardening
  })
  app.log.info('Sentry initialized (hardened: PII scrubbers active)')
}
```

Spread de `SENTRY_HARDENED_OPTIONS` **garante que toda inicialização Sentry no API server passe pelo hardening**. Não há `Sentry.init()` paralelo em outros arquivos (grep audit confirma).

---

## Test coverage detalhado

`apps/serenity-ai/apps/api/src/__tests__/services/observability/sentry-config.test.ts` (25 testes):

| Categoria | Testes | Coverage |
|-----------|--------|----------|
| `event.message` PII redaction | 4 | CPF formatado, email, telefone, no-op pass-through |
| `event.user` hash + drop | 4 | Hash id 16 chars, strip email/username/ip, empty fallback, determinismo |
| `event.request` headers/body | 3 | Drop data+cookies, strip auth headers, scrub query_string |
| `event.extra` recursivo | 2 | Strings recursive scrub, preserve non-string primitives |
| `event.breadcrumbs` filter | 2 | Drop ui.input/click/submit/console, scrub http message |
| `event.exception.values` | 1 | Scrub PII em error.value |
| Fail-open behavior | 2 | No-throw on null/undefined, preserve level=error |
| `beforeBreadcrumbScrub` hook | 3 | Drop interactive categories, scrub http, no-op clean |
| `SENTRY_HARDENED_OPTIONS` config | 1 | Validates 4 export fields |
| Internal helpers (`__test__`) | 3 | hashUserId 16-hex, empty handling, stringify non-string |

**Execution log 18/Mai 20:03:43:**
```
✓ src/__tests__/services/observability/sentry-config.test.ts (25 tests) 13ms
Test Files  1 passed (1)
     Tests  25 passed (25)
   Duration  874ms
```

---

## Action items

### ✅ Code-side — Nada a fazer
Implementação completa, testada, wired no boot. Sem dívida técnica identificada.

### ⏳ Operacional (founder/devops)
1. **Validar `SENTRY_DSN_API` apontando para o projeto Sentry US Anipis** (não para org compartilhada) — isolamento de evidência forense
2. **Configurar Sentry org-level data scrubbing rules** como segunda linha de defesa (defense in depth) — Sentry's server-side scrubbing roda DEPOIS do `beforeSend` e pega o que escapou
3. **Habilitar Sentry "Restrict to allow-listed IPs"** em integrations admin (acesso console)
4. **Smoke test pré-Closed Beta 30/Mai**: provocar erro síntetico contendo CPF/email em dev e validar que Sentry UI mostra apenas tokens `[CPF]`/`[EMAIL]` + `user.id` hashado

### 📝 Documentação para SCC v2 (Patricia)
Esta verificação alimenta:
- **Anexo IV §G** "salvaguardas técnicas": referenciar `sentry-config.ts:104-169` + 25 testes
- **LIA Sentry §C** "medidas de segurança": confirmar implementação ANTES da assinatura

---

## Arquivos auditados

```
apps/serenity-ai/apps/api/src/services/observability/sentry-config.ts          (195 linhas)
apps/serenity-ai/apps/api/src/__tests__/services/observability/sentry-config.test.ts  (252 linhas, 25 tests)
apps/serenity-ai/apps/api/src/services/pii-stripper.ts                          (função stripPii subjacente)
apps/serenity-ai/apps/api/src/server.ts:173-182                                 (wiring boot)
```

---

**Reviewer signature:** Orion (aios-master) — Squad legal AIOS clones (Bruce Schneier security model + Lucia Savage LGPD compliance)
