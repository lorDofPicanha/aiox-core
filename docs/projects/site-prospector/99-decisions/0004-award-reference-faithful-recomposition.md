# ADR-0004 — Award-Reference Faithful Recomposition

**Status:** ACCEPTED — Founder correction 2026-07-22  
**Decision owner:** Breno Cerqueira  
**Supersedes:** visual-production portions of SP-001 and the specifications dated 2026-07-13 and 2026-07-19  
**Preserves:** ADR-0001 commercial validation, ADR-0002 legal gates, ADR-0003 target-brand primers

## Context

The July pipeline produced 25 static explorations and one Maria Mole prototype.
Founder review rejected every output because they looked like generic generated
landing pages rather than the best and most awarded web design work in the world.

The failure was architectural, not cosmetic. The superseded process blended
multiple references, limited any source to 25% influence, and prohibited reuse
of a complete section sequence. Those rules prevented faithful reconstruction
of a great page and encouraged a generic average.

## Decision

Each Site-Prospector golden prototype uses exactly **one master reference page**.

The master reference supplies the complete structural blueprint:

- full section order;
- grid and container geometry;
- section heights and proportions;
- whitespace rhythm;
- hierarchy and visual emphasis;
- component placement;
- responsive transformations;
- interaction and motion choreography;
- complete desktop and mobile composition.

The target business supplies:

- canonical target `DESIGN.md`;
- colors, typography, radius, shadows, icons, and brand expression;
- real copy and real product/service facts;
- first-party photographs and brand assets;
- CTA destination and local-commercial constraints.

The implementation is independently written. It must not reuse the reference's
source code, trademarks, copy, photographs, proprietary illustrations, or
licensed fonts. Structural fidelity is required; source-brand leakage is a hard
failure.

## One-reference rule

- One master reference controls the page.
- One fallback reference may be documented but is not blended into the build.
- No moodboard synthesis, Frankenstein composition, or 25% source allocation.
- If the master reference is incompatible with target content, select another
  master before coding. Do not repair the mismatch by mixing pages.

## Token boundary

The page is split into two contracts:

1. `reference-layout-contract.yaml` — immutable geometry, sequence, responsive
   behavior, and motion extracted from the master page.
2. `target/DESIGN.md` — replaceable target-brand tokens and art direction.

Layout constants cannot be changed merely to make the target design easier.
Target tokens cannot be replaced by source-brand styling merely to improve
visual similarity.

## Required evidence

Before implementation, preserve:

- official award record and award tier;
- live source URL and access date;
- full-page desktop capture at 1440px;
- full-page mobile capture at 375px;
- interaction/motion inventory;
- source `DESIGN.md` extraction for analysis only;
- target `DESIGN.md` and first-party asset manifest;
- slot-by-slot target content map.

## Fidelity gates

All must pass:

| Gate                                     |                  Threshold |
| ---------------------------------------- | -------------------------: |
| Section order                            |   100% identical to master |
| Major structural blocks                  |               100% present |
| Section bounds deviation                 | <=4% desktop / <=6% mobile |
| Edge/layout-mask similarity              |  >=0.92 desktop and mobile |
| Responsive behavior inventory            |         100% accounted for |
| Target DESIGN.md token adoption          |                       100% |
| Source trademarks/copy/media leakage     |                          0 |
| Target media with first-party provenance |                       100% |
| Placeholder or generated business facts  |                          0 |
| Horizontal overflow / dead interaction   |                          0 |

Color-pixel SSIM is not the governing metric because brand colors and imagery
must change. Geometry, edges, bounds, hierarchy, and responsive behavior govern
fidelity.

## Founder visual gate

No artifact advances because an automated score passed. The Founder receives:

- reference and target full-page captures side by side;
- desktop and mobile overlay views;
- fidelity report;
- explicit list of intentional deviations.

Only `APPROVED`, `REVISE ONCE`, or `REJECT REFERENCE` are valid outcomes. A
rejected reference is replaced; it is not averaged with another page.

## Commercial boundary

The first output is one private golden prototype. No batch of three or 25 is
authorized. Commercial outreach remains human-only. Production work and public
deployment remain outside scope until the applicable commercial and legal gates
are satisfied.

## Consequences

### Positive

- The output inherits a proven world-class composition instead of generating an
  average template.
- Failure becomes diagnosable: reference selection, layout fidelity, target
  tokens, content fit, or asset quality.
- One approved golden prototype becomes the standard for later prospects.

### Negative

- The first build is slower and demands full-page capture plus visual regression.
- A target with weak media or mismatched content cannot use every awarded page.
- Heavy WebGL/3D references may be rejected for cost or performance.

## Rejected alternatives

- Multi-reference synthesis.
- Generic niche templates with brand swaps.
- AI-generated hero imagery presented as target-business media.
- Producing several directions before one reaches the fidelity gate.
- Copying source code or source-brand assets.
