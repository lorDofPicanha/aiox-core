---
name: "Example Domain"
colors:
  primary: "#334488" # from a:link,a:visited declaration (#348 expanded to #334488)
  secondary: "#000000" # inferred from browser default body text, no CSS variable declared
  tertiary: "#666666" # inferred from div opacity 0.8 over default black text
  neutral: "#eeeeee" # from body background declaration (#eee expanded to #eeeeee)
  surface: "#eeeeee" # from body background declaration (#eee expanded to #eeeeee)
  text: "#000000" # inferred from browser default body text, no color declaration present
  text-muted: "#666666" # inferred from div opacity 0.8 over default black text
  border: "#eeeeee" # inferred from surface color because no border token or declaration exists
  error: "#334488" # inferred from available palette; source declares no status colors
  success: "#334488" # inferred from available palette; source declares no status colors
  link: "#334488" # from a:link,a:visited declaration (#348 expanded to #334488)
typography:
  display-hero:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "1.5em" # from h1 font-size declaration
    fontWeight: "400" # inferred from browser default h1 weight normalized for system UI
    lineHeight: "1.2em" # inferred from browser heading defaults
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  display-large:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "1.5em" # from h1 font-size declaration
    fontWeight: "400" # inferred from browser default h1 weight normalized for system UI
    lineHeight: "1.2em" # inferred from browser heading defaults
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  section-heading:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "1.5em" # from h1 font-size declaration
    fontWeight: "400" # inferred from browser default heading style
    lineHeight: "1.2em" # inferred from browser heading defaults
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  subheading-large:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "1.25em" # inferred from h1 scale down because only h1 size is declared
    fontWeight: "400" # inferred from body system UI default
    lineHeight: "1.35em" # inferred from compact documentation copy
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  subheading:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "1.125em" # inferred from h1 scale down because only h1 size is declared
    fontWeight: "400" # inferred from body system UI default
    lineHeight: "1.4em" # inferred from compact documentation copy
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  body-large:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "1em" # inferred from browser body default
    fontWeight: "400" # inferred from browser body default
    lineHeight: "1.5em" # inferred from browser body default
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  body:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "1em" # inferred from browser body default
    fontWeight: "400" # inferred from browser body default
    lineHeight: "1.5em" # inferred from browser body default
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  body-small:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "0.875em" # inferred from browser small-text convention
    fontWeight: "400" # inferred from browser body default
    lineHeight: "1.45em" # inferred from browser small-text convention
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  button:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration, no button selector exists
    fontSize: "1em" # inferred from browser control default
    fontWeight: "400" # inferred from browser control default
    lineHeight: "1.25em" # inferred from browser control default
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  button-small:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration, no button selector exists
    fontSize: "0.875em" # inferred from browser control default
    fontWeight: "400" # inferred from browser control default
    lineHeight: "1.25em" # inferred from browser control default
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  link:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "1em" # inferred from browser body default
    fontWeight: "400" # inferred from browser link default
    lineHeight: "1.5em" # inferred from browser body default
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  caption:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "0.75em" # inferred from browser caption convention
    fontWeight: "400" # inferred from browser body default
    lineHeight: "1.35em" # inferred from compact caption convention
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  caption-small:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "0.6875em" # inferred from compact caption convention
    fontWeight: "400" # inferred from browser body default
    lineHeight: "1.3em" # inferred from compact caption convention
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: [] # inferred from absence of OpenType feature declarations
  caption-tabular:
    fontFamily: "system-ui, sans-serif" # from body font-family declaration
    fontSize: "0.75em" # inferred from browser caption convention
    fontWeight: "400" # inferred from browser body default
    lineHeight: "1.35em" # inferred from compact caption convention
    letterSpacing: "0em" # inferred from absence of letter-spacing declaration
    features: ["tnum"] # inferred for tabular caption role; source declares no OpenType features
rounded:
  none: "0px" # inferred from absence of border-radius declarations
  sm: "0px" # inferred from absence of border-radius declarations
  md: "0px" # inferred from absence of border-radius declarations
  lg: "0px" # inferred from absence of border-radius declarations
  full: "9999px" # inferred from conventional full radius; source declares no pill radius
spacing:
  xs: "4px" # inferred from browser/default compact scale; CSS only declares 15vh auto margin
  sm: "8px" # inferred from browser/default compact scale; CSS only declares 15vh auto margin
  md: "16px" # inferred from browser/default compact scale; CSS only declares 15vh auto margin
  lg: "24px" # inferred from browser/default compact scale; CSS only declares 15vh auto margin
  xl: "32px" # inferred from browser/default compact scale; CSS only declares 15vh auto margin
preview_tokens:
  button_primary_bg: "#334488" # inferred from only interactive color, a:link,a:visited #348
  button_primary_text: "#ffffff" # inferred for contrast on #334488
  button_primary_border: "#334488" # inferred from only interactive color, no button border declared
  button_secondary_bg: "transparent" # inferred because no secondary button selector exists
  button_secondary_text: "#334488" # inferred from link color
  button_secondary_border: "#334488" # inferred from link color because no border token exists
  button_tertiary_text: "#334488" # from a:link,a:visited declaration (#348 expanded to #334488)
  surface_bg: "#eeeeee" # from body background declaration (#eee expanded to #eeeeee)
  card_bg: "#eeeeee" # inferred from surface because no card selector exists
  text: "#000000" # inferred from browser default body text
  text_muted: "#666666" # inferred from div opacity 0.8 over default black text
  border: "#eeeeee" # inferred from surface because no border declaration exists
  accent: "#334488" # from a:link,a:visited declaration (#348 expanded to #334488)
  button_radius: "0px" # inferred from absence of button border-radius declarations
  card_radius: "0px" # inferred from absence of card border-radius declarations
  input_radius: "0px" # inferred from absence of input border-radius declarations
components:
  link-default:
    text: "#334488" # from a:link,a:visited declaration (#348 expanded to #334488)
    font: "1em system-ui, sans-serif weight 400" # from body font-family declaration and browser link default
    underline: "browser-default" # inferred from browser link default
  surface-page:
    bg: "#eeeeee" # from body background declaration (#eee expanded to #eeeeee)
    text: "#000000" # inferred from browser default body text
    width: "60vw" # from body width declaration
    margin: "15vh auto" # from body margin declaration
  text-container:
    opacity: "0.8" # from div opacity declaration
    text: "#000000" # inferred from browser default body text before opacity
---

## 1. Visual Theme & Atmosphere

Example Domain is a documentation placeholder rendered with the minimum styling needed to stay readable. The page uses a single light gray field, browser-native system typography, and one muted blue link color. The visual effect is intentionally spare and functional.

The palette anchor is the link blue `#334488`, not because it is a broad brand identity color, but because it is the only declared interactive color. The main atmosphere comes from the flat `#eeeeee` background and the body content constrained to `60vw` with a large `15vh auto` margin.

Typography is system UI only. There are no custom font files, no OpenType features, no weight ladder, and no display type behavior beyond `h1 { font-size: 1.5em; }`. Surface treatment is completely flat: no shadows, no borders, no gradients, and no glass effects.

**Key Characteristics:**
- System UI stack: `system-ui, sans-serif`.
- Flat light gray page background: `#eeeeee`.
- Single interactive blue: `#334488`.
- Compact heading scale: `1.5em` for `h1`.
- Centered document layout: `width: 60vw` and `margin: 15vh auto`.
- Muted container treatment via `div { opacity: 0.8; }`.
- No declared radius scale.
- No declared shadow or elevation system.
- No component library signatures beyond native HTML.

## 2. Color Palette & Roles

### Primary
- **Example Link Blue** (`#334488`): `a:link,a:visited`. The only declared interactive color; use for links and any unavoidable primary action derived from this page.

### Brand & Dark
- **Default Text Black** (`#000000`): browser default. The source does not declare a dark brand token or immersive dark section.

### Accent Colors
- **Example Link Blue** (`#334488`): `a:link,a:visited`. This doubles as the accent because no other accent token exists.

### Interactive
- **Link Default / Visited** (`#334488`): `a:link,a:visited`. No hover, active, focus, or disabled color variants are declared.

### Neutral Scale
- **Page Gray** (`#eeeeee`): `body background`. Primary surface and neutral field.
- **Default Text Black** (`#000000`): browser default body text.
- **Muted Text** (`#666666`): inferred from `div { opacity: 0.8; }` over default black text.

### Surface & Borders
- **Surface** (`#eeeeee`): `body background`. The source uses the page background as the only surface color.
- **Border Fallback** (`#eeeeee`): inferred. No border declarations are present, so borders should be avoided unless required by a downstream UI.

### Shadow Colors
- No shadow colors are declared. The system is intentionally low-elevation and communicates structure through native document flow, not depth.

### Color Philosophy
Example Domain uses color as a minimal affordance system: gray for the reading field, black for content, and muted blue for links. There is no expressive brand palette to extend; agents should preserve the restraint and avoid adding ornamental colors.

## 3. Typography Rules

### Font Family
The source declares `font-family: system-ui, sans-serif` on `body`. There are no `@font-face` declarations, hosted fonts, icon fonts, or OpenType feature settings. Use the operating system UI font and keep all roles plain, compact, and readable.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Features | Notes |
|---|---|---:|---:|---:|---:|---|---|
| display-hero | system-ui, sans-serif | 1.5em | 400 | 1.2em | 0em | none | Alias of the only declared heading size. |
| display-large | system-ui, sans-serif | 1.5em | 400 | 1.2em | 0em | none | Do not create oversized display type. |
| section-heading | system-ui, sans-serif | 1.5em | 400 | 1.2em | 0em | none | Matches `h1`. |
| subheading-large | system-ui, sans-serif | 1.25em | 400 | 1.35em | 0em | none | Inferred step below `h1`. |
| subheading | system-ui, sans-serif | 1.125em | 400 | 1.4em | 0em | none | Inferred compact subheading. |
| body-large | system-ui, sans-serif | 1em | 400 | 1.5em | 0em | none | Browser body default. |
| body | system-ui, sans-serif | 1em | 400 | 1.5em | 0em | none | Primary copy style. |
| body-small | system-ui, sans-serif | 0.875em | 400 | 1.45em | 0em | none | Inferred only when smaller copy is required. |
| button | system-ui, sans-serif | 1em | 400 | 1.25em | 0em | none | No button selector exists; derive minimally. |
| button-small | system-ui, sans-serif | 0.875em | 400 | 1.25em | 0em | none | No compact button selector exists. |
| link | system-ui, sans-serif | 1em | 400 | 1.5em | 0em | none | Uses `#334488`. |
| caption | system-ui, sans-serif | 0.75em | 400 | 1.35em | 0em | none | Inferred for metadata only. |
| caption-small | system-ui, sans-serif | 0.6875em | 400 | 1.3em | 0em | none | Inferred for dense labels only. |
| caption-tabular | system-ui, sans-serif | 0.75em | 400 | 1.35em | 0em | tnum | Tabular role is inferred, not source-declared. |

### Principles
- Keep `h1` at `1.5em`; the source does not support oversized hero typography.
- Use `system-ui, sans-serif` everywhere; do not introduce a custom brand face.
- Keep letter spacing at `0em`; no tracking behavior is declared.
- Keep weights plain and functional; the page does not define a bold display personality.
- Treat `#334488` links as the only typographic color accent.

## 4. Components

### Buttons
The source does not define button selectors, button classes, button states, or button variants. If a downstream context requires a button, derive it from the single interactive color: `#334488` background, `#ffffff` text, `0px` radius, and compact system UI text. This is an inference, not a source component.

### Cards & Containers
**Page Surface** (`surface-page`)
- Background: `#eeeeee`
- Text: `#000000`
- Width: `60vw`
- Margin: `15vh auto`
- Radius: `0px`
- Shadow: none
- Use: Centered documentation-style content area.

**Text Container** (`text-container`)
- Opacity: `0.8`
- Text: `#000000` before opacity
- Use: Muted content block treatment from the source `div` rule.

There is no card selector, no card border, no card padding token, and no card shadow.

### Inputs & Forms
This is a documentation surface with no form selectors. Labels, help text, focus rings, and validation states are not defined here. If a form is unavoidable, use `system-ui, sans-serif`, `0px` radius, `#334488` for focus, and keep the treatment flat.

### Badges / Tags / Pills
No badge, tag, or pill tokens are declared. Do not introduce rounded pills as a default; the source has no radius language.

### Navigation
No navigation selectors are declared. There is no header bar, no sticky nav, no backdrop blur, and no nav height token. A derived navigation should remain plain text on `#eeeeee` with `#334488` links.

### Links
**Default Link** (`link-default`)
- Text: `#334488`
- Font: `1em system-ui, sans-serif weight 400`
- Underline: browser default
- States: default and visited share the same color
- Use: The only real interactive atom in the source.

### Decorative Elements
There are no decorative gradients, dashed borders, illustrations, shadows, or texture motifs. The only non-structural effect is `div { opacity: 0.8; }`.

## 5. Layout Principles

### Spacing System
The only explicit spacing declaration is `body { margin: 15vh auto; }`, which creates a large viewport-relative top and bottom offset and centers the document horizontally. The YAML spacing scale is inferred for downstream compatibility; the source itself does not define a tokenized spacing system.

### Grid & Container
The page uses a single-column document layout with `width: 60vw`. There is no grid, breakpoint system, multi-column section, or max-width token. Keep layouts narrow and text-first.

### Whitespace Philosophy
Whitespace is structural, not decorative. The `15vh` vertical margin gives the small document a calm top offset, while `60vw` prevents the line length from spanning the viewport. Avoid dense dashboards or card grids when reproducing this system.

### Border Radius Scale
- `0px`: Effective radius for all real source elements; no radius declarations exist.
- `9999px`: Compatibility-only full radius value; not used by the source.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border, `#eeeeee` surface | Default page treatment. |
| Ambient | Not defined | Do not add ambient shadows. |
| Standard | Not defined | Use document flow and whitespace instead. |
| Elevated | Not defined | Cards and overlays are outside this surface. |
| Deep | Not defined | Avoid modal-like depth unless another system supplies it. |
| Ring | Not declared; infer `#334488` only if focus styling is required | Accessibility fallback for derived controls. |

### Shadow Philosophy
The system is intentionally low-elevation. Depth is communicated by centered placement, viewport margin, and muted opacity, not by box-shadow. Adding layered shadows would make the page feel like a component library rather than a neutral documentation placeholder.

## 7. Do's and Don'ts

**Do's**
- Do use `system-ui, sans-serif` exactly as the source declares.
- Do keep the page field `#eeeeee`; white cards are not part of the source treatment.
- Do use `#334488` only for links or source-derived interactive emphasis.
- Do keep headings compact at `1.5em` instead of hero scale.
- Do preserve the centered `60vw` document measure for desktop reproductions.
- Do use flat surfaces with `0px` radius when deriving missing components.

**Don'ts**
- Don't add custom fonts; Example Domain has no `@font-face` type system.
- Don't add backdrop blur; the visual language relies on solid flat surfaces.
- Don't add layered shadows; no `box-shadow` is declared anywhere in the source.
- Don't make pill buttons or rounded badges; the source declares no radius system.
- Don't introduce a multi-color status palette; error and success colors are absent from the source.
- Don't turn `#334488` into a broad brand palette; it is the link color, not a full identity system.
- Don't scale headings beyond `1.5em`; that would exceed the declared hierarchy.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---:|---|
| Source default | all widths | `body` remains `60vw` with `15vh auto` margin. |
| Narrow derived | below 640px | Use a wider measure such as `calc(100% - 32px)` if implementation requires mobile readability. |
| Wide derived | above 1200px | Preserve readable line length; do not expand content into a dashboard grid. |

### Touch Targets
No touch target sizes are declared. For derived controls, keep accessibility minimums at 44px while retaining the flat `0px` radius and `#334488` interactive color.

### Collapsing Strategy
The source has nothing to collapse: no nav, grid, cards, or media. On small screens, the only practical adaptation is to replace `60vw` with a safer content width while preserving the single-column document flow.

### Image Behavior
No images are present. If images are added in a downstream context, keep them inline with the document column and avoid decorative crops or immersive hero media.

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: Example Link Blue (`#334488`)
- CTA Hover: not declared; keep Example Link Blue (`#334488`) unless accessibility requires a derived darker state
- Background: Page Gray (`#eeeeee`)
- Heading text: Default Text Black (`#000000`)
- Body text: Default Text Black (`#000000`)
- Muted text: Opacity-Derived Gray (`#666666`)
- Border: no real border token; use Page Gray (`#eeeeee`) only as a fallback
- Link: Example Link Blue (`#334488`)

### Example Component Prompts
> Create a compact documentation page on `#eeeeee`. Use `system-ui, sans-serif`, constrain the body to `60vw`, center it with `15vh auto`, set the `h1` to `1.5em` weight 400 line-height `1.2em`, and render links in `#334488` with browser-default underline behavior.

> Create a plain content card only if required by the product context: background `#eeeeee`, text `#000000`, no shadow, no border, `0px` radius, `24px` inferred padding, and `system-ui, sans-serif` at `1em` line-height `1.5em`. Keep it visually indistinguishable from the page surface.

> Create a derived primary button for an Example Domain-style utility page: background `#334488`, text `#ffffff`, border `#334488`, `0px` radius, `8px 16px` padding, `system-ui, sans-serif` at `1em` weight 400, with no gradient and no shadow.

> Create a minimal link list on `#eeeeee`: each link uses `#334488`, `system-ui, sans-serif`, `1em`, weight 400, default underline, and no hover color change because the source declares only `a:link,a:visited`.

> Create a neutral header only if navigation is required: solid `#eeeeee` background, `#000000` text, `#334488` links, no backdrop blur, no shadow, no border unless needed for accessibility, and no logo color beyond the text itself.

> Create a muted explanatory paragraph block using `system-ui, sans-serif`, `1em`, line-height `1.5em`, color `#000000`, and `opacity: 0.8` to match the source `div` treatment.

### Iteration Guide
1. Keep `system-ui, sans-serif` as the entire type system; do not substitute Inter, Roboto, Geist, or a branded serif.
2. Keep the page background `#eeeeee`; avoid white floating cards because the source has no card surface.
3. Use `#334488` for links and only cautiously for derived CTAs; it is the only declared interaction color.
4. Keep `h1` at `1.5em`; if a generated design starts looking like a landing page, reduce the heading scale.
5. Preserve flatness: no shadows, no gradients, no glass, and no elevation ladder.
6. Use `0px` radius for derived controls; rounded pills are not part of this source.
7. Maintain a single-column document measure; `60vw` is the source layout signature.
8. Treat missing buttons, badges, inputs, tabs, avatars, and tooltips as intentional absences, deriving them only when the implementation context demands them.
