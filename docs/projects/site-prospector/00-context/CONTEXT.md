# Site-Prospector — Project Context

> **Read this FIRST** when working on site-prospector. Per `.aios-core` project-context-loading rule.

**Last updated:** 2026-05-12 (post 4 conclaves + Architecture B locked)

---

## Tese

Agência autônoma assistida que entrega **"Presença Local Premium"** (NÃO "site" — site é commodity 2026) para pequenos negócios locais Tier S no eixo **Vale do Itajaí → Florianópolis**.

Diferencial técnico: pipeline extrai design.md de 3+ referências globais do nicho com brutal QA gate. Diferencial econômico: presença física do founder (Breno, baseado em Blumenau) permite oferta presencial + sessão fotos no local — agência tradicional não faz isso.

**Outreach** disparado por humano (Breno) presencialmente. Agente AIOS prepara o offer pack completo.

---

## Escopo geográfico

Blumenau, Brusque, Itajaí, Balneário Camboriú, Itapema, Bombinhas, Porto Belo, Tijucas, Biguaçu, São José, Florianópolis. ~1.5M habitantes na grande área, ~150-300k empresas.

**Piloto v1:** Blumenau-city only (Big Fish Small Pond — Dunford). Expansão geo só após pilot SUCCESS + análise unit economics.

---

## Tier ativo: APENAS Tier S

| Métrica | Valor |
|---|---|
| Ticket upfront | **R$ 3.497** (parcelado 6× R$ 583 cartão OU R$ 3.197 à vista 8% desc) |
| Âncora honesta | "Agência tradicional cobraria R$ 7.500-9.000 e demoraria 6-8 semanas. Eu entrego em 10 dias por R$ 3.497." |
| Recurring (Growth tier default) | **R$ 247/mês** |
| Recurring tiers | Essential R$ 149 / Growth R$ 247 ⭐ / Scale R$ 397 |
| Research budget | 2h tech-research |
| Refs extraídas | 3 globais + 2 locais (squad Quality demanda locais) |
| Build budget | 6-12h |
| Stack | Next.js 16 + Tailwind + Vercel + Supabase (se form/data) |

**LTV base case:** R$ 4.475 (9mo tenure, 7% churn/mo) → LTV:CAC 3.7×
**Throughput ceiling Blumenau:** ~4 deals/mês presencial = ~R$ 12-16k MRR

---

## Stack core — 5 itens outcome-labeled (compressed de 9)

1. **Sua loja achável no Google + Maps** (GBP reconstruído + 30d fotos + SEO local + schema LocalBusiness)
2. **Site que vende às 22h quando você dorme** (Next.js, Lighthouse ≥90 mobile, gates Quality squad)
3. **Instagram que parece de marca grande** (bio + highlights + 12 posts pillar — ONE-SHOT, NÃO recurring)
4. **Fotos suas, do seu produto, do seu jeito** (sessão 2h presencial Blumenau)
5. **Suporte humano em Blumenau, presencial sempre que precisar**

**Removidos do stack original (squad Pricing):**
- ~~Treinamento 1h presencial GBP~~ → padeiro 55+ não absorve; vira "cuidamos pra sempre"
- ~~SSL + LGPD + WhatsApp button + Maps integration~~ → implícitos no item 2 (não viram bullet separado, parecem padding)

---

## Garantia Performance Local Blumenau (CDC-compliant per ADR-0002 — Patricia Peck delivered 2026-05-12)

> **STATUS: STRUCTURE LOCKED + CDC LANGUAGE LOCKED.** Contrato v1 final aguarda redação por advogado(a) OAB-SC ativa (~R$ 2.500-5.000).
> **3 show-stoppers Patricia Peck corrigidos:** "site que vende" → "recebe pedidos"; "0 cliente novo" → "0 eventos atribuídos"; anchor numérico → "modelos tradicionais investem substancialmente mais (SEBRAE/ABRADi)".
> **Exposição financeira:** queixa formal 5-10% por deal / ação judicial 1-3% COM ajustes (vs 15-25% / 5-10% SEM).

Redação **conceitual** (aguarda redação CDC-compliant em [ADR-0002](../99-decisions/0002-cdc-garantia-patricia-peck.md)):

> "Se em 60 dias 0 cliente novo atribuível pelas regras objetivas (clicks WhatsApp button + GBP calls trackados pré-definidos), você recebe 3 meses recurring grátis (R$ 741) + 1 sessão fotos sazonais extra (R$ 800). Total R$ 1.541 em concessões. Você fica com o site, GBP reconstruído, Instagram tunes-ado."

**Cost reversal real:** R$ 591 (3× R$ 197 hosting cost) vs R$ 3.497 refund = 1/6 do downside (Walling defense).

**Atribuição pré-acordada:** ver [03-attribution-rules.md](../02-pilots/blumenau-padaria-artesanal/03-attribution-rules.md).

---

## Critério de prospect (Fase 1)

**INCLUI** (todos os 3):
- CNPJ ativo
- Instagram >500 followers (sinal de vida)
- (sem site OR site quebrado/2015-era OR WordPress abandonado)

**EXCLUI:**
- Cliente já com site moderno funcionando bem
- Sem CNPJ ou inativo
- Sem presença digital (Insta morto = baixa probabilidade WTP)

**Piloto nicho:** padaria/confeitaria artesanal em Blumenau.

---

## Não-negociáveis (gates Quality squad)

**Pre-synthesis gate** (antes de aceitar multi-ref-extract):
- Token provenance verificada (cada token traceia pra ≥1 ref)
- Anti-clone per category: color ≤85% / type ≤75% / layout ≤60% (spacing/radius livre)
- ≥3 refs globais + ≥2 refs locais
- Atom-level convergence required, organism-level deliberate
- Industry-fit gate (3 refs do mesmo arquétipo do nicho)
- Exclusion-habit filter (rejeita thin-on-thin, micro-type, hover-only — em token level)

**Field-perf gate** (antes de production-gate):
- WebPageTest BR (gru1) + Moto G Power + Slow 4G simulado
- LCP ≤2.0s field / ≤1.2s lab
- INP ≤200ms
- CLS ≤0.05
- TTFB ≤600ms
- Initial JS ≤80KB gzipped (hard cap 100KB)
- Total first-view ≤500KB
- Hero image ≤180KB AVIF / 240KB WebP fallback

**Inclusive-design gate** (token + componente):
- Body type ≥18px (não 16)
- Line-height ≥1.5
- Touch targets ≥48×48 CSS px, spacing ≥8px
- Body contrast ≥7:1 (AAA, não AA — sunlight em Blumenau come 2-3 stops)
- Focus indicator ≥3px, ≥3:1 contrast
- Zero icon-only actions (todo botão tem label)
- `prefers-reduced-motion` honorado
- Zero autoplay carousels
- Native HTML form inputs (sem custom dropdown/datepicker)
- `tel:` + `wa.me` + map deep-link clickables

**Content-truth gate:**
- NAP real validado vs Google Maps API
- Horário real
- Menu/preços reais
- WhatsApp number responde wa.me válido (ping test)
- Zero placeholder copy
- Readability ≤6th-grade PT-BR

**Local-SEO gate:**
- Schema.org `LocalBusiness` + `Bakery` JSON-LD
- NAP matches Google Business Profile
- OG image real photo ≥1200×630
- sitemap.xml + robots.txt
- Canonical URLs

**Legal gate (LGPD):** ver [ADR-0002 Patricia Peck pending]

**Maintainability gate:**
- Content surface editável (MDX file / JSON data / CMS leve)
- Documentar no handoff
- Sem isso = recurring R$247 churna mês 4

**Visual-regression gate:**
- SSIM ≥0.95 entre preview.html (extractor) e built-site (hero/nav/footer)

---

## Anti-padrões registrados

- **Build before validating willingness to buy** → Two-stage validation obrigatório (offer pack + verbal price ANTES de build)
- **Clone visual de referência única** → ≥3 refs independentes obrigatórias, anti-clone por categoria
- **Industry mismatch** → fit-gate (não usa design Linear em padaria)
- **Stack stuffing** → 5 itens outcome-labeled, não 9 features-labeled
- **Fake anchor** → R$ 15k riscado destrói trust; usa R$ 7.5-9k ("agência") honesto
- **100% refund garantia** → bootstrapped-lethal; usa non-cash R$ 591 cost
- **"Modern web aesthetic" pra audience 55+** → exclusion habit (thin gray-on-gray, animação, hover-only)
- **Reveal-first sales sequence** → Dor → Teach → Reveal vence 35-45% vs 18% win rate
- **AIOS contribution não-mensurada** → critério unfalsifiable; precisa protocolo definido ANTES do prospect #1
- **Lock geo Blumenau-only nos primeiros 10 clientes** → Big Fish Small Pond > diversificação prematura

---

## Pricing Architecture B (LOCKED — Squad #4 Pricing & LTV)

```
UPFRONT R$ 3.497
├── Parcelamento 6× R$ 583 (cartão) OU R$ 3.197 à vista (8% desc)
├── Âncora: "Agência cobraria R$ 7.500-9.000"
└── Includes: 5-item stack outcome-labeled

RECURRING tiered (Growth default)
├── Essential R$ 149/mo  (hosting + GBP guardian + relatório)
├── Growth    R$ 247/mo  ⭐ default (Essential + 1 edit/mo + Insta 4 posts/mo)
└── Scale     R$ 397/mo  (Growth + gestão tráfego pago básico, sem ad spend)

GARANTIA: Performance Blumenau (non-cash R$ 1.541 valor, R$ 591 custo real)
PAGAMENTOS: cartão 6× / boleto à vista / Pix à vista
EXPANSION: ver 05-expansion-ladder.md (Gestão Tráfego R$497/mo / Fotos Sazonais R$800 / WhatsApp Catalog R$497)
```

---

## Outreach calendar

**Ótimo:**
- fev/mar (pré-Páscoa) — padaria fatura 60%+ em datas sazonais
- set/out (pré-Natal)

**Aceitável (com close-rate menor):**
- abril (pós-Páscoa, mas pegada de "agora arrumo pra próxima")
- nov (pré-Natal late)
- mai (piloto pode rodar aqui pra learning)

**Desert:**
- janeiro, julho

**Piloto v1 rodando em MAIO/2026** — não-ótimo, aceito pra captura de learning sobre processo (não sobre conversion benchmark final).

---

## Per-Vertical Primer System (ADR-0003)

> Validated DR1+DR2 — pipeline produz outputs 86% vertical-distinct sem fragmentar.

**Location:** `.aios-core/data/site-prospector/primers/`

**Active primers:**
- `padaria-artesanal.yaml` (DR1-derived)
- `oficina-mecanica.yaml` (DR2-derived)

**Schema:** `_schema.yaml` (v1.0 LOCKED). README com curation guide.

**Backlog priority:**
1. clínica-odonto-boutique (anxiety-driven axis)
2. ateliê-moda-autoral (emotional-aspirational)
3. estética-beauty, marcenaria-custom, advocacia-boutique, restaurante-tradicional, eletricista-predial (P3 — degradation test)

**Override hierarchy:** prospect → client business → primer → universal defaults.

## Skills externas instaladas (`.claude/skills/`)

- ✅ `design-md` — static CSS extraction + token detection. **CAVEAT:** LLM step (claude-cli spawn) crasha em Claude Code session aninhada. Workaround: OpenRouter API key OR manual Opus synth (validado DR1).
- ✅ `tech-research` — methodology pure-markdown (SKILL.md + references/ + assets/). Sem dependencies. Funciona out-of-box.

## Squad conclaves rodados

| # | Squad | Especialistas | Output |
|---|---|---|---|
| 1 | **Strategy** | april-dunford + alex-hormozi + matt-dixon | Big Fish Small Pond + Grand Slam + Dor→Teach→Reveal |
| 2 | **Quality** | brad-frost + addy-osmani + kat-holmes | 8 gates novos com thresholds numéricos |
| 3 | **Process** | eliyahu-goldratt + eric-ries + cassie-kozyrkov | DON'T CODE skills + 3-prospect manual pilot + pre-registered criteria |
| 4 | **Pricing & LTV** | patrick-campbell + lincoln-murphy + rob-walling | Architecture B (R$3.497 + R$247) + non-cash garantia + LTV stress test |
| 5 | **Legal/CDC** | patricia-peck (consultation) | ✅ DELIVERED — [ADR-0002](../99-decisions/0002-cdc-garantia-patricia-peck.md) com 3 show-stoppers + 20 cláusulas contrato + kit jurídico LGPD |

Outputs completos arquivados via thread context (resumos em [0001-pipeline-architecture.md](../99-decisions/0001-pipeline-architecture.md) e [0002-cdc-garantia-patricia-peck.md](../99-decisions/0002-cdc-garantia-patricia-peck.md)).

---

## Glossário

- **Tier S**: small local biz, ticket R$ 3.497 + R$ 247/mo
- **Prospect**: empresa identificada na Fase 1, ainda não abordada
- **Meeting**: prospect aceitou conversa presencial/call
- **Lead**: prospect que sinalizou interesse em receber proposta
- **Stage 1 paid**: prospect pagou ≥R$ 1.500 (1ª parcela 6× ou à vista parcial)
- **Stage 2 shipped**: site live + production-gate PASS + cliente entregue
- **Brief executável**: output da Fase 5 (tokens + sitemap + copy + constraints)
- **Production Gate**: brutal QA não-negociável (8 sub-gates do Quality squad)
- **Dossiê de Dor**: output Fase 2, vira Rational Drowning na Fase 8 outreach
- **Success Vector Report**: relatório dia 30/60/90 com 4 métricas (GMB clicks, ligações, WhatsApp orders, direções) — retenção tool
- **Atribuição objetiva**: WhatsApp button clicks tracked + GBP call clicks tracked, definidos pré-venda
- **Anchor customer**: prospect #1 do piloto, paga R$ 0-1k em troca de testimonial vídeo + indicação 5 padeiros

---

## Piloto ativo

**`blumenau-padaria-artesanal`** (iniciado 2026-05-12)

- Sample: **3 prospects** (4 semanas até 2026-06-09)
- Cadência: **1 site/semana max** (Goldratt drum)
- Two-stage: Stage 1 (offer pack + verbal price) → Stage 2 (build SE pagou ≥R$1.5k)
- Skills codadas durante piloto: **ZERO**
- Default action signed: ver [00-pre-registered-criteria.md](../02-pilots/blumenau-padaria-artesanal/00-pre-registered-criteria.md)

---

## Pendências críticas (bloqueiam Stage 1 paid / Stage 2 do prospect #1)

> **NÃO bloqueiam:** prospect search, outreach informal "warmer", dossiê de dor entregue impresso, conversa exploratória presencial.
> **BLOQUEIAM:** assinatura de contrato, recebimento de pagamento, início de build.

1. 🔴 **Contrato v1.0 redigido por advogado(a) OAB-SC ativa** — usa 20 cláusulas + linguagem da garantia de ADR-0002. Custo estimado R$ 2.500-5.000. **OBRIGATÓRIO antes Stage 1 paid.**
2. 🔴 **Kit jurídico digital LGPD** (DPA + Política Privacidade template + Termos Uso + Política Cookies + banner Consent Mode v2 + ROPA + canal `privacidade@`). Ver checklist completo [ADR-0002 §6](../99-decisions/0002-cdc-garantia-patricia-peck.md).
3. 🔴 **AIOS contribution measurement protocol** implementado (time tracker + planilha) — critério SUCCESS unfalsifiable sem isso. Protocolo definido em [00-pre-registered-criteria.md §3](../02-pilots/blumenau-padaria-artesanal/00-pre-registered-criteria.md#3-aios-contribution-measurement-protocol).
4. 🔴 **ME (não MEI) ativa** + CNPJ + conta PJ separada (MEI cap R$81k/ano insuficiente para meta 12 clientes/ano).
5. 🟡 **Prospect list 10 padarias artesanais Blumenau** populada — bloqueia outreach (pode rodar em background via @analyst).
6. 🟡 **Pre-mortems 5 histórias** escritas no [06-pilot-log.md](../02-pilots/blumenau-padaria-artesanal/06-pilot-log.md) — Kozyrkov mandatório antes prospect #1.
7. 🟡 **Painel de analytics** com acesso de leitura cliente preparado — bloqueia go-live, não outreach.
8. 🟡 **Registro marca "Site-Prospector" INPI** — R$ 142-355/classe — recomendado antes de outreach mas não bloqueia.

---

## Triggers de session futura

- `audit site-prospector pilot week N` — review week-by-week com pre-registered criteria
- `kill site-prospector` — dispara default action (reabsorve em Tocks/Bretda/Vorza)
- `pivot site-prospector nicho` — se 0/3 fechou, vai pra clínica odonto/ateliê moda antes de gastar sample
- `expansion ladder fire prospect-N` — pós Progress Milestone 1, dispara 1 dos 3 tier-2 offers

---

## Files-of-record

```
docs/projects/site-prospector/
├── 00-context/
│   └── CONTEXT.md                              ← VOCÊ ESTÁ AQUI
├── 99-decisions/
│   ├── 0001-pipeline-architecture.md           ← ADR 4 conclaves consolidado
│   └── 0002-cdc-garantia-patricia-peck.md      ← PENDING (background agent rodando)
└── 02-pilots/blumenau-padaria-artesanal/
    ├── 00-pre-registered-criteria.md
    ├── 01-prospect-list.md
    ├── 02-offer-pack-template.md
    ├── 03-attribution-rules.md
    ├── 04-success-vector-report-template.md
    ├── 05-expansion-ladder.md
    └── 06-pilot-log.md
```
