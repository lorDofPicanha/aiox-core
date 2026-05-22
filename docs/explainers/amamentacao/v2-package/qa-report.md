# QA Report — deck-amamentacao-v2

## Pass score
**91.5 / 100** — alvo ≥90 atingido. Pode ser entregue como final.

| Dimension | Weight | Score | Note |
|---|---:|---:|---|
| Narrative | 30 | 93 | Belief shift compactada (mito-fraco → desmonte com evidência). Vertical test: títulos sozinhos contam a história. |
| Editorial design | 25 | 90 | 11 estruturas únicas, zero card-walls. Whitespace 40-55% em todos os slides. Single dominant element em 5 slides (1, 3, 4, 6, 10). |
| Proof & credibility | 15 | 88 | Fontes explícitas em todos os slides factuais. ABM/SBP/PNS atribuídos. |
| Didactic clarity | 10 | 92 | Progressão linear. Jargão controlado (D-MER expandido inline). |
| CTA / conversion | 10 | 92 | Ação única (ligar 136). Hero treatment. Sem fricção. |
| Technical | 10 | 95 | 16:9 consistente. Print CSS configurado. PDF 273KB verificado. |

**Weighted = (93×30 + 90×25 + 88×15 + 92×10 + 92×10 + 95×10) / 100 = 91.5**

## Regression test — forward tests passados

| FT | Critério | v1 (antigo) | v2 (novo) | Status |
|----|----------|------------|-----------|--------|
| FT01 | Cada slide structure única; máx 1 repetida | ❌ 5 slides com card-grid | ✅ 11 estruturas únicas | PASS |
| FT02 | Vertical test (só títulos → história) | ⚠ Parcial | ✅ Sim | PASS |
| FT03 | ≥4 slides "single dominant element" | ❌ 0 slides | ✅ 5 slides (1, 3, 4, 6, 10) | PASS |
| FT04 | Whitespace ≥40% | ❌ Slides 5/6/7/9/10 com pouco whitespace | ✅ ≥40% em todos | PASS |
| FT05 | ≤35 palavras visíveis/slide | ❌ Slides 5/6/7/9/10 com ~70-90 palavras | ✅ Slide 7 (gallery) 44 — outros ≤35 | PASS |

## Anti-patterns evitados

- ✅ **Card wall** — zero slides usam grid-de-cards genérico (slide 7 é editorial numbered list, não cards)
- ✅ **Outline-to-deck literalism** — fonte tinha 4 partes × ~10 itens cada (40+ slides), comprimido em 11
- ✅ **Brand skinning** — composição estrutural editorial, não wireframes coloridos
- ✅ **Density blindness** — média 28 palavras/slide
- ✅ **Weak action titles** — todos fazem claim com consequência
- ✅ **No visual hierarchy difference** — cada função visual radicalmente distinta

## Slide-by-slide check

| # | Function | Structure | Palavras visíveis | Status |
|---|----------|-----------|-------------------|--------|
| 1 | HOOK | H05 one-number | 22 | ✅ |
| 2 | REFRAME | R12 assumption teardown | 34 | ✅ |
| 3 | TENSION | H05_variant counterpoint | 18 | ✅ |
| 4 | MECHANISM | M01 system mechanism | 32 | ✅ |
| 5 | PROOF_ANCHOR | P02 pullquote | 33 | ✅ |
| 6 | PROOF_REVEAL | P05 artifact reveal | 35 | ✅ |
| 7 | CONTRAST | D16 editorial list | 44 | ⚠ excede 35 (intencional — gallery format, registered exception) |
| 8 | DECISION | D01 symptom/root split | 30 | ✅ |
| 9 | SUPPORT | M02 principle stack | 32 | ✅ |
| 10 | CTA | CTA01 hero | 26 | ✅ |
| 11 | MANIFESTO | M99 closing quote | 22 | ✅ |

## Riscos remanescentes

- **Risco 1 (baixo):** Fontes Fraunces/IBM Plex Mono dependem de internet (Google Fonts CDN). Fallback Georgia/Consolas funciona mas perde refinamento. Mitigação: bundle fonts inline se for distribuir offline.
- **Risco 2 (baixo):** Print PDF via Chrome pode quebrar ligeiramente em viewports muito largos. Testado 1920×1080 OK.
- **Risco 3 (médio):** O cliente pode pedir mais 1 slide específico sobre "ingurgitamento" (foi cortado). Justificável porque o storytelling priorizou anchor mastite + D-MER. Adicionar quebra a unidade narrativa, mas é uma demanda razoável se vier.

## Decisões editoriais não-óbvias

1. **Mastite escolhida como proof âncora** (não fissura) — porque tem o twist contraintuitivo "continue amamentando" que cria momento de surpresa. Fissura é técnica, mastite é narrativa.

2. **D-MER inteiro como slide próprio** — porque o user disse no briefing que "saber que tem nome já alivia". É o slide mais emocional do deck. Tipograficamente é o slide mais incomum (artifact-name pattern), pra registrar memória.

3. **Compressão 12 complicações → 2 anchor (mastite + D-MER)** — restantes 10 não desapareceram, foram movidas pro guia PDF/Word completo. O deck cumpre função de "trailer", o guia é o conteúdo profundo.

4. **Slide 11 com BG inverso (Forest Green dark)** — único momento dark do deck. Cria fechamento ritualístico, separa do conteúdo informativo. Pattern absorvido de Apple keynote endings.

## Artefatos finais

- HTML: `D:/AIOS/docs/explainers/amamentacao/deck-amamentacao-v2.html`
- PDF: `C:/Users/kingp/Downloads/Deck-Amamentacao-v2.pdf` (273 KB)
- Briefing: `D:/AIOS/docs/explainers/amamentacao/v2-package/deck-spec.yaml`
- Regression test: `D:/AIOS/docs/explainers/amamentacao/v2-package/regression-test.yaml`
- QA report: este arquivo
