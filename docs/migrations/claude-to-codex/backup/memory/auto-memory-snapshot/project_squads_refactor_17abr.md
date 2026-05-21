---
name: Squads Refactor & Skills Enrichment 17/Abr
description: Auditoria completa de 35 squads AIOS, enriquecimento com skills/mcps, migração de tasks para TASK-FORMAT-V1, validação 35/35 PASS
type: project
originSessionId: 31103687-1413-4c69-aeaf-7dbc36155347
---
## Squads Refactor — 17/Abr/2026

### Objetivo
Análise completa dos squads em `squads/` + aplicação de melhorias sistemáticas (skills, MCPs, TASK-FORMAT-V1).

### Estado Inicial
- 35 squads totais: 21 novos (squad-*) + 14 legados
- 10 squads com erros de validação (sem manifest ou workflow format antigo)
- 0 squads com blocks de `skills` ou `mcps`
- ~1000+ warnings por tasks fora do TASK-FORMAT-SPECIFICATION-V1

### Estado Final
- **35/35 squads VALID** (sem erros)
- **Warnings residuais ~47** (cosméticas: template vars `{{}}`, cross-squad refs, sugestões estruturais para squad-*)
- **143 tasks migradas** para TASK-FORMAT-V1 (com fields: task, responsavel, responsavel_type, atomic_layer, Entrada, Saida, Checklist)
- **35 squads com skills block** (6 cross-cutting + domain-specific)
- **35 squads com mcps block** (recomendações por domínio)
- **8 manifests auto-gerados** (ai-science, design-terapeutico, growth, health-data, health-tech, innovation, legal, therapy)
- **5 workflows migrados** para AIOS 2.1 format (`workflow:` root)

### Scripts Criados (idempotentes)

Todos em `.aios-core/development/scripts/squad/`:

| Script | Função |
|---|---|
| `enrich-squads-with-skills.js` | Adiciona blocks skills/mcps em 21 squad-* |
| `fix-legacy-squads.js` | Gera manifest faltante + skills em 14 legados |
| `wrap-legacy-workflows.js` | Migra 5 workflows para `workflow:` root |
| `migrate-task-format.js` | Injeta TASK-FORMAT-V1 em 143 tasks (--force flag) |
| `polish-workflows.js` | Adiciona workflow.type + handoff_prompts |
| `validate-all-squads.js` | Batch validator (35/35) |

### Domain → Skills Map

**Cross-cutting (todos):** mind-clone-consultation, quality-gates, document-generation, reporting, problem-solving, agent-handoff

**Por departamento:**
- `ai_strategy` → architect-first, ultraplan, brainstorming, mcp-builder, claude-api, thinkback
- `design` → design-system, canvas-design, banner-design, ui-ux-pro-max, brand-guidelines, theme-factory, frontend-patterns, web-artifacts-builder, fal-ai-media
- `engineering` → architect-first, bughunter, mcp-builder, ultraplan, frontend-patterns, claude-api, conventional-commits, cli-first, story-driven-development
- `content` → brand, brand-guidelines, canvas-design, banner-design, pdf, video-editing, fal-ai-media
- `growth` → brand, banner-design, canvas-design, ultraplan, fal-ai-media
- `security` → bughunter, architect-first, ultraplan, security-awareness
- `legal` → pdf, ultraplan, document-generation
- (demais: ver fix-legacy-squads.js)

### Domain → MCPs Map

- **Todos:** aios-brain-bridge
- **design:** +mcp-design-studio, mcp-image-studio, stitch, nano-banana-2, 21st-dev-magic
- **engineering/platform:** +mcp-memory-service, context7
- **growth/sales:** +mcp-ads-bridge
- **content:** +mcp-image-studio, mcp-design-studio

**Why:** Organizar os squads para uso efetivo no dia-a-dia — skills + MCPs declarados no manifest tornam a descoberta e ativação mais rápidas.

**How to apply:** Rodar `node .aios-core/development/scripts/squad/validate-all-squads.js` após qualquer mudança. Scripts são idempotentes — reexecutar é seguro.
