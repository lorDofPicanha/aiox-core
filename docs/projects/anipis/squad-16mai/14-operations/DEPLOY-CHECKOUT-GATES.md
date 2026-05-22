# Anipis — Deploy Checkout / Pre-Push Quality Gates

**Data:** 2026-05-18
**Auditor:** Orion (aios-master) coordenando @tanya-janca + @jim-manico
**Escopo:** Quality gates que DEVEM passar antes de qualquer push pra `main` / deploy de produção

---

## TL;DR

CI atual roda **lint + typecheck + build**. ❌ **NÃO RODA TESTES** (876 testes existem, nenhum executa no CI). Esse é o gap #1. Plus: faltam **5 gates de segurança** (npm audit, secret scan, DEV-7 PII regression, Art.18 completeness, ZDR enforcement validation).

Este doc define os **8 gates obrigatórios** + workflow CI atualizado.

---

## Estado atual do CI

`.github/workflows/ci.yml` (35-86):
```yaml
jobs:
  lint       (✅)
  typecheck  (✅)
  build      (✅ needs: lint, typecheck)
```

**Gaps identificados:**
- ❌ Tests não rodam
- ❌ Sem security scan (npm audit / Snyk)
- ❌ Sem secret scan (gitleaks)
- ❌ DEV-7 PII regression gate não roda explicitamente (passa só via test run)
- ❌ Art.18 completeness gate não roda explicitamente (idem)
- ❌ Sem environment validation (boot test com prod env)

---

## Gates obrigatórios — Pré-Push

### Gate 1 — Lint ✅ (já existe)
```bash
cd apps/serenity-ai && npx turbo run lint
```
**Critério:** zero violations
**Tempo:** ~30s
**Bloqueia push?** Sim

### Gate 2 — TypeCheck ✅ (já existe)
```bash
cd apps/serenity-ai && npx turbo run typecheck
```
**Critério:** zero erros TS
**Tempo:** ~60s
**Bloqueia push?** Sim

### Gate 3 — Tests ❌ (ADICIONAR)
```bash
cd apps/serenity-ai && npx turbo run test
```
**Critério:** 100% passing (atual: 876/877, 1 flake pre-existente; meta = 877/877 quando flake corrigido)
**Tempo:** ~10s
**Bloqueia push?** **SIM — P0 add ASAP**

### Gate 4 — Build ✅ (já existe)
```bash
cd apps/serenity-ai && npx turbo run build
```
**Critério:** build success
**Tempo:** ~2-3min
**Bloqueia push?** Sim

### Gate 5 — Security Scan (npm audit) ❌ (ADICIONAR)
```bash
cd apps/serenity-ai && npm audit --audit-level=high --production
```
**Critério:** zero HIGH + CRITICAL vulnerabilities em production deps
**Tempo:** ~10s
**Bloqueia push?** **SIM — P0 add**
**Falsos positivos:** documentar em `.npmauditrc` quando justificado

### Gate 6 — Secret Scan (gitleaks) ❌ (ADICIONAR)
```bash
gitleaks detect --source . --no-git
# OR via GitHub Action
```
**Critério:** zero secrets em diff (API keys, JWT secrets, env files committed)
**Tempo:** ~30s
**Bloqueia push?** **SIM — P0 add**
**Whitelist:** `.gitleaks.toml` para placeholders conhecidos

### Gate 7 — PII Leak Regression (DEV-7) ❌ (ADICIONAR EXPLÍCITO)
```bash
cd apps/serenity-ai/apps/api && \
  npx vitest run src/__tests__/ci/pii-leak-regression.test.ts \
                  src/__tests__/ci/art18-completeness-gate.test.ts \
                  src/__tests__/config/env-zdr-enforcement.test.ts
```
**Critério:** 40+ tests passing (15 PII regression + 4 Art.18 + 10 ZDR + 12 others)
**Tempo:** ~3s
**Bloqueia push?** **SIM — P0 add as separate job**
**Por quê separado?** Estes são static-analysis gates que devem falhar IMEDIATAMENTE com mensagem clara, antes de rodar suite completa

### Gate 8 — Boot Validation ❌ (OPCIONAL pós-Beta)
```bash
NODE_ENV=production \
  OPENAI_ZDR_CONFIRMED=true ANTHROPIC_ZDR_CONFIRMED=true \
  SUPABASE_URL=... SUPABASE_ANON_KEY=... \
  ... \
  node -e "require('./apps/api/src/config/env.js'); console.log('boot OK')"
```
**Critério:** boot não chama `process.exit(1)` com env de prod simulado
**Tempo:** ~5s
**Bloqueia push?** Não (warning level — env de prod tem segredos reais)
**Recomendação:** rodar só no deploy pipeline, não no CI público

---

## Workflow CI atualizado (sugestão)

`.github/workflows/ci.yml` (substituir):

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ============================================
  # Fast feedback jobs (parallel, ~1 min each)
  # ============================================

  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install
        run: npm ci
      - name: Lint
        run: npx turbo run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install
        run: npm ci
      - name: Type Check
        run: npx turbo run typecheck

  # ============================================
  # NEW: Security gates (parallel, ~30s each)
  # ============================================

  security-scan:
    name: Security Scan (npm audit)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install
        run: npm ci
      - name: npm audit (production deps)
        run: npm audit --audit-level=high --production

  secret-scan:
    name: Secret Scan (gitleaks)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # full history for diff
      - name: Run gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  pii-regression-gate:
    name: PII Leak Regression Gate (DEV-7)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install
        run: npm ci
      - name: Run regression gates
        working-directory: apps/serenity-ai/apps/api
        run: |
          npx vitest run \
            src/__tests__/ci/pii-leak-regression.test.ts \
            src/__tests__/ci/art18-completeness-gate.test.ts \
            src/__tests__/config/env-zdr-enforcement.test.ts

  # ============================================
  # NEW: Full test suite
  # ============================================

  test:
    name: Test Suite
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install
        run: npm ci
      - name: Test
        run: npx turbo run test

  # ============================================
  # Build (must pass after lint + typecheck + test)
  # ============================================

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install
        run: npm ci
      - name: Turbo Cache
        uses: actions/cache@v4
        with:
          path: .turbo
          key: turbo-${{ github.sha }}
          restore-keys: |
            turbo-
      - name: Build
        run: npx turbo run build
        env:
          # Dummy env vars for build only
          SUPABASE_URL: https://placeholder.supabase.co
          SUPABASE_ANON_KEY: placeholder
          SUPABASE_SERVICE_ROLE_KEY: placeholder
          DATABASE_URL: postgresql://placeholder
          UPSTASH_REDIS_URL: https://placeholder.upstash.io
          UPSTASH_REDIS_TOKEN: placeholder
          OPENAI_API_KEY: placeholder
          ANTHROPIC_API_KEY: placeholder
          OPENAI_ZDR_CONFIRMED: 'false'
          ANTHROPIC_ZDR_CONFIRMED: 'false'
          NEXT_PUBLIC_API_URL: https://placeholder.api
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder

  # ============================================
  # Final gate (all must pass)
  # ============================================

  required-gates:
    name: All Required Gates
    runs-on: ubuntu-latest
    needs:
      - lint
      - typecheck
      - security-scan
      - secret-scan
      - pii-regression-gate
      - test
      - build
    steps:
      - name: All checks passed
        run: echo "All gates passed. Safe to merge."
```

---

## Pre-push hook (local — opcional mas recomendado)

Para desenvolvedores rodarem gates **antes** de push (evita CI fail):

`.husky/pre-push` (ou similar):
```bash
#!/bin/sh
set -e

cd apps/serenity-ai

echo "→ Lint..."
npx turbo run lint --filter=...

echo "→ Typecheck..."
npx turbo run typecheck --filter=...

echo "→ Tests..."
npx turbo run test --filter=...

echo "→ Regression gates..."
cd apps/api
npx vitest run \
  src/__tests__/ci/pii-leak-regression.test.ts \
  src/__tests__/ci/art18-completeness-gate.test.ts \
  src/__tests__/config/env-zdr-enforcement.test.ts

echo "✅ All pre-push gates passed."
```

---

## Deploy pipeline (post-merge to main)

Após merge em `main`, deploy pipeline DEVE:

### Stage 1 — Build & Push container
```bash
# API
cd apps/serenity-ai/apps/api
docker build -t anipis-api:${{ github.sha }} .
docker tag anipis-api:${{ github.sha }} registry.example/anipis-api:latest
docker push registry.example/anipis-api:${{ github.sha }}
docker push registry.example/anipis-api:latest

# Web (Vercel — automático via Git integration)
```

### Stage 2 — Smoke test container localmente
```bash
docker run -d --rm \
  --name anipis-smoke \
  -e NODE_ENV=test \
  -e SUPABASE_URL=https://placeholder.supabase.co \
  -e SUPABASE_ANON_KEY=placeholder \
  -e SUPABASE_SERVICE_ROLE_KEY=placeholder \
  -e DATABASE_URL=postgresql://placeholder \
  -e OPENAI_API_KEY=sk-placeholder \
  -p 3001:3001 \
  anipis-api:${{ github.sha }}

sleep 5
curl -f http://localhost:3001/health || (docker logs anipis-smoke && exit 1)
docker stop anipis-smoke
```

### Stage 3 — Deploy to staging
Manual approval gate → deploy to staging env → run smoke tests (ver `SMOKE-TEST-LIST.md`)

### Stage 4 — Deploy to production
Manual approval gate (founder + DPO sign-off para mudanças que afetam dados) → blue/green deploy → smoke tests → cutover

### Stage 5 — Post-deploy validation
- Verifica logs estruturados aparecem (pino)
- Verifica Sentry recebe heartbeat
- Verifica primeira request de saúde + uma autenticada via test user
- Roda smoke test list completo

---

## Pre-push checklist (manual — antes de cada push)

```
[ ] git status — sem arquivos não-relacionados
[ ] git diff — review próprio diff
[ ] npx turbo run lint
[ ] npx turbo run typecheck
[ ] npx turbo run test
[ ] npx vitest run src/__tests__/ci/ src/__tests__/config/
[ ] npm audit --audit-level=high --production
[ ] git log -1 — commit message descreve o "why"
[ ] git push origin <branch>
```

**Quando NÃO pushar:**
- ❌ Tests failing
- ❌ Typecheck errors
- ❌ Lint warnings em código novo (warnings antigos OK)
- ❌ Secrets em diff
- ❌ Migrations sem RLS em tabelas com PII
- ❌ Novos routes sem `verifyAuth` preHandler (lição F1)
- ❌ Novos LLM calls sem `redactForObservability` antes Langfuse
- ❌ Novos Sentry.init sem spread `SENTRY_HARDENED_OPTIONS`

---

## Action items (founder + devops)

### P0 (block Beta)
- [ ] Adicionar job `test` no CI (substituir `.github/workflows/ci.yml`)
- [ ] Adicionar job `security-scan` (npm audit)
- [ ] Adicionar job `secret-scan` (gitleaks)
- [ ] Adicionar job `pii-regression-gate`
- [ ] Configurar branch protection rule em `main` exigindo todos os jobs

### P1 (Beta window)
- [ ] Setup `.husky/pre-push` local hook
- [ ] Definir deploy pipeline staging + prod (Railway docs)
- [ ] Manual approval gates antes de prod

### P2 (post-Beta)
- [ ] Integrar Snyk (dependency vuln detail + license check)
- [ ] CodeQL ou Semgrep no PR (SAST)
- [ ] OWASP ZAP no staging (DAST)
- [ ] SBOM generation (CycloneDX)

— Orion 🎯 coordenando @tanya-janca + @jim-manico
