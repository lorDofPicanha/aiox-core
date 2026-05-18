# CRM Novo — Recomendações IA para MVP
## 02. Recommendations (decisões concretas)

**Autor:** Atlas (analyst agent)
**Data:** 2026-05-17
**Pré-requisito:** ler `01-findings.md` antes desta seção.
**Escopo:** decisões arquiteturais, stack, schema, UX, LGPD, custo, riscos, MVP scope, hard NO list.

---

## 1. Decisão de Arquitetura Recomendada — 3 Caminhos

### Comparativo

| Eixo | **Caminho A: Minimal** | **Caminho B: Medium** ⭐ | **Caminho C: Comprehensive** |
|---|---|---|---|
| Modelo Claude | Haiku 4.5 | Haiku 4.5 | Haiku 4.5 + Sonnet 4.6 (fallback complex cases) |
| Output strategy | Tool use strict | Tool use strict | Structured Outputs (json_schema) |
| Prompt caching | Não | **Sim** (5min TTL) | Sim (5min + 1h para system) |
| Scoring trigger | A cada mensagem inbound | Debounced (5 msgs ou 60s idle) | Debounced + reprocess se score >X tem outras condições |
| Hybrid (AI + rules) | Só AI | **AI + rules layer determinística** | AI + rules + secondary LLM eval |
| Audit trail | audit_log básico | audit_log + request_hash + tokens | Full LLM eval set + drift monitoring |
| PII handling | None (DPA confiado) | **Mask phone/email/CPF antes do LLM** | Mask all PII + reversible token store |
| Multi-tenant prompt customization | Hard-coded | **Few-shot per tenant (Tocks/Bretda)** | Tenant pode editar system prompt UI |
| UI surfaces | Score + status no inbox | Score + status + summary + next action | Tudo do B + "explain why" panel |
| Custo/mês (100 leads/dia) | ~R$80 (sem cache) | **~R$50 (com cache)** | ~R$150 (Sonnet overhead) |
| Dev effort estimate | 3-5 dias | **7-10 dias** | 15-20 dias |
| Risco LGPD | Médio (sem mask) | Baixo | Baixíssimo |

### Recomendação: **Caminho B (Medium)** ⭐

**Razões:**
1. **Caching é trivial de adicionar e economiza 75% do custo.** No-brainer.
2. **Hybrid AI + rules** dá explainability ao vendedor + robustez quando LLM erra.
3. **PII masking básico (regex phone/email/CPF)** é overhead pequeno mas vira blindagem em caso de incidente. Patricia Peck recomendaria.
4. **Few-shot per tenant** é diferenciação fundamental — Tocks vocabulário ≠ Bretda vocabulário.
5. **Caminho C** vale para v1 quando volume justificar; MVP não precisa.
6. **Caminho A** deixa dinheiro na mesa (R$30/mês a mais sem cache, $0 esforço extra para implementar).

---

## 2. Stack Técnica Recomendada

### Decisões finais

| Componente | Decisão | Razão |
|---|---|---|
| **Modelo** | **Claude Haiku 4.5** | Quality = Sonnet em classification; custo 3x menor; pt-BR strong |
| **Structured output** | **Tool use com `strict: true`** | 99.8% schema compliance; mais maduro que Structured Outputs (beta Nov/2025); padrão industry |
| **Temperatura** | **0.0** | Reprodutibilidade (com caveat: Anthropic não garante 100% determinismo) |
| **Max tokens output** | 500 | JSON ~250 tokens steady state + buffer |
| **System prompt strategy** | Single cacheable block (~2.5k tokens) com placeholder `{TENANT_FEW_SHOT}` substituído em runtime | Cache hit em 90%+ requests |
| **Cache TTL** | **5 minutos** (não 1h) | Volume Tocks/Bretda 30-200 leads/d gera burst cluster; 5min cobre; 1h custa 2x write |
| **Trigger pattern** | **Inngest event `whatsapp.message.received.v1` → debounce 60s/contact_id → `contact.ai.score.v1`** | Evita scoring spam quando lead manda 5 mensagens em 30s; batcha |
| **PII masking** | **Pre-processamento regex** (phone +55..., email, CPF) → substitui por `[PHONE]`, `[EMAIL]`, `[CPF]` antes do LLM | Defesa em camada; baixo custo |
| **Fallback** | Se LLM falha 3x: marca `ai_status = NULL`, alerta @sentry, processa próximo evento | Não bloqueia inbox |
| **Eval set** | 50 conversas curated (25 Tocks, 25 Bretda) com ground truth manual | Roda toda semana via GitHub Action; alerta se accuracy <baseline |
| **Logging** | Cada chamada LLM: `tenant_id, contact_id, request_hash, model, input_tokens, output_tokens, cache_read_tokens, ai_score_result, latency_ms` na tabela `llm_calls_log` | Cost tracking + debugging + LGPD audit |

### System prompt skeleton (pseudo)

```
You are a sales conversation analyzer for {TENANT_NAME}, a Brazilian {VERTICAL} business.

Your task: read the conversation and classify the lead's intent and likelihood to buy.

OUTPUT FORMAT: use the `classify_lead` tool with strict schema.

SCORING RUBRIC (0-100):
- Budget signals (0-25): mentions of price, payment, parcelamento
- Authority signals (0-15): mentions of who decides (spouse, family)
- Need/Pain signals (0-30): specificity of need + aspiration
- Timeline signals (0-30): mentions of event, date, urgency

STATUS MAPPING:
- 0-30 = cold
- 31-60 = warm
- 61-80 = hot
- 81-100 = qualified

FEW-SHOT EXAMPLES (Tocks-specific OR Bretda-specific):
[Example 1: cold conversation]
[Example 2: warm conversation]
[Example 3: hot conversation]
[Example 4: qualified conversation]
[Example 5: edge case - "vou conversar com esposa"]
[Example 6: lost - "achei mais barato em concorrente"]

CONSTRAINTS:
- NEVER invent details not in the conversation
- ALWAYS cite evidence (message_id + quote) for tags
- Output language: pt-BR
- If conversation too short (<2 messages), return ai_status="cold", ai_score=10, confidence="low"
```

### Tool schema (Claude tool use)

```json
{
  "name": "classify_lead",
  "description": "Classify the lead based on conversation analysis",
  "input_schema": {
    "type": "object",
    "properties": {
      "ai_score": {"type": "integer", "minimum": 0, "maximum": 100},
      "ai_status": {"type": "string", "enum": ["cold", "warm", "hot", "qualified"]},
      "confidence": {"type": "string", "enum": ["low", "medium", "high"]},
      "ai_intent_tags": {
        "type": "array",
        "items": {"type": "string"},
        "maxItems": 6,
        "description": "Format: category:value, e.g. urgency:high, interest:mesa-jantar, objection:price"
      },
      "ai_summary": {"type": "string", "maxLength": 200, "description": "One sentence in pt-BR"},
      "ai_next_action": {"type": "string", "maxLength": 100, "description": "Suggestion in pt-BR"},
      "evidence": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "tag": {"type": "string"},
            "quote": {"type": "string"},
            "message_id": {"type": "string"}
          },
          "required": ["tag", "quote"]
        },
        "maxItems": 6
      }
    },
    "required": ["ai_score", "ai_status", "confidence", "ai_intent_tags", "ai_summary", "ai_next_action"]
  }
}
```

---

## 3. Schema Final `ai_*` columns (revisão migration 0005)

### O que está bom na migration 0005 atual

- ✅ `ai_score integer (0-100)` com CHECK constraint — correto
- ✅ `ai_status text` enum (cold/warm/hot/qualified/won/lost) — correto, won/lost manual é boa decisão
- ✅ `ai_intent_tags text[]` — flexível, append-only via update
- ✅ `ai_summary text` + `ai_next_action text` — correto
- ✅ Audit trail no `audit_log` quando status muda ou score cruza 10pt — bom design
- ✅ `update_ai_score` function security definer service-role only — security correta
- ✅ Indexes `contacts_ai_followup_idx` + `contacts_tenant_ai_score_idx` — corretos
- ✅ "Score sempre é current state" decisão (não versionar) — pragmática, vale para MVP

### Refinamentos sugeridos (não-bloqueadores)

```sql
-- 1. Adicionar confidence + razões (refletir output do LLM)
alter table public.contacts
  add column ai_confidence  text
    check (ai_confidence is null or ai_confidence in ('low', 'medium', 'high')),
  add column ai_evidence    jsonb;  -- array of {tag, quote, message_id}

comment on column public.contacts.ai_confidence is
  'LLM self-reported confidence. Low confidence = não escalar para alerta de UI.';
comment on column public.contacts.ai_evidence is
  'Evidência textual (quote + message_id) suportando intent_tags. Usado para explainability na UI.';

-- 2. Adicionar coluna rules_boost (sinal determinístico paralelo)
alter table public.contacts
  add column ai_priority_score numeric(5,2)
    check (ai_priority_score is null or (ai_priority_score >= 0 and ai_priority_score <= 200));

comment on column public.contacts.ai_priority_score is
  'Compound score = ai_score × (1 + rules_multiplier). Range 0-200. Usado na fila de follow-up.';

-- 3. Index para priority_score na fila
create index contacts_ai_priority_idx
  on public.contacts (tenant_id, ai_priority_score desc nulls last, last_message_at desc nulls last)
  where ai_status in ('warm', 'hot', 'qualified');
```

### Nova tabela auxiliar: `llm_calls_log`

```sql
create table public.llm_calls_log (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id),
  contact_id      uuid references public.contacts(id),
  request_hash    text not null,           -- SHA256 do input (idempotency + dedup)
  model           text not null,           -- "claude-haiku-4-5"
  input_tokens    integer not null,
  output_tokens   integer not null,
  cache_read_tokens integer default 0,
  cache_write_tokens integer default 0,
  latency_ms      integer,
  ai_score_result integer,
  ai_status_result text,
  error           text,                    -- null se sucesso
  created_at      timestamptz default now()
);

create index llm_calls_log_tenant_date_idx on public.llm_calls_log (tenant_id, created_at desc);
create index llm_calls_log_request_hash_idx on public.llm_calls_log (request_hash);

-- RLS: tenant pode ler seus próprios logs, service_role writes
```

**Razões:**
- Cost tracking diário/mensal por tenant (dashboard "uso IA do mês")
- Debugging quando score parece errado (`request_hash` permite reproduzir)
- LGPD audit (cumprir art. 9 LGPD — direito à informação sobre tratamento)
- Drift monitoring (compare distribuição de scores semana a semana)

### Schema FINAL recomendado (resumo)

```sql
-- contacts (migration 0005 + refinements)
ai_score          integer (0-100)             -- LLM output
ai_status         text (cold|warm|hot|qualified|won|lost)
ai_confidence     text (low|medium|high)      -- NEW
ai_intent_tags    text[]
ai_summary        text
ai_next_action    text
ai_evidence       jsonb                       -- NEW
ai_scored_at      timestamptz
ai_summary_at     timestamptz
ai_priority_score numeric(5,2)                -- NEW: compound (AI + rules)

-- llm_calls_log (NEW table)
-- audit_log (already exists, used by update_ai_score)
```

---

## 4. UX Surfaces Prioritárias (Top 3 + 1 bonus)

### Surface #1 (MUST) — Inbox list view: badge de status + score numérico secundário

**Mockup ASCII:**
```
┌────────────────────────────────────────────────────────────────┐
│ 🟢[HOT] João Silva                    62  •  há 12 min        │
│        "Quanto fica em 10x?"                                   │
│        urgency:high  interest:mesa-jantar                      │
├────────────────────────────────────────────────────────────────┤
│ 🟡[WARM] Maria Costa                  41  •  há 1h 23min      │
│        "Posso ver mais opções de cor?"                         │
│        interest:cor-personalizada                              │
├────────────────────────────────────────────────────────────────┤
│ ⚪[COLD] Pedro Santos                 18  •  há 3d            │
│        "Qual o preço da mesa de 8?"                            │
├────────────────────────────────────────────────────────────────┤
│ 🔴[QUALIFIED] Ana Oliveira            87  •  há 4 min ⚠️ SLA  │
│        "Vou fechar! Pode mandar boleto pra hoje?"              │
│        urgency:imediato  payment-method:boleto                 │
└────────────────────────────────────────────────────────────────┘
                                          [Fila de follow-up: 14]
```

**Specs:**
- Badge: cor + ícone + label (acessibilidade)
- Score numérico **secundário** (cor cinza, fonte menor) — não dominante
- Tag intent_tags primárias (max 2) inline
- "⚠️ SLA" badge se `last_reply_at` > 2h e `ai_status >= hot`
- Click no badge → abre panel lateral com explainability

### Surface #2 (MUST) — Conversation view: AI insights panel lateral

**Mockup ASCII:**
```
┌────────────────── Conversa João Silva ─────────────────┬─ AI Insights ─┐
│                                                        │                │
│ João: Boa tarde! Vi sua mesa Aurora no instagram      │ 🟢 HOT  62/100 │
│       Adorei. Vocês fazem em 12 lugares?              │                │
│                                                        │ Confiança: alta│
│ Tocks: Oi João! Sim, fazemos sob medida. Posso        │                │
│        te enviar opções? Qual sua medida disponível?  │ ━━━ Sinais ━━━│
│                                                        │ ✓ Interesse:   │
│ João: Tenho 3.50m x 1.20m. Preciso entregar antes     │   mesa-jantar  │
│       de dezembro pro casamento da filha.             │ ✓ Urgência:    │
│                                                        │   timeline:dez │
│ Tocks: Que ótimo! Vou enviar 3 opções aurora 3.50m.   │ ✓ Evento:      │
│        Tem preferência por madeira?                   │   casamento    │
│                                                        │                │
│ João: Madeira escura. E quanto fica em 10x?           │ ━━━ Resumo ━━━│
│                                                        │ Cliente quer   │
│                                                        │ mesa Aurora    │
│ [composer______________________________] [Enviar]     │ 12L pra        │
│                                                        │ casamento dez. │
│                                                        │ Pediu preço.   │
│                                                        │                │
│                                                        │ ━━ Próximo ━━━│
│                                                        │ 💡 Enviar      │
│                                                        │ tabela 10x +   │
│                                                        │ confirmar      │
│                                                        │ entrega dez.   │
│                                                        │                │
│                                                        │ [▾ Histórico]  │
└────────────────────────────────────────────────────────┴────────────────┘
```

**Specs:**
- Panel lateral colapsável (não interrompe conversa)
- Sinais (intent_tags) com **evidência** (hover mostra quote + message_id)
- Resumo: 1-2 frases pt-BR
- Próximo: sugestão acionável
- Histórico colapsado: timeline de mudanças de score

### Surface #3 (MUST) — Fila de follow-up dedicada (action queue)

**Mockup ASCII:**
```
┌─────── 🎯 Fila de Follow-up — Tocks (14 leads) ───────┐
│                                                        │
│ 🚨 ATENÇÃO URGENTE (3)                                 │
│   [QUALIFIED] Ana O. — 87 pts — SLA breached 4h ⚠️    │
│   [HOT]       Carlos M. — 73 pts — sem resposta 2h    │
│   [HOT]       Patricia L. — 68 pts — sem resposta 90m │
│                                                        │
│ ⏰ AÇÃO PARA HOJE (6)                                  │
│   [HOT]   João S. — 62 pts — Enviar tabela 10x        │
│   [HOT]   Beatriz N. — 64 pts — Confirmar showroom    │
│   ...                                                  │
│                                                        │
│ 📅 FOLLOW-UP AGENDADO (5)                              │
│   [WARM]  Lúcia M. — Re-engajar dia 21/Mai            │
│   ...                                                  │
└────────────────────────────────────────────────────────┘
```

**Specs:**
- Ordenada por `ai_priority_score` desc (compound: AI score × rules multiplier)
- 3 buckets: URGENTE / HOJE / AGENDADO
- Click no card → conversation view + panel lateral
- "Mark as done" inline → status update + remove da fila
- **Refresh real-time via Supabase Realtime** (não polling)

### Surface bonus (NICE-TO-HAVE) — Tenant config: AI on/off + tenant-specific few-shot

Página `/settings/ai`:
- Toggle "Habilitar AI scoring" (default ON)
- Editor de **5 conversas exemplo** (few-shot per tenant) — Tocks pode treinar com "Aurora", "Elipse"; Bretda com modelos seus
- Display: cost tracking mês atual + last 30d trend
- Botão "Re-scorear todos contatos com ai_status NULL" (batch reprocess)

### Hard NO list para UX (antipatterns)

- ❌ Mostrar score numérico bruto sem badge tier (raw probability dump)
- ❌ Toast notification para todo score change
- ❌ Modal blocking para AI insight
- ❌ "AI suggested response" sem affordance de editar/dismiss em 1 tecla
- ❌ Badge com cor sem ícone + label (acessibilidade)
- ❌ Esconder AI insights atrás de 2+ cliques
- ❌ Mesmo formato visual para tier qualified vs cold (alert fatigue)

---

## 5. LGPD Checklist (operacional)

### Pre-launch (bloqueador)
- [ ] **Assinar DPA Anthropic** (Commercial account ou Enterprise)
- [ ] Verificar incorporação SCC ANPD na DPA (ou anexar separadamente)
- [ ] Atualizar **política de privacidade** do CRM Novo com:
  - Menção explícita "usamos Anthropic Claude API (EUA) para análise de conversas"
  - Base legal: execução de contrato + legítimo interesse
  - Direito de opt-out por tenant
- [ ] Cada tenant (Tocks, Bretda) atualiza **sua própria política de privacidade** mencionando o sub-processamento (já que CRM Novo é processor do tenant)
- [ ] **LIA** (Legitimate Interest Assessment) documentado em `docs/projects/crm-novo/14-legal/lia-ai-scoring.md`
- [ ] **DPIA** (Data Protection Impact Assessment) específico em `docs/projects/crm-novo/14-legal/dpia-ai-scoring.md`
- [ ] **ROPA** atualizado (Record of Processing Activities)
- [ ] PII masking implementado: phone (+55..), email, CPF, CNPJ
- [ ] Bloqueio de campos sensíveis: detector que aborta scoring se conversa contém keywords médicas/saúde/orientação sexual/religião (rule layer)
- [ ] Audit log de TODA chamada LLM em `llm_calls_log` table

### Pós-launch (operacional)
- [ ] Tenant admin pode desabilitar AI scoring via `/settings/ai`
- [ ] Direito de eliminação: quando contact é deletado, deletar também ai_summary + ai_evidence + llm_calls_log relacionados
- [ ] Direito de portabilidade: export contact data incluindo ai_* fields
- [ ] Direito de explicação (art. 20 LGPD — decisão automatizada): mostrar evidence + razões quando solicitado
- [ ] Revisão jurídica anual com Patricia Peck (ou advogado equivalente)

### Considerar (não bloqueador MVP)
- [ ] ZDR (Zero Data Retention) Anthropic se volume justificar (Enterprise tier)
- [ ] Reversible pseudonimization com token store local (se DPIA classificar risco como alto)
- [ ] Residência de dados Brasil (não disponível Anthropic direto; via AWS Bedrock SA-East-1 se necessário)

---

## 6. Cost Estimate Concreto

### Cenários (Haiku 4.5 + caching ativo)

| Cenário | Tenants | Leads/dia total | Scoring calls/dia | **Custo/mês** | Per-tenant share |
|---|---|---|---|---|---|
| **Launch MVP** | Tocks + Bretda | 60-200 | 300-1000 | **R$30-100** | R$15-50/tenant |
| **Steady state Q3** | Tocks + Bretda + Vorza | 200-500 | 1000-2500 | **R$100-250** | R$33-83/tenant |
| **Scale Q4** | 5+ tenants | 500-1500 | 2500-7500 | **R$250-750** | R$50-150/tenant |
| **Heavy growth** | 10+ tenants | 1000-3000 | 5000-15000 | **R$500-1500** | R$50-150/tenant |

### Pricing model interno (futuro)

Sugestão para futura monetização (não MVP):
- Plano free: 100 leads/mês scored (custo CRM ~R$5)
- Plano starter R$197/mês: 1000 leads/mês scored (custo CRM ~R$50, margem 75%)
- Plano pro R$497/mês: ilimitado* + features avançadas (cost-plus monitor)

### Breakeven racional vs vendedor humano
- 1 vendedor BR mid-level = ~R$4-7k/mês
- IA scoring 500 leads/dia (covering ~2-3 vendedores) = R$50/mês
- **ROI 80-140x em custo direto.** Verdadeiro valor = vendedor recupera 3-4h/dia para fechamento.

### Buffer
- **+10% para retries** (network errors, rate limits)
- **+15% para eval set runs** (semanal automated)
- **+5% para batch reprocessing** (quando schema muda)
- **Total: planejar +30% sobre estimate base**

---

## 7. Riscos + Mitigations (Top 5)

| # | Risco | Probabilidade | Impacto | Score | Mitigation |
|---|---|---|---|---|---|
| **R1** | **LLM hallucina intent (inventa detalhes)** | 4 | 4 | 16 🔴 | Schema com `evidence` field obrigatório + `confidence` self-reported. Low confidence = não dispara alerta. Eval set semanal. |
| **R2** | **Anthropic API rate limit / quota exceeded** | 3 | 4 | 12 🟠 | Inngest backoff exponencial + DLQ. Fallback: deixar contact com `ai_status=NULL`, alerta @sentry, processa próxima. Pre-PIX Anthropic antes de Sprint 3 (memória feedback HYDRA). |
| **R3** | **Drift de qualidade do scoring** (LLM update muda comportamento) | 3 | 4 | 12 🟠 | Eval set 50 conversas curated + GitHub Action semanal + alert Discord se accuracy <baseline-10%. |
| **R4** | **Vendedor Tocks/Bretda ignora ou descrê do AI** | 3 | 4 | 12 🟠 | Explainability nativa (evidence + razões) + 5 entrevistas Week 0 (pitch concierge MVP) + tunar tier thresholds com feedback real. |
| **R5** | **LGPD complaint / ANPD inquiry** | 1 | 5 | 5 🟢 | Pre-launch checklist (sec. 5) completo + Patricia Peck consult + ZDR opcional se risco alto. |

### Riscos menores (monitorar)
- **R6:** Custo escapa controle se volume bursta — monitor diário `llm_calls_log` aggregate + Discord alert se >R$50/dia
- **R7:** Prompt injection (lead malicioso) — schema strict + system prompt defensivo + rate limit por contact_id
- **R8:** Cache contamination cross-tenant — system prompt include `tenant_id` mas NÃO `contact_id` no bloco cacheado; user message vai fora do cache
- **R9:** Idempotência: mesma mensagem processada 2x não deve gerar 2 chamadas LLM — `request_hash` unique check em `llm_calls_log`
- **R10:** Vendedor edita `ai_status` manualmente → AI pisa em cima na próxima rodada — adicionar coluna `ai_manual_override boolean` que pausa scoring até `last_message_at` mudar

---

## 8. MVP Scope Revisado para CRM-A.1 (AI scoring)

### Inclui no MVP (CRM-A.1)

**Backend / Core:**
- [x] Migration 0005 (já existe) **+** refinement: adicionar `ai_confidence`, `ai_evidence`, `ai_priority_score`
- [ ] Migration 0006: `llm_calls_log` table
- [ ] Inngest event handler `whatsapp.message.received.v1` → debounce 60s/contact → trigger `contact.ai.score.v1`
- [ ] Worker `contact-ai-score`:
  - Pre-flight: regex PII mask (phone/email/CPF)
  - Build prompt: cacheable system + tenant few-shot + last 30 messages
  - Call Claude Haiku 4.5 with tool use strict
  - Validate output (zod schema)
  - Compute `ai_priority_score` = `ai_score * (1 + rules_multiplier)` where rules_multiplier from deterministic layer
  - Call `update_ai_score` RPC
  - Log in `llm_calls_log`
- [ ] Eval script: roda eval set, reporta accuracy/precision/recall

**Frontend / UI:**
- [ ] Inbox list view: badge HOT/WARM/COLD/QUALIFIED + score numérico (small)
- [ ] Conversation view: AI insights panel lateral (collapsible)
- [ ] Fila de follow-up dedicada `/inbox/queue` (URGENTE / HOJE / AGENDADO)
- [ ] Tenant settings `/settings/ai`: toggle on/off, few-shot editor (5 conversas), cost dashboard mês

**LGPD / Legal:**
- [ ] DPA Anthropic assinado
- [ ] Policy privacy atualizada (CRM Novo + Tocks + Bretda)
- [ ] LIA + DPIA documents commitados
- [ ] Bloqueio de campos sensíveis no pipeline
- [ ] Audit log via `llm_calls_log`

**Quality / Ops:**
- [ ] 50 conversations eval set (25 Tocks, 25 Bretda) com ground truth
- [ ] GitHub Action: weekly eval run + Discord alert se accuracy <baseline
- [ ] Discord alert se custo diário >R$50

### Adia para v1 (CRM-B.x ou depois)

- ❌ Tenant pode editar system prompt direto na UI (security risk + complexity)
- ❌ Multi-step LLM eval (Sonnet fallback para complex cases)
- ❌ Reversible pseudonymization com token store
- ❌ ZDR Enterprise Anthropic
- ❌ Adaptive learning (LLM aprende com vendedor marcando won/lost)
- ❌ Sentiment-over-time chart por contato
- ❌ Predição "tempo até conversão"
- ❌ Auto-resposta AI (NUNCA — explicitamente fora de escopo até v2+)
- ❌ Lookalike audiences baseado em ai_score (data engineering pesado)

### Estimativa de esforço

| Tarefa | Horas estimadas |
|---|---|
| Migration 0006 + refinement 0005 | 2h |
| Inngest worker contact-ai-score | 8-10h |
| Tool use schema + system prompt + few-shot | 6-8h |
| Eval set 50 conversations + script | 4-5h |
| UI badges + score (inbox list) | 4h |
| AI insights panel lateral (conversation view) | 6h |
| Fila de follow-up dedicada | 8h |
| Tenant settings `/settings/ai` | 5h |
| LGPD documents (LIA + DPIA + policy updates) | 4h |
| PII masking module + tests | 4h |
| GitHub Action eval + Discord alert | 2h |
| **TOTAL** | **~55-60h ≈ 7-8 dias solo dev** |

---

## 9. Hard NO List — O que NÃO Fazer

### Arquitetura / Stack
- ❌ **NÃO usar prompted JSON** ("respond with JSON only"). Use tool use strict ou Structured Outputs. Sempre.
- ❌ **NÃO escolher Sonnet 4.6 sem justificativa numérica** (eval pt-BR mostrando gap >5%). Default Haiku 4.5.
- ❌ **NÃO usar Opus 4.7 para classification.** Custo absurdo, quality gain irrelevante.
- ❌ **NÃO usar temperatura >0.2** para classification.
- ❌ **NÃO fazer scoring síncrono no request HTTP.** Sempre background via Inngest. Latência 2s em mensagem inbound é UX inaceitável.
- ❌ **NÃO scorear toda mensagem.** Debounce 60s/contact_id. Lead que manda 5 msgs em 30s não vira 5 chamadas LLM.
- ❌ **NÃO cachear `contact_id` ou `tenant_id` no system prompt.** Cross-tenant contamination. Variables vão no user message.

### UX / Design
- ❌ **NÃO mostrar score decimal sem badge tier** (raw probability dump antipattern)
- ❌ **NÃO usar mesma formatação visual para todos os tiers** (alert fatigue)
- ❌ **NÃO esconder AI insights atrás de 2+ cliques**
- ❌ **NÃO usar cor sem ícone + label** (acessibilidade)
- ❌ **NÃO interromper com toast/modal** para mudanças routine de score
- ❌ **NÃO mostrar "AI suggested response" sem affordance de editar/dismiss**

### LGPD / Legal
- ❌ **NÃO mandar dados sensíveis** (saúde, religião, política, orientação sexual, biometria) pro LLM mesmo com DPA — bloqueador pipeline
- ❌ **NÃO usar Anthropic sem DPA assinado**
- ❌ **NÃO fazer transferência internacional sem base legal documentada**
- ❌ **NÃO deletar `llm_calls_log` antes de 12 meses** (audit + LGPD compliance)
- ❌ **NÃO permitir consumer (lead) requestar score de outro lead via API** — RLS by tenant_id obrigatório

### Process / Workflow
- ❌ **NÃO lançar sem eval set** de pelo menos 50 conversas com ground truth
- ❌ **NÃO escalar para outros tenants antes de Tocks operar com sucesso** 2-4 semanas
- ❌ **NÃO confiar em LLM para decisões irreversíveis** (mark as lost, send invoice) — AI sugere, humano confirma
- ❌ **NÃO substituir vendedores por AI no MVP** — AI assiste, humano executa. Decisão de produto + ética + risk.
- ❌ **NÃO logar prompt completo no audit log** (PII issue) — log hash + metadata, prompt em storage encrypted com TTL 30d
- ❌ **NÃO ignorar feedback Week 0 entrevistas Tocks** — UX será re-tunada (cores, thresholds, labels) baseado em uso real

---

## Decisão Final — TL;DR Executivo

**Stack:** Claude Haiku 4.5 + Tool use strict + Prompt caching (5min TTL) + Inngest debounce 60s + PII regex mask + Hybrid AI+rules scoring.

**Schema:** Migration 0005 já está boa — adicionar `ai_confidence`, `ai_evidence`, `ai_priority_score`. Nova tabela `llm_calls_log`.

**UI:** Badge tier no inbox + AI insights panel lateral + Fila de follow-up dedicada.

**LGPD:** DPA Anthropic + SCC ANPD + LIA + DPIA + PII masking + audit log. Patricia Peck consult opcional mas recomendado.

**Custo:** R$30-100/mês launch (Tocks+Bretda), R$250-750/mês scale Q3-Q4.

**Effort:** ~7-8 dias solo dev para CRM-A.1 completo.

**Risco principal:** LLM hallucination de intent — mitigation: evidence field obrigatório + eval set semanal + low confidence = no alert.

**Hard NO:** prompted JSON, raw probability dump, scoring síncrono, dados sensíveis no LLM, lançar sem eval set, AI substituir humano.

---

— Atlas, investigando a verdade 🔎
