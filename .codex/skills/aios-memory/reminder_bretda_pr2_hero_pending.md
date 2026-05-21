---
name: Bretda PRs 1-2-3 PUSHED stacked
description: 28/Abr → PR1+PR2+PR3 PUSHED stacked. Catálogo 12 SKUs categorizados implementado. Próximo: PR4 cleanup + user merge sequencial
type: project
originSessionId: 2df7be6b-1324-4a01-a9a0-779117d9a7d7
---
# Bretda Redesign — PR1+PR2+PR3 PUSHED ✅

## Stack chain (28-29/Abr 2026)

| PR | URL | Branch | Base | Status |
|---|---|---|---|---|
| #1 | https://github.com/lorDofPicanha/bretda-lp/pull/1 | `feat/redesign-foundation-tokens` | `main` | OPEN |
| #2 | https://github.com/lorDofPicanha/bretda-lp/pull/2 | `feat/redesign-hero-rebuild` | PR #1 (stacked) | OPEN |
| #3 | https://github.com/lorDofPicanha/bretda-lp/pull/3 | `feat/redesign-pages-internas` | PR #2 (stacked) | OPEN |
| #4 | https://github.com/lorDofPicanha/bretda-lp/pull/4 | `feat/meta-capi-tracking` | PR #3 (stacked) | OPEN |

**Order de merge** (Path A foundation-first):
1. Merge PR #1 → `main`
2. PR #2 retarget automático para `main` → merge
3. PR #3 retarget automático para `main` → merge

## PR #3 highlights

### 12 SKUs em 4 categorias (sem Paladio defer 1+ ano)

| Categoria | SKUs |
|---|---|
| Sinuca (6) | Âmbar · Opal · Espinela · Aurora · Citrino · Zurita |
| Tênis de Mesa (2) | Citrino · Cobal |
| Shuffleboard (1) | Âmbar |
| Pebolim (3) | Âmbar · Opal · Berilo |

### URL strategy (Opção A — user approved)
- `/colecao` landing com **filter pills** (5: Tudo · Sinuca · Tênis · Shuffle · Pebolim) + 12 cards
- `/colecao/[slug]` slugs únicos `{modelo}-{categoria}` (12 SSG routes)
- `dynamicParams = false` (404 para slugs inválidos)

### Conclave PR3 fixes (5 HIGH + 1 QA HIGH-001)
1. ✅ Product page swatches BEFORE configurador (Norman pattern)
2. ✅ /atelier delete 3-step numerais (redundância com 3 parágrafos)
3. ✅ /atelier typographic hero canvas color 80vh (não Opal_Ambiente — van Schneider)
4. ✅ /colecao/[slug] specs accordion default collapsed
5. ✅ Berilo + Cobal CLICKABLE (têm copy editorial real)
6. ✅ HIGH-001 fix homepage 3 cards link to `*-sinuca` (lookup pattern, single-source-of-truth)

### Copy ship-ready
Todos 12 SKUs com descrição editorial LITERAL do catálogo do user. `src/lib/product-copy.ts` é a single-source-of-truth.

### Dados reais propagados
- **CNPJ**: `54.670.686/0001-57` (footer + COMPANY.cnpj)
- **Cidade**: Blumenau (bug fix `constants.ts: city: "Itajai"` → `"Blumenau"`)
- **Email**: `contato@bretda.com.br` (placeholder confirmado, user "não sei")

### Mind clones consultados (8 total)

**Design conclave PR3** (via design-chief): Norman, Frost, Rams, van Schneider → PROCEED 4/4

**Tech consults** (via MCP brain-bridge — STILL pending Antigravity, OK abandonar):
- sarah-drasner `f5d84c2e-e78e-41e3-b3e5-043042bbc979`
- val-head `fa743750-fa4d-4ab9-9bed-f5267711da06`
- simon-willison `970ba4c8-7281-41cc-a0e4-09ed7592ca46`

(Tech MCPs do PR2 voltaram retroativamente após push — informaram tech consults follow-up. Para PR3, abandonamos esperar — não bloqueador.)

## OPEN ITEMS (resolver antes de DNS switch production)

1. **`RESEND_API_KEY` env var no Vercel** — ausente, leads vão para `vercel logs`
2. **Email confirmation** `contato@bretda.com.br` — não-confirmado (user disse "não sei")
3. **DKIM/SPF setup** se Resend habilitado
4. **Photo Sprint 2** — Pebolim/Tênis/Shuffleboard borrow nearest-family JPGs (Cobal usa Espinela_01, Berilo usa Citrino_01)
5. **ESLint config** `env: { node: true, browser: true }` para resolver 6 `no-undef` em `contato-action.ts` (FormData/process/fetch/console — runtime works, eslint config gap)
6. **PR Meta CAPI** `feat/meta-capi-pricehint-tracking` (412dfb3) ainda local — push só após PR1 mergear

## PR #4 — Cleanup (próximo sprint)

Arquivos a deletar (orfãos pós-PR2/PR3):
- `src/components/organisms/stats-section.tsx`
- `src/components/organisms/cta-section.tsx`
- `src/components/organisms/craftsmanship-section.tsx`
- Keyframe `.whatsapp-pulse` em `globals.css`
- `/sobre` ainda renderiza StatsSection legacy → reconcile
- `src/data/products.ts` legacy manifest /mesas (legacy)

Plus eslint config fix.
