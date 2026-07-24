---
name: "Cedric Grolet" # from page title in page.md
source_url: "https://cedric-grolet.com/en/" # inferred from extraction request
colors:
  primary: "#000000" # from --color-primary
  secondary: "#8f8f8f" # from --color-secondary
  tertiary: "#c5a97a" # from --color-gold
  neutral: "#f6f6f6" # from --color-background
  surface: "#ffffff" # from --color-white
  text: "#000000" # from --color-primary
  text-muted: "#8f8f8f" # from --color-secondary
  border: "#8f8f8f" # from --color-secondary
  error: "#e32d2d" # from --color-error
  success: "#c5a97a" # inferred from --color-gold as the only positive/accent semantic token
  black: "#000000" # from --color-black
  white: "#ffffff" # from --color-white
  background: "#f6f6f6" # from --color-background
  alert: "#feebc8" # from --color-alert
  gold: "#c5a97a" # from --color-gold
  grey: "#494949" # from --color-grey
  field-text: "#353535" # from .editoForm__label input declaration
  divider: "#e6e6e6" # from flatpickr shadow/border declarations
  prehome-custom: "#f1e4b2" # from --custom-color
typography:
  display-hero:
    fontFamily: "La Grolet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-heading
    fontSize: "44px" # from .prehome__title declaration
    fontWeight: "400" # from h1,h2,h3,h4,h5,h6 declaration
    lineHeight: "1.2" # from .prehome__title declaration
    letterSpacing: "0em" # inferred from .prehome__title no letter-spacing declaration
    features: [] # inferred from no OpenType feature declarations detected
  display-large:
    fontFamily: "La Grolet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-heading
    fontSize: "40px" # from .button--add:before declaration
    fontWeight: "400" # from .button--add:before declaration
    lineHeight: "1" # from h1,h2,h3,h4,h5,h6 declaration
    letterSpacing: "0em" # inferred from heading declaration
    features: [] # inferred from no OpenType feature declarations detected
  section-heading:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "44px" # from .block-alert__title media declaration
    fontWeight: "400" # from .block-alert__title declaration
    lineHeight: "50px" # from .block-alert__title media declaration
    letterSpacing: "0em" # inferred from .block-alert__title no letter-spacing declaration
    features: [] # inferred from no OpenType feature declarations detected
  subheading-large:
    fontFamily: "La Grolet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-heading
    fontSize: "34px" # from .header__menu__header__link span declaration
    fontWeight: "400" # from h1,h2,h3,h4,h5,h6 declaration
    lineHeight: "1" # from h1,h2,h3,h4,h5,h6 declaration
    letterSpacing: "-0.04em" # from .header__menu__header__link span declaration
    features: [] # inferred from no OpenType feature declarations detected
  subheading:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "25px" # from .address__subtitle declaration
    fontWeight: "700" # from .address__subtitle declaration
    lineHeight: "1.8" # from .address__subtitle declaration
    letterSpacing: "0.02em" # from .address__subtitle declaration
    features: [] # inferred from no OpenType feature declarations detected
  body-large:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "18px" # from token candidates in CSS typography scale
    fontWeight: "400" # from body declaration
    lineHeight: "1.5" # from token candidates in CSS line-height scale
    letterSpacing: "0em" # inferred from body declaration
    features: [] # inferred from no OpenType feature declarations detected
  body:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "16px" # from body declaration
    fontWeight: "400" # from body declaration
    lineHeight: "1.375" # from body declaration
    letterSpacing: "0em" # inferred from body declaration
    features: [] # inferred from no OpenType feature declarations detected
  body-small:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "14px" # from .address__text and form declarations
    fontWeight: "400" # from .address__text declaration
    lineHeight: "2" # from .address__text declaration
    letterSpacing: "0.02em" # from .address__text declaration
    features: [] # inferred from no OpenType feature declarations detected
  button:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "16px" # from --button-font-size
    fontWeight: "700" # from --button-font-weight
    lineHeight: "55px" # from --button-height at min-width 992px
    letterSpacing: "0em" # inferred from .button declaration
    features: [] # inferred from no OpenType feature declarations detected
  button-small:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "14px" # from .button--rounded declaration
    fontWeight: "300" # from .button--rounded declaration
    lineHeight: "46px" # from .button--rounded --button-height
    letterSpacing: "0em" # inferred from .button--rounded declaration
    features: [] # inferred from no OpenType feature declarations detected
  link:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "14px" # from .menu__item__link declaration
    fontWeight: "400" # from link component properties
    lineHeight: "1.375" # from body declaration inherited by links
    letterSpacing: "0em" # inferred from link declarations
    features: [] # inferred from no OpenType feature declarations detected
  caption:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "12px" # from .blockcart-header .cart-count and footer declarations
    fontWeight: "400" # inferred from body declaration
    lineHeight: "1.5" # inferred from footer/link-list compact text
    letterSpacing: "0em" # inferred from caption declarations
    features: [] # inferred from no OpenType feature declarations detected
  caption-small:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "10px" # from .footer__copyright__content declaration
    fontWeight: "400" # inferred from body declaration
    lineHeight: "1.5" # inferred from compact footer text
    letterSpacing: "0em" # inferred from caption declarations
    features: [] # inferred from no OpenType feature declarations detected
  caption-tabular:
    fontFamily: "DIN Condensed, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-special and @font-face
    fontSize: "17px" # from .flatpickr-current-month declaration
    fontWeight: "600" # from .flatpickr-current-month declaration
    lineHeight: "1" # inferred from date picker label treatment
    letterSpacing: "1px" # from .flatpickr-current-month declaration
    features: [] # inferred from no OpenType feature declarations detected
  micro:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "11px" # from .footer__language and .footer__menu declarations
    fontWeight: "400" # inferred from body declaration
    lineHeight: "1.5" # inferred from compact footer text
    letterSpacing: "0em" # inferred from micro declarations
    features: [] # inferred from no OpenType feature declarations detected
  nano:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "10px" # from .footer__copyright__content declaration
    fontWeight: "400" # inferred from body declaration
    lineHeight: "1.5" # inferred from compact footer text
    letterSpacing: "0em" # inferred from nano declarations
    features: [] # inferred from no OpenType feature declarations detected
  code-body:
    fontFamily: "monospace" # from tokens-detected typography family
    fontSize: "13px" # inferred from compact utility text scale
    fontWeight: "400" # inferred from body declaration
    lineHeight: "1.5" # inferred from body utility text
    letterSpacing: "0em" # inferred from monospace default
    features: [] # inferred from no code-specific OpenType declarations detected
  h1:
    fontFamily: "La Grolet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-heading
    fontSize: "44px" # from .prehome__title declaration
    fontWeight: "400" # from h1,h2,h3,h4,h5,h6 declaration
    lineHeight: "1.2" # from .prehome__title declaration
    letterSpacing: "0em" # inferred from h1 declaration
    features: [] # inferred from no OpenType feature declarations detected
  h2:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "44px" # from .block-alert__title media declaration
    fontWeight: "400" # from .block-alert__title declaration
    lineHeight: "50px" # from .block-alert__title media declaration
    letterSpacing: "0em" # inferred from .block-alert__title declaration
    features: [] # inferred from no OpenType feature declarations detected
  h3:
    fontFamily: "La Grolet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-heading
    fontSize: "34px" # from .header__menu__header__link span declaration
    fontWeight: "400" # from h1,h2,h3,h4,h5,h6 declaration
    lineHeight: "1" # from h1,h2,h3,h4,h5,h6 declaration
    letterSpacing: "-0.04em" # from .header__menu__header__link span declaration
    features: [] # inferred from no OpenType feature declarations detected
  h4:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "25px" # from .address__subtitle declaration
    fontWeight: "700" # from .address__subtitle declaration
    lineHeight: "1.8" # from .address__subtitle declaration
    letterSpacing: "0.02em" # from .address__subtitle declaration
    features: [] # inferred from no OpenType feature declarations detected
  body-lg:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "18px" # from token candidates in CSS typography scale
    fontWeight: "400" # from body declaration
    lineHeight: "1.5" # inferred from CSS line-height candidates
    letterSpacing: "0em" # inferred from body declaration
    features: [] # inferred from no OpenType feature declarations detected
  body-md:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "16px" # from body declaration
    fontWeight: "400" # from body declaration
    lineHeight: "1.375" # from body declaration
    letterSpacing: "0em" # inferred from body declaration
    features: [] # inferred from no OpenType feature declarations detected
  body-sm:
    fontFamily: "Akkurat, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-body
    fontSize: "14px" # from .address__text and form declarations
    fontWeight: "400" # from .address__text declaration
    lineHeight: "2" # from .address__text declaration
    letterSpacing: "0.02em" # from .address__text declaration
    features: [] # inferred from no OpenType feature declarations detected
  label:
    fontFamily: "DIN Condensed, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", Helvetica, Arial, sans-serif" # from --font-special
    fontSize: "17px" # from .flatpickr-current-month declaration
    fontWeight: "600" # from .flatpickr-current-month declaration
    lineHeight: "1" # inferred from date label treatment
    letterSpacing: "1px" # from .flatpickr-current-month declaration
    features: [] # inferred from no OpenType feature declarations detected
  mono:
    fontFamily: "monospace" # from tokens-detected typography family
    fontSize: "13px" # inferred from utility text scale
    fontWeight: "400" # inferred from body declaration
    lineHeight: "1.5" # inferred from utility text
    letterSpacing: "0em" # inferred from monospace default
    features: [] # inferred from no code-specific OpenType declarations detected
rounded:
  none: "0px" # from component-properties button/input border-radius most_common 0
  xs: "1px" # from .editoForm__form__submit button declaration
  sm: "4px" # from .header.--open .header__menu__burger declaration
  md: "6px" # from form/account/alert declarations
  lg: "10px" # from --button-border-radius
  xl: "50px" # from .button--rounded --button-border-radius
  full: "9999px" # from .introHome__date__widget input declaration
spacing:
  2xs: "5px" # from .header__banner padding declaration
  xs: "10px" # from .header__grid padding declaration
  sm: "15px" # from --container-padding-inline
  md: "20px" # from product-row --h-gap and header padding declaration
  lg: "25px" # from --container-padding-inline at min-width 1280px
  xl: "40px" # from .header__grid desktop padding declaration
  xxl: "50px" # from product/date/input height and spacing declarations
preview_tokens:
  button_primary_bg: "#000000" # from .button--primary --button-bg
  button_primary_text: "#ffffff" # from .button--primary --button-color
  button_primary_border: "#000000" # from .button--primary --button-border-color
  button_secondary_bg: "transparent" # from .button--secondary --button-bg
  button_secondary_text: "#000000" # from .button--secondary --button-color resolved from --color-primary
  button_secondary_border: "#8f8f8f" # from .button--secondary --button-border-color resolved from --color-secondary
  button_tertiary_text: "#8f8f8f" # from link component most_common color resolved from --color-secondary
  surface_bg: "#ffffff" # from --color-white
  card_bg: "#ffffff" # from --color-white
  text: "#000000" # from --color-primary
  text_muted: "#8f8f8f" # from --color-secondary
  border: "#8f8f8f" # from --color-secondary
  accent: "#c5a97a" # from --color-gold
  button_radius: "0px" # from component-properties button border-radius most_common 0
  card_radius: "6px" # inferred from alert/account surface radius declarations
  input_radius: "0px" # from component-properties input border-radius most_common 0
components:
  button-primary:
    bg: "#000000" # from .button--primary --button-bg
    text: "#ffffff" # from .button--primary --button-color
    border: "#000000" # from .button--primary --button-border-color
    radius: "10px" # from --button-border-radius
    padding: "0px 15px" # from --button-padding
    font: "16px Akkurat weight 700" # from --button-font-size and --button-font-weight
    hover_bg: "#ffffff" # from .button--primary --button-bg-hover resolved from --button-color
    hover_text: "#000000" # from .button--primary --button-color-hover resolved from --button-bg
  button-primary-hover:
    bg: "#ffffff" # from .button--primary --button-bg-hover resolved from --button-color
    text: "#000000" # from .button--primary --button-color-hover resolved from --button-bg
    border: "#000000" # from .button--primary --button-border-color-hover
    radius: "10px" # from --button-border-radius
    padding: "0px 15px" # from --button-padding
  button-secondary:
    bg: "transparent" # from .button--secondary --button-bg
    text: "#000000" # from .button--secondary --button-color resolved from --color-primary
    border: "#8f8f8f" # from .button--secondary --button-border-color resolved from --color-secondary
    radius: "10px" # from --button-border-radius
    padding: "0px 15px" # from --button-padding
    font: "16px Akkurat weight 400" # from .button--secondary --button-font-weight
    hover_border: "#000000" # from .button--secondary --button-border-color-hover resolved from --color-primary
  button-secondary-hover:
    bg: "transparent" # from .button--secondary --button-bg-hover alias to transparent
    text: "#000000" # from .button--secondary --button-color resolved from --color-primary
    border: "#000000" # from .button--secondary --button-border-color-hover resolved from --color-primary
    radius: "10px" # from --button-border-radius
    padding: "0px 15px" # from --button-padding
  button-ghost:
    bg: "transparent" # from .button--continue --button-bg
    text: "#000000" # from .button--continue --button-color resolved from --color-primary
    border: "#000000" # from .button--continue --button-border-color resolved from --color-primary
    radius: "10px" # from --button-border-radius
    padding: "0px 15px" # from --button-padding
    font: "16px Akkurat weight 300" # from .button--continue --button-font-weight
    hover_bg: "#000000" # from .button--continue --button-bg-hover resolved from --color-primary
    hover_text: "#ffffff" # from .button--continue --button-color-hover resolved from --color-white
  button-rounded:
    bg: "transparent" # from .button--rounded --button-bg inherited root
    text: "#000000" # from .button--rounded --button-color resolved from --color-primary
    border: "#8f8f8f" # from .button--rounded --button-border-color resolved from --color-secondary
    radius: "50px" # from .button--rounded --button-border-radius
    padding: "0px" # from .button--rounded --button-padding
    font: "14px Akkurat weight 300" # from .button--rounded declarations
  card:
    bg: "#ffffff" # inferred from source surfaces using --color-white
    border: "#e6e6e6" # from flatpickr border-like shadow declarations
    radius: "6px" # inferred from alert/account surface radius declarations
    shadow: "0 3px 13px rgba(0,0,0,.08)" # from flatpickr-calendar box-shadow declaration
    padding: "20px" # from alert/form surface declarations
  input-text:
    bg: "#ffffff" # from .form-fields input background-color resolved from --color-white
    text: "#353535" # from component-properties input color most_common
    border: "#353535" # from .editoForm__label input border-bottom
    radius: "0px" # from component-properties input border-radius most_common 0
    padding: "6px 5px 12px" # from .editoForm__label input declaration
    font: "13px Akkurat weight 400" # from .editoForm__label input declaration
    focus_border: "#353535" # from .editoForm__label input:focus-visible outline base color
    focus_outline: "1px solid rgba(53,53,53,.25)" # from .editoForm__label input:focus-visible declaration
  input-filled:
    bg: "#ffffff" # from .form-fields input background-color resolved from --color-white
    text: "#000000" # from form input inherited text color
    border: "transparent" # from .form-fields input border 0
    radius: "6px" # from .form-fields input border-radius
    padding: "0px 20px" # from .form-fields input padding 0 2rem
    font: "14px Akkurat weight 400" # from .form-fields input declaration
    focus_shadow: "0 0 0 .2rem rgb(0,0,0)" # from .form-fields input focus shadow resolved from --color-primary
  badge-default:
    bg: "#000000" # from .header__banner background
    text: "#ffffff" # from .header__banner color
    border: "transparent" # inferred from .header__banner no border declaration
    radius: "0px" # inferred from .header__banner no border-radius declaration
    padding: "5px 20px" # from .header__banner padding
    font: "14px Akkurat weight 400" # from .header__banner declaration
  alert-error:
    bg: "#feebc8" # from --color-alert
    text: "#e32d2d" # from --color-error
    border: "transparent" # inferred from alert tokens no border declaration
    radius: "6px" # from alert component border-radius most_common
    padding: "5px 20px" # from alert component padding most_common
    font: "14px Akkurat weight 400" # from alert component properties
  nav-header:
    bg: "#ffffff" # from .header background resolved from --color-white
    text: "#000000" # from body/header inherited --color-primary
    border_bottom: "transparent" # inferred from .header no border-bottom declaration
    backdrop_filter: "none" # inferred from .header declarations despite global backdrop-blur detections elsewhere
    height: "64px" # inferred from .header__grid desktop padding and logo treatment
  nav-header-banner:
    bg: "#000000" # from .header__banner background
    text: "#ffffff" # from .header__banner color
    border_bottom: "transparent" # inferred from .header__banner no border declaration
    height: "28px" # inferred from .header__banner font-size and padding
---

## 1. Visual Theme & Atmosphere

Cedric Grolet's design system is an austere luxury palette: black, white, soft grey, and a restrained pastry-gold accent. The brand identity is not a saturated confectionery color. It is the black wordmark and black header/banner language, with gold held back as a premium accent rather than a dominant wash.

Typography carries most of the atmosphere. `La Grolet` gives location and collection titles a custom editorial voice, while `Akkurat` keeps commerce, forms, navigation, and body copy precise. The system is comfortable using weight 700 for utility emphasis, but its signature display moments stay in a clean 400 weight with tight or neutral tracking.

Surfaces are mostly solid white or pale background grey, with a few glass-adjacent cues: sticky white header, overlays, reduced-opacity image gradients, and light shadows in widgets. The most distinctive visual choice is the contrast between a highly custom heading face and very disciplined black-and-white UI primitives.

**Key Characteristics:**

- Black is the brand anchor and primary action color.
- White surfaces dominate; pale `#f6f6f6` works as the page background.
- `La Grolet` headlines create the luxury signature.
- `Akkurat` is the operational font for checkout, forms, menus, and body copy.
- Buttons are high-contrast, mostly outlined or filled black.
- Radius is split: component extraction finds square defaults, while branded CTA tokens define 10px buttons and 50px rounded selectors.
- Hover behavior often inverts black and white instead of introducing new hues.
- Gold `#c5a97a` is a restrained accent, not a general CTA color.
- Depth is subtle and functional, mostly rings, borders, and light calendar/dropdown shadows.

## 2. Color Palette & Roles

### Primary

- **Brand Black** (`#000000`): `--color-primary`. Identity color, default body text, primary CTA fill, focus-ring base, and active navigation state.
- **Pure White** (`#ffffff`): `--color-white`. Text on black, header surface, form fills, and inverted CTA hover state.

### Brand & Dark

- **Header Banner Black** (`#000000`): `.header__banner background`. Used for the announcement band and brand-immersive dark strip.
- **Overlay Black** (`#000000`): `--color-black` plus `--overlay-opacity`. Used for modal overlays and image scrims.
- **Field Charcoal** (`#353535`): `.editoForm__label input`. Editorial form text, underline fields, and form submit fill.

### Accent Colors

- **Gold** (`#c5a97a`): `--color-gold`. Luxury accent and best positive semantic substitute when success is needed.
- **Alert Cream** (`#feebc8`): `--color-alert`. Soft warning or notification background.
- **Prehome Custom Cream** (`#f1e4b2`): `--custom-color`. Hover/custom title accent on the prehome selector.

### Interactive

- **Primary Hover Fill** (`#ffffff`): `.button--primary --button-bg-hover`. Primary buttons invert to white on hover.
- **Primary Hover Text** (`#000000`): `.button--primary --button-color-hover`. Inverted hover keeps black as the action color.
- **Secondary Border Hover** (`#000000`): `.button--secondary --button-border-color-hover`. Secondary buttons sharpen from grey to black.
- **Focus Ring Blue** (`#1199ff`): `button:focus box-shadow 0 0 0 5px #19f`. This appears as a browser/widget focus artifact, not a brand color.

### Neutral Scale

- **Background** (`#f6f6f6`): `--color-background`. Quiet page-level neutral.
- **Secondary Grey** (`#8f8f8f`): `--color-secondary`. Muted text, secondary borders, placeholders, and low-priority links.
- **Grey** (`#494949`): `--color-grey`. Dark neutral for supporting text and dense UI.
- **Divider Grey** (`#e6e6e6`): flatpickr border/shadow declarations. Hairline separators and widget outlines.

### Surface & Borders

- **Surface White** (`#ffffff`): `--color-white`. Header, form fields, modal content, date widgets, and cards derived from commerce surfaces.
- **Default Border** (`#8f8f8f`): `--color-secondary`. Outlined buttons, address selectors, and form outlines.
- **Light Divider** (`#e6e6e6`): flatpickr shadow declarations. Softer container outlines where the system avoids heavy borders.

### Shadow Colors

- **Ambient Black 8%** (`rgba(0,0,0,.08)`): flatpickr calendar shadow. Used sparingly for dropdown/calendar elevation.
- **Soft Black 2%** (`rgba(0,0,0,.02)`): prehome title shadow. Used as an atmospheric hover glow, not as generic card depth.
- **Form Focus Black Ring** (`rgb(0,0,0)`): form focus shadow resolved from `--color-primary`.

### Color Philosophy

The palette behaves like a gallery: black defines brand presence, white gives pastry imagery room, and grey handles utility without visual noise. Gold exists for delicacy and premium cues, but the CSS keeps interaction almost entirely monochrome, which makes the brand feel editorial rather than promotional.

## 3. Typography Rules

### Font Family

The self-hosted type system defines `La Grolet`, `Akkurat`, `DIN Condensed`, and `Industrial736 BT`. Use `La Grolet` only for brand/editorial titles and major location labels. Use `Akkurat` for body, navigation, buttons, forms, captions, and commerce UI. `DIN Condensed` is a special-purpose date/month label face with 1px tracking. `Industrial736 BT` is available as `--font-meurice` but appears as a localized brand/location companion rather than a global text style.

No `font-feature-settings` declarations were detected, so do not invent OpenType flags. Tracking is mostly neutral; the notable exceptions are `-0.04em` for large menu title text and `0.02em` for address/body-small editorial copy.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Features | Notes |
|---|---|---:|---:|---:|---:|---|---|
| display-hero | La Grolet | 44px | 400 | 1.2 | 0em | none | Prehome location/collection title |
| display-large | La Grolet | 40px | 400 | 1 | 0em | none | Decorative plus/add glyph scale |
| section-heading | Akkurat | 44px | 400 | 50px | 0em | none | Alert/editorial section heading |
| subheading-large | La Grolet | 34px | 400 | 1 | -0.04em | none | Mobile menu image header label |
| subheading | Akkurat | 25px | 700 | 1.8 | 0.02em | none | Address subtitle treatment |
| body-large | Akkurat | 18px | 400 | 1.5 | 0em | none | Larger content copy derived from CSS scale |
| body | Akkurat | 16px | 400 | 1.375 | 0em | none | Global body |
| body-small | Akkurat | 14px | 400 | 2 | 0.02em | none | Address text and small editorial paragraphs |
| button | Akkurat | 16px | 700 | 55px | 0em | none | Desktop button token |
| button-small | Akkurat | 14px | 300 | 46px | 0em | none | Rounded selector buttons |
| link | Akkurat | 14px | 400 | 1.375 | 0em | none | Menu and utility links |
| caption | Akkurat | 12px | 400 | 1.5 | 0em | none | Cart count/footer compact text |
| caption-small | Akkurat | 10px | 400 | 1.5 | 0em | none | Footer copyright |
| caption-tabular | DIN Condensed | 17px | 600 | 1 | 1px | none | Date picker month/year labels |
| micro | Akkurat | 11px | 400 | 1.5 | 0em | none | Footer language/menu small text |
| nano | Akkurat | 10px | 400 | 1.5 | 0em | none | Lowest legal/copyright scale |
| code-body | monospace | 13px | 400 | 1.5 | 0em | none | Only use when code is unavoidable |

### Principles

- Use `La Grolet` for the moments that should feel like the patisserie's signature, not for routine UI labels.
- Keep default body text in `Akkurat` 16px/400 with `line-height: 1.375`; do not loosen it into a lifestyle-blog rhythm.
- Preserve the brand's tight menu title treatment: `La Grolet` at 34px with `letter-spacing: -0.04em`.
- Use 700 weight for buttons and address subtitles when the CSS asks for direct commercial emphasis.
- Use `DIN Condensed` only for date/month selector labels with 1px tracking; it should not become a general heading font.
- Do not add OpenType feature flags; the source CSS does not define them.

## 4. Components

### Buttons

**Primary Black** (`button-primary`)

- Background: `#000000`
- Text: `#ffffff`
- Border: `#000000`
- Padding: `0px 15px`
- Radius: `10px`
- Font: `16px Akkurat weight 700`
- Hover: `#ffffff` background, `#000000` text, `#000000` border
- Use: Primary commerce actions and decisive booking/purchase CTAs.

**Primary Black Hover** (`button-primary-hover`)

- Background: `#ffffff`
- Text: `#000000`
- Border: `#000000`
- Padding: `0px 15px`
- Radius: `10px`
- Use: Explicit hover state for primary black buttons.

**Secondary Outline** (`button-secondary`)

- Background: `transparent`
- Text: `#000000`
- Border: `#8f8f8f`
- Padding: `0px 15px`
- Radius: `10px`
- Font: `16px Akkurat weight 400`
- Hover: border sharpens to `#000000`
- Use: Lower-emphasis links inside CMS and commerce flows.

**Secondary Outline Hover** (`button-secondary-hover`)

- Background: `transparent`
- Text: `#000000`
- Border: `#000000`
- Padding: `0px 15px`
- Radius: `10px`
- Use: Explicit hover state for secondary outline buttons.

**Ghost Continue** (`button-ghost`)

- Background: `transparent`
- Text: `#000000`
- Border: `#000000`
- Padding: `0px 15px`
- Radius: `10px`
- Font: `16px Akkurat weight 300`
- Hover: `#000000` background with `#ffffff` text
- Use: Continue/step actions where the CTA starts quiet and becomes filled on hover.

**Rounded Selector** (`button-rounded`)

- Background: `transparent`
- Text: `#000000`
- Border: `#8f8f8f`
- Padding: `0px`
- Radius: `50px`
- Font: `14px Akkurat weight 300`
- Use: Pill-like option selectors. This is a named exception; default extracted button radius is `0px`, while the branded `.button` token radius is `10px`.

### Cards & Containers

**White Utility Card** (`card`)

- Background: `#ffffff`
- Border: `#e6e6e6`
- Radius: `6px`
- Shadow: `0 3px 13px rgba(0,0,0,.08)`
- Padding: `20px`
- Use: Derived utility container for preview/tooling. The source does not define a formal `.card`; this atom follows calendar/account/alert surface evidence.

### Inputs & Forms

**Editorial Underline Input** (`input-text`)

- Background: `#ffffff`
- Text: `#353535`
- Border: `#353535`
- Radius: `0px`
- Padding: `6px 5px 12px`
- Font: `13px Akkurat weight 400`
- Focus: `1px solid rgba(53,53,53,.25)` outline
- Use: Editorial form labels and lightweight contact-style fields.

**Filled Form Input** (`input-filled`)

- Background: `#ffffff`
- Text: `#000000`
- Border: `transparent`
- Radius: `6px`
- Padding: `0px 20px`
- Font: `14px Akkurat weight 400`
- Focus: `0 0 0 .2rem rgb(0,0,0)` ring
- Use: Account, checkout, and authentication form fields.

### Badges / Tags / Pills

**Header Banner Badge** (`badge-default`)

- Background: `#000000`
- Text: `#ffffff`
- Border: `transparent`
- Radius: `0px`
- Padding: `5px 20px`
- Font: `14px Akkurat weight 400`
- Use: Announcement strips and compact promotional labels. There is no dedicated `.badge` class in the source CSS.

**Alert Error** (`alert-error`)

- Background: `#feebc8`
- Text: `#e32d2d`
- Border: `transparent`
- Radius: `6px`
- Padding: `5px 20px`
- Font: `14px Akkurat weight 400`
- Use: Error or warning messaging where the system needs warmth instead of stark red blocks.

### Navigation

**Sticky Header** (`nav-header`)

- Background: `#ffffff`
- Text: `#000000`
- Border bottom: `transparent`
- Backdrop filter: `none`
- Height: `64px`
- Use: Main sticky navigation. Keep it white and solid; the detected blur tokens are not part of the header rule.

**Header Banner** (`nav-header-banner`)

- Background: `#000000`
- Text: `#ffffff`
- Border bottom: `transparent`
- Height: `28px`
- Use: Top announcement strip, especially for booking/shop notices.

### Decorative Elements

The prehome surface relies on full-bleed photography, black/white title overlays, and a custom cream hover color `#f1e4b2` for special entries. The system also uses underline animations for desktop menu links, image scrims via black alpha gradients, and minimal slider dots (`#dddddd` to `#8f8f8f`). Tooltip, avatar, and formal tab tokens are not defined; if needed, derive them from `Akkurat`, the 6px radius, and monochrome border system.

## 5. Layout Principles

### Spacing System

The practical spacing scale is moderate and commerce-oriented: `5px`, `10px`, `15px`, `20px`, `25px`, `40px`, and `50px`. Container padding starts at `15px`, grows to `25px` on wide screens, and header desktop padding uses `20px 40px`.

### Grid & Container

The canonical container tokens are `--container-width: 1630px`, `--container-small-width: 1200px`, and `--container-tiny-width: 880px`, with contextual overrides to `1260px` and `1420px` for `introHome`. The prehome page behaves as a location selector driven by image panels and centered brand titles rather than a conventional marketing grid.

Multi-column behavior appears in address and product-choice contexts: `.addresses--2-col` switches to two columns, product rows use `--columns`, and responsive gaps move from `20px` to `50px` in tablet/desktop contexts.

### Whitespace Philosophy

Whitespace is not airy in a generic lifestyle sense; it is controlled around large imagery, sticky navigation, and commerce modules. The CSS spends more effort on precise header, form, and selector spacing than on decorative section padding, which keeps the page direct and transactional despite its luxury tone.

### Border Radius Scale

- `0px`: Extracted default for buttons and text inputs; use for underline/editorial fields and reset controls.
- `1px`: Editorial submit button radius, nearly square.
- `4px`: Mobile burger open state.
- `6px`: Account navigation, alerts, and filled form fields.
- `10px`: Canonical `.button` token radius.
- `50px`: Rounded selector buttons.
- `9999px`: Date widget pill fields.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | `background: #ffffff`, no shadow | Header, forms, primary content surfaces |
| Ambient | `0 0 6.3rem 0 rgba(0,0,0,.02)` | Prehome title hover atmosphere |
| Standard | `0 3px 13px rgba(0,0,0,.08)` plus `#e6e6e6` hairlines | Calendar/dropdown style utility surfaces |
| Elevated | `0 3px 6px rgba(0,0,0,.08)` | Small overlays and compact floating UI |
| Deep | `rgba(0,0,0,.75)` modal overlay | Full-screen blocking modal contexts |
| Ring | `0 0 0 .2rem rgb(0,0,0)` or `1px solid rgba(53,53,53,.25)` | Form focus and keyboard focus |

### Shadow Philosophy

Depth is functional, not decorative. Cedric Grolet's system uses black alpha shadows for dropdowns, calendars, and focus visibility, while brand surfaces stay mostly flat so photography and typography carry the premium feel. Do not add layered card shadows across the site; the strongest depth belongs to overlays and interaction rings.

## 7. Do's and Don'ts

### Do's

- Do use `#000000` as the brand and CTA anchor; it is the identity color from `--color-primary`.
- Do keep primary buttons in the black-to-white inversion pattern defined by `.button--primary`.
- Do use `La Grolet` for prehome/location titles and high-brand editorial labels.
- Do use `Akkurat` for all operational UI: forms, checkout, navigation, buttons, body, and captions.
- Do preserve the 10px `.button` radius for standard CTAs and the 50px radius only for `.button--rounded` selectors.
- Do use `#8f8f8f` for secondary borders and muted UI, not as a washed-out replacement for brand black.
- Do reserve `#c5a97a` and `#f1e4b2` for premium or special moments.

### Don'ts

- Don't make gold `#c5a97a` the primary CTA color; Cedric Grolet's action system is black and white.
- Don't replace `La Grolet` headlines with a generic serif or a heavy sans; the custom face is the brand signature.
- Don't apply `La Grolet` to body copy, forms, or checkout controls; those belong to `Akkurat`.
- Don't use blue `#1199ff` as a brand accent; it only appears as a focus/browser-widget artifact.
- Don't round every component into pills; only date widgets and `.button--rounded` use very large radii.
- Don't add backdrop-blur to the sticky header; `.header` is a solid white surface despite global blur detections elsewhere.
- Don't add large layered shadows to product or editorial surfaces; the source uses light utility shadows and flat white space.
- Don't loosen menu heading tracking; the 34px `La Grolet` menu title uses `letter-spacing: -0.04em`.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---:|---|
| Mobile base | 0px | Single-column layouts, burger menu, 15px container padding |
| Small mobile | 375px | Minor narrow-device adjustments |
| Tablet | 768px | Desktop menu appears, header grid changes, multi-column address/shop patterns begin |
| Commerce desktop | 992px | Button height moves to 55px, introHome container overrides, desktop-only controls appear |
| Wide | 1280px | Container padding becomes 25px, editorial form inputs increase padding/font size |
| Large desktop | 1530px | Container width increases to 1420px in introHome and 14px footer menu text appears |
| Ultra wide | 1710px | Rare large-screen refinements in collected CSS |

### Touch Targets

Standard buttons are 50px high on mobile and 55px on desktop. Rounded selectors are 46px high. Form fields are generally 50px high, while product variant selects are 40px high. The mobile burger is visually 20px by 19px, but it sits in the larger header hit area.

### Collapsing Strategy

Desktop navigation is inline from `768px`; below that, the menu becomes a full-width slide-out layer under the sticky header. Header grid areas collapse from desktop `"n j l m"` to mobile `"l j m"`. Account navigation turns into a select-like active row on mobile, while address and choice grids collapse to one column.

### Image Behavior

Prehome and menu images use full-bleed cover behavior with overlays. Mobile gets portrait-oriented media where available, while desktop uses landscape images. Product/editorial media containers rely on aspect-ratio-like custom variables such as `--item-height` rather than fixed pixel heights.

## 9. Agent Prompt Guide

### Quick Color Reference

- Primary CTA: Cedric Grolet Black (`#000000`)
- CTA Hover: Inverted White (`#ffffff`) with black text (`#000000`)
- Background: Soft Grey (`#f6f6f6`)
- Surface: Pure White (`#ffffff`)
- Heading text: Brand Black (`#000000`)
- Body text: Brand Black (`#000000`)
- Muted text: Secondary Grey (`#8f8f8f`)
- Border: Secondary Grey (`#8f8f8f`)
- Light divider: Divider Grey (`#e6e6e6`)
- Luxury accent: Gold (`#c5a97a`)
- Form text: Editorial Charcoal (`#353535`)
- Error: Error Red (`#e32d2d`)

### Example Component Prompts

> Create a Cedric Grolet hero selector on a full-bleed pastry photograph. Center the title in `La Grolet` at 44px weight 400, line-height 1.2, color #ffffff, no letter spacing. Add a black image scrim using rgba(0,0,0,.4). Keep supporting navigation in `Akkurat` 14px weight 400, white or black depending on surface.

> Create a primary CTA button using #000000 background, #ffffff text, #000000 border, 10px radius, 0px 15px padding, 55px line-height, `Akkurat` 16px weight 700. On hover invert to #ffffff background and #000000 text while keeping the #000000 border.

> Create a secondary outline button on white with transparent background, #000000 text, #8f8f8f border, 10px radius, 0px 15px padding, `Akkurat` 16px weight 400. On hover change only the border to #000000.

> Create an editorial form field using transparent or #ffffff background, #353535 text, a 1px #353535 bottom border, 0px radius, 6px 5px 12px padding, `Akkurat` 13px weight 400. Focus state uses `1px solid rgba(53,53,53,.25)` outline, not a colored brand glow.

> Create a sticky header with #ffffff background, #000000 text, no blur, no visible bottom border, and desktop padding 20px 40px. Menu links are `Akkurat` 14px weight 400 and show a 1px currentColor underline animation on hover/current.

> Create a dark announcement strip using #000000 background, #ffffff text, `Akkurat` 14px weight 400, and 5px 20px padding. Links inside the strip remain #ffffff and underlined.

> Create a utility card only when a framed container is unavoidable: #ffffff background, #e6e6e6 border, 6px radius, 20px padding, and a subtle `0 3px 13px rgba(0,0,0,.08)` shadow. Keep cards sparse because the source does not define a formal card system.

### Iteration Guide

1. Start every Cedric Grolet composition with black, white, and grey; add gold only after the monochrome hierarchy is working.
2. Use `La Grolet` for brand titles, then immediately return to `Akkurat` for controls and copy.
3. Primary CTA hover must invert black and white; do not invent a darker black or gold hover state.
4. Keep standard CTAs at 10px radius, but set preview/default extracted button radius to 0px when matching raw component extraction.
5. Use `#8f8f8f` for secondary outlines and muted copy; use `#e6e6e6` for softer hairline dividers.
6. For forms, choose between filled 50px white fields with 6px radius and editorial underline fields with 0px radius; do not blend the two.
7. Mobile navigation should become a solid white slide-out layer, not a translucent glass menu.
8. Treat shadows as utility evidence: light dropdown/calendar shadows are acceptable, but broad card elevation weakens the brand's flat editorial restraint.
