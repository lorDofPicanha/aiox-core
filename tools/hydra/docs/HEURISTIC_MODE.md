# HYDRA Heuristic Mode

**Run HYDRA without any LLM API key.** Pipeline executes end-to-end with deterministic scoring + extraction. Zero network calls beyond the existing RSS/GitHub fetchers, zero cost.

## When to use

- **Cost emergency** — Anthropic/OpenAI/DeepSeek quota exhausted, can't top up
- **Air-gapped runs** — no internet beyond fetch (e.g. offline laptop)
- **CI / smoke tests** — fast, deterministic, no LLM flakiness
- **Cheap continuous mode** — daily fetches over months with no spend

## When NOT to use

- **First production pass on a new domain** — LLM extracts subtle insights heuristics miss (quotes, framework names, opinions)
- **High-signal sources** (Pragmatic Engineer, First Round Review) — these deserve the full LLM extraction quality
- **Anything time-critical that depends on tier accuracy >90%** — heuristic ≈ 80% vs LLM judge

## How to activate

Two paths, both work:

### Path 1 — Force flag (recommended)
```bash
HYDRA_HEURISTIC_MODE=1 node bin/hydra.js run --verbose
```

Active even if API keys are set in `.env`. Useful for testing or saving cost on a single run.

### Path 2 — Auto-fallback
Just remove (or comment out) all three keys from `.env`:
```bash
# ANTHROPIC_API_KEY=
# DEEPSEEK_API_KEY=
# OPENAI_API_KEY=
```

`hasLLMKey()` returns true when there's no key (because heuristic counts as a "key"), so the pipeline's gating logic still works.

## Output quality vs LLM mode

| Function | LLM mode | Heuristic mode | Quality gap |
|---|---|---|---|
| `scoreContent()` | 5-dim Claude judge | Deterministic rubric: keyword density + lexical diversity + action signals + authority + Goldilocks word count | ~80% tier-classification agreement on a manual sample |
| `extractWisdom()` | Abstractive insights with evidence | Extractive: top-scored sentences | Insights look more mechanical; structure preserved |
| `summarize()` | Coherent 3-5 bullet abstractive summary | Top-scored sentences in source order | Reads OK; doesn't paraphrase |
| `labelAndRate()` | Multi-dim LLM judgment | Same as `scoreContent` | Identical to scoreContent path |

## What's preserved

- **All safety filters** — prompt injection detection, AI-slop filter, dedup, hash-similarity, hallucination cap, vector-store-skip env flag
- **Source authority weighting** — still used (15% of score)
- **Pipeline structure** — fetch → filter → score → process → ingest → distribute; only the score+process internals change
- **Cache layer** — scoring cache works the same way (heuristic results are deterministic, so cache hits are exact)
- **Distribution** — tier S/A/B items still flow to clones via routing rules (same forced_routes config)

## What changes

- `LLM Provider` log line still prints the detected default (e.g. `anthropic/claude-sonnet-4-5`) but it never actually calls the LLM — internal `isHeuristicMode()` check short-circuits before any API call
- `reasoning` field on each score contains heuristic provenance: `[heuristic] kw=8 div=0.42 actSig=4.9 words=1240 src_auth=4`
- Insights have `type` heuristically inferred (recommendation / framework / opinion / fact / quote) via regex patterns
- Extraction produces `summary` from extractive sentence selection (not abstractive)

## Implementation files

```
src/
├── processor/
│   ├── heuristic-judge.js     ← new (the heuristic engine)
│   └── extractor.js           ← patched (delegates extractWisdom/summarize/labelAndRate when in heuristic mode)
└── curator/
    └── llm-judge.js            ← patched (delegates scoreContent when in heuristic mode)
```

## How to extend the keyword bank

`src/processor/heuristic-judge.js` has `DOMAIN_KEYWORDS` object — one entry per HYDRA domain (crm-saas, engenharia, marketing, etc.). To add coverage for a new domain:

```js
const DOMAIN_KEYWORDS = {
  // ... existing ...
  'my-new-domain': ['keyword 1', 'keyword 2', 'specific term', ...],
};
```

The relevance score grows linearly with keyword matches (capped at 5). 20-30 well-chosen keywords per domain produce reliable scoring.

## Smoke tested (2026-05-17)

```bash
# Fresh run on Simon Willison Blog, no API keys
HYDRA_HEURISTIC_MODE=1 ANTHROPIC_API_KEY= OPENAI_API_KEY= DEEPSEEK_API_KEY= \
  node bin/hydra.js run --dry-run --source "Simon Willison Blog" --verbose

# Result:
# Fetched:      30
# Duplicates:   24
# Processed:    6
# Tiers:        A=1, B=4, C=1
# Errors:       0
# Duration:     1.8s
```

Pipeline completes cleanly with sensible tier distribution.

## Roadmap

- **Local LLM fallback** — patch `extractor.js` to support `OPENAI_BASE_URL` env (point at Ollama at `http://localhost:11434/v1`). Then heuristic mode becomes only for "no internet OR no model installed" situations
- **Train a tiny classifier** on the heuristic-vs-LLM disagreement corpus — get to ~95% accuracy with a 50MB ONNX model
- **Tag bank from active squad config** — read `domains.yaml` of the active squad to extend keyword coverage dynamically instead of hardcoding
