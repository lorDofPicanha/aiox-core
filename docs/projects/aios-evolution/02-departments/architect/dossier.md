---
squad: architect (Aria)
date: 2026-05-14
phase: 2
gap_target: L5 (workflow checkpointing)
sources_count: 10+
---

# 🏛️ Dossier @architect — Agentic Architecture Patterns 2026

## 1. Princípios fundamentais (memorizar)

### 1.1 Padrões de orquestração (4 que shipam em produção)

| Padrão | Quando usar | Trade-off |
|--------|-------------|-----------|
| **Graph-based** (LangGraph) | Workflows complexos com state, retry, human-interrupt | Mais boilerplate, melhor recoverability |
| **Role-based** (CrewAI) | Time-to-first-agent, clareza de papéis | Menos controle de fluxo |
| **Handoff-based** (OpenAI Agents SDK) | Conversação fluida com transferências | Pode driftar sem supervisor |
| **Hierarchical** (supervisor→workers) | Sistemas grandes multi-nível | Mais latência, mais governança |

**Regra de ouro 2026:** "Hierarchical wins over swarm in production almost every time. The supervisor anchors goal alignment; swarms drift without it."

### 1.2 Checkpointing — anatomia de workflow resilient

Componentes obrigatórios:
1. **Typed state** (schema explícito do que persiste)
2. **Conditional edges** (transições não são lineares)
3. **Checkpointers** (SQLite/Postgres/S3 — escolha por escala)
4. **Human-interrupt points** (onde pausar pra revisão humana)
5. **Graceful degradation** (pause + present state + resume from exact checkpoint)

> "Checkpointing, tracing, and policy enforcement are becoming standard building blocks. The direction is to make agents behave more like dependable software, even as the model does more of the reasoning."

### 1.3 Estado AIOS atual vs target

| Componente | Hoje | Target |
|------------|------|--------|
| Workflows YAML | ✅ Existem (greenfield/brownfield) | Adicionar checkpointing nativo |
| State persistence | ⚠️ Implícito via story checkboxes | SQLite store + typed state |
| Retry/resume | ❌ Manual (re-rodar story) | Resume from last checkpoint |
| Human-interrupt | ⚠️ Implícito (user driva sessão) | Pontos formais: `wait_for_human_input: true` |
| Conditional edges | ⚠️ Implícito em prosa do workflow | Yaml schema com `condition: <expr>` |

## 2. Aplicação imediata em arquitetura AIOS

### 2.1 Lacuna L5 — proposta concreta

Adicionar ao `.aios-core/development/workflows/*.yaml` schema:

```yaml
checkpointing:
  enabled: true
  storage: sqlite
  state_schema:
    current_step: string
    completed_steps: list[string]
    artifacts_produced: list[path]
    last_agent_output: string

steps:
  - id: pm_creates_prd
    agent: pm
    output_artifact: docs/prd.md
    checkpoint: true   # auto-save state após este step
    on_failure: pause_for_human

  - id: sm_creates_story
    agent: sm
    requires: [pm_creates_prd]
    condition: "exists(docs/prd.md)"
    checkpoint: true
```

### 2.2 Aplicação no HYDRA pipeline (Sprint #1 Resilience)

HYDRA `pipeline.js` hoje:
- Phase 1 (fetch) → Phase 2-6 (process) → Phase 7 (distribute) sem checkpointing
- Travamento silencioso 12/Mai foi exatamente isso: sem state persisted, impossível resume

Proposta: adicionar `pipeline-state.sqlite` que persiste:
- `last_completed_phase`
- `processed_content_ids` (idempotência ao resumir)
- `errors_per_phase`

Ao reiniciar: `node bin/hydra.js run --resume` → carrega state → continua de onde parou.

## 3. Anti-padrões a EVITAR

| Anti-padrão | Por quê falha |
|-------------|---------------|
| Migrar AIOS para swarm puro | Drifts sem supervisor anchor |
| Único framework universal (CrewAI OU LangGraph) | Custo de migração 3-6 meses sem ganho funcional |
| Checkpointing global único | Phases têm needs diferentes — granular > global |
| Workflows lineares sem conditional edges | Não shippa em produção (consenso 2026) |

## 4. Quiz de verificação (responder na sequência)

**Q1.** Por que swarm puro perde em produção pra hierarchical?

**Q2.** Cite os 5 componentes obrigatórios de checkpointing resilient.

**Q3.** Qual a diferença entre handoff-based e hierarchical orchestration?

**Q4.** O HYDRA pipeline (`tools/hydra/src/pipeline.js`) está em qual padrão de orquestração? Tem checkpointing?

**Q5.** Proponha 1 mudança concreta no `.aios-core/development/workflows/greenfield-fullstack.yaml` que aplique checkpointing nativo.

**Q6.** Verdadeiro ou falso: "AIOS deve migrar de YAML workflows para LangGraph Python pra ganhar checkpointing." Justifique.

## 5. Fontes (primary)

- [Definitive Guide to Agentic Design Patterns 2026 — SitePoint](https://www.sitepoint.com/the-definitive-guide-to-agentic-design-patterns-in-2026/)
- [2026 Guide to Agentic Workflow Architectures — StackAI](https://www.stackai.com/blog/the-2026-guide-to-agentic-workflow-architectures)
- [Agentic Engineering: Swarms Redefining SE — LangChain](https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering)
- [State of AI Agent Frameworks 2026 — Fordel](https://fordelstudios.com/research/state-of-ai-agent-frameworks-2026)
- [AI Agent Engineering 2026 Architectures — JsonAPI Blog](https://blog.whoisjsonapi.com/ai-agent-engineering-in-2026-architectures-patterns-and-real-world-systems/)
- [The Agentic Architect — Niranjan Sharma Medium](https://medium.com/the-cyber-wall/the-agentic-architect-software-in-2026-is-no-longer-written-its-negotiated-f4f9d1b993eb)
- [AI Agent Architecture — Redis Blog](https://redis.io/blog/ai-agent-architecture/)

## 6. Metadata pra learning loop

- **Pass criteria:** 5/6 questões corretas, mínimo 1 cita arquivo AIOS específico
- **Failure action:** Re-study seções 1.2 + 2.1, re-quiz com Q4 + Q5 reformuladas
