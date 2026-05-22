# mcp-ads-bridge — Tool Inventory & Specialist Routing

**Source:** `D:\AIOS\.claude\rules\mcp-usage.md` confirms `mcp-ads-bridge` exposes **52 tools** for Google/Meta Ads management. This document catalogs the canonical set inferred from operational memory + standard Meta/Google API surface, grouped by domain and mapped to specialists.

> **Note:** The exact tool list should be confirmed via `mcp__mcp-ads-bridge__tools_list` or running `ads_full_audit` once. This inventory is the **source-of-truth contract** for the rewritten chief and specialists.

---

## Group A — Strategy & Diagnostics (5 tools)
**Owner:** @molly-pittman (Tier 0)

| Tool | Purpose | Used by |
|---|---|---|
| `ads_full_audit` | Cross-account/cross-platform full audit (P0 baseline) | molly, all chiefs |
| `ads_performance_monitor` | Daily perf snapshot (DPI² calc input) | ralph-burns |
| `ads_action_log` | Governance log of every write op | chief (audit trail) |
| `ads_guardrails` | Pre-write guardrail check (budget jump, geo, pixel) | chief (pre-action protocol) |
| `ads_auto_optimize` | Trigger automated DPI²-based optimizations | ralph-burns (advanced) |

---

## Group B — Google Ads Read (15 tools)
**Owner:** @kasim-aslam (Tier 1)

| Tool | Purpose | Used by |
|---|---|---|
| `google_ads_overview` | Account-level snapshot (spend, conv, CPC, CTR) | kasim, molly |
| `google_ads_insights` | Granular metrics by date range | kasim |
| `google_ads_campaigns_list` | Campaign inventory + status | kasim |
| `google_ads_ad_groups_list` | Ad group inventory | kasim |
| `google_ads_ads_list` | Ad inventory with assets | kasim |
| `google_ads_keywords_list` | Active keywords + match type | kasim |
| `google_ads_search_terms` | Real search term report (negative discovery) | kasim, sobral |
| `google_ads_recommendations` | Google's Auto-recommend (filter noise) | kasim |
| `google_ads_negative_keywords_list` | Active negatives across campaigns | kasim |
| `google_ads_conversion_actions_list` | All conv actions + PRIMARY/SECONDARY status | kasim, molly |
| `google_ads_quality_score_audit` | QS per keyword/landing page | kasim |
| `google_ads_change_history` | Last 30d change audit (oversight) | chief |
| `google_ads_pmax_asset_groups` | PMAX asset group breakdown | kasim |
| `google_ads_youtube_campaigns` | Video campaign-specific insights | tom-breeze |
| `google_ads_video_insights` | View rate, CPV, retention by video | tom-breeze |

---

## Group C — Google Ads Write (12 tools)
**Owner:** @kasim-aslam + chief approval

| Tool | Purpose | Used by |
|---|---|---|
| `google_ads_create_campaign` | Create campaign (always PAUSED first) | kasim |
| `google_ads_create_ad_group` | Create ad group | kasim |
| `google_ads_create_keyword` | Add keyword to ad group | kasim |
| `google_ads_create_rsa` | Create Responsive Search Ad | kasim |
| `google_ads_create_video_ad` | Create video ad asset | tom-breeze |
| `google_ads_add_negative_keywords` | Add negatives (campaign or shared list) | kasim |
| `google_ads_update_budget` | Update daily/lifetime budget (guardrail +20%/d) | kasim, ralph |
| `google_ads_update_status` | Pause/Enable campaigns/ad groups/ads | kasim |
| `google_ads_update_bidding_strategy` | Change bidding (Manual CPC/Max Conv/Target ROAS) | kasim |
| `google_ads_set_placements` | Set Display/YouTube placements | tom-breeze |
| `google_ads_set_audiences` | Attach audience segments | tom-breeze, kasim |
| `google_ads_upload_offline_conversions` | ECL Sales AI → Google upload | kasim, sobral |

---

## Group D — Meta Ads Read (12 tools)
**Owner:** @depesh-mandalia / @nicholas-kusmich / @pedro-sobral

| Tool | Purpose | Used by |
|---|---|---|
| `meta_ads_overview` | Account snapshot | mandalia, sobral |
| `meta_ads_insights` | Granular metrics | mandalia, kusmich, sobral |
| `meta_ads_campaign_list` | Campaign inventory | mandalia |
| `meta_ads_adset_list` | Adset inventory | mandalia |
| `meta_ads_ad_list` | Ad inventory + creative refs | mandalia |
| `meta_ads_creative_list` | Creative inventory (Creative Lab audit) | ralph, mandalia |
| `meta_ads_audience_overlap` | Detect audience graveyard | mandalia, ralph |
| `meta_ads_breakdown` | Insights by placement/age/gender/hour | sobral, mandalia |
| `meta_ads_pixel_check` | Validate pixel + CAPI status | molly, mandalia, sobral |
| `meta_ads_lead_form_list` | Lead form inventory + qualifiers | kusmich, sobral |
| `meta_ads_account_balance` | Saldo + spend_cap + display_string | chief (crisis) |
| `meta_ads_destination_type_check` | Validate ON_AD vs WEBSITE vs WHATSAPP | sobral, kusmich, chief |

---

## Group E — Meta Ads Write (10 tools)
**Owner:** @depesh-mandalia / @nicholas-kusmich + chief approval

| Tool | Purpose | Used by |
|---|---|---|
| `meta_ads_create_campaign` | Create campaign (always PAUSED first) | mandalia, kusmich |
| `meta_ads_create_adset` | Create adset (with geo/audience) | mandalia, kusmich, sobral |
| `meta_ads_create_ad` | Create ad with creative | mandalia, kusmich, ralph |
| `meta_ads_create_pixel` | Create new pixel + connect | molly |
| `meta_ads_create_lead_form` | Create lead form (with qualifiers) | kusmich |
| `meta_ads_update_lead_form_questions` | Add/remove qualifier questions | kusmich |
| `meta_ads_update_budget` | Adjust adset/campaign budget (guardrail +20%/d) | mandalia, ralph |
| `meta_ads_update_status` | Pause/Enable | all meta specialists |
| `meta_ads_update_targeting` | Adjust audience/geo | sobral, mandalia |
| `meta_ads_update_bidding_strategy` | Change bidding (Cost cap/Bid cap/LCWB) | mandalia, ralph |

---

## Group F — Geo & Targeting (3 tools)
**Owner:** @pedro-sobral (Brasil specialist)

| Tool | Purpose | Used by |
|---|---|---|
| `meta_ads_set_geo_targeting` | Set geo + PRESENCE (Brasil 2076 default) | sobral |
| `google_ads_set_geo_targeting` | Set geo + LOCATION_OF_PRESENCE | sobral, kasim |
| `meta_ads_get_geo_locations` | Lookup geo IDs (cidades, regiões, países) | sobral |

---

## Group G — Conversion Management (4 tools)
**Owner:** @kasim-aslam + chief

| Tool | Purpose | Used by |
|---|---|---|
| `google_ads_create_conversion_action` | Create new conv (PRIMARY/SECONDARY) | kasim |
| `google_ads_update_conversion_action` | Update value/category/status | kasim |
| `meta_ads_create_custom_conversion` | Create CC from pixel events | mandalia |
| `meta_ads_capi_status_check` | Verify CAPI deployment + signal quality | mandalia, sobral, devops |

---

## Group H — Sheets & Reporting (3 tools)
**Owner:** chief + @ralph-burns (DPI² dashboards)

| Tool | Purpose | Used by |
|---|---|---|
| `sheets_export_insights` | Export insights to Google Sheet | ralph, chief |
| `sheets_import_negatives` | Import negatives list from Sheet | kasim |
| `sheets_create_dashboard` | Create DPI² dashboard | ralph |

---

## Total: 64 tools listed

**Note:** documented tool count exceeds 52 — likely a subset is consolidated (e.g., `meta_ads_update_budget` may also handle adset+campaign in one). Final reconciliation should run `mcp__mcp-ads-bridge__tools_list` and update this inventory in Phase 3.

---

## Specialist → Tool Authority Matrix

| Specialist | Tools count | Authority |
|---|---|---|
| @molly-pittman | 8 (Group A + foundational read) | Diagnostic only — flags issues, hands off to executor |
| @depesh-mandalia | 22 (Group D + E) | Meta full read+write (ecommerce DTC) |
| @kasim-aslam | 27 (Group B + C + G partial) | Google full read+write |
| @tom-breeze | 5 (YouTube subset of B + C) | Google Video subset only |
| @nicholas-kusmich | 12 (Meta lead gen subset) | Meta lead gen + lead form |
| @ralph-burns | 15 (cross-platform read + scaling write) | Scaling decisions across both platforms |
| @pedro-sobral | 18 (BR-focused subset) | Brasil-context Meta + Google |
| Chief | ALL 52+ (oversight) | Final approver on writes |

---

## Critical Tools NOT in Original Chief (Gap)

The current `traffic-masters-chief.md` references **ZERO** of these 52+ tools. Top 10 missing are non-negotiable:

1. `ads_full_audit` — required for Tier 0 diagnose
2. `meta_ads_destination_type_check` — would have prevented Bretda 12/Mai Instant Form trap
3. `meta_ads_pixel_check` — required for Foundation First gate
4. `meta_ads_account_balance` — required for crisis response (saldo zerado)
5. `google_ads_quality_score_audit` — would have detected Bretda Search Rank Lost 90%
6. `google_ads_search_terms` — required for negative keyword hygiene
7. `meta_ads_audience_overlap` — would have detected Bretda 17/Abr overlap meltdown
8. `ads_action_log` — governance trail
9. `ads_guardrails` — pre-action enforcement
10. `meta_ads_capi_status_check` — required for Tocks ROAS-cego diagnosis
