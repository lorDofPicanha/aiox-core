# Logo Directions — Rebrand v2

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Status:** 3 direções para escolha user (D-UX-01)
**Recomendação Uma:** **D3 Breathing Form** (justificada §3.5)
**Sem PNGs nesta entrega** — produção visual Flux/Figma só após aprovação direction (custo control)

---

## Princípios de logo (consolidados conclave)

Antes de propor direções, os 4 princípios do brandbook v1 §2.1 ficam mantidos + 2 adicionais:

1. **Orgânico, não geométrico rígido** (mas geometria precisa subjacente — Spiekermann)
2. **Minimalista** — funciona em 16px (favicon) até outdoor
3. **Acolhedor** — evoca calor, presença, cuidado
4. **Memorável** — reconhecível em 1 segundo
5. **NOVO — Anti-cliché**: não pode ser chama-genérica-de-app-wellness (van Schneider veto)
6. **NOVO — Ownable em movimento**: logo deve ter uma animação signature, não ser apenas estático (Anadol + Val Head)

---

## Direção D1 — Mythological (Anima Eternal)

### Concept rationale

Reinterpretação do conceito **anima** (sopro vital) e **elpis** (esperança) através de simbolismo **mitológico-clássico**, mas executado com geometria precisa contemporânea — não floreio new-age.

Referência conceitual: o **pneuma** grego (sopro/alma) representado como volute (espiral) — presente em capiteis jônicos, em vesicas pisces, em mandorlas medievais. Direção pede **respeito tipológico** ao símbolo sem cair em decorativismo místico.

### Geometric construction

- **Símbolo**: espiral logarítmica de Fibonacci com 2.5 voltas, terminação em ponto que aponta para cima-direita (45°)
  - Razão áurea (φ = 1.618) na progressão das voltas
  - Stroke width: 8% da altura total (escala consistente)
  - Terminação superior abre 12° para fora (gesto de "sopro/exalação")
- **Wordmark**: "anipis" em General Sans Medium, all-lowercase, tracking -0.02em, espacamento entre símbolo e wordmark = altura do "p" (que tem descender)
- **Construção**: grid de 12 colunas, símbolo ocupa colunas 1-4, wordmark colunas 5-12

### Color usage

- **Primary**: stroke do símbolo em `--anipis-700` (#A44726) sobre `--bg-page` cream
- **Wordmark**: `--neutral-800` (#2A2823)
- **Subtle gradient (variant)**: stroke pode receber gradient `--anipis-500` → `--luz-500` (coral → dourado) apenas em hero/splash — nunca em ícones pequenos
- **Mono**: 100% preto puro (#000) ou 100% branco puro (#FFF) para impressos/dark mode invertido

### Variants

| Variant | Uso | Specs |
|---------|-----|-------|
| **Primary horizontal** | Header site, materiais institucionais | Símbolo + wordmark lado a lado, ratio 1:3.2 |
| **Stacked** | Splash, app icon expandido, social media post | Símbolo acima, wordmark abaixo, gap = altura H |
| **Symbol only** | Favicon, app icon, avatar | Símbolo isolado, área 1:1 |
| **Wordmark only** | Footer, contextos onde símbolo conhecido | Tracking +0.02em (mais aberto sem símbolo) |
| **Reversed (dark)** | Dark mode, backgrounds escuros | Stroke #F5F4F0 cream (não branco puro) |
| **Monochrome** | Documentos legais, fax (ainda existe), 1-color print | #000 ou #FFF |

### Scale rules

| Tamanho | Variant permitida | Notas |
|---------|-------------------|-------|
| 16-23px | Symbol only | Stroke aumenta para 12% nesse tamanho (legibilidade) |
| 24-39px | Symbol only ou stacked | Wordmark começa a ficar ilegível |
| 40-79px | Stacked ou primary | |
| 80px+ | Qualquer variant | Gradient permitido se variant primary |

### Do / Dont

| ✅ Do | ❌ Dont |
|-------|---------|
| Manter ratio aurea da espiral | Não esticar/comprimir |
| Stroke uniforme (não variável) | Não rotacionar — orientação fixa |
| Espacamento clear-space = altura H | Não colocar texto dentro do clear-space |
| Animação respiratória 8s (símbolo "expira") | Não animar com spin 360° (clichê de loading) |
| Color permitido: anipis-700 / mono | Não usar cores fora da paleta brand |

### Crítica honesta de Uma

D1 tem **risco de cliché místico**. Espirais em apps de wellness são frequentes (Calm, Insight Timer). Geometria precisa diferencia, mas não imuniza. Razão para considerar mesmo assim: nome "anipis" tem etimologia grega — direção mitológica é **honest to the name**.

---

## Direção D2 — Aurora Arc (Horizonte de Elpis)

### Concept rationale

**Aurora** como gesto — não decoração. Um arco que evoca **horizonte amanhecendo**, representação visceral de **esperança** (elpis). Inspirado conceitualmente em logos como Tide (com onda) e Apple Music (com gradient), mas executado com **menos ornament, mais gesture**.

Diferença crítica de "logo com gradient genérico": aqui o arco TEM SIGNIFICADO geométrico — é a curva exata do horizonte visto de 15° acima (perspectiva de quem está deitado olhando o céu amanhecer).

### Geometric construction

- **Símbolo**: arco de círculo com 90° de abertura, eixo do arco horizontal, abertura voltada para cima
  - Raio: 100% da altura total H
  - Stroke variável: 6% no centro, afina para 3% nas extremidades (efeito "horizonte distante")
  - Ponto de máxima espessura no zênite do arco
  - Abaixo do arco: linha horizontal sutil 1% espessura ("horizonte")
- **Wordmark**: "anipis" em General Sans Medium, lowercase, posicionado ABAIXO do arco-horizonte (estética de "nasce do horizonte")
- **Proporção**: arco/wordmark = 1.6:1

### Color usage

- **Primary**: gradient sutil ao longo do arco: `--anipis-600` (esquerda) → `--luz-500` dourado (centro) → `--anipis-400` (direita) — simula amanhecer
- **Wordmark**: `--neutral-800`
- **Mono variant**: arco vira **stroke uniforme** em `--anipis-700` (gradient se perde em 1 cor)
- **Dark mode**: gradient mantido mas shifted para `--anipis-400` → `--luz-300` → `--anipis-300` (mais luminoso)

### Variants

Iguais a D1 (primary horizontal / stacked / symbol only / wordmark only / reversed / mono).
**Exceção**: D2 não tem variant "stacked com gradient em símbolo small" — gradient só funciona em símbolo ≥40px. Abaixo disso, vira mono `--anipis-700`.

### Scale rules

| Tamanho | Variant | Color |
|---------|---------|-------|
| 16-39px | Symbol only mono | `--anipis-700` solid stroke |
| 40-79px | Symbol only ou stacked | Gradient permitido se ≥48px |
| 80px+ | Primary | Gradient sempre |

### Do / Dont

| ✅ Do | ❌ Dont |
|-------|---------|
| Gradient sempre sutil — não saturado | Não usar gradient se símbolo <40px |
| Linha horizonte sempre presente | Não remover linha horizonte ("vira só arco aleatório") |
| Animação amanhecer: gradient muda de tom (5s ciclo, ease-breath) | Não animar com sun-rising movement (clichê) |
| Em splash: arco pode aparecer com stroke-dasharray draw (1.5s) | Não usar sparkles, raios ou efeitos de luz |

### Crítica honesta de Uma

D2 **diferencia bem** em market de wellness BR (não vi nenhum app com aurora-as-logo no scan competitivo). Mas tem **risco de virar "logo de seguradora"** se gradient for executado mal. Demanda direção de arte muito disciplinada.

---

## Direção D3 — Breathing Form (Forma que Respira) — **RECOMENDAÇÃO UMA**

### Concept rationale

Logo é uma **forma orgânica abstrata** que existe em estado de **respiração visual** — animação de breathing IS the brand. Inspiração: bauhaus + Brian Eno's Generative Art + Tegan and Sara's pulsing logo.

Diferença radical: D3 **não tem um logo "estático"** como verdade primária. O logo verdadeiro do Anipis É a animação. Versões estáticas são **fotogramas** da animação. Isso é radical, ownable, e alinha 100% com motion principle "respirar" (`05-MOTION-PRINCIPLES.md`).

### Geometric construction

- **Símbolo (estado 1 — inspirando)**: forma **gota-pétala**, construída com 2 curvas de Bezier simétricas
  - Altura total: H
  - Largura no ápice de inspiração: 0.7H
  - Ponto inferior fechado, terminação superior arredondada (raio 0.15H)
  - Stroke: 0 (forma sólida com fill)
- **Símbolo (estado 2 — expirando)**: mesma forma mas largura comprime para 0.5H, altura permanece H
- **Animação**: oscilação contínua estado 1 ↔ estado 2, ciclo 8s (4s inspira, 4s expira), ease-breath
- **Wordmark**: "anipis" em General Sans Medium, lowercase, **estático** (apenas símbolo respira)
- **Posicionamento**: símbolo à esquerda, wordmark à direita, gap = 0.5H

### Color usage

- **Primary**: fill em `--anipis-500` (coral primary) sobre `--bg-page` cream
- **Wordmark**: `--neutral-800`
- **Dark mode**: fill `--anipis-400` (mais luminoso) sobre `--bg-dark-primary`
- **Mono**: fill `--neutral-900` ou `--neutral-50` (preto/branco soft)
- **Special variant**: em splash screen, fill pode ser gradient radial sutil (centro mais claro, bordas tom base)

### Variants

Iguais a D1/D2 (primary horizontal / stacked / symbol / wordmark / reversed / mono), **+ um adicional crítico**:

| Variant | Uso | Specs |
|---------|-----|-------|
| **Animated primary** | Header site (uma vez por sessão), splash, app launch | Animação ciclo 8s, depois para no estado neutro |
| **Static keyframe** | Favicon, app icon, materiais impressos | Estado estático = momento intermediário (largura 0.6H, altura H) — o "neutro" entre inspira/expira |

### Scale rules

| Tamanho | Variant | Animation? |
|---------|---------|-----------|
| 16-23px | Static keyframe symbol only | Não anima (perde clareza em <24px) |
| 24-79px | Static keyframe ou primary | Anima apenas em hover/load |
| 80px+ | Primary ou animated | Animação loop permitida (cuidado: pode distrair) |
| Print | Static keyframe | Nunca anima (óbvio, mas registra) |

### Animação specs

```css
@keyframes anipis-breathe {
  0%   { transform: scaleX(0.71); }  /* inspiring */
  50%  { transform: scaleX(0.5); }   /* expiring */
  100% { transform: scaleX(0.71); }  /* back to inspiring */
}

.anipis-logo-symbol {
  animation: anipis-breathe 8s cubic-bezier(0.45, 0, 0.15, 1) infinite;
  transform-origin: center;
}

@media (prefers-reduced-motion: reduce) {
  .anipis-logo-symbol {
    animation: none;
    transform: scaleX(0.6); /* neutral keyframe */
  }
}
```

### Do / Dont

| ✅ Do | ❌ Dont |
|-------|---------|
| Ciclo respiração 8s sincronizado com `--motion-ambient` token | Não acelerar (≤6s = ansiogênico) |
| `prefers-reduced-motion` → estado estático neutro | Não desabilitar animação no light mode mas ativar no dark (deve ser consistente OS preference) |
| Fill solid color (não gradient em símbolos pequenos) | Não adicionar stroke ao símbolo |
| Em hero: animação loop. Em UI repetida: estado estático | Não animar logo em todas as telas (cognitive load) |
| Pause animação durante crisis banner (sinaliza atenção) | Não usar bouncy easing |

### Crítica honesta de Uma

D3 é **conceitualmente o mais radical** dos 3. Risco: time dev/Figma vai resistir ("logo animado é complicado de manter"). Resposta: motion já é signature do produto — logo refletir isso é coerência, não custo extra. Outro risco: forma gota-pétala pode ler como "gota de água" (cliché de hidratação). Mitigação: razões geométricas precisas (0.7H/0.5H) diferenciam de drop genérico.

**Por que recomendo D3:**
1. Alinhamento total com `05-MOTION-PRINCIPLES.md` (respiração como brand)
2. Ownable real — nenhum concorrente BR/global tem logo respirando como brand-primary
3. Funciona em 16px (versão estática keyframe é clara)
4. Reduced-motion gracefully degrada
5. Conceitualmente honesto ao produto: Anipis é "espaço que respira"

---

## Comparação rápida das 3 direções

| Critério | D1 Mythological | D2 Aurora Arc | D3 Breathing Form |
|----------|-----------------|---------------|-------------------|
| Diferenciação visual | Média (espirais existem) | Alta (poucos arcos em wellness BR) | **Muito alta (logo animado é raro)** |
| Risco cliché | Médio (místico new-age) | Médio (logo seguradora) | Baixo (forma + animação ownable) |
| Funciona 16px | Sim | Sim | Sim (estado keyframe) |
| Coerência com motion principle | Baixa | Média | **Alta — É o motion principle** |
| Custo de produção | Médio | Médio-alto (gradient mgmt) | Alto (animação spec + maintenance) |
| Honesty ao name | **Alta** (etymology grega) | Média (elpis = horizonte é stretch) | Média (respiração = vida = anima OK) |
| Aprovação user provável | Média | Alta (estética familiar) | Incerta (radical) |

---

## Próximos passos

1. **User Breno decide D-UX-01**: D1 / D2 / D3 / Frankenstein (mix)
2. Após decisão, Uma propõe a próxima fase:
   - Se D1 ou D2: enviar prompt para Flux com 3 variantes visuais
   - Se D3: prototipar animação em CodePen + spec Figma + render Flux do estado keyframe
3. Logo final entra como asset em `apps/serenity-ai/public/brand/` + `figma-tokens-v2.json` com `logo.svg` path token
4. Splash + favicon + app icon (PWA + iOS + Android) gerados a partir do final

**Custo Flux estimado** (após aprovação direction): 8-12 renders ~$2.40-3.60.

---

*Uma — UX Design Expert · 2026-05-16*
*"Forma sem motion é foto. Forma com motion é vida."*
