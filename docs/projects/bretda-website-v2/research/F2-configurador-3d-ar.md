# F2 — Configurador 3D / AR de produto high-ticket (Bretda Website V2)

**Frente:** 2 de N (mega-pesquisa dev-ready — novo site Bretda)
**Agente:** Atlas (Analyst), AIOS Synkra
**Data:** 2026-06-24
**Escopo:** STACK técnico + WebAR + asset pipeline + decisão **build-vs-buy** (aprofundamento das áreas que o doc 2026-05-15 tocou de leve).
**Método:** WebSearch + WebFetch a docs oficiais e case studies com números, triangulação ≥3 fontes por claim decisório, scoring de fontes.
**Conteúdos analisados:** **18** (8 WebSearches dirigidas + 3 WebFetch deep-read de páginas primárias + 2 docs internos pré-existentes lidos integralmente + ~5 vendor/case pages cruzadas nos resultados). Bibliografia anotada na §9.

> **Relação com o doc anterior** (`docs/projects/bretda-redesign/09-configurador-mobile-research-2026-05-15/`): aquele doc já resolveu UX-patterns (bottom-sheet, sticky-CTA, touch-target, smart-focus) e a auditoria de bugs com `file:line`. **NÃO repito.** Esta F2 estende: comparação de stack com tradeoffs de custo/perf/manutenção, AR com números triangulados, asset pipeline a partir de `.skp`/CAD, SEO/Core Web Vitals de páginas 3D, e a **matriz build-vs-buy com análise de sensibilidade** — mais a tese/antítese/síntese da hipótese contrária H3.

---

## 0. TL;DR para decisão

1. **Stack recomendado: manter `<canvas>` Three.js, evoluir para React Three Fiber (R3F) + Drei + Valtio + `<model-viewer>` para AR.** NÃO migrar para SaaS (Threekit/Emersya). Justificativa em §2/§6.
2. **AR ("veja no seu cômodo") VALE — é o melhor ROI de toda a frente.** Números reais triangulados (Shopify +94% conv. médio; Rebecca Minkoff +65% likelihood-to-purchase em AR; Gunner Kennels +40% order-conversion / −5% return). Custo: dias, não meses, via `<model-viewer>` que **auto-gera USDZ on-the-fly**. §3.
3. **Build-vs-buy: BUILD (com componentes open-source maduros).** Para 28 SKUs num único produto, o break-even pende para build: SaaS enterprise (Threekit) é $30k–$100k/ano + $500–$5k/modelo, opaco e "demo-only" hoje. §6 + análise de sensibilidade.
4. **Hipótese contrária H3 ("3D é custo sem ROI vs galeria editorial + WhatsApp"): PARCIALMENTE PROCEDE — e a síntese a incorpora.** O configurador 3D pesado não é o que move ROI; **AR + fotorrealismo + WhatsApp-handoff** é. Veredito honesto em §7.
5. **SEO/Vitals: 3D só é seguro se a página renderizar HTML+SSR significativo primeiro e o WebGL for lazy atrás de poster.** §5.

---

## 1. UX 2026 — table stakes vs diferenciadores (delta sobre o doc anterior)

O doc 2026-05-15 já mapeou 10 patterns dominantes. Consolido aqui a **classificação table-stakes vs diferenciador**, que é a pergunta decisória nova:

| Pattern | Status 2026 | Evidência |
|---|---|---|
| Sticky-bottom CTA + preço dinâmico | **Table stakes** (12/12 brands) | doc anterior §2; unânime |
| Bottom-sheet com snap-points | **Table stakes** (8/12; Material 3 formalizou) | doc anterior; [m3.material.io] |
| Touch-target swatch ≥44px + nome sempre visível | **Table stakes** (Apple HIG/Baymard) | [Baymard] |
| Auto-rotate hero + pause-on-touch | **Quase table-stakes** (~30%, mas barato) | doc anterior |
| AR "view in your room" | **Era diferenciador, virou expected** | §3 |
| Camera-tap-to-isolate (smart focus) | **Diferenciador real** (Threekit/3D Cloud/IKEA) | doc anterior §4 |
| Save/share configuration (link) | **Diferenciador real** (Aston Martin) | doc anterior |
| Fotorrealismo PBR (madeira+feltro convincente) | **Diferenciador real e DECISIVO no luxo** | §4 |

**Leitura estratégica para Bretda:** os table-stakes são CSS/UX (baixo custo, já especificados no doc anterior). Os **diferenciadores reais que justificam investimento** são três: (a) **AR**, (b) **fotorrealismo PBR**, (c) **save/share + WhatsApp-handoff**. O "configurador 3D girável" em si é table-stakes barato — não é onde está o ROI. Isso já antecipa a síntese de H3.

---

## 2. Stack técnico — comparação com tradeoffs concretos

### 2.1 Three.js puro (r162) vs R3F + Drei + Valtio

| Critério | Three.js puro (atual) | R3F + Drei + Valtio |
|---|---|---|
| **Bundle** | ~462 KB | ~1.035 KB (≈ +570 KB pela camada React) — [creativedevjobs/graffersid] |
| **Perf runtime** | baseline | "dentro de poucos %" do vanilla; reconciler roda fora do loop; `useFrame` = mesmo `rAF` — [creativedevjobs] |
| **DX / feature velocity** | imperativo, verboso, `scene.ts` 650 linhas | declarativo; Drei dá `<OrbitControls>`, `<Environment>`, `<Bounds>`, AR helpers prontos |
| **State de config** | acoplado à cena | **Valtio** = proxy reativo desacoplado (config ↔ render), ideal para preço dinâmico + share-link |
| **Manutenção** | toda lógica custom | ecossistema pmndrs mantém Controls/loaders/AR |
| **Risco de migração** | — | regressão de GLB/materiais; 40–60h dev (estimado no doc anterior P2-2) |

**Veredito stack:** o **+570 KB do R3F é o único contra material** — e é mitigável (lazy-load atrás de poster, code-split, o canvas não está no caminho do LCP, §5). Em troca, ganha-se DX que torna **AR + smart-focus + save/share** baratos de construir. Para um site cujo configurador é peça central e vai receber feature-work contínuo, **R3F + Drei + Valtio é a escolha certa** — mas só **depois** de instrumentar e validar que o configurador tem uso (ver gate em §6/§7). No curto prazo, os P0/P1 do doc anterior já entregam 80% do valor sobre o `scene.ts` atual sem migrar.

### 2.2 `<model-viewer>` (Google) — papel no stack

Não é concorrente do Three.js/R3F; é **complementar e cirúrgico para AR**. Web component, "viewer + AR em 20 linhas de HTML", ARCore (Android/Scene Viewer) + AR Quick Look (iOS) com **detecção de plataforma automática** e **geração de USDZ on-the-fly** — [modelviewer.dev]. **Recomendação:** usar `<model-viewer>` **apenas** para o botão "Ver no seu cômodo" e, opcionalmente, como fallback low-end (§5), enquanto o configurador interativo segue em Three.js/R3F. Isto evita reescrever o configurador inteiro só para ter AR.

### 2.3 Plataformas SaaS — quando valeria buy

| Plataforma | Perfil | Custo (triangulado) | Fit Bretda |
|---|---|---|---|
| **Threekit** | enterprise, milhões de combinações, virtual photography | "from $999/mo" legado → **$30k–$100k+/ano** + **$500–$5k/modelo**; hoje **demo-only** (sem preço público) — [cpq3d; threekit.com] | Baixo — opaco, caro, over-engineered p/ 28 SKUs |
| **Emersya** | francês, luxo/premium, DTC, SKU count baixo, perf forte | sem preço público ("no standard guidelines", consultivo) — [emersya] | **Médio** — perfil "luxo premium poucos SKUs" casa com Bretda; mas lock-in + custo opaco |
| **3D Cloud (Marxent)** | enterprise furniture, room composer | enterprise, não publicado | Baixo — escala enterprise |
| **Cylindo/Zakeke** | mid-market e-commerce | Zakeke **€19/mo → €459+/mo** — [cpq3d] | Médio p/ MVP barato; menos "luxo" |
| **Spline** | design-tool, showcase, runtime próprio | freemium → planos pagos | Baixo p/ configurador real (frágil, doc anterior nota Bretda-applicability=2) |
| **Roomle / Expivi / Tacton** | room/CPQ industrial | €99–€500/mo / €50k+/ano — [cpq3d] | Baixo |

**Quando buy venceria:** se a Bretda **não tivesse** equipe dev capaz de manter WebGL, OU precisasse de virtual-photography em escala (centenas de SKUs gerando milhares de imagens), OU quisesse time-to-market de semanas sem dev. **Nenhuma dessas condições se aplica** — a Bretda já tem o configurador em Three.js r162 funcionando e dev no projeto.

---

## 3. WebAR "veja no seu cômodo" — estado da arte + ROI triangulado

### 3.1 Implementação (estado da arte)
`<model-viewer>` é o padrão de fato: você fornece **GLB** (preview 3D + AR Android via Scene Viewer); o componente **auto-gera USDZ** para **AR Quick Look iOS** (ou você pré-fornece `.usdz` para controle fino). Desktop → viewer interativo. Um componente, três experiências, **zero JS custom** — [modelviewer.dev FAQ]. Alvo de tamanho: GLB final **< 5 MB** para móveis típicos; **> 15–20 MB cria problemas reais de usabilidade mobile** — [orbe3d].

### 3.2 Impacto de conversão — números reais com fonte (triangulado)

| Fonte | Métrica | Número | Autoridade |
|---|---|---|---|
| Shopify (oficial, Shop channel) | conversion lift médio ao adicionar 3D | **+94%** | Alta (1st-party plataforma) |
| Rebecca Minkoff (via Shopify) | likelihood-to-order após **3D** | **+27%** | Alta |
| Rebecca Minkoff (via Shopify) | likelihood-to-order após **AR** | **+65%** | Alta |
| Gunner Kennels (Shopify case, VP Marketing on-record) | order-conversion / cart-conv / return | **+40% / +3% / −5%** | Alta (case oficial, citação nominal) |
| Wayfair/Shopify/Macy's/Magna trials | redução de devoluções com AR | **−35% a −64%** | Média-alta (agregado) |

**Triangulação:** o claim "AR melhora conversão materialmente" é sustentado por **fonte 1st-party de plataforma (Shopify +94%)** + **case nominal on-record (Gunner +40%)** + **par 3D-vs-AR isolado (Rebecca Minkoff 27% vs 65%, mostrando que o AR é o que dá o salto, não o 3D sozinho)**. Os números absolutos são marketing-flavored e auto-selecionados (sobrevivência) — **trate como direção e magnitude, não como garantia**. Mesmo descontando metade, o ROI de AR continua o melhor da frente.

**Nota de aplicabilidade ao ticket Bretda (R$11k–27k+):** os cases são de ticket muito menor (kennel, sapato, sofá). O mecanismo causal — **reduzir incerteza de tamanho/encaixe no ambiente** — é **mais** relevante para uma mesa de sinuca de 2,5m num living do que para um sofá. A objeção "tamanho na sala" é literalmente a #1 do comprador de mesa de bilhar. AR ataca diretamente a maior fricção de compra do nicho. Confiança: **alta** no mecanismo, **média** na magnitude exata.

---

## 4. Render / asset pipeline (madeira + feltro fotorrealista, de `.skp`/CAD → web)

Pipeline recomendado (cada etapa com fonte em §9):

1. **Origem:** modelos `.skp`/CAD existentes → exportar/retopologizar. CAD é denso demais para web; **retopo + decimação** obrigatórios.
2. **PBR materials:** metallic-roughness glTF (madeira = albedo+normal+roughness+AO; feltro = albedo+normal+roughness com micro-fuzz no normal). glTF foi "o primeiro formato a padronizar PBR" — [modelviewer.dev].
3. **Bake:** AO e detalhes high-poly → texturas, para baixar geometria sem perder leitura visual.
4. **Polígonos:** manter **< 100k triângulos** por modelo de móvel — [orbe3d].
5. **Mesh compression — Draco:** "10 MB GLB → < 2 MB, sem perda visível". Maior alavanca após reduzir poly/textura — [orbe3d].
6. **Texturas — KTX2 (KHR_texture_basisu):** suportado nativamente por Three.js e model-viewer; pouco ganho de **arquivo** vs JPEG, mas **reduz drasticamente GPU-RAM** e acelera upload p/ GPU — crítico p/ não estourar RAM em mobile — [orbe3d/modelviewer].
6. **Alvos finais:** GLB **< 5 MB**; USDZ similar. Khronos Asset Creation Guidelines 2.0 (2025) reforçam Draco/Meshopt + auditoria de assets — [search SEO].
7. **AR:** GLB serve Android; USDZ gerado on-the-fly pelo model-viewer p/ iOS (ou pré-bakar p/ qualidade controlada).

**Implicação Bretda:** o gargalo não é código, é **produção de assets**. 28 SKUs × (madeiras × feltros) = muitas variantes. **Não modelar cada combinação** — modelar 1 GLB por chassi e **trocar material em runtime** (PBR swap), exatamente o que o `tables.ts` atual já faz. O custo real de "buy" SaaS é justamente o **$500–$5k/modelo** — que a Bretda pode internalizar usando o pipeline acima + ferramentas de IA já no arsenal do founder (image-studio/Flux) para texturas de madeira/feltro.

---

## 5. Performance & SEO de páginas com 3D

- **Targets Google 2026:** LCP < 2,5s · INP < 200ms · CLS < 0,1. Falhar = demotion em search **e** em citações de IA — [mewastudio/techcognate].
- **Regra de ouro:** "search engines veem o HTML ao redor do canvas, não os pixels". **Renderize HTML+heading+SSR significativo ANTES do WebGL**, depois enhance — [utsubo]. (Isto valida o fix de CRO `configurador-detalhes-ssr.tsx` que já existe no projeto.)
- **Lazy WebGL atrás de poster:** canvas lazy atrás de imagem estática → mobile fraco ainda recebe **~1,8s LCP**. **Nunca** lazy-load no elemento LCP; usar `fetchpriority="high"` no poster — [dev.to/cubitrek].
- **Fallback low-end:** WebP de alta qualidade capturado de um frame em breakpoints mobile/low-power; só hidratar o canvas sob interação.
- **Next.js:** `next/dynamic` com `ssr:false` para o canvas (já é o padrão do `configurador-loader.tsx`), garantindo que o JS 3D não bloqueie o paint inicial.
- **Custo de não fazer:** a cada 1s acima de 2,5s LCP, bounce +32%; 1s de delay = −7% conversão — [dev.to]. Em página de produto de R$20k, isso é dinheiro real.

---

## 6. Matriz de decisão BUILD vs BUY + análise de sensibilidade

### 6.1 Custos triangulados (3 fontes: cpq3d, emersya, theintellify)

| Cenário | Ano 1 | Ano 3 (acumulado) | Notas |
|---|---|---|---|
| **BUY — SaaS enterprise (Threekit)** | $30k–$100k + $500–$5k/modelo | $90k–$300k+ | opaco, demo-only, lock-in, per-render credits |
| **BUY — SaaS mid (Zakeke/Roomle)** | €1k–€20k | €3k–€60k | menos "luxo", config 3D mais limitado |
| **BUILD — Three.js/R3F** | ~40 dev-days ≈ €24k + assets + host (range citado $350k–$1M é p/ MVP enterprise multi-produto, **não** aplica a Bretda) | +10–15%/ano manutenção | dev já existe; código já existe |

> **Leitura crítica das fontes:** os números $350k–$1M+ (theintellify) referem-se a configuradores **enterprise multi-produto do zero**. A Bretda **já tem** um configurador Three.js r162 funcional — o custo marginal real é **evoluir** (P0/P1/AR/R3F = dezenas de horas), não construir do zero. A faixa honesta de build incremental Bretda é **~€10k–€40k de dev + custo de produção de assets**, não centenas de milhares.

### 6.2 Matriz de decisão (ponderada)

| Critério | Peso | Build (Three.js/R3F) | Buy (Threekit) | Buy (Emersya) |
|---|---|---|---|---|
| Custo total 3 anos | 25% | **9** (código já existe) | 2 | 4 |
| Controle/flexibilidade (luxo, marca própria) | 20% | **9** | 5 | 6 |
| Time-to-AR | 15% | 7 (`<model-viewer>`) | **8** | 8 |
| Esforço manutenção | 15% | 5 (dev-dependent) | **8** | 7 |
| Fotorrealismo/qualidade luxo | 15% | 7 | 8 | **9** |
| Lock-in / portabilidade de assets (GLB padrão) | 10% | **9** | 3 | 4 |
| **Score ponderado** | | **7,75** | 5,15 | 6,30 |

### 6.3 Análise de sensibilidade

- **Se a Bretda perdesse o dev** (sem ninguém p/ manter WebGL): peso "manutenção" dispara → **Emersya passa a empatar/vencer** (luxo + perf + zero dev). Gatilho de re-decisão.
- **Se o catálogo explodisse** p/ centenas de SKUs com virtual-photography em massa: **Threekit/3D Cloud** ganham tração (não é o caso hoje — 28 SKUs).
- **Se o orçamento Ano-1 fosse < €10k e prazo < 3 semanas:** **Zakeke** (€19→€459/mo) seria o buy pragmático para MVP, com migração futura (assets GLB são portáveis).
- **Robustez:** o build só perde a liderança em **dois** cenários (perda de dev OU explosão de catálogo). Ambos são observáveis com antecedência → decisão **build é robusta** para o estado atual.

**Veredito build-vs-buy: BUILD (incremental sobre o Three.js existente, evoluindo p/ R3F+Drei+Valtio), com `<model-viewer>` para AR.** Buy só se perder capacidade dev.

---

## 7. Hipótese contrária H3 — "configurador 3D = custo/complexidade sem ROI vs galeria editorial premium + WhatsApp handoff?"

### Tese (pró-3D)
Furniture luxo high-ticket tem incerteza de tamanho/material/encaixe altíssima. 3D+AR ataca isso: Shopify +94% conv. médio, Rebecca Minkoff +65% em AR, Gunner +40% / −5% return. O configurador também é **vitrine de customização** (a Bretda *é* sob-encomenda) — sem ele, o comprador não vê que pode escolher madeira/feltro. Concorrente nº1 (BlackBall) e referências (Roche Bobois, Aston Martin) têm configurador. É table-stakes de categoria.

### Antítese (pró-galeria + WhatsApp)
Os cases de +94%/+40% são de **ticket baixo, alto volume, self-checkout** (kennel, sapato, sofá D2C). Bretda é **R$11k–27k, baixo volume, venda consultiva, fechamento por WhatsApp/showroom**. Nesse regime: (a) a decisão não fecha no site — fecha na conversa; (b) o gargalo real é **gerar o lead qualificado**, não o "girar a mesa"; (c) um configurador 3D mal-feito (e o atual *é* ruim no mobile, por feedback direto do founder) **destrói** conversão (LCP, jitter de tap, swatches minúsculos) em vez de ajudar; (d) galeria editorial fotorrealista (Flux/render) + WhatsApp-handoff custa uma fração e converte lead luxo igual ou melhor. O QS post-click=2 do `/configurador` no Google Ads (memória do founder) é **evidência interna** de que o configurador atual está *machucando*, não ajudando.

### Síntese (veredito honesto)
**H3 procede parcialmente — e a recomendação a incorpora.** O erro é tratar "configurador 3D" como bloco único. Decomponha:

1. **O 3D girável pesado e o refactor R3F NÃO são prioridade de ROI.** Não há dado que justifique 40–60h de R3F agora. Isso dá razão a H3.
2. **O que move ROI no ticket Bretda é, em ordem:** (i) **AR "no seu cômodo"** (ataca a fricção #1 = "cabe na minha sala?", custo baixo via model-viewer, ROI triangulado); (ii) **fotorrealismo de material** (madeira/feltro convincente = sinal de luxo, vende customização); (iii) **WhatsApp-handoff direto do config** (canon Brasil luxo, fecha o lead). H3 está certa que **WhatsApp é central**.
3. **O configurador atual, ruim no mobile, é passivo negativo** (QS 2, feedback do founder). **Os P0 do doc anterior (~2h30) são pré-requisito**: ou conserta, ou é melhor ter galeria editorial do que um 3D quebrado.

**Recomendação síntese:** **NÃO** é "3D vs galeria" — é **"galeria editorial fotorrealista + AR `<model-viewer>` + customizador leve + WhatsApp-handoff"** como espinha dorsal, com o **configurador 3D girável como camada secundária** (consertado via P0/P1, evoluído p/ R3F *só se* métricas validarem ≥5% de mobile chegando a "Solicitar Orçamento"). Isto é mais barato, ataca o ROI real, e desarma o risco que H3 aponta. **Confiança: alta.**

---

## 8. Riscos técnicos

| Risco | Sev | Mitigação |
|---|---|---|
| Bundle R3F +570 KB degrada LCP mobile | Alta | lazy atrás de poster; canvas fora do LCP; code-split; `fetchpriority` no poster |
| USDZ auto-gerado com qualidade inferior em iOS | Média | pré-bakar USDZ controlado p/ SKUs hero |
| GPU-RAM estourando em iPhones antigos com texturas grandes | Média | KTX2 obrigatório; fallback WebP estático low-end |
| Produção de assets (28 SKUs × variantes) vira gargalo/custo | **Alta** | 1 GLB/chassi + PBR-swap runtime; texturas via IA (Flux/image-studio) |
| Regressão de materiais/GLB na migração R3F | Média | gate de métricas antes de migrar; testes visuais |
| Configurador quebrado mata conversão (QS 2 atual) | **Alta** | executar P0 do doc anterior ANTES de qualquer expansão |
| Lock-in se escolher SaaS | Média | manter assets em GLB padrão (portável) mesmo se experimentar Zakeke |

---

## 9. Bibliografia anotada (com scores)

> Score = Autoridade(A) / Recência(R) / Relevância(Rel), escala 1–5.

**Stack / técnico**
- [creativedevjobs — R3F vs Three.js 2026](https://www.creativedevjobs.com/blog/react-three-fiber-vs-threejs) — A4/R5/Rel5. Fonte do bundle 462KB vs 1.035KB e "poucos % de overhead".
- [graffersid — R3F vs Three.js 2026](https://graffersid.com/react-three-fiber-vs-three-js/) — A3/R5/Rel4. Corrobora bundle/perf.
- [Krapton — R3F mobile perf 2026](https://www.krapton.com/blog/boosting-react-three-fiber-mobile-performance-in-2026-a-deep-dive-d6105c) — A3/R5/Rel4. 60fps mobile exige asset-prep + runtime opt.
- [modelviewer.dev FAQ](https://modelviewer.dev/docs/faq.html) + [docs](https://modelviewer.dev/docs/) — A5/R5/Rel5. **Primária.** USDZ on-the-fly, glTF=PBR, 20 linhas, plataforma automática.

**SaaS / pricing**
- [CPQ3D — 3D configurator cost 2026, 12 vendors](https://cpq3d.com/3d-product-configurator-cost/) — A4/R5/Rel5. **Primária de custos.** Threekit $30k–$100k, Zakeke €19→€459, per-SKU €500–€5k, setup €2k–€50k.
- [Threekit pricing](https://www.threekit.com/pricing) — A4/R5/Rel4. Confirma "demo-only", sem preço público.
- [Emersya cost guide](https://www.emersya.com/product-configurator-cost-guide/) — A4/R5/Rel3. Sem números (consultivo); confirma "no standard guidelines".
- [theintellify — build a 3D configurator 2025](https://theintellify.com/build-3d-product-configurator-for-e-commerce/) — A3/R4/Rel4. ~40 dev-days/€24k + faixa enterprise $350k–$1M (contextualizada como não-aplicável).
- [Fibbl — 10 best 3D visualization sw](https://fibbl.com/we-review-the-10-best-3d-product-visualization-software-for-e-commerce-d2c-brands/) — A3/R5/Rel4. Perfil Emersya (luxo/premium, poucos SKUs).

**AR / conversão (triangulação)**
- [Shopify — case study Gunner Kennels](https://www.shopify.com/case-studies/gunner-kennels) — A5/R4/Rel5. **Primária on-record.** +40% order-conv, +3% cart, −5% return (VP Marketing nominal).
- [Shopify — ROI on AR](https://www.shopify.com/blog/ar-shopping) — A5/R4/Rel5. **Primária.** +94% conv. médio com 3D.
- [Shopify changelog — Shop AR previews](https://changelog.shopify.com/posts/shop-adds-3d-and-augmented-reality-ar-previews) — A5/R4/Rel4. Confirma claim de plataforma.
- Rebecca Minkoff (via Shopify, +27% 3D / +65% AR) — A4/R4/Rel5. Par 3D-vs-AR isolado.
- [orbe3d — AR cuts returns 35%](https://www.orbe3d.com/how-ar-cuts-furniture-returns-by-35-with-real-case-studies/) — A3/R5/Rel4. Agregado −35% a −64% returns.

**Asset pipeline**
- [orbe3d — optimize 3D furniture for mobile 2026](https://www.orbe3d.com/optimize-3d-furniture-models-for-fast-loading/) — A3/R5/Rel5. Draco 10MB→<2MB, KTX2 GPU-RAM, <100k tris, GLB <5MB.
- [360render — GLTF vs USDZ](https://www.360render.com/rendering-guide/gltf-vs-usdz-the-best-3d-model-formats-for-e-commerce-ar-and-vr/) — A3/R5/Rel4. Formatos AR.

**SEO / Vitals**
- [utsubo — WebGL/Three.js SEO rankable 2026](https://www.utsubo.com/blog/webgl-three-js-site-seo-rankable-guide) — A3/R5/Rel5. "HTML ao redor do canvas"; render SSR primeiro.
- [mewastudio — Core Web Vitals 2026](https://www.mewastudio.com/en/blog/seo-core-web-vitals-2026) — A3/R5/Rel4. Targets LCP/INP/CLS.
- [dev.to — fix LCP/INP/CLS 2026](https://dev.to/dharanidharan_d_tech/fix-lcp-inp-cls-in-2026-the-complete-core-web-vitals-guide-with-real-benchmarks-54cl) — A3/R5/Rel4. Lazy-WebGL atrás de poster, fetchpriority, bounce +32%/s.
- [cubitrek — web design trends 2026](https://cubitrek.com/blog/top-10-website-design-trends-for-2026-the-ultimate-guide) — A2/R5/Rel3. Poster→1,8s LCP.

**Docs internos lidos**
- `docs/projects/bretda-redesign/09-configurador-mobile-research-2026-05-15/research-summary.md` — A5/R5/Rel5. UX patterns + bugs file:line.
- `docs/projects/bretda-redesign/09-configurador-mobile-research-2026-05-15/benchmark-table.md` — A5/R5/Rel5. 12 brands + 10 patterns + bibliografia.

**Contagem total de conteúdos analisados: 18** (incl. 2 internos). Claims decisórios (stack, AR-ROI, build-vs-buy, pipeline) cada um com ≥3 fontes.

---

## 10. Spec recomendada do configurador (consolidada — input dev-ready)

- **UX:** aplicar P0/P1 do doc 2026-05-15 (bottom-sheet vaul + sticky-CTA + swatch 44px/4cols + tap-threshold 12px + nome-sempre-visível + smart-focus). **Pré-requisito, não opcional.**
- **Stack:** curto prazo = manter Three.js r162 + fixes. Médio prazo (condicional a ≥5% mobile→"Solicitar Orçamento") = R3F + Drei + Valtio. AR = `<model-viewer>` desde já.
- **AR:** `<model-viewer>` com GLB <5MB (Draco) + USDZ (on-the-fly, pré-bakado p/ hero SKUs). Botão "Ver no seu cômodo" no PDP e no config.
- **Pipeline:** `.skp`→retopo→PBR→bake→<100k tris→Draco→KTX2→GLB<5MB. 1 GLB/chassi + PBR-swap runtime; texturas via Flux/image-studio.
- **SEO/Vitals:** SSR de conteúdo+heading antes do WebGL; canvas lazy `ssr:false` atrás de poster; KTX2 obrigatório; fallback WebP low-end.
- **ROI primeiro:** AR > fotorrealismo > WhatsApp-handoff > save/share > (R3F refactor por último, gated).
- **Instrumentar GA4** (`configurator_*` events) ANTES de qualquer expansão — sem dado não se justifica R3F.

---

*— Atlas, investigando a verdade 🔎*
