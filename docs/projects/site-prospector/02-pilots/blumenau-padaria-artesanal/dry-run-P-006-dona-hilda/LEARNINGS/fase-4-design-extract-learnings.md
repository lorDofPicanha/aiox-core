# DRY RUN Fase 4 — DESIGN EXTRACT — Learnings

**Data:** 2026-05-12
**Tempo total:** ~35min (3 refs paralelas 90s + 2 falhas + synthesis manual 25min)

## Status execução

| Ref | URL | Fetch | CSS detect | LLM | Inputs/ available | Verdict |
|---|---|---|---|---|---|---|
| Hart Bageri | hartbageri.com | ✅ | ✅ 267+ vars | ❌ crash | ✅ | useful |
| Tartine | tartinebakery.com | ✅ | ✅ 4 vars (clean) | ❌ crash | ✅ | very useful |
| Poilâne | poilane.com | ✅ | ✅ aliases | ❌ crash | ✅ | partial |
| Portus | portuspadariaartesanal.com.br | ❌ HTTP fail | — | — | — | URL needs validation |
| Cantinho do Pão | cantinhodopao.com.br | ❌ HTTP fail | — | — | — | URL needs validation |

## Key technical learnings

### 1. 🚨 CRÍTICO — Static CSS NÃO É suficiente sozinho

Hart Bageri retornou tokens WooCommerce (`#a46497` purple, `#7ad03a` green) que NÃO são tokens da marca Hart. São defaults do framework (Bootstrap + WooCommerce theme).

Poilâne usa Shopify theme com aliases (`var(--color-base-text)` resolvido em outro arquivo) — synthesis exigiria seguir aliases recursivamente.

Tartine foi a melhor — apenas 4 vars CSS limpas (`--gold`, `--black`, `--grey`, `--font: PitchSans`) — porque o site é custom build (não WooCommerce/Shopify).

**Implicação pra multi-ref-extract skill MVP (pós-pilot):**
- Filtro **mandatório** de framework defaults (blocklist: WooCommerce, Shopify, Bootstrap, Wix, Tailwind reset)
- Vision augmentation **mandatória** — headless screenshot 1280×800 + LLM vision para "qual é o token visível na página vs token enterrado em CSS framework"
- Static-only é v0.1, vision-augmented é v1.0

### 2. ✅ Style fingerprints classificam bem mesmo com noise

Apesar dos tokens noise, os fingerprints classificaram corretamente:
- Hart Bageri → polaris-friendly 89% (correto)
- Tartine → polaris-friendly 65% (mid — saturation very-low, surface flat-thick-border)
- Poilâne → apple-glass 91% (correto — pure white/cream, generous spacing, glass treatment)

**Implicação:** fingerprint é mais robusto que raw token extraction. Útil para classificação de arquétipo MESMO sem clean tokens.

### 3. ⚠️ Local refs precisam estratégia diferente

Ambos failed at axios fetch — provavelmente:
- Sites BR pequenos usam Cloudflare/bot blocking
- URLs informais sem WWW redirect
- Hosting fora do ar / domínio expirado

**Estratégia pra pilot real:**
- WebSearch + clipping IG profile real (Apify Instagram Scraper $0.01)
- Custom user-agent no design-md fetch
- Backup ref list com URL validation pré-Fase 4
- Walk-by recon Breno (Itoupava Seca visita Portus físico, fotografa exterior + cardápio)

### 4. ✅ Synthesis manual Opus 4.7 = qualidade alta

Sem LLM call do design-md, Opus 4.7 sintetiza tokens com:
- Contrast validation calculada
- Anti-clone scoring per category
- Industry-fit gate
- Provenance per token

Tempo: ~25min manual vs LLM call de ~60s. Trade-off aceito para dry run.

**Workflow pós-pilot SUCCESS:**
- OpenRouter Haiku $0.01-0.05 per extract (production)
- Opus para reviews críticas
- Manual synth como fallback se infra falhar

## AIOS contribution % medido (Fase 4)

| Component | AIOS doable | Hand-edit % |
|---|---|---|
| Static CSS extraction (5 refs) | 100% AIOS | 0% — design-md skill |
| LLM synthesis | 0% AIOS in dry run (claude-cli crash) | — substituted by Opus session |
| Anti-clone scoring | 80% AIOS + 20% julgamento humano | judgment calls |
| Contrast validation | 100% AIOS | 0% — math determinístico |
| Provenance documentation | 70% AIOS + 30% manual decisions | which tokens count as "verified" |
| Tailwind config generation | 90% AIOS | 10% color hex picking |

**Weighted Fase 4 AIOS contribution:** ~65-75% (within SUCCESS threshold ≥60%).

**Caveat:** este AIOS = "Opus na session", não "design-md skill standalone". Real skill (após pilot) precisa OpenRouter ou claude-cli funcionando externamente.

## Recommendation: multi-ref-extract skill

**Decisão:** ALINHADO COM PROCESS SQUAD — NÃO codar agora.

**Pós-pilot SUCCESS:** se 3 prospects shipped E build hours acumularam >25h em design synth (justifica investment), codar:

```
multi-ref-extract v1.0
├── Input: --refs r1,r2,r3,r4,r5 --client-yaml constraints.yaml
├── Pipeline:
│   1. design-md per URL (existing, with --no-llm fallback)
│   2. Framework defaults filter (heuristic blocklist)
│   3. Headless screenshot via Playwright (1280×800 + mobile 375×667)
│   4. Vision LLM: extract visible brand tokens
│   5. Merge: static + vision + research-brief constraints
│   6. Anti-clone gate per category (color 85%/type 75%/layout 60%)
│   7. AAA contrast validation
│   8. Output: tokens.json + tailwind.config.js + DESIGN.md + anti-clone report
├── Effort estimate: 10-15h v1.0
├── Cost: $0.05-0.20 per multi-ref run (OpenRouter Haiku + screenshot bandwidth)
└── ROI: 25min manual synth → 5min automated per prospect = scales beyond pilot
```

## Próximo passo logical pro dry run

Fase 5 — BRIEF EXECUTÁVEL. Compor:
- tokens.json (Fase 4 ✅)
- Dossiê dor (Fase 2 ✅)
- Research-brief (Fase 3 ✅)
- → Brief.md com sitemap, copy seed, stack decisions, gates list

Aprendizado já capturado: Brief precisa explicitar **photography direction** (key insight — brand essence vem das fotos, não dos tokens).

## Comparison: dry-run vs pilot real expected

| Aspect | Dry run (hoje) | Pilot real (junho 2026) |
|---|---|---|
| Local refs validation | FAILED 2/2 | Apify + walk-by Breno |
| Static token extraction | 3/3 success but noisy | + framework filter |
| LLM synthesis | Manual Opus session | OpenRouter Haiku OR multi-ref-extract skill |
| Time consumed Fase 4 | 35min (incl manual) | 8-12min target with skill |
| AIOS contribution | 65-75% | ≥80% with skill v1.0 |

**Conclusion:** flow validates pra dry run. Pilot real requires: (1) URL validation pré-fase 4, (2) Apify pra refs locais BR, (3) DECIDIR: OpenRouter ou multi-ref-extract skill antes do scale.
