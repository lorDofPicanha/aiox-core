# 04 — Aplicações Cross-Account

**Autor:** Atlas
**Data:** 2026-05-15
**Objetivo:** Para cada conta do portfolio (Bretda, Tocks, Vorza, Synkra hipotético), traduzir a estrutura Bretda em config concreta, com elementos a manter/ajustar, CAC esperado vs ceiling, e bloqueadores conhecidos.

---

## Aplicação 1 — Bretda (Self-replicate + Scale-up)

### Situação atual
- Conta `act_381618241134624` ATIVA
- R\$90/d Meta + R\$60/d Google
- 90d Meta: 503 leads / R\$7.887 / CPL R\$15,68
- CAC ceiling (memory): R\$2.100
- **Ainda não sabemos taxa fechamento real** (gap crítico — ver `05-gaps-risks.md`)

### Veredito: KEEP-CURRENT + ADD-CAPI + VALIDATE-CLOSE-RATE

A estrutura está performando. O risco maior NÃO é re-engenharia da estrutura — é **descobrir, em 30-60d, que close-rate é <0,5% e estamos queimando R\$8k/trimestre sem return**.

### Manter (não tocar)
- Interest stack Architects + Interior Designers + Luxury Goods
- iOS-only
- Geo 11 estados (Sudeste + Sul + Centro-Oeste)
- Age 30-60
- Instant Form + 8 ads mix
- LOWEST_COST sem cap (conta madura)
- Dual structure CP1 + CP2

### Ajustar
- **CP3 P/Final paused — review:** decidir se reativa ou mata permanente. [DATA GAP] não tenho audience config CP3
- **Refresh creative cycle:** definir ciclo de 6 sem rotation. Manter 2 dos 8 ads "evergreen heritage" + rotacionar 6 a cada 6 sem
- **Conversion event upload mensal:** CRITICAL — começar offline conversion upload pra Meta SEMANAL: leads qualificados, meetings booked, deals closed

### Adicionar (P0)
1. **CAPI server-side deploy** (Princípio 9). PR já existe (memory `project_bretda_lp_pixel_fix_30abr` cita Caminho B CODE READY). Deployar.
2. **Sales feedback spreadsheet** mínimo viable (Princípio 12). Colunas: lead_id / source / UTM / status / qualified_y_n / meeting_booked / sale_amount / close_date / time_to_close. Refresh weekly.
3. **CPL Qualified métrica** vs CPL bruto. Pode descobrir que CP1 (CPL R\$16,58) é melhor que CP2 (CPL R\$14,90) se CP1 fechar 2x mais.

### CAC esperado vs ceiling
- Ceiling: R\$2.100
- Cenário pessimista (close 0,3%): R\$5.250 CAC → **PERDA** (insustentável)
- Cenário base (close 1%): R\$1.575 CAC → **OK**
- Cenário otimista (close 2%): R\$785 CAC → **lucrativo, escalar**

### Bloqueadores conhecidos
- Saldo Meta (memory `session_bretda_auditoria_03mai` cita "R\$327 saldo = 2,7d runway") — runway operacional precisa ser >15d
- CAPI Caminho B não deployed (PR aberto, pending)
- Sem CRM unificado com source attribution
- Frequency CP2 1,82 OK; CP1 não tenho dado — risco saturação se >R\$30/d sem audience refresh

### Escalada segura (próximos 90d)
| Sem | CP1 | CP2 | Total | Validação |
|-----|-----|-----|-------|-----------|
| 0 (now) | R\$30 | R\$60 | R\$90 | baseline |
| 4 | R\$40 | R\$80 | R\$120 | +30% após CAPI deploy + 4 sem dados qualificados |
| 8 | R\$55 | R\$110 | R\$165 | +37% se CAC qualified <R\$1.500 |
| 12 | R\$70 | R\$140 | R\$210 | +27% se LTV:CAC >3:1 confirmado |
| 24 (6m) | R\$100 | R\$200 | R\$300 | gate: 50 closed deals attributed Meta |

Nunca >30%/sem (não /dia). 24 sem pra triplicar.

---

## Aplicação 2 — Tocks (Restart pós-PIX com Bretda-template)

### Situação atual
- Conta PAUSED (saldo zerado, PIX pending — memory `session_tocks_hydra_actions_12mai`)
- Ticket médio R\$13k (memory `feedback_tocks_moveis_luxo`) — não R\$33k como Bretda
- CAC ceiling: R\$4.400 (memory `session_highticket_squad_08mai`)
- Vertical: móveis de luxo completos (não só mesas) — sofás, mesa jantar, poltronas, estantes, painéis

### Veredito: REPLICATE-STRUCTURE com 4 ajustes critical

A estrutura Bretda é replicável quase 1:1, mas ticket menor exige tweaks.

### Manter (mesmo que Bretda)
- Interest stack Architects + Interior Designers + Luxury Goods (mesmo profissional-prescritor)
- iOS-only (BR proxy classe)
- Age 30-60
- Geo 11 estados Sudeste + Sul + Centro-Oeste
- OUTCOME_LEADS + Instant Form
- 8 ads/adset com mix CTA
- Dual campaign structure (CP1 estrita + CP2 ampla)

### Ajustar (4 mudanças críticas)

**Mudança 1 — Frequency tolerance maior (audience overlap com Bretda)**
- Audience Architects + Interior Designers + Luxury Goods iOS 30-60 Sudeste/Sul é **MESMA** audience de Bretda
- Risco: Tocks competir com Bretda pelo MESMO pool de impressions = leilão interno (mesma conta-mãe Synkra?)
- **Solução A:** Tocks targeta `work_positions: [Architects, Interior Designers]` MAS exclude `interests: [Pool, Billiards, Snooker]` (pra evitar overlap mesa-curiosos)
- **Solução B:** Tocks targeta ADDITIONAL profissões: `[Architects, Interior Designers, Decoradores, Designers de Mobiliário, Visual Merchandiser]` — amplia pool sem sobrepor 100% Bretda

**Mudança 2 — Mix de SKU diferente**
- Bretda 5 SKUs hero mesa de bilhar
- Tocks tem catálogo amplo (sofás, mesa jantar, poltronas, painéis) — mapear 5 SKUs **mais photogenic** + 1 "linha completa"
- Memory `session_tocks_master_assets_06may` cita 28 WhatsApp renders + asset library canon com Libre Caslon + Poppins + 122 videos hero candidates
- Pré-launch: curar 5 SKUs hero pra Tocks (provavelmente sofá modular + mesa jantar + poltrona icônica + painel + bench/console)

**Mudança 3 — Budget total inicial menor**
- Bretda começou com R\$27/d e cresceu até R\$90/d em 90d
- Tocks deve começar **R\$40-50/d** (R\$15 CP1 + R\$25-35 CP2) — menor que Bretda atual porque ticket R\$13k (ceiling R\$4.4k) tem menos margem por erro
- Escala +25%/sem (não +30% Bretda — mais conservador)

**Mudança 4 — Lead form com qualifier ENROLED**
- Bretda Instant Form atual tem 3-4 campos (nome/tel/cidade/modelo)
- Tocks adiciona **2 campos qualifier obrigatórios**: "Tipo projeto" (residencial / comercial / hoteleiro) + "Em qual etapa" (em obra agora / planejando 3-6m / estudando)
- Reduz volume ~30% mas filtra non-buyer

### CAC esperado vs ceiling
- Ceiling: R\$4.400
- Cenário pessimista (close 0,5%, similar Bretda baseline): R\$3.000 CAC → **OK margem apertada**
- Cenário base (close 1,2%): R\$1.250 CAC → **lucrativo**
- Cenário otimista (close 2,5%): R\$600 CAC → **escalar agressivo**

### Bloqueadores conhecidos
- Saldo zerado / PIX pending (memory `session_tocks_hydra_actions_12mai`)
- CAPI Tocks NÃO deployed (PR #645 closed sem merge — memory `session_tocks_hydra_actions_12mai`)
- Site Tocks: status atual unknown (memory `session_tocks_master_assets_06may` cita Vértice/Elipse pendente mapeamento)
- Atendimento humano WhatsApp: precisa SLA <1h pra Instant Form não virar AD10 Aurora-trap

### Sequência sugerida (D0 = PIX confirmado)
- D0-D3: site/LP validation + CAPI Tocks deploy + sales SLA setup
- D4-D7: launch CP1 R\$15/d (audience CP1-Bretda-mirror, profissões puras Sudeste) — soft launch
- D8-D14: launch CP2 R\$30/d (audience CP2-Bretda-mirror, profissões + luxury 11 estados) — paralela
- D15-D45: monitorar CPL semanal + qualif rate + offline conv upload
- D46-D90: scale +25%/sem se CAC qualif <R\$2.500

---

## Aplicação 3 — Vorza (NÃO replicar — fundamentalmente diferente)

### Situação atual
- Pivot Meta → Email completed (memory `session_vorza_email_pivot_05may`)
- Ticket R\$300-500 (low-ticket)
- CAC ceiling: R\$1.650 (memory `session_highticket_squad_08mai` — mas isso é high-ticket framework; pra low-ticket é desproporcional)
- Stack: Resend + Supabase + mail.vorza.com.br (memory)

### Veredito: NÃO REPLICAR Bretda. Vorza é low-ticket, estrutura inversa.

### Por que não replicar
- Bretda estrutura otimiza pra **filtrar volume**. Vorza precisa de **volume bruto** (low-ticket impulse).
- iOS-only Vorza = perder 85% de buyers reais (R\$300 ticket cabe em Android median income)
- Targeting profissional Vorza = waste (nenhum profissional prescreve compra R\$300)
- Instant Form sem humano em <1h em Vorza = OK porque LTV não justifica humano custom; precisa nurture automation
- **A pergunta correta pra Vorza não é "como replicar Bretda" — é "Meta serve Vorza, ou email serve melhor?"** — user já respondeu: email (memory cita pivot completo)

### Se reabrir Meta em Vorza (não recomendado P0)
Estrutura inversa:
- All devices (iOS + Android)
- Interest direto: hobbies/interests do produto (não work_position)
- Geo BR-todo (low-ticket sem custo entrega físico)
- Idade 25-55 (mais ampla)
- LP form OR Instant Form com nurture sequence automatizada
- CBO multiple adsets exploring interests
- CAC target R\$50-200, não R\$1.650 (ceiling inadequado pra low-ticket)

### CAC esperado
- Ceiling memory (R\$1.650) **inadequado** — pra low-ticket Vorza, CAC target deve ser ~2-3x AOV = R\$600-1.500 LTV:CAC 2-3:1 mínimo
- Atual modelo (email nurture pós-bench): CAC ~R\$70 conforme memory `session_vorza_email_pivot_05may`

### Bloqueadores
- Meta pausada por decisão estratégica (não bug)
- Reabrir Meta atrasaria pivot email já em curso

---

## Aplicação 4 — Synkra Info-Produto (Hipotético — recomendação NÃO)

### Situação atual
- Decisão pendente 2026 — "Synkra info-produto sim/não" (memory `session_highticket_squad_08mai` D-01)
- Recomendação Orion squad-08mai: **NÃO ou ADIAR** — focar 100% físico

### Veredito: NÃO replicar Bretda. Se launch ocorrer, estrutura COMPLETAMENTE diferente.

### Por que Bretda template não serve

| Dimensão | Bretda (físico luxe) | Synkra info-produto |
|----------|---------------------|---------------------|
| Decisão de compra | Profissional-prescritor + showroom | Solo digital |
| Pré-frame necessário | Anúncio + targeting | VSL/Webinar |
| Lead-to-sale path | WhatsApp + humano + visita | Funil digital automatizado |
| Time-to-purchase | 30-90 dias | 7-21 dias |
| Trust building | Heritage + showroom + portfolio | Authority signals + reviews + guarantee |
| Atribuição | Offline upload obrigatório | Pixel + CAPI suficiente (web-only) |

### Se Synkra info-produto launch (NOT recommended P0)
Estrutura ALEX HORMOZI + RUSSELL BRUNSON (NÃO Bretda):
- All devices (info-produto consumed mobile + desktop)
- Interest stack baseado em "Online Learning + Business Coaching + Entrepreneurship"
- Geo BR + Portugal (lusófono)
- Idade 28-50
- Objective: OUTCOME_CONVERSIONS (pixel) ou OUTCOME_LEADS pra VSL
- **VSL + Webinar funnel** (memory `session_highticket_squad_08mai` cita "VSL+Webinar+Application" funnel pra Application high-ticket)
- CAPI obrigatório (pixel-blind pra info-produto digital = suicídio)
- Brunson Value Ladder ($7 trip-wire → $97 frontend → $497 backend → $1.997 high-ticket)

### CAC esperado (se launch)
- Depende de ticket: $497 frontend → CAC target $150-250; $1.997 high-ticket → CAC target $500-800
- Memory ceiling R\$1.650 só faz sentido pra ticket >R\$5k

### Bloqueadores
- Decisão estratégica pendente (D-01 squad-08mai)
- Sem produto info ainda criado
- Distração de Bretda/Tocks operacional core

---

## Aplicação Bonus — KR (Interiores Arquitetura — observado mas não missionado)

### Situação atual
- KR LIVE R\$50/d Meta (memory `session_kr_audit_29abr`)
- WhatsApp Void bug pendente (memory `session_kr_whatsapp_void_12mai`) — campanha PAUSED 12/Mai
- Vertical: interiores arquitetura (serviços, não produto físico)

### Veredito: REPLICATE Bretda com 1 ajuste critical

KR audience overlap quase 100% Bretda/Tocks (mesmos arquitetos/decoradores como prescritores). Diferença: KR vende SERVIÇO (interiores), não produto físico.

### Manter
- Interest stack Architects + Interior Designers + Luxury Goods (SAME)
- iOS-only
- Age 30-60
- Geo 11 estados (KR é serviço — verificar capacidade atender remoto)
- Instant Form + qualif humano

### Ajustar
- **Targeting profissional-prescritor menos crítico em serviço de interiores B2C** — end-buyer (HNW residencial) mais direto. Adicionar `interests: [Interior Design, Home Decor, Casa Vogue]` como audience secundária.
- Geo: dependente de capacidade atender. Se KR só atende SP+RJ, restringir a 2 estados.
- Bloqueador resolvido FIRST: WhatsApp Void bug (memory `session_kr_whatsapp_void_12mai`) — todo lead via Meta cai numa WABA Cloud API inacessível. Resolver ANTES de scaling.

### CAC esperado
- Sem ceiling memory específico — assumir R\$500-1.500 dado ticket projeto interiores
- Atual CPL R\$50-100 prov (audit 03/Mai cita CPL impreciso pelo WhatsApp void)

---

## Resumo Cross-Account

| Conta | Veredito | Replicar Bretda? | P0 bloqueador |
|-------|----------|------------------|----------------|
| **Bretda** | KEEP + ADD CAPI + VALIDATE CLOSE | já replicando | CAPI deploy + sales feedback loop |
| **Tocks** | REPLICATE com 4 ajustes | sim (template) | PIX + CAPI Tocks PR #645 + site validation |
| **Vorza** | NÃO replicar | não — low-ticket inverso | continuar pivot email |
| **Synkra** | NÃO replicar (se launch, Brunson) | não — info-produto diferente | decisão estratégica D-01 |
| **KR** | REPLICATE com 1 ajuste | sim | WhatsApp Void bug primeiro |

### Sequência recomendada (próximos 90d)
1. **Sem 1-2:** Bretda CAPI deploy + sales feedback spreadsheet (P0)
2. **Sem 3-4:** Bretda gate qualified — descobrir close-rate real (validate ou kill)
3. **Sem 5-6:** Tocks PIX confirmed → restart com template Bretda + 4 ajustes
4. **Sem 7-8:** KR WhatsApp Void fix + restart com template Bretda + 1 ajuste
5. **Sem 9-12:** Tocks gate qualif + Bretda scale +30%/sem se close>1%
6. **Synkra:** Hold decisão D-01 até Bretda+Tocks validated

---

*— Atlas*
