# Smoke Test design-md — anthropic.com (DRY RUN)

**Data:** 2026-05-12
**Skill:** design-md (Alan Nicolas) instalada em `.claude/skills/design-md/`
**Test URL:** https://www.anthropic.com/
**Status:** ⚠️ **PARTIAL FAIL** — pipeline 5/8 fases OK, fase 6 (LLM) crashed

## Resultado

| Fase | Status | Notas |
|---|---|---|
| 1/8 fetching | ✅ OK | 200 HTML retornado |
| 2/8 collecting CSS + favicon + logo | ✅ OK | webflow CDN + Anthropic Brand System detectados |
| 3/8 token detection | ✅ OK | **267 unique tokens** + 1547 CSS vars + 8 @font-face + archetype **polaris-friendly (89% confidence)** |
| 4/8 HTML → markdown | ✅ OK | |
| 5/8 preparing prompt | ✅ OK | inputs/prompt.txt gerado |
| 6/8 invoking LLM (claude-cli) | ❌ FAIL | `exit=null` — claude CLI spawn dentro de Claude Code session NÃO funciona |
| 7/8 parse YAML + lint | — | bloqueado por fase 6 |
| 8/8 render preview.html | — | bloqueado por fase 6 |

## Root cause

`claude -p` (Claude Code CLI headless) é spawned como subprocess. Dentro de uma sessão Claude Code já ativa, spawning claude-cli filho falha — tipicamente por auth/state conflict.

## Workarounds disponíveis

### Opção A: OpenRouter (passar API key)
```bash
export OPENROUTER_API_KEY=sk-...
node .claude/skills/design-md/run.cjs --url X --provider openrouter
```
**Pro:** funciona out-of-the-box.
**Con:** custo OpenRouter por extract (~$0.01-0.05 Haiku 4.5).

### Opção B: Synthesis manual pelo agente (eu mesmo)
1. Rodar design-md até fase 5 (com `--no-llm-retry` para fail fast)
2. Coletar todos os inputs/* gerados (HTML, CSS, tokens detected, style-fingerprint, etc.)
3. **Eu (Orion) leio o `inputs/prompt.txt` e escrevo o DESIGN.md manualmente**
4. Salvar como se LLM tivesse rodado
5. Continuar pipeline normal (lint, preview, etc — fases 7-8)

**Pro:** zero custo extra, qualidade Opus 4.7.
**Con:** ~5min por URL extra de trabalho meu.

### Opção C: Bash wrapper que chama Claude Code via task tool indireto
Complicado e frágil. Skip.

## Recomendação

**Para o dry run e piloto v1:** Opção B (manual synthesis pelo agente).
- 5 URLs × 5min = 25min extra mas com qualidade Opus 4.7 + zero custo
- Permite review manual de cada DESIGN.md gerado (catches errors)

**Para production (pós piloto SUCCESS, automação):** Opção A (OpenRouter).
- Custo previsível ~$0.05/extract
- Não depende de sessão Claude Code ativa

## Material coletado intacto

Apesar do crash, todos os inputs estão em `_smoke-test-anthropic/inputs/`:
- backdrop-blur.json, breakpoints.json, component-properties.json, container.json
- css-collected.css (CSS bundle), css-for-llm.css (filtered), css-meta.json, css-truncation-stats.json
- css-vars-detected.json, dark-mode.json, favicon.json, focus-ring.json
- font-faces.json, gradients.json, logo.json, motion.json
- opacity-scale.json, page-copy.json, page.html, page.md
- style-fingerprint.json (archetype + confidence)

**Heavy-lifting é o token detection (267 tokens via regex em milhares de linhas CSS) — design-md fez isso bem.**

## Decisão pra Fase 4 do dry run

Quando Fase 3 NICHE RESEARCH retornar com 5 refs (3 globais + 2 locais):
1. Rodar design-md em cada uma com `--no-llm-retry` (espera-se 5 fails todos na fase 6)
2. Coletar os 5 sets de inputs/*
3. Eu sintetizo manualmente os 5 DESIGN.md
4. Faço multi-ref synthesis (intersecção tokens + divergence + anti-clone gate per category Frost)
5. Output: 1 DESIGN.md sintetizado pra Dona Hilda + relatório anti-clone
