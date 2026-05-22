---
name: mind-clone-consultation
description: "How to consult Mind Clones via brain-bridge MCP for expert advice before major decisions."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Mind Clone Consultation

## Overview

AIOX has 162 expert Mind Clones (55 Mega Brain + 107 AIOS agents) available for consultation via the `aios-brain-bridge` MCP. Every agent MUST consult relevant experts before major decisions. This skill defines the workflow for identifying, consulting, and integrating expert advice.

## When to Use

- Architecture decisions and tech stack choices
- Story creation, PRD drafting, epic planning
- Security reviews and compliance decisions
- Database schema design and migrations
- UX/UI design patterns and accessibility
- Market research and competitive analysis
- Sprint planning and process improvements
- Any decision with significant downstream impact

## When to SKIP

- Trivial edits (typos, formatting)
- Git operations (commit, push, branch)
- Running tests or builds
- Reading/exploring code
- Routine status checks
- User explicitly says "skip consultation" or "sem consulta"

## How To

### Step 1: Identify Experts

Check the mind clone map for your agent's advisors:

```bash
# Find experts by topic
node .aios-core/core/jarvis/consultation-engine.js search --topic "{topic}" --limit 3

# Get recommended experts for your agent
node .aios-core/core/jarvis/consultation-engine.js recommend --agent {agent} --project {project}
```

**Agent-to-Expert Map (primary advisors):**

| Agent | Primary Experts |
|-------|----------------|
| @architect | martin-fowler, werner-vogels |
| @dev | sarah-drasner, simon-willison |
| @qa | gene-kim, martin-fowler |
| @pm | eric-ries, april-dunford |
| @po | nir-eyal, julie-zhuo |
| @sm | will-larson, patty-mccord |
| @analyst | cassie-kozyrkov, aswath-damodaran |
| @data-engineer | martin-fowler, chip-huyen |
| @devops | gene-kim, kelsey-hightower |

### Step 2: Consult (Preferred — Auto-Conclave)

```bash
# Mini-debate with multiple experts (preferred)
node .aios-core/core/jarvis/self-consultation.js conclave \
  --question "{specific question}" \
  --project {project} \
  --agent {agent} \
  --experts 3
```

Returns: individual expert prompts + debate synthesis (CONSENSUS / DISSENT / BLIND SPOTS / VERDICT).

```bash
# Single expert (faster, simpler questions)
node .aios-core/core/jarvis/self-consultation.js consult \
  --expert "{expert-id}" \
  --question "{question}" \
  --project {project} \
  --agent {agent}
```

### Step 3: Integrate Advice

- Incorporate expert input into your deliverable
- Document which experts were consulted and key takeaways
- If experts disagree, note the dissent and your resolution

### Step 4: Save Response

```bash
node .aios-core/core/jarvis/self-consultation.js save-response \
  --id {consultation-id} \
  --expert {expert-id} \
  --response "{response}"
```

### Fallback (MCP Unavailable)

1. Log warning: "Mind Clone consultation unavailable — proceeding without expert input"
2. Continue with the task
3. Note in deliverable: "Expert consultation pending — recommend review with {clone_name}"

## Examples

**Architecture decision:**
```bash
node .aios-core/core/jarvis/self-consultation.js conclave \
  --question "Should we use event sourcing for the order system or stick with CRUD?" \
  --project tocks-sales-ai \
  --agent architect \
  --experts 3
```

**Quick dev question:**
```bash
node .aios-core/core/jarvis/self-consultation.js consult \
  --expert "simon-willison" \
  --question "Best pattern for streaming LLM responses in Node.js?" \
  --project serenity-ai \
  --agent dev
```

## Anti-Patterns

- Making major architecture decisions without consulting any experts
- Consulting experts for trivial changes (wasting tokens)
- Ignoring expert advice without documenting why
- Only consulting one expert when the decision warrants a conclave
- Forgetting to save consultation responses for future reference
- Using mind clones as a substitute for reading the actual codebase
