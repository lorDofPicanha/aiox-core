---
squad: dev (Dex)
date: 2026-05-14
phase: 2
gap_target: L3 (context pruning) + AIOS dev productivity
sources_count: 10+
---

# 💻 Dossier @dev — Claude Code Best Practices 2026

## 1. Princípios fundamentais

### 1.1 Subagent vs main session — quando usar

**Use subagent quando:**
- Side task floods main conversation com search results, logs, file contents que você não vai referenciar de novo
- Research thread isolado (competitive analysis, codebase audit, doc synthesis)
- Quer preservar context budget do main session

**NÃO use subagent quando:**
- O resultado precisa de iteração próxima com o main session
- Task é trivial (overhead > benefício)
- Você precisa de coordenação tight com outras tools

> "Subagents help preserve context by keeping exploration and implementation out of your main conversation."

### 1.2 Context window thresholds (regra prática 2026)

| Perfil | Threshold máximo | Comentário |
|--------|------------------|------------|
| Newcomers | < 40% | Margem de segurança |
| Experienced | < 30% agressivo | Ship + clear sessão frequente |
| Tasks simples | até 60% | Aceitável temporariamente |
| **Context rot zone** | **300-400k tokens** | Modelo começa perder coerência (mesmo no 1M) |

**Regra:** `tokens / max_tokens < 0.3` → keep working. `> 0.6` → split em subagents ou nova sessão.

### 1.3 Agent Teams (experimental Claude Code 2026)

Diferença crítica vs subagents:
- **Subagent:** roda em context próprio, retorna summary pro main → main é único intermediador
- **Agent Team:** "team lead" coordena via shared task list, "teammates" comunicam direto entre si

**Custo:** Agent Teams adicionam coordination overhead, usam significantly more tokens. Vale só quando teammates operam em escopos distintos com benefício de comunicação.

### 1.4 Stack convergence pattern (não consolidação)

> "Cursor, Claude Code, and OpenAI Codex are forming a composable AI coding stack with orchestration, execution, and review layers — instead of consolidating into one tool."

Setup vencedor: **IDE agent (Cursor) pra trabalho diário + terminal agent (Claude Code) pra hard problems**.

## 2. Aplicação imediata em AIOS dev workflow

### 2.1 Padrão recomendado para tasks AIOS

| Task type | Use |
|-----------|-----|
| Implementar 1 story (~500 LOC) | Main session direto |
| Cross-codebase research (3+ files unknown) | Subagent (Explore) |
| Audit branch entire | Subagent (general-purpose) |
| Multi-feature parallel | Multiple Task subagents em parallel |
| Story implementation com 5+ files | Main session, mas use Plan tool first |

### 2.2 Lacuna L3 — context pruning automatizado

`.claude/agent-memory/{agent}/MEMORY.md` cresce indefinidamente. Hoje aios-dev tem ~25KB+ memory, perto do limit 24.4KB que warn.

Proposta concreta:
1. Hook `session_end` que roda `aios memory consolidate`
2. Script lê MEMORY.md → identifica entries > 30 dias sem reference em conversation logs → sugere arquivar
3. Promover patterns recorrentes (3+ vezes citados) para "validated playbook" (pasta separada `validated/`)

### 2.3 Anti-padrão observado em AIOS

Memory entry típica hoje (anti-padrão):
```markdown
- [Bretda 17/Abr P1](project_bretda_session_17abr_p1.md) — Meta +20%, OAuth reauth OK, CPL R$9,29
```

Problema: 70+ entries acumuladas, índice estourou 24KB. Zero pruning automatizado.

**Aprendizado correto:** memory deve ser COMPACT TODAY context-relevant, não TIMELINE histórico. Histórico vai pra git log + commit messages, não memory.

## 3. Anti-padrões em multi-agent dev (evitar)

| Anti-padrão | Custo |
|-------------|-------|
| Spawnar Agent Team pra task que cabe em main session | 3-5x tokens, 2x latência |
| Subagent sem prompt self-contained | Resultado genérico (subagent não vê histórico) |
| Multiple subagents em série quando podiam ser paralelos | Tempo perdido sem benefício |
| Não usar Plan tool antes de implementação > 200 LOC | Re-work garantido |
| Manter session > 60% context "porque ainda funciona" | Context rot silencioso |

## 4. Quiz de verificação

**Q1.** Quando você NÃO deve spawnar um subagent?

**Q2.** Qual o context threshold máximo recomendado pra "experienced users" e por quê 30% é mais agressivo que 40%?

**Q3.** Diferença entre subagent e Agent Team. Quando vale o trade-off de Agent Team?

**Q4.** Olhando `.claude/agent-memory/aios-dev/MEMORY.md` (ou MEMORY.md global), identifique 1 entry que poderia ser arquivada (e por quê).

**Q5.** Você precisa implementar uma story de 800 LOC tocando 6 arquivos. Como organiza? (main session vs subagents vs Agent Team) Justifique.

**Q6.** Verdadeiro ou falso: "Quanto mais subagents em paralelo, mais rápido o trabalho fica." Explique.

## 5. Fontes (primary)

- [Create Custom Subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents)
- [Multi-agent Orchestration for Claude Code 2026 — Shipyard](https://shipyard.build/blog/claude-code-multi-agent/)
- [Claude Code Agent Teams Setup 2026 — ClaudeFa](https://claudefa.st/blog/guide/agents/agent-teams)
- [Sub-Agents in Claude Code Manage Context — MindStudio](https://www.mindstudio.ai/blog/sub-agents-claude-code-context-management)
- [Context Management — Claude Code Best Practices](https://muhammadusmangm.github.io/claude-code-best-practices/guides/context-management/)
- [Cursor, Claude Code, Codex Stack — TheNewStack](https://thenewstack.io/ai-coding-tool-stack/)
- [Dive into Claude Code — VILA-Lab GitHub](https://github.com/VILA-Lab/Dive-into-Claude-Code)

## 6. Metadata pra learning loop

- **Pass criteria:** 5/6 questões corretas, Q4 obrigatório citar entry real do MEMORY.md
- **Failure action:** Re-study 1.1+1.2, re-quiz com Q1+Q5 reformuladas
