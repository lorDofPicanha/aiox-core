# Design Systems Engineer — Specs Tecnicos Rebrand v2 Implant

**Agente:** Token the Builder (design-systems-engineer)
**Story canon:** `SAI-RB-001-rebrand-v2-implant`
**Data:** 2026-05-16
**Escopo desta contribuicao:** Tasks 0-1 + Task 9 (multi-theme) + cross-task WCAG gate + migration order
**Entradas canonicas:**
- `D:/AIOS/docs/projects/anipis/squad-16mai/05-design/tokens.json` (v2 W3C DTCG)
- `D:/AIOS/apps/serenity-ai/apps/web/src/styles/design-tokens.css` (v3 Caderno — A SUBSTITUIR mantendo retro-compat 30d)
- `D:/AIOS/apps/serenity-ai/apps/web/src/app/globals.css` (Tailwind 4 CSS-first)
- `D:/AIOS/apps/serenity-ai/apps/web/src/app/layout.tsx` (next/font Inter+Newsreader — A SUBSTITUIR)

Construo este pacote em **7 sessoes operacionais** mapeando 1:1 ao briefing. Codigo aspirational onde aplicavel; rodar antes de qualquer commit.

---

## 1. `packages/design-tokens/` — Setup do package

### 1.1 Diretorio canonico

Crio um novo workspace package em `apps/serenity-ai/packages/design-tokens/`. O workspace ja existe (turborepo monorepo com `apps/web` + `packages/shared`); adiciono `packages/design-tokens` como peer de `packages/shared`.

```
apps/serenity-ai/packages/design-tokens/
├── package.json
├── tsconfig.json
├── README.md                                # como gerar build + adicionar novos themes
├── src/
│   ├── index.ts                             # re-exports publicos (tokens + themes + tailwind)
│   ├── tokens/
│   │   ├── primitives.ts                    # raw values — colors, spacing, radius, motion (theme-independent)
│   │   ├── semantic.ts                      # text/surface/border/intent semantics — references primitives
│   │   ├── components.ts                    # button/card/chat-bubble/mood-card — references semantic + shared
│   │   └── shared.ts                        # crisis, mood, semantic state, typography, spacing
│   ├── themes/
│   │   ├── warm.ts                          # Aurora Coral (default)
│   │   ├── calm.ts                          # Sage Forest (opt-in)
│   │   ├── soft.ts                          # Lavender Mist (opt-in)
│   │   └── index.ts                         # export THEMES = { warm, calm, soft }
│   ├── tailwind/
│   │   ├── theme.ts                         # Tailwind v4 @theme block as TS object (export default)
│   │   └── plugin.ts                        # Tailwind plugin function — emits :root + [data-theme] CSS vars
│   └── css/
│       ├── design-tokens-v2.css             # generated — Layer 1 + Layer 2 v2
│       ├── design-tokens-legacy-alias.css   # generated — v1/v3 -> v2 aliases (30d)
│       └── fonts.css                        # @font-face block — self-hosted woff2
├── scripts/
│   ├── build.mjs                            # roda todos os builders abaixo
│   ├── build-css.mjs                        # tokens.ts -> design-tokens-v2.css
│   ├── build-legacy-alias.mjs               # gera aliases v1/v3 -> v2 (30d retro-compat)
│   ├── build-tailwind.mjs                   # exporta @theme block como string
│   └── build-dtcg.mjs                       # exporta tokens.json DTCG (CI artifact)
└── dist/                                    # build output (gitignored exc. .gitkeep)
    ├── tokens/
    ├── themes/
    ├── css/
    └── tailwind/
```

### 1.2 `package.json` shape

```json
{
  "name": "@serenity-ai/design-tokens",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./tailwind": { "import": "./dist/tailwind/theme.js" },
    "./css": "./dist/css/design-tokens-v2.css",
    "./css/legacy": "./dist/css/design-tokens-legacy-alias.css",
    "./css/fonts": "./dist/css/fonts.css",
    "./dtcg": "./dist/tokens.dtcg.json"
  },
  "scripts": {
    "build": "node scripts/build.mjs",
    "build:css": "node scripts/build-css.mjs",
    "build:legacy": "node scripts/build-legacy-alias.mjs",
    "build:tailwind": "node scripts/build-tailwind.mjs",
    "build:dtcg": "node scripts/build-dtcg.mjs",
    "watch": "node scripts/build.mjs --watch",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "chokidar": "^4.0.0"
  }
}
```

### 1.3 Por que custom builder vs Style Dictionary

Avaliei Style Dictionary v4: vence em ecosystem mas exige config heavy + plugins para outputs custom (Tailwind v4 @theme block nao tem transformer oficial). Para 70 tokens (Rams reduction 130 -> 70) e 3 outputs (CSS, Tailwind @theme, DTCG JSON), o overhead nao paga. **Decisao: custom builder em ~250 LOC**, com `tokens.json` v2 como sink final (re-emitido via `build-dtcg.mjs` para CI artifact e auditoria externa). Migracao para Style Dictionary fica opcional fase 2 se time crescer.

### 1.4 `src/tokens/primitives.ts` — exemplo

```ts
// Theme-independent raw values. NEVER imported by components directly.
export const primitives = {
  color: {
    // Warm theme (Aurora Coral)
    warm: {
      primary: { 50: '#FFF1E8', 100: '#FFDCBF', 300: '#FF9A5C',
                 500: '#DC6B3A', 700: '#9F4221' },
      secondary: { 100: '#D9EDE3', 300: '#8EC5A9', 500: '#4A9672', 700: '#2D6B4D' },
      accent: { 100: '#FFF3D6', 500: '#E6AE2C' },
      neutral: { 50: '#FAFAF8', 200: '#E8E6E1', 500: '#78746C',
                 800: '#2A2823', 900: '#1A1916' },
    },
    // Calm theme (Sage Forest)
    calm: { /* ...mirror */ },
    // Soft theme (Lavender Mist)
    soft: { /* ...mirror */ },
  },
  spacing: { 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
             5: '1.25rem', 6: '1.5rem', 8: '2rem', 12: '3rem', 16: '4rem' },
  radius: { xs: '4px', sm: '8px', md: '16px', bubble: '20px', full: '9999px' },
  // ...etc (1:1 mirror de tokens.json)
} as const;

export type Primitives = typeof primitives;
```

### 1.5 Tailwind config exportavel — `src/tailwind/theme.ts`

```ts
import { primitives } from '../tokens/primitives';

// Exportable Tailwind v4 @theme content. Consumed by globals.css via
// `@import "@serenity-ai/design-tokens/tailwind"` (CSS-first) OR by
// tailwind.config.ts (legacy v3 fallback path).
export const tailwindTheme = {
  colors: {
    // Surface utilities resolve to CSS vars (theme-swappable)
    'surface-page':     'var(--anipis-surface-page)',
    'surface-elevated': 'var(--anipis-surface-elevated)',
    'surface-overlay':  'var(--anipis-surface-overlay)',
    'text-primary':     'var(--anipis-text-primary)',
    'text-secondary':   'var(--anipis-text-secondary)',
    'text-muted':       'var(--anipis-text-muted)',
    'primary-50':       'var(--anipis-primary-50)',
    'primary-500':      'var(--anipis-primary-500)',
    'primary-700':      'var(--anipis-primary-700)',
    // ...
    // Crisis tokens NEVER theme-swap — read raw primitive
    'crisis-yellow':     '#E8B233',
    'crisis-orange':     '#E37B2E',
    'crisis-red':        '#C72828',
    'crisis-red-strong': '#A11C1C',
  },
  fontFamily: {
    sans:  ['var(--font-general-sans)', 'system-ui', 'sans-serif'],
    body:  ['var(--font-inter)',         'system-ui', 'sans-serif'],
    quote: ['var(--font-fraunces)',      'Georgia', 'serif'],
  },
  borderRadius: primitives.radius,
  spacing: primitives.spacing,
  // ...
} as const;

export default tailwindTheme;
```

---

## 2. Tailwind 4 CSS-first com tokens v2

Tailwind v4 usa `@theme {}` em CSS (nao mais `tailwind.config.ts`). Nova `globals.css` apos migracao:

```css
/* apps/web/src/app/globals.css — v2 */
@import "tailwindcss";

/* v2 tokens (Layer 1 brand primitives + Layer 2 semantic per-theme) */
@import "@serenity-ai/design-tokens/css";

/* Self-hosted fonts (General Sans + Inter + Fraunces) */
@import "@serenity-ai/design-tokens/css/fonts";

/* LEGACY alias layer — DEPRECATED. Remove apos 30 dias estaveis (target: 2026-06-30) */
@import "@serenity-ai/design-tokens/css/legacy";

@theme {
  /* Surface utilities (theme-swap via :root[data-theme]) */
  --color-surface-page:     var(--anipis-surface-page);
  --color-surface-elevated: var(--anipis-surface-elevated);
  --color-surface-overlay:  var(--anipis-surface-overlay);

  /* Text */
  --color-text-primary:   var(--anipis-text-primary);
  --color-text-secondary: var(--anipis-text-secondary);
  --color-text-muted:     var(--anipis-text-muted);

  /* Brand ramps (theme-swap) */
  --color-primary-50:  var(--anipis-primary-50);
  --color-primary-100: var(--anipis-primary-100);
  --color-primary-300: var(--anipis-primary-300);
  --color-primary-500: var(--anipis-primary-500);
  --color-primary-700: var(--anipis-primary-700);

  /* Crisis (FIXED — nunca swap) */
  --color-crisis-yellow:     #E8B233;
  --color-crisis-orange:     #E37B2E;
  --color-crisis-red:        #C72828;
  --color-crisis-red-strong: #A11C1C;

  /* Mood (FIXED — nunca swap, F-11 rule) */
  --color-mood-1: #7A6B8A;
  --color-mood-2: #8A8EB8;
  --color-mood-3: #A0B0B8;
  --color-mood-4: #B8C4A0;
  --color-mood-5: #D4C4A0;

  /* Fonts */
  --font-sans:  var(--font-general-sans), system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-body:  var(--font-inter),         system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-quote: var(--font-fraunces),      Georgia, 'Times New Roman', serif;

  /* Type scale (16-21 styles from tokens.json shared.typography.styles) */
  --text-display-xl: 56px;       --text-display-xl--line-height: 1.15;  --text-display-xl--letter-spacing: -0.02em;
  --text-display-md: 40px;       --text-display-md--line-height: 1.15;
  --text-h1: 40px;               --text-h1--line-height: 1.25;          --text-h1--letter-spacing: -0.015em;
  --text-h2: 32px;               --text-h2--line-height: 1.25;
  --text-h3: 24px;               --text-h3--line-height: 1.3;
  --text-body-lg: 20px;          --text-body-lg--line-height: 1.65;
  --text-body-md: 18px;          --text-body-md--line-height: 1.7;
  --text-body-sm: 14px;          --text-body-sm--line-height: 1.5;
  --text-pullquote: 28px;        --text-pullquote--line-height: 1.4;
  /* ... */

  /* Spacing/radius/shadow/motion — direct passthrough */
  --radius-xs: 4px; --radius-sm: 8px; --radius-md: 16px;
  --radius-bubble: 20px; --radius-full: 9999px;

  --shadow-soft:     0 2px 12px rgba(42, 40, 35, 0.06);
  --shadow-elevated: 0 8px 32px rgba(42, 40, 35, 0.12);
}
```

### 2.1 Feature flag compat

Em vez de hard-switch, expomos os 3 layers em paralelo durante 30 dias:

- `@import "@serenity-ai/design-tokens/css"` — v2 (sempre carregado)
- `@import "@serenity-ai/design-tokens/css/legacy"` — aliases v1/v3 -> v2 (carregado se `BRAND_V2_LEGACY_ALIAS=true` em env build)
- Variable `--brand-v2-enabled: true` no `:root` quando flag verde

Componentes podem inspecionar via CSS:

```css
.chat-bubble-user {
  background: var(--chat-bubble-user-bg);  /* legacy alias */
}
[data-brand-v2-enabled="true"] .chat-bubble-user {
  background: var(--anipis-primary-500);   /* v2 direct */
}
```

---

## 3. Fonts self-hosted — pipeline

### 3.1 Decisao: substituir `next/font/google` por `next/font/local`

Razao: General Sans nao esta no Google Fonts (so Fontshare). Para manter consistencia, ALL 3 fonts viram self-hosted. Bonus: `next/font/local` corta DNS lookup a fontshare.com e fonts.gstatic.com (-80ms LCP teorico em conexao 4G).

### 3.2 Aquisicao + subset PT-BR

Script `scripts/fetch-fonts.mjs` em `packages/design-tokens/`:

```ts
// scripts/fetch-fonts.mjs
import { execSync } from 'node:child_process';
import fs from 'node:fs';

// 1. General Sans 5 weights (cortado de 8 — 400/500/600/700 + italic 400)
//    Source: Fontshare (free for commercial via license email confirmation)
const GENERAL_SANS_WEIGHTS = [400, 500, 600, 700];
const downloads = [
  { url: 'https://api.fontshare.com/v2/fonts/general-sans/400.otf', out: 'general-sans-400.otf' },
  // ...etc
];

// 2. Inter via Google Fonts API (5 weights: 400/500/600 + 400 italic)
//    Use google-webfonts-helper CLI ou direct curl
const INTER_WEIGHTS = [400, 500, 600];

// 3. Fraunces Italic 2 weights (400/500) — Google Fonts
const FRAUNCES_WEIGHTS = [400, 500];

// 4. Subset PT-BR usando fonttools (pip install fonttools brotli)
//    Latin + latin-ext glyph set (~250 chars, cobre PT-BR completo)
const PT_BR_UNICODE_RANGE = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,' +
                            'U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,' +
                            'U+2000-206F,U+2074,U+20AC,U+2122,U+2191,' +
                            'U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

// pyftsubset {input}.otf --output-file={output}.woff2 \
//   --flavor=woff2 --unicodes="{PT_BR_UNICODE_RANGE}" \
//   --layout-features='kern,liga,clig' --no-hinting
```

Output: `packages/design-tokens/src/css/fonts/*.woff2` (commitado, ~70KB total subsetted).

### 3.3 `fonts.css` declarations

```css
/* packages/design-tokens/src/css/fonts.css — generated */

@font-face {
  font-family: 'General Sans';
  src: url('/fonts/general-sans-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                 U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F,
                 U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
                 U+FEFF, U+FFFD;
}
@font-face { font-family: 'General Sans'; src: url('/fonts/general-sans-500.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'General Sans'; src: url('/fonts/general-sans-600.woff2') format('woff2'); font-weight: 600; font-display: swap; }
@font-face { font-family: 'General Sans'; src: url('/fonts/general-sans-700.woff2') format('woff2'); font-weight: 700; font-display: swap; }

@font-face { font-family: 'Inter'; src: url('/fonts/inter-400.woff2') format('woff2'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Inter'; src: url('/fonts/inter-500.woff2') format('woff2'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Inter'; src: url('/fonts/inter-600.woff2') format('woff2'); font-weight: 600; font-display: swap; }

@font-face { font-family: 'Fraunces'; src: url('/fonts/fraunces-italic-400.woff2') format('woff2'); font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: 'Fraunces'; src: url('/fonts/fraunces-italic-500.woff2') format('woff2'); font-weight: 500; font-style: italic; font-display: swap; }
```

### 3.4 `layout.tsx` migration

```tsx
// apps/web/src/app/layout.tsx — v2
import localFont from 'next/font/local';
import './globals.css';

const generalSans = localFont({
  src: [
    { path: '../../public/fonts/general-sans-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/general-sans-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/general-sans-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/general-sans-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-general-sans',
  display: 'swap',
  preload: true,                          // critical for LCP — General Sans is heading font
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: 'Arial',            // size-adjust em fallback (-CLS)
});

const inter = localFont({
  src: [
    { path: '../../public/fonts/inter-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/inter-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/inter-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,                          // body font — high paint frequency
});

const fraunces = localFont({
  src: [
    { path: '../../public/fonts/fraunces-italic-400.woff2', weight: '400', style: 'italic' },
    { path: '../../public/fonts/fraunces-italic-500.woff2', weight: '500', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,                         // uso 5-10% das telas — nao preload
});
```

Arquivos viram `apps/web/public/fonts/*.woff2` (copiados pelo build do package via prebuild step).

### 3.5 LCP impact assessment

Baseline atual (next/font/google Inter+Newsreader): LCP ~1.8s em 4G slow.

Esperado pos migracao (3 fonts self-hosted subset PT-BR):
- General Sans 4 weights × ~18KB = 72KB
- Inter 3 weights × ~16KB = 48KB
- Fraunces italic 2 weights × ~22KB = 44KB
- **Total bundle: ~164KB woff2** (vs ~95KB baseline). Gap: +69KB.

Mitigacao:
- `preload: true` apenas General Sans + Inter (Fraunces nao). Pre-paint headers servem font apos HTML.
- `font-display: swap` em todos — texto aparece com fallback ate font carregar.
- `adjustFontFallback: 'Arial'` em General Sans + Inter — size-adjust evita CLS shift quando font subscribe.
- `next/font/local` adiciona `<link rel=preload as=font crossorigin>` automatico p/ preloaded.

**Target LCP pos-migracao: <2.0s 4G slow (regressao <200ms aceitavel — Lighthouse budget R6 do risk register permite +5pts perf score).**

Smoke test obrigatorio T0.4: rodar Lighthouse 3x antes/depois em homepage + onboarding step 1 + chat first paint. Falha = >5pts perf score regression -> rollback de `preload: true` para `preload: false` em Fraunces alem disso.

---

## 4. Multi-theme switcher — implementation

### 4.1 Architecture

3 themes (warm default, calm, soft) selecionaveis em `/settings/appearance`. Persistencia: localStorage + Supabase profile.theme_preference (sync best-effort, localStorage wins offline). Dark mode permanece Warm-only no MVP (R5 risk register).

### 4.2 Boot script — `layout.tsx`

```tsx
// Inline script (anti-FOUC) — runs before React hydrates, in <head>
const themeBootScript = `
(function(){
  try {
    var stored = localStorage.getItem('anipis-theme-v2');
    var ALLOWED = ['warm','calm','soft'];
    var theme;
    if (stored && ALLOWED.indexOf(stored) !== -1) {
      theme = stored;
    } else {
      theme = 'warm';  // default — Aurora Coral
    }
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
  } catch (e) {
    document.documentElement.dataset.theme = 'warm';
  }
})();
`;
```

### 4.3 React Context — `ThemeProvider.tsx`

```tsx
// apps/web/src/components/theme/ThemeProvider.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'warm' | 'calm' | 'soft';
type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children, initialTheme }: {
  children: React.ReactNode;
  initialTheme?: Theme;       // server-rendered from cookie/profile
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme || 'warm');
  const [dark, setDarkState] = useState(false);

  // Hydration: read from DOM (set by boot script)
  useEffect(() => {
    const domTheme = (document.documentElement.dataset.theme as Theme) || 'warm';
    setThemeState(domTheme);
    setDarkState(document.documentElement.dataset.dark === 'true');
  }, []);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem('anipis-theme-v2', t);
    setThemeState(t);
    // Sync to Supabase (fire-and-forget; offline-tolerant)
    fetch('/api/profile/theme', {
      method: 'PATCH',
      body: JSON.stringify({ theme: t }),
    }).catch(() => { /* silent — localStorage wins */ });
  }, []);

  const setDark = useCallback((d: boolean) => {
    if (theme !== 'warm') return;   // MVP: dark only for warm
    document.documentElement.dataset.dark = String(d);
    localStorage.setItem('anipis-dark-v2', String(d));
    setDarkState(d);
  }, [theme]);

  return <Ctx.Provider value={{ theme, setTheme, dark, setDark }}>{children}</Ctx.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be inside <ThemeProvider>');
  return ctx;
};
```

### 4.4 CSS layer — `design-tokens-v2.css` (theme swap)

```css
/* Theme swap layer — only Layer 2 semantic vars switch.
   Layer 1 primitives + Layer 3 components stay constant. */

:root,
:root[data-theme="warm"] {
  --anipis-primary-50:  #FFF1E8;
  --anipis-primary-100: #FFDCBF;
  --anipis-primary-300: #FF9A5C;
  --anipis-primary-500: #DC6B3A;
  --anipis-primary-700: #9F4221;
  --anipis-surface-page:     #FAFAF8;
  --anipis-surface-elevated: #FFFFFF;
  --anipis-text-primary:     #2A2823;
  --anipis-text-secondary:   #78746C;
  --anipis-text-muted:       #A8A49C;
  --anipis-border-default:   #E8E6E1;
  --anipis-chat-user-bg:     #DC6B3A;
  --anipis-chat-ai-bg:       #FFF1E8;
  color-scheme: light;
}

:root[data-theme="warm"][data-dark="true"] {
  --anipis-surface-page:     #1A1916;
  --anipis-surface-elevated: #2A2823;
  --anipis-text-primary:     #FAFAF8;
  --anipis-text-secondary:   #E8E6E1;
  --anipis-chat-ai-bg:       #2A2823;
  color-scheme: dark;
}

:root[data-theme="calm"] {
  --anipis-primary-500: #4A9672;
  --anipis-primary-700: #2D6B4D;
  --anipis-surface-page: #F7F9F8;
  /* ... */
}

:root[data-theme="soft"] {
  --anipis-primary-500: #7159A0;
  --anipis-primary-700: #4A3B6E;
  /* ... */
}

/* prefers-reduced-motion — NEGOTIATIONS OFF */
@media (prefers-reduced-motion: reduce) {
  :root, :root[data-theme] {
    --anipis-motion-breath-duration: 0ms;
    --anipis-motion-arrive-duration: 0ms;
    /* ... */
  }
}
```

### 4.5 Migration path single-theme -> multi

1. **Pre:** v3 atual ja usa `[data-theme]` (default/madrugada). Token names diferentes (`--surface-canvas` vs `--anipis-surface-page`).
2. **Step 1:** Adicionar Layer v2 em paralelo, prefixo `--anipis-*` (sem colisao com v3).
3. **Step 2:** Renomear `[data-theme="default"]` -> `[data-theme="warm"]` via boot script migration logic:
   ```ts
   // boot script migration
   var stored = localStorage.getItem('anipis-theme-v2') ||
                (localStorage.getItem('anipis-theme') === 'default' ? 'warm' :
                 localStorage.getItem('anipis-theme') === 'madrugada' ? 'warm' /* + dark=true */ :
                 'warm');
   ```
3. **Step 3:** Adicionar `calm` + `soft` themes apos warm validado canary 50%.
4. **Step 4:** Remover legacy `[data-theme="default"]` apos 30d (ja remap em boot script).

---

## 5. WCAG validation script — CI gate

### 5.1 Estrategia hibrida

Atual `scripts/validate-contrast.mjs` ja valida hex-pairs offline (RAW). Mantenho + estendo:

1. **Static gate (existing):** `validate-contrast.mjs` extended para 3 themes v2 (warm + calm + soft) + warm-dark. Roda em pre-commit + CI.
2. **Runtime gate (NEW):** `axe-core` via Playwright em pages criticas. Roda em CI apos `next build`. Falha build se contrast violations >0 em screens crisis.

### 5.2 Static gate — `validate-contrast.mjs` v2 update

```js
// Append to existing COLORS table:
const COLORS_V2 = {
  // warm theme
  'warm.surface-page':     '#FAFAF8',
  'warm.surface-elevated': '#FFFFFF',
  'warm.text-primary':     '#2A2823',
  'warm.text-secondary':   '#78746C',
  'warm.text-muted':       '#A8A49C',
  'warm.primary-500':      '#DC6B3A',
  'warm.primary-700':      '#9F4221',
  // calm theme
  'calm.surface-page':     '#F7F9F8',
  'calm.primary-500':      '#4A9672',
  // soft theme
  'soft.surface-page':     '#F8F6FA',
  'soft.primary-500':      '#7159A0',
  // crisis (shared all themes)
  'shared.crisis-red-strong': '#A11C1C',
  'shared.crisis-yellow-bg':  '#FFF4DC',
  // mood (shared)
  'shared.mood-1': '#7A6B8A',
  /* ... */
};

const PAIRS_V2 = [
  // Critical AAA (body) — must be >= 7:1
  { fg: 'warm.text-primary', bg: 'warm.surface-page', level: 'AAA-body' },
  { fg: 'warm.text-primary', bg: 'warm.surface-elevated', level: 'AAA-body' },
  // AA body — must be >= 4.5:1
  { fg: 'warm.text-secondary', bg: 'warm.surface-page', level: 'AA-body' },
  { fg: 'warm.text-muted', bg: 'warm.surface-page', level: 'AA-large' },
  // Crisis CTAs — AAA mandatory (vida em jogo)
  { fg: '#FFFFFF', bg: 'shared.crisis-red-strong', level: 'AAA-body' },
  // Primary CTA hover
  { fg: '#FFFFFF', bg: 'warm.primary-700', level: 'AA-body' },
  // Mood chips (against page)
  { fg: 'warm.text-primary', bg: 'shared.mood-1', level: 'AA-large' },
  /* ...para todos os themes (3) x todos os pares semanticos (~18) = ~54 pairs */
];
```

### 5.3 Runtime gate — Playwright + axe-core

```ts
// apps/web/tests/a11y/wcag-critical-screens.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CRITICAL_SCREENS = [
  { path: '/',                          name: 'hero' },
  { path: '/onboarding/welcome',        name: 'onboarding-welcome' },
  { path: '/diary',                     name: 'chat-window' },
  { path: '/mood-checkin',              name: 'mood-checkin' },
  { path: '/crisis/179',                name: 'crisis-banner' },           // AAA mandatory
  { path: '/settings/appearance',       name: 'theme-switcher' },
];

const THEMES = ['warm', 'calm', 'soft'] as const;

for (const screen of CRITICAL_SCREENS) {
  for (const theme of THEMES) {
    test(`a11y ${screen.name} @ ${theme}`, async ({ page }) => {
      await page.goto(screen.path);
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
        localStorage.setItem('anipis-theme-v2', t);
      }, theme);
      await page.reload();
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Crisis screens require AAA
      const requiredLevel = screen.name.startsWith('crisis-') ? ['wcag2aaa'] : [];
      const aaaResults = requiredLevel.length
        ? await new AxeBuilder({ page }).withTags(requiredLevel).analyze()
        : { violations: [] };

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
      expect(aaaResults.violations).toEqual([]);
    });
  }
}
```

CI workflow `.github/workflows/wcag-gate.yml` roda esses tests em PR. Falha = bloqueio merge.

---

## 6. Migration order — 5 fases sequenciais

Crucial NAO paralelizar. Cada fase deve passar `npm run lint:contrast` + `npm test` + visual regression antes proxima.

### F1 — tokens-only (no visual change)

**Branch:** `feat/anipis-rb-tokens-fonts/phase-1-tokens`
**Duracao estimada:** 2 dias dev
**Mudancas:**
- Criar `packages/design-tokens/` com tudo estruturado mas SEM remover legacy.
- `globals.css` adiciona `@import "@serenity-ai/design-tokens/css"` mas mantem `@import "../styles/design-tokens.css"` (v3 atual).
- Layer alias `design-tokens-legacy-alias.css` mapeia tokens v3 -> v2 vars (`--surface-canvas` -> `var(--anipis-surface-page)`)
- **Acceptance:** screenshot visual diff = 0 pixels (Percy/Chromatic). Zero new console errors. Build size delta < +5KB.
- **Rollback:** revert PR, branch isolada.

### F2 — fonts + base typography

**Branch:** `feat/anipis-rb-tokens-fonts/phase-2-fonts`
**Duracao:** 2 dias
**Mudancas:**
- Adicionar woff2 files em `public/fonts/`.
- `layout.tsx` substituir `next/font/google Inter+Newsreader` por `next/font/local General Sans+Inter+Fraunces`.
- `--font-general-sans`, `--font-inter`, `--font-fraunces` substituem `--font-inter`, `--font-newsreader` no globals.css `@theme`.
- **Acceptance:** Lighthouse perf score regression <5pts. LCP <2.0s 4G slow. Zero CLS spike. Visual diff allowed — typography mudou intencionalmente.
- **Rollback:** reverter para `next/font/google` em emergencia (1 commit).

### F3 — colors layer

**Branch:** `feat/anipis-rb-tokens-fonts/phase-3-colors`
**Duracao:** 3 dias (inclui WCAG audit)
**Mudancas:**
- Substituir Layer 2 (`--surface-canvas` etc) por Layer 2 v2 (`--anipis-surface-page` etc).
- Boot script migrar `data-theme="default"` -> `data-theme="warm"`.
- Manter aliases legacy (`--surface-canvas` -> `var(--anipis-surface-page)`) para componentes nao migrados ainda.
- **Acceptance:** `validate-contrast.mjs` PASS para todas 54+ pairs. axe-core PASS em hero + chat + crisis. Visual diff esperado e revisado por @ui-designer.
- **Rollback:** alias layer reverte para v3 tokens (1 commit).

### F4 — spacing + radius + shadows

**Branch:** `feat/anipis-rb-tokens-fonts/phase-4-tokens-numeric`
**Duracao:** 1 dia
**Mudancas:**
- Spacing 8px scale (mesmo de v3, no-op em maioria).
- Radius: v2 tem 5 valores (xs/sm/md/bubble/full) vs v3 4. Adicionar `--radius-bubble: 20px` para chat bubbles.
- Shadows: warm + dark variants.
- **Acceptance:** zero visual diff em components nao migrados (aliases). Mudanca chat bubble esperada.

### F5 — component-level overrides

**Branch:** depende — uma sub-branch por componente conforme EPIC-8.
**Duracao:** 5 dias (Tasks 6+7+8)
**Mudancas:**
- ChatWindow / MoodCheckin / BreathingExercise / OnboardingFlow / HeroPage.
- Cada componente flagged via `brand-v2-{component}-enabled`.
- Components leem tokens v2 diretos (sem alias).
- **Acceptance per component:** WCAG PASS + visual diff approved + voice lint PASS + feature flag working.

---

## 7. Backward-compat strategy — 30d transition

### 7.1 Feature flag por componente

`packages/shared/src/feature-flags.ts`:

```ts
export const BRAND_V2_FLAGS = {
  'chat':       process.env.NEXT_PUBLIC_BRAND_V2_CHAT_ENABLED       === 'true',
  'mood':       process.env.NEXT_PUBLIC_BRAND_V2_MOOD_ENABLED       === 'true',
  'breathing':  process.env.NEXT_PUBLIC_BRAND_V2_BREATHING_ENABLED  === 'true',
  'onboarding': process.env.NEXT_PUBLIC_BRAND_V2_ONBOARDING_ENABLED === 'true',
  'hero':       process.env.NEXT_PUBLIC_BRAND_V2_HERO_ENABLED       === 'true',
} as const;

export const isBrandV2 = (component: keyof typeof BRAND_V2_FLAGS) =>
  BRAND_V2_FLAGS[component];
```

Componentes:
```tsx
import { isBrandV2 } from '@serenity-ai/shared/feature-flags';
import { ChatBubbleV1 } from './ChatBubbleV1';
import { ChatBubbleV2 } from './ChatBubbleV2';

export const ChatBubble = (props) =>
  isBrandV2('chat') ? <ChatBubbleV2 {...props} /> : <ChatBubbleV1 {...props} />;
```

### 7.2 Dual-emit CSS vars durante 30d

Layer alias `design-tokens-legacy-alias.css` mantem TODAS as old vars apontando para v2 equivalentes:

```css
/* design-tokens-legacy-alias.css — DEPRECATED. Remove 2026-06-30. */
:root {
  /* v3 -> v2 mappings */
  --surface-canvas:  var(--anipis-surface-page);
  --surface-raised:  var(--anipis-surface-elevated);
  --text-primary:    var(--anipis-text-primary);
  --text-secondary:  var(--anipis-text-secondary);
  --text-muted:      var(--anipis-text-muted);
  --border-subtle:   var(--anipis-border-default);
  --intent-affirm:   #3D9A5F;
  --intent-crisis:   var(--anipis-crisis-red-strong);

  /* v2 deprecated chat aliases */
  --chat-bubble-user-bg:   var(--anipis-chat-user-bg);
  --chat-bubble-ai-bg:     var(--anipis-chat-ai-bg);

  /* v1 deprecated primary ramp */
  --primary-50:  var(--anipis-primary-50);
  --primary-500: var(--anipis-primary-500);
  --primary-700: var(--anipis-primary-700);
}
```

### 7.3 Automated tests both

Test setup roda matrix:

```ts
// jest.config + custom test matrix
describe.each([
  ['v1', false],
  ['v2', true],
])('ChatBubble in %s mode', (label, brandV2) => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_BRAND_V2_CHAT_ENABLED = String(brandV2);
  });

  it('renders user message', () => {
    const { getByText } = render(<ChatBubble role="user" text="hello" />);
    expect(getByText('hello')).toBeInTheDocument();
  });

  it('applies correct theme class', () => {
    const { container } = render(<ChatBubble role="user" text="hello" />);
    const expected = brandV2 ? 'bg-primary-500' : 'bg-chat-bubble-user-bg-legacy';
    expect(container.firstChild).toHaveClass(expected);
  });
});
```

### 7.4 Cleanup trigger

Apos 30d (target: 2026-06-30) com canary 100% e Sentry error rate stable:
1. Delete `packages/design-tokens/src/css/design-tokens-legacy-alias.css`
2. Remove `@import` do `globals.css`
3. Delete `ChatBubbleV1.tsx` + 4 outros
4. Delete `feature-flags.ts` brand-v2 entries
5. Move `apps/web/src/styles/design-tokens.css` -> `apps/web/src/styles/_legacy-pre-v2/design-tokens-v3-caderno.css` (snapshot)
6. PR titulo: `chore(rebrand-v2): cleanup legacy aliases — 30d stable`

---

## 8. Handoff checklist para outros squad members

- **@dev (Dex):** consome `@serenity-ai/design-tokens` import. Componentes leem CSS vars `--anipis-*`. Feature flags consumidos via `@serenity-ai/shared/feature-flags`. Branches sequenciais conforme F1-F5.
- **@ui-designer:** Figma sync via `tokens.json` -> DTCG export. Componentes shadcn customizados re-tokenizados via `tailwindTheme` exportable.
- **@qa (Quinn):** axe-core + Playwright suite em `tests/a11y/wcag-critical-screens.spec.ts`. Visual regression Percy/Chromatic gate em cada phase F1-F5. Lighthouse perf budget gate em F2.
- **@devops (Gage):** Provisionar env vars `NEXT_PUBLIC_BRAND_V2_*_ENABLED` em Vercel (dev=all-true, preview=match-prod, prod=staged rollout). CI workflow `.github/workflows/wcag-gate.yml` + `tokens-build.yml` (build package + publish artifacts).
- **@design-lead:** approval gate por phase F3 + F5. Assina visual diff vs Master Dossier PDF.

---

## 9. Open questions / risks documentados

1. **Fraunces Italic subset PT-BR coverage** — pyftsubset com glyph set PT-BR pode quebrar features OpenType (small caps, ligatures). Validar em T1.4 com smoke render de "Anipis e voce sempre" em pull-quote.
2. **General Sans license commercial** — Fontshare free for commercial mas exige confirmacao via email. @devops valida em T0.4.
3. **Bundle size + CDN cache eviction** — woff2 hosted em `/public/fonts/` serve via Vercel edge. Hash filename via Next.js automatico (cache-bust em redeploy nao quebra cache cross-deploy). OK.
4. **Calm + Soft themes dark mode** — fora MVP (R5). Documentar no settings page como "em breve".
5. **Mood color contrast em mood-checkin card** — mood-1 #7A6B8A bg + text white = 4.8:1 (AA large only, FAIL body). Definir tipografia mood label como `text-body-sm` + `font-weight: 600` para qualificar large. @ui-designer review.

---

## 10. Resumo de outputs entregaveis

| Artefato | Path | Quem produz | Phase |
|----------|------|-------------|-------|
| `packages/design-tokens/` package | `apps/serenity-ai/packages/design-tokens/` | @design-systems-engineer | F1 |
| `design-tokens-v2.css` | `packages/design-tokens/dist/css/` | build script | F1 |
| `design-tokens-legacy-alias.css` | `packages/design-tokens/dist/css/` | build script | F1 |
| `fonts.css` + woff2 files | `packages/design-tokens/dist/css/` + `public/fonts/` | fetch-fonts script | F2 |
| `tailwindTheme` exportable | `packages/design-tokens/dist/tailwind/theme.js` | build script | F1 |
| `globals.css` v2 | `apps/web/src/app/globals.css` | @design-systems-engineer | F1-F4 |
| `layout.tsx` self-hosted fonts | `apps/web/src/app/layout.tsx` | @design-systems-engineer | F2 |
| `ThemeProvider.tsx` | `apps/web/src/components/theme/` | @dev + Token specs | F3 |
| `validate-contrast.mjs` v2 | `apps/web/scripts/` | @design-systems-engineer + @qa | F3 |
| `wcag-critical-screens.spec.ts` | `apps/web/tests/a11y/` | @qa + Token specs | F3 |
| Feature flags module | `packages/shared/src/feature-flags.ts` | @dev + Token specs | F5 |
| Component matrix tests | `apps/web/tests/components/*.matrix.test.ts` | @qa + Token specs | F5 |

— Token, construindo sistemas de design ⚙️
