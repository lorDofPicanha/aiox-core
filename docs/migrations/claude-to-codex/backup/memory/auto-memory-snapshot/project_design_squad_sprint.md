---
name: Design Squad Sprint 17/Abr
description: Sprint de ativação do Design Squad AIOS — 8 tasks, 6 commits locais, skills agentskill.sh integradas
type: project
originSessionId: f4605a37-31e9-4e95-a474-8aa0ac571ca0
---
# Design Squad Activation Sprint — 17/Abr/2026

## Contexto

Diagnóstico (via @squad-creator/Craft) identificou que o design squad novo (6-7 agents: design-lead, ui-designer, ux-designer, motion-designer, design-systems-engineer, ux-researcher, ux-writer) instalado no commit `d28c3d15` (14/Abr) estava **estruturalmente completo mas operacionalmente inerte**:
- Score de integração médio 3/10
- 35+ MCPs declaradas em `dependencies.tools:` sem commands ativadores
- Mind Clones citadas textualmente mas ZERO invocações reais
- `.aios/handoffs/` inexistente
- Monolito legacy `ux-design-expert` ainda ativo com 13 subordinados

Usuário queria fixar antes de passar por cima.

## 8 Tasks executadas

| # | Task | Commit | Agente |
|---|------|--------|--------|
| 1 | Instalar 11 skills agentskill.sh + validar brainstorming | — | Orion + Dex |
| 2 | `tools:` + `skills:` em org-config.yaml (7 agents) | `2ad3c861` | Dex → Quinn (QA CONCERNS) |
| 3 | Ativadores em ui-designer.md (*mockup, *palette, *typography, *layout) | `c46c19e6` | Dex |
| 4 | Task reusable `design-consult-mind-clones.md` + design-lead activation | `440a3afb` | Dex |
| 5 | tool-integrations.yaml: 5 novas + 2 expandidas | `1980d90b` | Dex |
| 6 | 21st-dev-magic em ui-designer.md | `c46c19e6` (batched) | Dex |
| 7 | Deprecar ux-design-expert + migrar 13 subordinados | `53ed0947` | Dex |
| 8 | Sistema handoffs (schema + task write-handoff + ui-designer workflow) | `213af291` | Dex |

## Skills agentskill.sh instaladas (12 total, 11 novas)

theme-factory, canvas-design, web-artifacts-builder, brand-guidelines, brainstorming, ckm:brand, ckm:design-system, frontend-patterns, ckm:banner-design, video-editing, fal-ai-media, frontend-design (prévia).

**Bloqueadas:** `ckm:banner-design` (deps fantasmas — ai-artist/ai-multimodal/chrome-devtools/assets-organizing não publicadas) e `ckm:brand` (redundante com @anthropics/brand-guidelines).

## Antes vs Depois

| Dimensão | Antes | Depois |
|----------|-------|--------|
| Agents com `tools:` em org-config | 0/6 | 7/7 |
| Agents com `skills:` | 0/6 | 7/7 |
| Skills agentskill.sh | 1 | 12 |
| Commands com ativadores (ui-designer) | 0 | 4 |
| Mind Clone consultation task | inexistente | criada + 4 commands invocam |
| tool-integrations coverage | 1 agent | 8 agents |
| Monolito status | ambíguo + 13 subordinados | deprecated + migrado |
| Sistema handoffs | inexistente | schema + task + primeiro emissor |
| Score integração estimado | 3/10 | 7-8/10 |

## Status Push

**BLOQUEADO** — 34 commits locais à frente de origin/main (6 design-squad + 28 anteriores). Push 403 em `SynkraAI/aios-core` — conta `lorDofPicanha` sem write access. Ver `project_push_blocker_synkra.md`.

## Follow-ups opcionais

1. Propagar ativadores a outros 5 design agents (só ui-designer ganhou — Task #3)
2. ux-writer sem ativadores em commands (só skills mapeadas)
3. Fix tech debt: ESM config em tools/spurgeon-chat + tools/hydra (destrava pre-push gates)
4. Validação runtime: testar `@design-lead *brief` em projeto real (Anipis pendente)

## Arquivos principais criados/modificados

- `.aios-core/core/corporation/org-config.yaml` (2 commits)
- `.aios-core/core/corporation/tool-integrations.yaml`
- `.aios-core/development/agents/ui-designer.md` (2 commits)
- `.aios-core/development/agents/design-lead.md`
- `.aios-core/development/tasks/design-consult-mind-clones.md` (novo)
- `.aios-core/development/tasks/write-handoff.md` (novo)
- `.aios-core/data/handoffs-schema.md` (novo)
- `.aios/handoffs/.gitkeep` (runtime dir, gitignored)

## Como acionar o squad

```
@design-lead *brief {projeto}      # gate inicial com Mind Clone
@ui-designer *mockup {desc}        # Stitch + canvas-design + web-artifacts
@ui-designer *palette {brand}      # ui-ux-pro-max CLI + theme-factory
@ui-designer *typography {brand}   # ui-ux-pro-max CLI + theme-factory
@design-lead *critique {artifact}  # second opinion Mind Clone
```

Skills standalone: `/brainstorming` (HARD-GATE), `/theme-factory`, `/canvas-design`, `/web-artifacts-builder`, `/brand-guidelines`, `/video-editing`.
