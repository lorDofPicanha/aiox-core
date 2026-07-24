# DESIGN.md — Influenzza Cazza · Mesas de Luxo

> Sistema visual extraído do catálogo original (PDF "INFLUENZZA — Mesas de Luxo 2026")
> e do logotipo oficial. Fonte da verdade para qualquer material da marca.

---

## 1. Marca

- **Nome:** Influenzza Cazza (lockup de duas palavras que compartilham o monograma "ZZ")
- **Tagline:** MESAS DE LUXO
- **Desde:** 1988
- **Categoria:** mesas de bilhar/sinuca e pebolim de luxo, feitas sob medida (zero produção em série)
- **Posicionamento:** artesanal, atemporal, peça de arte funcional — "Não fabricamos mesas. Criamos o cenário onde as melhores memórias acontecem."
- **Linhas:** 01 Criativa (design contemporâneo) · 02 Original (tradição) · 03 Pebolim

## 2. Logotipo

- **Monograma:** "ZZ" estilizado (banda diagonal dupla, alto contraste) + **2 brilhos/sparkles** em losango. Serve às duas palavras simultaneamente.
- **Wordmark:** serif Didone caixa-alta, "INFLUENZZA" sobre "CAZZA", o ZZ central como ligadura compartilhada.
- **Uso:** branco sobre fundo escuro (preferido). Arquivos em `assets/` (originais) e `build/img/` (`wordmark.png`, `monogram.png` — arte branca, fundo transparente).
- **Não fazer:** não colocar o wordmark original (fundo preto) sobre creme; usar a versão transparente.

## 3. Paleta

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#090909` | Fundo escuro (capa, divisores, contracapa) |
| `--cream` | `#F5F2F0` | Fundo claro / papel (história, especificações, personalização) |
| `--accent` | `#CFA37D` | Âmbar/cobre — números de seção, labels, filetes, ícones |
| `--white` | `#FFFFFF` | Cartões e blocos de respiro sobre creme |
| `--text` | `#1A1A1A` | Texto sobre claro |
| `--text-soft` | `#5B5752` | Corpo de texto secundário sobre creme |
| `--line` | `rgba(0,0,0,.10)` | Divisórias finas |

Acento é **um só** (âmbar). Nunca usar mais de uma cor de destaque. Ouro/dourado puro proibido — o tom é cobre amadeirado.

## 4. Tipografia

| Papel | Fonte | Tratamento |
|---|---|---|
| Display / títulos de seção | **Cormorant Garamond** (serif, alto contraste) | Caixa-alta, tracking largo (`.18em`–`.3em`) |
| Nomes de produto / quote | **Playfair Display** | Peso 500–600, sem tracking |
| Números de seção (01/02/03) | **Cormorant Garamond** 300 | Grande, leve, em âmbar |
| Corpo, labels, specs | **Jost** (sans geométrico) | Labels caixa-alta `.28em` tracking em âmbar; corpo 300/400 |

Hierarquia de label recorrente: `LABEL ÂMBAR (tracking largo) → Título serif → corpo Jost claro → filete âmbar curto`.

## 5. Layout (print A4 retrato · 210×297mm)

- **Margem de segurança:** 18mm. Sangria (bleed) 0 nas fotos full-bleed (encostam na borda).
- **Página de produto:** foto full-bleed no topo (~58% da altura) + painel creme embaixo com label da linha, nome (Playfair), subtítulo, descrição e duas colunas `DIMENSÕES | MATERIAIS`.
- **Divisor de linha:** fundo `--ink`, número grande âmbar centralizado, título serif tracked, subtítulo, filete.
- **Full-bleed lifestyle:** foto ocupa a página inteira; legenda opcional fininha no rodapé.
- **Ritmo:** alternar páginas escuras (divisores/lifestyle) e claras (produto/história) — nunca duas iguais grudadas. **Zero páginas em branco.**
- **Numeração:** discreta no rodapé externo, Jost 300, `--text-soft`.

## 6. Tom de voz

Curto, sensorial, confiante. Frases de impacto. Materiais nobres citados pelo nome (Sucupira, Jequitibá, pedra ardósia, lã premium). Sempre reforçar **sob medida** e **artesanal**.

## 7. Catálogo de produtos (conteúdo canônico)

**Linha Criativa** — Curve (linhas fluidas), Nobus (refinamento sem concessões), Harley (atitude e precisão).
**Linha Original** — Gabe (madeira maciça), Monaco (mesa dual premium — jantar + sinuca).
**Pebolim** — o clássico reinventado, mesma excelência artesanal.
**Personalização** — Madeira (10+ opções), Tecido (lã premium), Dimensão (sob consulta), Acabamento (laca/verniz/natural/acetinado/brilhante).

> ⚠️ Mapeamento foto→modelo no rebuild é a melhor leitura do Orion a partir das specs;
> o cliente deve validar/trocar (é só renomear no `build/img/`).
