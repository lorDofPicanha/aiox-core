---
name: bretda-restore-pr-28-12-mai
description: "Restore Híbrido C — Sudeste foco SP/RJ. DESCOBERTA NUCLEAR: TODOS os ads Bretda (AD03/04/05/10v2) sempre foram Instant Form. Smoking gun real = budget jump R$27→R$120 + 5 creatives novos, NÃO LP→Instant Form como diagnosticado 07/Mai."
metadata: 
  node_type: memory
  type: project
  originSessionId: 408314f9-a076-48f1-b605-334f97dc0860
---

# Bretda Restore Pré-28/Abr — 12/Mai/2026

## Smoking gun real (descoberto via Meta API hoje)

**TODOS os ads ativos Bretda eram/são Instant Form** (`destination_type=ON_AD`). Erro de diagnóstico das memórias 07/Mai (`session_bretda_instant_form_trap_07mai.md`) e 11/Mai (`session_bretda_audit_11mai.md`).

**Evidência:**
- AD03 / AD04 / AD05: `link_url: ""` vazio = Instant Form
- AD10v2 AURORA: `link_url: "bretda.com.br/colecao/aurora-sinuca"` MAS Meta API rejeitou criar ad com destination_type WEBSITE: *"O criativo com formulário de lead só pode ser usado para o objetivo de geração de leads e o destino ON_AD"* — link_url era cosmético, destino real ON_AD.
- AD09/10v1/11/12/13: `link_url: "bretda.com.br/"` cosmético, todos Instant Form.

**Implicação:** Bretda Meta NUNCA rodou LP form de verdade neste período. CPL R$5,21 pré-28/Abr era 3 Instant Forms homogêneos (AD03/04/05) em CJ8v2 R$27/d Sul+CO+NE.

## Hipótese revisada do colapso pós-28/Abr

Eliminado "LP→Instant Form", o que mudou em 28/Abr foi:
1. **Budget +344%** em uma noite (R$27/d → R$120/d 28/Abr 22h)
2. **5 ads novos** das coleções (Opal/Aurora/Âmbar/Citrino/Zurita) diluindo learning AD05
3. **Mix de CTAs** (GET_QUOTE + LEARN_MORE + SIGN_UP) no mesmo adset
4. **Algoritmo expandiu lookalike** com mais saldo, pegando público mais frio

## Restore executado (8 ops MCP)

### Meta `act_381618241134624`
1. ✅ AD10v2 (`120245578942970737`) → PAUSED
2. ✅ AD04 (`120244164992490737`) → ACTIVE (estava PAUSED)
3. ✅ CJ8v2 (`120237168468370737`) budget R$120 → **R$60/d**
4. ✅ CJ8v2 geo: Sul+CO+DF → **Sudeste + Sul** (SP+RJ+MG+ES+PR+SC+RS, 7 estados) — user pediu foco SP/RJ + Sul
5. ✅ Adset isolado AD10v2 criado → deletado (Meta API rejeitou ad creation por destination_type incompatível)

### Google `8167636084`
6. ✅ Bilhar (`23816403561`) → PAUSED
7. ✅ Jantar (`23821730147`) → PAUSED
8. ✅ RTG (`23821730339`) → PAUSED
9. ✅ Brand-Defense (`23821730141`) → mantido ENABLED

## Estado final 12/Mai

**Meta CJ8v2:** ACTIVE R$60/d. Sudeste + Sul (SP/RJ/MG/ES/PR/SC/RS, 7 estados). Arquitetos 30-60 iOS. 3 ads ACTIVE (AD03/AD04/AD05). 6 ads PAUSED.

**Google:** apenas Brand-Defense ENABLED R$10/d budget.

## Plano B (em 48h, 14/Mai)

Criar AD novo LP form de verdade — image hash novo, copy CTA `LEARN_MORE`, destination `WEBSITE`, link `bretda.com.br/colecao/aurora-sinuca`. Rodar em novo adset CJ-AURORA-ISO R$10/d Sudeste.

**Pré-req:** upload image hash via `meta_ads_upload_image` com foto Aurora high-res.

## Aprendizados estruturais

1. **NÃO confiar em `link_url` para inferir tipo de form.** Confirmar via `creative.object_story_spec.link_data.link` + `destination_type` da API. Meta API rejeita ad cross-destination silenciosamente quando creative é Instant Form bound.

2. **Pixel match rate 0,7% sempre foi sintoma do Instant Form full account, não do trap 28/Abr.** A interpretação inicial de 0,7% como "147/148 nunca passam pela LP" estava certa — mas era o estado SEMPRE, não pós-28.

3. **Budget jumps massivos (>2x) em um dia em conta com algorithm em learning fase = destrutivo.** Esperado +20-30% ao dia para preservar learning.

4. **Mix de CTAs no mesmo adset confunde algoritmo.** Pré-28 era 3 ads com creatives homogêneos. Pós-28 foi 8 ads heterogêneos.

## Triggers
- `audit bretda d+7` — 19/Mai gate, comparar CPL+volume restore vs Instant Form era
- `criar ad lp form bretda` — Plano B, executar 14/Mai
- `valida creative tipo bretda {ad_id}` — checar destination_type real de qualquer ad

## Sessão
agentId session: 12/Mai/2026 — Orion via /AIOS:agents:aios-master
Operações registradas: `mcp-ads-bridge ads_action_log last_n: 20`
