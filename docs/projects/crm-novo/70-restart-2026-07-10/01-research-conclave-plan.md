# CRM Novo — Restart Research + Conclave Plan

**Date:** 2026-07-10  
**Owner:** Breno / Orion (`@aios-master`)  
**Status:** decision brief for restart  
**Primary decision:** start CRM Novo as Bridge-first, WhatsApp-first, multi-tenant internal CRM.

---

## 1. Executive Verdict

Proceed with CRM Novo, but do **not** restart as a broad CRM build.

The moat is still the same:

> Bridge Meta CAPI + Google Ads offline conversions/Data Manager fallback with idempotency, DLQ, audit trail, and daily reconciliation.

The CRM UI exists to make that bridge operationally reliable for Tocks and Bretda. Inbox, pipeline, reports, and automations are subordinate to that goal.

Immediate path:

1. **Sprint 0 (48h):** validate current bridge scaffold, Google Ads token path, Meta CAPI test events, and Supabase audit tables.
2. **Sprint 1 (5-7d):** build foundation in `apps/crm` or equivalent app path: Next.js 16, Supabase RLS, tenant onboarding, Inngest, audit log.
3. **Sprint 2:** WhatsApp intake + inbox v0.
4. **Sprint 3:** bridge production hardening + pipeline stage that triggers qualified lead uploads.

---

## 2. What Changed Since May 15

Research from `10-research/`, `30-ultraplan/`, `40-conclave/`, and `99-architecture/` remains directionally valid, with these updates:

1. **Next.js 16 is now a valid default.** Official release notes confirm Next.js 16 availability, Turbopack default behavior, React 19.2 support, and `proxy.ts` replacing `middleware.ts` for the main network boundary.
2. **Vercel Function limits are less restrictive than the old plan assumed.** Current Vercel docs show 300s default max duration and higher Pro/Enterprise limits, but durable workflows still belong in Inngest because bridge jobs need retry checkpoints, observability, and replay.
3. **Google Ads offline conversion path needs a new gate.** Google docs warn that starting 2026-06-15, `UploadClickConversion` fails for developer tokens that had not previously sent offline/enhanced lead conversions. Data Manager API must be treated as a fallback or primary route if the current token is not grandfathered.
4. **Supabase RLS remains correct, but must be enforced mechanically.** Official docs still stress enabling RLS on exposed schemas and policies as the data-access boundary. For this project, every tenant table needs RLS, indexes on `tenant_id`, and cross-tenant tests.
5. **The local conclave pipeline generated consultation IDs but responses are pending.** Do not pretend clone answers arrived. This brief uses the generated expert routing plus previous CRM Novo conclave and current research.

---

## 3. Conclave Status

Generated conclave:

- `conclaveId`: `e30f00e9-ce5c-44b1-890b-577b4ed8aa92`
- Experts selected: `campaign-manager`, `nicholas-kusmich`, `stephen-hahn`, `crm-manager`, `analytics-agent`
- Response status via `aios-brain-bridge`: pending for all five consultation IDs.

Interpretation:

- **Use as routed expert agenda, not as completed oracle.**
- Previous completed/synthesized CRM Novo conclave remains useful, especially the verdict: proceed with modifications, Week 0 validation, bridge as moat, 12-week declared / 16-week internal buffer.

---

## 4. Updated Consensus

### Build vs Buy

Build remains the right choice because the differentiated requirement is not "CRM records"; it is reliable ads conversion feedback for high-ticket WhatsApp sales.

Buying PipeRun/RD/HubSpot/Pipedrive only solves generic pipeline management. It does not remove the AIOS-specific need for:

- tenant-specific attribution
- Google + Meta conversion reconciliation
- idempotent upload events
- auditability for ads spend decisions
- LGPD consent/evidence ledger attached to lead source

### Bridge-first vs CRM Full

Bridge-first wins.

CRM full is only justified if Sprint 0/1 proves that Tocks/Bretda need operational UI around the bridge. Otherwise, keep a standalone bridge product and avoid building commodity CRM scope.

### Architecture

Use a modular monolith:

- Next.js 16 App Router
- Supabase Postgres/Auth/Realtime/Storage with RLS
- Inngest for durable bridge workflows
- Meta WhatsApp Cloud API direct, no third-party wrapper as default
- Meta CAPI + Google Ads OC/Data Manager integration behind provider adapters

### Compliance

LGPD cannot be Phase 4 polish. Put these in Sprint 1:

- `consent_ledger` append-only
- `audit_log` append-only
- source evidence fields (`ad_id`, `campaign_id`, `gclid`, `fbclid`, `fbc`, `fbp`, `source_url`, consent text version)
- DSAR skeleton: access/export/delete request records even if full cascade ships later

### UX / Adoption

Inbox-first remains the correct UX. Pipeline is a linked context, not the home screen.

Hard rule: lead response workflow must be faster than WhatsApp Web + spreadsheet within the first real pilot. If it is slower, pivot to bridge-only.

---

## 5. Operating Hierarchy

### Tier 0 — Command

| Role | Agent / clone | Responsibility |
|---|---|---|
| Executive orchestrator | `@aios-master` / Orion | Owns plan, gates, dependencies, handoffs, final decision log |
| Product owner | `@pm` + `@po` | Scope, MVP definition, acceptance criteria, gate decisions |
| Technical architect | `@architect` | Architecture decisions, ADRs, module boundaries, stack correctness |

### Tier 1 — Build Squads

| Squad | Lead agent | Supporting clones | Scope |
|---|---|---|---|
| Platform/Foundation | `@dev` | `simon-willison`, `sarah-drasner` | Next.js app, auth, API routes, app structure |
| Data/RLS | `@data-engineer` | `martin-fowler`, `paul-copplestone` | Schema, RLS, pgTAP, migrations, data integrity |
| Bridge/Attribution | `@dev` + `@traffic-masters-chief` | `campaign-manager`, `analytics-agent`, `nicholas-kusmich` | Meta CAPI, Google OC/Data Manager, idempotency, reconcile |
| WhatsApp/Inbox | `@dev` + `@ux-design-expert` | `crm-manager`, `lead-qualifier` | Webhook, routing, inbox v0, speed-to-lead UX |
| Compliance/Security | `@qa` + security/legal gates | `patricia-peck`, `ann-cavoukian`, `bruce-schneier` | LGPD, audit, secrets, breach posture, cross-tenant leak prevention |
| QA/Release | `@qa` + `@devops` | `gene-kim`, `stephen-hahn` | Test plan, gates, CI, production readiness. Push remains `@devops` only |

### Tier 2 — Review Council

Use only at material gates:

- Gate 0: `@pm`, `@analyst`, `crm-manager`, `eric-ries`
- Gate 1: `@architect`, `@data-engineer`, `paul-copplestone`, `martin-fowler`
- Gate 2: `@traffic-masters-chief`, `analytics-agent`, `campaign-manager`
- Gate 3: `@qa`, `stephen-hahn`, `@ux-design-expert`, `crm-manager`
- Legal/privacy gate before real lead ingestion: `patricia-peck`, `ann-cavoukian`

---

## 6. Immediate Execution Plan

### Sprint 0 — 48h Restart Gate

Goal: decide if we start full CRM build or bridge-only.

Tasks:

1. Audit `docs/projects/crm-novo/60-bridge-standalone`.
2. Verify package health and whether it can run locally.
3. Confirm Google Ads token eligibility:
   - if `UploadClickConversion` works, keep current API path
   - if blocked by post-2026-06-15 restriction, open Data Manager API path immediately
4. Confirm Meta CAPI test event path.
5. Confirm Supabase tables for `audit_log`, `dlq_events`, `idempotency_keys`.
6. Create or update Story `CRM-0.1` with acceptance criteria.

Gate 0 pass criteria:

- local build/typecheck passes for bridge scaffold
- one dry-run/test event can reach audit path
- Google path is classified as `upload-click-ready`, `data-manager-needed`, or `blocked`
- no P0 secret leakage
- decision recorded: full CRM or bridge-only

### Sprint 1 — Foundation

Start only after Gate 0.

Stories already scaffolded:

- `CRM-1.1` bootstrap app
- `CRM-1.2` Supabase Auth + tenant claim
- `CRM-1.3` schema v0 + RLS + pgTAP
- `CRM-1.4` tenant onboarding
- `CRM-1.5` Inngest setup
- `CRM-1.6` audit middleware + cross-tenant E2E

Change to existing Sprint 1:

- add Google Data Manager route decision to architecture notes
- add source evidence fields to schema now
- add service-role client guardrail test
- add RLS auto-enable/event-trigger or migration checklist

---

## 7. Non-Negotiable Gates

| Gate | Timing | Pass condition | Fail action |
|---|---:|---|---|
| Gate 0 | 48h | Bridge path classified and runnable | pivot to bridge-only debug or stop |
| Gate 1 | Sprint 1 end | RLS + auth + audit + Inngest pass tests | no WhatsApp work starts |
| Gate 2 | Sprint 2 end | WhatsApp inbound appears in tenant-scoped inbox | pause pipeline work |
| Gate 3 | Sprint 3 end | Meta + Google/Data Manager upload with idempotency and reconcile | no pilot |
| Gate 4 | Pilot | Tocks/Bretda response workflow beats WhatsApp Web + sheet | pivot UI or bridge-only |

---

## 8. First Command Sequence

Recommended first operational move:

```powershell
rtk git status
rtk powershell -NoProfile -Command "Get-Content -Path 'docs\projects\crm-novo\60-bridge-standalone\package.json'"
rtk npm run typecheck
```

Then create/activate `CRM-0.1` as the story for Sprint 0 and run only its acceptance criteria.

---

## 9. Sources Checked

- Local: `docs/projects/crm-novo/00-context/CONTEXT.md`
- Local: `docs/projects/crm-novo/10-research/06-tech-research.md`
- Local: `docs/projects/crm-novo/20-brainstorm/01-features-brainstorm.md`
- Local: `docs/projects/crm-novo/30-ultraplan/01-implementation-blueprint.md`
- Local: `docs/projects/crm-novo/40-conclave/01-conclave-synthesis.md`
- Local: `docs/projects/crm-novo/99-architecture/ARCHITECTURE.md`
- Local: `docs/projects/crm-novo/99-architecture/ROADMAP.md`
- Official: Next.js 16 release notes — https://nextjs.org/blog/next-16
- Official: Vercel Functions limits — https://vercel.com/docs/functions/limitations
- Official: Inngest functions docs — https://www.inngest.com/docs/learn/inngest-functions
- Official: Google Ads offline conversions — https://developers.google.com/google-ads/api/docs/conversions/upload-offline
- Official: Supabase RLS docs — https://supabase.com/docs/guides/database/postgres/row-level-security

