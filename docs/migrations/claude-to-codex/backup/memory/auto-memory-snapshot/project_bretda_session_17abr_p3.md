---
name: Bretda Session 17/Abr P3
description: Pós-crash dwm.exe. Conclave (Hormozi/Peep/Neil) 3/10. Fix CP-RTG-WARM budget R$20→R$55 + iOS-only removido. Projeção 5-6× audience, 10-12d p/ exit learning.
type: project
originSessionId: 7956dc26-3123-4503-bf5d-6f5b1c025c81
---
# Bretda — Session 17/Abr P3 (Pós-Crash Recovery)

## Contexto
Sessão após crash do sistema (dwm.exe STATUS_COMMITMENT_LIMIT 0xc00001ad, 15:54:24) — esgotamento de commit memory por 41 node.exe + 10 claude.exe. Sessão local caiu, mas **plataformas preservaram ações** das sessões P1 e P2.

## Estado verificado pós-crash
### Meta Ads Bretda
- `CP-RTG-WARM` (ID 120244496926800737): ACTIVE desde 17/Abr 13:47 ✅
- `CP-PROSPECTING-LAL-LEADS` (ID 120244500365840737): PAUSED, budget R$40/dia, aguardando D+2 (19/Abr) ✅
- `CP2 - Arquitetos/Design`: ACTIVE (única gastando)
- **CPL 7d CP2 confirmado:** R$ 9,29 (41 leads em R$ 380,89)
- Restantes 32 campanhas: PAUSED

### Google Ads Bretda (customer 8167636084)
- `[C] - Pesquisa - Leads - Sudeste - 08/11`: ENABLED, budget R$70/dia, MANUAL_CPC
- Change history: 50 mudanças em 16/Abr (ontem), **zero mudanças 17/Abr** (confirma bug "Google MCP 403 login-customer-id header" da sessão P2)

## Diagnóstico CP-RTG-WARM (ACTIVE mas 0 impressions em 4h)
- Adset `CJ-RTG-WARM - LAL 1% Eng IG - Brasil - iOS`
- Budget R$ 20/dia (guardrail Meta Ads MCP: max R$100/dia)
- Filtro iOS-only = ~80% do tráfego BR cortado
- Audience estimada: ~500k (LAL 1% + iOS + 25-65 BR)
- Impossível sair de learning phase (precisa 50 conv/7d, projetado 9-14/7d)

## Conclave Mind Clones (sintetizado dos SKILL.md)
### Alex Hormozi (Value Equation)
- **Score: 3/10** — "Too small to matter"
- Ticket R$33k × margem 40% × close 4% = **CAC máx R$528/lead** vs atual R$9,29 = **56× abaixo** do CAC máx
- Recomendação: R$150-200/dia mínimo por adset LAL

### Peep Laja (CXL — Statistical Rigor)
- **Score: 2/10** — "Esse teste nunca vai chegar em conclusão"
- 350 conv/variation × 1,3 leads/dia = **270 dias** p/ MDE aceitável
- Recomendação: R$50/dia mínimo + remover iOS filter

### Neil Patel (Growth Loops)
- **Score: 4/10** — "Está testando sem teste"
- Priorizar escalar CP2 (funciona) antes de testar LAL
- Recomendação: remover iOS + R$60-100/dia

**Consenso 3/3:** (1) R$20/dia inviável, (2) iOS-only sem data é viés, (3) deixar rodar 24h é waste

## Ações Executadas
| Ação | Antes | Depois | MCP Call |
|---|---|---|---|
| Budget adset | R$ 20,00 | **R$ 55,00** | `meta_ads_update_budget` ✅ |
| Filtro iOS | `user_os: ["iOS"]` | `user_os: []` | `meta_ads_update_targeting` ✅ |
| Rename | — | Pendente manual | MCP não expõe |

## Projeção Pós-Ajuste
- Audience effectiva: 500k → **2.5-3M** (5-6× maior)
- Impressions/dia: 400-570 → **1.400-1.800**
- Leads/dia (CPL R$12): 1,3 → **4-5**
- Exit learning phase: 270d → **~10-12 dias**

## Débito técnico
- **Rename pendente** (MCP não tem `meta_ads_update_name`):
  - Campanha: `CP-RTG-WARM` → `CP-LAL-ENGIG-PROSPECTING`
  - Adset: `CJ-RTG-WARM - LAL 1% Eng IG - Brasil - iOS` → `CJ-LAL1-ENGIG-BR-All`
- **Google MCP 403** persiste (login-customer-id header) — impede mudanças automáticas em Google Ads Bretda

## Checkpoints
- **17/Abr 23:00:** primeira leitura delivery (>200 impressions = config OK)
- **18/Abr 14:00:** 24h post-launch, validar CPL R$10-20
- **19/Abr D+2:** Unpause CP-PROSPECTING-LAL-LEADS (já programado)
- **20/Abr 19:00 D+3:** Review 72h CP-RTG-WARM (CPL<R$15 escala, >R$25 pausa)
- **24/Abr D+7:** Gate consolidado Google+Meta (critérios Fase 3)

## IDs Reference
- Campaign: 120244496926800737
- Adset: 120244496926970737
- Custom Audience (LAL seed): 120244118776810737
- Account: act_381618241134624
