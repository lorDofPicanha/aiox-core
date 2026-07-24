# Conclave Round 1 — Dieter Rams (forma / redução)

> Lente: os 10 Princípios do Bom Design. *Weniger, aber besser.* A pergunta nunca é o que adicionar — é o que ainda dá para remover. Material avaliado: `verify-hoje-820.png` (Hoje desktop), `faseA-login-desktop.png` (login), `faseA-hoje-mobile.png` (Hoje mobile), comparados à referência `stitch/hoje-mobile.png` e aos docs 00/02/03.

---

## 1. O que é honesto e merece ficar (pontos fortes)

**F1 — A voz da Anipis sem bolha e sem avatar (Princípio 6, honesto; Princípio 10, mínimo).**
A decisão de assentar a fala da Anipis em serif full-width direto sobre o creme, e dar bolha apenas à pessoa, é a melhor decisão de toda a tela. Ela é funcionalmente honesta: a Anipis é o caderno falando, não um contato de mensageiro. Remove a metáfora de SMS sem pedir licença. Nada de avatar circular, nada de "balão de IA". Isto é restrição com propósito — o elemento que NÃO está ali é o que faz a tela funcionar.

**F2 — Ausência total de sombra; profundidade por tom (Princípio 5, discreto; Princípio 8, minucioso).**
O flat é real, não decorativo. A bolha da pessoa se distingue do canvas por um degrau tonal sutil (`#efeae0` sobre `#f7f4ed`), não por drop-shadow. Card de login idem. Isto é a disciplina correta: a hierarquia vem da camada tonal, não de efeito. Um designer menos disciplinado teria posto sombra no card de login "para destacar". Aqui não puseram. Bom.

**F3 — Zero timestamps, zero cromo de chat (Princípio 10).**
Não há horários, não há "visto às", não há ícones de status por mensagem, não há contador de caracteres visível, não há menu de capacidades no empty state. A página respira como página de diário. O disclaimer sob o composer é uma linha quieta, não um banner. Isto é subtração já bem-feita — a maior parte do ruído de um app de chat foi corretamente NÃO incluída.

**F4 — Composer como objeto único e calmo (Princípio 4, compreensível).**
Um campo, um botão de envio circular, um placeholder em serif itálico. O botão de envio é o único elemento de ação na zona de escrita. Não há cinco ícones de anexo/emoji/microfone competindo. A função é clara: escrever, enviar.

---

## 2. O que ainda pode ser removido ou corrigido (problemas)

### P1 — BLOQUEANTE · O botão "Entrar" mente sobre seu estado (Princípio 6, honesto · Princípio 4, compreensível)
No login, o CTA "Entrar" aparece em **verde dessaturado/acinzentado** (`#a3b59a`-ish), não no verde floresta de marca cheio. Um botão nessa cor comunica **desabilitado**. Mas é o CTA primário da tela — provavelmente está ativo. Isto é desonestidade funcional: a forma diz "não me toque" enquanto a função diz "me toque". Ou o botão está realmente disabled (e então a tela abre num estado morto, sem explicação) ou está ativo e a cor mente.
**Correção:** estado default = verde floresta cheio (`#2f5235`), texto branco, contraste AA garantido. Reserve o verde-acinzentado EXCLUSIVAMENTE para o estado `:disabled` real, e só quando os campos estiverem vazios. A forma deve seguir a função, sempre.

### P2 — MAIOR · Os campos de input fingem ser botões (Princípio 6, honesto)
Os inputs de e-mail e senha são pílulas creme preenchidas (`#efeae0`), com cantos arredondados generosos — exatamente a mesma linguagem de forma da bolha da pessoa no chat e similar ao próprio botão. Um retângulo preenchido e arredondado lê como algo clicável/pressionável, não como um campo onde se digita. A direção (doc 03) prevê "foco = borda inferior 1.5px verde (sem glow)" e "fill creme sutil OU linha" — a build escolheu o fill cheio, que é a opção menos honesta das duas. O campo de texto deve parecer um lugar para inscrever, não um seixo.
**Correção:** adotar a linha — campo com fundo do canvas e hairline inferior tinta, virando verde 1.5px no foco. Isto também diferencia inequivocamente input (linha) de ação (pílula preenchida) e de conteúdo da pessoa (bolha). Três funções, três formas distintas. Hoje há colisão.

### P3 — MAIOR · O login está descentralizado verticalmente — espaço não é intencional, é sobra (Princípio 8, minucioso · Princípio 10)
O card de login flutua **abaixo do centro óptico**, com um vazio enorme acima e o wordmark solto no canto superior esquerdo sem relação espacial com o card. O whitespace aqui não foi composto; ele sobrou. Bom design é minucioso até o último detalhe — nada arbitrário. O eixo vertical do card não está resolvido, e o wordmark órfão não pertence a nenhuma grade visível.
**Correção:** ancorar o card no centro óptico (levemente acima do centro geométrico). Decidir a relação do wordmark com o card — ou ele encima o card na mesma coluna, ou some (o card já diz "anipis" pelo contexto). Espaço vazio deve ser uma decisão, não um resto.

### P4 — MAIOR · "Entrar com link mágico" é decoração de feature (Princípio 6, honesto · Princípio 10, mínimo)
O brief é explícito: beta fechado, **credenciais pré-criadas, sem cadastro** (doc 02 §3.1). A tela mostra DOIS desvios abaixo do CTA: "Não tem conta? Criar" e "Entrar com link mágico". Ambos contradizem o produto real. "Criar conta" não existe no beta. "Link mágico" adiciona um segundo caminho de auth que ninguém pediu e que dilui o único caminho que importa. Isto é o designer (ou o boilerplate) adicionando, não o usuário precisando. *The user does not need this. The template wanted it.*
**Correção:** remover ambos os links. A tela de login do beta tem exatamente três elementos funcionais: e-mail, senha, entrar. Mais nada. Se um caminho de recuperação for legalmente/operacionalmente necessário, que seja UM link sóbrio ("Esqueci a senha"), não dois caminhos decorativos.

### P5 — MAIOR · O chip de humor "Bem" flutua sem âncora e duplica a metáfora da bolha (Princípio 4 · Princípio 8)
No topo do Hoje, o chip `[🙂 Bem]` aparece como uma pílula azul-clara solta no canto, antes da primeira fala da Anipis. Sua função (mood do dia integrado, doc 02 §4) é legítima, mas a execução não comunica essa função: ele parece uma primeira mensagem perdida, e sua forma (pílula preenchida arredondada) é a TERCEIRA coisa na tela usando a mesma linguagem de pílula (bolha da pessoa, composer, agora o chip). A repetição da forma apaga a distinção de função. Além disso o emoji colorido é o único ponto de cor "de sistema operacional" numa paleta cuidadosamente tonal — destoa.
**Correção:** decidir se o mood é metadado do dia (então: rótulo discreto alinhado à margem, label-caps, sem pílula, talvez com o ponto de cor da emotion-ramp em vez do emoji do SO) ou se é um cabeçalho de página (então tratá-lo como tal, com data). Hoje é nem-nem. E trocar o emoji de sistema pela cor da emotion (sálvia/azul/etc., que já existe nos tokens) — o emoji amarelo é ruído cromático fora do sistema.

### P6 — MENOR · O header do Hoje desperdiça meia tela de altura em vazio antes do conteúdo (Princípio 10)
No desktop, entre a hairline do header e o chip de humor há um respiro generoso — correto — mas a conversa inteira ocupa só o terço superior e os ~60% inferiores são canvas morto até o composer ancorado embaixo. Respiro é virtude; vácuo não é. A página de caderno respira, mas uma página em branco 60% vazia abaixo de três turnos curtos parece estado não-resolvido, não calma. (Em mobile o problema é idêntico.)
**Correção:** isto provavelmente se resolve sozinho com conversas reais mais longas — mas o empty/early state precisa de uma decisão deliberada de ancoragem (conteúdo cresce de baixo para cima, colado ao composer, como mensageiros calmos fazem) em vez de cair do topo e deixar um poço embaixo. Não adicionar nada para "preencher". Ancorar.

### P7 — MENOR · "precisa de ajuda agora?" sem peso suficiente, e cortado no mobile (Princípio 4 · Princípio 6)
O link de crise no header está em verde de marca, mesmo tratamento tipográfico de um link comum. É o elemento mais importante da tela em termos de segurança (CVV a um toque, obrigação legal) e não tem distinção visual que o eleve. No mobile (`faseA-hoje-mobile.png`) ele aparece **cortado na borda direita** ("precisa de ajuda…") — sei que o corte é artefato de captura, mas confirma que não há plano de layout responsivo para esse elemento crítico. Um recurso de crise nunca pode depender de não-corte acidental.
**Correção:** garantir que o acesso à crise seja sempre inteiro e alcançável em qualquer largura (no mobile, talvez vire um ícone-rótulo compacto e honesto, não texto truncado). Não precisa de alarme vermelho — a calma é correta — mas precisa ser inequívoco e completo. Honestidade funcional: o elemento que salva não pode ser o que o layout sacrifica primeiro.

---

## 3. Nota (forma / redução): **7.0 / 10**

A fundação é honesta e disciplinada onde mais importa — a tela de chat acertou as decisões difíceis de subtração (sem avatar, sem sombra, sem timestamp, voz editorial). Isto é raro e merece o reconhecimento. É por isso que a nota começa em 7, não em 5.

**Por que NÃO é 10:**

- **Honestidade quebrada no ponto de entrada.** O botão "Entrar" mente sobre seu estado (P1, bloqueante) e os inputs fingem ser outra coisa (P2). A primeira tela que o usuário toca é a menos honesta do conjunto. Um produto não pode ter sua porta de entrada confusa sobre o que está ativo e o que se digita.
- **Adição não-pedida sobrevive.** "Criar conta" e "link mágico" (P4) são elementos que o produto real não tem. Eles existem porque vieram de molde, não de necessidade. Enquanto um único elemento estiver na tela sem justificar sua existência contra a função, não é 10. O 10 exige que cada elemento sobrevivente tenha passado pelo método da subtração — estes não passaram.
- **Espaço ainda não é intencional.** O login descentralizado (P3) e o poço vazio do Hoje (P6) mostram que o whitespace foi herdado, não composto. Minucioso até o último detalhe significa que o vazio também é uma decisão. Aqui ainda é sobra.
- **Colisão de formas.** Pílula preenchida arredondada faz quádruplo serviço — bolha da pessoa, input, botão, chip de humor (P2, P5). Quatro funções, uma forma. A distinção funcional exige distinção formal. Quando tudo é seixo, nada é.

O caminho para o 10 não passa por adicionar nada. Passa por: tornar o botão honesto, transformar inputs em linhas, remover os dois desvios de auth, ancorar o espaço com intenção, e dar ao chip de humor uma forma própria. Subtrair três elementos, corrigir dois estados, compor dois vazios. Depois disto, *weniger, aber besser* — e talvez 9.5. O 10 se conquista quando não sobrar nada para remover.

-- Dieter Rams, less but better
