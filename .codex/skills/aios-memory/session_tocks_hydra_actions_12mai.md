---
name: tocks-hydra-actions-12-mai
description: "Squad HYDRA Tocks (12/Mai) executou ações autônomas pré-PIX. Pausou C006 RTG, setou OUTBOUND_CLICK Google → SECONDARY, descobriu PR"
metadata: 
  node_type: memory
  type: project
  originSessionId: 408314f9-a076-48f1-b605-334f97dc0860
---

# Tocks HYDRA Squad — 12/Mai/2026

## Contexto
User: "consulte HYDRA + rode squad marketing pra melhorar campanhas Tocks". Squad analisou Tocks ≠ Bretda — Tocks não colapsou pós-28/Abr, sofreu de **saldo R$0 + CAPI bloqueado + Google value=0**. Squad recomendou ações cirúrgicas (NÃO restore Bretda-style).

## Ações EXECUTADAS hoje 12/Mai (pré-PIX, autônomas via MCP)

### Meta `act_1221671265457624`
✅ **C006 RTG `120245795709980230` → PAUSED** — freq 4,74 fatigando, recomendado pelo squad

### Google `8146675397`
✅ **OUTBOUND_CLICK ← SECONDARY** (conversion goal level) — conversion_action `7382426793` ([LEAD] COMPRA WHATSAPP SITE) não-biddable agora
   - Resolve P0-C step 3 do squad
   - Para o bidding optimization de premiar clique-WA R$3 (curiosidade) ao invés de Lead Qualificado R$13k

### Descobertas críticas
🔴 **PR #645 Railway CAPI Tocks foi CLOSED SEM MERGE** em 07/Mai (`mergedAt: null`, `mergeCommit: null`)
   - Branch `feat/tocks-capi-d-plus-plus` ainda existe local + fork remote
   - Estado: `mergeStateStatus: BEHIND` (atrás de main)
   - Memory `session_tocks_d_plus_plus_04_05mai.md` está desatualizada (dizia OPEN)
   - **CAPI Tocks NÃO está deployed.** Meta otimiza por messaging connections (proxy fraco), sem Lead Qualificado signal
   - Owner pra resumir/recriar PR: @devops + @dev

## Briefs criados em `D:/AIOS/docs/projects/tocks/briefs/` (D+2 a D+10)

1. `12mai-P0D-creative-diversification.md` — 6 image hashes Vértice/Elipse (V1-V3, E1-E3), regras stealth luxury, anti-AI tells
2. `12mai-T3-lp-arquitetos-spec-book.md` — LP `/arquitetos` Next.js + Spec Book PDF 16 pgs (InDesign) editorial
3. `12mai-T5-stealth-luxury-copy-v3.md` — 4 copy variations C007 v3 (Donald Judd / Bauhaus / Sottsass / Loro Piana references), zero preço creative
4. `12mai-T2-dual-purpose-carrossel.md` — Carrossel 3 cards Monaco-Vértice-Elipse (anchor sequence). **BLOQUEADOR:** validar com user se Monaco é modelo real ou só nome de campanha v2
5. `12mai-T7-mesa-jantar-kw-research.md` — Camp Google `[BR][SEARCH] TOCKS_MesaJantar_Luxo` R$25/d, 17 KWs (5 EXACT generic + 7 PHRASE competidores + 5 long-tail), 2 RSAs, gates D+3/D+7/D+14

## Estado pós-ações 12/Mai

### Meta Tocks
- C005 CSD `120245795233250230` ACTIVE R$95/d — Monaco SS fatigando
- C006 RTG `120245795709980230` **PAUSED** ✅ (era ACTIVE R$15/d)
- C007 V+E `120248300177020230` ACTIVE R$60/d — winner R$3,55/msg
- Saldo R$0 / spend_cap lifetime R$53.284 atingido → conta seca até PIX user

### Google Tocks
- `TOCKS_Search_Alta-Intencao` ACTIVE R$75/d (único ENABLED)
- OUTBOUND_CLICK conversion goal **biddable=false** ✅ (mudança aplicada hoje)
- SUBMIT_LEAD_FORM (Lead Qualificado R$13k) biddable=true ← biddable correto
- Bug `conversion_value=0` PARCIALMENTE mitigado (não premia mais click-WA), mas ainda falta P0-C step 1 (GTM Tray dataLayer.push lead_qualified value 13000)

## Bloqueadores P0 ainda ATIVOS (não-resolvíveis autônomos)

1. 🔴 **PIX Meta + spend_cap R$60k user UI** — runway zero, nada roda. User action.
2. 🔴 **CAPI Tocks deploy** — PR #645 CLOSED sem merge. Precisa decisão: reabrir/rebase branch ou refazer. @devops + @dev.
3. 🟠 **P0-C step 1 GTM Tray dataLayer.push** — @dev (Sales AI repo). Sem isso, Lead Qualificado Tocks Google fica com value default 13k mas sem fire dinâmico.
4. 🟠 **6 image hashes novos (P0-D)** — @creative-lab + nano-banana. Brief pronto.

## Next triggers (espera user)

- `pix confirmado tocks` → executo D+1 squad roadmap (despausa C007 v2 ads PAUSED, ajusta C005 R$95→R$25, prepara C008 Arquitetos)
- `capi tocks reabrir pr 645` → @devops avalia rebase/refazer
- `monaco existe?` → resolve bloqueador T2 (carrossel ou T2-bis sem Monaco)
- `vai com t3 tocks` → @ux-design-expert + @dev briefing LP /arquitetos
- `vai com t7 tocks` → traffic-chief cria camp Google Mesa Jantar (espera saldo Google ≥R$200)
- `gera image hashes tocks p0d` → @creative-lab + nano-banana 6 hashes

## Honestidade

- **PIX user é único inegociável.** Sem isso, tudo é teórico.
- **Tocks NÃO precisava de restore Bretda-style.** A conta estava saudável quando rodava. O problema é financeiro+estrutural (saldo, CAPI, value bug), não estratégico.
- **Squad evitou disrupcionar C007 V+E winner** — todas as adições propostas são adsets paralelos.
- **CAPI bloqueado por 8 dias** (04→12/Mai) é o maior bloqueador de qualidade. PR #645 dado como OPEN no memory antigo, descobrimos CLOSED hoje — memória desatualizada.

## Arquivos chave

- `D:/AIOS/docs/projects/tocks/briefs/` — 5 briefs novos (P0-D, T2, T3, T5, T7)
- `D:/AIOS/docs/projects/highticket/squad-08mai/99-synthesis/00-master-report.md` — síntese 1006 fontes HYDRA
- `D:/jarvis/mcp-ads-bridge/data/tocks-c007-30abr-result.json` — IDs C007 build
- Branch `feat/tocks-capi-d-plus-plus` local + fork remote (para reabrir PR)
