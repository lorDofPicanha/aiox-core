---
description: "Uso"
source: "claude-code .claude/commands/sync-insights.md"
migrated: "2026-05-19"
---

# /sync-insights — Publicar insights do sprint para o Mega Brain

## Uso
Coleta insights do sprint atual e publica na Bridge para
o Mega Brain processar e incorporar na base de conhecimento.

## Fluxo
1. Coletar insights da sessao atual:
   - Patterns descobertos durante desenvolvimento
   - Decisoes arquiteturais tomadas
   - Licoes aprendidas
   - Bugs significativos e suas solucoes
2. Formatar como array de insights
3. Chamar `publish_aios_insights` via MCP
4. Confirmar publicacao ao usuario

## Tipos de Insight
- `pattern` -> candidato a Heuristica (L3)
- `decision` -> candidato a Framework (L4)
- `methodology` -> candidato a Metodologia (L5)
- `lesson` -> candidato a Modelo Mental (L2)
