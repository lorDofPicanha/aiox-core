---
name: Bretda Session 17/Abr P2
description: Segunda sessão 17/Abr — CP-RTG-WARM ACTIVE, 3 decisões 30-60-90 aprovadas, Google MCP bloqueado por login-customer-id header
type: project
originSessionId: 8e39d9f7-1c5d-48ea-8f0c-660ab28a19de
---
# Bretda Session 17/Abr P2 — 17:18 BRT

## Execução

### ✅ CP-RTG-WARM ativado (Meta, conta `bretda` / `act_381618241134624`)

| Tipo | ID | Status novo |
|---|---|---|
| Campaign | `120244496926800737` | ACTIVE |
| AdSet | `120244496926970737` | ACTIVE |
| Ad | `120244496928840737` | ACTIVE |

- Budget: R$20/dia ABO (mantido)
- LAL 1% Engajamento IG, Brasil PRESENCE, 25-65, iOS, FB+IG feed/stories/reels
- Creative AD05, form nativo `1795323604460936`

**Kill switches (revisão 72h = 20/Abr):**
- CPL > R$25 → pausar AdSet
- Frequency > 2.8 → LAL pequeno saturando, expandir LAL 2% ou reduzir budget
- CTR < 1,5% → trocar creative (AD04)
- 0 leads em 48h com spend ≥ R$30 → diagnosticar tracking

### ✅ Decisões 30-60-90 aprovadas (pelo Breno 17/Abr)

| # | Decisão | Escolha |
|---|---|---|
| 1 | Budget Maio/2026 | **C** — R$7,5k transicional (R$70/dia Google mantido + R$180/dia Meta) |
| 2 | CAPI Meta | **B** — Stape.io (resolve Google EC + CAPI na mesma infra) |
| 3 | Target CPL | **B** — R$80 com teto R$120 até D60 |
| 4 | LP Bretda | **SKIP** — usuário já está terminando o site, não refazer |

### 🔴 Bloqueio Google Ads MCP

**Erro:** `PERMISSION_DENIED` (403) — `USER_PERMISSION_DENIED`. "User doesn't have permission to access customer. Note: If you're accessing a client customer, the manager's customer id must be set in the 'login-customer-id' header."

**Diagnóstico:** OAuth reauth funcionou (token válido), mas o MCP bridge não está enviando o header `login-customer-id` com o MCC `7943699417`. Isso é config do bridge, não do token.

**Impacto:** análise pós-token Google Bretda não foi executada. Snapshot vigente continua sendo 16/Abr (CPL R$477, 1 conv 7d, QS 1-4).

**Fix a aplicar:** verificar `D:\jarvis\mcp-bridge\` ou config equivalente, setar `GOOGLE_ADS_LOGIN_CUSTOMER_ID=7943699417` (MCC) no env do bridge, restart.

## Fase 3 — Google Bretda Kasim Golden Ratio batch (17/Abr 17:55)

Executado via script direto `D:\jarvis\mcp-ads-bridge\scripts\bretda-17abr-kasim-batch.mjs` (bypassa MCP cache stale).

**6/6 operações OK:**

1. ✅ **+28 negatives campaign-level** (clusters: preço/barato dedup, usadas/seminova, OLX/ML/enjoei, profissional/bar/clube, aluguel/reforma/feltro, como fazer/fabricar/medidas)
2. ✅ **Criado `[mesa de jantar e sinuca]` EXACT** no ad group Bilhar+Tampo Jantar (`195850310632`), CPC R$8,10 — é o único search term converter conhecido (1 conv 7d)
3. ✅ **Core cluster bid +35%** (4 keywords em Bilhar+Tampo Jantar): `mesa de bilhar com tampo de jantar` (EXACT R$6→R$8,10), `mesa de sinuca com tampo de jantar` (PHRASE R$5→R$6,75), `mesa de bilhar que vira mesa de jantar` (PHRASE → R$6,75), `mesa de sinuca que vira mesa de jantar` (PHRASE → R$6,75)
4. ✅ **Brand Bretda bid → R$4** (5 keywords: bretda, bretda mesa, bretda bilhar, bretda sinuca, mesas bretda) — defender SERP (Golden Ratio 10%)
5. ✅ **Pausados** Bilhar Luxo (ag `195850310552`) + Sinuca Luxo (ag `195850310592`) — R$24/sem realocado implicitamente para Tampo Jantar
6. ✅ **REMOVED 10 campanhas zumbis** (todas conv_90d=0 validated):
   - `21860944285` MESA DE LUXO 29/10
   - `22166000337` [RT] ARQUITETOS
   - `22172261279` [RT] SINUCA ALTO PADRÃO
   - `22172520908` [RT] INSTITUCIONAL
   - `22176063970` [RT] PEBOLIM
   - `22176097651` [RT] TÊNIS DE MESA
   - `22176142972` [RT] SHUFFLEBOARD
   - `22406096328` [CSD] público luxo (194 conv lifetime — pré 90d, tese do que funcionou: público luxo segmentado)
   - `23131901490` [PSQ] MAX
   - `23181651505` [PSQ][LEAD]24-10

**Kasim overrides aplicados (vs proposta original):**
- Bid +35% core / -25% broad → só +35% core feito (não havia broad restante após dedup)
- REMOVE (irreversível) em vez de manter PAUSED
- Pause ad groups fracos + realocar (não faz parte da proposta original)
- Brand Bretda R$4 (ad group reativado 16/Abr, 0 imp, bid muito baixo)

## Fase 4 — Extensions batch (17/Abr 18:15)

Executado via `bretda-17abr-extensions.mjs` + `bretda-17abr-extensions-retry.mjs`.

**Callouts (+6 novos customer-level):**
- Madeira Nobre Artesanal, Garantia de 5 Anos, Atendimento Personalizado
- Design Escultural Unico, Feito Sob Medida, Cada Peca e Irrepetivel
- Total agora: 12 callouts (6 antigos + 6 novos)

**Structured Snippets (+2 novos):**
- `Modelos` → Opal, Citrino, Aurora, Espinela (linhas reais do produto inferidas das imagens)
- `Estilos` → Bilhar com Tampo Jantar, Sinuca Luxo, Pebolim Alto Padrao, Sob Medida
- Total agora: 3 snippets (Tipos + Modelos + Estilos)

**Nota técnica:** Google Ads API tem enum fixo para headers de structured snippet em pt-BR ("Modelos", "Estilos", "Tipos", "Marcas", "Servicos" → usar "Catalogo de servicos", etc). "Servicos" direto **não é aceito** → precisa escolher do enum válido.

## RSAs auditados — SKIP criação de novo

Existing RSAs já têm a estrutura Kasim-compliant:
- "Bilhar + Tampo Jantar" (ad ID `804801409379`): PIN1 "Bilhar com Tampo de Jantar", PIN2 "Mesa 2 em 1", PIN3 "Conheca os Modelos Online", 15 headlines, 4 descs
- "Brand Bretda" (ad ID `804801409385`): PIN1 "Bretda | Site Oficial"
- Todos final_urls = `https://www.bretda.com.br/`
- Criar RSA novo seria redundante — skip.

## Fase 5 — Call + WA extension (17/Abr 18:35)

- ✅ **Call extension:** `+55 47 99225-9554` (comercial) — tap-to-call mobile
- ✅ **Sitelink "Fale no WhatsApp":** `wa.me/5547992259554` com descrições
- ✅ **Snippet "Modelos" mantido** (Opal/Citrino/Aurora/Espinela — user confirmou **também se aplicam às sinucas**)
  - Houve um unlink intermediário por mal-entendido da minha parte, mas foi religado na mesma sessão

**Snippets finais ativos (3):**
- `Tipos` (original) → Mesas de bilhar, Mesas de pebolim, Mesas de luxo
- `Modelos` → **Opal, Aurora, Zurita, Espinela, Citrino, Ambar** (atualizado 17/Abr 18:50 com catálogo completo)
- `Estilos` → Bilhar com Tampo Jantar, Sinuca Luxo, Pebolim Alto Padrao, Sob Medida

## Catálogo completo Bretda (via https://prototype-tawny-omega.vercel.app/catalogo.html)
**Sinuca (6 linhas):** Opal, Aurora, Zurita, Espinela, Citrino, Ambar
**Pebolim (3):** Pebolim Ambar, Pebolim Berilo, Pebolim Opal
**Tênis de Mesa (3):** Tênis Ambar, Tênis Citrino, Tênis Cobal
**Shuffleboard:** 1 modelo

Nota: Opal/Ambar/Citrino aparecem em múltiplas categorias — são **coleções/design lines**, não tipos de mesa. Nome próprio da linha aplica across produtos.

## Oportunidades futuras do catálogo (fora do escopo atual)
- Keywords para pebolim/tenis/shuffleboard não exploradas nos ad groups atuais
- Considerar campanhas dedicadas: CP-Pebolim, CP-Tenis — possivelmente com CPL menor (competição mais baixa)
- Usar nomes de linha como keywords long-tail: "pebolim opal", "mesa de sinuca ambar"

## Fase 6 — Meta Bretda poda + concentração (17/Abr 19:10)

Chief entregou plano 4 fases (Depesh Mandalia + Nicholas Kusmich + Molly Pittman).

**Fase 1 executada (4 ops todas OK):**
1. ✅ PAUSE adset CJ1 (`120236735188260737`) Arquiteto SE iOS — redundante c/ CJ6, CPL R$12,59 (-40% pior que winners)
2. ✅ PAUSE adset CJ6 (`120243395033500737`) SE iOS Cópia — duplicata, CPL R$11,80
3. ✅ CJ7v2 (`120237168442570737`) Expansão SCO/NE Luxury: budget → R$27/dia (+50%)
4. ✅ CJ8v2 (`120237168468370737`) Expansão SCO/NE Arquitetos: budget → R$27/dia (+50%)

**Expectativa D7:** 70-90 leads (vs 41 atuais, +70%), mesmo spend R$54/dia

**Validação CAPI path:** Chief confirma **CAPI via Tocks Sales AI CRM** é o caminho superior ao Stape.io (sobrevive reconstrução do site, signal de qualidade SQL/Customer vs Lead cru). Launch target D+21 (8/Mai).

### Roadmap pendente

- **Fase 2 (D+1 a D+7):** criar 3 Custom Audiences (Leads 180d/365d, IG Engagers) + 3 Lookalikes (LAL Leads 1%/2%, LAL IG 1%) → lançar CP-PROSPECTING-LAL-LEADS R$40/d CBO em D+2 (19/Abr)
- **Fase 3 (D+7 a D+21):** CAPI via CRM Tocks Sales AI — 8/Mai launch target
- **Fase 4 (contínua):** 6 creatives novos (Arquiteto×2 + Luxury×2 + cross×2 hooks Nicholas), cadence 2/semana

### Decision gates Meta

- **D+3 (20/Abr 19h)** CP-RTG-WARM: CPL<R$15 escalar R$40/d, R$15-25 manter, >R$25 pause
- **D+7 (24/Abr)** consolidado: CPL≤R$12, 70+ leads, CJ7v2+CJ8v2 CPL≤R$10
- **D+14 (1/Mai)** gate para escalar R$54/d → R$180/d (plano Maio)

### Manter PAUSED (não deletar) 32 zumbis
Chief: learning histórico tem valor pra Meta reutilizar em campanhas futuras do mesmo BM. Filtro de exclusão D+30: paused &gt;90d + spend &lt;R$100 + 0 conv.

### Risco #1 (Depesh BPM)
Otimizar por evento errado destrói brand em luxury. Evitar PageView/AddToCart/lowest-CPL. Quando CAPI do CRM ativar: otimizar por **SQL** (D+21) e **Customer** (D+60).

## Fase 7 — Meta Fase 2 setup (17/Abr 19:50)

### Estrutura criada (tudo PAUSED por guardrail)
- **Campanha:** `CP-PROSPECTING-LAL-LEADS` id=`120244500365840737`, CBO R$40/d, OUTCOME_LEADS, bid_strategy LOWEST_COST_WITHOUT_CAP
- **AdSet 1:** `CJ-LAL-IG-1% - Brasil - iOS - 30-65` id=`120244500389880737`
  - LAL 1% IG Engajamento (seed existente `120244118776810737`, 6.500-7.600 pessoas)
  - Brasil (countries BR) + home/recent location types
  - age 30-65, iOS, FB feed/story + IG stream/story/reels
  - targeting_relaxation: lookalike=1, advantage_audience=0
  - optimization_goal: LEAD_GENERATION
  - destination_type: ON_AD (form nativo)
- **Ad:** `AD05 - LAL IG Prospecting` id=`120244500401490737` (reusa creative vencedor `1615723886403281` — 12 leads/R$93 em CJ7v2)

### Bloqueios encontrados
- **Token user-level não permite criar Custom Audience via API** (mesmo com subtype ENGAGEMENT). Meta retorna "Formato da regra JSON inválido" mesmo com formato copiado da CA existente. Precisa:
  - System User token com `ads_management_custom_audiences` permission, OU
  - Criação manual via Ads Manager UI

### Próximo passo — AGUARDANDO USUÁRIO
1. User cria manualmente via Ads Manager:
   - **"Bretda - Leads Form 365d"** (retention 365d, 6 forms: `1795323604460936`, `1373886644143591`, `25022395347422134`, `25814967104756914`, `4207354499581539`, `1870653553527076`)
   - **"Bretda - Leads Form 180d"** (mesmo seeds, 180d)
2. User me passa os 2 CA IDs
3. Eu crio: 2 Lookalikes (LAL Leads 1% + LAL Leads 2%) + 2 adsets adicionais no CP-PROSPECTING-LAL-LEADS

### Lead Form IDs descobertos (uso futuro)
6 forms na conta, 3 ACTIVE em ads atuais:
- `1795323604460936` (17 ads, 3 ACTIVE — AD05 CP-RTG-WARM e CP2)
- `1373886644143591` (11 ads, 2 ACTIVE — CP2)
- `25022395347422134` (6 ads, 2 ACTIVE)
- 3 outros sem ads ativos

### Launch target CP-PROSPECTING-LAL-LEADS: D+2 (19/Abr)
Após 3 adsets criados + unpause. Kill switches no D+5 review.

## Fase 7.5 — CP-PROSPECTING-LAL-LEADS completo (17/Abr 20:10)

### Custom Audience criada manualmente (user)
- `Bretda - Leads Form 90d` id=`120244500815760737` — submitted forms, 90d retention (Meta limita a 90d pra Lead Ads)
- Seeds todos os 6 forms ativos + inativos da conta

### Lookalikes criados via API
- `Bretda - LAL 1% - Leads Form 90d` id=`120244500845820737` (similarity, 1%, BR)
- `Bretda - LAL 1-2% - Leads Form 90d` id=`120244500855530737` (custom_ratio 0.01-0.02, BR — stacked, não overlapping com 1%)

**Learning Meta API:** Para LAL stacked (ex: 1-2%), use `type: custom_ratio` + `starting_ratio` + `ratio`. `custom_ratios` (plural) dá erro. `similarity` com mesmo ratio duplica → 409.

### Estrutura final CP-PROSPECTING-LAL-LEADS
```
CP-PROSPECTING-LAL-LEADS id=120244500365840737 [PAUSED, CBO R$40/d, OUTCOME_LEADS, LOWEST_COST_WITHOUT_CAP]
├── CJ-LAL-IG-1% - Brasil - iOS - 30-65 (120244500389880737) — PAUSED
│   └── AD05 LAL IG Prospecting (120244500401490737) — creative 1615723886403281
├── CJ-LAL-1%-Leads - Brasil - iOS - 30-65 (120244500860080737) — PAUSED
│   └── AD05 - LAL-1%-Leads (120244500861360737) — creative 1615723886403281
└── CJ-LAL-1-2%-Leads - Brasil - iOS - 30-65 (120244500863740737) — PAUSED
    └── AD05 - LAL-1-2%-Leads (120244500864440737) — creative 1615723886403281
```

### Decision unpause
**Aguardar 24-48h pra LALs hidratarem** (Meta computa seed matching em background). Launch ideal: **D+2 (19/Abr)**.

Unpause order quando pronto:
1. PAUSED → ACTIVE: campaign `120244500365840737`
2. PAUSED → ACTIVE: 3 adsets (ou deixar Meta CBO escolher o winner)
3. PAUSED → ACTIVE: 3 ads

Kill switches D+5 (24/Abr):
- CPL LAL Leads 1% > R$20 → pause
- CPL LAL Leads 1-2% > R$25 → pause (tier menos qualificado)
- CPL LAL IG 1% > R$30 → pause (proxy seed)
- Meta vai prioritizar winner via CBO — esperado 1 vencer alto vs outros
- [ ] **Novo RSA** com 8 headlines pinados + 3 descriptions otimizadas (Bilhar+Tampo Jantar)
- [ ] **Stape.io** (CAPI Meta + Google Enhanced Conversions) — 1 semana, destrava Smart Bidding D30+
- [ ] **4 conversion actions novas** no Google Ads: Lead Form Submit, Configurator Complete, Showroom Schedule, WhatsApp Qualified
- [ ] **Aplicar budget Maio transicional** (R$180/dia Meta, R$70 Google) em 1º Maio
- [ ] **Corrigir MCP bridge login-customer-id header** + novo OAuth com user MCC access (para Tocks/KR voltarem)
- [ ] **Revisar CP-RTG-WARM em 72h** (20/Abr): CPL, frequency, CTR, volume

## Decision gates Kasim

- **D7 (24/Abr):** CPL target ≤R$100, 3+ conv, IS Lost Rank <45%
- **D14 (1/Mai):** IS Lost Rank ≤40% ou bloquear gasto até LP melhorar; 7+ conv
- **D30 (10/Mai):** 10+ leads, CPL ≤R$90, IS Lost Rank ≤35% ou migrar 100% Meta

**Expectativa imediata com batch executado:** IS Lost Rank 60% → 35-40% em 7d; CPL R$477 → R$120-180; conv 1 → 3-4 por semana.

## Why
Decisões 30-60-90 destravadas após 24h de análise e 1 session de emergency (16/Abr). CP-RTG-WARM ativado fecha a estrutura Meta do nicho luxury (prospecting + RTG warm). Google continua como risco gerenciado (kill switch 10/Mai).

## How to apply
- Antes de escalar Google, destravar: login-customer-id + Enhanced Conversions
- Não mexer no site principal; usuário está trabalhando nele
- Em 20/Abr fazer check CP-RTG-WARM e decidir escala ou kill
