# CRM-0.6 — Live Bridge Credential Smoke

**Date:** 2026-07-10  
**Story:** `docs/stories/active/CRM-0.6-live-bridge-credential-smoke.md`

---

## Command

```powershell
pnpm live:smoke
```

Behavior:

- Without `.env.local`, exits successfully with `status: "needs-config"`.
- Does not print secret values.
- Reuses `env:smoke` grouping.
- Reuses Google route classification.
- If Supabase credentials exist, performs a read-only `bridge_summary_24h` query.
- Does not call Meta or Google live APIs.

---

## Current Result

Expected in current local environment:

- Overall: `needs-config`
- Supabase read-only: `needs-config`
- Google route: `data-manager-needed`

This is the correct state until credentials are supplied.

---

## Gate 0 Loop Command

```powershell
pnpm gate:0
```

Runs, in order:

- `env:smoke`
- `google:probe`
- `live:smoke`
- `security:smoke`
- `typecheck`
- `build`

Current result on 2026-07-10: pass, with expected `needs-config` statuses because `.env.local` is not present.
