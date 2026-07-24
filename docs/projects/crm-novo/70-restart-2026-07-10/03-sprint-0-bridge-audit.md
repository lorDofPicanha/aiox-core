# CRM-0.1 — Sprint 0 Bridge Audit

**Date:** 2026-07-10  
**Story:** `docs/stories/active/CRM-0.1-bridge-first-restart-gate.md`  
**Scope:** local bridge audit, static integration review, typecheck/build, and gate classification.

---

## 1. Package + Runtime Inventory

Package under audit:

`docs/projects/crm-novo/60-bridge-standalone`

Runtime assumptions:

- Node `>=20`
- pnpm `>=9` (local available: `10.29.3`)
- Next.js 16 App Router
- Inngest route at `/api/inngest`
- Manual trigger route at `/api/manual-trigger`
- Supabase service-role client for Week 0 persistence
- Google Ads API via `google-ads-api`
- Meta CAPI via direct `fetch`

Scripts:

- `pnpm dev` — starts Next + Inngest dev server
- `pnpm build` — production build
- `pnpm typecheck` — TypeScript check
- `pnpm test:event` — manual event smoke script
- `pnpm google:oauth` — Google OAuth refresh token helper
- `pnpm db:migrate` — applies `db/0001_initial.sql`

Dependencies installed with `pnpm install`.

---

## 2. Local Check Results

| Command | Result | Notes |
|---|---:|---|
| `rtk pnpm install` | PASS | Installed bridge dependencies and generated local lock state. |
| `rtk pnpm typecheck` | FAIL then PASS | Initial 3 TS errors fixed. Final run passed. |
| `rtk pnpm build` | PASS | Next.js 16.2.10 production build passed. |
| `rtk pnpm test:event` | BLOCKED | Fails because `MANUAL_TRIGGER_TOKEN` / `.env.local` is absent. Expected for no-credentials audit. |

Build routes:

- `/`
- `/api/inngest`
- `/api/manual-trigger`

---

## 3. Fixes Applied During Audit

### P0: idempotency was destination-unsafe

Problem:

`bridge_idempotency` used `event_id` as primary key, but code intentionally sends the same event ID to both destinations: `meta_capi` and `google_oc`. After Meta succeeded, Google could fail to record its own idempotency row. Future Google retries could upload again.

Fix:

- Changed primary key to `(event_id, destination)`.
- Added `idx_idemp_event_id`.
- Updated README expectation: each destination gets its own idempotency record.

### TS/build fixes

- Renamed exported Inngest type in `src/client.ts` to avoid import conflict.
- Typed DLQ replay event names as the allowed Inngest union.
- Updated `google-ads-api` call to request-object signature.
- Pinned `turbopack.root` to the bridge subproject to avoid workspace-root inference.
- Accepted Next.js required `tsconfig.json` changes.

### README/auth fix

Problem:

README used `X-Auth-Token`, while endpoint expects `Authorization: Bearer`.

Fix:

README now uses `Authorization: Bearer $MANUAL_TRIGGER_TOKEN`.

---

## 4. Route Classification

### Google Ads conversion route

**Classification:** `data-manager-needed`

Rationale:

- Local compile/build path for `uploadClickConversions` is now healthy.
- Live verification cannot run without Google Ads credentials.
- Official Google Ads documentation warns that from 2026-06-15, `UploadClickConversion` fails for developer tokens without prior offline/enhanced lead conversion history.
- Unless Breno confirms the current token is grandfathered, Data Manager API must be treated as the production path or mandatory fallback.

Implementation state:

- Current code: `uploadClickConversions` through `google-ads-api`.
- Added in CRM-0.2: no-credential route probe and Data Manager request-shape builder.
- Missing for production: live Data Manager OAuth/credentials and ingestion call.

### Meta CAPI route

**Classification:** `needs-config`

Rationale:

- Static implementation and build pass.
- Live test requires `META_PIXEL_ID`, `META_ACCESS_TOKEN`, and optionally `META_TEST_EVENT_CODE`.
- No real credentials were used in this audit.

### Supabase persistence path

**Classification:** `needs-config`

Verified statically:

- `bridge_audit_log`
- `bridge_idempotency`
- `bridge_dlq`
- RLS enabled on all three bridge tables
- dashboard view `bridge_summary_24h`
- cleanup function `cleanup_expired_idempotency()`

Not live-verified:

- migration against Supabase
- service-role insert/select
- anon/authenticated denial

CRM-0.3 added `pnpm env:smoke`; local run found no `.env.local` and reported Supabase required envs missing.

---

## 5. Security Checklist

| Area | Status | Finding |
|---|---:|---|
| Manual trigger auth | PARTIAL | Bearer token exists; Sprint 1 should replace with Supabase JWT/role. |
| Webhook signatures | GAP | `/api/manual-trigger` is manual; future WhatsApp webhook must verify signatures. |
| Inngest signing | NEEDS CONFIG | Requires `INNGEST_SIGNING_KEY` outside local dev. |
| Service-role usage | PARTIAL | Centralized in `src/lib/supabase.ts`; must stay server-only. |
| Replay audit | PARTIAL | DLQ replay records `resolved_by`, but replay authorization is only Inngest event-level. |
| Idempotency | FIXED LOCAL | `(event_id, destination)` key is now correct. |
| Secret leakage | UNVERIFIED | Needs CI/static check before deploy. |

---

## 6. Gate 0 Decision

**Decision:** `blocked`

This is a productive block, not a code-health failure.

Reason:

- Local package health is now acceptable: typecheck and build pass.
- The bridge cannot be promoted to live dogfooding until external credentials and Google route eligibility are verified.
- Full CRM build should not start until Google route is settled as either `upload-click-ready` or Data Manager adapter work is scoped.

Allowed next work while blocked:

1. Create `CRM-0.2 — Google Data Manager fallback/probe`.
2. Create `CRM-0.3 — Bridge env + Supabase migration smoke`.
3. Prepare Sprint 1 foundation only after Gate 0 changes from `blocked` to `bridge-ready`.

---

## 7. Next Required Inputs

To unblock live Gate 0:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `META_PIXEL_ID`
- `META_ACCESS_TOKEN`
- `META_TEST_EVENT_CODE`
- Google Ads OAuth/developer token details
- confirmation whether the token successfully used offline/enhanced lead uploads before 2026-06-15
