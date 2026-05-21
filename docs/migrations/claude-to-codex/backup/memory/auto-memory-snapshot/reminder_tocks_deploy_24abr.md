---
name: Tocks Tracking Deploy Amanhã 24/Abr
description: Runbook pronto pra user executar nos dashboards (Railway + Supabase + Cloudflare) em 15-20 min. Deploy do apps/tocks-tracking extraído hoje 23/Abr
type: project
originSessionId: e5b84a88-3615-4c11-ab42-3ecd9d9dc6ab
---
# 🔴 Pendente desde 24/Abr — STATUS 01/Mai: AINDA PARADO + OAuth EXPIRADO

## Update 01/Mai (sessão verify)
User pediu pra "verificar ads chegam ao site". Diagnóstico fresh confirmou: **mesmo problema, 8 dias depois, zero progresso**.
- Google Ads 7d: R$525,77 spend, 147 cliques, **0 conversões**
- `tracking.tockscustom.com.br` DNS não resolve (CNAME nunca criado)
- GTM `GTM-P4DNHJTK` carrega no site mas **sem eventos AddToCart/Purchase/Checkout** (precisa dev Tray)
- **Token OAuth Google EXPIRADO** (`invalid_grant`) — bloqueador novo desde 29/Abr expiry
- Pre-flight feito 01/Mai: 46/46 testes passam, secret `TRAY_WEBHOOK_SECRET=74e52c77eddd927d7d008a8b077ccfc89f40d330ce63ecf5c0e1d7a814a39559` plantado em `.env.production.local`
- User pausou sessão pra mudar de projeto antes de escolher caminho A (Railway CLI) ou B (GitHub push isolado)
- Detalhes: `session_tocks_verify_01mai.md`

## Status original 24/Abr
Tudo preparado. User escolheu adiar execução (sem urgência — Shopping Google já pausado, sangria cortada).

## Arquivos prontos
- **Runbook**: `D:/AIOS/docs/runbooks/tocks-tracking-deploy.md` (330 linhas pt-BR, dashboard-first)
- **Secrets local**: `D:/AIOS/apps/tocks-tracking/.env.production.local` (gitignored, prontos copy-paste)
- **Briefing dev Tray**: `D:/AIOS/docs/projects/tocks-tray-tracking-briefing.md`
- **Commit local** (não-pushed): `6c2bc08c` — `feat(tocks): extract tracking standalone + QA fixes [S-TOCKS-TRACK-FIX-001]` (31 arquivos, 8769 insertions)

## Checklist 7 passos (~15-20 min)
1. Railway → New project from GitHub → Root `apps/tocks-tracking` → Deploy
2. Railway → Variables → colar do `.env.production.local` + gerar `TRAY_WEBHOOK_SECRET=$(openssl rand -hex 32)`
3. Supabase SQL Editor (`spiwgzahtmlvpuqgwehc`) → colar `005_gclid_captures.sql` → Run + sanity queries
4. Cloudflare → DNS → CNAME `tracking` → URL Railway → **Proxied (orange)**
5. Railway → Settings → Networking → Custom domain `tracking.tockscustom.com.br`
6. Smoke tests (curl /health + POST /api/capture-gclid mock + verificar Supabase gravou)
7. Signal/WhatsApp: enviar URL + secret + link briefing pro dev externo Tray (NÃO email)

## Pendências pós-deploy
- Push estratégia: fork A1 OU main direto (36 ahead / 65 behind origin/main — decidir)
- Reauth Google OAuth antes de ~29/Abr (`D:/jarvis/mcp-ads-bridge/scripts/reauth-with-sheets.cjs`)
- Monitorar 48h logs `capture_gclid.ok` + `google_ads.conversions.uploaded`
- Após dev Tray executar briefing + 48h dados limpos → **remover Page_View (7540774791) de Primary** no Google Ads UI (via MCP `google_ads_set_conversion_priority`)

## Contexto root cause (não perder)
"Queda 50→3 conv" era FALSO ALARME — divergência `conversions` vs `allConversions`. Root cause REAL: tags Google Ads AddToCart/BeginCheckout/Purchase NUNCA foram instaladas no GTM (`GTM-P4DNHJTK`) do site Tray. Label `TGd-CMr4h9caEN7ckoBA` dispara em page_view = 713 fires/14d envenenando Smart Bidding há semanas. Meta Pixel OK (50/50 CAPI Tray funcionando). Checkout Tray é cross-domain (`checkout.tray.com.br`) — Purchase só capturável via Offline Upload (server-side).
