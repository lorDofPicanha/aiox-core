# Cynefin Classification — Buscador Licitações 3 D-Decisions

*Embodied: Dave Snowden, Cynefin framework lens*
*Date: 2026-05-15*
*Para: Breno (decision-maker), copy ao Orion (synth author)*

---

## 0. Quick refresher: why Cynefin matters here

Antes de entrar nos vereditos, uma postura. Frameworks como Cynefin **não te dão a resposta** — te dão o **protocolo certo para descobrir a resposta**. E o erro mais caro em projeto novo não é decidir "errado"; é aplicar o **protocolo errado**. Se você trata um problema Complex como se fosse Complicated (planeja exaustivamente, escreve PRDs, define thresholds), você compra a sensação de controle e paga em surpresas brutais. Se você trata um problema Complicated como se fosse Complex (probe-sense-respond infinito), queima budget em experimentos que poderiam ser resolvidos lendo a documentação.

A síntese dialética v1 do Orion é um documento competente — mais competente do que 90% do que se vê no mercado. Mas tem **um defeito estrutural**: ela trata as 3 decisões como se vivessem no **mesmo domínio Cynefin** e aplica o **mesmo protocolo** a todas (análise, condições, thresholds, gates). Isso é o que eu chamo de *category error*. As 3 decisões vivem em domínios diferentes. Tratá-las uniformemente é o pecado original.

Os 5 domínios, rapidamente:

| Domínio | Cause-effect | Protocolo | Tipo de practice |
|---------|--------------|-----------|------------------|
| **Clear/Obvious** | Conhecido, estável | sense → categorize → respond | Best practice |
| **Complicated** | Conhecível com expertise | sense → analyze → respond | Good practice (expert-led) |
| **Complex** | Conhecido apenas retrospectivamente | **probe** → sense → respond | **Emergent practice** (safe-to-fail) |
| **Chaotic** | Sem padrão claro | act → sense → respond | Novel practice (estabilizar primeiro) |
| **Confused/Disorder** | Não se sabe em qual domínio se está | Reduzir para domínio conhecido | — |

O perigo maior é o **boundary** — a fronteira invisível entre Complicated e Complex. É lá que projetos morrem porque alguém usou Gantt chart onde precisava de probe-sense-respond.

Naïve question 1 que Breno deveria se fazer antes de qualquer coisa:

> **"Se eu não soubesse de antemão como vai dar certo, eu saberia o que fazer amanhã?"**

Se a resposta for "sim, eu faria X, Y, Z em ordem" → você está em Complicated. Se for "depende do que eu aprender com a primeira tentativa" → você está em Complex.

---

## 1. D-GO — Construir MVP / Não construir?

### Cynefin classification: **Boundary entre Complicated e Complex, com a maior parte do peso em Complex**

A pergunta "devo construir o MVP" parece Complicated à primeira vista. Tem custos auditáveis (100-240h de Breno). Tem alternativa explícita (Tocks/Bretda recebem essas horas). Tem reversibilidade alta. Em modelo analítico-clássico, isso parece um problema de **decision analysis** — montar EV, sensitivities, decision tree, escolher.

Mas olhe mais de perto. O que está sendo decidido não é "construir o software" — software é Complicated (engenheiros sabem como fazer search híbrida BM25+vector com pgvector; isso está documentado, expertizável). O que está sendo decidido é:

- **Vai ter PMF?** — Complex (PMF é propriedade emergente, só conhecida retrospectivamente)
- **Vai consumir attention de Tocks/Bretda?** — Complex (dinâmica de attention solo-dev sob 4-5 projetos simultâneos é não-linear, emergente)
- **Vai virar projeto-gaveta?** — Complex (depende de feedback do amigo, do mercado, de coisas que não sabemos hoje)
- **Vai abrir janela de aprendizado em govtech?** — Complex (learning value é emergente)

Os elementos Complicated da decisão (stack viável? regulatório OK? volume realista?) já foram **respondidos** pela research técnica/regulatória. Aqueles eram problemas conhecíveis. Foram resolvidos. O que **resta** decidir é tudo o que vive em Complex.

### Diagnosis: tratamento errado pelo Orion?

**Sim. Orion tratou D-GO como Complicated.**

Olhe a estrutura do veredito:

> **🟢 GO — com 5 condições explícitas e timebox rígido** (C1+C2 hard, C3+C4+C5 soft)

Isso é a assinatura de pensamento Complicated:
- Lista de condições com thresholds binários
- Hard vs soft pre-conditions
- Auditabilidade explícita
- "Sprint 1.5 dedicada para A2+A4+A5+A6"
- Roadmap fásico de 12 semanas

Esse é exatamente o **protocolo errado para Complex**. Em Complex, você **não sabe** quais variáveis importam até depois de mexer no sistema. Definir 5 condições upfront é apostar que você adivinhou as 5 mais importantes — mas a literatura empírica em startups (Sarasvathy "Effectuation", Reis "Lean Startup", Ries em forma destilada) é unânime: você quase sempre erra as variáveis críticas no início.

Statement provocativo que contradiz Orion diretamente:

> **C5 ("timebox 90 dias até amigo usar diariamente + 3 oportunidades") não é um critério de sucesso — é uma confissão de que não sabemos como medir sucesso em Complex.**

Em outras palavras: se você precisa esperar 90 dias para saber se funcionou, isso É o experimento. Não é uma "soft-condition". É a fase inteira de probe-sense-respond. Chamar isso de "soft-bloqueante (governance)" é mascarar um problema Complex como se fosse uma régua Complicated.

Onde Orion acertou: as condições C2 (ToU footer DF) e C4 (mascaramento CPF) **são** Complicated — questões legais auditáveis com resposta sim/não. Essas merecem o tratamento que Orion deu.

Onde Orion errou: C1 (Águas Lindas publica no PNCP?), C3 (Haiku qualidade?), C5 (amigo usa?) são, na verdade, **probes** disfarçados de gates. C1 é um probe técnico (5 minutos de curl resolvem). C3 é um probe ainda menor (uma única API call). C5 não é um gate — é **o produto inteiro tentando viver**.

### Recommended protocol

**Tratar D-GO como decisão de boundary com dois sub-protocolos:**

**Sub-protocolo A (parte Complicated — 1 dia):**
- C2 e C4 são auditáveis em 1-2h: faça e marque.
- Decisão analítica clássica: "Tocks/Bretda têm capacidade para 10-15h/sem de attention reduzido durante 60-90 dias?" → essa pergunta é Complicated, tem resposta auditável via checkpoint semanal das métricas dos outros projetos.
- Se Tocks pré-PIX virar EMERGÊNCIA simultânea com Bretda restore híbrido → resposta auto-evidente.

**Sub-protocolo B (parte Complex — 30 dias):**
- **Pare de querer "decidir" D-GO antes de probar.** A pergunta "devo construir o MVP de 10-12 semanas?" é mal formada. A pergunta certa é: "Quanto eu posso aprender em 30 dias gastando o mínimo, antes de comprometer com a build de 10-12 semanas?"
- Substituir Sprint 1 (validação técnica em código) por **uma probe phase de 30 dias** que opera o serviço **manualmente** (concierge MVP) para o amigo. Sem código. Sem stack. Sem Inngest. **Curl PNCP + spreadsheet + WhatsApp.**

Naïve question 2:

> **"Se você passasse 30 dias servindo o amigo manualmente, copiando licitações relevantes do PNCP para um spreadsheet e mandando WhatsApp dele 1x/dia — o que você aprenderia que nenhuma pesquisa pode te dizer?"**

Resposta sincera: tudo o que importa. Você descobriria (a) se o amigo realmente abre o WhatsApp, (b) se ele responde com "vou nessa" ou ignora, (c) quais filtros realmente importam (CNAE? valor? modalidade? localização exata?), (d) se 1x/dia é frequência certa ou se ele queria 3x/semana, (e) se o pain point real é "achar licitação" ou "decidir qual ir". Tudo isso é Complex — só sai do contato com a realidade.

### Safe-to-fail experiments (Complex domain — 30 dias antes de qualquer código)

Cinco probes paralelos, todos cheap, todos reversíveis, todos geram informação:

1. **"Concierge manual 30 dias"** — Breno passa 1h/dia (não 10h/sem) fazendo busca manual no PNCP + ComprasGov + portal Águas Lindas. Manda resumo via WhatsApp ao amigo 1x/dia. Custo: 30h ao longo de 30 dias. Sinal lido: amigo abre? responde? menciona alguma? **Se amigo ignora 7 dias seguidos, o produto inteiro morreu — você acabou de economizar 240h de build.**

2. **"Friend's friend test"** — Pedir ao amigo para mostrar a ferramenta-spreadsheet-WhatsApp para 2 outros fornecedores DF/Águas Lindas. Custo: 0h Breno, 1h amigo. Sinal lido: outros fornecedores pedem para entrar? O amigo se sente confortável recomendando? Isso é o teste de **transmissibilidade do valor** que research de mercado não te dá.

3. **"PNCP empirical probe"** — 30 min de curl. Vê se Águas Lindas-GO publica realmente. Não precisa de Sprint 1 inteira. Isto é Complicated, não Complex — resolve hoje. (Aqui Orion acertou em escopo mas errou em tamanho — gastou Sprint 1 onde 30 min bastam.)

4. **"Haiku qualidade single-shot"** — 1 edital real, 1 API call, 5 min de análise qualitativa Breno + amigo. Sinal lido: amigo entende o resumo? Acha confiável? Se não, descubra antes de codar pipeline LLM.

5. **"O dia em que perdi licitação"** — Pedir ao amigo para enumerar 3 licitações dos últimos 6 meses que ele perdeu ou poderia ter ido. Reverse-engineering: a ferramenta proposta as teria pego? Custo: 1h conversa com amigo. Sinal lido: cobertura PNCP real para o caso dele.

6. **(Bonus) "Effecti free trial"** — Amigo pega 7-day trial Effecti se disponível, comparar UX, encontrar gaps reais (não inferidos via research de mercado). Custo: $0, 2h amigo + 1h Breno. Sinal lido: o que regional adds sobre o nacional para esse fornecedor específico.

**Cost total dos 6 probes:** ~40h ao longo de 30 dias. **Comparado a 240h de Sprint 1-12.** Razão custo: 1:6.

**O que se aprende:** se 3+ probes vierem fortes (amigo usa, friend's friend ressoa, cobertura PNCP é real, qualidade Haiku basta, gaps Effecti são reais) → **aí sim** entrar em build mode. Se 2-3 vierem fracos → você descobriu Complex truth: o produto que você imaginou não é o produto que o mercado precisa. Pivot ou kill. Sem ter gastado 240h.

---

## 2. D-STACK — Next+Supabase+Inngest+Resend / pivotar?

### Cynefin classification: **Complicated (com beira muito leve para Complex em duas costuras)**

D-STACK é o caso mais limpo dos três. Cause-effect é conhecível via expertise. Stack viável para CRUD-search-LLM Brazilian solo SaaS é literatura de mercado bem cartografada. Anyone com 5 anos de Next.js + 1 ano de Postgres pode opinar com alta confiança. Não há propriedades emergentes em jogo aqui — não há "PMF de stack tecnológica" que só se conhece retrospectivamente.

As duas costuras com Complex:
1. **Adoção de OCDS schema interno** — é diferenciação narrativa, e narrativa é Complex (qual história ressoa em qual canal só se sabe testando)
2. **WhatsApp dia 1** — fosso cultural BR, e cultural fit é Complex (não Complicated)

Mas o **core** da decisão de stack (Next, Supabase, Inngest, Resend, LLM provider) é Complicated.

### Diagnosis: tratamento errado pelo Orion?

**Aqui Orion acertou. Aplicou protocolo Complicated em problema Complicated.**

A confirmação do stack com 7 ajustes táticos (A1-A7) é **exatamente** o tipo de output que se espera de expert analysis em domínio Complicated. Aria fez bom trabalho técnico, Pahlka conhecimento operacional, padrão arquitetural alinhado com state-of-the-art global. Isso é good practice (Complicated-style), não best practice (Clear-style), e é apropriado.

A única crítica menor — e steelmanned:

> **A "dúvida" entre confirmar Next+Supabase e pivotar para Astro+SQLite era falsa.** Não existia. Foi montada artificialmente para parecer rigorosa.

Em Complicated, expert opinion converge. Quando você tem stack conhecido + dev proficiente + outros projetos validados (Tocks, Bretda, Anipis usaram análogo) + custo aceitável + free tiers suficientes, **não há decisão real** a ser tomada. O exercício analítico de tese-antítese é um ritual de due-diligence, não uma deliberação.

Isso não é problema do Orion — é boa prática de governance documentar a justificativa. Mas a *naïve question* que destrava aqui é:

> **Naïve question 3: "Se eu não estivesse fazendo esse processo formal, eu seriamente consideraria pivotar pra PocketBase?"**

Resposta honesta: não. Então pare de fingir que sim. **Confirm and move on.**

### Recommended protocol

Para a parte Complicated (≈85% da decisão): **confirmar, parar de analisar, executar.** Os 7 ajustes A1-A7 são bons; incorpore-os. Não invente um Sprint 1.5 dedicada — incorpore A1+A2+A4+A5 na primeira sprint de build se ela existir.

Para as duas costuras Complex (OCDS adoption, WhatsApp dia 1):
- **OCDS:** é cheap (4-8h dev) e diferenciação narrativa. Faça, sense, ajuste. Se ninguém menciona OCDS em 30 dias, é vaidade não diferenciação.
- **WhatsApp dia 1:** é Complex porque cultural fit. Mas há probe barato: usar **WhatsApp pessoal do Breno + Twilio Sandbox** primeiros 30 dias, sem produtizar. Sense se é mesmo "fosso cultural" ou só "feature que parece BR".

**Anti-pattern a evitar:** virar o D-STACK em uma decisão grande arquitetural que exige PRD, ADRs, sign-offs. Não é. É escolha de ferramentas para um job conhecido.

---

## 3. D-PRODUTO — Produtizar / Pessoal-only / Descontinuar?

### Cynefin classification: **Complex puro. Sem ambiguidade.**

D-PRODUTO é o caso mais Complex dos três, e Orion tratou com a mesma sintaxe de Complicated. Isso é o **defeito mais sério** da síntese v1.

Por quê Complex puro:
- **PMF é propriedade emergente** — não pode ser predita de research; só é validada retrospectivamente, através do contato com mercado real
- **Network effects (partnership SEBRAE-DF, FIBRA)** — não-lineares, dependem de pessoas específicas, momentum, atribuição que só se entende com 6 meses de hindsight
- **Churn dynamics em B2B microempresa** — emergem do produto-mercado-cultura, não de modelo
- **Janela competitiva (Licitei R$3,5M Microsoft)** — depende de movimentos de terceiros que você não controla nem antecipa
- **Willingness-to-pay** — só conhecido após oferta real, com pricing real, em contexto real (não em entrevista)

### Diagnosis: tratamento errado pelo Orion?

**Sim. Aqui o tratamento foi flagrantemente Complicated em domínio Complex. É o pecado mais grave da síntese.**

Olhe a estrutura:

> **🟡 DECISÃO ADIADA PARA 2026-07-15 com 4 sinais data-driven obrigatórios**
>
> **Regra de decisão 2026-07-15:**
> - **3-4 sinais verdes** → 🟢 **PRODUTIZAR**
> - **2 sinais verdes** → 🟡 **PESSOAL+**
> - **0-1 sinais verdes** → 🔴 **DESCONTINUAR**

Isso é o sonho do gerente analítico. Threshold-based decision rule. Mensurável. Auditável. Reprodutível.

**É também a postura errada para Complex.**

Em Complex, os sinais que você lista upfront **não são** os sinais que importam ao final. O sistema vai te surpreender. Você vai descobrir que o sinal forte real é algo que não está em S1-S4 (talvez seja "amigo me convida para apresentar em reunião da FIBRA"; talvez seja "ANPD publica radar tecnológico que muda a calculadora regulatória"; talvez seja "Effecti compra um competidor regional e muda o jogo"). Tetlock chama isso de "superforecasting" — calibrar previsões; Snowden discorda mas por outra razão: **em Complex, o repertório dos sinais possíveis não é fechável upfront.**

Statement provocativo que contradiz Orion diretamente:

> **A decisão D-PRODUTO em 2026-07-15 **não vai** ser tomada com base nos 4 sinais S1-S4. Ela vai ser tomada com base em **uma coisa imprevisível** que vai emergir nos próximos 60 dias. Os 4 sinais não estarão errados — estarão **incompletos**. E pretender o contrário é narrativa de controle.**

Em outras palavras: a sintaxe "3-4 verdes → produtizar" parece científica mas é uma confissão de que se vai julgar com hindsight num momento futuro e racionalizar com referência a S1-S4. Não há mal nisso (todo mundo faz assim), mas chamar isso de "data-driven decision" é mascarar Complex como Complicated.

A consequência prática é pior: **se você fica esperando 90 dias passivamente coletando sinais, você está em modo Complicated (sense-analyze-respond). Em Complex, você precisa de probe-sense-respond ATIVO — fazer coisas para gerar sinal, não esperar sinal aparecer.**

### Recommended protocol

**Substituir "4 sinais data-driven obrigatórios em 2026-07-15" por "7 safe-to-fail experiments ativos rodando em paralelo entre 2026-05-15 e 2026-07-15".**

A diferença é fundamental:
- "Sinais data-driven" assume que sinal aparece se você esperar e observa
- "Safe-to-fail experiments" assume que **você precisa fazer coisas** que possam fracassar — e o que sobreviver te diz o que é real

Snowden: "In complex domains, **you cannot understand the system unless you probe it**. Detached observation gives you no signal at all."

A decisão em 2026-07-15 não é "produtizar / pessoal+/ descontinuar com base em score". É "quais experimentos foram fortes; amplifique-os; quais foram fracos, dampening". É **portfolio de bets paralelas**, não single binary gate.

### Safe-to-fail experiments (Complex domain — paralelos durante 60-75 dias)

Sete experimentos. Cada um:
- Cheap (≤R$200 ou ≤8h)
- Reversible (kill se ruim, dobra se bom)
- Generates information (probe ativo, não observação passiva)
- Paralelo, não serial (não esperar o resultado de um para começar o outro)

**E1 — Cold-pitch SEBRAE-DF (5h)**
- Pedir 30 min de conversa com responsável pelo Programa Compras Governamentais
- Dizer: "Tô validando um buscador regional, posso fazer 3 perguntas?"
- Sinal lido: SEBRAE-DF abre a porta (forte sinal) ou ignora (Complex morre antes de nascer)
- **Custo:** 1 email + 1 ligação + 1 reunião curta

**E2 — Pre-sell aos 4 fornecedores DF do amigo (8h)**
- Amigo apresenta 4 fornecedores DF que conhece
- Pitch: "Tô construindo X. Você pagaria R$49/mês se eu te der acesso 60d antes?"
- **Pedir 1 PIX de R$1** como sinal de comprometimento (não R$49 ainda)
- Sinal lido: zero PIX = morto; 2/4 PIX = sinal forte (Effectuation: bird-in-hand)
- **Custo:** 1 deck simples + 4 ligações

**E3 — Free-tier para 10 fornecedores não-amigos via LinkedIn (12h)**
- Post no LinkedIn: "Tô testando ferramenta regional DF/GO; primeiros 10 fornecedores que comentarem ganham 60d grátis"
- Sinal lido: 0 comentários = problem-solution misfit; 30+ comentários = sinal forte
- **Custo:** Conteúdo + tempo de moderação

**E4 — Compete with Effecti directly (4h)**
- Em 2 licitações reais do amigo nos últimos 30 dias, mostrar como Effecti reportou vs como o concierge-manual de Breno reportou
- Sinal lido: amigo prefere qual? Por quê especificamente? Detalhe o pq.
- **Custo:** 1 spreadsheet + 1 conversa

**E5 — "Audit yourself" via 1 fornecedor estranho (3h)**
- Encontrar 1 fornecedor DF que você NÃO conhece. Ligar e dizer: "Tô fazendo pesquisa, posso te perguntar como você acha licitação hoje?"
- Não vender. Apenas escutar.
- Sinal lido: histórico de pain real OR ele já tem solução boa e nem percebe pain
- **Custo:** 1 ligação cold

**E6 — Test de pricing via fake door (6h)**
- Landing page com pricing R$49/mês visível + botão "comece grátis 14 dias"
- Não construir auth. Quando clicar, abrir form Tally pedindo email + CNPJ
- Drivar 100 visitantes via LinkedIn ads R$50 budget total
- Sinal lido: conversion rate "visit → email submit"
- **Custo:** 4h landing + R$50 ads

**E7 — Probe regulatório: bater na porta da ANPD (2h)**
- Email para ANPD (canal público): "Estamos construindo agregador de licitações. Há orientação específica para tratamento de CPF residual em editais?"
- Sinal lido: resposta rápida vs silêncio. Resposta = sinaliza que ANPD considera tema relevante (acelera necessidade compliance OU diminui risco com clarity)
- **Custo:** 30 min email

**Custo total dos 7 probes:** ~40h ao longo de 60 dias + ~R$50.

**O que se aprende em 2026-07-15:**
- 5+ probes fortes (E1+E2+E3+E4 especialmente) → amplifica, vai para produtização sem hesitar
- 2-3 probes fortes → híbrido: produtiza só onde sinal está forte (ex: só DF, não Águas Lindas; ou só free + WhatsApp, sem dashboard pago)
- 0-1 probe forte → pessoal+ honesto, sem ilusão de "vai produtizar depois"

**Nenhum dos 7 sinais é S1-S4 do Orion.** S1-S4 são observação passiva ("adoção do amigo", "WTP", "churn", "SEBRAE-DF interesse"). E1-E7 são probes ativos. A diferença é o que Snowden chama *acting into the future* vs *predicting the future*. Em Complex, só acting funciona.

---

## 4. Cross-decision insight

As 3 decisões vivem em domínios Cynefin diferentes, e Orion mixou todas no mesmo protocolo:

| Decisão | Domínio real | Tratamento Orion | Defeito |
|---------|--------------|------------------|---------|
| **D-STACK** | Complicated (≈85%) | Complicated (correto) | Mínimo: "tese-antítese" foi ritual desnecessário |
| **D-GO** | Boundary Complicated/Complex (≈30/70) | Complicated (parcialmente errado) | Pré-condições C5 ("amigo usa 30d") é probe disfarçado de gate; precisa probe-phase, não Sprint 1 |
| **D-PRODUTO** | Complex puro | Complicated com gate threshold (errado) | "4 sinais data-driven em 2026-07-15" assume previsibilidade Complicated em domínio fundamentalmente emergente |

**A implicação é grande:** não há "um" deliverable certo aqui. Há **3 deliverables com protocolos diferentes**:
- D-STACK: 1 página de "stack confirmado, 7 ajustes, próximo passo build" — termina aqui.
- D-GO: 1 página de "Complicated parts auditáveis em 1 dia + 30-day probe phase com 6 experimentos" — termina depois da probe phase.
- D-PRODUTO: 0 páginas hoje. **Não existe decisão D-PRODUTO hoje.** Existem 7 probes paralelos rodando 60-75 dias, cujos resultados vão moldar o que a decisão pode sequer ser.

Statement contraditório a Orion:

> **A "Síntese Dialética v1" deveria ter sido 3 documentos curtos com protocolos diferentes, não 1 documento longo com protocolo uniforme. O fato de Orion produziu 1 só revela o viés Complicated-first do agente.**

Não é crítica pessoal — é defeito de framework. AIOS é otimizado para sense-analyze-respond. Para Complex, falta ferramental.

---

## 5. The "naïve questions" Breno should ask before next session

Três perguntas Snowden-style que reframam o landscape:

**Naïve Q1 — Sobre D-GO:**
> "Se eu não tivesse acesso a nenhuma stack — só WhatsApp, papel e PNCP no navegador — eu conseguiria entregar valor para o amigo em 30 dias?"

Se sim → essa é a fase 1, não o build. Se não → o problema é outro (talvez seja conhecimento de domínio, não software).

**Naïve Q2 — Sobre D-STACK:**
> "Se eu fosse contratado por outra pessoa para construir esse produto, eu sequer consideraria outra stack que não fosse Next+Supabase?"

Se não → para de analisar, vai construir.

**Naïve Q3 — Sobre D-PRODUTO:**
> "Quem é a pessoa específica, com nome e CNPJ, que vai pagar R$49/mês pelo serviço no dia 1 da produtização? Se eu não sei o nome dela hoje, qual é o experimento mais barato para descobrir antes de 2026-07-15?"

Esta é a pergunta que Effectuation (Sarasvathy) chama "bird-in-hand". Se Breno não pode nomear pelo menos 3 fornecedores DF/Águas Lindas que **disseram** "eu pagaria" (não "talvez eu pagaria" — explicit commitment) antes de 2026-07-15, a decisão D-PRODUTO é fantasia, qualquer que seja o veredict.

---

## 6. Anti-patterns observed na síntese v1

Anti-patterns Cynefin presentes na síntese dialética v1, listados sem rancor:

**AP1 — "Best practice" framing para Complex decisions.** Orion lista padrões globais (UNGM, ChileCompra, Mercell) como se fossem replicáveis. Em Complex, padrão de um lugar não previne falha em outro. ChileCompra é government-run; Mercell é Nordic culture; UNGM é UN scale. Brasil + DF + microempresa + WhatsApp + solo-dev é **único** — e em Complex, uniqueness importa.

**AP2 — Threshold gates para emergent properties.** "Churn <40% em 30d" parece científico mas pressupõe que churn 30d prediz churn 12m (Complicated assumption). Em Complex, retention curves emergem; cherry-picking um threshold upfront é narrativa, não decisão.

**AP3 — Detailed planning onde probe-sense-respond era necessário.** Sprint 1 / Sprint 1.5 / Sprint 2-3 / ... / Sprint 10-12 / Gate 2026-07-15 — esse roadmap é Complicated artifact. Bonito de olhar, péssimo para Complex. Probe-sense-respond não tem sprints — tem cycles de probe-pause-sense-amplify.

**AP4 — "Confidence interval" em outcomes que são retrospectively coherent.** "D-GO confidence 80%, D-PRODUTO confidence 75%" — esses números são vibes-as-data. Em Complex, não existe confidence de outcome ex-ante; existe confidence de **probe design** ex-ante. Confidence de outcome só após hindsight.

**AP5 — Cascading conditions que multiplicam fragilidade.** "Se C1 falhar → mitigação A; se C3 falhar → mitigação B" cria a ilusão de robustez. Mas em Complex, condições falham em **combinações** não predizíveis (C1+C3+C5 falham juntas por uma causa que não está nas mitigações listadas). Robustness vem de **portfolio de experimentos paralelos**, não de plano hierárquico de mitigações.

**AP6 — Saturação semântica como critério de stop em research Complex.** "5 fontes consecutivas sem claim novo → encerrar" funciona em Complicated (consenso técnico). Em Complex, **as 5 fontes podem todas estar erradas no mesmo sentido** — confirmation bias coletivo. Saturação aqui sinaliza echo chamber, não verdade.

---

## 7. The 30-day probe (concrete proposal)

**Substituir Sprint 0+1 inteiras (ou pelo menos Sprint 1) por uma probe phase de 30 dias, sem código de produção.**

**O que acontece nos 30 dias:**

**Dias 1-3 (escopo Complicated, resolve rápido):**
- C2: Breno lê ToU portal.compras.df.gov.br (1h)
- C4: regex CPF mascarado é decisão arquitetural padrão — nem precisa research, só decisão
- POC curl PNCP filtro UF=DF + IBGE Águas Lindas (30 min)
- POC Haiku 4.5 com 1 edital real (1h)
- Decisão: stack confirmado (D-STACK fechado). **Não construir ainda.**

**Dias 4-30 (escopo Complex, probes paralelos):**

| Dia | Probe | Esforço |
|-----|-------|---------|
| D4 | Iniciar concierge manual (curl + spreadsheet + WhatsApp 1x/dia) ao amigo | 1h/dia recorrente |
| D5-7 | Apresentar concierge manual a 2 fornecedores indicados pelo amigo (E1 friend's friend test) | 3h total |
| D7 | Cold-email SEBRAE-DF + LinkedIn post outreach | 4h total |
| D10-15 | Probe pre-sell 4 fornecedores (E2) + landing fake-door (E6) | 12h total |
| D20 | Conversa de aprendizado com amigo: "Que 3 licitações você perdeu em 6 meses?" (E5) | 1h |
| D25 | Probe regulatório ANPD (E7) | 30 min |
| D30 | **Sense-and-decide gate** — não threshold gate, mas conversa estruturada Breno+amigo: o que aprendi? Qual probe foi forte? Qual foi morto? | 2h |

**Output do dia 30:**
- Se 4-6 probes fortes → entrar em build mode Sprint 1 com **escopo refinado pela aprendizagem** (provavelmente diferente do que está na arch v1)
- Se 2-3 probes fortes → entrar em build mode Sprint 1 **só do subset que provou valor** (talvez só WhatsApp + PNCP, sem dashboard, sem multi-perfil)
- Se 0-1 probes fortes → **não entrar em build**. Manter como ferramenta concierge informal para o amigo (cost zero). Voltar para Tocks/Bretda full attention.

**Total cost da probe phase 30d:**
- ~40h Breno (vs 100-240h Sprint 1-12)
- R$50-200 de Ads ou tools
- 0 código de produção

**Total info gerada:** mais do que toda a research T+R+M+Global combinada, porque é informação **gerada por probe ativo no sistema real**, não informação coletada de fontes externas.

**Comparação direta vs o roteiro Orion:**
- Orion: Sprint 0 (setup) → Sprint 1 (validação técnica) → Sprint 2-3 (MVP) → Sprint 4-5 (refinamentos) → ... → Sprint 10-12 → Gate 2026-07-15
- Snowden-style: 30-day probe phase → sense → ou entrar em sprints (talvez Orion's roteiro com modificações), ou pivotar, ou kill

A diferença é que **no Snowden-style você pode kill o projeto no dia 30 tendo gasto 40h**. No roteiro Orion, você só pode kill no dia 90 (Gate 2026-07-15) tendo gasto 100-240h. Em Complex, **a opção de kill cedo** é o ativo mais valioso, e o roteiro Orion sacrifica-a em nome de "rigor".

---

## 8. Conclusão para Breno

Três recomendações, em ordem decrescente de força:

**REC 1 (alta força — Complex/probe domain):** Substitua o "Gate 2026-07-15 com 4 sinais data-driven" por uma **probe phase de 30 dias** ANTES de qualquer Sprint 1 com código. Os 6-7 safe-to-fail experiments propostos (Seção 1 + Seção 3) são o método. Custo: ~40h. Upside: pode kill ou pivotar antes de gastar 240h.

**REC 2 (média força — Complicated/expert domain):** Confirme D-STACK e pare de analisar. Next+Supabase+Inngest+Resend com os 7 ajustes A1-A7 do Orion. Mova-se. Não invente Sprint 1.5 dedicada se a probe phase indicar que o build é a coisa certa a fazer — incorpore A1+A2+A4+A5 na primeira sprint real.

**REC 3 (média força — boundary domain):** Para D-GO, separe as partes auditáveis (C2 ToU, C4 mascaramento CPF, T1 PNCP empirico) — resolva em 1 dia — das partes emergentes (vai ter PMF? amigo usa? produtiza?) — resolva via probe phase. Não trate ambas com o mesmo protocolo.

**Naïve question final, para refletir:**

> **"Daqui a 90 dias, o que vou desejar ter feito hoje? Vou desejar ter um PRD-Sprint-Roadmap detalhado? Ou vou desejar ter 7 conversas reais com fornecedores DF/Águas Lindas que não conheço?"**

Se a resposta honesta for "conversas reais" — então a research está terminada, e o próximo passo não é mais research nem PRD. É telefone, WhatsApp, e SEBRAE-DF.

---

## 9. Glossário (termos Cynefin usados)

| Termo | Definição (em uso aqui) |
|-------|-------------------------|
| **Safe-to-fail experiment** | Probe pequeno, reversível, paralelo, que gera informação independente do outcome |
| **Probe-sense-respond** | Sequência apropriada em Complex: agir primeiro (probe) → ler sinal (sense) → ajustar/amplificar/dampening (respond) |
| **Emergent practice** | Boa prática que **emerge** do trabalho no Complex, não pode ser predita upfront |
| **Boundary** | Fronteira entre dois domínios Cynefin onde o tratamento errado é mais custoso |
| **Exaptation** | Reuso inesperado de capacidade existente em contexto novo — vetor de inovação em Complex |
| **Naïve question** | Pergunta simples que expõe framing error — a marca de Snowden |
| **Weak signal** | Sinal cedo, ambíguo, que em Complex tem mais valor que sinal forte tardio |
| **Narrative landscape** | Padrão emergente de histórias que a organização/mercado conta sobre si — sinal Complex |

---

*Fim do documento Cynefin Classification v1. Pode haver desacordo legítimo entre Cynefin e o framework analítico tradicional (Tetlock, decision analysis clássica). Esse desacordo é, em si, evidência de que o problema está no boundary — e o protocolo certo é probe-sense-respond, não vote.*

*Snowden, embodied. Anti-corporate framework, but pro-Breno.*
