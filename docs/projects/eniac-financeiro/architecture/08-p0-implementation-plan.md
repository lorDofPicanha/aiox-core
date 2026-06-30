# ENIAC P0 implementation plan

**Story:** `ENIAC-P0-01`
**Design:** `docs/superpowers/specs/2026-06-30-eniac-p0-hardening-design.md`
**Date:** 2026-06-30

## Sequence

1. Make Supabase source and migrations visible to Git; complete the environment contract.
2. Add a fast Vitest harness and pure tests for safe redirects and authorization capability rules.
3. Add migration `0003` with explicit roles, RLS, void metadata, audit events and transactional posting RPC.
4. Close account creation and sanitize authentication redirects/errors.
5. Replace application deletes with void actions and replace scheduled posting with the RPC.
6. Exclude void rows from queries/aggregates and adjust the minimum UI labels/confirmation.
7. Patch Next.js, run dependency audit, lint, typecheck, tests and production build.
8. Run local Supabase database tests if Docker/runtime is available; otherwise keep the story in review and record the blocked gate.

## Rollback checkpoints

- Before migration: repository-only changes can be reverted independently.
- Migration is additive and preserves old rows; forward-fix policies/functions instead of dropping new audit data.
- Never restore the global auto-membership trigger.
- No remote database or production deployment is part of this plan.

## Review boundaries

- No Open Finance or LLM expansion.
- No broad package upgrades.
- No unrelated cleanup in the dirty worktree.
