# UX Designer — Rebrand v2 Migration Specs

**Agente:** Flow (@ux-designer)
**Para:** @ui-designer, @design-systems-engineer, @dev (Dex), @qa
**Data:** 2026-05-16
**Story:** SAI-RB-001 (Sprint 4, semanas 9-10)
**Scope:** Specs detalhadas de migração UX dos **5 componentes principais** do EPIC-8 Rebrand v2
**Brand target:** Aurora Coral `#DC6B3A` · General Sans (heading) · Inter (body) · Fraunces Italic (pull-quotes 5-10%) · Voice "companheiro nunca terapeuta"
**Backend status:** ~70% pronto · Frontend ~40% · Não bloqueia launch CFM ago/2026

> **Arquitetura antes do estilo.** Cada spec aqui mapeia *estrutura → hierarquia → interação → acessibilidade → responsivo*. Cores e tipografia (UI layer) ficam por conta do @ui-designer. Tokens vivem em `05-design/tokens.json` — referenciar, nunca duplicar valores hex.

---

## 1. ChatWindow — Spec Estrutural

### 1.1 Layout structure (mobile-first, max-width 480px)

```
┌──────────────────────────────────────────┐
│ ChatHeader (sticky top, 56px, blur-12)   │ ← z-10
├──────────────────────────────────────────┤
│ SafetyBanner (CONDITIONAL — crisis only) │ ← z-9 (above messages)
├──────────────────────────────────────────┤
│ AmbientBackground (canvas, opacity .03)  │ ← z-0, aria-hidden
│                                          │
│ MessagesArea (role=log, aria-live=polite)│ ← z-1
│   ├─ ChatBubbleCompanion (align-start)   │
│   ├─ ChatBubbleUser     (align-end)      │
│   ├─ ChatBubbleCompanion (align-start)   │
│   └─ TypingIndicator    (align-start)    │
│                                          │
├──────────────────────────────────────────┤
│ Composer (sticky bottom)                 │ ← z-10
│   [VoiceBtn] [Textarea autosize] [Send]  │
├──────────────────────────────────────────┤
│ DisclaimerStrip (12px persistent)        │ ← z-10
└──────────────────────────────────────────┘
```

Container **flex column** com `height: 100dvh` (não `100vh` — iOS safe-area). `max-width: 480px` margin-inline auto força intimidade (regra Uma F-18). Acima de 768px, mantém 480px centralizado, padding lateral aumenta para `var(--space-8)`.

### 1.2 Spec exata por elemento

**ChatBubbleCompanion (Anipis):**
- `max-width: 85%` · `padding: var(--space-3) var(--space-4)` (12px 16px)
- `border-radius: 20px 20px 20px 4px` (tail bottom-left, signature warm)
- `background: var(--chat-bubble-ai-bg)` (`#FFF1E8` Warm) · `border: 1px solid var(--chat-bubble-ai-border)` (`#FFDCBF`)
- `box-shadow: var(--shadow-soft)` (0 2px 12px rgba(42,40,35,.06))
- Spacing entre bubbles consecutivas: `gap: var(--space-3)` (12px). Entre bubbles de speaker diferente: `gap: var(--space-4)` (16px).

**ChatBubbleUser:**
- Mesma `max-width: 85%` · mesmo padding
- `border-radius: 20px 20px 4px 20px` (tail bottom-right — espelho)
- `background: var(--chat-bubble-user-bg)` (Aurora Coral `#DC6B3A`) · `color: var(--chat-bubble-user-text)` (white)
- **NÃO** usa border (já tem contrast suficiente do fundo coral)

**Composer:**
- `min-height: 56px` · `padding: var(--space-3) var(--space-4)`
- `background: var(--bg-page)` com `border-top: 1px solid var(--color-neutral-200)`
- Textarea: `min-height: 40px`, `max-height: 120px` (autosize 3 lines), `border-radius: var(--radius-md)` (16px)
- SendBtn: `var(--touch-target-min)` (44px), `border-radius: var(--radius-full)`, disabled state opacity .4

### 1.3 Typography

- Body bubbles: `font-family: var(--font-body)` (Inter), `font-size: var(--text-body)` clamp(16-18px), `line-height: 1.5`
- Timestamps: `font-family: var(--font-mono)` (JetBrains Mono), `font-size: var(--text-caption)` (12px), `opacity: 0.65`
- Header title "Anipis": `font-family: var(--font-heading)` (General Sans 600), `font-size: var(--text-h5)` (16px)
- **NUNCA Fraunces em chat bubbles** — Fraunces fica para welcome/onboarding pull-quotes (5-10% rule)

### 1.4 Crisis Safety Banner (conditional)

Aparece **acima** de MessagesArea quando `crisisBanner !== null`. Tipos:
- `severity: yellow` → `bg: var(--crisis-yellow-bg)`, border-left 4px `var(--crisis-yellow)`, texto neutro encorajador
- `severity: orange` → `bg: var(--crisis-orange-bg)`, idem orange, CTA "Falar com CVV (188)"
- `severity: red` → `bg: var(--crisis-red-bg)`, idem red-strong (`#A11C1C`), CTA grande 48px (`--touch-target-crisis`) "Ligar 188 agora"

**Contraste obrigatório:** AAA (7:1) em todos os textos de crisis banner. `--crisis-red-strong` validado contra `--crisis-red-bg`. Padding interno `var(--space-4)`, border-radius `var(--radius-md)`. **Zero parallax, zero ambient noise** quando banner red ativo (regra Uma F-12 motion).

### 1.5 Loading states

**TypingIndicator (Anipis pensando):**
- Estrutura: bubble vazia com 3 spans `<span class="typing-dot" />` (`width: 6px`, `height: 6px`, `border-radius: full`, `background: var(--color-neutral-500)`)
- Animação: `keyframes breathing` — scale 0.8→1.2→0.8 + opacity .4→1→.4, duration **800ms**, stagger 150ms entre dots, `infinite`
- Acompanha o ritmo respiratório lento do brand (co-regulação F-08)
- Reduced-motion: substitui por texto estático "Anipis está pensando..." sem dots animados

**LoadingHistory (skeleton):**
- 3 bubbles skeleton alternando left/right
- `background: linear-gradient(90deg, var(--color-neutral-100) 25%, var(--color-neutral-200) 50%, var(--color-neutral-100) 75%)`
- Shimmer 1500ms ease-in-out (reduced-motion: estático sem shimmer)

### 1.6 Empty state (primeira conversa)

```
   [I-01 illustration — companion + flame warm minimal]

   "Oi. Que bom te ver aqui."          ← Fraunces Italic 22px
   "Pode contar como tá."               ← Inter 16px regular

   [3 ChatStarters chips opcionais]
   • "tô ansioso(a)"  • "preciso desabafar"  • "não sei começar"
```

- Illustration centralizada, `max-width: 200px`, `aria-hidden="true"` (decorativa)
- Pull-quote Fraunces é **a única instância de Fraunces no Chat** — uso intencional, momento de chegada
- ChatStarters: chips `border-radius: var(--radius-full)`, padding `var(--space-2) var(--space-4)`, `min-height: 44px`, send message on click

### 1.7 Acessibilidade

- `role="log"` + `aria-live="polite"` na MessagesArea — screen reader anuncia novas mensagens sem interromper
- Cada bubble tem `aria-label="Anipis disse: {content}"` ou `aria-label="Você disse: {content}"`
- TypingIndicator: `aria-live="polite"`, `aria-label="Anipis está digitando"`
- Crisis banner: `role="alert"` + `aria-live="assertive"` (interrompe leitura)
- Focus management: após enviar mensagem, foco retorna ao textarea (não fica no Send btn). Ao abrir conversa, foco vai para textarea (não para histórico).
- Keyboard: Enter envia, Shift+Enter quebra linha. Esc com banner aberto = dismiss banner.
- Mín. 44px touch target em todos os botões (SendBtn, VoiceBtn, header buttons)

### 1.8 Responsive breakpoints

| Breakpoint | Layout adjustments |
|------------|---------------------|
| **320px** (smallest) | bubble max-width 90%, composer min-height 52px, header 52px |
| **480px** (mobile) | bubble max-width 85%, composer 56px (default) |
| **768px** (tablet) | container fica 480px centralizado, padding lateral `var(--space-8)` |
| **1024px+** (desktop) | sidebar conversation history aparece (out-of-scope SAI-RB-001 — fase 2), main chat continua 480px central |
| **1440px+** | mantém 480px (intimidade > screen real estate) |

**Densidade:** mobile mantém spacing tokens default; desktop NÃO aumenta padding interno das bubbles (intimidade preservada).

---

## 2. MoodCheckIn — Spec Estrutural

### 2.1 Single-question flow (anti-fricção)

Decisão IA: **single-question** (não multi-step). BJ Fogg minimal-friction + julie-zhuo "respect user time" + don-norman "principle of least effort". 1 pergunta, 4 emojis, submit ou skip — máximo 3 toques.

```
┌──────────────────────────────────────┐
│  "Como você tá agora?"               │ ← H3 General Sans 500
│   (Inter 14px caption: "1 pergunta") │
│                                      │
│  [😔]  [😐]  [🙂]  [😊]              │ ← 4 mood emojis (NÃO 5)
│                                      │
│  [Optional note textarea, 1 line]    │
│                                      │
│  [Confirmar] (primary, disabled)     │
│  [Pular]     (ghost link)            │
│                                      │
│  · · ·   ← 3 dots progress (subtle)  │
└──────────────────────────────────────┘
```

### 2.2 4 mood emojis dessaturados

**Regra F-12 Uma:** zero overlap com crisis colors. Os 4 moods usam paleta **dessaturada** (não emoji nativo OS — pode ser muito vibrante):
- Mood 1 (😔 baixo): `--mood-1: #7A6B8A` (lavanda fosca)
- Mood 2 (😐 neutro): `--mood-2: #8A8EB8` (azul cinza)
- Mood 3 (🙂 ok): `--mood-3: #A0B0B8` (cinza sálvia)
- Mood 4 (😊 bem): `--mood-4: #B8C4A0` (oliva tênue)

**Por que 4 (não 5)?** Single point of indecision (julie-zhuo) — número par força user a escolher lado (low/high), evita "meio termo seguro" que vicia.

Visual: cada emoji em círculo 56×56px, `border-radius: var(--radius-full)`, `background: color-mix(in oklch, var(--mood-N) 12%, transparent)`, hover `25%`, selected `40%` + ring 2px `var(--mood-N)`.

### 2.3 Submission feedback (anti-streak shaming)

- **NUNCA** mostrar streak ("3 dias seguidos! 🔥"). Ferimento direto em quem perdeu 1 dia.
- Após submit, mensagem warm: *"Obrigado por compartilhar."* (Inter 16px, neutro)
- Transição: card faz `transition: opacity .3s var(--motion-depart)` → fade out → redireciona para Chat com message pre-loaded baseada em mood selecionado
- Se mood-1 (😔 baixo) selecionado N dias consecutivos (≥3), sugestão sutil no chat: *"Notei que você tem chegado pesado. Quer que eu te conte sobre profissionais que confiamos?"* — **NÃO** modal interruptivo, **NÃO** badge alarmista

### 2.4 Progress indicator: dots (não bar)

```
   ·  ·  •    ← 3 dots, último filled = current step
```

- 3 dots horizontais, `width: 6px`, `height: 6px`, `border-radius: full`
- Inactive: `background: var(--color-neutral-300)`
- Active: `background: var(--color-primary-500)` (Aurora Coral)
- Gap entre dots: `var(--space-2)` (8px)
- **Por que dots?** Bar transmite "progresso obrigatório" (julie-zhuo) — dots são neutros, sugere etapa sem pressão de completude

### 2.5 Skip always available

Botão "Pular" sempre visível, ghost style (`background: transparent`, `color: var(--text-secondary)`, `text-decoration: underline` no hover). **Nunca esconde, nunca cinza opacity .3** — full opacity sempre. Skip é decisão legítima, não falha.

### 2.6 Acessibilidade

- `role="radiogroup"` no container dos 4 emojis, `aria-label="Como você se sente agora"`
- Cada emoji: `role="radio"`, `aria-checked={selected}`, `aria-label="Mood: baixo/neutro/ok/bem"`
- Keyboard: arrow left/right navega entre emojis, Enter/Space seleciona, Tab move para submit
- Focus visible: ring 2px `var(--color-primary-500)` + offset 2px
- Note textarea: `aria-label="Note opcional (apertar enter para enviar)"`, max 280 chars com counter visível últimos 40 chars

---

## 3. BreathingExercise — Spec Estrutural

### 3.1 Visual orb expansion/contraction

**Estrutura central:**
```
        ┌─────────────────────┐
        │   Ciclo 2 de 4      │   ← Inter 12px caption
        │                     │
        │       ◯             │   ← orb 224×224px (h-56 w-56)
        │     [Inspire...]    │     scale 0.5 → 1.0 baseado em phase
        │                     │
        │   • inhale ━ hold ━ exhale  │ ← phase bar 3 segments
        │                     │
        │   [Parar]           │   ← ghost link, always visible
        └─────────────────────┘
```

- Orb: `position: absolute`, `inset: 0`, `border-radius: full`
- `background: radial-gradient(circle, var(--color-primary-300), var(--color-primary-500))` (Aurora Coral degradê warm)
- Transform inline: `scale(${0.5 + progress * 0.5})` → expande 50%→100% durante inhale, mantém 100% no hold, contrai 100%→50% no exhale
- Opacity: `0.6 + progress * 0.3` no inhale/exhale, `0.9` no hold (mais sólido quando segura)
- Sem stroke/border — apenas glow suave do gradient
- Center text "Inspire..." / "Segure..." / "Expire...": `font-family: var(--font-heading)` General Sans 500, `color: white`, `font-size: var(--text-h4)` (18-20px clamp)

### 3.2 Timing: 4-7-8 protocol exato

- **Inhale:** 4000ms · easing `var(--motion-breath)` (cubic-bezier(0.45, 0, 0.15, 1)) — entry slow, settle smooth
- **Hold:** 7000ms · scale fixo, sem animação (só pulse opcional .9↔1.0 em loop 3500ms reduced)
- **Exhale:** 8000ms · easing `var(--motion-breath)` reverso — release lento
- **Total ciclo:** 19s. 4 ciclos = 76s ≈ **1m16s** experiência completa
- Loop via `requestAnimationFrame` (não setInterval — drift) baseado em `Date.now() - startTimeRef.current`

### 3.3 Audio optional (ambient brown noise)

- Default: **OFF** (anti-imposição F-06 motion principles)
- Toggle no topo direito: ícone speaker, `aria-label="Som ambiente ligado/desligado"`
- Audio source: `/audio/brown-noise-loop-8s.mp3` (CC0 license, 16kHz mono, ~80KB)
- Volume default: 0.15 (subtle, não compete com voz interna)
- Persist state: `localStorage.setItem('anipis-breath-audio', 'on'|'off')` — respeita escolha futura

### 3.4 Cycle counter visual

Phase bar 3 segments abaixo do orb:
```
   ▬▬▬  ━━━━  ▬▬▬
inhale   hold   exhale (highlighted = current phase)
```
- Cada segment: `height: 6px`, `border-radius: var(--radius-full)`
- Active: `width: 48px`, `background: var(--color-primary-500)`
- Inactive: `width: 32px`, `background: var(--color-neutral-200)`
- Smooth `transition: all var(--motion-arrive)`

Acima do orb, counter texto `"Ciclo {N} de 4"` em Inter 12px caption neutro — informativo, não gamificado.

### 3.5 Exit gracefully sempre

- Botão "Parar" presente em **TODAS** as phases (idle, inhale, hold, exhale, done)
- Click "Parar" → confirm soft modal: *"Quer parar agora? Tá tudo bem."* [Continuar] [Sair]
- Se user sair mid-exercise: salva partial completion (`duration_seconds` real), **NÃO** pede rating, **NÃO** mostra "incomplete!" shaming
- Voltando depois, próximo start é fresh — sem "you abandoned last session" guilt

### 3.6 Reduced-motion fallback (CRÍTICO)

`@media (prefers-reduced-motion: reduce)`:
- Orb **estático**, scale fixo em 0.85, sem expand/contract
- Substitui animação por **timer textual numérico**: `<div class="countdown">4 ▸ 3 ▸ 2 ▸ 1</div>` no centro do orb (font-mono, large)
- Phase bar continua highlight mas sem `transition`
- Audio brown noise mantido (não é motion)
- Instructions explicit: *"Inspire pelo nariz. Conte 4."* (texto, não visual)

**Por que isso importa:** users com vestibular disorders ou histórico de trauma com motion (PTSD trigger) precisam acessar o exercício sem nausea risk. Reduced-motion **não é fallback degradado** — é experiência paralela igualmente válida.

---

## 4. OnboardingFlow — Spec Estrutural

### 4.1 5 steps maximum (BJ Fogg minimal-friction)

**Atual codebase tem 6 steps (0-5).** Recomendo **reduzir para 5** consolidando AgeGate + PersonalContext em um único "Sobre você":

| Step | Nome | Conteúdo | Time est. |
|------|------|----------|-----------|
| **0** | Welcome | Greeting + Fraunces pull-quote + CTA "Começar" | 30s |
| **1** | Consent granular | LGPD Art. 11 health data + AI disclosure + opcionais | 90s |
| **2** | Baseline check-in | PHQ-9 short (4 questions key) + GAD-7 short (4 questions key) | 120s |
| **3** | Facilitator intro | "Anipis é companheiro, não terapeuta" + ANPD + CFM marks + crisis routing | 60s |
| **4** | First conversation primer | Sobre você (nome + reason opcional) + "como vamos conversar" | 60s |

**Total: ~5min.** Time estimate visível no header desde step 0.

### 4.2 Per-step structure

```
┌─────────────────────────────────────┐
│  ·  •  ·  ·  ·    (~5 min)          │ ← dots + time
├─────────────────────────────────────┤
│                                     │
│  [I-02 onboarding horizonte render] │ ← Flux Warm illustration
│                                     │
│  "Bem-vindo."                       │ ← Fraunces Italic 22px
│  "Vamos no seu ritmo."              │ ← Inter 16px body
│                                     │
│  [Step content area — varies]       │
│                                     │
│  [Voltar]           [Continuar]     │ ← ghost + primary
└─────────────────────────────────────┘
```

- Container: `max-width: 480px`, `min-height: 100dvh`, `flex column justify-center`
- Padding: `var(--space-6)` (24px) mobile, `var(--space-8)` (32px) tablet+
- Background: `var(--bg-page)` warm theme (Calm/Soft user pode alternar dps no /settings, NÃO no onboarding — too much choice)

### 4.3 Progress dots subtle (não bar)

```
   ·  •  ·  ·  ·    ← 5 dots horizontal, active filled
```

- 5 dots, 6px width, gap `var(--space-2)`
- Active: `--color-primary-500` Aurora Coral
- Completed: `--color-primary-300` (lighter, indicates "done")
- Pending: `--color-neutral-300`
- **No percentage shown, no "Step 2/5" text** — dots são suficientes (don-norman: principle of recognition, not recall)

### 4.4 Skip/back per step

| Step | Skip | Back | Notes |
|------|------|------|-------|
| 0 Welcome | ❌ não | ❌ não | Entry point, no skip — but no commitment yet |
| 1 Consent | ❌ skip não permitido (LGPD legal) | ✅ Back | Granular checkboxes, mas LGPD Art. 11 mandatory |
| 2 Baseline | ✅ "Pular essa parte" link | ✅ Back | Skip = sem baseline score, marcado `is_baseline: false` |
| 3 Facilitator | ✅ "Já entendi, próximo" | ✅ Back | Educational, skip aceitável |
| 4 Primer | ✅ "Começar agora" sem nome | ✅ Back | Display name opcional |

**Back button sempre à esquerda, ghost style.** Forward button sempre à direita, primary style. Min 44px touch target.

### 4.5 Crisis screen trigger (PHQ-9 ≥ 20 = severe)

**Critical safety hook.** No step 2 (baseline), se PHQ-9 calculado ≥ 20 OU GAD-7 ≥ 15 OU question 9 PHQ ("thoughts of being better off dead") > 0:

1. **Imediatamente** redirect para `/crisis-encaminhamento` (out-of-cohort screen)
2. Tela full-screen, `bg: var(--crisis-orange-bg)`, ícone CrisisHand custom
3. Texto Fraunces Italic 22px: *"O que você tá sentindo agora merece cuidado especializado."*
4. Inter 16px body: *"Anipis foi pensado pra apoio entre sessões — não substitui esse momento agora. Aqui estão caminhos que confiamos:"*
5. 3 CTAs verticais grandes (`min-height: 56px`, `--touch-target-crisis`):
   - **CVV 188** (ligar) — `tel:188`
   - **SAMU 192** (emergência) — `tel:192`
   - **CAPS local** — link `/recursos/caps` com geolocation
6. Footer: *"Quando estiver com profissional, Anipis pode te apoiar no dia-a-dia. Volte quando se sentir pronto(a)."*
7. **Acceptance criteria:** user NÃO consegue prosseguir para chat sem dismiss explícito com checkbox *"Li e entendi. Vou buscar ajuda profissional."*

**Por que out-of-cohort e não em-app crisis chat?** CFM 2.454/2026 + Resolução ANPD: AI companions **não** podem ser primeiro responder em ideação ativa. Encaminhamento ético = mandatory.

### 4.6 Time estimate visible

Header de cada step: `~5 min` em Inter 12px caption neutro, ao lado dos dots. Após step 1, reduz dinamicamente: *~4 min*, *~3 min*, etc. Cálculo: `(5 - currentStep) * 60` segundos approx.

### 4.7 Acessibilidade

- Cada step: `<section aria-labelledby="step-{n}-heading">` com `<h1 id="step-{n}-heading">` único
- Focus management: ao mudar step, foco move para o h1 do novo step (não para o continue button)
- `aria-live="polite"` no progress dots container — announces "Step 3 de 5" para screen readers
- Form fields: `<label>` explícito (não placeholder-only), `aria-describedby` para help text
- Crisis screen: `role="alert"` + `aria-live="assertive"` + autofocus no primeiro CTA

---

## 5. HeroPage — Spec Estrutural

### 5.1 Above-the-fold layout

```
┌────────────────────────────────────────┐
│  [Logo D3 Breathing Form]              │ ← top-left
│                                        │
│  [Hero render Flux Warm — full bleed]  │ ← bg behind text
│                                        │
│  "Estar não-sozinho importa."          │ ← Fraunces Italic 28px
│   pull-quote, 1 line max               │   var(--text-quote)
│                                        │
│  "Anipis é seu companheiro de IA       │ ← Inter 18px body-lg
│   para momentos difíceis. Não          │   max 2 lines
│   substitui terapia."                  │
│                                        │
│  [Começar agora] (primary Aurora)      │ ← btn-primary 56px
│  ~5 min · grátis · sem cartão          │ ← microcopy 12px
└────────────────────────────────────────┘
```

- Container: `max-width: 720px` (não 480px — hero precisa amplitude visual), `margin-inline: auto`
- Padding vertical: `var(--space-16)` mobile, `var(--space-20)` (5rem) desktop
- Hero render: `aspect-ratio: 16/9` mobile, `21/9` desktop, `object-fit: cover`, `border-radius: var(--radius-md)`
- Render é Flux Warm "horizonte amanhecendo" (I-02 onboarding ou hero-only render) — **mood: warm, contemplative, NÃO clinical/medical**

### 5.2 Value proposition (Fraunces 1-line pull-quote)

- **Headline:** Fraunces Italic 22-28px clamp, `--text-quote`, `font-weight: 500`, `color: var(--text-primary)`
- Single line preferred — se quebrar em mobile, OK até 2 lines max
- Anti-claims: **NÃO** "Cure sua ansiedade", **NÃO** "Substitua seu terapeuta", **NÃO** "Saúde mental garantida"
- Voice charter F-07: nomeia presença, não promete cura. Exemplos válidos:
  - *"Estar não-sozinho importa."*
  - *"Para os momentos difíceis."*
  - *"Companheiro para quando ninguém atende."*

### 5.3 CTA primary

- `<button class="btn-primary">` Aurora Coral solid
- Spec: `height: 56px`, `padding: 0 var(--space-8)`, `border-radius: var(--radius-md)`, `font-family: var(--font-heading)` General Sans 600 16px
- `background: var(--color-primary-500)` (`#DC6B3A`)
- `color: var(--text-on-primary)` (white, AAA contrast verified)
- Hover: `background: var(--color-primary-600)` darken 10%
- Focus visible: ring 3px `var(--color-primary-300)` offset 2px
- Microcopy abaixo: *"~5 min · grátis · sem cartão"* em Inter 12px `var(--text-muted)` — anti-fricção signal

### 5.4 Sub-fold: 3 benefit pills + disclaimer + marks

```
┌─────────────────────────────────────────┐
│  [🫂 Companheiro]                       │
│   "Conversa empática, não diagnóstico"  │
│                                         │
│  [🔬 Científico]                        │
│   "Embasado em TCC + PHQ-9 + GAD-7"     │
│                                         │
│  [🇧🇷 Brasileiro]                       │
│   "Pensado pra contexto BR (CFM/LGPD)"  │
├─────────────────────────────────────────┤
│  ⚠️ Aviso: Anipis não é serviço médico  │
│  ✓ ANPD Compliance   ✓ CFM 2.454/2026   │
└─────────────────────────────────────────┘
```

- 3 pills em grid: 1 column mobile, 3 columns ≥768px
- Pill: `padding: var(--space-4)`, `border-radius: var(--radius-md)`, `background: var(--bg-elevated)`, `border: 1px solid var(--color-neutral-200)`
- Icon top (Phosphor or custom flame/breath/companion), label H4 General Sans 500, body Inter 14px
- Clinical disclaimer: faixa amber-tinted `var(--crisis-yellow-bg)` com `border-left: 4px var(--crisis-yellow)`, ícone warning, texto explícito *"Anipis não substitui acompanhamento profissional"*
- ANPD + CFM marks: small badges 32px height, link para `/legal/anpd-compliance` e `/legal/cfm-2454`

### 5.5 Footer: crisis routing inline (visible bottom)

```
┌─────────────────────────────────────────┐
│  Em crise agora?                         │
│  [📞 CVV 188] (24h)  [🚑 SAMU 192]      │
│                                          │
│  © 2026 Anipis · Termos · Privacidade   │
└─────────────────────────────────────────┘
```

- `background: var(--bg-page)`, `border-top: 1px solid var(--color-neutral-200)`, `padding: var(--space-8)`
- Crisis CTAs: `tel:188` e `tel:192` clickable, `min-height: 48px` (`--touch-target-crisis`), inline-flex com phone icon
- CVV pill: `bg: var(--crisis-orange-bg)`, border-left 3px `--crisis-orange`
- **Sempre visível, sempre clickable** — não atrás de menu, não escondido. Heurística Nielsen #9 (Help users recover).

### 5.6 Mobile-first responsive

| Breakpoint | Adjustments |
|------------|-------------|
| 320px | Hero render aspect 4/3, pull-quote 22px, CTA full-width |
| 480px | Hero 16/9, pull-quote 24px |
| 768px | Container 720px, 3 pills horizontal, pull-quote 26px |
| 1024px+ | Pull-quote 28px, hero render 21/9 cinematic |

---

## 6. Cross-Component Principles

### 6.1 Animation language consistency

Todos os 5 componentes usam **mesma família de easing tokens** (não easings ad-hoc):

- `var(--motion-arrive)` `400ms cubic-bezier(0, 0.5, 0.3, 1)` — entrada de elementos (bubbles, cards, steps)
- `var(--motion-depart)` `300ms cubic-bezier(0.5, 0, 1, 0.5)` — saída de elementos (dismiss, close)
- `var(--motion-settle)` `400ms cubic-bezier(0.45, 0, 0.15, 1)` — transições neutras (state change)
- `var(--motion-breath)` `8000ms cubic-bezier(0.45, 0, 0.15, 1)` — apenas BreathingExercise orb
- `var(--motion-heartbeat)` `200ms cubic-bezier(0.34, 1.56, 0.64, 1)` — micro-feedback (button press)
- `var(--motion-pulse)` `1800ms cubic-bezier(0.4, 0, 0.6, 1)` — TypingIndicator dots

**Stagger:** `var(--stagger-fast)` 80ms (lista pequena), `var(--stagger-slow)` 150ms (TypingIndicator).

### 6.2 Voice consistency

Voice charter v2 (`07-VOICE-REFINED.md`) aplica em **TODOS** os componentes:
- Tratamento: **você sempre** (nunca tu, nunca vocês, nunca senhor/senhora)
- Anti-positividade tóxica: zero "Vamos lá!", "Tá tudo bem!", "Você consegue!"
- Anti-shaming: zero streak, zero "incomplete", zero "abandoned"
- Companheiro nunca terapeuta: zero "Eu te entendo", zero "Vamos trabalhar isso", zero "Sua ansiedade está dizendo que..."
- Brazilian context: PT-BR informal, abreviações comuns OK ("tá", "pra"), regionalismo neutro

### 6.3 Reduced-motion strategy (universal)

`@media (prefers-reduced-motion: reduce)` aplicado **em toda a app, não opt-in**:
- Disable: parallax, orb breath animation, bubble enter slide, page transitions, ambient canvas
- Keep: opacity fades (`<300ms`), color transitions, scale `±5%` apenas em hover/focus
- Replace motion with **text+timing** quando relevante (BreathingExercise countdown numérico)
- Crisis screens: **sempre** reduced-motion forced (independent of OS setting) — F-12 mandate

### 6.4 Dark mode pairing

MVP scope: **apenas Warm theme suporta dark**. Calm + Soft dark mode = fase 2 (R5 risco).

- Trigger: `data-color-scheme="dark"` no `<html>` + `prefers-color-scheme: dark` query
- Bg tokens swap: `--bg-page` light `#FAFAF8` → dark `#1A1815` (warm dark, não black puro)
- Chat bubbles AI: `--chat-bubble-ai-bg` `#FFF1E8` light → `#2E2620` dark (warm brown)
- Crisis colors: **mantém AAA contrast** em dark (`--crisis-red-strong` `#A11C1C` mantido, contrast verified)
- Fraunces Italic: mantém legibilidade em dark (italic + Fraunces tem hairlines finas — testar weight 500+ em dark)

---

## 7. Handoff Notes

- **@ui-designer:** Tokens hex finais em `05-design/tokens.json`. Não duplicar valores neste doc — sempre referenciar var.
- **@design-systems-engineer:** Multi-theme switcher via `data-theme="warm|calm|soft"` no `<html>`. Persist em localStorage + Supabase sync (não bloqueia render).
- **@dev (Dex):** Componentes atuais em `apps/serenity-ai/apps/web/src/components/features/` — usar feature flag pattern `brand-v2-{component}-enabled` (EPIC-8 section 5).
- **@qa:** axe-core CI gate score ≥90 obrigatório. Manual review AAA para crisis screens (BreathingExercise sair, ChatWindow crisis banner red, OnboardingFlow crisis trigger). Visual regression Percy baseline antes de merge.
- **Mind Clones consultados:** don-norman (heurísticas + recognition over recall), julie-zhuo (anti-streak shaming + dot progress), vitaly-friedman (responsive + reduced-motion universal default)

---

*— Flow, desenhando experiências 🔄*
