---
squad: ux-design-expert (Uma)
date: 2026-05-14
phase: 2
gap_target: Conversational UX + Agent transparency patterns
sources_count: 8+
---

# 🎨 Dossier @ux-design-expert — Agent UX & Transparency Patterns 2026

## 1. Princípios fundamentais

### 1.1 Agent UX = nova disciplina

> "UI design for AI agents requires design patterns for transparency, status communication, override controls, and error recovery. The teams shipping successful agent products in 2026 treat the interface as the accountability layer between user intent and autonomous action."

Falhas mais comuns:
- Lack of transparency (top causa de mistrust)
- Unclear autonomy boundaries
- Hybrid interfaces mal-resolvidas (chat + buttons confusos)
- Invisible reasoning ("Por que o agent fez isso?" sem resposta)

### 1.2 3 patterns críticos de transparency

**1. Intent Preview**
```
[Agent prepares to:]
  ✓ Read 5 files
  ✓ Modify config.yaml
  ✓ Run npm test

[Proceed]  [Edit]  [Handle it Myself]
```

**2. Audit Trail ("Show Work")**
- Cada output tem botão "show reasoning"
- User pode replay decisão step-by-step
- Crítico pra debugging E pra trust

**3. Dynamic Checklist**
```
✓ Gathered context (3 files)
✓ Identified root cause
▶ Generating fix...
○ Running tests
○ Reporting results
```

> Vs simple progress bar: dynamic checklist informa O QUE está acontecendo, não só "30%".

### 1.3 Conversational UX evolution

Conversational não é mais secondary:
- Replace navigation menus complexos
- Enable multi-step task completion via dialog
- Recognize intent + remember context + reasoning multi-step

**Mas:** conversational ≠ all-AI. Hybrid (chat + cards + actions) é o padrão vencedor.

### 1.4 Aplicação AIOS — Agent transparency em CLI

AIOS é CLI First. Como aplicar transparency patterns em CLI?

**Proposta concreta — pattern Intent Preview em CLI:**
```bash
$ @dev *implement-story 6.1.4

Orion plans to:
  ✓ Read story 6.1.4 acceptance criteria
  ✓ Identify 5 files to modify (greeting-builder.js, etc.)
  ✓ Run baseline tests (npm test)
  ✓ Implement changes
  ✓ Run tests again, validate gates

Estimated: ~15min, ~50k tokens
[Proceed] [Modify plan] [Cancel]
```

Audit trail CLI: `aios trace view {session_id}` mostra cada decisão reasoning.

### 1.5 Gartner data-point

40% enterprise apps integrarão agent-AI até fim de 2026 (vs <5% em 2025). Maioria dessas implementações precisa **interface layer que não existia ano passado**.

→ AIOS está bem-posicionado: Constitution Article I (CLI First) + Article II (Agent Authority) já endereçam.

## 2. Anti-padrões

| Anti-padrão | Custo |
|-------------|-------|
| Hide reasoning ("trust me, AI did the work") | Mistrust + impossible debug |
| Agent age sem confirm em ações destrutivas | User chocado, perda confiança |
| Chat-only quando hybrid (chat + cards) era melhor | UX friction desnecessária |
| Static progress bar (sem checklist) | "What is it doing?" recurrent |
| Skip Audit Trail | Compliance fail + reasoning blackbox |

## 3. Quiz

**Q1.** Quais os 3 patterns críticos de transparency? Qual cada um endereça?

**Q2.** Por que invisible reasoning é top causa de mistrust?

**Q3.** Como adaptaria Intent Preview pattern pro AIOS CLI? Dê exemplo real (comando + output).

**Q4.** Olhe um output de agent AIOS atual (qualquer agent ativando). Tem alguma transparency pattern presente? Qual falta?

**Q5.** Hybrid (chat + cards + actions) vs chat-only — quando cada um vale?

**Q6.** Verdadeiro ou falso: "AIOS sendo CLI First não precisa de transparency patterns (são pra GUI)." Justifique.

## 4. Fontes

- [Agent UX UI Design 2026 — Fuselab](https://fuselabcreative.com/ui-design-for-ai-agents/)
- [Designing Agentic AI UX Patterns — Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)
- [Practical Interface Patterns AI Transparency Part 2 — Smashing](https://www.smashingmagazine.com/2026/05/practical-interface-patterns-ai-transparency/)
- [What Is Agentic UX — Markswebb](https://markswebb.com/insights/agentic-ux/)
- [UI/UX Human-AI Interaction Patterns — Agentic Design](https://agentic-design.ai/patterns/ui-ux-patterns)
- [12 UI/UX Trends AI Apps 2026 — GroovyWeb](https://www.groovyweb.co/blog/ui-ux-design-trends-ai-apps-2026)

## 5. Pass criteria

- 4/6 corretas; Q3 obrigatório exemplo concreto AIOS CLI; Q6 obrigatório justificar com pattern aplicável a CLI
- Failure → re-study 1.2 + 1.4, re-quiz Q3+Q6
