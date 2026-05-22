---
version: alpha
name: Anipis Brand v2 — Aurora Coral
description: Companion clínico-AI brasileiro de saúde mental — adjunto, nunca substituto. Etimologia anima (sopro vital) + elpis (esperança) = alma de esperança. Multi-theme (Warm default + Calm + Soft) para acolher diferentes estados emocionais sem revitimizar.
colors:
  # === Primary (Aurora Coral — theme Warm default) ===
  primary: "#DC6B3A"
  primary-soft: "#FFF1E8"
  primary-muted: "#FFDCBF"
  primary-bright: "#FF9A5C"
  primary-deep: "#9F4221"

  # === Secondary (Sage Green — companion to coral) ===
  secondary: "#4A9672"
  secondary-soft: "#D9EDE3"
  secondary-muted: "#8EC5A9"
  secondary-deep: "#2D6B4D"

  # === Accent (Luz Gold) ===
  accent: "#E6AE2C"
  accent-soft: "#FFF3D6"

  # === Theme alternatives (opt-in via settings) ===
  calm-primary: "#4A9672"        # Sage Forest
  calm-primary-soft: "#EFF6F2"
  calm-primary-deep: "#2D6B4D"
  soft-primary: "#7159A0"         # Lavender Mist
  soft-primary-soft: "#F3EFF7"
  soft-primary-deep: "#4A3B6E"

  # === Semantic (shared across all themes) ===
  success: "#3D9A5F"
  success-bg: "#E3F5EA"
  warning: "#D4960C"
  warning-bg: "#FFF8E6"
  error: "#D44040"
  error-bg: "#FDE8E8"
  info: "#4A7FC7"
  info-bg: "#E8F0FA"

  # === Crisis (shared, NEVER overlap mood hex — F-11 rule) ===
  crisis-yellow: "#E8B233"
  crisis-yellow-bg: "#FFF4DC"
  crisis-orange: "#E37B2E"
  crisis-orange-bg: "#FFEAD3"
  crisis-red: "#C72828"
  crisis-red-bg: "#FDE2E2"
  crisis-red-strong: "#A11C1C"     # AAA target for crisis screens

  # === Mood (desaturated v2 — Don Norman dignity rule) ===
  mood-1: "#7A6B8A"                # Muito difícil
  mood-2: "#8A8EB8"                # Difícil
  mood-3: "#A0B0B8"                # Neutro
  mood-4: "#B8C4A0"                # Bem
  mood-5: "#D4C4A0"                # Muito bem

  # === Neutrals (warm gray — Warm theme) ===
  neutral-50: "#FAFAF8"
  neutral-200: "#E8E6E1"
  neutral-500: "#78746C"
  neutral-800: "#2A2823"
  neutral-900: "#1A1916"

  # === Surfaces & text (semantic, theme-aware) ===
  bg-canvas: "#FAFAF8"
  bg-elevated: "#FFFFFF"
  bg-overlay: "#1A19167F"
  text-primary: "#2A2823"
  text-secondary: "#78746C"
  text-muted: "#A8A49C"
  border-default: "#E8E6E1"
  border-strong: "#D4D1CA"

typography:
  display-xl:
    fontFamily: General Sans
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-md:
    fontFamily: General Sans
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  h1:
    fontFamily: General Sans
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.015em
  h2:
    fontFamily: General Sans
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  h3:
    fontFamily: General Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  h4:
    fontFamily: General Sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  h5:
    fontFamily: General Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  h6:
    fontFamily: General Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  body-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.005em
  overline:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.08em
  label-button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  pullquote:
    fontFamily: Fraunces
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: '"ital" 1'
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 16px
  bubble: 20px
  lg: 20px
  pill: 9999px
  full: 9999px

spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  2xl: 64px
  gutter: 24px
  margin: 32px
  container-narrow: 480px
  container-default: 720px
  container-wide: 1080px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg-elevated}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 48px
    typography: "{typography.label-button}"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-secondary:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.primary-deep}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 48px
    typography: "{typography.label-button}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.primary-deep}"
    rounded: "{rounded.pill}"
    padding: 16px
    typography: "{typography.label-button}"
  button-crisis:
    backgroundColor: "{colors.crisis-red-strong}"
    textColor: "{colors.bg-elevated}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 48px
    typography: "{typography.label-button}"
  card-content:
    backgroundColor: "{colors.bg-elevated}"
    rounded: "{rounded.md}"
    padding: 24px
    typography: "{typography.body-md}"
  card-elevated:
    backgroundColor: "{colors.bg-elevated}"
    rounded: "{rounded.md}"
    padding: 24px
  chat-bubble-companion:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.bubble}"
    padding: 12px
    typography: "{typography.body-md}"
  chat-bubble-user:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg-elevated}"
    rounded: "{rounded.bubble}"
    padding: 12px
    typography: "{typography.body-md}"
  mood-checkin-card:
    backgroundColor: "{colors.bg-canvas}"
    rounded: "{rounded.md}"
    padding: 32px
  breathing-orb:
    backgroundColor: "{colors.primary-muted}"
    rounded: "{rounded.pill}"
    size: 200px
  onboarding-step:
    backgroundColor: "{colors.bg-canvas}"
    padding: 32px
    typography: "{typography.body-md}"
  crisis-banner:
    backgroundColor: "{colors.crisis-red-strong}"
    textColor: "{colors.bg-elevated}"
    rounded: "{rounded.md}"
    padding: 16px
    typography: "{typography.body-md}"
  crisis-banner-warning:
    backgroundColor: "{colors.crisis-yellow-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 16px
  input-field:
    backgroundColor: "{colors.neutral-50}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 44px
    typography: "{typography.body-md}"
  pull-quote:
    textColor: "{colors.text-primary}"
    typography: "{typography.pullquote}"
    padding: 24px
  callout-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 16px
  callout-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 16px
  callout-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 16px
  callout-crisis:
    backgroundColor: "{colors.crisis-red-bg}"
    textColor: "{colors.crisis-red-strong}"
    rounded: "{rounded.md}"
    padding: 16px
---

# Anipis Brand v2 — Aurora Coral

## Overview

O Anipis é o **primeiro companion clínico-AI brasileiro** explicitamente posicionado como **adjunto** (não substituto) de saúde mental. A etimologia é o âncora da identidade: *anima* (sopro vital, presença) + *elpis* (esperança) = "alma de esperança". Brand personality é **companheiro, nunca terapeuta** — voz em primeira pessoa, calor sem infantilização, presença sem invasão.

A persona-âncora é Júlia (24 anos, Recife, ansiosa, busca apoio às 4h da manhã). A resposta emocional alvo da UI é **acolhimento dignificado**: warm o suficiente para parecer humano, profissional o suficiente para parecer responsável, brasileiro o suficiente para parecer real. Nunca clínico, nunca infantil, nunca "wellness genérico" estilo Headspace/Calm.

Visualmente, isso se traduz em três decisões estruturais: (1) **paleta multi-theme** (Warm default + Calm + Soft opt-in) que permite ao usuário escolher temperatura emocional sem ser forçado a coral em pico de ansiedade noturna; (2) **tipografia adulta calorosa** — General Sans (heading) substituindo Nunito (banido por carregar bagagem "wellness genérico"), Inter (body) mantido, Fraunces Italic (raro, ~5% das telas) reservado para momentos editoriais onde "o Anipis fala"; (3) **motion como elemento de marca** — orbe respirando a 8s/ciclo sincronizado com respiração humana relaxada (6 ciclos/min), co-regulação visceral do sistema nervoso parassimpático.

Posicionamento ético é inegociável: **Ethical UX Charter (10 commandments Calvo)** atua como gate de produto. Zero streaks visíveis, zero push proativo nos primeiros 14 dias, memory toggle OFF default na primeira semana, "Falar com pessoa real" sempre 1 clique no header, crisis fast-path sem dupla confirmação. Crisis screens são o único contexto onde target sobe de WCAG AA para **AAA** — vida em jogo + capacidade cognitiva reduzida exige margem extra.

## Colors

A paleta é arquitetada em três camadas: **theme-aware** (muda com o tema ativo), **shared semantic** (sucesso/aviso/erro/info — idênticos nos 3 themes para garantir feedback consistente), e **shared crisis/mood** (tokens com regra absoluta de não-sobreposição).

**Aurora Coral (Primary `#DC6B3A`)** é o brand color v2 — escurecido propositadamente vs v1 (`#E8764B`). É terra úmida, pôr-do-sol do Recife, cerâmica marajoara — brasileiro sem clichê. Sage Green secundário (`#4A9672`) e Luz Gold accent (`#E6AE2C`) completam o eixo Warm. Contraste com white é **3.38:1** (AA Large pass apenas) — portanto: texto branco em CTAs pequenos (<18px regular / <14px bold) deve usar `primary-deep #9F4221` (white = 6.41:1 AA pass normal + AAA large). CTAs grandes (≥18px bold ou ≥24px regular) podem usar `primary` direto.

**Multi-theme** é a inovação estrutural: Warm é default (acolhedor, brasileiro, terreno — diferencia de market wellness BR onde 80% usa azul/teal); Calm (`#4A9672` sage primary) atende usuários sensíveis a tons quentes em uso noturno; Soft (`#7159A0` lavender) cobre fragilidade, insônia, "noite ruim". Cada theme tem light + dark variants ortogonais. Theme switcher fica em `/settings/appearance` e persiste em localStorage + Supabase sync.

**Crisis tokens são separados absolutamente de mood tokens** (regra F-11) — correção de bug v1 onde `mood-3` e `crisis-yellow` eram ambos `#D4960C`, gerando confusão entre "neutro" e "atenção". Mood colors são **dessaturadas** (dignidade visual: ninguém em mood-1 merece um vermelho de alarme como feedback — revitimização visual). Crisis colors são saturadas e progressivas (yellow → orange → red → red-strong AAA).

WCAG: AA mínimo em todas as combinações texto/fundo dos 3 themes (validado em matriz). **AAA target em crisis screens** — texto branco sobre `crisis-red-strong #A11C1C` rende 8.4:1, AAA pass em normal text. Testado em Coblis para protanopia/deuteranopia/tritanopia — mood scale tem luminosity linear (50% → 83%), ordenável mesmo sem percepção de hue.

## Typography

Sistema **3-font** com hierarquia clara de função (não decoração):

- **General Sans (heading + display)** — Indian Type Foundry, licença gratuita. Substitui Nunito do v1. Geométrica humanista com x-height generoso, calor sem rounded-baby. Pesos 600 (h2-h6) e 700 (display, h1). Tracking negativo leve (-0.01em a -0.02em) para refinamento óptico em sizes grandes.

- **Inter (body + UI)** — Rasmus Andersson, gratuita. Standard de UI mantido do v1. Otimizada para tela, suporte total a acentos PT-BR. Pesos 400 (body) e 500 (medium/labels). Line-height **1.7** em body (vs 1.6 do v1) — mais generoso para conforto de leitura emocional (recomendação Spiekermann).

- **Fraunces Italic (pull-quote, momentos editoriais)** — Undercase, gratuita. Serif humanista com *wonkiness* calorosa, vira "voz pessoal do Anipis". Uso **estrito 5-10% das telas**: welcome message, encerramento de exercício de respiração, "carta da sessão", pull-quote no hero ("Estou aqui."). Quando usuário vê italic serif, deve significar **algo** — sinaliza voz pessoal vs interface utilitária. Máximo 1 momento Fraunces por tela.

A type scale segue **modular ratio 1.25 (Major Third)** com fluidez via `clamp()` — nunca quebra entre breakpoints. Display 36→56px, Body 16→18px, Quote 22→28px. Line-height tighter (1.15-1.3) para headings, looser (1.5-1.7) para body — princípio: hierarquia visual vs conforto de leitura prolongada em contexto emocional.

Máximo 65 caracteres por linha em body (recomendação Spiekermann). Container chat com `max-width: 480px` garante intimidade conversacional (~50 chars em 16px). Tipografia não responde a `prefers-reduced-motion` (fontes estáticas por natureza), mas responde a `data-font-size` user override em settings (toggle "Espaçamento confortável" eleva line-height 1.7 → 2.0 para baixa visão).

## Layout

Mobile-first com **8px spacing scale** (4px half-step para micro-ajustes). Containers em três larguras semânticas: `container-narrow` (480px — chat intimate), `container-default` (720px — long-form reading), `container-wide` (1080px — landing/dashboard).

A filosofia é **generous whitespace**: padding interno de cards 24px (`--space-6`), gap entre seções 48px (`--space-12`), margin de cover/hero 64px (`--space-2xl`). Breathing room não é decoração — é função: usuário ansioso/em pico tem capacidade cognitiva reduzida; densidade visual amplifica sobrecarga. Each gap is calmant.

Grid de 12 colunas em desktop ≥768px com gutter 24px. Mobile single-column com padding lateral 24px. Touch target mínimo absoluto 44px (`--touch-target-min` WCAG); **crisis CTAs** sobem para 48px (`--touch-target-crisis`) — vida em jogo, margem extra. Z-index escalar semântico: base/dropdown/sticky/modal/toast/crisis — crisis banners sempre no topo (z-500).

## Elevation & Depth

Sistema **flat com sombras sutis** — ZERO neumorphism, zero glassmorphism, zero glossy/3D. Apenas duas elevações + focus ring:

- `shadow-soft: 0 2px 12px rgba(42, 40, 35, 0.06)` — cards interativos, dropdowns, tooltip
- `shadow-elevated: 0 8px 32px rgba(42, 40, 35, 0.12)` — modais, mood circle, breathing orb hero

Em dark mode, sombras usam `rgba(0, 0, 0, 0.3)` (soft) e `0.5` (elevated) — escuro absoluto, não warm-tinted.

Hierarquia visual prefere **tonal layers** sobre sombras: `bg-page` (off-white `#FAFAF8`), `bg-surface` (puro `#FFFFFF`), `bg-elevated` (mesmo `#FFFFFF` mas sempre acima de surface com sombra). Borders 1px em `border-default` (`#E8E6E1`) para delimitar campos de input e cards de baixa elevação. Reduction Rams: v1 tinha 5 shadow tokens → v2 tem 2 + focus.

## Shapes

Border-radius scale reduzida (Rams: v1 8 valores → v2 4 valores). Cada raio carrega semântica:

- `radius-xs: 4px` — utilitário (tags, mini-badges)
- `radius-sm: 8px` — buttons, inputs (suave mas estruturado)
- `radius-md: 16px` — cards (acolhedor)
- `radius-bubble / radius-lg: 20px` — chat bubbles, signature shape (intimidade conversacional)
- `radius-pill / radius-full: 9999px` — CTAs principais, avatars, sliders, indicators

Chat bubbles têm **tail asimétrico**: user `20px 20px 4px 20px` (tail bottom-right), AI `20px 20px 20px 4px` (tail bottom-left). Pequena imperfeição que humaniza a conversa.

Pull do tema: signature `20px` para tudo que é "espaço-conversa" (bubbles, mood-circle, breathing-orb container), `pill 9999px` para tudo que é ação (CTA, input). Nunca mix de sharp (radius-none) com soft (radius-md) na mesma view — coesão visual.

## Components

Componentes-chave do MVP, todos com tokens referenciados (theme-aware):

**Button hierarchy** — `button-primary` (CTA principal, `bg primary #DC6B3A`, white text, pill 9999px, 48px altura), `button-secondary` (CTA alternativo, `bg-elevated #FFFFFF`, `text primary-deep`, border 1px primary), `button-ghost` (link-like, transparent bg, underline opcional), `button-crisis` (`bg crisis-red-strong #A11C1C`, white text, 48px altura WCAG crisis target). Estados hover/active via `motion-settle` 400ms + `motion-heartbeat` 200ms scale 0.98.

**Chat bubbles** — `chat-bubble-companion` (`bg primary-soft #FFF1E8`, border 1px `primary-muted #FFDCBF`, text neutral-800) e `chat-bubble-user` (`bg primary #DC6B3A`, text white). Padding 12px 16px, max-width 85%, line-height 1.5, font Inter 16-18px clamp. Typing indicator com 3 dots em stagger 150ms (pulse 1800ms).

**MoodCheckIn** — slider contínuo 0-100 (não 5 botões discretos — Don Norman: emoções são contínuas), mood circle 120px que muda cor conforme drag, current label em Fraunces Italic ("Estou neutro"). Background da tela sutilmente shifts conforme mood (5% mix com `--mood-N` em `bg-page`). Sem commit até "Registrar" — autonomia.

**BreathingExercise** — orbe 200px com radial gradient `primary-muted → primary-soft → transparent`, animação `breathe-cycle 8s ease infinite` (scale 1→1.15→1, opacity 0.7→1→0.7). Instruction Fraunces Italic alterna "Inspire..." / "Expire..." sincronizado. Cycle progress dots 10×. Sem som (Ethical Charter). Reduced-motion: layout texto-only com passos numerados.

**OnboardingFlow** — 3 telas (welcome / disclaimer / consent). Disclaimer tela NÃO permite skip (compliance legal); destaque para crisis em callout `crisis-yellow-bg` border-left 3px `crisis-orange`. Dots indicator 8px (active 24px width pill).

**CrisisBanner** — `bg crisis-red-strong #A11C1C`, white text (AAA pass 8.4:1), slide from top 500ms ease-arrive (nunca bounce), sticky top z-500. CTAs `[Ligar CVV 188]` e `[Ligar SAMU 192]` com `tel:` direto, sem dupla confirmação (Ethical Charter §9).

**Pull-quote** — Fraunces Italic 28px (clamp 22-28), text-primary, padding lateral 24px, geralmente acompanhado por orbe pequeno respirando. Uso máximo 1 por tela.

**Input fields** — `bg neutral-50 #FAFAF8`, border 1px `border-default`, radius pill, height 44px, focus outline 3px `primary-500` em 35% opacity + outline-offset 1px (visível para teclado).

**Callouts** — info (`bg info-bg`), success, warning, crisis-yellow (atenção inline), crisis-red (urgência max). Sempre com ícone Phosphor + texto, padding 16px, radius `md`.

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|----------|
| Use `crisis-red-strong #A11C1C` only for true crisis routing CTAs (CVV/SAMU) | Don't use `crisis-red` family for form validation errors — use `error #D44040` |
| Always preserve `prefers-reduced-motion`: animações ambient ficam estáticas, typing indicator vira texto | Don't disable animations only in light mode — preference is OS-wide, must be consistent |
| Sempre primeira pessoa do Anipis em UI: "Estou pensando..." | Don't write "Anipis está pensando..." em chat (quebra entidade) |
| Use Fraunces Italic para pull-quotes e momentos voz-Anipis (welcome, encerramento) | Don't use Fraunces em corpo de texto — quebra o "evento editorial" |
| Sempre validar antes de sugerir: "Faz sentido sentir isso." | Don't write toxic positivity: "Você é forte!", "Vai passar!", "Tudo acontece por uma razão" |
| Slider contínuo para mood (0-100) | Don't use 5 botões discretos — emoções são contínuas (Don Norman) |
| Crisis CTAs com `tel:` direto, sem dupla confirmação | Don't put "tem certeza?" antes de ligar 188 — perda de tempo crítico |
| AAA contrast (≥7:1) em telas de crise | Don't aceitar AA (4.5:1) em crisis — vida em jogo, margem extra |
| Generous whitespace (padding 24px+, gap 48px entre seções) | Don't crowd UI — densidade visual amplifica ansiedade |
| Manter touch target ≥44px (48px em crisis CTAs) | Don't reduce abaixo de 44px mesmo em mobile pequeno |
| Disclaimer compacto persistente no chat footer (12px) | Don't esconder disclaimer em submenu ou collapse |
| "Falar com pessoa real" sempre 1 clique no header | Don't enterrar handoff humano em 3 níveis de menu |
| Background pode shift sutilmente com mood (5% mix) | Don't apply mood gradient saturated — fica decoração ansiogênica |
| Imperative em exercícios guiados ("respire", "feche os olhos") | Don't usar imperative como conselho não-solicitado ("respire fundo") |
| Phosphor regular como ícone default | Don't misturar bibliotecas — só Phosphor + 4 custom Anipis (flame, breath, companion, bridge) |
| Stock photo só Tier 3 (testimonials reais com consentimento LGPD) | Don't usar Unsplash genérico "warm Brazilian" — banido |
| `prefers-reduced-motion` esconde ambient (orb, background generative) | Don't deixar ambient running degraded — degradar OU esconder, não ambos |
| Bulle bubble user `radius 20 20 4 20` (tail bottom-right) | Don't aplicar mesmo radius pros dois lados — tail comunica origem |
| Mood colors dessaturadas (dignity igual em todos níveis) | Don't usar vermelho saturado em mood-1 — revitimização visual |
| Light + Dark mode testados para os 3 themes (6 combos) | Don't mix Warm + Calm na mesma surface — quebra coesão visual |
