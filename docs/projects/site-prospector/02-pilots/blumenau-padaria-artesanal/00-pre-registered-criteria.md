# Pre-Registered Criteria — Piloto Blumenau Padaria Artesanal

> **ASSINADO antes do prospect #1 outreach. Não pode ser alterado durante o piloto.**
> Kozyrkov non-negotiable: pré-comprometer critérios é o ÚNICO antídoto contra confirmation bias quando founder = prospector = builder = judge.

**Data de assinatura:** 2026-05-12
**Founder/operator:** Breno de Cerqueira
**Reviewer/judge role:** critério escrito (ESTE documento) + opcional 1 humano externo (advisor/sócio)
**Janela:** 2026-05-12 (segunda) → 2026-06-09 (segunda) = **4 semanas calendário**
**Sample size:** 3 prospects max
**Throughput cap:** 1 site/semana (Goldratt drum)

---

## 1. SCOPE

**Nicho piloto:** padaria/confeitaria artesanal
**Geo piloto:** Blumenau-city only (SC)
**Tier:** S (R$ 3.497 + R$ 247/mo Growth tier default — Architecture B)
**Outreach:** presencial pelo Breno

**EXPLICITAMENTE FORA do escopo:**
- Outros nichos (clínica, salão, mecânica) — só após KILL/PIVOT
- Outras cidades (Brusque, Itajaí, Floripa) — só após SUCCESS + ADR-0005
- Tier M ou T — não existem ainda
- Build > 16h per site — STOP-the-line, não passa
- Pricing negociado abaixo de R$ 1.500 1ª parcela — é um NÃO

---

## 2. TWO-STAGE VALIDATION (Kozyrkov sequencing)

### Stage 1 — Offer Pack (zero build cost)
**Trigger:** Breno visita prospect presencialmente.
**Deliverable:** 5-slide Keynote + dossiê de dor + mockup hand-drawn + verbal price quote (R$ 3.497 + R$ 247/mo).
**Sales sequence:** Dor → Teach → Reveal (ver [02-offer-pack-template.md](./02-offer-pack-template.md)).
**Capture:**
- Resposta verbal: SIM / NÃO / "manda proposta" / "deixa eu pensar"
- Se SIM: pediu desconto? quanto?
- Se NÃO: razão declarada (taxonomia em pilot-log)
- Objeções listadas
- Próxima ação combinada

**Stage 1 → Stage 2 trigger:**
- Prospect pagou ≥ **R$ 1.500** (1ª parcela 6× OU pagamento parcial à vista)
- Contrato v1 assinado (pending ADR-0002 Patricia Peck — pode ser pre-contrato verbal + email confirmation até CDC review estar pronto)

### Stage 2 — Build & Ship (6-16h)
**Trigger:** Stage 1 paid + signed.
**Deliverable:** site live + Production Gate PASS + onboarding cliente.
**Capture:**
- Build hours REAL (time-track)
- AIOS contribution % medido (protocolo abaixo)
- Defects 0-14d pós-launch (qty + category)
- Cliente satisfação subjetiva (30d in-person check-in)

---

## 3. AIOS Contribution Measurement Protocol (CRÍTICO)

> **Sem isso, critério SUCCESS "AIOS contrib ≥60%" é unfalsifiable. NÃO RODA PILOTO sem protocolo definido.**

### Métrica primária: **% lines-of-deliverable atribuível a AIOS**

Por categoria de output:

| Output | Como medir AIOS % |
|---|---|
| **Design tokens** (cores, type, spacing) | tokens.json gerado por design-md / multi-ref-extract manual = AIOS 100%; tokens editados manualmente pelo Breno após = AIOS % = lines_AI / total_lines |
| **Copy do site** | seções geradas por LLM via prompt = AIOS 100%; seções escritas/reescritas pelo Breno = AIOS 0% (per-section binary). Final % = words_AI / total_words. |
| **Código componente (TSX/CSS)** | LLM-generated code = AIOS 100%; Breno-edited lines = subtract. Use git blame proxy. |
| **Imagens** | LLM-generated via fal.ai/Midjourney = AIOS 100%; foto presencial Breno = AIOS 0%; stock = AIOS 50% (curadoria humana mas asset pronto). |
| **Pesquisa nicho** | refs identificadas por agente AIOS = 100%; refs sugeridas pelo Breno = 0%. Counted by source. |

### Métrica secundária: **% tempo Breno spent**

Time-tracking obrigatório por categoria:
- Outreach (presencial + follow-up) — sempre humano
- Build supervision (revisar AIOS output, editar) — % do total build hours
- Hand-edit (Breno escrevendo do zero) — horas
- Cliente comms (call/Whats) — sempre humano

**Fórmula AIOS contribution % = (output AIOS % × 0.7) + ((1 - Breno hand-edit hours / total build hours) × 0.3)**

**Threshold SUCCESS:** ≥ 60%
**Threshold PERSEVERE:** 40-60% (tier reprice OU scope narrow)
**Threshold KILL:** < 40% (80% automation thesis morta)

### Captura
- Time tracker simples (Toggl ou planilha): cada bloco de trabalho rotulado.
- Per-deliverable AIOS % registrado em [06-pilot-log.md](./06-pilot-log.md) tabela "AIOS contribution audit".
- Não computar retrospectivamente — log durante.

---

## 4. SUCCESS CRITERIA — continuar investindo + codar APENAS 1 skill

**Todos os 7 devem disparar para SUCCESS:**

| # | Critério | Threshold | Como medir |
|---|---|---|---|
| 1 | Conversão Stage 1 → 2 | ≥ 1 prospect pagou **R$ 1.500+** 1ª parcela (de 3 prospects) | comprovante pagamento |
| 2 | Site shipped Lighthouse | ≥ 1 site Lighthouse mobile **≥ 90** em 4 categorias | Lighthouse CI run, BR location |
| 3 | Build budget | Site shipped construído em **≤ 16h** (1.3× ceiling) | time-tracker |
| 4 | AIOS contribution | **≥ 60%** medido pelo protocolo § 3 | log audit |
| 5 | Recurring acceptance | ≥ 1 prospect aceitou **≥ R$ 149/mo** (Essential floor) | contrato assinado |
| 6 | Outreach-to-meeting | **≥ 60%** (2 de 3 prospects deram meeting presencial) | pilot-log |
| 7 | Garantia downside | Zero garantia disparada OR 1 disparada com **R$ 591 cost absorvido** (não R$ 3.497 refund) | garantia ledger |

**Se SUCCESS → próximo ADR (0004) decide QUAL skill codar baseado no que os dados identificaram como constraint binding.** Provavelmente UMA das 3:
- `audit-site` (se dossiê de dor manual consumiu >4h por prospect)
- `multi-ref-extract` (se design extraction sintetizando 3 refs consumiu >6h por site)
- `production-gate` (se QA manual consumiu >3h por site)

---

## 5. PERSEVERE WITH PIVOT — re-rodar com ajuste, sem codar skill

**Qualquer 1 dispara PERSEVERE (NÃO mutually exclusive com SUCCESS — pode ter ambos):**

| Sinal | Pivot type | Ação |
|---|---|---|
| 1 pagou mas <R$ 1.500 1ª parcela | **value-capture pivot** | Reanchor o preço pra baixo OU reescrever offer pack pra justificar prêmio |
| 1 aceitou recurring mas <R$ 149/mo | **value-capture pivot** | Repensar Essential tier OR cortar entregável |
| 0 pagos mas 2+ disseram "manda proposta" | **channel/timing pivot** | Manda proposta, abre follow-up 7d. Refaz outreach com calendário diferente (set/out se piloto rodou em maio) |
| Build estourou 20h | **process pivot** | Documenta bottleneck phase ANTES de codar qualquer skill. ADR adicional pra decidir |
| AIOS contribution 40-60% | **tier/scope pivot** | Tier reprice up (R$ 4.497?) OR scope narrow (remove 1 dos 5 items do stack) |
| 25%+ refund rate na garantia | **risk reversal pivot** | Restructure attribution rules OR drop garantia formal (Walling ultra-conservative) |
| Cliente pediu >3 edits em 30d pós-launch | **SLA pivot** | Reescreve SLA recurring OR mata modelo recurring (one-shot only) |

---

## 6. KILL CRITERIA — abandona Tier S, reabsorve em Tocks/Bretda/Vorza

**Qualquer 1 dispara KILL:**

| # | Critério | Detecção |
|---|---|---|
| K1 | **0 / 3 pagaram E 0 / 3 disseram "manda proposta"** (rejeição pura) | semana 4 review |
| K2 | 1 pago MAS build > 25h E defeitos > 3 em 14d (unit economics morto) | semana 4 review |
| K3 | **3 / 3 negociaram abaixo de R$ 1.500** 1ª parcela | running |
| K4 | 4 semanas elapsed com **< 2 prospects em Stage 2** (outreach-ceiling hit cedo) | semana 4 review |
| K5 | CDC/PROCON liability identificada por Patricia Peck E **não-mitigável** com redação alternativa | ADR-0002 disposition |
| K6 | Refund cascade: 2+ garantias disparadas em piloto (33%+ rate) | running |

**Default action signed (Kozyrkov non-negotiable):**

> Em caso de KILL, o tempo do Breno volta INTEGRALMENTE para Tocks/Bretda/Vorza imediatamente (todos com revenue-active fires per memory). Site-prospector vira post-mortem (five-whys obrigatório), e os 9 arquivos deste piloto ficam como referência histórica. Sem extensão de prazo. Sem "deixa eu tentar mais 1 padaria". Sem pivot pra outro nicho sem ADR formal pré-decidindo budget.

---

## 7. ROLE SEPARATION

**Operator (Breno):**
- Prospector, presencial outreach, builder, capturer
- NÃO decide pivot/SUCCESS/KILL no calor — apenas captura dados

**Judge (este documento + opcional 1 reviewer):**
- Lê os critérios PRÉ-REGISTRADOS acima
- Compara com dados capturados em [06-pilot-log.md](./06-pilot-log.md)
- Verdita SUCCESS / PERSEVERE / KILL puramente baseado nos thresholds
- Optional: 1 advisor humano externo lê dados e renderiza verdict como cross-check anti-bias

**Review date:** **2026-06-09 (segunda)** — hard date, não move sob NENHUMA condição.

---

## 8. DATA CAPTURE DASHBOARD (operacionalizado AGORA, métrica nomeada por último)

Captura em [06-pilot-log.md](./06-pilot-log.md). Variáveis obrigatórias por prospect:

### Time series
- Data 1º contato (visita ou mensagem)
- Data meeting Stage 1 (presencial)
- Data resposta Stage 1 (SIM/NÃO/maybe)
- Data Stage 1 paid (se aplicável)
- Data build start
- Data build end
- Data site shipped (Production Gate PASS)
- Data primeiro evento atribuível pós-launch (cliente novo)

### Counters
- Hours outreach (presencial + follow-up)
- Hours build (separado: AIOS-generated review/edit vs Breno hand-edit)
- Hours cliente comms (call/Whats pós-venda)
- Defects 0-14d (qty + category)
- Edits requested 0-30d

### Currency
- R$ pago Stage 1 (1ª parcela)
- R$ recurring contratado/mês
- R$ MDR descontado (efetivo após pagamento)
- R$ refund/garantia disparada (cost real)

### Responses (taxonomia)
- Objection category: preço / tempo / desconfiança / "já tem" / "não preciso" / "preciso pensar"
- Attribution dispute? (SIM/NÃO) — se SIM: tipo
- Satisfação subjetiva 30d (1-5 escala simples)

---

## 9. PRE-MORTEMS (cinco histórias do fracasso)

Kozyrkov mandatório — escrito ANTES do prospect #1. Cada uma 1-2 parágrafos.

### História #1: "Padeiros não pagam R$ 3.497 — preço é o teto"
[escrever antes outreach]

### História #2: "Pagam mas churnam em 90d — recurring R$ 247 não sustenta"
[escrever antes outreach]

### História #3: "AIOS contribution real foi 35% — modelo agência autônoma é fantasia"
[escrever antes outreach]

### História #4: "Build estourou 20h+ por site — unit economics colapsa mesmo com close rate alto"
[escrever antes outreach]

### História #5: "1 padeiro disputou garantia em PROCON, virou processo, queimou 1 ano e R$ 5k advogados"
[escrever antes outreach]

> Estas histórias serão escritas no início do piloto (semana 1 dia 1) e revisitadas no review semana 4 — checar quais aconteceram, quais não, e quais "unknown unknowns" emergiram.

---

## 10. ASSINATURA E LOCK

Este documento é o **contrato de pilot** entre Breno (operator) e os critérios (judge).

Alterações neste documento durante o piloto = invalidam os critérios. Pode-se ADICIONAR observações (campo "addenda" abaixo) mas NÃO alterar thresholds, escopo, prazo, ou kill criteria.

**Lock date:** 2026-05-12
**Review date:** 2026-06-09 (segunda) — hard
**Default action (KILL):** reabsorção integral em Tocks/Bretda/Vorza, post-mortem 5-whys

---

## Addenda (observações operacionais durante piloto — NÃO altera critérios)

[a ser preenchido week-by-week conforme necessário]
