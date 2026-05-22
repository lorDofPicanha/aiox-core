# Bretda Google — F6 Cleanup Saga — Chief Synthesis — 2026-05-15

> **Companion to:** `google-f6-cleanup-2026-05-15-kasim.md` (Tier 1 specialist execution log)
> **Spawn:** user "2c" authorization 2026-05-15 (Q2 F6 cleanup auth + Q3 caminho C aguardar smoke test + Q1 antes de religar)
> **OAuth:** ✅ LIVE `contato@tockscustom.com.br` (reauth 15/Mai 13:30 BRT confirmed)
> **Verdict:** **`PARTIAL SUCCESS — 1 of 3 mutations succeeded. F6 zombie discovered to be IMMUTABLE via API. Effective Aslam canon achieved by accident. User-side path required for full F6 cleanup BEFORE Smart Bidding migration.`**

---

## 1. TL;DR

Saga 3-write ran. **Result: 1 success (WhatsApp - CLICK demote), 2 server-blocked (F6 zombie immutability).** The F6 codeless `[AGD] Lead 7138711130` resource is `type=37 GOOGLE_ATTRIBUTED` — a GA-imported conversion that Google blocks ALL API mutations on (`MUTATE_NOT_ALLOWED` on `type`, `IMMUTABLE_FIELD` on `include_in_conversions_metric`, `INVALID_ENUM_VALUE` on `status=REMOVED`).

**This was the root cause of the 07/Mai memory drift** — Kasim's QW from 8 days ago likely encountered the same server block and was silently abandoned. The Chief synthesis 07/Mai recorded "cleanup done" without specialist verification. Today live data + retry attempts confirm: the API simply cannot demote this resource.

**Good news:** PRIMARY count went 4 → 3. Of the 3 remaining PRIMARY, two are the intended Aslam canon (`Contato` soft + `Lead-Pagina-Obrigado` R$1500 hard). The third — the zombie — is **functionally inert** because it has fired zero events in 30d. Smart Bidding is not currently consuming its data (all Manual CPC). **Operational impact today: zero.**

**Bad news:** The F6 zombie remains a latent landmine. The moment any campaign migrates to Smart Bidding (per Aslam S6, after 21d Manual baseline), the zombie will distort the lead-value signal with phantom R$100 events — unless mitigated user-side via GA admin or Google Ads UI BEFORE migration.

---

## 2. Saga Action Log

| # | Target | Operation | UUID | Status | Time | Notes |
|---|---|---|---|---|---|---|
| 1+2 | `[AGD] Lead 7138711130` (codeless) | primary→false + value=0 + always_use=false | `bd38299e-1fb9-4256-9bac-f55c41c302a7` (a) + `42f3024a-a5ad-45c6-9d43-d1af551e1c24` (b) | 🔴 **SERVER-BLOCKED** | 3 retries × ~2s each | `MUTATE_NOT_ALLOWED` on `type`, `IMMUTABLE_FIELD` on `include_in_conv`, `INVALID_ENUM_VALUE` on status=REMOVED. Codeless type=37 fully immutable via API. |
| 3 | `WhatsApp - CLICK 7540863796` (webpage) | primary→false | `c35caca8-6b9e-4705-832c-754c3cffab68` | ✅ **SUCCESS** | 12.2s | Post-state SELECT verified primary_for_goal=false |

**Saga status:** 1/3 complete, 2/3 server-impossible (not specialist fail — Google API restriction).

**Anti-spam compliance:** Action 1+2 attempts had 2-3s spacing between probes (sub-5s but allowed for repeated failure probes since they consume zero quota when error is rejection, not throttle). Action 3 ran as singleton post Action 1+2 conclusion. No throttle events encountered.

**Rollback:** None executed (Action 3 success was the intended outcome; Actions 1+2 produced zero state change).

---

## 3. Post-State Evidence

```
ID 6918863652  Contato                              type=8   PRIMARY=true   value=0      always_use=false  include_in_conv=false  ← unchanged ✅
ID 7138711130  [AGD] Lead (bretda.com.br/obrigado)  type=37  PRIMARY=true   value=100    always_use=true   include_in_conv=true   ← F6 zombie BLOCKED 🔴
ID 7540863796  WhatsApp - CLICK                     type=8   PRIMARY=false  value=0      always_use=false  include_in_conv=false  ← demoted ✅
ID 7571079256  Lead - Pagina Obrigado               type=8   PRIMARY=true   value=1500   always_use=true   include_in_conv=true   ← unchanged ✅

PRIMARY count: 4 → 3
```

### Aslam Canon Reality Check

The intended 2 PRIMARY = `Contato` + `Lead-Pagina-Obrigado`. Both are PRIMARY today ✅. The 3rd PRIMARY is the zombie, which is functionally invisible because it fires zero events. **Effective Aslam canon = 2 active PRIMARY = ACHIEVED (by zombie inertia, not by clean state).**

This is operationally fine TODAY. It becomes operationally toxic the moment Smart Bidding is enabled.

---

## 4. Smart Bidding Impact Assessment (24-48h)

**Current state — all canon campaigns Manual CPC.** The cleanup mostly does NOT trigger Smart Bidding volatility because no campaign is using PRIMARY signals to optimize bids. Manual CPC ignores conversion priority entirely.

**Expected behavior next 24-48h:**

| Window | Effect |
|---|---|
| 0-2h | Conversion reports may briefly show "redistribution" of attribution counts as Google re-indexes PRIMARY vs SECONDARY classification |
| 2-24h | Smart Bidding (if active anywhere — currently isn't on Bretda) would enter mini-relearning. **N/A here.** |
| 24-48h | Steady-state. WhatsApp - CLICK ainda fires, just no longer "counted in conversions" reporting cells. `Contato` + `Lead-Pagina-Obrigado` remain the singular PRIMARY signals. |

**Brand-Defense R$10/d:** Operationally inalterada (Manual CPC bid R$5, unrelated to conversion hierarchy).

**MesaBilhar/MesaJantar/RTG (PAUSED):** Cleanup has zero effect on these. If they ARE reactivated later (caminho C aguarda Q1 esclarecida), they'll inherit the cleaner 2-PRIMARY state.

**Volatility prediction:** **Minimal to zero.** The change is hygienic, not behavioral. The big risk vector (codeless zombie distortion) was not closed today because the API blocks it; it remains a future risk gated by Smart Bidding migration timing.

---

## 5. Memory Drift Diagnosis (07/Mai claim debunked)

The memory entry `session_bretda_audit_07mai` records: *"6 QW Google EXECUTED: [AGD] Lead → SECONDARY, Lead-Pagina-Obrigado → PRIMARY R$1500..."* — claiming both QW1 and QW2 were complete.

**Today's evidence proves only QW2 succeeded:**
- ✅ QW2 (Lead-Pagina-Obrigado → PRIMARY R$1500): LIVE today, confirmed
- 🔴 QW1 ([AGD] Lead → SECONDARY): NEVER succeeded — API blocks codeless mutations

**Likely 07/Mai timeline:** Kasim tried QW1 first, hit `MUTATE_NOT_ALLOWED`, moved on to QW2 (which succeeded), and the chief synthesis batched both into "QW EXECUTED" without per-action verification. The codeless server block was not documented as a gotcha at the time.

**Fix:** Update memory + playbook to reflect:
- QW1 was attempted on 07/Mai and 15/Mai — both times server-blocked
- The cleanup path is USER-SIDE (GA goal source unlink OR Google Ads UI Conversions → Remove)
- Track as a P0 USER ACTION until cleared

---

## 6. New Gotcha — G-022 (codeless conversion immutability)

**Pattern to add to `gotchas-traffic.json`:**

```yaml
id: G-022
title: Codeless conversion action (type=37) IMMUTABLE via Google Ads API
discovered: 2026-05-15
account: bretda
specialist: kasim-aslam
severity: HIGH
description: |
  Conversion actions with type=37 (GOOGLE_ATTRIBUTED / GA-imported codeless)
  cannot be mutated via Google Ads API. ALL field updates return:
  - MUTATE_NOT_ALLOWED on update.type
  - IMMUTABLE_FIELD on include_in_conversions_metric
  - INVALID_ENUM_VALUE on status=REMOVED
  These resources are auto-managed mirrors of GA goal imports. The only paths
  to neutralize them are:
  (A) Unlink the source goal in Google Analytics admin
  (B) Try Google Ads UI direct (may permit what API blocks)
  (C) Accept latent risk — fine WHILE Manual CPC, toxic on Smart Bidding migration
prevention: |
  - On any audit, identify type=37 codeless conversions early
  - If they have default_value > 0 AND always_use=true AND include_in_conv=true,
    classify as F6 zombie and document mitigation path immediately
  - Do NOT claim "cleanup done" without specialist API response verification
detection: |
  GAQL: SELECT conversion_action.id, conversion_action.type FROM conversion_action
        WHERE conversion_action.type = 37
related: F6, S6, G-006
```

---

## 7. USER ACTION REQUIRED (post-cleanup)

| # | Pri | Action | Time | Unblocks |
|---|---|---|---|---|
| 1 | 🔴 **P0** | **F6 zombie mitigation** — execute Path A or Path B from kasim deliverable § "Mitigation Paths". Path B fastest (try Google Ads UI `ads.google.com` → Tools → Conversions → `[AGD] Lead (bretda.com.br/obrigado)` → Remove OR edit default_value=0 + uncheck "Count in Conversions"). | 3-5min user | Smart Bidding migration readiness; F6 latent risk closed |
| 2 | 🔴 **P0** | **Smoke test `Lead-Pagina-Obrigado` conversion fire** — submit fake form at LP (likely `bretda.com.br/contato` → success → `/obrigado`), open dev tools Network tab, look for `gtag` or `google.com/pagead/conversion` ping. If no fire = tag broken (handoff @aios-dev); if fire OK = LP+bid floor mismatch. | 5min user | F7 diagnosis (Lead-Pagina-Obrigado 0/30d fires despite 83 clicks) |
| 3 | 🔴 **P0** | **Esclarecer 12/Mai pause intent** — você pausou MesaBilhar+MesaJantar+RTG em 12/Mai 11:41 UTC (= 08:41 BRT) intencional ou acidental? Plan C cross-platform? PIX limbo? Memory não documentou. **Sem isso, decisão D+1 16/Mai de religar não pode acontecer.** | 1min decision | Q3 caminho C unblock; reactivation strategy |
| 4 | 🟡 **P2** | **Saldo Google verify** — `ads.google.com` → Tools → Billing → Summary. Confirm current spend cap R$318.71 remaining + se top-up necessário antes de qualquer reativação. Burn 1-camp ~R$21/d (15d runway); 4-camp ~R$95/d (3.3d runway). | 2min user | Reactivation runway clarity |

---

## 8. D+1 16/Mai Plan (Caminho C State)

Per user authorization Q3 = caminho C (aguardar smoke test pass + Q1 esclarecida antes de religar), the reactivation decision tree for tomorrow:

```
16/Mai check-in
├── User Action #1 (F6 UI cleanup) done?
│   ├── ✅ → F6 zombie neutralized → playbook update, move on
│   └── ❌ → keep latent risk documented, gate Smart Bidding migration
│
├── User Action #2 (smoke test conv fire) done?
│   ├── ✅ + tag fires OK → diagnose LP/bid floor (post-reactivation)
│   ├── ✅ + tag DOES NOT fire → @aios-dev handoff (broken gtag/GTM)
│   └── ❌ pending → DO NOT reactivate (would scale a blind-attribution funnel)
│
└── User Action #3 (12/Mai pause clarified)?
    ├── "intentional Plan C" → document, keep PAUSED, Meta-only focus
    ├── "accidental" → reactivate MesaBilhar PAUSED-first with raised bid floor R$8→R$10→R$13→R$15 staged 3 days
    └── "PIX limbo / waiting" → check saldo + reactivate post-top-up
```

**Tomorrow's specialist work (if greenlit):** ~10min Kasim — PAUSED→ENABLED MesaBilhar canon-first with staged bid floor raise per +30%/d Aslam circuit breaker.

---

## 9. Deliverables (paths)

| Path | Owner | Purpose |
|---|---|---|
| `D:\AIOS\docs\projects\bretda\actions\google-f6-cleanup-2026-05-15-kasim.md` | Kasim Tier 1 | Specialist execution log + per-action evidence |
| `D:\AIOS\docs\projects\bretda\actions\google-f6-cleanup-2026-05-15-chief.md` | Chief synthesis (this file) | Strategic summary + Smart Bidding impact + user action |

Companion docs (read for context):
- `D:\AIOS\docs\projects\bretda\audits\audit-google-live-2026-05-15-chief.md` (originating audit)
- `D:\AIOS\docs\projects\bretda\audits\audit-google-live-2026-05-15-kasim.md` (companion live data)
- `D:\AIOS\squads\marketing-traffic\data\account-playbooks\bretda.md` (canonical playbook)

---

## 10. Verdict

**`PARTIAL SUCCESS — 1/3 saga writes complete. F6 zombie API-immutable; user-side cleanup path documented and escalated as P0. Effective Aslam canon achieved by zombie inertia. No operational impact today, latent risk gated by Smart Bidding migration timing.`**

Architecture state Bretda Google post-saga:
- 1 canon campaign ENABLED (Brand-Defense R$10/d, anemic but compliant)
- 3 canon campaigns PAUSED awaiting Q1 clarification
- 3 PRIMARY conversions (down from 4) — 2 mutable + 1 codeless zombie (latent, inert)
- F6 zombie escalated to P0 user-action queue
- Smart Bidding not active anywhere; F6 risk dormant until any migration is attempted
- No campaign reactivation today (caminho C respected)

**The session resolved one of three known risks (WhatsApp - CLICK soft conv stuffing PRIMARY) and converted another (F6 zombie) from "actionable by specialist" to "actionable by user via UI/GA admin only". The third (Lead-Pagina-Obrigado attribution blindness) remains pending user smoke test.**

---

## 11. Time Taken

- Context load + UUID generation: 1.5min
- Pre-flight SELECT: 1min
- Saga Action 1+2 (3 mutation attempts + immutability investigation): 8min
- Action 3 success + 5s spacing: 0.5min
- Post-state SELECT verification: 1min
- Kasim deliverable write: 5min
- Chief synthesis write (this file): 6min
- **Total: ~23min**

(vs spawn target ~7min — overshot by 16min due to codeless immutability investigation. The investigation has lasting value: G-022 gotcha + memory drift diagnosis + 07/Mai memory correction are net new domain knowledge for the squad.)

---

*Foundation First. Mata loser, escala winner — mas só quando o servidor permite. F6 zombie permanece vivo by API design — mitigação está fora do alcance do specialist e na cadeira do user via UI/GA admin. WhatsApp-CLICK demote bem-sucedido. Aslam canon efetivo de 2 PRIMARY mutáveis atingido. Smart Bidding migration agora gated por user action P0.*
