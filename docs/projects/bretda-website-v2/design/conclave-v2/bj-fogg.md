# BRETDA v2 — Behavior Design Review

**Consultant:** BJ Fogg (Behavior Design / Tiny Habits / Fogg Behavior Model)
**Lens:** B = MAP — Behavior happens when Motivation, Ability, and a Prompt converge in the same moment. If the behavior isn't happening, you don't push harder on persuasion. You find which of the three is missing and you fix *that one*.
**Target behavior:** "Request a Commission / inquiry" (high-consideration, multi-week, export USA + Europe).
**Screens reviewed:** `_v3-home.png`, `_v3-collection.png`.

---

## First, let me name the behavior precisely

People keep saying "conversion." That's a goal, not a behavior. The behavior here is a single, concrete, observable action: **a qualified buyer taps "Request a Commission" (or opens WhatsApp) and sends one message.** Everything on the page either makes that action happen in the next 30 seconds, or it doesn't. I judge every design decision against that, and nothing else.

And here's the thing people get backwards on luxury sites: they assume the job is to crank Motivation to the moon. It isn't. For a $30k heirloom table, Motivation is *already high* by the time someone is on this page — they came here wanting it. **The behavior fails on Ability and Prompt far more often than on Motivation.** Awe doesn't close the gap; an easy, well-timed prompt does. Keep that asymmetry in your head the whole time.

---

## B = MAP Score: **6.5 / 10** for the conversion architecture

A solid, intentional design — but the cinematic/less-text direction is being applied as a *style* when it needs to be applied as *behavior engineering*. As drawn, it spends its budget raising Motivation (which was already high) while quietly taxing Ability (no price, no specs, thin captions) and risking the Prompt's timing. The architecture is one or two corrections away from an 8.5.

Let me break the score down across the three factors.

### Motivation — strong, and that's exactly the trap (8/10)
The desire engine works. "The game table, made an heirloom," the editorial restraint, the dark cinematic frame, "Built for the one room you'll gather in" — this manufactures awe and aspiration, which is correct for the category. Cutting text *helps* here: every word you remove that isn't doing a job lets the object speak, and the object is the motivator. **No complaint on Motivation. My warning is the opposite — stop optimizing the factor that's already winning.** More parallax, more scroll-jacking, more slow reveals add Motivation you don't need while spending the user's patience, which is an Ability cost. You're paying in the wrong currency.

### Ability — this is where the redesign is leaking (5/10)
Ability = how easy is the *next action*, and how much friction sits between the user and the desire peak. Fogg's Ability has six components; the two that matter most here are **Time** (how long until I can act) and **Brain cycles / non-routine** (how much I have to think or hunt). The cinematic direction taxes both:

- **No price, anywhere, on either screen.** For a luxury inquiry this is a deliberate and partly defensible choice — but understand the *behavioral* cost: a missing price doesn't kill desire, it converts a one-tap inquiry into a multi-step research project ("is this $8k or $80k? am I even the buyer?"). That's a Brain-cycles tax. Qualified buyers self-select *out* when they can't place themselves, and unqualified ones inquire to find out — which poisons your lead quality. At minimum you need an **anchor** (a "from / commissions begin at" band, or a price *range* by tier), not necessarily a number per SKU.
- **Specs are nearly absent.** A $30k heirloom buyer needs dimensions, materials, lead time, "ships to USA/Europe." Right now the collection captions are a few words. That's beautiful and it's an Ability hole — the buyer has to *leave* the moment of desire to go find facts, and many won't come back.
- **Long editorial scroll before the spec/proof a serious buyer needs.** Each gorgeous section the buyer must traverse to find an answer is Time-cost. Motion that *delays the answer* is friction wearing a tuxedo.

### Prompt — present, but timing is the risk (6/10)
Prompt = the trigger that says "do it now," and **a prompt only works at the moment Ability and Motivation are both high.** Right now:

- The home hero CTA "Request a Commission" sits up top — good, you prompt early. But the second prompt is all the way at the bottom ("Begin your commission"). Between them is a long cinematic stretch with **no persistent way to act.** The desire peak for many buyers hits *mid-scroll* — on a specific table, in the gallery — and at that exact moment **there is no prompt in reach.** A peak with no prompt is a lost behavior. That's the single biggest hole.
- If the cinematic direction adds scroll-jacking or slow reveals *before* the first CTA is reachable, you've delayed the prompt past the opening Motivation spike. Never make awe a toll gate in front of the trigger.
- The CTA is one undifferentiated verb everywhere. A single high-commitment prompt ("Request a Commission") with no lower-rung option means anyone not ready for the big ask has *nothing to do* — and does nothing.

---

## Top 3 risks the cinematic / less-text direction introduces

1. **Scroll-jacking delays the Prompt past the desire peak.** The most likely self-inflicted wound: long parallax / locked-scroll storytelling before any reachable CTA, and no persistent prompt during the gallery where per-table desire actually spikes. Cinematic pacing moves the trigger *away* from the moment Ability + Motivation are highest. Behavior dies in that gap.

2. **Cutting text removes Ability, not just clutter.** There's good text to cut (redundant adjectives, marketing throat-clearing) and load-bearing text to *keep* (price anchor, dimensions, materials, lead time, "ships to US/EU"). The risk is the redesign treats all copy as clutter and strips the facts a serious buyer needs to feel safe spending $30k — turning a confident inquiry into "I'll research more later," which never happens.

3. **Motion taxes the buyer's patience budget — a hidden Ability cost — while padding a Motivation that was already full.** Heavy animation raises perceived effort and load/jank, especially on the export buyer's phone on hotel wifi. You spend the user's limited attention buying *more awe* (diminishing returns) at the cost of *speed-to-action* (where the behavior actually lives). Spectacle that slows the page is negative-sum.

---

## 3 concrete ways to keep the inquiry easy + prompted *inside* the spectacle

1. **Make the Prompt persistent and follow the desire peak.** Add a quiet, always-reachable prompt that lives *through* the cinematic scroll — a subtle sticky "Request a Commission" (corner pill or slim bottom bar) plus a **per-table CTA on every gallery item** ("Commission this →" / WhatsApp). The rule: the buyer should never be more than one thumb-reach from acting at the *exact* model where desire spiked. You keep the immersive feel; you remove the dead zones. This is the highest-leverage fix — do it first.

2. **Restore the load-bearing facts as a "spec moment," not a wall of text.** Keep the cinema; add a tight, scannable fact band per table — **dimensions · materials · lead time · ships to US/EU · "commissions from $X"** (range or anchor, even if exact price stays bespoke). This is *removing* an Ability barrier, not adding clutter: one calm strip of facts answers "is this for me?" so the inquiry stops being a research project. A price *anchor* alone will sharpen lead quality more than any extra adjective ever could.

3. **Front-load the first Prompt and add a lower rung (Tiny-Habits "make it small").** Guarantee a reachable CTA is visible at the top of the hero *before* any scroll-jack or long reveal — never gate the trigger behind the animation. Then add a **smaller behavioral first step** beside the big ask — "Save / Download the lookbook," "Talk on WhatsApp," "Book a 15-min call." For a multi-week, high-ticket decision, the full commission request is a *big* behavior; offering a tiny one (B=MAP says shrink the behavior until Ability clears the line) captures the buyer who isn't ready for the big ask, starts the relationship, and gives you the lead. Cinematic experience, easy first step, prompt always in reach — that's the whole recipe.

---

**One-line verdict:** The cinematic, less-text direction is *right for Motivation and wrong if it's the whole plan* — Motivation was already high; the behavior lives in Ability and Prompt. Keep the spectacle, but never let motion delay the trigger, never strip the facts that make a $30k inquiry feel safe, and put a prompt within thumb-reach at every point desire peaks. Do that and you don't trade beauty for conversion — you get both.
