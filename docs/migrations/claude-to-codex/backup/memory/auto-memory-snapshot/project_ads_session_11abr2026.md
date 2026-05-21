---
name: Ads Session 11/Abr/2026
description: Sessao completa — geo 112 cidades S+A aplicado Google Ads Tocks, Meta RTG relaxation desligada, verificacao completa
type: project
originSessionId: 270a59e0-545b-4b38-a09e-648e675343f2
---
## Sessao Ads — 11/Abril/2026

### Problema original (sessao 1)
Campanhas Meta Ads da Tocks estavam gerando **leads estrangeiros**.

### Correcoes sessao 1
- RTG geo BR aplicado, ad sets EUA pausados, 2 MCP tools criadas
- Bretda: 45 negatives, bug fix bidding, analise search terms

### Acoes sessao 2 (continuacao 11/Abr)

**1. Google Ads — Geo-targeting 112 cidades S+A**
- CSV pesquisa R14k: `C:\Users\kingp\Downloads\google_ads_cidades_R14k.csv` (200 cidades)
- Filtrado Tier S (22) + Tier A (90) = 112 cidades unicas
- Script `lookup-city-ids.js` criado para mapear nomes → geo_target_constant_id via API suggest
- 3 correcoes manuais: Sao Paulo (→1001773), Curitiba (→1001634), Sao Jose dos Pinhais (→1032065)
- Mapeamento salvo: `D:/jarvis/mcp-ads-bridge/data/tocks-sa-cities-geo.json`
- Consultado BLITZ Campaign Manager: VEREDICTO = aplicar agora nas duas
- **Aplicado** `set_geo_targeting` com PRESENCE em:
  - TOCKS_Search_Alta-Intencao (23703520246): Brasil inteiro → 112 cidades S+A
  - TOCKS_Shopping_Mesas_Artesanais (23743031426): Brasil inteiro → 112 cidades S+A

**2. Meta Ads — Verificacao completa**
- C006 RTG: geo BR OK (corrigido sessao 1)
- C005 CSD ad set 01 CORRIGIDO: 9 estados BR + interesses luxury ✅
- C005 CSD ad set 02 CORRIGIDO v2: 9 capitais NE + interesses luxury ✅
- Ad sets originais com geo EUA: PAUSADOS corretamente ✅

**3. Meta Ads — RTG relaxation desligada**
- Ad set RTG (120245795842360230): `custom_audience` relaxation 1 → 0
- Agora RTG so mostra para quem esta nas custom audiences, sem expansao

### Ferramentas MCP criadas (sessao 1)
1. **`meta_ads_set_geo_targeting`** — Define geo por pais/regiao/cidade
2. **`meta_ads_update_targeting`** — Atualiza qualquer campo do targeting

### Arquivos criados (sessao 2)
- `D:/jarvis/mcp-ads-bridge/scripts/lookup-city-ids.js` — script lookup geo IDs via API
- `D:/jarvis/mcp-ads-bridge/data/tocks-sa-cities-geo.json` — 112 cidades com IDs

### Monitoramento pendente
- **7 dias (18/Abr):** Verificar CTR e CPC no Google Ads apos mudanca geo
- **14 dias (25/Abr):** Avaliar custo/lead qualificado, decidir se expande para Tier B
- **RTG Meta:** Monitorar se volume de entrega cai demais com relaxation=0

### Bretda pendente (da sessao 1)
- Restart MCP bridge e executar mudanca de bidding para MANUAL_CPC
- Configurar Conversion Tracking com valor no GTM
- Melhorar QS (=1) do keyword principal

**Why:** Concentrar budget Google Ads em cidades com poder aquisitivo para moveis luxury R$14k+. RTG Meta blindado contra expansao indesejada.
**How to apply:** Usar o JSON de cidades S+A como referencia para futuras campanhas. Monitorar metricas nos prazos acima.
