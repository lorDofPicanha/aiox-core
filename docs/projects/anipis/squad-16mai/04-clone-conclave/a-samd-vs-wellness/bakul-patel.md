# Bakul Patel — Anipis Regulatory Architecture

**Persona:** Bakul Patel — Digital Health Regulatory Architect (ex-FDA DHCoE, coined SaMD, authored Pre-Cert + GMLP)
**Question:** Wellness Class I vs. SaMD Class IIa vs. Híbrido para Anipis beta em 10-12 semanas, com CFM 2.454/2026 + ANVISA RDC 657/2022 no horizonte
**Project:** Anipis (companion clínico-AI saúde mental BR, ICP 18-29, founder solo)

---

## Opening Reframe

Let me reframe before I prescribe. You guys are asking "wellness or SaMD?" — that is a binary. I never built the SaMD framework as a binary. When I coined Software as a Medical Device at IMDRF and we authored the N12 categorization document, the entire point was to **decompose into dimensions**, not to force founders into a yes/no gate. Anipis is not one product. It is a portfolio of software functions, and each function has its own risk coordinates. Treat it that way and the regulatory architecture writes itself.

## SaMD Two-Dimensional Mapping for Anipis

Apply the framework I authored (now IMDRF SaMD N12, adopted globally including ANVISA RDC 657/2022 which is explicitly harmonized to IMDRF):

| Function | Axis 1 — Patient Condition | Axis 2 — Significance of Information | SaMD Category |
|---|---|---|---|
| Conversational support (psychoeducation, journaling) | Non-serious | Informs management | **I** (lowest) |
| Mood tracking + pattern surfacing | Non-serious to serious | Informs management | **I-II** |
| Safety classifier PT-BR 4-níveis + crisis routing | **Critical** (suicide ideation = critical situation per IMDRF) | Drives management (routes to CVV/SAMU/emergency) | **III** |
| Adjuvant to a licensed psychologist (decision support) | Serious | Drives clinical management | **III** |
| Autonomous diagnosis or treatment | — | Treat/diagnose | **IV — do not build this** |

The crisis routing function alone pulls you into Category III territory because the patient situation is critical. That is the regulatory gravity well you cannot wish away with a Terms-of-Service "we are wellness."

## My Recommendation: Option (c) Híbrido, but architected correctly

Not "wellness with SaMD-grade hygiene." That phrasing is what gets founders into the Character.AI scenario — they self-classified as entertainment, the crisis function failed, and the courts didn't care about the EULA. The dimensions of what your software actually does drive regulation, not what your marketing copy claims.

**The architecture I would build:**

1. **Two product surfaces from day one, technically and legally separated.**
   - *Anipis Wellness* (Class I / RDC 657 não-SaMD): psychoeducation, journaling, mood tracking. Marketed to general population. Launches in 10-12 weeks.
   - *Anipis Clinical Adjunct* (SaMD Categoria III, ANVISA registro): the crisis classifier + clinician-facing dashboard + adjunct decision support. Stays in **beta fechado supervisionado** — every user paired with a licensed psychologist enrolled in your safety committee protocol. This is your evidence-generation engine, not your revenue engine.

2. **The crisis routing is not optional and not deferrable.** Build it to SaMD Category III hygiene from day one even on the wellness surface — because Brazilian courts and CFM 2.454/2026 will not accept "we are wellness so the safety bar is lower." Patient harm is patient harm. This is exactly the lesson from the Character.AI litigation. Excellence over compliance — evaluate the factory, not just the label.

3. **File the ANVISA SaMD registro for the clinical adjunct in parallel** (estimated 12-18 months — start now). Use the beta supervisionado window to generate the real-world performance data you'll need anyway. I would collect the information now so you don't have to go back.

## Mapping FDA SaMD/Pre-Cert to ANVISA + CFM

The good news: ANVISA RDC 657/2022 is **deliberately harmonized to IMDRF SaMD N12** — the framework I authored at FDA is the same one Brazil adopted. The vocabulary translates directly:

- **IMDRF SaMD Categoria III** = ANVISA Classe IIa or IIb (depending on autonomia) = your filing target for the clinical adjunct
- **FDA Pre-Cert (excellence over compliance)** has no direct ANVISA equivalent, **but** RDC 665/2022 (SGQ — Sistema de Gestão da Qualidade) is the upstream factory assessment. Build to RDC 665 from day one. That is your Pre-Cert analog.
- **CFM 2.454/2026** is the *clinical practice* layer (who can use AI in medical decision-making, with what supervision). It does not regulate the software itself — that's ANVISA's lane. But it determines who can prescribe/recommend Anipis Clinical Adjunct. Your safety committee psicólogos + psiquiatra are the CFM-compliant supervising clinicians. Get them contracted before beta launch, not after.
- **GMLP guiding principles** (which I co-authored with Health Canada and UK MHRA) apply to your safety classifier directly — diverse training data, ongoing bias monitoring, predetermined change control plan. Brazil has not yet codified GMLP but ANVISA reviewers cite it.

## The Three Mistakes Brazilian Digital Health Startups Make Here

These destroy time-to-market or expose you to the Character.AI scenario:

1. **Self-classifying as "wellness" to skip ANVISA, when the crisis function is doing SaMD work.** Brazilian Ministério Público and CFM enforcement does not read your ToS. They read what the software actually does when a vulnerable 19-year-old in crisis interacts with it. The wellness label evaporates the moment a user is harmed.
2. **Treating pre-market clearance as the finish line.** Pre-market clearance is one checkpoint in the total product lifecycle. Founders ship, ANVISA approves, and then the model drifts in production, the bias profile shifts, the crisis classifier degrades on new slang — and there is no monitoring infrastructure to catch it. Build the real-world performance monitoring from day one, not after a regulator asks for it.
3. **Building analytics before interoperability.** Interoperability before intelligence. If your safety events, escalations to CVV, and clinician handoffs are not on standardized data structures (FHIR-compatible where possible, LGPD-compliant always), you will have to retrofit when ANVISA asks for performance evidence. Retroactive data infrastructure is exponentially more expensive than designing it in.

## Closing

Speed is an outcome of efficiency in the regulatory system, not a result of cutting steps. The híbrido path is faster than pure SaMD-upfront because the wellness surface generates revenue and learnings while the clinical adjunct accumulates the evidence base ANVISA will require. It is also safer than pure-wellness because the crisis function — your highest-risk component — gets SaMD-grade treatment from day one. That is what risk-proportionate oversight looks like in practice.

---

### (1) One-line recommendation

**Híbrido arquitetural com superfícies técnica e legalmente separadas: Anipis Wellness (Class I) ships em 10-12 semanas + Anipis Clinical Adjunct (SaMD Categoria III, ANVISA upfront, beta fechado supervisionado) inicia trilha regulatória em paralelo — crisis routing builds to SaMD-grade safety em ambas as superfícies, sem exceção.**

### (2) Top 3 risks if ignored

1. **Crisis function failure on the wellness surface = Character.AI scenario in BR jurisdiction.** The wellness label provides zero protection when a 19-year-old is harmed. CFM, Ministério Público, and Conselho Federal de Psicologia will assess the software's actual function, not its marketing. Litigation exposure + permanent brand damage.
2. **CFM 2.454/2026 enforcement window (ago/2026) catches Anipis Clinical Adjunct without a registered supervising clinician structure.** If you ship clinician-facing features before contracting your safety committee under a CFM-compliant supervision protocol, the entire adjunct surface becomes unmarketable to the segment that would actually prescribe it.
3. **No predetermined change control plan + no real-world performance monitoring = ANVISA registro becomes a one-shot grenade.** Every model retraining triggers a re-submission. Speed dies. The total product lifecycle framework exists specifically to prevent this — use it from day one.

### (3) P0 Checklist — Next 2 Weeks

- [ ] **Decompose product into SaMD dimensional map.** Every function classified against IMDRF N12 (patient condition × significance of information). Document risk category per function. This is your regulatory architecture artifact.
- [ ] **Contract the safety committee under CFM-compliant supervision protocol** (3 psicólogos + 1 psiquiatra + 1 advogado LGPD). Without them, the clinical adjunct surface cannot ship even in beta fechado. Lock signed contracts within 14 days.
- [ ] **Initiate ANVISA pre-submission consultation (Reunião de Pré-Submissão)** for the SaMD Clinical Adjunct. ANVISA offers this formally and it derisks the registro pathway by 6-9 months. Submit consultation request this week.
- [ ] **Stand up real-world performance monitoring infrastructure** on the safety classifier — bias monitoring per demographic subgroup, drift detection, crisis-event audit log with immutable storage. Interoperability before intelligence — pick your data schema now (FHIR-aligned where applicable, LGPD-compliant fully). Build this before beta opens, not after.
- [ ] **Draft the Predetermined Change Control Plan (PCCP)** for the safety classifier covering: anticipated modification types (PT-BR slang updates, new crisis taxonomies), validation protocol per update, performance guardrails that must be maintained (sensitivity floor on crisis detection by demographic subgroup), and the monitoring plan that triggers retraining. This is your TPLC artifact and ANVISA will ask for it.

— Bakul, architecting regulatory systems for continuous excellence 🔬
