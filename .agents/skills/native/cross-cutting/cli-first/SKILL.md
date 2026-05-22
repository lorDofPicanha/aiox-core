---
name: cli-first
description: "CLI First principle — all features must work via CLI before any UI. Output formatting, interaction patterns, and prioritization rules."
category: cross-cutting
agents: ["all"]
priority: critical
---

# CLI First

## Overview

CLI First is the non-negotiable foundation of AIOX (Constitution Article I). Every feature, tool, and workflow must be fully functional via command line before any dashboard or UI is considered. The hierarchy is absolute: CLI > Observability > UI.

## When to Use

- Starting any new feature or tool implementation
- Deciding where to place functionality (CLI vs UI vs dashboard)
- Designing agent commands and outputs
- Reviewing PRDs or architecture docs for compliance
- Any time you're tempted to build a UI first

## How To

### Priority Chain

```
1. CLI (source of truth) — ALWAYS first
2. Observability (dashboards, logs) — reads from CLI data
3. UI (web, desktop) — consumes CLI APIs
```

### Output Formatting Standards

- Use structured output (JSON, YAML, or markdown tables) for machine-readable results
- Human-readable output as default; `--json` flag for machine consumption
- Use exit codes correctly: 0=success, 1=general error, 2=misuse
- Progress indicators for long operations (spinners, progress bars)
- Color output with `--no-color` fallback

### Interaction Patterns

- Commands follow: `aios <domain> <action> [options]`
- Use flags over interactive prompts (scriptability first)
- Provide `--dry-run` for destructive operations
- Include `--verbose` / `--quiet` modes
- Help text with `--help` on every command

### Validation Checklist

Before considering any UI work, verify:
- [ ] Feature works 100% from CLI
- [ ] Output is parseable (JSON/YAML available)
- [ ] Errors are descriptive with actionable messages
- [ ] Can be piped to other commands
- [ ] Documented with `--help`

## Examples

**Correct — CLI first:**
```bash
# Feature fully works via CLI
aios story create --title "Add login" --epic 3 --priority high
aios health-check run --category local --format json
aios ids verify --gate g3 --story ACT-7
```

**Correct — Observability second:**
```bash
# Dashboard reads from CLI data, never controls
aios dashboard serve  # displays data from CLI operations
```

**Incorrect — UI first:**
```
# WRONG: Building a React form before CLI command exists
# WRONG: Dashboard that triggers actions not available in CLI
# WRONG: Feature only accessible through web interface
```

## Anti-Patterns

- Building a web form or dashboard before the CLI command exists
- Features that only work through UI with no CLI equivalent
- Dashboards that control state instead of observing it
- Interactive-only commands with no flag-based alternative
- Skipping `--json` output because "only humans will use this"
- Hardcoding output format without format flags
