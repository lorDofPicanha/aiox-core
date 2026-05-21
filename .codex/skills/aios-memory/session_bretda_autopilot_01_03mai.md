---
name: Bretda Autopilot 01-03/Mai (User Travel 2 Days)
description: 01/Mai → user viajando 2d. 3 routines armadas (01/02/03 Mai 21h BRT) com guardrails hard. AD05 paused, saldo R$635 runway 5,3d.
type: project
originSessionId: c8595901-4335-43dc-83cd-b238e5d68c59
---

# Bretda Autopilot — User Travel 01-03/Mai

🟢 01/Mai meio-dia BRT: user viajando 2 dias, retorna 03/Mai (sábado). Vai consertar CAPI manual antes de pingar.

## Estado deixado

**Conta:** `act_381618241134624`
- 5 ads ACTIVE em CJ8v2 R$120/d (AD09 Opal + AD10 Aurora + AD11 Âmbar + AD12 Citrino + AD13 Zurita)
- AD05 PAUSED (legacy 16% spend / 0 leads em 30/Abr — pausado nesta sessão)
- AD03/AD04 já PAUSED desde 30/Abr
- Saldo prepago real **R$ 635,45** (`funding_source_details.display_string`)
- Runway ~5,3 dias no ritmo R$120/d
- CAPI ainda OFFLINE (user fixará manual antes do retorno)
- Learning fresca: 16/50 conversões do edit 28/Abr (4 ads novos AD10-13)

## Diagnóstico da sessão

**Drop real foi 29→30/Abr** (CPL R$12 → R$56), não hoje. Hoje só pacing de manhã.

Causa real: learning phase volatility + 6 ads dispersando sinal. NÃO foi billing — gap inicial de R$672 era leitura errada de campo API (`balance` cru vs `funding_source_details.display_string`).

## Routines armadas

| ID | Trigger | Briefing |
|----|---------|----------|
| `trig_01MGmkrmC15xUof9naA72bDV` | 01/Mai 21h BRT | Routine original 30/Abr (gate +48h auto-contido) |
| `trig_01M06YK9SS8YN7H4XSZPQN5N5J` | 02/Mai 21h BRT | Day 2 — bretda-autopilot-02mai |
| `trig_01MKZPMRQAP07XHDCTJVV9GDF6` | 03/Mai 21h BRT | Day 3 — bretda-autopilot-03mai (resumo agregado pro retorno user) |

## Guardrails HARD (qualquer ativa pause CJ8v2)

1. **G2 saldo ≤ R$50** → pause + Telegram (blocker absoluto)
2. **G1 CPL 24h ≥ R$50** → pause + Telegram
3. **G4 daily_spend > R$200** (167% budget) → pause + Telegram
4. **G3 ad spend 48h > R$30 com 0 leads** → pause só esse ad

## Guardrails SOFT (alerta apenas)

- CTR < 1,5% trending down 48h
- Frequency > 4
- AD05 verify PAUSED

## Cenário esperado

- Base: ~R$240 spend total 2d, 16-24 leads, saldo final ~R$395, 0 ações executadas
- Risco: 1 routine pausa CJ8v2 + alerta Telegram

## Override manual (celular do user)

Script kill switch: `D:/jarvis/mcp-ads-bridge/scripts/update-status.js`

## Pendências user (quando retornar 03/Mai)

1. **Consertar CAPI** (gerar System User Token BM Bretda + `vercel env add META_CAPI_TOKEN`) — user disse que faria isso antes de pingar
2. Detalhes estéticos site Bretda (em curso)
3. Deploy LP redesign produção
4. Avaliar resumo agregado da routine 03/Mai 21h BRT

## Files

- `D:\AIOS\docs\projects\bretda-redesign\autopilot-02-03mai.md` (briefings completos)
- `D:\AIOS\docs\projects\bretda-redesign\routine-override-01mai.md` (advisory note hoje 21h)
- `D:\AIOS\.claude\agent-memory\traffic-masters-chief\project_bretda_autopilot_02_03mai.md`
- Logs MCP bridge: `D:/jarvis/mcp-ads-bridge/data/bretda-01mai-*.json`

## Trigger retomada

User volta 03/Mai → CAPI fix manual → ping. Ou se Telegram alert dispara antes.
