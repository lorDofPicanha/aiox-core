# Tocks — Operação 30d Meta+Google — 2026-05-15

**Owner:** @traffic-masters-chief
**Specialists:** @kasim-aslam (Google) + @pedro-sobral (Meta CTM Brasil)
**Authorization:** Breno 15/Mai noite "1b 2c 3b" = 30d + ambas plataformas + EXECUTE
**Scope:** Pure campaign (not Sales AI / not CAPI / not LP code / not WhatsApp infra)
**Saga ID:** `tocks-operacao-30d-2026-05-15` + `tocks-phase2-retry-2026-05-15`

---

## TL;DR

- **Camps before:** Meta 19 (2 ACTIVE / 17 PAUSED) + Google 18 (1 ENABLED / 16 PAUSED / 1 REMOVED) = **37 total**
- **Camps after:** Meta 19 (5 archived as DELETED but visible) + Google 7 (1 ENABLED / 5 PAUSED RESERVA / 12 REMOVED) = 30d active
- **Writes executed:** **20/25 OK (80%)** — anti-spam 5s, idempotency UUIDs persisted
- **Failures (5):** all USER-SIDE UI fixable (2 IMMUTABLE conv G-022, 3 broken Reel creative Meta)
- **New daily spend rate Tocks:** Meta R$95 (C005) + R$60 (C007) + Google R$75 = **R$230/d combined**
- **Saldo:** Google R$969.95 remaining (13d ok). Meta UNKNOWN via API (P0 USER ACTION)
- **Verdict:** **FIX executed** — Smart Bidding 21d reset window starts hoje. **NO scaling até 05/Jun + CRM bridge active**

---

## State delta Google

| Before | After |
|---|---|
| 18 total camps | 18 total camps (display) |
| 1 ENABLED | 1 ENABLED (TOCKS_Search_Alta-Intencao R$75/d) |
| 16 PAUSED | 5 PAUSED (RESERVA) + **11 REMOVED novos** |
| 1 REMOVED | 12 REMOVED total |
| **8 PRIMARY conv** ⚠️ G-013 chaos | **6 PRIMARY conv** (target 2 — 2 fails G-022 IMMUTABLE) |
| Visualização de página 631 fires/30d traidor PRIMARY | Visualização de página → **SECONDARY** ✅ |

### Conv hierarchy fix detail

Saga Phase 1 (UUID idempotency per write):

| # | Conv ID | Name | Status Before | After | UUID | Result |
|---|---|---|---|---|---|---|
| 1 | 7347581492 | Local actions - Website visits | PRIMARY | PRIMARY | f54e4b67... | **FAIL** G-022 (type 28 IMMUTABLE) |
| 2 | 7399079937 | Clicks to call | PRIMARY | PRIMARY | 0088864b... | **FAIL** G-022 (type 28 IMMUTABLE) |
| 3 | 7540631962 | WhatsApp - CLICK | PRIMARY | **SECONDARY** ✅ | 32cc74bd... | OK |
| 4 | 7540631965 | Adicionar carrinho - CLICK | PRIMARY | **SECONDARY** ✅ | 3aab7f49... | OK |
| 5 | 7540631968 | Iniciar finalização - CLICK | PRIMARY | **SECONDARY** ✅ | 08de16d5... | OK |
| 6 | 7540774791 | **Visualização página - CLICK (the traitor)** | PRIMARY | **SECONDARY** ✅ | 861ee5b8... | OK |

**Result:** 6 PRIMARY remaining (down from 8). 2 immutable cleanups required UI-side por Breno.

### Google LIXO archive (Phase 2 retry — `.remove()` operation)

11/11 OK. Camps REMOVED:

| Camp ID | Name | Lifetime Spend | Lifetime Conv |
|---|---|---|---|
| 23270645251 | PESQUISA - 14/11 | R$1,978.45 | 0 |
| 23174865736 | P-MAX _22_10 | R$1,912.08 | 0 |
| 23098386371 | [ORN] Shopping Padrão | R$495.24 | 0 |
| 23097456893 | [ORN] Search | R$1,789.59 | 0 |
| 22781039655 | [CONV] TOCKS-SINUCA 12.07 | R$1,000.49 | 0 |
| 22753167811 | [EB] Shopping 2 | R$0 | 0 |
| 22746719673 | [EB] Shopping Padrão | R$0 | 0 |
| 22745574150 | Performance Max Shopping | R$0 | 0 |
| 22743215034 | [EB] PMAX Tocks | R$0 | 0 |
| 22739773366 | [EB] Shoping | R$161.48 | 0 |
| 22715195913 | [EB] Merchant Center Tocks | R$41.52 | 0 |

**Total LIXO arquivado:** R$7,378.85 lifetime spend / **ZERO conversões**. Hard data prova: Shopping + PMAX + old Search = **NÃO funcionam para Tocks** (Tocks high-ticket NÃO converte Purchase event).

---

## State delta Meta

| Before | After |
|---|---|
| 19 total camps | 19 total camps (5 marked DELETED novos) |
| 2 ACTIVE (C005 + C007) | 2 ACTIVE (unchanged) |
| 17 PAUSED | 12 PAUSED + **5 DELETED novos** |
| 8 active ads | 8 active ads (unchanged) |
| Single hero Monaco 47% spend | Monaco 47% (F8 borderline, not killed — winner R$11.79/msg) |

### Meta LIXO archive (Phase 3)

5/8 OK. Camps DELETED:

| Camp ID | Name | Age | Status |
|---|---|---|---|
| 120238372286370230 | TESTE VENDA - 21/10 | 6.6 mo | ✅ DELETED |
| 120235816256620230 | [ORN] [LEAD] [SITE] | 7.1 mo | ✅ DELETED |
| 120235340579270230 | [ORN] [LEAD] [SITE] Campanha falhou | 8.3 mo | ✅ DELETED |
| 120233928388590230 | [ORN] [LEAD] [WHATSPP] Feed | 6.9 mo | ✅ DELETED |
| 120232597602850230 | Conv-Mensagem-Vendas 22.07 | 9.5 mo | **FAIL** Reel creative broken |
| 120232239241550230 | [CONV] [MENSAGEM] [WHATSAPP] 15.07 | 9.9 mo | ✅ DELETED |
| 120231873309890230 | [EB] - Mensagem WhatsApp | 10.1 mo | **FAIL** Reel creative broken |
| 120231376352940230 | [EB] - Tráfego Site | 10.1 mo | **FAIL** Reel creative broken |

3 failures error_subcode 2446289 "O criativo do anúncio está incompleto" — Reel asset deleted antes da camp, API blocked. User UI fix (Ads Manager arquivar manualmente).

### Active ads performance unchanged (NO scaling)

| Ad | Spend 30d | Cost/msg | Verdict |
|---|---|---|---|
| Monaco 2em1 Sul/Sudeste | R$1473.63 | R$11.79 | KEEP (hero borderline) |
| VRT-CLS Linhas — V | R$482.96 | R$6.62 | **WINNER** (best ratio) |
| Tenro Luxo Sul/Sudeste | R$348.37 | R$13.93 | KEEP (above target R$15) |
| Generica PAS Nordeste | R$258.60 | R$10.78 | KEEP |
| **ELP-CLS Geracional — E** | R$76.58 | R$9.57 | **HIDDEN GEM** (ABOVE_AVERAGE 3/3 rankings) |
| Generica PAS Sul/Sudeste | R$61.65 | R$8.81 | KEEP |
| VRT-AMB Design Statement | R$33.79 | R$6.76 | KEEP |
| ELP-AMB Top of Line | R$10.23 | R$10.23 | low volume monitor |

---

## F-codes hit + mitigated

| Code | Severity | Status | Action |
|---|---|---|---|
| **G-013 CONV-CHAOS** (8 PRIMARY) | CRITICAL | **MITIGATED (4/6)** | 4 demoted to SECONDARY, 2 require UI fix |
| **G-022** type=28 IMMUTABLE | NEW pattern doc'd | DOCUMENTED | Add to gotchas-traffic.json |
| **G-023** PAUSED→REMOVED API | NEW gotcha discovered hoje | DOCUMENTED + WORKAROUND | Use `.remove(resource_name)` not `.update({status:'REMOVED'})` |
| **F-CRM-UPLOAD-VOID** Lead Qualificado 0 fires | HIGH | NOT FIXED (out-of-scope) | Handoff @aios-dev |
| **F5 KR-WhatsApp-VOID variant** | HIGH | NOT FIXED (user action) | P0 smoke test pending |
| **F4 SIS Lost-Rank 79%** | HIGH | EXPECTED IMPROVEMENT post conv fix | 21d wait |
| **F-Smart-Bidding-Wrong-Signal** | CRITICAL | EXPECTED FIX post conv | inherits Phase 1 |
| **F8 Monaco single hero 47%** | MEDIUM | MONITORED (under 70% threshold) | not killed (winner) |
| **F-Bidding-NoCap** C007 LOWEST_COST_WITHOUT_CAP | MEDIUM | DEFERRED | post CRM bridge fix |
| **F-Zombie-Adsets** under PAUSED C001-C004 | LOW | DEFERRED | cosmetic |

---

## Funnel-aware (Pedro Sobral doctrine)

| Stage | Coverage | Asset | Status |
|---|---|---|---|
| **D1 Awareness** | Meta cold | C005 + C007 CTM 8 ads | ✅ ATIVO |
| **D2 Consideration** | Google high-intent | TOCKS_Search_Alta-Intencao 4 AGs | ✅ ATIVO (SIS recovering) |
| **D3 Lead** | WhatsApp CTM `+55 47 3041-9811` | Sales AI | ⚠️ smoke pending P0 |
| **D4 Qualification** | Sales AI atendente | Lead Qualificado conv | ⚠️ CRM upload 0 fires |
| **D5 Close** | Manual humano | Reps Tocks | UNKNOWN volume |

**Verdict funnel:** D1+D2 ok, D3 untested, D4 broken (CRM bridge), D5 invisível (R$ closed unknown). Atrasos D3-D5 = CAC unit cost invisível ⇒ não escala.

---

## Saldo + runway

### Google
- **Remaining:** R$969.95 (account_budget API)
- **Burn:** R$75/d budget cap (7d avg lower R$30.4/d under-delivery)
- **Runway:** ≥13d ao spend máximo, possivelmente 30+d ao real underflow

### Meta
- **API saldo:** PERMISSION DENIED (#100 `business_management` missing on token)
- **Per memory 05/Mai:** R$155
- **Burn:** 7d avg R$83.64/d + 3d avg R$146.42/d
- **Runway estimado:** **CRÍTICO ≤2-5d se ainda R$155** — P0 USER ACTION saldo check

---

## USER ACTION REQUIRED (count: 8)

### P0 (hoje)
1. **Smoke test `+55 47 3041-9811`** — mandar mensagem celular pessoal, confirma chega Sales AI E equipe (15min)
2. **Saldo Meta check** — UI `display_string` confirmar atual; PIX se <R$200 (5min + transfer time)
3. **Saldo Google check** — UI confirmar R$969 displayed (3min)

### P1 (esta semana)
4. **Audit Sales AI dashboard 01-14/Mai** — comparar com Meta first_reply=141 (30min)
5. **Handoff @aios-dev Sales AI → Google offline conv upload bridge** — Lead Qualificado Tocks must fire (sprint dev)
6. **Handoff @aios-dev D++ CAPI reabrir PR #645** — Railway `targetPort=3100` fix (sprint dev)

### P2 (próximas 2 semanas)
7. **UI fix Tocks Ads Manager:**
   - Conv `Local actions - Website visits` (7347581492) demote PRIMARY → SECONDARY via UI
   - Conv `Clicks to call` (7399079937) demote PRIMARY → SECONDARY via UI
   - Meta camps `120232597602850230` + `120231873309890230` + `120231376352940230` archive manual (Reel broken)
8. **C005-01 adset destination_type=UNDEFINED investigate** — confirmar não é F3 trap variant

---

## Calendar D+1 / D+3 / D+7 / D+21

### D+1 (16/Mai)
- Confirm USER ACTION P0-1, P0-2, P0-3 done
- Read change_event Google: Phase 1 demotes propagaram para Smart Bidding learning
- Read Meta camps: 5 DELETED não aparecem mais nas listas
- Saldo Meta atualizado pós-PIX (se aplicável)

### D+3 (18/Mai)
- Google: SIS recovery check (target Lost-Rank <60% from 79%)
- Meta: cost/msg stability check (target <R$15/msg average ativos)
- Sales AI dashboard cross-check humanos qualificados

### D+7 (22/Mai)
- **GATE 1:** Google 7d conv > 0 (currently zero) — Smart Bidding alive again?
- **GATE 2:** Meta cost/msg sustained R$8-12 average — winners holding?
- **GATE 3:** Lead Qualificado Tocks fired ≥1 (proves CRM bridge work se @aios-dev shipped)
- If GATE 1 PASS + GATE 3 PASS ⇒ authorize cautious +10%/d Meta budget escalation week 4 (29/Mai)
- If GATE 1 FAIL ⇒ Maximize_Conversions → Manual CPC fallback (Aslam doctrine S6, 21d Manual baseline rebuild)

### D+21 (05/Jun)
- **Smart Bidding reset window END** — full re-evaluation
- **Cap renovation** OAuth Google review (next reauth)
- **Verdict:** scale / hold / kill per CAC visibility status

---

## Open Questions Breno (max 3)

1. **Smoke test result `+55 47 3041-9811`** — chega ao Sales AI dashboard E ao WhatsApp do time? Se NÃO chega no WhatsApp time = F5 destruição confirmada, kill C005+C007 imediato.
2. **Sales AI atendendo 276 leads/30d ou só fração?** — fundamenta CAC base R$1250 (4% close) vs pessimist R$2478 (2% close).
3. **Pode autorizar @aios-dev sprint dev next week para (a) CRM bridge fix + (b) PR #645 CAPI reabrir + (c) UI fixes 2 conv + 3 camps Meta?** — ações destravam scaling D+21.

---

## Cross-references

- Audit spike hoje cedo: `D:\AIOS\docs\projects\tocks\audits\audit-spike-2026-05-15-chief.md`
- Inventory Google Kasim: `D:\AIOS\docs\projects\tocks\audits\inventory-google-30d-2026-05-15-kasim.md`
- Inventory Meta Sobral: `D:\AIOS\docs\projects\tocks\audits\inventory-meta-30d-2026-05-15-sobral.md`
- Account playbook Tocks: `D:\AIOS\squads\marketing-traffic\data\account-playbooks\tocks.md` (NEW)
- Saga logs:
  - Main: `D:\jarvis\mcp-ads-bridge\data\tocks-15mai-operacao-saga.json`
  - Phase 2 retry: `D:\jarvis\mcp-ads-bridge\data\tocks-15mai-phase2-retry-saga.json`
- Execute scripts:
  - Inventory: `D:\jarvis\mcp-ads-bridge\tocks-google-15mai-inventory.cjs` + `tocks-meta-15mai-inventory.cjs`
  - Execute: `D:\jarvis\mcp-ads-bridge\tocks-15mai-operacao-execute.cjs`
  - Retry: `D:\jarvis\mcp-ads-bridge\tocks-15mai-operacao-retry-phase2.cjs`

---

## Memory update

- Session memory: `D:\AIOS\.claude\agent-memory\traffic-masters-chief\session_tocks_operacao_15mai.md`
- Calendar: `D:\AIOS\.claude\agent-memory\traffic-masters-chief\tocks_scaling_calendar_15mai.md`
- Gotcha additions: G-022 (conv type=28 IMMUTABLE — same pattern Bretda 15/Mai F6 codeless) + G-023 (PAUSED→REMOVED requires `.remove()`)

---

*Chief verdict: FIX 80% executado. Smart Bidding entra 21d reset hoje. NÃO escala até 05/Jun + CRM bridge active. Saldo Meta é o real gargalo hoje. Mata pageview falso, espera Smart Bidding rebuild, NÃO mexe nos winners.*
