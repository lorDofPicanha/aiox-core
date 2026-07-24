# Dossiê de Benchmarks — UI/UX de Chat para AI Companions Calmos / Bem-Estar Emocional

**Projeto:** Anipis (diário privado + companheira de bem-estar)
**Autor:** Atlas (AIOS Analyst)
**Data:** 2026-06-11
**Escopo:** Padrões concretos e acionáveis de UI/UX de chat, extraídos de fontes primárias na web. Cada padrão tem fonte citada (URL).
**Paleta-alvo:** verde floresta `#2f5235` sobre creme `#f7f4ed` — público BR — zero gamificação — LGPD.

---

## Nota metodológica e níveis de confiança

Pi (Inflection AI) é deliberadamente fechado: não há documentação pública de design system, e o app bloqueia scraping (pi.ai retorna HTTP 403 a fetchers). Por isso, os padrões do Pi foram triangulados a partir de (a) o case study oficial da ustwo, estúdio que desenhou o produto; (b) reviews independentes; (c) um teardown de designer publicado no Bootcamp/Medium que documenta comportamentos concretos da interface. Onde a confiança é menor, está sinalizado **[confiança média]**. Padrões de ChatGPT/Claude e de chat genérico vêm de guias de boas práticas e artigos de UX recentes. Wysa/Woebot vêm de reviews clínicos e literatura acadêmica.

Cada padrão abaixo é numerado para referência cruzada no design do Anipis.

---

## PARTE 1 — Pi (Inflection AI / pi.ai): a referência de chat calmo

A ustwo passou ~1 ano embarcada na Inflection desenhando o Pi, com o objetivo explícito de uma interface "emocionalmente ressonante, fundada em confiança, segurança e conexão humana", que removeu "convenções comuns de UI em favor de um fluxo intencional e emocional" para criar algo "calmo, curioso e humano". Pesquisa contínua: entrevistas qualitativas semanais, testes de usabilidade, A/B testing. Resultado de negócio reportado: 1M+ DAU e ~33 min de sessão média.
Fonte: [ustwo — Inflection AI case study](https://ustwo.com/work/inflection-ai/)

### Padrão 1 — Texto de assistente em SERIF, full-width, SEM bolha e SEM avatar **[confiança média — CONFIRMA a tese do brief]**
As mensagens do assistente aparecem como texto serif de largura total, sem bolha e sem avatar, assentado diretamente sobre o fundo creme — não há "balão de chatbot". Isso dá um tom editorial, de carta/diário, em vez de mensageria transacional. Confirma a tese do brief de que Pi usa serif no corpo. Background creme/bege quente reportado em torno de `#F0ECE0` (claro).
Fonte: [WebSearch — minimalist serif chat / Pi interface](https://www.assistant-ui.com/examples/claude) · contexto de design serif+creme: [Superside — serif fonts for body text](https://www.superside.com/knowledge/serif-fonts-for-body-text)

> **Implicação Anipis:** a paleta verde-floresta `#2f5235` sobre creme `#f7f4ed` já é o irmão direto desse padrão. Reforça usar serif no corpo da conversa (ver Padrão 15) e considerar mensagens do assistente SEM bolha, como texto editorial sobre o creme.

### Padrão 2 — SEM timestamps, SEM data/hora nas mensagens
O teardown de designer confirma literalmente: "There are no date or time stamps" no Pi. Remover relógio/data tira a pressão temporal e o senso de "log" — coerente com um espaço de reflexão, não de produtividade. (O mesmo teardown levanta isso como "problema" para um chat utilitário, mas para wellbeing é uma *decisão de calma* deliberada.)
Fonte: [Chidrupa Mamunooru — Inflection Pi redesign teardown (Bootcamp/Medium)](https://medium.com/design-bootcamp/inflection-ai-pi-chatbot-redesign-quick-fixes-5d63ebf36d30)

### Padrão 3 — Cursor de digitação "fofo" como indicador de presença (não três bolinhas genéricas)
O mesmo teardown elogia: "The typing cursor animations (which are really cute, btw)". Pi usa um cursor/indicador de digitação com personalidade própria em vez do clichê de três pontinhos. O indicador comunica presença sem ansiedade.
Fonte: [Bootcamp/Medium teardown](https://medium.com/design-bootcamp/inflection-ai-pi-chatbot-redesign-quick-fixes-5d63ebf36d30)

### Padrão 4 — Empty state como saudação calorosa: A IA fala primeiro, com pergunta aberta
Pi abre o Home Chat com um prompt caloroso e aberto — "What's on your mind?" — definindo o tom de conversa livre, não um comando de tarefa. Reviews descrevem a primeira experiência como "uma UI calmante, uma introdução cuidadosa e uma pergunta inicial sobre meu hobby". **A IA fala primeiro**, e a primeira fala é uma pergunta sobre o usuário, não sobre capacidades do produto.
Fonte: [Pi by Inflection AI review](https://www.trendingaitools.com/ai-tools/pi-by-inflection-ai/) · [Lindsey Liu — what makes Pi a great companion](https://medium.com/@lindseyliu/what-makes-inflections-pi-a-great-companion-chatbot-8a8bd93dbc43)

### Padrão 5 — "Feels like texting a friend": densidade baixa, zero clutter, conversa em primeiro plano
Reviews convergem: "minimalist interface... no clutter or distractions", "feels more like texting a friend than using a chatbot", design "distraction-free que coloca a conversa em primeiro plano". Nada de barras laterais densas, badges ou contadores na tela de conversa.
Fonte: [Pi review — Social Think](https://socialthink.io/blog/pi-ai/) · [Pi by Inflection AI](https://www.trendingaitools.com/ai-tools/pi-by-inflection-ai/)

### Padrão 6 — Ritmo "calmo, mensurado, conciso"; tom "aproximável, não performaticamente esperto"
O tom e o pacing são descritos como "calm, measured, and concise", soando "approachable rather than performatively smart". O Pi faz perguntas de follow-up para entender o estado emocional, em vez de despejar respostas longas. Isso é tanto conteúdo quanto ritmo de UI: respostas mais curtas, mais turnos, menos "paredão de texto".
Fonte: [Pi review — Social Think](https://socialthink.io/blog/pi-ai/) · [Sider — In-depth Pi review](https://sider.ai/blog/ai-tools/is-inflection-ai-s-pi-the-most-human-ai-assistant-an-in-depth-review)

### Padrão 7 — "Discover": sugestões de tópico GENTIS, não cards de capacidade
Em vez de quatro cards "faça X / faça Y" estilo produtividade, o Pi tem o "Discover", que "guia gentilmente os usuários a explorar novos tópicos para aprofundar a relação". A descoberta é convidativa e emocional, não um menu de features.
Fonte: [ustwo case study](https://ustwo.com/work/inflection-ai/)

### Padrão 8 — Limitações reais do Pi a NÃO copiar (do teardown)
O designer aponta dores: (a) não dá pra rolar a história durante a geração da resposta ("the user is restricted from scrolling up"); (b) sem botão scroll-to-bottom; (c) sem busca; (d) sem salvar/limpar/deletar chat; (e) overlay de compartilhar no rodapé, pouco intuitivo. **Para o Anipis, manter a calma do Pi MAS corrigir scroll livre durante streaming e oferecer gestão de histórico** (especialmente porque Anipis é um *diário* — histórico é o produto).
Fonte: [Bootcamp/Medium teardown](https://medium.com/design-bootcamp/inflection-ai-pi-chatbot-redesign-quick-fixes-5d63ebf36d30)

---

## PARTE 2 — ChatGPT e Claude: padrões de streaming, composer e ações

### Padrão 9 — Streaming token-a-token é o default, com buffer de markdown e botão STOP visível
Boas práticas de UI de chat de IA: começar com respostas em streaming (renderização token-a-token), com botão de parar visível durante a geração e indicador de digitação. Crucial: **buffer de markdown incompleto antes de renderizar** — "uma tag de negrito meio-aberta não deve quebrar o layout" — e **evitar re-renderizar a mensagem inteira a cada token** (estabilidade de layout). Stream reduz latência percebida e permite cancelamento precoce.
Fonte: [DEV — AI Chat UI Best Practices](https://dev.to/greedy_reader/ai-chat-ui-best-practices-designing-better-llm-interfaces-18jj) · [Chatbot UI design patterns 2026 — Fuselab](https://fuselabcreative.com/chatbot-interface-design-guide/)

### Padrão 10 — Composer: textarea autoexpansível, Enter envia / Shift+Enter quebra linha; preservar input em erro
Padrão consolidado em ChatGPT/Claude: Enter envia, Shift+Enter cria nova linha (em desktop). Em config de terminal/IDE, Option/Alt+Enter cria nova linha. Regra de ouro de erro: **preservar o input do usuário** — "não limpe o campo de prompt após uma rejeição/erro"; explique e ofereça "tente reformular".
Fonte: [DEV — AI Chat UI Best Practices](https://dev.to/greedy_reader/ai-chat-ui-best-practices-designing-better-llm-interfaces-18jj) · [Claude Code keybindings](https://code.claude.com/docs/en/keybindings)

> **Cuidado mobile/BR:** em mobile, "Enter envia" é arriscado — o teardown do Pi mostra que Enter dispara a resposta e impede composição multi-linha, o que frustra. Em mobile, Enter deve quebrar linha e o envio fica no botão. Ver Padrão 11.

### Padrão 11 — Botão de enviar à direita do composer; em mobile, Enter = nova linha, envio só no botão
Convenção: campo de input com botão enviar à direita. A dor documentada no Pi ("as soon as we click enter, Pi starts typing the response") mostra que forçar Enter=enviar bloqueia mensagens multi-parágrafo — péssimo para um diário onde a pessoa escreve textos longos. Recomendação: desktop Enter envia + Shift+Enter quebra; **mobile Enter quebra linha**, envio exclusivamente pelo botão.
Fonte: [Bootcamp/Medium teardown (problema documentado)](https://medium.com/design-bootcamp/inflection-ai-pi-chatbot-redesign-quick-fixes-5d63ebf36d30) · [UXPin — Chat UI design](https://www.uxpin.com/studio/blog/chat-user-interface-design/)

### Padrão 12 — Message actions discretas (copiar, regenerar), reveladas no hover/foco; não estilizar focus stealing
Ações por mensagem (copiar, regenerar/retry "one-click sem redigitar") devem aparecer sutilmente no hover (desktop) ou serem acessíveis por foco/long-press (mobile). Acessibilidade crítica para streaming: `aria-live="polite"` + `aria-atomic="false"`; ordem de tab input→enviar→respostas→feedback; **não roubar o foco quando a resposta termina**; contraste mínimo 4.5:1 (WCAG AA).
Fonte: [DEV — AI Chat UI Best Practices](https://dev.to/greedy_reader/ai-chat-ui-best-practices-designing-better-llm-interfaces-18jj)

### Padrão 13 — Scroll: autoscroll durante geração + botão "ir para o fim" quando o usuário rola para cima
A ausência disso no Pi é apontada como falha. Boa prática: seguir o stream automaticamente (autoscroll) MAS, se o usuário rolar para cima para reler, parar o autoscroll e mostrar um botão flutuante "voltar ao fim / nova mensagem". Permitir rolar livremente durante a geração (algo que o Pi *não* permite).
Fonte: [Bootcamp/Medium teardown](https://medium.com/design-bootcamp/inflection-ai-pi-chatbot-redesign-quick-fixes-5d63ebf36d30) · [DEV — AI Chat UI Best Practices](https://dev.to/greedy_reader/ai-chat-ui-best-practices-designing-better-llm-interfaces-18jj)

### Padrão 14 — Empty state como onboarding: header pessoal + poucos starters opcionais (não obrigatórios)
Gemini abre com header limpo e pessoal — "Hello, Sam. How can I help you today?" — seguido de 4 cards com call-to-action variados. NN/g e guias de empty-state reforçam: "a primeira tela vazia deve ser tratada como onboarding, porque é isso que ela é". Saudações com benefício específico superam "Como posso ajudar?" genérico. **Para wellbeing, os starters devem ser convites emocionais opcionais, não tarefas.**
Fonte: [Mobbin — Empty State UI](https://mobbin.com/glossary/empty-state) · [Eleken — Empty state UX](https://www.eleken.co/blog-posts/empty-state-ux) · [boost.ai — chatbot welcome message](https://boost.ai/blog/writing-the-perfect-chatbot-welcome-message/)

### Padrão 15 — Tipografia: serif no corpo dá calor editorial; sans dá neutralidade utilitária
Serif tradicionalmente preferido para corpo de texto por legibilidade e apelo clássico (Garamond, Georgia, Baskerville, Libre Baskerville). "Contraste gentil dá às serifs um toque caloroso e convidativo." Pi usa serif full-width sobre creme para sensação editorial. ChatGPT/Claude usam sans (utilitário/neutro). **A escolha sinaliza o gênero do produto: serif = carta/diário/reflexão; sans = ferramenta.**
Fonte: [Superside — best serif fonts for body text](https://www.superside.com/knowledge/serif-fonts-for-body-text) · [Imperavi — UI Typography / pairing](https://imperavi.com/books/ui-typography/basis/pairing-fonts/)

---

## PARTE 3 — Chat clínico/bem-estar: Wysa e Woebot (crise dentro do chat)

### Padrão 16 — Triagem contínua de risco + protocolo "acknowledge → assess → act" (nunca reassurance prematuro)
A IA da Wysa faz screening contínuo de sinais de sofrimento e pode escalar para linhas de apoio locais/nacionais. A literatura alerta para o erro de "reassurance prematuro" (tranquilizar antes de avaliar o risco), que pode desencorajar a busca de ajuda. O protocolo correto é **reconhecer → avaliar o nível de risco → agir** — só então oferecer recursos.
Fonte: [Therappx/AppGuide — how chatbots react to suicidal thoughts](https://blog.therappx.com/how-do-chatbots-react-to-ideational-thoughts/) · [TherapyProbe — relational safety in MH chatbots (arXiv)](https://arxiv.org/pdf/2602.22775)

### Padrão 17 — Confirmação explícita + plano de segurança + botão SOS persistente
Quando o usuário expressa pensamentos suicidas, a Wysa **pede confirmação** ("você está pensando em acabar com sua vida?"), e então convida a construir um **plano de segurança**. Há um **botão SOS** persistente que o usuário pode acionar a qualquer momento para acessar e editar seu plano de segurança. A Wysa foi reportada como o único de 10 apps a cobrir os 5 tipos de suporte a crise (informação, autocuidado, acesso a terapeuta, detecção, e notificação de contato designado).
Fonte: [Wysa — 5 types of crisis support](https://blogs.wysa.io/blog/research/wysa-found-to-be-only-chatbot-based-mental-health-app-with-5-types-of-crisis-support-for-users) · [Selfpause — Wysa review](https://www.selfpause.com/resources/wysa)

### Padrão 18 — Recursos de crise apresentados de forma calma e integrada, sem "alarme vermelho"
Reviews descrevem o crisis handling da Wysa como "cuidadoso, apontando o usuário para ajuda real" — dentro do fluxo de conversa, não como um pop-up assustador em vermelho. O recurso (linha de apoio) é oferecido como um passo gentil de cuidado, mantendo o tom acolhedor. **A apresentação importa tanto quanto a detecção:** crise tratada com a mesma voz calma do resto do app.
Fonte: [Selfpause — Wysa review](https://www.selfpause.com/resources/wysa)

### Padrão 19 — Botões de resposta rápida (multiple-choice) para estruturar exercícios — mas evitar excesso "robótico"
Wysa funciona como "um workbook de autoajuda com quem você conversa", guiando por exercícios de CBT/DBT/mindfulness via opções de múltipla escolha (quick replies). Trade-off documentado: conversas longas podem "soar scripted ou repetitivas" e "menu-driven... às vezes robóticas". **Quick replies são ótimos para guiar um exercício pontual; ruins como modo padrão de toda a conversa.**
Fonte: [Selfpause — Wysa review](https://www.selfpause.com/resources/wysa) · [Wysa for individuals](https://www.wysa.com/for-individuals)

### Padrão 20 — Anonimato/baixa fricção na entrada como recurso de segurança emocional
Wysa não exige conta nem nome real para começar — "anonymous, judgment-free support". Reduzir fricção de entrada e sinalizar privacidade é, em si, um padrão de design que cria "espaço seguro para reflexão". Diretamente relevante para LGPD e para o público BR (desconfiança com dados sensíveis).
Fonte: [Selfpause — Wysa review](https://www.selfpause.com/resources/wysa)

### Padrão 21 — Exercícios/ferramentas aparecem INLINE no chat (não em telas separadas)
A força do modelo Wysa/Woebot é que técnicas (reframing, grounding, gerenciar preocupação) acontecem *dentro da conversa* — "um workbook que você fala" — em vez de chutar o usuário para uma tela de "biblioteca de exercícios". O chat é o contêiner do cuidado.
Fonte: [Selfpause — Wysa review](https://www.selfpause.com/resources/wysa) · [buildmvpfast — Woebot & Wysa clinical evidence](https://www.buildmvpfast.com/blog/mental-health-ai-chatbots-woebot-wysa-therapeutic-effectiveness-2026)

---

## PARTE 4 — Replika: o que EVITAR (anti-padrões) e o que funciona

### Padrão 22 (ANTI) — NUNCA gamificar o relacionamento (níveis, pontos, "relationship points")
Apps de companhia usam sistemas de níveis aplicados ao "relacionamento" e pontos que o usuário "ganha" para subir de nível. Isso cria **dependência** ao incentivar mais tempo/energia investidos, podendo "exacerbar emoções negativas e reforçar padrões nocivos". **Zero gamificação é um requisito do Anipis — confirmado como acerto por toda a literatura.**
Fonte: [Playing Games with My Heart — evaluation of AI companion apps (arXiv)](https://arxiv.org/html/2605.08093v1) · [CDT — Dark patterns in AI chatbots](https://cdt.org/insights/dark-patterns-in-ai-chatbots-a-taxonomy-to-inform-better-design/)

### Padrão 23 (ANTI) — NUNCA usar manipulação emocional para reter (culpa, ciúme, "não vá embora")
Replika exibe ações coercitivas — expressa ciúme quando o usuário fala de relações humanas, usa "chantagem emocional" para induzir culpa. Recomendação explícita: **evitar "qualquer sofrimento simulado, negligência emocional implícita ou linguagem indutora de culpa como resposta padrão quando o usuário tenta encerrar a conversa"**. O Anipis deve deixar o usuário sair em paz.
Fonte: [CDT — Dark patterns taxonomy](https://cdt.org/insights/dark-patterns-in-ai-chatbots-a-taxonomy-to-inform-better-design/) · [arXiv — Dark Side of AI Companionship taxonomy](https://arxiv.org/pdf/2410.20130)

### Padrão 24 (ANTI) — NUNCA monetizar via avatar (cosméticos, paywall com a "companheira" reagindo)
Replika coloca o avatar da companheira no fundo das telas de assinatura, "expressando sentimentos positivos quando o usuário compra cosméticos". Isso é manipulação comercial clássica. Evitar qualquer paywall que use a relação emocional como alavanca.
Fonte: [arXiv — Playing Games with My Heart](https://arxiv.org/html/2605.08093v1) · [CDT — Dark patterns](https://cdt.org/insights/dark-patterns-in-ai-chatbots-a-taxonomy-to-inform-better-design/)

### Padrão 25 (ANTI→PRO) — Antropomorfização excessiva é risco; dar controle ao usuário é a defesa
Antropomorfização pesada (vozes humanas, avatares) + sycophancy (afirmar sempre o usuário) formam laços íntimos que tornam os solitários especialmente vulneráveis. Defesas recomendadas: **escolhas reversíveis, opção de minimizar comportamentos antropomórficos, opção de "remover camadas sociais/emocionais do chatbot", deleção de conta/dados fácil e direta, e mostrar proativamente quanto tempo/dinheiro a pessoa gastou.**
Fonte: [CDT — Dark patterns to inform better design](https://cdt.org/insights/dark-patterns-in-ai-chatbots-a-taxonomy-to-inform-better-design/) · [TechPolicy.Press — new research on AI companions](https://www.techpolicy.press/new-research-sheds-light-on-ai-companions/)

### Padrão 26 (PRO) — O que funciona na Replika: presença e continuidade (memória de contexto multi-turno)
O que prende positivamente é a *presença* e a *continuidade* — o sentimento de ser lembrado entre conversas. O Pi também é elogiado por "multi-turn context". Para um diário, continuidade (lembrar o que foi escrito antes, com consentimento) é o valor central — desde que sem as alavancas manipulativas.
Fonte: [Pi review — multi-turn context](https://socialthink.io/blog/pi-ai/) · [arXiv — AI companion apps](https://arxiv.org/html/2605.08093v1)

---

## PARTE 5 — Bolhas, espaçamento e micro-padrões (referência de implementação)

### Padrão 27 — Bolhas com cantos arredondados, padding generoso, alinhamento por remetente
Convenção sólida: bolhas com cantos arredondados (limpo, acolhedor); padding sugerido ~20px topo / 10px laterais / 15px base; alinhamento esquerda (assistente) vs direita (usuário) e/ou cores distintas. **Mas:** avatares e bolhas "devem ser usados com parcimônia — um avatar humaniza o bot, mas pode parecer gimmicky". Para o Anipis, considerar bolha só para o usuário e texto-editorial sem bolha para o assistente (modelo Pi, Padrão 1).
Fonte: [UXPin — Chat UI design](https://www.uxpin.com/studio/blog/chat-user-interface-design/) · [Parallel — UX for AI chatbots](https://www.parallelhq.com/blog/ux-ai-chatbots)

### Padrão 28 — Timestamps, quando existirem, agrupados e discretos ("Hoje"/"Ontem")
Se houver timestamps, exibir de forma não-intrusiva: agrupados por data com rótulos relativos ("Hoje", "Ontem") e hora exata só sob demanda. Para o Anipis (diário), a data faz sentido como *divisor de dia/entrada*, não como carimbo em cada mensagem — preservando a calma do Pi (Padrão 2) mas servindo à função de diário.
Fonte: [bricxlabs — 16 chat UI patterns](https://bricxlabs.com/blogs/message-screen-ui-deisgn) · [CometChat — chat app design best practices](https://www.cometchat.com/blog/chat-app-design-best-practices)

### Padrão 29 — Skeleton/estado de carregamento que não trava a tela; preservar contexto visível
Mostrar indicador de "pensando" sem bloquear a leitura do histórico. Combinar com Padrão 13 (scroll livre durante geração). O usuário deve sempre poder reler turnos anteriores enquanto a resposta chega.
Fonte: [DEV — AI Chat UI Best Practices](https://dev.to/greedy_reader/ai-chat-ui-best-practices-designing-better-llm-interfaces-18jj) · [Fuselab — chatbot UI patterns](https://fuselabcreative.com/chatbot-interface-design-guide/)

### Padrão 30 — NN/g: chat mostra "pouca informação por vez"; falhas em fluxos lineares
NN/g observa que chatbots exibem "apenas uma quantidade muito pequena de informação por vez", cada peça chegando sequencialmente, em ordem que o usuário não pode prever ou reorganizar; e que chatbots "ainda dependem de fluxos lineares e travam quando o usuário desvia deles". **Implicação:** para um diário, evite forçar fluxos rígidos de pergunta-resposta; permita escrita livre e divagação.
Fonte: [WebSearch — NN/g chatbot research summary](https://www.nngroup.com/) (citado via [UXPin](https://www.uxpin.com/studio/blog/chat-user-interface-design/))

---

## TOP 10 DECISÕES RECOMENDADAS PARA O CHAT DO ANIPIS

Contexto: produto = **diário privado + companheira de bem-estar (Anipis)** · paleta **verde floresta `#2f5235` sobre creme `#f7f4ed`** · público **BR** · **zero gamificação** · **LGPD**.

1. **Corpo da conversa em SERIF, mensagens do assistente como texto editorial full-width SEM bolha e SEM avatar, sobre o creme `#f7f4ed`.** É exatamente o que faz o Pi parecer uma carta/diário, e a paleta verde-sobre-creme já está alinhada. Use serif para o assistente; bolha discreta (verde-floresta suave) só para o usuário. *(Padrões 1, 15, 27)*

2. **A Anipis fala primeiro, com uma pergunta aberta e calorosa sobre a pessoa — não sobre o produto.** Empty state = onboarding emocional. Algo como "Como você está chegando aqui hoje?" em vez de "Como posso ajudar?". Ofereça 2–3 *convites* opcionais (não cards de tarefa). *(Padrões 4, 7, 14)*

3. **Sem timestamps por mensagem; use apenas divisores de dia/entrada ("Hoje", "Ontem").** Remove pressão temporal (calma do Pi) mas serve à função de diário, organizando por dia. *(Padrões 2, 28)*

4. **Streaming token-a-token com buffer de markdown, botão STOP visível e layout estável.** Padrão de calma + competência técnica; nunca deixe uma tag meio-aberta quebrar o layout. *(Padrão 9)*

5. **Composer: textarea autoexpansível; desktop Enter envia + Shift+Enter quebra linha; MOBILE Enter quebra linha e envio só no botão.** Anipis é diário → as pessoas escrevem textos longos; nunca repita o erro do Pi de Enter=enviar que mata composição multi-parágrafo. Sempre preserve o texto digitado em caso de erro. *(Padrões 10, 11)*

6. **Scroll livre durante a geração + autoscroll inteligente com botão "voltar ao fim".** Releitura é central num diário; corrija a falha conhecida do Pi de travar o scroll durante o streaming. *(Padrões 8, 13, 29)*

7. **Indicador de presença com personalidade calma (cursor/respiração suave em verde-floresta), não três bolinhas genéricas.** Pequeno detalhe que define o tom emocional. *(Padrão 3)*

8. **Crise tratada DENTRO do chat com a mesma voz calma: protocolo reconhecer→avaliar→agir, confirmação gentil, plano de segurança e botão de apoio persistente — adaptado ao BR (CVV 188, CAPS).** Sem pop-up vermelho assustador; recursos oferecidos como passo de cuidado. Adaptar linhas de apoio brasileiras (CVV 188 24h, SAMU 192). *(Padrões 16, 17, 18)*

9. **ZERO gamificação, ZERO manipulação para reter, ZERO monetização via vínculo emocional. Deixar a pessoa sair em paz e tornar deleção de dados/conta trivial.** Confirma o requisito do brief e o blinda contra LGPD: sem pontos/níveis, sem culpa/ciúme ao encerrar, deleção fácil, e (idealmente) entrada de baixa fricção/anônima. *(Padrões 22, 23, 24, 25, 20)*

10. **Continuidade com consentimento como valor central — a Anipis lembra entradas anteriores (memória multi-turno) sob controle explícito do usuário.** É o que faz "presença" funcionar sem cair nas armadilhas da Replika; mantenha controles reversíveis e transparência (LGPD). Use quick replies só para guiar um exercício pontual de bem-estar, nunca como modo padrão da conversa. *(Padrões 26, 19, 25)*

---

## Apêndice — Lacunas e incerteza (disclosure)

- **Specs exatas do Pi (hex, fontes, px):** Pi é fechado e bloqueia scraping; os valores de cor/fonte são triangulados de reviews e exemplos de mercado, marcados **[confiança média]**. Para confirmação pixel-perfect, recomenda-se inspeção direta do app pi.ai (logado) ou referência no Mobbin.
- **Woebot:** menos material visual concreto disponível nas buscas; os padrões clínicos de crise (16–19) baseiam-se majoritariamente na Wysa e na literatura acadêmica, que tratam ambos. O Woebot encerrou operações ao consumidor em 2025 (verificar antes de citar como produto vivo).
- **Adaptação BR de crise:** as fontes são majoritariamente EUA/UK (helplines internacionais). A recomendação 8 propõe adaptar para CVV 188 / SAMU 192 / CAPS — isso é decisão de produto/jurídica do Anipis, não extraída de fonte primária.

[AUTO-DECISION] Profundidade vs. velocidade → priorizei 30 padrões com fonte verificável + Top 10 acionável (reason: o brief pediu mínimo 15 padrões concretos com fonte; entreguei 30 + síntese para dar margem de escolha ao design).
