# Specialist Research: Pedro Sobral

## Bio
Pedro Sobral é o gestor de tráfego mais influente do Brasil, founder da **Sobral.ag** (agência) e **Comunidade Subido** (mentoria 5k+ alunos). Background economia + experiência de 8+ anos em Meta Ads para info-product e ecommerce BR. Criador da **Metodologia ABC** (Atrair, Bater, Captar) e da **Operação Diária** (rotina de gestão de tráfego diária com KPIs específicos). Voz prática, didática, em português, focada em realidade brasileira (PIX, WhatsApp, Hotmart, Eduzz, mercado info, cartão pré-pago, Pagamentos BR-specific). Ensina gestão de tráfego como ofício replicável (não "guru tactics"). YouTube channel 500k+ subscribers.

## Core Frameworks

### 1. Metodologia ABC
**Premise:** estrutura de campanha brasileira para info-product + ecommerce.
- **A — Atrair (Topo):** público frio, criativos de impacto, Lookalike 1-3% / Interesses amplos
- **B — Bater (Meio):** retargeting de engajados (vídeo 75%, IG visit, page visit) com criativos prova social/objection-handling
- **C — Captar (Fundo):** retargeting hot (LP visit, ATC, lead) com oferta + escassez + urgência

**Distribuição clássica:** 60% A / 25% B / 15% C
**When to apply:** info-product launch, ecommerce DTC BR, lead gen alto volume
**When NOT:** alto-ticket consultativo (use Kusmich), brand awareness pure

### 2. Operação Diária
**Rotina diária do gestor:**
1. **Manhã (10min):** abrir Ads Manager → CPL/CPA/ROAS últimas 24h vs baseline 7d
2. **Diagnose:** se variação >20%, identificar adset/ad responsável
3. **Decisão:** pausar loser (3 dias 0 conv), escalar winner (+20% se 3d positivo)
4. **Tarde:** revisar criativos por freq (>3 = refresh)
5. **Noite:** review WhatsApp leads recebidos, qualificar, anotar feedback comercial

**Tools BR:** Hotmart/Eduzz/Cakto reports, Meta API, Sheets, planilha CRM ou sistema (Active, RD)

### 3. CPL/CPA Caixa Preta
**Pedro insight:** CPL/CPA isolado é **mentira** — só faz sentido com:
- LTV (cálculo brasileiro: ticket × frequência × margem)
- Comissão afiliado (info-product BR tem comissão 30-60%)
- ROAS comercial (incluindo close rate manual via WhatsApp)

**Formula adaptada Brasil:**
```
CPL alvo = (LTV × margem) / (lead-to-close × 5)
```
O `× 5` é fator de segurança Brasil (atribuição mais quebrada que US, sazonalidade pix-mês, etc).

### 4. Pixel + CAPI BR-Specific
- iOS 14+ no Brasil = 60% audience
- LGPD: consent banner obrigatório (opt-in granular)
- CAPI server-side: stape.io ou Cloudflare Worker (não Pixel-only)
- Atribuição janela: 7d-click 1d-view (não 28d que UE/US default)
- Eventos BR core: PageView, ViewContent, Lead, Purchase, Contact (WhatsApp click)

## Trademark Vocabulary
- **"Metodologia ABC"**
- **"Operação Diária"**
- **"Atrair, Bater, Captar"**
- **"Subido"** (status de gestor que "domina")
- **"Engajamento ≠ Compra"** (warning)
- **"Mata loser, escala winner"**
- **"Funil ABC"**
- **"Custo por mensagem (CPMsg)"** — fundamental BR (Click-to-WhatsApp)
- **"PIX é o novo cartão"** (atribuição ecommerce BR)

## Decision Rules
- Geo SEMPRE Brasil 2076 + PRESENCE (não usar "people who lived in")
- Lookalike base = "Compradores 180d" (não Leads, qualidade > volume)
- WhatsApp Click conversion = `Contact` event (custom)
- Adset min budget R$30/d (abaixo = sem learning)
- Always-on test: 1 audience nova + 2 criativos novos por semana
- Nunca >5 PRIMARY events (lições Aslam aplicáveis BR)
- Revisar Custo por Mensagem semanalmente em Click-to-WhatsApp
- Click-to-WhatsApp NÃO indica close — sempre validar manual com vendedor
- Sazonalidade BR: receber 5º dia útil + dia 15 + dia 30 (PIX/salário) = picos
- Black Friday Nov / Carnaval Fev / Mês das Mães Mai / Pais Ago = janelas

## Failure Modes (avisa contra)
- **"Vanity CPL"** — celebrar CPL R$5 quando close rate é 0%
- **"WhatsApp Smoke Test ignorance"** — não validar se WhatsApp recebe leads (caso KR 99 leads pra número errado)
- **"Pixel-only fé"** — sem CAPI no BR pós-iOS = -40% atribuição
- **"Atribuição UE/US default"** — janela 28d em conta BR = double-count
- **"Geo poluído"** — não setar PRESENCE = pega turistas/diáspora
- **"PIX denial"** — esquecer PIX é canal #1 BR ecommerce (60%+ checkout)
- **"Hotmart amnesia"** — não conectar Hotmart conversion API = ROAS cego
- **"Engagement audience inflada"** — celebrar 100k IG followers fake convertidos
- **"Operação Diária skip"** — gestor que não abre Ads Manager 1x/dia = perde sinais

## Tool Mapping (mcp-ads-bridge)
**Read (heavy):**
- `meta_ads_overview`, `meta_ads_insights`
- `meta_ads_breakdown` (geo, hour-of-day BR-specific)
- `meta_ads_creative_list`
- `meta_ads_pixel_check`
- `meta_ads_audience_overlap`

**Write:**
- `meta_ads_create_campaign` (LEADS, ENGAGEMENT, CONVERSIONS)
- `meta_ads_create_adset` (ABC structure)
- `meta_ads_set_geo_targeting` (Brasil 2076 PRESENCE)
- `meta_ads_create_ad` (mensagens diretas WhatsApp)

**BR-Specific Audit:**
- `ads_full_audit` (filter Brasil)
- `meta_ads_destination_type_check` (validar Instant Form vs LP form vs WhatsApp)

## Account Application
- **KR:** caso textbook ABC (info/lead gen lifestyle BR). Hoje: só captura no fundo (sem A/B layers). Pedro recomendaria 3 adsets ABC com R$50/d split.
- **Tocks:** ecommerce alto-ticket BR — "Vanity CPMsg" classic (R$3.71 C007 mas 0 leads em 14d). Operação Diária teria detectado em D+1.
- **Bretda:** WhatsApp não é canal primário (LP form / Instant Form mais usado), mas Pedro recomendaria adset paralelo Click-to-WhatsApp (alinhado com Nova 2 do HYDRA mine 12/Mai).
- **Vorza:** info-product low-ticket BR = território ABC central. Pivô email é decision Pedro endossaria (BR ecommerce email tem CPL 1/10 do Meta).
