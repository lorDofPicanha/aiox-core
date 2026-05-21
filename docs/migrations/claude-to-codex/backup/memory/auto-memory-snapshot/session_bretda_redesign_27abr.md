---
name: Sessão Bretda Redesign 27/Abr
description: Conclave + DESIGN.md integration + 9-page preview + PR1 foundation tokens (split required, sem push)
type: project
originSessionId: 2df7be6b-1324-4a01-a9a0-779117d9a7d7
---
# Sessão Bretda Redesign — 27/Abr 2026

## O que aconteceu

Squad de design entregou audit completo + redesign spec. AIOS-dev tentou implementar PR 1 (foundation tokens) mas misturou Meta CAPI / PriceHint A/B em uma única branch (530+ LOC scope creep). QA gate FAIL → branch surgery executada por @devops sem perda de trabalho.

## Phases entregues

1. **Phase 1 — 4 audits** (`docs/projects/bretda-redesign/01-analysis/`):
   ui-designer, ux-design-expert, design-systems-engineer, ux-designer
2. **Phase 2 — Conclave** (5 mind clones): Path A unanimous (foundation-first refactor)
3. **Phase 3 — DESIGN.md canonical** + REDESIGN-PROPOSAL section-by-section
4. **Phase 4 — Preview package**: 9 HTMLs + 5 AI mockups (Flux Pro/Schnell) + FINAL-DECISIONS

## DESIGN.md infrastructure (commits AIOS root, branch feat/redesign-foundation-tokens)

- `b2717c3d` feat(design-md): integrate Google DESIGN.md spec + 69-brand library via HYDRA
- `91ff019c` feat(agents): wire DESIGN.md commands into 5 design squad agents
- `0cc62581` docs(bretda): full redesign analysis, conclave + DESIGN.md + preview package
- `88ce295a` chore(qa): record gate decision for PR 1 foundation tokens (FAIL — scope creep)

## PR 1 branch surgery (apps/bretda-lp inner repo)

QA gate FAIL motivou split em 2 branches limpas:

- `feat/redesign-foundation-tokens` (b0c7ce9): 19 files, foundation tokens + codemod + Button atom + canonical DESIGN.md
- `feat/meta-capi-pricehint-tracking` (412dfb3): 10 files, /api/meta-conversion + PriceHint A/B + MetaLeadTracker + tracking.ts +78 LOC fire-and-forget CAPI

`hero.tsx` resolution: Group A pure-tokens (function Hero), Group B full-mixed (async function Hero + PriceHint + tokens). page.tsx async-only on Group B (required by async Hero).

Backup branch local: `backup/before-split-1777396509` (apps/bretda-lp).

## Path A — Conclave verdict

Foundation-first refactor antes de hero rebuild. PR 1 = só tokens, zero hero-content change. PR 2 = hero rebuild (Variant A lifestyle JPG, 8-word above-fold, single champagne CTA "Ver a Coleção").

## Status push (atualizado 28/Abr)

✅ **PR 1 PUSHED** em 28/Abr 2026.
- PR: https://github.com/lorDofPicanha/bretda-lp/pull/1
- Commit chore(qa) 49788940 atualiza gate FAIL→PASS na AIOS root
- Push via @devops (pre-checks PASS, lint 43, build PASS)
- Branch `feat/meta-capi-pricehint-tracking` (412dfb3) AINDA local — só pusha após PR1 mergear

🟡 **PR 2 IN PROGRESS** — @aios-dev dispatched (background) com FINAL-DECISIONS spec corrigido.
Ver `reminder_bretda_pr2_hero_pending.md` para detalhes.
