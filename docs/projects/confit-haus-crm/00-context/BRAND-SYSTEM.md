# BRAND SYSTEM — Confit Haus (aplicado ao dashboard/CRM)

> Extraído do "Manual de Marca_Confit Haus" v01 (fev/2026). Fonte da verdade visual.

## Essência

Marca artesanal de geleias e molhos. Acolhedora, cuidadosa, verdadeira, afetiva, simples.
Tagline: **"Sabores que criam memórias."** Pilares: Cuidado em cada detalhe · Sabor verdadeiro · União à mesa.

## Logo

Logotipo **tipográfico (wordmark)** — só o nome, sem ícone. Variação **monograma** (selos/etiquetas).
Não esticar, comprimir, alterar cor (exceto institucionais), gradiente ou dropshadow. Área de
segurança = altura/largura do "C". Redução mínima em tela: 100px (assinatura completa) / 60px (reduzida).

## Paleta institucional

| Cor | HEX | Pantone | Função (manual) | Uso no dashboard |
|---|---|---|---|---|
| Verde (alma) | `#3A5643` | 7724 U | artesanal, casa, origem, feito à mão | cor-marca / identidade, estados de sucesso, headers de marca |
| Verde escuro | `#324C3A` | 7727 U | profundidade | hover/dark do verde |
| Azul (institucional) | `#3C7496` | 2190 U | confiança, organização, leitura | **UI base**: sidebar, navegação, dados, botões primários |
| Azul escuro | `#2F6A97` | 2191 U | solidez | hover/active do azul |
| Amarelo (acento) | `#EFCB83` | 609 U | destaque, sabor, calor — **acento, não base** | CTAs de atenção, badges, highlights, gráficos |
| Amarelo alt | `#EDC277` | — | — | variação |
| Off-white | `#EDE4D9` | — | respiro, sofisticação | **background** principal |
| Warm Gray | `#DDD6CA` | Warm Gray 1 U | neutro | bordas, cards, surfaces |
| Branco | `#FFFFFF` | — | — | cards/superfícies |
| Preto | `#000000` | — | — | texto forte |

**Regra de ouro do manual:** azul = institucional/dados (PERFEITO pra um dashboard), verde =
acolhimento/marca, amarelo = só acento (nunca base), off-white = respiro/foco no conteúdo.

## Tipografia (web — todas no Google Fonts)

- **Títulos/Subtítulos:** `Newsreader` (serif, 150% altura). Pesos: Medium/Semibold/Bold/ExtraBold/Black.
- **Corpo / UI / destaques:** `Inter Tight`. Pesos: ExtraLight→Bold.
- (Fontes de rótulo de produto — Desire Pro, New Order, Miniver — são pra embalagem, **não** pra UI.)

## Elemento gráfico

**Toldo listrado** (fachada de comércio tradicional) → padrões geométricos de listras tom-sobre-tom.
Usar com parcimônia no dashboard (ex: faixa de header, empty states), sem competir com os dados.

## Tom de voz (pro bot/copilot e mensagens automáticas)

Calor humano (proximidade e gentileza) · Essencial e verdadeiro (palavras simples, sem
artificialidade) · Memória e presença (linguagem que celebra a mesa, o encontro). O copilot
do bot deve rascunhar respostas NESSE tom.

## Tokens (sugestão semântica pro Tailwind/CSS)

```
--bg:        #EDE4D9   /* off-white, respiro */
--surface:   #FFFFFF
--border:    #DDD6CA
--primary:   #3C7496   /* azul institucional — UI */
--primary-hover: #2F6A97
--brand:     #3A5643   /* verde — alma da marca */
--brand-dark:#324C3A
--accent:    #EFCB83   /* amarelo — destaque/CTA atenção */
--text:      #1A1A1A
--success:   #3A5643
font-display: 'Newsreader', serif;
font-sans:   'Inter Tight', sans-serif;
```
