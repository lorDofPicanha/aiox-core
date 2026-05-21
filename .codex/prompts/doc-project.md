---
description: "Generate comprehensive architectural documentation for any project. Inspired by the \"CREATE ARCHITECT DOCUMENTATION\" skill from aitplm.com."
source: "claude-code .claude/commands/doc-project.md"
migrated: "2026-05-19"
---

# doc-project

Generate comprehensive architectural documentation for any project. Inspired by the "CREATE ARCHITECT DOCUMENTATION" skill from aitplm.com.

**Context:** 2 programmers, 60 days, R$20K = failed to deliver documentation. Claude Code: 1h30 = superior documentation.

---

## What This Command Does

When activated, this command performs a complete project analysis and generates comprehensive documentation covering all aspects of the system.

---

## Execution Steps

### Phase 1: Discovery (Automatic)

1. **Scan project structure** - Map all directories, files, and their relationships
2. **Identify tech stack** - Detect languages, frameworks, libraries, build tools
3. **Read configuration files** - package.json, tsconfig, .env.example, docker-compose, etc.
4. **Analyze source code** - Entry points, routes, controllers, models, services
5. **Check database** - Schema files, migrations, ORMs, entity definitions
6. **Review existing docs** - README, CHANGELOG, API docs, comments

### Phase 2: Analysis

7. **Map data flows** - Request lifecycle, data transformations, event flows
8. **Identify patterns** - Architecture pattern (MVC, Clean, Hexagonal, etc.)
9. **Map dependencies** - External services, APIs, third-party integrations
10. **Security audit** - Auth methods, encryption, secrets management, vulnerabilities
11. **Performance review** - Caching, queries, bottlenecks, optimization opportunities

### Phase 3: Documentation Generation

Generate a single comprehensive document with ALL the following sections:

---

## Output Template

```markdown
# [Project Name] - Architectural Documentation

**Generated:** [date]
**Version:** [from package.json or git tag]
**Stack:** [detected stack]

---

## 1. Overview
- Project purpose and business context
- Key features and capabilities
- Target users/personas

## 2. Tech Stack
- Languages and versions
- Frameworks and libraries (with versions)
- Build tools and dev dependencies
- Infrastructure (Docker, cloud services, etc.)

## 3. Architecture
- Architecture pattern used (MVC, Clean, Hexagonal, etc.)
- System architecture diagram (ASCII/Mermaid)
- Component diagram showing modules and relationships
- Layer separation (presentation, business, data)

## 4. Project Structure
- Directory tree with descriptions for each folder
- Key files and their purposes
- Naming conventions used

## 5. Database
- Database type and version
- Entity-Relationship diagram (Mermaid)
- Tables/collections with field descriptions
- Indexes, constraints, relationships
- Migration strategy

## 6. API / Routes
- Complete endpoint listing (method, path, description)
- Authentication requirements per route
- Request/response schemas
- Error codes and handling

## 7. Data Flows
- User flow diagrams per feature
- Request lifecycle (from HTTP to DB and back)
- Event/message flows (if applicable)
- State management patterns

## 8. User Profiles & Permissions
- User roles (admin, user, etc.)
- Permission matrix (role x resource x action)
- Menu/screen access by role
- Authentication flow

## 9. Business Rules
- Core business logic documented
- Validation rules
- Pricing/billing logic (if applicable)
- AI usage patterns (if applicable)

## 10. Security
- Authentication method (JWT, OAuth, sessions, etc.)
- Authorization model (RBAC, ABAC, etc.)
- Data encryption (at rest, in transit)
- Secrets management
- Known vulnerabilities and recommendations

## 11. Deployment
- Deployment architecture diagram
- Environment configuration (dev, staging, prod)
- CI/CD pipeline description
- Docker/container setup
- Infrastructure requirements

## 12. Performance
- Current performance characteristics
- Identified bottlenecks
- Caching strategy
- Query optimization notes
- Scaling recommendations

## 13. UX Report
- Screen inventory
- Navigation flows
- Component library used
- Accessibility notes
- Mobile responsiveness

## 14. Technical Debt
- Known issues and workarounds
- Deprecated code/dependencies
- Refactoring opportunities
- Priority ranking (critical/high/medium/low)

## 15. Roadmap Suggestions
- Recommended improvements
- Missing features identified
- Architecture evolution suggestions
- Migration recommendations

## 16. Appendix
- Glossary of terms
- Environment variables reference
- Third-party service credentials needed (names only, NO values)
- Useful commands (build, test, deploy, etc.)
```

---

## Usage

```
/doc-project
```

Or with arguments:

```
/doc-project [path-to-project]
```

If no path is provided, uses the current working directory.

---

## Output

The documentation is saved as:
- `docs/ARCHITECTURE.md` - Complete documentation in the project root

---

## Rules

1. **Code in English, comments in English** - Follow AIOS Constitution
2. **Read before writing** - ALWAYS read source files before documenting
3. **No guessing** - Only document what is confirmed by reading the code
4. **Diagrams** - Use Mermaid syntax for all diagrams (renders in GitHub/VS Code)
5. **Actionable** - Every section should have actionable information, not just descriptions
6. **Include line counts** - Reference specific files and approximate line counts for key modules

---

## Integration with AIOS Agents

- **@architect**: Can be activated first to validate the architecture before documenting
- **@qa**: Can review the documentation for completeness
- **@dev**: Uses the documentation as implementation reference
- **@design-system**: Provides UI/component information for UX Report section

---

**Created:** 2026-02-20
**Inspiration:** "Claude Code para Empresarios" Live #038 (Alan) + aitplm.com skills
