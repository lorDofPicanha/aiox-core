# Incident Response & On-Call for a Solo Founder — Anipis (Mental Health SaaS)

> **Research deliverable** — squad-16mai / 16-saas-control-research
> **Scope:** One person (Breno). Production mental-health SaaS. 20 Beta → 100s post-Beta.
> **Date:** 2026-05-19
> **Channeled clones:** Charity Majors, Casey Rosenthal, Gene Kim, Jez Humble, John Allspaw, Will Larson, Brendan Gregg, Niall Murphy

---

## 1. Executive Summary

Anipis is operated by **one human who sleeps when humans sleep**. Two realities collide:

1. **Most incidents are nuisances** (chat UI bug, slow page). Paging Breno for these at 3am will cause alert fatigue, and a fatigued solo founder will start ignoring pages — which is how the *one* critical signal gets missed (Niall Murphy: noisy low-priority alerts cause serious alerts to be treated with less attention).
2. **A few incidents are life-critical** — specifically **crisis-escalation failure** (a Júlia in danger, Anipis fails to surface 188/CVV) and **harmful-response generation** (Anipis says something that endangers a user). These are not "wake up Breno," these are "the system must have already saved the user *before* Breno is awake."

**The central design principle for Anipis is therefore inverted from normal SaaS:**

> **The only thing allowed to wake Breno at 3am is something the system could not handle itself. For the life-critical path, the answer is that the system must NEVER depend on Breno being awake.** Safety must be enforced in-product (the 5 safety layers already built), not in on-call. On-call is for *learning and repair*, not for *catching* a crisis in real time.

This means the architecture is:

- **Layer 0 — In-product safety (synchronous, no human):** crisis detection, 188/CVV signposting, refusal guardrails. If these fail, that is a P0 *product defect*, not an on-call event. Breno hears about it the next morning via a digest UNLESS it is actively still firing for live users.
- **Layer 1 — Auto-remediation (no human):** restart, failover, graceful degrade. Handles ~70% of infra nuisances.
- **Layer 2 — Page Breno (human, rare):** only when (a) auto-remediation failed AND users are affected, or (b) a crisis-path failure is *ongoing and unmitigated*.
- **Layer 3 — Dead-man switch (no human → external escalation):** if Breno is incapacitated, the system must fail *safe* (Anipis goes into a conservative "safe mode," users get an honest holding message, clinical advisor + a backup contact get notified).

**Concrete picks for the solo budget (~$0–35/mo at Beta):**

| Need | Pick | Why | Cost |
|------|------|-----|------|
| Heartbeat / dead-man switch | **Healthchecks.io** | Purpose-built dead-man switch, 20 checks free | $0 |
| Uptime + status page + on-call escalation | **Better Stack** | All-in-one, free tier covers Beta | $0 → $29/mo |
| Error tracking | **Sentry** (already in stack per Sprint-1) | Already integrated, has alert rules | existing |
| Page channel | **Phone call + SMS** (Better Stack paid) | Only call/SMS reliably wakes a sleeping human | inc. in $29 |
| Status page (public) | **Better Stack hosted status page** | Free tier includes 1 page | $0 |

**Bottom line:** spend the engineering effort on Layer 0 + Layer 1 + Layer 3 (so Breno is almost never paged), and keep Layer 2 (the page) ruthlessly narrow. A solo founder cannot run a rotation; he can only run a *machine that mostly doesn't need him*.

---

## 2. Severity Matrix for Anipis

The matrix is driven by **two axes**: (a) is a user's *safety* at risk, and (b) how many users are affected. Mental-health context promotes any safety risk to the top regardless of user count.

| Sev | Name | Wake Breno? | Definition | Concrete Anipis examples |
|-----|------|-------------|------------|--------------------------|
| **P0** | **Life-Critical / Safety** | **YES, 3am, phone call** | A user's physical safety may be at risk AND the system is not handling it. Crisis path broken for live users, or harmful output actively being generated. | • Crisis-detection layer is throwing exceptions → users in crisis get normal chat, no 188/CVV.<br>• A Júlia reports "Anipis told me to harm myself" (see §9).<br>• Crisis-deletion-guard / safety guardrail disabled in prod.<br>• PII of all users exposed publicly. |
| **P1** | **Major Outage** | **YES, but only after auto-remediation fails** (call after 10 min unresolved) | Core product unusable for *many/all* users; no safety risk because the app is *down* (failing safe = no harmful output possible). | • All 20 users cannot log in (Supabase auth down).<br>• Chat completely down (OpenAI hard-down AND fallback failed).<br>• App returns 500 to everyone.<br>• Data-loss event in progress. |
| **P2** | **Degraded** | **No — morning** (push/email, digest) | Partial degradation, workaround exists, single feature broken, or single-user-impacting safety-adjacent. | • Chat slow (LLM latency high) but working.<br>• One non-crisis feature broken (journal export fails).<br>• Single user reports a *bad-but-not-dangerous* chat experience (e.g. tone-deaf, repetitive).<br>• Vendor degraded but failover holding. |
| **P3** | **Nuisance** | **No — backlog** (logged, no notification) | Cosmetic, no functional/safety impact. | • Button misaligned on mobile.<br>• Typo in UI.<br>• Minor formatting in a non-crisis screen.<br>• Slow non-critical admin page. |

**Decision shortcuts (the questions Breno asks in 10 seconds):**

1. *Could a user be physically harmed because of this, right now?* → **P0**.
2. *Is the product unusable for many users right now?* → **P1**.
3. *Is there a workaround / is it one user / is it slow-not-broken?* → **P2**.
4. *Is anyone actually affected?* No → **P3**.

> **Will Larson principle (small-team ops):** keep the count of things that can page you tiny and high-signal. Every P0/P1 alert should map to a runbook. If it doesn't have a runbook, it shouldn't page.

> **Mental-health override:** single-user impact is normally P2 — *except* when safety is involved. "Julia #7 had a bad chat experience" is P2. "Julia #7 says Anipis encouraged self-harm" is **P0** (one user, but life-critical). Blast radius does not de-escalate a safety incident.

---

## 3. Alert Routing Decision Tree

**Channel reliability/latency for waking a solo founder (ranked):**

| Channel | Wakes you asleep? | Latency | Reliability | Fatigue risk | Use for |
|---------|-------------------|---------|-------------|--------------|---------|
| **Phone call (auto-dial, repeat)** | **Yes** | seconds | High (bypasses DND with critical-alert apps) | Very high — reserve for P0/P1 only | P0, P1 unresolved |
| **SMS** | Sometimes (DND) | seconds | High | High | P0/P1 backup |
| **Push (Better Stack / PagerDuty app w/ "critical alert" entitlement)** | Yes (overrides silent) | seconds | High | Medium | P0/P1 primary |
| **WhatsApp** | No (silenced at night by most) | seconds | Medium | Medium | P0 *confirmation/context*, not the wake-up |
| **Slack** | No | minutes | Medium | Low | P2 digest, audit trail |
| **Email** | No | minutes | High | Low | P2/P3, postmortem, daily digest |

> **Charity Majors:** alerts must be *actionable* and tied to user-facing symptoms, not internal metrics. Don't page on "CPU 80%"; page on "users can't send a message." Everything else goes to a dashboard you look at when you choose to.

> **Niall Murphy:** target ≤ 2–3 actionable pages per *week* for a solo operator — anything more is an alerting problem, not an incident problem. Audit every alert quarterly: "did this fire and was it acted on in 90 days?" If no, delete it or downgrade to a non-paging channel.

### Routing tree

```
ALERT FIRES
│
├─ Is it a SAFETY signal? (crisis-path error, harmful-output flag, guardrail off)
│     └─ YES → P0
│           ├─ 1. Auto-action FIRST: force product into SAFE MODE for affected path
│           │     (serve hard-coded crisis card w/ 188 + CVV 188; disable free-gen on that path)
│           ├─ 2. Phone call Breno (auto-dial, retry 3x at 1-min intervals)
│           ├─ 3. If no ACK in 10 min → call clinical advisor (CRP) as backup
│           └─ 4. Post full context to WhatsApp + Slack #incidents
│
├─ Is the product DOWN / broken for MANY users?
│     └─ YES → P1
│           ├─ 1. Auto-remediation runs (restart / failover) — see §5
│           ├─ 2. If recovered < 5 min → log only, morning digest (NO page)
│           ├─ 3. If NOT recovered in 5 min → push notification
│           ├─ 4. If no ACK in 10 min → phone call
│           └─ 5. Auto-publish status page incident ("We're investigating...")
│
├─ Is it DEGRADED / single-feature / single-user (non-safety)?
│     └─ YES → P2
│           └─ Slack #incidents + add to morning digest. NO night page.
│
└─ Cosmetic / no impact → P3
      └─ Log to backlog. No notification.
```

**Practical setup:** Better Stack (or Sentry alert rules) routes by severity tag. P0/P1 → "Call + Push" escalation policy. P2 → Slack webhook. P3 → silent log. Use an iOS **Critical Alert** / Android **Alarm-category** channel so P0 pierces Do-Not-Disturb — this is the single most important config for a solo founder.

---

## 4. Status Page Recommendation + Tooling Pick

### Should Anipis have a *public* status page?

**At Beta (20 hand-picked users): NO public page.** A blank/green public status page for 20 users is overhead and, worse, a public status page that says "DEGRADED" can itself be distressing for a mental-health audience. Instead, use an **in-app banner** + the user-comms templates (§8) for the rare outage. Keep a *private* internal status/incident log (Better Stack incidents) for Breno's own tracking.

**Post-Beta (100s of users): YES, but framed gently.** A status page becomes a trust signal and deflects "is it just me?" support load. For a mental-health product, the page must be **calm, plain-language, and never alarmist** — no red sirens, no scary jargon, always pointing distressed users to crisis resources regardless of system state.

### Tooling comparison

| Tool | Free tier | Status page cost | Bundles | Verdict for Anipis |
|------|-----------|------------------|---------|--------------------|
| **Better Stack** | $0: 10 monitors, 10 heartbeats, **1 status page**, Slack/email alerts | extra pages $12–15/mo | Uptime + heartbeat + on-call escalation + status page + (Sentry-style) error tracking in one | **PICK.** One tool covers uptime, dead-man heartbeat, on-call call/SMS escalation, AND status page. Paid $29/mo unlocks phone/SMS + on-call escalations when post-Beta. |
| **Cloudflare (Pages-hosted custom page)** | Free hosting | DIY (you build it) | Just hosting; no monitoring integration | Cheapest but **manual** — you'd hand-update it during an incident, which a solo founder won't do reliably mid-crisis. Only if already all-in on Cloudflare and willing to wire a webhook. |
| **StatusKit / Instatus / Hyperping** | Free/low tiers exist | $0–20/mo | Status page focused; monitoring varies | Fine as standalone status pages, but you'd run a *second* tool for heartbeat/on-call. Consolidate instead. |

> **Recommendation:** **Better Stack free tier for all of Beta** (uptime + 1 status page kept private/unlinked + heartbeats). Upgrade to the **$29/mo** plan at public launch to get **phone/SMS paging + on-call escalation policies**. Keep **Healthchecks.io ($0)** in parallel purely as the independent dead-man switch (§6) — you want your "is the founder/app alive" watchdog on a *different vendor* than the thing it's watching.

---

## 5. Runbook Automation — Top 10 Incidents + Automated First-Response

> **Casey Rosenthal / Gene Kim principle:** automate the *reversible, well-understood* actions. For everything ambiguous, automate **data-gathering only** and escalate. Never auto-execute an irreversible action. In a mental-health product, **the safe default for any uncertain failure is to fail toward "no AI output," not "best-effort AI output."**

For each incident: **Detect → Auto-action (first response) → Escalate-if.**

| # | Incident | Sev | Detect | Auto first-response | Escalate if |
|---|----------|-----|--------|---------------------|-------------|
| 1 | **App process down / crash-loop** | P1 | Health endpoint fails 2x | Auto-restart (platform: Railway restart policy). Capture last 200 log lines + last deploy SHA. | Still down after 2 restarts in 5 min → page. |
| 2 | **OpenAI / LLM provider down** | P1→P2 | API 5xx/timeout rate > threshold | **Fail over to backup model**; if no backup, **degrade gracefully**: chat shows "Anipis is taking a quiet moment, back shortly" + keep crisis card available. | Both primary + fallback down > 5 min → page P1. |
| 3 | **Crisis-detection layer throwing errors** | **P0** | Exception in crisis classifier / guardrail | **SAFE MODE on that path immediately**: any message routes through hard-coded crisis-aware fallback that always offers 188 + CVV and avoids free generation. | Always page P0 (this is the life-critical path). |
| 4 | **Harmful output flagged** (post-gen safety check trips) | **P0** | Output-filter / red-flag classifier fires | Block the message from delivery; serve safe template; snapshot full conversation (immutable) for investigation. | Always page P0. |
| 5 | **Supabase / DB unreachable** | P1 | Connection errors spike | Retry w/ backoff; flip app to read-only / "we're saving your data shortly" banner; **do NOT lose user messages** (queue locally). | Unreachable > 3 min → page; check Supabase status (vendor) automatically. |
| 6 | **Auth / login broken (all users)** | P1 | Login success rate → 0 | Capture auth-provider status; auto-post status incident. | No self-recovery in 5 min → page. |
| 7 | **Deploy broke prod** | P1 | Error rate spikes right after deploy | **Auto-rollback to previous known-good deploy** (Jez Humble: deploys must be reversible; rollback is the first remediation). | Rollback fails or error persists → page. |
| 8 | **Latency spike (chat slow)** | P2 | p95 latency > 2× baseline | Log + dashboard; show subtle "thinking..." UX; no page. | Sustained > 30 min or tips into timeouts (→ reclass P1). |
| 9 | **Rate-limit / quota hit (OpenAI/Supabase)** | P2→P1 | 429s | Throttle non-critical calls first; preserve crisis-path quota (reserve a budget for safety calls). | Crisis path itself rate-limited → P0. |
| 10 | **Disk / queue / cron stalled** (e.g. consent-saga, deletion-saga) | P2 | Healthchecks.io missed check-in | Alert; auto-retry the job once. | Deletion/consent saga (Art.18 compliance) stalled > 1h → page P1 (regulatory). |

**Implementation reality for solo founder:** start by automating **data-gathering** for all 10 (a single script/webhook that, on alert, posts to Slack: last deploy SHA, error count, affected user count, relevant vendor status). Then add auto-restart (#1), graceful-degrade (#2), safe-mode (#3,#4), and auto-rollback (#7) — these four give the biggest "Breno stays asleep" return. The rest stay human-in-the-loop.

---

## 6. Dead-Man Switch Design (Founder Offline 24h+)

**The core risk:** Breno is sick / asleep / unreachable, an incident occurs, and there is no second human. The system must **fail safe**, notify a backup, and protect users — *especially* the crisis path.

### Two independent dead-man switches

**A. Application heartbeat (is the app alive?)**
- App pings **Healthchecks.io** every 1 min. Miss → Healthchecks alerts. This is a separate vendor from the app's own monitor, so a total app/infra failure can't also silence its own watchdog (the classic dead-man-switch failure mode).
- Critically, also heartbeat the **crisis path specifically**: a synthetic transaction every 5 min sends a known crisis phrase to a test sandbox and asserts the response contains 188/CVV signposting. If that heartbeat misses or the assertion fails → **P0**, even if the rest of the app is "green."

**B. Founder liveness (is Breno responding to incidents?)**
- This is the human dead-man switch. Design:
  1. When a P0/P1 fires, Breno must **ACK within 10 min**.
  2. **No ACK → escalate to a pre-arranged backup contact.** For Anipis the natural backup is the **clinical advisor (CRP)** for *safety* incidents and a **trusted technical friend** for *infra* incidents (Breno should recruit one before Beta — even just "if you get this text, the app is in trouble and I'm unreachable, here's the runbook link").
  3. **No human ACK at all → the system auto-degrades to SAFE MODE**: Anipis stops generating free-form responses and serves only the safe, hard-coded supportive + crisis-signposting flow. Users see an honest banner (see §8 template). The product *fails toward safety*, not toward "keep guessing."

### What fails safe vs catastrophically (if Breno is gone 24–48h)

| Component | Without intervention | Design to make it fail SAFE |
|-----------|----------------------|------------------------------|
| Chat (LLM free-gen) | Could produce harmful output unsupervised | Auto SAFE MODE after N hours of no founder ACK on any open P0/P1; cap to safe templates. |
| Crisis path | **CATASTROPHIC if it silently breaks** | Synthetic 5-min heartbeat + always-available hard-coded crisis card that needs no LLM. |
| Auth/infra | Degrades, users locked out (annoying, not dangerous) | Auto-restart + status banner; acceptable to wait for Breno. |
| Compliance sagas (Art.18 deletion) | Regulatory clock keeps running | Jobs are idempotent + resumable; missed check-in alerts backup contact; deletion deadline tracked. |
| Billing / non-safety | Degrades quietly | Acceptable; backlog. |

> **The single non-negotiable:** the crisis-support response **must not depend on the LLM, on Breno, or on any single vendor.** It is a static, always-available card (188 — CVV; emergency 192/190) that the app can serve even in total degraded mode. Build it as the literal fallback of every code path.

---

## 7. The 5-Minute Alert Payload Template

> **Brendan Gregg / Charity Majors:** the on-call human is debugging in their pajamas. The alert must answer *what / how-bad / what-now* before they open a laptop. Pre-compute everything.

```
🔴 [P0 — SAFETY]  Crisis path returning errors
─────────────────────────────────────────────
WHAT BROKE:   crisis-classifier throwing 500 on /chat
SINCE:        03:14 (4 min ago)
BLAST RADIUS: 3 of 18 active users hit the crisis path
              in last 10 min — 1 currently in session
AUTO-ACTION:  ✅ SAFE MODE engaged on /chat at 03:15
              (users now get hard-coded 188/CVV card)
SAFETY STATUS: ✅ No user currently without crisis card
LIKELY CAUSE: deploy a1b2c3d (03:02) — classifier model swap
FIRST STEP:   roll back: `railway rollback a1b2c3d`  [runbook ↗]
              then verify synthetic crisis heartbeat green
LINKS:        Logs ↗ | Conversation snapshots ↗ | Status page ↗
ACK:          reply ACK or auto-escalates to CRP advisor in 6 min
```

**Required fields (the 5-minute contract):**
1. **Severity + one-line WHAT** (in the title).
2. **SINCE** (how long, drives urgency).
3. **BLAST RADIUS** — *how many users, and are any in a live/crisis session right now.* For Anipis this is the most important line.
4. **AUTO-ACTION already taken** + current **SAFETY STATUS** (so Breno knows if a user is unprotected this second).
5. **LIKELY CAUSE** (recent deploy SHA is the #1 cause).
6. **FIRST STEP** — the single command/link to start with.
7. **LINKS** — logs, snapshots, status.
8. **ACK / escalation timer.**

If the alert can't be enriched to this, it isn't ready to page — downgrade it.

---

## 8. User Communication Playbook (Mental-Health Tone)

**Tone rules for a mental-health audience (override normal SaaS tone):**
- **Never alarmist, never jokey.** No "Oops! 🙈" or "Houston, we have a problem."
- **Calm, honest, brief, warm.** Acknowledge, reassure about their data/safety, set an expectation, and **always restate that crisis help is available regardless of the app.**
- **Never blame the user. Never imply their data is lost** unless certain.
- Crisis resources (188 / CVV) appear in *every* incident message, because the population includes people who may be in distress *during* your outage.

### Templates by severity

**P1 — Major outage (in-app banner + status page):**
> "Anipis is having a technical problem right now and some features may not work. Your information is safe and we're fixing it. If you need support right now, you can reach **CVV at 188** (free, 24h) or call **192/190** in an emergency. We'll be back shortly. 💙"

**P1 — extended outage (push/email after ~30 min):**
> "We're still working on a technical issue with Anipis. We're sorry for the interruption. Your data is safe. If you need to talk to someone now, **CVV: 188** is available 24h. We'll let you know the moment we're back."

**Resolved:**
> "Anipis is back to normal. Thank you for your patience — and for being here. If anything still feels off, just send us a message. 💙"

**P0 — harmful response to a specific user (manual, see §9):** Do **not** use a template blindly. A human (Breno or the clinical advisor) writes the response. The holding acknowledgment may be auto-sent within minutes:
> "Thank you for telling us — this is important and we're taking it seriously right now. You deserve safe support. If you're in distress at this moment, please reach **CVV at 188** (24h) or **192** for emergencies. A person from our team will follow up with you directly very soon."

**Auto vs manual:**
- **Auto-send:** P1 in-app banner + status update (template-safe, time-sensitive, generic).
- **Manual (human writes):** anything addressed to a *specific distressed individual*, and any P0 safety incident communication. The risk of an auto-message landing wrong on a vulnerable user is too high.

---

## 9. Crisis-Specific Incident Response — "Anipis told me to kill myself"

This is the defining incident for Anipis. Treat it as a **P0 with a fixed protocol**. Speed on *user safety*, care on *everything else*.

### Phase 0 — Immediate (minutes), in priority order
1. **Protect the reporting user first.** Send the holding acknowledgment (§8) with 188/CVV/192. If there is any signal of imminent risk, the clinical advisor is looped in *immediately* to guide direct outreach.
2. **Contain the defect.** Engage **SAFE MODE** on the chat path (disable free-gen, serve safe templates) until investigated — even if it turns out to be a one-off, you stop a possible repeat for *other* users in the window.
3. **Preserve evidence (immutable).** Snapshot the full conversation, model version, prompt, safety-layer logs, timestamps. Do **not** delete or edit (regulatory + learning + the user may have deletion rights — preserve under legal-hold rules, see compliance Art.18 nuance).

### Phase 1 — Investigation (hours)
4. Reconstruct exactly what was shown to the user and *why each safety layer (1–5) failed to catch it.* Was it the classifier? An adversarial/indirect phrasing the detector missed (the literature notes LLMs fail on indirect/metaphorical risk)? A prompt regression from a deploy?
5. Determine **blast radius**: query for other users who hit the same path/model version in the window. Each potentially-exposed user is part of the incident.

### Phase 2 — Communication
6. **To the user:** human-written follow-up (Breno or clinical advisor), warm, accountable, with concrete resources and an offer to talk. No legalese, no deflection.
7. **To other affected users (if any):** clinical advisor decides whether/how to reach out — over-messaging vulnerable users can itself cause harm.
8. **Internal:** full incident record.

### Phase 3 — Regulatory / governance
9. **Clinical advisor sign-off** required before the incident is considered handled.
10. **Regulatory notification assessment:** under LGPD/ANPD, assess whether this constitutes an incident requiring notification (harm to data subjects / sensitive health data). The compliance squad's existing Art.18 + SCC workstream defines thresholds; for a *safety* incident, document the assessment even if no notification is legally required. If there is plausible serious risk to a user, err toward notifying the DPO and documenting the decision trail.
11. **Public response:** at Beta, **no public statement** unless legally required — handle privately and individually. Post-launch, prepare a *holding* statement only if the incident becomes public; never minimize, never over-promise, route to crisis resources.

### Phase 4 — Learning
12. Blameless postmortem (§10) is **mandatory** for every P0 safety incident, with the clinical advisor as a reviewer.

> **John Allspaw:** the goal is to understand *how it made sense* for the system to fail this way — which safety assumption was wrong — not to find a culprit. For a solo founder this is doubly true: blaming yourself produces shame, not fixes.

---

## 10. Postmortem Template + Cadence

> **Gene Kim / John Allspaw:** blameless, learning-focused, lightweight. For a solo founder, ceremony is the enemy — but skipping the *learning* is how the same incident recurs. Keep it to a 20-minute write-up.

### Cadence
- **P0:** postmortem **mandatory**, within 48h. Safety P0s reviewed with clinical advisor.
- **P1:** postmortem mandatory, within 1 week (can be 10 lines).
- **P2/P3:** no postmortem; just a backlog note. Optionally a **monthly meta-review** (Charity Majors): skim the month's P2/P3s for a recurring pattern worth fixing.

### Template (`docs/postmortems/YYYY-MM-DD-slug.md`)

```markdown
# Postmortem — <title>
**Date:** <incident date>   **Severity:** P0/P1   **Author:** Breno
**Status:** draft / reviewed   **Clinical advisor review:** yes/no/n-a

## Summary (2–3 sentences)
What happened, who/how many affected, was anyone's safety at risk.

## Impact
- Users affected: <n> of <total>
- Duration: <start>–<resolved>
- Safety impact: <none / potential / confirmed>
- Data/regulatory impact: <none / assessed — see notes>

## Timeline (UTC/BRT)
- HH:MM  <event / signal>
- HH:MM  alert fired
- HH:MM  auto-action X
- HH:MM  founder ACK
- HH:MM  resolved

## Root cause (the honest "how it made sense")
Which assumption/safety layer failed and why it wasn't caught earlier.

## What went well
(e.g. SAFE MODE engaged automatically; crisis card stayed available.)

## What we'll change (actionable, owned, dated)
- [ ] <fix> — by <date>
- [ ] <detection improvement> — by <date>
- [ ] <runbook/automation gap closed> — by <date>

## Was a human needed who wasn't there?
(Did this expose a dead-man-switch / backup-contact gap?)
```

The last question is the solo-founder-specific one: every incident is also a test of "what happens when I'm not here."

---

## 11. Implementation Plan (D-11 → D-0 + Post-Beta)

Beta launch target is **30/Mai** (slip-safe **7/Jun**). Counting from ~19/Mai, "D-0" = launch.

| When | Task | Owner | Output |
|------|------|-------|--------|
| **D-11 (now)** | Stand up Better Stack free + Healthchecks.io free. Add app heartbeat (1-min) + crisis-path synthetic heartbeat (5-min, asserts 188/CVV). | Breno/dev | Two independent dead-man switches live. |
| **D-10** | Configure severity tags in Sentry + Better Stack. Map P0/P1 → Call+Push escalation; P2 → Slack; P3 → silent. Enable iOS Critical-Alert / Android alarm channel. | Breno | Routing tree (§3) implemented. |
| **D-9** | Implement **SAFE MODE** toggle on chat path (auto + manual). Hard-code the always-available crisis card as the fallback of every chat code path. | dev | Layer-0 safety enforced in product, not on-call. |
| **D-8** | Auto-remediation: app auto-restart policy (#1), LLM graceful-degrade + fallback (#2), auto-rollback on post-deploy error spike (#7). | dev | Top infra incidents self-heal. |
| **D-7** | Write the 6 runbooks for P0/P1 incidents (#1–7). One markdown file each, linked from alert payloads. | Breno | `docs/runbooks/` (note: squad has `15-runbooks/`). |
| **D-6** | Build the alert-enrichment webhook (assembles §7 payload: deploy SHA, error count, affected-user count, vendor status, runbook link). | dev | 5-minute payload auto-generated. |
| **D-5** | Recruit + brief **2 backup contacts**: clinical advisor (CRP) for safety, a trusted technical friend for infra. Give them the escalation runbook + what an ACK means. | Breno | Human dead-man switch wired. |
| **D-4** | Founder-liveness escalation: no-ACK-in-10-min → backup contact; no-human-ACK → auto SAFE MODE. | dev | Layer-3 complete. |
| **D-3** | Vendor-outage detection: auto-check Supabase/OpenAI status on relevant alerts; pre-emptive failover thresholds. | dev | Vendor incidents detected without waiting on vendor. |
| **D-2** | **Game day (Casey Rosenthal):** deliberately break things in staging — kill the app, simulate OpenAI down, trip the crisis-classifier, simulate "Breno doesn't ACK." Verify each fails safe + the right channel fires. Fix gaps. | Breno | Validated, not just configured. |
| **D-1** | Load user-comms templates (§8) into the app banner system + status page. Dry-run a P1 banner. Finalize crisis-incident protocol (§9) one-pager, advisor-approved. | Breno | Comms ready. |
| **D-0** | Launch. Status page kept **private/unlinked** (in-app banner only for 20 users). Watch dashboards day 1. | Breno | Live. |
| **Post-Beta** | Upgrade Better Stack to $29/mo (phone/SMS + on-call escalations). Make status page **public** (calm framing). Quarterly **alert audit** (delete/downgrade anything that didn't fire-and-act in 90 days). Monthly meta-review of P2/P3 patterns. | Breno | Sustainable at 100s of users. |

**Effort guard:** if time is short before 30/Mai, the **minimum viable safety set** is D-11 (heartbeats incl. crisis synthetic), D-9 (SAFE MODE + hard-coded crisis card), and D-5 (backup contacts). Those three mean that even with zero other tooling, the life-critical path can't silently fail and Breno isn't the single point of failure. Everything else can land during Beta.

---

## 12. Sources

- [On-call best practices: handoffs, schedules, alert fatigue — incident.io](https://incident.io/blog/on-call-best-practices-guide-2026)
- [Runbook automation tools 2026 — incident.io](https://incident.io/blog/runbook-automation-tools-2026-the-complete-guide)
- [What Are Agentic Runbooks? Automated Remediation — Cast AI](https://cast.ai/blog/agentic-runbooks/)
- [Understanding Incident Auto-remediation — Callgoose](https://resources.callgoose.com/blog/understanding-incident-auto-remediation--process-automation-or-runbook-automation-)
- [Google SRE — Being On-Call](https://sre.google/sre-book/being-on-call/)
- [Google SRE Workbook — On-Call](https://sre.google/workbook/on-call/)
- [Sleep, Interrupted: Niall Richard Murphy on Taking the Emergency Out of On-Call](https://www.linkedin.com/pulse/sleep-interrupted-niall-richard-murphy-taking-emergency-jaime-woo)
- [Alert Fatigue: How to Reduce Noise — Rootly](https://rootly.com/on-call-software/alert-fatigue)
- [Charity Majors on Observability and Operational Ramifications — InfoQ](https://www.infoq.com/articles/charity-majors-observability-failure/)
- [Incident Review: Meta-Review (Charity Majors) — Honeycomb](https://www.honeycomb.io/blog/incident-review-meta-review-august-2020)
- [Blameless Postmortems (John Allspaw) summary — Shaun Abram](https://www.shaunabram.com/blameless-postmortems-post-by-john-allspaw/)
- [The Blameless Postmortem — PagerDuty](https://postmortems.pagerduty.com/culture/blameless/)
- [Postmortems Handbook — Atlassian](https://www.atlassian.com/incident-management/handbook/postmortems)
- [P0–P4 Priority Levels Explained — Fibery](https://fibery.com/blog/product-management/p0-p1-p2-p3-p4/)
- [P0–P4 Incident Priority & Severity Levels — Runframe](https://runframe.io/learn/incident-priority)
- [Incident Priority Matrix — FireHydrant](https://firehydrant.com/blog/incident-priority-matrix/)
- [Healthchecks.io — Pricing](https://healthchecks.io/pricing/)
- [Healthchecks.io — Documentation (dead-man switch)](https://healthchecks.io/docs/)
- [Dead Man's Switch style monitoring with healthchecks.io — Snehangshu](https://blogs.snehangshu.dev/dead-mans-switch-style-application-monitoring-with-healthchecksio)
- [Securing Your Monitoring Stack with a Dead Man Switch — Saifeddine Rajhi](https://seifrajhi.github.io/blog/securing-monitoring-stack-dead-man-switch/)
- [Better Stack — Pricing](https://betterstack.com/pricing)
- [Top 5 Statuspage Alternatives (2026 Guide) — Hyperping](https://hyperping.com/blog/best-statuspage-alternatives)
- [Best Status Page Software in 2026 — Hyperping](https://hyperping.com/blog/best-status-page-software)
- [Between Help and Harm: Evaluation of Mental Health Crisis Handling by LLMs — arXiv 2509.24857](https://arxiv.org/html/2509.24857v2)
- [Evaluating the Clinical Safety of LLMs in Response to High-Risk Mental Health Disclosures — arXiv 2509.08839](https://arxiv.org/pdf/2509.08839)
- [APA Health Advisory: Use of generative AI chatbots and wellness applications for mental health](https://www.apa.org/topics/artificial-intelligence-machine-learning/health-advisory-chatbots-wellness-apps)
- [Public Health Risk Management & Ethical Imperatives in AI Mental Health Therapy — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12609870/)
- [10 Incident Response Best Practices for 2026 — TaskCall](https://taskcallapp.com/blog/incident-response-best-practices)

---
*Channeled: Charity Majors (actionable, symptom-based alerts; meta-review) · Casey Rosenthal (game days, chaos readiness) · Gene Kim (blameless, automate the reversible) · Jez Humble (reversible deploys, rollback-first) · John Allspaw (how-it-made-sense postmortems) · Will Larson (tiny high-signal alert surface for small teams) · Brendan Gregg (debugging-under-pressure payloads) · Niall Murphy (alert auditing, ward-not-emergency on-call).*
