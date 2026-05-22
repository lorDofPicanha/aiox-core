# Illustration & Photography v2

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Mudança vs v1:** Ilustração vira **Tier 1 (proprietária)**. Photography vira **Tier 3 (último recurso, restrita)**. Banimento absoluto stock photos genéricos. Nano-banana + Flux ferramentas-primárias para geração.

---

## Hierarquia visual (Tier system)

Princípio: **toda imagem do Anipis deve ser ownable ou contextualmente justificada**. Tier system:

| Tier | Tipo | Quando usar | Aprovação |
|------|------|-------------|-----------|
| **Tier 1** | Ilustrações custom hand-drawn warm minimal | Empty states, onboarding, brand moments, error states, illustration heavy LP sections | Design Lead approval |
| **Tier 2** | Composições generativas (Canvas + Perlin noise + mood-aware palette) | Chat background ambient, mood landscape visualization | Design Lead + perf review |
| **Tier 3** | Fotografia (excepcional) | Testimonials reais com consentimento, blog posts educacionais com pessoas reais, depoimentos institucionais | Legal + Design Lead approval |
| **BANIDO** | Stock photos genéricos (Unsplash "warm Brazilian") | Nunca | — |

---

## Tier 1 — Ilustrações Custom

### Estilo: "Warm Minimal Hand-Drawn"

**Características:**
1. **Line work**: linhas orgânicas (não geometricamente retas), pequenas imperfeições propositais
2. **Stroke weight**: 1.5-2.5px (varia para hierarquia)
3. **Stroke color**: `--color-neutral-700` em light mode, `--color-neutral-300` em dark
4. **Fill**: cores da paleta active theme em opacidades 30-60% (sutil, não saturated)
5. **Composição**: 1 ideia central por ilustração (não cluttered)
6. **Figuras humanas**: **abstratas/sem rosto definido** (universal — qualquer brasileiro se vê)
7. **Tom geral**: elegante, sereno, adulto. NÃO infantil (não é Finch, não é Headspace mascot).

### Referências de inspiração

| Referência | O que pegar | O que NÃO pegar |
|-----------|-------------|------------------|
| **Andy Carolan** illustration style | Line work orgânico, paleta limitada | Mascotes |
| **Wei Xin** wellness illustrations | Figures abstratas, momentos contemplativos | Excesso de detail |
| **Maria Inês Gul** ilustrações editoriais | Brazilian sensibility, palette warm | Comissionar real |
| **Hello Studio** color treatments | Subtle gradient fills | Glossy / 3D effects |

**Não-references (evitar):**
- ❌ Headspace cartoony mascot style
- ❌ Calm photography-heavy aesthetic
- ❌ Notion-style "drawing in browser"
- ❌ Memoji / Bitmoji avatar style
- ❌ Storyset / unDraw (genéricos de SaaS)

### Asset list — produção priorizada

**Sprint 1 (MVP launch):**

| # | Asset | Tamanho | Uso | Tier |
|---|-------|---------|-----|------|
| I-01 | **Empty chat state** — pessoa sentada com céu noturno (sem rosto) | 320×320 | Chat empty state | 1 |
| I-02 | **Onboarding 1** — duas mãos abertas (gesto de acolhimento) | 280×280 | Onboarding tela 1 | 1 |
| I-03 | **Onboarding 2** — robô + humano em diálogo abstrato (disclaimer IA) | 280×280 | Onboarding tela 2 | 1 |
| I-04 | **Onboarding 3** — pessoa caminhando direção horizonte | 280×280 | Onboarding tela 3 | 1 |
| I-05 | **Crisis support** — duas figuras lado-a-lado, mão sobre ombro | 240×240 | Resource handoff screen | 1 |
| I-06 | **404/Error gentle** — pessoa olhando céu, sem cara de irritação | 320×320 | Error pages | 1 |
| I-07 | **Mood landscape base** — paisagem abstrata receptora de generative overlay | 1080×400 | Mood analytics screen | 1+2 hybrid |

**Sprint 2 (post-launch):**

| # | Asset | Uso |
|---|-------|-----|
| I-08 | LP Hero illustration — "4h da manhã" pessoa com celular | LP hero |
| I-09 | LP "How it works" 3 ilustrações em série | LP "como funciona" |
| I-10 | LP Testimonials decorative — onda/horizon |  LP testimonials |
| I-11 | Blog post category icons (5) — ansiedade, sono, raiva, gratidão, luto | Blog header |
| I-12 | Achievement/milestone visuals (5) — sem gamification agressiva | Settings → Histórico |

### Producção

**Estratégia híbrida custom + generated:**

1. **Fase 1 — Concept**: Uma rascunha em pencil / Figma sketch cada I-01 a I-07 (1 dia)
2. **Fase 2 — Generated**: Usar nano-banana-2 (Gemini 3.1 Flash) ou Flux para gerar variantes via prompt detalhado seguindo style guide
3. **Fase 3 — Refinement**: Designer (humano ou via Stitch) refina linhas, aplica paleta do tema, ajusta composição
4. **Fase 4 — Export**: SVG (preferred — escalável + tema-aware via currentColor) ou PNG@2x (apenas se gradient complexo demandar)

**Prompt template para nano-banana / Flux:**

```
Hand-drawn minimal illustration, warm earthy tones with [primary color]
accent (e.g., #DC6B3A coral), organic line work 1.5-2px weight in
warm dark brown (#403D36), abstract human figure(s) WITHOUT defined face,
contemplative serene mood, white/cream background (#FAFAF8), composition
centered with significant breathing room, NOT cartoony, NOT children's
illustration, NOT 3D, editorial illustration style similar to Wei Xin
and Andy Carolan, mature adult emotional wellness context (Brazilian
adult audience), [specific subject: e.g., "two hands open in welcoming gesture"].
```

**Variant prompt per theme:**
- Warm: `#DC6B3A` accent
- Calm: `#4A9672` accent
- Soft: `#7159A0` accent

### File format & delivery

| Asset type | Format primary | Format fallback | Size budget |
|-----------|---------------|-----------------|-------------|
| Simple line illustrations | SVG | PNG@2x | ≤30KB SVG / ≤50KB PNG |
| Color-rich illustrations | PNG@2x WebP | JPG | ≤80KB WebP |
| Animated (rare) | Lottie JSON | SVG static | ≤40KB Lottie |

### Storage location

```
apps/serenity-ai/public/illustrations/
├── empty-states/
│   ├── chat-empty.svg
│   ├── chat-empty-dark.svg
│   └── ...
├── onboarding/
│   ├── welcome.svg
│   ├── disclaimer-ai.svg
│   └── horizon.svg
├── crisis/
│   └── support-hands.svg
├── landscape/
│   └── mood-base.svg
└── README.md  ← style guide + prompt templates
```

### Tema-aware via SVG `currentColor`

Maioria das ilustrações usa `stroke="currentColor"` e `fill="currentColor"` com opacity. Permite trocar theme sem regenerar arquivo.

```xml
<!-- Empty chat illustration example -->
<svg viewBox="0 0 320 320">
  <!-- Background mood -->
  <rect width="320" height="320" fill="currentColor" opacity="0.03"/>

  <!-- Person silhouette (abstract, no face) -->
  <path d="M..." stroke="currentColor" stroke-width="1.8" fill="none"/>

  <!-- Accent color (theme primary) -->
  <circle cx="240" cy="80" r="20" fill="var(--color-primary-300)" opacity="0.5"/>
</svg>
```

Em componente React:
```tsx
<EmptyChat className="text-neutral-700 dark:text-neutral-300" />
```

---

## Tier 2 — Generative Composições

### Background Ambient (chat + onboarding)

Implementação Canvas 2D + Perlin noise (Refika Anadol direction).

**Specs:**
- Canvas: viewport size, meia resolução render (CSS upscale para perf)
- Algorithm: Perlin noise 2D, 2 octaves, scale 0.003
- Color mapping: function of `mood + theme + time-of-day`
- Animation: 0.5Hz oscillation (~6 cycles/min = breath rhythm)
- Opacity: 0.02-0.04 (quase imperceptível, mas presente)
- Frame budget: ≤2ms mobile

**Fallback (low-end devices ou reduced-motion):**
- 5 capturas estáticas pré-renderizadas (uma por mood level)
- CSS transition entre elas (1200ms ease) quando mood muda

**Implementação:**
```tsx
// AmbientBackground.tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMood } from '@/stores/mood';

export const AmbientBackground = () => {
  const reduced = useReducedMotion();
  const mood = useMood((s) => s.current);

  if (reduced) {
    return <img src={`/illustrations/ambient/mood-${mood}.webp`} className="fixed inset-0 -z-10 opacity-30"/>;
  }

  return <CanvasGenerative mood={mood} />;
};
```

### Mood Landscape

Visualização longitudinal do humor — cada entrada vira "elemento" em paisagem generativa única do user.

**Specs:**
- Container: 1080×400 viewport, escalável
- Algoritmo: cada mood entry adiciona "pixel/dot" em posição (x = data, y = mood-level) com cor do mood-token
- Cumulativo over time (não animado em loop)
- User pode revisitar como "minha paisagem emocional"

**Anti-pattern:** NUNCA usar como métrica gameficada ("você tem 30 dias!"). É **arte personalizada**, não scoring.

---

## Tier 3 — Photography (Restrito)

### Quando usar (3 cenários únicos)

1. **Testimonials reais** com consentimento explícito + termo de imagem assinado (LGPD)
2. **Blog posts educacionais** com pessoas reais brasileiras (com fotógrafo contratado, não stock)
3. **Materiais institucionais** (about page, "quem somos" — fotos da equipe se houver)

### Diretrizes (quando finalmente usar)

1. **Pessoas reais brasileiras diversas** (etnia, corpo, idade, gênero)
2. **Luz natural quente** — nunca estúdio frio fundo branco
3. **Situações cotidianas** (sofa, café, parque) — não staged corporate
4. **Emoções sutis** — não sorrisos exagerados stock-photo. Expressões naturais.
5. **Sem estereótipos de "saúde mental"** — nunca pessoa cabisbaixa, maos na cabeça, escuridão dramática. Esses são clichês traumatizantes.
6. **Filtro de cor obrigatório** — overlay sutil 8% opacity da `--color-primary-50` do theme ativo (unifica com sistema visual)
7. **Crop ratios**: 4:3 ou 16:9 — nunca 1:1 (Instagram-feel)

### Banimentos absolutos

- ❌ Pessoa olhando window com gota de chuva (stock photo "sad woman")
- ❌ Pessoa com mãos no rosto, dedos abrindo olhos
- ❌ Trio de jovens sorrindo demais para câmera
- ❌ Desktop view from above com café + diário (stock photo "wellness routine")
- ❌ Pegadas na praia, fade-to-sunset
- ❌ Qualquer imagem que simule auto-mutilação, abuso, trauma visual

### Fontes (em ordem de preferência)

1. **Produção própria** (longo prazo — fotógrafo brasileiro contratado, modelos reais com termo)
2. **Banco Olhares** (Brasil, diversidade real) — pago, mas brazilian context
3. **Pexels filtrado PT-BR** (busca em português + curadoria manual rigorosa)
4. **Unsplash filtrado** (último recurso — passar por checklist anti-cliché)

### Substituição de stock genérico

Sempre que possível, **substituir foto por ilustração Tier 1**. Foto é fallback, não default.

---

## Photography for Testimonials specifically

### Testimonials são caso especial — Critical UX

Quando Anipis tiver testimonials reais (post-launch), eles são **prova social crítica**. Fotos de testimonials precisam ser:

1. **Reais** — não stock photos de "pessoa que poderia ser testimonial"
2. **Com termo de uso de imagem** assinado (LGPD compliance)
3. **Com nome real ou anonimizado consensual** (user escolhe)
4. **Crop padrão** — busto, 1:1 80×80 em cards + 4:3 expandido em modal
5. **Filtro cor sutil** — unifica visualmente com brand mas mantém autenticidade

**Anti-pattern:** mistura de stock photo + testimonial real no mesmo carrossel. Quebra trust instantly.

---

## Photography editorial — Blog Brasil

Para blog post Anipis ("Por que ansiedade aperta às 4h?", "O que CVV faz?"), fotos podem ser usadas mas:

1. Crop wide 16:9 com pessoa NÃO ocupando centro
2. Luz natural — testar contraste em theme dark + light
3. Composição respirável — não foto cheia de elementos
4. Texto sobre foto SEMPRE com overlay 40% opacity (legibilidade)

---

## Mood references visuais — Resumo

Para alinhamento com Design Lead / produção:

| Theme | Mood references |
|-------|-----------------|
| **Warm** | Pôr-do-sol Recife, cerâmica marajoara, casa interior nordestina, sol amanhecendo, papel craft, terra úmida, café cremoso |
| **Calm** | Floresta cerrado, samambaia, chuva fina, jardim botânico, água parada esverdeada, pedra musgo, manhã neblina serra |
| **Soft** | Aurora boreal, neblina morning, lavender field, cetin lilás, nuvens crepúsculo, vidro fosco roxo, sonho desfocado |

**Não-references:**
- ❌ Spa/wellness genérico (toalhas brancas, pedras zen)
- ❌ Hospital/clínica (estéril, frio)
- ❌ Tech minimalist (white space, gradient)

---

## Acessibilidade

| Critério | Implementação |
|----------|---------------|
| Alt text descritivo PT-BR | Obrigatório em toda imagem, gerado pelo dev ou validado |
| Decorative images | `alt=""` + `role="presentation"` |
| Color-only meaning | Banido — toda meaning visual tem alternativa texto |
| Reduced-motion | Generative composições degradam para static |
| Dark mode contrast | Cada ilustração testada em ambos modos |
| Loading performance | Lazy load below-fold, eager para hero |

---

## Storage budget total

| Categoria | Size estimado |
|-----------|---------------|
| Tier 1 illustrations (sprint 1: I-01 to I-07) | ~300KB SVG total |
| Tier 1 illustrations (sprint 2: I-08 to I-12) | ~500KB SVG total |
| Tier 2 generative fallbacks (5 mood × 3 themes = 15 webp) | ~1.5MB webp |
| Tier 3 photography (post-launch) | ~3-5MB total (testimonials + blog) |
| **TOTAL inicial (sprint 1)** | **~1.8MB** |

---

## Próximos passos

1. Uma rascunha I-01 a I-07 em Figma (1 dia)
2. nano-banana-2 ou Flux gera 3 variantes de cada (~24 renders × $0.30 = ~$7)
3. Designer refina cada para SVG produção
4. Render Tier 2 fallbacks (15 PNG via Canvas script)
5. Documentação em Storybook section "Illustrations"
6. Asset README com prompt templates para futuras adições

---

*Uma — UX Design Expert · 2026-05-16*
*"Stock photo é o equivalente visual de jargão clínico — diz que você não se importou de procurar a palavra certa."*
