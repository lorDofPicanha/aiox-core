# DEV-4 — Upstash Redis Migration: us-east-1 → aws-sa-east-1 (São Paulo)

**Status:** ⏳ CODE-READY · DASHBOARD-PENDING
**Esforço:** estimado 1-2h · real 30min code (zero changes) + ~30min cutover dashboard + ~30min smoke
**Compliance:** SCC ANPD Res. 19/2024 — reduz transferência internacional para residual (Upstash region BR)
**Data:** 2026-05-18
**Squad:** Orion (aios-master)

---

## Veredito

**Código já está region-agnostic.** Migração é **100% operação de dashboard + env vars**, sem qualquer alteração em `apps/serenity-ai/apps/api/src/`.

---

## Auditoria de hardcoding

Search exhaustivo por `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`, `Redis.`, `us-east-1`, `useast`, `redis.upstash.io` em `apps/serenity-ai/`:

| Local | Conteúdo | Tipo |
|-------|----------|------|
| `apps/api/src/config/env.ts:18-19` | `UPSTASH_REDIS_URL: z.string().url().optional()` + `UPSTASH_REDIS_TOKEN: z.string().min(1).optional()` | Validação env Zod |
| `apps/api/src/plugins/rate-limit-chat.ts:24-32` | `new Redis({ url: env.UPSTASH_REDIS_URL, token: env.UPSTASH_REDIS_TOKEN })` | Cliente singleton via `getRedis()` |
| `apps/api/src/services/cache-purge.ts` | Reusa `getRedis()` (sem URL hardcoded) | Consumer batch-5 P0 #14 |
| `apps/api/src/services/safety/session-risk-tracker.ts` | Reusa `getRedis()` | Consumer SEC-06 |
| `.env.example:15-16` | placeholder vazio (sem region) | Doc |
| `.github/workflows/ci.yml:79-80` | `https://placeholder.upstash.io` | Test mock — ignorado |

**Zero hardcoding de região.** Cliente `@upstash/redis` é HTTP-REST → URL contém endpoint regional, mas é totalmente determinado pela env var.

---

## Cutover runbook (dashboard + ops)

### Pré-condição
- Conta Upstash com plano Pro/Enterprise (Free tier não permite região São Paulo na época da escrita — validar)
- Acesso admin ao host de deploy (Vercel/Railway/Magalu) para rotacionar env vars
- Janela de manutenção curta (~5min) — rate limit + cache serão **resetados** (TTL volta a contar do zero)

### Steps

1. **Criar nova instância Upstash em `aws-sa-east-1`** via console:
   - Console → Database → Create Database
   - Region: `AWS sa-east-1 (São Paulo)`
   - Type: `Regional` (não Global)
   - Eviction: `noeviction` (rate limits não podem evictar)
   - TLS: enabled
   - Anotar `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

2. **Smoke test local antes do cutover prod**:
   ```bash
   export UPSTASH_REDIS_URL=https://NEW-INSTANCE.sa-east-1.upstash.io
   export UPSTASH_REDIS_TOKEN=NEW-TOKEN
   cd apps/serenity-ai/apps/api
   npx vitest run src/__tests__/plugins/rate-limit-ws-sec06.test.ts
   ```
   Esperado: 11/11 passing.

3. **Cutover prod**:
   - Pausar dyno/function por ~30s
   - Atualizar `UPSTASH_REDIS_URL` + `UPSTASH_REDIS_TOKEN` no host de deploy
   - Reiniciar processo
   - Validar logs: `Sentry initialized` + ausência de stack `[Upstash] Connection failed`
   - Smoke real: enviar 1 chat message → conferir rate limit counter incrementa (curl `/health` + `/chat`)

4. **Pós-cutover**:
   - Manter instância antiga (us-east-1) por **7 dias** como rollback fallback (custo desprezível)
   - Após 7 dias sem incidente, deletar instância antiga
   - Atualizar `Anexo III (Upstash) §A.6` no SCC para refletir `aws-sa-east-1`

### Rollback (se necessário em <72h)
- Reverter env vars para URL/token antigos
- Restart processo
- Rate limits resetam (não há sincronização entre instâncias — é cache, aceitável)

---

## Impacto no SCC v2

**Anexo III (Upstash) §A.6 "Localização":** trocar de `aws-us-east-1` para `aws-sa-east-1 (São Paulo, Brasil)`. Isso **remove Upstash da lista de subprocessadores com transferência internacional** (LGPD Art. 33 IV), reduzindo a superfície regulatória da SCC.

**Cláusula 12** (FISA/CLOUD Act) continua aplicável a OpenAI/Anthropic/Sentry, mas Upstash sai do escopo de risco de jurisdição estrangeira para dados em runtime (chave-valor de rate limit + cache de sessão).

**Anexo VII (Mapa de Transferências)** atualizar para mostrar **5 subprocessadores US** ao invés de 6 (Upstash deixa de figurar como US-resident).

---

## Action items

### ⏳ Founder (Breno)
1. **Verificar plano Upstash** suporta região São Paulo (provavelmente requer upgrade Pro ~$10/mês)
2. **Agendar janela de cutover** — recomendo madrugada baixo tráfego (Closed Beta tem ~20 usuárias)
3. **Após cutover**, instruir Patricia a atualizar Anexo III §A.6 + Anexo VII no SCC v2

### ✅ Code-side — Nada a fazer
Sem refactor necessário. Sem nova dependência. Sem migration.

### 📝 Validação pós-migração
Smoke test sugerido (5min):
```bash
# 1. Health check
curl https://api.anipis.com.br/health

# 2. Send chat → rate limit deve incrementar
curl -X POST https://api.anipis.com.br/chat -H "Authorization: Bearer $TOKEN" -d '{"message":"oi"}'

# 3. Inspecionar Upstash dashboard → key count deve incrementar (rate:chat:USER_ID)
```

---

## Por que isso importa pra ANPD

Bruce Schneier (audit 17/Mai) nota: cada subprocessador estrangeiro adiciona superfície a `FISA §702` + `EO 12333` + `CLOUD Act`. Upstash em São Paulo elimina essa exposição para dados de rate limiting (que incluem `user_id` em chave Redis e podem ser quasi-identificadores para correlação cruzada).

Patricia Peck (SCC v1 17/Mai) classifica Upstash como subprocessador US — após esta migração, fica como **subprocessador BR sem transferência internacional** (Art. 33 LGPD inaplicável).

---

**Reviewer signature:** Orion (aios-master) — referência: SCC squad legal review (Bruce Schneier + Lucia Savage + Patricia Peck clone)
