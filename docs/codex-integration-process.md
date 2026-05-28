# Integracao AIOS com Codex CLI

Este documento descreve o estado operacional da integracao AIOS + Codex CLI.
O foco aqui e operacao pratica, compatibilidade real e como manter sem regressao.

## Resumo Executivo

O Codex e alvo de primeira classe no AIOS:

- `AGENTS.md` como contrato operacional do projeto no Codex
- agentes sincronizados em `.codex/agents`
- skills em `.codex/skills` reservadas para capacidades reutilizaveis, nao agentes
- pipeline canonico de greeting/ativacao compartilhado
- validadores dedicados para detectar drift rapidamente
- suporte a notify command e hooks de ferramenta em releases recentes do Codex CLI

## Status de Compatibilidade

| O que voce quer fazer | Funciona no Codex? | Como fazer |
| --- | --- | --- |
| Ativar agentes AIOS | Works | use atalhos do `AGENTS.md` e carregue `.codex/agents/<agent-id>.md` |
| Usar skills | Works | use `/skills` apenas para capacidades reutilizaveis |
| Sincronizar e validar arquivos AIOS | Works | `npm run sync:ide:codex` e `npm run validate:codex-sync` |
| Checagens automaticas antes/depois de acoes | Limited | rode `npm run validate:parity` manualmente quando necessario |

Regra pratica: no Codex, agente e agente (`.codex/agents`); skill e capacidade (`.codex/skills`).

## Arquitetura Canonica

### Fonte de verdade

- Agentes canonicos: `.aios-core/development/agents/*.md`
- Agentes sincronizados para Codex: `.codex/agents/*.md`
- Regras de projeto Codex: `AGENTS.md`
- Skills locais: `.codex/skills/*/SKILL.md`, sem ativadores de agentes `aios-*`

### Pipeline de ativacao

- Runtime: `.aios-core/development/scripts/activation-runtime.js`
- Entrada de greeting: `.aios-core/development/scripts/generate-greeting.js`
- Contrato: atalhos carregam agente canonico e renderizam greeting via pipeline unificado

## Fluxo Operacional Recomendado

1. Sincronizar agentes Codex de projeto:
   - `npm run sync:ide:codex`
2. Preparar diretorio de skills reais:
   - `npm run sync:skills:codex`
3. Validar consistencia:
   - `npm run validate:codex-sync`
   - `npm run validate:codex-integration`
   - `npm run validate:codex-skills`
   - `npm run validate:paths`
4. No Codex, ativar agente pelo atalho do `AGENTS.md` e pela definicao em `.codex/agents/<agent-id>.md`.

`/skills` fica reservado para capacidades reutilizaveis como `agent-evals`, `brainstorming` e `frontend-patterns`.

## Guardrails e Anti-Regressao

Comando consolidado de paridade:

- `npm run validate:parity`

### Smoke test rapido

```bash
npm run sync:ide:codex
npm run sync:skills:codex
npm run validate:codex-sync
npm run validate:codex-integration
npm run validate:codex-skills
npm run validate:paths
```

Criterio de sucesso:

- `AGENTS.md` presente e coerente
- `.codex/agents/*.md` existente
- `.codex/skills/*/SKILL.md` sem ativadores de agentes `aios-*`
- validadores sem erro

## Problemas Classicos e Correcao

### Agente AIOS apareceu como skill

Causa tipica:

- gerador antigo ou artefato legado criou `.codex/skills/aios-*/SKILL.md`

Correcao:

- remover o ativador de agente de `.codex/skills`
- rodar `npm run sync:ide:codex`
- validar com `npm run validate:codex-skills`

### Greeting diferente entre Codex e outros alvos

Causa tipica:

- pular pipeline canonico de greeting

Correcao:

- sempre gerar greeting via `generate-greeting.js`
- garantir que o atalho carregue o agente canonico em `.aios-core/development/agents/` ou `.codex/agents/`

### Skills duplicadas no `/skills`

Causa tipica:

- artefatos duplicados entre `.codex/skills` e `~/.codex/skills`

Correcao:

- manter local-first neste repo
- evitar sync global durante desenvolvimento local

## Ordem de Verdade

1. `AGENTS.md`
2. scripts reais em `package.json`
3. este documento
4. docs de overview
