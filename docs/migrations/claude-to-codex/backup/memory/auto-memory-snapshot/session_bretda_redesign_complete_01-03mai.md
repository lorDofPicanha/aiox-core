---
name: Bretda Redesign + Traffic Ops — Sessão completa 30/Abr-03/Mai
description: Site Bretda redesign FULL completo + DNS migration concluída + traffic ops (CAPI + EC + Google Ads) parcialmente ativados. Site novo LIVE em bretda.com.br. CAPI gated em user actions pendentes.
type: project
originSessionId: 89ef72d8-a25d-4b87-b1bd-9d1d5e777a99
---
# Bretda Redesign + Traffic Ops — Estado Final (03/Mai 2026)

## TL;DR

Site novo Bretda **LIVE em https://bretda.com.br** após 5 rounds de iteração + 3 rounds de fixes específicos + DNS migration. CAPI Meta + Enhanced Conversions Google **implementados** mas inativos aguardando user actions.

## Status site

- **URL produção:** https://bretda.com.br (apex 307 → www) ✅
- **URL deploy:** https://bretda-lp.vercel.app ✅
- **Repo:** `D:/AIOS/apps/bretda-lp/` HEAD `9cc6795`
- **Vercel project:** `bretda-lp` (`prj_zy9WRY6Qd6PFyb2FeS1UW4WbDwCM`, team `team_qnf7ZEWxKPtO81Vy5zXc2AkO`)
- **Stack:** Next 16.2.4 Turbopack + Tailwind v4 + TAN Aegean + Century Gothic
- **Site antigo (`prototype` Vercel project):** dormente (domain transferido out, deploy ainda existe pra rollback ~30 dias)
- **Backup completo site antigo:** `D:/AIOS/backups/bretda-old-site-20260501/` (131MB, 183 files)

## Brand truth aplicada (não-negociável, não inventar)

- **Cidade:** Santa Catarina (NÃO Itajaí, NÃO Blumenau — user explicito 01/Mai)
- **Cores oficiais:** champagne `#C9A979` · charcoal warm `#2B2826` · cream `#F5F1EA` · ink `#0A0A0A` · walnut `#4A3426`
- **Fontes:** TAN Aegean (display, woff2 ativo) → Cormorant fallback · Century Gothic (body, 4 weights woff2) → Raleway fallback
- **Atendimento:** segunda a sábado
- **6 modelos sinuca + taglines oficiais (frases-assinatura):**
  - OPAL — *"a pedra que guarda a luz"*
  - AURORA — *"o primeiro raio de luz — não chega, revela"*
  - ÂMBAR — *"algumas peças envelhecem. Outras amadurecem."*
  - CITRINO — *"nada a esconder"*
  - ESPINELA — *"os conhecedores sempre chegam primeiro"*
  - ZURITA — *"gravidade é uma sugestão"*
- **Universe of Play:** Pebolim, Tênis de Mesa, Shuffleboard
- **Sócios reais (vídeos):** Cristine + Rudson
- **Cliente real (depoimento):** Bruna
- **Ticket range:** R$35-120k (NUNCA público — Pivot 10 zero pricing)
- **Hard Constraint #1:** `src/lib/configurador/scene.ts` INTOCÁVEL

## Iteração — rounds aplicados (24 commits)

### Round 1 (audit-fix Phase 1+2) — 30/Abr
- `c8fd70d` Phase 1 assets: 6 reels videos comprimidos (1.4GB→23MB) + 36 Paulinho photos otimizadas
- `3e05136` Phase 2 code: SSR bug fix `[data-reveal]` + palette flip dark→cream + ornament cut + reels integration

### Round 2 (brand truth) — 30/Abr
- `47a7ace` Itajaí → Santa Catarina (14 arquivos)
- `1f6df50` Cores oficiais + font stack TAN Aegean
- `963132a` Logos SVG oficiais (Navbar + Footer)
- `b6ca5df` 6 narrativas-assinatura modelos
- `64fdb98` Cristine sócia + Rudson sócio + Bruna cliente
- `3f27803` Vídeo Opal detalhe

### Round 3 — 01/Mai
- `0642af1` /colecao replica layout antigo bretda.com.br/catalogo
- `e93e51c` Acabamentos tiles 80→140px + 2 placeholders inox removidos
- `3258413` Miniaturas mesa sem fundo (sharp luminance threshold)
- `aae3910` Mascarar texto burned-in vídeo design-process

### Round 4 — 01/Mai
- `aadbf68` Configurador swatches Madeira/Metal cor restaurada
- `34ee5f1` Cards listing /colecao estática (sem fade-cycle stacking)
- `4320f39` Galeria detalhe wipe + 36 renders Paulinho re-uploaded
- `c476090` Home cards mesa sem fundo (PNG transparente)
- `89fab5c` Atelier ambientes grid 16:9 (validated Playwright)

### Round 5 — 01/Mai
- `672749c` Renders dedicados por variante (pebolim/tênis/shuffle ≠ sinuca) + Espinela
- `15bff2f` Hero typography overlap fix (88→60px + line-height 1.22)
- `1279119` Cleanup orphan assets Tocks/Vorza/legacy ads (266M→86M public/)

### Traffic ops — 03/Mai
- `83d4657` CAPI rate limit MVP (Upstash 20/min) + CORS + Lead-only filter
- `1d751eb` Google Tag base + Enhanced Conversions config
- `9cc6795` EC hash email+phone no form submit /contato

## DNS migration (01/Mai)

**Fase 1 (backup):** ✅ wget mirror completo `D:/AIOS/backups/bretda-old-site-20260501/`

**Fase 2 (DNS switch):** ⚠️ rocky path — squad fez `vercel alias rm` removendo do projeto antigo `prototype` ANTES de confirmar add no novo, deu 403 `domain_not_owned` (CLI). User resolveu via Vercel Dashboard com botão "Move 2 domains" (apex + www).

**Fase 3 (deletar antigo):** ⏸️ pendente — recomendação: manter `prototype` dormente 30 dias como insurance.

## Traffic ops — 03/Mai

### Pixel client-side ✅
`fbq('track','PageView')` auto-fire via `<Analytics />` em layout root. **CORREÇÃO 05/Mai (audit live):** Pixel canon Bretda site novo = **`3348133485496539`** (verificado em 5/5 pages, GTM-5NZTM5L6, single PageView fire, CAPI LIVE com fbtraces Ap7Jy/A9ay5 per `session_bretda_capi_lp_pr18_04mai.md`). Pixel `1130704285486234` é obsoleto, 0 ocorrências no site live. Confusão veio de memória 03/Mai pré-deploy CAPI.

### CAPI server-side ⏸️ aguardando user
- **Code:** rate limit Upstash + CORS whitelist + Lead-only filter implementado em `src/app/api/meta-conversion/route.ts`
- **Env vars Vercel já setadas:** `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (user passou Upstash creds 03/Mai)
- **Pendente user:**
  - System User Token Meta (System User ID `61578657552599`, gera token via BM > Settings > Users > System Users > Generate New Token, permissions `ads_management` + `business_management`)
  - METAAPI_TEST_EVENT_CODE (opcional, Meta Events Manager > pixel > Test Events tab)
- **Pendente Orion:** após token, `vercel env add METAAPI_ACCESS_TOKEN production` (sensitive) + `vercel env add METAAPI_PIXEL_ID production` (`1130704285486234`) + redeploy + smoke test 4 cenários (CORS forge / rate limit / Lead-only / health-check)

### Enhanced Conversions Google ⏸️ aguardando user
- **Code:** gtag.js + SHA-256 hash email/phone client-side no submit /contato
- **Pendente user:**
  - `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` (Google Ads UI > Tools > Conversions, formato `AW-XXXXXXXXX`)
  - `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (opcional, GA4 admin)
  - Setup Google Ads UI: Conversions > Lead goal > "Turn on enhanced conversions" > "Google Ads tag" > aceita Customer Data Terms
- **Pendente Orion:** após user fornecer IDs, `vercel env add` 3 vars + redeploy

### Google Ads campaigns ⏸️ aguardando MCP + user
- **Status:** PAUSED desde 29/Abr (CPL doubled R$5,21→R$10,73 / Search IS 10%)
- **Bloqueador #1:** rotas antigas em RSAs apontam pra 404 — `/catalogo`, `/produtos`, `/orcamento`, `/produto/{slug}`. Mapping documentado em `docs/projects/bretda-redesign/20-capi-activation/04-google-ads-url-audit.md` (12 SKUs novos + 5 rotas)
- **Bloqueador #2:** MCP `mcp-ads-bridge` indisponível na sessão atual (docker-gateway DOWN ou tools não exposed). Próxima sessão precisa verificar.
- **Bloqueador #3:** OAuth Testing 7d expira ~06/Mai. Doc OAuth promotion Testing→Production em `05-oauth-promotion.md` (~15-25min user ação Google Cloud Console).

### Caminho aprovado por user (01/Mai)

> **CAPI:** Caminho C — Mini PR rate limit MVP + CAPI Lead-only ativação (não esperar PR5 LGPD banner completo)
> **Google Ads:** Híbrido — URL audit hoje, manter PAUSED até CAPI live + EC implementado

## Routine cloud Bretda

`trig_01MGmkrmC15xUof9naA72bDV` agendada pra 01/Mai 21h BRT — gate +48h CJ8v2 audit. Não verificado se rodou. Ver memória anterior `session_bretda_tactical_30abr.md`.

## Pendências consolidadas pra próxima sessão

### User actions
1. Gerar System User Token Meta
2. Test Event Code Meta (opcional)
3. Google Ads Conversion ID + Label
4. GA4 Measurement ID (opcional)
5. OAuth Google Testing→Production (janela crítica antes 06/Mai expiry)
6. Google Ads UI: Enhanced Conversions setup (turn on + aceitar Customer Data Terms)

### Orion actions
1. Quando user fornecer System User Token: `vercel env add` 2-3 vars + redeploy + smoke test CAPI
2. Quando user fornecer Google Ads IDs: `vercel env add` 3 vars + redeploy + smoke test EC
3. Despachar agent com MCP `mcp-ads-bridge` ativo (verificar docker-gateway primeiro):
   - Inventory ads + URLs legadas
   - Recreate-and-pause RSAs com URLs novas
   - Update sitelinks in-place
   - Smoke test cada URL nova
   - Search IS audit (Lost-IS-Rank vs Budget)
   - Search Terms review + negativos
4. Após tudo pronto: unpause campanha (~1-2 dias depois start)

### Sprint 2 backlog
- PR5 LGPD completo: cookie consent banner global + `/api/privacy/forget` + revisão Patricia Peck `/legal/privacidade`
- HMAC client signature CAPI
- Comissionar orbit videos pra 7 SKUs (Aurora/Espinela/Citrino/Zurita/Opal/Cobal/Berilo)
- Comissionar fotos Pebolim/Tênis/Shuffle reais (Berilo/Cobal sem renders)
- Comissionar b-roll text-free pra `eleven-customization-section.tsx` (atual `design-process-1080.mp4` tem texto burned-in mascarado por gradient)
- Detail page hero `/colecao/[slug]` ainda usa lifestyleImage da família — variantes pebolim/tênis/shuffle precisam fotos dedicadas
- Cleanup orphans: ConfiguradorWrapper + ConfiguradorLuxuryPanel + ViewerColumn + ActCard + CraftGlyph + EncomendaParticularForm (não importados após Round 4 cleanup)

## Memórias importantes (paths absolutos)

- `D:/AIOS/apps/bretda-lp/.claude/agent-memory/aios-dev/feedback_bretda_lp_git_reset_hook.md` — auto-reset entre tool calls
- `D:/AIOS/apps/bretda-lp/.claude/agent-memory/aios-dev/feedback_threejs_async_constructor_race.md` — scene.ts race condition
- `D:/AIOS/apps/bretda-lp/.claude/agent-memory/aios-devops/feedback_vercel_external_domain_migration.md` — NUNCA `vercel alias rm` em domínio externo `.com.br` antes de confirmar `alias set` destino
- `D:/AIOS/apps/bretda-lp/.claude/agent-memory/aios-dev/bretda_capi_caminho_c_30abr.md` — CAPI rate limit MVP decisões

## Lições críticas

1. **Squad valida via Playwright antes de declarar pronto** — user repetidamente recebeu "está pronto" e abriu vendo quebrado. Round 4.9 instituiu regra rígida: build → Playwright screenshot → inspect → só então commit.
2. **Domínios `.com.br` externos não são "team-owned" no Vercel CLI** — sempre transferir via Dashboard quando há conflict, não tentar CLI alias rm/set.
3. **Auto-replicação do site antigo é OK** (mesma marca, mesmo dono) — Round 3 replicou layout `/catalogo` antigo no novo `/colecao`.
4. **Fontes commerciais (TAN Aegean) requerem .woff2 explicit @font-face** — `next/font/google` variables sobrescrevem `--font-display` silenciosamente. Round 4 fix renomeou pra `--font-display-fallback`.
5. **Brand truth descoberta tardiamente** (`D:/Bretda_CustomGPT_Knowledge/`) corrigiu cidade Itajaí→SC, cores `#B89968`→`#C9A979`, fontes Cormorant/Raleway→TAN/Century, narrativas inventadas→6 frases oficiais. **Pra Sprint 2:** sempre auditar brand book ANTES de implementar.
