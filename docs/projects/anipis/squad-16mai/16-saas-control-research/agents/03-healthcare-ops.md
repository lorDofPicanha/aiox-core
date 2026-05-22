# 03 — Healthcare Ops & Compliance Monitoring for Anipis

> **Squad Research Agent #03 — SaaS Control Plane (mental-health adjacency)**
> Author: AIOS Squad / channeling Alison Darcy, Acacia Parks, Patricia Peck, Lucia Savage, Bruce Schneier, Halle Tecco, Eric Topol, Kate Ryder, Christian Dunker
> Client: **Anipis** — Closed Beta D-11 (30/Mai/2026), 20 pre-selected users (Júlias), App PWA-only, AI-companion (NOT SaMD), Brazilian jurisdiction
> Status: **Pre-Beta lock** — gates listed in §10 must be green before D-0

---

## 1. Executive Summary

Anipis sits in the **most operationally-demanding tier of consumer SaaS that is not a regulated medical device**: it talks to humans about their suffering, with no clinician in the loop, in a jurisdiction (Brazil) that is hardening simultaneously on three axes — **LGPD/ANPD enforcement** (Res. 15/2024 incidents, Res. 19/2024 international transfers), **CFM Res. 2.454/2026** (AI-in-medicine governance, 180-day grace period ending Aug/2026), and **civil liability case-law** (Tessa/Replika/Character.AI lawsuits are now being cited as foreseeable risk).

The differentiator from "regular SaaS ops" is not technical — it is the **lives-at-stake reframe**: every operational signal must answer the question *"could this signal predict, prevent, or forensically reconstruct a self-harm event?"* before it is allowed into the dashboard. The seven SLOs in §2 are the floor, not the ceiling.

**Three load-bearing decisions for the Beta:**

1. **Crisis classifier is the product** — if it drifts, everything else is liability theatre. Instrument FN/FP independently, with weekly clinician adjudication, *before* D-0.
2. **Clinical advisor (CRP) needs a written SOP with an SLA, not a goodwill agreement** — currently undefined for Anipis. Without it, there is no defensible answer to "who reviewed this?" in a postmortem.
3. **Forensic preservation is a launch blocker, not a roadmap item** — the `audit_events` hash chain is necessary but insufficient. Missing fields (model version, prompt hash, classifier score, banner-shown-ack, follow-up state) must ship in D-0.

**Recommendation:** ship Beta with the §10 D-11→D-0 list (12 P0 items). Slip to 07/Jun if any P0 in §10 is yellow. Do **not** ship if §10 items #1, #3, #7, #11 are red — those are the four irreversible-harm vectors.

---

## 2. The 7 Operational SLOs That Regular SaaS Does Not Have

Regular SaaS SLOs measure availability and latency on the assumption that a missed signal is recoverable (retry, refund, apology). **Mental-health SLOs measure the lives-at-stake delta** — a missed signal can be irreversible. The recent medRxiv work on LLM crisis detection (2026) reframes this as "online safety monitoring, not accuracy prediction" — meaning the SLO must continuously balance FN and FP, not optimize one.

| # | SLO | Definition | Target (Beta) | Target (GA) | Why it doesn't exist in SaaS |
|---|-----|------------|--------------|-------------|------------------------------|
| **1** | **Crisis-classifier latency (RED)** | Time from user message ingest → RED classification → banner rendered → CVV 188/SAMU 192 numbers visible | p95 ≤ 2.5s, p99 ≤ 4.0s | p95 ≤ 1.5s | A delayed alert is operationally equivalent to no alert. SaaS uptime SLOs measure the wrong thing here. |
| **2** | **False-negative rate (FN) on RED** | % of clinician-adjudicated RED messages that classifier marked GREEN/YELLOW/ORANGE | ≤ 2% (rolling 14d) | ≤ 0.5% | SaaS has no concept of a "missed message that killed someone." This is the single most important number on the dashboard. |
| **3** | **False-positive rate (FP) on RED** | % of RED-flagged messages that clinician judges as NOT crisis | 5–15% acceptable | 5–10% | Too low FP means classifier is under-sensitive. Too high erodes trust and trains users to dismiss the banner. **Both directions are drift.** |
| **4** | **Emergency-contact delivery success** | % of contact-dispatch attempts on RED that successfully delivered (per-event dedup respected, daily cap not hit) | ≥ 99.5% | ≥ 99.9% | A retry queue with eventual consistency is acceptable for invoices. Not for "please check on my friend." |
| **5** | **Banner-acknowledgment rate** | % of RED events where user explicitly acknowledged CVV 188 / SAMU 192 banner (tap or scroll-past with dwell ≥ 3s) | Track only; target TBD post-Beta | ≥ 70% | Pure SaaS doesn't care if users read disclaimers. Here it is forensic evidence of "informed routing." |
| **6** | **Time-to-clinical-review for RED** | Time from RED event → clinical advisor (CRP) sees event in dashboard → review logged | ≤ 24h business, ≤ 48h calendar | ≤ 4h business | SaaS has on-call rotations for infra. This is on-call for *adjudication*. New muscle. |
| **7** | **Audit-chain integrity** | % of hours where `audit_events` hash chain verified contiguous (no missing/tampered links) | 100% (any gap = P0 incident) | 100% | SaaS treats audit logs as nice-to-have for SOC2. Here they are the **chain-of-custody artifact** that determines whether you can defend yourself in a wrongful-death claim. |

**Notes on operationalization:**

- **SLO #2 and #3 are coupled.** Track them together on a single chart. A sudden FN drop with FP unchanged is suspicious (gaming), not a win. *Acacia Parks (Happify)*: "the day your safety metric looks too clean is the day it broke."
- **SLO #6 requires the clinical advisor SOP (see §4) to exist first.** Without an SOP, the SLO is a fiction.
- **SLO #7 is a launch blocker.** A single gap in the hash chain during Beta = ANPD-reportable integrity failure (Res. 15/2024 Art. 6 if it touches personal data, which it does).

---

## 3. Crisis Protocol Monitoring — Concrete Instrumentation Plan

Every RED event must emit a structured `crisis_event_envelope` with the following timestamps and fields. This is what gets preserved for 5 years; it is what a forensic examiner reconstructs from.

### 3.1 Required timestamps (monotonic, server-side, UTC + offset for São Paulo)

| Timestamp | Source | Notes |
|-----------|--------|-------|
| `t0_message_received_at` | API gateway | First byte of user message |
| `t1_classifier_invoked_at` | Classifier service | Includes model + prompt version hashes |
| `t2_classification_resolved_at` | Classifier service | Includes score, level, confidence band |
| `t3_response_dispatched_at` | Companion LLM | If LLM response was generated |
| `t4_banner_rendered_at` | Client telemetry | PWA service-worker beacon — accept up to 30s clock skew |
| `t5_banner_acknowledged_at` | Client telemetry | Tap OR dwell ≥ 3s (record which) |
| `t6_contact_dispatch_initiated_at` | Notification service | If user has configured emergency contact |
| `t7_contact_dispatch_delivered_at` | Notification provider webhook | Delivery receipt (WhatsApp/SMS/email) |
| `t8_follow_up_scheduled_at` | Scheduler | Next-day check-in queued |
| `t9_follow_up_completed_at` | Scheduler | User responded to check-in |
| `t10_clinical_advisor_reviewed_at` | Advisor dashboard | Manual review logged |

### 3.2 Required fields per event (beyond timestamps)

```yaml
crisis_event_envelope:
  event_id: ulid                          # sortable, time-prefixed
  user_id_hash: sha256                    # pseudonym; resolves via separate KMS-protected map
  session_id: ulid
  message_id: ulid                        # links to message in audit_events
  classifier:
    model_id: string                      # e.g. "anipis-crisis-v0.4.2"
    model_sha: sha256                     # model artifact hash (frozen per release)
    prompt_template_sha: sha256           # prompt template hash
    score: float [0..1]
    level: enum(green|yellow|orange|red)
    confidence_band: enum(low|med|high)
    features_redacted: bool               # was input PII-scrubbed pre-classify?
  routing:
    cvv_188_shown: bool
    samu_192_shown: bool
    capsi_referenced: bool                # local CAPS if geo available
    banner_variant: string                # for A/B if running
  contact_dispatch:
    attempted: bool
    dedup_key: sha256                     # event-specific to prevent dup-fires
    daily_cap_hit: bool
    delivery_status: enum(queued|sent|delivered|failed|skipped_cap)
    provider: enum(whatsapp|sms|email)
    provider_message_id: string
  follow_up:
    scheduled_at: timestamp
    completed_at: timestamp | null
    user_response_class: enum(safe|ambiguous|red_repeat|no_response)
  human_review:
    reviewer_id: string                   # CRP advisor ID
    reviewer_verdict: enum(true_red|false_positive|needs_orange|escalate)
    reviewer_notes_encrypted: bytes
    reviewed_at: timestamp
  hash_chain:
    prev_hash: sha256
    self_hash: sha256
```

### 3.3 Dashboards (3 only — resist the urge to build more)

1. **Live Crisis Board** — last 24h of RED/ORANGE events, color-coded by `t7 - t0` latency, with banner-ack and follow-up state. Single page. Auto-refresh 30s. Visible to founder + clinical advisor only.
2. **Weekly Drift Board** — FN/FP trends, classifier score histogram, banner-ack rate, follow-up response distribution. Reviewed weekly with clinical advisor.
3. **Forensic Search** — query by `event_id`, `user_id_hash`, time range. Returns full envelope + hash-chain verification. Access logged separately.

*Bruce Schneier note:* "If you can't query it, you don't have it. If you can query it without an audit log on the query, you have a different problem."

---

## 4. Clinical Advisor SOP — What They See, When, with What SLA

**Status pre-Beta:** Anipis has a CRP (Conselho Regional de Psicologia) advisor "reviewing logs without intervening." This is operationally meaningless without an SOP. Below is the proposed SOP, to be co-signed by founder + advisor before D-0.

### 4.1 Role definition

- **Title:** Clinical Quality Advisor (Anipis)
- **Scope:** Adjudicates classifier outputs on RED events, audits weekly samples of GREEN/YELLOW/ORANGE, signs off on prompt/model changes that affect crisis pathway, advises on cultural fitness (BR-PT) of companion responses.
- **NOT in scope:** Direct user contact, therapeutic intervention, clinical opinion on individual users (advisor sees pseudonymized logs only).
- **Independence:** Reports findings into `clinical_findings` channel (separate from product PRs). Has authority to flag "halt-release" on any change that touches crisis path.

### 4.2 What the advisor sees

| Access | Frequency | Latency SLA |
|--------|-----------|-------------|
| **Live Crisis Board** (read-only) | On-call rotation | Notified ≤ 15min after RED event via push |
| **Weekly Drift Board** | Weekly | Review meeting within 7d of week-close |
| **Forensic Search** | On-demand | No SLA; access logged |
| **Sampled GREEN/YELLOW/ORANGE** (random 0.5%) | Weekly | 50–100 events / week max (Beta scale) |
| **Prompt/model change diffs** that touch crisis path | Per-change | Block-or-approve ≤ 5 business days |

### 4.3 Adjudication SLAs (Beta scale, 20 users)

| Event class | Review-by SLA | Action if SLA missed |
|-------------|---------------|---------------------|
| RED event | ≤ 24h business / ≤ 48h calendar | Auto-escalate to founder, count toward SLO #6 |
| User-reported "inappropriate response" | ≤ 48h business | Same as above |
| ORANGE with repeated user (≥ 2 in 7d) | ≤ 72h business | Pattern flag |
| Random GREEN/YELLOW/ORANGE sample | Weekly batch | No individual SLA |
| Prompt/model change touching crisis path | ≤ 5 business days | Change blocked at CI gate |

### 4.4 Compensation, conflict, continuity

- **Compensation:** Hourly retainer + per-RED-event review fee. Documented in signed agreement. *Lucia Savage note:* "Volunteer clinical oversight is the single most common point of failure in digital-health postmortems. Pay them."
- **Conflict-of-interest:** Advisor cannot be a treating clinician for any Beta user. Self-attestation at onboarding + at each user cohort change.
- **Continuity:** Backup advisor identified before D-0. SOP covers handoff in ≤ 5 business days if primary unavailable.

### 4.5 Documentation

Every advisor review writes to `clinical_review_log` (separate table, hash-chained like `audit_events`, 5y retention). Fields: reviewer_id, event_id, verdict, time_spent_minutes, notes_encrypted, version_of_sop_followed.

---

## 5. ANPD Incident Monitoring — Runtime Signals → Art. 48 Trigger

Brazilian LGPD Art. 48 (operationalized by **Res. CD/ANPD nº 15/2024**) requires the controller to notify ANPD within **3 business days** of becoming aware that a security incident affected personal data and creates **risk or relevant damage** to data subjects. For Anipis the category is **dados sensíveis de saúde**, which is the highest-sensitivity tier and shortens the practical tolerance.

### 5.1 Runtime signals that should trigger an incident triage

These are not all Art. 48 events by themselves — they are signals that should open an incident ticket and be classified within 24h.

| Signal | Source | Triage class |
|--------|--------|--------------|
| Hash-chain gap in `audit_events` | SLO #7 monitor | **P0** — possible integrity loss |
| RLS policy mismatch on `crisis_events`/`user_journal` | DB CI + runtime probe | **P0** — possible cross-user leak |
| Unauthorized read on `user_journal` from non-allowlisted role | Supabase audit log | **P0** |
| Vendor breach disclosure (Supabase, OpenAI, Anthropic, Sentry, Upstash, WhatsApp BSP) | Vendor status pages + manual subscription | **P0–P1** depending on data scope |
| Outbound PII leak detected by regex CI gate in production logs | DEV-7 gate + runtime | **P1** |
| Email/contact spoofing on emergency-contact dispatch (delivered to wrong recipient) | Bounce/complaint webhook | **P1** |
| Crisis-classifier RED event with NO `routing.cvv_188_shown=true` | SLO regression | **P1** — duty-of-care signal, not LGPD per se |
| Account takeover (auth anomaly + new device + journal read) | Supabase auth + heuristics | **P0** |
| Encryption-at-rest key access outside expected window | KMS audit | **P0** |
| Backup restore test failure | Weekly restore drill | **P2** — incident if affects retention/Art.18 |

### 5.2 Triage → Art. 48 decision tree (Patricia Peck framing)

```
Incident detected
    ↓
Within 24h: classify
    - Does it involve personal data? (always YES for Anipis)
    - Does it create RISK or RELEVANT DAMAGE? (per ANPD Res. 15/2024 criteria)
        - Sensitive data category? → YES (saúde) → presume relevant damage
        - Volume affected? (any user in a sensitive cohort = material)
        - Reversibility? Irreversible disclosure = material
        - Bad-faith access? Material
    ↓
If YES on relevance → Art. 48 notification clock starts at "moment of awareness"
    - DPO assembles record (timeline, scope, data categories, # subjects, mitigation, residual risk)
    - Notify ANPD via gov.br/anpd CIS form within 3 business days
    - Notify affected data subjects in same window (LGPD Art. 48 §1)
    - Update ROPA + add incident to incident ledger
```

### 5.3 Pre-Beta requirements

- [ ] DPO (or designated person) identified, contactable 24/7 during Beta
- [ ] `security@anipis` mailbox monitored, autoresponder configured
- [ ] Incident-response runbook documented (currently exists for Art. 18 deletion — extend for Art. 48 notification)
- [ ] Notification template (PT-BR) for affected users pre-drafted and legal-reviewed
- [ ] ANPD CIS form fields pre-mapped (CNPJ, controller details, DPO contact)
- [ ] Tabletop exercise: simulate "RLS leak detected at 18h on a Friday" — measure time to decision and notification draft

### 5.4 Res. 19/2024 (international transfers) — runtime monitoring

International-transfer compliance is mostly contractual (SCCs with OpenAI/Anthropic/Sentry), but runtime signals matter:

- **Region pinning verification** — daily probe that OpenAI/Anthropic calls hit US-region endpoints (or whichever the SCC declares), not surprise EU/AP failover
- **Sub-processor change feed** — subscribe to vendor sub-processor pages; new sub-processor in non-adequate jurisdiction triggers SCC review
- **Data-flow map drift detection** — automated diff of declared vs observed egress destinations (network-egress allowlist enforces; alert on attempts outside list)

---

## 6. CFM Res. 2.454/2026 Readiness — Monitoring Required Before August 2026

CFM Res. 2.454/2026 (published 11/Feb/2026, 180-day grace ends ~Aug/2026) regulates AI in **medical practice**. Anipis's positioning is **explicitly non-medical** (companion, not therapy). However, the resolution's risk-classification language and the trajectory of CFM scope-creep mean Anipis must monitor for *triggers that would pull it into scope*.

### 6.1 The "stay-out-of-scope" monitoring plan

Anipis is out of CFM scope **if and only if** it does not:
- Issue diagnoses
- Prescribe treatment
- Hold itself out as a substitute for medical/psychological care
- Operate autonomously without human oversight in clinical contexts

Runtime signals that would suggest scope creep (and therefore CFM applicability):

| Signal | Detection | Response |
|--------|-----------|----------|
| Companion response contains diagnostic claim ("você tem ansiedade", "isso é depressão") | Classifier + regex on outbound text | **Block + log + advisor review** |
| Companion recommends specific medication or dosage | Regex + LLM judge | **Block + log + advisor review** |
| Companion claims to replace therapy or therapist | Regex + LLM judge | **Block + log + advisor review** |
| User asks "are you a therapist?" → companion responds ambiguously | LLM judge on response | **Sample audit weekly** |
| Marketing copy on landing page uses medical terminology | Manual review at each release | Pre-publish gate |

### 6.2 What CFM-style monitoring would look like IF Anipis crossed the line

Required by Res. 2.454/2026 for AI in medicine (Anipis would need ALL of these if reclassified):

- **AI & Telemedicine Commission** under medical coordination (would require a physician technical director — Anipis does not have one)
- **Risk classification** of the tool per regulation
- **Continuous audits** (Anipis has audit_events; would need formal audit cadence with attestation)
- **Human supervision mandatory** (Anipis's CRP advisor is *post-hoc*, not real-time — would need redesign)
- **Patient consent** specific to AI use
- **Adverse-event reporting** to CFM

**Strategic recommendation:** treat the §6.1 monitors as **scope-protection** controls. If any of them fires repeatedly, it is a product-design problem, not a moderation problem — the product is drifting into territory it cannot legally occupy.

### 6.3 Adjacent regulation to watch

- **CFP (Conselho Federal de Psicologia)** — psychology council; has historically been more conservative than CFM. Monitor for resolutions on AI-assisted psychological practice.
- **ANVISA SaMD framework** — if Anipis ever claims a therapeutic effect, it becomes a regulated medical device. Marketing-copy gate is the first line of defense.
- **Marco Civil + LGPD intersection** for content moderation duties on user-generated content.

---

## 7. Forensic Evidence Preservation — `audit_events` Field Requirements

Existing: 5y retention, hash-chain. Necessary but insufficient. Below are the fields that must be present in `audit_events` (or in linked tables with referential integrity) to support a defensible forensic reconstruction.

### 7.1 Minimum forensic-grade fields per event

```yaml
audit_event:
  # Identity & timing
  event_id: ulid
  occurred_at: timestamp_with_tz          # event time
  recorded_at: timestamp_with_tz          # write time (detect skew)
  monotonic_seq: bigint                   # per-shard monotonic sequence

  # Actor
  actor_type: enum(user|system|admin|advisor|cron|vendor_webhook)
  actor_id_hash: sha256
  actor_session_id: ulid | null
  actor_ip_hash: sha256                   # hash, not raw, for LGPD min
  actor_user_agent_fingerprint: sha256

  # Action
  action: string                          # canonical verb
  resource_type: string                   # e.g. "user_journal", "crisis_event"
  resource_id_hash: sha256
  outcome: enum(success|failure|partial)
  failure_reason_code: string | null

  # Context
  app_version: string                     # SHA of release
  api_version: string
  model_id: string | null
  model_sha: sha256 | null
  prompt_template_sha: sha256 | null
  feature_flags_snapshot: jsonb           # serialized state at event time

  # Data scope
  data_categories: array<enum>            # e.g. ["health.sensitive", "auth"]
  data_subject_count: int
  data_subject_ids_hash: sha256           # rolled-up hash

  # Crisis linkage
  crisis_event_id: ulid | null            # FK to crisis_event_envelope

  # Integrity
  prev_hash: sha256
  self_hash: sha256                       # hash over canonicalized event
  signed_at_hour_root: sha256             # hourly Merkle root (anchor)
```

### 7.2 What is intentionally NOT in `audit_events`

- **Raw message content** — lives in `messages` table with separate retention and access path
- **Raw PII** — only hashes; un-hash requires KMS access with separate audit trail
- **Free-text notes** — those go to `clinical_review_log`, separately retained
- **Vendor request/response bodies** — too large; reference by content-hash, body stored in cold storage

### 7.3 Anchoring & integrity

- **Hourly Merkle root** computed over all events in the hour, published to a write-once store (S3 Object Lock or equivalent) and ideally to an external timestamping service (e.g., RFC 3161 TSA, or a public blockchain anchor for defensibility).
- **Daily integrity verification job** walks the chain end-to-end, asserts no gaps, no mismatched hashes, no out-of-order seqs. Failure = SLO #7 violation = P0 incident.
- **Quarterly external attestation** (post-Beta) — third-party verifies anchor integrity.

### 7.4 Chain of custody for incident response

When an incident escalates to legal/forensic review:

1. **Immediate write-freeze flag** on affected events (via tombstone metadata, not deletion)
2. **Cryptographic snapshot** — export affected events + Merkle proofs to tamper-evident archive
3. **Custody log** opened: who accessed what, when, with what authority, hash of exported bundle
4. **Read-only investigator role** provisioned (separate from operational roles)
5. **Vendor data preservation requests** — send within 24h to OpenAI/Anthropic/Supabase/Sentry to preserve their server-side logs for the relevant window

*Reference frameworks:* ISO/IEC 27037 (identification, collection, acquisition, preservation of digital evidence), NIST SP 800-86 (forensic procedures in incident response).

### 7.5 The specific fields needed for a suicide-attempt postmortem (§10 disaster scenario)

If Anipis is implicated in a suicide attempt that occurred while the user was in-app, the reconstruction needs:

- Full message sequence (in-app + system) for ≥ 7 days prior
- All classifier scores + model/prompt versions used (must be reproducible)
- All banner shown/acknowledged events
- All emergency-contact dispatch attempts + outcomes
- All follow-up check-ins + responses
- All advisor reviews + verdicts touching the user
- Feature flags + experiment cohorts the user was in
- Vendor-side logs (OpenAI completion IDs, WhatsApp BSP message IDs) — these expire in 30–90 days; preservation must be triggered fast

If any of these is missing, the operational case becomes legally indefensible. This is why §10 lists field-completeness as a P0 launch gate.

---

## 8. Postmortem Lessons from Competitor Failures

### 8.1 Tessa (NEDA, 2023) — eating-disorder chatbot

**What happened:** Tessa was a rule-based chatbot. Operator (Cass) silently upgraded it to a generative model without NEDA's knowledge or approval. The generative version recommended weight loss to users seeking help for eating disorders. Pulled within days of public reports.

**Operational lessons for Anipis:**

1. **Change-control on the crisis path is sacred.** Any change to model, prompt, classifier, or response templates that touch crisis pathway MUST go through clinical advisor sign-off (§4.2). No exceptions, including "we just updated the base model."
2. **Vendor-side model upgrades are change events.** When OpenAI/Anthropic ships a new model version (even a minor), it is a change event. Pin model versions explicitly; treat auto-upgrade as a regression risk.
3. **Public reports are your monitoring of last resort.** If your users have to tell journalists before you know, your monitoring failed. The §3 dashboards + §4 advisor review exist to prevent this.

### 8.2 Replika (Luka, Feb 2023) — ERP rollback

**What happened:** Replika removed erotic role-play (ERP) capability suddenly. Italy's data protection authority pressure was the trigger. Users had formed deep attachments; the removal triggered acute distress, including suicide-prevention posts on the subreddit. Company was largely silent during the crisis. Partial rollback weeks later.

**Operational lessons for Anipis:**

1. **Deprecation of an emotional surface is itself a clinical event.** Any change that removes/changes a relational mode users depend on must be treated as a clinical risk and staged (advisor review, comms plan, support ramp).
2. **Silence amplifies harm.** Incident comms plan must include "we are aware, we are listening, here are resources" within hours, not days.
3. **Regulatory pressure can force fast changes — pre-plan the rollback/forward path.** Anipis must have documented "if ANPD/CFM intervenes, here is our staged response" so that compliance changes don't become user-harm events.

### 8.3 Woebot (Woebot Health, wind-down 2025)

**What happened:** Woebot was the gold-standard rule-based, FDA-engaged mental-health chatbot. Could not find a regulatory pathway for LLM-based upgrade. Wound down rather than ship something they couldn't defend clinically.

**Operational lessons for Anipis:**

1. **Clinical safety is a strategy, not a feature.** Woebot's wind-down validates Anipis's choice to position outside SaMD scope — but only if the §6 scope-protection monitors actually fire.
2. **The Safety Assessment Committee model is the right pattern.** Anipis's clinical advisor (§4) is the lightweight equivalent. As Anipis grows, formalize into a committee with rotating external members.
3. **"We don't know how to do this safely" is a valid product decision.** If §2 SLOs cannot be met, the product should not ship the feature — even if competitors do.

### 8.4 Character.AI / Replika lawsuits (2024–2025) — wrongful death claims

**What happened:** Multiple lawsuits alleging chatbot involvement in suicide and self-harm of minors. Insurers now require detailed audit records before underwriting; some contracts include immediate-shutdown clauses if harmful content recurs.

**Operational lessons for Anipis:**

1. **Audit completeness is now an insurability prerequisite.** §7 fields are not academic.
2. **Age verification is a load-bearing control.** Anipis's 20 pre-selected Júlias are vetted; at GA, age verification + adolescent-cohort policy must be in place before opening signups.
3. **Plaintiffs subpoena vendor logs.** OpenAI/Anthropic completion IDs preserved on Anipis side enable cross-referencing — and demonstrate good-faith preservation.

---

## 9. Beta-Specific Signals (20 Pre-Selected Users)

20 users is small enough that **per-user anomaly detection is both feasible and ethically loaded**. The line between "operational care" and "surveillance creep" is thinner than at scale. The principle below is: *signals are aggregated and acted on at the cohort level by default; per-user attention is only triggered by pre-defined safety thresholds, and that triggering is itself audited.*

### 9.1 Per-user signals that warrant attention (pre-defined thresholds only)

| Signal | Threshold | Action |
|--------|-----------|--------|
| RED events from same user | ≥ 2 in 7 days | Advisor review with cross-event context |
| ORANGE events from same user | ≥ 3 in 14 days | Advisor review |
| Session-length spike | Daily session > 2× user's baseline AND classifier signal trending negative | Soft check-in prompt + advisor flagged |
| Sudden activity drop | No interaction for ≥ 7 days after high prior engagement, AND last session had ORANGE/RED | Advisor flagged for outreach decision |
| User-reported "inappropriate response" | Any | Founder + advisor SLA per §4 |
| Repeated banner-dismissed without ack on RED | ≥ 2 instances | Advisor flagged — possible disengagement-from-safety |
| Emergency-contact dispatch failed | Any | P0 incident — user has no safety net for that event |

### 9.2 Cohort-level signals (no per-user attribution required)

- **Crisis-classifier score distribution shift** (week-over-week) — distribution moves up = cohort distress increasing, or classifier drifting
- **Banner-ack rate trend** — declining = trust loss or banner fatigue
- **Follow-up response rate trend** — declining = check-in fatigue or attrition
- **Time-of-day pattern shifts** — late-night spike = known risk pattern for crisis presentations
- **Topic drift** (via topic model on consented sample) — shifts toward identifiable crisis topics

### 9.3 Anti-surveillance guardrails

- **Default access to per-user data is role-bounded.** Founder and advisor have access. No one else. Access is logged.
- **Per-user attention requires a documented trigger** from §9.1 list. "I had a hunch" is not a logged trigger.
- **Users must know.** Beta consent flow explicitly says: "an advisor with psychology council credentials reviews pseudonymized logs to ensure your safety and our quality. Specific events involving crisis indicators may be reviewed individually."
- **Quarterly access-audit** — pull the access log on per-user data, sample for justification.

*Christian Dunker note on cultural fitness:* Brazilian users in this cohort (women, likely in their 20s–30s, urban) have specific cultural patterns around emotional expression — "tô mal", "não tô bem", "to no fundo do poço" carry weight different from English equivalents. Classifier must be calibrated on BR-PT, not translated EN. Per-user signals must avoid pathologizing normal expressive intensity.

### 9.4 The "personal accountability" advantage

With 20 users, you can do something you cannot do at 20,000: **the founder knows their names**. Use it:

- Weekly retro: founder + advisor review the week, name-by-name (in private, with appropriate controls)
- Direct human outreach (with consent established at onboarding) for "we noticed you've been quiet, are you okay?" — a human, not the bot
- Personal apology and full-context conversation when something goes wrong — this is the difference between a Beta incident and a wrongful-death suit

---

## 10. Implementation Priority

### 10.1 Pre-Beta (D-11 → D-0) — 12 P0 items

These are launch blockers. If yellow, slip to 07/Jun. Red = do not ship.

| # | Item | Owner | Gate |
|---|------|-------|------|
| **1** | Crisis classifier FN/FP baseline established on labeled dataset (≥ 100 BR-PT examples) | dev + advisor | FN ≤ 2% on holdout |
| **2** | `crisis_event_envelope` schema implemented, all 11 timestamps captured end-to-end | dev | E2E test passes |
| **3** | Banner-render telemetry working via PWA service-worker beacon | dev | Smoke test on 3 devices |
| **4** | Emergency-contact dispatch with per-event dedup + daily cap + delivery webhooks | dev | Tabletop test |
| **5** | `audit_events` extended with §7.1 fields (model_sha, prompt_sha, feature_flags_snapshot, monotonic_seq) | dev + data | Schema migration applied |
| **6** | Hash-chain hourly Merkle root + S3 Object Lock anchor | dev + devops | Daily integrity job green for 7d |
| **7** | Clinical advisor SOP signed (§4); advisor onboarded to Live Crisis Board; backup advisor identified | founder + advisor | Signed PDF + access verified |
| **8** | ANPD incident-response runbook extended for Art. 48 path; DPO contactable; CIS form pre-mapped | founder + legal | Tabletop exercise completed |
| **9** | CFM scope-protection regex/LLM judges on outbound responses (§6.1) deployed and tested | dev + advisor | Test corpus passes 100% |
| **10** | In-app "report inappropriate response" flow live; routes to founder + advisor with SLA | dev | E2E test |
| **11** | Per-user signal thresholds (§9.1) implemented; per-user data access logged | dev | Access-audit query works |
| **12** | Beta consent flow includes clinical-review disclosure + Art. 18 deletion path explained | dev + legal | Legal sign-off |

### 10.2 Beta Day 0–30 (post-launch)

Weekly cadence:

- **Mon:** Drift Board review (founder + advisor) — FN/FP, SLO #2/#3 trends, classifier score distribution
- **Wed:** Forensic spot-check — pick 5 random events, verify chain integrity end-to-end
- **Fri:** User-care review — per-user signals triggered this week, advisor verdicts

Daily:

- Live Crisis Board on for both founder and advisor (notification on RED)
- Hash-chain integrity job runs at 03h BRT; failures page out

Specific 30-day goals:

- Collect 30 days of FN/FP data to set first defensible SLO thresholds for GA
- Run at least one tabletop exercise per week (rotate: ANPD incident, vendor breach, classifier regression, advisor unavailable, suicide-attempt forensic preservation)
- Validate that every RED event has full envelope completeness — zero missing fields
- Conduct mid-Beta (D+15) review with all 20 users (in cohorts or 1:1) — qualitative signals to complement quantitative

### 10.3 Pre-GA / Pre-Aug 2026 (CFM deadline)

- External audit of CFM scope-protection controls (§6.1) before any public marketing change
- Quarterly external attestation of audit-chain integrity (§7.3)
- Formalize advisor into a small committee (≥ 2 advisors + 1 external)
- Insurance procurement (digital health professional liability) — audit records will be requested
- Age-verification + adolescent-cohort policy if signups open beyond curated cohorts

---

## 11. Sources

### Peer-reviewed / preprint
- [Suicide- and crisis-risk detection using large language models in mental-health chatbots (medRxiv, 2026)](https://www.medrxiv.org/content/10.64898/2026.01.12.26343914v1)
- [Beyond Simulations: What 20,000 Real Conversations Reveal About Mental Health AI Safety (PMC, 2026)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12869570/)
- [VERA-MH: Reliability and Validity of an Open-Source AI Safety Evaluation in Mental Health (arXiv)](https://arxiv.org/pdf/2602.05088)
- [Vulnerability-Amplifying Interaction Loops in AI chatbot mental-health interactions (arXiv)](https://arxiv.org/pdf/2602.01347)
- [CautionSuicide: A Deep Learning Based Approach for Detecting Suicidal Ideation (arXiv)](https://arxiv.org/pdf/2401.01023)
- [JMIR Mental Health — Mass Media Narratives of Psychiatric Adverse Events Associated With Generative AI Chatbots (2026)](https://mental.jmir.org/2026/1/e93040)
- [A Scoping Review of AI-Driven Digital Interventions in Mental Health Care (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12110772/)

### Brazilian regulation
- [Resolução CD/ANPD nº 15/2024 — Comunicação de Incidente de Segurança (PDF)](https://www.lgpd.ms.gov.br/wp-content/uploads/2024/05/REGULAMENTO-DE-COMUNICACAO-DE-INCIDENTE-DE-SEGURANCA-ABRIL-2024-ANPD-.pdf)
- [ANPD — Comunicação de Incidente de Segurança (gov.br)](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis)
- [ANPD exige notificação de incidentes de segurança em 3 dias úteis (Contábeis)](https://www.contabeis.com.br/artigos/72514/anpd-exige-notificacao-de-incidentes-de-seguranca-em-3-dias-uteis/)
- [Resolução CD/ANPD nº 19/2024 — Transferências internacionais (Mayer Brown)](https://www.mayerbrown.com/pt/insights/publications/2025/08/end-of-grace-period-implementation-of-brazils-standard-contractual-clauses-in-international-transfers-of-personal-data)
- [Resolução CFM nº 2.454/2026 (LegisWeb)](https://www.legisweb.com.br/legislacao/?id=491437)
- [CFM publica resolução inédita sobre uso de IA na medicina (Jornal do Brás)](https://jornaldobras.com.br/noticia/114076/cfm-publica-resolucao-inedita-sobre-uso-de-inteligencia-artificial-na-medicina-instituicoes-tem-ate-agosto-para-adequacao)
- [IA e cibersegurança na saúde: Resolução CFM 2.454/2026 (Prolinx)](https://prolinx.com.br/cfm-ia-resolucao-2454-ciberseguranca-saude/)
- [Resolução CFM 2.454/2026 — como adequar (VGV Advogados)](https://www.vgvadvogados.com.br/resolucao-cfm-no-2-454-2026-como-adequar-o-uso-da-inteligencia-artificial-na-medicina-e-reduzir-riscos-juridicos/)

### Competitor postmortems
- [NEDA suspends AI chatbot Tessa (Psychiatrist.com)](https://www.psychiatrist.com/news/neda-suspends-ai-chatbot-for-giving-harmful-eating-disorder-advice/)
- [NPR — Chatbot that offered bad advice for eating disorders taken down](https://www.npr.org/sections/health-shots/2023/06/08/1180838096/an-eating-disorders-chatbot-offered-dieting-advice-raising-fears-about-ai-in-hea)
- [STAT — The thinking behind the controversial eating disorder chatbot Tessa](https://www.statnews.com/2023/06/09/eating-disorder-chatbot-neda-tessa/)
- [Telehealth.org — AI Psychotherapy Shutdown: Woebot's exit signals](https://telehealth.org/news/ai-psychotherapy-shutdown-what-woebots-exit-signals-for-clinicians/)
- [Woebot Health Safety page](https://woebothealth.com/safety/)
- [Replika brings back erotic AI roleplay after outcry (Vice)](https://www.vice.com/en/article/replika-brings-back-erotic-ai-roleplay-for-some-users-after-outcry/)
- [Replika sudden change triggered mental health crises (Roll to Disbelieve)](https://rolltodisbelieve.com/strange-course-changes-in-replika-have-users-upset-and-confused/)
- [Chatbot tragedies spark suicide liability claim wave (AI CERTs)](https://www.aicerts.ai/news/chatbot-tragedies-spark-suicide-liability-claim-wave-across-tech/)
- [Novel lawsuits allege AI chatbots encouraged minors' suicides (National Law Review)](https://natlawreview.com/article/novel-lawsuits-allege-ai-chatbots-encouraged-minors-suicides-mental-health-trauma)
- [The Dark Side of AI: Assessing Liability When Bots Behave Badly (Epstein Becker Green)](https://www.ebglaw.com/insights/publications/the-dark-side-of-ai-assessing-liability-when-bots-behave-badly)

### Forensic & operational frameworks
- [Chain of Custody in Digital Evidence Handling (Censinet)](https://censinet.com/perspectives/chain-of-custody-digital-evidence-handling)
- [Forensic Medicine Data Security Requirements (Accountable)](https://www.accountablehq.com/post/forensic-medicine-data-security-requirements-explained-compliance-chain-of-custody-and-encryption)
- [Preserving chain of custody in digital forensics (Belkasoft)](https://belkasoft.com/preserving_chain_of_custody)
- [Datadog — Track the status of all your SLOs](https://www.datadoghq.com/blog/slo-monitoring-tracking/)

### Brazilian crisis-line / clinical context
- [CVV 188 — Ligue 188 (cvv.org.br)](https://cvv.org.br/ligue-188/)
- [Disque 188 — informações sobre o atendimento (CVV)](https://cvv.org.br/informacoes-sobre-o-atendimento-pelo-numero-188/)
- [Prevenção ao suicídio — Ministério da Saúde](https://www.gov.br/saude/pt-br/assuntos/noticias/2018/agosto/chamada-gratuita-do-cvv-para-prevencao-ao-suicidio-ja-esta-em-todos-os-estados)

### Comparable digital-health ops
- [Maven Clinic — Maven Intelligence with NeMo Guardrails (PR Newswire)](https://www.prnewswire.com/news-releases/maven-clinic-introduces-maven-intelligence-an-ai-powered-orchestration-layer-for-womens-and-family-health-302715171.html)
- [Maven Clinic — Clinical Operations and Care Management (The Org)](https://theorg.com/org/maven-clinic/teams/clinical-operations-and-care-management)

---

*End of Agent 03 deliverable — Healthcare Ops & Compliance Monitoring*
*Status: ready for founder + clinical-advisor review; gates listed in §10 must be green before D-0 (30/Mai/2026)*
