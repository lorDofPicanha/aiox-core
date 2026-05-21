---
name: Bretda D+3 CP-RTG-WARM Review
description: Revisar CP-RTG-WARM 72h após ativação (17/Abr 17:18 → 20/Abr 19h)
type: project
originSessionId: 8e39d9f7-1c5d-48ea-8f0c-660ab28a19de
---
# 🔴 LEMBRETE — 20/Abr 2026 19h (D+3 após ativação)

## Ação

Revisar performance **CP-RTG-WARM - Lookalike 1% Engajamento IG** — campanha Meta Bretda ativada 17/Abr 13:47 BRT, rodando ~72h.

## IDs
- Campaign: `120244496926800737`
- AdSet: `120244496926970737` (LAL 1% Engajamento IG, R$20/dia, iOS)
- Ad: `120244496928840737` (creative AD05, form `1795323604460936`)

## Métricas pra puxar

```
mcp__mcp-ads-bridge__meta_ads_insights account=bretda date_preset=last_3d level=adset object_id=120244496926970737
```

Olhar: CPL, Frequency, CTR, volume de leads, spend total 72h.

## Decision tree

| CPL observado | Ação | Comando |
|---|---|---|
| **< R$15** | ESCALAR pra R$40/d | `meta_ads_update_budget object_id=120244496926970737 daily_budget=40` |
| **R$15-25** | MANTER mais 72h, revisitar D+6 (23/Abr) | — |
| **> R$25** | PAUSE, revisar creative | `meta_ads_update_status object_id=120244496926970737 status=PAUSED` |
| **0 leads** com spend ≥R$40 | PAUSE imediato, creative não ressoa warm | idem acima |

## Sinais de atenção adicional
- Frequency > 2,8 → LAL pequeno saturando (seed IG 6.500-7.600 limitado). Expandir LAL 2% ou baixar budget.
- CTR < 1,5% (vs 3% CP2) → creative AD05 não rende em RTG. Testar AD04.

## Why
Janela de 72h é o mínimo Meta recomenda pra sair do learning phase. Decisões tomadas antes disso são ruído.

## How to apply
Sessão Claude, pedir: "rodar lembrete Bretda D+3 CP-RTG-WARM". Claude lê este arquivo + puxa insights + aplica decision tree.
