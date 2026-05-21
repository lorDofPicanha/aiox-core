---
name: Sessão 22/Abr — OAuth Reauth + Status Tocks Google Ads
description: Sessão Orion pós-viagem. Traffic-chief puxou Meta live + diagnosticou 403 Google, reauth com contato@tockscustom.com.br restaurou acesso 3 CIDs, status completo Google Ads Tocks puxado (17 campanhas, 2 ACTIVE, SIS 90% no Search).
type: project
originSessionId: 53e176e8-9688-4857-a8db-b79e7496809e
---
# Sessão 22/Abr/2026 — Orion (aios-master)

## Contexto de entrada
- Usuário voltou de viagem (17/Abr→22/Abr)
- Memória ativa: Tocks Google MCP bloqueado por OAuth desde 17/Abr
- Pedido: "chame meu chefe de trafego e me fale como esta a conta do google ads e meta ads da tocks"

## Fluxo executado

### 1. Delegação ao traffic-masters-chief
Chamada via Agent tool, missão:
- Puxar status Tocks Google + Meta (7d/14d)
- Identificar anomalias vs baseline 17/Abr
- Decisões urgentes pós-viagem

**Resultado:**
- Meta: LIVE completo puxado — 2 campanhas ACTIVE (C005 CSD R$95/dia + C006 RTG R$15/dia = R$110/dia), 7d R$565 spend, **0 leads / 0 purchases**, 97 messaging conversations 14d, saldo crítico R$4,05/cap R$51.177
- Google: **BLOQUEADO** — `listAccessibleCustomers` retornou só Bretda 8167636084. Tocks/KR/MCC → 403 USER_PERMISSION_DENIED
- Anomalia 19/Abr Meta: queda 86% spend (R$97→R$13,88), possível guardrail ou saldo

### 2. Usuário priorizou resolver token primeiro
- Confirmou email owner MCC: `contato@tockscustom.com.br` (não `contato@bretda.com.br`)

### 3. Reauth executado
- Script: `D:/jarvis/mcp-ads-bridge/scripts/reauth-with-sheets.cjs`
- Abriu localhost:3847/callback, usuário logou com tockscustom
- Novo refresh token gerado: `1//0hqBY3yRIY-P6Cg...` salvo em `.env:9`
- Adicionado: `GOOGLE_ADS_LOGIN_CUSTOMER_ID=7943699417` em `.env:12`

### 4. Validação do token
- Script custom `validate-new-token.cjs` criado (bug: v20/v21 POST retornou 404, endpoint é GET)
- Usei script existente `google-reauth-check.mjs` — retornou 200 OK para Tocks direto E via MCC

### 5. Restart MCP bridge
- MCPs processes matadas: PIDs 6836 + 10112 (via taskkill //F //PID)
- Usuário rodou `/mcp` → reconnected
- Tools MCP voltaram operacionais

### 6. Status Google Ads Tocks completo puxado
**Overview:**
- 7d: R$505, 29.487 impr, 343 clicks, 50 conv, CTR 1,16%, CPC R$1,47, ROAS 0
- 14d: ~R$844, ~56k impr, ~1.019 clicks, 122 conv, ROAS 0
- 30d: R$1.751, 84.466 impr, 4.132 clicks, 240 conv, ROAS 0

**Campanhas: 17 total, 2 ACTIVE**
- `TOCKS_Search_Alta-Intencao` (Search, R$150/dia) — 14d R$443, 117 conv, **SIS 9,99%** (Lost-IS 90%, piorou vs 85% baseline 16/Abr)
- `TOCKS_Shopping_Mesas_Artesanais` (Shopping, R$20/dia) — 14d R$201, 28k impr, apenas **1 conv** em 14d

**PAUSED durante viagem:**
- `[00-CLICK] PMAX LEADS 01/04` — teve 14d R$199/607 clicks/4 conv → pausada (ROI ruim)

**Zumbis:** 14 PAUSED sem impressões (hygiene pendente)

## Key findings

1. **Search Alta-Intenção é o cavalo** — 117 conv/14d com apenas 10% do share. Escalar R$150→R$400-500/dia libera upside travado.
2. **Shopping Mesas_Artesanais com problema estrutural** — 28k impr / 1 conv = feed/creative/LP errado.
3. **ROAS cego Google+Meta persiste** — Enhanced Conversions P1 não deployado (desde 17/Abr). conv_value=0 em tudo.
4. **Meta saldo crítico** — R$4,05 vai travar em 12-24h no ritmo atual. PIX urgente.
5. **Reauth Testing mode expira 7 dias** — próximo reauth ~29/Abr se não publicar OAuth consent screen.

## Arquivos criados nesta sessão

- `D:/jarvis/mcp-ads-bridge/scripts/validate-new-token.cjs` — script diagnóstico token (ficou com bug v20/v21 POST vs GET)
- `D:/jarvis/mcp-ads-bridge/scripts/tocks-status-22abr.mjs` — criado pelo traffic-chief, diagnóstico Tocks Google+Meta reutilizável
- `C:/Users/kingp/.claude/projects/D--AIOS/memory/project_oauth_reauth_22abr_resolved.md` — memória do reauth

## Pendências para próxima sessão

1. 🔴 **PIX Meta Tocks R$2.000+** (saldo R$4,05 → trava em horas)
2. 🔴 **Escalar Search Alta-Intenção** R$150→R$400 (absorver os 90% de Lost-IS)
3. 🟡 **Investigar Shopping Mesas_Artesanais** (1 conv/14d, feed ou LP?)
4. 🟡 **Deploy Enhanced Conversions P1** (7 env vars, código pronto)
5. 🟡 **Advertiser Verification Google** (pendente desde antes da viagem)
6. 🟡 **Limpar 14 zumbis PAUSED** (hygiene)
7. 🟢 **Reauth antes de 29/Abr** ou publicar OAuth consent screen
8. 🟢 **Investigar queda Meta 19/Abr** (guardrail ou saldo?)

## Handoffs sugeridos

- `@kasim-aslam` (Google Golden Ratio) — atacar SIS 90% + diagnóstico Shopping
- `@depesh-mandalia` (BPM Method) — ROAS cego Meta (event mapping)
- `@ralph-burns` (DPI² Creative Lab) — revisar scale Meta R$110→R$250/dia
