# Site Prospector — Confectionery Prospect Mockup Pipeline

**Date:** 2026-07-13  
**Author:** Orion (`aios-master`)  
**Project:** Site Prospector  
**Status:** Approved design; pending spec review  
**Decision:** Hybrid pipeline for a first batch of three confectionery businesses

## 1. Executive Summary

Build a repeatable, evidence-led pipeline that selects three confectionery or
dessert businesses with no institutional website, only a catalog/link hub, or a
materially obsolete website. For each selected business, the pipeline researches
world-class references from the same commercial niche, collects traceable public
facts and business-owned media, synthesizes a brand-specific `DESIGN.md`, defines
a measurable value thesis, and produces a private desktop/mobile sales mockup.

The chosen approach is hybrid: research methods, conversion patterns, quality
gates, and invisible implementation primitives may be shared within the niche;
brand expression, layout composition, content, media, value thesis, and mockup
remain unique to each prospect. The pipeline runs sequentially so that lessons
from prospect 1 improve prospects 2 and 3.

The batch is complete only when all three prospects pass evidence, brand,
anti-AI, conversion, visual, and technical gates. Nothing is sent externally;
Breno reviews each private prospect pack and performs outreach himself.

## 2. Context and Problem

The existing Site Prospector repository contains:

- A list of confectionery prospects in Blumenau.
- A wider July 2026 list of 100 local-business prospects.
- A partial Maria Mole visual proposal.
- A Dona Hilda dry run and per-vertical primer experiments.
- Quality, attribution, legal, and production gate definitions.

The formal May–June pilot did not record a commercial verdict, while new July
research and mockup artifacts remain local and untracked. The new batch must not
repeat the project's documented anti-pattern: building attractive sites before
validating whether the proposal creates commercial interest.

The real decision is not “which pretty site should be copied?” It is:

> Which three same-niche businesses have the clearest digital gap, enough
> authentic brand evidence, and a plausible measurable path from a better web
> presence to more qualified commercial actions?

## 3. Goals

1. Prioritize businesses with no institutional website or a materially obsolete
   website.
2. Research world-class websites from the same niche and extract reusable
   conversion and design patterns.
3. Use only traceable public facts and business-owned media in the mockups.
4. Produce a brand-specific `DESIGN.md` for each prospect.
5. Tie every material page section to a customer pain, mechanism, action, and
   measurable business outcome.
6. Produce three visually distinct, high-quality private prospect mockups that
   do not look machine-generated.
7. Create a repeatable process that can move to another niche after this batch.

## 4. Non-Goals

- Deploying a production website for any prospect.
- Sending messages, proposals, or files to a prospect automatically.
- Claiming guaranteed revenue, customers, rankings, or conversion lifts.
- Reproducing a benchmark's page, copy, brand, trade dress, or media one-to-one.
- Using AI-generated, stock, directory-owned, or reviewer-owned imagery as if it
  belonged to the prospect.
- Building an autonomous crawler for the full list of 100 prospects in this
  first batch.
- Mixing benchmarks from unrelated industries or visual archetypes.

## 5. Approved Product Decisions

| Decision | Approved value |
|---|---|
| Batch size | 3 prospects |
| First niche | Confectioneries, dessert shops, and closely equivalent bakeries |
| Approach | Hybrid: shared niche intelligence, bespoke prospect expression |
| Execution | Sequential: prospect 1 → QA/learning → prospect 2 → prospect 3 |
| Outreach | Human-only, performed by Breno |
| Mockup status | Private sales artifact, not production deployment |
| Media | Prospect-owned official public media with provenance manifest |
| Benchmarks | Same niche; 10 mapped, 5 global anchors + 2 local, 3 extracted |
| Originality | Recomposition from 3+ independent references; no one-to-one clone |

## 6. Pipeline Architecture

```text
candidate universe
  → current website verification
  → candidate scoring
  → official-media availability gate
  → freeze three prospects
  → shared niche benchmark research
  → per-prospect evidence dossier
  → brand DESIGN.md
  → value/ROI thesis
  → bespoke desktop/mobile mockup
  → six quality gates
  → private prospect pack
```

### 6.1 Shared niche layer

The following artifacts may be reused for all three prospects:

- Research plan and source-scoring method.
- Benchmark index and benchmark `DESIGN.md` extracts.
- Conversion-pattern library for confectionery purchasing occasions.
- Accessibility, performance, truth, and provenance gates.
- Technical mockup primitives that are visually neutral.
- Anti-clone comparison method.

### 6.2 Bespoke prospect layer

The following must be unique per prospect:

- Candidate score and evidence record.
- Business facts, review themes, products, and commercial opportunities.
- Media manifest and selected media.
- Brand `DESIGN.md` and its provenance/confidence annotations.
- Page narrative, information architecture, and layout composition.
- Pain/mechanism/action/metric model.
- ROI assumptions and scenario model.
- Desktop and mobile mockup.
- QA report and private outreach pack.

## 7. Candidate Selection

### 7.1 Score

Candidates are scored out of 100.

The approved geography for this batch is **Blumenau city limits**. A business
outside Blumenau is rejected even when it serves Blumenau. Every scored field
must link to captured evidence; an unverified field scores zero until resolved.

| Dimension | Weight | Evidence |
|---|---:|---|
| Website gap | 40 | Current website verification and captured evidence |
| Commercial vitality | 20 | Active business, recent official activity, recent reviews |
| Official media availability | 15 | Traceable logo, product photos, video, catalog |
| Revenue opportunity | 15 | Orders, events, delivery, gift, catering, local discovery |
| Outreach feasibility | 10 | Local geography, reachable channel, identifiable decision-maker |

Website-gap scoring:

Apply the following mutually exclusive decision tree in order:

1. If the business has an owned institutional website, ignore rows 2–3 and
   score that site as follows:
   - At least two critical failures: `30/40`.
   - Exactly one critical failure, or zero critical failures plus at least three
     major weaknesses: `25/40`.
   - Zero critical failures plus one or two major weaknesses: `15/40` and
     therefore ineligible for this batch.
   - Zero critical failures and zero major weaknesses: `0/40`; classify as
     modern/effective and automatically `REJECT`.
2. If no owned institutional website exists but a third-party catalog, ordering
   platform, marketplace storefront, or branded link hub exists: `35/40`.
3. If neither row 1 nor row 2 exists and the business is limited to social,
   map/profile, directory, phone, or messaging presence: `40/40`.

An **owned institutional website** is a first-party website controlled and
branded by the business that can independently present its identity, current
offer, contact/location information, and a commercial action. A social profile,
GBP/Maps profile, directory entry, marketplace storefront, link hub, or a
third-party ordering/catalog page is not an owned institutional website.

A **critical failure** is one of the following reproducible findings:

1. The site is unavailable, returns a persistent `5xx`, has invalid TLS, or
   triggers a browser unsafe/malware warning.
2. At 375px, horizontal overflow exceeds 20px or navigation/primary CTA cannot
   be reached and operated.
3. The primary order, quote, booking, phone, or WhatsApp action is broken.
4. Name, address, or phone conflicts with current official sources in at least
   two required fields.

A **major weakness** is one of the following reproducible findings:

1. Median of three Chrome Lighthouse mobile runs has Performance below 75.
2. Median of three Chrome Lighthouse mobile runs has Accessibility below 90.
3. No current, indexable product/service or occasion information is available.
4. Current hours, location, or contact information is absent.
5. Responsive checks fail at either 375px or 1440px, without meeting the
   critical-overflow threshold.
6. The current primary path to order/contact requires an avoidable third-party
   detour and is not visible in the first viewport.

A site is **modern and effective** for this batch only when it has valid HTTPS,
zero critical failures, zero major weaknesses, median mobile Performance of at
least 75, Accessibility of at least 90, current name/address/phone data, and a
working first-viewport primary action. These definitions, the ordered decision
tree, and the fixed scores eliminate reviewer discretion and overlapping
categories.

Commercial-vitality scoring (`20` points):

- Active registry/business status confirmed: `5`; unconfirmed or inactive: `0`.
- Most recent official post/activity ≤30 days: `5`; 31–90 days: `3`; older: `0`.
- Current public offer breadth ≥10 products/services: `5`; 4–9: `3`; 1–3: `1`; none: `0`.
- Recent independent review activity: ≥10 reviews in 12 months: `5`; 3–9: `3`;
  1–2: `1`; none or unverifiable: `0`.

Official-media scoring (`15` points):

- Traceable current logo or wordmark: `3`.
- Eight approved official still images: `3`; twelve or more: `6`.
- At least one traceable official video: `3`.
- Approved media covers at least three of product, place, people, process, and
  packaging: `3`.

Revenue-opportunity scoring (`15` points; `5` each):

- A high-intent action such as ordering or requesting a quote is materially
  obscured or fragmented in the current journey.
- A publicly evidenced high-value occasion such as events, gifts, catering, or
  celebration orders lacks an effective web destination.
- Local discovery/trust information is absent, inconsistent, or dependent on a
  third-party platform.

Each item scores `5` only with captured evidence; otherwise it scores `0`.

Outreach-feasibility scoring (`10` points):

- Verified Blumenau-city address: `4`.
- Working official phone, WhatsApp, email, or social contact channel: `3`.
- Decision-maker or clearly responsible public business contact identified: `3`.

Decision thresholds:

- `75–100`: `PASS` — eligible for the batch.
- `60–74`: `HOLD` — missing evidence must be resolved.
- `0–59`: `REJECT`.

Before applying total-score thresholds, enforce eligibility gates. A
website-gap score below `25/40` is automatic `REJECT` regardless of total score.
Automatic rejection also applies to franchises, businesses outside the approved
geography, inactive businesses, or businesses whose current site already solves
the identified customer job well. Only candidates that survive every automatic
gate may be classified by the `75/60` total-score thresholds.

Ties are resolved deterministically by: higher website-gap score, then higher
official-media score, then higher revenue-opportunity score, then most recent
official activity timestamp, then ascending normalized business slug.

### 7.2 Provisional shortlist

Repository evidence suggests the following initial candidates, but none is
frozen until current web verification is complete:

1. Maria Mole Doces — catalog/ordering presence without a strong institutional
   presence; existing official asset evidence in the repository.
2. Dora Marie — Instagram-first presence; institutional site not confirmed.
3. Vanessa Hayashi Doceria — third-party catalog presence; own institutional
   site not confirmed.

If a candidate fails any mandatory gate, the next highest scoring same-niche
candidate replaces it. Missing media is never filled with generated imagery.

## 8. Research Plan v1

### 8.1 Decision to inform

Freeze three prospects and decide the most defensible conversion and design
direction for each private mockup.

### 8.2 Non-negotiable constraints

- Same-niche benchmarks only.
- Official first-party media or traceable business-owned public media only.
- Facts current at capture time and attached to sources.
- No fabricated testimonials, products, prices, hours, metrics, or outcomes.
- No exact benchmark clone.
- No external outreach or publication.
- Mobile-first, accessible, and performant output.
- One prospect at a time.

### 8.3 Initial hypotheses

| Hypothesis | Initial confidence | Falsifier |
|---|---:|---|
| Businesses with active social audiences but no institutional site have a visible trust/discovery gap | 70% | Current behavior shows the ordering hub already solves discovery and trust |
| Official media is sufficient for premium mockups | 60% | Fewer than eight traceable, usable official assets for most finalists |
| Same-niche benchmark patterns can improve conversion without cloning | 75% | Anti-clone review finds one source dominates the final composition |
| A concrete value thesis will be more persuasive than a visual reveal alone | 80% | Prospects engage with visuals but reject or ignore the business case |
| Three sequential bespoke mockups are operationally affordable | 60% | Research and production exceed the agreed timebox without reusable learning |

### 8.4 Active dimensions

- **Market/business:** prospect viability, customer jobs, conversion mechanisms,
  and potential return.
- **Technical/design:** feasibility, responsive behavior, performance,
  accessibility, and `DESIGN.md` extraction.
- **Regulatory/provenance:** public data handling, asset authorship, truthful
  advertising, and private-versus-public use boundaries.

### 8.5 Master questions

1. Does the business currently lack an effective institutional website?
2. What high-value customer jobs are poorly served by its present channels?
3. Which patterns recur across world-class websites in the exact niche?
4. Which patterns are conversion mechanisms versus decorative fashion?
5. What brand assets and facts are official, current, and traceable?
6. What makes the prospect recognizably itself rather than a benchmark clone?
7. Which page actions plausibly connect to business value?
8. What evidence would invalidate the proposed direction?

### 8.6 Source hierarchy and scoring

Market-source score:

- Relevance: 50%.
- Recency: 30%.
- Authority: 20%.

Source hierarchy:

1. Official business channels, official catalog, GBP/Maps business profile,
   registry data, and current official website.
2. Current independent review platforms for aggregated voice-of-customer themes.
3. Reputable directories for corroboration only.
4. Search snippets only as discovery pointers, never final evidence.

Claims that affect candidate selection or ROI require a primary source plus
independent corroboration where available. Single-source claims are marked
provisional.

### 8.7 Benchmark depth and stop criteria

- Map at least 10 current global niche references.
- Select 5 global anchors and 2 relevant local references.
- Run `design-md` against the three strongest global references.
- Stop a sub-question after five consecutive sources add no new material pattern.
- Shared niche benchmark research timebox: 4 hours.
- Per-prospect fact/media/value research timebox: up to 2 hours before a
  `PASS`, `HOLD`, or replacement decision.
- Per-prospect brand/value synthesis: up to 1.5 hours.
- Per-prospect mockup implementation: up to 5 hours.
- Per-prospect QA and refinement: up to 1.5 hours.
- Stop-the-line: 10 hours per prospect or 34 total hours including the shared
  four-hour benchmark layer. Exceeding either limit requires a recorded scope or
  candidate decision before more work.

Research continues beyond the timebox only when a single reducible uncertainty
would otherwise invalidate the candidate or value thesis.

## 9. Evidence Model

### 9.1 Business facts

Each fact records:

- Claim.
- Value.
- Source URL.
- Source type.
- Captured date/time.
- Confidence: `high`, `medium`, or `low`.
- Contradicting evidence, if any.

Required facts include name, business status, address, contact channels, hours,
products, prices when public, ordering channels, delivery/event capabilities,
and current website status.

When a required fact is not publicly available, record the literal state
`unknown_not_public` plus the sources checked. Unknown facts are omitted from the
mockup; they are never filled by inference, placeholder copy, or invention.

### 9.2 Media manifest

Every local media file records:

- Exact official source URL.
- Public channel and account identity.
- Authorship/provenance assessment.
- Capture date.
- Media subject.
- Local file path.
- Intended mockup placement.
- Status: `APPROVED`, `HOLD`, or `REJECT`.

Minimum release threshold: eight individually traceable, prospect-owned official
assets plus an identifiable logo/wordmark. Reviewer photos, directory photos,
map photos of uncertain authorship, and third-party stock are rejected.

### 9.3 Reviews

Reviews inform voice-of-customer themes and objections. The pipeline stores:

- Platform and capture date.
- Rating distribution when available.
- Recurrent positive and negative themes.
- Confidence and sample limitations.

The mockup must not present a review as an approved on-site testimonial without
clear traceability and an explicit release decision. Reviewers' media is never
copied.

## 10. `DESIGN.md` Strategy

### 10.1 Prospect brand document

If the prospect has a usable current website, `design-md` extracts its static
visual system. If it has no website, the brand document is a synthesis from
official logo, packaging, catalog, social posts, and business-owned media.

The no-site synthesis must not be described as a website extraction. Every token
and material visual rule includes evidence and confidence annotations.

### 10.2 Benchmark documents

Benchmark `DESIGN.md` files remain separate from prospect brand documents. A
pattern matrix records which reference supports a navigation, merchandising,
content, typography, or conversion pattern.

### 10.3 Anti-clone limits

Against any single reference:

- Color similarity must remain at or below 85%.
- Typography similarity must remain at or below 75%.
- Layout similarity must remain at or below 60%.
- Organism-level composition must draw from at least three independent sources.

Exact copy, media reuse, copy reuse, distinctive trade-dress imitation, or a
page-by-page replica fails the anti-clone gate even if numeric thresholds pass.

The numeric checks are calculated in `anti-clone-matrix.md` against each
benchmark separately:

- **Color similarity:** compare six semantic roles (`primary`, `secondary`,
  `accent`, `surface`, `text`, `border`). A role matches when CIEDE2000
  `ΔE00 ≤ 10`. Similarity is matched roles divided by six.
- **Typography similarity:** compare display family, body family, four principal
  weight assignments, and four normalized type-scale ratios (ten attributes).
  Exact family/assignment matches and scale ratios within 5% count as matches;
  similarity is matched attributes divided by ten.
- **Layout similarity:** compare ten declared features: section order, hero
  composition, navigation pattern, product presentation, occasion/offer block,
  proof block, location block, primary CTA placement, footer composition, and
  distinctive decorative motif. Similarity is identical features divided by ten.

The matrix stores the observed values, calculation, screenshot reference, and
reviewer decision. Any threshold breach is a hard `REFINE` even when the reviewer
believes the result “looks different enough.”

## 11. Value and ROI Model

Every major section in a mockup must answer:

1. **Pain:** What observable loss or friction exists now?
2. **Mechanism:** How does the proposed page change the customer's journey?
3. **Action:** What qualified behavior should increase?
4. **Metric:** What will be measured after launch?

Common mechanisms in this niche may include:

- Reducing dependence on Instagram for search and trust.
- Making products discoverable by occasion, category, and intent.
- Moving qualified users into a clear WhatsApp ordering flow.
- Making catering, celebration, gift, or event offers visible.
- Providing verified location, hours, process, and reputation signals.

ROI is scenario-based, never promised:

```text
qualified visits
  × contact rate
  × close rate
  × average order or inquiry value
  = modeled incremental opportunity
```

Conservative, base, and optimistic scenarios must expose every assumption. If no
baseline exists, the result is labeled a hypothesis. Suggested post-launch
metrics are WhatsApp clicks, GBP call clicks, route requests, inquiry submissions,
and attributable order/event inquiries.

## 12. Mockup Requirements

Each private mockup must:

- Be a working standalone web artifact, not a flat generated image.
- Include intentional desktop 1440px and mobile 375px behavior.
- Use only approved prospect media and truthful content.
- Have a unique visual direction derived from the prospect's brand evidence.
- Avoid generic AI aesthetics, filler sections, clichéd gradients, repetitive
  card grids, anonymous copy, and invented iconography.
- Provide clear local-business actions without dark patterns.
- Honor reduced motion and accessibility requirements.
- Remain a private proposal marked as such.
- Define one primary conversion goal and maintain one visually dominant primary
  CTA label; secondary navigation may exist only when it supports that goal.

The exact information architecture is bespoke. Common sections are allowed only
when justified by the value model, not because a template contains them.

## 13. Deliverables

```text
docs/projects/site-prospector/03-proposal-mockups/confectionery/
├── research-plan.md
├── benchmark-index.md
├── benchmarks/{brand}/DESIGN.md
├── conversion-patterns.md
├── anti-clone-matrix.md
└── prospects/{slug}/
    ├── candidate-score.md
    ├── evidence/business-facts.json
    ├── evidence/media-manifest.json
    ├── evidence/review-themes.md
    ├── brand/DESIGN.md
    ├── strategy/value-thesis.md
    ├── mockup/index.html
    └── qa/report.md
```

Each prospect's private pack contains:

- Current-presence diagnosis.
- Uncaptured opportunity and supporting evidence.
- Desktop/mobile mockup.
- Scenario-based value model.
- Recommended human next step.

## 14. Error Handling

| Failure | Required response |
|---|---|
| Fewer than eight official media assets | `HOLD`; seek first-party evidence or replace candidate |
| Modern effective site discovered | `REJECT`; replace candidate |
| Business fact conflict | Preserve both sources; resolve or mark provisional |
| ROI claim lacks evidence | Remove claim or relabel as explicit hypothesis |
| One benchmark dominates composition | Recompose and rerun anti-clone review |
| Benchmark URL blocks extraction | Use another qualified reference; do not bypass content gate silently |
| Technical or visual gate fails | Fix before starting the next prospect |
| External publication or outreach requested | Require explicit human approval at that point |

## 15. Quality Gates

### 15.1 Prospect gates

1. **Evidence Gate:** all used facts and media are traceable.
2. **Brand Gate:** `DESIGN.md` is coherent, sourced, and recognizable.
3. **Anti-AI Gate:** output has specific human art direction and no generic filler.
4. **Conversion Gate:** each material section maps to action and metric.
5. **Visual Gate:** desktop/mobile composition, hierarchy, contrast, interaction,
   and inclusive-design rules pass.
6. **Technical Gate:** valid links, no console errors, optimized assets, and
   Lighthouse scores of at least 90 in applicable categories.

Gate outcome per conclusion or artifact: `PASS`, `REFINE`, `HOLD`, or `REJECT`.

Executable pass criteria:

| Gate | PASS criteria |
|---|---|
| Evidence | Every rendered image is `APPROVED` in the media manifest; every rendered factual/numeric claim points to a non-conflicting fact record; unknown facts are omitted; zero reviewer/directory media |
| Brand | `DESIGN.md` passes the pinned `@google/design.md@0.1.0` lint command with exit code 0 and zero reported errors; every top-level token has provenance/confidence; the page visibly uses at least three prospect-specific signals among logo, palette, packaging/product photography, language, and material motif |
| Anti-AI | Zero generated/stock/untraceable media; zero placeholder or generic filler copy; zero repeated full-page skeleton across the three prospects; at least five specific verified business details appear in the rendered page; independent visual reviewer records `PASS` |
| Conversion | One declared primary conversion goal; one primary CTA label; every page section has a row in the value thesis mapping customer job, objection/pain, mechanism, action, and metric; all CTA destinations validate |
| Visual | Screenshots at 375×812, 768×1024, and 1440×1000; no horizontal overflow; body text ≥18px; line-height ≥1.5; touch targets ≥48px with ≥8px separation; body contrast ≥7:1; focus indicator ≥3px and ≥3:1; reduced-motion behavior verified; independent visual reviewer records `PASS` |
| Technical | Served on a local HTTP server; Chrome Lighthouse mobile preset, simulated throttling, median of three runs: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥90; zero console errors; zero broken internal/external CTA links at check time; initial JS ≤80KB gzip; hero AVIF ≤180KB or WebP fallback ≤240KB |

The independent visual reviewer cannot be the person or agent that implemented
the prospect mockup. Any checklist failure blocks progression to the next
prospect.

The executable Brand Gate command for every prospect document is:

```bash
npx --yes @google/design.md@0.1.0 lint "<path-to-DESIGN.md>" --format json
```

The implementation runner invokes this command without a shell, captures stdout
and process exit code, parses stdout as JSON, and atomically stores that exact
JSON beside the document as `lint-report.json`. A missing, invalid, or unwritten
report fails the gate. `PASS` requires process exit code `0` and zero entries
classified as errors; warnings are preserved for review. Benchmark extraction
uses:

```bash
node .agents/skills/design-md/run.cjs --url "<benchmark-url>" --out "<output-directory>"
```

The pinned lint invocation is the repository implementation used by
`.agents/skills/design-md/lib/design-md.cjs` (`runLint`), so the gate does not
depend on an informal reviewer interpretation.

### 15.2 Adversarial review

A reviewer who did not perform the research attempts to invalidate:

- Candidate selection.
- Benchmark independence and industry fit.
- Media provenance.
- Value and ROI assumptions.
- Originality and anti-clone compliance.

Each challenged conclusion is classified as `survives`, `survives with
refinement`, or `falls`. A falling conclusion returns to research or synthesis.

### 15.3 Repository gates

Before the implementation story is considered complete:

```bash
npm run lint
npm run typecheck
npm test
```

Failures attributable to changed files are hard blockers. Pre-existing unrelated
failures are documented and do not authorize unrelated cleanup.

## 16. Implementation Sequence

1. Create and approve the implementation story.
2. Build the shared confectionery research and benchmark layer.
3. Verify and freeze the three current candidates.
4. Story subtask P1: complete prospect 1, including all gates and adversarial review.
5. Story checkpoint L1: record process learnings and adjust shared artifacts.
6. Story subtask P2: complete prospect 2 and repeat the gates.
7. Story checkpoint L2: record new learnings without weakening prior gates.
8. Story subtask P3: complete prospect 3 and repeat the gates.
9. Assemble three private prospect packs.
10. Run repository quality gates and update story checklists/file list.
11. Stop before external outreach; request Breno's approval for any send.

## 17. Acceptance Criteria for the Implementation Story

- [ ] AC1: A current candidate ranking prioritizes no-site and obsolete-site
  confectionery businesses using the approved 100-point score.
- [ ] AC2: Exactly three prospects are frozen only after current web and media
  verification; replacements follow the same score.
- [ ] AC3: The shared niche layer maps at least ten global references, selects
  five global and two local anchors, and contains valid `DESIGN.md` extracts for
  the three strongest extractable references.
- [ ] AC4: Each prospect has traceable business facts, review themes, and a media
  manifest with at least eight approved official assets plus logo evidence.
- [ ] AC5: Each prospect has a brand-specific `DESIGN.md` with provenance and
  confidence annotations.
- [ ] AC6: Each prospect has a value thesis mapping pain, mechanism, action,
  metric, and explicit ROI assumptions.
- [ ] AC7: Each prospect has a working, responsive, private desktop/mobile mockup
  using no unapproved or generated media.
- [ ] AC8: All three mockups pass evidence, brand, anti-AI, conversion, visual,
  technical, and adversarial review gates.
- [ ] AC9: The three outputs are visually distinct and pass anti-clone limits
  against every single benchmark.
- [ ] AC10: No prospect is contacted and no artifact is published or deployed.
- [ ] AC11: Story checklists and file list are current, and relevant lint,
  typecheck, and test gates are recorded.

## 18. Definition of Done

- [ ] Specification and implementation story approved.
- [ ] All acceptance criteria complete.
- [ ] Three private prospect packs complete.
- [ ] Six prospect quality gates pass for each pack.
- [ ] Adversarial review findings resolved or explicitly accepted by Breno.
- [ ] Changed-file and repository quality gates recorded.
- [ ] No external send, deployment, purchase, or push occurred.

## 19. Consultation and Known Limitations

Audit artifact:
`docs/projects/site-prospector/research/2026-07-13-mockup-pipeline-expert-consultation.md`.

Conclave ID: `1112b18a-3286-40e1-a46a-e65373908051`.

Consultations were registered for Erik Nymanczuk, Stephen Hahn, and Anderson
Hernandes. The bridge returned prompts and principles but their full responses
remained pending, so they are not represented as completed endorsements.

The required three-expert design consultation was completed through the local
mind-clone fallback:

- **April Dunford:** frame the competitive alternative as dependence on
  Instagram, catalog hubs, and fragmented discovery—not merely “having no
  website.” Selection therefore favors best-fit prospects with a visible value
  gap, and every private pack aligns position → story → pitch.
- **Oli Gardner:** each mockup declares one conversion purpose, one dominant CTA,
  clear message match, low friction, and only real traceable social proof.
- **Brad Frost:** share atoms, tokens, and invisible primitives while keeping
  organisms, templates, and pages prospect-specific. Tokens remain the bridge
  between evidence, design documentation, and working mockup.

The audit artifact records the exact bridge consultation IDs, pending state,
fallback source paths, SHA-256 hashes, extracted principles, and their direct
mapping to this specification. These recommendations directly produced the
selection rubric, single-goal conversion gate, and hybrid component boundary.

Known residual uncertainties:

- The current website state of provisional candidates may have changed.
- Public official media may be insufficient for one or more candidates.
- Benchmark design extraction may fail on SPA or bot-protected sites.
- The sales effectiveness of mockup-led outreach is irreducible through further
  research and requires human prospect conversations.

## 20. Review Triggers

Revisit this design if:

- Two provisional candidates fail the official-media gate.
- A candidate is found to have a modern effective website.
- Prospect 1 requires more than the planned research/production budget.
- Anti-clone review finds repeated dependence on one benchmark.
- Breno changes the niche, geography, batch size, or outreach offer.
- Legal counsel changes the permitted use of public first-party brand assets in
  private sales mockups.
