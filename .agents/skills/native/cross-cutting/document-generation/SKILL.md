---
name: document-generation
description: "Generate documents using AIOX templates — PRD, architecture, stories, competitor analysis, and more."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Document Generation

## Overview

AIOX provides standardized templates for all project documents. Every document must be generated from its corresponding template to ensure consistency, completeness, and traceability. Templates live in `.aios-core/development/templates/`.

## When to Use

- Creating a new PRD, architecture doc, or story
- Writing competitor analysis or market research
- Generating sprint reports or retrospectives
- Any structured document that has a template available
- When a task file references `create-doc` or document creation

## How To

### Step 1: Identify the Template

Templates are in `.aios-core/development/templates/`:

| Document | Template | Primary Agent |
|----------|----------|---------------|
| PRD | `prd-tmpl.md` | @pm |
| Architecture | `architecture-tmpl.md` | @architect |
| Story | `story-tmpl.md` | @po |
| Epic | `epic-tmpl.md` | @po |
| Competitor Analysis | `competitor-analysis-tmpl.md` | @analyst |
| Technical Spec | `tech-spec-tmpl.md` | @architect |
| Sprint Report | `sprint-report-tmpl.md` | @sm |
| QA Report | `qa-report-tmpl.md` | @qa |

### Step 2: Read the Template Completely

Always read the full template before generating. Templates contain:
- Required sections (do not skip)
- Optional sections (mark as N/A if not applicable)
- Placeholder instructions (replace all `{placeholders}`)
- Formatting guidelines

### Step 3: Generate the Document

1. Copy template structure exactly
2. Fill all required sections
3. Replace every placeholder
4. Add story/epic references where applicable
5. Include date and author agent

### Step 4: Place the Document

| Document Type | Location |
|--------------|----------|
| PRD | `docs/prd/` or `docs/prd.md` |
| Architecture | `docs/architecture/` |
| Stories | `docs/stories/` |
| QA Reports | `docs/qa/` |
| Research | `docs/research/` |
| Project-specific | `docs/projects/{project}/` |

### Document Naming

- Use kebab-case: `auth-system-prd.md`
- Include identifiers: `epic-3-payment-gateway.md`
- Date prefix for reports: `2026-04-07-sprint-review.md`

## Examples

**Creating a PRD:**
```
1. Read .aios-core/development/templates/prd-tmpl.md
2. Fill sections: Problem, Solution, User Stories, Success Metrics
3. Save to docs/prd/payment-gateway-prd.md
4. Reference in epic/story files
```

**Creating a story from template:**
```
1. Read .aios-core/development/templates/story-tmpl.md
2. Fill: Title, AC, Technical Notes, Dependencies
3. Save to docs/stories/PAY-1-stripe-integration.md
4. Link to parent epic
```

## Anti-Patterns

- Writing documents from scratch when a template exists
- Skipping required template sections
- Leaving placeholders unfilled (`{TODO}`, `{TBD}`)
- Putting documents in wrong directories
- Not reading the full template before generating
- Creating ad-hoc document formats for standard deliverables
- Generating documents without story/epic context
