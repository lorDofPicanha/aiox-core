# ENIAC Financeiro P0 hardening design

**Version:** 1.0
**Date:** 2026-06-30
**Author:** Orion (`@aios-master`)
**Status:** Approved — founder approval recorded; implementation in review

## 1. Purpose and boundaries

This design removes the security, integrity and reproducibility blockers found in the full audit without changing the visible product scope. It is a compatible hardening pass, not a new financial product or accounting rewrite.

### In scope

- repository reproducibility and environment contract;
- closed authentication and explicit company membership;
- constrained roles and RLS mutation permissions;
- auditable voiding of entries and scheduled items;
- transactional/idempotent scheduled payment posting;
- dependency patching and a minimum automated test harness;
- bootstrap and rollback documentation.

### Out of scope

- production deploy or applying migrations to a remote database;
- Open Finance lifecycle completion;
- LLM safety redesign;
- formal double-entry accounting;
- UI redesign, PWA or native app;
- invitations management UI. P0 uses an operator-controlled SQL/CLI bootstrap.

### Success criteria

1. An unknown email cannot create an account or obtain company access.
2. A viewer cannot mutate; an operator cannot manage memberships; no user crosses tenant boundaries.
3. A repeated/concurrent scheduled-post request produces exactly one entry.
4. Historical rows are never deleted by the application.
5. A clean repository contains all runtime source and schema migrations.

## 2. Options considered

| Option                              |  Speed | Risk reduction | Data migration risk | Long-term quality | Decision                                                |
| ----------------------------------- | -----: | -------------: | ------------------: | ----------------: | ------------------------------------------------------- |
| A. Incremental compatible migration | medium |           high |                 low |              high | **chosen**                                              |
| B. Minimal hardening only           |   high |         medium |                 low |               low | rejected: leaves destructive ledger and race conditions |
| C. Rewrite                          |    low |      uncertain |                high |  potentially high | rejected: unnecessary regression and schedule risk      |

Option A preserves every existing capability. The only intentional behavior changes are denying unauthorized signup/mutation and replacing deletion with voiding.

## 3. Current state and touch points

```text
Magic-link form
  -> signInWithOtp(shouldCreateUser=true)
  -> auth.users INSERT
  -> trigger add_user_to_all_companies
  -> member of all companies

Server actions
  -> Supabase client with caller JWT
  -> RLS checks membership only
  -> every member may SELECT/INSERT/UPDATE/DELETE

markScheduledPaid
  -> INSERT entries
  -> UPDATE scheduled
  (two commits; no idempotency)
```

Affected modules:

- `.gitignore` and app environment example;
- `src/lib/supabase/{client,server}.ts` and `supabase/migrations`;
- login action and auth callback;
- entry/scheduled server actions and list components;
- SQL functions, RLS policies and audit tables;
- package scripts/dependencies and new tests.

The current RLS membership model remains the isolation primitive. It is narrowed by role rather than replaced.

## 4. Target architecture

```text
Pre-provisioned Auth user
        │ magic link (creation disabled)
        ▼
Next.js server action ── requireUser ── validated input
        │
        ▼
Supabase/Postgres using caller JWT
  ├─ company_members(role: admin|operator|viewer)
  ├─ RLS tenant + role policies
  ├─ entries/scheduled with void metadata
  ├─ audit_events append-only
  └─ post_scheduled_payment() transactional RPC
```

Security boundaries:

1. Auth establishes identity, not authorization.
2. `company_members` grants explicit tenant scope and role.
3. Server actions validate shape and provide safe errors.
4. RLS is the final authorization boundary.
5. Critical multi-row mutations execute inside Postgres.

## 5. Identity and authorization model

### Account provisioning

- Change magic link to `shouldCreateUser: false`.
- Remove `on_auth_user_created` and `add_user_to_all_companies()` in migration `0003`.
- Existing memberships are preserved to avoid accidental lockout; the operator must review them before production.
- First admin is provisioned explicitly using a documented CLI/SQL procedure after the Auth user exists.
- P0 does not add service-role code to the web application.

### Roles

| Capability                      | viewer | operator | admin |
| ------------------------------- | :----: | :------: | :---: |
| Read companies/ledger/scheduled |  yes   |   yes    |  yes  |
| Create/update/void entries      |   no   |   yes    |  yes  |
| Create/update/void scheduled    |   no   |   yes    |  yes  |
| Manage bank connection metadata |   no   |   yes    |  yes  |
| Manage memberships              |   no   |    no    |  yes  |

Database constraint: `role in ('admin','operator','viewer')`. Existing `member` rows migrate to `operator`, preserving current functional access while making future grants explicit.

RLS helpers will be `security definer`, fixed `search_path`, minimal return values and no general execute permission. Policy recursion around `company_members` is avoided with a narrowly scoped membership helper.

## 6. Data model and migration

### `entries` additions

```yaml
voided_at: timestamptz | null
voided_by: uuid | null -> auth.users
void_reason: text | null, max 500 at application boundary
```

All balance/report functions filter `voided_at is null`. The application no longer issues `DELETE entries`.

### `scheduled` additions

```yaml
status: open | paid | void
voided_at: timestamptz | null
voided_by: uuid | null -> auth.users
void_reason: text | null
```

The existing `entry_id` becomes the idempotency anchor. A partial unique index on the generated entry reference provides a second barrier.

### `audit_events`

```yaml
id: uuid
company_id: uuid
actor_id: uuid
entity_type: entry | scheduled | membership | bank_connection
entity_id: uuid
action: created | updated | voided | paid | role_changed
metadata: jsonb # identifiers and changed field names; no secrets
created_at: timestamptz
```

- insert only through controlled functions/triggers;
- selectable by company admins initially;
- no application update/delete policy;
- audit metadata excludes full bank descriptions and credentials.

### Transactional posting RPC

`post_scheduled_payment(p_scheduled_id uuid, p_paid_at date)`:

1. authenticate caller and lock scheduled row `FOR UPDATE`;
2. verify caller has `operator|admin` membership;
3. if already paid with `entry_id`, return existing entry (idempotent success);
4. reject void/non-open or invalid date;
5. insert one entry with deterministic external reference `scheduled:<uuid>`;
6. update scheduled to paid and link entry;
7. append audit event;
8. return entry ID; any failure rolls back all steps.

The function has fixed `search_path`, explicit grants and cannot accept a company ID independent of the scheduled row.

### Migration sequence

1. Correct root ignore rule and version existing source/migrations without rewriting them.
2. Add `0003_security_integrity_hardening.sql` with additive columns/tables/helpers.
3. Backfill `member -> operator`.
4. Drop unsafe trigger/function.
5. Replace policies atomically inside the migration transaction.
6. Create RPC and aggregate functions filtering voids.
7. Add comments and grants/revokes.

No historical row is deleted or re-keyed.

## 7. Application behavior

- Login preserves the neutral “check your email” response for both known and unknown addresses to reduce account enumeration.
- Unknown emails do not receive an account; server logs must not contain the address or provider details.
- Delete actions become `voidEntry(id, reason)` and `voidScheduled(id, reason)`.
- Existing destructive buttons receive explicit “Anular” labels and confirmation. This is a behavior correction, not a visual redesign.
- Queries exclude void rows by default. Audit/history access is not added to the main UI in P0.
- Raw Supabase/database errors map to safe user messages; detailed errors remain server-side without financial payloads.

## 8. Configuration contract

No mutable security threshold is introduced. Roles and ledger invariants are schema constraints, not configuration. Existing provider endpoints and credentials remain environment variables.

`.env.example` will document:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`, `OPENAI_MODEL`
- `PLUGGY_CLIENT_ID`, `PLUGGY_CLIENT_SECRET`

`SUPABASE_SERVICE_ROLE_KEY` is removed unless a reviewed server-only use case is introduced. A runtime YAML loader is deliberately excluded: it would duplicate database security invariants and add failure modes without a mutable requirement.

## 9. Testing design

### Fast tests (required in every environment)

- Vitest for role/capability mapping, validation, safe redirect and pure financial utilities.
- Server action tests mock only network boundaries, not database authorization.
- Coverage target: 80% for new TypeScript and 100% for pure authorization rules.

### Database tests (authoritative)

Supabase local/pgTAP or SQL harness with at least:

1. unauthenticated access denied;
2. viewer reads own tenant but cannot mutate;
3. operator mutates own tenant but not memberships;
4. admin can manage own company memberships only;
5. every role is denied cross-company read/write;
6. duplicate/concurrent scheduled posting returns one entry;
7. voided entries disappear from balance/month totals;
8. audit rows cannot be changed/deleted by application users.

Mocked database tests do not satisfy these cases, per `.out-of-scope/mocked-database-tests.md`.

### Gates

```text
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
git check-ignore / git ls-files reproducibility assertions
```

Database tests may require Docker. If the runtime is unavailable, the story remains `In Review`, not `Done`, and the missing gate is reported explicitly.

## 10. Dependency update

- Update `next` and `eslint-config-next` together from 16.2.4 to the latest compatible security patch selected at implementation time.
- Avoid unrelated major upgrades.
- Commit lockfile changes and repeat audit/build.
- High or critical production vulnerabilities block completion.

## 11. Rollout and rollback

### Safe rollout

1. Export membership inventory and database backup.
2. Apply migration in local/staging Supabase.
3. Run RLS and idempotency tests with two users/two companies.
4. Verify existing legitimate users retain `operator` access.
5. Obtain founder approval before any production migration.
6. Apply during a short write freeze; run smoke/reconciliation.

### Rollback

- Application rollback can restore the prior build, but the old build must not be used after the unsafe signup trigger is removed unless signup remains disabled in Supabase settings.
- Schema rollback is forward-fix preferred. New nullable columns/tables remain harmless.
- Policies/functions can be restored from a separately reviewed rollback migration.
- Never recreate the global auto-membership trigger.
- Backup restoration is reserved for actual data corruption, not ordinary deploy rollback.

## 12. Risks and mitigations

| Risk                                    | Impact | Mitigation                                                   |
| --------------------------------------- | ------ | ------------------------------------------------------------ |
| legitimate user loses access            | high   | preserve existing memberships and inventory before migration |
| recursive/broken RLS locks everyone out | high   | helper functions + two-user local tests + staged rollout     |
| old app conflicts with new policies     | high   | compatible action changes deployed with migration window     |
| audit log leaks financial text          | medium | metadata allowlist; no full descriptions/secrets             |
| concurrency still duplicates            | high   | row lock + deterministic unique ref + repeat test            |
| local Supabase unavailable              | medium | do not claim Done; provide exact pending gate                |
| dependency patch changes behavior       | medium | paired packages, build and targeted tests                    |

## 13. Capability preservation

| Existing capability        | After P0                                    |
| -------------------------- | ------------------------------------------- |
| Magic-link login           | preserved for provisioned users             |
| Three-company selector     | preserved according to explicit memberships |
| Create/edit entries        | preserved for operator/admin                |
| Delete entries             | intentionally replaced by auditable void    |
| Scheduled payment          | preserved, now atomic/idempotent            |
| Import, reports, forecast  | preserved; void rows excluded               |
| Open Finance and assistant | unchanged, no expansion                     |

## 14. Validation and approval record

- Audit basis: `docs/projects/eniac-financeiro/research/06-auditoria-tech-research-comparativa.md`.
- Founder selected incremental migration on 2026-06-30.
- Architecture conclave: `20147a9c-61d6-4693-a33b-4e46a7406522`. Routing included off-domain experts, so it is supporting context rather than sole validation.
- Local spec review: scope, data preservation, auth boundary, rollback, test authority and capability preservation checked against the repository.
- Subagent spec review not run because delegation was not authorized for this task.

## 15. Open item before implementation

- Founder must approve this written specification.
- The first production administrator identity is intentionally not recorded in source control; it will be supplied only at the production bootstrap gate.
