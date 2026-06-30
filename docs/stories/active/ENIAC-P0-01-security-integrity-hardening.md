# ENIAC-P0-01: Security, integrity and reproducibility hardening

## Status: In Review

## Description

Remove the blockers identified by the ENIAC Financeiro audit before any pilot with real financial data. The change preserves the current product surface while making access explicit, mutations auditable, payment posting atomic and the repository reproducible from a clean clone.

## Acceptance Criteria

- [x] AC1: A clean clone contains the Supabase clients and every migration required to build and recreate the database.
- [x] AC2: Public magic-link requests cannot create users, and a newly created Auth user receives no company membership automatically.
- [ ] AC3: Membership roles are constrained to `admin`, `operator` and `viewer`; RLS prevents viewers from mutating and prevents every cross-company read/write.
- [ ] AC4: Existing entries and scheduled records remain readable after migration; destructive UI actions become auditable void operations.
- [ ] AC5: Posting a scheduled item is one transactional, idempotent database operation and cannot create duplicate entries.
- [x] AC6: Next.js and its matching config package are updated to a non-vulnerable compatible patch and production audit has no high/critical finding.
- [x] AC7: Automated tests cover authorization helpers/business rules; database tests cover role and tenant isolation when a local Supabase runtime is available.
- [ ] AC8: Lint, typecheck, tests, production build and clean-clone/repository checks pass.
- [x] AC9: Rollback and operator bootstrap instructions are documented without secrets.

## Technical Notes

- Approved approach: incremental compatible migration; no rewrite and no deletion of historical financial rows.
- Design source: `docs/superpowers/specs/2026-06-30-eniac-p0-hardening-design.md`.
- Architecture conclave: `20147a9c-61d6-4693-a33b-4e46a7406522`; expert routing was partially off-domain, so only applicable principles were retained and all structural claims were checked against the repository.
- Open Finance and LLM functionality are not expanded in this story.
- No production migration or deploy is authorized by this story.

## File List

- `docs/stories/active/ENIAC-P0-01-security-integrity-hardening.md` — story governance.
- `docs/superpowers/specs/2026-06-30-eniac-p0-hardening-design.md` — founder-approved architecture design.
- `docs/projects/eniac-financeiro/architecture/08-p0-implementation-plan.md` — implementation sequence and boundaries.
- `docs/projects/eniac-financeiro/operations/09-p0-bootstrap-rollback.md` — bootstrap, smoke and rollback runbook.
- `.gitignore` — scopes the root Supabase ignore so application source/migrations are versionable.
- `apps/eniac-financeiro/.env.example` — complete public environment contract without service-role placeholder.
- `apps/eniac-financeiro/package.json` — Next patch, test scripts and local database tooling.
- `apps/eniac-financeiro/package-lock.json` — locked dependency graph.
- `apps/eniac-financeiro/vitest.config.ts` — test alias/runtime configuration.
- `apps/eniac-financeiro/src/lib/auth/authorization.ts` — explicit role capability model.
- `apps/eniac-financeiro/src/lib/auth/authorization.test.ts` — role capability tests.
- `apps/eniac-financeiro/src/lib/auth/redirect.ts` — same-origin redirect allowlist.
- `apps/eniac-financeiro/src/lib/auth/redirect.test.ts` — redirect security tests.
- `apps/eniac-financeiro/src/lib/supabase/client.ts` — versioned browser client.
- `apps/eniac-financeiro/src/lib/supabase/server.ts` — versioned server client.
- `apps/eniac-financeiro/src/app/login/actions.ts` — closed account creation and neutral response.
- `apps/eniac-financeiro/src/app/auth/callback/route.ts` — safe redirect and sanitized errors.
- `apps/eniac-financeiro/src/app/actions.ts` — entry void RPC action.
- `apps/eniac-financeiro/src/app/(app)/vencimentos/actions.ts` — atomic posting and scheduled void RPC actions.
- `apps/eniac-financeiro/src/app/(app)/importar/actions.ts` — sanitized financial errors.
- `apps/eniac-financeiro/src/app/(app)/conexoes/actions.ts` — explicit auth and sanitized provider errors.
- `apps/eniac-financeiro/src/components/entry-list.tsx` — auditable void interaction.
- `apps/eniac-financeiro/src/components/scheduled-manager.tsx` — scheduled void interaction.
- `apps/eniac-financeiro/src/lib/data.ts` — excludes voided entries.
- `apps/eniac-financeiro/src/lib/scheduled.ts` — closed-state typing.
- `apps/eniac-financeiro/supabase/config.toml` — reproducible local Supabase/Auth config.
- `apps/eniac-financeiro/supabase/.gitignore` — local Supabase transient files only.
- `apps/eniac-financeiro/supabase/migrations/0001_init.sql` — versioned baseline schema.
- `apps/eniac-financeiro/supabase/migrations/0002_fase2.sql` — versioned phase-2 schema.
- `apps/eniac-financeiro/supabase/migrations/0003_security_integrity_hardening.sql` — P0 roles, RLS, audit, void and RPCs.
- `apps/eniac-financeiro/supabase/tests/0003_security_integrity_test.sql` — real database/RLS contract tests.

## Dependencies

- `docs/projects/eniac-financeiro/research/06-auditoria-tech-research-comparativa.md`
- Supabase CLI/local Docker for database integration tests.
- Human confirmation of the first administrator email before production bootstrap.

## Validation Record

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm test`: PASS, 12 tests.
- `npm run build`: PASS on Next.js 16.2.9.
- `npm audit --omit=dev`: 0 high, 0 critical, 2 moderate transitive findings.
- Supabase database tests: BLOCKED locally because Docker is not installed; SQL tests are authored but unexecuted.

## Definition of Done

- [ ] All AC checked
- [ ] Tests passing
- [x] Lint clean
- [x] Typecheck clean
- [x] Production build clean
- [ ] Security review complete
- [x] File List complete
- [x] Documentation updated
