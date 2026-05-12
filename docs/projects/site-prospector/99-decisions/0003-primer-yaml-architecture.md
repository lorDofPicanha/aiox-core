# ADR-0003 — Per-Vertical Primer YAML Architecture

**Status:** ACCEPTED (2026-05-12, post DR1 + DR2 vertical-agnostic validation)
**Decisor:** Breno + Orion + DR2 validation data
**Supersedes:** N/A
**Superseded by:** N/A
**Related:** ADR-0001 (Pipeline Architecture), ADR-0002 (CDC/LGPD)

---

## Contexto

DR1 (padaria-artesanal) + DR2 (oficina-mecanica) validaram que pipeline Site-Prospector v1 produz outputs **vertically-distinct** com **86% aggregate delta** entre os dois verticais. Convergências saudáveis (gates AAA/perf, stack, Inter body, BR tropical cream) emergem de princípios universais — não template forçado.

Porém, DR2 surfaceou risco crítico: **vertical com refs design-discourse-poor pode produzir outputs menos diferenciados** (silent degradation). Mecânica teve refs LOW knowledge-base confidence (AUTOPROFI). Eletricista predial, marcenaria, estética interior poderiam degradar ainda mais.

Também surfaceou: **customer-journey axis é load-bearing** (10/10 delta DR2). Mis-identificação cascade. 4 padrões identificados (emotional-aspirational / rational-utility / anxiety-driven / status-driven) precisam ser explícitos.

E: **layout-organism-level varia mais que esperado**. Mecânica adicionou organism inteiro novo ("Serviços por Sintoma") que padaria não tinha. Templatize "5 sections obrigatórias" QUEBRA pipeline.

---

## Decisão

Adotar **per-vertical primer YAML architecture** em `.aios-core/data/site-prospector/primers/`.

### Princípios

1. **Pipeline single** — NÃO fragmentar em pipelines per-vertical paralelos (chassis é robusto 86% delta)
2. **Primer curated humanamente** — 1-2h por vertical, junior researcher possible
3. **Primer overrides defaults** apenas onde vertical exige
4. **Override hierarchy** (prospect → client business → primer → universal defaults)
5. **Reassess cadence 6 meses** + triggers immediate (ex: ref design sai do ar)
6. **Schema versioned** — breaking changes exigem ADR

### Estrutura de pastas

```
.aios-core/data/site-prospector/primers/
├── _schema.yaml                          # canonical schema docs
├── README.md                             # human-readable index + curation guide
├── padaria-artesanal.yaml                # DR1-derived
├── oficina-mecanica.yaml                 # DR2-derived
└── (futuro)
    ├── clinica-odonto-boutique.yaml      # P1 backlog (anxiety-driven)
    ├── atelie-moda-autoral.yaml          # P1 backlog
    ├── estetica-beauty.yaml
    ├── marcenaria-custom.yaml
    ├── advocacia-boutique.yaml
    ├── restaurante-tradicional.yaml
    └── eletricista-predial.yaml          # P3 — degradation test
```

### O que cada primer contém

| Campo | Por que existe | Curação |
|---|---|---|
| `customer_journey.axis` | Load-bearing atom — 4 padrões (emotional-aspirational / rational-utility / anxiety-driven / status-driven) | Identificar 1 por vertical |
| `refs.global` (3-5) | Knowledge-base humano > agent knowledge em design-discourse-poor verticais | Curar Awwwards/SOTD/discourse popular |
| `refs.local` (2 min) | Vernacular floor BR — agent knowledge muito fraco | Curar Sul BR padaria/restaurante/comércio |
| `archetype.synthesis_label` + `archetype.blend` | Define "DNA visual" do vertical sem ser genérico | Derivar da DR vertical-specific |
| `color.starter_palette` | Override defaults universais com cores vertical-appropriate | Validar contrast AAA preset |
| `typography.starter` | Display + body pairing por archetype semantico | Display geometric-grotesque pra industrial, serif warm pra editorial |
| `layout.sections_required/optional/excluded` | Organism-level structural variability (mecânica precisa Sintomas, padaria precisa Sazonal) | Derivar da DR organism analysis |
| `photography.shot_list` | Brand essence vem das fotos, não dos tokens CSS (DR1 LEARNING) | Curar shot list per archetype |
| `copy.tone` + `vocabulary_domain` | Tom NÃO trans-vertical (warm narrativo vs técnico direto) | 1-2h research vocabulary domain |
| `legal.vertical_specific_laws` | Universal CDC + vertical extras (Lei 4.886/65 mecânica, ANVISA padaria, CFO odonto) | Lista por vertical |
| `trust_signals.required` + `NOT_required` | Equipe-meister é B2B/técnico only. Founder-photo é B2C aspiracional only. | Decidir per axis |
| `cta.primary.prefill_template` | WhatsApp prefill VARIA dramaticamente (livre vs marca+sintoma+foto) | Template per vertical |
| `pipeline_overrides` | Apify required? Regulatory dimension necessary? Organism count min? | Per vertical |

---

## Override hierarchy

```
1. Prospect-specific constraints
   ↓ (overrides 2,3,4)
2. Client business overrides (logo cor brand, founder name)
   ↓ (overrides 3,4)
3. Primer vertical (this file)
   ↓ (overrides 4)
4. Universal defaults (CONTEXT.md gates, ADR-0002 CDC)
```

Cada nível pode **adicionar** ou **substituir** valores. Override é declarativo, não mutativo.

---

## Pipeline consumption

### Phase 3 NICHE RESEARCH

```
input:
  - primer/{vertical_id}.yaml
  - prospects/{prospect_id}/constraints.yaml
process:
  - merge(primer, prospect_constraints) → research-input
  - agent applies customer_journey.axis explicitly
  - agent expands refs starting from primer.refs (additive permitted, exclusive base)
  - agent honors layout.sections_required + sections_excluded
output:
  - research-brief.md (vertical-aware)
  - refs-for-design-extract.json (primer.refs + agent additions)
```

### Phase 4 DESIGN EXTRACT

Uses primer.refs as input. Anti-clone thresholds in CONTEXT.md (85/75/60) apply. Primer adds **categorical weighting**:
- color/type/layout → global-refs weight
- vocabulary/sitemap → local-refs weight

### Phase 5 BRIEF EXECUTÁVEL

Primer's `layout.sections_required` + `photography.shot_list` + `copy.tone` flow into brief directly.

### Phase 7 PRODUCTION GATE

Universal gates from CONTEXT.md +
- `legal.vertical_specific_laws` checks
- `trust_signals.required` validation
- `pipeline_overrides.production_gate_extras` extra checks

---

## Curation process (1-2h per primer)

1. **Run DRY RUN on synthetic prospect** in the vertical (ideal: real prospect, but mark explicit DRY RUN)
2. **Identify customer journey axis** (4 patterns)
3. **Research 3 global design-tier refs** (Awwwards, SOTD, design discourse leaders) — 30min
4. **Research 2 local refs SC/Sul-BR** (vernacular floor) — 20min
5. **Decide archetype synthesis blend** (% weights per source)
6. **Derive starter color palette** + AAA contrast validation
7. **Decide typography pairing** (display by archetype + Inter body universal)
8. **List layout sections** required/optional/excluded based on customer journey
9. **Photography shot list** vertical-specific
10. **Copy tone + vocabulary domain + anti-patterns**
11. **Legal vertical-specifics research** (which laws beyond CDC apply)
12. **Trust signals required vs NOT-required**
13. **Save to `{vertical-id}.yaml`** following `_schema.yaml`
14. **Update README.md** index table
15. **Validate with second prospect dry-run** if possible (cross-prospect calibration)

---

## Versioning + lifecycle

- **Schema version** in each primer (`version: "1.0"`)
- **Breaking schema changes** require new ADR + migration of all primers
- **Reassess each primer every 6 months** (per `review_cadence_months`)
- **Immediate reassess triggers** in primer's `reassess_triggers` list
- **Deprecation**: primer marked `status: deprecated` with link to replacement

---

## Consequências

**Positivas:**
- Pipeline produz outputs verticality-distinct sem fragmentar arquitetura
- Verticais design-discourse-poor (eletricista, marcenaria) ganham scaffold human-curated antes de degradar silenciosamente
- Customer-journey-axis vira explícito (load-bearing atom não-implícito)
- Onboarding novo vertical custa 1-2h (junior researcher), não dias
- Legal vertical-specifics ficam estruturados (não esquecíveis)
- Reuso intelectual cross-vertical capturado (e.g., "hero close-up componente-do-ofício" universal pattern)

**Negativas / Riscos:**
- Carga de manutenção: 6 meses cadence + triggers reassess. Se backlog crescer (10+ verticais), overhead aumenta
- Primer mal-curado pode propagar erro pra todos prospects daquele vertical
- Primer ≠ skill — quem cura PRECISA ter entendido DR + LEARNINGS prévios
- Override hierarchy pode confundir agent SE não-explícita no prompt

**Tradeoffs aceitos:**
- Single pipeline > N pipelines (validated DR2 86% delta)
- 1-2h curation manual > LLM-generated primer (knowledge degradation risk too high)
- 6-mo reassess > stale tokens (refs morrem online)
- Vertical-specific in primer > vertical-specific in pipeline code (cleaner separation)

---

## Decisões derivadas

1. **Run DR3 (clínica odonto OR eletricista)** opcional mas recomendado — testa terceiro axis OR severe degradation
2. **Per-vertical primer = pre-requisite** antes de rodar pipeline em vertical novo
3. **Primer schema 1.0 LOCKED** — schema changes precisam ADR-0004+
4. **Documentar reassess cycle** — calendário CRON ou recurring TODO 6mo
5. **DR1 + DR2 LEARNINGS = canonical source** para curar futuros primers — referenciar explicitamente

---

## Aprovação

- [x] DR1 padaria-artesanal primer populado
- [x] DR2 oficina-mecanica primer populado
- [x] `_schema.yaml` canonical reference
- [x] `README.md` curation guide + backlog priority
- [x] ADR-0003 (este) explica architecture
- [ ] CONTEXT.md atualizado para referenciar primer system (próximo)
