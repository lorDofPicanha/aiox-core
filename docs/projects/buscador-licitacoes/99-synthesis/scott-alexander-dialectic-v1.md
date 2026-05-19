# Dialectic on Building a Hyper-Regional Tender Search Engine
*Embodied: Scott Alexander, channeling SSC/ACX style*
*Date: 2026-05-15*
*Constraint: written without reading Orion's v0 synthesis*

---

## 0. The Outside View Before Anything Else

Antes de discutir qualquer pergunta deste projeto, eu preciso fazer aquilo que sempre faço quando alguém me apresenta um plano: olhar para a classe de referência. Não para *este* projeto, mas para projetos *como* ele. Porque a coisa mais consistentemente sub-utilizada por engenheiros inteligentes (Breno claramente é um) é exatamente isto — a outside view, no sentido de Tetlock e Kahneman.[1] Existe uma tendência sistemática de tratar cada projeto como sui generis ("o meu é diferente porque tenho o AIOS, tenho domínio do amigo, tenho timing perfeito") quando, estatisticamente, projetos diferem muito menos do que pensamos.

Então. Quatro classes de referência relevantes aqui:

**Classe 1: Solo-dev govtech/procurement SaaS em mercado emergente, timeline 8-12 semanas.**
A base rate de chegar a "MVP shippado com ≥1 usuário real diário" é razoável — diria 50-65% se o dev tem stack proficiency e o problema é real. A base rate de chegar a "≥10 paying customers em 6 meses" cai para 10-20%. A base rate de chegar a "200+ paying customers em 24 meses" — que é o SOM realista da research-mercado — fica em algo como 3-8% mesmo entre os que fizeram tudo certo. E note: estamos falando da subpopulação dos que *terminaram* o MVP. Vai por mim, dos que *começam*, é mais perto de 1-3%.

**Classe 2: B2B SaaS free-tier com positioning regional, ICP ME/EPP no Brasil.**
A coisa mais dolorosa que você aprende observando esse mercado por algum tempo é que o ICP "microempresa brasileira que paga R$50-99/mês por uma ferramenta especializada" é *real*, mas tem três características devastadoras para solo-dev: (a) churn 5-8% mensal mesmo com bom produto — não é falha sua, é o mercado;[2] (b) tickets baixos significa que CAC blended precisa ficar abaixo de R$80 ou a unit economics nunca fecha; (c) microempresa brasileira *não responde* a aquisição digital cara — só funciona com canal institucional ou indicação. A research-mercado-v1 modelou tudo isso corretamente, mas há um ponto que ficou implícito que vou explicitar: 200-500 contas pagantes em 24 meses *exige* o canal SEBRAE/FIBRA dar certo. Sem isso, vire conservador (80-150 contas), e nesse cenário a unit economics teórica fecha mas a operação não justifica seu tempo.

**Classe 3: Open-data wrappers / aggregators construídos "para um amigo primeiro".**
Aqui as base rates ficam realmente preocupantes. Quando alguém constrói "para um amigo primeiro" e *só depois* pensa em produtizar, a probabilidade desse projeto virar produto comercial sustentável é abaixo de 5%, talvez 2%. Por uma razão simples e amarga: o amigo é um sample size de 1, com motivações sociais (não pagaria pelo produto se você não conhecesse ele), e suas preferências são *quase sempre* não-representativas do mercado mais amplo. A literatura de produto chama isso de "founder-customer divergence" — eu chamo de o problema do amigo único, e ele explica por que tantos side-projects de devs talentosos morrem com 1 usuário feliz e nenhuma tração.

**Classe 4: Hyper-regional vertical SaaS no Brasil, janela 24m, sem capital externo.**
A base rate aqui é interessante porque o cenário tem um modo bimodal estranho: ou (a) o player regional encontra um canal institucional cedo (SEBRAE local, federação de indústrias, conselho profissional) e cresce sustentavelmente como lifestyle business R$300-800k ARR, ou (b) morre invisível em 18 meses. Não há muito intermediário. Cerca de 15% dos casos vão para (a), 75% para (b), 10% conseguem capital e aceleram. Distribuição bimodal porque é exatamente o canal institucional que diferencia — não a qualidade do produto.

Juntando os quatro: a outside view para D-GO me dá uma distribuição sobre desfechos em 24 meses mais ou menos assim:

| Desfecho | Probabilidade outside-view |
|----------|---------------------------|
| MVP nunca termina (abandono <12 semanas) | 25-35% |
| MVP termina, amigo usa, nada mais | 30-40% |
| MVP termina, 5-30 contas pagantes, lifestyle micro | 15-25% |
| MVP termina, 100-500 contas, sustentável | 5-10% |
| MVP termina, escala 500+, produto verdadeiro | 1-3% |
| Algo que eu não estou modelando (pivot lateral, virou serviço, virou conteúdo) | 5-10% |

Isto é antes de eu olhar para qualquer evidência específica deste projeto. É o prior baseado em projetos *desta classe*. Mantenha isso em mente enquanto a inside view tenta me convencer de que o nosso é especial.

(Aliás — se a inside view me convencer de que estamos no topo da distribuição, eu devo desconfiar. Quando os argumentos a favor parecem convenientes demais, geralmente são.)

---

## I. D-GO — Should We Build This Thing?

### The Case for Building (steelmanned)

Vou construir a versão mais forte do "sim, construa", usando o que as três pesquisas técnicas/regulatórias/mercado entregaram. Não vou esconder nada.

A research técnica mostra que o stack é viável, o custo operacional cabe em $25-40/mês na fase pessoal, a PNCP API é estável o suficiente para um cliente solo, e a maior incerteza técnica (PDF parsing + qualidade Haiku 4.5 em jurídico denso PT-BR) é endereçável com um POC de 4 horas que o Breno pode fazer no dia 1. A descoberta crítica do sub-agent T — que existem APIs oficiais para 80%+ do volume (PNCP + ComprasGov + dados.df.gov.br) e que scraping vira fallback P2 raro — derruba o que era o maior risco técnico do projeto.[3]

A research regulatória entrega o que provavelmente é o achado mais forte da fase B: Lei 14.133 art. 174 §4º combinado com LAI art. 8º §3º combinado com Decreto 8.777 + Lei do Governo Digital fornece amparo legal *explícito e robusto* para consumo automatizado dos dados — inclusive comercial.[4] A confidence H9 sobe de 65% para 92%. O acórdão TCU 1.216/2014, que parecia ser uma ameaça, é categoricamente distinto (trata de robôs de lance *durante* o certame, não de agregadores de dados *antes* do certame). E a Resolução ANPD 2/2022 desenha um caminho leve para solo-dev/ATPP com DPO dispensado e ROPA simplificado.

A research-mercado confirma o gap regional com força surpreendente: zero player com foco DF/Centro-Oeste declarado, após 5 ângulos de busca distintos.[5] Existe uma janela narrativa de 12-24 meses defensável, e uma janela estrutural de 36+ meses se conseguir três fossos (cobertura municipal RIDE-DF, parceria SEBRAE-DF/FIBRA, network effects entre fornecedores). A unit economics teórica é boa: ARPU R$99 / CAC blended R$50-80 / LTV/CAC 13-20x / payback <2 meses.

A research comparativa global mostra que a stack proposta está 75% alinhada com state-of-the-art, com search híbrida (BM25 + pgvector) já *mais avançada* do que Mercell, o líder Nordic. WhatsApp como canal de notificação é diferenciação cultural defensável (BR/LATAM tem essa expectativa, EU/Nordic não). Free tier honesto + pricing transparente está alinhado com ChileCompra/UNGM/WB pattern e contrasta favoravelmente com Effecti/ConLicitação opacos.

E há um argumento meta que vale a pena explicitar: o Breno é solo-dev com 10 anos de experiência, tem AIOS framework dele, tem proficiência Next.js, e o projeto é alta reversibilidade (custo afundado < $50, 8 semanas timeboxable, pivot/descontinuar barato). É o tipo de aposta com payoff convexo: downside limitado, upside opcional.

Isso é o melhor caso. É legitimamente bom. Eu não estou inventando — está tudo nas pesquisas.

### The Case Against Building (steelmanned harder)

Agora deixa eu fazer a coisa que é mais difícil e mais útil: o caso *contra*, no nível em que o Breno teria dificuldade real de refutar. Não o strawman "ah mas tem risco" — o steelman.

**Argumento 1: O custo de oportunidade real, e não o nominal.**

A research lista "40-60h desviadas de Tocks/Bretda" como custo de errar D-GO. Isso é dramaticamente sub-estimado. O Breno está com Tocks pré-PIX (sem saldo Meta), Bretda em restore híbrido pós-Instant Form trap (precisa monitor diário), KR com WABA wrong-number (R$437 voids, smoking gun não resolvido), Vorza em pivot pra email marketing pendente decisão. Cada um desses está num momento de *fragilidade reversível* — exatamente o momento em que attention split causa mais dano. A heurística pertinente vem do Will Larson e do Cal Newport: o custo de switching cognitive entre projetos B2C ads (Tocks/Bretda) e B2B SaaS (buscador) não é linear nem aditivo; é multiplicativo no que se perde em *quality of decisions* dos projetos que pagam o aluguel.[6]

Se Tocks estagnar 30 dias por sub-atenção, e Tocks está fazendo (digamos) R$15-30k/mês quando otimizado, o EV negativo só do mês 1 já é R$5-10k. Em 8 semanas, isso vira R$10-20k. *Comparado ao buscador*, que mesmo no cenário SOM realista chega a R$0 receita em 90 dias e talvez R$3-5k MRR no mês 6. A matemática do tempo NÃO fecha — desde que Tocks/Bretda sejam de fato sub-atendidos. Talvez não sejam. Mas a evidência circulante (memórias 12/Mai de bug Instant Form, smoking gun KR não resolvido) sugere que estão.

**Argumento 2: A Síndrome OpenTender.eu.**

A research comparativa global identificou exatamente o failure mode que mais me preocupa aqui: o DIGIWHIST/OpenTender.eu recebeu €3M+ de Horizon 2020, cobriu 33 países, virou referência acadêmica — e *não virou produto*. Por quê? Foco em transparência sem fornecedor pragmático, sem free-vs-paid tier claro, sem canal de retenção (email/WhatsApp), sem UX action-oriented. Eu menciono isso porque o motivo declarado do Breno fazer este projeto — "ele só me pediu para fazer algo no nicho dele" + "pode virar projeto cívico" + "uso pessoal" — *cheira exatamente* a OpenTender. Quando alguém constrói algo cuja justificativa é simultaneamente "pra um amigo", "pra mim", "talvez pra produto", "tem valor cívico" — está dizendo que não tem usuário-alvo único. E SaaS sem ICP único é SaaS que morre.

Steelman do contra-argumento: o Breno *podia* atalhar tudo isso configurando Effecti ou Sollicita (R$30-45/mês) para o amigo com keywords curadas. O amigo paga R$45/mês, fica feliz, problema resolvido. Custo total: 2h de Breno + R$45/mês do amigo. Comparado a 100-240h de Breno + opportunity cost dos outros projetos, é estatisticamente um deal melhor por ordens de grandeza. Se o objetivo é "ajudar o amigo", construir é racionalmente errado.

(Aliás — note que a research-mercado descobriu que Sollicita captura mercado exatamente nesse pricing R$30-45 e tem feature parity quase total com o que o MVP do buscador entregaria. O *deltinha* é "regional + WhatsApp", mas o amigo está em Águas Lindas — e ainda não validamos que Sollicita não cobre Águas Lindas razoavelmente. Aposto que cobre 70-80% do volume.)

**Argumento 3: Sample size N=1 é estatisticamente equivalente a zero.**

O motivo declarado primário é "o amigo precisa". Toda a research-mercado especulou sobre 5-15k fornecedores DF potenciais, 50-90k MPE, etc. — mas a única evidência *real* de demanda é uma pessoa. E essa pessoa (a) não pediu o produto, foi o Breno que ofereceu; (b) é amigo do Breno, então tem viés social para dizer "sim, isso seria útil"; (c) não tem dor financeira (paga R$0 hoje? paga Sollicita R$45? não sabemos); (d) usa hoje busca manual ou indicação WhatsApp — ou seja, não tem o hábito de pagar por ferramenta. Quantos amigos seus já elogiaram uma ideia que você teve e nunca usaram o produto resultante? Esse é o N=1.

A research-mercado modelou TAM/SAM/SOM com método honesto. Mas o SOM 200-500 contas é puramente *teórico* — não há nenhum dado empírico bottom-up. Quando você tem N=1 (amigo) e modela top-down (8-15k SAM), o que você está fazendo é uma extrapolação inflacionária. Quem fez o mesmo exercício e errou? Eu diria que 70-80% dos solo-dev SaaS BR que falharam.

**Argumento 4: A janela de IA-startup já está mexida — e isso é mais danoso do que a research sugere.**

A research-mercado lista 6+ entrantes IA recentes (Licitei R$3,5M Microsoft, LicitAI R$39,90, LicitaFree R$49,90, Licita Já R$235, Alerta Licitação R$34,90-44,90, LicitaIA). O que a research talvez subestime é o que isso significa em termos competitivos: significa que a *narrativa* "buscador inteligente com IA" virou commodity. O diferencial regional + WhatsApp é real, mas é um diferencial *narrativo*, não estrutural. Licitei tem R$3,5M e Microsoft sponsor — eles podem lançar "Licitei DF Edition" em 6 meses se decidirem que vale. O moat real é o canal SEBRAE-DF/FIBRA, que ainda não está conquistado — e que pode demorar 6-12 meses de negociação institucional só para começar.

Steelman: você está apostando que (a) consegue conquistar o canal SEBRAE-DF/FIBRA em 6 meses E (b) Licitei/Effecti não percebem o nicho regional em 12 meses E (c) o amigo + 4-5 fornecedores DF iniciais não cancelam após 2 meses (churn 6%/mês = ~30% em 6 meses). Probabilidade conjunta dessas três condições? Otimista: 20%. Realista: 8-12%.

**Argumento 5: "Para o Breno extrair valor mesmo se virar produto-gaveta" é o argumento mais traiçoeiro do projeto.**

O 5-why diz: "(c) Breno extrai valor mesmo se virar produto-gaveta — domínio aprendido + projeto cívico." Eu odeio esse argumento. Não porque seja falso (é parcialmente verdadeiro), mas porque é o *exact same* argumento que justifica todo side-project ruim do mundo. "Pelo menos eu vou aprender" é a quintessência da racionalização. Você aprende mais sobre direito administrativo lendo Marçal Justen Filho por 4 horas do que construindo 8 semanas. Você aprende mais sobre govtech contribuindo para OpenProcurement (open-source Apache) do que clonando-o pela milésima vez para um nicho. O "valor de aprendizado" é a desculpa que damos quando não conseguimos defender o ROI direto.

### The Considerations Worth Skipping

Algumas coisas que parecem considerações mas não são — anti-bait para o leitor:

- **"Já temos a research feita, seria desperdício não construir."** Sunk cost fallacy clássica. As 22h da research têm valor de informação independentemente da decisão. Construir só porque pesquisou é igual a comprar a casa porque pagou o corretor.
- **"Mas a stack é o que o Breno conhece, então o custo é baixo."** Verdade trivial, ignora o ponto. O custo é o *tempo*, não a curva de aprendizado.
- **"Mas dá pra timeboxar 90 dias e killar se não der certo."** Todo mundo timeboxa, quase ninguém kill. Sunk cost se intensifica com tempo investido. Voltarei a isso em D-PRODUTO.
- **"A janela está fechando."** Esse é o tipo de framing de urgência que é wrong 80% do tempo. Mercados de govtech regional não fecham — eles ficam latentes por anos. Não há urgência real. Se há urgência, é fabricada.

### Tentative Verdict — D-GO

Eu vou ser concreto, porque vagueza é o pecado da síntese dialética. Aqui estão minhas probabilidades:

| Caminho | Probabilidade subjetiva | Comentário |
|---------|-------------------------|------------|
| **GO total (8 semanas full MVP)** | 25% | Seria certo se Tocks/Bretda estivessem em autopilot real, o que não é o caso |
| **NO-GO (mantém ideia, configura Effecti/Sollicita pro amigo)** | 30% | Honesto. Resolve o amigo. Libera attention. |
| **GO mínimo (POC validador 12-20h, não 8 semanas)** | 35% | Meu favorito. Validação dura *antes* do build. Detalho na seção V. |
| **Algo que não modelei (parceria, outra forma)** | 10% | Sempre dou peso a unknown unknowns |

Tentative: eu **não recomendaria GO total**. Eu recomendaria GO mínimo precedido por validação empírica concreta (não top-down) — que é diferente da resposta condicional otimista das research individuais. As researches estão certas dentro do seu escopo; elas falham em integrar o *contexto Breno* (4 projetos concorrentes em fragilidade).

---

## II. D-STACK — Confirm or Pivot?

### The Case for Confirming (steelmanned)

O sub-agent T fez um trabalho cuidadoso e concluiu CONFIRMAR Next.js + Supabase + Inngest + Resend + Haiku 4.5 + LlamaParse, com 7 ajustes táticos. Os argumentos são todos válidos: stack que o Breno conhece, free tier real para volume estimado, custo operacional gerenciável em $25-40/mês, sem unknown unknown técnico após research, alta produtividade solo-dev. A pesquisa é honesta — flagrou que o custo IA é 2-4x maior do que a arch V1 estimou e ainda assim manteve viabilidade.

A pesquisa comparativa global adiciona que pgvector + Postgres FTS portugues é arquitetura *mais avançada* do que Mercell (player Nordic líder), e que a stack toda está 75% alinhada com state-of-the-art. Os gaps identificados (OCDS export, API pública) são *features de produto futuro*, não dívida técnica fundacional.

Outside-view: para solo-dev em B2B SaaS BR com timeline 8 semanas, a regra de Dan McKinley "Choose Boring Technology" recomenda exatamente um stack como esse.[7] Next.js + Supabase é boring (no bom sentido), bem documentado, com comunidade ativa, com fallbacks claros se algo der errado.

### The Case Against (steelmanned harder)

**Argumento 1: "Stack que o Breno conhece" vs "stack que é certo".**

A pergunta certa não é "esse stack funciona?" — funciona, obviamente. A pergunta certa é: *será que o Breno está escolhendo essa stack porque é objetivamente a melhor, ou porque é a que ele já sabe?* Isso é o que Cal Newport chama de "tool selection by inertia" e é particularmente perigoso em solo-dev porque ninguém empurra contra. O contra-factual: se o Breno fosse um dev Python sênior, ele escolheria FastAPI + Supabase + Redis + Celery? Quase certamente. Funcionaria tão bem ou melhor? Provavelmente.

O ponto não é "deveria ter sido Python". É que "stack que eu conheço" não é critério arquitetural — é critério de produtividade. Os dois não precisam coincidir. E quando coincidem, devemos questionar.

**Argumento 2: A complexidade composta dos 7 ajustes táticos.**

A research técnica recomenda confirmar a stack com *7 ajustes*: LlamaParse + Docling fallback desde dia 1, HNSW (não ivfflat), halfvec, batch API + prompt caching obrigatórios, two-tier model strategy, reordenar fontes (API antes de scraper), Megasoft investigation. Cada um é razoável isoladamente. Juntos, eles representam *já* uma complexidade arquitetural não-trivial para solo-dev no MVP. Há um efeito perverso aqui: cada "ajuste tático" parece pequeno, mas a soma agita o cronograma 8 semanas em direção a algo mais perto de 12-16 semanas — exatamente porque cada um introduz uma dependência nova (Docker container Docling, learning curve halfvec, batch API queue management, ETL OCDS, etc.).

Steelman do contra: existe uma alternativa drasticamente mais simples que ninguém considerou — **Python + Flask/FastAPI + SQLite + dramatic-keep-it-simple**. Postgres FTS portugues virar SQLite FTS5 portugues (sim, existe e funciona). pgvector virar sqlite-vec (sim, existe). Inngest virar APScheduler local. Resend mantém. Vercel vira Fly.io single container. Custo: $5/mês. Complexidade: dramaticamente menor. Por quê isso não foi sequer considerado na research?

Resposta provável: porque Breno não conhece Python web bem. Que é argumento legítimo de produtividade, mas não argumento técnico. Estou apenas notando que o steelman existe e foi ignorado.

**Argumento 3: O custo IA é uma red flag camuflada.**

A research técnica honestamente flagrou: o custo Haiku 4.5 é 2-4x maior que a arch V1 estimou. Subiu de $15/mês para $25-40/mês. Tudo bem, ainda cabe no budget. Mas: o que isso revela é que a arch V1 estava *errada por um fator de 2-4x*. Se errou aqui, onde mais errou? "Sem unknown unknown técnico após esta research" é claim forte; o histórico empírico é que para *cada* coisa que pesquisamos cuidadosamente, descobrimos algo que faz o estimate dobrar. Trigger.dev self-host, Docling para 100% dos editais quando LlamaParse free estourar, Megasoft API que ainda não foi confirmada... esses todos podem dobrar o custo de novo se algum sair errado em produção.

**Argumento 4: Inngest 5 concurrent steps é restritivo de uma forma que não está pricificada.**

A research técnica calcula 13.5-18.5k execuções/mês contra limite de 50k, 2.7x folga. Bom. Mas o limite de 5 concurrent steps é diferente — ele restringe *paralelismo*, não volume. Em um pipeline de enrich edital (download → parse → resumir → embed → persist → match) com 6 steps, 5 concurrent steps significa que se 100 editais chegam ao mesmo tempo (publish day batch da segunda-feira), eles processam serialmente em groupings de 5, causando lag visível. Não trava nada — só faz o usuário esperar mais. Para um produto cujo USP é "alerta em 1h após publicação", isso é problemático.

### Tentative Verdict — D-STACK

Aqui eu sou *menos* dissidente que em D-GO. A stack é razoável condicional à decisão de construir. Probabilidades:

| Caminho | Probabilidade subjetiva |
|---------|------------------------|
| Confirmar stack original com os 7 ajustes (recomendação da research) | 55% |
| Confirmar mas eliminar 3-4 dos 7 ajustes (manter MVP mínimo, deixar OCDS/Docling/two-tier para V2) | 25% |
| Pivotar para stack mais boring (Python/Flask + SQLite single-container) | 10% |
| Stack mista — Next.js frontend + Python worker para parsing/IA | 10% |

Tentative: **confirmar com 4 ajustes (não 7)**. Defenda LlamaParse + halfvec + HNSW + reordenar fontes. Defira para v2: Docling fallback, two-tier model, Megasoft investigation, OCDS export. O ponto é que a research recomendou implementar *tudo* na fase MVP — o que pune o cronograma. Deixe v2 para v2.

---

## III. D-PRODUTO — Productize, Personal-Only, or Discontinue?

### The Case for "Productize" (steelmanned)

A research-mercado faz o case razoavelmente: gap regional confirmado, TAM/SAM viável, ARPU R$99 / CAC R$50-80 / LTV/CAC 13-20x, payback <2 meses, parceria SEBRAE-DF/FIBRA disponível, 200-500 contas pagantes em 24m é realista. A research técnica entrega stack que escala até 100k editais no Pro $25. A regulatória mostra compliance manejável (R$2-5k advogado + 25-35h dev é o teto, não há blocker estrutural).

Em 90-180 dias pós-MVP, se você tiver (a) amigo + 4-5 fornecedores DF pagando R$50-99, (b) churn <10% em 90 dias, (c) NPS 50+, (d) canal SEBRAE-DF abrindo conversa — é razoável produtizar. O downside é limitado (descontinuar custa zero), o upside é R$240-600k ARR em 24m.

### The Case Against (steelmanned harder)

**Argumento 1: "4 sinais data-driven" é puramente delay tactic disfarçado de framework.**

O critério proposto da research é: "decidir em 07/2026 baseado em (a) #contas pagantes, (b) churn, (c) NPS, (d) canal SEBRAE-DF". Isso *soa* científico. Mas observe os problemas:

- *Sinal (a)*: N=5 fornecedores DF é statistical power zero. 5 amigos do amigo pagando R$50 cada por mês 1-3 é ruído pessoal, não sinal de mercado.
- *Sinal (b)*: Churn em 90 dias com N=5 é matematicamente indefinível (perda de 1 = 20% churn = "produto morto", perda de 0 = 0% churn = "PMF" — variância extrema).
- *Sinal (c)*: NPS é proxy famosamente ruído em N pequeno. Pesquisas (Reichheld, Schneider) mostram que N<100 NPS é estatisticamente sem sentido.[8]
- *Sinal (d)*: "Canal SEBRAE-DF abrindo conversa" é binário e não-quantitativo — é exatamente o tipo de "sinal" que sempre se cumpre porque você pode sempre achar *alguém* no SEBRAE-DF disposto a tomar um café.

O framework de 4 sinais, em prática, vai sempre dar "verde" se você quiser que dê verde — porque os critérios são vagos o suficiente para acomodar. Isso é o oposto de data-driven. É a-decision-rationalized-as-data-driven.

**Argumento 2: Sunk cost de 100-240h vai distorcer a decisão de 07/2026 inevitavelmente.**

A psicologia aqui é cristalina e a literatura é unânime.[9] Em 15/Jul/2026, o Breno terá investido 100-240h no projeto. Mesmo se os sinais forem fracos, a probabilidade de ele *killar* o projeto é baixa — não porque ele é fraco, mas porque humanos são humanos. Os argumentos racionais ("já invisti tanto, vou só mais 4 semanas pra ver", "tá perto de funcionar", "outras coisas piores foram resgatadas") vão aparecer. Eu vi isso *centenas* de vezes em projetos pessoais de devs talentosos, incluindo os meus.

A defesa contra sunk cost não é "ser mais disciplinado". É **pre-commit a um kill criterion específico, falsificável, e contratualmente difícil de revisar**. Algo como: "se em 14/Set/2026 (60 dias após MVP) eu não tiver 3 fornecedores DF *que não são amigos meus* pagando R$50+ por 30+ dias consecutivos, eu descontinuo, ponto. Sem revisão. Sem 'mais uma semana'. Kill irrevogável." Isso é radicalmente diferente do framework "4 sinais" e radicalmente mais honesto.

**Argumento 3: O SOM 200-500 é hopium camuflado de cálculo.**

Eu releio a research-mercado e o cálculo bottom-up é: funil 5.000 visits/mês → 250 free signups → 30 ativações → 15 pagos → 12 retidos. Multiplica por 24 meses ajustado por churn = 200-500 base. OK. Onde vem os 5.000 visits/mês? Da combinação SEBRAE-DF + LinkedIn organic + indicação + SEO + Google brand. Esses canais juntos *já* assumem que (a) a parceria SEBRAE-DF foi fechada, (b) o Breno está produzindo conteúdo regularmente, (c) os primeiros 15 pagantes recomendam ativamente, (d) o SEO de 6 meses paga off. Cada uma dessas é uma condição probabilística — multiplique-as e a probabilidade conjunta é talvez 25-35%.

Em outras palavras: 200-500 contas em 24m é o *ramo otimista da distribuição condicional* nessas pre-condições. A research apresentou como "realista" o que é mais honesto chamar de "otimista-com-condições". O genuinamente realista, dado o outside view de classe 4 (hyper-regional sem capital, bimodal), é mais como 80-150 contas — o cenário "conservador" da research virou realista, e o "realista" virou otimista.

**Argumento 4: A pergunta nem deveria ser "produtizar regional" — deveria ser "ou se mudar para outra coisa".**

A research lista 3 opções: produtizar, pessoal-only, descontinuar. Falta uma quarta opção que ninguém considerou: **transformar o aprendizado em conteúdo + serviço**, sem virar SaaS. Configurando: o Breno aprendeu deep sobre PNCP, Lei 14.133, scraping ético, OCDS, dados.df.gov.br. Esse conhecimento vale algo. Posicionando como consultoria de "monitoramento de licitações DF" (serviço, não produto), o Breno poderia atender 5-10 fornecedores DF a R$500-1500/mês de serviço (não R$99 produto) — receita comparável com 1/10 do effort de manter SaaS B2B com churn 6%. E isso resolve simultaneamente o problema do amigo (que vira primeiro cliente serviço).

Esta opção não está em nenhuma das researches. Eu suspeito que isso ocorre porque o framing original era "construir SaaS" — e uma vez que você frame, você não escapa.

### Tentative Verdict — D-PRODUTO

| Caminho em 07/2026 (assumindo MVP existir) | Probabilidade subjetiva |
|---------|------------------------|
| Produtizar formalmente (R$2-5k advogado, ToU, pricing) | 20% |
| Manter pessoal-only + amigo + 2-5 fornecedores informalmente | 35% |
| Descontinuar (kill irrevogável) | 25% |
| Pivotar para serviço/consultoria (não SaaS) | 10% |
| Status incerto / sem decisão tomada (mais provável que admito) | 10% |

Tentative: **a decisão D-PRODUTO real não deveria ser tomada em 07/2026 baseada em 4 sinais vagos. Deveria ser pré-committada AGORA (15/Mai/2026) com um kill criterion falsificável**. Algo como: "Se em 14/Set/2026 eu não tiver 3 paying customers que não são amigos meus, kill irrevogável. Se eu tiver 3-5, mantenho pessoal-only + recoloco esforço em Tocks/Bretda. Se eu tiver 6+, considero produtizar com revisão jurídica."

O ponto é remover a discrição futura. Discrição futura é onde sunk cost vive.

---

## IV. Things That Bother Me About This Whole Project

Quatro coisas que não cabem limpinhamente em nenhuma das três decisões mas que me incomodam o suficiente pra registrar:

**1. Orion (orchestrator) liderou a research, definiu hipóteses, e está escrevendo síntese.** Isso é severa estrutura de anchoring. A H1=85%, H4=70%, H9=92% — todos esses números *aumentaram* da hipótese inicial para a confidence final. Isso é exatamente o que esperaríamos de uma research conduzida por quem tem stake na decisão de prosseguir. Aliás — eu sou um agente também, escrevendo essa dialética, e meu prompt foi explicitamente "não leia o v0 do Orion". Eu suspeito que a razão da instrução é exatamente essa: o Breno percebeu que a v0 do Orion pode ter o anchoring problem. Esse é um sinal saudável do Breno. Mas o mesmo problema vai persistir nas decisões pós-build se nada mudar.

**2. Os números de confidence (H1=85%, H4=70%, H9=92%) feels like decoration.** Em forecasting calibrado, "85% confidence" significa que se você fizer 100 predictions desse tipo, 85 acertam. Isso é predictivo, falsificável, e tem uma estrutura de feedback. As confidence numbers nas researches não têm essa estrutura — ninguém vai olhar para H1=85% em 6 meses e verificar se o PNCP de fato cobriu 80% do volume. Sem essa estrutura, números viram decoração — sinal de "estou sendo rigoroso" sem o accountability que rigor exige.

**3. "A janela de IA está fechando" é o tipo de urgency framing que está errado 80% das vezes.** Eu prefiro framings de tipo "se eu não fizer agora, em 12 meses ainda terei a opção mas pior" (verdadeiro mas low-stakes) ao invés de "se eu não fizer agora, a janela fecha" (raramente verdadeiro). Mercados de govtech regional Brasil não fecham. Eles ficam latentes, crescem devagar, oferecem oportunidades a quem chega em qualquer momento. A urgência aqui é fabricada — e fabrica-se urgência geralmente para evitar o desconforto da deliberação real.

**4. WhatsApp differentiation é defensável hoje mas comoditiza em 6 meses.** Mercell pode lançar canal WhatsApp/Telegram a qualquer momento. Effecti está com 150 funcionários e provavelmente já tem isso na backlog. Licitei tem R$3,5M e Microsoft sponsor. A vantagem narrativa de "WhatsApp regional" tem shelf-life provável de 6-12 meses, não 24-36. Construir moat em cima de feature de canal que é trivialmente copiável é construir em areia movediça.

---

## V. What I Would Actually Do If I Were Breno

Eu seria explicito porque vagueza aqui equivale a indecisão.

**Passo 1 (próximos 7 dias, antes do gate D-GO 22/Mai):** Gastar **8 horas** em validação empírica concreta — não top-down, não modelagem, *real*. Especificamente:

- **2h** — POC manual da PNCP API: `curl` com filtros UF=DF + IBGE=5200175 (Águas Lindas), exportar 30 dias de licitações, contar quantas são "real" (não dispensa pequena) e quantas seriam *relevantes para o amigo* (com base nos CNAEs/keywords dele). Se o número for ≥10/mês de licitações relevantes, há substrato. Se for ≤3/mês, não há volume mesmo para uso pessoal — *kill antes de começar*.

- **2h** — POC manual de Haiku 4.5 com 3 editais reais do PNCP. Mostrar resumo bullet 5-8 para o amigo. Pergunta direta ao amigo: "Esse resumo te economiza 15 minutos versus ler o PDF? Você pagaria R$50/mês por receber isso automaticamente todo dia?". Se sim, GO mínimo. Se "não sei", NO-GO ou pivot pra consultoria.

- **2h** — Ligação ou reunião presencial com 3 fornecedores DF (não amigos do amigo): SEBRAE-DF tem grupos abertos, FIBRA também. Perguntas: "O que você usa hoje?", "Quanto paga?", "Quanto pagaria por X?". Se 2/3 disserem "eu já uso Effecti, tá bom" ou "eu uso PNCP direto, tá bom" — NO-GO. Se 2/3 disserem "eu uso manual e isso me mata" — GO mínimo.

- **2h** — Configurar Sollicita ou Alerta Licitação (R$30-45/mês) para o amigo, com keywords curadas. Esperar 14 dias e perguntar: "Está te servindo?". Se sim, *o problema do amigo está resolvido* e você acabou de economizar 100-240h. Se não, isso *é* a evidência de gap que justifica construir.

**Esses 8h são pre-committed.** Se ao final eu sentir que o resultado é ambíguo, eu *não* construo — porque ambiguidade após 8h de validação direta significa que o sinal é fraco.

**Passo 2 (semanas 1-2 se passar do gate):** Build mínimo absoluto. PNCP API + email digest + 1 perfil amigo + LP placeholder. *Não* OCDS, *não* Docling, *não* two-tier model, *não* WhatsApp. Apenas: "todo dia 8h o amigo recebe email com 5-15 licitações DF/Águas Lindas relevantes". 30-40 horas. Se o amigo usa diariamente por 21 dias consecutivos e relata ≥2 oportunidades "que teria perdido", continua. Se não, *kill irrevogável*.

**Passo 3 (semanas 3-8 condicional ao Passo 2 ter sinal):** Build expand para PWA + chat PDF + WhatsApp. Mas só se Passo 2 atingiu o critério.

**Passo 4 (14/Set/2026, pre-commit):** Kill criterion irrevogável conforme Seção III.

**Esse plano é diferente do plano implícito da research por uma razão central: ele *valida antes de construir* em vez de construir antes de validar.** A research, mesmo bem-intencionada, sequencia: build MVP 8 semanas → ver se amigo usa → decidir produtizar. Eu inverteria: validar com amigo + 3 não-amigos (8h) → build mínimo 30h → validar 21 dias com amigo → expandir se sinal.

Custo total no cenário pessimista (kill após Passo 1): 8h. Custo no cenário moderado (kill após Passo 2): 40h. Custo no cenário otimista (expandir): 80-120h. Compare com 100-240h do plano original.

---

## VI. Probabilistic Forecast (commitments)

Aqui está minha pele no jogo. Predições falsificáveis, verificáveis em datas específicas. Se estiver errado, estarei errado *publicamente*.

| Predição | Probabilidade | Data verificação | Como verificar |
|----------|---------------|------------------|----------------|
| **P1** — Amigo usa o produto diário por ≥30 dias consecutivos | 50% | 2026-09-15 | Logs uso / pergunta direta |
| **P2** — MVP shippado (qualquer escopo deployável) por 2026-08-15 | 60% se Breno decidir GO; 0% se NO-GO | 2026-08-15 | Vercel URL ativa |
| **P3** — ≥1 paying customer não-amigo até 2026-09-15 | 18% | 2026-09-15 | Stripe / pagamento confirmado |
| **P4** — ≥10 paying customers até 2026-12-15 | 8% | 2026-12-15 | Stripe count |
| **P5** — ≥50 paying customers até 2027-05-15 | 3% | 2027-05-15 | Stripe count |
| **P6** — ≥200 paying customers até 2028-05-15 | 2% | 2028-05-15 | Stripe count (SOM realista da research) |
| **P7** — Breno em 2026-12-15 acha que deveria ter gasto as 100-240h em Tocks/Bretda | 55% | 2026-12-15 | Auto-avaliação honesta |
| **P8** — Breno realmente faz o kill irrevogável em 14/Set/2026 se sinal fraco | 30% | 2026-09-14 | Decisão observada (não auto-reportada — observação externa) |
| **P9** — Parceria SEBRAE-DF/FIBRA fechada (qualquer formato — workshop, co-marketing, integração) até 2026-12-15 | 12% | 2026-12-15 | Evidência documentada |
| **P10** — Licitei ou Effecti lançam "modo regional DF" até 2026-12-15 | 18% | 2026-12-15 | Observação landing page |
| **P11** — Tocks ou Bretda têm um "incidente caro" (perda >R$5k) entre 22/Mai e 14/Set que poderia ter sido evitado com mais attention do Breno | 35% | 2026-09-14 | Avaliação retrospectiva |
| **P12** — Custo operacional real do MVP excede $40/mês em algum momento dos primeiros 90 dias | 45% | 2026-08-15 | Faturas Supabase + Anthropic |
| **P13** — Em 2027-05-15, o projeto está em estado "lifestyle solo" (5-30 customers, R$3-10k MRR, sustentável mas não escalável) | 22% | 2027-05-15 | Estado observado |
| **P14** — Em 2027-05-15, o projeto está dead/dormente | 50% | 2027-05-15 | Observação |
| **P15** — Em 2027-05-15, o projeto pivotou (modelo, escopo ou produto significativamente diferente) | 18% | 2027-05-15 | Comparação com escopo atual |

Notar que essas probabilidades não somam a 1 nas predições disjuntas porque os eventos não são mutuamente exclusivos. P13+P14+P15 = 90%, deixando 10% para "ainda é o produto original em escala razoável + cresceu" — essa é minha probabilidade implícita de "sucesso conforme definido".

**Calibration check:** se eu estiver bem calibrado, 50-65 das minhas 100 predições próximas anuais devem se realizar dentro do range 50-65%. Especificamente sobre este projeto: se P1 (50%) se realiza, isso é fraco update positivo; se P6 (2%) se realiza, isso é update massivo de que eu estou subestimando o Breno + o projeto.

---

## Conclusão (porque toda dialética precisa de uma — ainda que eu queira deixar você desconfortável)

Eu acabei mais negativo do que a research v1 de Orion seria. Talvez eu esteja errado. Algumas razões pelas quais eu poderia estar errado:

- Eu *over-weighted* o outside view e *under-weighted* fatos específicos deste projeto (alta proficiência Breno, AIOS framework como produtividade multiplier, regulatório especialmente favorável).
- Eu *under-weighted* o que o próprio Breno valoriza em "projeto cívico + aprendizado" — esse pode genuinamente valer 100-240h pra ele de uma forma que eu não consigo modelar.
- Eu *over-fitei* no failure mode OpenTender.eu — esse projeto tem ICP fornecedor pragmático declarado, não academic/transparency-only.

Tentativamente concluo:

- **D-GO:** GO mínimo (Passo 1 de 8h validação + Passo 2 de 30-40h build) ao invés de GO completo (8 semanas). *Não* NO-GO total — o downside é limitado o suficiente para justificar exploração calibrada. Recomendação: 35% confidence.
- **D-STACK:** Confirmar com 4 ajustes (não 7). Defer OCDS export, Docling fallback, two-tier model, Megasoft para v2. Recomendação: 75% confidence.
- **D-PRODUTO:** Pre-commit a kill criterion irrevogável agora (não em 07/2026 com 4 sinais vagos). Recomendação: 80% confidence.

Mas check yourself se os argumentos que eu *não* considerei são:
1. AIOS framework realmente reduz cost de build em 50%+ vs solo-dev typical (então 8 semanas vira 4 semanas e os meus comparáveis ficam errados);
2. Existe um valor de marca/posicionamento pessoal (Breno como "o cara que entende govtech regional") que não tem ROI direto em receita mas tem opção real downstream;
3. O canal SEBRAE-DF/FIBRA é genuinamente unique e não-comprável, e fechar esse canal sozinho pode ser worth-it pelo network effect downstream.

Se 2 dos 3 estiverem corretos, eu estaria material errado. Eu rastrearia o desfecho.

---

## Fontes

[1] Tetlock, P. & Gardner, D. (2015). *Superforecasting: The Art and Science of Prediction*. Crown. Capítulo 4 sobre outside view vs inside view.
[2] Pesquisa Distrito State of SaaS LatAm 2024-2025; ProfitWell churn benchmarks B2B SMB <$50/mês ticket.
[3] research-tecnica-v1.md (T1-T6) deste projeto.
[4] research-regulatoria-v1.md (R1-R5) deste projeto.
[5] research-mercado-v1.md (M1-M6) deste projeto.
[6] Newport, C. (2016). *Deep Work*; Larson, W. (2019). *An Elegant Puzzle: Systems of Engineering Management*. Capítulos sobre context switching cost.
[7] McKinley, D. (2015). "Choose Boring Technology." mcfunley.com/choose-boring-technology
[8] Reichheld, F. (2003). "The One Number You Need to Grow." *Harvard Business Review*; críticas modernas em Schneider et al. (2008) sobre N pequeno.
[9] Arkes, H. & Blumer, C. (1985). "The psychology of sunk cost." *Organizational Behavior and Human Decision Processes*; replicações modernas em Kahneman (2011), *Thinking Fast and Slow*.

*— Scott Alexander, embodied, sem ler v0 do Orion, 2026-05-15*
