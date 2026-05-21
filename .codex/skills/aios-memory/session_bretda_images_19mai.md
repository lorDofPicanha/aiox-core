---
name: session-bretda-images-19mai
description: "Bretda site asset replacement 19/Mai — substituição completa de renders, fix 5 bugs visuais, PR"
metadata: 
  node_type: memory
  type: project
  originSessionId: de3c8507-1265-4599-a8b3-14247f7bcb2f
---

# Bretda Site — Image Replacement 19/Mai/2026

## Status
🟢 **MERGED + DEPLOYED (2 PRs)**.

**PR #19** (asset replacement Paulinho ZIPs) — mergeado 19/Mai 18:35 UTC, commit `9dd38dc`.
**PR #20** (7 visual fixes follow-up) — mergeado 19/Mai 22:12 UTC, commit `8719876`. Fixes: hero text reduzido (mesa visível mobile), cards home voltam pra lifestyleImage, cards /colecao com PNG transparente, /colecao/[slug] hero não cortado, 6 madeiras 404 (case sensitivity Linux) renomeadas pra minúsculo, footer "Os mestres" removido, smoke test infra 7/7 PASS.

Schema models.ts atual: `lifestyleImage` (ambient — home + detail hero) + `cardImage` (white-bg — reservado) + `transparentImage` (PNG alpha — /colecao listing). Backup `.deprecated-assets-pre-2026-05-19/` mantido local (gitignored).

**CI caveat:** Quality Gates falha no step Lighthouse CI (bug preexistente — também falhou no Google OC PR 16/Mai). Erro: "Could not find a production build in the '.next' directory" depois do download artifact. Não bloqueou merge porque os outros 3 jobs do workflow passaram (Lint+TS, WCAG, Next.js build). Investigar separadamente quando der.

## What happened

User reportou "imagens feias e distorcidas, mobile horrível". Dropou 2 ZIPs Paulinho em `C:\Users\kingp\Downloads\`:
- ZIP 001 (final, 36 imgs 3508×2479): 6 sinuca SKUs × 3 produto + 3 ambiente
- ZIP 002 (temp, 7 imgs 1500×1060): 3 pebolim + 3 ping-pong + 1 shuffleboard (genéricas por categoria)

Audit mobile Quinn de 15/Mai já tinha resolvido P0-1 a P0-5 (hotfixes em `origin/main`). Os bugs residuais identificados nesta sessão:

| # | Bug | Local |
|---|---|---|
| B1 | 6× 404 em `configurador-mobile-gallery` | `/img/colecao/{slug}-card.jpg` nunca existiu |
| B2 | Cards cropados ~50% laterais | aspect 4:5 portrait + lifestyle landscape 1.415:1 |
| B3 | Mesas em tamanhos disparates `/colecao` | orbit PNGs heterogêneos em slot 1:1 contain |
| B4 | Categoria-thumbs inconsistentes | 5 PNGs ratios 1.48:1 a 3.27:1 |
| B5 | Galeria detalhe pegava arquivos errados | `modeloSlug` ao invés de `assetSlug` |

## Pipeline

`scripts/process-new-renders.mjs`: resize 3508→1600w + JPG 85 mozjpeg → 184MB → 5.2MB (-97%). `scripts/generate-category-thumbs.mjs`: 5 categoria-thumbs uniformes 600×600 via center-crop.

## Schema cleanup (`src/lib/models.ts`)

**Removed:** `productImage`, `whiteImage`, `cardImage`, `SKUS_WITHOUT_LIFESTYLE`, `getCardImage()`
**Added:** `assetSlug` field unificando path lookup (sinucas = modeloSlug, não-sinucas = slug)

## Asset layout final

- `/img/colecao/{ambar|opal|espinela|aurora|citrino|zurita}/` — 3 produto + 3 ambiente cada (sinucas, ZIP 001)
- `/img/colecao/{citrino|cobal}-tenis-de-mesa/` — 1 produto + 1-2 ambiente (Ping_Pong)
- `/img/colecao/ambar-shuffleboard/` — 1 produto + 1 ambiente (SHUFFLEBOOARD_01)
- `/img/colecao/{ambar|opal|berilo}-pebolim/` — 1 produto + 1 ambiente (Pebolim_01/02/03)

## Validation

- Build production: ✅ 31 páginas geradas, 0 erros
- Smoke test Pixel 7 (`tests/smoke-images-2026-05-19.spec.ts` + `playwright.smoke.config.ts`): **6/6 rotas PASS, 0 imagens 4xx, 0 horizontal overflow**
- TypeScript: ✅ 0 erros
- ESLint: ✅ 0 erros (5 warnings pré-existentes)

## Configurador 3D — INTACTO

User mandate: "quero manter o configurador". `scene.ts` + `configurador-3d.tsx` + `ConfiguradorLoader` UNTOUCHED. Route `/configurador` renderiza `ConfiguradorLoader` direto. `ConfiguradorWrapper` + `ConfiguradorLuxuryPanel` + `ConfiguradorMobileGallery` são órfãos desde 1/Mai, mantidos por hygiene mas não chegam a renderizar em prod.

## Backup local

`.deprecated-assets-pre-2026-05-19/colecao/` + `.deprecated-assets-pre-2026-05-19/categoria-thumbs/` (7.7MB, gitignored). Restore: `cp -r .deprecated-assets-pre-2026-05-19/. public/img/`.

## Triggers
- `verifica preview bretda` — após PR #19 ganhar preview URL Vercel, validar visualmente em mobile
- `merge pr 19 bretda` — após validação OK, merge para main
- `restore assets bretda` — reverter pra .deprecated/ se algo der errado
- `regenera category thumbs bretda` — re-rodar `scripts/generate-category-thumbs.mjs` se trocar source

## Related
- [[session_bretda_full_day_15mai]] — Bretda Meta+Google traffic ops
- [[session_bretda_audit_full_07mai]] — audit traffic-masters
- [[reminder_google_oc_api_eol_15jun]] — Bretda Google OC pipeline (resolved)
