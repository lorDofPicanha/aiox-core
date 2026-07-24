# CRM-0.4 — Bridge Security Smoke

**Date:** 2026-07-10  
**Story:** `docs/stories/active/CRM-0.4-bridge-security-hardening-smoke.md`

---

## Static Checks Added

Command:

```powershell
pnpm security:smoke
```

Checks:

1. `SUPABASE_SERVICE_ROLE_KEY` appears only in `src/lib/supabase.ts`.
2. Manual trigger requires `Authorization: Bearer` and `MANUAL_TRIGGER_TOKEN`.
3. Idempotency schema uses `PRIMARY KEY (event_id, destination)`.
4. Bridge tables have RLS enabled.
5. DLQ replay records `requested_by` / `resolved_by`.
6. WhatsApp webhook signature is tracked as a future hardening gap.

---

## Severity Model

- `fail`: deployment blocker before live credentials.
- `warn`: acceptable for current Sprint 0, must be converted to story before production.
- `pass`: static check satisfied.

Expected current status:

- Fail: 0
- Warn: 2
- Pass: 4

Warns:

1. DLQ replay auth is still Inngest-event-level.
2. WhatsApp webhook signature verification does not exist yet because WhatsApp ingestion is Sprint 2.

