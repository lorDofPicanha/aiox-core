---
name: Ads Audit Abril 2026
description: Auditoria completa Google+Meta Ads Tocks/Bretda — correções de geo, PRESENCE, expansão, pesquisa de cidades
type: project
originSessionId: 5948ca0e-bdcf-4d46-9d1d-07143d0be83a
---
## Auditoria Ads — 10/Abril/2026

### Contexto
Usuário adicionou crédito há 2h nas 4 contas (Google Tocks, Google Bretda, Meta Tocks, Meta Bretda) e não via consumo. Investigação revelou que Google estava gastando normalmente mas Meta quase parado.

### Consumo no dia (10/04)
- Google Tocks: R$44,60 (funcionando)
- Google Bretda: R$42,95 (funcionando)
- Meta Tocks: R$0,06 (quase parado)
- Meta Bretda: R$0,58 (quase parado)

### Problemas encontrados e correções

**1. Tocks Shopping PRESENCE_OR_INTEREST → PRESENCE** ✅ CORRIGIDO
- Campanha: TOCKS_Shopping_Mesas_Artesanais (23743031426)
- Estava com PRESENCE_OR_INTEREST, corrigido para PRESENCE via API

**2. Bretda Google — expandido de só Sudeste para nacional** ✅ CORRIGIDO
- Campanha: [C] Pesquisa Leads Sudeste (23251766617)
- Tinha: 4 regiões Sudeste (SP, RJ, MG, ES)
- Adicionado: SC, PR, RS, DF, GO, MT, CE, BA, PE (10 regiões novas)
- Agora cobre todas as cidades Tier S da pesquisa

**3. Meta Bretda — adset retargeting reativado** ✅ CORRIGIDO
- C006 Retargeting (120243275861300737) — adset AS01 estava PAUSED, reativado para ACTIVE

**4. Meta Tocks — adsets originais com erro pausados** ✅ CORRIGIDO
- Adset "01 Cidades Selecionadas" original tinha geo EUA (Atlanta, Florida) — PAUSED
- Adset "02 Nordeste Capitais" original tinha interesses errados (Cerveja, Tênis) — PAUSED
- Apenas versões CORRIGIDO estão rodando

**5. Bretda Meta CP2 — 2 adsets de expansão criados** ⚠️ PARCIAL
- CJ7 Expansão Sul/CO/NE Luxury (120244127121150737) — ACTIVE, falta promoted_object + ads
- CJ8 Expansão Sul/CO/NE Arquitetos (120244127122790737) — ACTIVE, falta promoted_object + ads
- Precisam de ajuste manual no painel: vincular página/pixel e duplicar anúncios dos CJ6/CJ1

**6. Bretda C005 WhatsApp e Tocks C005 NE expandido** ❌ NÃO CRIADOS
- API do Meta não permite budget no adset quando campanha já tem budget
- Precisa criar manualmente no painel

### Pesquisa de cidades carregada
- Arquivo R$14k (Tocks): 200 cidades, 22 Tier S, ~80 Tier A
- Arquivo R$33k (Bretda): 200 cidades, 23 Tier S, ~60 Tier A
- Top Tier S ambas: SP, Brasília, RJ, Balneário Camboriú, Florianópolis, Curitiba, BH, Goiânia, Campinas, Porto Alegre
- Bretda adicional Tier S: Sorriso-MT, Nova Lima-MG, Gramado-RS, Búzios-RJ, Itapema-SC

### Campanhas ativas por conta

**Google Tocks (8146675397):** 2 de 17 ativas
- TOCKS_Search_Alta-Intencao (R$35/dia) — ENABLED
- TOCKS_Shopping_Mesas_Artesanais (R$20/dia) — ENABLED (criada 10/04)

**Google Bretda (8167636084):** 1 de 11 ativa
- [C] Pesquisa Leads Sudeste (R$70/dia) — ENABLED (geo expandido)

**Meta Tocks (act_1221671265457624):** 2 campanhas ativas
- C005 CSD WhatsApp (R$35/dia) — 2 adsets CORRIGIDO ativos
- C006 RTG WhatsApp (R$15/dia) — 1 adset RTG ativo

**Meta Bretda (act_381618241134624):** 3 campanhas ativas
- CP2 Leads Arquitetos — 4 adsets (CJ1, CJ6 ativos + CJ7, CJ8 novos)
- C005 WhatsApp Arquitetos — campanha ativa mas 0 adsets (vazia!)
- C006 Retargeting — 1 adset reativado

### ROAS = 0.00 em ambas Google Ads
Tracking de valor de conversão NÃO configurado. 149 conversões Tocks e 4 conversões Bretda sem valor monetário atribuído.

### Pendências
1. Vincular promoted_object nos adsets CJ7/CJ8 da Bretda (painel Meta)
2. Criar adset dentro da campanha C005 WhatsApp Bretda (painel Meta)
3. Criar adset NE expandido para Tocks C005 (painel Meta)
4. Configurar tracking de conversão offline (URGENTE — 6 semanas sem dados de retorno)
5. Avaliar se campanhas pausadas devem ser reativadas ou deletadas

**Why:** Crédito sendo consumido no Google mas Meta quase parado por adsets pausados e campanhas vazias. Expansão geo necessária baseada em pesquisa de cidades Tier S.

**How to apply:** Usar esta memória como referência para próximas auditorias de ads. Verificar se pendências foram resolvidas.
