---
name: Bretda Audit Full 07 Mai
description: Auditoria full Meta+Google Bretda 07/Mai 2026 - achados quantificados, top priorities, risk flags, ações com IDs
type: project
originSessionId: fb632c7e-7869-41f3-b180-ab8cd686fb56
---
# Bretda Audit Full — 07/Mai/2026 ~12:35 BRT

## Estado Real Validado via MCP

### Google Ads `8167636084` (Bretda, BRL, America/Fortaleza)
- Auto-tagging ON, ECL **enabled** (ativado pós Sales AI deploy 05/Mai)
- 5 ENABLED campanhas (4 novas + legacy `[C]-Sudeste`); 33+ removidas/pausadas
- LAST_30D total spend ALL ativas: **R$791,94 / 2 conv / ROAS 0.13**
- Apenas legacy `[C]-Pesquisa-Leads-Sudeste 23251766617` gerou impressões em 30d (camps novas religadas HOJE)
- Conv tracking ID 16757160810. **4 conv actions ENABLED**:
  - `7138711130` [AGD] Lead default_value=R$100 always_use=true → **ZUMBI codeless** dispara em /obrigado mesmo sem CRM real
  - `7571079256` Lead-Pagina-Obrigado biddable default=0
  - `7540863796` WhatsApp-CLICK include=false
  - `6918863652` Contato include=false

### Meta Ads `act_381618241134624` (Bretda)
- Token Bretda **NÃO tem business_management** → balance/capabilities/spend_cap blocked (memory rule confirmada)
- 1 ACTIVE: **CP2 `120236735188220737`** (Form nativo Arquitetos+Luxo) — restante PAUSED
- LAST_30D CP2: **R$1.637,48 / 148 leads / CPL R$11,07 / freq 1.80 / CTR 2.50%**
- Hoje 07/Mai: R$63,44 / 4 leads. Ontem: R$93,57
- 4 adsets CP2 ATIVOS (CJ1 SP, CJ7v2 Sul/CO/NE, CJ8v2 Arquitetos winner, CJ6 cópia)
- Pixel `3348133485496539` 7d events: **PageView 75 / Engaged60-120 / Lead 9 / meta_a_lead 23 / ZERO Purchase / ZERO Contact / ZERO Schedule / ZERO ViewContent dedicated**
- offsite_conversion.fb_pixel_lead = **1** em 30 dias (de 148 leads totais — pixel/CAPI 0.7% match!)
- Custom audiences ready: LAL Leads Form 90d 1% (167k-196k) e 1-2% (238k-280k); legacy LAL Visitantes Site/Engagement IG = FAILED
- RTG site visitors 15d/30d = 20 pessoas (pixel underfiring)

## Top 3 Priorities

1. **P0 CAPI/Pixel Bretda fix** — 0.7% match (1/148). Caminho A "LIVE" mas events Lead/ViewContent não disparam. Sem isso ROAS é cego.
2. **P0 Cleanup conv `[AGD] Lead 7138711130`** — codeless R$100 zumbi dispara fantasma. Legacy spend R$791,94 com R$100 conv_value = "ROAS 0.13" inflado. Pausar/excluir.
3. **P0 Decisão legacy `[C]-Sudeste 23251766617`** — search terms são GOLD ("mesa sinuca que vira jantar" R$80, "mesa bilhar e jantar" etc.) mas 0 conv reais em 30d/R$791. Conta tem 18 estados (Brasil inteiro, não só Sudeste). Manter PAUSED, mas migrar SKAGs ouro pras camps novas.

## Quick Wins 24h
| # | Ação | IDs |
|---|------|-----|
| QW1 | Pausar conv action `[AGD] Lead 7138711130` (zombie codeless) | conversion_action 7138711130 |
| QW2 | Promover `Lead-Pagina-Obrigado 7571079256` para PRIMARY com value real (R$1500 = nCAC alvo) | 7571079256 |
| QW3 | Migrar 4 search terms ouro pra `BR-Generic-MesaBilhar-HighIntent`: "mesa sinuca que vira jantar", "mesa de sinuca e jantar", "mesa bilhar e jantar", "mesa que vira sinuca" como PHRASE | camp 23816403561 |
| QW4 | RSAs RTG-90d com final_url genérica `bretda.com.br/` → trocar pra `/colecao` (consistência com outras camps) | ad 807939273302, 807939273305 |
| QW5 | Ativar **CP RTG-WARM LAL Engajamento IG** Meta (PAUSED desde 17/Abr) com R$30/d, audience `120244500855530737` (LAL 1-2% Leads Form) | camp 120244496926800737 |
| QW6 | Limpar 2 LAL FAILED Meta + audience `[AGD] [RMKT15]` 20 pessoas | 120244118776810737, 120244118776670737, 120228428264340737 |

## Medium-term 7d
| # | Ação |
|---|------|
| M1 | CAPI Caminho B deploy (memory diz "code ready 30/Abr") — server-side Lead+Contact+Schedule events |
| M2 | Aguardar 7d de dados nas 4 camps Google novas; gate D+3 (10/Mai) e D+7 (14/Mai) |
| M3 | RSA refresh — 14 ads com ad_strength=POOR. Adicionar variantes com termos "mesa sinuca jantar híbrida" + remover headlines sem volume ("Linhas Aurora Citrino Opal" 0 search volume) |
| M4 | Trocar BR-Brand-Defense KW de match_type 2 (PHRASE) para 4 (EXACT) para "bretda", "bretda mesa" — defesa precisa de match exato |
| M5 | Criar adset CP2 Meta SP-only retargeting LAL 1% Leads Form 90d → R$50/d teste 7d |
| M6 | Ativar `Bretda-Generic-MesaJantar` ad_group MesaJantar-Madeira-Macica está com só **2 KWs** ("mesa jantar madeira maciça" e "mesa jantar artesanal") — adicionar 5 KWs PHRASE: "mesa jantar nogueira", "mesa jantar grande madeira", "mesa jantar 12 lugares madeira maciça" etc. |

## Long-term 30d
| # | Estratégia |
|---|------------|
| L1 | Migrar Manual CPC → tCPA (target R$80) só após 30+ conv reais na conta (não fake [AGD] R$100) |
| L2 | RTG-90d audience needs >1k visitors (gate runbook). Pixel atual 20 pessoas — bloqueador. Consertar pixel = libera RTG |
| L3 | PMAX condicional D+90+ (memory rule confirmada — Kim/Patel/Laja consensus) com 30+ conv reais |
| L4 | NUNCA Shopping/Merchant (memory feedback rule) |
| L5 | LP `bretda.com.br/colecao` precisa fluxo Aurora/Citrino/Opal/Âmbar → "Solicitar orçamento" form integrado Sales AI (deployed 05/Mai) |

## Risk Flags 🔴

| # | Risco | Impacto |
|---|-------|---------|
| 🔴 R1 | **Pixel/CAPI 0.7% match** — bid optimization Meta com signal pobre. Quanto mais escalar CP2, mais waste sem CAPI consertado. ROAS Meta cego. |
| 🔴 R2 | **[AGD] Lead 7138711130 codeless ZUMBI** — dispara fantasma R$100 em /obrigado mesmo se Sales AI não capturou. ECL agora ON pode duplicar conversion signal contaminado. Manual CPC neutraliza value-side mas se trocar pra tCPA → bid sobe artificialmente. |
| 🔴 R3 | **Saldo Google Bretda** — 03/Mai memory diz R$327 (2.7d runway). Não foi possível confirmar via API (token sem permissão billing). 4 camps a R$60/d total + RTG R$10 = R$60/d mínimo. **Validar saldo manual antes 09/Mai** |
| 🟡 R4 | **`MesaJantar-Madeira-Macica` ad_group com só 2 KWs** — fragiliza camp BR-Generic-MesaJantar-HighIntent. Adicionar 5 KWs ASAP ou pausar ad_group |
| 🟡 R5 | **RTG-90d KW = "mesa" BROAD isolada** — sem audience attached, broad puro = waste. Gate runbook diz só ativa quando audience>1k. Mantém PAUSED ad_group? Não, está ENABLED hoje. Verificar audience configurada |
| 🟡 R6 | **Token Meta sem business_management** — não consigo monitorar balance/spend_cap via API. Memory feedback ativo `feedback_meta_su_app_role_fix.md` ainda não resolvido |

## Specific Actions com IDs (prontas pra MCP)

```bash
# QW1 - Pausar conv zombie [AGD] Lead
mcp google_ads_pause_conversion --customer 8167636084 --conversion_action 7138711130

# QW2 - Promover Lead-Pagina-Obrigado a primary value real R$1500 (nCAC alvo high-ticket)
mcp google_ads_update_conversion --customer 8167636084 --id 7571079256 --primary_for_goal true --default_value 1500 --always_use_default_value true --include_in_conversions_metric true

# QW3 - Adicionar 4 search terms ouro como KWs em BR-Generic-MesaBilhar
mcp google_ads_add_keyword --customer 8167636084 --ad_group 198723867080 \
  --keyword "mesa sinuca que vira mesa de jantar" --match PHRASE \
  --keyword "mesa de sinuca e jantar" --match PHRASE \
  --keyword "mesa bilhar e jantar" --match PHRASE \
  --keyword "mesa que vira sinuca" --match PHRASE

# QW4 - Update RSA URLs RTG-90d (homepage → /colecao)
mcp google_ads_update_ad_urls --customer 8167636084 --ad 807939273302 --final_urls "https://bretda.com.br/colecao"
mcp google_ads_update_ad_urls --customer 8167636084 --ad 807939273305 --final_urls "https://bretda.com.br/colecao"

# QW5 - Ativar CP RTG-WARM LAL Meta
mcp meta_ads_update_campaign_status --account act_381618241134624 --campaign 120244496926800737 --status ACTIVE --daily_budget 3000

# QW6 - Limpar audiences fail Meta
mcp meta_ads_delete_custom_audience --account act_381618241134624 --audience 120244118776810737
mcp meta_ads_delete_custom_audience --account act_381618241134624 --audience 120244118776670737
```

## Conclave Mind Clones

Conclave 73b48741-6747-4835-8487-892ca202000d disparado (3 experts: Campaign Manager BLITZ, Demis Hassabis dossiê, Lead Qualifier SDR). Sintese pendente — aguardar antes de executar P0 fixes maior impacto.

## Triggers
- `executa qw bretda` → QW1-QW6 sequencial
- `valida saldo google bretda` → user manual UI ads.google.com
- `deploy capi caminho b bretda` → @aios-dev story CAPI 1.2
- `gate d3 bretda google` 10/Mai
- `gate d7 bretda google` 14/Mai

## Bloqueadores user
1. **Validar saldo Google Bretda hoje** (token sem permissão billing — UI manual)
2. **CAPI Caminho B deploy** (code ready 30/Abr, não merged)
3. **Token Meta business_management** (App Role fix pendente)
