---
name: Sessão Bretda Tactical Review + Execução 30/Abr
description: Revisão tática Bretda Google+Meta com 7 alterações executadas (pause AD03/AD04 + ativa AD10/11/12/13 + pause Google) + routine cloud agendada pra +48h gate
type: project
originSessionId: 09445931-5c3a-4682-98e2-5521ec8f7c57
---
# Sessão Bretda Tactical Review + Execução — 30/Abr 2026 (madrugada, ~21h-00h BRT 29→30/Abr)

## Contexto

User pediu status Google + Meta da Bretda. Após pull completo (overview/insights/adsets/creatives/pixel) executei revisão tática e o user aprovou execução autônoma das alterações **exceto CAPI** (que está esperando o redesign LP da Bretda concluir — mexer agora seria desperdício).

## Diagnóstico (29/Abr noite, 7d/14d)

### Google Ads (customer 8167636084)
- 1 campanha ativa: `[C] - Pesquisa - Leads - Sudeste - 08/11` (SEARCH MANUAL_CPC R$50/d)
- 14d: R$142,33 spend / 1 conversão (R$50 valor) / Search IS **9,99%**
- 7d: R$140 spend / **0 conversões** / CPC R$5,61 / CTR 13,44%
- **Diagnóstico**: Search IS 10% = perdendo 90% do leilão. Sem CAPI nem LP nova, era waste.

### Meta Ads (act_381618241134624)
- 35 campanhas total, só 1 ACTIVE: CP2 Arquitetos (campaign 120236735188220737)
- 1 adset ACTIVE: CJ8v2 (id 120237168468370737), R$120/d, LOWEST_COST_WITHOUT_CAP
- 7d: R$225,26 / 21 leads / **CPL R$10,73** (vs baseline R$5,21 → 2× pior, mas melhorando vs semana anterior R$12,18)
- 14d: 16 LP views vs 159 link clicks = **10% LP view rate** 🔴
- View_content pixel próprio: 6 (em 14d) — discrepância vs 16 LP views indica gargalo entre redirect e pixel JS load

### Drill-down ads (CJ8v2 ad-level 7d)
| Ad | Impr | Clicks | Spend | Leads | CPL |
|---|---|---|---|---|---|
| AD05 | 6.298 | 169 | R$218,67 | 21 | R$10,41 (97% spend, 100% leads) |
| AD03 | 97 | 3 | R$5,02 | 0 | morto |
| AD04 | 26 | 0 | R$1,51 | 0 | zumbi (CTR 0%) |
| AD09 Opal | 4 | 1 | R$0,06 | 0 | recém-saiu 28/Abr |

### Pixel
- ID 3348133485496539 (Pixel Oficial Bretda) ATIVO, last_fired 28/Abr 19:42

## Execução tática (autorizada user, 7/7 OK)

### Meta Ads
| Ad | ID | Antes → Depois |
|---|---|---|
| AD03 | 120237168468400737 | ACTIVE → **PAUSED** |
| AD04 | 120244164992490737 | ACTIVE → **PAUSED** |
| AD10 Aurora | 120245285456440737 | PAUSED → **ACTIVE** |
| AD11 Âmbar Carousel | 120245285464550737 | PAUSED → **ACTIVE** |
| AD12 Citrino | 120245285468330737 | PAUSED → **ACTIVE** |
| AD13 Zurita Carousel | 120245285477490737 | PAUSED → **ACTIVE** |

Estado final CJ8v2: **6 ads ACTIVE** (AD05 + AD09 + AD10 + AD11 + AD12 + AD13). Budget mantido R$120/d, algoritmo Meta distribui entre os 6.

### Google Ads
- Campanha 23251766617 ENABLED → **PAUSED** (R$50/d economizado durante redesign)

### Não tocado (proposital)
- 🔒 **CAPI** — esperando redesign LP concluir (user explícito)
- 🔒 **CJ7v2 Luxury** (id 120237168442570737) — depende de CAPI
- 🔒 CJ4/CJ5/CJ6/CJ1×2 — paused já

## Routine cloud agendada

**ID:** `trig_01MGmkrmC15xUof9naA72bDV`
**Quando:** `2026-05-02T00:00:30Z` (= 01/Mai 21:00 BRT, +48h)
**One-shot:** sim (run_once_at)
**Modelo:** claude-sonnet-4-6
**Repo:** SynkraAI/aios-core
**URL:** https://claude.ai/code/routines/trig_01MGmkrmC15xUof9naA72bDV

**Função:** Briefing Generator. Cloud agent NÃO acessa mcp-ads-bridge (é local). Vai gerar markdown auto-contido com:
1. 3 queries MCP prontas (insights ad-level last_2d / pixel_check / overview)
2. Tabela template AD05/AD09/AD10/AD11/AD12/AD13 com coluna "CPL gate"
3. Snippets `meta_ads_update_status` prontos pra cada ad
4. Análise macro: CPL agregado vs baseline R$10,73, monopólio AD05, candidatos a scale
5. Lembrete D+3 (+24h) + perguntar status redesign LP

**Gate criteria embedded:**
- KILL: CPL > R$25 com 200+ impressões → pausar
- KILL: 0 leads com 200+ impressões → pausar
- WATCH: CPL R$15-25 → +24h
- KEEP: CPL < R$15
- SCALE candidate: CPL < R$10 + CTR > 3%

## Pendências user

1. **D2 CAPI handoff @aios-dev** — esperando redesign LP concluir
2. **D9 spend cap** — recomendação A=R$40k/30d, ainda não aprovado
3. **D15 rotação 8 ads** — depende do gate D+3
4. **Google decisão** — pausado por enquanto, religar quando LP nova + CAPI subirem
5. **CJ7v2 Luxury** — manter paused até CAPI

## Aprendizados

- Em conta com 1 ad pulmão (AD05 = 100% leads), unpause de 4 novos com mesmo budget total (R$120/d) é o caminho menos arriscado: preserva flow + força sample em sample paralelo
- Cloud routine não acessa mcp local — solução é briefing pre-formatado pra colar+executar localmente
- LP view rate 10% indica problema entre redirect e pixel JS load — não é o pixel quebrado, é o site perdendo gente antes do fbq() rodar
- CPL "dobrou" no aggregate (R$5,21→R$10,73) mas a tendência semanal está MELHORANDO (R$12,18 sem 15-21/Abr → R$10,73 22-28/Abr). Pode ser regression pra média.
