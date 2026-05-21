---
name: kr-v4-link-clicks-18mai
description: "🟡 KR V4 LINK_CLICKS migration parcial — campanha + 2 adcreatives criados, mas adset/ad bloqueado pelo policy hold subcode 2446325. Quando user destravar BM, 2 comandos resolvem (create adsets + create ads). Trigger: 'religa kr'."
metadata: 
  node_type: memory
  type: project
  originSessionId: bb48a62d-1c1f-42bb-acfe-9160e5375f4c
---

# KR — V4 LINK_CLICKS Migration 18/Mai/2026

## Trigger user
`migra kr para link_clicks` (18/Mai 23:xx, pós briefing buscador-licitacoes)

## Decisão arquitetural
Eliminar 100% o welcome card CTM intermediário (bug confirmado 16/Mai = 99 dropouts no card).
Migrar de **CTM (OUTCOME_ENGAGEMENT + CONVERSATIONS optimization)** → **LINK_CLICKS (OUTCOME_TRAFFIC + LINK_CLICKS optimization)** com URL `wa.me/5561998720330` hardcoded.

**Trade-off aceito:** perde métrica `messaging_conversation_started_7d` + bidding-on-conversation. Ganha: click vai direto pra WhatsApp do dispositivo da pessoa, sem Meta cards intermediários, mensagem real chega na Kell.

## O que foi feito ✅

### 1. Auditoria V3 (campanha `120246823605310268`)
- 3 adsets: A (Recém Casados, PAUSED), B (365D engagement, ACTIVE), C (90D engagement, ACTIVE)
- 4 ads CTM com destination=WHATSAPP, optimization=CONVERSATIONS
- Creatives V3 são vídeo `912538781325546` thumbnail `image_hash 910753afbceae206c861a5b209593657`
- Confirmação Graph API: link_data vazio (são CTM video_data, não link_data)

### 2. Campanha V4 criada ✅
- **ID:** `120248219339400268`
- **Name:** `[V4 LINK_CLICKS] WhatsApp Direct - Arquitetura e Design`
- **Objective:** OUTCOME_TRAFFIC
- **Status:** PAUSED
- **Buying:** AUCTION

### 3. AdCreatives criados ✅ (2 prontos)
**Surpresa importante:** policy hold bloqueia adset+ad write, mas **NÃO bloqueia adcreative**. Aproveitei pra criar os 2 já:

| Creative ID | Nome | Copy estilo | image_hash |
|-------------|------|-------------|------------|
| `1552546419626127` | V4 LINK_CLICKS - wa.me hardcoded (B Showoff REUSE) | curta, foco em "marcenaria sob medida + design + atendimento direto Kell" | 910753afbceae206c861a5b209593657 |
| `2435561066925630` | V4 LINK_CLICKS - wa.me hardcoded (C Qualificada) | rica, "projeto sob medida em Brasília + residências alto padrão" | 910753afbceae206c861a5b209593657 |

Ambos com:
- `page_id`: 543056628881459 (KR Interiores Design)
- `instagram_user_id`: 17841401293654853
- `link`: `https://wa.me/5561998720330?text=Olá+Kell,+vi+seu+anúncio+e+quero+conversar+sobre+meu+projeto.`
- `call_to_action.type`: WHATSAPP_MESSAGE
- Reusam image_hash do vídeo V3 (thumbnail) — visual continuidade

## O que NÃO foi feito (bloqueado por policy hold) ❌

### Adsets V4-B e V4-C
**Erro:** `error_subcode: 2446325` — "A conta comercial não cumpre as Políticas de Publicidade"
- Confirmado via MCP bridge E via curl Graph API direto — mesmo erro
- Persiste desde 16/Mai

**Spec pronto pra quando destravar:**

```
ADSET V4-B
  name: B - [LINK] Engajamento IG 365D + DF + 30-55
  campaign_id: 120248219339400268
  daily_budget: R$15
  optimization_goal: LINK_CLICKS
  billing_event: IMPRESSIONS
  bid_strategy: LOWEST_COST_WITHOUT_CAP
  destination_type: WEBSITE
  targeting:
    age: 30-55
    geo: DF (region 444), home+recent
    custom_audience: 120213977576940268 (Engajamento IG Todos - 365D)
    platforms: facebook+instagram
    positions: facebook_reels, ig stream/search/profile_reels/story/explore/reels/explore_home/profile_feed
    devices: mobile
    advantage_audience: 0

ADSET V4-C
  name: C - [LINK] Engajamento IG 90D + DF + 30-55
  campaign_id: 120248219339400268
  daily_budget: R$15
  optimization_goal: LINK_CLICKS
  billing_event: IMPRESSIONS
  bid_strategy: LOWEST_COST_WITHOUT_CAP
  destination_type: WEBSITE
  targeting:
    age: 30-55
    geo: DF (region 444), home+recent
    custom_audience: 120213977616790268 (Engajamento IG Publicação ou Anúncio - 90D)
    platforms: facebook+instagram
    positions: facebook_reels, ig stream/search/profile_reels/story/explore/reels/explore_home/profile_feed
    devices: mobile
    advantage_audience: 0
```

### Ads V4-B + V4-C
**Spec pronto:**
- AD B: adset_id={V4-B}, creative_id=`1552546419626127` (REUSE copy), status=PAUSED
- AD C: adset_id={V4-C}, creative_id=`2435561066925630` (Qualificada copy), status=PAUSED

## Plan post-destravamento (2 comandos quando user resolver policy hold)

```bash
# 1. Criar 2 adsets (espera 4 segundos entre cada pra evitar rate limit)
# 2. Criar 2 ads attach aos adsets (já tem creative_id pronto)
# 3. Ativar campanha quando PIX confirmar saldo
```

Eu (Orion) executo em ~2min via `religa kr`.

## Estado financeiro KR
- Balance: **R$10.41** (sem mudança desde 17/Mai)
- Spend_cap: 0
- Runway: 1-2d no R$30/d
- Precisa PIX ~R$500-700 antes do unpause

## 🔴 Pendências Breno (bloqueiam ativação)

1. **Resolver BM policy hold** — `business.facebook.com/accountquality/132177700923045`
2. **PIX KR** R$500-700

## Triggers próxima sessão

- `policy hold resolvido kr` — Orion termina criação dos adsets + ads (campanha já pronta)
- `religa kr` — combo destravamento + ativação (precisa PIX OK também)
- `pix confirmado kr` — Orion ativa V4 se adsets+ads já existirem

## Refs

- supersedes [[runbook_kr_whatsapp_p2_15mai]] parcialmente — agora plano não é "consertar CTM" e sim "migrar pra LINK_CLICKS"
- updates [[session_kr_diagnostic_revised_17mai]] — V4 LINK_CLICKS é a alternativa estrutural mencionada no §"Alternativa estrutural a considerar" do diagnóstico
- mantém [[reminder_kr_kell_pending_12mai]] como obsoleto (99 leads = welcome card dropouts, não inbox)

## Aprendizado-âncora

**Policy hold subcode 2446325 bloqueia ad-level + adset-level write, mas NÃO bloqueia:**
- Campaign-level create
- AdCreative isolated create
- Read operations

Sempre que conta estiver em policy hold, **pré-criar campaign + adcreatives prontos pra atribuir** quando destravar. Reduz tempo de relançamento de 30min pra 2min.

## MCP context
mcp-ads-bridge ativo via tool. Token KR ativo. Direto Graph API testado e funcional como fallback.
