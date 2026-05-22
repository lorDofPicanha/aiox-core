# ui-designer — Specs Visuais Rebrand v2 Anipis (Implant)

**Agente:** Pixel (@ui-designer)
**Data:** 2026-05-16 (D-05)
**Bulk Uma:** aceito 16/Mai — implant em curso
**Inputs:** `03-rebrand-v2/04-ICONOGRAPHY.md`, `06-ILLUSTRATION-PHOTO.md`, `01-LOGO-DIRECTIONS.md` (D3), `02-COLOR-SYSTEM.md`
**Output owner:** brand asset library `apps/serenity-ai/apps/web/public/brand-v2/`
**Mind clones consultados (sync-thought):** dieter-rams (less-but-better em variantes), erik-spiekermann (geometria modular ícones), refika-anadol (organic shape language D3)

— Pixel, criando interfaces 🎨

---

## 0. Premissas de execução

Antes de produzir, lock destes invariantes (vindos do bulk Uma, não negociar agora):

- Color primary: `#DC6B3A` Aurora Coral (Warm theme)
- Neutral text: `#2A2823` (warm-neutral-800) / cream bg `#FAFAF8` (warm-neutral-50)
- Stroke language: **1.5px** em 24px base, rounded caps + joins (consistente com Phosphor regular)
- Aesthetic: warm minimal hand-drawn, NÃO stock, NÃO 3D, NÃO cartoony, **NUNCA face close-up em crisis-contexts**
- Tier 1 illustrations: organic shapes + soft gradients + art-directed (não Storyset/unDraw)
- Animation: respeitar `prefers-reduced-motion` em todo asset com motion
- Theming: `currentColor` em SVG sempre que possível, fill via CSS vars (`var(--warm-primary-500)`)

---

## 1. Os 4 ícones SVG signature — specs detalhadas

Grid base **24×24**, sub-grid 1px, optical alignment > matemático. Todos exportam **3 variants** (outline / fill / duotone) + 3 sizes pré-bakeados (16/24/48). Stroke 1.5px no 24, escalado proporcional (1.25/1.5/2).

### 1.1 `anipis-flame` — chama interna, sopro vital

**Concept rationale.** Forma orgânica que evoca chama suave + pétala + gota — *anima* (sopro vital) sem ser literal. Diferencia de "gota de água" (cliché hidratação) por **assimetria sutil** no ápice e razão width:height **12:20** (não 12:22 como rascunho Uma — encurtei pra ler menos "gota"). NÃO é fogo agressivo: é **brasa quieta**.

**Geometric construction.**
- Viewbox `0 0 24 24`; padding óptico 2px todos lados (área util 20×20)
- Eixo simétrico vertical em x=12
- Ponto inferior fechado: `(12, 22)` com tangentes horizontais (base arredondada, raio 1)
- Subida lateral via Bezier cúbica: control points em `(7.2, 18)` e `(7, 9)` esquerda, espelhado direita
- Ápice arredondado: termina em `(12, 3)` com raio efetivo 1.2 (não pico agudo)
- Inclinação 1° à direita no topo: assimetria orgânica (Refika direction — perfeito é morto)

**Stroke + corners.**
- Outline: stroke `1.5px`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"`
- Fill: solid `currentColor`, sem stroke
- Duotone: outer path 60% opacity + inner "core" path em 100% (segundo path reduzido 50% scale a partir do centro óptico `(12, 14)`)

**Pseudocode SVG path.**
```
outline variant:
M 12 22
C 12 22, 4.5 19, 4.5 14
C 4.5 9, 8 5, 11.5 3
A 1.2 1.2 0 0 1 12.5 3
C 16 5, 19.5 9, 19.5 14
C 19.5 19, 12 22, 12 22 Z
stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round fill=none

fill variant:
[mesmo path] fill=currentColor stroke=none

duotone variant:
[outer path opacity=0.4 fill=currentColor]
[inner path: M 12 19 C 9 19, 8 15.5, 8 13.5 C 8 11, 10 9, 12 8 C 14 9, 16 11, 16 13.5 C 16 15.5, 15 19, 12 19 Z, opacity=1, fill=currentColor]
```

**Usage rules.**
- ✅ Logo símbolo small (≤32px), splash, About page, loading premium, sticker marketing, badge "wellness signature"
- ❌ **NUNCA** em crisis-context (CVV banner, suicide ideation flow). Crisis usa `Warning`/`WarningOctagon` Phosphor fill em red — flame ali lê metáfora errada ("apagar-se")
- ❌ Não inverter (apex sempre up)
- ❌ Não flickering animation — apenas `breathing` (8s ciclo, mesma curve do logo D3)

### 1.2 `anipis-breath` — ciclo respiratório

**Concept rationale.** Visualização do ciclo respiratório: núcleo + arcs concêntricos. Lê como **diafragma expandindo**, não como "loading spinner" (que é cliché ansiogênico). Geometria modular Spiekermann: tudo deriva de raio base `r=4`.

**Geometric construction.**
- Círculo central preenchido: centro `(12, 12)`, raio `4`
- Arc interno: raio `7`, stroke 1.5, sweep `240°` aberto na base (de `-30°` a `210°` no relógio)
- Arc externo: raio `10`, stroke 1.5, sweep `180°` aberto no topo (de `30°` a `150°`)
- Os arcs **não fecham** propositadamente — sugere expansão contínua, não contenção
- Variant duotone: core fill 100% + arc interno 60% + arc externo 40% (gradiente de presença)

**Pseudocode SVG path.**
```
outline:
<circle cx=12 cy=12 r=4 fill=currentColor />
<path d="M 4 13 A 7 7 0 1 1 20 13" stroke=currentColor stroke-width=1.5 fill=none stroke-linecap=round />
<path d="M 6.5 9.5 A 10 10 0 0 1 17.5 9.5" stroke=currentColor stroke-width=1.5 fill=none stroke-linecap=round />

fill: idem com arcs preenchidos sólidos como rings (subtract inner)
duotone: 3 elementos com opacities 1 / 0.6 / 0.4
```

**Stroke + corners.** Stroke 1.5 com `stroke-linecap="round"` — extremidades arredondadas reforçam mood orgânico.

**Usage rules.**
- ✅ Botão "Iniciar exercício de respiração" em chat
- ✅ Card de exercício respiração (size lg 32px)
- ✅ Onboarding tela "explicando exercícios"
- ✅ Settings → toggle "Lembrar de respirar?"
- ❌ Não usar como loading spinner genérico (cliché)
- ❌ Não animar com `spin` infinito — apenas pulse 8s sincronizado com breath rhythm e PAUSADO em crisis banner

### 1.3 `anipis-companion` — orbe presença

**Concept rationale.** Ícone-versão do orbe principal do Anipis. **Blob orgânico** com leve assimetria horizontal (centro óptico deslocado 0.5px à esquerda) — sugere "presença viva", não círculo perfeito (que seria UI element, não entity). Refika Anadol consult: imperfeição = vida.

**Geometric construction.**
- 8-point Bezier path simétrico vertical, assimétrico horizontal
- Bounding circle equivalente: raio ~9, centro óptico `(11.5, 12)`
- 8 control vertices (clock positions): `(11.5, 3.2)`, `(17.5, 5)`, `(20.5, 11)`, `(18, 17.5)`, `(11.5, 20.8)`, `(5, 17.8)`, `(2.5, 11)`, `(5.5, 5.2)`
- Bezier suaviza tangentes em curvas contínuas C2 (sem cantos visíveis)
- Variants: outline / fill / duotone (outer blob 40% + inner small "core" circle r=2.5 em `(11.5, 12)` 100%)

**Pseudocode SVG path.**
```
outline:
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

duotone:
[outer path fill=currentColor opacity=0.35]
[<circle cx=11.5 cy=12 r=2.5 fill=currentColor />]
```

**Usage rules.**
- ✅ Chat header (avatar do Anipis vs avatar user)
- ✅ Notifications "Anipis te respondeu"
- ✅ Memory inspector — "memória do Anipis"
- ✅ Empty states xl (48px) com breathing animation 8s
- ❌ Não usar como brand mark primário — é "ele ali", não "a marca"
- ❌ Não estilizar com gradient stops bruscos (perde organicidade)

### 1.4 `anipis-bridge` — handoff humano

**Concept rationale.** Ponte/conexão entre dois pontos. Representa transição IA → apoio humano. **Não direcional** (não seta) — bidirecional emphasis. Arco-ponte é lateral, **horizontal**, sem hierarquia vertical (humano não é "acima" de IA, é parceiro). Dieter Rams consult: less ornament, more meaning.

**Geometric construction.**
- Dois círculos pequenos: centros `(4.5, 14)` e `(19.5, 14)`, raio `2.5`
- Arco conectando: peak em `(12, 6)`, curvatura via Bezier quadrática com control `(12, 4)`
- Stroke 1.5, linecap `round`
- Variant fill: círculos sólidos `currentColor` + linha arco stroke 1.5
- Variant duotone: círculos 100% + arco 50% opacity

**Pseudocode SVG path.**
```
outline:
<circle cx=4.5 cy=14 r=2.5 stroke=currentColor stroke-width=1.5 fill=none />
<circle cx=19.5 cy=14 r=2.5 stroke=currentColor stroke-width=1.5 fill=none />
<path d="M 6.5 12.5 Q 12 3, 17.5 12.5" stroke=currentColor stroke-width=1.5 fill=none stroke-linecap=round />

fill:
<circle cx=4.5 cy=14 r=2.5 fill=currentColor />
<circle cx=19.5 cy=14 r=2.5 fill=currentColor />
<path d="M 6.5 12.5 Q 12 3, 17.5 12.5" stroke=currentColor stroke-width=1.5 fill=none stroke-linecap=round />
```

**Usage rules.**
- ✅ Botão "Falar com pessoa real" em chat header
- ✅ Resource cards CVV/SAMU/CAPS
- ✅ Onboarding "como funciona handoff humano"
- ✅ Settings → "Profissionais parceiros" (roadmap fase 2)
- ❌ Não rotacionar (não vira seta)
- ❌ Não animar fluxo unidirecional (light traveling) — quebra simbolismo "parceiros"

---

## 2. 5 ilustrações tier 1 — briefs detalhados

Estilo: warm minimal hand-drawn. Production: Procreate sketches + Adobe Illustrator finalize, OU freelance brasileiro. **Stroke 1.8-2.2px** (mais grosso que ícones, deriva visual), warm dark brown `#403D36`. Figures humanas sempre **sem rosto definido** — universal, qualquer brasileiro se vê. Multi-ethnic representativeness via silhueta corporal variada (não pele/cabelo, que estão abstraídos).

### I-01 — "Empty chat — sentar com o céu"

**Scenario.** Pessoa de costas, sentada em chão de quarto (silhueta arredondada, ombros relaxados), olhando janela com céu pré-amanhecer. Momento baseline mood check-in — não crise, **espera receptiva**.

**Composition.**
- Camera: ¾ atrás, slight elevação (sugere observador empático, não voyeur)
- Focal point: linha do horizonte céu, à direita superior
- Supporting: planta no canto inferior-direito (samambaia ou costela-de-adão), 2 elementos cama desfocados ao fundo
- Breathing room: 35% canvas vazio (top + esquerda) — peso visual desce-direita

**Color palette (ratios).**
- Aurora Coral `#DC6B3A` — **8%** (única faixa céu, sub-amanhecer)
- Sage `#4A9672` — **12%** (planta)
- Warm neutral `#403D36` linework — **30%**
- Cream bg `#FAFAF8` — **40%**
- Soft gradient céu (Coral → cream) — **10%**

**Mood reference (não-AI, reais).**
1. Maira Kalman watercolor editorial (linha solta, paleta limitada warm)
2. Lotta Nieminen editorial Penguin Random covers (composição respirável, figures abstratas)
3. Ping Zhu NYT op-ed illustrations (mood emocional sem cliché)

**Production path.**
- Opção A (in-house): Pixel rascunha em Procreate iPad (3h), refina em Illustrator com brush "Charcoal Pencil" 2.0px (5h), export SVG via Astute Graphics SubScribe. **Total: 8h**.
- Opção B (freelance BR mainstage): **Maria Inês Gul** (ilustradora SP, editorial Folha + Piauí) OU **Bruna Lubaszewski** (POA, wellness brands). Brief 1h + 2 rodadas review. **Total externo: 10-14h, R$2.2k-3.5k**.
- Recomendação: I-01 in-house (referência do sistema), I-02 a I-05 freelance se budget allow.

**Estimated hours:** 8-14h por illustration.

### I-02 — "Onboarding — duas mãos abertas"

**Scenario.** Duas mãos em gesto de acolhimento (palmas viradas pra cima, dedos relaxados), composição centrada. Não é "high five" nem "rezar" — é **receber**.

**Composition.**
- Camera frontal, leve top-down 10°
- Focal point: ponto exato entre as duas mãos (onde luz cai)
- Supporting: 3-4 elementos orgânicos flutuando (folha, pequena chama anipis-flame, círculo coral) — sugerem "o que está sendo recebido"
- Breathing room: 40% canvas

**Color palette.**
- Coral `#DC6B3A` — 15% (chama central + um círculo)
- Sage 10% (folha)
- Warm gold `#E6AE2C` — 6%
- Linework `#403D36` — 28%
- Cream bg 41%

**Mood reference.**
1. Carson Ellis ilustração infantil-adulta (Wildwood) — sem ser infantil, mantém warmth
2. Olimpia Zagnoli editorial (NYT, New Yorker) — color blocking + linework
3. Ana Juan covers Cervantes — composição centralizada simbólica

**Production path.** In-house (signature onboarding). 10h.

### I-03 — "Crisis support — duas figuras lado-a-lado"

**Scenario.** Duas silhuetas sentadas em banco/sofá, **lado-a-lado** (não frente-a-frente, postura clínica), uma mão sobre o ombro da outra. **Sem rostos** (regra dura — crisis-context). Cabeças orientadas levemente uma à outra mas sem detalhe facial.

**Composition.**
- Camera lateral perfil
- Focal point: ponto de contato mão-ombro (luz mais quente ali)
- Supporting: chão/banco minimalista, talvez xícara no chão entre eles
- Breathing room: 30% canvas (denso o suficiente para sentir presença, vazio o suficiente para não opressar)

**Color palette.**
- Sage `#4A9672` — **18%** (cobertor sobre uma das figuras — calor protetor)
- Coral — **8%** (xícara, sub-acento)
- Linework — 32%
- Cream bg — 42%

**Mood reference.**
1. JooHee Yoon (Eden Project covers) — silhueta como linguagem
2. Lisk Feng editorial NYT — composição íntima sem invasão
3. Camille Chew watercolor melancólico

**Production path.** **In-house obrigatório** (crisis = bandeira UX, não terceirizar primeira iteração). 12h + review @ux-design-expert + @qa.

**Regra dura:** NÃO submeter ao Flux ou nano-banana mesmo como ref — risco de gerar variante stock-like "sad woman crying". Crisis illustrations sempre human-first.

### I-04 — "Mood landscape base — paisagem receptora"

**Scenario.** Paisagem abstrata horizontal larga (1080×400) — colinas suaves overlapping, céu pastel gradient, sem figuras humanas, sem edifícios. **Receptora de overlay generativo** (Tier 2 Canvas dots representando mood entries do user).

**Composition.**
- Camera frontal, horizonte em 60% da altura (não regra de terços padrão — propositadamente alto pra "céu opressivo virar acolhedor" pós-overlay)
- Focal point: ponto sutil de luz no horizonte center-right
- Supporting: 2-3 silhuetas árvores cerrado bem distantes (escala dá profundidade)
- Breathing room: 50% (precisa receber dots gerativos)

**Color palette.**
- Coral — 12% (céu pôr-do-sol Recife)
- Sage — 20% (colinas mid-ground)
- Soft lavender `#A89AB8` — 8% (céu superior)
- Linework — 15% (minimal, só silhuetas)
- Cream/warm gray gradient bg — 45%

**Mood reference.**
1. Eyvind Earle (Disney pre-anim painted backgrounds) — paisagem stylized layered
2. Lieke van der Vorst editorial — paleta limited warm
3. Tom Haugomat Penguin Press covers — horizonte minimal

**Production path.** Hybrid: base illustration in-house 10h + integração runtime Canvas via @design-systems-engineer. Asset entregue como SVG layered (sky/hills/trees separados).

### I-05 — "404/Error gentle — pessoa olha céu, sem irritação"

**Scenario.** Silhueta de costas, em pé em campo aberto, olhando céu com nuvem fofa solitária. Postura **relaxada**, não desesperada. Mensagem: "não achamos isso, mas o céu continua aí".

**Composition.**
- Camera ¾ atrás, low angle
- Focal point: a nuvem (offset top-right)
- Supporting: chão linha simples, 1 elemento folha caindo, número "404" pode aparecer estilizado pequeno no canto inferior como assinatura sutil (não dominante)
- Breathing room: 55% — mensagem É espaço

**Color palette.**
- Coral — 6% (nuvem com sub-blush)
- Sage — 14% (chão/horizonte)
- Linework — 22%
- Cream bg — 58%

**Mood reference.**
1. Jon Klassen children's book illustration adult sensibility
2. Geoff McFetridge editorial — flat com warmth
3. Brecht Vandenbroucke editorial pastel

**Production path.** In-house 8h. Permite Flux como ref-board apenas (não final).

---

## 3. 3 Flux 1.1 Pro renders — Warm only ($0.90 total)

**Stack.** Replicate API endpoint `black-forest-labs/flux-1.1-pro`. Conta cobrança: Bretda (única <$5 saldo livre 16/Mai, conta Tocks tem PIX em fila). Output sempre 1 imagem por prompt (não batch — controle qualidade).

**Parameters padrão para os 3.**
```yaml
model: black-forest-labs/flux-1.1-pro
aspect_ratio: 16:9   # cover/hero default
output_format: png
output_quality: 95
prompt_upsampling: false   # mantemos prompt control fino
safety_tolerance: 2
num_outputs: 1
```

**Variant aspect_ratio:**
- Prompt 1 e 2: `16:9` (hero cover web)
- Prompt 3: `3:2` (hero variant, breathing exercise modal landscape)

**Pitfalls Flux 1.1 Pro a evitar.**
- Resolução máxima efetiva: **1440px lado maior** — não pedir 4K (downscale automático com loss)
- `aspect_ratio` aceita apenas presets: `1:1, 16:9, 21:9, 3:2, 2:3, 4:5, 5:4, 3:4, 4:3, 9:16, 9:21` — NÃO custom
- Rate limit conta Bretda: **2 req/min** soft. Espaçar 30s entre os 3.
- Flux ignora prompts >300 tokens efetivos — manter < 250 palavras
- **NÃO renderiza faces close-up bem em low budget** — manter face a >40% framing OR ausente (alinha com regra "no face em crisis")
- Sem negative_prompt nativo Flux Pro — usar phrasing positivo "without [X]"

**Cost:** 3 × $0.30 = **$0.90 total** (Flux 1.1 Pro pricing Replicate 16/Mai).

### Prompt 1 — Hero environment "warm morning Brazilian living room"

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

**Aspect ratio:** `16:9`
**Use:** LP hero background, marketing OG image, blog post hero "warmth & home" topics
**Cost:** $0.30

### Prompt 2 — Companion atmosphere "soft hand interaction with phone"

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

**Aspect ratio:** `16:9`
**Use:** LP "Como funciona" section, app store screenshots backdrop, social Instagram cards
**Cost:** $0.30
**Representativeness note:** "brown-skinned adult hand" propositadamente — multi-ethnic guideline (18-29 BR median = pardo/preto majoritário 56% IBGE 2022). Em rerun futuro alternar com "black-skinned" e "lighter-brown skinned" para library plural — nunca defaultar para euro-brazilian.

### Prompt 3 — Breathing exercise visual "abstract organic shapes"

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

**Aspect ratio:** `3:2`
**Use:** Breathing exercise modal cover, splash screen variant, ambient background fallback hero variant
**Cost:** $0.30

**Script Replicate (referência execução).**
```bash
# Setup
export REPLICATE_API_TOKEN="<bretda-account-token>"

# Prompt 1
curl -s -X POST https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"prompt":"<prompt-1>","aspect_ratio":"16:9","output_format":"png","output_quality":95,"safety_tolerance":2}}'

# Wait 30s, Prompt 2, idem com 16:9
# Wait 30s, Prompt 3, com aspect_ratio 3:2

# Total: 3 calls, ~90s wall clock, $0.90
```

Download outputs como `flux-01-living-room.png`, `flux-02-hand-phone.png`, `flux-03-breath-abstract.png` em `apps/serenity-ai/apps/web/public/brand-v2/photography/flux-warm/`.

---

## 4. Logo D3 Breathing Form — export matrix

**Variante canônica:** static keyframe **neutro** (largura 0.6H, altura H) — fotograma intermediário entre inspira (0.71H) e expira (0.5H).

**Matrix de exports.**

| Size | Variant Light | Variant Dark | Variant Mono | Animated |
|------|---------------|--------------|--------------|----------|
| 16px (favicon) | static keyframe | static keyframe | static keyframe | NO |
| 24px (micro) | static keyframe | static keyframe | static keyframe | NO |
| 48px (small) | primary or static | primary or static | static | hover only |
| 128px (medium) | primary | primary | static | hover only |
| 512px (large) | primary | primary | static | YES loop 8s |

**Total assets static:** 5 sizes × 3 variants (light/dark/mono) = **15 SVG files** + PNG @1x/@2x/@3x para cada (raster fallbacks especialmente <48px e favicons) = **15 × 4 = 60 raster** + 15 SVG = **75 assets** static.

**Animated extra:** 3 SVG + 3 Lottie JSON (light/dark/mono) para 512px+ contexts = **+6**.

**Total geral:** **81 arquivos**.

**Naming convention.**
```
logo-anipis-{variant}-{theme}-{size}.{ext}

Exemplos:
logo-anipis-primary-light-16.svg
logo-anipis-primary-light-16.png        (1x = 16px)
logo-anipis-primary-light-16@2x.png     (32px)
logo-anipis-primary-light-16@3x.png     (48px)
logo-anipis-primary-dark-128.svg
logo-anipis-mono-light-512.svg
logo-anipis-animated-light-512.svg
logo-anipis-animated-light-512.lottie.json
```

**Color tokens por variant.**
- Light: fill `#DC6B3A`, wordmark `#2A2823`, bg `#FAFAF8`
- Dark: fill `#FF9A5C` (warm-primary-300, mais luminoso), wordmark `#FAFAF8`, bg `#1A1916`
- Mono light: fill `#1A1916`, wordmark `#1A1916`
- Mono dark: fill `#FAFAF8`, wordmark `#FAFAF8`

**Animação SVG inline (bake-in para 512px+):**
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

**Reduced-motion compliance:** export adicional `logo-anipis-static-neutral-{theme}-{size}.svg` para `<picture>` swap via CSS media query (não JS).

---

## 5. Brand asset library — estrutura + manifest

**Location.** `apps/serenity-ai/apps/web/public/brand-v2/`

**Tree.**
```
apps/serenity-ai/apps/web/public/brand-v2/
├── manifest.json                       ← source-of-truth listing
├── README.md                           ← uso, prompts templates, regras
├── logos/
│   ├── primary/
│   │   ├── logo-anipis-primary-light-{16,24,48,128,512}.{svg,png,@2x.png,@3x.png}
│   │   ├── logo-anipis-primary-dark-...
│   │   └── logo-anipis-mono-...
│   ├── animated/
│   │   ├── logo-anipis-animated-light-512.svg
│   │   ├── logo-anipis-animated-light-512.lottie.json
│   │   └── ...
│   └── static-neutral/                  ← reduced-motion variants
├── icons-custom/
│   ├── anipis-flame.{outline,fill,duotone}.svg
│   ├── anipis-breath.{outline,fill,duotone}.svg
│   ├── anipis-companion.{outline,fill,duotone}.svg
│   └── anipis-bridge.{outline,fill,duotone}.svg
├── illustrations/
│   ├── i-01-empty-chat-skyfall.svg
│   ├── i-02-onboarding-open-hands.svg
│   ├── i-03-crisis-side-by-side.svg
│   ├── i-04-mood-landscape-base.svg
│   └── i-05-404-cloud-sky.svg
├── photography/
│   └── flux-warm/
│       ├── flux-01-living-room-16x9.png
│       ├── flux-02-hand-phone-16x9.png
│       └── flux-03-breath-abstract-3x2.png
└── tokens/
    └── design-tokens.json               ← export DTCG W3C (cores/typography)
```

**`manifest.json` schema.**
```json
{
  "version": "2.0.0",
  "brand": "anipis",
  "generatedAt": "2026-05-16T18:00:00-03:00",
  "primaryColor": "#DC6B3A",
  "assets": [
    {
      "id": "logo-primary-light-512",
      "path": "logos/primary/logo-anipis-primary-light-512.svg",
      "type": "logo",
      "variant": "primary",
      "theme": "light",
      "size": 512,
      "format": "svg",
      "sha256": "<hash>",
      "bytes": 4821,
      "usage": ["splash", "marketing-hero", "press-kit"]
    },
    {
      "id": "icon-anipis-flame-outline",
      "path": "icons-custom/anipis-flame.outline.svg",
      "type": "icon-custom",
      "viewBox": "0 0 24 24",
      "format": "svg",
      "sha256": "<hash>",
      "bytes": 642,
      "usage": ["about-page", "splash", "loading-premium"],
      "blocked_contexts": ["crisis"]
    },
    { "...": "..." }
  ],
  "totals": {
    "logos": 81,
    "icons": 12,
    "illustrations": 5,
    "photography": 3,
    "totalBytes": 0
  }
}
```

**Manifest generation script** (`scripts/generate-brand-manifest.mjs`):
```js
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, extname } from 'node:path';

const ROOT = 'apps/serenity-ai/apps/web/public/brand-v2';

async function walk(dir, results = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, results);
    else if (!['.json', '.md'].includes(extname(entry.name))) results.push(full);
  }
  return results;
}

const files = await walk(ROOT);
const assets = await Promise.all(files.map(async (f) => {
  const buf = await readFile(f);
  const s = await stat(f);
  return {
    id: relative(ROOT, f).replace(/\W+/g, '-').replace(/-+/g, '-'),
    path: relative(ROOT, f).replaceAll('\\', '/'),
    format: extname(f).slice(1),
    sha256: createHash('sha256').update(buf).digest('hex'),
    bytes: s.size,
  };
}));

await writeFile(join(ROOT, 'manifest.json'), JSON.stringify({
  version: '2.0.0', brand: 'anipis',
  generatedAt: new Date().toISOString(),
  primaryColor: '#DC6B3A',
  assets,
  totals: { count: assets.length, totalBytes: assets.reduce((a, b) => a + b.bytes, 0) }
}, null, 2));
```

Roda em pre-commit hook + CI guarantee `manifest.json` drift-free.

---

## 6. Multi-ethnic representativeness guideline

**Aplicabilidade.** Os 3 Flux renders **deste sprint não contém faces** propositalmente (alinha com regras Tier 1/3 e D-09 crisis safety). Mas no Prompt 2 há hand close-up — guideline aplicado: **brown-skinned adult hand** baked-in.

**Library expansion futura (post-launch sprint 2).** Quando produzirmos renders adicionais com pessoas:

- Distribuição alvo da library: **Pardo 45% / Preto 25% / Branco 20% / Amarelo 5% / Indígena 5%** (espelha IBGE 2022 BR adulto 18-29, target Júlia)
- Tom de pele em prompt: específico, não eufemismo
  - ❌ "warm-toned skin", "Latin features" (vago, default euro-tinted Flux bias)
  - ✅ "deep brown skin with red undertone", "medium brown skin with cool undertone", "tan brown skin Indigenous features Brasilian Northeast"
- Cabelo: variar texture (crespo 4A/4B/4C frequente, ondulado 2B/3A, liso) — não defaultar liso
- Corpo: variar tipo físico — não defaultar slim
- Idade: 80% range 18-29, 20% 30-40 (parents target secundário)
- **Crisis-context absoluto:** sem faces, sem corpos identificáveis. Aplica acima APENAS em contexts non-crisis (LP, blog, marketing materials).

**Validation gate.** Cada batch novo de renders passa por checklist QA @ux-design-expert + @qa antes de entrar `manifest.json`:
1. Tom de pele matches prompt spec
2. Sem cliché "sad woman gazing window"
3. Sem fundo branco estéril
4. Sem face close-up em rótulo crisis-flagged
5. Sub-overlay 8% primary color filter aplicado se for Tier 3 photo

---

## 7. Handoff próximo agente

**Para @design-systems-engineer:**
- Custom icons como React components em `apps/serenity-ai/src/components/icons/custom/` (4 arquivos × 3 variants cada via prop)
- Manifest JSON pipeline em CI
- Tailwind config tokens warm primary canônicos

**Para @dev (Dex):**
- Brand asset library route + lazy-load illustrations strategy
- `<picture>` swap reduced-motion para logo animated

**Para @qa (Quinn):**
- Visual regression Chromatic per icon variant + 5 illustrations + 3 logo sizes
- A11y: alt text em PT-BR para cada illustration, decorative `aria-hidden` nos icons inline

**Para @devops (Gage):**
- CI gate: manifest.json drift check + sha256 verify
- Replicate API token Bretda em GitHub Secrets (não commit)

**Suggested next command:** `*responsive logo` ou `*visual-qa brand-v2-library` após pipeline de export rodar.

---

## 8. Resumo executivo (TL;DR)

1. **4 ícones SVG custom** (flame/breath/companion/bridge) — grid 24×24, stroke 1.5px, 3 variants cada (outline/fill/duotone), regras de uso duras (flame NÃO em crisis, bridge NUNCA direcional)
2. **5 ilustrações Tier 1** (I-01 empty chat, I-02 hands, I-03 crisis side-by-side, I-04 mood landscape, I-05 404 sky) — warm minimal hand-drawn, refs Maira Kalman / Lotta Nieminen / Ping Zhu, 8-14h cada, mix in-house + freelance BR (Maria Inês Gul / Bruna Lubaszewski)
3. **3 Flux 1.1 Pro renders Warm** (living room / hand-phone / breath abstract) — $0.90 total via conta Bretda, prompts prontos para Replicate API com aspect_ratio + pitfalls baked-in
4. **Logo D3 Breathing Form** — 5 sizes × 3 variants × static + animated = **81 assets** com naming convention `logo-anipis-{variant}-{theme}-{size}.{ext}`
5. **Brand library** em `apps/serenity-ai/apps/web/public/brand-v2/` + `manifest.json` com sha256 + script CI generation
6. **Multi-ethnic guideline** baked: IBGE 2022 ratios, prompts específicos não eufemismo, crisis-context absoluto sem faces

Pixel-perfect, brand-coherent, e produzível em D-05 + D-06. Sem stock photos, sem cartoony, sem 3D. Anipis lê Anipis em qualquer tamanho.

— Pixel, criando interfaces 🎨
