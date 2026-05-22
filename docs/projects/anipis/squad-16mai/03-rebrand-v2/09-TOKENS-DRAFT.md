# Design Tokens v2 — Draft

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Conteúdo:** Tokens CSS vars + Figma tokens W3C DTCG + Tailwind config preview
**Critical:** v2 reduz de ~130 tokens → ~70 (Rams consolidation), introduz multi-theme via `data-theme` attribute

---

## 1. CSS Vars — `design-tokens-v2.css`

```css
/*
 * Anipis Design Tokens v2
 * Schema: W3C DTCG-compatible naming
 * Themes: warm (default) / calm / soft
 * Color schemes: light / dark (via prefers-color-scheme + data-color-scheme override)
 *
 * Path: apps/serenity-ai/src/styles/design-tokens-v2.css
 * Import: @import './design-tokens-v2.css' in globals.css
 */

/* ============================================================
   BASE — Tokens primitivos compartilhados (NÃO mudam por theme)
   ============================================================ */
:root {

  /* === Crisis colors === */
  --crisis-yellow:        #E8B233;
  --crisis-yellow-bg:     #FFF4DC;
  --crisis-orange:        #E37B2E;
  --crisis-orange-bg:     #FFEAD3;
  --crisis-red:           #C72828;
  --crisis-red-bg:        #FDE2E2;
  --crisis-red-strong:    #A11C1C;

  /* === Mood colors (dessaturadas v2) === */
  --mood-1: #7A6B8A;
  --mood-2: #8A8EB8;
  --mood-3: #A0B0B8;
  --mood-4: #B8C4A0;
  --mood-5: #D4C4A0;

  /* === Semantic colors === */
  --color-success:        #3D9A5F;
  --color-success-bg:     #E3F5EA;
  --color-warning:        #D4960C;
  --color-warning-bg:     #FFF8E6;
  --color-error:          #D44040;
  --color-error-bg:       #FDE8E8;
  --color-info:           #4A7FC7;
  --color-info-bg:        #E8F0FA;

  /* === Spacing (4px base, 9 tokens) === */
  --space-1:   0.25rem;   /* 4px  */
  --space-2:   0.5rem;    /* 8px  */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */

  /* === Border radius (3 tokens — Rams reduction) === */
  --radius-sm:    0.5rem;    /* 8px  — buttons, inputs */
  --radius-md:    1rem;      /* 16px — cards */
  --radius-bubble: 1.25rem;  /* 20px — chat bubbles (signature) */
  --radius-full:  9999px;    /* pills, avatars */

  /* === Shadows (2 tokens + focus — Rams reduction) === */
  --shadow-soft:     0 2px 12px rgba(42, 40, 35, 0.06);
  --shadow-elevated: 0 8px 32px rgba(42, 40, 35, 0.12);

  /* === Touch target === */
  --touch-target-min:    2.75rem;  /* 44px WCAG */
  --touch-target-crisis: 3rem;     /* 48px — extra margin for crisis CTAs */

  /* === Motion (6 tokens) === */
  --motion-breath:     8000ms cubic-bezier(0.45, 0, 0.15, 1);
  --motion-arrive:      400ms cubic-bezier(0, 0.5, 0.3, 1);
  --motion-depart:      300ms cubic-bezier(0.5, 0, 1, 0.5);
  --motion-settle:      400ms cubic-bezier(0.45, 0, 0.15, 1);
  --motion-heartbeat:   200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  --motion-pulse:      1800ms cubic-bezier(0.4, 0, 0.6, 1);

  /* === Stagger delays === */
  --stagger-fast:  80ms;
  --stagger-slow: 150ms;

  /* === Font families === */
  --font-heading: 'General Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-body:    'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-quote:   'Fraunces', Georgia, 'Times New Roman', serif;
  --font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, monospace;

  /* === Type scale (fluid clamp) === */
  --text-display:  clamp(2.25rem, 1.5rem + 3vw, 3.5rem);     /* 36-56px */
  --text-h1:       clamp(1.75rem, 1.3rem + 2vw, 2.5rem);     /* 28-40px */
  --text-h2:       clamp(1.5rem, 1.2rem + 1.2vw, 2rem);      /* 24-32px */
  --text-h3:       clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);   /* 20-24px */
  --text-h4:       clamp(1.125rem, 1rem + 0.4vw, 1.25rem);   /* 18-20px */
  --text-h5:       1rem;                                       /* 16px */
  --text-h6:       0.875rem;                                   /* 14px */
  --text-body-lg:  clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem); /* 18-20px */
  --text-body:     clamp(1rem, 0.95rem + 0.2vw, 1.125rem);    /* 16-18px */
  --text-body-sm:  0.875rem;                                   /* 14px */
  --text-caption:  0.75rem;                                    /* 12px */
  --text-overline: 0.6875rem;                                  /* 11px */
  --text-quote:    clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem);  /* 22-28px */

  /* === Line heights === */
  --leading-display:  1.15;
  --leading-tight:    1.25;
  --leading-normal:   1.3;
  --leading-relaxed:  1.7;
  --leading-loose:    2.0;

  /* === Letter spacing === */
  --tracking-tightest: -0.02em;
  --tracking-tight:   -0.015em;
  --tracking-normal:   0;
  --tracking-wide:     0.01em;
  --tracking-widest:   0.08em;

  /* === Font weights === */
  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;

  /* === Z-index scale === */
  --z-base:     1;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    300;
  --z-toast:    400;
  --z-crisis:   500;   /* crisis banners ALWAYS on top */
}

/* ============================================================
   THEME: WARM (Aurora Coral) — DEFAULT
   ============================================================ */
:root,
[data-theme="warm"] {

  --color-primary-50:    #FFF1E8;
  --color-primary-100:   #FFDCBF;
  --color-primary-300:   #FF9A5C;
  --color-primary-500:   #DC6B3A;
  --color-primary-700:   #9F4221;

  --color-secondary-100: #D9EDE3;
  --color-secondary-300: #8EC5A9;
  --color-secondary-500: #4A9672;
  --color-secondary-700: #2D6B4D;

  --color-accent-100:    #FFF3D6;
  --color-accent-500:    #E6AE2C;

  --color-neutral-50:    #FAFAF8;
  --color-neutral-200:   #E8E6E1;
  --color-neutral-500:   #78746C;
  --color-neutral-800:   #2A2823;
  --color-neutral-900:   #1A1916;

  /* Semantic surface tokens */
  --bg-page:        var(--color-neutral-50);
  --bg-surface:     #FFFFFF;
  --bg-elevated:    #FFFFFF;
  --bg-overlay:     rgba(26, 25, 22, 0.5);
  --text-primary:   var(--color-neutral-800);
  --text-secondary: var(--color-neutral-500);
  --text-muted:     #A8A49C;
  --border-default: var(--color-neutral-200);
  --border-strong:  #D4D1CA;

  /* Chat bubble tokens */
  --chat-bubble-user-bg:     var(--color-primary-500);
  --chat-bubble-user-text:   #FFFFFF;
  --chat-bubble-ai-bg:       var(--color-primary-50);
  --chat-bubble-ai-text:     var(--color-neutral-800);
  --chat-bubble-ai-border:   var(--color-primary-100);
}

/* ============================================================
   THEME: CALM (Sage Forest)
   ============================================================ */
[data-theme="calm"] {

  --color-primary-50:    #EFF6F2;
  --color-primary-100:   #D1E8DC;
  --color-primary-300:   #7FB89B;
  --color-primary-500:   #4A9672;
  --color-primary-700:   #2D6B4D;

  --color-secondary-100: #FFDCBF;
  --color-secondary-300: #FF9A5C;
  --color-secondary-500: #DC6B3A;

  --color-accent-100:    #D6EFF2;
  --color-accent-500:    #5BA8B8;

  --color-neutral-50:    #F7F9F8;
  --color-neutral-200:   #E0E4E2;
  --color-neutral-500:   #6B736E;
  --color-neutral-800:   #252925;
  --color-neutral-900:   #161816;

  --bg-page:        var(--color-neutral-50);
  --bg-surface:     #FFFFFF;
  --bg-elevated:    #FFFFFF;
  --bg-overlay:     rgba(22, 24, 22, 0.5);
  --text-primary:   var(--color-neutral-800);
  --text-secondary: var(--color-neutral-500);
  --text-muted:     #969B98;
  --border-default: var(--color-neutral-200);
  --border-strong:  #C7CCC9;

  --chat-bubble-user-bg:     var(--color-primary-500);
  --chat-bubble-user-text:   #FFFFFF;
  --chat-bubble-ai-bg:       var(--color-primary-50);
  --chat-bubble-ai-text:     var(--color-neutral-800);
  --chat-bubble-ai-border:   var(--color-primary-100);
}

/* ============================================================
   THEME: SOFT (Lavender Mist)
   ============================================================ */
[data-theme="soft"] {

  --color-primary-50:    #F3EFF7;
  --color-primary-100:   #DCD3E8;
  --color-primary-300:   #9E89C2;
  --color-primary-500:   #7159A0;
  --color-primary-700:   #4A3B6E;

  --color-secondary-100: #F0DAE0;
  --color-secondary-500: #C47E8A;

  --color-accent-500:    #D4B88E;

  --color-neutral-50:    #F8F6FA;
  --color-neutral-200:   #E5E0EA;
  --color-neutral-500:   #736B7A;
  --color-neutral-800:   #2A252F;
  --color-neutral-900:   #1A171F;

  --bg-page:        var(--color-neutral-50);
  --bg-surface:     #FFFFFF;
  --bg-elevated:    #FFFFFF;
  --bg-overlay:     rgba(26, 23, 31, 0.5);
  --text-primary:   var(--color-neutral-800);
  --text-secondary: var(--color-neutral-500);
  --text-muted:     #A09BA5;
  --border-default: var(--color-neutral-200);
  --border-strong:  #CDC5D3;

  --chat-bubble-user-bg:     var(--color-primary-500);
  --chat-bubble-user-text:   #FFFFFF;
  --chat-bubble-ai-bg:       var(--color-primary-50);
  --chat-bubble-ai-text:     var(--color-neutral-800);
  --chat-bubble-ai-border:   var(--color-primary-100);
}

/* ============================================================
   DARK MODE — Auto via prefers-color-scheme (per theme)
   ============================================================ */
@media (prefers-color-scheme: dark) {

  :root,
  [data-theme="warm"] {
    --color-primary-50:    #2E1F18;
    --color-primary-100:   #3D2A1F;
    --color-primary-300:   #C95D35;
    --color-primary-500:   #FF9A5C;
    --color-primary-700:   #FFDCBF;

    --color-neutral-50:    #1A1916;
    --color-neutral-200:   #403D36;
    --color-neutral-500:   #A8A49C;
    --color-neutral-800:   #F5F4F0;
    --color-neutral-900:   #FFFFFF;

    --bg-page:        var(--color-neutral-50);
    --bg-surface:     #2A2823;
    --bg-elevated:    #3D3933;
    --bg-overlay:     rgba(0, 0, 0, 0.7);
    --text-primary:   #F5F4F0;
    --text-secondary: #A8A49C;

    --chat-bubble-user-bg:   #9F4221;
    --chat-bubble-ai-bg:     #2A2823;
    --chat-bubble-ai-text:   #F5F4F0;
    --chat-bubble-ai-border: #403D36;

    --shadow-soft:     0 2px 12px rgba(0, 0, 0, 0.3);
    --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  [data-theme="calm"] {
    --color-primary-500:   #7FB89B;
    --color-primary-700:   #D1E8DC;
    --bg-page:             #161816;
    --bg-surface:          #1F2A24;
    --text-primary:        #E8F0EA;
    --chat-bubble-user-bg: #2D6B4D;
    --chat-bubble-ai-bg:   #1F2A24;
    --chat-bubble-ai-text: #E8F0EA;
    --chat-bubble-ai-border: #3D4842;
  }

  [data-theme="soft"] {
    --color-primary-500:   #9E89C2;
    --color-primary-700:   #DCD3E8;
    --bg-page:             #1A171F;
    --bg-surface:          #221E2A;
    --text-primary:        #F0EBF5;
    --chat-bubble-user-bg: #4A3B6E;
    --chat-bubble-ai-bg:   #221E2A;
    --chat-bubble-ai-text: #F0EBF5;
    --chat-bubble-ai-border: #3D364A;
  }
}

/* ============================================================
   COLOR SCHEME OVERRIDE — User explicit choice always wins
   ============================================================ */
[data-color-scheme="light"] {
  /* Force light mode tokens — copy of base :root tokens per theme */
  /* (Generated by build step — manual for now) */
}

[data-color-scheme="dark"] {
  /* Force dark mode tokens */
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .ambient-bg,
  .breathing-orb-animated,
  .companion-orb-ambient {
    display: none;
  }

  .breathing-orb-static,
  .companion-orb-static {
    display: block;
  }
}

/* ============================================================
   USER FONT-SIZE OVERRIDE — Accessibility (settings toggle)
   ============================================================ */
[data-font-size="comfort"] {
  --leading-relaxed: 2.0;   /* extra spacing for low vision */
}

[data-font-size="large"] {
  --text-body: clamp(1.125rem, 1rem + 0.3vw, 1.25rem);
  /* (Adjust other body sizes proportionally) */
}
```

**Total tokens estimados:** ~70 (vs ~130 v1) — 46% redução em complexity.

---

## 2. Figma Tokens — W3C DTCG JSON

Path: `apps/serenity-ai/docs/brand/figma-tokens-v2.json`

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "anipis": {
    "version": "2.0.0",
    "themes": {
      "warm": {
        "color": {
          "primary": {
            "50":  { "$value": "#FFF1E8", "$type": "color" },
            "100": { "$value": "#FFDCBF", "$type": "color" },
            "300": { "$value": "#FF9A5C", "$type": "color" },
            "500": { "$value": "#DC6B3A", "$type": "color" },
            "700": { "$value": "#9F4221", "$type": "color" }
          },
          "secondary": {
            "100": { "$value": "#D9EDE3", "$type": "color" },
            "300": { "$value": "#8EC5A9", "$type": "color" },
            "500": { "$value": "#4A9672", "$type": "color" },
            "700": { "$value": "#2D6B4D", "$type": "color" }
          },
          "accent": {
            "100": { "$value": "#FFF3D6", "$type": "color" },
            "500": { "$value": "#E6AE2C", "$type": "color" }
          },
          "neutral": {
            "50":  { "$value": "#FAFAF8", "$type": "color" },
            "200": { "$value": "#E8E6E1", "$type": "color" },
            "500": { "$value": "#78746C", "$type": "color" },
            "800": { "$value": "#2A2823", "$type": "color" },
            "900": { "$value": "#1A1916", "$type": "color" }
          },
          "semantic-bg": {
            "page":     { "$value": "{anipis.themes.warm.color.neutral.50}", "$type": "color" },
            "surface":  { "$value": "#FFFFFF", "$type": "color" },
            "elevated": { "$value": "#FFFFFF", "$type": "color" }
          },
          "semantic-text": {
            "primary":   { "$value": "{anipis.themes.warm.color.neutral.800}", "$type": "color" },
            "secondary": { "$value": "{anipis.themes.warm.color.neutral.500}", "$type": "color" },
            "muted":     { "$value": "#A8A49C", "$type": "color" }
          },
          "chat-bubble": {
            "user-bg":   { "$value": "{anipis.themes.warm.color.primary.500}", "$type": "color" },
            "user-text": { "$value": "#FFFFFF", "$type": "color" },
            "ai-bg":     { "$value": "{anipis.themes.warm.color.primary.50}", "$type": "color" },
            "ai-text":   { "$value": "{anipis.themes.warm.color.neutral.800}", "$type": "color" },
            "ai-border": { "$value": "{anipis.themes.warm.color.primary.100}", "$type": "color" }
          }
        }
      },
      "calm": {
        "color": {
          "primary": {
            "50":  { "$value": "#EFF6F2", "$type": "color" },
            "100": { "$value": "#D1E8DC", "$type": "color" },
            "300": { "$value": "#7FB89B", "$type": "color" },
            "500": { "$value": "#4A9672", "$type": "color" },
            "700": { "$value": "#2D6B4D", "$type": "color" }
          }
        }
      },
      "soft": {
        "color": {
          "primary": {
            "50":  { "$value": "#F3EFF7", "$type": "color" },
            "100": { "$value": "#DCD3E8", "$type": "color" },
            "300": { "$value": "#9E89C2", "$type": "color" },
            "500": { "$value": "#7159A0", "$type": "color" },
            "700": { "$value": "#4A3B6E", "$type": "color" }
          }
        }
      }
    },
    "shared": {
      "color": {
        "crisis": {
          "yellow":      { "$value": "#E8B233", "$type": "color" },
          "yellow-bg":   { "$value": "#FFF4DC", "$type": "color" },
          "orange":      { "$value": "#E37B2E", "$type": "color" },
          "orange-bg":   { "$value": "#FFEAD3", "$type": "color" },
          "red":         { "$value": "#C72828", "$type": "color" },
          "red-bg":      { "$value": "#FDE2E2", "$type": "color" },
          "red-strong":  { "$value": "#A11C1C", "$type": "color" }
        },
        "mood": {
          "1": { "$value": "#7A6B8A", "$type": "color", "$description": "Muito difícil" },
          "2": { "$value": "#8A8EB8", "$type": "color", "$description": "Difícil" },
          "3": { "$value": "#A0B0B8", "$type": "color", "$description": "Neutro" },
          "4": { "$value": "#B8C4A0", "$type": "color", "$description": "Bem" },
          "5": { "$value": "#D4C4A0", "$type": "color", "$description": "Muito bem" }
        },
        "semantic": {
          "success": { "$value": "#3D9A5F", "$type": "color" },
          "warning": { "$value": "#D4960C", "$type": "color" },
          "error":   { "$value": "#D44040", "$type": "color" },
          "info":    { "$value": "#4A7FC7", "$type": "color" }
        }
      },
      "spacing": {
        "1":  { "$value": "0.25rem", "$type": "dimension" },
        "2":  { "$value": "0.5rem",  "$type": "dimension" },
        "3":  { "$value": "0.75rem", "$type": "dimension" },
        "4":  { "$value": "1rem",    "$type": "dimension" },
        "5":  { "$value": "1.25rem", "$type": "dimension" },
        "6":  { "$value": "1.5rem",  "$type": "dimension" },
        "8":  { "$value": "2rem",    "$type": "dimension" },
        "12": { "$value": "3rem",    "$type": "dimension" },
        "16": { "$value": "4rem",    "$type": "dimension" }
      },
      "radius": {
        "sm":     { "$value": "0.5rem",  "$type": "dimension" },
        "md":     { "$value": "1rem",    "$type": "dimension" },
        "bubble": { "$value": "1.25rem", "$type": "dimension" },
        "full":   { "$value": "9999px",  "$type": "dimension" }
      },
      "typography": {
        "fontFamilies": {
          "heading": { "$value": "General Sans, system-ui, sans-serif", "$type": "fontFamily" },
          "body":    { "$value": "Inter, system-ui, sans-serif",         "$type": "fontFamily" },
          "quote":   { "$value": "Fraunces, Georgia, serif",             "$type": "fontFamily" }
        },
        "fontWeights": {
          "normal":   { "$value": 400, "$type": "fontWeight" },
          "medium":   { "$value": 500, "$type": "fontWeight" },
          "semibold": { "$value": 600, "$type": "fontWeight" },
          "bold":     { "$value": 700, "$type": "fontWeight" }
        }
      },
      "motion": {
        "breath":    { "$value": { "duration": "8000ms", "easing": "cubic-bezier(0.45, 0, 0.15, 1)" }, "$type": "transition" },
        "arrive":    { "$value": { "duration": "400ms",  "easing": "cubic-bezier(0, 0.5, 0.3, 1)" },   "$type": "transition" },
        "depart":    { "$value": { "duration": "300ms",  "easing": "cubic-bezier(0.5, 0, 1, 0.5)" },   "$type": "transition" },
        "settle":    { "$value": { "duration": "400ms",  "easing": "cubic-bezier(0.45, 0, 0.15, 1)" }, "$type": "transition" },
        "heartbeat": { "$value": { "duration": "200ms",  "easing": "cubic-bezier(0.34, 1.56, 0.64, 1)" }, "$type": "transition" },
        "pulse":     { "$value": { "duration": "1800ms", "easing": "cubic-bezier(0.4, 0, 0.6, 1)" },   "$type": "transition" }
      }
    }
  }
}
```

---

## 3. Tailwind Config Preview

Path: `apps/serenity-ai/tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Use CSS vars to support theme switching automatically
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          300: 'var(--color-primary-300)',
          500: 'var(--color-primary-500)',
          700: 'var(--color-primary-700)',
        },
        secondary: {
          100: 'var(--color-secondary-100)',
          300: 'var(--color-secondary-300)',
          500: 'var(--color-secondary-500)',
          700: 'var(--color-secondary-700)',
        },
        accent: {
          100: 'var(--color-accent-100)',
          500: 'var(--color-accent-500)',
        },
        neutral: {
          50:  'var(--color-neutral-50)',
          200: 'var(--color-neutral-200)',
          500: 'var(--color-neutral-500)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
        crisis: {
          yellow:      'var(--crisis-yellow)',
          'yellow-bg': 'var(--crisis-yellow-bg)',
          orange:      'var(--crisis-orange)',
          'orange-bg': 'var(--crisis-orange-bg)',
          red:         'var(--crisis-red)',
          'red-bg':    'var(--crisis-red-bg)',
          'red-strong': 'var(--crisis-red-strong)',
        },
        mood: {
          1: 'var(--mood-1)',
          2: 'var(--mood-2)',
          3: 'var(--mood-3)',
          4: 'var(--mood-4)',
          5: 'var(--mood-5)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error:   'var(--color-error)',
        info:    'var(--color-info)',
        // Semantic
        bg: {
          page:     'var(--bg-page)',
          surface:  'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body:    'var(--font-body)',
        quote:   'var(--font-quote)',
        mono:    'var(--font-mono)',
        // Tailwind defaults
        sans: 'var(--font-body)',  // body é default sans
      },
      fontSize: {
        display:   'var(--text-display)',
        h1:        'var(--text-h1)',
        h2:        'var(--text-h2)',
        h3:        'var(--text-h3)',
        h4:        'var(--text-h4)',
        h5:        'var(--text-h5)',
        h6:        'var(--text-h6)',
        'body-lg': 'var(--text-body-lg)',
        body:      'var(--text-body)',
        'body-sm': 'var(--text-body-sm)',
        caption:   'var(--text-caption)',
        overline:  'var(--text-overline)',
        quote:     'var(--text-quote)',
      },
      lineHeight: {
        display:  'var(--leading-display)',
        tight:    'var(--leading-tight)',
        normal:   'var(--leading-normal)',
        relaxed:  'var(--leading-relaxed)',
        loose:    'var(--leading-loose)',
      },
      letterSpacing: {
        tightest: 'var(--tracking-tightest)',
        tight:    'var(--tracking-tight)',
        normal:   'var(--tracking-normal)',
        wide:     'var(--tracking-wide)',
        widest:   'var(--tracking-widest)',
      },
      spacing: {
        1:  'var(--space-1)',
        2:  'var(--space-2)',
        3:  'var(--space-3)',
        4:  'var(--space-4)',
        5:  'var(--space-5)',
        6:  'var(--space-6)',
        8:  'var(--space-8)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
      },
      borderRadius: {
        sm:     'var(--radius-sm)',
        md:     'var(--radius-md)',
        bubble: 'var(--radius-bubble)',
        full:   'var(--radius-full)',
      },
      boxShadow: {
        soft:     'var(--shadow-soft)',
        elevated: 'var(--shadow-elevated)',
      },
      transitionDuration: {
        breath:    '8000ms',
        arrive:    '400ms',
        depart:    '300ms',
        settle:    '400ms',
        heartbeat: '200ms',
        pulse:     '1800ms',
      },
      transitionTimingFunction: {
        breath:    'cubic-bezier(0.45, 0, 0.15, 1)',
        arrive:    'cubic-bezier(0, 0.5, 0.3, 1)',
        depart:    'cubic-bezier(0.5, 0, 1, 0.5)',
        heartbeat: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      zIndex: {
        base:     'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky:   'var(--z-sticky)',
        modal:    'var(--z-modal)',
        toast:    'var(--z-toast)',
        crisis:   'var(--z-crisis)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 4. Validation script (post-implementation)

Lint rule sugerida (custom): bloquear PR se hex inline em código não estiver na lista de tokens v2.

```typescript
// eslint-plugin-anipis/no-magic-colors.ts (pseudo)
const ALLOWED_HEX = [
  '#FFFFFF', '#000000',  // utility
  // (rest auto-extracted from design-tokens-v2.css)
];

// Error: hex `#E8764B` not in allowed tokens (v1 legacy — use var(--color-primary-500))
```

---

## Tokens count summary

| Categoria | v1 count | v2 count | Δ |
|-----------|----------|----------|---|
| Brand colors | ~32 | ~17 (×3 themes = ~51 primitive, ~17 semantic) | Semantic redução -47% |
| Semantic colors | 8 | 8 | = |
| Crisis | 6 | 7 | +1 (red-strong) |
| Mood | 5 | 5 | = (hex diferentes) |
| Chat bubble | 7 | 5 | -29% |
| Background/surface | 6 | 4 | -33% |
| Text | 6 | 3 | -50% |
| Border | 4 | 2 | -50% |
| Typography sizes | 13 | 13 | = |
| Spacing | 13 | 9 | -31% |
| Radius | 8 | 4 | -50% |
| Shadows | 5 | 2 | -60% |
| Motion | 4 | 6 | +50% (mais granularidade semântica) |
| **TOTAL tokens semantic** | **~117** | **~85** | **-27%** |

Mais clareza, menos overhead mental, themes ortogonais.

---

## Próximos passos

1. **Após D-UX-02 (theme aprovado)**: substituir `apps/serenity-ai/src/styles/anipis-tokens.css` por `design-tokens-v2.css`
2. Atualizar `apps/serenity-ai/src/styles/globals.css` para import novo
3. Atualizar `apps/serenity-ai/tailwind.config.ts` per snippet acima
4. Atualizar `apps/serenity-ai/docs/brand/figma-tokens-v2.json` (gerado)
5. Style Dictionary script para auto-gerar `tokens.css` + `tokens.json` + Swift + Kotlin (multi-platform future)
6. Validation lint rule (eslint-plugin-anipis)
7. Migration guide para devs (`apps/serenity-ai/docs/dev/tokens-v2-migration.md`)

---

*Uma — UX Design Expert · 2026-05-16*
*"Token é contrato. Componente é prosa que respeita o contrato."*
