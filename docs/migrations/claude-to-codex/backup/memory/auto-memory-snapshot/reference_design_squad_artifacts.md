---
name: Design Squad Artifacts Paths
description: Caminhos dos arquivos-chave do Sprint Design Squad (tasks, schemas, agents, etc.)
type: reference
originSessionId: f4605a37-31e9-4e95-a474-8aa0ac571ca0
---
# Design Squad — Localização de artefatos

## Core files (tracked)

### Corporation / hierarchy
- **`D:\AIOS\.aios-core\core\corporation\org-config.yaml`** — 7 design agents com `tools:` + `skills:` mapeados; ux-design-expert deprecated; department design.head = design-lead
- **`D:\AIOS\.aios-core\core\corporation\tool-integrations.yaml`** — 5 novas entries (stitch, nano-banana-2, ui-ux-pro-max, 21st-dev-magic, mcp-design-studio) + figma-api/cloudinary-api expandidas

### Agent definitions (7 design agents)
- `D:\AIOS\.aios-core\development\agents\design-lead.md` — commands *brief/*critique/*brand-check/*approve invocam task Mind Clone
- `D:\AIOS\.aios-core\development\agents\ui-designer.md` — 4 ativadores em COMMAND-TO-TASK MAPPING + workflow visual_design_flow com handoffs
- `D:\AIOS\.aios-core\development\agents\ux-designer.md`
- `D:\AIOS\.aios-core\development\agents\motion-designer.md`
- `D:\AIOS\.aios-core\development\agents\design-systems-engineer.md`
- `D:\AIOS\.aios-core\development\agents\ux-researcher.md`
- `D:\AIOS\.aios-core\development\agents\ux-writer.md`

### Legacy
- `D:\AIOS\.aios-core\development\agents\ux-design-expert.md` — monolito preservado (`type: deprecated` em org-config.yaml)

### Tasks reusáveis
- **`D:\AIOS\.aios-core\development\tasks\design-consult-mind-clones.md`** — parametrizável (question, expert-id, project, agent, context), mapeia 7 agents → default expert, 5 passos, audit log em `.aios-core/data/mind-clone-consultations/`
- **`D:\AIOS\.aios-core\development\tasks\write-handoff.md`** — auto-cria `.aios/handoffs/` on-demand, escreve YAML timestamped

### Schemas e data
- **`D:\AIOS\.aios-core\data\handoffs-schema.md`** — contrato de handoff YAML (campos obrigatórios: from_agent, last_command, timestamp, consumed)
- `.aios-core/data/jarvis-mind-clone-map.yaml` — mapping agent → Mind Clones (pré-existente)
- `.aios-core/data/jarvis-mind-clone-index.json` — index de 162 Mind Clones

## Runtime (gitignored)

- `D:\AIOS\.aios\handoffs\` — diretório runtime, auto-criado por `write-handoff.md`
- `D:\AIOS\.aios\handoffs\.gitkeep` — marker local

## Skills instaladas via agentskill.sh

- `~/.claude/skills/{skill-name}/SKILL.md` padrão para cada skill (theme-factory, canvas-design, web-artifacts-builder, brand-guidelines, brainstorming, ckm:brand, ckm:design-system, frontend-patterns, ckm:banner-design, video-editing, fal-ai-media)
- `~/.claude/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py` — CLI de design intelligence (67 styles, 161 palettes, 57 fonts, 99 UX guidelines)

## Commits do sprint (local main)

```
213af291 feat(design-squad): handoffs system + ui-designer workflow integration
53ed0947 refactor(design-squad): deprecate ux-design-expert monolith
1980d90b feat(design-squad): tool-integrations coverage for design agents
440a3afb feat(design-squad): mind clone consultation task + design-lead activation
c46c19e6 feat(design-squad): ui-designer activators + 21st-dev/magic tool
2ad3c861 feat(design-squad): complete org-config integration
```

## MCPs relevantes do squad (em `.claude/rules/mcp-usage.md`)

- `stitch` — Google Stitch AI UI prototyping (consumed by: design-lead, ui-designer, ux-designer, design-systems-engineer)
- `nano-banana-2` — Gemini 3.1 Flash image gen (consumed by: design-lead, ui-designer, ux-designer, design-systems-engineer)
- `@21st-dev/magic` — `/ui {description}` component gen (consumed by: ui-designer, design-systems-engineer)
- `aios-brain-bridge` — Mind Clone consultation (16 tools)
- `playwright` — browser automation (útil para screenshots)
