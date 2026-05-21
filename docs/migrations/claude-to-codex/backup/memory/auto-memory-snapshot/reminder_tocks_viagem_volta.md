---
name: Tocks Viagem — Checklist ao Voltar
description: Ações que só o usuário pode fazer após voltar de viagem (17/Abr). Deploy P1 + OAuth Google + UI Google Ads.
type: project
originSessionId: d9cd845c-0e0e-4fa1-9f2e-7f84985a22d4
---
# Tocks — Ao Voltar da Viagem (pós 17/Abr)

**Fonte consolidada:** `D:/AIOS/docs/projects/tocks-VIAGEM-consolidado-17abr.md`

## Primeiras 24h
1. Checar `daily-log-viagem/` — quantos guardrails dispararam durante viagem
2. Status C005/C006 no Meta (podem ter sido pausados por guardrail G1-G6)
3. **OAuth reauth Google** com `contato@tockscustom.com.br` (não Bretda)
4. **Advertiser Verification** Google Ads (URGENTE, risco cascata pós-KR)
5. **Conversion Actions fix** (UI Google Ads)
6. **Auto-apply OFF** (red flag Kim)

## 24-48h
7. Pausar 9 Shopping zumbis
8. Merchant Center Q1-Q4 pendentes
9. Decidir C006 (ativo/pausado/rescale)

## Deploy P1 código (pronto, só precisa de env vars)
Doc: `docs/projects/tocks-p1-code-viagem-17abr.md`
- 7 env vars (GA_ID, AW_CONVERSION_ID, Meta token/pixel, Clarity id)
- Ativar EC no Google Ads UI
- Criar projeto MS Clarity
- `scripts/test-capi-lead.ts` dry-run
- Deploy via @devops (NÃO está em push ainda)
- Validar ≥30 Lead events/semana em 72h no Meta Events Manager

**Why:** Análise 17/Abr identificou zero Lead events + tracking quebrado + Shopping queimando budget. Código P1 corrige, mas precisa env vars + UI actions que só user faz.

**How to apply:** Consultar este checklist assim que usuário voltar e mencionar Tocks. Delegar para traffic-masters-chief execução de qualquer coisa que possa ser automatizada.
