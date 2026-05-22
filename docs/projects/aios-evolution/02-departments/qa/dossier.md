---
squad: qa (Quinn)
date: 2026-05-14
phase: 2
gap_target: L2 (eval/observability)
sources_count: 10+
---

# 🛡️ Dossier @qa — Agent Evaluation & Quality Gates 2026

## 1. Princípios fundamentais

### 1.1 Distinção crítica: Agent eval ≠ LLM monitoring

> "AI agent observability is distinct from LLM monitoring — agent failures appear in multi-step causal chains, not at individual call level, and require full-session trace capture to detect."

Implicação: você NÃO pode debugar agent failure olhando só a última call. Precisa do trace completo.

### 1.2 Três princípios não-negociáveis (consenso 2026)

1. **Instrument everything before you optimize anything** — sem trace, optimizar é chute
2. **Close the loop from production trace to regression dataset** — falha real em prod vira test case
3. **Let automated evaluations replace instinct-based release decisions** — gut feeling não escala

### 1.3 Anatomia de eval framework production-grade

```
┌─────────────────────────────────────────────────┐
│  Layer 1: Metrics (per architectural layer)     │
│  - Tool call accuracy                           │
│  - Reasoning quality (LLM-as-judge)             │
│  - Task completion rate                         │
│  - Latency / cost per task                      │
├─────────────────────────────────────────────────┤
│  Layer 2: Test harness                          │
│  - Test case repository                         │
│  - Runner that executes metrics                 │
│  - Result storage + diff vs baseline            │
├─────────────────────────────────────────────────┤
│  Layer 3: Regression gates                      │
│  - Threshold scores per metric                  │
│  - Block deploy if pass rate < 100% (prod)      │
│  - PR comment com improvements + regressions    │
└─────────────────────────────────────────────────┘
```

### 1.4 Tools-padrão 2026

| Tool | Forte em | Trade-off |
|------|----------|-----------|
| **Braintrust** | Eval-first arch, lowest setup overhead pra PR review | Pago |
| **Galileo (Luna-2)** | Sub-200ms eval, 97% lower cost que LLM-as-judge padrão | Modelo proprietário |
| **Arize Phoenix** | OTel-native, open-source, self-hostable | Mais setup |
| **Langfuse** | Observability + eval combinados | Acquired by ClickHouse Jan/2026 |
| **LangSmith** | Integrado com LangChain ecosystem | Lock-in com LC |

### 1.5 Tipos de evaluation (cada um cobre algo diferente)

| Tipo | Pergunta que responde | Frequência |
|------|----------------------|------------|
| **Task-based** | Agent completou o objetivo? | Toda PR |
| **Process** | Reasoning/action sequences eficientes? | Toda PR |
| **Regression** | Ainda passa em tudo que passava? | Toda PR (~100% target) |
| **Adversarial** | Quebra com inputs maliciosos? | Sprint review |
| **Drift** | Performance caiu vs baseline ao longo do tempo? | Daily/weekly |

## 2. Aplicação imediata em AIOS

### 2.1 Lacuna L2 — proposta concreta

AIOS hoje tem `npm test` + `npm run lint` + `npm run typecheck` como quality gates. **Falta camada de agent evaluation.**

Proposta: adicionar `npm run eval:agents` que:
1. Roda test cases em `tests/agent-eval/{agent}/cases/*.json`
2. Cada case: input + expected behavior + metrics
3. Executa agent via CLI, captura trace
4. Compara contra baseline em `tests/agent-eval/baselines/`
5. Gera report `agent-eval-results-{date}.md` com pass/fail + delta

### 2.2 Caso real — HYDRA pipeline travamento 12/Mai

Como eval framework pegaria o bug:
1. Test case "ingest-1-source-rss" → expected output_file > 0 bytes em < 60s
2. Trace captura: Phase 1 fetch acontecendo, Phase 2-6 nunca rodam
3. Metric "phase_completion_rate" cai pra 1/7 = 14%
4. Regression gate falha (baseline era 7/7 = 100%)
5. PR/deploy bloqueado, owner notificado com trace

Sem isso → travamento silencioso descoberto só por user esperando 5min.

### 2.3 Integration com CI/CD

```yaml
# .github/workflows/agent-eval.yml
on: [pull_request]
jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - run: npm install
      - run: npm run eval:agents -- --baseline=main
      - uses: braintrustdata/eval-action@v1
        with:
          comment_on_pr: true
```

## 3. Anti-padrões a EVITAR

| Anti-padrão | Custo |
|-------------|-------|
| Eval só em produção (sem test harness) | Bugs descobertos por usuário |
| Single metric (só "task completion") | Cega pra reasoning quality drift |
| Sem regression gate em CI | Backsliding silencioso |
| LLM-as-judge sem cache | Custo explode |
| Trace só de erros | Casos "OK mas lentos" passam batido |

## 4. Quiz de verificação

**Q1.** Por que agent eval é diferente de LLM monitoring tradicional?

**Q2.** Quais os 3 princípios não-negociáveis de eval framework segundo consenso 2026?

**Q3.** Cite os 5 tipos de evaluation e o que cada um cobre.

**Q4.** Olhando o caso HYDRA travamento 12/Mai (Phase 1 começou, Phase 2-6 nunca rodaram), descreva (a) qual test case detectaria isso, (b) qual metric falharia, (c) onde regression gate bloquearia.

**Q5.** Compare Braintrust vs Arize Phoenix — qual escolher pra AIOS e por quê?

**Q6.** Verdadeiro ou falso: "Se o `npm test` passa, posso fazer deploy do AIOS sem rodar agent eval." Justifique.

## 5. Fontes (primary)

- [AI Agent Evaluation Framework — Braintrust](https://www.braintrust.dev/articles/ai-agent-evaluation-framework)
- [Demystifying Evals for AI Agents — Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Best AI Agent Evaluation Tools 2026 — Augment Code](https://www.augmentcode.com/tools/best-ai-agent-evaluation-tools)
- [Agentic AI Evaluation Strategies — Vector Institute](https://vectorinstitute.ai/agentic-ai-evaluation-strategies/)
- [AI Agent Testing Automation Workflows 2026 — SitePoint](https://www.sitepoint.com/ai-agent-testing-automation-developer-workflows-for-2026/)
- [Agent Evaluation Framework Metrics & Benchmarks — Galileo](https://galileo.ai/blog/agent-evaluation-framework-metrics-rubrics-benchmarks)
- [Complete Guide LLM & AI Agent Evaluation 2026 — Adaline](https://www.adaline.ai/blog/complete-guide-llm-ai-agent-evaluation-2026)

## 6. Metadata pra learning loop

- **Pass criteria:** 5/6 questões corretas, Q4 obrigatório citar metric concreto + gate location
- **Failure action:** Re-study 1.3+2.2, re-quiz com Q3+Q4 reformuladas
