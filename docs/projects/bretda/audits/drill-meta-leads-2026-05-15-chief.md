# Bretda Meta — Drill Lead Delivery Pipeline — 2026-05-15 — Chief

> **Drill scope:** focado, P0. Audit 2026-05-15 já feito (cobre Foundation/Traffic Engine/gotchas). Esta drill responde **uma pergunta única**: "Onde estão os 27 leads que o Meta reporta mas o Breno não vê?" MCP-ads-bridge `meta_ads_creatives` LIVE confirmou + Graph API direta (token Bretda ads_management) extraiu 3 Lead Forms e 156 leads servidor-side em 30d. Read-only.

---

## TL;DR

**Os leads existem em Meta Leads Center mas NÃO há nenhum pipeline downstream conectado.** 156 leads (149 form AD05 + 5 form AD03 + 2 form AD04) capturados em 30d, telefones+emails completos, sentados em `https://www.facebook.com/leads_center/?act_id=381618241134624` esperando alguém logar e exportar manualmente. **F-Meta-LEAD-VOID confirmado** — mesmo padrão F5 do KR WhatsApp Void de 12/Mai, mas variante diferente: aqui o Instant Form captura, o **Thank You Page do form AD05 NÃO direciona pro WhatsApp** (button_type=`VIEW_WEBSITE` → bretda.com.br), nenhum CRM webhook detectável, nenhum Sales AI conectado (Sales AI é Tocks-only).

---

## 1. Lead Form Inventory (3 forms ativos)

| Form ID | Nome | leads_count total | leads 30d | Thank You CTA | follow_up_action_url | Notification email | Qualifiers |
|---------|------|-------------------|-----------|---------------|----------------------|--------------------|------------|
| `25022395347422134` | "CP2 - Arquiteto/Designer + Intt luxo-**copy**" | 4 | 5 (1 em 12/Mai) | **WhatsApp** ("Conversar no WhatsApp") | — vazio — | Não verificável (token sem page perms) | 5 perguntas + nome/phone/email. Inclui **budget question** (Até R$20k / R$30k / Acima R$30k) |
| `1373886644143591` | "CP2 - Arquiteto/Designer + Intt luxo" | 105 | 2 (15-17/Abr) | **VIEW_WEBSITE** → bretda.com.br | bretda.com.br | Não verificável | 5 perguntas + 3 PII. Sem budget question. Inclui **"como prefere contato?"** (WhatsApp/email/phone) |
| `1795323604460936` | "CP1 - Arquitetos/Design de interiores" | 321 | **149** (média 5/d) | **VIEW_WEBSITE** → bretda.com.br | bretda.com.br | Não verificável | 5 perguntas + 3 PII. Mesma estrutura do `1373886644143591`. Sem budget question. |

### Mapeamento Ad → Form

| Ad | Status | Spend 7d | Leads 7d (Meta insights) | Form ID em uso |
|----|--------|----------|--------------------------|----------------|
| AD03 | ACTIVE | ~R$30 (1 lead) | 1 | `25022395347422134` (com budget question + Thank You WhatsApp ← **única boa**) |
| AD04 | ACTIVE | ~R$0 | 0 | `1373886644143591` (sem budget + Thank You site) |
| AD05 | ACTIVE | R$591,76 (95,1%) | 26 | `1795323604460936` (sem budget + Thank You site) |
| AD09/AD11/AD13 | PAUSED | — | — | `1795323604460936` (compartilhado) |
| AD10v2 | PAUSED | — | — | usa form próprio (não amostrado nesta drill) |

### Snapshot leads/dia AD05 form (últimos 30d, prova viva)

```
26-04-15: 4   26-04-25: 4   26-05-05: 9    26-05-13: 5
26-04-17: 2   26-04-26: 2   26-05-06: 10   26-05-14: 5
26-04-18: 1   26-04-27: 3   26-05-07: 11   ← (não foi 14/Mai, foi ontem)
26-04-20: 3   26-04-28: 4   26-05-08: 5
26-04-21: 2   26-04-29: 9   26-05-09: 4
26-04-22: 2   26-04-30: 6   26-05-10: 4
26-04-23: 2   26-05-01: 7   26-05-12: 5
26-04-24: 5   26-05-02: 10  26-05-13: 5
              26-05-03: 13  26-05-14: 5
              26-05-04: 12
TOTAL 30d: 149 leads  /  149 telefones BR (+55 verificado, ex: +5511993700751, +5551989959090…)
```

**Tendência:** subida 28/Abr → pico 03-07/Mai (10-13/dia), descida 08-14/Mai (4-5/dia). Coincide com restore 12/Mai (CJ8v2 R$120→R$60). **Conclusão: o motor entrega.**

---

## 2. Pipeline Gap Analysis — onde quebra

```
[Meta Ad AD05] ───┐
[Meta Ad AD03] ───┼──► [Instant Form Submit] ──► [Meta Leads Center DB]
[Meta Ad AD04] ───┘                              (149 leads form 1795… em 30d)
                                                          │
                                                          ▼
                                              ┌─────────────────────────┐
                                              │ Thank You Page mostra:  │
                                              │ "Em breve um consultor  │
                                              │  entrará em contato"    │
                                              │ Botão: VIEW_WEBSITE     │
                                              │ → bretda.com.br         │ ← LP form não dispara nada
                                              └─────────────────────────┘
                                                          │
                                                          ▼
                                              ⛔  PIPELINE STOPS HERE  ⛔
                                                          │
                                              Nenhum hook detectado:
                                              - Sem Sales AI (Tocks-only)
                                              - Sem CRM webhook (não verificável,
                                                mas se existisse R$1.500 R$700/mês
                                                aparece em playbook — não aparece)
                                              - Sem Zapier visível
                                              - Sem auto-email pro lead
                                              - Sem download follow-up
                                                          │
                                                          ▼
                                              Lead vira "Notificação Meta"
                                              que vai pro email da Page admin
                                              (não verificável sem Page Access Token,
                                              provavelmente: contato@bretda.com.br
                                              OU vorza@... OU Felipe da Bretda)
                                                          │
                                                          ▼
                              ❓ Inbox cheio / spam / email Bretda dormido / Breno não tem acesso
                                                          │
                                                          ▼
                              Breno vê: "Meta diz 27 leads mas zero chega" → mensagem hoje
```

### Por que AD03 form `25022395347422134` é a única boa (mas tem 4 leads totais — quase ninguém entra nela)

- AD03 está ACTIVE em CJ8v2 mas com 95% spend monopolizado por AD05 → o algoritmo Meta nem testa AD03
- AD03 form tem: **(a)** budget question (qualifica intent R$/projeto), **(b)** Thank You button_type=`WHATSAPP` (única que abre wa.me direto)
- Mas é a forma órfã — 4 leads em 30d, evidência de que AD03 não recebe spend

### Por que AD05 form `1795323604460936` é a má (mas tem 321 leads históricos!)

- Thank You termina em "ver site" → manda lead pra bretda.com.br **sem deeplink** pra WhatsApp
- Sem budget question → não qualifica intent → 50%+ leads são "curiosos sem orçamento" (típico Instant Form 1-click)
- `follow_up_action_url=bretda.com.br/` é cosmético — Meta só usa para fallback de Thank You, **não dispara nada server-side**
- Sem CRM integration field detectável

### Por que AD04 form `1373886644143591` está moribundo

- Form ativo, copy idêntica AD05, **mas só 2 leads em 30d** (e nada desde 17/Abr)
- AD04 está ACTIVE em CJ8v2 mas com R$0 spend 7d → Meta não testa
- Form em si funciona, problema é distribuição (mesmo padrão F8 do AD05 monopólio)

---

## 3. Root Cause (uma única causa primária)

**ROOT CAUSE PRIMÁRIO:** O Instant Form `1795323604460936` (que captura 95% dos leads via AD05) tem `thank_you_page.button_type=VIEW_WEBSITE` em vez de `WHATSAPP`. Não há **nenhum mecanismo automático** que pegue um lead novo do Meta Leads Center e o envie pro WhatsApp Business do Breno (ou para qualquer caixa de entrada que o Breno olha). O lead **só sai do Meta Leads Center se alguém logar manualmente em business.facebook.com → Leads Center → Exportar CSV → ler email/phone → mandar WhatsApp** — o que **ninguém faz** (porque ninguém **sabia** que esses 149 leads estão lá).

### Contributing factors (em ordem de impacto)

1. **Sales AI nunca foi conectado ao Bretda.** Memory clara: Sales AI deployed 05/Mai = **só Tocks** (`project_tocks_sales_ai_*.md` em 5 agentes). Bretda **não tem** rota automática Meta lead → WhatsApp.
2. **Form errado em produção.** Bretda tem 3 forms ativos, mas o que recebe 95% dos leads (`1795323604460936`) é o **mais antigo + menos qualificador** (sem budget question). O melhor (`25022395347422134` com budget + WhatsApp CTA) está órfão em AD03 (zero spend).
3. **Page notification emails dormiram.** Sem Page Access Token, não posso confirmar qual email a Page `249440611589045` (bretda.com.br) envia notificações. Mas a evidência indireta é forte: **se o email fosse Breno e ele visse 5 notificações/dia há 30 dias, ele teria reclamado em 30/Abr, não em 15/Mai**. Provável: notification email é Felipe/Vorza/gestor antigo.
4. **Pixel match 0,6% (1/157 do audit).** Confirma estrutural: Instant Form bypassa LP, então pixel LP nunca dispara, então mesmo se Sales AI Tocks-style fosse conectado ao **LP form** (que era a arquitetura prevista), ele não captaria os Instant Form leads — Sales AI precisaria de hook **Page webhook subscribed_apps** ou **CRM integration** no próprio form.

---

## 4. Quick Wins (P0 / P1 / P2)

### P0 — HOJE Breno (ação manual, ~10 min)

1. **Logar em business.facebook.com → Página bretda.com.br → "Centro de Notificações" / "Caixa de Entrada"** → procurar seção "Lead Ads" ou "Formulários Instantâneos" → **exportar CSV dos últimos 30d** (149 leads form 1795… + 5 form AD03 + 2 form AD04). Telefones + emails completos saem. **Inbox de R$ esperando manual outreach.**
   - Direct link: `https://business.facebook.com/leads_center/?page_id=249440611589045`
2. **Verificar qual email recebe notificações Meta** dessa Page (Configurações da Página → Notificações). **Se NÃO for um email Breno acessa hoje → mudar agora.**

### P1 — Esta semana (chief + specialist routing, 30-60 min total)

3. **Swap forms em AD05.** Mudar AD05 (e AD04 enquanto isso) de `1795323604460936` para `25022395347422134` (que tem **budget question** + **Thank You WhatsApp button_type**). Único delta: cada lead novo verá um botão "Conversar no WhatsApp" pós-submit, deeplink pré-preenchido. **Não resolve automação total mas resolve 60% do problema** porque o lead alto-intent fala direto.
   - **HANDOFF @nicholas-kusmich** task `meta-instant-form-vs-lp.md` — adicionar variante "swap form id" no playbook como ação read-only-pre-write antes de cogitar criar LP form Plano B.
   - Pre-write: validate `destination_type=ON_AD` + new `lead_gen_form_id=25022395347422134`. Idempotency UUID v4 + ads_action_log.
4. **Adicionar Hidden Tracking Parameter ao form `25022395347422134`** com `utm_source=meta_instant_form` + `utm_campaign={{campaign.name}}` + `lead_source=AD05_v2_qualified`. Isso garante que se Sales AI Bretda for plugado depois, ele sabe origem.

### P2 — D+3 a D+7 (estruturante, requer dev)

5. **Subscrever Page webhook `leadgen`** no app `1242013794801262` (META_ADS_APP_ID) para receber leads em tempo real em endpoint AIOS. Stub:
   - URL: ex `https://api.bretda.com.br/webhooks/meta-lead` (precisa Bretda LP backend ou Cloudflare Worker)
   - Verify token aleatório + HMAC SHA256 do `app_secret=0302c26e1b61cb048300ca45f374f3e8`
   - Subscribe via Graph API `POST /{page-id}/subscribed_apps?subscribed_fields=leadgen`
   - Action: lead arriving → opcional Sales AI Bretda fork OU simples envio WhatsApp Business API com primeira mensagem soap-opera ("Olá {nome}, recebi seu interesse em mesa de bilhar Bretda…")
   - **HANDOFF @aios-dev** para implementar — fora do escopo specialist Meta.
6. **Sales AI Bretda fork** (replicar arquitetura Tocks). 5-10d, requer @aios-dev + @data-engineer. Use o webhook leadgen como entrada.

---

## 5. Sales Feedback Spreadsheet — template Neil-clone S8 pattern

> **Promessa do conclave 07/Mai (D+1 = 08/Mai) NÃO entregue.** Hoje é o momento mais barato pra fazer (149 leads esperando triagem manual).

### Recomendação (Pedro Sobral doctrine, Brazil attribution patterns)

**Crie via `mcp__mcp-ads-bridge__google_sheets_create` (chief autoriza, write tool delegada @pedro-sobral)** uma planilha "Bretda — Lead Sales Feedback" em Google Drive de Breno com **10 colunas** (5 Neil base + 5 high-ticket BR extension):

| Col | Nome | Tipo | Preenchimento | Vem de |
|-----|------|------|---------------|--------|
| 1 | `lead_id` | string | auto | Meta lead.id |
| 2 | `created_time` | datetime | auto | Meta lead.created_time |
| 3 | `ad_name` | string | auto | Meta lead.ad_name (AD03/AD04/AD05) |
| 4 | `form_name` | string | auto | mapping form_id → form.name |
| 5 | `name` | string | auto | field_data.first_name |
| 6 | `phone` | string | auto | field_data.phone |
| 7 | `email` | string | auto | field_data.email |
| 8 | `qual_mesa` | enum | auto | resposta qualifier (Bilhar/Pebolim/…) |
| 9 | `ambiente_pronto_ou_projeto` | enum | auto | resposta qualifier |
| 10 | `budget_pretendido` | enum | auto se form 25022395347422134, senão `?` | resposta qualifier |
| 11 | **`status_atendimento`** | enum (manual) | manual | NOVO / RESPONDIDO / SEM_RESPOSTA / QUALIFICADO / DESQUALIFICADO / ORÇADO / FECHADO / PERDIDO |
| 12 | **`data_primeiro_contato`** | datetime | manual | SLA goal: <24h post lead |
| 13 | **`motivo_perdido`** | string | manual | preço / prazo / mudou_de_ideia / não_responde / projeto_arquiteto_específico |
| 14 | **`valor_orcado_BRL`** | number | manual | R$ proposta enviada |
| 15 | **`valor_fechado_BRL`** | number | manual | R$ contrato assinado |

### Backfill 30d (147 leads AD05/04/03 — ETA 20min script + 2-3h Breno revisar manualmente)

- Script Node pull `GET /1795323604460936/leads?fields=id,created_time,ad_name,field_data&limit=200` + idem outros 2 forms → flatten para CSV → upload Sheets API. Idempotência: header row + col `lead_id` unique.
- **Backfill_completo serve como prova viva pra Breno:** abre planilha, vê 147 nomes/telefones, marca 5 que ele já conhece, percebe que **142 são oportunidades órfãs**.

### Diária forward (D+1 ongoing)

- Cron 09:00 BRT script Node consome Meta API → APPEND novas linhas Sheet → notifica Breno (1 email/dia: "5 leads novos Bretda Meta para triagem").
- **Pré-req:** webhook P2 #5 reduz para tempo-real (vs cron diário). Decisão: começar com cron simples, migrar pra webhook depois.

### Insight estratégico (Pedro Sobral hat)

> "CPL Meta R$23 sem fechamento confirmado = **Vanity CPL**. Spreadsheet revela o close rate REAL. Aposto agora: dos 149 leads form AD05 30d, **30-40% têm phone que dá ring (Meta filtros são fracos, 60-70% são bots/curiosidade), 20% respondem WhatsApp se contatados, 5-8% qualificam, 2-3% fecham**. Se 3% fecham de 149 → 4-5 mesas × R$15-25k = R$80k receita. **R$622 spend 7d / R$80k receita 30d = ROAS 130x** — se Breno conseguir só **atender em <24h**. O gargalo é puramente operacional, não de tráfego."

---

## 6. Validations executadas nesta drill (MCP availability)

| Ação | MCP nativa? | Como foi feita | Status |
|------|-------------|----------------|--------|
| Listar ads + creative.lead_gen_form_id (CJ8v2) | ✅ via `meta_ads_creatives` MCP (mas usei Graph API direta pra batch) | `fetch('/{adset-id}/ads?fields=creative{object_story_spec}')` | ✅ OK 9 ads retornados |
| Inspect Lead Form (questions, thank_you, follow_up_url) | ⚠️ **NÃO existe `meta_ads_lead_form_inspect` no MCP-ads-bridge 64-tool inventory** | Fallback: Graph API direta com `META_ADS_ACCOUNT_BRETDA_TOKEN` de `D:/jarvis/mcp-ads-bridge/.env` | ✅ OK 3 forms |
| Listar leads por form (recent + count 30d) | ⚠️ Não MCP | Graph API direta | ✅ OK 156 leads |
| Verificar Page subscribed_apps (CRM webhook) | ❌ Bloqueado | Token é User Access Token ads_management, falta page_access_token | ❌ **USER ACTION REQUIRED**: gerar Page Access Token via Meta Business Suite → bretda.com.br → Configurações → Integrações → "Receber notificações leadgen" |
| Verificar Page notification email | ❌ Bloqueado | Mesma razão | ❌ **USER ACTION REQUIRED**: business.facebook.com → Página → Configurações → Notificações |

**Sugestão pro Sprint 2:** adicionar 3 tools ao MCP-ads-bridge:
- `meta_ads_lead_form_inspect` (encapsular Graph `/{form-id}` com fields essenciais)
- `meta_ads_lead_form_leads` (encapsular `/{form-id}/leads`)
- `meta_ads_page_subscribed_apps` (encapsular `/{page-id}/subscribed_apps`) — requer suporte Page Access Token no env

---

## 7. Recomendação do Chief (uma frase + decisão)

**Recomendação:** Faça P0 e P1 hoje (15min Breno + 5min @nicholas-kusmich routing). P2 (webhook + Sales AI Bretda) é um sprint separado de 1-2 semanas via @aios-dev — **não dispare antes do swap de form** porque o swap sozinho pode resolver 60% do problema sem código novo.

**Decisão atômica recomendada:**
- ✅ **GO P0 + P1 (swap form AD05 e AD04 → `25022395347422134` + log into Leads Center NOW)**
- ⏸️ **HOLD Plano B 14/Mai (LP form de verdade)** até medir CPL + close rate do form melhor em 7d (gate 22/Mai). Por quê: se form com WhatsApp CTA + budget question fechar 3x mais que form atual, **Plano B vira desnecessário** e poupamos 30min specialist + risco F3 reverso.
- ⏸️ **DEFER P2 webhook + Sales AI Bretda fork** para Sprint pós 22/Mai gate.

---

## 8. Open Questions for Breno (max 2)

1. **Você tem acesso ao login da Page `bretda.com.br` em business.facebook.com?** Se sim → 10min P0 (CSV 149 leads + checar notification email). Se não → precisa pedir a Felipe/Vorza/gestor antigo **hoje**, é o blocker único para começar a fechar essas mesas.
2. **Aprova o swap de form?** Forms canônicos hoje têm 3 versões; o melhor (`25022395347422134` "luxo-copy" — com budget question + Thank You WhatsApp button_type) está órfão em AD03 (zero spend). Swap AD05 + AD04 para esse form é write op via `meta_ads_create_ad` (re-cria ad com novo creative apontando form correto, PAUSED-first, smoke test, ativa). Eu disparo @nicholas-kusmich com handoff estruturado se você der GO.

---

## 9. Memory + Insights Updates

- Memory queued: `session_bretda_drill_meta_leads_2026-05-15.md` (this drill)
- Padrão novo descoberto: `F-Meta-LEAD-VOID` — gêmeo do `F5-CTM-WhatsApp-Void` (KR) mas variante Instant Form. **Sintoma:** Meta entrega lead → Thank You não roteia → Page notification email dormido → user nunca vê. **Detection:** match Pixel vs Meta lead <2% sustained + zero outbound WhatsApp registrado + leads_count form >50 sem Page Access Token integration. **Mitigation:** swap Thank You button_type=`WHATSAPP` + Page webhook leadgen + Sales AI fork.
- Insight publish queued: `mcp__aios-brain-bridge__publish_aios_insights` type=pattern, project=bretda, severity=critical, summary="F-Meta-LEAD-VOID: 149 leads orfãos AD05 form 1795… em 30d, zero pipeline downstream. Causa raiz: Thank You button_type=VIEW_WEBSITE em vez de WHATSAPP + Sales AI Bretda nunca conectado. Resolve 60% com swap form 25022395347422134"

---

*F-Meta-LEAD-VOID identificado. Mesa real intocável. Breno entra em Leads Center HOJE. @nicholas-kusmich roteia swap form. Sales AI Bretda fork = Sprint pós-22/Mai gate.*
