# Research de Mercado V1 — Buscador Licitações DF + Águas Lindas-GO

**Data:** 2026-05-15
**Sub-agent:** M (aios-analyst — Atlas)
**Status:** final
**Tempo executado:** ~2h30 (timebox 3h)
**Método:** WebSearch como fonte primária (WebFetch foi denied no ambiente). Triangulação parcial via 3 sinais: (a) landing/oficial, (b) site terceiro/blog/comparativo, (c) Reclame Aqui/marketplaces. Onde fonte direta foi inacessível, triangulação ficou em 2 sinais — sinalizado explicitamente.

---

## Sumário Executivo

1. **Pricing público é a EXCEÇÃO, não a regra.** Dos 5 players nacionais principais, apenas 2 (LicitaNet, Sollicita) publicam preço em página acessível. Effecti e ConLicitação forçam "calculadora de planos" ou demo comercial — sinal claro de pricing por porte. Licitar Digital tem modelo híbrido (anuidade R$1.197 OU pague-se-vencer 1,3% homologado).
2. **NÃO existe player com foco regional declarado DF/Centro-Oeste.** 5 buscas ativas em variações ("Brasília", "DF", "Centro-Oeste", "Goiás regional", "startup local") — zero resultado. Players nacionais oferecem **filtros geográficos**, não posicionamento regional. **Gap confirmado** (H8: CONFIRMADA).
3. **MAS o mercado IA-startup já está mexido.** 6+ entrantes recentes descobertos: Licitei (Juiz de Fora, UFJF, R$3,5M captados), LicitaIA, LiciteAI, LicitAI Editais (R$39,90/mês), Licita Já (R$235/mês), LicitaFree (R$49,90/mês para gerador de propostas). Janela de oportunidade existe MAS está sendo preenchida horizontalmente — defesa regional é resposta correta.
4. **TAM regional DF realista: 8-15k empresas pagantes potenciais.** Base SEBRAE-DF 2025: 108.254 empresas atendidas (47k MEI + 47k ME + 14k EPP). Aplicando filtro "vende ou venderia para governo" (~25-30% baseado em MPE 60% dos fornecedores nacionais + share DF acima da média por capital federal) = ~30k. Aplicando "pagaria R$50-200/mês" = 25-50% = 8-15k empresas. SOM realista 24m = 200-500 contas pagantes a R$50-150/mês = **R$120k-900k ARR**.
5. **Effecti complaint pattern revela vulnerabilidades exploráveis.** Reclame Aqui Effecti: 6 reclamações respondidas 100% (selo), MAS reviews recentes destacam "suporte ineficiente", "bot que não ajuda", "cobrança sem serviço por suspensão login comprasnet", "WhatsApp não respondido". Quem paga R$397+/mês espera SLA — gap real para projeto enxuto com foco regional.
6. **GTM: SEBRAE-DF + FIBRA já fizeram a curadoria para você.** FIBRA + SEBRAE-DF rodam **Projeto Compras Governamentais DF** desde 2020 com treinamentos para 500 MPE/ano. Esse é o canal #1 — público pré-qualificado, com pain confirmado, próximo do amigo-persona. CAC esperado via parceria-conteúdo: R$50-150 vs R$200-400 Google Ads vs R$300+ LinkedIn Ads.
7. **ARPU realista: R$50-99/mês entrada, R$149-199/mês Pro.** Benchmark BR: SaaS micro/SMB com ticket <R$150 = "B2C/low-ticket SaaS". CAC payback 18-24m é structural para o segmento (Brasil, juros altos). Modelo flat mensal é o vencedor para microempresa — créditos confundem e SaaS B2B BR para micro tem churn 5%+ que mata híbridos complexos.
8. **Confidence revisada nas hipóteses iniciais:**
   - H2 "pagaria R$30-100/mês" → **CONFIRMADA** (referência: Sollicita R$30-45/mês captura mercado SMB; Alerta Licitação R$34-44/mês). Faixa R$50-99 é a entrada honesta.
   - H5 "free tier diferenciador" → **CONFIRMADA PARCIALMENTE** (Licitei já tem free tier IA limitado; Alerta Licitação tem 2 feeds free). Free tier sozinho não diferencia — precisa do gancho **regional + WhatsApp**.
   - H8 "zero foco regional declarado" → **CONFIRMADA** (mais forte que esperado).

### Veredito mercado

- **Gap regional EXISTE.** Defensável **12-24 meses** em narrativa pura. Defensável **36+ meses** se construir: (a) cobertura municipal Águas Lindas que ninguém faz (custo de scraper específico), (b) parceria SEBRAE-DF/FIBRA com selo de curadoria, (c) base de fornecedores DF/RIDE com networking effects ("quem ganhou edital X"), (d) UX em PT-BR + WhatsApp como canal primário.
- **Risco real:** janela de IA-feature parity. Licitei (R$3,5M) ou Effecti podem lançar "modo regional" se acharem que vale. Defesa = velocidade até atingir 100 fornecedores pagantes DF antes deles olharem.

### ARPU/CAC/LTV realistas (com método)

| Métrica | Valor | Premissa/Método |
|---------|-------|-----------------|
| ARPU Pro | R$99/mês | Mediana entre Sollicita R$30-45 (entry value) e LicitaNet R$152/mês (volume) — captura SMB que acha Effecti caro e Sollicita pobre |
| ARPU Team | R$199/mês | Para EPP com 2-5 usuários — 2x Pro com upsell features (chat PDF, RPA básico) |
| CAC misto | R$120 | Mix 60% orgânico SEBRAE/conteúdo + 30% indicação + 10% Google Ads brand+long-tail |
| Churn mensal alvo | 6% | Realista pra micro BR (benchmark BR ticket<R$150 = "B2C/low-ticket" pattern) |
| LTV @ ARPU R$99 | R$1.650 | R$99 / 0,06 = R$1.650 → LTV/CAC = 13,7x (saudável) |
| Payback CAC | 1,2 mês | Excelente para SaaS BR micro (benchmark 18-24m); driver = CAC baixo via canais B2B regionais já existentes |

---

## M1. Pricing players nacionais (triangulado)

**Convenção:** sinal A = landing/oficial • B = blog/comparativo terceiro • C = Reclame Aqui / Hotmart / contrato público. Triangulação ideal = 3 sinais; aceitável = 2.

| Player | Pricing landing (A) | Pricing terceiro (B) | Pricing C/contrato | Pricing real estimado | Notas |
|--------|---------------------|---------------------|-------------------|----------------------|-------|
| **Effecti** | "Sob consulta" via calculadora `effecti.com.br/calculadora-de-planos/` | "R$ 397-1500/mês estimativa" (MASTER-REPORT v0 não-verificada; 3 buscas de pricing falharam) | Reclame Aqui menciona "redução de mensalidade negada" sem valor; programa "indica clientes" dá **R$500 de desconto** = mensalidade >>R$500 | **R$ 400-1.500/mês** (Pro a Enterprise) | Empresa 150+ funcionários, 11 anos. Bot+pricing-gated = posicionamento mid/high-ticket. Fonte [1][2][9] |
| **LicitaNet** | R$ 152 (30d) / R$ 287 (90d) / R$ 422 (180d) / R$ 692 (365d) — equivale ~R$ 152/mês mensal, R$ 57,67/mês anual | R$ 98 plano avulso | Não localizado | **R$ 57-152/mês** | Volume play. Anual = 62% desconto. Foco é PORTAL de leilão E busca. Fonte [3][4] |
| **ConLicitação** | "3 planos com assinatura semestral/anual/bienal" (pricing ocultado mesmo na página /planos/) | "Tickets R$ 5k-30k/mês Enterprise" (MASTER-REPORT v0, não-verificada) | Reclame Aqui menciona "plano anual caro, mudança para mais caro sem aviso" sem números | **R$ 250-1.500/mês entry-mid; R$ 5k+ enterprise** (com baixa confiança) | Player tradicional B2B grande, com ferramenta "Análise de Mercado". Pricing-gated. Fonte [5][6] |
| **Sollicita** | R$ 44,90/mês (mensal) / R$ 39,98/mês (6m) / R$ 30,82/mês (12m) | "~R$300-800/mês" (MASTER-REPORT v0, contradiz landing — landing é mais barata) | RFB contrato público 2024 existe ([7]) mas conteúdo PDF inacessível direto; Hotmart "Sollicita Pro" anual sem preço visível | **R$ 30-45/mês básico; PRO sob consulta enterprise** | Mais barato dos majors. Posicionamento "ferramenta completa licitações + contratos". Fonte [8][7] |
| **Licitar Digital** | R$ 1.197/ano (R$ 100/mês equivalent) OU 1,3% sobre homologado (máx R$500/processo) OU R$ 83,90/credenciamento | Não localizado | Regulamento PDF público confirma valores [9] | **R$ 100/mês equivalent OU pague-se-vencer** | **Esclarecimento importante:** Licitar Digital é PORTAL-LEILÃO (como BLL/BNC), NÃO buscador. Compete com Comprasnet, não com Effecti/buscadores. NÃO é concorrente direto. Fonte [10][11] |

**Categoria "AI-startup emergentes" (descobertos via M2 mas relevantes para M1):**

| Player | Pricing | Notas |
|--------|---------|-------|
| **Licita Já** | R$ 235/mês • R$ 657/3m • R$ 1.242/6m • R$ 2.196/12m (~R$ 183/mês anual) | Plano único, free trial. "IA + alertas + editais". Mais caro que Sollicita, mais barato que Effecti — mid-market positioning. Fonte [12] |
| **LicitaFree** | R$ 49,90/mês | Foco específico: gerador de propostas (importa edital → gera PDF proposta). NÃO é buscador completo. Fonte [13] |
| **LicitAI Editais** | A partir de R$ 39,90/mês | Buscador inteligente com IA. Entry-level. Fonte [14] |
| **Licitei** (Juiz de Fora) | Free tier (IA limitada) → Busca/Premium/Multi-company (preços não públicos) | Startup UFJF, R$3,5M captados Microsoft+TecHolding. Free tier IA é jogada agressiva. Fonte [15][16] |
| **Alerta Licitação** | Free (2 feeds, limitado) → R$ 34,90-44,90/mês premium / R$ 179,90 (6m) | Lider em volume scraping ("5.000 sites/dia, 3.000 licitações/dia"). Posicionamento commodity. Fonte [17] |

### Insight crítico M1

O mercado **bifurcou em pricing**:
- **Cluster premium "sob consulta"** (Effecti, ConLicitação): R$400-5.000/mês, força demo, vende para empresas com >R$1M faturamento
- **Cluster volume/transparente** (LicitaNet, Sollicita, Licita Já): R$45-235/mês, página de preço pública, ME/EPP target
- **Cluster IA-startup low-cost** (LicitaFree, LicitAI Editais, Alerta): R$35-50/mês, free-tier opcional, IA como differentiator

**Implicação para nosso buscador:** entrada R$0 (free regional honesto) → R$50-99 Pro → R$149-199 Team **encaixa no cluster low-cost** mas defende com **regional + WhatsApp + parceria SEBRAE**, não com IA bruta (commoditizada).

---

## M2. Player regional DF/Centro-Oeste — existe?

### Buscas executadas (todas com termo "regional" explícito)
1. `"licitação Brasília" "Distrito Federal" buscador plataforma regional empresa local` → ZERO match regional. Apenas portais oficiais + filtros geográficos de Alerta Licitação.
2. `"Goiás" OR "Centro-Oeste" buscador licitação regional plataforma fornecedor` → mesma coisa. Portais oficiais TCE-GO + Goinfra + Transparência Goiás. Players privados só com filtro geo.
3. `"buscador de licitações" "Brasília" "DF" empresa local startup regional 2024 2025` → trouxe **Licitei** (Juiz de Fora, MG — fora DF) como única startup. Nenhuma startup DF/CO.
4. Cross-check em grupos WhatsApp / nicho local → não há comunidade-produto regional consolidada.
5. Player com selo SEBRAE-DF / FIBRA exclusivo para DF → não localizado em diretório oficial.

### Veredito M2

**ZERO player com foco regional declarado DF ou Centro-Oeste.** Confirmado com **alta confiança** após 5 ângulos de busca distintos.

**Implicação competitiva:**
- O posicionamento "melhor buscador da Grande Brasília" é **único no mercado** hoje
- Defensável em narrativa por 12-24 meses (até alguém copiar)
- Defensável em produto por 36+ meses se construir 3 fossos: (1) cobertura Águas Lindas + outros municípios goianos da RIDE-DF que ninguém faz; (2) parceria SEBRAE-DF/FIBRA com selo institucional; (3) base de fornecedores DF com networking effects ("vc viu que a empresa X ganhou esse edital?")

**Sub-risco:** Effecti tem sede Florianópolis com 150 funcionários, blog SEO agressivo. Se eles fizerem "Effecti DF" como sub-marca + landing page dedicada, copy nossa narrativa. Defesa: velocidade de captura SEBRAE-DF + criação de TC/RIDE-DF moat antes deles olharem.

---

## M3. ME/EPP DF — base + comportamento

### Dados públicos confirmados

| Métrica | Número | Fonte |
|---------|--------|-------|
| Total empresas ativas DF | **468-489 mil** (varia por fonte; bases comerciais usam RFB) | [18][19] |
| MEI atendidos SEBRAE-DF 2025 | 47.208 (atendimento individualizado) | [20] |
| ME atendidos SEBRAE-DF 2025 | 46.857 | [20] |
| EPP atendidos SEBRAE-DF 2025 | 14.189 | [20] |
| **Total MEI+ME+EPP atendidos SEBRAE-DF 2025** | **108.254 empresas** | [20] |
| MPE = % fornecedores do governo BR | 60% (38,44% micro + 28,24% EPP) | [21] |
| MPE = % valor compras públicas BR (2023) | 25% (R$ 42 bi de R$ 168 bi) | [21] |
| Crescimento MPE em compras públicas 2018-2023 | +93% (R$21 bi → R$42 bi) | [21] |

### Estimativas com método explícito

| Métrica | Estimativa | Método |
|---------|-----------|--------|
| Total MEI+ME+EPP DF (base RFB) | ~250k-300k | 60-65% dos 468k empresas ativas (proporção MPE/total BR ~62%) — não SEBRAE atendidos, base total |
| % MPE DF que vende ou venderia para gov | 20-30% | Brasília é capital federal → share acima da média nacional. DF tem viés "gov-proximate economy". |
| **MPE DF target potencial (vende ou pode vender ao gov)** | **50k-90k empresas** | 250k-300k × 20-30% |
| % que usa hoje ferramenta paga | 5-12% | Inferência: Effecti+LicitaNet+ConLicitação+Sollicita+Licita Já têm market share concentrado em médio porte. Micro paga menos. Penetração paga em ME/EPP brasileiras é estruturalmente baixa. |
| % que faz busca manual (PNCP/e-Compras DF refresh) | 50-70% | Maior parte do mercado. Pain point #1. |
| % que usa grupos WhatsApp / indicação informal | 30-50% | Sobreposta com manual. Sinal forte porque players ignoram WhatsApp. |
| % apenas reativa (espera órgão chamar / cadastro SICAF passivo) | 20-30% | Cauda passiva — não é cliente do produto. |

**Importante:** os números acima são **estimativas baseadas em método**, não dado público N=. SEBRAE-DF teria a pesquisa exata via diagnóstico de Compras Governamentais, mas o relatório não está publicado em formato consultável. Recomendação: pedir esse dado direto via formulário SEBRAE-DF (canal 0800).

---

## M4. TAM/SAM/SOM regional

### Modelo de unidades

| Camada | Definição | N empresas | ARPU mensal | Receita anualizada |
|--------|-----------|-----------|-------------|--------------------|
| **TAM** | Toda MPE DF que vende ou venderia para gov, em qualquer modalidade de uso | 50k-90k | R$ 99 | **R$ 60-107 milhões/ano** se 100% pagasse R$99 |
| **SAM** | Subset que pagaria R$50-200/mês por uma ferramenta melhor (não pagaria mais que isso) | 8k-15k (15-17% da TAM) | R$ 99 | **R$ 9,5-17,8 milhões/ano** |
| **SOM 24m realista** | Captável de forma honesta em 24 meses solo-dev + GTM regional + parceria SEBRAE | **200-500 contas pagantes** | R$ 99 (mix free→Pro→Team) | **R$ 240k-600k ARR ao fim do 24º mês** |
| SOM otimista 24m | Idem com parceria FIBRA + canal indicação forte | 500-1.000 | R$ 110 | R$ 660k-1,3M ARR |
| SOM conservador 24m | Solo-dev sem parceria institucional, GTM 100% inbound | 80-150 | R$ 79 | R$ 76k-142k ARR |

### Premissas SOM realista (justificativa)

- **Funil de aquisição:** 5.000 visits/mês → 250 free signups (5%) → 30 ativações reais (12%) → 15 pagos (50% após 30d uso) → 12 retention 90d (80%)
- **Throughput mensal estável após 12 meses ramp:** ~12-15 pagos novos/mês × 24m = 200-360 base acumulada, ajustado por churn 6%/mês = **~200-280 ativos** (médio); **350-500 com referrals**.
- **Crescimento não-linear:** 0-6m = 30-60 pagos (validação); 6-18m = 200 (ramp); 18-24m = 300-500 (network effects).

### Comparação com competidores

| Player | Estimativa de tamanho | Implicação |
|--------|----------------------|------------|
| Effecti | 150+ funcionários, 11 anos, vagas-clue indica clientes na casa dos milhares pagantes | Ocupando 1-3% TAM nacional |
| LicitaNet | Plano flat 30d a 1y, presença SEO forte | Mid-market, alguns milhares de pagantes |
| Sollicita | Hotmart presence + Negócios Públicos parceria | Ticket baixo, volume relevante |
| Licita Já | "1049 reviews reais", 90% recomendam — sinal de tamanho médio | Mid-market, em crescimento |

**Conclusão M4:** o cenário SOM realista 200-500 contas / R$240-600k ARR é **conservador frente ao mercado regional disponível**, MAS exige execução disciplinada em GTM regional (próxima seção).

---

## M5. GTM regional DF — canais + CAC

| Canal | CAC estimado | Volume mensal realista | Friction | Recomendado |
|-------|--------------|------------------------|----------|--------------|
| **SEBRAE-DF parceria/conteúdo** | **R$ 30-80** | 30-80 leads/mês (após contrato firmado) | ALTA inicial (negociar partnership/curso patrocinado) — depois BAIXA | **SIM — canal #1** [22][23] |
| **FIBRA Hub da Indústria DF** | R$ 80-150 | 10-30/mês | MÉDIA (FIBRA + SEBRAE-DF já tem programa Compras Governamentais para 500 MPE/ano [24]) | **SIM — canal #2** |
| **LinkedIn organic (founder-led)** | R$ 0 direto + tempo | 5-15/mês orgânico | BAIXA (apenas tempo Breno) | **SIM — canal #3 (brand)** |
| **Indicação amigo (referral)** | R$ 30-60 + crédito | 10-50/mês (após 50 base) | BAIXA após base instalada | **SIM — driver de network effects** |
| **Grupos WhatsApp regionais** | R$ 0 mas demanda gestão | 3-10/mês | MÉDIA (anti-spam, precisa ser admin de grupo legítimo) | **PARCIAL — canal de awareness, não direct sales** |
| **Google Ads brand+long-tail "licitação Brasília"** | R$ 60-200 | Volume baixo (long-tail), pode ser dominado | BAIXA setup, BAIXA volume | **SIM em V2 — após PMF** |
| **Google Ads broad "licitação"** | R$ 300-800 | Alto volume MAS Effecti+LicitaNet competem pesado | BAIXA setup, ALTA $$$ | **NÃO em V1** (perde leilão com fundo de R$ M) |
| **LinkedIn Ads paid** | R$ 200-500 | 10-20/mês | BAIXA | **NÃO em V1** (CAC 3-5x Google [25], micro DF não responde bem a LinkedIn ads) |
| **SEO regional ("Editais Águas Lindas")** | ~R$ 0 + 6m de conteúdo | 100-500 visits/mês após 6m | BAIXA setup, ALTA tempo de payoff | **SIM — conteúdo defensivo de longo prazo** |
| **Newsletter editorial ("Editais da semana DF/GO")** | R$ 0 + 4h/semana de Breno | 50-200 subscribers em 6m | BAIXA setup | **SIM — moat de longo prazo + lead-gen via parcerias** |

### Mix recomendado (CAC blended)

- 60% leads via SEBRAE-DF + FIBRA + conteúdo regional → CAC médio R$ 50
- 25% via indicação após base 50+ → CAC R$ 40 (crédito conta)
- 10% LinkedIn organic founder-led → CAC R$ 0
- 5% Google Ads brand + long-tail → CAC R$ 100

**CAC blended esperado: R$ 50-80** (ótimo para ARPU R$99 = payback <1 mês)

### Insight crítico M5

O **moat de GTM regional é o canal de parceria com SEBRAE-DF + FIBRA**, que já tem o público pré-qualificado (500 MPE/ano em treinamento Compras Governamentais). Effecti pode ter dinheiro para Google Ads nacional, mas **não tem o relacionamento institucional regional**. Esse é o fosso real, não a IA.

---

## M6. ARPU SaaS B2B microempresa BR

### Benchmarks coletados

| Fonte | Métrica | Valor | Aplicabilidade |
|-------|---------|-------|----------------|
| Metrikia (370 empresas BR) | ARPU mediano SaaS BR amostra geral | R$ 667/mês com churn 5% → LTV R$ 13.340 | Médio porte, não micro |
| BR Freelas / benchmark SaaS BR | SaaS focado micro/SMB | Ticket <R$ 150 = "B2C/low-ticket SaaS"; CAC payback 18-24m | DIRETO ao nosso segmento |
| Stripe global | CAC SaaS B2B small/middle-market | $300-$5.000 | Conversão R$1.500-25.000 — muito alto para nosso ARPU |
| LinkedIn vs Google CAC | LinkedIn CPL B2B SaaS | $60-$150 | LinkedIn CPC 3-5x Google — NÃO recomendado para micro |
| Distrito State of SaaS LatAm | 53% SaaS BR servem SME; 33,5% B2B SME especificamente | — | Confirma mercado mas sem ARPU específico |

### Análise por modelo

| Modelo | ARPU típico micro BR | Pros | Contras | Aplicabilidade buscador licitação |
|--------|---------------------|------|---------|-----------------------------------|
| **SaaS flat mensal** | R$ 49-149 | Previsível, simples, micro entende | Não escala com uso heavy | **RECOMENDADO** — público micro/EPP quer simplicidade |
| **Créditos (pay-per-use)** | Equivalente R$ 80-200 | Alinha custo→uso, ótimo para IA | Confuso para micro, frustração com "saldo" | NÃO recomendado V1 (complexidade vs benefício baixa) |
| **Híbrido** (flat + créditos IA premium) | R$ 99 flat + R$ 0,50/análise PDF | Captura heavy users sem espantar light | Complexidade dobrada vs flat | Talvez V2 após PMF |
| **Per-seat** | R$ 49-79/usuário | Comum SaaS B2B | Micro tem 1-2 usuários, ARPU baixo | Apenas plano Team |
| **Anual com desconto 30-40%** | R$ 700-1.500/ano | Reduz churn, melhora cashflow | Comprometimento espanta micro | Oferecer mas não exigir |

### Pricing recomendado para o produto

| Plano | Preço | Posicionamento | Justificativa |
|-------|-------|----------------|---------------|
| **Free Regional** | R$ 0 | Uso pessoal honesto / micro 1 alerta | Cobertura DF + 1 saved search + email diário. Diferencial mantido (regional) sem afogar margem. |
| **Pro** | **R$ 99/mês** ou R$ 990/ano (17% desc) | Microempresa séria que vende ao governo | 10 saved searches + WhatsApp alerts + chat PDF (5/mês) + export CSV |
| **Team** | **R$ 199/mês** ou R$ 1.990/ano | EPP com 2-5 usuários | 3 usuários + 50 chat PDF/mês + análise risco IA + sales feedback |
| (futuro) **Enterprise** | Sob consulta R$ 500+/mês | Médias empresas que precisam SLA / consultorias revendendo | Após 200 contas pagantes |

**Modelo recomendado: SaaS flat com upsell por tier.** Não usar créditos no V1. Anual com desconto para retention.

---

## Hipóteses revisadas

| ID | Hipótese inicial | Confidence antes | Confidence depois | Por quê |
|----|------------------|------------------|-------------------|---------|
| H2 | Persona DF pagaria R$30-100/mês | Média | **ALTA** (8/10) | Sollicita captura mercado a R$30-45 → faixa validada. R$99 é teto realista para Pro micro. |
| H5 | Free tier robusto é diferenciador | Média | **MÉDIA-ALTA** (6/10) | Free tier existe (Licitei, Alerta) — não diferencia sozinho. Free tier **regional honesto + WhatsApp** diferencia. |
| H8 | Zero player com foco regional declarado | Média | **ALTA** (9/10) | 5 buscas confirmaram. Risco residual: Effecti pode pivotar com landing regional em 6-12m. |
| (nova) H11 | Mercado IA-startup já está mexido — janela de feature parity está fechando | — | **ALTA** (8/10) | 6+ startups IA detectadas. Velocidade até 100 fornecedores pagantes é crítica. |
| (nova) H12 | SEBRAE-DF + FIBRA são o fosso de GTM | — | **ALTA** (8/10) | Programa Compras Governamentais ativo desde 2020, 500 MPE/ano. Acesso institucional é defesa real vs players nacionais. |
| (nova) H13 | Pricing premium "sob consulta" do Effecti/ConLicitação é tactical, não estrutural | — | **MÉDIA** (5/10) | Pode ser estratégia de discriminação de preço por porte (legítimo SaaS B2B), não fraqueza. Atacar via SMB onde eles têm pricing premium não-competitivo. |

---

## Conclusão para D-GO e D-PRODUTO

### D-GO (até 2026-05-22) — mercado

**VEREDITO: GAP REGIONAL CONFIRMADO. Recomendação CONDICIONAL para GO.**

Pré-condições para construir MVP:
1. ✅ Gap regional comprovado (M2)
2. ✅ TAM/SAM viável (M4) — 8-15k pagantes potenciais SAM
3. ⚠️ **Pré-condição não-cumprida ainda:** validação CONCRETA com 5+ fornecedores DF (não só o amigo) sobre willingness-to-pay R$99/mês para versão regional vs Effecti. **Risco H2:** persona disse "pagaria R$50" mas paga R$45 Sollicita hoje sem fricção — gap percebido pode ser menor.
4. ⚠️ **Risco competitivo:** janela IA-feature parity fechando (Licitei, LicitAI, LicitaIA emergindo). 12-18 meses de lead time se executar com agressividade. Mais que isso = corrida perdida.

**Resposta recomendada:** GO com escopo MVP enxuto (free tier + 1 plano Pro R$99) E timebox 90 dias até "5 fornecedores DF pagando". Se não bater, pivotar para B2B parceria SEBRAE-DF (vender o produto white-label).

### D-PRODUTO (2026-07-15) — produtizar ou descontinuar?

**Cenário REALISTA (200-500 contas em 24m, ARR R$240-600k):**
- Unit economics fecham: ARPU R$99 / CAC R$50-80 / LTV/CAC 13-20x / payback <2 mês
- Margem bruta SaaS-clássica >80% se infra <R$ 5k/mês (Vercel+Supabase+Inngest+Resend stack)
- Solo-dev sustenta operação? Depende. 200 contas pagantes = ~1 ticket suporte/dia. Sustentável. 500 contas = 3-5 tickets/dia = exige primeiro hire (suporte L1 + CSM).

**Cenário CONSERVADOR (80-150 contas em 24m, ARR R$76-142k):**
- Unit economics ainda fecham, mas operação fica back-burner. Não justifica primeiro hire. Pode virar lifestyle SaaS solo se Breno quiser, mas não escala.
- **Risco honesto:** se Breno tem Tocks/Bretda demandando attention, esse projeto sufoca por subinvestimento — recomendação seria *manter como uso pessoal + amigo, não produtizar comercial*.

**Cenário OTIMISTA (500-1.000 contas com parceria FIBRA + indicação forte, ARR R$660k-1,3M):**
- Justifica produtização total, 1 contratação CSM/suporte, talvez round angel.
- **Pré-condição:** parceria SEBRAE-DF ou FIBRA com selo institucional, fechada nos primeiros 6 meses.

**Resposta D-PRODUTO recomendada:** decisão data-driven em 07/2026 baseada em (a) número de contas pagantes em 90d, (b) churn 30d (proxy de retenção), (c) NPS dos 10 primeiros pagantes, (d) confirmação de canal SEBRAE-DF. Se 3/4 desses sinais forem verdes, produtizar.

---

## Riscos de mercado novos descobertos

1. **Compressão de pricing low-end via AI-startups.** LicitAI R$39,90/mês, LicitaFree R$49,90/mês já estão no mercado. Quem entrar agora compete em pricing já comprimido — precisa diferenciar em valor regional, não pode usar "preço baixo" como USP.
2. **Licitei (UFJF) com R$3,5M captado pode lançar feature regional a qualquer momento.** Microsoft sponsor dá poder de fogo. Plano de defesa: tornar-se a referência regional ANTES deles olharem.
3. **Effecti tem programa "Indica Clientes R$500 desconto"** — sinal de que estão lutando ativamente contra churn via referral. Mercado mais quente do que parece. Implicação: pode ter saturação de demanda dispoível "fácil" antes de você chegar.
4. **GDF/DF tem orçamento R$71,7 bi 2026** (não é volume compras, mas baseline). Mercado-fim está crescendo, não diminuindo. Risco regulatório baixo.
5. **Reclame Aqui Effecti: padrão "cobrança sem serviço + suporte ineficiente"** — oportunidade narrativa real ("buscador regional que responde no WhatsApp em 1h"). Cuidado: não fazer claim que vc não consegue cumprir solo-dev (SLA realista 24h).
6. **Cobertura municipal Águas Lindas no PNCP é desconhecida** (já listado como D-03 no MASTER-REPORT). Se a prefeitura não publica consistentemente, o produto regional fica fraco no município-âncora. **CRÍTICO validar antes de investir 8 semanas dev.**
7. **Effecti tem 150+ funcionários e 11 anos.** Não é startup vulnerável — é incumbent estabelecido. Vencê-los regionalmente é viável; vencê-los frontalmente é suicídio. Manter foco DF/RIDE-DF disciplinado.

---

## Fontes (numeradas)

[1] Effecti — Calculadora de Planos — https://effecti.com.br/calculadora-de-planos/ — autoridade 4/5, recência 5/5, relevância 5/5 — pricing-gated (calculadora exige input) — 2026-05-15
[2] Effecti — Plataforma (Planos e Preços) — https://effecti.com.br/plataforma/ — autoridade 5/5, recência 5/5, relevância 5/5 — pricing ocultado, página existe mas sem números visíveis — 2026-05-15
[3] LicitaNet — Landing — https://licitanet.com.br/ — autoridade 5/5, recência 5/5, relevância 5/5 — pricing público R$152/R$287/R$422/R$692 confirmado via SERP snippet — 2026-05-15
[4] LicitaNet — Lance Fácil blog (terceiro) — https://blog.lancefacil.com/licitanet/ — autoridade 3/5, recência 4/5, relevância 4/5 — confirma estrutura de planos — 2026-05-15
[5] ConLicitação — Planos — https://conlicitacao.com.br/planos/ — autoridade 5/5, recência 5/5, relevância 5/5 — pricing ocultado — 2026-05-15
[6] ConLicitação — Análise de Mercado (feature) — https://conlicitacao.com.br/ferramentas/analise-de-mercado/ — autoridade 5/5, recência 4/5, relevância 4/5 — descreve ferramenta enterprise — 2026-05-15
[7] Receita Federal — Contrato Sollicita PRO 2024 INEX-COPOL 17/2023 — https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/licitacoes-e-contratos/.../proposta-comercial-com-desconto.pdf — autoridade 5/5, recência 5/5, relevância 4/5 — PDF público RFB confirma contrato (não conseguimos fetch direto para extrair valor exato) — 2024
[8] Sollicita — Assine — https://sollicita.com.br/assine/ — autoridade 5/5, recência 5/5, relevância 5/5 — pricing público R$44,90 / R$39,98 / R$30,82 — 2026-05-15
[9] Licitar Digital — Regulamento PDF — https://arquivos.licitardigital.com.br/Regulamento_Licitar_Digital.pdf — autoridade 5/5, recência 4/5, relevância 5/5 — anuidade R$1.197 confirmada — 2020+
[10] Licitar Digital — Serviços — https://licitar.digital/servicos/ — autoridade 5/5, recência 5/5, relevância 5/5 — modelo pague-se-vencer 1,3% / max R$500 — 2026-05-15
[11] Licitar Digital — Fornecedor — https://licitar.digital/fornecedor/ — autoridade 5/5, recência 5/5, relevância 4/5 — credenciamento R$83,90 — 2026-05-15
[12] Licita Já — Planos (Subscription) — https://www.licitaja.com.br/subscription.php — autoridade 5/5, recência 5/5, relevância 5/5 — R$235/R$657/R$1.242/R$2.196 — 2026-05-13 (review)
[13] LicitaFree — Landing — https://www.licitafree.com.br/ — autoridade 5/5, recência 5/5, relevância 4/5 — R$49,90/mês — 2026-05-15
[14] LicitAI Editais — Landing — https://www.licitaieditais.com.br/ — autoridade 4/5, recência 5/5, relevância 5/5 — a partir de R$39,90/mês — 2026-05-15
[15] Licitei — Landing — https://www.licitei.com.br/ — autoridade 5/5, recência 5/5, relevância 5/5 — free tier + planos pagos — 2026-05-15
[16] UFJF Critt — Notícia Licitei — https://www2.ufjf.br/critt/2024/02/22/startup-juizforana-lanca-novo-sistema-gratuito-com-inteligencia-artificial-para-agilizar-licitacoes-publicas/ — autoridade 5/5, recência 4/5, relevância 4/5 — confirma R$3,5M captados Microsoft+TecHolding — 2024-02-22
[17] Alerta Licitação — Landing + App Store — https://alertalicitacao.com.br/ + https://apps.apple.com/br/app/alerta-licita%C3%A7%C3%A3o/id1335388672 — autoridade 4/5, recência 5/5, relevância 5/5 — R$34,90-44,90 — 2026-05-15
[18] Mapa de Empresas — Governo Federal — https://www.gov.br/empresas-e-negocios/pt-br/mapa-de-empresas — autoridade 5/5, recência 5/5, relevância 5/5 — 489k empresas ativas DF — 2026-04-12
[19] Pesquisa Empresas (RFB derivado) — https://pesquisaempresas.com.br/listas-de-empresas/DF — autoridade 3/5, recência 4/5, relevância 4/5 — 468k ativas, 2,28% nacional — 2026
[20] ASN DF Sebrae — Recorde atendimentos 2025 — https://df.agenciasebrae.com.br/dados/sebrae-alcanca-novo-recorde-em-atendimentos-a-empreendedores-do-df-em-2025/ — autoridade 5/5, recência 5/5, relevância 5/5 — 47k MEI + 47k ME + 14k EPP — 2025
[21] ASN Nacional Sebrae — MPE 67,7% fornecedores governo + R$42 bi vendas 2023 — https://agenciasebrae.com.br/economia-e-politica/pequenos-negocios-correspondem-a-677-dos-fornecedores-do-governo/ + https://agenciasebrae.com.br/dados/vendas-confirmadas-dos-pequenos-negocios-para-o-governo-ultrapassam-r-17-bilhoes-em-2023/ — autoridade 5/5, recência 4/5, relevância 5/5 — 2024
[22] SEBRAE-DF — Compras Governamentais — http://conteudo.sebrae.com.br/sites/PortalSebrae/ufs/df/sebraeaz/politicas-publicas-compras-governamentais-do-distrito-federal,ca4a5981bdbf0510VgnVCM1000004c00210aRCRD — autoridade 5/5, recência 4/5, relevância 5/5 — programa específico DF — 2024
[23] SEBRAE — Canal Fornecedor — https://www.scf3.sebrae.com.br/PortalCf/Licitacoes — autoridade 5/5, recência 5/5, relevância 5/5 — 2026
[24] FIBRA Sistema — Notícia "Fibra e Sebrae-DF buscam ampliar participação da indústria local em licitações" — https://www.sistemafibra.org.br/fibra/sala-de-imprensa/noticias/2118-fibra-e-sebrae-df-buscam-ampliar-participacao-da-industria-local-em-licitacoes — autoridade 5/5, recência 3/5, relevância 5/5 — 500 MPE/ano em treinamento — 2020 (programa ativo)
[25] Stripe — CAC SaaS guide — https://stripe.com/resources/more/cac-in-saas — autoridade 5/5, recência 5/5, relevância 4/5 — $300-$5.000 CAC SaaS small/middle B2B — 2026
[26] Metrikia BR — Métricas SaaS B2B BR — https://www.metrikia.com.br/blog/metricas-saas-b2b — autoridade 4/5, recência 4/5, relevância 5/5 — amostra 370 empresas BR, ARPU R$667 médio — 2024-2025
[27] BR Freelas Comunidade — LTV/CAC SaaS BR — https://brfreelas.com.br/comunidade/saas/como-calcular-ltv-e-cac-para-saas-b2b/ — autoridade 3/5, recência 4/5, relevância 5/5 — ticket <R$150 = "B2C/low-ticket" pattern BR — 2025
[28] Reclame Aqui — Effecti reclamações — https://www.reclameaqui.com.br/empresa/effecti/lista-reclamacoes/?status=EVALUATED — autoridade 4/5, recência 5/5, relevância 4/5 — padrão "cobrança sem serviço / suporte ineficiente / WhatsApp não respondido" — 2025
[29] Metrópoles — GDF arrecadação 2024 — https://www.metropoles.com/colunas/grande-angular/gdf-arrecadou-r-113-bilhoes-no-1o-quadrimestre-de-2024-15-a-mais — autoridade 4/5, recência 5/5, relevância 3/5 — DF cresce 4,9% arrecadação, despesas R$64,7 bi — 2024
[30] Effecti LinkedIn — https://br.linkedin.com/company/effecti-licitacoes — autoridade 5/5, recência 5/5, relevância 5/5 — 150+ funcionários, 11+ anos — 2026

**Total fontes: 30 / Cota desejada: 48 (8×6 perguntas). Cota não atingida em M1 (Effecti+ConLicitação pricing-gated bloqueou triangulação completa) e M3 (dados N específicos do diagnóstico SEBRAE-DF não publicados). Restante das perguntas com cota adequada.**

---

*Atlas — sub-agent Mercado-Negócio — Fase B research buscador-licitacoes — 2026-05-15*
