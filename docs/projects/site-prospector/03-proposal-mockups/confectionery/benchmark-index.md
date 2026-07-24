# Confectionery Benchmark Index v1

**Captured:** 2026-07-13  
**Scope:** same-niche confectionery, pâtisserie, dessert bakery and closely
equivalent premium bakery sites. Patterns are evidence, not templates.

## Global Map

| Brand | Official source | Current pattern to study | R/A/Re score | Status |
|---|---|---|---:|---|
| Magnolia Bakery | [official site](https://www.magnoliabakery.com/) | Occasion routing; local pickup, shipping, catering, gifting and events | 5/5/5 | Anchor; static extraction collected, synthesis pending |
| Cédric Grolet | [official site](https://cedric-grolet.com/en/) | Product as spectacle, chef authority, location-specific houses | 5/5/5 | Anchor; static extraction collected, synthesis pending |
| Pierre Hermé Paris | [official site](https://www.pierreherme.com/en/) | Luxury gifting, collections, editorial product storytelling | 5/5/5 | Anchor; extraction synthesis failed and is not valid yet |
| Dominique Ansel | [official site](https://www.dominiqueansel.com/) | Signature-product authority, chef narrative, region/order routing | 5/5/5 | Anchor |
| Poilâne | [official site](https://www.poilane.com/) | Heritage, craft, editorial restraint and product provenance | 5/5/5 | Anchor |
| Tartine | [official site](https://tartinebakery.com/) | Place-led craft brand and strong product photography | 4/5/5 | Mapped; JS shell limits static evidence |
| Breads Bakery | [official site](https://www.breadsbakery.com/) | Seasonal hero, menus, stores, catering and direct order paths | 5/5/5 | Mapped |
| Milk Bar | [official site](https://milkbarstore.com/) | Playful product identity, bundles, gifting and national delivery | 5/5/5 | Mapped |
| Levain Bakery | [official site](https://levainbakery.com/) | Hero product, proof, local/national fulfillment and gift intent | 5/5/5 | Mapped |
| Ladurée | [official site](https://laduree.com/en-us/) | Packaging-led luxury, gifting taxonomy and occasion merchandising | 5/5/5 | Mapped |
| Miette | [official site](https://www.miette.com/) | Delicate brand world and restrained assortment | 4/5/5 | Mapped; thin static response |

`R/A/Re` means relevance, authority and recency on a five-point scale. Official
current sites receive authority and recency `5`; relevance reflects transfer to
small local confectionery journeys.

## Local Anchors

| Brand | Official source | Why it matters locally | Use boundary |
|---|---|---|---|
| Cafehaus | [official site](https://www.cafehaus.com.br/) | Multi-location NAP, tradition, product breadth, encomendas and local occasion language | Local customer expectations and information completeness only |
| Pão e Ponto | [official site](https://www.paoeponto.com/) | Blumenau artisan positioning, place/product experience and local discovery | Local tone and discovery patterns only |

Local anchors are not prospect candidates for this batch unless the deterministic
website-gap gate later proves them eligible. Their presence here does not imply
that their sites are world-class or should be copied.

## Five Selected Global Anchors

1. **Magnolia Bakery** — clearest commercial architecture across pickup,
   shipping, catering, gifting and events.
2. **Cédric Grolet** — strongest product-icon and visual-theatre reference.
3. **Pierre Hermé Paris** — strongest luxury collection/gifting system; extract
   remains invalid until linted output exists.
4. **Dominique Ansel** — strongest founder/chef authority and signature-product
   narrative.
5. **Poilâne** — strongest heritage and craft restraint counterweight.

The set deliberately spans commercial clarity, spectacle, luxury, authority and
heritage. No single anchor supplies a complete page composition.

## Extraction Register

| Target | Output directory | Result |
|---|---|---|
| Magnolia Bakery | `benchmarks/magnolia-bakery/` | Static inputs captured; no valid `DESIGN.md`/lint yet |
| Cédric Grolet | `benchmarks/cedric-grolet/` | Static inputs captured; no valid `DESIGN.md`/lint yet |
| Pierre Hermé | `benchmarks/pierre-herme/` | Phase 1–5 captured; phase-6 LLM failed; `crash-context.json` preserved |

The extraction AC remains open until three directories contain a valid
`DESIGN.md` and zero-error `lint-report.json`. Partial outputs cannot be cited as
completed design systems.

## Reusable Pattern Matrix

| Pattern | Independent support | Transfer rule |
|---|---|---|
| Route by customer intent/occasion | Magnolia, Milk Bar, Ladurée | Use only when the prospect publicly offers the occasion |
| One hero product or signature | Cédric Grolet, Dominique Ansel, Levain | Choose only from verified prospect products |
| Separate pickup/delivery/event actions | Magnolia, Breads, Dominique Ansel | Translate to actual local channels, never invent fulfillment |
| Heritage and maker proof | Poilâne, Dominique Ansel, Cafehaus | Use only with sourced founder/history facts |
| Seasonal merchandising | Magnolia, Breads, Milk Bar | Use current verified season/product availability |
| Packaging and gifting as value | Ladurée, Pierre Hermé, Magnolia | Apply only when official media/offer proves gifting |
| Location completeness | Breads, Cafehaus, Pão e Ponto | Current NAP and hours must be corroborated |
| Product-first visual hierarchy | Levain, Cédric Grolet, Tartine | Use only approved first-party prospect media |

## Explicit Non-transfer

- Benchmark copy, media, logos, color systems, typography pairs and trade dress.
- Nationwide shipping, catering, classes, subscriptions or gifting where the
  prospect does not publicly offer them.
- Celebrity/chef authority, awards, longevity or social proof without evidence.
- A complete section order from any one benchmark.

