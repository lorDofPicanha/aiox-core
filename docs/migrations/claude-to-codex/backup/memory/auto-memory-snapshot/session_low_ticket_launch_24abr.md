---
name: Sessão Low Ticket 10k - LANÇAMENTO 24/Abr
description: Log completo da sessão Orion executando os 7 passos pós-restart. Diagnóstico → restore PNGs → targeting → uploads → bloqueador pagamento → ads → ativação. Aprendizados Meta API.
type: project
originSessionId: 675d4b8a-59cc-4739-8079-16f268c3d827
---
# 🚀 SESSÃO LANÇAMENTO LOW TICKET 10k — 24/Abr/2026

**Duração:** ~30min · **Resultado:** Campanha ATIVA R$74/dia · 4 ads no ar.

## Cronologia

### Bloco 1 — Status inicial (user pergunta "como está o projeto low ticket")

Orion consultou memória + verificou estado real:
- LP `vorza-metodo3c.netlify.app` confirmada online (WebFetch): headline "Petições em 18 Minutos", preço R$37 lançamento → R$67 normal, CTA Kiwify.
- Pasta local `docs/projects/low-ticket-10k/` quase vazia (só `.netlify` + `node_modules`). Arquivos do projeto perdidos do working tree.
- Arquivos achados em commit snapshot `541921eb` (chore wip 17/Abr).
- Campanhas Meta verificadas via MCP: 4 adsets PAUSED, zero ads criados.

### Bloco 2 — Definição de budget

User pediu inicialmente R$50/dia. Orion alertou que isso desviava do verdict do Conclave (R$74).
**User corrigiu:** "deixe o budget conforme os clones falaram" → mantido R$74 = R$37×2 (C1+C3).

**Feedback memorizado:** quando user dá direção que conflita com expert recommendation já documentada, alertar primeiro com prós/cons antes de executar.

### Bloco 3 — Execução paralela (passos 1-5)

Em paralelo:
1. `git checkout 541921eb -- 'docs/projects/low-ticket-10k/criativos-finais/'` → 20 PNGs restaurados.
2. 5 buscas `meta_ads_search_interests`: Advocacia (0 results), OAB (Branches of law), JusBrasil (Law firm), Law firm, Lawyer (6 results incluindo Advogado/a 136M e Bar association 3.8M).
3. **C1 targeting** aplicado com `flexible_spec` 2 clusters AND:
   - Cluster 1: Advogado/a `6003392101554` OU Bar association `6003029225585`
   - Cluster 2: Law firm `6003057724244` OU Branches of law `6797095139936`
4. **C3 targeting**: `advantage_audience` 1→0 + `age_max` 65→55.
5. 4 PNGs uploaded → image_hashes válidos 90d:
   - `c6ae0645cb4c6d929123c6809b70b395` ad01-dor-tempo
   - `2e29073d7010ea32a1f505b4901815e0` ad04-autoridade-oab
   - `50a0c65ea92c393e75c69aa8e19b09fa` ad02-fomo-concorrencia
   - `55d9fc41f86474c85e22c0c7c12d4ff0` ad09-objecao

Restaurado também `META-ADS-CAMPAIGN-PLAN.md` para usar copies completas.

### Bloco 4 — Bloqueadores Meta API descobertos (3 erros consecutivos)

**Erro 1 (subcode 1373054):** "Tipo de apelo à ação não analisável."
- Causa: passei `creative` como objeto plano `{image_hash, message, link, name, description, call_to_action: "LEARN_MORE"}` (formato sugerido pela schema description do tool).
- Realidade: o wrapper `meta_ads_create_ad` **forwarda raw** ao endpoint `/{account}/ads` — Meta API exige `object_story_spec` com page_id.

**Solução parcial:** descobrir Page ID via curl direto à Graph API:
```bash
curl "https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=$TOK"
# → page_id "1064235853441529" (Metodo 3c)
```
Reconstruí com formato correto:
```json
{"object_story_spec": {"page_id": "1064235853441529", "link_data": {"image_hash": "...", "message": "...", "link": "...", "name": "headline", "description": "...", "call_to_action": {"type": "LEARN_MORE", "value": {"link": "URL"}}}}}
```

**Erro 2 (subcode 3858504):** "Os conteúdos criativos não devem incluir melhorias padrão."
- Causa: incluí `degrees_of_freedom_spec.creative_features_spec.standard_enhancements.enroll_status: "OPT_OUT"` (deprecated).
- Solução: remover o campo `degrees_of_freedom_spec` inteiro.

**Erro 3 (subcode 1359188):** "Nenhum método de pagamento."
- Causa: BM Vorza não tem cartão/pix configurado.
- **Solução: ação manual do user.** API não resolve. Bloqueador parou execução.

Orion salvou estado em `reminder_low_ticket_payment_blocker_24abr.md` e indexou em MEMORY.md, listando exatamente o que ficou pronto + retomada.

### Bloco 5 — User adiciona pagamento ("FEITO")

Retomada automática:
- **Passo 6:** 4 ads criados em paralelo, todos PAUSED:
  - C1-A `120244099410470621` Cronômetro
  - C1-B `120244099412870621` Autoridade OAB
  - C3-A `120244099414140621` Matemática Cruel
  - C3-B `120244099414750621` Pergunta Provocativa

### Bloco 6 — Portão de confirmação ("ative")

Orion mostrou preview detalhado (R$74/dia × 7d = R$518 exposto, kill rules) e pediu confirmação explícita. User: "ative".

**Passo 7 (em 2 sub-passos):**
- **7a:** ativados em paralelo: campanha + C1 + C3 (3 update_status).
- **7b:** descoberto que ads continuam PAUSED (wrapper hardcoda `status: "PAUSED"` em createAd no `meta-ads.ts:504`). Ativados os 4 ads em paralelo.

**Total:** 7 objetos passados de PAUSED→ACTIVE.

## Aprendizados técnicos (para sessões futuras)

### MCP `meta_ads_create_ad` quirks
1. Schema description do tool é **enganosa** — o formato `{image_hash, message, link, name, description, call_to_action}` simplificado **NÃO funciona**. Wrapper forwarda raw ao Meta `/act_X/ads`.
2. **Formato real necessário:** `{object_story_spec: {page_id: "X", link_data: {...}}}`
3. `call_to_action` deve ser objeto: `{type: "LEARN_MORE", value: {link: "URL"}}` — não string.
4. `degrees_of_freedom_spec.standard_enhancements` está **deprecated** (subcode 3858504).
5. Wrapper hardcoda ads como **PAUSED** mesmo após criação. Precisa `update_status ACTIVE` separado em cada ad após ativar campaign+adset.

### Fluxo correto de lançamento Meta via MCP
```
1. meta_ads_search_interests → IDs reais
2. meta_ads_update_targeting (adset)
3. meta_ads_upload_image → image_hash
4. (descobrir page_id via Graph API se ainda não souber)
5. meta_ads_create_ad com object_story_spec completo (criados PAUSED)
6. meta_ads_update_status ACTIVE: campaign → adsets → ads (em ordem)
```

### Account/page Vorza (low-ticket)
- BM separado, App ID `2007697866847741`
- Account ID: `act_793656664671388`
- Page ID FB: `1064235853441529` (Metodo 3c)
- Pixel: `26458851600417959`
- Token: env `META_ADS_ACCOUNT_VORZA_TOKEN` em `D:/jarvis/mcp-ads-bridge/.env`

### Working tree drift
Pasta `docs/projects/low-ticket-10k/` foi parcialmente limpa entre 17/Abr e 24/Abr. Apenas snapshot `541921eb` preserva os arquivos. Restaurar via `git checkout 541921eb -- <path>` quando precisar.

## Memórias criadas/atualizadas nesta sessão

- ✅ `reminder_low_ticket_payment_blocker_24abr.md` (depois substituído)
- ✅ `reminder_low_ticket_live_24abr.md` (estado final LIVE)
- ✅ `session_low_ticket_launch_24abr.md` (este arquivo)
- ✅ `MEMORY.md` index atualizado (linha 4)

## Próximos passos pós-sessão (não-bloqueadores)

1. Aguardar 72h sem mexer (Meta learning phase).
2. **27/Abr 16h** — primeira janela revisão CPM/CTR/CPC.
3. **29/Abr** — aplicar kill rules se necessário.
4. **Após 50 Purchases** — ativar C2 + C4.
5. **Pendências secundárias** (não-bloqueadoras):
   - LGPD cookie banner na LP (consultar `@patricia-peck`)
   - Rotacionar Netlify PAT antigo
   - Gerar 8 imagens AI faltantes da LP v5 (`@nano-banana-2` agora disponível)
