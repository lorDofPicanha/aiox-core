# Site-Prospector — Award-Reference Faithful Recomposition Plan

**Status:** READY FOR FOUNDER REFERENCE-SELECTION GATE  
**Date:** 2026-07-22  
**Decision owner:** Breno Cerqueira  
**Architecture:** [ADR-0004](../../projects/site-prospector/99-decisions/0004-award-reference-faithful-recomposition.md)  
**Execution story:** [SP-003](../../stories/SP-003-award-reference-faithful-prototype.md)

## 1. Executive Summary

The Site-Prospector visual pipeline is reset. The next deliverable is one golden
prototype built from one complete, award-winning master page. The master page is
reconstructed faithfully in desktop and mobile; only after its structural
contract is frozen are the target company's `DESIGN.md`, real content, and
first-party media applied.

The objective is not to invent a new design or combine inspirations. It is to
prove that Site-Prospector can translate a world-class complete composition into
a truthful, brand-specific page without degrading layout quality.

## 2. Inputs and non-negotiables

### Required inputs

- one target business approved for the golden prototype;
- target `DESIGN.md`;
- target logo and first-party media;
- verified products/services, NAP, CTA, and commercial facts;
- one accessible award-winning master page;
- official award evidence.

### Non-negotiables

- exactly one master reference;
- complete desktop and mobile capture before coding;
- no generated or stock media masquerading as target media;
- no invented copy, price, testimonial, metric, or business fact;
- no source-brand asset or source code reuse;
- no second prospect until Founder approves the first;
- no blending references to fix a bad selection.

## 3. Award-source policy

Primary discovery sources:

1. Awwwards — SOTD, SOTM, SOTY, Developer Award, or E-commerce Honors;
2. CSS Design Awards — WOTD, WOTM, WOTY, Special Kudos;
3. FWA — FWA of the Day/Month/Year;
4. other juried sources only when award evidence and the live page are verifiable.

A directory appearance, nominee status, social-media popularity, Behance,
Dribbble, or Pinterest alone does not qualify as an award. Awwwards maintains
category and award listings including e-commerce, food and drink, luxury, SOTD,
SOTM, SOTY, Developer Award, and E-commerce Honors.

## 4. Master-reference selection

### 4.1 Scout

Research at most ten live awarded pages. Preserve award URL, live URL, award
tier/date, full-page availability, mobile quality, and technology constraints.

### 4.2 Eligibility gates

All must pass:

- official award evidence;
- live or faithfully archived complete page is inspectable;
- primary customer journey matches the target business;
- target has enough real content and media for the reference's major slots;
- mobile page is complete, not a degraded desktop crop;
- no login/paywall blocks the primary journey;
- no essential experience depends on unavailable proprietary 3D, video, or
  licensed media;
- independent implementation is feasible within the golden-prototype budget.

### 4.3 Scorecard

| Dimension                      | Weight |
| ------------------------------ | -----: |
| Customer-journey match         |     25 |
| Content-slot compatibility     |     20 |
| Award strength                 |     15 |
| Mobile composition quality     |     15 |
| Target first-party asset fit   |     10 |
| Implementability/performance   |     10 |
| Local conversion compatibility |      5 |

Three finalists are presented with complete desktop/mobile screenshots. The
Founder selects one master. Coding before this selection is forbidden.

## 5. Artifact contracts

```text
docs/projects/site-prospector/03-proposal-mockups/golden-01-{target}/
├── 00-charter.md
├── 01-reference/
│   ├── award-evidence.md
│   ├── desktop-1440-full.png
│   ├── mobile-375-full.png
│   ├── motion-inventory.md
│   ├── source-DESIGN.md
│   └── reference-layout-contract.yaml
├── 02-target/
│   ├── DESIGN.md
│   ├── facts.yaml
│   ├── content-map.yaml
│   ├── asset-manifest.json
│   └── assets/
├── 03-prototype/
│   └── index.html or application files
├── 04-evidence/
│   ├── target-desktop-1440-full.png
│   ├── target-mobile-375-full.png
│   ├── desktop-overlay.png
│   ├── mobile-overlay.png
│   └── fidelity-report.json
└── 05-review/
    └── founder-verdict.md
```

## 6. Pipeline

### P0 — Reset and charter

- Record prior 25 explorations and Maria Mole as rejected.
- Select one target business.
- Freeze the primary task, CTA, conversion event, and prototype budget.

**Exit:** charter approved; no code.

### P1 — Awarded-page scout

- Find up to ten awarded complete pages.
- Verify award records and live accessibility.
- Capture desktop/mobile of eligible finalists.
- Score and present the best three.

**Exit:** Founder selects one master page.

### P2 — Reference reconstruction contract

- Inventory every section and major block.
- Record dimensions, grid, spacing, layering, sticky behavior, breakpoints, and
  motion.
- Extract source `DESIGN.md` for analysis.
- Freeze `reference-layout-contract.yaml`.

**Exit:** 100% of visible sections and responsive transformations accounted for.

### P3 — Target-brand contract

- Create or validate the target `DESIGN.md`.
- Verify every fact and first-party asset.
- Map target content into every reference slot.
- Reject the reference if content or media cannot fit honestly.

**Exit:** no placeholder, unknown critical slot, or unapproved media.

### P4 — Faithful implementation

- Rebuild the master composition with independent code.
- Preserve structure and responsive choreography.
- Apply only target-brand tokens and target content/media.
- Implement the minimum interaction needed to reproduce the visible experience.

**Exit:** desktop and mobile prototype complete; no source-brand leakage.

### P5 — Fidelity and quality gate

- Capture target desktop/mobile full pages.
- Generate edge/layout masks and overlays.
- Measure section bounds and responsive behavior.
- Run accessibility, overflow, console, and performance checks.

**Exit:** all ADR-0004 thresholds pass.

### P6 — Founder visual review

Present reference and target side by side, overlays, report, and deviations.

Valid outcomes:

- `APPROVED` — golden prototype established;
- `REVISE ONCE` — one bounded correction, then final review;
- `REJECT REFERENCE` — stop and return to P1 with no blending.

## 7. Quality gates

### Structural fidelity

- section order: 100%;
- major blocks present: 100%;
- bounds deviation: <=4% desktop and <=6% mobile;
- edge/layout-mask similarity: >=0.92;
- responsive transformation inventory: 100% matched or deviation approved.

### Brand replacement

- target tokens adopted: 100%;
- source colors, logos, copy, photos, and fonts remaining: zero;
- target facts and media provenance: 100%;
- target content lengths remain within mapped slot limits.

### Technical

- no horizontal overflow at 375, 768, and 1440;
- zero console errors and dead CTAs;
- reduced-motion fallback;
- keyboard focus and semantic controls;
- Lighthouse targets: Performance >=90, Accessibility >=95, Best Practices >=95,
  SEO >=90, unless the reference requires a documented performance trade-off
  approved before implementation.

## 8. Effort and critical path

| Phase                            |        Effort |
| -------------------------------- | ------------: |
| P0 charter/reset                 |         0.5 h |
| P1 scout + full-page captures    |         2–3 h |
| P2 layout contract               |         2–3 h |
| P3 target contract               |       1.5–2 h |
| P4 implementation                |        8–12 h |
| P5 QA/fidelity                   |         2–3 h |
| P6 review/correction             |         1–2 h |
| **Total first golden prototype** | **17–25.5 h** |

Later prototypes may target 8–12 h only after the golden run proves which
artifacts are reusable. Quality, not batch volume, is the binding constraint.

```text
target facts/assets
        ┐
        ├─> target/reference compatibility ─> Founder selects master
award scout + captures
        ┘                                      │
                                               v
layout contract ─> target DESIGN.md/content map ─> implementation
                                                   │
                                                   v
                                      fidelity gate ─> Founder verdict
```

## 9. Risk matrix

| Risk                                  |   P |   I | Score | Mitigation                                                |
| ------------------------------------- | --: | --: | ----: | --------------------------------------------------------- |
| Target content does not fit reference |   4 |   5 |    20 | content-slot gate before coding                           |
| Target tokens destroy hierarchy       |   4 |   4 |    16 | immutable layout contract + token translation review      |
| Heavy motion/3D breaks performance    |   4 |   4 |    16 | feasibility gate; reject reference before build           |
| Trade-dress/source-brand leakage      |   3 |   5 |    15 | independent code; zero source assets/copy; private review |
| Founder rejects after implementation  |   3 |   5 |    15 | select from three complete captures before coding         |
| Live reference changes/disappears     |   3 |   4 |    12 | immutable full-page captures and motion inventory         |
| Generic result returns                |   2 |   5 |    10 | one-reference rule; no synthesis/blending                 |
| Research expands without build        |   3 |   3 |     9 | ten-site hard cap and three-finalist gate                 |

## 10. Success criteria

- [ ] One master reference selected from official award evidence.
- [ ] Complete desktop and mobile captures preserved.
- [ ] Reference layout contract covers every visible section.
- [ ] Target DESIGN.md, facts, content map, and media manifest pass.
- [ ] One working golden prototype exists.
- [ ] All structural, brand, provenance, and technical gates pass.
- [ ] Founder returns `APPROVED` after side-by-side review.
- [ ] No second prospect begins before approval.

## 11. Conclave synthesis

The automatic conclave routing did not select the five named design thinkers; it
returned business, UI, onboarding, and design-system roles. Its usable consensus
is preserved without attributing unreceived opinions:

- connect the artifact to a business outcome, not visual vanity;
- treat tokens as the single source of truth for brand replacement;
- demand pixel-precise placement and hierarchy;
- preserve one primary user task and progressive disclosure;
- measure the first run before attempting scale.

Expert consultation IDs remain pending and are not represented as responses.

## 12. Contingencies

- If no candidate has adequate first-party media: stop and request a photo pack;
  do not generate substitutes.
- If no awarded page fits target content: change reference, not target facts.
- If reference requires infeasible WebGL/3D: select the next finalist.
- If fidelity passes but target brand looks weak: revise target `DESIGN.md` once;
  do not alter the layout contract.
- If Founder rejects the reference after build: archive the run and restart P1;
  never average it with another page.
