# HYDRA Run — AI-CRM Findings (squad-crm heuristic mode)

**Run:** 2026-05-17 (heuristic mode, zero LLM cost)
**Duration:** 19m 1s
**Config:** `configs/squads/squad-crm/` (145 sources)
**Mode:** `HYDRA_HEURISTIC_MODE=1` — deterministic scoring + extractive insights

Complements `01-findings.md` (analyst deep-dive) and `02-recommendations.md` by adding **broad-spectrum signal from the squad's curated source list**. Where analyst was depth-first across 18 targeted searches, HYDRA was breadth-first across 145 RSS feeds.

---

## 1. Run metrics

```
Fetched:       1,150 items   (80 RSS sources, 0 GitHub — adapter bug)
Filtered:      295           (content_too_short / age / dedup pre-filter)
Duplicates:    463           (already in dedup-store from prior runs)
Processed:    392           (heuristic extraction + scoring)
Ingested:      73            (S+A tiers; full content into KB)
Tiers:         S=1   A=72   B=197   C=122
Distributed:   270 items → 80 clones
Errors:        0
Vector store:  567 entries  (local mode, persisted)
Cache hits:    9 / 383 misses  (2% — most content novel for squad-crm)
```

**Tier distribution observation:** for a 145-source breadth fetch in a niche domain (CRM/AI/LGPD), 73 ingested-at-quality items (S+A) is healthy. The 1 S-tier is exceptionally narrow — heuristic mode is conservative on tier promotion (only authoritative + keyword-dense + Goldilocks-length passes the 4.5+ bar).

**GitHub fetch bug:** all 25 GitHub repos in `squad-crm/sources.yaml` returned `Unknown source type "undefined"` (adapter config format mismatch). Lost potential coverage of Twenty CRM, Mautic, Chatwoot, EspoCRM, Krayin, Erxes, Supabase, Next.js, Inngest, tRPC, etc. **Follow-up:** patch the GitHub adapter or fix the per-source `type:` field. Not blocking — RSS gave 1,150 items.

---

## 2. What the priority clones received

### 2.1. jason-lemkin (138 items / 79KB feed) ⭐ richest signal for AI-CRM

Domain coverage: engenharia, negocios, crm-saas, product, marketing, customer-ops.

**A-tier insights HubSpot 2026 series caught**:

| Source | Key insight |
|---|---|
| `blog.hubspot.com/sales/8-sales-automation-benefits` | "Smart CRM scores leads based on engagement, flags deals lacking key stakeholders, highlights ICP-matched accounts" — **3-axis lead scoring pattern, not just 0-100** |
| Same | "Audit your CRM BEFORE turning on automation. The fix: data consolidation first." — **bootstrapping order matters** |
| Same | "Conversation intelligence: record calls, transcribe, surface talk-to-listen ratios, competitor mentions, qualification questions" — **conversation analysis as a separate AI layer beyond scoring** |
| Same | "If sales rejects most automated handoffs, the problem highlights how the two teams never agreed on what 'qualified' means" — **AI status enum should map to a SHARED definition; otherwise UI scores are noise** |
| `ai-meeting-scheduling-tools` | "Intelligent Lead Routing and Qualification — route the right leads to the right reps based on territory, expertise, availability, and deal characteristics" — **routing is part of AI scoring outcome, not just a number** |
| `sales-personalization-beyond-first-name` | "AI Meeting Assistant captures and summarizes discussions, including key pains, decision criteria, and stakeholder names" — **summary != classification; both needed** |
| Same | "Personalization is moving from 'nice extra' to 'core expectation'" — **market validation** |

**Implication for CRM-A.1 schema (revisits `02-recommendations.md`):**

Our current `ai_intent_tags text[]` is flat. HubSpot's stack distinguishes:
- **Qualification signals** (BANT-like, structured)
- **Personalization context** (pains, decision criteria, stakeholders — narrative)
- **Routing hints** (territory, expertise match, urgency band)

→ **Possible split:** keep `ai_intent_tags` as the flat lookup index, but ADD a JSONB `ai_context` field with `{ pains: [...], decision_criteria: [...], stakeholders: [...], objections: [...] }`. The flat tags drive list-view filters; the JSONB structure drives the conversation summary panel + handoff briefing.

### 2.2. julie-zhuo (86 items / 51KB feed)

Same HubSpot Sales Automation series dominated (cross-routed since julie-zhuo shares product+crm-saas domains). **Heuristic mode artifact:** identical articles routed to multiple clones whose domain sets overlap. Not a bug — expected at the routing layer. Adds noise to "Distributed: 270 items" counter.

**Genuinely julie-specific signal (UX-focused):**
- "Teams should define which segments matter most, which signals trigger specific messages, and where personalization is **non-negotiable**" — informs which AI badges/labels show by default vs. opt-in
- "AI-powered tools support this stage in two important ways: capture+summarize" — separation of concerns confirmed (capture vs. classify)

### 2.3. paul-copplestone (91 items / 52KB feed)

Domain: engenharia only. Got JavaScript Weekly + React Status content. **Heuristic mode artifact:** keyword matches like `"postgres"`, `"edge function"`, `"rls"` fired on tangential mentions in JS roundup posts, not actual Supabase/RLS deep-dives.

Useful filter signals:
- Multiple "see how ready it is for AI agents" quotes — confirms the AI-agent moment is the 2026 zeitgeist
- Anthropic Engineering blog feed broken (404) — **fix the URL** in `sources.yaml`

**No new Supabase/RLS/Realtime AI insights.** Analyst's deep dive on Supabase prompt caching + tool-use patterns remains the authoritative input for stack decisions.

### 2.4. simon-willison (95 items / 54KB feed)

Same JS/React-heavy content as paul-copplestone. **Heuristic relevance ceiling exposed:** keyword `"ai"` matches every other newsletter blurb, but the underlying content is React tooling updates, not LLM engineering. The analyst output (which used targeted WebSearch on "Claude tool use structured output" + "prompt caching" + "Haiku vs Sonnet") is materially richer than what HYDRA's keyword router pulled.

### 2.5. patricia-peck (20 items / 9.7KB feed) ⚠️ low-quality routing

JOTA articles tagged "legal" came through, but **most are Brazilian political news** (senator news, fiscal disputes, environmental policy), NOT LGPD or AI compliance. Only 2/20 items genuinely relevant:
- **Item #11**: "IA amplia desigualdades e desafia democracia no Brasil" — broader AI ethics commentary
- **Item #12**: "Sanções administrativas e IA: o caso da ANTT" — admin AI sanctions case

Patricia Peck Insights RSS (her own firm's blog) **may have failed to fetch** — should investigate as part of GitHub-adapter-fix follow-up.

**Net LGPD/Anthropic finding: nothing actionable** beyond what analyst already documented (DPA standard via Commercial Terms, SCC Module 2+3, Res. ANPD 19/2024 administrative).

---

## 3. Cross-reference: HYDRA vs. analyst

| Topic | Analyst (01-findings.md) | HYDRA findings |
|---|---|---|
| Lead scoring framework | BANT/CHAMP/MEDDIC/SPIN — recommended hybrid: AI score + rules multiplier | HubSpot's 3-axis pattern: engagement + ICP match + key-stakeholder flag — **complements** |
| Schema shape (`ai_*` columns) | Add `ai_confidence`, `ai_evidence`, `ai_priority_score` | Add JSONB `ai_context` (pains/decision_criteria/stakeholders/objections) — **new** |
| UX antipatterns | "Raw probability dump destroys trust" | "Personalization rules should be reviewed regularly in dashboards" — operators iterate, not set-and-forget — **complements** |
| Conversation intelligence | Not deeply covered | NEW signal: "talk-to-listen ratio, competitor mentions, qualification questions" — separate analysis layer, post-MVP |
| Routing as part of AI | Not explicit | NEW: AI should output routing intent (territory/expertise/urgency) — Sprint 3+ |
| Market validation | "Pipefy/Kommo/RD Station IA leading BR adoption" | Confirmed via HubSpot 2026 series + Pipedrive content — **converges** |
| LGPD/Anthropic | DPA + SCCs + LIA + DPIA checklist | Inconclusive — patricia-peck feed didn't surface LGPD-specific content; analyst output remains authoritative |
| Claude model selection | Haiku 4.5 ≈ Sonnet 4.6 for classification | Not covered by HYDRA (no Anthropic-pricing content in feeds this run) |

---

## 4. Honest assessment of heuristic-mode quality

**What worked:**
- HubSpot Sales Automation 2026 series surfaced cleanly — heuristic correctly identified A-tier on `crm-saas` keyword density + source authority 4
- Volume + breadth: 1,150 items across 145 sources in 19 min, zero cost
- Distribution mechanics intact: 80 clones each got tailored slices
- Tier classification stable: S=1, A=72, B=197, C=122 — sensible distribution

**Where heuristic falls short of LLM scoring:**
1. **Semantic blind spot on tangentially-keyworded content** — "ai" matches React newsletter blurbs that don't actually discuss AI engineering
2. **Cross-domain content duplication** — same HubSpot article routed to jason-lemkin AND julie-zhuo AND others, inflating "distributed" count
3. **Brazilian political news false-positives on `legal` keyword** — patricia-peck feed cluttered with content irrelevant to LGPD
4. **No abstractive summarization** — "Key Insights" sections are extractive (first-scored sentences from raw text), so they sometimes look like fragment dumps rather than synthesized takeaways

**What this means for AI-CRM scoring decisions:**

For our own CRM-A.1 lead scoring, the heuristic-mode HYDRA experience VALIDATES the analyst's recommendation: **hybrid scoring** (AI score + deterministic rules multiplier). Pure heuristic alone misses semantic nuance; pure LLM alone is expensive and slow. The HYDRA architecture itself proves the pattern works at scale — and we now have the heuristic fallback documented (see `tools/hydra/docs/HEURISTIC_MODE.md`).

---

## 5. Concrete updates to recommendations (delta vs. 02-recommendations.md)

### Add to schema 0005 (already-drafted migration)

```sql
-- Beyond ai_score / ai_status / ai_intent_tags, also add:
alter table public.contacts
  add column ai_context jsonb not null default '{}'::jsonb;
-- Shape: {
--   pains: ["entrega urgente", "orcamento apertado"],
--   decision_criteria: ["preco", "prazo", "qualidade"],
--   stakeholders: ["esposa", "filho"],
--   objections: ["preco-alto", "prazo-longo"],
--   buying_signals: ["pediu desconto", "perguntou prazo"]
-- }
```

### Add to routing layer (Sprint 3+)

Output from `ai_next_action` field already exists. **Bonus**: have Claude also output:
```json
{
  "ai_route_to": "senior" | "junior" | "specialist:furniture-tech" | null,
  "ai_urgency_band": "now" | "today" | "this-week" | "longshot"
}
```

These drive the **follow-up queue page** prioritization and let traffic-paid people see "qual lead pegar primeiro" objectively.

### Defer to Sprint 4+ (post-MVP)

**Conversation intelligence layer** (separate from scoring):
- talk-to-listen ratio (if/when audio calls land)
- competitor mentions detection
- qualification question coverage check
- response-latency benchmarking

This is HubSpot's `Conversation Intelligence` SKU territory. Not MVP. Add only after CRM-A.1 ships and we have 30 days of usage data.

### Source list cleanup (follow-up tasks)

| Source | Status | Action |
|---|---|---|
| Anthropic Engineering RSS | 404 | Find current URL or remove |
| Crunchy Data Postgres RSS | 404 | Find current URL or remove |
| High Scalability RSS | 404 | Remove (low-signal anyway) |
| Patricia Peck Insights | not seen in feed (0 items?) | Verify RSS URL: `https://www.pppadvogados.com.br/feed/` |
| All 25 GitHub sources | "Unknown source type" | Add `type: github` field to each, or patch adapter to infer |

---

## 6. Files produced this run

```
docs/projects/crm-novo/15-ai-research/
├── 01-findings.md             (analyst, 6,399 words)        ← prior
├── 02-recommendations.md      (analyst, 3,960 words)        ← prior
└── 03-hydra-findings.md       (this file)                   ← new

tools/hydra/hydra-data/
└── squad-crm-heuristic-run.log  (3,024 lines, 19m run log)

D:/jarvis/mega brain/knowledge-feed/{clone}/2026-05-17-hydra-feed.md
└── 80 files × 9-79KB each — distributed feeds, persisted
```

---

## 7. What's NEXT pra CRM-A.1

Backend já 50% codado (migration 0005 + Claude client + scoring prompt + Inngest worker em disco, não commitado). Decisions feitas:

1. ✅ **Modelo:** Claude Haiku 4.5 (per analyst + zero quality gap observed)
2. ✅ **Output:** Tool use com `strict: true` (per analyst Section 6)
3. ✅ **Cache:** System prompt cacheado 5min TTL (per analyst Section 6)
4. ✅ **Hybrid:** AI score 0-100 + rules multiplier (validated by HYDRA heuristic experience)
5. 🆕 **Schema add:** `ai_context jsonb` (per this doc Section 5)
6. ⏭️ **Pending:** UI badge + conversation panel + /followup queue (task #50)
7. ⏭️ **Pending:** Env vars + commit + push (task #51)

**Recomendação prática:** retomar tasks #50 e #51 (UI + commit) com a schema atualizada para incluir `ai_context`. Total esforço restante: ~3-4h.

---

## 8. Operational note — heuristic mode for routine HYDRA runs

Given the quality findings:

- **Daily/weekly HYDRA runs** for source ingestion: **use heuristic mode** (zero cost, sensible tier distribution, defensive routing acceptable)
- **Pre-decision deep research** (like the AI-CRM question itself): **use targeted analyst agent** with WebSearch — heuristic alone misses semantic nuance and produces noisy routing

This split keeps the HYDRA pipeline as a **continuous information substrate** (cheap, always-on, broad) while analyst agents do **bursty deep dives** (expensive, targeted, narrow). The two modes complement.

Both are now operational: HYDRA heuristic mode patched (`tools/hydra/src/processor/heuristic-judge.js`) and analyst pattern validated (`docs/projects/crm-novo/15-ai-research/01-findings.md`).
