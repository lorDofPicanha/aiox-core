# REBRAND v2 IMPLANT — Anipis · Pack Operacional v1

**Versao:** 1.0 · **Data:** 2026-05-16 · **Sprint window:** Sprint 4 (semanas 9-10)
**Owner orquestracao:** Nova (@design-lead) · **Owner tecnico:** Daria (@design-systems-engineer)
**Contribuidores:** Pax (@po), Pixel (@ui-designer), Flow (@ux-designer), Daria (@design-systems-engineer), Nova (@design-lead), Acacia Parks (positive psy advisor), GATE (landing-page-optimizer)
**Story canon:** `D:/AIOS/docs/stories/serenity-ai/active/SAI-RB-001-rebrand-v2-implant.md`

---

## TL;DR Executive

Em 16/Mai/2026 o user (Breno) aceitou bulk completo das 5 decisoes Uma rebrand v2 Anipis: **D-UX-01 Logo D3 Breathing Form**, **D-UX-02 Multi-theme B (Warm default + Calm + Soft opt-in)**, **D-UX-03 3 fonts (General Sans + Inter + Fraunces Italic)**, **D-UX-04 Caixinha de Cartas roadmap fase 2**, **D-UX-05 3 Flux renders Warm only $0.90 total**. Sprint 4 (semanas 9-10 do roadmap revisto pos-16/Mai) ships brand v2 em paralelo com Sprint 1-3 core safety/crisis features — nao bloqueia launch CFM window ago/2026.

Backend Anipis ~70% pronto esta divergente: usa Teal `#4A9BA8` legacy + DM Sans onde brandbook v2 manda Aurora Coral `#DC6B3A` + General Sans/Inter/Fraunces. Existe ainda layer intermediaria v3 "Caderno" (`apps/web/src/styles/design-tokens.css` com `--brand-ink/--brand-paper/--brand-spot` + `[data-theme="madrugada|reducao-estimulo|crise|meditacao"]`) que cria token collision hotspot REAL (nao hipotetico) com `[data-theme="warm|calm|soft"]` v2 — pre-flight #5 backup legacy nao opcional.

Pack consolida: **30 ACs sequenciais** + **10 Tasks** (50-80h dev / 1.5-2 sprints / 2 designers + 1 dev) + **5 Design Gates PASS/FAIL numerico** + token package `@serenity-ai/design-tokens` com namespace `--anipis-*` em Tailwind 4 CSS-first + 3 fonts self-hosted via `next/font/local` (subset PT-BR pyftsubset +69KB vs baseline 95KB) + multi-theme boot script anti-FOUC + 5 fases migracao SEQUENCIAL (F1 tokens-only zero diff → F2 fonts → F3 colors WCAG audit → F4 spacing/radius → F5 component overrides) com branch isolada por fase + dual-emit CSS vars 30d backward-compat + 81 logo assets matrix + 4 icones SVG signature (coordenadas Bezier construtivas) + 5 ilustracoes Tier 1 com freelancers BR nominados (Maria Ines Gul, Bruna Lubaszewski) + 3 Flux 1.1 Pro prompts ready-to-Replicate $0.90 total + 5 components migration specs mobile-first 320→1440px + PERMA Meaning sub-ativado 5/5 com 5 savoring moments + HeroPage 7 sections com formula "signal de seriedade > friction optimization" + 5 anti-patterns BANNED + Honest Trust rule.

Founder veto exclusivo: Flux renders + representacao humana. Critical path: T0→T1→(T3+T5)→T6/7/8→T9→T10. Metrica norte: psicologo(a) ver e dizer *"isso parece serio"*.

---

## 1. Strategic Context

### 1.1 Bulk Uma — 5 decisoes fechadas (Pax)

| Decisao | Resposta bulk aceita | Implicacao operacional |
|---------|---------------------|----------------------|
| **D-UX-01** Logo direction | **D3 Breathing Form** | Forma organica que respira — motion-as-brand + ownable + reduced-motion graceful |
| **D-UX-02** Theme MVP | **B) Multi-theme Warm default + Calm + Soft opt-in** | Theme switcher `/settings/appearance` + persist localStorage + Supabase sync |
| **D-UX-03** Fraunces Italic | **A) 3 fonts (General Sans + Inter + Fraunces Italic)** | Fraunces uso 5-10% pull-quotes only (welcome, "momento Anipis") |
| **D-UX-04** Caixinha de Cartas | **B) Roadmap fase 2** | NAO faz parte deste MVP — story separada futura |
| **D-UX-05** Flux renders | **3 renders Warm only $0.90 total** | Flux 1.1 Pro Replicate API — hero ambient + onboarding horizonte + theme thumbs |

Trigger original user (16/Mai): *"aceito bulk Uma rebrand v2 anipis"*.

### 1.2 Sprint 4 timing — janela operacional

Backend ~70% implementado (`apps/serenity-ai/apps/web/`) diverge do brandbook v2. Cada commit Sprint 1-3 em legacy Teal/DM Sans é **debt visual ativa que cresce**. Sprint 4 paralelo eh a janela: nao bloqueia funcionalidade core (chat + crisis + auth funcionam com legacy), mas P1-forte porque define percepcao brand no launch publico CFM ago/2026.

```
Sprint 1-3 (semanas 1-8):   backend safety + crisis + auth + chat LLM
Sprint 4   (semanas 9-10):  rebrand v2 implant (ESTE PACK)
Sprint 5   (semanas 11-12): beta launch + polish + A/B tests positive-psy + CRO
```

### 1.3 Frame estrategico GATE — signal de seriedade > friction optimization

GATE (landing-page-optimizer) inverte a equacao MECLABS classica para esta categoria: **em mental health BR low-trust pre-PMF, a constraint dominante NAO eh M (motivacao). Eh A (ansiedade/desconfianca).** Cada elemento que parece "anti-CRO" (CTA unico soft, sem countdown, sem exit-intent, Safety primer prominente acima da FAQ) eh **pro-CRO contextual** porque otimiza para signal de seriedade — exatamente onde Julia 22 anos cetica eh mais sensivel.

Metrica norte nao eh bounce rate. Eh: *"Julia mostra a HeroPage para um(a) psicologo(a) e essa pessoa responde — `isso parece serio`."* Esse eh o teste. Toda decisao deste pack passa por esse filtro.

### 1.4 Por que rebrand AGORA

Concierge MVP wrap-up D14 (13/Jun) → trafego organico 18-29 BR comeca em ~14/Jun. Phase 1 goal eh **waitlist qualitativa, nao scaling**. Brand v2 Aurora Coral + General Sans/Inter/Fraunces + multi-theme + 5 components migrados eh o que diferencia Anipis de Wysa/Zenklub/Cingulo no exato momento que trafego organico chega. Sem isso, percepcao brand fica confusa exatamente quando trust signal density per scroll inch precisa ser maximo.

---

## 2. Story SAI-RB-001 — refined

### 2.1 Executor assignment

```yaml
executor: "@design-systems-engineer + @dev"
co_designers: "@ui-designer + @ux-design-expert (Uma)"
quality_gate: "@design-lead + @qa + @ux-design-expert"
quality_gate_tools:
  - axe-core accessibility audit (WCAG AA min frontend / AAA crisis screens)
  - design tokens coverage audit (zero hardcoded values v1 Teal/DM Sans residual)
  - visual regression test via Chromatic OR Percy (5 componentes principais)
  - cross-browser test BrowserStack (Chrome + Safari + Firefox + Edge)
  - real device test (iPhone 12+ + Android Pixel 6+)
  - prefers-reduced-motion compliance audit
  - feature-flag rollout simulation (10% -> 50% -> 100%)
risk: HIGH
story_points: 13 (Fibonacci)
estimation: 50-80h dev / 1.5-2 sprints / 2 designers + 1 dev
```

### 2.2 30 Acceptance Criteria (resumo agrupado — story canon eh a referencia detalhada)

**Foundation — Tokens v2 + Fonts self-hosted (AC-1 a AC-7):**
- AC-1: Package shared `apps/serenity-ai/packages/design-tokens/` exporta `tokens.css` (3 themes) + `figma-tokens-v2.json` (W3C DTCG) + `tailwind.theme.ts` (Tailwind 4 extension).
- AC-2: `apps/web/src/styles/design-tokens.css` substituido por import do package — **zero referencias residuais** a `--brand-ink/--brand-paper/--brand-spot` legacy v3 OU Teal `#4A9BA8` / DM Sans.
- AC-3: 3 temas via `data-theme="warm|calm|soft"` no root. Warm default. Switcher `/settings/appearance` + localStorage + Supabase `user_preferences`.
- AC-4: Audit `scripts/validate-tokens.mjs` detecta zero hardcoded hex / font-family / px em componentes migrados.
- AC-5: 3 fonts em `public/fonts/` subset PT-BR — General Sans (4 weights), Inter (4 weights), Fraunces Italic (2 weights italic only).
- AC-6: Loading via `next/font/local` (NAO Google Fonts CDN — privacy LGPD + perf) com `font-display: swap` + preload.
- AC-7: Bundle impact +95KB max. Lighthouse Performance regression <=5 pts vs baseline.

**Iconography + Logo (AC-8 a AC-11):**
- AC-8: 4 icones customizados Anipis em SVG inline em `components/ui/icons/anipis/` — `anipis-flame.tsx`, `anipis-breath.tsx`, `anipis-companion.tsx`, `anipis-bridge.tsx`.
- AC-9: Phosphor Icons React (`@phosphor-icons/react`) instalado e configurado.
- AC-10: Logo D3 Breathing Form exportado em 5 sizes (16/32/64/128/256px) × 3 variants (light/dark/mono) + favicon set Next.js 15.
- AC-11: Componente `<Logo>` aceita `size`, `variant`, `animated` (motion breathing quando `prefers-reduced-motion: no-preference`).

**Illustrations + Flux (AC-12 a AC-15):**
- AC-12: 5 ilustracoes Tier 1 produzidas — I-01 empty chat (320×320), I-02 onboarding maos abertas (280×280), I-03 onboarding dialogo (280×280), I-04 onboarding horizonte (280×280), I-05 BreathingExercise aid (240×240).
- AC-13: Estilo "Warm Minimal Hand-Drawn" — linhas organicas, figuras humanas abstratas/sem rosto, paleta active theme 30-60% opacidade. NAO Headspace cartoony / NAO Storyset generico.
- AC-14: 3 renders Flux 1.1 Pro produzidos via Replicate API — hero ambient (1920×1080 + 750×1334), onboarding horizonte (1080×1080), theme thumbs (3× 200×150). Custo total $0.90.
- AC-15: Renders aprovados por @design-lead **antes** de commit. Manifest `renders-manifest.json` com prompt + seed + model version.

**Component Migration (AC-16 a AC-20):**
- AC-16: `ChatWindow.tsx` migrado — bubbles usando `--anipis-chat-bubble-user-bg/text` e `--anipis-chat-bubble-ai-bg/text/border`. Container max-width 480px (F-18).
- AC-17: `MoodCheckin.tsx` migrado — mood colors v2 DESSATURADAS, hex separados crisis (F-11 zero overlap).
- AC-18: `BreathingExercise.tsx` migrado — `anipis-breath` custom icon + motion principle "co-regulacao" (F-04). `prefers-reduced-motion` fallback experiencia paralela.
- AC-19: `OnboardingFlow.tsx` migrado — 3 ilustracoes I-02/I-03/I-04, transicoes suaves, copy voice "voce sempre" (F-08).
- AC-20: HeroPage migrada — path canon definido em Task 0 discovery. Logo D3 + Flux hero ambient + copy voice v2 + 3 CTAs primary.500.

**Multi-theme + Voice + Quality + Rollout (AC-21 a AC-30):**
- AC-21: Multi-theme switcher `/settings/appearance` — dropdown Warm/Calm/Soft + preview thumbs + persist localStorage + Supabase sync.
- AC-22: Voice v2 aplicada em 100% copy frontend dos 5 componentes — lint rule enforce.
- AC-23: Dark mode opcional incluido no Warm theme via `[data-theme="warm"][data-mode="dark"]`. Calm/Soft dark fica fase 2 (R5).
- AC-24: PDF brand reference servido em `/docs/brand-reference.pdf`.
- AC-25: WCAG AA validado via axe-core em CI gate (PR fail se score < 90). WCAG AAA manual review crisis screens.
- AC-26: Motion 5 principles (F-04) — co-regulacao, reduzido default, `prefers-reduced-motion` COMPLETO, easing brand-tokens, zero parallax crisis.
- AC-27: QA visual cross-browser commitado.
- AC-28: QA mobile real device PASS.
- AC-29: 5 stories backlog (SAI-005/007/011/100/102) marcadas `TO-MIGRATE`.
- AC-30: Feature flag `brand-v2-enabled` por componente — rollout 10% → 50% → 100% com auto-rollback Sentry.

### 2.3 10 Tasks com horas estimadas

| Task | Descricao | Owner | Horas |
|------|-----------|-------|-------|
| **T0** | Discovery + Setup (package + workspace dep + backup legacy) | @dev + @devops | 2-3h |
| **T1** | Tokens + Fonts + Tailwind theme | @design-systems-engineer | 4-6h |
| **T2** | 4 icones SVG customizados (flame/breath/companion/bridge) | @ui-designer | 6-8h |
| **T3** | 5 ilustracoes Tier 1 (I-01 a I-05) | @ui-designer + freelancer BR | 10-14h |
| **T4** | Logo D3 export 5 sizes × 3 variants + favicon set | @ui-designer | 2-3h |
| **T5** | 3 Flux renders Warm via Replicate API ($0.90) | @ui-designer + Replicate | 1h |
| **T6** | Migrar ChatWindow | @dev | 4-6h |
| **T7** | Migrar MoodCheckIn + BreathingExercise | @dev | 6-8h |
| **T8** | Migrar OnboardingFlow + HeroPage | @dev | 8-10h |
| **T9** | Multi-theme switcher + WCAG + Cross-browser QA | @design-lead + @qa | 6-8h |
| **T10** | Rollout + Story Backlog Update | @devops + @po | 2-3h |
| | **Total** | | **51-70h** |

### 2.4 Definition of Done

Definition of Done canonica vive na story `SAI-RB-001`. Highlights:
- Tokens v2 package shared criado + integrado (3 themes) com namespace `--anipis-*`.
- 3 fonts self-hosted + preload + subset PT-BR + bundle <+95KB delta.
- 81 logo assets + 4 custom icons + Phosphor base + 5 ilustracoes Design Lead approved + 3 Flux renders manifest commitado ($0.90).
- 5 componentes migrados + multi-theme switcher funcional + dark mode Warm + PDF brand reference servido.
- Voice v2 100% + lint rule passa. WCAG AA axe-core CI score >=90 + AAA manual crisis screens. Motion 5 principles + `prefers-reduced-motion` COMPLETO.
- QA cross-browser commitado + mobile real device PASS. Feature flag rollout 10→50→100% executado + Sentry alerts. 5 stories legacy marcadas TO-MIGRATE. Lighthouse Performance nao regride >5 pts.
- **Sign-off:** @design-lead aprovou visual final + @ux-design-expert aprovou voice + @qa aprovou QA + @pm aprovou alinhamento brand.

---

## 3. Orchestration Plan (Nova)

### 3.1 Filosofia

Nova orquestra. Designers produzem. Dex implementa. QA valida. Founder da veto final em assets visuais com pessoas. Sem ego, sem ping-pong: cada gate tem owner unico, reviewer unico, e criterio numerico. Async-first em Notion, sincronia 15min apenas quando bloqueio real.

### 3.2 Squad Assignment Matrix

| Track | Owner primario | Co-owner | Reviewer (gate) | Aprovador final |
|-------|----------------|----------|----------------|-----------------|
| **T0 Pre-flight** (8 itens) | @dev (Dex) | @devops | @design-lead | @design-lead |
| **T1 Tokens + Fonts + Tailwind** | @design-systems-engineer | @dev | @design-lead + @ui-designer | @design-lead |
| **T2 Icones (4 custom)** | @ui-designer | @design-systems-engineer | @design-lead | @design-lead |
| **T3 Logo D3 5 sizes** | @ui-designer | @motion-designer | @design-lead | @design-lead solo |
| **T4 Ilustracoes I-01..I-05** | @ui-designer + freelancer T3 | @ux-design-expert | @design-lead | @design-lead + founder |
| **T5 Flux renders Warm** | @ui-designer | @ux-design-expert (Uma) | @design-lead | **founder veto** |
| **T6 ChatWindow migration** | @dev | @ux-designer | @qa + @ux-design-expert | @design-lead |
| **T7 Mood + Breathing migration** | @dev | @motion-designer | @qa + @ux-design-expert | @design-lead |
| **T8 Onboarding + Hero migration** | @dev | @ux-writer | @qa + @ux-design-expert | @design-lead |
| **T9 Theme switcher + QA full** | @design-systems-engineer | @qa | @design-lead + @qa | @design-lead + @qa joint |
| **T10 Rollout 10-50-100%** | @devops | @dev | @qa | @devops |

### 3.3 Critical Path

```
T0 (pre-flight #1-#8)
   ↓ BLOCKS
T1 (tokens + fonts + Tailwind)
   ↓ BLOCKS  ←— Gate 1
T2..T5 (assets paralelos — 4 tracks concorrentes)
   ↓ BLOCKS  ←— Gates 2 e 3
T6..T8 (components migration — sequencial por feature flag)
   ↓ BLOCKS  ←— Gate 4
T9 (theme switcher + multi-browser)
   ↓ BLOCKS  ←— Gate 5
T10 (canary 10 → 50 → 100)
```

Real critical path: **T0 → T1 → (T3 logo + T5 Flux founder veto) → T6/T7/T8 → T9 → T10**. T2 e T4 sao paralelos no meio (patches, nao spine). **Founder veto em T5 eh o unico single point of failure externo** ao squad — mitigar com budget 3 tentativas + prompt review Uma antes de gastar API call.

### 3.4 Paralelizacao recursos (10 dias uteis)

- **Semana 9 dias 1-2:** T0 (Dex + @devops). Nova roda `*lookup-design anipis vertical=wellness` no library 69-brand pra checar precedent Aurora Coral + co-regulation motion.
- **Semana 9 dias 3-5:** T1 design-systems-engineer trabalha tokens enquanto @ui-designer abre 4 sub-tracks (T2 icones / T3 logo / T4 ilustracoes / T5 Flux prompts draft). Daily async sync.
- **Semana 10 dias 1-3:** T6/T7/T8 — Dex implementa 1 componente/dia em ordem de risco crescente (ChatWindow = menos visual, MoodCheckin = risco contraste, Hero = risco LCP).
- **Semana 10 dias 4-5:** T9 QA full pass + T10 canary deploy.

### 3.5 Cinco Design Gates — PASS/FAIL numerico

#### Gate 1 — Tokens + Tailwind funcionando (fim semana 9 dia 4)

**Owner:** @design-systems-engineer · **Reviewer:** @design-lead
**Validacao:** componente PoC simples (botao primary + heading General Sans) em `apps/web/src/app/_dev-proof/page.tsx` (rota nao publica).

PASS/FAIL:
- 100% dos 70 tokens v2 mapeados (`npm run validate-tokens-coverage` exit 0).
- WCAG AA: botao primary Aurora Coral `#DC6B3A` sobre `bg.surface` Warm → contrast ratio **≥ 4.5:1** (`contrast_check` MCP).
- Zero CSS warnings (`csstree-validator` zero errors).
- Tailwind classes `bg-primary-500 text-on-primary font-heading` renderizam corretamente — screenshot em `docs/qa/SAI-RB-001-gate-1-proof.png`.

#### Gate 2 — 4 icones SVG + Logo D3 5 sizes prontos (fim semana 9 dia 5)

**Owner:** @ui-designer · **Reviewer:** @design-lead solo

PASS/FAIL:
- **Icones (4):** viewBox `0 0 24 24`, stroke-width **1.5px**, peso harmonioso com Phosphor (test sobreposicao). Cada icone **< 3KB** (SVGO).
- **Logo D3:** 5 sizes × 3 variants = **15 SVGs** + **45 PNGs** (@1x/2x/3x). Favicon set Next.js 15 completo.
- **Motion breathing:** `<Logo>` renderiza animacao `breathe` 4s ease-in-out infinite. `prefers-reduced-motion: reduce` → desliga animacao, CLS = 0.
- **Optical alignment:** logo 32px ao lado heading General Sans 32px → baseline alinhado (sign-off Nova solo).

#### Gate 3 — 3 Flux renders Warm aprovados (semana 9 dia 5 → semana 10 dia 1)

**Owner:** @ui-designer + Uma review · **Reviewer:** @design-lead · **Aprovador final:** **founder veto**

PASS/FAIL:
- **Cost contained:** total Replicate ≤ **$1.20** (budget $0.90 + buffer 1 retry).
- **Prompt quality:** manifest `docs/qa/flux-manifest.json` com prompt + seed + model version. Reproducibility: regenerate mesmo seed = ≥**95% pixel similarity** (PSNR > 30dB).
- **Brand fit:** 3/3 imagens passam Warm palette dominance check (>= **60%** pixels em hex range `#DC6B3A ± 15%` HSL via `color_palette` MCP).
- **Voice fit:** Uma confirma *"sensacao co-regulacao, nao apresentacao corporativa, nao foto-stock"* em `flux-review-uma.md`.
- **No human faces in hero ambient.** Onboarding horizonte = paisagem sem pessoa. Theme thumbs = abstratos.
- **Founder veto:** Breno aprova explicito ("aprovo flux renders anipis") OU rejeita com motivo. Sem veto = nao commit.

FAIL triggers: budget estourou sem founder approval → Nova autoriza gradient CSS fallback (Risk R4). Founder rejeita prompt direction → 1 nova iteracao maxima, depois fallback.

#### Gate 4 — 5 componentes migrados com WCAG AA minimo (semana 10 dia 3)

**Owner:** @dev (Dex) + @design-systems-engineer integration · **Reviewer:** @qa + @ux-design-expert + @design-lead · **Aprovador final:** @design-lead

PASS/FAIL por componente (5 componentes, todos precisam PASS):
- **axe-core score ≥ 90** em cada componente rodando em rota dev isolada ou Storybook.
- **AAA contrast crisis screens:** CrisisAlert/CrisisFullScreen/CrisisBanner usam tokens v2 → contrast ratio **≥ 7:1** em texto + **≥ 4.5:1** em ui-components. Manual review Nova obrigatorio.
- **Voice v2 lint PASS:** ESLint plugin detecta zero violations "positividade toxica" (regex anti-padroes "tudo vai dar certo", "seja feliz", "positive vibes"). Override `/* voice-v2-allow */` requer justificativa + approval Nova.
- **Feature flag isolation:** cada componente flagged independente. Smoke test flag ON → renderiza v2. Flag OFF → renderiza v1 legacy intacto.
- **Visual regression:** Chromatic OR Percy 45 snapshots (5 comp × 3 themes × 3 breakpoints) baseline aprovado Nova.
- **Reduced-motion:** cada componente testado com `prefers-reduced-motion: reduce` → motion ambient desliga, transicoes < 200ms, zero parallax crisis.

#### Gate 5 — Multi-theme + reduced-motion + cross-browser QA (semana 10 dia 5)

**Owner:** @design-systems-engineer + @qa · **Aprovador final:** @design-lead + @qa joint

PASS/FAIL:
- **Theme switcher:** `/settings/appearance` renderiza 3 themes + dark toggle (Warm only). Switch instantaneo (zero flash, CSS-only via `data-theme`). Persist localStorage + Supabase sync funcional.
- **Cross-browser BrowserStack:** Chrome + Safari + Firefox + Edge × 5 componentes × 3 themes = **120 screenshots** em `docs/qa/SAI-RB-001-cross-browser/{browser}/`. Zero broken render (diff ≤ **5%** vs Chrome baseline).
- **Mobile real device:** iPhone 12+ iOS 17+ Safari (Breno) + Android Pixel 6+ Chrome. 5 componentes smoke test SEM bugs visuais.
- **Lighthouse Performance:** delta vs baseline ≤ **+5 pts** regression.
- **Bundle size:** delta ≤ **+95KB** (fonts subset PT-BR limite). Validar `npm run analyze`.

### 3.6 Coordination Protocol — async-first

| Tipo | Canal | Owner | Cadencia |
|------|-------|-------|----------|
| Daily progress | Notion thread `SAI-RB-001-daily` | designers + Dex | Ate 10h BRT diario |
| Bloqueador urgente | Ping direto Nova Slack/Telegram | quem bloqueou | Ad-hoc |
| Asset review (T2/T3/T4/T5) | Notion thread + screenshot inline | @ui-designer | Por entregavel |
| Founder veto (T5 Flux) | Email/Telegram direto Breno + 24h SLA | @design-lead | Por iteracao |
| Code review (PR) | GitHub PR comments | @dev + @qa + @design-systems-engineer | Por PR |
| Gate decisions | Notion thread + commit em `gate-decisions-log.md` | @design-lead | Por gate |
| Sync semanal | Call 30min sexta 14h BRT | todos | Semanal |

Nova mantem `gate-decisions-log.md` no `08-rebrand-implant/` com 1 entrada por gate decided (data, PASS/FAIL, criterios, justificativa de override). Auditoria total para @po e @pm.

### 3.7 Sign-off Authority Matrix

| Decisao | Design-Lead solo | Cross-disciplinary | Founder veto |
|---------|------------------|--------------------|--------------|
| Token mapping fidelity | X | | |
| Logo D3 5 sizes export | X | | |
| 4 icones custom | X | | |
| Component visual fidelity vs mockups | X | | |
| Motion principles compliance | X (com @motion-designer review) | | |
| Voice v2 lint rules tuning | | X (Nova + Uma + @ux-writer) | |
| Flux renders content/composition | | X (Nova + Uma) | **X founder** |
| Multi-ethnic representation se renders mostrarem pessoas | | X (Nova + Uma) | **X founder** |
| Accessibility AAA crisis screens | | X (Nova + @qa + Uma) | |
| Lighthouse Performance budget | | X (Nova + @qa + Dex) | |
| Theme switcher UX final | | X (Nova + Uma) | |
| Rollout 10→50→100 timing | | X (Nova + @qa + @devops) | |
| Cleanup legacy v1/v3 (apos 30d) | X (com Dex) | | |

**Founder veto exclusivo:** Flux renders + representacao humana. Anipis eh categoria sensivel (terapeutico-adjunto). Nao negocio.

**Design-Lead solo:** decisoes tecnicas (design system, motion, contrast, lint) sem dimensao representational. Nova usa Mind Clones don-norman + dieter-rams + erik-spiekermann via `*critique` ou brain-bridge consult em duvida.

---

## 4. Token Architecture (Daria)

### 4.1 Package canonico

Workspace package em `apps/serenity-ai/packages/design-tokens/` como peer de `packages/shared`. Estrutura:

```
apps/serenity-ai/packages/design-tokens/
├── package.json              # @serenity-ai/design-tokens v2.0.0
├── tsconfig.json
├── README.md                  # como gerar build + adicionar novos themes
├── src/
│   ├── index.ts               # re-exports publicos
│   ├── tokens/
│   │   ├── primitives.ts      # raw values theme-independent
│   │   ├── semantic.ts        # text/surface/border/intent semantics
│   │   ├── components.ts      # button/card/chat-bubble/mood-card
│   │   └── shared.ts          # crisis, mood, typography, spacing
│   ├── themes/
│   │   ├── warm.ts            # Aurora Coral (default)
│   │   ├── calm.ts            # Sage Forest (opt-in)
│   │   ├── soft.ts            # Lavender Mist (opt-in)
│   │   └── index.ts           # export THEMES = { warm, calm, soft }
│   ├── tailwind/
│   │   ├── theme.ts           # Tailwind v4 @theme block as TS object
│   │   └── plugin.ts          # Tailwind plugin function — emits CSS vars
│   └── css/
│       ├── design-tokens-v2.css           # Layer 1 + Layer 2 v2
│       ├── design-tokens-legacy-alias.css # v1/v3 -> v2 aliases (30d)
│       └── fonts.css                      # @font-face self-hosted woff2
├── scripts/
│   ├── build.mjs              # roda todos os builders
│   ├── build-css.mjs          # tokens.ts -> design-tokens-v2.css
│   ├── build-legacy-alias.mjs # v1/v3 -> v2 (30d retro-compat)
│   ├── build-tailwind.mjs     # @theme block como string
│   └── build-dtcg.mjs         # tokens.json DTCG (CI artifact)
└── dist/                      # build output (gitignored exc. .gitkeep)
```

### 4.2 Namespace `--anipis-*` — resolve token collision REAL

Daria identificou hotspot critico (alinhado com Nova HOTSPOT A): legacy `apps/web/src/styles/design-tokens.css` (v3 Caderno) declara `:root` com `--brand-ink/--brand-paper/--brand-spot` (Brad Frost 3-layer architecture) E **`[data-theme="madrugada"]`, `[data-theme="reducao-estimulo"]`, `[data-theme="crise"]`, `[data-theme="meditacao"]`** — vai colidir com v2 `[data-theme="warm|calm|soft"]`.

Solucao: **todos os tokens v2 usam prefixo `--anipis-*`** (`--anipis-primary-500`, `--anipis-surface-page`, `--anipis-chat-user-bg`, etc). Zero risco de colisao silenciosa. Componentes que ainda leem v3 (`--brand-spot`) continuam funcionando enquanto alias layer estiver ativa (30d).

Grep audit pre-Gate 1 mandatorio:
```bash
grep -r "brand-ink\|brand-paper\|brand-spot" apps/web/src/
# → zero hits OU todos hits estao em legacy snapshot _legacy-pre-v2/
```

### 4.3 Custom builder vs Style Dictionary

Daria avaliou Style Dictionary v4: vence em ecosystem mas exige config heavy + plugins custom (Tailwind v4 `@theme` block nao tem transformer oficial). Para 70 tokens (Rams reduction 130→70) e 3 outputs (CSS, Tailwind @theme, DTCG JSON), overhead nao paga. **Decisao: custom builder em ~250 LOC**, com `tokens.json` v2 como sink final (re-emitido via `build-dtcg.mjs` para CI artifact). Migracao para Style Dictionary fica opcional fase 2 se time crescer.

### 4.4 Crisis + Mood tokens FIXED — regra F-11

Crisis colors (yellow/orange/red AAA) e mood colors (5 dessaturados) **NUNCA fazem theme-swap** — sao raw primitives, lidos direto. Theme swap ocorre apenas em Layer 2 semantic vars (`--anipis-primary-*`, `--anipis-surface-*`, `--anipis-text-*`, `--anipis-chat-*`). Regra dura: mudar theme nao pode alterar percepcao de severidade crisis nem reaproximar mood-3 do crisis-yellow.

```css
@theme {
  /* Crisis (FIXED — nunca swap) */
  --color-crisis-yellow:     #E8B233;
  --color-crisis-orange:     #E37B2E;
  --color-crisis-red:        #C72828;
  --color-crisis-red-strong: #A11C1C;

  /* Mood (FIXED — nunca swap, F-11) */
  --color-mood-1: #7A6B8A;   /* lavanda fosca */
  --color-mood-2: #8A8EB8;   /* azul cinza */
  --color-mood-3: #A0B0B8;   /* cinza salvia */
  --color-mood-4: #B8C4A0;   /* oliva tenue */
  --color-mood-5: #D4C4A0;
}
```

### 4.5 WCAG dual gate — static + Playwright axe-core

Estrategia hibrida:

**Static gate (existing extended):** `scripts/validate-contrast.mjs` v2 valida hex-pairs offline. Tabela `PAIRS_V2` mapeia ~54 pares semanticos (3 themes × ~18 pares) incluindo crisis CTAs AAA mandatorio. Roda pre-commit + CI.

**Runtime gate (NEW):** Playwright + `@axe-core/playwright` em pages criticas:

```ts
const CRITICAL_SCREENS = [
  { path: '/',                    name: 'hero' },
  { path: '/onboarding/welcome',  name: 'onboarding-welcome' },
  { path: '/diary',               name: 'chat-window' },
  { path: '/mood-checkin',        name: 'mood-checkin' },
  { path: '/crisis/179',          name: 'crisis-banner' },  // AAA mandatory
  { path: '/settings/appearance', name: 'theme-switcher' },
];

for (const screen of CRITICAL_SCREENS) {
  for (const theme of ['warm','calm','soft']) {
    test(`a11y ${screen.name} @ ${theme}`, async ({ page }) => {
      // swap theme, reload, axe analyze (AA + AAA for crisis)
    });
  }
}
```

CI workflow `.github/workflows/wcag-gate.yml` bloqueia merge se violations > 0 em crisis screens.

### 4.6 Hotspot resolvido — mood-1 chip contrast

Daria identificou: mood-1 `#7A6B8A` bg + white text = **4.8:1** (AA large only, FAIL body). Resolucao: tipografia mood label usa `text-body-sm` + `font-weight: 600` para qualificar como large text WCAG. Documentado em Risk Register E + Pixel review.

---

## 5. Fonts Self-Hosted Pipeline (Daria)

### 5.1 Decisao: `next/font/local` para todas as 3

Razao: General Sans nao existe no Google Fonts (so Fontshare). Para consistencia, **ALL 3 viram self-hosted**. Bonus: `next/font/local` corta DNS lookup a `fontshare.com` e `fonts.gstatic.com` (-80ms LCP teorico em 4G).

### 5.2 Subset PT-BR via pyftsubset

`scripts/fetch-fonts.mjs` baixa originais (General Sans 4 weights / Inter 3 weights / Fraunces Italic 2 weights) e gera woff2 subsetados:

```python
pyftsubset {input}.otf --output-file={output}.woff2 \
  --flavor=woff2 \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,
              U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,
              U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" \
  --layout-features='kern,liga,clig' --no-hinting
```

Cobertura ~250 chars latin + latin-ext (PT-BR completo: acentuacao, cedilha, til, ligaturas comuns).

### 5.3 Bundle impact medido

| Fonte | Baseline (Inter+Newsreader Google CDN) | v2 self-hosted subset PT-BR |
|-------|----------------------------------------|------------------------------|
| Inter 3 weights | 48KB | 48KB |
| Newsreader Italic | 47KB | — |
| General Sans 4 weights | — | 72KB |
| Fraunces Italic 2 weights | — | 44KB |
| **Total bundle** | **~95KB** | **~164KB (+69KB)** |

Mitigacoes:
- `preload: true` apenas **General Sans + Inter** (Fraunces nao — uso 5-10%).
- `font-display: swap` em todas — texto aparece com fallback ate font carregar.
- `adjustFontFallback: 'Arial'` em General Sans + Inter — size-adjust evita CLS shift.
- `next/font/local` adiciona `<link rel=preload as=font crossorigin>` automatico p/ preloaded.

**Target LCP pos-migracao: <2.0s 4G slow** (regressao <200ms aceitavel — Lighthouse perf budget R6 permite +5 pts perf score). Smoke test obrigatorio em T0.4: rodar Lighthouse 3x antes/depois em homepage + onboarding step 1 + chat first paint. Falha = >5 pts → rollback `preload: true` em Fraunces.

### 5.4 `layout.tsx` migration aspirational

```tsx
import localFont from 'next/font/local';

const generalSans = localFont({
  src: [
    { path: '../../public/fonts/general-sans-400.woff2', weight: '400' },
    { path: '../../public/fonts/general-sans-500.woff2', weight: '500' },
    { path: '../../public/fonts/general-sans-600.woff2', weight: '600' },
    { path: '../../public/fonts/general-sans-700.woff2', weight: '700' },
  ],
  variable: '--font-general-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui','-apple-system','Segoe UI','Roboto','sans-serif'],
  adjustFontFallback: 'Arial',
});

const inter = localFont({
  src: [ /* 3 weights 400/500/600 */ ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const fraunces = localFont({
  src: [ /* italic 400/500 */ ],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,  // uso 5-10% — nao preload
});
```

### 5.5 Hotspot Fraunces Italic subset PT-BR (Nova HOTSPOT B)

Risk REAL: `pyftsubset` com glyph set PT-BR pode quebrar features OpenType (small caps, ligatures) em weights extremos. Bulk Uma D-UX-03 fechou "Fraunces Italic uso 5-10% pull-quotes only" — provavel weight 500 medium. Se subset PT-BR italic gap detectado, renderiza fallback Newsreader Italic → perde diferenciacao premium Anipis vs Wysa/Zenklub.

Mitigacao mandatoria pre-Gate 4:
1. Daria roda `fontTools subset` LOCAL antes commit.
2. Valida render: `"voce esta aqui agora"`, `"coes acentuacao"` em weight 500 medium.
3. Documenta em PR: weights bundle final + sample render screenshot.
4. Fallback Newsreader Italic FUNCIONA (Risk R3 prevê), mas Nova quer saber ANTES Gate 4, nao depois.

---

## 6. Multi-theme Implementation (Daria + Nova)

### 6.1 Architecture

3 themes selecionaveis em `/settings/appearance`. Persistencia: localStorage + Supabase `user_preferences.theme_preference` (sync best-effort, localStorage wins offline). Dark mode permanece Warm-only no MVP (R5 risk register — Calm/Soft dark fase 2).

### 6.2 Boot script anti-FOUC (inline `<head>`)

Roda **antes** de React hydratar para evitar flash of unstyled content:

```ts
(function(){
  try {
    var stored = localStorage.getItem('anipis-theme-v2');
    var ALLOWED = ['warm','calm','soft'];
    var theme = (stored && ALLOWED.indexOf(stored) !== -1) ? stored : 'warm';
    document.documentElement.dataset.theme = theme;

    // Dark mode (Warm only MVP)
    var darkStored = localStorage.getItem('anipis-dark-v2');
    if (darkStored === 'true' && theme === 'warm') {
      document.documentElement.dataset.dark = 'true';
    } else if (darkStored === null && window.matchMedia &&
               window.matchMedia('(prefers-color-scheme: dark)').matches &&
               theme === 'warm') {
      document.documentElement.dataset.dark = 'true';
    }

    // Migration v3 -> v2: 'default'/'madrugada' -> 'warm'
    var v3 = localStorage.getItem('anipis-theme');
    if (!stored && (v3 === 'default' || v3 === 'madrugada')) {
      document.documentElement.dataset.theme = 'warm';
      localStorage.setItem('anipis-theme-v2', 'warm');
      if (v3 === 'madrugada') {
        document.documentElement.dataset.dark = 'true';
        localStorage.setItem('anipis-dark-v2', 'true');
      }
    }
  } catch (e) {
    document.documentElement.dataset.theme = 'warm';
  }
})();
```

### 6.3 React Context — `ThemeProvider`

`apps/web/src/components/theme/ThemeProvider.tsx` expoe `useTheme()` com `setTheme` que:
- Atualiza `document.documentElement.dataset.theme`.
- Persiste em localStorage.
- Fire-and-forget PATCH para `/api/profile/theme` (Supabase sync, offline-tolerant).

Hydration: ao montar, lê estado do DOM (setado pelo boot script) — evita mismatch React.

### 6.4 CSS layer swap

```css
:root,
:root[data-theme="warm"] {
  --anipis-primary-50:  #FFF1E8;
  --anipis-primary-500: #DC6B3A;  /* Aurora Coral */
  --anipis-primary-700: #9F4221;
  --anipis-surface-page:     #FAFAF8;
  --anipis-surface-elevated: #FFFFFF;
  --anipis-text-primary:     #2A2823;
  --anipis-text-secondary:   #78746C;
  --anipis-chat-user-bg:     #DC6B3A;
  --anipis-chat-ai-bg:       #FFF1E8;
  color-scheme: light;
}

:root[data-theme="warm"][data-dark="true"] {
  --anipis-surface-page:     #1A1916;
  --anipis-surface-elevated: #2A2823;
  --anipis-text-primary:     #FAFAF8;
  --anipis-chat-ai-bg:       #2A2823;
  color-scheme: dark;
}

:root[data-theme="calm"] {
  --anipis-primary-500: #4A9672;  /* Sage Forest */
  --anipis-primary-700: #2D6B4D;
  --anipis-surface-page: #F7F9F8;
}

:root[data-theme="soft"] {
  --anipis-primary-500: #7159A0;  /* Lavender Mist */
  --anipis-primary-700: #4A3B6E;
  --anipis-surface-page: #F8F6FA;
}

@media (prefers-reduced-motion: reduce) {
  :root, :root[data-theme] {
    --anipis-motion-breath-duration: 0ms;
    --anipis-motion-arrive-duration: 0ms;
  }
}
```

### 6.5 UX da pagina `/settings/appearance` (Flow + Nova)

- Dropdown 3 themes com preview thumbnails (Flux T5 — 3 thumbs 200×150).
- Toggle dark mode (visivel apenas quando theme=warm).
- Switch instantaneo (CSS-only via data-attribute — sem reload, zero flash).
- Calm + Soft dark mode card visivel mas disabled com label "em breve" (R5 transparency).

---

## 7. Migration 5 Phases (Daria) — SEQUENCIAL, nao paralelo

Crucial NAO paralelizar. Cada fase passa `npm run lint:contrast` + `npm test` + visual regression antes proxima fase. Branch isolada por fase + gate visual diff + WCAG + perf budget.

### F1 — tokens-only (no visual change)

**Branch:** `feat/anipis-rb-tokens-fonts/phase-1-tokens` · **Duracao:** 2 dias

- Cria `packages/design-tokens/` SEM remover legacy.
- `globals.css` adiciona `@import "@serenity-ai/design-tokens/css"` mas mantem `@import "../styles/design-tokens.css"` (v3 atual).
- Alias layer `design-tokens-legacy-alias.css` mapeia v3 → v2 vars.

**Acceptance:** screenshot visual diff = 0 pixels (Percy/Chromatic). Zero new console errors. Build size delta < +5KB.
**Rollback:** revert PR, branch isolada.

### F2 — fonts + base typography

**Branch:** `feat/anipis-rb-tokens-fonts/phase-2-fonts` · **Duracao:** 2 dias

- woff2 files em `public/fonts/`.
- `layout.tsx` substitui `next/font/google Inter+Newsreader` por `next/font/local` 3 fonts.
- `--font-general-sans`, `--font-inter`, `--font-fraunces` substituem variants antigas no `@theme`.

**Acceptance:** Lighthouse perf regression <5 pts. LCP <2.0s 4G slow. Zero CLS spike. Visual diff allowed (typography mudou intencionalmente).
**Rollback:** reverter para `next/font/google` em emergencia (1 commit).

### F3 — colors layer (WCAG audit)

**Branch:** `feat/anipis-rb-tokens-fonts/phase-3-colors` · **Duracao:** 3 dias

- Substituir Layer 2 (`--surface-canvas` etc) por v2 (`--anipis-surface-page` etc).
- Boot script migra `data-theme="default"` → `data-theme="warm"`.
- Manter aliases legacy para componentes nao migrados.

**Acceptance:** `validate-contrast.mjs` PASS para todas 54+ pairs. axe-core PASS em hero + chat + crisis. Visual diff revisado por @ui-designer.
**Rollback:** alias layer reverte para v3 tokens (1 commit).

### F4 — spacing + radius + shadows

**Branch:** `feat/anipis-rb-tokens-fonts/phase-4-tokens-numeric` · **Duracao:** 1 dia

- Spacing 8px scale (mesmo de v3, no-op em maioria).
- Radius: v2 tem 5 valores vs v3 4. Adicionar `--radius-bubble: 20px` para chat bubbles assimetricos.
- Shadows: warm + dark variants.

**Acceptance:** zero visual diff em components nao migrados. Mudanca chat bubble esperada.

### F5 — component-level overrides

**Branch:** sub-branch por componente conforme EPIC-8 · **Duracao:** 5 dias (T6+T7+T8)

- ChatWindow / MoodCheckin / BreathingExercise / OnboardingFlow / HeroPage.
- Cada componente flagged via `brand-v2-{component}-enabled`.
- Components leem tokens v2 diretos (sem alias).

**Acceptance per component:** WCAG PASS + visual diff approved + voice lint PASS + feature flag working.

---

## 8. Visual Assets (Pixel)

### 8.1 4 icones SVG signature

Grid base **24×24**, sub-grid 1px, optical alignment > matematico. Todos exportam **3 variants** (outline / fill / duotone) + 3 sizes pré-bakeados (16/24/48). Stroke 1.5px no 24, escalado proporcional. Mind clones consultados: dieter-rams (less-but-better), erik-spiekermann (geometria modular), refika-anadol (organic shape language D3).

#### 8.1.1 `anipis-flame` — chama interna, sopro vital

Forma organica evoca chama suave + petala + gota — *anima*. Diferencia de "gota de agua" por assimetria sutil no apice + razao width:height 12:20. NAO eh fogo agressivo: eh brasa quieta. Inclinacao 1° a direita no topo (Refika — perfeito eh morto).

```
outline variant (Bezier path):
M 12 22
C 12 22, 4.5 19, 4.5 14
C 4.5 9, 8 5, 11.5 3
A 1.2 1.2 0 0 1 12.5 3
C 16 5, 19.5 9, 19.5 14
C 19.5 19, 12 22, 12 22 Z
stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round fill=none

fill: mesmo path, fill=currentColor stroke=none
duotone: outer 40% opacity + inner core path 100%
```

**Usage rules:**
- Logo simbolo small (≤32px), splash, About, loading premium, badge "wellness signature".
- **NUNCA em crisis-context** (CVV banner, suicide ideation flow). Crisis usa `Warning`/`WarningOctagon` Phosphor fill red. Flame ali le metafora errada ("apagar-se").
- Animacao apenas `breathing` 8s ciclo (mesma curve do logo D3). Nao flickering.

#### 8.1.2 `anipis-breath` — ciclo respiratorio

Visualizacao diafragma expandindo (NAO loading spinner cliche ansiogenico). Geometria modular Spiekermann: tudo deriva de raio base `r=4`. Circulo central preenchido + arc interno raio 7 (sweep 240° aberto base) + arc externo raio 10 (sweep 180° aberto topo). Arcs **nao fecham** propositadamente — sugere expansao continua.

```
outline:
<circle cx=12 cy=12 r=4 fill=currentColor />
<path d="M 4 13 A 7 7 0 1 1 20 13" stroke=currentColor stroke-width=1.5 fill=none stroke-linecap=round />
<path d="M 6.5 9.5 A 10 10 0 0 1 17.5 9.5" stroke=currentColor stroke-width=1.5 fill=none stroke-linecap=round />
```

**Usage rules:**
- Botao "Iniciar respiracao", card breathing exercise (size lg 32px), onboarding tela exercicios, settings toggle "Lembrar de respirar?".
- Nao usar como loading spinner generico. Nao animar `spin` infinito. Pulse 8s sincronizado breath rhythm, PAUSADO em crisis banner.

#### 8.1.3 `anipis-companion` — orbe presenca

Icone-versao do orbe principal. Blob organico com leve assimetria horizontal (centro optico deslocado 0.5px a esquerda) — sugere "presenca viva", nao circulo perfeito (que seria UI element). 8-point Bezier path simetrico vertical, assimetrico horizontal. Bounding circle raio ~9, centro optico `(11.5, 12)`.

```
outline (8-vertex Bezier loop):
M 11.5 3.2
C 14.5 3.2, 16.5 4, 17.5 5
C 19.5 7, 20.5 9, 20.5 11
C 20.5 14, 19 16.5, 18 17.5
C 16 19.5, 14 20.8, 11.5 20.8
C 9 20.8, 7 19.5, 5 17.8
C 3.5 16, 2.5 14, 2.5 11
C 2.5 9, 4 6.5, 5.5 5.2
C 7.5 3.8, 9.5 3.2, 11.5 3.2 Z
stroke=currentColor stroke-width=1.5 fill=none stroke-linejoin=round
```

**Usage rules:**
- Chat header (avatar Anipis vs avatar user), notifications "Anipis te respondeu", memory inspector, empty states xl (48px) breathing 8s.
- Nao usar como brand mark primario — eh "ele ali", nao "a marca". Nao gradient stops bruscos (perde organicidade).

#### 8.1.4 `anipis-bridge` — handoff humano

Ponte/conexao entre dois pontos. Representa transicao IA → apoio humano. **Nao direcional** (nao seta) — bidirecional emphasis. Arco-ponte lateral horizontal, sem hierarquia vertical (humano nao eh "acima" de IA, eh parceiro). Dois circulos pequenos centros `(4.5, 14)` e `(19.5, 14)` raio 2.5 + arco Bezier quadratico peak `(12, 6)`.

```
outline:
<circle cx=4.5 cy=14 r=2.5 stroke=currentColor stroke-width=1.5 fill=none />
<circle cx=19.5 cy=14 r=2.5 stroke=currentColor stroke-width=1.5 fill=none />
<path d="M 6.5 12.5 Q 12 3, 17.5 12.5" stroke=currentColor stroke-width=1.5 fill=none stroke-linecap=round />
```

**Usage rules:**
- Botao "Falar com pessoa real" em chat header, resource cards CVV/SAMU/CAPS, onboarding "como funciona handoff humano", settings "Profissionais parceiros" (roadmap fase 2).
- Nao rotacionar (nao vira seta). Nao animar fluxo unidirecional (light traveling) — quebra simbolismo "parceiros".

### 8.2 5 ilustracoes Tier 1

Estilo: warm minimal hand-drawn. Production: Procreate sketches + Adobe Illustrator finalize, OU freelance brasileiro. **Stroke 1.8-2.2px** (mais grosso que icones), warm dark brown `#403D36`. Figures humanas sempre **sem rosto definido** — universal, qualquer brasileiro se ve. Multi-ethnic representativeness via silhueta corporal variada.

#### I-01 — "Empty chat — sentar com o ceu" (8h in-house)

Pessoa de costas sentada chao quarto, olhando janela ceu pre-amanhecer. Camera 3/4 atras, planta canto inferior-direito, breathing room 35%. Paleta: Aurora Coral 8% (faixa ceu) + Sage 12% (planta) + linework 30% + cream bg 40%. Refs: Maira Kalman watercolor, Lotta Nieminen, Ping Zhu.

#### I-02 — "Onboarding — duas maos abertas" (10h in-house)

Duas maos gesto acolhimento (palmas viradas pra cima, dedos relaxados), composicao centrada. NAO "high five" / NAO "rezar" — eh **receber**. 3-4 elementos organicos flutuando entre as maos (folha, chama anipis-flame pequena, circulo coral). Paleta: Coral 15% + Sage 10% + warm gold 6% + linework 28% + cream 41%. Refs: Carson Ellis, Olimpia Zagnoli, Ana Juan.

#### I-03 — "Crisis support — duas figuras lado-a-lado" (12h in-house obrigatorio)

Duas silhuetas sentadas banco/sofa **lado-a-lado** (nao frente-a-frente clinico). Mao sobre ombro. **Sem rostos** (regra dura crisis). Focal point: contato mao-ombro. Paleta: Sage 18% (cobertor calor protetor) + Coral 8% (xicara) + linework 32% + cream 42%. Refs: JooHee Yoon, Lisk Feng, Camille Chew.

**Regra dura:** NAO submeter ao Flux ou nano-banana — risco gerar variante stock-like "sad woman crying". Crisis illustrations sempre human-first.

#### I-04 — "Mood landscape base — paisagem receptora" (10h in-house + integracao runtime)

Paisagem abstrata horizontal 1080×400 — colinas suaves overlapping, ceu pastel gradient, sem figuras humanas, sem edificios. **Receptora de overlay generativo** (Tier 2 Canvas dots mood entries — fase 2). Horizonte em 60% altura (propositadamente alto pra "ceu opressivo virar acolhedor pos-overlay"). SVG layered (sky/hills/trees separados).

#### I-05 — "404 gentle — pessoa olha ceu" (8h in-house)

Silhueta de costas em campo aberto, olhando ceu nuvem fofa solitaria. Postura relaxada nao desesperada. "Nao achamos isso, mas o ceu continua ai". Permite Flux como ref-board apenas (nao final). Paleta: Coral 6% + Sage 14% + linework 22% + cream 58%.

**Production path geral:**
- Opcao A in-house Pixel: 8-14h por illustration (Procreate iPad rascunho 3h + Illustrator finalize 5-11h).
- Opcao B freelance BR: **Maria Ines Gul** (SP, editorial Folha + Piaui) OU **Bruna Lubaszewski** (POA, wellness brands). Brief 1h + 2 rodadas review. Total externo 10-14h, R$2.2k-3.5k.
- Recomendacao Nova: I-01 + I-03 in-house (referencia sistema + crisis bandeira UX), I-02/I-04/I-05 freelance se budget allow.

### 8.3 3 Flux 1.1 Pro renders Warm — prompts ready-to-Replicate

Stack: Replicate API `black-forest-labs/flux-1.1-pro`. Conta cobranca: **Bretda** (unica <$5 saldo livre 16/Mai, Tocks tem PIX em fila). Output 1 imagem por prompt (controle qualidade, nao batch). Pitfalls: resolucao max 1440px, `aspect_ratio` preset-only, rate limit 2 req/min soft (espacar 30s), prompts <250 palavras, sem `negative_prompt` (usar "without X").

#### Prompt 1 — Hero environment "warm morning Brazilian living room" (16:9, $0.30)

```
Photorealistic warm morning light in a Brazilian living room, soft golden hour
sunlight filtering through linen curtains, terracotta pottery on wooden side table,
single Aurora Coral (#DC6B3A) ceramic vase as accent piece, monstera deliciosa and
samambaia plants softly out of focus, warm cream walls (#FAFAF8), woven cotton
throw on cream linen sofa, no people visible, composition with significant
breathing room top-left, shallow depth of field, editorial interior photography
style similar to Apartamento Magazine, mature adult Brazilian middle-class
contemporary home aesthetic, natural texture grain, no digital sheen, NOT
a stock photo, NOT staged.
```

Use: LP hero background, OG image, blog post hero "warmth & home".

#### Prompt 2 — Companion atmosphere "soft hand interaction" (16:9, $0.30)

```
Macro detail photograph of a brown-skinned adult hand holding a smartphone
from the side, warm side-light coming from a window off-frame right, the phone
screen visible at an oblique angle showing only a soft Aurora Coral (#DC6B3A)
glow without legible UI, fingertips relaxed and cared for (short trimmed nails,
no nail polish needed), wrist resting on a cream linen surface, background
softly defocused with warm bokeh and a hint of green plant, no face visible,
composition emphasizes touch and gentleness, editorial photography style
similar to Kinfolk magazine but Brazilian warmer palette, late afternoon
quality light, natural skin texture preserved without retouching, NOT stock,
NOT iPhone-ad polished.
```

Use: LP "Como funciona", app store screenshots backdrop, Instagram cards.

**Representativeness note (Pixel + Nova):** "brown-skinned adult hand" propositadamente — multi-ethnic IBGE 2022 baked-in (median 18-29 BR = pardo/preto 56%). Em rerun futuro alternar "black-skinned" + "lighter-brown skinned" para library plural — nunca defaultar euro-brazilian.

#### Prompt 3 — Breathing exercise "abstract organic shapes" (3:2, $0.30)

```
Abstract macro photograph of soft organic shapes suggesting breathing rhythm,
two overlapping translucent membranes in warm Aurora Coral (#DC6B3A) and
warm sage green (#4A9672) on a cream (#FAFAF8) background, gentle expansion
and contraction implied by motion-blur trails at the edges, no human figure,
no recognizable object, no face, looks like silk fabric meeting water meeting
warm light, soft side-light from upper-left, slight grain, editorial fine-art
photography aesthetic similar to Wolfgang Tillmans color studies, contemplative
mood, evokes inhale-exhale, NOT a screensaver, NOT 3D rendered, NOT digital art.
```

Use: Breathing exercise modal cover, splash screen variant, ambient background fallback hero.

**Script execucao (referencia):**
```bash
export REPLICATE_API_TOKEN="<bretda-account-token>"

curl -s -X POST https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"prompt":"<prompt>","aspect_ratio":"16:9","output_format":"png","output_quality":95,"safety_tolerance":2}}'
# Wait 30s entre os 3
# Total: ~90s wall clock, $0.90
```

Outputs como `flux-01-living-room.png`, `flux-02-hand-phone.png`, `flux-03-breath-abstract.png` em `apps/serenity-ai/apps/web/public/brand-v2/photography/flux-warm/`.

### 8.4 Logo D3 Breathing Form — 81 assets matrix

Variante canonica: static keyframe **neutro** (largura 0.6H, altura H) — fotograma intermediario entre inspira (0.71H) e expira (0.5H).

| Size | Variant Light | Variant Dark | Variant Mono | Animated |
|------|---------------|--------------|--------------|----------|
| 16px (favicon) | static | static | static | NO |
| 24px (micro) | static | static | static | NO |
| 48px (small) | primary | primary | static | hover only |
| 128px (medium) | primary | primary | static | hover only |
| 512px (large) | primary | primary | static | YES loop 8s |

**Total static:** 5 sizes × 3 variants = **15 SVG** + PNG @1x/@2x/@3x = **60 raster** → **75 assets** static.
**Animated extra:** 3 SVG + 3 Lottie JSON (light/dark/mono) para 512px+ = **+6**.
**Total geral: 81 arquivos.**

**Naming convention:** `logo-anipis-{variant}-{theme}-{size}.{ext}`

```
logo-anipis-primary-light-16.svg
logo-anipis-primary-light-16@2x.png    (32px)
logo-anipis-primary-light-16@3x.png    (48px)
logo-anipis-primary-dark-128.svg
logo-anipis-mono-light-512.svg
logo-anipis-animated-light-512.svg
logo-anipis-animated-light-512.lottie.json
```

**Color tokens por variant:**
- Light: fill `#DC6B3A`, wordmark `#2A2823`, bg `#FAFAF8`.
- Dark: fill `#FF9A5C` (mais luminoso), wordmark `#FAFAF8`, bg `#1A1916`.
- Mono light: fill+wordmark `#1A1916`.
- Mono dark: fill+wordmark `#FAFAF8`.

**Animacao SVG inline (512px+):**
```xml
<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(40, 40)">
    <path id="anipis-symbol" d="<bezier petal path>" fill="#DC6B3A">
      <animateTransform attributeName="transform" type="scale"
        values="0.71 1; 0.5 1; 0.71 1"
        dur="8s" repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.45 0 0.15 1; 0.45 0 0.15 1" />
    </path>
  </g>
  <text x="90" y="48" font-family="General Sans" font-weight="500" font-size="24" fill="#2A2823">anipis</text>
</svg>
```

**Reduced-motion:** export adicional `logo-anipis-static-neutral-{theme}-{size}.svg` para `<picture>` swap via CSS media query (nao JS).

### 8.5 Multi-ethnic representativeness — IBGE PNAD 2022 baked-in

**Nova canon (decisao final tons de pele):**

Brasil demografico real (IBGE PNAD 2022, projecao 2026) — 18-29 anos:
- **Parda:** ~46%
- **Branca:** ~40%
- **Preta:** ~11%
- **Amarela / Indigena:** ~3%

**Guideline operacional Anipis:**

1. **Tier 1 hand-drawn:** tons de pele em paleta intencionalmente quente desaturada (`#C99B85`, `#8E6852`, `#5C3F30`, `#3B281E`) — **4-spot ladder**. Tom default: medio-quente `#A37456` (parda medio). Variants visiveis: minimo 1 figura mais escura E 1 mais clara em qualquer composicao com >= 2 pessoas.
2. **5 ilustracoes (I-01..I-05):** rotacionar — 2 medio-quente (parda), 1 escura (preta), 1 clara (branca), 1 rosto oculto/silhueta neutra. Mistura natural sem feel de cota.
3. **Flux renders Warm (T5):** hero ambient + onboarding horizonte sao **paisagens sem rosto**. Theme thumbs abstratos. Se acidentalmente gerar pessoa, **rejeitar e regenerate**.
4. **Cabelos:** minimo 1 cacheado/crespo em composicao multi-personagem. Texturas variadas (liso, ondulado, cacheado, crespo).
5. **Vestuario:** evitar marcadores etnicos especificos. Roupas modernas urbanas BR genericas (moletom, camiseta, blusa basica).
6. **Veto absoluto:** zero pele uniformemente clara, zero estereotipos visuais (cabelo loiro = feliz, escuro = triste), zero imagens que falham mirror test (usuaria parda 22 anos Salvador olha I-01 e nao se reconhece como possivel = FAIL refaz).

**Validacao gate:**
- Pre-commit T4: Uma faz mirror test com 3 personas BR ficcionais (Julia 24 SP parda, Marcos 28 RJ preto, Larissa 21 POA branca). Cada uma deve poder se ver em pelo menos 1 das 5 ilustracoes.
- Pre-commit T5: se Flux acidentalmente gerar humano, regenerate com prompt explicit "no human figures, landscape only".

### 8.6 Brand asset library + manifest

**Location:** `apps/serenity-ai/apps/web/public/brand-v2/`

Tree:
```
brand-v2/
├── manifest.json                       # source-of-truth listing
├── README.md                            # uso, prompts templates, regras
├── logos/{primary,animated,static-neutral}/
├── icons-custom/anipis-{flame,breath,companion,bridge}.{outline,fill,duotone}.svg
├── illustrations/i-0{1..5}-*.svg
├── photography/flux-warm/flux-0{1..3}-*.png
└── tokens/design-tokens.json            # DTCG W3C export
```

`manifest.json` schema com sha256 + bytes + usage tags + `blocked_contexts` (ex: flame `["about-page","splash"]` blocked `["crisis"]`).

Script `scripts/generate-brand-manifest.mjs` roda em pre-commit hook + CI guarantee drift-free. Walk recursivo, hash sha256, write manifest. Output total inclui `totals.count`, `totals.totalBytes`, `totals.logos` (81), `totals.icons` (12), `totals.illustrations` (5), `totals.photography` (3).

---

## 9. Components Migration Specs (Flow)

Filosofia: **arquitetura antes de estilo.** Cada spec mapeia *estrutura → hierarquia → interacao → acessibilidade → responsivo*. Cores e tipografia (UI layer) ficam por conta do @ui-designer. Tokens vivem em `05-design/tokens.json` — referenciar, nunca duplicar hex. Mobile-first 320→1440px. Mind clones consultados: don-norman (heuristicas + recognition over recall), julie-zhuo (anti-streak shaming + dot progress), vitaly-friedman (responsive + reduced-motion universal default).

### 9.1 ChatWindow

**Layout:** flex column max-width **480px** (F-18 intimidade conversa), `height: 100dvh` iOS safe-area. Acima 768px mantem 480px centralizado, padding `var(--space-8)`.

```
┌──────────────────────────────────────────┐
│ ChatHeader (sticky top, 56px, blur-12)   │ z-10
├──────────────────────────────────────────┤
│ SafetyBanner (CONDITIONAL — crisis only) │ z-9
├──────────────────────────────────────────┤
│ AmbientBackground (canvas opacity .03)   │ z-0 aria-hidden
│ MessagesArea (role=log aria-live=polite) │ z-1
│   ├─ ChatBubbleCompanion (start)         │
│   ├─ ChatBubbleUser     (end)            │
│   └─ TypingIndicator    (start)          │
├──────────────────────────────────────────┤
│ Composer (sticky bottom)                  │ z-10
│   [VoiceBtn] [Textarea autosize] [Send]   │
├──────────────────────────────────────────┤
│ DisclaimerStrip (12px persistent)         │ z-10
└──────────────────────────────────────────┘
```

**Bubbles assimetricos 20px (radius-bubble novo F4):**
- Companion: `border-radius: 20px 20px 20px 4px` (tail bottom-left), bg `--anipis-chat-ai-bg` (`#FFF1E8` Warm) + border `--anipis-chat-ai-border` (`#FFDCBF`).
- User: `border-radius: 20px 20px 4px 20px` (tail bottom-right espelho), bg `--anipis-chat-user-bg` (Aurora Coral `#DC6B3A`), color `--anipis-chat-user-text` (white). **NAO** border (contrast suficiente).

**Crisis Safety Banner conditional (AAA mandatorio):**
- `severity: yellow` → `bg: --anipis-crisis-yellow-bg`, border-left 4px `--anipis-crisis-yellow`, neutro encorajador.
- `severity: orange` → idem orange, CTA "Falar com CVV (188)".
- `severity: red` → idem `--anipis-crisis-red-strong`, CTA 48px (`--touch-target-crisis`) "Ligar 188 agora".
- Contraste **AAA 7:1** em textos. **Zero parallax, zero ambient noise** quando banner red ativo (F-12).

**Empty state primeira conversa:**
- I-01 illustration `max-width: 200px`, `aria-hidden="true"`.
- Pull-quote **Fraunces Italic 22px** *"Oi. Que bom te ver aqui."* (**unica instancia de Fraunces no Chat** — momento de chegada).
- 3 ChatStarters chips: "to ansioso(a)" / "preciso desabafar" / "nao sei comecar".

**TypingIndicator:** 3 spans `breathing` keyframes scale 0.8→1.2→0.8 + opacity .4→1→.4, 800ms, stagger 150ms, infinite. Reduced-motion: texto estatico "Anipis esta pensando..." sem dots animados.

**Acessibilidade:** `role="log"` + `aria-live="polite"` MessagesArea. Cada bubble `aria-label="Anipis disse: {content}"`. Crisis banner `role="alert"` + `aria-live="assertive"`. Focus management: apos send foco retorna ao textarea (nao Send btn). Enter envia, Shift+Enter quebra linha. Min 44px touch target.

### 9.2 MoodCheckIn

**Single-question flow** (BJ Fogg minimal-friction + julie-zhuo + don-norman). 1 pergunta, 4 emojis, submit ou skip — max 3 toques.

```
┌──────────────────────────────────────┐
│  "Como voce ta agora?"               │ ← H3 General Sans 500
│   (Inter 14px caption: "1 pergunta") │
│                                      │
│  [😔]  [😐]  [🙂]  [😊]              │ ← 4 mood emojis (NAO 5)
│                                      │
│  [Optional note textarea, 1 line]    │
│                                      │
│  [Confirmar] (primary, disabled)     │
│  [Pular]     (ghost link)            │
│                                      │
│  · · ·   ← 3 dots progress (subtle)  │
└──────────────────────────────────────┘
```

**4 mood emojis dessaturados (F-12 zero overlap crisis):**
- Mood 1 😔 `--mood-1: #7A6B8A` (lavanda fosca)
- Mood 2 😐 `--mood-2: #8A8EB8` (azul cinza)
- Mood 3 🙂 `--mood-3: #A0B0B8` (cinza salvia)
- Mood 4 😊 `--mood-4: #B8C4A0` (oliva tenue)

**Por que 4 nao 5?** Numero par forca user a escolher lado (low/high), evita "meio termo seguro" que vicia (julie-zhuo single point of indecision).

Visual: emoji em circulo 56×56px, `border-radius: full`, bg `color-mix(in oklch, var(--mood-N) 12%, transparent)`, hover 25%, selected 40% + ring 2px `var(--mood-N)`.

**Anti-streak shaming (Acacia + julie-zhuo):**
- **NUNCA** mostrar streak ("3 dias seguidos! 🔥") — ferimento direto em quem perdeu 1 dia.
- Apos submit, micro-momento warm: *"Obrigado por compartilhar."* (Inter 16px neutro). Fade out 300ms `var(--motion-depart)` → redireciona para Chat com message pre-loaded baseada em mood.
- Se mood-1 selecionado N >=3 dias consecutivos, sugestao **sutil** no chat (nao modal, nao badge): *"Notei que voce tem chegado pesado. Quer que eu te conte sobre profissionais que confiamos?"*

**Skip always available:** ghost style full opacity sempre. Skip eh decisao legitima, nao falha.

**Progress dots (nao bar):** 3 dots horizontais 6px, gap `var(--space-2)`. Inactive `--color-neutral-300`, active `--anipis-primary-500`. Bar transmite "progresso obrigatorio" (julie-zhuo), dots sao neutros.

### 9.3 BreathingExercise

**Visual orb expansion/contraction:**

```
        ┌─────────────────────┐
        │   Ciclo 2 de 4      │   ← Inter 12px caption
        │       ◯             │   ← orb 224×224px (h-56 w-56)
        │     [Inspire...]    │     scale 0.5→1.0 baseado em phase
        │   • inhale ━ hold ━ exhale  │ ← phase bar 3 segments
        │   [Parar]           │   ← ghost link always visible
        └─────────────────────┘
```

Orb: `position: absolute`, `inset: 0`, `border-radius: full`, `background: radial-gradient(circle, var(--anipis-primary-300), var(--anipis-primary-500))`. Transform inline `scale(${0.5 + progress * 0.5})` → expande 50%→100% inhale, mantem 100% hold, contrai 100%→50% exhale. Opacity 0.6 + progress * 0.3, 0.9 no hold.

**Timing 4-7-8 protocol exato:**
- **Inhale:** 4000ms, easing `var(--motion-breath)` (cubic-bezier(0.45, 0, 0.15, 1)).
- **Hold:** 7000ms, scale fixo (pulse opcional .9↔1.0 loop 3500ms reduced).
- **Exhale:** 8000ms, easing reverso.
- **Total ciclo:** 19s. 4 ciclos = 76s ≈ **1m16s**.
- Loop via `requestAnimationFrame` (nao setInterval — drift) baseado `Date.now() - startTimeRef.current`.

**Audio optional brown noise:**
- Default: **OFF** (anti-imposicao F-06).
- Toggle topo direito speaker, `aria-label="Som ambiente ligado/desligado"`.
- Source `/audio/brown-noise-loop-8s.mp3` (CC0, 16kHz mono ~80KB).
- Volume default 0.15.
- Persist `localStorage.setItem('anipis-breath-audio', 'on'|'off')`.

**Exit gracefully sempre:** Botao "Parar" em TODAS phases. Click → confirm soft modal: *"Quer parar agora? Ta tudo bem."* [Continuar] [Sair]. Se user sair mid-exercise: salva partial completion (`duration_seconds` real), **NAO** pede rating, **NAO** mostra "incomplete!" shaming. Sem "you abandoned last session" guilt.

**Reduced-motion como experiencia PARALELA, nao fallback degradado (Flow):**
- Orb **estatico** scale fixo 0.85, sem expand/contract.
- Substitui animacao por **timer textual numerico** `<div class="countdown">4 ▸ 3 ▸ 2 ▸ 1</div>` no centro do orb (font-mono large).
- Phase bar continua highlight mas sem `transition`.
- Audio brown noise mantido (nao eh motion).
- Instructions explicit: *"Inspire pelo nariz. Conte 4."* (texto nao visual).
- **Por que importa:** users com vestibular disorders OR PTSD trigger por motion precisam acessar sem nausea risk. Reduced-motion **nao eh fallback degradado** — eh experiencia igualmente valida.

### 9.4 OnboardingFlow — 6→5 steps

**Atual codebase tem 6 steps (0-5).** Flow recomenda **reduzir para 5** consolidando AgeGate + PersonalContext em "Sobre voce":

| Step | Nome | Conteudo | Time est. |
|------|------|----------|-----------|
| **0** | Welcome | Greeting + Fraunces pull-quote + CTA "Comecar" | 30s |
| **1** | Consent granular | LGPD Art. 11 health data + AI disclosure + opcionais | 90s |
| **2** | Baseline check-in | PHQ-9 short (4 Qs key) + GAD-7 short (4 Qs key) | 120s |
| **3** | Facilitator intro | "Anipis eh companheiro, nao terapeuta" + ANPD + CFM + crisis routing | 60s |
| **4** | First conversation primer | Sobre voce (nome + reason opcional) + "como vamos conversar" | 60s |

**Total: ~5min.** Time estimate visivel no header desde step 0 (`~5 min` em Inter 12px caption).

**Progress dots subtle (NAO bar):** 5 dots horizontal 6px. Active `--anipis-primary-500` Aurora Coral. Completed `--anipis-primary-300` (lighter, "done"). Pending `--color-neutral-300`. **No percentage shown, no "Step 2/5" text** — dots sao suficientes (don-norman recognition over recall).

**Per-step structure (max-width 480px, `min-height: 100dvh`, flex column justify-center):**
- I-02/I-03/I-04 onboarding illustration topo.
- Headline Fraunces Italic 22px (apenas Step 0 Welcome + Step 4 Primer — uso 5-10% raro ritualistico).
- Body Inter 16px.
- Step content area varia.
- [Voltar] (ghost) [Continuar] (primary).

**Crisis screen trigger PHQ-9 ≥ 20 (Flow critical safety hook):**

No Step 2 baseline, se **PHQ-9 ≥ 20** OR **GAD-7 ≥ 15** OR **Question 9 PHQ ("thoughts of being better off dead") > 0**:

1. **Imediatamente** redirect para `/crisis-encaminhamento` (out-of-cohort screen).
2. Tela full-screen, `bg: --anipis-crisis-orange-bg`, icone CrisisHand custom.
3. Texto Fraunces Italic 22px: *"O que voce ta sentindo agora merece cuidado especializado."*
4. Inter 16px body: *"Anipis foi pensado pra apoio entre sessoes — nao substitui esse momento agora. Aqui estao caminhos que confiamos:"*
5. **3 CTAs verticais grandes** (`min-height: 56px`, `--touch-target-crisis`):
   - **CVV 188** (ligar) — `tel:188`
   - **SAMU 192** (emergencia) — `tel:192`
   - **CAPS local** — link `/recursos/caps` com geolocation
6. Footer: *"Quando estiver com profissional, Anipis pode te apoiar no dia-a-dia. Volte quando se sentir pronto(a)."*
7. **Acceptance criteria:** user NAO consegue prosseguir para chat sem dismiss explicito com checkbox *"Li e entendi. Vou buscar ajuda profissional."*

**Por que out-of-cohort?** CFM 2.454/2026 + Resolucao ANPD: AI companions **nao** podem ser primeiro responder em ideacao ativa. Encaminhamento etico = mandatory.

### 9.5 HeroPage

**Above-the-fold layout (container max-width 720px, padding vertical `var(--space-16)` mobile / `var(--space-20)` desktop):**

```
┌────────────────────────────────────────┐
│  [Logo D3 Breathing Form]              │ ← top-left
│                                        │
│  [Hero render Flux Warm — full bleed]  │ ← bg behind text
│                                        │
│  "Estar nao-sozinho importa."          │ ← Fraunces Italic 28px
│   pull-quote, 1 line max               │   var(--text-quote)
│                                        │
│  "Anipis eh seu companheiro de IA      │ ← Inter 18px body-lg
│   para momentos dificeis. Nao          │   max 2 lines
│   substitui terapia."                  │
│                                        │
│  [Conheca o Anipis] (primary Aurora)   │ ← btn-primary 56px
│  ~5 min · gratis · sem cartao          │ ← microcopy 12px
└────────────────────────────────────────┘
```

**Hero render:** `aspect-ratio: 16/9` mobile, `21/9` desktop, `object-fit: cover`, `border-radius: var(--radius-md)`. Flux Warm "morning living room" (Prompt 1) — mood warm contemplative, NAO clinical/medical.

**Crisis routing inline footer (Nielsen #9 — Help users recover):**
```
┌─────────────────────────────────────────┐
│  Em crise agora?                         │
│  [📞 CVV 188] (24h)  [🚑 SAMU 192]      │
│  © 2026 Anipis · Termos · Privacidade   │
└─────────────────────────────────────────┘
```
CVV pill: bg `--anipis-crisis-orange-bg`, border-left 3px `--anipis-crisis-orange`. **Sempre visivel, sempre clickable** — nao atras de menu.

### 9.6 Cross-component principles

**Animation language consistency (mesma familia easing tokens):**
- `--motion-arrive` 400ms cubic-bezier(0, 0.5, 0.3, 1) — entrada elementos.
- `--motion-depart` 300ms cubic-bezier(0.5, 0, 1, 0.5) — saida elementos.
- `--motion-settle` 400ms cubic-bezier(0.45, 0, 0.15, 1) — transicoes neutras.
- `--motion-breath` 8000ms — apenas BreathingExercise orb.
- `--motion-heartbeat` 200ms cubic-bezier(0.34, 1.56, 0.64, 1) — micro-feedback button press.
- `--motion-pulse` 1800ms cubic-bezier(0.4, 0, 0.6, 1) — TypingIndicator dots.
- Stagger: `--stagger-fast` 80ms (lista pequena), `--stagger-slow` 150ms (TypingIndicator).

**Voice consistency (07-VOICE-REFINED.md):**
- Tratamento: **voce sempre** (nunca tu, nunca voces, nunca senhor/senhora).
- Anti-positividade toxica: zero "Vamos la!", "Ta tudo bem!", "Voce consegue!".
- Anti-shaming: zero streak, zero "incomplete", zero "abandoned".
- Companheiro nunca terapeuta: zero "Eu te entendo", zero "Vamos trabalhar isso", zero "Sua ansiedade esta dizendo que...".
- Brazilian context: PT-BR informal, abreviacoes comuns OK ("ta", "pra"), regionalismo neutro.

**Reduced-motion strategy universal (nao opt-in):**
- Disable: parallax, orb breath, bubble enter slide, page transitions, ambient canvas.
- Keep: opacity fades <300ms, color transitions, scale ±5% apenas hover/focus.
- Replace motion com **text+timing** quando relevante (BreathingExercise countdown).
- Crisis screens: sempre reduced-motion forced (independent of OS setting) — F-12 mandate.

**Responsive breakpoints (universais):**

| Breakpoint | Adjustments |
|------------|-------------|
| 320px | bubble max-width 90%, composer min-height 52px, hero aspect 4/3, pull-quote 22px, CTA full-width |
| 480px | bubble max-width 85%, composer 56px, hero 16/9, pull-quote 24px |
| 768px | container 480px chat / 720px hero centralizado, 3 pills horizontal, pull-quote 26px |
| 1024px+ | sidebar conversation history (out-of-scope fase 2), pull-quote 28px, hero 21/9 |
| 1440px+ | mantem 480px chat (intimidade > screen real estate) |

---

## 10. Positive Psychology Review (Acacia Parks)

Acacia foi direta: brandbook v2 evita 80% dos erros tipicos de apps mental health BR — anti-positividade toxica codificada, voz 1a pessoa cria continuidade, multi-theme respeita person-activity fit. Mas review sob lente positive psy revela **5 gaps estruturais (nao cosmeticos)** que se nao endereçados pre-Beta vao sangrar aderencia em Julia mild-moderate.

### 10.1 PERMA overlay — Meaning sub-ativado em 5/5 componentes

PERMA (Seligman 2011) tem 5 elementos: **P**ositive emotion, **E**ngagement, **R**elationships, **M**eaning, **A**ccomplishment. Apps mental health sobre-investem P+A, ignoram R+M — exatamente onde depressao mild-moderate mais corroi.

| Componente | Ativa bem | Ativa fraco | NAO ativa (deveria) |
|------------|-----------|-------------|---------------------|
| **ChatWindow** | R (1a pessoa companion framing) | E (bubbles passivos) | **M** — chat nao pergunta sobre valores/o-que-importa |
| **MoodCheckIn** | P (captura afetiva) | A (streak passivo) | **M+E** — registro sem reflexao = data point pra si mesma |
| **BreathingExercise** | E (flow + co-regulacao) | P (post-calm) | **A+M** — completion sem named accomplishment + sem ligacao a valor maior |
| **OnboardingFlow** | M (se feito direito) | R (apresenta Anipis) | **A (primeiro micro-win)** + **P (savoring "voce chegou")** |
| **HeroPage** | (marketing fora PERMA) | R (trust "nao substitui") | **M (sem narrativa "para que")** |

**Verdict:** sistema atual tem vies P+R. **Subdesenvolvido em M (Meaning) sistematicamente** em 5/5 — Steger et al. 2008 mostra meaning in life inversamente correlato com sintomas depressivos r ≈ **-0.45**. Para Julia 18-29 mild-moderate, Meaning eh vetor maior alavanca clinica. Rebrand v2 esta deixando dinheiro clinico na mesa.

### 10.2 3 anti-patterns positive psy comuns — auditoria Anipis

**A. Forced gratitude prompt:** Sin & Lyubomirsky 2009 meta — gratitude prompt diario cria efeito REVERSO para ~30% users com baixa hope (fabricacao → self-deception → dissonancia). Risco Anipis v2: **BAIXO** atual. Mas se "Caixinha de Cartas" Sprint 2 trouxer gratitude obrigatorio, **VETO** sem assessment Snyder Hope Scale ou proxy.

**B. Streak shaming:** Duolingo mechanics catastroficas para mental health — recaida = falha de carater na cabeca da Julia (Calvo et al. 2014 ethical UX). Risco Anipis: **MEDIO-ALTO** se "Caixinha de Cartas" trouxer historico dias-perdidos visual. **Preempcao Sprint 4: proibir explicitamente streak visual no design tokens** (Acacia gate).

**C. Mood gamification:** badges por logar mood ruim treinam Julia a performar negatividade. Risco Anipis: **BAIXO** (voice doc bane). Mas crisis colors token system precisa ser **invisivel em estados sub-crise** — se mood-1 dispara cor laranja visivel, Julia aprende tristeza = alerta vermelho = vergonha. **Recomendacao:** cores crisis aparecem APENAS em telas emergencia declarada, nunca em mood log diario (alinhado F-11 Daria).

### 10.3 5 savoring moments (Bryant & Veroff 2007)

Savoring = "the capacity to attend to, appreciate, and enhance the positive experiences" — diferente de gratitude. Smith et al. 2014: 7 dias savoring training reduz sintomas depressivos d ≈ **0.40**. Mais subutilizada em apps BR.

1. **ChatWindow — saudacao warm:**
   - Atual provavel: "Oi, como voce esta?"
   - **Savoring layer:** *"Oi. Antes de qualquer coisa — voce abriu o app. Isso conta. O que trouxe voce aqui agora?"* → reconhece ato de buscar ajuda como savorable.

2. **MoodCheckIn — celebration micro pos-mood positivo:**
   - **Savoring layer:** Quando user loga mood 4/5, micro-momento 2s (nao modal): *"Voce esta num dia bom. Que tal lembrar disso?"* + opcao opcional 1-tap salvar 1 frase do que ta bom hoje. **Nao gamificar. Nao badge.**

3. **BreathingExercise — post-completion:**
   - **Savoring layer:** Pausa 4 segundos antes de retornar a navegacao. Frase unica Fraunces Italic: *"Voce acabou. Sente o corpo um segundo."* Sem CTA. Sem proxima acao. **A ausencia de proxima tela eh o savoring.** Eh o que separa app medicinal de fast-food wellness.

4. **OnboardingFlow — welcoming:**
   - **Savoring layer:** Welcome usa Fraunces Italic *"Voce decidiu tentar. Ja eh uma decisao."* — e tela 2 nao eh "configure perfil", eh pausa 3s onde nome digitado aparece sozinho: *"Oi, Julia."* Pura presenca, sem CTA. Custo: 1 tela extra. Beneficio: marca inicio como ritual nao signup.

5. **HeroPage — anticipatory savoring para visitante pre-instalacao:**
   - **Savoring layer:** Acima dos CTAs, frase Fraunces Italic: *"Nao eh pra te consertar. Eh pra ficar com voce."* Visitante imagina uso antes de instalar — positive emotion sem ainda ter feito nada. Conversion + therapeutic priming simultaneo.

### 10.4 Self-Compassion (Neff 2003) — 3 microcopy adjustments PT-BR

Self-compassion: **self-kindness vs self-judgment**, **common humanity vs isolation**, **mindfulness vs over-identification**.

**Ajuste 1 — MoodCheckIn:**
- Atual: "Como voce esta se sentindo hoje?" → implica que sentir eh algo a ser auditado.
- **Proposto:** *"Como ta hoje? (nao precisa de resposta certa)"* → parenthetical eh Neff operacionalizada. 8 palavras a mais, ROI clinico alto.

**Ajuste 2 — BreathingExercise intro:**
- Atual: "Vamos praticar respiracao consciente" → tom de aula.
- **Proposto:** *"Respira comigo. Sem precisar fazer direito."* → "sem precisar fazer direito" eh literalmente Neff self-kindness operacionalizada. Julia que tentou meditacao 3x e desistiu por "nao conseguir esvaziar a mente" reconhece como permissao.

**Ajuste 3 — ChatWindow (apos user reportar setback):**
- Anti-pattern: "Que tal tentarmos algo diferente?" → implica que o que ela fez nao foi suficiente.
- **Proposto:** *"Faz sentido voce estar nesse lugar. Outras pessoas tambem ficam ai."* → common humanity explicita. Neff & Pommier 2013: common humanity priming reduz auto-critica em ~22% em jovens adultos.

### 10.5 Hope Theory (Snyder 2002) — 3 specifics agency+pathway

Hope tem 2 componentes: **agency** (eu posso) + **pathways** (sei como). Depressao mild-moderate erode ambos. Apps prometem demais (vao te curar) — hope falso, Julia detecta.

**Specific 1 — OnboardingFlow agency micro:**
- Anti-pattern: "Qual seu objetivo? □ Reduzir ansiedade □ Dormir melhor □ Ser mais feliz"
- **Proposto:** Pergunta unica — *"Qual seria um dia bom o suficiente pra voce essa semana?"* + free text curto.
- Snyder: low-hope responders performam melhor com goals "just slightly above current state" (~10% stretch).

**Specific 2 — BreathingExercise pathway visibility:**
- Anti-pattern: badge "Voce completou 5 exercicios!"
- **Proposto:** Tela post-completion mostra (sem fanfarra): *"Esse foi o seu 5°. Da primeira vez, foram 47 segundos. Hoje, 1 minuto e 12."* → evidencia pathway concreto. Nao compara com outros. Nao badge. Apenas dado.

**Specific 3 — ChatWindow agency reinforcement via attribution:**
- Anti-pattern: "Que bom que voce se sentiu melhor!" (atribui ao app).
- **Proposto:** *"Voce fez algo que ajudou. O que mudou entre o comeco e agora?"* → forca attribution interna. Snyder + Bandura self-efficacy 1997.
- Diferenca entre "o app me ajudou" (dependencia) vs "eu descobri que sair de casa ajuda" (agency). Aderencia longa so vem de agency internalizado.

### 10.6 WEIRD cultural adaptations BR vs US

Pesquisa positive psy eh >90% WEIRD (Henrich et al. 2010). Importar PERMA cru pra Julia paulistana/nordestina = erro de traducao clinica.

**Consideration 1 — Jeitinho brasileiro ≠ lateral thinking/creativity:**
VIA-IS US positive psy lista "creativity" como signature strength positiva. BR "jeitinho" carrega ambivalencia — pode ser resiliencia OU auto-prejuizo. **Implicacao:** se MoodCheckIn ou OnboardingFlow medirem strengths, traducao PT-BR precisa cognitive interviewing — Julia pode interpretar como "eu sempre dou um jeito" (positivo) OU "eu sempre quebro o galho pros outros" (people-pleasing toxico).

**Consideration 2 — Family-centric vs individual-centric framing:**
US positive psy eh individualista. BR (especialmente Julia 18-29 morando com familia ou vinculo forte) tem **collectivist substrate**. ChatWindow: quando user mencionar familia, NAO fazer reframe individualista ("mas o que VOCE precisa?"). Reconhecer que "minha mae esta mal" pode ser literalmente parte do meaning system dela, nao codependencia a corrigir. **Voice doc v2 ja ta proximo disso.**

**Consideration 3 — Sofrimento como narrativa vs sintoma:**
US medicaliza (sintoma → diagnostico → tratamento). BR tem tradicao narrativa-religiosa-existencial paralela ("estou passando por uma fase"). **Implicacao HeroPage:** trust "nao substitui terapia" + "adjunto nao substituto" perfeito — preserva direito de Julia ter framework proprio. **NAO adicionar copy tipo "diagnostico precoce" / "intervencao precoce"** — afasta quem tem PHQ-9 mild-moderate e ainda nao se identifica como "doente".

### 10.7 3 A/B tests positive psy-driven (pos-Beta)

Metricas-base: PHQ-9 baseline → semana 4 → semana 8, retention 7d/30d, frequencia sessoes/semana. Cohen's d clinicamente significativo nao so p < 0.05.

**Test 1 — Savoring Pause vs Standard Completion (BreathingExercise):**
- Hipotese: pausa 4s pos-exercicio aumenta retention 30d + PHQ-9 reducao.
- Arms: A) padrao fade-out; B) pausa 4s + Fraunces frase; C) pausa 4s + frase + 1-tap "salvar momento".
- N: 600 (200/arm, power 0.80, d=0.30). Primary: PHQ-9 mudanca semana 4. Secondary: retention dia 30.
- Risco: Arm C pode introduzir gamificacao encoberta — monitorar.

**Test 2 — Hope Agency Onboarding vs Goal-Setting Padrao:**
- Hipotese: "Dia bom o suficiente" free-text gera melhor retention 30d + perceived agency.
- Arms: A) goal multi-choice; B) "dia bom o suficiente" free text.
- N: 400. Primary: retention dia 30. Secondary: Snyder Hope Scale (sub-score agency).
- **Critical guardrail:** medir dropout no onboarding em si. Se completion cai >15%, arm B perde apesar de melhor outcome — gate UX.

**Test 3 — Common Humanity vs Validation Padrao (ChatWindow pos-setback):**
- Hipotese: common humanity priming gera melhor PHQ-9 trajectory + sessao length.
- Arms: A) validacao generica; B) common humanity; C) common humanity + self-kindness combo.
- N: 900 (300/arm). Primary: PHQ-9 mudanca semana 8 (efeito acumulativo). Secondary: Self-Compassion Scale Neff.
- **Ethical gate:** resposta de crise NUNCA varia entre arms — apenas respostas a setbacks sub-crise.

### 10.8 Sintese Acacia

Custo dos 3 gaps: ~3-5 dias dev + 2 dias QA (microcopy + 4 segundos pausa + 1 question shift onboarding). ROI esperado: **8-15% retention dia 30 + 2-3 pontos PHQ-9 adicional semana 8**. Sem evidencia eh so intuicao. Com os 3 A/B tests, viramos product evidence-generating — que eh o que separa Anipis de "mais um app de wellness" no mercado BR pre-CFM ago/2026.

---

## 11. HeroPage CRO (GATE)

### 11.1 Frame estrategico

GATE: MECLABS C = 4M + 3V + 2(I-F) - 2A. Em mental health BR low-trust pre-PMF, **a equacao se inverte**: friction baixa nao vence, **signal de seriedade vence**. A (ansiedade/desconfianca) eh o multiplicador dominante — nao M (motivacao). Toda decisao CRO passa pelo filtro *"isso aumenta ou destroi trust com Julia 22 anos cetica?"*.

Phase Anchor: pos-Concierge wrap-up D14 (13/Jun) → trafego organico 18-29 BR comeca ~14/Jun. Pre-PMF. **Goal Phase 1 = waitlist, nao scaling.**

### 11.2 7 sections com ordem prioritaria

Ordem respeita scan path Julia: chega cetica, escaneia 5s buscando 3 perguntas — *"eh serio?", "vai me julgar?", "eh gratuito de verdade?"*. Cada section responde uma dessas. Trust signals **vem cedo (nao no rodape)** porque categoria esta sob suspeita default.

| # | Section | Goal | Hierarquia visual |
|---|---------|------|--------------------|
| 1 | **Hero** (above-fold) | "Estou no lugar certo?" em 5s | Aurora Coral chroma soft + 1 Flux Warm + pull-quote Fraunces + 1 CTA unico |
| 2 | **Trust strip** (logo bar) | "Isso eh regulado" | CFM-compliant + ANPD partner mark + university placeholder + clinical advisor count |
| 3 | **"Como funciona"** (3 cards) | "Como ajuda sem me trocar pelo terapeuta?" | Companion adjunto / Cientifico evidence-based / Brasileiro PT-BR clinico |
| 4 | **Testimonials sub-fold** | "Outras pessoas iguais a mim tentaram" | 3 quotes Concierge anonimizadas + ilustracao abstrata (sem rostos, sem before/after) |
| 5 | **Safety primer** | "E se eu estiver em crise agora?" | CVV 188 + SAMU 192 + frase explicita "NUNCA substitui psicologo/psiquiatra" — destaque visual |
| 6 | **FAQ** (5 perguntas) | Quebrar objecoes tactical | Privacy / Crise / Gratuito / Cientifico / Contato humano |
| 7 | **Footer LGPD** | Compliance + signal seriedade | Politica privacidade + cookies granulares + termos + CNPJ + email DPO |

**Insight categorico GATE:** Safety primer vem ANTES de FAQ, nao depois. Julia em crise abrindo a pagina em momento ruim — esconder CVV 188 na FAQ eh negligente. Eh compliance E eh CRO (sinaliza seriedade — paradoxalmente aumenta trust de quem nao esta em crise).

### 11.3 Above-fold formula — 3 hooks estratificados

**Hook 1 — Pain-point empatico (H1, 32-40px desktop / 24-28px mobile):**
> *"Foi um dia daqueles?"*

GATE autocritica: headline boa mas fragil se Julia chegou em dia bom explorando. Considerar variant Sprint 5 A/B test.

**Hook 2 — Outcome promessa (H2, 18-22px):**
> *"Um companheiro que te ouve, com respeito clinico."*

Palavra-chave "respeito clinico" faz dois trabalhos: (a) signal de seriedade para Julia, (b) signal de compliance para gatekeepers (jornalistas, reguladores, advisors). **NAO substituir** por "AI-powered" ou "powered by GPT" — destroi trust 70%+ nessa categoria.

**Hook 3 — Differentiator (microline, 14px secondary color):**
> *"Brasileiro. Adjunto. Privado."*

3 palavras, 3 differentiators-chave. Ordem importa: Brasileiro primeiro (Julia desconfia traducao Replika/Woebot), Adjunto segundo (disclaimer etico principal), Privado terceiro (LGPD reassurance).

**CTA unico:**
> **"Conheca o Anipis"** (Aurora Coral, raio 12px, height 48px mobile)

**Veto absoluto** a "Get started free" / "Comece agora gratis" / "Baixar app". Linguagem aquisicionista quebra moldura de seriedade. "Conheca" sinaliza convite, nao funil. Phase 1 CTA leva a `/waitlist` — nao app store.

**Single-CTA rule:** nada de "Saiba mais" + "Baixar app" lado a lado. Decision fatigue + signal de desespero comercial. Um CTA. Sempre.

### 11.4 5 anti-patterns mental health BR — BANNED taxativos

Patterns que funcionam em e-commerce ou SaaS B2B **destroem trust** em mental health BR:

1. **Countdown timers / scarcity timers** — "Apenas 47 vagas restantes!" sinaliza manipulacao. Em categoria de vulnerabilidade, eh antietico E converte negativo (bounce +40% sample testing).

2. **Exit-intent popups** — Julia ja mexeu na decisao de sair. Interceptar com "Espera! 30% off!" comunica desespero comercial. **Pior em mental health: pode pegar usuario em momento de crise tentando sair** — risco etico real.

3. **Fake scarcity** ("Restam 3 vagas no beta!") — Se verdade, comunicar como capacity clinica ("Aceitamos 50 usuarios por semana para garantir qualidade do suporte"). **Nunca inventar.**

4. **Before/After testimonials estilo "Curei minha ansiedade em 7 dias!"** — Viola CFM 2.454/2026 (publicidade medica vedada com promessa de cura), viola codigo publicidade ANVISA-adjacente, e Julia rola olhos. Use quotes processuais ("Me ajudou a entender melhor o que eu sentia em momentos dificeis"), nunca outcomes-curativos.

5. **Chat widget agressivo bottom-right** — "Ola! Posso te ajudar?" piscando 3s simula presenca humana falsa em pagina sobre saude mental. Se Anipis tem suporte humano, esperar interacao explicita (botao "Falar com nosso time" no FAQ). **Auto-trigger = manipulacao.**

**Bonus anti-pattern:** Stock photo "mulher feliz olhando horizonte" — categoria saturou. Use Flux Warm render abstrato OR ilustracao Aurora Coral. **Zero rostos humanos genericos na Hero.**

### 11.5 Trust signals hierarquia + Honest Trust rule

| Tier | Signal | Implementacao | Status Phase 1 |
|------|--------|----------------|-----------------|
| **S** | CFM compliance disclaimer | Texto explicito "Anipis eh companion adjunto, nao substitui acompanhamento profissional. Conforme Resolucao CFM 2.454/2026." | Disponivel dia 1 |
| **S** | ANPD partner mark / DPIA available | Selo + link para DPIA publico (PDF resumo) | Placeholder ate DPIA finalizado — usar "ANIPIS-DPIA-AVAILABLE" |
| **A** | University endorsement | Logo CISM/USP ou pesquisador-line | **Placeholder ate parceria formal — nao inventar.** Se nao existe, omitir tier A |
| **A** | Clinical advisor names | "Conselho clinico: Dra. X (CRP YYYYY), Dr. Y (CRM ZZZZ)" no `/sobre` | Pos-comite formado (Sprint 6+) |
| **B** | Open-source eval framework | Link GitHub "Como avaliamos clinicamente" | Phase 2+ — sinaliza transparencia radical |
| **B** | Press / media mentions | NAO TechCrunch / VentureBeat. **Folha Saude / Veja Saude / CartaCapital** se vier | Oportunistico |

**Regra dura GATE — Honest Trust:** Se um signal nao existe ainda, **omitir completamente**. Nao usar "Em parceria com universidades brasileiras" se a parceria eh uma conversa em DM. Trust em mental health eh assimetrico: **1 mentira descoberta cancela 50 signals validos**. Julia tem reflexo de checar antes de baixar.

**Trust strip placement:** logo bar imediatamente abaixo Hero (nao rodape). Grayscale + Aurora Coral hover. **Max 4 logos** para nao parecer "logo soup".

### 11.6 Conversion goal por phase

**Phase 1 — Sprint 4-5 (Jun-Jul):**
- **Primary KPI:** Waitlist signup (email + opt-in LGPD explicito + 1 pergunta qualitativa opcional "O que te trouxe aqui?").
- **Secondary KPI:** Time-on-page >45s (sinaliza leitura genuina dos disclaimers safety).
- **Anti-goal:** App store deep links. **Nao temos app maduro o suficiente para suportar trafego frio sem onboarding clinico.**
- **Target volume:** 200-500 waitlist signups organicos em 6 semanas. Concierge MVP capacity eh o gargalo real.

**Phase 2 — Beta launch (Ago-Set):**
- **Primary KPI:** App download + onboarding completion (ambos, nao separados — download isolado = vanity metric).
- **Secondary KPI:** D7 retention >25%.
- **Anti-goal:** DAU absoluto. Em mental health, "usado todo dia" pode ser dependencia ruim. Metrica saudavel = "usado quando precisado".

**Phase 3 — post-PMF (Q4 2026+):**
- **Primary KPI:** Conversao Pro R$39/mes com payback <6 meses.
- **Secondary KPI:** NPS clinico ("Voce recomendaria Anipis para um amigo passando por momento dificil?").
- **Anti-goal:** Aggressive paywall na 1a semana. Free tier substantivo permanente eh commitment etico, nao loss-leader.

### 11.7 3 micro-flow optimizations

**(a) CTA hover state "Conheca o Anipis":**
- Default: Aurora Coral fill, branco, raio 12px.
- Hover: shift -2px Y (lift sutil), shadow Coral 20% opacity, **sem cursor pointer overly aggressive**.
- Active/focus: outline 2px Coral 40% (WCAG AA — Julia mobile com TalkBack importa).
- Mobile: skip hover, focar tap feedback (scale 0.98 100ms).

**(b) Waitlist confirmation email template (PT-BR clinico, sem hype):**
> Subject: "Recebemos seu cadastro — Anipis"
>
> Ola [primeiro_nome],
>
> Recebemos seu cadastro para a lista do Anipis. Voce esta entre os primeiros a conhecer um companheiro digital criado no Brasil, com cuidado clinico e respeito a sua privacidade.
>
> Algumas coisas importantes que queremos que voce saiba desde ja:
>
> - Anipis eh um companion **adjunto**. Nao substitui psicologo, psiquiatra ou tratamento medico.
> - Se voce esta em crise agora, **CVV 188** (gratuito, 24h) e **SAMU 192** estao disponiveis.
> - Seus dados sao tratados conforme LGPD. Voce pode pedir exclusao a qualquer momento: dpo@anipis.com.br
>
> Avisaremos voce quando o beta abrir. Sem spam, sem promocoes comerciais.
>
> Equipe Anipis

Zero emojis. Zero "Welcome aboard!". Tom clinico-empatico. Reforcar disclaimer aqui eh redundante de proposito.

**(c) Post-signup nurture 3 emails primeira semana:**
- **D+0** (imediato): confirmacao acima.
- **D+2:** "Como pensamos sobre saude mental no Anipis" — 200-300 palavras, link blog post explicando companion-adjunto philosophy. Sem CTA comercial.
- **D+5:** "Voce nao esta sozinha" — recursos publicos (CVV, CAPS, mapa psicologos gratuitos UBS, livros). Anipis mencionado uma vez no rodape. **Esse email eh o trust-killer-or-maker:** dar valor sem pedir nada = signal que somos serios.
- **D+7+:** silencio ate beta abrir. Re-engagement nurture quebra trust nessa categoria.

### 11.8 3 A/B tests Sprint 5 — PIE scoring

Sample size limitado em Phase 1 (200-500 waitlist). Testes **direcionais** nao claim significancia 95%. Aceitar 80% confidence + qualitative validation via session recordings.

**Test 1 — Headline (Pain vs Outcome vs Differentiator)** — PIE 9/8/7 = **24** (prioridade max):
- A control: "Foi um dia daqueles?" (pain-empatico).
- B: "Um companheiro que te ouve, com respeito clinico." (outcome).
- C: "Saude mental brasileira. Companion adjunto. Privado." (differentiator).
- Hipotese: A converte mais mobile organico (estado emocional cru), B desktop (modo avaliacao cetica).
- Duracao: 3 semanas / 150 signups por variant ideal. Metrica: signup rate + time-on-page.

**Test 2 — CTA Copy (Soft vs Medium vs Direct)** — PIE 8/9/9 = **26**:
- A soft: "Conheca o Anipis"
- B medium: "Entrar na lista"
- C direct: "Cadastre seu email"
- Hipotese: Soft ganha first-time visitor, Direct ganha returning (ja decidiu).
- **Caveat etico:** NAO testar "Get started free" — fora da moldura de seriedade.

**Test 3 — Trust signal arrangement (Compact vs Spread)** — PIE 6/9/8 = **23**:
- A compacto: trust strip 4 logos linha unica abaixo CTA.
- B distribuido: CFM disclaimer dentro Hero subheadline + ANPD mark sidebar + university na secao 3.
- Hipotese: compacto ganha tempo-on-page (visual cleaner), distribuido ganha signup rate (trust acumulado).
- **Watchout:** se variant B aumenta tempo-on-page mas reduz signup, eh signal de **anxiety overload** — Julia esta lendo demais antes de decidir = friction emocional, nao trust.

### 11.9 Verdict sintetico GATE

HeroPage Anipis em Phase 1 nao compete com Replika/Woebot em conversion rate. Compete em **trust signal density per scroll inch**. Cada elemento que parece "anti-CRO" (CTA unico soft, sem countdown, sem exit-intent, Safety primer prominente) eh **pro-CRO contextual** porque otimiza para constraint dominante da categoria: low-trust + pre-PMF + regulatorio vigilante.

**Metrica norte:** Julia mostra HeroPage para psicologo(a) → resposta *"isso parece serio"* → convertemos o gatekeeper. Esse eh o teste real, nao bounce rate.

**Veto final:** qualquer pressao futura para "growth hacks tipo Calm/Headspace" em Phase 1 — recusar. Categoria saturada de manipulacao. **Differentiator estrutural de Anipis eh disciplina etica**, e isso vive ou morre na HeroPage.

---

## 12. Risk Register + Hotspots

### 12.1 Risk register oficial (R1-R10)

| ID | Risco | Severidade | Probabilidade | Mitigacao |
|----|-------|------------|---------------|-----------|
| R1 | WCAG regression durante migracao causa fail launch | HIGH | MED | axe-core CI gate bloqueia PR (<90), manual review AAA crisis |
| R2 | Theme switcher complexidade quebra UX | MED | MED | data-attributes CSS-only, persistencia simples, fallback graceful |
| R3 | Fraunces Italic weights gap subset PT-BR | LOW | LOW | validar Google Fonts em T1.4; fallback Newsreader Italic |
| R4 | Flux renders nao aprovados pelo Design Lead na 1a tentativa | MED | MED | budget $0.90 = 3 tentativas; fallback gradient CSS pre-definido |
| R5 | Dark mode opcional Warm adiciona complexidade nao prevista | MED | LOW | limitar dark mode Warm-only MVP, Calm/Soft dark fase 2 |
| R6 | Bundle size >+95KB regride Lighthouse | MED | LOW | subset PT-BR pyftsubset obrigatorio, swap, preload selectivo |
| R7 | Designer freelancer T3 nao disponivel | MED | MED | Plan B: @ui-designer in-house com mais tempo + @design-lead priorizacao |
| R8 | Voice v2 lint rule muito strict bloqueia copy legitima | LOW | MED | override `/* voice-v2-allow */` com aprovacao Nova |
| R9 | Replicate API key nao provisionada antes Task 5 | LOW | LOW | @devops provisiona em T0 |
| R10 | Sprint 1-3 safety pipeline nao aprovado antes Task 6 voice lint | MED | LOW | @analyst review obrigatoria antes T6 — gate sequencial |

### 12.2 Hotspots especificos da implantacao (Nova + Daria)

**HOTSPOT A — Token namespace collision v3 Caderno legacy (REAL, nao hipotetico):**
- **O que pode quebrar:** legacy `apps/web/src/styles/design-tokens.css` (v3 Caderno) ja declara `:root` com `--brand-ink/--brand-paper/--brand-spot` (Brad Frost 3-layer) E `[data-theme="madrugada|reducao-estimulo|crise|meditacao"]` — vai conflitar com v2 `[data-theme="warm|calm|soft"]`. Pior: componentes que ainda leem v3 tokens (`--brand-spot`) quebram silenciosamente.
- **Mitigacao mandatoria:**
  1. Pre-flight #5 backup legacy **NAO eh opcional** — bloqueador Gate 1.
  2. Grep audit pre-Gate 1: `grep -r "brand-ink\|brand-paper\|brand-spot" apps/web/src/` → zero hits OR todos em snapshot.
  3. Namespace v2 = `--anipis-*` (Daria) elimina colisao silenciosa.
  4. Owner: @design-systems-engineer. Gate 1 nao passa sem isso.

**HOTSPOT B — Fraunces Italic weights subset PT-BR gap:**
- Ja descrito na §5.5 — pre-Gate 4 validation mandatoria.

**HOTSPOT C — Flux render Hero como LCP killer:**
- **O que pode quebrar:** Flux renders saem em alta resolucao (1920×1080 hero + 750×1334 mobile). Se @dev integra como `<img>` direto sem Next.js Image, vira Largest Contentful Paint da `/` e Lighthouse despenca.
- **Cenario:** Gate 3 founder valida Flux, parece lindo. Gate 4 axe-core passa, contrast passa. Gate 5 Lighthouse mostra Performance score caiu 12 pts (LCP 1.8s→4.2s no mobile 3G). Canary 50% dispara Sentry Web Vitals regression. Rollback.
- **Mitigacao mandatoria:**
  1. Gate 4 HeroPage migration **obriga** Next.js `<Image>` com `priority`, `sizes` responsivo, AVIF + WebP fallback, blur placeholder pre-gerado.
  2. Performance budget HeroPage: **LCP < 2.5s mobile** (Lighthouse simulated 3G/4G mid-tier). Bloqueador Gate 5.
  3. Se LCP > 2.5s, fallback CSS gradient Warm enquanto image lazy-loads (skeleton terapeutico, nao branco).
  4. Owner: @dev. Reviewer: @qa Lighthouse audit.

**HOTSPOT D — Mood-1 chip contrast 4.8:1 (Daria):**
- mood-1 `#7A6B8A` bg + white text = 4.8:1 (AA large only, FAIL body).
- Mitigacao: tipografia mood label usa `text-body-sm` + `font-weight: 600` para qualificar como large text WCAG. Documentado pre-Gate 4.

**HOTSPOT E — General Sans license commercial:**
- Fontshare free for commercial mas exige confirmacao via email.
- Owner: @devops valida em T0.4 pre-Gate 1.

**HOTSPOT F — Founder veto isolado a Flux + humanos (unica dependencia externa):**
- Founder veto exclusivo: Flux renders + representacao humana. Mitigacao: 24h SLA email/Telegram + budget 3 tentativas Flux + fallback gradient.

---

## 13. Migration Checklist (30 itens sequenciais)

### A. Pre-flight (8 itens) — antes de qualquer codigo

- [ ] **1. Localizar HeroPage atual** — confirmar path em `apps/serenity-ai/apps/web/src/app/page.tsx` OR `components/landing/` OR `components/landing-v3/`. Documentar canon decision em PR description.
- [ ] **2. Confirmar safety pipeline + voice approval** — @analyst confirmou que output filter LLM (Sprint 3 lock) aprovou voice v2 rules antes de T6 (lint dependency). Sem isso, voice lint pode bloquear copy legitima.
- [ ] **3. Provisionar Replicate API key** — `REPLICATE_API_TOKEN` em env vars dev/staging/prod via @devops. Validar com call test Flux 1.1 Pro antes T5.
- [ ] **4. Criar package shared `@serenity-ai/design-tokens`** — em `apps/serenity-ai/packages/design-tokens/`. Adicionar workspace dep em `apps/web/package.json`.
- [ ] **5. Backup legacy styles (NAO OPCIONAL — bloqueador Gate 1, HOTSPOT A)** — mover `apps/web/src/styles/design-tokens.css` (v3 Caderno) para `apps/web/src/styles/_legacy-pre-v2/design-tokens-v3-caderno.css` + criar README.md explicando migration.
- [ ] **6. Decidir feature flag infra** — Statsig SDK OR env var simples + middleware? Recomendacao: env var simples para MVP (zero new vendor), Statsig fica para post-launch escala.
- [ ] **7. Snapshot Lighthouse Performance baseline** — rodar Lighthouse contra producao atual (legacy Teal+DM Sans), salvar score em `docs/qa/SAI-RB-001-lighthouse-baseline.json`.
- [ ] **8. Verificar fonts licenses** — General Sans (Fontshare free commercial — HOTSPOT E confirmar email), Inter (OFL), Fraunces (OFL). Download .woff2 ja em formato production. Subset PT-BR via pyftsubset.

### B. Implementation (15 itens) — Tasks 1-8 sequenciais

**Tokens + Fonts (T1):**
- [ ] **9. Converter tokens.json em CSS vars** — `packages/design-tokens/src/tokens.css` com 3 themes (`[data-theme="warm|calm|soft"]`), warm default `:root`. Inclui dark variant Warm.
- [ ] **10. Gerar Tailwind theme extension** — `packages/design-tokens/src/tailwind.theme.ts` (Tailwind 4 CSS-first @theme).
- [ ] **11. Self-host 3 fonts + setup next/font/local** — woff2 subset PT-BR em `apps/web/public/fonts/`, configurar `next/font/local` em `app/layout.tsx` com preload (General Sans + Inter only, Fraunces nao) + display swap + adjustFontFallback Arial. CSS vars `--font-general-sans`, `--font-inter`, `--font-fraunces`.

**Asset production (T2-T5):**
- [ ] **12. 4 icones customizados** — SVG inline `components/ui/icons/anipis/{flame|breath|companion|bridge}.tsx` com Bezier paths construtivos. Phosphor Icons React instalado (`@phosphor-icons/react`).
- [ ] **13. Logo D3 Breathing Form 81 assets** — vector master + 15 SVGs static + 60 PNGs (@1x/2x/3x) + 6 animated (3 SVG + 3 Lottie) em `public/brand-v2/logos/`. Favicon set Next.js 15.
- [ ] **14. 5 ilustracoes Tier 1** — I-01 a I-05 produzidas em SVG vector + PNG @2x em `public/brand-v2/illustrations/`. Mirror test Uma com 3 personas BR ANTES commit. Design Lead approval mandatorio.
- [ ] **15. 3 Flux renders Warm only** — Replicate API Flux 1.1 Pro 3 prompts (living-room, hand-phone, breath-abstract). $0.90 total. Manifest JSON. Founder veto antes commit.

**Component migrations (T6-T8):**
- [ ] **16. Migrar ChatWindow** — substituir hardcoded por v2 tokens (`--anipis-chat-*`), container max-width 480px, bubbles assimetricos 20px, TypingIndicator motion v2, ChatHeader integra `<Logo>` + `anipis-companion`. Feature flag `brand-v2-chat-enabled`. Voice lint PASS.
- [ ] **17. Migrar MoodCheckIn** — 4 mood emojis DESSATURADOS, hex separados crisis (F-11 zero overlap), single-question flow, anti-streak shaming (zero "X dias seguidos!"), dots progress (nao bar), skip always available. Feature flag `brand-v2-mood-enabled`.
- [ ] **18. Migrar BreathingExercise** — `anipis-breath` icon + I-05 illustration + motion co-regulacao (F-04 5 principles) + reduced-motion experiencia PARALELA (countdown 4-3-2-1 textual, nao fallback degradado). Audio brown noise default OFF. Feature flag `brand-v2-breathing-enabled`.
- [ ] **19. Migrar OnboardingFlow** — 6→5 steps consolidando AgeGate+PersonalContext. 3 ilustracoes I-02/I-03/I-04. Welcome step Fraunces Italic pull-quote (uso 5-10% raro ritualistico). Crisis screen trigger PHQ-9 ≥20 OR GAD-7 ≥15 OR Q9>0 → out-of-cohort `/crisis-encaminhamento` com 3 CTAs verticais 56px (CVV/SAMU/CAPS). Feature flag `brand-v2-onboarding-enabled`.
- [ ] **20. Migrar HeroPage** — path canon T0.1. 7 sections (Hero / Trust strip / Como funciona / Testimonials / Safety primer / FAQ / Footer LGPD). Above-fold formula 3 hooks (Pain/Outcome/Differentiator). CTA unico "Conheca o Anipis". Crisis routing inline footer Nielsen #9. Next.js `<Image>` priority + AVIF/WebP (HOTSPOT C). Honest Trust rule (omitir signals que nao existem). Feature flag `brand-v2-hero-enabled`.

**Multi-theme + Voice + Backlog (T9-T10):**
- [ ] **21. Multi-theme switcher /settings/appearance** — page nova `app/(app)/settings/appearance/page.tsx`. Dropdown Warm/Calm/Soft + preview thumbnails (Flux T5 thumbs) + persist localStorage. Sync Supabase `user_preferences` table.
- [ ] **22. Dark mode opcional Warm** — auto-detect `prefers-color-scheme: dark` + override manual settings. Apenas Warm theme MVP (Calm/Soft dark fase 2, R5).
- [ ] **23. Voice v2 lint rule** — custom ESLint plugin OR text-lint config detectando "voce" obrigatorio + anti-positividade toxica regex patterns. Override `/* voice-v2-allow */` para casos excepcionais aprovados Uma.

### C. QA (5 itens) — T9 quality gates

- [ ] **24. axe-core CI gate** — `.github/workflows/wcag-gate.yml` configurado. PR fail se score <90 em 5 componentes migrados. WCAG AAA manual review crisis screens (CrisisAlert + CrisisFullScreen + CrisisBanner).
- [ ] **25. Visual regression Chromatic OR Percy** — snapshots 5 componentes × 3 themes (Warm/Calm/Soft) × 3 breakpoints (375/768/1280) = 45 snapshots por componente = **225 baseline snapshots**. PR diff review obrigatorio.
- [ ] **26. Cross-browser BrowserStack** — Chrome + Safari + Firefox + Edge ultimas 2 versoes × 5 componentes × 3 themes = **120 screenshots** em `docs/qa/SAI-RB-001-cross-browser/{browser}/`.
- [ ] **27. Mobile real device** — iPhone 12+ iOS 17+ Safari (founder Breno) + Android Pixel 6+ Chrome. 5 componentes smoke test sem bugs visuais. Documentar em `docs/qa/SAI-RB-001-mobile-real-device.md`.
- [ ] **28. prefers-reduced-motion audit** — DevTools toggle reduced motion + manual review todos motion ambient/transitions. Fallback estatico OR experiencia paralela (BreathingExercise countdown) funcional em CADA componente migrado.

### D. Launch (2 itens) — T10 rollout

- [ ] **29. Feature flag rollout 10% → 50% → 100%** — canary 10% por 3 dias, monitorar Sentry error rate (auto-rollback se >2x baseline). 50% por 3 dias, validar Lighthouse Performance nao regrediu >5 pts vs baseline pre-flight #7. 100% production. Manter flags 30 dias para rollback emergencial.
- [ ] **30. Deprecate v1/v3 legacy + cleanup** — apos 30 dias 100% estaveis (target 2026-06-30), remover feature flags + legacy code em `_legacy-pre-v2/`. Atualizar 5 stories backlog (SAI-005/007/011/100/102) com status changelog "MIGRATED via SAI-RB-001 — flag legacy removed YYYY-MM-DD". Servir PDF brand reference em `/docs/brand-reference.pdf` (route handler `app/docs/brand-reference/route.ts`).

### Tracking — progress percentage

```
Pre-flight       [ 0/8  ]   0%   ░░░░░░░░░░░░░░░░░░░░
Implementation   [ 0/15 ]   0%   ░░░░░░░░░░░░░░░░░░░░
QA               [ 0/5  ]   0%   ░░░░░░░░░░░░░░░░░░░░
Launch           [ 0/2  ]   0%   ░░░░░░░░░░░░░░░░░░░░

TOTAL            [ 0/30 ]   0%   ░░░░░░░░░░░░░░░░░░░░
```

Atualizar este bloco conforme progride. Quando 30/30, SAI-RB-001 entra `Done` + changelog.

---

## 14. Handoffs Cross-Squad

### @design-systems-engineer (Daria)
- Consome briefing Daria desta section §4-§7.
- Cria `packages/design-tokens/` com namespace `--anipis-*`.
- Tailwind 4 CSS-first `@theme`.
- 3 fonts self-hosted via `next/font/local` subset PT-BR pyftsubset.
- ThemeProvider React Context.
- 5 fases migracao SEQUENCIAL (F1-F5) com branch isolada por fase.
- Layer alias `design-tokens-legacy-alias.css` dual-emit 30d.
- `validate-contrast.mjs` v2 (54+ pairs) + Playwright axe-core suite.

### @ui-designer (Pixel)
- Consome briefing Pixel desta section §8.
- 4 icones SVG signature com Bezier paths construtivos + 3 variants (outline/fill/duotone).
- 5 ilustracoes Tier 1 com freelancers BR nominados (Maria Ines Gul / Bruna Lubaszewski).
- 3 Flux prompts ready-to-Replicate ($0.90 conta Bretda).
- Logo D3 81 assets matrix + naming convention.
- Multi-ethnic IBGE 2022 baked into prompts.
- Brand asset library `public/brand-v2/` + manifest.json sha256 + CI gate.

### @ux-designer (Flow)
- Consome briefing Flow desta section §9.
- 5 components migration specs (ChatWindow / MoodCheckIn / BreathingExercise / OnboardingFlow / HeroPage).
- OnboardingFlow 6→5 steps consolidacao.
- Crisis trigger PHQ-9 ≥20 OR GAD-7 ≥15 OR Q9>0 → out-of-cohort.
- Reduced-motion como experiencia paralela (nao fallback degradado).
- Mobile-first 320→1440px.

### @dev (Dex)
- Consome migration code §13 implementation.
- Componentes leem CSS vars `--anipis-*`.
- Feature flags consumidos via `@serenity-ai/shared/feature-flags`.
- Branches sequenciais conforme F1-F5.
- Next.js `<Image>` mandatorio HeroPage (HOTSPOT C — LCP killer).
- Voice v2 lint enforce.

### @qa (Quinn)
- axe-core + Playwright suite em `tests/a11y/wcag-critical-screens.spec.ts`.
- Chromatic OR Percy visual regression gate em cada phase F1-F5.
- Lighthouse perf budget gate em F2 (LCP <2.0s 4G slow, regression <5 pts).
- Cross-browser BrowserStack 120 screenshots.
- Mobile real device smoke test.
- prefers-reduced-motion audit todos componentes.

### @devops (Gage)
- Provisionar Replicate API key (HOTSPOT C, T0.3).
- Env vars `NEXT_PUBLIC_BRAND_V2_*_ENABLED` em Vercel (dev=all-true, preview=match-prod, prod=staged).
- CI workflows: `.github/workflows/wcag-gate.yml` + `tokens-build.yml` (build package + publish artifacts) + `manifest-drift.yml` (sha256 verify brand-v2 assets).
- Feature flag rollout 10→50→100% + Sentry alerts auto-rollback.

### @design-lead (Nova)
- Owner orquestracao — 5 design gates PASS/FAIL.
- Sign-off matrix solo/cross-disciplinary/founder veto.
- Async-first daily Notion + sincronia 15min apenas se bloqueio real.
- `gate-decisions-log.md` live em `08-rebrand-implant/`.
- Mind Clones don-norman + dieter-rams + erik-spiekermann a 1 consult de distancia.

### @ux-design-expert (Uma)
- Voice v2 lint rules tuning + approval.
- Mirror test 3 personas BR para 5 ilustracoes pre-commit T4.
- Flux renders review pre-founder veto (T5).
- Voice "voce sempre" + anti-positividade toxica enforce.

### @pm (Morgan) / @po (Pax)
- 5 stories backlog (SAI-005/007/011/100/102) atualizadas com `TO-MIGRATE` flag.
- PDF brand reference servido `/docs/brand-reference.pdf`.
- Sprint 4 kickoff coordenacao + Sprint 5 A/B tests planning.

---

*Synkra AIOS · Anipis Rebrand v2 Implant · Pack Operacional v1*
*Sprint 4 (semanas 9-10) · 50-80h dev · 2 designers + 1 dev · 5 Design Gates PASS/FAIL*
*Owner: Nova (@design-lead) · Tecnico: Daria (@design-systems-engineer)*
*Story canon: `D:/AIOS/docs/stories/serenity-ai/active/SAI-RB-001-rebrand-v2-implant.md`*
