# FASE 4 - Parallel Period (Codex Primary)

**Inicio:** 2026-05-20  
**Timezone operacional:** America/Sao_Paulo  
**Duracao alvo:** 5-10 dias  
**Gate de entrada:** FASE 3 Track A 10/10 PASS  
**Gate de saida:** 5 dias consecutivos so-Codex sem regressao operacional

## Status de abertura

FASE 4 iniciada. Codex passa todos os gates especificos da migracao:

| Check | Resultado |
|---|---|
| `codex doctor` | PASS - 11 ok, 0 fail degraded, 9 MCPs ativos |
| `codex exec` smoke | PASS - startup limpo |
| `npm run validate:codex-sync` | PASS |
| `npm run validate:codex-skills` | PASS |
| `npm run validate:codex-integration` | PASS |
| `npm run validate:codex-cutover` | PASS - contrato Codex cutover criado e validado |
| T1-T10 FASE 3 | PASS 10/10 |
| `npm run validate:paths` | PASS |

Baseline global:

| Check | Resultado | Decisao FASE 4 |
|---|---|---|
| `npm run validate:parity` | FAIL | P0 antes da FASE 5 |

Motivo do FAIL global: Codex e paths estao verdes, mas o contrato AIOS 4.0.4 ainda exige sync de Claude Code, Gemini, Cursor, GitHub Copilot e Antigravity. Esses alvos estao fora do escopo imediato do cutover Codex, mas precisam ser resolvidos antes de declarar cutover final perfeito.

## Regra operacional da FASE 4

1. Todo trabalho novo deve ser feito em Codex.
2. Trabalho ja aberto em Claude pode terminar em Claude, mas nao iniciar trabalho novo la.
3. Se Codex falhar em tarefa real, registrar regressao neste documento antes de usar Claude como fallback.
4. Fallback para Claude zera a sequencia de dias consecutivos so-Codex.
5. Nao entrar na FASE 5 enquanto existir regressao aberta ou contrato de paridade global sem decisao.

## Checklist diario

Rodar no inicio do dia:

```bash
npm run validate:codex-sync
npm run validate:codex-skills
npm run validate:codex-integration
npm run validate:codex-cutover
codex doctor
```

Rodar antes de push/pre-push quando houver alteracao em agentes, skills, prompts ou integracao IDE:

```bash
npm run validate:paths
npm run validate:parity
```

Interpretacao durante FASE 4:

- `validate:codex-*` falhou: regressao Codex, bloquear contagem do dia.
- `validate:paths` falhou: regressao global, bloquear contagem do dia.
- `validate:parity` falhou apenas por IDEs nao-Codex ja conhecidos: registrar, mas nao bloqueia operacao Codex diaria; bloqueia FASE 5 ate decisao/correcao.

## Criterios de regressao

Marcar como regressao se ocorrer qualquer item:

- Codex nao consegue ativar agente essencial (`/aios-master`, `@architect`, `@qa`, `@dev`, `@sm`, `@legal-chief`).
- MCP essencial falha sem causa externa: `aios-brain-bridge` ou `mcp-ads-bridge`.
- Slash command essencial volta a timeout/silent fail.
- Greeting pipeline volta a erro de modulo, timeout sem fallback ou comandos vazios.
- `codex resume` nao recupera sessao em fluxo real.
- Necessidade de abrir Claude para concluir trabalho novo.

## Rollback temporario

Se houver regressao P0/P1:

1. Registrar no log diario abaixo.
2. Classificar: `P0 bloqueia trabalho`, `P1 workaround existe`, `P2 ruido`.
3. Usar Claude apenas para destravar se Codex estiver bloqueado.
4. Corrigir em Codex assim que possivel.
5. Reexecutar T afetado + checks Codex.
6. Reiniciar contagem de 5 dias so-Codex.

## P0 da FASE 4 antes de cutover

### P0-1 - Contrato global de paridade

`npm run validate:parity` ainda falha por alvos nao-Codex:

- `claude-sync`
- `gemini-sync`
- `cursor-sync`
- `github-copilot-sync`
- `antigravity-sync`

Opcoes aceitaveis antes da FASE 5:

1. Sincronizar todos os alvos e fazer `validate:parity` passar.
2. Atualizar contrato AIOS 4.0.4 para refletir que Codex virou alvo primario e outros IDEs sao best-effort.
3. Criar contrato novo de cutover Codex com checks obrigatorios: `codex-sync`, `codex-integration`, `codex-skills`, `paths`, `codex doctor`, MCP smoke.

Decisao: contrato novo de cutover Codex criado e validado.

Arquivos:

- `.aios-core/infrastructure/contracts/compatibility/codex-cutover-2026-05.yaml`
- `.aios-core/infrastructure/scripts/validate-codex-cutover.js`
- `package.json` script `validate:codex-cutover`

Resultado em 2026-05-20:

```bash
npm run validate:codex-cutover
# PASS: codex-sync, codex-integration, codex-skills, paths, codex-doctor, codex-exec-smoke
# MCP servers detected: 9
```

`validate:parity` global continua sendo contrato multi-IDE e permanece fora do gate diario Codex. Ele bloqueia apenas uma declaracao futura de paridade global multi-IDE, nao a FASE 4 Codex-primary.

**UPDATE 2026-05-21 (D2):** `validate:parity` agora **PASSA**. A causa do FAIL era a
mesma do `codex-sync`: agents/commands novos nao propagados aos demais IDEs. Apos
`npm run sync:ide` (todos os alvos), os 6 syncs ficaram verdes:

```
claude-sync, codex-sync, gemini-sync, cursor-sync,
github-copilot-sync, antigravity-sync  -> todos PASS
Parity validation passed
```

Resultado: a opcao 1 do P0-1 (sincronizar todos os alvos) foi cumprida, alem do
contrato Codex-cutover (opcao 3). O bloqueio de paridade global multi-IDE para a
FASE 5 esta **levantado**.

Pendencia residual (nao-bloqueante, apenas WARN): o contrato AIOS 4.0.4 espera
contagens antigas (58 agents / 59 commands) enquanto a fonte real tem 201 / 199 —
atualizar os expected counts do contrato limpa os warnings. Tambem falta o arquivo
`.gemini/rules.md` (hoje existe `.gemini/rules/` como diretorio).

## Log diario

| Dia | Data | Codex checks | Trabalho novo feito em Codex? | Fallback Claude? | Regressoes | Contagem |
|---|---|---|---|---|---|---|
| D1 | 2026-05-20 | PASS (`codex-sync`, `codex-skills`, `codex-integration`, `codex-cutover`, `doctor`, `paths`) | Sim | Nao | Nenhuma regressao Codex; `validate:parity` global fica fora do gate diario | 1/5 |
| D2 | 2026-05-21 | PASS apos remediacao (`codex-sync` caiu p/ 139 missing: agents/commands novos de buscador-licitacoes+crm-novo nao propagados ao `.codex/`; `sync:ide:codex` -> 201/201; `codex-cutover` PASS) | Sim | Nao | Drift de sync (nao-funcional, fora dos criterios de regressao) corrigido; 1 WARN benigno skill-count 198/197 | 2/5 |
| D3 | 2026-05-22 | Pendente | Pendente | Pendente | Pendente | Pendente |
| D4 | 2026-05-23 | Pendente | Pendente | Pendente | Pendente | Pendente |
| D5 | 2026-05-24 | Pendente | Pendente | Pendente | Pendente | Pendente |
| D6 | 2026-05-25 | Pendente | Pendente | Pendente | Pendente | Pendente |
| D7 | 2026-05-26 | Pendente | Pendente | Pendente | Pendente | Pendente |
| D8 | 2026-05-27 | Pendente | Pendente | Pendente | Pendente | Pendente |
| D9 | 2026-05-28 | Pendente | Pendente | Pendente | Pendente | Pendente |
| D10 | 2026-05-29 | Pendente | Pendente | Pendente | Pendente | Pendente |

## Execucao sequencial - 2026-05-20

Comandos rodados em sequencia:

```bash
npm run validate:codex-sync
npm run validate:codex-skills
npm run validate:codex-integration
npm run validate:paths
codex doctor
npm run validate:codex-cutover
npm run validate:parity
```

Resultado:

- `validate:codex-sync`: PASS - 59/59 synced, 0 missing, 0 drift, 0 orphaned.
- `validate:codex-skills`: PASS - 55 skills checked.
- `validate:codex-integration`: PASS - agents 59, skills 56; avisos de contagem maior mantidos.
- `validate:paths`: PASS - 58 files checked.
- `codex doctor`: PASS - 11 ok, 9 MCP servers, 0 fail degraded.
- `validate:codex-cutover`: PASS - Codex cutover contract validado, MCP servers detected: 9.
- `validate:parity`: FAIL esperado fora do gate Codex-primary; falhas apenas em `claude-sync`, `gemini-sync`, `cursor-sync`, `github-copilot-sync`, `antigravity-sync`.

Conclusao: a parte automatizavel da FASE 4 esta verde para Codex-primary. O gate temporal de saida continua exigindo 5 dias consecutivos reais sem fallback Claude.

## Execucao sequencial - 2026-05-21 (D2)

Checklist diario rodado:

```bash
npm run validate:codex-sync       # FAIL inicial -> 201 expected, 139 missing, 0 drift
npm run validate:codex-skills     # PASS - 58 skills
npm run validate:codex-integration # PASS - agents 62, skills 59
npm run validate:codex-cutover    # FAIL (por codex-sync)
npm run validate:paths            # PASS - 61 files
# remediacao:
npm run sync:ide:codex            # 197 agents + 4 redirects sincronizados
npm run validate:codex-sync       # PASS - 201/201, 0 missing, 0 drift
npm run validate:codex-cutover    # PASS - MCP servers detected: 9
```

Diagnostico: nao foi regressao funcional do Codex. Os commits recentes
(`feat(buscador-licitacoes)`, `feat(crm-novo)`) adicionaram agents/commands ao
`.aios-core` canonico sem rodar `sync:ide`. Drift=0 confirma ausencia de
divergencia de conteudo — apenas artefatos `.codex/` faltantes. Remediado e
re-validado. Nenhum fallback Claude. D2 conta como 2/5.

Acao preventiva sugerida: hook pre-push que roda `sync:ide:codex` quando
houver alteracao em `.aios-core/development/agents` ou `.claude/commands/AIOS`.

## Gate de saida para FASE 5

FASE 5 so pode iniciar quando:

- 5 linhas consecutivas do log tiverem `Fallback Claude? = Nao`.
- Nenhuma regressao P0/P1 estiver aberta.
- `validate:codex-sync`, `validate:codex-skills`, `validate:codex-integration`, `validate:codex-cutover`, `validate:paths` estiverem PASS.
- Decisao P0-1 estiver fechada: contrato Codex cutover criado e PASS.
- Backup `.claude/` ainda existir para rollback.

## Comando de status rapido

Use este bloco para atualizar o dia:

```bash
npm run validate:codex-sync
npm run validate:codex-skills
npm run validate:codex-integration
npm run validate:codex-cutover
npm run validate:paths
codex doctor
```

Se qualquer comando falhar, nao contar o dia como so-Codex ate corrigir.
