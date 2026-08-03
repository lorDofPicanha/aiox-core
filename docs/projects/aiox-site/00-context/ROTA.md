# F0 · Rota escolhida

**Data:** 2026-07-27 · **Gate:** `node tools/gate.cjs f0`

## Decisão: **Rota A — WebGL autoral, escopo reduzido**

### Por quê (dados de `02-references/PROCESSO-NIVEL-PREMIADO.md`)

| | Rota A | Rota B |
|---|---|---|
| peso típico | **1,8 – 6 MB** | 16 – 28 MB |
| origem do visual | **gerado** (shader/3D) | fotografado e filmado |
| exige contratar | não | fotógrafo, filmagem, tratamento |
| exemplos | IZANAMI 2,6 MB · MONOLOG 1,8 MB · Oryzo 6 MB | Floema 27,9 · Son Daven 23,2 |

A Rota A não depende de produção fotográfica que hoje não existe, e IZANAMI e MONOLOG provam que
dá para chegar ao nível de premiação com 1,8–2,6 MB e ~200 linhas de shader.

Há também um argumento de coerência: um site que vende **automação** e **gera** o próprio visual em
vez de fotografá-lo é a oferta demonstrada em forma de site.

### O que mudou desde a recomendação original

Quando recomendei a Rota A, escrevi que ela exigia "aprender GLSL — a única parte sem atalho".
**Isso está desatualizado.** A pesquisa de ferramentas encontrou:

- **Unicorn Studio** — WebGL e shader em ferramenta visual, exporta para web, zero código
- **TSL** (Three Shading Language) — shader escrito em JavaScript, compila para WGSL e GLSL
- **Spline** — cena 3D interativa sem código
- **Meshy 6 / Tripo / Rodin** — geração de malha 3D por IA

A barreira de shader deixou de ser código e virou ferramenta visual.

### Escopo declarado

- **1 cena WebGL** no hero, autoral, com shader próprio (via Unicorn Studio ou TSL)
- **sem** filmagem, sem ensaio fotográfico, sem sound design
- fotografia de apoio: **Unsplash** (testado e funcionando, com atribuição)
- alvo de peso: **2 – 4 MB**

### ⚠️ Aval assumido, reversível

O founder respondeu *"faça isso"* logo depois de eu recomendar a Rota A com escopo reduzido.
**Tomei como aval da recomendação.** Se a leitura foi outra, esta é a decisão a reverter primeiro —
ela define todas as fases seguintes e nada foi construído em cima dela ainda.

### Fica de fora (registrado para não voltar como surpresa)

Rota B continua disponível e é a que produziu o site mais premiado da amostra (Son Daven, Site of
the Month, **em Webflow, sem uma linha de shader**). O custo dela migra de código para produção:
fotógrafo e agenda. Se em algum momento houver orçamento para isso, a troca de rota é legítima —
mas é troca de rota, não ajuste.
