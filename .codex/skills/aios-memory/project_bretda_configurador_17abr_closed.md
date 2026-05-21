---
name: Bretda Configurador 17/Abr — Gaps P0/P1/P2 Fechados
description: Sessão autônoma 17/Abr durante viagem do usuário. Configurador 3D completo no site canônico :8787 com toolbar, tabs, screenshot export e layout viewer-dominante.
type: project
originSessionId: c7136481-c5d4-49c2-8e07-f96af6daf2ba
---
# Bretda Configurador — Fechamento 17/Abr/2026

## Estado final

**Site canônico:** `D:/AIOS/outputs/design-lead/bretda/prototype/` (servido em `localhost:8787` via `python -m http.server 8787`).
**Pasta está no .gitignore** (D:/AIOS/.gitignore:159) — mudanças locais, sem commit.

## Correções aplicadas nesta sessão (via @aios-dev)

### P0 — Toolbar do viewport
- Arquivo: `prototype/index.html:2206-2228`
- Adicionados 5 botões `<button class="tool-btn">`: MOVER / RESET / GRADE / AMBIENTE / PERSONALIZAR, com SVG icons + `aria-pressed` + `role="toolbar"`.
- Handlers em `prototype/assets/configurador-init.js` (+95 linhas). Shortcuts preservados: M/R/G/E/C.
- Adicionado método `toggleMoveMode()` em `prototype/assets/scene.js` (+38 linhas — swap orbit↔pan, NÃO é TransformControls).

### P0 — Botão EXPORTAR SCREENSHOT
- Arquivo: `prototype/index.html` (dentro de `.config-cta-row`, ao lado de "Solicitar Orçamento")
- Chama `sceneCtrl.exportScreenshot('bretda-{modelo}.png')`.

### P1 — UI de classificação de material
- Rewrite do callback `onMaterialSelected` em `configurador-init.js`.
- Badge top-left mostra: nome do material (italic TAN Aegean) + 3 pills TECIDO/MADEIRA/METAL + acabamento aplicado.
- Pill ativa reflete `classifySelection()` do scene.

### P2 — CATEGORIA como tabs horizontais
- Arquivo: `prototype/index.html:2248-2287`
- Estrutura `<div class="cat-tabs" role="tablist">` com 4 `<button role="tab">` (Sinuca/Pebolim/Tênis/Shuffle) + 4 `<div role="tabpanel">` com `hidden` attr.
- Clicar numa mesa em qualquer categoria auto-seleciona a tab correta via `activateCategoryTab()`.

### Layout fix (correção crítica)
- Problema reportado: viewer sumia no scroll porque panel era alto demais.
- Arquivo: `prototype/index.html` (bloco CSS inline ~1200-1700)
- Mudanças:
  - `.configurador` → `min-height: 100vh; padding: clamp(60px, 8vh, 100px)`
  - `.config-wrap` → `grid-template-columns: minmax(0, 1.8fr) minmax(340px, 1fr); align-items: stretch; min-height: min(900px, 85vh)`
  - `.config-viewer` → `aspect-ratio: auto; height: 100%; min-height: 520px`
  - `.config-panel` → `overflow-y: auto; max-height: min(900px, 85vh)` + scrollbar thin cream
  - `.cat-tabs` → `position: sticky; top: 0; z-index: 2; background: sage-deep`
  - Media query `<900px`: volta a stack 1 coluna + aspect-ratio 4/3
- Three.js compat: `scene.js:96-97` já usa `ResizeObserver` + `setSize(w,h,false)` — aspect auto funciona.

## Validação (smoke test autônomo)

HTTP 200 OK em: `/`, `/assets/scene.js`, `/assets/configurador-init.js`, `/assets/tables.js`, `/models/mesa-bretda-sinuca-citrino.glb`, `/images/acabamentos/tecidos/247-24.png`.

DOM refs no markup servido:
- `viewer-toolbar`: 9 matches
- `tool-btn`: 12 matches
- `cat-tab`: 11 matches
- `mat-item`: 47 matches (swatches tecido+madeira+metal)
- `classify-pills`: 1 match
- `btn-screenshot`: 4 matches
- `id="mesa3d"` (canvas): 1 match

## Gaps ainda em aberto (não-bloqueantes)

1. **P1 — Upload GLB de ambiente** (referência `arquiteto.html:445`): hoje só toggla HDRI teste. Arquiteto original permite upload de ambiente customizado.
2. **P2 — Next.js home não expõe configurador**: `apps/bretda-lp/src/app/page.tsx` não importa `<Configurador3D />`. Rota `/configurador` existe mas com `robots: noindex`. Decisão pendente: virar o site oficial ou ficar com o HTML canônico.
3. **TransformControls drag** no modo Mover (hoje só troca câmera pan/rotate). Viraria story separada se for requisito.

## Why

Feedback vinculante "Quality Over Easy Path" (17/Abr): port simplificado do configurador tinha acontecido antes. Desta vez o port foi 1:1 da `arquiteto.html` completa + fix de layout para replicar a imagem-alvo (viewer dominante + panel com scroll interno).

## How to apply

- Site canônico roda em `:8787`. Para subir: `cd D:/AIOS/outputs/design-lead/bretda/prototype && python -m http.server 8787`.
- Site de referência (HTML original completo) em `:8080`. Para subir: `cd D:/AIOS/docs/projects/bretda-landingpage/prototype && python serve-nocache.py`.
- Se usuário quiser promover o Next.js (`apps/bretda-lp/`) a oficial, o trabalho é só importar `Configurador3D` na home `page.tsx` — componente + panel + scene já prontos.
