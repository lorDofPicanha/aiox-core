---
name: "Magnolia Bakery" # from page.md title
colors:
  primary: "#00211a" # from --color-green / --color-text-dark
  secondary: "#bae8d4" # from --checkbox-background / --button-accent-color
  tertiary: "#b32e4e" # from --primary-button-background
  neutral: "#4d2a05" # from --secondary-button-color
  surface: "#ffffff" # from --body-background
  text: "#00211a" # from --text-color
  text-muted: "#888888" # from --input-color-disabled
  border: "#cccccc" # from --border-color
  error: "#581b28" # from --error-color
  success: "#000000" # from --success-color
  green: "#00211a" # from --color-green
  mint: "#bae8d4" # from --checkbox-background / --button-accent-color
  mint-soft: "#dbeae9" # from --secondary-button-background-hover
  blue: "#050e3c" # from --color-blue
  sky: "#afd9e9" # from --shape-fill-color on .Shape--blue
  yellow: "#451f13" # from --color-yellow
  butter: "#ffe5a3" # from --shape-fill-color on .Shape--yellow
  red: "#581b28" # from --color-red
  blush: "#f7c0c3" # from --shape-fill-color on .Shape--red
  purple: "#43234c" # from --color-purple
  lavender: "#e7cbef" # from --shape-fill-color on .Shape--purple
  ruby: "#b32e4e" # from --primary-button-background
  cocoa: "#4d2a05" # from --secondary-button-color
typography:
  display-hero: { fontFamily: "Gatefold Demi, serif", fontSize: "65px", fontWeight: "600", lineHeight: "1.1", letterSpacing: "0em", features: "" } # from body,html --h1-* declarations
  display-large: { fontFamily: "Gatefold Demi, serif", fontSize: "54px", fontWeight: "600", lineHeight: "1.1", letterSpacing: "0em", features: "" } # from body,html --h2-* declarations
  section-heading: { fontFamily: "Gatefold Demi, serif", fontSize: "42px", fontWeight: "600", lineHeight: "1.2", letterSpacing: "0em", features: "" } # from body,html --h3-* declarations
  subheading-large: { fontFamily: "Gt Alpina, serif", fontSize: "24px", fontWeight: "400", lineHeight: "1.3", letterSpacing: "0em", features: "" } # from body,html --h4-* declarations
  subheading: { fontFamily: "Ambit, serif", fontSize: "24px", fontWeight: "600", lineHeight: "1.3", letterSpacing: "0em", features: "" } # from body,html --h5-* declarations
  body-large: { fontFamily: "Ambit, serif", fontSize: "18px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0em", features: "" } # from body,html --p-* declarations
  body: { fontFamily: "Ambit, serif", fontSize: "16px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0em", features: "" } # from --p-font-size--mobile / body copy scale
  body-small: { fontFamily: "Ambit, serif", fontSize: "14px", fontWeight: "400", lineHeight: "1.4", letterSpacing: "0em", features: "" } # from body,html --h8-font-size
  button: { fontFamily: "Ambit, serif", fontSize: "18px", fontWeight: "400", lineHeight: "44px", letterSpacing: "0em", features: "" } # from --buttons-font-family / --buttons-font-size / --button-height
  button-small: { fontFamily: "Ambit, serif", fontSize: "14px", fontWeight: "400", lineHeight: "40px", letterSpacing: "0em", features: "" } # from .HeaderNavMobile__button.Button declaration
  link: { fontFamily: "Ambit, serif", fontSize: "18px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0em", features: "" } # from --p-font-family and --link-color system
  caption: { fontFamily: "Ambit, serif", fontSize: "12px", fontWeight: "400", lineHeight: "1.4", letterSpacing: "0em", features: "" } # from label/component declarations
  caption-small: { fontFamily: "Ambit, serif", fontSize: "10px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "0em", features: "" } # from .ArticleTile__badge declaration
  caption-tabular: { fontFamily: "Ambit, serif", fontSize: "12px", fontWeight: "400", lineHeight: "1.4", letterSpacing: "0em", features: "tnum" } # inferred from ecommerce price/count labels
  micro: { fontFamily: "Ambit, serif", fontSize: "9px", fontWeight: "400", lineHeight: "13px", letterSpacing: "0em", features: "" } # from .Tooltip declaration
  h1: { fontFamily: "Gatefold Demi, serif", fontSize: "65px", fontWeight: "600", lineHeight: "1.1", letterSpacing: "0em", features: "" } # alias from display-hero
  h2: { fontFamily: "Gatefold Demi, serif", fontSize: "54px", fontWeight: "600", lineHeight: "1.1", letterSpacing: "0em", features: "" } # alias from display-large
  h3: { fontFamily: "Gatefold Demi, serif", fontSize: "42px", fontWeight: "600", lineHeight: "1.2", letterSpacing: "0em", features: "" } # alias from section-heading
  h4: { fontFamily: "Gt Alpina, serif", fontSize: "24px", fontWeight: "400", lineHeight: "1.3", letterSpacing: "0em", features: "" } # alias from subheading-large
  body-lg: { fontFamily: "Ambit, serif", fontSize: "18px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0em", features: "" } # alias from body-large
  body-md: { fontFamily: "Ambit, serif", fontSize: "16px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0em", features: "" } # alias from body
  body-sm: { fontFamily: "Ambit, serif", fontSize: "14px", fontWeight: "400", lineHeight: "1.4", letterSpacing: "0em", features: "" } # alias from body-small
  label: { fontFamily: "Ambit, serif", fontSize: "16px", fontWeight: "400", lineHeight: "1.4", letterSpacing: "0em", features: "" } # from --label-font-size and Ambit theme override
  mono: { fontFamily: "monospace", fontSize: "13px", fontWeight: "400", lineHeight: "1.4", letterSpacing: "0em", features: "" } # inferred from tokens-detected monospace fallback only
rounded:
  none: "0px" # from --pod-image-border-radius / zero-radius declarations
  sm: "2px" # from --input-border-radius / --tile-border-radius
  md: "8px" # from alert border-radius declaration
  lg: "20px" # from --button-border-radius
  full: "9999px" # inferred from 50% circular controls converted for spec
spacing:
  xs: "4px" # from spacing candidates 4px / 4px 8px
  sm: "8px" # from spacing candidates 8px
  md: "12px" # from --input-horizontal-padding
  lg: "20px" # from repeated module/button spacing declarations
  xl: "55px" # from --button-horizontal-padding / --carousel-margin-bottom
preview_tokens:
  button_primary_bg: "#00211a" # from .Button--primary --button-rich-accent-color
  button_primary_text: "#bae8d4" # from .Button--primary --button-accent-color
  button_primary_border: "#00211a" # from .Button--primary border declaration
  button_secondary_bg: "#c4dad1" # from --secondary-button-background
  button_secondary_text: "#4d2a05" # from --secondary-button-color
  button_secondary_border: "#c4dad1" # from --secondary-button-border-color
  button_tertiary_text: "#00211a" # from --link-color
  surface_bg: "#ffffff" # from --body-background
  card_bg: "#ffffff" # from --tile-background
  text: "#00211a" # from --text-color
  text_muted: "#888888" # from --input-color-disabled
  border: "#cccccc" # from --border-color
  accent: "#bae8d4" # from --button-accent-color / --checkbox-background
  button_radius: "20px" # from --button-border-radius, preferred over generic summary carousel 50%
  card_radius: "2px" # from --tile-border-radius
  input_radius: "2px" # from --input-border-radius
components:
  button-primary:
    bg: "#00211a" # from .Button--primary --button-rich-accent-color
    text: "#bae8d4" # from .Button--primary --button-accent-color
    border: "#00211a" # from .Button--primary border declaration
    radius: "20px" # from --button-border-radius
    padding: "0px 55px" # from --button-horizontal-padding
    font: "18px Ambit weight 400 uppercase" # from --buttons-* declarations
    hover_bg: "#bae8d4" # from .Button--primary hover background var(--button-alternate-color-2)
  button-primary-hover:
    bg: "#bae8d4" # from .Button--primary:hover background
    text: "#00211a" # from .Button--primary:hover color
    border: "#bae8d4" # from .Button--primary:hover border-color
    radius: "20px" # from --button-border-radius
    padding: "0px 55px" # from --button-horizontal-padding
    font: "18px Ambit weight 400 uppercase" # from --buttons-* declarations
  button-primary-disabled:
    bg: "#00211a" # from .Button--primary default
    text: "#bae8d4" # from .Button--primary default
    border: "#00211a" # from .Button--primary border
    radius: "20px" # from --button-border-radius
    padding: "0px 55px" # from --button-horizontal-padding
    opacity: "0.7" # from .Button--disabled declaration
  button-secondary:
    bg: "#c4dad1" # from --secondary-button-background
    text: "#4d2a05" # from --secondary-button-color
    border: "#c4dad1" # from --secondary-button-border-color
    radius: "20px" # from --button-border-radius
    padding: "0px 55px" # from --button-horizontal-padding
    font: "18px Ambit weight 400 uppercase" # from --buttons-* declarations
    hover_bg: "#dbeae9" # from --secondary-button-background-hover
  button-secondary-hover:
    bg: "#dbeae9" # from --secondary-button-background-hover
    text: "#4d2a05" # from --secondary-button-color-hover
    border: "#dbeae9" # from --secondary-button-border-color-hover
    radius: "20px" # from --button-border-radius
    padding: "0px 55px" # from --button-horizontal-padding
  button-ghost:
    bg: "transparent" # from --image-button-background
    text: "#4d2a05" # from --image-button-color
    border: "#ffffff" # from --image-button-border-color
    radius: "20px" # from --button-border-radius
    padding: "0px 55px" # from --button-horizontal-padding
  card:
    bg: "#ffffff" # from --tile-background
    border: "#cccccc" # from --tile-border-color
    radius: "2px" # from --tile-border-radius
    shadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12)" # from --box-shadow
    padding: "20px" # from repeated component spacing declarations
  input-text:
    bg: "#ffffff" # from --input-background
    text: "#00211a" # from --input-color
    border: "#00211a" # from --input-border-color
    radius: "2px" # from --input-border-radius
    padding: "0px 12px" # from --input-horizontal-padding
    focus_border: "#00211a" # from --input-border-color-active
  badge-default:
    bg: "#bae8d4" # from component-properties badge background most_common
    text: "#00211a" # from badge rich color / text green
    border: "transparent" # inferred from badge declaration no explicit border
    radius: "0px" # inferred from triangular product badge declaration, no radius
    padding: "0px 6px 0px 12px" # from .ArticleTile__badge declaration
    font: "10px Ambit weight 700 uppercase" # from .ArticleTile__badge declaration
  nav-header:
    bg: "#ffffff" # from component-properties nav background and --header-color open state
    text: "#00211a" # from --text-color / nav link variables resolved to brand green
    border_bottom: "#cccccc" # from --border-color
    height: "80px" # from .State--cart-open .Header --cart-header-height
---

## 1. Visual Theme & Atmosphere

Magnolia Bakery's system is built around deep bakery green and soft mint, not a generic ecommerce blue. The dark green (`#00211a`) carries the logo-like authority of the brand, while mint (`#bae8d4`) gives buttons, checks, badges, and decorative shapes a confectionery softness. Ruby, blush, butter, sky, and lavender appear as seasonal or product-family accents rather than the core brand voice.

The typography is expressive and layered. `Gatefold Demi` gives large headlines a nostalgic bakery-window presence, `Gt Alpina` adds an editorial serif layer for supporting headings, and `Ambit` handles body copy, forms, and buttons with friendly clarity. The rendered theme deliberately overrides the earlier generic Open Sans / Libre Franklin root with this more branded trio.

Surfaces are mostly white with crisp green text and thin gray borders. Depth appears through Material-like box shadows on select overlays and menus, while product tiles stay simple and image-led. The distinctive move is the inverted button system: dark green fills with mint text flip to mint fills with dark green text on hover.

**Key Characteristics:**

- Deep green `#00211a` is the brand anchor for text, logo-like moments, links, and focus outlines.
- Mint `#bae8d4` is the signature soft accent for CTAs, checks, badges, and decorative shapes.
- `Gatefold Demi` headlines create the bakery heritage tone.
- `Ambit` body text keeps the shop experience warm and readable.
- Buttons are pill-shaped at `20px`, uppercase, and horizontally generous.
- Product and tile containers use small `2px` radii, not rounded cards.
- Seasonal palette families pair rich dark colors with pastel fills.
- Shadows are reserved for select menus, modals, and elevated account surfaces.

## 2. Color Palette & Roles

### Primary

- **Magnolia Green** (`#00211a`): `--color-green`, `--color-text-dark`, `--text-color`. Brand identity, body text, links, focus outlines, and primary button fill.
- **Magnolia Mint** (`#bae8d4`): `--checkbox-background`, `.Button--primary --button-accent-color`. Signature accent, primary button text, hover fill, badges, checks, and green decorative shapes.
- **Ruby CTA Legacy** (`#b32e4e`): `--primary-button-background`. Legacy/product badge CTA color retained in the Shopify root and tile badge system.

### Brand & Dark

- **Blue Dark** (`#050e3c`): `--color-blue`. Seasonal dark blue for blue product families.
- **Cocoa Brown** (`#4d2a05`): `--secondary-button-color`. Secondary button text and image button text.
- **Red Dark** (`#581b28`): `--color-red`, `--error-color`. Error messaging and red seasonal family.
- **Purple Dark** (`#43234c`): `--color-purple`. Purple seasonal family and rich badge text.

### Accent Colors

- **Sky Pastel** (`#afd9e9`): `.Shape--blue --shape-fill-color`. Blue decorative fill and blue button accent.
- **Butter Pastel** (`#ffe5a3`): `.Shape--yellow --shape-fill-color`. Yellow decorative fill.
- **Blush Pastel** (`#f7c0c3`): `.Shape--red --shape-fill-color`. Red-family soft fill.
- **Lavender Pastel** (`#e7cbef`): `.Shape--purple --shape-fill-color`. Purple-family soft fill.
- **Fresh Green Alt** (`#57d77a`): `.Button--primary-green-alt --button-alternate-color`. High-saturation seasonal green variant.

### Interactive

- **Primary Button Fill** (`#00211a`): `.Button--primary --button-rich-accent-color`. Default rendered primary button background and border.
- **Primary Button Hover** (`#bae8d4`): `.Button--primary:hover --button-alternate-color-2`. Hover background and border for standard primary buttons.
- **Secondary Button Fill** (`#c4dad1`): `--secondary-button-background`. Soft secondary CTA fill.
- **Secondary Hover Fill** (`#dbeae9`): `--secondary-button-background-hover`. Secondary CTA hover and mobile-menu-open header fill.
- **Focus Ring Green** (`#00211a`): focus declarations such as `.State--visibleFocus input:focus`. Strong 5px accessibility outline.

### Neutral Scale

- **White** (`#ffffff`): `--body-background`, `--input-background`, `--tile-background`. Default page, card, input, and overlay text surface.
- **Dark Text** (`#00211a`): `--text-color`. Primary readable text.
- **Muted Input Text** (`#888888`): `--input-color-disabled`. Disabled and secondary form affordance.
- **Modal Gray** (`#333333`): `--modal-close-background`. Utility controls and carousel arrows.
- **Border Gray** (`#cccccc`): `--border-color`, `--tile-border-color`. Hairlines and tile borders.

### Surface & Borders

- **Body Surface** (`#ffffff`): `--body-background`. Primary light theme surface.
- **Tile Surface** (`#ffffff`): `--tile-background`. Product/article tile background.
- **Input Border** (`#00211a`): `--input-border-color`. Forms use brand green borders rather than gray.
- **Tile Border** (`#cccccc`): `--tile-border-color`. Quiet card/tile separators.

### Shadow Colors

- **Standard Shadow** (`rgba(0, 0, 0, 0.2)`, `rgba(0, 0, 0, 0.14)`, `rgba(0, 0, 0, 0.12)`): `--box-shadow`. Layered black alpha shadow for menus and lifted surfaces.
- **Elevated Shadow** (`rgba(0, 0, 0, 0.2)`, `rgba(0, 0, 0, 0.14)`, `rgba(0, 0, 0, 0.12)`): `--box-shadow-elevated`. Stronger vertical depth for account/forms.
- **Overlay Solid** (`rgba(0, 0, 0, 0.6)`): `--dark-overlay-solid`, `--branded-overlay-solid`. Image overlay treatment.

### Color Philosophy

The palette behaves like a bakery box system: a stable green identity, a mint accent that feels fresh and handmade, and seasonal pastel/dark pairs for product storytelling. Ruby exists in the root button tokens, but the rendered Magnolia button language is greener and softer, so green and mint should lead new UI.

## 3. Typography Rules

### Font Family

Use `Gatefold Demi` for high-impact headlines, `Gt Alpina` for refined serif subheads, and `Ambit` for body, labels, inputs, and buttons. `Open Sans` and `Libre Franklin` are present in the older root tokens, but the later `body,html` theme and inline root override move the visible brand system to Gatefold / Alpina / Ambit. Font Awesome families are icon fonts only.

No OpenType feature settings are explicitly declared in the source. Use normal spacing and avoid artificial tracking except where uppercase labels need breathing room in implementation.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Features | Notes |
|---|---|---:|---:|---:|---:|---|---|
| display-hero | Gatefold Demi | 65px | 600 | 1.1 | 0em |  | Homepage hero and major campaign headings |
| display-large | Gatefold Demi | 54px | 600 | 1.1 | 0em |  | Large section titles |
| section-heading | Gatefold Demi | 42px | 600 | 1.2 | 0em |  | Product/category modules |
| subheading-large | Gt Alpina | 24px | 400 | 1.3 | 0em |  | Editorial support headings |
| subheading | Ambit | 24px | 600 | 1.3 | 0em |  | Promotional subheads |
| body-large | Ambit | 18px | 400 | 1.5 | 0em |  | Default desktop paragraph copy |
| body | Ambit | 16px | 400 | 1.5 | 0em |  | Mobile paragraph and compact body |
| body-small | Ambit | 14px | 400 | 1.4 | 0em |  | Dense tile text and helper copy |
| button | Ambit | 18px | 400 | 44px | 0em |  | Uppercase CTA labels |
| button-small | Ambit | 14px | 400 | 40px | 0em |  | Mobile/header CTA buttons |
| link | Ambit | 18px | 400 | 1.5 | 0em |  | Text links and inline CTAs |
| caption | Ambit | 12px | 400 | 1.4 | 0em |  | Legal, labels, account copy |
| caption-small | Ambit | 10px | 700 | 1.1 | 0em |  | Product/article badges |
| caption-tabular | Ambit | 12px | 400 | 1.4 | 0em | tnum | Prices, quantities, counters |
| micro | Ambit | 9px | 400 | 13px | 0em |  | Tooltip marker |

### Principles

- Use `Gatefold Demi` only when the page needs Magnolia's heritage bakery voice; do not use it for dense product metadata.
- Keep body copy in `Ambit` at 18px desktop and 16px mobile so the shop remains warm and readable.
- Let `Gt Alpina` bridge campaign headlines and body copy; it should feel editorial, not utilitarian.
- Buttons stay uppercase in `Ambit` weight 400, relying on shape and color instead of heavy type.
- Avoid positive letter spacing on `Gatefold Demi` headlines; the brand's display type should feel compact and sign-painted.
- Use `caption-small` weight 700 for product badges because the triangular badge format needs short, sturdy labels.

## 4. Components

### Buttons

**Primary Green Mint** (`button-primary`)
- Background: `#00211a`
- Text: `#bae8d4`
- Border: `#00211a`
- Padding: `0px 55px`
- Radius: `20px`
- Font: `18px Ambit weight 400 uppercase`
- Hover: `#bae8d4` background with `#00211a` text
- Use: Main commerce and campaign CTAs such as "ORDER NOW" or "GET TICKETS".

**Primary Green Mint Hover** (`button-primary-hover`)
- Background: `#bae8d4`
- Text: `#00211a`
- Border: `#bae8d4`
- Padding: `0px 55px`
- Radius: `20px`
- Font: `18px Ambit weight 400 uppercase`
- Use: Explicit hover/focus state for primary CTAs.

**Primary Disabled** (`button-primary-disabled`)
- Background: `#00211a`
- Text: `#bae8d4`
- Border: `#00211a`
- Padding: `0px 55px`
- Radius: `20px`
- Opacity: `0.7`
- Use: Disabled add-to-cart or unavailable commerce action.

**Secondary Soft Mint** (`button-secondary`)
- Background: `#c4dad1`
- Text: `#4d2a05`
- Border: `#c4dad1`
- Padding: `0px 55px`
- Radius: `20px`
- Font: `18px Ambit weight 400 uppercase`
- Hover: `#dbeae9` background
- Use: Secondary commerce actions and less-prominent promotional links.

**Secondary Hover** (`button-secondary-hover`)
- Background: `#dbeae9`
- Text: `#4d2a05`
- Border: `#dbeae9`
- Padding: `0px 55px`
- Radius: `20px`
- Use: Hover state for soft mint secondary buttons.

**Image Ghost** (`button-ghost`)
- Background: `transparent`
- Text: `#4d2a05`
- Border: `#ffffff`
- Padding: `0px 55px`
- Radius: `20px`
- Use: CTAs placed on image or overlay contexts where the image provides the fill.

### Cards & Containers

**Tile Card** (`card`)
- Background: `#ffffff`
- Border: `#cccccc`
- Radius: `2px`
- Shadow: `0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12)`
- Padding: `20px`
- Use: Product/article tiles and elevated utility panels. Product imagery should usually dominate the card.

### Inputs & Forms

**Text Input** (`input-text`)
- Background: `#ffffff`
- Text: `#00211a`
- Border: `#00211a`
- Padding: `0px 12px`
- Radius: `2px`
- Focus: `#00211a` border, width increases from 1px to 2px in the source
- Use: Checkout, filters, account, and franchise forms.

### Badges / Tags / Pills

**Mint Product Badge** (`badge-default`)
- Background: `#bae8d4`
- Text: `#00211a`
- Border: `transparent`
- Padding: `0px 6px 0px 12px`
- Radius: `0px`
- Font: `10px Ambit weight 700 uppercase`
- Use: Small product/article labels. The source also uses triangular badge pointers with the same background color.

### Navigation

**Header Navigation** (`nav-header`)
- Background: `#ffffff`
- Text: `#00211a`
- Border bottom: `#cccccc`
- Height: `80px`
- Use: Desktop header and cart-open header state. Mobile menu open can shift the header color to `#dbeae9`.

This surface does not expose a complete standalone tab or avatar token system. Tooltips exist as tiny mint circular markers (`13px`, `#bae8d4`, `50%`), but full tooltip panels are not defined as a primary brand component.

### Decorative Elements

Decorative shape fills use the pastel family: mint `#bae8d4`, sky `#afd9e9`, butter `#ffe5a3`, blush `#f7c0c3`, and lavender `#e7cbef`. Image overlays use black or white alpha gradients. Product/article badges may include a triangular pointer rather than rounded-pill styling.

## 5. Layout Principles

### Spacing System

The practical base unit is 4px, but the Shopify theme uses a roomy commerce rhythm: 12px form padding, 20px module spacing, 30px mobile header-button margins, 40px tablet button padding, and 55px desktop button horizontal padding. Use `4, 8, 12, 20, 30, 40, 55, 60` as the working scale.

### Grid & Container

The source uses Shopify-style 12-column grid patterns with responsive `grid-column: span 12/6/4/3` behavior. Product and article tiles are narrow and image-led, with a root tile width around `260px` and an inline override to `250px`. Hero modules rely on full-width image/carousel composition with overlaid or adjacent text.

### Whitespace Philosophy

Whitespace should feel generous around campaigns and product imagery, but not minimalistic. Magnolia uses the space to make cakes, pudding, workshops, and seasonal collections feel giftable and browsable. Dense account or form surfaces can tighten spacing, but marketing surfaces should preserve air around headlines and CTAs.

Do not make the interface card-heavy. The brand's pages are better understood as full-width commerce modules, image rows, and product tiles rather than nested dashboard cards.

### Border Radius Scale

- `0px`: Image modules and triangular badges.
- `2px`: Inputs, tiles, small announcement buttons.
- `8px`: Alert/toast surfaces.
- `20px`: Primary and secondary CTA buttons.
- `9999px`: Circular controls, toggles, tooltip dots, and carousel controls.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | White surface, no shadow, `#cccccc` border | Product tiles, forms, standard page sections |
| Ambient | Pastel fill without shadow | Badges, decorative shapes, soft secondary controls |
| Standard | `--box-shadow`: 0 2px / 0 1px layered black-alpha shadow | Menus, select lists, subtle elevated containers |
| Elevated | `--box-shadow-elevated`: 0 5px / 0 8px / 0 3px layered black-alpha shadow | Account form containers and high-attention panels |
| Deep | `rgba(0, 0, 0, 0.6)` overlays and black alpha gradients | Image overlays, modal/site overlays |
| Ring | `5px solid #00211a` or `0 0 0 5px #00211a` | Visible focus treatment on inputs and controls |

### Shadow Philosophy

Depth is functional rather than decorative. Magnolia uses shadows for menus, overlays, and form panels where layering helps interaction, while product tiles and marketing modules remain mostly flat so photography and pastel color families carry the emotion.

## 7. Do's and Don'ts

### Do

- Do use `#00211a` as the dominant text and brand color; it is the Magnolia anchor across text, links, borders, and focus.
- Do pair dark green CTAs with mint `#bae8d4` text, then invert to mint fill and dark green text on hover.
- Do use `Gatefold Demi` at 42px and above for the bakery heritage voice.
- Do use `Ambit` for body copy, buttons, forms, and labels; it is the rendered theme override.
- Do keep commerce controls pill-shaped at `20px` and product/input surfaces tight at `2px`.
- Do use the pastel/dark color pairs for seasonal modules: `#050e3c/#afd9e9`, `#451f13/#ffe5a3`, `#581b28/#f7c0c3`, `#43234c/#e7cbef`.

### Don't

- Don't make Magnolia's primary action ruby by default; `#b32e4e` is present in legacy/root CTA tokens, but the rendered `.Button--primary` system is dark green and mint.
- Don't use generic blue links; links should resolve to Magnolia green `#00211a`.
- Don't set `Gatefold Demi` in product metadata, form labels, or buttons; those belong in `Ambit`.
- Don't round product cards to 16px or 24px; source tile and input radii are `2px`.
- Don't replace the mint hover inversion with opacity-only hover; the brand button interaction changes fill and text colors.
- Don't add frosted backdrop blur to headers; the detected header uses solid `#ffffff` or `#dbeae9` surfaces, not a declared backdrop-filter token.
- Don't make badge labels pill-shaped; source badges are compact uppercase labels and may use a triangular pointer.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---:|---|
| Mobile | `max-width: 767px` | H1/H2 reduce to 38px, body reduces to 16px, button height becomes 40px, product buttons become 175px wide, mobile header nav appears |
| Tablet | `768px - 989px` | H1/H2 remain 38px in the branded override, grid items often span 6 columns, button height remains 44px |
| Medium Desktop | `990px - 1279px` | Header buttons reduce to 160px and some CTA font sizes drop to 15px |
| Desktop | `1280px+` | Full 12-column grid, 240px product buttons, 55px button horizontal padding, 65px hero display type |

### Touch Targets

Buttons use `44px` desktop/tablet height and `40px` mobile height. Toggle hit areas use circular `40px` controls. Inputs use a `38px` height, which should be preserved or increased when adding new mobile form fields.

### Collapsing Strategy

Desktop navigation is a horizontal header with tiered mega-nav menus. Mobile switches to a stacked `HeaderNavMobile` structure with `20px` side padding, accordion-like tiers, and a mint-tinted open state. Product and article grids collapse to single-column or span-12 modules on small screens.

### Image Behavior

Product and campaign imagery should stay full-width inside its module, with tile/image widths adapting to the grid. Hero carousel navigation moves upward on mobile, and product button widths shrink from `240px` to `175px`.

## 9. Agent Prompt Guide

### Quick Color Reference

- Primary brand: Magnolia Green (`#00211a`)
- Primary CTA: Magnolia Green fill (`#00211a`) with Mint text (`#bae8d4`)
- CTA Hover: Magnolia Mint (`#bae8d4`) with Green text (`#00211a`)
- Secondary CTA: Soft Mint (`#c4dad1`) with Cocoa text (`#4d2a05`)
- Background: White (`#ffffff`)
- Heading text: Magnolia Green (`#00211a`)
- Body text: Magnolia Green (`#00211a`)
- Muted text: Disabled Gray (`#888888`)
- Border: Soft Gray (`#cccccc`)
- Error: Deep Red (`#581b28`)
- Link: Magnolia Green (`#00211a`)

### Example Component Prompts

> Create a Magnolia Bakery hero section on white background. Set the headline in `Gatefold Demi` at 65px weight 600, line-height 1.1, letter-spacing 0em, color `#00211a`. Add body copy in `Ambit` 18px weight 400, line-height 1.5, color `#00211a`. Use a primary CTA button with `#00211a` background, `#bae8d4` text, `20px` radius, `0px 55px` padding, 44px height, uppercase `Ambit` 18px.

> Create a product tile with a white `#ffffff` surface, `#cccccc` 1px border, `2px` radius, and image-led layout. Use `Gatefold Demi` 42px weight 600 for the title if it is a campaign tile, otherwise use `Ambit` 18px. Add a compact mint badge `#bae8d4` with `#00211a` text, 10px uppercase weight 700, padding `0px 6px 0px 12px`.

> Create a secondary promotion card for a seasonal collection. Use `#dbeae9` as a soft mint background band, `#00211a` heading text in `Gatefold Demi` 54px weight 600, and an `Ambit` 18px paragraph. Add a secondary CTA with `#c4dad1` fill, `#4d2a05` text, `#c4dad1` border, `20px` radius, and hover fill `#dbeae9`.

> Create a header navigation bar with solid white `#ffffff` background, text links in `#00211a`, bottom border `#cccccc`, and an 80px desktop height. Use `Ambit` for navigation text, no backdrop blur, and switch mobile menu open background to `#dbeae9`.

> Create a dark/image overlay section for a bakery campaign. Place image content full-bleed, apply a black overlay equivalent to `rgba(0, 0, 0, 0.6)`, set text to `#ffffff`, and use a ghost CTA with transparent background, white `#ffffff` border, cocoa `#4d2a05` text only when on light image areas.

> Create a form row with `Ambit` 16px labels and inputs, uppercase labels, white `#ffffff` input background, `#00211a` text and border, `2px` radius, 38px height, `0px 12px` padding, and a 2px `#00211a` focus border.

### Iteration Guide

1. Start every Magnolia composition with `#00211a` text on `#ffffff`; add mint only where the user needs action or brand softness.
2. Use `Gatefold Demi` for H1-H3 and keep it large; switch to `Gt Alpina` or `Ambit` once the content becomes explanatory.
3. Build primary CTAs as green/mint inversions: default `#00211a` fill plus `#bae8d4` text, hover `#bae8d4` fill plus `#00211a` text.
4. Keep product/input geometry small at `2px`; reserve `20px` rounding for CTAs and circular values for controls only.
5. Use seasonal color pairs deliberately, not randomly: dark blue/sky, cocoa/butter, red/blush, purple/lavender.
6. Preserve `Ambit` uppercase button labels at weight 400; do not make CTAs bold to compensate for weak layout.
7. Use shadows only for interactive overlays, select lists, modal/account panels, and focus rings; keep ordinary product tiles flat.
8. On mobile, reduce hero headings to 38px and shrink product CTA width to 175px while preserving the green/mint button identity.
