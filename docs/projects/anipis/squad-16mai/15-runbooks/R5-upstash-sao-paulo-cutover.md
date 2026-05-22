# R5 — Upstash Redis São Paulo Cutover

> ⚠️ **OBSOLETO — DESCONTINUADO PELO FOUNDER (19/Mai/2026, D16)**
>
> Founder optou por **pular** o cutover regional (Pular — anti-pattern aceito conscientemente). Upstash permanece em `aws-us-east-1` indefinidamente; reavaliação pós-Beta. Documentação atualizada:
> - `anipis-RIPD-DPIA-v2.md` §5 Tabela 4 — Upstash `ATIVA us-east-1` + nota "cutover adiado D16"
> - `Privacy-Policy-v2-draft.md` §7 — Upstash status `ATIVA`
> - `apps/web/src/app/(legal)/transferencia-internacional/page.tsx` — SUBPROCESSORS Upstash `status: 'ativa'`
>
> Este runbook fica arquivado caso o cutover seja retomado no roadmap pós-Beta.

---

**[ARQUIVADO] Quem executaria:** Founder + Dev (cutover coordenado)
**[ARQUIVADO] Tempo estimado:** 1-2h trabalho + janela manutenção 5-10min + 7d hold pra rollback
**[ARQUIVADO] Deadline original:** D-7 (23/Mai/2026)
**Decisão referenciada:** SCC Anexo V §G "quick-win regional migration" + DPIA v2 §5 Tabela 4 status "MIGRANDO"
**Status DEV-side:** ✅ **CÓDIGO AGNÓSTICO** — zero refactor necessário (env.UPSTASH_REDIS_URL aceita qualquer endpoint)

---

## TL;DR

Upstash Redis está hoje em **aws-us-east-1** (transferência internacional). Migrar para **aws-sa-east-1 (São Paulo)** elimina uma das 5 transferências internacionais ativas, simplificando o SCC + DPIA + Privacy Policy.

**Impacto operacional:** zero downtime se executado fora de horário pico. Cutover via troca de 2 env vars + redeploy.

**Custo:** mesmo plano (~$10/mês Pro tier se ainda não migrado; free tier não tem DPA).

**Risco residual:** in-flight rate-limit counters e WS connection tracking são perdidos no momento do cutover (TTL ≤15min, recuperação automática).

---

## Pré-requisitos

- [ ] Plano Upstash **Pro** ($10-50/mês) — necessário para DPA assinado
- [ ] Acesso ao dashboard Upstash (https://console.upstash.com)
- [ ] Acesso ao Railway env vars (R1 completo)
- [ ] Janela de manutenção identificada (idealmente 2-5h madrugada BR, baixíssimo uso Beta)

---

## Passo 1 — Verificar plano atual (5min)

1. https://console.upstash.com → ver tier conta
2. Se **Free tier**: upgrade para Pro primeiro
   - Click "Upgrade Plan" → escolher Pro
   - Fornecer cartão (cobrança USD)
3. Se **Pro/Enterprise**: prosseguir

---

## Passo 2 — Criar nova instância sa-east-1 (10min)

1. Dashboard → **"Create Database"**
2. **Region:** `AWS - South America (São Paulo) - sa-east-1` ⚠️ CRÍTICO
3. **Type:** `Regional` (mesmo da atual)
4. **Eviction:** `allkeys-lru` (mesmo da atual)
5. **TLS:** ✅ Enabled (obrigatório)
6. **Name:** `anipis-redis-br-beta` (sugestão)
7. Click **Create**

Aguardar provisioning (~30s).

---

## Passo 3 — Copiar credenciais (3min)

Na página da nova instância:

1. **Endpoint** (algo como `https://anipis-redis-br-beta-XXXX.upstash.io`) — copiar
2. **REST Token** — copiar (clicando no olho "Show")

⚠️ **NÃO commitar essas credenciais em código.** Vão apenas para Railway env vars.

---

## Passo 4 — Smoke test local (10min)

Antes de cutover prod, validar a nova instância localmente:

```bash
# Em qualquer máquina com Node + .env.local da Anipis
cd apps/serenity-ai/apps/api

# Backup das vars antigas
cp .env.local .env.local.backup-pre-cutover

# Editar .env.local — apenas estas 2 linhas:
# UPSTASH_REDIS_URL=https://anipis-redis-br-beta-XXXX.upstash.io
# UPSTASH_REDIS_TOKEN=<novo token>

# Rodar test suite
npx vitest run __tests__/crisis-routes.test.ts src/__tests__/plugins/rate-limit-ws-sec06.test.ts
# Esperar: ambos passando (não dependem da URL real, mas pegam typos)

# Smoke test manual (se preferir, opcional):
# npm run dev → testar chat localmente → confirmar nada quebra
```

Se OK: restaurar `.env.local` original (a cópia está em `.env.local.backup-pre-cutover`).

---

## Passo 5 — Janela de manutenção (escolher horário)

**Sugestão:** entre 3h e 5h da manhã (BR), quando uso é ≈zero.

Avisar (opcional, 20 Júlias durante Beta):
> "Manutenção breve do Anipis na madrugada de YYYY-MM-DD entre 3h-5h. Pode haver lentidão por até 5 minutos."

---

## Passo 6 — Cutover prod (5min)

### 6.1. Update Railway env vars

1. Railway dashboard → projeto `anipis-api-beta` → **Variables**
2. Editar:
   - `UPSTASH_REDIS_URL` → colar novo endpoint
   - `UPSTASH_REDIS_TOKEN` → colar novo token
3. Salvar (vai disparar auto-deploy)

### 6.2. Aguardar deploy + smoke

1. **Deployments** tab → aguardar deploy completar (~2-3min)
2. View Logs procurar:
   ```
   [Anipis API] Server listening on 0.0.0.0:3000
   ```
3. Smoke endpoint:
   ```bash
   curl https://api.anipis.com.br/health
   # Espera: {"status":"ok","timestamp":"..."}
   ```
4. Smoke chat (com JWT válido):
   ```bash
   JWT=<seu-jwt-supabase>
   curl -X POST https://api.anipis.com.br/chat/message \
     -H "Authorization: Bearer $JWT" \
     -H "Content-Type: application/json" \
     -d '{"message":"smoke test pos-cutover","conversationId":"smoke-cutover-2026-05-23"}'
   # Espera: response da IA OK (rate-limit Redis funciona via nova instância)
   ```

---

## Passo 7 — Verificar latência (5min)

Validar que latência sa-east-1 é melhor que us-east-1:

1. Upstash dashboard nova instância → **Metrics** tab
2. Aguardar 5-10min para coletar dados
3. **Average request latency:** esperado <20ms (vs ~150ms us-east-1)
4. Se latência alta: pode ser dev region distinta da app. Verificar Railway region é mesma São Paulo (R1 step 3).

---

## Passo 8 — Hold instância antiga por 7 dias (rollback safety)

NÃO deletar a instância us-east-1 ainda. Mantê-la **pausada/idle** por 7 dias caso rollback necessário.

1. Upstash dashboard → instância antiga
2. **Pause** (não delete)
3. Calendar reminder: D+7 (30/Mai) deletar definitivamente se nenhum issue surgir

---

## Passo 9 — Atualizar documentação compliance (10min)

Após confirmação cutover OK:

1. `docs/projects/anipis/squad-16mai/12-compliance/anipis-RIPD-DPIA-v2.md` Tabela 4:
   - Linha Upstash: trocar `Status Closed Beta: MIGRANDO` para `ATIVA (sa-east-1 SP)`
   - Linha "Total operadoras estrangeiras": **5** (sem Upstash)
2. `docs/projects/anipis/squad-16mai/12-compliance/Privacy-Policy-v2-draft.md` §7 Tabela:
   - Linha Upstash: trocar `MIGRANDO` para `ATIVA — Brasil (sa-east-1)`
3. `apps/serenity-ai/apps/web/src/app/(legal)/transferencia-internacional/page.tsx`:
   - Update SUBPROCESSORS array Upstash:
     - `jurisdiction: 'Brasil (AWS sa-east-1, São Paulo)'`
     - `status: 'ativa'`
     - Remove `notes` sobre migração
4. Trigger Orion `r5 upstash cutover feito` → atualiza memory + indexa nova versão DPIA

---

## Passo 10 — Notificar Patricia (opcional, 5min)

Email curto para Patricia:

> Patricia, oi —
>
> Concluímos o cutover Upstash para sa-east-1 (São Paulo) em [data]. Isso reduz nosso rol de operadoras estrangeiras de 6 para 5, e o SCC Anexo V perde o status "EUA" (migra para "Brasil — não é mais transferência internacional").
>
> Atualizei DPIA v2 + Privacy Policy correspondente. Anexo: screenshot dashboard sa-east-1 ativo.
>
> Pode incorporar essa redução no SCC v2 quando enviar?
>
> Abraço,
> Breno

---

## Checklist final

- [ ] Pro tier Upstash ativo (DPA disponível)
- [ ] Instância sa-east-1 criada com TLS
- [ ] Smoke test local OK
- [ ] Janela manutenção escolhida (horário de baixo uso)
- [ ] Railway env vars atualizadas (URL + TOKEN)
- [ ] Health endpoint 200 pós-deploy
- [ ] Smoke chat funciona pós-cutover
- [ ] Latência <20ms confirmada
- [ ] Instância antiga **pausada** (não deletada — hold 7d)
- [ ] DPIA v2 + Privacy Policy + page transferencia-internacional atualizados
- [ ] Calendar reminder D+7 para deletar instância antiga
- [ ] Patricia notificada (opcional)

---

## Troubleshooting

**Boot prod falha pós env update:**
→ Verificar typo em URL ou TOKEN. Voltar env vars antigas em Railway, redeploy.

**Chat retorna 503 / rate-limit-chat error:**
→ TOKEN inválido. Recheck token (Upstash às vezes mostra masked — clica "Show full").

**Latência sa-east-1 > us-east-1:**
→ Railway provavelmente está em US region. Confirmar Railway region é "São Paulo" (R1 step 3). Se não estiver, criar projeto novo em SP ou aceitar latência.

**TLS error / certificate mismatch:**
→ Confirmar URL começa com `https://` (não `http`). Upstash sempre TLS no Pro.

**WS connections caem no momento do cutover:**
→ **Esperado.** Clientes reconectam automaticamente em 5-10s. TTLs de rate-limit (≤15min) resetam mas é aceitável (lado "concessivo" temporário, não inseguro).

---

## Custo esperado

| Item | Antes | Depois |
|---|---|---|
| Plano Upstash | Free/Pro us-east-1 | Pro sa-east-1 (~$10/mês) |
| Transferência internacional | 1 (US) | 0 (BR) |
| Operadoras estrangeiras DPIA | 5 (incl. Upstash) | 4 |
| Latência Redis avg | ~150ms | <20ms |
| Custo cumulativo Beta | similar | +$10/mês ($0 se já Pro) |

---

## Por que essa migração vale a hora

1. **DPIA simplificado:** uma operadora a menos na cláusula 12 (autoridades estrangeiras) = menor exposure FISA/CLOUD Act
2. **SCC Anexo V removido:** Patricia não precisa negociar mais um vendor US
3. **Latência:** rate-limit checks ficam ~7x mais rápidos (perceptível em chat real-time)
4. **Custo zero/baixo:** se já era Pro, é mesma fatura
5. **Argumento Closed Beta:** "5 operadoras estrangeiras ativas" soa melhor que "6"

---

## Próximo passo

Após R5 completo:
→ DEV-2 Settings UI revocation flow (próxima sessão Orion ou demandar)
→ E2E Playwright test full onboarding international transfer

**Trigger Orion:** `r5 upstash cutover feito` → atualiza Closed-Beta-Checklist + DPIA v2 + Privacy Policy + page transferencia-internacional automaticamente
