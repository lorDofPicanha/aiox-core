# Pilot Log — Blumenau Padaria Artesanal

> **Captura week-by-week obrigatória.** Variáveis pré-registradas em [00-pre-registered-criteria.md](./00-pre-registered-criteria.md) §8.
> Sem captura disciplinada = critério SUCCESS/PERSEVERE/KILL unfalsifiable.

**Start date:** 2026-05-12 (segunda)
**Review date:** **2026-06-09 (segunda) — HARD** (Kozyrkov non-negotiable)
**Status:** WEEK 0 (pre-outreach setup)

---

## Pre-mortems escritos ANTES do prospect #1

> Kozyrkov mandatório. Cinco histórias do fracasso. Cada uma 1-2 parágrafos.

### História #1: "Padeiros não pagam R$ 3.497 — preço é o teto"

**O que aconteceu:** Os 3 padeiros visitados acharam R$ 3.497 caro. Cada um tinha uma versão diferente do "caro": #1 disse "olha, meu sobrinho fez o site da pizzaria por R$ 800, então R$ 3.497 é loucura"; #2 disse "tô apertado com a folha, não dá agora"; #3 disse "o vizinho da padaria do Lupinski pagou R$ 1.500 numa agência de Itajaí". Anchor "agência tradicional cobraria mais (SEBRAE)" não compensou porque a referência mental deles é freelancer barato, não agência. Floor R$ 1.500 1ª parcela foi atingido 0 vezes — nenhum pagou nem isso.

**Sinais antecipados (semana 2):** se 2 dos 3 primeiros prospects pedirem desconto >30% no Stage 1, esta história está se materializando. Detecção: registro "pediu desconto Y%" no pilot-log de cada prospect.

**O que isso significaria:** Não é que padaria não pode pagar — é que Tier S local-biz BR ainda tem âncora mental "site = barato". Pivot necessário: ou reposicionar pra Tier M-leve (clínica odonto, escritório advocacia — quem ESPERA pagar mais), ou cortar preço pra R$ 1.997 (Architecture A) e refazer LTV math, ou descontinuar piloto Tier S.

**Hipótese pre-pilot:** padaria Tier S paga R$ 3.497 — confiança inicial 50%. Esta é a hipótese mais frágil do projeto.

---

### História #2: "Pagam mas churnam em 90d — recurring R$ 247 não sustenta"

**O que aconteceu:** Padaria-âncora pagou R$ 3.497 + R$ 247/mês em maio. Site shipped, GBP reconstruído, Insta tunes-ado. Mês 1 (junho): tudo bem, dono empolgado. Mês 2 (julho): primeiro relatório, GBP views +15%, mas nenhum cliente novo perceptível na loja. Dono começa a achar "tô pagando R$ 247 e não vejo a diferença". Mês 3 (agosto): cartão de crédito do dono é negado (typical BR SMB — cartão pessoa física apertado em julho/agosto). Mês 4 (setembro): pede pra "pausar 1 mês". Mês 5: churn. LTV real: R$ 3.497 + (4 × R$ 247) = R$ 4.485, NÃO os R$ 4.475 base case (que assumia 9 meses).

**Sinais antecipados (mês 3):** se Success Vector Report dia 90 mostrar <20% lift em 2+ métricas, plus dono não respondendo follow-up em 7 dias, esta história está se materializando. Murphy: "mês 4 é death valley".

**O que isso significaria:** AVG TENURE é #1 sensitivity do LTV (cada mês -R$ 172). 5-month avg vs 9-month projected = LTV cai 22%. Cenário "pessimista" do Pricing squad sai como média, não cauda. Recurring R$ 247 sem expansion fires = não fecha unit economics. Pivot: ou re-arquitetar recurring pra incluir entrega visível mensal (Murphy "appropriate experience" reforçado: fotos sazonais já no mês 2, post Insta com cara do padeiro), ou aceitar que recurring é frágil e MAXIMIZAR upfront (Architecture A R$ 2.997 sem recurring, modelo agência one-shot).

**Hipótese pre-pilot:** recurring R$ 247 sem churn 90d — confiança inicial 70%. Murphy ajustou pra 5-8 meses BR-realistic, não 12.

---

### História #3: "AIOS contribution real foi 35% — modelo agência autônoma é fantasia"

**O que aconteceu:** Audit AIOS contribution mediu 35% em prospect #1, 42% em #2. Breakdown: design tokens AIOS 90% (extractor funciona), copy AIOS 30% (Breno reescreveu tudo porque LLM PT-BR sai "robôtico" pra padaria), código componente AIOS 70% (mas Breno gastou 6h fixando responsive bugs), pesquisa nicho AIOS 50% (refs sugeridas pelo extractor não fitavam padaria SC — Breno achou manuais em Pinterest). Time-tracking mostrou Breno fazendo 11h de hand-edit por site (não as 2h estimadas). Build TOTAL 22h cada (não 8-12h). Margem efetiva: R$ 3.497 / 22h = R$ 159/h efetivo após MDR — bom pra freelancer, longe de "agência autônoma".

**Sinais antecipados (build prospect #1):** se primeiro build estourar 14h e Breno reportar "tive que reescrever quase tudo da copy/imagens", esta história está se materializando. Detecção: AIOS contribution mensurada em cada output category.

**O que isso significaria:** A tese "AIOS faz 80%" é fantasia. Realidade: AIOS faz 40-50%, humano faz 50-60%. Modelo é "freelancer com IA acelerando", NÃO "agência autônoma". Pivot: ou aceitar isso e reprice pra Tier M (R$ 6-8k, margens fazem sentido em 22h × R$ 60/h fully-loaded), ou desinvestir nos 3 skills planejados (não vão automatizar 35% → 80% só por terem código), ou estreitar escopo MUITO (só GBP + Insta, sem site Next.js complexo) pra ficar dentro de 6h reais.

**Hipótese pre-pilot:** AIOS 80% — não fiquei confiante nessa hipótese desde o início. Confiança 40%. O modelo de medição em si pode estar capturando mal — preciso ver os números reais antes de pivot.

---

### História #4: "Build estourou 20h+ por site — unit economics colapsa mesmo com close rate alto"

**O que aconteceu:** Prospect #1 anchor fechou. Build começou Mon, deveria terminar Fri (12h target). Realidade: Mon-Fri Breno trabalhou 4h/dia em build = 20h só na semana 1. Bloqueador #1: fotos presenciais demoraram 4h (não 2 — luz ruim, dono indeciso entre produtos pra fotografar). Bloqueador #2: brief executável teve gaps (copy seed faltou "história da padaria" que dono quis). Bloqueador #3: GBP API pra fotos teve rate limit, gastou 3h debugando. Bloqueador #4: Production Gate falhou primeira vez (Lighthouse mobile 78, não 90 — image optim deu trabalho). Total: 24h + 5h horas presenciais = 29h. Margem real: R$ 3.497 / 29h = R$ 121/h efetivo. Walling RF: "stop-the-line em >18h" — não foi acionado porque Breno (= prospector + builder + judge) racionalizou "mas é o primeiro, vai melhorar".

**Sinais antecipados (semana 2):** se prospect #1 build acumular >14h sem chegar a Production Gate, esta história está se materializando. Stop-the-line já deveria disparar em 18h.

**O que isso significaria:** Build budget de 6-12h foi planning fallacy. Realidade BR-Tier-S: 18-28h primeiro site, talvez 12-16h após 5 sites com bibliotec acumulada. Pivot: ou Tier M reprice (R$ 6-8k pra fazer sentido), ou cortar dramaticamente escopo (template fixo com 3 customizações máx, sem session presencial de fotos — usa Insta do cliente), ou aceita que primeiro batch é "investimento" (R$ 0 efetivo de margem) pra construir bibliotecа e re-medir após 5.

**Hipótese pre-pilot:** build ≤16h — confiança inicial 60%. Esta hipótese tem mais variáveis fora do controle (cliente indeciso, fotos demoradas) do que percebi.

---

### História #5: "1 padeiro disputou garantia em PROCON, virou processo, queimou 1 ano e R$ 5k advogados"

**O que aconteceu:** Prospect #2 fechou em maio. Site no ar em junho. Em 60 dias (agosto): painel registrou 8 cliques WhatsApp + 4 calls GBP = 12 eventos atribuídos. Garantia NÃO disparou (≥1 evento). Mas o padeiro, em setembro, reclamou: "Os 'clientes' que clicaram eram só curiosos, não comprou ninguém. Vocês prometeram 'cliente novo', não 'click'". Mesmo com Documento de Transparência Atribuição assinado pré-venda (3-page-rules), o padeiro foi pro PROCON Blumenau. PROCON acatou queixa por "publicidade enganosa" baseado no PRIMEIRO disclaimer do offer pack (que ainda dizia "site que vende às 22h"). Mesmo após reescrita Patricia Peck, a versão impressa entregue ao padeiro era VERSÃO OLD. Conciliação PROCON: Breno devolveu R$ 3.497 + R$ 988 de recurring acumulado + R$ 1.500 honorários advogado próprio. Total custo R$ 5.985. Pior: avaliação 1 estrela pública no Google + relato em grupo Facebook "Comércio Blumenau" = 6 prospects futuros recusaram meeting.

**Sinais antecipados (semana 4-8):** se qualquer prospect mencionar "vocês prometeram clientes" e Breno descobrir que versão old do offer pack circulou, esta história está se materializando. Detecção: audit periódico de quais versões de docs foram entregues a quem.

**O que isso significaria:** Reputational risk em mercado físico denso (Blumenau, 370k habitantes) é altíssimo. Um único PROCON viral mata pilot inteiro. Pivot: rigor extremo em versionamento de documentos entregues (assinatura digital com versão lockada), revisão presencial dia 60 com expectativa REalinhada ANTES do dia 60 ("cliques são clicks, não vendas — você sabia, certo?"), e seguro RC profissional comprado JÁ no prospect #1 (não no #3 como Patricia sugeriu — antecipa R$ 1.500-4.000/ano).

**Hipótese pre-pilot:** zero litígio em 4 semanas — confiança inicial 90%. Mas a janela do litígio é 60-90d pós-launch, então só vamos saber em julho-setembro, não no dia 09/Jun review.

---

### Unknown unknowns (Kozyrkov)

O que pode dar errado que ainda não consideramos:

- **Sazonalidade reverso**: maio é mês morno pra padaria (pré-Páscoa já passou em março, pré-Natal ainda longe). Outreach em maio pode ter close rate falso-negativo simplesmente porque padeiros não estão na mentalidade de investir agora.
- **Pesquisa concorrente fictícia**: Breno apresenta "sua concorrente @xpto posta 3x/semana" no Rational Drowning, mas @xpto pode ser dona da agência rival local, ou parente do padeiro, ou tá tudo armado entre eles. Diagnose superficial não detecta dinâmicas sociais locais.
- **Whatsapp Business API mudou no meio do piloto**: Meta mudou regras de tracking de cliques wa.me em algum update silent, e o painel para de contar. Garantia infla artificialmente "0 eventos" → falsamente dispara em todos os 3 prospects. Custo R$ 4.623 absorvido sem motivo técnico real.
- **AIOS-generated copy passa em todos os gates Quality mas soa "estranho" pra padeiro local**: 6th-grade PT-BR não é mesmo que "fala como padeiro de Blumenau" — pode soar formal/de fora. Cliente pede regravação manual, Breno absorve 5h extras invisíveis no time-tracker (porque "é só copy").
- **Concorrência local copia oferta em 30d**: agência pequena de Blumenau vê o offer pack viral em grupo de comerciantes, copia, oferece R$ 1.997 com mesmo stack. Diferencial AIOS é invisível pro padeiro. Breno fica preso em race-to-the-bottom sem moat tech defensível ainda.
- **Google Business Profile rejeita re-verification do dono**: GBP exige re-verification quando muda categoria/endereço/telefone (Breno vai mexer em tudo). Cliente pode esperar 2-6 semanas pra GBP voltar live. Janela 60 dias garantia conta a partir do GO-LIVE — se GBP só vai live no dia 30, garantia tem só 30 dias úteis de mensuração → infla risco trigger.

> **Revisitar na semana 4 review:** check cada unknown unknown — aconteceu? Se sim, registre como "história #6+" para próximos pilots.

---

## Week 0 — Setup (2026-05-12 → 2026-05-18)

**Objetivo:** kit jurídico + research prospect + pre-mortems escritos.

### Checklist semana 0 (bloqueia outreach prospect #1)

**Jurídico (ADR-0002):**
- [ ] Contrato v1.0 redigido por advogado(a) OAB-SC ativa
- [ ] DPA template anexo
- [ ] Política Privacidade template (cliente)
- [ ] Termos Uso template
- [ ] Política Cookies + banner consentimento granular (Google Consent Mode v2)
- [ ] Política Privacidade Site-Prospector site institucional
- [ ] Aviso Privacidade Outreach + LIA arquivado
- [ ] ROPA inicial
- [ ] DPAs Vercel + Google + Meta aceitos + arquivados
- [ ] Canal privacidade@{dominio} ativo
- [ ] Documento Transparência Atribuição (versão simplificada [03-attribution-rules.md](./03-attribution-rules.md) §8)
- [ ] ME aberta com CNPJ ativo + conta PJ
- [ ] Disclaimers revisados em proposta e landing

**Operacional:**
- [ ] Prospect list 10 padarias artesanais Blumenau populada ([01-prospect-list.md](./01-prospect-list.md))
- [ ] Top 3 selecionados pra piloto + 1 anchor
- [ ] AIOS contribution measurement protocol implementado (time tracker + planilha)
- [ ] Painel de analytics com acesso de leitura cliente preparado
- [ ] Success Vector Report template visual finalizado ([04-success-vector-report-template.md](./04-success-vector-report-template.md))
- [ ] Pre-mortems 5 histórias escritas acima

**Capture:**
- Data início setup: 2026-05-12
- Horas dedicadas setup (target ≤20h): {a preencher}
- Custo advogado (target R$ 2.500-5.000): {a preencher}

---

## Week 1 — Prospect #1 outreach (2026-05-19 → 2026-05-25)

**Objetivo:** Stage 1 com anchor customer.

### Prospect #1 (anchor — R$ 0 ou R$ 1k em troca de testimonial + 5 referências)

| Campo | Valor |
|---|---|
| Nome | {a preencher} |
| Bairro | {a preencher} |
| Data 1º contato | |
| Hora 1º contato | |
| Channel 1º contato (presencial/Insta DM/WhatsApp) | |
| Aceitou meeting? | SIM / NÃO / "depois" |
| Data meeting Stage 1 | |
| Horas Breno outreach (acumulado) | |
| Resposta Stage 1 | SIM / NÃO / "manda proposta" / "deixa eu pensar" |
| Pediu desconto? Quanto? | |
| Objeção principal (taxonomia) | preço/tempo/desconfiança/já tem/não preciso/preciso pensar |
| Próxima ação combinada | |
| Stage 1 → Stage 2 paid? | SIM (R$ X)/ NÃO / waiting |
| **Data Stage 1 paid** | |
| **R$ pago Stage 1** | |

### Hours log Week 1

| Atividade | Horas | AIOS-assisted? |
|---|---|---|
| Outreach presencial | | NÃO (sempre humano) |
| Follow-up WhatsApp/email | | parcial (templates AIOS-generated, dispatch humano) |
| Diagnose / dossiê de dor manual | | parcial |
| Build prep (se Stage 2 ativou) | | N/A week 1 esperado |

### Notas semanais

[Free-form observations — emergent learnings, surprises, blockers]

---

## Week 2 — Stage 2 prospect #1 + outreach prospect #2 (2026-05-26 → 2026-06-01)

### Prospect #1 — Stage 2 (build, se aplicável)

| Campo | Valor |
|---|---|
| Data Stage 2 start | |
| Refs identificadas (3 globais + 2 locais) | |
| design-md extractor runs (3 globais) | |
| Multi-ref synthesis (manual nessa versão) horas | |
| Brief executável criado em | |
| Build start | |
| Build end | |
| **Build hours TOTAL** | (target ≤16h) |
| AIOS contribution % (per measurement protocol) | (target ≥60%) |
| Production Gate result | PASS / FAIL |
| Site shipped data | |
| Lighthouse mobile final | (target ≥90) |
| Gates Quality squad PASSED? | (lista por gate) |

### Prospect #2 (preço normal R$ 3.497)

[Mesma estrutura prospect #1]

### Hours log Week 2

| Atividade | Horas | AIOS-assisted? |
|---|---|---|
| Outreach P#2 | | |
| Build P#1 — design synthesis | | parcial |
| Build P#1 — code (Next.js scaffolding) | | substancial AIOS |
| Build P#1 — copy | | substancial AIOS |
| Build P#1 — fotos | | NÃO (presencial) |
| QA manual / Production Gate | | parcial AIOS (Lighthouse rodando manual) |

---

## Week 3 — Stage 2 prospect #2 + outreach prospect #3 (2026-06-02 → 2026-06-08)

[Mesma estrutura week 2]

---

## Week 4 — Stage 2 prospect #3 + Review prep (2026-06-09 review date)

### Cumulative metrics dashboard

| Métrica | Target SUCCESS | Atual | Status |
|---|---|---|---|
| Prospects abordados | 3 | | |
| Meetings agendados | ≥2 de 3 (60%) | | |
| Stage 1 paid (≥R$ 1.500) | ≥1 | | |
| Stage 2 shipped Lighthouse ≥90 | ≥1 | | |
| Build hours per shipped site | ≤16h | | |
| AIOS contribution % | ≥60% | | |
| Recurring aceito ≥R$ 149/mo | ≥1 | | |
| Garantia disparada | 0 OR R$ 591 cost absorvido | | |
| Defeitos 0-14d pós-launch | <3 por site shipped | | |

### Hipótese desfecho

| Hipótese pre-pilot | Confiança inicial | Status final | Confiança final | Evidência |
|---|---|---|---|---|
| Padaria Tier S BR paga R$ 3.497 | 50% | | | |
| Outreach presencial converte ≥20% | 40% | | | |
| Build cabe ≤16h c/ AIOS 60% | 60% | | | |
| Recurring R$ 247 sem churn 90d | 70% | | | |

> Se 100% das hipóteses confirmadas → suspeitar de confirmation bias. Procurar contra-evidência.

### Pre-mortems revisitadas

| História # | Aconteceu? | Variante diferente que aconteceu? | Lessons |
|---|---|---|---|
| 1 (preço é teto) | | | |
| 2 (churn rápido) | | | |
| 3 (AIOS < 60%) | | | |
| 4 (build estouro) | | | |
| 5 (PROCON litígio) | | | |
| Unknown unknowns emergidas | (lista) | | |

### Verdict (escrito pelo "judge" no dia 2026-06-09)

[Leitura dos pre-registered criteria + match com dados acima. Verdict puramente baseado em thresholds. Sem feel-good narrative.]

**Result:** SUCCESS / PERSEVERE WITH PIVOT / KILL

**Próxima ação:**
- Se SUCCESS: dispara ADR-0004 (qual skill codar primeiro baseado em constraint observado)
- Se PERSEVERE: documenta pivot type + roda piloto rodada 2 (próximas 4 semanas)
- Se KILL: post-mortem 5-whys obrigatório + reabsorção tempo Tocks/Bretda/Vorza

### Notas review

[Insights para futuras iterações]

---

## AIOS Contribution Audit (per prospect shipped)

> Protocolo definido em [00-pre-registered-criteria.md §3](./00-pre-registered-criteria.md#3-aios-contribution-measurement-protocol).

### Prospect #1 audit

| Output category | AIOS lines | Total lines | AIOS % |
|---|---|---|---|
| Design tokens | | | |
| Copy do site | (words count) | | |
| Código componente (TSX/CSS) | | | |
| Imagens | (per asset) | | |
| Pesquisa nicho refs | (per source) | | |

| Time category | Breno hours | Notes |
|---|---|---|
| Outreach total | | always 100% human |
| Build supervision (revisar AIOS output) | | |
| Hand-edit (escrever do zero) | | |
| Cliente comms | | always 100% human |

**Calculated AIOS contribution %:** {fórmula §3 PRC}

### Prospect #2 audit
[mesma estrutura]

### Prospect #3 audit
[mesma estrutura]

---

## Garantia ledger (durante piloto)

| Prospect | Go-live data | Eventos atribuídos (Tipo A + B) | Status dia 30 | Status dia 60 | Garantia disparada? |
|---|---|---|---|---|---|
| P-001 | | | | | |
| P-002 | | | | | |
| P-003 | | | | | |

---

## Cash flow tracking (piloto)

| Source | Mês 1 | Mês 2 | Mês 3 | Cumulative |
|---|---|---|---|---|
| Stage 1 paid (1ª parcela 6×) | | | | |
| Recurring contracted | | | | |
| Custo Vercel (real) | | | | |
| Custo soft (Breno hours × R$ 60) | | | | |
| Custo legal (advogado uma vez) | | | | |
| Garantia disparada (R$ 591) | | | | |
| **Net** | | | | |

---

## Decisões em aberto registradas

[Decisões que emergem durante o piloto que NÃO alteram critérios mas precisam ser endereçadas pós-review]

- [ ] {data}: {decisão}
- [ ] ...

---

## Triggers session futura

- `audit site-prospector pilot week N` — review da semana
- `verdict site-prospector` — disparar judge no dia 2026-06-09
- `kill site-prospector` — default action se KILL
- `pivot site-prospector {nicho/geo/oferta}` — se PERSEVERE
