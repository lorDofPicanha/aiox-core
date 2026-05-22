# Specialist Research: Molly Pittman

## Bio
Molly Pittman é ex-VP da DigitalMarketer (Ryan Deiss) e co-fundadora da **Smart Marketer / Train My Traffic Person** (depois SmartMarketer e atual Smartmarketer/Pittman Pro). Especializada em traffic strategy holística — não plataforma específica, mas a engenharia de funil que conecta tráfego pago a oferta. Autora do podcast "Perpetual Traffic" (com Ralph Burns) e principal evangelista do framework "Customer Value Optimization" e do "Traffic Engine" (9 steps). Background ecommerce + info-products. Voz didática, empática, focada em ensinar agência owners e in-house marketers a pensar em sistemas.

## Core Frameworks

### 1. Traffic Engine (9 Steps)
**Steps:**
1. **Define the Customer Journey** — mapear awareness → consideration → conversion → retention
2. **Choose the Conversion Goal** — UMA meta primária (lead, sale, install)
3. **Identify the Audience** — interesses, comportamento, demographics, look-alikes
4. **Choose the Traffic Source** — Meta, Google, YouTube, TikTok (não tudo de uma vez)
5. **Craft the Ad** — hook + ângulo + criativo + CTA
6. **Build the Funnel** — LP, OTO, upsell, thank-you
7. **Track Everything** — pixel, CAPI, GA4, attribution
8. **Optimize Based on Data** — kill losers, scale winners
9. **Scale Strategically** — budget jumps controlados, vertical/horizontal

**When to apply:** novo cliente, novo funil, novo produto. SEMPRE pré-Tier 1.
**When NOT to apply:** account já rodando há 90+ dias com baseline estabelecido (use audit, não rebuild).

### 2. Customer Journey (DigitalMarketer)
**Steps:** Aware → Engage → Subscribe → Convert → Excite → Ascend → Advocate → Promote.
**Use:** definir oferta certa para cada estágio (TOFU/MOFU/BOFU).
**When NOT:** D2C low-ticket impulsivo (skip MOFU).

### 3. Hook-Story-Offer-CTA Ad Anatomy
- Hook = primeiros 3 segundos (visual + headline)
- Story = problema/solução (15-30s)
- Offer = oferta clara (preço, bônus, escassez)
- CTA = ação única, específica
**When NOT:** brand awareness puro (skip Offer/CTA hard-sell).

## Trademark Vocabulary
- **"Customer Value Optimization (CVO)"**
- **"Traffic Engine"**
- **"The Right Ad to the Right Person at the Right Time"**
- **"Engagement Audience"** (warm audience built from views/likes/follows)
- **"3-2-1 Ad Test"** (3 hooks × 2 angles × 1 offer)
- **"Funnel-Aware Traffic"** (não comprar tráfego sem funil pronto)
- **"Foundation First"** (pixel + CAPI + LP + offer ANTES de spend)

## Decision Rules
- Nunca subir spend sem 50+ conversões/semana no adset (learning phase respect)
- Sempre 1 conversão primary por campanha (não 5 conv events)
- Engagement audience só vira retargeting após 1k+ engaged users
- Se CPL > 2x baseline em 7d → diagnose ANTES de pausar (pode ser sazonal/criativo, não estrutural)
- Always test 3 ângulos antes de declarar nicho "morto"
- Foundation first: se LP converte <1.5% → arrumar LP antes de comprar tráfego

## Failure Modes (avisa contra)
- **"Spray and pray"** — comprar tráfego sem audiência definida
- **"Pixel afterthought"** — rodar 30d sem pixel correto e depois "começar a otimizar"
- **"Creative monogamy"** — 1 ad rodando 60d sem rotation
- **"Channel jumping"** — pular Meta→TikTok→YouTube em 30d sem dar baseline
- **"Setup amnesia"** — esquecer que CAPI, atribuição, naming convention precisam estar prontos pré-launch
- **"Funnel-less traffic"** — comprar tráfego direto pra homepage sem LP dedicada

## Tool Mapping (mcp-ads-bridge — 52 tools)
**Strategy/Diagnostic:**
- `ads_full_audit` — baseline diagnostic
- `ads_performance_monitor` — daily check
- `google_ads_overview` + `meta_ads_overview` — multi-platform snapshot

**Setup:**
- `meta_ads_pixel_check` — Foundation First gate
- `meta_ads_create_pixel`
- `google_ads_conversion_actions_list`
- `meta_ads_set_geo_targeting` (Brasil 2076 PRESENCE)

**Read-only audits:**
- `meta_ads_creative_list` (creative monogamy detection)
- `meta_ads_audience_overlap`
- `google_ads_search_terms`

## Account Application (Bretda/Tocks/KR/Vorza)
- **Bretda:** Traffic Engine step 6 falhou múltiplas vezes (Instant Form vs LP form trap) — Molly recomendaria 3-way test (Plano B 14/Mai)
- **Tocks:** step 7 ROAS cego = "Pixel afterthought" classic. Tracking-first.
- **KR:** novo BM = case textbook Foundation First (pixel + CAPI + WhatsApp setup ANTES de spend)
- **Vorza:** pivô email = Customer Journey reorientation (move de Convert para Subscribe stage)
