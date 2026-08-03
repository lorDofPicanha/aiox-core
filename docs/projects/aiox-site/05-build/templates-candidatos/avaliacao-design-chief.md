# AVALIAÇÃO — 4 templates finalistas (site Talos)

**Autor:** `@design-chief` · **Data:** 2026-07-31
**Insumos lidos:** `BRIEFING-FINALISTAS.md` · `05-build/squad/DIRECAO-ARTE.md` (o meu, de 28/Jul) ·
20 capturas `shots-finalistas/*-live-0..4.png` · régua `shots/00-REGUA-leanware-0..2.png` ·
`00-context/CONTEXT.md` · `finalistas-webflow.json` · `finalistas-demos.json` · `apps/talos/package.json`

> **Método.** Não avaliei pela descrição. Abri as 20 capturas, depois **medi os pixels**:
> luminância relativa WCAG (mediana, média, p98), superfície cromática (% de pixel com
> saturação ≥25%) com histograma de matiz em buckets de 15°, cor modal de fundos e cards,
> e perfil de linhas de tinta para achar as faixas do display e os vãos entre elas.
> Scripts em scratchpad; os números abaixo são todos reprodutíveis a partir dos PNGs do repo.

---

## 0. Duas coisas que preciso dizer antes do ranking

### 0.1 O briefing erra a classificação de tema do conicorn — e é o erro que mais custa

A tabela §1 declara `tema` do **conicorn** como *"claro/cinza no hero"*, e a §4 usa isso para colocá-lo
no balde dos que têm "espinha certa", reservando a crítica de D3 só ao stackgrid. **Medido, não é isso.**

| template | mediana de luminância (5 capturas) | por captura (0→4) | cor modal do fundo |
|---|---|---|---|
| fr-stackgrid | **98,2** | 98 · 98 · 98 · 98 · 98 | `#fdfdfd` |
| **wf-conicorn** | **80,8** | 25 · 78 · **100 · 100 · 100** | `#ffffff` (card `#f2f2f2`) |
| wf-idesignerlite | 8,8 | 0 · 1 · **43** · 0 · 0 | `#050505` |
| fr-agenciy | 0,5 | 0 · 0 · 1 · 1 · 0 | `#0a0a0a` |
| *régua leanware* | *0,6* | *0 · 1 · 1* | *`#0e0e10`* |
| *mockup Talos (28/Jul)* | *0,6* | *— (14 quadros)* | *`#0f0f0f`* |

O conicorn não é "claro no hero". **Três das cinco capturas medem 100 de luminância mediana** — é uma
página branca com um blob escuro no topo. Ele viola D3 exatamente como o stackgrid viola, e o briefing
o absolve. Quem ler o briefing sem abrir os PNGs é empurrado para o finalista errado.

### 0.2 Bronze não sobrevive nas duas claras — e isso não é preferência de tema

`#E9A23B` é decisão travada (`RETOMAR-AQUI.md` › decisões travadas; DIRECAO-ARTE Parte 3, 6 critérios a 1).
Medi o acento aprovado contra o fundo real de cada candidato:

| fundo medido | bronze `#E9A23B` | veredito |
|---|---|---|
| stackgrid `#fdfdfd` | **2,13:1** | ❌ reprova AA (4,5), AAA (7) **e o piso de 3:1 de componente** |
| conicorn card `#f2f2f2` | **1,93:1** | ❌ reprova tudo |
| conicorn página `#ffffff` | **2,17:1** | ❌ reprova tudo |
| idesignerlite `#050505` | **9,41:1** | ✅ AAA |
| agenciy hero `#0a0a0a` | **9,14:1** | ✅ AAA |
| agenciy card `#000000` | **9,70:1** | ✅ AAA |

Nas duas claras só existem duas saídas: **inverter a escala inteira** (= descartar a identidade do
template, porque a clareza *é* a identidade dele), ou **escurecer o bronze** até ele passar em branco —
o que exige cair para ~`hsl(36,80%,35%)`, um marrom. E aí morre a Parte 3.4 da direção de arte:
*Τάλως é o autômato **de bronze**; a cor não ilustra a marca, ela é a marca escrita em outro alfabeto.*
Um marrom não é a etimologia de nada.

Isto reclassifica "claro × escuro" de gosto para **sobrevivência do token aprovado**.

---

## 1. O critério que decide o ranking

Cada um dos quatro vai **perder cor, tipo e copy**. A `DIRECAO-ARTE.md` já fixou os três, com 51 pares
de contraste medidos, e existe um mockup em disco que os implementa. Logo o template não está vendendo
uma *aparência* — ela vai embora. Ele está vendendo **gramática de seção + um gesto estrutural**.

> **Critério declarado: o que sobrevive à troca de tokens.**
> Violação que mora no **conteúdo** (uma seção de preço, um bloco de depoimento) é *deleção* — custa uma
> tarde. Violação que mora na **identidade** (a policromia do conicorn, a cromática fria do agenciy, o
> esqueleto em forma de portfólio do idesignerlite) é *reconstrução* — e reconstrução é exatamente a
> dívida que fez o Talos perder 3 rodadas refinando sobre base errada.

Métrica operacional do critério — **superfície cromática**, % de pixel com saturação ≥25% e valor ≥12%,
com histograma de matiz:

| template | % cromático | matizes dominantes (bucket 15°, px) |
|---|---|---|
| **fr-stackgrid** | **0,89%** | 15°:2.309 · 195°:1.829 · 300°:1.074 — três acentos avulsos e pequenos |
| wf-idesignerlite | 1,11% | **60°:5.271** (lima) — e vive inteiro dentro de imagem de stock substituível |
| wf-conicorn | 1,39% | 210°:3.366 · 195°:2.920 · 15°:764 · 45°:603 · 30°:432 · 225°:384 — **policromia** |
| **fr-agenciy** | **6,00%** | **210°:25.345** · 195°:6.054 · 225°:3.567 — 35k px de azul-ciano |
| *régua leanware* | *3,34%* | *150°:11.887 — 79% do croma é o acento único* |
| *mockup Talos* | *1,50%* | ***30°:30.195 e mais nada no top-6** — 100% do croma é bronze* |

---

## 2. Ranking

### 🥇 1º — `fr-stackgrid`

**O que decidiu a posição:** é o **único dos quatro cujo gesto é feito de linha, não de campo** — e essa
é literalmente a Regra de forma nº 1 da direção de arte (§1.3): *"a estrutura é desenhada com linha de
1px, não com bloco de cor"*. Medido, ele já obedece: **0,89% de superfície cromática, a menor do grupo**,
e o pouco que tem são três acentos avulsos (laranja de nav, azul de botão, magenta de um blob), não um
sistema. Não há quase nada ali para brigar com o bronze.

**O gesto próprio (e ele sobrevive inteiro à inversão):** linguagem de **prancha de engenharia anotada**.
Em `fr-stackgrid-live-1.png` há uma linha-guia com rótulo "The AI" apontando para o objeto e marcas de
corte `+` cercando o chip preto "Features". Em `-live-2.png` há um **grafo de nós** — "Stackgrid" numa
linha horizontal que abre em Large Language Models / Vector Databases / Automation Middleware / CRM.
Em `-live-3.png`, cards de borda **tracejada** ligados por linha-guia a etiquetas pretas "Tier 1".
A página inteira é emoldurada por dois filetes verticais fixos, como uma folha sobre a mesa.
Nada disso depende de cor: **inverter um sistema de linha achromático é uma virada de valor, não uma
reconstrução.** Marca de corte, filete, tracejado e etiqueta lêem idêntico em negativo.

E há a coincidência que não é coincidência: **essa gramática *é* o argumento do Talos.** A §5 da direção
de arte ("o mapa ao vivo") pede exatamente etapa · filete de 2px · ícone de forma distinta · rótulo —
três sinais, nunca só cor. O stackgrid já fala essa língua em toda a página; os outros três a teriam
que aprender.

**O que nele é genérico:** a serifada de display ("The all new AI Era") é a serifa editorial padrão de
2025-26 — bonita e de ninguém. O arte-ASCII do hero é o clichê "AI é misterioso". Os três blobs de
gradiente borrado (azul/magenta) em `-live-1.png` são enchimento. Tudo isso sai junto com a cor.

**Onde ele é frágil, sem maquiar:** é o de maior custo de fachada. Branco `#fdfdfd`, seção de preço com
**$1.000 e $18.500 e botão "Book now"**, `[Pricing]` e `[Case Studies]` na nav, três depoimentos com
retrato fabricado e uma citação inventada de 100 palavras atribuída a "Kevin McCallister, COO"
(`-live-4.png`). São quatro violações diretas de `CONTEXT.md` §3 e T4. Mas **as quatro são deleções.**

---

### 🥈 2º — `wf-idesignerlite`

**O que decidiu a posição:** é a **tela mais receptiva ao sistema aprovado**, e por larga margem. Fundo
modal `#050505`, card `#1c1c1c`, **1,11% de croma — e esse croma é h60 (lima) que vive inteiro dentro
das imagens de mockup de stock**. Tira as imagens e sobra uma página branco-sobre-preto pura, onde o
bronze mede **9,41:1** e seria o único elemento cromático desde o primeiro pixel. É também o mais barato
(90 KB de CSS externo, 576 chars inline) e o mais curto (6.287 px).

**O gesto próprio:** o **display contornado** — palavra sólida sobreposta a uma duplicata em fio de
contorno. `-live-4.png`: "GET IN" sólido com "TOUCH" em outline logo abaixo. `-live-1.png`: a marquise
"MY WORKS" sólida seguida do fantasma vazado. É um gesto real, achromático e reproduzível em CSS
(`-webkit-text-stroke`). É a única coisa que o salva de ser mais um dark template.

**O que nele é genérico:** todo o resto. Nav de 4 itens HOME · ABOUT · WORKS · CONTACT; cards de serviço
BRANDING / MARKETING / DEVELOPMENT / DESIGN com **lorem ipsum literal** em todos (`-live-1.png`); card
de projeto com pílulas "DESIGN"/"IDENTITY". É o portfólio de freelancer padrão de 2020.

**Por que não é 1º:** a espinha está errada em **tamanho**, não em detalhe. 6.287 px para os 14 slots da
Parte 4 da direção de arte. Não há matriz comparativa, não há FAQ, não há processo, não há compromissos,
não há lugar para o §5. Você não editaria seções — **inventaria dez**, e nesse ponto o template
contribuiu com uma nav e um rodapé. É o retorno exato da falha que custou 3 rodadas.

E há o problema de luminância que ele traz de fábrica: **p98 = 83,8**, com a captura 2 medindo
**mediana 43** — quase meio viewport de mockup `#f6f6f6` numa página preta. A grade obrigatória da §6
da direção de arte trava **p98 abaixo de 70%**. Essas imagens reprovam — e elas *são* a seção de works,
ou seja, a espinha.

---

### 🥉 3º — `fr-agenciy`

**O que decidiu a posição:** é o mais bonito dos quatro, já é escuro (mediana 0,5), e o bronze passa
com folga nele (9,14:1 no hero, 9,70:1 no card). Perde por **três medições**, todas de identidade.

**O gesto próprio:** o par **sans + serifada itálica** no display ("Create," romano seguido de
*Impactful* em itálico de alto contraste) e o objeto de **cromo líquido**. É um gesto genuíno e caro de
imitar.

**Problema 1 — a cromática é complementar do bronze e é dele, não decorativa.** **6,00% de superfície
cromática, 4× o mockup do Talos (1,50%)**, e **25.345 px concentrados em h210** (mais 6.054 em h195 e
3.567 em h225). Bronze é h36. h36 × h210 = **174° de distância — complementar quase exato.** Não é um
token que se troca: é o especular do cromo e a galeria de projeto em cor cheia, isto é, a coisa que faz
o agenciy ser o agenciy. A Parte 1.1 já rodou esse argumento contra o matiz 240 do leanware; aqui a
tensão é pior e ocupa 4× mais pixel.

**Problema 2 — ele gasta o topo da escala de valor com objeto.** **p98 = 60,2 contra 28,6 da régua**;
o especular do blob mede `#909090`. No sistema aprovado `#fafafa` é `--ink`, reservado ao tipo. Quando
o objeto chega perto da tinta, o tipo perde o posto de coisa mais clara da página. É a razão medida de
o agenciy ler **cinematográfico** e a régua ler **instrumento** — e o Talos vende instrumento.

**Problema 3 — a espinha é credencial fabricada, que é pior que case fabricado.** `-live-2.png` e
`-live-3.png` mostram selos **"Bē UI/UX Featured · August 2024"** e **"W. Honor Mentions · March 2024"**
pendurados em projetos inventados. E o hero já carrega **"Featured (02)"** com miniaturas de projeto
(`-live-0.png`). Isso não é uma seção de works: é cerca de um terço dos 12.852 px **e entra dentro da
dobra**. `CONTEXT.md` §3 proíbe número inventado e logo de cliente que não é cliente; **um selo de
premiação é endosso fabricado de terceiro**, categoria mais grave, e ele está no lugar mais nobre.

---

### 4º — `wf-conicorn`

**O que decidiu a posição:** é o que o briefing trata melhor e o que mede pior. Já mostrei em §0.1 e
§0.2: **mediana 80,8, três capturas em 100, bronze a 1,93:1 no card.** É o **menos** compatível com D3
+ acento aprovado dos quatro, não o segundo mais.

**O gesto próprio:** o **gradiente iridescente pastel** no display e os ícones 3D vidrados. E é
justamente o problema. Medido, o croma do conicorn se espalha por **seis buckets de matiz** (210, 195,
15, 45, 30, 225) — policromia como identidade. A Parte 3.2 da direção de arte já resolveu essa classe de
pergunta: escolher o default da categoria é a **definição operacional de "genérico"**, que é literalmente
a palavra com que o founder rejeitou três builds. E aqui é pior que o verde: verde é *um* default de
2026; iridescência é *o* default. Tirar a iridescência do conicorn não sobra conicorn.

**O que nele é genérico, além disso:** logo de cliente inventado ("LGPSM") sob o título **"What We've
Built"** (`-live-4.png`); números de vitrine "50" e "X FASTER" (`-live-1.png`); e um vídeo de gente
corporativa em sala branca que carrega todos os *tells* de imagem gerada por IA (`-live-1.png`).
São quatro fabricações contra `CONTEXT.md` §3, no material de origem.

**🔧 Correção ao briefing, a favor dele:** a coluna `runtime` lista *"api.js, jQuery 3.5.1, conicorn
chunks"* e **omite três arquivos que estão em `finalistas-webflow.json`: `gsap.min.js`,
`SplitText.min.js`, `ScrollTrigger.min.js`.** É o único dos quatro com biblioteca de animação real
declarada — e "usar biblioteca de verdade" é regra permanente do founder, com `gsap ^3.15.0` já
instalado em `apps/talos/package.json`. **Vale minerar a coreografia de scroll do conicorn.**
Não muda a última posição: coreografia se copia sem levar a superfície junto.

---

## 3. Contraste e tipografia — quem quebra com caixa alta em PT-BR

Perfil de linhas de tinta, medido nos PNGs. Cabeçalho = altura da faixa de tinta; vão = pixels limpos
entre duas faixas.

| onde | faixas de tinta | vão | leitura |
|---|---|---|---|
| **idesignerlite** CTA "GET IN / TOUCH" (`-live-4`) | 108 px · 109 px | **11 px** | 🔴 quebra |
| **agenciy** hero "Create,/Impactful" (`-live-0`) | **faixa única de 247 px** — as duas linhas já se tocam em inglês | 0 | 🔴 quebra |
| **stackgrid** hero serifada (`-live-0`) | 40 px | 26 px | ✅ folgado |
| **stackgrid** H2 "Engineered Core" (`-live-1`) | 34 px, corpo em 13 px de vão | 13 px | ✅ folgado |
| *régua leanware* H1 (`00-REGUA-0`) | *61 · 56 px* | ***7 px*** | *tenso — e é a régua* |
| *mockup Talos* H1, 3 linhas (`mk-1440-00`) | *50 · 47 px* | ***17 e 20 px*** | *já afrouxado para PT-BR* |

**🔴 idesignerlite quebra, e o gesto dele é o que quebra.** Faixa de caixa alta de 108 px → corpo de
fonte ≈ 150 px (cap ≈ 0,72em numa grotesca). Com os valores da própria restrição de PT-BR do briefing:
- `Ç` desce **0,216em ≈ 32 px** abaixo da linha de base;
- `Ã` sobe ≈ **0,227em ≈ 34 px** acima da altura de caixa alta (0,954em − 0,727em).

O vão disponível é **11 px**. Qualquer um dos dois come o vão **três vezes**. E a sobreposição sólido ×
contorno *é* o gesto — em PT-BR ele vira colisão. Agravante: **o template inteiro é caixa alta**, e a
copy do Talos é cheia de Ç e Ã ("por onde COMEÇA", "DÁ PRA TIRAR DA SUA MÃO", "NÃO LI"). Margem de erro
grande na estimativa não salva: mesmo 20% menor, são 26 px contra 11.

**🔴 agenciy quebra por outro caminho.** As duas linhas do display se fundem numa única faixa de 247 px
já em inglês — a vírgula de "Create," desce dentro da zona da itálica e o "f" da serifada sobe. É o
display mais apertado do grupo. Um `ã` ou um `ç` numa itálica de alto contraste a ~145 px colide.
Pior: **em Framer você não consegue auditar a fonte.** O Framer serve subset próprio pelo serviço dele;
não existe `.woff2` em disco para rodar o `fontTools` que a Parte 1.2 rodou. Some junto: a descoberta do
eixo **`opsz` a 0 KB** (o diferencial tipográfico mais barato do projeto), a auditoria de GSUB/GPOS, e a
correção na origem do defeito nº 3 (`→ ★ ✓ ↗` faltando no subset). Regra permanente:
**auditar o `.woff2` antes de especificar tipo.** Em Framer não dá.

**✅ stackgrid é o de menor risco tipográfico dos quatro** — e é o achado que mais me surpreendeu.
Display de 40 px de faixa (≈52 px de corpo) com 26 px de vão; H2 de 34 px com 13 px; **e ele não usa
caixa alta praticamente em lugar nenhum** — só em etiquetas micro. Não há onde a caixa alta portuguesa
29% mais alta bater. Para comparação: ele é mais folgado que a própria régua escolhida pelo founder,
cujo H1 vive com **7 px** de vão.

**conicorn:** meu perfil de linha não isolou o display (o blob escuro sobre fundo claro contaminou o
recorte) — **declaro que não medi.** Pela leitura da captura, é caixa baixa, centrado, entrelinha
generosa; o risco de PT-BR é baixo. Não é por tipografia que ele cai.

---

## 4. Custo de adaptação para D3 + proibição de case/depoimento

Separado em **deletar** (tarde de trabalho), **inverter/reconstruir** (dias) e **inventar** (a dívida cara).

| | deletar | inverter / reconstruir | inventar | custo |
|---|---|---|---|---|
| **fr-stackgrid** | `[Pricing]` + os dois cards $1.000/$18.500 + botões "Book now" · `[Case Studies]` da nav · 3 depoimentos com retrato fabricado · a citação de "Kevin McCallister" · o ASCII do hero · 3 blobs borrados | **inverter a escala de valor** (branco→`#0f0f0f`) — barato porque o sistema é de linha e mede 0,89% de croma · trocar a serifada por Inter + JetBrains Mono | §5 mapa ao vivo (mas a gramática de diagrama já está lá) · §10 compromissos | 🟢 **baixo-médio** |
| **wf-idesignerlite** | seção WORKS inteira · marquise "MY WORKS" · cards de projeto com pílulas · **todas as imagens de mockup** (p98 83,8 reprova a grade da §6) · todo o lorem ipsum | nada de cor a inverter — a tela já serve, bronze a 9,41:1 · reescrever a nav de 4 itens | 🔴 **dez das quatorze seções** — matriz, FAQ, processo, casos de uso, compromissos, quem faz, mapa ao vivo… 6.287 px para um site de 14 slots | 🟠 **alto** (é invenção, não edição) |
| **fr-agenciy** | ⚠️ ~1/3 dos 12.852 px: galeria de projeto + **selos Bē/Awwwards com data** + "Featured (02)" **dentro do hero** | 🔴 **a cromática inteira** — 6,00% de croma, 35k px a h195-225, complementar do bronze · rebaixar p98 de 60,2 para ≤30 · substituir o cromo pela fotografia de forja já paga (`03-assets/`, 2,2 MB, `ferreiro` a h39 s21% l13%) | o que sobra depois de tirar o portfólio: quase toda a metade inferior | 🔴 **alto** (é identidade, não conteúdo) |
| **wf-conicorn** | logo "LGPSM" · seção "What We've Built" · "50" e "X FASTER" · vídeo de stock corporativo com *tells* de IA | 🔴 **a página inteira**: mediana 80,8 → 0,6; e remover a iridescência (6 buckets de matiz) é remover o template | as seções sobrevivem em número (13.962 px), mas nenhuma sobrevive em superfície | 🔴 **alto** — sobra a estrutura de conteúdo e nada mais; e a estrutura de conteúdo é a parte que já existe escrita em `COPY-V2.md` |

**Veredito sobre a espinha (pergunta 3 do briefing): é dívida, não seção — e o diagnóstico é a altura.**
idesignerlite tem 6.287 px para 14 slots → obriga a **inventar**. agenciy tem 12.852 px dos quais ~1/3
é portfólio **que entra na dobra** → obriga a **amputar no lugar mais visível**. Os dois voltam.
conicorn e stackgrid têm massa construída na proporção certa — mas a do conicorn é branca e policroma,
e a do stackgrid é branca e de linha. Só a segunda inverte barato.

---

## 5. Riscos que o briefing não listou

1. **🔴 Bronze reprova nas duas claras (§0.2).** 2,13:1 no stackgrid, 1,93:1 no card do conicorn — abaixo
   até do piso de 3:1 de componente. Isso reclassifica claro×escuro de gosto para sobrevivência do token
   aprovado, e o briefing trata como linha de tabela.

2. **🔴 A coluna `tema` mis-classifica o conicorn (§0.1)** e a §4 o absolve da crítica de D3 que ele
   merece igual ao stackgrid. Mediana medida: 80,8, com 3 de 5 capturas em 100.

3. **🟡 A coluna `runtime` omite GSAP + SplitText + ScrollTrigger do conicorn** — estão em
   `finalistas-webflow.json`. Sub-reporta a única coisa que ele tem que o founder exige por regra.

4. **🔴 Em Framer não se audita a fonte.** Sem `.woff2` em disco não roda `fontTools`; morre o eixo
   `opsz` (diferencial a 0 KB), morre a auditoria GSUB/GPOS, e o defeito nº 3 (`→ ★ ✓` fora do subset)
   fica sem correção na origem. Vale para **stackgrid e agenciy** como plataforma.

5. **🔴 Nenhuma das duas plataformas hospeda o §3 — e o §3 é o site.** `apps/talos/lib/mapear.ts` tem
   **34,6 KB** com suíte de teste de 15,6 KB; `apps/talos/package.json` já traz `three`,
   `@react-three/fiber`, `@react-three/drei`, `gsap`, `lenis`, `motion`, Next 16 + React 19 + Tailwind 4.
   Framer **não tem export de código**; o export do Webflow entrega HTML/CSS/JS estático que teria que
   ser revertido para componente. `CONTEXT.md` §3 diz que a máquina rodando ao vivo é o que substitui o
   case. **Escolher plataforma que põe isso em risco é decisão de negócio fantasiada de decisão de design.**

6. **🟠 Resposta à pergunta 4 do briefing ("Framer × Webflow: o export compensa o jQuery?"): a pergunta
   tem premissa falsa e eu a recuso.** Nenhum dos quatro vira a base — a base já é `apps/talos/`. O que
   se compra aqui é **gramática de seção e gesto**, não plataforma. E, se ainda assim se escolher
   plataforma: `jquery-3.5.1` é de **abr/2020, seis anos**, e vai em ambos os Webflow. Num site cujo
   argumento é "eu construo sistema moderno automatizado", isso é artefato de credibilidade — qualquer
   um que abra o *view-source* lê.

7. **🟠 Risco jurídico invertido.** Se o template for **referência** e não *remix*, o risco não é de
   plataforma: é copiar arquivo. Gramática de layout não se protege como se protegem render 3D, foto,
   ícone e fonte. Regra: **colher gramática, nunca arquivo.** Caso específico: as imagens do
   idesignerlite são mockups **ls.graphics** — a licença delas não viaja com o remix do template.

8. **🟠 O canto inferior direito já está ocupado nos dois Framer.** O selo "Made in Framer" aparece em
   (1281–1419, 845–877) nas 10 capturas Framer, e o agenciy carrega **ainda** um widget "NEW TEMPLATES"
   em (1277–1420, 730–838). É exatamente onde iria um CTA fixo ou um widget de conversa.

9. **🔴 O estado real do projeto não é "não temos base" — e isso muda a conta.**
   `05-build/mockup/index.html` existe: **91,0 KB, 28/Jul 16:17**, com `build.mjs`, `fonts/`, `js/` e
   `NOTAS.md`, tirado em **14 quadros a 1440 + 23 a 390 + 14 sem-JS** (`05-build/shots/mk-*`).
   Medido, ele implementa a direção de arte com precisão: **mediana 0,6 · p98 30,4 · 1,50% de croma com
   `30°: 30.195 px` e mais nada no top-6** — 100% do croma é bronze, exatamente a regra da Parte 1.1
   ("bronze é o único elemento cromático da página"). É mais próximo da régua leanware
   (0,6 / 28,6 / 3,34% em h150) do que qualquer um dos quatro candidatos. E já está em PT-BR, com o
   mapa ao vivo funcionando (`mk-1440-04.png`, contador "17,3 h por mês") e com a linha de honestidade
   *"Sem case ainda. E eu não vou inventar um."* no lugar do selo Clutch.
   ⚠️ Não existe `APROVADO.md` — **o gate F4 continua aberto** e não estou declarando aprovação. Mas
   qualquer estimativa de custo de template tem que ser **líquida do que já existe**, e o briefing
   estima bruta.

10. **🟡 O gate de PT-BR nunca rodou nos candidatos.** A régua vive com **7 px** de vão no H1 (medido);
    o mockup já subiu para **17-20 px** justamente para caber acento. Quem vencer herda um display
    afinado em inglês — **orçar o refluxo**, não descobri-lo no build.

---

## 6. Recomendação

**Levar o `fr-stackgrid` — e levá-lo como doador de gramática, não como plataforma.**

O que dele vale a pena, nominalmente: **linha-guia com etiqueta**, **marca de corte `+`**, **chip preto
de rótulo**, **card de borda tracejada**, **grafo de nós** e a **moldura de folha** com filetes verticais
fixos. Seis objetos. Todos achromáticos, todos de linha, todos traduzíveis direto para os tokens
`--border` `#262626` / `--border-strong` `#303030` / `--bronze` `#E9A23B` que a Parte 1.3 já fixou, e
todos servindo à seção que carrega o site (§5, o mapa ao vivo).

O que **não** vale: a superfície branca, a serifada, o ASCII, os blobs, o preço, o case, os depoimentos.

⚠️ E o alerta honesto que acompanha a recomendação: **o stackgrid invertido converge para o mockup que
já está em disco.** Ambos, medidos, são sistemas escuros achromáticos desenhados a linha. O delta real
que o stackgrid acrescenta é a **linguagem de esquema anotado** — e essa vale colher. O resto do
stackgrid não vale comprar. Se a expectativa for que um template resolva o que três rodadas não
resolveram, nenhum destes quatro faz isso: o problema medido nunca foi falta de base, foi falta de
aprovação seção a seção.

**Decisão que continua sendo do founder, e que não é de arte:** aprovar ou reprovar os 14 quadros de
`05-build/shots/mk-1440-*.png`. Enquanto `APROVADO.md` não existir, trocar de base só troca o objeto
que aguarda aprovação.
