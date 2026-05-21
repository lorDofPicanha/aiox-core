---
name: Sessão Tocks Verificação Tracking 01/Mai
description: Diagnóstico fresh do problema "ads não chegam ao site" — confirma que o root cause de 23/Abr não foi resolvido. Backend tocks-tracking ainda não deployado, OAuth Google expirado, GTM Tray sem tags de e-commerce. Pre-flight feito mas user pausou pra mudar de projeto.
type: project
originSessionId: 5812b244-6a76-4652-9aa0-0c93bdde2339
---
# Sessão Tocks — Verificação "ads chegam ao site?" (01/Mai)

## Trigger
User: "estou com um problema nos ads da tocks, verifique se eles estão chegando no site, o vorza e a bretda estavam com este problema"

## Diagnóstico (fresh pull 30/Abr-01/Mai)

### Google Ads 7d — sangria silenciosa
- Spend: **R$ 525,77** / 147 cliques / **0 conversões** / ROAS 0,00
- Conversion actions ENABLED mas só `Visualização-Página - CLICK` (7540774791) dispara
- `Compras Loja Tray Tocks` (7161904202), `Adicionar carrinho - CLICK` (7540631965), `Iniciar finalização - CLICK` (7540631968), `[LEAD] COMPRA WHATSAPP SITE` (7382426793), `Lead Qualificado Tocks` (7550396040 UPLOAD_CLICKS) — todas 0 fires há semanas

### Site `www.tockscustom.com.br` (loja Tray) — HTML cru
- ✅ GTM `GTM-P4DNHJTK` carrega
- ✅ GA4 `G-CT04S2PTT2` carrega
- ❌ ZERO eventos `AddToCart`/`Purchase`/`InitiateCheckout` no HTML
- ❌ ZERO captura de `gclid` na URL
- ❌ Nenhum `AW-*` direto (depende do GTM injetar — não injeta)

### Backend `tracking.tockscustom.com.br`
- DNS não resolve (HTTP=000) — **CNAME nunca foi criado**
- Runbook 24/Abr (`docs/runbooks/tocks-tracking-deploy.md`) **intocado** desde 23/Abr

### Meta Ads — situação OK (não é o problema)
- Pixel `1382948639707224` last_fired 2026-04-29 20:53 ✅
- Ads são `OUTCOME_ENGAGEMENT` (Click-to-WhatsApp) → link_click vai pro `wa.me` por design, não pro site
- Monaco SS winner: 411 link_clicks → 49 onsite_conversion.total_messaging_connection (esperado pro formato)

### Conclusão
**Mesmo problema diagnosticado em 23/Abr (`session_tocks_pos_viagem_23abr`). Nada foi resolvido nesses 8 dias.** Tags Google Ads de e-commerce NUNCA foram instaladas no GTM Tray, e o workaround (offline upload via backend `tocks-tracking`) não foi deployado.

## Pre-flight executado pelo Orion (antes do user pausar)

1. ✅ Validado commit `6c2bc08c` ainda intacto na branch atual `feat/redesign-foundation-tokens` (mas branch poluída com 46 commits + arquivos Bretda redesign WIP — **push direto seria desastre**)
2. ✅ `apps/tocks-tracking/` íntegro (31 arquivos do commit, deps instaladas)
3. ✅ Migration `005_gclid_captures.sql` pronta (5K)
4. ✅ Dockerfile + railway.toml prontos
5. ✅ **46/46 testes passam** (vitest)
6. ✅ `TRAY_WEBHOOK_SECRET` gerado: `74e52c77eddd927d7d008a8b077ccfc89f40d330ce63ecf5c0e1d7a814a39559` — **plantado em** `apps/tocks-tracking/.env.production.local` (gitignored)
7. ❌ **Token Google Ads OAuth EXPIRADO** — `invalid_grant` confirmado via POST oauth2.googleapis.com/token. Memory previu (expira ~29/Abr Testing mode). Reauth precisa user no browser:
   ```
   ! node D:/jarvis/mcp-ads-bridge/scripts/reauth-with-sheets.cjs
   ```
   Login com `contato@tockscustom.com.br`. Após reauth, copiar novo `GOOGLE_ADS_REFRESH_TOKEN` de `D:/jarvis/mcp-ads-bridge/.env` pra `apps/tocks-tracking/.env.production.local` linha 38.

## Decisão pendente (não tomada — user pausou)

**Como fazer o código chegar no Railway?**

- **A) Railway CLI** (`railway login` + `railway up` da pasta) — bypassa GitHub, ~10 min, zero risco de vazar Bretda WIP
- **B) GitHub push isolado via @devops** — branch nova `feat/tocks-tracking-deploy` com SÓ commit `6c2bc08c` em cima de `origin/main`, push fork pessoal `lorDofPicanha/aiox-core`, Railway aponta — mais "kosher" mas ~15 min

User não escolheu. Sessão pausada.

## Sequência completa (quando retomar)

1. **User:** rodar reauth Google (`! node D:/jarvis/mcp-ads-bridge/scripts/reauth-with-sheets.cjs`)
2. **Orion:** ler novo refresh token, atualizar `.env.production.local` linha 38
3. **User:** escolher A ou B
4. **Orion/@devops:** executar deploy
5. **User browser (~5 min total):** Supabase SQL editor (paste `005_gclid_captures.sql`) + Cloudflare CNAME `tracking → Railway URL` proxied + Railway custom domain `tracking.tockscustom.com.br`
6. **Orion:** smoke tests via curl (`/health`, `/api/capture-gclid`, CORS reject, HMAC reject)

## Decisões pendentes pós-deploy
- Após backend live + 48h dados → **remover Page_View (7540774791) de Primary** no Google Ads UI (via MCP `google_ads_set_conversion_priority`)
- Briefar dev externo Tray pra adicionar AddToCart/Purchase/BeginCheckout no GTM-P4DNHJTK (sem isso, mesmo com backend, faltam eventos de carrinho — escopo C do diagnóstico)

## Stop-loss alternativo (se deploy adiar mais)
Pausar Google Ads Tocks até backend live. Tá queimando ~R$75/dia sem feedback (525,77/7d ÷ 7).

## Arquivos relevantes
- `D:/AIOS/apps/tocks-tracking/.env.production.local` — secrets prontos com webhook secret novo
- `D:/AIOS/docs/runbooks/tocks-tracking-deploy.md` — runbook 7-passos
- `D:/AIOS/docs/projects/tocks-tray-tracking-briefing.md` — briefing dev Tray
- `D:/AIOS/docs/stories/tocks/S-TOCKS-TRACK-FIX-001.md` — story QA'd
- Commit local não-pushed: `6c2bc08c07cbdfc90e3febcc1cd44416016e15c7`
