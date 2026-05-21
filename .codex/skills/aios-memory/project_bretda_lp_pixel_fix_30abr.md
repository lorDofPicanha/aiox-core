---
name: Bretda LP Pixel Híbrido + CAPI — Caminho A LIVE + B code-ready 30/Abr
description: Caminho A (Pixel PageView auto-fire LGPD híbrido) DEPLOYED em bretda.com.br + 5 subpages. Caminho B (CAPI server-side) já implementado desde 23/Abr (Edge function dual-fire), só falta gerar System User Token no BM Bretda + plugar Vercel env.
type: project
originSessionId: a0acc2a9-03cf-4a25-b1f0-434eaf42c505
---
# Bretda LP Pixel Híbrido + CAPI — 30/Abr/2026

## Problema original
Bretda LP view rate 13% (memory previously flagada). Root cause: `fbq('track', 'PageView')` gated por consent banner LGPD. 87% dos cliques pagos não disparavam PageView → Meta otimizando algoritmo às cegas → CPL inflado nos 4 ads novos AD09-13.

## Solução combinada A + B (user aprovou)

### Caminho A — Pixel PageView auto-fire híbrido LGPD ✅ DEPLOYED

**Architecture:** PageView base dispara automático no init (legítimo interesse Art. 7 IX LGPD, equivalente a logs de servidor). Eventos enriquecidos PII-rich (ViewContent, Lead, Purchase) seguem gated por consent banner (Art. 7 I — Google Consent Mode v2 preservado).

**8 arquivos editados** em `D:\AIOS\docs\projects\bretda-landingpage\prototype\`:
- `index.html` — `fbq('track', 'PageView')` adicionado linha 33
- `lp-ads.html` (rewrites `/mesa-bilhar-jantar` + `/mesa-bilhar-luxo`)
- `catalogo.html`
- `configurador.html`
- `contato.html`
- `produto.html` (rewrite `/mesas/:modelo`)
- `privacidade.html` — Pixel + texto LGPD novo + tabela bases legais splittada (PageView Art. 7 IX vs eventos enriquecidos Art. 7 I)
- `bretda-consent.js` — removido `fbq('consent', 'revoke')` agressivo do load + tirou `fbq('track', 'PageView')` do `applyConsent` (já dispara auto)

**Não tocados (intencionais):** Google Consent Mode v2, banner cookieconsent visual, `<noscript>` fallback, `window.bretdaConsent.revoke()` API LGPD Art. 18 VIII

**Deploy:** `vercel --prod --yes` em `prototype/` — confirmed via curl raw HTML linha 33 `fbq('track', 'PageView');`

**Resultado esperado:** LP view rate sobe de 13% → 80-95% nos próximos 24-72h. Meta re-otimiza adset CJ8v2 baseado em sinal limpo. CPL pode cair 20-40% nos AD09-13.

### Caminho B — CAPI server-side ✅ CODE READY (aguarda token)

**Plot twist:** Endpoint `api/meta-capi.js` (Edge runtime, 10.4KB) **já estava implementado** desde 23/Abr (sprint D6 Bretda). Memory tinha "D2 CAPI handoff @aios-dev" pendente porque o **token Meta CAPI nunca foi gerado/plugado**, não porque código faltava.

**Já implementado (não criei):**
- `api/meta-capi.js` — Edge function, Origin allowlist, rate limit 200/min, hash SHA-256 (email/phone normalizado E.164 BR), schema validation, structured logs sem PII
- `bretda-tracking.js` — dual-fire client (`window.bretdaTracking.trackEvent`) com `event_id` UUID v4 compartilhado entre Pixel + CAPI pra dedup. Auto-wired:
  - WhatsApp click `<a href*="wa.me">` → `Contact` event
  - Form submit (latente) → `Lead` event com value=33000 BRL
  - `produto.html` ou `/mesas/:slug` → `ViewContent`
- `vercel.json` — headers `/api/*` já com `Cache-Control: no-store` + `X-Robots-Tag: noindex`

**Criados nesta sessão (gap real era doc + security):**
- `prototype/.env.example` — template 3 env vars
- `prototype/api/README.md` (8.7KB) — setup BM Bretda 5 steps + curl test + status codes + dedup validation
- `prototype/.gitignore` — adicionado `.env*` (proteção secrets)

## ⚠️ AÇÃO USER PENDENTE pra ativar CAPI

```bash
# 1. Gerar System User Token no BM Bretda
# business.facebook.com → Configurações do negócio
#   → Usuários do sistema → Adicionar (Admin)
#   → Atribuir ativos → Pixel 3348133485496539 (permissão "Gerenciar Pixel")
#   → Gerar token (escopo: ads_management)
#   → COPIAR (UMA VEZ só)

# 2. Plugar no Vercel env
cd "D:/AIOS/docs/projects/bretda-landingpage/prototype"
vercel env add META_PIXEL_ID production
# paste: 3348133485496539

vercel env add META_CAPI_TOKEN production
# paste: <token step 1>
# Mark as SENSITIVE no Vercel UI

# 3. Redeploy pra env vars pegarem
vercel --prod --yes

# 4. Smoke test (curl em api/README.md)
```

## Decisões importantes documentadas

### Por que NÃO pediu pivot completo de funnel
Bretda CTA principal é WhatsApp click (sem form HTML real). Mapping canônico já implementado:
- `Contact` = WhatsApp click (lower friction, lower intent)
- `Lead` = form submit (latente, ativa quando form for adicionado)
- `ViewContent` = visualizou modelo específico (decision-relevant, value=R$33k)

Match Meta taxonomy oficial. Não precisa pivotar.

### Por que /api/meta-capi (não /api/capi)
Endpoint já cabeado em `bretda-tracking.js:12` (`CAPI_ENDPOINT = '/api/meta-capi'`). Renomear quebraria dual-fire em prod.

### Por que Edge runtime (não Node)
Cold start ~50ms vs ~500ms Node, half cost, Vercel preferred. `crypto.subtle.digest('SHA-256')` produz hex idêntico ao Node `crypto.createHash`.

### Por que Meta API v19.0 (não v21.0)
v19.0 é stable até pelo menos 2027. v21.0 não introduz breaking changes pro use case Bretda (sem app events, sem in-app purchases, sem Lead Ads forms).

## Estado memory pré-sessão (corrigido)

Memory previamente dizia "D2 CAPI handoff @aios-dev" pendente. **Agora corrigir mental model:** CAPI Bretda code está implementado e em prod desde 23/Abr. O que falta é só:
1. User gerar System User Token no BM Bretda (~3min)
2. `vercel env add META_CAPI_TOKEN production` (~1min)
3. Redeploy (`vercel --prod --yes`) — automático

Total: ~5min de ação user pra ativar CAPI completo.

## Smoke test após ativação

```bash
EVENT_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
curl -X POST https://www.bretda.com.br/api/meta-capi \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.bretda.com.br" \
  -d "{\"schema_version\":\"1.0\",\"event_name\":\"Lead\",\"event_id\":\"$EVENT_ID\",\"event_time\":$(date +%s),\"event_source_url\":\"https://www.bretda.com.br/contato\",\"user_data\":{\"email\":\"test@bretda.com.br\",\"phone\":\"+5547992259554\"},\"custom_data\":{\"value\":33000,\"currency\":\"BRL\"}}"

# Expected: {"success":true,"event_id":"<uuid>","events_received":1,"fbtrace_id":"..."}

# Validar dedup: business.facebook.com/events_manager2/list/pixel/3348133485496539
# Test Events tab → evento aparece → match score target ≥6.0
```

## Reference paths

- `D:/AIOS/docs/projects/bretda-landingpage/prototype/api/meta-capi.js` — Edge function CAPI
- `D:/AIOS/docs/projects/bretda-landingpage/prototype/api/README.md` — setup + testing
- `D:/AIOS/docs/projects/bretda-landingpage/prototype/.env.example` — template env vars
- `D:/AIOS/docs/projects/bretda-landingpage/prototype/bretda-tracking.js` — dual-fire client
- `D:/AIOS/docs/projects/bretda-landingpage/prototype/bretda-consent.js` — LGPD gate (eventos enriquecidos só)

## Quando user voltar e mandar "ativa capi bretda"

1. Eu pergunto se o System User Token já foi gerado no BM
2. Se sim, eu rodo `vercel env add` (user cola o token quando prompted) + redeploy
3. Smoke test via curl
4. Validar dedup no Events Manager
