# FASE 3 — Functional Validation Test Plan

**Para executar:** dentro do Codex CLI (não no Claude Code)
**Tempo estimado:** 2-4 horas
**Gate de aprovação:** ≥ 8/10 PASS

---

## Pré-requisitos

1. Codex CLI instalado e funcional (`codex --version` deve retornar)
2. `cd D:\AIOS` antes de iniciar
3. Branch atual: `migration/codex-cutover` (`git branch --show-current`)
4. MCPs configurados em `.codex/config.toml` e `~/.codex/config.toml`
5. Auth Codex válida (`~/.codex/auth.json` presente)

---

## Como usar este documento

Para cada teste:
1. Cole o **PROMPT** no Codex CLI
2. Compare a resposta com **CRITÉRIO PASS**
3. Anote PASS/FAIL/PARTIAL na coluna **RESULTADO** da tabela final
4. Se FAIL, copie a resposta/erro para `04-fase3-resultados.md`

---

## T1 — Subagent invocation (legal-chief Tier 0)

**Hipótese testada:** Codex consegue spawnar subagent persona e produzir diagnóstico estruturado.

**PROMPT:**
```
@legal-chief faça um diagnóstico Tier 0 rápido (máx 200 palavras) do estado legal do workspace AIOS. Liste 3 itens urgentes e quem do squad atacaria cada um.
```

**CRITÉRIO PASS:**
- Resposta inclui apresentação como Legal Chief
- Lista 3 itens com prioridade
- Indica especialistas (`@lgpd-specialist`, `@ken-adams`, etc) para cada item
- Disclaimer de análise orientativa
- Tempo de resposta < 60s

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL  `[ ]` PARTIAL

---

## T2 — Brain-bridge MCP consultation

**Hipótese testada:** MCP `aios-brain-bridge` responde em Codex e retorna resposta de Mind Clone.

**PROMPT:**
```
Use o tool request_expert_consultation do MCP aios-brain-bridge para consultar o mind clone "patricia-peck" sobre:

"Em 100 palavras, qual a primeira coisa que vc revisaria num regimento interno de condomínio sob a ótica de LGPD?"

Project: aios-migration-test. Aguarde a resposta com get_consultation_response e me mostre o output.
```

**CRITÉRIO PASS:**
- MCP é invocado (sem erro de conexão)
- `request_expert_consultation` retorna ID de consulta
- `get_consultation_response` retorna texto com voz de Patricia Peck
- Resposta menciona LGPD + condomínio + ação concreta

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL  `[ ]` PARTIAL

---

## T3 — Agent activation + greeting (persona load)

**Hipótese testada:** Codex carrega agent definition + executa equivalente do greeting builder.

**PROMPT:**
```
/aios-master
```

**CRITÉRIO PASS:**
- Codex carrega `.codex/agents/aios-master.md` (ou .toml)
- Apresenta-se como Orion (Orchestrator)
- Mostra Quick Commands (pelo menos *help, *create, *task)
- Não trava nem retorna erro de pipeline

**Nota:** Persona "Orion" pode aparecer só como nickname (cosmético) — aceitar se core behavior funciona.

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL  `[ ]` PARTIAL

---

## T4 — Hook execution (rtk-rewrite + jarvis-auto-consult)

**Hipótese testada:** Hooks PreToolUse rodam corretamente em Codex.

**PROMPT:**
```
Rode: git status

Logo em seguida me diga: o output veio formatado pelo RTK (compacto)? Você consegue ver alguma evidência do hook rtk-rewrite.sh ter rodado antes do Bash?
```

**CRITÉRIO PASS:**
- `git status` é executado
- Output aparece formatado compactamente (sinal do rtk filter)
- Codex menciona o hook OU output visualmente diferente do `git status` raw

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL  `[ ]` PARTIAL

---

## T5 — Paralelismo de subagents (max_threads)

**Hipótese testada:** `agents.max_threads=8` permite múltiplos subagents simultâneos.

**PROMPT:**
```
Spawn dois subagents em paralelo:
1. @architect: descreva em 50 palavras o pattern de Circuit Breaker
2. @qa: liste 3 quality gates típicos pre-push em projeto Node.js

Quero AMBAS respostas. Confirme se rodaram em paralelo (mencione tempo).
```

**CRITÉRIO PASS:**
- Ambos subagents respondem
- Codex menciona paralelismo OU tempo total < soma dos individuais
- Sem erro de "max threads exceeded"

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL  `[ ]` PARTIAL

---

## T6 — Skill execution (agent-evals)

**Hipótese testada:** Skills do AIOS funcionam em Codex.

**PROMPT:**
```
/skills agent-evals

Em seguida, use o framework de avaliação da skill agent-evals para dar um SCORE (0-10) hipotético para uma consultation Patricia Peck sobre LGPD, considerando que ela:
- Cobriu 80% dos artigos relevantes
- Recomendou ação concreta
- Tempo de resposta foi 12s
- Custo estimado $0.02

Output em formato estruturado.
```

**CRITÉRIO PASS:**
- Skill `agent-evals` é localizada e ativada
- Codex aplica framework (4 dimensions: accuracy, style, latency, cost)
- Retorna score por dimensão + score global
- Sem erro "skill not found"

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL  `[ ]` PARTIAL

---

## T7 — Top-5 slash commands essenciais

**Hipótese testada:** Slash commands principais funcionam no Codex.

**PROMPTS** (rode um por vez):

```
/greet
```

```
/mission
```

```
/expert-consult
```

```
/bridge-status
```

```
/aios-master
```

**CRITÉRIO PASS:**
- ≥ 3 dos 5 retornam resposta esperada
- Os que falham retornam erro claro (não silent fail)

**RESULTADO POR COMANDO:**
- `/greet`: `[ ]` PASS  `[ ]` FAIL
- `/mission`: `[ ]` PASS  `[ ]` FAIL
- `/expert-consult`: `[ ]` PASS  `[ ]` FAIL
- `/bridge-status`: `[ ]` PASS  `[ ]` FAIL
- `/aios-master`: `[ ]` PASS  `[ ]` FAIL

---

## T8 — Session resume (`codex resume`)

**Hipótese testada:** Codex preserva estado entre sessões.

**PROCEDIMENTO:**
1. Crie uma sessão nova com este prompt:
   ```
   Lembre-se desta info: meu animal favorito é capivara, e estou no projeto AIOS migração. Não me responda nada, só confirme "registrado".
   ```
2. Saia do Codex (`/exit` ou Ctrl+C)
3. Liste sessões: `codex resume` (sem argumentos, deve mostrar picker)
4. Selecione a sessão recém-criada
5. Pergunte:
   ```
   Qual meu animal favorito e em que projeto estou?
   ```

**CRITÉRIO PASS:**
- Sessão aparece no picker
- Codex retoma e responde corretamente "capivara + AIOS migração"

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL  `[ ]` PARTIAL

---

## T9 — MCP tool call (mcp-ads-bridge)

**Hipótese testada:** MCP `mcp-ads-bridge` responde via Codex.

**PROMPT:**
```
Use o MCP mcp-ads-bridge tool meta_ads_list_accounts para listar minhas contas Meta Ads. Mostre os IDs e nomes das primeiras 3 (mascarando últimos 4 dígitos do ID).
```

**CRITÉRIO PASS:**
- MCP responde sem timeout
- Retorna ao menos 1 conta
- Sem erro de autenticação ou ENV

**Atenção:** se sua conta Meta estiver com sessão expirada, esse teste pode falhar por razão não relacionada à migração. Documentar como FAIL-INFRA, não FAIL-MIGRATION.

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL-MIGRATION  `[ ]` FAIL-INFRA  `[ ]` PARTIAL

---

## T10 — Workflow end-to-end (story-create simulado)

**Hipótese testada:** Workflow multi-step (vários agentes) funciona.

**PROMPT:**
```
Simule (sem realmente criar arquivo) o workflow story-development-cycle:

1. @sm: rascunhe título e 3 acceptance criteria para uma story "Adicionar comando /codex-doctor que valida setup do Codex"
2. @architect: review do AC (qualquer concern arquitetural?)
3. @qa: liste 2 testes pre-push para essa story
4. @dev: estime esforço em horas

Mostre os 4 outputs sequencialmente.
```

**CRITÉRIO PASS:**
- Todos 4 papéis respondem com sua persona
- Outputs encadeiam logicamente (architect comenta sobre o AC do sm, etc)
- Sem erro de "agent not found"
- Tempo total < 5min

**RESULTADO:** `[ ]` PASS  `[ ]` FAIL  `[ ]` PARTIAL

---

## Resumo de execução

| # | Teste | Resultado | Notas |
|---|---|---|---|
| T1 | Subagent legal-chief Tier 0 | | |
| T2 | Brain-bridge MCP consultation | | |
| T3 | Agent activation + greeting | | |
| T4 | Hook rtk-rewrite | | |
| T5 | Paralelismo subagents | | |
| T6 | Skill agent-evals | | |
| T7 | Top-5 slash commands | (3-5/5 = PASS) | |
| T8 | Session resume | | |
| T9 | MCP mcp-ads-bridge | | |
| T10 | Workflow end-to-end | | |

**Score total:** ___/10

**Gate de aprovação:**
- ≥ 8/10 PASS → AVANÇAR para FASE 4 (parallel period)
- 6-7/10 PASS → identificar gaps, corrigir, re-testar
- < 6/10 PASS → BLOCKER. Investigar root cause antes de continuar.

---

## Pós-execução

Salve o resultado em:
```
docs/migrations/claude-to-codex/04-fase3-resultados.md
```

Notifique-me (no Claude Code ou Codex) com o score e eu prossigo com FASE 4 ou diagnóstico.

---

## Troubleshooting rápido

| Sintoma | Diagnóstico |
|---|---|
| "agent not found" | Rodar `npm run sync:ide:codex` novamente |
| MCP timeout | Verificar `.codex/config.toml` paths e ~/.codex/config.toml |
| "max_depth exceeded" | Verificar `[agents] max_depth = 2` no `.codex/config.toml` |
| Slash command não funciona | Verificar `.codex/prompts/` existe e tem o arquivo |
| Hook não roda | Verificar `.codex/hooks.json` matcher |
| Skill não encontrada | Verificar `.codex/skills/` ou `~/.agents/skills/` |
| Persona não carrega | Verificar caminho do agent file no `.codex/agents/` |
