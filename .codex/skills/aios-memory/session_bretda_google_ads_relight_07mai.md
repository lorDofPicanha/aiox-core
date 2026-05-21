---
name: Bretda Google Ads Relight 07/Mai
description: Reauth Google + religar 4 campanhas Bretda canon (R$60/d) pós-token expiry. Gate 72h em 10/Mai.
type: project
originSessionId: fb632c7e-7869-41f3-b180-ab8cd686fb56
---
# Bretda Google Ads — Religação Pós-Reauth (07/Mai/2026)

## O que rolou

User completou reauth Google (token Bretda estava marcado pra expirar ~06/Mai). Conexão validada via `mcp-ads-bridge`:
- Google Ads: 🟢 connected (customer_id 8146675397 default tocks)
- Meta Ads: 🟢 connected (act_381618241134624)
- Bretda customer_id 8167636084 acessível via MCC 7943699417

User instruiu: "coloque o google ads da bretda no ar" → "vou comer faça as alterações de acordo com o que o chefe achar que traz o melhor resultado final"

## Estado pré-religação

5 campanhas TODAS PAUSED:
1. `23821730141` BR-Brand-Defense — R$10/d — start 2026-05-05 (NEW)
2. `23816403561` BR-Generic-MesaBilhar-HighIntent — R$25/d — start 2026-05-05 (NEW)
3. `23821730147` BR-Generic-MesaJantar-HighIntent — R$15/d — start 2026-05-05 (NEW)
4. `23821730339` BR-RTG-SiteVisitors-90d — R$10/d — start 2026-05-05 (NEW)
5. `23251766617` `[C] - Pesquisa - Leads - Sudeste 08/11` — R$50/d — start 2025-11-10 (LEGACY)

Performance LAST_30_DAYS (estrutura ENABLED antiga): R$791,94 spend / 2 conv / ROAS 0.13

## Decisão do chefe (Conclave mental)

**Religar SOMENTE as 4 NEW (canon de 05/Mai). Manter LEGACY 23251766617 PAUSED.**

Rationale (larry-kim + neil-patel + jay-abraham + rob-walling + eric-ries):
- 4 NEW = estrutura limpa pós-redesign Bretda (Brand+MesaBilhar+MesaJantar+RTG)
- LEGACY tem nomenclatura antiga (`[C] - Pesquisa - Leads - Sudeste 08/11`) — keyword/URL drift provável
- Saldo histórico crítico (R$327 03/Mai) → R$60/d > R$110/d
- High-Ticket Quality > Quantity (NON-NEGOTIABLE)
- Conversion actions OK: 4 ENABLED, "[AGD] Lead" default R$100 always_use=true
- Auto-tagging ON, BRL ✅, Time zone America/Fortaleza
- Pixel canon Meta `3348133485496539` (não aplica Google)

## Ações executadas

### Round 1 (12:35 BRT) — só camada campaign
| Campaign ID | Nome | Status novo |
|---|---|---|
| 23821730141 | BR-Brand-Defense | ✅ ENABLED |
| 23816403561 | BR-Generic-MesaBilhar-HighIntent | ✅ ENABLED |
| 23821730147 | BR-Generic-MesaJantar-HighIntent | ✅ ENABLED |
| 23821730339 | BR-RTG-SiteVisitors-90d | ✅ ENABLED |
| 23251766617 | [C] - Pesquisa - Leads - Sudeste 08/11 | ⏸️ PAUSED (mantido) |

### Round 2 (~13:00 BRT, pós-audit traffic-masters-chief) — camadas internas + tuning

**Conv tracking fixed:**
- ✅ Demoted `[AGD] Lead 7138711130` → SECONDARY (não-biddable, mata fantasma R$100)
- ✅ Promoted `Lead-Pagina-Obrigado 7571079256` → PRIMARY com value R$1500 always_use=true (alimenta ECL com nCAC alvo high-ticket)
- ⚠️ Update value [AGD] Lead bloqueado pelo Google (codeless conversion type — MUTATE_NOT_ALLOWED). Mitigation: SECONDARY já neutraliza bidding influence.

**Hierarquia interna ENABLED (descoberta crítica: ad_groups + ads estavam todos PAUSED!):**
| Campaign | Ad Groups ENABLED | Ads ENABLED |
|---|---|---|
| BR-Brand-Defense | Brand (196949446315) | 807857489440, 807857489443 |
| BR-Generic-MesaBilhar | MesaBilhar-Madeira (197725344393), MesaBilhar-Luxo (198723867080), MesaBilhar-SobMedida (199298369947) | 807857036047/050, 807939197984/87, 807939272783/86 |
| BR-Generic-MesaJantar | MesaJantar-12-Lugares (197138288158), MesaJantar-Madeira-Macica (198723867320) | 807851207032/35, 807857401375/78 |
| BR-RTG-90d | RTG-90d (197138288398) | 807939273302, 807939273305 |

Total: **7 ad_groups + 14 ads ENABLED**

**Keywords added (9 total):**
- ad_group MesaBilhar-Luxo (198723867080) — 4 search terms ouro migrados da legacy: "mesa sinuca que vira mesa de jantar", "mesa de sinuca e jantar", "mesa bilhar e jantar", "mesa que vira sinuca" (todas PHRASE)
- ad_group MesaJantar-Madeira-Macica (198723867320) — 5 KWs novos: "mesa de jantar nogueira", "mesa jantar madeira nobre", "mesa jantar grande madeira maciça", "mesa jantar luxo madeira", "mesa jantar sob medida madeira" (PHRASE)

**Spend autorizado:** R$ 60/dia
**Estado final:** 2026-05-07 ~13:00 BRT — full hierarchy ENABLED, agora começa a entregar real

## Gate 72h — 10/Mai/2026

Critérios pra continuar:
- CPL ≤ R$50 (ideal ≤ R$25)
- ≥ 3 conversões totais somando 4 campanhas
- Spend total < R$200 (sanity check budget)

Se falhar:
- CPL > R$50 → pausar generic/RTG, manter só Brand-Defense
- Zero conv em 72h → auditar URLs + keywords + landing page
- Spend descontrolado → cortar budget 50%

Se passar:
- Considerar religar LEGACY 23251766617 OU substituir keywords antigas por keywords das novas (não recriar do zero — preserva histórico)
- Escalar budget (10→15, 25→35) gradual

## Triggers

- `audit bretda 72h` — checa performance e decide gate
- `bretda extend` — religa legacy se gate passar
- `bretda kill` — pausa tudo se gate falhar

## Refs

- Memory: project_bretda_pixel_fix_30abr.md, session_bretda_google_status_29abr.md, session_bretda_auditoria_03mai.md
- Conv actions: 6918863652 Contato, 7138711130 [AGD] Lead R$100, 7540863796 WhatsApp Click, 7571079256 Lead Pagina Obrigado
- Budget total: R$60/d (R$1.800/mês full burn)
