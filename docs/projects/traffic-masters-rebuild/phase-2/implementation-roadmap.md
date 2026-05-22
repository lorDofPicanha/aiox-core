# Implementation Roadmap — Phases 3-5

**Source:** Phase 1 + Phase 2 deliverables
**Constraint:** No git push (devops authority), no MCP write ops during build, story-driven (each sprint has its own story in `docs/stories/active/`)

---

## Sprint 1 — Google Ads + Brazil Foundation (Priority #1 + #2)

**Duration estimate:** 6-9 hours of focused build (single agent), or 2-3 hours with parallel subagents

### Files to Create

#### Agents (3 files)
1. `squads/traffic-masters/agents/kasim-aslam.md` — full persona using template + `phase-1/specialist-research/kasim-aslam.md`
2. `squads/traffic-masters/agents/pedro-sobral.md` — full persona using template + `phase-1/specialist-research/pedro-sobral.md`
3. `squads/traffic-masters/agents/molly-pittman.md` — Tier 0 persona (needed for diagnose)

#### Tasks (10 files)
4. `tasks/account-audit.md` — Tier 0 audit task
5. `tasks/google-campaign.md` — generic Google campaign creation (PAUSED first)
6. `tasks/google-search.md` — Search-specific
7. `tasks/google-pmax.md` — PMAX with 30+ conv prereq enforcement
8. `tasks/google-bidding-strategy-migration.md` — Manual CPC → Smart Bidding 21d gate
9. `tasks/brazil-strategy.md` — BR-specific strategy
10. `tasks/metodologia-abc.md` — ABC structure setup
11. `tasks/operacao-diaria.md` — daily routine task
12. `tasks/account-onboarding-google.md` — new Google account safe setup
13. `tasks/gtm-tag-validation.md` — validate GTM tags fire real events

#### Data (4 files)
14. `data/traffic-kb.md` — domain KB skeleton
15. `data/gotchas-traffic.json` — 12+ encoded gotchas from F1-F10
16. `data/brazil-attribution-patterns.md` — BR attribution learnings
17. `data/account-playbooks/bretda.md` — first account playbook

#### Checklists (3 files)
18. `checklists/pre-launch-google.md`
19. `checklists/oauth-freshness.md`
20. `checklists/budget-jump-safe.md`

#### Workflows (2 files)
21. `workflows/account-audit.yaml`
22. `workflows/new-google-campaign.yaml`

### Sprint 1 Dependencies
- Read access to `mcp-ads-bridge` to verify exact tool names (Phase 3 first task)
- Confirm `docs/projects/{account}/00-context/CONTEXT.md` files exist or need creation
- Story `traffic-masters-rebuild-sprint-1.md` in `docs/stories/active/`

### Sprint 1 Validation Criteria
- [ ] @kasim-aslam invoked via Task can run `account-audit` for Bretda Google account in <5min
- [ ] `metodologia-abc.md` produces valid ABC structure for KR account (PAUSED, not enabled)
- [ ] Pre-launch Google checklist blocks at least 3 of the F1-F10 patterns when violated
- [ ] `gotchas-traffic.json` parsed without error by `Read` tool

---

## Sprint 2 — Meta Ads (Priority #3)

**Duration estimate:** 7-10 hours single-agent, 3-4 hours parallel

### Files to Create

#### Agents (3 files)
23. `squads/traffic-masters/agents/depesh-mandalia.md`
24. `squads/traffic-masters/agents/nicholas-kusmich.md`
25. `squads/traffic-masters/agents/traffic-masters-chief.md` — canonical persona file in squad (separate from `.claude/agents/` activator)

#### Tasks (10 files)
26. `tasks/meta-campaign.md` — generic Meta campaign
27. `tasks/meta-ecommerce.md` — DTC ecommerce specific
28. `tasks/meta-leadgen.md` — generic lead gen
29. `tasks/meta-instant-form-vs-lp.md` — decision tree + `meta_ads_destination_type_check`
30. `tasks/meta-capi-deploy.md` — CAPI deploy with handoff @aios-dev
31. `tasks/bpm-setup.md` — BPM Method execution
32. `tasks/account-onboarding-meta.md` — KR-style new BM safe setup
33. `tasks/traffic-engine-setup.md` — Molly's 9-step
34. `tasks/traffic-strategy.md` — strategic doc generation
35. `tasks/sales-feedback-loop.md` — sales feedback spreadsheet creation

#### Data (4 files)
36. `data/account-playbooks/tocks.md`
37. `data/account-playbooks/kr.md`
38. `data/account-playbooks/vorza.md`
39. `data/account-playbooks/low-ticket-10k.md`

#### Checklists (4 files)
40. `checklists/pre-launch-meta.md`
41. `checklists/pixel-capi-validation.md`
42. `checklists/ctm-whatsapp-smoke-test.md`
43. `checklists/creative-fatigue-detection.md`

#### Workflows (2 files)
44. `workflows/new-meta-campaign.yaml`
45. `workflows/creative-iteration.yaml`

### Sprint 2 Dependencies
- Sprint 1 complete (chief skeleton + Tier 0)
- KR `CONTEXT.md` updated with WhatsApp wrong number warning (F5)
- `meta_ads_destination_type_check` tool confirmed working

### Sprint 2 Validation Criteria
- [ ] @nicholas-kusmich can produce KR ABC + Pre-Frame plan in <10min
- [ ] `meta-instant-form-vs-lp.md` decision tree matches user's 12/Mai correction (forces LP form for Bretda after destination_type validate)
- [ ] CTM smoke test checklist enforces manual validation step
- [ ] All 5 account playbooks complete

---

## Sprint 3 — Strategy + Scaling + YouTube (Priority #4)

**Duration estimate:** 5-7 hours single-agent, 2-3 hours parallel

### Files to Create

#### Agents (2 files)
46. `squads/traffic-masters/agents/ralph-burns.md`
47. `squads/traffic-masters/agents/tom-breeze.md`

#### Tasks (5 files)
48. `tasks/scaling-strategy.md` — vertical/horizontal/diagonal
49. `tasks/creative-optimization.md` — single creative optimization
50. `tasks/creative-lab.md` — Creative Lab 7-step pipeline
51. `tasks/creative-fallback.md` — resurrect winner pattern
52. `tasks/youtube-campaign.md`
53. `tasks/youtube-script.md` — ADUCATE framework

#### Data (1 file)
54. `data/specialist-matrix.md` — full specialist × framework × application matrix

#### Workflows (1 file)
55. `workflows/scaling-decision.yaml`

#### Checklists (1 file)
56. `checklists/post-launch-d1-d3-d7.md`

### Sprint 3 Validation Criteria
- [ ] @ralph-burns can run DPI² calculation on Bretda CJ8v2 baseline
- [ ] `creative-fallback.md` correctly identifies AD03+AD04 as Bretda fallback candidates
- [ ] @tom-breeze can produce ADUCATE script for Tocks móveis luxo

---

## Phase 4 — Chief Upgrade (Rewrite `.claude/agents/traffic-masters-chief.md`)

**Duration estimate:** 3-4 hours

### Steps
1. Create canonical persona file: `D:\AIOS\.claude\commands\traffic-masters\agents\traffic-masters-chief.md` (resolves Section 1 path)
2. Rewrite `D:\AIOS\.claude\agents\traffic-masters-chief.md` per `chief-upgrade-spec.md`:
   - Fix YAML (add Task tool)
   - Fix all paths
   - Add NEW sections (MCP Tooling Map, Pre/Post-Action, Account Loader, Crisis, Quality Gates, Multi-Specialist Workflows)
   - Expand Constraints with F1-F10 anti-patterns
3. Create supporting data files:
   - `squads/traffic-masters/data/mcp-ads-bridge-routing.yaml`
   - `squads/traffic-masters/data/tier-system.yaml`
   - `squads/traffic-masters/data/platform-quality-gates.md`
4. Create templates:
   - `squads/traffic-masters/templates/handoff-manifest-tmpl.md`
   - `squads/traffic-masters/templates/account-context-tmpl.md`
   - `squads/traffic-masters/templates/crisis-runbook-tmpl.md`
   - `squads/traffic-masters/templates/insight-publish-tmpl.md`
   - `squads/traffic-masters/templates/pre-launch-checklist-tmpl.md`

### Phase 4 Validation
- [ ] Chief activates via `@traffic-masters-chief` without 404 on persona load
- [ ] Mission router resolves `audit bretda` to existing task file
- [ ] Pre-action protocol triggers jarvis self-consultation when applicable
- [ ] Post-action protocol publishes insights to brain-bridge
- [ ] Crisis runbook executes for "saldo bretda" mock scenario

---

## Phase 5 — Validation (Real Account Testing — Read-Only)

**Duration estimate:** 4-6 hours
**Constraint:** READ-ONLY ONLY. Zero write operations during validation.

### Test Plan

#### Test 1 — Diagnose Each Account (Tier 0)
For each account (Bretda, Tocks, KR, Vorza, Low-Ticket):
- Invoke `@traffic-masters-chief audit {account}`
- Verify @molly-pittman runs `account-audit` task
- Verify output includes: account snapshot, identified gotchas, recommendations
- Estimated time per account: 5-10min

#### Test 2 — Specialist Routing
- Invoke `@traffic-masters-chief diagnose google bretda`
- Verify routes to @kasim-aslam
- Verify @kasim-aslam reads `account-playbooks/bretda.md` first
- Verify identifies Search Rank Lost 90% issue, recommends Manual CPC bid raise

#### Test 3 — Pre-Launch Gate Enforcement
- Invoke `@traffic-masters-chief create meta campaign tocks` (without saldo PIX)
- Verify pre-launch checklist BLOCKS due to saldo runway <5d
- Verify escalation to user with PIX request

#### Test 4 — Crisis Response
- Mock OAuth expired scenario for Bretda Google
- Invoke `@traffic-masters-chief diagnose bretda google`
- Verify crisis-response-oauth runbook triggers
- Verify proper user escalation

#### Test 5 — Multi-Specialist Workflow
- Invoke `@traffic-masters-chief audit tocks complete`
- Verify Workflow B (Account Audit + Recovery) executes
- Verify handoffs documented in handoff-manifest format
- Verify final synthesis from chief

#### Test 6 — Memory + Insights
- After Tests 1-5, verify:
  - New entries in `.claude/agent-memory/traffic-masters-chief/` (Phase 5 sessions)
  - Insights published to brain-bridge (`mcp__aios-brain-bridge__publish_aios_insights`)
  - No write ops to MCP-ads-bridge (read-only validation)

### Phase 5 Validation Criteria
- [ ] All 6 tests pass without errors
- [ ] No production state changed (audit only)
- [ ] All recommendations align with memory patterns (no contradictions)
- [ ] Time per audit is operationally viable (<15min including handoffs)
- [ ] Mind clone consultations trigger appropriately (not over-consult)

---

## Story Plan

Each phase becomes a story in `docs/stories/active/`:

1. `traffic-masters-rebuild-sprint-1.md` (Google + Brazil) — ~22 files, ~6-9h
2. `traffic-masters-rebuild-sprint-2.md` (Meta) — ~23 files, ~7-10h
3. `traffic-masters-rebuild-sprint-3.md` (Strategy + Scaling + YouTube) — ~10 files, ~5-7h
4. `traffic-masters-rebuild-phase-4.md` (Chief upgrade) — chief rewrite + 9 supporting files, ~3-4h
5. `traffic-masters-rebuild-phase-5.md` (Validation) — 6 tests, ~4-6h

**Total estimated effort:** 25-36 hours (single agent serial), or 12-18 hours with parallel subagents per sprint.

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| MCP-ads-bridge tool names differ from inventory | HIGH | LOW | Phase 3 first task: run `tools_list`, reconcile |
| Chief Tasks tool can't invoke specialists as expected | MEDIUM | HIGH | Test Workflow A early in Sprint 1; fallback to inline routing |
| Mind clone consultation latency makes pre-action protocol slow | MEDIUM | MEDIUM | Cache common consultations; only consult on high-stakes triggers |
| Account `CONTEXT.md` files don't exist for legacy accounts | HIGH | LOW | Sprint 1 includes creating them as part of `account-playbooks/` |
| User wants different specialist (e.g., add Larry Kim) | LOW | LOW | Architecture supports adding specialists modularly |
| jarvis self-consultation script broken | MEDIUM | MEDIUM | Fallback documented in `mind-clone-consultation.md` |
