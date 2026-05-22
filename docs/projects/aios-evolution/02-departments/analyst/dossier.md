---
squad: analyst (Alex)
date: 2026-05-14
phase: 2
gap_target: L1 (context engineering as discipline)
sources_count: 8+
---

# 🔬 Dossier @analyst — Context Engineering as Discipline 2026

## 1. Princípios fundamentais

### 1.1 Context engineering = nova disciplina (não mais "prompt engineering")

> "A model's intelligence is increasingly less constrained by the model itself and increasingly more determined by the quality of context we provide."

Em 2026, capabilities dos modelos saturaram pra muitos use cases. Diferencial = **qualidade do context fornecido**.

### 1.2 Anatomia de context engineering

5 atividades-core:
1. **Selection** — quais facts/docs/exemplos vêm pro context
2. **Compression** — chunking, summarization de transcripts longos
3. **Reflection** — score importance antes de promover (não tudo vira long-term)
4. **Pruning** — periodicamente remover stale, dedupe duplicates
5. **Consolidation** — promover patterns recorrentes pra playbook

### 1.3 Agentic Context Engineering (ACE) — pattern arXiv 2025

```
Generator (gera output)
  ↓
Reflector (avalia, detecta erros, identifica gaps)
  ↓
Curator (extrai learnings, atualiza "context playbook")
  ↓
Próxima execução: playbook injetado automaticamente
```

Resultado mensurado: +10.6% benchmark gain SEM fine-tuning. **Method de melhoria contínua sem retraining.**

### 1.4 Aplicação @analyst em AIOS

Research methodology atualizada:
1. Research multi-source via WebSearch + WebFetch
2. Synthesis em deliverable (master-synthesis.md tipo este)
3. **Reflection step (novo):** identificar lacunas/contradições entre sources
4. **Curator step (novo):** atualizar "research playbook" — patterns que se repetem entre research projects
5. Distribute pro consultation engine

### 1.5 Lacuna L1 AIOS — application

@analyst é candidato natural pra owner do "research playbook" cross-project. Hoje cada project research é silo. Proposta:
- `docs/research-playbook/patterns.md` — patterns recorrentes (e.g., "always validate CAC threshold antes de scale")
- @analyst owns, atualiza após cada projeto research
- Outros agents consultam antes de propor approach

### 1.6 Brainstorming techniques (anchor para AIOS)

`.aios-core/development/data/brainstorming-techniques.md` lista 27 técnicas (Six Hats, SCAMPER, 5 Whys, etc.). Em 2026:
- AI agents podem **executar** SCAMPER em paralelo (cada lente em subagent)
- Mas **synthesis humana** ainda crítica — agents geram, human integra

## 2. Anti-padrões

| Anti-padrão | Custo |
|-------------|-------|
| Promover tudo pra long-term memory | Context window inundado, recall degrada |
| Skip reflection step | Repete erros de research anteriores |
| Single-source research | Bias amplification |
| Context pruning manual + esporádico | Stale facts contaminam decisions |

## 3. Quiz

**Q1.** Por que "context engineering" é diferente de "prompt engineering"?

**Q2.** Cite as 5 atividades-core de context engineering.

**Q3.** Descreva o pattern ACE. Qual o ganho mensurado vs alternativa fine-tuning?

**Q4.** Olhe `.aios-core/development/data/brainstorming-techniques.md` — qual técnica já está documentada e poderia ser orquestrada com subagents em paralelo?

**Q5.** Proponha estrutura de `docs/research-playbook/patterns.md` — quais 3 seções faria?

**Q6.** Verdadeiro ou falso: "Single-source research é aceitável se a source é autoridade reconhecida." Justifique.

## 4. Fontes

- [Context Engineering Guide 2026 — Meta-Intelligence](https://www.meta-intelligence.tech/en/insight-context-engineering)
- [Context Engineering LLM Memory — Weaviate](https://weaviate.io/blog/context-engineering)
- [State of AI Agent Memory 2026 — Mem0](https://mem0.ai/blog/state-of-ai-agent-memory-2026)
- [Memory for Autonomous LLM Agents Survey arXiv](https://arxiv.org/html/2603.07670v1)
- [AI Agent Memory Best Practices 2026 — 47Billion](https://47billion.com/blog/ai-agent-memory-types-implementation-best-practices/)
- [Architecture and Orchestration of Memory Systems — Analytics Vidhya](https://www.analyticsvidhya.com/blog/2026/04/memory-systems-in-ai-agents/)

## 5. Pass criteria

- 5/6 corretas; Q4 obrigatório citar técnica real do arquivo; Q5 lista de 3 seções com rationale
- Failure → re-study 1.3 + 1.5, re-quiz Q4+Q5
