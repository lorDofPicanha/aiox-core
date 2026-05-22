---
name: agent-evals
description: Framework de avaliação estruturada para mind clones AIOS e agents Codex. Use esta skill quando precisar medir qualidade de consultations, validar fidelidade de Voice DNA de clones, benchmarkar latência/custo de agents, ou comparar performance pré/pós enrichment HYDRA. Estabelece harness padronizado com 4 dimensões (accuracy, style fidelity, latency, cost) baseado em Benchmarking AI Agents on Kubernetes pattern.
---

# Agent Evals

## Overview

AIOS possui **162 mind clones + 36 squads** mas zero framework estruturado de eval. Esta skill estabelece o harness canônico baseado em padrões industry (Benchmarking AI Agents on Kubernetes, InfoQ Architecting Autonomy) e nas práticas do Sprint #1 HYDRA.

**Quando usar:**
- Após enrichment HYDRA — medir se feeds melhoraram qualidade das responses
- Antes de promover mind clone novo a Tier S — validar fidelidade
- Quando consultation engine retorna respostas suspeitas — diagnosticar root cause
- Em audits trimestrais de clone fleet — score health

**Quando NÃO usar:**
- Tests unitários de código (use Jest/Vitest)
- Validação de business logic (use story acceptance criteria)
- Performance benchmarks de infra (use HYDRA pipeline metrics)

## Eval Framework — 4 Dimensions

### 1. Accuracy (correctness)

**Mede:** Quão correta é a response factualmente.

**Como:**
- Curar 10-20 question-answer pairs com ground truth conhecido
- Rodar consultation engine via `mcp__aios-brain-bridge__request_expert_consultation`
- Comparar response vs ground truth via:
  - LLM-as-judge (Codex Opus 4.7 com rubric)
  - Hallucination check (HYDRA Hallucination filter pattern)
  - Fact-checking via WebSearch para claims verificáveis

**Score:** 0-1 (1 = perfeita correctness)

### 2. Style Fidelity (Voice DNA)

**Mede:** Quão fielmente o clone replica o estilo de pensamento/escrita do source.

**Como:**
- Extrair 5 amostras do clone source (livros/artigos/talks)
- Pedir clone para gerar response sobre tópico equivalente
- Comparar via:
  - Vocabulary overlap (TF-IDF)
  - Sentence structure metrics (avg length, complexity)
  - Signature phrase detection (top 10 phrases do source)
  - Subjective LLM-as-judge: "Soa como Eric Ries?"

**Score:** 0-1 (1 = indistinguível do source)

### 3. Latency

**Mede:** Tempo end-to-end consultation → response.

**Como:**
```javascript
// Já implementado parcialmente em consultation-engine.js
const start = Date.now();
const response = await consultExpert({ expert, question });
const latency = Date.now() - start;
recordMetric({ clone, latency, timestamp: new Date() });
```

**Target:**
- p50: <5s
- p95: <15s
- p99: <30s

### 4. Cost (Token Economy)

**Mede:** Tokens consumidos por consultation.

**Como:**
- Tokens via Anthropic API response usage block
- Categorize: input tokens, output tokens, cache hits
- Cost per request via pricing atual ($/Mtok)

**Target:**
- p50: <2000 tokens input + <500 output
- p99: <10K input + <2K output
- Cache hit rate ≥40%

## Reference Implementation

Ver template completo em `references/eval-harness-template.md`.

```bash
# Run eval suite for a single clone
node .aios-core/development/scripts/eval/run-clone-eval.js --clone eric-ries --suite default

# Run full clone fleet eval (slow, overnight)
node .aios-core/development/scripts/eval/run-fleet-eval.js --output reports/eval-fleet-2026-05-15.json
```

## Eval Suites (canonical)

### Suite "default" (per-clone basic)
- 5 ground-truth Q&A pairs
- 3 style fidelity samples
- Latency + cost per request
- Output: clone health score (0-100)

### Suite "comparative" (post-enrichment delta)
- Roda mesma Q&A pré + pós-feed HYDRA
- Mede delta de accuracy + style fidelity
- Output: enrichment ROI report

### Suite "stress" (high-volume)
- 100 consultations em sequência
- Detecta degradation patterns
- Output: latency curve + cost breakdown

## Decisão Baseada em Score

| Health Score | Action |
|---|---|
| 90-100 | Promote to Tier S — ready for production conclaves |
| 70-89 | Tier A — usable mas needs targeted enrich |
| 50-69 | Tier B — feed HYDRA mais sources do source |
| 30-49 | Tier C — re-extract Voice DNA (run oalanicolas) |
| <30 | Deprecate — remove do consultation pool |

## Integration Points

- **Story 1.12 (HYDRA consultation engine)** — feed reader já loga consultations
- **Sprint #2 HYDRA** — eval suite roda automatic após cada pipeline run
- **oalanicolas mind cloning skill** — re-extract Voice DNA quando style fidelity <50
- **aios-qa agent** — pode executar eval suite via `*task run-clone-eval {clone-id}`

## Anti-Patterns

❌ **"Vibe check" eval** — não use intuição subjetiva. Use rubric estruturado.

❌ **Single ground truth** — clones nuançados precisam de multiple ground truths.

❌ **Eval em produção sem A/B test** — sempre eval em dataset separado antes de promover.

❌ **Ignorar cost** — Tier S clone com 10x cost de Tier A pode não justificar uplift.

## Origin

Skill criada **2026-05-15** como deliverable Phase 3 da AIOS Evolution Mega Research. Insights base:

- "Benchmarking AI Agents on Kubernetes" (InfoQ, Tier A 3.6) — infrastructure-level eval pattern
- "Architecting Autonomy: Decentralising Architecture" (InfoQ Mini Book, Tier A 4.45) — guardrails > approval chains
- "Categories of Inference-Time Scaling" (Sebastian Raschka, Tier S 4.75) — comparison methodology
- HYDRA Story 1.12 consultation engine — implementation layer existente

Ver `docs/projects/aios-evolution/03-application/synthesis-report.md` para context completo.
