# Site-Prospector Vertical Primers

> Curated knowledge per vertical for Site-Prospector pipeline.
> Validated by DR1 (padaria-artesanal) + DR2 (oficina-mecanica) — 86% vertical-distinct delta achieved.

## What is a primer?

A vertical primer is a **human-curated YAML file** that supplies the Site-Prospector pipeline with context it can't reliably derive from agent knowledge-base alone:

- **5-8 design-tier refs** (3 globals + 2 locals minimum) — curated humanly because agent knowledge degrades silently in design-discourse-poor verticals
- **Customer journey axis** (emotional-aspirational / rational-utility / anxiety-driven / status-driven) — load-bearing atom, mis-identification cascades downstream
- **Starter color/typography palette** — drop-in defaults the pipeline can override with client constraints
- **Layout sections** required/optional/excluded per vertical (mechanica needs "Serviços por Sintoma", padaria needs "Vitrine Sazonal" — neither has the other)
- **Photography shot list** — vertical-specific (cuca crumb vs turbo cinematic)
- **Copy tone + vocabulary** + anti-patterns rejected
- **Legal vertical-specifics** (mechanica has Lei 4.886/65, padaria has ANVISA RDC 216, odonto has CFO regulation)
- **Trust signals** required vs not-required (equipe-meister-nominalmente é B2B/técnico only)
- **Pipeline overrides** (Apify required? regulatory dimension necessary? organism count min?)

## Schema

See `_schema.yaml` for the canonical structure.

Versioning: each primer carries `version` field. Breaking schema changes require ADR.

## Available primers (active)

| Vertical | File | Curated by | Last updated | Status |
|---|---|---|---|---|
| Padaria/Confeitaria Artesanal | `padaria-artesanal.yaml` | Orion + Breno (DR1 P-006 Dona Hilda) | 2026-05-12 | active |
| Oficina Mecânica Auto | `oficina-mecanica.yaml` | Orion + Breno (DR2 vertical-agnostic test) | 2026-05-12 | active |

## Backlog (priority order)

| Vertical | Priority | Customer journey axis | Notes |
|---|---|---|---|
| Clínica Odonto Boutique | P1 | anxiety-driven | Refs Dental Boutique London, Yat-Sen Clinic |
| Ateliê Moda Autoral | P1 | emotional-aspirational | Refs Ace & Jig, Tradlands |
| Estética/Beauty Boutique | P2 | emotional-aspirational | similar moda |
| Marcenaria Custom | P2 | status-driven | Refs Sawkille, BDDW |
| Advocacia Boutique | P2 | anxiety-driven | Refs Wachtell Lipton tier |
| Restaurante Tradicional | P3 | emotional-aspirational | similar padaria |
| Eletricista Predial | P3 | rational-utility | **Degradation test** — design discourse near-zero |

## When to curate a new primer

**REQUIRED:** before running Site-Prospector pipeline on a new vertical for the first time.

**Process:**
1. Run DRY RUN on a synthetic prospect in the vertical
2. Use `_schema.yaml` template as starting structure
3. Spend 1-2h research:
   - Identify 3 design-tier global refs (Awwwards, SOTD, design discourse popular)
   - Identify 2 BR/Sul-BR local refs as vernacular floor
   - Decide customer-journey axis (see DR2 LEARNINGS for 4-axis framework)
   - Define starter color/typography per archetype synthesis
   - List sections required/excluded based on customer journey
   - Photography shot list per vertical
   - Copy tone + vocabulary domain
   - Legal vertical-specifics (which laws apply beyond CDC)
4. Save to `{vertical-id}.yaml`
5. Add entry to this README "Available primers" table
6. Validate with one real prospect dry-run if possible

**Curation budget:** 1-2h per vertical (junior researcher possible).

## Pipeline consumption

Phase 3 NICHE RESEARCH agent loads primer at start:

```python
# pseudo-code
primer = load_yaml(f".aios-core/data/site-prospector/primers/{vertical_id}.yaml")
prospect_constraints = load_yaml(f"prospects/{prospect_id}/constraints.yaml")

# primer is starting point; prospect overrides for client-specifics
final_design_input = merge(primer, prospect_constraints)
```

Phase 4 DESIGN EXTRACT uses primer's `refs.global + refs.local` as starting refs (agent can ADD more if research surfaces relevant alternatives, but primer refs are the floor).

Phase 5 BRIEF EXECUTÁVEL applies primer's `layout.sections_required + photography.shot_list + copy.tone` directly into deliverable.

Phase 7 PRODUCTION GATE uses primer's `legal.vertical_specific_laws + trust_signals.required + anti_patterns_global` as additional checks beyond universal gates.

## Override hierarchy (most-specific wins)

```
prospect-specific constraints (highest priority)
   ↓
client business overrides (founder photo, brand colors, etc.)
   ↓
primer vertical (curated humano)
   ↓
universal defaults (CONTEXT.md gates)
```

## Update cadence

- **Reassess each primer every 6 months** (per primer `review_cadence_months` field)
- **Immediate reassess triggers** in each primer's `reassess_triggers` list (ex: "Tartine sair do ar")
- **Pipeline gates evolution** in CONTEXT.md may invalidate primer constraints — update both

## References

- DR1 LEARNINGS: `docs/projects/site-prospector/02-pilots/blumenau-padaria-artesanal/dry-run-P-006-dona-hilda/LEARNINGS/`
- DR2 LEARNINGS: `docs/projects/site-prospector/02-pilots/vertical-test-oficina-mecanica/LEARNINGS/`
- ADR-0003 Primer Architecture: `docs/projects/site-prospector/99-decisions/0003-primer-yaml-architecture.md`
- Schema spec: `_schema.yaml`
