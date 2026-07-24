# 02 — Benchmarks de Onboarding & Fluxos de Entrada (Saúde Mental / Bem-estar)

**Autor:** Atlas (Analyst) · **Data:** 11/Jun/2026 · **Projeto:** Anipis Frontend v2
**Método:** fontes primárias na web (teardowns de UX, papers, guidelines de plataforma, literatura GDPR/consent). Cada padrão é rastreável a uma URL. Onde a evidência é fraca ou contraditória, está marcado com `[confiança: baixa/média/alta]`.

> Escopo da missão: investigar onboarding de Headspace, Calm, Finch, Bloom, Stoic, How We Feel + consent flows de saúde digital (GDPR/LGPD), responder 5 perguntas de design e fechar com um fluxo recomendado para o Anipis (beta fechado, 20 convidados com login já criado, consent LGPD Art.11 obrigatório antes do chat, produto = diário privado + companheira IA, paleta verde floresta/creme, zero gamificação).

---

## Sumário executivo (o que a evidência diz)

1. **Valor antes de cadastro é o padrão dominante** nos apps de bem-estar mais elogiados (Calm, Finch). Headspace é a exceção que pede signup cedo — e paga em fricção (9-10 toques até a 1ª sessão).
2. **Consentimento de dado sensível (saúde) deve ser em camadas** (layered/just-in-time), liderando pelo *porquê* (benefício) e não pelo *o quê* (o pedido). Texto integral preservado, mas atrás de "ler mais".
3. **Mood check-in inicial:** a literatura favorece **emoji + rótulo de palavra juntos** (não emoji puro, não Likert numérico puro). Granularidade alta é um diferencial validado (How We Feel: 144 palavras).
4. **Navegação pós-onboarding:** tab bar inferior com **3 a 5 destinos** é o consenso de Material Design + Apple HIG. Para o Anipis, 3-4 destinos.
5. O Anipis tem uma vantagem rara: **beta fechado com login+senha já criados** → pode pular toda a fricção de cadastro e ir direto a *consent → boas-vindas → 1ª conversa*.

---

## Parte A — Onboarding warm: Headspace & Calm

### Padrão 1 — Calm: valor imediato antes de qualquer pedido `[confiança: alta]`
Calm começa entregando valor já na tela de carregamento ("Take a deep breath" / respiração guiada) **antes** de pedir qualquer dado. A primeira interação não é um formulário — é uma micro-experiência calmante. O signup é guardado para depois e, mesmo quando aparece, é **dispensável** (opção de pular no topo).
- Fonte: [GoodUX — Calm's carefully curated new user experience](https://goodux.appcues.com/blog/calm-app-new-user-experience)
- Fonte: [Plotline — Best Mobile App Onboarding Examples](https://www.plotline.so/blog/mobile-app-onboarding-examples)

### Padrão 2 — Calm: "declared data" — perguntar objetivos para personalizar `[confiança: alta]`
Calm pede ao usuário que selecione **o que está buscando** (meditação, gerenciar estresse, dormir melhor) e depois **quão confortável** está com meditação. Esses inputs ("declared data") alimentam recomendações personalizadas logo na primeira sessão. A pergunta de objetivo cria sensação de relevância sem pedir dado de identidade.
- Fonte: [GoodUX — Calm](https://goodux.appcues.com/blog/calm-app-new-user-experience)

### Padrão 3 — Headspace: signup cedo compra personalização, mas cobra fricção `[confiança: alta]`
Headspace encoraja signup **cedo** para personalizar a jornada — porém o resultado documentado é **9-10 toques até iniciar a primeira sessão**. Headspace mitiga com signup de 1 clique (Google/Apple) e uma tela de proposta de valor com dado ("Just 10 days of Headspace can increase happiness by 16%") entre o cadastro e o paywall.
- Trade-off para o Anipis: personalização precoce **não compensa** quando a barreira de cadastro já foi removida (login pré-criado). Evitar o erro de "9-10 toques".
- Fonte: [Product Teardown — Headspace onboarding personalisation (Medium)](https://tearthemdown.medium.com/product-teardown-headspace-user-onboarding-personalisation-b6effd0df1d7)
- Fonte: [Headspace Android Onboarding Flow (Mobbin)](https://mobbin.com/flows/c745d249-5d87-475f-94dc-1417a106c74e)

### Padrão 4 — Headspace: permissão de notificação como "modal-ponte" `[confiança: média]`
Headspace cria um modal "entre a interface e o diálogo do sistema" para suavizar o pedido de permissão de notificação — o usuário já entende o porquê antes do popup nativo do iOS/Android aparecer. É o caso clássico de **permission priming** (Padrão 11).
- Fonte: [UserOnboard — Permission Priming](https://www.useronboard.com/onboarding-ux-patterns/permission-priming/)

---

## Parte B — Finch (o onboarding mais elogiado da categoria)

### Padrão 5 — Finch: sequência exata do onboarding `[confiança: alta]`
Ordem documentada (fonte primária Retention.blog + teardowns):
1. **Escolha de cor + chocar o ovo** — animação de hatching. *Nenhum dado coletado ainda.* O onboarding começa pela criação de vínculo, não por lista de features.
2. **Customização do pet** — gênero, **nome do pet**, traço de personalidade (com botão "Shuffle" para sugestões).
3. **Nome do usuário** — "choice of what a name means to me" (enquadra o nome como significado pessoal, não como campo de cadastro).
4. **Primeiro momento de recompensa** — responde uma pergunta e ganha pontos/pedras (simula a mecânica do produto real).
5. **Seleção de meta** de autocuidado (versões novas auto-preenchem várias metas para acelerar o "aha").
6. **Paywall** (multi-tela em 2025+).
7. **Momento de ativação** — toca nas metas para gerar "energia" → o pássaro parte numa aventura de "8 horas reais".

- Nota crítica: **não há etapa explícita de criação de conta** detalhada no fluxo de valor — o engajamento vem primeiro, a monetização depois.
- Fonte: [Retention.blog — Life of a birb](https://www.retention.blog/p/life-of-a-birb)
- Fonte: [Christina Hill — Main character energy: 2 habit-building apps (Bootcamp/Medium)](https://medium.com/design-bootcamp/main-character-energy-how-two-habit-building-apps-build-motivation-in-onboarding-a3d144bd2818)

### Padrão 6 — Finch: botão único, consistente, sempre no mesmo lugar `[confiança: alta]`
Durante todo o onboarding o usuário avança por **um único botão verde, fixo na base** — o texto muda, mas tamanho e cor permanecem. Isso reduz carga cognitiva: a pessoa não precisa reaprender onde clicar a cada tela. Uma **barra de progresso** marca a conclusão de cada seção, dando feedback claro de avanço.
- Diretamente aplicável ao Anipis (paleta já é verde). O CTA fixo verde-floresta na base é coerente com a marca.
- Fonte: [Christina Hill — Bootcamp/Medium](https://medium.com/design-bootcamp/main-character-energy-how-two-habit-building-apps-build-motivation-in-onboarding-a3d144bd2818)
- Fonte: [UX Teardown: Finch (Deepthi John Alexander, Medium)](https://medium.com/@deepthi.aipm/ux-teardown-finch-self-care-app-18122357fae7)

### Padrão 7 — Finch: companheira "presente sem cobrança" `[confiança: alta]`
No primeiro encontro, o companheiro está "apenas presente — para conversar, ouvir, fazer companhia, sem pressão e sem exigências imediatas de trabalho emocional profundo". A coleta de dados de personalização usa **cards grandes e tocáveis**, de modo que preencher não pareça tarefa.
- Princípio transferível ao Anipis (que NÃO quer gamificação): manter o "presente sem cobrança" e **descartar** o vínculo pet/pontos/energia. A força do Finch que serve ao Anipis é o *tom de acolhimento e a ausência de pressão*, não a mecânica de jogo.
- Fonte: [UX Teardown: Finch (Medium)](https://medium.com/@deepthi.aipm/ux-teardown-finch-self-care-app-18122357fae7)
- Fonte: [The Magic of Finch (Sophie Pilley)](https://www.sophiepilley.com/post/the-magic-of-finch-where-self-care-meets-enchanted-design)

---

## Parte C — Diários / CBT: Stoic, Bloom, How We Feel

### Padrão 8 — Stoic: do quiz direto para a 1ª reflexão (valor sem intervalo) `[confiança: alta]`
O onboarding do Stoic transita do quiz de personalização **direto para a primeira reflexão diária**, demonstrando valor imediatamente. Perguntas: preocupações, idade, horários preferidos de journaling. O mood check-in não apenas registra um sentimento — **pergunta o "porquê"**, conectando emoção a eventos da vida.
- Alerta de UX (review real): "o usuário é recebido com muitas escolhas e pode se sentir sobrecarregado". → Para o Anipis: introduzir **uma coisa de cada vez**, não um hub cheio logo de cara.
- Fonte: [Stoic. journal & mental health (App Store)](https://apps.apple.com/us/app/stoic-journal-mental-health/id1312926037)
- Fonte: [stoic. iOS Onboarding Flow (Mobbin)](https://mobbin.com/explore/flows/0c54c507-3659-4b57-a758-adaa44ec3aeb)
- Fonte: [ScreensDesign — stoic](https://screensdesign.com/showcase/journal-mental-health-stoic)

### Padrão 9 — How We Feel: granularidade emocional como princípio de produto `[confiança: alta]`
Construído com o Yale Center for Emotional Intelligence sobre o **modelo circumplexo da emoção** (eixos valência × energia). O Mood Meter usa uma **matriz colorida** e foi atualizado para **144 palavras** de emoção. O fluxo: o usuário primeiro faz o check-in de como se sente *no momento*, depois **tagueia ou faz journaling** sobre os fatores que contribuem. Pesquisa: maior granularidade emocional → melhor regulação, comunicação de necessidades e bem-estar.
- Implicação para o Anipis: oferecer **um primeiro nível simples** (poucas emoções) com possibilidade de **aprofundar** (granularidade progressiva) é mais saudável do que forçar 144 opções de cara. Granularidade é diferencial, mas tem que ser progressiva.
- Fonte: [Marc Brackett — How We Feel App](https://marcbrackett.com/how-we-feel-app-3/)
- Fonte: [Yale School of Medicine — The How We Feel App](https://medicine.yale.edu/news-article/the-how-we-feel-app-helping-emotions-work-for-us-not-against-us/)

### Padrão 10 — Mood check-in: emoji + rótulo de palavra é o ponto ótimo `[confiança: média-alta]`
Síntese da literatura de UX/psicometria:
- Escalas com **emoji** ancoram mais "intensamente" que escalas só verbais e cabem melhor em tela de celular (vantagem mobile real).
- Emojis **isolados são ambíguos** — não simbolizam emoções discretas de forma confiável e dependem de contexto. Pesquisa sugere tratá-los como *estados de humor*, não conceitos de emoção.
- **Combinar emoji + palavra** melhora clareza e inclusão; versões só-palavra foram *preferidas no geral*, com emoji como alternativa viável.
- A "emoji current mood and experience scale" validada usa **emojis acompanhados de palavras** em Likert visual de 5 pontos ("Very Little" → "Very Much").
- Recomendação: **não usar emoji puro**; usar **emoji + palavra**, com escala curta (≈5 níveis) e rótulos textuais. Isso também ajuda acessibilidade (leitor de tela lê o rótulo).
- Fonte: [The emoji current mood and experience scale (Taylor & Francis)](https://www.tandfonline.com/doi/full/10.1080/09638237.2022.2069694)
- Fonte: [Are emoji valid indicators of in-the-moment mood? (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0747563223002674)
- Fonte: [Developing an Emoji-based UX Questionnaire: UEQ-Emoji (ACM)](https://dl.acm.org/doi/fullHtml/10.1145/3626705.3627767)
- Fonte: [Emoji as Affective Symbols (PMC/NCBI)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8093811/)

---

## Parte D — Consent flows de saúde digital (GDPR/LGPD)

> Contexto Anipis: consent LGPD **Art.11** (dados pessoais sensíveis — saúde) é **obrigatório antes do chat**. O conteúdo jurídico não pode sumir; só a *apresentação* melhora. Os padrões abaixo mostram como apresentar consentimento de dado sensível sem parecer contrato.

### Padrão 11 — Permission priming: pré-prompt customizado antes do diálogo do SO `[confiança: alta]`
"Preparar (primar) o usuário antes de pedir permissão torna mais provável que ele aceite." Duas funções: (1) construir consciência ("você sabe que um app de X precisa de Y") e (2) conectar ao objetivo do usuário ("só pedimos isso para te ajudar a fazer Z"). **Timing just-in-time** é o recomendado: não peça câmera/notificação até precisar (ex.: Instagram só pede foto ao abrir a câmera).
- Aplicação Anipis: notificações (se houver) só devem ser pedidas **depois** da primeira conversa, com pré-prompt explicando o benefício — nunca no boot.
- Fonte: [UserOnboard — Permission Priming](https://www.useronboard.com/onboarding-ux-patterns/permission-priming/)

### Padrão 12 — Consentimento em camadas (layered consent) `[confiança: alta]`
EDPB e ICO recomendam **avisos de privacidade em camadas**: uma **primeira camada concisa** no ponto do consentimento, com links para o detalhe. "Just-in-time" e "progressive disclosure" — não despejar o texto integral de uma vez. (O custo de ler políticas de privacidade é estimado em "76 dias úteis" — por isso o padrão denso falha.)
- Estrutura de 4 camadas (Data Trust by Design):
  - **Camada 1 — Proposta de valor:** liderar pelo *porquê* antes do *o quê*. "As pessoas só compartilham se houver valor."
  - **Camada 2 — Propósito & agrupamento:** agrupar dados pelo *resultado que entregam*, não por tipo de dado.
  - **Camada 3 — Consequências & controle:** o que pode acontecer (positivo e risco), decisão automatizada, transferências.
  - **Camada 4 — Detalhes técnicos & recibo:** identidade do controlador, retenção, direitos de revogação, **recibo de consentimento** (Art. 7(1) GDPR / equivalente LGPD: é preciso *registrar* o consentimento de cada usuário).
- Fonte: [Data Trust by Design — Part 3: Consent (Nathan Kinch, Medium)](https://medium.com/greater-than-experience-design/data-trust-by-design-principles-patterns-and-best-practices-part-3-consent-70ccdb085f73)
- Fonte: [Momentum — GDPR Consent Requirements for Health Data](https://www.themomentum.ai/blog/gdpr-consent-requirements-health-data)

### Padrão 13 — Dado sensível de saúde exige consentimento explícito e afirmativo `[confiança: alta]`
GDPR Art. 9 (espelhado pela LGPD Art. 11): dado de saúde é categoria especial → exige **consentimento explícito** antes do tratamento. Recital 32: "silêncio, caixas pré-marcadas ou inatividade" **não** constituem consentimento. Logo: nada de toggle pré-ligado, nada de "ao continuar você concorda" implícito. Tem que ser **ação afirmativa clara** (marcar/tocar deliberadamente).
- Fonte: [Momentum — GDPR Consent for Health Data](https://www.themomentum.ai/blog/gdpr-consent-requirements-health-data)
- Fonte: [DPO Consulting — GDPR Data Consent](https://www.dpo-consulting.com/blog/gdpr-data-consent)

### Padrão 14 — Opt-in granular por propósito `[confiança: alta]`
Se o consentimento cobre múltiplos propósitos, dar **opt-in distinto para cada** (analytics ≠ personalização ≠ uso essencial). Permite revogar por propósito específico mantendo acesso ao serviço. Linguagem simples por propósito.
- Aplicação Anipis: separar claramente "tratamento de conteúdo das conversas para te responder" (essencial ao serviço) de quaisquer usos secundários — e deixar cada um auditável/revogável.
- Fonte: [Secure Privacy — Mobile App Consent Management 2025](https://secureprivacy.ai/blog/mobile-app-sdk-consent-management)
- Fonte: [Zigpoll — GDPR-compliant consent flows UX](https://www.zigpoll.com/content/how-can-we-ensure-that-our-mobile-app's-marketing-consent-flows-are-fully-compliant-with-gdpr-while-optimizing-for-user-experience-and-minimizing-dropoffs)

### Padrão 15 — Dark patterns a EVITAR em consent (lista negra) `[confiança: alta]`
Eliminar: (1) toggles pré-selecionados; (2) botões assimétricos ("Aceitar tudo" destacado vs "Recusar" escondido); (3) opt-out difícil; (4) banner que bloqueia conteúdo; (5) juridiquês. Alternativas éticas:
- **Botões lado a lado com peso visual igual** (aceitar e recusar com mesma proeminência).
- **Linguagem clara:** "Usamos X para entender como você usa o app" em vez de "para melhorar sua experiência".
- **Acesso persistente às configurações** (ícone flutuante ou em conta) para revisar escolhas a qualquer hora.
- **Revogar tem que ser tão fácil quanto consentir** — "se consentir leva 1 minuto e revogar leva 10, o design falhou".
- Filosofia central: deixar de *extrair* consentimento e passar a *ganhar confiança*.
- Fonte: [Ketch — Ethical consent UX: How to Stop Using Dark Patterns](https://www.ketch.com/blog/posts/dark-patterns-how-to-stop)
- Fonte: [Data Trust by Design — Part 3 (Medium)](https://medium.com/greater-than-experience-design/data-trust-by-design-principles-patterns-and-best-practices-part-3-consent-70ccdb085f73)

### Padrão 16 — Sinais de confiança: confirmação visível e revogação acessível `[confiança: média-alta]`
Feedback visual de que a escolha foi registrada (ou de que dados foram deletados) cria prova tangível de respeito. Enquadramento "soma positiva" em vez de "tudo ou nada": "Você pode revogar X mantendo Y". Para o Anipis, isso reforça os fluxos **export (Art. 18)** e **delete** já obrigatórios no brief — torná-los visíveis e fáceis é, ao mesmo tempo, compliance e sinal de confiança.
- Fonte: [Data Trust by Design — Part 3 (Medium)](https://medium.com/greater-than-experience-design/data-trust-by-design-principles-patterns-and-best-practices-part-3-consent-70ccdb085f73)

---

## Parte E — Navegação pós-onboarding

### Padrão 17 — Tab bar inferior com 3-5 destinos `[confiança: alta]`
Consenso de múltiplas fontes + Material Design + Apple HIG: tab bar funciona melhor com **3 a 5 destinos primários de importância equivalente**. Acima de 5, os alvos de toque ficam próximos demais (erros) e os rótulos truncam. A base é a zona mais alcançável com o polegar. Para >5 itens, combinar com menu secundário — mas o ideal é **manter poucos destinos**.
- Aplicação Anipis: **3 a 4 destinos**. Companheira (chat) como destino central/primário; Diário; Você/Eu (configurações, export, delete, recursos de crise). Evitar hub central sobrecarregado (erro do Stoic, Padrão 8).
- Fonte: [Smashing Magazine — Golden Rules of Bottom Navigation](https://www.smashingmagazine.com/2016/11/the-golden-rules-of-mobile-navigation-design/)
- Fonte: [UX Planet / Nick Babich — Bottom Tab Bar Best Practices](https://uxplanet.org/bottom-tab-bar-design-best-practices-ef3ee71de0fc)
- Fonte: [Mobbin — Tab Bar UI Design](https://mobbin.com/glossary/tab-bar)

---

## Respostas diretas às 5 perguntas da missão

**1) Ordem ideal — valor primeiro ou cadastro primeiro? Quando pedir nome? Quando mostrar consent?**
Valor primeiro é o padrão vencedor (Calm, Finch, Stoic). Headspace mostra que cadastro cedo cobra fricção. **No Anipis o cadastro já não existe** (beta fechado, login+senha pré-criados) → vantagem competitiva: o usuário já entra "logado". Logo a ordem é **boas-vindas (valor/tom) → consent LGPD → 1ª conversa**. O **nome** se pede como significado pessoal, no estilo Finch ("como você quer ser chamada?"), depois do consent e antes/dentro da primeira conversa — não como campo burocrático. O **consent Art.11 aparece antes do chat** (obrigatório), mas precedido de 1-2 telas de acolhimento que estabelecem o *porquê* (camada 1 do layered consent), nunca como primeira coisa fria na tela.

**2) Como apresentar consentimento LGPD de dado sensível sem parecer contrato.**
Layered consent (Padrão 12): camada 1 = proposta de valor em linguagem humana ("Para a Anipis te acompanhar, ela guarda o que você escreve — de forma privada e só para você"); resumo com **ícones** por propósito (Padrão 14); **link "ler o texto completo"** preserva o conteúdo jurídico integral exigido pelo brief. Ação afirmativa explícita (Padrão 13: sem pré-marcação). Botões de peso igual (Padrão 15). Recibo/registro do consentimento no backend (Art. 7 GDPR / LGPD). Export e delete (Padrões 16) visíveis depois, como sinal de confiança.

**3) Mood check-in inicial — escala?**
**Emoji + palavra**, escala curta de ~5 níveis, com rótulos textuais (Padrão 10), começando simples e permitindo **aprofundar a granularidade** depois (Padrão 9, modelo How We Feel). Evitar emoji puro (ambíguo) e Likert numérico seco. Acessível para leitor de tela porque cada opção tem rótulo. Depois do humor, oferecer (opcional) o "porquê" via tag ou texto livre (Stoic/How We Feel).

**4) Navegação pós-onboarding.**
Tab bar inferior, **3-4 destinos** (Padrão 17). Companheira/chat como destino central. Sem sidebar/hambúrguer como navegação primária. Sem hub central abarrotado.

**5) Microcopy de boas-vindas PT-BR.**
Tom: **calmo, acolhedor, na 2ª pessoa ("você"), frases curtas**, sem promessas clínicas (o brief proíbe "terapia/tratamento/cura"). Personalização por declared data, não por jargão. Exemplos no fluxo abaixo.

---

## Fluxo de onboarding recomendado pro Anipis em 6 passos

Premissas honradas: beta fechado (20 convidadas, login+senha já criados), consent LGPD Art.11 obrigatório **antes** do chat com conteúdo jurídico preservado, produto = **diário privado + companheira IA**, paleta verde floresta `#2f5235` / creme `#f7f4ed`, **zero gamificação** (sem pet, pontos, energia, streaks).

**Passo 1 — Login (já existente, sem fricção de cadastro).**
A usuária entra com login+senha recebidos no convite. Nenhuma tela de "criar conta", nenhum quiz de paywall, nenhum signup social. Aproveita a vantagem do beta fechado (contraste deliberado com os 9-10 toques do Headspace).
*Microcopy:* "Que bom te ver. Entre para continuar." · CTA verde-floresta fixo na base.

**Passo 2 — Boas-vindas / proposta de valor (1-2 telas, calmas).**
Estabelece tom e *porquê* antes de pedir consentimento (camada 1 do layered consent, Padrão 12; "presente sem cobrança" do Finch, Padrão 7). Sem features em lista; uma frase por tela, muito respiro, sem motion agressivo.
*Microcopy:* "A Anipis é um espaço só seu — um diário privado e uma companheira para conversar, quando você quiser." / "Sem pressa, sem cobrança. Você conduz."

**Passo 3 — Consentimento LGPD Art.11 em camadas (obrigatório, antes do chat).**
Camada 1 visível: resumo humano + ícones por propósito (guardar suas conversas/diário · privacidade · seu controle), com **ação afirmativa explícita** (Padrão 13, sem pré-marcação) e **botões de peso igual** (Padrão 15). Link "Ler o texto completo" abre o conteúdo jurídico integral (preservado conforme brief). Consentimento é **registrado** no backend (recibo, Padrão 12). Aqui também se sinaliza, em linguagem simples, que ela pode **exportar ou apagar** tudo quando quiser (Padrões 14/16 — antecipa Art.18 como sinal de confiança).
*Microcopy:* "Para a Anipis te acompanhar, ela guarda o que você escreve aqui — de forma privada e só pra você. Você pode exportar ou apagar tudo a qualquer momento." · [Concordo e quero começar] / [Ler o texto completo]

**Passo 4 — Nome / como quer ser chamada (estilo Finch, Padrão 5/7).**
Pede o nome como significado pessoal, não como campo de formulário. Um único input, CTA fixo.
*Microcopy:* "Como você gostaria que a Anipis te chamasse?"

**Passo 5 — Primeiro mood check-in (emoji + palavra, granularidade progressiva — Padrões 9/10).**
Escala curta (~5 estados), cada um com emoji **e** rótulo PT-BR. Opção (não obrigatória) de aprofundar/tagged o "porquê" depois. Esta é a primeira amostra do produto-diário — entrega valor antes do chat, como Calm/Stoic fazem (Padrões 1/8).
*Microcopy:* "Como você está agora?" · [😟 Difícil] [😕 Pra baixo] [😐 Neutra] [🙂 Bem] [😀 Ótima] · abaixo, opcional: "Quer contar o que está pesando?" (texto livre).

**Passo 6 — Primeira conversa com a companheira (destino central) + revelação suave da navegação.**
Cai direto na conversa (o "presente sem cobrança" do Finch), com a IA acolhendo de forma calorosa e sem exigir trabalho emocional profundo. A tab bar inferior de **3-4 destinos** aparece aqui pela primeira vez, com a Companheira já selecionada (Padrão 17). Recursos de crise (CVV 188 / SAMU 192) sempre alcançáveis conforme brief, sem motion no tema crise.
*Navegação sugerida (3-4 itens):* **Conversa** (central) · **Diário** · **Você** (configurações, export, apagar, recursos de crise).
*Microcopy de abertura da IA:* "Oi, {nome}. Estou aqui com você. Pode começar por onde quiser — ou só desabafar."

**Permissões (se houver notificações):** pedir **só depois** do passo 6, com pré-prompt explicando o benefício (permission priming just-in-time, Padrão 11). Nunca no boot.

---

## Anti-padrões a evitar (resumo)

- Pedir cadastro/identidade antes de entregar valor (erro relativo do Headspace — e desnecessário no Anipis).
- Consent como muro de juridiquês de uma vez só, ou com caixa pré-marcada / botões assimétricos (Padrões 13/15).
- Emoji puro no mood check-in (ambíguo — Padrão 10).
- Hub inicial abarrotado de escolhas (crítica real ao Stoic — Padrão 8).
- Tab bar com >5 destinos (Padrão 17).
- Qualquer gamificação herdada do Finch (pet/pontos/energia/streak) — explicitamente fora do escopo do Anipis. Aproveitar do Finch **só** o tom, o CTA único consistente e a barra de progresso.
- Pedir notificação no boot, sem priming (Padrão 11).

---

## Notas de confiança e lacunas

- **Bloom:** evidência fraca nas fontes primárias acessíveis (mencionado só em comparativos de preço). Padrões de journaling/CBT foram supridos por Stoic e How We Feel, que têm teardowns e base científica mais ricos. `[lacuna assumida]`
- Fluxos exatos de Calm/Headspace variam por safra e por teste A/B; os padrões aqui são os documentados em teardowns recentes, não capturas tela-a-tela ao vivo. `[confiança: alta no padrão, média no detalhe pontual]`
- Mood scale: a literatura prefere palavra; emoji é alternativa viável — a recomendação **emoji+palavra** é o meio-termo defensável e mais acessível, mas vale validar com as 20 do beta.

---

### Índice de fontes (URLs citadas)

- GoodUX — Calm: https://goodux.appcues.com/blog/calm-app-new-user-experience
- Plotline — Mobile App Onboarding Examples: https://www.plotline.so/blog/mobile-app-onboarding-examples
- Headspace Teardown (Medium): https://tearthemdown.medium.com/product-teardown-headspace-user-onboarding-personalisation-b6effd0df1d7
- Headspace Onboarding Flow (Mobbin): https://mobbin.com/flows/c745d249-5d87-475f-94dc-1417a106c74e
- UserOnboard — Permission Priming: https://www.useronboard.com/onboarding-ux-patterns/permission-priming/
- Retention.blog — Life of a birb (Finch): https://www.retention.blog/p/life-of-a-birb
- Christina Hill — Main character energy (Medium): https://medium.com/design-bootcamp/main-character-energy-how-two-habit-building-apps-build-motivation-in-onboarding-a3d144bd2818
- UX Teardown: Finch (Medium): https://medium.com/@deepthi.aipm/ux-teardown-finch-self-care-app-18122357fae7
- The Magic of Finch (Sophie Pilley): https://www.sophiepilley.com/post/the-magic-of-finch-where-self-care-meets-enchanted-design
- Stoic (App Store): https://apps.apple.com/us/app/stoic-journal-mental-health/id1312926037
- Stoic Onboarding (Mobbin): https://mobbin.com/explore/flows/0c54c507-3659-4b57-a758-adaa44ec3aeb
- ScreensDesign — Stoic: https://screensdesign.com/showcase/journal-mental-health-stoic
- Marc Brackett — How We Feel: https://marcbrackett.com/how-we-feel-app-3/
- Yale — How We Feel App: https://medicine.yale.edu/news-article/the-how-we-feel-app-helping-emotions-work-for-us-not-against-us/
- The emoji current mood and experience scale (Taylor & Francis): https://www.tandfonline.com/doi/full/10.1080/09638237.2022.2069694
- Are emoji valid indicators of in-the-moment mood? (ScienceDirect): https://www.sciencedirect.com/science/article/pii/S0747563223002674
- UEQ-Emoji (ACM): https://dl.acm.org/doi/fullHtml/10.1145/3626705.3627767
- Emoji as Affective Symbols (PMC): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8093811/
- Data Trust by Design — Consent (Medium): https://medium.com/greater-than-experience-design/data-trust-by-design-principles-patterns-and-best-practices-part-3-consent-70ccdb085f73
- Momentum — GDPR Consent for Health Data: https://www.themomentum.ai/blog/gdpr-consent-requirements-health-data
- DPO Consulting — GDPR Data Consent: https://www.dpo-consulting.com/blog/gdpr-data-consent
- Secure Privacy — Mobile App Consent 2025: https://secureprivacy.ai/blog/mobile-app-sdk-consent-management
- Zigpoll — GDPR consent flows UX: https://www.zigpoll.com/content/how-can-we-ensure-that-our-mobile-app's-marketing-consent-flows-are-fully-compliant-with-gdpr-while-optimizing-for-user-experience-and-minimizing-dropoffs
- Ketch — Ethical consent UX: https://www.ketch.com/blog/posts/dark-patterns-how-to-stop
- Smashing Magazine — Bottom Navigation: https://www.smashingmagazine.com/2016/11/the-golden-rules-of-mobile-navigation-design/
- UX Planet — Bottom Tab Bar: https://uxplanet.org/bottom-tab-bar-design-best-practices-ef3ee71de0fc
- Mobbin — Tab Bar UI Design: https://mobbin.com/glossary/tab-bar
