# BRETDA v2 — Visual Direction Critique

**Clone:** Tobias van Schneider (ex-Lead Designer Spotify, founder Semplice/Authentic Weather/SVBSCRIPTION; award-winning editorial/cinematic digital design)
**Consultation ID:** bdebe62d-4ebd-4020-86aa-e1f07fdf63be (self-consultation.js, frozen-knowledge mode — no fabricated sources)
**Date:** 2026-06-24
**Subject:** `_v3-home.png`, `_v3-collection.png` (current renders the founder rejected)

> Founder verdict on these: *"still ugly, doesn't look like luxury furniture, too much text, nothing visually spectacular, no motion, no parallax."* He's right. Let me tell you why, and exactly what I'd build instead.

---

## Spectacle Score: **4 / 10**

Not broken. Tasteful, even. The palette is owned, the Bodoni italic accents are the right instinct, the dark is genuinely dark. But "tasteful" is the ceiling here, and tasteful is not the assignment. **Memorable beats safe** — and this is safe. It looks like a well-executed Webflow template for a design studio, not the digital atelier of a $40k heirloom you wait a year to receive. A 4 is "I'd respect this in a portfolio review and forget it by the elevator."

---

## The 3 reasons it fails "luxury furniture"

### 1. It is a brochure, not a gallery. The product is hiding.
This is the cardinal sin. **The table is the jewel — and you've buried it under copy.** The hero is dominated by a giant two-line headline; the actual table sits behind it, dim, cropped, contextual-but-incidental. Then the entire second screen is a *paragraph essay* ("A table you play on for a night. An object you keep for a life.") floating in black. Luxury furniture sells through the **eye and the hand**, not the sentence. Hermès doesn't write you an essay about the bag. **"Users judge quality by what they see first"** — and the first thing they see is *text*, not *craft*. The collection page is worse: a flat grid of ~30 thumbnails, all the same size, same weight — that's a *catalog SKU dump*, the visual language of a marketplace, the exact opposite of scarcity. When everything is equal, nothing is precious.

### 2. There is no light, no material, no obsession with the surface.
Premium lives in the micro-details nobody consciously notices. A luxury table is **wood grain, slate, leather rail, brass, the way a single raking light rolls across a lacquered edge.** None of that is on screen. The images are flat, evenly-lit, mid-distance "product on floor in a room" shots. I never see the *material*. I never feel the *weight*. The dark background is a flat charcoal field, not velvet — there's no depth, no vignette, no glow coming *off* the object. It reads matte and digital when it should read like a jewel photographed in a vault. **Dark mode is not a CSS filter — it's its own lighting design,** and this dark has no light source.

### 3. It's frozen. Luxury online is choreography, and this has none.
Static screenshots are the right test and it fails it: nothing here *implies* motion. No parallax depth between table and ground, no scroll-driven reveal, no moment where the camera seems to move around the table. A $40k object earns **time** — the user should *fall* into it. Right now every section is a stacked rectangle of equal importance with a heading and body copy. That cadence is a blog. Cinema has pacing: hold, move, reveal, hold. This has only "scroll, read, scroll, read."

---

## Through my lens: where it's timid / template

- **Type is doing the work the product should do.** Big headline + Bodoni italic on *every* section becomes wallpaper. When the same flourish is everywhere, it stops being special. I'd cut the headline word count by ~70% and let type *frame* the object for one held beat, then get out of the way.
- **The grid is democratic — luxury is hierarchical.** That even thumbnail grid is the single most "template" move in the whole thing. Atelier pieces and Signature pieces look identical in weight. There is no *protagonist*.
- **No single owned move.** I can't describe this site in one sentence to a friend. There's no signature gesture. A brand identity needs **a point of view not everyone agrees with** — this agrees with everyone.
- **Flat color field.** One charcoal. No gradient mesh, no light bloom, no warmth pooling under the brass. The champagne accent is used as *link color*, not as *light*.

---

## The Prescription — buildable spectacle (GSAP + Lenis)

### Art direction (do this first, it's 60% of the win)
**Reshoot/regrade for "jewel on velvet."** Single hard key light raking across the table at a low angle, everything else falling into near-black. Tight, almost-fetish macro frames: the corner where rail meets leg, brass inlay catching light, grain running off-frame. The background isn't a room — it's **void with a subtle radial bloom** so the object appears lit from within the page. One owned color in the light: champagne. **Constrain hard** — black, near-black, one warm light, Bodoni. That's the whole system.

### THE bold hero concept — "Carved from the Dark"
Full-viewport black. The table **does not appear all at once.** As the page loads, a slow champagne rake-light sweeps left-to-right across the frame and *reveals the table out of the darkness* — like a curator turning on a single gallery spot. The headline is **one word, oversized, set in Bodoni, clipped behind the table's silhouette** so the product physically occludes the type (text-as-environment, not text-as-billboard). No paragraph. No "play on for a night" essay in the hero. Just: the dark, the light, the object, one word. (`reveal: clip-path` wipe synced to a CSS/WebGL light-sweep; or a pre-rendered light-sweep video frame-scrubbed on scroll.)

### Scroll choreography (top → bottom)
1. **Hero pin + light reveal.** `ScrollTrigger.pin` the hero. Scroll *scrubs* the rake-light fully across; table resolves from shadow to fully lit. The one headline word drifts up and out as you descend. (Lenis for the buttery momentum that makes it feel expensive — default scroll kills luxury.)
2. **Orbit-the-object (the unforgettable move — see below).**
3. **Material macros — horizontal pin.** Pin a section; vertical scroll translates a horizontal filmstrip of *macro* details (grain → slate → leather rail → brass). Each macro pinned for one held beat. This is where the hand falls in love. Parallax: the macro image moves slower than its one-line caption.
4. **Collection as a stage, not a grid.** Kill the thumbnail wall. One piece on screen at a time, full-bleed, name in big Bodoni; scroll *crossfades + scales* (1.05→1.0) from one table into the next, each rising from black. Foreground table and its champagne glow parallax at different depths. Scarcity through *singularity* — you meet each piece, you don't browse a shelf.
5. **The commission close.** The numbers ("Lifetime / US & EU") only here, small, after desire is built — never before.

### THE one move that makes it unforgettable — the Orbit
A scroll-scrubbed **turntable sequence**: ~60–120 frames of the hero table shot rotating ~30–40°, sequenced as `<canvas>` image frames driven by `ScrollTrigger` scrub. As the user scrolls, **the table rotates in place** and the rake-light travels with it — the camera seems to walk around the object. This is the closest thing the web has to *holding* the piece. Pin the section, scrub the frame index off scroll progress, preload frames. It's the single gesture I could describe in one sentence to a friend ("the one where the table turns as you scroll") — that's the test of a signature move, and it passes.

### Type scale
Treat type as **cinema title cards, not body copy.** Hero word: clamp ~`14–22vw` Bodoni. Section titles: `8–12vw`. Body: cut to one or two short lines, ~`1.0–1.125rem`, generous letter-spacing on labels (`0.2em` uppercase eyebrows in champagne). Ratio between display and body should feel *violent* — that gap is what reads as luxury. White space is the frame around the jewel; the current layout is too dense, too even. Let it breathe like a museum wall.

### Micro-details (the part nobody notices but everyone feels)
Layered soft shadows under floating elements (never one harsh drop-shadow). A faint film-grain/noise overlay over the black so it reads like *velvet* not *#1a1a1a*. Champagne accents at ~6–8% opacity as ambient glow, full strength only on the light source. Cursor-reactive light bloom on the hero (subtle parallax of the glow toward the pointer). Easing: long, slow `power3.out` — luxury never snaps, it *settles*.

---

## Handoff (what @erik-spiekermann handles)
I've defined the *visual identity and motion direction* — the dark, the light, the orbit, the hierarchy. Hand the **Bodoni pairing, optical sizing at display scale, and the body typeface for the rare paragraphs** to Erik. My rule for him: the display face carries all the drama; the text face should be near-invisible, quiet, and never compete with the object.

---

**One-line summary for the founder:** Stop writing essays and start lighting the jewel — reshoot for jewel-on-velvet, make the table *resolve out of darkness* under a moving light, let the user *scroll the table around* (the Orbit), turn the catalog grid into a one-piece-at-a-time cinematic stage, and cut the copy by 70%. That's the difference between a tasteful template and a site nobody forgets.

— Tobias van Schneider
