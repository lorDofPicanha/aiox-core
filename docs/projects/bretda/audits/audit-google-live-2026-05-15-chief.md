# Bretda Google Ads — Audit LIVE — Chief Synthesis — 2026-05-15

> **Companion to:** `audit-google-live-2026-05-15-kasim.md` (Kasim Tier 1 specialist deliverable)
> **OAuth status:** ✅ LIVE — reauth `contato@tockscustom.com.br` 2026-05-15 13:30 BRT confirmed via direct customer query
> **Sister audits:** Tier 0 `audit-2026-05-15-chief.md` + Documentary `audit-google-2026-05-15-chief.md` (15/Mai morning, pre-reauth) + `drill-meta-leads-2026-05-15-chief.md` + Plan C exec `execute-plan-C-2026-05-15-chief.md`
> **Run mode:** READ-ONLY live audit, zero writes
> **Verdict:** **`FIX — operationally dormant. State delta from playbook is massive. Three P0 actions ready to execute pending user clarification on one decision.`**

---

## 1. TL;DR (Chief)

OAuth reauth liberou visibilidade live. **Notícia boa:** Bretda Google está alive, OAuth healthy, geo PRESENCE Brasil 2076, billing setup APPROVED, architecture Aslam canon ainda intacta no schema. **Notícia ruim:** account está **operacionalmente dormente há 3 dias**. 3 de 4 campanhas canônicas foram pausadas em 12/Mai 11:41 UTC pelo próprio user (`contato@tockscustom.com.br`), e isso NÃO foi documentado em memory. Apenas Brand-Defense @ R$10/d sobrevive — e ele mesmo está entregando 1 click em 14 dias.

Três descobertas live mudam o quadro do audit documental 15/Mai morning:

1. **State delta é maior do que esperávamos.** Memory dizia 4 ENABLED, live mostra 1 ENABLED (Brand-Defense). 12/Mai user-action.
2. **F6 codeless zombie `[AGD] Lead 7138711130` confirmado AINDA LIVE** — playbook canon dizia "cleaned up", chief 15/Mai morning dizia "pending", live data confirma **NUNCA foi limpo**. Memory drift completo. `type=37 codeless`, `default_value=R$100`, `always_use=TRUE`, `include_in_conversions_metric=TRUE`, **PRIMARY**.
3. **`Lead-Pagina-Obrigado` PRIMARY R$1500 fires ZERO em 30d**, enquanto Google entregou 83 clicks. Attribution cega. Tag possivelmente quebrada ou LP não convertendo.

**Verdict: FIX**. Não é HOLD porque OAuth está vivo e podemos executar. Não é GO porque precisamos da clarificação sobre 12/Mai pause antes de reativar nada. P0+P1 ações totalizam ~25min specialist + 5min user clarification.

---

## 2. State Delta (memory 07/Mai → live 15/Mai 13:30 BRT)

| Item | Playbook 07/Mai | Chief audit 15/Mai morning (documental) | **Live 15/Mai tarde** | Delta |
|---|---|---|---|---|
| 4 canon campaigns ENABLED | TODAS 4 ENABLED | UNVERIFIED (OAuth 401) | **1 ENABLED (Brand-Defense), 3 PAUSED 12/Mai** | 🔴 SHOCK |
| F6 codeless `[AGD] Lead 7138711130` cleanup | "Done 07/Mai" | "PENDING per memory drift" | **STILL LIVE, type=37, R$100, always_use=TRUE, PRIMARY** | 🔴 NEVER CLEANED |
| PRIMARY count | 2 (max Aslam) | "Ambiguity 2 vs 4" | **4 ENABLED** | 🔴 VIOLATION 2x |
| Brand Defense delivering? | "Live" | UNKNOWN | **ENABLED + delivering 1 click/14d (anemic)** | 🟡 Live but anemic |
| Geo Brasil 2076 + PRESENCE | Required | UNVERIFIED | **All 5 canon ✅ `positive=7 PRESENCE`** | ✅ |
| Saldo runway | Unknown | UNKNOWN | **R$318.71 budget cap remaining (~15d at R$21/d current burn)** | 🟡 thin |
| Bid floor (MesaBilhar) | "Violation suspected per memory" | "R$8 vs Aslam R$525-1050 (close-CAC) or R$26-52 (lead-CAC)" | **Confirmed R$8 max CPC** | 🔴 violated 3-10x |
| Lead-Pagina-Obrigado PRIMARY R$1500 | Set 07/Mai | UNKNOWN | **Confirmed ENABLED but ZERO fires 30d** | 🔴 attribution blind |
| OAuth state | Fresh 07/Mai | 401 cascade | **REAUTH 15/Mai 13:30 BRT** ✅ | ✅ |
| Account budget cap | Unknown | UNKNOWN | **R$26,900 lifetime / R$318.71 remaining** | 🟡 |

The audit documental 15/Mai morning made the right calls on what to fear; the live audit confirms or sharpens each one. The **biggest surprise was finding #1 — the 12/Mai pause** that nobody had documented in memory.

---

## 3. Cross-platform funnel-aware (sharpened)

Earlier today (15/Mai morning) Plan C ran on Meta: CJ8v2 R$60/d + CP1 R$30/d reactivated, AD05/AD04 forms swapped to LP (`destination_type=WEBSITE`).

Now mapping with live Google state:

```
D1 Awareness — Meta CJ8v2+CP1 R$90/d Sudeste+Sul          🟢 healthy post Plan C
         ↓
D2 Demand capture — Google Brand-Defense R$10/d           🔴 ENABLED but anemic
                    └─ 1 search "bretda" in 14d            (brand recall ≈ zero)
         ↓
D3 High-intent intercept — Google MesaBilhar+MesaJantar   🔴 PAUSED 12/Mai
                           └─ Offline 3 days               (multiplier offline)
         ↓
D4 Conversion — LP form bretda.com.br/obrigado            🔴 Lead-Pagina-Obrigado conv
                                                              fired ZERO 30d
                                                              Google attribution cega
         ↓
D5 Re-engage — Google RTG-90d                              🔴 PAUSED 12/Mai
                Meta RTG                                    🔴 Zero active
                                                              Re-engage pipeline = ZERO
```

**The bigger story:** Plan C made Meta-side healthier today, but **the Google multiplier the Meta funnel needs is OFFLINE on D3 and D5**. Meta sends N leads "vi um ad" → they search "bretda" or "mesa de bilhar" → ad de concorrente intercepta porque MesaBilhar está PAUSED. Custo invisível Meta→Google leak.

**Plus:** brand-demand é estruturalmente fraca (1 search/14d), o que significa que **Meta awareness não está gerando branded search**. Não é um problema do Google config — é um problema upstream (Meta creative não brandeia o suficiente, ou Bretda como marca ainda é muito early).

**D+7 gate 19/Mai conclave round 2 implication:** if MesaBilhar/MesaJantar stay PAUSED through 19/Mai, the conclave will have only 4 days of Meta-Plan-C data + 0 days of Google D3 multiplier data. Recommend: clarify the pause TODAY, decide reactivation strategy this session.

---

## 4. Top 3 findings (live, with F-codes + severities)

| Rank | Finding | F-code | Severity | Action |
|---|---|---|---|---|
| 1 | **3 of 4 canon campaigns PAUSED 2026-05-12 11:41 UTC** by `contato@tockscustom.com.br`. Account operationally dormant 3d. Memory not updated. Brand-Defense alone delivering 1 click/14d. | Operational drift | 🔴 CRITICAL | Clarify 12/Mai pause with user; document strategy or reactivate PAUSED-first |
| 2 | **F6 codeless zombie `[AGD] Lead 7138711130` STILL LIVE** — type=37, default_value=R$100, always_use=TRUE, include_in_conversions=TRUE, PRIMARY. Cleanup NEVER executed despite playbook + Aslam doctrine + chief 07/Mai action listed | F6 / G-006 | 🔴 CRITICAL | Cleanup to SECONDARY + default_value=0 (5min specialist work post-auth) |
| 3 | **Lead-Pagina-Obrigado PRIMARY R$1500 fires ZERO in 30d** despite Google sending 83 clicks. WhatsApp-CLICK (soft conv) fires only 1. **Attribution to Google is functionally dead.** | F7 ROAS cego | 🔴 CRITICAL | Smoke test conv fire user-side; if tag broken, handoff @aios-dev. If tag OK + 0 fires = LP+bid+intent mismatch |

### Secondary findings (live)

4. **4 PRIMARY conversions** vs Aslam canon max 2 — `Contato`, `WhatsApp - CLICK`, `[AGD] Lead zombie`, `Lead-Pagina-Obrigado` ALL PRIMARY. Aslam: *"8 PRIMARY = bid caotico."* Demote 2 to SECONDARY.
5. **Bid floor violation confirmed** — all canon AGs R$5-10 max CPC vs Aslam R$26-52 floor (lead-based) or R$525-1050 (close-CAC). Result: Search IS=9.99%, Budget-Lost=90%.
6. **Brand demand structurally zero** — 1 search "bretda" in 14d. Meta funnel-upstream not generating downstream branded search. This is upstream creative/brand strength problem, not Google config.
7. **LP relevance failure** — all 20+ ad themes route to 3 LPs (root + /colecao). post_click_quality_score dominant=2.
8. **Saldo budget cap** R$318.71 left on current `account_budget` cap (R$26,900 lifetime, R$26,623 served). Runway ~15d at current 1-campaign burn, **4-6d if all 4 reactivate**.

---

## 5. F-codes consolidated

| F-code | Pattern | Live status |
|---|---|---|
| F1 saldo crítico | <3d daily burn | 🟡 not critical at 1-campaign burn (15d runway), but tight if 4 reactivate |
| F2 OAuth | 403 cascade | ✅ resolved 15/Mai reauth |
| F6 codeless conversion zombie | `default_value>0 AND category=codeless AND always_use=true` | 🔴 **STILL LIVE** — `[AGD] Lead 7138711130` |
| F7 ROAS cego | Conv fires zero despite click volume | 🔴 Lead-Pagina-Obrigado 0/30d on 83 clicks |
| F8 single hero >70% | N/A (only 1 campaign live) | — |
| F10 GTM tags never installed | Possible — Lead-Pagina-Obrigado zero fires could mean tag broken | 🟡 SMOKE TEST PENDING |
| Aslam #1 inverse — Brand-Defense skip | Brand-Defense ENABLED ✅ but anemic | 🟡 |
| Aslam #5 — Conversion stuffing | 4 PRIMARY vs max 2 | 🔴 |
| Bid floor violation | All AGs 3-10x below CAC/2-4 formula | 🔴 |

---

## 6. Funnel-aware Brand Defense delivery (LIVE — answer to spawn question)

**Q: Brand Defense alive or silent offline?**
**A: ENABLED + delivering, but anemic.** 1 click on literal "bretda" search in 14 days. Geo SP confirmed. Budget R$10/d unused — Search IS=16.7% (only 1 of 6 estimated Brand auctions captured), Budget-Lost=50%, Rank-Lost=33%.

**Interpretation:**
- Não é Brand Defense que está mal config — está saudável technically
- O problema é **brand demand orgânico não existe**. Concorrente não precisa bidar contra nós porque ninguém está buscando "bretda" orgânico
- Isso muda a interpretação da chief synthesis 15/Mai morning: o risco "concorrente está roubando seu cliente via Brand Defense offline" é menor que pensávamos. O risco real é **upstream awareness não gera branded search.**
- Action: **mantém Brand-Defense ENABLED** (R$10/d barato seguro), mas a alavanca é gerar brand demand via Meta creative + (eventually) YouTube — não via Google bid increase.

---

## 7. F6 codeless cleanup status (LIVE — answer to spawn question)

**Q: F6 cleanup done or still pending?**
**A: 🔴 STILL PENDING — confirmed LIVE.**

`[AGD] Lead 7138711130`:
- `type: 37` = `GOOGLE_ADS_LEAD_FORM_GLOBAL` or codeless GA import
- `category: 13` = Lead
- `default_value: 100` BRL
- `always_use_default_value: TRUE`
- `include_in_conversions_metric: TRUE`
- `primary_for_goal: TRUE` (PRIMARY)
- `status: 2` (ENABLED)
- `click_through_lookback_window_days: 90`

Memory `session_bretda_audit_07mai` claimed cleanup happened on 07/Mai when promoting `Lead-Pagina-Obrigado` to PRIMARY R$1500 and demoting `[AGD] Lead` to SECONDARY. **Live data shows: promotion of `Lead-Pagina-Obrigado` DID happen (confirmed R$1500 PRIMARY ENABLED), but demotion of `[AGD] Lead` to SECONDARY DID NOT happen.** Both are PRIMARY now. Half-executed QW.

**Why it matters:** currently no damage because all campaigns are Manual CPC. **The moment we switch any campaign to Smart Bidding** (e.g., post-21d baseline migration per Aslam S6), the codeless conv will distort lead-value signals with phantom R$100 events. Cleanup is preventive maintenance.

**Cleanup spec (3-line operation):**
```
google_ads_set_conversion_priority --conversion_action 7138711130 --primary false
google_ads_update_conversion_value --conversion_action 7138711130 --default_value 0 --always_use false
(optional) google_ads_set_conversion_priority --conversion_action 7540863796 (WhatsApp-CLICK) --primary false
```

This leaves the canon: `Contato` PRIMARY (soft web ping, low value) + `Lead-Pagina-Obrigado` PRIMARY R$1500 (qualified lead, hard value). 2 PRIMARY. Aslam canon green.

---

## 8. Quick wins identified (with priorities)

| # | Pri | Action | Tool | Time | Status |
|---|---|---|---|---|---|
| 1 | 🔴 **P0** | **Clarify with user: was 12/Mai pause intentional?** (PIX limbo? Plan-C cross-platform pivot context? Accident?) | (dialog) | 1min user | **PENDING USER** |
| 2 | 🔴 **P0** | F6 cleanup `[AGD] Lead 7138711130` — demote to SECONDARY + default_value=0 + always_use=false | `google_ads_set_conversion_priority` + `google_ads_update_conversion_value` | 5min Kasim | READY pending Action #1 + auth |
| 3 | 🔴 **P0** | Demote `WhatsApp - CLICK` to SECONDARY — keep only `Contato` + `Lead-Pagina-Obrigado` as PRIMARY (2 PRIMARY = Aslam canon) | `google_ads_set_conversion_priority` | 2min Kasim | READY pending auth |
| 4 | 🔴 **P1** | Smoke test conv fire — Breno submits fake form at `bretda.com.br/contato` (or whatever LP triggers `/obrigado`), watches dev tools network for `gtag.../collect?conversion_label=...` ping | user-side | 5min user | PENDING USER |
| 5 | 🟡 **P1** | If pause was intentional and Plan C is the strategy, document in memory + playbook + done. If accidental, reactivate MesaBilhar + MesaJantar PAUSED-first with smoke test BEFORE ENABLE | `google_ads_update_status` (PAUSED→ENABLED post-validation) | 10min Kasim post-clarify | PENDING Action #1 |
| 6 | 🟡 **P2** | Raise bid floor staged — MesaBilhar AGs R$8 → R$15 (+87%, within +30%/d cap? NO — +87% > +30%, must use multi-day staging R$8→R$10→R$13→R$15 over 3 days) | `google_ads_update_ad_group_bid` | 5min Kasim + 3 days monitor | PENDING reactivation decision |
| 7 | 🟢 **P3** | Add 1-2 RSA variants to Brand-Defense (currently only 2 ads) for rotation health | `google_ads_create_responsive_search_ad` | 10min Kasim | LATER |
| 8 | 🟢 **P3** | LP relevance — handoff @aios-dev to build category-specific LPs (sinuca-jantar combo, MesaJantar 12 lugares, MesaBilhar luxo) | (handoff) | not this audit | LATER |
| 9 | 🟢 **P3** | Weekly `google_ads_search_terms` review for negative kw sculpting (no shared neg sets in audit) | calendar | — | LATER |

**Total this-session executable post-user-clarification: ~12min Kasim work (P0 items 2+3) + Breno 6min (clarification + smoke test).**

---

## 9. USER ACTION REQUIRED — Consolidated

| # | Pri | Action | Time | Unblocks |
|---|---|---|---|---|
| 1 | 🔴 **P0** | Clarify 12/Mai pause intent (intentional Plan-C strategy / accidental / PIX limbo / other) | 1min decision | Reactivation strategy + memory update |
| 2 | 🔴 **P0** | Authorize Kasim to cleanup F6 zombie + demote WhatsApp-CLICK | 1min decision | F6 cleanup execution |
| 3 | 🔴 **P1** | Smoke test `bretda.com.br/obrigado` form → conv fire (submit form, dev tools Network panel, look for `google.com/pagead/conversion` or `gtag` ping) | 5min user | F7 diagnosis (tag broken vs LP not converting) |
| 4 | 🟡 **P2** | Saldo Google UI check — `ads.google.com → Tools → Billing → Summary` confirm current spend cap & whether top-up needed pre-reactivation | 2min user | Reactivation runway |

**Total Breno time:** ~9min for ALL actions. P0 alone = 2min.

---

## 10. Deliverables (paths)

| Path | Owner | Status |
|---|---|---|
| `D:\AIOS\docs\projects\bretda\audits\audit-google-live-2026-05-15-kasim.md` | Kasim (Tier 1 live audit) | ✅ written |
| `D:\AIOS\docs\projects\bretda\audits\audit-google-live-2026-05-15-chief.md` | Chief (this synthesis) | ✅ written |
| `D:\AIOS\docs\projects\bretda\audits\audit-google-2026-05-15-chief.md` | Chief (15/Mai morning documental, pre-reauth) | ✅ pre-existing — superseded by this file on factual matters |
| `D:\AIOS\docs\projects\bretda\audits\audit-google-2026-05-15-kasim.md` | Kasim (15/Mai morning documental) | ✅ pre-existing — superseded by this file on factual matters |
| `D:\jarvis\mcp-ads-bridge\bretda-tier1-audit-15mai.out.txt` | Raw GAQL output | ✅ written (10,955 lines) |
| `D:\jarvis\mcp-ads-bridge\bretda-tier1-residual-15mai.out.txt` | Raw GAQL residual | ✅ written (2,201 lines) |
| `D:\jarvis\mcp-ads-bridge\audit-bretda-tier1-live-15mai.cjs` | Audit script (rerunable) | ✅ written |

---

## 11. Verdict

**`FIX — operationally dormant. State delta from playbook is massive. P0+P1 ready to execute pending user clarification on one decision.`**

Architecture (Aslam canon 4-campaign + Brand-Defense always-on + PRESENCE geo) está intacta no schema. **Operation está dormente** (3 of 4 PAUSED). **Conversion hierarchy está poluída** (4 PRIMARY, F6 zombie alive). **Attribution está cega** (Lead-Pagina-Obrigado 0 fires).

Recommended sequence next session (post-user clarify):

1. F6 cleanup + WhatsApp-CLICK demote (Kasim, ~7min, idempotent + reversible)
2. User smoke test Lead-Pagina-Obrigado conv fire (5min)
3. Based on (2) result: if tag broken → @aios-dev handoff. If tag OK → LP+bid floor strategy.
4. Based on Action #1 user clarification:
   - If pause intentional → document, move on
   - If pause accidental → reactivate MesaBilhar (highest historical CPC, R$7.19) PAUSED-first with raised bid floor R$10→R$15 staged, then MesaJantar same pattern, then RTG only when audience >1k AND budget allows
5. Saldo verify pre-reactivation (Breno UI check)

---

## 12. Open Questions for Breno (max 3)

1. **Intent of 12/Mai pause** — você lembra ter pausado MesaBilhar + MesaJantar + RTG em 12/Mai 08:41 BRT? Era parte do Plan C (focar Meta enquanto Google "espera"), PIX limbo, ou outro motivo? Sem isso, não decidimos reactivation.
2. **F6 cleanup authority** — autorizo Kasim a executar agora cleanup `[AGD] Lead 7138711130` (demote SECONDARY + zero default_value), e demote `WhatsApp - CLICK` para SECONDARY, deixando `Contato` + `Lead-Pagina-Obrigado` como os 2 PRIMARY canon?
3. **Conclave D+7 19/Mai timing** — quer que reativemos MesaBilhar/MesaJantar antes de 17/Mai (pra ter 2-3d de data live no conclave round 2), ou prefere conclave Meta-only e Google espera Plan-C completar 14d primeiro?

---

## 13. Time Taken

- Pre-flight + context load: 5min
- GAQL audit script write + 2 runs (main + residual fix): 12min
- Output parsing + finding identification: 15min
- Kasim deliverable write: 12min
- Chief synthesis write (this file): 10min
- **Total Chief delivery: ~54min**

vs. spawn target 15-25min — overshot because of script iteration (1 field name fix + 1 missing-status fix), but all sections delivered including residual queries (change_history, account_budget, billing_setup, per-ad perf).

---

*Foundation First. Brand-Defense ENABLED but delivering 1 click/14d — brand-demand é o problema, não config. F6 zombie nunca morreu apesar de canon dizer que sim — memory drift confirmado por live data. 4 PRIMARY ≠ 2 PRIMARY. Search before Shopping before PMAX — Bretda é Search-only corretamente mas o Search bench está no chão. Mata loser, escala winner — primeiro identifica quem é qual.*
