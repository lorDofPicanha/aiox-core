# R1 — Cassie Kozyrkov (Decision Intelligence) · ENIAC Financeiro · Decision B

> Lens: decision science, applied statistics, evaluating ML systems, not fooling yourself with bad metrics.
> My north star here: **the decision is more important than the data.** This product's job is not "produce a number" — it's "let a human make a money decision without being misled." Those are different products, and the team is currently optimizing the first one.

---

## Decision B (decision intelligence)

The architecture's framing — "tools SQL tipadas, LLM never invents a number" — is *necessary and excellent engineering*, but it answers the wrong question. It guarantees **the number is computed correctly from the ledger**. It does NOT guarantee **the human will make a good decision from that number.** Those are two separate failure surfaces, and the second one is where money actually gets lost. The endowment-effect, the confirmation bias, the "it's on the dashboard so it must be true" — those live downstream of the SQL.

My non-negotiables, beyond typed tools:

**1. Start from the decision, work backward (Decision Primacy).** Before any tool exists, enumerate the actual decisions this copilot feeds: *should I pay this supplier now or wait? do I have runway to hire? is company B subsidizing company A? do I owe this tax?* Each decision has a different cost of being wrong and a different reversibility. A wrong "saldo consolidado" that triggers a payroll decision is a Sev-1; a wrong "top 5 fornecedores" that someone reads over coffee is a nuisance. **The guardrails must be sized to the decision, not uniform across all answers.** The current design treats all copilot answers as equal risk. They aren't.

**2. The right number, wrongly interpreted, is still a wrong decision.** The single most dangerous output is a *correct number with a hidden caveat the user can't see*. Examples this system WILL produce:
   - A "consolidated balance" that is correct but includes a category whose auto-categorization confidence was 0.72 (Agente 1 fed Agente 3 silently).
   - A "this month's cashflow" that is correct *as of the last successful Pluggy sync 19 hours ago* — the user reads it as "now."
   - A forecast labeled with a number that is `predicted` (heuristic recurrence), shown next to a `scheduled` (real boleto) number, with no visible distinction once it's in prose.
   The number passes the SQL eval. The decision is still wrong. **Provenance and freshness must travel with every number to the glass, not stay in the audit log.** "Last synced 19h ago. 2 transactions still uncategorized in this period (R$ X). 1 large item is a *prediction*, not a confirmed payment." That is the difference between a calculator and a decision tool.

**3. Calibrated abstention is a feature, not a failure (and the design half-gets this).** The architecture already says "no tool → 'não consigo responder isso ainda'." Good — recusar = correto. But abstention must extend past "no tool exists" to **"a tool exists but the inputs are too uncertain to be decision-grade."** The copilot should refuse, or escalate to a human, when: the answer depends on transactions categorized below a confidence floor; the data is stale beyond a threshold; the question is ambiguous about *which* company/period (a wrong scope is the most common silent error in multi-company). Make abstention measurable: track a **coverage curve** — % of questions answered vs. accuracy-on-answered. You WANT answer-rate below 100%. A copilot that answers everything is a copilot that's lying some of the time.

**4. Confidence communication must be honest, not decorative.** Three rules: (a) never show a number more precise than the data supports — if forecast error is ±15%, "R$ 142.318,07" is a lie of precision; show a range. (b) Distinguish *fact / estimate / prediction* visually and in language, every time, with no exceptions once it hits prose. (c) The system must be able to say **"I don't know"** and **"I can compute this but you shouldn't decide on it alone — here's why."** Confidence theater (a green checkmark, a "verified" badge that's always green) is worse than nothing because it manufactures trust the system hasn't earned.

**5. Role separation (structural).** The system is the *analyst*, the human is the *decision-maker*. Bake that into the UX: the copilot presents, the human decides and — for high-stakes, irreversible money moves — must *acknowledge what they're acting on*. Don't let the product quietly become the decision-maker by making the number feel authoritative. That's how you conflate the two roles and build confirmation bias into the org chart.

---

## The eval problem

This is the founder's rule — "validate the eval metric before optimizing; a wrong LLM-judge gives false confidence" — and it is *exactly right*. I'd put it stronger: **an eval you haven't validated is not a safety net, it's a blindfold with a smiley face on it.** Here is how I'd build an eval for "never misleads on a number" that I'd actually trust.

**Pre-commit the criteria before seeing any model output (non-negotiable).** Write down, *before* running the LLM, what counts as: correct, wrong-number (Sev-1), misleading-but-technically-right (Sev-2), and honest-abstention (which is a PASS, not a fail). If you define these after looking at outputs, you're cherry-picking and you'll define them to make the system look good. Goalposts before the kick.

**Separate the two things you're evaluating — don't average them.**
   - **(A) Numeric correctness** — does the tool result equal ground truth? This needs **NO LLM judge at all.** It's `assert computed == expected` against a seeded fixture ledger with known answers. Deterministic, exact, runs in CI. If you're using an LLM to judge whether a number is right, you've already lost — you've replaced a `==` you can trust with a stochastic rubber-stamp you can't. **Reserve LLM-as-judge for the things only language can evaluate** (is the framing honest? did it caveat staleness? did it abstain when it should?), never for arithmetic.
   - **(B) Decision-safety of the framing** — this is the hard, language-shaped part where a judge is tempting and dangerous.

**How to keep the judge honest (the part that actually matters):**
   1. **Never leak the answer to the judge.** If the judge prompt contains the ground-truth number or the label "this is the correct/hindered answer," it will pattern-match to it and rubber-stamp. The judge must evaluate the *response on its own terms* against a rubric, blind to which sample is "supposed" to pass.
   2. **Validate the judge against humans before you trust it on the model.** Hand-label a calibration set (say 100–200 responses) with your pre-committed rubric. Run the judge on the *same* set. If judge-vs-human agreement (Cohen's κ) isn't high — and especially if the judge is *lenient* where humans are strict — the judge is broken and any score it produces is noise dressed as confidence. **The Anipis lesson in your own memory is the proof: a crooked judge gave 7.4 where the truth was 5.2.** Same disease, higher stakes here.
   3. **Adversarial / red-team the eval set, don't sample the happy path.** The set that matters is the one full of traps: stale data, low-confidence categories, ambiguous company scope, questions with no valid tool, "trick" questions that *invite* a confident wrong answer. A 95% pass rate on softball questions is data decoration. I want the failure rate on the *adversarial* set, because that's where real users will hit the cliff.
   4. **Measure the right thing — and the worst thing, not the average.** For a "never mislead" guarantee, the metric is NOT mean accuracy. It's the **tail**: count of Sev-1 misleads (target: zero, and *every one is a blocking CI failure*), and the rate of Sev-2 confidently-wrong-framings. A system that's 99% accurate and 1% confidently-misleading-on-money is a *failing* system, because the 1% is where someone wires the wrong amount. Average accuracy hides exactly the cases the product exists to prevent.
   5. **Read the worst cases with your own eyes.** Periodically, a human reads the lowest-scoring and the *highest-confidence-wrong* transcripts directly. If a plateau resists two tuning attempts, suspect the judge, not the model (again: the founder's rule, and your own scar tissue).
   6. **No peeking / cherry-pick protection.** Lock the eval set, version it, run it in CI on every change. Don't iterate the model against a set you keep re-reading and re-tuning to — that inflates your false-pass rate the same way peeking inflates a false-positive in an A/B test. Hold out a frozen test set you only touch at release.

**The eval is a release gate, not a dashboard number.** Zero Sev-1 misleads is a *pre-commitment* to ship/no-ship. The moment "eval score" becomes a vanity metric on a slide that doesn't block a release, it's data decoration and you've lost the guarantee.

---

## Confidence for categ/forecast

These two agents *feed* the copilot and the dashboards, so their uncertainty IS the copilot's uncertainty — and right now it can be laundered invisibly into a "correct" number.

**Categorization (Agente 1):**
   - Surface a **per-transaction confidence and its source** (rule / memory / embedding / LLM / human) — and *propagate it upward*. When the copilot reports "gasto em Marketing = R$ X," the answer must carry "Y% of this total came from auto-categorizations below 0.85 confidence." A correct sum over shaky labels is a misleading number.
   - The decision-relevant metric is **accuracy per source and per confidence bucket**, validated against human corrections — not a global accuracy. And watch the **base rate**: if 1% of merchants are genuinely ambiguous, a model that's 99% accurate is just predicting the majority and learning nothing about the hard cases. Calibration matters more than raw accuracy: when it says 0.90, is it right 90% of the time? If not, the threshold gating (auto-assign ≥0.85) is built on sand.
   - Tie thresholds to **decision cost**, not a uniform 0.85: a misclassified R$50k item and a misclassified R$5 coffee are not the same decision. The value-gate in the design is right; make the confidence floor a function of amount × reversibility.

**Forecast (Agente 2):**
   - A point forecast with no interval is **professional malpractice** for a cashflow tool. Every projection needs a band, and the band must widen with horizon. "Você terá R$ X em 30 dias" must be "R$ X ± range, e a barra vermelha (vai faltar caixa) tem probabilidade P."
   - Hard-distinguish the three layers the architecture already names — `scheduled` (fact), `predicted` (heuristic), `ml` — **all the way to the glass and into any prose the LLM writes.** The moment a prediction sits next to a fact with the same visual weight, the user treats both as certain and decides accordingly.
   - Validate forecast quality with **backtesting on held-out history** (would this method have predicted last quarter?), reported as calibrated error and — crucially — **coverage of the interval** (do 80% intervals actually contain the truth 80% of the time?). An interval that's wrong about its own width is worse than no interval.

For both: the human decides well only when the screen makes the *uncertainty* as visible as the *number*. Hiding uncertainty to look polished is the exact mechanism by which good numbers produce bad decisions.

---

## Biggest false-confidence risk

**The single biggest way this system gives false confidence: a number that is arithmetically correct, displayed with full authority, while the *inputs* underneath it were uncertain, stale, or mis-scoped — and the eval suite, by checking only `computed == expected` against clean fixtures, certifies it as PASS.**

Concretely: the copilot answers "saldo consolidado das 3 empresas = R$ 1.204.000" with a confident, well-framed sentence. The SQL is right. The eval is green. But: the Pluggy sync for company B failed 14h ago, 8% of the period's transactions are auto-categorized below threshold, and the consolidation netted an intercompany entry that was itself a low-confidence guess. The founder reads "R$ 1.2M," decides the group can fund an acquisition, and acts. **Every individual guardrail held. The decision was still catastrophic.** The system manufactured confidence it hadn't earned — and the eval, by testing the wrong layer (output arithmetic, not input integrity + framing honesty), gave everyone a green light to trust it. That is "data decoration" at gunpoint: a metric that exists, looks rigorous, and changes nobody's behavior toward caution.

**The structural fix:** the eval must test the *whole decision path* — correctness AND provenance-surfacing AND appropriate abstention under degraded inputs — and the UI must make freshness/confidence/provenance non-suppressible. Correctness-only evals on clean fixtures are the smiley-face blindfold.

---

## Where I could be wrong

**The strongest counter-argument I'll face** — and it's a good one — is: *"Cassie, you're going to make the product unusable. If every number drags a paragraph of caveats, ranges, freshness stamps and confidence buckets, users tune it all out (caveat fatigue), the copilot abstains so often it feels broken, and they go back to their spreadsheet — which has NO guardrails at all. You've optimized for theoretical decision-safety and shipped something nobody uses. Worse: an over-abstaining tool that says 'não sei' to easy questions destroys trust faster than an occasional wrong number, because users forgive a tool that's confident-and-mostly-right but abandon one that's hedgy-and-useless."*

I take that seriously, and here's where I genuinely might be wrong:
   - **Calibration of the abstention/caveat threshold is an empirical question I can't answer from the armchair.** How much uncertainty is "too much to answer" depends on the real users' risk tolerance and the actual decision base rates — which we don't have yet. I'm asserting the *mechanism* (size guardrails to decision cost; surface uncertainty) but the *cutoffs* must be tuned with real ENIAC users, not decreed by me. If I set them wrong, I do make it unusable.
   - **My "tail-not-average" obsession could be the wrong loss function** if, in practice, the catastrophic-decision path is far rarer than I fear — if most copilot use is low-stakes exploration, then optimizing the whole UX around the Sev-1 tail is itself a mis-prioritization (ironically, *me* not starting from the actual decision distribution).
   - **The spreadsheet counterfactual is real and I under-weight it.** The honest comparison isn't "this tool vs. a perfect tool"; it's "this tool vs. what they do today" — which is almost certainly an unaudited spreadsheet with silent errors and zero provenance. A *somewhat* uncertainty-aware tool that gets adopted beats a perfectly-safe one that doesn't. Adoption is a precondition for any safety benefit at all.

So: I hold the line on the *mechanisms* (validate the judge; tail metrics; provenance to the glass; calibrated abstention; eval the whole decision path) — those are not negotiable, they're how you avoid fooling yourself. But the *thresholds and the dosage of caveats* are A/B-test questions to settle with real users, and I'd pre-commit those success criteria (adoption AND zero Sev-1 misleads — both, not one) before we look at the data.

**Concrete next step:** Before writing a single copilot prompt, build the **adversarial eval harness first** — a seeded fixture ledger with known answers AND known traps (stale sync, low-confidence categories, ambiguous scope), a pre-committed Sev-1/Sev-2/abstain rubric, and a judge validated against ~150 human labels (report κ). Make "zero Sev-1 misleads on the adversarial set" a blocking CI gate. The eval is the product's safety contract; build the contract before the thing it governs.
