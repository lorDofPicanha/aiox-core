---
project: tocks-custom · site v5 (recomeço do zero)
deliverable: TOCKS LUZ — Design System (claro, cinematográfico Aston + configurador Porsche)
art_direction: Luz quente editorial-cinematográfica — luxo claro
fonts_decision: PENDENTE (site usa Playfair Display + Montserrat · brand book diz Libre Caslon + Poppins)
brand_source: tokens REAIS extraídos de tockscustom.com.br (design-md, 28/Mai)
references: AATHER (whispered luxury white linen) · Apple (precise canvas, vivid product) · Farfetch (gallery wall of luxury) · Aston Martin (cinematic) · Porsche (configurator)
created: 2026-05-28
status: FOUNDATION — aguarda decisão de fonte → build
---

# TOCKS LUZ — Design System

> **Correção de rota:** o site da Tocks é **CLARO**, não dark. Este sistema substitui o "Atelier Noir" (descartado). Base = tokens reais extraídos do site + referência Aston Martin (cinematográfico) + configurador estilo Porsche em cada mesa.

> **Uma frase:** loja de luxo CLARA e arejada onde mesas de madeira maciça aparecem como esculturas sob luz natural, contra um canvas branco-quente; tipografia editorial carrega a voz, um único acento caramelo aponta, e cada mesa tem um **configurador em etapas** (estilo Porsche) com preço dinâmico.

---

## 0. Proveniência (tokens reais, não inventados)

Extraídos de `tockscustom.com.br` via skill `design-md` (28/Mai) → `docs/projects/tocks/v4-fantastic/brand-extract/`:
- Arquétipo: **polaris-friendly (89%)** — saturação muito baixa, espaçamento muito arejado, sombras suaves, superfícies em gradiente.
- Cor dominante real: **`#fff`** (150 usos) → canvas claro. Acento real: **`#cfa47d` caramelo** (58 usos). Tinta: **`#1f1d2d`** navy-carvão (43 usos).
- Fontes no site: **Playfair Display + Montserrat** (Google Fonts). Botões: **radius 30px (pill)**.

---

## 1. Direção de arte

**Luz quente editorial-cinematográfica.** Não é o "silêncio escuro" — é luz de galeria de dia. Canvas branco-quente, produto como único herói (full-bleed, bem iluminado, à la Aston Martin: 1 mesa = 1 cena), tipografia editorial grande, e **um único acento caramelo** usado como pontuação. O verde profundo (feltro de bilhar) entra raramente como natural. Movimento lento e caro. Restrição "whispered luxury" (AATHER) + clareza de produto (Apple) + cinema (Aston) + **configurador (Porsche)**.

### Princípios
1. **Claro sempre.** Canvas branco/branco-quente. NUNCA dark. (corrige o erro Atelier Noir)
2. **Produto é o herói.** Foto full-bleed, bem iluminada, isolada. UI recua.
3. **Um acento, caramelo.** `#cfa47d` aponta/sublinha/confirma. ~1 por viewport. Verde profundo só como natural raro.
4. **Tipografia carrega a voz; UI carrega o trabalho.** Serif display = emoção/escala; sans = clareza/números.
5. **Espaço é luxo.** Margens generosas, ritmo lento (o site real já é "very-roomy").
6. **Cada mesa se configura.** O configurador estilo Porsche é o coração da conversão consultiva.
7. **Lento é caro.** Easing desacelerado, nada estala.

---

## 2. Tokens de cor (CSS vars — reais do site)

```css
:root{
  /* canvas / superfícies — CLARO */
  --canvas:            #FFFFFF;   /* fundo principal (150 usos no site) */
  --canvas-warm:       #FAF8F4;   /* branco-quente p/ seções alternadas */
  --surface:           #F5F5F5;   /* cartões / superfície elevada (20 usos) */
  --surface-2:         #EFEFEF;

  /* tinta / texto */
  --ink:               #1F1D2D;   /* texto primário navy-carvão (43 usos) — NÃO preto puro */
  --ink-secondary:     #62606C;   /* secundário (15 usos) */
  --ink-muted:         #8A8A8A;   /* metadados, captions */

  /* acento da marca — caramelo */
  --accent:            #CFA47D;   /* acento real (58 usos) */
  --accent-hover:      #DBB48E;
  --accent-active:     #B88E69;   /* caramelo escuro (real no site) */
  --accent-soft:       rgba(207,164,125,0.14);
  --on-accent:         #1F1D2D;   /* texto sobre fill caramelo */

  /* naturais secundários (billiard heritage) */
  --green-deep:        #0B502F;   /* verde feltro profundo (5 usos) */
  --green-sage:        #657A57;   /* sálvia (4 usos) */

  /* UI / utilidade */
  --wa-green:          #25D366;   /* WhatsApp (CTA concierge) */
  --hairline:          rgba(31,29,45,0.12);
  --border:            #E8E8E8;   /* divisores suaves (Ghost Gray) */
  --shadow-sm:         0 2px 5px rgba(0,0,0,.05);
  --shadow-md:         0 4px 12px rgba(0,0,0,.10);
  --shadow-lg:         0 10px 30px rgba(0,0,0,.12);   /* suave, nunca pesada */
  --shadow-product:    0 30px 60px -20px rgba(31,29,45,.18);
}
```

**Contraste (WCAG):** `--ink #1F1D2D` em `--canvas` ≈ 14:1 (AAA). `--ink-secondary` ≈ 6.5:1 (AA). `--accent #CFA47D` em branco ≈ 1.9:1 → **caramelo NÃO serve para texto pequeno**; usar caramelo só em fills (com `--on-accent` escuro), bordas, ícones grandes, underlines. Texto/links de ênfase usam `--ink` ou `--accent-active #B88E69` (≈ 3.2:1, ok p/ large/bold). `--green-deep` em branco ≈ 9:1 (AAA) — bom p/ texto de ênfase natural.

---

## 3. Tipografia — DECISÃO PENDENTE

Conflito real: o **site** usa **Playfair Display + Montserrat**; o **brand book (MANIFEST)** diz **Libre Caslon Text + Poppins**. Recomendação: como você pediu "extrair e usar o site", default = Playfair Display + Montserrat — mas Libre Caslon é mais distintivo (menos genérico). **Você decide.**

```css
:root{
  --font-display: "Playfair Display", Georgia, serif;  /* OU "Libre Caslon Text" */
  --font-ui:      "Montserrat", system-ui, sans-serif;  /* OU "Poppins" */
}
```
| Token | Uso | Tamanho desktop | Peso | Line-height |
|---|---|---|---|---|
| display | Hero | clamp(2.75rem, 8vw, 6rem) | 600/700 | 1.05 |
| h1 | Abertura de página | clamp(2.25rem, 5vw, 3.75rem) | 600 | 1.1 |
| h2 | Seção | clamp(1.75rem, 4vw, 2.5rem) | 500 | 1.15 |
| h3 | Nome de produto | 1.5rem | 500 | 1.2 |
| lead | Intro | 1.25rem | 400 (Montserrat) | 1.6 |
| body | Corpo | 1.0625rem | 400 | 1.7 |
| label/eyebrow | Kicker uppercase | 0.75rem | 600 | tracking 0.18em |
| price | Preço | 1.375rem | 600 tabular-nums | 1.1 |

- Eyebrows uppercase Montserrat tracking 0.18em em `--ink-muted` ou `--accent-active`.
- Serif display para emoção; itálico do serif só em acentos.

---

## 4. Espaço, raio, sombra, motion

- **Espaçamento:** base 4px. Escala 4/8/12/16/24/32/48/64/96/128. Seções desktop 96–128px (arejado, como o site real).
- **Raio:** botões/CTA = **pill 30px** (assinatura real Tocks). Cartões/inputs = 6–10px. Imagem de produto = 8px ou 0 (editorial).
- **Sombra:** suave (`--shadow-*` acima). Produto ganha `--shadow-product` longo e suave. Nada pesado/escuro.
- **Motion:** durações 200/320/600/1000ms; easing `cubic-bezier(.16,1,.30,1)`; reveals staggered no scroll; hero settle (scale 1.03→1). `prefers-reduced-motion` desliga tudo.
- **Superfície:** seções alternam `--canvas` ↔ `--canvas-warm`; gradientes suaves permitidos (o site usa); evitar bloco branco 100% chapado sem profundidade (usar foto, hairline ou warm).

---

## 5. Componentes (destaque para os 2 críticos)

### 5.1 Header / nav
Transparente sobre hero claro (links `--ink`, logo símbolo azul/caramelo) → ao rolar, fundo `rgba(255,255,255,.9)` + blur + hairline. Links Montserrat uppercase 14px. Carrinho + Concierge (WhatsApp).

### 5.2 Hero cinematográfico (estilo Aston, no claro)
- Full-bleed: foto/vídeo da mesa bem iluminada sobre canvas claro; **1 mesa = 1 cena**. Headline serif grande (ancorada à esquerda, assimétrica), eyebrow caramelo `ATELIÊ · ITAJAÍ-SC`, 1 palavra em itálico-serif acento. CTA duplo: pill caramelo "Ver a coleção" + ghost "Configurar a sua".
- Settle scale no load; metadata de canto `EDIÇÃO · SOB ENCOMENDA`.

### 5.3 Product card
Foto full-bleed sobre `--surface`, nome serif, linha (eyebrow), preço. Hover: imagem scale 1.05 + hairline caramelo + "Ver mesa →" sobe. Grid editorial quebrado (não uniforme).

### 5.4 ⭐ CONFIGURADOR estilo PORSCHE (por mesa) — componente-chave
O que faltava. Em **cada** página de produto, um configurador em **etapas**, com **preview ao vivo (foto-swap)** e **preço dinâmico**:

| Etapa | Escolha | Dados |
|---|---|---|
| 1 · Tampo / Madeira | 10 madeiras (swatches reais) | troca foto-preview + ajusta preço |
| 2 · Estofado / Tecido | 16 tecidos (swatches reais, scroll-snap) | idem |
| 3 · Acabamento / Metais | cromado · dourado · preto fosco | +/- preço |
| 4 · Acessórios | taqueira, iluminação, kit jogo, tampo-jantar | add-ons com preço |
| 5 · Resumo | composição + **preço total dinâmico** + parcelamento | CTA "Adicionar ao carrinho" + "Finalizar com especialista" (WhatsApp com a config no texto) |

- **Stepper** horizontal (desktop) / vertical (mobile) com indicador caramelo na etapa ativa; navegação ⟵ ⟶.
- **Preview ao vivo:** painel grande mostra a mesa; foto-swap por seleção (não 3D). Onde não houver render composto, mostra swatch grande + silhueta + label honesto "Prévia de acabamento".
- **Preço dinâmico:** `tabular-nums`, atualiza por etapa; resumo final fixo.
- **Estado:** Zustand (já no stack). **Payload** da config vai pro carrinho e pro lead WhatsApp.
- **A11y:** swatches = `radiogroup` (`role="radio"`), teclado, nome acessível, seleção = anel caramelo + check + label (nunca só cor).
- Tools: **21st.dev magic** gera os componentes (madeira/tecido picker, step navigator), **Stitch** gera a tela base, **image-studio** compõe previews/fotos faltantes.

### 5.5 PDP, Carrinho/Checkout, Footer, Atelier
PDP = galeria + info fixa + configurador (5.4) + specs + craft full-bleed + relacionados. Checkout 2 colunas (stepper + resumo fixo + caminho concierge WhatsApp). Footer claro com colunas. Atelier = editorial claro (history Skara→Tocks, ofício).

---

## 6. Anti-padrões (específicos)
1. **Nada de dark canvas.** Claro sempre (corrige Atelier Noir).
2. **Caramelo é pontuação**, não pintura espalhada; nunca caramelo em texto pequeno (contraste falha).
3. **Sem grid uniforme** — editorial quebrado.
4. **Não esconder o configurador** — é o coração; precisa estar óbvio em cada mesa.
5. **Sem preço em DE/POR/urgência** — luxo afirma o preço uma vez.
6. **Produto nunca miniaturizado** above-the-fold — full-bleed, bem iluminado.
7. **Usar os MCPs** (Refero/Stitch/21st/image-studio/design-studio) — não construir do zero quando há ferramenta.

---

## 7. Plano de build (com MCPs)
1. **Refero** → DESIGN.md de referências (AATHER puxado; Aston/Porsche não estão no catálogo → usar conhecimento + capturas).
2. **Stitch** → gera telas base (home cinematográfica clara, PDP, configurador).
3. **21st.dev magic** → componentes do configurador (pickers, stepper, preço dinâmico) em React/Tailwind.
4. **image-studio** → fotos dos 5 modelos sem foto (ark, curve, 3 pebolim) + previews de acabamento.
5. **design-studio** → validar contraste/cor/fontes.
6. Mockups claros + configurador → revisão → build Next.js.

*Substitui Atelier Noir. Base: tokens reais Tocks (claro/caramelo/navy) + Aston (cinema) + Porsche (configurador) + AATHER/Apple (luxo claro contido).*
