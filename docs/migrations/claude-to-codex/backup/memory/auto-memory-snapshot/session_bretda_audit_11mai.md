---
name: Bretda Audit 11/Mai
description: Audit live 11/Mai Bretda. CAPI B LIVE desde 04/Mai (memória estava desatualizada). Instant Form Trap 07/Mai foi cosmético, pivot real começou hoje. NE removido. Brand-Defense KW fix.
type: project
originSessionId: 1ce1f2ea-3a73-464e-b6c2-7936183df723
---
# Bretda Audit + Mudanças 11/Mai/2026

> **⚠️ SUPERSEDED parcialmente 12/Mai/2026** — Afirmação "AD10v2 AURORA ACTIVE (único LP real)" estava ERRADA. AD10v2 também era Instant Form (Meta API rejeitou criar ad cross-destination usando seu creative_id em 12/Mai com error_subcode 1892040). O `link_url=bretda.com.br/colecao/aurora-sinuca` era cosmético. ✅ Permanece correto: CAPI Caminho B LIVE pixel 3348133485496539, dual-fire dedup OK. Ver `session_bretda_restore_12mai.md`.


## Estado real CAPI Caminho B
✅ **LIVE em produção desde 04/Mai via PR #4**. Memórias antigas (`project_bretda_lp_pixel_fix_30abr.md`, `session_bretda_capi_lp_pr18_04mai.md`) eram da LP antiga estática. LP atual é Next.js em `D:\AIOS\apps\bretda-lp\` (repo `lorDofPicanha/bretda-lp`).

**Smoke tests 11/Mai (prod):**
- `GET /api/meta-conversion` → configured=true, pixel_id=3348133485496539, access_token=present
- POST Lead → 202 events_received=1, fbtrace_id=AnFbZaEjejOFppVkzspjR_H
- POST Contact → 202 events_received=1
- CORS gate evil.com → 403 (correto)
- Lead-only filter PageView → 202 skipped (correto)
- `npx tsc --noEmit` clean

**Arquitetura:** dual-fire Pixel (browser) + CAPI (server) com `event_id` determinístico compartilhado pra dedup. Form CTAs (WhatsApp, contato, configurador, encomenda) usam `Lead` em ambos os lados.

**Implicação:** veto conclave 07/Mai "scale Meta CP2 sem CAPI B = arson pixel-blind" está DESTRAVADO. Decisão de scale depende só de sales feedback (close rate ≥3x Instant Form) + saldo Google.

## Bloqueadores user remanescentes CAPI
1. `METAAPI_TEST_EVENT_CODE` não plugado (opcional, 2 min) — gerar no BM, passar pra `vercel env add METAAPI_TEST_EVENT_CODE production`
2. Token Meta sem `business_management` scope — fix em `developers.facebook.com → App → Roles`

## Diagnóstico Meta Ads 11/Mai (7d)
- 1 campanha ACTIVE: CP2 (`120236735188220737`) — conclave 07/Mai vetou scale
- 1 adset ACTIVE: CJ8v2 (`120237168468370737`) R$120/d, R$112/d real
- Spend 7d: R$781.80
- 55 leads totais: 54 via Meta Lead Form (Instant Form rebranded), 1 via Pixel (LP real)
- **Pivot 07/Mai foi COSMÉTICO** — AD03/AD04/AD05 ativados como "fix" também tinham `link_url: ""` vazio (= Meta Lead Form com CTA GET_QUOTE/LEARN_MORE em vez de SIGN_UP). Ads com LP real (AD09/AD10v1/v2/AD11/AD12/AD13) ficaram TODOS PAUSED.

## Mudanças aplicadas 11/Mai
### Meta (`act_381618241134624`)
- ✅ AD10v2 AURORA QUALIFICADA (`120245578942970737`) → ACTIVE — único com link específico `bretda.com.br/colecao/aurora-sinuca`
- ✅ AD04 (`120244164992490737`) → PAUSED
- ✅ CJ8v2 geo: removidos Bahia/Ceará/Pernambuco (user: "leads NE ruins"). Mantidos DF + MS + MT + PR + RS + SC (6 estados CO + Sul)

### Google Ads (customer `8167636084`)
- ✅ BR-Brand-Defense ad_group `196949446315` ganhou 6 KWs: `[bretda]` EXACT + `"bretda"` PHRASE + `mesas bretda` + `bretda mesas` + `bretda bilhar` + `bretda sinuca` (todas bid R$3 max). Root cause de 0 impressions/7d: KW `bretda` antiga estava no ad_group `174159459036` da camp PAUSED Legacy 08/11.

## Diagnóstico Google 11/Mai (7d)
- 5 campanhas, 4 ENABLED + 1 PAUSED legacy
- Spend real R$15/d vs R$60/d budget (25% rodando)
- Search IS 9.99% uniforme = bid/budget cap
- 0 conversões 7d
- Brand-Defense 0 impressions (FIX aplicado hoje)
- 50 changes 07-10/Mai detectadas mas Gate 72h 10/Mai sem doc formal

## Pendências
- Sales feedback spreadsheet (em construção pela @data-engineer + Neil clone) — pré-req Gate D+7 14/Mai
- PIX top-up Google (user) — runway estimado curto
- Test Event Code Meta (user, opcional)
- Meta App Roles fix (user, R6 do audit 07/Mai)

## Gate D+7 14/Mai (3 dias)
- Pré-req CAPI B: ✅ JÁ SATISFEITO
- Pré-req sales spreadsheet: 🟡 em construção
- Pré-req AD05 link_url: 🔴 ainda vazio (AD05 segue ACTIVE em CJ8v2; sugestão pausar ou plugar link)
- Métrica gate: CPL real sobre fechamento LP form (AD10v2 a partir de 11/Mai) vs Instant Form (período anterior)
- Risco: amostra LP form pode ser pequena (só AD10v2 ativo). Se sales spreadsheet mostrar AD03/AD05 Instant Form com close rate <1%, fica claro o trap.

## Triggers
- `valida sales spreadsheet bretda` — checar progresso preenchimento
- `audit bretda d+7` — rodar gate 14/Mai
- `bretda ad05 pause` — pausar AD05 também (mesmo link vazio que AD04)
- `bretda saldo top-up confirmado` — depois user fazer PIX, ajustar bid Manual CPC pra puxar Search IS
