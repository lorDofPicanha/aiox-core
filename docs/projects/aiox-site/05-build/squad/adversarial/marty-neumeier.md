# ADVERSARIAL — @marty-neumeier

**Clone:** `marty-neumeier` · Brand Strategist & Differentiation Architect
**Material de origem:** `.codex/agents/marty-neumeier.md` + `scratchpad/conclave/marty-neumeier.md`
(consultationId `bf956c21-36f6-48fa-b1cd-ccb4283e2849`)
**Alvo:** `05-build/squad/DIRECAO-ARTE.md` (76 KB) · `05-build/squad/ARQUITETURA-SECOES.md` (47 KB)
**Data:** 2026-07-28 · **Modo:** ataque, não revisão

> **Aviso de fundamentação.** O material do clone em disco declara **5 princípios** e **5 frameworks**
> — nada mais. Cada afirmação abaixo cita qual dos cinco a sustenta. Onde eu uso a versão longa do
> Onlyness (5 lacunas), digo explicitamente: o disco só carrega a versão curta
> (`'Our brand is the ONLY ___ that ___'`); as 3 lacunas extras vêm do livro `Zag`, listado em
> `books:` do mesmo arquivo, e estão marcadas como tal.
>
> **Não consultei fonte externa, não busquei o INPI, não gerei número novo.** Tudo que segue sai
> dos dois documentos-alvo, de `00-context/`, `03-wireframe/WIREFRAME.md`, `RETOMAR-AQUI.md`,
> `02-references/inputs/leanware/pages/home/intel.json` e de `apps/talos/`.

---

## 1. VEREDITO — bronze × verde

# 🥉 BRONZE. Ratificado.

E agora a parte que interessa: **a pergunta não valia o que foi pago por ela.**

### 1.1 A prova de que não é uma decisão de posicionamento está dentro do próprio documento

`DIRECAO-ARTE.md` §3.7 escreve, com todas as letras:

> "🔧 **A reversão custa uma linha.** Todo o bronze está em custom properties. Trocar
> `--bronze: #E9A23B` por `--bronze: #3ecf8e` (+ os 3 derivados) devolve o leanware em português.
> […] **nada da Parte 4 muda.**"

Decisão de posicionamento é aquela que é **cara de reverter**. É a definição operacional.
Uma decisão que se desfaz em quatro tokens e não move uma única seção não é posicionamento — é
**configuração**. Ela foi roteada para o Tier 0 ("Fundação", §0.1) porque *parecia* estratégica.
Parecer estratégica e ser estratégica se distinguem exatamente por esse teste.

**Princípio 1 — "A Brand Is a Gut Feeling — It's not a logo. It's what people FEEL about you."**
Um logo já não é a marca. Um valor hexadecimal está um degrau **abaixo** de um logo. O documento
gastou 6 blocos de evidência, um placar de 7 linhas e o slot de fundação da squad numa variável que
está dois níveis abaixo do que o princípio já declara insuficiente.

### 1.2 O argumento "verde é o default da categoria" se aplica igualmente ao bronze

`DIRECAO-ARTE.md` §3.2: `ui-ux-pro-max` devolve `#10B981` (esmeralda) como cor primária da
indústria *Technology*. Logo, verde = default da categoria. Correto.

`DIRECAO-ARTE.md` §3.3: `ui-ux-pro-max` devolve `#D4AF37` (ouro metálico) como cor primária do
estilo *Dark Premium*. Logo, bronze = **default do estilo**.

São a mesma operação. Trocar o default da *indústria* pelo default do *estilo* é mudar de fila,
não sair da fila. E o próprio documento reconhece o buraco no meio disso, com uma honestidade que
merece registro: §3.5 declara que a tentativa de **medir** "verde é o default" **falhou** — só 4 de
15 capturas declaram token de acento. A afirmação estatística foi corretamente retirada.

Sobram, então, de seis critérios, **dois que não são circulares**:

| critério do placar §3.6 | sobrevive ao ataque? |
|---|---|
| contraste no repouso (9,66 × 8,85) | ❌ o próprio §2.4 diz: "Contraste não decide esta escolha" |
| contraste do fill em hover (6,90 × 7,51) | ⚠️ real, mas é 1 estado de 1 componente |
| distância do default da indústria | ❌ circular — bronze é o default de outro banco |
| aderência ao estilo travado em D3 | ❌ é o mesmo banco de dados falando duas vezes |
| **referente na marca (o autômato é de bronze)** | ✅ **sobrevive** |
| **compatibilidade com `03-assets/` (foto `ferreiro` h39 vs bronze h36)** | ✅ **sobrevive, e é o melhor** |
| fidelidade literal ao pedido do founder | ✅ sobrevive **a favor do verde** |

Dois a um, não seis a um. O veredito não muda — mas o placar era retórica, e num documento que se
orgulha (com razão) de não inventar número, um placar inflado é a única linha que destoa.

### 1.3 O melhor argumento está em sexto lugar

§3.4, última frase: *"A escolha do acento decide se 2,2 MB de material real entram ou saem do site."*

Esse é o único argumento da Parte 3 inteira que fala do **que o visitante vê**, e não da coerência
interna do sistema. **Princípio 3 — "Bridge Strategy and Creativity — the brand gap is the distance
between business strategy and customer experience."** Os cinco outros critérios são sobre o
documento estar de acordo consigo mesmo. Esse é sobre a página ficar inteira ou partida.
Ele deveria abrir a Parte 3, não fechar a linha 6 de uma tabela.

### 1.4 O ataque de verdade: 9 de 10 gestos vêm da referência

§3.7 lista o que o Talos herda do leanware:

> "filete de 1px separando seção, sussurro de fundo, dois brilhos radiais, malha de pontos mascarada,
> par sans/mono com rótulo de máquina em caixa alta, display 800 com tracking negativo, card com hover
> que acende a borda, botão de 48px com raio 10 e sombra colorida. **O Talos herda os nove.**"

E a Parte 5 fecha: *"Isso é o que faz o leanware ser bom, e nada disso é a cor dele."*

Está certo — e é exatamente por isso que o veredito de cor não resolve o problema que o founder
levantou. **Ele rejeitou três builds com a palavra "genérico".** Genérico não é a cor errada;
genérico é a ausência de gesto próprio. Um sistema que herda ritmo, textura, tipografia, forma de
botão, curva de ease, geometria de brilho e ordem de seções, e troca o acento, é um **fork
recolorido**. Recolorir um fork é maquiagem sobre fork.

**Princípio 2 — "When Everybody Zigs, Zag — Radical differentiation is the only sustainable
advantage."** Trocar `#3ecf8e` por `#E9A23B` mantendo os nove gestos é zigar em outro tom.
Não é zag. O zag deste projeto existe e não é visual — está na §1.4 deste documento, mais abaixo.

### 1.5 Onde a atenção deveria ter ido, em ordem de alavancagem

| # | variável | estado em disco | custo de reverter |
|---|---|---|---|
| 1 | **o nome da pessoa** (`lib/perfil.ts:15` = `'PREENCHER: nome'`) | 🔴 vazio | — não existe |
| 2 | **a frase de onlyness** | 🔴 **não existe em nenhum dos 123 KB** (grep confirmado) | — não existe |
| 3 | anterioridade INPI classes 42 e 35 | 🔴 não conclusiva (`WIREFRAME.md` §1.7) | catastrófico |
| 4 | a linha de honestidade da dobra (D-A) | 🟡 duas opções, nenhuma escrita | 1 frase |
| 5 | eyebrow com **duas** categorias (`Hero.tsx:54`) | 🟡 no ar | 1 linha |
| … | … | … | … |
| n | **o hexadecimal do acento** | ✅ decidido, medido, documentado | **4 tokens** |

O item que recebeu o Tier 0 é o de menor consequência da lista. Isso não é erro de gosto — é erro
de **alocação de atenção**, e é o defeito mais caro dos dois documentos.

---

## 2. A FRASE DE ONLYNESS

**Princípio 4 — "Onlyness — If you can't say what makes you the ONLY, you have a commodity."**

Rodei o grep. **A frase não existe.** Em 123 KB de direção de arte e arquitetura de seções, mais
`CONTEXT.md`, `WIREFRAME.md`, `PRICING.md` e `RETOMAR-AQUI.md`, não há uma única construção
"é a única ___ que ___". Existem 51 pares de contraste medidos e zero frases de posição.

Isso é o diagnóstico, não um detalhe: **a squad especificou o rosto de uma marca antes de
alguém escrever o que ela é.**

### 2.1 A frase, escrita

> ### A Talos é a única oficina de automação que mostra a rotina da sua empresa virando máquina — na sua tela, com as suas palavras, antes de você pagar — para donos de PME e indústria brasileira que não são técnicos, direto com quem constrói, no momento em que a empresa passou a contratar gente para fazer o que um sistema faz.

### 2.2 Lacuna por lacuna: o que fecha e o que não fecha

> ⚠️ A versão de 5 lacunas ("única ___ que ___ para ___ em ___ durante ___") é a do livro `Zag`.
> O material do clone em disco carrega só `'Our brand is the ONLY ___ that ___'`. As lacunas
> 4 e 5 estão marcadas com a origem.

| lacuna | o que eu escrevi | fecha com o disco? |
|---|---|---|
| **única [o quê]** | *oficina de automação* | 🔴 **NÃO FECHA.** Ver 2.3 |
| **que [faz o quê]** | *mostra a rotina virando máquina, na sua tela, antes de pagar* | ✅ **FECHA, e é forte.** `ARQUITETURA §4` — `mapear.ts` é *"a única coisa da página que o visitante pode verificar sozinho, com os dados dele, sem cadastro e sem confiar em ninguém"*. As 4 regras de §4.3 (zero delay, etapa não lida vale 0, premissa junto do número, frequência informada pelo visitante) são o que torna a alegação falseável |
| **para [quem]** | *donos de PME e indústria brasileira, não-técnicos* | ✅ **FECHA.** `CONTEXT.md` D1, literal |
| **em [onde]** ¹ | *direto com quem constrói* | 🟡 **INFERÊNCIA MINHA.** O disco não tem território. `ARQUITETURA §5.3` usa "quem conversou com você é quem constrói?" como 1ª linha da matriz — eu promovi um critério de tabela a slot de posição. Founder confirma ou corta |
| **durante [quando]** ¹ | *quando a empresa passou a contratar gente para fazer o que um sistema faz* | 🟡 **INFERÊNCIA MINHA**, derivada do H1 de `Hero.tsx:24` (*"O trabalho repetitivo da sua empresa não precisa de gente"*). Nenhum documento define o gatilho de compra |

¹ lacunas da versão `Zag`, ausentes do material do clone em disco.

### 2.3 A lacuna 1 é o furo, e ele contradiz uma tensão declarada resolvida

`CONTEXT.md` T2 — *"4 ofertas na porta de entrada lê como freelancer, não especialista"* — está
marcada **✅ RESOLVIDA 26/Jul**.

`apps/talos/components/Hero.tsx:54`, o primeiro objeto da dobra, entrega:

```
automação de processos · construção de sites
```

**Duas categorias separadas por um ponto médio não são uma categoria — são um cardápio.**
O objeto nº 1 da hierarquia de 10 segundos (`ARQUITETURA §6.1`, orçamento 0,5s) responde
*"que tipo de coisa é isso?"* com duas respostas. T2 não foi resolvida; foi resolvida no documento
e continua no código.

E `LEANWARE-REFERENCE.md` piora o quadro — a tradução declarada lá lista **quatro**:
*"site, automação, diagnóstico e sistemas com agentes"*.

**Princípio 4** é literal: sem categoria, sem onlyness; sem onlyness, commodity. Não existe
"a única" de duas coisas ao mesmo tempo.

**O que eu escreveria no lugar:** `oficina de automação` — uma palavra de categoria que (a) não é
"agência", que é a coluna 1 que a §9 existe para matar; (b) carrega o mesmo campo semântico da
forja, do `ferreiro` h39 e do autômato de bronze, o que faz nome, cor, foto e categoria dizerem a
mesma coisa; (c) o site continua sendo o produto de entrada — mas como **exemplo**, não como
segunda categoria. É exatamente o que `CONTEXT.md` D5 já diz (*"o produto de entrada e o demo são
o mesmo objeto"*) e que o eyebrow desmente.

---

## 3. O NOME

### 3.1 O que eu não vou atacar

Não vou atacar Talos por ser difícil. `ARQUITETURA §0` estabelece que o visitante **chega depois de
já ter falado com o founder** (D2), e que o trabalho do site é *"não perder a conversa que já
começou"*. Para esse visitante, o nome já foi apresentado por uma boca humana. Leanware também não
explica nada e funciona, porque o H1 explica. Nome que não se auto-explica é caro em tráfego frio,
barato em tráfego prospectado. **Talos é sobrevivível.**

Também não vou fingir que "mitologia grega" é o problema. Nike, Hermès, Oracle, Amazon, Midas —
o problema nunca foi a origem grega; é se o nome carrega **sensação** sem exigir pesquisa.

### 3.2 O que eu ataco: a cadeia bronze → nome → INPI está montada ao contrário

O bronze tem dois argumentos sobreviventes (§1.2), e o mais forte deles, §3.4, é **"a cor é o
nome"**:

> "Τάλως é **o autômato de bronze** de Hefesto. Não 'o autômato'. O de bronze. A cor não ilustra a
> marca — ela **é** a marca escrita em outro alfabeto."

Argumento excelente. E completamente **dependente do nome sobreviver**.

Estado do nome em disco:

- `WIREFRAME.md` §1.7 — **INPI NÃO CONCLUÍDA.** Duas tentativas programáticas, backend do INPI
  devolvendo `java.sql.SQLException: Null SQL statement`. Classes pendentes: **42** (serviços de
  tecnologia/software) e **35** (serviços de negócio). *São exatamente as duas classes deste
  negócio. Não é uma classe adjacente — é o alvo.*
- `WIREFRAME.md` §1.6 — três colisões verificadas: **Cisco Talos** (threat intelligence),
  **Talos Linux** (Sidero Labs, 538 empresas), Talos Energy (NYSE: TALO). Conclusão do próprio
  documento: *"SEO para a palavra 'talos' pura é inviável"*.
- `RETOMAR-AQUI.md` linha 302 classifica a busca INPI como *"fora do caminho crítico — troca de
  nome não invalida nenhum token nem seção"*.

**Essa última frase é falsa, e é o achado mais importante desta seção.** Troca de nome invalida:

1. **Evidência 3 da Parte 3** — o único argumento não-circular a favor do bronze;
2. `TalosCore.tsx` (6,4 KB) — a cena WebGL do hero, que `Hero.tsx:10-11` documenta como *"não é
   enfeite abstrato: é o nome da marca renderizado em tempo real, dando as voltas que Talos dava em
   Creta"*;
3. o handoff `@design-chief → @aaron-draplin` (`DIRECAO-ARTE §6.2`), cujo brief pede
   literalmente *"a cabeça/perfil do autômato"*;
4. `Nav.tsx:65-69` — a marca de 22px em três círculos concêntricos bronze;
5. a §6 inteira, que aloca 2,2 MB de fotografia de **forja** como material de card.

Cinco artefatos pendurados num nome cuja disponibilidade legal nas duas classes exatas do negócio
**não foi verificada**.

**Framework — "Brand Gap Model — 5 disciplines: Differentiate, Collaborate, Innovate, Validate,
Cultivate."** A ordem é a metodologia. Nomear é **Differentiate** — disciplina 1. Sistema visual é
**Innovate** — disciplina 3. Os gates do projeto (`DIRECAO-ARTE §6.4`) travam F1 referência,
F2 sistema visual, F3 matéria-prima, F4 mockup. **Não existe gate para o nome.** A squad passou F2
com 51 pares de contraste medidos e uma fundação não verificada.

### 3.3 O que o founder descartou, e por que vale registrar

`WIREFRAME.md` §1.4: *"Candidatos anteriores (Contínuo, Turno, Esteira, Otto, Vetor) descartados
pelo founder."* A recomendação nº 1 do próprio documento era **Contínuo**, com esta justificativa
(§1.3):

> "Duplo sentido: *contínuo* = sempre ligado **e** o 'contínuo' do escritório brasileiro — o
> funcionário que resolvia as tarefas de todo mundo. […] é o único da lista em que o nome já
> **conta a oferta**."

**Princípio 1 — a marca é a sensação que as pessoas têm.** Para um dono de metalúrgica em Santa
Catarina, "Contínuo" produz sensação sem intermediário: ele já teve um. "Talos" produz sensação
depois de três consultas (quem é Talos → autômato → de bronze). **Framework — "Brand Flip: from
company-centric to tribe-centric brand building":** Talos é o que o founder sente pelo produto dele;
Contínuo é o que o cliente sente pelo problema dele. O Brand Flip diz de que lado mora a marca.

**Não estou pedindo a reversão.** A decisão é do founder e ele já a tomou. Estou registrando que
a troca foi de um nome **tribo-cêntrico** por um **founder-cêntrico**, e que o preço disso é ter que
carregar o significado com WebGL, foto de forja, cor metálica e um SVG de autômato — 2,2 MB e uma
cena 3D para dizer o que uma palavra dizia sozinha. É um preço legítimo de pagar. Mas é um preço,
e nenhum documento o registrou como tal.

**Veredito:** o nome fica. **A ordem muda:** INPI 42/35 antes de F4, não depois.
São 3 minutos e o procedimento já está escrito em `RETOMAR-AQUI.md` linha 303.

---

## 4. POSICIONAMENTO CONTRA A CATEGORIA — negação sem prova é fanfarronice?

### 4.1 Primeiro, a acusação está parcialmente errada, e é justo dizer

Fui informado de que "a proposta do Talos copia a estrutura de negação do leanware". Fui verificar
no `intel.json` e nos documentos. **Não copia.**

O leanware coloca a negação num H2 de 44px: `"Not a consulting firm. Not staff aug. Not a dev shop."`
`ARQUITETURA §1` mapeia essa seção para **§6 Como funciona** e escreve, na linha 109:

> "o leanware diferencia por *forma comercial* ('milestone-billed, not hourly'); o Talos diferencia
> por *método verificável* (escopo fechado, prazo, você vê antes de aprovar)."

Ou seja: a squad **já trocou a negação por afirmação verificável**, deliberadamente. Está certo.

### 4.2 A regra que salva a negação onde ela sobrevive

Onde a negação sobrevive é a §9 (matriz 5×5: agência · freelancer · DIY · ficar como está · Talos).
E `ARQUITETURA §5.3` já instalou o antídoto correto:

> "**coluna própria toda verde e as outras todas vermelhas lê como propaganda e queima confiança.**
> Pelo menos duas células precisam ser honestamente favoráveis ao concorrente (ex.: plataforma DIY
> *é* mais barata na entrada; agência *tem* equipe maior)."

**Essa é a melhor decisão dos dois documentos, e é literalmente Zag.** Um zag é um trade-off
**declarado**. Você não pode ser o único X sem ser publicamente não-Y. A concessão explícita é o
não-Y dito em voz alta — é o que converte a negação de fanfarronice em informação.

Duas correções, ambas de rigor:

1. **A concessão é regra, não exemplo.** Hoje as duas células estão entre parênteses como
   ilustração, e `ARQUITETURA §8` D-D deixa para o founder decidir *"se aceita conceder 2 células"*.
   Isso não é decisão de founder — é a condição de validade da tabela. Sem concessão a §9 vira
   vitrine, e a própria pesquisa citada mede o custo: **19% abandonam permanentemente** depois de
   uma quebra de confiança. Escrever as duas células agora, no spec.
2. **A quarta coluna é a tese e está tratada como uma das cinco.** `ARQUITETURA §5.3`:
   *"o concorrente real do Talos é a inércia, não outro fornecedor"*. Isso está correto e é uma nota
   de rodapé em blockquote. Se o concorrente é a inércia, **a §9 inteira devia ser desenhada contra
   ela** — não uma coluna de cinco.

### 4.3 O ataque de verdade: a página é 100% defesa

`ARQUITETURA §3` define **cada uma das 12 seções** por "Objeção que derruba". Doze seções, doze
objeções. Somente a §5 (o mapa ao vivo) faz um movimento ofensivo.

Uma página inteiramente organizada em torno de objeções é uma página que **aceitou o enquadramento
da categoria**. Você responde melhor as perguntas do concorrente — e continua no jogo do
concorrente. **Princípio 2:** o zag não responde melhor; o zag muda a pergunta.

---

## 5. ZERO CASE — o founder está pulando uma etapa?

**Sim. E não é a etapa que ele pensa.**

### 5.1 O zag deste projeto já está escrito, e está na décima seção

`apps/talos/components/Prova.tsx:49`, título do estado vazio:

```
Sem case ainda. E eu não vou inventar um.
```

`ARQUITETURA §6.2` encontrou isso e escreveu a frase certa: *"É copy de dobra presa no rodapé da
página."* Certíssimo — e ainda subestimado. **Isso não é copy. É o posicionamento.**

Pense na categoria real: agências e freelancers de site no Brasil. O comportamento padrão da
categoria é mural de logo de cliente que nunca foi cliente, print de depoimento sem sobrenome,
"+300 projetos entregues" sem um único link. **Todo mundo ziga: inventa prova.**
Uma marca que declara na dobra *"sem case ainda, e eu não vou inventar um"* está fazendo a
única coisa que a categoria inteira não faz. **Princípio 2, aplicado literalmente.**

E aí a onlyness (§2) fica mais afiada do que a que eu escrevi: a Talos não é a única que automatiza
— automação virou o default da categoria do mesmo jeito que esmeralda virou o default da paleta.
**A Talos é a única que mostra a máquina em vez de mostrar o passado — e diz isso na cara.**

### 5.2 O erro de enquadramento que os dois documentos cometem

`ARQUITETURA §5` se chama **"As seções que dependem de prova social inexistente"**.
`DIRECAO-ARTE §5`, item 7, chama a mesma coisa de **"incompatibilidade de posição"** e ordena que as
substituições *"não podem ser mais tímidas que o que substituem"* — o que está corretíssimo.

Mas os dois tratam a ausência como **buraco a tapar**. `ARQUITETURA §6.2` chega a formular a saída
com precisão cirúrgica:

> "**Se o visitante notar a falta antes de você nomeá-la, é um buraco. Se você nomear primeiro,
> vira posição.**"

Essa frase é a resposta inteira — e mesmo assim ela vira o **objeto 5 de 6** da dobra, com orçamento
de **1,0 s de 10** (`§6.1`), atrás do eyebrow (0,5s) que hoje entrega um cardápio de duas categorias.

**Princípio 3 — a brand gap é a distância entre a estratégia de negócio e a experiência do cliente.**
Aqui a distância é de 30 páginas dentro da mesma pasta: o documento de arquitetura **descobriu** o
diferenciador na §6.2 e o documento de arte continua tratando a ausência como problema de
preenchimento de slot (`Parte 5`, item 7). A mesma squad, o mesmo dia, dois níveis de convicção.

### 5.3 A etapa que está realmente sendo pulada

Não é "conseguir depoimento". É **Validate** — disciplina 4 de 5 do Brand Gap Model.

**Princípio 5 — "Design Thinking for Brand — Prototype, test, iterate. Brands are living systems."**

Foram produzidos 123 KB de especificação com:
- 51 pares de contraste calculados
- 2 fontes auditadas com `fontTools` no nível de tabela GSUB/GPOS
- 6 defeitos da referência medidos e corrigidos
- **zero contato com um dono de PME brasileiro vivo**

`ui-ux-pro-max` devolvendo paleta não é validação. `contrast_check` devolvendo 8,85:1 não é
validação. Estudos da NN/g com usuários de EUA/UK/Singapura não validam a sensação que a palavra
"Talos" produz num dono de metalúrgica em Santa Catarina, nem se ele clica em "mapear meu processo"
ou fecha a aba.

E o mais irônico: **a amostra existe e é gratuita.** `CONTEXT.md` D2 diz que o visitante-alvo
*"já foi prospectado"* — logo o founder já falou com essas pessoas. Cinco ligações de vinte minutos
mostrando a dobra, a linha de honestidade e o nome resolveriam mais do que a Parte 3 inteira, a
custo zero, antes de F4.

---

## 6. O QUE MUDA — se o posicionamento for levado a sério

### Em `ARQUITETURA-SECOES.md`

**A1 · A linha de honestidade sobe de objeto 5 para o par do H1.**
Hoje: §6.1, orçamento 1,0s, posição 5 de 6, marcada D-A ("founder decide o texto").
Se *"sem case ainda, e eu não vou inventar um"* é o zag (§5.1 deste doc), ele não é um micro-selo
de 1 segundo. Duas configurações reais para o founder escolher **vendo**:
- **(i)** H1 = dor + linha de honestidade no slot 5 — o plano de hoje;
- **(ii)** linha de honestidade **no slot do eyebrow** (que hoje queima 0,5s com um cardápio),
  H1 = dor, slot 5 livre para as três checagens verificáveis da opção B.

**A2 · O eyebrow perde uma categoria.**
`Hero.tsx:54` — `automação de processos · construção de sites` → uma categoria só.
Recomendação: `oficina de automação`. O site continua sendo a porta; ele para de ser
uma segunda categoria no primeiro objeto da página. Fecha T2 no código, não só no documento.

**A3 · A concessão da §9 vira spec, não decisão de founder.**
Tirar de D-D. Escrever as duas células agora: *plataforma DIY é mais barata na entrada* ·
*agência tem equipe maior*. Ambas já estão em §5.3 como exemplo; promover a requisito.
Sem elas a §9 não é publicável.

**A4 · A onlyness aparece na página, uma vez, e é a §2.**
Hoje a §2 (faixa de verbos) é declarada sem CTA e sem objeção — é a única seção sem trabalho
atribuído. M1 já exige um rótulo acima da faixa. **Esse rótulo é o lugar da frase de posição**,
não de uma legenda tipo "o que a máquina faz". Custo: uma linha de copy num slot que já vai mudar.

**A5 · O nome da pessoa sobe para a assinatura da linha de honestidade.**
`ARQUITETURA §0` diz que o fator 4 de credibilidade *"é o único bloqueio que arquitetura não
resolve"*, e D2 diz que o visitante veio atrás de **uma pessoa**. Uma declaração sem assinatura é
disclaimer; com assinatura é compromisso: *"Sem case ainda. E eu não vou inventar um. — {nome}"*.
Zero custo de layout, e transforma `perfil.ts` de bloqueio de rodapé em bloqueio de dobra — que é
o que ele já é de fato.

### Em `DIRECAO-ARTE.md`

**B1 · O seletor do mockup F4 muda de variável.**
§3.7 e §6.4 planejam um seletor **bronze ↔ verde** no canto do mockup, "para o founder decidir
vendo, não lendo". Variável errada: o founder já decidiu a cor (`#E9A23B` está em decisões travadas
do `RETOMAR-AQUI.md`) e a reversão custa 4 tokens. A variável em que ele **não consegue prever a
própria reação** é a linha de honestidade: **presente × ausente**, e **eyebrow de 1 × 2 categorias**.
Trocar o seletor. Mesmo custo de implementação, uma ordem de grandeza a mais de informação.

**B2 · A Parte 3 encolhe e a Parte 5 item 7 cresce.**
A Parte 3 (cor) fica com o veredito, os dois critérios que sobrevivem e a linha de reversão — meia
página. A Parte 5 item 7 (as 4 seções de prova social, 29,7% da página) é onde mora a decisão de
posicionamento real, e ela já tem a regra certa (*"nenhuma substituição pode ser mais tímida que o
que substitui"*). Ela merece o slot Tier 0 que a cor recebeu.

**B3 · Gate novo antes de F4: nome.**
`§6.4` tem F1…F6 e nenhum gate de nome. Adicionar: **F0 — anterioridade INPI classes 42 e 35,
verificada manualmente**. Não porque disciplina de marca é bonita, mas porque `TalosCore.tsx`,
o brief do @aaron-draplin, a Evidência 3 do bronze e 2,2 MB de foto de forja estão pendurados nisso.
3 minutos, gratuito, procedimento já escrito.

**B4 · O placar de §3.6 sai ou é corrigido para 2×1.**
Quatro dos seis critérios são circulares (§1.2 deste doc). Num documento cuja maior virtude é não
inventar número, um placar inflado é a única página que não passa no próprio padrão.

---

## 7. ONDE EU ESTOU ERRADO

Disciplina de marca é luxo de quem já tem receita. Ele não tem. Cinco lugares onde meu ataque é caro
demais para o momento:

**7.1 · A onlyness que eu escrevi vai ser reescrita pelos três primeiros clientes — e deve ser.**
`PRICING.md` §5.1-bis: o founder declarou que a fase é *"construir portfólio, nome e marca"* e que
*"o cliente de R$750 não é o cliente-alvo; é a prova"*. Ele **ainda não sabe** qual das coisas que
faz o mercado paga. Travar uma categoria agora tem chance real de travar a errada. Meu próprio
**Princípio 5** está do lado dele, não do meu: *prototype, test, iterate — brands are living
systems.* A frase da §2 é **hipótese**, escrita a lápis, para ser falsificada pelos clientes 1 a 3.
Se ela travar uma decisão de negócio, ela está errada por construção.

**7.2 · Três semanas de estratégia de marca valem menos que três contratos assinados.**
Se a escolha for entre executar meus 9 itens de §6 e fechar os três primeiros clientes, **fechem os
clientes**. Oito dos nove são mais baratos de corrigir *depois* — copy de eyebrow, rótulo de faixa,
assinatura, célula de tabela, seletor de mockup. Nada disso é dívida estrutural. É tinta.

**7.3 · O único item que eu pararia a linha para fazer é o INPI, e não é por marca.**
É assimetria de custo: 3 minutos e grátis contra cinco artefatos e uma cena WebGL construídos sobre
um nome possivelmente indisponível nas duas classes exatas do negócio. Isso é gestão de risco
fantasiada de branding. Se o founder ignorar tudo o resto deste documento, que faça esse.

**7.4 · Eu ataquei o veredito de cor, e o processo que o produziu é mais honesto que a média do
ofício.** §3.5 **declara uma medição que falhou** em vez de esconder. §0.3 lista artefatos que a
documentação promete e o disco não tem. §0.2 declara quais ferramentas rodaram de verdade e quais
não entraram. §0.4 corrige dois defeitos de acessibilidade **da própria referência que o founder
mandou copiar**. Minha objeção é de **alocação de atenção**, não de rigor — e alocação de atenção é
a crítica mais fácil de fazer e a mais difícil de acertar de fora.

**7.5 · A coisa mais original dos dois documentos eu não teria pensado, e ela está enterrada.**
`ARQUITETURA §0`, tabela "A troca": o leanware prova no **passado** (logos, cases, Clutch,
depoimentos); o Talos prova no **presente** (a máquina rodando no seu processo) e no **futuro**
(o que está combinado antes de você pagar). **Trocar o tempo verbal da prova** é uma jogada de
posicionamento de primeira linha, e está na linha 53 de uma tabela de mapeamento de seções.
Isso não é arquitetura de informação — é a estratégia da marca. Devia estar na parede.

---

## 8. A PERGUNTA — só o founder responde

Não é sobre cor, nem sobre nome, nem sobre a linha da dobra. Todas essas já estão em alguma lista
de decisão (`ARQUITETURA §8` D-A…D-F, `DIRECAO-ARTE §6.3` D-A…D-E). Esta não está em lista nenhuma,
e é a maior brand gap do projeto — **Princípio 3**, no sentido exato: a distância entre a estratégia
de negócio e a experiência do cliente.

O site que está especificado sinaliza **caro**: Dark Premium, acento metálico, display 800 com
tracking negativo, WebGL, tipografia auditada no nível de tabela GSUB, contraste calculado em 51
pares, 2,2 MB de fotografia graduada. Um dono de PME lê isso em 10 segundos e ancora numa faixa de preço.

`PRICING.md` §5 trava a oferta da porta em **R$ 750**, e §5.2 registra os riscos R1 a R4 —
inclusive R4, que põe esse valor na faixa de DIY/freelancer júnior.

> ## Quando você disser "R$ 750" para alguém que acabou de ver este site, o que você quer que passe pela cabeça dele?

Só existem três respostas coerentes, e cada uma muda um documento diferente:

| resposta | consequência |
|---|---|
| **"que barganha"** | Aceita-se que o site opere como vitrine premium de um serviço barato. Então a §9 precisa de uma linha sobre **por que** é barato agora (piloto, direito de uso do case — `PRICING` R5 já exige a cláusula), senão o preço lê como fraqueza |
| **"por que tão barato? o que tem de errado?"** | É o risco default e ninguém o registrou. Corrige-se **descendo o sinal do site** ou **subindo o preço**. Não dá para fazer nem um nem outro sem o founder |
| **"esse preço não é para mim, é para os primeiros"** | A melhor saída, e é **posicionamento, não desconto**: o R$750 vira um programa nomeado com vagas contadas e contrapartida explícita (direito de uso do case). Isso é **onlyness aplicada ao preço** — e cabe numa linha da §8, sem tabela e sem violar T4 |

Nenhum documento da pasta faz essa pergunta. É a única que eu não consigo responder por ele — e é a
que decide se o site que a squad especificou está vendendo a mesma coisa que o founder está
cobrando.

---

## Resumo em cinco linhas

1. **Bronze está certo** — por 2 critérios, não 6 — e a pergunta recebeu Tier 0 sendo reversível em 4 tokens.
2. **Diferenciação não é cor:** 9 de 10 gestos vêm do leanware; recolorir um fork é maquiagem sobre fork.
3. **A onlyness não existe em 123 KB.** Escrevi uma; 3 lacunas fecham com o disco, 2 são inferência minha.
4. **O zag já está escrito e está na 10ª seção:** *"Sem case ainda. E eu não vou inventar um."*
   Zero-case não é handicap — na categoria que inventa prova, é a única posição que ninguém ocupa.
5. **Pare a linha por uma única coisa:** INPI classes 42 e 35. Três minutos. Todo o resto é mais barato depois dos três primeiros clientes.

— Neumeier. Zag when they zig. 🎨
