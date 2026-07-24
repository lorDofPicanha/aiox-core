# Parecer Don Norman — Anipis Frontend v2 (Fase A), Round 1

> Lente: usabilidade, affordances, mapeamento, feedback, prevenção de erro — para uma pessoa possivelmente em sofrimento emocional.
> Artefatos vistos: `verify-hoje-820.png` (Hoje desktop), `faseA-login-desktop.png`, `faseA-hoje-mobile.png`, referência `stitch/hoje-mobile.png`. App ao vivo inspecionado (`localhost:3344`, CSS compilado).
> Método: Seis Princípios + Sete Estágios da Ação + três níveis emocionais + classificação de erro (slips/mistakes). Cada crítica referencia um princípio nomeado, nunca preferência pessoal. Quando uma pessoa tem dificuldade, a falha é do design, nunca dela.

---

## Nota preliminar de honestidade metodológica

Eu avalio o **system image** — o que estas telas comunicam. Não observei pessoas reais usando este produto, e em design para sofrimento emocional isso é uma lacuna real: a única forma de saber se a Anipis acolhe ou abandona é assistir alguém em crise tentando usá-la. Tudo abaixo é diagnóstico de especialista, não substituto de observação. Recomendo teste com 5 pessoas reais antes de declarar 10/10.

---

## 1. PONTOS FORTES (concretos)

**F1 — A Anipis fala primeiro, sem menu de capacidades (Hoje, empty state).**
Na tela Hoje, o primeiro turno é "Oi, Marina. Estou aqui com você. Pode começar por onde quiser — ou só desabafar." Isto é um acerto de **mapeamento conversacional e redução do Gulf of Execution**. A pessoa em sofrimento chega com uma meta vaga ("preciso desabafar") e nenhum plano de ação. Um menu de botões ("Fazer exercício / Ver humor / Conversar") forçaria a pessoa a traduzir dor em taxonomia — um gulf cruel. Em vez disso, o sistema afirma presença e devolve o turno em aberto. A página se explica sozinha: não preciso de manual para saber que escrevo de volta.

**F2 — Distinção visual de autoria sem rótulos (Hoje, ambos os layouts).**
A Anipis é serif full-width assentada no creme; a pessoa é bolha recessada à direita. Isto é **knowledge in the world** funcionando: a forma carrega a informação "quem disse o quê", então não preciso de avatares, nomes ou "Você:/Anipis:" — não preciso memorizar nada. O mapeamento (presença editorial = a companheira / objeto contido = minha fala) é natural e silencioso. É o tipo de design que desaparece no uso, que é exatamente o objetivo.

**F3 — Ajuda de crise persistente no header, e o token de crise é correto (`#8f2c1b`).**
"precisa de ajuda agora?" fica fixo no topo do Hoje, a um toque, em todos os estados. Confirmei no CSS que a cor de crise é o tijolo `#8f2c1b`, não o vermelho de erro — decisão certa: **o vermelho de alarme dispara o nível visceral de pânico**, e a última coisa que se quer numa pessoa já desregulada é um sistema gritando. A constância do signifier (sempre no mesmo lugar, mesma voz calma) é prevenção de erro no sentido mais literal: o caminho para socorro nunca se esconde, nunca muda de lugar, não exige descoberta no pior momento.

**F4 (bônus) — Fundação de acessibilidade presente nos tokens.**
Confirmei no CSS: `focus-visible` com outline 2px + offset 2px, `--min-height-touch:44px`/`--min-width-touch:44px` definidos, e um dark mode "madrugada" completo (importante — pessoas usam diário emocional à noite, na cama, no escuro). A fundação existe; o problema é que ela não está *aplicada visivelmente* em pontos críticos (ver P2, P3).

---

## 2. PROBLEMAS (cada um com severidade, princípio violado, correção)

### P1 — BLOQUEANTE · Affordance + Feedback: o botão "Entrar" desabilitado é indistinguível de um botão pronto, e não diz por quê.
**Tela:** `faseA-login-desktop.png`. O botão "Entrar" aparece em verde-sálvia dessaturado (estado disabled, opacity reduzida — confirmei no CSS `disabled{opacity:.4/.6}`), **não** no verde floresta `#2f5235` de ação.
**Princípio violado:** Affordance falsa + ausência de Feedback. O botão *parece clicável* (tem forma de pill, texto centrado, cor verde-ish) mas não responde. Pior: nada na tela explica que ele está inerte porque os campos estão vazios. A pessoa clica, nada acontece, e — porque o nível reflexivo de quem está fragilizado já está predisposto a auto-culpa — ela conclui "eu fiz errado" / "isto está quebrado / não querem me deixar entrar". Numa pessoa em sofrimento, a primeira fricção do app é uma porta que parece aberta e não abre. É uma Norman door logo na entrada.
**Correção:**
1. Estado disabled deve ser *inequivocamente* não-acionável: remover a aparência de pill verde, usar contorno/cinza neutro com texto explícito do gate ("Preencha e-mail e senha para entrar"), OU
2. **Melhor:** deixar o botão sempre habilitado e mover a validação para o clique, com feedback adjacente ao campo que falhou ("Falta o e-mail" abaixo do campo de e-mail). O melhor erro é o que se previne, mas o segundo melhor é o que se explica no exato lugar onde ocorreu. Hoje não há nenhum dos dois.

### P2 — BLOQUEANTE · Visibilidade + Mapeamento: no mobile, o composer está sobreposto pela tab bar — o ato central do produto fica obstruído.
**Tela:** `faseA-hoje-mobile.png`. O campo "Escreva o que estiver aí dentro…" aparece colado/atrás da tab bar (Hoje/Diário/Você), com o placeholder parcialmente cortado e **o botão de enviar não visível**. (A captura desktop e a referência Stitch mostram o composer íntegro com botão circular — então isto é falha de layout mobile, não da captura.)
**Princípio violado:** Visibilidade (não consigo ver o estado/controle principal) + Gulf of Execution (o ato de "escrever de volta" — a razão de existir da página — está fisicamente obstruído). Numa pessoa que finalmente juntou coragem para escrever algo difícil, encontrar o campo de escrita brigando com a navegação é exatamente o tipo de atrito que faz desistir antes do desabafo.
**Correção:** Garantir que composer e tab bar nunca colidam. O composer deve "flutuar" acima da tab bar com `env(safe-area-inset-bottom)` respeitado, ou a tab bar deve recolher quando o composer está em foco (o teclado já vai empurrar tudo — testar com teclado aberto em iOS e Android reais). O botão de enviar precisa estar sempre visível e com 44px reais de alvo.

### P3 — MAIOR · Constraint + Prevenção de erro (slip de modo): a regra "mobile: Enter quebra linha, envio só no botão" não tem signifier — vira armadilha de modo.
**Spec (02 §4) + telas:** No desktop Enter envia; no mobile Enter quebra linha e só o botão envia. Correto para diário (texto longo). MAS no mobile o botão de envio está obstruído (P2) e não há signifier dizendo "Enter aqui não envia". 
**Princípio violado:** Mode error (um slip clássico, Norman 2013). A pessoa traz o hábito de WhatsApp ("Enter = mandar") de outro contexto — é captura de hábito puro. Sem um signifier do modo atual, ela aperta Enter esperando enviar, ganha uma quebra de linha, e fica confusa sobre por que sua dor "não foi entregue".
**Correção:** Tornar o modo visível e o caminho de envio óbvio. No mobile: botão de enviar permanentemente visível e proeminente (resolve junto com P2); microcopy discreta no composer ("Toque para enviar") na primeira sessão; e considerar que a quebra-de-linha-no-Enter só ajuda quem *sabe* que ela existe — caso contrário é confusão projetada, não complexidade gerenciada.

### P4 — MAIOR · Feedback: não há evidência visível de que a Anipis "está pensando", nem de parar a geração — o Gulf of Evaluation se abre no pior momento.
**Telas:** Os estados capturados são todos pós-resposta (conversa completa). A spec (02 §4) pede indicador de digitação sereno (cursor pulsante), streaming token-a-token e botão parar — mas **nenhum desses estados foi entregue para avaliação na Fase A**. Não posso confirmar que existem; posso confirmar que o produto será julgado por eles.
**Princípio violado:** Feedback (Gulf of Evaluation). Entre "eu enviei minha dor" e "a resposta começa a aparecer" há um silêncio. Se esse silêncio não tiver feedback, a pessoa em sofrimento — que está hipervigilante a sinais de abandono — interpreta a pausa como "ela não respondeu", "fui ignorada", "travou". O sistema precisa dizer "estou aqui, processando o que você disse" instantaneamente após o envio.
**Correção:** Entregar e mostrar no próximo round: (a) `acknowledgment` → presença imediata (a bolha da pessoa "assenta" + indicador de Anipis pensando em <300ms); (b) streaming com layout estável (sem pulos que reflowam o texto já lido); (c) botão parar visível durante geração. E avaliar esses estados como artefatos REAIS, não só na spec.

### P5 — MAIOR · Signifier + Affordance: o chip de humor "🙂 Bem" no topo da conversa não comunica se é um controle ou um rótulo.
**Telas:** Hoje (desktop e mobile) mostram um chip "🙂 Bem" no canto superior esquerdo da conversa.
**Princípio violado:** Signifier ambíguo. A spec (02 §4) diz que o "mood do dia" é integrado no topo — presumivelmente *editável* (toco para mudar meu humor). Mas visualmente o chip não tem nenhum signifier de interatividade: sem seta, sem "alterar", sem affordance de toque. Resultado: ou a pessoa não descobre que pode registrar/mudar o humor (Gulf of Execution — funcionalidade invisível), ou ela acha que é só um enfeite. Pior caso reflexivo: registrei "Bem" no onboarding, o dia piorou, vejo "🙂 Bem" fixo me dizendo que estou bem quando não estou — o sistema me contradiz.
**Correção:** Dar ao chip um signifier de "isto muda" (ex.: ao lado do chip, "como está agora?" ou um ícone sutil de edição) OU deixar explícito que é um registro do check-in com caminho claro para reabrir. Se for editável, o toque precisa ser descobrível sem instrução.

### P6 — MENOR · Constraint cultural / Consistência: "Entrar com link mágico" e "Não tem conta? Criar" contradizem o modelo conceitual do beta.
**Tela:** `faseA-login-desktop.png`. O login mostra "Não tem conta? Criar" e "Entrar com link mágico".
**Princípio violado:** Conceptual model inconsistente. A spec (02 §3) é explícita: "Login — sem cadastro (beta fechado, credenciais pré-criadas)." Oferecer "Criar conta" a quem está num beta de convite cria um caminho que leva a lugar nenhum — uma promessa que o sistema não cumpre (Gulf of Execution que termina em frustração). "Link mágico" introduz um segundo método de autenticação que dobra a carga de decisão num momento em que a pessoa só quer entrar e ser acolhida ("Que bom te ver" pede simplicidade).
**Correção:** Para o beta fechado, remover "Criar conta" (ou trocar por "Recebi um convite / preciso de acesso" que aponta para o canal real). Decidir entre senha OU link mágico como caminho primário, não os dois lado a lado. Menos decisões na porta = menos atrito para quem chega frágil.

### P7 — MENOR · Visibilidade / Hierarquia: no desktop, a conversa "cola" no topo-esquerda enquanto o canvas creme domina a tela — a leitura perde seu eixo.
**Tela:** `verify-hoje-820.png`. O texto da conversa fica alinhado à esquerda num canvas largo, com vasto vazio à direita e abaixo. A spec (02 §4) pede "largura de leitura ~65ch centrada".
**Princípio violado:** Mapeamento de leitura / Visibilidade do foco. O respiro é uma virtude (não é dashboard), mas no desktop o conteúdo desancorado à esquerda num mar de creme faz a coluna de conversa parecer um fragmento perdido, não "a página aberta do meu caderno". O olho não tem âncora.
**Correção:** Centralizar a coluna de prosa em ~65ch como a própria spec define, dando à conversa um corpo de "página" com margens equilibradas. Isto reforça o modelo mental "caderno" (F2) em vez de "janela de chat encostada na borda".

---

## 3. NOTA DE USABILIDADE: **6,5 / 10**

### Por que não é 10 (ainda)

O **conceito** é dos mais humanos que já avaliei num produto de wellbeing: a Anipis fala primeiro, a forma carrega a autoria sem rótulos, a crise nunca se esconde, e a fundação de a11y existe nos tokens. Quando funciona, o design desaparece no uso — que é o elogio máximo. Isso sustenta a metade alta da nota.

Mas usabilidade não se julga pelo caminho feliz; julga-se pelo que acontece quando algo dá errado — e é aí que para uma pessoa em sofrimento o produto ainda machuca:

- **Dois BLOQUEANTES nos dois atos mais críticos:** a porta de entrada (botão "Entrar" que parece aberto e não abre, sem explicar — P1) e o ato central do produto (composer obstruído pela tab bar no mobile, sem botão de envio visível — P2). O primeiro e o último gesto da pessoa estão quebrados. Um produto de acolhimento não pode falhar exatamente nos momentos em que pede coragem.
- **Um silêncio não-resolvido (P4):** os estados de feedback durante a geração — presença, digitação, parar — não foram entregues para avaliação. Em diário emocional, o intervalo sem feedback *é* abandono percebido. Não posso dar 10 a estados que ainda não vi funcionar.
- **Armadilhas de modo e signifiers ambíguos (P3, P5):** Enter sem signifier de modo e chip de humor sem affordance de controle deixam a pessoa adivinhando. Toda vez que ela precisa adivinhar, o signifier falhou.

Nenhum destes é defeito de gosto — todos são princípios nomeados violados, e todos são corrigíveis sem reescrever o conceito. Corrija P1 e P2 (bloqueantes) e o produto sobe imediatamente para a faixa de 8. Entregue e prove os estados de feedback de conversa (P4) e resolva os signifiers (P3, P5), e o caminho para 9+ está aberto. O 10 só chega depois de **observar 5 pessoas reais** entrando, escrevendo sua primeira dor, recebendo resposta, e encontrando o socorro — sem que ninguém tenha que adivinhar nada. Nenhum design é final até testado com gente de verdade.

**Resumo das severidades:** 2 BLOQUEANTES (P1 login, P2 composer mobile) · 3 MAIORES (P3 modo Enter, P4 feedback de geração, P5 chip humor) · 2 MENORES (P6 login beta inconsistente, P7 ancoragem desktop).

-- Don Norman, designing for people as they are, not as we wish them to be
