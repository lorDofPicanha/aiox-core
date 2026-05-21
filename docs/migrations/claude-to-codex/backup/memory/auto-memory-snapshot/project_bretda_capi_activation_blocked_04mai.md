---
name: Bretda CAPI Activation BLOCKED 04/Mai (Upstash token NOPERM evalsha)
description: 04/Mai CAPI ativação parcial — URL Upstash fixada (sem mais \n trailing), MAS token tem permissão limitada (NOPERM evalsha) e @upstash/ratelimit precisa rodar Lua scripts. POST 500 persiste.
type: project
originSessionId: 3dba5b26-b348-48a0-a283-5a53536bc382
---
# CAPI Bretda Activation — Status 2026-05-04 (atualizado)

## Done desta sessão (04/Mai)
- `UPSTASH_REDIS_REST_URL` removida + recriada limpa (printf sem newline) — verificado via `vercel env pull` que valor agora é `"https://just-pug-96035.upstash.io"` sem `\n` trailing
- Production redeploy `dpl_FXEdfx1EyLQgnSFMd5iHK4EfkD49` READY, aliased `https://www.bretda.com.br`
- Lead smoke POST `event_id=capi_smoke_005/006` → ainda **HTTP 500**

## Bug REAL revelado (após URL fix)
Com URL limpa, o runtime error mudou. `vercel logs --follow` capturou:

```
Error [UpstashError]: Command failed: NOPERM this user has no permissions
to run the 'evalsha' command or its subcommand
    at ic.withAutoPipeline (...)
    at async w (...)
    at async Object.limit (...)
    at async N.getRatelimitResponse (...)
    at async N.limit (...)
```

**Diagnóstico:**
- O `UPSTASH_REDIS_REST_TOKEN` armazenado em produção é um token com permissão restrita
- `@upstash/ratelimit` usa `EVALSHA` (Lua scripts) para implementar rate limiting atomicamente
- Token atual NÃO permite `evalsha` → toda execução de `Ratelimit.limit()` lança UpstashError
- Endpoint /api/meta-conversion chama `ratelimit.limit(ip)` antes de qualquer lógica de envio CAPI → 500

**Token age:** 3 dias (não foi tocado nesta sessão). Provavelmente foi criado como "Read-Only" ou com ACL custom no dashboard Upstash.

## Pixel ID + outras vars (sem mudança)
- `METAAPI_PIXEL_ID=3348133485496539` ✓
- `METAAPI_ACCESS_TOKEN` ✓ (sensitive)
- `UPSTASH_REDIS_REST_URL` ✓ (RECÉM CORRIGIDO)
- `UPSTASH_REDIS_REST_TOKEN` ❌ (precisa rotação para token full-access)
- `METAAPI_TEST_EVENT_CODE` ainda não criado

## Action item bloqueador (precisa user)
**Rotacionar o token Upstash:**

1. User abre dashboard Upstash → database `just-pug-96035`
2. Vai em "REST API" tab → seção "Tokens"
3. Cria um novo token **Full-Access** (ou usa o token padrão da database, que tem todas permissões incluindo eval/evalsha)
4. Copia valor
5. Manda pro Orion (esta sessão ou nova) pra rodar:
   ```powershell
   vercel env rm UPSTASH_REDIS_REST_TOKEN production --yes
   printf "<token>" | vercel env add UPSTASH_REDIS_REST_TOKEN production
   vercel --prod --yes
   ```
6. Re-rodar smoke Lead → 200 + fbtrace_id esperado

## Por que parei
Decision tree do prompt do user:
> Cenário B — Ainda 500: Se erro mencionar TOKEN: o `UPSTASH_REDIS_REST_TOKEN` também tem `\n`. **PARE e reporte** — eu (Orion) vou pedir o token limpo pro user (precisa do dashboard Upstash, você não tem acesso).

Erro NÃO é `\n` no token (seria erro de URL/conn), mas é problema de PERMISSÃO do token (NOPERM). Mesma classe de problema (precisa user no dashboard Upstash) → mesma decisão: PARE e reporte.

NÃO deletei o token. NÃO commitei nada. NÃO criei docs.

## Smoke completo (Steps 5-7) — NÃO executado
Bloqueado pelo mesmo Gate 2 (rate limit Upstash) antes do código avaliar Gate 3+.
