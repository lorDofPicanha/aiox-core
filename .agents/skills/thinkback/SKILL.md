---
name: thinkback
description: Replay and analyze decision-making reasoning from past sessions, stories, and commits
user_invocable: true
---

# ThinkBack Skill

Inspired by Codex's internal `thinkback`/`thinkback-play` commands (claw-code analysis).
Replays reasoning chains and decision history for debugging decisions.

## Activation

When `/thinkback` is invoked, trace decision history:

### Mode 1: Story ThinkBack (default)
```
/thinkback [story-id]
```

Trace the reasoning chain for a story:
1. Read the story file from `docs/stories/`
2. Read git log for commits referencing this story
3. Read any consultation records from `D:/jarvis/bridge-data/`
4. Read agent memory snapshots from `.aios/agent-memory/`

Output:
```
## ThinkBack: Story {id}

### Decision Timeline
1. {date} — @{agent}: {decision} → {outcome}
   Reasoning: {why this was chosen}
   Alternatives considered: {what was rejected}

2. {date} — @{agent}: {decision} → {outcome}
   ...

### Mind Clone Consultations
- {expert}: "{advice summary}" → {was it followed? outcome?}

### Key Pivot Points
- {moment where direction changed and why}

### Lessons Learned
- {patterns that worked/failed}
```

### Mode 2: Commit ThinkBack
```
/thinkback --commit {hash}
```

Analyze a specific commit's reasoning:
1. Read the commit diff
2. Infer the reasoning behind each change
3. Flag any changes that seem inconsistent or risky

### Mode 3: Architecture ThinkBack
```
/thinkback --arch {component}
```

Trace architectural decisions for a component:
1. Search for architecture docs mentioning the component
2. Search git history for structural changes
3. Search consultation records
4. Reconstruct the "why" behind current architecture

### Mode 4: Project ThinkBack
```
/thinkback --project {name}
```

Full project decision history:
1. Read PRD and evolution
2. Read all stories (active + completed)
3. Read consultation records
4. Build comprehensive decision timeline

## Output Format

Always output as structured markdown with:
- Chronological timeline
- Decision → Outcome mapping
- Confidence assessment (was the decision validated?)
- Recommendations for future decisions based on patterns

## Examples
- `/thinkback` — thinkback current active story
- `/thinkback story-2.1` — specific story
- `/thinkback --commit abc123` — specific commit
- `/thinkback --arch auth-system` — architecture trace
- `/thinkback --project serenity` — full project history
