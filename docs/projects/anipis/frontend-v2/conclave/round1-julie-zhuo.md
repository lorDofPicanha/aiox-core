# Conclave Round 1 — Julie Zhuo (Produto + Coerência)

**Data:** 12/Jun/2026 · **Lente:** O produto é UM só? O flow inteiro sustenta a promessa ("um caderno, uma companheira, você")? Hierarquia, consistência, craft.

---

Antes de prescrever, deixo claro o que estou diagnosticando e o que NÃO estou. Eu não estou olhando isto como "as telas estão bonitas?" — isso é trabalho do Dieter e da Uma. Minha pergunta é outra, e é a mais difícil de acertar num produto de cuidado emocional: **as partes formam um só lugar onde uma pessoa em sofrimento confia em entrar todo dia?** Coerência não é estética. Coerência é a sensação de que existe UMA mente por trás do produto, e que essa mente se importa. Quando isso quebra, a pessoa sente — mesmo sem saber nomear — e a confiança vaza.

Um aviso de honestidade vulnerável antes de qualquer nota: estou avaliando **2 telas reais buildadas (Hoje, Login)** mais uma referência Stitch (Diário) que ainda **não foi construída**, e Onboarding/Diário/Você que ainda são **placeholders**. Então qualquer julgamento de "coerência do produto inteiro" é, por necessidade, um julgamento sobre **uma promessa de 3 atos da qual só vi o segundo ato pronto**. Vou ser explícita sobre onde estou avaliando o que existe versus inferindo o que falta — porque confundir os dois seria o tipo de crítica rasa que gera retrabalho.

---

## 1. Pontos FORTES de produto/coerência

**F1 — O modelo mental "Hoje / Diário / Você" é a IA certa, e é a decisão mais inteligente do projeto.**
Isto não é um detalhe de navegação — é a tese do produto inteira codificada em 3 palavras. A maioria dos times teria caído no atrator gravitacional do SaaS: "Chat / Histórico / Configurações". Vocês resistiram. Renomear "Chat" para **Hoje** (a página aberta do caderno), "histórico" para **Diário** (a linha do tempo das páginas passadas), e enterrar todo o "sistema" em **Você** — isso é coerência no nível mais profundo, o nível da nomeação. Quando a IA de navegação *é* a metáfora do produto em vez de só hospedá-la, cada toque na tab bar reforça a promessa em vez de diluí-la. Esse é o tipo de decisão que parece óbvia depois e é rara antes. É a fundação sobre a qual o 10/10 é possível.

**F2 — A tela Hoje sustenta a promessa "página, não mensageiro" com rigor real.**
A decisão da Anipis falar em serif full-width sem bolha e sem avatar, e a pessoa responder numa bolha discreta à direita — isto não é maquiagem, é uma escolha sobre **quem é o protagonista da página**. A Anipis não é um interlocutor de chat (avatar + bolha = "app de mensagem"); ela é a voz editorial do caderno, e a pessoa é quem escreve nele. Some os timestamps, o respiro generoso entre turnos, o placeholder serif itálico "Escreva o que estiver aí dentro…" — e você tem uma tela onde cada átomo aponta para a mesma intenção. É craft. Quando olho a tela Hoje desktop, eu acredito que existe uma mente por trás dela. Isso é o teste.

**F3 — A disciplina de manter os invariantes (cor + contratos + legal) enquanto reconstrói tudo o resto é o que impede o Frankenstein.**
O mandato do founder era brutal ("nada que fez dá para aproveitar"), e o risco óbvio de um rebuild total é o caos — cada tela inventando suas próprias regras. O que vejo nos docs é o oposto: uma fundação tonal explícita (L0→L1→L2), verde floresta reservado SÓ para ação/marca/ativo, emotion chips com semântica fixa, tipografia de 2 vozes (Newsreader = conteúdo/Anipis, Libre Franklin = UI invisível). Isso é um **processo confiável** — um sistema que eleva até a tela mais júnior que ainda vai ser construída, porque ela vai herdar as mesmas regras. É exatamente a infraestrutura que torna a coerência *inevitável* em vez de *esperançosa*. Sem isso, o flow inteiro seria um Frankenstein. Com isso, ele tem chance de ser um organismo.

**F4 (bônus) — O disclaimer e o "precisa de ajuda agora?" persistentes mostram que o cuidado é estrutural, não decorativo.**
A ajuda de crise no header a um toque, e o disclaimer sutil sob o composer ("acompanha, não substitui acompanhamento profissional") — isso está presente na tela real, não só no doc. Num produto de wellbeing, a ética precisa ser uma propriedade do esqueleto, não um banner que alguém lembrou de colar. Está no esqueleto.

---

## 2. PROBLEMAS (severidade · incoerência/lacuna · correção)

**P1 — [BLOQUEADOR DE COERÊNCIA] O Login é de outro produto. Ele quebra a promessa antes de a pessoa entrar nela.**
Olho a tela de login e vejo um **card branco flutuante centrado** com sombra suave — o padrão SaaS genérico de 2018, o mesmo de qualquer dashboard B2B. Agora olho a tela Hoje: papel creme edge-to-edge, FLAT absoluto, zero sombra, profundidade por camadas tonais. **São dois produtos.** O doc 03 diz textualmente "FLAT absoluto (zero sombras)" e "header app: wordmark anipis. itálico" — o login viola os dois: tem sombra de card e tem o wordmark solto no canto superior esquerdo como um logo corporativo, não como a voz do caderno. Pior: o login é o **passo 1 do flow** (doc 02 §3). É a primeira impressão. Se a primeira página que a pessoa vê parece um formulário de banco e a segunda parece um caderno íntimo, a costura aparece — e num produto de confiança emocional, a costura *é* o problema. A promessa "um lugar só seu" começa a ser quebrada antes de a pessoa fazer login.
> **Correção:** Refazer o login no mesmo sistema FLAT da tela Hoje. Mata o card branco com sombra — o formulário assenta direto no creme, edge-to-edge ou num container L1 sem sombra. "Que bom te ver." em serif (bom), mas a página inteira precisa respirar como o caderno respira, não como um modal de auth. O login não é uma porta para o produto — ele *é* a primeira página do produto.

**P2 — [ALTO] "Não tem conta? Criar" e "Entrar com link mágico" no login contradizem o próprio modelo do produto e introduzem incoerência de fluxo.**
O doc 02 §3 é explícito: "Login — sem cadastro (beta fechado, credenciais pré-criadas)". A tela real mostra **"Não tem conta? Criar"** e **"Entrar com link mágico"**. Isso é uma incoerência entre a tese e a implementação — e não é cosmética. Num beta fechado, "Criar conta" leva a um beco (ou pior, a um signup que não deveria existir), e "link mágico" abre um segundo caminho de auth que ninguém especificou. Cada caminho falso é uma promessa que o produto não vai cumprir. A regra é: nunca recompense a saída ruidosa — aqui, nunca ofereça a porta que não leva a lugar nenhum.
> **Correção:** Remover ambos no contexto de beta fechado. Se houver um fluxo de convite (`/invite/[code]` existe no inventário), o único caminho secundário legítimo do login é "Tem um convite? Use seu link" — coerente com o produto. Decidir UMA forma de entrar e honrá-la.

**P3 — [ALTO · LACUNA] O Diário é a metade da promessa que ainda não existe — e sem ele, "um caderno" é uma afirmação, não uma experiência.**
A promessa é "um caderno, uma companheira, você". A **companheira** (Hoje) está construída e boa. O **você** (Você) é placeholder. Mas o **caderno** — a ideia de que existe um *acúmulo*, uma linha do tempo das suas páginas, um lugar onde voltar e ver seu próprio caminhar — esse é o coração da metáfora, e ele só existe como uma referência Stitch não-construída. Aqui está o ponto que me preocupa como produto: **a tela Hoje sozinha não é um caderno. É um chat bonito.** O que transforma "chat" em "diário" é a sensação de continuidade — de que o que escrevi ontem está guardado, de que minha jornada tem forma. Sem o Diário vivo, a pessoa não tem como sentir a diferença entre Anipis e qualquer companheiro de IA. O Diário não é "mais uma aba"; é o que prova a tese.
> **Correção:** Priorizar o build do Diário logo após o Login, antes do Você. E aplicar a heurística do diagnóstico: o card de cada dia (chip de humor + primeira linha + exercícios) precisa fazer a pessoa *querer voltar e ler*. A referência Stitch está na direção certa — chips de humor, "seu caminhar" sem gamificação — mas precisa virar produto navegável para que a coerência do flow inteiro feche. Até lá, o 10/10 é estruturalmente impossível, e isso precisa estar dito em voz alta.

**P4 — [MÉDIO · INCOERÊNCIA] O chip de humor "Bem" no topo do Hoje está órfão — não tem hierarquia, não tem affordance, não conta uma história.**
Na tela Hoje, há um chip "😊 Bem" pousado no topo esquerdo, acima da primeira fala da Anipis. Eu entendo a intenção (doc 02 §4: "mood do dia integrado no topo da página, chip emotion"). Mas como está, ele é um órfão visual: flutua sem âncora, sem rótulo do que é ("seu humor hoje"? "como você chegou"?), sem indício de que é tocável ou de que registrou algo. Para alguém que acabou de entrar, "Bem" sozinho é ambíguo — é um status? um filtro? um botão? Em produto, um elemento sem hierarquia clara nem affordance é ruído, e ruído num santuário de calma custa caro. A intenção é boa; a execução deixa a pessoa adivinhando.
> **Correção:** Dar ao chip um micro-contexto e uma posição com intenção. Ou ele é claramente "Como você chegou hoje · 😊 Bem" (com affordance de editar), ou ele se integra na primeira fala da Anipis ("Vi que você chegou se sentindo bem hoje…") em vez de pairar solto. Decidir se é informação, controle, ou conversa — e comprometer-se. Hoje ele tenta ser os três e não é nenhum.

**P5 — [MÉDIO · LACUNA] Sem onboarding construído, não existe "primeira vez" — e a primeira vez é onde o produto ganha ou perde a confiança.**
O doc 02 §3 desenha um onboarding de 6 passos pensado com cuidado real (valor antes do pedido, consent em camadas humanas, nome com significado estilo Finch, primeiro check-in). É um bom plano. Mas é só um plano. A consequência de coerência: a tela Hoje que vi começa com "Oi, Marina. Estou aqui com você" — ou seja, ela **assume** que a pessoa já passou pela costura emocional do onboarding (já deu o nome, já fez o primeiro check-in, já consentiu). Se o onboarding não existe ou não casa de tom com esse momento, a pessoa cai numa conversa íntima sem ter sido apresentada — como abrir um diário e ele já te chamar pelo nome sem você ter dito qual era. O onboarding não é um pré-requisito burocrático; é o **handshake de confiança** que torna a intimidade do Hoje aceitável.
> **Correção:** Construir o onboarding como a ponte tonal entre o Login (frio, funcional) e o Hoje (íntimo, caloroso) — é literalmente o gradiente de temperatura que prepara a pessoa. O último passo (primeiro check-in → primeira conversa) precisa desembocar SEM emenda na tela Hoje. Testar o flow inteiro Login→Onboarding→Hoje como uma única respiração, não como 3 telas que existem.

**P6 — [MÉDIO] O estado de conversa do Hoje mostra o "caso feliz" — falta ver o produto nos momentos que mais importam.**
A tela Hoje que avaliei é o caminho dourado: pessoa chega "Bem", desabafa algo leve sobre trabalho, Anipis responde com calor. Lindo. Mas o produto é de saúde emocional, e a verdade do craft aparece nos estados que **não** vi: o **empty state real** antes da Anipis falar (o doc diz "saudação calorosa, nunca menu" — preciso ver), o **estado de crise** (RED tela cheia sem motion, tijolo #8f2c1b — o teste ético mais importante do produto inteiro), o **streaming** token-a-token com layout estável, o **indicador de digitação** sereno, o **botão parar**. A coerência de um produto de cuidado não se prova no dia bom — prova-se no dia em que a pessoa digita algo assustador e precisa que o produto não a abandone nem a alarme. Não posso dar 10 a um produto cuja hora mais importante eu não vi funcionar.
> **Correção:** Buildar e trazer ao conclave os estados de verdade: empty/saudação, streaming, typing, e — inegociável — o fluxo de crise completo (RED/ORANGE/YELLOW). Sem ver crise funcionando com a mesma voz calma (não alarme vermelho), o 10/10 é fé, não evidência.

---

## 3. NOTA

### Produto / Coerência: **6.5 / 10**

**Por que NÃO é 10:** Porque um produto é o flow inteiro, não as suas melhores telas — e eu só vi a melhor terça pronta. As duas telas reais que existem revelam um craft genuíno e uma tese de produto que é, de verdade, das mais coerentes que avaliei (o eixo Hoje/Diário/Você é excelente). Mas três coisas me impedem de chegar perto do 10:

1. **A costura está visível.** O Login pertence a outro produto (P1) e contradiz o próprio modelo de fluxo (P2). A primeira impressão quebra a promessa antes de ela começar. Isso sozinho é um teto.

2. **Duas das três pernas da promessa não existem.** "Um caderno, uma companheira, você" — a companheira está de pé, o caderno (Diário) e o você (Você) são placeholders (P3, P5). Não dá para avaliar a coerência de um trio quando você só construiu um. Não é um Frankenstein — é melhor que isso: é um **esqueleto coerente com um órgão lindo e dois ainda em desenho**. Mas um órgão não é um corpo.

3. **Os momentos que definem um produto de cuidado eu não vi.** Crise, empty state, streaming, o handshake do onboarding (P4, P6). O caminho dourado encanta; o craft se prova nos estados difíceis.

**O que move isto para 9-10:** não é mais polimento nas telas que já estão boas. É **fechar o flow**. Refazer o Login no sistema (mata a costura). Construir Diário e onboarding navegáveis (prova a tese das 3 pernas). Trazer os estados de crise e streaming funcionando (prova o cuidado). Quando eu puder percorrer Login→Onboarding→Hoje→Diário→Você como uma única respiração e sentir UMA mente cuidadosa do começo ao fim — aí conversamos sobre 10. Hoje, o que existe é uma promessa muito bem começada. E começar bem é raro. Mas começar não é terminar.

A boa notícia, e digo isto com convicção: a fundação está certa. O eixo de navegação, o sistema tonal, a decisão "página não mensageiro" — essas são as escolhas que não se consertam com retrabalho, e vocês acertaram. O que falta é construção, não reconcepção. Isso é o tipo de 6.5 que vira 10. Raramente digo isso.

-- Julie Zhuo, designing teams that design great things
