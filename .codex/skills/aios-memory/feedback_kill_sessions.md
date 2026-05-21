---
name: Cuidado ao Matar Processos
description: NUNCA usar taskkill //F //IM node.exe — mata TODOS os processos Node incluindo servers ativos de outros projetos
type: feedback
originSessionId: 824c915f-1fca-42c7-ae5a-97e0af42618f
---
NUNCA usar `taskkill //F //IM node.exe` para reiniciar um dev server. Isso mata TODAS as sessões Node do sistema, incluindo servers de outros projetos que o usuário está rodando.

**Why:** Usuário perdeu múltiplas sessões ativas quando um taskkill genérico matou todos os processos Node de uma vez.

**How to apply:**
- Para matar um server específico, usar `npx kill-port {porta}` ou `taskkill //F //PID {pid_especifico}`
- Sempre identificar o PID específico antes de matar
- Se precisar reiniciar dev server, parar apenas aquele processo
- NUNCA usar wildcards ou matchers genéricos de processo
