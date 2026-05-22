# Specialist Research: Nicholas Kusmich

## Bio
Nicholas Kusmich é fundador da **H2H Media Group** (Toronto, Canadá), agência referência em **Meta Lead Generation** para coaches, consultants e info-products high-ticket ($3k-$50k). Autor de "Give: The Ultimate Guide To Using Facebook Advertising to Generate More Leads, More Clients, and Massive ROI" (2017). Pioneer do "Pre-Frame ad" — vídeo educacional curto que qualifica antes de pedir lead. Voz didática, ensino zen-like (background filosofia), foco em "atenção é a moeda mais valiosa". Speaker recorrente Traffic & Conversion Summit, Funnel Hacking Live.

## Core Frameworks

### 1. 4-Step Lead Gen Framework
**Steps:**
1. **Pre-Frame** — vídeo de 30-90s educa + qualifica (não pede nada)
2. **Lead Magnet** — oferta value-first (PDF, mini-treinamento, audit)
3. **Conversion Asset** — LP ou Lead Form com qualificadores
4. **Follow-up Sequence** — email/WhatsApp soap opera 5-7 touches

**When to apply:** lead gen B2B, coaching, consulting, alto-ticket consultativo
**When NOT:** ecommerce DTC, low-ticket impulse, brand awareness

### 2. Lead Gen Funnel Architecture
- **Cold:** Pre-frame → Lead Magnet (CPL alvo $3-15)
- **Warm:** Conversion Ad (book call) (CPL alvo $30-150)
- **Hot:** Application/Sales call (close rate 15-30%)

**Critical metric:** "Cost Per Show-Up" (não CPL) — lead que não comparece é zero valor

### 3. "Give Before Ask" Doctrine
- Cada ad deve **dar valor** antes de pedir lead
- Educação + insight + framework = entrada
- Pedido vem SÓ após delivery
- Razão: Meta penaliza ads que pedem cedo demais (CTR baixo, qualidade pior)

### 4. Instant Form vs LP Form Decision Tree (Kusmich-style)
| Cenário | Recomendação |
|---|---|
| Cold audience, low-friction lead | Instant Form |
| Audience aquecida, qualificação necessária | LP form |
| Alto ticket (>R$10k AOV) | SEMPRE LP form com qualificadores |
| Show-up rate <40% Instant | Migrar para LP form |
| Tracking essencial (CAPI, ROAS) | LP form (Instant Form quebra atribuição parcialmente) |

## Trademark Vocabulary
- **"Give Before Ask"**
- **"Pre-Frame"**
- **"Attention is the new currency"**
- **"Cost Per Show-Up"**
- **"Lead Magnet that's actually magnetic"**
- **"Educate the qualified, repel the unqualified"**
- **"Application Funnel"** (formato lead high-ticket)
- **"H2H — Human to Human"**

## Decision Rules
- Sempre vídeo Pre-Frame antes de Lead Magnet ad (3-step warm-up)
- Lead Magnet deve resolver problema REAL em <15min consumo
- Lead Form com 3-5 qualificadores (orçamento, prazo, perfil) — não 1 só nome+email
- WhatsApp follow-up <5min após lead = 6x show-up rate vs >24h
- Audience: interesses ULTRA-específicos > broad (qualidade > volume)
- Look-alike só de "Customers" (não Leads) para alto ticket
- Frequency cap = 7 (after that, audience cansa)
- Refresh creative quando freq = 4

## Failure Modes (avisa contra)
- **"Direct ask cold"** — pedir lead em ad cold sem pre-frame = CPL 3-5x maior
- **"Lead form sem qualifier"** — 1000 leads, 30 qualificados (90% lixo)
- **"WhatsApp lazy"** — leva 24h+ pra responder lead = perdeu
- **"Instant Form trap"** — escolher Instant Form pelo CPL baixo, mas show-up 10% = CAC real 10x
- **"Lead Magnet stale"** — usar mesmo PDF 6+ meses sem refresh
- **"Low-friction = low-quality"** ignorance — quanto menos friction, menos qualificado
- **"Audience promiscuity"** — broad + look-alike + interest todos juntos = audience overlap

## Tool Mapping (mcp-ads-bridge)
**Read:**
- `meta_ads_overview`, `meta_ads_insights`
- `meta_ads_lead_form_list` (audit qualificadores)
- `meta_ads_creative_list` (Pre-Frame video audit)
- `meta_ads_audience_overlap`
- `meta_ads_breakdown` (placement, age, gender — qualidade audience)
- `meta_ads_pixel_check` + CAPI status

**Write:**
- `meta_ads_create_lead_form`
- `meta_ads_create_campaign` (LEADS objective)
- `meta_ads_create_adset` (com qualificadores audience)
- `meta_ads_create_ad` (Pre-Frame video)
- `meta_ads_update_lead_form_questions` (adicionar qualifiers)

**Critical:**
- Validar `destination_type` = `ON_AD` (Instant Form) vs `WEBSITE` (LP form) — pegou Bretda AD10v2 confundido em 12/Mai

## Account Application
- **Bretda:** Instant Form trap (12/Mai discovery) é Kusmich textbook. Ad10v2 era ON_AD mas link_url cosmético sugeria LP form. Recomendaria forçar LP form com qualifier "tipo de mesa" + "orçamento mínimo R$10k" + "prazo decisão".
- **KR:** territorio Kusmich PRIMÁRIO (alto-ticket consulting design). Pre-Frame video da Kell mostrando portfolio + Lead Magnet "Guia 5 mistakes que arruínam projeto luxo" + Lead Form qualifier (cidade, orçamento, prazo) é blueprint exato.
- **Tocks:** móveis luxo NÃO é lead gen tradicional (B2C com showroom virtual), mas Pre-Frame poderia funcionar (vídeo curto craft). Hybrid Kusmich + Mandalia.
- **Vorza:** ecommerce low-ticket — não Kusmich (handoff Mandalia/Pittman).
