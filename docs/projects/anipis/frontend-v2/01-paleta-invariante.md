# Paleta Invariante — o único legado do design atual

> Mandato: "quero apenas as cores usadas". Esta é a lista exata do que sobrevive.
> Fonte: `apps/web/src/styles/design-tokens.css` (tema claro canônico + variantes).
> Todos os pares já validados WCAG (30/30, lint:contrast no CI do repo).

## Tema claro (canônico)

| Token | Hex | Papel | Contraste |
|---|---|---|---|
| `--surface-canvas` | `#f7f4ed` | fundo página (creme quente) | — |
| `--surface-recess` | `#efeae0` | superfícies rebaixadas (inputs) | — |
| `--surface-raised` | `#ffffff` | cartões elevados | — |
| `--text-primary` | `#1a1814` | texto principal (tinta) | 16.1:1 AAA |
| `--text-secondary` | `#3d3a35` | texto secundário | 10.3:1 AAA |
| `--text-quote` | `#2f5235` | citações/destaques (verde floresta) | 8.0:1 AAA |
| `--text-muted` | `#67635b` | metadados | 5.4:1 AA |
| `--border-subtle` | `#e8e2d4` | bordas finas | — |
| `--border-strong` | `#1a1814` | bordas fortes | — |
| `--border-focus` | `#2f5235` | focus ring | — |
| `--accent-spot` | `#2f5235` | **verde floresta — cor da marca** | 8.0:1 AAA |
| `--intent-affirm` | `#2f5235` | afirmação | AAA |
| `--intent-warn` | `#8a5a2b` | cautela (casca quente) | 5.3:1 AA |
| `--intent-crisis` | `#8f2c1b` | crise (tijolo profundo, NÃO vermelho-pânico) | 7.5:1 AAA |
| `--emotion-alegria` | `#f4d9c2` | humor: alegria (pêssego) | fills claros |
| `--emotion-calma` | `#cfe0e8` | humor: calma (azul pálido) | fills claros |
| `--emotion-tristeza` | `#e0dde8` | humor: tristeza (lilás suave) | fills claros |
| `--emotion-ansiedade` | `#d7e4d0` | humor: ansiedade (sálvia) | fills claros |

## Tema escuro (noite-floresta)

canvas `#0c110d` · recess `#070b08` · raised `#18211a` · text `#e8eee6`/`#b9c4bb`/`#8a958c` · quote `#cde0c8` · accent/focus `#c9dec1` (sálvia luminosa) · affirm `#8fb89a` · warn `#d6a86a` · crisis `#e08a6f` · borders `#243029`/`#e8eee6`.

## Regras de uso herdadas (continuam valendo)

- Crise usa tijolo `#8f2c1b` (claro) / `#e08a6f` (escuro) — nunca vermelho saturado.
- Emotions são fills CLAROS: texto sobre eles é sempre tinta, nunca creme.
- Verde floresta é AÇÃO e MARCA; não usar como fundo de grandes áreas no tema claro.

Tudo o mais — tipografia, espaçamento, radius, sombras, motion, componentes — **é página em branco** para o v2.
