# Conclave Ciclo 2 — Dieter Rams (forma / redução)

> Lente: os 10 Princípios do Bom Design. *Weniger, aber besser.* O produto inteiro foi construído. Reavalio com a mesma régua do Ciclo 1 (nota anterior: **6,5**). Material: `fix1-login-820.png`, `c2-hoje-light-820.png`, `c2-hoje-dark-820.png`, `faseB-onboarding-820.png`, `faseB-diario-820.png`, `faseB-voce-820.png`. App vivo conferido em :3377.

---

## 1. VERIFICAÇÃO dos pontos do Ciclo 1

### P1 — O botão "Entrar" mente sobre seu estado → **NÃO RESOLVIDO**
Olho `fix1-login-820.png`. O CTA "Entrar" continua em **verde-acinzentado dessaturado** (`#a3b59a`-ish), texto cinza-médio. É exatamente a cor que eu prescrevi RESERVAR para `:disabled`. A tela abre nesse estado. Se o botão está mesmo desabilitado até os campos serem preenchidos, então a forma está honesta — mas o disclaimer disso não existe e a primeira impressão é a de uma porta morta. Se está ativo, a cor mente. De qualquer modo, o *default visual* da porta de entrada continua comunicando "não me toque". A correção pedida — verde floresta cheio (`#2f5235`) no estado pressionável — **não foi aplicada à imagem que recebi.** Este era o item bloqueante do Ciclo 1 e segue de pé.

*(Nota honesta: se a build implementou disabled-honesto que só fica cheio quando os dois campos estão válidos, então isto está tecnicamente correto e eu reclassificaria para RESOLVIDO. Mas julgo o que vejo, e o que vejo é a cor de disabled como estado de abertura. A evidência na tela é a forma de disabled.)*

### P2 — Inputs-pílula fingindo ser botões → **RESOLVIDO**
Confirmo na imagem. E-mail e Senha agora são **linhas** — fundo do canvas, hairline inferior tinta, rótulo label-caps acima (`Email`, `Senha`), placeholder cinza. Exatamente a direção que votamos 4-1. A colisão de forma input-vs-bolha-vs-botão foi quebrada: o campo agora **parece um lugar onde se inscreve**, não um seixo pressionável. Esta era a correção formal mais importante do conjunto e foi feita com disciplina. *Bom. Honesto.*

### P3 — Login descentralizado / wordmark órfão → **PARCIAL**
O card subiu para perto do centro óptico — melhor que o Ciclo 1, onde flutuava no terço inferior. Mas ainda há um **vazio dominante acima** e o wordmark `anipis.` continua solto no canto superior-esquerdo sem relação de grade com o card. O eixo melhorou; a relação wordmark↔card não foi resolvida. O vazio segue herdado, não composto. PARCIAL.

### P4 — "Criar conta" + "Link mágico" (adição não-pedida) → **RESOLVIDO**
Ambos desapareceram de `fix1-login-820.png`. A tela agora tem os elementos funcionais que o beta fechado honra: e-mail, senha, entrar. Os dois desvios de auth que vieram de molde — e não de necessidade — foram subtraídos. *The template wanted them; the user did not. They are gone.* Subtração correta.

### P5 — Chip de humor flutuando, duplicando a pílula, emoji cromático fora da ramp → **NÃO RESOLVIDO**
Esta é a regressão que mais me incomoda. A síntese do Ciclo 1 votou **DISSOLVER o humor na primeira fala da Anipis** ("Você chegou se sentindo bem…"), mantendo só um registro discreto e opcional. O que vejo em `c2-hoje-light-820.png` é o oposto: o chip `[🙂 Bem ✎]` continua como **pílula azul-clara preenchida**, flutuando no topo antes da primeira fala, com o **emoji amarelo de sistema operacional** — o único ponto de cor fora da paleta tonal cuidada. A pergunta direta do founder: *o emoji do chip ainda é ruído cromático fora da ramp?* **Sim. É.** O amarelo `🙂` não pertence a nenhum token de emoção do sistema; é cromo importado do SO. E pior: o chip agora **se multiplicou pelo produto** — aparece 3× no Diário (`faseB-diario-820.png`) e de novo no header do Você. A pílula+emoji virou um padrão recorrente em vez de ser dissolvida. A colisão de forma que eu apontei no Ciclo 1 não só sobreviveu — ela escalou.

### Chip — o emoji é ruído cromático? → **SIM, confirmado**
Resposta explícita à pergunta do founder. O `🙂`/`😊`/`😔` amarelos são glifos do sistema operacional, fora da emotion-ramp tonal (sálvia/azul/etc. que já existe nos tokens). Numa paleta inteiramente disciplinada por tom, o único amarelo saturado da tela é decoração importada. **Substituir o emoji do SO pelo ponto de cor da emotion-ramp** resolve isto — e de quebra reconcilia o chip com o sistema. Hoje o emoji é o item mais dissonante da paleta inteira.

### Login — ainda tem leve sombra no card? → **SIM, leve**
Resposta explícita à pergunta do founder. O card de login ainda carrega uma **borda/sombra suave** que o separa do canvas — destoa do flat-real do resto do produto (Hoje, Diário, Você usam degrau tonal, sem sombra). O Ciclo 1 elogiou justamente a ausência de sombra como disciplina. A tela de login é a única que ainda usa elevação por sombra. É leve, mas é inconsistente com o sistema. Trocar pela mesma lógica tonal (fundo `#fff`/creme sobre canvas, sem sombra) fecharia a coerência.

### P6 — Poço vazio no Hoje → **NÃO RESOLVIDO**
`c2-hoje-light-820.png`: três turnos curtos no topo, ~65% de canvas morto abaixo até o composer. Continua sendo vácuo, não respiro. Eu disse no Ciclo 1: não adicionar para preencher — **ancorar** (conteúdo cresce de baixo pra cima, colado ao composer). A ancoragem não foi feita. O early-state ainda cai do topo e deixa um poço. NÃO RESOLVIDO.

### P7 — Crise sem peso / truncável → **RESOLVIDO**
O link "precisa de ajuda agora?" agora tem **ícone (alvo/salva-vidas) em tom tijolo calmo** no header, inteiro, sem truncamento. E o Você (`faseB-voce-820.png`) traz a **2ª via persistente**: seção "Recursos de crise" com CVV 188 (botão tijolo cheio) + SAMU 192 (outline) + CAPS. Exatamente o que a síntese votou (ícone+rótulo, tom tijolo, zero motion, 2ª via). Eu havia discordado do ícone e perdido o voto — e reconheço: a execução está sóbria, não alarmista, e cumpre a honestidade funcional (o elemento que salva não é mais o que o layout sacrifica). RESOLVIDO.

---

## 2. PROBLEMAS RESIDUAIS — o que ainda dá para REMOVER / simplificar

**R1 — O chip de humor é o ruído nº1 do produto agora.** Pílula azul preenchida + emoji amarelo de SO, repetida em Hoje, Diário (×3) e Você. É a forma que mais viola "como pouco design quanto possível". Decisão: dissolver na fala (Hoje) e, onde precisar persistir (Diário), virar **rótulo label-caps com o ponto de cor da emotion-ramp** — sem pílula preenchida, sem emoji. Uma cor, um rótulo. O emoji sai inteiro do sistema.

**R2 — Onboarding: o "✎" no chip e o ✎/lápis no nav HOJE.** No `c2-hoje` o chip carrega um lápis (`✎`) de editar. Microdecoração: o affordance de editar humor pode ser o toque no próprio rótulo, sem ícone-caneta pendurado. Remover o glifo.

**R3 — Onboarding (`faseB-onboarding-820.png`): vazio superior de ~40% da tela antes do conteúdo.** Mesmo padrão do login (P3) e do Hoje (P6): o bloco "Como a Anipis cuida do que você escreve" começa abaixo do meio, com um terço-e-meio de canvas morto acima. O espaço não está composto — sobrou. Ancorar o bloco mais alto ou centrá-lo no eixo óptico.

**R4 — Ícones decorativos dos itens do Você (`faseB-voce-820.png`).** Cada linha de menu tem um pequeno glifo circular à esquerda (○). Eles não diferenciam função — são todos o mesmo círculo-vazado genérico. Um ícone que não distingue nada é decoração. Ou cada um ganha um glifo que comunica sua função (consentimento/contato/exportar/etc.) ou todos saem e a linha vive só pelo texto+chevron. Hoje é ruído uniforme.

**R5 — "Seu caminhar" (gráfico de linha no Diário).** A sparkline verde é a única ornamentação de dados do produto. Pergunto, como sempre: o que acontece se eu a remover? Se ela comunica tendência de humor real e acionável, fica — mas então precisa de eixo/rótulo mínimo para ser honesta sobre o que mede. Como está (linha solta sem escala), é mais textura do que informação. Decidir: dado honesto (com referência) ou remover.

---

## 3. O QUE BLOQUEIA 10/10 (pela minha lente)

1. **O botão "Entrar" precisa ser honesto na forma** (P1). Enquanto a porta de entrada abrir na cor de disabled, o primeiro toque do produto é ambíguo. Verde floresta cheio quando pressionável; cor de disabled SÓ no disabled real.
2. **O chip de humor precisa ser dissolvido/reduzido e o emoji de SO precisa sair** (P5/R1). É a maior colisão de forma e o único ruído cromático fora do sistema — e agora multiplicado por três superfícies. Enquanto o `🙂` amarelo estiver na tela, não é *pure*.
3. **O espaço precisa virar decisão, não sobra** (P3/P6/R3). Login, Hoje e Onboarding têm o mesmo poço herdado. Minucioso até o último detalhe significa que o vazio também é composto. Ancorar o conteúdo (óptico no login/onboarding; colado-ao-composer no Hoje).
4. **A sombra do card de login** (resposta ao founder). Único ponto onde o flat-real do sistema quebra. Trocar elevação-por-sombra por degrau tonal fecha a coerência.
5. **Ícones que não distinguem** (R4) e o **lápis do chip** (R2). Decoração uniforme que não serve função. Remover ou dar função.

Nenhum destes pede adicionar. Todos pedem: tornar honesto (botão), subtrair (emoji, lápis, ícones genéricos, sombra) e compor (espaço). O caminho ao 10 é o mesmo de sempre — *o que ainda dá para remover.*

---

## 4. NOTA revisada (forma / redução): **7,5 / 10** _(era 6,5)_

**Por que subiu (+1,0):**
- Inputs viraram linha (P2) — a correção formal mais importante, feita com disciplina.
- Signup/magic-link removidos (P4) — subtração de adição-não-pedida, exemplar.
- Crise resolvida com sobriedade (P7) — ícone+rótulo+tom tijolo+2ª via, sem alarme.
- Produto inteiro agora coerente em navegação, voz editorial e sistema tonal flat (exceto login).
- Diário e Você são superfícies novas majoritariamente disciplinadas.

**Por que NÃO é mais alto:**
- **O botão ainda não é honesto** (P1) — o item bloqueante do Ciclo 1 sobrevive na imagem. Um produto não chega ao 9 com a porta de entrada ambígua sobre o que está ativo.
- **O chip não foi dissolvido — escalou** (P5). A síntese votou dissolver; a build manteve e multiplicou a pílula+emoji por três telas. O emoji amarelo de SO é o único ruído cromático fora da ramp, confirmado. Isto é regressão contra o veredito do próprio conclave.
- **O espaço ainda é sobra** (P3/P6/R3) — três telas com o mesmo poço herdado. Não-minucioso.
- **Sombra residual no login** quebra o flat-real que é a melhor decisão do sistema.

Três correções fecham o caminho ao 9,5: **botão honesto**, **chip dissolvido + emoji fora**, **espaço ancorado** (e a sombra do login junto). Nenhuma adiciona nada. O 10 se conquista quando não sobrar o que remover — e ainda sobra o emoji, o lápis, os ícones uniformes e o vazio herdado.

-- Dieter Rams, less but better
