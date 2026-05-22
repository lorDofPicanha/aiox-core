---
name: bughunter
description: Automated bug hunter that systematically scans codebase for bugs, anti-patterns, security issues, and code smells
user_invocable: true
---

# BugHunter Skill

Inspired by Codex's internal `bughunter` command (claw-code analysis).
Systematic automated bug hunting across the codebase.

## Activation

When `/bughunter` is invoked, execute the following scan pipeline:

### Step 1: Scope Detection
Determine scan scope from args:
- No args → scan git diff (changed files only)
- `--full` → scan entire project
- `{path}` → scan specific path
- `--story {id}` → scan files from story's File List

### Step 2: Multi-Layer Scan

Execute these scans in parallel using Agent tool:

**Layer 1 — Static Analysis:**
- TypeScript `any` usage
- Missing error handling in async functions
- Unused imports/variables
- Console.log left in production code
- Hardcoded secrets/credentials patterns

**Layer 2 — Logic Bugs:**
- Off-by-one errors in loops/slicing
- Null/undefined access without guards
- Race conditions in async code
- Missing await on promises
- Incorrect comparison operators (== vs ===)

**Layer 3 — Security (OWASP Top 10):**
- SQL injection vectors
- XSS in template literals/JSX
- Command injection in exec/spawn
- Path traversal in file operations
- Insecure crypto/hashing

**Layer 4 — AIOS-Specific:**
- Relative imports (should be absolute)
- Components exceeding 100 lines
- Hardcoded design tokens
- Missing interface definitions
- Conventional Commits violations in recent history

### Step 3: Report

Output structured report:
```
## BugHunter Report — {scope}

### Critical (fix immediately)
- [file:line] Description + fix suggestion

### High (fix before merge)
- [file:line] Description + fix suggestion

### Medium (tech debt)
- [file:line] Description

### Info (suggestions)
- [file:line] Description

**Score:** {passed}/{total} checks passed
**Verdict:** SAFE / NEEDS FIXES / CRITICAL ISSUES
```

### Step 4: Auto-Fix (optional)
If user passes `--fix`, automatically fix issues marked as auto-fixable.
Always show diff before applying.

## Examples
- `/bughunter` — scan changed files
- `/bughunter --full` — scan everything
- `/bughunter src/components/ --fix` — scan and auto-fix
- `/bughunter --story 2.1` — scan story files
