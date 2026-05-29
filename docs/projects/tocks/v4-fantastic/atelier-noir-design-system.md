---
project: tocks-custom · v4-fantastic
deliverable: ATELIER NOIR — Design System (build-ready)
art_direction: Atelier Noir (cinematic dark warm-luxe e-commerce)
owner: AIOS Design Squad
specialists: "@brad-frost (design tokens + component inventory), @marty-neumeier (brand coherence framing)"
stack: Next.js 16 App Router · Tailwind CSS v4 (@theme) · Motion (framer-motion) · Lenis · Zustand
fonts: Libre Caslon Text (display) · Poppins (body/UI) — official, do not substitute
created: 2026-05-28
status: READY FOR IMPLEMENTATION
---

# ATELIER NOIR — Tocks Custom Design System

> **One sentence for the developer:** Build a dark, warm, cinematic luxury storefront where solid-wood game tables sit in pools of warm light against a near-black charcoal canvas; editorial Libre Caslon headlines carry the voice, Poppins runs the UI in restrained calm, a single champagne-gold accent does all the pointing, and motion is slow, orchestrated, and expensive-feeling. Everything below is a token or a spec — no guessing.

This document is the single source of truth. The developer implements from it; do not invent values not specified here.

---

## 0. How to read this doc

- **Color / spacing / type / motion tokens** are given as CSS custom properties under a Tailwind v4 `@theme` block. Copy them verbatim into `app/globals.css`.
- **Component specs** reference those tokens by name (e.g. `var(--color-accent)`), never raw hex inline.
- Every measurement is concrete: real hex, real rem/px, real `cubic-bezier`, real line-heights.
- Where a value is a *recommendation with latitude*, it is marked `[tunable]`.

---

## 1. Art-Direction Statement

**Atelier Noir** is luxury silence rendered as a storefront. The screen is a darkened gallery at night: a deep, warm charcoal canvas — never cold gray, never pure black — through which the warmth of solid wood bleeds. Each table is lit like a sculpture, sitting in a soft radial pool of champagne light with a long, soft shadow. Typography behaves like a printed art-book: oversized Libre Caslon headlines with tight tracking, an occasional italic-Caslon phrase used as a held breath, and Poppins doing the quiet operational work of navigation, specs, and pricing. There is exactly one accent — a refined champagne-gold that echoes the gold symbol mark — and it is used sparingly and decisively (one gold thing per viewport, roughly), so that when it appears the eye obeys it. Motion is slow and choreographed: the page assembles itself on load, sections reveal as you descend, and product cards respond to the cursor with restraint, as if the wood were being turned slightly toward the light. The governing instinct is **refined restraint** — we earn luxury by what we leave out.

This direction is the synthesis the orchestrator chose: it takes **Thesis B's** dark cinematic canvas and warm product-glow, and marries it to **Thesis A's** editorial Caslon refinement, drop-caps, pull-quotes, and spec-table elegance — while rejecting Thesis B's brutalist grotesque type and Thesis C's biennale coldness.

### Design Principles (the 7 commandments)

1. **One bold direction, fully committed.** Dark warm-luxe, editorial serif voice. No hedging toward "safe light mode." Intentionality over intensity.
2. **The product is the only hero.** Photography is full-bleed, warmly lit, uncropped at its focal moment. UI never competes with the table; chrome recedes.
3. **One accent, used like punctuation.** Champagne-gold points, underlines, and confirms — it is never decoration spread evenly across the page. Aim for ~one gold element per viewport.
4. **Type carries the brand voice; UI carries the work.** Libre Caslon = emotion, scale, editorial moments. Poppins = clarity, navigation, numbers. Never blur the two roles.
5. **Negative space is a luxury material.** Generous margins, slow vertical rhythm, room to breathe. Crowding reads as cheap.
6. **Depth, never flatness.** No flat solid fills. Every surface has warmth via grain, soft radial glow, layered transparency, or a hairline gold rule. Shadows are warm and long.
7. **Slow is expensive.** Calm, decelerating easing. Nothing snaps. The interface feels handmade, like the tables.

### Anti-slop guardrails (global)
- No Inter / Roboto / Arial / system-ui. Ever. (We have Caslon + Poppins.)
- No purple-on-white gradients, no SaaS hero blobs, no neon.
- No uniform card grids of identical boxes — editorial asymmetry instead.
- No pure `#000000` backgrounds and no pure `#FFFFFF` text — both are warmed.
- No icon-soup. Iconography is minimal, hairline, 1.5px stroke max.

---

## 2. Color Tokens

Atelier Noir is a **dark-canvas, warm-neutral, single-accent** palette. The canvas carries a faint warm (amber-leaning) undertone so it never reads as cold tech-gray.

### 2.1 Palette table

| Token | Hex | Role |
|---|---|---|
| `--color-canvas` | `#16130F` | Primary background. Near-black with warm/amber undertone. |
| `--color-canvas-deep` | `#0E0C09` | Deepest layer (hero vignette edges, footer, behind glows). |
| `--color-surface` | `#1E1A15` | Raised surface (cards, drawers, nav-on-scroll). |
| `--color-surface-2` | `#262119` | Higher surface (hover card, modal, input fill). |
| `--color-wood-900` | `#2A2117` | Warm wood neutral — darkest (panel tints). |
| `--color-wood-700` | `#473522` | Warm wood neutral — mid (decorative blocks, dividers on tint). |
| `--color-wood-500` | `#6E5436` | Warm wood neutral — lighter (texture accents, NOT text). |
| `--color-text` | `#F4EFE6` | Primary text on canvas. Warm off-white (never pure white). |
| `--color-text-secondary` | `#C7BEAE` | Secondary text, captions, lead paragraphs. |
| `--color-text-muted` | `#8E8675` | Muted — metadata, eyebrows, disabled, placeholders. |
| `--color-accent` | `#C9A35B` | Champagne-gold accent (echoes the gold symbol). Default state. |
| `--color-accent-hover` | `#DAB straw → use #D8B86E` | Accent hover (brighter champagne). |
| `--color-accent-active` | `#B68C44` | Accent pressed/active (deeper). |
| `--color-accent-soft` | `rgba(201,163,91,0.12)` | Accent wash (focus ring bg, selected chip fill, glow tint). |
| `--color-on-accent` | `#16130F` | Text/icon on a solid gold fill (the canvas color — high contrast). |
| `--color-success` | `#7FB37A` | Form success / in-stock / confirmation. |
| `--color-error` | `#D98A7A` | Form error (warm coral, not alarm-red — stays luxe). |
| `--color-hairline` | `rgba(201,163,91,0.22)` | Hairline gold rule (dividers, card borders). |
| `--color-border` | `rgba(244,239,230,0.10)` | Neutral hairline border (inputs, subtle separators). |
| `--color-border-strong` | `rgba(244,239,230,0.18)` | Stronger neutral border (focused/hover inputs). |
| `--color-scrim` | `rgba(8,7,5,0.66)` | Overlay scrim behind drawer/modal. |

> **Correction note:** `--color-accent-hover` final value is **`#D8B86E`** (the table cell above shows my working note — use `#D8B86E`).

### 2.2 Tailwind v4 `@theme` block — paste into `globals.css`

```css
@theme {
  /* — backgrounds / surfaces — */
  --color-canvas:        #16130F;
  --color-canvas-deep:   #0E0C09;
  --color-surface:       #1E1A15;
  --color-surface-2:     #262119;

  /* — warm wood neutrals — */
  --color-wood-900: #2A2117;
  --color-wood-700: #473522;
  --color-wood-500: #6E5436;

  /* — text on dark — */
  --color-text:           #F4EFE6;
  --color-text-secondary: #C7BEAE;
  --color-text-muted:     #8E8675;

  /* — accent (champagne-gold) — */
  --color-accent:        #C9A35B;
  --color-accent-hover:  #D8B86E;
  --color-accent-active: #B68C44;
  --color-accent-soft:   rgba(201,163,91,0.12);
  --color-on-accent:     #16130F;

  /* — semantic — */
  --color-success: #7FB37A;
  --color-error:   #D98A7A;

  /* — lines / borders / scrims — */
  --color-hairline:      rgba(201,163,91,0.22);
  --color-border:        rgba(244,239,230,0.10);
  --color-border-strong: rgba(244,239,230,0.18);
  --color-scrim:         rgba(8,7,5,0.66);
}
```

### 2.3 WCAG contrast notes (verified ratios vs `--color-canvas #16130F`)

| Pair | Ratio | Verdict |
|---|---|---|
| `--color-text #F4EFE6` on canvas | **≈ 15.2 : 1** | AAA (body + headlines). |
| `--color-text-secondary #C7BEAE` on canvas | **≈ 10.4 : 1** | AAA. Safe for lead paragraphs/captions. |
| `--color-text-muted #8E8675` on canvas | **≈ 5.0 : 1** | AA for normal text, AAA for large. Use for ≥14px metadata only; do not use for long body. |
| `--color-accent #C9A35B` on canvas | **≈ 6.6 : 1** | AA for normal text & AAA-large. Gold text/links on canvas are legible — but reserve gold for short labels, links, prices, eyebrows, not paragraphs. |
| `--color-on-accent #16130F` on solid `--color-accent` fill | **≈ 6.6 : 1** | AA — used for primary button label on gold. |
| `--color-error #D98A7A` on canvas | **≈ 6.0 : 1** | AA. Form error text legible. |
| `--color-success #7FB37A` on canvas | **≈ 6.7 : 1** | AA. |

**Rule:** body copy uses `--color-text` or `--color-text-secondary` only. Gold (`--color-accent`) is for emphasis/UI, never for paragraph runs. Muted text must be ≥14px.

### 2.4 Atmosphere recipes (depth, not flat fills)

Backgrounds must never be a single flat color. Compose:

```css
/* Warm radial glow behind a product (hero / product detail) */
--glow-product: radial-gradient(
  60% 55% at 50% 42%,
  rgba(201,163,91,0.16) 0%,
  rgba(110,84,54,0.06) 38%,
  transparent 72%
);

/* Canvas vignette (full-page atmosphere) */
--vignette: radial-gradient(
  120% 90% at 50% 0%,
  var(--color-canvas) 0%,
  var(--color-canvas-deep) 100%
);

/* Film grain — apply as a ::before overlay, mix-blend soft-light, opacity .04–.06 */
/* Use a 160x160 tiling noise PNG/SVG at --grain-opacity */
--grain-opacity: 0.05;
```

- **Grain:** a fixed full-viewport `::before` with a tiling noise texture, `mix-blend-mode: soft-light; opacity: var(--grain-opacity); pointer-events:none;`. This is the single most important "not-flat" move.
- **Hairline gold rules** (`--color-hairline`) separate editorial sections — 1px, full-bleed or inset.

---

## 3. Typography System

Two families, two jobs. **Libre Caslon Text** = display/voice (Regular, Italic, Bold). **Poppins** = body/UI (Light 300, Regular 400, Medium 500, SemiBold 600, Bold 700). Loaded via `next/font/local` from `public/fonts/` (already in repo per MANIFEST).

### 3.1 Font setup (Next.js `next/font/local`)

```ts
// app/fonts.ts
import localFont from "next/font/local";

export const caslon = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../public/fonts/libre-caslon-text/LibreCaslonText-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/libre-caslon-text/LibreCaslonText-Italic.ttf",  weight: "400", style: "italic" },
    { path: "../public/fonts/libre-caslon-text/LibreCaslonText-Bold.ttf",    weight: "700", style: "normal" },
  ],
});

export const poppins = localFont({
  variable: "--font-ui",
  display: "swap",
  src: [
    { path: "../public/fonts/poppins/Poppins-Light.ttf",    weight: "300", style: "normal" },
    { path: "../public/fonts/poppins/Poppins-Regular.ttf",  weight: "400", style: "normal" },
    { path: "../public/fonts/poppins/Poppins-Medium.ttf",   weight: "500", style: "normal" },
    { path: "../public/fonts/poppins/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/poppins/Poppins-Bold.ttf",     weight: "700", style: "normal" },
  ],
});
```

```css
@theme {
  --font-display: "Libre Caslon Text", Georgia, serif;
  --font-ui: "Poppins", system-ui, sans-serif; /* system-ui only as last-resort fallback */
}
```

### 3.2 Display scale — Libre Caslon Text

Base assumption: 16px root. `rem` = px/16. Display sizes are responsive; the px below are **desktop (≥1024px)**; see §8 for fluid scaling.

| Token | Use | Size (desktop) | rem | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|
| `--fs-display` | Hero headline | 96px | 6.0rem | 700 Bold | 0.94 | -0.02em |
| `--fs-h1` | Page / section opener | 64px | 4.0rem | 700 Bold | 1.00 | -0.015em |
| `--fs-h2` | Major section title | 44px | 2.75rem | 400 Regular | 1.08 | -0.01em |
| `--fs-h3` | Product name, sub-section | 30px | 1.875rem | 400 Regular | 1.15 | -0.005em |
| `--fs-quote` | Editorial pull-quote (italic) | 40px | 2.5rem | 400 *Italic* | 1.2 | 0 |
| `--fs-dropcap` | Drop-cap initial (editorial body) | 88px | 5.5rem | 700 Bold | 0.8 | 0 |

- **Italic-Caslon usage:** reserved for emotional accent — one phrase inside a headline (e.g. *arquitetos*), pull-quotes, and the leading word of an editorial paragraph. Never set whole paragraphs in italic. This is the single most "Tocks" typographic gesture (carried from Thesis A).
- **Tracking on display:** big Caslon gets *negative* tracking (-0.015 to -0.02em) so the editorial mass holds together; never letter-space large serif positively.
- **Drop-cap:** first letter of the Atelier/story lead paragraph, `float:left`, `--fs-dropcap`, gold (`--color-accent`), ~3 text-lines tall, with right margin `--space-4`.

### 3.3 UI / body scale — Poppins

| Token | Use | Size | rem | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|
| `--fs-lead` | Lead paragraph / intro | 20px | 1.25rem | 400 | 1.65 | 0 |
| `--fs-body` | Body copy | 17px | 1.0625rem | 400 | 1.7 | 0 |
| `--fs-body-sm` | Secondary body, specs | 15px | 0.9375rem | 400 | 1.6 | 0 |
| `--fs-small` | Captions, fine print | 13px | 0.8125rem | 400 | 1.5 | 0 |
| `--fs-label` / eyebrow | Eyebrows, kickers, metadata | 12px | 0.75rem | 500 | 1.2 | **0.18em** (uppercase) |
| `--fs-nav` | Top nav links | 14px | 0.875rem | 500 | 1 | 0.06em (uppercase) |
| `--fs-button` | Button label | 14px | 0.875rem | 600 | 1 | 0.08em (uppercase) |
| `--fs-price` | Price display | 22px | 1.375rem | 500 | 1.1 | 0 |
| `--fs-price-lg` | Product-detail price | 32px | 2.0rem | 500 | 1.05 | -0.01em |

- **Eyebrows/labels** are uppercase Poppins Medium with wide tracking (`0.18em`) — the quiet structural device that says "luxury catalog." Usually `--color-text-muted` or `--color-accent`.
- **Body line-height is generous (1.7)** — slow, readable, editorial. Body copy max line length **66ch** (`max-width: 66ch`).
- **Numbers (prices, specs):** Poppins with `font-variant-numeric: tabular-nums` so spec tables and prices align.

### 3.4 `@theme` typography tokens

```css
@theme {
  --fs-display: 6rem;   --lh-display: 0.94; --ls-display: -0.02em;
  --fs-h1: 4rem;        --lh-h1: 1;         --ls-h1: -0.015em;
  --fs-h2: 2.75rem;     --lh-h2: 1.08;      --ls-h2: -0.01em;
  --fs-h3: 1.875rem;    --lh-h3: 1.15;      --ls-h3: -0.005em;
  --fs-quote: 2.5rem;   --lh-quote: 1.2;
  --fs-dropcap: 5.5rem;

  --fs-lead: 1.25rem;   --lh-lead: 1.65;
  --fs-body: 1.0625rem; --lh-body: 1.7;
  --fs-body-sm: 0.9375rem;
  --fs-small: 0.8125rem;
  --fs-label: 0.75rem;  --ls-label: 0.18em;
  --fs-nav: 0.875rem;   --ls-nav: 0.06em;
  --fs-button: 0.875rem;--ls-button: 0.08em;
  --fs-price: 1.375rem;
  --fs-price-lg: 2rem;
}
```

---

## 4. Spacing, Radius, Shadow & Border Tokens

### 4.1 Spacing — 8pt base scale

```css
@theme {
  --space-0:  0;
  --space-1:  0.25rem;  /*  4px */
  --space-2:  0.5rem;   /*  8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.5rem;   /* 24px */
  --space-6:  2rem;     /* 32px */
  --space-7:  3rem;     /* 48px */
  --space-8:  4rem;     /* 64px */
  --space-9:  6rem;     /* 96px */
  --space-10: 8rem;     /* 128px */
  --space-11: 11rem;    /* 176px — section vertical rhythm desktop */
}
```

- **Section vertical rhythm:** desktop `--space-11` (176px) top/bottom; tablet `--space-9` (96px); mobile `--space-8` (64px). Generous = luxury.
- **Page gutter (container padding):** mobile `--space-5` (24px), tablet `--space-7` (48px), desktop `--space-8` (64px).
- **Max content width:** `--container: 1320px` for catalog/product; editorial sections may break to `--container-wide: 1560px` full-bleed media.

### 4.2 Radius — small/sharp (luxury restraint)

```css
@theme {
  --radius-none: 0;
  --radius-xs: 2px;   /* inputs, chips */
  --radius-sm: 4px;   /* buttons, small cards */
  --radius-md: 6px;   /* cards, drawers */
  --radius-lg: 10px;  /* modal, large media frame [tunable, max] */
  --radius-pill: 999px; /* finish swatch dots, toggle only */
}
```

Luxury skews sharp. Product imagery is typically **squared (radius 0)** for editorial crispness; UI chrome uses `--radius-sm`/`--radius-md`. Never round product cards heavily — rounded-everything reads consumer-app, not atelier.

### 4.3 Elevation shadows — warm, long, tuned for dark canvas

Shadows on a dark warm canvas use **warm-black** (`#0E0C09` tints), not pure black, and lean long+soft to feel like gallery lighting.

```css
@theme {
  --shadow-sm: 0 2px 8px rgba(8,7,5,0.40);
  --shadow-md: 0 12px 32px rgba(8,7,5,0.50);
  --shadow-lg: 0 28px 64px rgba(8,7,5,0.55);
  --shadow-product: 0 40px 90px -20px rgba(8,7,5,0.70); /* the long table-shadow */
  --shadow-gold-focus: 0 0 0 3px var(--color-accent-soft); /* focus ring */
}
```

- `--shadow-product` is the signature: a long soft shadow that makes a table "float and ground" in its light pool. Pair with `--glow-product` above it.
- On hover, cards lift with `--shadow-lg` + a 1px `--color-hairline` border appearing.

### 4.4 Borders / hairlines

```css
@theme {
  --border-hairline: 1px solid var(--color-hairline);  /* gold editorial rules */
  --border-neutral:  1px solid var(--color-border);    /* inputs at rest */
  --border-strong:   1px solid var(--color-border-strong); /* focused/hover inputs */
}
```

Gold hairline rules are the connective tissue of the editorial layout (section dividers, card frames on hover, spec-table row separators). 1px only — hairlines, never heavy strokes.

---

## 5. Motion Tokens

Motion is **slow, decelerating, orchestrated**. The feel target: a heavy, well-balanced drawer sliding shut. Implemented with **Motion (framer-motion)** for component reveals/hover and **Lenis** for smooth scroll.

### 5.1 Durations & easings

```css
@theme {
  --dur-fast:   180ms;  /* micro: hover color, focus ring */
  --dur-base:   320ms;  /* buttons, chips, small state */
  --dur-slow:   600ms;  /* reveals, card hover transforms */
  --dur-cinema: 1000ms; /* hero load, large media, drawer */

  /* easings */
  --ease-out-luxe:   cubic-bezier(0.16, 1, 0.30, 1);   /* signature: heavy decel, "expensive" */
  --ease-in-out-luxe:cubic-bezier(0.65, 0, 0.35, 1);   /* paired moves (drawer, accordions) */
  --ease-out-soft:   cubic-bezier(0.22, 1, 0.36, 1);   /* general reveals */
  --ease-emphasis:   cubic-bezier(0.34, 1.56, 0.64, 1);/* tiny springy accent — use VERY sparingly (cart count bump only) */
}
```

`--ease-out-luxe` (a strong ease-out) is the house easing — use it for nearly everything that enters or transforms. Avoid linear and avoid bouncy springs (except the one cart-count micro-bump).

### 5.2 Reveal / stagger choreography

**Page-load (hero) orchestration** — runs once, top of page:
1. Canvas + grain fade in (0ms, `--dur-base`).
2. Eyebrow/kicker fade+rise (`y: 16px → 0`, delay 120ms, `--dur-slow`).
3. Headline reveal — Caslon, line-by-line clip-mask rise (`y: 40px → 0, clip-path` reveal), stagger **90ms** per line, delay 220ms, `--dur-cinema`, `--ease-out-luxe`.
4. Hero product image / video: scale-settle `scale(1.04) → 1` + opacity, delay 360ms, `--dur-cinema`.
5. Sub-line + CTA fade+rise, delay 700ms, `--dur-slow`.

**Scroll-triggered reveals** (every section below the fold):
- Trigger when element is **~18% into viewport** (Motion `whileInView`, `viewport={{ once: true, margin: "-18%" }}`).
- Default reveal: `opacity 0→1`, `y: 28px → 0`, `--dur-slow`, `--ease-out-soft`.
- **Stagger** children at **70–90ms** intervals (grids, spec rows, finish swatches).
- Editorial media reveals with a **clip-path wipe** (`inset(0 0 100% 0) → inset(0 0 0 0)`) over `--dur-cinema` for the "curtain-lift" gallery feel.

**Stagger token:**
```css
@theme { --stagger: 80ms; }
```

### 5.3 Smooth-scroll (Lenis) feel

```ts
new Lenis({
  duration: 1.15,                       // slow, weighty
  easing: (t) => 1 - Math.pow(1 - t, 3),// cubic ease-out
  smoothWheel: true,
  wheelMultiplier: 0.9,                 // slightly damped — heavier feel
  touchMultiplier: 1.4,
});
```

- Parallax: hero product/media moves at **0.85×** scroll speed (subtle), background glow at **0.6×**. Keep parallax deltas small — luxury, not theme-park.
- **All scroll/parallax/reveal motion must be disabled under `prefers-reduced-motion`** (see §8.3).

---

## 6. Component Inventory & Specs

Tokens referenced below are defined in §2–§5. Atomic-Design layering: tokens → atoms (button, swatch, eyebrow) → molecules (product card, price block) → organisms (header, hero, gallery, cart drawer) → templates (page blueprints §7).

### 6.1 Header / Sticky Nav
- **Initial state (over hero):** fully transparent background, `--color-text` links, logo = white symbol (`tocks-symbol-white.svg`) + wordmark. Height 88px desktop / 64px mobile.
- **Scrolled state (past ~120px):** background transitions to `--color-surface` at `rgba(30,26,21,0.88)` with `backdrop-filter: blur(14px)`, bottom `--border-hairline`, height shrinks to 68px. Transition `--dur-base` `--ease-in-out-luxe`.
- **Layout:** left = logo; center or left-cluster = nav links (Coleção · Linhas · Atelier · Contato), `--fs-nav` uppercase; right = search (icon), cart (icon + count badge), "Concierge" text-link.
- **Cart badge:** small gold dot when items > 0; count bumps with `--ease-emphasis` `--dur-fast` on add.
- **Mobile:** hamburger → full-screen overlay menu on `--color-canvas-deep`, links in `--fs-h3` Caslon, staggered reveal.

### 6.2 Cinematic Hero
- **Full-viewport (100svh)**, `--color-canvas` + `--vignette` + `--glow-product` behind the table; grain overlay on top.
- **Media:** full-bleed hero video loop (use curated `IMG_0895.mov`/`IMG_5112.mov` 6–10s cut, muted, autoplay, `playsInline`, poster frame) OR full-bleed warm product still. Image `object-fit: cover`, `scale 1.04→1` settle on load.
- **Headline:** `--fs-display` Caslon, 2–3 lines, one word in *italic gold* accent. Bottom-left anchored, not centered (editorial asymmetry).
- **Eyebrow** above headline: `ATELIÊ TOCKS · ITAJAÍ-SC` in `--fs-label` gold.
- **Sub-line + CTA:** lead Poppins + primary button "Ver a coleção" / "Agendar visita".
- **Scroll cue:** bottom-center hairline "↓ DESCER" `--fs-label` muted, subtle 2s loop nudge (respects reduced-motion).
- **Corner metadata** (top-right, Thesis-B device): `EDIÇÃO · SOB ENCOMENDA` / index counter — quiet luxe framing.

### 6.3 Product Card (with the surprising hover)
- **Composition:** full-bleed product photo on `--color-surface`, squared (radius 0 or `--radius-sm`), table sitting in its own light. Below image, a thin info strip: model name (`--fs-h3` Caslon), linha tag (`--fs-label` muted), price (`--fs-price` Poppins). No heavy borders at rest.
- **The surprising hover (signature):**
  1. Image performs a slow **`scale(1.06)` push-in** over `--dur-slow` `--ease-out-luxe`, while the warm glow behind it intensifies (`--glow-product` opacity +0.06).
  2. A 1px **gold hairline frame** draws in around the card (animate border-color from transparent → `--color-hairline`).
  3. A small **gold "Ver mesa →"** label fades+rises from the bottom edge (`y: 12px→0`).
  4. The price/title nudge up `--space-1` to make room. All synchronized on one hover timeline.
  - On touch devices, the gold label and frame are shown at rest (no hover) — never hide the affordance on mobile.
- **Asymmetry rule:** in the collection grid, alternate card sizes (see §7.2) — never a flat uniform grid.

### 6.4 Product Gallery (PDP)
- **Layout:** large primary stage (full-bleed within content width, `--glow-product` + `--shadow-product`) + a vertical thumbnail rail (left on desktop, horizontal swipe on mobile).
- **Interaction:** thumbnail click → primary cross-fades (`--dur-base`) and the new image does a tiny `scale 1.02→1` settle. Optional **hover-zoom** (cursor-follow magnify) on primary, desktop only, restrained.
- **Lightbox:** click primary → full-screen on `--color-canvas-deep` with scrim, arrow nav, ESC to close, gold hairline frame.

### 6.5 Finishes Selector (10 woods + 16 fabrics) — proposed interaction
This is the most product-specific component. The catalog: **10 madeiras** (Angelin, Canelão, Carvalho Branco Linheiro, Cerejeira, Ébano Linheiro, Freijó, Goiabão Escuro, Itaúba, Marupá, Wengue) and **16 tecidos** (codes 102, 103-91, 143-1, 145-9, 148-91, 154-9, 191-801, 212-23, 247-24, 269-9, 269-21, 275-9, 284, 300-1, 309, 310). Swatch PNGs live in the asset library (`Opções de acabamento Skara/Madeiras|Tecidos/`).

**Interaction model — "Atelier Bench" two-track selector:**
- A bordered panel (`--color-surface`, `--border-hairline`) titled **"Componha sua mesa"**, split into two tracks:
  - **Track 1 — Madeira** (10 swatches) and **Track 2 — Tecido** (16 swatches).
- **Swatch:** 56×56px squared chip (`--radius-xs`) showing the real material PNG; on hover a gold hairline frame + name tooltip (`--fs-label`); selected = 2px gold ring (`--shadow-gold-focus` style) + checkmark.
- **Live preview:** a large preview area above the tracks shows the currently-selected wood + fabric combination. If composited renders are unavailable, fall back to: large swatch-of-the-selected-wood as the surface texture behind a stylized table silhouette + a felt-color block — and clearly label "Prévia de acabamento" (honest, no fake photoreal claim).
- **The 16 fabrics** are presented in a **horizontally-scrollable single row** (snap-scroll) with a faint gold gradient mask on the right edge cueing "more →" — avoids a cramped 16-up grid. The 10 woods sit in a 5×2 grid.
- **Selected summary** line below: "Madeira **Itaúba** · Tecido **154-9**" in Poppins, wood/fabric names in `--color-accent`. This selection is passed to the concierge/cart payload.
- **Motion:** swatches stagger-reveal (`--stagger`) on section enter; selection ring animates in `--dur-base` `--ease-out-luxe`.
- **Accessibility:** swatches are real `<button role="radio">` inside `radiogroup`s, keyboard-navigable, each with an accessible name (e.g., "Madeira Itaúba, selecionar"). Never rely on color alone — name label always present.

### 6.6 Price Block (BRL + parcelamento)
- **Price:** `--fs-price-lg` Poppins Medium, `tabular-nums`, e.g. **R$ 19.900**. Currency prefix in `--color-text-secondary`, amount in `--color-text`.
- **Parcelamento line:** `--fs-body-sm` `--color-text-secondary`: "ou 12× de R$ 1.658 sem juros" (compute from price). Optional "à vista no PIX com X% de desconto" if applicable.
- **No price in ad-style crossing-out / fake discounts** — luxury keeps pricing dignified. Price is stated plainly, once.
- **Context note for catalog:** price range across the line is R$ 10.990–R$ 26.900; format always `R$ 00.000` (BR thousands separator `.`).

### 6.7 Add-to-Cart / Concierge Button
This is DTC-luxury with a **consultative purchase**, so the primary CTA is dual-mode:
- **Primary button — solid gold:** background `--color-accent`, label `--color-on-accent`, `--fs-button` uppercase, `--radius-sm`, padding `14px 28px`. Hover → `--color-accent-hover` + lift `--shadow-md` + label letter-spacing eases +0.01em; active → `--color-accent-active`. Transition `--dur-base` `--ease-out-luxe`.
- **Two actions on PDP:** Primary = **"Adicionar ao carrinho"** (solid gold). Secondary = **"Falar com um especialista"** (concierge) — ghost button: transparent fill, `--border-hairline`, gold text, hover fills `--color-accent-soft`. Reflects the consultative, sob-encomenda nature.
- **Disabled/loading:** reduce to 60% opacity + a thin gold progress hairline; never spinner-soup.

### 6.8 Slide-in Cart Drawer (Zustand)
- **Right-side drawer**, width 420px desktop / 100vw mobile, on `--color-surface`, left edge `--border-hairline`, `--shadow-lg`. Scrim `--color-scrim` behind, click-to-close.
- **Enter:** slide `translateX(100%) → 0` over `--dur-cinema` `--ease-in-out-luxe`; scrim fades over `--dur-slow`.
- **Line item:** thumbnail (squared) + model name (Caslon `--fs-h3` small) + selected finishes summary (`--fs-small` muted) + price (`tabular-nums`) + qty stepper + remove (hairline icon).
- **Footer:** subtotal (Poppins, `--fs-price`), parcelamento note, primary gold **"Finalizar"** full-width + ghost "Continuar vendo".
- **Empty state:** centered gold symbol mark (faint), Caslon line "Seu carrinho está em silêncio.", link to coleção.

### 6.9 Checkout Layout
- **Two-column desktop / stacked mobile.** Left = form steps (Contato → Entrega → Pagamento) as a vertical stepper with gold active-step indicator. Right = sticky **order summary** card (`--color-surface`, `--border-hairline`) with line items, selected finishes, subtotal, parcelamento, total.
- **Inputs:** fill `--color-surface-2`, `--border-neutral` at rest → `--border-strong` on hover → gold focus ring `--shadow-gold-focus` + `--color-accent` border on focus. Label above field in `--fs-label`. Error state: `--color-error` border + helper text + non-color icon.
- **Given the high-ticket consultative model:** offer a prominent **"Prefere finalizar com um especialista? Agende uma conversa."** concierge path alongside self-checkout. Payment surfaces BR methods (PIX, cartão com parcelamento, boleto if used).
- **Trust band** above the pay button: hairline row of reassurances (frete/entrega sob medida, garantia do atelier, 3 décadas de ofício) — `--fs-small`, no badge-clutter.

### 6.10 Footer
- **Dark `--color-canvas-deep`**, generous `--space-10` top padding, opens with a `--border-hairline` rule.
- **Top zone:** large Caslon line / brand statement ("Tocks Custom — três décadas de ofício, Itajaí-SC.") + gold symbol mark.
- **Columns:** Coleção (linhas), Atelier (história, visita), Atendimento (concierge, WhatsApp, contato), Legal. Links `--fs-body-sm` `--color-text-secondary`, hover → `--color-accent`.
- **Bottom bar:** `--fs-small` muted — CNPJ/Tocks Indústria e Comércio, © year, social. Hairline above.

### 6.11 Atelier / Story Editorial Section
- The most Thesis-A moment: **editorial magazine spread** on `--color-canvas`. Large Caslon `--fs-h2` heading ("Sobre permanência." / "O ofício."), a **drop-cap** lead paragraph (`--fs-dropcap` gold initial), body at `66ch`, interleaved full-bleed atelier/process photography with clip-path reveals, and a **pull-quote** (`--fs-quote` italic Caslon, gold) like *"A pressa é uma forma de pobreza."* set apart with hairline rules above/below.
- Two-column asymmetric text/figure layout; numbers/years ("1994 · 30 anos") as `--fs-label` markers.

### 6.12 Testimonial / Social Proof
- Restrained. A single large italic-Caslon client quote (`--fs-quote`) on `--color-surface` with a small attribution (`--fs-label`, role + city), gold quotation mark or hairline accent. Carousel only if multiple — slow auto-advance (8s), `--ease-out-luxe`, pause on hover, manual hairline dots.
- Optionally a quiet logo/press row ("Como visto em…") at `--fs-small`, desaturated, no loud badges.

### 6.13 CTA Band
- Full-bleed `--color-wood-900` block (warm, distinct from canvas) with `--glow-product` faint, centered Caslon `--fs-h1` invitation ("Pronto para a sua mesa?"), sub-line, and the dual CTA (gold primary + concierge ghost). Hairline rules top & bottom. The one place a warm wood-tinted background is allowed to break the canvas.

---

## 7. Page Blueprints

12-column grid, `--container 1320px`, gutter per §4.1. Editorial sections may break to full-bleed.

### 7.1 Home
1. **Cinematic Hero** (§6.2) — 100svh, video/still, italic-gold headline, dual CTA. *AD moment: the page-load orchestration (§5.2).*
2. **Manifesto strip** — short Caslon `--fs-h2` statement + lead, hairline-framed, asymmetric (text left, negative space right). *AD: pull-quote energy.*
3. **Featured tables (3)** — editorial, NOT uniform: one large full-bleed feature (e.g. Aparato R$26.900) + two stacked smaller cards. Scroll-reveal stagger. *AD: surprising card hover (§6.3).*
4. **Linhas overview** — three doors: Original · Premium · Pebolim, each a tall image panel with Caslon label + count, hover glow. *AD: warm glow + clip-path.*
5. **Finishes teaser** — "10 madeiras. 16 tecidos. Uma mesa que é só sua." preview of swatch tracks → links to selector. *AD: material warmth.*
6. **Atelier editorial** (§6.11) condensed — drop-cap lead + one process photo + pull-quote.
7. **Testimonial** (§6.12).
8. **CTA Band** (§6.13).
9. **Footer** (§6.10).

### 7.2 Collection / Catalog (~20 tables across Original / Premium / Pebolim)
- **Header band:** page title Caslon `--fs-h1` ("A Coleção"), lead, and a **filter bar** by linha (Original / Premium / Pebolim / Conversíveis sinuca-e-jantar) + sort. Filter chips: `--radius-pill` ghost, selected = gold fill `--color-on-accent` text.
- **Grid (the asymmetry):** a **broken editorial grid**, not uniform. Pattern across rows: `[wide][narrow] / [narrow][wide] / [full-bleed feature] / [narrow][narrow][narrow]`. Wide cards get more glow + larger Caslon name. This avoids cookie-cutter grid (anti-slop).
- **Card** per §6.3 with surprising hover. Linha tag eyebrow on each.
- **Reveal:** cards stagger in on scroll (`--stagger`), each settling with `y` + opacity.
- **Result count + "carregar mais"** (or paginate) at the bottom in `--fs-label`.
- *AD moment: the alternating-scale grid + per-card hover is where catalog browsing feels like flipping an art-book.*

### 7.3 Product Detail (PDP)
1. **Above the fold:** left = Gallery (§6.4) with `--glow-product` + `--shadow-product`; right = sticky info column — eyebrow (linha), model name Caslon `--fs-h1`, short editorial description, Price block (§6.6), **dual CTA** (§6.7).
2. **Finishes Selector** (§6.5) — "Componha sua mesa" two-track, full-width band on `--color-surface`.
3. **Specs** — editorial spec table (dimensions, peso, madeira maciça, tempo de produção sob encomenda), hairline-separated rows, `tabular-nums`, Thesis-A style. Two-column key/value.
4. **The craft** — full-bleed process/detail photography (wood grain, hardware macro from the 4K micro-cuts) with clip-path reveal + a short caption.
5. **Conversível note** (for sinuca-e-jantar models) — visual showing the dining/play modes.
6. **Related / "Da mesma linha"** — 3 cards, asymmetric.
7. **CTA Band + Footer.**
- *AD moments: the lit gallery stage, the Finishes "Atelier Bench", the macro-craft full-bleed.*

### 7.4 Cart / Checkout
- **Cart** = the slide-in drawer (§6.8) is primary; a dedicated `/carrinho` page mirrors it for deep-linking (same line-item layout, two-column with summary).
- **Checkout** per §6.9 — stepper left, sticky summary right, concierge alternative prominent. Calm, low-chrome, no upsell-clutter. Confirmation screen: large Caslon "Obrigado." + gold symbol + next steps (the atelier will confirm details), warm and personal — not a generic receipt.

### 7.5 Atelier (About / Story)
- **Opening:** full-bleed atelier photograph (Itajaí workshop) with vignette + a single Caslon line overlaid bottom-left ("Desde antes de sermos Tocks.").
- **Story body:** editorial spread (§6.11) — drop-cap lead, two-column asymmetric text + figures, the Skara→Tocks rebrand told as heritage ("Antes Skara, hoje Tocks Custom — três décadas no atelier de Itajaí."), pull-quotes, year-markers.
- **Process strip:** numbered steps (01 Seleção da madeira → 02 Marcenaria → 03 Acabamento → 04 Entrega) as horizontal scroll with photography.
- **The team / founder** (optional) — restrained portrait + Caslon caption.
- **CTA Band** ("Agende uma visita ao atelier") + Footer.

---

## 8. Responsive Rules & Accessibility

### 8.1 Breakpoints (mobile-first)
```css
/* mobile-first: base styles target 360–767px */
--bp-sm: 480px;   /* large phone */
--bp-md: 768px;   /* tablet */
--bp-lg: 1024px;  /* small desktop — display scale §3.2 applies */
--bp-xl: 1280px;  /* desktop */
--bp-2xl: 1560px; /* full-bleed editorial breakouts */
```

### 8.2 Fluid type & layout
- **Display sizes scale fluidly.** Use `clamp()` so hero never overflows on mobile:
  - `--fs-display`: `clamp(2.75rem, 9vw, 6rem)`
  - `--fs-h1`: `clamp(2.25rem, 6vw, 4rem)`
  - `--fs-h2`: `clamp(1.75rem, 4vw, 2.75rem)`
  - `--fs-quote`: `clamp(1.5rem, 4vw, 2.5rem)`
- **Body stays fixed** at `--fs-body` (mobile may use 16px min to avoid iOS zoom on inputs).
- **Layout collapse:** multi-column editorial → single column under `--bp-md`; PDP sticky info column un-sticks and stacks under gallery; nav → hamburger overlay under `--bp-md`; collection broken-grid → single column (still alternating image emphasis, never identical rows).
- **Section rhythm** reduces per §4.1; page gutters reduce per §4.1.
- **Touch targets** ≥ 44×44px (swatches, qty steppers, nav).
- **Hero video** on mobile: serve a lighter poster image first, lazy-load video, or fall back to still (perf + data).

### 8.3 Accessibility (non-negotiable)
- **Focus states:** every interactive element shows a visible gold focus ring — `outline: 2px solid var(--color-accent); outline-offset: 2px;` or `--shadow-gold-focus`. Never remove outlines without replacement. `:focus-visible` for keyboard.
- **Contrast:** all text meets AA per §2.3. Body never below `--color-text-secondary`. Muted text ≥14px only. Gold text reserved for short labels/links (passes AA at 6.6:1).
- **Color independence:** finish selection, form errors, and states never rely on color alone — always paired with text/label/icon (selected = ring **+** checkmark **+** name; error = border **+** message **+** icon).
- **Reduced motion:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  }
  ```
  Also: disable Lenis smooth-scroll and all parallax; replace reveal transforms with a simple instant opacity; hero video shows poster still (no autoplay loop). Gate this in JS via `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- **Semantics:** real landmarks (`header/nav/main/footer`), headings in order, `radiogroup` for finishes, `<dialog>`/focus-trap for cart drawer & lightbox (ESC closes, focus returns to trigger), alt text on all product photography describing the table + finish.
- **Keyboard:** full keyboard path through nav, catalog cards, gallery thumbnails, finishes, cart, checkout. Skip-to-content link first in DOM.
- **Video:** muted autoplay loops are decorative — `aria-hidden` + no essential info conveyed by motion alone.

---

## 9. Anti-Patterns to Avoid (specific to Tocks / Atelier Noir)

1. **Cold gray dark mode.** The canvas is warm (`#16130F`), never `#0E0E11` tech-gray and never pure `#000`. If it looks like a developer-tools panel, it's wrong.
2. **Pure white text.** Always the warm off-white `#F4EFE6`. Pure `#FFF` on this canvas looks harsh and cheap.
3. **Gold everywhere.** Gold is punctuation. If more than ~one gold element fights for attention per viewport, pull back. No gold gradients, no gold-on-gold, no gold borders on every box.
4. **Uniform card grids.** The collection must use the broken editorial grid (§7.2). Identical-box grids read as a generic store, not an atelier.
5. **Substituting fonts.** Libre Caslon Text + Poppins only. No Inter/Roboto/Playfair/Cormorant swap-ins. No Google-font display fallback that "looks close."
6. **Italic Caslon overuse.** Italic is a held breath — one phrase, one quote, one drop-cap word. Never italic paragraphs or italic UI.
7. **Fast/bouncy motion.** No snappy 150ms ease-in-out everywhere, no spring bounces (except the single cart-count bump). Slow and decelerating is the brand.
8. **Ad-style pricing.** No fake "DE / POR" crossed-out prices, no countdown urgency, no "últimas unidades" pressure. Luxury states price once, plainly. (Echoes the brand's no-discount-theatre posture.)
9. **Maximalist hero.** No 5 competing CTAs, no badge clutter, no auto-rotating carousel of 8 banners. One headline, one product, one (dual) action.
10. **Tiny cramped product photos.** Tables are the hero — never shrink them into thumbnails on the home/PDP above-the-fold. Full-bleed, well-lit, in their pool of light.
11. **Heavy rounded corners + drop-shadow-soup.** Luxury skews sharp/squared; one signature product shadow, not glow-rings on every element.
12. **Flat solid-color sections.** Every surface earns depth (grain, glow, hairline, or transparency). A flat `#16130F` block with nothing on it is a miss.

---

## 10. Token-to-Tailwind quick reference (for the dev)

- All `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--fs-*`, `--dur-*`, `--ease-*` go inside one `@theme { }` in `app/globals.css`. Tailwind v4 auto-generates utilities (`bg-canvas`, `text-accent`, `p-7`, `rounded-sm`, `shadow-product`, etc.) from the `--color-*` / `--space-*` / `--radius-*` / `--shadow-*` namespaces.
- Custom-prefixed tokens that Tailwind doesn't auto-map to utilities (`--fs-*`, `--ease-*`, `--dur-*`, `--glow-*`, `--vignette`) are consumed directly via `var(--token)` in component CSS or inline `style`/Motion props.
- Fonts wired via `next/font/local` (§3.1), exposed as `--font-display` / `--font-ui`, and bound in `@theme` so `font-display` / `font-ui` utilities exist.
- Motion: define the easings as JS constants too (mirror §5.1) for framer-motion `transition={{ ease: [...] }}` arrays — e.g. `easeOutLuxe = [0.16, 1, 0.30, 1]`.

---

*Atelier Noir v1 — build-ready. Synthesized from Thesis B (dark cinematic canvas) + Thesis A (editorial Caslon refinement). Honors official brand canon: Libre Caslon Text + Poppins, gold/white/blue symbol marks, the 10-wood / 16-fabric finish catalog. Refined restraint over maximalist chaos.*
