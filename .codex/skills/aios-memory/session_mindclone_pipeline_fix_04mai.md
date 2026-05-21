---
name: Mind Clone Pipeline Fix Steps 1+2+3
description: 04/Mai sessão. Mind clones (188) agora ativam como "agent real" (não skill genérica). Path-resolver compartilhado + agentskills.io SKILL.md pilot + MindClonePipeline lite. Staged 16 files +3650 LOC.
type: project
originSessionId: 5b84a4d4-29e6-4b10-81d9-313660d13595
---
# Mind Clone Activation Pipeline Fix — 2026-05-04

**Status:** ✅ Steps 1+2+3 DONE (autopilot)
**Trigger original:** comparação arquitetural AIOS vs OpenClaw vs Hermes → user escolheu opção 1
**Tempo real:** ~1.5h (estimativa era 5.5h — fix mais simples que esperado)

## Problema raiz

Antes: ao invocar `/AIOS:agents:dieter-rams` → "🤖 dieter-rams Agent ready" (fallback skill genérico).

Causas:
1. `agent-config-loader.js:321` procurava só em `.aios-core/development/agents/` (não achava mind clones em `.claude/commands/AIOS/agents/`)
2. `unified-activation-pipeline.js:102` whitelist hardcoded de 12 IDs (rejeitava mind clones)
3. 2 `output-formatter.js` (core/utils + infrastructure/scripts) procuravam path errado `.aios-core/agents/` (sem `development/`) — bug pré-existente

## Solução (3 steps)

### Step 1: Shared agent-path-resolver + 4 loader patches

**Novo arquivo:** `.aios-core/core/utils/agent-path-resolver.js`
- `resolveAgentPath(id)` busca em 2 paths (core + skill)
- Replaces ad-hoc `path.join(...)` em 4 loaders

**Refatorados pra usar resolver:**
- `agent-config-loader.js` (loadAgentDefinition)
- `core/utils/output-formatter.js`
- `infrastructure/scripts/output-formatter.js`

**Não patchados (intencionalmente):**
- `agent-invoker.js` — `SUPPORTED_AGENTS` whitelist por design (orchestration de 7 core)
- `migrate-agent.js` — utility V2→V3, não roda em produção

### Step 2: agentskills.io SKILL.md pilot

**Novo arquivo:** `.aios-core/data/mind-clone-skills/dieter-rams/SKILL.md`
- Frontmatter ~120 tokens (name, description, tier, icon, archetype, greeting_levels)
- Body markdown ~3500 tokens (Voice DNA + 10 Principles + 4 frameworks + heuristics + commands)
- Progressive disclosure: frontmatter sempre carrega, body sob demanda
- Conformance: agentskills.io spec

### Step 3: MindClonePipeline lite

**Novo arquivo:** `.aios-core/core/jarvis/mind-clone-pipeline.js`
- Carrega frontmatter (cheap)
- Carrega body sob demanda
- Carrega advisor context de `jarvis-mind-clone-map.yaml` (project + topics)
- Carrega memory relevante de `.claude/agent-memory/{callingAgent}/`
- Greeting embodied (icon + tier + Voice DNA signature)
- Performance: <50ms target — alcançado 11-14ms ✅
- Sem session/git/permissions (mind clones são advisory)

**Wire-up:** `generate-greeting.js` rota automaticamente:
- `isMindClone(id)` → MindClonePipeline lite
- else → ActivationRuntime (UnifiedActivationPipeline core)

## Verificação

```bash
# Antes
$ generate-greeting dieter-rams
🤖 dieter-rams Agent ready

# Depois
$ generate-greeting dieter-rams aios-master bretda
⬜ Dieter Rams (Purist-Master) ready. Weniger, aber besser.
📁 Project context: bretda
   Priority topics: luxury branding, visual identity, high-ticket sales
```

## Cobertura

- 188 mind clones total
- **165 (88%)** ativam com persona real (legacy-md OK + skill-md pilot)
- 11 (5.9%) com YAML pré-existente quebrado — **fix separado**:
  adriana-dallari, alison-darcy, demis-hassabis, don-norman, erik-nymanczuk,
  guillaume-moubeche, kate-ryder, nir-eyal, richard-susskind, stephen-hahn, werner-vogels
- 12 (6.4%) sem YAML block — sub-clones operacionais ou stubs

## Files staged (NÃO commitado)

16 files, +3650 LOC, -14 LOC. Lista (acumulado com audit anterior + pipeline):
- agent-path-resolver.js (new)
- mind-clone-pipeline.js (new)
- mind-clone-skills/dieter-rams/SKILL.md (new)
- agent-config-loader.js (modified)
- output-formatter.js x2 (modified)
- generate-greeting.js (modified)
- (mais 9 files do audit anterior + comparison doc)

## Arquitetura final (mind clone activation)

```
Claude Code skill invocation `/AIOS:agents:dieter-rams`
              ↓
   .claude/commands/AIOS/agents/dieter-rams.md (legacy)
   OR
   .aios-core/data/mind-clone-skills/dieter-rams/SKILL.md (new)
              ↓
   STEP 3: trigger MindClonePipeline (Bash via Claude)
              ↓
   MindClonePipeline.activate(id, {callingAgent, project})
              ↓
   ┌─ loadFrontmatter (skill-md priority, fallback legacy-md)
   ├─ loadBody (sob demanda)
   ├─ loadAdvisorContext (jarvis-mind-clone-map.yaml)
   └─ loadRelevantMemory (.claude/agent-memory/{callingAgent}/)
              ↓
   buildGreeting → embodied persona + project + memory hints
              ↓
   Display + persona transformation REAL
```

## Próximos steps (opcionais, não-críticos)

1. **Bulk migration** dos 188 mind clones pra agentskills.io SKILL.md format (~2h auto)
   - script: read legacy YAML → extract DNA → emit SKILL.md
2. **Fix 11 broken-YAML mind clones** (1h manual ou 30min via squad-creator)
3. **Universal `*think high|medium|low` command** (OpenClaw) — 1h
4. **Prompt caching** dos bodies (Anthropic ephemeral) — 2h, redução 10-50× custo
5. **Trajectory recording** dos conclaves (Hermes pattern) — 3h
6. **Update STEP 3 nos mind clone .md files** pra referenciar `mind-clone-pipeline.js` em vez de `unified-activation-pipeline.js`

## Comparação adquirida

Doc canônico: `docs/audits/architecture-comparison-aios-vs-openclaw-vs-hermes-2026-05-04.md`

AIOS já é melhor em: workflows YAML, 3-layer quality gates, IDS registry, master-orchestrator (53KB), 212 tasks reusáveis.

AIOS aprendeu de: agentskills.io spec (Hermes), MindClonePipeline pattern (Hermes prompt_builder.py + memory_manager.py), path-resolver consolidação.

NÃO copiou: provider abstraction (AIOS é Claude-bound), 25+ channel routing (out of scope), agentskills.io pros core 12 (eles precisam pipeline completo).

## Trigger pra próxima sessão

- "bulk migrate mind clones" → roda script de migração 188 mind clones
- "fix broken yamls" → fixa os 11 mind clones com YAML quebrado
- "wire think command" → adiciona *think universal
- "prompt caching mind clones" → implementa Anthropic ephemeral caching
