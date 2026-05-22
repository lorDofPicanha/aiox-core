# Dimensão Mercado-Negócio

Quando aplicar: decisões de entrada/saída de mercado, pricing, GTM, sizing, análise competitiva, viabilidade comercial, escolha de modelo de negócio.

## Análise competitiva estruturada

Não é "listar concorrentes". É mapear quatro categorias distintas:

### Concorrentes diretos
Mesma proposta de valor, mesmo público-alvo. São o benchmark óbvio mas raramente são a maior ameaça.

### Concorrentes indiretos
Resolvem o mesmo problema do usuário de outra forma. Para um SaaS de gestão de tarefas: papel, planilha, post-it, e-mail organizado, ChatGPT, secretária humana. Substitutos não-óbvios capturam muito mais usuários do que se costuma reconhecer.

### Substitutos não-óbvios
O que o usuário **faz hoje** quando não tem seu produto. Frequentemente "nada" ou "Excel" ou "uma rede social não relacionada". Mapear isso é mapear o real comportamento atual — o que precisa ser deslocado.

### Adjacentes
Não competem hoje mas podem competir amanhã. Empresas com base de usuário próxima, capacidade técnica próxima, ou modelo de negócio extensível ao seu espaço. Toda categoria SaaS bem-sucedida atrai entrantes adjacentes em 18–36 meses.

Para cada concorrente em cada categoria, mapear:

- Proposta de valor exata (não a do marketing — a real, deduzível do produto)
- Pricing e estrutura de monetização
- Unit economics estimados (CAC, LTV, churn quando inferível)
- Funding e runway (Crunchbase, LinkedIn, anúncios públicos)
- GTM dominante (paid, orgânico, comunidade, parceiros, vendas)
- Métricas públicas quando disponíveis (DAU, MAU, retenção em relatórios anuais)
- Pontos fracos confirmáveis — reviews em App Store, G2, Trustpilot, Reddit. Minas de Voice of Customer reais.
- Trajetória dos últimos 12–24 meses (crescimento, pivots, contratações-chave)

## Sizing de mercado

Duas abordagens, com pesos diferentes:

### Top-down
Pegar relatórios de mercado (Gartner, IDC, McKinsey, Frost & Sullivan, etc.) e segmentar. Rápido, mas frequentemente otimista demais — relatórios são frequentemente vendidos a quem quer ouvir números grandes.

### Bottom-up (sempre mais confiável)
População relevante × prevalência do problema × propensão a pagar × ticket médio × penetração realista em N anos.

**Exemplo:** SaaS de gestão para clínicas odontológicas no Brasil.
- População relevante: ~280 mil cirurgiões-dentistas, ~120 mil clínicas
- Prevalência do problema: ~70% das clínicas têm gestão precária (estimar via amostras qualitativas ou relatórios setoriais)
- Propensão a pagar: histórico de produtos similares no Brasil (% que pagou)
- Ticket: pesquisar concorrentes diretos (entre R$ 99 e R$ 499/mês tipicamente)
- Penetração realista em 3 anos: 1–3% para entrante novo é típico

TAM = total × ticket. SAM = parcela acessível pelo seu GTM. SOM = quanto você realisticamente captura.

Sempre faça os dois e compare. Discrepância grande indica que algum input está errado — investigue.

## Unit economics

Toda decisão de mercado fecha ou não fecha em unit economics. Métricas obrigatórias:

- **CAC (Customer Acquisition Cost):** custo total de aquisição dividido pelos clientes adquiridos. Por canal, idealmente.
- **LTV (Lifetime Value):** receita média por cliente ao longo do tempo de vida. Cuidado: LTV depende de churn, que muda com tempo.
- **Payback period:** quanto tempo até o CAC ser recuperado. < 12 meses bom; < 18 aceitável; > 24 problemático.
- **LTV/CAC ratio:** alvo > 3. < 1 é insustentável. Entre 1 e 3 é apertado.
- **Churn:** mensal e anual. Bruto e líquido (considerando expansão). Comparar com benchmark do setor.
- **Margem por cliente:** receita líquida dos custos de servir (infra, suporte, etc.).
- **Burn multiple:** quanto se queima para cada dólar de ARR novo.

Benchmarks variam dramaticamente por setor:
- SaaS B2B enterprise: churn anual 5–10%, LTV/CAC 3–8 em players maduros
- SaaS B2B SMB: churn anual 10–20%
- SaaS B2C wellness/lifestyle: churn mensal 6–12%, CAC orgânico R$ 15–40 (BR), pago R$ 80–200
- Marketplaces: economia de líquido depende de take rate e densidade

Sempre busque benchmarks **do seu setor específico** antes de declarar viabilidade.

## GTM patterns

Para cada concorrente bem-sucedido e malsucedido relevante, mapear:

- **Como adquiriram os primeiros 100, 1.000, 10.000 usuários?** (Frequentemente o canal inicial é diferente do canal de escala.)
- **Quando levantaram capital? Em que etapa?**
- **Quando pivotaram? Por quê?**
- **Onde travaram? Como destravaram (ou não)?**
- **Quais canais escalaram? Quais saturaram?**
- **Que erros públicos cometeram?**

Fontes ouro:
- Cofounders falando em podcasts (Indie Hackers, Lenny's, 20VC, etc.)
- Posts retrospectivos de fundadores (Medium, Substack)
- LinkedIn de pessoas-chave em momentos específicos
- Crunchbase para histórico de funding
- Wayback Machine para ver como o site mudou ao longo do tempo
- Anúncios de imprensa antigos (mostram a narrativa que era usada)

## Voice of Customer

Reviews públicas são o atalho mais subutilizado em análise competitiva.

Foco principal: **reviews 1–2 estrelas**. É onde a dor real está. Reviews 5 estrelas são frequentemente performáticas; 3 estrelas são mornas; 1–2 são onde o cliente realmente desistiu e tem motivo claro.

Plataformas por tipo:
- B2C apps: App Store, Google Play
- B2B SaaS: G2, Capterra, TrustRadius
- Serviços: Trustpilot, Reclame Aqui (BR)
- Geral: Reddit (busca específica), Twitter/X reclamações
- E-commerce: review da própria página + sites de reclamação

Procurar padrões:
- Que problema reincidente o produto não resolve?
- Que feature básica está faltando ou quebrada?
- Qual o gatilho de cancelamento mais comum?
- Há frustração com pricing? Suporte? Onboarding?
- O produto entrega o que promete? (Gap entre marketing e realidade?)

Cada padrão é uma oportunidade ou um risco para você.

## Tendências e sinais antecedentes

Não basta o estado atual; mercado importa pelo vetor.

**Sinais de mercado em expansão:**
- Funding crescente em players da categoria
- Entrantes adjacentes movendo-se para o espaço
- Mídia generalista cobrindo (com cuidado: cobertura pode marcar topo)
- Conferências dedicadas surgindo
- Procuras Google crescendo (Trends)
- Vagas de emprego no setor crescendo (LinkedIn)

**Sinais de mercado contraindo:**
- Funding em queda
- Consolidação (M&A entre concorrentes)
- Layoffs públicos
- Produto saindo do mercado
- Substitutos novos (geralmente IA) absorvendo o problema

## Anti-padrões específicos desta dimensão

- **TAM inflado:** "se pegarmos 1% deste mercado de US$ 100bi..." é o sinal clássico. Sizing tem que ser bottom-up para ser real.
- **Pricing por intuição:** ignorar willingness-to-pay revelada pelos benchmarks do setor.
- **Ignorar substitutos não-óbvios:** assumir que o mercado se compara só com concorrentes diretos.
- **Otimismo de adoção:** assumir penetração rápida sem evidência. Curva de adoção é tipicamente mais lenta do que se imagina.
- **Subestimar CAC:** custo de aquisição cresce com escala; canal que funciona em 100 clientes raramente funciona em 10.000.
- **Confundir feature com diferencial:** o que parece único frequentemente é replicável em 6 meses por concorrente bem-financiado.
- **Achar que mercado pequeno = oportunidade:** pode ser, mas frequentemente é mercado pequeno porque é mercado pequeno mesmo.

## Output esperado desta dimensão

Para cada pergunta-mestre de mercado:

1. Mapa competitivo nas quatro categorias (direto, indireto, substituto, adjacente)
2. Sizing bottom-up + top-down com discrepância explicada
3. Benchmarks de unit economics do setor
4. Padrões de GTM que funcionaram e que falharam em players próximos
5. Voice of Customer dos concorrentes (oportunidades e riscos derivados)
6. Trajetória do mercado (expansão, plateau, contração) com sinais
7. Recomendação de posicionamento com condições de validade
8. Riscos competitivos identificados
