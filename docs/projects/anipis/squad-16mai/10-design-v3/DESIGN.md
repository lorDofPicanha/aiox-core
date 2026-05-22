---
version: alpha
name: Anipis v3 — Pergaminho Clínico
description: |
  Companion clínico-AI brasileiro de saúde mental. Direção fresh 2026-05-16
  baseada em síntese de 5 referências refero (Granola, Hume AI, Ease Health,
  Equals, Aboard) — NÃO copia, sintetiza padrões convergentes em direção
  própria pro alvo "Júlia" 18-29 BR.

  North Star: "Caderno clínico aberto à luz da manhã".
  Editorial-warm sobre parchment, serif autoridade peso leve, 1 verde-musgo
  grounding, mood pastels categorizing only, alarm color reservado a crise.
  Adjunto não substituto — visual reforça seriedade clínica sem cair em
  wellness fluffy nem brutalist intimidante.

references:
  granola: "Field notes parchment + serif editorial gravity + organic green ink"
  hume-ai: "Warm pastel research lab + soft + scientific + human-centered"
  ease-health: "Calm clinical canvas + forest green grounding"
  equals: "Editorial serif authority + warm cream + horizontal rules"
  aboard: "Warm earth + dark steel (dark mode reference)"

colors:
  # CANVAS (consenso 5/5 — warm off-white, nunca pure white)
  canvas: "#F7F4ED"           # Pergaminho Clínico — slight cream, sem amarelado SaaS
  surface: "#FFFFFF"          # Cards + elevated overlays
  surface-sunken: "#EFEAE0"   # Input bg + secondary cards (Granola Fog Surface analog)

  # INK (warm-tinted near-black, nunca pure #000)
  ink: "#1A1814"              # Primary headings + body — warm undertone
  ink-soft: "#3D3A35"         # Secondary text + nav (Granola Charcoal analog)
  ink-muted: "#76726B"        # Captions + metadata + helper text
  ink-disabled: "#A8A39B"     # Disabled state + tertiary

  # BORDERS (hairline only, Granola/Aboard consenso)
  border-hair: "#E8E2D4"      # Default hairline 0.5-1px
  border-strong: "#D5CFC0"    # Card boundaries + focused inputs
  border-divider: "#1A1814"   # Horizontal section dividers (Equals pattern, used sparingly)

  # BRAND (1 cor única grounded — verde-musgo BR-aware)
  brand: "#2F5235"            # Anipis Verde-Musgo — forest green grounding, cura sem clichê
  brand-deep: "#1F3823"       # Hover/pressed
  brand-soft: "#D4E0CE"       # Subtle pill backgrounds + secondary CTAs
  brand-wash: "#EBF1E6"       # Sectional surface accent (raro)

  # MOOD PASTELS (Hume pattern — categorization only, nunca decoração)
  # Aplicado a mood checkin chips + journal categories + memory tags
  mood-calm: "#CFE0E8"        # Azul-céu — calmo/quieto
  mood-joy: "#F4D9C2"         # Apricot suave — feliz/satisfeito
  mood-tender: "#F0D5DC"      # Rosado terno — triste/melancólico (acolher, não alarmar)
  mood-clear: "#E0DDE8"       # Lavanda fria — confuso/disperso
  mood-bright: "#E5E5C0"      # Limão acinzentado — energizado/inquieto
  mood-heavy: "#C8C5BD"       # Pedra cinza — pesado/sem-energia (anti-streak, válido)

  # ALARM (Equals pattern — exclusivo crisis routing CVV banner)
  alarm-bg: "#FFE17A"         # Âmbar urgente, NÃO vermelho (evita ativação trauma)
  alarm-ink: "#3B2D04"        # Ink sobre âmbar
  alarm-stroke: "#8C6B0F"

  # CRISIS-RED (exclusivo escalation RED level — CVV/SAMU CTA)
  crisis: "#A1311F"           # Terracota grave, NÃO vermelho-sangue
  crisis-bg: "#F6E0DC"        # Background callout sutil

  # SUCCESS / INFO (semantic, contidos)
  success: "#3F6A4A"
  info: "#2F4F66"

typography:
  # DISPLAY — Editorial serif peso leve (consenso Granola/Equals/Ease/Aboard)
  display-xl:
    fontFamily: "Tobias, 'Sentinel Display', 'Times New Roman', serif"
    fontSize: 64px
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: -0.015em

  display-lg:
    fontFamily: "Tobias, 'Sentinel Display', 'Times New Roman', serif"
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: -0.012em

  # H1-H3 — Editorial serif continua
  h1:
    fontFamily: "Tobias, 'Sentinel Display', 'Times New Roman', serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.01em

  h2:
    fontFamily: "Tobias, 'Sentinel Display', 'Times New Roman', serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.005em

  h3:
    fontFamily: "Tobias, 'Sentinel Display', 'Times New Roman', serif"
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1.3

  # H4-H6 — Switch pra humanist sans (UI gravity)
  h4:
    fontFamily: "Inter, 'Suisse Int'l', system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0

  # BODY — Humanist sans (Ease Suisseintl / Hume Fellix / Granola Melange consenso)
  body-lg:
    fontFamily: "Inter, 'Suisse Int'l', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.65

  body:
    fontFamily: "Inter, 'Suisse Int'l', system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6

  body-sm:
    fontFamily: "Inter, 'Suisse Int'l', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55

  label:
    fontFamily: "Inter, 'Suisse Int'l', system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em

  caption:
    fontFamily: "Inter, 'Suisse Int'l', system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.05em

  # PULL-QUOTE — Serif italic editorial moment (raro)
  pullquote:
    fontFamily: "Tobias, 'Sentinel Display', serif"
    fontSize: 22px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.4
    letterSpacing: -0.008em

  # MONO — Captured timestamps + technical data only
  mono:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  none: 0
  xs: 4px
  sm: 8px            # default cards (Granola/Aboard consenso)
  md: 12px           # input fields + medium containers
  lg: 16px           # modais
  pill: 9999px       # CTA buttons + pills (Granola/Aboard/Hume consenso)

spacing:
  px: 1
  half: 4
  1: 8               # base unit (Aboard 8px consenso)
  2: 16
  3: 24              # padding card default (Granola/Hume consenso)
  4: 32
  5: 48
  6: 64              # section gap (Granola/Aboard consenso)
  7: 96
  8: 128             # hero breathing

elevation:
  # NUNCA shadows heavy (consenso 5/5 against)
  none: "none"
  hairline: "0 0 0 1px var(--anipis-border-hair)"
  card: "0 1px 0 var(--anipis-border-hair)"  # bottom hairline only
  popover: "0 4px 12px rgba(26, 24, 20, 0.06)"  # ÚNICA sombra leve, nav dropdowns

motion:
  # Calm-first motion language. Prefers-reduced-motion = total disable.
  duration-quick: 120ms       # micro-interactions
  duration-base: 240ms        # default transitions
  duration-slow: 480ms        # entrance + dismiss
  duration-breath: 4000ms     # breathing exercise core
  ease-out: cubic-bezier(0.2, 0.8, 0.2, 1)
  ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)

components:
  button-primary:
    bg: "{colors.brand}"
    text: "{colors.surface}"
    radius: "{rounded.pill}"
    typography: "{typography.label}"
    padding: "12px 24px"
    transform: none           # NUNCA uppercase (Granola/Ease)

  button-secondary:
    bg: "{colors.brand-soft}"
    text: "{colors.brand-deep}"
    radius: "{rounded.pill}"
    typography: "{typography.label}"
    padding: "12px 24px"

  button-ghost:
    bg: transparent
    text: "{colors.ink}"
    border: "1px solid {colors.border-strong}"
    radius: "{rounded.pill}"
    typography: "{typography.label}"
    padding: "12px 24px"

  input-text:
    bg: "{colors.surface}"
    text: "{colors.ink}"
    border: "1px solid {colors.border-strong}"
    radius: "{rounded.md}"
    padding: "12px 16px"
    typography: "{typography.body}"

  card-content:
    bg: "{colors.surface}"
    border: "1px solid {colors.border-hair}"
    radius: "{rounded.sm}"
    padding: "24px"

  card-mood:                  # mood checkin chip
    bg: "{colors.mood-calm}"  # one of mood-* variations
    text: "{colors.ink}"
    border: "1px solid {colors.border-hair}"
    radius: "{rounded.pill}"
    padding: "8px 14px"
    typography: "{typography.label}"

  chat-bubble-companion:
    bg: "{colors.surface}"
    text: "{colors.ink}"
    border: "1px solid {colors.border-hair}"
    radius: "{rounded.sm}"
    radius-tail: 2px         # asymmetric tail bottom-left
    padding: "14px 18px"
    typography: "{typography.body}"

  chat-bubble-user:
    bg: "{colors.brand-soft}"
    text: "{colors.brand-deep}"
    radius: "{rounded.sm}"
    radius-tail: 2px         # asymmetric tail bottom-right
    padding: "14px 18px"
    typography: "{typography.body}"

  crisis-banner:
    bg: "{colors.alarm-bg}"
    text: "{colors.alarm-ink}"
    border-left: "3px solid {colors.alarm-stroke}"
    radius: "{rounded.xs}"
    padding: "12px 16px"
    typography: "{typography.body}"

  crisis-cta:
    bg: "{colors.crisis}"
    text: "{colors.surface}"
    radius: "{rounded.pill}"
    typography: "{typography.label}"
    padding: "14px 28px"

  divider-section:
    bg: "{colors.border-divider}"
    height: "1px"             # Equals horizontal rule pattern
    margin: "64px 0"

  pull-quote:
    typography: "{typography.pullquote}"
    border-left: "2px solid {colors.brand}"
    padding: "12px 0 12px 20px"
    color: "{colors.ink-soft}"
---

# Anipis v3 — Pergaminho Clínico

## Overview

**North star:** *Caderno clínico aberto à luz da manhã.*

Anipis v3 é uma direção visual nova, sintetizada de 5 marcas referência (Granola, Hume AI, Ease Health, Equals, Aboard) sem copiar nenhuma. O sistema busca uma metáfora central — **o pergaminho clínico** — que comunica três coisas simultaneamente: (a) **autoridade editorial** (Anipis não é mais um wellness app fofo, é um companion adjunto sério), (b) **respiração warm** (não é um software clínico frio nem brutalist intimidante), (c) **tempo lento** (saúde mental não tem deadline — a UI honra isso com ritmo generoso).

Júlia, persona primária 18-29 BR PHQ-9 12-19, encontra Anipis pela primeira vez via Concierge MVP humano (Sprint -1) e depois via app digital (Sprint 4+). O design v3 precisa atender duas vibes contraditórias: parecer **moderno o suficiente** pra ela confiar como software, e parecer **sério o suficiente** pra ela confiar como adjunto-clínico. A síntese resolve isso via **editorial serif + warm cream canvas + 1 verde-musgo grounding** — vocabulário visual de revista de saúde respeitada (think *The Atlantic Health* + *Maria* Br), não app de meditação.

A resposta emocional desejada quando alguém abre Anipis pela primeira vez: **"isso parece um caderno clínico aberto, não um aplicativo"** — autoridade quieta, respiração na página, zero hype, zero gamification. A UI nunca vai gritar. Quando precisar de atenção (crise, handoff), o âmbar urgente ou terracota grave aparece — pontual, nunca decorativo.

**Anti-padrões absolutos:** wellness pastel mush, mood streaks, "good morning sunshine!" tone, mindfulness mandala iconography, peace dove illustrations, "you're crushing it" gamification, dark cockpit brutalist (rejeitado por overkill pra mental health).

## Colors

**Paleta arquitetada em 7 grupos** com responsabilidade clara, nunca misturadas além do escopo:

### Canvas + Surface (consenso 5/5 refs — warm off-white)
- `canvas #F7F4ED` Pergaminho Clínico — fundo universal. Slight cream sem amarelado SaaS. Sintetiza Granola Parchment + Equals Warm Cream + Ease Cream Canvas.
- `surface #FFFFFF` — cards + elevated. Pure white APENAS em superfícies elevadas pra criar separação contra canvas. Nunca como fundo principal.
- `surface-sunken #EFEAE0` — inputs + secondary cards. Granola Fog Surface analog.

### Ink (warm-tinted, nunca pure #000)
4 níveis hierárquicos. Warm undertone em todos. Equals usa #000 puro deliberadamente — Anipis rejeita esse choice (mental health context exige menos harshness).

### Borders (hairline-only)
Consenso anti-shadow. 0.5-1px ash em todo divisor. Equals horizontal rule reservado pra section dividers (Equals pattern: divider linha 1px ink ao invés de whitespace). Anipis adota com moderação — só entre seções major.

### Brand (1 cor única — Verde-Musgo BR-aware)
**`brand #2F5235`** — verde-musgo grounded BR. Comunica cura sem clichê (Hume Deep Plum é digital sophistication; Ease Forest Green é healthcare; Granola Forest Olive é botânico-craft). Anipis Verde-Musgo é uma síntese: **cura + crafted + autoridade clínica**. ÚNICA cor brand. Hover = brand-deep. Pills/badges = brand-soft. Section accent (raro) = brand-wash.

### Mood Pastels (Hume pattern — categorization, nunca decoração)
6 tons aplicados a mood checkin chips + journal categories + memory tags. **Nunca como backgrounds grandes**. Cada cor representa um state emocional sem hierarquia (sad não é "ruim", heavy não é "perdedor"). Anti-shaming desde design tokens.

### Alarm (Equals pattern — exclusivo)
**`alarm-bg #FFE17A` âmbar urgente** — NÃO vermelho. Vermelho ativa trauma response em pacientes mental health. Âmbar diz "atenção" sem ativar pânico. Usado exclusivamente em crisis banner.

### Crisis-Red (CVV/SAMU CTA only)
**`crisis #A1311F` terracota grave** — NÃO vermelho-sangue. Cor de barro queimado. Sério, terrestre. Usado APENAS em escalation RED (Mr. Walker protocol) — botão "Ligue 188 agora" + crisis cta dedicado.

**WCAG AA mínimo / AAA em crisis screens.**

## Typography

**3-font system. Serif autoridade editorial pra display/headings, humanist sans pra body/UI, mono pra technical data.**

### Display + H1-H3 — Tobias (serif transitional)
Sintetiza Granola Quadrant + Equals Serrif Condensed + Aboard Tobias. Peso 300-500 (NUNCA bold). Letter-spacing negativo em display (-0.015em).

**Por que serif:** Granola, Equals e Aboard convergem em serif editorial pra autoridade. Em mental health, serif comunica "this was written by someone who thought about you" — humanity + craft. Sans-serif sentiria genérico SaaS.

**Por que peso leve:** todos 5 refs usam display weight 300-400, NUNCA bold. Authority vem de scale (até 64px) e letter-spacing, não peso. Bold em serif vira aggressive — wrong vibe pra mental health.

### Body + UI — Inter / Suisse Int'l (humanist sans)
Hume Fellix + Ease Suisseintl + Granola Melange — todos humanist sans com personalidade discreta. Letter-spacing default ou levemente negativo. Line-height 1.55-1.65 (generosa pra leitura terapêutica).

### Mono — JetBrains Mono
Reservado pra: timestamps em chat, IDs técnicos em settings, technical references em research consents. NUNCA em body principal.

### Pull-quote — Tobias Italic
Editorial moment raro. 22px italic + border-left brand 2px. Usado em welcome message + onboarding consent + post-D14 wrap-up.

## Layout

**Grid base 8px.** Todos os spacings derivam (8/16/24/32/48/64/96/128).

Containers:
- Mobile: 100% w / 16px gutter (Júlia primary device Android 360-414px)
- Tablet: 720px max-width
- Desktop content: 720px max-width (reading optimal ~70ch)
- Desktop wide (dashboards): 1080px

Breakpoints: 360 / 480 / 768 / 1024 / 1440.

**Section rhythm:** 64px gap entre seções major. Horizontal rule 1px ink (Equals pattern) usado SOMENTE quando preciso separar dois tópicos distintos dentro de mesma página — não como decoração.

**Whitespace é arquitetural**, não decorativo. Anti-padrão: cramped UI. Pro-padrão: cada elemento respira.

## Elevation & Depth

**Consenso 5/5 refs: zero shadows heavy.**

Hierarquia visual via:
1. **Color shift** (canvas → surface → surface-sunken)
2. **Hairline borders** (0.5-1px border-hair)
3. **Espacial** (padding + gap, não shadow)

ÚNICA shadow permitida: `popover` em nav dropdowns (Granola pattern). NUNCA em cards principais.

Zero neumorphism. Zero gradientes decorativos (só hero subtle).

## Shapes

5 níveis de radius — Granola + Aboard + Hume consenso:

- `none 0` — tabelas + horizontal rules
- `xs 4px` — callouts + tags
- `sm 8px` — cards (default), chat bubbles, inputs
- `md 12px` — medium containers
- `lg 16px` — modais
- `pill 9999px` — CTAs + mood chips + tags

**Asymmetric tail em chat bubbles:** companion bubble = tail 2px bottom-left; user bubble = tail 2px bottom-right. Comunica direção sem ser caricato.

## Components

### Buttons (3 hierarchies + 1 emergency)
- **Primary** — Verde-Musgo pill. ÚNICO botão brand por viewport. Hover deepens.
- **Secondary** — Brand-soft pill. Suporta primary action quando preciso 2 CTAs.
- **Ghost** — Outline border-strong. "Voltar", "Pular", "Não agora".
- **Crisis CTA** — Terracota grave pill, label "Ligue 188 agora". APENAS em crisis routing.

### Cards
- **Content** — surface bg + border-hair + radius-sm + padding-24px.
- **Mood** (categorization) — mood-pastel bg + border-hair + pill radius + padding-8/14. Aplica em chip selector.
- **Crisis banner** — alarm-bg + border-left alarm-stroke 3px + radius-xs. Banner topo da tela quando classifier flag YELLOW/ORANGE.

### Chat bubbles
Companion left (white surface + tail bottom-left) / User right (brand-soft + tail bottom-right). Timestamp em mono 11px abaixo, ink-muted.

### Inputs
12px radius (médio — entre cards 8px e modais 16px). Border-strong default, border ink (focused). Placeholder ink-disabled.

### Pull-quote
Tobias italic + brand border-left 2px + padding-left 20px. Apenas em welcome message + consent + wrap-up.

### Horizontal rule (Equals pattern)
1px ink-divider + 64px margin top/bottom. Separa tópicos majores dentro de página.

## Do's and Don'ts

### DO

- Use `canvas #F7F4ED` como fundo universal — nunca pure white em background principal.
- Aplique `brand` apenas em 1 elemento por viewport (CTA principal OR section accent — não ambos).
- Use serif Tobias para display/H1-H3 com peso **leve** (300-400). Authority vem de scale, não bold.
- Use Inter/Suisseintl para body/UI. Letter-spacing default ou levemente negativo.
- Aplique mood-pastels APENAS em chips de categorização (mood checkin, journal tags). Nunca como background sectional.
- Use `alarm-bg` exclusivamente em crisis banner. Nunca decorativo.
- Use `crisis` terracota apenas em escalation RED CTA.
- Mantenha radius coerente por categoria (cards 8px / pills 9999px / inputs 12px / modais 16px).
- Hairline borders 0.5-1px em todos divisores. Zero shadows em cards.
- Espacial breathing 64px section gap. Aceite o whitespace.
- Pull-quote Tobias italic em welcome + consent + wrap-up (raro, momento editorial).
- Cite mood states com vocabulário **acolhedor** (heavy, tender, clear) — não clínico (depressed, anxious) nem positivo-forçado (great, awesome).

### DON'T

- Nunca use pure white `#FFFFFF` em background principal (rejeitado por 5/5 refs).
- Nunca use vermelho-sangue em crisis (ativa trauma — use terracota grave).
- Nunca use bold em serif display (refs todos peso 300-400, bold quebra editorial).
- Nunca use múltiplas cores brand simultaneamente (1 brand-grounded + mood pastels categorizing only).
- Nunca aplique mood-pastels como background grande (são chips, não panels).
- Nunca use shadows heavy (consenso 5/5 contra — color shift + hairline + spacing fazem hierarchy).
- Nunca uppercase labels (Granola/Ease evitam — só caption letter-spacing 0.05em).
- Nunca apresse a UI (anti-padrão: small spacing, dense components, fast animations). Saúde mental tem tempo próprio.
- Nunca use mood gamification (streaks, "you're on fire!", confetti).
- Nunca use mandala/dove/peace iconography (clichê mental health 2010s).
- Nunca apresente "wellness check-in" como happy/sad binary (use os 6 mood pastels).
- Nunca use serif em body principal (Tobias é display only — body é sans).

### Vocabulário aprovado
Caderno, Companhia, Aqui, Você, Sente, Lugar, Tempo, Devagar, Junto, Espaço, Respirar, Hoje

### Vocabulário banido
Sunshine, Awesome, Crushing it, You got this!, Streak, Level up, Bem-estar (gasto), Mindfulness, Zen, Cure, Heal, Fix
