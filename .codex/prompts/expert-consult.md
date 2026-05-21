---
description: "Uso"
source: "claude-code .claude/commands/expert-consult.md"
migrated: "2026-05-19"
---

# /expert-consult — Consultar Mind Clone

## Uso
Consulta individual a um Mind Clone do Mega Brain via Bridge.

## Fluxo
1. Identificar qual expert e relevante para a pergunta
2. Chamar `request_expert_consultation` via MCP
3. Informar ao usuario que a consulta foi enviada
4. Se Antigravity estiver aberto, resposta vira em minutos
5. Usar `get_consultation_response` para verificar resposta

## Experts Disponiveis
Consultar `bridge_status` para ver Mind Clones registrados.

## Exemplo
Usuario: "/expert-consult hormozi sobre pricing do SaaS"
-> Envia consulta -> Aguarda resposta -> Retorna com fontes
