# Story CODEX-AGENTS-NOT-SKILLS: Separate Codex Agents From Skills

## Meta
- **Epic:** Claude-to-Codex Migration
- **Priority:** Critical
- **Status:** Done
- **Created:** 2026-05-27
- **Agent:** @aios-master

## Context

Codex integration generated `aios-*` agent activators as `.codex/skills/*/SKILL.md`. That flattened the AIOS model because agents carry authority, commands, workflows, gates, and dependencies, while skills are reusable capabilities.

## Objective

Restore the boundary:

- agents live in `.aios-core/development/agents/` and `.codex/agents/`
- skills live in `.codex/skills/` only when they are reusable capabilities
- validators must reject generated `aios-*` agent activators in skills

## Acceptance Criteria

- [x] `sync:skills:codex` no longer generates `aios-*` agent activator skills
- [x] `validate:codex-skills` fails when an AIOS agent activator is present as a skill
- [x] `validate:codex-integration` delegates skills validation to the new rule
- [x] `validate:paths` no longer requires agent source paths inside skills
- [x] Existing generated `.codex/skills/aios-*` activators are removed, preserving `aios-memory`
- [x] Codex docs instruct agent activation through `AGENTS.md` and `.codex/agents`, not `/skills`
- [x] Focused tests cover sync and validation behavior
- [x] Claude and Codex agent surfaces validate with 201/201 synced agents, 0 missing, 0 drift, 0 orphaned
- [x] Canonical agent architecture validation has 0 errors and 0 warnings
- [x] Canonical agents declare explicit `agent.class` (`operational` or `consultation`)
- [x] `autoClaude` is required only for operational agents, fail-closed on missing/unknown class

## Validation

- [x] `npm test -- codex-skills`
- [x] `npm run validate:codex-skills`
- [x] `npm run validate:codex-integration`
- [x] `npm run validate:paths`
- [x] `npm run validate:parity`
- [x] `npm run validate:agents`
- [x] `npm run validate:claude-sync`
- [x] `npm run validate:codex-sync`
- [x] `npm run sync:ide`
- [x] `npm run sync:ide:check`
- [x] `npm run typecheck`
- [x] `npx eslint --no-ignore ...focused files...`
- [ ] `npm run lint` passes globally
- [ ] `npm test` passes globally

## Notes

`validate:agents` now passes with 0 errors and 0 warnings. The 295 previous warnings were resolved by adding explicit agent classes, making `autoClaude` conditional to operational agents, resolving real dependency paths, removing aspirational missing dependencies from consultation agents, and correcting stale operational dependency references without creating stubs. Global `npm run lint` and global `npm test` remain tracked as pre-existing repo-wide gates; focused lint/tests for this change pass.

## File List

- `.aios-core/infrastructure/scripts/codex-skills-sync/index.js`
- `.aios-core/infrastructure/scripts/codex-skills-sync/validate.js`
- `.aios-core/infrastructure/scripts/validate-codex-integration.js`
- `.aios-core/infrastructure/scripts/validate-paths.js`
- `.aios-core/infrastructure/scripts/validate-agents.js`
- `.aios-core/infrastructure/scripts/migrate-agent.js`
- `.aios-core/infrastructure/scripts/component-generator.js`
- `.aios-core/infrastructure/scripts/template-validator.js`
- `.aios-core/development/scripts/template-validator.js`
- `.aios-core/development/scripts/squad/squad-extender.js`
- `.aios-core/development/templates/squad/agent-template.md`
- `.aios-core/product/templates/agent-template.yaml`
- `.aios-core/development/agents/*.md`
- `.aios-core/infrastructure/scripts/ide-sync/README.md`
- `.aios-core/product/templates/ide-rules/codex-rules.md`
- `.codex/skills/aios-*/SKILL.md` (removed generated agent activators)
- `AGENTS.md`
- `docs/codex-integration-process.md`
- `docs/ide-integration.md`
- `docs/pt/ide-integration.md`
- `docs/es/ide-integration.md`
- `docs/getting-started.md`
- `docs/aios-expert-pool-model-orion-22mai.md`
- `docs/aiox-structure-orion-22mai.md`
- `tests/integration/codex-skills-sync.test.js`
- `tests/unit/codex-skills-validate.test.js`
- `tests/unit/validate-agents-class.test.js`
