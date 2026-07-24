# CRM-0.3 — Bridge Env + Supabase Smoke

**Date:** 2026-07-10  
**Story:** `docs/stories/active/CRM-0.3-bridge-env-supabase-migration-smoke.md`

---

## Env Groups

### Supabase

Required:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

### Meta CAPI

Required:

- `META_PIXEL_ID`
- `META_ACCESS_TOKEN`

Optional:

- `META_TEST_EVENT_CODE`
- `META_API_VERSION`

### Google Ads `UploadClickConversion`

Required:

- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_CUSTOMER_ID`
- `GOOGLE_ADS_CONVERSION_ACTION_LEAD_QUALIFIED`

Optional:

- `GOOGLE_ADS_LOGIN_CUSTOMER_ID`
- `GOOGLE_ADS_CONVERSION_ACTION_DEAL_WON`

### Google Data Manager

Required:

- `DATA_MANAGER_ACCESS_TOKEN`
- `DATA_MANAGER_OPERATING_ACCOUNT_ID`
- `DATA_MANAGER_CONVERSION_ACTION_ID`

Optional:

- `DATA_MANAGER_LOGIN_ACCOUNT_ID`

### Manual Trigger

Required:

- `MANUAL_TRIGGER_TOKEN`

---

## SQL Structure Review

Migration file:

`docs/projects/crm-novo/60-bridge-standalone/db/0001_initial.sql`

Static review:

- `bridge_audit_log`: present, indexed by event, tenant/time, failed status, entity.
- `bridge_idempotency`: present, fixed to `PRIMARY KEY (event_id, destination)`.
- `bridge_dlq`: present, tracks replay lifecycle.
- RLS: enabled on all three bridge tables.
- Dashboard view: `bridge_summary_24h`.
- Cleanup function: `cleanup_expired_idempotency()`.

Live migration:

- Not run. Missing Supabase credentials in local environment.

---

## Classification

Supabase migration status: `needs-config`.

Reason:

- Schema is locally ready by static review.
- Live migration requires `SUPABASE_DB_URL`.
- Live smoke requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

