# Component Previews v2

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Conteúdo:** Specs HTML/CSS textuais de 5 mockups críticos. **SEM PNGs** — apenas estrutura + tokens references. Render visual após user aprovar direction (Logo D-UX-01).
**Tokens usados:** v2 de `09-TOKENS-DRAFT.md`. Theme default: Warm.

---

## Mockup 1 — ChatWindow (light mode, Warm theme)

### Estrutura

```
┌─────────────────────────────────────────┐
│  Header (sticky top, blur backdrop)     │
├─────────────────────────────────────────┤
│                                         │
│  AmbientBackground (canvas generative)  │
│                                         │
│  ┌── ScrollArea (messages container)  ─┐│
│  │                                     ││
│  │  [Anipis bubble]                    ││
│  │           [User bubble]             ││
│  │  [Anipis bubble]                    ││
│  │  [TypingIndicator]                  ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
├─────────────────────────────────────────┤
│  InputArea (sticky bottom)              │
│  [VoiceBtn] [Input] [SendBtn]           │
├─────────────────────────────────────────┤
│  DisclaimerStrip (12px persistent)      │
└─────────────────────────────────────────┘
```

### HTML/CSS textual

```html
<div class="chat-window" data-theme="warm">

  <!-- Header -->
  <header class="chat-header">
    <button aria-label="Voltar" class="icon-btn">
      <ArrowLeft size="md" />
    </button>
    <div class="chat-title">
      <AnipisCompanion size="sm" variant="duotone" class="text-primary-500" />
      <span>Anipis</span>
      <span class="connection-indicator online" aria-label="Online" />
    </div>
    <button aria-label="Falar com pessoa real" class="icon-btn bridge-btn">
      <AnipisBridge size="md" />
    </button>
  </header>

  <!-- Ambient background -->
  <canvas
    class="ambient-bg"
    aria-hidden="true"
    /* perlin noise 0.5Hz, opacity 0.03, mood-aware */
  />

  <!-- Messages scroll area -->
  <div class="messages-area" role="log" aria-live="polite">

    <!-- Anipis bubble -->
    <div class="bubble bubble-ai">
      <p>Oi. Que bom te ver aqui. Como você tá?</p>
      <time class="timestamp">14:32</time>
    </div>

    <!-- User bubble -->
    <div class="bubble bubble-user">
      <p>tô mal de novo</p>
      <time class="timestamp">14:33</time>
    </div>

    <!-- Typing indicator -->
    <div class="bubble bubble-ai typing-indicator">
      <span class="typing-dot" /><span class="typing-dot" /><span class="typing-dot" />
    </div>

  </div>

  <!-- Input area -->
  <div class="input-area">
    <button class="voice-btn" aria-label="Ditar mensagem">
      <Microphone size="md" />
    </button>
    <input
      type="text"
      placeholder="aa, escreva..."
      class="message-input"
      aria-label="Escrever mensagem"
    />
    <button class="send-btn" aria-label="Enviar">
      <PaperPlaneRight size="md" weight="fill" />
    </button>
  </div>

  <!-- Disclaimer -->
  <footer class="disclaimer-strip">
    Companheiro de IA · Não substitui profissional · Em crise: 188 CVV
  </footer>

</div>
```

### CSS specs (key tokens)

```css
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 480px;        /* mobile-first intimate */
  margin-inline: auto;
  background: var(--bg-page);  /* #FAFAF8 warm theme light */
  position: relative;
}

.chat-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding-inline: var(--space-4);
  background: color-mix(in oklch, var(--bg-page) 80%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-neutral-200);
}

.chat-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-heading);
  font-size: var(--text-h5);    /* 16px General Sans 600 */
  font-weight: 600;
  color: var(--text-primary);
}

.connection-indicator.online {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-success);
}

.ambient-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.03;
  pointer-events: none;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  z-index: 1;
}

.bubble {
  max-width: 85%;
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.5;
}

.bubble-user {
  align-self: flex-end;
  background: var(--chat-bubble-user-bg);    /* #DC6B3A */
  color: var(--chat-bubble-user-text);
  border-radius: 20px 20px 4px 20px;        /* tail bottom-right */
}

.bubble-ai {
  align-self: flex-start;
  background: var(--chat-bubble-ai-bg);      /* #FFF1E8 */
  color: var(--chat-bubble-ai-text);
  border: 1px solid var(--chat-bubble-ai-border);  /* #FFDCBF */
  border-radius: 20px 20px 20px 4px;        /* tail bottom-left */
}

.timestamp {
  display: block;
  margin-top: var(--space-1);
  font-size: var(--text-caption);  /* 12px */
  opacity: 0.65;
}

.typing-indicator {
  display: inline-flex;
  gap: 4px;
  padding: var(--space-3) var(--space-4);
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-primary-500);
  animation: pulse-dot var(--motion-pulse) ease infinite;
}
.typing-dot:nth-child(2) { animation-delay: var(--stagger-slow); }
.typing-dot:nth-child(3) { animation-delay: calc(var(--stagger-slow) * 2); }

.input-area {
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface);  /* #FFFFFF */
  border-top: 1px solid var(--color-neutral-200);
}

.message-input {
  flex: 1;
  height: 44px;                    /* touch target min */
  padding: 0 var(--space-4);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-full);
  background: var(--color-neutral-50);
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--text-primary);
}

.message-input:focus {
  outline: 3px solid color-mix(in oklch, var(--color-primary-500) 35%, transparent);
  outline-offset: 1px;
  border-color: var(--color-primary-500);
}

.voice-btn, .send-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-primary-700);
  transition: background var(--motion-settle);
}

.send-btn {
  background: var(--color-primary-500);
  color: white;
}

.disclaimer-strip {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-caption);  /* 12px */
  color: var(--text-secondary);
  text-align: center;
  background: var(--bg-surface);
  border-top: 1px solid var(--color-neutral-200);
}

/* Reduced motion fallbacks */
@media (prefers-reduced-motion: reduce) {
  .ambient-bg { display: none; }
  .typing-indicator { /* substituir por <span>Anipis está pensando...</span> */ }
}
```

### Specs comportamento

- **Auto-scroll**: messages-area scrolls para bottom em new message, smooth se < 200 messages, instant se >
- **Typing indicator**: aparece 1.5-3s após user enviar (latência artificial intencional, brand "Anipis pensa")
- **Voice button**: hold-to-record (drag up to cancel). Tap also OK (single press → modal record)
- **Input auto-grow**: cresce até 4 linhas, depois scrolls

---

## Mockup 2 — MoodCheckIn

### Estrutura

```
┌─────────────────────────────────────────┐
│  Header (back btn + skip link)          │
├─────────────────────────────────────────┤
│                                         │
│  Title — "Como você está agora?"        │
│  Body  — "Sem pressão. Só o que vier."  │
│                                         │
│  ┌── MoodCircle (visual) ─────────────┐ │
│  │       ◯ 120px                     │ │
│  │   color shifts with slider        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  CurrentLabel — "Estou neutro"          │
│         (italic Fraunces)               │
│                                         │
│  ┌── MoodSlider ────────────────────┐  │
│  │  ◯━━━━━━━━●━━━━━━━━◯             │  │
│  │  difícil          muito bem      │  │
│  └─────────────────────────────────┘   │
│                                         │
│  [   Registrar   ]                      │
│  [    Pular     ]                       │
│                                         │
└─────────────────────────────────────────┘
```

### CSS specs

```css
.mood-checkin {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8) var(--space-6);
  background: var(--bg-page);
  min-height: 100dvh;

  /* atmosphere shifts based on slider value */
  transition: background var(--motion-breath);
}

.mood-checkin[data-mood="1"] { background: color-mix(in oklch, var(--mood-1) 5%, var(--bg-page)); }
.mood-checkin[data-mood="2"] { background: color-mix(in oklch, var(--mood-2) 5%, var(--bg-page)); }
.mood-checkin[data-mood="3"] { background: color-mix(in oklch, var(--mood-3) 5%, var(--bg-page)); }
.mood-checkin[data-mood="4"] { background: color-mix(in oklch, var(--mood-4) 5%, var(--bg-page)); }
.mood-checkin[data-mood="5"] { background: color-mix(in oklch, var(--mood-5) 5%, var(--bg-page)); }

.mood-title {
  font-family: var(--font-heading);
  font-size: var(--text-h2);   /* 24-32px clamp */
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-2);
}

.mood-body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--space-8);
}

.mood-circle {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  background: var(--current-mood-color); /* CSS var updated by JS */
  box-shadow: var(--shadow-elevated);
  transition: background var(--motion-breath);
  margin-bottom: var(--space-4);
}

.mood-current-label {
  font-family: var(--font-quote);   /* Fraunces Italic */
  font-style: italic;
  font-size: var(--text-quote);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
  transition: opacity var(--motion-settle);
}

.mood-slider {
  width: 100%;
  max-width: 320px;
  height: 8px;
  background: linear-gradient(
    to right,
    var(--mood-1),
    var(--mood-2),
    var(--mood-3),
    var(--mood-4),
    var(--mood-5)
  );
  border-radius: var(--radius-full);
  margin-bottom: var(--space-8);
  position: relative;
}

.mood-thumb {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: white;
  border: 3px solid var(--text-primary);
  box-shadow: var(--shadow-soft);
  position: absolute;
  top: -10px;
  transform: translateX(-50%);
  cursor: grab;
}
```

### Specs comportamento

- **Slider continuous** (não 5 buttons discretos)
- **Real-time visual feedback**: background, circle color, current label transition smoothly conforme drag
- **No commit until user clicks "Registrar"** — pode mexer livremente
- **"Pular" link sempre presente** — autonomy princípio
- **Após registrar**: fade out circle → chat appear (smooth transition)

---

## Mockup 3 — BreathingExercise

### Estrutura

```
┌─────────────────────────────────────────┐
│  [← voltar]                  [pular]    │
├─────────────────────────────────────────┤
│                                         │
│  Title — "Respire comigo"               │
│                                         │
│         ┌──────────────────┐           │
│         │                  │           │
│         │      ◯           │ ← orb     │
│         │   ◯ ◯ ◯          │   expand/  │
│         │      ◯           │   contract │
│         │                  │   8s loop  │
│         └──────────────────┘           │
│                                         │
│  Instruction — "Inspire..."             │
│      (changes 0→4s: Inspire             │
│            4→8s: Expire)                │
│                                         │
│  ●●●●●○○○○○                             │
│  1 de 10 ciclos                         │
│                                         │
└─────────────────────────────────────────┘
```

### CSS specs

```css
.breathing-exercise {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: var(--space-8) var(--space-6);
  background: var(--bg-page);
}

.breathing-orb {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-full);
  background: radial-gradient(
    circle,
    var(--color-primary-200) 0%,
    var(--color-primary-100) 70%,
    transparent 100%
  );
  animation: breathe-cycle var(--motion-breath) ease infinite;
  margin-bottom: var(--space-8);
}

@keyframes breathe-cycle {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%      { transform: scale(1.15); opacity: 1; }
}

.breathing-instruction {
  font-family: var(--font-quote);
  font-style: italic;
  font-size: var(--text-quote);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
  transition: opacity var(--motion-settle);
}

.cycle-progress {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.cycle-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background: var(--color-neutral-200);
}
.cycle-dot.completed {
  background: var(--color-primary-500);
}

.cycle-counter {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  color: var(--text-secondary);
}

/* Reduced motion: orb static, instruction is plain text */
@media (prefers-reduced-motion: reduce) {
  .breathing-orb { animation: none; }
  .breathing-exercise-reduced { /* alternative layout — passos numerados */ }
}
```

### Specs comportamento

- **8s cycle**: 4s scale up (inspire) + 4s scale down (expire)
- **Instruction text** alterna entre "Inspire..." e "Expire..." sincronizado
- **Sem som** (decisão Ethical UX — não auto-play)
- **Skip permitted any time** — link top-right
- **Após 10 ciclos**: opcional "Como você se sente agora?" (opt-in MoodCheckIn)
- **Reduced-motion**: layout passos numerados sem orbe (texto guia)

---

## Mockup 4 — OnboardingFlow (tela 2, disclaimer)

### Estrutura

```
┌─────────────────────────────────────────┐
│  [← voltar]                             │
├─────────────────────────────────────────┤
│                                         │
│  Illustration — robô + humano em        │
│       diálogo (Tier 1 SVG)              │
│                                         │
│  Title — "Antes de tudo, uma            │
│          honestidade:"                  │
│                                         │
│  Bullet 1 — Eu sou uma IA.              │
│             Não sou terapeuta...        │
│  Bullet 2 — Eu não faço diagnósticos    │
│             nem receito remédios.       │
│  Bullet 3 — Se você estiver em          │
│   ⚠️       crise: CVV 188 24h.          │
│   (highlight crisis-red)                │
│                                         │
│  [   Entendi   →  ]                     │
│                                         │
│  Dots —  ◯ ● ◯                         │
│                                         │
└─────────────────────────────────────────┘
```

### CSS specs

```css
.onboarding-screen {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: var(--space-8) var(--space-6);
  background: var(--bg-page);
}

.onboarding-illustration {
  width: 280px;
  height: 280px;
  margin: 0 auto var(--space-8);
}

.onboarding-title {
  font-family: var(--font-heading);
  font-size: var(--text-h2);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.disclaimer-bullets {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  margin-bottom: var(--space-8);
}

.disclaimer-bullet {
  display: flex;
  gap: var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.7;
  color: var(--text-primary);
}

.disclaimer-bullet.crisis-highlight {
  background: var(--crisis-yellow-bg);
  border-left: 3px solid var(--crisis-orange);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.btn-primary {
  width: 100%;
  height: 48px;
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--text-body);
  cursor: pointer;
  transition: background var(--motion-settle), transform var(--motion-heartbeat);
}
.btn-primary:hover { background: var(--color-primary-700); }
.btn-primary:active { transform: scale(0.98); }

.onboarding-dots {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-neutral-300);
}
.dot.active {
  background: var(--color-primary-500);
  width: 24px;
  transition: all var(--motion-settle);
}
```

### Specs comportamento

- **Swipe horizontal**: 3 telas onboarding (welcome / disclaimer / consent)
- **Disclaimer tela** não tem skip (legal compliance)
- **Botão "Entendi"** apenas avança (não é consent — só leitura)
- **Tela 3 consent** tem checkboxes granulares + "Começar" disabled até obrigatório marcado

---

## Mockup 5 — HeroPage (Landing)

### Estrutura

```
┌─────────────────────────────────────────────────────┐
│  Nav (logo + Conversar)                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Hero                                               │
│                                                     │
│  H1 (Fraunces? não — General Sans)                  │
│  "Pra você que precisa de alguém                    │
│   às 4h da manhã."                                  │
│                                                     │
│  Body-lg                                            │
│  "Apoio emocional brasileiro, IA, R$29,90/mês.      │
│   Não é terapeuta."                                 │
│                                                     │
│  CTA-primary                                        │
│  [ Conversar agora — grátis 7 dias ]                │
│                                                     │
│  Ghost link                                         │
│  [ O que é isso? ]                                  │
│                                                     │
│  Quote (Fraunces Italic)                            │
│  "Estou aqui."                                      │
│       — (orbe pequeno respirando)                   │
│                                                     │
│  Disclaimer no footer:                              │
│  Companheiro de IA · Não substitui prof. ·          │
│  Em crise: 188 CVV                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### CSS specs

```css
.hero {
  min-height: 100dvh;
  padding: clamp(var(--space-8), 5vh, var(--space-16)) var(--space-6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 720px;
  margin-inline: auto;
  background: linear-gradient(
    180deg,
    var(--bg-page) 0%,
    color-mix(in oklch, var(--color-primary-50) 30%, var(--bg-page)) 100%
  );
}

.hero-headline {
  font-family: var(--font-heading);
  font-size: var(--text-display);    /* clamp 36-56px */
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body-lg);    /* clamp 18-20px */
  line-height: 1.65;
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
  max-width: 540px;
}

.hero-cta-primary {
  display: inline-flex;
  align-items: center;
  height: 56px;
  padding: 0 var(--space-8);
  background: var(--color-primary-500);
  color: white;
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--text-body-lg);
  text-decoration: none;
  transition: background var(--motion-settle), transform var(--motion-heartbeat);
  margin-right: var(--space-4);
}
.hero-cta-primary:hover {
  background: var(--color-primary-700);
}
.hero-cta-primary:active {
  transform: scale(0.98);
}

.hero-cta-ghost {
  display: inline-flex;
  align-items: center;
  height: 56px;
  padding: 0 var(--space-4);
  background: transparent;
  color: var(--color-primary-700);
  font-family: var(--font-body);
  font-weight: 500;
  text-decoration: underline;
}

.hero-quote {
  margin-top: var(--space-12);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-quote);
  font-style: italic;
  font-size: var(--text-quote);
  color: var(--text-secondary);
}

.hero-orb-small {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-primary-300);
  animation: breathe-cycle var(--motion-breath) ease infinite;
}
```

### Specs comportamento

- **Hero loads <2.5s** em 3G (Friedman performance budget)
- **Headline animation**: fade-in 600ms ease on mount (sem typewriter)
- **Orb pequeno respira** (8s cycle) — única animação ambient na hero
- **CTA primary**: full-width em mobile, inline em desktop ≥768px
- **Dark mode**: testado com mesmo layout, paleta dark variant
- **Reduced-motion**: orbe estático, headline aparece instant

---

## Tokens checklist por mockup

| Mockup | Color tokens | Typography tokens | Spacing | Motion |
|--------|--------------|-------------------|---------|--------|
| ChatWindow | primary-500/700, neutral-50/200/500/800, ai-bubble | h5, body, caption | 1, 2, 3, 4 | settle, pulse |
| MoodCheckIn | mood-1 a mood-5, primary-500 | h2, body, quote | 4, 6, 8 | breath, settle |
| BreathingExercise | primary-100/200/500, neutral-200 | quote, caption | 6, 8 | breath |
| OnboardingFlow | primary-500/700, crisis-yellow-bg, crisis-orange | h2, body | 4, 5, 6, 8 | settle, heartbeat |
| HeroPage | primary-50/500/700/300, bg-page | display, body-lg, quote | 6, 8, 12, 16 | breath (orb), heartbeat (cta) |

---

## Próximos passos

1. Após D-UX-01 (logo) + D-UX-02 (theme): render visual em Figma de cada mockup
2. Componentizar em `apps/serenity-ai/src/components/`:
   - `ChatWindow.tsx`, `MoodCheckIn.tsx`, `BreathingExercise.tsx`, `OnboardingFlow.tsx`, `Hero.tsx`
3. Storybook stories para cada (com all 3 themes + light/dark + reduced-motion)
4. Visual regression tests com Chromatic (post-implementation)

---

*Uma — UX Design Expert · 2026-05-16*
*"Specs textuais antes de pixels. Decisões antes de renders. Custos antes de surpresas."*
