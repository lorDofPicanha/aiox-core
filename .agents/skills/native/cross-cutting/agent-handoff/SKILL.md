---
name: agent-handoff
description: "Transfer work between agents with structured handoff artifacts. Workflow chains and YAML artifact format."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Agent Handoff

## Overview

Agent handoff is the structured transfer of work context between AIOX agents. Every handoff produces a YAML artifact that captures state, decisions, blockers, and next steps. This ensures zero context loss when work moves between agents in the workflow chain.

## When to Use

- Completing your phase and passing to the next agent
- Escalating an issue to a specialized agent
- Requesting review from another agent
- Any transition point in the workflow chain
- When blocked and another agent must resolve

## How To

### Standard Workflow Chains

```
Story Creation:   @po → @architect → @dev → @qa → @devops
Bug Fix:          @qa (report) → @dev (fix) → @qa (verify) → @devops
Refactor:         @architect (plan) → @dev (implement) → @qa (validate)
UI Feature:       @po → @ux-design-expert → @dev → @qa → @devops
Infrastructure:   @architect (design) → @devops (implement) → @qa (validate)
```

### Handoff Artifact Format

Create a YAML file in `.aiox/handoffs/`:

```yaml
# .aiox/handoffs/{STORY-ID}-{from}-to-{to}-{timestamp}.yaml
handoff:
  id: "ACT-7-dev-to-qa-20260407"
  story: "ACT-7"
  from: "@dev"
  to: "@qa"
  timestamp: "2026-04-07T14:30:00Z"
  status: "ready-for-review"

context:
  summary: "Implemented contextual greeting sections for returning users"
  decisions_made:
    - "Used sectionContext param pattern for backward compatibility"
    - "Parallelized context and workflow sections with Promise.all"
  assumptions:
    - "ACT-5 workflow navigator code (lines 661-816) is frozen"

deliverables:
  files_created:
    - path: "src/greeting/context-builder.js"
      description: "Builds contextual sections from enriched pipeline data"
  files_modified:
    - path: "src/greeting/greeting-builder.js"
      description: "Added sectionContext flow to _buildContextualGreeting"
  tests_added:
    - "test/greeting/context-builder.test.js"

quality_gates:
  lint: "pass"
  typecheck: "pass"
  tests: "pass (42/42)"

blockers: []

next_steps:
  - "Verify all AC in story ACT-7"
  - "Test backward compatibility (no sectionContext path)"
  - "Regression test existing greeting flows"

notes: |
  Pre-existing lint warnings (860) not addressed — outside story scope.
  _safeBuildSection wraps each builder with 150ms timeout.
```

### Handoff Protocol

1. **Complete your work** — run quality gates
2. **Create handoff artifact** — fill all sections honestly
3. **Update story status** — reflect current state
4. **Tag the receiving agent** — `@qa please review ACT-7`
5. **Do NOT continue** — the receiving agent owns it now

### Receiving a Handoff

1. Read the handoff artifact completely
2. Verify files listed exist and match descriptions
3. Check quality gate results
4. Review blockers and assumptions
5. Begin your phase of work

## Examples

**Dev to QA handoff:**
```yaml
handoff:
  from: "@dev"
  to: "@qa"
  story: "IDS-5a"
  status: "ready-for-review"
context:
  summary: "Built 4 verification gates (G1-G4) with circuit breaker"
  decisions_made:
    - "G3 uses Boolean() wrapper for override check"
quality_gates:
  lint: "pass"
  typecheck: "pass"
  tests: "pass (28/28)"
```

**QA to Dev escalation:**
```yaml
handoff:
  from: "@qa"
  to: "@dev"
  story: "IDS-5a"
  status: "needs-fix"
context:
  summary: "G3 override logic fails when override is empty string"
blockers:
  - "Boolean('') returns false — edge case not covered"
```

## Anti-Patterns

- Verbal handoffs with no artifact ("hey, it's done, go test it")
- Incomplete artifacts missing files or decisions
- Handing off with failing quality gates
- Continuing to work on code after handing off to another agent
- Skipping handoff for "simple" changes
- Not reading the handoff artifact before starting your phase
- Overwriting another agent's in-progress work
