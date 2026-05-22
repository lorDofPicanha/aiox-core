# 01 — Analyst Deliverable: Anipis (Saúde Mental Digital BR)

**Projeto:** Anipis — companion clínico-AI brasileiro, adjunto (não substituto) de psicólogo/psiquiatra
**Etimologia:** *anima* (alma) + *elpis* (esperança)
**Data:** 2026-05-16
**Autor:** Atlas (@analyst)
**Re-geração:** o deliverable original de 08/Mai sumiu; este recompõe e atualiza com 38 dias de evolução regulatória (CFM 2.454/2026 publicada 27/Fev, vigência **ago/2026**)
**Fontes:** 1007 itens HYDRA distribuídos 08/Mai (feeds halle-tecco 912 itens + dena-bravata 401 itens + eric-ries 1043 + demis-hassabis 466), dossiê fonte (`squad-08mai/00-source/`), market-intelligence-anipis.md existente, WebSearch CFM 2.454 confirmatório

---

## 1. Executive Summary

O mercado brasileiro de saúde mental digital atravessa três janelas simultâneas: (a) **demanda explosiva** — 472 mil afastamentos por saúde mental em 2024, +134% vs 2022 (ONU Brasil); 26,8% da população adulta com ansiedade diagnosticada (Covitel 2023); 9 milhões de universitários em crise documentada; (b) **infraestrutura regulatória se fechando** — CFM 2.454/2026 vigora **agosto de 2026** classificando IA em medicina por risco (baixo/médio/alto/inaceitável), CFP Res. 09/2024 já operando, ANS RN 627/2024 ampliou rol de saúde mental, ANPD intensificando fiscalização LGPD em dados sensíveis; (c) **consolidação competitiva** — Zenklub adquiriu Psicologia Viva e fechou acordo Omint+Vivest (300k clientes potenciais) via R$30 mi em saúde suplementar, Woebot encerrou B2C em jun/2025 validando que B2C clínico puro não escala, Headspace lançou Ebb com voice mode e stratified care model (blueprint para B2B2C).

A oportunidade real do Anipis não é "outro app de wellness" — é o **único companion clínico-AI nativo PT-BR posicionado para compliance CFM/CFP antes da janela fechar**. O risco não é mercado nem competição: é **execução em 12 semanas** (deadline ago/2026) + **retenção D30** (mercado MH digital perde 97% em 30d).

**Verdict:** GO **condicional** com cunha B2C jovens 18-29 ("Júlia") como entry, B2B2C corporativo NR-1 como caminho de escala 6-12m, B2B2C operadora ANS como liquidity event 12-24m. Recomendação 1 linha: **proteger a janela CFM (ship adjunto-compliant antes de ago/2026) e gastar tudo em retenção D30 — não em CAC.**

---

## 2. Market Sizing BR (TAM / SAM / SOM)

### 2.1 Fundamentação demográfica (atualizado 2026)

| Métrica | Valor | Fonte |
|---------|-------|-------|
| População BR | ~215M | IBGE 2024 |
| Adultos 18+ | ~160M | IBGE |
| Smartphones ativos | ~155M | Anatel/FGV |
| Ansiedade diagnosticada (adulto) | 26,8% / ~57M | Covitel 2023 |
| Depressão (prevalência) | 5,8% / ~12,4M | OMS |
| Jovens 18-24 com ansiedade | 31,6% (maior faixa) | Covitel 2023 |
| Afastamentos por SM 2024 | 472 mil (+134% vs 2022) | ONU Brasil |
| Estresse autorreportado | 42% (Brasil 4º país mais estressado) | Ipsos 2024 |
| 1B globais com transtornos mentais (referência macro) | ~1 bilhão | OMS/Agência Brasil 2025 |

### 2.2 TAM / SAM / SOM

```
TAM (Saúde Digital BR, healthtech ampla):
  USD 12,4B (2025) → USD 44,6B (2034), CAGR 15,30%
  Fonte: IMARC Group

TAM Brasil saúde mental digital (recorte):
  ~USD 390M (2026), ~5% do global de mental health apps (Mordor)

SAM (BR adultos com smartphone + SM diagnosticada + willingness to pay):
  ~35M indivíduos únicos (ansiedade + depressão deduplicados)
  × 15% dispostos a pagar (benchmark global apps MH)
  = ~5,25M usuários potenciais
  × R$29,90/mês × 12 = R$1,88B/ano potencial teórico

SOM Ano 1 (Anipis, penetração realista 0,02% SAM):
  ~1.050 assinantes pagos / R$376k ano
  Premissa: lançamento Q3 2026 pós-compliance CFM

SOM Ano 3 (penetração 0,2%):
  ~10.500 assinantes / R$3,77M ano
  Caminho B2B2C abre ceiling: 1 operadora ANS = +50-300k vidas
```

### 2.3 CAGR e dinâmica de mercado

- Apps MH globais: USD 7,09B (2024) → USD 15,42B (2029), **CAGR 16,82%** (Mordor)
- BR teleconsulta + SM: +35% últimos 12m (Abstartups)
- 150 novos CAPS aprovados no PAC — sinal de prioridade governamental
- 546 mil afastamentos por SM em 2025 (+15,6% vs 2024)

### 2.4 Cunha Anipis no mercado

Anipis **não compete com Zenklub/Vittude no preço de sessão** — opera no **vazio entre Replika genérico (sem PT-BR clínico, sem compliance) e telepsicologia paga (R$120-300/sessão, fila)**. ARPU alvo R$29,90/mês é 10x menor que telepsicologia, posicionado abaixo do limiar psicológico R$30 (Netflix-grade impulse buy). Margem bruta estimada 96% (LLM gpt-4o-mini ~R$0,45-0,90/usuário/mês contra R$29 receita).

**So what:** mercado existe e cresce. A pergunta no Ano 1 não é "tem espaço?" — é **"conseguimos reter?"** Sem D30 ≥ 15% (5x mercado), nenhum CAC fecha conta.

---

## 3. Competitive Landscape

### 3.1 Tier 1 — Companion AI direto (concorrentes diretos por intenção)

| | **Anipis** | Cíngulo (BR) | Wysa (Global) | Woebot | Replika | Pi.ai | Headspace Ebb |
|--|------------|--------------|---------------|--------|---------|-------|---------------|
| Modelo | B2C → B2B2C | Freemium / R$29,99 | Free + B2B + B2C | Encerrou B2C jun/2025 | Free + $19.99 Pro | Free (acquired Inflection→Microsoft) | B2B (corp) |
| Idioma PT-BR nativo | **Sim (único)** | Sim | Não | Não | Tradução automática | Inglês primário | Não |
| Abordagem clínica | CBT/DBT/ACT + safety BR | CBT modular guiado | CBT + screening | CBT estruturado | Companhia social | Companion geral | Empathic companion |
| Compliance CFM/CFP | **Em construção (alvo)** | Wellness | N/A | FDA pathway | Nenhum | Nenhum | N/A BR |
| Crisis routing | Alvo CVV 188 nativo | Limitado | Sim (US) | Sim | Falha (vide arXiv 2603.06960) | Falha | Limitado |
| Evidência publicada | RCT planejado (parceria CISM) | Limitada | Página agregadora de RCTs | Múltiplos RCTs | Zero clinical | Zero clinical | Limitada |
| Pricing | R$29,90/mês | R$29,99/mês | Free / $9,99 | N/A | $19,99 USD | Free | Embutido corp |
| Posicionamento | Adjunto clínico-AI BR | Wellness/autoatendimento | Wellness/clinical hybrid | Era clinical (morto) | Companion social | Conversational AI | Stratified care AI |
| Vulnerabilidade-chave | Janela CFM ago/26 | Falta diferencial AI conversacional | Sem PT-BR | Já morreu B2C | Identity discontinuity (HBS WP 25-018) | Não regula clinical | Sem entrada BR direta |

### 3.2 Tier 2 — Telepsicologia BR (concorrentes indiretos)

| | Zenklub | Vittude | Telavita | Psicologia Viva (adquirida por Zenklub) | Conexa Saúde |
|--|---------|---------|----------|--------------------------------------|--------------|
| Modelo | B2B+B2C, agora supplementar | B2B+B2C | Online psicologia | Adquirido por Zenklub 2025 | B2B forte (telemed) |
| Preço sessão | R$60-200 | R$80-200 | R$80-200 | R$60-150 | Variável |
| Funding | R$30M saúde suplementar (Startups 2025) + acordo Omint/Vivest +300k clientes (NeoFeed) | Privado | Privado | Consolidação | Forte B2B |
| Psicólogos | 500+ | N/A | N/A | 1.700+ | Múltiplos |
| Diferencial Anipis | Anipis NÃO é sessão — é entre-sessão 24/7 a 1/10 do preço | Mesmo | Mesmo | Mesmo | Mesmo |

### 3.3 Global benchmark — Therabot (Dartmouth NEJM AI 2025)

**Marco regulatório-científico:** Heinz et al. publicaram em NEJM AI (`ai.nejm.org/doi/abs/10.1056/AIoa2400802`) o primeiro RCT formal de chatbot GenAI mostrando aliança terapêutica forte e redução de sintomas — **valida tese central do Anipis com publicação Tier-S**. É o benchmark que Anipis precisa replicar em RWE BR.

### 3.4 Matriz síntese (posicionamento × pricing × stack × compliance × evidência)

| Player | Posicionamento | Preço (R$/mo) | Stack AI | CFM/CFP | Evidência publicada |
|--------|----------------|---------------|----------|---------|---------------------|
| **Anipis** | Companion clínico-AI BR adjunto | 29,90 | LLM + safety layer + CBT/DBT/ACT modules | Em construção (alvo ago/26) | RCT planejado parceria CISM/USP |
| Cíngulo | Wellness autoatendimento | 29,99 | Modular guiado (não conversacional puro) | Wellness (RDC 657 classe I) | Limitada |
| Wysa | Clinical wellness | gratuito/var | CBT chatbot + screening | FDA breakthrough pathway | Página agregadora robusta |
| Replika | Companion social | ~95 (USD 19.99) | LLM proprietário | Nenhum | Zero clinical |
| Therabot (DTU) | Pesquisa clínica | N/A (não comercial) | LLM fine-tuned | N/A | NEJM AI RCT publicado |
| Zenklub | Telepsicologia + supl | 290+/sessão | Não-AI core | Médico-regulado | N/A para AI |

**Espaço vazio S+:** AI conversacional + PT-BR nativo + compliance CFM/CFP + evidência publicada parceria acadêmica BR + crisis routing CVV nativo. **Zero players atendem os 5 simultaneamente hoje.**

---

## 4. Evidence Base (citações Tier S de 1007 fontes HYDRA)

### 4.1 Estudos fundacionais (8 cherry-picked Tier S)

1. **Heinz et al. (NEJM AI 2025), Therabot RCT** — `ai.nejm.org/doi/abs/10.1056/AIoa2400802` — primeiro RCT GenAI MH com aliança terapêutica significativa. Benchmark obrigatório Anipis (`hydra-989f369608fe8391`).

2. **PMC 12360667 — Ability of AI Therapy Bots to Set Limits With Distressed Adolescents** — `pmc.ncbi.nlm.nih.gov/articles/PMC12360667/` — companion-class models acertam crisis routing em ~22% dos casos vs general-purpose models em ~83%. Anipis precisa fechar essa lacuna: **barra mínima >90% em simulação** (`hydra-63863d8d09cb9049`).

3. **NPJ Digital Medicine 2026 — Sys Review + Meta de Chatbots em Dep/Ansiedade** — `nature.com/articles/s41746-026-02566-w` — effect size honesto a comunicar (sem over-promise) (`hydra-f55a1eaa167a1caf`).

4. **JMIR 2025 — Generative AI MH Chatbots as Therapeutic Tools, SR+Meta** — `jmir.org/2025/1/e78238` — evidência existe mas ainda em base; argumento para RCTs internos Anipis (`hydra-3e842ec69804ef60`).

5. **JMIR Mental Health 2025 — Clinical Efficacy, Mechanisms, Limitations of GenAI MH Chatbots** — `mental.jmir.org/2025/1/e78340/PDF` — define onde Anipis NÃO deve atuar (diagnóstico, prescrição) e como redirecionar (`hydra-276afbe46a85bc94`).

6. **JMIR 2025 — DMHI para Social Anxiety em adolescentes/jovens adultos, meta** — `jmir.org/2025/1/e67067` — 21 RCTs, N=4.196: CBT + condição-específica + human-guided ganham (`hydra-d82c0788568fb90b`).

7. **JMIR 2025 — Limbic Care RWE em group therapy** — `jmir.org/2025/1/e60435` — 3x engagement vs PDF, 2,4x frequência, 3,8x duração. Modelo de tração para parcerias B2B (`hydra-4bdf1b4540c06eb7`).

8. **Brown University 2025 — AI chatbots systematically violate MH ethics standards** — `brown.edu/news/2025-10-21/ai-mental-health-ethics` — 15 categorias de risco que Anipis precisa documentar contra-medidas (`hydra-06229b7538ac39fd`).

### 4.2 Sinais regulatórios e de safety (4 críticos)

- **GPT-5 mental health updates (Axios set/2025)** — `axios.com/2025/09/02/chatgpt-openai-mental-health-teens` — 91% self-harm compliance, 97% emotional reliance. Define a **nova barra de safety** que Anipis precisa publicar metricamente (`hydra-cb3ec297a93b92dd`).

- **APA advisory Nov/2025** — `apa.org/news/press/releases/2025/11/ai-wellness-apps-mental-health` — "AI/wellness apps cannot solve MH crisis". Anipis tem que se posicionar publicamente como **adjunto** (`hydra-a25f80df02f85430`).

- **FDA Digital Health Advisory Committee Nov 6, 2025 — GenAI MH Devices** — `fda.gov/media/189391/download` — sinal regulatório forte que vai influenciar ANS/ANPD/CFM no BR (`hydra-41a72cdd00b519c1`).

- **CFP Res. 09/2024 + Cartilhas IA (dez/2025)** — `site.cfp.org.br/wp-content/uploads/2025/12/Cartilha_IA_A5-1.pdf` — padrão operacional BR já vigente. Anipis tem que documentar onde human-in-loop começa (`hydra-9173d17f9f32b91a`, `hydra-3777d272b8661ae2`).

### 4.3 Trust deficit e contraposição honesta

- **HBS WP 25-018 / arXiv 2412.14190 — Identity Discontinuity Replika app update** — usuários reportaram luto/trauma após mudança de personalidade do bot. Lição: **memória persistente + atualizações de modelo precisam UX explícita** (`hydra-bed5c516, hydra-2412.14190`).
- **AI-Induced Psychosis (Psychiatric News 2025)** — `psychiatryonline.org/doi/10.1176/appi.pn.2025.10.10.5` — memória persistente é arma de dois gumes. Anipis precisa detecção de delírio + interrupção (`hydra-63330f97796bcade`).
- **JAMA Network Open 2025 — Adolescent Vulnerability to Consumer Chatbots** — `jamanetwork.com/journals/jamanetworkopen/fullarticle/2840497` — justifica age-gate forte (`hydra-aaef114147c72bc2`).

**So what:** evidência existe mas é base — sustenta tese mas não substitui RWE BR. **Parceria CISM/USP (R$40M FAPESP+BIB, 27 UBS) é o caminho mais curto para publicação Tier-S BR**.

---

## 5. Cunha de Entrada (ICP Triagem Ranqueada)

### 5.1 Ranking (recomendação final)

| Rank | ICP | Por quê primeiro | Por quê não primeiro | Sinal de prontidão |
|------|-----|------------------|----------------------|---------------------|
| **#1** | **B2C jovens 18-29 ("Júlia")** | Prevalência 31,6% (Covitel), mobile-first, dispostos a R$29,90 (sub-Netflix), TikTok/Instagram orgânico viraliza saúde mental, ciclo de feedback rápido (D7-D30), zero negociação enterprise | Churn alto sem retenção D30 ≥ 15%; canais pagos (Meta) com CFP fricção crescente sobre claims clínicos | Já está acontecendo: NPR mostra jovens substituindo terapia por ChatGPT (`hydra-c6757cf503910b40`) |
| #2 | B2B2C corporativo (NR-1 saúde mental) | NR-1 obriga empresas a mapear riscos psicossociais; Wellhub 2024 highlights mostra adesão massiva (`hydra-3f8ef1333885dc2b`); ticket médio R$15-30/colaborador/mês × 100-500 funcionários = R$50-150k MRR contrato | Sales cycle 90-180 dias; precisa case BR; precisa procurement, segurança da info, DPA enterprise | Manual GRO da NR-1 (MTE) já publicado (`hydra-5f9c3a7f0317d575`) |
| #3 | B2B2C operadora ANS (RN-627) | RN 627/2024 expandiu rol de saúde mental coberto; Zenklub provou ARM via R$30M+Omint/Vivest 300k vidas; ticket inicial pode chegar R$2-8/vida-coberta/mês × 50k = R$100-400k MRR; barreira regulatória vira foso | Sales cycle 12-24 meses; precisa registro ANVISA SaMD (RDC 657, Classe II provavelmente); precisa evidência publicada; CFM 2.454 hard-gate ago/26 | Acordo Zenklub-Omint vira "you can do this" prova pra liderança Anipis (`hydra-09184f4c94302261, hydra-e9e9d8d2a2fb8207`) |

### 5.2 Razão da ordem (lógica explícita)

**B2C primeiro pelo tempo-de-feedback, não pela LTV.** Júlia gera 50-200 conversas/dia que viram dados de safety/aliança terapêutica nos primeiros 90 dias. Sem esses dados, **não há case para vender enterprise** (B2B2C) nem registro ANVISA. Sequência é dependente, não paralela.

**B2B2C NR-1 segundo, não ANS.** NR-1 é "compre porque a lei me obriga a cuidar"; ANS é "pague porque o rol agora cobre". A primeira tem urgência mandatória (auditoria do trabalho), a segunda tem custo-de-decisão maior (atuarial). Sequência respeita complexidade de venda.

**ANS por último, mas alvo final.** É o liquidity event (acquisição por Zenklub, Conexa, ou operadora direta), pois faz Anipis virar adjuvante coberto. Sem ele, Anipis fica em B2C eternamente competindo com Cíngulo no mesmo preço.

---

## 6. Janela Regulatória CFM 2.454/2026

### 6.1 O que muda em agosto de 2026

**Resolução CFM 2.454/2026** (publicada 27/Fev/2026, vigência ago/2026) — `sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2026/2454_2026.pdf` — normatiza uso de IA na medicina em todo território nacional:

| Provisão | Impacto Anipis |
|----------|----------------|
| IA apenas como ferramenta de **suporte**; médico responsável final por decisões clínicas/diagnóstico/terapêuticas/prognóstico | Anipis NÃO pode "diagnosticar" nem "comunicar prognóstico" — adjunto puro, com handoff humano explícito |
| Proibição de **delegar à IA** a comunicação de diagnósticos, prognósticos ou decisões terapêuticas | UX precisa distinguir "informação geral" de "avaliação clínica" e nunca emitir laudo |
| Direitos do paciente: informação clara, segunda opinião, proteção de dados, não submissão a intervenção experimental sem consentimento específico | Onboarding precisa consent flow robusto + opt-in granular para qualquer "experimento" (variant testing) |
| Classificação de risco IA: baixo/médio/alto/inaceitável | Anipis com crisis routing + uso clínico = provável **alto risco** → exige documentação, auditoria, supervisão médica documentada |

### 6.2 Sinergia com CFP Resolução 09/2024

CFP já regulamenta IA na prática psicológica (publicado 12/2025 + cartilhas) — `psinotaai.com/resolucao-cfp-09-2024`. Anipis tem que:
- Documentar onde human-in-loop começa (psicólogo supervisor + protocolo escalada)
- Citar literalmente cartilhas CFP em compliance docs e marketing
- Posicionar como **companheiro adjunto**, NUNCA "terapeuta IA"

### 6.3 Gaps Anipis hoje (estimativa baseada em market-intel existente + reviews internas)

| Gap | Status atual (estimado) | SLA para compliance ago/26 |
|-----|------------------------|----------------------------|
| Classificação de risco documentada (CFM tier alto/médio) | Não documentado | 4 semanas — produzir Risk Classification Memo + Termo de Compromisso Médico-Responsável |
| Médico-responsável técnico nomeado e atuante | Não nomeado | 6 semanas — contratar psiquiatra colaborador (CRM ativo) com escopo formal |
| Psicólogo-responsável técnico (CRP) — alinhar com CFP Res 09/2024 | Provavelmente não nomeado | 6 semanas — contratar CRP supervisor com escopo formal |
| Notificação ANVISA RDC 657/2022 (SaMD provável Classe II) | Não submetido | 8-10 semanas — depende de classificação (wellness vs clinical) |
| DPO nomeado (LGPD dados sensíveis Art. 11 I) | Auditoria HYDRA já 5 anos implementada (forte ponto) — DPO formal a confirmar | 2-3 semanas — nomear via política interna |
| Crisis routing CVV 188 nativo + protocolo human-handoff documentado | Em construção | 4 semanas — implementar + testar simulação 90%+ (barra PMC 12360667) |
| Consent flow LGPD + opt-in granular variant testing | Parcial | 3-4 semanas |
| Termo de Uso + Política de Privacidade revistos por advogado especialista LGPD-saúde | A confirmar | 4-6 semanas |
| Evidence/Clinical Evidence page público (como Wysa `wysa.com/clinical-evidence`) | Inexistente | 6-8 semanas — agregar literatura + protocolo Anipis |
| Métricas de safety publicadas (vs GPT-5 91% bar Axios) | Inexistente | 8-10 semanas (depende de dados RWE) |

### 6.4 Runway compliance (~12 semanas até ago/26)

- **Semanas 1-2:** Risk Classification Memo CFM (alto/médio) + nomeação DPO + DPIA dados sensíveis
- **Semanas 3-4:** Crisis routing CVV + simulação safety + nomeações CRM + CRP
- **Semanas 5-6:** Notificação ANVISA RDC 657 (Classe II provável)
- **Semanas 7-8:** Termo de Uso/Privacidade legais + consent flow + Clinical Evidence page
- **Semanas 9-12:** Audit interno + parceria CISM/USP (carta de intenção) + safety metrics publication + soft launch B2C controlado

**Risco:** se compliance escorrega para set/26+, Anipis lança em regime de não-conformidade, com exposição a notificação CFM via Conselho Regional. Mitigação: **freezing de features novas pós-semana 8** e foco exclusivo em compliance + estabilidade.

---

## 7. Três Cenários de Mercado (12m + 24m)

### 7.1 Premissas comuns

- ARPU B2C: R$29,90/mês, COGS variável R$1,20/mês (margem 96%)
- CAC blended: R$45-80 (Pedro Sobral/Molly Pittman benchmark BR)
- Churn M1: 35% (realista, vs 50% padrão mercado MH)
- Custos fixos: R$5-10k/mês ano 1 (founder + infra + ads mínimo) escala para R$30-60k/mês ano 2 com staff (psiquiatra colaborador + CRP supervisor + 1 dev)

### 7.2 Cenários

| Cenário | Premissa-chave | 12m revenue | 24m revenue | Sinal precoce de fit |
|---------|----------------|-------------|-------------|----------------------|
| **Bear** | CFM atrasa Anipis 60d, retenção D30 ≤ 8%, sem B2B2C | 200-400 assinantes / R$70-145k ARR | 600-1k assinantes / R$215-360k ARR | DAU/MAU <15%; churn M1 >50%; sem case enterprise |
| **Base** | Compliance ago/26 OK, D30 = 12-18%, 1 piloto NR-1 corporativo Q4/26 | 1.000-1.500 assinantes B2C + 1 contrato corp R$10-30k MRR / R$650k-1,1M ARR | 5-8k B2C + 3-5 contratos corp / R$2,5-4,5M ARR | DAU/MAU 15-25%; 1ª publicação científica (CISM) submetida |
| **Bull** | Compliance ago/26 + D30 = 20%+ (top-quartile) + 1 operadora ANS piloto + 1 round seed R$3-8M Q2/27 | 2.500-4.000 B2C + 3-5 corp / R$1,5-2,5M ARR | 15-30k B2C + 10-15 corp + 1 operadora piloto 30k vidas / R$8-15M ARR | NPS >50; LTV:CAC >4:1; menção em CB Insights ou Rock Health |

**So what:** Bull e Base divergem fundamentalmente na **retenção D30** e **parceria acadêmica** — não no funding nem no produto. As duas alavancas controláveis pelo time hoje.

---

## 8. Top 5 Risks (likelihood × impact)

| # | Risco | Likelihood | Impact | Vetor | Mitigação |
|---|-------|------------|--------|-------|-----------|
| R1 | **Janela CFM ago/26 perdida** (compliance escorrega) | Médio (40%) | Crítico (kill) | Falta de psiquiatra responsável + classificação de risco não documentada + ANVISA atrasada | Hire psiquiatra colaborador semana 1; lock features semana 8; mock audit semana 10 |
| R2 | **Retenção D30 fica abaixo de 12%** (padrão mercado MH digital) | Alta (60%) | Crítico (unit econ quebra) | Onboarding não entrega valor em 60s; sem streaks; sem check-in inteligente | Primeira sessão garantida com handoff CBT estruturado; notificação 20h gentil; streak gamificado; check-in semanal de humor |
| R3 | **Incidente de safety publicado** (crise não rotada, ideação suicida não detectada, AI-induced psicose) | Médio-Baixo (15-25%) | Crítico (reputational + regulatorio) | Crisis routing imaturo; ausência de detecção de delírio (Psychiatric News 2025) | SPI Stanley-Brown digital integrado; CVV 188 nativo; teste simulação ≥90% (barra PMC 12360667); kill switch + escalada humana 24/7 piloto |
| R4 | **Zenklub/Conexa lança "Anipis clone" B2C-AI** (ou compra Cíngulo) | Médio (30-40%) | Alto | Têm capital (Zenklub R$30M), distribuição (Omint+Vivest 300k), e brand | First-mover compliance CFM + parceria acadêmica defensiva (CISM/USP) + dados proprietários de aliança terapêutica BR; pricing 10x abaixo da telepsicologia (R$29,90 vs R$120+) |
| R5 | **CFP/CFM se opõe publicamente ao Anipis** (advisory contra "terapeuta IA") | Baixo-Médio (20%) | Alto | Marketing exagera; UX confunde com terapia; ausência de disclaimers | Posicionamento "companheiro adjunto" em todo touchpoint; cartilhas CFP citadas literalmente; carta aberta de princípios contra 15 riscos Brown 2025; relacionamento ativo com CRP regional |

---

## 9. Top 5 Opportunities

| # | Oportunidade | Janela | Tese | Como capturar |
|---|--------------|--------|------|----------------|
| O1 | **Espaço vazio S+ — único compliance-first AI companion PT-BR** | 6-12 meses (até concorrentes se moverem) | Cíngulo é guiado-modular não conversacional; Wysa não tem PT-BR clínico; Replika não tem compliance; Zenklub não é AI | Ship compliance ago/26 + Clinical Evidence page público + lock dominance terminologia "companheiro clínico-AI brasileiro" |
| O2 | **Parceria CISM/USP** (R$40M FAPESP+BIB, 27 UBS, parceria Harvard+Yale) | 12-24 meses (windows acadêmicas) | CISM precisa de pilotos digitais para validar modelo. Anipis tem tecnologia pronta. Win-win: USP publica, Anipis ganha credibilidade Tier S BR | Carta de intenção até semana 8; proposta de pilot RCT em 1 UBS Indaiatuba (modelo CONEMO `hydra-51761c2297e74de5`); CEP via INAEP (Lei 14.874/2024) `hydra-e835ba32d80588ac` |
| O3 | **NR-1 saúde mental compliance corporativo** | 12-18 meses (NR-1 já vigente) | Empresas obrigadas a mapear riscos psicossociais. Anipis vira "compliance kit" white-label com dashboard agregado anonimizado | Vender via consultoria de RH/SST (BSI, ProtetorBR); MRP per-seat R$8-15/colab/mês; reusa B2C tech 90% |
| O4 | **Integração WhatsApp Business API** (99% penetração BR) | 6-12 meses | WhatsApp é o canal de saúde mental do brasileiro (sub-otimal mas real); Anipis pode ser primeiro player clínico-compliant via WA | Piloto check-in diário via WA template message; consent LGPD explícito; reusa mesma engine; ganho de engagement esperado 3-5x (benchmark Limbic Care `hydra-4bdf1b4540c06eb7`) |
| O5 | **Aliança CVV 188** (crisis routing nativo + co-branding) | 3-6 meses | CVV precisa modernizar canais digitais; Anipis precisa SLA crisis routing publicado. Co-branding mutual: "Anipis recomenda CVV em crise; CVV referencia Anipis em pós-crise" | Contato institucional CVV; carta de intenção; integração tecnológica + auditoria pública; PR conjunta como sinal Anti-Replika |

---

## 10. Top 3 Decisões Pendentes do User (P0)

### D1 — Posicionamento regulatório: SaMD Classe II ou Wellness Classe I?

**Contexto:** ANVISA RDC 657/2022 classifica software médico por risco. CFM 2.454/2026 sobrepõe outra camada (baixo/médio/alto/inaceitável). Anipis pode escolher se posicionar como:
- (a) **Wellness puro Classe I** — notificação simples, menos compliance, MAS limita claims, fecha porta ANS, e fica vulnerável a "wellness washing" se UX/marketing escorregar para clinical
- (b) **SaMD Classe II adjuvante clínico** — notificação + auditoria, mais compliance custo upfront (R$50-150k), MAS abre B2B2C ANS e protege contra acusação CFM/CFP

**Recomendação Atlas:** **(b) SaMD Classe II adjuvante** — único caminho que sobrevive a CFM 2.454 e abre liquidity event ANS. Custo upfront é o preço de admissão. Decidir até **semana 2**.

### D2 — Cunha B2C primeiro ou B2B2C NR-1 primeiro?

**Contexto:** Tempo de feedback B2C é semanas; B2B2C é trimestres. MAS B2B2C dá runway financeiro maior por contrato.

**Recomendação Atlas:** **B2C primeiro** (Júlia 18-29, mulheres, classe B-C, geo SP+RJ+BH+CWB+BSB Centro-Oeste/Sul/Sudeste) — sem dados RWE BR, B2B2C é venda especulativa. **Mas iniciar prospecting B2B2C em paralelo semana 6** (1 SDR/founder time-boxed, 5h/sem). Decidir até **semana 1**.

### D3 — Parceria acadêmica CISM/USP é go ou nice-to-have?

**Contexto:** Sem evidência publicada Tier-S BR, Anipis fica em "wellness app" perpetuamente, sem entrar ANS nem conquistar enterprise grande. Com CISM, ganha CB Insights/Rock Health visibilidade + defesa contra Zenklub clone.

**Recomendação Atlas:** **GO** — carta de intenção semana 4, MoU semana 8, piloto RCT em 1 UBS Indaiatuba semana 16 (modelo CONEMO `hydra-51761c2297e74de5`). Custo: 1 founder-trip BSB→SP + R$10-30k contrapartida pesquisa. Não decidir = decidir não, pois janela acadêmica é semestral. Decidir até **semana 3**.

---

## Apêndice — Fontes-âncora citadas (curadoria Tier S do HYDRA)

### Mercado e funding
- Mordor Intelligence Mental Health Apps Market — `mordorintelligence.com/pt/industry-reports/mental-health-apps`
- IMARC Group Brazil Digital Health 2026-2034 — `imarcgroup.com/brazil-digital-health-market`
- CB Insights State of Digital Health 2025 — `cbinsights.com/research/report/digital-health-trends-2025/` (`hydra-7a6bdbb28c07ed63`)
- Rock Health 2025 year-end overview — `rockhealth.com/insights/2025-year-end-digital-health-funding-overview-a-tale-of-two-markets/` (`hydra-8052caa46062f650`)
- New Market Pitch Mental Health Funding 2025-2026 — `newmarketpitch.com/blogs/news/mental-health-funding-analysis` (`hydra-cb6231156d2cb9bf`)

### Brasil — demografia e SM
- Covitel 2023 — `biblioteca.observatoriosaudepublica.com.br/blog/setembro-amarelo-evolucao-ansiedade-brasil/`
- ONU Brasil afastamentos +134% — `brasil.un.org/pt-br/292926-brasil-afastamentos-por-problemas-de-saúde-mental-aumentam-134`
- Ipsos Brasil 4º mais estressado — `ipsos.com/pt-br/world-mental-health-day-2024`

### Concorrentes BR
- Zenklub R$30M saúde suplementar — `startups.com.br/negocios/healthtechs/zenklub-investe-r-30-mi-para-entrar-no-mercado-de-saude-suplementar/` (`hydra-e9e9d8d2a2fb8207`)
- Zenklub Omint+Vivest 300k clientes — `neofeed.com.br/startups/zenklub-firma-acordo-com-omint-e-vivest-e-ganha-300-mil-potenciais-clientes/`
- Cíngulo Play Store — `play.google.com/store/apps/details?id=com.cingulo.app` (`hydra-ea4e1471a25cd1e2`)
- Vittude — `vittude.com` / Telavita — `telavita.com.br` / Conexa Saúde — `conexasaude.com.br`
- Woebot encerra B2C — `medium.com/ai-in-mental-health/r-i-p-woebot-e0702487`
- Replika HBS WP 25-018 — `hbs.edu/ris/Publication%20Files/25-018_bed5c516-fa31-4216-b53d-50fedda064b1.pdf` (`hydra-bed5c516`)

### Evidência clínica
- Therabot NEJM AI — `ai.nejm.org/doi/abs/10.1056/AIoa2400802` (`hydra-989f369608fe8391`)
- PMC 12360667 crisis routing 22% vs 83% — `pmc.ncbi.nlm.nih.gov/articles/PMC12360667/` (`hydra-63863d8d09cb9049`)
- npj Digital Medicine 2026 SR+Meta — `nature.com/articles/s41746-026-02566-w` (`hydra-f55a1eaa167a1caf`)
- JMIR 2025 GenAI MH SR+Meta — `jmir.org/2025/1/e78238` (`hydra-3e842ec69804ef60`)
- Limbic Care RWE 3x engagement — `jmir.org/2025/1/e60435` (`hydra-4bdf1b4540c06eb7`)
- Brown University AI MH ethics 15 risks — `brown.edu/news/2025-10-21/ai-mental-health-ethics` (`hydra-06229b7538ac39fd`)

### Regulatório
- **CFM Res. 2.454/2026** — `sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2026/2454_2026.pdf` (WebSearch confirmado 16/Mai/2026)
- CFP Res. 09/2024 — `psinotaai.com/resolucao-cfp-09-2024` (`hydra-9173d17f9f32b91a`)
- CFP Cartilhas IA — `site.cfp.org.br/wp-content/uploads/2025/12/` (`hydra-3777d272b8661ae2`, `hydra-8293d2542ebba75f`)
- ANS RN 627/2024 — `ans.gov.br/participacao-da-sociedade/atualizacao-do-rol-de-procedimentos` (`hydra-09184f4c94302261`)
- FDA Digital Health Advisory Committee GenAI MH 6/Nov/2025 — `fda.gov/media/189391/download` (`hydra-41a72cdd00b519c1`)
- APA advisory Nov 2025 — `apa.org/news/press/releases/2025/11/ai-wellness-apps-mental-health` (`hydra-a25f80df02f85430`)
- Lei 14.874/2024 + INAEP — `gov.br/conselho-nacional-de-saude/pt-br/camaras-tecnicas-e-comissoes/conep` (`hydra-e835ba32d80588ac`)
- Manual GRO NR-1 MTE — `gov.br/trabalho-e-emprego/pt-br/.../manual_gro_pgr_da_nr_1.pdf` (`hydra-5f9c3a7f0317d575`)
- Mozilla Privacy Not Included MH Apps — `mozillafoundation.org/en/privacynotincluded/categories/mental-health-apps/` (`hydra-c18bda20d1e959fa`)

### Parceria acadêmica
- CISM (INPD/USP) — `inpd.org.br/en/cism/` (`hydra-cb573bd78af0f97e`)
- FAPESP CISM auxílio 111260 — `bv.fapesp.br/pt/auxilios/111260/` (`hydra-21f68be8b9339c2f`)
- HCFMUSP lança CISM — `hc.fm.usp.br/hc/noticias/hcfmusp-lanca-centro-nacional-de-pesquisa-e-inovacao-em-saude-mental` (`hydra-b8995ddc53ec8ab3`)
- CONEMO Indaiatuba (modelo replicável) — `inpd.org.br/aplicativo-de-controle-emocional-por-terapia-nao-guiada-sera-implementado-em-duas-ubss-de-indaiatuba/` (`hydra-51761c2297e74de5`)
- CVV — `cvv.org.br/` (`hydra-d944f20ca7c7268b`)

### Safety, GPT-5, comparáveis recentes
- GPT-5 91% self-harm + 97% emotional reliance (Axios) — `axios.com/2025/09/02/chatgpt-openai-mental-health-teens` (`hydra-cb3ec297a93b92dd`)
- AI-Induced Psychosis (Psychiatric News 2025) — `psychiatryonline.org/doi/10.1176/appi.pn.2025.10.10.5` (`hydra-63330f97796bcade`)
- JAMA Network Open — Adolescent Vulnerability Chatbots — `jamanetwork.com/journals/jamanetworkopen/fullarticle/2840497` (`hydra-aaef114147c72bc2`)
- Wysa Clinical Evidence (benchmark agregador) — `wysa.com/clinical-evidence` (`hydra-7bdf601be649693b`)

---

## Disclaimers (Tetlock honesty)

- **Confiança qualitativa:** Mercado/competitive 85% (dados públicos triangulados); Regulatório 90% (CFM 2.454 confirmada via WebSearch + texto oficial); Evidência clínica 85% (Tier S citado por DOI/URL); Cenários financeiros 50-60% (modelados com premissas explícitas, sensíveis a churn).
- **Não verificado neste deliverable:** dossiê fonte `.docx` (Mercado/Clínico/Tech) e planilha S1 Base (.xlsx 1007 rows) — leitura binária bloqueada por sandbox neste run. Recomendação: validar se sínteses dos .docx contradizem algum claim aqui; se sim, ajustar.
- **Não consultado:** mind clones via brain-bridge MCP (Halle Tecco, Dena Bravata, Eric Ries, Demis Hassabis) — feeds HYDRA pré-distribuídos serviram como proxy. Para decisões D1-D3, recomendar consulta direta via `aios-brain-bridge` antes da execução.
- **Não substituível:** este deliverable não substitui parecer de advogado especialista em saúde digital + LGPD, nem consultoria com CFM/CFP/ANVISA. Trata-se de market intelligence + recomendação estratégica, não opinião legal.

---

*Atlas, investigando a verdade — Re-geração analyst Anipis 2026-05-16*
