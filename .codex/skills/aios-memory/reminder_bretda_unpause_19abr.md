---
name: Bretda D+2 Unpause CP-PROSPECTING-LAL-LEADS
description: Lembrete para unpause CP-PROSPECTING-LAL-LEADS em 19/Abr 2026 após hidratação de LALs
type: project
originSessionId: 8e39d9f7-1c5d-48ea-8f0c-660ab28a19de
---
# 🔴 LEMBRETE — 19/Abr 2026 (D+2 após criação)

## Ação

Unpause **CP-PROSPECTING-LAL-LEADS** (Meta Bretda) — 3 adsets prontos, aguardando apenas ligar.

## Comandos prontos (via MCP)

```
mcp__mcp-ads-bridge__meta_ads_update_status account=bretda object_id=120244500365840737 status=ACTIVE
mcp__mcp-ads-bridge__meta_ads_update_status account=bretda object_id=120244500389880737 status=ACTIVE
mcp__mcp-ads-bridge__meta_ads_update_status account=bretda object_id=120244500401490737 status=ACTIVE
mcp__mcp-ads-bridge__meta_ads_update_status account=bretda object_id=120244500860080737 status=ACTIVE
mcp__mcp-ads-bridge__meta_ads_update_status account=bretda object_id=120244500861360737 status=ACTIVE
mcp__mcp-ads-bridge__meta_ads_update_status account=bretda object_id=120244500863740737 status=ACTIVE
mcp__mcp-ads-bridge__meta_ads_update_status account=bretda object_id=120244500864440737 status=ACTIVE
```

## Pré-check antes de ligar
1. Verificar status das LALs:
   - `120244500845820737` (LAL 1% Leads) — deve estar "READY" não "POPULATING"
   - `120244500855530737` (LAL 1-2% Leads) — idem
   - `120244500815760737` (CA Leads 90d) — deve ter população > 100
2. Verificar CPL CP2 atual — se piorou após Fase 1 (CJ1/CJ6 pausados), revisar antes de escalar
3. Confirmar saldo conta Meta > R$500 (budget CBO R$40/dia × ~12 dias pra próxima revisão)

## Why
Meta leva 24-48h pra computar matching das LAL (seed hydratation). Ligar antes = learning phase ruidosa. 19/Abr = sábado, volume orgânico alto, bom pra ramping.

## How to apply
Abrir sessão Claude Code, pedir: "rodar lembrete Bretda D+2 unpause". Claude lê este arquivo + executa os 7 updates em sequência.

## Decision gates pós-unpause
- **D+5 (24/Abr 19h):** avaliar CPL por adset. Kills: LAL 1% Leads > R$20, LAL 1-2% > R$25, LAL IG 1% > R$30
- **D+7 (24/Abr):** gate consolidado — CPL account ≤ R$12, 70+ leads acumulados
