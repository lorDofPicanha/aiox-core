# AIOS Mind Clones + Squads Review Brief

## Context

We are reorganizing AIOS as a multi-agent operating system with an enterprise-inspired structure.

The system has:

- 250 indexed mind clones / agents.
- 33 active squads.
- 250/250 indexed clones are now formally referenced in at least one `squad.yaml`.
- 0 unassigned indexed clones.
- 0 broken squad references.
- `validate-all-squads` currently passes: 33/33.

The current direction is not to copy a human enterprise org chart directly. The intended model is:

- Executive layer for governance, priorities, policy, escalation, and cross-squad tradeoffs.
- Permanent squads for recurring execution domains.
- Temporary task forces for mission-specific work.
- Expert pool / mind clone pool for consultative expertise.
- Mandatory gates for finance, legal, security, QA, and data-risk where applicable.

## Current Architecture Hypothesis

The preferred model is a hybrid:

```text
Founder / CEO
  |
  |-- Executive Council
  |     COO / Orchestrator
  |     CTO
  |     CPO
  |     CGO / CMO
  |     CFO
  |     CLO
  |     CISO
  |     CDAO
  |
  |-- Permanent Squads
  |     marketing-traffic
  |     squad-engineering
  |     squad-platform
  |     product-research
  |     sales-ops
  |     customer-ops
  |     legal
  |     squad-finance
  |     squad-design
  |     squad-data
  |     squad-ai
  |     squad-content
  |     others
  |
  |-- Temporary Task Forces
  |     campaign launch
  |     product build
  |     client delivery
  |     research sprint
  |
  |-- Expert / Mind Clone Pool
        consulted on demand by workflows and squad chiefs
```

## What Was Recently Changed

The system was updated so mind clones can be discovered from:

- `D:/jarvis/mega brain/agents/minds`
- `.aios-core/development/agents`
- `.codex/agents`
- `squads/*/agents`

The index currently reports:

```json
{
  "indexed": 250,
  "sources": {
    "mega-brain": 55,
    "aios-agent": 58,
    "codex-agent": 127,
    "squad-agent": 10
  }
}
```

The initial unassigned list had 54 agents. They were allocated into squads by domain fit.

## Recent Allocation Decisions

### marketing-traffic

Allocated growth, paid media, funnel, copy, SEO, social, and landing page agents:

- analytics-agent
- audience-researcher
- campaign-manager
- copy-specialist
- email-marketing-specialist
- funnel-architect
- growth-strategist
- influencer-partnership-manager
- landing-page-optimizer
- retention-specialist
- seo-content-strategist
- social-media-manager
- gary-vaynerchuk
- larry-kim
- oli-gardner
- rand-fishkin
- wes-bush

### squad-design

Allocated UX, IA, research, writing, and motion agents:

- abby-covert
- motion-designer
- ux-designer
- ux-researcher
- ux-writer

Removed broken reference:

- aaron-draplin

Reason: referenced in squad manifest but not present in the active index.

### squad-engineering

Allocated software engineering, TypeScript, runtime, web automation, and distributed architecture agents:

- aios-developer
- kent-c-dodds
- matt-pocock
- pablo-hoffman
- ryan-dahl
- sam-newman

### squad-platform

Allocated platform, DevOps, infrastructure tooling, and backend platform agents:

- github-devops
- mitchell-hashimoto
- paul-copplestone

### squad-data

Allocated database, forecasting, probabilistic reasoning, and prediction-market reasoning agents:

- craig-kerstiens
- db-sage
- nate-silver
- philip-tetlock
- robin-hanson

### legal

Allocated Brazilian procurement/admin law and security-adjacent legal expertise:

- joel-de-menezes-niebuhr
- marcal-justen-filho
- liran-tal

### squad-ai

Allocated:

- demis-hassabis-dossier

### squad-content

Allocated:

- joanna-wiebe
- ryan-holiday
- slide-creator

### product-research

Allocated:

- scott-alexander
- luana-lopes-lara
- pedro-valerio

### squad-finance

Allocated trading, crypto, and prediction-market specialists provisionally:

- danijel-overtime
- domer-polymarket
- gcr-crypto
- theo-polymarket

This may deserve a future dedicated squad, such as `markets-intelligence`, `prediction-markets`, or `trading-research`.

### squad-executive

Allocated orchestration, SOP extraction, and founder-context agents:

- aios-orchestrator
- oalanicolas
- sop-extractor

### expert-council

Allocated:

- template-mind-clone

## Validation State

Current checks:

```text
validate-all-squads: 33/33 OK
indexed clones: 250
assigned clones: 250
unassigned clones: 0
missing squad references: 0
```

## Key Question For Claude

Please review whether this allocation is operationally sound for a multi-agent system.

We need a critical architecture review, not encouragement.

## Review Questions

1. Is it a mistake to formally allocate all 250 clones into squads?

2. Should some clones be moved out of permanent squads into a consultative `expert-pool`?

3. Which current allocations look wrong, noisy, duplicated, or likely to create routing confusion?

4. Should trading/crypto/polymarket agents remain under `squad-finance`, move to `squad-data`, or become a dedicated `markets-intelligence` squad?

5. Should marketing be split into:
   - `marketing-traffic`
   - `growth`
   - `content`
   - `lifecycle`
   - `conversion-rate-optimization`

   Or is that over-fragmentation?

6. Which squads should be permanent execution squads versus governance-only squads?

7. What should be the difference between:
   - `squad-executive`
   - `executive-team`
   - `expert-council`

8. Should C-level agents be actual execution agents, or only policy/gate/escalation agents?

9. What routing model would you recommend?

   Options:

   - Static squad membership only.
   - Expert pool with dynamic retrieval.
   - Squad chiefs route to specialists.
   - Executive council only handles escalations.
   - Hybrid policy-based routing.

10. What governance gates are mandatory for this AIOS?

    Consider:

    - finance
    - legal
    - security
    - privacy
    - data quality
    - brand
    - QA
    - human approval

11. Which papers, frameworks, or multi-agent systems research best support your recommendation?

12. What would you change before we continue reorganizing the rest of the system?

## Desired Output

Please return:

1. A concise diagnosis of the current architecture.
2. A recommended target architecture.
3. A list of specific agent/squad reallocations.
4. A routing and governance model.
5. Risks and failure modes.
6. A phased migration plan.
7. Relevant research/papers/frameworks supporting the recommendation.

## Constraints

- The system must remain practical to operate.
- Avoid excessive bureaucracy.
- Avoid over-calling experts for simple tasks.
- Keep execution fast.
- Preserve specialist expertise.
- Make routing deterministic enough for automation.
- Allow dynamic expert consultation for complex decisions.
- Maintain validation through `squad.yaml` manifests.

## Current Preference To Challenge

The current instinct is:

> Every active clone should be formally allocated somewhere so nothing is orphaned.

Please challenge this. It may be better to distinguish:

- permanent squad members
- shared services
- governance/gate agents
- expert pool agents
- deprecated/duplicate agents
- task-force-only agents

The goal is not to make the org chart look complete. The goal is to improve orchestration quality.
