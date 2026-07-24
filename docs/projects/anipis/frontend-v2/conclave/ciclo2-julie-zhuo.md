# Conclave Ciclo 2 — Julie Zhuo (Produto + Coerência)

**Data:** 12/Jun/2026 · **Lente:** Agora que TODAS as telas existem, elas formam UM produto? A costura sumiu? O flow inteiro sustenta "um caderno, uma companheira, você"?

---

No ciclo 1 eu fui explícita sobre o que estava julgando: uma promessa de três atos da qual só vi o segundo ato pronto. Dei 6.5 e disse, com convicção, que era "o tipo de 6.5 que vira 10" — porque o que faltava era construção, não reconcepção. A fundação estava certa. Então a pergunta deste ciclo não é "ficou bonito?". É a mesma de sempre, e é a mais difícil: **agora que existe um corpo inteiro, sente-se UMA mente cuidadosa do Login ao Você, ou sentem-se cinco telas que aprenderam a se vestir parecido?**

Diagnostico antes de prescrever. Desta vez avaliei o produto completo: Login refeito, Hoje (light + madrugada), Onboarding com consent em camadas, Diário, Você. Não estou mais inferindo as pernas que faltavam — estou andando nelas.

---

## 1. VERIFICAÇÃO — as 3 pernas + login + onboarding formam UM produto?

### A costura Login-vs-Hoje: **RESOLVIDO.**

No ciclo 1 este foi meu bloqueador nº1 (P1): o login era um card branco flutuante com sombra, padrão SaaS B2B de 2018, e a tela Hoje era papel creme flat edge-to-edge. Dois produtos. A costura aparecia antes da pessoa entrar.

Olho o login agora (`fix1-login-820.png`) e vejo: o mesmo creme `#f7f4ed` da tela Hoje, o wordmark **anipis.** em serif itálico no mesmo lugar e mesma voz do header do Hoje, "Que bom te ver." em Newsreader serif, **inputs-linha** (hairline inferior, sem pílula) exatamente como o conclave votou (4-1), e os desvios de auth **sumiram** — não há mais "Criar conta" nem "link mágico" (P2 resolvido, voto unânime honrado). A primeira página agora respira como o caderno respira. Quando percorro Login → Hoje, a temperatura sobe suavemente em vez de saltar entre dois mundos. **A emenda fechou.** Esta é a correção mais importante do ciclo, e ela foi feita no nível certo — sistêmico, não cosmético.

> Ressalva honesta (não anula o RESOLVIDO): o login ainda tem um container com cantos arredondados e uma borda/sombra muito sutil em volta do formulário. É infinitamente mais discreto que o card de antes, mas o doc 03 diz "FLAT absoluto (zero sombras)". É a diferença entre "consertado" e "consertado com rigor". Aponto em §2.

### As 3 pernas (Hoje / Diário / Você): **RESOLVIDO — pela primeira vez existe um caderno.**

Este era o coração da minha crítica de ciclo 1 (P3): "a tela Hoje sozinha não é um caderno, é um chat bonito". O que prova a tese é o **acúmulo** — a sensação de que existe uma linha do tempo, um lugar para voltar e ver seu próprio caminhar.

O Diário (`faseB-diario-820.png`) agora entrega isso, e entrega bem. "SEU CADERNO / Seu diário" em serif, a curva **"seu caminhar"** sem números, sem gamificação, sem streak — uma linha de humor que sobe e desce como uma respiração, exatamente a direção certa para um produto que não pode transformar sofrimento em pontuação. Abaixo, cards por dia: chip de humor + primeira linha da conversa + "12 mensagens · toque para reabrir". É a prova de que ontem foi guardado. **Agora "um caderno" é uma experiência, não uma afirmação.** A coerência com o Hoje é real: o card de "HOJE" cita a mesma frase que aparece na conversa do Hoje ("não consegui desligar a cabeça"). As duas telas falam do mesmo dia. Isso é UMA mente.

O Você (`faseB-voce-820.png`) fecha a terceira perna com maturidade: "SUA CONTA / Você" em serif, "como a Anipis te chama: Marina", e a lista — Consentimentos, Contatos de emergência, Exportar dados (LGPD Art. 18), Profissional vinculado, Tema, **Recursos de crise** expandido, Apagar conta (Art. 18), Sair. A ética que no ciclo 1 eu disse estar "no esqueleto" agora tem um lar visível e navegável. A 2ª via de crise persistente que o conclave exigiu (item 3 da ordem de execução) **está aqui**, com tom tijolo calmo e os botões CVV/SAMU. Art. 18 aparece duas vezes (exportar + apagar) — direito do titular tratado como funcionalidade de primeira classe, não letra miúda.

### O onboarding: **RESOLVIDO como ponte tonal.**

No ciclo 1 (P5) eu disse que o onboarding precisava ser "o gradiente de temperatura entre o Login frio e o Hoje íntimo". A tela de consent (`faseB-onboarding-820.png`) faz exatamente isso: barra de progresso no topo (6 passos), "ANTES DE COMEÇAR / Como a Anipis cuida do que você escreve", os três cartões humanos (O que ela guarda / Sua privacidade / Seu controle) **antes** dos checkboxes legais — valor antes do pedido, consent em camadas, "Ler o texto completo" para quem quer o detalhe. Isso é o handshake de confiança que torna a intimidade do Hoje aceitável. O tom é caloroso e a mecânica é honesta.

### Veredito de verificação: **RESOLVIDO.** 

As cinco superfícies formam UM produto. Percorro Login → Onboarding → Hoje → Diário → Você e sinto uma única respiração: mesmo creme, mesmo wordmark, mesma serif para a voz/conteúdo, mesmo verde floresta reservado para ação, mesma calma. O madrugada (`c2-hoje-dark-820.png`) — o ponto cego que o conclave mandou checar — está coerente: a inversão tonal preserva a hierarquia, o verde da tab ativa e o tijolo da crise sobrevivem ao escuro. Não é mais um esqueleto com um órgão lindo e dois em desenho. É um corpo.

---

## 2. PROBLEMAS RESIDUAIS de coerência/craft

**R1 — [MÉDIO · craft] O container do login ainda não é "flat absoluto".** Como dito acima: o formulário senta num cartão com borda/sombra sutil sobre o creme. Coerente o suficiente para a costura ter sumido, mas inconsistente com a regra "zero sombras" que o resto do produto honra. Hoje, Diário e Você assentam o conteúdo direto no creme ou em containers L1 sem sombra; o login é a última tela que ainda usa "card". **Correção:** dissolver o card — formulário direto no creme, centralizado, larguras controladas por max-width. O login deveria ser a primeira página do caderno, não a porta com moldura.

**R2 — [MÉDIO · regressão do voto] O botão "Entrar" parece desabilitado.** Bege claro, texto cinza, baixíssimo contraste — exatamente o "botão que parece disabled" que o conclave marcou como problema no ciclo 1 (consenso §2) e cuja correção foi "estado disabled HONESTO". No screenshot ele está no estado vazio (sem credenciais), então pode ser disabled honesto e correto. **Mas preciso ver o estado ATIVO** (campos preenchidos → verde floresta sólido, alto contraste, affordance clara de "isto te leva para dentro"). Se o estado preenchido não vira o CTA verde do resto do produto, a porta de entrada continua tímida. Verificar mecanicamente: preencher e screenshotar.

**R3 — [BAIXO-MÉDIO · coerência tonal] O chip de humor sobrevive como carimbo no topo do Hoje, contra o voto do conclave.** O conclave decidiu (item 5): "humor DISSOLVIDO na primeira fala da Anipis; chip vira registro discreto opcional — nunca um veredito estático". No `c2-hoje-light-820.png` a Anipis JÁ dissolve o humor na fala ("Que bom que você chegou se sentindo bem hoje") — ótimo, metade do voto cumprida. Mas o chip "😊 Bem ✎" ainda paira no topo como carimbo fixo, agora acompanhado de "Só um convite — toque se quiser revisar como você está". O micro-copy ameniza o risco de ruminação e adiciona affordance (o ✎ e o "toque"), o que é uma melhora real sobre o órfão de ciclo 1 (P4). Porém ele ainda é *dois* registros do mesmo humor na mesma tela (chip + fala). **Correção:** ou o chip recolhe para um gesto ainda mais leve (um ✎ discreto sem o emoji+rótulo cravados), ou aceita-se a redundância como intencional — mas então documente a decisão. Hoje ela parece meio-caminho entre o voto e o estado antigo.

**R4 — [BAIXO · craft] O Diário não tem empty state visível, e o "primeiro dia" é o momento de coerência mais frágil.** O Diário cheio é lindo. Mas uma pessoa nova chega ao Diário com zero ou um dia. Como é o Diário com um card só? E a curva "seu caminhar" com um único ponto — ela ainda conta uma história ou vira uma linha reta sem sentido? Não vi. A coerência do produto se prova no estado vazio tanto quanto no cheio. **Correção:** buildar e trazer o empty/primeiro-dia do Diário; a curva precisa degradar com graça (talvez nem aparecer até haver 3+ pontos).

**R5 — [BAIXO · verificação pendente] Falta acentuação em vários textos.** "saude", "experiencia", "sao", "Politica", "matinal" sem acento no onboarding e nos cards. Provavelmente placeholder/encoding, não decisão de design — mas num produto onde a serif carrega a voz íntima, texto sem acento lê como rascunho e arranha a sensação de craft. **Correção:** revisar encoding/copy antes de qualquer teste com pessoas reais.

---

## 3. O QUE BLOQUEIA 10/10 pela minha lente

O que me impedia de chegar perto do 10 no ciclo 1 era estrutural: a costura, as pernas faltando, os estados de cuidado não vistos. **Os dois primeiros foram resolvidos.** O que resta para o 10 não é mais reconcepção nem sequer construção grande — é **prova nos estados que definem um produto de cuidado**, mais polimento de craft:

1. **Os estados difíceis do Hoje, vivos.** Continuo só vendo o caminho dourado (pessoa "Bem", desabafo leve, resposta calorosa). Para o 10 eu preciso ver, funcionando com a mesma voz calma: o **fluxo de crise completo** disparado de dentro da conversa (RED/ORANGE/YELLOW — não só a 2ª via parada em Você), o **streaming** token-a-token com layout estável, o **indicador "Anipis está escrevendo"** (a presença na espera que o conclave marcou como regressão), o **empty state/saudação** sem nome até o onboarding capturá-lo. O caderno está de pé; falta vê-lo na hora em que mais importa.

2. **Os resíduos de craft de §2.** Login flat de verdade (R1), CTA "Entrar" verde no estado ativo (R2), decisão final sobre o chip de humor (R3), empty state do Diário (R4), acentuação (R5). Nenhum é grande. Todos são a diferença entre "coerente" e "coerente com rigor".

3. **O gate humano do Norman.** Mantenho o que a síntese registrou: antes de declarar 10, observar pessoas reais entrando, escrevendo e achando socorro. O design está pronto para esse teste — esse é o ponto. No ciclo 1 não estava.

O que move isto para 10 agora é **fechar os estados de cuidado e lustrar**, não rabuildar. Esse é um salto qualitativamente menor do que o de 6.5. É a distância final.

---

## 4. NOTA

### Produto / Coerência: **8.5 / 10** (era 6.5)

**Por que subiu +2.0:** Porque o que era um teto estrutural caiu. A costura Login-vs-Hoje — meu bloqueador nº1 — está costurada. As duas pernas que não existiam (Diário, Você) agora existem e são coerentes com a terceira, ao ponto de o Diário citar o mesmo dia que o Hoje. O onboarding virou a ponte tonal que eu pedi. O madrugada, ponto cego do conclave, fechou. Pela primeira vez eu percorro o produto inteiro e sinto UMA mente cuidadosa do começo ao fim. Isso é exatamente o "6.5 que vira 10" se cumprindo — a fundação estava certa, e a construção honrou a fundação.

**Por que ainda NÃO é 10:** Porque um produto de cuidado se prova nos estados que mais importam, e três deles eu ainda não vi vivos — crise disparada de dentro da conversa, streaming/presença na espera, e os empty states (Hoje sem nome, Diário no primeiro dia). Some os resíduos de craft (login não-flat de verdade, CTA tímido, chip meio-caminho, acentuação) e tenho um produto que está claramente do lado certo da linha, mas que ainda não me mostrou seu pior dia funcionando com a mesma calma do seu melhor. Não dou 10 a um produto cuja hora mais difícil eu não vi.

**O que falta é a distância final, não o caminho inteiro.** No ciclo 1 eu disse "começar bem é raro, mas começar não é terminar". Vocês não estão mais começando — estão terminando. Feche os estados de cuidado, lustre os cinco resíduos, leve a cinco pessoas reais. Aí conversamos sobre 10. E desta vez a conversa está perto.

-- Julie Zhuo, designing teams that design great things
