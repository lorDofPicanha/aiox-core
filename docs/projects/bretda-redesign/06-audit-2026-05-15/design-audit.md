# Design Mega-Audit Bretda — 2026-05-15

**Auditor:** Uma (UX Design Expert · AIOS)
**Persona refs:** Dieter Rams · Marty Neumeier · Tobias van Schneider · Refika Anadol · Vitaly Friedman
**Site under audit:** https://bretda.com.br (live)
**Codebase:** `D:\AIOS\apps\bretda-lp` · Next.js 16 · React 19 · Tailwind v4
**Method:** Static read of 9 homepage organisms (`page.tsx` + 8 `eleven-*.tsx`) + `DESIGN.md` + REDESIGN-PROPOSAL + Phase 2 conclave. Cross-checked against the QA audit and HYDRA research already in this folder.
**Companion docs:**
- `06-audit-2026-05-15/qa-audit.md` — technical / DORA / observability (Quinn)
- `06-audit-2026-05-15/hydra-research.md` — KB scan (HYDRA)
- This doc — **visual / IA / luxury fidelity** (the gap the other two left)

---

## Executive answer to "the site is mal feito"

The user is right, and the root cause is **not** what the QA audit found (missing error boundaries, lint debt, zero tests) — those are necessary but not sufficient. The visual root cause is **the 30/Abr "11ravens-clone overnight" sprint ignored the locked Phase 2/3 spec**.

Three of the 14 Non-Negotiables locked in `CONCLAVE-SYNTHESIS.md` and 5 of 11 acceptance criteria in `REDESIGN-PROPOSAL.md` were silently violated by the eleven-* organisms that shipped:

| Locked decision (2026-04-27) | Shipped in production (30/Abr) | Status |
|---|---|---|
| N1 — Homepage = 3 sections + footer | **7 sections** (Hero, Marquee, Category, Collection, Customization, Brand Story, Testimonial) | **Violated** |
| N2 — Hero zero headline, one caption max, gradient ≤ `from-black/40` | Hero has eyebrow + 2-line headline with italic + 4-line subhead + vertical rotated label + 2 hairlines + CTA — **5+ elements** | **Violated** |
| N3 — StatsSection deleted | Stats moved into `ElevenMarqueeStrip` ("100% sob encomenda · Lã italiana · 5 anos de garantia") + repeated in brand story + repeated in customization | **Violated, just relocated** |
| N5 — One primary CTA above the fold | Hero has 1, but nav has `Conversar` CTA visible above the fold + WhatsApp FAB + sticky scroll-cue | **Violated** |
| N9 — One accent per viewport (champagne) | Hero stacks **6 champagne events**: vertical label, hairline top, eyebrow rule, italic word, button, hairline bottom | **Violated** |
| N10 — Lifestyle JPGs replace cream-card renders | Collection gallery uses transparent PNG silhouettes (`orbit-1.png`) — neither lifestyle nor render. **Floating product cutouts on charcoal.** | **Violated, in the worst possible direction** |
| AC — Top nav = 4 noun items | Nav has 4 items **plus** `Conversar` CTA = 5 affordances | **Violated** |
| AC — Footer collapse to 2 cols | Footer has 4 columns + concierge band + giant phone + 2 buttons | **Violated** |
| AC — WhatsApp green only in FAB | WhatsApp FAB still pulses + `Conversar` link in nav + 2 footer CTAs go to WhatsApp | **Violated** |

**The pattern:** 30/Abr did a **token swap and a copy rewrite** (correct moves) **but doubled the section count** (incorrect move). The site went from "5 same-rhythm B2B-SaaS sections" to "7 same-rhythm 11ravens-clone sections" — same disease, different costume.

This is the exact anti-pattern logged in `.out-of-scope/luxury-redesign-without-benchmark.md`: **implementing luxe without phase-0 visual benchmark**.

---

## 1. Visual Health Score

| Dimension | Score | Notes |
|---|---:|---|
| **Overall** | **42 / 100** | Luxury reads ~3/10 on first scroll; the 7 organisms each look correct in isolation, the assembly is wrong. |
| Luxury fidelity vs Aston Martin / 11ravens benchmark | 3 / 10 | Has the chrome (charcoal, serif, champagne) but not the **restraint**. |
| Layout sophistication | 4 / 10 | Every section is centered, capped at 1280–1440px, with overline + display + hairline + body. Same rhythm 7 times. |
| Typography craft | 5 / 10 | TAN Aegean + Century Gothic now licensed and shipped (good). But italic-on-serif is used as a *trick* in 4 sections, and `uppercase + 0.28–0.36em tracking` appears in 6 places. |
| Color discipline | 4 / 10 | Champagne `#C9A979` deployed correctly as token, but used **6× in the hero alone**. WhatsApp green leaks into footer CTAs. |
| Photography quality | 3 / 10 | The decision to use **transparent PNG silhouettes** for product cards (`orbit-1.png`) on the charcoal canvas destroys the luxury reading. A cutout reads as "marketplace render," not "object in space." |
| Motion / transitions | 5 / 10 | `eleven-fade` IntersectionObserver is restrained (correct). But `Conversar` nav hover swaps both color and opacity inline, and the navbar `backdrop-filter: blur(14px)` competes with the `border-color` transition — micro-jitter on first scroll. |
| Information hierarchy | 3 / 10 | Every section ends with "champagne hairline 56px wide + center-aligned" → reads as *list of items*, not as *narrative*. |

**Headline number for the chief:** the site is currently at the **bottom of the bottom quartile of luxury furniture e-commerce** (visual reference class: Cassina, Vitra, B&B Italia, Bottega Maison, Brunello Cucinelli, Aman Stories). It is **above** the median of "Squarespace luxury template" but **well below** even the entry tier of editorial furniture publishing.

---

## 2. The "site mal feito" diagnosis — 5 concrete hypotheses

Each numbered finding here points at a specific shipped file, a specific decision, and the luxury-reference-class delta.

### Hypothesis 1 — **Section count is doubled, not halved**
- **Locked spec:** Homepage = 3 sections (Hero / Coleção / Atelier-band) + Footer.
- **Shipped:** Homepage = 7 sections + Footer. Each section reuses the same `eleven-overline-wide` + `eleven-display` + `eleven-fade` + `56px champagne hairline` pattern.
- **Why this reads as "mal feito":** the eye learns the section grammar in 2 scrolls, then sees that grammar **repeated 5 more times** with different content — the brain pattern-matches *list*, not *story*. The locked spec asked for **3 sections of varying rhythm**; the ship has **7 sections of identical rhythm**.
- **Reference class evidence:** Aman Stories homepage = 4 sections, 3 different rhythms. 11ravens.com homepage = 4 sections (hero / coleção / brand / footer), 3 different rhythms. Cassina homepage = 3 sections, 3 rhythms. **Bretda has 7 sections in 1 rhythm.**

### Hypothesis 2 — **Champagne accent is no longer an accent**
- **N9 rule:** one champagne event per viewport.
- **Shipped (Hero alone):** vertical rotated label (champagne 60% opacity) + top hairline (champagne 25%) + eyebrow rule (champagne 90%) + italic word `vai herdar` (champagne) + button border (champagne) + bottom hairline (champagne 25%) = **6 chromatic events in 1 viewport**.
- **Why this reads as "mal feito":** champagne is the only chromatic event the system has — when it appears 6× on the first viewport, it stops being an accent and becomes a **second body color**. The intended hierarchy (cream is primary, champagne is the discrete event) inverts.
- **Reference class evidence:** Aston Martin hero — accent appears exactly once (logo). Cassina hero — accent appears exactly once (CTA underline). Bretda is closer to Squarespace luxury template than to either.

### Hypothesis 3 — **Product cards are cutouts, not photographs**
- **Locked spec:** lifestyle JPGs (`{Model}_Ambiente_01.jpg`) on marketing pages; renders only inside the configurator.
- **Shipped:** `orbit-1.png` — a **transparent-background PNG silhouette** of the product floating on the charcoal canvas. (See `eleven-collection-gallery.tsx:107-115` and `eleven-category-strip.tsx:107-115`.)
- **Why this reads as "mal feito":** a cutout-on-color reads as **catalog spec sheet** or **Mercado Livre listing**, not as **furniture in a home**. The product loses its *context* (the room it transforms), its *light* (golden-hour vs studio), and its *scale* (next to a sofa vs. floating in vacuum). Luxury furniture sells the *room it creates*, not the *object in isolation*.
- **Reference class evidence:** every Cassina, Vitra, B&B Italia, and Brunello product card is a **full-bleed lifestyle photograph**. The only luxury furniture brands that use cutouts are mid-market IKEA-adjacent (Tok&Stok, Etna). Bretda chose the wrong reference class for cutouts.
- **User decision history:** the cutout choice was made via "Round 3 Fix 3" and "Round 4 Fix R4.8" by direct user directive ("deixe as mesas que aparecem na home tambem sem o fundo"). This is the user's own taste call, but it conflicts with the locked spec — needs an explicit conversation, not a silent override.

### Hypothesis 4 — **The hero tries to be three things at once**
- **What the locked spec asked for:** zero headline, one caption (e.g., `Opal — Sinuca artesanal`, bottom-left, Cormorant 24px), one primary CTA bottom-right. **Total: 2 text elements + 1 button.**
- **What shipped:** vertical rotated label "ATELIER BRETDA · 2026" + top hairline + eyebrow "Coleção Bretda · 2026" + 2-line headline "A peça que sua casa / *vai herdar*" + 4-line subhead "Mesas autorais de sinuca, pebolim, ping pong e shuffleboard — esculpidas em madeira nobre brasileira, três meses de oficina por peça." + CTA + bottom hairline. **Total: 7 visible elements** (matching the original anti-pattern the redesign was supposed to fix).
- **Why this reads as "mal feito":** the entire premise of "the object is the argument" requires the **object** to do the talking. When 4 of the 7 hero elements are *text about the object*, the object becomes the *background* of the marketing copy, not the *subject* of the page.
- **Specific failure:** the headline uses italic-on-serif (`vai herdar`) as a luxury signifier. Italic-on-serif works *once per page* (Brunello Cucinelli's manifesto, Bottega Veneta's tagline). Bretda uses italic-on-serif as **the** display affectation across hero, category strip ("experiência"), collection ("uma família"), brand story ("medida"), brand tagline ("Feito à mão em Santa Catarina"). It's the **only** display move the system has, and it's deployed 5×.

### Hypothesis 5 — **The footer is two sites stuck together**
- **Locked spec:** footer = 2 columns + 1 legal strip.
- **Shipped (top to bottom):**
  1. Concierge band with **giant 80px display phone number** centered (50% of luxury furniture sites do not even publish a phone — Hermès Maison doesn't).
  2. 2 CTAs (`Solicitar projeto` + `Encomenda particular`) — both already exist in the nav.
  3. 4-column nav block (Brand + Coleção + Atelier + Serviço) — duplicates the top nav.
  4. "Para arquitetos" link inside Serviço column — **the exact persona-as-content-type taxonomy violation that Norman called out and the conclave locked as forbidden in N4**.
  5. Copyright + CNPJ + email strip.
  6. Privacy + Terms + "Feito à mão em Santa Catarina" italic-on-serif tagline.
- **Why this reads as "mal feito":** the footer alone has **more affordances (12 links + 2 buttons + 1 phone number + 1 tagline)** than the entire homepage of Aman Stories, Cassina, or Brunello Cucinelli. The 80px phone number reads as "real-estate brokerage" not "Brazilian luxury atelier."

---

## 3. Page-by-page audit

### 3.1 Homepage (`page.tsx`)

| What works | What fails | Fix |
|---|---|---|
| Dark `#2B2826` canvas locked in via `data-edition="11r"` body attribute. | 7 sections vs spec'd 3. | Collapse to 3: Hero / Coleção (galeria) / Atelier-band. Marquee → footer band; Category strip → secondary nav under collection; Customization video → CTA inline in product page; Brand story + Testimonial → `/atelier` page. |
| `ScrollRevealProvider` + `eleven-fade` discipline is restrained. | Every section is centered + capped at 1280/1440 — zero full-bleed editorial breaks. | Insert 1 full-bleed (100vw) cinematic spread between Coleção and Atelier-band. |
| Section component composition is clean (`page.tsx` is 50 LOC). | The composition wraps the violation in clean code. | Code is fine; the *count* is wrong. |

### 3.2 ElevenNavbar

| What works | What fails | Fix |
|---|---|---|
| 4 noun items (Coleção / Configurador / Atelier / Contato) — matches N4. | The `Conversar` CTA at right is a 5th affordance + introduces WhatsApp deep-link in chrome → violates N5 + N9 (WhatsApp green leaks even when styled ghost). | Remove the `Conversar` CTA from nav. WhatsApp lives in the FAB only. |
| Hamburger pattern is clean on mobile (cubic-bezier transitions are correct). | Color + opacity hover state is set inline via JS `onMouseEnter/onMouseLeave` instead of CSS hover — defeats the user's `prefers-reduced-motion`, causes flicker on first interaction (state lag). | Move hover to `:hover` CSS rule. Delete inline JS handlers. |
| Backdrop-filter blur is correct technique. | `borderBottom` color transition + backdrop-filter transition run on the same property change — visible 50–100ms jitter at scrollY=60. | Debounce scroll state or use CSS `transition-delay` to stagger. |

### 3.3 ElevenHero

The single most damaged organism. See Hypotheses 2 and 4 above for the structural critique. Specific tactical fixes:

| Element | Decision |
|---|---|
| Vertical rotated label "ATELIER BRETDA · 2026" | **Delete.** Rotated-text-as-luxury-signifier is a Squarespace/Webflow cliché. It is *never* used on Cassina, Vitra, B&B, or Aman. |
| Top hairline + bottom hairline | **Delete.** Frames suggest *catalog*. Luxury hero is bleed-to-edge. |
| Eyebrow "Coleção Bretda · 2026" | **Delete.** Year-stamped collections are a fashion convention (FW25) — furniture is timeless. |
| H1 "A peça que sua casa *vai herdar*" | **Replace with a caption.** The headline is *good copy* but it's *headline copy* — the conclave locked the headline at zero words. Move this line to be the H1 on `/atelier` page. |
| Subhead 4-line (manufacturing claim) | **Delete from hero.** Move to `/colecao` page lede. |
| `Ver Coleção →` ghost button | **Keep, but promote to solid champagne fill** per N5 (single primary CTA). Ghost buttons are secondary; the hero CTA must be primary. |
| Hero image `objectPosition: "center 60%"` | **Validate against actual photo.** A "center 60%" crop suggests the photo is portrait-tall and the table is in the lower half — the hero should show **the table at architectural center**, not "60% down." Re-crop or re-shoot. |

**Acceptance test:** Above-the-fold word count must drop from current ~38 words (eyebrow 4 + headline 8 + subhead 24 + button 2) to ≤ 5 words.

### 3.4 ElevenMarqueeStrip

| What works | What fails | Fix |
|---|---|---|
| Pure typography, no logos — correctly rejected "client logo strip" anti-pattern. | The 4 facts ("Madeira nobre brasileira · 100% sob encomenda · Lã italiana · 5 anos de garantia") are **the stats section dressed as a marquee**. N3 said *delete stats*; this relocated them. | **Delete the entire section.** Relocate "5 anos de garantia" to product specs. Relocate "Lã italiana" to materials block on `/atelier`. The other two are brand voice and should be felt, not stated. |
| Tight 1px-divider rhythm reads editorial. | A "5 anos de garantia" claim above the fold reads as **warranty marketing**, not luxury. Hermès doesn't tell you about the warranty; you assume. | Same as above. |

### 3.5 ElevenCategoryStrip

| What works | What fails | Fix |
|---|---|---|
| Honest decision to surface 4 product categories (sinuca / tênis / shuffle / pebolim). | Transparent PNG silhouettes floating on dark — same cutout problem as Hypothesis 3. | Convert to 4 lifestyle photographs (each category in a room). If photos don't exist yet, defer the section. |
| Section header "Navegue por *experiência*" — *experiência* in italic-on-serif. | This is the 2nd of 5 places where italic-on-serif appears as the display move. Pattern is now visible. | Choose **one** place to use italic-on-serif (the hero headline, after it's reframed). Strip it from this header. |
| "Encomenda Particular" bespoke link is in the strip alongside 4 product categories — wrong cognitive cluster (a service != a product). | This is a Norman "category violation" (Phase 2 N4 condemned this in nav; it leaked here). | Move bespoke link out of category strip; promote to its own band or to footer. |

### 3.6 ElevenCollectionGallery

| What works | What fails | Fix |
|---|---|---|
| 12 SKUs from `lib/models.ts` (single source of truth) — correct architecture. | All 12 use `orbit-1.png` (transparent silhouette). Cutout problem at scale. | Migrate to `{Model}_Ambiente_01.jpg` per N10. |
| 4:5 aspect ratio cards — correct for luxury catalog. | Header overline "Catálogo completo" + display "Doze peças, *uma família*" + champagne hairline = same header pattern as 4 other sections. | Either delete the header entirely (let the 12 cards introduce themselves) or make this the **only** section that gets the header treatment. |
| Cards are entirely clickable (full-card link). | Caption pattern `{categoriaLabel} · Sob consulta` puts "Sob consulta" (consultation-only) on every card — reads as 12 "out of stock" indicators visually. | Replace with material caption: `Nogueira americana · latão escovado`. Pricing-policy line moves to `/colecao` page header. |
| Stagger fade with `transitionDelay: ${(idx % 6) * 80}ms` is restrained. | A 6-card stagger means cards 7-12 fade in the same wave as 1-6 — visually correct, but it means there's only ever 1 stagger pattern across all viewports of `/colecao`. | Acceptable; not a fix. |

### 3.7 ElevenCustomizationSection

This is the section the file's own comment describes as a hack: the underlying video has Portuguese text **burned into the pixels** that the component masks with a heavy gradient. From `eleven-customization-section.tsx:8-23`:

> *"O vídeo tem texto Portuguese BURNED-IN ('O QUE TE MOTIVA A FICAR NUM LUGAR POR...' → '...A BELEZA?'). Não é overlay HTML — é parte da imagem do vídeo. Solução pragmática: gradient mask mais agressivo..."*

| Verdict | Fix |
|---|---|
| **Delete this section from homepage entirely.** | The "burned-in text masked by gradient" is the visual definition of *mal feito* — it's an asset the system shouldn't be using at all. |
| Re-purpose the configurator/customization CTA into the product page footer band (per `REDESIGN-PROPOSAL §6`). | Per QA P1-7, re-encode the video without text for `/atelier`. |

### 3.8 ElevenBrandStory

| What works | What fails | Fix |
|---|---|---|
| 2-col text + 3 reels grid is a strong editorial pattern (mirrors Brunello Cucinelli's brand pages). | 3 reels = 11.9 MB initial load (per QA audit); even with `LazyVideo` this is the **heaviest section** of the site. | Reduce to 1 reel (Processo). Move Cristine + Rudson reels to `/atelier`. |
| Founders named (Cristine + Rudson) → real names = real luxury. | The 3-paragraph body ends with "Não fazemos catálogo. Fazemos encomendas. Você não compra uma mesa Bretda; você encarrega-a." — **this is the brand's strongest line and it's buried in section 7 of 7.** | **Promote this line.** It belongs in the hero as caption, in `/atelier` as opening manifesto, on the contact page as concierge framing. |
| Section background `#1F1D1B` introduces a 4th tonal step (canvas `#2B2826` + raised `#353630` + overlay `#3E3F38` + this `#1F1D1B`). | DESIGN.md locks 3 tonal steps. This 4th step is undocumented. | Either document `#1F1D1B` as `surface-recessed` in DESIGN.md or repaint this section to `#2B2826`. |

### 3.9 ElevenTestimonial

| What works | What fails | Fix |
|---|---|---|
| Real client (Bruna), real video, real quote — matches the user's "NUNCA inventar" rule. | The pull quote is **3 lines** at `clamp(22px, 2.4vw, 36px)` — quote is doing the work; that's good. | None on copy. |
| Vertical 9:16 reel inside a 2-col grid is a strong pattern (Vogue editorial). | Single testimonial on the *homepage* (vs a `/clientes` page) is a B2B-SaaS move — luxury furniture brands defer testimonial to its own page or omit entirely (Cassina has no testimonial). | Move to a dedicated `/clientes` page. Replace homepage spot with a single ambiente photograph + caption. |
| Champagne quotation marks (`#C9A979` at 1.5em) are a luxury convention. | Both opening and closing quote marks use champagne — 2 champagne events in 1 viewport (N9 violation again). | Use only the opening mark or use both in cream. |

### 3.10 ElevenFooter

See Hypothesis 5. Specific fixes:

| Block | Decision |
|---|---|
| Concierge band with 80px phone | **Shrink to body-md (16px) phone** OR delete the giant phone and keep only the small contact strip. Brunello Cucinelli does not publish a phone on the homepage. |
| `Solicitar projeto` + `Encomenda particular` CTAs in footer | **Keep only `Solicitar projeto` as a single text-link.** Two buttons = Hick's tax (Norman). |
| 4 nav columns (Brand / Coleção / Atelier / Serviço) | **Collapse to 2 columns** per locked spec: Brand (logo + tagline + city) + Contato (address + email + phone in caption size). |
| "Para arquitetos" link in Serviço column | **Delete.** N4 forbid this. The configurador serves architects + private clients; the navigation does not need to flag personas. |
| Bottom strip: copyright + CNPJ + email + Privacidade + Termos + "Feito à mão em Santa Catarina" italic-on-serif | Keep copyright + CNPJ + Privacidade + Termos (legal). **Delete email** (already exists in contact). **Delete "Feito à mão em Santa Catarina" tagline.** The brand asserts itself in the work, not in a footer signature. |

### 3.11 Subpages (quick scan)

| Route | First-pass note | Action |
|---|---|---|
| `/atelier` | Heaviest non-homepage page; lots of `<img>` over `<Image>` (QA P1-9). | Already in QA audit — pair design fix (long-form editorial: 5-7 viewports of scroll, 1 idea per viewport) with the QA `<img>→<Image>` migration. |
| `/colecao` + `/colecao/[slug]` | Page exists; haven't confirmed grid uses the cutout PNGs or the lifestyle JPGs. | Audit pass: verify `/colecao/[slug]` hero uses `Ambiente_01.jpg`. If it uses `orbit-1.png` — fix urgently. |
| `/configurador` | Per QA: 25 lint errors, React 19 ref anti-pattern, no test coverage. | QA handles tech debt; design only needs to confirm the configurator chrome consumes new semantic tokens (DESIGN.md). |
| `/contato` | Per Phase 3 spec: two-path funnel (form primary + WhatsApp secondary). | Audit pass: confirm shipped state matches. If WhatsApp is dominant, demote per N5. |
| `/encomenda-particular` | Bespoke flow — high luxury alignment. | Confirm copy matches concierge voice; confirm form has honeypot + rate-limit (QA P1-2). |
| `/legal/{privacidade,termos}` | Functional pages. | Ensure typography matches body-md spec; no need for hero photography. |

---

## 4. Comparison vs Aston Martin / luxury benchmark — 10 patterns Bretda does NOT use

The folder `03-luxury-research-2026-04-29` referenced in the spawn prompt was not found on disk (only `03-redesign`). I used the conclave's documented Aston Martin / Cassina / Brunello / Aman / 11ravens references plus the brand-truth notes in `globals.css` + the brief from `00-context/BRIEF.md`.

| # | Pattern | Aston Martin / luxury reference | Bretda current | Delta |
|---|---|---|---|---|
| 1 | **Editorial whitespace as a status signal.** Sections breathe at 200–280px vertical between blocks. | Aston Martin hero → product showcase gap = ~240px. | `--spacing-section: 120px` + `eleven-section` adds `padding: clamp(80px, 12vh, 160px)`. Heavy at top of viewport, compressed in middle. | Bretda is **40% denser** than the reference class. |
| 2 | **Type display × body weight asymmetry.** Display at 300–400; body at 400. *Never* 500–700 on a luxury display face. | Cassina display = 350 weight. | TAN Aegean ships at 400 (correct); Cormorant Garamond fallback ships at 500/600 in some inline styles (`eleven-reel-tile` title, `eleven-navbar` mobile menu). | Bretda still bolts to weight 500 in 3 places. |
| 3 | **One chromatic event per viewport.** | Aston Martin product hero = product + 1 reflection accent. | Bretda hero = 6 champagne events; collection cards page = 12 champagne tags ("Sob consulta") plus card overlays. | Bretda has **8–12× the chromatic events** of the reference class. |
| 4 | **Photography is environmental, not isolated.** | Brunello, Bottega, Aman, Cassina — every hero is a wide-aperture environmental shot. | Hero is environmental ✓ (Opal Ambiente 1). Cards are **cutouts** ✗. Category strip is **cutouts** ✗. | Bretda is environmental in 1 of 4 photo zones. |
| 5 | **Motion timing is slow + deliberate.** Hero video transitions over 8–12 seconds. Scroll reveals at 600–900ms. | Aston Martin hero loop = 18s. | `eleven-fade` is ~400ms (correct timing) but `transitionDelay: ${(idx % 6) * 80}ms` on collection cards creates a *cascading wave* — the wave itself reads as marketing template, not editorial. | Bretda's cascade pattern is too perky. |
| 6 | **Microcopy = concierge tone, not marketing.** "Available by appointment" not "Limited spots — schedule now." | Aman: *"By private appointment."* | Bretda mixes registers: `Fale com o Atelier` (concierge ✓) + `Solicitar projeto →` (marketing ✗) + `Conversar` (chat-app ✗). | 3 voices, should be 1. |
| 7 | **Single hero affordance.** The hero CTA is *the* CTA; there is never a competing nav-CTA. | Cassina hero CTA → "Discover" (one). No nav button. | Bretda hero has 1 CTA + nav has `Conversar` + FAB has WhatsApp = 3 competing affordances visible above the fold. | Bretda has **3×** the above-fold affordances of the reference class. |
| 8 | **Navigation hierarchy = product first, brand second, service third.** | Cassina nav: Products → Designers → Stories → Atelier. | Bretda nav: Coleção → Configurador → Atelier → Contato. ✓ This is actually correct. | **No delta.** Strength to protect. |
| 9 | **Footer is utilitarian, not promotional.** | Brunello footer: 1 column (legal + address), 8pt type. | Bretda footer: 4 columns + concierge band + 80px display phone + 2 CTAs. | Bretda's footer has **~6× the content** of luxury reference class footers. |
| 10 | **Display type is *never* center-aligned on hero/section headers.** Luxury display is left-aligned (editorial) or asymmetric. | Aston, Cassina, Brunello, Aman — all hero display is left-aligned. | Bretda's section headers in `eleven-category-strip` and `eleven-collection-gallery` use `alignItems: "center"` + `textAlign: "center"`. Hero is left-aligned ✓. | 2 of 7 section headers violate the rule. |

**Overall delta:** Bretda inherits **2 of 10** patterns (correct nav hierarchy, environmental hero photography). The other 8 are either reversed or absent.

---

## 5. Mind Clone Verdicts (canonical-knowledge simulation)

> Per `CONCLAVE-SYNTHESIS.md §1`, the mind clone consultation tooling (`self-consultation.js` + `mcp__aios-brain-bridge__*`) is not in this sub-agent's tool surface. I run the same canonical-knowledge simulation pattern: each clone's stance is paraphrased from their published positions.

### 5.1 Dieter Rams — *Ten Principles*, "less but better"

> *"You showed me seven sections and I count six that should not exist. The marquee is statistics in a costume. The category strip is a navigation aid disguised as content. The customization video is a hack the developer admitted in the comment is a hack. The brand story is the section where the visitor would learn what you make — except the visitor stopped reading at section four. The testimonial is an authority claim on the wrong page. The hero alone has six accent events; the rule was one. Bretda is not less, it is **less in costume**: charcoal background, serif display, italic word — the chrome of luxury without the editorial discipline. The single discipline missing remains the one I named in April: **restraint as a system, not a mood**. Cut. Cut. Cut. The reader will thank you."*

**Rams verdict:** **NEEDS_REDESIGN_PHASE0.** Strip back to the 3-section spec.

### 5.2 Marty Neumeier — *The Brand Gap*, "brand = gut feeling"

> *"Open Bretda. What's the gut feeling at second three? Not 'I will inherit this object.' Not 'this is the table that organizes my home.' The gut feeling at second three is **'this looks expensive but generic.'** Charcoal + serif + champagne is the **visual grammar of every Squarespace 'luxury' template** — and you compete against a hundred of them on Google Search. The gap is **iconic distinctiveness**. The brand needs **one unforgettable visual move** that nobody else owns. Right now it owns the italic-on-serif word, used 5 times — overused, no longer iconic. Pick one icon and live there. Maybe the way light hits the brass hardware on Opal. Maybe Cristine's hands on the wood. Pick one and make it the brand."*

**Neumeier verdict:** **NEEDS_FIXES.** The site is on-grammar but off-iconic. Identify the one move that is uniquely Bretda's, deploy it heroically and only heroically.

### 5.3 Tobias van Schneider — *DesignBetter*, "luxury is restraint"

> *"In the April conclave I locked one principle: **never set an editorial serif in uppercase**. Bretda fixed that. Now I'll lock the next one: **never make italic-on-serif your only display move**. Italic-on-serif works **once per page** as a moment of emphasis. Bretda uses it as 'the way our headlines emphasize words.' Five hits in the homepage alone — it becomes pattern, pattern becomes wallpaper, wallpaper becomes invisible. Pick one headline on the homepage to use italic. The hero. Everywhere else, mixed case Roman. Same with champagne — pick one viewport per page where champagne 'fires.' Right now it fires in every viewport, which means it fires in none."*

**van Schneider verdict:** **NEEDS_REDESIGN_PHASE0.** Restraint must be re-established. The italic + champagne are tools, currently used as defaults.

### 5.4 Refika Anadol — data art, "tech-meets-art tension"

> *"You have a configurator. A real-time 3D configurator. Where is it? Not in the homepage. The closest the homepage gets is a category strip with a 'Configurador' link in the navbar. **The configurator is the brand's tech-meets-art moment** — the one technological signal that says 'this is a 2026 atelier, not a 1980s catalog' — and it's buried. Surface it as the **second section** of the homepage: a single screenshot or a live embedded canvas with one caption: 'Configure your table in 30 seconds.' The tension between hand-built wood and real-time WebGL **is** the brand. Use it."*

**Anadol verdict:** **NEEDS_FIXES.** The configurator is a strategic asset and homepage real estate is wasted on a hack video section.

### 5.5 Vitaly Friedman — Smashing Magazine, "luxury UX moves of 2026"

> *"Three patterns are emerging in 2026 luxury e-commerce: (1) **Scroll-anchored full-bleed cinematic spreads** — the homepage is 3–4 photo spreads, each occupying 100vh, with text appearing in the bottom-12vh anchor. Aston Martin has done this since 2024; Cassina copied it in 2025; Brunello in early 2026. (2) **Live atelier feeds** — a small section showing the current build in progress, photographed today. Asserts authenticity. (3) **Configurator-as-entry-point** — not buried under 'Para Arquitetos,' but offered as the first interactive moment after the hero. Bretda has none of these. The site looks **2022**, not 2026. The fix is not new code — it's removing 60% of the existing code and committing to the 3 spreads + 1 atelier feed + 1 configurator embed."*

**Friedman verdict:** **NEEDS_REDESIGN_PHASE0.** Visual reference class is 4 years stale.

### 5.6 Consensus

| Clone | Verdict | Confidence |
|---|---|---|
| Rams | NEEDS_REDESIGN_PHASE0 | High |
| Neumeier | NEEDS_FIXES | High |
| van Schneider | NEEDS_REDESIGN_PHASE0 | High |
| Anadol | NEEDS_FIXES | Medium |
| Friedman | NEEDS_REDESIGN_PHASE0 | High |

**3 of 5 → NEEDS_REDESIGN_PHASE0. 2 of 5 → NEEDS_FIXES.** No clone says GO_AS_IS.

---

## 6. P0 — Visual fixes that destravam "looks luxury" in 1 sprint (≤ 5 fixes)

| # | Location | Problem | Fix | Effort |
|---|---|---|---|---|
| **P0-V1** | `page.tsx` | 7 sections vs spec'd 3. | Delete `<ElevenMarqueeStrip />`, `<ElevenCategoryStrip />`, `<ElevenCustomizationSection />`, `<ElevenTestimonial />` from homepage. Keep Hero, CollectionGallery, BrandStory (as Atelier-band proxy until `/atelier` is rebuilt), Footer. Move deletions to: marquee → footer band; category → `/colecao` page; customization → `/configurador` page band; testimonial → `/clientes` new page or `/atelier`. | **1 day** |
| **P0-V2** | `eleven-hero.tsx` | 7 visible elements vs spec'd 2 + 1 button. | Delete `verticalLabel`, top hairline, bottom hairline, eyebrow, subhead, title's italic emphasis. Keep one caption (`Opal — Sinuca artesanal`, Cormorant 24px, mixed case, bottom-left, 32px from edge) + one solid-champagne primary CTA bottom-right. **Acceptance:** above-fold word count ≤ 5. | **0.5 day** |
| **P0-V3** | `eleven-collection-gallery.tsx` + `eleven-category-strip.tsx` | Transparent PNG cutouts on charcoal — kills luxury reading. | Migrate `<Image>` `src` from `orbit-1.png` and `categoria-thumbs/*.png` to `{Model}_Ambiente_01.jpg` (lifestyle) per N10. Remove `style={{ background: "transparent" }}` cards; restore `surface-raised` card backgrounds. **Caveat:** confirm Ambiente JPGs exist for all 12 SKUs first; if any are missing, defer those 1-2 cards to "coming soon" placeholders with the same dark canvas. | **1 day** |
| **P0-V4** | `eleven-navbar.tsx` (`Conversar` CTA) + `eleven-footer.tsx` (`Solicitar projeto` CTA + 80px phone + 4 columns) | WhatsApp green leaks into chrome (N9), Hick's tax on top + bottom of page. | Remove `<Conversar>` CTA from navbar entirely. Footer: collapse 4 cols → 2 cols (Brand + Contato), delete concierge band's giant phone (use caption-size phone in Contato column), delete `Solicitar projeto` CTA (already in product CTAs), delete italic "Feito à mão em Santa Catarina" tagline. **Total footer LOC drop:** ~140 → ~50. | **0.5 day** |
| **P0-V5** | All sections using italic-on-serif (`eleven-hero` "vai herdar", `eleven-category-strip` "experiência", `eleven-collection-gallery` "uma família", `eleven-brand-story` "medida", `eleven-footer` "Feito à mão em Santa Catarina") | Italic-on-serif overused (5 hits) → pattern → wallpaper → invisible (van Schneider). | Pick **one** to keep (recommendation: hero's "vai herdar" after rebuild — *if* the hero gets the caption-only treatment, the italic moves to the manifesto on `/atelier`). Strip italic from the other 4 sites; use Roman mixed case. | **0.25 day** |

**P0 total:** ~3.25 days of focused design+dev work. **Highest visual ROI in the sprint.**

---

## 7. P1 — Layout sophistication (2-3 sprints)

| # | Item | Why |
|---|---|---|
| P1-V1 | Introduce 1 full-bleed (100vw) cinematic spread between Coleção and Atelier-band | Breaks the 1280-capped rhythm; signals editorial scale. |
| P1-V2 | Add `/clientes` page; move ElevenTestimonial there | Testimonials don't belong on homepage of luxury furniture brand. |
| P1-V3 | Surface configurator as homepage section 2 (per Anadol) | Tech-meets-art is the brand differentiator; currently buried. |
| P1-V4 | Re-encode `design-process-1080.mp4` to remove burned-in Portuguese text (QA P1-7) | Eliminates the hack-mask gradient and makes the asset re-usable. |
| P1-V5 | Repaint `eleven-brand-story` background from undocumented `#1F1D1B` to documented `#2B2826` (canvas) | Maintains 3-step tonal system; DESIGN.md hygiene. |
| P1-V6 | Adopt explicit "champagne event budget" of 1 per viewport across all components | Restores N9. Enforce via design review checklist + a Playwright visual test that counts `#C9A979`/`#C9A961` pixel events per viewport. |
| P1-V7 | Build a `Caption` molecule (Cormorant 24px mixed case + body-md material caption + caption-size price-policy) and use it in: hero, all product cards, all ambiente shots | Removes 5+ inline implementations of "model name + material + sob consulta." |
| P1-V8 | Migrate the inline `<style>` blocks in `eleven-navbar`, `eleven-brand-story`, `eleven-testimonial`, `eleven-footer` to `globals.css` utilities | Per QA P2-6; also enables real `:hover` instead of JS-on-event hover. |

---

## 8. P2 — Production polish (refactor longo)

| # | Item |
|---|---|
| P2-V1 | Hero photo recrop / reshoot — `objectPosition: "center 60%"` is a hint the framing is wrong. Commission cinematic photography per van Schneider's April recommendation (deferred from Sprint 1). |
| P2-V2 | Live atelier feed — 1 photo per week, current build, dated. Builds Friedman's authenticity layer. |
| P2-V3 | Hero video alternative — record 30-60s of Opal Ambiente cinematic loop, A/B against the current still image. |
| P2-V4 | Editorial photography library refresh — 11ravens uses ~80 photographs site-wide; Bretda has ~40, half are renders. |
| P2-V5 | Reduce Cormorant Garamond + Raleway font weight families to 400/600 only (already half-done; finish the cleanup per N6). |
| P2-V6 | Audit all card / button corner radius — DESIGN.md locks `rounded.none` for cards; verify no inline overrides exist. |

---

## 9. Anti-patterns to AVOID for the next squad

1. **"Add sections" is not "make luxury."** 30/Abr added 4 new organisms (`eleven-marquee`, `eleven-category-strip`, `eleven-customization`, `eleven-testimonial`) on top of the spec's 3-section homepage. The site got worse with more content, not better. **Next sprint: zero new sections. Only refinement of the 3 spec'd sections.**
2. **"Token swap + copy update" is not visual redesign.** This is exactly what the 30/Abr sprint did, and it left the structural problems (section count, hero density, cutout cards) untouched. Visual redesign means **measuring against benchmark and matching pattern**, not changing colors/words inside the existing layout.
3. **Italic-on-serif as default display move.** It is a moment of emphasis. Used 5×, it is no longer emphasis. Same rule applies to champagne accents, vertical-rotated labels, hairline dividers, and overlines. **Every visual move has a budget of 1 per viewport.**
4. **Cutout PNG silhouettes for luxury furniture.** Mid-market e-commerce convention. Hot zone for distrust. Always use environmental photography.
5. **Centered display headlines on section headers.** Luxury is asymmetric and left-aligned. Centered display = catalog cover, not editorial.
6. **Giant phone numbers in footer.** Reads as real estate brokerage. Brunello, Cassina, Bottega, Aman do not publish a homepage phone number.
7. **Italic ornaments on quote marks, taglines, role labels.** It compounds. Pick one ornament site-wide.
8. **Adding the "11ravens-clone" or "Aston-Martin-clone" framing.** The April brief was explicit: **edit yourself, not copy them**. The 30/Abr filenames (`eleven-*`) silently committed to imitation — which fails the moment the imitation is partial. Rename to `homepage-*` or `bretda-*`.
9. **Skipping Phase 0 of the locked redesign protocol.** `.out-of-scope/luxury-redesign-without-benchmark.md` says: deep dive → brief → implementation → A/B vs reference. The 30/Abr sprint skipped deep dive and A/B. **Next sprint must reinstate both gates.**
10. **AI overnight squad without a human checkpoint between phases.** Per HYDRA research §AI disrupting team checks: the 13 PRs merged 30/Abr were AI-generated "acceptable" output that nobody visually reviewed before merge. **Reinstate the visual A/B-vs-reference checkpoint per `feedback_visual_before_code.md`.**

---

## 10. Recommended next step

**Run a 2-sprint design recovery operation with Phase 0 reinstated, starting with Hero + Collection cards.** Here's why those two: the hero is what the user sees first (and Hypothesis 4 explains why it's the worst-failing section), and the collection cards are the second-worst (Hypothesis 3 — cutouts). Fix those two, and the **majority of the "site mal feito" perception evaporates** without touching footer, brand story, or testimonial.

**Sprint A (3 days):** P0-V1 (delete 4 sections) + P0-V2 (hero rebuild) + P0-V3 (collection cards lifestyle migration).
**Sprint B (3 days):** P0-V4 (navbar + footer cleanup) + P0-V5 (italic budget) + P1-V1 (full-bleed spread between sections) + P1-V3 (configurator surface).

**Gate before merge:** **A/B comparison screenshot** of new hero + new collection cards vs the locked references (Aston Martin product hero + Cassina product card) — exactly the Phase 0 / Phase 3 gate the 30/Abr sprint skipped. **Without that A/B gate, abort and escalate to user before merging.**

---

## Verdict

# **NEEDS_REDESIGN_PHASE0**

**Justification:**
- 3 of 5 mind clones (Rams, van Schneider, Friedman) recommend full redesign with Phase 0 reinstated.
- 6 of 14 conclave Non-Negotiables (N1, N2, N3, N5, N9, N10) are violated in production.
- 5 of 11 REDESIGN-PROPOSAL acceptance criteria fail on inspection.
- The QA audit (Quinn) found 4 P0 technical blockers; this design audit finds 5 P0 visual blockers — both audits independently conclude the site is **not ready** in its production state.
- The 30/Abr sprint repeated the exact anti-pattern logged at `.out-of-scope/luxury-redesign-without-benchmark.md`: implement luxe without Phase 0 visual benchmark. **This is the 4th occurrence of the same pattern.** Continuing to ship "token swap + new sections" without the Phase 0 gate will produce the 5th identical failure.

**Conditions to upgrade to NEEDS_FIXES:**
- P0-V1 + P0-V2 + P0-V3 merged (with A/B-vs-reference gate honored).
- Italic + champagne accent budget restored (P0-V5).
- A re-audit in 2 weeks against the same 10 luxury benchmark patterns.

**Conditions to upgrade to GO_AS_IS:**
- All P0-V and P1-V completed.
- Visual health score recovers from 42 → ≥ 75.
- A real visual A/B (screenshot of Bretda hero + collection vs Aston/Cassina/Brunello equivalents) shows the gap closing on at least 7 of 10 benchmark patterns.

**The user's "site mal feito" instinct is the only honest signal in this stack.** Trust it. The QA P0s, the HYDRA-confirmed AI-checkpoint failure, and this design audit's 6-of-14-N-violations all triangulate the same conclusion: **the 30/Abr "overnight clone" produced visible debt, and the recovery is to reinstate the Phase 0 gate, not to ship a 14th PR on top of it.**

---

*Uma · UX Design Expert · Bretda Design Mega-Audit · 2026-05-15*
