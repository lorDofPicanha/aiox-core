---
name: bretda-audit-15-mai
description: First production audit of consolidated marketing-traffic squad (15/Mai). MCP LIVE 64 tools. Google 401 OAuth expired. Meta CJ8v2 R$60/d entregando 27 leads/7d R$23 CPL via Instant Form (Plano B 14/Mai NÃO executado). AD05 95% spend F8 confirmed. RTG-WARM adset ACTIVE com audience FAILED (zombie). Verdict HOLD METHODICAL pendente OAuth reauth + System User Token CAPI B. Audit em docs/projects/bretda/audits/audit-2026-05-15-chief.md.
metadata: 
  node_type: memory
  type: project
  originSessionId: 4caaf143-bfd8-4b9f-88f9-0c482fa87ad5
---

# Bretda Audit 15/Mai/2026 — Squad marketing-traffic primeira corrida

## Verdict
**HOLD METHODICAL** — Score Traffic Engine 9/18 (deep-audit, NÃO rebuild).

## Achados ao vivo via mcp-ads-bridge (64 tools confirmed)
- Google `8167636084`: **OAuth 401 EXPIRED** (G-002 / F2 HIT) — última reauth 07/Mai. Token possivelmente offline há vários dias. Brand-Defense status indeterminável.
- Meta `act_381618241134624`: connected, 35 campanhas, **1 ACTIVE delivering** (CJ8v2 em CP2).
- CJ8v2 (`120237168468370737`): R$60/d, Sudeste+Sul 7 estados (SP/RJ/MG/ES/PR/SC/RS) PRESENCE=home+recent ✅ G-011 OK, arquitetos work_positions+industries, iOS, LOWEST_COST_WITHOUT_CAP, LEAD_GENERATION. **Geo confirmed alinhado memory 12/Mai**.
- 7d: R$622,03 / 27 leads / **CPL R$23,04** / freq 1,29 / CTR 2,23%.
- **AD05 (`120244164995160737`) = 95,1% spend, 96,3% leads em 7d** — F8 severe. AD03 1 lead R$22,60, AD04 ZERO leads.
- Pixel `3348133485496539` last fire 14/Mai 16:46 BRT ✅ (<24h).
- 30d: 157 leads / 1 fb_pixel_lead = 0,6% match Pixel→Meta (Instant Form bypass confirmed).

## Discrepâncias vs memory
1. Memory diz "apenas CJ8v2 + AD03/04/05 ACTIVE". Audit live encontrou também:
   - **CP-RTG-WARM adset (`120244496926970737`) ACTIVE R$55/d** com audience FAILED (`120244118776810737` LAL 1% Eng IG — audit 07/Mai pedia DELETE como QW6). Campaign PAUSED protege delivery → R$0 7d, mas configuração zombie.
   - **C006 AS01 adset (`120243276193130737`) status ACTIVE** com advantage_audience=1. Campaign PAUSED, sem delivery, mas mesmo padrão zombie.
2. CPL subiu **R$11 (memory 12/Mai) → R$23,04 (live 15/Mai)** = 2x. Consistente com F4 limbo recovery D+3 de 14d + F8 mono-hero.
3. **Plano B 14/Mai (criar AD LP `destination_type=WEBSITE` Aurora em CJ-AURORA-ISO R$10/d) NÃO foi executado.** Mesmo state 12/Mai.

## F-pattern hits
- F2 OAuth Google expired (LIVE)
- F3 Instant Form trap PERSISTENT (Plano B not executed)
- F4 Budget jump recovering D+3/14
- F6 codeless conv likely persistent (não validável OAuth 401)
- F8 single hero AD05 95% (LIVE pior nível registrado)
- F9 audience overlap latente (RTG-WARM zombie)
- S6 Manual CPC 21d honored ✅

## Foundation First
- Pixel ✅ / CAPI A ✅ / CAPI B NEVER DEPLOYED (5min user) / PRIMARY Google UNVERIFIED / Saldo UNVERIFIED / LP conv 1,3% FAIL / Funnel partial.

## User actions (priorizado)
1. 🔴 OAuth Google reauth contato@tockscustom.com.br (30s)
2. 🔴 Generate Meta System User Token BM Bretda Pixel 3348133485496539 (3min)
3. 🟡 PIX Meta + validar saldo Google UI (5min)
4. 🟡 Screenshot AD05 link_url UI Ads Manager (2min)

## Tier 1 handoff sequence
1. Step 0 user actions
2. @kasim-aslam re-run Google audit pós-OAuth (`account-audit.md` Google branch)
3. @depesh-mandalia exec Plano B (`meta-instant-form-vs-lp.md` + AD LP Aurora CJ-AURORA-ISO R$10/d)
4. @pedro-sobral sales feedback spreadsheet via google_sheets_create
5. @ralph-burns Sprint 3 (creative refresh AD05 dethrone — pendente sprint ship)
6. @depesh-mandalia audience cleanup (DELETE 120244118776810737, PAUSE CJ-RTG-WARM adset)
7. Chief D+7 19/Mai gate conclave round 2 Neil/Larry/Peep

## Gotchas hit
G-002 LIVE, G-003 LIVE, G-004 RECOVERING, G-006 LIKELY LIVE, G-008 LIVE SEVERE, G-017 ACTIVE (LAL base = Engajamento IG, não Compradores), G-011 ✅, G-013 ✅, G-016 UNVERIFIED.

## Tools MCP usadas (read-only)
- ads_connection_test, google_ads_overview (401), meta_ads_overview, meta_ads_pixel_check, meta_ads_campaigns, meta_ads_adsets, meta_ads_insights (adset+ad level), ads_full_audit.

## Triggers
- `oauth reauth bretda` → Step 0a
- `gera capi token bretda` → Step 0b guidance
- `executa plano b bretda` → Step 2 (após 0b)
- `setup sales feedback bretda` → Step 3
- `audit bretda d+7` → 19/Mai gate
- `cleanup zombie audiences bretda` → Step 5

## Deliverable
`D:\AIOS\docs\projects\bretda\audits\audit-2026-05-15-chief.md`

## Sessão
First production run consolidated marketing-traffic squad (Phase 3 Sprint 1 squad rebuild 14/Mai → Sprint 2 ativo 15/Mai). MCP-ads-bridge LIVE 64 tools. Operating Meta-live + Google documentary mode (OAuth blocker).
