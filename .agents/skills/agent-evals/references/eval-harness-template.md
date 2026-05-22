# Eval Harness Template

Template canônico pra implementar agent eval suite.

## Suite Structure (YAML)

```yaml
suite:
  name: default
  version: 1.0
  description: Basic per-clone eval suite (5 Q&A + 3 style + latency + cost)
  clone: eric-ries  # target clone

  accuracy_tests:
    - question: "Qual a definição de Build-Measure-Learn?"
      ground_truth: |
        Build-Measure-Learn é o loop central de Lean Startup. Build = construir
        MVP. Measure = coletar dados sobre customer behavior. Learn = decidir
        pivot ou persevere baseado em validated learning.
      max_score: 1.0
      eval_method: llm-judge
      judge_model: claude-opus-4-7

    - question: "Quando pivotar vs perseverar?"
      ground_truth: |
        Pivotar quando os MVPs não validam hypothesis core. Perseverar quando
        métricas de engagement/retention crescem (mesmo que slow). Indicators
        chave: cohort retention curve, NPS evolution, paying conversion.
      max_score: 1.0
      eval_method: llm-judge

    # ... 3 more questions

  style_fidelity_samples:
    - source_excerpt: |
        "If we cannot fail, we cannot learn. Every minute spent building
        something nobody wants is a minute wasted. The startup's job is to
        figure out what should be built, in the cheapest, fastest way possible."
      generated_about: "Como escolher próximo feature pra construir"
      eval_method: vocabulary-overlap + llm-judge

    # ... 2 more samples

  latency_targets:
    p50_ms: 5000
    p95_ms: 15000
    p99_ms: 30000

  cost_targets:
    input_tokens_p50: 2000
    output_tokens_p50: 500
    cache_hit_rate_min: 0.4
```

## Scoring Algorithm

```javascript
function calculateHealthScore(results) {
  const weights = {
    accuracy: 0.4,
    style_fidelity: 0.3,
    latency: 0.15,
    cost: 0.15
  };

  const accuracyAvg = results.accuracy_tests.reduce((sum, t) => sum + t.score, 0) / results.accuracy_tests.length;

  const styleAvg = results.style_fidelity_samples.reduce((sum, s) => sum + s.score, 0) / results.style_fidelity_samples.length;

  const latencyScore = results.latency.p95 <= 15000 ? 1.0 :
                       results.latency.p95 <= 30000 ? 0.7 :
                       results.latency.p95 <= 60000 ? 0.3 : 0;

  const costScore = results.cost.cache_hit_rate >= 0.4 &&
                    results.cost.avg_input_tokens <= 3000 ? 1.0 :
                    results.cost.avg_input_tokens <= 6000 ? 0.5 : 0;

  return Math.round((
    accuracyAvg * weights.accuracy +
    styleAvg * weights.style_fidelity +
    latencyScore * weights.latency +
    costScore * weights.cost
  ) * 100);
}
```

## Output Format

```json
{
  "suite": "default",
  "clone": "eric-ries",
  "timestamp": "2026-05-15T15:30:00Z",
  "health_score": 87,
  "tier_recommended": "A",
  "results": {
    "accuracy": {
      "avg": 0.91,
      "tests": [
        { "question": "...", "score": 0.95, "judge_notes": "..." }
      ]
    },
    "style_fidelity": {
      "avg": 0.82,
      "samples": [...]
    },
    "latency": {
      "p50_ms": 4200,
      "p95_ms": 12100,
      "p99_ms": 24800
    },
    "cost": {
      "avg_input_tokens": 1850,
      "avg_output_tokens": 420,
      "cache_hit_rate": 0.45,
      "total_cost_usd": 0.0247
    }
  },
  "recommendations": [
    "Style fidelity below 0.85 — consider re-extracting Voice DNA via oalanicolas skill",
    "Cache hit rate 0.45 (target 0.4) — OK, no action"
  ]
}
```

## Integration with HYDRA Story 1.12

Consultation engine logs ja captura latency + cost per consultation. Eval suite usa esses logs para baseline data:

```bash
# Pull historical metrics from SQLite
sqlite3 hydra-data/hydra.db "
  SELECT clone_id,
         AVG(latency_ms) as avg_lat,
         AVG(input_tokens) as avg_in,
         AVG(output_tokens) as avg_out
  FROM consultations
  WHERE timestamp > datetime('now', '-7 days')
  GROUP BY clone_id;
"
```
