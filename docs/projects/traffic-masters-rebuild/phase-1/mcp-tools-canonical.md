# MCP-ads-bridge — Canonical Tool Inventory

**Data:** 2026-05-14
**Source:** Live system context inspection (Claude Code MCP tools registered)
**Total:** 64 tools (reconciles squad inventory; supersedes "52" mention in old memory)

---

## Group A — Google Ads (33 tools)

### Read/Inspect (12)
| Tool | Purpose | Specialist |
|------|---------|-----------|
| `google_ads_list_accounts` | List MCC accounts | All |
| `google_ads_overview` | Account-level dashboard | @kasim-aslam, @molly-pittman |
| `google_ads_account_settings` | Settings inspection | @kasim-aslam |
| `google_ads_campaigns` | List campaigns | @kasim-aslam |
| `google_ads_campaign_details` | Per-campaign deep dive | @kasim-aslam |
| `google_ads_metrics` | Performance metrics | @kasim-aslam, @ralph-burns |
| `google_ads_ad_group_performance` | AdGroup-level perf | @kasim-aslam |
| `google_ads_keywords` | List keywords | @kasim-aslam |
| `google_ads_search_terms` | Actual queries | @kasim-aslam |
| `google_ads_creatives` | List ads | @kasim-aslam, @ralph-burns |
| `google_ads_change_history` | Audit trail | All |
| `google_ads_recommendations` | Google's auto-recs | @kasim-aslam |

### Conversions (4)
| Tool | Purpose | Specialist |
|------|---------|-----------|
| `google_ads_conversion_actions` | List conversion actions | @kasim-aslam |
| `google_ads_list_conversion_goals` | List goals | @kasim-aslam |
| `google_ads_create_conversion` | Create new conversion | @kasim-aslam |
| `google_ads_set_conversion_priority` | Set primary/secondary | @kasim-aslam |

### Geo (3)
| Tool | Purpose | Specialist |
|------|---------|-----------|
| `google_ads_geo_targeting` | Inspect geo | @pedro-sobral |
| `google_ads_add_geo_targeting` | Add geos | @pedro-sobral |
| `google_ads_set_geo_targeting` | Replace geos | @pedro-sobral |

### Write/Mutate (14)
| Tool | Purpose | Specialist | Risk |
|------|---------|-----------|------|
| `google_ads_create_campaign` | Create campaign | @kasim-aslam | HIGH |
| `google_ads_create_ad_group` | Create ad group | @kasim-aslam | MED |
| `google_ads_create_responsive_search_ad` | Create RSA | @kasim-aslam | MED |
| `google_ads_add_keywords` | Add keywords | @kasim-aslam | MED |
| `google_ads_add_negatives` | Add negative kws | @kasim-aslam | LOW |
| `google_ads_update_budget` | Change budget | @kasim-aslam, @ralph-burns | **CRITICAL** (budget jump trap) |
| `google_ads_update_bidding` | Change bid strategy | @kasim-aslam | HIGH |
| `google_ads_update_ad_group_bid` | Adjust ad group bid | @kasim-aslam | MED |
| `google_ads_update_status` | Pause/enable campaign | @kasim-aslam | HIGH |
| `google_ads_update_ad_status` | Pause/enable ad | @kasim-aslam | LOW |
| `google_ads_update_ad_group_status` | Pause/enable ad group | @kasim-aslam | MED |
| `google_ads_update_ad_urls` | Change final URLs | @kasim-aslam | MED (immutable for RSAs per memory) |
| `google_ads_update_auto_tagging` | Toggle auto-tagging | @kasim-aslam | LOW |
| `google_ads_update_conversion_value` | Adjust conv value | @kasim-aslam | MED |

---

## Group B — Meta Ads (20 tools)

### Read/Inspect (8)
| Tool | Purpose | Specialist |
|------|---------|-----------|
| `meta_ads_list_accounts` | List ad accounts | All |
| `meta_ads_overview` | Account dashboard | @depesh-mandalia, @molly-pittman |
| `meta_ads_campaigns` | List campaigns | @depesh-mandalia |
| `meta_ads_adsets` | List adsets | @depesh-mandalia |
| `meta_ads_creatives` | List creatives | @depesh-mandalia, @ralph-burns |
| `meta_ads_insights` | Performance insights | @depesh-mandalia, @ralph-burns |
| `meta_ads_audience` | Inspect audience | @nicholas-kusmich |
| `meta_ads_pixel_check` | Validate pixel | @depesh-mandalia (gotcha gate) |

### Audience (2)
| Tool | Purpose | Specialist |
|------|---------|-----------|
| `meta_ads_custom_audiences` | List custom audiences | @nicholas-kusmich |
| `meta_ads_search_interests` | Find interests | @nicholas-kusmich |

### Geo (1)
| Tool | Purpose | Specialist |
|------|---------|-----------|
| `meta_ads_set_geo_targeting` | Set geo (Brasil 2076 PRESENCE) | @pedro-sobral |

### Creative (1)
| Tool | Purpose | Specialist |
|------|---------|-----------|
| `meta_ads_upload_image` | Upload image hash | @ralph-burns, @depesh-mandalia |

### Write/Mutate (8)
| Tool | Purpose | Specialist | Risk |
|------|---------|-----------|------|
| `meta_ads_create_campaign` | Create campaign | @depesh-mandalia, @nicholas-kusmich | HIGH |
| `meta_ads_create_adset` | Create adset | @depesh-mandalia | MED |
| `meta_ads_create_ad` | Create ad | @depesh-mandalia | MED (validate destination_type!) |
| `meta_ads_duplicate_ads` | Duplicate ads | @ralph-burns | LOW |
| `meta_ads_update_budget` | Change budget | @depesh-mandalia, @ralph-burns | **CRITICAL** (budget jump 2x trap) |
| `meta_ads_update_status` | Pause/enable | @depesh-mandalia | HIGH |
| `meta_ads_update_targeting` | Change targeting | @depesh-mandalia | MED |
| `meta_ads_delete_object` | Delete | @depesh-mandalia | **DESTRUCTIVE** |

---

## Group C — Cross-Platform (6 tools)

| Tool | Purpose | Specialist |
|------|---------|-----------|
| `ads_connection_test` | Verify Google + Meta API auth | @molly-pittman (pre-flight) |
| `ads_full_audit` | Cross-platform diagnostic | @molly-pittman, @depesh-mandalia |
| `ads_performance_monitor` | Real-time perf tracking | @ralph-burns |
| `ads_auto_optimize` | Auto-tuning suggestions | @ralph-burns |
| `ads_action_log` | Audit trail (rollback source) | All — **MANDATORY pre-write** |
| `ads_guardrails` | Pre-action quality gates | All — **MANDATORY pre-write** |

---

## Group D — Google Sheets (5 tools)

| Tool | Purpose | Specialist |
|------|---------|-----------|
| `google_sheets_create` | Create new sheet | @molly-pittman (sales feedback spreadsheet) |
| `google_sheets_info` | Sheet metadata | @molly-pittman |
| `google_sheets_read` | Read data | @pedro-sobral (sales feedback loop) |
| `google_sheets_append` | Append rows | @pedro-sobral |
| `google_sheets_update` | Update cells | @pedro-sobral |

---

## Reconciliation Note

Squad inventory said **64 tools potential** vs memory said **52**. Reality: **64 confirmed** in live system. Memory was outdated (likely pre-expansion). Phase 3 tasks should use this canonical list.

## Critical Tool Categories for Quality Gates

| Gate | Tool | Trigger |
|------|------|---------|
| Pre-action validation | `ads_guardrails` | Before any write op |
| Audit trail | `ads_action_log` | Before any write op |
| Budget circuit breaker | `google_ads_update_budget` / `meta_ads_update_budget` | If new_budget / current_budget > 2.0 → HALT |
| Pixel validation | `meta_ads_pixel_check` | Before OFFSITE_CONVERSIONS campaigns |
| Geo Brasil enforcement | `*_set_geo_targeting` | Every Brasil campaign — must include 2076 + PRESENCE |
| Saldo runway check | `google_ads_overview` / `meta_ads_overview` | Before scaling — saldo / daily_burn ≥ 3 days |
| Destination type validation | `meta_ads_create_ad` | Pre-create — check `destination_type` API field, NOT cosmetic `link_url` |
