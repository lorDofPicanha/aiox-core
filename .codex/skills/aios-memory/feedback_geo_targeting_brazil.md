---
name: Always set geo-targeting to Brazil
description: EVERY campaign must have geo-targeting Brasil (2076) + PRESENCE. Never PRESENCE_OR_INTEREST. Never regions instead of country. Audit ALL campaigns periodically.
type: feedback
---

TODA campanha criada ou reativada no Google Ads ou Meta Ads DEVE ter geo-targeting Brasil (2076) com PRESENCE.

**Why:** Problema recorrente na conta Tocks (3x). Em 30/Mar/2026 auditoria revelou que 14 de 16 campanhas estavam com geo errado: regioes fragmentadas (IDs 20091-20106) em vez do pais (2076), modo PRESENCE_OR_INTEREST em vez de PRESENCE, e 2 campanhas SEM GEO NENHUM (mostrando pro mundo inteiro). Resultado: leads de fora do Brasil consumindo budget.

**How to apply:**
1. Ao CRIAR qualquer campanha Google Ads, SEMPRE usar `google_ads_set_geo_targeting` com `geo_target_constant_id: "2076"` (Brasil pais inteiro)
2. SEMPRE usar `positive_geo_type: "PRESENCE"` — NUNCA "PRESENCE_OR_INTEREST"
3. NUNCA usar IDs de regioes/estados (20091-20106) em vez do pais (2076), a menos que o usuario peca explicitamente
4. Para Meta Ads, SEMPRE incluir `{"geo_locations": {"countries": ["BR"]}}`
5. Apos criar campanha, VERIFICAR geo-targeting antes de ativar
6. Ao REATIVAR campanha pausada, VERIFICAR geo-targeting primeiro
7. Periodicamente auditar TODAS as campanhas (ativas E pausadas) para garantir conformidade
8. NUNCA ativar campanha sem confirmar: geo = Brasil (2076) + PRESENCE
9. Se detectar campanha com PRESENCE_OR_INTEREST ou sem geo, CORRIGIR IMEDIATAMENTE e alertar o usuario
