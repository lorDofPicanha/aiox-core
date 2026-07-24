# Parecer Don Norman — Round 2 (Adversarial), Anipis Frontend v2

> Lente: usabilidade — affordances, mapeamento, feedback, prevenção de erro, para uma pessoa possivelmente em sofrimento.
> Método: li os 5 pareceres independentes (Norman R1, Rams, Pearl, Calvo, Zhuo) e confronto-os pela usabilidade, não pelo gosto. Quando alguém precisa adivinhar, o signifier falhou — é por aí que arbitro.

---

## 1. REFUTAÇÕES (onde discordo dos colegas)

**R1 — Contra DIETER RAMS (P2): "input deve ser hairline inferior, não pílula creme preenchida".**
Rams quer a linha porque a pílula preenchida "finge ser botão" — um argumento de *honestidade formal*. Mas pela lente de usabilidade, o hairline inferior é a affordance *menos* robusta para esta população. Uma linha de 1.5px é um alvo de clique ambíguo e quase invisível em telas de baixo contraste, sol, ou olhos cansados às 2h da manhã (o usuário real do Calvo). O campo preenchido tem uma coisa que a linha não tem: **fronteira visível = "aqui dentro se escreve"** — é knowledge in the world, o contorno *é* o container. O problema que Rams aponta (colisão input/botão/bolha) é real, mas a solução não é apagar a fronteira do input; é **diferenciar input de botão por outro canal** (o botão é sólido saturado com texto centrado; o input é fundo recessado com cursor e placeholder à esquerda). A confusão input-vs-botão se resolve por estado e conteúdo, não por remover a borda que ajuda a pessoa a achar onde digitar. Honestidade formal não pode custar descobribilidade. **Voto pela pílula (ver Q1).**

**R2 — Contra DIETER RAMS (P7 / "calma é correta") e parcialmente contra CATHY PEARL (que não trata crise): subestimar a proeminência do caminho de crise.**
Rams diz que o link de crise "não precisa de alarme vermelho — a calma é correta" e o classifica como MENOR. Aqui Calvo está certo e Rams está errado *pela minha própria lente*. No meu R1 eu pus o token de crise como ponto FORTE (cor calma, certo) mas tratei a proeminência de leve — reconheço que Calvo me corrigiu. Calma e proeminência **não são trade-off**. Um link de 12px sem ícone, sem peso, que ainda *trunca no mobile* (todos confirmaram o corte) é uma falha de Visibilidade de severidade alta, não menor: o controle mais crítico do produto é o menos visível, e a pessoa de visão-em-túnel é justamente quem não o acha. A redução do Rams aqui é redução no lugar errado — *weniger* não se aplica ao caminho que salva. Isto é BLOQUEANTE, não MENOR.

**R3 — Contra JULIE ZHUO (P3): "priorizar build do Diário ANTES do Você porque sem ele a tese não fecha".**
Zhuo está certíssima sobre coerência de produto, mas pela lente de usabilidade a sequência de prioridade dela é arriscada. O **Você** carrega export/delete (autonomia, LGPD Art.18) e a *segunda via do caminho de crise* (Calvo P2). Entre "a tese do caderno não está provada" e "a pessoa em crise tem um único fio de segurança truncável e não consegue apagar o diário íntimo", a usabilidade — especialmente trauma-informada — manda resolver a **segurança e a autonomia antes da prova da metáfora**. Diário é o que torna o produto *encantador*; Você é o que o torna *seguro*. Encanto espera; segurança não. Discordo da ordem: redundância de crise + export/delete vêm primeiro.

---

## 2. ENDOSSOS (os 2 pontos mais importantes dos colegas)

**E1 — CATHY PEARL (P1+P2): o vão entre o envio e a primeira palavra não tem presença — só um cursor órfão de 2px.**
Este é o ponto mais importante de todo o conclave e endosso-o sem reservas — ele *é* o meu P4 (Gulf of Evaluation) com evidência de código que eu não tinha (`use-chat.ts:193`, `TypingIndicator` perdido na migração do `PaperConversation`). Pearl mostrou que o feedback de presença existe no codebase e **se perdeu** — não é "ainda não feito", é regressão. Na minha lente: o intervalo sem feedback após a pessoa se expor é abandono percebido por alguém hipervigilante a sinais de abandono. É a costura mais cara do produto e tem fix cirúrgico. Prioridade máxima.

**E2 — RAFAEL CALVO (P1+P2): a rede de segurança depende de um único fio truncável.**
Endosso porque é onde a usabilidade encontra a ética: redundância de caminho crítico é princípio de prevenção de erro puro. Um single point of failure numa superfície de crise é inaceitável — se o único acesso trunca em mobile e a segunda via (Você) é stub, a pessoa no pior momento pode literalmente não encontrar a saída. Calvo me fez subir a severidade do que eu tratei como secundário. Caminho de socorro = sempre inteiro, sempre redundante, sempre reconhecível antes da leitura (ícone).

---

## 3. VOTOS nas questões contestadas

**Q1 — Inputs: (A) hairline OU (B) pílula creme preenchida? → VOTO (B) pílula creme preenchida.**
Descobribilidade > pureza formal: a fronteira visível diz "escreva aqui" sem instrução; a colisão com o botão se resolve por saturação/estado, não por apagar a borda.

**Q2 — Chip de humor: melhor solução em 1 frase.**
Não deixar a Anipis ser contradita por um carimbo estático: tornar o chip um *registro tocável e dispensável* com micro-rótulo de affordance ("como você chegou hoje · 🙂 Bem", editável) E fazer a Anipis reconhecer no diálogo quando o humor muda — assim ele é controle descobrível, não enfeite ambíguo nem mentira fixa.

**Q3 — Proeminência do caminho de crise: quanto peso sem virar alarme?**
Peso suficiente para reconhecimento pré-leitura — ícone + alvo de 44px + contraste AA + nunca truncar — mantendo o token tijolo calmo `#8f2c1b` e zero motion: inconfundível ao olhar, jamais gritando. Calma é da *cor e do movimento*; proeminência é do *tamanho, ícone e constância*. Não são opostos.

**Q4 — Login beta: remover signup+magic-link da UI, ou ocultar atrás de flag?**
Remover totalmente da UI no beta. Um caminho visível que não leva a lugar nenhum é uma Norman door — affordance falsa que termina em frustração para quem chega frágil. Flag serve ao código; a porta visível tem que cumprir o que promete.

**Q5 — Empty state: saudar por nome ("Oi, Marina") ANTES de o onboarding costurar isso, ou sem nome até ter o nome?**
Sem nome até o onboarding entregar o nome. Saudar "Oi, Marina" sem a pessoa ter dado o nome é o sistema afirmando um mapeamento que não foi estabelecido — quebra de modelo conceitual (o diário "te conhece" sem você ter se apresentado). Pior: se o nome for placeholder/errado, o primeiro gesto do produto é uma mentira. Saudação calorosa genérica até o handshake; nome só depois que a pessoa o deu.

---

## 4. NOTA REVISADA: **6,0 / 10** (era 6,5)

Baixo meio ponto. Os pareceres dos colegas não me tranquilizaram — me deram evidência de que duas falhas que eu tratava como "maior/feedback a provar" são piores do que pensei: Pearl provou que a presença na espera é **regressão** (existia e sumiu), e Calvo provou que o caminho de crise é **single point of failure truncável**, não só "discreto". Somados aos dois bloqueantes que eu já tinha (login e composer mobile), são agora quatro pontos de falha nos momentos exatos de coragem do usuário. A fundação segue excelente e o caminho para 9+ continua sendo *correção cirúrgica, não reconcepção* — mas honestidade de usabilidade manda refletir a severidade real antes de consertar.

-- Don Norman, designing for people as they are, not as we wish them to be
