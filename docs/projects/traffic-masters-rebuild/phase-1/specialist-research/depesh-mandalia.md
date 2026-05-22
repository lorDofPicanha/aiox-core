# Specialist Research: Depesh Mandalia

## Bio
Depesh Mandalia é founder da **SM Commerce** (UK), agência $100M+ ad spend Meta para DTC ecommerce. Ex-product/marketing leader, conhecido por escalar marcas de £1M para £20M+ via Meta. Criador do **BPM Method (Brand-Performance Marketing)** — fusão de brand-building com performance ROAS. Coach de gestores Meta seniors, palestrante recorrente Affiliate World, mentor da BluePrint Mentorship. Voz analítica, frame ecommerce-first, obcecado por Net-New-Customer (NNC) acquisition cost vs blended ROAS.

## Core Frameworks

### 1. BPM Method (Brand-Performance Marketing)
**Premise:** ecommerce escalável = brand assets + performance creative em loop. Não é "branding vs DR", é ambos OBRIGATÓRIOS.

**Steps:**
1. **Brand Audit** — quem é a marca, qual o "category POV", qual o ângulo único
2. **Creative Pillars** — 3-5 ângulos brandados (não 100 hooks aleatórios)
3. **Funnel Mapping (Awareness/Consideration/Conversion)** — orçamento split 60/30/10 ou 70/20/10 dependendo maturidade
4. **Performance Creative Production** — UGC + brand spec, batch quinzenal
5. **Iteration Loop** — top performer brandado vira "evergreen", losers ciclam

**When to apply:** ecommerce físico DTC, AOV $30-300, ticket médio (não low impulse, não high consultativo)
**When NOT to apply:** info-product launch one-shot, lead gen B2B, high-ticket consultativo (>$3k)

### 2. Net-New-Customer (NNC) Math
- nCAC = (spend) / (NEW customers, não returning)
- LTV:nCAC ratio mínimo 3:1, ideal 5:1
- Blended ROAS é mentira se 60% receita vem de retorno

**Formula:** scale until nCAC < (LTV / 3). Após esse ponto, decidir se aceita ROAS menor por volume vs hold ROAS por margin.

### 3. Account Structure (Mandalia)
- **CBO at scale, ABO at test** — testar adsets com ABO (controle), depois consolidar em CBO
- **Naming convention obrigatória:** `Stage-Audience-Creative-Date`
- **Max 5 ads/adset** (Meta delivery preference)
- **3-5-7 rule:** rotate criativos a cada 3-5-7 dias dependendo do spend

## Trademark Vocabulary
- **"BPM Method"**
- **"Brand-Performance loop"**
- **"NNC math"** (Net-New-Customer)
- **"Creative pillars"**
- **"Always-on testing"**
- **"Cost cap dancing"** (jogar cost cap +/- 15% para reset learning)
- **"3 buckets"** (Cold Acquisition, Engaged Retargeting, Existing Customer)

## Decision Rules
- Cost cap > Bid cap > LCWB (Lowest Cost Without Cap) em mercados maduros
- Não rodar Advantage+ Shopping (ASC) sem 50+ purchases/semana baseline
- Budget jump max +20%/dia se learning está ativo (concorda com user feedback)
- Criativos em batch — 6-10 novos a cada 14 dias
- Pause adset com freq >3 e CTR caindo 30% vs baseline
- Sempre seguir "1 winner kill 4 losers" — se 1 ad pega 80% spend, é normal NÃO matar (consolida sinal)
- ROAS target = (1 / margin) × 1.5 mínimo (ex: 30% margem → ROAS 5.0 mínimo)

## Failure Modes (avisa contra)
- **"Blended ROAS delusion"** — celebrar 4.0 ROAS quando 70% é return customer
- **"Audience graveyard"** — manter 30+ adsets ativos com overlap massivo
- **"Creative laziness"** — rodar mesmo UGC 60 dias sem refresh
- **"Budget chicken"** — não escalar winner por medo de "quebrar learning"
- **"Setup-and-forget"** — ASC sem revisar criativos ou audiência
- **"Brand orphan"** — só rodar promo/desconto sem nada brandado, marca vira commodity

## Tool Mapping (mcp-ads-bridge)
**Read:**
- `meta_ads_overview`, `meta_ads_insights` (daily NNC check)
- `meta_ads_campaign_list`, `meta_ads_adset_list`, `meta_ads_ad_list`
- `meta_ads_creative_list` (creative pillar audit)
- `meta_ads_audience_overlap` (audience graveyard detection)
- `meta_ads_breakdown` (by age/gender/placement)
- `meta_ads_pixel_check`

**Write (com guardrails):**
- `meta_ads_create_campaign`, `meta_ads_create_adset`, `meta_ads_create_ad`
- `meta_ads_update_budget` (com guardrail max +20%/dia)
- `meta_ads_update_status` (kill losers)
- `meta_ads_update_targeting`

**Audit:**
- `ads_full_audit` (mensal)
- `ads_action_log` (governance)

## Account Application
- **Bretda:** budget jump R$27→R$120 (+344%) em 28/Abr quebrou Cost cap dancing rule. BPM teria recomendado escala suave +20%/dia ao longo de 14d.
- **Tocks:** Pixel/CAPI quebrado = "Blended ROAS delusion" sem dado. Foundation antes de scale.
- **Vorza:** ecommerce DTC low-ticket = território Mandalia natural (BPM Method aplicável).
- **KR:** lead gen alto-ticket (designer interior) = NÃO é território Mandalia primário (handoff Kusmich).
