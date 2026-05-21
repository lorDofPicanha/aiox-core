---
name: Tocks Website v2 - New Luxury Site
description: Novo site Tocks Custom from scratch. Dark luxury, Next.js 16 + R3F. ~65% completo, 7 telas Stitch geradas, design system Gilded Noir criado, pendente revisao e apply.
type: project
originSessionId: f4017ef6-826b-419a-80ba-e931174f0f2c
---
## Tocks Website v2 — New Luxury Site

**Objetivo:** Site novo do zero para substituir o Tray Commerce atual. Comparar performance vs site antigo.
**Path:** `D:\AIOS\apps\tocks-website\`
**Status:** ~60% completo, 8 paginas + 20 componentes + 5 design docs + 2 blog posts MDX

### PROXIMO (ao reiniciar Claude Code)
1. ~~Verificar se Stitch MCP carregou corretamente~~ DONE 16/Abr
2. ~~Criar design system no Stitch~~ DONE 16/Abr
3. ~~Gerar 7 telas no Stitch~~ DONE 16/Abr
4. Revisar telas no Stitch (mind clones don-norman + dieter-rams avaliam, @ux-design-expert revisa)
5. Aplicar design system Gilded Noir nas telas via `apply_design_system`
6. Gerar variantes (explore/refine) para Home e Produto
7. Completar 6o design doc (SEO metadata)
8. Gerar imagens com Nano Banana 2 (ambientes luxury, hero, produtos)
9. Implementar componentes visuais baseado nos design docs + telas Stitch aprovadas

### Progresso (16/Abr/2026 sessao 3)
- **Completude:** ~65% do MVP Phase 1
- **Paginas (8):** Home, Colecao, Colecao/[slug], Atelier, Projetos, Blog, Blog/[slug], Contato
- **Componentes (20):** 5 atoms, 4 molecules, 5 organisms, 3 templates, 1 provider, 2 layout utils
- **Design docs (5/6):** tokens, components, wireframes, interactions, responsive — falta SEO metadata
- **Blog MDX (2):** artigos sobre selecao moveis + materiais
- **Stitch MCP:** OPERACIONAL com STITCH_API_KEY

### Stitch Project (16/Abr/2026)
- **Project ID:** 13121423762766500977
- **Design System:** Gilded Noir — Tocks Luxury (asset ID: 17802990810530603774)
- **Telas geradas (7/7):**
  - HOME: e5bf76fd830945338a639f4ba1b0ec6c (2560x10392)
  - COLECAO: 515cbce20ddf4859ab0413d1ff2a940d (2560x4444)
  - PRODUTO: 2b7e9726eda64e35acae981be7eb2f2e (2560x6916)
  - ATELIER: d4a20b9e147e458f92984c697ada0b2e (2560x10146)
  - PROJETOS: f3b1efb4671f4c9d9ed245a5d97b228e (2560x4864)
  - BLOG: 2d8056375c4f446395a14daee0c2ee74 (2560x4182)
  - CONTATO: a6446aa28f4e4ca4a92342d51d4d3bf1 (2560x6288)
- **Status:** Telas geradas, pendente revisao mind clones + apply_design_system

### Decisoes (16/Abr/2026)

| # | Decisao | Escolha |
|---|---------|---------|
| 1 | Preco no site | Mostrar "A partir de R$X" |
| 2 | Configurador | Premium R3F (Phase 2, 8-12 sem) |
| 3 | Fases | Phase 1 primeiro, depois 2 e 3 |
| 4 | CMS | MDX no repo (Phase 1), Sanity (Phase 2) |
| 5 | Dominio | Localhost por enquanto |
| 6 | Conteudo visual | Mix (foto profissional + IA) |
| 7 | Blog | Sim, 5-10 artigos SEO no launch |

### Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- GSAP ScrollTrigger + Framer Motion
- React Three Fiber + Drei (Phase 2)
- MDX para blog (Phase 1) → Sanity (Phase 2)
- Zustand (state)
- Vercel deploy (gru1) — futuro
- GA4 + Microsoft Clarity

### Paleta "Gilded Noir"

- Background: #0B0B0F
- Surface: #1A1A1E
- Text: #FAFAFA
- Gold accent: #D4AF37
- Gold hover: #E5C65C

### Fontes

- Headlines: Cormorant Garamond
- Body: Inter
- CTAs: Montserrat

### Tom de Voz

- "Sob medida" (nao "customizado")
- "Atelier" (nao "fabrica")
- "Peca" (nao "produto")
- "Criacao" (nao "fabricacao")
- Portugues premium: frases curtas, verbos fortes, poucos adjetivos, sem exclamacao

### Fases

| Fase | Escopo | Prazo |
|------|--------|-------|
| 1 — MVP Premium | Site dark luxury, video hero, scroll animations, WhatsApp CTA, blog MDX, responsivo, SEO | 6-8 sem |
| 2 — Configurador 3D | R3F Porsche-style, 7 steps, material swap, preco dinamico, share/save/PDF | +8-12 sem |
| 3 — AR + Intelligence | AR "veja na sua sala", chatbot WhatsApp IA, CRM integrado | +6-8 sem |

### Concorrentes Mapeados

- **Diretos globais:** 11ravens, Blatt Billiards, Brunswick, Olhausen, Billard Toulet
- **Diretos BR:** BLACKBALL (principal), American Billiards, Bilhares Mercedes
- **Indiretos BR:** Breton, Artefacto, Florense, Ornare

**Why:** Site atual (Tray Commerce) nao representa o posicionamento premium. Oportunidade de ser o melhor site de mesa de bilhar do mundo.
**How to apply:** Toda decisao de design/copy deve referenciar este doc. Phase 1 = MVP premium, Phase 2 = configurador.

### Sessao 4 — 2026-04-16 (Auditoria 7 telas Stitch)

**Verdict final por @design-chief (mind clones dieter-rams + don-norman + @ux-design-expert):**

| Tela | Veredicto | Gravidade |
|------|-----------|-----------|
| HOME | AJUSTES | media |
| COLECAO | AJUSTES | media |
| PRODUTO (Berlin) | AJUSTES | alta |
| ATELIER | APROVADA | baixa |
| PROJETOS | APROVADA | baixa |
| BLOG | AJUSTES | media |
| CONTATO | REJEITADA | critica |

**Decisao apply_design_system:** NAO rodar — Gilded Noir ja visivelmente aplicado em 7/7. Ajustar manualmente + REGENERAR CONTATO.

**Bloqueador critico:** CONTATO tem placeholder `(47) 99999-9999` e Google Map fake (Mountain View). Requer generate_variants REIMAGINE.

**Proximo passo:** `generate_variants` em paralelo:
- HOME → REFINE (consolidar CTAs, adicionar affordance arrows nos cards)
- PRODUTO → REFINE (fix customizer + preco real R$ 18.900)
- CONTATO → REIMAGINE (dados reais, remover mapa, FAQ reduzido para 5 agrupadas)

**Top fixes manuais (nao precisam variant):**
- COLECAO: remover precos dos cards (luxury code)
- BLOG: pill dourada no filtro ativo
- HOME: legendas em "Ambientes transformados"
- TODAS: dessaturar WhatsApp floating (verde vibrante clasheia com noir)

**How to apply:** Orion deve chamar Stitch MCP com os 3 generate_variants antes de qualquer export para apps/tocks-website/.

### Sessao 5 — 2026-04-16 (3 variantes geradas, 9 telas novas)

**HOME — REFINE** (3 variantes, session 16625050946952201918):
- `44590bd649c64b4f8363106a2640e713` — Symmetrical hero (CTAs lado-a-lado)
- `b84a32ab883247f19c994408a29fe2e9` — Editorial left-aligned (CTAs empilhados)
- `24b11c8ba1e94945b3b001a67a775673` — Minimalist whitespace (foco em respiro)

**PRODUTO (Mesa Berlin) — REFINE** (3 variantes, session 1045438860654078649):
- `ee6d8e9f310e466e991072f3dac1c211` — Architectural focus (gallery wide-angle)
- `676fc5712c29465fa10cfcc9d63aea0a` — Process-driven (macro imagery materials)
- `d8078cd47e104b3e8b41125216a72cd5` — Minimalist luxury (deep contrast)

**CONTATO — REIMAGINE** (3 variantes, session 7030010918479609809):
- `e1f2c5dc41754ccabe5121c0d5bee0b8` — Minimalist Atelier Manifesto (720px column)
- `194289397567416db159a0f000e9e700` — Bespoke Concierge (surface contrast)
- `50255ff0a2e045d2bac04b245051a425` — Editorial Noir (typography-first)

### Sessao 6 — 2026-04-16 (Variantes aprovadas)

**Decisão locked — 3 V2 escolhidas:**

| Página | Variante | Screen ID | Arquivos |
|--------|----------|-----------|----------|
| HOME | V2 Editorial (left-aligned hero, CTAs empilhados) | `b84a32ab883247f19c994408a29fe2e9` | `approved-variants/home.{html,png}` |
| PRODUTO (Berlin) | V2 Process (retratos B&W clientes, materiais claros) | `676fc5712c29465fa10cfcc9d63aea0a` | `approved-variants/produto-berlin.{html,png}` |
| CONTATO | V2 Concierge (form surface card, "Considerações do Atelier", ghost WhatsApp) | `194289397567416db159a0f000e9e700` | `approved-variants/contato.{html,png}` |

**Path:** `D:\AIOS\apps\tocks-website\docs\design\approved-variants\`

**PRÓXIMO:**
1. @ux-design-expert faz diff-analysis: variantes aprovadas vs 20 componentes já implementados. Output: plano concreto de alteração por componente
2. Fixes manuais em paralelo (independem de variantes): COLECAO remove preços dos cards, BLOG pill dourada no filtro ativo, TODAS dessaturar WhatsApp floating (verde vibrante clasheia com noir)
3. Gerar imagens reais com Nano Banana 2 (hero ambientes, retratos B&W testimonials, materiais macro)
4. Completar 6º design doc (SEO metadata)
5. @dev implementa refactor seguindo plano do @ux-design-expert
6. **Nota tech:** `apps/tocks-website/AGENTS.md` avisa que este Next.js tem breaking changes vs training data — ler `node_modules/next/dist/docs/` antes de qualquer código

### Sessão 7 — 2026-04-16 (Refactor plan produzido)

**Executor:** @ux-design-expert (Uma — aios-ux agent, autonomous spawn)
**Output:** `D:\AIOS\apps\tocks-website\docs\design\refactor-plan-v2-variants.md`

**Counts:**
- **New components:** 6 obrigatórios (step-indicator atom, swatch-picker + form-field + faq-item molecules, stats-row + project-showcase + client-portraits + related-products + cta-block + concierge-form organisms, concierge-layout template). **Total listed: 11** (6 obrigatórios + 5 extração DRY).
- **Modify:** 14 arquivos (9 componentes + products.ts + constants.ts + globals.css + 2 pages)
- **Delete:** 0 (todos componentes atuais reaproveitados)
- **Horas estimadas:** 34–42h (4,5–5,5 dias dev) + 4–8h se BLOCKER #1 resolução = "rename completo"

**Top 3 Blockers (decisão usuário antes de @dev começar):**
1. **Catálogo divergente (CRÍTICO):** Variantes usam Berlin/Vienna/Prague/Milan/London; products.ts tem Tenro Luxo/Gabe/Ark/Vertice/Curve/Elipse/Nobus/Rustic. Opções A (rename — Uma recomenda), B (manter), C (mix). Impacto 1–8h conforme escolha
2. **Assets reais ausentes:** hero bg, 4 cards produto, craftsman image, 3 projetos, 4 client portraits B&W (LGPD), 3 thumbnails macro, 4 process atelier. Nano Banana 2 pode cobrir hero+atelier; produtos reais e portraits exigem foto profissional + consentimento LGPD
3. **Dados concretos:** endereço físico Itajaí (variante tem `Rua {ENDERECO}`), telefone WhatsApp real (constants.ts tem placeholder 5547999999999), preços reais (Berlin 18.9k, Vienna 22.4k, Prague 25.6k, Milan 31.2k), 4 opções madeira reais (Carvalho/Nogueira/Freijó/Ébano confirmar)

**Token adjustments (3 novos):**
- `--color-whatsapp-gold: #C4A65E` (dessaturar verde vibrante — ordem Uma squad sessão 4)
- `--ring-swatch-active` + offset (wood/felt swatches)
- `--gradient-gold: linear-gradient(135deg, #D4AF37 0%, #8A6F3A 100%)` (CTA final blocks)

**Execution order:** tokens+data → atoms/molecules → organisms → templates → pages → QA. Bottom-up respeitado.

**Next action Orion:** responder 5 perguntas bloqueadoras → @pm cria S-7.1 (fundação) + S-7.2 (organisms/pages) → Nano Banana 2 gera mocks enquanto fotos agendam → @dev Dex implementa seguindo plano.

**How to apply:** Em qualquer tarefa de implementação do refactor, partir SEMPRE do path `docs/design/refactor-plan-v2-variants.md` como fonte de verdade + screenshots `approved-variants/*.png` como visual ground-truth.

### Sessão 8 — 2026-04-16 (Squad review refactor plan — hierarquia corrigida)

**Contexto:** Sessão 7 violou regra "Mind Clones as Workers" — @ux-design-expert produziu plan v1 sozinho. @design-chief corrigiu convocando squad: clones executam, chefe aprova.

**Squad (5 clones executors):** @brad-frost (atomic hierarchy), @dieter-rams (10 principles), @don-norman (usability), @tobias-van-schneider (luxury voice), @sarah-drasner (React engineering).

**Approver:** @ux-design-expert (Uma) — apenas review, não produziu novo conteúdo.

**Status:** APROVADO COM RESSALVAS (3 ressalvas: confirmar acervo fotos "Projetos Realizados", confirmar fluxo 7 etapas real, copy "Dúvidas Frequentes" + "Projetos Realizados").

**Top 3 mudanças vs v1:**
1. **Scope creep cortado:** 11 → 9 componentes novos (image-grid consolida project-showcase + related-products + client-portraits; concierge-layout template eliminado via variant prop em page-layout; client-portraits "trope saturado" substituído por "Projetos Realizados" em contexto)
2. **A11y corrigido (WCAG AA):** concierge-form bottom-border gold-deep/40 falhava contraste em focus — agora border-full gold-accent. FAQ migrado para `<details>` nativo (zero JS, ARIA built-in)
3. **Copy desclichê-ado:** "Nossas Peças na Coração" → "Projetos Realizados" (tobias: cliché sentimental). "Considerações do Atelier" → "Dúvidas Frequentes" (tobias: pretensioso em pt-BR)

**Path:** `D:\AIOS\apps\tocks-website\docs\design\refactor-plan-v2-variants-SQUAD.md`

**Horas revisadas:** 31.5–33.5h (economia ~4–8h vs v1 por consolidação grids + eliminação template).

**Mudanças técnicas adicionais:**
- Atom novo `text-pair` (brad: DRY em stats/specs/investimento)
- step-indicator promovido atom→molecule (brad: tem lógica + estado)
- stats-row rebaixada organism→molecule (brad: só display)
- swatch-picker como compound component (drasner: Radix pattern)
- concierge-form com Server Action Next.js 16 (drasner: aproveitar novidade)
- product-layout.tsx split em 3 sub-componentes <100 linhas (drasner: Art. VII compliance)
- gold-gradient utility removido (rams: ornamento)

**Blockers novos (pelo squad):**
- #4: Fluxo 7 etapas real existe? (senão deletar step-indicator)
- #5: Validação WCAG AA focus states no `*a11y-check` Fase 6

**Blockers v1 resolvidos pelo squad:** concierge-layout template, gold-gradient utility, FAQ technology choice, swatch-picker API pattern, concierge-form submit pattern.

**Consultation IDs (bridge-data):** 673209b5, baa6bd6d, b95c00b1, 1ea46317, c31ea9d8.

**How to apply:** Em qualquer implementação do refactor, usar `refactor-plan-v2-variants-SQUAD.md` como fonte de verdade (substitui v1). Plano v1 fica como baseline histórico. PM deve resolver 3 ressalvas + 3 blockers remanescentes antes do @dev começar Fase 1.

### Sessao 9 — 2026-04-16 (Blockers resolvidos — 4/4)

**B1 Catálogo:** RESOLVIDO. Stitch alucinou nomes europeus. Fonte da verdade é `products.ts` (8 produtos PT-BR: Tenro Luxo/Gabe/Ark/Vertice/Curve/Elipse/Nobus/Rustic). HOME hero 4-cards usa 4 mesas top (criterio: `isNew: true` + best sellers). "Mesa Berlin" das variantes → `/colecao/tenro-luxo` (ou mesa escolhida pelo @pm).

**B2 Dados concretos:** RESOLVIDO (executor @dev em constants.ts):
- `WHATSAPP_NUMBER = '554730419811'` (era placeholder 5547999999999)
- `CONTACT_EMAIL = 'contato@tockscustom.com.br'` (novo const, após WHATSAPP_URL)
- Endereço: **NÃO publicar rua** — usuário tem fábrica em Itajaí mas não quer expor. Copy fica "Atelier em Itajaí, SC" (sem rua)
- Preços: já estavam em products.ts (R$ 10.990–19.900)

**B3 Fluxo 7 etapas:** RESOLVIDO. Stitch inventou "Etapa X de 7". Real: `customizationOptions.length` por produto (2–4 opções). Step-indicator vira dinâmico por mesa.

**B4 Atelier físico (novo):** RESOLVIDO. Usuário mantém copy "Atelier" (brand concept). Fábrica real em Itajaí SC, sem visita pública. CTAs "Agende uma visita ao Atelier" → "Agende uma consulta" (ou "sob agendamento") na Fase de copy @dev.

**Status:** 4/4 blockers resolvidos. @dev livre para executar refactor plan SQUAD (31,5–33,5h). Próximo: @pm cria stories S-7.1 (fundação: tokens + atoms + data) + S-7.2 (molecules + organisms + pages) + S-7.3 (QA/a11y) seguindo `refactor-plan-v2-variants-SQUAD.md`.

### Sessao 12 — 2026-04-16 (Execução Nano Banana 2 BLOQUEADA)

**Bloqueio:** Gemini API free tier quota diária esgotada — 3 limites (per-minute requests, per-day requests, per-minute input tokens) estourados simultaneamente no primeiro generate_image. Retry 5s não resolve (é o quota diário).

**Specs prontos (não executados):** `D:\AIOS\apps\tocks-website\docs\design\nano-banana-prompts.md`
- 18 prompts (HOME 8 + PRODUTO 10 + ATELIER 3), APPROVED WITH NOTES pelo @ui-designer
- Tier A primeiro (2.1 Oak, 2.5 Green felt, 1.1 Hero) — desbloqueia swatch-picker + first-fold
- Output dir configurado: `D:\AIOS\generated_imgs`
- Model ativo: `gemini-3.1-flash-image-preview`

**Opções para desbloquear:**
1. Upgrade Gemini API key para tier pago (billing.google.com)
2. Aguardar reset free tier (~00:00 Pacific Time)
3. Switch para `mcp-image-studio` (alternativo, capacidades diferentes)
4. Gerar via Google AI Studio UI manualmente com os prompts do doc

**Não bloqueia @dev:** Stories S-7.1 já criadas — @dev pode começar fundação (tokens + atoms + data) sem assets. Assets são input de S-7.2 pages (bloqueio dali pra frente).

### Sessão 11 — 2026-04-16 (Nano Banana 2 prompts craftados)

**Path:** `D:\AIOS\apps\tocks-website\docs\design\nano-banana-prompts.md`

**Total prompts:** 21 (HOME 8 + PRODUTO 10 + ATELIER 3)

**Squad composition:**
- Executor HOME+ATELIER: @tobias-van-schneider (consultation `4bec680c-a9b3-4f99-8fc0-bb05eafba42d`)
- Executor PRODUTO materials: @dieter-rams (consultation `7ce7799d-b81d-403f-a944-3b442adeabc9`)
- Approver: @ui-designer (consultation `c97baf09-c504-4651-8270-363f800d4bfe`) — APPROVED WITH NOTES
- Orchestrator: @design-chief

**Approval status:** APPROVED WITH NOTES — 6 notas consistência (palette discipline, cliché prevention, mood split tobias/rams preservado, path convention, watch-item Orion para #000000, recomendação 2 variantes nos prompts tier-A).

**Orion execution plan (tier A — highest leverage):**
1. Asset 2.1 (Oak wood macro) — desbloqueia swatch-picker
2. Asset 2.5 (Green felt macro) — swatch pattern para felts
3. Asset 1.1 (Hero background) — first-fold must-have

**Tensões clones registradas:** (1) gold overlay (rams vetou em materiais, aceito em HOME), (2) cinematic vs restrained (preservado split por contexto), (3) bordeaux vs green default (hero=bordeaux, cards=mix), (4) "Atelier" editorial não literal.

**Tropes removidos vs plan SQUAD:** "client-portraits B&W" substituído por "Projetos Realizados" (3 shots arquitetônicos) — consistente com decisão sessão 8.

**Next:** Orion executa `mcp__nano-banana-2__*` na ordem tier A→B→C. Nano Banana 2 tem risco de injetar #000000 puro — re-gerar se outputs vierem muito escuros.

**How to apply:** Qualquer geração de imagem Tocks v2 parte deste spec. Não executar geração sem consultar tier order (Produto antes de Home porque desbloqueia UX do configurador).

### Sessão 10 — 2026-04-16 (Stories criadas a partir do refactor plan SQUAD)

**Executor PM:** @pm (Bob) orquestrando mind clones.
**Mind clones consultados:**
- `brad-frost` — consultation ID `0927cb91-6c60-4ea5-ab37-2c3f9d646e92` (atomic hierarchy + task granularity bottom-up)
- `will-larson` — 2 consultations na sessão (scoping INVEST + atomic-keep decision para S-7.2)

**Veredito clones (validado pelo chefe PM):**
- **brad-frost:** hierarquia bottom-up OK. Lacuna: cada task que cria componente precisa sub-task explícita "validar < 100 linhas" (Art. VII). Tokens ANTES de qualquer componente. `step-indicator` pertence INTEGRALMENTE a S-7.2 (molecule) — removido de S-7.1.
- **will-larson:** manter S-7.2 atômica (17h+). Dividir em 7.2a/7.2b geraria PR com molecules órfãs sem páginas que consomem. Dev-agent sequencial + commits por bloco (milestones internos).

**Stories criadas (3 arquivos):**

| # | Path | Ordem | AC | Tasks | Horas |
|---|------|-------|----|----|-----|
| 1 | `D:\AIOS\apps\tocks-website\docs\stories\S-7.1-foundation.md` | 1 (P0) | 7 | 6 tasks / 19 subtasks | 3.0h |
| 2 | `D:\AIOS\apps\tocks-website\docs\stories\S-7.2-components-pages.md` | 2 (P0) | 13 | 16 tasks / 63 subtasks | 24.0h |
| 3 | `D:\AIOS\apps\tocks-website\docs\stories\S-7.3-qa-a11y.md` | 3 (P0) | 10 | 10 tasks / 28 subtasks | 4.5h |

**Total:** 30 AC / 32 tasks / 110 subtasks / **31.5h** (alinhado com plano SQUAD 31.5–33.5h).

**Ordem obrigatória:** S-7.1 → S-7.2 → S-7.3 (dependências explícitas no front-matter YAML).

**Ressalvas @ux-design-expert absorvidas:**
1. Acervo "Projetos no Ambiente" → S-7.2 T-2.1.3 como comentário `BLOCKED-BY: assets Nano Banana 2` + S-7.3 T-4.2 log known-gaps (não bloqueia merge).
2. step-indicator honesto + visibility → S-7.2 AC-1 + T-1.1 (dinâmico via `customizationOptions.length`, progress dots todos visíveis).
3. Copy "Dúvidas Frequentes" + "Projetos Realizados" → S-7.1 AC-4 + T-3.1.

**Restrições enforçadas:**
- Next.js 16 breaking changes → S-7.1 Dev Notes + S-7.2 T-2.3.1 (ler `node_modules/next/dist/docs/` antes de Server Action).
- Art. VII (< 100 linhas) → AC explícito em cada story + sub-task "wc -l" após cada componente.
- Art. IV (No invention) → reforçado (produtos PT-BR reais, sem Berlin/Vienna).

**Status:** READY FOR @dev (começar por S-7.1).

**How to apply:** Em qualquer próxima sessão, começar execução em `S-7.1-foundation.md` → após DoD + QA-gate aprovação, S-7.2 → S-7.3. Stories são fonte de verdade operacional; refactor-plan-v2-variants-SQUAD.md continua sendo fonte arquitetural.

### Sessão 13 — 2026-04-16 (S-7.1 Foundation completa)

**Status:** DONE — READY FOR S-7.2 (aguardando quality gate @ux-design-expert)

**ACs satisfeitas:** 7/7 (AC-1 tokens, AC-2 WCAG noir PASS, AC-3 atom text-pair, AC-4 BRAND_COPY, AC-5 products.ts validado, AC-6 <100 linhas, AC-7 SSR-safe)

**Tasks checked:** 8/8 (T-1.1, T-1.2, T-1.3, T-2.1, T-2.2, T-3.1, T-3.2 + 15 sub-tasks)

**Arquivos criados:**
- `src/components/atoms/text-pair.tsx` (50 linhas, 3 variantes stat/spec/investimento, SSR-safe)
- `docs/qa/s-7.1-wcag-log.md` (contraste 9.23:1 noir PASS, fallback deep-gold para bone se necessário em S-7.2)

**Arquivos modificados:**
- `src/app/globals.css` (tokens WhatsApp gold #C4A65E/#D4B66F, focus-border full gold, ring-focus-offset 2px, tracking-editorial 0.2em, tracking-extreme 0.3em, ring-swatch-active; `*:focus-visible` usa `var(--focus-border)`)
- `src/lib/constants.ts` (BRAND_COPY.faq adicionado com "Dúvidas Frequentes"; BRAND_COPY.projects.headline renomeada para "Projetos Realizados")
- `docs/stories/S-7.1-foundation.md` (Dev Agent Record completo, File List, DoD 6/7 verde — falta QA gate)

**Validações:**
- `npm run typecheck` → 0 errors
- `npm run lint` → 0 errors, 1 warning pré-existente em `colecao/page.tsx` (fora do escopo)
- Art. VII → text-pair.tsx = 50 linhas ✓

**Inputs para S-7.2 (customizationOptions.length por produto):**
- tenro-luxo: 4 · gabe: 3 · ark: 4 · vertice: 4 · curve: 3 · elipse: 2 · nobus: 3 · rustic: 2
- Range real 2–4 confirma step-indicator dinâmico (NÃO fixar 7)

**Decisões não-óbvias:**
- Token CSS `--gradient-gold` nunca existiu — apenas utility `.text-gradient-gold` consumida por `heading.tsx`. Utility mantida (out-of-scope).
- Typos em products.ts ("autenticoco", "veiodo") deliberadamente não tocados (reserva para S-7.3 QA).
- brad-frost consultado (consulta ID `5533fcc0-26e5-48c5-a758-a214e62f8dd1`): confirma text-pair como atom puro (não molecule) — 2 text-nodes com variantes visuais ficam em atoms.

**Tempo real:** ~45min (estimativa era 3h). Divergência: muita sub-task era validação, não criação.

**Commit hash:** não commitou (@devops domain).

### Sessão 14 — 2026-04-16 (S-7.1 Quality Gate)

**Reviewer:** @ux-design-expert (Uma) — review gate autônomo, zero delegação a clone (regra "mind clones executam WORK criativo, chefe aprova").

**Veredito:** **APPROVED** — 7/7 ACs pass, zero minor fixes.

**Verificações chave:**
- AC-1 tokens: `--gradient-gold` confirmado ausente (grep 0); `.text-gradient-gold` utility preservada (out-of-scope); todos 6 tokens Gilded Noir presentes em `globals.css:19-30, 48-51`.
- AC-2 WCAG: recálculo manual #D4AF37 vs #0B0B0F → 9.03:1 (@dev calculou 9.23:1, divergência de rounding de luminance, ambos >> 3:1). PASS.
- AC-3 atom: interface `{label, value, as?, className?}` + 3 variantes stat/spec/investimento confirmadas em `text-pair.tsx:15-30`.
- AC-4 copy: grep `!` em BRAND_COPY → 0 ocorrências (única ocorrência é em template WHATSAPP_MESSAGE fora do escopo); "Dúvidas Frequentes" + "Projetos Realizados" corretos; zero "endereço".
- AC-5/6/7: products.ts intocado, text-pair 50 linhas, zero `'use client'`.

**Mudanças aplicadas:**
- Status frontmatter da story: `Review` → `Done`
- Seção "Review — Quality Gate" adicionada em `docs/stories/S-7.1-foundation.md` com tabela 7 linhas, AC-by-AC evidence.

**Observações não-bloqueantes registradas na story:**
- Acento em "Dúvidas" quebra convenção sem-acento do arquivo — decisão correta (AC literal vence convenção implícita).
- Utility `.text-gradient-gold` sobrevive em `globals.css:98` por dependência em `heading.tsx` — remoção fica para S-7.2+ quando cta-block for refatorado.

**Próximo passo:** **S-7.2 Components+Pages DESTRAVADA**. @dev livre para iniciar execução (~24h, 16 tasks, 13 AC). Input crítico já confirmado: `customizationOptions.length` 2–4 para step-indicator dinâmico.

**How to apply:** Ao retomar, @dev começa em `docs/stories/S-7.2-components-pages.md`. Plano arquitetural continua em `refactor-plan-v2-variants-SQUAD.md`.

---

### Sessão 15 — 2026-04-16 (S-7.2 Components+Pages completa)

**Executor:** @dev (Dex/Builder), Claude Opus 4.7 — sessão autônoma.

**Escopo entregue (16/16 tasks, 13/13 ACs):**

**Criados (12 arquivos novos):**
- `src/components/molecules/step-indicator.tsx` (75 linhas) — AC-1 dinâmico via `customizationOptions.length`
- `src/components/molecules/swatch-picker.tsx` (96 linhas) — AC-2 compound drasner pattern (Root + .Option)
- `src/components/molecules/form-field.tsx` (53 linhas) — AC-3 a11y (htmlFor/id + aria-required/invalid + live region)
- `src/components/molecules/faq-item.tsx` (51 linhas) — AC-4 `<details>/<summary>` nativo, zero JS
- `src/components/molecules/stats-row.tsx` (52 linhas) — AC-5 consome text-pair atom (S-7.1)
- `src/components/organisms/image-grid.tsx` (72 linhas) — AC-6 consolida 3 grids v1 (variants project/related)
- `src/components/organisms/cta-block.tsx` (47 linhas) — AC-7 bg solid sem gradient
- `src/components/organisms/concierge-form.tsx` (87 linhas) — AC-8 useActionState + useFormStatus
- `src/app/actions/submit-concierge.ts` (56 linhas) — Server Action Next.js 16 com signature `(_prev, formData)`
- `src/components/templates/product-gallery.tsx` (28 linhas) — AC-10 sub-component
- `src/components/templates/product-specs.tsx` (52 linhas) — AC-10 sub-component
- `src/components/templates/product-customization.tsx` (64 linhas) — AC-10 client com swatch + step-indicator dinâmico

**Modificados (8):**
- `src/components/molecules/product-card.tsx` (+ variant `editorial` chevron top-right fade-in) 52→86 linhas
- `src/components/molecules/whatsapp-cta.tsx` (tokens → `--whatsapp-gold`/`--whatsapp-gold-hover`)
- `src/components/organisms/hero.tsx` AC-9 reescrito left-aligned, 2 CTAs empilhados ("Agende uma consulta" / "Ver a colecao") — 72→82 linhas
- `src/components/organisms/footer.tsx` (+ prop `variant='minimal'`) 60→73 linhas
- `src/components/templates/page-layout.tsx` (+ prop `variant='concierge'` 720px centered) 25→48 linhas
- `src/components/templates/product-layout.tsx` (split em 3 subs + related ImageGrid) 132→91 linhas
- `src/app/page.tsx` HOME (hero + 4 editorial cards + ambientes + CtaBlock) 118→66 linhas
- `src/app/contato/page.tsx` (variant concierge + ConciergeForm + 5 FaqItems + sem telefone/endereço rua) 118→61 linhas
- `docs/stories/S-7.2-components-pages.md` status Draft→Review + Dev Agent Record + File List

**Tempo real:** ~1h vs 24h estimadas (8 paralelos de Write + typecheck incremental por bloco).

**Next.js 16 docs consultadas:**
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` (509 linhas) — validou pattern `action={formAction}` + `useActionState` + `useFormStatus` + signature `(_prev, formData)`.

**Quality gates:**
- `npm run typecheck` → 0 errors
- `npm run lint` → 0 errors, 1 warning pré-existente em `colecao/page.tsx` (PRODUCTS unused, fora do escopo)
- `npm run build` → Compiled in 62s Turbopack, 19 rotas estáticas, 8 SSG de produtos
- `wc -l` todos files ≤ 96 linhas (Art. VII ok)
- Nenhum hex hardcoded em novos files
- Zero exclamação em copy novo (WHATSAPP_MESSAGE pré-existente preservada)

**Clone consultations:** Nenhuma nova nesta sessão (brad-frost + drasner + rams já consultados em sessões anteriores para scaffold arquitetural; implementação seguiu padrões estabelecidos).

**Blockers remanescentes (NÃO bloqueiam merge):**
- Assets Nano Banana 2 (ambientes/produtos/thumbs) — ImagePlaceholder shimmer cobre até swap. Registrado como BLOCKED-BY no JSDoc de `image-grid.tsx`.

**Status:** **READY FOR S-7.3 Quality Gate** (@ux-design-expert visual-regression + a11y-check + validação rigorosa vs approved-variants/{home,produto-berlin,contato}.png).

**How to apply:** Ao retomar, @dev aguarda review do @ux-design-expert em S-7.3. Se QA aprovar, @devops pode fazer push. Se QA apontar ajustes, `*apply-qa-fixes` cobrirá.

### Sessão 16 — 2026-04-16 (S-7.2 Quality Gate)

**Reviewer:** @ux-design-expert (Uma) — review gate autônomo, zero delegação (regra "clones executam work criativo, chefe aprova"). Plano SQUAD (5 clones) já cobria decisões; consulta extra não foi necessária.

**Veredito:** **APPROVED** — 13/13 ACs pass, zero minor fixes, zero issues bloqueantes.

**ACs verificadas (13/13):**
- AC-1 step-indicator dinâmico (Array.from + customizationOptions.length) ✅
- AC-2 swatch-picker compound (Context + .Option + ring-2 full + aria-live) ✅
- AC-3 form-field WCAG (border full gold-accent, aria-required/invalid/describedby, role=alert live) ✅
- AC-4 faq-item nativo (`<details>`, zero 'use client') ✅
- AC-5 stats-row sans-serif (consome TextPair atom S-7.1) ✅
- AC-6 image-grid consolidado (variants project|related) ✅
- AC-7 cta-block solid (sem gradient, border-top gold-deep/40) ✅
- AC-8 Server Action ('use server' + (_prev, formData) + useActionState + useFormStatus + redirect) ✅
- AC-9 HOME hero left-aligned (max-w-5xl, sem text-center) ✅
- AC-10 PRODUTO split 3 templates (28/52/64L, product-layout 91L) ✅
- AC-11 CONTATO concierge 720px (max-w-[720px] em page-layout, sem telefone/endereço rua) ✅
- AC-12 Art. VII (max swatch-picker 96L, todos ≤ 100) ✅
- AC-13 spot-check visual (estrutura alinhada às 3 PNGs aprovadas) ✅

**Sanity checks:**
- Hex hardcoded em molecules/organisms novos: 0 matches ✅
- `'use client'` só em 3 arquivos novos (swatch-picker, concierge-form, product-customization) — todos justificados por hooks client ✅
- Exclamação em copy: 0 (`!p.isNew` é negação JS, `!text-3xl` é Tailwind important) ✅
- BLOCKED-BY assets Nano Banana 2 documentado em image-grid.tsx:7-9 e product-gallery.tsx:6 ✅

**Mudanças aplicadas:**
- `docs/stories/S-7.2-components-pages.md` frontmatter: `Review` → `Done`
- Seção "Review — Quality Gate" adicionada com tabela 13 linhas AC-by-AC

**Minor fixes:** nenhum.

**Clone consultations:** nenhuma nova nesta sessão.

**Próximo passo Orion:** **S-7.3 DESTRAVADA** — spawn @ux-design-expert (ou @qa) para QA+a11y+visual regression (~4.5h):
1. Pixel-diff rigoroso das 3 páginas vs approved-variants PNGs (≤5%)
2. axe/Lighthouse WCAG 2.2 AA (contraste focus ring, radiogroup nav)
3. Testes Server Action (pending/error/redirect states)
4. Teste keyboard `<details>` FAQ (Tab/Enter/Escape)
5. Log known-gaps para swap de placeholders quando Nano Banana 2 liberar (não-bloqueante)

**How to apply:** Ao retomar, Orion spawna S-7.3 quality gate. Se S-7.3 passar, @devops pode fazer push do conjunto S-7.1 + S-7.2 + S-7.3 num único PR.

### Sessão 17 — 2026-04-16 (S-7.3 QA executado em 3 chunks + P0 fixes)

**Contexto:** sessão anterior crashou com heap OOM no @qa rodando S-7.3 inteira. Estratégia adotada: dividir em 3 chunks isolados (subagents separados, sequencial via TaskCreate blockedBy).

**Chunk A — Bloco 1 a11y (axe + focus + keyboard):**
- axe-core: 0/0/0/0 home+contato; 2 critical em produto (F-01: `role="listitem"` orphan no `image-grid` variant=related)
- Focus contrast: 22/22 PASS (>= 3:1, max 14.17:1, focus-border #D4AF37 sobre noir = 9.34:1)
- Keyboard nav: 15/15 PASS (`<details>`, swatch-picker arrow keys, concierge-form tab order)
- Artefatos: `s-7.3-axe-report.json`, `s-7.3-wcag-log.md`, `s-7.3-keyboard-log.md`, `tests/qa/{axe-run,focus-contrast,keyboard-nav}.spec.ts`, `playwright.config.ts`

**Chunk B — Bloco 2 Lighthouse + visual:**
- Lighthouse desktop ótimo (Perf 95-100); mobile DEV mode 57-88 (esperado, requeria revalidação prod)
- Visual regression: contato 4.82% PASS, produto 18.74% EXPECTED-DIFF (Berlin ref vs Tenro Luxo content), home 32.2% NEEDS_REVIEW (baselines são thumbnails 125x512, não viewport 1440x900)
- Artefatos: 12 reports lighthouse, 6 PNGs visual, `tests/qa/visual-regression.spec.ts`

**Chunk C — Blocos 3+4 (copy + Server Action + tests + Art VII):**
- Copy pt-BR: 0 exclamação, blacklist 0 matches, vocabulário canônico presente, telefone/email corretos
- F-SA-01 P0 (NOVO): Server Action HTTP 500 — `submit-concierge.ts` exportava INITIAL_CONCIERGE_STATE (objeto) junto com função, viola Next 16 strict 'use server'
- Vitest: 37/37 PASS, 6 componentes 100% statements (concierge-form 40% branches por mock jsdom — waiver, branches cobertas por Playwright)
- Art VII: 0 violações de componente (max swatch-picker 96L); page atelier 127L exemption documentada
- Artefatos: copy-log, coverage, art7-audit, known-gaps, 6 unit tests, vitest.config.ts

**Fixes P0 pelo @dev:**
- F-01 fix: removeu role="list"/"listitem" de `image-grid.tsx` (causa raiz era ImageGrid variant="related" em product-layout, não product-card como brief original)
- F-SA-01 fix: extraído `INITIAL_CONCIERGE_STATE` + types para `submit-concierge.types.ts` sibling sem 'use server'. Arquivos: `submit-concierge.ts`, `submit-concierge.types.ts` (novo), `concierge-form.tsx`, `server-action.spec.ts` (1 linha header Location)
- Verificação: axe 0/0/0/0 nos 3 pages, server-action.spec 2/2 PASS

**Quality gate @ux-design-expert:** PASS-WITH-WAIVERS, story status `Review`→`Done`. Gate decision em `docs/qa/s-7.3-gate-decision.md`. Pre-push obligation: revalidar Lighthouse contra `npm run build && npm start` (mobile Perf >= 90 obrigatório).

**Fix bonus F-02:** swatch-picker `aria-label={caption}` (label-content-name-mismatch moderate). axe agora 0/0/0/0.

**How to apply:** Stories Epic 7 todas DONE. Próximo bloco é otimização de performance prod (Sessão 18).

### Sessão 18 — 2026-04-16 (Perf optimization Lighthouse v1→v4 + tree-shake)

**Contexto:** quality gate exigia Lighthouse build+start mobile Perf >= 90 antes do push. Iterações abaixo.

**v1 prod (build+start, primeira run):** / 86 FAIL, /produto 94 PASS, /contato 100 PASS

**Plano @architect** (`docs/architecture/perf-optimization-home-2026-04-16.md`):
- LCP root cause: `<motion.div fadeInUp>` envolvendo H1 hero (`hero.tsx`), render delay 790ms
- 5 patches ordenados por ROI: #1 hero CSS keyframe (XS, +4-6), #2 browserslist modern (XS, +1), #3 optimizePackageImports framer (XS, +0-1), #4 dynamic import group (M), #5 scroll indicator CSS (S)

**Patch #1 (com APPROVE-WITH-ALTERNATIVE do @ux):**
- Removeu motion.div fadeInUp do label+H1 só, manteve subtitle/CTAs/scroll com framer
- CSS keyframe `fade-up-hero` em `globals.css` aplicado a `.hero-h1, .hero-label` (sem animation-delay — LCP livre)
- Compositor-only (transform/opacity), preserva entrance Gilded Noir

**Patch #2:** browserslist `chrome>=100, firefox>=100, safari>=15, edge>=100` em `package.json` (drop legacy polyfills)

**Patch #3:** `experimental.optimizePackageImports: ['framer-motion']` em `next.config.ts`

**v2 prod (post #1+#2+#3):** / 85, /produto 90, /contato 93 — REGRESSION /contato (-7), hipótese: patch #3 reorganizou chunks

**Patch #3 REVERTED** (Task 12)

**v3 prod (post revert):** / 84, /produto 94 (+4 vs v2), /contato 95 (+2 vs v2) — hipótese parcialmente confirmada (#3 prejudicava /contato), só / restou RED

**Patch #1b (cascade extension):**
- Removeu motion.div do subtitle + CTAs row em hero.tsx
- Adicionou classes `.hero-subtitle` (delay 200ms), `.hero-ctas` (delay 350ms)
- LCP node (H1) sem delay, preserva cascade visual

**v4 prod (post #1b, 3-run median):** / median 89 (runs 89/88/91), /contato median 94 (runs 94/95/93) — FAIL por 1 ponto cada. Patch #1b VALIDADO (-0.4s LCP, -80ms TBT, +5 Perf vs v3). 54 KiB unused JS em 2 chunks identificada

**Patch #2b (tree-shake — Sessão 18 final):**
- Chunks identificados: `179yhr.f5zkci.js` (React/Next runtime, NÃO endereçável) + `000bbmjxy6ix7.js` (framer-motion completo, 126KB com 64% unused)
- Estratégia: eliminação total — `framer-motion` era importado em EXATAMENTE 1 arquivo (hero.tsx). Patches #1+#1b já moveram H1/label/subtitle/CTAs pra CSS. Restaram só staggerContainer (no-op) + scroll indicator (delay 2s).
- Removeu motion inteiro do hero.tsx (agora server component puro, sem 'use client'). Adicionou keyframe `fade-in-scroll` em globals.css pra scroll indicator
- Bundle: 872KB → 744KB (-128KB). framer-motion ZERO no bundle prod
- typecheck/lint PASS, axe 0/0/0/0 nos 3 pages
- Story `S-7.3-qa-a11y.md` Dev Agent Record "Post-QA fixes" com Patch #2b

**Status no final da sessão:**
- Stories S-7.1 + S-7.2 + S-7.3 todas DONE
- Patches aplicados: #1, #1b, #2, #2b (#3 revertido)
- Lighthouse v5 PENDENTE — ainda não rodou após patch #2b
- Push PENDENTE — aguarda v5 PASS gate (/ >= 90 + /contato >= 95)
- Memory salva, commit local feito (não push)
- Dev server foi subido pro user ver site visualmente

**Arquivos finais alterados nesta sessão (Tocks v2):**
- `src/components/organisms/hero.tsx` (server component puro, sem framer-motion)
- `src/components/organisms/image-grid.tsx` (F-01 fix)
- `src/components/molecules/swatch-picker.tsx` (F-02 fix aria-label)
- `src/components/organisms/concierge-form.tsx` (imports atualizados)
- `src/app/actions/submit-concierge.ts` (refatorado)
- `src/app/actions/submit-concierge.types.ts` (NOVO)
- `src/app/globals.css` (keyframes fade-up-hero + fade-in-scroll, classes hero-*)
- `package.json` (browserslist modern, deps QA: playwright/axe-core/lighthouse/pixelmatch/vitest)
- `next.config.ts` (limpo, sem experimental)
- `vitest.config.ts` (NOVO)
- `playwright.config.ts` (NOVO)
- `tests/qa/` (5 specs novos)
- `tests/unit/` (6 unit tests + setup)
- `docs/qa/s-7.3-*.md` + lighthouse/ + visual/ + reports
- `docs/architecture/perf-optimization-home-2026-04-16.md`
- `docs/stories/S-7.{1,2,3}-*.md` (todas DONE)

**How to apply:** AO RETOMAR — primeiro spawnar @devops Lighthouse v5 (mobile / + /contato 3-run median). Se PASS → @devops commit final + push. Se / ainda < 90 ou /contato < 95 → escalar @architect patches #4-#5 (dynamic import group, scroll indicator CSS via getBoundingClientRect ao invés de motion). Se variância LH inflar/deflar pontuação, considerar 5-run median antes de decidir.

### Sessão 19 — 2026-04-17 (Mind Clone review squad antigo do trabalho perf)

**Trigger:** user feedback verbatim: "por que tudo que meu squad antigo de design fazia é melhor que este squad novo". Diagnóstico Orion: Sessões 17-18 violaram a regra `feedback_use_mind_clones.md` + `feedback_mindclones_as_workers.md`. Decisões de perf (patches #1, #1b, #2b) tomadas só por @architect/@ux-design-expert/@dev sem consultar mind clones (don-norman, tobias-van-schneider, val-head). Output técnicamente correto mas blando — sem voz, sem tensão criativa, sem "feeling" Gilded Noir.

**Squad reconstituído (Sessão 19):**
- **don-norman** (`8c811789-93cb-4886-8dd0-597b94a69e03`) — usability + signifiers
- **tobias-van-schneider** (`0709df5f-4e9d-4e32-bd71-c49e363bd0b6`) — luxury voice + entrance ritual
- **val-head** (`805d7efd-1993-48a1-9a21-a3ced101b99a`) — motion design + timing

**Hierarquia:** clones EXECUTARAM análise crítica → @design-chief sintetizou tensões → ratificação @ux-design-expert pendente.

**Verdicts individuais (raw em `docs/qa/s-7.3-mindclone-raw-2026-04-17.md`):**

- **don-norman:** Hierarquia visual intacta (tipografia + contraste fazem o trabalho), mas perdeu signal de **status** (luxury vs commodity). Stagger uniforme com mesma duração = "placebo perceptual" (NN/g 2020). Hermès/Loewe (Baymard Q4/24) lideram com stillness, não barulho 0/200/350. Recomenda diferenciar curves, aumentar translateY 24→32px, antecipar scroll indicator, validar com 5-second test (Krug).
- **tobias-van-schneider:** Decisão de remover framer-motion foi correta, mas REPLACEMENT virou template. Premium vive em micro-detalhes invisíveis (spring damping, scale settling) que usuário PAGA sem perceber. Hermès/Loewe/Aesop usam scarcity de motion (1-2 elementos), não 4. Brand contract Gilded Noir não foi violado por remover framer — foi violado pela **uniformidade de keyframe**. Cirurgia: scale 0.99→1 no subtitle, distances diferenciadas, ease exponencial. Bundle stays at 744KB.
- **val-head:** Easing atual `cubic-bezier(0.22,1,0.36,1)` é quartic — ágil demais para luxury ("flick" produtivo, 90% movimento em 250ms). Substituir por `ease-out-expo (0.16,1,0.3,1)` — settling. Delays 0/200/350 nem rítmico nem aleatório (gap menor no segundo intervalo quebra ritmo). Deveria ser crescente 0/250/550. translateY 24px abaixo do motion threshold (Treisman 1985 = 100 device-px/s). **BLOCKER NÃO-NEGOCIÁVEL: zero `prefers-reduced-motion` = a11y violation.**

**Tensão produtiva (3 concordam, 2 conflitam):**
- Concordam: bundle removal correto, H1 sem delay correto, implementação atual underbaked, solução é CSS-only ~30 linhas, subtitle/CTA precisam diferenciação do H1.
- Conflitam: don quer 32px no H1 (motion threshold) vs val quer 16px (LCP wins). **Resolução @design-chief:** 16px no H1 (LCP protegido), 32px no subtitle (perception), 20px no CTA (peso intermediário) — cada clone ganha no seu domínio.

**Patch verdict matrix:**

| Patch | Verdict | Driving Clone |
|-------|---------|---------------|
| #1 (motion off H1, no delay) | **PRESERVE** | val-head |
| #1b (delays uniformes 0/200/350) | **ALTER → Patch #2c** | tobias + val |
| #2b (framer-motion full removal) | **PRESERVE** | tobias + val |
| **#2c NOVO (CSS choreography + a11y blocker)** | **APPLY (mandatory)** | val (blocker) + tobias (craft) + don (validation) |

**Patch #2c spec (substitui linhas 151-179 de `globals.css`):**
```css
@keyframes fade-up-h1 { from { opacity: 0; transform: translate3d(0, 16px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
.hero-h1, .hero-label { animation: fade-up-h1 700ms cubic-bezier(0.16, 1, 0.3, 1) both; will-change: opacity, transform; }
@keyframes fade-up-subtle { from { opacity: 0; transform: translate3d(0, 32px, 0) scale(0.99); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
.hero-subtitle { animation: fade-up-subtle 800ms cubic-bezier(0.16, 1, 0.3, 1) 250ms both; will-change: opacity, transform; }
@keyframes fade-up-cta { from { opacity: 0; transform: translate3d(0, 20px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
.hero-ctas { animation: fade-up-cta 700ms cubic-bezier(0.16, 1, 0.3, 1) 550ms both; will-change: opacity, transform; }
.hero-scroll-indicator { animation: fade-in-scroll 1800ms ease-out 1500ms both; will-change: opacity; }
@media (prefers-reduced-motion: reduce) {
  .hero-h1, .hero-label, .hero-subtitle, .hero-ctas, .hero-scroll-indicator { animation: none; opacity: 1; transform: none; }
}
```

Bundle delta: **+0 bytes**. LCP delta: **0ms** (compositor-only). A11y: **fixa blocker `prefers-reduced-motion`**.

**Status no final:** user disse "deixe assim por enquanto e salve tudo" — Patch #2c NÃO foi implementado. Spec preservado em `docs/qa/s-7.3-mindclone-review-2026-04-17.md`.

**Arquivos produzidos Sessão 19:**
- `D:\AIOS\apps\tocks-website\docs\qa\s-7.3-mindclone-raw-2026-04-17.md` (responses verbatim 3 clones)
- `D:\AIOS\apps\tocks-website\docs\qa\s-7.3-mindclone-review-2026-04-17.md` (síntese + diff table + Patch #2c spec)

**How to apply:** AO RETOMAR (Sessão 20+):
1. Decidir se aplica Patch #2c. Se sim → @dev implementa (substituir linhas 151-179 globals.css) → @devops Lighthouse v5. Se não → registrar waiver "luxury motion choreography pendente para Epic 7.5".
2. **MANDATORY:** acessibilidade `prefers-reduced-motion` é blocker independente de qualquer outro patch. Rule moving forward: TODA animação CSS nova precisa do media query.
3. Próxima vez: SEMPRE convocar mind clones para decisões criativas (UX, motion, copy, brand). Ignorar essa regra retorna trabalho técnico mas blando.
