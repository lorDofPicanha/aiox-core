---
name: Tocks Awwwards Elevation — Epic 8 PR OPEN
description: Elevação tocks-website Awwwards. Epic 8 (7 stories) CLOSED, FWA 4.6→8.25. PR #634 aberto cross-repo 17/Abr, aguarda review maintainer SynkraAI.
type: project
originSessionId: 4abfe149-bef9-4b4f-bb74-885dd31a5377
---

# Tocks Awwwards Elevation — Epic 8 PR #634 OPEN 2026-04-17

**PR cross-repo:** https://github.com/SynkraAI/aiox-core/pull/634
**Base:** `SynkraAI/aios-core:main` · **Head:** `lorDofPicanha:feat/epic-8-tocks-website`
**Commit:** `ea5f0e32` — `feat(tocks-website): Epic 8 Awwwards Elevation — 7 stories, FWA 4.6→8.25`
**Quality gates:** ✅ lint (7 pre-existing warnings) · ✅ typecheck · ✅ build (19/19 pages, Next 16 Turbopack 19.4s)
**Caminho do push:** A1 (fork workflow) — `lorDofPicanha/aiox-core` → `SynkraAI/aios-core:main`
**Bloqueio original resolvido:** 403 em `SynkraAI/aios-core` contornado via fork admin (lorDofPicanha tem ADMIN no fork pessoal)

**Direção aprovada:** B (Gilded Noir Cinemático) + cherry-pick E (Provenance card) + cherry-pick C (Atelier longform).
**Scorecard FWA:** 4.6 → **8.25/10** (+3.65 = +79%). Target 9.0 bloqueado em 2 dimensões por dep externa de asset.
**Orquestrador:** @design-lead (Nova).
**Path specs:** `apps/tocks-website/docs/design/elevation-awwwards/`.
**Path closure report:** `apps/tocks-website/docs/qa/EPIC-8-CLOSURE.md`.
**Mind Clones absorvidos:** don-norman, tobias-van-schneider, val-head (Sessão 19 verbatim) + maeda, rams, spiekermann, tufte.

## Final FWA Scorecard

| Dimensão | Antes | Depois |
|---|---:|---:|
| Originalidade visual | 4 | 8 |
| Hierarquia tipográfica | 5 | 9 |
| Motion craft | 5 | 8 |
| Storytelling | 3 | 9 |
| Technical polish | 8 | 9 |
| Brand voice | 6 | 9 |
| Interatividade signature 🔒 | 2 | 7 (blocked: hero video asset) |
| Content density luxury 🔒 | 4 | 7 (blocked: Nano Banana 2 quota) |
| **MÉDIA** | **4.6** | **8.25** |

## 7/7 Stories PASS

| Story | Status |
|---|---|
| S-8.1 Foundation (tokens + fonts + Patch #2c) | ✅ PASS (LH 97/98/100/100 home) |
| S-8.2 Hero Cinematic | ✅ PASS (placeholder video + Runway prompt ready) |
| S-8.3 Provenance Card Tufteano | ✅ PASS (8 produtos + ProductProvenance type) |
| S-8.4 Atelier Longform (6 chapters) | ✅ PASS (broken grid + copy v2 migrada) |
| S-8.5a Motion Foundation | ✅ PASS (Classes 2/3/4 + view-transitions + reduced-motion) |
| S-8.5b Motion Wire-up | ✅ PASS (hooks + Classe 1 + Classe 4 + GSAP dynamic) |
| S-8.6 Copy QA Lighthouse FWA | ✅ PASS (bilhar → móveis de autor + closure report) |

## Lighthouse mobile final

| Route | Perf | A11y | BP | SEO | LCP |
|---|---:|---:|---:|---:|---|
| `/` | 85 ⚠️ | 98 | 100 | 100 | 2.5s |
| `/colecao` | 96 | 98 | 100 | 100 | 2.7s |
| `/colecao/tenro-luxo` | 92 | 100 | 96 | 100 | 2.8s |
| `/atelier` | 96 | 96 | 100 | 100 | 2.7s |
| `/contato` | 94 | 100 | 100 | 100 | 3.2s |

**Axe:** 0 novel serious; 17 residuais /atelier = backlog pre-existente.
**Reduced-motion:** 0 offenders em 33 surfaces + view-transitions.
**WCAG AAA:** 11/11 tokens spec-exact, Rule 1-4 preservadas.

## Backlog pós-merge

**P1 (antes do próximo bone page):**
- FIX-3 Header bone-adaptation (Logo "Custom" gold + NavLinks text-secondary falham em bone)
- Nano Banana 2 hot-swap (hero video real + atelier B&W + produto fotos)

**P2:**
- FIX-6 opacity-60 → opacity-70 (9 nodes near-miss 4.46:1)
- FIX-6b chapter-corte class-precedence (se real)
- S-8.2 LCP re-measure pós-asset swap
- Testimonial atelier validation (cliente real)
- Provenance data reais (atelier validation)

**P3 (Epic 9+):**
- View-transitions Approach B (shared-element morph)
- 3D configurador R3F
- Blog post editorial copy reposition

## Current blocker

🟢 **RESOLVIDO 17/Abr via fork workflow (A1).** Epic 8 pushed para `lorDofPicanha/aiox-core`, PR #634 aberto cross-repo. Aguarda review/merge de maintainer `SynkraAI/aios-core`.

## Epic 9 (next)

PRD + 8 stories stub criadas em `apps/tocks-website/docs/stories/S-9.*-stub.md` (ViewTransition foundation, card morph, R3F setup, wood finish, rotate ambient, mobile fallback, blog copy v2, closure). Aguarda @sm expandir stubs para stories completas.

## Artifacts

- `docs/design/elevation-awwwards/{00,01,03,05,06}-*.md` — brief + master plan + specs
- `docs/stories/S-8.1` a `S-8.6` + `S-8.5b` — 7 stories completas
- `docs/qa/EPIC-8-CLOSURE.md` — executive closure report (main deliverable)
- `docs/qa/s-8.6-fwa-scorecard.md` — 8-dimension scorecard com evidence
- `docs/qa/s-8.6-5second-test.md` — Krug protocol roteiro
- `docs/qa/s-8.6-lighthouse-final.json` + `s-8.6-axe-final.json`
- `tests/qa/s-8.6-closure-gate.mjs` — reusable closure harness
- `tests/qa/s-8.1-browser-gate.mjs` + `s-8.2-8.5b-browser-gate.mjs` + `s-8.2-8.5b-regate.mjs`

## Key learnings (session)

1. **Stale reports between parallel agents:** S-8.5 agent reportou useEffect bug em hero-video que não existia (stale cache). Art. IV — Dex refutou, não inventou fix.
2. **Spec-vs-reality divergence:** FIX-1 e FIX-6b descritos pela @qa não existiam no código. Dex grep exhaustivo refutou. Art. IV wins, evita retrabalho fantasma.
3. **Story scope splits funcionam:** S-8.5 (5.5h) split em 5a (2.5h foundation) + 5b (3h wire-up) permitiu merge precoce da foundation sem bloquear.
4. **Pairing stories consumidor+hook:** S-8.4 (atelier) + S-8.5b (hooks) executados em passada única economizou context-switch massivo.
5. **Mind Clone parallel dispatch funciona async:** 6 consultations em paralelo, síntese via frameworks públicos não espera responses — Nova já sintetizou e rodou as fases.
