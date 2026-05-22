---
name: story-driven-development
description: "All work starts with a story in docs/stories/. Workflow, checkboxes, file lists, and agent handoff chain."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Story-Driven Development

## Overview

Story-Driven Development is a MUST principle (Constitution Article III). No code is written, no test is executed, no deployment happens without a story. Stories live in `docs/stories/` and track every aspect of implementation from acceptance criteria to file lists.

## When to Use

- Starting ANY new work (feature, bugfix, refactor, infrastructure)
- Before writing any code
- When planning sprint work
- When handing off work between agents
- When reviewing what was delivered

## How To

### Story Lifecycle

```
@po *create-story → [Visual Prototyping if UI] → @dev implements → @qa tests → @devops push
```

### Story Location

All stories live in `docs/stories/` with naming pattern:
```
{EPIC_PREFIX}-{NUMBER}-{short-description}.md
```

### Story Structure (Required Sections)

```markdown
# {STORY-ID}: {Title}

## Status: {Draft | In Progress | In Review | Done}

## Description
{What and why}

## Acceptance Criteria
- [ ] AC1: {Specific, testable criterion}
- [ ] AC2: {Another criterion}

## Technical Notes
{Implementation guidance}

## File List
- `path/to/file.ts` — {what this file does}

## Dependencies
- {Other stories or external deps}

## Definition of Done
- [ ] All AC checked
- [ ] Tests passing
- [ ] Lint clean
- [ ] Code reviewed
- [ ] Documentation updated
```

### Checkbox Protocol

- Mark checkboxes as you complete: `[ ]` to `[x]`
- NEVER mark a checkbox without the work being actually done
- File List must be updated as files are created/modified
- Status must reflect current state

### Workflow by Agent

| Agent | Responsibility |
|-------|---------------|
| @po | Creates story, defines AC, prioritizes |
| @architect | Reviews technical approach, adds technical notes |
| @dev | Implements, updates file list and checkboxes |
| @qa | Tests against AC, reports issues |
| @devops | Pushes to remote after all gates pass |

### Frontend Stories (Visual Before Code)

For UI stories, add visual prototyping step:
```
@po creates → @ux-design-expert designs → Tokenize/Componentize → @dev implements logic
```

Backend/CLI stories skip this step.

## Examples

**Creating a story:**
```
@po *create-story --title "Add user authentication" --epic AUTH --priority high
```

**Working a story (@dev):**
1. Read story file completely
2. Check acceptance criteria
3. Implement, marking checkboxes as you go
4. Update file list with every new/modified file
5. Run quality gates (lint, typecheck, test)
6. Update status to "In Review"

**Story reference in commits:**
```
feat(auth): add JWT validation middleware [AUTH-3]
```

## Anti-Patterns

- Writing code without a story ("cowboy coding")
- Creating stories after the code is already written
- Marking checkboxes without actually completing the work
- Forgetting to update the File List
- Skipping the visual prototyping step for frontend stories
- Working on a story that is not assigned to your agent role
- Pushing code without all DoD checkboxes checked
