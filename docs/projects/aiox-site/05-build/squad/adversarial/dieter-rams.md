# REVISÃO ADVERSARIAL — dieter-rams

**Alvo:** `05-build/squad/DIRECAO-ARTE.md` (1.306 linhas) · `05-build/squad/ARQUITETURA-SECOES.md` (721 linhas)
**Método:** `*ten-principles-review` + `*functional-honesty-check` + método da subtração
**Data:** 2026-07-28 · **consultationId:** b9a6a391-db64-49b8-87e6-439749271b40

> Regra deste documento: cada veredito cita o princípio que o sustenta. Princípio não citado é
> princípio não usado. Onde eu verifiquei em disco, o número está aqui. Onde eu não verifiquei,
> está dito.

---

## O que eu verifiquei antes de julgar

| verificação | comando/arquivo | resultado |
|---|---|---|
| malhas de ponto na referência | regex sobre `page.html` | **5 regras** `dotgrid` (offsets 18787, 24883, 40257, 113747, 119275) + 1 dentro do chat falso (12870). Passos: 24, 32, 28, 24, 24 — **3 distintos, não 4** |
| brilhos radiais na referência | idem | **4** (18567 hero · 36091 trust-strip · 40036 rodapé · 119078 CTA). A contagem da Parte 1.5 está certa |
| carga de asset da referência | `du` em `inputs/leanware/assets` | **256 KB no total.** 139 KB são fontes. **Imagem inteira: 83 KB.** As três ilustrações da §diferenciais somam **11,3 KB** (4202 + 3764 + 3648 bytes) |
| matéria-prima proposta | `03-assets/fotos/` | **2.200.748 bytes.** Maior arquivo: `textura-metal-1920.webp`, **878 KB** |
| `--ink-3` do leanware | recalculado à mão (sRGB, composição sobre `#0e0e10`) | **3,96:1.** A `DIRECAO-ARTE` está certa. `ARQUITETURA-SECOES` §6.3 nº7 e `RETOMAR-AQUI.md` carregam **3,78:1** — número velho, em documento que está sendo usado como régua |
| pulso do rodapé | `page.html` @240253 | `lw-footer__folio-pulse` está colado em **"EST. 2020 · BOGOTÁ · GMT-5"** |

Uma linha de crédito, e sigo: as 37 medições de contraste da Parte 2.2 conferem em número e em
método, e a recusa em copiar o `data-lw-placeholder="hero-chat"` — que se declara `role="img"` no
próprio markup — é a decisão mais correta dos dois documentos. Isso é honesto. O resto abaixo não é.

---

## VEREDITO POR ALVO

### Alvo 1 — 4 malhas de ponto e 4 brilhos · **NÃO SUSTENTA**

**Princípio 10 (o mínimo de design possível) e Princípio 5 (discreto — produtos são ferramentas,
não objetos decorativos).**

A Parte 1.5 anuncia uma correção: *"dois passos, não quatro"*. Corrigiu o vocabulário. E aumentou a
ocorrência. Contagem na tabela de ritmo da Parte 4:

| camada | referência | proposta Talos |
|---|---|---|
| malha de pontos | 4 seções (11 seções de página) | **6 seções** (slots 1, 4, 5, 8, 12, 13) |
| brilho radial | 4 | **4** — *"o Talos herda inteiro"* (Parte 1.5) |
| lavagem fotográfica | 0 | **2** (hero `.06`, rodapé `.04`) |
| **total de camadas de fundo** | **8** | **12** |

O documento normalizou os degraus e multiplicou as instâncias. Isso é o inverso de *weniger aber
besser*. Padronizar ruído não o transforma em sinal — só o torna consistente.

O pior lugar é a dobra. Parte 4, §1, "Camadas de fundo do hero", quatro camadas empilhadas atrás do
H1: fotografia a 6% → brilho → malha → cena 3D. Quatro objetos, nenhum deles carrega informação, e
os três primeiros existem para tornar o quarto menos solitário.

E há um defeito de raciocínio dentro da própria justificativa. O brilho do hero está em `92% -8%` —
o canto superior direito. A restrição nº 5 de `ARQUITETURA-SECOES` §6.3 diz que **o terço direito é
da cena 3D**. A função declarada do brilho é *"fazer o preto parecer profundo em vez de chapado"*.
Naquele canto o campo já não é chapado: tem um objeto tridimensional em cima. O brilho resolve um
problema que o elemento vizinho já resolveu. **Este elemento não justifica sua existência.**

Nota de rigor: o cabeçalho da Parte 1.5 diz *"4 instâncias, 4 tamanhos diferentes"* e a tabela logo
abaixo lista 24, 32, 24, 28 — três tamanhos. O documento se contradiz na altura de uma tabela.
Princípio 8: nada deve ser arbitrário. Um cabeçalho que a própria tabela desmente é arbitrário.

---

### Alvo 2 — 2,1 MB de fotografia de banco de imagem · **NÃO SUSTENTA**

**Princípio 6 (honesto — não faz o produto parecer mais do que é), Princípio 9 (ambientalmente
responsável) e Princípio 10.**

Este é o achado mais grave dos dois documentos, e ele não é uma questão de gosto. É aritmética.

A referência que o founder mandou copiar preenche o slot da §diferenciais com **três AVIF que somam
11,3 KB**. A proposta preenche o mesmo slot com três fotografias que somam **578 KB** (só as versões
1920) ou **741 KB** (as duas larguras). É **51× a 65× a massa da referência, no mesmo slot, num
documento cuja tese é fidelidade à referência.**

A referência inteira — fontes, ícones, logos de cliente, tudo — pesa **256 KB**. A proposta adiciona
**2,1 MB** de fotografia. Oito vezes o site que ela diz imitar.

**De onde veio esse número.** Não veio de uma função. Veio de uma cota. `WORKFLOW-SITES.md` F3:
*"`03-assets/` pesa ≥1,5 MB. A mediana dos premiados é 6 MB."* E `RETOMAR-AQUI.md` §"Três coisas
honestas" já tinha registrado o veredito correto:

> *"Gate F3 NÃO passa. O leanware inteiro pesa 1,03 MB... Seguir a referência e cumprir o gate são
> coisas incompatíveis. Escolha declarada."*

Aquilo era honesto. A `DIRECAO-ARTE` reverte e declara **F3 ✅ 2,2 MB medidos**. O gate não foi
satisfeito por uma necessidade do produto; foi satisfeito por compra de peso. **Um critério medido
em bytes foi atendido com bytes.** É o exemplo de manual de otimizar a métrica em vez da coisa. E
o resultado é atenção do usuário desperdiçada em transferência que não carrega informação — que
é exatamente o desperdício de que trata o princípio 9.

**Três detalhes que fecham o caso, todos do próprio documento:**

1. `textura-metal-1920.webp` pesa **878 KB** e a Parte 4 §1 o especifica a `opacity: .06` sob uma
   máscara que some em 70%. Quase um megabyte para um elemento cujo próprio spec exige que seja
   quase imperceptível. Elemento especificado para não ser visto é elemento que pode ser removido.
2. `placa-metal` mede `h182` — ciano. O handoff 6.1 exige: *"🔴 `placa-metal` **precisa** ser
   rotacionada de `h182` para o quente."* **Se a fotografia tem que ser falsificada em cor para
   pertencer ao sistema, ela não pertence.** Uma foto rotacionada 146° de matiz deixou de ser
   registro e virou textura — e textura, o CSS faz a 0 KB.
3. `fabrica` (270 KB nas duas larguras) é declarado **"reserva"**. Não tem destino. Está no disco
   para pesar.

**E o ponto de honestidade funcional, que é o que o alvo perguntou.** O slot da referência continha
*diagramas que explicavam o diferencial*. A proposta troca por fotografia de forja em três cartões
cujos títulos são **"escopo fechado antes"**, **"construção"**, **"entrega e manutenção"**. Uma
chapa de metal não diz nada sobre escopo fechado. A troca é: ilustração que informa → atmosfera que
não informa. A direção do movimento está errada.

A defesa do documento é *"a fotografia é metáfora de marca, nunca alegação. Nenhuma legenda, nenhum
`alt`... pode sugerir que é a oficina do founder."* A defesa protege a **palavra** e deixa a
**imagem** solta. `alt` não é lido por visitante que enxerga. Numa página de serviço, uma
fotografia de trabalho manual no slot onde o concorrente põe o trabalho dele **é** a alegação,
independentemente do que diz o atributo. Isso é o princípio 6 na definição literal: o produto
aparentando ser mais do que é. Uma pessoa que escreve software não trabalha numa forja.

**O que sobrevive.** A medição do `ferreiro` (`h39 s21% l13%`, 3° do bronze, mediana de L igual ao
fundo) é uma descoberta real e a etimologia — Τάλως, o autômato de bronze de Hefesto — não é
inventada. Metáfora material é legítima. Mas metáfora usada uma vez é declaração; usada seis vezes,
em duas larguras, é papel de parede. **Uma fotografia, uma vez, em força total — ou nenhuma.**

---

### Alvo 3 — fill contra contorno no botão primário · **SUSTENTA o fill. Não sustenta a justificativa.**

**Princípio 4 (compreensível — esclarece a estrutura) e Princípio 6.**

O fill está certo. O teste de honestidade funcional, verificação 4: *a hierarquia visual precisa
corresponder à hierarquia funcional*. Existe uma ação primária na dobra. Ela tem 1,0 s de orçamento
(`ARQUITETURA-SECOES` §6.1, objeto 4). Contorno é o sinal de ação secundária. Vestir a ação primária
de secundária é subinformar o usuário sobre a estrutura da página. A medição confirma que não custa
legibilidade: `--on-bronze` sobre `--bronze` = 8,74:1, e em hover **7,51:1, mantendo AAA onde o
próprio leanware cai para 6,90:1**. Bom trabalho. Uma linha, e sigo.

A regra anterior — *"bronze nunca em fill, é crédito editorial"* (`RETOMAR-AQUI.md` linhas 233-234,
herdada de Mesh/ORYZO) — era gosto vestido de princípio. Ela deve ser revogada por escrito, não
apenas contornada.

**O que não sustenta é a justificativa e a contrapartida.**

A justificativa da Parte 1.3 tem duas metades: *"porque é a referência que o founder escolheu"* e
*"porque o botão é o objeto nº 4 do orçamento de 10 segundos: contorno não carrega esse peso."*
A primeira metade não é uma razão — é uma autoridade. A segunda é a razão inteira. Deletar a
primeira torna o documento mais forte, não mais fraco.

**A contrapartida é falsa.** Linha 375: *"fora do botão primário e da §12, bronze é traço,
sublinhado e filete — **nunca campo**. A Parte 4 respeita isso seção a seção."* A Parte 4 não
respeita. Seis campos de bronze, todos no mesmo documento:

| onde | elemento | o que é |
|---|---|---|
| §2 | ponto da marca com `box-shadow: 0 0 0 4px var(--bronze-soft)` | campo |
| §5 | etapa "automatizável", `fundo --bronze-wash` | campo |
| §8 | caixa de ícone 64×64, `fundo --bronze-soft` | campo |
| §9 | coluna "Talos", `background: var(--bronze-wash)` | campo |
| §9 | marca "sim", `fundo --bronze-soft` | campo |
| §10 | ponto pulsante, `box-shadow: 0 0 0 3px var(--bronze-soft)` | campo |

Princípio 8: **nada deve ser arbitrário.** Uma regra declarada na linha 375 e quebrada seis vezes
entre as linhas 844 e 1043 não é uma regra — é uma frase. Ou a regra vale e os seis campos saem, ou
a regra sai do documento. Eu recomendo o segundo: os campos de 5% e 10% estão medidos e passam
(8,25:1 e 6,72:1). O que precisa desaparecer é a alegação de que eles não existem.

---

### Alvo 4 — o site é um fork declarado · **SUSTENTA, mas a fronteira está desenhada no lugar errado.**

**Princípio 1 (inovador — não copia formas existentes, encontra soluções novas).**

Não, isso não condena o projeto. Eu trabalhei a vida inteira dentro de um vocabulário compartilhado
— Ulm, Gugelot, a grade. O SK4 não era formalmente inédito. O princípio 1 nunca proibiu usar uma
solução construtiva já resolvida; proibiu **copiar a expressão que identifica outro fabricante**.

**A fronteira defensável é essa:**

- **Herdar é legítimo quando o item é um problema construtivo resolvido.** Botão de 48px com raio
  10. Filete de 1px como fronteira de seção — a Parte 1.3 mediu que a alternância de fundo é 1,04:1
  e portanto invisível, o que faz do filete o único portador real de estrutura; isso é uma
  descoberta de engenharia e reinventá-la seria ego, não inovação. Par sans/mono com o mono
  reservado a rótulo de máquina. `scroll-mt-24` de 96px sob nav fixo. `prefers-reduced-motion` em 5
  blocos. A curva `cubic-bezier(.16,1,.3,1)` como token único. Nada disso é a assinatura do
  leanware; é ofício público.

- **Herdar é cópia quando o item é a assinatura atmosférica.** Os quatro brilhos com a geometria
  verbatim (`ellipse 720×460 at 92% -8%`, `ellipse 1200×360 at 50% 0%`). Os campos de pontos
  multiplicados. O ponto pulsante. A faixa de marquee. A faixa de três células com número de 44px.
  Esses não resolvem problema nenhum — **são o jeito daquele site parecer aquele site.**

A Parte 3.7 desenha a fronteira em *"arquitetura sim, tinta não"* e depois herda os nove gestos,
sendo que pelo menos cinco deles são atmosfera, não arquitetura. **Trocar o matiz e manter a
assinatura é a definição de cópia com disfarce.** O princípio 1 não é satisfeito por um seletor de
cor no canto do mockup.

A ironia é que a fronteira correta produz exatamente o mesmo corte que os alvos 1 e 5 já pediam.
Corte a atmosfera, fique com a construção, e o site deixa de ser um fork e passa a ser um trabalho
que usa ofício conhecido. Não custa nada além de disciplina.

E há um ativo que resolve o princípio 1 sozinho, e que os dois documentos já identificaram sem
perceber que era a resposta: **o painel do `mapear.ts` que roda em 2 ms.** A referência tem ali um
`role="img"` com respostas hard-codadas e um indicador de "pensando" falso. Uma forma nova aparece
quando você mostra uma coisa que o outro não podia mostrar. Essa é a única inovação disponível
neste projeto, e ela é gratuita.

---

### Alvo 5 — a seção de prova vazia · **SUSTENTA no conteúdo. NÃO SUSTENTA no peso.**

**Princípio 6 (honesto) e Princípio 5 (discreto).**

A substituição é correta. Verbo não é prova social. Compromisso contratual é falseável agora.
Demonstração ao vivo com o dado do próprio visitante é a coisa mais honesta que uma página de
serviço pode conter — e as quatro regras do `mapear.ts` (sem delay artificial, sem spinner, etapa
não reconhecida vale zero, a premissa fica escrita ao lado do número) são um trabalho honesto e
raro. Isso sustenta. E *"Sem case ainda. E eu não vou inventar um."* é a melhor frase dos dois
documentos.

**O que não sustenta é uma única regra, e ela contamina a página inteira.**

`DIRECAO-ARTE` Parte 5, item 7 · `ARQUITETURA-SECOES` §6.2:

> *"nenhuma dessas substituições pode ser mais tímida que o que substitui. Faixa de compromissos
> com peso menor que a faixa Clutch lê como ausência."*
> *"o que a arte fixa é: mesmo peso visual do selo que ela substitui, nunca menos."*

Isso dimensiona o substituto pela **forma do que está ausente**, não pelo que ele próprio contém.
É a definição operacional de encenação. Se três compromissos valem três linhas, eles recebem três
linhas. Inflá-los até o peso de um selo de 24 avaliações é fazer o produto parecer mais do que é —
princípio 6, ao pé da letra.

**E a regra já produziu dois elementos desonestos, ambos verificados no markup da referência:**

1. **§10, ponto pulsante de 6px.** No leanware, `trust-strip__caption-dot` pulsa ao lado de
   `5.0/5`, `24 verified reviews`, `GMT-5` — sinal de *ao vivo, verificado agora*. Na proposta ele
   pulsa ao lado de compromissos contratuais. **Nada ali está acontecendo agora.** Um pulso é a
   afirmação visual de liveness. Verificação 3 do teste de honestidade funcional: *existe elemento
   fingindo ser o que não é?* Sim, este.

2. **§13, `FLORIANÓPOLIS · GMT-3` com ponto pulsante bronze.** Verifiquei o markup de origem
   (`page.html` @240253): o slot idêntico do leanware carrega
   **`EST. 2020 · BOGOTÁ · GMT-5`** — idade da empresa, escritório, fuso alinhado ao cliente. É um
   selo de operação estabelecida. Uma pessoa em Florianópolis herdando esse slot está emitindo o
   mesmo sinal com um dado a menos. E `ARQUITETURA-SECOES` §4.1 **proíbe explicitamente** *"desde
   20XX"* e *"selo genérico"*. Os dois documentos se contradizem: um proíbe o sinal, o outro
   importa o objeto que o carrega.

3. **A "linha de honestidade" da dobra.** O conteúdo é honesto (*roda no seu navegador · sem
   cadastro · resultado em 2 ms* — falseável em 5 segundos de rolagem). A forma é um selo: três
   micro-etiquetas em mono caixa alta com filete bronze, dimensionadas para igualar `★★★★★ 5/5
   VERIFIED ON CLUTCH`. **Conteúdo honesto vestido de credencial.** Escreva como frase, no peso de
   uma frase. Uma afirmação verificável não precisa da roupa de um selo — e usar a roupa admite que
   a roupa é que convence.

**A correção é uma linha:** apague a regra do peso equivalente. Deixe cada substituição ter o
tamanho do que ela diz. Uma página que não tenta preencher o buraco no formato do buraco é a única
que lê como posição em vez de ausência.

---

## O QUE CORTAR

Método da subtração. Para cada item: o que acontece se eu remover? Se a resposta é "nada de
importante", sai.

### Camadas de fundo — de 12 para 2

| # | arquivo · elemento | ação |
|---|---|---|
| 1 | `DIRECAO-ARTE.md` Parte 4, tabela de ritmo, slots **4, 5, 8** — `dots 32px` | **cortar as três.** Malha de ponto sobrevive **só no hero**, 24px, acromática. Ela lê como medida e o hero é o único lugar onde a página precisa parecer instrumento à primeira vista |
| 2 | Parte 4, slots **1, 10, 13** — `brilho` | **cortar os três.** Sobra **um** brilho, na **§12 Contato**, `at 50% 50%`: é a única instância que faz trabalho que nenhum outro elemento faz — centrar a atenção no fecho |
| 3 | Parte 1.5, *"Isto o Talos herda inteiro"* (4 brilhos) | reescrever para **um** |
| 4 | Parte 4 §1, camada 1 — `fotos/textura-metal-1920.webp` a `opacity .06` | **cortar.** 878 KB para um elemento cujo spec exige que seja imperceptível |
| 5 | Parte 4 §13, camada opcional — `fotos/oficina-960.webp` a `opacity .04` | **cortar.** O próprio adjetivo "opcional" já é o veredito |

Resultado: **12 camadas de fundo → 2.** Uma malha, um brilho.

### Fotografia — de 12 arquivos para 1 (ou 0)

| # | arquivo · elemento | ação |
|---|---|---|
| 6 | Parte 4 §6, mídia 3:2 do passo 1 — `placa-metal` | **cortar.** Precisa de rotação de 146° de matiz para pertencer. O que tem que ser falsificado para caber, não cabe |
| 7 | Parte 4 §6, mídia 3:2 dos passos 1, 2 e 3 | **cortar a fileira inteira.** O slot da referência tinha diagrama que explicava o diferencial; fotografia de forja não explica escopo fechado. Se algo vai ali, é o artefato de cada etapa — o documento de escopo, o trace |
| 8 | `03-assets/fotos/` — `fabrica-*.webp` (270 KB) | **deletar do disco.** Sem destino em nenhuma seção. Está lá para pesar |
| 9 | `03-assets/fotos/` — as 4 restantes não alocadas | **deletar.** Sobrevive **`ferreiro`**, uma vez, em força total, se e somente se o founder responder a pergunta do fim deste documento com "atmosfera" |
| 10 | `WORKFLOW-SITES.md` F3, gate `≥1,5 MB` | **revogar como critério.** A referência escolhida pelo founder pesa **83 KB de imagem** e funciona. Um gate que reprova a referência é um gate calibrado no material errado. Substituir por: *todo asset tem seção, função declarada e nenhum é especificado abaixo de 15% de opacidade* |

### Elementos desonestos

| # | arquivo · elemento | ação |
|---|---|---|
| 11 | Parte 4 §10 — `ponto pulsante 6px, animation: lw-pulse 2s` | **cortar.** Pulso = ao vivo. Compromisso contratual não é um evento |
| 12 | Parte 4 §13 — carimbo `FLORIANÓPOLIS · GMT-3` + ponto pulsante bronze | **cortar o carimbo e o ponto.** Slot de origem carrega `EST. 2020 · BOGOTÁ · GMT-5`; `ARQUITETURA-SECOES` §4.1 proíbe esse sinal |
| 13 | Parte 4 §1, objeto 5 — "linha de honestidade" como micro-selos | **cortar a forma de selo.** Conteúdo fica, na voz e no peso do subhead |
| 14 | `DIRECAO-ARTE` Parte 5 item 7 + `ARQUITETURA-SECOES` §6.2 — *"nunca mais tímida que o que substitui"* | **cortar a regra.** É a linha que converte substituição honesta em encenação |
| 15 | `ARQUITETURA-SECOES` §2.1 slot 2 + §5.1 — `Marquee.tsx` | **cortar a seção.** O próprio doc registra o plano B (*"cortar a posição 2 e ir direto ao §3"*) e admite que o componente é `aria-hidden` decorativo. Dez verbos leem melhor parados. Movimento infinito que não carrega informação nova depois da primeira passagem é o "performer" onde se pedia o "butler" |

### Arbitrariedades (Princípio 8)

| # | arquivo · elemento | ação |
|---|---|---|
| 16 | Parte 1.3 + Parte 4 §8 — caixa de ícone com `border-radius: 14px`, exceção aos 4 raios | **subir para `--r-card` 16px.** O próprio documento declara o custo: *"diferença de 2px, custo zero"*. Consistência de graça que não é comprada é escolha errada |
| 17 | Parte 1.3, linha 375 — *"fora do botão primário e da §12, bronze é traço... nunca campo"* | **cortar a frase.** É desmentida seis vezes pela Parte 4. Os campos ficam; a alegação falsa sai |
| 18 | Parte 1.2, `cv05`+`cv08` marcados `OPCIONAL — é decisão de gosto` (D-C) | **decidir e fechar.** Documento que abre com *"nenhum valor aqui foi escolhido por gosto"* não pode entregar um interruptor de gosto. Ligar: a página tem `R$`, horas e rótulos de máquina; desambiguar `l`/`I` é função |
| 19 | Parte 1.2, linha 260 — *"[a restrição da dobra] derruba o teto de 112px"* | **corrigir o argumento.** `ARQUITETURA-SECOES` §6.3 nº3 diz literalmente *"112px resolve em 3 linhas com o topo do card aparecendo"*. A restrição é satisfeita pelos dois valores; ela não decide nada. 62px vem da referência — diga isso e pare. **Raciocínio decorativo é ornamento em prosa** |
| 20 | Parte 1.5, cabeçalho *"4 instâncias, 4 tamanhos diferentes"* | **corrigir para 3.** A tabela abaixo lista 24, 32, 24, 28 |
| 21 | `ARQUITETURA-SECOES` §6.3 nº7 — `--ink-3` medido em `3,78:1` | **corrigir para 3,96:1.** Recalculei. A `DIRECAO-ARTE` está certa; a régua de UX carrega o número velho, herdado de `RETOMAR-AQUI.md` |

### Buraco, não corte

| # | arquivo · elemento | ação |
|---|---|---|
| 22 | `DIRECAO-ARTE` Parte 2 — **37 pares, todos contra superfície chapada** | **medir o par que falta.** `ARQUITETURA-SECOES` §6.3 nº7 exige: *"contraste do H1 sobre o pior frame da cena precisa ser medido, não estimado"*. Não está na tabela. E a Parte 4 §1, que repete cinco das oito restrições duras, **omite justamente essa** — a única das oito que é responsabilidade da direção de arte. O gate **F2 está declarado ✅ com a medição decisiva ausente.** Ou mede, ou o gate volta para amarelo |

---

## ONDE EU ESTOU ERRADO

Sem isso, o resto acima é postura.

**1. Meu critério não distingue "contido" de "inacabado", e o mercado não dá o benefício da dúvida
a um desconhecido.** Eu passei a carreira desenhando para uma empresa com 34 anos de reputação, em
produtos que a pessoa segurava na mão antes de pagar. Este é um homem sem case, sem logo, sem
avaliação, que **já rejeitou três builds por parecerem genéricos**. Cada corte que eu listei empurra
a página na direção exata do que ele rejeitou. Eu tenho um princípio; ele tem uma quarta rodada e
talvez não haja quinta. Se eu estiver errado, o custo é dele, não meu — e eu devo dizer isso em voz
alta em vez de me esconder atrás de dez teses.

**2. O brilho tem uma defesa funcional que eu quase ignorei, e ela é a minha própria.** Eu aprovo
`font-optical-sizing` porque corrige percepção. Um campo escuro uniforme de ~10.000px de altura
faz banding e lê como vazio em painel barato. Um gradiente radial de 4% de alfa é correção de campo
pela mesma lógica. Eu não posso aceitar a correção óptica na tipografia e chamar a correção de
campo de ornamento. **Concedo uma instância — e é por isso que mantive uma, não zero.** Quatro
continuam sendo indefensáveis, mas o argumento deles não era vazio e eu quase o tratei como se
fosse.

**3. Sobre o fill, eu estava errado e a régua anterior do projeto era minha espécie de erro.**
*"Bronze é crédito editorial, nunca fill"* é gosto vestido de princípio — exatamente a acusação que
eu faço nos outros. A medição derrubou a regra. Registro sem hedging.

**4. A fotografia pode estar fazendo um trabalho que meu critério é cego para ver.** O comprador é
dono de metalúrgica em Santa Catarina — o próprio `ARQUITETURA-SECOES` §5.1 argumenta que logo de
ferramenta *"sinaliza isso é coisa de TI, o oposto do posicionamento"*. Uma página de tipografia
pura sobre preto **é** a linguagem visual de ferramenta de desenvolvedor. É possível que a forja
esteja fazendo reconhecimento de público, e reconhecimento em 10 segundos pode valer mais que
pureza. Isso é território do Norman, não meu: eu garanto pureza visual, ele garante clareza
cognitiva. Se ele discordar de mim no alvo 2, ouçam ele.

**5. Meu método é subtração e ele tem um modo de falha conhecido.** *Minimalismo entediante é
minimalismo preguiçoso.* Quando eu tiro dez camadas, o que sobra precisa ser excelente — a
tipografia precisa ser exata, o espaçamento intencional, a grade precisa criar ritmo e não apenas
organizar. Se este time não conseguir esse nível de acabamento, meus cortes produzem uma página
mais pobre que a versão com brilho. **A subtração só é segura para quem vai refinar o que fica.**
Isso não é uma opinião sobre design — é uma condição, e ela leva à única pergunta abaixo.

---

## A PERGUNTA — só o founder responde

> **Você vai revisar este site seção por seção, até o último detalhe de espaçamento e alinhamento,
> antes de publicar — ou vai publicar quando estiver "bom o suficiente"?**

Não é retórica. É a variável que decide os 22 cortes.

- **Se a resposta for "vou refinar até o fim":** corte tudo. As doze camadas de fundo viram duas, as
  seis fotos viram uma ou nenhuma, o marquee sai, os pontos pulsantes saem. O que fica tem que ser
  impecável, e você tem que estar disposto a olhar cada seção mais três vezes do que quer. Essa
  página envelhece dez anos sem parecer datada — princípio 7.

- **Se a resposta for "publico quando estiver bom":** **mantenha o brilho e mantenha uma
  fotografia.** Textura perdoa acabamento mediano; tipografia nua não perdoa nada. Nesse caso os
  cortes 11, 12, 13, 14 e 15 continuam obrigatórios — são honestidade, não estética, e honestidade
  não é negociável em nenhum dos dois cenários — mas os cortes 1 a 9 podem esperar.

Ninguém além de você sabe qual das duas é verdade. E responder errado é mais caro que não
responder: pedir a página contida e entregá-la com acabamento médio produz exatamente o "genérico"
que você rejeitou três vezes.

---

*Nada aqui é sobre gosto. Cada corte responde a uma pergunta: este elemento justifica sua
existência? Doze camadas de fundo, seis fotografias e dois pontos pulsantes não justificaram. O
motor que roda em 2 ms justificou sozinho a página inteira, e é a única coisa deste projeto que o
site que você mandou copiar não consegue fazer.*

— Dieter Rams, less but better
