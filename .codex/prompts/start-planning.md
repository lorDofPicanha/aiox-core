---
description: "Uso"
source: "claude-code .claude/commands/start-planning.md"
migrated: "2026-05-19"
---

# /start-planning — Iniciar planejamento com brief do Conclave

## Uso
Busca o brief mais recente do Conclave para um projeto e inicia
o planejamento com @analyst usando as recomendacoes dos experts.

## Fluxo
1. Chamar `get_analyst_brief` via MCP com nome do projeto
2. Se brief encontrado: apresentar resumo ao usuario
3. Ativar @analyst com contexto do brief
4. Seguir fluxo normal: @analyst -> @pm -> @architect -> @sm -> @dev -> @qa

## Se nao houver brief
Informar que nenhum Conclave foi rodado para este projeto.
Sugerir rodar um Conclave no Antigravity primeiro.
