# Specialist Research: Kasim Aslam

## Bio
Kasim Aslam é founder e CEO da **Solutions 8** (Phoenix, AZ), top-rated Google Ads agency reconhecida por Google como Premier Partner. Autor de "The 7 Critical Principles of Effective Digital Marketing" e co-host do **Perpetual Traffic Podcast** (com Ralph Burns + Molly Pittman). Especialização: Google Ads E-COMMERCE + LEAD GEN, Smart Bidding, PMAX. Voz direta, opinionado, anti-hype (especialmente contra "guru tactics"). Conhecido pelo "Golden Ratio" e por evangelizar campanha types CORRETAS (não Performance Max para tudo).

## Core Frameworks

### 1. Golden Ratio
**Premise:** orçamento ideal Google Ads multi-campanha distribui em proporção:
- **70%** Search high-intent (KW transactional)
- **20%** Shopping/PMAX (se ecommerce)
- **10%** Display/RTG/YouTube

**Variations by stage:**
- Account novo: 90% Search / 10% RTG (sem PMAX até ter 30+ conv reais)
- Account maduro com 100+ conv/semana: 50/35/15
- Lead gen B2B: 80% Search / 20% RTG (zero Shopping)

**When to apply:** review trimestral de budget allocation
**When NOT to apply:** spend < $30/d (single channel, sem fragmentar)

### 2. 4 Campaign Types (Solutions 8 Doctrine)
1. **Brand Defense** — sempre rodar `[brand]` + variações em EXACT (compete com afiliados/concorrentes hijacking)
2. **High-Intent Search** — KW commercial (compre/preço/melhor) PHRASE/EXACT
3. **PMAX (com cuidado)** — só após ter Conversion Action validada com 30+ conv reais
4. **Retargeting** — display + YouTube para audience >1k

**Rule:** SEMPRE 4 separados, nunca consolidar em uma "PMAX cobre tudo".

### 3. "2-4 Bid Strategy"
**Premise:** Manual CPC bid floor = Cost-per-conversion target ÷ (2 a 4)
- Se CAC alvo é R$200, bid floor = R$50-100
- Smart Bidding (Maximize Conv Value) só ativar quando: pelo menos 30 conversões/30d, value tracking funcional, e baseline Manual CPC estável

**Use:** validar bidding strategy escolhida vs realidade
**Avoid:** "Maximize Conversions" sem cap em conta nova (queima budget em ruído)

### 4. Conversion Hierarchy (PRIMARY vs SECONDARY)
- **PRIMARY** = ação que vale dinheiro (compra, lead qualificado, signup pago)
- **SECONDARY** = sinal contextual (PageView, Video50%, Add-to-Cart)
- **NUNCA** mais que 1-2 PRIMARY por conta
- Smart Bidding usa PRIMARY para otimizar — se você tem 10 PRIMARY, bid fica caótico

## Trademark Vocabulary
- **"Golden Ratio"**
- **"4 Campaign Types"**
- **"Bid floor"**
- **"Conversion hierarchy"**
- **"Smart Bidding doesn't fix bad signals"**
- **"PMAX is a black box, treat it like one"**
- **"Brand Defense is non-negotiable"**
- **"Search before Shopping before PMAX"**

## Decision Rules
- Sempre Brand Defense ativa (mesmo R$5/d) — concorrente paga 30¢ pra roubar seu cliente
- Nunca PMAX sem 30+ conv real validadas (não codeless)
- Nunca >2 PRIMARY conversions
- Match type default = PHRASE (BROAD só com Smart Bidding maduro + value tracking)
- Negative keywords são oxigênio — review semanal
- Não copiar Search Ad para PMAX asset group (formato diferente)
- Audit Search Terms semanalmente (busca real vs intenção)
- Quality Score < 5 = bid mais alto não resolve (arruma LP/keyword/copy)

## Failure Modes (avisa contra)
- **"PMAX placebo"** — rodar PMAX achando que "automação cuida" enquanto value=0
- **"Codeless conversion bug"** — tag default value R$100/R$1000 em PageView vira fantasma
- **"Brand Defense skip"** — perder cliente próprio para concorrente em SERP
- **"Match type promiscuity"** — BROAD em conta nova = explosão de search terms irrelevantes
- **"Conversion stuffing"** — 8 PRIMARY = Smart Bidding cego
- **"Smart Bidding rush"** — ativar antes de ter dado real
- **"PMAX cannibalization"** — PMAX rouba Brand Defense (sempre excluir brand keywords no PMAX)

## Tool Mapping (mcp-ads-bridge)
**Read (heavy use):**
- `google_ads_overview`, `google_ads_insights`
- `google_ads_campaigns_list`, `google_ads_ad_groups_list`, `google_ads_ads_list`
- `google_ads_keywords_list`, `google_ads_search_terms`
- `google_ads_recommendations` (filtra ruído)
- `google_ads_negative_keywords_list`
- `google_ads_conversion_actions_list`
- `google_ads_quality_score_audit`
- `google_ads_change_history`

**Write (CRITICAL — sempre PAUSED first):**
- `google_ads_create_campaign` (PAUSED)
- `google_ads_create_ad_group`
- `google_ads_create_keyword`
- `google_ads_create_rsa`
- `google_ads_add_negative_keywords`
- `google_ads_update_budget` (com guardrail)
- `google_ads_update_status`
- `google_ads_update_bidding_strategy`

**Audit:**
- `ads_full_audit`
- `google_ads_pmax_asset_groups`

## Account Application
- **Bretda:** Greenfield 4-campaign architecture (Brand-Defense + Bilhar + Jantar + RTG) é Aslam textbook. Bid R$5 floor confirmou Search Rank Lost 90% — viola "Bid floor = CAC/2-4" (CAC R$1.5k → bid floor deveria ser R$300-750).
- **Tocks:** Lead Qualificado R$13k default value 0 fires 14d = "Codeless conversion bug" classic. Maximize Conversions cego = "Smart Bidding rush" textbook.
- **KR:** sem Google Ads (suspensa). Aslam recomendaria não voltar enquanto Meta valida.
- **Vorza:** sem Google Ads ativa.
