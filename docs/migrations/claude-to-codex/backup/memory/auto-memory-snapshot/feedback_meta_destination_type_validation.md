---
name: meta-destination-type-validation
description: "Para classificar tipo real de Meta ad (Instant Form vs LP form vs WhatsApp CTM), validar `destination_type` via API, NÃO confiar em `link_url` nem em `call_to_action_type`."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 408314f9-a076-48f1-b605-334f97dc0860
---

# Meta `destination_type` Validation Rule

## Regra
**Para identificar tipo real de Meta ad (Instant Form / LP form / WhatsApp CTM / Messenger), validar `destination_type` via API, NÃO `link_url` nem `call_to_action_type`.**

## Why
12/Mai/2026: descoberta nuclear em Bretda — todos os ads ACTIVE (AD03/AD04/AD05/AD10v2) pareciam ter destinos diferentes baseado em `link_url`:
- AD03/AD04/AD05: `link_url: ""` (vazio)
- AD10v2 Aurora: `link_url: "bretda.com.br/colecao/aurora-sinuca"` (parecia LP form)
- AD09/10v1/11/12/13: `link_url: "bretda.com.br/"` (parecia LP form com homepage)

**Realidade:** TODOS eram Instant Form (`destination_type=ON_AD`). O `link_url` era cosmético/decorativo no creative.

Meta API rejeita criar ad com `destination_type=WEBSITE` reutilizando creative_id de Instant Form:
> *"O criativo com formulário de lead só pode ser usado para o objetivo de geração de leads e o destino ON_AD."*
> (error_subcode 1892040)

Memórias 07/Mai (`session_bretda_instant_form_trap_07mai.md`) e 11/Mai (`session_bretda_audit_11mai.md`) tinham diagnóstico errado por causa dessa premissa falsa.

## How to apply

Quando precisar classificar tipo de ad:

### ✅ Fonte de verdade
Query Meta API field: `creative.object_story_spec.link_data.link` + ad's parent **adset** `destination_type` + `promoted_object`.

### ❌ Não confiar em:
- `link_url` mostrado em `meta_ads_creatives` — pode ser cosmético
- `call_to_action_type` (SIGN_UP / GET_QUOTE / LEARN_MORE) — não determina destino
- Memory antigos sem validação via API

### Teste prático
Para confirmar "este ad é LP form de verdade?":
1. Tentar criar `meta_ads_create_ad` em adset com `destination_type=WEBSITE` usando o `creative_id` do ad em questão
2. Se Meta API retorna `error_subcode 1892040` ("formulário de lead só pode ser usado..."), o creative é Instant Form
3. Se cria com sucesso, é LP form de verdade

### Para criar LP form de verdade
- Upload image_hash NOVO via `meta_ads_upload_image`
- Criar creative com `object_story_spec.link_data.link = bretda.com.br/...` + `call_to_action = LEARN_MORE/GET_QUOTE`
- Adset deve ter `destination_type=WEBSITE` (não ON_AD)
- NÃO reutilizar `creative_id` de Instant Form existente

## Triggers
- `valida creative tipo {ad_id}` — verificar tipo real do ad via API test
- `cria lp form real {projeto}` — criar primeiro LP form de verdade (image hash novo + destination WEBSITE)
