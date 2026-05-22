# Typography v2

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Mudança crítica vs v1:** Nunito → **General Sans** (heading); Inter mantido (body); **Fraunces Italic** introduzido (pull-quotes, 5-10% uso)
**Razão:** Spiekermann + van Schneider conclave — Nunito carrega bagagem "wellness genérico"; produto para adultos vulneráveis pede tipografia adulta com calor sem infantilização.

---

## Pairing rule

**3-font system, hierarquia clara:**

| Função | Fonte | Razão | Peso de uso |
|--------|-------|-------|-------------|
| **Heading + display** | **General Sans** (Indian Type Foundry, free) | Geométrica humanista, x-height generoso, calor sem rounded-baby | 60% |
| **Body + UI** | **Inter** (Rasmus Andersson, free) | Standard de UI, otimizada para tela, suporte total a acentos PT-BR | 35% |
| **Pull-quote + momento editorial** | **Fraunces Italic** (Undercase, free) | Serif humanista com "wonkiness" calorosa, vira "voz pessoal" do Anipis | 5% |

**Princípio Spiekermann:** uso de Fraunces deve ser RARO e propositado. Quando o Anipis "diz" algo importante (welcome message, encerramento de exercício de respiração, "carta da sessão"), usa Fraunces Italic — sinaliza voz pessoal vs interface utilitária. Em landing page: pull-quote no hero ("Estou aqui.") em Fraunces Italic.

---

## Font loading strategy

### Preloads críticos

```html
<link rel="preload" href="/fonts/GeneralSans-Medium.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
<!-- Fraunces NÃO preloaded — uso esporádico, lazy OK -->
```

### CSS

```css
@font-face {
  font-family: 'General Sans';
  src: url('/fonts/GeneralSans-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'General Sans';
  src: url('/fonts/GeneralSans-Semibold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'General Sans';
  src: url('/fonts/GeneralSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Semibold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/Fraunces-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
```

### Fallback stack

```css
--font-heading: 'General Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-body:    'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-quote:   'Fraunces', Georgia, 'Times New Roman', serif;
--font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, monospace;
```

### Tamanho total estimado

| Fonte/peso | Tamanho subset PT-BR |
|------------|----------------------|
| General Sans Medium 500 | ~28KB |
| General Sans Semibold 600 | ~28KB |
| General Sans Bold 700 | ~28KB |
| Inter Regular 400 | ~25KB |
| Inter Medium 500 | ~26KB |
| Inter Semibold 600 | ~26KB |
| Fraunces Italic 400 | ~32KB (subset reduzido — italic é raro) |
| **TOTAL** | **~193KB** (vs ~95KB v1 c/ Nunito+Inter mas com gain de calor visual notável) |

---

## Type scale — Modular ratio 1.25 (Major Third)

Fluida via `clamp()` (Friedman conclave): nunca quebra entre breakpoints.

| Token | Mobile | Desktop | Clamp value | Uso | Fonte | Peso |
|-------|--------|---------|-------------|-----|-------|------|
| `--text-display` | 36px | 56px | `clamp(2.25rem, 1.5rem + 3vw, 3.5rem)` | Hero, splash | General Sans | 700 |
| `--text-h1` | 28px | 40px | `clamp(1.75rem, 1.3rem + 2vw, 2.5rem)` | Page title | General Sans | 700 |
| `--text-h2` | 24px | 32px | `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)` | Section main | General Sans | 600 |
| `--text-h3` | 20px | 24px | `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)` | Subsection | General Sans | 600 |
| `--text-h4` | 18px | 20px | `clamp(1.125rem, 1rem + 0.4vw, 1.25rem)` | Card heading | General Sans | 600 |
| `--text-h5` | 16px | 16px | `1rem` (não fluida) | Label forte | General Sans | 600 |
| `--text-h6` | 14px | 14px | `0.875rem` | Overline, section label | General Sans | 600 |
| `--text-body-lg` | 18px | 20px | `clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem)` | Lead paragraph | Inter | 400 |
| `--text-body` | 16px | 18px | `clamp(1rem, 0.95rem + 0.2vw, 1.125rem)` | **Corpo padrão** | Inter | 400 |
| `--text-body-sm` | 14px | 14px | `0.875rem` | Secondary, metadata | Inter | 400 |
| `--text-caption` | 12px | 12px | `0.75rem` | Timestamps, disclaimers | Inter | 400 |
| `--text-overline` | 11px | 11px | `0.6875rem` | Labels minúsculos | Inter | 500 |
| `--text-quote` | 22px | 28px | `clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem)` | Pull-quote, Anipis voz | Fraunces | 400 italic |

---

## Line-height por size

Princípio: tighter para headings (legibilidade visual), looser para body (conforto de leitura emocional).

| Size range | Line-height | Razão |
|-----------|-------------|-------|
| Display (36-56px) | 1.15 | Headings grandes precisam respirar mas não muito |
| H1-H2 (24-40px) | 1.25 | Hierarquia visual clara |
| H3-H6 (14-24px) | 1.3 | Balance |
| Body-lg (18-20px) | 1.65 | Leitura confortável |
| Body (16-18px) | **1.7** (vs 1.6 v1) | Mais generoso — conforto emocional (Spiekermann recomendação) |
| Body-sm / caption | 1.5 | Compacto OK em metadata |
| Quote (Fraunces) | 1.4 | Italic precisa de mais espaço |

---

## Letter-spacing (tracking) por size

| Size range | Tracking | Razão |
|-----------|----------|-------|
| Display | -0.02em | Refinamento óptico em sizes grandes |
| H1-H2 | -0.015em | Slightly tight para coesão visual |
| H3-H6 | -0.01em | Microajuste |
| Body | 0 | Default |
| Body-sm | 0 | Default |
| Caption | 0.005em | Leve abertura ajuda em sizes pequenos |
| Overline (caps) | 0.08em | Caps SEMPRE precisa tracking aberto |
| Labels button | 0.01em | Leve abertura para clareza |
| Quote Fraunces | 0 | Italic já tem caráter, não força |

---

## Hierarquia visual — exemplos

### Page tipica

```
[DISPLAY]   Oi. Eu sou o Anipis.            ← General Sans 700, 56px, --text-primary
[Body-lg]   Um companheiro pra quando       ← Inter 400, 20px, --text-secondary
            você quiser conversar.
[H2]        Como funciona                    ← General Sans 600, 32px, --text-primary
[Body]      Você fala do seu jeito, no seu  ← Inter 400, 18px, --text-secondary
            tempo. Eu fico aqui.
[Caption]   Conteúdo educativo. Não         ← Inter 400, 12px, --text-muted
            substitui acompanhamento prof.
```

### Chat

```
[Body]      Mensagem do usuário                ← Inter 400, 16px, white sobre coral
[Body]      Resposta da IA                     ← Inter 400, 16px, neutral-800 sobre anipis-50
[Caption]   14:32                                ← Inter 400, 12px, neutral-400
[Quote]     "Que bom te ver aqui de novo."     ← Fraunces 400 italic, 22px, italic
            (welcome message especial)
```

### Hero landing

```
[Display]   Pra você que precisa de             ← General Sans 700, 56px
            alguém às 4h da manhã.
[Body-lg]   Apoio emocional brasileiro, IA,    ← Inter 400, 20px
            R$29,90/mês. Não é terapeuta.
[CTA]       Conversar agora                    ← Inter 500, 16px, button label
[Quote]     "Estou aqui."                      ← Fraunces 400 italic, 22px
            (subtle, abaixo do CTA, com orbe)
```

---

## Regras de uso

1. **Nunca usar mais de 3 famílias** — General Sans + Inter + Fraunces. System fonts apenas como fallback.
2. **Corpo de texto SEMPRE em Inter 400** — não usar General Sans para parágrafos longos.
3. **Heading SEMPRE em General Sans 600-700** — não usar Inter para headings (perde caráter).
4. **Fraunces Italic é evento, não padrão** — máximo 1 momento Fraunces por tela. Quando user vê italic serif, deve significar algo (voz pessoal do Anipis, citação, momento ritualístico).
5. **Máximo 65 caracteres por linha em body** (Spiekermann recomendação otimal). Em chat: bubble max-width já garante (480px chat container → ~50 chars em 16px).
6. **Line-height 1.7 em body** — mais generoso que padrão (1.5) para conforto emocional. NUNCA reduzir abaixo de 1.5.
7. **All caps APENAS em overlines e labels de interface** — texto em caps é percebido como agressivo, incompatível com tom Anipis.
8. **Reduced-motion não afeta tipografia** — fontes ficam estáticas (não precisa override).
9. **Auto-hyphenation OFF em PT-BR** — quebra ruim de palavras em telas pequenas (`hyphens: manual`).
10. **Smart quotes obrigatórias** em conteúdo curado (PT-BR usa "" e '') — gerenciado via lint MDX/MD.

---

## Acessibilidade tipográfica

| Critério | Implementação |
|----------|---------------|
| Texto redimensionável até 200% | Usar `rem` em font-size, nunca px. Layout deve não quebrar em zoom. |
| Dyslexia-friendly | General Sans + Inter passam: distinção entre i/l/1, spacing generoso, sem ambiguidade visual |
| Spacing customizável | User pode aumentar line-height via settings (`/settings/appearance` → "Espaçamento confortável" toggle 1.7 → 2.0) |
| Fonte alternativa | (Roadmap fase 2) Toggle "OpenDyslexic" para usuários disléxicos |
| Reading level | Hemingway test recomenda 8ª série máximo para body — copy review obrigatório |

---

## Próximos passos

1. Download das fontes em `apps/serenity-ai/public/fonts/`:
   - General Sans (Indian Type Foundry, gratuita): https://www.fontshare.com/fonts/general-sans
   - Inter (Google Fonts): https://fonts.google.com/specimen/Inter
   - Fraunces (Google Fonts): https://fonts.google.com/specimen/Fraunces
2. Subsetting com glyphhanger para Latin + acentos PT-BR
3. Update `apps/serenity-ai/src/styles/anipis-tokens-v2.css` com type scale
4. Update Tailwind config: `fontFamily.heading`, `fontFamily.body`, `fontFamily.quote`
5. Componente `<PullQuote>` que aplica Fraunces Italic automaticamente
6. Lint rule: warn quando Fraunces usado >1x por tela (proteção contra over-use)

---

*Uma — UX Design Expert · 2026-05-16*
*"Tipografia é a primeira voz que o usuário ouve antes de ler."*
