# Os 100 sites mais premiados de 2026

**Data:** 2026-07-27 · **Pedido do founder:** *"joga este site no lixo, nada do que você fez
funcionou, vamos fazer o seguinte: pesquise os 100 sites mais premiados do ano primeiro."*

Fase 0 refeita do zero. Nenhuma linha de build antes de ver o campo inteiro.

---

## Método

**Fonte primária: Awwwards.** Raspagem direta das listas de premiação, não listicle de blog
([[feedback_no_hydra_style]]: pesquisa é fonte primária).

Cada card do Awwwards carrega um atributo `data-collectable-model-value` com JSON contendo título,
slug, timestamp e — o que nenhuma outra fonte dá — **as tags de tecnologia** (GSAP, Three.js,
WebGL, Next.js). Ou seja: "quantos usam Three.js" abaixo é **dado da fonte**, não estimativa minha.

- **806 cards** raspados em 4 listas (Site of the Day, Site of the Month, Developer Award,
  Honorable Mention), 16 páginas
- **395 sites únicos** após deduplicar por slug
- **237 de 2026**, todos com URL externa
- **100 selecionados** por peso de prêmio, não por data

> ⚠️ O primeiro corte pegou os 100 mais **recentes** e cobriu só 2 meses — deixava de fora os Site
> of the Month de janeiro a abril, que são justamente os mais premiados. Refeito ordenando por
> peso (Site of the Month > Developer Award > Site of the Day > Honorable Mention).
> **Os 100 finais cobrem 21/jan a 27/jul e todos têm mais de um prêmio.**

**Fontes que não deram:** FWA respondeu 500 nas duas listas, CSS Design Awards estourou o timeout,
Orpetron devolveu 1 link externo. Dá para insistir nelas depois; o Awwwards sozinho já entrega
volume e é a única com metadado de stack.

---

## O que os 100 usam — dado do Awwwards, não impressão

| tecnologia | quantos | % |
|---|---|---|
| **GSAP** | 51 | **51%** |
| **WebGL** | 39 | **39%** |
| **Three.js** | 27 | **27%** |
| Nuxt.js | 12 | 12% |
| Next.js | 11+2 | 13% |
| React | 7 | 7% |
| Astro | 5 | 5% |
| Vue.js | 3 | 3% |
| Framer | 2 | 2% |

**Metade dos sites mais premiados do ano usa GSAP. Mais de um terço usa WebGL.** Isso não é
tendência de nicho — é o piso da categoria.

### Temas mais frequentes

| tema | n |
|---|---|
| Animation | 55 |
| 3D | 36 |
| Web & Interactive | 33 |
| Business & Corporate | 28 |
| Storytelling | 27 |
| Design Agencies | 26 |
| Portfolio | 26 |
| Transitions | 25 |
| Clean | 24 |
| Scrolling | 20 |
| Microinteractions | 19 |
| Interaction Design | 19 |
| Experimental | 16 |
| Typography | 15 |
| E-Commerce | 13 |

**Animation (55) e 3D (36) lideram com folga.** "Clean" aparece em 24 — ou seja, minimalismo e
animação pesada não são opostos nessa amostra; convivem no mesmo site.

Nota de leitura: **Design Agencies (26) + Portfolio (26)** somam metade da amostra. Boa parte do que
ganha prêmio é estúdio mostrando o próprio trabalho — que é um problema mais fácil que vender
serviço para dono de PME. Vale ter isso em mente ao copiar.

---

## O topo — os 6 Site of the Month de 2026

Estes são os mais premiados do ano inteiro. Um por mês, escolhidos entre os ~30 Site of the Day
daquele mês.

| # | site | data | stack |
|---|---|---|---|
| 1 | [Son Daven](https://sondaven.com/en) | 05/jun | WebGL · GSAP |
| 2 | [Floema](https://www.floema.com/en) | 13/mai | WebGL · GSAP · Nuxt.js |
| 3 | [Oryzo AI](https://oryzo.ai/) | 13/abr | WebGL · GSAP · Three.js |
| 4 | [GQ & AP — The Extraordinary Lab](https://www.gq.com/sponsored/story/the-extraordinary-lab) | 26/mar | WebGL · Nuxt.js |
| 5 | [Shopify — The Renaissance Edition](https://www.shopify.com/editions/winter2026) | 09/fev | WebGL |
| 6 | [Bruno Simon](https://bruno-simon.com/) | 21/jan | WebGL · GSAP · Three.js |

Todos os seis usam WebGL. Cinco usam GSAP.

---

## O que os 100 são por dentro — medido, um por um

Os 100 foram visitados em navegador real: CSS medido, DOM contado, screenshot tirado.

### Forkabilidade

| veredito | n | o que significa |
|---|---|---|
| ✅ **forka** | **43** | CSS grande, DOM real — dá para estudar o código |
| 🟡 talvez | 29 | CSS entre 30 e 100 KB, testar caso a caso |
| ❌ js-driven | 15 | CSS minúsculo, layout posicionado por JS — colapsa fora do site |
| ⏳ preloader | 8 | altura travada; conteúdo só entra depois de uma animação de entrada |
| 💥 erro | 5 | não responderam à sondagem |

### Números visuais

| | valor |
|---|---|
| **fundo escuro** | **54 de 95 (57%)** |
| **usam `<canvas>`** | **59 de 100** |
| maior heading — mediana | **82px** |
| headings ≥ 100px | 35 de 84 (42%) |
| maior heading do conjunto | **504px** |
| altura de página — mediana | **12.807px** |

Três leituras que valem para qualquer coisa que a gente construir depois:

1. **Escuro é maioria, não regra.** 57% — quase metade dos premiados é claro. Dark não é o que
   ganha prêmio; é uma escolha entre duas.
2. **`<canvas>` em 59 de 100.** Somado a WebGL 39% e Three.js 27%, o padrão é claro: mais da
   metade dos sites premiados renderiza alguma coisa fora do fluxo do DOM.
3. **Página longa.** A mediana é de quase 13.000px. Não existe site premiado curto nesta amostra.

## Onde está tudo

| arquivo | o quê |
|---|---|
| `premiados-2026.json` | os 395 únicos raspados, com tags e datas |
| `premiados-2026-top100.json` | os 100 selecionados |
| `premiados-2026-tabela.md` | tabela legível dos 100 |
| `premiados-2026-sondados.json` | os 100 + medição de forkabilidade |
| `shots-premiados/*.jpg` | screenshot real de cada um, capturado agora |
| **`galeria.html`** | **folha de contato — abra esta** |

A galeria é uma página local com os 100 lado a lado: screenshot real (não o thumbnail curado do
Awwwards), prêmio, stack, medição, e filtro por tecnologia. Cem abas travariam o navegador e não
deixariam comparar nada; numa página só dá para varrer em minutos e abrir só o que interessar.
