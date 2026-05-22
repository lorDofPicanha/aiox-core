---
squad: devops (Gage)
date: 2026-05-14
phase: 2
gap_target: L2 (OTel-style observability for AIOS)
sources_count: 10+
---

# 🚢 Dossier @devops — OpenTelemetry para AI Agents 2026

## 1. Princípios fundamentais

### 1.1 OTel como standard universal pra agent observability

> "OpenTelemetry helps trace requests across routing agents, specialist agents, LLM inference, MCP servers, and external integrations." — Red Hat Devs 2026

A **GenAI semantic convention** do OTel (baseada no Google AI agent white paper) define schema padrão pra spans/traces de agentes. Adotar = compatibilidade automática com Jaeger v2, Grafana, Prometheus, Datadog.

### 1.2 Anatomia de trace para agente

Cada agentic workflow gera:
- **Root span**: a sessão/request inteira
- **Child spans**: cada tool call, cada LLM invocation, cada retrieval step
- **Resultado**: trace completo da reasoning chain — debugável

Sem essa estrutura, falha em multi-step agent é caixa-preta.

### 1.3 Stack vencedora 2026

```
Agent code (instrumented com OTel SDK)
          ↓
OTel Collector (recebe + processa + samplea)
          ↓
Backend(s): Jaeger v2 / Grafana Tempo / Datadog APM
          ↓
Dashboards + alerts + on-call
```

**Princípio:** "Instrument once, send to multiple backends." Não fica preso em vendor.

### 1.4 Aplicação ao AIOS — gap L2

Hoje AIOS tem `.aios/logs/agent.log` (text logs simples) e nada de tracing estruturado. HYDRA pipeline travamento 12/Mai foi caso clássico — sem trace, root-cause demorou 2 dias e múltiplas tentativas.

Proposta concreta:
1. Adicionar OpenTelemetry SDK no `tools/hydra/` (`@opentelemetry/sdk-node`)
2. Instrumentar `pipeline.js`:
   - `pipeline.run` = root span
   - `phase.fetch`, `phase.normalize`, `phase.score` = child spans
   - `source.fetch:{name}` = grandchild spans com timeout/duration tags
3. Export pra Jaeger v2 local (Docker) em dev, OTel Collector em prod
4. Trace replay: `aios trace view {run_id}` → terminal-friendly visualização (CLI First!)

### 1.5 CI/CD integration pattern

```yaml
# .github/workflows/agent-trace-validation.yml
on: [pull_request]
jobs:
  trace_check:
    steps:
      - run: npm run hydra:run -- --emit-traces
      - run: npm run trace:validate -- --baseline=main
        # Falha se: latency p99 > baseline + 20%
        # Falha se: erro spans aumentam vs baseline
        # Falha se: phase coverage < 100%
```

## 2. Anti-padrões a EVITAR

| Anti-padrão | Custo |
|-------------|-------|
| Logs grep como única observability | Não escala, root-cause manual |
| Vendor lock-in (Datadog only, LangSmith only) | Migração custa $$$ depois |
| Sample rate 100% sempre | Bill explode em produção |
| Sem semantic conventions | Cada projeto reinventa schema |

## 3. Quiz de verificação

**Q1.** Por que OTel é diferente de logs tradicionais pra agentes?

**Q2.** O que é "GenAI semantic convention" e por que importa adotar?

**Q3.** Descreva como instrumentaria o `tools/hydra/src/pipeline.js` — quais spans criaria?

**Q4.** Como integraria em CI/CD pra prevenir regressão tipo HYDRA-12-Mai?

**Q5.** Por que "instrument once, send to multiple backends" é princípio importante? Cite 1 cenário concreto AIOS onde isso vale.

**Q6.** Verdadeiro ou falso: "Pra começar, basta adicionar `console.log` em cada step do pipeline." Justifique.

## 4. Fontes

- [Distributed tracing for agentic workflows OTel — Red Hat](https://developers.redhat.com/articles/2026/04/06/distributed-tracing-agentic-workflows-opentelemetry)
- [Jaeger v2 AI agent observability — TheNewStack](https://thenewstack.io/jaeger-v2-ai-observability/)
- [AI Agent Observability OTel blog](https://opentelemetry.io/blog/2025/ai-agent-observability/)
- [OTel for AI Systems 2026 — Uptrace](https://uptrace.dev/blog/opentelemetry-ai-systems)
- [How to Monitor AI Agents in Production — OneUptime](https://oneuptime.com/blog/post/2026-03-14-how-to-monitor-ai-agents-in-production/view)
- [Open Telemetry & AI Agents — Nexastack](https://www.nexastack.ai/blog/open-telemetry-ai-agents)

## 5. Pass criteria

- 5/6 questões corretas; Q3 obrigatório listar ≥3 spans específicos com nomes; Q4 obrigatório citar arquivo .yml + threshold concreto
- Failure → re-study 1.4 + 1.5, re-quiz Q3+Q4
