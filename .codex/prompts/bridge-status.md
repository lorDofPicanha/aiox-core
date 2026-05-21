---
description: "Uso"
source: "claude-code .claude/commands/bridge-status.md"
migrated: "2026-05-19"
---

# /bridge-status — Status da ponte AIOS <-> Mega Brain

## Uso
Mostra o status completo da integracao entre os dois sistemas.

## Fluxo
1. Chamar `bridge_status` via MCP
2. Apresentar:
   - Relatorios de Conclave disponiveis
   - Consultas pendentes (sem resposta)
   - Insights pendentes (nao ingeridos)
   - Ultima sincronizacao
   - Health da ponte
