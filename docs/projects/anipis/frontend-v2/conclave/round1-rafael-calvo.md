# Conclave Round 1 — Parecer de Rafael Calvo

**Lente:** Wellbeing Tech + Ética (Positive Computing, METUX, Self-Determination Theory, design sensível a valores)
**Artefatos avaliados:** `00-BRIEF.md`, `02-ux-architecture.md`, `03-design-direction.md`; screenshots `verify-hoje-820.png`, `faseA-login-desktop.png`, `faseA-hoje-mobile.png`; app vivo `localhost:3344/dev-preview/hoje`; código (`CrisisQuickHelp.tsx`, `AppHeader.tsx`, `PaperComposer.tsx`, `voce/page.tsx`).
**Escopo real:** Fase A = login + onboarding + shell do Hoje. **`Você` e `Diário` são stubs ("em construção")** — fato decisivo para a minha lente.

---

## Enquadramento

Antes de avaliar pixels, eu peço que imaginem uma pessoa abrindo isto às 2h da manhã, sozinha, em sofrimento — porque é exatamente quem usa um diário emocional com companheira de IA. Toda decisão de design ou serve essa pessoa naquele instante, ou a abandona. Não existe escolha neutra. É por essa pessoa que avalio.

Anipis é **tecnologia dedicada ao bem-estar** (na taxonomia preventiva/ativa/dedicada): o bem-estar não é efeito colateral, é o propósito declarado. Isso eleva a régua — não basta "não causar dano", o produto promete cuidado. Por outro lado, é também o tipo de produto onde uma companheira de IA pode, sem querer, **substituir** vínculo humano em vez de **andar ao lado** dele. Essa é a tensão ética central, e é a partir dela que olho tudo.

---

## 1. Pontos FORTES éticos/wellbeing (concretos)

**F1 — A microcopy do disclaimer está honesta E na ergonomia certa.** "A Anipis acompanha, não substitui acompanhamento profissional" aparece (a) permanentemente sob o composer do Hoje e (b) dentro do próprio painel de crise (`CrisisQuickHelp`, l.153). O verbo é exato — *acompanha*, não *trata/cura/terapia*. Do ponto de vista de positive computing, isto é **transparência como segurança**: a pessoa que conhece os limites da ferramenta a usa melhor e busca ajuda humana quando precisa. Não é uma limitação a esconder; é um determinante de autonomia. Aprovado sem ressalvas.

**F2 — A presença abre acolhendo, sem exigir nada.** "Oi, Marina. Estou aqui com você. Pode começar por onde quiser — ou só desabafar." A Anipis fala primeiro, valida presença ("estou aqui com você"), oferece escolha ("por onde quiser") e legitima o não-fazer ("ou só desabafar"). Isto é **suporte a autonomia** em estado puro — não há demanda, não há "como você está se sentindo?" jogado na cara de quem talvez não consiga articular. O empty-state é uma saudação calorosa, não um menu de capacidades. É o oposto do dark pattern de obrigação. Exatamente o que eu recomendaria.

**F3 — Zero gamificação, e isso se vê na ausência.** Não há streak, badge, contador de dias, "você está há X dias cuidando de você". A arquitetura (`02 §5`) proíbe explicitamente streaks no "seu caminhar". Isto importa profundamente: mecânicas de streak convertem motivação intrínseca (quero me entender) em extrínseca (não posso quebrar a sequência) e, quando a sequência inevitavelmente quebra, produzem fracasso e culpa em vez de autocompaixão. Num produto de saúde mental isso é especialmente nocivo. A ausência aqui é uma decisão de design ativa e correta.

**F4 — A crise tem voz calma, não alarme.** O painel de crise usa tijolo `#8f2c1b` (não vermelho de erro), `animation: none`/`transition: none` explícitos (l.64-67), título "Você não está sozinha", copy "há pessoas prontas para te ouvir agora — gratuito e em sigilo", CVV 188 a um toque + SAMU + chat online. Isto segue corretamente o princípio de que a superfície de crise nunca deve *movimentar* nem *gritar* — uma pessoa em pânico não precisa de mais estímulo. O conteúdo do painel é, isoladamente, excelente trabalho de design trauma-informado.

**F5 — Calma estrutural: respiro, flat, sem ruído atencional.** Largura de leitura ~65ch, gaps generosos, flat absoluto (zero sombra), serif editorial pra voz da Anipis sem bolha/avatar. O Hoje não tem nada piscando, nenhum badge de notificação, nenhum "3 pessoas estão online". A página respira. Isto é **design restaurador** — o ambiente digital, como o físico, afeta o estado psicológico, e este ambiente foi desenhado pra baixar o ritmo, não acelerá-lo.

---

## 2. PROBLEMAS (severidade · risco ético/wellbeing · correção)

### P1 — [ALTA] O caminho para a crise está discreto demais para o momento de crise

O gatilho "precisa de ajuda agora?" no header é `text-caption` (12px), verde floresta sobre creme, **sem ícone, sem peso visual**, ocupando o canto direito como se fosse um link de rodapé (`AppHeader.tsx` l.43-58). No screenshot do Hoje ele quase desaparece. E no **mobile** (`faseA-hoje-mobile.png`) o corte mostra "precisa de ajuda..." truncado — o único caminho de crise da Fase A está sendo *cortado pela viewport*.

**Risco ético:** a pessoa em maior vulnerabilidade — visão em túnel, capacidade cognitiva reduzida pelo sofrimento — é justamente quem menos consegue caçar um link de 12px sem ícone. O caminho para ajuda humana não pode ter o mesmo peso visual de um metadado. Há uma tensão de design real (não queremos um botão vermelho de pânico gritando, F4), mas "calmo" não pode significar "quase invisível". Calma e proeminência não são opostos: um alvo sereno, claro, com ícone e contraste suficiente, pode ser ao mesmo tempo tranquilo e inconfundível.

**Correção:** (a) garantir que o gatilho **nunca trunca** em mobile — encurtar para "ajuda" + ícone de salva-vidas/coração, ou movê-lo para uma posição fixa que não compita com o wordmark; (b) elevar o alvo de toque para 44px reais com área clicável visível; (c) adicionar um ícone discreto à esquerda do texto para reconhecimento pré-leitura (a pessoa em crise reconhece o símbolo antes de ler a palavra); (d) validar contraste do verde floresta sobre creme no tamanho 12px (provável reprovação AA em texto pequeno — ver P4).

### P2 — [ALTA] Autonomia (export/delete Art.18) e a segunda via de crise não existem nesta build

`voce/page.tsx` é um stub "em construção". Isso significa que, na Fase A, **exportar dados, apagar conta, gerenciar consentimentos, contatos de emergência e a seção persistente de recursos de crise não são alcançáveis** — tudo prometido para Fase B.

**Risco ético:** autonomia é para o bem-estar psicológico o que o oxigênio é para o corpo — não se nota quando está presente, mas a ausência é imediatamente angustiante. Um produto de saúde mental que coleta diário emocional íntimo (LGPD Art.11, dado sensível) sem dar à pessoa, *no mesmo momento*, o controle de exportar/apagar, cria uma assimetria de poder. Sei que é faseamento e não omissão de princípio — o BRIEF e a arquitetura tratam disso. Mas preciso registrar firmemente: **export e delete não podem chegar "depois" como se fossem features secundárias. Eles são requisito de design, não nice-to-have.** E a segunda via de crise (a seção em "Você") também depende de Fase B — ou seja, hoje a rede de segurança tem **um único fio** (o header de P1). Um único ponto de falha numa superfície de crise é inaceitável.

**Correção:** (a) tratar export/delete como bloqueador de "pronto", não como Fase B opcional; (b) enquanto "Você" não existe, **garantir redundância do caminho de crise** — pelo menos um segundo ponto de acesso (ex.: link discreto persistente também no rodapé do composer, ou dentro do menu da pessoa) para que a rede não dependa de um link truncável.

### P3 — [MÉDIA] Não há nenhum sinal de proteção contra uso compulsivo / dependência da companheira

Os artefatos cuidam bem de *não gamificar* (F3), mas são silenciosos sobre o risco oposto e mais sutil de um companion de IA: **vínculo substitutivo**. Uma IA que está "sempre aqui com você", responde com calor 24h, nunca cansa, nunca julga — pode, sem nenhum dark pattern, tornar-se mais fácil que o vínculo humano (que é difícil, recíproco, falível). Não vejo no design: (a) nenhum convite gentil de volta ao mundo/pessoas reais, (b) nenhuma fricção benéfica ou ponto de reflexão sobre tempo de uso, (c) nenhum reforço de que a meta é a pessoa florescer *fora* do app.

**Risco ético:** engajamento não é bem-estar. Uma pessoa que abre o Anipis toda noite em vez de falar com alguém pode ter métricas lindas de retenção e estar *pior* em relatedness (conexão humana) — o determinante que um companion de IA mais facilmente desloca. O disclaimer "não substitui acompanhamento profissional" cobre o eixo clínico, mas **não** cobre o eixo relacional/social (METUX esfera "vida" e "sociedade").

**Correção:** (a) na esfera de "comportamento/vida", desenhar momentos onde a Anipis gentilmente devolve a pessoa ao mundo ("isso parece algo que valeria conversar com alguém de confiança também?") — sem culpa, como cuidado; (b) considerar uma fricção benéfica leve em sessões muito longas/tardias ("já é tarde — quer continuar ou guardar pra amanhã?"), no mesmo tom calmo, jamais como bloqueio ou contador; (c) tornar explícito no design o princípio de que o sucesso do Anipis é a pessoa precisar *menos* dele ao longo do tempo, não mais.

### P4 — [MÉDIA] O botão "Entrar" desabilitado falha contraste e comunica "morto" no primeiro contato

No `faseA-login-desktop.png`, o CTA "Entrar" está em sage dessaturado com texto branco — estado desabilitado. O contraste texto-branco-sobre-sage-claro aparenta reprovar WCAG AA, e visualmente o botão parece *desligado* na primeira impressão. O primeiro contato com o produto (METUX esfera "adoção") comunica, em vez de "que bom te ver", um "isto não funciona".

**Risco ético/wellbeing:** competência. A primeira tela deveria fazer a pessoa sentir-se capaz e bem-vinda; um CTA que parece quebrado mina a sensação de competência logo na porta de entrada. Em alguém já fragilizado, frustração de entrada é custo psicológico real.

**Correção:** (a) revisar o token do estado desabilitado para passar AA mesmo desabilitado, OU usar um estado desabilitado mais óbvio (outline/opacidade no texto) que não se leia como "botão morto"; (b) idealmente o CTA fica habilitado e a validação acontece no submit, para não comunicar bloqueio antes da pessoa tentar.

### P5 — [MÉDIA] O chip de humor "Bem" no topo do Hoje pode induzir auto-monitoramento e dissonância

O chip "🙂 Bem" fica fixo no topo da conversa (`verify-hoje-820.png`). Logo abaixo, a pessoa escreve "Hoje foi um dia pesado no trabalho, não consegui desligar a cabeça". Há uma **dissonância visível**: o rótulo diz "Bem", o conteúdo diz "pesado". Para algumas populações (ansiedade, depressão), ser constantemente confrontado com um rótulo de humor fixo pode amplificar ruminação ou gerar a sensação de estar "se contradizendo".

**Risco ético:** o auto-monitoramento excessivo tem evidência de aumentar ruminação em parte da população. Um chip de humor *persistente* no topo, que não acompanha a fluidez do que a pessoa está sentindo agora, pode prender a experiência num rótulo já superado.

**Correção:** (a) considerar tornar o chip de humor **discreto e dispensável** (a pessoa pode atualizar ou ocultar), em vez de um carimbo fixo do dia; (b) deixar a Anipis reconhecer no diálogo a mudança ("você marcou 'bem' mais cedo, mas o dia parece ter pesado depois — tudo bem o humor mudar") em vez de o sistema manter um rótulo estático que contradiz a fala viva.

### P6 — [BAIXA] "Entrar com link mágico" e "Criar conta" num beta fechado: clareza e expectativa

A tela de login (beta fechado, credenciais pré-criadas, `02 §3.1`) mostra "Não tem conta? Criar" e "Entrar com link mágico". Para um beta fechado onde *não há* auto-cadastro, oferecer "Criar conta" pode gerar um beco sem saída (a pessoa clica, não consegue, frustra-se). Pequeno, mas é fricção desnecessária no primeiro contato.

**Correção:** ocultar/ajustar "Criar conta" no beta fechado, ou deixar explícito que o acesso é por convite, para não criar uma expectativa que o sistema não cumpre.

---

## 3. NOTA (ética/wellbeing): **7,5 / 10**

A fundação é genuinamente boa e rara: voz que acolhe sem exigir, zero gamificação por decisão ativa, disclaimer honesto e ergonômico, crise com voz calma e conteúdo trauma-informado, ambiente que respira. Isto não é um app de engajamento disfarçado de bem-estar — é uma tentativa séria de positive computing dedicado. Por isso a nota já é alta para um Round 1.

**Por que NÃO é 10:**

1. **A rede de segurança depende de um único fio truncável (P1+P2).** Numa tecnologia dedicada ao bem-estar, o caminho para ajuda humana em crise é o requisito mais sagrado — e hoje ele é um link de 12px sem ícone que *corta em mobile*, sem segunda via, porque "Você" é stub. Enquanto a pessoa mais vulnerável puder não encontrar a saída no momento exato em que precisa, não há 10.

2. **Autonomia (export/delete) ainda não está nas mãos da pessoa (P2).** Coletar diário emocional íntimo sem dar, no mesmo gesto, o controle de exportar e apagar é uma assimetria que precisa ser fechada antes de chamar isto de pronto. Faseamento não suspende o princípio.

3. **O ponto cego do companion (P3) está intocado.** O design protege brilhantemente contra o vício de gamificação, mas é silencioso sobre o risco mais sutil e específico deste produto: a IA deslocar o vínculo humano. Um produto de bem-estar precisa, por design, devolver a pessoa ao mundo — não só recebê-la. Sem isso, corremos o risco de otimizar relatedness para baixo enquanto a retenção sobe.

Resolvidos P1, P2 e P3 — proeminência calma-mas-inconfundível da crise + redundância, export/delete acessíveis, e um princípio de design explícito de "te devolvo ao mundo" — eu subo facilmente para 9+. O teto de 10 fica reservado para quando o produto puder provar, com a pessoa vulnerável das 2h da manhã no centro, que cuida do bem-estar dela inclusive quando isso significa ela usar o Anipis *menos*.

— Calvo. Designing technology that helps people thrive. 🌿
