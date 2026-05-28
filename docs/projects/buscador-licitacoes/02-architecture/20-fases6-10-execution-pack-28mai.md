# Noyce - Fases 6-10 execution pack

Data: 2026-05-28
Status: offline execution complete; human-gated items queued for morning
Orchestration: `@aios-master`
Council/conclave: `78abaf54-5035-43b1-ab41-979508a835e1`

Owners:

- Fase 6 onboarding ENIAC: `@pm` + onboarding/customer success council
- Fase 7 security/LGPD/ToS/vault: `@cyber-chief`
- Fase 8 adapters/ingestion: `@data-engineer`
- Fase 9 jobs/observability: `@devops`
- Fase 10 pilot: `@aios-master` + `@pm` + `@qa`

## Guardrails

Allowed now:

- fixture-only data;
- public/dry-run adapter preparation;
- manual import shape;
- readiness report;
- pilot script and success criteria;
- tests/build/browser validation.

Blocked until human approval:

- credentials, tokens, cookies, certificates;
- authenticated portals;
- real document vault;
- production database writes;
- external notifications/messages;
- bid, appeal intent, appeal reasons, protocol, signature;
- push/deploy.

## Fase 6 - Onboarding ENIAC

Owner: `@pm`

Offline deliverable complete:

- Morning blocker list is encoded in `apps/noyce/lib/noyce-readiness.ts`.
- Required inputs are separated from technical work.
- Pilot success signals are defined before collecting credentials.

Human inputs for morning:

1. CNPJ and legal name.
2. Users and roles: operator, reviewer, legal reviewer, owner/approver.
3. Sources actually used and frequency: PNCP, PCP, BLL, BNC, ComprasGov, SISLOG, others.
4. URLs, access type, 2FA, certificate requirement. No secrets in chat/docs/git.
5. First pilot success criterion: what must be true for ENIAC to say "this saves time".

Gate:

- PASS offline.
- BLOCKED real onboarding until ENIAC provides non-secret metadata and vault path exists.

## Fase 7 - Security, LGPD, ToS and vault

Owner: `@cyber-chief`

Offline deliverable complete:

- Source governance matrix created in `sourceGovernance`.
- All non-public/authenticated automation is `blocked_until_vault`.
- ToS review is `pending_review` for private/authenticated portals.
- Secret handling rule is explicit: no secret in docs/chat/git/logs.

Legal/privacy reference baseline:

- LGPD official text: `https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm`
- Lei 14.133 official text: `https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm`
- Decreto 10.024 official text: `https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/decreto/d10024.htm`

Morning blockers:

- Select vault mechanism.
- Confirm who may enter credentials.
- Confirm ToS/legal review owner.
- Confirm audit log retention and redaction policy.

Gate:

- PASS offline.
- BLOCKED authenticated automation.

## Fase 8 - Adapters and ingestion

Owner: `@data-engineer`

Offline deliverable complete:

- Adapter readiness modeled per source.
- PNCP is the only source marked as public dry-run capable.
- PCP/BLL/BNC/ComprasGov/SISLOG are manual-import ready but automation-blocked.
- Candidate portal remains fixture/backlog only.

Implementation:

- `apps/noyce/lib/noyce-readiness.ts`
- `apps/noyce/app/api/readiness/route.ts`
- `apps/noyce/tests/noyce-readiness.test.mjs`

Gate:

- PASS dry-run/manual-import model.
- BLOCKED live adapters for authenticated portals.

## Fase 9 - Jobs and observability

Owner: `@devops`

Offline deliverable complete:

- Dry-run jobs defined:
  - `discover-public-fixtures`
  - `normalize-score`
  - `deadline-watch`
- Each job has idempotency key, read set, write set and blocked external effects.
- Readiness endpoint exposes job plan at `/api/readiness`.

Gate:

- PASS dry-run job plan.
- BLOCKED scheduler/prod DB/alerts until DevOps approval.

## Fase 10 - Pilot readiness

Owner: `@aios-master`

Offline deliverable complete:

- Pilot steps are encoded in readiness report.
- Allowed now:
  - read fixture inbox;
  - review evidence/lacunas;
  - measure if user understands the next movement.
- Blocked:
  - collect credentials via vault;
  - run real source;
  - any external act.

Gate:

- PASS offline pilot readiness.
- BLOCKED real pilot until morning inputs and Fase 7 gates.

## Validation result - 2026-05-28

- PASS: `node docs/projects/buscador-licitacoes/02-architecture/fixtures/validate-fixtures.mjs`
- PASS: `node docs/projects/buscador-licitacoes/02-architecture/scripts/sprint0-dry-run.mjs`
- PASS: `npm test` in `apps/noyce`
- PASS: `npm run typecheck` in `apps/noyce`
- PASS: `npm run build` in `apps/noyce`
- PASS: `/api/readiness` has `validation.ok=true`

## Fase 11 handoff

Production control is split into `21-fase11-production-control-gate-28mai.md`.

Status:

- gate prepared;
- production blocked;
- no push/deploy/tag/prod DB write performed.

## Morning packet for Founder/ENIAC

Ask only these:

1. ENIAC CNPJ and legal name.
2. Who are the users and who can approve external acts?
3. Which portals matter first this week?
4. Who will enter credentials into the vault?
5. Do we have permission to use PNCP public data for the first real dry-run?
6. Who signs off ToS/legal risk for each private portal?
