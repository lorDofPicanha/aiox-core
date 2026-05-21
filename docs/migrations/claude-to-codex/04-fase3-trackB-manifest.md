# FASE 3 — Track B Manifest (executado em Claude Code)

**Data execução:** 2026-05-19
**Status:** ✅ COMPLETO
**Branch:** `migration/codex-cutover`

Enquanto founder executa Track A (T1-T10 no Codex), Track B foi paralelizado aqui no Claude Code.

---

## Entregas Track B

### 1. Skill `aios-memory` (preservação completa)

**Localização:** `.codex/skills/aios-memory/`

| Item | Detalhe |
|---|---|
| Conteúdo | 201 arquivos copiados de `C:/Users/kingp/.claude/projects/D--AIOS/memory/` |
| Tamanho | 1.5 MB |
| SKILL.md | Instruções de uso, anti-patterns, file access pattern |
| Read-only | Source original intacto em `C:/Users/kingp/.claude/projects/D--AIOS/memory/` |

**Como Codex usa:**
1. User triggera contexto histórico (ex: "lembra quando", "no projeto X")
2. Codex carrega `.codex/skills/aios-memory/SKILL.md`
3. Lê `MEMORY.md` (índice 207 linhas)
4. Drill-down em arquivos específicos conforme necessidade
5. Cita source ao aplicar memória

**Zero loss garantido** — decisão founder "preservar tudo sem deixar nada para trás" honrada.

---

### 2. Conversão de 207 slash commands → Codex prompts

**Script criado:** `.aios-core/infrastructure/scripts/convert-commands-to-codex.js`

**Output:** `.codex/prompts/` (flat, sem subdirs — Codex spec)

| Métrica | Valor |
|---|---|
| Source total | 207 |
| Convertidos | 207 |
| Collisions | 0 |
| Manifest | `.codex/prompts/_manifest.json` |

**Estratégia de naming:**
- `AIOS/agents/<name>.md` → `<name>.md`
- `AIOS/stories/<name>.md` → `<name>.md`
- `synapse/<...>.md` → `synapse-<name>.md` (evita colisões com built-in)
- standalone → mantém nome (`greet.md`, `mission.md`, etc.)

**Frontmatter adicionado a cada arquivo:**
```yaml
---
description: "<contextual descrip>"
source: "claude-code .claude/commands/<original-path>"
migrated: "2026-05-19"
---
```

**Descrições por categoria:**
- AIOS agents (188): `Activate <name> — <title from YAML>` (ex: `Activate aios-master — AIOS Master Orchestrator & Framework Developer`)
- AIOS stories (1): `Story reference: <name>`
- synapse (9): `SYNAPSE: <name> command`
- standalone (9): derivada do primeiro parágrafo

**Invocação em Codex:**
- `/prompts:<name>` ou simplesmente `/<name>`
- Ex: `/abby-covert`, `/aios-master`, `/synapse-manager`, `/greet`

---

### 3. AGENTS.md atualizado

**Localização:** `D:/AIOS/AGENTS.md`

| Métrica | Valor |
|---|---|
| Tamanho | 16,383 bytes (16 KiB) |
| Cap Codex | 32,768 bytes (32 KiB) |
| Utilização | 50% — espaço sobrando para evolução |
| Seções | 17 |
| Linhas | 346 |

**Conteúdo (resumo):**
1. Constitution (6 artigos, NON-NEGOTIABLE)
2. Workflow obrigatório (5 passos)
3. Agent shortcuts (162+ mind clones + 12 core + 11 chiefs)
4. Mind clone consultation (triggers + how-to)
5. **Active context** (top-15 reminders + 13 feedback patterns)
6. Estrutura do projeto (.aios-core, .codex, .claude legado, docs/projects/*)
7. MCP servers (9 configurados)
8. Skills (55 em `.codex/skills/`)
9. Codex CLI specifics (modelo gpt-5.5, approval, sandbox, agents config)
10. IDE sync infrastructure (multi-IDE parity)
11. Convenções (naming, imports, TS, commits)
12. RTK (token optimization)
13. CLI First architecture
14. Migration status (FASE 1 ✅ FASE 2 ✅ FASE 3 ⏳)
15. Debug e troubleshooting
16. Frequently used commands
17. Founder profile

**Active reminders comprimidos (Seção 5.1):**
- Anipis pre-Beta (PRIORITY, 30/Mai)
- Anipis stack decisions D5-D18
- KR OAuth bloqueio
- KR V4 LINK_CLICKS
- Bretda Form WA / Images / Google OC
- Buscador Workflow v3
- IOX-Services Program
- Site-Prospector v1
- Squad Security v2.0
- CRM Novo Planning
- HYDRA Squad-AI
- Polymarket KILLED
- Migration Claude→Codex (este projeto)

**Feedback patterns ativos (Seção 5.2):**
- Tráfego: budget jump 2x cap, AI never autosend, contas separadas, geo BR
- Quality: always squads, check out-of-scope, kill sessions cleanly, luxury taste
- Bretda: mesas reais, Kodak Portra, disco C
- Git: PR destination, @devops exclusive push

**Tripla preservação executada:**
1. Snapshot intacto em `backup/memory/auto-memory-snapshot/`
2. Skill `aios-memory` com archive completo
3. Active context comprimido neste AGENTS.md

---

## Estado git pós-Track B

Mudanças exclusivas da migração nesta branch:

| Item | Tipo | Tamanho |
|---|---|---|
| `AGENTS.md` | Modificado | +16 KiB |
| `.codex/skills/aios-memory/` | Novo | +1.5 MB (201 files) |
| `.codex/prompts/` | Novo | 207 .md files + manifest.json |
| `.codex/config.toml` | Modificado | +[agents] section |
| `.aios-core/infrastructure/scripts/convert-commands-to-codex.js` | Novo | Script reutilizável |
| `.aios-core/development/agents/daniel-miessler.md` | Modificado | YAML fix |

**Branch:** `migration/codex-cutover`. **Pronto para commit/push** quando founder validar Track A.

---

## Próximos passos

### Track A — você (founder) executa no Codex CLI

Abrir `docs/migrations/claude-to-codex/03-fase3-test-plan.md` e rodar T1 até T10. Anotar resultados.

**Gate de FASE 3:**
- ≥ 8/10 PASS → FASE 4 (parallel period 5-10 dias)
- 6-7/10 PASS → diagnóstico + correção + re-teste
- < 6/10 PASS → BLOCKER

### Track B — eu (Claude Code) continuo após gate

Quando founder reportar score:
- Se PASS: redigir FASE 4 (parallel period instructions) + cutover checklist
- Se FAIL: análise root cause + plano de correção

---

## Como reverter Track B (se necessário)

```bash
# Voltar AGENTS.md para versão pré-migração
cp docs/migrations/claude-to-codex/backup/codex/AGENTS.md AGENTS.md

# Remover aios-memory skill (mantém source intacto)
rm -rf .codex/skills/aios-memory/

# Remover prompts gerados
rm -rf .codex/prompts/

# Reset branch
git checkout feat/hydra-resilience-sprint
git branch -D migration/codex-cutover
```

Todos backups em `docs/migrations/claude-to-codex/backup/`.
