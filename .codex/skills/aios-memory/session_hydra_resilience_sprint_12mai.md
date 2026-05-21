---
name: HYDRA Resilience Sprint Setup 12/Mai
description: Sprint planning + 2 critical stories shipped (1.1a + 1.12). User's question "how does agent access knowledge" exposed structural bug — consultation engine never read feeds. Bug FIXED empirically.
type: project
originSessionId: 599ac926-41c2-4280-a11d-b776920d5101
---

## HYDRA Resilience Sprint — 12/Mai/2026

**Status:** ✅ SETUP COMPLETO. Sprint pronto pra Phase 3 (Development Cycle).
**Branch:** `feat/hydra-resilience-sprint` (4 commits, NÃO pushado)
**Atualizado:** 12/Mai/2026

### O Sprint nasceu de 3 problemas

1. **OOM crash do scheduler** (DOWN desde 16/Abr não 08/Mai — Aria descobriu via heartbeat.json)
2. **Codepath drift** entre live pipeline e `ingest-dossier.mjs` (deptToDomainMap patches só no dossier)
3. **🚨 BUG ESTRUTURAL FUNDAMENTAL (descoberto nesta sessão):** `self-consultation.js` NUNCA lia os feeds. Clones respondiam com conhecimento congelado e inventavam papers recentes.

### A pergunta que destravou tudo

User: *"como eu vou saber se os dados não vao apodrecer e deixar meus agentes alucinando, como este dados são gerados para meus agentes, como ele e catalogado e como o agente acessa este conhecimento"*

**Resposta inicial:** apenas teoria.
**Validação empírica:** rodei `consult --expert alison-darcy` e descobri `mindCloneEnrichment.relevantMemory: []` (vazio).
**Confirmação:** `grep -r knowledge-feed .aios-core/` → No matches found.
**Implicação:** todos os 25.150 + 11.013 feed writes das sessões 08/Mai foram **write-only silo**. Clones nunca viram a pesquisa fresca.

### Bug FIXED — Story 1.12 shipped

Story 1.12 (Connect Feeds to Consultation Engine) implementada por @dev:
- Novo módulo `tools/hydra/src/distribution/feed-reader.js` (369 LOC)
- Patch `self-consultation.js` injeta seção "Recent Knowledge" no prompt
- Field rename: `feedEntries: FeedEntry[]` (novo) + `relevantMemory: []` (legacy alias `@deprecated`)
- Quarantine flag para entries pre-2026-05-12 (anti-hallucination ingestion ainda imperfeita)
- Token budget 30k per expert
- Staleness signal explícito quando feed vazio
- CLI: `hydra feed read <clone>` + `hydra feed coverage`

**Validação após fix:** `consult --expert alison-darcy` agora retorna `feedEntries.length === 412`. Prompt inclui URLs reais (nature.com, medrxiv.org, pubmed, fapesp, gov.br).

### Descobertas extras críticas

1. **Engine de consultation INTEIRO estava deletado** entre 2026-04-17 e 2026-04-18. `self-consultation.js`, `consultation-engine.js`, `project-detector.js` — todos perdidos. Dex restaurou do snapshot `wip/2026-04-17-full-state`. Documentação `.claude/rules/jarvis-integration.md` referenciava arquivos fantasmas.

2. **`mindCloneEnrichment` nunca existiu** no engine real. C-10 audit da Aria descrevia estado fantasma. Dex criou o campo do zero.

3. **`consult()` virou async** — contract change. Audit confirma zero external callers afetados.

### Patches ad-hoc descobertos vivos no working tree

`routing.yaml` + `mind-clone-router.js` tinham patches das sessões 08/Mai (Anipis/High-Ticket) **nunca commitados**:
- `max_clones_per_item: 10 → 25`
- `deptToDomainMap` +19 entries (ops/therapy/health-tech/health-data/etc)

Commitados como WIP em `215221fa` preservando evidence. Story 1.6 vai substituir por YAMLs 3-layer.

### Artefatos produzidos

**Documentação (~7.200 LOC):**
- `01-analysis/project-documentation.md` (828 LOC, Aria)
- `02-prd/prd.md` v1.0 RC (931 LOC, Orion + Morgan)
- `03-architecture/architecture.md` (1.262 LOC, Aria)
- `03-architecture/adrs/ADR-001 a ADR-004` (895 LOC, Aria)
- `03-architecture/audits/C-10-relevantMemory-audit.md` (199 LOC, Aria)
- `03-architecture/conclave/conclave-output.md` (~450 LOC, Orion via clones)
- `04-validation/po-validation-report.md` (multi-pass PASS, Pax)
- `02-prd/sharded/` (16 files, Pax)
- `03-architecture/sharded/` (12 files, Pax)

**Código shipped (974 LOC + 329 tests):**
- Story 1.1a: 7 preflight scripts (214 LOC) + 5 tests (132 LOC)
- Story 1.12: feed-reader + types + tests + CLI + consultation patch (628 + 329 LOC)

**Tests:** 44 suites / 614 passing (era 597 antes da Story 1.12).

### Mind Clone Conclave executado

martin-fowler + werner-vogels + charity-majors — 3 ADRs sintetizados:
- ADR-001 Streaming: pure async iteration, rejeita Worker threads + queue
- ADR-002 Vector Search: LRU cache default, sqlite-vss fallback condicional
- ADR-003 Observability: SQLite-based (pipeline_items + pipeline_errors + hydra query CLI), rejeita Prometheus

**Cross-cutting blind spots cada um pegou do outro:**
- Fowler: characterization tests pre-refactor (Story 1.1c)
- Werner: per-stage failure handling com `{success, error}` shape
- Majors: `pipeline_items` + `hydra query` CLI

### Decisões aprovadas pelo user nesta sessão

1. ✅ Workflow brownfield-service (não brownfield-fullstack/discovery)
2. ✅ document-project antes de PRD (run by Aria, found 5 memory drifts)
3. ✅ Conclave na fase Architecture (não pre-PRD)
4. ✅ Heap budget 2GB (não 1GB nem 4GB)
5. ✅ 3 YAMLs separados para domain mapping (vs single source)
6. ✅ Quebrar pipeline.js em src/pipeline/{orchestrator + stages/}
7. ✅ Pre-flight test scripts formalizados em §3.4
8. ✅ Single epic comprehensive (não múltiplos)
9. ✅ Conclave AGORA antes de architecture.md
10. ✅ sqlite-vss como conditional fallback (não rígido sem deps)
11. ✅ Synthetic characterization fixture (mocked LLM, determinístico)
12. ✅ Iniciar Story 1.1a EARLY em paralelo (não esperar shard)
13. ✅ @pm corrige concerns (formal) vs Orion direto
14. ✅ Commit baseline antes de shard
15. ✅ 30k tokens POR expert (não por conclave)
16. ✅ ADR-004 + rename relevantMemory → feedEntries (paralelo @pm + @architect)
17. ✅ Story 1.12 EARLY hotfix-class
18. ✅ Commit Story 1.12 + shard em paralelo
19. ✅ Patches ad-hoc commitados como WIP (preserva evidence)

### Patterns valiosos aprendidos

**1. Sempre validar empiricamente antes de assumir.** Bug do consultation engine só apareceu após rodar `consult --expert alison-darcy` real. Grep + arquitetura papers diziam que estava OK.

**2. Mind Clone consultation engine TINHA sido deletado.** Documentação referenciava arquivos fantasmas. Sempre testar feature antes de confiar em rules/docs.

**3. Audit catches phantom state.** C-10 audit da Aria descreveu campo `mindCloneEnrichment` que nunca existiu — porque ela trabalhou de uma representação stale. Restoration descobriu reality.

**4. Document drift is silent killer.** 38-day-old memory tinha 5 claims errados (88 sources era 115; pipeline 35.7KB era 963 LOC; DOWN since 08/Mai era 16/Abr). Aria's document-project corrigiu todos.

**5. Anti-rotting é sobre CONSUMPTION, não ingestão.** HYDRA tinha anti-hallucination perfeito na ingestão (quote verifier, content validator) mas zero proteção na consumption. Story 1.12 adicionou: tier filter, staleness signal, quarantine flag, source attribution mandatória.

**6. Sprint #1 ia entregar OOM fix MAS sistema continuaria inútil sem Story 1.12.** Sequenciar: discovery → ingestão → consumo. Pular consumption-side = write-only silo.

### Stories pendentes (10 + Story 1.1b em progresso)

| # | Story | Estimate LOC |
|---|-------|--------------|
| 1.1b | status.js SQLite fix (em progresso) | ~10 |
| 1.1c | Characterization fixture | ~200 |
| 1.2 | vector-store SQLite + LRU spike | ~400 |
| 1.3 | semantic-dedup SQLite | ~350 |
| 1.4 | Pipeline split (BIGGEST) | ~1.200 |
| 1.5 | Streaming + pipeline_errors DDL | ~800 |
| 1.6 | DistributionService + 3-layer YAML | ~500 |
| 1.7 | --from-jsonl flag | ~250 |
| 1.8 | Cost tracker + Telegram /cost | ~300 |
| 1.9 | Graceful shutdown + OOM warning | ~250 |
| 1.10 | Docs + runbook | ~500 |
| 1.11 | pipeline_items + hydra query CLI | ~700 |

**Critical path:** 1.1c → 1.4 → 1.5 → 1.11 → 1.10 (~5 stories sequenciais)
**Estimativa restante:** 2-3 semanas de @dev

### Triggers para retomar

- `continuar sprint hydra` — pega próxima story do critical path
- `vai com story 1.X hydra` — implementa story específica
- `audit hydra` — checa estado atual (scheduler down/up, feeds frescos, etc)
- `push hydra resilience` — @devops empurra branch pra remote
- `merge hydra resilience` — quando todas stories shipped

### Files críticos pra referência

| Arquivo | Conteúdo |
|---------|----------|
| `docs/projects/hydra-content-intel/resilience-sprint/02-prd/prd.md` | PRD v1.0 RC (931 LOC) |
| `docs/projects/hydra-content-intel/resilience-sprint/03-architecture/architecture.md` | Arch (1.262 LOC) |
| `docs/projects/hydra-content-intel/resilience-sprint/03-architecture/adrs/` | 4 ADRs |
| `docs/projects/hydra-content-intel/resilience-sprint/02-prd/sharded/` | 16 dev-ready shards |
| `tools/hydra/src/distribution/feed-reader.js` | NEW (Story 1.12) |
| `.aios-core/core/jarvis/self-consultation.js` | PATCHED (Story 1.12) |

### Outstanding (não bloqueia)

- 126 arquivos `feat/redesign-foundation-tokens` no working tree (stashed@{0})
- 3 trailing-space dirs em `docs/projects/tocks/assets/...` quebrando git ops
- Sprint #2 backlog: re-audit `relevantMemory` em 2026-06-12, deletar legacy alias

**Why:** Esta sessão expôs que HYDRA era write-only silo. Sem Story 1.12, sprint inteiro entregaria OOM fix com sistema inútil. User's question on knowledge access foi o turning point.

**How to apply:** Continuar sprint pulling stories sharded. Critical path 1.1c → 1.4 → 1.5. Antes de implementar Story 1.6, ler o WIP commit `215221fa` pra ver exatamente quais 19 departments migrar pra YAMLs.
