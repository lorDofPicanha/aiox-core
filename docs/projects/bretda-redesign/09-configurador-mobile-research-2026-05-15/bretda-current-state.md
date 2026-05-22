# Bretda Configurador 3D — Auditoria do Estado Mobile Atual

**Data:** 2026-05-15
**Agente:** Atlas (Analyst)
**Escopo:** análise estática dos arquivos que sustentam `/configurador` no mobile, à luz do feedback do user ("não consegue clicar na mesa direito" + "seleção de materiais ruim").

---

## 1. Arquitetura — qual configurador o user está vendo?

A rota `/configurador` é renderizada por `apps/bretda-lp/src/app/configurador/page.tsx`. Ela importa **diretamente o `<ConfiguradorLoader>` legacy** (linhas 5 e 84):

> "Sprint 1 ConfiguradorWrapper + ConfiguradorLuxuryPanel removed per user 2026-05-01: cream side-panel was stub-only, hid full options" — `page.tsx:11-15`

Ou seja: a "fallback `ConfiguradorMobileGallery`" descrita em `configurador-wrapper.tsx:42` **NÃO é o que o user vê** em `/configurador`. O Wrapper só roda em `/colecao/[slug]/` (rotas de produto) e, no mobile, troca por uma galeria curada (sem Three.js).

Em `/configurador` o user roda o `Configurador3D` legacy em mobile — Three.js puro, mesmo layout do desktop só que com grid colapsado para 1 coluna (`lg:grid-cols-[1fr_360px]` em `configurador-3d.tsx:169`). Esta é a UI que está com bugs.

---

## 2. Bug #1 — "não consegue clicar na mesa direito" no modo Personalizar

### Onde mora o código

- `configurador-3d.tsx:259` — botão "Personalizar" toggla `customizeMode`.
- `scene.ts:457-482` — `setupInteraction()` registra `pointerdown` + `pointerup` no `renderer.domElement` (canvas Three.js).
- `scene.ts:462-465` — só dispara o raycast se a distância entre pointerdown e pointerup for **< 5 px**:
  ```ts
  if (Math.abs(e.clientX - dp.x) > 5 || Math.abs(e.clientY - dp.y) > 5) return;
  ```

### Quatro causas raiz prováveis (em ordem decrescente de probabilidade)

**B1.1 — Threshold de 5 px sufoca o tap mobile.** No desktop um clique é praticamente 0 px de delta entre down e up. No touch real (especialmente em telas pequenas com dedos médios), há tipicamente jitter de 6–15 px entre `pointerdown` e `pointerup`. **Resultado: o raycast é silenciosamente abortado e o user percebe "não clica".** Esse é o smoking gun #1.

**B1.2 — UI overlay rouba o tap.** O badge "Material selecionado" e os 5 botões de ferramenta (Mover/Reset/Grade/Ambiente/Personalizar) vivem em `absolute top-4 left-4 z-10` sobre o canvas (`configurador-3d.tsx:254-260`). O hint "Clique na parte da mesa" (`configurador-3d.tsx:262-267`) também está em `top-20 left-4 z-10`. **Em telas <420 px de largura, essas pílulas ocupam uma fatia significativa do canvas tappable** — tap no chão da mesa pode estar caindo na div da pílula (que tem `pointer-events: auto` por default).

**B1.3 — Câmera "longe demais" para tap preciso.** Em `scene.ts:269-270`, a câmera é posicionada a `camDist * 0.7` em X/Z e `camDist * 0.5` em Y, onde `camDist = maxTableDim * 2.2`. Para uma mesa de bilhar (≈2,6 m de comprimento), isso projeta a mesa numa fração ainda razoável do viewport. **Mas no aspect-ratio mobile (≈1:1 — `aspect-square` em `configurador-3d.tsx:251`) a mesa fica visualmente pequena.** Tapar com precisão no feltro/madeira/metal específico vira jogo de azar.

**B1.4 — Não há feedback visual de "tap detectado".** Quando o raycast falha (B1.1), nenhum toast/highlight aparece. O user toca, nada acontece, tenta de novo. Não dá pra distinguir "errei a mesa" de "o sistema engoliu o tap".

### Por que isso é especialmente mortal no mobile

OrbitControls (Three.js stdlib) por padrão configura **ONE FINGER = ROTATE** (rotação) e **TWO FINGER = DOLLY+PAN** (zoom + pan). Cada toque na tela é interpretado como "início de uma rotação". Para distinguir "tap quero selecionar" de "drag quero rotacionar", o código usa o threshold de 5 px — mas esse threshold foi calibrado para mouse, não para dedo. Em dispositivo touch, o mesmo pattern precisa de **10–15 px** de threshold (referência: Material Design tap-vs-drag) ou usar `pointercancel` + temporização (300 ms = tap; >300 ms ou >12 px = drag).

---

## 3. Bug #2 — "seleção de materiais é boa ruim" no mobile

### Onde mora o código

- `configurador-3d.tsx:190-207` — `<ConfiguradorPanel>` no aside direito.
- `configurador-panel.tsx:35` — `<aside className="border-t border-border lg:border-t-0 lg:border-l overflow-y-auto max-h-[800px]">`.
- `configurador-panel.tsx:156` — swatches de tecido/madeira/metal em `grid grid-cols-7 gap-2`.
- `configurador-panel.tsx:171` — cada swatch é `h-8 w-8 rounded-full` (= **32 x 32 px**).

### Cinco causas raiz no mobile

**B2.1 — Swatches 32 x 32 px violam o mínimo Apple/Material/Baymard.** Apple HIG exige 44 x 44 pt mínimo; Material Design exige 48 x 48 dp; Baymard recomenda 28 x 28 px (~7 x 7 mm) como **mínimo absoluto** para swatches de cor, e adverte que 57% dos sites falham nesse alvo. **Bretda está 4 px abaixo do mínimo Baymard.** Em swatch circular com gap-2 (8 px), o "perceived target" cai para ~28 px efetivos, e o user precisa mirar com precisão.

**B2.2 — Grid 7 colunas espreme demais em 360-414 px de viewport.** `grid-cols-7` numa largura útil de ~340 px = 48 px por coluna; menos os 8 px de gap = ~40 px efetivos, e dentro disso o swatch 32 px deixa só ~4 px de respiro de cada lado. **Resultado: tap-collateral é altíssimo (dedo abrange 2-3 swatches simultaneamente).**

**B2.3 — Painel rolável "max-h-[800px]" sumir abaixo da fold.** No mobile, `aside` cai abaixo do canvas (`grid-cols-1` em `configurador-3d.tsx:169`). O user precisa rolar para baixo do canvas para encontrar os materiais. Como o canvas tem `aspect-square` (= 1:1 = altura ≈ largura ≈ 100vw em mobile), o painel só começa após **uma tela inteira de scroll**. Em iPhones com viewport curto, o user provavelmente não percebe que o painel existe.

**B2.4 — Falta de "preview do material selecionado" em tela durante o scroll.** Quando o user rola para escolher tecido verde, ele perde a vista do 3D. Não há sticky thumbnail do modelo no topo. Resultado: cada tap em material exige scroll-up para validar a mudança. Loop hostil.

**B2.5 — Nomes de material não aparecem no hover/long-press.** Em desktop, `title={s.name}` mostra tooltip ao hover. Em mobile **não há hover** e `aria-label` só ajuda screen readers. O user não sabe o que "verde escuro nº 4" se chama até clicar. Não há feedback textual confirmando o que ele tocou antes do tap.

### Bugs colaterais associados

- **B2.6** — quando o user está no modo **Personalizar + selecionou uma região da mesa** mas o painel está abaixo da fold, ele precisa rolar para baixo (perdendo o highlight emissivo do material selecionado) só para então tocar o swatch. O fluxo "selecionar região → escolher acabamento" foi pensado pra desktop com dois painéis lado-a-lado. No mobile vira um vai-e-vem.
- **B2.7** — o painel de **Categoria (Sinuca/Pebolim/Tênis/Shuffle)** está como `grid-cols-4` em layout vertical (linhas 38-47), o que dá 4 botões pequenos numa única fileira (perda de espaço útil). Deveria ser horizontal-scroll de chips ou segmented control.

---

## 4. Bug #3 — pílulas de ferramenta competem com o canvas

`configurador-3d.tsx:254-260` empilha 5 botões em `flex-wrap` no `top-4 left-4`. Em mobile cada botão tem ~80-90 px de largura (texto "Personalizar" é longo), então o flex-wrap forma **2 ou 3 linhas** ocupando ~30% da altura útil do canvas. Especialmente combinado com o badge "Material selecionado" (top-20 left-4, max-w-[260px]) e a pílula "Modelo ativo" (bottom-4 left-4), o canvas mobile fica visualmente **cheio de chrome flutuante** que não só atrapalha estética como rouba área tappable.

### Hipótese central

> O configurador foi desenhado e testado com mouse + viewport ≥1024 px. Cada decisão (threshold 5 px, swatches 32 px, pílulas absolute z-10, aside 360 px de largura) faz sentido naquele contexto. **No mobile real, todas elas degeneram simultaneamente em micro-falhas que somadas produzem a impressão de "tudo um pouco ruim".**

---

## 5. Bugs específicos identificados (lista enxuta para handoff dev)

| ID  | Arquivo:linha | Sintoma | Probabilidade de ser a causa |
|-----|--------------|---------|----------------------------|
| B1.1 | `scene.ts:465` | Threshold tap 5 px engole taps no touch | **Alta — primeiro fix a tentar** |
| B1.2 | `configurador-3d.tsx:254-267` | Pílulas overlay roubam área tappable | Média |
| B1.3 | `scene.ts:269-270` | Câmera projeta mesa pequena em aspect 1:1 | Média |
| B1.4 | `scene.ts:482` | Sem feedback de tap-rejected | Baixa (UX, não bug) |
| B2.1 | `configurador-panel.tsx:171` | Swatches 32 px < 44 px touch target | **Alta** |
| B2.2 | `configurador-panel.tsx:156` | `grid-cols-7` em mobile espreme demais | **Alta** |
| B2.3 | `configurador-3d.tsx:169` | Painel cai abaixo da fold no mobile | **Alta — arquitetural** |
| B2.4 | `configurador-panel.tsx` (geral) | Sem sticky preview do 3D durante scroll | Média |
| B2.5 | `configurador-panel.tsx:159-174` | Nome do material só aparece pós-tap | Média |
| B2.7 | `configurador-panel.tsx:38-47` | Categoria como grid-cols-4 desperdiça espaço mobile | Baixa |
| B3 | `configurador-3d.tsx:254` | 5 pílulas flex-wrap dominam o canvas mobile | **Alta — visual + funcional** |

---

## 6. Constatação arquitetural — o `ConfiguradorWrapper`+`MobileGallery` que existe mas não é usado

O time já enxergou esse problema em sprint anterior: criou `configurador-wrapper.tsx` com `<ConfiguradorMobileGallery className="md:hidden" />` (linhas 42-44), comentado como **"Cagan trade-off: real Three.js doesn't work below md — documented"**. Mas essa rota foi removida de `/configurador` em 2026-05-01 porque o painel cream luxury era stub.

**O comentário do time anterior é meio-verdade.** Three.js *funciona* no mobile (OrbitControls suporta touch); o que não funciona é a **UX atual** acoplada ao Three.js. Há dois caminhos não-mutuamente-exclusivos:

1. **Curto prazo** — corrigir os bugs B1.x e B2.x dentro do `Configurador3D` legacy.
2. **Longo prazo** — fazer o `ConfiguradorMobileGallery` ser **realmente bom** (curated gallery + WebAR via `<model-viewer>` + curador CTA) ao invés de fallback estático.

O doc `proposed-fixes.md` cobre ambos.
