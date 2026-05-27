# Bretda — Plano de Correção do Fluxo de Lead — 2026-05-27 (v2 CORRIGIDO)

**Autor:** Orion (chefe de tráfego) · **Para:** founder + @devops + @dev
**Status:** v2 — corrigido após achar o repo deployado real (`apps/bretda-lp`, NÃO `bretda-v2`)

---

## ⚠️ Correção importante vs v1

A v1 deste plano apontava pra `apps/bretda-v2` (form que só faz `window.open` do WhatsApp). **Esse NÃO é o site no ar.** O site deployado é **`apps/bretda-lp`** (tem `/colecao`, `/atelier`, `/encomenda-particular`, API de conversão, Resend, Upstash — bate com o live). O `bretda-v2` é um redesign paralelo não-deployado.

**Consequência:** o fluxo de lead NÃO precisa ser construído — **já existe e é bem-feito**. O que falta é **configuração de variável de ambiente**.

---

## TL;DR

O `bretda-lp` já tem: Server Action que **envia o lead por e-mail pra `contato@bretda.com.br`** (Resend), estado de sucesso in-page, Meta Pixel+CAPI, Google Enhanced Conversions e Google OC (gclid→Upstash). **Mas a conversão do Google é no-op porque faltam 2 env vars.**

**Causa-raiz dos 0 leads/conversões = env vars não setadas na Vercel** (não é código, não é campanha, não é o `/obrigado` 404).

---

## Diagnóstico (AS-IS) — com evidência de código (`apps/bretda-lp`)

### Fluxo real (bem arquitetado)
```
Form /contato (contato-form.tsx)
  → Server Action submitContato (lib/contato-action.ts)
      → sendEmail() → e-mail pra contato@bretda.com.br   [SE RESEND_API_KEY setada; senão loga em stdout]
  → state=success → sucesso IN-PAGE (não usa /obrigado)
      → trackContatoConversion()  → gtag conversion Google   [NO-OP se env vars não setadas] 🔴
      → trackGoogleOcLead()        → /api/google-conversion/lead → gclid+lead no Upstash (p/ upload offline)
      → trackWhatsAppClick()       → GA generate_lead + Meta Pixel + CAPI (/api/meta-conversion)
```

### A trava (evidência)
| Arquivo | Linha | Achado |
|---|---|---|
| `src/lib/tracking.ts` | 67 | comentário: *"no-op when env vars unset **(current state)**"* |
| `src/lib/tracking.ts` | 239-248 | `if (!NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID \|\| !..._LABEL) return;` → **conversão não dispara** |
| `src/components/analytics.tsx` | 25,43-44 | `gtag('config','AW-...')` só roda se `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` setada |
| `src/lib/contato-action.ts` | 88-91 | e-mail vai pra `contato@bretda.com.br` via Resend — **só envia se `RESEND_API_KEY` setada**, senão loga em stdout (lead some) |
| `src/lib/contato-action.ts` | 17 | TODO: *"Add CRM persistence (Supabase leads table) so leads are durable"* — **não construído** |
| `.env.example` | — | lista só `RESEND_API_KEY`, `UPSTASH_REDIS_REST_*` — **não lista as vars Google Ads** (forte sinal de que nunca foram setadas) |

### Por que NÃO é o /obrigado nem a campanha
- O form mostra **sucesso in-page** (contato-form.tsx 91-148) — nunca navega pra `/obrigado`. A conversão antiga URL-based `Lead - Pagina Obrigado` (7571079256) está **obsoleta** pra esse site.
- A conta não gastar (R$0/semana) é problema **separado** (demanda/QS + orçamento) — ver [[session_bretda_google_fix_27mai]].

---

## Plano de correção (config, não build)

### FASE 0 — Auditar env vars na Vercel (founder/@devops, ~15min) 🔴
Confirmar QUAL projeto Vercel serve `bretda.com.br` e quais destas estão **setadas em produção**:
| Var | Função | Suspeita |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` (AW-…) | habilita tag Google Ads + conversão | 🔴 **faltando** |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | label do goal de lead | 🔴 **faltando** |
| `RESEND_API_KEY` | envio do lead por e-mail | ⚠️ verificar (senão lead só vai pra stdout) |
| `GTM_ID` / `META_PIXEL_ID` (constants.ts) | loader gtag + pixel | ⚠️ conferir valores reais |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` (G-…) | GA4 (opcional) | ⚠️ |
| `UPSTASH_REDIS_REST_URL/TOKEN` | OC lead store | ⚠️ |
| env do `/api/meta-conversion` (CAPI token, `BRETDA_TIER_VALUE_MAP`) | CAPI server-side | ⚠️ |

### FASE 1 — Setar as env vars + redeploy (founder/@devops) 🔴 P0 — **destrava a medição**
**Valores exatos (extraídos da API 27/Mai — tag_snippets):**
```
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-16757160810
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=wJpBCMGohK4cEOr2t7Y-
```
> O label acima é da conversão **`Bretda Lead Form Submit (Web)`** (id 7612732481) — a conversão por EVENTO, que é o que o `trackContatoConversion` dispara no sucesso do form. **NÃO** usar o label da `Lead - Pagina Obrigado` (`APUICNiAlpocEOr2t7Y-`, id 7571079256) — essa é URL-based em `/obrigado` (morta).

- [ ] Setar as 2 vars acima na Vercel (prod) → **redeploy** (vars `NEXT_PUBLIC_*` entram no bundle no build — salvar não basta)
- [x] ✅ **FEITO 27/Mai:** vars setadas + redeploy `bretda-ap2bnxwdw` aliased em www.bretda.com.br; `AW-16757160810` + `allow_enhanced_conversions` verificados no HTML servido. Conversão já dispara no envio do form.
- [ ] ~~`RESEND_API_KEY`~~ — **DESCARTADO** (founder escolheu "WhatsApp basta", sem e-mail)
- [ ] Confirmar Meta CAPI (`METAAPI_*` já setadas) + Upstash (✅ setadas) — OK

### FASE 2 — Limpeza das conversões Google Ads (Orion, via API/UI) 🔴
- [ ] Tornar a conversão **por evento** (a do label setado na FASE 1) **PRIMARY** + manter `Bretda Sale Closed (Offline OC)` 7612768697 PRIMARY (valor)
- [ ] Despromover/remover a URL-based `Lead - Pagina Obrigado` (7571079256) — obsoleta (site usa sucesso in-page)
- [ ] **Deletar zumbi `[AGD] Lead` 7138711130 na UI** (codeless, read-only via API)

### FASE 3 — Form abre WhatsApp DIRETO no envio (@dev — DISPATCHED 27/Mai) 🟡
**DECISÃO FOUNDER (27/Mai):** "abrir WhatsApp direto" + "WhatsApp basta" → **e-mail e CRM DESCARTADOS** como destino (não precisa de `RESEND_API_KEY` nem Supabase). O lead chega no WhatsApp do dono.
- [ ] `contato-form.tsx`: no submit → `preventDefault` + montar msg WhatsApp com todos os campos + **disparar conversão (`trackContatoConversion` Google + `trackWhatsAppClick` Meta)** + `window.open` síncrono (anti-popup-block)
- [ ] ⚠️ NÃO regredir o tracking (é o que a FASE 1 acabou de ligar)
- [ ] Git safety: branch a partir do commit de produção `8719876` (NÃO do WIP `feat/configurador-direct-swap`); PR only, sem deploy prod
- **Dispatched:** aios-dev background 27/Mai, branch `fix/contato-whatsapp-direct`

### FASE 4 — Destino dos anúncios (Orion) 🟡
- [ ] Reapontar anúncios de alta intenção de `/` e `/colecao` → `/contato` (ou LP com form acima da dobra) via `google_ads_update_ad_urls`

### FASE 5 — Teste E2E (founder + Orion)
- [ ] Submeter form real com `?gclid=teste` → confirmar: (a) e-mail chega em contato@bretda, (b) lead grava no Supabase (FASE 3), (c) conversão Google aparece (Tag Assistant + UI 24-48h), (d) Meta Pixel/CAPI dispara (Pixel Helper), (e) gclid grava no Upstash

---

## Critérios de aceite (DoD)
1. ✅ Env vars Google Ads setadas na Vercel + redeploy feito
2. ✅ Submeter o form dispara **conversão medida** no Google (e Meta)
3. ✅ Lead chega por **e-mail** (Resend ativo) **e** grava no **CRM/Supabase**
4. ✅ Conversão PRIMARY = evento (não URL morta); zumbi codeless removido
5. ✅ Teste E2E passa nos 2 canais

## Matriz de responsáveis
| Fase | Owner | Bloqueia |
|---|---|---|
| 0 Auditar env | founder/@devops | tudo |
| 1 Setar env + redeploy | founder/@devops | 2, 5 — **é A correção principal** |
| 2 Limpeza conversões | Orion | 5 |
| 3 CRM persistence | @dev | — |
| 4 Destino anúncios | Orion | — |
| 5 Teste E2E | founder + Orion | — |

## Riscos
- `NEXT_PUBLIC_*` entram no bundle **em build** → tem que **redeployar** após setar (não basta salvar a var).
- Conversão por evento leva 24-48h pra refletir no Google → não declarar "resolvido" antes.
- Confirmar a fonte deployada na Vercel antes de editar qualquer coisa (v1 errou o repo).

## Cross-platform (Meta)
Mesmo conserto de env (Pixel ID + CAPI token + value map) fecha o elo do [[session_bretda_no_form_leak_27mai]]. Um pacote de env vars conserta os dois canais.

---

## Resumo de uma linha
**Não é código nem campanha — é setar `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` + `_LABEL` (e confirmar `RESEND_API_KEY`) na Vercel e redeployar.** O resto (CRM, destino de anúncio) é melhoria.
