---
squad: sm (River)
date: 2026-05-14
phase: 2
gap_target: Sprint patterns para AI-native teams
sources_count: 6+
---

# 🏃 Dossier @sm — Sprint Patterns para AI-native Teams 2026

## 1. Princípios fundamentais

### 1.1 Cerimônias adaptadas

| Cerimônia | Antes | 2026 (com AI agents) |
|-----------|-------|----------------------|
| **Daily standup** | Diário humano | Async agent-prepared digest + 15min sync humano |
| **Sprint planning** | Manual estimating | Agent draft sequencing → human revisa trade-offs |
| **Backlog refinement** | PO escreve user stories | Agent propõe → PO/PM revisa → human approves |
| **Sprint review** | Demo features | Demo + agent eval results (regression, drift) |
| **Retrospective** | Pure human | Human + agent log analysis (patterns, blockers) |

### 1.2 Sprint planning AI-native

```
1. PM agent: synthesize last sprint outcomes + customer feedback themes
2. PO agent: propose top 10 stories (RICE-scored)
3. SM agent: validate dependencies, suggest sequencing
4. Architect agent: flag arquitetural conflicts
5. HUMAN MEETING: 30-60min decide which 5-7 enter sprint
6. SM agent: assign owners + create handoff artifacts
```

Tempo de planning: 4-8h tradicional → 30-60min AI-native (agent prep faz heavy-lifting).

### 1.3 Story-Driven Development como anchor (validação AIOS)

Padrão AIOS de story-driven development já é vencedor 2026:
- Story = source of truth pro contexto da implementação
- Acceptance criteria explicit
- File List rastreia mudanças
- Checkboxes = checkpoints leves

Gap: falta **agent eval results** anexado à story (Tier S de evidence).

### 1.4 Velocity em time AI-native

Métricas tradicionais (story points, velocity) ainda valem MAS:
- Adicionar **eval pass rate per sprint** — quão bem agents performam em quality gates
- Adicionar **handoff success rate** — % stories that flow PO→Dev→QA without rework
- Adicionar **context window efficiency** — % stories completed em <30% main session context

### 1.5 Anti-pattern observado em AIOS

Sprint #1 Resilience HYDRA: 3/12 stories shipped em 2 semanas. Causa não foi velocity baixa — foi **lack of mid-sprint health check**. SM deveria fazer "blocker triage daily" + "scope re-prioritization mid-sprint" quando velocity drift.

Proposta: ritual `aios sprint health` diário que:
- Lista stories blocked > 24h
- Calcula projected completion vs sprint end
- Sugere re-scoping se < 50% prob de hit

## 2. Anti-padrões

| Anti-padrão | Custo |
|-------------|-------|
| Manter daily 30min com 5+ pessoas | Time burn 2.5h/dia equipe |
| Ignorar agent eval results em sprint review | Quality drift invisível |
| Velocity-only measure (sem eval pass rate) | Ship fast e quebra prod |
| Sprint planning sem agent prep | Tempo perdido em manual estimating |

## 3. Quiz

**Q1.** Como standup mudou em time AI-native? Qual o trade-off?

**Q2.** Cite 3 métricas que devem ser adicionadas à velocity tradicional.

**Q3.** Olhe `docs/stories/active/` — qual seção falta pra story carregar agent eval results?

**Q4.** Sprint #1 Resilience HYDRA shipped 3/12 em 2 semanas. Diagnóstico: causa raiz não foi velocity. Qual foi? Como SM deveria ter agido?

**Q5.** Proponha estrutura de `aios sprint health` daily ritual — quais 3 outputs deve produzir?

**Q6.** Verdadeiro ou falso: "Story-Driven Development do AIOS é desatualizado e precisa migrar pra Kanban puro." Justifique.

## 4. Fontes

- [Multi-Agent Systems Enterprise AI Staffing 2026 — MichaelRCronin](https://www.michaelrcronin.com/post/multi-agent-systems-for-enterprise-ai-staffing-orchestration-strategies-in-2026)
- [Multi-Agent Frameworks Explained Enterprise 2026 — Adopt.ai](https://www.adopt.ai/blog/multi-agent-frameworks)
- [AI Agents Product Management 2026 — StoriesOnBoard](https://storiesonboard.com/blog/ai-agents-product-management-2026)
- [SoftClouds 2026 Predictions Agentic AI](https://www.softclouds.com/blogs/2026-predictions-for-agentic-ai.html)

## 5. Pass criteria

- 4/6 corretas (squad transversal); Q3 obrigatório citar arquivo real; Q4 obrigatório identificar causa raiz
- Failure → re-study 1.4 + 1.5, re-quiz Q4+Q5
