# CRM Novo — Real Clone Review Addendum

**Date:** 2026-07-10  
**Purpose:** Correct the prior restart brief by applying actual loaded local mind-clone expertise files.  
**Clones loaded:** `martin-fowler`, `eric-ries`, `ann-cavoukian`, `bruce-schneier`, `april-dunford`.

---

## Correction

The previous brief generated a Jarvis conclave package and checked `aios-brain-bridge`, but the consultation responses were pending. That was not enough to claim the clones were used.

This addendum applies the actual local clone expertise definitions loaded from:

- `.agents/skills/native/mind-clones/martin-fowler/SKILL.md`
- `.agents/skills/native/mind-clones/eric-ries/SKILL.md`
- `.agents/skills/native/mind-clones/ann-cavoukian/SKILL.md`
- `.agents/skills/native/mind-clones/bruce-schneier/SKILL.md`
- `.agents/skills/native/mind-clones/april-dunford/SKILL.md`

---

## 1. Martin Fowler Review — Architecture

### Lens

Enterprise architecture, evolutionary design, bounded contexts, refactoring discipline.

### Verdict

Use a modular monolith. Do not split CRM, bridge, WhatsApp, and compliance into services now.

The correct boundary is not infrastructure service separation. The correct boundary is **bounded contexts inside one deployable app**:

- `auth-tenants`
- `crm-core`
- `messaging`
- `conversion-bridge`
- `lgpd-compliance`
- `reports`

### Changes Required

1. Write ADR-001: "Modular monolith for CRM Novo V0".
2. Keep provider integrations behind ports/adapters:
   - `ConversionProvider`
   - `MessagingProvider`
   - `AttributionProvider`
3. Make the bridge independently testable even if it lives in the monolith.
4. Use feature toggles for `whatsapp_inbox`, `google_data_manager`, `pipeline_ui`, and `bretda_tenant`.

### Kill Signal

If module boundaries blur and every route handler directly calls Meta/Google/Supabase with duplicated logic, pause implementation and refactor before Sprint 2.

---

## 2. Eric Ries Review — Product Validation

### Lens

Build-Measure-Learn, concierge MVP, actionable metrics, pivot/persevere.

### Verdict

The riskiest assumption is not "can we build it?" It is:

> Tocks/Bretda will actually operate faster and cleaner inside this system than in WhatsApp Web + spreadsheet.

### Changes Required

1. Sprint 0 must be a real validation gate, not ceremony.
2. Define one concierge test before broad build:
   - one day of real lead handling using WhatsApp Web + Sheet + Bridge standalone
   - manually record time-to-first-response, qualification, upload status, and missed follow-up
3. The first MVP is not "CRM". The first MVP is **qualified lead event reliably reaches ads platforms**.
4. Use actionable metrics only:
   - qualified lead upload success rate
   - response time
   - number of missed follow-ups
   - reconciliation mismatch count

### Kill / Pivot Signal

If WhatsApp Web + spreadsheet + standalone bridge solves 80% of the pain, pivot to Bridge-only and defer CRM UI.

---

## 3. Ann Cavoukian Review — Privacy by Design

### Lens

Privacy as default, proactive privacy, end-to-end data lifecycle, transparency.

### Verdict

LGPD/privacy cannot be a later milestone. Consent, minimization, auditability, and deletion lifecycle must be in the first schema.

### Changes Required

1. Add data minimization review before schema lock.
2. Make consent/privacy defaults tenant-safe:
   - no cross-tenant visibility
   - no optional collection of unnecessary PII
   - source evidence stored only when needed for attribution/legal basis
3. `consent_ledger` and `audit_log` must be append-only from Sprint 1.
4. Add privacy metadata to each source:
   - legal basis
   - purpose
   - source URL
   - ad/campaign IDs
   - consent copy version
5. Build DSAR request tracking early, even if full automation ships later.

### Kill Signal

If real leads enter the system before consent/audit evidence exists, stop ingestion and return to staging/test events only.

---

## 4. Bruce Schneier Review — Security

### Lens

Threat modeling, attack surface, defense in depth, assume breach, security economics.

### Verdict

The highest-risk failure is not a code bug. It is a quiet cross-tenant or attribution-integrity failure that makes Breno trust false data.

### Threats

1. Cross-tenant data leak through service-role misuse.
2. Webhook spoofing or replay against WhatsApp/Meta endpoints.
3. Conversion event duplication inflating campaign learning.
4. Secret leakage in logs or client bundles.
5. Manual replay tooling used without authorization/audit.

### Changes Required

1. Threat model Sprint 1 before implementation crosses external APIs.
2. Add automated guardrails:
   - no service-role key in client bundle
   - route handlers verify server-only env usage
   - webhook signature validation tests
   - replay idempotency tests
3. Add audit on every privileged action:
   - manual trigger
   - DLQ replay
   - tenant config change
   - conversion resend
4. Design for blast-radius reduction:
   - tenant-scoped keys/config
   - per-platform circuit breaker
   - least privilege for each integration token

### Kill Signal

If a manual trigger can replay conversion events without authentication, idempotency, and audit trail, bridge deployment is blocked.

---

## 5. April Dunford Review — Positioning

### Lens

Competitive alternatives, differentiated value, best-fit customer, market category.

### Verdict

Do not position this internally as "a CRM". That puts it in the wrong category and invites comparison against HubSpot/PipeRun/RD.

Correct positioning:

> Operational attribution layer for high-ticket WhatsApp sales.

CRM is the interface. Attribution reliability is the value.

### Competitive Alternatives

- WhatsApp Web + spreadsheet
- Sales AI deprecated
- PipeRun/RD/HubSpot with brittle integrations
- Manual Google/Meta conversion uploads

### Unique Attributes

- Bridge Meta + Google with idempotency and reconciliation
- Tenant-specific WhatsApp sales flow
- LGPD evidence ledger from source to sale
- Internal AIOS-native automation later

### Best-Fit Customer

Not "any sales team". Start with:

- high-ticket Brazilian businesses
- WhatsApp-heavy sales
- paid media driven lead flow
- need to feed real qualified/sold outcomes back to ads platforms

### Changes Required

1. Rename pitch from "CRM Novo" to a working category internally: "Attribution CRM" or "WhatsApp Revenue Bridge".
2. In every doc, lead with the pain:
   - "ads optimize on bad or missing conversion data"
   - not "we need a better CRM"
3. Sales/adoption pitch for Tocks/Bretda:
   - "fewer lost leads, faster response, ads learn from real qualified leads"

### Kill Signal

If the team describes the product as "HubSpot but ours", positioning has failed and scope creep will follow.

---

## Clone Conclave Synthesis

### Consensus

All five perspectives support starting, but only under tighter framing:

1. Start with the bridge moat, not broad CRM scope.
2. Keep architecture simple: modular monolith with strict internal boundaries.
3. Treat privacy, security, audit, and idempotency as foundation, not later hardening.
4. Validate adoption through real Tocks/Bretda workflow before building commodity CRM features.
5. Reposition the product internally as attribution/operations infrastructure for WhatsApp sales.

### Dissent

- Fowler allows broad CRM modules if boundaries stay clean; Ries pushes for smallest possible validation surface.
- Cavoukian wants privacy features immediately; Ries would normally minimize MVP. Resolution: privacy/audit are not "features"; they are operating constraints for real lead ingestion.
- Dunford would avoid the CRM category; existing AIOS docs use "CRM Novo". Resolution: keep project folder name, but pitch/category becomes "Attribution CRM" or "WhatsApp Revenue Bridge".

### Final Recommendation

Proceed with **Sprint 0: Bridge + Validation Gate**.

Do not start Sprint 1 foundation until:

- bridge scaffold health is known
- Google path is classified
- Meta CAPI test path is known
- audit/DLQ/idempotency path is validated
- one concrete adoption metric beats or exposes the WhatsApp Web + spreadsheet baseline

### Immediate Next Story

Create `CRM-0.1 — Bridge-first restart gate`.

Acceptance criteria:

- Bridge app install/build/typecheck status documented
- Google Ads route classified: `upload-click-ready`, `data-manager-needed`, or `blocked`
- Meta CAPI test event path documented
- Supabase `audit_log`, `dlq_events`, `idempotency_keys` verified or migration gap documented
- security checklist covers secrets, webhook signatures, manual trigger auth, replay audit
- Gate 0 decision recorded: full CRM, bridge-only, or blocked

