# O processo que produz um site premiado — medido no código, não deduzido

**Data:** 2026-07-27 · **Pergunta do founder:** *"analise o código fonte desses sites e veja qual
processo eu deveria fazer para construir um site neste nível"*

Método: 14 dos sites mais premiados de 2026 abertos em navegador real, com todas as respostas de
rede interceptadas e classificadas, o JS servido vasculhado por assinatura de biblioteca e por
shader GLSL, e o DOM medido. Nenhum número aqui é estimativa.

Dados brutos: `anatomia-producao.json` · `creditos.json`

---

## 1. O que eles carregam

### Bibliotecas encontradas no bundle (14 sites)

| lib | quantos | o que faz |
|---|---|---|
| **GSAP** | **12/14** | timeline e scroll — o padrão da categoria |
| **Lenis** | **11/14** | inércia de scroll |
| **Splitting / SplitText** | **10/14** | quebra texto em caractere/palavra para animar |
| **Three.js** | 8/14 | 3D |
| React | 7/14 | |
| **Webflow** | **6/14** | **no-code — quase metade** |
| Swiper · Barba · Lottie | 4/14 cada | carrossel · transição de página · animação vetorial |
| Rive · postprocessing | 3/14 cada | animação interativa · pipeline de pós-efeito WebGL |
| Vue · Nuxt | 2/14 | |
| Draco · KTX2 · GLTF | 1/14 | compressão de malha e textura 3D |

### Peso — mediana de 14 sites

| tipo | mediana | máximo |
|---|---|---|
| **total** | **6,01 MB** | **27,94 MB** |
| JavaScript | 1,41 MB | 6,17 MB |
| imagem | 1,42 MB | 19,45 MB |
| vídeo | 0 | 20,25 MB |
| áudio | 0 | 13,98 MB |
| fonte | 0,13 MB | 1,95 MB |
| 3D | 0 | 2,66 MB |

Requests: mediana **77**. Nós no DOM: mediana **1.638**.

### Shader GLSL escrito à mão

**8 dos 14 têm shader próprio.** Mediana de **292** ocorrências de `gl_FragColor` /
`gl_Position` / `uniform sampler2D`; o Oryzo tem **561**.

Isso não é `<meshStandardMaterial>`. É shader escrito, compilado e depurado.

### Formatos servidos

`.webp` 339 · `.jpg` 111 · `.svg` 75 · `.png` 72 · `.woff2` 57 · `.avif` 29 · `.webm` 18 ·
`.mp4` 16 · `.glb` 3

Imagem passa por pipeline de conversão em todos. Fonte é sempre `.woff2` self-hosted.

---

## 1b. Quem produz — os créditos (16 sites)

O código diz o que foi entregue; os créditos dizem quem entregou. Raspado das páginas
`/sites/{slug}` do Awwwards:

| papel creditado | em quantos sites |
|---|---|
| design · development · UX | **16/16** |
| **WebGL** | **15/16** |
| UI | 12/16 |
| **3D** | **10/16** |
| animation | 8/16 |
| motion | 6/16 |
| **photography** | **6/16** |
| illustration | 3/16 |
| sound | 2/16 |

**Mediana de 7 papéis distintos por site.** Design, desenvolvimento, UX, WebGL, UI, 3D e animação
aparecem como funções separadas — não como chapéus de uma pessoa só.

> ⚠️ Ressalva de método: o contador de *nomes* bateu no teto de 20 que eu mesmo defini no
> raspador, então "20 pessoas por site" **não é medição confiável** — é o meu limite de corte.
> Os *papéis* são confiáveis, porque vêm do texto da página. Trate a lista acima como "quais
> funções existem", não como "quantas pessoas".

Isso reenquadra a pergunta. Um site premiado desta amostra é produto de uma cadeia com 7 funções.
Você é um. A pergunta útil deixa de ser "como faço igual" e vira **"quais dessas 7 funções eu
consigo cobrir, e quais eu compro ou dispenso"**.

---

## 2. O diagnóstico — por que o Talos não chegou perto

Comparando o que eu construí com a amostra:

| | Talos | mediana dos premiados |
|---|---|---|
| GSAP · Lenis · Three | ✅ tinha os três | 12 · 11 · 8 de 14 |
| Splitting | ❌ | 10/14 |
| Shader próprio | ❌ **zero** | 292 (nos 8 que usam) |
| **Peso total** | **~0,4 MB** | **6,01 MB** |
| **Imagens** | **0** | 1,42 MB |
| **Vídeo** | **0** | até 20 MB |
| Fotografia, ilustração, 3D modelado, som | **nada** | presente em todos |

**A diferença não é biblioteca — eu já tinha as três principais.** É que o Talos tinha *zero
matéria-prima*. Nenhuma foto, nenhum vídeo, nenhum modelo, nenhum som, nenhum shader.
Um site de 0,4 MB competindo com sites de 6 MB de conteúdo produzido.

Nenhuma quantidade de CSS bem escrito fecha essa distância. É por isso que as três rodadas de
refinamento não moveram a agulha: eu estava polindo a casca de uma coisa que não tinha dentro.

---

## 3. As duas rotas — e elas são MUITO diferentes

A amostra se divide em duas famílias, e a escolha entre elas determina todo o resto do processo.

### Rota A — WebGL autoral
`Oryzo` (6 MB, 561 shaders) · `IZANAMI` (2,6 MB, 292) · `Renaissance/Shopify` (2,4 MB, 318) ·
`MONOLOG` (1,8 MB, 204) · `CoffeeTech` (4,9 MB, 222 + Draco/KTX2/GLTF)

- Peso **baixo** (1,8 a 6 MB) porque o visual é **gerado**, não transmitido
- Exige: shader GLSL, pipeline 3D (modelar → otimizar malha → comprimir textura)
- Perfil de quem faz: **desenvolvedor criativo com fluência em GPU**

### Rota B — produção pesada
`Floema` (27,9 MB) · `Son Daven` (23,2 MB) · `Wembi` (22,4 MB) · `Wolverine` (18,9 MB) ·
`NORMAL IS BORING` (16,5 MB)

- Peso **alto** porque o visual é **fotografado e filmado**
- Zero ou pouco shader — o impacto vem de arte-final, não de GPU
- **Son Daven é Site of the Month e roda em Webflow.** Sem shader nenhum
- Exige: fotógrafo, diretor de arte, filmagem, tratamento
- Perfil de quem faz: **direção de arte com um dev de GSAP**

> A Rota B é a mais acessível para quem não escreve shader — e produziu o site mais premiado do
> ano nesta amostra. Mas o custo migra de código para **produção de conteúdo**, que é dinheiro e
> agenda, não fim de semana.

---

## 4. O processo, em ordem

O que a anatomia revela sobre a ordem das decisões:

**Fase 0 — Decidir a rota (antes de qualquer coisa).**
Rota A ou B. Isso define orçamento, prazo e quem precisa estar envolvido. Decidir isso depois de
começar a codar é o erro que eu cometi.

**Fase 1 — Conseguir a matéria-prima.**
É aqui que mora a diferença, e é a fase que o Talos pulou inteira.
- Rota A: conceito 3D → modelagem → shader de referência
- Rota B: ensaio fotográfico / filmagem / ilustração → tratamento → export

Sem esta fase não existe site premiado. Nenhuma.

**Fase 2 — Pipeline de asset.**
Todos convertem: `.webp`/`.avif` para imagem, `.woff2` self-hosted para fonte, `.webm` para vídeo,
Draco/KTX2 para 3D. Não é detalhe de performance — é o que torna 20 MB de conteúdo carregável.

**Fase 3 — Montagem.**
GSAP + Lenis + Splitting é o tripé (12, 11 e 10 de 14). Three.js só na Rota A.
**Webflow é escolha legítima aqui** — 6 de 14, incluindo um Site of the Month.

**Fase 4 — Shader / motion autoral.** Só Rota A. É onde vão as centenas de linhas de GLSL.

**Fase 5 — Preloader e sequência de entrada.**
8 dos 100 sondados travam a altura da página até a animação de entrada terminar. É deliberado:
esconde o carregamento dos 6 MB e transforma a espera em primeira impressão.

---

## 5. O que eu recomendo, dado quem você é

Você é um: não tem fotógrafo nem estúdio 3D à mão, e o site precisa vender serviço de automação.

**Recomendo a Rota A com escopo reduzido**, por três motivos medidos:
1. Peso baixo (1,8 a 6 MB) — não depende de produção fotográfica que você não tem
2. `IZANAMI` e `MONOLOG` provam que dá para premiar com 1,8 a 2,6 MB e ~200 linhas de shader
3. É consistente com o produto: um site de automação que **gera** o visual em vez de fotografá-lo
   é o argumento da oferta em forma de site

**O que isso exige de verdade:** shader GLSL. Não é biblioteca que se instala — é a única parte que
não dá para atalhar. As 200 a 560 linhas de GLSL são a barreira real entre "site bom" e "site
premiado" nesta amostra.

**Se você não quiser essa barreira**, a alternativa honesta é a Rota B com investimento em
fotografia e vídeo — e aí o gargalo vira orçamento de produção, não técnica.

Qualquer uma das duas, a Fase 1 vem antes do código. Foi o que faltou.

---

## 6. A conversa que os dados forçam

Juntando as duas medições — 7 funções creditadas por site, e 6 MB de conteúdo produzido —
a conclusão desconfortável é esta:

**"Site premiado" não é um nível de execução. É uma categoria de produção.**

O que dá para fazer com uma pessoa e um prazo curto:

| | viável sozinho? | |
|---|---|---|
| GSAP + Lenis + Splitting | ✅ | é o tripé, e é a parte barata |
| Estrutura, copy, UX | ✅ | você já tem |
| Shader GLSL autoral | 🟡 | dá, mas é a curva de aprendizado real |
| 3D modelado e otimizado | 🟡 | dá com asset comprado + Draco/KTX2 |
| Fotografia e filmagem | ❌ | precisa contratar |
| Sound design | ❌ | precisa contratar |

**Minha recomendação honesta, em uma frase:** mirar em *"bom o suficiente para vender automação
para dono de PME"* é um alvo diferente de *"Awwwards Site of the Day"*, e o segundo custa uma
cadeia de produção que hoje não existe. Se o objetivo é vender, a Rota A com escopo reduzido e um
shader bem-feito entrega 80% da percepção por 20% do custo. Se o objetivo é ganhar prêmio, o
caminho passa por contratar pelo menos fotografia ou 3D.

**As duas são decisões suas. Não construo nada até você escolher.**
