# SRE & Observability for Anipis — Solo Founder Edition

**Project:** Anipis (mental health digital companion, BR)
**Author:** Squad Research / SRE Stream (channeling Majors, Murphy, Gregg, Rosenthal, Forsgren)
**Date:** 2026-05-19
**Status:** Recommendation — pre-Closed-Beta (30/Mai)
**Scope:** Closed Beta (20 users) → Public (thousands), solo-founder ops
**Stack assumed:** Railway Hobby, Supabase Postgres, OpenAI API, Sentry, Langfuse (EU), Upstash Redis, Node/TS API at `apps/api`.

---

## 1. Executive Summary

- **Anipis is not a normal SaaS.** Crisis-detection false negatives = lives at stake. The single most important SRE artifact you will build this month is **the Safety SLO** (Section 6), not the latency SLO. Treat it as a regulatory control, not a metric.
- **For Beta (20 users) the right answer is "boring, free, and honest", not "best-in-class".** Sentry Developer (free) + Better Stack free uptime + Railway native logs + a 1-page Grafana Cloud Free dashboard pulling Postgres + a manual crisis-event nightly digest covers >90% of needs at **$0/month**. Defer Honeycomb/Axiom until you have >5 paying cohorts or >50 RPS sustained.
- **Adopt 4 Golden Signals + 1 (Safety)**, instrumented at exactly 5 endpoints (`/chat/message`, `/crisis/alert-contact`, `/api/beta-signup`, `/auth/*`, `/journal/*`). Do not boil the ocean.
- **Single-person on-call rule (Murphy/Majors):** *fewer than 2 pages per week, or you will burn out and the system will degrade silently.* Page only on Safety SLO burn + total outage. Everything else = morning digest.
- **Observability-Driven Development (Majors) is mandatory now**: every PR touching the crisis path must answer "how will I know in production that this works?" *before* merge. This is cheaper than any tool.

---

## 2. The 4 Golden Signals — Anipis Instrumentation

Google's four (Latency / Traffic / Errors / Saturation) are the right primitive. Brendan Gregg's USE applies to *infrastructure*; Tom Wilkie's RED (Rate/Errors/Duration) applies to *services*. We use **RED at the API layer + USE at Railway/Postgres + Saturation overlays for OpenAI quota**.

### 2.1 Endpoints in scope (Beta)

Only instrument the 5 user-facing critical paths. Adding everything = noise.

| # | Endpoint | Why critical | Golden Signal priority |
|---|---|---|---|
| E1 | `POST /chat/message` | Core product, AI cost, **crisis path** | All 4 + Safety |
| E2 | `POST /crisis/alert-contact` | Lives at stake | Errors + Latency (hard) |
| E3 | `POST /api/beta-signup` | Funnel, invite enum risk | Rate + Errors |
| E4 | `POST /auth/*` (login, magic link, refresh) | Lockouts kill retention | Errors + Latency |
| E5 | `POST /journal/*` | PII-heavy, F1 audit history | Errors + Saturation |

### 2.2 Concrete instrumentation (Pino + Sentry + Postgres)

**Latency** — record p50/p95/p99 per endpoint via `process.hrtime.bigint()` brackets, ship as Pino structured log:

```ts
const t0 = process.hrtime.bigint();
// ... handler
const latency_ms = Number(process.hrtime.bigint() - t0) / 1e6;
logger.info({ evt: 'http_request', endpoint: 'POST /chat/message',
              status, latency_ms, user_id_hash, model, tokens_in, tokens_out,
              crisis_level: result.riskLevel, /* GREEN|YELLOW|ORANGE|RED */
              trace_id }, 'request');
```

Thresholds (Beta):

| Endpoint | p95 target | p99 target | Why |
|---|---|---|---|
| `/chat/message` (non-crisis) | < 3.5 s | < 6 s | LLM-bound; user perceives "thinking" up to ~3 s |
| `/chat/message` (**crisis path**) | **< 1.5 s** | **< 2.5 s** | Crisis response must feel immediate; delay ≈ harm |
| `/crisis/alert-contact` | < 800 ms | < 1.5 s | Email/SMS dispatch, hard floor |
| `/auth/*` | < 400 ms | < 800 ms | Standard CRUD |
| `/api/beta-signup` | < 600 ms | < 1.2 s | Standard CRUD |
| `/journal/*` | < 500 ms | < 1 s | Standard CRUD + RLS |

**Traffic (Rate)** — count requests/minute by endpoint × status. At Beta scale this is ~20-200 req/day total. Derive from same Pino log via Grafana Cloud Loki/Logs query (`count by (endpoint) (rate({evt="http_request"}[5m]))`).

**Errors** — three buckets (do not collapse):
1. **5xx** (server fault, page-worthy)
2. **4xx-business** (validation, expected — *not* alertable)
3. **4xx-auth** (401/403 spikes = attack signal)

Field: `error_class` in Pino log (`server_error | validation | auth_failure | rate_limited | llm_quota | dependency`). Sentry auto-captures uncaught — but you must `Sentry.captureException(err, { tags: { endpoint, error_class }})` in the catch.

**Saturation** — the 4 things that will actually break Anipis:

| Resource | Signal | Where to read | Alert threshold |
|---|---|---|---|
| OpenAI quota | 429s + monthly $ burn | Sentry tag `dependency:openai`, OpenAI dashboard CSV nightly | >80% of $ budget mid-month |
| Railway Hobby RAM/CPU | Container metrics | Railway dashboard + scrape `/metrics` if exposed | >80% sustained 10min |
| Postgres connections | pool_used / pool_max | Supabase dashboard, `pg_stat_activity` nightly | >70% of pool |
| Upstash Redis | commands/sec, % of daily quota | Upstash dashboard | >70% of daily quota |

**USE on Postgres** (Brendan Gregg) — once a day, run:
```sql
SELECT datname, numbackends, xact_commit, xact_rollback,
       blks_read, blks_hit, deadlocks
FROM pg_stat_database WHERE datname = 'anipis';
```
Cache hit ratio `blks_hit / (blks_hit + blks_read)` should be > 0.99. If it drops, you have a query problem long before latency shows it.

---

## 3. SLO / SLI Proposal for Anipis

**Forsgren / DORA framing:** SLOs exist to give the team (you, solo) permission to slow down feature work and pay down reliability debt when the budget burns. They are not vanity numbers.

### 3.1 Beta SLOs (20 users, 30/Mai–30/Jul)

Keep these embarrassingly modest. The point is to *practice the loop*, not to overcommit.

| SLI | SLO target (Beta) | Error budget / 30d | Rationale |
|---|---|---|---|
| `/chat/message` availability (non-5xx) | **99.0%** | 7h 12min | Hobby tier, single region, OpenAI dep |
| `/chat/message` latency p95 < 3.5s | **95%** of minutes | ~36h | LLM variance is real |
| `/crisis/alert-contact` availability | **99.5%** | 3h 36min | Lives at stake — already low traffic |
| `/crisis/alert-contact` latency p95 < 1.5s | **99%** | ~7h | Must feel immediate |
| `/auth/*` availability | 99.5% | 3h 36min | |
| End-to-end crisis path (chat→detect→alert) | **99.0%** complete < 5s | 7h 12min | Compound SLO — see Section 6 |
| **Safety SLO**: crisis recall on internal eval set | **≥ 95%** weekly | 5% miss budget | **See Section 6 — this is the one that matters** |

### 3.2 Scale SLOs (post public launch, thousands of users)

| SLI | SLO (scale) | Notes |
|---|---|---|
| `/chat/message` availability | 99.5% | Adds 2nd region + retries |
| `/chat/message` p95 | 99% < 3s | Caching, prompt compression |
| `/crisis/alert-contact` availability | **99.9%** | Hard requirement — consider DR runbook |
| Safety SLO recall | **≥ 97%** monthly | Tighten as eval set matures |
| Safety SLO precision | track but no SLO | Over-triggering is acceptable in MH |

### 3.3 What to **NOT** set an SLO on

- Internal admin endpoints
- Background jobs unless user-visible
- Anything you can't measure honestly
- Anything you wouldn't roll back a feature to defend

> **Majors rule:** "If you can't imagine pulling a deploy to defend it, it's not an SLO, it's a wish."

---

## 4. Alerting Strategy — One Founder, Two Phones

### 4.1 Priority Tiers

| Tier | Channel | Examples | Cadence target |
|---|---|---|---|
| **P0 — page (3 AM ok)** | SMS + phone call (Better Stack / Pushover) | Total outage (`/healthz` fail > 3min), Safety SLO fast burn (>2% budget in 1h), `/crisis/alert-contact` 5xx rate > 5% over 5min, Postgres down, OpenAI key revoked | **≤ 2 / week target. ≤ 1 / month healthy steady-state.** |
| **P1 — push notify (working hours)** | Slack/Telegram channel + email | SLO slow burn (>10% in 3d), saturation >80%, error rate elevated, latency degraded | ≤ 5 / week |
| **P2 — daily digest** | Single email 9 AM | DORA snapshot, top errors, top slow endpoints, OpenAI $ spent, new users, crisis event count by level, **manual review queue: 5 random GREEN flagged user turns from last 24h for crisis-miss audit** | 1 / day |
| **P3 — weekly review** | Notion/markdown | SLO compliance %, error budget remaining, eval-set safety recall | 1 / week (Monday) |

### 4.2 Multi-window burn-rate alerting (the only formula that matters)

From Google SRE Workbook Ch. 5 — **the single biggest alert-fatigue prevention tactic.**

For each SLO with 30-day window:
- **Fast burn**: 2% budget in 1h → P0 page
- **Medium burn**: 5% budget in 6h → P1 notify
- **Slow burn**: 10% budget in 3d → P2 ticket

Do **not** alert on raw thresholds ("CPU > 80%", "p95 > 3s for 1 minute"). Those are the path to drowning.

### 4.3 Solo-founder discipline rules

1. **One page channel only.** SMS + a single dedicated phone tone. Everything else is silent.
2. **Pager-debt review weekly.** Any P0 that wasn't a real user-harm incident → tune the rule that fired it that same week. No exceptions.
3. **Snooze authority.** You may snooze any P0 for 4h post-acknowledgment without guilt. The system is for you; you are not for the system.
4. **Crisis path P0 is non-snoozeable.** If `/crisis/alert-contact` is degraded, you wake up. This is the single hard rule.
5. **Mute window = treatment day.** Pre-schedule mute for therapy, family events. Better Stack and PagerDuty both support this.

---

## 5. Tooling Stack — Three Budget Tiers

### 5.1 Beta — $0 / month (recommended start)

| Layer | Tool | Why | Limit headroom |
|---|---|---|---|
| Errors / APM lite | **Sentry Developer (free)** | Already in stack, 5k errors + 10k perf units/mo | Comfortable for 20 users |
| Uptime + paging | **Better Stack free** | 10 monitors, SMS + Slack alerts, status page | Plenty |
| Logs | **Railway native logs + Pino JSON** | Already paid via Railway Hobby | 7-day retention OK for Beta |
| Metrics dashboard | **Grafana Cloud Free** | 10k metrics, 50GB logs, dashboards + alerts | Ship via Prometheus scrape from `/metrics` |
| LLM eval / tracing | **Langfuse EU (already in stack)** | Crisis classifier traces, prompt versions, eval datasets | Use existing free tier |
| Postgres metrics | **Supabase dashboard + nightly SQL job** | Free with Supabase | Manual is OK at this scale |
| Crisis safety dashboard | **Custom 1-page Next.js admin route** (`/internal/safety-dashboard`) | You will build this; no vendor does MH-specific | Section 6 |

**Net: $0/mo recurring.** This is the right answer for 20 users. Anything fancier is procrastination disguised as engineering.

### 5.2 Growth — ~$50 / month (~100-500 active users)

Add when you trip ANY of: >50 RPS sustained, >1 paying cohort, first regulatory request, first 1 AM page that you couldn't debug from logs alone.

| Add | Cost | Why |
|---|---|---|
| Sentry Team | $26/mo | 50k errors, performance monitoring, session-style traces, **alerts via SLOs** |
| Better Stack paid (Heartbeats + status page custom domain) | ~$15/mo | Cron monitoring (nightly safety digest must run) + status.anipis.com.br |
| Axiom or Grafana Cloud paid logs | ~$10/mo overage | Once you exceed 50GB |
| (optional) Pushover | one-time $5 | Better paging UX than SMS |

**Net: ~$50/mo.** Note Sentry's transaction events are ~10× cheaper than errors — set `tracesSampleRate: 0.15` and trace the crisis path at `1.0`.

### 5.3 Scale — ~$300 / month (post-public, thousands of users)

| Add | Cost | Why |
|---|---|---|
| **Honeycomb Pro** | $130/mo, 100M events | This is the moment for OpenTelemetry → Honeycomb. High-cardinality queries on `user_id_hash + model + crisis_level` become essential. Majors-grade observability. |
| Sentry Business | $80/mo | Replays, performance flame graphs |
| PagerDuty / Better Stack Team | ~$30/mo | Multi-responder when you hire #2 |
| Grafana Cloud Pro for long-term metrics | ~$50/mo | 13-month retention for compliance |

**Net: ~$300/mo.** At this point a SOC2/ANPD audit is realistic — Honeycomb + Sentry + Langfuse give you queryable evidence.

### 5.4 Tools to explicitly **defer**

- Datadog (great, will eat your runway alive — easily $500-2000/mo)
- New Relic (similar)
- Self-hosted Prometheus + Loki + Tempo + Grafana on your own VM (ops burden = whole evening/week you don't have)
- AI SRE "copilots" (immature, expensive, solve a problem you don't have at 20 users)

---

## 6. CRITICAL — Mental Health Safety SLO

> This is the most important section of this document. If you only read one section, read this one.

### 6.1 Why this needs its own SLO class

Standard SRE thinks about reliability as "did the request succeed". For Anipis, **success of the HTTP response is meaningless if the model misclassified a crisis as GREEN.** Lives are downstream of the classifier, not of the 200.

The recent academic framing (medRxiv 2026, CRADLE Bench arXiv 2510.23845) reframes crisis detection from **prediction accuracy** to an **online safety-oriented monitoring problem** — you continuously balance false negatives and false positives, **prioritizing minimization of false negatives while tolerating uncertainty**. SteadyMind production design uses a four-tier risk system (low/moderate/high/crisis) with **safety overrides preventing mood-trend analysis from giving false reassurance during crisis windows** — Anipis already follows this pattern (GREEN/YELLOW/ORANGE/RED), so the SLO layer is the missing piece.

### 6.2 The Safety SLIs

Maintain a versioned **internal eval set** (start ≥200 labeled exemplars, target 500) covering:
- True-positive RED (explicit suicidal ideation, plan, means)
- True-positive ORANGE (hopelessness, self-harm, severe distress, no immediate plan)
- Ambiguous (idiomatic "matar de rir", "morrendo de cansaço", grief metaphors)
- True-negative (normal venting, low mood, frustration)
- Adversarial (jailbreak, role-play attempts, evasive language)

| SLI | Definition | Beta target | Scale target |
|---|---|---|---|
| **Crisis Recall (RED+ORANGE)** | TP / (TP+FN) on weekly eval run | **≥ 95%** | ≥ 97% |
| **Crisis Recall — RED only** | TP / (TP+FN) on RED subset | **≥ 99%** | **100% (no false negatives tolerated)** |
| **Time-to-Alert** | p95 from RED classification → alert-contact dispatched | < 5 s | < 3 s |
| **Crisis Path Availability** | end-to-end success (`/chat → classify → /crisis/alert-contact → email/SMS sent`) | 99.0% | 99.9% |
| **Manual Audit Catch Rate** | # crisis-class missed in daily 5-sample human review / total sampled | < 1 per 100 (Beta), < 1 per 1000 (scale) | Track from week 1 |

### 6.3 How to measure (concrete)

**Automated nightly eval job (P0 cron):**
```bash
# Runs 02:00 BRT via Railway cron / GitHub Action
# Replays full eval set against current production prompt + model version
# Writes to crisis_eval_runs table + Langfuse dataset
# Emits to Better Stack heartbeat — if cron misses, P1 alert
node scripts/run-crisis-eval.js --set v2.3 --env prod
```

Results table:
```sql
CREATE TABLE crisis_eval_runs (
  id uuid PRIMARY KEY,
  run_ts timestamptz NOT NULL,
  eval_set_version text NOT NULL,
  model text NOT NULL,
  prompt_version text NOT NULL,
  total_red int, tp_red int, fn_red int,
  total_orange int, tp_orange int, fn_orange int,
  total_negative int, fp int,
  recall_red numeric, recall_orange numeric,
  precision_overall numeric,
  latency_p95_ms int,
  passed boolean GENERATED ALWAYS AS (recall_red >= 0.99 AND (tp_red+tp_orange)::numeric/(tp_red+fn_red+tp_orange+fn_orange) >= 0.95) STORED
);
```

**Daily human audit (P0 founder task, 10 min):**
- Auto-sample 5 random conversations classified GREEN/YELLOW from past 24h.
- Review for missed crisis signal.
- Any catch → file as `crisis_eval_miss`, add to eval set v+1, trigger immediate prompt/model retro.
- Tracked in P2 daily digest.

**Compound Crisis Path SLI:**
```
crisis_path_success = (
  message_classified_correctly
  AND alert_contact_dispatched_within_5s
  AND emergency_resources_shown_in_response  -- CVV 188 etc.
  AND audit_event_logged_with_hash_chain     -- F1/Art.18 compliance
)
```
This is your single most important number.

### 6.4 Alerting on Safety SLO

| Burn | Alert | Reason |
|---|---|---|
| Single RED false negative caught by audit | **P0 immediate page + war room** | Non-negotiable. Even one. |
| Eval recall (RED) drops below 99% on nightly run | **P0 immediate page + freeze prompt/model deploys** | Auto-rollback prompt version if available |
| Eval recall (ORANGE) drops below 95% | P1 notify | Investigate same day |
| `/crisis/alert-contact` 5xx > 1% over 5 min | **P0 page** | Alert dispatch is the last mile |
| Time-to-Alert p95 > 5s for 1h | P1 notify | Degraded but not broken |
| FP rate doubles week-over-week | P2 digest | Annoying ≠ unsafe; review weekly |

### 6.5 Mandatory runbook artifacts (pre-Beta)

Create in `docs/projects/anipis/squad-16mai/15-runbooks/`:

1. `runbook-crisis-classifier-degraded.md` — symptoms, rollback prompt version, manual triage of last 24h conversations, contact clinical advisor.
2. `runbook-alert-contact-down.md` — failover SMTP, manual outreach to flagged users, CVV 188 fallback messaging in UI banner.
3. `runbook-openai-outage.md` — fallback to safer/simpler regex+rules classifier with bias toward over-triggering (FP > FN), banner to user.
4. `runbook-eval-set-update.md` — how to safely add cases, version, replay historical conversations.

### 6.6 Chaos engineering for safety (Rosenthal channeling)

Once per month post-Beta: deliberately introduce a synthetic ambiguous-crisis conversation in a staging shadow of prod traffic, verify classifier + alert + audit all fire correctly. Document. Fix. This is the *only* way you discover the unknown unknowns before a user finds them in pain.

---

## 7. Implementation Priority

### Week 1 (pre-Beta, must-have by 30/Mai)

- [ ] Pino structured logging on the 5 endpoints with the field set above
- [ ] Sentry Developer wired with `tracesSampleRate: 0.2`, full sample on `/crisis/*`
- [ ] Sentry tags: `endpoint`, `error_class`, `crisis_level`, `model`, `prompt_version`, `user_id_hash`
- [ ] Better Stack: 4 monitors (`/healthz`, `/chat/message` synthetic, `/crisis/alert-contact` synthetic-safe, `/auth/login`) — SMS to founder phone
- [ ] One Sentry alert: `/crisis/alert-contact` 5xx > 3 in 5 min → P0 SMS
- [ ] Nightly cron: crisis eval job + Better Stack heartbeat
- [ ] Daily 9 AM digest email (Pino logs → simple node script → Resend)
- [ ] Crisis safety dashboard page `/internal/safety-dashboard` showing: last 24h crisis events by level, eval recall trend, time-to-alert p95
- [ ] Three runbooks (6.5 #1-3)
- [ ] Pager discipline policy posted in CLAUDE.md / project README

### Week 2 (during Beta, soft launch hardening)

- [ ] Multi-window burn-rate alerting on the 7 SLOs (Section 3)
- [ ] Grafana Cloud Free dashboard pulling Loki logs from Pino + Postgres metrics
- [ ] Postgres USE nightly job (cache hit, deadlocks, connection pool)
- [ ] Daily 5-conversation human audit ritual (10 min, calendar block)
- [ ] OpenAI $ burn tracker → P1 at 80%, P0 at 95%
- [ ] Eval set growth to 300 cases (from real Beta conversations, anonymized)
- [ ] Status page (status.anipis.com.br) — even if 1 user, builds trust

### Post-Beta (Public-launch readiness, 8-12 weeks)

- [ ] OpenTelemetry SDK with Sentry's OTLP integration (Sentry v8+ is OTel-native — no double instrumentation)
- [ ] Sentry Team plan upgrade ($26/mo)
- [ ] Honeycomb Free evaluation; promote to Pro when event volume crosses ~10M/mo
- [ ] Eval set → 500+ cases, include adversarial subset
- [ ] First synthetic chaos drill on crisis path (Rosenthal)
- [ ] DORA quarterly review (deploy frequency, lead time, MTTR, change failure rate) — Forsgren scorecard
- [ ] Hire / contract part-time on-call buddy (you cannot solo a 99.5% crisis SLO indefinitely — Murphy is explicit: 1-person rotation is broken from day one. Treat as a fundraising-blocking risk, not an optimization.)

---

## 8. Sources

- [Honeycomb Pricing & Plans](https://www.honeycomb.io/pricing)
- [Honeycomb Pricing 2026 (Stackpick)](https://stackpick.net/pricing/honeycomb/)
- [Charity Majors — observability category on charity.wtf](https://charity.wtf/category/observability/)
- [Observability: present and future, with Charity Majors (Pragmatic Engineer)](https://newsletter.pragmaticengineer.com/p/observability-the-present-and-future)
- [Observability Engineering 2nd Edition — Majors/Fong-Jones/Miranda (O'Reilly)](https://www.oreilly.com/library/view/observability-engineering-2nd/9781098179915/)
- [Charity Majors — Rethinking Observability Budgets in 2026 (LinkedIn)](https://www.linkedin.com/posts/charity-majors_rethinking-observability-budgets-in-2026-activity-7404360971818950656-kIO8)
- [Google SRE Workbook — Chapter 5: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)
- [Google SRE Workbook — Implementing SLOs](https://sre.google/workbook/implementing-slos/)
- [Niall Murphy — The SRE Report 2026 (LinkedIn)](https://www.linkedin.com/posts/niallm_the-sre-report-2026-looking-at-reliabilitys-activity-7420156974329286656-Ri7i)
- [Niall Murphy — Books (relyabilit.ie)](https://relyabilit.ie/books)
- [The Four Golden Signals of Monitoring (Sysdig)](https://www.sysdig.com/blog/golden-signals-kubernetes)
- [The RED Method — Tom Wilkie / Grafana Labs](https://grafana.com/blog/the-red-method-how-to-instrument-your-services/)
- [USE, RED, and Four Golden Signals comparison (Reliability Whisperer)](https://reliabilitywhisperer.substack.com/p/understanding-system-health-a-look)
- [Monitoring SRE's Golden Signals — InfoQ](https://www.infoq.com/articles/monitoring-SRE-golden-signals/)
- [Sentry Pricing 2026](https://sentry.io/pricing/)
- [Sentry Pricing Breakdown (Last9)](https://last9.io/blog/sentry-pricing/)
- [Sentry — OpenTelemetry Support for Node.js](https://docs.sentry.io/platforms/javascript/guides/node/opentelemetry/)
- [Sentry — Using existing OpenTelemetry setup](https://docs.sentry.io/platforms/javascript/guides/node/opentelemetry/custom-setup/)
- [How to Send OpenTelemetry Trace Data to Sentry (OneUptime, 2026)](https://oneuptime.com/blog/post/2026-02-06-send-otel-trace-data-to-sentry-sdk-otlp/view)
- [Grafana Pricing — Free / Pro / Enterprise](https://grafana.com/pricing/)
- [Grafana Cloud Review 2026 (BuildPilot)](https://trybuildpilot.com/514-grafana-cloud-review-2026)
- [Axiom Pricing](https://axiom.co/pricing)
- [Better Stack — free tier details (UptimeRobot KB)](https://uptimerobot.com/knowledge-hub/comparisons-and-alternatives/15-better-stack-alternatives/)
- [Suicide- and crisis-risk detection using LLMs in mental-health chatbots (medRxiv 2026)](https://www.medrxiv.org/content/10.64898/2026.01.12.26343914.full.pdf)
- [CRADLE Bench — Clinician-Annotated Benchmark for Mental Health Crisis Detection (arXiv 2510.23845)](https://arxiv.org/pdf/2510.23845)
- [SteadyMind — Crisis Detection feature design](https://steadymindapp.com/crisis-detection.html)
- [Mental health apps for people in crisis: helpful or harmful? (National Elf Service)](https://www.nationalelfservice.net/mental-health/suicide/mental-health-apps-crisis/)
- [Solo Founder AI Stack in 2026 — Abhishek Chaudhary](https://abhishekchaudhary.com/blog/solo-founder-ai-saas-stack)
- [Build an SRE Observability Stack for Kubernetes Fast (Rootly)](https://rootly.com/sre/build-sre-observability-stack-kubernetes-fast-2c557)
- [Site Reliability Engineering — Murphy/Beyer/Jones/Petoff (O'Reilly)](https://www.amazon.com/Site-Reliability-Engineering-Production-Systems-ebook/dp/B01DCPXKZ6)

---

*End of deliverable. Total: under 600 lines. Opinionated by design.*
