# Reference Code Analysis — buckssauce & Magnolia (REAL code, not screenshots)

**Data:** 2026-07-24 · **Autor:** Orion · **Método:** HTML cru + CSS + DOM renderizado (browser), não tokens/screenshot.
**Por que isso existe:** os builds anteriores (Brandt, Dona Hilda) saíram "parecidos de longe" porque foram feitos a partir de screenshots + um resumo de tokens (`DESIGN.md`). Este doc é o **blueprint estrutural real**, buildável à fidelidade.

---

## ⚠️ Descoberta que explica tudo

As duas referências têm **DNA de layout OPOSTO** — e meus builds não bateram com NENHUMA:

| Eixo | **buckssauce** (real) | **Magnolia** (real) | Meu build errado |
|---|---|---|---|
| Container | **FULL-BLEED** (~1905/1920px, edge-to-edge) | **Contido** 12-col, max **1352px** | ❌ usei 1200px container |
| Fundo | near-black **#100B06** | branco + verde **#00211a** | ❌ inventei paleta |
| Display font | **PeperoncinoSansCustom** ~**133px** (título de seção às vezes é IMAGEM) | **Gatefold Demi** serif 65px | ❌ usei Playfair genérico |
| Body font | **Inter Tight** | Ambit | ~ |
| Motion | preloader clip-path + **pinned scroll-scrub** | carousel + reveals suaves | ❌ não reproduzi |

---

## 1. buckssauce.com — blueprint real

**Stack:** Astro + **Tailwind** (classes utilitárias reais: `w-[calc((100%-1.25rem)/3)]`, `h-dvh`, `clip-path:inset(0)`).
**Layout:** **full-bleed**, edge-to-edge. Grid de 3 colunas com gap 1.25rem (20px) para produtos/reviews.
**Cor:** bg `#100B06`. **Type:** display `PeperoncinoSansCustom` gigante (hero h1 **133px**, "buy a pack" 106px); body `Inter Tight`. Vários títulos de seção são **imagens de lettering custom** ("Choose your / weapon", "Why Bucks Sauce").
**Preloader:** overlay `fixed inset-0 h-dvh z-9999 clip-path:inset(0)` → círculo que expande.

**Sequência REAL de seções (DOM):**
1. **Nav** — logo + Shop/Wholesale/About/Contact/FAQ + cart, CTA "get sauce"
2. **Hero** (pinned scroll-scrub) — headline 133px "The BBQ sauce that makes other sauces insecure" + "Product n0.0" + 3 sabores + imagens reais de comida flutuando (scatter no scroll) + "Shop Now"
3. **Manifesto** — linha "real, natural stuff like it's the 1800s…"
4. **Trust badges** — 4 células ícone+microcopy (no corn syrup / no seed oils / no additives / gluten free)
5. **"Choose your weapon"** — 3 product cards (imagem frente+verso no hover, $12, Add to cart c/ estados Add→Adding→Added, View product)
6. **"Why Bucks Sauce"** — 3 pilares (Small batches / Real Ingredients / "Oh, This?" prêmio)
7. **"buy a pack / Save some Bucks"** — bundles 3-pack/6-pack ($32)
8. **REVIEWS** — marquee de cards (nome + @handle), cards 1/3 de largura, ~580px alt
9. **"Join the Bucks Club"** — newsletter (email)
10. **Footer**

**Motion:** hero pinned (wrappers de ~12867px = seções longas presas), imagens de comida espalham no scroll; card hover flip; add-to-cart state machine; reviews marquee.

---

## 2. Magnolia Bakery — blueprint real

**Stack:** Shopify (tema INF/Impact), `app.min.css` **700KB**.
**Layout:** **contido**, grid **12-col** (`repeat(12,1fr)`), container **1352px** (também 1279/1200/990). Wrapper `Section__container`.
**Cor:** branco surface + **#00211a** (verde) texto/marca + **#bae8d4** (menta) acento. **Type:** `Gatefold Demi` (serif display) h1 **65px** / h2 **54px** / h3 **42px** (tablet/mobile 38px); `Ambit` body; `Gt Alpina` editorial. Botões **pill 20px uppercase**, verde fill/menta texto, hover inverte.
**Breakpoints:** mobile 767 · tablet 989 · laptop 1279 · desktop 1280+.

**Sequência REAL de seções (markup Shopify):**
1. PreHeader + Header + MegaNav (6) + SliderCart + QuickView (chrome)
2. **HeroCarousel** — `Section__container > HeroCarousel > HeroSlide > Overlay(Overlay__background) + HeroSlide__content-wrapper > HeroSlide__content-shape (svgShape)` → imagem full-bleed + overlay + **forma SVG** + heading + "LEARN MORE"
3. **Pods** — `Section__text (Pods__heading, Pods__subheading, Pods__button) > Pods > Pod > Pod__link > Pod__image` → grid de tiles imagem-link (Workshops / Banana Pudding Bar / Catering / Handbook / Franchising)
4. **ContentArea** ("Catering, Gifting & Events") — `Overlay(background+content) > Section__container > Section__info > ContentArea__paragraph + ContentArea__blocks > ContentBlock__text` → imagem full-bleed com overlay + blocos de texto + "GET STARTED"
5. **Newsletter**
6. **Footer**

**Componentes reais (nomes de classe):** Section, Section__container, Section__text, HeroCarousel, HeroSlide, Overlay, Pods, Pod, Pod__link, Pod__image, ContentArea, ContentBlock.

---

## 3. Como isso vira "2 variações fiéis"

Cada variação copia a **geometria + sequência + componentes reais** de UMA referência, e injeta marca/foto/copy do prospect por cima:

- **Variação A (buckssauce):** full-bleed, fundo near-black, display gigante (fonte livre parecida: *Anton / Archivo Black* no lugar da Peperoncino), preloader clip-path, hero pinned com produtos flutuando, trust-badges, product-trio front/back, bundles, reviews marquee. — direção *ousada/jovem*.
- **Variação B (Magnolia):** contido 1352px, 12-col, branco+cor-de-marca, serif display (*Playfair/Fraunces*), HeroCarousel com shape SVG, Pods grid imagem-link, ContentArea overlay, newsletter. — direção *editorial/heritage*.

**Regra:** agora a fidelidade é medida contra ESTES fatos de código (container, grid, type-scale, sequência, componentes), não contra um screenshot.
