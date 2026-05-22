# Anipis — Controle de SaaS · Consolidado de Fontes REAIS

**Data:** 20/Mai/2026 (madrugada)
**Metodologia:** Fontes primárias verificáveis — SEM "hydra-style" (agentes genéricos roleplay, rejeitado pelo founder). Combina: feeds HYDRA reais existentes + transcrições YouTube (yt-dlp) + conteúdo X (Simon Willison) + fresh hydra run.
**Pergunta:** Como controlar/monitorar a aplicação Anipis em produção, garantindo que falhas (especialmente do classificador de crise) não passem despercebidas, sem depender do usuário reportar.

---

## 0. Nota de honestidade sobre as fontes

| Fonte | Status | Valor pra este tema |
|-------|--------|---------------------|
| **HYDRA feed `alison-darcy`** (saúde mental) | ✅ Real, 419 entries / 92 Tier S | 🟢 ALTO — fontes clínicas curadas de detecção de crise |
| **HYDRA feed `charity-majors`** (observability) | ✅ Real, 444K | 🔴 BAIXO — RSS genérico (JS Weekly/React) mal-roteado por keyword |
| **HYDRA feed `chip-huyen`** (ML ops) | ✅ Real, 204K | 🔴 BAIXO — arXiv ML papers genéricos (CT scan, diffusion) |
| **HYDRA fresh run** (`hydra run`) | ⚠️ Não completou em ~20min | Travou no fetch de fontes; run anterior (15/Mai) distribuiu 252 itens → 24 clones |
| **YouTube (yt-dlp)** | ✅ 3 transcrições reais | 🟢 ALTO — HPA, Langfuse, Sentry |
| **X / Simon Willison** (fonte Twitter do HYDRA) | ✅ Real, blog evals | 🟢 ALTO — evals/observability LLM produção |

**Conclusão honesta:** o HYDRA tem ouro pro domínio SAÚDE MENTAL (alison-darcy), mas o domínio INFRA/OBSERVABILITY caiu em feeds genéricos. Pra infra, as fontes boas vieram de YouTube + X direcionados.

---

## 1. FONTES HYDRA REAIS — Detecção de crise (feed alison-darcy)

Fontes clínicas Tier S curadas pelo HYDRA, com URLs verificáveis e anotações Anipis de runs anteriores:

### 1.1 Performance de chatbots MH em detectar ideação suicida
**Nature Scientific Reports 2025** · `nature.com/articles/s41598-025-17242-4`
- Anotação HYDRA: *"Avaliação performance crisis routing"*
- **Aplicação Anipis:** benchmark de como medir performance do crisis routing — exatamente o gap de monitoramento que você quer fechar.

### 1.2 Detecção de ideação suicida — ML Methods Review
**Springer 2024** · `link.springer.com/article/10.1007/s13278-024-01348-0`
- Anotação HYDRA: *"Define stack para classificadores text-only do Anipis"*
- **Aplicação:** arquitetura de classificador de crise text-only.

### 1.3 Survey de detecção de ideação suicida
**arXiv 2201.10515** · `arxiv.org/pdf/2201.10515`
- Base teórica de classificadores.

### 1.4 Eficácia, mecanismos e LIMITAÇÕES de chatbots GenAI MH
**JMIR 2025** · `mental.jmir.org/2025/1/e78340`
- Anotação HYDRA: *"Define explicitamente onde Anipis NÃO deve atuar e como redirecionar"*
- **Aplicação:** scope-protection (o que o classificador deve bloquear).

### 1.5 FDA Digital Health Advisory Committee — GenAI MH Devices
**FDA Nov/2025** · `fda.gov/media/189391`
- Anotação HYDRA: *"Sinal regulatório forte que vai influenciar ANS/ANPD"*
- **Aplicação:** antecipa requisitos regulatórios de monitoramento.

### 1.6 Fontes brasileiras curadas (mesmo feed)
- **CVV** (Centro de Valorização da Vida) — integração obrigatória crisis path
- **Stanley-Brown Safety Planning Intervention** — *"Implementar SPI digital dentro do Anipis"*
- **Effectiveness of Suicide Safety Planning (Systematic Review)** — *"Justifica investimento em SPI digital robusto (não decorativo)"*
- **Lei 14.874/2024** — Sistema Nacional de Ética em Pesquisa (se Anipis fizer pesquisa com as Júlias)
- **CISM/USP IPq, CONEMO, FAPESP** — rede de pesquisa MH brasileira (parcerias futuras)

> **Insight central das fontes clínicas:** detecção de crise é tratada na literatura como **problema de monitoramento de segurança contínuo** (balancear falso-negativo vs falso-positivo), NÃO como acurácia de modelo fixa. Isso valida: o monitoramento do classificador tem que ser CONTÍNUO em produção, não só validado no deploy.

---

## 2. YOUTUBE — Transcrições reais (yt-dlp)

### 2.1 🎬 Kubernetes HPA (o tema do chrisaleiro)
`video-01-k8s-hpa-transcript.txt` · [Iq7LIBwJ9pE](https://www.youtube.com/watch?v=Iq7LIBwJ9pE) · 657 palavras

- "1 linha cria réplicas": `kubectl autoscale deployment X --cpu-percent=50 --min=1 --max=10`
- Control loop checa a cada 15s; escala pela métrica que pedir mais réplicas (CPU ou memória)
- **Veredito Anipis:** conceito certo, mas K8s = overkill pro Beta. Equivalente sem virar SRE: Railway Pro scaling ou `fly autoscale set min=1 max=10`.

### 2.2 🎬 Langfuse Walkthrough (já na sua stack)
`video-02-langfuse-walkthrough-transcript.txt` · [2E8iTvGo9Hs](https://www.youtube.com/watch?v=2E8iTvGo9Hs) · 1314 palavras

- Features que você NÃO usa ainda e resolvem o gap de crise: **Evaluations (LLM-as-judge)** + **Datasets (golden set)** + **Prompt versioning**
- "Datasets pra testar mudanças antes de produção; cria datasets de teste a partir de traces de produção"
- **Aplicação:** golden set noturno validando que o classificador de crise não regrediu — zero ferramenta nova.

### 2.3 🎬 Sentry in Six Minutes (error monitoring)
`video-03-sentry-monitoring-transcript.txt` · [4djseRVSan8](https://www.youtube.com/watch?v=4djseRVSan8) · 1045 palavras

- "Agrupa eventos similares em issues por fingerprinting → reduz ruído, foca nos problemas importantes"
- Filtra por browser/device/**usuários impactados**/erro unhandled
- Alertas configuráveis no setup; processa bilhões de eventos/mês (Disney, Cloudflare, Peloton)
- **Aplicação:** Sentry (já na stack) agrupa erros por `crisis_level` tag → você vê na hora se erros estão concentrados no crisis path. Filtro "impacted users" = saber QUANTAS Júlias afetadas sem elas reportarem.

---

## 3. X / TWITTER — Simon Willison (fonte Twitter do HYDRA)

Conteúdo real de `simonwillison.net/tags/evals/` (Willison = 1 das 4 contas Twitter que o HYDRA monitora):

| Post | Data | Takeaway pra Anipis |
|------|------|---------------------|
| **FAQ About AI Evals** | Jul/2025 | *"60-80% do tempo de dev em error analysis + evaluation"* — orçar tempo pra isso, não é opcional |
| | | *"70% pass rate pode indicar stress-test mais significativo que 100%"* — golden set difícil > golden set fácil |
| **Building a SNAP LLM eval** | Fev/2025 | *"Evals domain-specific exigem exploração manual primeiro; usar o modelo MUITO + notas manuais antes de automatizar"* |
| **Pydantic Evals** | Abr/2025 | Framework com LLM-as-judge — opção pra eval do classificador |
| **vscode-copilot-chat** | Jun/2025 | *"Sistemas de eval em produção usam cache SQLite pra testes determinísticos apesar da não-determinância do LLM"* |
| **Agent design is still hard** | Nov/2025 | *"Testing e evals são o problema mais difícil de AI engineering"* |
| **Agentic Misalignment (Anthropic)** | Jun/2025 | Safety testing em 16 modelos revelou comportamentos maliciosos sob constraint — relevante pro monitoramento de safety do Anipis |

> **Insight Willison aplicado:** comece o golden set de crise com **exploração manual** das conversas reais das 20 Júlias (anonimizadas), tire notas, SÓ DEPOIS automatize. Cache SQLite pra rodar o eval de forma determinística toda noite.

---

## 3.5 HYDRA FRESH RUN — o que fetchou (20/Mai madrugada)

**Resultado honesto:** `hydra run` fetchou **5754 fontes frescas** (incl. X reais: @simonw, @karpathy, @rauchg, @AnthropicAI), mas o **scoring morreu** — `HYDRA_MODEL=claude-sonnet-4-5` e a conta Anthropic está com **$0 de crédito** (1341 erros "credit balance too low"). Só 6 itens processaram; 3 genéricos distribuídos. **Mas as 3209 fontes raw ficaram em `hydra-data/originals/`** — minerei direto, sem o scoring quebrado.

### Achados fresh REAIS minerados do raw (relevantes ao tema):

**1. SREGym — Live Benchmark for AI SRE Agents** · arXiv 2605.07161 (16/Mai)
> "AI agents cada vez mais usados pra diagnosticar e mitigar falhas em produção (agentic SRE)... 90 problemas SRE realistas... **capacidades dos frontier agents variam significativamente** ao lidar com tipos diferentes de falha."
- **Aplicação Anipis:** se você pensar em "AI SRE agent" pra auto-remediar incidentes — ainda NÃO é confiável across failure types. Auto-restart simples (Railway) sim; agente AI decidindo sozinho, não. Mantenha humano no loop pra incidente não-trivial.

**2. Measuring all the noises of LLM Evals** · arXiv 2512.21326
> "3 tipos de ruído: **prediction noise** (respostas diferentes na mesma pergunta), **data noise** (amostragem de perguntas), e **total noise**... método all-pairs paired pra ganhar poder estatístico."
- **Aplicação CRÍTICA:** quando você rodar o golden set de crise toda noite, o recall TEM RUÍDO. Uma queda de 95%→92% pode ser ruído, não drift real. Precisa de (a) golden set grande o suficiente, (b) análise paired entre runs, pra saber se a queda é real. **Isto responde diretamente "como sei se o classificador regrediu de verdade".**

**3. Charting evolution of AI MH chatbots: rule-based to LLMs (160 studies)** · PMC12434366
- Landscape completo rule-based→LLM em saúde mental. Base pra decidir arquitetura do classificador (híbrido rule+LLM vs LLM puro).

**4. Postgres / Database Traffic Control** (PlanetScale/SEDaily, 17/Mai)
- Padrões de connection management/traffic control — relevante quando Supabase connection pool virar gargalo (escala).

**5. PostHog vs LogRocket (in-depth)** (17/Mai)
- Comparação de product analytics + session replay — opção pra observar comportamento da Júlia no PWA (com cuidado LGPD).

### Fix pra destravar o HYDRA scoring
Trocar `HYDRA_MODEL=claude-sonnet-4-5` → modelo OpenAI (`gpt-4o-mini`) no `.env` do HYDRA, já que a Anthropic está $0 (D2 deferida) e você vai depositar $50 na OpenAI. Aí o `hydra run` processa as 5754 fontes de verdade.

---

## 4. SÍNTESE — Como controlar a Anipis (grounded nas fontes acima)

### 4.1 As 3 camadas de controle

```
CAMADA 1 — SAFETY (lives-at-stake) ← a mais crítica
  Fonte: alison-darcy clinical feed + Willison evals
  → Golden set de crise (manual-first, Willison) rodando noturno via Langfuse Datasets
  → Shadow eval contínuo (literatura: monitoramento contínuo, não acurácia fixa)
  → Métrica: recall do classificador, falso-negativo trackeado SEMPRE

CAMADA 2 — APP HEALTH (visível, auto-recupera)
  Fonte: Sentry video + charity-majors (genérico mas conceito válido)
  → Sentry agrupa erros por crisis_level tag
  → Filtro "impacted users" = saber sem usuária reportar
  → Uptime monitor /health (Better Stack free)

CAMADA 3 — INFRA SCALE (adiável)
  Fonte: HPA video
  → Railway/Fly autoscale (NÃO K8s no Beta)
  → "1 linha" real: fly autoscale set min=1 max=10
```

### 4.2 O que responde DIRETAMENTE sua pergunta ("sem depender do usuário reportar")

1. **Sentry** (já tem) — filtro "impacted users" + agrupamento por fingerprint → você vê erro antes da Júlia reportar
2. **Langfuse Datasets + Evaluations** (já tem, não usa) — golden set noturno detecta drift do classificador automaticamente
3. **Better Stack uptime** (free) — `/health` cada 5min, SMS se cair
4. **Crisis-path synthetic heartbeat** — a cada 5min afirma que a resposta contém CVV 188
5. **Shadow LLM-as-judge** — modelo independente revisa 100% das mensagens, discordância → fila clínica

Tudo isso = **monitoramento ativo**. A Júlia nunca precisa te avisar — o sistema avisa você primeiro.

---

## 5. Arquivos desta pesquisa

```
docs/projects/anipis/squad-16mai/16-saas-control-research/
├── CONSOLIDADO-FONTES-REAIS.md         ← este doc (fontes primárias verificáveis)
├── video-01-k8s-hpa-transcript.txt      ← YouTube real
├── video-02-langfuse-walkthrough-transcript.txt  ← YouTube real
├── video-03-sentry-monitoring-transcript.txt     ← YouTube real
└── 00-SYNTHESIS-MASTER.md + agents/*    ← ⚠️ metodologia hydra-style REJEITADA pelo founder
                                            (conteúdo pode ter valor mas método foi rejeitado)
```

Fontes HYDRA reais (não copiadas, referenciadas in-place):
`D:/jarvis/mega brain/knowledge-feed/alison-darcy/2026-05-08-hydra-feed.md` (419 entries)

---

## 6. Próximo passo honesto

A pesquisa de **infra/observability técnica** (o tema do chrisaleiro) é melhor servida por mais YouTube/X direcionado — o HYDRA não cura bem esse domínio. A pesquisa de **crisis monitoring clínico** já tem base sólida no feed alison-darcy + os 5 papers.

Posso:
- **A** — Fetch o conteúdo completo dos 5 papers clínicos (WebFetch nas URLs) pra extrair protocolos concretos de monitoramento de crise
- **B** — Mais YouTube/X sobre infra monitoring específico (status pages, alerting, dead-man switch)
- **C** — Tentar destravar o `hydra run` (investigar onde travou) pra fetchar fresh
- **D** — Implementar direto: ligar Langfuse Datasets + golden set (a ação que fecha o gap)

**Sources verificáveis:**
- [Nature MH chatbots suicidal ideation](https://www.nature.com/articles/s41598-025-17242-4)
- [Springer suicidal ideation ML review](https://link.springer.com/article/10.1007/s13278-024-01348-0)
- [JMIR GenAI MH limitations](https://mental.jmir.org/2025/1/e78340)
- [FDA GenAI MH Devices](https://www.fda.gov/media/189391/download)
- [Simon Willison — AI Evals FAQ](https://simonwillison.net/2025/Jul/3/faq-ai-evals/)
- [YouTube K8s HPA](https://www.youtube.com/watch?v=Iq7LIBwJ9pE)
- [YouTube Langfuse](https://www.youtube.com/watch?v=2E8iTvGo9Hs)
- [YouTube Sentry](https://www.youtube.com/watch?v=4djseRVSan8)
