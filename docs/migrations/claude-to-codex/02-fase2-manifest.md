# FASE 2 — Sync Completo Claude → Codex

**Data execução:** 2026-05-19
**Status:** ✅ COMPLETO
**Branch:** `migration/codex-cutover` (criada a partir de `feat/hydra-resilience-sprint`)
**Tempo total:** ~10 minutos

---

## 1. Execução

| Passo | Comando | Resultado |
|---|---|---|
| 1 | `git checkout -b migration/codex-cutover` | ✅ Branch criada preservando WIP |
| 2 | `npm run sync:ide:codex` | ✅ 55 agents + 4 redirects sincronizados |
| 3 | `npm run sync:skills:codex` | ✅ 55 skills geradas em `.codex/skills/` |
| 4 | Editar `.codex/config.toml` → adicionar `[agents] max_depth=2 max_threads=8` | ✅ Aplicado |
| 5 | `npm run validate:codex-sync --strict` | ✅ **PASS 59/59** |
| 6 | `npm run validate:codex-integration` | ✅ PASS (warning informativo) |
| 7 | `npm run validate:codex-skills --strict` | ✅ PASS 55/55 |

---

## 2. Estado final do .codex/

```
.codex/
├── agents/         (83 files: 55 sincronizados + 4 redirects + 24 manuais .toml)
├── skills/         (55 skills geradas)
├── hooks/          (12 hooks portados)
├── hooks.json      (PreToolUse → rtk)
└── config.toml     (atualizado com [agents])
```

### Mudanças no `config.toml`

Adicionado no topo do arquivo (antes dos MCP servers):

```toml
# Agent orchestration limits
# max_depth=2 permite chief→specialist→clone (decisão founder 19/Mai)
# max_threads=8 amplia paralelismo vs default 6
[agents]
max_depth = 2
max_threads = 8
```

Resolve risco #1 da matriz de migração — orquestrações `Orion → legal-chief → patricia-peck` agora suportadas.

---

## 3. Outputs do sync

### sync:ide:codex
```
Source: D:\AIOS\.aios-core\development\agents
Found 55 agents
✓ 55 agents, 4 redirects
✅ Sync complete: 55 agents + 4 redirects
```

Redirects gerados (de `entity-registry.yaml`):
- `aios-developer` → `aios-master`
- `aios-orchestrator` → `aios-master`
- `db-sage` → `data-engineer`
- `github-devops` → `devops`

### sync:skills:codex
```
✅ Generated 55 Codex skills in D:\AIOS\.codex\skills
```

### validate:codex-sync
```
| Total Expected | 59 |
| Synced         | 59 |
| Missing        |  0 |
| Drift          |  0 |
| Orphaned       |  0 |
Status: ✅ PASS
```

### validate:codex-integration
```
✅ Codex integration validation passed (agents: 59, skills: 55)
⚠️ Codex agent count differs from source (59/55)
```
**Warning:** informativo apenas — os 4 extras são os redirects esperados (55 + 4 = 59).

### validate:codex-skills
```
✅ Codex skills validation passed (55 skills checked)
```

---

## 4. Git state da migração

### Arquivos tocados pela FASE 2 (exclusivos da migração)

**Modified:**
- `.codex/config.toml` — adicionado `[agents]` section
- `.codex/agents/aios-master.md` — drift correction via sync
- `.aios-core/development/agents/daniel-miessler.md` — YAML fix (FASE 1)
- `.aios-core/development/agents/ux-design-expert.md` — drift correction via sync
- `.claude/commands/AIOS/agents/aios-master.md` — drift correction via sync

**Untracked novos (gerados pelo sync):**
- `.agents/` — diretório criado pelo sync (Codex spec path `.agents/skills`)
- `.codex/agents/aios-*.toml` — agents convertidos para TOML
- Outros `.codex/agents/*.toml`

**Não-relacionado à migração** (WIP pré-existente do founder, preservado):
- `.aios-core/data/entity-registry.yaml` (M)
- `.aios-core/data/jarvis-mind-clone-index.json` (M)
- `.aios-core/development/scripts/{agent-config-loader,generate-greeting,greeting-builder}.js` (M)
- 14 untracked cybersecurity agents em `.aios-core/development/agents/` (squad-security-v2 18/Mai)
- Deletions em `apps/tocks-website/docs/design/` (pre-existing)

---

## 5. Validação cross-IDE (full parity)

Estado de paridade entre os 3 IDEs sincronizados:

```bash
$ npm run sync:ide:check
# Claude Code, Codex, Gemini ALL parity ?
```

(Validar separadamente em FASE 3 — não é blocker da migração.)

---

## 6. Riscos resolvidos nesta fase

| Risco original | Status |
|---|---|
| #1 max_depth=1 quebra orquestrações | ✅ Resolvido (max_depth=2) |
| #3 YAML parse error + 47 missing + 4 drift | ✅ Resolvido (0/0/0 atual) |
| #5 Brain-bridge MCP comportamento | ⏭️ Próxima FASE — testar em runtime |
| #9 Drift Claude vs Codex em CI | ✅ Resolvido (validate gates passam) |

---

## 7. Próxima FASE (3 — Functional Validation)

Bateria de 10 testes em runtime Codex. Tempo estimado: 2-4h.

| # | Teste | Tipo |
|---|---|---|
| T1 | Spawn `legal-chief` para Tier 0 diagnostic | Subagent |
| T2 | `request_expert_consultation` via brain-bridge MCP | MCP runtime |
| T3 | Greeting + persona load | Agent activation |
| T4 | Hook execution (rtk-rewrite + jarvis-auto-consult) | Hooks |
| T5 | 2 agentes em paralelo | max_threads |
| T6 | Skill execution: agent-evals | Skill |
| T7 | Top-5 slash commands essenciais | Commands |
| T8 | `codex resume` session preservation | Memory |
| T9 | MCP tool call (mcp-ads-bridge.meta_ads_campaigns) | MCP tool |
| T10 | Workflow end-to-end (story-create → review → push) | Multi-step |

**Gate FASE 3:** ≥ 8/10 PASS. Se < 8, identificar gaps e bloqueio antes de FASE 4.

**Outras pendências para FASE 3:**
- Converter 207 slash commands → skills/commands Codex (estimativa 3-4h)
- Criar skill `aios-memory` com snapshot do auto-memory
- Comprimir 1.5MB de memória → ~20 KiB para AGENTS.md
- Atualizar AGENTS.md com active context

---

## 8. Como reverter (se necessário)

```bash
# Voltar pra branch original mantendo WIP
git checkout feat/hydra-resilience-sprint

# Apagar branch de migração
git branch -D migration/codex-cutover

# Restaurar config.toml original
cp docs/migrations/claude-to-codex/backup/codex/config.toml .codex/config.toml

# Restaurar daniel-miessler.md original (se necessário)
# (Está no working dir como untracked — pode ser revertido via reset)
```

Todos os backups críticos em `docs/migrations/claude-to-codex/backup/`.
