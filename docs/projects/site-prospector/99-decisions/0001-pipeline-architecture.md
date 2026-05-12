# ADR-0001 — Site-Prospector Pipeline Architecture v1

**Status:** ACCEPTED (2026-05-12, post 4 conclaves)
**Decisor:** Breno (founder) + Orion (orquestrador 4 conclaves)
**Supersedes:** N/A (versão inicial)
**Superseded by:** N/A
**Related:** ADR-0002 (CDC garantia review — pending)

---

## Contexto

Brand-new project: agência autônoma assistida para vender "Presença Local Premium" a pequenos negócios locais Tier S em Vale do Itajaí → Florianópolis. Founder solo (Breno, Blumenau).

Proposta inicial (pré-conclaves): pipeline 8-fases (prospect→diagnose→niche-research→multi-ref-design-extract→brief→build→production-gate→offer), 3 skills novas (audit-site, multi-ref-extract, production-gate), preço R$ 2.5-5k + R$ 99-199/mo, garantia não-definida.

Para uma decisão de arquitetura de magnitude (envolve modelo de negócio + sequência de desenvolvimento + alocação de tempo do founder), 4 squads-conclave de mind clones foram rodados sequencialmente.

---

## Decisão

**Adotada Architecture B** (Tiered Value Metric) com **DON'T CODE SKILLS YET** durante piloto manual de 3 prospects em 4 semanas.

### Stack final

| Dimensão | Decisão |
|---|---|
| **Positioning** | "Presença Local Premium pra Padaria Artesanal do Vale do Itajaí" (NÃO "site"). Big Fish Small Pond — Dunford. |
| **Upfront** | **R$ 3.497** (6× R$ 583 cartão / R$ 3.197 à vista 8% desc) |
| **Recurring** | **R$ 247/mo Growth tier default** (Essential R$149 / Growth R$247 ⭐ / Scale R$397) |
| **Âncora** | Honesta: "agência tradicional R$ 7.500-9.000 em 6-8 semanas" |
| **Stack** | **5 itens outcome-labeled** (não 9 features) |
| **Garantia** | **Performance Blumenau non-cash**: 3mo recurring grátis + 1 sessão fotos sazonais = R$ 1.541 valor / R$ 591 custo real |
| **Sales sequence** | **Dor → Teach → Reveal** (Reframe-Then-Reveal — Dixon). Preview URL só minutos 8-10. |
| **Skills codadas** | **ZERO durante piloto** (Process veto) |
| **Piloto sample** | 3 prospects, 4 semanas, two-stage validation, Blumenau-only padaria artesanal |
| **Outreach** | Humano (Breno) presencialmente. Agente AIOS prepara offer pack pronto. |

---

## Reconciliação dos 4 squads

### Squad #1 — Strategy (april-dunford + alex-hormozi + matt-dixon)

**Aceito integralmente:**
- Reframe da categoria: "Presença Local Premium" não "site"
- Big Fish Small Pond, Blumenau-only nos primeiros 10
- Concorrente real = status quo + sobrinho R$800 + freelancer R$1k (NÃO agência R$10k+)
- Dor → Teach → Reveal sequence (35-45% vs 18% win rate)
- Garantia condicional mandatória (especificity fecha)
- Anchor customer #1: R$ 0-1k em troca de testimonial + indicação 5 padeiros
- Sazonalidade fev/mar pré-Páscoa + set/out pré-Natal

**Overridden por Pricing squad:**
- ~~R$ 4.997 upfront~~ → R$ 3.497
- ~~R$ 15.000 anchor riscado~~ → R$ 7.500-9.000 honest anchor
- ~~9-item stack~~ → 5 outcome-labeled items
- ~~100% refund 60d~~ → non-cash R$ 591 cost reversal
- ~~R$ 197/mo flat~~ → tiered Essential/Growth/Scale

### Squad #2 — Quality (brad-frost + addy-osmani + kat-holmes)

**Aceito integralmente:**
- 8 novos gates com thresholds numéricos (synthesis, field-perf, inclusive-design, content-truth, local-SEO, legal, maintainability, visual-regression)
- Anti-clone POR CATEGORIA (color ≤85%, type ≤75%, layout ≤60%), não threshold global único
- +2 refs LOCAIS obrigatórias além das 3 globais (pattern inventory antes de pattern library)
- Body type ≥18px (não 16), contrast ≥7:1 (AAA), touch ≥48px
- Field-perf gate BR (WebPageTest gru1 + Moto G + Slow 4G), não só Lighthouse
- WhatsApp `wa.me` deep-link É o evento de conversão (não form submit)

**Reds flags adicionadas ao registry:**
- 3G dead-zones Itoupava/Garcia/Velha
- Sazonalidade Blumenau Oktoberfest/Páscoa/Festa Junina → slot editável obrigatório
- Refs Tartine/Poilâne enviesam — precisa ≥1 padaria SC/PR com GBP ativo
- Customer 55+ → telefone tappable header + sticky-mobile

### Squad #3 — Process (goldratt + eric-ries + kozyrkov)

**OVERRIDE crítico do plano original:**
- DON'T CODE 3 skills antes de validar willingness-to-pay
- Constraint real é CLOSE RATE + outreach-physical-ceiling, NÃO build hours
- Manual pilot 3 prospects em 4 semanas com pre-registered criteria
- Two-stage validation: Stage 1 (offer pack + verbal price) → Stage 2 (build SE pago)
- Throughput cadência: 1 site/semana max (Goldratt drum)
- Role separation: judge é critério escrito ANTES, não Breno decidindo no calor

**Aceito integralmente.** Próximas skills só serão codadas pós-pilot SUCCESS, e APENAS a 1 que dados identificam como constraint binding.

### Squad #4 — Pricing & LTV (patrick-campbell + lincoln-murphy + rob-walling)

**Aceito integralmente (overrides Strategy quando conflita):**
- Architecture B (tiered) sobre A (lean) e C (rev-share)
- Parcelamento 6× cartão MANDATÓRIO (70%+ SMB BR parcela)
- R$ 15k anchor fake → R$ 7.5-9k honest
- Drop Instagram tune-up do recurring baseline (toxic operacional)
- Drop "treinamento 1h presencial GBP" (padeiro 55+ não absorve)
- Stack 9 → 5 outcome-labeled items
- LTV math stress-tested (base R$ 4.475 / pess R$ 2.939 / opt R$ 7.280)
- Founder throughput ceiling: ~4 deals/mês = ~R$ 12-16k MRR cap Blumenau-center
- Success Vector Report (Murphy) — 8h construindo template vale 4-6 meses price optim
- Expansion ladder pronto antes do piloto (Gestão Tráfego R$497 / Fotos Sazonais R$800 / WhatsApp Catalog R$497)
- CDC/PROCON risk → consulta @patricia-peck mandatória (ADR-0002)

---

## Pre-registered criteria (Kozyrkov non-negotiable)

Ver detalhes em [00-pre-registered-criteria.md](../02-pilots/blumenau-padaria-artesanal/00-pre-registered-criteria.md).

**Summary:**

| Status | Condição (≥1 deve disparar pra SUCCESS, qualquer 1 dispara KILL) |
|---|---|
| **SUCCESS** | ≥1 pagou R$1.5k 1ª parcela + ≥1 site Lighthouse ≥90 + build ≤16h + AIOS contrib ≥60% + recurring ≥R$149/mo aceito + meeting rate ≥60% + 0 garantia disparada OR cost absorvido |
| **PERSEVERE WITH PIVOT** | 1 pagou <R$1.5k OR <R$149/mo recurring (value-capture pivot); 0 pagaram mas 2+ "manda proposta" (channel pivot); build >20h (process pivot); AIOS 40-60% (tier reprice up) |
| **KILL** | 0/3 pagaram E 0/3 "manda proposta"; build >25h E defeitos >3 em 14d; 3/3 negociaram <R$1.5k; 4 semanas elapsed com <2 prospects em Stage 2; CDC liability não-mitigável |

**Default action signed:** Se KILL, tempo volta integralmente pra Tocks/Bretda/Vorza imediatamente. Sem extensão de prazo, sem "deixa eu tentar mais 1".

---

## LTV math base case

Premissas:
- Vercel cost real R$ 15/site/mo (NÃO R$ 60 — Pro shared overhead)
- Founder soft-cost R$ 60/h × 1h/mo per client = R$ 60/cliente/mo opex
- MDR cartão parcelado 6× ≈ 7%

```
Upfront net = R$ 3.497 × (1 - 0.07 MDR) × (1 - 0.10 refund-fire) = R$ 2.927
Monthly margin = R$ 247 - R$ 15 Vercel - R$ 60 soft-cost = R$ 172/mo
Avg tenure base = 9 months @ 7% monthly churn

LTV BASE = R$ 2.927 + (9 × R$ 172) = R$ 4.475
CAC presencial (12h × R$ 100) = R$ 1.200
LTV:CAC = 3.7× ✓ healthy
```

**Breakeven founder:** 3 deals fechados/mês cobre R$ 8k baseline + R$ 1k overhead.
**Ceiling Blumenau:** 4 deals/mês max presencial = R$ 12-16k MRR antes de exigir 2ª pessoa.

**Sensibilidade #1:** AVG TENURE — cada mês adicional retido = +R$ 172/cliente. Daí a importância do Success Vector Report (Murphy).

---

## Red flags monitorados

Categorias e gatilhos de detecção em [CONTEXT.md](../00-context/CONTEXT.md#não-negociáveis-gates-quality-squad) seções relevantes. Consolidado:

🔴 **CRÍTICAS (kill/stop-line):**
- RF1 Refund cascade (33%) → mitigado por non-cash R$591 garantia
- RF2 AIOS contribution <50% → 80% automation thesis morta; pre-registered critério unfalsifiable sem protocolo
- RF3 CDC/PROCON liability → ADR-0002 pendente Patricia Peck
- RF4 Cash flow trap parcelamento 6× = R$583/mês líquido (NÃO R$3.497 upfront)
- RF5 Build estourou 18h prospect #1 → STOP-the-line

🟡 **OPERACIONAIS:**
- RF6 Field perf 3G dead-zones Blumenau
- RF7 Preview leakage (sobrinho copia em Wix) → watermark + screenshots minutos 0-5
- RF8 Founder ceiling 4 deals/mês
- RF9 Padaria-Blumenau exhaustion (20-50 estabelecimentos)
- RF10 Sunk-cost firing ("vamos começar pelo audit-site")
- RF11 Insta tune-up no recurring = toxic → REMOVIDO baseline
- RF12 Treinamento GBP 1h → REMOVIDO
- RF13 Recurring SLA eaten (3+ edits/30d)
- RF14 Atribuição argument sem rules document pré-venda

---

## Consequências

**Positivas:**
- Pricing validado economicamente em 3 cenários (não improviso)
- Garantia protege founder bootstrapped (R$591 cost vs R$3.497 lethal)
- Pre-registered criteria força decisão pivot/persevere/kill objetiva (anti sunk-cost)
- Skills só nascem se pilot prova willingness-to-pay (eficiência de capital)
- 4 squads com 12 perspectivas independentes cobrem blindspots cruzados

**Negativas / Riscos:**
- Maio 2026 é desert (não fev/mar) — close rate piloto pode ser baixo só pela sazonalidade
- Patricia Peck consultation bloqueia contrato v1 (não outreach informal)
- Founder physical-presence cap Blumenau = ceiling R$ 16k MRR sem 2ª pessoa
- Padaria nicho tem só 20-50 estabelecimentos na cidade — esgota cedo se piloto escala
- AIOS contribution protocol ainda não definido — risco crítico unfalsifiable

**Tradeoffs aceitos:**
- Skills coding deferred até pilot SUCCESS (Process > Strategy quando tensão)
- Pricing menor que original (R$3.497 vs R$4.997) em troca de close rate maior (Pricing > Strategy quando tensão)
- Garantia menos generosa que "100% refund" em troca de founder survival (Pricing veta Strategy)
- Sample 3 (Process Ries) vs 1 (Goldratt drum) — compromisso pra variance + statistical signal

---

## Próximas ADRs previstas

- **ADR-0002** — CDC/PROCON garantia review (Patricia Peck) — **CRÍTICA, bloqueia contrato v1**
- **ADR-0003** — AIOS contribution measurement protocol — bloqueia critério SUCCESS unfalsifiable
- **ADR-0004** (pós-pilot) — Qual skill codar primeiro baseado nos dados
- **ADR-0005** (pós-pilot SUCCESS) — Expansão geo Floripa: modelo presencial cap vs remoto premium
- **ADR-0006** (pós-pilot SUCCESS) — Outros nichos Tier S após padaria SUCCESS

---

## Referências

- Conclave Strategy: rodado 2026-05-12, output em thread context
- Conclave Quality: rodado 2026-05-12, output em thread context
- Conclave Process: rodado 2026-05-12, output em thread context
- Conclave Pricing & LTV: rodado 2026-05-12, output em thread context
- Patricia Peck consultation: rodada 2026-05-12 (background, ADR-0002 pending)

Skills externas referenciadas:
- design-md extractor: by Alan Nicolas, `.claude/skills/design-md/` (provisioned by user)
- tech-research skill: `.claude/skills/tech-research/` (provisioned by user, calibrado Tier S 2h)

CLAUDE.md project rules respected:
- `.claude/rules/jarvis-integration.md` — auto-conclave used (4 squads via background agents)
- `.claude/rules/mind-clone-auto-consult.md` — mind clones consulted before significant decisions
