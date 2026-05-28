# Noyce - PO validation and Phase 1/2 story slice

Data: 2026-05-23
Status: active execution queue
Owner: `@aios-master`
Consultations:

- `@po`: `a70d8c66-a957-4226-805e-63e45d3d0766`
- `@pm`: `5af45d73-9af2-4c98-a53e-d386aa3a17fd`
- `@architect`: `5e7b5174-ab29-4f9d-ad70-57f1d5849107`
- `@qa`: `63f82431-b4a7-43eb-97bb-ae5eabe38526`
- `@ux-design-expert`: `90952f0e-c6e7-415f-8507-3d42d000082b`
- `@aios-master`: `4fb3712e-9df6-4fa9-adb5-b61cd51e2649`
- `@cassie-kozyrkov`: `dbf22225-5f0c-4a29-a280-9a2e3e218391`
- `@qa` Fase 4: `ae3c74b7-c964-4f4a-ad56-2f5201e11db1`
- `@aios-master` data slice decision: `d3acbaff-ecd8-47a6-8eae-046669c87b8d`
- `@data-engineer`: `95882bab-4229-4e94-8108-2d7223812715`
- `@qa` data slice: `a34286c3-9158-40be-8ffe-54f077d84536`
- `@aios-master` Sprint 0 parity: `6f614982-f04a-4b6f-b222-45b6114ac610`
- `@data-engineer` Sprint 0 parity: `ae9b0d0b-0efc-43f2-9e62-22461726bd23`
- `@qa` Sprint 0 parity: `5c4b306d-df0f-4d77-8225-825ed0087da0`

## PO validation

Verdict: approved as backlog reference, with execution controls.

Required controls:

- Every executable story must keep one primary owner.
- Every story must list input files, expected output, validation command and blocking constraints.
- Human blockers must remain separate from technical blockers.
- Fase 2 cannot change architecture decisions from ADR-001.
- `@dev` only executes after `@architect` validates limits and `@qa` defines gates.
- No new agents, credentials, authenticated automation, production database, push or deploy.

## Immediate execution order

1. `@architect` validates technical limits for Fase 1/Fase 2. Status: done.
2. `@qa` formalizes gates for Fase 1/Fase 2. Status: done.
3. `@dev` fixes the executable baseline in `apps/noyce`. Status: no code edit required in this pass; files were already syntactically valid when inspected.
4. `@qa` verifies `test/typecheck/build`. Status: PASS.
5. `@aios-master` decides whether to proceed to UX operational surface. Status: done.
6. `@ux-design-expert` runs Fase 3 first iteration for the operational surface. Status: PASS.

## Execution results - 2026-05-23

Sprint 0 baseline:

- PASS: `node docs/projects/buscador-licitacoes/02-architecture/fixtures/validate-fixtures.mjs`
- PASS: `node docs/projects/buscador-licitacoes/02-architecture/scripts/sprint0-dry-run.mjs`
- Result: 7 source records, 7 candidates, 1 dedupe link, 7 analysis runs.

App baseline:

- PASS: `npm test`
- PASS: `npm run typecheck`
- PASS: `npm run build`
- Build note: Next.js emitted only the ESLint plugin configuration warning; production build completed successfully.

QA decision:

- Gate: PASS.
- Residual risk: authenticated portal automation, real credentials and external acts remain blocked until vault/security/legal/devops gates.
- Next required owner: `@aios-master` to decide whether Fase 3 needs another UX iteration or can advance to Fase 4.

Fase 3 first UX iteration:

- Implemented in `apps/noyce`: operational inbox styling, opportunity detail hierarchy, evidence separation, price references, competitor evidence and habilitation checklist.
- Added analysis filters for local triage: best-to-worst, worst-to-best, nearest deadline and city filter.
- PASS: `npm test`
- PASS: `npm run typecheck`
- PASS: `npm run build`
- PASS: local browser QA at `http://localhost:3100`
- PASS: Playwright desktop and mobile checks, including filter interaction and no horizontal overflow at 390px width.
- Build note: Next.js emitted only the ESLint plugin configuration warning; production build completed successfully.

Fase 4 first data/score iteration:

- Owner: `@cassie-kozyrkov`, delegated by `@aios-master`.
- Implemented deterministic score model `deterministic-v0` in `apps/noyce/lib/noyce-model.ts`.
- Opportunity score and confidence score are now calculated separately from fixture inputs.
- `analysisRun` records components, max values, reasons and blockers per opportunity.
- UI now exposes score components in the analysis panel instead of hiding the score formula.
- PASS: `npm test`
- PASS: `npm run typecheck`
- PASS: `npm run build`
- PASS: local browser QA at `http://localhost:3100`
- PASS: Playwright desktop/mobile checks, with no horizontal overflow at 390px width.
- QA residual risks: weights are deterministic but still heuristic; require future calibration with real ENIAC outcomes and legal/process review before any automated recommendation affects an external act.

Fase 4 data contract slice:

- Owner: `@data-engineer`, delegated by `@aios-master`.
- Added `exportAnalysisRuns()` and `validateAnalysisRunExport()` contract in `apps/noyce/lib/noyce-analysis-export.ts`.
- Added local JSON route `/analysis-runs.json` exporting fixture-based analysis runs with schema `noyce.analysis_run.v0`.
- Added automated contract test in `apps/noyce/tests/noyce-analysis-export.test.mjs`.
- PASS: `npm test`
- PASS: `npm run typecheck`
- PASS: `npm run build`
- PASS: browser validation at `http://localhost:3100/analysis-runs.json`, with `validation.ok=true`.
- QA residual risks: export currently covers the app fixture subset, not all Sprint 0 dry-run candidates; future alignment should map the full dry-run `analysis-runs.v0.json` into the same schema.

Fase 4 Sprint 0 parity slice:

- Owner: `@data-engineer`, delegated by `@aios-master`.
- `/api/analysis-runs` now returns app analysis runs plus `sprint0AnalysisRuns`.
- `sprint0AnalysisRuns` maps all 7 dry-run candidates into schema `noyce.analysis_run.v0`.
- Sources covered: `pncp`, `bll`, `bnc`, `pcp`, `comprasgov`, `sislog`, `candidate:portal-regional-fixture`.
- Validation fails if Sprint 0 export count is not 7 or if score, confidence, components or location/missing-data inputs are invalid.
- PASS: `npm test` with 5 tests.
- PASS: `npm run typecheck`
- PASS: `npm run build`
- PASS: browser validation at `http://localhost:3103/api/analysis-runs`, with `validation.ok=true`, `appCount=4`, `sprint0Count=7`.
- QA residual risks: Sprint 0 parity preserves the dry-run scoring output; it does not calibrate weights or authorize any real portal/credential/database use.

## Fase 1 - Consolidar nucleo Sprint 0

### NOYCE-S0-01 - Freeze Sprint 0 dry-run baseline

Owner: `@architect`

Council: `@data-engineer`, `@qa`, `@dev`

Objective:

Turn the successful fixture validation and dry-run into a stable baseline before app work continues.

Inputs:

- `docs/projects/buscador-licitacoes/02-architecture/fixtures/source-records.v0.json`
- `docs/projects/buscador-licitacoes/02-architecture/fixtures/canonical-candidates.v0.json`
- `docs/projects/buscador-licitacoes/02-architecture/fixtures/validate-fixtures.mjs`
- `docs/projects/buscador-licitacoes/02-architecture/scripts/sprint0-dry-run.mjs`
- `docs/projects/buscador-licitacoes/02-architecture/outputs/sprint0-dry-run/summary.v0.json`

Tasks:

- Re-run fixture validation.
- Re-run Sprint 0 dry-run.
- Confirm outputs match the expected baseline counts.
- Document that the baseline contains candidate source, conflict and missing field cases.

Acceptance criteria:

- Fixture validation reports 7 source records and 7 candidates.
- Dry-run reports 7 candidates, 1 dedupe link and 7 analysis runs.
- Summary has `fixturesValid=true`, `hasCandidateSource=true`, `hasConflict=true`, `hasMissingField=true`, `hasAuthenticatedAutomation=false`.

Validation commands:

```bash
node docs/projects/buscador-licitacoes/02-architecture/fixtures/validate-fixtures.mjs
node docs/projects/buscador-licitacoes/02-architecture/scripts/sprint0-dry-run.mjs
```

Blockers:

- Do not add real credentials.
- Do not access authenticated portals.
- Do not mutate production database.

### NOYCE-S0-02 - Confirm architecture invariants

Owner: `@architect`

Council: `@martin-fowler`, `@martin-kleppmann`, `@data-engineer`, `@qa`

Objective:

Ensure implementation work does not regress the equal-priority multi-source model.

Inputs:

- `docs/projects/buscador-licitacoes/02-architecture/ADR-001-equal-priority-multisource-canonical-model-22mai.md`
- `docs/projects/buscador-licitacoes/02-architecture/14-sprint0-schema-adapters-implementation-plan-22mai.md`
- `docs/projects/buscador-licitacoes/02-architecture/16-sprint0-normalization-dedupe-score-spec-23mai.md`
- `docs/projects/buscador-licitacoes/02-architecture/contracts/source-adapter.contract.ts`
- `docs/projects/buscador-licitacoes/02-architecture/sql/0001_noyce_equal_priority_canonical_schema.sql`

Tasks:

- Confirm no source is structurally primary.
- Confirm adapters emit `SourceRecord` and `CanonicalCandidate`.
- Confirm score and merge are outside adapters.
- Confirm source candidates remain first-class backlog inputs.
- Confirm tenant-scoped tables and evidence/confidence relationships remain protected by `org_id`/RLS assumptions.

Acceptance criteria:

- Architecture review lists the invariants to protect in Fase 2.
- Any app fix is explicitly limited to syntax/import/data wiring.
- No schema/model redesign is allowed inside Fase 2.

Validation command:

```bash
git -C D:\AIOS diff -- docs/projects/buscador-licitacoes/02-architecture
```

Blockers:

- If Fase 2 requires model changes, stop and return to `@architect`.

### NOYCE-S0-03 - QA baseline gate record

Owner: `@qa`

Council: `@stephen-hahn`, `@kent-c-dodds`, `@architect`

Objective:

Record a testable gate for the Sprint 0 baseline before app correction.

Inputs:

- Outputs from `NOYCE-S0-01`
- Architecture invariants from `NOYCE-S0-02`

Tasks:

- Define pass/fail criteria for fixtures, dry-run and Fase 2 app correction.
- Separate current known failures from expected failures.
- Mark typecheck/build failure as Fase 2 scope, not Sprint 0 data failure.

Acceptance criteria:

- QA gate names exact commands.
- QA gate names current failure files: `apps/noyce/app/layout.tsx`, `apps/noyce/lib/noyce-data.ts`.
- QA gate confirms no credential or automation test is required for Fase 2.

Validation command:

```bash
npm test
npm run typecheck
npm run build
```

Blockers:

- Do not hide typecheck/build failures as accepted risk.

## Fase 2 - Corrigir base executavel do app

### NOYCE-APP-01 - Fix syntax and imports

Owner: `@dev`

Council: `@qa`, `@architect`, `@frontend`

Objective:

Restore the Next.js app to a compilable baseline without adding new product surface.

Inputs:

- `apps/noyce/app/layout.tsx`
- `apps/noyce/lib/noyce-data.ts`
- `apps/noyce/package.json`

Tasks:

- Fix malformed imports in `layout.tsx`.
- Fix malformed string literals/data literals in `noyce-data.ts`.
- Preserve existing app structure.
- Avoid feature work.

Acceptance criteria:

- TypeScript parses `layout.tsx`.
- TypeScript parses `noyce-data.ts`.
- No new dependency is introduced unless `@architect` approves.

Validation command:

```bash
npm run typecheck
```

Blockers:

- Do not change domain model to make syntax easier.

### NOYCE-APP-02 - Validate data wiring against Sprint 0 outputs

Owner: `@dev`

Council: `@data-engineer`, `@qa`, `@architect`

Objective:

Ensure `apps/noyce` uses fixture/dry-run shaped data and does not rely on real credentials.

Inputs:

- `apps/noyce/lib/noyce-data.ts`
- `apps/noyce/lib/noyce-model.ts`
- `docs/projects/buscador-licitacoes/02-architecture/outputs/sprint0-dry-run/summary.v0.json`

Tasks:

- Confirm fields displayed by the app map to fixture/dry-run concepts.
- Keep portal access statuses as dry-run/public/pending-vault states.
- Avoid any live portal call.

Acceptance criteria:

- App data includes no token, cookie, password, certificate or real login.
- App preserves evidence/confidence/separation language.
- Portal matrix communicates vault dependency.

Validation commands:

```bash
npm test
npm run typecheck
```

Blockers:

- Do not connect to Supabase or portal APIs in this phase.

### NOYCE-APP-03 - Restore green local gates

Owner: `@qa`

Council: `@dev`, `@architect`, `@devops`

Objective:

Prove the app baseline is executable before UX expansion.

Inputs:

- `apps/noyce/package.json`
- `apps/noyce/tests/`
- Fase 2 fixes

Tasks:

- Run local tests.
- Run TypeScript typecheck.
- Run production build.
- Record any residual risk.

Acceptance criteria:

- `npm test` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- No push/deploy is performed.

Validation commands:

```bash
npm test
npm run typecheck
npm run build
```

## Fase 5 execution result - 2026-05-28

Owner sequence:

- Orchestration: `@aios-master`
- Legal/process owner: `@joel-de-menezes-niebuhr`
- Implementation: `@dev`
- Gate: `@qa`

Result:

- PASS: `NOYCE-LEGAL-01 - Legal/process fixture model`.
- Implemented fixture-only domain model and UI panel for habilitation, process windows, decision points, appeal intent and appeal reasons.
- External acts remain blocked by default.
- Appeal intent remains structurally separate from appeal reasons.
- No credentials, authenticated portal access, production database, push or deploy.

Validation evidence:

- PASS: `node docs/projects/buscador-licitacoes/02-architecture/fixtures/validate-fixtures.mjs`
- PASS: `node docs/projects/buscador-licitacoes/02-architecture/scripts/sprint0-dry-run.mjs`
- PASS: `npm test` in `apps/noyce` with 8 tests.
- PASS: `npm run typecheck` in `apps/noyce`.
- PASS: `npm run build` in `apps/noyce`.
- PASS: Browser QA at `http://localhost:3100`, mobile 390px without horizontal overflow.

Next agent:

`@aios-master` should route the next slice to either `@cyber-chief` for Fase 7 security/vault preparation or `@data-engineer` for Fase 8 public/manual adapters. Authenticated automation remains blocked.

## Fases 6-11 offline execution result - 2026-05-28

Owner sequence:

- Fase 6: `@pm`
- Fase 7: `@cyber-chief`
- Fase 8: `@data-engineer`
- Fase 9: `@devops`
- Fase 10: `@aios-master`
- Fase 11: `@devops`

Result:

- PASS offline: execution pack `20-fases6-10-execution-pack-28mai.md`.
- PASS app readiness: `/api/readiness` exposes `validation.ok=true`.
- PASS UI readiness: dashboard shows offline phase status, tomorrow blockers and dry-run jobs.
- BLOCKED human: ENIAC CNPJ/roles, vault mechanism, portal ToS review, production DB approval and permission for first real PNCP dry-run.
- BLOCKED production: Fase 11 requires QA/security/devops/founder go/no-go.

Validation evidence:

- PASS: `npm test` in `apps/noyce` with readiness tests.
- PASS: `npm run typecheck` in `apps/noyce`.
- PASS: `npm run build` in `apps/noyce`.

Blockers:

- Push remains `@devops` only.
- Production deployment remains blocked.

## Next delegation

Current next agent: `@dev`.

Instruction:

Implement `NOYCE-LEGAL-01 - Legal/process fixture model` from `19-fase5-legal-process-model-28mai.md`.

Decision:

- Fase 5 legal/process modeling selected on 2026-05-28.
- Score calibration with real outcomes remains later because ENIAC outcomes are not available yet.
- External acts, authenticated portal automation, credentials, real document vault, push and deploy remain blocked.

Required output:

- TypeScript domain types for habilitation requirements/documents, process events, decision points, appeal intent and appeal reasons.
- Fixture-only data in `apps/noyce`.
- UI panel showing legal/process status with external acts blocked by default.
- Tests proving appeal intent is separate from appeal reasons and external acts cannot be treated as automated.

Validation commands:

```bash
npm test
npm run typecheck
npm run build
```
