---
name: Meta Ads — sempre validar Pixel attached à ad account ANTES de criar adset OFFSITE_CONVERSIONS
description: Pixel criado no BM precisa ser EXPLICITAMENTE atribuído à ad account com Full Control. Sem isso, adsets OFFSITE_CONVERSIONS ficam sem promoted_object.pixel_id e Meta pausa ads automaticamente. has_pixel:false no MCP é o sinal.
type: feedback
originSessionId: 3af7e78a-4094-46b4-b964-89e8b79c3edf
---
Sempre que criar um Adset com `optimization_goal=OFFSITE_CONVERSIONS` (Purchase, Lead, etc), VALIDAR ANTES da criação que o Pixel está atribuído à Ad Account com Full Control. Se não estiver, parar e instruir user a atribuir no BM antes de qualquer ad creation.

**Why:** No Vorza/Metodo3C (lançamento 24/Abr/2026), Pixel `26458851600417959` foi criado no BM Vorza e snippet instalado na LP, mas NUNCA foi atribuído à Ad Account `act_793656664671388`. Resultado: campanha+adsets criados ACTIVE, 4 ads criados, mas Meta deixou todos os ads PAUSED automaticamente porque `promoted_object.pixel_id` não validava. Spend last_30d=R$0, descoberto só 3 dias depois (27/Abr) quando user perguntou status.

**How to apply:**
- Antes de qualquer `meta_ads_create_adset` com optimization_goal OFFSITE_CONVERSIONS, rodar `meta_ads_pixel_check` na ad account alvo.
- Se `has_pixel: false` ou pixel desejado ausente da lista → BLOQUEAR criação do adset. Instruir user a:
  1. Business Settings → Pixels → selecionar pixel.
  2. Aba Ad Accounts → Adicionar ad account com Full Control.
  3. Confirmar atribuição (revalidar `meta_ads_pixel_check`).
- Só DEPOIS criar adset/ads.
- Se BM novo/separado (Vorza tem BM próprio), o erro é especialmente comum porque user às vezes cria pixel mas esquece de vinculá-lo à única ad account daquele BM.

**Sintomas pra detectar problema EXISTENTE retroativamente:**
- `meta_ads_pixel_check` retorna `has_pixel: false`
- Spend baixo/zero apesar de campanha ACTIVE
- Ads aparecem PAUSED mesmo tendo sido criados ACTIVE
- effective_status `DISAPPROVED` ou similar pode ocorrer também (mas o caso comum é PAUSED automático)

**Pattern de execução correto (Meta Ads MCP via mcp-ads-bridge):**
```
1. meta_ads_search_interests (se aplicar)
2. meta_ads_pixel_check ← BLOQUEIO aqui se has_pixel:false
3. meta_ads_upload_image
4. meta_ads_create_campaign (OFFSITE_CONVERSIONS)
5. meta_ads_create_adset (com pixel_id em promoted_object)
6. meta_ads_create_ad (object_story_spec, criados PAUSED)
7. meta_ads_update_status: campaign → adset → ads (cada nível ACTIVE explícito)
```

A barra de validação no passo 2 evita re-incidência.
