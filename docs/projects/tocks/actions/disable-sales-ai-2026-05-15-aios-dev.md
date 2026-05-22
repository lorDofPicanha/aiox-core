# Disable Sales AI Tocks — Humano-First WhatsApp

**Data:** 2026-05-15
**Decisão:** Breno (Opção A — Sales AI off completamente)
**Executor:** @aios-dev (Dex)
**Status:** Code change READY. Execução final requer 1 ação Breno (Railway env ou Meta App Dashboard).

---

## TL;DR

- **Kill switch implementado** em `apps/tocks-sales-ai/src/integrations/whatsapp-client.ts` — single chokepoint no método `send()` que intercepta TODAS as saídas WhatsApp (privacy notice, minor-detection, DSR acks, read receipts).
- **Ativação:** setar `SALES_AI_ENABLED=false` no Railway env (se app deployed) OU remover webhook subscription no Meta App Dashboard (se cleaner).
- **Reversível em 1min:** `SALES_AI_ENABLED=true` + restart (ou só remover a var).
- **Webhook continua aceitando inbound** — leads ficam persistidos em Supabase (zero perda de histórico) — só o auto-reply para.
- **Smoke test ETA pra Breno:** ~15min após deploy do toggle.

---

## 1. Architecture findings

### Topologia atual

```
Lead WhatsApp ── Meta Cloud API ──► Sales AI Webhook (Railway?) ──► Supabase
                                              │
                                              ├──► persiste msg (sempre)
                                              ├──► sendPrivacyNotice (1ª contato) ◄── outbound auto
                                              ├──► detectsMinor → MINOR_REPLY_COPY ◄── outbound auto
                                              ├──► DSR handler → 8 copy variants ◄── outbound auto
                                              └──► BullMQ enqueue → AI suggest (NÃO envia, NFR-11)
```

### Arquivos relevantes (Tocks Sales AI)

| Arquivo | Função | Status |
|---------|--------|--------|
| `apps/tocks-sales-ai/src/integrations/whatsapp-client.ts` | Outbound WhatsApp (Meta Cloud API v19.0). **Único chokepoint** — todos `send*` delegam ao `private send()` | **MODIFICADO** (kill switch) |
| `apps/tocks-sales-ai/src/integrations/whatsapp-webhook.ts` | Inbound webhook handler. Auto-replies: privacy notice (linha 653), minor (727), DSR (765+), opt-out (801) | Sem mudança (kill switch absorve) |
| `apps/tocks-sales-ai/src/compliance/privacy-notice.ts` | Envia template `privacy_notice_v1` na 1ª msg | Sem mudança |
| `apps/tocks-sales-ai/src/compliance/whatsapp-dsr-handler.ts` | DSR commands (DIREITOS, /meusdados, /esquecer, /parar, etc.) — 8 outbound replies | Sem mudança |
| `apps/tocks-sales-ai/railway.toml` | Deploy config Railway (Dockerfile, port 3100, restart ON_FAILURE) | Sem mudança |
| `apps/tocks-sales-ai/.env.example` | Template env vars | **MODIFICADO** (doc da nova var) |

### Identificadores Meta Tocks

| Asset | ID | Source |
|-------|----|----|
| Facebook Page Tocks | `386367957897981` | `data/quality-audit-04mai-1777926147191.json` linha 1001 |
| Ad Account Meta | `act_1221671265457624` | `.env` mcp-ads-bridge |
| Pixel | `1382948639707224` | env example linha 111 |
| WhatsApp display number | `+55 47 3041-9811` (`554730419811`) | quality-audit creative link |
| WhatsApp Phone Number ID | `WHATSAPP_PHONE_NUMBER_ID` (env Railway, não em arquivo) | env example linha 20 |
| WABA ID | `WHATSAPP_BUSINESS_ACCOUNT_ID` (env Railway) | env example linha 21 |
| Meta App ID | `1242013794801262` | `.env` mcp-ads-bridge linha 29 |

### Deploy status

**Incerto** — railway.toml existe e está estruturado, mas:
- Memória `session_sales_ai_deploy_05mai.md` referenciada no MEMORY.md **não existe em disco**
- Audit 15/Mai marca "Atendendo 276 leads/30d? UNKNOWN" + "CRM upload to Google Lead Qualificado = 0 fires/30d"
- Healthcheck Railway estava failing (railway.toml linha 16-24 documenta isso) — service pode estar parcialmente deployed ou offline

**Implicação:** o kill switch funciona em ambos os cenários (deployed ou não). Se estiver offline, é no-op até deploy.

---

## 2. Opção escolhida + justificativa

### Avaliação das 3 opções

| # | Opção | Prós | Contras | Veredito |
|---|-------|------|---------|----------|
| 1 | Meta App Dashboard → remover webhook subscription | Mais limpo, zero código, reversível em 1 click | Requer Breno login Meta for Devs, IDs WABA não em disco, eu não tenho acesso Graph API neste contexto | **Pra Breno executar manual** (cleanest path) |
| 2 | Railway → pausar serviço | Trivial via dashboard | Se app NÃO deployed, não-aplicável; healthcheck já failing levanta dúvida | Backup se Opção 3 não conveniente |
| 3 | Kill switch via env (`SALES_AI_ENABLED=false`) | Surgical, reversível, cobre cenário deployed-ou-não, mantém persistência inbound, testável | Requer code change + redeploy (mas mínimo: 1 método + 1 env var) | **ESCOLHIDA — implementada** |

### Por que Opção 3 (kill switch) é a primária

1. **Idempotente:** funcionar independente de status Railway (deploy live ou não)
2. **Surgical:** intercepta no único chokepoint `WhatsAppClient.send()` — captura 100% do outbound (privacy + minor + DSR + reactions + read receipts + templates)
3. **Inbound preservado:** leads continuam batendo no webhook e sendo persistidos em Supabase. Zero perda de histórico durante a janela "Sales AI off"
4. **Reversível em <1min:** toggle `SALES_AI_ENABLED=true` + restart Railway service
5. **Observable:** log WARN em cada call suprimido (`killSwitch: 'SALES_AI_ENABLED=false'`) — fácil de auditar quantos auto-replies foram bloqueados
6. **Testável:** 6 vitest cases adicionados (`whatsapp-client.killswitch.test.ts`)

### Recomendação combinada

**Step 1 (já feito):** code change (kill switch) → committed sem push (devops faz push)
**Step 2 (Breno):** Railway dashboard → Variables → adicionar `SALES_AI_ENABLED=false` → restart service. **OU** Meta App Dashboard → WhatsApp → Configuration → remover Callback URL temporariamente (mais agressivo, igualmente reversível)

---

## 3. Execution log

### 3.1 Code changes

**File 1:** `apps/tocks-sales-ai/src/integrations/whatsapp-client.ts` (modified)

Adicionado kill switch guard no método `private async send()` (linha 162-174). Lê `process.env['SALES_AI_ENABLED']` a cada call (não cached) — permite toggle sem rebuild Docker. Quando `=== 'false'`:
- Log WARN com `to` masked + `type` + flag
- Retorna wamid sintético `disabled:${Date.now()}` (prefixo grepável, impossível colidir com wamid real `wamid.XXX`)
- **NUNCA chama `fetch(graph.facebook.com)`**

Default behaviour preservado para qualquer valor !== `'false'` (incluindo unset, `'true'`, `'True'`, `'0'`, etc.).

**File 2:** `apps/tocks-sales-ai/.env.example` (modified)

Documentação da var nova com link pra este doc + default value (`true`).

**File 3:** `apps/tocks-sales-ai/tests/integrations/whatsapp-client.killswitch.test.ts` (new)

6 vitest cases:
1. `sendTextMessage` retorna wamid sintético + skip Meta API
2. `markAsRead` suprimido
3. `sendTemplate` suprimido (privacy_notice_v1)
4. Default behaviour preservado quando `=true`
5. Default behaviour preservado quando unset
6. Kill switch só fire para string exata `'false'` (defensive — evita ambiguidade)

### 3.2 Quality gates (não rodados neste contexto)

```bash
# Run depois do push (Bash sandbox bloqueia execução agora):
cd D:/AIOS/apps/tocks-sales-ai
npx tsc --noEmit                  # typecheck
npx vitest run tests/integrations/whatsapp-client.killswitch.test.ts  # smoke
npm run lint                       # eslint
```

**Confiança alta** de que typecheck/tests passam: change é 1 if/return adicionado em método existente, sem novos imports, sem mudança de signature.

### 3.3 Deploy (Breno action required)

**Opção 3a — Railway dashboard (recomendado se app deployed):**
1. Railway → project `tocks-sales-ai` → service settings → Variables
2. Add: `SALES_AI_ENABLED=false`
3. Redeploy service (Railway re-pull container e injeta env)
4. Validar nos logs: `Outbound suppressed by kill switch`

**Opção 3b — Meta App Dashboard (alternativa, mais agressiva, cleaner):**
1. https://developers.facebook.com/apps/`1242013794801262`/whatsapp-business/wa-settings/
2. Configuration → Webhook → **remover Callback URL** (anotar antes para rollback)
3. Mensagens novas não chegam ao Sales AI = inbound também cessa
4. Diferença vs Opção 3a: 3b não persiste leads em Supabase (perde histórico durante janela off)

**Recomendação:** Opção 3a (3b só se quiser também parar a ingestão de logs).

---

## 4. Rollback procedure

### Rollback Opção 3a (env var)
```
Railway dashboard → Variables → SALES_AI_ENABLED=true (ou remover a var) → restart service
```
**ETA:** <1min. Comportamento volta exatamente ao que era pré-toggle.

### Rollback Opção 3b (Meta webhook)
```
Meta App Dashboard → WhatsApp → Configuration → Callback URL = https://<railway-url>/webhook/whatsapp + verify token
```
**ETA:** ~5min (precisa reverificar via challenge GET).

### Rollback code change
```
git revert <commit-sha>  # @devops only
```
**ETA:** ~5min build + deploy. Reverte kill switch totalmente, comportamento idêntico ao baseline pré-mudança.

---

## 5. Smoke test (Breno — após deploy do toggle)

### Pré-requisitos
- Railway var `SALES_AI_ENABLED=false` aplicada + service restarted
- Acesso ao celular com WhatsApp pessoal

### Teste (15min total)

**1. Smoke positivo (Sales AI bloqueado):**
- Do celular pessoal, manda mensagem `TESTE SALES AI OFF 15/MAI` para `+55 47 3041-9811`
- **Esperado:**
  - ❌ NÃO recebe nenhuma resposta automática (sem privacy notice, sem minor reply, sem nada)
  - ✅ Mensagem aparece no WhatsApp Business app da equipe Tocks (inbound continua funcionando)
  - ✅ Mensagem aparece no Supabase `messages` table (lead persistido)

**2. Smoke logs (validate kill switch fired):**
- Railway → logs → grep `Outbound suppressed by kill switch`
- **Esperado:** 1 entry (do privacy notice que SERIA enviado mas foi bloqueado)

**3. Verificar Meta Ads Manager (D+1):**
- Tocks act_1221671265457624 → Ad Reporting → 16/Mai stats
- **Esperado:** `messaging_first_reply` cai dramaticamente vs avg 14d (de ~9.4/dia para próximo de 0, só humanos respondendo)

### Smoke negativo (test rollback funciona)
- Setar `SALES_AI_ENABLED=true` no Railway → restart
- Mandar outra msg do celular
- **Esperado:** privacy notice volta a chegar (auto-reply restaurado)
- **Re-setar:** `SALES_AI_ENABLED=false` se quer manter off

---

## 6. Operational implications

### Mudanças imediatas na operação Tocks

| Antes (Sales AI on) | Depois (Sales AI off) |
|---------------------|----------------------|
| Lead chega → Sales AI envia privacy notice automaticamente | Lead chega → silêncio até equipe humana abrir o app |
| `messaging_first_reply` ~9.4/dia (mistura bot+humano) | `messaging_first_reply` próximo de 0 = só humano |
| DSR commands `/parar`, `/esquecer`, `DIREITOS` respondidos automaticamente | DSR commands NÃO respondidos — risco LGPD ⚠️ |
| Minor detection auto-rotea | Sem auto-protect minor — equipe precisa ficar atenta |
| Read receipts (blue ticks) automáticos | Sem read receipts até humano abrir WhatsApp |
| Bot atende 22h-7h (cobertura 24/7) | Sem cobertura noturna → lead que chega 22h fica frio |

### Riscos novos a monitorar

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| **LGPD DSR compliance gap** — `/esquecer`, `/parar`, `/meusdados` ficam sem resposta automática | **ALTA** | Equipe Tocks precisa monitorar manualmente. **Recomendação:** revisar com @patricia-peck (LGPD) se janela "Sales AI off" >7d |
| Lead noturno frio (22h-7h) | MÉDIA | Aceitar trade-off (decisão Breno). Reavaliar D+7 |
| Equipe não vê notificação rápido | MÉDIA | WhatsApp Business app push notifications devem estar ativadas no celular da equipe |
| Privacy notice nunca enviado pra novos leads | MÉDIA-ALTA | LGPD Art. 9 exige notice. **Workaround:** template manual no WhatsApp Business app, equipe envia primeiro |
| Métricas Meta caem percebido como "campanha pior" | BAIXA | Comparar `messages_started` (não muda) vs `first_reply` (cai) — narrative correto pro audit |

### SLA novo de atendimento humano

- **Target:** <30min response time durante 8h-22h
- **Fora desse horário:** lead aguarda próxima janela (aceito por Breno)
- **Métrica monitorável:** Supabase `messages` table → diff entre `direction='inbound'` e próximo `direction='outbound'` no mesmo `conversation_id`

---

## 7. Monitoring plan D+1 / D+7

### D+1 (16/Mai/2026) — Sanity checks

**Owner:** Breno + @traffic-masters-chief

| # | Métrica | Source | Target |
|---|---------|--------|--------|
| 1 | `messaging_first_reply` Meta 16/Mai | Meta Ads Manager | Próximo de 0 (vs avg 9.4 14d) |
| 2 | `messages_started` Meta 16/Mai | Meta Ads Manager | Sem mudança vs avg 9.2 14d |
| 3 | Sales AI logs kill-switch fires | Railway logs grep `kill switch` | >0 (prova que tá filtrando) |
| 4 | Supabase `messages` count inbound 16/Mai | Supabase SQL | Sem queda — inbound continua |
| 5 | WhatsApp Business app push notification chegando equipe | Manual Breno | OK confirmado |

### D+7 (22/Mai/2026) — Decisão estratégica

**Owner:** Breno + @aios-dev + @qa

| # | Métrica | Source | Decision rule |
|---|---------|--------|---------------|
| 1 | Response time mediano humano (msg_started → first_reply) | Supabase analytics | Se <60min: humano-first viável. Se >2h: leads esfriando, reativar Sales AI noturno |
| 2 | Close rate qualificado 14d (deploy → 22/Mai) vs 14d pre-toggle | Sales feedback spreadsheet | Se ≥mesma qualidade: humano-first VENCE. Se cair: trade-off não vale |
| 3 | LGPD DSR requests não respondidas | Supabase `data_subject_requests` table | Se >0 com >24h sem ação: re-ativar DSR subset (kill switch granular?) |
| 4 | CAC Tocks projetado 30d | Pedro Sobral doctrine | Manter <R$4.400 |

### D+7 decision matrix

```
Se response time <60min + close rate ≥pre → MANTÉM humano-first (decisão validada)
Se response time 60-120min + close OK → SIM mas com Sales AI noturno (Option C, kill switch granular por horário)
Se response time >120min OU close cair → REATIVA Sales AI total (SALES_AI_ENABLED=true)
Se LGPD DSR backlog → SUBSTITUIR kill switch global por kill switch granular (manter compliance flows)
```

### Métricas continuous (todos os dias até D+7)

- Sales AI Railway logs — quantos `kill switch fired` por dia
- Meta Ads `messaging_first_reply` 7d rolling
- Supabase `messages` count inbound vs outbound (delta = humanos respondendo)
- Equipe Tocks feedback subjetivo ("tá dando conta?" / "leads tão chegando frio?")

---

## 8. Files changed

```
M apps/tocks-sales-ai/src/integrations/whatsapp-client.ts  (+22 lines, kill switch in send())
M apps/tocks-sales-ai/.env.example                          (+14 lines, doc SALES_AI_ENABLED)
A apps/tocks-sales-ai/tests/integrations/whatsapp-client.killswitch.test.ts  (new, 6 vitest cases)
A docs/projects/tocks/actions/disable-sales-ai-2026-05-15-aios-dev.md       (this file)
```

**NÃO modificado** (intencional):
- `whatsapp-webhook.ts` — webhook handler intocado (inbound continua + persiste em Supabase)
- `privacy-notice.ts`, `whatsapp-dsr-handler.ts`, `minor-detection.ts` — flows compliance intocados, só o **outbound** é suprimido no chokepoint
- `meta-capi-client.ts` — CAPI Pixel events (Lead/Purchase) **continuam funcionando** (concern separado, nada a ver com WhatsApp auto-reply)
- Sales AI Bretda — **não existe** (confirmado: Bretda não tem Sales AI deployed, só Tocks tem)
- Meta Ads campaigns Tocks — intocadas (mission constraint)
- WhatsApp Business config — intocada

---

## 9. Open questions / handoffs

### Para Breno
1. Confirmar: app Sales AI Tocks está deployed no Railway agora ou nunca foi pro live? (audit marcou UNKNOWN)
2. Escolher: Opção 3a (env var Railway) OU Opção 3b (Meta webhook unsubscribe)?
3. Smoke test agora ou em sessão dedicada?

### Para @devops (Gage)
- Quando Breno aprovar, push da branch `feat/hydra-resilience-sprint` (onde está o commit deste change) para origin
- Verificar Railway secrets-rotation procedure compatível com nova var

### Para @qa (Quinn)
- Rodar suite completa antes do deploy: `cd apps/tocks-sales-ai && npm test`
- Smoke vitest específico: `npx vitest run tests/integrations/whatsapp-client.killswitch.test.ts`
- Validar que `whatsapp-webhook.test.ts` + `whatsapp-webhook-w2.test.ts` continuam GREEN (mudança não os afeta — só `whatsapp-client.ts` mudou)

### Para @patricia-peck (LGPD) — SE janela "Sales AI off" >7d
- Avaliar risco DSR commands sem resposta automática
- Recomendar: granular kill switch (manter compliance flows on, só desabilitar privacy notice) OU manual template send pela equipe

---

## 10. Decisões registradas (memory candidates)

Após validação D+1, candidatos a salvar no memory squad:

- **feedback_sales_ai_kill_switch_pattern** — chokepoint único `WhatsAppClient.send()` permite kill switch global via env. Padrão reutilizável pra Anipis, low-ticket, qualquer app com auto-reply Meta
- **session_disable_sales_ai_tocks_15mai** — contexto desta decisão + outcome D+1/D+7
- **project_tocks_sales_ai** update — status: PAUSED (humano-first), env `SALES_AI_ENABLED=false`, deploy mantido vivo

---

*Doc: @aios-dev (Dex) | Implementação: 2026-05-15 | Status: code READY, awaiting Breno env toggle + smoke test*
