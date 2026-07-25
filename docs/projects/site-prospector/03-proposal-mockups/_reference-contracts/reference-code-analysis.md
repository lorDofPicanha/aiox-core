# Reference Code Analysis — buckssauce & Magnolia

**Atualizado:** 2026-07-24 (v2) · **Autor:** Orion
**Método:** captura real com Chrome headless (puppeteer-core) → DOM renderizado pós-scroll, CSS de rede + `cssRules`, estilos computados, assets, screenshots por passo.

> ## ⚠️ Leia isto antes de qualquer build
> A v1 deste documento era **prosa escrita de memória** depois de olhar o site numa sessão de browser.
> Nada tinha sido salvo em disco. Prosa sobre código **não é** código — builds feitos a partir dela
> saem genéricos, exatamente como sairiam de um prompt. **Vários fatos da v1 estavam errados** (ver
> tabela de correções abaixo).
>
> **Regra:** só construa a partir de `inputs/`. Se `inputs/` não existir para a referência, **capture primeiro**.

---

## 0. Correções da v1 → v2 (o que eu tinha afirmado errado)

| # | v1 (prosa, errado) | v2 (capturado, correto) |
|---|---|---|
| 1 | Stack **Astro** + Tailwind | **Next.js** + Tailwind v4 (`next/font` → `../media/*-s.*.woff2`; `astro: false` no DOM) |
| 2 | h1 = **133px** | h1 = **100px** (`PeperoncinoSansCustom`) |
| 3 | O **hero** é pinado (scroll-scrub) | O hero **não** é pinado. O `pin-spacer` (**2348px**) está na seção de **trust badges** |
| 4 | Container "full-bleed ~1905px" (vago) | `p-container` = `padding-inline: var(--spacing)*1.25` (**5px**) / `*2.5` (**10px** ≥1024). Full-bleed literal |
| 5 | bg `#100B06` (certo por acaso) | Confirmado + paleta inteira extraída do `:root` (abaixo) |
| 6 | "wrappers de ~12867px" | Altura real do documento = **11253px** @1440 |
| 7 | Breakpoints não citados | `364`, `383`, `1024` px + `40/48/64/80/96/144rem` |

Nota: `window.gsap` retorna `false`, mas o DOM contém `pin-spacer` (classe que o **ScrollTrigger** cria).
GSAP está empacotado como módulo, não exposto no `window` — detecção por `window.*` dá **falso-negativo**.

---

## 1. buckssauce.com — blueprint capturado

**Captura:** `food/buckssauce/inputs/` · `page.html` 2,37 MB · `css-collected.css` 163 KB · 78 imagens · 2 famílias de fonte
**Anti-bot:** "Vercel Security Checkpoint" — `curl` recebe **429**. Só passa com Chrome real.

### Tokens (`:root`, valores exatos)

```css
--background:#100b06;  --background-lighter:#272119;  --foreground:#f5e4c7;
--gold:#be8d3f;        --orange:#f15726;              --red:#da1f27;
--menu:#322c23;        --brown:#593e2c;               --spacing:.25rem;
```

Frequência real: `#f5e4c7` (texto) 1870× · `#100b06` (fundo) 122× · `#be8d3f` 5× · `#f15726` 4× · `#da1f27` 3×.
Raio: **10px** (149×) e **pill 9999px** (102×). Também 24px.

### Tipografia

- Display: **PeperoncinoSansCustom** (`.woff` própria, **proprietária** — substituto livre mais próximo: Anton/Archivo Black)
- Corpo: **Inter Tight** (variável 100–900, via `next/font`)
- Escala computada: 16 · 20 · 26 · 30 · 36 · 44 · 50 · 60 · **100** · 140 · 168 · 300 · 403 · 432 px
- h1 **100px** · "BUY A PACK" **80px** · nome de produto **50px** · pilar **36px**
- ⚠️ Rótulos de seção ("CHOOSE YOUR WEAPON", "Why Bucks Sauce", "REVIEWS") são **h2 de 16px** —
  o lettering gigante na tela é **outro elemento** (traçado/contorno, 300–432px), não o h2.

### Sequência real de seções (altura @1440)

| # | Elemento | Altura | Observação |
|---|---|---|---|
| 1 | `<header class="z-9990 fixed ... pointer-events-none">` | 213 | **fixed**, não sticky. Rótulos duplicados ("SHOP SHOP") = troca de texto no hover |
| 2 | `<section class="p-container mt-25! flex flex-col items-center">` | **1088** | HERO |
| 3 | `<div class="p-container w-full mt-30 lg:mt-40">` | 256 | manifesto |
| 4 | `<div class="pin-spacer">` | **2348** | **TRUST BADGES PINADAS** — cards girados que empilham no scroll |
| 5 | `<section class="relative p-container flex flex-col items-center mt-15">` | 1366 | "CHOOSE YOUR WEAPON" + trio |
| 6 | `<section class="relative flex flex-col items-center mt-38 sh:pb-40">` | **3150** | "WHY" — maior seção, título letra-a-letra |
| 7 | `<section class="relative w-full mt-38 p-container flex flex-col-reverse">` | 900 | "BUY A PACK" |
| 8 | `<section class="relative p-container">` | 1210 | REVIEWS (marquee) |
| 9 | `<footer class="relative p-container flex flex-col gap-8 lg:gap-5 pt-5">` | 343 | grid interno `grid-cols-2 lg:grid-cols-[15fr_35fr_35fr_15fr]` |

### Vocabulário visual assinatura (o que faz "parecer buckssauce")

1. **Texto só contorno** (stroke, fill transparente) — parte do h1, títulos gigantes, números "01/02/03"
2. **Pílula creme com `• texto •`** (bolinhas ladeando) como cabeçalho de card e rótulo
3. **Bordas tracejadas** em cards e caixas (offset interno)
4. **Réguas pontilhadas/ticadas**, algumas em leve rotação
5. **Cards girados** poucos graus, empilhando durante o pin
6. **Recortes fotográficos flutuando**, alguns **desfocados** (profundidade de campo)
7. **Blocos de cor sólida** nos produtos: gold / orange / red
8. **Ícones circulares em contorno** (1px)
9. **Botões-seta circulares creme** (~86px) no carrossel do hero
10. **Círculo de cor atrás do produto** no hero
11. Header ao rolar vira **pílula "GET SAUCE" + caixa carrinho + caixa hambúrguer**

### Motion

preloader clip-path · pin scroll-scrub das trust badges · flip frente/verso no card · máquina de estado Add→Adding→Added · marquee de reviews (`antler-scroll`) · título letra-a-letra (`aboutTitleBorderIn`) · fallback `prefers-reduced-motion` obrigatório.

---

## 2. Magnolia Bakery — blueprint capturado

**Captura:** `confectionery/benchmarks/magnolia-bakery/inputs/` (`page.html` 348 KB, `css-collected.css` 746 KB, `component-properties.json` 113 KB).

**Stack:** Shopify (tema INF/Impact). **Layout:** contido, grid **12-col**, container **1352px** (também 1279/1200/990), wrapper `Section__container`.
**Cor:** branco + **#00211a** (verde) + **#bae8d4** (menta). **Type:** `Gatefold Demi` h1 **65** / h2 **54** / h3 **42** px; `Ambit` corpo; `Gt Alpina` editorial. Botões **pill 20px uppercase**, verde fill/menta texto, hover inverte.
**Breakpoints:** 767 · 989 · 1279 · 1280+.

**Sequência:** PreHeader+Header+MegaNav+SliderCart+QuickView → **HeroCarousel** (`HeroSlide > Overlay + HeroSlide__content-shape` svgShape) → **Pods** (grid de tiles imagem-link) → **ContentArea** (imagem full-bleed + overlay + blocos) → Newsletter → Footer.

---

## 3. Como isso vira "2 variações fiéis"

- **Variação A (buckssauce):** full-bleed real (5/10px), `#100b06`, display gigante em contorno, preloader, trust badges **pinadas** e giradas, trio de cor sólida com flip, kit, marquee. — *ousada/jovem*
- **Variação B (Magnolia):** contido 1352px, 12-col, branco + cor de marca, serif display, HeroCarousel com shape SVG, Pods, ContentArea. — *editorial/heritage*

**Gate de fidelidade:** medir contra `inputs/` (container, grid, escala tipográfica, sequência, componentes, altura)
e contra `inputs/screens/` no diff de pixel a 1440 e 375. Fidelidade **não** é auto-declarada.

⚠️ Ao tirar screenshot em headless: o Chrome reporta `prefers-reduced-motion: reduce` por padrão.
Sem `emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}])` você fotografa
o **fallback estático** e conclui, errado, que o movimento não funciona.
