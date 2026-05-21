---
name: session-site-prospector-12mai
description: "Site-Prospector v1 project launched 12/Mai. Agência autônoma assistida Tier S R$3.497+R$247/mo padaria artesanal Blumenau. 4 squad conclaves + Patricia Peck CDC consultation rodados. 10 artefatos criados. Pilot pre-registered 3 prospects 4 semanas até 09/Jun. DON'T CODE skills até pilot SUCCESS."
metadata: 
  node_type: memory
  type: project
  originSessionId: c5a6ca3b-b7dc-40ff-b655-214cb6ec0943
---

# Site-Prospector v1 — Launch session 12/Mai

## Status: 🟢 SETUP + DR1 + DR2 + ADR-0003 (Primer YAML architecture) COMPLETOS — Aguarda contrato OAB-SC + ME

## DR1 + DR2 validation summary
- **DR1 padaria Dona Hilda:** Pipeline 8-fases executou end-to-end. HTML POC 26.8KB gerado. Production gate 5/8 PASS. Tokens sintetizados aplicados.
- **DR2 mecânica Itanorte:** 86% delta padaria↔mecânica (60/70). Pipeline IS vertical-agnostic. Customer journey axis (10/10) é load-bearing.
- **4 customer journey patterns identificados:** emotional-aspirational / rational-utility / anxiety-driven / status-driven

## ADR-0003 Per-Vertical Primer YAML — IMPLEMENTED
- `.aios-core/data/site-prospector/primers/` com schema + 2 primers + README + ADR
- Active: padaria-artesanal.yaml + oficina-mecanica.yaml
- Backlog: odonto + moda + estética + marcenaria + advocacia + restaurante + eletricista
- Override hierarchy: prospect → client business → primer → universal defaults

## Skills externas instaladas (`.claude/skills/`, fora do repo Git)
- design-md ✅ (LLM step crasha em Claude Code aninhada — workaround OpenRouter OR manual synth)
- tech-research ✅ (pure-markdown, sem deps)

## Decisão final session 12/Mai
- **Opção B confirmada:** manual synth pelo agente Opus (sem OpenRouter por enquanto). Custa 25min/ref vs 60s LLM. Reavaliar pós pilot SUCCESS.
- **API key Anthropic colada por engano no chat:** instruído user revogar IMEDIATAMENTE em console.anthropic.com/settings/keys e gerar nova.
- Próxima sessão **NÃO bloqueia outreach informal** mas bloqueia Stage 1 paid:
  - 🔴 ME aberta + CNPJ ativo + conta PJ (Breno + contador, 5-15 dias, ~R$ 200-500)
  - 🔴 Contrato OAB-SC v1.0 com 20 cláusulas ADR-0002 (Breno + advogado, 1-2 semanas, R$ 2.5-5k)
  - 🔴 DPAs Vercel/Google/Meta aceitos + arquivados (1h)
  - 🔴 Domínio + privacidade@email (~R$ 40-80/ano)
  - 🔴 5 pre-mortems escritas em pilot-log (1-2h Breno)
  - 🔴 Toggl + audit-data/ + template.xlsx setup (1h)
- **Total bloqueio Stage 1: ~2-3 semanas + R$ 2.700-5.580**
- Session encerrada com **commit local** site-prospector. Push fica pra @devops conforme Constitution Artigo III.
- User indicou foco próximo em revenue-active fires (Bretda Gate D+7 14/Mai aproximando).

## Arquivos commitados nesta sessão
- `docs/projects/site-prospector/**` (22+ arquivos: CONTEXT, 3 ADRs, pilot artefatos, DR1+DR2 outputs)
- `.aios-core/data/site-prospector/primers/**` (_schema + padaria + mecânica + README)
- NÃO commitado: `.claude/skills/design-md/`, `.claude/skills/tech-research/` (skills locais, fora do repo)

## Prospects (Fase 1 — POPULATED 12/Mai via @analyst background)

**Top 3 ranked:**
1. 🥇 **P-006 Dona Hilda Confeitaria** (score 9.0) — ANCHOR candidate. Itoupava Seca, LTDA 1990 (36 anos), 13k Insta, site `donahilda.com.br` HTML 2008-era + HTTP não HTTPS = paradigma gap óbvio
2. 🥈 P-003 Maria Mole Doces (score 8.0) — Velha, LTDA 2020, 26k Insta, 4.9★ 1441 reviews, sem site institucional (só cardápio online)
3. 🥉 P-010 Vanessa Hayashi Doceria (score 8.0) — Jardim Blumenau, 19k Insta, 905 posts (5 anos), morango do amor viral jul/2025, zero site

**Demais qualificados:** P-001 Pão e Ponto (8.5, 2 unidades), P-002 Lola Maria (7.5, 18k Insta), P-004 Della Nonna (7.5), P-005 Hess (6.0 partial), P-007 Dora Marie (7.0 francesa), P-008 Imperial (7.5), P-009 Bolico (6.5 partial)

**Pattern insight cross-prospect:** 4/10 com "Big Insta (15-26k), No Site" — **VALIDA tese "Presença Local Premium ≠ site"** ANTES de outreach.

**Market size validation:** ~25-30 candidatos brutos → 10 qualificados (33% conv) → 7-10 fallback restantes. Consistente com expectativa RF9 (20-50 total Blumenau). Pivot nicho previsto mês 4-6.

**Exclusões aplicadas corretamente:** Portus (4 unidades, scale), Cafehaus (icônica 45 anos), GoDisco (franquia), Blumenau Torten Haus (São José/SC fora geo), Pão de Mel (Gaspar fora geo), 4 estabelecimentos Itoupava Central (3G dead-zone Quality squad flag).

**Limitações Fase 1 v1:** WebFetch denegado → Lighthouse audits manuais Breno (7 sites confirmados); CNPJ porte 4/10 validado (6/10 precisam Receita Federal lookup — MEI = exclusion auto); Insta metadata ±10% (Apify resolveria $0.01 total).

**Files:** `docs/projects/site-prospector/02-pilots/blumenau-padaria-artesanal/01-prospect-list.md` (POPULATED) + `01a-prospect-research-notes.md` (metodologia + recomendações outreach sequence).

## Artefatos criados (12 total)

```
docs/projects/site-prospector/
├── 00-context/CONTEXT.md
├── 99-decisions/0001-pipeline-architecture.md
├── 99-decisions/0002-cdc-garantia-patricia-peck.md
└── 02-pilots/blumenau-padaria-artesanal/
    ├── 00-pre-registered-criteria.md
    ├── 01-prospect-list.md                    [POPULATED]
    ├── 01a-prospect-research-notes.md          [NEW from @analyst]
    ├── 02-offer-pack-template.md
    ├── 03-attribution-rules.md
    ├── 04-success-vector-report-template.md
    ├── 05-expansion-ladder.md
    ├── 06-pilot-log.md                         [+5 pre-mortems + 6 unknowns]
    ├── 07-aios-contribution-protocol.md        [NEW]
    └── 08-legal-templates-draft.md             [NEW 7 templates]
```

## Tese
Agência autônoma assistida que vende "Presença Local Premium" (NÃO "site") a pequenos negócios Tier S em Vale do Itajaí → Florianópolis. Founder solo Breno baseado em Blumenau (presencial possível). Diferencial: pipeline extrai design.md de refs globais + brutal QA gate. Outreach disparado por humano.

## Decisões críticas (4 conclaves rodados — 12 mind clones)

**Squad #1 Strategy** (april-dunford + alex-hormozi + matt-dixon):
- Big Fish Small Pond: "Presença Local Premium pra Padaria Artesanal Vale Itajaí"
- Concorrente real = status quo + sobrinho R$800 (NÃO agência R$10k+)
- Sales sequence: **Dor → Teach → Reveal** (35-45% win vs 18% Reveal-first)

**Squad #2 Quality** (brad-frost + addy-osmani + kat-holmes):
- Anti-clone POR CATEGORIA (color ≤85%, type ≤75%, layout ≤60%)
- +2 refs LOCAIS obrigatórias além das 3 globais
- Body ≥18px, contrast ≥7:1 (AAA), touch ≥48px
- Field-perf BR (WPT gru1 + Moto G + Slow 4G), não só Lighthouse
- 3G dead-zones Itoupava/Garcia/Velha

**Squad #3 Process** (goldratt + eric-ries + kozyrkov) — **INVERSÃO CRÍTICA**:
- **DON'T CODE 3 skills** (audit-site, multi-ref-extract, production-gate) antes pilot
- Constraint é CLOSE RATE + outreach-physical-ceiling, NÃO build
- 3-prospect manual pilot 4 semanas (até **2026-06-09**)
- Two-stage: Stage 1 offer pack zero-build → Stage 2 build SE pago ≥R$1.5k
- Pre-registered criteria assinados ANTES

**Squad #4 Pricing & LTV** (patrick-campbell + lincoln-murphy + rob-walling):
- **Architecture B locked:** R$ 3.497 (parcela 6× R$ 583) + R$ 247/mo Growth tier (tiered Essential R$149 / Growth R$247 / Scale R$397)
- Garantia non-cash: 3mo recurring grátis + 1 sessão fotos sazonais = R$ 1.541 valor / R$ 591 custo real (vs R$ 3.497 lethal refund)
- Stack 9 → 5 itens outcome-labeled
- Drop Insta tune-up baseline (toxic operacional) + drop treinamento GBP
- LTV base R$ 4.475 / CAC R$ 1.200 = 3.7×. Ceiling Blumenau ~R$ 12-16k MRR (4 deals/mês max)

**Squad #5 Legal/CDC** (patricia-peck consultation):
- 3 SHOW-STOPPERS: "site que vende" → "recebe pedidos"; "0 cliente novo" → "0 eventos atribuídos"; contrato+DPA+LGPD obrigatórios pré-prospect #1
- 20 cláusulas contrato definidas (precisa advogado(a) OAB-SC redigir, ~R$ 2.500-5.000)
- LGPD: Breno = OPERADOR (não controlador) para tracking padaria; NÃO consolidar dados entre padarias (economiza 80% complexidade)

## Arquivos criados (10 total)

```
docs/projects/site-prospector/
├── 00-context/CONTEXT.md                                  ← canon (read first)
├── 99-decisions/
│   ├── 0001-pipeline-architecture.md                      ← ADR 4 conclaves
│   └── 0002-cdc-garantia-patricia-peck.md                 ← ADR CDC/LGPD
└── 02-pilots/blumenau-padaria-artesanal/
    ├── 00-pre-registered-criteria.md                      ← SUCCESS/PERSEVERE/KILL
    ├── 01-prospect-list.md                                ← template (10 prospects a popular)
    ├── 02-offer-pack-template.md                          ← 5-slide + dossiê + proposta
    ├── 03-attribution-rules.md                            ← CDC-compliant tracking spec
    ├── 04-success-vector-report-template.md               ← retention tool dia 30/60/90
    ├── 05-expansion-ladder.md                             ← T2-A/B/C ofertas prontas
    └── 06-pilot-log.md                                    ← week-by-week tracking
```

## Pendências críticas bloqueando Stage 1 PAID (não bloqueia outreach informal)

1. 🔴 **Contrato v1.0 advogado(a) OAB-SC** — R$ 2.500-5.000, 20 cláusulas
2. 🔴 **Kit jurídico LGPD digital** — DPA + PoP + ToU + Cookies + ROPA + privacidade@
3. 🔴 **AIOS contribution measurement protocol** implementado (critério SUCCESS unfalsifiable sem)
4. 🔴 **ME ativa** (NÃO MEI — R$81k/ano insuficiente)
5. 🟡 Prospect list 10 padarias populada
6. 🟡 Pre-mortems 5 histórias escritas (Kozyrkov mandatório)

## Pre-registered criteria

**SUCCESS:** ≥1 pagou R$1.5k 1ª parcela + ≥1 Lighthouse ≥90 + build ≤16h + AIOS ≥60% + recurring ≥R$149/mo aceito + meeting rate ≥60% + 0 garantia disparada OR R$591 absorvido

**KILL (default action = reabsorve tempo em Tocks/Bretda/Vorza):** 0/3 pagaram E 0/3 "manda proposta" OR build >25h E defeitos >3/14d OR 3/3 negociaram <R$1.5k OR <2 prospects em Stage 2 em 4 semanas

**Review date HARD: 2026-06-09 (segunda)**

## Tools provisioned pelo user

- `C:\Users\kingp\Downloads\design-md.zip` — Alan Nicolas extractor (URL → DESIGN.md + tokens.json + preview.html)
- `C:\Users\kingp\Downloads\tech-research.skill` — 6-fase research method (calibrado Tier S 2h)
- Extraídos em `C:\Users\kingp\Downloads\_extracted\`

## Triggers session futura

- `audit site-prospector pilot week N` — review semanal
- `verdict site-prospector` — dispara judge no dia 2026-06-09
- `kill site-prospector` — default action se KILL
- `pivot site-prospector {nicho/geo/oferta}` — se PERSEVERE
- `expand site-prospector tier T` — só pós pilot SUCCESS

## Risk flags consolidados

🔴 Crítica: refund cascade (mitigado R$591 garantia); AIOS contrib unfalsifiable; CDC liability (ADR-0002 endereçou); cash flow trap parcelamento 6× = R$583/mês líquido NÃO R$3.497 upfront; build estouro 18h prospect #1 = STOP-line

🟡 Operacionais: 3G dead-zones Blumenau; preview leakage (watermark minutos 0-5); founder ceiling 4 deals/mês; padaria-Blumenau exhaustion (20-50 estabelecimentos total); sunk-cost firing (DON'T CODE skills); Insta tune-up recurring toxic (removido); recurring SLA eaten (3+ edits/30d); atribuição argument sem rules pré-venda
