# Conclave Synthesis — Fowler + Kim + Vogels (Manual)

**Data:** 2026-05-14
**Question:** How should we structure traffic-masters-chief + 7 specialists for paid traffic orchestration on Google Ads + Meta Ads (52→64 MCP tools)?

**Note:** The `self-consultation.js` script generates async prompts but does NOT auto-synthesize. It also auto-selected experts (BLITZ, bakul-patel, sugata-mitra) instead of fowler/kim/vogels. This synthesis is manual, applying the 3 mind-clones' core frameworks to the question.

---

## Martin Fowler — Architecture Perspective

### Pattern: Strategist + Specialists (NOT God Object)

Chief is the **strategist** — does routing, sequencing, handoff. Specialists are **workers** — executes domain-specific tasks. Decision #1 (standalone .md files) aligns perfectly.

### Failure modes when orchestrating subagents acting on external paid APIs

1. **God Object Trap**: Chief inline executes everything → becomes bottleneck, untestable, breaks single responsibility. **Mitigation**: hard rule — chief NEVER calls write MCP tools, only specialists do.

2. **Coupling cascade**: 64 tools change naming/schema → cascade of breakages across 20+ tasks. **Mitigation**: thin abstraction layer (`squads/traffic-masters/data/mcp-ads-bridge-routing.yaml`) — tasks reference logical names, routing maps to actual tool names. One file to update on MCP changes.

3. **Specialist data drift**: Two specialists interpret same metric (e.g., ROAS) differently. **Mitigation**: shared `data/glossary.md` defines terms canonically.

4. **Implicit handoff state loss**: Chief→specialist handoff drops context (campaign IDs, account, prior decisions). **Mitigation**: structured handoff protocol with mandatory fields (already in chief lines 158-168).

### Anti-patterns to avoid

- ❌ Chief that "knows everything" — should delegate to specialist for domain calls
- ❌ Specialists that bypass chief for cross-platform decisions (creates two truth sources)
- ❌ Tool calls scattered across tasks without abstraction (each task hardcoding `mcp__mcp-ads-bridge__google_ads_update_budget`)

---

## Gene Kim — Quality Gates + Observability Perspective

### Three Ways applied to paid traffic orchestration

**1st Way (Flow):** From audit → strategy → execution → validation, no manual handoff dropped. Workflows YAML enforces sequence.

**2nd Way (Feedback fast):** Budget jump >2x triggers automatic alarm + halt BEFORE execution. Cost-per-action delta tracking compares current vs 7d/30d baseline — alerts on >50% deviation.

**3rd Way (Continuous learning):** Memory layer (`.claude/agent-memory/traffic-masters-chief/`) updated post-action with success/failure pattern. Feeds back into pre-action protocol next session.

### Quality gates a paid traffic agent MUST have (non-negotiable)

| Gate | Trigger | Action |
|------|---------|--------|
| Pre-write `ads_guardrails` call | Every write MCP op | HALT if guardrail returns warning |
| Pre-action audit log via `ads_action_log` | Every write op | Record intent + rollback target |
| Budget jump circuit breaker | New budget / current > 2.0 | HALT + require human override |
| Pixel attached check | Pre-OFFSITE_CONVERSIONS campaign | Block if `meta_ads_pixel_check` fails |
| Saldo runway >3d | Pre-scaling decision | Block if days_remaining < 3 |
| OAuth fresh check | Pre-write op | Block if last refresh > 7d |
| Destination type validation | Pre-`meta_ads_create_ad` | Block if cross-destination mismatch |
| Geo Brasil enforcement | Every BR campaign | Auto-add 2076 + PRESENCE if missing |
| Smoke test (CTM WhatsApp) | Pre-declare CTM functional | Manual sender test required |

### Anti-patterns to avoid

- ❌ Silent failures (DigitalMarketer fetched 6 items all filtered as old — no alarm)
- ❌ Optimistic assumptions (assuming pixel works because it once worked)
- ❌ Guardrails as advisory (must be **blocking** for budget/scaling/destructive)

### Observability Stack

- `ads_performance_monitor` polled every X hrs → Telegram alert on anomalies
- Daily digest of changes via `google_ads_change_history` + `meta_ads_*_log`
- Per-account dashboards (sheet auto-updated via `google_sheets_*` tools)

---

## Werner Vogels — Distributed Systems Perspective

### "Everything fails, all the time" — Applied to MCP write ops

Just witnessed Anthropic API 529 overloaded mid-pipeline. Same will happen with Google Ads API quota, Meta API throttle, network blips. Architecture must assume failure.

### Idempotency / Retry / Rollback patterns

**Idempotency:**
- Every write MCP op MUST include client-generated idempotency key (UUID v4) — task generates, MCP server stores, retries with same key are no-ops
- Currently: NOT enforced. mcp-ads-bridge MAY support this — needs `ads_action_log` schema check

**Retry policy:**
- 5xx errors: exponential backoff (1s → 2s → 4s → 8s, max 4 attempts)
- 4xx errors: NO retry (budget caps, quota, perm = fix the request, not retry)
- 429 (rate limit): respect Retry-After header
- Currently: HYDRA's pipeline has NO retry on Anthropic 529 (lost 9 items today)

**Rollback (Saga pattern for multi-step):**
- Creating campaign = 3 ops (campaign → adset → ad). If ad fails, rollback adset+campaign
- Each step records compensating action in `ads_action_log` (delete_object for create, restore_status for status change, restore_budget for update)
- Implement as task-level saga, not MCP-level (chief enforces)

### Eventual consistency awareness

- Meta/Google APIs have 10-60s propagation delay after write
- Read-after-write may return stale data
- **Anti-pattern**: assume immediate visibility (test waits with retry, not single read)

### Anti-patterns to avoid

- ❌ "It worked once, will work always" optimism
- ❌ Long-running orchestrations without checkpoints (HYDRA had this — lost progress on travamento)
- ❌ Treating MCP as synchronous reliable RPC

---

## CONSENSUS (all 3 agree)

1. **Specialist standalone** — confirmed by Fowler (SRP), Kim (independent feedback loops), Vogels (failure isolation)
2. **`ads_action_log` mandatory pre-write** — Fowler (audit), Kim (observability), Vogels (rollback source)
3. **`ads_guardrails` pre-action gate** — Fowler (constraint enforcement), Kim (quality gate), Vogels (failure prevention)
4. **Budget jump circuit breaker** — universal agreement (memory `feedback_meta_budget_jump_no_more_2x` reinforces)
5. **Account context loader** (Pocock pattern) — Fowler (single source of truth), Kim (reduce undocumented decisions), Vogels (state visibility)

## DISSENT

1. **Idempotency enforcement** — Vogels says MUST. Fowler indifferent. Kim says nice-to-have. **Verdict**: required for write ops, optional for read ops.
2. **Retry policy aggressiveness** — Vogels says exponential 4 attempts. Kim says 2 attempts (faster failure surface). **Verdict**: 3 attempts with cap, manual escalation after.
3. **Saga vs. forward-fix** — Vogels prefers saga. Fowler says depends on cost (saga overhead). **Verdict**: saga for create_campaign multi-step (high cost of dangling state), forward-fix for status changes (cheap to retry).

## BLIND SPOTS (no expert addressed)

1. **Sales feedback closing the loop** — quality gates measure cost (CPL, CPA) but not REVENUE. Pedro Sobral's Metodologia ABC requires sales feedback spreadsheet — not addressed by Fowler/Kim/Vogels. Must add to architecture.
2. **Brazil-specific attribution fragmentation** (Meta inbox vs Ads attribution mismatch — KR case 12/Mai) — not a distributed systems problem, it's a data interpretation problem. Pedro Sobral's domain.
3. **Creative fatigue detection** — Ralph Burns' DPI² addresses, but not framed as quality gate by Kim. Should be observability metric (frequency >4 OR CTR drop >30% in 7d → alarm).

## VERDICT — 5 Non-Negotiable Design Decisions

1. **Specialist standalone .md files** (Decision #1 confirmed)
2. **Pre-write triple-gate**: `ads_guardrails` + `ads_action_log` + budget circuit breaker (>2x = halt)
3. **Account Context Loader** (`docs/projects/{account}/00-context/CONTEXT.md`) read FIRST before any work
4. **Idempotency keys + retry policy** for all MCP write ops (3 attempts exponential, 5xx only)
5. **Saga rollback** for multi-step writes (create_campaign), forward-fix for single-step

## NEXT STEP

Phase 3 Sprint 1 (Google + Brazil) starts with these 5 decisions baked into:
- `chief-upgrade-spec.md` — chief enforces gates 2 + 3
- `agents/kasim-aslam.md` + `agents/pedro-sobral.md` — specialists adopt patterns 1 + 4
- `data/quality-gates.yaml` — codify gate 2 thresholds
- `workflows/new-google-campaign.yaml` — saga rollback codified
- `checklists/budget-jump-safe.md` — gate 2c human checkpoint
