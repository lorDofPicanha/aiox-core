# Bretda Configurador 3D Mobile — Lista priorizada de fixes

**Data:** 2026-05-15
**Agente:** Atlas (Analyst) — Research only. @aios-dev implementa.

> **Critério de priorização:**
> - **P0** = destrava o feedback original do user ("não clica direito" + "seleção materiais ruim"). Quick wins ≤ 2h dev cada.
> - **P1** = melhoria significativa de UX, 4-16h dev cada, faz o configurador "deixar de ser ruim no mobile".
> - **P2** = elevação para padrão luxury 2026 (refactor maior, AR, R3F).

Cada item lista: **file:line atual / problema / mudança proposta / effort / source-ref do research**.

---

## P0 — Quick wins que destravam o feedback do user (estimado 4-6h total)

### P0-1. Aumentar threshold de tap para 12 px no touch

- **File:line:** `apps/bretda-lp/src/lib/configurador/scene.ts:464-465`
- **Problema:** o threshold atual de 5 px aborta raycast em quase todos os taps mobile (dedos têm jitter natural de 6-15 px entre `pointerdown` e `pointerup`). Esse é o **smoking gun #1** do "não clica direito".
- **Mudança proposta:** detectar se o evento é touch e usar threshold de 12 px; manter 5 px para mouse. Pseudocódigo:
  ```ts
  const isTouch = e.pointerType === "touch";
  const threshold = isTouch ? 12 : 5;
  if (Math.abs(e.clientX - dp.x) > threshold || Math.abs(e.clientY - dp.y) > threshold) return;
  ```
- **Effort:** 15 min.
- **Source ref:** Material Design tap-vs-drag heuristic; [Three.js forum — raycast threshold on mobile](https://discourse.threejs.org/t/raycaster-on-mobile/65703); padrão usado por Threekit, IKEA Kreativ.

### P0-2. Subir touch-target de swatches para 44 px (Apple HIG / Baymard min)

- **File:line:** `apps/bretda-lp/src/components/molecules/configurador-panel.tsx:171`
- **Problema:** swatches estão em `h-8 w-8` (32 px). Abaixo do mínimo Apple HIG (44 pt), Material (48 dp) e até do Baymard recommended-minimum (28 px com gap suficiente, mas com 8 px de gap o tap-collateral é altíssimo). 57% dos sites falham nesse alvo segundo Baymard.
- **Mudança proposta:** breakpoint-responsivo:
  ```tsx
  className={`h-11 w-11 md:h-9 md:w-9 rounded-full ...`}
  ```
  No mobile = 44 px, no desktop = 36 px (mantém densidade desktop). Considerar aumentar para `h-14 w-14` (56 px) se grid for reduzido a 4 cols (ver P0-3).
- **Effort:** 20 min.
- **Source ref:** [Baymard — Make all color swatches available in mobile](https://baymard.com/blog/mobile-interactive-color-swatches); Apple HIG Touch Targets.

### P0-3. Reduzir swatch grid de 7 colunas para 4 colunas no mobile

- **File:line:** `apps/bretda-lp/src/components/molecules/configurador-panel.tsx:156`
- **Problema:** `grid grid-cols-7 gap-2` em viewport 360-414 px deixa só ~40 px efetivos por coluna; combinado com swatch 32 px, dedo médio toca 2-3 swatches simultaneamente.
- **Mudança proposta:** `grid-cols-4 md:grid-cols-7 gap-3`. 4 cols em mobile dá ~80 px/coluna, espaço folgado para swatch 44-56 px + nome textual abaixo (ver P0-4).
- **Effort:** 10 min.
- **Source ref:** Threekit, Vitra, Roche Bobois mobile convergem em 3-4 cols.

### P0-4. Mostrar nome do material abaixo do swatch (não só via `title`)

- **File:line:** `apps/bretda-lp/src/components/molecules/configurador-panel.tsx:157-175`
- **Problema:** `title={s.name}` é tooltip desktop-only. Em mobile, o user não sabe o nome do material até clicar (e mesmo depois, o nome aparece embebido em toast que dura 3s).
- **Mudança proposta:** envolver cada swatch numa flexbox vertical e renderizar `<span className="text-[10px] truncate">{s.name}</span>` abaixo:
  ```tsx
  <div className="flex flex-col items-center gap-1">
    <button ... />
    <span className="text-[10px] tracking-tight text-gray-medium truncate max-w-full">{s.name}</span>
  </div>
  ```
- **Effort:** 30 min (Tailwind + accessibility nudge).
- **Source ref:** Vitra Eames configurator, Threekit demo suite.

### P0-5. Tornar CTAs "Solicitar Orçamento" + "Exportar Screenshot" sticky-bottom no mobile

- **File:line:** `apps/bretda-lp/src/components/molecules/configurador-panel.tsx:89-107`
- **Problema:** CTAs estão dentro do aside rolável; no mobile o user precisa rolar até o fim do painel (depois de 4 sections) para ver "Solicitar Orçamento". 12/12 dos benchmarks luxury mantêm CTA sticky-bottom.
- **Mudança proposta:** extrair os dois Button atoms para um container `fixed md:static bottom-0 left-0 right-0 bg-charcoal/95 backdrop-blur-md border-t border-border p-4 flex gap-2 z-40` (só mobile). No desktop mantém o layout atual dentro do aside.
- **Effort:** 45 min (cuidar com z-index conflito com navbar + safe-area-inset-bottom para iPhone notch).
- **Source ref:** Aston Martin, Porsche, Roche Bobois, Article — todos sticky-bottom.

### P0-6. Pausar OrbitControls auto-rotate (se houver) no primeiro touch

- **File:line:** N/A — Bretda hoje **NÃO tem auto-rotate**. Quick-add opcional dentro do mesmo PR de P0.
- **Mudança proposta:** adicionar `this.orbitControls.autoRotate = true; this.orbitControls.autoRotateSpeed = 0.4;` em `scene.ts` initScene e desativar no primeiro `pointerdown`. Loop de showcase silencioso (8-15s para uma volta completa).
- **Effort:** 25 min.
- **Source ref:** Aston Martin, Roche Bobois, Spline default.

---

**Total P0:** ~2h30min dev. Resolve direto o feedback do user.

---

## P1 — Refactor mobile dirigido (estimado 16-32h, ~2-3 sprints)

### P1-1. Mover painel para bottom-sheet com snap-points no mobile

- **File:line:** `apps/bretda-lp/src/components/organisms/configurador-3d.tsx:169-209` (refactor de layout) + criar `apps/bretda-lp/src/components/molecules/configurador-bottom-sheet.tsx` (novo).
- **Problema:** painel "cai abaixo da fold" no mobile. User precisa rolar a página inteira para ver materiais, perdendo vista do 3D. **Padrão #1 unânime** dos benchmarks (8/12 brands).
- **Mudança proposta:** no breakpoint `<md`, substituir o aside por um bottom-sheet com 3 snap-points:
  - **peek (30vh)** — mostra só a barra de "Material aplicado: Verde Esmeralda" + drag-handle.
  - **expand (60vh)** — mostra category tabs + 4 swatches.
  - **full (95vh)** — mostra tudo (incluindo modelos por categoria).

  Biblioteca recomendada: [vaul](https://vaul.emilkowal.ski/) (1.5kb gzip, by Emil Kowalski, Next.js-friendly, mantida) ou [react-modal-sheet](https://github.com/Temzasse/react-modal-sheet). Já são usadas por Shopify, Linear, Cal.com.
- **Effort:** 8-12h dev (lib install + refactor layout + ajustar drag em coexistência com OrbitControls touch).
- **Source ref:** Material Design 3 Bottom Sheets, Threekit demos, Roche Bobois mobile, 3D Cloud Marxent.

### P1-2. Substituir 5 pílulas overlay por toolbar consolidada inferior

- **File:line:** `apps/bretda-lp/src/components/organisms/configurador-3d.tsx:254-260`
- **Problema:** 5 botões em `top-4 left-4 flex-wrap` cobrem ~30% da altura do canvas no mobile e roubam área tappable (B1.2, B3).
- **Mudança proposta:** consolidar em **bottom-toolbar fixa de 4 ícones** (sem texto, só ícone + tooltip): Mover, Resetar, Grade, Personalizar (remover "Ambiente" — feature secundária ou colocar em overflow menu de 3 dots). Toolbar fica num strip horizontal de 56 px de altura, embaixo do canvas, acima do bottom-sheet handle.
- **Effort:** 3-4h (sourcing de icones consistentes com 11Ravens design language; provavelmente lucide-react já está no projeto).
- **Source ref:** IKEA Kreativ (bottom toolbar 4 ícones), Threekit, 3D Cloud Marxent.

### P1-3. Camera-tap-to-isolate quando user toca uma região no Personalizar

- **File:line:** `apps/bretda-lp/src/lib/configurador/scene.ts:495-507` (`selectMaterialOnMesh`).
- **Problema:** ao tocar uma região, o highlight emissivo é discreto demais; user pode não perceber feedback. E o bottom-sheet não fica filtrado para o tipo de material relevante.
- **Mudança proposta:** quando `selectMaterialOnMesh()` dispara:
  1. Manter highlight emissivo (já existe).
  2. **NOVO:** animar `orbitControls.target` para o centro do mesh tocado + reduzir distance para 80% do atual (zoom suave de ~600ms).
  3. **NOVO:** emitir evento para o bottom-sheet abrir no estado `expand` + filtrar a tab para o `getClassification(mat)` (se já classificado) ou mostrar as 3 opções (tecido/madeira/metal) com bias visual no provável.
- **Effort:** 6-10h (animação tween com `gsap` ou native lerp; coordenação com bottom-sheet state machine).
- **Source ref:** Threekit, 3D Cloud Marxent ("Smart Focus" feature), IKEA Kreativ.

### P1-4. Substituir grid de Categoria por chips horizontais scrolláveis

- **File:line:** `apps/bretda-lp/src/components/molecules/configurador-panel.tsx:38-47`
- **Problema:** `grid-cols-4` para Categoria desperdiça espaço mobile e força quebra de texto curta ("Pebol.", "Tenis"). Não escala para futuro (Bilhar Inglês, Snooker, etc).
- **Mudança proposta:** `<div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">` com chips em cards `flex-shrink-0 min-w-[88px] h-10 px-4 rounded-full`. Padrão "segmented control horizontal scrollable" (Tesla, Porsche, Threekit).
- **Effort:** 1h.
- **Source ref:** Tesla Model 3 configurator (Trim/Paint/Wheels chips), Threekit.

### P1-5. Sticky preview 3D no header do bottom-sheet quando scroll

- **File:line:** novo no `configurador-bottom-sheet.tsx` (P1-1 dep).
- **Problema:** mesmo com bottom-sheet, quando user expande para `full`, perde o 3D. Material-view-loop pede que ele veja preview do material aplicado.
- **Mudança proposta:** no estado `full` do bottom-sheet, manter um strip de 60 px no topo do sheet com mini-canvas (thumbnail do modelo, frame estático snapshotado on-demand a cada applyFabric/Wood/Metal). Não roda Three.js no thumbnail, só atualiza screenshot.
- **Effort:** 4-6h (dep de P1-1).
- **Source ref:** Threekit "always-visible-product-preview" pattern, IKEA Kreativ AR-mode persistent header.

### P1-6. Visual feedback "tap rejeitado" quando raycast falha

- **File:line:** `apps/bretda-lp/src/lib/configurador/scene.ts:472-481`
- **Problema:** quando user toca uma região do canvas que NÃO é mesh (chão, ar), nada acontece. No mobile com taps trêmulos, isso parece "o sistema engoliu o tap".
- **Mudança proposta:** se raycast retorna `hits.length === 0` e `customizeMode === true`, emitir toast "Tente tocar diretamente na mesa" + breve overlay com pulse animation no canvas (200ms cream/10).
- **Effort:** 1h.
- **Source ref:** Nielsen Norman feedback heuristic; pattern padrão em mobile games (tap-rejected animations).

---

**Total P1:** ~25-35h dev. Configurador mobile passa de "ruim" para "bom padrão indústria 2026".

---

## P2 — Elevação para padrão luxury 2026 (estimado 40-80h, multi-sprint)

### P2-1. Adicionar WebAR via `<model-viewer>` Google web component

- **Onde:** novo componente `apps/bretda-lp/src/components/organisms/model-viewer-ar.tsx`, montado no bottom-sheet do mobile como **2ª tab** ao lado do "Configurar".
- **Problema:** AR mobile é hoje **expected, não diferenciador** em furniture luxury. Wayfair, IKEA, Article, Pottery Barn já têm. Bretda não.
- **Mudança proposta:**
  ```tsx
  <model-viewer
    src="/3d/opal.glb"
    ios-src="/3d/opal.usdz"
    ar ar-modes="webxr scene-viewer quick-look"
    camera-controls touch-action="pan-y"
    auto-rotate auto-rotate-delay="2000"
    shadow-intensity="1"
    poster="/3d/opal-poster.webp"
  >
    <button slot="ar-button" className="...">Veja na sua sala</button>
  </model-viewer>
  ```
  Requer gerar `.usdz` para iOS (Reality Composer ou Apple's `usdz_converter`). Já existe `.glb` para todas as mesas em `lib/configurador/tables.ts`.
- **Effort:** 12-16h (lib install + usdz conversion pipeline + UX integration + testar Android+iOS reais).
- **Conversion impact (source):** [Rebecca Minkoff +65% purchase intent](https://developers.google.com/ar/develop/webxr/model-viewer); [Gunner Kennels +40% conversion](https://developers.google.com/ar/develop/webxr/model-viewer); [TouchTry WebAR PDP report](https://touchtry.com/blogs-webar-for-furniture-stores/).
- **Source ref:** Google `<model-viewer>` docs, Crystallize furniture configurator guide, Wayfair production stack.

### P2-2. Refactor para React Three Fiber + Drei + Valtio

- **Onde:** refactor de `scene.ts` (650 linhas vanilla Three.js) para componentes R3F declarativos.
- **Problema:** o `scene.ts` atual é imperativo, framework-agnostic, com state management via callbacks. Isso funciona mas torna feature-work (P1-3 camera-tap-to-isolate, etc.) custosa porque qualquer nova interação precisa expor método imperativo + callback.
- **Mudança proposta:**
  - Migrar para `@react-three/fiber` v8 + `@react-three/drei` (OrbitControls, useGLTF, Center, useTexture).
  - Migrar state para `valtio` (proxy reativo, melhor que zustand para state de scene 3D).
  - Usar `@react-three/postprocessing` para outline emissive (selectedMesh fica muito mais bonito).
- **Prós:** Component-driven, easier feature-work, melhor concorrência com React 19, suspense-friendly para GLB loading, hot-reload de scene.
- **Contras:** Bundle +50-80kb gzip (R3F+Drei são pesados). Risco de regressão em modelos GLB carregados. Curva de aprendizado para o time se nunca usaram.
- **Effort:** 40-60h (refactor completo + tests Playwright para garantir parity).
- **Recomendação:** **NÃO fazer Phase 3 agora.** Custo/benefício ruim no curto prazo. Só executar se houver tração comprovada do configurador (≥ 5% dos visitors mobile chegam ao step "Solicitar Orçamento" pós-P0+P1). Hoje o configurator está cravado em rota secundária; o investimento maior precisa de validação primeiro.
- **Source ref:** [R3F docs](https://r3f.docs.pmnd.rs/), [Threekit React Dev Kit Figma](https://www.figma.com/community/file/1027317639278516141), [graffersid R3F vs Three.js 2026](https://graffersid.com/react-three-fiber-vs-three-js/).

### P2-3. Save configuration + share link (Aston Martin pattern)

- **Onde:** novo `apps/bretda-lp/src/lib/configurador/share.ts` + endpoint `/api/configurations` (GET/POST).
- **Problema:** user customiza, fecha aba, perde tudo. Furniture é compra **consultiva familiar**: precisa compartilhar com cônjuge/arquiteto.
- **Mudança proposta:** serializar state (model + fabric + wood + metal + custom material assignments) num URL param compactado (LZ-string base64) + opcional persist em DB com slug (`bretda.com.br/c/abc123`). CTA "Compartilhar" no sticky-bottom abre share sheet nativo.
- **Effort:** 10-14h.
- **Source ref:** Aston Martin, Porsche, IKEA Kreativ — todos têm save+share.

### P2-4. WhatsApp-handoff direto do configurador (Brazil luxury)

- **Onde:** ajuste no botão "Solicitar Orçamento" (P0-5).
- **Problema:** ele leva pra `/contato`. User mobile no Brasil quer **WhatsApp imediato** com a configuração já anexada. Roche Bobois faz isso.
- **Mudança proposta:** botão expande em 2: "WhatsApp atelier" (preenche mensagem com link da configuração salva + screenshot) + "Form" (legacy `/contato`).
- **Effort:** 3-4h (depende de P2-3).
- **Source ref:** Roche Bobois, KR Interiores (interno Synkra), padrão luxury Brasil.

---

**Total P2:** ~65-95h. Configurador mobile vira **referência do segmento** (não só "ok", mas best-in-class para luxury furniture Brasil).

---

## Resposta direta às 4 perguntas do critério de sucesso

### 1. "Como Aston Martin (referência Bretda) resolve material picker mobile?"

**Bottom-anchored horizontal strip de swatches grandes (~56 px) com nome textual visível, agrupados por categoria com segmented control horizontal scrollable acima. Auto-rotate hero que pausa no primeiro touch. Sticky bottom CTA "Salvar configuração". Sem AR — Aston aposta em fotorrealismo Unreal Engine + RTX. Update Oct/2025 destacou "interactions are clearer and visual responses help to make choices informed and quick" — confirmando o foco em feedback visual imediato.**

Fontes: [Aston Martin oct/2025 announcement](https://www.astonmartin.com/en/our-world/news/2025/10/16/aston-martin-unveils-new-configurator-that-sets-the-standard-for-automotive-digital-products); [duPont REGISTRY analysis](https://news.dupontregistry.com/blogs/aston-martin-news/discover-aston-martins-all-new-virtual-vehicle-configurator).

### 2. "Qual é o pattern padrão luxury 2026 pra touch rotation + UI overlay?"

**Bottom-sheet com snap-points (peek/expand/full) — 8 das 12 brands analisadas. Material Design 3 formalizou. Vaul ou react-modal-sheet são as libs canon (1-2kb, mantidas).** Toolbar de ferramentas fica fixa inferior como strip horizontal de 4-5 ícones, NÃO como pílulas overlay no canvas. CTA principal sticky-bottom com preço/total visível. Auto-rotate 8-15s ao entrar, pausa no touch. Touch-target swatches 44-56 px (Apple HIG min).

Fontes: [Material Design 3 — Bottom sheets](https://m3.material.io/components/bottom-sheets/overview); [Threekit demos](https://www.figma.com/community/file/1027317639278516141); [3D Cloud Marxent product page](https://3dcloud.com/products/3d-product-configurators/).

### 3. "3 fixes que destravam 'não clica na mesa direito' em 2h dev?"

1. **P0-1** — threshold tap 5 → 12 px no `pointerType === "touch"` (15 min) — **smoking gun #1**.
2. **P0-2 + P0-3** — swatches `h-8 w-8 grid-cols-7` → `h-11 w-11 grid-cols-4` no mobile (30 min combinado).
3. **P0-5** — sticky-bottom CTA "Solicitar Orçamento" + "Exportar Screenshot" (45 min).

Total: 1h30. Mesmo se executar apenas P0-1 isolado (15 min), o user vai sentir diferença imediata no "clicar na mesa direito".

### 4. "Refactor pra R3F valeria pra Bretda Phase 3?"

**Não agora. Sim em 3-6 meses condicional à tração.** Prós: declarativo, melhor concorrência React 19, suspense-friendly, hot-reload, feature-work mais barato. Contras: +50-80kb bundle, 40-60h dev, risco de regressão GLB, curva de aprendizado. **Recomendação:** primeiro destravar P0 + P1 (que mantêm `scene.ts` intacto), medir engagement mobile real (eventos GA4 "configurator_step_completed"), e só refatorar para R3F se ≥5% dos visitors mobile chegarem a "Solicitar Orçamento". Hoje o configurator parece cravado em rota secundária e investir 60h sem validação seria má alocação de recursos vs P2-1 (AR via `<model-viewer>`, 12-16h, conversion impact 40-65%).
