---
name: Tocks Shopping Diagnóstico 16/Abr
description: Sessão 16/Abr/2026 — diagnóstico Search (Lost-IS Budget 85%) + Shopping (0 imp, 9 campanhas zumbis, padrão MC). MC ID 5665639473 fornecido.
type: project
originSessionId: 61551b39-7883-42d3-9313-28396e91c56f
---
## Tocks Google Ads — Sessão 16/Abr/2026

**Gatilho**: usuário reportou ads fraco, não achou nada no Google.

### Root Cause #1 — SEARCH sufocada por budget
- `TOCKS_Search_Alta-Intencao` (ID `23703520246`), R$35/dia
- **Lost IS Budget = 84.81% hoje** (7d: 83.27%) — Lost IS Rank = 0%
- Over-delivery pacing dobra para R$70/dia mas ainda Limited by Budget
- **P0 pendente**: autorizar subir budget R$35 → R$100/dia

### Root Cause #2 — SHOPPING estruturalmente bloqueado (Merchant Center)
- `TOCKS_Shopping_Mesas_Artesanais` (ID `23743031426`, criada 10/Abr): 0 imp em 7d
- **Padrão histórico**: 9 campanhas Shopping/PMAX tentadas (3 agências: EB, ORN, atual), TODAS com 0 entrega
- Site `tockscustom.com.br` é ecommerce completo (PDPs, carrinho, checkout) — não é problema de infra
- Change history 30d: zero mudanças na campanha Shopping = feed nunca vinculado
- **Merchant Center ID**: `5665639473` (usuário forneceu, PENDENTE validação linking)

### Q1-Q4 pendentes para usuário validar em merchants.google.com/mc/
- Q1: Google Ads `8146675397` linkado? Status Active/Pending?
- Q2: Produtos total / aprovados / reprovados / pendentes?
- Q3: Motivos de reprovação?
- Q4: `tockscustom.com.br` Verificado + Reivindicado?

### Fix técnico aplicado (pendente restart MCP)
- `D:/jarvis/mcp-ads-bridge/src/providers/google-ads.ts`: adicionado `shopping_setting.merchant_id` + outros 3 campos em `getCampaignDetails()`
- Build OK via `npm run build`. **Restart do Claude Code** ativa.

### 15 PAUSED (já corretas)
- 8 Shopping/PMAX zumbis + 7 outras. Decisão futura: REMOVE definitivo, renomear `[ARQUIVADO]`, ou manter.

### Fix 13/Abr (URL www) — CONFIRMADO OK
- 4 RSAs novos ENABLED+APPROVED, 4 antigos PAUSED+DISAPPROVED.

### Artefatos da sessão
- `D:/AIOS/tmp-ads/tocks-shopping-diagnosis-16abr2026.md` — relatório completo
- `D:/AIOS/tmp-ads/tocks-diag-full.txt`, `tocks-diag2.txt`, `tocks-diag3.txt`, `tocks-diagnostic.mjs` (subagents)
- `D:/jarvis/ads-data/reports/google-*-8146675397-*.json` (caches)

### Top keywords convertendo Search (7d)
- `mesa de bilhar preco` → 794 imp / 92 conv / R$165 CPA
- `loja mesa de sinuca`, `mesa de bilhar venda`, `mesa de sinuca residencial`

### Melhorias MCP identificadas (backlog)
1. `google_ads_campaign_details` precisa flag `summary_only` (output 112 geo criteria é gigante)
2. `google_ads_recommendations` tem bug GAQL: `UNRECOGNIZED_FIELD` em `recommendation.impact.*.metrics.*`
3. Falta tool para Merchant Center API
