# Conclave Round 2 (Adversarial) — Julie Zhuo (Produto + Coerência)

**Data:** 12/Jun/2026 · **Lente:** O produto é UM só? O flow inteiro sustenta a promessa? Round 1 eu dei **6.5**.

Li os cinco pareceres. A boa notícia: há uma convergência forte e honesta — Login quebrado, chip de humor órfão, estados de presença/crise não-vistos. Isso me dá confiança de que estamos vendo o mesmo produto. Minha função aqui é a coerência: garantir que nenhuma correção pontual de um colega crie uma incoerência sistêmica, e que ninguém esteja consertando uma tela enquanto ignora o flow.

---

## 1. REFUTO

**R1 — Don Norman (P1) e Rafael Calvo (P4): "deixar o botão Entrar SEMPRE habilitado e validar no submit".**
Discordo como decisão de *sistema*, não como decisão de tela. O Don está certo que o disabled-que-parece-pill-verde é uma porta-Norman — esse diagnóstico é impecável e eu endosso (ver E1). Mas a *correção* "sempre habilitado + erro no submit" otimiza a tela de login isolada e cria uma incoerência de produto: em todo o resto do Anipis (Hoje, composer) a regra é **prevenção silenciosa, nunca erro depois do gesto**. A Cathy é explícita sobre isso — repair humano, jamais "Erro. Tente de novo". Se o login me deixa clicar e só *depois* me joga "Falta o e-mail", eu introduzi o único lugar do produto onde o sistema pune a ação em vez de guiá-la. Num produto de acolhimento, a primeira tela ensinando "aja e seja corrigido" contradiz o tom de tudo que vem depois. A correção coerente é a do Dieter (P1): **estado disabled inequívoco e honesto** (não-pill, neutro) — o botão acende em verde floresta cheio quando os campos estão válidos. Isso resolve a porta-Norman SEM importar o padrão de erro-pós-clique. Prevenir, não punir — e prevenir *visível*.

**R2 — Rafael Calvo (P3): "fricção benéfica / convite de volta ao mundo / o sucesso é a pessoa usar MENOS o app", na Fase A.**
O princípio ético é correto e eu o respeito — mas como prioridade de *produto agora*, ele está otimizando uma esfera (relatedness/anti-dependência) que pressupõe um produto que a pessoa já ama e usa demais. Nós não temos esse problema: temos duas das três pernas da promessa como placeholder e um Login que pertence a outro produto. Construir "fricção benéfica de sessão longa" antes de o Diário existir é resolver o problema de sucesso antes de ter o produto. Pior, do ponto de vista de coerência: introduzir agora um "já é tarde, quer guardar pra amanhã?" sem que a metáfora do caderno (acúmulo, continuidade) esteja construída faz o gesto soar como um app de screen-time se intrometendo, não como uma companheira que conhece você. A fricção benéfica só é *coerente* depois que o Diário prova a tese. **Endosso o P3 como princípio de design documentado; refuto como item de fixlist da Fase A.** É P1 da Fase C, não da Fase A.

**R3 (menor) — Cathy Pearl (P5): variar o placeholder do composer por horário/contexto.**
Concordo que repetir a mesma frase todo dia "cheira a sistema". Mas cuidado com a incoerência: um *pool* de placeholders que muda sozinho pode ler como um sistema *tentando parecer* humano — o pior dos dois mundos, que é exatamente o que a Cathy alerta em outro ponto (UI-como-fala). A continuidade real ("e o que mais?") pertence à **voz da Anipis no corpo da conversa**, não ao chrome do composer. Manteria o placeholder inicial estável e calmo; mexer nele é polimento de baixa alavancagem que arrisca incoerência de voz. Baixa prioridade, quase um não-faça-ainda.

---

## 2. ENDOSSO

**E1 — Don Norman (P2): no mobile, o composer está obstruído pela tab bar, sem botão de enviar visível.** Este é o ponto mais importante de todos os cinco pareceres e eu subestimei seu peso no Round 1. É um BLOQUEADOR de produto, não de tela: o **ato central** — escrever no caderno — está fisicamente quebrado na superfície onde a maioria das pessoas vai usar (mobile, na cama, 2h da manhã). Não há promessa de "um caderno seu" se a pessoa não consegue escrever nele. Isso, sozinho, é um teto duro. Corrige antes de qualquer estética.

**E2 — Rafael Calvo (P1+P2) + Dieter (P7): a rede de crise depende de UM fio truncável.** A convergência aqui é total e me convence: o caminho de crise é texto de 12px, sem ícone, que *corta no mobile*, e a segunda via (em "Você") é stub. Em coerência de produto isto é grave porque o cuidado é a tese — e a tese tem um único ponto de falha exatamente no momento que mais importa. O Rafael acerta a síntese: calma e proeminência **não são opostos**. Um alvo sereno, com ícone, contraste AA, que nunca trunca, é a única leitura coerente de "cuidado estrutural, não decorativo".

---

## 3. VOTO nas questões contestadas

- **Q1 Inputs: (A) linha.** A pílula preenchida (Dieter P2) faz o input colidir com a bolha-da-pessoa e com o botão — três funções, uma forma. Linha hairline → verde no foco diferencia *inscrever* de *agir* de *minha fala*. Coerência formal = coerência de significado.
- **Q2 Chip de humor:** integrá-lo na **primeira fala da Anipis** ("vi que você chegou se sentindo bem hoje…") como conversa, não como pílula-status órfã — elimina a dissonância (Calvo P5), a ambiguidade de affordance (Norman/Dieter) e a quarta-repetição-da-pílula de uma vez só. Se precisar ser editável, vira um toque dentro dessa fala, não um carimbo fixo.
- **Q3 Crise:** alvo sereno **com ícone + rótulo curto ("ajuda")**, contraste AA, posição fixa que nunca trunca, **mais uma segunda via** (rodapé do composer) enquanto "Você" é stub. Proeminência por clareza e constância, não por cor de alarme.
- **Q4 Login beta:** **remover** signup e magic-link (não ocultar). Ocultar deixa o beco-sem-saída latente no código e na intenção; remover honra o modelo "uma forma de entrar". Único secundário legítimo: "Tem um convite? Use seu link".
- **Q5 Empty state:** **sem nome até o onboarding costurar.** Saudar "Oi, Marina" sem o handshake do onboarding é abrir um diário que já te chama pelo nome sem você ter dito qual era — incoerência de intimidade. O nome é *ganho* no onboarding; o Hoje só pode usá-lo depois que Login→Onboarding→Hoje rodar como uma respiração só.

---

## 4. PRIORIZAÇÃO — as 5 que mais movem a NOTA DE PRODUTO rumo a 10

A nota de produto é sobre o *flow inteiro* sustentar a promessa. As 5 que mais movem:

1. **Composer mobile desobstruído + botão enviar sempre visível (Norman P2).** Destrava o ato central no device principal. Sem isto, não há caderno.
2. **Refazer o Login no sistema FLAT + remover signup/magic-link (P1+P2 meu, Dieter P1-P4).** Mata a costura da primeira impressão e a incoerência de fluxo de uma vez. A promessa não pode quebrar antes do login.
3. **Construir o Diário navegável (meu P3).** É a perna que *prova a tese* — "caderno" vira experiência, não afirmação. Move a nota de produto mais que qualquer polimento, porque fecha 1 de 3 pernas que faltam.
4. **Crise inconfundível + segunda via (Calvo P1/P2, Dieter P7).** Transforma o cuidado de promessa em propriedade do esqueleto, em todas as larguras.
5. **Presença na espera (ack → typing sereno) + repair na voz da Anipis (Cathy P1/P2/P6).** Costura os dois vãos emocionais (silêncio pós-desabafo, falha) onde o produto hoje "vira software". Pequenas, cirúrgicas, alta alavancagem de coerência.

Onboarding navegável (ponte tonal Login→Hoje) é o 6º, logo atrás — habilita o Q5 e o nome no Hoje.

---

## 5. NOTA REVISADA

### Produto / Coerência: **6.5 / 10** (mantida)

Mantenho. O Round 2 não me deu evidência nova que mova a nota — me deu *convicção* de que o teto é real e bem-localizado: o flow ainda tem a costura visível no Login, duas pernas da promessa em placeholder, e o ato central quebrado no mobile (que eu subestimei). O consenso adversarial não afrouxa nada; aperta. A fundação continua certa (eixo Hoje/Diário/Você, "página não mensageiro") — o que falta é construção e costura, não reconcepção. Este é o 6.5 que vira 10 fechando o flow, não polindo telas.

-- Julie Zhuo, designing teams that design great things
