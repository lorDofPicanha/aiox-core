---
name: Bretda D+7 Gate Consolidado (Google + Meta)
description: Gate consolidado Bretda 24/Abr — métricas mínimas Google e Meta após Fase 1+2
type: project
originSessionId: 8e39d9f7-1c5d-48ea-8f0c-660ab28a19de
---
# 🔴 LEMBRETE — 24/Abr 2026 (D+7)

## Ação

Avaliar gate consolidado Bretda — Google + Meta juntos. Kasim/Depesh/Molly decision gate.

## Google Bretda — gate D+7
Puxar métricas via script node (MCP 403 até reauth):
```
cd D:/jarvis/mcp-ads-bridge && node -e "..." # usar padrão bretda-17abr-* como template
```

**Métricas alvo (tudo deve bater):**
- CPL account ≤ R$100 (vs R$477 pré-17/Abr)
- 3+ conversões em 7d
- IS Lost Rank < 45% (vs 60,3% pré)
- IS Lost Budget < 15% (R$70/d adequado se IS Lost Rank cair)

**Ações conforme resultado:**
| Cenário | Ação |
|---------|------|
| 🟢 Green (3 de 4 bate) | Manter curso, preparar Fase 3 (tracking Stape/CRM) |
| 🟡 Yellow (2 de 4) | Duplicar core ad group em SKAG puro, mais negatives |
| 🔴 Red (≤1 bate) | Pivot Kasim: mudar pra Maximize Clicks cap R$6, focar SKAG exact, reduzir budget R$50 |

## Meta Bretda — gate D+7
```
mcp__mcp-ads-bridge__meta_ads_insights account=bretda date_preset=last_7d level=adset
```

**Métricas alvo:**
- CPL médio account ≤ R$12
- Leads 7d ≥ 70 (vs 41 pré, +70% esperado após concentração)
- CJ7v2 + CJ8v2 CPL ≤ R$10
- LAL-Leads (launch 19/Abr, 5 dias de dados) CPL ≤ R$15

**Se 3 de 4 baterem:** seguir pro D+14 (gate ramp R$54→R$180/d Maio)
**Se ≤2 de 4:** pause escalation, diagnosticar (freq saturando? creative fadiga?)

## D+14 (1/Mai) — próximo gate
Ramp budget Meta R$54 → R$180/d (plano Maio transicional). Critérios:
- Account CPL estável ≤ R$12 por 7d consecutivos
- Freq em nenhum adset > 2,0
- ≥4 ads ativos performando (CTR > 2%)
- CAPI via CRM Tocks em desenvolvimento confirmado

## Why
Primeiro ponto onde temos dados suficientes (7 dias de nova estrutura) pra validar Fases 1 e 2. Decisões tomadas antes disso são prematuras.

## How to apply
Sessão Claude, pedir: "rodar gate Bretda D+7". Claude lê este arquivo + puxa métricas Google+Meta + aplica decision trees + propõe Fase 3 ou ajustes.
