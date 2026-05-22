---
name: ultraplan
description: Extended reasoning mode for complex planning — deep analysis with multi-expert consultation and risk modeling
user_invocable: true
---

# UltraPlan Skill

Inspired by Codex's internal `ultraplan` command (claw-code analysis).
Extended reasoning mode that goes deeper than standard planning.

## Activation

When `/ultraplan` is invoked:

### Phase 1: Deep Context Gathering
1. Read all active stories in `docs/stories/active/`
2. Read project PRDs in `docs/projects/`
3. Read recent git history (last 20 commits)
4. Read current agent memory snapshots
5. Check team memory for blockers and context

### Phase 2: Multi-Expert Consultation (Auto-Conclave)
Run a conclave with 3-5 relevant experts:
```bash
node .aios-core/core/jarvis/self-consultation.js conclave --question "{planning question}" --project {project} --agent aios-master --experts 5
```

Synthesize into CONSENSUS / DISSENT / BLIND SPOTS format.

### Phase 3: Risk Modeling
For each proposed action, evaluate:

| Risk Dimension | Analysis |
|---------------|----------|
| **Technical** | Can we build this? Dependencies? Complexity? |
| **Timeline** | Realistic given current velocity? Blockers? |
| **Resource** | Token cost? Human effort? External dependencies? |
| **Quality** | Can we maintain standards? Testing coverage? |
| **Security** | New attack surface? Compliance impact? |

Risk matrix: Probability (1-5) x Impact (1-5) = Risk Score

### Phase 4: Implementation Blueprint
Generate detailed plan:

```
## UltraPlan: {objective}

### Executive Summary
{1-2 sentences}

### Expert Consensus
{conclave synthesis}

### Proposed Approach
1. {step} — @{agent} — {estimated effort}
   Dependencies: {what must be done first}
   Risk: {level} — {mitigation}

### Critical Path
{sequence diagram of blocking dependencies}

### Risk Matrix
| Risk | Probability | Impact | Score | Mitigation |
|------|------------|--------|-------|------------|

### Success Criteria
- [ ] {measurable outcome}

### Contingency Plans
- If {risk materializes}: {fallback approach}

### Resource Estimate
- Stories: {count}
- Estimated tokens: {range}
- External dependencies: {list}
```

### Phase 5: Validation
- Cross-reference plan against Constitution articles
- Verify all story dependencies are resolvable
- Confirm no circular dependencies
- Check against known blockers in team memory

## Args
- `/ultraplan {objective}` — plan for specific objective
- `/ultraplan --project {name}` — comprehensive project plan
- `/ultraplan --sprint` — next sprint planning
- `/ultraplan --pivot {reason}` — plan a strategic pivot

## Examples
- `/ultraplan implement WhatsApp integration for Tocks`
- `/ultraplan --project hydra --sprint`
- `/ultraplan --pivot migrate from Railway to Fly.io`
