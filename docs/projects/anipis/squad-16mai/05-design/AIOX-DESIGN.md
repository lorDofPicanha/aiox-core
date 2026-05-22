---
version: alpha
name: AIOX Squad — Dark Cockpit Edition
description: |
  Brand AIOX Squad. Posicionamento brutalist minimalist com toques neon. Premium institucional, cold & implacable.
  Não convence — entrega ferramentas. A.I.O.X (Arrow / Input / Orchestration / X-marks-the-spot).
  Arquétipos: Magician 60% / Sage 25% / Explorer 15%. Tom Revelador, nunca hype.
  Tagline: "EU NÃO PRECISO SER PROGRAMADOR PARA CRIAR. A IA É A SETA. O X É MEU."
  Mission: "A IA não é o herói. Você é. A IA não é o destino. É o caminho."

colors:
  # Accent (signature)
  primary: "#D1FF00"        # Kinetic Limon — único accent permitido
  primary-deep: "#9FCC00"   # hover/pressed
  primary-soft: "#F0FFB0"   # subtle backgrounds, badges

  # Neutrals (dark cockpit canvas)
  void: "#0A0A0B"           # bb-dark — background canvas
  surface: "#141416"        # bb-surface — elevated panels
  surface-2: "#1C1C1F"      # cards/callouts
  surface-3: "#252528"      # secondary elevation
  border: "#2A2A2E"         # hairline dividers
  border-strong: "#3D3D42"

  # Text
  text-primary: "#F4F1EA"   # bb-warm-white — body on dark
  text-secondary: "#A8A4A0" # muted
  text-tertiary: "#6B6864"  # disabled / captions
  text-on-accent: "#0A0A0B" # text on Kinetic Limon

  # Semantic (sober, restricted)
  success: "#7BC97B"
  warning: "#E8B23A"
  error: "#E0533D"
  info: "#5C8FE8"

  # Accent translucents for callouts/overlays
  accent-overlay-12: "rgba(209, 255, 0, 0.12)"
  accent-overlay-24: "rgba(209, 255, 0, 0.24)"

typography:
  display-xl:
    fontFamily: TASA Orbiter
    fontSize: 64px
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.03em

  display-lg:
    fontFamily: TASA Orbiter
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.025em

  h1:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em

  h2:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em

  h3:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em

  h4:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35

  body-lg:
    fontFamily: Geist
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6

  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.65

  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55

  label:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.08em

  caption:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.05em

  code-md:
    fontFamily: Roboto Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.55

  code-sm:
    fontFamily: Roboto Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.5

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 10px
  pill: 999px

spacing:
  px: 1
  0.5: 2
  1: 4
  2: 8
  3: 12
  4: 16
  5: 20
  6: 24
  8: 32
  10: 40
  12: 48
  16: 64
  20: 80
  24: 96

shadow:
  none: none
  xs: "0 1px 0 rgba(0,0,0,0.4)"
  sm: "0 2px 4px rgba(0,0,0,0.35)"
  md: "0 6px 16px rgba(0,0,0,0.45)"
  lg: "0 12px 32px rgba(0,0,0,0.55)"
  glow-accent: "0 0 0 1px #D1FF00, 0 0 24px rgba(209,255,0,0.35)"

components:
  button-primary:
    bg: "{colors.primary}"
    text: "{colors.text-on-accent}"
    radius: "{rounded.sm}"
    typography: "{typography.label}"
    padding: "12px 20px"
    transform: "uppercase"

  button-ghost:
    bg: transparent
    text: "{colors.text-primary}"
    border: "1px solid {colors.border-strong}"
    radius: "{rounded.sm}"
    typography: "{typography.label}"
    padding: "12px 20px"

  card-surface:
    bg: "{colors.surface}"
    border: "1px solid {colors.border}"
    radius: "{rounded.md}"
    padding: "24px"

  card-elevated:
    bg: "{colors.surface-2}"
    border: "1px solid {colors.border}"
    radius: "{rounded.md}"
    shadow: "{shadow.md}"
    padding: "32px"

  callout-info:
    bg: "{colors.surface}"
    border-left: "3px solid {colors.info}"
    radius: "{rounded.xs}"
    padding: "16px 20px"

  callout-accent:
    bg: "{colors.accent-overlay-12}"
    border-left: "3px solid {colors.primary}"
    radius: "{rounded.xs}"
    padding: "16px 20px"

  callout-warning:
    bg: "{colors.surface}"
    border-left: "3px solid {colors.warning}"
    radius: "{rounded.xs}"
    padding: "16px 20px"

  callout-error:
    bg: "{colors.surface}"
    border-left: "3px solid {colors.error}"
    radius: "{rounded.xs}"
    padding: "16px 20px"

  table-header:
    bg: "{colors.surface-2}"
    text: "{colors.text-primary}"
    typography: "{typography.label}"
    border-bottom: "1px solid {colors.border-strong}"

  table-cell:
    bg: transparent
    text: "{colors.text-primary}"
    typography: "{typography.body-sm}"
    border-bottom: "1px solid {colors.border}"
    padding: "12px 16px"

  pill-tag:
    bg: "{colors.surface-3}"
    text: "{colors.primary}"
    border: "1px solid {colors.border-strong}"
    radius: "{rounded.pill}"
    typography: "{typography.caption}"
    padding: "4px 10px"
    transform: "uppercase"

  cover-hero:
    bg: "{colors.void}"
    text: "{colors.text-primary}"
    accent: "{colors.primary}"
    typography: "{typography.display-xl}"

  divider:
    bg: "{colors.border-strong}"
    height: "1px"
---

# AIOX Squad — Dark Cockpit Edition

## Overview

AIOX Squad é a marca-mãe do ecossistema AIOS — uma estrutura de orquestração de IA criada por Breno Cerqueira para entregar capacidade real, não promessas. O posicionamento é declaradamente **brutalist minimalist**: superfícies escuras, hierarquia geométrica, sobriedade institucional premium, com um único acento neon (Kinetic Limon `#D1FF00`) operando como pulso elétrico do sistema.

A brand é classificada como **Magician (60%) + Sage (25%) + Explorer (15%)**. Não é uma startup de hype: é um Revelador. Não convence — entrega ferramentas. O usuário-alvo é o não-programador frustrado com a complexidade que sente potencial latente; ou o desenvolvedor experiente cansado de toolchains que prometem facilidade e entregam fricção.

A resposta emocional desejada quando alguém olha um material AIOX: **clareza fria, controle, confiança de quem viu por baixo do capô**. Nunca empolgação superficial. A interface visual reforça isso através de tipografia técnica (Geist + TASA Orbiter), composição editorial densa quando preciso, e silêncio quando não.

A.I.O.X funciona como mnemônico semântico:

- **A** — Arrow: o motor direcional de IA como propulsão
- **I** — Input: histórias do usuário virando comandos
- **O** — Orchestration: operações fluidas inter-agentes
- **X** — Destination: "X marks the spot"

Símbolos canônicos: o **triângulo/delta** (jornada de transformação) e o **joystick** (controle absoluto do criador). Esses dois marcadores aparecem em diagramas e elementos gráficos secundários quando necessário.

## Colors

**Paleta restrita** é regra. Uma cor de acento, três níveis de superfície escura, três níveis de texto — todo o resto é semântico (success/warning/error/info) com saturação contida pra não competir com Kinetic Limon.

### Accent
- **Kinetic Limon `#D1FF00`** é o único acento permitido. Operação: CTAs primárias, callouts críticos, dados em destaque, brand marks, hover states. **Nunca usar como bloco grande de background** — é pulso, não chão.
- Variantes: `primary-deep #9FCC00` para hover/pressed em superfícies muito claras; `primary-soft #F0FFB0` para badges sutis em contexto claro (raro).

### Neutrals (Dark Cockpit)
- `void #0A0A0B` — canvas universal. Quase preto, com micro-warmth pra reduzir fadiga.
- `surface #141416` — painéis elevados, cards padrão.
- `surface-2 #1C1C1F` — segunda camada (callouts, table headers).
- `surface-3 #252528` — terceira camada (pills, badges).
- `border #2A2A2E` — hairline divisores.
- `border-strong #3D3D42` — divisores com mais peso.

### Text
- `text-primary #F4F1EA` (warm white) — body padrão sobre void.
- `text-secondary #A8A4A0` — labels, captions ambiente.
- `text-tertiary #6B6864` — placeholder, disabled.
- `text-on-accent #0A0A0B` — único texto que vai sobre Kinetic Limon.

### Semantic (sober)
Success `#7BC97B`, Warning `#E8B23A`, Error `#E0533D`, Info `#5C8FE8`. Saturação contida intencionalmente — em superfície escura cores muito vivas competem com Kinetic Limon e quebram a hierarquia.

### Contraste WCAG
- Warm white sobre void: **15.8:1** (AAA)
- Kinetic Limon sobre void: **17.2:1** (AAA)
- Text-secondary sobre void: **7.4:1** (AAA)

## Typography

Stack 3-font: **TASA Orbiter** (display), **Geist** (heading + body workhorse), **Roboto Mono** (code/data). Hierarquia explícita, peso usado pra construir ritmo — nunca decoração.

- **TASA Orbiter 800** (display-xl, display-lg) — capa, hero, separadores de parte. Letter-spacing negativo de -0.025 a -0.03em, line-height 1.0–1.05. Uso parcimonioso.
- **Geist** (h1-h4, body, label, caption) — o cavalo de trabalho. Do terminal ao billboard. Pesos disponíveis: 300 / 400 / 500 / 600 / 700.
- **Roboto Mono 500** — code blocks, tokens citados em prosa (e.g. `colors.primary`), tabelas de dados densos, IDs (e.g. `[H-aa1094dcc85b37ed]`).

Line-height generosa em body (1.6–1.65) reduz fadiga em leitura longa. Headings sempre com letter-spacing negativo (tight) — refrança a sobriedade técnica.

Pull-quotes raras — quando ocorrem, usar Geist itálico com border-left Kinetic Limon. **Nunca** usar fontes serif no sistema AIOX.

## Layout

**Grid base 8px**. Todos os spacings derivam do múltiplo (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96).

Containers:
- Default content: 720px max-width (~70 chars per line, leitura confortável)
- Wide (tables, diagrams): 1080px
- Full: edge-to-edge (raro)

Breakpoints (caso digital): 480 / 768 / 1024 / 1280 / 1536px.

Whitespace generoso em torno de blocos. Brutalist não significa apertado — significa propositado. Cada vazio fala.

Logo safe space: medido em "(x)" units (proporcionais ao glifo X da marca). Mínimo 1× em qualquer direção.

## Elevation & Depth

Sombras minimais. A elevação se faz por contraste de superfície (`surface` → `surface-2` → `surface-3`), não por blur generoso. Quatro tokens de sombra:

- `xs` — 0 1px 0 rgba(0,0,0,0.4) — separação sutil de linha
- `sm` — 0 2px 4px rgba(0,0,0,0.35) — botões
- `md` — 0 6px 16px rgba(0,0,0,0.45) — cards elevados
- `lg` — 0 12px 32px rgba(0,0,0,0.55) — modais (raro)
- `glow-accent` — efeito halo Kinetic Limon em CTAs hover (uso parcimonioso)

**Zero neumorphism**. Zero degradês decorativos. Degradês permitidos APENAS em backgrounds de cover/hero, e sempre com cores próximas (void → surface).

## Shapes

Radius reduzido (Rams "less but better"). Cinco níveis:

- `none 0px` — tabelas, dividers, full-bleed
- `xs 2px` — callouts, tags
- `sm 4px` — buttons, inputs (default)
- `md 6px` — cards
- `lg 10px` — containers maiores, modais
- `pill 999px` — apenas pill tags / status badges

**Nunca** usar radius muito grande (>12px) — quebra a estética cockpit/técnica. Cantos retos comunicam precisão.

## Components

### Buttons
- **Primary**: `bg Kinetic Limon` + `text Void` + uppercase + radius sm. Hover: glow-accent. Pressed: primary-deep.
- **Ghost**: transparent + border-strong + text-primary. Hover: surface fill + border Kinetic Limon.

### Cards
- **Surface**: bg surface + border + radius md + padding 24px.
- **Elevated**: bg surface-2 + shadow-md + padding 32px.

### Callouts
Banda lateral 3px (color-coded) + bg surface ou accent-overlay-12. Tipos: info / accent / warning / error.

### Tables
Header: surface-2 + uppercase label + border-bottom border-strong.
Cell: transparent + border-bottom border + body-sm Geist. Zebra opcional via accent-overlay-12.

### Pills / Tags
Surface-3 bg + Kinetic Limon text + border-strong + radius pill + caption uppercase. Operação: status, version, tier markers.

### Cover Hero
Void canvas + TASA Orbiter display-xl + Kinetic Limon accent micro (linha, número, palavra-chave). Composição editorial centralizada ou bottom-left dramática.

### Section Dividers
Linha border-strong 1px + label uppercase Kinetic Limon micro acima. Quebra de seção é um momento — não passa desapercebida.

## Do's and Don'ts

### Do
- **Mostre resultado real, não promessa.** "R$500K/ano (João Pedro, Anima Educação)" > "Resultados incríveis"
- **Fale com profundidade fundacional.** "A.I.O.X é o vetor semântico" > "Plataforma de IA fácil"
- **Empodere via metodologia.** "Aprenda a Toca do Coelho" > "Magia em 5 minutos"
- **Use Kinetic Limon com parcimônia.** Um único elemento por viewport. É pulso, não preenchimento.
- **Mantenha respiração tipográfica.** Line-height generosa, parágrafos curtos, divisões claras.
- **Cite IDs e fontes**: `[H-id-curto]` em Roboto Mono valida claim.

### Don't
- **Nunca use hype vazio.** Banidos: Mágico, Revolucionário, Fácil, Hack.
- **Não prometa transformação rápida** ("em 5 minutos", "do dia pra noite").
- **Não simplifique demais.** Audiência tem inteligência respeitada.
- **Não combine Kinetic Limon com outras cores saturadas.** Quebra hierarquia.
- **Não use serifs.** Mesmo em pull-quotes.
- **Não use radius grande (>12px).** Cockpit precision, não Material design.
- **Não use degradês decorativos em superfícies grandes.** Só em hero/cover sutil.
- **Não imite a voz de coach motivacional.** Tom é Revelador (cold, implacável), nunca Performer.

### Vocabulário aprovado
O X · A Seta · O Terminal · A Clareza · Transformador · Revelador · Direto · Jornada · Toca do Coelho · Despertar · Vetor · Orquestração · Capacidade · Ferramentas · Método · Foundational

### Vocabulário banido
Mágico · Revolucionário · Fácil · Hack · Atalho · Plug-and-Play · Game-changer · Disruptive · Mind-blowing
