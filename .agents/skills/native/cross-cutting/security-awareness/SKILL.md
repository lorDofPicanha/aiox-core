---
name: security-awareness
description: "OWASP top 10, input validation, env vars (never hardcode secrets), LGPD basics, when to escalate to @security squad."
category: cross-cutting
agents: ["all"]
priority: critical
---

# Security Awareness

## Overview

Every AIOX agent must maintain baseline security awareness. This is not about being a security expert — it is about recognizing risks, following safe defaults, and knowing when to escalate. The three pillars: never hardcode secrets, validate all inputs, and know when to call for help.

## When to Use

- Writing any code that handles user input
- Working with authentication, authorization, or tokens
- Handling sensitive data (PII, credentials, financial)
- Configuring environment variables or deployment
- Reviewing code for security implications
- Any time you think "this probably doesn't matter" about security

## How To

### The Non-Negotiables

#### 1. NEVER Hardcode Secrets

```javascript
// WRONG — hardcoded secret
const API_KEY = "sk-abc123def456";
const DB_PASSWORD = "super_secret";

// CORRECT — environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

- All secrets go in `.env` files (never committed to git)
- `.env` must be in `.gitignore`
- Use `.env.example` with placeholder values for documentation
- Rotate secrets immediately if accidentally committed

#### 2. Validate ALL Input

```javascript
// WRONG — trusting user input
const userId = req.params.id;
db.query(`SELECT * FROM users WHERE id = ${userId}`);

// CORRECT — parameterized query
const userId = parseInt(req.params.id, 10);
if (isNaN(userId)) throw new ValidationError("Invalid user ID");
db.query("SELECT * FROM users WHERE id = $1", [userId]);
```

- Validate type, length, format, and range
- Use parameterized queries (never string concatenation for SQL)
- Sanitize HTML output to prevent XSS
- Reject unexpected fields (allowlist over denylist)

#### 3. Know When to Escalate

Escalate to `@security` squad or `@devops` immediately when:
- Suspected data breach or unauthorized access
- Credentials found in code or logs
- Dependency with known CVE (critical/high)
- Authentication/authorization bypass discovered
- PII exposure or LGPD violation risk

### OWASP Top 10 Quick Reference

| # | Risk | What to Watch For |
|---|------|-------------------|
| A01 | Broken Access Control | Missing auth checks, IDOR, privilege escalation |
| A02 | Cryptographic Failures | Weak hashing, plaintext secrets, HTTP (not HTTPS) |
| A03 | Injection | SQL, NoSQL, OS command, LDAP injection via user input |
| A04 | Insecure Design | Missing rate limits, no abuse controls |
| A05 | Security Misconfiguration | Default credentials, verbose errors, open S3 buckets |
| A06 | Vulnerable Components | Outdated deps with known CVEs |
| A07 | Auth Failures | Weak passwords, missing MFA, session fixation |
| A08 | Data Integrity Failures | Untrusted deserialization, unsigned updates |
| A09 | Logging Failures | No audit trail, sensitive data in logs |
| A10 | SSRF | Unvalidated URLs in server-side requests |

### LGPD Basics (Brazil Data Protection)

- **Consent required** before collecting personal data
- **Purpose limitation** — collect only what is needed
- **Data minimization** — store minimum necessary
- **Retention limits** — define and enforce data expiry
- **Right to deletion** — users can request data removal
- **Audit trail** — log who accessed what and when
- **Incident notification** — 72h to report breaches to ANPD

### Environment Variable Hygiene

```bash
# .env.example (committed — shows structure, not values)
DATABASE_URL=postgresql://user:pass@host:5432/db
API_KEY=your-api-key-here
JWT_SECRET=generate-a-strong-secret

# .env (NEVER committed)
DATABASE_URL=postgresql://prod_user:r3alP@ss@db.host:5432/prod_db
API_KEY=sk-abc123actualkey
JWT_SECRET=k8s9d7f6g5h4j3k2l1
```

- `.env` in `.gitignore` — always verify
- Different `.env` per environment (dev, staging, prod)
- Use secret managers (Vault, AWS Secrets Manager) in production
- Never log environment variables or secret values

### Security Checklist (Per Story)

- [ ] No hardcoded secrets, tokens, or passwords
- [ ] All user input validated and sanitized
- [ ] SQL queries use parameterized statements
- [ ] Authentication checks on protected routes
- [ ] Authorization checks (user can only access their data)
- [ ] Sensitive data not logged or exposed in errors
- [ ] Dependencies checked for known vulnerabilities
- [ ] `.env` file in `.gitignore`

## Examples

**Secure API endpoint:**
```javascript
// Rate limiting + auth + input validation + parameterized query
router.get("/orders/:id",
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }),
  authenticate,
  authorize("orders:read"),
  async (req, res) => {
    const orderId = validateUUID(req.params.id);
    const order = await db.query(
      "SELECT * FROM orders WHERE id = $1 AND tenant_id = $2",
      [orderId, req.user.tenantId]
    );
    res.json(sanitizeOutput(order));
  }
);
```

**Catching a security issue in review:**
```
FINDING: Line 42 of auth-middleware.js logs the JWT token:
  console.log(`Auth token: ${token}`);
RISK: Token exposure in log aggregators (OWASP A09)
FIX: Remove token from log, log only token prefix for debugging:
  console.log(`Auth token: ${token.substring(0, 8)}...`);
ESCALATE: No (fix is straightforward)
```

## Anti-Patterns

- Hardcoding API keys "just for testing" and forgetting to remove
- Trusting client-side validation as the only validation
- Using `eval()` or dynamic code execution with user input
- Logging full request bodies that may contain PII
- Disabling CORS for convenience
- Using `*` for CORS origins in production
- Storing passwords in plaintext or with weak hashing (use bcrypt/argon2)
- Catching security errors silently without logging
- Assuming internal APIs do not need authentication
- Committing `.env` files to git, even "temporarily"
