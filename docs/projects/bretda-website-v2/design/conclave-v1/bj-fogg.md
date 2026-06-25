# BJ Fogg — Behavior Design Review (B=MAP)

> Clone DNA loaded from `D:/jarvis/mega brain/agents/minds/design-terapeutico/bj-fogg.md`.
> Lens: **Behavior = Motivation × Ability × Prompt**. A behavior fires only when all three converge at the same moment. If any one is near zero, the product is zero — no amount of the other two compensates. I do not grade render quality; I grade whether the *Request a Quote / WhatsApp inquiry* behavior is made to happen.
>
> The single most important thing I will keep repeating: **Motivation is expensive and unreliable; Ability and Prompt are where you win.** A luxury buyer arrives with motivation already high. Your job is not to pump more desire — it is to *catch* that desire with a prompt at the hot-trigger moment and make the inquiry trivially easy. Most of these screens leak the trigger.

---

## Target Behavior (be precise — vague targets can't be designed)

**Golden Behavior:** "Qualified buyer submits an inquiry (Request a Quote or WhatsApp), specifying the table they want."

A behavior must be a *specific action by a specific person at a specific time*. "Engage with the brand" is not designable. "Tap Request a Quote on the Paraíba table" is. I score every screen against that one action.

---

## Per-Screen B=MAP Scores

### 01 — Home / Hero — **B=MAP 6/10**

- **Motivation: 8.** "Brazil's gemstones, made to play." is a strong desire line — identity, rarity, craft. The dark cinematic hero raises aspiration. Motivation is doing its job here; nothing to fix.
- **Ability: 6.** The inquiry action is *not on this screen* in a usable way. `INQUIRE` lives top-right in the nav — small, cold, and detached from the desire the hero just created. The body CTA is "Explore the Collection," which is a *navigation* action, not the target behavior. That's fine as a first step, but the buyer who is *already* ready has no easy path; they must hunt.
- **Prompt: 5 — WEAKEST LINK.** The hot trigger fires the instant the buyer reads the tagline and feels the want. At that exact moment the only conversion prompt is a 6-px nav word. The desire peaks and *no prompt is within reach* to catch it. This is the classic Fogg failure: high motivation, absent prompt.
- **Weakest link: PROMPT.**

### 02 — Collection (single column / grid) — **B=MAP 7/10**

- **Motivation: 7.** Brazilian-gemstone names (Paraíba, Esmeralda, Ametista, Água-marinha…) build a desirable taxonomy — each table feels like a named object, not SKU. Good.
- **Ability: 6.** Each card carries a "View Item" link — a clear, single next step. Low friction *to browse*. But, again, zero inquiry affordance at the grid level: a buyer who already knows they want "Esmeralda" still must drill into the PDP before any prompt to act appears. One unnecessary step between desire and action.
- **Prompt: 7.** Repeated "View Item" prompts are present and consistent — good prompt density for the *browse* behavior. The miss is that none of them is a *commit* prompt (e.g., "Request this table"). I'd let the most motivated buyer skip a hop.
- **Weakest link: ABILITY** (extra step before any commit prompt exists).

### 03 — PDP / Paraíba (product page) — **B=MAP 8/10**

- **Motivation: 9.** This is the motivation engine of the whole site and it's well built. Price shown up front ("From R$24,500" — note: must render in $/€ per geo, see fixes), plus the "Why this object / Why this house / Why now" narrative triad. That triad is doing real Fogg work: it lowers the *perceived risk* of a high-ticket purchase, which is itself an Ability lever, not just motivation.
- **Ability: 7.** "Request a Quote" is present and prominent near the price — correct placement. Secondary WhatsApp/contact affordance appears too. Friction is reasonable. Remaining drag: the long scroll of "Why" sections pushes the buyer *away* from the prompt as they read; the prompt does not follow them down.
- **Prompt: 8.** The primary prompt sits right where desire is highest (next to price + hero image). This is the one screen that gets the hot-trigger placement broadly right. It loses points only because the prompt is *static* — it scrolls out of view during the persuasion sections, exactly when a freshly-convinced buyer wants to act.
- **Weakest link: ABILITY** (prompt doesn't persist; a multi-field quote form, if any, must stay tiny — start with one field).

### 04 — Atelier / Collection (2-band layout) — **B=MAP 6/10**

- **Motivation: 8.** "ATELIER" + "SIGNATURE" framing elevates perceived craft and exclusivity — strong motivational staging.
- **Ability: 5.** This is a beautiful *gallery* with almost no action surface. Items are shown, named, admired — but the path from "I want this" to "I'm asking about it" is unclear at this altitude. The buyer's hand is raised and there's nothing to tap.
- **Prompt: 4 — WEAKEST LINK.** Like the home hero, motivation is engineered high and then *no inquiry prompt is offered in-context*. Each Signature/Atelier piece should carry its own micro-prompt. Right now the trigger is left entirely to the nav.
- **Weakest link: PROMPT.**

---

## Overall — **B=MAP 6.5/10**

The site is **over-invested in Motivation and under-invested in Prompt + Ability.** That is the most common luxury-site mistake and it is backwards from how behavior actually works. Your buyer walks in motivated; cinematic darkness and gemstone naming pump motivation that was *already high* while the conversion prompt repeatedly goes missing at the exact second desire peaks. The PDP (03) is the proof that the team *can* do it right — the rest of the journey should inherit the PDP's discipline: **a commit prompt within thumb's reach wherever desire spikes.**

Diagnostic in one line: **You are spending on the cheap axis (motivation) and starving the two axes that actually convert (prompt timing + action ease).**

---

## Top 3 Concrete Fixes (highest leverage first)

1. **Make the inquiry prompt persistent and hot — everywhere desire peaks.** Add a sticky, always-in-reach "Request a Quote / WhatsApp" affordance (a docked bar or floating action) on Home, Collection, and Atelier — not just the nav. On the PDP, make the "Request a Quote" button *sticky on scroll* so it follows the buyer through the "Why" sections. Rule: **no screen where a buyer can feel desire should lack a one-tap prompt in the lower-reach zone.** This single change lifts every weakest link at once.

2. **Add a commit prompt one level earlier.** On Collection (02) and Atelier (04) cards, add a secondary micro-prompt beside "View Item" — e.g., "Request this table." This lets the *already-decided* buyer skip the PDP hop. Reducing steps is pure Ability, the cheapest reliable lever I have.

3. **Shrink the inquiry to a Tiny first step.** Whatever the quote form is, the first ask must be trivial — *one* field (WhatsApp number or email) with everything else progressive/optional. High-ticket buyers don't fear price; they fear effort and commitment. Start tiny ("Start a private conversation"), then expand. And resolve the currency: prices must render in **$ / €** per geo as specified — a price the buyer can't read in their own currency is cognitive friction that quietly lowers Ability.

---

## The Single Highest-Leverage Missing Hot Trigger

> **On the Home Hero (01), the moment the buyer reads "Brazil's gemstones, made to play" is the highest-motivation instant on the entire site — and there is no inquiry prompt there to catch it; the only conversion path is a 6-px `INQUIRE` link in the nav.** Place a warm, primary prompt directly under that tagline (alongside "Explore the Collection") so the trigger fires while desire is at its peak, not after the buyer has clicked away to hunt for it.
