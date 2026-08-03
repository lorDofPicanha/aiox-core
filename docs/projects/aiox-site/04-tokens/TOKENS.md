# Fase 3 — Tokens, assets e bibliotecas

**Data:** 2026-07-26 · **Projeto:** TALOS
**Método:** extração **determinística** do CSS real capturado na Fase 1b. Zero LLM, zero print,
zero "olhei a referência e achei que era assim".
**Script:** `04-tokens/extract-tokens.cjs` · **Saída bruta:** `04-tokens/tokens-raw.json`

> **Por que não reusei a skill `design-md`:** ela faz URL → DESIGN.md de **um** site usando
> `claude -p` como camada de cognição — pool metered (Constitution Art. VII). Aqui o objetivo é o
> **cruzamento** de 4 capturas locais para achar o que o tier inteiro concorda, e custom properties
> CSS são texto literal no arquivo. Extrator determinístico é mais barato, mais exato e responde
> outra pergunta.

---

## 1. Base de extração

| Ref | CSS | Custom props | Tema | bg real | Altura | Seções |
|---|---:|---:|---|---|---:|---:|
| clerk | 841 KB | 1.755 | claro | `rgb(247,247,248)` | 7.616px | 12 |
| liveblocks | 626 KB | 1.442 | escuro | `rgb(0,0,0)` | 10.107px | 26 |
| trigger | 455 KB | 869 | escuro | `rgb(18,19,23)` | 11.337px | 49 |
| railway | 350 KB | 555 | escuro | `rgb(19,17,28)` | 12.180px | 7 |
| resend | *(captura parcial)* | — | escuro | `rgb(0,0,0)` | 12.273px | 15 |

**4 de 5 são escuros.** A direção visual escolhida está alinhada com o tier.

---

## 2. A descoberta que muda o wireframe: densidade

Cruzando altura de página × número de seções × tamanho do H1, aparecem **dois modelos opostos**
dentro do mesmo tier:

| Modelo | Ref | H1 | H2 | Seções | Altura | Leitura |
|---|---|---:|---:|---:|---:|---|
| **Editorial largo** | resend | **96px** | 56px | 15 | 12.273px | Tipografia enorme, poucas seções, muito ar |
| | railway | 54px | 36–40px | **7** | 12.180px | Ainda mais radical — 7 seções |
| **Denso informativo** | trigger | 60px | 30px | **49** | 11.337px | Muita informação, tipografia menor |
| | liveblocks | 64px | 20–52px | 26 | 10.107px | Meio-termo |

**Consequência para o TALOS:** o modelo **editorial largo** é o correto, e não é preferência estética
— é consequência da situação. Com portfólio vazio há **pouca informação real para mostrar**. Dizer
pouco em tipografia de 90px lê como confiança; dizer pouco espalhado em 49 seções lê como vazio.

→ Mantém-se as 9 seções do wireframe, mas com **escala tipográfica grande** e respiro generoso.
Densidade alvo: ~1.200–1.400px de altura por seção.

---

## 3. Consenso do tier (aparece em 2+ referências)

### 3.1 Pesos — todos os 4 usam 400 / 500 / 600
`700` em 3 refs · `800` e `900` em 2 (railway, trigger) · `100` presente mas raro.
→ **Corpo e UI: 400/500/600. Display: 700/800.** Nada abaixo de 400.

### 3.2 Raio — consenso mais forte da extração
| Valor | Refs |
|---|---|
| **`.25rem` (4px)** | **4/4** |
| `.375rem` (6px) | 3/4 |
| `.5rem` (8px) | 2/4 |
| `.75rem` (12px) | 2/4 |
| `9999px` (pill) | 2/4 |

→ Escala: **4 · 6 · 8 · 12 · full**. Nada de 20px+ — o tier é de cantos discretos.

### 3.3 Espaçamento — base 4
`1px · 2px · 4px · 6px · .5rem(8) · .75rem(12) · 1rem(16)` aparecem em 2–3 refs cada.
→ Escala **4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128**.

### 3.4 Motion — os números reais
| Duração | Refs |
|---|---|
| **`.2s`** | **4/4** |
| `.15s` | 3/4 |
| `.1s` | 3/4 |
| `.3s` | 3/4 |
| `.5s` | 3/4 |
| `1s` | 4/4 (loops/ambiente) |

| Easing | Refs |
|---|---|
| `ease-out` | 4/4 |
| `linear` | 4/4 (loops) |
| `cubic-bezier(.4, 0, .2, 1)` | 2/4 |

→ **Micro-interação: 100–200ms `ease-out`.** Transição de seção: 300–500ms. Loop: 1s `linear`.
Isso **confirma quantitativamente** a régua restritiva definida no wireframe — o tier não usa
animação lenta e dramática. Nada acima de 500ms exceto loop ambiente.

---

## 4. Achado de cor: superfície escura **nunca** é `#000` puro

Cores de superfície reais extraídas:

| Ref | Superfície |
|---|---|
| trigger | `#121317` · `#1a1b1f` · `#1c1e21` · `#272a2e` |
| clerk | `#131316` · `#191c21` · `#212126` · `#2f3037` |
| liveblocks | `#161618` · `#222222` |
| railway | `#08070c` · `#13111c` |

`#000000` aparece muito na contagem, mas quase sempre dentro de `rgba(0,0,0,α)` — **sombra**, não
superfície. Todos os fundos reais ficam entre `#08` e `#27`, com **leve viés azul/neutro**.

Isso separa "parece profissional" de "parece amador": amador usa `#000` puro no `body`.

### 4.1 Acento — cada ref escolhe **um** saturado

| Ref | Acento |
|---|---|
| trigger | `#a8ff53` (lime) + `#7c87f7` |
| liveblocks | `#0057ff` (azul) + `#7a51ec` |
| clerk | `#5de3ff` (ciano) |
| railway | `#d97757` (terracota) |

**Decisão para o TALOS: bronze.** Duas razões, uma temática e uma estratégica:
- Talos é o autômato **de bronze**. O acento conta a história do nome.
- O tier de dev-tools está saturado de lime, ciano e azul. Bronze/âmbar diferencia sem sair do tier
  — e railway já provou que um acento quente funciona nesse contexto.

---

## 5. TOKEN SET — TALOS

### 5.1 Cor

```css
:root {
  /* superfície — nunca #000 */
  --bg:          #0C0D10;   /* body */
  --surface:     #16181C;   /* card, painel */
  --surface-2:   #1D2025;   /* elevado, hover */
  --rule:        #24272D;   /* borda */
  --rule-2:      #31353C;   /* borda em destaque */

  /* texto */
  --text:        #F2F3F5;
  --text-2:      #A0A4AD;
  --muted:       #6B6F78;

  /* acento — bronze de Talos */
  --bronze:      #E9A23B;
  --bronze-2:    #C9832A;   /* hover/pressed */
  --bronze-dim:  #4A3A1E;   /* fundo de badge */

  /* estado */
  --positive:    #6FCF8B;
  --negative:    #E2695F;
}
```

### 5.2 Contraste — verificado com WCAG 2.1, não estimado

| Par | Ratio | Normal | Large | UI |
|---|---:|---|---|---|
| `--text` sobre `--bg` | **17,5:1** | AAA | AAA | PASS |
| `--bronze` sobre `--bg` | **8,97:1** | AAA | AAA | PASS |
| `--bronze` sobre `--surface` | **8,21:1** | AAA | AAA | PASS |
| `--text-2` sobre `--bg` | **7,78:1** | AAA | AAA | PASS |
| `--muted` sobre `--bg` | **3,86:1** | ❌ **FAIL** | AA | PASS |

> 🔴 **Regra dura:** `--muted` **não pode** ser usado em texto corrido. Só em label ≥18px, bold
> ≥14px, bordas e ícones. Isso é limite de acessibilidade medido, não preferência.

### 5.3 Tipografia

| Papel | Fonte | Fonte no tier |
|---|---|---|
| Display | **Inter Tight** 700/800 | railway |
| Corpo e UI | **Inter** 400/500/600 | clerk, railway |
| Dados, labels, o painel do demo | **Geist Mono** *(ou JetBrains Mono)* | trigger, liveblocks, railway |

Todas gratuitas. `Inter` e `Geist` confirmados disponíveis no catálogo do `mcp-design-studio`;
`Inter Tight` e `JetBrains Mono` vêm do Google Fonts direto.

**Escala** — derivada dos H1/H2 reais medidos, no modelo editorial largo:

| Token | Desktop | Mobile | Uso |
|---|---:|---:|---|
| `display-xl` | 88px | 44px | H1 do hero |
| `display-l` | 56px | 34px | Abertura de seção |
| `display-m` | 36px | 26px | Subtítulo de seção |
| `title` | 24px | 20px | Card |
| `body-l` | 18px | 17px | Parágrafo de destaque |
| `body` | 16px | 16px | Corpo |
| `label` | 13px | 13px | Mono, uppercase, tracking `.14em` |
| `micro` | 11px | 11px | Mono, HUD/meta |

### 5.4 Forma e ritmo

```css
--r-sm: 4px;  --r-md: 6px;  --r-lg: 8px;  --r-xl: 12px;  --r-full: 9999px;

/* espaço — base 4 */
--s-1: 4px;   --s-2: 8px;   --s-3: 12px;  --s-4: 16px;
--s-6: 24px;  --s-8: 32px;  --s-12: 48px; --s-16: 64px;
--s-24: 96px; --s-32: 128px;

--max-w: 1180px;
```

### 5.5 Motion

```css
--t-micro: 150ms;  --e-out: cubic-bezier(0, 0, .2, 1);
--t-fast:  200ms;  --e-std: cubic-bezier(.4, 0, .2, 1);
--t-mid:   300ms;
--t-slow:  500ms;  /* teto — nada passa disso, exceto loop */
--t-loop:  1s;     /* linear, só ambiente */
```

---

## 6. Bibliotecas e assets

| Necessidade | Fonte | Como |
|---|---|---|
| **Ícones** | **Lucide** via Iconify (200k+ ícones) | `mcp__mcp-design-studio__iconify_search` · SVG direto de `api.iconify.design/lucide/{nome}.svg` — **baixar e embutir**, não hotlinkar |
| **Fontes** | Google Fonts | `Inter`, `Inter Tight`, `JetBrains Mono` · Geist via Vercel |
| **Fotos** | Unsplash | `mcp__mcp-design-studio__unsplash_search` — **§7 exige foto real do founder**, Unsplash só para ambiente |
| **Componentes** | 21st.dev Magic | Gerar componente já no estilo do projeto |
| **Cor / contraste** | design-studio | `contrast_check` obrigatório em todo par novo |

Ícones já validados como existentes: `lucide:workflow` · `lucide:bot` · `lucide:bot-message-square`.

⚠️ **Nada de CDN externo.** Fontes e ícones baixados para o repositório — CSP e performance.

---

## 7. Estado e pendências

**Pronto:**
- [x] Extração determinística de 4 CSS reais (2,3 MB de CSS analisados)
- [x] Consenso do tier em peso, raio, espaço, easing e duração
- [x] Token set completo com contraste **verificado** por WCAG
- [x] Baseline de screenshot — já veio nas capturas (`pages/*/screens/desktop-*.png`, `mobile-*.png`)
- [x] Bibliotecas de ícone e fonte identificadas e testadas

**Falta antes da Fase 4:**
- [ ] Founder aprovar o acento **bronze** (é a decisão de gosto da fase — as 4 falhas do Bretda foram aqui)
- [ ] Confirmar suposição **A1** do wireframe: o demo da §3 é atendimento/qualificação de lead
- [ ] Resend: recapturar `/pricing` — a captura quebrou em link não-HTML na primeira tentativa
- [ ] INPI (fora do caminho crítico — troca de nome não invalida nenhum token)
