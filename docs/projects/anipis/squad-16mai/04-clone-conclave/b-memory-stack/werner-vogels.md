# Werner Vogels — Anipis Architecture Conclave

**Persona:** Werner Vogels, CTO Amazon/AWS
**Date:** 2026-05-16
**Mode:** First-person, builder-centric, failure-first

---

Builders, let's be direct. You have 12 weeks, three personas, and a system where a missed crisis routing decision is a vida humana. Everything fails all the time — and on Anipis, "everything" includes the consequences. Let me work through your six questions.

**(1) Soft-tenancy RLS for ANS operadora.** RLS Postgres is defensible *if* you treat it as a control, not a wall. The reality is that ANS auditors don't care about your schema topology — they care about evidence of isolation, audit trails, and breach blast radius. My rule from Dynamo: isolation is a property you *prove*, not a property you *claim*. Use RLS for B2C and B2B2C-corporate (NR-1), but for the ANS operadora tenant, hard-isolate at the schema level (or a separate cluster). Why? Three reasons: (a) blast radius — one misconfigured policy on shared tables can leak across operadoras, and you'll find out on the front page of Folha; (b) compliance ergonomics — ANS pode pedir "show me this tenant's data and *only* this tenant's data" — schema-per-tenant makes that a `pg_dump`, not a SQL audit; (c) noisy neighbor — operadoras have predictable, regulated traffic; you don't want a B2C ideation spike starving them. Hybrid wins.

**(2) Three concrete SPOFs on Supabase Cloud + Vercel + GPT-5.** This stack will bite you. (i) **OpenAI regional outage / rate limit on GPT-5** — your crisis classifier blocks. AWS lesson from the 2017 S3 us-east-1 outage: never depend on a single region or single provider for a critical path. Solution: hedge with a second LLM (Anthropic Claude, or self-hosted Llama for crisis classification only), plus a deterministic rule-based fallback for severity≥2 keywords. The Dynamo paper's lesson — eventually consistent reads with strong-consistency *primitives* available — applies: when the smart system is down, fall back to the dumb-and-safe one. (ii) **Supabase Cloud control-plane** — connection pooler outage = total downtime. Mitigate with PgBouncer self-hosted in front, read replicas, and PITR-tested-monthly (untested backups are folklore). (iii) **Vercel edge** — single CDN failure mode. Multi-region Next deployment with a static crisis-resources fallback page served from a separate origin (S3-equivalent on Cloudflare R2 or Wasabi).

**(3) Three chaos tests for the crisis routing engine.** (a) **GPT-5 latency injection** — inject 5s/15s/30s latency randomly, verify fallback engages before 1s p95 SLO; verify deterministic classifier catches severity≥2 with recall ≥99%. (b) **Postgres failover game day** — kill primary mid-conversation, measure session continuity and message-loss. RPO target only matters if tested. (c) **Tenant boundary fuzzing** — automated test injecting cross-tenant queries via crafted JWTs, asserting RLS denies 100%. Run weekly in staging, monthly in prod with synthetic data. Chaos engineering isn't optional for a system where failure means a person in crisis gets routed to a wellness chatbot answer.

**(4) Data residency BR.** Fight it. LGPD doesn't *require* BR residency (unlike Russia/China), but ANS RN-627 expectations and the political risk of a public incident make it worth the investment. SCCs help but don't eliminate optics. Migrate to BR (Supabase has SA region, or self-host on AWS sa-east-1 / RD-managed Postgres) **before** ANS contract — not after. Cost delta is small; reputation delta is enormous.

**(5) Immutable audit hash chain vs LGPD right-to-erasure.** Dynamo lesson directly: separate the *content* from the *attestation*. Store PII in erasable tables; store cryptographic *hashes* of events (no PII) in the immutable chain. Right-to-erasure scrubs the PII row; the hash chain remains intact and audit-valid. This is exactly how we designed S3 object lifecycles with compliance lock — the lock is on metadata commitments, not on raw user content.

**(6) p99 <1s without 10x cost.** Three levers: (a) **two-tier classifier** — local distilled model (50ms) handles 95% of traffic; GPT-5 only for ambiguous cases. (b) **aggressive timeouts + speculative execution** — fire LLM call and rule-based classifier in parallel, return whichever lands first if severity is clear. (c) **observability with p99 tracking per-tenant** — you can't manage what you can't see. Cost stays flat because you're not paying GPT-5 per request; you're paying it per hard case.

---

## Verdict (1-liner)
**Hybrid tenancy + multi-LLM fallback + BR residency from day one — defensible for ANS, frugal for MVP, survivable when (not if) Supabase or OpenAI has a bad Tuesday.**

## Top 3 Single Points of Failure — Anipis TODAY
1. **GPT-5 as sole crisis classifier** — one OpenAI outage = clinical liability event
2. **Single Supabase Cloud region (US)** — control-plane outage + LGPD optics combined
3. **No tested DR runbook** — RPO/RTO targets without monthly game days are aspirational, not operational

## 5 P0 System Design — Next 2 Weeks
1. **Deterministic crisis-classifier fallback** (rule-based + keyword + lightweight local model) — ships before any LLM dependency goes live
2. **Hybrid tenancy decision codified in ADR** — schema-per-tenant for ANS operadora, RLS for B2C/corporate, documented with explicit trade-offs
3. **Audit hash chain separated from PII storage** — design doc + migration plan, LGPD-compatible from sprint 1
4. **First chaos game day** — staging environment, GPT-5 latency injection + Postgres failover, measure against SLOs
5. **BR data residency migration plan** — concrete path off Supabase US (sa-east-1 self-host or Supabase SA region), with cost model attached as a non-functional requirement

Builders, you don't have time to perfect this. You have time to make the failures *survivable*. Design for the bad Tuesday — there will be one.

— Werner. Now Go Build! ☁️
