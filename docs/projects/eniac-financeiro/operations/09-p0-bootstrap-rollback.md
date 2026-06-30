# ENIAC Financeiro — P0 bootstrap and rollback

## Scope

Operator runbook for migration `0003_security_integrity_hardening.sql`. It contains no credentials and does not authorize a production change.

## Local validation

Prerequisites: Docker Desktop running and the Supabase CLI installed by the app.

```powershell
cd D:\AIOS\apps\eniac-financeiro
.\node_modules\.bin\supabase.cmd start
.\node_modules\.bin\supabase.cmd db reset
.\node_modules\.bin\supabase.cmd test db
npm test
npm run validate
npm run build
```

## Production preflight

1. Confirm a current database backup and export `company_members` for review.
2. In Supabase Auth settings, disable public email signup.
3. Identify existing legitimate Auth users and their intended companies/roles.
4. Apply the migration in staging and run the two-user/two-company isolation test.
5. Verify existing `member` rows became `operator` and assign at least one `admin` per company.
6. Obtain founder approval before production migration or deploy.

## Explicit administrator bootstrap

Run only in the Supabase SQL editor after replacing both placeholders with verified IDs. Never store the production user ID/email in Git.

```sql
insert into public.company_members (user_id, company_id, role)
values ('<AUTH_USER_UUID>', '<COMPANY_UUID>', 'admin')
on conflict (user_id, company_id)
do update set role = excluded.role;
```

Repeat per company only where access is required. New users receive no company automatically.

## Smoke checks

- unknown email does not create an Auth user;
- viewer reads only its company and cannot create/update/void;
- operator can create/void only inside its company;
- posting the same scheduled item twice returns one linked entry;
- voided entry is absent from lists, balance and monthly totals;
- admin sees audit events for its company only;
- no application role can hard-delete `entries`, `scheduled` or `audit_events`.

## Rollback

Prefer a forward-fix migration for functions and policies. The new columns and audit table are additive and should remain.

- Do not recreate `on_auth_user_created` or `add_user_to_all_companies`.
- Keep public signup disabled even if the previous application build is restored.
- Restore prior policies only through a reviewed migration and only during incident recovery.
- Restore a database backup only for demonstrated data corruption, after preserving incident evidence.
