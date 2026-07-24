# Site Prospector — Reference-First Wireframe and Prototype Pipeline

**Status:** REJECTED / SUPERSEDED — Founder visual review 2026-07-22  
**Date:** 2026-07-19  
**Decision owner:** Breno Cerqueira  
**Orchestrator:** Orion (`@aios-master`)  
**Related:** [ADR-0001](../../projects/site-prospector/99-decisions/0001-pipeline-architecture.md), [ADR-0003](../../projects/site-prospector/99-decisions/0003-primer-yaml-architecture.md), [previous confectionery pipeline](2026-07-13-site-prospector-confectionery-mockup-pipeline-design.md)

> This specification must not be implemented. Its multi-reference mechanism
> extraction, 25% source-dominance limit, and prohibition on reusing a complete
> section sequence conflict with the Founder-approved faithful-reference method.
> Superseded by
> `2026-07-22-site-prospector-award-reference-recomposition-plan.md`.

## 1. Executive Summary

The Site Prospector will use a reference-first design pipeline. It will research how a purchasing archetype and vertical solve real customer tasks, convert those observations into traceable mechanisms and anti-patterns, produce an evidence-annotated wireframe, and only then create a visual artifact.

The pipeline does not begin with visual styling or a bespoke prototype. A lightweight reference scout may precede candidate selection, but deep research is released only after the candidate passes readiness gates. Pre-commercial work ends at an annotated wireframe and a private static preview. A functional prototype remains a paid Stage 2 deliverable under ADR-0001.

The operating model uses independent makers and reviewers. Every review must identify a failed gate, not a subjective preference. Each phase permits an initial check, at most one correction, and one final recheck; a blocker that remains after the final recheck triggers rollback, candidate replacement, adjudication without further rework, or a recorded stop.

## 2. Context and Correction

The project already contained the correct high-level ordering—prospect, diagnosis, niche research, design extraction, brief, build—but recent work compressed the brief directly into a mockup. That removed an explicit, inspectable wireframe gate and encouraged candidate ranking to become the design starting point.

The Founder corrected the intended order:

```text
references within the relevant niches
  → synthesis
  → wireframe
  → review
  → prototype
```

This specification restores that order while preserving two validated constraints:

1. ADR-0003 requires a vertical primer because purchase mechanics do not replace vertical-specific trust, fulfillment, language, photography, or regulation.
2. ADR-0001 blocks a functional bespoke build before the paid Stage 2 signal.

## 3. Goals

1. Research references before making layout or visual decisions.
2. Extract mechanisms rather than copy pages, sections, media, or trade dress.
3. Make every material wireframe decision traceable to evidence or an explicit hypothesis.
4. Preserve meaningful differences between purchasing archetypes, verticals, and prospects.
5. Use independent maker/reviewer roles with bounded adversarial loops.
6. Stop weak candidates before deep research or bespoke design work.
7. Produce a private pre-commercial preview without disguising a full build as a prototype.
8. Make the process reusable without turning it into a generic template.

## 4. Non-Goals

- Researching every candidate in the existing 25-business longlist deeply.
- Building 50-reference libraries before validating one candidate.
- Treating a famous, awarded, or live website as proof that its design converts.
- Producing multiple complete sites merely to create visual variety.
- Using clone consensus as evidence about a market or user.
- Contacting a prospect, publishing a preview, deploying a prototype, or purchasing services.
- Building backend, checkout, CMS, analytics, or production integrations before paid Stage 2.
- Replacing the vertical primer with a broad purchasing archetype.

## 5. Approaches Considered

### 5.1 Waterfall by niche

Each niche completes references, synthesis, wireframe, review, and prototype before the next niche.

**Strength:** simple traceability.  
**Weakness:** duplicates research and can spend heavily on a commercially weak candidate.

### 5.2 Federated cells — selected

The process separates three reusable but bounded layers:

1. purchasing-archetype mechanisms;
2. vertical primer;
3. prospect-specific delta and wireframe.

**Strength:** reuses mechanisms without flattening vertical differences.  
**Weakness:** requires explicit interfaces and override rules between artifacts.

### 5.3 Swarm or design tournament

Multiple agents generate competing complete solutions and a jury selects one.

**Strength:** high divergence.  
**Weakness:** high cost, correlated judgment, unclear ownership, and Frankenstein synthesis.

This approach is permitted only for a challenger sketch or adversarial review, never as the primary production model.

## 6. Core Model

### 6.1 Purchasing archetype

The archetype describes **how the customer buys**. Initial catalog:

1. DTC high-consideration;
2. gift/occasion with urgency;
3. sensory product with replenishment;
4. personalization/configuration;
5. B2B catalog/quotation.

An experiment activates only one primary archetype. A hybrid business is held until one primary journey can be selected or separate journeys are explicitly scoped.

### 6.2 Vertical primer

The primer describes **why the customer trusts, what the business delivers, and which constraints apply**. It contains vertical-specific references, journey rules, language, photography, trust signals, logistics, legal constraints, and layout organisms.

The primer remains required for every new vertical under ADR-0003. Its canonical artifact is a versioned YAML file at `.aios-core/data/site-prospector/primers/{vertical-id}.yaml`, conforming to the existing schema and containing an explicit `customer_journey.axis`.

Every experiment declares one primer lifecycle mode in P0:

- **Reuse:** an active canonical primer exists. P2A copies it byte-for-byte to the immutable `input-snapshot.yaml`. P5A either confirms it unchanged or proposes a separately reviewed version update.
- **Bootstrap:** no canonical primer exists. After the scout, P2A creates an experiment-local, schema-valid `bootstrap-draft.yaml` with `status: draft`, a provisional `customer_journey.axis`, seed references, and explicit unknowns, then freezes that exact draft as `input-snapshot.yaml`.
- **Reassessment:** an active primer exists but a reassessment trigger fired. P2A stores the old canonical file as `baseline-canonical.yaml`, records a separate change proposal, applies the proposal to an experiment-local draft, and freezes that exact proposed state as `input-snapshot.yaml`.

For every lifecycle mode, P3/P4 consume only `input-snapshot.yaml` after verifying `input-snapshot.sha256`; bootstrap drafts, change proposals, and canonical baselines are provenance inputs, never alternative research inputs. A snapshot is a complete, immutable byte-for-byte YAML copy of the primer state plus a sibling SHA-256 file; it is not merely a version/hash record. The final full snapshot and hash are captured after P5A and are the only primer files consumed by the prospect delta and wireframe.

P5A classifies every change against these load-bearing fields: `customer_journey.axis`, reference set, required/optional/excluded sections, trust signals, CTA behavior, photography direction, and vertical legal rules. If any load-bearing field differs from the P2A research input, the current run returns `ROLLBACK` and ends; P3/P4 must be rerun in a new or explicitly re-chartered run using the changed primer as its new input snapshot. Metadata-only changes may proceed without rollback. Candidate-specific facts, media, brand tokens, and one-business observations cannot enter the canonical primer; they belong in the prospect delta. A canonical primer rule requires evidence from at least two independent businesses or vertical-level sources, or an explicit governance exception.

### 6.3 Prospect delta

The prospect delta overrides the archetype and primer with verified business facts, offer, catalog, media, constraints, current digital gap, and primary conversion event. It is stored separately as `candidate/prospect-delta.yaml`; it never mutates or merges into the canonical primer file.

### 6.4 Override order

```text
verified prospect constraints
  → business-specific rules
  → vertical primer
  → purchasing-archetype mechanisms
  → universal accessibility, performance, evidence, and legal gates
```

The more specific layer may override a general layer only with a recorded reason and source.

## 7. End-to-End Pipeline

| Phase | Owner | Independent reviewer | Primary output | Release gate | Timebox |
|---|---|---|---|---|---:|
| P0 Experiment charter | `@aios-master` | `@pm` | `experiment-charter.md` | objective, learning type, and primer mode frozen | 30 min |
| P1 Reference scout | `@analyst` | `@design-lead` | `research/reference-scout.md` | six valid sources and initial archetype | 90 min |
| P2 Candidate readiness | `@analyst` | `@qa` | `candidate/readiness.md` | G0–G2 PASS | 45 min |
| P2A Primer research input | `@ux-design-expert` | `@pm` | one immutable input snapshot/hash plus mode-specific provenance files | hash, schema, axis hypothesis, provenance, and unknowns PASS | 30 min |
| P3 Deep reference pack | `@analyst` | `@design-lead` | `reference-atlas.md` | coverage and saturation PASS | 2 h |
| P4 Pattern synthesis | `@design-lead` | `@architect` | `pattern-inventory.md` | provenance and anti-clone PASS | 90 min |
| P5A Primer finalization | `@ux-design-expert` | `@pm` | reuse confirmation or canonical versioned primer YAML | generalized evidence, schema, journey axis, and leakage check PASS | 60 min |
| P5B Prospect delta | `@ux-design-expert` | `@qa` | separate prospect delta YAML | verified overrides and content inputs complete | 30 min |
| P6 Wireframe and adversarial gate | `@ux-design-expert` | `@qa` + `@pm` score independently; `@architect` records final tie-break only | annotated primary, challenger, locked reviewer scores, and walkthrough | deterministic P6 state machine PASS | 2 h creation + up to 1 h correction + 2 × 45 min elapsed review |
| P8 Static preview | `@design-lead` | `@qa` | two fixed-size PNGs + one PDF pack | evidence, visual, and anti-clone PASS | 2 h |
| P9 Paid prototype | `@dev` | `@qa` + `@architect` | functional private prototype | paid Stage 2 + technical gates | separately planned |

### 7.1 Critical path

```text
P0 → P1 → P2 → P2A → P3 → P4 → P5A → P5B → P6 → P8
                                                       ↓
                                         human commercial stage
                                                       ↓ paid Stage 2
                                                      P9
```

No later phase may compensate for a failed earlier gate with better visuals.

## 8. Experiment Charter

Every run must choose one learning objective:

- **Exploration:** inspect different archetypes; output is qualitative learning.
- **Comparison:** compare candidates inside the same archetype; output may support relative fit.
- **Operational efficiency:** process one candidate and measure time, evidence quality, and defect rate.

Mixing these objectives invalidates the learning. The first approved run uses **operational efficiency** with one DTC high-consideration candidate.

The charter freezes:

- decision to support;
- archetype and vertical;
- primary user and task;
- primary conversion event;
- hypotheses and disconfirming evidence;
- time and source budgets;
- maker/reviewer assignments;
- stop and rollback rules.

## 9. Candidate Readiness Gates

### G0 — hygiene

All must be true:

- Blumenau location is verified;
- active CNPJ is revalidated close to the run;
- current commercial activity is observable;
- the company is not a franchise;
- at least eight usable first-party media assets are likely available;
- the digital gap can be reproduced on desktop or mobile.

Failure removes or holds the candidate.

### G1 — material problem and economics

The gap must connect to at least one mechanism:

- discovery;
- trust;
- lead generation;
- product comprehension;
- purchase or quotation completion.

The expected business value and ability to invest remain hypotheses until validated. No revenue, margin, traffic, or conversion number may be invented.

### G2 — journey readiness

The run must define:

- one primary user;
- one primary task;
- one dominant CTA;
- one observable conversion event;
- one primary purchasing archetype;
- realistic content, catalog, fulfillment, and media inputs.

A hybrid or ambiguous journey is held instead of being forced into a generic page.

## 10. Reference Research Protocol

### 10.1 Scout pack

The scout uses six sources:

- two global references;
- two Brazil/Latin America references;
- one regional reference;
- one anti-reference.

The buckets are targets, not permission to include weak sources. A source enters only when it contributes a relevant mechanism or failure mode.

### 10.2 Deep pack

After G0–G2 PASS, P3 verifies and consumes only the P2A `input-snapshot.yaml`. The pack starts with:

- three mechanism-comparable references;
- two Brazil/local references;
- two anti-references.

It expands to eight–ten sources only when there is conflict, structural uncertainty, or missing comparability. Twelve is the absolute maximum.

Research stops when either:

- two consecutive valid sources add no new material mechanism; or
- five consecutive searches fail to add a qualifying source.

### 10.3 Source record

Every source records:

- URL and access date;
- page and viewport inspected;
- source type and geographic context;
- archetype, vertical, ticket, and business-model comparability;
- mechanisms observed;
- limitations and transfer risks;
- screenshot or extract reference;
- confidence.

Each statement is labeled:

- `OBSERVED`: visible in the inspected interface;
- `DECLARED`: claimed by the source;
- `INFERRED`: researcher interpretation;
- `VALIDATED`: supported by a test or metric.

Published design is not automatically `VALIDATED`. Pinterest, Behance, and Dribbble may inspire visual exploration but cannot prove commercial effectiveness.

## 11. Pattern Inventory

References are converted into pattern cards, not copied screens. Each card contains:

```yaml
id: PATTERN-###
buyer_tension: ""
mechanism: ""
evidence_ids: []
observed_context: ""
applicability: ""
transfer_risk: ""
anti_pattern: ""
reuse_constraint: ""
hypothesis: ""
affected_metric: ""
confidence: low | medium | high
```

Adoption rules:

- a material pattern needs two independent references or an explicit single-source exception;
- no single source may originate more than 25% of adopted mechanisms;
- copy, media, logos, proprietary illustrations, and trade dress are never reused;
- a complete section sequence is not a reusable pattern;
- global examples inform mechanism/quality, while Brazilian and local examples constrain operation, language, payments, logistics, and WhatsApp behavior.

## 12. Wireframe Package

### 12.1 Primary wireframe

The primary is mobile-first and covers the minimum critical journey. Every block is annotated with:

```text
user objective | business objective | evidence IDs | hypothesis | risk | metric/test
```

The wireframe uses realistic content lengths and available media slots. It does not use polished branding to conceal information-architecture weakness.

### 12.2 Challenger sketch

One low-resolution challenger tests the most consequential structural alternative, normally:

- transaction/task-first; or
- trust/story-first.

A second complete wireframe is never created inside the current run. If two genuinely plausible primary journeys require complete alternatives, P6 returns `ROLLBACK` and a new experiment charter must scope and budget the comparison. Differences between reviewer scores are absorbed conservatively by using the lower score; they never create another direction.

### 12.3 Scorecard

`wireframe/scorecard.md` is the immutable rubric/template frozen before R1. It contains criteria, weights, eligibility thresholds, and tie-break rules only; it never stores reviewer scores. All scores and rationales exist solely in the separate locked `reviews/P6/r{N}-{qa|pm}.yaml` submissions and the post-lock `aggregate.md`.

| Criterion | Weight |
|---|---:|
| clarity of primary action | 25 |
| fit to purchasing archetype | 20 |
| strength and traceability of evidence | 20 |
| friction and risk reduction | 15 |
| mobile and real-content feasibility | 10 |
| differentiation without copying | 10 |

`@qa` and `@pm` score each direction independently without seeing the other reviewer's submission. A direction is **eligible** only when:

- both individual reviewer scores are at least 80/100;
- no critical factual, journey, accessibility, or content blocker remains; and
- the cognitive walkthrough completes the primary task without a dead end.

Each eligible direction's governing score is the lower of its two reviewer totals. The P6 state machine in Section 13.3 determines whether zero, one, or two eligible directions advance. A governing-score gap below five points cannot be resolved by preference. Combining directions is allowed only when every imported element has an independent rationale and the result fits inside the single correction allowance.

## 13. Review Loop and Governance

### 13.1 Separation of roles

- The researcher does not approve source quality alone.
- The wireframe maker does not approve the wireframe.
- The reviewer receives the artifact and rubric before receiving the maker's persuasive rationale.
- Clones advise within their domain; they do not validate facts or replace gates.
- `@aios-master` arbitrates process conflicts but cannot waive a blocking gate.

### 13.2 General phase release checks

For P0, P1, P2, P2A, P3, P4, P5A, P5B, and P8, the reviewer named in Section 7 performs the release check inside that phase's timebox. A failure permits one owner correction and one recheck by the same independent reviewer. The recheck produces `PASS`, `ROLLBACK`, or `STOP`; it does not open another correction. These checks use the phase gate, not the P6 scorecard. A load-bearing P5A change follows the mandatory new-run rollback in Section 6.2 instead of this ordinary correction path.

### 13.3 P6 deterministic state machine

```text
wireframe maker freezes primary + challenger
  → R1: @qa and @pm submit locked, blind, independent per-direction scores
  → aggregate only after both R1 submissions exist
  → apply the outcome table below
  → if outcome is CORRECT: one correction, limited to 1 h
  → R2: the same two roles re-score independently
  → apply the outcome table without permitting further correction
```

| Locked round result | R1 outcome | R2 outcome |
|---|---|---|
| zero eligible directions | apply blocker classification below | `ROLLBACK` when an earlier-phase input must change; otherwise `STOP` |
| exactly one eligible direction | eligible direction `PASS` | eligible direction `PASS` |
| two eligible; governing-score gap ≥5 | higher governing score `PASS` | higher governing score `PASS` |
| two eligible; governing-score gap <5 | focused comparison becomes the single `CORRECT` activity | apply deterministic tie-break below |

Blocker classification for zero eligible directions in R1 is deterministic:

- `ROLLBACK` when any failure requires changing the experiment charter, candidate readiness, primer, prospect delta, evidence/media provenance, legal constraint, primary task, or primary archetype.
- `CORRECT` only when every failure is confined to wireframe hierarchy, sequence, CTA clarity, annotation completeness, or another P6-owned decision and the maker estimates the complete correction at no more than one hour.
- `STOP` when the failures are neither earlier-phase rollback issues nor fully correctable inside one hour.

For two eligible directions still separated by less than five governing-score points in R2, `@architect` records the first decisive rule in this fixed order:

1. higher lower-reviewer score on **strength and traceability of evidence**;
2. higher lower-reviewer score on **friction and risk reduction**;
3. the primary wireframe, because it is the complete baseline and introduces no extra structural scope.

The architect cannot change scores, waive an eligibility threshold, request new design work, or choose outside this tie-break. The one-hour correction may revise the primary and challenger, but it may not create a second complete wireframe. If correction requires a new complete direction, P6 returns `ROLLBACK` for a newly chartered run.

### 13.4 Stop rules

- Maximum two checks and one correction for a failed general phase gate.
- P6 has exactly the R1/correction/R2 sequence above; a PASS in R1 skips correction and R2.
- “Could be better” is not a finding; every rework request cites a failed gate.
- A critical blocker still present in the final check returns to the earliest named owning phase among P0, P1, P2, P2A, P3, P4, P5A, or P5B. If no earlier-phase input can resolve it inside a newly chartered run, the candidate stops. G1/G2 is used only when candidate material-problem or journey-readiness evidence is the root cause.
- The architect may record only the deterministic R2 tie-break and cannot request or start another correction.
- Improvement without a measurable change to evidence, hypothesis, risk, or test counts as zero.
- A new reference after research freeze enters only to close a documented evidence gap.

## 14. Static Preview and Functional Prototype Boundary

### 14.1 Pre-commercial static preview

The preview consists of exactly three reviewable files derived from the approved wireframe:

- `mobile-375x812.png`;
- `desktop-1440x1000.png`;
- `preview-pack.pdf`, containing the two compositions, concept label, evidence legend, and limitations.

The files may contain polished desktop/mobile compositions, but they must remain:

- private and local;
- nonfunctional;
- noninteractive, with no HTML, executable code, clickable prototype, or live route;
- free of backend, checkout, CMS, analytics, or production integration;
- clearly identified as a concept;
- based only on approved facts and first-party media;
- excluded from public deployment or automatic delivery.

Its purpose is to make the proposed mechanism understandable in the Stage 1 `Dor → Teach → Reveal` conversation.

### 14.2 Paid functional prototype

A functional private prototype starts only after the paid Stage 2 trigger defined by ADR-0001 and a separate implementation plan. It may implement the approved critical journey, but it remains distinct from production launch.

Any decision to build a functional bespoke prototype before payment requires a superseding ADR explicitly approved by the Founder.

## 15. Error Handling and Rollback

| Condition | Required action |
|---|---|
| candidate fails G0 | exclude or replace candidate |
| problem cannot be reproduced | return to longlist; do not research deeply |
| archetype remains hybrid/ambiguous | hold and split journey or choose another candidate |
| weak reference bucket | leave quota incomplete and search by mechanism; never add filler |
| research saturation not reached at 12 sources | record unresolved gap and stop for adjudication |
| pattern dominated by one source | reject or triangulate the pattern |
| wireframe lacks realistic content/media | return to G2 |
| same critical issue fails twice | rollback to the earliest phase that owns the failed input; if none can resolve it, stop candidate |
| post-freeze change alters more than 20% of structure | end the current run with `ROLLBACK`; a new experiment charter is required |
| unknown requires user behavior | stop research and define an experiment |
| prototype requested before paid Stage 2 | block and request an ADR decision |
| external contact, send, publish, deploy, or spend requested | require explicit human approval |

## 16. Quality and Testing

### 16.1 Research checks

- 100% source records contain URL, date, context, limitations, and confidence.
- Material decisions have at least two evidence IDs or a documented exception.
- Exclusions and anti-references remain visible.
- Broken or blocked URLs are replaced or marked; they are never silently treated as inspected.

### 16.2 Wireframe checks

- mobile-first critical path is complete;
- one dominant CTA and conversion event are identifiable;
- cognitive walkthrough completes the primary task without a dead end;
- labels, hierarchy, price/payment, delivery, trust, and WhatsApp behavior match the vertical and prospect;
- every material block has the required annotation;
- challenger addresses a real structural uncertainty;
- accessibility is considered before visual polish, including reading order, target size, contrast intent, error prevention, and reduced motion implications.

### 16.3 Static preview checks

- 375px and 1440px compositions exist;
- no factual claim or media lacks provenance;
- no reference supplies copied copy, media, or dominant composition;
- content lengths are realistic;
- the preview is visibly nonproduction and remains private;
- an independent visual and evidence reviewer returns PASS.

### 16.4 Functional prototype checks

Defined in the later implementation plan, at minimum:

- responsive critical journey;
- accessibility and keyboard behavior;
- zero console errors or dead ends;
- performance budgets;
- evidence/content truth;
- visual regression;
- anti-clone review;
- repository lint, typecheck, and test gates.

## 17. Planned Artifact Structure

This section is authoritative for artifact paths.

```text
.aios-core/data/site-prospector/primers/
└── {vertical-id}.yaml                  # canonical, schema-versioned vertical primer

docs/projects/site-prospector/03-proposal-mockups/{experiment-id}/
├── experiment-charter.md
├── research/
│   ├── reference-scout.md
│   ├── reference-atlas.md
│   ├── pattern-inventory.md
│   └── exclusions.md
├── candidate/
│   ├── readiness.md
│   ├── evidence-register.md
│   ├── media-manifest.md
│   └── prospect-delta.yaml             # prospect overrides; never merged into primer
├── primer/
│   ├── input-snapshot.yaml             # complete immutable research-input primer
│   ├── input-snapshot.sha256
│   ├── bootstrap-draft.yaml            # bootstrap mode only; status=draft
│   ├── baseline-canonical.yaml          # reassessment mode only; old canonical state
│   ├── baseline-canonical.sha256        # reassessment mode only
│   ├── primer-change-proposal.yaml     # reassessment mode only
│   ├── output-snapshot.yaml            # complete immutable P5A primer used downstream
│   └── output-snapshot.sha256
├── wireframe/
│   ├── primary.md
│   ├── challenger.md
│   ├── scorecard.md                    # immutable rubric only; no reviewer scores
│   └── walkthrough.md
├── reviews/
│   └── {phase-id}/
│       ├── round-1.md                   # general phase reviewer
│       ├── round-2.md                   # general phase recheck, when required
│       ├── r1-qa.yaml                   # P6 only; blind and locked before aggregation
│       ├── r1-pm.yaml                   # P6 only; blind and locked before aggregation
│       ├── r2-qa.yaml                   # P6 only, when correction occurs
│       ├── r2-pm.yaml                   # P6 only, when correction occurs
│       ├── aggregate.md                 # generated only after both role submissions exist
│       └── adjudication.md              # optional; cannot authorize more rework
├── preview/
│   ├── mobile-375x812.png
│   ├── desktop-1440x1000.png
│   └── preview-pack.pdf
└── prototype/                 # created only after paid Stage 2
```

Existing folders remain legacy inputs and are not moved or overwritten by this design.

### 17.1 Artifact production responsibility

| Artifact | Producer | Phase |
|---|---|---|
| `research/exclusions.md` | `@analyst` | P1/P3 |
| `candidate/evidence-register.md` | `@analyst` | P2 |
| `candidate/media-manifest.md` | `@analyst` | P2 |
| complete primer input snapshot/hash or bootstrap draft | `@ux-design-expert` | P2A |
| `primer/primer-change-proposal.yaml` | `@ux-design-expert` | P2A/P5A |
| canonical primer and complete output snapshot/hash | `@ux-design-expert` | P5A |
| `candidate/prospect-delta.yaml` | `@ux-design-expert` | P5B |
| `reviews/{phase-id}/round-{N}.md` | named independent reviewer | phase release check |
| `reviews/P6/r{N}-{qa|pm}.yaml` and `aggregate.md` | `@qa`, `@pm`, then `@aios-master` aggregates mechanically | P6 |
| `reviews/P6/adjudication.md` | `@architect` | P6, only when triggered |

## 18. First Experiment

This is an **internal, noncommercial process dry-run**. It does not replace, complete, or modify the three-prospect Blumenau artisanal-bakery commercial pilot accepted by ADR-0001. That pilot remains the operative commercial validation until a superseding ADR is explicitly approved. The dry-run creates no outreach, price presentation, payment request, functional build, or claim about willingness to pay.

### 18.1 Objective

Validate operational efficiency and evidence quality of the corrected research-to-preview pipeline. The run does not compare niches, test commercial willingness to pay, or claim that one archetype is commercially superior.

### 18.2 Candidate

**Dedana Boutique**, provisionally classified as DTC high-consideration in premium women's fashion.

Dedana is not frozen automatically by this specification. It must pass a fresh G0–G2 check. The visible pricing/promotion anomaly may be temporary, and an existing agency or migration may explain the current state.

Because the active primer registry currently lists no premium-women's-fashion primer, P0 is expected to select **bootstrap** mode after verifying the registry. This expectation is not a substitute for the P0 check.

### 18.3 Holds

- **Keio Pet:** hold until the representative/wholesale channel and need for a digital catalog are verified.
- **Acquas:** hold until domain ownership and migration status are clarified.

### 18.4 Manual-only rule and budgets

P0–P6 and P8 are executed manually with existing tools and document/image artifacts. No new pipeline skill, generator, or automation is coded during this dry-run, preserving ADR-0001's manual-pilot constraint.

All phase caps below are **elapsed wall-clock time**, not summed agent labor. In each P6 round, `@qa` and `@pm` review concurrently: one round consumes at most 45 elapsed minutes and at most 90 reviewer-minutes. Across two rounds, P6 review therefore consumes at most 1.5 elapsed hours and 3 aggregate reviewer-hours.

- shared charter, scout, deep reference, synthesis, and primer layer: maximum 7 h, amortizable;
- candidate readiness and prospect delta: maximum 75 min combined;
- wireframe plus challenger: maximum 2 h, with at most 1 additional hour for the single permitted correction;
- P6 review: maximum 45 elapsed minutes per round with two concurrent reviewers, two rounds maximum;
- static PNG/PDF preview pack: maximum 2 h;
- total candidate-specific dry-run work: maximum 8 h, excluding the shared layer.

Maximum planned arithmetic:

- shared: P0 `0.5 h` + P1 `1.5 h` + P2A `0.5 h` + P3 `2 h` + P4 `1.5 h` + P5A `1 h` = **7 h**;
- candidate-specific elapsed time: P2 `0.75 h` + P5B `0.5 h` + P6 creation `2 h` + maximum P6 correction `1 h` + two concurrent P6 review rounds `1.5 h` + P8 `2 h` = **7.75 h**, leaving **0.25 h** contingency inside the 8 h wall-clock cap;
- P6 reviewer labor: two roles × two rounds × `0.75 h` = **3 aggregate reviewer-hours**, recorded separately from elapsed time.

Exceeding a timebox requires scope reduction, candidate replacement, or a recorded decision. It does not silently extend the loop.

## 19. Risk Matrix

| Risk | Probability | Impact | Score | Mitigation |
|---|---:|---:|---:|---|
| solving a temporary or nonexistent problem | 4 | 5 | 20 | G0–G2 before deep research |
| functional build before commercial signal | 4 | 5 | 20 | static/functional boundary and ADR block |
| generic cross-niche template | 4 | 4 | 16 | archetype + vertical primer + prospect delta |
| benchmark clone or trade-dress transfer | 3 | 5 | 15 | pattern cards, 25% dominance cap, independent review |
| unbounded research/review loop | 4 | 3 | 12 | saturation rules, timeboxes, two rounds |
| correlated agent/clone consensus | 3 | 4 | 12 | role separation, blind-first review, factual gates |
| low-budget or media-poor candidate | 4 | 3 | 12 | G0/G1 and first-party media gate |
| ambiguous hybrid journey | 3 | 4 | 12 | one primary archetype or HOLD |
| stale or inaccessible references | 2 | 3 | 6 | access dates, backups, explicit unknowns |

## 20. Acceptance Criteria

- [ ] AC1: Every experiment freezes exploration, comparison, or operational-efficiency intent before research.
- [ ] AC2: A six-source scout occurs before deep design work.
- [ ] AC3: Candidate deep research starts only after G0–G2 PASS.
- [ ] AC4: The deep pack contains qualifying comparable, Brazilian/local, and anti-reference evidence and stops by saturation or hard cap.
- [ ] AC5: Every adopted material mechanism has traceable evidence or a documented exception, and no source dominates more than 25%.
- [ ] AC6: P0 selects reuse, bootstrap, or reassessment; P2A and P5A create complete immutable primer copies with verified SHA-256 files; load-bearing P5A changes force a new-run rollback; candidate data remains only in the separate prospect delta.
- [ ] AC7: The annotated primary and challenger receive separate locked blind scores from `@qa` and `@pm`, and the zero/one/two-eligible-direction state machine produces a deterministic outcome.
- [ ] AC8: General phase checks and P6 reviews are gate-linked and allow at most one correction; any final adjudication authorizes no additional rework or threshold waiver.
- [ ] AC9: The pre-commercial artifact is exactly two fixed-size PNG compositions plus one private, noninteractive, evidence-safe PDF pack.
- [ ] AC10: A functional prototype starts only after paid Stage 2 and a separate approved plan.
- [ ] AC11: No contact, send, publication, deployment, purchase, or push occurs without the required authority.
- [ ] AC12: The first experiment makes only operational-learning claims and does not infer which niche performs best.
- [ ] AC13: P0–P6 and P8 remain manual and introduce no new pipeline skill, generator, or automation code.
- [ ] AC14: The Dedana dry-run does not replace or count toward the ADR-0001 artisanal-bakery commercial pilot.

## 21. Definition of Done for This Design

- The Founder approves the process and static/functional boundary.
- An independent spec reviewer finds no planning-blocking issue, or—after the five-cycle ceiling—the Founder explicitly accepts the correction to the final disclosed issue.
- Serious review findings are corrected and re-reviewed, up to five cycles.
- The final spec contains no unresolved draft marker or contradictory gate.
- The Founder reviews the written spec before implementation planning begins.
- The next step is a separate implementation plan; no wireframe or prototype is built directly from this document.

## 22. Consultation and Dissent Record

Two cross-review rounds were completed among independent process roles:

- architecture proposed federated cells and preserved the ADR boundary;
- research/UX introduced purchasing archetypes, mechanism extraction, provenance labels, and evidence-annotated wireframes;
- adversarial QA added candidate-readiness gates, anti-reference coverage, stop rules, and the static-preview boundary.

Key resolved dissents:

- **References before candidate vs candidate before references:** shallow scout before candidate; deep pack after candidate readiness.
- **Five vs ten references:** six-source scout; seven-source deep base; expand only to resolve a real gap, maximum twelve.
- **One vs two wireframes:** one complete primary plus one structural challenger; genuine journey ambiguity requires a newly chartered comparison run rather than another complete wireframe inside the current run.
- **Prototype before payment:** static preview before commercial signal; functional prototype only after paid Stage 2.

Consultations were requested from Donald Miller, Oli Gardner, Brad Frost, Don Norman, and April Dunford through the brain bridge. Their asynchronous responses were still pending when this design was drafted. No statement in this specification is represented as their response. Their locally versioned framework cards were used only as advisory lenses: problem before solution, one purpose/CTA, mechanism-level composition, human-centered task validation, and positioning before messaging.

### 22.1 Independent spec-review history

| Cycle | Result | Blocking issues | Resolution |
|---:|---|---:|---|
| 1 | Issues Found | 6 | separated primer/delta, reconciled budgets/reviews, fixed score and preview contracts, isolated Dedana dry-run |
| 2 | Issues Found | 2 | added primer lifecycle modes and merged duplicate wireframe review phases |
| 3 | Issues Found | 3 | made snapshots complete, specified P6 artifacts/outcomes, budgeted correction |
| 4 | Issues Found | 4 | unified primer input, removed second wireframe, made outcomes deterministic, separated elapsed/reviewer effort |
| 5 | Issues Found | 1 | normalized rollback to the phase owning the failed input and made >20% structural change require a new run |

The fifth issue was corrected after the review returned. Per the brainstorming workflow, no sixth independent review was dispatched; the correction and review ceiling are disclosed to the Founder for the written-spec gate.

## 23. Review Triggers

Reopen this design when any occurs:

- Founder approves a functional pre-payment prototype and supersedes ADR-0001;
- the first experiment cannot fit the eight-hour candidate-specific dry-run budget;
- the archetype classifier fails to assign a primary journey;
- a vertical primer cannot reach evidence saturation within twelve sources;
- anti-clone review shows repeated dependence on one benchmark;
- two candidates fail at the same gate, suggesting a pipeline rather than candidate defect;
- commercial evidence shows that the static preview is insufficient or excessive;
- the project changes geography, offer, price, or primary acquisition channel.
