---
name: quality-gates
description: "Pre-push quality gates: lint, typecheck, test. Definition of Done checklist. When to block vs proceed."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Quality Gates

## Overview

Quality Gates are mandatory checkpoints that all code must pass before being considered complete. The gate sequence is: lint, typecheck, test. No code reaches remote without passing all three. This is Constitution Article V (Quality First).

## When to Use

- Before marking any story as complete
- Before requesting code review
- Before @devops pushes to remote
- After any significant code change
- When validating PR readiness

## How To

### Gate Sequence (Mandatory)

```bash
npm run lint        # Step 1: Code style and static analysis
npm run typecheck   # Step 2: TypeScript type safety
npm test            # Step 3: All tests pass
```

All three MUST pass. No exceptions.

### Definition of Done (DoD) Checklist

Before a story is "Done":

- [ ] All acceptance criteria checked (`[x]`)
- [ ] `npm run lint` passes (0 new errors in changed files)
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm test` passes (all relevant tests)
- [ ] File list in story is complete and accurate
- [ ] No hardcoded secrets, tokens, or credentials
- [ ] New code has appropriate test coverage
- [ ] Documentation updated if behavior changed
- [ ] Story status updated to "Done" or "In Review"

### When to BLOCK (Hard Gate)

Stop and fix immediately:
- TypeScript errors in changed files
- Failing tests related to changed code
- Security vulnerabilities (hardcoded secrets, SQL injection)
- Breaking changes without documentation
- Missing acceptance criteria implementation

### When to PROCEED with Warning (Soft Gate)

Document and continue:
- Pre-existing lint warnings (not introduced by you)
- Flaky tests unrelated to your changes
- Minor style warnings in untouched files
- Documentation gaps in unrelated areas

### Lint Strategy

```bash
# Check only your changed files if full lint has pre-existing errors
npx eslint path/to/your/changed/file.js

# Full project lint (ideal)
npm run lint
```

**Known**: Pre-existing lint errors may exist in the codebase. Verify only YOUR changed files are clean. Do not fix unrelated lint errors in a feature story.

### Test Strategy

```bash
# Run specific test file
npx jest path/to/test.test.js

# Run tests matching pattern
npx jest --testPathPatterns="feature-name"

# Full test suite
npm test
```

## Examples

**Standard pre-completion flow:**
```bash
npm run lint        # Fix any new errors
npm run typecheck   # Fix any type errors
npm test            # Fix any failing tests
# All pass? -> Update story status, notify @qa
```

**Handling pre-existing failures:**
```
# npm run lint shows 279 errors, 860 warnings
# But your 3 changed files: 0 errors, 0 warnings
# VERDICT: PROCEED (pre-existing, not yours)
```

## Anti-Patterns

- Skipping gates because "it's a small change"
- Pushing with `--no-verify` to bypass hooks
- Marking story as Done without running all three gates
- Fixing pre-existing lint errors in a feature branch (scope creep)
- Ignoring failing tests because "they were already failing"
- Running gates only once and not after subsequent changes
- Using `any` type to make typecheck pass
- Disabling ESLint rules inline without justification
