---
name: problem-solving
description: "Generic problem-solving framework: Define, Research, Analyze, Solution, Validate, Implement. Root cause analysis, 5 Whys, fishbone."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Problem Solving

## Overview

A structured approach to tackling any problem — from bugs and incidents to design decisions and process improvements. Every agent should follow this framework to avoid jumping to solutions before understanding the problem. The core loop: Define, Research, Analyze, Solution, Validate, Implement.

## When to Use

- Debugging a complex or recurring bug
- Investigating production incidents
- Deciding between competing approaches
- Root cause analysis after failures
- Any situation where the first instinct might be wrong
- Performance issues with unclear causes
- Cross-cutting problems affecting multiple systems

## How To

### The 6-Step Framework

#### Step 1: DEFINE the Problem

Be precise. Vague problems lead to vague solutions.

```
BAD:  "The system is slow"
GOOD: "API /orders endpoint P95 latency increased from 120ms to 850ms
       after deploying commit abc123 on 2026-04-06"
```

Capture:
- **What** is happening vs what should happen
- **When** did it start (or was it noticed)
- **Where** does it occur (environment, endpoint, component)
- **Who** is affected
- **Impact** severity (critical/high/medium/low)

#### Step 2: RESEARCH Existing Knowledge

Before analyzing, check what already exists:
- Search `docs/` for related documentation
- Check `.aios/gotchas.json` for known pitfalls
- Search git log for related changes
- Consult mind clones if the domain is specialized
- Check if a similar problem was solved before

#### Step 3: ANALYZE Root Cause

**5 Whys Method:**
```
Problem: Orders API P95 is 850ms
Why? → Database query takes 700ms
Why? → Full table scan on orders table
Why? → Missing index on customer_id column
Why? → Index was dropped in migration 042
Why? → Migration script had DROP INDEX without conditional check
ROOT CAUSE: Unconditional DROP INDEX in migration
```

**Fishbone (Ishikawa) Diagram** — categorize causes:
```
                    Problem: API Slow
                        |
    ┌──────────┬────────┴────────┬──────────┐
    Code       Data              Infra       Config
    |          |                 |           |
    N+1 query  Missing index    Low memory  Wrong pool size
    No cache   Data skew        CPU spike   Timeout too high
```

**Elimination Method:**
1. List all possible causes
2. Test each hypothesis with minimal effort
3. Eliminate impossible causes first
4. Focus on most likely remaining

#### Step 4: SOLUTION Design

- Propose 2-3 options minimum for non-trivial problems
- Evaluate trade-offs (effort vs impact vs risk)
- Consider: Does this fix the root cause or just the symptom?
- Check for side effects on other systems

#### Step 5: VALIDATE Before Implementing

- Write the test that would catch this problem
- Dry-run or simulate the fix
- Review with relevant agent (@architect for design, @qa for risk)
- Check edge cases

#### Step 6: IMPLEMENT and Verify

- Apply the fix
- Run quality gates
- Monitor for regression
- Document the root cause and fix in the story

## Examples

**Bug investigation using 5 Whys:**
```
Problem: Greeting shows "[object Object]" instead of user name
Why? → _buildPresentation receives object, not string
Why? → loadUserProfile returns { name: "John" } not "John"
Why? → Profile loader was refactored, return type changed
Why? → No type check on the return value
Why? → Missing TypeScript strict mode on that module
ROOT CAUSE: Loose typing allowed object-to-string coercion
FIX: Add type guard + enable strict on module
```

**Decision analysis:**
```
Problem: Choose caching strategy for IDS gates

Option A: In-memory LRU cache
  + Fast, simple
  - Lost on restart, per-process only

Option B: Redis cache
  + Shared, persistent
  - External dependency, network latency

Option C: File-based cache with git fingerprint
  + No external deps, survives restart
  - Slightly slower, needs cleanup strategy

DECISION: Option C (aligns with CLI-first, no infra dependency)
```

## Anti-Patterns

- Jumping to implementation without defining the problem
- Fixing symptoms instead of root causes
- Only considering one solution
- Not validating the fix catches the original problem
- Skipping research (the answer might already exist)
- Analysis paralysis — spending too long on minor issues
- Blaming external factors without evidence
- Not documenting the root cause for future reference
