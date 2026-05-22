# Architecture — squads/traffic-masters/

**Version:** 1.0 (Phase 2 design)
**Source:** Phase 1 research synthesis
**Conventions:** AIOS Constitution (CLI First, Agent Authority, Story-Driven, No Invention, Quality First, Absolute Imports)

---

## Top-Level Layout

```
squads/traffic-masters/
├── README.md
├── squad.yaml
├── agents/
│   ├── traffic-masters-chief.md
│   ├── molly-pittman.md
│   ├── depesh-mandalia.md
│   ├── kasim-aslam.md
│   ├── tom-breeze.md
│   ├── nicholas-kusmich.md
│   ├── ralph-burns.md
│   └── pedro-sobral.md
├── tasks/
│   ├── account-audit.md
│   ├── traffic-engine-setup.md
│   ├── traffic-strategy.md
│   ├── google-campaign.md
│   ├── google-search.md
│   ├── google-shopping.md
│   ├── google-pmax.md
│   ├── google-bidding-strategy-migration.md
│   ├── meta-campaign.md
│   ├── meta-ecommerce.md
│   ├── meta-leadgen.md
│   ├── meta-instant-form-vs-lp.md
│   ├── meta-capi-deploy.md
│   ├── youtube-campaign.md
│   ├── youtube-script.md
│   ├── scaling-strategy.md
│   ├── creative-optimization.md
│   ├── creative-lab.md
│   ├── creative-fallback.md
│   ├── brazil-strategy.md
│   ├── metodologia-abc.md
│   ├── operacao-diaria.md
│   ├── bpm-setup.md
│   ├── account-onboarding-meta.md
│   ├── account-onboarding-google.md
│   ├── crisis-response-saldo.md
│   ├── crisis-response-cpl-spike.md
│   ├── crisis-response-oauth.md
│   ├── gtm-tag-validation.md
│   ├── sales-feedback-loop.md
│   └── cash-flow-management.md
├── data/
│   ├── traffic-kb.md
│   ├── gotchas-traffic.json
│   ├── brazil-attribution-patterns.md
│   ├── mcp-ads-bridge-routing.yaml
│   ├── platform-quality-gates.md
│   ├── tier-system.yaml
│   ├── specialist-matrix.md
│   └── account-playbooks/
│       ├── bretda.md
│       ├── tocks.md
│       ├── kr.md
│       ├── vorza.md
│       └── low-ticket-10k.md
├── workflows/
│   ├── account-audit.yaml
│   ├── new-meta-campaign.yaml
│   ├── new-google-campaign.yaml
│   ├── scaling-decision.yaml
│   ├── creative-iteration.yaml
│   └── crisis-response.yaml
├── checklists/
│   ├── pre-launch-meta.md
│   ├── pre-launch-google.md
│   ├── budget-jump-safe.md
│   ├── creative-fatigue-detection.md
│   ├── ctm-whatsapp-smoke-test.md
│   ├── pixel-capi-validation.md
│   ├── oauth-freshness.md
│   └── post-launch-d1-d3-d7.md
└── templates/
    ├── handoff-manifest-tmpl.md
    ├── account-context-tmpl.md
    ├── pre-launch-checklist-tmpl.md
    ├── crisis-runbook-tmpl.md
    └── insight-publish-tmpl.md
```

**Total files:** 8 agents + 30 tasks + 8 data files + 5 account playbooks + 6 workflows + 8 checklists + 5 templates = **70 files**

---

## File-by-File Specification

### /agents/

| File | Purpose | Invokes | Inputs | Outputs | MCP Tools |
|---|---|---|---|---|---|
| `traffic-masters-chief.md` | Master orchestrator persona file (canonical, referenced by `.claude/agents/traffic-masters-chief.md`) | All specialists via Task or routing | mission keyword + account | Routed deliverable | All 52+ |
| `molly-pittman.md` | Tier 0 strategist persona | Diagnostic only | account + audit context | Traffic Engine plan | Group A read |
| `depesh-mandalia.md` | Meta DTC specialist persona | Self-execute | meta account + product context | Campaign + adset structure | Groups D + E |
| `kasim-aslam.md` | Google Ads specialist persona | Self-execute | google account + business context | Campaign + bidding structure | Groups B + C + G |
| `tom-breeze.md` | YouTube Ads specialist persona | Self-execute | YouTube + audience context | Video script + campaign | Group B/C subset (Video) |
| `nicholas-kusmich.md` | Meta lead gen specialist persona | Self-execute | high-ticket lead gen context | Pre-frame + lead form + funnel | Groups D + E (lead form) |
| `ralph-burns.md` | Scaling specialist persona | Self-execute | mature account, baseline data | Scaling plan + Creative Lab | Groups A + cross-platform read/write |
| `pedro-sobral.md` | Brasil specialist persona | Self-execute | BR account + WhatsApp context | ABC structure + Operação Diária | Groups D + E + F (Brasil-focused) |

### /tasks/

| File | Purpose | Invoking Agent | Inputs | Outputs | Tools |
|---|---|---|---|---|---|
| `account-audit.md` | Tier 0 full audit | molly-pittman | account_id, platform | audit-report.md | `ads_full_audit`, all read tools |
| `traffic-engine-setup.md` | 9-step engine setup | molly-pittman | new account | engine-plan.md | foundational read + pixel check |
| `traffic-strategy.md` | High-level strategy doc | molly-pittman | business goals | strategy.md | strategic read tools |
| `google-campaign.md` | Generic Google campaign creation | kasim-aslam | google account | campaign PAUSED | Group C |
| `google-search.md` | Search campaign specific | kasim-aslam | KW research | search campaign PAUSED | Group C, Search subset |
| `google-shopping.md` | Shopping campaign (NOT for Bretda/Tocks) | kasim-aslam | feed | shopping campaign | Group C, Shopping subset |
| `google-pmax.md` | PMAX (validated >30 conv prereq) | kasim-aslam | conv data | PMAX with safeguards | Group C, PMAX |
| `google-bidding-strategy-migration.md` | Manual CPC → Smart Bidding migration | kasim-aslam | 21d Manual baseline | bidding strategy update | `google_ads_update_bidding_strategy` |
| `meta-campaign.md` | Generic Meta campaign | depesh-mandalia | meta account | campaign PAUSED | Group E |
| `meta-ecommerce.md` | DTC ecommerce specific | depesh-mandalia | product feed | BPM-structured campaign | Group E + lead pixel |
| `meta-leadgen.md` | Generic lead gen | nicholas-kusmich | lead context | lead form + campaign | Group E + lead form |
| `meta-instant-form-vs-lp.md` | Decision tree + creation | kusmich + chief approval | offer + audience | correctly-typed ad | `meta_ads_destination_type_check` |
| `meta-capi-deploy.md` | CAPI Caminho A/B deploy | mandalia + handoff @aios-dev | site, pixel | CAPI live | `meta_ads_capi_status_check` |
| `youtube-campaign.md` | YouTube campaign creation | tom-breeze | video assets | YouTube campaign | Group C Video |
| `youtube-script.md` | ADUCATE script writing | tom-breeze | offer | video script | (no MCP, content task) |
| `scaling-strategy.md` | Vertical/horizontal/diagonal scale | ralph-burns | baseline data | scaling plan | Group A + cross |
| `creative-optimization.md` | Single-creative optimization | ralph-burns | underperforming creative | optimized version | Group D + E |
| `creative-lab.md` | Creative Lab 7-step pipeline | ralph-burns | spend >R$10k/mês | Creative pipeline | Group D + E |
| `creative-fallback.md` | Resurrect proven winner from history | ralph-burns | winner historic | reactivated ad | `meta_ads_creative_list` + write |
| `brazil-strategy.md` | BR-specific strategy | pedro-sobral | BR account | BR-tailored plan | Groups D + E + F |
| `metodologia-abc.md` | ABC structure setup | pedro-sobral | BR account | 3-adset ABC | Groups E + F |
| `operacao-diaria.md` | Daily operation routine | pedro-sobral | active account | daily report | Read tools (all) |
| `bpm-setup.md` | BPM Method execution | mandalia | brand + product | BPM plan | Groups A + D |
| `account-onboarding-meta.md` | New BM, new account safe setup | sobral OR mandalia | new client | account ready | Group D + E setup tools |
| `account-onboarding-google.md` | New Google account safe setup | kasim-aslam | new client | account ready | Group B + C setup |
| `crisis-response-saldo.md` | Saldo crítico runbook | chief | account in crisis | escalated to user | `meta_ads_account_balance` |
| `crisis-response-cpl-spike.md` | CPL >2x baseline diagnose | chief + ralph | account in spike | diagnosis + fix | full read |
| `crisis-response-oauth.md` | OAuth expired runbook | chief | 403 cascade | reauth user task | (no MCP, requires user) |
| `gtm-tag-validation.md` | Validate GTM tags fire real events | chief + handoff @aios-dev | site URL | tag fire report | `google_ads_conversion_actions_list` |
| `sales-feedback-loop.md` | Sales feedback spreadsheet creation | chief | client + sales team | spreadsheet template | `sheets_create_dashboard` |
| `cash-flow-management.md` | Daily runway projection | chief | balance + spend | runway forecast | `meta_ads_account_balance` |

### /data/

| File | Purpose | Maintained by |
|---|---|---|
| `traffic-kb.md` | Domain knowledge base | chief |
| `gotchas-traffic.json` | Known gotchas (12+ from memory) | chief |
| `brazil-attribution-patterns.md` | BR-specific attribution learnings | sobral |
| `mcp-ads-bridge-routing.yaml` | Tool → specialist authority map | chief |
| `platform-quality-gates.md` | Per-platform pre-launch gates | chief |
| `tier-system.yaml` | Tier 0/1/2 specialist hierarchy | chief |
| `specialist-matrix.md` | Specialist → framework → application matrix | chief |
| `account-playbooks/{account}.md` | Per-account context (Bretda, Tocks, KR, Vorza, Low-Ticket) | chief + per-account specialist |

### /workflows/

| File | Purpose | Steps |
|---|---|---|
| `account-audit.yaml` | Full audit pipeline | molly diagnose → specialist deep-dive → chief synthesis |
| `new-meta-campaign.yaml` | New Meta campaign launch | foundation → strategy → mandalia/kusmich create → checklist → user approve → enable |
| `new-google-campaign.yaml` | New Google campaign launch | foundation → kasim create PAUSED → checklist → user approve → enable |
| `scaling-decision.yaml` | Scale up/down decision | DPI² check → ralph eval → chief decide → execute with guardrails |
| `creative-iteration.yaml` | Creative Lab cycle | brief → produce → test → kill/scale |
| `crisis-response.yaml` | Saldo/OAuth/CPL crisis | detect → triage → escalate → execute fallback |

### /checklists/

| File | Purpose | When applied |
|---|---|---|
| `pre-launch-meta.md` | Mandatory before any Meta ad ENABLE | Pre-write |
| `pre-launch-google.md` | Mandatory before any Google ad ENABLE | Pre-write |
| `budget-jump-safe.md` | Validate +20%/d max + reason | Pre-budget update |
| `creative-fatigue-detection.md` | Freq + CTR drop signals | Daily |
| `ctm-whatsapp-smoke-test.md` | Manual sender validation | Pre-CTM ENABLE |
| `pixel-capi-validation.md` | Pixel + CAPI alive 7d | Pre-launch + monthly |
| `oauth-freshness.md` | Token expiry check | Pre-action daily |
| `post-launch-d1-d3-d7.md` | Post-launch review gates | D+1, D+3, D+7 |

### /templates/

| File | Purpose |
|---|---|
| `handoff-manifest-tmpl.md` | Specialist→specialist context handoff |
| `account-context-tmpl.md` | `docs/projects/{account}/00-context/CONTEXT.md` shape |
| `pre-launch-checklist-tmpl.md` | Reusable pre-launch checklist |
| `crisis-runbook-tmpl.md` | Crisis response runbook shape |
| `insight-publish-tmpl.md` | `publish_aios_insights` template |

---

## /squad.yaml

Canonical squad definition (referenced by Squad Architect tooling):

```yaml
name: traffic-masters
display_name: "Traffic Masters Squad"
chief: traffic-masters-chief
version: 1.0.0
domain: paid-traffic
priority_order:
  - google-ads          # #1 (user priority)
  - brazil-operations   # #2
  - meta-ads            # #3
  - strategy-scaling-youtube # #4
specialists:
  - id: molly-pittman
    tier: 0
    role: traffic-strategist
    frameworks: [Traffic Engine, Customer Journey, Hook-Story-Offer]
  - id: depesh-mandalia
    tier: 1
    role: meta-ecommerce-specialist
    frameworks: [BPM Method, NNC math]
  - id: kasim-aslam
    tier: 1
    role: google-ads-specialist
    frameworks: [Golden Ratio, 4 Campaign Types, 2-4 bid]
  - id: tom-breeze
    tier: 1
    role: youtube-ads-specialist
    frameworks: [ADUCATE, 3-Act, M.A.P.]
  - id: nicholas-kusmich
    tier: 1
    role: meta-leadgen-specialist
    frameworks: [4-Step, Pre-Frame, Give Before Ask]
  - id: ralph-burns
    tier: 2
    role: scaling-specialist
    frameworks: [Creative Lab, DPI², Scaling Wall]
  - id: pedro-sobral
    tier: 2
    role: brasil-specialist
    frameworks: [Metodologia ABC, Operação Diária]
mcp_tools_used:
  - mcp-ads-bridge        # 52+ tools
  - aios-brain-bridge     # consultations
accounts_served:
  - bretda
  - tocks
  - kr-interiores
  - vorza
  - low-ticket-10k
constitution_alignment:
  - article-i: "CLI-first — all ad ops via mcp-ads-bridge CLI tools, dashboards observe only"
  - article-ii: "Agent authority — only @devops pushes; chief never commits"
  - article-iv: "No invention — every claim about a tool/platform must trace to docs"
  - article-v: "Quality first — pre-launch checklists mandatory"
```

---

## Naming Conventions

- **Files:** kebab-case (e.g., `meta-leadgen.md`)
- **Agents:** persona-name slug (e.g., `nicholas-kusmich.md`)
- **Tasks:** action-noun (e.g., `account-audit.md`, `meta-capi-deploy.md`)
- **Workflows:** noun-action.yaml (e.g., `account-audit.yaml`)
- **Account playbooks:** account-slug (e.g., `bretda.md`, `kr.md`)

---

## Constitution Compliance

| Article | How met |
|---|---|
| I (CLI First) | All write ops via `mcp-ads-bridge` CLI tools (no UI required) |
| II (Agent Authority) | Chief delegates to specialists; only @devops pushes |
| III (Story-Driven) | Each major rebuild phase tracked in `docs/stories/` |
| IV (No Invention) | All specialist frameworks traced to public sources (Phase 1 research files cite books/podcasts/agencies) |
| V (Quality First) | 8 pre-launch + post-launch checklists mandatory |
| VI (Absolute Imports) | All file paths absolute (squads/traffic-masters/...), no relative refs |
