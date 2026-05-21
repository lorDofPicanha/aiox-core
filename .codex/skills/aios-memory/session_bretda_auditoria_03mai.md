---
name: Sessão Bretda Auditoria Estrutural 03/Mai
description: Auditoria profunda Google Ads + Meta Ads Bretda via traffic-chief. Score Google 2,5/10 (apagão + ROAS cego R$100 fixo) + Meta 5,5/10 (CAPI OFF + saldo crítico R$327 = 2,7d runway). CPL R$12,21 saudável mas escala travada.
type: project
originSessionId: b7bf7d9c-775d-4f7c-8f80-d27a60b58985
---
# Sessão Bretda Auditoria 03/Mai 2026 (sábado)

User pediu auditoria equivalente à Tocks. Traffic-chief entregou raio-X estrutural. Modo análise apenas. ZERO execuções.

**ATENÇÃO contexto novo:** site novo LIVE em bretda.com.br desde 01/Mai (DNS migrated). CAPI server + EC implementados gated em user actions. HEAD `9cc6795`. Pixel ID confirmado memória: `1130704285486234` MAS agent identificou pixel ativo `3348133485496539` last_fired 02/Mai — VERIFICAR se é pixel velho disparando ou novo do site novo (pode ter 2 pixels na conta).

## Veredito Comparativo Bretda

| Dimensão | Google (2,5/10) | Meta (5,5/10) |
|---|---|---|
| Disponibilidade | 0 ✗ apagão | 1 ✓ CJ8v2 entregando |
| Mensuração | ROAS cego R$100 fixo | Pixel OK + CAPI OFF |
| Volume conv 30d | 3 leads | 121 leads |
| CPL real | R$337 | **R$12,21** ✅ |
| Estrutura | 11 camp 100% paused | 33 camp · 1 active |
| LP fit | IS Lost Rank 63% | LP view 4% (catastrófico) |
| Saldo | indireto cartão | R$327 = 2,7d runway 🔴 |

**Meta carrega 100% da operação. Google é zumbi com bug grave.**

## Google Ads (`8167636084` MCC `7943699417`) — Score 2,5/10

**Estrutura:** 11 campanhas, **100% PAUSED desde 30/Abr**. 1 paused-recente + 10 REMOVED. Zero PMAX/Shopping/Display/YouTube — 100% Search.

**Performance 30d (`[C]-Pesquisa-Leads-Sudeste`):**
- R$1.012,20 / 17.922 imp / 539 cliques / CTR 3,01%
- 3 conv / R$100 valor / **CPA R$337**
- Search IS 20,4% / **IS Lost Rank 63,1%** / Lost Budget 16,6%

**Bug `conv_value` IDÊNTICO À TOCKS:** 4 conv actions todas com **default_value fixo R$100**, `always_use_default=true`. Cada lead vale "R$100" mesmo a venda real sendo R$33k+. Zero upload offline lead→venda. TARGET_ROAS inviável.

**Bugs/Gaps confirmados:**
1. ROAS cego R$100 fixo (idêntico Tocks)
2. **Timezone Fortaleza** (deveria São Paulo — desalinha cohort Meta/site)
3. 63% IS Lost Rank = lance manual baixo + LP score pobre
4. 9 SKU campaigns DELETADAS (sinuca/tênis/pebolim/shuffle/arquitetos) → aprendizado Smart Bidding ZERADO se reativar
5. Sem upload offline cabeado
6. Sem Shopping/PMAX mesmo tendo 12 SKUs físicos R$33k+

## Meta Ads (`act_381618241134624`) — Score 5,5/10

**Saldo CRÍTICO:** R$327,34 (não R$635 como memória — caiu 48% em 48h). amount_spent lifetime R$29.687. spend_cap R$29.975 (gap R$287 ~2,4d até cap).
**Runway: 2,7 dias** com CJ8v2 R$120/d. **Recarga PIX urgente até 05/Mai.**

**Pixel `3348133485496539`** — last_fired **02/Mai 13:40 BRT** (ontem). AAM 11 campos robusto. first_party_cookie ENABLED. ⚠ MEMÓRIA diz pixel correto seria `1130704285486234` — **possível 2 pixels na conta (velho disparando + novo do site novo)**. Verificar.

**CAPI Caminho B:** CODE READY desde 23/Abr, **NÃO ATIVADO**. Faltam:
- Gerar System User Token no BM Bretda (System User ID 61578657552599)
- `vercel env add META_CAPI_TOKEN` em apps/bretda-lp
- Test Event Code

**LP view rate 30d:** 4,2% (64 LP views / 1.527 cliques). **Pixel híbrido NÃO consertou** — issue é browser-side blocking (iOS ATT + Safari ITP), não código. Audit técnico LP urgente.

**Custom Audiences saúde:**
- ✅ LAL 1% Leads Form 90d (167-197k) READY
- ✅ LAL 1-2% Leads Form 90d (238-280k) READY
- ✅ IG engajamento 365 (6,9-8,2k) READY
- ⚠ Leads Form 90d só 1.000 (limite mínimo, hidratando)
- ❌ LAL 1% Engajamento IG — code 433 "exclua e tente de novo"
- ❌ LAL 1% Visitantes Site — code 433
- ❌ RTG site morto (visitantes 30d só 20 pessoas — pixel só ficou híbrido em 30/Abr)
- ❌ 5 audiences `[AGD]` velhas

**Campanhas:** 33 totais, **1 ACTIVE** (`[C]-CP2-Leads-Form-Arquitetos+Luxo-07/11`). 7 adsets aninhados, 1 ACTIVE (CJ8v2) + 6 PAUSED.

**CJ8v2 targeting:** R$120/d ACTIVE, OUTCOME_LEADS, 9 estados (BA/CE/DF/MS/MT/PR/RS/SC/PE), arquitetos LinkedIn jobs, FB+IG feed/stories/reels, **advantage_audience OFF**, bid LOWEST_COST_WITHOUT_CAP. **iOS only** (exclui 70% mercado BR Android).

**Performance Meta 30d:** R$1.477 / CTR 2,64% ✅ / freq 1,72 ✅ / **121 leads CPL R$12,21** ✅. LP views 64 (4,2%) ❌. AddToCart 12 / ViewContent 33 — zero valor venda atribuído.

**Performance 7d (regressão):** R$567 / 42 leads / **CPL R$13,51** / CTR 2,42% caindo / freq 1,48 OK / LP views 18 (3,6%).

**Ad-by-ad CJ8v2 7d:**
| Ad | Spend | CTR | Leads | CPL |
|---|---|---|---|---|
| AD05 (PAUSED) | R$136 | 3,02% | 13 | R$10,48 ⭐ |
| AD09 OPAL carousel | R$153 | 1,76% | 9 | R$16,99 |
| AD10 AURORA | R$208 | 2,57% | 19 | R$10,97 ⭐ |
| AD11 AMBAR carousel | R$5,55 | 2,49% | 0 | — |
| AD12 CITRINO | R$49 | 2,41% | 1 | R$49 ❌ |
| AD13 ZURITA carousel | R$12,72 | 1,04% | 0 | — |

**Realidade:** AD05 + AD10 são únicos winners reais. AD09 média. AD11/12/13 dispersion confirma diagnóstico 01/Mai.

**Bugs/Gaps Meta:**
1. CAPI server OFF — leak crítico mensuração
2. LP view rate 4% — pixel híbrido NÃO consertou (browser-side blocking)
3. Saldo R$327 = 2,7d runway
4. 2 LAL críticos com erro 433 (engajamento IG + visitantes site)
5. advantage_audience OFF (perde 20-40% reach incremental)
6. iOS only (exclui Android 70% BR)
7. 5 ads ACTIVE só 2 entregam (fadiga + dispersion)
8. destination_type=ON_AD (leads não vão direto pro CRM Sales AI?)

## Insight Estratégico — Bloqueador #1

**A maior alavancagem em Bretda é CAPI server-side ATIVADO (Caminho B), não criativos novos nem reativar Google.**

Cadeia causal:
1. CPL Meta R$12 com AAM 11 campos + Pixel browser → matching ~50-60%
2. Browser-only sem CAPI → iOS ATT + Safari ITP comem 30-40% eventos → algoritmo otimiza com sinal incompleto → AD05/AD10 viram winners aleatórios
3. LAL Leads Form 90d alimentada só com Lead in-form (não venda) → treina pra "preencheu form", não pra "comprador R$33k"
4. Sem CAPI: impossível enviar `Purchase` server quando user fecha venda no WA/CRM → algoritmo NUNCA aprende padrão real comprador

**ROI esperado CAPI ON + uploads:** -25 a -40% CPL em 14-21d + LAL "Compradores 180d" treinada com R$33k reais → CPL R$8-9 + spend escalável R$120 → R$300-400/d sem creative fatigue.

5 outros gaps (LP view, advantage_audience, iOS, dispersion, Google upload offline) são **amplificadores** do mesmo problema raiz: máquina vendendo R$33k vê apenas "lead R$0".

## Pendências Operacionais (FLAG)

- ✅ Bretda Customer ID **8167636084** está no `.env` MCP bridge (não é gap)
- 🔴 **Recarga PIX R$1k-2k** antes 05/Mai (saldo R$327 / 2,7d)
- 🔴 **System User Token Meta** (BM Bretda) → user gera + `vercel env add META_CAPI_TOKEN`
- 🔴 **Verificar pixel ID real** — agent identificou `3348133485496539` disparando, memória diz site novo deveria ter `1130704285486234` (possível 2 pixels)
- 🟡 **Upload offline Google** (lead→venda R$33k) — ETL Sales AI/CRM → Google Ads conversions API
- 🟡 **Routine cloud `trig_01MKZPMRQAP07XHDCTJVV9GDF6`** agendada hoje 03/Mai 21h BRT — vai rodar com saldo R$327. Guardrail saldo≤R$50 vai disparar PAUSE em ~48h se PIX não entrar
- 🟡 **Google Ads URL audit pendente** (12 SKUs novos + 5 rotas legadas 404 — site novo mudou estrutura)
- 🟡 **OAuth Google Testing→Production** janela ~06/Mai (próximo expiry token)

## Agent IDs

- traffic-chief sessão Bretda audit: `a8e767a586a3f910d`
