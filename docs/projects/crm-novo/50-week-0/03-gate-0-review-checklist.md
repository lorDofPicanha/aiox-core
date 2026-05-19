# Gate 0 Review Checklist — Customer Need ou PIVOT (Day 7)

**Quando:** Final de Week 0 (Day 7), depois de:
- 5 entrevistas vendedor Tocks done
- 1 dia dogfooding done
- Bridge standalone funcional confirmado

**Decisor:** Breno (founder, sole decision-maker).
**Tempo:** 90min de review honesto.

**Princípio Ries:** *"Customer Need Pivot. If you can't validate the need with $0 effort, $50k effort won't fix it."*
**Princípio Buffett (Circle of Competence):** *"It's not what you don't know that kills you. It's what you're sure of that isn't so."*

---

## 1. Pré-review (30min) — Compile evidência

Preencha esse template ANTES de tomar decisão. Evita confirmation bias.

### 1.1 Entrevistas — Scorecard

| Entrevistado | Customer Need Score (0-10) | WTP R$/mês | Atribuição quebrada citada? | "Volta em 2 sem?" |
|--------------|----------------------------|------------|----------------------------|---------------------|
| Marcus | ___ | R$ ___ | ✅/❌ | ✅/❌ |
| Cristina | ___ | R$ ___ | ✅/❌ | ✅/❌ |
| Breno (self) | ___ | R$ ___ | ✅/❌ | ✅/❌ |
| Externo 1 | ___ | R$ ___ | ✅/❌ | ✅/❌ |
| Externo 2 | ___ | R$ ___ | ✅/❌ | ✅/❌ |
| **Médias** | **___** | **R$ ___** | **N/5** | **N/5** |

### 1.2 Dogfooding — Resultados

| Métrica | Valor real | Threshold ALPHA | Threshold KILL |
|---------|-----------|-----------------|----------------|
| Atrito identificado (count) | ___ | ≥ 5 | ≤ 2 |
| Follow-ups esquecidos | ___ | ≥ 1 | 0 |
| Tab switches | ___ | ≥ 20 | ≤ 5 |
| Bridge success rate | ___ % | ≥ 80% | < 50% |
| "Operacional" sem value | ___ min | ≥ 60 | ≤ 15 |

### 1.3 Bridge standalone — Funcional?

| Cenário | Status |
|---------|--------|
| Inngest Lead Qualificado event fires Meta CAPI 200 OK | ✅/❌ |
| Inngest Lead Qualificado event fires Google OC upload OK | ✅/❌ |
| Idempotency key impede dup-fire em retry | ✅/❌ |
| Audit log row criado por fire | ✅/❌ |
| Dashboard mostra last_fire timestamp | ✅/❌ |

**Sem Bridge funcionando, Sprint 1 NÃO COMEÇA** — o moat tem que estar standalone-validated antes de qualquer UI.

---

## 2. Decisão (30min) — Aplica regras objetivas

### 2.1 Verde · Continua Sprint 1 ALPHA

**Todos os 4 critérios devem passar:**

- [ ] Customer Need médio ≥ 7
- [ ] ≥ 3/5 vendedores pagariam R$ 300+/mês
- [ ] ≥ 3/5 citaram atribuição quebrada espontaneamente
- [ ] Dogfooding: atrito ≥ 5 + bridge success ≥ 80%

**Se TODOS verdes:** abre o ROADMAP, marca Gate 0 ✅, kickoff Sprint 1 segunda Week 1.

### 2.2 Amarelo · Re-Conclave

**1-2 critérios falharam mas não todos:**

- Customer Need entre 4-6
- WTP médio R$ 100-300
- Bridge funciona mas com >20% falhas
- 2/5 citaram atribuição (não 3)

**Ação:** revisita Conclave com 3 experts diferentes (NÃO mesmos 5):

- **Steve Blank** — Customer Development additional probe
- **Patrick Campbell** — Pricing reality check
- **April Dunford** — Positioning sharpening

Roda Conclave NOVO de 60min. Verdict: continua / pivot / kill.

### 2.3 Vermelho · PIVOT Bridge-only

**3+ critérios falharam ou todos amarelos:**

- Customer Need médio ≤ 5
- WTP médio ≤ R$ 200
- < 2 citaram atribuição
- Dogfooding tranquilo (atrito < 3)

**Decisão:** abandona CRM full. Constrói só o **Bridge standalone como produto interno**.

- Stack: só Inngest + Supabase + Meta CAPI + Google OC
- Custo: ~R$ 50/mês infra
- Tempo: 2-4 semanas vs 12-16
- Escopo: Tocks + Bretda + futuros — bridge é multi-tenant trivial
- Sem CRM UI, sem inbox unificado, sem pipeline
- Vende internamente: "atribuição resolvida, sem CRM"

**Move tasks roadmap:** ROADMAP.md Sprints 1-12 → pasta `/40-pivot-bridge-only/` (preservar histórico, redirecionar foco).

### 2.4 Preto · KILL

**Catastrófico: todos os 4 critérios vermelhos + dogfooding tranquilo.**

- Reabsorve tempo em Tocks/Bretda ops + Site-Prospector pilot
- Documenta lições em `99-synthesis/POST-MORTEM-CRM-NOVO.md`
- Sales AI permanece deprecated mas Bridge minimal (5 LOC manual) é OK pra Tocks
- Decisão honesta: o produto não tem customer

---

## 3. Documenta decisão (30min)

Independente do verdict, escreve em `50-week-0/04-gate-0-decision-{data}.md`:

```markdown
# Gate 0 Decision — {data}

## Verdict
- [ ] ✅ Verde — continua Sprint 1 ALPHA
- [ ] 🟡 Amarelo — Re-Conclave dia X
- [ ] 🔴 Vermelho — PIVOT Bridge-only
- [ ] ⚫ Preto — KILL CRM Novo

## Evidência primária
{copia 1.1, 1.2, 1.3 acima preenchidos}

## Surpresas (o que não esperava)
1. ...
2. ...
3. ...

## O que mudou na minha mente
{honestamente — eu ainda acredito no moat statement original? Mesmo se sim, o que ajustaria?}

## Próxima ação concreta
Segunda Week 1 — {ação específica, datada}

## Riscos do verdict
{nem todo verde é seguro — o que pode dar errado mesmo seguindo o plano?}

## Sign-off
Breno · {data} · {ass}
```

**Não pula essa documentação.** Em 3 meses você vai querer saber por que decidiu isso.

---

## 4. Anti-padrões a evitar

❌ **"Confiança no produto" sem evidência** — Buffett: "I never let conviction overrule data."
❌ **Continuar porque "já investi tanto tempo"** — sunk cost fallacy, Ries pivot é VIRTUDE
❌ **Decidir sozinho sem dormir 1 noite com a evidência** — emoção em decisão = bias
❌ **Pular dogfooding "porque já vi vendedor trabalhar"** — você não viu COM ATRITO real
❌ **Adiar Gate 0 "pra coletar mais dados"** — 7 dias é tempo suficiente, decida
❌ **PIVOT Bridge-only por desconforto, não por evidência** — só pivota se evidência objetiva apontar

---

## 5. Comunicação pós-decisão

### Se verde:
- Tocks team: "Sprint 1 começa segunda, 4 semanas até Alpha"
- Bretda: "Q3 vocês entram"
- Patricia Peck: ativar DPA bundle

### Se amarelo:
- Tocks team: "Estou refinando o plano, semana 1 atrasada 7d"
- Re-Conclave em X dias

### Se pivot Bridge-only:
- Tocks team: "Mudei o escopo — só bridge, sem CRM full. Vou explicar"
- Honestidade founder: "ouvi vocês, vocês não precisam de CRM"
- Bretda: "Bridge atende vocês também, mais rápido"

### Se kill:
- Tocks team: silenciosamente. Sales AI volta minimal manual.
- Self-talk: "salvei R$ X de infra e Y semanas de tempo. Reabsorve em Tocks/Bretda."

---

## 6. Calendário Gate 0

```
Day 1 ────► Entrevista #1 (Marcus, 30min) + entrevista #2 (Cristina, 30min)
Day 2 ────► Pitch doc revisado + entrevista #3 (Breno self, 30min)
Day 3 ────► Bridge standalone setup (Inngest deploy + test events)
Day 4 ────► Entrevista #4 (externo 1) + #5 (externo 2)
Day 5 ────► Dogfooding 1 — operando Tocks via planilha + Bridge
Day 6 ────► Reserva (recovery + análise das entrevistas)
Day 7 ────► Gate 0 review (90min) — aplica checklist + documenta decisão
```

Reserva Day 6 propositalmente vazio. **Dormir com a evidência antes de decidir.**

---

*Checklist baseado em Lean Startup pivot framework + Buffett margin of safety + Ries Customer Need Pivot test. Roda Gate 0 com disciplina — esse gate vale 16 semanas de tempo.*
