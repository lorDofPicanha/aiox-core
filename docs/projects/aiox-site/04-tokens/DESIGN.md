# F2 · Sistema visual

**Data:** 2026-07-27 · **Gate:** `node tools/gate.cjs f2`
**Produzido com:** `ui-ux-pro-max` (estilo e indústria) + `mcp-design-studio` (paleta, contraste,
fontes). **Nenhum token inventado à mão** — cada valor abaixo saiu de ferramenta e teve o contraste
calculado, não estimado.

---

## 🔴 O achado que muda a direção

Rodei a `ui-ux-pro-max` para a indústria do público-alvo e para o estilo que eu tinha usado.
Os dois resultados se contradizem:

| | o que a skill diz |
|---|---|
| **Dark Premium** *(o que eu tinha construído)* | cores `#0F0F0F #1A1A1A #D4AF37` · **Best For: nightlife, luxury, tech, fashion** |
| **Manufacturing** *(o público real do Talos)* | CIP Style **Industrial Raw Bold** · cores `#374151 #F97316 #FFFFFF` · tipografia **"Strong bold condensed"** · mood "Strong reliable industrial" · **Avoid: delicate, decorative, impractical** |

O site que eu entreguei era **luxo de vida noturna** aplicado a um público de **metalúrgica e
moveleira**. O bronze `#e9a23b` sobre nogueira é a paleta de um bar de hotel, não de quem vende
automação para dono de fábrica. Isso a skill teria dito no primeiro dia — se eu a tivesse usado.

**Direção corrigida:** manter o escuro (57% dos premiados são escuros, e as 7 referências aprovadas
pelo founder são todas dark), trocar o acento de **bronze de luxo** por **laranja de sinalização
industrial**, e adotar tipografia **condensada e pesada** no lugar da geométrica neutra.

---

## Paleta

Base `#F97316` (Industrial Raw). Escala 50–950 gerada por `design-studio color_palette`.
Contraste medido por `design-studio contrast_check` — WCAG 2.1.

| token | hex | papel | contraste | nível |
|---|---|---|---|---|
| `--bg` | `#14110E` | fundo — carvão quente, nunca `#000` | — | — |
| `--surface` | `#1C1815` | superfície elevada | — | — |
| `--text` | `#EDE8E1` | texto principal | **15,44:1** sobre bg | **AAA** |
| `--text-2` | `#A9A29A` | texto secundário | **7,45:1** sobre bg | **AAA** |
| `--muted` | `#938B81` | label, borda, ícone | **5,25:1** sobre surface | AA *(AAA em ≥18px / bold ≥14px)* |
| `--sinal` | `#FA8F42` | acento — ação e ênfase | **8,13:1** sobre bg | **AAA** |
| `--sinal-forte` | `#F97316` | hover e estado ativo | 6,71:1 sobre bg | AA *(AAA em texto grande)* |

**Por que `#FA8F42` e não o `#F97316` puro:** o laranja base dá 6,71:1 — passa AA mas falha AAA em
texto normal. O tom 400 da mesma escala dá **8,13:1** e passa AAA sem mudar a leitura da cor.
O puro fica reservado para hover e superfície de estado, onde 6,71:1 basta.

Escala completa disponível em `tokens.json` (50–950, formato CSS e Tailwind).

---

## Tipografia

A `ui-ux-pro-max` pede **"Strong bold condensed"** para Manufacturing / Industrial Raw.

⚠️ **Limitação encontrada na ferramenta:** o `fonts_search` do design-studio devolve uma lista
**curada de 12 fontes** (Inter, Roboto, Montserrat, Poppins, DM Sans, Space Grotesk, Geist…) e
**nenhuma condensada de display**. Para cumprir a diretriz é preciso indicar a fonte diretamente —
a ferramenta não cobre esse caso.

| papel | fonte | por quê |
|---|---|---|
| display | **Archivo Expanded / Condensed** ou **Oswald** | condensada pesada, atende "strong bold condensed" |
| corpo | **Inter** | disponível na lista curada, 100–900, ótima legibilidade em corpo pequeno |
| mono | **Geist Mono** ou **JetBrains Mono** | dado técnico, medição, log |

**Escala de display:** teto de **112px** (`clamp(44px, 8vw, 112px)`).
Justificativa contra a amostra de premiados: mediana 82px, 35 de 84 acima de 100px, faixa
Minh Pham 116 / Iventions 120. Teste anterior a 132px empurrou a prova para fora da dobra.

---

## Forma e espaço

Herdados do build anterior por já terem sido derivados de CSS real capturado:
raio 4/6/8/12px · espaço base 4 · largura máxima 1180px · motion 150/200/300/500ms, `ease-out`.

---

## O que **não** está decidido aqui

Composição, hierarquia e layout de cada seção. Isso é **F4 (mockup)** e depende de aprovação do
founder seção a seção — é justamente o gate que não existia e por onde o trabalho anterior se perdeu.

Este documento define **o sistema**, não as telas.
