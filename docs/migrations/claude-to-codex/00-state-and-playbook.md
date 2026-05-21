# Migração Claude Code → Codex CLI

**Data:** 2026-05-19
**Origem:** decisão founder Breno (atualização Claude Code de 15/Mai)
**Status:** PLANEJAMENTO

---

## 1. Inventário do que existe (estado real, não memória)

| Componente | Quantidade | Localização | Natureza |
|---|---|---|---|
| AIOS agents canônicos | 55 | `.aios-core/development/agents/*.md` | YAML + persona (Claude-specific) |
| Mind clones | 111 entries | `.aios-core/data/jarvis-mind-clone-index.json` | Index + arquivos em jarvis/ |
| Claude skills | 28 | `.claude/skills/*/` | SKILL.md + scripts |
| Slash commands | 207 | `.claude/commands/**/*.md` | Markdown invocáveis |
| Hooks (Claude) | 5 | `.claude/hooks/` | py + cjs |
| Active projects | 20 | `docs/projects/*/` | Markdown + assets |
| MCP servers | 9 declarados | `.mcp.json` + `.codex/config.toml` | aios-brain-bridge, mcp-ads-bridge, mcp-design-studio, mcp-image-studio, refero, stitch, nano-banana-2, playwright, 21st-dev/magic |
| Scripts custom Node.js | 177 | `.aios-core/development/scripts/` + `infrastructure/scripts/` | LLM-agnostic |
| Workflows YAML | 15 | `.aios-core/development/workflows/` | LLM-agnostic |
| Tasks markdown | 211 | `.aios-core/development/tasks/` | LLM-agnostic |
| Templates YAML | 78 | `.aios-core/product/templates/` | LLM-agnostic |
| Auto-memory | 1.6 MB | `C:\Users\kingp\.claude\projects\D--AIOS\memory\` | Claude-Code-specific |

## 2. Codex já está configurado (descoberta crítica)

Setup feito em 17-18/Mai (provavelmente preparação para esta migração):

| Item | Estado em `.codex/` | Estado em `~/.codex/` |
|---|---|---|
| Agentes convertidos | **36** (.toml + .md mix) — 19 ainda missing vs Claude | — |
| Hooks convertidos | **12** (mais que .claude!) — incluindo synapse-engine, precompact-session-digest, sql-governance | — |
| Skills convertidas | **12** (todas AIOS-* + variantes) | vazio |
| MCP servers | aios-brain-bridge, mcp-ads-bridge, mcp-design-studio, mcp-image-studio, refero | @21st-dev/magic, nano-banana-2, playwright, stitch |
| `config.toml` | repo MCPs locais | model = "gpt-5.5", plugins: browser, documents, presentations, spreadsheets, vercel |
| `hooks.json` | PreToolUse → rtk-rewrite.sh | — |
| `AGENTS.md` | 75 linhas, com shortcuts e instruções de paridade | — |
| Sessions ativas | — | 21 KB external_agent_session_imports + 7 MB logs sqlite |

### Sync infrastructure existente (já programada para migração)

```bash
npm run sync:ide:codex          # sincroniza arquivos AIOS → .codex/
npm run validate:codex-sync     # valida paridade
npm run validate:codex-integration  # testa integração funcional
npm run sync:skills:codex       # gera skills no Codex
npm run validate:codex-skills   # valida skills
```

### Resultado atual do `validate:codex-sync --strict`

```
Total Expected: 58
Synced: 8
Missing: 46
Drift: 4
Status: FAIL
```

**Diagnóstico:** Claude Code está ahead, Codex está stale. Migração formal = rodar sync + corrigir drift + cutover.

Há também 1 YAML parse error em agent (linha 47:227) que precisa ser corrigido antes do sync.

---

## 3. Capacidades do Codex CLI (2026) — paridade vs Claude Code

### O que tem 1:1

| Feature Claude Code | Equivalente Codex | Compatibilidade |
|---|---|---|
| `CLAUDE.md` | `AGENTS.md` (global + repo) | ✅ Direto. ⚠️ Limite 32 KiB (`project_doc_max_bytes`) |
| `.claude/skills/` | `.agents/skills/` ou `.codex/skills/` (local-first) | ✅ AIOS já usa `.codex/skills/` |
| Slash commands (`/cmd`) | Slash commands nativos + custom | ✅ Suportado (guide separado) |
| `Agent` / subagents | Subagents TOML | ✅ MAS `max_depth=1` default, `max_threads=6` |
| MCP | MCP (mesmo protocolo) | ✅ 1:1 |
| Hooks (PreToolUse, etc) | Hooks com regex matcher | ✅ Mesmo formato |
| Permission modes (ask/auto/explore) | Approval policies (untrusted/on-request/never/reject) | ⚠️ Mapeamento direto |
| Memory `MEMORY.md` | `codex resume` + `~/.codex/memories/` | ⚠️ Diferente — não há auto-memory por projeto |
| `Task` tool tracking | Não-nativo, mas via skills ou plugins | ⚠️ Reimplement |
| Plugins (claude-plugins-official) | Plugins Codex (próprio mercado) | ⚠️ Marketplace diferente |

### O que degrada

| Feature | Por quê degrada |
|---|---|
| Personas elaboradas (Aria, Dex, Orion, etc.) | Codex só tem `nickname_candidates` (cosmético). Não há persona engine. Greeting/voice/archetype customization é perdido. |
| Auto-memory por projeto (1.6 MB) | Codex memória é transcript local + memórias globais. Não há auto-save por projeto baseado em triggers. |
| `Agent` tool com aninhamento (subagent dentro de subagent) | `agents.max_depth=1` default. Orquestrações multi-nível (ex: `aios-master → legal-chief → patricia-peck consult`) quebram. |
| Greeting via UnifiedActivationPipeline | Não há mecanismo equivalente — só AGENTS.md + skills |
| SYNAPSE 8-layer context engine | Provavelmente funciona como skill mas precisa testar/portar |
| 207 slash commands cobertura | Codex suporta slash commands mas a sintaxe e descoberta podem ser diferentes. Provável conversão skill-by-skill. |

### O que precisa rebuild

| Feature | Trabalho |
|---|---|
| Hook `jarvis-auto-consult.cjs` | Já portado para `.codex/hooks/` — validar funcional |
| Mind clone consultation routing | Funciona via brain-bridge MCP. Validar que `request_expert_consultation` etc continuam funcionais |
| Greeting builder | Possivelmente portar como skill `aios-greeting` |
| TaskCreate/TaskList | Pode existir como plugin Codex; senão, implementar como skill |

### O que se perde (assumir loss)

| Feature | Mitigação |
|---|---|
| Persona archetype/zodiac customization | Aceitar — virá como `nickname_candidates` em TOML |
| Slash command auto-discovery exato | Aceitar — usuário pode precisar memorizar localização |
| Algumas integrações claude-plugins-official (Vercel skills 30+) | Substituir por Codex equivalentes onde existirem |

---

## 4. Riscos críticos (priorizados por impacto × probabilidade)

| # | Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|---|
| 1 | **`agents.max_depth=1`** quebra orquestrações multi-nível (aios-master → chief → clone) | ALTO | ALTA | Aumentar para 2 ou flatten via direct calls. Testar com workflow real (legal-chief diagnostic). |
| 2 | **Auto-memory 1.6 MB não migra** automaticamente; perda de contexto histórico | ALTO | ALTA | Síntese executiva → cola em AGENTS.md como "histórico ativo". Manter `.claude/projects/D--AIOS/memory/` como referência consultável. |
| 3 | **YAML parse error** em 1 agent + 4 drift + 46 missing | MÉDIO | CERTA (já presente) | Corrigir error → rodar sync → validar |
| 4 | **AGENTS.md 32 KiB cap** | MÉDIO | ALTA | Cortar CLAUDE.md atual; mover detalhes para skills/refs |
| 5 | **Brain-bridge MCP** pode comportar-se diferente sob gpt-5.5 (latência, tool selection) | ALTO | MÉDIA | Testar 3 consultations sintéticas pré-cutover (architect, legal, copy) |
| 6 | **207 slash commands** podem não converter automaticamente | MÉDIO | ALTA | Inventariar quais são essenciais; converter top-20 → skills, deprecar long-tail |
| 7 | **Personas dilution** — Orion/Dex/Aria viram só nicknames | BAIXO | CERTA | Aceitar perda de UX cosmético; manter core behavior via developer_instructions |
| 8 | **Sessions já ativas em Codex** podem ter divergência de estado | BAIXO | MÉDIA | Validar `external_agent_session_imports.json` antes do cutover |
| 9 | **CLAUDE.md vs AGENTS.md** divergência durante hybrid period | MÉDIO | ALTA | `validate:parity` em CI pre-push |
| 10 | **Modelos diferentes** (Claude Opus 4.7 vs gpt-5.5) podem produzir output qualitativamente diferente | ALTO | CERTA | Aceitar; rodar A/B em 3 tarefas controladas (story-create, code-review, legal-analysis) |

---

## 5. Migration Playbook — 5 fases

### FASE 1 — Pre-flight (2-3h)
**Objetivo:** Estabilizar estado atual antes de mexer em qualquer coisa.

1. **Backup completo** — `.claude/`, `.codex/`, `.aios-core/`, `docs/`, `.mcp.json`, auto-memory
2. **Fix YAML error** em agent (linha 47:227) — investigar qual file
3. **Snapshot auto-memory** — extrair síntese executiva 1.6MB → 32KiB para AGENTS.md
4. **Listar 207 commands** → priorizar top-20 essenciais

**Gate:** branch `migration/codex-cutover` criada, snapshot validado.

---

### FASE 2 — Sync completo Claude → Codex (1-2h)
**Objetivo:** Eliminar drift (46 missing + 4 drift).

1. `npm run sync:ide:codex` — gera os 46 faltantes
2. `npm run sync:skills:codex` — atualiza skills
3. `npm run validate:codex-sync --strict` — deve retornar 0 missing, 0 drift
4. `npm run validate:codex-integration` — testa integração funcional
5. **Adicionar** ao `.codex/config.toml`:
   - `[agents] max_depth = 2` (resolve risco #1)
   - `[agents] max_threads = 8` (mais paralelismo)

**Gate:** validate:codex-sync = PASS.

---

### FASE 3 — Functional validation (2-4h)
**Objetivo:** Provar que Codex faz o trabalho com qualidade comparável.

**Bateria de testes (executar em Codex, comparar com Claude baseline):**

| # | Teste | Critério de PASS |
|---|---|---|
| T1 | Spawn `legal-chief` para diagnóstico Tier 0 | Output ≥ 80% similar em estrutura e cobertura |
| T2 | `request_expert_consultation` via brain-bridge MCP | Mind clone responde com voz fiel |
| T3 | Generate-greeting equivalent (carregar persona) | Greeting aparece (mesmo que cosmético perdido) |
| T4 | Hook execution: rtk-rewrite + jarvis-auto-consult | Hooks rodam, output esperado |
| T5 | Spawn 2 agentes em paralelo | Ambos completam, max_threads honored |
| T6 | Skill execution: agent-evals em 1 consultation | Score calculado |
| T7 | Slash command custom (top-5 essenciais) | Invocam corretamente |
| T8 | Session resume (`codex resume`) | Estado preservado |
| T9 | MCP tool call (mcp-ads-bridge meta_ads_campaigns) | Funcional, retorna dados |
| T10 | Multi-step workflow (story-create → review → push) | End-to-end PASS |

**Gate:** ≥ 8/10 PASS. Se < 8, identificar gaps e bloqueio.

---

### FASE 4 — Parallel period (5-10 dias)
**Objetivo:** Rodar Claude + Codex em paralelo enquanto convicção é construída.

- Todo trabalho NOVO faz em Codex
- Trabalho existente em Claude continua em Claude até completar
- Bug em Codex? Volta pra Claude pra resolver até patch
- Manter `validate:parity` em CI pre-push
- **Métrica de cutover-readiness:** 5 dias consecutivos sem voltar pra Claude

**Gate:** 5 dias consecutivos só-Codex sem regressões.

---

### FASE 5 — Cutover + Cleanup (1h)
**Objetivo:** Claude Code fica como backup-only.

1. Mover `CLAUDE.md` → `CLAUDE.md.deprecated` (manter como referência)
2. AGENTS.md vira fonte única
3. Atualizar `.gitignore` e scripts para Codex-primary
4. Documentar em `README.md` que projeto é Codex-first
5. **Manter** `.claude/` por 90 dias (rollback safety)
6. Após 90d sem regressão: `.claude/` → backup externo, remover do repo

**Gate:** README atualizado, equipe (você) informado, rollback documentado.

---

## 6. Cronograma sugerido

| Dia | Atividade | Tempo |
|---|---|---|
| D+0 (hoje) | FASE 1 — backup + fix YAML + snapshot memory + listar commands | 3h |
| D+1 | FASE 2 — sync + validate | 2h |
| D+2 | FASE 3 — bateria de 10 testes | 4h |
| D+3 a D+8 | FASE 4 — parallel run (operação normal) | passivo |
| D+9 | FASE 5 — cutover | 1h |
| D+99 (3 meses) | Remoção definitiva `.claude/` | 30min |

**Tempo total ativo:** ~10h. Parallel period é passivo (apenas operar).

---

## 7. Decisões pendentes do founder

1. **Aumentar `agents.max_depth` para 2?** (Resolve risco #1, mas aumenta token usage)
2. **Manter auto-memory atual como referência consultável** ou **converter para skill**?
3. **207 slash commands:** preservar todos via skills (esforço alto) ou pruning agressivo (top-20)?
4. **Personas:** aceitar perda cosmética (Orion vira nickname) ou portar via developer_instructions ricos (esforço médio)?
5. **Cronograma:** hoje começamos FASE 1, ou definir data?
