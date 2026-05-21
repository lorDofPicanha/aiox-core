---
name: Bretda Session 17/Abr P1 Executado
description: P1 completo — escalonamento Meta +20% CJ7v2/CJ8v2, CP-RTG-WARM criada PAUSED, OAuth Google reauth resolvido (client deletado + redirect_uri_mismatch)
type: project
originSessionId: cbc6be62-f694-43dc-9cd6-2619f380aae7
---
# Bretda — Sessão 17/Abr/2026 (P1 Executado)

## O que foi feito

### ✅ Meta Ads (act_381618241134624) — CP2 escalonamento
- **CJ7v2 Sul/CO/NE Luxury** (`120237168442570737`): R$17,50 → **R$21/dia** (+20%)
- **CJ8v2 Sul/CO/NE Arquitetos** (`120237168468370737`): R$17,50 → **R$21/dia** (+20%)
- Justificativa: CPL R$7,60 7d, CTR >3%, sem saturação — expansão geo bate Sudeste em 38%

### ✅ CP-RTG-WARM criada (todos PAUSED aguardando aprovação)
| Objeto | ID | Detalhes |
|--------|----|---------| 
| Campaign | `120244496926800737` | OUTCOME_LEADS / ABO |
| AdSet | `120244496926970737` | R$20/dia, LAL 1% Engajamento IG (id `120244118776810737`), Brasil+PRESENCE, 25-65, iOS, FB+IG |
| Ad | `120244496928840737` | Creative AD05 vencedor (`1615723886403281`) |
- Page ID: `249440611589045` | Lead form: `1795323604460936`
- Pixel default da conta (`3348133485496539`) — sem tracking_specs custom

### ✅ OAuth Google Ads reauth — 2 bugs resolvidos
1. **`deleted_client` 401** — script `scripts/reauth-with-sheets.cjs` tinha fallback hardcoded para client `506145955453-ep6tj...ac3h` (deletado no GCP). Patch: forçar leitura do `.env` via `require('dotenv').config()`.
2. **`redirect_uri_mismatch` 400** — script usava `http://localhost:3847` mas OAuth client estava registrado com `/callback`. Patch: `REDIRECT_URI = http://localhost:3847/callback`.
3. Novo refresh token salvo em `D:/jarvis/mcp-ads-bridge/.env` linha 9. Client ativo: `506145955453-1ukpk8339i3bbuokhmaneg8kto97ug1t`.

## Diagnóstico Meta (snapshot 17/Abr)

| Métrica | 30d | 7d | Tendência |
|---------|-----|----|-----------|
| Spend | R$2.156 | R$380 | estável |
| Leads | 124 | 41 | acelerando |
| CPL | R$17,39 | **R$9,29** | -46% |
| CTR | 2,46% | 3,00% | ↑ |
| CPC | R$1,56 | R$1,16 | ↓ |

**AD05 = vencedor absoluto** em 3 adsets. Core buyer: 35-54 masc (CPL R$16). 100% mobile_app.

## Pendências (próxima sessão)

### Bloqueante usuário
1. **Reiniciar MCP Ads Bridge** no Claude Desktop para carregar novo refresh token
2. **Revisar e ativar CP-RTG-WARM** (3 objetos PAUSED → ACTIVE)
3. **4 decisões estratégicas** do plano 30-60-90:
   - Budget Maio: R$6k mín ou R$10,5k escala?
   - CAPI: dev próprio ou Stape.io (R$90-240/mês)?
   - Target CPL para ticket R$33k: R$50? R$80?
   - Autoriza reescrita LP (headlines + LCP<2,5s)?

### Pós-reauth
4. **Análise Google Ads Bretda** (última leitura 16/Abr 21:44 — CP `23251766617` ENABLED R$70/dia)
5. **Renovar Enhanced Conversions** (confirmar persistência pós-token novo)
6. **Matar 32 campanhas PAUSED zumbis** no Meta

## Scripts reusáveis gerados

Todos em `D:/jarvis/mcp-ads-bridge/scripts/`:
- `bretda-full-audit-17abr.mjs` — auditoria completa Google+Meta
- `bretda-meta-deep-17abr.mjs` — deep dive Meta (breakdown demográfico, top ads)
- `bretda-p1-list.mjs` — listagem adsets/audiences
- `bretda-p1-scale.mjs` — escalonamento CJ7v2/CJ8v2
- `bretda-p1-probe.mjs` — probe targeting modelo
- `bretda-p1-rtg-create.mjs` — criação campaign+adset RTG-WARM
- `bretda-p1-rtg-ad-only.mjs` — criação ad AD05 no RTG-WARM
- `bretda-p1-verify.mjs` — verificação final
