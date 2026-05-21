---
name: Always Use Squads, Never Do It Yourself
description: Orion NUNCA implementa diretamente — SEMPRE delega para squads e agentes especializados com mind clones consultados.
type: feedback
originSessionId: e33169c2-065b-4f2b-aebe-828a0688fa4b
---
NUNCA fazer implementacao, pesquisa ou execucao diretamente como Orion. SEMPRE acionar o SQUAD INTEIRO + MIND CLONES relevantes.

**Why:** O usuario quer que o trabalho seja feito pelos squads completos (chefe + especialistas) com mind clones consultados, nunca por um agente solo ou pelo orchestrator. Orion e apenas coordenador.

**How to apply:**
- SEMPRE usar subagent_type de SQUAD (design-chief, copy-chief, traffic-masters-chief, etc.) — NUNCA aios-dev ou agente solo
- O chefe do squad faz o routing interno para os especialistas certos
- SEMPRE consultar mind clones relevantes antes/durante execucao (via brain-bridge MCP ou self-consultation)
- Para tarefas complexas: lancar multiplos squads em paralelo
- Orion so faz: orquestracao, compilacao de resultados, apresentacao ao usuario, decisoes de routing
- Mesmo para "apenas codigo": usar squad completo (design-chief para visual, copy-chief para textos, etc.)
- NUNCA mandar um agente solo (@dev, @qa) sem passar pelo chefe do squad primeiro
- Para DevOps: usar subagent_type "aios-devops" ou "general-purpose" com contexto de squad
- Design Squad DEVE usar MCP Design Studio tools: `nano-banana-2` (image gen), `stitch` (UI prototyping), `@21st-dev/magic` (component gen), `ui-ux-pro-max` (design intelligence). SEMPRE incluir instrucao de usar essas ferramentas no prompt do squad.
- SALVAR NA MEMORIA sempre que acionar o design squad (registrar o que foi pedido e entregue)
- Para site Tocks v2: SEMPRE gerar screens no Stitch primeiro (visual before code), depois componentizar
- 30/Abr 2026: user RE-ENFATIZOU "lembre de sempre ativar os clones e os squads em toda tarefa" — INCLUSIVE para tarefas que parecem rotineiras (PRD, story creation, etc.). NUNCA pular consulta a mind clones nem dispatch direto sem squad chief.
- 30/Abr 2026 (LIÇÃO CRÍTICA — sessão 700k tokens): squad agents seguem instruções LITERALMENTE. Briefing "trocar tokens + atualizar copy" → fazem só isso. NÃO extrapolam pra "redesenhar layout editorial". Pra redesigns visuais profundos, brief deve incluir ESTRUTURA do layout esperado (ASCII art ou wireframe), não só lista de mudanças. Mockups são ferramenta de COMPOSIÇÃO, não de COR. User feedback Bretda: "site mal feito, parece a mesma coisa". Próxima implementação visual: usar Claude.ai Artifacts (renderiza React em tempo real) ao invés de squad cego de mockup → código.
