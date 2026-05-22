# EPIC-8 Rebrand v2 Implant — Orchestration Plan

**Autor:** Nova (@design-lead) — Visionary Design Lead & Creative Director
**Data:** 2026-05-16
**Story canon:** `D:/AIOS/docs/stories/serenity-ai/active/SAI-RB-001-rebrand-v2-implant.md`
**Sprint window:** Sprint 4 (semanas 9-10) paralelo com Sprint 1-3 core safety
**Time:** 2 designers (1 senior + 1 mid) + @dev (Dex) + @qa
**Effort:** 50-80h dev / 1.5-2 sprints

---

## 1. Orchestration Plan — Quem faz o que, em que ordem

Eu orquestro. Designers produzem. Dev integra. QA valida. Founder dá veto final em assets visuais com pessoas. Sem ego, sem ping-pong: cada gate tem owner único, reviewer único, e critério numérico.

### Squad assignment matrix

| Track | Owner primario | Co-owner | Reviewer (gate) | Aprovador final |
|-------|---------------|----------|----------------|-----------------|
| **T0 Pre-flight** (8 itens) | @dev (Dex) | @devops | @design-lead | @design-lead |
| **T1 Tokens + Fonts + Tailwind** | @design-systems-engineer (senior) | @dev | @design-lead + @ui-designer | @design-lead |
| **T2 Icones (4 custom)** | @ui-designer (mid) | @design-systems-engineer | @design-lead | @design-lead |
| **T3 Logo D3 5 sizes** | @ui-designer (senior) | @motion-designer | @design-lead | @design-lead solo |
| **T4 Ilustracoes I-01..I-05** | @ui-designer + freelancer T3 (se disponivel) | @ux-design-expert | @design-lead | @design-lead + founder |
| **T5 Flux renders Warm** | @ui-designer | @ux-design-expert (Uma — voice fit) | @design-lead | **founder veto** |
| **T6 ChatWindow migration** | @dev | @ux-designer | @qa + @ux-design-expert | @design-lead |
| **T7 Mood + Breathing migration** | @dev | @motion-designer | @qa + @ux-design-expert | @design-lead |
| **T8 Onboarding + Hero migration** | @dev | @ux-writer (voice "voce sempre") | @qa + @ux-design-expert | @design-lead |
| **T9 Theme switcher + QA full** | @design-systems-engineer | @qa | @design-lead + @qa | @design-lead + @qa joint |
| **T10 Rollout 10-50-100%** | @devops | @dev | @qa | @devops |

### Critical path (sequencial, nao paralelizavel)

```
T0 (pre-flight #1-#8)
   ↓ BLOCKS
T1 (tokens+fonts+Tailwind)
   ↓ BLOCKS  ←— Gate 1 aqui
T2..T5 (assets paralelos — 4 tracks concorrentes)
   ↓ BLOCKS  ←— Gates 2 e 3 aqui
T6..T8 (components migration — sequencial por feature flag)
   ↓ BLOCKS  ←— Gate 4 aqui
T9 (theme switcher + multi-browser)
   ↓ BLOCKS  ←— Gate 5 aqui
T10 (canary 10→50→100)
```

Critical path real: **T0 → T1 → (T3 logo + T5 Flux founder veto) → T6/T7/T8 → T9 → T10**. Tudo paralelo no meio (T2/T4) nao bloqueia se atrasar — sao patches, nao spine. **Founder veto em T5 é o unico single point of failure externo** ao squad — mitigar com budget de 3 tentativas e prompt review @ux-design-expert antes de gastar API call.

### Paralelizacao ressources

- Semana 9 dias 1-2: T0 (Dex + @devops). Eu rodo `*lookup-design anipis vertical=wellness` no library 69-brand pra checar se cor coral + co-regulation motion tem precedent que defenda decisao em design review.
- Semana 9 dias 3-5: T1 design-systems-engineer trabalha tokens enquanto @ui-designer abre 4 sub-tracks (T2 icones / T3 logo / T4 ilustracoes / T5 Flux prompts draft). Daily sync mantem-os alinhados.
- Semana 10 dias 1-3: T6/T7/T8 — Dex implementa um componente por dia, em ordem de risco crescente (ChatWindow = menos risco visual, MoodCheckin = risco contraste, Hero = risco LCP).
- Semana 10 dias 4-5: T9 QA full pass + T10 canary deploy.

---

## 2. Cinco Design Gates — sequenciais, todos com PASS/FAIL numerico

### Gate 1 — Tokens + Tailwind funcionando (fim semana 9 dia 4)

**Owner:** @design-systems-engineer
**Reviewer:** @design-lead
**Validacao:** componente proof-of-concept simples (botao primary + heading General Sans) renderizado em `apps/web/src/app/_dev-proof/page.tsx` (rota nao publica).

PASS/FAIL criteria:
- `tokens.json` → `tokens.css` → Tailwind theme: **100%** dos 70 tokens v2 mapeados (run `npm run validate-tokens-coverage`, exit code 0).
- WCAG AA: botao primary Aurora Coral `#DC6B3A` sobre `bg.surface` Warm → contrast ratio **≥ 4.5:1** (validar via `contrast_check` MCP).
- Zero CSS warnings de var nao definida (`csstree-validator` zero errors).
- Tailwind classes `bg-primary-500 text-on-primary font-heading` renderizam visualmente correto em browser real (screenshot commit em `docs/qa/SAI-RB-001-gate-1-proof.png`).

FAIL = nao avanca. Designer refaz token mapping. Sem excecao.

### Gate 2 — 4 icones SVG + Logo D3 5 sizes prontos (fim semana 9 dia 5)

**Owner:** @ui-designer
**Reviewer:** @design-lead solo (autoridade)
**Entregavel:** SVG inline + PNG fallback em `public/brand/`.

PASS/FAIL criteria:
- **Icones (4):** SVG viewBox `0 0 24 24`, stroke-width consistente **1.5px**, peso visual harmonioso com Phosphor Icons (test sobreposicao em mesmo container). Cada icone < **3KB** (otimizado SVGO).
- **Logo D3:** 5 sizes (16, 24, 32, 64, 128px) × 3 variants (light/dark/mono) = **15 SVGs** + **45 PNGs** (@1x/2x/3x). Favicon set Next.js 15 completo (`favicon.ico` + `icon.svg` + `apple-icon.png`).
- **Motion breathing:** componente `<Logo>` renderiza animacao `breathe` 4s ease-in-out infinite. Em `prefers-reduced-motion: reduce` → animacao desliga, renderiza estatico sem layout shift (CLS = 0).
- **Optical alignment:** logo 32px renderizado ao lado de heading General Sans 32px → baseline alinhado a olho (subjetivo — meu sign-off solo conta).

FAIL = volta pro @ui-designer. Maximo 2 iteracoes antes de eu chamar reforco do squad-creator pra outro designer.

### Gate 3 — 3 Flux renders Warm aprovados (semana 9 dia 5 → semana 10 dia 1)

**Owner:** @ui-designer + Uma (@ux-design-expert) review
**Reviewer:** @design-lead
**Aprovador final:** **founder Breno veto** (assets visuais que aparecem na frente do usuario sao sensiveis Anipis — narrativa terapeutica, multi-ethnic representation, evitar uncanny valley)

PASS/FAIL criteria:
- **Cost contained:** total gasto Replicate API ≤ **$1.20** (budget $0.90 + buffer 1 retry, $0.30/render). Se estourar, fallback gradient CSS pre-definido.
- **Prompt quality:** prompt + seed + model version manifestados em `docs/qa/flux-manifest.json`. Reproducibility check: regenerate mesmo seed = output ≥ **95% pixel similarity** (PSNR > 30dB).
- **Brand fit:** 3/3 imagens passam check Warm palette dominance (>= **60%** pixels em hex range `#DC6B3A ± 15%` HSL via `color_palette` MCP extract).
- **Voice fit:** Uma confirma “sensacao co-regulacao, nao apresentacao corporativa, nao foto-stock”. Texto livre dela em `flux-review-uma.md`.
- **No human faces in hero ambient** (Tier 1 hand-drawn warm minimal — reference Wei Xin / Andy Carolan). Onboarding horizonte = paisagem, sem pessoa. Theme thumbs = abstratos.
- **Founder veto:** Breno aprova explicito (typed “aprovo flux renders anipis”) OR rejeita com motivo. Sem veto = nao commit, mesmo se tudo acima PASS.

FAIL trigger 1: budget estourou sem founder approval → eu autorizo gradient CSS fallback (degrade graceful previsto Risk R4). FAIL trigger 2: founder rejeita prompt direction → 1 nova iteracao maxima, depois fallback.

### Gate 4 — 5 componentes migrados com WCAG AA minimo (semana 10 dia 3)

**Owner:** @dev (Dex) implementacao + @design-systems-engineer integration
**Reviewer:** @qa + @ux-design-expert + @design-lead
**Aprovador final:** @design-lead

PASS/FAIL criteria por componente (5 componentes, todos precisam PASS):
- **axe-core score ≥ 90** em cada um dos 5 componentes (ChatWindow, MoodCheckin, BreathingExercise, OnboardingFlow, HeroPage). Rodando em rota dev isolada com Storybook OR test page.
- **AAA contrast crisis screens:** CrisisAlert/CrisisFullScreen/CrisisBanner usam tokens v2 → contrast ratio **≥ 7:1** em texto + **≥ 4.5:1** em ui-components. Manual review @design-lead obrigatorio.
- **Voice v2 lint PASS:** custom ESLint plugin detecta zero violations “positividade toxica” (regex anti-padroes “tudo vai dar certo”, “seja feliz”, “positive vibes”). Override `/* voice-v2-allow */` requer comentario justificando + meu approval.
- **Feature flag isolation:** cada componente flagged independente. Smoke test flag ON → renderiza v2. Flag OFF → renderiza v1 legacy intacto (rollback fica garantido).
- **Visual regression:** Chromatic OR Percy 45 snapshots (5 comp × 3 themes × 3 breakpoints) baseline aprovado por mim. Diff posterior em PR review zero false-positive auto-merge.
- **Reduced-motion:** cada componente testado com `prefers-reduced-motion: reduce` → motion ambient desliga, transicoes < 200ms, zero parallax crisis. Documentar PASS em PR description.

FAIL em qualquer componente = volta pra Dex. PR nao merge no `feat/anipis-rebrand-v2-sprint4` ate fix.

### Gate 5 — Multi-theme + reduced-motion + cross-browser QA (semana 10 dia 5)

**Owner:** @design-systems-engineer + @qa
**Reviewer:** @design-lead + @qa joint
**Aprovador final:** @design-lead + @qa joint (gate ultimo antes canary)

PASS/FAIL criteria:
- **Theme switcher:** `/settings/appearance` renderiza 3 themes (Warm/Calm/Soft) + dark mode toggle (apenas Warm). Switch instantaneo (zero flash, CSS-only via `data-theme`). Persistencia localStorage + Supabase `user_preferences` sync funcionando (test cycle: troca theme → reload → mantem).
- **Cross-browser BrowserStack:** Chrome + Safari + Firefox + Edge ultimas 2 versoes × 5 componentes principais × 3 themes = **120 screenshots** commitados em `docs/qa/SAI-RB-001-cross-browser/{browser}/`. Zero broken render (subjetivo: visual matches Chrome baseline ± **5% diff**).
- **Mobile real device:** iPhone 12+ iOS 17+ Safari (founder Breno) + Android Pixel 6+ Chrome. 5 componentes smoke test SEM bugs visuais reportaveis.
- **Lighthouse Performance:** delta vs baseline pre-flight ≤ **+5 pts** regression. Se regrediu > 5, investigar (provavel font preload OR Flux render LCP).
- **Bundle size:** delta total ≤ **+95KB** (fonts subset PT-BR limite). Validar `npm run analyze`.

FAIL = nao canary. Volta pra design-systems-engineer pra otimizar.

---

## 3. Risk Hotspots de Implementacao — onde rebrand QUEBRA

Risk register oficial ja tem R1-R10 (acessibilidade, theme complexity, fonts, Flux, dark, bundle, freelancer, voice, Replicate, sprint deps). Adiciono 3 hotspots **especificos da implantacao** que vejo como senior orchestrator e nao estao mapeados ainda:

### HOTSPOT A — Token namespace collision com legacy v3 Caderno

**O que pode quebrar:** legacy `apps/web/src/styles/design-tokens.css` (v3 Caderno) ja declara variaveis em `:root` com prefixos `--brand-ink`, `--brand-paper`, `--brand-spot` e arquitetura Brad Frost 3-layer (brand → semantic → component). Brand v2 vai injetar `:root` novo com `--primary-500: #DC6B3A` + multi-theme `[data-theme="warm|calm|soft"]`.

**Cenario quebra:** se @design-systems-engineer simplesmente importa `tokens.css` v2 sem mover legacy pra `_legacy-pre-v2/` PRIMEIRO (pre-flight #5), os dois `:root` blocks colidem. Pior: o v3 Caderno ja tem `[data-theme="madrugada"]`, `[data-theme="reducao-estimulo"]`, `[data-theme="crise"]`, `[data-theme="meditacao"]` — vai conflitar com v2 `[data-theme="warm"]`. Componentes que ainda leem v3 tokens (qualquer arquivo que use `--brand-spot`) quebram silenciosamente.

**Mitigacao mandatoria:**
1. Pre-flight #5 backup legacy NAO É opcional — bloqueador de Gate 1.
2. Grep audit antes de Gate 1: `grep -r "brand-ink\|brand-paper\|brand-spot" apps/web/src/` → zero hits OR todos hits estao em legacy snapshot.
3. Tailwind config v2 importado DEPOIS de remover Tailwind v3 (se houver). Validar com `npm run build` zero warnings.
4. Owner: @design-systems-engineer. Gate 1 nao passa sem isso.

### HOTSPOT B — Fraunces Italic weights subset PT-BR gap

**O que pode quebrar:** Fraunces Italic via Google Fonts oferece weights 100-900, mas o subset PT-BR (latin + latin-ext) pode nao incluir todos os glyphs italic em weights extremos (100, 200, 800, 900). Decisao bulk Uma D-UX-03 fechou em “Fraunces Italic uso 5-10% pull-quotes only” — o que sugere weight 500 medium provavel. Mas se Uma especificou weight 600 OR 700 no design e o subset PT-BR italic nao tem variant disponivel, renderiza fallback Newsreader Italic → quebra ritmo visual nos welcome messages e “momento Anipis”.

**Cenario quebra:** brand “premium adjunto-nao-substituto” depende do feel ritualistico da Fraunces. Fallback Newsreader Italic mantem readability mas perde diferenciacao Anipis vs Wysa/Zenklub. Fica generico em uma das poucas zonas em que voz visual brilha.

**Mitigacao mandatoria:**
1. Pre-flight #8 nao é check superficial — eu mando @design-systems-engineer rodar `fontTools subset` LOCAL antes de commit, output em `apps/web/public/fonts/fraunces-italic-{weight}.woff2`, validar com `Fraunces Italic weight 500 medium` renderiza string PT-BR completa “você está aqui agora”, “ções acentuação”.
2. Documentar em PR: weights bundle final + sample render screenshot.
3. Se gap detectado: fallback Newsreader Italic FUNCIONA (Risk R3 ja prevê), mas eu quero saber ANTES do Gate 4, nao depois de migrar OnboardingFlow.
4. Owner: @design-systems-engineer + @ui-designer review final fit.

### HOTSPOT C — Flux render Hero como LCP killer

**O que pode quebrar:** Flux 1.1 Pro renders saem em alta resolucao (1920x1080 hero + 750x1334 mobile hero). Se @dev integra como `<img>` direto sem otimizacao Next.js Image, isso vira Largest Contentful Paint do `/` (HeroPage) e Lighthouse Performance despenca. Risk R6 captou bundle size (+95KB), mas LCP image rendering é categoria diferente.

**Cenario quebra:** founder valida Flux render no Gate 3, parece lindo. Dev integra no Gate 4, axe-core passa, contrast passa. Mas Gate 5 Lighthouse mostra Performance score caiu 12 pts (LCP saltou de 1.8s pra 4.2s no mobile 3G simulado). Canary 50% rollout dispara alerta Sentry de Web Vitals regression. Rollback. Retrabalho na semana 11.

**Mitigacao mandatoria:**
1. Gate 4 component migration ChatWindow/Mood/Breathing/Onboarding nao precisa de Flux. Gate 4 Hero migration **obriga** Next.js `<Image>` com `priority`, `sizes` responsivo, AVIF + WebP fallback, blur placeholder pre-gerado.
2. Performance budget HeroPage: LCP < **2.5s** mobile (Lighthouse simulated 3G/4G mid-tier). Bloqueador Gate 5.
3. Se LCP > 2.5s, fallback CSS gradient Warm enquanto image lazy-loads (entrega skeleton terapeutico, nao branco).
4. Owner: @dev. Reviewer: @qa Lighthouse audit.

---

## 4. Coordination Protocol — daily sync async-first

**Filosofia:** sou Leo, gosto de comando claro. Mas Sprint 4 roda paralelo com Sprint 1-3 safety/crisis (Dex tambem alocado). Forcar daily call sincrona 15min vai degradar throughput. Async-first com check-in sincrono so quando bloqueio real.

### Cadencia

- **Daily async standup (Notion thread `SAI-RB-001-daily`)** — designers + Dex postam ate 10h BRT:
  - O que fechei ontem (1 linha por item migration-checklist).
  - O que vou fechar hoje.
  - Bloqueador? (se sim → ping @design-lead inline).
- **Sincrono 15min apenas se bloqueador postado** ≥ 12h sem resolucao. Eu chamo call ad-hoc.
- **Sync semanal 30min sexta 14h BRT** — review da semana, plan proxima semana. Founder convidado mas opcional.

### Comunicacao por canal

| Tipo | Canal | Owner |
|------|-------|-------|
| Daily progress | Notion thread async | designers + @dev |
| Bloqueador urgente | Ping direto @design-lead Slack/Telegram | quem bloqueou |
| Asset review (T2/T3/T4/T5) | Notion thread + screenshot inline + my decision | @ui-designer |
| Founder veto (T5 Flux) | Email/Telegram direto Breno + 24h SLA | @design-lead |
| Code review (PR) | GitHub PR comments | @dev + @qa + @design-systems-engineer |
| Gate decisions | Notion thread + commit em `gate-decisions-log.md` | @design-lead |

### Documentacao live

Eu mantenho `gate-decisions-log.md` no `08-rebrand-implant/` com 1 entrada por gate decided: data, PASS/FAIL, criterios atingidos, justificativa se override. Auditoria total para po e pm caso queiram revisar.

---

## 5. Sign-off Authority Matrix

| Decisao | Design-Lead solo | Cross-disciplinary | Founder veto |
|---------|------------------|--------------------|--------------|
| Token mapping fidelity | X | | |
| Logo D3 5 sizes export | X | | |
| 4 icones custom (flame/breath/companion/bridge) | X | | |
| Component visual fidelity vs mockups | X | | |
| Motion principles compliance | X (com @motion-designer review) | | |
| Voice v2 lint rules tuning | | X (@design-lead + @ux-design-expert + @ux-writer) | |
| Flux renders content/composition | | X (@design-lead + @ux-design-expert) | **X founder** |
| Multi-ethnic representation se renders mostrarem pessoas | | X (@design-lead + @ux-design-expert) | **X founder** |
| Accessibility AAA crisis screens | | X (@design-lead + @qa + @ux-design-expert) | |
| Lighthouse Performance budget | | X (@design-lead + @qa + @dev) | |
| Theme switcher UX final | | X (@design-lead + @ux-design-expert) | |
| Rollout 10→50→100 timing | | X (@design-lead + @qa + @devops) | |
| Cleanup legacy v1/v3 (apos 30d) | X (com @dev) | | |

**Founder veto exclusive:** Flux renders + representacao humana se aparecer. Nao negocio — Anipis é categoria sensivel (terapeutico-adjunto), founder tem skin no game, founder decide visual humano. Eu nao sobrescreve.

**Design-Lead solo:** decisoes tecnicas de design system, motion, contrast, lint, sem dimensao representational. Eu uso meu Mind Clone don-norman + dieter-rams quando em duvida (`*critique` ou consulta brain-bridge).

---

## 6. Decisao final tons de pele — guideline multi-ethnic Anipis 18-29 BR

Se em qualquer ponto (Flux T5 OR ilustracoes T4 OR foto fallback futura) emergir asset humano, vale o seguinte canon. Estabeleco AGORA antes do Flux gerar fait accompli:

### Brasil demografico real (IBGE PNAD 2022, projecao 2026)

Populacao 18-29 anos BR distribuicao etnica (auto-declaracao):
- **Parda:** ~46%
- **Branca:** ~40%
- **Preta:** ~11%
- **Amarela / Indigena:** ~3%

### Guideline para Anipis (target adulto-vulneravel 18-29 BR)

1. **Tier 1 Hand-drawn warm minimal (preferencia bulk Uma):** ilustracao abstrai feicoes especificas. Tons de pele se aparecerem usam **paleta intencionalmente quente desaturada** (`#C99B85`, `#8E6852`, `#5C3F30`, `#3B281E`) — 4-spot ladder. NAO pinkish brancoeuropeu generico, NAO blackish carvao saturado. **Tom default escolhido para silhuetas/figuras de fundo: medio-quente** `#A37456` (parda medio), refletindo plurality demografica BR. Variants visiveis incluir minimo 1 figura mais escura E 1 mais clara em qualquer composicao com >= 2 pessoas.
2. **Se composicao tem 1 pessoa apenas:** rotacionar entre 5 illustrations (I-01..I-05) — duas em tom medio-quente (parda), uma escura (preta), uma clara (branca), uma rosto oculto/silhueta neutra. Mistura natural sem feel de cota.
3. **Flux renders Warm theme (T5):** hero ambient e onboarding horizonte sao **paisagens sem rosto** (preferido bulk decision). Theme thumbs sao **abstratos coloridos**. Se algum prompt acidentalmente gerar pessoa, **rejeitar e regenerate** — Anipis MVP nao usa fotos de pessoas reais (Risk privacy + uncanny valley).
4. **Cabelos:** mesmo principio — minimo 1 cabelo cacheado/crespo em qualquer composicao multi-personagem. Default illustration ladder inclui texturas variadas (liso, ondulado, cacheado, crespo).
5. **Vestuario:** evitar marcadores etnicos especificos (ex. afro turbante caricatural OR fenotipo asiatico simplificado). Roupas modernas urbanas BR genericas — moletom, camiseta, blusa basica. Anipis nao é estudo antropologico, é app terapeutico.
6. **Veto absoluto:** zero uso de:
   - Pele uniformemente clara em todas as ilustracoes (default Wysa/Calm — generico americano).
   - Estereotipos visuais (cabelo loiro = feliz, cabelo escuro = triste, etc).
   - Imagens geradas que falham “mirror test” — usuaria parda 22 anos Salvador olha I-01 e nao se reconhece como possivel? FAIL, refaz.

### Validacao gate

- Antes commit em T4 (5 ilustracoes): @ux-design-expert (Uma) faz mirror test com 3 personas BR ficcionais distintas (Julia 24 SP parda, Marcos 28 RJ preto, Larissa 21 POA branca). Cada uma deve poder se ver representada em pelo menos 1 das 5 ilustracoes.
- Antes commit em T5 (Flux): se acidentalmente gerar humano, **rejeitar e regenerate** com prompt explicit “no human figures, landscape only”.
- Reviewer: @design-lead + @ux-design-expert joint. Founder veto se composicao final tiver pessoas.

---

## 7. Closing — Execucao

EPIC-8 nao é luxo. Backend Anipis ~70% em legacy Teal contra brandbook v2 aprovado bulk Uma hoje é **debt visual ativa** que cresce a cada commit em Sprint 1-3. Sprint 4 paralelo é a janela. Founder veto em T5 Flux + AAA crisis screens em Gate 4 + Lighthouse delta ≤+5pts em Gate 5 sao os 3 trip-wires reais — passou esses, rebrand entra em prod com confidence.

Eu monitoro os 5 gates. Designers produzem. Dex implementa. QA valida. Async-first. Founder veto onde importa. Mind Clone don-norman + dieter-rams + erik-spiekermann a 1 consult de distancia para qualquer ambiguidade.

Kickoff Sprint 4: assim que Sprint 3 fechar (final semana 8). Eu emito `*kickoff` formal + Notion thread + assignments.

— Nova, liderando o design 🎯
