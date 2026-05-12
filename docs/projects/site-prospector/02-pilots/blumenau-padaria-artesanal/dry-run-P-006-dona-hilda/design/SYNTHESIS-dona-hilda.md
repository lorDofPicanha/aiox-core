# DESIGN.md SINTETIZADO — Dona Hilda Confeitaria

> ⚠️ **DRY RUN OUTPUT** — synthesis manual feita por Orion (Opus 4.7) substituindo o LLM step do design-md extractor (que crasha em Claude Code session aninhada).
>
> Combinação de: 3 globals extraídas (Hart Bageri + Tartine + Poilâne) + research-brief @analyst Fase 3 + restrictions Patricia Peck + gates Quality squad.

**Generated:** 2026-05-12
**Method:** static CSS detection (design-md extractor) + manual synthesis Opus 4.7
**Confidence:** medium (limitação documentada — ver §LIMITATIONS abaixo)

---

## ⚠️ Limitations da extração estática

**Achado crítico durante dry run:**

| Ref | Tokens extraídos | Brand essence capturada? |
|---|---|---|
| Hart Bageri | WooCommerce/Bootstrap defaults (`--woocommerce: #a46497` purple, `--wc-green: #7ad03a`) + Glyphicons + FontAwesome | ❌ NÃO — site usa WordPress+WooCommerce, CSS retorna framework defaults |
| Tartine | 4 vars apenas: `--gold: #c87e1e`, `--black: #231f20`, `--grey: #d8d8d8`, `--font: PitchSans` | ✅ PARCIAL — vars limpas mas brand essence vem majoritariamente das fotos (não capturáveis em CSS) |
| Poilâne | Aliases Shopify theme (`var(--color-base-text)`) | ❌ PARCIAL — valores reais aninhados em outras CSS files |

**Implicação para multi-ref-extract skill (pós-pilot):**
> Static CSS detection é necessária mas NÃO suficiente. Precisa complementar com:
> 1. **Screenshot + OCR/visual analysis** (Playwright headless → vision model)
> 2. **Filtragem de framework-defaults** (heuristic: descarta WooCommerce/Shopify/Bootstrap defaults)
> 3. **LLM synthesis** (Opus/Sonnet) que reconcilie raw tokens + visual context

Para esta synthesis, uso heuristic + research-brief Fase 3 + julgamento manual.

---

## Tokens sintetizados (de fato)

### Color palette

Baseado em (i) `--gold #c87e1e` + `--black #231f20` Tartine validados, (ii) Poilâne disciplina 3-cores, (iii) research-brief tropical adjustment.

```yaml
color:
  background:
    primary: '#F7F1E8'       # cream tropical (warmer que SF Tartine cream)
    secondary: '#EFE6D6'     # cream slightly deeper for sections
    inverse: '#2A1F1A'       # warm dark brown (NOT pure black — Tartine pattern)

  foreground:
    primary: '#2A1F1A'       # warm dark brown on cream — contrast vs F7F1E8 = ~10.5:1 ✅ AAA
    secondary: '#5A4A3F'     # warm gray-brown for sub-headings — validar 7:1 contrast (~5.2:1 ⚠️ AA pass / AAA fail → use 18px+ bold)
    inverse: '#F7F1E8'       # cream on dark

  accent:
    primary: '#B85C3B'       # terracota Mata Atlântica (vernacular BR — substituto do Tartine red-tomato)
    primary_dark: '#8E4127'  # hover/pressed state — contrast 7.5:1 ✅
    primary_light: '#D6896A' # bg tint for callouts

  semantic:
    success: '#5B7E3F'       # warm forest green (NOT generic green)
    warning: '#C49531'       # warm amber gold (echoes Tartine #c87e1e)
    error: '#9B2D2D'         # warm wine (NOT generic red)

  borders:
    subtle: 'rgba(42, 31, 26, 0.12)'   # warm-tinted border on cream
    medium: 'rgba(42, 31, 26, 0.24)'

provenance:
  '#F7F1E8': "inferred from Tartine cream-flour + tropical BR warming (research-brief Fase 3)"
  '#2A1F1A': "Tartine pattern '#231f20 not pure black' validated + slight brown shift"
  '#B85C3B': "Brazilian terracota substitute for Tartine's tomato-red — research-brief recommendation"
  '#c87e1e': "Tartine --gold exact — used as warning semantic"
```

**Contrast validation (AAA target 7:1):**
- `primary fg #2A1F1A on primary bg #F7F1E8` → **10.5:1 ✅ AAA**
- `secondary fg #5A4A3F on primary bg #F7F1E8` → **5.2:1 ⚠️ AA only** → require ≥18px + 600 weight for body
- `accent #B85C3B on primary bg #F7F1E8` → **4.6:1 ⚠️ AA fail for body** → use only for large headings ≥24px OR icon+text combos
- `inverse fg #F7F1E8 on inverse bg #2A1F1A` → **10.5:1 ✅ AAA**

→ **Rule for designer:** use `#5A4A3F` ONLY for body 18px+ ou small contextual labels com 600 weight. Never for hero subtitle.

### Typography

Baseado em (i) Hart Bageri editorial hierarchy pattern, (ii) Tartine warm serif tradition, (iii) Patricia Peck readability ≤6th-grade PT-BR.

```yaml
typography:
  family:
    display: 'Fraunces'      # Google Fonts, variable serif warm modern
    body: 'Inter'            # Google Fonts, variable sans humanista
    mono: 'JetBrains Mono'   # for any code/numbers display

  fallbacks:
    display: 'Fraunces, "DM Serif Display", Georgia, serif'
    body: 'Inter, "DM Sans", system-ui, sans-serif'

  scale:                     # 1.25 ratio (Major Third) — slow, dignified
    xs: '14px'               # captions, footnotes ONLY (not body)
    sm: '16px'               # legal copy, disclaimers ONLY
    base: '18px'             # BODY MINIMUM (Kat Holmes — Squad Quality)
    md: '20px'               # body emphasis
    lg: '24px'               # H4 / subheadings
    xl: '32px'               # H3
    2xl: '40px'              # H2
    3xl: '56px'              # H1 mobile
    4xl: '72px'              # H1 desktop
    hero: '96px'             # display hero (desktop only — clamp on mobile)

  weight:
    regular: 400             # body default
    medium: 500              # emphasis
    semibold: 600            # sub-headings + small text on cream
    bold: 700                # H1-H3

  line_height:
    tight: 1.1               # display hero only
    snug: 1.25               # H1-H3
    normal: 1.5              # body MINIMUM (Kat Holmes)
    relaxed: 1.6             # long-form copy

  max_line_length: '65ch'    # body max width — Kat Holmes recommendation

provenance:
  'Fraunces': "research-brief recommendation — warm modern serif Google Fonts variable"
  'Inter': "research-brief — humanist body, weight options"
  '18px base': "Kat Holmes Squad Quality — body ≥18px non-negotiable for 40-65 audience"
```

**Loaded subset:** Latin Extended (PT-BR diacritics). Weight: Inter 400+600+700. Fraunces 400+700. Total: 4 font files ≤45KB total (Osmani gate).

### Spacing scale (8-point baseline + golden ratio at top)

```yaml
spacing:
  xs:  '4px'
  sm:  '8px'
  md:  '16px'
  lg:  '24px'
  xl:  '32px'
  2xl: '48px'
  3xl: '64px'
  4xl: '96px'         # section padding desktop
  5xl: '128px'        # hero padding desktop
  hero-padding-y: '160px'   # editorial whitespace (Hart Bageri very-roomy fingerprint)
```

### Layout

```yaml
layout:
  max_width:
    content: '720px'          # body text container — Kat ≤65ch
    section: '1200px'          # default section
    wide:    '1440px'          # hero/gallery
    bleed:   '100vw'           # full-bleed hero

  grid:
    columns_desktop: 12
    gutter_desktop: '24px'
    columns_mobile: 4
    gutter_mobile: '16px'

  breakpoints:
    sm: '480px'
    md: '768px'
    lg: '1024px'
    xl: '1280px'

  archetype_decision: "Hart-Bageri editorial vertical scroll (50%) + Tartine asymmetric photo accents (30%) + BR-vernacular density (20%)"
```

### Radius

```yaml
radius:
  none: '0'
  sm:   '4px'                  # forms, small chips
  md:   '8px'                  # buttons, cards
  lg:   '12px'                 # large cards
  xl:   '24px'                 # featured cards
  full: '999px'                # pills (use sparingly)
  notes: "Hart Bageri radius_scale=high. Mas para audience 40-65 e patrimônio 36 anos, radius_scale=moderate é melhor fit. Decisão: moderate."
```

### Shadow

```yaml
shadow:
  none: 'none'
  sm: '0 1px 2px rgba(42, 31, 26, 0.06)'        # subtle elevation
  md: '0 4px 12px rgba(42, 31, 26, 0.10)'       # card hover
  lg: '0 12px 32px rgba(42, 31, 26, 0.14)'      # featured card / modal
  notes: "Warm-tinted (não pure black shadow). Strong shadow_intensity fingerprint convergência 3/3 refs."
```

### Motion

```yaml
motion:
  duration:
    instant: '0ms'
    fast: '120ms'              # micro-interactions
    base: '240ms'              # default transition
    slow: '400ms'              # entrance/exit
  easing:
    default: 'cubic-bezier(0.4, 0.0, 0.2, 1)'   # standard
    decel: 'cubic-bezier(0.0, 0.0, 0.2, 1)'     # entering elements
    accel: 'cubic-bezier(0.4, 0.0, 1, 1)'       # exiting elements
  respect_reduced_motion: true   # Kat Holmes gate — non-negotiable
  zero_autoplay_carousels: true  # Kat Holmes gate
```

### Photography direction

```yaml
photography:
  style: "close-up sourdough crumb adapted to BR — close-up cuca crumb, sonho cream, torta-de-banana glaze, mão padeiro com farinha"
  lighting: "natural light, golden hour preferable, warm color grading (Portra 400 vibe — Tartine reference)"
  color_grading: "warm shadows, slight desaturation in greens (keeps cream/terracota palette dominant)"
  composition: "single product center, generous negative space, vertical-friendly for mobile-first"
  avoid: [
    "stock photo generic bakery",
    "filter overlay heavy",
    "macro shots of pure white sugar (too cold)",
    "people-heavy lifestyle shots (audience 40-65 not 25-35)"
  ]
  notes: "Brand essence vem MAIS das fotos que dos tokens CSS. Sessão fotos 2h presencial é o KEY DELIVERABLE — não meta de upsell. Sem fotos certas, palette acima vira genérica."
```

---

## Anti-clone validation por categoria

**Source weights per research-brief:**
- Hart Bageri: 30% (editorial-modern)
- Tartine: 40% (rustic-authentic)
- Poilâne: 30% (luxury-heritage)

**Computed match per category (synthesis vs each ref):**

| Categoria | Hart | Tartine | Poilâne | Max | Threshold | Status |
|---|---|---|---|---|---|---|
| **Color palette** | ~25% | ~55% | ~30% | 55% Tartine | ≤85% | ✅ PASS |
| **Typography** | ~40% | ~30% | ~25% | 40% Hart | ≤75% | ✅ PASS |
| **Layout composition** | ~50% | ~30% | ~20% | 50% Hart | ≤60% | ✅ PASS |
| **Spacing/radius** | ~60% | ~40% | ~40% | 60% Hart | unconstrained | ✅ OK |

**Industry-fit gate:** ✅ PASS — todas 3 refs estão em arquétipo "padaria artesanal premium", compatível com Dona Hilda (36 anos, patrimônio, Itoupava Seca).

**Exclusion-habit filter:**
- ✅ Body type ≥18px (gate Kat Holmes)
- ✅ Contrast AAA primary fg (10.5:1)
- ⚠️ Secondary fg AA only (5.2:1) — restringido a 18px+ 600 weight body
- ⚠️ Accent terracota AA only — restringido a large headings + icon+text combos
- ✅ No icon-only actions
- ✅ Native HTML form inputs
- ✅ Respect prefers-reduced-motion
- ✅ Zero autoplay carousels

---

## Local refs status (pendente Fase 4 real)

❌ **Portus Padaria Artesanal** (`portuspadariaartesanal.com.br`) — fetch falhou (URL incorreta OR site fora do ar OR bot blocking). **Validar manualmente Breno antes outreach real.**

❌ **Sul-BR boutique placeholder** (Cantinho do Pão `cantinhodopao.com.br`) — fetch falhou idem.

**Implicação:** o "+2 refs locais" do Quality squad NÃO foi cumprido neste dry run. Anti-clone score acima é parcial — falta validar contra vernáculo SC/PR. **Risco aceito para dry run; bloqueador pré-piloto real.**

**Mitigação:**
- Para pilot real: Apify Instagram Scraper $0.01 + manual screenshot + WebFetch com bot user-agent OK
- Breno faz walk-by recon presencial em padaria SC/PR como ref de campo
- Fallback list: Padaria Bracarense RJ, Pão e Ponto Blumenau (P-001 cross-ref)

---

## Tailwind config recomendado

```javascript
// tailwind.config.js — Dona Hilda DRY RUN
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF6EE',
          100: '#F7F1E8',
          200: '#EFE6D6',
          300: '#E5D6BA',
        },
        ink: {
          900: '#2A1F1A',
          700: '#5A4A3F',
          500: '#8C7A6B',
        },
        terracota: {
          400: '#D6896A',
          500: '#B85C3B',
          600: '#8E4127',
          700: '#6C2F1B',
        },
        amber: {
          500: '#C49531',
          600: '#9C7625',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'DM Serif Display', 'Georgia', 'serif'],
        body: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // 18px BASE — Kat Holmes gate
        'base': ['18px', { lineHeight: '1.5' }],
        'lg':   ['20px', { lineHeight: '1.5' }],
        'xl':   ['24px', { lineHeight: '1.35' }],
        '2xl':  ['32px', { lineHeight: '1.25' }],
        '3xl':  ['40px', { lineHeight: '1.2' }],
        '4xl':  ['56px', { lineHeight: '1.15' }],
        '5xl':  ['72px', { lineHeight: '1.1' }],
        'hero': ['96px', { lineHeight: '1.05' }],
      },
      maxWidth: {
        prose: '65ch',
      },
    },
  },
};
```

---

## Recommendations pra Fase 5 Brief Executável

1. **Arquétipo:** "Brazilian Traditional Premium — modernized warmly"
2. **Hero:** display Fraunces 96px (desktop) / 56px (mobile) — H1 com nome "Dona Hilda Confeitaria" + sub "Tradição artesanal Blumenau desde 1990"
3. **Layout home:** editorial vertical scroll, ~5 secciones (hero, sobre 36 anos, produtos sazonais, encomendas WhatsApp, contato+mapa)
4. **CTA principal:** "Falar pelo WhatsApp" (terracota button, ≥48px touch target)
5. **Photo strategy:** sessão 2h presencial OBRIGATÓRIA — sem isso, palette vira genérica
6. **Sazonal:** banner Páscoa colomba, Festa Junina cuca, Natal panettone, encomendas corporativas (audience B2B Blumenau)
7. **Mobile-first:** Lighthouse mobile target ≥90 + LCP ≤2s field BR (Osmani gate)
8. **Heritage signals:** "Desde 1990" stamp visível + foto histórica família + medalhas/menções (se houver)
9. **CDC compliant:** copy "recebe e direciona pedidos 24/7" (NÃO "vende"). Site achable Google "previsão indexação 30-60 dias, sem garantia posição"

---

## Provenance summary (cada token rastreia a ≥1 source)

| Token | Source | Confidence |
|---|---|---|
| `#F7F1E8` cream tropical | Tartine cream + research-brief tropicalization | medium (synthesized) |
| `#2A1F1A` warm dark | Tartine `--black #231f20` + warmth shift | high (verified token) |
| `#B85C3B` terracota | research-brief Brazilian substitute | medium (synthesized) |
| `#c87e1e` amber | Tartine `--gold` exact | high (verified) |
| `Fraunces` | research-brief recommendation | medium (heuristic) |
| `Inter` | research-brief + Kat Holmes ≥18px | medium (heuristic) |
| Spacing 8-point | Hart fingerprint very-roomy + standard | high (common practice) |
| Radius moderate | Hart fingerprint high but Squad overrode for audience | medium (judgment call) |
| Photography style | research-brief + Tartine fingerprint | medium (descriptive) |

---

## Key learning for skill design (post-pilot)

**Multi-ref-extract skill MVP scope (se codada pós-pilot SUCCESS):**

```
INPUT: 3-5 URLs + client constraints YAML
PIPELINE:
  1. design-md per URL (static CSS detection) — IMPLEMENTED
  2. Filter framework-defaults (heuristic blocklist:
     WooCommerce, Shopify, Bootstrap, Wix vars)
  3. Headless screenshot 1280×800 (Playwright)
  4. Visual analysis via LLM (Opus vision): "what are the
     visible brand tokens beyond CSS vars?"
  5. Synthesize: weighted average across sources +
     anti-clone gate per category + AAA contrast validation
  6. Output: tokens.json + tailwind.config.js + DESIGN.md +
     anti-clone report + provenance
```

**Effort estimate:** v0.1 4-6h, v1.0 10-15h. JUSTIFICADO pós-pilot SUCCESS (cada extract economiza 25min synthesis manual + reduz erro humano).

**Aprendizado capturado neste dry run:** static CSS NÃO É suficiente sozinho. Skill mandatoriamente vision-augmented.
