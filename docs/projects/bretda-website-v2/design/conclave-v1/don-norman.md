# Bretda Website v2 — Usability & Emotional Design Critique
**Expert:** Don Norman (Human-Centered Design, Emotional Design, *The Design of Everyday Things*)
**Project:** Bretda — ultra-premium Brazilian atelier of handcrafted luxury game tables (made-to-order, export USA/EU, English, multi-currency, US$8k–24k, "Request a Quote" conversion — no cart)
**Stitch set:** stitch-v1 (4 screens). Table images are AI placeholders — judged on usability, affordances, clarity, emotion, NOT render quality.
**Date:** 2026-06-24

---

## My lens

I do not evaluate beauty in isolation. I evaluate the *act of communication between the designer and the user*. A luxury object that costs US$8k–24k is not bought on impulse — it is bought after the visitor builds a **conceptual model** ("I understand what this is, who makes it, why it is worth it, and how I get one") and feels **reflective pride** ("owning this says something about me"). So I judge three levels at once — **visceral** (first-impression gut beauty), **behavioral** (can I *do* what I came to do, easily, without error), and **reflective** (story, meaning, status). And I hunt relentlessly for the gap between what a control *affords* and what its *signifier* tells me it affords. On a dark cinematic site that gap is where money dies.

---

## Screen-by-screen

### 01 — Home / Hero — Usability 6.5 / Emotion 8.5

**Visceral:** Strong. The glowing Paraíba-blue gemstone table on near-black is genuinely arresting — it earns the "made to play" promise viscerally before a word is read. Good emotional design: the product *is* the hero.

**Behavioral / affordances — where I get nervous:**
- "EXPLORE THE COLLECTION" is the one button styled as a button (bordered pill). Good — it is the clearest signifier on the page. But it competes with nothing, which is the problem: the *real* money action for this business is **INQUIRE / Request a Quote**, and that lives tiny in the top-right corner with no visual weight. The page's strongest signifier points at browsing, not at the conversion. The primary action is **under-afforded**.
- Top nav (COLLECTION · ATELIER · THE HOUSE · CONFIGURATOR · USD · INQUIRE) is thin, low-contrast, letter-spaced caps over a busy photographic edge. "CONFIGURATOR" — a signature, high-intent feature — is buried as one more equal-weight nav word. A reflective buyer who *wants* to customize a US$20k object has no discoverable on-ramp to it from the hero. That is a **discoverability failure on your highest-value path.**
- "USD" reads as a label, not a control. Does it *afford* a click to switch to EUR? I cannot tell from the signifier. For a multi-currency export site that is a real ambiguity — currency clarity is part of trust at this price.

**Reflective:** "Brazil's gemstones, made to play" is excellent — it ties national craft + gemstone naming + the playful function into one line of meaning. This is the pride hook. Keep it.

### 02 — Collection (grid) — Usability 7 / Emotion 7.5

**Visceral:** Calm, gallery-like, premium. The 4×2 grid of named tables (Paraíba, Esmeralda, Ametista, Água-marinha, Topázio Imperial, Alexandrita, Heliodoro, Morganita) reads like a jeweler's case. Appropriate and dignified.

**Behavioral:**
- Each card has a small "VIEW DETAIL" type link under the name. Good — there *is* a signifier. But it is tiny and low-contrast. **The whole card looks clickable but only the small link is labeled as such** — a classic affordance ambiguity. Make the entire card the target (it already *affords* a click visually; the signifier must match the affordance). On mobile this tiny link is also a **sub-44px tap target** — a behavioral trap.
- Prices are **absent** from the grid. The brief says all prices are exposed — exposing them on the card is a *trust and qualification* asset at this tier ("From US$X"). Hiding price to the PDP adds a click and a flicker of "if you have to ask" — which is the *wrong* signal for a transparent, export, multi-currency brand. Damages behavioral efficiency and reflective trust.
- No filter/sort. With 8+ models that is fine now; past ~12 it becomes a findability problem.

### 03 — PDP / Paraíba — Usability 7.5 / Emotion 9 — **strongest screen**

**Visceral & reflective:** Outstanding. "Why this object / Why this house / Why now" is a beautifully sequenced narrative that builds the conceptual model and the reflective pride exactly as a high-consideration purchase needs. "From R$24,500" is shown — good, price is exposed.

**Behavioral / affordances:**
- "REQUEST A QUOTE" is correctly the dominant, filled, gold-accented primary button. **This is the one place on the whole site where the affordance hierarchy is right.** The eye goes straight to the money action.
- Below it I can see secondary controls (looks like AR / 360° rotate / configurator-ish chips and a thumbnail strip with material swatches). **These are exactly the controls where dark luxury sites lose people.** Two risks: (1) low-contrast icon-only chips are weak signifiers — a viewer may not know "this rotates the table in 3D" or "this opens AR." Icon + a one-word label removes the guesswork. (2) The swatch dots are small; on mobile they risk being below tap-target minimums and lack a selected-state signifier (which one is active?). Add a clear selected ring and labels — prevent the *slip* of "I tapped the wrong stone and didn't notice."
- **Currency note:** here it shows R$ (BRL) while the brand exports in $/€ only. If geo-detection puts a US buyer on R$ it breaks the conceptual model ("am I even allowed to buy this?"). Currency consistency must be airtight across hero → grid → PDP.

### 04 — Atelier / Collection (2-band) — Usability 6 / Emotion 8

**Visceral & reflective:** The ATELIER + SIGNATURE banding with the large editorial hero tables and the smaller signature grid below tells the maker's-story well — good reflective layer (craft, provenance, pride).

**Behavioral — my biggest worry on this screen:**
- **Discoverability of the action collapses here.** The large feature tables (Paraíba, Topázio Imperial, Alexandrita) and the lower signature cards mostly carry only a faint right-aligned "→" or a thin label. **An arrow alone is a weak signifier** — it affords "more" but doesn't promise where it goes (detail? quote? next image?). On a page this long, the visitor scrolls a beautiful gallery and is never given an obvious, repeated, high-contrast way to *act*. Beauty without a clear next step is, in my terms, "a brilliant solution to the wrong problem."
- Contrast: section labels and body copy in mid-grey on charcoal are at or below comfortable legibility for older eyes — and a US$24k buyer skews 45–70. **Dark-on-darker for functional text is the single most common dark-luxury usability sin.** Decorative is fine dark; *anything you must read or click* needs to clear WCAG AA.

---

## Scores

| Screen | Usability | Emotion |
|---|---|---|
| 01 Home/Hero | 6.5 | 8.5 |
| 02 Collection grid | 7.0 | 7.5 |
| 03 PDP Paraíba | 7.5 | 9.0 |
| 04 Atelier 2-band | 6.0 | 8.0 |
| **Overall** | **6.75** | **8.25** |

The emotional design (visceral beauty + reflective story) is genuinely strong and on-brand — this is *good* work at the visceral/reflective levels. The gap is **behavioral**: the affordances and signifiers for the actions that earn money are under-built, inconsistent, and in places drowned by the dark theme.

---

## Top 3 strengths
1. **Reflective layer is excellent.** "Brazil's gemstones, made to play" + the "Why this object / house / now" sequence builds genuine conceptual model and pride of ownership — exactly right for a high-consideration luxury purchase.
2. **Visceral hero works.** The glowing gemstone table on black communicates the value proposition before any copy — the product is the hero, as it should be.
3. **The PDP gets the action hierarchy right.** "REQUEST A QUOTE" as the single dominant, gold, filled control is a textbook clear primary affordance — replicate this discipline everywhere.

## Top 3 concrete usability fixes
1. **Make the conversion action discoverable and dominant on EVERY screen, not just the PDP.** Promote "Request a Quote / INQUIRE" from a tiny corner word to a persistent, high-contrast, gold-filled button (sticky on scroll). Today the strongest signifier on the home page points at *browsing*, not buying.
2. **Match signifiers to affordances on cards and interactive controls.** Make whole collection/atelier cards clickable with an explicit "View →" label (not just a faint arrow); give the AR / 360°-rotate / configurator chips **icon + one-word label**; give material swatches a visible *selected* ring; ensure every tap target ≥44px. This kills both ambiguity and silent mis-tap slips.
3. **Fix contrast and currency consistency for trust.** Raise all functional text and active controls to clear WCAG AA on the dark ground (decorative can stay dark); and make currency unambiguous and consistent across hero→grid→PDP — the "USD" toggle must *look* like a control, and a US/EU visitor must never see R$. Also expose "From $X" on the grid cards — transparency builds trust at this tier.

## Biggest discoverability / affordance risk (one sentence)
Your highest-value, highest-intent actions — **Request a Quote and the Configurator** — are the *least* discoverable elements on the site, signified by tiny low-contrast nav words and faint arrows, so the dark cinematic mood is currently working *against* the very behaviors that make Bretda money.
