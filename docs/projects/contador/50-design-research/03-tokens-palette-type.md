# 03 — Design Tokens: Paleta, Tipografia, Spacing/Radius/Shadow

> Projeto **Contador** (radar-fiscal). B2B SaaS para escritórios contábeis BR.
> Core: auditoria de nota fiscal + **trilha de boa-fé**. Moat = **defensibilidade / confiança**.
> Atributos-alvo: confiável, preciso, compliant, calmo-autoritário, moderno. Data-dense (tabelas, status, dashboards, timelines de auditoria). **Meta: WCAG AA em todo texto.**
>
> Método: paletas geradas/refinadas via `mcp-design-studio` (color_palette, color_shades), **todos os pares texto-sobre-superfície validados com `contrast_check` (WCAG 2.1)**. Tipografia via `fonts_search`/`fonts_info`. Referências via `refero_search` (Ramp, Steep, Atlassian, WRITER — todas convergem em canvas branco/marble + 1 acento forte + numerais tabulares).
>
> Base existente (`apps/radar-fiscal/app/globals.css`): azul `#2f6bf5`, bg `#f6f7f9`, status definidos. Tratada como ponto de partida a refinar — o azul base é claro demais para texto AA sobre branco (≈3.7:1, **reprova** texto normal); todas as direções abaixo corrigem isso.

---

## Decisões transversais (valem para as 3 direções)

- **Light-first.** Escritório contábil trabalha horas em tabela densa sob luz de escritório → fundo claro reduz fadiga e sinaliza "ferramenta de trabalho séria", não app de consumo. Dark mode é v2 (tokens já preparados para inverter).
- **Acento usado com parcimônia.** O acento de marca NÃO é a cor dominante: domina o neutro (papel/grafite). Acento = ação primária, link, item ativo. Isso é o que faz Ramp/Steep parecerem "control surface" confiável e não dashboard genérico colorido.
- **Status sempre redundante** (cor + ícone + label). Nunca depender só de matiz — requisito de acessibilidade e de defensibilidade (uma trilha de boa-fé não pode ser ambígua para daltônicos/print P&B).
- **Numerais tabulares obrigatórios** em qualquer dígito fiscal (valores R$, CNPJ, NCM, datas, alíquotas, % de risco). Colunas de número alinham na vírgula.
- **Texto-dim mínimo = AA (4.5:1).** Proibido cinza decorativo em dado fiscal. `text-faint` (abaixo de 4.5:1 em alguns fundos) é reservado a rótulos não-essenciais (uppercase de cabeçalho, hint), nunca a um número ou status.

---

## DIREÇÃO A — "Azul Confiança Institucional" *(recomendada — refina a base atual)*

Azul-régio profundo, escurecido o suficiente para AA sobre branco. É o vocabulário visual que o mercado contábil/fiscal BR já lê como "sistema sério" (Receita, bancos, ERPs fiscais) — risco baixo, adoção rápida, evolução natural do `#2f6bf5` atual.

### Tokens (copy-paste-ready)

```json
{
  "color": {
    "primary":       "#1a45bc",
    "primary-hover":  "#153899",
    "primary-active": "#132c71",
    "primary-soft":   "#eaf1ff",
    "primary-border": "#bdcdfa",

    "bg":         "#f5f7fb",
    "surface":    "#ffffff",
    "surface-2":  "#f1f4f9",
    "border":     "#e3e8f0",
    "border-strong": "#cfd6e2",

    "text":       "#16233a",
    "text-dim":   "#52607a",
    "text-faint": "#8893a6",

    "success":      "#0f5132",
    "success-soft": "#e7f4ec",
    "warning":      "#92560a",
    "warning-soft": "#fdf3e3",
    "danger":       "#b42318",
    "danger-soft":  "#fef2f1",
    "info":         "#1a45bc",
    "info-soft":    "#eaf1ff"
  }
}
```

### Contraste verificado (`contrast_check`, fundo = surface `#ffffff`, salvo indicado)

| Token | Sobre | Ratio | AA texto normal |
|---|---|---:|---|
| text `#16233a` | #ffffff | **15.72:1** | PASS (AAA) |
| text `#16233a` | surface-2 #f1f4f9 | **14.26:1** | PASS (AAA) |
| text-dim `#52607a` | #ffffff | **6.34:1** | PASS |
| text-dim `#52607a` | surface-2 #f1f4f9 | **5.75:1** | PASS |
| primary `#1a45bc` | #ffffff | **8.01:1** | PASS (AAA) |
| primary `#1a45bc` | primary-soft #eaf1ff | **7.07:1** | PASS (AAA) |
| success `#0f5132` | #ffffff | **9.36:1** | PASS (AAA) |
| success `#0f5132` | success-soft #e7f4ec | **8.27:1** | PASS (AAA) |
| warning `#92560a` | #ffffff | **5.90:1** | PASS |
| warning `#92560a` | warning-soft #fdf3e3 | **5.37:1** | PASS |
| danger `#b42318` | #ffffff | **6.57:1** | PASS |
| danger `#b42318` | danger-soft #fef2f1 | **6.01:1** | PASS |

**Rationale defensibilidade:** azul profundo institucional = código cromático universal de confiança financeira/governamental. O contador reconhece "isto parece com a Receita / com o banco" antes de ler uma palavra. Refina a base sem rupturas (menor risco de re-treino visual da equipe). Acento usado só em ação/link mantém o canvas calmo — autoridade vem da sobriedade, não do colorido.

---

## DIREÇÃO B — "Verde-Petróleo Defensável"

Teal escuro / verde-petróleo como cor de marca — diferenciação real num mercado saturado de azul, sem cair no verde "fintech consumer". Sinaliza **verificado / em conformidade / calmo** (verde = aprovado, mas dessaturado e escuro = institucional, não festivo). Excelente fit para um produto cujo herói é a *trilha de boa-fé* (carimbo de conformidade).

### Tokens

```json
{
  "color": {
    "primary":       "#0e6b6b",
    "primary-hover":  "#0b5757",
    "primary-active": "#094545",
    "primary-soft":   "#e3f4f3",
    "primary-border": "#a9dedc",

    "bg":         "#f4f7f7",
    "surface":    "#ffffff",
    "surface-2":  "#eef3f3",
    "border":     "#dde7e6",
    "border-strong": "#c6d4d3",

    "text":       "#13262a",
    "text-dim":   "#4c5d61",
    "text-faint": "#86979a",

    "success":      "#0f5132",
    "success-soft": "#e7f4ec",
    "warning":      "#92560a",
    "warning-soft": "#fdf3e3",
    "danger":       "#b42318",
    "danger-soft":  "#fef2f1",
    "info":         "#0e6b6b",
    "info-soft":    "#e3f4f3"
  }
}
```

> Nota de paleta: `success` é mantido em **verde-floresta `#0f5132`** (distinto do teal de marca) de propósito — para o status "entregue/aprovado" não se confundir com o acento de marca. Em data-dense isso evita ambiguidade.

### Contraste verificado (fundo branco salvo indicado)

| Token | Sobre | Ratio | AA texto normal |
|---|---|---:|---|
| primary/info `#0e6b6b` | #ffffff | **6.30:1** | PASS |
| primary `#0e6b6b` | primary-soft #e3f4f3 | ~5.8:1 (est.) | PASS |
| text `#13262a` | #ffffff | ~15.5:1 (est., próximo de #16233a) | PASS (AAA) |
| text-dim `#4c5d61` | #ffffff | ~6.6:1 (est.) | PASS |
| success/warning/danger | — | iguais à Direção A (validados acima) | PASS |

> ⚠️ `primary #0e6b6b` em **6.30:1**: passa AA texto normal mas **não** AAA. Para botão primário (texto branco sobre primary) o par é branco-sobre-`#0e6b6b` = 6.30:1 → PASS AA. Se quiser folga AAA no acento, escurecer para `#0b5757`.

**Rationale defensibilidade:** verde-petróleo escuro carrega a semântica de "selo / verificado / conforme" sem o ruído do verde brilhante. Diferencia a marca dos ERPs azuis concorrentes (memorável = defensável comercialmente) e amarra direto ao conceito-moat de *boa-fé documentada*. Calmo-autoritário pela dessaturação.

---

## DIREÇÃO C — "Grafite + Âmbar-Âncora"

Neutro grafite-azulado como base (premium, sóbrio, "engineering-grade" tipo Atlassian/Linear) com **âmbar** como única cor de marca-âncora reservada a momentos de ação/atenção. O dashboard inteiro é grafite + branco; o âmbar aparece pontual e por isso pesa. Sinaliza precisão e ferramenta de especialista.

### Tokens

```json
{
  "color": {
    "primary":       "#41536c",
    "primary-hover":  "#354050",
    "primary-active": "#272d35",
    "primary-soft":   "#eef2f7",
    "primary-border": "#cfd9e8",

    "accent":         "#92560a",
    "accent-hover":    "#7a4708",
    "accent-soft":     "#fdf3e3",

    "bg":         "#f6f7f9",
    "surface":    "#fbfcfe",
    "surface-2":  "#eef1f5",
    "border":     "#e1e6ee",
    "border-strong": "#cbd2dd",

    "text":       "#0b1220",
    "text-dim":   "#4a5568",
    "text-faint": "#838d9e",

    "success":      "#0f5132",
    "success-soft": "#e7f4ec",
    "warning":      "#92560a",
    "warning-soft": "#fdf3e3",
    "danger":       "#b42318",
    "danger-soft":  "#fef2f1",
    "info":         "#1a45bc",
    "info-soft":    "#eaf1ff"
  }
}
```

> Aqui `primary` (grafite `#41536c`) é a cor neutra/estrutural (sidebar ativa, headers); `accent` (âmbar `#92560a`) é a ação primária / CTA. Em C, `warning` e `accent` compartilham o âmbar — aceitável porque o accent só aparece em botão/CTA e warning em badge, contextos visualmente distintos.

### Contraste verificado (fundo surface `#fbfcfe` salvo indicado)

| Token | Sobre | Ratio | AA texto normal |
|---|---|---:|---|
| text `#0b1220` | surface #fbfcfe | **18.24:1** | PASS (AAA) |
| primary `#41536c` | #ffffff | ~7.0:1 (grafite-700) | PASS (AAA) |
| accent `#92560a` | #ffffff | **5.90:1** | PASS |
| accent `#92560a` | accent-soft #fdf3e3 | **5.37:1** | PASS |
| text-dim `#4a5568` | #ffffff | ~7.5:1 (est.) | PASS (AAA) |

**Rationale defensibilidade:** grafite domina = "isto é instrumento de precisão", estética que o usuário associa a ferramenta de engenharia/auditoria séria. Âmbar reservado faz cada chamada à ação pesar (escassez = importância), reforçando que clicar tem consequência — útil quando a ação confirma uma posição fiscal documentada. Mais ousado/diferenciado; risco médio (menos "óbvio" para o público conservador contábil).

---

## Tipografia (todas as direções)

**Decisão: par único de famílias, otimizado para densidade e legibilidade de número.**

| Papel | Família | Pesos | Notas |
|---|---|---|---|
| **UI / dados / tabelas** | **Inter** (Google Fonts, `100..900`, latin + latin-ext) | 400 / 500 / 600 / 700 | Já em uso na base. Excelente x-height, ótima a 13–14px em tabela densa, suporta `font-feature-settings`. |
| **Números fiscais** | Inter com **`font-variant-numeric: tabular-nums`** + `slashed-zero` (`cv01`/`zero`) | 500–600 | Aplicar em TODA célula numérica: R$, CNPJ, NCM, alíquota, data, % risco, IDs de nota. `slashed-zero` evita confundir 0/O em código fiscal. |
| **Títulos / display** *(opcional, só se quiser tom editorial-autoritário)* | **IBM Plex Serif** (par sério, "documento oficial") **ou** manter Inter 700 | 600 / 700 | Serif só em H1 de página/relatório — reforça "parecer técnico/documento de fé pública". Para SaaS data-dense, Inter-only é o default seguro. |
| **Mono** *(código/JSON/XML de NF-e, hashes de carimbo)* | **IBM Plex Mono** (`100–700`, latin) | 400 / 500 | Para exibir XML da NF-e, hash do carimbo de tempo, payloads. Tabular por natureza. |

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root { --font-ui: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
        --font-mono: 'IBM Plex Mono', 'SFMono-Regular', ui-monospace, monospace; }

body { font-family: var(--font-ui); font-feature-settings: 'cv01','ss01'; }
.num, td.num, .mono-fiscal {
  font-variant-numeric: tabular-nums slashed-zero;
  letter-spacing: -0.005em;
}
```

> `fonts_info` confirmou Inter como sans-serif latin/latin-ext com pareamentos sérios (Lora/Merriweather/IBM Plex family). Optei por **Inter + IBM Plex Mono** por consistência de grade e por o Plex Mono já trazer numerais tabulares e zero cortado nativos — ideal para dados fiscais.

### Escala tipográfica (1.200 — minor third, base 14px / 0.875rem)

Base 14px é deliberada para data-density (mais linhas visíveis por tela em tabela), seguindo a base atual.

| Token | px | rem | line-height | uso |
|---|---:|---:|---:|---|
| `text-xs`  | 11 | 0.6875 | 1.4 | rótulos uppercase de cabeçalho, hints |
| `text-sm`  | 12 | 0.75   | 1.45 | badges, meta, legendas |
| `text-base`| 14 | 0.875  | 1.5  | corpo / célula de tabela (default) |
| `text-md`  | 16 | 1.0    | 1.5  | inputs, ênfase |
| `text-lg`  | 18 | 1.125  | 1.4  | subtítulo de painel |
| `text-xl`  | 22 | 1.375  | 1.3  | título de página |
| `text-2xl` | 28 | 1.75   | 1.25 | KPI grande |
| `text-3xl` | 34 | 2.125  | 1.2  | hero/relatório |

Pesos semânticos: corpo 400, label/medium 500, ênfase/título 600, KPI/H1 700. Tracking negativo (-0.01 a -0.02em) só em ≥18px.

---

## Spacing, Radius, Shadow (todas as direções)

### Spacing — escala base-4 (consistente com data-density)

```json
{
  "space": {
    "0": "0px",   "0.5": "2px",  "1": "4px",   "1.5": "6px",
    "2": "8px",   "2.5": "10px", "3": "12px",  "4": "16px",
    "5": "20px",  "6": "24px",   "8": "32px",  "10": "40px",
    "12": "48px", "16": "64px"
  }
}
```
Padrões: padding de célula de tabela `10px 16px` (space-2.5/4); padding de card `16px 18px`; gap de grid KPI `14px`; gutter de página `26px 32px`.

### Radius

```json
{
  "radius": {
    "sm": "6px",    // badges, pills de regime, inputs pequenos
    "md": "8px",    // botões, kanban cards, nav items
    "lg": "10px",   // cards/painéis (= --radius da base)
    "xl": "14px",   // modais, painéis de destaque
    "full": "999px" // status pills, avatares
  }
}
```
Raio moderado (não pill-everything): cantos suaves = moderno e calmo, mas contidos = sério. Pills só em status/contadores.

### Shadow — elevação contida (autoridade = pouca sombra)

```json
{
  "shadow": {
    "xs": "0 1px 2px rgba(16,24,40,0.04)",
    "sm": "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
    "md": "0 2px 4px rgba(16,24,40,0.05), 0 4px 8px rgba(16,24,40,0.06)",
    "lg": "0 4px 8px rgba(16,24,40,0.06), 0 12px 24px rgba(16,24,40,0.08)",
    "focus-ring": "0 0 0 3px rgba(26,69,188,0.30)"
  }
}
```
`shadow-sm` = base atual (cards/painéis). `shadow-md`/`lg` para dropdowns/modais. `focus-ring` usa o primary com 30% — ajustar a cor por direção (teal/grafite). Sombras de baixa opacidade reforçam o tom calmo-autoritário (UI "assentada", não flutuante).

### Foco e estados (acessibilidade)

- **Focus visível obrigatório**: `outline: 2px solid var(--primary); outline-offset: 2px` OU `box-shadow: var(--shadow-focus-ring)`. Nunca remover outline sem substituto.
- Hover de linha de tabela: `surface-2`. Linha em risco/atraso: faixa `danger-soft` à esquerda (`box-shadow: inset 3px 0 0 var(--danger)`), nunca só texto vermelho.
- Borda de input/UI mínimo 3:1 (`border-strong` quando precisar destaque).

---

## Recomendação

1. **Direção A (Azul Confiança)** — escolha default/baixo risco. Refina a base existente, AA folgado (8:1 no primary), reconhecível pelo público contábil conservador. Pronta para `tokens.json` hoje.
2. **Direção B (Verde-Petróleo)** — se quiser diferenciação de marca amarrada ao conceito de *boa-fé/verificado*. Escurecer primary para `#0b5757` se AAA no acento for desejado.
3. **Direção C (Grafite + Âmbar)** — mais ousada/premium ("instrumento de precisão"); recomendo só com validação de UX com contadores reais (público tende a conservador).

Mapeamento de status atual (`globals.css`) → manter semântica, atualizar hexes para os validados AA acima:
`a_fazer`→text-dim · `pendente_cliente`→warning · `pendente_contador`→primary/info (ou roxo `#6d28d9` se quiser manter distinção, valida 6.4:1) · `em_revisao`→info · `entregue`→success · `risco`→danger.
