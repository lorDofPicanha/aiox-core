---
squad: pm (Morgan)
date: 2026-05-14
phase: 2
gap_target: L4 (model tiering policy) + AI product patterns
sources_count: 8+
---

# 🎯 Dossier @pm — AI Product Patterns 2026 + Model Tiering Policy

## 1. Princípios fundamentais

### 1.1 PM 2026: agent-collaborator não AI-replacer

PM passa de "writer of PRDs" → "curator of AI-generated proposals + final decision-maker".

Workflow novo:
```
Customer feedback (raw) → AI agent synthesizes themes
                       ↓
PM reviews themes, prioritizes
                       ↓
AI agent drafts PRD → PM edits, validates business reasoning
                       ↓
PM ships ONLY após human approval explícito
```

### 1.2 PRD pra AI features (template diferente)

Tradicional PRD:
- User story
- Functional requirements
- Acceptance criteria binários (works / doesn't work)

PRD para AI feature:
- Acceptance criteria quantitativos (precisão > 0.82)
- Confidence threshold + fallback behavior (`< 0.6 → defer to human`)
- Drift monitoring scoped (quem owns, qual SLA)
- Retraining trigger (e.g., precision drops > 5pp em 7d)
- Model evaluation criteria definido com PM ANTES de dev start

### 1.3 Model tiering policy (gap L4 AIOS)

Padrão econômico 2026:
> "Use a fast, cheap model (GPT-5.4-mini, Claude Haiku 4.5) for triage and routing agents, and a more capable model (GPT-5.4, Claude Sonnet 4.6) for complex reasoning agents."

**Proposta AIOS — formal policy:**

| Agent | Modelo recomendado | Justificativa |
|-------|---------------------|---------------|
| `@analyst` (research) | Sonnet 4.6 | Synthesis profundo, multi-source |
| `@architect` (design) | **Opus 4.7** | Decisões irreversíveis, alto impacto |
| `@dev` (implement) | Sonnet 4.6 | Code generation, balance speed/quality |
| `@qa` (review) | Sonnet 4.6 | Pattern detection + judgement |
| `@po` (review) | Sonnet 4.6 | Validation, not creation |
| `@pm` (strategy) | **Opus 4.7** | Business decisions, irreversible |
| `@sm` (sequence) | Haiku 4.5 | Routing/triage, simple |
| `@devops` (ops) | Sonnet 4.6 | Infrastructure decisions |
| `@data-engineer` (schema) | Sonnet 4.6 | Schema design |
| `@ux-design-expert` (UX) | Sonnet 4.6 | Pattern application |
| HYDRA pipeline (scoring) | Haiku 4.5 / gpt-4o-mini | High-volume, low-stakes |
| Mind clones (consultation) | Sonnet 4.6 | Expert reasoning |

**Budget control:** documentar em `.aios-core/data/model-tiering-policy.yaml` + checklist em `pm-checklist.md`.

### 1.4 Roadmap framework para AI products

Tier S features (must-ship): impact > 70% users, complexity < 30%
Tier A: impact 30-70%, complexity 30-50%
Tier B: impact < 30% OR complexity > 50%
Tier C: nice-to-have, defer

Decisão framework: `(Reach × Impact × Confidence) / Effort` — RICE adapted pra AI:
- **Reach**: quantos users atingidos
- **Impact**: high/med/low (threshold quantitativo)
- **Confidence**: % validado em research (não adivinhação)
- **Effort**: dev-weeks INCLUINDO eval setup

### 1.5 Aplicação AIOS

PM atual @pm tem `*create-prd`, `*create-epic`. Falta:
- Template PRD-AI-feature
- Validação de AC quantitativa
- Model tiering policy formal documentada

## 2. Anti-padrões

| Anti-padrão | Custo |
|-------------|-------|
| Usar Opus pra tudo (over-spend) | Bill 5-10x sem ganho proporcional |
| AC qualitativo em AI feature | Dev/QA não sabem when done |
| Rushing PRD sem human approval | Strategy drift |
| Ignorar drift monitoring (ship-and-forget) | Quality decay invisível |

## 3. Quiz

**Q1.** Como mudou o role do PM em 2026 vs pré-AI agents?

**Q2.** Liste 3 elementos críticos de PRD pra AI feature que NÃO existem em PRD tradicional.

**Q3.** Qual model tiering policy você proporia pra `@architect`? Por quê Opus vs Sonnet vs Haiku?

**Q4.** Olhe `.aios-core/development/templates/prd-tmpl.yaml`. Falta algum elemento pra PRD-AI-feature? Qual?

**Q5.** Cite 1 cenário concreto AIOS onde usar Opus pra @qa seria over-spend (anti-padrão).

**Q6.** Verdadeiro ou falso: "Roadmap RICE clássico funciona inalterado pra AI products." Justifique.

## 4. Fontes

- [AI for Product Managers Guide 2026 — ChatPRD](https://www.chatprd.ai/learn/ai-for-product-managers)
- [AI Product Management 2026 — Patoliya](https://blog.patoliyainfotech.com/ai-product-management-guide/)
- [AI Product Builder Roadmap 2026 — TechnoManagers](https://www.technomanagers.com/p/ai-product-builder-roadmap-2026)
- [AI Product Manager Skill Roadmap 2026 — Medium](https://medium.com/agileinsider/ai-product-manager-skill-roadmap-2026-5896f61c3cae)
- [PRD AI Agent Tools — Beam](https://beam.ai/skills/product-requirements-document)
- [Best Multi-Agent Frameworks 2026 — Gurusup (model tiering)](https://gurusup.com/blog/best-multi-agent-frameworks-2026)

## 5. Pass criteria

- 5/6 corretas; Q3 obrigatório justificativa explícita; Q4 obrigatório citar campo real ou ausência confirmada
- Failure → re-study 1.3 + 1.4, re-quiz Q3+Q4
