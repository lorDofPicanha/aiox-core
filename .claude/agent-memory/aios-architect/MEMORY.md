# Architect Agent Memory

## EPIC-ACT Wave 2 Quality Gate Review (2026-02-06)
- Reviewed: ACT-6 (Unified Activation Pipeline, 67 tests, APPROVED)
- Total EPIC-ACT: 255 tests pass across 4 test suites (0 regressions)
- UnifiedActivationPipeline: single entry point, 5-way parallel load, 3-phase sequential, GreetingBuilder final
- Timeout architecture: 150ms per-loader, 200ms total pipeline, fallback greeting on failure
- Timer leak concern: _timeoutFallback setTimeout not cancelled when pipeline wins the race (advisory, not blocking)
- generate-greeting.js refactored to thin wrapper; backward compatible
- All 12 agent .md files updated with unified STEP 3 reference
- *validate-agents command added to aios-master (validate-agents.md task file)

## EPIC-ACT Wave 1 Quality Gate Review (2026-02-06)
- Reviewed: ACT-1 (config fix, merged), ACT-2 (user_profile audit, 31 tests), ACT-3 (ProjectStatusLoader, 90 tests), ACT-4 (PermissionMode, 67 tests)
- All 188 tests pass across 3 test suites
- Key patterns: fingerprint-based cache invalidation, file locking with wx flag, mode cycling (ask>auto>explore)
- PermissionMode reads from `.aios/config.yaml`, NOT from `.aios-core/core-config.yaml` - different config hierarchy
- GreetingPreferenceManager reads from `.aios-core/core-config.yaml` (agentIdentity.greeting.preference)
- The *yolo command cycles PermissionMode; it does NOT directly change greeting preference

## Architecture Patterns to Track
- Agent activation: UnifiedActivationPipeline is now THE single entry point for all 12 agents (ACT-6)
- Previous two paths (Direct 9 agents + CLI wrapper 3 agents) are now unified
- generate-greeting.js is thin wrapper around UnifiedActivationPipeline (backward compat)
- user_profile cascades: config-resolver > validate-user-profile > greeting-preference-manager > greeting-builder
- Permission system: permission-mode.js + operation-guard.js + index.js (facade)
- ProjectStatusLoader: .aios/project-status.yaml (runtime cache), separate from .aios-core/ (framework config)
- PM agent bypasses bob mode restriction in _resolvePreference()

## Key File Locations
- Unified Pipeline: `.aios-core/development/scripts/unified-activation-pipeline.js`
- Permissions: `.aios-core/core/permissions/`
- Greeting system: `.aios-core/development/scripts/greeting-builder.js`, `greeting-preference-manager.js`
- Project status: `.aios-core/infrastructure/scripts/project-status-loader.js`
- User profile validation: `.aios-core/infrastructure/scripts/validate-user-profile.js`
- Post-commit hook: `.aios-core/infrastructure/scripts/git-hooks/post-commit.js` + `.husky/post-commit`
- Validate agents task: `.aios-core/development/tasks/validate-agents.md`

## Pre-existing Test Failures (not EPIC-ACT related)
- squads/mmos-squad/ (6 suites): missing clickup module
- tests/core/orchestration/ (2 suites): greenfield-handler, terminal-spawner

## Project memory pointers
- [Anipis V3 Landing IA (06/Mai/2026)](project_anipis_v3_landing_ia.md) — greenfield IA locked: single-page editorial, 6 sections + crisis sliver, atoms V3 only, MVP default theme
- [HYDRA Brownfield + Architecture (11/Mai/2026)](project_hydra_brownfield.md) — Resilience Sprint full architect phase: analysis (828 LOC) + PRD v0.5 (11 stories) + architecture.md (1055 LOC) + 3 ADRs (streaming/vector/observability, 616 LOC). Conclave 3/3 (fowler/vogels/majors) on key decisions. Ready for @po validation.
- [HYDRA ADR-004 Consumption Side (12/Mai/2026)](project_hydra_adr004_consumption.md) — Post-validation bug fix: Story 1.12 (consumption side). ADR-004 (279 LOC, no conclave — user-approved params), architecture.md §10A (+207 LOC), C-10 audit (199 LOC). Field rename decision: `feedEntries` (new) + `relevantMemory` (legacy preserved) — zero break. Resolves PO concerns C-07/C-08/C-09/C-10 + risks RA-6/RA-7/RA-8/RA-9.
- [CRM Novo Architecture Research (15/Mai/2026)](project_crm_novo_architecture_research.md) — Greenfield CRM Tocks/Bretda/Vorza. 3 ADRs core: RLS shared-schema + WhatsApp Cloud API direto + conversion outbox event_id UUID v5 determinístico. Supabase Pro $25/mo sa-east-1, pg-boss workers, Realtime broadcast. 5 ADRs pendentes. Anti-KR smoke tests obrigatórios.
