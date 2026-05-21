---
name: Push Blocker SynkraAI — RESOLVIDO via fork
description: 403 em SynkraAI/aios-core contornado via fork workflow (A1). lorDofPicanha tem ADMIN em fork pessoal lorDofPicanha/aiox-core. Epic 8 PR #634 aberto cross-repo.
type: project
originSessionId: f4605a37-31e9-4e95-a474-8aa0ac571ca0
---
# Push Blocker — SynkraAI/aios-core

## ✅ Status: RESOLVIDO 17/Abr

**Caminho adotado (A1):** Fork workflow cross-repo. `lorDofPicanha` tem `admin: true` + `push: true` em `lorDofPicanha/aiox-core` (fork pessoal). Push vai para o fork, PR aberto cross-repo para `SynkraAI/aios-core:main`.

**Remote `fork` configurado:** `https://github.com/lorDofPicanha/aiox-core.git`

**Exemplo executado (Epic 8):**
```
git push -u fork feat/epic-8-tocks-website
gh pr create --repo SynkraAI/aios-core --base main \
  --head lorDofPicanha:feat/epic-8-tocks-website ...
→ PR #634 OPEN
```

**Como aplicar em futuras sessões:** use `git push fork <branch>` + `gh pr create --repo SynkraAI/aios-core --head lorDofPicanha:<branch>`.

## Histórico — Situação original (17/Abr, pre-resolução)

**Local main está 34 commits à frente de origin/main:**
- 6 commits do Sprint Design Squad (2ad3c861, c46c19e6, 440a3afb, 1980d90b, 53ed0947, 213af291)
- 28 commits anteriores (polymarket-trader P1-P5, tocks-website, tocks-sales-ai, tocks-lp, hydra, jarvis, hooks, corporation) — sprints passados não-pushados

**Erro:**
```
HTTP 403 — Permission to SynkraAI/aios-core.git denied to lorDofPicanha
```

**Conta git configurada:** `lorDofPicanha` (email: `brenodecerqueira@gmail.com`)

## Root Cause

Conta `lorDofPicanha` **não é membro ou colaborador** da org `SynkraAI` (ou do repo `aios-core`) com permissão `write`.

Adicionalmente: `gh` CLI não autenticado (não foi possível criar issue de tech-debt).

## Caminhos para desbloquear (requer ação do usuário)

1. **Add collaborator** — usuário owner do `SynkraAI` adiciona `lorDofPicanha` como collaborator com `write` permission (recomendado)
2. **SSH com chave cadastrada em conta autorizada:**
   ```
   git remote set-url origin git@github.com:SynkraAI/aios-core.git
   ```
3. **PAT de conta autorizada:**
   ```
   git remote set-url origin https://<token>@github.com/SynkraAI/aios-core.git
   ```
   (NÃO recomendado — expõe token no git config)
4. **Fork pessoal** — usuário cria fork em sua própria conta, muda remote, push lá

## Pre-push gates (contexto complementar)

Quando push for desbloqueado, gates seguem estado:
- ✅ typecheck — limpo
- ❌ lint — 13.769 errors + 15.758 warnings (100% lastro pré-existente em tools/spurgeon-chat + tools/hydra ESM config)
- ❌ test — 63 suites failed / 129 tests failed (mesmas tools, ESM parse errors)

Usuário autorizou push AS-IS com gates red. Falhas NÃO vêm dos 6 commits do sprint.

## Estado ao final da sessão

- **origin/main HEAD:** `6eaa7aa9` (feat(code-intel): dev task enhancement [Story NOG-3])
- **local main HEAD:** `213af291` (design-squad: handoffs system)
- **Diff:** 34 commits à frente
- **Working tree:** 1.456 arquivos modificados/untracked (lastro não relacionado, intocado)

## Impacto

**Local:** zero. Squad Design ATIVO, usuário pode invocar `@design-lead`, `@ui-designer`, etc. agora.

**Remote:** backup de 34 commits represado — risco se disk/laptop morrer, sem colaboração em time. Resolver na próxima sessão de GitHub ops.
