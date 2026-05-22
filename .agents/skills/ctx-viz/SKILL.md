---
name: ctx-viz
description: Context visualization — shows what Codex currently knows, token usage, active context, and memory state
user_invocable: true
---

# Context Visualization Skill

Inspired by Codex's internal `ctx_viz` command (claw-code analysis).
Provides observability into the current session's context state.

## Activation

When `/ctx-viz` is invoked, display comprehensive context snapshot:

### Section 1: Instruction Budget
Read and measure all instruction files:
```
## Instruction Budget (target: <12,000 chars total, <4,000 per file)

| File | Chars | Budget | Status |
|------|-------|--------|--------|
| AGENTS.md | {n} | 4,000 | OK/OVER |
| rules/jarvis-integration.md | {n} | 4,000 | OK/OVER |
| rules/mcp-usage.md | {n} | 4,000 | OK/OVER |
| rules/mind-clone-auto-consult.md | {n} | 4,000 | OK/OVER |
| **TOTAL** | **{n}** | **12,000** | **OK/OVER** |
```

### Section 2: Active Context
```
## Active Context

- **Branch:** {current branch}
- **Active Story:** {story from docs/stories/active/ if detected}
- **Agent Mode:** {current agent if active, or "none"}
- **Modified Files:** {count from git status}
- **Last Commit:** {message} ({hash})
```

### Section 3: Memory State
```
## Memory State

### Agent Memories
| Agent | Entries | Avg Relevance | Last Updated |
|-------|---------|---------------|--------------|
{for each agent with memories in .aios/agent-memory/}

### Team Memories
| Squad | Entries | Active Blockers | Last Updated |
|-------|---------|----------------|--------------|
{for each squad with memories in .aios/team-memory/}

### MEMORY.md
- Entries: {count of bullet points}
- Size: {chars}
- Last memory file updated: {date}
```

### Section 4: MCP Status
```
## MCP Servers

| Server | Status | Tools |
|--------|--------|-------|
| aios-brain-bridge | {active/inactive} | 16 |
| mcp-ads-bridge | {active/inactive} | 52 |
| mcp-image-studio | {active/inactive} | 7 |
```

### Section 5: Health Summary
```
## Health (Fast Path)

- Last check: {timestamp or "never"}
- Mode: {quick/full}
- Phases skipped: {count} ({speedup}%)
- Score: {last score or "unknown"}
```

### Section 6: Recommendations
Based on the analysis, suggest:
- If AGENTS.md over budget → "Optimize instructions"
- If agent memories stale → "Run prune"
- If no recent health check → "Run *health-check"
- If blockers exist → "Address team blockers"

## Args
- `/ctx-viz` — full context visualization
- `/ctx-viz --budget` — only instruction budget
- `/ctx-viz --memory` — only memory state
- `/ctx-viz --health` — only health summary
