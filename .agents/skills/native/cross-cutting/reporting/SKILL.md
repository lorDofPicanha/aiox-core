---
name: reporting
description: "How to structure reports and analyses: Executive Summary, Findings, Recommendations, Next Steps. Markdown tables and formatting."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Reporting

## Overview

All AIOX agents produce reports at various stages — QA reports, sprint reviews, analysis results, incident postmortems. This skill standardizes report structure so that any agent or human can quickly extract the information they need. Reports follow: Executive Summary, Findings, Recommendations, Next Steps.

## When to Use

- QA test results and bug reports
- Sprint reviews and retrospectives
- Market research and competitive analysis
- Incident postmortems
- Performance analysis results
- Architecture decision records (ADRs)
- Any structured output that will be read by others

## How To

### Standard Report Structure

```markdown
# {Report Title}

**Date:** {YYYY-MM-DD}
**Author:** {Agent ID}
**Story/Context:** {STORY-ID or context}
**Status:** {Draft | Final | Superseded}

## Executive Summary

{2-4 sentences. What was done, key finding, primary recommendation.
A busy reader should get the full picture from this section alone.}

## Findings

### Finding 1: {Title}
{Description with evidence}

### Finding 2: {Title}
{Description with evidence}

## Data

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Test coverage | 87% | 80% | PASS |
| P95 latency | 120ms | 200ms | PASS |
| Open bugs | 3 | 0 | WARN |

## Recommendations

1. **{Action}** — {Why and impact} [Priority: High/Medium/Low]
2. **{Action}** — {Why and impact} [Priority: High/Medium/Low]

## Next Steps

- [ ] {Actionable item with owner}
- [ ] {Actionable item with owner}

## Appendix (optional)

{Raw data, extended analysis, reference links}
```

### Formatting Rules

- **Tables** for comparative data (always use markdown tables, never prose lists for tabular data)
- **Bold** for key terms, metrics, and action items
- **Code blocks** for commands, file paths, and technical output
- **Bullet lists** for non-sequential items
- **Numbered lists** for sequential steps or prioritized items
- **Headers** for scanability — max 3 levels deep (##, ###, ####)

### Report Types and Focus

| Report Type | Key Sections | Primary Audience |
|-------------|-------------|-----------------|
| QA Report | Test results, bugs found, coverage | @dev, @pm |
| Sprint Review | Velocity, completed stories, blockers | @sm, @pm |
| Incident Postmortem | Timeline, root cause, action items | @architect, @devops |
| Market Analysis | Competitors, opportunities, threats | @pm, @po |
| Performance Report | Metrics, bottlenecks, optimization plan | @architect, @dev |
| ADR | Context, decision, consequences | @architect, all |

### Metric Formatting

- Percentages: `87%` (not `0.87` or `87 percent`)
- Latency: `120ms` or `1.2s` (use appropriate unit)
- Counts: `1,234` (comma-separated for readability)
- Currency: `R$37` or `$18k` (with appropriate symbol)
- Status badges: `PASS`, `FAIL`, `WARN`, `N/A`

## Examples

**QA Report excerpt:**
```markdown
## Executive Summary

QA validation for IDS-5a completed. 28/28 tests passing. 4 verification
gates (G1-G4) with circuit breaker all functioning. One edge case found
in G3 override logic — fixed with Boolean() wrapper.

## Findings

| Gate | Tests | Status | Notes |
|------|-------|--------|-------|
| G1 (@pm) | 7/7 | PASS | Advisory mode working |
| G2 (@sm) | 6/6 | PASS | Advisory mode working |
| G3 (@po) | 9/9 | PASS | Override logic fixed |
| G4 (@dev) | 6/6 | PASS | Logging verified |
```

**Sprint Review excerpt:**
```markdown
## Data

| Story | Points | Status | Agent |
|-------|--------|--------|-------|
| ACT-6 | 8 | Done | @dev |
| ACT-7 | 5 | In Review | @dev |
| IDS-5a | 8 | Done | @dev |

**Velocity:** 21 points (target: 20) — ON TRACK
```

## Anti-Patterns

- Wall of text with no structure or headers
- Missing Executive Summary (forces reader to parse everything)
- Findings without evidence or data
- Recommendations without priority or rationale
- Using prose where a table would be clearer
- Reports without dates or author attribution
- Next Steps without owners or actionability
- Burying the critical finding in the middle of the report
