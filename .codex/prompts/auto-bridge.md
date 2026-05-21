---
description: "Uso"
source: "claude-code .claude/commands/auto-bridge.md"
migrated: "2026-05-19"
---

# /auto-bridge — Verificacao automatica da Bridge

## Uso
Verifica se ha pendencias na Bridge e processa automaticamente.

## Fluxo
1. Chamar `bridge_status` via MCP
2. Se ha briefs nao lidos -> informar ao usuario
3. Se ha respostas de consultas -> apresentar
4. Se ha insights pendentes de publicacao -> perguntar se quer publicar
5. Sugerir proxima acao baseado no estado
