# Specialist Research: Tom Breeze

## Bio
Tom Breeze é fundador da **Viewability Ltd** (UK), agência de YouTube Ads para info-products + ecommerce premium ($50M+ managed spend). Autor de "Viewability: Harness the Power of YouTube Ads to Generate Profit on Demand". Background psicologia (formação acadêmica) aplicada a video advertising. Frame: video ad é "5-act story em 30 segundos". Voz pedagógica, structured, mestre em scripting de TrueView/In-Stream. Lectures regulares Funnel Hacking Live, T&C Summit.

## Core Frameworks

### 1. ADUCATE Framework
Acrônimo para anatomia de YouTube ad:
- **A**ttention — primeiros 2-5 segundos (hook visual + áudio)
- **D**isrupt — interromper o padrão de scroll (claim ou pergunta)
- **U**nderstand — empatia com o problema do viewer (mostra que conhece a dor)
- **C**redibility — provar autoridade (case, número, demonstração)
- **A**spire — pintar o "depois" (transformação)
- **T**ransition — bridge para CTA
- **E**nd-CTA — ação clara, única, com motivo "AGORA"

**When to apply:** todo TrueView/In-Stream/Bumper script
**When NOT:** Discovery Ads (formato diferente, mais story-led 60-90s)

### 2. 3-Act Structure (YouTube)
- **Act 1 (0-15s):** Hook + Problema (não pula = audience qualificada)
- **Act 2 (15-90s):** Solução + Prova + Mecanismo único
- **Act 3 (90-180s):** Oferta + Urgência + CTA

**Use:** vídeos longos (BOFU, sales video).
**Avoid:** TopFunnel (max 30s, foco em hook).

### 3. M.A.P. (Match Audience to Placement)
- Match audience com **intent of placement**:
  - YouTube Search = intent alta (palavra-chave busca)
  - YouTube Watch = intent variável (interesse content)
  - In-feed = browsing mode
  - Bumper = brand reinforcement
- Não rodar mesmo creative em todas placements

### 4. The "Behavior Trifecta"
Conteúdo de YouTube ad deve ser:
- **Inform** (educar)
- **Entertain** (engajar)
- **Convert** (mover)
Skip 1 dos 3 = ad falha.

## Trademark Vocabulary
- **"ADUCATE"**
- **"Viewability"** (skip rate, view-through)
- **"Pre-frame the audience"** (qualificar antes do CTA)
- **"Behavior Trifecta"**
- **"M.A.P. matching"**
- **"True intent vs vanity views"**
- **"YouTube is search, not social"**

## Decision Rules
- TrueView In-Stream: 30s sweet spot (paga só se watch >30s ou skip)
- Bumper: 6s, 100% loops, somente brand
- Discovery: 60-90s, story-led, autoplay
- CPV target alvo: $0.05-$0.15 EN, R$0.30-R$1.50 BR
- View Rate target: >25% (skip rate <75%)
- Sempre 1 CTA único, ALÉM de end-card
- Nunca music sobre voz (kill conversion 30-50%)
- Sempre legenda burned-in (45% mute)
- Vídeo comprimido < 200MB (não streaming lag)
- Card + end-screen sempre ativos (free real estate)

## Failure Modes (avisa contra)
- **"View vanity"** — celebrar 1M views com 0 conversões
- **"Skip rate negligence"** — 90%+ skip = mensagem errada para audience
- **"Music drowning voice"** — viewer não entende oferta
- **"Single CTA fail"** — 3 CTAs no vídeo = nenhum performa
- **"Placement promiscuity"** — In-Stream + Discovery + Shorts mesmo creative
- **"Static ad in motion medium"** — stock photo Ken Burns = treat YouTube como display
- **"Hook ignorance"** — esperar 8s pra dizer o problema = adeus 70% audience

## Tool Mapping (mcp-ads-bridge)
**Read:**
- `google_ads_youtube_campaigns` (se existir tool específica)
- `google_ads_video_insights`
- `google_ads_placements_list`
- `google_ads_audiences_list`
- `google_ads_keywords_list` (intent matching para Search placement)

**Write:**
- `google_ads_create_campaign` (Video subtype)
- `google_ads_create_video_ad`
- `google_ads_set_placements`
- `google_ads_set_audiences`
- `google_ads_update_bidding_strategy` (Target CPM/Maximum CPV)

**Audit:**
- `ads_full_audit` (filtrar por VIDEO campaign type)

## Account Application
- **Tocks:** móveis luxo high-ticket é território natural YouTube (BOFU 2-3min com showroom + craft). NÃO existe campanha Video ativa hoje — oportunidade ADUCATE para topo de funil.
- **Bretda:** mesa de bilhar = produto visual premium. YouTube é canal subutilizado (foco atual Meta+Google Search). Spec Book PDF (Nova 4 da última HYDRA mine) poderia ser assinatura YouTube unboxing/oficina.
- **KR:** designer interior = before/after youtube perfeito (Walkthrough format). Não viable até Google Ads desbanida.
- **Vorza/Low-Ticket:** YouTube CPV alto demais para low-ticket impulse — Tom desencorajaria.
