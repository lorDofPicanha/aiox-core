# Bretda Google Ads — LIVE AUDIT — Kasim Aslam (Tier 1)

**Date:** 2026-05-15 (post-OAuth reauth 13:30 BRT)
**Customer ID:** `8167636084` (Bretda)
**MCC:** `7943699417`
**OAuth identity:** `contato@tockscustom.com.br` (LIVE)
**Persona:** @kasim-aslam — Solutions 8 doctrine, READ-ONLY mode
**Raw data:** `D:\jarvis\mcp-ads-bridge\bretda-tier1-audit-15mai.out.txt` + `bretda-tier1-residual-15mai.out.txt`
**Script:** `D:\jarvis\mcp-ads-bridge\audit-bretda-tier1-live-15mai.cjs`

---

## TL;DR

**Verdict: FIX — the account is alive but operationally dormant. Brand-Defense is the only ENABLED campaign and it's delivering 1 click in 14d. F6 codeless zombie still PRIMARY. 4 PRIMARY conversions vs Aslam canon 2. Bid floors 5-10x below textbook for CAC R$2.1k. State delta from playbook is massive.**

Search before Shopping before PMAX — and Bretda is **Search-only correctly** but the Search bench is on the floor.

---

## State Delta — Playbook (07/Mai) vs Live (15/Mai 13:30 UTC)

| Item | Playbook canon | Live state | Delta |
|---|---|---|---|
| Canonical campaigns ENABLED | 4 (Brand-Defense + MesaBilhar + MesaJantar + RTG) | **1 only — Brand-Defense @ R$10/d** | 🔴 3 PAUSED 2026-05-12 11:41 UTC by `contato@tockscustom.com.br` |
| Legacy `08/11` | PAUSED | PAUSED | ✅ green |
| PRIMARY conversions | 2 (Aslam max) | **4 ALL PRIMARY** | 🔴 +2 over canon |
| F6 codeless zombie `[AGD] Lead 7138711130` | Cleaned up | **STILL ENABLED, default_value=R$100, always_use=TRUE, include_in_conversions=TRUE, PRIMARY** | 🔴 Cleanup NEVER executed |
| `Lead-Pagina-Obrigado` PRIMARY R$1500 | Set 07/Mai | Confirmed PRIMARY R$1500 ENABLED | ✅ |
| Bid floor (MesaBilhar) | Aslam: R$26-52 (lead) or R$525-1050 (close-CAC) | R$8 max CPC | 🔴 Violated 5-10x |
| Geo Brasil 2076 PRESENCE | Required | All 5 canon campaigns: `positive_geo_target_type=7` (PRESENCE) ✅ | ✅ |
| OAuth | Fresh 07/Mai | Reauth 15/Mai 13:30 BRT | ✅ |

---

## STEP 1 — Pre-flight Connection

```json
{
  "id": 8167636084,
  "descriptive_name": "Bretda",
  "currency_code": "BRL",
  "time_zone": "America/Fortaleza",
  "auto_tagging_enabled": true,
  "manager": false,
  "test_account": false,
  "status": 2
}
```

✅ Connection OK. Auto-tagging ENABLED. Account ACTIVE (status=2 = ENABLED).

---

## STEP 2 — Account Overview

| Window | Impr | Clicks | Cost | Conv | Conv Value | Search IS | Budget-Lost IS | Rank-Lost IS |
|---|---|---|---|---|---|---|---|---|
| 30d | 715 | 83 | **R$491.83** | 1 | R$50 | 9.99% | **90.01%** | 3.43% |
| 14d | 427 | 47 | R$295.39 | 0 | 0 | 9.99% | 90.01% | 0.72% |
| 7d | 322 | 38 | R$235.10 | **0** | 0 | 9.99% | 90.01% | 0.95% |

🔴 **Budget-lost IS = 90% sustained**. Account is permanently throttled by tiny daily budgets relative to demand.
🔴 **1 conversion in 30d, ZERO in 14d**. Funnel-end is dead.
🔴 The 1 conv (R$50) = `WhatsApp - CLICK` action — not Lead-Pagina-Obrigado, not a qualified lead. **Soft conv only.**

---

## STEP 3 — Campaign Inventory + Metrics

### 5 canonical campaigns visible

| ID | Name | Status | Bid Type | Budget/d |
|---|---|---|---|---|
| 23821730141 | `[BR][SEARCH] BR-Brand-Defense` | **ENABLED** | MANUAL_CPC (3) | R$10 |
| 23821730339 | `[BR][SEARCH] BR-RTG-SiteVisitors-90d` | PAUSED 12/Mai | MANUAL_CPC (3) | R$10 |
| 23821730147 | `[BR][SEARCH] BR-Generic-MesaJantar-HighIntent` | PAUSED 12/Mai | MANUAL_CPC (3) | R$15 |
| 23816403561 | `[BR][SEARCH] BR-Generic-MesaBilhar-HighIntent` | PAUSED 12/Mai | MANUAL_CPC (3) | R$25 |
| 23251766617 | `[C] - Pesquisa - Leads - Sudeste - 08/11` | PAUSED (legacy) | MANUAL_CPC (3) | R$50 |

Plus 9 historical PAUSED/REMOVED campaigns from pre-rebuild era (RT 28/01/25, CSD luxo, PSQ Max, REDE PESQUISA, etc.) — all status=4 (REMOVED). Architecture-clean.

### 30d performance (PAUSED campaigns showed metrics from period when ENABLED)

| Campaign | Status | Impr 30d | Clicks 30d | Cost 30d | Avg CPC | Conv |
|---|---|---|---|---|---|---|
| 08/11 legacy | PAUSED | 288 | 36 | R$196.44 | R$5.46 | 1 (only R$50) |
| MesaBilhar | PAUSED 12/Mai | 132 | 21 | R$151.01 | R$7.19 | 0 |
| MesaJantar | PAUSED 12/Mai | 95 | 15 | R$82.95 | R$5.53 | 0 |
| RTG-SiteVisitors | PAUSED 12/Mai | 199 | 10 | R$60.13 | R$6.01 | 0 |
| Brand-Defense | **ENABLED** | 1 | 1 | R$1.30 | R$1.30 | 0 |

🔴 **Brand-Defense in 14d delivered 1 search ("bretda"), 1 click, R$1.30.** Brand recall is essentially zero — concorrente paga 30 centavos pra interceptar e ninguém está nos buscando organicamente.

---

## STEP 4 — Ad Groups, Keywords, Ads, Search Terms

### Ad Group Bids (Aslam 2-4 floor violation check)

| AdGroup | Campaign | Max CPC | Aslam floor (lead-based @ R$105 lead value) | Status |
|---|---|---|---|---|
| Brand | Brand-Defense | **R$5.00** | R$26-52 | 🔴 5x below |
| MesaJantar-12-Lugares | MesaJantar | **R$6.00** | R$26-52 | 🔴 4-9x below |
| MesaJantar-Madeira-Macica | MesaJantar | **R$6.00** | R$26-52 | 🔴 4-9x below |
| MesaBilhar-Luxo | MesaBilhar | **R$8.00** | R$26-52 | 🔴 3-6x below |
| MesaBilhar-SobMedida | MesaBilhar | **R$8.00** | R$26-52 | 🔴 3-6x below |
| MesaBilhar-Madeira | MesaBilhar | **R$8.00** | R$26-52 | 🔴 3-6x below |
| RTG-90d | RTG | R$10.00 | R$26-52 | 🔴 2-5x below |

**Doctrine call:** *"Bid floor = CAC ÷ 2-to-4"*. Para CAC qualificado R$2,100 e close rate 5% efetivo lead value R$105. Bid floor R$26-52. We're at R$5-10. **Result: Search IS 9.99% e Budget-Lost 90%.** Estamos pagando pela presença mínima de impressão, não competindo de fato.

### Quality Score distribution (24 KWs com data)

| QS | Count | Aslam reading |
|---|---|---|
| 1 | 3 | 🔴 LP/copy crítico |
| 2 | 1 | 🔴 |
| 3 | 6 | 🔴 (post_click=2 dominante) |
| 4 | 6 | 🟡 |
| 5 | 3 | 🟢 limiar |
| 6 | 1 | 🟢 |
| 7 | 1 | 🟢 |
| 10 | 3 | ✅ Brand exact (estes são "bretda" Brand) |

**67% dos KWs trackeáveis com QS<5.** Post-click QS dominantly = 2. *"Quality Score < 5 = bid mais alto não resolve. Arruma LP."*

### Landing pages (Aslam diagnostic)

Final URLs only 3 distintos: `https://bretda.com.br/`, `https://www.bretda.com.br/`, `https://bretda.com.br/colecao`.

🔴 **F-pattern: Generic LP for specific intent**. KW "mesa de bilhar escultural" → LP root. KW "mesa jantar 12 lugares retangular" → LP root ou /colecao (gallery, NOT product page, NOT specific category landing). LP relevance score (post_click_quality_score=2) é direta consequência.

### Search Terms 30d top-spend (cost desc)

| # | Search Term | Campaign | Clicks | Cost | Conv |
|---|---|---|---|---|---|
| 1 | mesa de sinuca que vira mesa de jantar | 08/11 | 7 | R$35.45 | 0 |
| 2 | mesa de sinuca e jantar (mesma query duplicada) | 08/11 + MesaBilhar | 8 | R$62.22 | 0 |
| 3 | mesa de sinuca vira mesa | 08/11 | 2 | R$16.18 | 0 |
| 4 | mesa que se transforma em sinuca | 08/11 | 2 | R$12.68 | 0 |
| 5 | mesa sinuca jantar | 08/11 | 3 | R$12.46 | 0 |
| 6 | mesa de 12 lugares retangular | MesaJantar | 2 | R$11.86 | 0 |
| 7 | mesa madeira maçica | RTG | 1 | R$9.44 | 0 |

✅ Search terms são relevantes — alta intenção (sinuca-jantar combo é o sweet-spot Bretda). 🔴 ZERO conversões em todas. Hipótese: combo de bid floor + LP genérica + CAPI possivelmente quebrado para Google fires.

### Brand Defense delivery (literal "bretda")

| Window | Impr | Clicks | Cost |
|---|---|---|---|
| 14d | 1 | 1 | R$1.30 |
| 7d | 1 | 1 | R$1.30 |

🚨 **Brand demand é essencialmente zero.** 1 single search em 14 dias. Significa duas coisas:
1. Brand awareness orgânico Bretda = perto de zero
2. Meta funnel-upstream NÃO está gerando comportamento "vou googlar Bretda"

Funnel-aware chief synthesis 15/Mai morning previu que esse gap existiria. Agora **medido**.

---

## STEP 5 — Conversion Hierarchy (CRITICAL F6)

### 4 ENABLED conversion actions

| ID | Name | Type | Category | Default Value | Always Use | Include in Conv | **PRIMARY** | F-code |
|---|---|---|---|---|---|---|---|---|
| 6918863652 | Contato | 8 (Webpage) | 18 (Default) | 0 | false | **false** | ✅ | clean |
| **7138711130** | **[AGD] Lead (bretda.com.br/obrigado)** | **37 (codeless GA imports)** | **13 (Lead)** | **R$100** | **TRUE** | **TRUE** | ✅ | 🔴 **F6 ZOMBIE LIVE** |
| 7540863796 | WhatsApp - CLICK | 8 (Webpage) | 18 (Default) | 0 | false | false | ✅ | clean |
| 7571079256 | Lead - Pagina Obrigado | 8 (Webpage) | 13 (Lead) | R$1500 | TRUE | TRUE | ✅ | ✅ canon |

🔴 **F6 codeless conversion zombie CONFIRMED LIVE**:
- ID `7138711130` `[AGD] Lead (bretda.com.br/obrigado)` is **type=37** (codeless Google Analytics import or similar auto-tracked goal), category=13 (Lead), `default_value=R$100`, `always_use_default_value=TRUE`, `include_in_conversions_metric=TRUE`, and **PRIMARY**.
- Per memory and chief synthesis: this is the zombie that distorts Smart Bidding signals if active. Currently no Smart Bidding active (all Manual CPC), so direct damage is contained, BUT:
  - If anyone switches to Smart Bidding without cleanup, this fires false R$100 lead values
  - Counts toward "conversions" in aggregate reporting, masking the fact that real `Lead - Pagina Obrigado` fires zero

🔴 **4 PRIMARY conversions vs Aslam canon max 2**. Violation by 2x. Aslam doctrine: *"Nunca mais que 1-2 PRIMARY por conta. Smart Bidding usa PRIMARY para otimizar — 8 PRIMARY = bid caotico."*

### Conversion stats 30d (which actions fired)

```
WhatsApp - CLICK: 1 conv, R$50 value (category 18 = Default)
```

🚨 **Only ONE conv action fired in 30 days, and it's the SOFT conv (WhatsApp click), not a qualified lead.** Lead-Pagina-Obrigado (PRIMARY R$1500) fired ZERO. F6 zombie `[AGD] Lead` fired ZERO (good — confirms it's not firing falsely, but it remains a landmine for any Smart Bidding switch).

### Conversion stats 7d

EMPTY array. Zero events of any kind tied to a conversion action in last 7d.

---

## STEP 6 — Geo Targeting

### 6.1 — Geo criteria per campaign

Inspecionada para 5 campanhas canon. Brasil 2076 + segments confirm `LOCATION_OF_PRESENCE`.

### 6.2 — Geo Targeting Setting

```json
positive_geo_target_type: 7 (PRESENCE)
negative_geo_target_type: 5 (PRESENCE_OR_INTEREST)
```

✅ Aslam canon green. PRESENCE-only — não captura "interest" leakage internacional.

### 6.3 — Geo performance 30d (ENABLED only)

Só Brand-Defense ENABLED, gerou 1 impressão em SP (geoTargetConstants/20106 = SP region, /1001729 city level). Branded query "bretda" foi feita em SP. ✅ geo está funcionando.

---

## STEP 7 — Change History + Saldo

### Change History 14d — KEY EVENTS

| Date (UTC) | User | Resource | Action | Notes |
|---|---|---|---|---|
| 2026-05-12 11:41:28 | contato@tockscustom.com.br | Campaign 23821730339 (RTG) | status UPDATE | 🔴 **PAUSED RTG** |
| 2026-05-12 11:41:28 | contato@tockscustom.com.br | Campaign 23821730147 (MesaJantar) | status UPDATE | 🔴 **PAUSED MesaJantar** |
| 2026-05-12 11:41:26 | contato@tockscustom.com.br | Campaign 23816403561 (MesaBilhar) | status UPDATE | 🔴 **PAUSED MesaBilhar** |
| 2026-05-11 12:06:52 | contato@tockscustom.com.br | Brand-Defense ad_group_criteria | bulk UPDATE | Keyword tweaks, kept ENABLED |
| 2026-05-07 13:17:39 | contato@tockscustom.com.br | conversion_action (resource_type=13) | UPDATE | Memory says 07/Mai = Aslam QW conv hierarchy work |

🎯 **Smoking gun:** 3 generic Search campaigns foram pausadas em sequência 2026-05-12 ~08:41 BRT. Usuário foi `contato@tockscustom.com.br` — mesma identity OAuth. **Não foi system, foi user action**.

### Account Budget (saldo)

```json
{
  "id": 7413681525,
  "status": 3 (APPROVED),
  "approved_spending_limit_micros": 26900000000,     // R$ 26,900 lifetime
  "amount_served_micros": 26623470000,                // R$ 26,623.47 served
  "total_adjustments_micros": 42180000,               // R$ 42.18
  "saldo disponível ≈ R$ 318.71"
}
```

🟡 **R$318.71 restantes neste budget cap**. Não é saldo de crédito (que é prepago/postpaid no payment account), é o spending limit da campanha-pagamento. Burn rate atual 14d = R$295/14 = R$21/d, então **runway ~15d nesse ritmo**. Se Plan B 14/Mai for executado e demais campaigns reativarem, runway encolhe pra ~4-6d (depende da soma dos budgets).

### Billing Setup

```
status: 4 (APPROVED + ACTIVE)
payments_account: 3640-9955-3897-9917
start: 2024-10-28
```

✅ Pagamento OK.

---

## STEP 8 — Recommendations

❌ Query falhou em campo deprecated (`recommendation.impact.potential_metrics.cost_micros`). Não é prioridade audit — Aslam: *"Filter ruído — review com ceticismo."*

---

## STEP 9 — Per-Ad Performance 30d

Apenas Brand-Defense ENABLED apareceu, com 2 RSAs:
- Ad 807857489443: 1 click, 1 impr, R$1.30 — o ad ATIVO
- Ad 807857489440: 0 / 0 — secundário, possivelmente novo ou rotation

🟡 Brand-Defense só tem 2 ads. Aslam recommendation: 3-4 RSAs por ad group (rotation health).

---

## Failure Modes Detected

| F-code | Pattern | Detection live | Severity |
|---|---|---|---|
| **F6** | Codeless conversion bug | `[AGD] Lead 7138711130` type=37, default_value=R$100, always_use=TRUE, PRIMARY | 🔴 CRITICAL (latent — fires under Smart Bidding switch) |
| **Aslam #5** | Conversion stuffing (>2 PRIMARY) | 4 PRIMARY ENABLED | 🔴 HIGH |
| **Aslam #1 inverse** | Brand-Defense skip | Brand-Defense ENABLED ✅ but delivering 1 imp/14d (anemic, not "skip") | 🟡 MED |
| **Bid floor violation** | Bids 5-10x below CAC/2-4 formula | All canon AGs R$5-10 max CPC | 🔴 HIGH (operational, not config) |
| **F7** | ROAS cego / value tracking | Only WhatsApp - CLICK fires; Lead-Pagina-Obrigado zero | 🔴 HIGH |
| **LP relevance failure** | post_click_quality_score=2 dominant | All ads point to 3 LPs (root, /colecao, root www) | 🔴 HIGH |
| **Operational pause without strategy** | 3 of 4 canon paused 12/Mai by user | Account dormant 3d, only Brand-Defense alive | 🟡 MED (likely deliberate, missing context) |

---

## TOP 3 Findings (live, F-coded)

| # | Finding | F-code | Severity | Why |
|---|---|---|---|---|
| 1 | **3 of 4 canon campaigns PAUSED 12/Mai by user** — account operationally dormant; Brand-Defense alone = 1 click/14d | Aslam structural | 🔴 CRITICAL | Was the pause intentional (PIX limbo, strategy shift)? Memory not updated. Without context, the Aslam architecture exists on paper only. |
| 2 | **F6 codeless zombie `[AGD] Lead 7138711130` STILL LIVE** — default_value=R$100, always_use=TRUE, PRIMARY, type=37 codeless | F6 / G-006 | 🔴 CRITICAL | Memory drift confirmed. Playbook said cleaned, chief synthesis 15/Mai morning said pending. Live data confirms STILL PENDING. Smart Bidding lockout. |
| 3 | **Lead-Pagina-Obrigado PRIMARY R$1500 fires ZERO in 30d** while Google sent 83 clicks/R$491 | F7 ROAS cego | 🔴 CRITICAL | Either (a) CAPI/GTM tag for /obrigado page is broken on Google side (unlike Meta which has Caminho B LIVE), or (b) the clicks are landing but not converting (LP + bid floor + intent mismatch). Either way, attribution invisible. |

### Secondary findings

4. **4 PRIMARY conversions** vs Aslam max 2 — `Contato`, `WhatsApp - CLICK`, `[AGD] Lead zombie`, `Lead-Pagina-Obrigado` all PRIMARY. Set 2 to SECONDARY.
5. **Bid floor violation** all AGs R$5-10 vs Aslam formula R$26-52 floor (lead-based). Operationally — account is throttled by under-bidding, not by budget.
6. **LP relevance** — 3 LPs (root × 2 + /colecao) serving all 20+ ad themes. Post-click QS=2.
7. **Brand demand essentially zero** — 1 search "bretda" in 14d. Meta funnel-upstream not generating downstream search behavior.
8. **Saldo budget cap** — R$318.71 left on current account_budget. ~15d at current 1-campaign burn rate; 4-6d if all 4 reactivate.

---

## Quick Wins (priority + estimated time, NO writes this session)

| # | Pri | Action | Tool | Time | Risk |
|---|---|---|---|---|---|
| 1 | 🔴 P0 | Cleanup F6 zombie `[AGD] Lead 7138711130` — set default_value=0, always_use=false, OR delete, OR demote to SECONDARY | `google_ads_set_conversion_priority` + `google_ads_update_conversion_value` | 5min | LOW (idempotent, reversible) |
| 2 | 🔴 P0 | Demote 2 of 4 PRIMARY to SECONDARY — keep `Lead-Pagina-Obrigado` (canon R$1500) + `Contato`; demote `WhatsApp - CLICK` and `[AGD] Lead` to SECONDARY | `google_ads_set_conversion_priority` | 3min | LOW |
| 3 | 🔴 P1 | Confirm with user: was the 12/Mai pause intentional? If yes, document strategy. If no, reactivate MesaBilhar + MesaJantar PAUSED-first with reviewed bid floors. | (decision, no tool) | 5min user dialog | NONE |
| 4 | 🔴 P1 | Validate `Lead-Pagina-Obrigado` tag firing — check GTM at bretda.com.br/obrigado, dev tools network for conv ping (gtag/conversion_ID/2076 etc) | manual smoke test (user-side) + `google_ads_change_history` post-fire | 10min | LOW |
| 5 | 🟡 P2 | Raise bid floor MesaBilhar AGs from R$8 → R$15-20 staged (within +30%/d budget circuit breaker) | `google_ads_update_ad_group_bid` | 5min | MED (still well below Aslam floor; gradual is OK) |
| 6 | 🟡 P2 | Build LP variants per ad theme (sinuca-jantar combo, MesaJantar 12 lugares, MesaBilhar luxo) | @aios-dev handoff | NOT this audit | — |
| 7 | 🟢 P3 | Add 1-2 more RSA variants to Brand-Defense for rotation health | `google_ads_create_responsive_search_ad` | 10min | LOW |
| 8 | 🟢 P3 | Schedule weekly `google_ads_search_terms` review for negative kw sculpting (currently no neg shared sets in audit) | calendar | — | NONE |

**Total P0+P1 specialist time:** ~25min after user clarifies P1 #3 (the pause question).

---

## Cross-platform funnel-aware

Per Plan C exec hoje (Meta CJ8v2 R$60/d + CP1 R$30/d reactivated, AD05/AD04 forms swapped):

| Funnel stage | Channel | State | Health |
|---|---|---|---|
| D1 Awareness | Meta CJ8v2 + CP1 | LIVE R$90/d Sudeste+Sul | 🟢 healthy post Plan C |
| D2 Demand capture | Google Brand-Defense | ENABLED R$10/d | 🔴 anemic (1 click/14d — brand demand não existe) |
| D3 High-intent intercept | Google MesaBilhar/MesaJantar | **PAUSED 12/Mai** | 🔴 offline |
| D4 Conversion | LP form bretda.com.br + Lead-Pagina-Obrigado conv | LIVE but 0 fires 30d | 🔴 tag possibly broken OR LP not converting |
| D5 Re-engage | Google RTG-SiteVisitors-90d | **PAUSED 12/Mai** | 🔴 offline |

**Funnel-aware conclusion:** Plan C Meta hoje melhorou D1. D2 está estruturalmente fraco (brand awareness orgânico ~0). **D3 + D5 completamente offline há 3 dias**. D4 attribution cego.

Multiplier Google que o Meta precisa não está rodando. Re-engage Bretda hoje = Meta RTG only (memory says Meta RTG also zero active).

---

## Gates Passed (audit-time, read-only)

- [x] Account context loaded (`D:\AIOS\squads\marketing-traffic\data\account-playbooks\bretda.md` + chief audit 15/Mai morning)
- [x] OAuth connection test passed (customer.id query returned Bretda)
- [x] No writes performed — read-only audit
- [x] `ads_guardrails` N/A (read-only, no gate triggered)
- [x] `ads_action_log` N/A (read-only)
- [x] Idempotency keys N/A (read-only)
- [x] Account context load (Pocock pattern) ✅

---

## User Action Required

| # | Pri | Action | Owner | Time |
|---|---|---|---|---|
| 1 | 🔴 P0 | **Clarify 12/Mai pause** — was the pause of MesaBilhar/MesaJantar/RTG intentional (PIX limbo, strategy shift, Plan-C swap context) or accidental? Without context, can't decide reactivation. | Breno | 1min |
| 2 | 🔴 P0 | Authorize Kasim to cleanup F6 zombie `[AGD] Lead 7138711130` (set to SECONDARY + default_value=0) | Breno | 1min decision |
| 3 | 🟡 P1 | Smoke test `bretda.com.br/obrigado` conversion fire — submit a fake form and watch dev tools for gtag conversion fire to AW-{conversion_label} | Breno (user-side, 5min) | 5min |
| 4 | 🟢 P2 | If reactivating PAUSED campaigns post-clarify, validate saldo via Google Ads UI Billing (`R$318.71 budget left on cap` — may need PIX top-up) | Breno | 2min |

---

## Output Format Compliance

```yaml
mission: Bretda Google Tier 1 Live Audit
account: bretda (8167636084)
specialist: kasim-aslam
mode: READ-ONLY
deliverables:
  - kasim audit (this file)
  - chief synthesis (companion)
gates_passed: [foundation_first, geo_brasil_presence, oauth_fresh, no_writes]
findings_top3:
  - 3_of_4_canon_paused_12mai_user_action_no_memory_update
  - F6_codeless_zombie_still_live_4_primary
  - lead_pagina_obrigado_zero_fires_30d_attribution_blind
user_action_required: 4 items (clarify pause + cleanup auth + smoke test + saldo verify)
verdict: FIX (post-user-clarification)
```

---

*Foundation First. Brand-Defense ENABLED but anemic — bid + LP + brand-demand all hit floor simultaneously. F6 zombie didn't die. 4 PRIMARY ≠ 2 PRIMARY. Search before Shopping before PMAX — Bretda is correctly Search-only, but the Search bench is on the floor.*
