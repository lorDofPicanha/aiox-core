# Dogfooding Playbook — 1 Dia Operando Tocks Sem CRM

**Quem:** Breno (founder, dogfooding mandatório Conclave Moubeche)
**Quando:** 1 dia inteiro Week 0, Day 5-7
**Stack:** WhatsApp Web + planilha Google Sheets + Bridge standalone (Inngest workflow) + Ads Manager Meta + Google Ads dashboard

**Princípio Moubeche:** *"If you can't bear using your own product for 1 day, your customer can't bear it for 30."*

---

## Por que isso é mandatory antes de código

3 razões:

1. **Calibrar pain real** — entrevistas captam o que o vendedor verbaliza. Dogfooding captura o que ele NÃO verbaliza (atrito, esquecimento, frustração silenciosa).
2. **Validar Bridge standalone funcional** — antes de construir UI, garantir que Meta CAPI + Google OC fazem ping-pong via Inngest sem CRM no meio.
3. **Confirmar moat statement** — se ao final do dia você não sentiu falta de NENHUM CRM commodity (kanban, pipeline, lead scoring), confirma que o **Bridge é o moat real** e tudo o resto é commodity.

---

## Setup pré-dia (60min)

### Stack a usar

| Componente | Onde |
|------------|------|
| WhatsApp inbox | WhatsApp Web aberto no notebook |
| Lead spreadsheet | Google Sheets template (link abaixo) |
| Ads tracking | Meta Ads Manager + Google Ads abertos em abas |
| Bridge standalone | Inngest function rodando (deploy localhost OU staging Vercel) |
| Timer | Stopwatch app no celular OU `time` no terminal |

### Spreadsheet template (Google Sheets)

Crie planilha `Tocks Day Of Dogfooding {data}` com colunas:

| Col | Tipo | Exemplo |
|-----|------|---------|
| `timestamp_lead` | datetime | 09:42 |
| `nome` | string | João Silva |
| `whatsapp` | E.164 | +5511999999999 |
| `ad_source` | string | meta_carrossel_v3 ou google_pmax_marca |
| `objeto` | string | Mesa de Bilhar Monaco |
| `valor_estimado` | num | 18000 |
| `status` | enum | novo / contatado / qualified / won / lost |
| `last_touch` | datetime | 14:30 |
| `next_action` | string | Mandar foto medidas 18:00 |
| `notes` | text | Cliente em Brasília, urgência médio |
| `lead_qualified_at` | datetime | (quando marcar Lead Qualificado) |
| `bridge_fired_meta` | bool | TRUE/FALSE |
| `bridge_fired_google` | bool | TRUE/FALSE |
| `won_value` | num | 18000 (só se status=won) |

### Bridge standalone — minimal viable

Antes de começar o dia, Inngest com 2 functions deve estar deployed:

```typescript
// fn 1: lead-qualified-bridge
export const leadQualifiedBridge = inngest.createFunction(
  { id: "lead-qualified-bridge", retries: 3 },
  { event: "tocks/lead.qualified" },
  async ({ event, step }) => {
    const { lead_id, whatsapp, valor_estimado, ad_source } = event.data;

    // 1. Meta CAPI (com idempotency key)
    await step.run("meta-capi", async () => {
      const ev = {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `${lead_id}_meta_${Date.now()}`, // idempotency
        action_source: "website",
        user_data: { ph: [sha256(whatsapp)] },
        custom_data: { value: valor_estimado, currency: "BRL" },
      };
      return await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${TOKEN}`, {
        method: "POST",
        body: JSON.stringify({ data: [ev] }),
      });
    });

    // 2. Google offline conversion upload
    await step.run("google-oc", async () => {
      // chamada upload offline conversion (gclid OU user-provided-data)
      // referência: docs/projects/bretda/sales-ai/google-oc-bridge.ts
    });

    return { ok: true };
  }
);

// fn 2: deal-won-bridge (mesma estrutura com value real)
```

**Ambiente:** Vercel staging com env vars Meta + Google OAuth feito.
**Test pré-dia:** mandar 1 evento fake → confirmar fires no Meta + Google.

---

## Durante o dia — protocolo

### A. Cada lead novo que chegar

1. Olha o número no WhatsApp Web (✋ stopwatch start)
2. Pergunta de onde ele veio se não souber (ad_source)
3. Cria linha no spreadsheet imediatamente
4. Anota timestamp_lead, nome, whatsapp, ad_source, objeto, valor_estimado
5. Status = "novo"
6. ✋ stopwatch stop — anota o tempo gasto em coluna `tempo_intake`

**Métrica chave:** tempo médio intake. Se >2min → CRM precisa resolver isso.

### B. Cada conversa que avança

1. Quando você manda follow-up, atualiza `last_touch` na linha
2. Se cliente entrega documento / decide algo concreto → muda status pra "contatado" ou "qualified"
3. Anota next_action curtinho

**Atrito esperado:** você vai esquecer de atualizar a planilha. Anota essa frequência num scratch pad. Cada esquecimento = ponto pro CRM resolver.

### C. Lead Qualificado event (CRÍTICO)

Quando você decide que aquele lead é qualified:

1. Marca status="qualified" no spreadsheet
2. Preenche `lead_qualified_at`
3. **DISPARA Inngest event manualmente** (curl OU dashboard Inngest):

   ```bash
   curl -X POST https://api.inngest.com/e/tocks/lead.qualified \
     -H "Content-Type: application/json" \
     -d '{"data": {"lead_id": "abc123", "whatsapp": "+5511...", "valor_estimado": 18000, "ad_source": "meta_carrossel_v3"}}'
   ```

4. Aguarda 30s
5. **Verifica:**
   - Meta Events Manager → evento "Lead" apareceu? (test events)
   - Google Ads → upload appeared? (offline conv upload status)
6. Atualiza `bridge_fired_meta` e `bridge_fired_google` na planilha (TRUE/FALSE)

**Se qualquer um falhar:** anota no notes da linha. Isso é debugging real do moat.

### D. Cada deal won

1. Marca status="won", anota `won_value`
2. Dispara `tocks/deal.won` event (mesma estrutura)
3. Verifica bridges igual passo C

### E. Final do dia — debrief 30min

Responda na sua planilha mesma OU em `02-dogfooding-debrief-{data}.md`:

```markdown
# Dogfooding Debrief — {data}

## Volume
- Leads novos: N
- Leads qualified: N
- Deals won: N
- Receita potencial entrada: R$ ___
- Receita won real: R$ ___

## Tempo gasto
- Total horas operando: 8h (típico)
- Tempo médio intake por lead: ___ min
- Tempo total atualizando planilha (estimado): ___ min
- Tempo total alternando entre tabs: ___ min (Pomodoro tracking)

## Atrito identificado (rank 1=pior)
1. _________________________________________
2. _________________________________________
3. _________________________________________
4. _________________________________________
5. _________________________________________

## O que esqueci atualizar (count)
- Follow-up perdido: N
- Update status na planilha: N
- Marcar Lead Qualificado: N
- Anotar ad_source: N

## Bridge funcionamento
- Lead Qualificado events disparados: N
  - Meta CAPI sucessos: N / falhas: N
  - Google OC sucessos: N / falhas: N
- Tempo médio fire-to-confirm: ___ s
- Discrepância contagem Meta vs Google: ___ %

## Veredito do dia
- [ ] CRM precisa existir — atrito alto, pain real
- [ ] Só Bridge é suficiente — pain de tracking, não pain de UI
- [ ] Status quo OK — não dói o suficiente, KILL

## Moat statement final
Depois de 1 dia operando, o moat é:
> ___________________________________________

(Se difere de "Bridge bidirecional Meta CAPI + Google OC" → reabrir Conclave)
```

---

## Sinais que validam Customer Need (continuar Sprint 1)

✅ Você esqueceu de atualizar a planilha 5+ vezes
✅ Você perdeu pelo menos 1 follow-up importante
✅ Você fez tab switching 20+ vezes (WhatsApp ↔ planilha ↔ Ads)
✅ O Bridge disparou corretamente 80%+ das vezes
✅ Você gastou 1h+ só em "operacional" sem agregar valor pro cliente

## Sinais que invalidam (PIVOT Bridge-only ou KILL)

❌ Você passou o dia tranquilo na planilha — não dói
❌ Bridge falhou 50%+ → o problema é só na infra de bridge, não CRM
❌ Você não esqueceu de nada
❌ Você gostou de WhatsApp Web + planilha — fluxo natural

---

## Output esperado Day 7

Compile entrevistas (5×) + dogfooding (1×) num único `50-week-0/03-gate-0-readiness-decision.md` antes de aplicar o checklist Gate 0 (ver `03-gate-0-review-checklist.md`).

---

*Playbook baseado em Moubeche founder dogfooding pattern + Ries Customer Need Pivot + lições KR WhatsApp Void 12/Mai (99 leads perdidos = stage de tracking quebrado, exatamente o que o Bridge resolve).*
