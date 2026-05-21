---
name: HYDRA Mega Research RESUME 12/Mai
description: Sessão fechada mid-execution. Phase 1 (HYDRA mega-search AI orchestration) iniciada — pipeline travou silenciosamente. Hotfix OOM commitado 80c12fc5. Próxima sessão retoma Phase 1 → 2 → 3.
type: reminder
originSessionId: 599ac926-41c2-4280-a11d-b776920d5101
---

## 🔴 RESUME POINT — HYDRA Mega Research

**User request original:** *"faça o sistema hydra fazer uma mega busca sobre arquitetura e orquetração de sistema de ia e agentes, assim saberemos qual e a melhor forma de nos organizado, apos isso faça uma mega pesquisa por departamento dando a cada agente mais conhecimento e tecnicas, quando terminar aplique esta conhecimento em algo, fica a vontade para cria o qeu quiser"*

**User correções:**
- HYDRA faz a pesquisa (não eu via WebSearch)
- Cobertura: TODOS os 36 squads + 162 mind clones (não só core)
- "foque nos principais nesta sessão" + "se for o caso resolva [OOM] antes"

### Fases planejadas

| Fase | O quê | Status |
|------|-------|--------|
| 1 | HYDRA pipeline ingere AI orchestration sources → distribui pra clones | 🔴 PAUSED (pipeline travou) |
| 2 | HYDRA roteia automatico per-dpt via routing.yaml 3-layer | ⏳ aguarda Phase 1 |
| 3 | Apply: synthesis + enrich agents + new skill via Story 1.12 consult | ⏳ aguarda Phase 2 |

### O que foi feito antes de pausar

1. **Workspace criado:** `D:/AIOS/docs/projects/aios-evolution/{01-research, 02-departments, 03-application}/`
2. **OOM hotfix aplicado e commitado** (`80c12fc5` no branch `feat/hydra-resilience-sprint`):
   - `thresholds.yaml`: `dedup.semantic.enabled true → false`
   - `pipeline.js`: gate `vector-store.upsert` behind `HYDRA_SKIP_VECTOR_STORE=1`
3. **Pipeline rodado:** `HYDRA_SKIP_VECTOR_STORE=1 node --max-old-space-size=4096 bin/hydra.js run --sources rss --verbose`
4. **Resultado:** travou silenciosamente — output file 0 bytes após 5+ min. Processes node visíveis mas pequenos (~50KB), não os heavy esperados.

### Hipóteses do travamento

1. **Network timeout** em adapters RSS (alguns feeds podem estar 404/lento)
2. **`fetchAll` pode estar bloqueando** sem timeout per-source
3. **Stdout buffer** pode estar bufferizando agressivamente (verbose flag ignorado?)
4. **DEEPSEEK_API_KEY** pode não estar setada (process exit silencioso?)

### Próxima sessão — execução

**Estratégia recomendada (ordem de prioridade):**

**Opção A (debug pipeline):**
1. Verificar env: `cat tools/hydra/.env` (deepseek key existe?)
2. Test 1 source isolado: `node bin/hydra.js run --source "ArXiv AI (cs.AI)" --verbose --dry-run`
3. Se OK: identificar gargalo. Se falhar: capture error real.

**Opção B (fallback proven):**
Usar `bin/ingest-dossier.mjs` pattern (sessões 08/Mai funcionou):
1. Curar jsonl externo com pesquisa AI orchestration (via WebSearch ou skill `tech-research`)
2. Format: `{tier, angle, title, url, tags, content, ...}`
3. `node bin/ingest-dossier.mjs --jsonl path --domain ai-ml --project aios-evolution`
4. HYDRA distribuirá automatic para mind clones

**Opção C (manual hybrid):**
Cada `@analyst + @architect` faz WebSearch parallel research, format output como HYDRA-feed-compatible markdown, drop em `D:/jarvis/mega brain/knowledge-feed/{agent-id}/2026-05-XX-hydra-feed.md`. Bypassa o pipeline mas usa o feed format. Story 1.12 (feed-reader) pega.

### Trigger pra retomar

- `continua hydra mega research` — retoma Phase 1
- `usa ingest-dossier hydra` — escolhe Opção B direto
- `debug hydra pipeline` — escolhe Opção A
- `apply hydra phase 3` — pula Phases 1-2, usa research existente

### Estado do branch

```
80c12fc5  fix(hydra): temp OOM hotfix — disable semantic dedup + skip vector-store env flag  ← HEAD
d64e1bb3  feat(site-prospector): launch project v1 (não-relacionado, criado outside session)
2174bd20  docs(hydra-resilience): mirror README positioning update from showcase repo
194b0a6f  docs(hydra-resilience): replace HANDOFF doc with SHOWCASE — pure project vitrine
0901c85b  docs(hydra-resilience): handoff for Alan Nicolas + Sprint #3 feasibility
2e89929a  feat(hydra): Story 1.1b - status.js SQLite read fix
f8f7c272  docs(hydra-resilience): shard PRD v1.0 RC + architecture for @sm consumption
215221fa  chore(hydra): WIP - ad-hoc deptToDomainMap patches from 08/Mai sessions
19cbc979  feat(hydra): Story 1.12 - connect feeds to consultation engine (CRITICAL bug fix)
8831fb86  feat(hydra): resilience sprint baseline + Story 1.1a preflight scripts
```

**Branch pushed para `fork` (lorDofPicanha/aiox-core).** PR #725 FECHADO.

### Repos relevantes

| Repo | Estado |
|------|--------|
| `lorDofPicanha/aiox-core` (fork) branch `feat/hydra-resilience-sprint` | 9 commits incluindo hotfix |
| `lorDofPicanha/hydra-content-intelligence` | Public showcase, 2 commits, README com posicionamento agentes |

### Sprint #1 Resilience — onde estamos

- **Stories shipped:** 3 de 12 (1.1a + 1.12 + 1.1b)
- **Tests:** 617/617 passing
- **Documentação:** ~7.500 LOC
- **Outstanding:** 9 stories (1.1c, 1.2-1.11)
- **Hotfix temp:** vector-store + semantic-dedup disabled via flag. Stories 1.2 + 1.3 vão re-enable via SQLite migration.

### TaskList ativa

#24 (pending): Phase 1: Mega research AI orchestration — PAUSED HYDRA travou
#25 (pending): Phase 2: Per-department enrichment — aguarda Phase 1
#26 (pending): Phase 3: Apply — aguarda Phase 2

### Outstanding session-level

- 126 arquivos `feat/redesign-foundation-tokens` ainda no working tree (stash@{0})
- 3 trailing-space dirs em `docs/projects/tocks/assets/material-apoio-2022/Material de apoio/` quebrando git ops

### Trigger pra audit Sprint #1 status

`audit hydra resilience` — confirma 3 stories shipped + branches + tests passing.

**Why:** Bug crítico descoberto nesta sessão (consultation engine deletado 17-18/Abr + nunca lia feeds) foi FIXADO. Mega research pode acelerar AIOS evolution mas pipeline precisa rodar primeiro. Hotfix preserva caminho.

**How to apply:** Próxima sessão, escolher Opção A/B/C acima. Recomendo B (ingest-dossier proven em 08/Mai) se quer entregar valor rápido, ou A se quer entender root cause do travamento.
