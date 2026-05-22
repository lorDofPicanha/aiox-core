# Migration Checklist — SAI-RB-001 Rebrand v2 Implant

**Para:** Dev/Designer implementando migracao sem perder passo
**Story canon:** `D:/AIOS/docs/stories/serenity-ai/active/SAI-RB-001-rebrand-v2-implant.md`
**Context readme:** `./EPIC-8-rebrand-context.md`
**Total:** 30 itens sequenciais — siga EM ORDEM, marque ao completar

---

## A. Pre-flight (8 itens) — Antes de qualquer codigo

- [ ] **1. Localizar HeroPage atual** — confirmar path em `apps/serenity-ai/apps/web/src/app/page.tsx` OR `components/landing/` OR `components/landing-v3/`. Documentar canon decision em PR description.
- [ ] **2. Confirmar safety pipeline + voice approval** — @analyst confirmou que output filter LLM (Sprint 3 lock) aprovou voice v2 rules antes de Task 6 (lint dependency). Sem isso, voice lint pode bloquear copy legitima.
- [ ] **3. Provisionar Replicate API key** — `REPLICATE_API_TOKEN` em env vars dev/staging/prod via @devops. Validar com call test Flux 1.1 Pro antes de Task 5.
- [ ] **4. Criar package shared `@serenity-ai/design-tokens`** — em `apps/serenity-ai/packages/design-tokens/` com `package.json`, `tsconfig.json`, exports. Adicionar workspace dep em `apps/web/package.json`.
- [ ] **5. Backup legacy styles** — mover `apps/web/src/styles/design-tokens.css` (v3 Caderno) para `apps/web/src/styles/_legacy-pre-v2/design-tokens-v3-caderno.css` + criar README.md no _legacy-pre-v2 explicando migration.
- [ ] **6. Decidir feature flag infra** — Statsig SDK OR env var simples + middleware? Documentar decisao em PR. Recomendacao: env var simples para MVP (zero new vendor), Statsig fica para post-launch escala.
- [ ] **7. Snapshot Lighthouse Performance baseline** — rodar Lighthouse contra producao atual (legacy Teal+DM Sans), salvar score em `docs/qa/SAI-RB-001-lighthouse-baseline.json`. Sera comparado pos-migracao (limite +5 pontos regression).
- [ ] **8. Verificar fonts licenses** — General Sans (Fontshare free commercial), Inter (OFL), Fraunces (OFL). Download .woff2 ja em formato production. Subset PT-BR via fonttools (latin + latin-ext).

---

## B. Implementation (15 itens) — Tasks 1-8 sequenciais

### Tokens + Fonts (Task 1)

- [ ] **9. Converter tokens.json em CSS vars** — escrever `packages/design-tokens/src/tokens.css` com 3 themes (`[data-theme="warm"]`, `[data-theme="calm"]`, `[data-theme="soft"]`), warm como default no `:root`. Incluir dark variant Warm (`[data-theme="warm"][data-mode="dark"]`).
- [ ] **10. Gerar Tailwind theme extension** — `packages/design-tokens/src/tailwind.theme.ts` com colors / fontFamily / spacing / radius / shadows / motion mapeados via CSS vars. Importar em `apps/web/tailwind.config.ts`.
- [ ] **11. Self-host 3 fonts + setup next/font/local** — woff2 subset PT-BR em `apps/web/public/fonts/`, configurar `next/font/local` em `app/layout.tsx` com preload + display swap. CSS vars `--font-general-sans`, `--font-inter`, `--font-fraunces-italic`.

### Asset production (Tasks 2-5)

- [ ] **12. 4 icones customizados** — produzir SVG inline `components/ui/icons/anipis/{flame|breath|companion|bridge}.tsx`. Phosphor Icons React instalado (`@phosphor-icons/react`).
- [ ] **13. Logo D3 Breathing Form 5 sizes x 3 variants** — vector master + SVG export (15 files) + PNG @1x/2x/3x (45 files) em `public/brand/logo/`. Favicon set Next.js 15 (`app/favicon.ico` + `app/icon.svg` + `app/apple-icon.png`). Componente `<Logo>` com motion breathing.
- [ ] **14. 5 ilustracoes Tier 1** — I-01 a I-05 produzidas em SVG vector + PNG @2x fallback em `public/brand/illustrations/`. Estilo "Warm Minimal Hand-Drawn" (Wei Xin / Andy Carolan reference). Design Lead approval ANTES commit.
- [ ] **15. 3 Flux renders Warm only** — Replicate API Flux 1.1 Pro, ~$0.30 cada x 3 = $0.90 total. Outputs: hero ambient (1920x1080 + 750x1334) + onboarding horizonte (1080x1080) + theme thumbs (3 thumbs 200x150 Warm/Calm/Soft). Manifest JSON com prompt + seed + model version. Design Lead approval ANTES commit.

### Component migrations (Tasks 6-8)

- [ ] **16. Migrar ChatWindow** — substituir hardcoded por v2 tokens (chat-bubble-user-bg/ai-bg), container max-width 480px, TypingIndicator motion v2, ChatHeader integra `<Logo>` + anipis-companion. Feature flag `brand-v2-chat-enabled` gate render. Voice lint PASS.
- [ ] **17. Migrar MoodCheckin** — mood colors v2 DESSATURADAS, hex separados crisis colors (zero overlap), MoodSelector + MoodHistory atualizados. Feature flag `brand-v2-mood-enabled`.
- [ ] **18. Migrar BreathingExercise** — anipis-breath custom icon + I-05 illustration + motion co-regulacao (5 principles F-04). prefers-reduced-motion fallback estatico testado. Feature flag `brand-v2-breathing-enabled`.
- [ ] **19. Migrar OnboardingFlow** — 3 ilustracoes I-02/I-03/I-04 integradas, transicoes motion v2, welcome step usa Fraunces Italic em pull-quote (uso 5-10% raro ritualistico), copy voice "voce sempre". Feature flag `brand-v2-onboarding-enabled`.
- [ ] **20. Migrar HeroPage** — path confirmado em pre-flight #1. Integrar Logo D3 + Flux hero render ambient + 3 CTAs com tokens primary.500. Copy voice v2 100%. Feature flag `brand-v2-hero-enabled`.

### Multi-theme + Voice + Backlog (Task 9-10)

- [ ] **21. Multi-theme switcher /settings/appearance** — page nova em `app/(app)/settings/appearance/page.tsx`. Dropdown Warm/Calm/Soft + preview thumbnails (Flux T5 thumbs) + persist localStorage. Sync Supabase `user_preferences` table (criar migration se nao existe).
- [ ] **22. Dark mode opcional Warm** — auto-detect `prefers-color-scheme: dark` + override manual settings. Apenas warm theme MVP (calm/soft dark fica fase 2).
- [ ] **23. Voice v2 lint rule** — custom ESLint plugin OR text-lint config detectando "voce" obrigatorio + anti-positividade toxica regex patterns. Override via `/* voice-v2-allow */` comment para casos excepcionais aprovados Uma.

---

## C. QA (5 itens) — Task 9 quality gates

- [ ] **24. axe-core CI gate** — `.github/workflows/accessibility.yml` ou existing CI extended. PR fail se score < 90 em 5 componentes migrados. WCAG AAA manual review crisis screens (CrisisAlert + CrisisFullScreen + CrisisBanner — verificar contraste com tokens v2 ja que herdam paleta).
- [ ] **25. Visual regression Chromatic OR Percy** — snapshots 5 componentes x 3 themes (Warm/Calm/Soft) x 3 breakpoints (375/768/1280) = 45 snapshots por componente = 225 baseline snapshots. PR diff review obrigatorio.
- [ ] **26. Cross-browser BrowserStack** — Chrome + Safari + Firefox + Edge ultimas 2 versoes x 5 componentes = 40 screenshots commitados em `docs/qa/SAI-RB-001-cross-browser/{browser}/`.
- [ ] **27. Mobile real device** — iPhone 12+ iOS 17+ Safari (founder Breno) + Android Pixel 6+ Chrome (emulator OR real device @qa). 5 componentes smoke test sem bugs visuais. Document em `docs/qa/SAI-RB-001-mobile-real-device.md`.
- [ ] **28. prefers-reduced-motion audit** — DevTools toggle reduced motion + manual review todos motion ambient/transitions. Fallback estatico funcional em CADA componente migrado. Documentar PASS em PR.

---

## D. Launch (2 itens) — Task 10 rollout

- [ ] **29. Feature flag rollout 10% -> 50% -> 100%** — canary 10% por 3 dias, monitorar Sentry error rate (auto-rollback se >2x baseline). 50% por 3 dias, validar Lighthouse Performance score nao regrediu >5 pts vs baseline pre-flight #7. 100% production toggle. Manter flags 30 dias para rollback emergencial.
- [ ] **30. Deprecate v1 legacy + cleanup** — apos 30 dias 100% estaveis, remover feature flags + legacy code em `_legacy-pre-v2/`. Atualizar 5 stories backlog (SAI-005/SAI-007/SAI-011/SAI-100/SAI-102) com status changelog "MIGRATED via SAI-RB-001 — flag legacy removed YYYY-MM-DD". Servir PDF brand reference em `/docs/brand-reference.pdf` (route handler `app/docs/brand-reference/route.ts`).

---

## Tracking — Progress percentage

```
Pre-flight       [ 0/8  ]   0%   ░░░░░░░░░░░░░░░░░░░░
Implementation   [ 0/15 ]   0%   ░░░░░░░░░░░░░░░░░░░░
QA               [ 0/5  ]   0%   ░░░░░░░░░░░░░░░░░░░░
Launch           [ 0/2  ]   0%   ░░░░░░░░░░░░░░░░░░░░

TOTAL            [ 0/30 ]   0%   ░░░░░░░░░░░░░░░░░░░░
```

Atualizar este bloco conforme progride. Quando totalizar 30/30, story SAI-RB-001 entra status `Done` + changelog.

---

## Bloqueadores conhecidos a monitorar

| Bloqueador | Owner | Risco se atrasa |
|------------|-------|-----------------|
| Safety pipeline + voice approval (#2) | @analyst | Task 6 lint pode rejeitar copy = retrabalho |
| Replicate API key (#3) | @devops | Task 5 (3 Flux renders) bloqueado |
| HeroPage path canon (#1) | @dev | Task 8 nao pode comecar sem confirmar |
| Designer freelancer T3 (5 ilustracoes #14) | @design-lead | Asset production pode estourar timeline |
| Sprint 1-3 backend stability | @dev (Dex) | Se safety pipeline mudar, voice v2 pode precisar ajuste |

---

## Comandos uteis durante migracao

```powershell
# Validar tokens audit (zero hardcoded)
npm run lint -- --rule "no-hardcoded-colors: error"

# Validar contrast WCAG AA
node apps/serenity-ai/apps/web/scripts/validate-contrast.mjs

# Rodar axe-core local
npm test -- --testNamePattern="accessibility"

# Lighthouse local snapshot
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-now.json

# Comparar baseline vs atual
diff lighthouse-baseline.json lighthouse-now.json
```

---

*Pax (PO) — 2026-05-16 — Use este checklist como single source of truth para tracking. NAO reordene; sequencia evita retrabalho.*
