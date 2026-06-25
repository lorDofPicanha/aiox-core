# BRETDA — Motion System Prescription

**Consultant:** Val Head (Mind Clone) — Motion Design & UI Animation Architect, author of *Designing Interface Animation*
**Project:** BRETDA — ultra-premium Brazilian luxury game tables (export, English, dark cinematic "jewel on velvet", Bodoni + champagne)
**Target stack:** Lenis (smooth scroll) + GSAP ScrollTrigger
**Date:** 2026-06-24

---

## Motion-readiness of the current build: **3 / 10**

Let me be straight, because that is how I review. The *composition* here is already luxury — the dark velvet ground, the Bodoni display, the champagne accent, the generous negative space. That earns it the points it has. But as a **motion** artifact it scores a 3, and the founder is right to reject it.

Right now every element arrives fully-formed and sits perfectly still. There is no choreography, no reveal sequence, no depth, no weight. A luxury object should feel like it *settles into place* — like a heavy, well-balanced thing coming to rest. This site behaves like a PDF. Nothing answers the question I ask of every frame: *why is this moving, or why is it not?*

The good news: the layout is **built for motion**. Full-bleed hero, stacked editorial bands, a product grid that begs to stagger, an interior "gather in" shot that is screaming to be a parallax. The bones are right. We just need to give it a pulse — and a *slow, confident* one. Luxury does not bounce. Luxury **eases**.

---

## The governing principle for this brand

Motion communicates personality. A playful app and a financial app must move differently — and a **€30k heirloom game table** must move differently from both. The personality token here is: **weighted, slow, inevitable, quiet.** Think of how a heavy felt-lined drawer closes, or how a spotlight fades up on a museum piece. Nothing snaps. Nothing springs. Everything *arrives with intent and decelerates into rest.*

That rules out two things immediately:
- **No bounce, no overshoot, no spring** for the brand layer. Springiness reads as "app," "toy," "consumer." Wrong register entirely.
- **No fast motion.** Sub-200ms reveals feel cheap and twitchy at this tier. We live in the **600–1400ms** band for hero/section reveals, and reserve the snappy 120–250ms only for *micro*-feedback (hover, cursor).

---

## Easing & duration tokens (the two most important decisions)

Timing and easing are the most important decisions in motion design, so here is the named system. Build these once as a motion system and reuse them — similar actions must look similar.

### Easing tokens
| Token | Curve | Use |
|---|---|---|
| `ease-luxe` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) | **Primary.** All reveals, parallax settles, content entering. The long, confident deceleration is the whole brand feel. |
| `ease-curtain` | `cubic-bezier(0.77, 0, 0.175, 1)` (quart in-out) | Full-screen / hero veils, image mask wipes. Smooth in *and* out. |
| `ease-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` | Product cards / images coming to rest — a touch softer than `ease-luxe`. |
| `ease-micro` | `cubic-bezier(0.4, 0, 0.2, 1)` (standard) | Hover, cursor, button states only. |

> GSAP equivalents: `ease-luxe` ≈ `"expo.out"`, `ease-curtain` ≈ `"power4.inOut"`, `ease-settle` ≈ `"power3.out"`, `ease-micro` ≈ `"power2.out"`. **Never use `back`, `elastic`, or `bounce` anywhere on the brand layer.**

### Duration tokens
| Token | Value | Use |
|---|---|---|
| `dur-hero` | 1200–1400ms | Hero title + image reveal on load |
| `dur-reveal` | 800–1000ms | Section / editorial band reveals |
| `dur-settle` | 600–800ms | Product card / image entrances |
| `dur-micro` | 180–250ms | Hover, cursor follow, button |
| `stagger-luxe` | 90–140ms | Delay between staggered siblings (lines, cards) |

The wide gap between `dur-micro` and `dur-reveal` *is* the luxury signature: micro-interactions are instant and crisp; the big moments are slow and cinematic. That contrast is the personality.

---

## Top scroll-motion moves (section → effect → timing)

These are the choreographed set pieces. Each one answers *why*: create continuity, establish depth, or direct the eye to the object.

### 1. Hero — "the curtain lifts" (on load, not on scroll)
- **Effect:** Background hero image starts at `scale(1.08)` and eases to `scale(1.0)` (slow Ken-Burns settle) while a dark veil fades from 100%→0% opacity. The Bodoni headline reveals by **line**, each line masked (clip-path / `overflow:hidden` + `y: 100%→0`), staggered. The champagne *italic* word ("heirloom") gets a +120ms extra beat so it lands last — the eye finishes on the brand promise.
- **Timing:** image `dur-hero` / `ease-curtain`; lines `dur-reveal` / `ease-luxe`, `stagger-luxe` 120ms; CTA fades in last at +400ms.
- **Why:** Establishes the cinematic register in the first second. This is the single most important moment — it sets the entire tone.

### 2. Hero image — parallax depth on scroll
- **Effect:** As the user scrolls past the hero, the background image moves slower than the foreground text (translateY at ~0.6× scroll speed) and the veil deepens slightly. Pure `scrub`.
- **Timing:** `scrub: 1` (1s catch-up smoothing — tied to Lenis so it never feels mechanical). No duration; it is scroll-linked.
- **Why:** Depth. The jewel sits *behind* glass. This is the "alive" the founder is asking for.

### 3. Editorial bands — line-by-line reveal as they enter
- **Effect:** The "A table you play on for a night / An object you keep for a life" type, and the process band, reveal by line with the same masked upward slide. Triggered at ~75% viewport (`start: "top 75%"`), play once (no replay on scroll-up — that reads as a glitch at this tier).
- **Timing:** `dur-reveal` / `ease-luxe`, `stagger-luxe` 110ms. `toggleActions: "play none none none"`.
- **Why:** Directs reading rhythm; gives the prose the cadence of a printed monograph.

### 4. Product grid (Atelier / Signature) — staggered settle
- **Effect:** Cards enter with `opacity 0→1` + `y: 40px→0` + a *whisper* of `scale(0.98)→1`. Stagger across the grid in reading order (`stagger: { each: 0.09, from: "start" }`). Image inside each card holds a faint parallax on continued scroll.
- **Timing:** `dur-settle` / `ease-settle`, `stagger-luxe` 90ms, trigger `top 80%`.
- **Why:** Choreography — chaos is not motion design. A staggered grid reads as *curated*, like pieces being placed on display one at a time. **Do NOT animate all 30 collection cards on load** — only the band in view; the rest reveal on their own scroll. (Animating a full utilitarian list on load is exactly the mistake I warn against.)

### 5. "Built for the one room you'll gather in" — pinned cinematic parallax
- **Effect:** Pin the interior section for ~1 viewport-height. While pinned, scrub: the room image scales up slightly (`1.0→1.06`), the headline drifts up on a parallax layer, and the table itself can be on a separate layer moving at a third rate. Multi-plane depth.
- **Timing:** `pin: true`, `scrub: 1`, `end: "+=100%"`. `ease` handled by scrub smoothing.
- **Why:** This is the emotional peak — "the one room you'll gather in." A pinned scrub turns a flat photo into an immersive space and lets the visitor *dwell*. One pin only; do not over-pin the page.

> **Counts/numbers** ("14 / Lifetime / US & EU"): count-up on enter, `dur-reveal`, `ease-micro` on the number tween. Small touch, high payoff.

---

## Hero & product-reveal summary
- **Hero motion:** curtain-lift on load (scale-settle image + veil fade + masked line reveal), then parallax-on-scroll. One coherent gesture.
- **Product reveal:** masked image wipe (`ease-curtain`) is the signature for any single featured table — the table is *unveiled*, never just faded. Reserve the full image-wipe for hero/feature shots; the grid uses the lighter `settle`.

## Hover & micro-interactions (the quiet layer)
- **Product card hover:** image `scale(1.0→1.04)` + champagne hairline underline draws in on the title (`scaleX 0→1`, transform-origin left). `dur-micro` 220ms / `ease-micro`. Subtle, immediate.
- **Buttons / CTA:** champagne fill or border brightens, label letter-spacing opens by ~0.5px. `dur-micro` 200ms.
- **Optional brand flourish — custom cursor:** a small champagne dot that lerps toward the real cursor (lag ≈ 0.12) and grows over interactive elements. This single touch reads as "atelier" and costs almost nothing. Desktop-only, pointer:fine only.
- **Magnetic CTA (optional):** primary button pulls ~6px toward the cursor within proximity. Tasteful at this tier; do not apply to more than the hero CTA.

> Every hover answers *why*: feedback + "this is interactive." Nothing decorative-only.

---

## Accessibility & performance guardrails (non-negotiable)

Accessibility is not a feature I add at the end — it is a gate the whole system must pass.

1. **`prefers-reduced-motion: reduce` — full alternative, not just "turn it off."**
   - Kill ALL parallax, pins, scrubs, scale, and translate.
   - Replace every reveal with a simple **opacity 0→1 at ≤200ms** (or instant). Content still appears with a gentle fade; nothing moves spatially.
   - Disable Lenis smooth scroll → native scroll. Disable the custom cursor and magnetic CTA entirely.
   - Wire it through GSAP `matchMedia()` so reduced-motion is a first-class branch, and **`ScrollTrigger.normalizeScroll()` / cleanup** runs cleanly. Honor a JS check too (`window.matchMedia('(prefers-reduced-motion: reduce)')`), not CSS alone.

2. **No motion sickness.**
   - Cap parallax displacement at **~12–15% of element height** — gentle planes, never a layer rocketing across the screen.
   - **Reveal-once.** `toggleActions: "play none none none"`. Replaying animations on scroll-up induces nausea and reads as broken.
   - No continuous looping/auto-playing motion in peripheral vision. No infinite marquees.
   - Pin only **once** (the gather section). Multiple competing pins disorient.

3. **Performance / jank budget — 60fps floor.**
   - **GPU-only properties:** animate `transform` and `opacity` exclusively. **Never** animate `top/left/width/height/margin` or anything that triggers layout. This is the rule that makes or breaks the feel — layout thrash is what makes luxury sites feel cheap.
   - `will-change: transform` on actively-animating layers only; **remove it after** the animation (leaving it on bloats GPU memory and causes jank elsewhere).
   - Tie ScrollTrigger to Lenis via `lenis.on('scroll', ScrollTrigger.update)` and drive both from a single `requestAnimationFrame` / `gsap.ticker` loop — two scroll engines fighting is the #1 source of jank in a Lenis+GSAP build.
   - **Mobile:** drop pins and heavy parallax to lightweight fades; touch + scrub-pin is a jank trap. Use `ScrollTrigger.matchMedia` breakpoints.
   - Lazy-load below-fold imagery so reveals never animate an un-decoded image (flash of empty box). Hold the trigger until the asset is ready.
   - Budget: if any set piece can't hold 60fps on a mid-tier laptop, simplify it. **The best animation is the one you barely notice** — a janky parallax is worse than none.

---

## My one next-step recommendation

Build the **motion system tokens first** (the easing + duration table above) as a shared GSAP config, then prototype **Move #1 (hero curtain-lift) and Move #5 (pinned gather parallax)** as a vertical slice. Those two prove the entire register — slow, weighted, cinematic — in about 1.5 viewports. Get the founder to feel *those* before touching the rest. If the hero lifts like a curtain and the gather-room breathes with depth, the personality is locked and everything else inherits it.

*— Val Head*
