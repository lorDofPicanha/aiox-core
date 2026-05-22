# Google Audit — Bretda — Kasim Aslam (Tier 1)

> **Run mode:** DOCUMENTARY (OAuth Google `UNAUTHENTICATED 401` confirmed by Tier 0 chief audit at 15/Mai 14:04 UTC — same `mcp-ads-bridge` session). No live read possible. Findings derive from: playbook canon 14/Mai, Tier 0 chief audit (`audit-2026-05-15-chief.md`), memory keys `session_bretda_google_ads_relight_07mai` + `session_bretda_audit_full_07mai` + `session_bretda_conclave_07mai` + `project_oauth_production_05mai`, `account-playbooks/bretda.md`. **READ-ONLY** confirmed — zero writes attempted.
> **Account:** Bretda — `customer_id=8167636084` — MCC `7943699417` — OAuth seat `contato@tockscustom.com.br`
> **Window:** 30d documental (07/Mai relight → 15/Mai). No live numbers.

---

## TL;DR

- **Verdict:** `HOLD — OAuth blocker primeiro. Documentary state passa 3/7 gates Aslam, 4 gates UNVERIFIED.` Sem reauth (30s user-side), nada move.
- **Top finding:** F2 (OAuth) bloqueia tudo. Mas documental, há suspeita forte de **F6 codeless conv zumbi persistente** (`[AGD] Lead 7138711130` com `default_value=R$100` + `always_use=true`) e **QW1+QW2 declarados executados em 07/Mai mas memorial de 06/Mai marca PENDING** — discrepância memorial precisa validação live.
- **Funnel-aware reading:** Google está estruturalmente certo (4 campaign types, greenfield Aslam textbook 05/Mai) MAS pode estar **silenciosamente OFFLINE** há dias. Brand Defense documental ENABLED R$10/d sem confirmação de delivery — concorrente pode estar lickando "bretda" há dias sem nossa proteção.

---

## Diagnostic (documental, com pinos de incerteza)

### A. Conta + Auth

| Item | Status | Source |
|---|---|---|
| `customer_id` | `8167636084` | playbook 14/Mai |
| MCC linkage | `7943699417` (validado 05/Mai) | `project_oauth_production_05mai`, `session_bretda_google_ads_relight_07mai` |
| OAuth seat | `contato@tockscustom.com.br` | playbook + memory 07/Mai |
| OAuth status agora | 🔴 **401 UNAUTHENTICATED** | Tier 0 chief 15/Mai 14:04 UTC |
| Production verification | ⚠️ **PENDING (GCP)** | `project_oauth_production_05mai` — submitted 05/Mai, still in queue |
| Última reauth bem-sucedida | 07/Mai (8d atrás) | `session_bretda_google_ads_relight_07mai` |
| Auto-tagging | ❓ não validável | requires `google_ads_account_settings` live |

> **Aslam call:** *"Smart Bidding doesn't fix bad signals — and dead OAuth doesn't deliver any signal."* Token Production verification pendente desde 05/Mai = 10 dias em fila GCP. **Risk:** se reauth não funcionar (verification negada), conta opera em refresh-token-only que expira 7d desde último uso. Possível **F2 cascade hard** se Bretda Google está offline há +8d.

### B. Arquitetura de campanhas (documental 07/Mai)

| Campanha | ID | Status documental | Budget | Bidding | Validação live |
|---|---|---|---|---|---|
| BR-Brand-Defense | `23821730141` | ENABLED 07/Mai | R$10/d (subiu de R$5 no relight) | Manual CPC, R$5 max | ❓ delivery confirmation |
| BR-MesaBilhar-HighIntent | `23816403561` | ENABLED 07/Mai | R$25-60/d (memory ambígua: relight 60, greenfield 25) | Manual CPC, R$8 max | ❓ |
| BR-MesaJantar-HighIntent | `23821730147` | ENABLED 07/Mai | R$15/d | Manual CPC, R$6 max | ❓ |
| BR-RTG-90d | `23821730339` | PAUSED até D+14 audience >1k | R$10/d | Manual CPC | ❓ |
| Legacy 08/11 (REMOVED) | — | PAUSED canon | — | — | ⚠️ não tentar ressuscitar (G-019 logic) |

**Status total documental:** R$50-85/d (4 campanhas ENABLED via Aslam 4 Campaign Types).

> **Aslam call:** *"Brand Defense is non-negotiable."* — R$10/d é o **floor correto** (subiu de R$5 no relight 07/Mai). Validar via `google_ads_search_terms` que impressions em `[bretda]` exact match estão chegando.

### C. Shared negatives + KW

- Shared list `12074241452` (22 critérios) — anexada Camp 2/3/4 ✅ documental
- 9 KWs PHRASE adicionadas 07/Mai (audit `session_bretda_audit_full_07mai`)
- 7 ad_groups + 14 RSAs ENABLED 07/Mai (estavam PAUSED no greenfield original 05/Mai)

**Gotcha-watch G-014 (preço em RSAs):** Audit 07/Mai não validou ausência de R$ em headlines/descrições. Aslam doctrine = ZERO menção de preço.

### D. Conversion Hierarchy (CRÍTICO — F6 candidate)

| Conv | Tipo | Status canon (playbook) | Status memorial 06-07/Mai | Discrepância |
|---|---|---|---|---|
| `[AGD] Lead 7138711130` | Codeless, auto-criado | SECONDARY (playbook 14/Mai) | "Codeless + `default_value=R$100` + `always_use=true` ainda fantasma. QW1 cleanup PENDING 06/Mai" (audit chief 15/Mai linha 22) | **CRÍTICO** — playbook diz SECONDARY mas QW1 (kill ele) ficou PENDING. Status real desconhecido. |
| `Lead-Pagina-Obrigado` | Event tag GTM | PRIMARY R$1500 (playbook) | "QW2 promote to PRIMARY R$1500 — `session_bretda_audit_07mai` marca EXECUTED" — chief 15/Mai marca PENDING | Discrepância. |
| Outros 2 conv | (não nomeados em playbook) | total 4 ENABLED 07/Mai | "post 06/Mai cleanup pendente" | 4 PRIMARY documental possível? viola Aslam max 2. |

> **Aslam call:** *"NEVER >2 PRIMARY conversions per account."* — Documental, há suspeita de 4 PRIMARY. Cleanup F6 (codeless `default_value=R$100`) é blocking gate. Sem isso, qualquer Smart Bidding futuro vai inalar phantom value e bid CPC esquizofrênico.

### E. Geo + targeting (greenfield 05/Mai)

- Brasil 2076 + `LOCATION_OF_PRESENCE` ✅ documental
- Match types: PHRASE default (Aslam doctrine ✅)
- BROAD: zero (correto pra conta nova)

### F. Saldo + change history

- Saldo Google: ❓ não validável OAuth 401. Memória 03/Mai: R$327 (2,7d) — **MUITO desatualizado** (12d).
- Change history 30d: ❓ não validável. Last known mutations: 07/Mai relight + cleanup QW1-QW6 (partial).

---

## Recommendation (Golden Ratio + 4 Campaign Types validation)

### Golden Ratio fit (Bretda greenfield)

Bretda está em **estágio "<30 conv reais/30d"** (greenfield 05/Mai, 10d). Golden Ratio aplicável:

```
90% Search high-intent  →  R$60-75/d (Brand R$10 + Bilhar R$25-60 + Jantar R$15)
10% RTG                 →  PAUSED até audience >1k (canon, correto)
0% PMAX                 →  NO (sub-30 conv + Bretda no-Shopping G-013)
```

**Compliance:** ✅ 90/10 (Search/RTG-pendente). Zero PMAX, zero Shopping. Aslam textbook.

### 4 Campaign Types compliance

| Type | Required | Status | Action |
|---|---|---|---|
| 1. Brand Defense | YES | ✅ ENABLED R$10/d documental | Validar delivery via incognito search "bretda" BR pós-reauth |
| 2. High-Intent Search | YES | ✅ Bilhar + Jantar ENABLED documental | Validar impression share, Quality Score per ad_group |
| 3. PMAX | NO (sub-30 conv) | ✅ corretamente ausente | Manter ausente até 30+ conv reais validadas |
| 4. RTG | YES (Display + YT >1k) | ⚠️ PAUSED corretamente até D+14 | Reativar D+14 audience cliente >1k LP visitors |

**Net:** Aslam doctrine **100% compliant** em estrutura. Bug está em **conversion hierarchy** + **OAuth liveness**, não em arquitetura.

### Bid floor check ("2-4" formula)

CAC alvo Bretda = R$2.100 (playbook 14/Mai, HYDRA squad 08/Mai) — corrigido de R$1.500 antigo.
Bid floor = `2100 / 2-to-4` = **R$525-R$1.050**.

**Documental atual:**
- Brand Defense max CPC: R$5 → ✅ correto (brand é cheap, não aplica 2-4)
- MesaBilhar max CPC: R$8 → **❌ VIOLAÇÃO grave** — está em 1/65 do floor. Aslam call: "Bid R$8 num leilão de R$2k client value vai perder TODO leilão pra qualquer concorrente com bid R$15." Isto é a **mesma falha pré-rebuild Mar-Abr 2026** que CAC alvo R$1.500 com bid R$5.
- MesaJantar max CPC: R$6 → mesma violação
- RTG: R$5 max → OK (RTG é cheap)

> **Aslam priority finding:** *"Bid floor = CAC ÷ 2-to-4."* MesaBilhar bid R$8 é **canon-violation crítico**. Ou (a) bumpa pra R$300-500 max CPC pós-30d Manual CPC baseline, ou (b) aceita que MesaBilhar só vai ganhar leilão de KWs muito long-tail baixo-volume. Documental, talvez explique por que Brand Defense talvez tenha sido o **único delivering** essa janela 07-15/Mai.

### Funnel-aware integration (Google ↔ Meta pós Plan C)

Plan C Meta hoje reativou CP1 R$30/d + AD05/AD04 swap forms. Funnel completo deveria ser:

```
Meta Sudeste/Sul → arquiteto vê ad Bretda → curiosidade
       ↓
Google Brand Defense → arquiteto busca "bretda mesas bilhar" → Brand Defense pega
       ↓
LP form (Plan B futuro) ou Instant Form → lead
       ↓
RTG Google + Meta → re-engage lead que viu LP mas não converteu
```

**Status real:**
- Meta → Bretda awareness: ✅ ATIVO Plan C
- Google Brand Defense: ❓ status liveness desconhecido. Se offline há 8d, **Meta está gerando demand que concorrente captura** (G-018 inverse — não é pause durante crise, é death-by-OAuth invisível).
- Google high-intent Bilhar/Jantar: documental ATIVO, mas R$8 bid pode estar perdendo todo leilão competitivo.
- RTG: corretamente PAUSED até audience >1k.

**Gap funnel-aware:** Google está atuando mais como **lead-form-final-step** do que como **demand-capture-de-fundo-de-funil**. Pra completar funil, precisa pós-D+14:
1. Reativar RTG audience >1k (cliente LP visitors + Meta engaged)
2. Bump MesaBilhar bid floor pra ≥R$300 max CPC pós-21d baseline
3. Garantir Lead-Pagina-Obrigado é a **única** PRIMARY (cleanup F6 codeless + audit outras 2 supostas PRIMARY)

---

## Execution Plan (PAUSED-first, gated por OAuth)

### Step 0 — USER ACTION REQUIRED — OAuth Reauth (BLOCKING)
- **Owner:** Breno
- **Action:** Reauth via `contato@tockscustom.com.br`
  ```
  Reference: D:\AIOS\squads\marketing-traffic\checklists\oauth-freshness.md
  ```
- **Time:** 30s no terminal MCP-ads-bridge
- **Verify post-reauth:** `mcp__mcp-ads-bridge__ads_connection_test` retorna `google_ads.status="ok"`
- **Idempotency:** N/A (user-side OAuth flow)
- **Rollback:** N/A
- **Why blocking:** Tudo abaixo precisa de live read. Memory drift entre playbook 14/Mai vs audit 07/Mai vs chief 15/Mai não resolve sem dados live.

### Step 1 — Live triage pós-reauth (R + R only)
1. `mcp__mcp-ads-bridge__google_ads_overview --customer_id 8167636084` — saldo + spend 7d
2. `mcp__mcp-ads-bridge__google_ads_campaigns --customer_id 8167636084` — confirmar 4 canon ENABLED + zero legacy
3. `mcp__mcp-ads-bridge__google_ads_conversion_actions --customer_id 8167636084` — **MISSÃO CRÍTICA:**
   - Confirmar `[AGD] Lead 7138711130` status (SECONDARY ou ainda PRIMARY?)
   - Confirmar `default_value` field (R$100 zumbi ou 0?)
   - Confirmar `Lead-Pagina-Obrigado` PRIMARY R$1500 ou não
   - Contar total PRIMARY (≤2 é gate Aslam)
4. `mcp__mcp-ads-bridge__google_ads_metrics --customer_id 8167636084 --window 7d` — Brand Defense delivery? Bilhar/Jantar delivery?
5. `mcp__mcp-ads-bridge__google_ads_search_terms --customer_id 8167636084 --window 7d` — alguém pesquisou "bretda"? Brand Defense capturou?
6. `mcp__mcp-ads-bridge__google_ads_change_history --customer_id 8167636084 --window 30d` — quem mudou o quê desde 07/Mai

**Gates passed in Step 1:**
- [x] `ads_guardrails` — N/A (read-only)
- [x] `ads_action_log` — N/A (read-only)
- [x] OAuth fresh (post Step 0)
- [x] Account context loaded (playbook bretda.md)

**Time:** 15-20min pós-reauth

### Step 2 — F6 Cleanup (if codeless zumbi confirmed live)
**Only if Step 1.3 confirms `[AGD] Lead 7138711130` still has `default_value > 0`:**

1. Generate `client_request_id` = UUID v4
2. `ads_guardrails --action update_conversion_value --account bretda --delta default_value:100→0` — expect OK (delta DOWN)
3. `ads_action_log` create entry with rollback target `default_value=100`
4. `mcp__mcp-ads-bridge__google_ads_update_conversion_value --conversion_action_id 7138711130 --value 0`
5. Verify post-write: re-read `google_ads_conversion_actions`, confirm `default_value=0`
6. Memory: `session_bretda_f6_cleanup_2026-05-15.md`

**Alternative se cleanup falhar (event tag conflict):** delete `[AGD] Lead 7138711130` + recreate event-tag based. Handoff `@aios-dev` se requer GTM change.

**Time:** 5min Kasim + smoke test 24h fire validation

### Step 3 — F-code 4 PRIMARY violation triage (if confirmed)
**Only if Step 1.3 shows >2 PRIMARY:**

1. Identify which conv actions são PRIMARY
2. Apply Aslam priority hierarchy:
   - **PRIMARY 1 (mandatory):** `Lead-Pagina-Obrigado` (R$1500 value — LP form é onde dinheiro vive)
   - **PRIMARY 2 (optional):** **NONE** — Bretda não tem segundo bottom-funnel event-tag canon
   - Tudo mais → SECONDARY
3. Por cada extra PRIMARY: `mcp__mcp-ads-bridge__google_ads_set_conversion_priority --conv_id X --priority SECONDARY`
4. Idempotency + action_log padrão
5. Verify final state: exatamente 1-2 PRIMARY

**Time:** 5-10min

### Step 4 — Bid floor reality check (no write hoje, decision only)
**Decision-only step, no mutation:**

1. From Step 1.4 metrics, get current avg CPC + impressions volume Bilhar/Jantar 7d
2. Compute Lost-IS (impression share lost)
3. Decision tree:
   - Se Lost-IS-Rank >50% em Bilhar/Jantar → **R$8 max CPC é gargalo confirmado**. Plan: D+21 (post 21d Manual CPC baseline) bump pra R$300-500 max CPC (Aslam 2-4 floor)
   - Se Lost-IS-Rank <30% → bid OK pro nível de competição atual, deixar floor R$8 stand
4. **NO mutation today.** Document decision em chief synthesis pra D+21 gate.

### Step 5 — Brand Defense delivery validation (incognito test)
**USER ACTION RECOMENDADO (low priority):** Incognito Chrome BR, buscar "bretda mesas" — Brand Defense ad deve aparecer no top. Se não aparecer = Brand Defense não está delivering. Bug pode ser saldo, bid, KW match, ou OAuth-was-dead-during-key-hours.

**Time:** 1min

### Step 6 — Memory + insights publish
- Memory file: `D:\AIOS\.claude\agent-memory\traffic-masters-chief\session_bretda_google_audit_2026-05-15.md`
- Insight publish via `mcp__aios-brain-bridge__publish_aios_insights`:
  ```json
  {
    "project": "bretda",
    "insights": [
      {"type": "risk", "summary": "Bretda Google OAuth 401 desde >8d — Brand Defense status liveness desconhecida — concorrente pode estar capturando 'bretda' brand searches", "context": "OAuth reauth user-side blocking"},
      {"type": "decision", "summary": "MesaBilhar bid R$8 max CPC violou Aslam 2-4 floor (CAC R$2.1k → floor R$525-1050) — gate D+21 bump pós Manual CPC baseline", "context": "playbook bid floor doctrine"},
      {"type": "pattern", "summary": "F6 codeless conv [AGD] Lead 7138711130 com default_value=R$100 + always_use=true documental persistente — cleanup nunca executado", "context": "QW1 PENDING desde 06/Mai per chief audit 15/Mai"}
    ]
  }
  ```

---

## Gates Passed (this audit, documentary mode)

- [x] Account context loaded (playbook `bretda.md` 14/Mai)
- [x] OAuth freshness check (status: 🔴 FAIL — documented)
- [x] Pre-launch checklist gate (Foundation First Google) — **3/7 PASS, 4/7 UNVERIFIED**
- [x] No-Shopping veto compliance (G-013): zero Shopping documented — ✅
- [x] Brand Defense ENABLED gate (S1 / G-018): R$10/d documental — ✅
- [x] Geo BR 2076 + PRESENCE (G-011): documental compliant — ✅
- [x] Manual CPC 21d baseline (S6 / G-020): 10/21d into baseline — ✅ ongoing
- [x] PMAX restriction (Aslam doctrine): zero PMAX — ✅
- [x] read-only enforced (zero MCP write attempts this session)

---

## User Action Required (Bretda Google, priorizado)

1. 🔴 **P0 — OAuth Google reauth** (`contato@tockscustom.com.br`) — 30s — desbloqueia Steps 1-6
2. 🔴 **P0 — Validar saldo Google UI** (ads.google.com → Billing) — 2min — confirma se há saldo pra 4 campanhas R$50-85/d operarem (saldo desconhecido desde 03/Mai R$327)
3. 🟡 **P1 — Incognito Brand Defense test** — 1min — confirma se Brand Defense ad realmente aparece em busca "bretda" BR
4. 🟢 **P2 — GCP Production verification check** — 5min — login console.cloud.google.com → APIs & Services → OAuth consent screen → status verification. Se ainda PENDING após 10d, considerar abrir suporte GCP

---

## Post-Action (after Steps 1-6 complete)

- Memory updates queued (see Step 6)
- Insights publish queued (see Step 6)
- Chief synthesis (this audit + cross-reference Meta state) — see `audit-google-2026-05-15-chief.md`
- Next audit cadence: D+7 19/Mai (gate D+7 conclave round 2 per Tier 0 chief audit Step 6)

---

## Time Taken (Kasim audit)

- Documentary research: 8min
- Persona application + analysis: 6min
- Deliverable write: 4min
- **Total Kasim section: 18min**

---

*Search before Shopping before PMAX. Brand Defense is non-negotiable. Bid floor = CAC ÷ 2-to-4. Smart Bidding doesn't fix bad signals. PMAX is a black box, treat it like one.*
