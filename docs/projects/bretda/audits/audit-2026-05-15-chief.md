# Bretda — Account Audit — 2026-05-15 — Traffic Masters Chief (Tier 0 via Molly Pittman)

> **Run context:** First end-to-end production run of consolidated `marketing-traffic` squad. MCP-ads-bridge **CONNECTED LIVE** (64 tools). Google 401 OAuth expired (operating Meta-live + Google documentary). Monthly periodic audit, time_window=7d.

---

## TL;DR

- **Foundation First — Meta:** PASS (pixel `3348133485496539` last fire 14/Mai 16:46 BRT, 27 leads/7d via CJ8v2).
- **Foundation First — Google:** **UNVERIFIED — OAuth 401 EXPIRED** (G-002 / F2 HIT). Reauth blocker antes de qualquer audit Google.
- **Traffic Engine score:** **9/18** (estado documental + Meta live) → **DEEP-AUDIT / TARGETED-FIX**.
- **Verdict:** `HOLD METHODICAL` — Plano B 14/Mai (LP form de verdade) **AINDA NÃO EXECUTADO**, OAuth Google é blocker imediato, AD05 mono-hero 95% spend continua, RTG-WARM adset ACTIVE com audience FAILED é leak. Re-route ordem específica abaixo, **read-only confirmed**.

---

## Foundation First Check (per gate, com source)

| # | Gate | Status | Source / Evidence |
|---|------|--------|-------------------|
| 1 | Pixel attached + last fire <24h (Meta) | ✅ PASS | `meta_ads_pixel_check` live 15/Mai: pixel `3348133485496539` "Pixel Oficial Bretda" last_fired 2026-05-14 16:46 BRT (~22h pré-audit), `is_unavailable: false` |
| 2 | CAPI 7d signal (Meta) | ⚠️ PARTIAL | Caminho A LIVE 30/Abr ✅ (PageView LGPD híbrido). Caminho B **code ready desde 23/Abr, NUNCA deployed** — System User Token Meta BM nunca gerado (5min user action pendente, ver `project_bretda_lp_pixel_fix_30abr`). Match Pixel: `offsite_conversion.fb_pixel_lead = 1` em 30d de 157 leads totais → **0,6% match** (vs 0,7% em 07/Mai). Sintoma estrutural Instant Form, não falha técnica. |
| 3 | PRIMARY conversion firing 7d (Google) | ❓ UNVERIFIED | OAuth 401 — não pôde validar. Documental (07/Mai): 4 conv ENABLED, mas zumbi codeless `[AGD] Lead 7138711130` com `default_value=R$100 + always_use=true` ainda fantasma. Memória 06/Mai diz QW1 cleanup PENDING. |
| 4 | No codeless conv bug (F6 / G-006) | ❓ UNVERIFIED | Mesmo de #3 — não validável sem reauth. Documental: HIT confirmado 07/Mai. |
| 5 | Saldo runway >5d | ❓ UNVERIFIED | Token Meta BM Bretda não tem `business_management` permission (G feedback `feedback_meta_su_app_role_fix`), MCP retorna sem `display_string`. Google saldo idem (401). User UI manual obrigatório. Memória 03/Mai: R$327 (2,7d) — desatualizado. |
| 6 | LP conversion ≥1.5% (cold) | ❌ FAIL | 30d audit 07/Mai: 75 LPV → 1 `onsite_web_lead` = **1,3% LP→lead** (abaixo do gate 1,5%). 12/Mai discovery: irrelevante porque 147/148 leads vão por Instant Form e nunca veem a LP. |
| 7 | Offer + funnel READY | ⚠️ PARTIAL | LP `bretda.com.br` v2 LIVE com configurador 3D, mas **ZERO ad ativo direciona pra LP form de verdade** — todos AD03/04/05 são Instant Form (`destination_type=ON_AD`). |

**Net Foundation:** **1/7 PASS + 1 PARTIAL + 3 UNVERIFIED + 2 FAIL/PARTIAL** → block scaling, OK pra manter R$60/d Meta atual em diagnostic mode até OAuth Google + Plano B 14/Mai.

---

## Traffic Engine — 9-Step Gap Analysis (0=missing / 1=partial / 2=complete)

| # | Step | Score | Finding |
|---|------|-------|---------|
| 1 | Customer Journey defined | 2 | Playbook canon 14/Mai documentado em `squads/marketing-traffic/data/account-playbooks/bretda.md`. Aware (Meta) → Engage (form/LP) → Convert (WhatsApp + form Sales AI). |
| 2 | Conversion Goal singular | 1 | Meta: `lead` único (OK). Google: 4 conv ENABLED, **2 PRIMARY post 07/Mai** (Lead-Pagina-Obrigado promoted + [AGD] Lead codeless zumbi NÃO pausado) → viola "max 2 PRIMARY" mas dentro do limite. Cleanup pendente. |
| 3 | Audience identified | 1 | CJ8v2 ATIVO usa work_positions arquitetos (5 IDs) + industries Arch&Eng — claro. **MAS RTG-WARM adset ACTIVE (`120244496926970737`, R$55/d) usa audience `120244118776810737` "LAL 1% Eng IG"** que audit 07/Mai marcou **FAILED** + recomendou DELETE (QW6). Audience zombie em produção. |
| 4 | Traffic Source chosen | 2 | Meta + Google estabelecidos há meses. Sem channel-jumping. |
| 5 | Ad crafted (Hook-Story-Offer-CTA) | 1 | **F8 SINGLE HERO domination viva**: AD05 = **95,1% spend 7d** (R$591,76 de R$622,03), 26/27 leads (96,3%). AD03 1 lead R$22,60, AD04 ZERO leads em 7d. Sem rotação real. CTR AD05 2,23% / freq 1,28 (ainda fresh, mas concentração extrema). |
| 6 | Funnel built | 0 | **G-003 / F3 CRÍTICO**: 100% dos ACTIVE ads = Instant Form. Plano B 14/Mai (criar AD LP `destination_type=WEBSITE`) **NÃO EXECUTADO**. Funnel-Aware Traffic violado: pixel LP cego porque tráfego bypassa LP. |
| 7 | Tracking everything | 1 | Pixel ✅ + Caminho A ✅. CAPI B **code-ready 14 dias sem deploy** — só falta System User Token user-side (~5min). Sales AI deployed 05/Mai (desbloqueia Google ECL). GTM tag validation pendente Google (não validável OAuth 401). |
| 8 | Optimizing on data | 1 | Restore Híbrido C 12/Mai correto (budget +344% rollback para R$60/d, geo refocado Sudeste+Sul). Mas decisão "manter Plano B 14/Mai" não foi cumprida — atrasou 1d. Sem sales feedback spreadsheet (Neil clone S8 pendente 7d). |
| 9 | Scaling strategically | 0 | F4 (budget jump 28/Abr R$27→R$120) **lição aprendida** mas falta budget circuit breaker formal. Brand Defense Google R$10/d documental ENABLED, **status indeterminável OAuth 401**. |

**Score: 9/18** — segundo task spec, <12 = systemic gap. Não rebuild (>8), mas **deep-audit pós-OAuth** + Plano B execute.

---

## Gotcha Hits (severity ≥ medium)

| ID | Gotcha | Hit Status | Evidence |
|----|--------|-----------|----------|
| G-002 | OAuth re-auth required (Google) | 🔴 ACTIVE | `ads_connection_test` 15/Mai 14:04 UTC: `google_ads.status="error" UNAUTHENTICATED 401`. Última reauth 07/Mai (8d, dentro de ~30d expiry) — token Production verification ainda pending GCP. |
| G-003 | Instant Form vs LP form trap | 🔴 ACTIVE | Confirmado 12/Mai memory. Audit live: AD03/04/05 todos `link_url` cosmético ou vazio, destinations ON_AD. Plano B 14/Mai não criou ad LP form. |
| G-004 | Budget jump destroyed learning | 🟡 RECOVERED | 12/Mai rollback R$120 → R$60/d. 14d limbo recovery in progress (D+3 de 14). |
| G-006 | Codeless conv bug | 🔴 LIKELY ACTIVE | Documental: `[AGD] Lead 7138711130` codeless + `default_value=R$100 + always_use=true` ainda ENABLED per memory 07/Mai. QW1 cleanup pendente. **Não validável OAuth 401.** |
| G-008 | Single hero ad domination | 🔴 ACTIVE | AD05 95,1% spend 7d — gate é >70% sustained 7d+. **HIT severo.** CPL R$22,76 em AD05 vs adset médio R$23,04 → não é falha de qualidade, é mono-creative. |
| G-011 | Geo Brasil sem PRESENCE | ✅ COMPLIANT | CJ8v2: `location_types=[home,recent]` ✅, regiões SP/RJ/MG/ES/PR/SC/RS (7 estados Sudeste+Sul). |
| G-013 | Shopping/Merchant proibido | ✅ COMPLIANT | Zero Shopping ativos. |
| G-016 | Spend cap display_string truth | ⚠️ UNVERIFIED | Token sem `business_management` bloqueia leitura. |
| G-017 | LAL base = Compradores 180d | 🔴 ACTIVE | RTG-WARM adset usa LAL **"Engajamento IG 365d"** (não Compradores) — Pedro Sobral doctrine violation. Memória diz LAL "Leads Form 90d" também usada — leads (não buyers). |

---

## F-pattern Hits (failure modes)

| # | Pattern | Status | Detail |
|---|---------|--------|--------|
| F2 | OAuth expired | 🔴 LIVE | Google 401 — token expirado/revogado/verification pending. |
| F3 | Instant Form trap | 🔴 PERSISTENT | Plano B 14/Mai não executou. Mesma config 7d. |
| F4 | Budget jump destruction | 🟡 RECOVERING | D+3 de 14d limbo (rollback 12/Mai). |
| F6 | Codeless conv default_value bug | 🟡 LIKELY PERSISTENT | Documental — cleanup never executed per memory. |
| F8 | Single hero domination | 🔴 LIVE | AD05 95,1% — pior nível registrado. |
| F9 | Audience overlap | 🟡 LATENT | RTG-WARM adset ACTIVE com audience "LAL 1% Eng IG" — mesmo público que CJ8v2 toca (arquitetos via flexible_spec já se sobrepõe a engajamento IG). Não materializou em delivery (R$0 RTG-WARM 7d) mas configuração existe. |
| S6 | Manual CPC 21d baseline | ✅ HONORED | Google docs 05/Mai: greenfield manual CPC, 21d antes Smart Bidding. |

---

## Cross-Platform Observations (Google ↔ Meta coordination)

1. **Google offline desde quando?** Não pude detectar via API (OAuth fail). Diário 07-15/Mai: 8 dias com OAuth válido — mas token podia ter expirado anywhere após 07. Tentativa de read único 401 = inferência: **token expirou >24h atrás**. Brand-Defense (R$10/d) ENABLED documental — sem confirmação delivery, sem confirmação Google está realmente gastando. Pode ser que Bretda Google está **silenciosamente OFFLINE há vários dias**. Risk: zero "Brand-Defense LAST" (G-018) protection se concorrente bidar em "bretda".
2. **Coordenação meta-LP form pixel**: Caminho B CAPI nunca veio LIVE, então mesmo se Plano B 14/Mai criar LP form, atribuição server-side não vai melhorar até user gerar System User Token. 5min user action **resolve 2 dependências** (Plano B funcionar + Brand-Defense Google credible signal pós-OAuth).
3. **Sales feedback spreadsheet (Neil clone S8)** prometida D+1 do conclave 07/Mai (08/Mai) — **NÃO existe**. Sem ela, decisão D+7 14/Mai (CPL real sobre fechamento) é impossível.
4. **Caça-leads paralelos**: CJ8v2 R$60/d = R$420/sem = R$1.680/mês com 4 leads/dia média 14/Mai. CAC tetto playbook R$2.100. Operando dentro do orçamento, mas com 5% close rate típico Instant Form = 20% sob CAC → 5,4 dos 27 leads/7d viram client = 1 mesa R$3-8k/sem nominal. Margem zero se CAC real for >R$1.500. **Sales spreadsheet é o desbloqueador único** dessa decisão.

---

## Recommended Tier 1 Handoff Sequence

> Ordem importa. Cada step desbloqueia o próximo. Tudo PAUSED-first / read-first até Step 0 user-side.

### Step 0 — USER ACTION REQUIRED (P0 BLOCKING)
- **0a [OAuth]:** Reauth Google Ads via `contato@tockscustom.com.br`. 30s no terminal. Reference `D:\AIOS\squads\marketing-traffic\checklists\oauth-freshness.md`.
- **0b [CAPI Token]:** Gerar System User Token em business.facebook.com → BM Bretda → Configurações → Usuários do sistema → Admin → Atribuir Pixel `3348133485496539` permissão "Gerenciar" → token escopo `ads_management`. ~3min.
- **0c [Saldo Recharge]:** PIX Meta saldo (validar `display_string` UI Ads Manager antes — não cego). Google: validar UI ads.google.com → Billing.

### Step 1 — Google Audit pós-reauth (@kasim-aslam)
- Task: `D:\AIOS\squads\marketing-traffic\tasks\account-audit.md` (re-run Google branch)
- Specific: verify QW1 (kill [AGD] Lead 7138711130) PENDING, verify QW2 (Lead-Pagina-Obrigado primary R$1500) PENDING, validar 4 campanhas greenfield delivery, validar Brand Defense really firing (incognito "bretda" search BR).
- ETA: 20min pós-OAuth.

### Step 2 — Plano B execução (@depesh-mandalia + chief)
- Task: `D:\AIOS\squads\marketing-traffic\tasks\meta-instant-form-vs-lp.md`
- Outcome: Criar AD LP form de verdade (`destination_type=WEBSITE` Aurora) em novo adset isolado CJ-AURORA-ISO R$10/d Sudeste, NÃO mexer em CJ8v2 — mantém volume baseline.
- Pré-req hard: 0b done (CAPI B deploy) para sinal post-click contar.
- ETA: 30min pós-Step 0b.

### Step 3 — Sales feedback spreadsheet (@pedro-sobral via Neil-clone S8 pattern)
- Use `mcp__mcp-ads-bridge__google_sheets_create` para template 5 colunas: `lead_source / date / replied / qualified / quoted`.
- Backfill 30d Meta leads (157 leads). User preenche manual com WhatsApp inbox.
- Reference: `D:\AIOS\squads\marketing-traffic\data\brazil-attribution-patterns.md` Pedro Sobral doctrine.
- ETA: 15min setup, 2-3h user fill.

### Step 4 — Creative refresh AD05 dethrone (@ralph-burns Sprint 3 — ainda não live)
- F8 fix: deploy 3-2-1 Ad Test (3 hooks × 2 angles × 1 offer) novos creatives em CJ8v2.
- Pré-req: aguardar Sprint 3 ship (per activator Section 9) OU executar manual com chief routing direto.
- ETA D+14: gate 29/Mai pós-baseline 14d.

### Step 5 — Audience cleanup (@depesh-mandalia)
- DELETE audience `120244118776810737` (LAL 1% Eng IG — FAILED). Verify `120244500855530737` + `120244500845820737` (LAL Leads Form 90d) prontas para uso futuro.
- PAUSE CJ-RTG-WARM-LAL-1%-Eng-IG adset (`120244496926970737`) — overlap latente F9.
- ETA: 5min.

### Step 6 — D+7 Gate (chief synthesis 19/Mai)
- Conclave round 2 com Neil/Larry/Peep para decisão Meta scaling/maintain/kill.
- Pré-req: Steps 0-5 done + 7d sales feedback data.
- Outcome: decide scaling decision baseado em close rate real (não CPL Meta).

---

## Gates Pre-Flagged (que Tier 1 vai bater)

| Gate | Quando | Como clarear |
|------|--------|--------------|
| OAuth freshness (Google) | Step 1 first call | Reauth Step 0a |
| Pre-launch checklist Meta | Step 2 LP form ad | `pre-launch-meta.md` — pixel ✅, CAPI B obrigatório (Step 0b) |
| Destination type validation (G-003) | Step 2 ad creation | API check `destination_type` post-create antes ENABLED |
| Budget +20%/d preferred (G-004) | Step 2 new adset R$10/d | Dentro do limit (novo, no baseline anterior) |
| Idempotency UUID v4 | Steps 1, 2, 5 writes | Specialist gera per write op |
| Saga rollback | Step 2 (multi-step: upload image → create adset → create ad) | Specialist patrol |
| Brand Defense always-on (G-018) | Step 1 audit | Verify Google Brand Defense delivery — NOT pause em crise |

---

## USER ACTION REQUIRED (priorizado)

1. 🔴 **OAuth Google reauth** (`contato@tockscustom.com.br`) — 30s — desbloqueia Steps 1, 4 (recommendations), 6.
2. 🔴 **Generate Meta System User Token** (BM Bretda → Pixel `3348133485496539`) — 3min — desbloqueia Step 0b CAPI B → Step 2 viabilidade.
3. 🟡 **PIX Meta + validar saldo Google UI** — ~5min — desbloqueia decisão "scale vs maintain vs cut".
4. 🟡 **Confirmar AD05 link_url status real** (screenshot UI Ads Manager) — 2min — resolve ambiguidade documental memory 07/Mai.

---

## Open Questions for Breno (max 3)

1. **Plano B 14/Mai ficou pra trás de propósito** ou foi esquecido? Reagendamos pra hoje (15/Mai) após você liberar System User Token Meta, ou esperamos algo (ex: foto Aurora high-res)?
2. **Sales feedback spreadsheet** — você quer que o squad crie o template + backfill via `google_sheets_create` agora, ou prefere planilha própria (formato + onde ela vive)?
3. **Decisão D+7 19/Mai**: meta de close rate sobre Instant Form que vira GO em "scale Meta para R$120/d com creative refresh" vs HOLD em R$60/d? Sugestão: ≥3% close rate dos 27 leads/7d → GO scale; <2% → kill Instant Form definitivo, só LP form.

---

## Live Data Snapshot (Meta 7d, 8-14/Mai)

- **Account:** `act_381618241134624` (Bretda), 35 campanhas, 1 ACTIVE delivering
- **Spend:** R$622,03 / 27 leads / **CPL R$23,04** / freq 1,29 / CTR 2,23% / CPM R$43,61
- **Adset único entregando:** CJ8v2 (`120237168468370737`) — R$60/d, Sudeste+Sul, arquitetos+interior designers, iOS, LOWEST_COST_WITHOUT_CAP, LEAD_GENERATION
- **AD05 (`120244164995160737`)** = 95,1% spend, 96,3% leads. AD03 (1 lead R$22,60), AD04 (0 leads em 7d).
- **Pixel:** `3348133485496539` last fire 14/Mai 16:46 BRT
- **Action breakdown 30d:** 157 lead-grouped + 1 fb_pixel_lead (0,6% match Pixel → Meta) + 81 LPV + 1 onsite_web_lead. **Same structural Instant Form bypass.**

---

## Memory + Insights Updates

- Memory queued: `session_bretda_audit_2026-05-15.md` (this audit)
- Insight publish queued (via `mcp__aios-brain-bridge__publish_aios_insights`): type=pattern, summary="Bretda Plano B 14/Mai não executado, Google OAuth expired, AD05 95% spend persiste F8", context=[OAuth blocker, CAPI Token blocker, Plano B reschedule]

---

*Foundation First. Funnel-Aware Traffic. Brand-Defense LAST. Brasil 2076 PRESENCE Sudeste+Sul. Mesa real intocável.*
