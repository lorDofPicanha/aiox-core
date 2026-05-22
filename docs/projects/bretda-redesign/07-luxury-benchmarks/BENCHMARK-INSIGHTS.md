# Benchmark Insights — Phase 3 Brief Pre-work

**Source:** 6 luxury benchmarks (Cassina, B&B Italia, Aston Martin, Aman, Brunello, Bottega) + Bretda atual extraídos via design-md skill
**Purpose:** Converter "gut feel luxury" → **decisões numéricas objetivas** para Phase 3 brief técnico do @ux-design-expert
**Gate addressed:** `.out-of-scope/luxury-redesign-without-benchmark.md` (4 fails consecutivos)

---

## 1. Decisão #1 — Archetype target

**Atual:** Bretda = polaris-friendly 74% (família Shopify dashboards)
**Target:** apple-glass 90%+ (Cassina, B&B Italia, Aston Martin)

**Como fechar gap (4 mudanças concretas):**

```diff
- radius: minimal (1-2px corners)
+ radius: moderate-high (8-12px corners em cards, 16-24px em painéis grandes)

- surface: gradient (commerce-style fade)
+ surface: glass (backdrop-filter: blur(20-24px) + transparency 78-88%)

- weight: regular-medium-semibold-bold (4 weights)
+ weight: regular (1) ou regular-bold (2) max

- color saturation: near-zero ✅ (manter)
+ idem
```

**Tailwind classes target** (luxury apple-glass cards):
```css
/* current Bretda card */
.card-current { @apply bg-charcoal/95 border border-white/10 rounded-sm; }

/* target apple-glass */
.card-target {
  @apply bg-charcoal/78 backdrop-blur-xl border border-champagne/18 rounded-lg;
  /* + saturate-180 via custom utility */
}
```

---

## 2. Decisão #2 — Color palette canonical

**Padrão extraído (Cassina como template — `--cassina-*` namespace):**

| Tipo | Cassina pattern | Bretda equivalente recomendado |
|------|-----------------|------------------------------|
| Brand color | Teal `rgb(0, 115, 120)` | **Champagne `#C9A979`** (já existe — manter) |
| Neutral scale (9-tier) | gray-50/75/100/200/300/400/500/600/700/800/900 | **charcoal-50 … 900** (criar) |
| Action/link tier | Blue 100-800 | **Champagne tonal 100-800** (criar) ou Editorial blue subtle |
| Spot accent | Orange `rgb(241, 99, 33)` | OPCIONAL — Bretda nunca precisou |
| Error/warning | Red variants 2-tone | criar 2-tone subtle |
| Hint text | `rgb(158, 158, 158)` | charcoal-500 equivalente |

**Action:** criar tokens em `tailwind.config` espelhando essa nomenclatura. Hoje Bretda tem 75 hex colors esparsos em organisms — refactor pra 30-40 tokens nomeados:
- 11 neutros (charcoal-50 a charcoal-900 + white)
- 8 champagne tonal (100-800)
- 4 functional (success, warning, error, info — subtle)
- 6 brand specific (cream, ivory, deep-wood, etc — TBD da paleta atual)

**Total target: ~30 tokens nomeados** (vs 75 hex hoje, vs Bottega 34 raw, vs Cassina 280 mas semanticamente organizados).

---

## 3. Decisão #3 — Type scale

**Padrão luxury furniture (Cassina, Aston Martin, B&B):**

| Tier | Cassina | Aston | B&B Italia | **Target Bretda** |
|------|---------|-------|-----------|-------------------|
| Display | Neue Haas Grotesk Bold | AstonMartinFlare | Orpheus Pro Bold | **TAN Aegean** (manter) |
| Body | Neue Haas Grotesk Roman | AstonMartinSans | Helvetica Neue LT Roman | **Century Gothic Regular** (manter) |
| Editorial micro | Neue Haas Grotesk Italic | — | Orpheus Pro Italic | Inter (manter pra microcopy técnica) |

**Weights ativos target:** 3 total (não 6+)
- Display Bold (TAN Aegean bold)
- Body Regular (Century Gothic regular)
- Body Bold (Century Gothic bold pra emphasis pontual)

**Anti-pattern detectado:** Bretda atualmente declara 117 @font-face files. Mesmo após Sprint 0 (que remove 3 famílias não-usadas), bundle continua pesado. **Phase 3 target:** consolidar em 6-10 @font-face MAX (2 famílias × 3 weights cada).

---

## 4. Decisão #4 — Spacing scale

**Padrão luxury (Cassina, B&B, Aston usam multiplier 5x):**

```
Cassina:     5, 6, 8, 15, 20, 24, 40        → 7 values (5x base com variation)
Aston:       5, 10, 14, 15, 16, 20, 30      → 7 values (5x base)
B&B:         4, 5, 10, 15, 16, 20, 25, 30   → 8 values (5x mostly)
Aman:        0, 3, 4, 5, 10, 14, 20, 49, 50, 110 → 10 values (incluindo 110!)
```

**Bretda atual:** 5, 8, 12, 14, 16, 18, 24, 28, 32, 60, 64 — **11 values irregulares** (mistura 4-base + 5-base + arbitrários)

**Target Bretda Phase 3 — 8 tier system + 1 mega:**

| Tier | Px | Token name | Use case |
|------|---:|------------|----------|
| xs | 4 | `space-xs` | inline gaps |
| sm | 8 | `space-sm` | dense layouts |
| md | 16 | `space-md` | default gap |
| lg | 24 | `space-lg` | section padding-y mobile |
| xl | 40 | `space-xl` | section padding-y desktop |
| 2xl | 64 | `space-2xl` | major section gap |
| 3xl | 96 | `space-3xl` | hero breathing room |
| **4xl** | **160** | **`space-mega`** | **Aman-tier whitespace entre acts editoriais** |

**Why 160 not 110:** Aman max é 110. Bretda quer posicionar-se ABOVE Aman em breathing pra Phase 3 (não copiar — superar).

---

## 5. Decisão #5 — Motion vocabulary

**Padrão extraído:**

| Tier | Cassina | Aman | Brunello | Aston | **Target Bretda** |
|------|---------|------|----------|-------|-------------------|
| Micro (hover/focus) | 192-384ms | 150-200ms | 50-300ms | — | **150-300ms** |
| UI (drawer, menu) | 224ms | — | 250ms | — | **240ms** |
| Standard (page-enter) | 384ms | — | — | — | **400ms** |
| Cinematic (hero loop) | 1-6s | 1-5s | — | 6s | **5-8s** |
| **Editorial loop** | — | **35s** | 22s | **225s** | **30-60s** (hero video futuro) |

**Tokens easings target (espelhando Cassina padrão Material-ish):**
```css
--ease-bounce:   cubic-bezier(0.5, 1.8, 0.9, 0.8);
--ease-in:       cubic-bezier(0, 0, 0.2, 1);     /* enter */
--ease-out:      cubic-bezier(0.4, 0, 1, 1);     /* exit */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);   /* default */
```

Bretda hoje provavelmente tem Tailwind default (ease-in, ease-out, ease-in-out) sem named luxury curves. **Add 4 named easings = quick win.**

---

## 6. Decisão #6 — Surface treatment (single biggest visual gap)

**Implementar em Phase 3:**

```css
/* tailwind.config — extend layer */
@layer utilities {
  .surface-glass {
    background: hsl(20 8% 14% / 0.78);  /* charcoal at 78% */
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid hsl(38 36% 64% / 0.18); /* champagne hairline */
  }

  .surface-glass-light {
    background: hsl(36 60% 96% / 0.88);  /* cream at 88% */
    backdrop-filter: blur(16px) saturate(160%);
    border: 1px solid hsl(20 8% 14% / 0.08);
  }

  .surface-glass-overlay {
    /* hero overlay, modal backdrop */
    background: hsl(20 8% 14% / 0.55);
    backdrop-filter: blur(28px);
  }
}
```

**Aplicar em:**
- ElevenCollectionGallery cards (HOJE: bg-charcoal opaque) — substitui white-bg renders flutuando
- ElevenNavbar scroll-state (HOJE: opaque after scroll) — manter transparency com glass
- Configurador material/color panels (HOJE: opaque) — glass over canvas
- Modais (encomenda particular form) — glass overlay

**Risco:** backdrop-filter performance penalty em mobile low-end (Safari iOS 14- não suporta). Adicionar fallback `@supports not (backdrop-filter: blur())` → opaque background.

---

## 7. Decisão #7 — Anti-recommendations claras

❌ **NÃO copiar Brunello/Bottega como benchmark primário** — eles caíram em polaris-friendly (igual Bretda hoje). Para luxury furniture o cluster correto é **Cassina + B&B Italia + Aston Martin**.

❌ **NÃO copiar Aman literalmente** — multi-region/global setup justifica 12 fonts; Bretda é BR-only, 2-3 fonts suficiente.

❌ **NÃO trocar Tailwind** — Cassina opera em apple-glass 90% usando Tailwind. Problema não é framework, é **disciplina de tokens**.

❌ **NÃO adicionar mais cores ao palette** — Bottega prova que 34 colors total = luxury. Bretda hoje 75 = excesso. Phase 3 deve REDUZIR, não expandir.

❌ **NÃO gerar variantes de fonts via @font-face overload** — Cassina tem 5 @font-face, Bretda 117. Custom subsetting + variable fonts = win.

---

## 8. Phase 3 brief técnico — TL;DR pro @ux-design-expert

Quando Phase 3 disparar, briefing começa com:

> "Target archetype = apple-glass (90% confidence) — Cassina + B&B Italia + Aston Martin reference cluster. Bretda hoje classifica polaris-friendly 74%. Para fechar gap, 4 mudanças NÃO-NEGOCIÁVEIS:
> 1. Surface treatment: gradient → glass (backdrop-filter blur 20-24px, transparency 78-88%)
> 2. Border radius: minimal → moderate-high (8-12px cards, 16-24px panels)
> 3. Font weights: 4-6 weights → 3 weights total (TAN Aegean Bold + Century Gothic Regular/Bold)
> 4. Spacing scale: 11 valores irregulares → 8-tier system multiplier 5x ou 8x + 1 mega-tier (160px) Aman-style
>
> Tokens-detected.json de cada ref disponível em `07-luxury-benchmarks/{brand}/inputs/`. Validação CI gate via Playwright screenshot comparison vs `cassina/preview.html` (TBD).
>
> Gate de merge Phase 3 = side-by-side screenshot Bretda hero vs Cassina + B&B Italia hero (skill `mcp__refero__refero_similar` ou Playwright manual). Reject merge se delta visual > 30%."

---

## 9. Próximo passo (não-bloqueante de Sprint 1)

Esses dados ficam **dormant até Phase 3 disparar**. Sprint 1+2 são fundação técnica que NÃO mexe em design tokens significativamente. Quando Breno der GO em Phase 3 (pós-Sprint 0/1/2 + brand-onliness workshop), este doc + `COMPARISON-MATRIX.md` + os 6 `tokens-detected.json` viram **input do brief técnico**.

Resultado: Phase 3 começa com **target NUMÉRICO** (não "torna mais luxury"), CI gate **mensurável** (% drift vs target), e gate visual **OBJETIVO** (side-by-side vs refs).

**4 fails consecutivos não acontecem mais quando o brief é numérico.**

---

*Generated by Orion (aios-master) — Phase 0 visual benchmark · 2026-05-15*
*6 luxury benchmarks extracted via static analysis · LLM phase falhou (claude-cli env) mas raw data suficiente · Vitra 403'd (anti-bot) — skip OK*
