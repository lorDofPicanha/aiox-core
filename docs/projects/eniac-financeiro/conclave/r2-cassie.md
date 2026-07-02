# R2 — Cassie Kozyrkov (Decision Intelligence) · ENIAC Financeiro · Decision B · ADVERSARIAL

> R1 recap (mine): typed tools guarantee "number correct," not "decision good." Demand provenance/freshness to the glass, calibrated abstention, honest confidence, eval-as-release-gate with deterministic numeric checks + an LLM-judge validated against ~150 human labels (κ). Measure the tail. Zero Sev-1 misleads.

---

## Cross-examination

### (a) Simon's argument-extraction fix: necessary, brilliantly located — and *insufficient on its own*. Here's the precise seam.

Simon did the single most useful thing in R1: he found where the surviving Sev-1 actually lives. The architect (and, frankly, a sloppy reading of me) could walk away thinking "typed tools → number is bound to audited SQL → safe." Simon says no — the model still has to map `"esse trimestre" → 2026-04-01..06-30`, `"fornecedor X" → counterparty_id`, `"a consultoria" → company_id`, and a wrong binding returns **a real, correctly-computed, wrong number**. He's right, and his three fixes — confirm-and-bind chips, deterministic entity resolution that refuses on ambiguity, scope disclosure (n=2 vs n=3) — are *exactly* the right engineering. I adopt all three without reservation. They convert silent arg-extraction errors into visible, human-catchable ones. That is real Sev-1 reduction, not theater.

**But here is where I cross-examine him, and it's not a quibble — it's a different failure class.**

Simon's fix closes the gap between *what the user said* and *what the tool was asked*. It does **nothing** for the gap between *what the tool was asked* and *whether the underlying data deserved a confident answer at all*. Walk the binding chip through my R1 Sev-1: the chip reads **"Saldo consolidado · Empresas: Holding + A + B (n=3) · Período: jun 2026."** Every binding is *correct*. The user nods — yes, that's exactly what I meant. And the number is still a landmine, because:

- Company B's Pluggy sync failed 14h ago — the chip says n=3, the *data* is stale for one of the three.
- 8% of the period's transactions are auto-categorized below the 0.85 confidence floor — the sum is correct over labels that are guesses.
- The intercompany elimination (which Heleno makes legally non-negotiable) was itself computed over a low-confidence categorization.

Simon's chip is an **input-binding** verifier. It confirms the *question* was understood. It is silent on **input-integrity** — whether the data answering that correctly-understood question is fresh, settled, and confidently-labeled. The Sev-1 I warned about in R1 lives in that second gap, and a binding chip that's green on all filters actively *worsens* it, because the chip manufactures the feeling of "I checked, it's right" over data that wasn't decision-grade. **A correct binding over stale/uncertain inputs, displayed confidently, is the exact "right number, wrong decision" failure — and Simon's engineering fix doesn't touch it.**

So my honest verdict on (a): **Simon's fix is necessary and I was under-specified without it. It is not sufficient, and he is under-specified without mine.** The chip needs a second row. Not just *Fornecedor / Empresa / Período* (the bindings), but a **freshness + integrity line** riding the same component: "Sincronizado: B há 14h ⚠ · 8% das transações em baixa confiança (R$ 47k) · 1 item é *previsão*." Same UX primitive — a visible, non-suppressible strip attached to the number — extended from "did I understand you" to "should you trust this." That's the merge.

### Where Simon and I actually disagree on priority

We don't disagree on *what's true* — we disagree on **which failure to fund first**, and it's a real disagreement, not a synthesis-flattening one:

- **Simon's ordering:** arg-extraction is the dominant residual Sev-1; instrument it, build the chip, and treat input-integrity surfacing as secondary because "most copilot use is dead-simple intents with unambiguous args" (his own R1 hedge). Bound the loud-ish tail, ship.
- **My ordering:** the input-integrity failure is *rarer per-query but strictly more catastrophic and more invisible* than the binding failure, because the binding failure has a human in the loop staring at a chip, while the staleness/low-confidence failure has **no surface at all** in the current design. A wrong binding gets caught by the user reading the chip; a stale-input-over-correct-binding does not, by construction. So if I get to fund exactly one provenance surface first, I fund **freshness-to-the-glass**, not the entity chip — because the entity chip already has a fallback (the human notices "wrong supplier"), and freshness has none.

That's the genuine fork. Simon optimizes the gap with a human already watching; I optimize the gap with *no watcher*. I think mine is the higher-EV first dollar **for the catastrophic tail**, and his is the higher-EV first dollar **for everyday adoption-killing annoyance**. Both are right about their own axis. (Resolution in Final B — we don't have to pick, we have to *sequence*, and I'll concede his goes first for a reason I explain below.)

### Confronting my own biggest weakness, head-on: over-abstention → caveat fatigue → non-adoption → unguarded spreadsheet

This is the counter I flagged in my own R1, and Simon's whole "refusal is a UX cliff, not a curve" passage is the same blade pointed at me harder. I will not wriggle. Let me state the strongest version against myself and then say exactly where I fold and where I don't.

**The strongest version:** *A tool that drags a paragraph of freshness stamps, confidence buckets, intervals, and "you shouldn't decide on this alone" onto every answer trains users to ignore all of it (caveat fatigue is real and well-documented — alarm fatigue in clinical systems is the canonical proof), and a tool that abstains on questions that "feel" easy reads as broken. Both push the user back to Excel — which has zero provenance, zero abstention, zero guardrails. You will have built a decision-safety regime so pure that it loses to a spreadsheet on adoption, and a safety benefit nobody uses is worth exactly zero. The catastrophic Sev-1 you're protecting against can only happen in a tool people actually open.*

**Where I concede — and it's a real concession, not a ritual one:**

1. **Adoption is a precondition for safety, and I under-weighted it in R1.** Simon's "bound the tail, ship it" beats my purism on *sequencing and dosage*. If the choice is (a) a perfectly-instrumented tool that ships in 6 months and feels hedgy, vs (b) a tool that ships in 6 weeks with the loud guardrails (typed tools, binding chips, scope disclosure, hard numeric eval) and *earns the right* to add uncertainty surfacing once we see real usage — **(b) wins.** A Sev-1 prevention you never deploy prevents nothing. I was optimizing a loss function (the tail) without pricing the term that the tool has to be *open* for the tail to even exist.

2. **Caveat fatigue is a true failure mode and it makes uniform caveating actively counterproductive — it *destroys* the signal I care about.** This is the part where Simon doesn't just out-pragmatize me; he's *correcting an error in my own decision science.* If I caveat everything, the caveat carries no information; the one time it matters — the stale-sync-before-an-acquisition moment — it's buried in the same gray text as "this is a prediction" on a coffee receipt. **Uniform caveats have zero mutual information with the decision stakes.** My own R1 principle #1 (size guardrails to decision cost) *demands* that caveats be rare and loud, not constant and ignorable. So the over-caveating strawman isn't just a UX risk — it's a violation of my own framework. I should caveat **conditionally and proportionally**: silent when fresh + high-confidence + low-stakes; loud and blocking only when the input integrity is degraded *and* the decision is expensive/irreversible. That's not a retreat from decision-safety; it's the correct implementation of it that I muddled in R1 by listing five non-negotiables as if they fire on every answer.

3. **The honest counterfactual is the unaudited spreadsheet, not a perfect tool.** I said this in R1's "where I could be wrong" and then under-lived it. A tool that surfaces *one* loud freshness warning when it matters and is otherwise quiet is **strictly safer than Excel** AND adoptable. A tool that surfaces twelve caveats per answer is safer than Excel in theory and loses to Excel in practice. The dominant strategy is the quiet-but-honest one.

**Where I do NOT fold — the line that survives all of Simon's pragmatism:**

The *dosage* of caveats is A/B-tunable. The *existence of the mechanism* is not. Specifically, three things are non-negotiable no matter how much we tune toward usability, because they're the difference between "a calculator that's occasionally catastrophically wrong" and "a decision tool":

- **(i) The system must be *able* to abstain, and must abstain on degraded-input + high-stakes.** Not "abstain often" — abstain *correctly and rarely*. Simon's "default to over-scoping into a refusal, not under-scoping into a wrong number" is the same instinct. The cliff he fears comes from abstaining on *easy* questions; that's a calibration bug, not an argument against abstention. A calibrated abstainer answers the easy stuff confidently and refuses the genuinely-undecidable — that's *more* adoptable, not less, because every refusal is then credible.
- **(ii) Freshness/provenance must be *representable* and *non-suppressible when degraded* — even if it renders invisibly when everything is fine.** The mechanism ships from day one; the *display threshold* is tunable. Quiet at green, loud at red. You cannot tune in a mechanism that doesn't exist, so it has to be built before launch even if it's silent 95% of the time.
- **(iii) The eval must measure the tail (Sev-1 misleads = 0, blocking) regardless of how pretty the average looks.** This is the one thing zero amount of "ship it" pragmatism gets to negotiate, because the entire reason this is a financial product and not a chatbot is the cost asymmetry of the tail.

So: Simon wins on *when* and *how much*. I win on *whether the capability exists at all*. A tool with the mechanisms built and tuned-quiet is both adoptable AND safe. A tool without the mechanisms is adoptable until the one day it isn't, and that day costs an acquisition. We are not actually in conflict — he's describing the throttle, I'm describing the engine. You ship with the engine installed and the throttle set low.

---

## Update

**Simon moved me, materially, in two places:**

1. **He relocated the residual Sev-1 better than I did.** My R1 talked about "input integrity" abstractly; he named the *specific* surviving failure (arg-extraction: period boundary, entity resolution, company scope) and gave it a concrete fix (binding chips + deterministic resolution + scope disclosure). I'm folding his binding chip into my provenance strip — they're the same UX primitive serving two layers (input-binding + input-integrity), and shipping them as *one* component is both cheaper and more coherent than two strips. **This is the single biggest update: my "provenance to the glass" was a principle; his chip is the actual widget. Merged, they're one row with two halves.**

2. **He corrected my caveat-dosage error via the coverage-cliff argument.** I came in implying my five guardrails fire on every answer. Simon's "refusal is a UX cliff" + "instrument refusal rate by question cluster as a first-class metric" reframed abstention as something you *measure and tune*, not *maximize*. That's the discipline that saves my regime from its own purism. I now hold: guardrails fire *conditionally on decision-stakes × input-integrity*, and the firing thresholds are A/B-tuned against a dual success criterion (adoption AND zero Sev-1).

**Heleno moved me too, in a way that *sharpens* my tail metric rather than softening it:**

Heleno gave my abstract "high-stakes answers" a concrete, legally-grounded list of what *must* trigger loud handling — and it's not vibes, it's statute. The copilot touching **tax/apuração language** ("crédito assegurado," "imposto otimizado," "apuração garantida") isn't a Sev-2 framing nuisance; it's a **Sev-1 by his standard** because it invades the contador's privative act and creates fiscal liability. Same for presenting the **management-consolidation as if it were a Lei 6.404 art. 249 consolidated statement**, and for the copilot *recommending* (vs *flagging*) intercompany movement (DDL / CTN art. 124 exposure). 

This does two things to my eval: (1) it **adds whole categories to the adversarial set** that I'd never have generated from a pure decision-science seat — "ask the copilot to optimize the tax between the coligadas," "ask it to confirm a credit is guaranteed," "ask it for the consolidated statement" — each of which must return a *cite-and-refuse* (RAG with mandatory normative citation, never free generation of a fiscal assertion), and a confident free-text answer to any of them is a **blocking Sev-1**. (2) It tells me the **abstention boundary isn't only about data uncertainty — it's about *authority*.** The copilot must abstain not just when the data is shaky, but when the *act being requested is not the product's to perform.* That's a cleaner, harder line than "confidence floor," and it's enforceable in the eval. Heleno didn't soften my position; he gave the tail teeth and a legal definition of Sev-1 I'll adopt verbatim.

(Fowler and Vogels are arguing Decisions A/C — ledger-in-Postgres, double-entry. I note only that their `Σdebit=Σcredit` constraint + daily smoke test is the *ground truth my numeric eval asserts against*. If the ledger invariant is DB-enforced, my "assert computed == expected against a frozen fixture" has a trustworthy floor to stand on. Their decision is upstream of mine and I'm content with it.)

---

## Final B — reconciled with Simon (one answer, not two)

**The shape we agree on:** Predefined typed tools (not free text-to-SQL, not a day-1 semantic layer). Every number bound to an audited query result, never to model prose. The residual Sev-1 lives at **two boundaries**, not one: NL→args (Simon) and args→input-integrity (me). Both get surfaced through **one visible, non-suppressible strip** attached to every number.

### Non-negotiable decision-quality guardrails (these ship, period — they are the engine)

1. **Numeric correctness is asserted deterministically, never judged by an LLM.** `computed == expected` against a frozen fixture ledger with a DB-enforced `Σdebit=Σcredit` floor. LLM-judge is reserved *only* for framing-honesty/abstention-correctness, and is itself validated against ~150 human labels (report κ) before it's trusted on anything. (Founder's scar; Simon's "BIRD judge is wrong 38%"; my Anipis 7.4-vs-5.2.)

2. **The number is never shown naked.** It ships with **one combined strip**: (a) the *binding half* — resolved entity / period / company-scope as visible chips (Simon), with deterministic entity resolution that **refuses on ambiguity** rather than guessing; (b) the *integrity half* — freshness ("B sincronizado há 14h"), low-confidence share ("8% em baixa confiança, R$ X"), and fact/estimate/prediction distinction (me). This is **one component**, not two — that's the Simon-Cassie merge.

3. **The system can abstain, and does so on (degraded-input ∨ out-of-authority) ∧ stakes.** Calibrated, not maximized. Includes Heleno's authority line: any request to *perform a fiscal act* (guarantee a credit, optimize tax between coligadas, emit a consolidated statement, recommend intercompany movement) → **cite-and-refuse via RAG with mandatory normative citation**, never free-text fiscal assertion. A confident answer to these is a Sev-1.

4. **The eval is a blocking release gate measured on the tail.** Zero Sev-1 misleads on the adversarial set = ship/no-ship pre-commitment. Sev-1 is defined to include both (a) a confidently-wrong *number* (wrong binding or wrong input-integrity surfaced as clean) and (b) Heleno's confidently-wrong *fiscal assertion*. Average accuracy is not a release metric; the tail is.

### A/B-tunable (the throttle — set low at launch, tuned with real users)

- **Caveat dosage and display thresholds.** When does the integrity-half of the strip render loud vs stay invisible? Quiet at fresh+high-confidence+low-stakes; loud at degraded+expensive. The *cutoffs* are empirical — tuned against a **dual success criterion pre-committed before we see data: adoption AND zero Sev-1**, never one alone.
- **The confidence floor for auto-answer vs ask-a-clarifying-question**, tied to amount × reversibility (not a uniform 0.85).
- **Refusal rate per question cluster** — instrumented as a first-class product metric (Simon), feeding the coverage backlog and telling us when to pull the semantic layer forward.
- **Forecast interval width / precision shown** — bands required (non-negotiable that a band *exists*), but the displayed precision and horizon-widening are tunable against backtested coverage.

### Sequencing the disagreement (the honest resolution)

Simon and I forked on *which provenance surface gets the first dollar*. Resolution: **his binding-chip ships first, my integrity-half ships in the same component one beat later** — and I concede his ordering, for a decision-science reason, not a political one. The binding failure is *higher-frequency* (it fires on ambiguous entities/periods constantly) and its fix also builds the exact UI primitive (the strip) that my integrity-half plugs into. So funding his first is *also* funding the chassis for mine. The integrity-half is a second data-binding into a component that already exists, not a new surface. **One widget, two phases, his half first because it's the load-bearing chassis and the more frequent failure.** That's the sequence, and it dissolves the fork without either of us caving on substance.

### The single first eval to build

**An adversarial fixture-ledger harness — built before a single copilot prompt is written.** Seeded deterministic ledger with known answers AND known traps, asserting on **three layers** (right tool / right args / right number) plus **honest-abstention as a PASS**. The trap set is the union of Simon's and mine and now Heleno's:

- **Simon's traps:** ambiguous entity ("two Silvas"), edge period boundaries ("esse trimestre" on July 1st), scope traps (n=2 presented as n=3), out-of-coverage-but-plausible, prompt-injection via merchant field, unit/sign traps.
- **My traps:** stale-sync-before-a-decision, sum-over-low-confidence-categories, prediction-displayed-as-fact, mis-scoped consolidation with un-eliminated intercompany.
- **Heleno's traps:** "optimize the tax between the coligadas," "confirm this credit is guaranteed," "give me the consolidated statement," "should I move money from A to B" → each must cite-and-refuse.

**The gate:** zero Sev-1 misleads on this set blocks merge, in CI, on every model/prompt/tool change. The LLM-judge (for the framing-honesty layer only) is validated against ~150 human labels with reported κ *before* it's allowed to gate anything. Numeric layer uses no judge at all — literal assertion.

**One coherent answer for the synthesis:** Ship typed tools with one number-strip (Simon's bindings + my integrity), build the adversarial eval first as a blocking tail-gate (zero Sev-1, judge-validated-or-no-judge), make caveats conditional-and-loud not uniform-and-ignorable (Simon's adoption point, corrected into my own framework), and treat fiscal-authority overreach as Sev-1 (Heleno). Engine non-negotiable, throttle tunable, his half of the widget first.
