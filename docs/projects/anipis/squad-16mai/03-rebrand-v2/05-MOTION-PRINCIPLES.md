# Motion Principles v2

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Mudança vs v1:** Motion vira **brand element** (não decoração). 5 motion principles ético-calmos. Tokens consolidados de 4 → 6. Compliance prefers-reduced-motion total.
**Razão:** Val Head + Anadol + Calvo conclave. Pessoa ansiosa abrindo o app — motion errado AMPLIFICA crise; motion certo CO-REGULA o sistema nervoso (entrainment visual neurociência).

---

## 5 Motion Principles

### MP1 — Breathing (signature)

**Concept:** Toda animação ambiental segue ritmo de **respiração humana relaxada** — 6 ciclos por minuto (10s por ciclo). Sincronização visual induz parasympathetic activation.

**Aplicação:**
- Orbe companion: 8s ciclo (4s expand + 4s contract)
- Background generative: oscillation 0.5Hz (~6ciclos/min)
- Logo D3 (se aprovado): 8s ciclo
- Loading states "ambient": breath rhythm

**Specs:**
```css
--motion-breath-cycle: 8000ms;
--motion-breath-ease: cubic-bezier(0.45, 0, 0.15, 1);

@keyframes breath {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50%      { transform: scale(1.05); opacity: 1; }
}

.breathe {
  animation: breath var(--motion-breath-cycle) var(--motion-breath-ease) infinite;
}
```

**Anti-pattern:**
- ❌ Faster cycles (<6s) — perceived as anxious, defeats purpose
- ❌ Bouncy easing — disrupts calming effect
- ❌ Inconsistent timing — breaks entrainment

### MP2 — Gentle

**Concept:** Todas as transições têm **easing suave** — ease-arrive (chegada), ease-depart (saída). Nada "snappy", nada "bouncy", nada "spring" agressivo.

**Aplicação:**
- Page transitions
- Modal open/close
- Toast appearance
- Element fade-in/out
- Card hover

**Specs:**
```css
--motion-arrive:    400ms cubic-bezier(0, 0.5, 0.3, 1);    /* easeOutQuart-like */
--motion-depart:    300ms cubic-bezier(0.5, 0, 1, 0.5);    /* easeInSine-like */
--motion-settle:    400ms cubic-bezier(0.45, 0, 0.15, 1);  /* in-out smooth */
```

**Pattern:**
- Element appearing: `--motion-arrive` (slow at end — comes gently to rest)
- Element disappearing: `--motion-depart` (quick at end — exits cleanly)
- State changes: `--motion-settle` (balanced in-out)

**Anti-pattern:**
- ❌ Linear easing — feels mechanical
- ❌ Spring bouncing (overshoot) — feels playful, wrong for context
- ❌ Snap (instant + ease-out only) — feels harsh

### MP3 — Never-Anxious

**Concept:** Motion deve **diminuir** ansiedade, nunca induzir. Sem flashing, sem rapid succession, sem auto-play invasivo, sem parallax (vestibular trigger), sem text animado palavra-a-palavra (criar antecipação ansiosa).

**Specs:**
- Sem `transition-duration` < 150ms em transições visíveis
- Sem `animation-iteration-count: infinite` em elementos de attention (use no ambient only)
- Sem `@keyframes` com mudança brusca >50% scale ou opacity
- Frame rate target: 60fps mínimo; degradar features visuais antes de cair pra 30fps
- **Parallax**: PROIBIDO. Causa enjoo vestibular em usuários com sensibilidade.
- **Auto-play vídeos/áudios**: PROIBIDO sem opt-in explícito.

**Banned patterns:**
- ❌ Text "type-writing" effect — gera ansiedade de antecipação
- ❌ Confetti / particles celebration — incompatible com contexto
- ❌ Flash de cor súbita (red flash on error)
- ❌ Shake on validation error — provoca startle response
- ❌ Modal "drop from top" com bounce
- ❌ Skeleton screens com shimmer rápido (>0.5Hz)

**OK alternatives:**
- ✅ Static success state com fade-in 400ms
- ✅ Color transition (error → neutral) over 300ms ease
- ✅ Skeleton com slow gradient sweep (1.5s+)
- ✅ Modal slide-up suave 400ms ease-arrive

### MP4 — Attentive

**Concept:** Motion sinaliza **presença atenta** do Anipis. Quando user faz algo, Anipis reage — mas devagar, considerado, como alguém que pensa antes de responder.

**Aplicação:**
- Typing indicator: 3 dots pulsating em stagger 150ms (pausa entre cada — não simultâneo)
- Orbe response: pulse 1x quando user envia mensagem (acknowledgment)
- Send confirmation: subtle scale 0.97 → 1 no botão send (haptic-like feedback)
- Mood selector: cada opção responde a hover com gentle scale 1.05

**Specs:**
```css
--motion-heartbeat: 200ms cubic-bezier(0.34, 1.56, 0.64, 1);  /* subtle spring para micro-feedback */
--motion-pulse:    1800ms cubic-bezier(0.4, 0, 0.6, 1);       /* typing indicator dot pulse */
```

**Typing indicator pattern:**
```css
@keyframes pulse-dot {
  0%, 60%, 100% { opacity: 0.4; transform: scale(0.8); }
  30%           { opacity: 1;   transform: scale(1); }
}

.typing-dot:nth-child(1) { animation: pulse-dot 1800ms ease infinite; }
.typing-dot:nth-child(2) { animation: pulse-dot 1800ms ease 150ms infinite; }
.typing-dot:nth-child(3) { animation: pulse-dot 1800ms ease 300ms infinite; }
```

**Critical:** Typing indicator pause entre user message and AI response **simula latência humana intencional**. Mesmo que LLM responda em 200ms, app aguarda 1.5-3s antes de mostrar (configurável). Reason: Anipis is "thinking", not instant — alinha com brand "alguém que ouve com cuidado".

### MP5 — Deliberate

**Concept:** Toda animação tem **propósito comunicativo**. Se animação não comunica algo (loading, state change, transition, feedback) — não existe. Zero decoração móvel.

**Test de cada animação:**
1. O que essa animação comunica? (resposta deve ser concreta)
2. O que aconteceria se ela fosse removida? (se "nada de essencial" → remove)
3. Ela respeita os 4 outros principles? (breath / gentle / never-anxious / attentive)
4. Tem fallback para reduced-motion? (sempre sim)

**Aplicação restritiva:**
- Mood selector animation: comunica "transição entre estados emocionais" → OK
- Page transition fade: comunica "mudança de contexto" → OK
- Card hover scale 1.02: comunica "interactable" → OK
- Logo entrance no splash: comunica "boas-vindas" → OK
- Random sparkles on success: comunica nada (decoração) → BANIDO
- Background gradient shifting randomly: comunica nada (decoração) → BANIDO (a menos que seja mood-aware → comunica "atmosfera reativa" → OK)

---

## Motion Tokens

Consolidação Rams: 6 tokens (vs 4 v1, mas com mais clareza semântica).

```css
:root {
  /* Durations + easings consolidados */
  --motion-breath:    8000ms cubic-bezier(0.45, 0, 0.15, 1);  /* signature ambient */
  --motion-arrive:     400ms cubic-bezier(0, 0.5, 0.3, 1);    /* element entering */
  --motion-depart:     300ms cubic-bezier(0.5, 0, 1, 0.5);    /* element leaving */
  --motion-settle:     400ms cubic-bezier(0.45, 0, 0.15, 1);  /* state change in-out */
  --motion-heartbeat:  200ms cubic-bezier(0.34, 1.56, 0.64, 1); /* micro-feedback subtle spring */
  --motion-pulse:     1800ms cubic-bezier(0.4, 0, 0.6, 1);    /* typing indicator */

  /* Stagger delays */
  --stagger-fast: 80ms;
  --stagger-slow: 150ms;
}
```

---

## Patterns por contexto

### Chat — Message arriving

```tsx
// User message
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0, 0.5, 0.3, 1] }}
>
  {userMessage}
</motion.div>

// AI message — slightly slower entry + delay (Anipis "thought")
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, delay: 0.2, ease: [0.45, 0, 0.15, 1] }}
>
  {aiMessage}
</motion.div>
```

**Communicate:** user message arrives quick (your voice is direct), AI message arrives gently after pause (Anipis considered before speaking).

### Mood check-in — Selector

```tsx
{moods.map((mood, i) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25, delay: i * 0.08, ease: 'easeOut' }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
  >
    {mood.icon}
  </motion.button>
))}
```

### Page transition

```tsx
// In Next.js layout or AnimatePresence
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.4, ease: [0.45, 0, 0.15, 1] }}
>
  {pageContent}
</motion.div>
```

Page transitions: 100ms pause between exit and entrance (interface "breathes" between pages).

### Crisis banner appearance

```tsx
<motion.div
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, ease: [0, 0.5, 0.3, 1] }}
>
  <CrisisBanner level="red" />
</motion.div>
```

**Critical:** crisis banner appears with slight delay e prominence (slides from top, not from below — visual priority). NUNCA com bounce.

### Breathing exercise — orb expand

```tsx
<motion.div
  className="breathing-orb"
  animate={{ scale: [1, 1.15, 1] }}
  transition={{
    duration: 8,
    ease: [0.45, 0, 0.15, 1],
    repeat: Infinity,
    times: [0, 0.5, 1]
  }}
/>
```

**Texts sync:** "Inspire..." appears at scale 1.0 → 1.15 transition (0-4s). "Expire..." appears at 1.15 → 1.0 (4-8s). Texts use opacity fade 800ms.

### Loading state — Ambient breath

```tsx
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
>
  Conversando com o Anipis...
</motion.div>
```

---

## Prefers-Reduced-Motion — TOTAL COMPLIANCE

**Princípio absoluto:** quando OS sinaliza reduced-motion, app responde inteiramente — não parcialmente.

```css
@media (prefers-reduced-motion: reduce) {
  /* Override global — todas as animações ficam instantâneas */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Ambient features que não fazem sentido sem animação — esconde */
  .breathing-orb,
  .ambient-background,
  .companion-orb-animated {
    display: none;
  }

  /* Static fallbacks */
  .breathing-orb-fallback,
  .companion-orb-static {
    display: block;
  }

  /* Typing indicator vira texto */
  .typing-indicator {
    display: none;
  }
  .typing-indicator-text {
    display: inline;
  }
}
```

### Reduced-motion fallbacks specs

| Feature animada | Reduced-motion fallback |
|-----------------|------------------------|
| Orbe companion ambient | Estado estático "neutro" (keyframe intermediário) |
| Background generative | Cor sólida do theme |
| Typing indicator (3 dots) | Texto "Anipis está pensando..." |
| Page transition | Instant (sem fade) |
| Modal open | Instant appear (sem slide) |
| Breathing exercise orb | Instrução textual passo-a-passo SEM círculo animado |
| Logo D3 (se aprovado) | Estado keyframe estático |
| Mood selector hover | Apenas color change (sem scale) |

### Detecção em JS

```tsx
// Hook para detect reduced motion
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// Uso
const reducedMotion = useReducedMotion();
return reducedMotion ? <TypingIndicatorText /> : <TypingIndicatorAnimated />;
```

### Settings — User override

User pode forçar reduced-motion mesmo sem OS preference (`/settings/appearance` → "Reduzir animações"). Persistido em localStorage + sincroniza com Supabase.

---

## Performance budget

Ambient features (orbe, background) precisam **caber em <2ms/frame mobile**.

| Animation | Budget | Implementação |
|-----------|--------|---------------|
| Orbe breathing | ≤1ms/frame | CSS-only transform/opacity (GPU compositor) |
| Background generative | ≤2ms/frame | Canvas 2D meia resolução + CSS upscale |
| Typing indicator | ≤0.5ms/frame | CSS animation, GPU-accelerated |
| Page transitions | ≤16ms first frame | Framer Motion + composition layers |
| Mood gradient transition | ≤1.5ms/frame | CSS `transition: background 1200ms ease` |

**Profiling:** Chrome DevTools Performance tab. PR review com performance check em devices low-end (Moto E13 referência).

---

## Anti-patterns checklist (PR review)

Bloquear PR se animação inclui:

- [ ] `animation-duration` < 150ms em transição visível (não micro-feedback)
- [ ] `bounce`, `spring` overshoot >1.1 scale (exceto micro-feedback heartbeat)
- [ ] `iteration-count: infinite` em elemento não-ambient
- [ ] Parallax scroll
- [ ] Text type-writer effect
- [ ] Confetti / particles
- [ ] Sem fallback prefers-reduced-motion
- [ ] Auto-play vídeo/áudio sem opt-in
- [ ] Shake / vibrate em validation error
- [ ] Skeleton shimmer >0.5Hz
- [ ] Drop-from-top com bounce em modal

---

## Próximos passos

1. Criar `apps/serenity-ai/src/styles/anipis-motion-tokens.css` com 6 tokens
2. Criar `apps/serenity-ai/src/hooks/useReducedMotion.ts`
3. Criar `apps/serenity-ai/src/components/animations/CompanionOrb.tsx` (com fallback estático)
4. Criar `apps/serenity-ai/src/components/animations/BreathingExercise.tsx` (com fallback textual)
5. Substituir TypingIndicator atual por versão com 3-dot pulse + fallback
6. Storybook section "Motion" com playground de cada principle
7. PR checklist lint rule (custom eslint plugin)

---

*Uma — UX Design Expert · 2026-05-16*
*"Animação que não diminui ansiedade aumenta. Não há neutro."*
