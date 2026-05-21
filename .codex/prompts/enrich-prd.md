---
description: "Uso"
source: "claude-code .claude/commands/enrich-prd.md"
migrated: "2026-05-19"
---

# /enrich-prd — Enriquecer PRD com expertise dos Mind Clones

## Uso
Pega um PRD existente e o enriquece com recomendacoes do
ultimo Conclave de validacao.

## Fluxo
1. Ler o PRD atual (do usuario ou de docs/prd/)
2. Buscar brief do Conclave via `get_analyst_brief`
3. Para cada recomendacao dos experts:
   - Apresentar ao usuario
   - Perguntar: aceitar, rejeitar, ou modificar
4. Gerar PRD enriquecido com secoes de cada expert
5. Salvar em docs/prd/
