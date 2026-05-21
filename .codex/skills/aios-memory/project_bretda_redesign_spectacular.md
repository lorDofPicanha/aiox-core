---
name: Bretda Redesign Spectacular
description: Sprint de redesign awwwards-level da Bretda LP, 7 fases, Phase 1 entregue 17/Abr
type: project
originSessionId: ff6b9f8e-b53c-4879-b143-c71ba4b02bbd
---
# Bretda Website Redesign Spectacular

**Status atual:** Phase 1.7.6 LIVE 17/Abr/2026. Protótipo navegável em http://localhost:8787/ (precisa :8080 rodando tbm pro iframe do configurador). Session summary completo em `D:/AIOS/outputs/design-lead/bretda/SESSION-SUMMARY.md`.

**Status original:** Phase 1.5 (Direction Locked) entregue 17/Abr/2026 — **Direção 3 escolhida** + harvests das outras 4.

**Direção locked:** base Direção 3 "Legado em Movimento" enriquecida com cherry-picks: atmospheric 3D + easing luxury (D1); ficha técnica + oldstyle-nums + baseline grid + Lighthouse 95+ (D2); configurador modal + hover reveals + "solicitar portfólio" CTA (D4); **8 etapas como espinha do ato 2 + motion-onomatopeia + tempo como prova + artesãos nomeados (D5)**. Rejeitados: base grafite/wood dark (D1/D4 — mata transição cromática narrativa), zero-motion (D2), blueprint hero (D5).

**Documento canonical:** `D:\AIOS\outputs\design-lead\bretda\direction-locked.md` — contém tokens, paleta expandida, motion vocabulary, grid system, estrutura narrativa 3 atos.

**Phase 1.7 — Protótipo 17/Abr:** HTML standalone navegável em `D:/AIOS/outputs/design-lead/bretda/prototype/index.html` rodando via `python -m http.server 8787` em http://localhost:8787/. 3 atos completos + 12 vídeos reais + placeholders marcados G1/G2/G3/G5. README completo no dir. Decisões: Mux escolhido para prod, capturas adiadas pós-aprovação, **Cristiane é ponte Bretda**, **Bruna é cliente owner real** (testimonial 06b-bruna).

**Phase 1.7.1 — Otimização performance (mesma data):** Primeira versão crasheou (12 vídeos 4K @35Mbps = 1.3GB). Transcoded para 720p CRF30 faststart H.264 → **32MB total (40× menor)**. HTML refatorado: autoplay removido de todos exceto hero, `preload="none"`, posters 5-17KB extraídos via ffmpeg, IntersectionObserver com pool MAX_PLAYING=3 para throttle concorrência, threshold 0.4 + rootMargin -5%. Videos agora em `videos-web/` (32MB), `posters/` (125KB total), `videos/` original mantido como backup (1.3GB).

**Phase 1.7.2 — Brand polish + Coleção + Configurador (17/Abr):** Adicionadas 2 seções principais. (a) **Coleção**: grid 3×2 responsivo com as 6 mesas gemas (Âmbar, Aurora, Citrino, Espinela, Opal, Zurita) usando ambient renders 1600px como bg. (b) **Configurador**: viewer editorial com 18 studio renders (6 mesas × 3 ângulos) + swatches Linha/Porte/Feltro, navegação por dots, deep-link das mesa-cards para o configurador. BRETDA® wordmark em nav + footer. CTA headline atualizada para padrão brand brief "Herança. Customização. Sua." Imagens: `images/mesas/` com 36 arquivos JPG ~4.6MB total (studio 1200px + ambient 1600px resized via ffmpeg). Brand brief encontrado em `D:/conteudos bretda/briefs/2026-04-17-banner-display-300x600-editorial.md` — paleta + copy patterns + restrições já alinhadas. HTML agora 63KB, seções: Hero, Origem, Voice, Ato2 Ofício (3 etapas+atelier+thesis), Ato3 Lifestyle, In-home, **Coleção**, Testimonial Bruna, Question, **Configurador**, CTA, Footer.

**Phase 1.7.6 — Iframe + Coleção 13 produtos (17/Abr):** Configurador 3D custom Three.js (procedural box + swap) substituído por **iframe `http://localhost:8080/arquiteto.html`** — user quis exatamente como o site oficial Vercel (prototype-tawny-omega.vercel.app/arquiteto.html) que tem: tabs Modelos / Tecidos / Madeiras / Pinturas / Aço / Personalizar, click-to-classify, GLTFLoader, TransformControls, multi-table. Iframe 92vh min 640px, sage-deep bg, cross-origin (deps :8080 rodando paralelo). CSS `.configurador-iframe` + `.configurador-footer` + link "Abrir em tela cheia". **Coleção expandida**: 6 sinuca → **13 produtos** (+ 3 Pebolim Âmbar/Berilo/Opal, + 3 Tênis Âmbar/Citrino/Cobal, + 1 Shuffleboard). Filters UI com botões Todas/Sinuca/Pebolim/Tênis/Shuffleboard + contador de itens. Cards agora usam `images/banners/banner-X-desktop.jpg` como bg (9MB banners+destaques copiados do prototype antigo). Subtitle bullets colored por categoria (dourado/wood-warm/velvet-wine/forest-tint). JS filter toggles `.hidden` class. HTML 90KB.

**Phase 1.7.5 — Retrofit com ativos do prototype antigo (17/Abr):** DESCOBERTO `D:/AIOS/docs/projects/bretda-landingpage/prototype/` (versão que rodou em :8080, Vercel em prototype-tawny-omega.vercel.app) com **assets REAIS que faltavam**: 15 arquivos de fonts (TAN Aegean + Century Gothic Regular/Italic/Bold/BoldItalic × woff2/woff/ttf, 972KB), 13 GLB models (40MB total — 6 Sinuca copiados pro novo: Âmbar 464KB, Aurora 2.1MB, Citrino 2.5MB, Espinela 358KB, Opal 1.7MB, Zurita 516KB = 7.6MB), e `arquiteto.html` com lógica de classificação de materiais via click (2478 linhas). Retrofit aplicado: (1) fonts oficiais substituem Cormorant+Raleway (@font-face em 5 variantes), (2) paleta expandida com tokens sage `--sage-deep #2A2B26, --sage-mid, --sage-warm, --cream-pure #FEF7F2, --cream-soft #DFDEDA, --brand-border`, (3) Configurador mudado de ink-deep pra sage-deep bg com cream accents (sem dourado), (4) Three.js GLTFLoader substitui BoxGeometry — carrega GLB real, SketchUp Z-up→Y-up (rotation.x = -π/2), normalize scale (2.6/maxDim), place on ground (y-=box.min.y), heurística de classificação de material (name match + metalness/roughness/color fallback), swap via textureMap quando user clica Tecido/Madeira/Pintura/Aço, disposeGroup ao trocar linha, cache de classification + textures. HTML 93KB final. :8080 mantido também rodando o prototype antigo pra comparação.

**Phase 1.7.4 — Configurador 3D real WebGL (17/Abr):** DESCOBERTA: Three.js/R3F nunca foi buildado em lugar nenhum (bretda-lp placeholder, bretda-v2 só tem deps sem components, live bretda.com.br é Lovable.dev SPA bundle 422KB sem three). **Construído do zero com Three.js 0.160 via CDN + importmap**: canvas `#mesa3d` com geometry procedural sinuca 8ft (2.54×1.42m escala real: BoxGeometry play surface, 4 rails, apron wood, 4 legs metal, 6 pockets leather), PBR MeshStandardMaterial (wood roughness 0.55/metal 0.05, felt 0.95/0.0, metal 0.35/0.82), RoomEnvironment + PMREM + key/fill/hemi lighting + shadows PCF 2048, OrbitControls damping+auto-rotate 0.32, lazy-init via IntersectionObserver rootMargin 400px. 6 presets LINE_PRESETS (uma combinação wood+felt+metal por gema). 3 camera views (front/three-quarter/top) com tween easeInOutQuad 800ms. Material catalog wires live — cada click em swatch aplica textura via loadTex + needsUpdate, repeat vs size consciente (wood 2.5×1, felt 6×3, metal 1×1). Meta label dinâmico "{mesa} · {madeira} · {tecido} · {metal}". Respeita prefers-reduced-motion (desliga autoRotate). HTML 90KB final.

**Phase 1.7.3 — Catálogo real Bretda (17/Abr):** Localizado projeto antigo em `D:/AIOS/apps/bretda-lp/` (Next 16) e `D:/AIOS/apps/bretda-v2/` (tem @react-three/fiber mas sem components 3D). **DESCOBERTA: `configurador-3d.tsx` no bretda-lp é PLACEHOLDER** ("em desenvolvimento", comentário diz "Three.js will be integrated in P5"). Não há .glb real — `/models/` referenciado em products.ts não existe. **PORÉM** o bretda-lp tem **catálogo de acabamentos 100% real** em `public/img/acabamentos/` (40 arquivos, 3.5MB) + data em `src/data/products.ts`. Copiado para `prototype/images/acabamentos/`. Configurador HTML reescrito: swatches genéricos substituídos pelo catálogo real agrupado em 4 steps — **03 Tecido** (13 La Italiana: Off White, Creme, Púrpura, Vermelho, Laranja, Marrom, Azul Petróleo, Verde Esmeralda, Cinza Claro, Camel, Terracota, Cinza Rosado, Cinza Chumbo), **04 Madeira** (9 lâmina: Cabreúva, Carvalho Europeu, Cinamomo, Freijó, Nogueira, Pau de Ferro, Rovere, Teca, Ébano-Linheiro + 4 nobre: Guarapeira, Ipê Champagne, Marupá, Pau de Ferro), **05 Pintura** (8 metalizada + 2 microtextura), **06 Aço Inox** (4 opções). Cada swatch é image-based 62px com border dourado ao selecionar + label abaixo + display "Selecionado: X" no header. Mesa-cards atualizadas com specs reais (2,54 × 1,42 m, 300-350 kg). Specs extraídos de products.ts do bretda-lp. HTML: 78KB.

**Asset inventory 17/Abr:** 12 vídeos brand-owned analisados. Todos 2160×3840 9:16 H.264 35Mbps, ~5min bruto total, 1.3GB. Identidade editorial coerente (overlays serif "TODA MARCA CARREGA UM NOME", "QUE SUA CASA SEJA O REFLEXO DA SUA HISTÓRIA", "UMA MESA"+BRETDA, "CONEXÃO", "QUANDO O DESIGN ENCONTRA A NECESSIDADE REAL"). Cinemática macro moody warm. Documento: `video-integration-plan.md` com mapping 3 atos + 5 gaps (G1 floresta, G2 8 etapas CRÍTICA, G3 Rudson close, G4 testimonial owner real, G5 reshoot casa). Budget captura futura: R$20-35k. Thumbs: `outputs/design-lead/bretda/thumbs/`. Pipeline encoding Mux HLS adaptive, target ≤150MB página toda.

**Ambição:** Página nível Awwwards SOTD dentro de 90 dias. Mesas de bilhar luxury R$33k+.

**Mind Clones consultados via batch self-consultation CLI:**
- john-maeda (simplicity/STEAM)
- dieter-rams (weniger aber besser)
- erik-spiekermann (editorial typography)
- val-head (motion craft)
- refika-anadol (atmospheric generative) — substitui Bruno Simon (clone inexistente)
- donald-miller (inverted StoryBrand para luxo)

**Deliverables Phase 1 (paths):**
- `D:\AIOS\outputs\design-lead\bretda\design-brief.md` — 11 seções, rubric de DoD, síntese inter-clone
- `D:\AIOS\outputs\design-lead\bretda\creative-directions.md` — 5 direções com rationale

**5 direções criativas geradas:**
1. Atelier Noir — mood escuro, Anadol-led, risco alto
2. Museu Aberto — editorial puro, Spiekermann-led, low risk
3. Legado em Movimento — scroll cinemático, Val Head-led, max awwwards
4. Gabinete do Colecionador — intimidade, Rams-led, high-ICP fit
5. **Ofício como Evidência — RECOMENDAÇÃO da Nova** — Maeda+Spiekermann, justifica preço + assina visual

**Restrições críticas gravadas:**
- Mesa SEMPRE foto real (`D:\conteudos bretda\Produtos\`), ambientes podem ser IA/R3F
- Lighthouse ≥90, LCP<2.5s, CLS<0.1, mobile-first
- Zero CTA urgente, pop-ups, countdown — linguagem invita, não vende
- Dourado `#C9A96E` ≤ 2% da tela em qualquer view

**Próximas fases (aguardando decisão direção):**
- Phase 2: moodboard + wireframes low-fi 5 telas → @ux-designer + @ux-researcher
- Phase 3: hi-fi mockups hero + configurador via Stitch MCP → @ui-designer
- Phase 4: motion spec → @motion-designer + Val Head review
- Phase 5: 3D scene brief → R3F research
- Phase 6: tokens + component spec → @design-systems-engineer
- Phase 7: handoff @dev com DoD

**Bloqueadores potenciais:**
- Acesso ao ateliê Bretda para captura de fotos/vídeos macro (se Direção 1/3/5 for escolhida)
- Budget fotografia profissional para refoto mesas (se inconsistências identificadas)
