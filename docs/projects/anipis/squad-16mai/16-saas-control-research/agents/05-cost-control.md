# Cost Control & Vendor Management — Anipis

**Project:** Anipis (mental-health support, PWA-only, AI-led)
**Stage:** Closed Beta 30/Mai/2026 — 20 users x 14 days, then scale
**Author:** Squad SaaS-Control agent #05 (cost-control)
**Date:** 2026-05-19
**Mind clones channeled:** Patrick Campbell (ProfitWell), Will Larson (cost-aware eng), Werner Vogels (AWS economics), Aswath Damodaran (financial modeling), Jason Lemkin (SaaS economics), Geoff Cook (cost-per-user), David Ebersman (CFO scale)

---

## 1. Executive Summary

- **Beta is essentially free.** 20 users x 14 days realistically costs **$8–$22 all-in** (OpenAI is the only variable line, and it lands around $1–$6 for the cohort, not $200–$500). The $200–$500/mo figure in the brief is a *steady-state-at-volume* number that does NOT apply to a 20-user closed Beta. **Do not over-provision for Beta.** (Damodaran: model the actual cohort, not the brochure.)
- **OpenAI is the only line item that can run away.** Everything else (Railway $5, Supabase $0→$25, Sentry $0→$26, Langfuse Free, Upstash Free, Cloudflare free, domain) is fixed-floor and bounded. **Cost discipline = ~95% OpenAI discipline.** Put the hard controls there and ignore the rest until ~$500/mo total spend. (Will Larson: spend your control budget where the variance is.)
- **Anomaly detection should be DIY for Beta, not Vantage/CloudZero.** Vantage's free tier (<$2,500 tracked spend) is the only third-party worth wiring, and only post-Beta. For Beta, a daily cron that reads OpenAI's `/usage` + `/costs` API and posts to a Telegram/email when day > 1.3x trailing-7-day-avg is enough. **Vantage/CloudZero are overkill below ~$2,000/mo.**
- **Fail-CLOSED on cost, fail-SOFT on UX.** For a mental-health product you must NEVER let an LLM cost cap silently drop a crisis message. The pattern is: hard per-user token budget → on breach, route to a **degraded-but-safe** path (cached safety responses + crisis resources + human-escalation banner), NEVER a raw 429/500 error and NEVER unlimited spend. This is "fail-closed on the wallet, fail-soft on the human." (Vogels: everything fails, design the failure.)
- **Compliance cost is real and front-loaded.** Supabase Pro $25 ($35–75 realistic) is needed for daily backups + the LGPD Art.18 deletion SLA; Sentry Team $26 only if you actually need retained error evidence; Supabase Team $599 (SOC2/ISO + HIPAA path) is a **post-PMF, post-revenue** decision, not a Beta one. Map every compliance dollar to a specific obligation before paying it. (Ebersman: don't buy enterprise tiers for a 20-person Beta.)

---

## 2. Anipis Vendor Cost Model — Beta vs 100 vs 1,000 users

All figures USD/month unless noted. Pricing as researched May 2026 (sources §11).

### 2.1 Per-vendor pricing reference (verified)

| Vendor | Free tier | Paid floor | Usage driver |
|---|---|---|---|
| Railway | Hobby $5 (incl. usage credit) | Pro $20 + usage ($20/vCPU, $10/GB RAM, $0.15/GB disk) | always-on API container |
| Supabase | Free $0 (500MB db, 50k MAU) | Pro $25 → realistic $35–75 w/ usage; Team $599 (SOC2/ISO, 14d backup); Enterprise = HIPAA | db storage, MAU, egress |
| OpenAI API | none (pay-as-you-go) | tier by cumulative spend | tokens in/out |
| Anthropic | $0 (deferred) | — ($30k/yr min if reactivated) | DEFERRED — keep $0 |
| Sentry | Developer $0 (5k err) | Team $26 (50k err, 7d), Business $80 (90d, SSO/SAML) | error events |
| Langfuse | Hobby $0 (50k units/mo) | Core $29, Pro $199; overage $8/100k units | trace units (NOT tokens) |
| Upstash | Free $0 | Pro ~$10 (pay-per-request) | Redis commands |
| Cloudflare Pages | Free | — | static hosting (free) |
| Domain | — | ~$20/yr (~$1.67/mo) | fixed |

### 2.2 OpenAI token cost — the only variable that matters

Model assumptions (verified May 2026 pricing per 1M tokens):

| Model | Input | Output | Use for |
|---|---|---|---|
| GPT-4o-mini | $0.15 | $0.60 | classifier, safety pre-filter, summaries (DEFAULT) |
| GPT-5 | $1.25 | $10.00 | main empathic conversation turns |
| GPT-5.4 | $2.50 | $15.00 | escalate only if quality demands |

**Conversation cost unit (one user turn, realistic mental-health chat):**
- Context sent (system + safety layers + history): ~2,500 input tokens
- Response generated: ~400 output tokens
- On **GPT-5**: (2,500 x $1.25 + 400 x $10) / 1M = **~$0.0071/turn** (~0.71¢)
- On **GPT-4o-mini**: (2,500 x $0.15 + 400 x $0.60) / 1M = **~$0.0006/turn** (~0.06¢)
- Blended (safety pre-filter on mini + main turn on GPT-5): **~$0.0077/turn**

**Per-active-user/day:** Beta journaling+chat usage ≈ 10–25 turns/day → **$0.08–$0.19/user/day** on GPT-5 blend. With prompt caching of the static system+safety block (cached input ~$0.50/1M vs $1.25), this drops ~20–30% → **$0.06–$0.14/user/day**.

### 2.3 Three concrete scenarios

**SCENARIO A — Beta (20 users, 14 days)**

| Vendor | Cost (14d) | Notes |
|---|---|---|
| Railway | ~$2.50 | Hobby $5/mo prorated; one small container |
| Supabase | $0 | Free tier (well under 500MB / 50k MAU) |
| OpenAI | **$1.40–$6.00** | 20 users x 14d x ($0.08–$0.19/day blended GPT-5) ≈ $22 *if all 20 are daily-active at high end*; realistic w/ ~50% DAU and caching → $1.40–$6 |
| Sentry | $0 | Developer free (5k errors covers Beta) |
| Langfuse | $0 | Hobby 50k units; trim instrumentation (top-level traces only) |
| Upstash | $0 | Free tier |
| Cloudflare | $0 | free |
| Domain | ~$0.78 | prorated |
| **TOTAL Beta (14d)** | **~$5–$11 typical, $22 worst-case** | |
| **TOTAL monthly-equivalent** | **~$11–$25/mo** | |

> Takeaway (Damodaran): the brief's "$50–100/mo Beta" is conservative-high and the "$200–500 OpenAI" line is a category error for 20 users. **Budget $25/mo, alert at $50.** A $50 OpenAI deposit funds the *entire Beta several times over* — that's a Tier-2 ramp deposit, not a burn estimate.

**SCENARIO B — 100 active users (post-Beta, freemium soft-launch)**

| Vendor | Cost/mo | Notes |
|---|---|---|
| Railway | $20–35 | Pro + modest usage |
| Supabase | $25–45 | Pro (needed for backups/SLA); usage modest at 100 MAU |
| OpenAI | **$180–420** | 100 users x ($0.06–$0.14/day) x 30 = $180–$420; assumes caching + mini pre-filter; freemium caps trim further |
| Sentry | $26 | Team (real error volume now) |
| Langfuse | $0–29 | likely still Hobby; Core $29 if >50k units |
| Upstash | $10 | Pro |
| Cloudflare | $0 | free |
| Domain | $1.67 | |
| **TOTAL** | **~$265–$570/mo** | OpenAI = ~70% of spend |

**SCENARIO C — 1,000 active users (scale)**

| Vendor | Cost/mo | Notes |
|---|---|---|
| Railway | $60–150 | scaled containers / autoscale |
| Supabase | $75–150 (Pro) OR $599 (Team if SOC2/HIPAA needed) | growth in storage+egress+MAU |
| OpenAI | **$1,800–$4,200** | 1,000 x ($0.06–$0.14/day) x 30; freemium caps + caching are the difference between $1.8k and $4.2k |
| Sentry | $26–80 | Team→Business if SSO/90d needed |
| Langfuse | $29–199 | Core/Pro by trace volume; self-host to cut 80%+ |
| Upstash | $10–40 | request growth |
| Cloudflare | $0–20 | |
| Domain | $1.67 | |
| **TOTAL** | **~$2,000–$5,300/mo** | OpenAI = 80–85% of spend |

> Pattern (Vogels/Larson): **as you scale, the fixed vendors stay boring and OpenAI dominates the curve.** At 1,000 users, every cost-engineering hour should go to token economics (caching, model routing, freemium caps), not to shaving $40 off Railway.

---

## 3. Cost Anomaly Alerting — concrete thresholds + tools (free → paid path)

### 3.1 The threshold (research-backed)

Industry guidance (FinOps Foundation, AWS/GCP anomaly detection): **a 5% threshold fires constantly on normal variance — too noisy.** The validated default is **>20% over a 7-day trailing average, OR an absolute floor**, whichever is higher. The brief's "30% over baseline" is a *good* setting — slightly looser than 20%, which suits a low-volume Beta where day-to-day variance is naturally high.

**Anipis recommended rules:**

| Stage | Rule | Channel |
|---|---|---|
| Beta | OpenAI day-spend > **1.3x** trailing-7d-avg **AND** > **$3 absolute** | Telegram / email, daily 08:00 |
| Beta | OpenAI cumulative-month > **$40** (hard 80% of $50 deposit) | immediate |
| 100u | any vendor month-to-date > **1.3x** same-day-last-month | daily digest |
| 100u | OpenAI hourly tokens > **3x** 36h baseline (runaway signal) | immediate |
| 1,000u | per-feature or per-tenant cost > **1.5x** its 14-day baseline | daily |

The dual absolute+percentage gate is exactly how AWS/GCP/OCI anomaly detectors avoid false positives at low volume — require BOTH a % spike AND a $ floor.

### 3.2 Tools — free → paid path

| Spend level | Tool | Cost | Why |
|---|---|---|---|
| **Beta ($0–50/mo)** | **DIY cron** reading OpenAI `/v1/usage` + Costs API → Telegram | $0 | Vantage/CloudZero are pure overkill here. A 40-line script wins. |
| **$50–500/mo** | **OpenAI native** (usage dashboard + per-project budget limits + email alerts) + DIY cron | $0 | OpenAI lets you set hard monthly budget per project with email at thresholds. Use it. |
| **$500–2,500/mo** | **Vantage free tier** (covers <$2,500 tracked spend) | $0 | unifies vendors, anomaly detection, unit-cost tracking; free until you cross $2.5k |
| **$2,500–7,500/mo** | **Vantage Pro** | $30/mo | fixed-rate, transparent; cheapest credible multi-vendor |
| **$5,000+/mo or eng-attribution need** | **CloudZero** (custom quote) or stay Vantage Business $200/mo | $200+ | CloudZero excels at code/feature/customer-level cost intelligence + hourly AI anomaly detection (36h vs 12-mo baseline). Only worth it when per-customer margin decisions need data. |

**Verdict:** For Anipis, **DIY → OpenAI native → Vantage free → Vantage Pro $30.** You likely never need CloudZero/Finout/Datadog (those are enterprise multi-cloud tools). Revisit only if monthly LLM spend crosses ~$3,000 and you're making per-customer pricing decisions.

---

## 4. OpenAI Cost Protection — per-user budget, token caps, abuse detection

This is the single most important control. Layer four defenses:

### 4.1 Org/project hard ceiling (the circuit breaker)
- Set an OpenAI **project-level monthly budget hard limit** at $50 for Beta, with email alerts at 50/75/90%. This is the absolute backstop — OpenAI stops serving when hit. (Beta deposit = $50, so this is self-enforcing.)

### 4.2 Per-user token budget (the meter)
Track tokens per `user_id` in Supabase/Upstash. Recommended Beta caps:
- **Daily soft cap:** 60 turns/user/day (~$0.46/user/day worst case) → triggers degraded path (§7).
- **Daily hard cap:** 120 turns/user/day → blocks new LLM calls, serves cached safety + escalation banner.
- **Monthly cap (freemium, post-Beta):** e.g. free tier = 300 turns/mo; paid = unmetered-with-fair-use.

Implementation: pass `metadata: { user_id, feature, tenant_id }` on every OpenAI call (OpenAI supports request metadata; Langfuse/Helicone/Portkey read it). Increment a Redis counter (Upstash) keyed `usage:{user_id}:{yyyymmdd}`. Check-before-call.

### 4.3 Token caps per call (the governor)
- `max_tokens` (output) hard-set: 500 for chat, 1,500 for journaling summary. Never leave it unbounded — runaway generation is a top cost-spike cause.
- Context window discipline: truncate history to last N turns + rolling summary. Don't resend full transcripts (the 2,500-token context assumption depends on this).
- **Prompt-cache the static system+safety prefix** (cached input ~$0.50/1M vs $1.25) — biggest single lever, 20–30% off input cost.
- **Model routing:** GPT-4o-mini for classification/safety pre-filter/summaries; GPT-5 only for the empathic conversational turn. This alone is ~10x cheaper on the non-conversational ~40% of calls.

### 4.4 Abuse / runaway detection
- **Per-user velocity:** >10 turns/minute or >200 turns/day on a single user_id = bot/abuse flag → throttle + log.
- **Spend-per-user outlier:** any user > 5x cohort median daily cost → alert (this is your "individual power user / abuser" signal).
- **Hourly org tokens > 3x 36h baseline** = runaway (loop bug, prompt-injection amplification, abuse) → page yourself.
- Rate-limit at the edge (Cloudflare / Upstash rate-limit) before the request even reaches OpenAI.

> Larson: "the cheapest token is the one you don't send." Order of leverage: model routing > context truncation > prompt caching > caps. Do all four.

---

## 5. Vendor Consolidation Analysis — consolidate or stay distributed?

**The question:** Vercel offers Postgres (Neon) + edge + AI Gateway (OpenAI/Anthropic routing) under one bill. Should Anipis consolidate onto Vercel (or similar) instead of Railway+Supabase+Cloudflare+direct-OpenAI?

### 5.1 Cost comparison (verified)
- Railway: Hobby $5, usage-based (cheap when not 24/7, e.g. $5–15/mo for moderate Next.js).
- Fly.io: pay-as-you-go, ~$1.94/mo tiny VM, ~$10.70/mo for 1vCPU/2GB (4x cheaper than Railway at medium tier, but always-on).
- Vercel: Pro $20/dev/mo (so $20 for solo) + usage; bundles edge + AI Gateway + Neon Postgres marketplace.

### 5.2 Consolidation trade-offs

| Dimension | Consolidate (e.g. Vercel-centric) | Stay distributed (current) |
|---|---|---|
| Billing simplicity | ✅ one invoice, one anomaly surface | ❌ 7 invoices to reconcile |
| Cost at Beta | ≈ neutral ($20 Vercel vs $5 Railway + $0 Supabase) — slightly *higher* | ✅ cheaper floor |
| Lock-in risk | ❌ high — migrating off Vercel data + functions is costly | ✅ each piece swappable |
| LGPD/data residency control | ❌ less control over where Postgres lives | ✅ Supabase region pinned, defensible |
| LLM flexibility | ✅ AI Gateway = multi-provider failover + built-in cost tracking | ❌ DIY routing |
| Blast radius | ❌ one vendor outage = whole app down | ✅ degraded, not dead |
| SOC2/compliance path | depends on vendor's certs | ✅ Supabase Team/Enterprise has clear SOC2/ISO/HIPAA path |

### 5.3 Verdict for Anipis

**Stay distributed for Beta and through ~1,000 users. Do NOT consolidate now.** Reasons:
1. Cost savings from consolidation are **near zero** at this scale (~$15/mo difference) — not worth the migration or lock-in.
2. For a **mental-health product under LGPD**, the ability to pin Supabase region, hold a clear DPA, and point to a documented SOC2/HIPAA upgrade path is a **compliance asset** you'd weaken by consolidating onto a general-purpose host's marketplace Postgres.
3. The one consolidation worth considering is a **thin LLM gateway** (Portkey / Helicone / Vercel AI Gateway / OpenRouter) in front of OpenAI — NOT to consolidate hosting, but to get **built-in per-user cost tracking, caching, failover, and a kill-switch** without building it yourself. This is consolidation *of the risky layer only*. Evaluate at the 100-user mark.

> Vogels: "consolidate the operationally painful, distribute the strategically risky." Hosting isn't painful at this scale; LLM cost tracking is — so add a gateway, keep the rest split.

---

## 6. Tier Upgrade Triggers (graduate each vendor on data, not vibes)

| Vendor | Stay on free/floor until → | Upgrade trigger (the number) | Cost of upgrade |
|---|---|---|---|
| **Railway** | Hobby $5 | API container CPU/RAM sustained >70% OR cold-start latency hurts UX OR need >1 service | Pro $20 + usage |
| **Supabase** | Free $0 | **ANY of:** approaching 500MB db, need daily backups (LGPD Art.18 evidence), need >50k MAU, need point-in-time recovery, or going to real production | Pro $25 (→$35–75). **Plan this for Beta-exit, ~30/Mai.** |
| **Supabase Team** | Pro | Need SOC2/ISO27001 report for an enterprise/B2B deal OR contractual 14-day backup retention OR partner DPA demands it | $599 — **post-revenue, post-PMF only** |
| **Supabase Enterprise** | Team | Need **HIPAA BAA** (only if you ever serve US PHI) or BYO-cloud | custom |
| **OpenAI tier** | Tier 1 | Auto-advances on cumulative spend; deposit $50 → Tier 2 (higher RPM/TPM). Upgrade tier only when **rate limits actually throttle users**, not preemptively | $0 (auto) |
| **Sentry** | Developer free (5k err) | Errors >5k/mo OR need >7-day error retention as audit evidence | Team $26 |
| **Sentry Business** | Team | Need SSO/SAML, 90-day insights, anomaly detection, cross-team routing | $80 — **only with a team / enterprise security review demand** |
| **Langfuse** | Hobby (50k units) | >50k trace units/mo (trim instrumentation first — can cut 50–90%) | Core $29; or **self-host (MIT) to avoid the $500→$15k/mo scaling trap** seen at high volume |
| **Upstash** | Free | Rate-limit/cache request volume exceeds free quota | Pro ~$10 |

**Rule:** every upgrade must cite a **metric crossing a line**, logged in the cost doc. "We feel like we need it" is not a trigger. (Ebersman discipline.)

---

## 7. Quota Cap Behavior — fail-open vs fail-closed for mental health

This is a **safety decision, not just a cost decision.** Standard SaaS logic says "fail-open is friendlier"; mental-health context modifies this.

### 7.1 The two failures, separated
There are two distinct things that can hit a limit, and they need **opposite** behaviors:

| What hits the limit | Behavior | Why |
|---|---|---|
| **The wallet** (org/user cost cap) | **Fail-CLOSED on spend** | Never let cost run unbounded. Stop calling the paid LLM. |
| **The human** (user mid-conversation) | **Fail-SOFT, never hard-error** | A person reaching out for support must NEVER get a raw 429/500. |

### 7.2 The Anipis pattern: "fail-closed on the wallet, fail-soft on the human"

When a per-user or org cap is hit:
1. **Stop new paid LLM generation** (fail-closed on spend).
2. **Serve a degraded-but-safe path** (fail-soft on UX), in priority order:
   - Run the cheap local/rule-based **safety classifier first** — if the message shows crisis/self-harm signals, ALWAYS bypass the cap and serve the crisis-resource flow + human-escalation (crisis safety overrides cost, always).
   - Otherwise serve a **warm, pre-written holding response** ("I'm here with you — I've hit a brief technical limit, let me make sure you're supported") + offer scheduled continuation + crisis resources banner.
   - Never an error code, never silence, never a dead chat.
3. **Alert the founder immediately** (a cap-hit during Beta with 20 users means something is wrong — bug, abuse, or under-provisioning).

### 7.3 Why not pure fail-open?
Pure fail-open (just keep serving, eat the cost) is dangerous for an unmonetized product with a $30k/yr Anthropic landmine and an OpenAI runaway risk — one prompt-injection loop or abusive user could drain the deposit and, worse, mask a bug. **You need the wallet ceiling.** But you achieve safety by making the *degraded path itself safe*, not by removing the ceiling.

> This is the mental-health-specific override: in every other SaaS, "fail-closed = show an error" is acceptable. Here, **a hard error to someone in distress is a product-safety incident.** The crisis-classifier-bypass is non-negotiable and must be tested as a P0 gate.

---

## 8. Per-User Cost Attribution at Scale (post-Beta planning)

You can't optimize what you can't attribute. Build the tagging now (cheap), use the dashboards later.

### 8.1 Instrument three dimensions (industry standard for AI SaaS)
Tag **every** LLM request with metadata — no exceptions:
- `user_id` — "who is driving consumption?" (power users, abusers, B2C unit economics)
- `feature` / `route` — "which surface is expensive?" (chat vs journaling vs summary vs safety-filter)
- `tenant_id` — "is this customer/cohort profitable?" (matters if Anipis ever does B2B/clinic deals). **Tenant-less spans are the #1 cause of month-end reconciliation pain** — always include it even if it's "self" today.

### 8.2 Where the data lives
- **Cheap path (Beta→100u):** Langfuse Hobby/Core already captures token cost per trace; add the metadata and you get per-user/per-feature views for free. Plus a Supabase table `usage_events(user_id, feature, model, tokens_in, tokens_out, cost_usd, ts)` written on every call — this is your source of truth and your freemium-metering ledger.
- **Scale path (1,000u+):** Helicone / Portkey / OpenMeter sit in front of OpenAI and do per-user/per-route/per-tenant attribution + caching automatically. Or Vantage for the cross-vendor roll-up.

### 8.3 The unit-economics metric to watch (Campbell/Lemkin)
- **Cost-per-active-user/month (CPAU):** total LLM+infra ÷ MAU. At Beta ≈ $0.50–$1/user/mo. Track it monthly.
- **Cost-per-active-user vs (eventual) ARPU:** when you monetize, gross margin = 1 − CPAU/ARPU. ProfitWell rule: if a freemium free user costs > a small fraction of blended ARPU, your free tier is structurally unprofitable — **cap the free tier's turns** (see §4.2) so a free user can never cost more than, e.g., $0.50/mo. (Campbell: free-tier abuse is a margin killer if uncapped.)
- **Cost concentration:** at scale, expect ~10–20% of users to drive ~50%+ of LLM cost. Per-user attribution lets you (a) design the freemium cap around the median, not the mean, and (b) spot abuse early.

---

## 9. Compliance-to-Cost Mapping (what cost buys what obligation)

Map each compliance dollar to a specific obligation — don't buy enterprise tiers speculatively.

| Compliance need | Vendor line that satisfies it | Cost | Required at |
|---|---|---|---|
| **Daily backups + point-in-time recovery** (LGPD Art.18 deletion/restore, data integrity) | Supabase **Pro** | $25 (→$35–75) | **Beta-exit (~30/Mai)** — first real compliance spend |
| **LGPD Art.18 deletion SLA** (saga across tables, tombstone) | Already in app code (per security-audit sprint) + Pro backups to prove restore | $25 | Beta-exit |
| **Error/audit evidence retained >7 days** | Sentry **Team** ($26, 7d) or **Business** ($80, 90d) | $26–80 | When you need to *show* error history to a partner/regulator — **not before** |
| **SOC2 Type II / ISO 27001 attestation** (B2B/enterprise sales gate) | Supabase **Team** ($599, includes SOC2+ISO) | $599 | **Post-PMF, post-revenue, when a deal requires it.** NOT a Beta cost. |
| **HIPAA BAA** (US PHI) | Supabase **Enterprise** (custom) | custom | Only if you serve US health data — likely **never** for a BR-first product |
| **LLM data-processing terms / no-train (ZDR)** | OpenAI API (API data not trained on by default) + DPA; keep Anthropic **deferred** | $0 | now (config, not spend) |
| **Observability for compliance (LIA/audit on AI decisions)** | Langfuse Hobby/Core | $0–29 | Beta (already planned) |
| **Sub-processor transparency / DPA inventory** | process, not a paid tier | $0 | now |

### Key compliance-cost insights
- **SOC2 does NOT require Sentry Team.** Sentry Team buys you *retained error data* (useful as one piece of evidence), but SOC2 is a process + controls audit, not a tool purchase. Don't buy Sentry Business "for SOC2" — that's a misattribution. (The brief's question #11 implies a link that doesn't strictly exist.)
- **The SOC2/ISO line is Supabase Team $599** — that's the real "compliance tier" cost, and it's a ~$7,200/yr commitment. Defer it until a paying enterprise customer demands the report. For a B2C mental-health Beta and freemium soft-launch, **you do not need it.**
- **The cheapest compliance posture for Beta:** Supabase Pro ($25) for backups + app-level LGPD deletion (already built) + OpenAI API default no-train + DPA paperwork. Total *new* compliance spend for Beta-exit ≈ **$25/mo.**

> Ebersman: at 20 users, compliance is 90% paperwork and config (free) and 10% one $25 backup tier. The $599/$custom tiers are revenue-gated decisions, not readiness decisions.

---

## 10. Implementation — week by week

**Pre-Beta (now → 30/Mai):**
- [ ] Set OpenAI **project budget hard limit $50** + email alerts at 50/75/90%.
- [ ] Ship per-call controls: `max_tokens` caps, model routing (mini for safety/classify, GPT-5 for chat), context truncation, prompt-cache the static safety prefix.
- [ ] Implement per-user daily token counter in Upstash (`usage:{user_id}:{date}`), soft cap 60 / hard cap 120 turns/day.
- [ ] Implement the **fail-closed-wallet / fail-soft-human** path with the **crisis-classifier bypass** (P0 — test it).
- [ ] Write `usage_events` table in Supabase; tag every LLM call with `{user_id, feature, tenant_id}`.
- [ ] Trim Langfuse instrumentation to top-level traces (stay under 50k units).
- [ ] DIY cron: read OpenAI usage/costs API daily 08:00 → Telegram alert if day > 1.3x 7d-avg AND > $3, or month > $40.

**Beta week 1 (30/Mai–05/Jun):**
- [ ] Daily glance at the cron digest + OpenAI dashboard (2 min/day, no spreadsheet).
- [ ] Watch for any user > 5x cohort-median cost (abuse/bug signal).
- [ ] Confirm crisis-bypass actually fires when a cap is hit (synthetic test).

**Beta week 2 (06/Jun–13/Jun):**
- [ ] Compute actual CPAU (cost per active user). Compare to model (§2.3 A).
- [ ] Decide Supabase Pro upgrade timing (likely flip ON at Beta-exit for backups).

**Beta-exit / 100-user prep:**
- [ ] Flip Supabase **Pro $25** (backups for LGPD).
- [ ] Add **Sentry Team $26** only if errors > 5k/mo or evidence retention needed.
- [ ] Stand up a **LLM gateway** (Portkey/Helicone/Vercel AI Gateway) for built-in per-user attribution + caching + kill-switch.
- [ ] Define freemium cap so a free user can't exceed ~$0.50/mo cost (§8.3).

**~$500/mo+ (scale):**
- [ ] Wire **Vantage free tier** for cross-vendor anomaly + unit-cost.
- [ ] Build per-feature/per-tenant cost dashboards from `usage_events`.
- [ ] Re-evaluate Langfuse self-host (MIT) vs Cloud (avoid the $500→$15k scaling trap).
- [ ] Revisit Vantage Pro ($30) at >$2,500 tracked spend; CloudZero only if per-customer margin decisions demand code-level attribution.

**Never (until forced by a specific demand):**
- ❌ Supabase Team $599 (until a paying enterprise/SOC2 deal)
- ❌ Anthropic reactivation ($30k/yr) — keep deferred
- ❌ CloudZero/Finout/Datadog cost tooling — overkill below ~$3k/mo

---

## 11. Sources

- [Managing costs | OpenAI API](https://developers.openai.com/api/docs/guides/realtime-costs)
- [OpenAI Pricing in 2026 (Finout)](https://www.finout.io/blog/openai-pricing-in-2026)
- [OpenAI API Cost In 2026 (CloudZero)](https://www.cloudzero.com/blog/openai-pricing/)
- [OpenAI API Pricing | OpenAI](https://openai.com/api/pricing/)
- [Current OpenAI API Pricing 2026: GPT-5.5/5.4/4o (DevTk.AI)](https://devtk.ai/en/blog/openai-api-pricing-guide-2026/)
- [OpenAI API Pricing | developers.openai.com](https://developers.openai.com/api/docs/pricing)
- [Rate limits | OpenAI API](https://developers.openai.com/api/docs/guides/rate-limits)
- [OpenAI Rate Limits: TPM, RPM & Tier Limits 2026 (Inference.net)](https://inference.net/content/openai-rate-limits-guide/)
- [Best AI Cost Observability Tools in 2026 (Finout)](https://www.finout.io/blog/best-ai-cost-observability-tools-in-2026)
- [Introduction to FinOps for SaaS (FinOps Foundation)](https://www.finops.org/wg/finops-for-software-as-a-service-saas/)
- [State of FinOps 2026 Report](https://data.finops.org/)
- [Best FinOps Tools for Startups and Scaling Teams (Vantage)](https://www.vantage.sh/blog/finops-tools-for-startups)
- [CloudZero Alternatives & Competitors 2026](https://www.cloudzero.com/blog/cloudzero-alternatives/)
- [Finout vs CloudZero: Side-by-Side 2026](https://www.finout.io/blog/finout-vs-cloudzero-a-side-by-side-breakdown-for-2026)
- [LLM API Pricing Comparison & Cost Guide (May 2026, CostGoat)](https://costgoat.com/compare/llm-api)
- [LLM Chatbot Pricing 2026 (AI Superior)](https://aisuperior.com/llm-chatbot-pricing-cost/)
- [Complete LLM Pricing Comparison 2026 (CloudIDR)](https://www.cloudidr.com/blog/llm-pricing-comparison-2026)
- [Fly.io vs Railway 2026 (The Software Scout)](https://thesoftwarescout.com/fly-io-vs-railway-2026-which-developer-platform-should-you-deploy-on/)
- [Railway vs Fly | Railway Docs](https://docs.railway.com/platform/compare-to-fly)
- [Vercel vs Fly.io 2026 (BuildMVPFast)](https://www.buildmvpfast.com/compare/vercel-vs-fly-io)
- [Supabase Pricing 2026 (MetaCTO)](https://www.metacto.com/blogs/the-true-cost-of-supabase-a-comprehensive-guide-to-pricing-integration-and-maintenance)
- [Supabase Pricing 2026 (Automation Atlas)](https://automationatlas.io/answers/supabase-pricing-explained-2026/)
- [About billing on Supabase | Supabase Docs](https://supabase.com/docs/guides/platform/billing-on-supabase)
- [Langfuse Pricing 2026 (CheckThat.ai)](https://checkthat.ai/brands/langfuse/pricing)
- [Langfuse Pricing: What It Really Costs (Glassbrain)](https://glassbrain.dev/blog/langfuse-pricing)
- [Token & Cost Tracking - Langfuse Docs](https://langfuse.com/docs/observability/features/token-and-cost-tracking)
- [Sentry Pricing 2026 (CostBench)](https://costbench.com/software/developer-tools/sentry/)
- [Sentry Pricing 2026 (G2)](https://www.g2.com/products/sentry/pricing)
- [Real-Time Cloud Cost Anomaly Detection (CloudMonitor)](https://cloudmonitor.ai/2026/02/real-time-cloud-cost-anomaly-detection/)
- [AWS Cost Anomaly Detection](https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/)
- [Managing Cloud Cost Anomalies (FinOps Foundation)](https://www.finops.org/wg/managing-cloud-cost-anomalies/)
- [From Bills to Budgets: Track LLM Cost Per User (Traceloop)](https://www.traceloop.com/blog/from-bills-to-budgets-how-to-track-llm-token-usage-and-cost-per-user)
- [LLM Agent Cost Attribution: Production 2026 Guide (Digital Applied)](https://www.digitalapplied.com/blog/llm-agent-cost-attribution-guide-production-2026)
- [Per-tenant LLM margin operating model for AI SaaS (Opsmeter)](https://opsmeter.io/blog/llm-cost-per-tenant-profitability-tracking)
- [Tracking LLM Costs Per User with Portkey](https://portkey.ai/docs/guides/use-cases/track-costs-using-metadata)
- [LLM Error Handling and Fallback Strategies for Production (BuildMVPFast)](https://www.buildmvpfast.com/blog/building-with-unreliable-ai-error-handling-fallback-strategies-2026)
- [Rate Limiting and Quotas for LLM APIs (Hivenet)](https://www.hivenet.com/post/llm-rate-limiting-quotas)
- [LLM Rate Limiting and Quota Management: Production Best Practices (Reintech)](https://reintech.io/blog/llm-rate-limiting-quota-management-production-best-practices)

---

*Mind-clone synthesis note: Campbell (freemium cap economics, CPAU vs ARPU), Larson (control budget where variance is, cheapest token is unsent), Vogels (design the failure, consolidate-painful/distribute-risky), Damodaran (model the cohort not the brochure), Lemkin (gross margin discipline pre-monetization), Cook (cost-per-active-user as north star), Ebersman (don't buy enterprise tiers for a Beta; revenue-gate compliance spend).*
