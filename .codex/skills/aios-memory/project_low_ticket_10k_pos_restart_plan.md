---
name: Low Ticket 10k - Plano Pos-Restart CC
description: Sequencia exata de 7 passos para executar apos reiniciar Claude Code. 3 novas MCP tools + 4 adsets PAUSED + verdict Conclave.
type: project
originSessionId: 5fe61ba0-799e-428f-9d9d-768142eb990c
---
# Plano Pos-Restart Claude Code — Low Ticket 10k

**Contexto de retomada:** Usuario reiniciou CC em 16/Abr/2026 noite para liberar 3 MCP tools novas do `mcp-ads-bridge` (upload_image, search_interests, delete_object) que foram criadas nesta sessao mas so ficam visiveis apos restart.

## Antes de comecar - confirmar:

1. Rodar `ToolSearch select:mcp__mcp-ads-bridge__meta_ads_upload_image,mcp__mcp-ads-bridge__meta_ads_search_interests,mcp__mcp-ads-bridge__meta_ads_delete_object` — DEVEM retornar as 3 schemas. Se nao aparecer, voltar pra D:/jarvis/mcp-ads-bridge e verificar build/restart.

2. Rodar `meta_ads_list_accounts` → confirmar Vorza `act_793656664671388` presente.

## Sequencia dos 7 passos (executar na ordem):

### 1. Achar IDs reais de interesses para C1
```
meta_ads_search_interests account=vorza query="Advocacia"
meta_ads_search_interests account=vorza query="Ordem dos Advogados"
meta_ads_search_interests account=vorza query="JusBrasil"
meta_ads_search_interests account=vorza query="Law firm"  (fallback EN)
```
Pegar top 2-3 IDs relevantes, guardar.

### 2. Aplicar interesses em C1 + resguardar behaviors ja existentes
```
meta_ads_update_targeting adset_id=120242729974200621 targeting={
  "flexible_spec": [
    {"interests": [{"id": "<ID OAB>"}, {"id": "<ID Advocacia>"}]},
    {"interests": [{"id": "<ID JusBrasil>"}, {"id": "<ID Law firm>"}]}
  ]
}
```
(merge preserva behaviors/geo/age existentes)

### 3. Achar IDs de interesses para C2 (depois — NAO ativar C2 hoje)
```
meta_ads_search_interests account=vorza query="Direito"  (477M audience, id esperado 6003703762913)
meta_ads_search_interests account=vorza query="STF"
meta_ads_search_interests account=vorza query="Supremo Tribunal Federal"
meta_ads_search_interests account=vorza query="Conjur"
meta_ads_search_interests account=vorza query="Migalhas"
```
Aplicar em C2 via update_targeting. Deixar PAUSED — so ativar apos 50 Purchase events.

### 4. Desligar advantage_audience=1 em C3 (recomendacao Conclave)
```
meta_ads_update_targeting adset_id=120242729976720621 targeting={
  "targeting_automation": {"advantage_audience": 0}
}
```
Atencao: age_max em C3 esta 65 por causa de advantage=1 ativo. Apos desligar, idealmente reduzir age_max para 55 tambem. Mas confirmar na API se permitir.

### 5. Upload de 4 imagens PNG (ads para C1 e C3)
```
meta_ads_upload_image account=vorza image_path="D:/AIOS/docs/projects/low-ticket-10k/criativos-finais/ad01-dor-tempo-FINAL.png"   → hash_A
meta_ads_upload_image account=vorza image_path="D:/AIOS/docs/projects/low-ticket-10k/criativos-finais/ad04-autoridade-oab-FINAL.png" → hash_B
meta_ads_upload_image account=vorza image_path="D:/AIOS/docs/projects/low-ticket-10k/criativos-finais/ad02-fomo-concorrencia-FINAL.png" → hash_C
meta_ads_upload_image account=vorza image_path="D:/AIOS/docs/projects/low-ticket-10k/criativos-finais/ad09-objecao-FINAL.png"        → hash_D
```

### 6. Criar 4 ads (2 em C1, 2 em C3)

Copies vem de `D:/AIOS/docs/projects/low-ticket-10k/META-ADS-CAMPAIGN-PLAN.md`:

**Ad C1-A "Teste do Cronometro" (criativo 1, image_hash = hash_A):**
- primary_text: "Faca um teste agora. Abra o cronometro do celular..."  (copy completo no plano)
- headline: "147 prompts de IA para advogados"
- description: "De 3h para 15min. Garantia 7d."
- CTA: LEARN_MORE
- link: https://vorza-metodo3c.netlify.app

**Ad C1-B "Advogado do Futuro" (criativo 5, image_hash = hash_B):**
- primary_text: "Dados que todo advogado deveria conhecer..."
- headline: "OAB ja aprovou. Voce vai esperar?"
- description: "Provimento 213/2025. R$37 7d."
- CTA: LEARN_MORE

**Ad C3-A "Matematica Cruel" (criativo 2, image_hash = hash_C):**
- primary_text: "Vamos fazer uma conta simples..."
- headline: "De 3 horas para 20 minutos. R$37."
- description: "6x mais produtividade."
- CTA: LEARN_MORE

**Ad C3-B "Pergunta Provocativa" (criativo 9, image_hash = hash_D):**
- primary_text: "Provocativa: quanto voce cobra por peticao?..."
- headline: "R$750 a hora escrevendo peticao."
- description: "R$37 pra recuperar seu tempo."
- CTA: LEARN_MORE

Todos com `name: "{adset_code}-{angle}-v1"` para rastreabilidade.

### 7. ATIVAR campanha + C1 + C3 apenas
```
meta_ads_update_status campaign_id=120242728863470621 status=ACTIVE
meta_ads_update_status adset_id=120242729974200621 status=ACTIVE  (C1)
meta_ads_update_status adset_id=120242729976720621 status=ACTIVE  (C3)
```
**NAO ativar C2, C4, LINK_CLICKS, ou campanha duplicata.**

## Validacao pos-ativacao

- `meta_ads_campaigns account=vorza` → C1+C3 devem estar ACTIVE
- `meta_ads_overview account=vorza` → impressions/spend comecando
- Checar em 24h: CPM, CTR, CPC inicial. Em 48h: primeiro Purchase?
- Kill rule automatizada: R$100 gasto sem Purchase = pause ad. CPA > R$24 = pause.
- NAO mexer por 72-120h (Meta learning phase)

## Apos 50 Purchase events

1. Ativar C2 (INT Direito + STF/STJ) — manter age 25-55, sem advantage
2. Ativar C4 (Stories+Reels) — CONSIDERAR ligar advantage_audience=1 com seed pronto
3. Avaliar scaling vertical em C1 ou C3 se CPA < R$24
4. Criar ad adicional (3º) nos adsets vencedores

## Cleanup opcional (nao urgente)

Deletar objetos irrelevantes via `meta_ads_delete_object`:
- campaign `120242669792790621` (duplicata)
- adset `120242734195760621` (C1 LINK_CLICKS errado)
- adset `120242734201630621` (C3 LINK_CLICKS errado)

## Decisoes pendentes que NAO foram executadas

1. **LP v5 falta 8 imagens AI novas** — design-chief sub-agent nao teve acesso ao nano-banana-2. Opcoes pos-restart: (a) Orion gera diretamente com MCP nano-banana-2 exposto, (b) seguir sem essas imagens.
2. **LGPD cookie banner ausente** — Meta Pixel dispara PageView sem consent. Blind spot regulatorio. Consultar patricia-peck ou bruce-schneier pos-restart.
3. **Rotacionar Netlify PAT** `nfp_Ueo839mMgWje53AquDGqn6k9oScVXTQE461f` — foi compartilhado em chat anterior, gerar novo em https://app.netlify.com/user/applications#personal-access-tokens.

**Why:** Clones Larry Kim + Brunson + Hormozi validaram plano conservador. Launch com 2 adsets pra pegar Pixel seed antes de scaling.
**How to apply:** Seguir os 7 passos em ordem. Nao pular validacao das tools expostas no passo 0.
