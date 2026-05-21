---
name: aios-memory
description: Full archive of AIOS auto-memory from Claude Code era (201 files, 1.5MB). Use when you need historical context on past decisions, feedback patterns, project state evolution, or to recall reminders that were active during specific sessions. Migrated from the Claude Code project memory archive on 2026-05-19 as part of Codex migration.
version: 1.0.0
source: claude-code-auto-memory
migration_date: 2026-05-19
---

# AIOS Memory Archive Skill

## Purpose

This skill preserves the **complete auto-memory archive** from the Claude Code era of the AIOS project. It contains 201 markdown files documenting:

- **Founder decisions** (`decisions_*`): Strategic decisions per project with rationale
- **Feedback patterns** (`feedback_*`): Approved/rejected behaviors, anti-patterns, lessons learned (~60 entries)
- **Project state** (`project_*`): Active project context (~15 entries)
- **Reminders** (`reminder_*`): Active triggers with revisit dates
- **Sessions** (`session_*`): Important conversations preserved verbatim (~80 entries)
- **User profile** (`user_*`): Founder role, preferences, technical knowledge

## When to use

Activate this skill when:
- A user references "lembra quando", "no projeto X", "tinha um padrão", or any historical context
- You need to verify if a current approach was previously rejected (check `.out-of-scope/` pattern)
- You need to recall the rationale behind an architectural decision
- A reminder appears stale and needs cross-reference with active sessions
- Building a status report for any active project

## How to use

### Step 1 — Read the index first

```
.codex/skills/aios-memory/MEMORY.md
```

The index is a 207-line table of contents pointing to the 200 detail files. Use it to identify which files are relevant before reading individual files.

### Step 2 — Read specific detail files on demand

Each detail file follows the naming convention:
- `decisions_<project>_<date>_<topic>.md`
- `feedback_<topic>.md`
- `project_<name>_<status>.md`
- `reminder_<topic>_<date>.md`
- `session_<topic>_<date>.md`
- `user_<topic>.md`

### Step 3 — Cite when applying memory

When using memory to inform a decision, cite the source:
> Per memory file `feedback_meta_budget_jump_no_more_2x.md` (after Bretda 28/Abr incident): never jump budget more than 2x in a single push.

## Important caveats

**Memory is frozen in time.** Each file represents what was true when written.

Before recommending actions based on memory:
1. **Verify the named entity still exists** (file paths, function names, accounts)
2. **Check git log** for changes after the memory's date
3. **Treat as historical reference**, not authoritative current state

**Active reminders in MEMORY.md** are the most current — but even those need verification on dates and statuses.

## Anti-patterns

DON'T:
- Load the entire 1.5MB archive into context unconditionally (defeats minimization)
- Treat memory as ground truth when reality may have shifted
- Cite memory without checking the file actually exists

DO:
- Read MEMORY.md index first, then drill into specific files
- Update memory in the original Claude project-memory source if you find drift — this skill is read-only archive
- Prefer recent files over old ones when sources conflict

## AIOS path conventions

This archive skill does not activate a single persona, but it follows the same
Codex path conventions as agent skills:

- Canonical agent definitions live under `.aios-core/development/agents/`
- Canonical greeting command: `node .aios-core/development/scripts/generate-greeting.js <agent-id>`

## File access pattern

```
.codex/skills/aios-memory/
├── SKILL.md (this file)
├── MEMORY.md (index — 207 lines, READ FIRST)
└── 200 detail files (.md)
```

## Migration provenance

- **Origin:** Claude Code auto-memory system for the `D:\AIOS` project
- **Migrated by:** Orion (aios-master) on 2026-05-19
- **Migration context:** Part of FASE 3 of Claude Code → Codex CLI migration
- **Decision rationale:** Founder requested zero data loss ("preservar tudo sem deixar nada para trás")
- **Original system still intact:** the Claude project memory archive remains preserved untouched as canonical reference

## Synthesized active reminders

The 10-15 MOST ACTIVE reminders are also embedded in `AGENTS.md` for immediate-context loading. Use this skill for the complete archive; use AGENTS.md for the hot path.

## Future maintenance

When new memory entries are added during Codex era:
- Write directly to `.codex/skills/aios-memory/` (or create a parallel `.codex/memory/` if preferred)
- Update `MEMORY.md` index manually
- Keep entries one-line in index, full detail in topic files
- Consider periodic compaction (move stale entries to `archive/` subfolder)
