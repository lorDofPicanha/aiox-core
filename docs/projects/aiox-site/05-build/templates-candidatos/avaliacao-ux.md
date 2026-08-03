# Avaliação UX — 4 templates finalistas (site Talos)

**Autor:** Uma (aios-ux) · **Data:** 2026-07-31
**Lente:** arquitetura de informação e conversão. Não é direção de arte.
**Base:** `BRIEFING-FINALISTAS.md` · `squad/ARQUITETURA-SECOES.md` (28/Jul, minha) ·
`00-context/CONTEXT.md` §3 e §4 · `01-research/01-ux-conversao-fontes-primarias.md` ·
20 capturas em `shots-finalistas/` (1440×900).

**Método de leitura das capturas.** `capture-webflow.cjs` linha 33 fixa os offsets de scroll em
`y = 900 × n × 1,5` → **0 · 1.350 · 2.700 · 4.050 · 5.400**. Toda posição absoluta citada abaixo é
`offset + linha do pixel na captura`. São medidas, não estimativas.

---

## 0. O critério, antes do ranking

Ranking sem critério declarado é gosto. O critério é **lexicográfico**: o item de cima decide antes
de o de baixo ser consultado.

| # | critério | pergunta | por que nesta posição |
|---|---|---|---|
| **C1** | **Espinha** | a estrutura pressupõe **acervo** ou pressupõe **método**? | é o único defeito que edição de seção não corrige — ver §4 |
| **C2** | **Host** | o `mapear.ts` roda no artefato final, e o artefato final é `apps/talos`? | §3 do CONTEXT é o coração do site; template que não hospeda o coração não é base |
| **C3** | **Direção do corte** | sobra altura (cortar) ou falta (inventar)? | cortar é deletar; inventar é decidir sem referência — e decidir sem referência foi o que matou 3 rodadas |
| **C4** | **Tema / tokens** | distância até D3 (escuro) | desempate barato. **Nunca decisor** — paleta é a camada mais rasa de todas |

**C4 é deliberadamente o último, e isso contraria o briefing.** O briefing trata "stackgrid é claro"
como se fosse eliminatório e trata a espinha do conicorn como se fosse limpa. As duas leituras estão
invertidas: cor é troca de token; espinha é troca de site.

**Régua de altura.** `ARQUITETURA-SECOES.md` §2.4 fixa o alvo em **~10.000–10.700px** com 12 seções
de conteúdo, teto rígido.

---

## 1. Ranking

| pos | template | C1 espinha | C2 host | C3 corte | C4 tema | veredito |
|---|---|---|---|---|---|---|
| **1º** | **wf-conicorn** | ✅ método (automação) | ✅ Webflow · 128 KB CSS externo · export | ✅ sobra 3.262–3.962px → **cortar** | ⚠️ **corpo branco** (o briefing errou) | **base** |
| 2º | fr-stackgrid | ✅ método (agentes/pipelines) | 🔴 Framer · **0 KB CSS externo** · sem export | 🔴 falta 1.773–2.473px → **inventar 21–30%** | 🔴 claro | **doador de estrutura, não base** |
| 3º | fr-agenciy | 🔴 acervo — **e na dobra** | 🔴 Framer · **0 KB CSS externo** · sem export | ⚠️ sobra, mas o que sobra é vitrine e o que falta é prova | ✅ escuro | descartar |
| 4º | wf-idesignerlite | 🔴 acervo · nav WORKS · **lorem ipsum** | ✅ Webflow · 90 KB · export | 🔴 falta **3.713–4.413px = 37–41% da página** | ✅ escuro | descartar |

### 1.1 Por que conicorn ganha (C1 + C2)

**C1.** As quatro seções que consegui medir são **todas argumento de método** — a única moeda que o
Talos tem: `002 VALUES` (por que nós) · `003 CAPABILITIES` (o que a máquina faz) ·
`004 PROCESS` (como se trabalha) · grid `Your Data. Protected. Always.` (garantias). Nenhuma delas
precisa de cliente para existir. Isso é a espinha certa, não por sorte: é o mesmo esqueleto que a
`ARQUITETURA-SECOES.md` escreveu como diff contra o leanware.

**A consequência mais importante do documento inteiro:** minha arquitetura de 28/Jul **é um diff
contra uma página de agência**. Ela transfere para conicorn quase inteira. Ela **não transfere** para
uma galeria de portfólio — lá não há linha-a-linha para diffar, só um slot vazio pedindo trabalho.

**C2.** O destino do build é `apps/talos` (Next; 18 componentes; `lib/mapear.ts` em TS rodando no
navegador em ~2 ms). O `reference_forkability_test` do próprio projeto (CONTEXT §6) diz: CSS externo
minúsculo em página complexa = layout JS-driven, colapsa sem os bundles. Medido:

| | CSS externo | altura | leitura |
|---|---|---|---|
| conicorn | **128 KB** | 13.962px | forkável |
| idesignerlite | 90 KB | 6.287px | forkável |
| stackgrid | **0 KB** (334.643 chars inline) | 8.227px | caso extremo da condição de falha |
| agenciy | **0 KB** (231.672 chars inline) | 12.852px | idem |

Os dois Framer não reprovam por gosto: reprovam pela regra que este projeto já escreveu.

**Bônus de C2 que o briefing tratou como passivo.** O briefing lista o runtime do conicorn como
custo ("jQuery 3.5.1"). Metade dele é **ativo**: `finalistas-webflow.json` mostra
**`gsap.min.js` + `SplitText.min.js` + `ScrollTrigger.min.js`**. Na porta para Next o jQuery é
descartado (ele só serve às interações do Webflow) e o GSAP **vai junto** — que é exatamente a
exigência registrada em `feedback_use_real_libraries_not_handmade_css`. **Framer × Webflow não é
"export vs jQuery": é "CSS + GSAP que você leva" vs "nada que você leva".**

### 1.2 Por que stackgrid é 2º apesar de tudo

Espinha certa (C1) e — sozinho entre os quatro — **um host visual nativo para a §5**: o grafo de nós
`The Integration Ecosystem` (captura 2, y≈3.320: nó central + 4 ramos rotulados) é literalmente a
forma de saída do `mapear()`. O vocabulário de moldura tracejada, cantos `+` e etiqueta preta é
gramática de diagrama técnico, não de vitrine.

Morre em C2 (0 KB externo, sem export) e leva junto dois objetos proibidos **explícitos**:
`$1,000` e `$18,500` com botão *Book now* (captura 3) e depoimento assinado com foto e cargo
(captura 4, "Kevin McCallister, Chief Operating Officer"). **Use como referência de forma da §5.
Não use como base.**

### 1.3 Por que agenciy cai para 3º mesmo sendo o melhor visualmente

É o único que cumpre D3 sem retrabalho e a arte é a mais madura dos quatro. E é descartável mesmo
assim, por um motivo de arquitetura: **a espinha errada dele está dentro da dobra.**

Captura 0, tudo acima de 900px: headline · lista `We do` com 4 serviços (= tensão T2 do CONTEXT,
"lê como freelancer") · faixa de logos de cliente (`hues`, `venice`, `ca…`) · card
`Featured (02)` com projeto. **Três objetos proibidos e um risco T2, simultâneos, no objeto mais
caro da página** — a `ARQUITETURA-SECOES.md` §6 dá à dobra um orçamento de 10 segundos e 6 objetos,
todos já alocados. Adotar agenciy = refazer a dobra do zero, e a dobra é o que decide o site.

Piora nas capturas 2–4: vitrine de projeto em tela cheia com selos `Bē UI/UX Featured` e
`W. Honor Mentions` datados. Selo de prêmio de terceiro é a categoria exata que a arquitetura §4.1
proíbe.

### 1.4 Por que idesignerlite é último

6.287px contra alvo de ~10.350: **falta 37–41% da página**. Do que existe: hero sem conteúdo
informativo (só o wordmark "iDESIGNER" atrás de um robô), 4 cards de serviço **com Lorem ipsum**
(captura 1 — o template nem foi preenchido pelo autor), marquee `MY WORKS`, galeria de mockups
`WEBSITE REDESIGN / DESIGN / IDENTITY`, `GET IN TOUCH`, rodapé. Nav: HOME · ABOUT · WORKS · CONTACT.

Ou seja: **inventar ~40% e demolir ~40% do que resta.** E a dobra entrega 1 objeto dos 6 que a
hierarquia exige. Não é um candidato; é um hero bonito.

---

## 2. Mapa seção-a-seção — as 12 seções da `ARQUITETURA-SECOES.md` sobre o conicorn

Posições absolutas medidas a partir dos eyebrows numerados:

| eyebrow | y absoluto | altura da seção |
|---|---|---|
| `001` hero | 0 | ~2.180px (hero + faixa de stat/vídeo) |
| `002 ● VALUES` | **2.180** | 947px |
| `003 ● CAPABILITIES` | **3.127** | 1.503px |
| `004 ● PROCESS` | **4.630** | 1.304px |
| `005 ● CASE STUDIES` | **5.934** | não medida (fim da observação) |

Média das seções 002–004: **1.251px**. Leanware: 7.764/11 = **706px**.
**A seção do conicorn é 1,77× mais alta que a do leanware.** Guarde este número — ele reaparece no §5.

### 2.1 Quem recebe quem

| # | seção da arquitetura | slot do conicorn | tipo |
|---|---|---|---|
| §0 | Nav | pílula com hamburger `Menu` + CTA `Get this Template` | 🔴 **refazer** — a arch §1 exige `quem faz` e `falar comigo` **visíveis**; hamburger em desktop enterra os dois |
| §1 | Hero | `001`, 0→~1.100px | 🔴 **refazer o layout** — ver §2.3 |
| §2 | Faixa de verbos | faixa de stat `…X FASTER` / `50…` + vídeo com foto de equipe, ~1.100→2.180 | 🔁 mesmo slot, conteúdo trocado. Mata os números e a foto stock. **É o slot pós-dobra que a arch §5.1 disputa** |
| §3 | O problema | `002 VALUES` — "Why Choose Us?", 3 cards | 🔁 geometria idêntica: 3 cards ↔ 3 cenas com carimbo |
| §4 | Casos de uso por ramo | `003 CAPABILITIES` — 3 cards grandes | ⚠️ **componente novo**: a arch pede 4 abas × 16 processos + CTA `usar este exemplo` por linha. Grade de 3 não serve |
| §5 | **O mapa ao vivo** | `005 CASE STUDIES` — "What We've Built", mídia-esquerda/copy-direita, full-width | ✅ **a troca central cai no slot certo**. O case sai, o demo entra, mesmo container. Herda também o mini-painel de checklist do card *AI Workflow Automation* (`003`: "Workflow mapping · Real-time system integration · Validated output") como formato do `HeroPreview` |
| §6 | Como funciona | `004 PROCESS` — timeline vertical de 5 passos | ✅ **melhor encaixe da página**. 5 → 3 passos |
| §7 | Quem faz | card `Not sure what to automate first?` (foto de pessoa + CTA), captura 3 | 🔁 parcial — falta bio, procedência e links externos com `target="_blank"` |
| §8 | Por onde começa | reaproveita geometria de `002`/`003` | ⚠️ precisa virar **2 colunas** (o que está incluso / o que vem depois), com as duas de peso igual (arch §2.3) |
| §9 | Como se compara | **não existe** | ➕ **do zero — e nos quatro templates**. Neutro no ranking |
| §10 | Compromissos | grid `Your Data. Protected. Always.` — 4 células horizontais | ✅ geometria perfeita para faixa de stat invertida. **4 → 3 células** (teto Baymard) |
| §11 | FAQ | zona 6.300–13.962 | ❓ **não observado** |
| §12 | Contato | idem | ❓ **não observado** |
| §13 | Rodapé | idem | ❓ **não observado** |

**Encaixe direto ou por troca de conteúdo: 7 de 13.** É muito, para um template que ninguém desenhou
para este site.

### 2.2 O que sobra (demolir) e o que falta (construir)

**Sobra — cada item é prova-do-passado que o Talos não pode ter:**

1. `005 CASE STUDIES` com **logo de cliente (`LGPSM`)** e título "AI Workflow Automation for SaaS
   Company". 🔴 **O briefing não listou isto.** Conicorn tem seção de case, com logo, no meio da
   página.
2. Faixa de stat numérica `…X FASTER` / `50…` (captura 1). Não há número honesto para nenhuma célula.
3. **Foto de equipe de banco de imagem** com botão de play (captura 1). Três pessoas numa sala é
   afirmação de equipe; o Talos é uma pessoa. E NN/g é explícito: para serviço, o que converte é
   **trabalhador em ação em todos os estágios**, não reunião genérica.
4. Card de chat com a bolha **"Can you tell me more about pricing?"** (captura 2). Viola duas regras
   de uma vez: `ARQUITETURA-SECOES.md` §4.6 ("não vira chat") e a proibição de preço no site.
5. O que existir entre 6.300px e 13.962px — **não verificado**. Ver §5, risco 1.

**Falta — construir:**

| falta | esforço | origem |
|---|---|---|
| §9 Como se compara (matriz 5×5) | alto | arch §5.3 — nenhum dos 4 templates tem |
| §4 em abas + CTA `usar este exemplo` × 16 | médio | arch §7 itens 3 e 4 |
| Persistência do mapa §5 → §12 | médio | arch §4.4 — **furo de conversão nº 1**, e nenhum template resolve |
| §8 em duas colunas de peso igual | baixo/médio | arch §2.3 |
| §7 completo (bio + links externos) | baixo | arch §7 |
| Rótulo acima da §2 | trivial | arch §2.2 M1 |
| Linha de honestidade na dobra (A+B) | baixo | arch §6.2 — **gate do founder (D-A)** |

### 2.3 O conflito real do vencedor: a dobra

Medido na captura 0 (1440×900): badge y≈256 · H1 linha 1 y≈333 · linha 2 y≈413 · sub 2 linhas
y≈487 e 509 · CTAs y≈632. Abaixo de 632, **268px de blob vazio**. Em 1366×768 sobram **136px**.

Dois problemas, ambos aritméticos:

1. **O H1 do Talos é 50% mais longo.** `Intelligent Automation for Modern Teams` = 38 caracteres, 2
   linhas. *"O trabalho repetitivo da sua empresa não precisa de gente."* = **57 caracteres, 9
   palavras** → 3 linhas no mesmo corpo → +~80px → CTAs em ~712 → em 1366×768 o CTA **encosta na
   borda** e nada mais cabe. E a arch §6.3 item 3 já fixou como regra que **o topo do card de mapa
   precisa aparecer em 1366×768**.
2. **Conicorn é centrado sobre o objeto 3D; a arquitetura assume texto-à-esquerda / cena-à-direita**
   (§6.3 item 5: "terço direito é da cena 3D"). Não existe slot lateral para o card.

Saídas, ambas caras e ambas conscientes: (a) hero em 2 colunas, texto à esquerda, blob à direita —
mantém a arch intacta e reescreve o hero do template; (b) manter centrado, aceitar que o card só
aparece abaixo da dobra e **reescrever a regra §6.3-5 da arquitetura**, assumindo que a dobra passa a
entregar 5 objetos em vez de 6.

**Minha recomendação: (a).** O card é o objeto 6 e a arch §6.3 item 4 diz que ele **nunca** é cortado
— é a única prova que existe. Cortar o eyebrow e o CTA secundário vem antes.

⚠️ E some o gradiente multicolor da headline. Rosa/amarelo/azul em H1 é o tell padrão de template de
"AI agency" 2024-2026; a régua do projeto (`leanware`) usa **um** acento. Manter é assinar
"mais um site de IA".

---

## 3. Onde o §3 (`mapear.ts` ao vivo) entra em cada template

| template | slot natural | veredito |
|---|---|---|
| **wf-conicorn** | `005 CASE STUDIES` — container full-width mídia+copy, a 5.934px (≈43% da página) | **natural.** É o mesmo movimento que a arch já projetou contra o leanware: 840px de case viram o demo, mesmo slot, mesma posição relativa (~43% vs 50% recomendado). O painel de trace herda o formato do checklist do card `003` |
| **fr-stackgrid** | grafo `The Integration Ecosystem` (nó central + 4 ramos) | **natural — e o melhor dos quatro.** É a forma de saída do `mapear()` desenhada por outra pessoa. Mas o site é claro: o painel de trace do Talos é escuro, então a linguagem muda; e o `textarea` + estado exige code component em Framer |
| **fr-agenciy** | nenhum | **enxerto.** O miolo é vitrine de imagem em tela cheia com selo de prêmio. Um `textarea` + painel numérico ali quebra o ritmo do template no objeto mais importante do site, e cria uma linguagem visual órfã que não aparece em nenhum outro lugar da página |
| **wf-idesignerlite** | nenhum | **enxerto.** Sequência hero → serviços → galeria → contato. O demo entra no lugar da galeria (e aí sobram os cards de mockup órfãos) ou depois dela (e aí a prova vem depois do acervo vazio) |

**A pergunta que separa natural de enxerto:** *o template já reserva um container largo, no meio da
página, para o objeto que carrega a credibilidade?* Conicorn e stackgrid reservam — para case e para
diagrama. Agenciy e idesignerlite reservam **para imagem de trabalho entregue**, e imagem de trabalho
entregue é precisamente o que não existe.

---

## 4. Veredito duro sobre a espinha

**Não se conserta editando seção. A dívida volta. Voltou 3 vezes.**

O argumento não é estético. Espinha de um template não é a lista de seções — é três coisas, e só a
primeira é editável:

| camada | o que é | edita? |
|---|---|---|
| a) o que a nav promete | `WORKS`, `PROJECTS`, `Pricing`, `Case Studies` | ✅ barato — troca de rótulo |
| b) **onde a página põe seu objeto mais largo e mais alto** | galeria, vitrine, faixa de logos | 🔴 não. É o layout inteiro |
| c) **qual pergunta a página assume já respondida** | "você já viu o que ele fez; agora escolha" | 🔴 não. É a premissa do fluxo |

Trocar (a) e deixar (b) e (c) produz um site que **continua perguntando**. Um template de portfólio
dedica seu maior container a um objeto que só existe com acervo. Tire o acervo e o container **não
fica vazio — fica disponível.** E container disponível na posição nobre é um convite permanente: a
próxima rodada de refino vai preenchê-lo com a coisa mais parecida com um case que a honestidade
ainda permitir. Primeiro um mockup "ilustrativo". Depois um "exemplo de projeto". Depois um número
"de referência". **Foi assim que as 3 rodadas anteriores morreram: não por falta de gosto, mas porque
a base continuou fazendo uma pergunta que o projeto não pode responder.**

O teste operacional, em uma frase: **se a seção fosse deletada, o template ficaria coerente ou ficaria
com um buraco?**

- conicorn sem `005 CASE STUDIES`: coerente. Sobram 4 seções de método, que se sustentam sozinhas.
- agenciy sem vitrine de projeto: **é um buraco na dobra e no miolo**. O que sobra é uma lista de 4
  serviços — a tensão T2 do CONTEXT, sem antídoto.
- idesignerlite sem galeria: sobram um hero, 4 cards de Lorem ipsum e um rodapé.
- stackgrid sem pricing e sem cases: sobram ~5.000px de estrutura correta e um grafo excelente. É o
  único dos "errados" que não é errado — o problema dele é host, não espinha.

**Corolário incômodo, e é o ponto mais importante desta avaliação:** conicorn **também** tem a doença
do leanware. A `ARQUITETURA-SECOES.md` §0 mediu que 29,7% do leanware é prova-do-passado. No conicorn
consegui identificar 3 objetos da mesma família só nos 43% observados. **A diferença não é que
conicorn seja limpo — é que a receita já está escrita para exatamente esta doença, e ela transfere.**
Escolher conicorn é escolher aplicar um diff que já existe. Escolher agenciy ou idesignerlite é
escrever um diff novo, sem referência, na 4ª rodada.

---

## 5. Riscos que o briefing não listou

### 🔴 1. A decisão está sendo tomada com metade da página nunca vista — e nos dois melhores candidatos

`capture-webflow.cjs` para o scroll em **y = 5.400** (última captura cobre 5.400–6.300).

| template | altura | observado até | **fração nunca vista** |
|---|---|---|---|
| conicorn | 13.962px | 6.300px | **54,9% (7.662px)** |
| agenciy | 12.852px | 6.300px | **51,0% (6.552px)** |
| stackgrid | 8.227px | 6.300px | 23,4% |
| **idesignerlite** | 6.287px | 6.300px | **0% — o único 100% observado é o último colocado** |

Pior: em template de agência, é **exatamente na metade de baixo** que moram depoimentos, pricing,
blog e selos. Encontrei `005 CASE STUDIES` a 5.934px, na última captura possível — ou seja, o
primeiro objeto proibido apareceu no último pixel observado. **Há 7.662px de conicorn não auditados.**
Rodar 5 capturas adicionais em y = 6.750 · 8.100 · 9.450 · 10.800 · 12.150 custa minutos e é
pré-requisito para fechar a decisão.

### 🔴 2. Conicorn não é "claro no hero" — é **claro no corpo**

O briefing registra `tema: claro/cinza no hero`, o que sugere corpo escuro. As capturas dizem o
oposto: **1, 2, 3 e 4 são fundo branco/cinza-clarinho**, e o hero é o **único** trecho escuro (blob
preto sobre cinza). Quatro de cinco capturas. A distância até D3 é bem maior do que o briefing
precifica — mas continua sendo troca de token, não de espinha, e por isso não muda o ranking.

### 🟡 3. O corte necessário é de **altura por seção**, não de contagem de seções

Conicorn tem seções de **1.251px de média** contra 706px do leanware — **1,77×**. Cortar as 3 seções
proibidas leva os 13.962px para ~10.200px *se e somente se* as restantes mantiverem o tamanho — mas
aí sobram ~8 seções, e a arquitetura pede 12. **12 × 1.251 = 15.012px**, 45% acima do teto.
Portanto: ou a arquitetura perde seções (proibido — o teto de 12 é rígido e já foi pago com o corte
da §Escada), ou **cada seção do conicorn precisa ser comprimida em ~30%**. Isso é retrabalho de
layout, não de conteúdo, e não está no orçamento do briefing.

### 🟡 4. Licença — ninguém checou, e é bloqueio jurídico, não estético

Template Webflow **gratuito**: o direito de uso costuma ser *dentro do Webflow*, e o export exige
plano pago. Portar CSS + estrutura para um repositório Next é um uso diferente do concedido. Idem
para "Made in Framer" e para raspar um site Framer publicado. **Ler os termos antes de portar uma
linha.** O risco de reescrever tudo depois de descobrir a restrição é maior que o custo de 20 minutos
de leitura agora.

### 🟡 5. Nav em hamburger no desktop mata duas exigências da arquitetura

Captura 0 do conicorn: `☰ Menu` + botão. Não há links visíveis. A arquitetura §1 exige `falar comigo`
persistente (é o atalho do visitante já prospectado, D2) **e** a adição de `quem faz` (pergunta nº 1
desse visitante). Menu escondido enterra os dois no clique. Correção obrigatória, e ela também
significa que **os itens reais da nav do conicorn são desconhecidos** — pode haver `Pricing` lá dentro.

### 🟡 6. Foto de banco de imagem é a única mentira visual que sobreviveria à limpeza de copy

Todo o esforço de honestidade do projeto é textual e numérico. Uma foto de reunião com 3 pessoas
sorrindo numa sala branca (captura 1 do conicorn) afirma **equipe** sem escrever uma palavra, é
reconhecível como estoque, e NN/g coloca *design quality* e *conteúdo correto* como 2 dos 4 fatores
de credibilidade. **Regra sugerida, no mesmo nível das outras:** nenhuma foto de pessoa que não seja
o founder.

### 🟡 7. "Export vs jQuery" é uma falsa oposição — e o briefing perdeu o ativo

Se o destino é `apps/talos`, o jQuery **não vai junto** (só serve às interações do Webflow). O que
vai é o CSS e o vocabulário de motion. E o conicorn carrega **GSAP + SplitText + ScrollTrigger**,
que é a exigência explícita registrada em `feedback_use_real_libraries_not_handmade_css`. O briefing
listou o runtime só na coluna de custo.

### 🔴 8. O bloqueio que nenhum template resolve — e que já matou uma rodada

`lib/perfil.ts` está com **`PREENCHER: nome`** e `PERFIL.whatsapp` **vazio**
(`ARQUITETURA-SECOES.md` §3, D-F). Sem isso:

- a §7 (Quem faz) não renderiza — e ela é o **4º fator de credibilidade**, o único que arquitetura
  nenhuma substitui;
- a §5 fica **sem fiador** (demo anônimo é suspeito; demo assinado é credencial);
- a §12 não converte.

**Escolher template hoje sem D-A / D-B / D-F respondidos é abrir a 4ª rodada com o mesmo bloqueio que
travou a 3ª.** A escolha do template não é o caminho crítico. O `perfil.ts` é.

### 🟢 9. Nota de método

Sem consulta a Mind Clone nesta avaliação — o material decisório é fonte primária já em disco
(capturas medidas + JSON de medição + pesquisa NN/g do `01-research/`), coerente com
`feedback_no_hydra_style`. Nenhuma medida foi estimada: todos os `y` vêm de
`offset = 900 × n × 1,5` + linha do pixel.

---

## 6. Recomendação

**Base: `wf-conicorn`.** Não porque seja bonito — ele não é o mais bonito, agenciy é. Porque é o
único que satisfaz C1 e C2 ao mesmo tempo, e porque **a arquitetura de 28/Jul foi escrita como diff
contra exatamente este tipo de página** e transfere quase inteira: 7 dos 13 blocos têm host direto ou
por troca de conteúdo.

**Antes de fechar, três coisas, nesta ordem:**

1. **Auditar os 7.662px não vistos** (5 capturas em y = 6.750 · 8.100 · 9.450 · 10.800 · 12.150).
   Se aparecer Pricing com número, ou depoimento com foto, o custo de demolição sobe e a comparação
   com stackgrid precisa ser refeita. Custo: minutos.
2. **Ler a licença** do template gratuito antes de portar CSS para `apps/talos`.
3. **Responder D-A, D-B e D-F** (`ARQUITETURA-SECOES.md` §8). Template nenhum desbloqueia o
   `perfil.ts`.

**Ordem de trabalho depois disso:** dobra em 2 colunas (§2.3) → demolir os 4 objetos de
prova-do-passado → aplicar o mapa da §2.1 → comprimir altura de seção em ~30% → construir §9 e a
persistência §5→§12.

**Usar stackgrid como doador de uma coisa só:** a forma do grafo `The Integration Ecosystem` como
referência de composição para o painel do §5. Nada além disso.

— Uma, desenhando com empatia 💝
