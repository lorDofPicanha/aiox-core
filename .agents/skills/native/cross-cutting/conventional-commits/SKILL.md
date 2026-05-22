---
name: conventional-commits
description: "Commit message standards: feat/fix/docs/test/chore/refactor + story ID. Push rules and @devops exclusivity."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Conventional Commits

## Overview

All commits in AIOX follow the Conventional Commits standard with mandatory story ID references. Only `@devops` may push to remote repositories. This ensures traceability, clean changelogs, and controlled deployments.

## When to Use

- Every single git commit
- When reviewing commit messages in PRs
- When generating changelogs
- When deciding if a change warrants a new commit or amend

## How To

### Commit Format

```
<type>(<scope>): <description> [STORY-ID]

[optional body]

[optional footer]
```

### Types

| Type | When | Example |
|------|------|---------|
| `feat` | New feature (wholly new functionality) | `feat(auth): add OAuth2 provider [AUTH-3]` |
| `fix` | Bug fix | `fix(api): handle null response from gateway [API-12]` |
| `docs` | Documentation only | `docs(readme): update installation steps [SETUP-1]` |
| `test` | Adding or fixing tests | `test(auth): add JWT expiry edge cases [AUTH-3]` |
| `chore` | Maintenance, deps, config | `chore(deps): bump express to 4.19 [INFRA-5]` |
| `refactor` | Code change that neither fixes nor adds | `refactor(api): extract validation middleware [API-8]` |

### Rules

1. **Story ID is mandatory** — append `[STORY-ID]` to every commit message
2. **Scope is recommended** — use the module/feature area in parentheses
3. **Description is imperative** — "add", "fix", "update" not "added", "fixed", "updated"
4. **50 char limit** for first line (type + scope + description)
5. **Body** for complex changes — explain WHY, not WHAT (the diff shows what)
6. **Breaking changes** — add `BREAKING CHANGE:` in footer or `!` after type

### Push Rules

```
ONLY @devops pushes to remote. No exceptions.
```

- @dev commits locally
- @qa validates locally
- @devops reviews, then pushes
- Direct push by non-devops agents is a violation

### Pre-Commit Checklist

Before committing:
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes (relevant tests)
- [ ] Commit message follows format
- [ ] Story ID is included

## Examples

**Feature commit:**
```
feat(greeting): add contextual sections for returning users [ACT-7]

Returning users now see project status narrative and workflow
context instead of the full archetypal greeting.
```

**Bug fix:**
```
fix(ids): wrap override check with Boolean() in G3 gate [IDS-5a]
```

**Multi-file refactor:**
```
refactor(pipeline): extract loader phase into separate module [ACT-6]

Reduces UnifiedActivationPipeline complexity from 450 to 280 lines.
Loaders now independently testable.
```

**Breaking change:**
```
feat(api)!: change auth endpoint response format [AUTH-5]

BREAKING CHANGE: /api/auth/login now returns { token, user }
instead of { accessToken, refreshToken, userData }.
```

## Anti-Patterns

- Commits without story ID: `fix: handle null` (missing [STORY-ID])
- Vague messages: `chore: updates` or `fix: stuff`
- Past tense: `feat: added login` (should be "add login")
- Non-devops agent pushing to remote
- Giant commits covering multiple unrelated changes
- Committing with failing lint/typecheck/tests
- Using `chore` for what is actually a `feat` or `fix`
- Amending commits that are already pushed
