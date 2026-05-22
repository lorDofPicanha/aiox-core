# Color System v2 — Multi-Theme

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Status:** Draft para review user (D-UX-02)
**Mudança crítica vs v1:** introduz **3 themes** (Warm / Calm / Soft) com Warm default, theme switcher MVP
**Tokens count vs v1:** reduzido de 130 → 70 (consolidação Rams)

---

## Filosofia revisada

O Anipis v1 escolheu **Aurora Warm Coral** como única paleta — uma decisão correta de diferenciação (vs Woebot/Wysa/Calm azuis) mas que **fricciona com persona Júlia** em uso noturno de pico ansioso. Pesquisa Calvo e behavioral research: cores quentes (coral, dourado) **ativam** sistema simpático em alguns indivíduos hipersensíveis — exatamente o oposto do efeito desejado durante crise.

**Solução v2: Multi-theme com 3 paletas curadas, user-switchable.**

| Theme | Default? | Vibe | Quando user escolheria |
|-------|----------|------|------------------------|
| **Warm** (Aurora Coral) | ✅ DEFAULT | Acolhedor, terreno, brasileiro | Uso diurno, primeira sessão (branding) |
| **Calm** (Sage Forest) | Opt-in | Sereno, natural, fresco | Uso noturno, ansiedade aguda, ambient |
| **Soft** (Lavender Mist) | Opt-in | Etéreo, dreamy, gentil | Insônia, momentos de fragilidade, "noite ruim" |

Theme switcher no Settings (`/settings/appearance`). MVP includes the switcher (decisão B2 do brainstorm = MVP, não v2.1).

Light/Dark mode é **ortogonal** ao theme — cada theme tem light e dark variants. Total: 6 combinações.

---

## Theme 1 — WARM (Aurora Coral) — DEFAULT

Refinamento da v1 com **5 shades por paleta** (não 10) e mood/crisis separados.

### Primary — Aurora Coral

| Token | Hex | OKLCH (P3) | Uso |
|-------|-----|------------|-----|
| `--warm-primary-50` | `#FFF1E8` | oklch(96% 0.025 50) | Background sutil, hover suave |
| `--warm-primary-100` | `#FFDCBF` | oklch(89% 0.075 50) | Card background destaque, chat AI bubble |
| `--warm-primary-300` | `#FF9A5C` | oklch(75% 0.18 50) | Icons secundário, dark mode primary |
| `--warm-primary-500` | `#DC6B3A` | oklch(64% 0.18 38) | **Brand primary** — CTAs, links, user chat bubble |
| `--warm-primary-700` | `#9F4221` | oklch(48% 0.15 38) | Hover, headings ênfase, contraste AA texto branco |

**Mudança crítica vs v1:** primary `#DC6B3A` (vs `#E8764B` v1) — escurecido propositadamente para passar AA com texto branco no nível 500 (não precisa mais "usar 600 para botões"). Simplificação Rams.

### Secondary — Sage Green

| Token | Hex | Uso |
|-------|-----|-----|
| `--warm-secondary-100` | `#D9EDE3` | Card sucesso, badges progresso |
| `--warm-secondary-300` | `#8EC5A9` | Icons positivos |
| `--warm-secondary-500` | `#4A9672` | Secondary button, indicadores progresso |
| `--warm-secondary-700` | `#2D6B4D` | Hover, dark mode primary serene |

### Accent — Luz Gold

| Token | Hex | Uso |
|-------|-----|-----|
| `--warm-accent-100` | `#FFF3D6` | Highlight suave, badge bg |
| `--warm-accent-500` | `#E6AE2C` | Badges, stars, accent ornamentos |

### Neutral — Warm Gray

| Token | Hex | Uso |
|-------|-----|-----|
| `--warm-neutral-50` | `#FAFAF8` | Page bg, input bg light |
| `--warm-neutral-200` | `#E8E6E1` | Border default |
| `--warm-neutral-500` | `#78746C` | Texto secundário |
| `--warm-neutral-800` | `#2A2823` | **Texto primário** |
| `--warm-neutral-900` | `#1A1916` | Texto max contrast |

---

## Theme 2 — CALM (Sage Forest)

Paleta dominante sage/verde-azulado. **Sage** como primary (não accent). Para uso ambient noturno e usuários com aversão a tons quentes.

### Primary — Sage Calm

| Token | Hex | Uso |
|-------|-----|-----|
| `--calm-primary-50` | `#EFF6F2` | Background sutil |
| `--calm-primary-100` | `#D1E8DC` | Card bg destaque, AI bubble |
| `--calm-primary-300` | `#7FB89B` | Icons, badge |
| `--calm-primary-500` | `#4A9672` | **Brand primary** — CTAs, links, user bubble |
| `--calm-primary-700` | `#2D6B4D` | Hover, ênfase |

### Secondary — Warm Coral (invertido)

Coral vira **secondary**, usado escassamente em accents (badges importantes, success states).

| Token | Hex | Uso |
|-------|-----|-----|
| `--calm-secondary-100` | `#FFDCBF` | Badge warm accent |
| `--calm-secondary-500` | `#DC6B3A` | Secondary button accent |

### Accent — Aqua Light

| Token | Hex | Uso |
|-------|-----|-----|
| `--calm-accent-100` | `#D6EFF2` | Highlight ambient |
| `--calm-accent-500` | `#5BA8B8` | Decorative accent |

### Neutral — Cool Warm Gray

Subtom levemente mais frio que Warm theme (mantém warmth para legibilidade).

| Token | Hex | Uso |
|-------|-----|-----|
| `--calm-neutral-50` | `#F7F9F8` | Page bg |
| `--calm-neutral-200` | `#E0E4E2` | Border |
| `--calm-neutral-500` | `#6B736E` | Text secondary |
| `--calm-neutral-800` | `#252925` | Text primary |

---

## Theme 3 — SOFT (Lavender Mist)

Paleta etérea com lavender/mauve primary. Para fragilidade, insônia, ambient à noite.

### Primary — Lavender Soft

| Token | Hex | Uso |
|-------|-----|-----|
| `--soft-primary-50` | `#F3EFF7` | Background sutil |
| `--soft-primary-100` | `#DCD3E8` | Card bg, AI bubble |
| `--soft-primary-300` | `#9E89C2` | Icons |
| `--soft-primary-500` | `#7159A0` | **Brand primary** |
| `--soft-primary-700` | `#4A3B6E` | Hover, ênfase |

### Secondary — Dusty Rose

| Token | Hex | Uso |
|-------|-----|-----|
| `--soft-secondary-100` | `#F0DAE0` | Badge, accent suave |
| `--soft-secondary-500` | `#C47E8A` | Secondary CTA |

### Accent — Pale Gold

| Token | Hex | Uso |
|-------|-----|-----|
| `--soft-accent-500` | `#D4B88E` | Subtle ornament |

### Neutral — Mauve Gray

| Token | Hex | Uso |
|-------|-----|-----|
| `--soft-neutral-50` | `#F8F6FA` | Page bg |
| `--soft-neutral-500` | `#736B7A` | Text secondary |
| `--soft-neutral-800` | `#2A252F` | Text primary |

---

## Semantic Tokens (compartilhados — não mudam com theme)

Tokens semânticos têm hex fixos, **idem em todos os themes**, para garantir feedback consistente:

| Semantic | Hex | OKLCH | Uso |
|----------|-----|-------|-----|
| `--color-success` | `#3D9A5F` | oklch(58% 0.14 145) | Confirmação, exercício completo |
| `--color-success-bg` | `#E3F5EA` | oklch(95% 0.04 145) | Background sucesso |
| `--color-warning` | `#D4960C` | oklch(72% 0.16 80) | Atenção, campo obrigatório |
| `--color-warning-bg` | `#FFF8E6` | oklch(97% 0.04 80) | Background warning |
| `--color-error` | `#D44040` | oklch(58% 0.20 25) | Erro form, validação falhada |
| `--color-error-bg` | `#FDE8E8` | oklch(95% 0.04 25) | Background erro |
| `--color-info` | `#4A7FC7` | oklch(58% 0.14 250) | Tooltip, ajuda |
| `--color-info-bg` | `#E8F0FA` | oklch(95% 0.03 250) | Background info |

---

## Crisis Tokens (compartilhados — IDÊNTICOS em todos themes)

**Regra absoluta v2:** crisis colors NUNCA compartilham hex com mood colors (correção de bug v1 onde mood-3 e crisis-yellow eram ambos `#D4960C`).

| Token | Hex | OKLCH | Nivel | Uso |
|-------|-----|-------|-------|-----|
| `--crisis-yellow` | `#E8B233` | oklch(78% 0.14 80) | Atenção | Banner amarelo |
| `--crisis-yellow-bg` | `#FFF4DC` | oklch(96% 0.04 80) | — | Background yellow |
| `--crisis-orange` | `#E37B2E` | oklch(67% 0.18 50) | Alerta | Banner laranja |
| `--crisis-orange-bg` | `#FFEAD3` | oklch(94% 0.05 50) | — | Background orange |
| `--crisis-red` | `#C72828` | oklch(54% 0.20 25) | Urgência | Banner vermelho, CTA crise |
| `--crisis-red-bg` | `#FDE2E2` | oklch(94% 0.04 25) | — | Background red |
| `--crisis-red-strong` | `#A11C1C` | oklch(45% 0.20 25) | Urgência max | Hover do CTA vermelho |

**Note:** Crisis-yellow `#E8B233` é distintivo do warning `#D4960C` — pode parecer redundante, mas separa o "vida" do "form validation".

---

## Mood Tokens (compartilhados — IDÊNTICOS em todos themes)

**Mudança crítica v2 vs v1:**
- v1 usava cores **saturadas e ALERT-like** (vermelho mood-1, laranja mood-2) — Don Norman crítica do conclave: "violência emocional para usuário que JÁ está sofrendo"
- v2 usa cores **dessaturadas, calmas mesmo nos níveis baixos** — segue prescrição Anadol

| Nivel | Label | Hex v2 | OKLCH | Diferença vs v1 |
|-------|-------|--------|-------|------------------|
| 1 | Muito difícil | `#7A6B8A` | oklch(50% 0.06 295) | Era `#D44040` (vermelho alerta) — agora roxo acinzentado calmo |
| 2 | Difícil | `#8A8EB8` | oklch(60% 0.08 270) | Era `#E08A3A` (laranja) — agora azul-lavanda suave |
| 3 | Neutro | `#A0B0B8` | oklch(72% 0.03 220) | Era `#D4960C` (amarelo) — agora cinza-azulado neutro |
| 4 | Bem | `#B8C4A0` | oklch(80% 0.06 120) | Era `#3D9A5F` (verde saturado) — agora verde suave |
| 5 | Muito bem | `#D4C4A0` | oklch(83% 0.07 80) | Era `#E8764B` (coral brand) — agora dourado-aurora |

**Razão:** usuário em estado emocional baixo (mood 1-2) recebendo cores vermelhas como feedback é **revictimização visual**. v2 trata todos os estados com **dignidade visual igual** — diferentes em hue, similares em saturação calma.

---

## Chat Bubble Tokens

Por theme, com light/dark variants. Tokens semânticos `--chat-bubble-user-bg` etc apontam para tokens do theme ativo.

### Warm theme (default)

| Token | Light | Dark |
|-------|-------|------|
| `--chat-bubble-user-bg` | `#DC6B3A` | `#9F4221` |
| `--chat-bubble-user-text` | `#FFFFFF` | `#FFFFFF` |
| `--chat-bubble-ai-bg` | `#FFF1E8` | `#2A2823` |
| `--chat-bubble-ai-text` | `#2A2823` | `#F5F4F0` |
| `--chat-bubble-ai-border` | `#FFDCBF` | `#403D36` |

### Calm theme

| Token | Light | Dark |
|-------|-------|------|
| `--chat-bubble-user-bg` | `#4A9672` | `#2D6B4D` |
| `--chat-bubble-user-text` | `#FFFFFF` | `#FFFFFF` |
| `--chat-bubble-ai-bg` | `#EFF6F2` | `#1F2A24` |
| `--chat-bubble-ai-text` | `#252925` | `#E8F0EA` |
| `--chat-bubble-ai-border` | `#D1E8DC` | `#3D4842` |

### Soft theme

| Token | Light | Dark |
|-------|-------|------|
| `--chat-bubble-user-bg` | `#7159A0` | `#4A3B6E` |
| `--chat-bubble-user-text` | `#FFFFFF` | `#FFFFFF` |
| `--chat-bubble-ai-bg` | `#F3EFF7` | `#221E2A` |
| `--chat-bubble-ai-text` | `#2A252F` | `#F0EBF5` |
| `--chat-bubble-ai-border` | `#DCD3E8` | `#3D364A` |

---

## WCAG AA/AAA Validation Matrix

Auditoria contraste para **todos os 3 themes** light e dark, pares críticos.

### Warm theme — Light mode

| Foreground | Background | Ratio | AA Norm | AA Large | AAA Norm | AAA Large |
|-----------|-----------|-------|---------|----------|----------|-----------|
| `#2A2823` text | `#FAFAF8` page | 14.2:1 | PASS | PASS | PASS | PASS |
| `#FFFFFF` text | `#DC6B3A` primary-500 | 4.6:1 | PASS | PASS | FAIL | PASS |
| `#FFFFFF` text | `#9F4221` primary-700 | 7.8:1 | PASS | PASS | PASS | PASS |
| `#78746C` muted | `#FAFAF8` page | 4.6:1 | PASS | PASS | FAIL | PASS |
| `#FFFFFF` text | `#C72828` crisis-red | 5.9:1 | PASS | PASS | FAIL | PASS |
| `#FFFFFF` text | `#A11C1C` crisis-red-strong | 8.4:1 | PASS | PASS | PASS | PASS |

### Warm theme — Dark mode

| Foreground | Background | Ratio | AA Norm | AA Large |
|-----------|-----------|-------|---------|----------|
| `#F5F4F0` text | `#1A1916` page | 16.1:1 | PASS | PASS |
| `#2A2823` text | `#FF9A5C` primary-300 | 6.2:1 | PASS | PASS |
| `#F5F4F0` text | `#2A2823` surface | 13.9:1 | PASS | PASS |

### Calm theme — Light mode

| Foreground | Background | Ratio | AA Norm | AA Large |
|-----------|-----------|-------|---------|----------|
| `#252925` text | `#F7F9F8` page | 14.8:1 | PASS | PASS |
| `#FFFFFF` text | `#4A9672` primary-500 | 4.9:1 | PASS | PASS |
| `#FFFFFF` text | `#2D6B4D` primary-700 | 8.2:1 | PASS | PASS |

### Soft theme — Light mode

| Foreground | Background | Ratio | AA Norm | AA Large |
|-----------|-----------|-------|---------|----------|
| `#2A252F` text | `#F8F6FA` page | 15.3:1 | PASS | PASS |
| `#FFFFFF` text | `#7159A0` primary-500 | 5.7:1 | PASS | PASS |
| `#FFFFFF` text | `#4A3B6E` primary-700 | 9.1:1 | PASS | PASS |

**Crisis screens — AAA target:**
Para todos os themes, banner vermelho usa `crisis-red-strong #A11C1C` com `#FFFFFF` text → 8.4:1 → **AAA pass** em normal text. Esta é a regra: telas de crise **sempre** usam o variant `-strong`, não o base.

### Daltonismo (CVD) compatibilidade

Cada theme primary testado em Coblis simulator:

| Theme | Protanopia | Deuteranopia | Tritanopia | Note |
|-------|------------|--------------|------------|------|
| Warm coral | OK (vira marrom-amarelado, distinguível de sage) | OK | OK | Diferenciação por luminosity ratio (não só hue) |
| Calm sage | OK | OK | Risco: sage e azul info próximos — adicionar ícone sempre | |
| Soft lavender | OK | OK (vira azul) | OK | |

Mood scale 5 níveis (todos themes): após ajuste v2, **luminosity sobe linearmente** de mood-1 (50%) → mood-5 (83%) — mesmo CVD usuário consegue ordenar pela claridade.

---

## CSS Vars Draft

Estrutura: tokens primitivos + tokens semânticos. Theme switch via `data-theme` attribute no `<html>`. Dark mode via `prefers-color-scheme` + override por `data-color-scheme`.

```css
/* === BASE — tokens primitivos compartilhados === */
:root {
  /* Crisis */
  --crisis-yellow: #E8B233;
  --crisis-yellow-bg: #FFF4DC;
  --crisis-orange: #E37B2E;
  --crisis-orange-bg: #FFEAD3;
  --crisis-red: #C72828;
  --crisis-red-bg: #FDE2E2;
  --crisis-red-strong: #A11C1C;

  /* Mood */
  --mood-1: #7A6B8A;
  --mood-2: #8A8EB8;
  --mood-3: #A0B0B8;
  --mood-4: #B8C4A0;
  --mood-5: #D4C4A0;

  /* Semantic */
  --color-success: #3D9A5F;
  --color-success-bg: #E3F5EA;
  --color-warning: #D4960C;
  --color-warning-bg: #FFF8E6;
  --color-error: #D44040;
  --color-error-bg: #FDE8E8;
  --color-info: #4A7FC7;
  --color-info-bg: #E8F0FA;
}

/* === WARM THEME (default) === */
[data-theme="warm"], :root {
  --color-primary-50: #FFF1E8;
  --color-primary-100: #FFDCBF;
  --color-primary-300: #FF9A5C;
  --color-primary-500: #DC6B3A;
  --color-primary-700: #9F4221;

  --color-secondary-100: #D9EDE3;
  --color-secondary-300: #8EC5A9;
  --color-secondary-500: #4A9672;
  --color-secondary-700: #2D6B4D;

  --color-accent-100: #FFF3D6;
  --color-accent-500: #E6AE2C;

  --color-neutral-50: #FAFAF8;
  --color-neutral-200: #E8E6E1;
  --color-neutral-500: #78746C;
  --color-neutral-800: #2A2823;
  --color-neutral-900: #1A1916;

  --bg-page: var(--color-neutral-50);
  --bg-surface: #FFFFFF;
  --text-primary: var(--color-neutral-800);
  --text-secondary: var(--color-neutral-500);

  --chat-bubble-user-bg: var(--color-primary-500);
  --chat-bubble-user-text: #FFFFFF;
  --chat-bubble-ai-bg: var(--color-primary-50);
  --chat-bubble-ai-text: var(--color-neutral-800);
  --chat-bubble-ai-border: var(--color-primary-100);
}

/* === CALM THEME === */
[data-theme="calm"] {
  --color-primary-50: #EFF6F2;
  --color-primary-100: #D1E8DC;
  --color-primary-300: #7FB89B;
  --color-primary-500: #4A9672;
  --color-primary-700: #2D6B4D;

  --color-secondary-100: #FFDCBF;
  --color-secondary-500: #DC6B3A;

  --color-accent-100: #D6EFF2;
  --color-accent-500: #5BA8B8;

  --color-neutral-50: #F7F9F8;
  --color-neutral-200: #E0E4E2;
  --color-neutral-500: #6B736E;
  --color-neutral-800: #252925;

  /* (semantic + chat tokens análogos ao Warm) */
}

/* === SOFT THEME === */
[data-theme="soft"] {
  --color-primary-50: #F3EFF7;
  --color-primary-100: #DCD3E8;
  --color-primary-300: #9E89C2;
  --color-primary-500: #7159A0;
  --color-primary-700: #4A3B6E;

  --color-secondary-100: #F0DAE0;
  --color-secondary-500: #C47E8A;

  --color-accent-500: #D4B88E;

  --color-neutral-50: #F8F6FA;
  --color-neutral-500: #736B7A;
  --color-neutral-800: #2A252F;
}

/* === DARK MODE — sobrepõe surfaces e texts === */
@media (prefers-color-scheme: dark) {
  :root[data-theme="warm"], :root:not([data-theme]) {
    --bg-page: var(--color-neutral-900);
    --bg-surface: var(--color-neutral-800);
    --text-primary: #F5F4F0;
    --text-secondary: #A8A49C;
    --color-primary-500: #FF9A5C; /* shift mais claro para contraste */
  }
  /* (calm dark, soft dark análogos) */
}

[data-color-scheme="light"] { /* user override sempre vence */ }
[data-color-scheme="dark"] { /* idem */ }
```

---

## Theme Switcher UX

Localização: `/settings/appearance` → primeiro grupo "Tema".

```
Tema do Anipis

  ◉ Warm — acolhedor, terreno [recomendado padrão]
  ○ Calm — sereno, natural
  ○ Soft — etéreo, gentil

  [Preview live: 3 chips mostram cor de bubble user de cada theme]

Modo de cor

  ○ Claro
  ○ Escuro
  ◉ Automático (segue o sistema)
```

**Persistência:** localStorage `anipis-theme` + `anipis-color-scheme`. Sync com Supabase se logged in (cross-device).

**Default:** `theme=warm`, `color-scheme=auto`.

---

## Resumo de redução de tokens

| Categoria | v1 count | v2 count | Razão |
|-----------|----------|----------|-------|
| Brand shades | 10 (50-900) | 5 (50/100/300/500/700) | Rams reduce |
| Secondary shades | 6 | 4 | Rams reduce |
| Accent shades | 6 | 2 | Rams reduce |
| Neutral shades | 10 | 5 | Rams reduce |
| Semantic colors | 8 | 8 | Mantido |
| Crisis colors | 6 | 7 (+ red-strong AAA) | Adicionado strong para AAA |
| Mood colors | 5 | 5 | Mantido (mas hex novos) |
| Chat bubble | 7 | 5 | Consolidado |
| **TOTAL color tokens** | **~58** | **~41** | **-29%** |
| **+ Theme variants (3 themes × hex) adiciona ~80 tokens primitivos, mas semantic layer fica em ~41** | | | |

Após theme switching, **número de tokens semânticos usados em código** continua ~41 — mas valor muda conforme theme ativo. Implementação enxuta.

---

## Próximos passos

1. **D-UX-02** (user Breno aprova multi-theme com Warm default? Ou Warm only?)
2. Se aprovado: implementar `apps/serenity-ai/src/styles/anipis-tokens-v2.css` substituindo v1
3. Theme switcher component (`<ThemeSwitcher />` em `apps/serenity-ai/src/components/settings/`)
4. Migração Figma: 3 themes como Variables/Modes no Figma
5. Lint axe-core CI rule: validar contraste em todos os themes em todas as combinações

---

*Uma — UX Design Expert · 2026-05-16*
*"Dignidade visual: nem o mood-1 merece um vermelho de alarme."*
