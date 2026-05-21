---
name: Sessão KR Audit + Reativação Bloqueada 28-29/Abr
description: Log completo da sessão Orion — auditoria pós-restart KR, descoberta do site sem pixel, criação campanha REATIVAÇÃO V3 PAUSED, bloqueio Page permission pendente Kell.
type: project
originSessionId: 877b1996-ea12-4314-ba46-ebdb9d6fadcf
---
# Sessão KR Audit + Reativação 28-29/Abr/2026

## Contexto inicial

User pediu "retome com o projeto kr" pós-restart Claude Code. Memory anterior (28/Abr) deixou o checkpoint: validar `meta_ads_list_accounts` (4ª conta), pixel check, baseline overview.

## Trabalho executado (cronológico)

### 1. Validação MCP Bridge pós-restart
- ✅ KR aparece como 4ª conta: `act_210585430466029`
- ✅ Token Vorza funcionando via partnership
- ✅ 2 pixels detectados (495385076720880 [iMotion] 2024 + 154170033555238 Designer Kelline 2021)

### 2. Audit lifetime
- **R$ 20.599,80 spent** (lifetime, NÃO conta nova como plano 17/Abr previa)
- 32 campanhas históricas, 17 com dados
- 1.594 conversas WhatsApp acumuladas
- CTR médio 2,30% / CPC R$1,72 / CPM R$39,72
- 1 campanha "ACTIVE" zumbi (`120237058548130268`) com stop_time passado → **PAUSADA por mim** (zero spend 30d confirmado)

### 3. Top performers descobertos
| Tipo | Campanha | CPL conversa |
|---|---|---|
| Joia (FALSO POSITIVO) | "Simplesmente impecável" | R$1,33 — mas é #achadinhos (afiliado low-ticket), não captação projeto |
| Escala validada V1 | [ENG] [MSG] V1 | R$18,23 / 130 conversas |
| Escala saturada V2 | [ENG] [MSG] V2 | R$31,39 / 473 conversas / freq 3,6 (fadiga) |

### 4. 28 Custom Audiences mapeadas
- ✅ Engagement IG/FB por janela (7-365D)
- ✅ Vídeo Views 75/95/ThruPlay 365D
- ⭐ "Engajamento IG Todos 365D": **115.900-136.400 pessoas** (rica)
- ❌ Zero retargeting Pixel
- ❌ Zero LAL
- ❌ Zero customer list
- ❌ Zero excludes

### 5. Targeting maturo (16 adsets V2)
- Geo: Brasília hyper-local (PP/Águas Claras/Park Way/Noroeste/Sudoeste/Jardim Botânico) raio 3-16km
- Idade dominante: 30-55
- Life events validados: Newlywed (3m/6m/1y), Recently moved
- Interesses: Reforma, First-time buyer, New House, Home construction, Luxury Lifestyle
- Behaviors: Frequent international travelers, People who prefer high-value goods in Brazil
- Brand affinity (proxy renda): Dior, Tom Ford, Bulgari, Tiffany, Bottega, Cartier
- Device: iPhone 14+ / iOS 17+
- Placement: Instagram-only mobile
- Optimization: CONVERSATIONS / WhatsApp message
- Bid: LOWEST_COST_WITHOUT_CAP

### 6. ACHADO CRÍTICO — site sem pixel há 4 anos
WebFetch + curl em krinteriores.com.br:
- Stack: WordPress + Elementor Pro + Hello theme + Google Site Kit
- ✅ Google Tag `GT-PLTDF9J5` instalado
- ❌ **ZERO Meta Pixel disparando** (nem 495385076720880 nem 154170033555238)
- ❌ ZERO CAPI server-side
- ❌ ZERO conversion events Meta
- ✅ WhatsApp link: `https://wa.me/5561998720330` (sem UTM, sem evento)

**Implicação:** R$20.599 gastos em 4 anos com **zero atribuição de site**. Toda otimização foi in-Meta (messaging connection events). Por isso CPL R$31 é tão bom apesar disso.

### 7. Decisões da Kell (compiladas)
| # | Pergunta | Resposta |
|---|---|---|
| 1 | Pixel canônico? | "Faça como achar melhor, não apagar" → instalar [iMotion] novo, manter antigo |
| 2 | Por que pausou? | Gestor antigo disse "Meta não dá resultado" (incompetência confirmada por matemática) |
| 3 | Customer list? | NÃO tem CSV de clientes |
| 4 | Budget? | R$50/dia (R$1.500/mês) |
| 5 | Criativos? | Tem muito conteúdo, criaria novos sem problema |

### 8. Argumento ROAS contra gestor antigo
CPL R$31 × ticket interiores PP/Águas Claras:
- Pessimista 3% × R$30k → ROAS **70×**
- Realista 5% × R$50k → ROAS **193×**
- Otimista 8% × R$80k → ROAS **495×**

Mesmo no pior cenário, R$1 → R$70. Gestor antigo nunca calculou — só olhou CPM/CPC.

### 9. Criação campanha + adsets (parcialmente bloqueado)
- ✅ Campanha `120246823605310268` "[REATIVAÇÃO] [MSG] [V3] Arquitetura e Design de Interiores" criada PAUSED
- ❌ 3 adsets bloqueados com erro `1487202`: "Permissões da Página insuficientes"
- ✅ Page ID descoberto via `meta_ads_audience` em adset existente: `543056628881459`

## 🚨 Bloqueio crítico (resolvível em 5min pela Kell)

Setup partnership 28/Abr compartilhou ad account, mas no Meta cada asset é separado:
- ✅ Ad Account `act_210585430466029` — compartilhada
- ❌ **Página FB `543056628881459`** — não compartilhada com Vorza
- ❌ Pixel `495385076720880` — não compartilhado (bonus)

**Instrução literal pra Kell:**
1. business.facebook.com → Configurações Empresariais
2. Páginas → "KR Interiores Design" → Adicionar Parceiro → BM `2744791262542284` (Vorza), role Anunciante
3. Fontes de Dados → Pixels → "[iMotion] Pixel | Kell Rodrigues" → mesmo BM, role Advertiser
4. Avisar quando concluir

## Schemas dos 3 adsets prontos (re-execute quando destravar)

Todos com `account=kr`, `campaign_id=120246823605310268`, `optimization_goal=CONVERSATIONS`, `billing_event=IMPRESSIONS`, `destination_type=WHATSAPP`, `bid_strategy=LOWEST_COST_WITHOUT_CAP`, `targeting_automation={"advantage_audience": 0}`, `promoted_object={"page_id": "543056628881459"}`.

### Adset A — Refresh V1 vencedor (R$20/dia)
```json
{
  "name": "A - [INSTA] [MSG] Recém Casados + Brasília 16km + 30-60 (Refresh V1)",
  "targeting": {
    "age_min": 30, "age_max": 60,
    "flexible_spec": [{"life_events": [
      {"id": "6002714398172", "name": "Newlywed (1 year)"},
      {"id": "6003050226972", "name": "Newlywed (6 months)"},
      {"id": "6013133420583", "name": "Newlywed (3 months)"}
    ]}],
    "geo_locations": {
      "custom_locations": [{"distance_unit": "kilometer", "latitude": -15.821039, "longitude": -47.970924, "radius": 16, "primary_city_id": 254406, "region_id": 444, "country": "BR"}],
      "location_types": ["home", "recent"]
    },
    "publisher_platforms": ["instagram"],
    "instagram_positions": ["stream", "ig_search", "profile_reels", "story", "explore", "reels", "explore_home", "profile_feed"],
    "device_platforms": ["mobile"]
  }
}
```

### Adset B — Engajamento IG 365D (R$20/dia)
```json
{
  "name": "B - [INSTA] [MSG] Engajamento IG 365D (115k seed) + DF + 30-55",
  "targeting": {
    "age_min": 30, "age_max": 55,
    "custom_audiences": [{"id": "120213977576940268", "name": "Engajamento IG Todos - 365D"}],
    "geo_locations": {"regions": [{"key": "444", "name": "Federal District", "country": "BR"}], "location_types": ["home", "recent"]},
    "publisher_platforms": ["instagram"],
    "instagram_positions": ["stream", "ig_search", "profile_reels", "story", "explore", "reels", "explore_home", "profile_feed"],
    "device_platforms": ["mobile"]
  }
}
```

### Adset C — Retargeting IG 90D (R$10/dia)
```json
{
  "name": "C - [INSTA] [MSG] [RTG] Engajamento IG 90D + DF + 30-55",
  "targeting": {
    "age_min": 30, "age_max": 55,
    "custom_audiences": [{"id": "120213977616790268", "name": "Engajamento IG Publicação 90D"}],
    "geo_locations": {"regions": [{"key": "444", "name": "Federal District", "country": "BR"}], "location_types": ["home", "recent"]},
    "publisher_platforms": ["instagram"],
    "instagram_positions": ["stream", "ig_search", "profile_reels", "story", "explore", "reels", "explore_home", "profile_feed"],
    "device_platforms": ["mobile"]
  }
}
```

## Tasks state (atualizado 30/Abr)

| ID | Status | Notas |
|---|---|---|
| #7 Criar campanha REATIVAÇÃO V3 | ✅ completed | id `120246823605310268` |
| #8 Adset A — Refresh V1 | ✅ completed 30/Abr | id `120246936876500268` PAUSED R$20/d |
| #9 Adset B — Engajamento IG 365D | ✅ completed 30/Abr | id `120246936885880268` PAUSED R$20/d |
| #10 Adset C — Retargeting 90D | ✅ completed 30/Abr | id `120246936886890268` PAUSED R$10/d |
| #11 Criar 1 ad por adset | ✅ completed 30/Abr | A=`120246937383360268` AD14 / B=`120246937384220268` AD17 / C=`120246937384680268` AD12 — REUSE creatives existentes |
| #12 Pixel install krinteriores.com.br | ⏸ pending | Kell instalar PixelYourSite |
| #13 Customer list / projetos fechados 12m | ⏸ pending | Kell exportar (denominador ROAS) |

## 🚀 ATIVAÇÃO 30/Abr (KR Meta voltou a rodar)

7/7 calls update_status sequenciais sem erro. Camp + 3 adsets + 3 ads → todos ACTIVE.
Lição reforçada: sequencial em vez de paralelo evita anti-spam (mesmo conta com R$20k histórico).

## 🎯 Resolução do bloqueio (30/Abr)

Após Kell atribuir System User do Vorza à Page com "Gerir Página":
- Erro `1487202` (Permissões da Página) **sumiu** ✅
- Apareceu erro novo `1870227`: `targeting_automation` precisava ir **DENTRO de `targeting`**, não top-level. Movido, passou.
- 3 adsets criados PAUSED em paralelo, sem rate limit.

**Atualizar `feedback_meta_partnership_assets.md`:** confirmar que após System User → Page assignment, criação de adset funciona normalmente.

## 🔬 Investigação 29/Abr noite — refinamento do bloqueio

**Tentativa 1 (após Kell mandar convite Page → user pessoal):** erro `1487202` persistiu.
**Razão:** convite era Page → User pessoal (Breno), não Page → BM Vorza. API usa token do BM, não da pessoa.

**Tentativa 2 (após Kell adicionar BM Vorza como Partner da Page):** erro `1487202` persistiu.
**Razão refinada:** Page agora aparece DENTRO do BM Vorza (Definições → Contas → Páginas → "KR Interiores Design — DESIGNER KELLINE RODRIGUES é o proprietário disto"), MAS:
- "0 pessoas estão atribuídas a esta Página do Facebook"
- O **System User** do BM Vorza (que gera o token usado pelo MCP) não está atribuído à Page
- Sem System User atribuído, mesmo com Page no BM, API responde `1487202`

**Bloqueio atual (29/Abr 19h):** Breno NÃO tem nível de acesso pra atribuir System User à Page. Precisa pedir Kell pra fazer caminho completo:

1. business.facebook.com → BM Kell
2. Configurações → **Utilizadores → Utilizadores do sistema**
3. Selecionar System User do BM Vorza (visível como partner-system-user) OU criar novo
4. **"Adicionar ativos"** → Páginas → KR Interiores Design
5. Permissão: **"Gerir Página"** (NÃO só "Criar anúncios" — esse às vezes não basta)

OU alternativa mais simples (se Kell tiver Admin da Page direto):
1. Definir System User do BM Vorza como **Admin direto** da Page do lado dela (não via partner)
2. Mas isso requer Kell saber qual é o System User ID do Vorza

**Estado:** Breno pediu Kell, AGUARDANDO. Manter checkpoint pra re-execute imediato quando vier confirmação.

## Lição aprendida

Partnership Meta tem **3 camadas separadas** que não se cascateiam:
1. Ad Account → BM (compartilhado 28/Abr ✅)
2. Page → BM (compartilhado 29/Abr ✅)
3. **System User → Page assignment dentro do BM destino** (PENDENTE — sempre esquecido)

Atualizar `feedback_meta_partnership_assets.md` com essa nuance.

## Próxima sessão (30/Abr → adiante)

User rodando MANUAL (sem cloud routine). Checkpoints sugeridos:

| Quando | Comando | O quê |
|---|---|---|
| +24h (01/Mai 14h) | `meta_ads_overview account=kr date_preset=yesterday` | Confirmar impressões > 0 |
| +72h (03/Mai) | `meta_ads_insights` por adset | CPL parcial, freq, hook saturation. Pausar perdedor, escalar vencedor |
| +7d (07/Mai) | Relatório completo | Decisão de escala R$100-200/d |
| +14d (14/Mai) | Pedir Kell projetos fechados | Calcular ROAS real vs estimativa 70-495× |

Pendências paralelas (não bloqueiam):
1. Kell instalar pixel `495385076720880` em krinteriores.com.br via PixelYourSite
2. Kell exportar lista projetos fechados 12m + ticket médio (denominador ROAS)
3. CAPI server-side (PixelYourSite Pro) — bonus

IDs LIVE (memorizar):
- Camp: `120246823605310268`
- Adset A: `120246936876500268` / Ad A: `120246937383360268` (Newlywed Brasília)
- Adset B: `120246936885880268` / Ad B: `120246937384220268` (Eng IG 365D)
- Adset C: `120246936886890268` / Ad C: `120246937384680268` (RTG 90D)

## Arquivos relacionados
- `project_kr_pixel_audit_28abr.md` — plano completo + bloqueio
- `project_kr_meta_setup_28abr.md` — setup partnership original
- `feedback_meta_partnership_assets.md` — lição aprendida (NOVO)
