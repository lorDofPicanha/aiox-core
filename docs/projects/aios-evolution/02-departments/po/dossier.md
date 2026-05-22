---
squad: po (Pax)
date: 2026-05-14
phase: 2
gap_target: L5 (handoff protocols) + transversal backlog AI-native
sources_count: 8+
---

# 📋 Dossier @po — Handoff Protocols & Backlog AI-native 2026

## 1. Princípios fundamentais

### 1.1 Backlog refinement com agents (mudança 2026)

> "Backlog refinement is now a review of agent-prepared proposals, with teams rejecting, reshaping, and approving with more energy to debate real tradeoffs."

PO 2026 não escreve user stories from scratch — **revisa e ajusta** propostas que agents (PM/SM tools) geraram a partir de research/feedback. Tempo libera pra debater trade-offs reais.

### 1.2 Handoff protocols (de PO pra outros agents)

Padrão recomendado:
```yaml
story:
  id: STORY-X.Y.Z
  status: ready_for_dev
  owner: po (created)
  next_owner: dev (implements)
  handoff_artifacts:
    - prd_section: "section 3.2"
    - acceptance_criteria: [explicit list]
    - test_cases: [reference]
  handoff_checklist_passed: [✓ ...]
  validated_by: po
  approved_by_human: true  # NEVER skip
```

> "Final approval for PRDs, acceptance criteria, roadmap changes, and release notes should be owned by named humans with clear checklists."

### 1.3 Acceptance criteria for AI features (novo)

Tradicional:
> "Quando user clica X, sistema mostra Y"

AI-aware:
> "O agent retorna resposta relevante com precisão > 0.82 no validation set, com fallback definido para confidence scores < 0.6"

PO precisa colaborar com data/QA em definir thresholds quantitativos antes de dev começar — NÃO depois.

### 1.4 Aplicação AIOS — gap L5 (handoff formal)

AIOS hoje:
- Stories em `docs/stories/active/` com checkboxes manuais
- Handoff `@po → @dev` é implícito (story aparece em /active)
- Não tem formal `handoff_artifacts` field nem `next_owner`
- `approved_by_human: true` é assumido mas não traceável

Proposta:
1. Schema story atualizado com `handoff` block formal (yaml frontmatter)
2. Validation `aios story validate {id}` checa que handoff_checklist_passed antes de marcar ready
3. Constitution amendment: "Stories sem `approved_by_human: true` não podem entrar em /active"

### 1.5 Story-Driven + AI agents = workflow mais profundo

Pattern emergente:
```
PM agent draft PRD → human approves
↓
PO agent slices PRD → stories proposals → human reviews
↓
SM agent prioritizes + sequences → human approves
↓
Dev agent implements → QA agent reviews → human approves merge
```

Cada handoff = checkpoint humano. Não é "AI substitui human", é "AI prepara, human decide".

## 2. Anti-padrões

| Anti-padrão | Custo |
|-------------|-------|
| Approve sem human review (full autopilot) | Drift estratégico, debt arquitetural |
| AC AI-feature sem threshold quantitativo | Dev/QA não sabem quando "pronto" |
| Handoff implícito (story aparece magic) | Owner accountability quebra |
| PO ignora research from agents | Volta a manual + perde 60% tempo |

## 3. Quiz

**Q1.** Como mudou o role do PO em 2026 vs pré-AI agents?

**Q2.** Por que approval de PRD/AC deve permanecer com humano nomeado?

**Q3.** Qual diferença entre AC tradicional vs AC para feature de AI? Dê exemplo.

**Q4.** Olhando `docs/stories/active/` (ou `.aios-core/development/templates/story-tmpl.yaml`), identifique 1 campo que falta pra handoff formal.

**Q5.** Proponha checklist de "ready_for_dev" — quais 5 itens DEVEM estar checked antes de PO marcar story como handed off?

**Q6.** Verdadeiro ou falso: "Se @sm e @dev estão alinhados, PO pode pular review da story." Justifique.

## 4. Fontes

- [Sprntly AI for Product Managers 2026](https://www.sprntly.ai/)
- [AI for Product Managers Guide 2026 — ChatPRD](https://www.chatprd.ai/learn/ai-for-product-managers)
- [AI Agents in Product Management — StoriesOnBoard](https://storiesonboard.com/blog/ai-agents-product-management-2026)
- [AI Product Manager Roadmap 2026 — Medium](https://medium.com/agileinsider/ai-product-manager-skill-roadmap-2026-5896f61c3cae)
- [Product Requirements Document AI — Aha](https://support.aha.io/aha-software/ai-assistant/ai-prompt-library/ai-agents/product-requirements-document~7546331120057563101)
- [Product Manager Skills GitHub — Dean Peters](https://github.com/deanpeters/Product-Manager-Skills)

## 5. Pass criteria

- 5/6 corretas; Q4 obrigatório citar campo real do template AIOS; Q5 lista de 5 itens concretos
- Failure → re-study 1.2 + 1.4, re-quiz Q4+Q5
