# MASTER SYNTHESIS — Bretda Mega-Audit 2026-05-15

**Orchestrator:** Orion (aios-master) · **Source audits:** 4 parallel reports converging
**Audience:** Breno (owner) — para aprovação ANTES de qualquer commit
**Constraint absoluto invocado:** `.out-of-scope/luxury-redesign-without-benchmark.md` (4ª falha não-pode-acontecer)

---

## TL;DR — Resposta direta à pergunta "vamos arrumar o site da Bretda"

**O site não está pronto. Mas o caminho de fix é claro e cabe em 2-3 sprints (~40h dev + 1-2 dias produto).**

| Fonte | Verdict | Score |
|-------|---------|-------|
| QA Audit (Quinn) | **FAIL** | 52/100 — 4 P0 blockers técnicos |
| Design Audit (Uma) | **NEEDS_REDESIGN_PHASE0** | 42/100 — 6/14 Non-Negotiables violadas |
| Conclave 8 clones (Atlas) | **Subtração + gates ANTES de redesign** | CONSENSUS 5/8 pontos |
| HYDRA Research | **Reforça regras existentes** | 7 patterns aplicáveis |

**Conclusão única e convergente:** *Subtração + gates + observability ANTES de qualquer novo redesign visual.* Reverter o pattern atual de **adicionar → polir → re-redesign**.

---

## 1. Causa-raiz tripla do "site mal feito"

Os 4 audits, executados em paralelo e sem ler-se mutuamente, **chegaram à mesma conclusão por 3 ângulos diferentes**:

### Ângulo 1 — Visual (Uma)
30/Abr fez **token swap + copy rewrite** (corretos) mas **dobrou section count** (3 → 7) e violou 6 dos 14 Non-Negotiables do próprio conclave de Abr/2026:
- N1 (3 sections → 7 entregues)
- N2 (hero zero-headline → hero com 5+ elementos)
- N3 (StatsSection deletada → só relocada, repetida 3×)
- N5 (1 CTA primário → 1 CTA + nav `Conversar` + WhatsApp FAB)
- N9 (1 accent champagne/viewport → 6× só no hero)
- N10 (lifestyle JPGs → cutout PNG silhouettes — pior direção possível)

### Ângulo 2 — Técnico (Quinn)
Site shipping com **fundação quebrada**:
- Zero error boundaries (qualquer falha = tela branca anti-luxury)
- 25 lint errors em `configurador-3d.tsx` (asset luxury #1)
- Zero Sentry / error tracking (MTTR = ∞)
- ~0,9% test coverage (1 spec / 69 testáveis)
- Lint não é gate de build

### Ângulo 3 — Processo (Atlas + HYDRA)
**Anti-pattern AI-overnight squad sem human visual checkpoint:**
- 13 PRs merged em 1 noite (30/Abr) sem revisão visual
- Forsgren: perfil DORA Hi/Lo = pior dos 4 quadrantes (high frequency × low stability)
- HYDRA + research 2026: Stripe Protodash provou que AI deve gerar protótipos PARA revisão humana, não merges diretos
- 4ª falha consecutiva com mesmo pattern documentado em `.out-of-scope/`

---

## 2. Convergência dos audits — top 7 itens onde TODOS concordam

| Item | QA | Design | Conclave | HYDRA |
|------|:--:|:------:|:--------:|:-----:|
| Subtração radical (deletar dead code + sections sobrando) | ✅ P1 | ✅ P0 | ✅ Rams P0 | ✅ AI restraint |
| Quality gates como código (lint+typecheck+a11y+Lighthouse CI) | ✅ P1 | — | ✅ Kim P0 | ✅ Sustainable a11y |
| Observability (Sentry + DORA dashboard) | ✅ P0 | — | ✅ Forsgren P0 | ✅ Process discipline |
| Error boundaries (error.tsx / loading.tsx / not-found.tsx) | ✅ P0 | ⚠️ implícito | ✅ Friedman a11y | — |
| Configurador 3D como asset luxury crítico (não tab) | ✅ P0 lint | ⚠️ implícito | ✅ Anadol P0 | — |
| Veto AI-direct-merge + human visual checkpoint | — | ✅ regra | ✅ Schneider+Forsgren | ✅ Neil Patel + Stripe |
| A11y experiencial 45-65+ (não só WCAG técnico) | ✅ P2 | ⚠️ implícito | ✅ Friedman P1 | ✅ Walter sustainable |

**Esses 7 itens são CONSENSUS — eles fazem o Sprint 0+1+2.**

---

## 3. Plano de execução — 3 sprints

### **Sprint 0** (3 dias) — Stop the bleeding + Subtração

**Goal:** site para de sangrar tecnicamente E visualmente. Gate FAIL → CONCERNS.

| # | Action | File(s) | Source | Effort |
|---|--------|---------|--------|:------:|
| S0.1 | Fix 25 lint errors React-19 ref anti-pattern | `apps/bretda-lp/src/components/organisms/configurador-3d.tsx:213-278` | QA P0.1 | 4h |
| S0.2 | Criar `error.tsx` + `not-found.tsx` + `loading.tsx` globais + per-route críticas | `apps/bretda-lp/src/app/error.tsx`, `/not-found.tsx`, `/loading.tsx`, `/colecao/[slug]/{error,loading}.tsx`, `/configurador/{error,loading}.tsx` | QA P0.2 | 8h |
| S0.3 | **Delete 4 sections do homepage** + revert N1 (3 sections + footer) | `apps/bretda-lp/src/app/page.tsx` (deletar imports Marquee/Category/BrandStory/Testimonial OU Marquee/Customization/BrandStory/Testimonial — escolher 3 que sobrevivem) | Design P0 | 2h |
| S0.4 | **Hero rebuild:** caption ≤ 5 words + 1 CTA · stripar eyebrow + italic + vertical label + 2 hairlines | `apps/bretda-lp/src/components/organisms/eleven-hero.tsx` | Design P0 + N2 | 4h |
| S0.5 | **Migrate cutout PNGs → lifestyle JPGs** em CollectionGallery | `apps/bretda-lp/src/components/organisms/eleven-collection-gallery.tsx` + `public/colecao/{Model}_Ambiente_01.jpg` (precisa renderizar/comprar) | Design P0 + N10 | 4h dev + render time |
| S0.6 | **Strip `Conversar` nav CTA** + footer collapse 4→2 cols | `apps/bretda-lp/src/components/organisms/eleven-navbar.tsx` + `eleven-footer.tsx` | Design P0 + N5 | 3h |
| S0.7 | **Italic-on-serif budget = 1 site-wide** (auditar 5 ocorrências, manter 1) | grep `font-style: italic` em organisms eleven-* | Design P0 | 2h |
| S0.8 | **Subtração:** deletar 8 organisms órfãos (`hero.tsx`, `footer.tsx`, `act-card.tsx`, etc) — ~2.200 LOC | listar via grep no commit | QA P1.9 + Conclave Rams | 3h |
| S0.9 | **Subtração:** remover 4 fonts não usadas (Cormorant, Raleway, Inter, Josefin) | `apps/bretda-lp/src/app/layout.tsx` (`next/font`) + `globals.css` | Conclave Rams | 1h |

**Sprint 0 total:** ~31h. Cabe em 3 dias dev intenso.

**Sprint 0 gate exit:**
- [ ] `npm run lint` exit 0
- [ ] `next build` PASS sem lint silenciado
- [ ] Homepage tem **exatamente 3 sections + footer** (revert N1)
- [ ] Hero ≤ 5 words above-fold (revert N2)
- [ ] Collection cards usam **JPG lifestyle**, não cutout PNG (revert N10)
- [ ] WCAG audit script continua PASS 9/9
- [ ] Lighthouse mobile re-run: LCP < 4000ms (interim — sprint 1 leva pra <2500ms)

---

### **Sprint 1** (1 semana) — Reliability + Quality gates

**Goal:** Gate CONCERNS → infraestrutura que IMPEDE outro 30/Abr de acontecer.

| # | Action | File(s) | Source | Effort |
|---|--------|---------|--------|:------:|
| S1.1 | **Sentry SDK setup** + DSN env (Vercel) + source maps + per-route boundaries | `apps/bretda-lp/sentry.{client,server,edge}.config.ts`, env vars | QA P0.3 + Conclave Forsgren | 4h |
| S1.2 | **GitHub Actions quality workflow:** lint + typecheck + audit:wcag + Lighthouse CI pre-merge | `.github/workflows/quality.yml` | Conclave Kim + Friedman | 3h |
| S1.3 | **Lint-as-gate em build** (`ignoreDuringBuilds: false`) | `apps/bretda-lp/next.config.ts` | QA P1.7 | 0.5h (depende S0.1) |
| S1.4 | **Rate-limit nas 4 server actions** via Upstash wrapper | `apps/bretda-lp/src/app/api/_lib/rate-limit.ts` (extrair pattern do `/api/meta-conversion`) | QA P1.6 | 4h |
| S1.5 | **Honeypot em contato-action** | `apps/bretda-lp/src/app/contato/_actions/contato-action.ts` | QA P1.5 | 1h |
| S1.6 | **SEO files:** robots.txt + sitemap.ts + favicon set + manifest.webmanifest | `apps/bretda-lp/src/app/{robots.ts,sitemap.ts,manifest.ts}` | QA P1.8 | 4h |
| S1.7 | **Performance Sprint:** `<img>` → `next/image` em /atelier · hero video lazy + poster · Three.js dynamic import com Suspense loader | `apps/bretda-lp/src/app/atelier/page.tsx` + `eleven-hero.tsx` + `configurador-wrapper.tsx` | QA P1.10/11/13 + Anadol pre-loader | 8h |
| S1.8 | **Next.js 16 Cache Components** — migrar homepage + atelier + colecao para cache full com dynamic slots para form/configurador | `apps/bretda-lp/src/app/{page,atelier,colecao}.tsx` (`use cache` directive) | Research Q2 (Sonos +75%, Bestit +40%) | 4h |
| S1.9 | **DORA dashboard public** (deployment freq, lead time, MTTR, change failure rate) via Vercel Insights + Sentry | doc em `apps/bretda-lp/docs/observability.md` + Vercel dashboard URL | Conclave Forsgren | 2h |

**Sprint 1 total:** ~30.5h. Cabe em 1 semana.

**Sprint 1 gate exit:**
- [ ] CI workflow bloqueia PR com lint fail / typecheck fail / wcag fail / Lighthouse < 75 mobile
- [ ] Sentry recebe error em deploy preview (validado via throw forçado)
- [ ] Lighthouse mobile: LCP < 2500ms, TBT < 200ms, CLS < 0.1
- [ ] Sitemap.xml acessível em /sitemap.xml com todas as 11 rotas
- [ ] DORA dashboard URL documentado e acessível

---

### **Sprint 2** (1 semana) — Test foundation + A11y experiencial

**Goal:** Gate CONCERNS → PASS. Fundação que sustenta redesign visual futuro.

| # | Action | File(s) | Source | Effort |
|---|--------|---------|--------|:------:|
| S2.1 | **Vitest setup** + unit tests 4 server actions (contato, newsletter, encomenda, configurador-handoff) | `apps/bretda-lp/vitest.config.ts` + `apps/bretda-lp/src/app/**/_actions/*.test.ts` | QA P0.4 | 8h |
| S2.2 | **Test seam Three.js:** expose `window.__sceneReady` + `webglContextLost` capture + Playwright spec configurador | `apps/bretda-lp/src/lib/configurador/scene.ts` + `tests/configurador.spec.ts` | Conclave Fowler+Anadol | 6h |
| S2.3 | **Pre-loader curado configurador:** 4-tier progress (env → models → materials → ready) com narrativa visual | `apps/bretda-lp/src/components/organisms/configurador-loader.tsx` | Conclave Anadol | 4h |
| S2.4 | **WebGL fallback gracioso:** HD render + "configure via concierge" CTA se WebGL não suportado | `apps/bretda-lp/src/components/organisms/configurador-wrapper.tsx` | Conclave Anadol | 3h |
| S2.5 | **A11y experiencial 45-65+:** font ≥ 18px body, line-height ≥ 1.6, AAA contrast body (7:1), touch targets ≥ 48px, ZERO hover-only, `prefers-reduced-motion` em Framer Motion | `globals.css` + design tokens audit + Framer Motion components | Conclave Friedman + Research Q3 | 6h |
| S2.6 | **PR template com a11y checklist + Cursor rules + veto AI-direct-merge** | `.github/pull_request_template.md` + `.cursor/rules/bretda-design-system.mdc` | Conclave Schneider + Research Q5 | 3h |
| S2.7 | **Lighthouse re-audit + DORA snapshot baseline** | rodar e documentar em `apps/bretda-lp/docs/baseline-2026-05-22.md` | QA closure | 1h |

**Sprint 2 total:** ~31h. Cabe em 1 semana.

**Sprint 2 gate exit:**
- [ ] Test coverage server actions ≥ 80%
- [ ] Playwright spec configurador passa (incluindo WebGL fallback)
- [ ] Lighthouse mobile 90+ desktop, 75+ mobile
- [ ] WCAG audit script + a11y experiencial 45+ checklist documentado
- [ ] PR template + Cursor rules ativos
- [ ] Gate decision: **CONCERNS → PASS**

---

## 4. Phase 3 — Redesign visual REAL (apenas APÓS Sprint 0-2 PASS)

**Pré-requisito:** Sprint 0-2 completos e gate PASS. Não começar antes.

| # | Action | Source | Effort |
|---|--------|--------|:------:|
| P3.1 | **Brand-onliness workshop** (Breno + PM): redefinir categoria + tribe + trustmarks reais (artesão, origem madeira, parcerias arquitetos publicados) | Conclave Neumeier | 1-2 dias produto |
| P3.2 | **Copy editorial revisada** por copywriter luxury BR (sair de "adjetivos polidos" pra editorial real) | Conclave Schneider + Rams | 1-2 dias copy |
| P3.3 | **Configurador como hero piece** (avaliar) — mover configurador para `/` com loading curado cinemático | Conclave Anadol + Research Q4 | 2-3 dias dev (sprint dedicado) |
| P3.4 | **A/B benchmark gate:** screenshots Bretda vs Aston Martin / Cassina / Aman / Brunello lado-a-lado **ANTES de merge** de qualquer redesign | `.out-of-scope/luxury-redesign-without-benchmark.md` | meio-dia/iteração |

**Phase 3 não é orçada nesses 3 sprints — é o próximo capítulo.**

---

## 5. Anti-patterns interdita-permanentes (lições do 30/Abr)

Adicionar a `.out-of-scope/`:
1. **AI-overnight squad sem human visual checkpoint** — 13 PRs em 1 noite = veto absoluto
2. **"Token swap + copy update" ≠ "visual redesign"** — se layout não mudou, não foi redesign
3. **Italic-on-serif como default** — usar somente como moment of emphasis (budget = 1 site-wide)
4. **"Add sections" = "make luxury"** — relação inversa: luxury é subtração, não acumulação
5. **Skip Phase 0 benchmark gate** — já registrado em `.out-of-scope/luxury-redesign-without-benchmark.md`, REFORÇADO

---

## 6. Status de approval

| Decision point | Status |
|----------------|--------|
| Aprovar Sprint 0 (3d) — subtração + stop bleeding | ⏸ pending Breno |
| Aprovar Sprint 1 (1sem) — gates + observability | ⏸ pending Breno |
| Aprovar Sprint 2 (1sem) — tests + a11y | ⏸ pending Breno |
| Phase 3 (redesign real) | ⏸ depende Sprint 0-2 PASS |

**Approval mínima necessária para começar:** Sprint 0. Sprint 1+2 podem ser revisados após Sprint 0 entregue.

---

## 7. Deliverables desta auditoria (todos em `docs/projects/bretda-redesign/06-audit-2026-05-15/`)

| File | Size | Auditor |
|------|------|---------|
| `qa-audit.md` | 27KB | aios-qa (Quinn) |
| `design-audit.md` | ~25KB | aios-ux (Uma) |
| `hydra-research.md` | 10KB | Orion (manual scan) |
| `conclave-research.md` | 24KB | aios-analyst (Atlas) |
| `MASTER-SYNTHESIS.md` | (este) | aios-master (Orion) |

**Total:** ~95KB de research, 4 perspectivas independentes, 1 verdict convergente.

---

## 8. Próximo passo imediato

**Aguardo aprovação para iniciar Sprint 0.**

Recomendo começar por:
- **S0.3 (delete 4 sections de page.tsx)** — 2h, reversível, maior ganho visual imediato
- **S0.1 (fix 25 lint errors)** — 4h, destrava S1.3 (lint-as-gate)
- **S0.8 + S0.9 (subtração organisms + fonts)** — 4h, destrava futuro redesign sem dead code

Esses 3 itens em **~10h** já mudam significativamente percepção do site (menos clutter visual + menos LOC pra navegar).

**Pendência única do usuário:** dizer "vai com Sprint 0" → eu disparo @dev (com checkpoint visual humano em cada PR) seguindo a sequência acima. Antes de cada commit que mude layout, gero screenshot lado-a-lado vs estado anterior pra você aprovar.

---

*Orion (aios-master) · Phase 2 Master Synthesis · 2026-05-15*
*Audits paralelos: Quinn (QA) + Uma (UX) + Atlas (Analyst) + HYDRA scan*
*Convergent verdict: Subtraction + Gates + Observability BEFORE any new visual redesign.*
