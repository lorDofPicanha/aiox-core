# Mind Clone Consultation — Architecture Questions

**Status:** SCRIPT EXECUTION DEFERRED. Per `D:\AIOS\.claude\rules\jarvis-integration.md`, the self-consultation script is at `node .aios-core/core/jarvis/self-consultation.js`. Phase 1 deliverable scope is to **document the questions** for follow-up consultation; running the conclave during this Phase 1 would block the rest of the deliverables on async response and is not the critical path.

The questions below are formatted as **conclave-ready prompts** (`--question` arg). Each can be invoked manually post Phase 2 with:

```bash
node .aios-core/core/jarvis/self-consultation.js conclave \
  --question "{question}" \
  --project traffic-masters-rebuild \
  --agent traffic-masters-chief \
  --experts 3
```

---

## Question 1 — Architecture (Martin Fowler)

**Expert:** `martin-fowler`
**Topic:** Multi-specialist orchestrator design

**Prompt:**
> "We are rebuilding the traffic-masters-chief Claude Code subagent — an orchestrator that coordinates 7 domain specialists (Molly Pittman, Depesh Mandalia, Kasim Aslam, Tom Breeze, Nicholas Kusmich, Ralph Burns, Pedro Sobral) in paid traffic management. The chief must (a) route incoming missions to the right specialist via mission keyword + tier system; (b) integrate 52 external tool APIs (Google Ads + Meta Ads via mcp-ads-bridge); (c) enforce quality gates before any write operation (budget jump cap, pixel check, geo Brazil 2076 PRESENCE); (d) handoff context between specialists during multi-step workflows.
>
> Given (1) operational memory shows recurring failures (Instant Form trap, budget jump destroying learning, WhatsApp wrong number routing); (2) all 7 specialists do not yet exist as agents; (3) the chief must function autonomously inside Claude Code with `bypassPermissions`:
>
> What architectural patterns should we adopt? Specifically:
> - Should specialists be (a) standalone .md persona files invoked via Task tool, or (b) inline routing tables with chief executing all work, or (c) dynamic prompt-injection via `.claude/agents/`?
> - How should we structure the handoff state (in-conversation context vs file-based handoff manifests in `docs/projects/{account}/handoffs/`)?
> - What anti-patterns from your refactoring/architecture work should we explicitly design against?"

**Expected dimensions of answer:** modularization vs monolith trade-off, state ownership, dependency direction (chief → specialist or specialist → chief), interface segregation between specialists.

---

## Question 2 — Quality Gates / Observability (Gene Kim)

**Expert:** `gene-kim`
**Topic:** Quality gates + observability for paid traffic agent

**Prompt:**
> "We're building an autonomous Claude Code agent that operates real money on Google Ads and Meta Ads daily ($50-$500/day across 5 client accounts). Past production failures include:
> - Budget jumped R$27→R$120 (+344%) overnight, destroyed Meta learning, 14d limbo recovery
> - 99 WhatsApp leads routed to wrong number for 12 days (R$437 spend), only discovered via manual smoke test
> - Google conversion `default_value=R$100` codeless template misfired, corrupted Smart Bidding for weeks
> - 96% of spend concentrated in single ad (single hero), invisible until creative fatigue collapse
> - OAuth Google expires monthly, 403 cascades take down all operations until reauth
>
> Drawing from your DevOps work (Phoenix Project, Unicorn Project, DORA metrics):
> - What quality gate hierarchy should this agent implement (pre-write, post-write, periodic)?
> - What 'flow telemetry' must this agent emit (action log, change history, daily snapshots)?
> - What guardrails are non-negotiable when the agent has bypassPermissions on real-money APIs?
> - How do we balance autonomy ('chief executes') vs human-in-loop ('user must approve PIX, OAuth re-auth, deploys')?
> - What feedback loop tightens detection of these recurring failure modes from days→hours?"

**Expected dimensions of answer:** Five Ideals (Locality/Simplicity, Focus/Flow/Joy, Improvement of Daily Work, Psychological Safety, Customer Focus); change failure rate metric application; canary deployment analog for ad changes.

---

## Question 3 — Distributed Systems (Werner Vogels)

**Expert:** `werner-vogels`
**Topic:** Idempotency, retry, rollback for external API orchestration

**Prompt:**
> "Our traffic-masters-chief orchestrates write operations across two external APIs (Google Ads via Google Ads API v20, Meta Ads via Marketing API v22) and our internal MCP bridge that wraps them. Operations include creating campaigns, updating budgets, pausing ads, uploading offline conversions. Multiple specialists may operate on the same account in the same session (e.g., @kasim-aslam adjusts Google budgets while @ralph-burns updates Meta scaling concurrently).
>
> Past failures:
> - A budget update was 'committed' in our action log but the API call retried twice due to timeout, resulting in 3x update applied
> - Conversion action was created with wrong default_value, no rollback path documented, took 5 days to clean up
> - Specialist crashed mid-workflow (out of memory), left account in half-configured state (campaign created, ad groups created, ads NOT created — invisible orphan)
>
> Drawing from your AWS work (Dynamo, S3, principles like 'everything fails, all the time'):
> - What idempotency keys / dedup strategy should we use for ad write operations? Meta returns ad IDs after creation — but if we retry before that response, we may double-create.
> - What retry policy is safe? Exponential backoff is standard, but rate limits on these APIs vary by hour and account quality score.
> - How do we structure 'rollback' for ad operations that don't natively support transactions? (e.g., 'undo create campaign' is a multi-step delete cascade)
> - Should we adopt event sourcing for the action log so we can replay+verify state?
> - What patterns prevent orphan state when a specialist mid-workflow fails?"

**Expected dimensions of answer:** idempotent endpoints, request IDs, saga pattern with compensating actions, eventual consistency vs strong consistency choice, circuit breaker, rate limit-aware backoff.

---

## Why These 3 Experts (Mind Clone Map References)

From `.aios-core/data/jarvis-mind-clone-map.yaml`:
- `martin-fowler` — primary advisor for `architect` (architecture patterns)
- `gene-kim` — primary advisor for `qa` AND `devops` (quality + reliability)
- `werner-vogels` — primary advisor for `architect` (distributed systems, cloud)

These align with the rebuild concerns: architecture (chief structure), quality (gates), distributed coordination (multi-specialist + external API).

---

## Conclave Output Integration Plan

When the conclave runs (post Phase 2), capture in:
- `D:\AIOS\docs\projects\traffic-masters-rebuild\phase-2\conclave-output.md`
- Synthesis section: CONSENSUS / DISSENT / BLIND SPOTS / VERDICT
- If any verdict contradicts Phase 2 architecture decisions, update `architecture.md` with revision marker

---

## Fallback (if jarvis script unavailable)

Per `mind-clone-auto-consult.md` rule: log warning, continue with task, note in deliverable "Expert consultation pending — recommend review with martin-fowler / gene-kim / werner-vogels."

This deliverable is that note. Phase 2 work proceeds with senior architectural judgment, but conclave consultation is the recommended next step before Phase 3 implementation begins.
