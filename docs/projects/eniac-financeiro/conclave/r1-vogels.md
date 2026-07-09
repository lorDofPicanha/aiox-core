# Conclave R1 — Werner Vogels (Cloud Architecture / Operational Excellence)

> Lens: "Everything fails all the time" · "You build it, you run it" · Frugal Architect · cost as a first-class requirement · simplicity is hard (complexity moves, it doesn't disappear).
> Scope: ENIAC Financeiro — 3 companies now, Next 15 / Supabase Postgres / Railway worker (pg-boss) / Claude. Productize later.

## Decision C

**Verdict: Reimplement double-entry inside Supabase Postgres (single-stack). Do NOT run Formance as a separate Go microservice — not now, and probably not even at the "productize" stage. STRONG conviction.**

This is the decision I care most about, and I disagree with anyone who reaches for Formance here on operational grounds. Here is the reasoning, run through the only filter that matters: *who carries the pager at 2am, and what breaks while they sleep.*

**1. You build it, you run it — so count the runners. There are ~1.5 of them.**
This is a 3-company shop with a Next app, a Supabase Postgres, and one Railway worker. Formance is not a library you import; per its own docs the recommended production deployment is *Kubernetes via Helm charts*, a separate fleet of Go binaries, and its **own** Postgres instance to back up, patch, monitor, and restore. So the moment you adopt Formance you are running **two** databases as sources of truth — the app's Supabase Postgres and the ledger's Postgres — plus a Go service, plus (realistically) a K8s surface this team does not otherwise need. You'd add an entire operational domain to save yourself writing a posting function and a `CHECK (sum(debit)=sum(credit))`. That is complexity moved to exactly the place it causes *most* harm: the on-call rotation of a tiny team. Frugal Architect Law: cost (including human operational cost) is a first-class requirement, and this fails it.

**2. "Everything fails all the time" — so what fails, and is the failure *recoverable* or *corrupting*?** This is the decisive point. With an external ledger your app must write app-data to Supabase AND money-truth to Formance. Those are two stores with no shared transaction → the **dual-write problem**. When (not if) the network blips, the worker crashes, or Formance is mid-deploy between the two writes, you get a journal entry in one store and not the other. In a *financial* system that is not a latency blip — it's a silent miscount, the single worst failure mode for this product (and it's literally the scar the team already carries from CRM Novo: "drift de ingestão / miscount silencioso"). To make dual-write safe you must adopt the **transactional outbox pattern**: write the intent into the *same* Postgres transaction, then a relay ships it to Formance with retries and idempotency, accepting **eventual consistency** between your app and your "source of truth for money." Read that back slowly: you'd be making your *ledger* eventually-consistent with your *app*, and building outbox + relay + reconciliation-between-the-two-stores infrastructure — which is *more* distributed-systems code than the double-entry you were trying to avoid writing. You don't get to skip the ledger logic; you *add* a distributed-consistency problem on top of it.

**3. Postgres already gives you the one guarantee that matters: atomicity.** Double-entry's core invariant — debits equal credits, append-only, every posting all-or-nothing — is *exactly* what a single ACID transaction delivers for free. A posting RPC (`BEGIN; insert entry; insert lines; assert balanced; COMMIT;`) is correct by construction inside one database. The architect's design already routes *every* posting (OF-derived and manual) through one function with one validation and one audit path. That is the right shape. Introducing Formance throws away the free atomicity and replaces it with a cross-service consistency problem you now own. Complexity can't be destroyed — here Postgres absorbs it cleanly; Formance relocates it into the gap between two systems.

**4. Backup / restore / DR — the test nobody runs until it's too late.** Single-stack: one Supabase project, point-in-time recovery, one restore drill, and your money-truth and app-truth are restored to the *same instant* automatically. Two stores: you now must restore Supabase and Formance's Postgres to a **consistent point in time relative to each other**, or you reopen the dual-write inconsistency *during recovery* — the worst possible moment. Most small teams never test cross-store DR. "Plan for failure and nothing will fail" — I will not sign off on an architecture whose disaster-recovery story is unproven and inherently skew-prone for a 3-company finance app.

**5. Cost of ownership at 3 companies vs at scale — and the "productize later" trap.** At 3 companies, Formance is pure overhead: a service with near-zero throughput that still demands patching, monitoring, an on-call story, and its own DB bill. The counter is "but we'll productize, so build for scale now." I reject that framing — it's speculative complexity. **Evolutionary architecture:** earn the migration. The clean move is to *encapsulate posting behind a single RPC/interface* in Phase 0. If you ever genuinely outgrow Postgres for the ledger (you will see it coming: contention on the posting path, multi-region money movement, throughput Postgres can't hold), you swap the implementation behind that seam and migrate deliberately — with traffic, money, and a real ops team to justify Formance/TigerBeetle then. You do not pre-pay years of operational tax for a scale you may never hit, and if you do hit it, you'll be able to afford the migration precisely because the business worked. Note also the licensing reality from the research: Formance/Numscript is MIT, so "buy the commodity" is *available* later — nothing about going single-stack now forecloses it.

**Concrete recommendation:**
- Implement double-entry as append-only tables in Supabase Postgres with the balanced-posting `CHECK` and a single `post_entry()` RPC (`SECURITY DEFINER`, `worker_rw` only).
- Hide it behind one ledger interface from day 1 so Formance/TigerBeetle remains a *swap*, not a rewrite (this is the cheap insurance — take it).
- Borrow Formance/Numscript and TigerBeetle's **invariants** as a correctness checklist (immutability, balanced postings, idempotent ingestion `(aggregator, external_id)`, monotonic audit), *not* their runtime.
- Run the architect's daily smoke test (re-pull a known account, assert zero new lines + balance parity) — that is your cheap, always-on miscount detector.

I'm with the architect (§0.1 / ADR) on this one, and against the "Formance microservice" option in §1.

## Decision A

**Verdict: Double-entry, append-only. Not a cash-book. Clear and decisive.**

From a reliability / auditability / data-integrity standpoint this isn't close:

- **Auditability = immutability.** A cash-book is mutable and lossy: you overwrite or delete a row and the history is gone. Append-only double-entry means *corrections are new reversing entries*, never edits — so the ledger is a complete, replayable audit trail. For a system whose whole pitch is "compliance-aware" and whose accountant (heleno) must trust it, an editable cash-book is a non-starter. APIs/records are forever; you don't get to quietly rewrite money history.

- **Integrity = a self-checking invariant.** Double-entry carries its own tripwire: every posting must balance (Σdebit = Σcredit). That `CHECK` is a *continuous, free integrity test on every write* — drift cannot accumulate silently the way it can in a single-sided cash-book where a wrong number just sits there looking plausible. Given this team's explicit scar (silent miscount), the self-balancing property is precisely the guardrail they need.

- **Consolidation across 3 entities + intercompany netting** is only *provable* with double-entry and tagged intercompany accounts. A cash-book can't express "this netted to zero across the group" with integrity — it can only assert it. The architect's framing ("makes reconciliation/consolidation *provable*, not *asserted*") is exactly right.

- **Reconciliation against Open Finance** needs each bank line mapped to a two-sided entry (bank + result account) with the raw OF row preserved and linked. That structure *is* double-entry; a cash-book throws away the half you need to reconcile.

The only honest cost is modeling effort and the accountant's mental model — but the design already routes everything through one posting function, and heleno's lane is to confirm the *consolidation* model is acceptable, not to relitigate double-entry itself. Take the double-entry. It's the cheaper choice once you price in audit, reconciliation, and "everything fails" recovery.

## Top risk

**My #1 operational risk is silent miscount from a broken/leaky ledger boundary — and it is *larger*, not smaller, if you adopt Formance.** The dual-write gap between Supabase app-data and an external ledger is the most likely source of a financial inconsistency this team would not detect until a number is wrong in front of a client. Single-stack with one ACID posting transaction removes that entire failure class by construction; the residual risk (ingestion drift, mis-categorization composing into reports) is then *contained inside one database* and caught by the daily smoke test + balanced-posting `CHECK` + idempotent `(aggregator, external_id)`. Mitigation is exactly what the architect already has — I'm just insisting we not *re-introduce* the dual-write class by bolting on an external ledger to look "scalable."

## Where I could be wrong

The strongest counter-argument I'll face in the adversarial round (and I expect Fowler or Kleppmann to push it): **"Reimplementing double-entry correctly is genuinely hard — concurrency under contention, exotic multi-currency/rounding, regulatory ledger semantics — and Formance is battle-tested code that has already solved the subtle bugs you'll hit. You're trading a known operational tax for unknown correctness bugs in money math."** That's a fair shot, and I'll concede the *correctness* of a hand-rolled ledger is non-trivial. My rebuttal stands on three legs: (1) the *invariant* here is simple and Postgres-enforceable (balanced, append-only, idempotent) — this is not a high-frequency trading engine, it's 3 companies' bookkeeping; the hard parts of Formance (programmable Numscript, high-throughput money movement) are capability this product does not use; (2) I *keep* Formance's correctness by adopting its invariants as a test checklist and hiding posting behind a seam, so the migration door stays open the moment correctness or scale actually demands it; (3) a correctness bug in my own Postgres function is debuggable *by the people who run it* with one database and one transaction log — a consistency bug across two stores is the harder, scarier bug, and it's the one Formance *introduces* rather than removes. The other place I could be wrong: if ENIAC's real intent is to ship this as a *platform serving many groups fast*, the scale argument gets stronger sooner — but even then I'd want the seam-and-migrate path, not a day-1 microservice for 3 companies.

---

**Sources:**
- [Formance Self-Hosting / Storage considerations (Postgres required, Helm/K8s recommended)](https://docs.formance.com/v1.10/ledger/operations/storages)
- [Formance Operator — Ledger module deployment](https://docs.formance.com/operator/Modules/Ledger)
- [The Dual-Write Problem solved with the Transactional Outbox Pattern](https://medium.com/@work.dhairya.singla/the-dual-write-problem-explained-using-the-transactional-outbox-pattern-562aa4b83170)
- [Confluent — Understanding the Dual-Write Problem](https://www.confluent.io/blog/dual-write-problem/)
- [AWS Prescriptive Guidance — Transactional outbox pattern (explicit eventual consistency)](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)
