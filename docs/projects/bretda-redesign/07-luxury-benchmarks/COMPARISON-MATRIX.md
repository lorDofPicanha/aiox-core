# Luxury Benchmarks — Comparison Matrix

**Generated:** 2026-05-15 · **Tool:** design-md skill v0.1 (static HTML/CSS analysis)
**Brands extracted:** 6 luxury references + Bretda baseline (Vitra falhou — anti-bot 403)
**Method:** Static regex pass on HTML/CSS (no headless browser). Each fingerprint scored against 11 archetypes.

---

## 1. Archetype Classification — onde cada brand se encaixa

| Brand | Archetype | Confidence | Radius | Saturation | Density | Weight | Shadows | Surface |
|-------|-----------|:----------:|--------|------------|---------|--------|---------|---------|
| **Cassina** | apple-glass | **90%** | high | very-low | very-roomy | regular | strong | **glass** |
| **B&B Italia** | apple-glass | **100%** | moderate-high | very-low | very-roomy | regular-bold | strong | **glass** |
| **Aston Martin** | apple-glass | **100%** | high | near-zero | very-roomy | regular-bold | strong | **glass** |
| **Aman** | apple-glass | 77% | moderate-high | near-zero | very-roomy | reg-med-semi-bold | moderate | flat-thick-border |
| **Brunello Cucinelli** | polaris-friendly | 100% | moderate-high | very-low | moderate | regular | strong | gradient |
| **Bottega Veneta** | polaris-friendly | 89% | moderate-high | very-low | very-roomy | — | strong | gradient |
| **🔴 BRETDA (atual)** | **polaris-friendly** | **74%** | **minimal** | near-zero | very-roomy | reg-med-semi-bold | strong | **gradient** |

### Insight #1 — Bretda está classificado no archetype ERRADO

Luxury furniture (Cassina/B&B/Aston) = **apple-glass 90-100%**. Bretda = **polaris-friendly 74%** (mesma família de **Shopify dashboards**). É um sinal técnico do que o design audit (Uma) já tinha falado: "looks like B2B SaaS in luxury costume".

**Diffs estruturais entre Bretda e Cassina (mesmo benchmark direto):**

| Signal | Bretda atual | Cassina (target) | Gap |
|--------|--------------|------------------|-----|
| Radius | **minimal** (1-2px) | **high** (rounded) | 🔴 MAJOR — sharp corners é commerce/dashboard, não luxury furniture |
| Saturation | near-zero | very-low | ✅ alinhado |
| Density | very-roomy | very-roomy | ✅ alinhado |
| Weight | reg-med-semi-bold (4) | regular (1) | 🔴 MAJOR — Cassina usa 1 weight só |
| Shadows | strong | strong | ✅ alinhado |
| Surface | **gradient** | **glass** | 🔴 MAJOR — gradient é commerce; glass é luxury 2026 |

---

## 2. Token economy — disciplina mensurável

| Brand | Hex colors | Fonts | Spacing values | CSS vars | @font-face files |
|-------|:----------:|:----:|:--------------:|:--------:|:----------------:|
| **🔴 BRETDA** | 75 | **10 famílias** | 11 (5-64px) | 246 | **117** |
| Cassina | 110 | **4 famílias** | 7 (5-40px) | 280 | **5** |
| Aman | 103 | 12 (global/multi-region) | 10 (0-110px) | 25 | 52 |
| Brunello | 124 | 4 famílias | 2 (3-5px inline) | 53 | 10 |
| B&B Italia | 202 | 15 famílias | 8 (4-30px) | 63 | 23 |
| Bottega | **34** | 5 famílias | 1 (15px) | 33 | **5** |
| Aston Martin | 116 | **3 famílias** | 7 (5-30px) | 1 | 20 |

### Insight #2 — Bretda tem 117 @font-face declarados, Cassina tem 5

**Bretda atual em produção** (extraído de bretda.com.br LIVE — NÃO da branch Sprint 0): 117 @font-face references. Mesmo após Sprint 0 remover 3 fonts (Cormorant/Raleway/Josefin), ainda há TAN Aegean + Century Gothic + Inter + 4 fallbacks = bundle pesado.

**Cassina, Bottega:** **5 @font-face cada**. Aston Martin: 20 (com weights variants). Brunello: 10.

**Padrão luxury furniture típico:**
- 1-2 famílias custom brand-owned (AstonMartinSans, bottegaveneta-regular)
- OU 1 família editorial premium (Neue Haas Grotesk em Cassina, Orpheus Pro em B&B)
- 3-4 weights máx

**Recomendação Bretda Phase 3:** 1 família display (TAN Aegean OR custom-cut Bretda Display) + 1 família body (Century Gothic) = **2 famílias / 3 weights máx**. Bundle target: < 80KB total fonts (vs ~218KB hoje pós-S0.9 da branch).

### Insight #3 — Color discipline: Bottega é o gold standard (34 colors)

Bottega Veneta opera com 34 hex colors totais — o mais minimal do dataset. **Brunello também é restrained** (124 mas a maioria deve ser system semantic — 4 fonts = 4 brand colors típicos).

Bretda tem 75 colors hoje — **OK** mas auditar quais 75 são REALMENTE necessários. Aposta: 60% pode ir, ficar com ~30 ativos (palette Bottega-tier).

---

## 3. Spacing scale — o lugar onde luxury respira

| Brand | Min | Max | Scale step pattern |
|-------|----:|----:|-------------------|
| Bretda | 5px | **64px** | 5, 8, 12, 14, 16, 18, 24, 28, 32, 60, 64 |
| Cassina | 5px | 40px | 5, 6, 8, 15, 20, 24, 40 (multiplier ~5) |
| **Aman** | 0px | **110px** | 0, 3, 4, 5, 10, 14, 20, 49, 50, **110** |
| Brunello | 3px | 5px | (uses inline mostly) |
| B&B Italia | 4px | 30px | 4, 5, 10, 15, 16, 20, 25, 30 (multiplier ~5) |
| Bottega | 15px | 15px | (uses 1 base + multipliers inline) |
| Aston Martin | 5px | 30px | 5, 10, 14, 15, 16, 20, 30 |

### Insight #4 — Aman usa 110px de spacing. Bretda usa 64px max.

**Luxury = MASSIVE whitespace.** Aman tem 110px em sua scale = literalmente espaço-de-respirar editorial. Bretda topa em 64px = ainda denso. Aumentar scale top-end (criar tier `mega-spacing-128` ou `xxl-160`) destrava o "looks like Aman".

**Cassina e B&B operam num pattern ~5x multiplier** (5, 10, 15, 20, 25, 30, 40) — disciplina previsível. Bretda tem 5, 8, 12, 14, 16, 18, 24, 28, 32, 60, 64 — escala IRREGULAR (mistura de 4-base + 5-base + arbitrários). **Refactor pra scale 4x ou 8x consistente.**

---

## 4. Motion vocabulary — onde luxury é teatro

| Brand | Min duration | Max duration | Insight |
|-------|--------------|--------------|---------|
| Brunello | 50ms | 22s | Micro-interactions 50-300ms (Schneider restraint pure) + 15s/22s background |
| Cassina | 0s | 6s | Restrained cinematic |
| **Aman** | 0.15s | **35s** | **35s = "carregamento como narrativa"** (Schneider blind-spot) |
| Bottega | 0s | **85s** | Background loops sustained |
| **Aston Martin** | 0s | **225s** | **3.75 MINUTOS de loop cinematic** |
| Bretda | 300ms | 8s | Max é 8s — sem "teatro" |
| B&B Italia | 0s | 35s | Long background loops |

### Insight #5 — Bretda não tem motion teatral

**Aston Martin tem keyframe animations de 225 segundos** (3.75 min — provavelmente background video showcase looped). **Aman 35s, Bottega 85s.** Esses são **moments of intentional slowness** — o que Schneider chamou de "OWN the time" no conclave.

Bretda max 8s. **Falta o tier "background editorial loop"** — hero video com 30-60s loop de cliente real (já tem foto, falta vídeo) seria match direto. Phase 3 entrega.

---

## 5. Tech stack — luxury não é sobre framework

| Brand | Stack signals |
|-------|---------------|
| Bretda | Vercel + Next.js + Tailwind ✅ |
| **Cassina** | Cloudflare + **Tailwind** ✅ (mesmo stack base) |
| Aman | Cloudflare only (CSS custom) |
| Brunello | Bootstrap (heritage) |
| B&B Italia | Bootstrap (heritage) |
| Bottega | Cloudflare only (custom) |
| Aston Martin | Bootstrap (heritage) |

### Insight #6 — Mesmo Cassina usa Tailwind

**Mito vetado:** "tem que sair do Tailwind pra ser luxury". Cassina = apple-glass 90% + Tailwind. **A diferença é DISCIPLINA de tokens, não framework.** Bretda continua com Tailwind 4. Stack tá ok.

**Heritage brands (Brunello, B&B, Aston)** ainda em Bootstrap — provavelmente legacy, não é benchmark a copiar.

---

## 6. Surface treatment gap — o single biggest visual delta

| Brand | Surface |
|-------|---------|
| Cassina | **glass** |
| B&B Italia | **glass** |
| Aston Martin | **glass** |
| Aman | flat-thick-border |
| Brunello | gradient |
| Bottega | gradient |
| **Bretda** | **gradient** |

### Insight #7 — Glass surface é o "tell" #1 de luxury furniture 2026

3 das luxury furniture brands de tier S (Cassina, B&B, Aston) usam **glass** (backdrop-filter blur subtle + transparency). Bretda usa **gradient** (fade-from-cor-A-to-cor-B em panels/cards). É a diferença visual MAIS imediata em scroll.

**Implementação simples** — Phase 3 pode adicionar:
```css
.luxury-card {
  background: rgba(43, 40, 38, 0.78);  /* charcoal at 78% */
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(201, 169, 121, 0.18); /* champagne hairline */
}
```

E imediatamente o visual sobe pra apple-glass archetype.

---

## 7. Quick-wins ordered (Phase 3 prep)

| Priority | Action | Source brand | Confidence |
|---:|--------|-------------|:----------:|
| **P0** | Trocar surface gradient → glass (backdrop-filter blur) em cards | Cassina, B&B, Aston | 100% gap |
| **P0** | Aumentar border-radius minimal (1-2px) → moderate-high (8-12px) | Cassina, B&B | 100% gap |
| **P0** | Reduzir font weights de 4 → 1-2 (regular + bold/display) | Cassina (1), Aston (2) | 100% gap |
| **P1** | Aumentar spacing scale top tier — adicionar tier 96px / 128px | Aman (110px) | 90% gap |
| **P1** | Normalizar spacing scale pra multiplier 4x ou 8x (vs 11 valores irregulares) | Cassina, B&B (5x consistente) | gap visível |
| **P1** | Reduzir color palette ativa ~75 → ~30 colors | Bottega (34 total) | gap moderado |
| **P2** | Adicionar tier motion "editorial loop" 30-60s pra hero video futuro | Aman (35s), Bottega (85s) | gap "teatro" |
| **P2** | Bundle @font-face 117 → < 10 (custom brand display + body editorial) | Cassina, Aston (5 e 20) | gap performance + discipline |

---

## 8. Anti-recommendations (NÃO copiar)

- ❌ **Bootstrap heritage stack** — Brunello/B&B/Aston usam mas é legacy, não vantagem
- ❌ **15+ fonts** — só Aman pode justificar (multi-region/global) e mesmo assim é overhead
- ❌ **Polaris-friendly archetype** — Brunello e Bottega ficaram lá mas saturação higher do que Cassina/B&B. Mira o cluster apple-glass.
- ❌ **Glass effect com saturação alta** — apple-glass premia very-low saturation + glass; saturação alta + glass = SaaS dashboard

---

## 9. Próximo deliverable

Vou ler key tokens.json de Cassina (mais alinhado com luxury furniture) + B&B Italia + Aston Martin (mais próximo do posicionamento Bretda) e extrair **paleta target sugerida** + **type scale target** + **spacing scale target** em formato pronto pra Phase 3 brief técnico do @ux-design-expert.

Output esperado: `BENCHMARK-INSIGHTS.md` com 3-5 decisões NUMERICAS direcionais que destravam Phase 3 sem cair em "implementar luxo às cegas" (gate violation).

---

*Generated by Orion (aios-master) — Phase 0 visual benchmark · 2026-05-15*
*Honest disclaimer: static analysis captures tokens declarados em CSS. Não captura runtime/dynamic states ou JS-driven motion. Para Phase 3 final, validar via browser real lado-a-lado (Playwright screenshot comparison).*
