---
name: agentskill.sh Skills — Self-Contained vs Orchestrator
description: Nem toda skill do agentskill.sh é executável. Orquestradoras têm deps fantasmas não publicadas
type: feedback
originSessionId: f4605a37-31e9-4e95-a474-8aa0ac571ca0
---
# agentskill.sh skills têm 2 tipos — auditar antes de adotar

## Rule

Antes de adotar skill do agentskill.sh em qualquer agent/workflow, **verificar se é self-contained ou orchestradora**. Orquestradoras com paths `.claude/skills/X/scripts/Y` exigem X e Y instalados — se X não for publicado, skill trava na largada.

## Why

**Descoberto no Sprint Design Squad (17/Abr):** Instalei `ckm:banner-design` (@nextlevelbuilder) esperando que funcionasse standalone. Na invocação real, a skill chama:
- `python3 .claude/skills/ai-artist/scripts/search.py` (ai-artist só publica references/, não scripts/)
- `.claude/skills/.venv/bin/python3 .claude/skills/ai-multimodal/scripts/gemini_batch_process.py` (ai-multimodal NÃO existe publicamente)
- `node .claude/skills/chrome-devtools/scripts/screenshot.js` (chrome-devtools NÃO existe)
- skill `assets-organizing` (NÃO existe)
- `inject-brand-context.cjs` (NÃO existe)

GitHub do criador (`@nextlevelbuilder/ui-ux-pro-max-skill`) confirma: repo só publica `banner-design`, `brand`, `design-system`, `design`, `slides`, `ui-styling`, `ui-ux-pro-max`. Os filhos que banner-design espera **são stack proprietário ckm privado**, nunca publicado.

Resultado: banner-design = **workflow document disfarçado de skill executável**.

## How to apply

**Antes de instalar uma skill agentskill.sh, especialmente de criadores desconhecidos:**

1. **Ler SKILL.md completo** (via WebFetch do GitHub raw se possível, ou `~/.claude/skills/{owner}/{name}/SKILL.md` pós-install)
2. **Grep por paths** `.claude/skills/`, `scripts/`, `.venv`, `inject-*.cjs`, `node .claude/skills/` no arquivo
3. **Se houver referências:** CHECAR se cada dep está publicada no agentskill.sh (via `npx @agentskill.sh/cli search`) ou no GitHub do criador
4. **Se dep não existir publicamente:** é workflow document, NÃO skill executável — não mapear em `dependencies.skills:` de agents sem plano de adaptação

## Skills validadas SELF-CONTAINED (funcionam standalone)

Estas testadas ou analisadas e confirmadas sem deps externas:
- `obra/brainstorming` ✅
- `anthropics/theme-factory` ✅
- `anthropics/canvas-design` ✅
- `anthropics/web-artifacts-builder` ✅
- `anthropics/brand-guidelines` ✅
- `anthropics/frontend-design` ✅
- `nextlevelbuilder/ui-ux-pro-max` ✅ (tem CLI Python mas publica scripts/)
- `affaan-m/frontend-patterns` ✅
- `affaan-m/video-editing` ✅ (precisa ffmpeg/elevenlabs API keys runtime)
- `affaan-m/fal-ai-media` ✅ (precisa fal.ai API key)
- `nextlevelbuilder/ckm:design-system` ✅ (teoricamente — não testada)
- `nextlevelbuilder/ckm:brand` ✅ (teoricamente — redundante com anthropics/brand-guidelines)

## Skills ORQUESTRADORAS com deps fantasmas (NÃO usar sem adaptação)

- `nextlevelbuilder/ckm:banner-design` ❌ — workflow proprietário ckm privado

## Workaround para orquestradoras quebradas

Se realmente quiser usar banner-design (ou similar), adaptar com stack AIOS existente:
- `ai-multimodal` → `nano-banana-2` MCP (instalado)
- `chrome-devtools` → `playwright` MCP
- `frontend-design` → `web-artifacts-builder` skill
- `ai-artist` → prompts diretos no Claude
- `assets-organizing` → convenção de pasta manual

Documentar workflow adaptado e skipar skill original.
