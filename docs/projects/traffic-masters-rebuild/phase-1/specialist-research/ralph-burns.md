# Specialist Research: Ralph Burns

## Bio
Ralph Burns é founder e CEO da **Tier 11** (anteriormente "DominateWebMedia"), agência $300M+ ad spend Meta+Google managed para info-products, ecommerce e SaaS. Co-host do **Perpetual Traffic Podcast** (com Molly Pittman + Kasim Aslam — 700+ episódios desde 2014). Background ecommerce + paid media at scale. Frame: "creative is the new targeting" — em mundo Meta pós-iOS14, criativo carrega 80% do peso. Voz analítica, sistemas-first, criador de operating procedures replicáveis. Especialização: scaling de $30k/mês para $300k+/mês.

## Core Frameworks

### 1. Creative Lab (7 Steps)
**Premise:** scale = volume DE CRIATIVOS testados, não budget bruto. Tier 11 produz 50-200 creatives/mês por cliente top.

**Steps:**
1. **Creative Strategy Doc** — definir 5-7 angles brandados
2. **Brief Templates** — 1pg por creative (hook, body, CTA, format)
3. **Production Pipeline** — UGC creators + designer + editor (week sprints)
4. **Naming Convention** — `Angle-Hook-Format-Version-Date`
5. **Test Methodology** — minimum 4 ads/adset, 3-5 day window, kill <50% CTR baseline
6. **Winner Catalogue** — biblioteca interna de tops + analytics
7. **Iterate Loop** — winners viram bases, iterações trimestrais

**When to apply:** spend >$10k/mês quando creative fatigue mata baseline mensal
**When NOT to apply:** spend <$3k/mês (volume baixo demais para iterate scientific)

### 2. DPI² (Daily Performance Index Squared)
**Premise:** medir performance diária com 2 layers — performance absoluta + tendência.
- DPI = (today CPL / 7d avg CPL) × (today volume / 7d avg volume)
- DPI² = DPI × momentum (slope 3d)
- DPI² < 0.7 = ALERT (decay)
- DPI² > 1.3 = OPPORTUNITY (scale candidate)

**Use:** dashboard daily, decision-making automatizada
**Avoid:** small accounts <50 conv/semana (noise > signal)

### 3. Scaling Frameworks
**Vertical Scale (Aumentar budget no winner):**
- +20%/dia max enquanto learning estável
- Cost cap mantém CAC, LCWB maximiza volume
- Pause se CPL >1.5x baseline em 3d consecutivos

**Horizontal Scale (Replicar para novas audiences):**
- Look-alike 1% → 3% → 5% → 10% (gradual)
- New geos (regional → national → international)
- New placements (sequential, não tudo de uma vez)

**Diagonal Scale (Vertical + Horizontal):**
- Reservado para pós-stable baseline (90+ dias same playbook)
- High-risk, high-reward

### 4. The "Scaling Wall" Concept
- Toda conta tem um "wall" — ponto onde +1$ spend retorna <baseline
- Identificar via incrementality test (geo holdout, on/off semanal)
- Wall típico: $300/d para info-products small; $3k/d para DTC mid; $30k/d para enterprise
- Wall não é fixo: melhora com creative refresh, deteriora com freq saturation

## Trademark Vocabulary
- **"Creative is the new targeting"**
- **"Scale at the speed of insight"**
- **"DPI²"**
- **"Scaling Wall"**
- **"Creative Lab"**
- **"Naming Convention is governance"**
- **"Boring brand wins"**
- **"Test, kill, scale" cycle**

## Decision Rules
- Sempre 4+ ads/adset para statistical confidence
- Kill criterion: 3 conversion windows sem performar (não 1-2 dias)
- Naming convention obrigatório (auditável, queryable)
- Refresh creative ANTES de freq=4 (pre-emptive, não reactive)
- Holdout test trimestral (geo ou time-based)
- Não scaling de winner sem 7d baseline estável
- Scale = +20%/dia (não dobrar)
- Sempre baseline week ANTES de qualquer mudança estrutural
- NUNCA mudar 2 variáveis simultaneamente (audience + creative + bid = caos)

## Failure Modes (avisa contra)
- **"Single hero ad"** — 1 creative pegando 80% spend = freq saturation iminente
- **"Naming chaos"** — `ad_final_v2_FINAL` = governance impossível
- **"Scale rush"** — +100% budget overnight = learning reset
- **"Creative coupling"** — testar 2+ variáveis ao mesmo tempo, não saber qual movimentou
- **"Wall denial"** — empurrar +budget contra wall = CAC explosion
- **"Iteration laziness"** — não rodar Creative Lab, ficar refém de 1-2 winners
- **"Kill regret"** — ressuscitar loser 3+ vezes
- **"Cost cap forever"** — manter Cost cap em escala alta (Ralph: usar Cost cap pra estabilizar, depois LCWB pra acelerar)

## Tool Mapping (mcp-ads-bridge)
**Read (heavy use — daily):**
- `meta_ads_overview`, `meta_ads_insights` (DPI² calc)
- `meta_ads_creative_list` (Creative Lab inventory)
- `meta_ads_breakdown` (placement, demo, hour-of-day)
- `meta_ads_audience_overlap`
- `google_ads_overview` (multi-platform DPI²)

**Write:**
- `meta_ads_update_budget` (+20% guardrail)
- `meta_ads_update_status` (kill losers)
- `meta_ads_create_ad` (Creative Lab pipeline output)
- `meta_ads_create_adset` (horizontal scale to new audience)
- `meta_ads_update_bidding_strategy` (Cost cap → LCWB transition)

**Audit:**
- `ads_full_audit` (mensal)
- `ads_action_log` (governance trail)
- `ads_auto_optimize` (DPI² alert automation)

## Account Application
- **Bretda:** budget jump R$27→R$120 (+344%) violou "Scale = +20%/dia". Ralph teria recomendado R$27 → R$32 → R$38 → R$45 → R$54 → R$65 (12d para chegar em R$120). AD05 monopolizando 97% spend = "Single hero ad" textbook → freq saturation explica colapso pós-28/Abr.
- **Tocks:** Creative refresh trimestral nunca executado (mesmo Monaco há 60+ dias). DPI² teria alertado.
- **KR:** spend muito baixo (R$50/d) para Creative Lab — Ralph diria "skip framework, foque em 4-6 criativos brand quality".
- **Vorza:** ecommerce DTC pivô email = scaling pause adequado.
