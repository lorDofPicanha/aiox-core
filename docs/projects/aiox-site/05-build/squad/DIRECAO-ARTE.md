# DIREÇÃO DE ARTE — Talos

**Build 4.** Referência única escolhida pelo founder: `https://leanware.co/`
**Data:** 2026-07-28 · **Fase do workflow:** F2 (sistema visual) → habilita F4 (mockup)
**Captura de origem:** `docs/projects/aiox-site/02-references/inputs/leanware/`

> Os três builds anteriores foram rejeitados por parecerem genéricos. A causa registrada em
> `WORKFLOW-SITES.md` Parte 1 é sempre a mesma: **não houve artefato intermediário entre a
> referência e o CSS**. Este documento é esse artefato. Nenhum valor aqui foi escolhido por gosto:
> ou saiu do CSS capturado, ou saiu de ferramenta, e cada um traz de onde veio.

---

## 0. Como este documento foi produzido

### 0.1 Roteamento — quem respondeu o quê

| Tier | Especialista | O que decidiu | Onde está |
|---|---|---|---|
| **0 — Fundação** | `@marty-neumeier` | O veredito bronze × verde. É pergunta de **posicionamento**, não de gosto: qual cor pertence à categoria e qual pertence à marca | Parte 3 |
| **2 — Craft** | `@brad-frost` | Camada de tokens, escala de elevação, spec de componente. Atomic Design aplicado à captura | Partes 1 e 4 |
| **2 — Craft** | `@aaron-draplin` | Comportamento da marca no nav + a regra de glifo/SVG (Parte 5, defeito nº 3) | Partes 4 e 5 |
| **1 — Master** | `@joe-mcnally` → `@peter-mckinnon` | Onde entram as 6 fotografias reais de `03-assets/` e como elas são graduadas para caber no sistema escuro | Parte 4, §6 |

**Não roteado, com motivo:** `@chris-do` (preço não vai ao site — decisão travada em `CONTEXT.md` T4);
`@paddy-galloway` (não há YouTube neste escopo); `@dave-malouf` (é um site, não uma operação de design a escalar).

### 0.2 Ferramentas que rodaram de verdade

| Ferramenta | Como foi chamada | O que entregou |
|---|---|---|
| **Captura em disco** | leitura direta de `pages/home/page.html` (259,7 KB) | 107.607 chars de CSS **inline**, 0 stylesheet externo — extração de token com linha de origem |
| **`mcp-design-studio`** | os *handlers reais* de `dist/providers/color-provider.js` e `contrast-provider.js`, carregados como módulo ES e invocados diretamente | `contrast_check`, `color_convert`, `color_palette`, `color_shades`, `color_harmony` — 60+ chamadas |
| **`ui-ux-pro-max`** | `python .claude/skills/ui-ux-pro-max/.claude/skills/design/scripts/cip/search.py "<q>" --all` | estilos *Dark Premium*, *Industrial Raw*, indústria *Technology* — usados no veredito da Parte 3 |
| **`fontTools` 4.62.1** | parse dos dois `.woff2` reais da captura | eixos variáveis, tabelas GSUB/GPOS, cobertura de cmap — base da Parte 1.2 e do defeito nº 3 |

🔴 **Honestidade sobre ferramentas.** A superfície MCP não está disponível para um subagente; o
servidor `mcp-design-studio` foi carregado como biblioteca e os **mesmos handlers** que a tool MCP
expõe foram invocados. Não é reimplementação — é o mesmo caminho de código.
`refero` não está declarado no `.mcp.json` deste projeto e **não foi usado**.
`mcp-image-studio`, Stitch, nano-banana-2 e `@21st-dev/magic` não entraram em caminho crítico
(WORKFLOW-SITES Parte 2). **Nada foi gerado por IA de imagem neste documento.**

### 0.3 Divergências entre a documentação e o disco (verificadas hoje)

`RETOMAR-AQUI.md` cita artefatos que **não existem**. Registrado para não retrabalhar em cima de fantasma:

| Citado em `RETOMAR-AQUI.md` | Estado real |
|---|---|
| `04-tokens/DESIGN-LEANWARE.md` | **ausente** |
| `05-build/mockup/talos-leanware.html` | **ausente** |
| `05-build/mockup/talos-leanware-direction.html` | **ausente** |
| `05-build/shots/lw/*` | **ausente** |
| `05-build/mockup/APROVADO.md` | **ausente** — gate F4 segue bloqueado, como esperado |
| `02-references/inputs/leanware/` | **existe**, 1,03 MB, íntegro |

Consequência: **este documento é o primeiro artefato de F2 desta rodada que existe em disco.**
O mockup de F4 ainda precisa ser produzido.

### 0.4 Duas coisas que este documento decide contra a referência

O founder disse *"faça um site igual este"*. Copiar valor errado não é fidelidade, é preguiça.
Duas coisas do leanware **reprovam medição** e por isso não são herdadas — ambas justificadas
com número na Parte 2:

1. `--color-lw-ink-3` (`#fafafa6b`) mede **3,96:1** e reprova WCAG AA para texto normal. É usado em
   legenda e em rótulo de métrica. **Corrigido para `#fafafa7d`.**
2. `--color-lw-ink-4` (`#fafafa47`) mede **2,39:1** e é usado como ícone de "não" na matriz
   comparativa — reprova até o piso de 3:1 de componente de interface.
   **Corrigido para `#fafafa5c` e proibido em texto.**

---

## PARTE 1 — SISTEMA VISUAL

### 1.1 Cor

#### A arquitetura da referência, medida

Toda a escala de superfície do leanware é **um único matiz** com saturação de 5–8%,
variando só a luminosidade:

| token leanware | hex | HSL medido (`color_convert`) | origem |
|---|---|---|---|
| `--color-lw-dark` | `#0e0e10` | `hsl(240, 7%, 6%)` | `page.html:110 @52683` |
| `--color-lw-dark-surf` | `#131316` | `hsl(240, 7%, 8%)` | `page.html:110 @52683` |
| `--color-lw-dark-card` | `#18181c` | `hsl(240, 8%, 10%)` | `page.html:110 @52736` |
| `--color-lw-dark-card-hover` | `#1e1e22` | `hsl(240, 6%, 13%)` | `page.html:110 @52736` |
| `--color-lw-dark-raised` / `--border-dark` | `#232328` | `hsl(240, 7%, 15%)` | `page.html:110 @52736` |
| `--color-lw-dark-top` / `--border-light` | `#2e2e33` | `hsl(240, 5%, 19%)` | `page.html:110 @52736` |

**Matiz 240° = azul.** A escala inteira tem *undertone frio* — o que é coerente com um acento verde
(153°, a 87° de distância: vizinhança harmônica) e **incoerente com bronze** (36°, a 204° de
distância: quase complementar, ou seja, tensão máxima num campo que ocupa a página inteira).

#### A convergência que resolve o problema

Peguei os **degraus de luminosidade medidos no leanware** (6, 8, 10, 13, 15, 19) e os reemiti com
saturação zero via `color_convert`. O resultado bate **exatamente** com a paleta que o
`ui-ux-pro-max` devolve para o estilo **Dark Premium** — o estilo cujo acento declarado é
metálico (`#D4AF37`, ouro):

| L medido no leanware | neutro `hsl(0,0%,L)` | `ui-ux-pro-max` › Dark Premium |
|---|---|---|
| 6% | **`#0f0f0f`** | `#0F0F0F` ✅ **idêntico** |
| 10% | **`#1a1a1a`** | `#1A1A1A` ✅ **idêntico** |
| 24% | **`#3d3d3d`** | `#3D3D3D` ✅ **idêntico** |

Duas fontes independentes — a referência escolhida pelo founder e o banco de estilos da skill —
chegam ao mesmo lugar quando se remove o matiz. **A escala de superfície do Talos não é invenção
minha: é a interseção das duas.**

#### Superfícies — tokens finais

Matiz 0°, saturação 0%. Bronze passa a ser **o único elemento cromático da página**.

| token | hex | origem |
|---|---|---|
| `--bg` | `#0f0f0f` | L=6% do leanware (`page.html:110 @52683`) neutralizado · = Dark Premium `#0F0F0F` |
| `--surf` | `#141414` | L=8% do leanware neutralizado |
| `--card` | `#1a1a1a` | L=10% do leanware neutralizado · = Dark Premium `#1A1A1A` |
| `--card-hover` | `#212121` | L=13% do leanware neutralizado |
| `--border` | `#262626` | L=15% do leanware neutralizado (`--color-lw-border-dark`) |
| `--border-strong` | `#303030` | L=19% do leanware neutralizado (`--color-lw-border-light`) |

> ⚠️ **Isto reverte a temperatura "nogueira" da rodada R2** (`--bg: #0d0a06`, medido em
> `hsl(34, 37%, 4%)`). Motivo: 37% de saturação quente sob um acento quente derruba a leitura de
> *metal* e devolve *madeira* — que é o território do Bretda/Tocks, não do Talos.
> Fundo neutro + acento metálico é a receita do Dark Premium, e é o que a referência faz
> estruturalmente. **Decisão do founder se quiser manter a nogueira; a alternativa medida está na
> Parte 3.5.**

#### Tinta — a correção de acessibilidade

O leanware usa `#fafafa` com quatro níveis de alfa. Dois reprovam. Resolvi por busca do **alfa mínimo
que passa no pior fundo em que o token é usado**, com `contrast_check` a cada passo:

| token | valor | alfa | contraste (pior caso) | veredito | origem |
|---|---|---|---|---|---|
| `--ink` | `#fafafa` | 100% | 16,67:1 (sobre `--card`) | AAA | `--color-lw-ink`, `page.html:110 @53365` |
| `--ink-2` | `#fafafaa8` | 66% | 7,14:1 (sobre `--border`) | AAA | `--color-lw-ink-2`, idem |
| `--ink-3` | **`#fafafa7d`** | 49% | **4,62:1** (sobre `--border`) | AA | 🔧 corrigido de `6b` (3,96:1, **reprova**) |
| `--ink-4` | **`#fafafa5c`** | 36% | **3,15:1** (sobre `--border`) | UI 3:1 · **nunca texto** | 🔧 corrigido de `47` (2,39:1, **reprova**) |

O alfa mínimo absoluto para AA sobre `--bg` é `0x75`; escolhi `0x7d` para que **o mesmo token passe
em todas as cinco superfícies** sem exceção por contexto. Um token, uma regra.

#### Bronze — a família derivada

`#E9A23B` já estava aprovado (`RETOMAR-AQUI.md` › decisões travadas) e mede
`hsl(36, 80%, 57%)`. Os derivados **não foram inventados**: são as relações do leanware, medidas e
reaplicadas.

| relação medida no leanware | aplicada ao bronze | resultado |
|---|---|---|
| `accent hsl(153,60,53)` → `accent-light hsl(153,55,46)` (−5 sat, −7 L) | `hsl(36,75%,50%)` | `--bronze-hover: #df9320` |
| `accent` → `accent-2 hsl(155,61,44)` (+2 h, +1 sat, −9 L) | `hsl(38,81%,48%)` | `--bronze-2: #de9517` |
| texto no fill = **matiz do acento, S 100%, L 5%** → `#001a0d` | `hsl(36,100%,5%)` | `--on-bronze: #190f00` |

> **A regra do `#001a0d` foi provada, não suposta.** Reemiti `hsl(150,100%,5%)` pelo
> `color_convert` e saiu `#00190d` — 1 unidade de verde de diferença para o literal `#001a0d`
> do leanware. Arredondamento. A regra é essa.

`color_shades` do design-studio, rodado independentemente sobre `#E9A23B`, devolve
hover `#dc8e18` — a 2 unidades do `#df9320` derivado da referência. **Ferramenta e referência
concordam;** fico com o valor derivado da referência, porque preserva a relação e não só o número.

| token | valor | uso | origem |
|---|---|---|---|
| `--bronze` | `#E9A23B` | eyebrow, CTA mono, número, fill do primário, foco | aprovado (decisão travada) |
| `--bronze-hover` | `#df9320` | hover de link e de fill | derivado (acima) |
| `--bronze-2` | `#de9517` | base do gradiente do display | derivado (acima) |
| `--on-bronze` | `#190f00` | texto sobre fill bronze | derivado (acima) |
| `--bronze-wash` | `#E9A23B0d` (5%) | fundo da coluna "Talos" na matriz | `.cmp-matrix__cell--us{background:#3ecf8e0d}` `page.html:108 @29482` |
| `--bronze-soft` | `#E9A23B1a` (10%) | fundo de chip e de ícone | `--color-lw-accent-soft:#3ecf8e1a` `page.html:110 @52859` |
| `--bronze-ring` | `#E9A23B38` (22%) | anel de ícone, borda de card ativo | `--color-lw-accent-ring:#3ecf8e38` idem |
| `--bronze-glow` | `#E9A23B66` (40%) | `box-shadow` do botão, `text-shadow` de micro-sinal | `--color-lw-accent-glow:#3ecf8e66` idem |

**Um token cromático a menos que a referência:** o leanware declara `--color-lw-red: #dc2626` e
`--color-lw-gray-500` — o vermelho porque tem formulário com validação, o cinza porque tem tema
claro. O Talos não tem nenhum dos dois nesta home. Token que não é usado é ruído.
(`--color-lw-gray-500`, aliás, mede **3,99:1** e reprovaria AA se fosse usado em texto.)

---

### 1.2 Tipografia

#### As duas fontes são as da referência — e estão no disco

`page.html:110 @112844` e `@113141` declaram três `@font-face`, todos self-hosted, `font-display: swap`:

- **Inter Variable** — `assets/fonts/InterVariable.woff2`, 99,6 KB
- Inter Variable Italic — declarada, **não capturada** (nunca usada na home)
- **JetBrains Mono** — `assets/fonts/JetBrainsMono.woff2`, 36,7 KB

Ambas foram abertas com `fontTools` e auditadas. Confirmação cruzada: `fonts_search` do
design-studio lista as duas em sua base curada (`Inter` em sans-serif, `JetBrains Mono` em
monospace). **Zero invenção tipográfica: as fontes vieram da captura e a ferramenta confirma.**

#### O que a auditoria dos arquivos revelou

| medição | Inter Variable | JetBrains Mono |
|---|---|---|
| versão | 4.001 (`git-9221beed3`) | 2.211 |
| eixos variáveis | **`opsz` 14→32** · `wght` 100→900 | `wght` 100→800 |
| features GSUB | 37 (`cv01`–`cv13`, `ss01`–`ss08`, `zero`, `tnum`, `case`, `salt`, `calt`, `locl`…) | **4** (`calt`, `ccmp`, `frac`, `locl`) |
| features GPOS | `kern`, `cpsp` | **nenhuma** |
| glifos / cmap | 901 / 343 codepoints | 371 / 206 codepoints |
| acentos PT-BR | **cobertura completa** | **cobertura completa** |
| `R$ € % º ª — – … “ ” ‘ ’ « »` | **cobertura completa** | **cobertura completa** |
| `→ ← ↑ ↓ ✓ ✔ ↗ ≈ ≠` | 🔴 **ausentes** | 🔴 **ausentes** (e `★` também) |

Três consequências diretas — todas verificáveis, nenhuma opinativa:

1. **O eixo `opsz` está no arquivo e a referência nunca o usa.** Busca por `opsz`,
   `font-optical-sizing` e ocorrências relevantes de `font-variation-settings` no `page.html`:
   **zero**. Uma linha de CSS entrega um Inter de 62px com juntas mais finas e espacejamento
   mais apertado que o Inter padrão — **a 0 KB de custo, porque o eixo já está no arquivo que a
   própria referência serve.** É o diferencial tipográfico mais barato disponível neste projeto.

2. **`font-feature-settings:"tnum" on,"lnum" on` é código morto na referência.** Aparece 4× em
   `page.html` (`.hero-byline__score` `@21901`, `.trust-strip__value`, `.lw-mono` `@114467`,
   `.case-card__metric-value` `@118523`) e **todas as 4 recaem sobre `var(--font-mono)`** — cuja
   GSUB não tem `tnum` nem `lnum`, e cuja GPOS está vazia. Medi as larguras de avanço de
   `0-9 A-C a-c`: **um único valor (600)**. A fonte já é tabular por construção. A declaração não
   faz nada. Já a Inter **tem** `tnum` (50 substituições) — e é justamente onde o leanware **não**
   aplica.

3. **A seta `→` e a estrela `★` da referência renderizam em fonte de fallback.** `→` aparece 9× e
   `★` 10× como **caractere de texto literal** no markup (`page.html:121`, ex.: `Read case study
   <span aria-hidden>→</span>` `@216844`). Nenhuma das duas fontes servidas contém `U+2192`;
   `U+2605` falta na JetBrains Mono, que é a família aplicada às estrelas. O navegador cai para
   `system-ui`/mono do sistema — **forma, peso e alinhamento mudam entre Windows, macOS e Android**.
   Regra dura para o Talos na Parte 5, defeito nº 3.

#### Escala tipográfica — tokens finais

Base: os tokens `--text-*` declarados em `page.html:110 @53738`. Duas correções.

| token | tamanho | line-height | tracking | peso | origem |
|---|---|---|---|---|---|
| `--t-display` | **62px** (3,875rem) | 1.08 | −.035em | 800 | `--text-display`, `@53738` |
| `--t-h2` | 44px (2,75rem) | 1.06 | −.035em | 800 | `--text-h2` · medido no render: 44px em 6 H2 |
| `--t-h3` | 32px (2rem) | 1.10 | −.02em | 800 | `--text-h3` |
| `--t-h4` | 21px (1,3125rem) | 1.30 | — | 700 | `--text-h4` |
| `--t-h5` | 18px (1,125rem) | 1.40 | — | 700 | `--text-h5` · = `.service-card__title` |
| `--t-body-lg` | 17px (1,0625rem) | 1.70 | — | 400 | `--text-body-lg` |
| `--t-body` | 15px (0,9375rem) | 1.70 | — | 400 | `--text-body` — 61 usos, o corpo real do site |
| `--t-body-sm` | 14px (0,875rem) | 1.60 | — | 400 | `--text-body-sm` |
| `--t-caption` | 13px (0,8125rem) | 1.40 | — | 600 | `--text-caption` |
| `--t-label` | 11px (0,6875rem) | 1.20 | **.16em** | 700 | `--text-label` — **mono, caixa alta** |
| `--t-micro` | 10px (0,625rem) | 1.20 | .06em | 600 | `--text-micro` — **mono, caixa alta** |

**Correção 1 — o teto é 62px e é token.** A referência **declara** `--text-display: 3.875rem`
(62px) e depois **ignora**: `.homepage-hero__headline` (`page.html:108 @19504`) trava
`font-size:64px; line-height:1; letter-spacing:-.04em` na unha. O `intel.json` confirma o H1
renderizando a **64px**. Token declarado e não usado é como o build vira inconsistente com o
tempo. No Talos o hero **usa o token**.
Isto também derruba o teto de **112px** da rodada R2: com a régua do leanware, 62px é o teto, e é
o que mantém o card de prova visível na dobra (restrição dura nº 3 de `ARQUITETURA-SECOES.md` §6.3).

**Correção 2 — `--t-h1` (52px) é eliminado.** Na referência ele só existe para o H2 da seção de CTA
(medido a 52px no `intel.json`). Um degrau inteiro de escala para uma ocorrência não se justifica:
o CTA final usa `--t-display` com um `clamp` para baixo. **11 degraus em vez de 12.**

**Degraus responsivos do display** (herdados verbatim de `page.html:108 @19504`):
`≤1100px → 48px` · `≤640px → 40px`. São os únicos breakpoints tipográficos da referência e
funcionam; não invento outros.

#### As três declarações que separam este Inter do Inter genérico

```css
/* 1. o eixo óptico que a referência ignora — 0 KB, o eixo já está no arquivo */
html { font-optical-sizing: auto; }

/* 2. números que alinham em coluna: aplicar na Inter, onde a feature EXISTE
      (matriz comparativa, contador de horas do §5, células de compromisso) */
.tabular { font-feature-settings: "tnum" 1; }

/* 3. desambiguação de l / I — 6 e 11 substituições verificadas na GSUB.
      Recomendado para PT-BR ("planilha", "Il"), mas é decisão de gosto do founder. */
:root { font-feature-settings: "cv05" 1, "cv08" 1; }   /* OPCIONAL — ver Parte 6 */
```

E a **remoção**: `font-feature-settings:"tnum" on,"lnum" on` sai de todo seletor que usa
`--font-mono`. Nenhuma das duas features existe na JetBrains Mono. Confirmado em GSUB **e** GPOS.

**Regra de par.** Inter = tudo que se lê como frase. JetBrains Mono = tudo que se lê como
*rótulo de máquina*: eyebrow, CTA de card, número medido, carimbo de tempo, meta de rodapé.
Essa divisão é da referência e é o que faz a página parecer instrumento em vez de folheto —
**é o ativo que o Talos mais deve preservar**, porque o produto dele é máquina.

#### Licença e empacotamento

Inter e JetBrains Mono são **SIL Open Font License 1.1** — redistribuição self-hosted permitida.
🔴 **Não empacotar os `.woff2` da pasta da referência.** Baixar do upstream e gerar subset próprio
**incluindo `U+2192 U+2190 U+2191 U+2193 U+2605 U+2713 U+2248 U+2260`** — o que fecha o defeito nº 3
na origem, além da regra de SVG. Conferir o `LICENSE` do upstream antes do deploy.

---

### 1.3 Forma

#### Raio — o conjunto que a referência de fato usa

Sete tokens declarados (`page.html:110 @54812`), contagem de uso real das classes:

| token | valor | usos | veredito |
|---|---|---|---|
| `--radius-card` | 16px | **20** | ✅ mantém |
| `--radius-btn` | 10px | **12** | ✅ mantém |
| `--radius-card-lg` | 20px | **11** | ✅ mantém |
| `--radius-card-sm` | 14px | 5 | ✅ mantém |
| `--radius-pill` | 28px | 5 | ⚠️ só se houver pill |
| `--radius-badge` | 12px | **1** | ❌ elimina |
| `--radius-card-xl` | 22px | **1** | ❌ elimina |

E há um furo: `.service-card` (`page.html:108 @25205`) hard-coda `border-radius:18px` — valor que
**não existe** entre os sete tokens. `.faq-item` (`@30713`) usa 14px, `.differentiator-card__media`
(`@26791`) usa 16px, `.cmp-scroll` (`@27181`) usa 18px. A referência tem quatro raios de card
convivendo sem regra.

**Sistema Talos — 4 raios, com regra semântica:**

| token | valor | quando |
|---|---|---|
| `--r-sm` | 6px | ícone pequeno, chip, marca de 22px (`.marquee__mark`, `.faq-item__icon-wrap`) |
| `--r-btn` | 10px | botão e input. Único. |
| `--r-card` | 16px | **todo card, sem exceção** — resolve os 14/16/18/20 da referência |
| `--r-panel` | 20px | contêiner que agrupa cards: painel do hero, scroller da matriz, faixa de compromissos |

Regra: **o raio cresce com o nível de agrupamento, nunca com a vontade**. Ícone < botão < card < painel.

#### Borda — o achado estrutural mais importante da referência

Contraste medido entre camadas adjacentes:

| transição | contraste |
|---|---|
| `--bg` → `--surf` | **1,04:1** |
| `--surf` → `--card` | 1,06:1 |
| `--card` → `--card-hover` | 1,08:1 |
| `--card` → `--border` | 1,15:1 |
| `--bg` → `--card` | 1,10:1 |

**A alternância de fundo é praticamente invisível.** O que dá ritmo à página não é o preenchimento —
é o filete de 1px: `border-t border-lw-border-dark` aparece **10 vezes** em `page.html`, uma por
fronteira de seção. `border-lw-border-dark` no total: 24 usos.

> **Regra de forma nº 1 do Talos:** *a estrutura é desenhada com linha de 1px, não com bloco de
> cor.* Quem tentar "melhorar" a separação escurecendo/clareando fundos está resolvendo o problema
> errado e vai empastelar a página. A camada de cor é um sussurro; a batida é o filete.

Bordas: `--border` (`#262626`) em repouso, `--border-strong` (`#303030`) em hover,
`--bronze-ring` (22%) em estado ativo/aberto — exatamente o padrão de
`.faq-item[open]{border-color:var(--color-lw-accent-ring)}` (`page.html:108 @30713`).

#### Botão

De `.homepage-hero__btn` (`page.html:108 @20316`), verbatim:
altura **48px** · padding lateral **22px** (18px em ≤640) · raio **10px** · 15px/700 ·
gap 8px entre rótulo e ícone.

| variante | fundo | texto | borda | extra |
|---|---|---|---|---|
| **primário** | `--bronze` | `--on-bronze` | — | `box-shadow: 0 8px 24px -6px var(--bronze-glow)` |
| primário :hover | `--bronze-hover` | `--on-bronze` | — | — |
| primário :active | — | — | — | `transform: scale(.98)` |
| **secundário** | transparente | `--ink` (600) | 1px `--border-strong` | — |
| secundário :hover | `#ffffff0f` | `--ink` | 1px `--border-strong` | — |

> 🔴 **Isto contraria a regra do Mesh/ORYZO da rodada R2** (*"bronze nunca em fill — é crédito
> editorial"*). As duas réguas não podem valer juntas. **Vale a do leanware neste build**, porque é
> a referência que o founder escolheu e porque o botão é o objeto nº 4 do orçamento de 10 segundos
> da dobra: contorno não carrega esse peso. Contrapartida: **fora do botão primário e da §12,
> bronze é traço, sublinhado e filete — nunca campo.** A Parte 4 respeita isso seção a seção.

#### Superfície de card

De `.lw-card` (`@114151`) e `.service-card` (`@25205`), normalizado:

```
background: var(--card)            border: 1px solid var(--border)       radius: var(--r-card)
padding: 24px                      gap interno: 18px
:hover → background var(--card-hover) · border-color var(--bronze-ring)
transition: border-color .2s var(--ease), background .2s var(--ease)
```

O hover que troca a borda para bronze é o gesto mais característico da referência e o mais barato
de acertar. É também **onde o bronze aparece sem virar campo** — validando a contrapartida acima.

---

### 1.4 Espaço

Tudo medido no CSS da referência. Nenhum número de espaçamento é meu.

| medida | desktop | ≤1100px | ≤640px | origem |
|---|---|---|---|---|
| **padding de seção** | `128px / 64px` | — | `112px / 24px` | `px-6 py-28 md:px-16 md:py-32` — **7 seções** usam esta shell exata |
| **padding do hero** | `96px 64px 120px` | `80px 32px 96px` | `56px 20px 80px` | `page.html:108 @18437` |
| **largura máxima** | `1280px` | — | — | `--max-width-site-wide` (8 usos) · existe também `--max-width-site: 1200px` (9 usos) |
| **grid do hero** | `minmax(0,1fr) 560px`, gap `56px` | 1 coluna, gap `48px` | 1 coluna | `.homepage-hero__inner` `@19121` |
| **faixa de confiança** | `96px 64px` | — | — | `.trust-strip` `@35884` |
| **âncora de scroll** | `scroll-mt-24` = **96px** | — | — | 2 usos — compensa o nav sticky |

**Coluna de texto do hero:** `1280 − 560 − 56 = 664px`. É a medida em que o display de 62px precisa
resolver. Vale escrever no spec porque é ela que decide quantas linhas o H1 ocupa.

**Padrão de shell de seção** — toda seção, sem exceção:

```
<section class="[--bg|--surf] border-t 1px --border  px-6 py-28  md:px-16 md:py-32  scroll-mt-24">
  <div class="mx-auto max-w-[1280px]">
    <eyebrow mono 11px .16em bronze + filete 14×1px>
    <h2 --t-h2>
    <p --t-body-lg --ink-2 max-w-[720px]>      ← opcional
    <conteúdo, margin-top 48px>
```

`margin-top: 48px` entre o cabeçalho e o conteúdo vem de `.cmp-scroll{margin-top:48px}`
(`@27181`) e de `.marquee{margin-top:32px}` (`@32714`) — **48px quando é bloco, 32px quando é faixa**.

**Ritmo vertical do site.** A referência alterna `--bg`/`--surf` só **2 vezes em 11 seções**
(slots 4 e 6). Com 14 slots, o Talos alterna 4 vezes — proporção equivalente. Distribuição na Parte 4.

---

### 1.5 Textura

A referência tem exatamente duas texturas, e nada mais. Nenhuma imagem de fundo, nenhum ruído,
nenhum vídeo.

#### Malha de pontos — 4 instâncias, 4 tamanhos diferentes

| onde | passo | opacidade do ponto | máscara | origem |
|---|---|---|---|---|
| hero | 24px | `rgba(255,255,255,.04)` | linear ↓, 0.6 → 0 em 80% | `@18787` |
| serviços | 32px | `.03` | radial em 50% 30%, 0.8 → 0 em 75% | `@24883` |
| CTA | 24px | `.05` | radial em 50% 50%, 0.7 → 0 em 60% | `@119275` |
| rodapé | 28px | `.035` | linear ↓, 0.45 → 0 em 70% | `@40257` |

Técnica: `radial-gradient(circle, rgba(255,255,255,α) 1px, transparent 1px)` + `background-size` +
`mask-image`. Sem imagem, sem request.

**Correção do Talos: dois passos, não quatro.** 24px (campo próximo: hero, CTA) e 32px (campo médio:
seções de conteúdo). Quatro passos para um mesmo elemento é inconsistência, não riqueza — e
ninguém percebe 28px contra 24px, então o custo do rigor é zero.
Opacidade: **`.04` sobre `--bg`, `.03` sobre `--surf`** (o fundo mais claro precisa de menos ponto).

#### Brilho radial — 4 instâncias

| onde | geometria | cor | origem |
|---|---|---|---|
| hero | elipse 720×460 em `92% -8%` | acento a 4% → 2% → 0 | `@18567` |
| faixa de confiança | círculo em `50% 0%` | acento-soft (10%) → 0 em 45%, `opacity .7` | `@35884` |
| CTA | elipse 700×400 em `50% 50%` | acento-soft → 0 em 65% | `@119079` |
| rodapé | elipse 1200×360 em `50% 0%` | acento-soft → 0 em 70%, `opacity .55` | `@40036` |

**Isto o Talos herda inteiro, trocando verde por bronze.** É o que faz o preto parecer profundo em
vez de chapado, custa 0 KB e sobrevive sem JS. Só uma regra nova: **brilho sempre atrás de
`pointer-events:none` e nunca por cima de texto** — todas as 4 instâncias da referência já fazem isso.

#### 🔴 A matéria-prima: o gate F3 e como ele fecha

`WORKFLOW-SITES.md` F3 exige `03-assets/ ≥ 1,5 MB`. **Estado real medido hoje: 2,2 MB** — 6
fotografias reais do Unsplash, com crédito registrado em `03-assets/CREDITOS.md`, em `.webp`,
duas larguras cada (1920 e 960).

Medi a estatística de cor de cada uma para saber se cabem no sistema:

| foto | RGB médio | HSL médio | L (p2 / mediana / p98) | leitura |
|---|---|---|---|---|
| `ferreiro` | (42,37,27) | **h39 s21% l13%** | 0 / 6 / 54 | 🥇 **já é bronze**. Mediana L=6% = exatamente `--bg` |
| `oficina` | (20,19,17) | h43 s8% l7% | 0 / 0 / 57 | quase preta — vale como campo, não como assunto |
| `esmerilhadeira` | (82,67,62) | h16 s14% l28% | 15 / 23 / 75 | a mais clara e a única com faísca |
| `textura-metal` | (49,50,46) | h65 s4% l19% | 4 / 21 / 28 | plana, neutra — textura de fundo |
| `fabrica` | (38,39,38) | h115 s2% l15% | 9 / 13 / 37 | neutra |
| `placa-metal` | (96,106,106) | **h182 s5% l40%** | 4 / 32 / 87 | 🔴 **ciano — briga com o bronze e é a mais clara** |

**Descoberta que muda a direção:** o `ferreiro` mede `h39 s21% l13%` — matiz a **3° do bronze**
(`h36`) e mediana de luminosidade **idêntica ao fundo do site**. A fotografia da forja não é
decoração pendurada no sistema; ela **é** o sistema, capturado com câmera. Talos é o autômato de
bronze de Hefesto: a forja é a etimologia da marca, não um mood board.

Isto fecha F3 com material real, e resolve a incompatibilidade que `RETOMAR-AQUI.md` declarou
("seguir o leanware e cumprir o gate são coisas incompatíveis"): **incompatíveis eram o leanware e
*ilustração vetorial*. Fotografia de forja cabe nos dois.**

Onde as fotos entram está na Parte 4, §6 — e o handoff de tratamento está na Parte 6.

🔴 **Regra inegociável de uso:** a fotografia é **metáfora de marca, nunca alegação**. Nenhuma
legenda, nenhum `alt`, nenhuma copy pode sugerir que é a oficina do founder, um cliente ou um
projeto. `alt` descreve a cena, ponto. Violar isto é exatamente o que `CONTEXT.md` §3 proíbe.

#### Movimento

| propriedade | valor | evidência |
|---|---|---|
| **easing do sistema** | `cubic-bezier(.16, 1, .3, 1)` | **38 ocorrências** em `page.html` |
| duração padrão | `.2s` | idem |
| duração de sublinhado | `.28s` | `.hero-byline__cite-brand:after` |
| duração de seta | `.22s` | `.hero-byline__arrow` |
| pulso de ponto vivo | `lw-pulse`, 2s / 2,4s, `opacity 1 → .45 → 1` | `@keyframes lw-pulse` `@113401` |
| `prefers-reduced-motion` | **5 blocos** — marquee, byline, pulso | ✅ herdar sem discussão |

⚠️ **Defeito herdado a não repetir:** o `:root` declara `--ease-out: cubic-bezier(0,0,.2,1)` e
`--ease-in-out: cubic-bezier(.4,0,.2,1)` — e **nenhum dos dois é usado**; o que roda é a curva
hard-codada 38 vezes. No Talos: **`--ease: cubic-bezier(.16,1,.3,1)` é token e é o único.**

`html{scroll-behavior:smooth}` (`@58529`) fica **dentro de `@media (scripting: none)`** — com
Lenis no build, as duas suavizações brigam pela posição do scroll (gotcha já registrado em
`RETOMAR-AQUI.md`).

---

## PARTE 2 — CONTRASTE WCAG, CALCULADO

**Método.** Cada linha passou pelo handler `contrast_check` real do `mcp-design-studio`
(WCAG 2.1: luminância relativa sRGB, `(L1+0.05)/(L2+0.05)`). Tokens com alfa foram **compostos
sobre o fundo** antes da medição — sem isso o número não significa nada, e é exatamente o erro que
faz `--ink-3` parecer aceitável no papel. Coluna `composto` mostra o hex resultante.

### 2.1 Auditoria da referência — o que o leanware entrega hoje

| par | fg | composto | fundo | ratio | AA | AAA | UI 3:1 | uso na referência |
|---|---|---|---|---|---|---|---|---|
| ink / dark | `#fafafa` | — | `#0e0e10` | **18,48:1** | ✅ | ✅ | ✅ | H1, H2 |
| ink-2 / dark | `#fafafaa8` | `#a9a9aa` | `#0e0e10` | **8,21:1** | ✅ | ✅ | ✅ | corpo |
| **ink-3 / dark** | `#fafafa6b` | `#717172` | `#0e0e10` | **3,96:1** | ❌ | ❌ | ✅ | legenda, `.small` |
| **ink-3 / card** | `#fafafa6b` | `#777779` | `#18181c` | **3,96:1** | ❌ | ❌ | ✅ | rótulo de métrica |
| **ink-4 / dark** | `#fafafa47` | `#505051` | `#0e0e10` | **2,39:1** | ❌ | ❌ | ❌ | meta de rodapé |
| **ink-4 / raised** | `#fafafa47` | `#5f5f62` | `#232328` | **2,46:1** | ❌ | ❌ | ❌ | ícone "não" da matriz |
| accent / dark | `#3ecf8e` | — | `#0e0e10` | 9,66:1 | ✅ | ✅ | ✅ | eyebrow, link mono |
| accent-2 / dark | `#2bb47a` | — | `#0e0e10` | 7,27:1 | ✅ | ✅ | ✅ | base do gradiente do H1 |
| accent / card | `#3ecf8e` | — | `#18181c` | 8,87:1 | ✅ | ✅ | ✅ | CTA de card |
| `#001a0d` / accent | `#001a0d` | — | `#3ecf8e` | 9,12:1 | ✅ | ✅ | ✅ | texto do botão primário |
| `#001a0d` / accent-light | `#001a0d` | — | `#35b47a` | **6,90:1** | ✅ | ❌ | ✅ | **botão em hover — perde AAA** |
| **gray-500 / dark** | `#6b7280` | — | `#0e0e10` | **3,99:1** | ❌ | ❌ | ✅ | `--color-brand-muted` |
| border-dark / dark | `#232328` | — | `#0e0e10` | 1,23:1 | — | — | — | borda (decorativa, ok) |
| border-light / dark | `#2e2e33` | — | `#0e0e10` | 1,43:1 | — | — | — | borda hover (decorativa, ok) |

**Placar da referência: 5 pares reprovam AA em uso de texto e 1 reprova o piso de 3:1 de ícone.**
Não é sítio inacessível — é sítio com uma escala de tinta calibrada no olho. Como diz a restrição
nº 7 de `ARQUITETURA-SECOES.md` §6.3: *não herdar esse erro*.

### 2.2 Sistema Talos — todo par em uso

| par | fg | composto | fundo | ratio | AA | AAA | UI 3:1 | uso |
|---|---|---|---|---|---|---|---|---|
| ink / bg | `#fafafa` | — | `#0f0f0f` | **18,36:1** | ✅ | ✅ | ✅ | display, H2, H3 |
| ink / surf | `#fafafa` | — | `#141414` | 17,65:1 | ✅ | ✅ | ✅ | H2 em faixa alternada |
| ink / card | `#fafafa` | — | `#1a1a1a` | 16,67:1 | ✅ | ✅ | ✅ | título de card |
| ink-2 / bg | `#fafafaa8` | `#aaaaaa` | `#0f0f0f` | **8,25:1** | ✅ | ✅ | ✅ | corpo, subhead |
| ink-2 / surf | `#fafafaa8` | `#acacac` | `#141414` | 8,12:1 | ✅ | ✅ | ✅ | corpo em faixa alternada |
| ink-2 / card | `#fafafaa8` | `#aeaeae` | `#1a1a1a` | 7,84:1 | ✅ | ✅ | ✅ | corpo de card |
| ink-2 / card-hover | `#fafafaa8` | `#b0b0b0` | `#212121` | 7,42:1 | ✅ | ✅ | ✅ | corpo em card sob hover |
| ink-2 / border | `#fafafaa8` | `#b2b2b2` | `#262626` | **7,14:1** | ✅ | ✅ | ✅ | célula da matriz — **pior caso** |
| ink-3 / bg | `#fafafa7d` | `#828282` | `#0f0f0f` | **4,99:1** | ✅ | ❌ | ✅ | legenda, meta |
| ink-3 / surf | `#fafafa7d` | `#858585` | `#141414` | 4,99:1 | ✅ | ❌ | ✅ | legenda em faixa alternada |
| ink-3 / card | `#fafafa7d` | `#888888` | `#1a1a1a` | 4,91:1 | ✅ | ❌ | ✅ | rótulo de card |
| ink-3 / card-hover | `#fafafa7d` | `#8b8b8b` | `#212121` | 4,73:1 | ✅ | ❌ | ✅ | rótulo sob hover |
| ink-3 / border | `#fafafa7d` | `#8e8e8e` | `#262626` | **4,62:1** | ✅ | ❌ | ✅ | ícone "não" da matriz — **pior caso** |
| ink-4 / bg | `#fafafa5c` | `#646464` | `#0f0f0f` | 3,24:1 | ❌ | ❌ | ✅ | **só decoração** |
| ink-4 / card | `#fafafa5c` | `#6b6b6b` | `#1a1a1a` | 3,27:1 | ❌ | ❌ | ✅ | **só decoração** |
| ink-4 / border | `#fafafa5c` | `#727272` | `#262626` | **3,15:1** | ❌ | ❌ | ✅ | **só decoração — pior caso** |
| bronze / bg | `#E9A23B` | — | `#0f0f0f` | **8,85:1** | ✅ | ✅ | ✅ | eyebrow, CTA mono, número, foco |
| bronze / surf | `#E9A23B` | — | `#141414` | 8,51:1 | ✅ | ✅ | ✅ | eyebrow em faixa alternada |
| bronze / card | `#E9A23B` | — | `#1a1a1a` | 8,04:1 | ✅ | ✅ | ✅ | CTA de card, ícone |
| bronze / border | `#E9A23B` | — | `#262626` | **6,99:1** | ✅ | ❌ | ✅ | marca na matriz — **pior caso** |
| bronze / bronze-soft | `#E9A23B` | — | `#2f281d`¹ | 6,72:1 | ✅ | ❌ | ✅ | ícone dentro do chip |
| bronze / bronze-wash | `#E9A23B` | — | `#1a1712`¹ | 8,25:1 | ✅ | ✅ | ✅ | coluna "Talos" da matriz |
| bronze-2 / bg | `#de9517` | — | `#0f0f0f` | **7,68:1** | ✅ | ✅ | ✅ | base do gradiente do display |
| bronze-hover / bg | `#df9320` | — | `#0f0f0f` | 7,61:1 | ✅ | ✅ | ✅ | link em hover |
| ink-2 / bronze-wash | `#fafafaa8` | `#aeadab` | `#1a1712`¹ | 7,97:1 | ✅ | ✅ | ✅ | corpo na coluna destacada |
| **on-bronze / bronze** | `#190f00` | — | `#E9A23B` | **8,74:1** | ✅ | ✅ | ✅ | texto do botão primário |
| **on-bronze / bronze-hover** | `#190f00` | — | `#df9320` | **7,51:1** | ✅ | ✅ | ✅ | botão em hover — **mantém AAA** |
| on-bronze / bronze-2 | `#190f00` | — | `#de9517` | 7,59:1 | ✅ | ✅ | ✅ | variação do fill |
| ~~ink / bronze~~ | `#fafafa` | — | `#E9A23B` | **2,08:1** | ❌ | ❌ | ❌ | 🔴 **PROIBIDO** — branco sobre bronze |
| bg / bronze | `#0f0f0f` | — | `#E9A23B` | 8,85:1 | ✅ | ✅ | ✅ | alternativa a `--on-bronze` (ver nota) |
| foco bronze / bg | `#E9A23B` | — | `#0f0f0f` | 8,85:1 | — | — | ✅ | WCAG 2.2 SC 1.4.11 (≥3:1) |
| foco bronze / surf | `#E9A23B` | — | `#141414` | 8,51:1 | — | — | ✅ | idem |
| foco bronze / card | `#E9A23B` | — | `#1a1a1a` | 8,04:1 | — | — | ✅ | idem |
| foco bronze / border | `#E9A23B` | — | `#262626` | 6,99:1 | — | — | ✅ | idem |
| border / bg | `#262626` | — | `#0f0f0f` | 1,27:1 | — | — | — | decorativa — isenta (SC 1.4.11) |
| border-strong / bg | `#303030` | — | `#0f0f0f` | 1,45:1 | — | — | — | decorativa — isenta |
| bronze-ring / card | `#E9A23B38` | `#473821` | `#1a1a1a` | 1,54:1 | — | — | — | decorativa — isenta |

¹ hex composto: `--bronze-soft` 10% sobre `--card` = `#2f281d`; `--bronze-wash` 5% sobre `--surf` = `#1f1b16`;
sobre `--card` = `#1a1712`.

### 2.3 Regras que saem da tabela

1. 🔴 **`--ink-4` nunca carrega texto.** Passa 3:1 (componente de UI) e nada além. Ícone, filete,
   separador, carimbo decorativo. Se precisar ser lido, é `--ink-3`.
2. 🔴 **`--ink` branco nunca vai sobre fill bronze.** 2,08:1 — reprova tudo. Sobre bronze só
   `--on-bronze`.
3. 🔴 **A borda de 1px é decorativa e está isenta de 1.4.11** — mas por isso mesmo **não pode ser o
   único portador de informação**. Estado ativo = borda bronze **+** mais um sinal (ícone, peso,
   fundo `--bronze-wash`).
4. ✅ **O foco passa em toda superfície.** `outline: 2px solid var(--bronze); outline-offset: 2px`,
   herdado de `:focus-visible` (`page.html:110 @58750`). Pior caso 6,99:1 contra o piso de 3:1.
5. ✅ **`--ink-2` é AAA em todas as cinco superfícies** (pior caso 7,14:1). É o token de corpo.
6. ⚠️ **`--ink-3` é AA, não AAA.** Aceitável para legenda e meta; **proibido para parágrafo**.
7. **SC 1.4.1 (uso de cor):** o par sim/não da matriz **não pode** depender só de bronze × cinza.
   Ícone com forma distinta (✓ / ×, ambos SVG) + rótulo textual. Vale para daltonismo e para
   impressão.

### 2.4 O que a tabela diz sobre a escolha do acento

| | verde leanware | bronze Talos |
|---|---|---|
| acento sobre o fundo da página | 9,66:1 | **8,85:1** |
| acento sobre card | 8,87:1 | **8,04:1** |
| texto sobre o fill, em repouso | 9,12:1 | **8,74:1** |
| texto sobre o fill, **em hover** | **6,90:1 — perde AAA** | **7,51:1 — mantém AAA** |

Bronze fica 0,8 abaixo do verde no repouso — e **acima em hover**, que é o único estado onde o
leanware sai do AAA. Os dois são AAA no repouso, com folga de mais de 20% sobre o piso de 7:1.
**Contraste não decide esta escolha.** Quem decide é a Parte 3.

---

## PARTE 3 — VEREDITO: BRONZE OU VERDE

> `@marty-neumeier` · Tier 0. Roteado aqui porque a pergunta *"que cor?"* é, neste caso, a pergunta
> *"a que categoria eu pertenço?"* — e essa é decisão de posicionamento, não de paleta.

### 3.1 A tensão, dita direito

O founder pediu um site **igual** ao leanware. O acento do leanware é `#3ecf8e`. O acento aprovado
do Talos é `#E9A23B`. Copiar a cor é o gesto mais literal de "igual" — e é o único gesto da lista
que **destrói a coisa que o site existe para construir**.

### 3.2 Evidência 1 — o verde é a cor da categoria, e a ferramenta diz isso sozinha

`ui-ux-pro-max`, consulta **`technology software agency`**, resultado nº 1:

```
Industry: Technology
Keywords: tech software saas startup digital
CIP Style: Modern Tech Geometric
Primary Colors: #6366F1 #0EA5E9 #10B981     ← indigo · sky · EMERALD
Mood: Innovative forward-thinking
```

`#10B981` é esmeralda — a mesma família de `#3ecf8e` (h153). **A paleta que a ferramenta devolve
como padrão da indústria "tech/software/saas/startup" já contém o verde do leanware.** Escolher
verde é escolher o valor default da categoria. É a definição operacional de "genérico" — e
"genérico" é literalmente a palavra com que o founder rejeitou os três builds anteriores.

### 3.3 Evidência 2 — o metálico é a cor da direção que já foi travada

`CONTEXT.md` D3 trava a direção visual em **"produto tech moderno — dark elegante"**.
`ui-ux-pro-max`, consulta **`dark technical developer tool bronze accent`**, resultado nº 1:

```
Style Name: Dark Premium              Category: Sophisticated
Primary Colors: #0F0F0F #1A1A1A #D4AF37      ← e #D4AF37 = hsl(46, 65%, 52%), ouro metálico
Secondary Colors: #3D3D3D #FFFFFF
Materials: Dark materials metals glass       Finishes: Matte metallic accents
Best For: Nightlife luxury tech fashion
```

O bronze aprovado, `#E9A23B`, mede `hsl(36, 80%, 57%)` — **mesma família de `#D4AF37`**, 10° de
matiz de distância. E os três neutros do Dark Premium (`#0F0F0F`, `#1A1A1A`, `#3D3D3D`) são
**exatamente** os degraus de luminosidade do leanware neutralizados (Parte 1.1).

Ou seja: a ferramenta descreve, sem saber deste projeto, o sistema
**"escala de cinza do leanware + acento metálico"**. É o Talos.

### 3.4 Evidência 3 — a cor é o nome

Τάλως é **o autômato de bronze** de Hefesto. Não "o autômato". O de bronze.
A cor não ilustra a marca — ela **é** a marca escrita em outro alfabeto. Verde não tem referente
nenhum no nome, na história, no produto ou no argumento.

E há um custo composto: a §6 usa **fotografia de forja** como material de card (Parte 4). Medi o
`ferreiro` em `h39 s21% l13%` — a **3° do bronze**. Com acento verde, a única matéria-prima real do
projeto passa a brigar com o sistema; com bronze, foto e interface são a mesma cor. **A escolha do
acento decide se 2,2 MB de material real entram ou saem do site.**

### 3.5 O que eu tentei medir e não deu — declarado

Tentei quantificar "o verde é o default da categoria" varrendo as 15 referências capturadas em
`02-references/inputs/` atrás do token de acento declarado. **A medição não sustenta a afirmação:**
só **4 das 15** declaram uma custom property com `accent`/`primary`/`brand` no nome (leanware
`#3ecf8e`, liveblocks `#0090ff`, iventions `#d1f3f5`, assembly `rgba(77,74,49,1)`). As demais
resolvem em classe utilitária ou em bundle JS. **Amostra insuficiente — a afirmação estatística
fica fora deste documento.** O argumento de categoria se sustenta na Evidência 2 (ferramenta),
não em contagem que eu não consegui fazer direito.

### 3.6 Veredito

# 🥉 BRONZE `#E9A23B`

**Razão em uma linha:** *o verde é a cor da categoria, o bronze é a cor da marca — e o site existe
para construir marca, não para pertencer à categoria.*

Placar consolidado:

| critério | verde `#3ecf8e` | bronze `#E9A23B` | vence |
|---|---|---|---|
| contraste no repouso (sobre `--bg`) | 9,66:1 | 8,85:1 | verde, sem consequência prática |
| contraste do fill em hover | 6,90:1 (**perde AAA**) | 7,51:1 (**mantém**) | **bronze** |
| distância do default da indústria | **é o default** (`#10B981`) | fora dele | **bronze** |
| aderência ao estilo travado em D3 | — | **é o acento do Dark Premium** | **bronze** |
| referente na marca | nenhum | **o autômato é de bronze** | **bronze** |
| compatibilidade com `03-assets/` real | briga (foto a h39) | **h36 vs h39: 3°** | **bronze** |
| fidelidade literal ao pedido do founder | **é a cor dele** | não é | verde |

Seis critérios a um. O único que o verde ganha sem empate é *fidelidade literal* — e é justamente
onde "igual" e "meu" se separam.

### 3.7 Como o veredito é apresentado ao founder — e como ele é revertido

**"Igual" no leanware é a arquitetura, não a tinta.** O que faz aquele site funcionar é: filete de
1px separando seção, sussurro de fundo, dois brilhos radiais, malha de pontos mascarada, par
sans/mono com rótulo de máquina em caixa alta, display 800 com tracking negativo, card com hover
que acende a borda, botão de 48px com raio 10 e sombra colorida. **O Talos herda os nove.**
A cor é a única variável que a marca não pode delegar à referência.

🔧 **A reversão custa uma linha.** Todo o bronze está em custom properties. Trocar
`--bronze: #E9A23B` por `--bronze: #3ecf8e` (+ os 3 derivados) devolve o leanware em português.
**O mockup de F4 vai com um seletor bronze ↔ verde no canto**, para o founder decidir vendo, não
lendo. Se ele escolher verde, o retrabalho é o arquivo de token — nada da Parte 4 muda.

⚠️ Se o verde vencer, **dois números da tabela mudam** e precisam ser reaplicados:
`--on-bronze` vira `#001a0d` e o hover do botão cai para 6,90:1 (perde AAA — aceitar
explicitamente ou usar `#2db477`, que `color_shades` devolve e ainda não medi).

---

## PARTE 4 — ESPECIFICAÇÃO VISUAL, SEÇÃO A SEÇÃO

Ordem, função e copy vêm de `05-build/squad/ARQUITETURA-SECOES.md` §2.1 — **este documento não
reabre nenhuma das duas**. Aqui está só o visual.

**Ritmo de superfície** (alternância na mesma proporção da referência: 4 em 14):

| slot | seção | fundo | filete superior | textura |
|---|---|---|---|---|
| 0 | Nav | `#0f0f0fb8` + blur | — | — |
| 1 | Hero | `--bg` | — | dots 24px + brilho + foto base |
| 2 | Faixa de verbos | `--bg` | ✅ + inferior | — |
| 3 | O problema | `--bg` | ✅ | — |
| 4 | Casos de uso | **`--surf`** | ✅ | dots 32px |
| 5 | O mapa ao vivo | `--bg` | ✅ | dots 32px |
| 6 | Como funciona | **`--surf`** | ✅ | — (as fotos ocupam o campo) |
| 7 | Quem faz | `--bg` | ✅ | — |
| 8 | Por onde começa | `--bg` | ✅ | dots 32px |
| 9 | Como se compara | **`--surf`** | ✅ | — |
| 10 | Compromissos | `--bg` | ✅ + inferior | brilho radial topo |
| 11 | FAQ | **`--surf`** | ✅ | — |
| 12 | Contato | `--bg` | ✅ | dots 24px + brilho |
| 13 | Rodapé | `--bg` | ✅ | dots 24px + brilho |

---

### §0 Nav

Espelha `.lw-header` (`page.html:110 @39630`) inteiro:
`background: #0f0f0fb8` · `backdrop-filter: saturate(160%) blur(16px)` · `border-bottom: 1px solid
var(--border)` · `sticky top-0 z-50` · padding `12px 24px` (mobile) → `16px 64px` (≥md).

- **Marca à esquerda** — `@aaron-draplin`: a marca do leanware é um wordmark com um glifo `{}`
  encaixado num quadro. O equivalente do Talos é a **cabeça/engrenagem do autômato**, não um
  ícone genérico de robô. Altura `18px` (mobile) → `24px` (md) → `28px` (lg), como a referência.
  🔴 **A marca é SVG com `fill: currentColor`.** No hover ela vai para `--bronze` — o mesmo gesto de
  `.lw-header a:hover{color: lw-accent}`. Sem PNG, sem cor travada.
- **Links centrais** — `--t-body` 15px, `--ink-2`, hover `--ink`.
- **CTA à direita** — botão primário bronze, 48px. É o atalho do visitante já prospectado
  (`ARQUITETURA-SECOES` §1) e **não compete** com o CTA do hero porque está fora do fluxo de leitura.
- **Mobile** — hambúrguer, como a referência (ver `mobile-0.png`).

---

### §1 Hero

Grid de `page.html:108 @19121`: `minmax(0,1fr) 560px`, gap `56px`, `align-items:center`.
Padding `96px 64px 120px` → `80px 32px 96px` (≤1100) → `56px 20px 80px` (≤640).

**Coluna esquerda — o orçamento de 10 segundos:**

| objeto | spec |
|---|---|
| 1 · eyebrow | JetBrains Mono `--t-label` 11px/700/.16em, caixa alta, `--bronze`, precedido de filete `14×1px` bronze. `margin-bottom: 24px`. Copiado de `.lw-eyebrow` `@113454` |
| 2 · **H1** | Inter `--t-display` **62px**/1.08/−.035em/**800**, `--ink`, `text-wrap: balance`, `display:flex;flex-direction:column;gap:4px` (uma linha por `<span>`, como `@19504`) |
| 2b · trecho em destaque | `background: linear-gradient(180deg, var(--bronze) 0%, var(--bronze-2) 100%)` + `background-clip: text`. Técnica exata de `.homepage-hero__headline-accent` `@19786`. **Só uma linha do H1 recebe.** Fallback `color: var(--bronze)` |
| 3 · subhead | 18px/1.55/**500**, `--ink-2`, `max-width: 560px`, `margin-top: 28px` |
| 4 · CTAs | linha `gap:14px`, `margin-top:36px`. Primário bronze `mapear meu processo` + secundário contornado `por onde começa`. Em ≤640: `flex:1 1 auto` (empilham e esticam) |
| 5 · **linha de honestidade** | `margin-top:36px`. Ocupa o slot do selo Clutch. Estrutura de `.hero-byline` `@21317`: filete bronze `18×1px` + texto mono 10,5px/.14em caixa alta em `--ink-3`. **Zero estrela, zero número de terceiro.** Micro-selos: `roda no seu navegador · sem cadastro · resultado em 2 ms` |

🔴 A copy da linha 5 é a frase mais arriscada da página (`ARQUITETURA-SECOES` §6.2) — **gate do
founder**, não decisão de arte. O que a arte fixa é: **mesmo peso visual do selo que ela substitui,
nunca menos**. Se ela ficar mais tímida que o `★★★★★` do leanware, vira desculpa.

**Coluna direita — o painel do mapa (560px):**

`--r-panel` 20px · `border: 1px solid var(--border)` · `background: var(--card)` · sem sombra.
Mostra o **entregável real** do `mapear.ts`: etapas classificadas, soma de horas, painel
"a máquina por dentro" com o tempo medido.

> 🔴 **Onde este projeto ganha da referência, e por que isso não pode ser desperdiçado.**
> O painel do leanware é `<div class="hero-chat" data-lw-placeholder="hero-chat" role="img"
> aria-label="A virtual cursor types three questions into a chat composer...">` (`page.html:121
> @163763`). Três fatos que estão no markup dele, não na minha opinião: (a) o atributo se chama
> **`data-lw-placeholder`** — a própria referência o classifica como placeholder; (b)
> **`role="img"`** — ele se declara à tecnologia assistiva como **uma imagem**, não uma interface;
> (c) tem `<div class="thinking">` com três `<i>` — **um indicador de "pensando" falso**, com as
> respostas já hard-codadas em `<span class="tok">`.
> O painel do Talos roda de verdade, em ~2 ms, sem rede e sem chave.
> **Mesmo slot, mesma composição, credibilidade oposta — e é a vantagem mais barata que este
> projeto tem.** O spinner falso que a referência usa é exatamente o que `ARQUITETURA-SECOES` §5
> proíbe. Não copiar o gesto por simetria visual.

**Camadas de fundo do hero** (`pointer-events:none`, nesta ordem, de baixo para cima):

1. `fotos/textura-metal-1920.webp`, `object-fit:cover`, **`opacity: .06`**, `mask-image:
   linear-gradient(180deg, #000 0%, transparent 70%)` — dá grão real onde a referência tem vazio.
2. brilho: `radial-gradient(ellipse 720px 460px at 92% -8%, #E9A23B0a 0%, #E9A23B05 50%, transparent 78%)`
   — geometria verbatim de `.homepage-hero__bg` `@18567`.
3. malha: `radial-gradient(circle, #ffffff0a 1px, transparent 1px)`, passo **24px**,
   `mask-image: linear-gradient(180deg, #0009, transparent 80%)` — `@18787`.
4. cena 3D (`TalosCore.tsx`), no terço direito, `ssr:false`.

🔴 **Restrições duras herdadas de `ARQUITETURA-SECOES` §6.3, repetidas aqui porque são visuais:**
nada revelado depois de 500 ms · o 3D nunca precede nem atrasa o H1 · o topo do painel visível em
**1366×768** · em mobile o painel começa no máximo **120px** abaixo da borda · ordem de corte quando
estourar: eyebrow, depois CTA secundário — **nunca o subhead, nunca o painel**.

---

### §2 Faixa de verbos

Estrutura de `.marquee` (`page.html:109 @32714`): filete de 1px **em cima e embaixo**,
fundo `--bg`, `padding: 4px 0`, item com `padding: 24px 0; margin-right: 56px`,
degradês laterais de **120px** para dentro (`linear-gradient(90deg, var(--bg), transparent)`).

- Antes dela, o rótulo: 22px/600/−.01em em `--ink-2` (`.client-logos__heading` `@32488`);
  18px em ≤640. `margin-top: 32px` até a faixa.
- Verbos em JetBrains Mono `--t-label`, caixa alta, `--ink-3`; hover → `--ink`.
  Marca de 22px com raio `--r-sm` 6px ao lado, borda `--border` → `--bronze-ring` no hover, com
  ponto interno que vai a `--bronze` + `box-shadow: 0 0 0 4px var(--bronze-soft)`.
- `animation-play-state: paused` no hover · `prefers-reduced-motion` desliga.

⚠️ **A duração `171s` do leanware não se copia.** Ela é função do comprimento da faixa **deles**.
Duração = `largura_da_track / 40px por segundo`, calculado no build. Copiar 171s com uma faixa mais
curta produz um deslize lento e estranho — é o tipo de detalhe que faz a página parecer montada por
cópia.

---

### §3 O problema

Shell padrão sobre `--bg`. Três cards `lg:grid-cols-3`, gap 24px.

Card: `--card`, `--r-card` 16px, borda `--border`, padding 24px, gap interno 18px.
- **Carimbo** (`22:14` · `3×` · `toda segunda`) — JetBrains Mono `--t-micro` 10px/.06em caixa alta,
  **`--bronze`**, com filete de 1px `--border` embaixo, `padding-bottom: 10px`. É o gesto de
  `.case-card__metric-label` (`@118523`) invertido: lá o rótulo é cinza e o número é acento; aqui
  o carimbo **é** o número.
- Título `--t-h5` 18px/700, `--ink`.
- Corpo `--t-body-sm` 14px/1.55, `--ink-2`. Teto de 25 palavras (restrição de `ARQUITETURA-SECOES` §3).
- **Sem hover.** Estes cards não são clicáveis; borda que acende sem link é mentira de affordance.
- **Frase-ponte** abaixo dos três: `--t-body-lg` 17px, `--ink`, centralizada, `max-width: 720px`,
  `margin-top: 48px`. Único texto do site em 17px fora de subhead — o destaque é a função dela.

---

### §4 Casos de uso por ramo

Shell sobre **`--surf`**, malha de pontos 32px com máscara radial em `50% 30%`
(`.services-dotgrid` `@24883`).

- **Abas** (indústria · comércio · serviços · projeto e obra): JetBrains Mono `--t-label`,
  caixa alta. Inativa `--ink-3`; ativa `--ink` com **filete de 2px `--bronze` embaixo**
  — o mesmo gesto de `.trust-strip__cell[data-first]:before{width:2px;background:accent}` (`@36985`),
  rotacionado. 🔴 A aba padrão renderiza **sem clique** (restrição de `ARQUITETURA-SECOES` §3).
- **Grade de 4 processos**, `md:grid-cols-2 lg:grid-cols-4`, gap 20px.
  Card `--card` / `--r-card` / borda `--border`; hover → `--card-hover` + borda `--bronze-ring`.
- **CTA por processo** — `usar este exemplo`: JetBrains Mono 11px/600/.08em caixa alta,
  `--bronze`, com **seta SVG** que translada `3px` no hover
  (`.service-card__cta` + `.service-card__arrow` `@25205`). É o CTA de maior alavancagem da página;
  os 16 cards são 16 rampas para a §5.

---

### §5 O mapa ao vivo

Shell sobre `--bg`, malha 32px. **A seção que carrega o site** — e a única que ganha um painel
`--r-panel` de largura total (`max-width: 1280px`), não uma grade de cards.

| elemento | spec |
|---|---|
| entrada | `textarea` sobre `--card`, borda `--border`, `--r-btn` 10px, 15px/1.7. Foco: `outline 2px --bronze, offset 2px`. **Placeholder em `--ink-3`** (4,91:1) — nunca `--ink-4` |
| botão | primário bronze, 48px |
| etapa · automatizável | filete esquerdo `2px --bronze`, fundo `--bronze-wash`, ícone ✓ SVG em `--bronze` |
| etapa · parcial | filete esquerdo `2px --border-strong`, fundo `--card`, ícone ◑ SVG em `--ink-2` |
| etapa · fica com você | filete esquerdo `2px --border`, fundo `--card`, ícone SVG em `--ink-3` |
| etapa · **"não li"** | **tracejado** `1px dashed --border-strong`, sem preenchimento, rótulo `--ink-3` |
| total de horas | JetBrains Mono, **44px/600/−.03em**, `--bronze`, com `.tabular` (`tnum` na Inter não se aplica: aqui é mono, já tabular). Tamanho de `.trust-strip__value-num` (`@38263`) |
| sufixo | 20px/500, `--ink-3`, alinhado pela **baseline** (`align-items: baseline`) |
| premissa da conta | `--t-caption` 13px, `--ink-3`, logo abaixo do número |
| painel "a máquina por dentro" | mono `--t-micro` 10px, `--ink-3`, sobre `--surf`, filete `--border`. Mostra o tempo **real** |

🔴 **Três coisas que a arte não pode "melhorar"** (`ARQUITETURA-SECOES` §4.3): nenhum delay
artificial · nenhum spinner · etapa não reconhecida vale 0 minuto e é marcada como tal. O painel
mostrar `~2 ms` **é** o argumento; disfarçar isso de "processando…" destrói a única prova do site.
Se `2 ms` parecer pouco impressionante, o problema é de copy, não de motion.

**Diferenciação obrigatória:** a distinção entre os três estados **não pode depender só de cor**
(SC 1.4.1). Filete + ícone de forma distinta + rótulo textual. Três sinais.

---

### §6 Como funciona — 🖼️ onde entram as fotografias

Shell sobre **`--surf`**. Três cards em `lg:grid-cols-3`, gap 24px.

Este é o slot em que o leanware usa três ilustrações AVIF de ~11 KB
(`discovery-and-build`, `boutique-by-design`, `fixed-shapes-fixed-pricing`) dentro de
`.differentiator-card__media` (`page.html:108 @26791`):

```
aspect-ratio: 3 / 2   ·   border-radius: 16px   ·   overflow: hidden
background: var(--dark-surf)   ·   border: 1px solid var(--border-dark)
img { width:100%; height:100%; object-fit:cover }
```

**Troca 1:1 — mesma caixa, matéria-prima real no lugar de diagrama vetorial:**

| passo | foto | por quê |
|---|---|---|
| 1 · escopo fechado antes | `placa-metal` | superfície plana, marcada, medida — é a mesa de trabalho |
| 2 · construção | `ferreiro` | 🥇 `h39 s21% l13%` — matiz a 3° do bronze, mediana de L igual ao fundo |
| 3 · entrega e manutenção | `esmerilhadeira` | a única com faísca; encerra a sequência com energia |

Sobram `oficina` (campo escuro para o rodapé) e `fabrica` + `textura-metal` (base do hero e reserva).

**Grade obrigatória para as três** (handoff `@peter-mckinnon`, Parte 6):
matiz unificado em `36° ± 8` · saturação `≤ 18%` · mediana de L entre `10%` e `20%` ·
`p98` de L abaixo de `70%` (nada de estourar branco num sistema onde o branco é `--ink`) ·
🔴 `placa-metal` **precisa** ser rotacionada de `h182` (ciano) para o quente — é a única que hoje
briga com o acento · vinheta de 12% para casar com o `--r-card` · `srcset` 960/1920 · `loading="lazy"`.

🔴 **`alt` descreve a cena e nada mais.** "Bigorna e martelo numa forja" — nunca "nossa oficina",
nunca "projeto entregue". `CONTEXT.md` §3.

Abaixo da mídia: título `--t-h5` 18px/700 `--ink`; corpo `--t-body-sm` 14px/1.55 `--ink-2`.
Card sem hover — não é link.

---

### §7 Quem faz

Shell sobre `--bg`. Duas colunas `minmax(0,1fr) 420px`, gap 56px — eco do grid do hero, fechando
a página em rima com a abertura.

- **Retrato** — `--r-card` 16px, borda `--border`, `aspect-ratio: 4/5`. **Sem foto, a coluna não
  renderiza** e o texto ocupa a largura total. Nunca placeholder cinza com silhueta: dá exatamente
  o sinal de "não estabelecido" que a seção existe para desmentir.
- Nome `--t-h3` 32px/800/−.02em `--ink`. Bio `--t-body-lg` 17px/1.7 `--ink-2`.
- **Links externos** (LinkedIn, GitHub) — botão secundário contornado, `target="_blank"`, com
  ícone SVG de link externo. 🔴 **Campo vazio não renderiza o botão** — comportamento já
  implementado e que deve sobreviver ao redesenho.
- **Bloco "o que eu já construí"** — lista mono `--t-caption` 13px em `--ink-2`, com filete
  esquerdo `1px --border`. Formato de nota técnica, não de card de case. A diferença de forma **é**
  a diferença de alegação.

🔴 **Bloqueio real, não de arte:** `lib/perfil.ts` está com `PREENCHER: nome`. Os campos vazios ficam
**visíveis na página**, de propósito. Nenhuma decisão visual desbloqueia isso.

---

### §8 Por onde começa

Shell sobre `--bg`, malha 32px. Grade `md:grid-cols-2 lg:grid-cols-4`, gap 20px —
o layout de `.service-card` (`@25205`) verbatim.

Card: `--card`, `--r-card`, borda `--border`, padding 24px, gap 18px.
- **Ícone**: caixa `64×64`, `border-radius: 14px`, fundo `--bronze-soft`, borda `--bronze-ring`,
  traço `--bronze` — verbatim de `.service-card__icon-wrap` (`@25663`). Ícone de linha,
  `stroke: currentColor`, `stroke-width: 1.5`.
  ⚠️ Os 14px são o único raio fora dos quatro tokens da Parte 1.3; ficam porque a caixa de ícone é
  categoria própria (nem chip de 6px, nem card de 16px). Se o founder preferir rigor absoluto,
  sobe para `--r-card` 16px — diferença de 2px, custo zero.
- Título `--t-h5` 18px/700/−.01em. Corpo `--t-body-sm` 14px/1.55 `--ink-2`, `flex: 1`
  (rodapés alinhados entre cards de altura desigual).
- CTA mono 11px/.08em caixa alta `--bronze` + seta SVG que anda 3px no hover.
- Hover do card: `--card-hover` + borda `--bronze-ring`.

🔴 **Nenhum valor nesta seção.** Decisão do founder (`CONTEXT.md` T4). Nenhum "a partir de",
nenhuma faixa de preço, nenhum "consulte". A ausência é deliberada e a arte não tenta compensá-la
com selo.

---

### §9 Como se compara

Shell sobre **`--surf`**. Estrutura de `.cmp-scroll` + `.cmp-matrix` (`@27181`, `@27616`):

```
scroller: margin-top 48px · border 1px --border · --r-panel 20px · background --surf
          overflow-x auto · scrollbar-width thin · thumb --border-strong, raio 3px
grid    : minmax(220px, 1.6fr) repeat(4, minmax(140px, 1fr)) · min-width 720px
cabeçalho: padding 18px 14px · background --card · border-bottom + border-left --border
1ª coluna: position sticky; left 0; z-index 1  ← congela o critério na rolagem horizontal
célula   : padding 18px 16px · 14px --ink-2 · border-top + border-left --border
```

**Coluna "Talos"** — `.cmp-matrix__cell--us` (`@29482`) traduzido:
`background: var(--bronze-wash)` (5%) + `border-left: 2px solid var(--bronze-ring)`.
Medido: bronze sobre essa célula = **8,25:1**; `--ink-2` sobre ela = **7,97:1**. Ambos AAA.

**Marcas** (`.cmp-matrix__mark` `@29756`), círculo de 28px:
- sim → fundo `--bronze-soft`, borda `--bronze-ring`, glifo `--bronze`
- não → fundo `--border`, borda `--border`, glifo **`--ink-3`** 🔧
  (o leanware usa `ink-4` aqui e mede **2,46:1** — reprova até o piso de ícone; `--ink-3` dá **4,62:1**)
- 🔴 forma distinta **+ rótulo textual** em `--t-micro`. Nunca só cor (SC 1.4.1).

**CTA `mandar isso pro meu sócio`** — botão secundário contornado, no rodapé do scroller.
É o único CTA da página que serve ao segundo público (o decisor), e a arte não o esconde.

Em ≤720px o scroller rola na horizontal com a primeira coluna congelada. **Não virar acordeão:**
comparação que não deixa ver duas colunas ao mesmo tempo deixa de ser comparação.

---

### §10 Compromissos

Shell sobre `--bg`, **com filete em cima e embaixo** — a única seção do site com as duas bordas
além da §2. É o gesto de `.trust-strip` (`@35884`) e ele marca a seção como *faixa*, não como bloco.

- Brilho de topo: `radial-gradient(circle at 50% 0%, var(--bronze-soft) 0%, transparent 45%)`,
  `opacity: .7` — verbatim de `.trust-strip:before`.
- Padding `96px 64px`.
- **Exatamente 3 células** em `grid-cols-3`, dentro de um contêiner `--r-panel` 20px com fundo
  `--surf` e borda `--border`; `border-left: 1px --border` entre células; `overflow: hidden`.
- A **primeira** célula leva `:before` com `2px` de `--bronze` na aresta esquerda,
  `top:24px; bottom:24px` — verbatim de `.trust-strip__cell[data-first]` (`@36985`).
- Célula: legenda mono 10px/.14em caixa alta `--bronze` + **ponto pulsante** 6px
  (`box-shadow: 0 0 0 3px var(--bronze-soft)`, `animation: lw-pulse 2s`) · valor JetBrains Mono
  **44px/600/−.03em** `--ink` · sufixo 20px/500 `--ink-3` na baseline · descrição
  `--t-body-sm` `--ink-2`.

🔴 **3 células, nunca 4.** Baymard: 1–3 sinais convertem **+23%**; 7+ convertem **−8%**.
Quarto item = tirar um. **E o valor não pode ser número de terceiro** — é compromisso de contrato
(prazo, escopo, manutenção prevista), não avaliação. É a diferença entre esta faixa e a do leanware,
que exibe `5.0 /5` e `24 verified reviews`.

---

### §11 FAQ

Shell sobre **`--surf`**. Coluna única, `max-width: 860px`, centralizada.

`<details>/<summary>` nativos (teclado, leitor de tela e indexação de graça, funciona sem JS —
acerto existente que **não se troca por acordeão em JS**).

De `.faq-item` (`@30713`):
```
item     : border 1px --border · background --card · border-radius 14px
:hover   : border-color --border-strong · background --card-hover
[open]   : border-color var(--bronze-ring)          ← o único bronze da seção
summary  : list-style none · padding 22px 24px · gap 16px · ::-webkit-details-marker{display:none}
pergunta : 17px/600/1.45 --ink
ícone    : 22px, raio 6px, borda --border, fundo --border(raised), cor --ink-2 → gira no [open]
resposta : --t-body 15px/1.7 --ink-2 · padding 0 24px 24px
```

🔴 **A pergunta de preço existe e é respondida sem dar preço.** Fingir que ninguém pergunta é pior
que responder "depende". A arte não a esconde no fim da lista.

---

### §12 Contato

Shell sobre `--bg`, `py-28 md:py-32 lg:py-40` (a única seção com o degrau extra — é o fecho).
Conteúdo **centralizado**, `flex-col items-center text-center` (`.cta-section` do `intel.json`).

Duas camadas de fundo, verbatim de `@119079` e `@119275`:
1. `radial-gradient(ellipse 700px 400px at 50% 50%, var(--bronze-soft) 0%, transparent 65%)`
2. malha 24px, `rgba(255,255,255,.05)`, `mask-image: radial-gradient(ellipse at 50% 50%, #000000b3, transparent 60%)`

- Eyebrow mono bronze · H2 em `clamp(32px, 4vw, 52px)` — reproduz os **52px** que o `intel.json`
  mede no H2 desta seção da referência, sem precisar do token `--t-h1` que a Parte 1.2 eliminou ·
  subhead `--t-body-lg` `--ink-2`, `max-width: 640px`.
- **Formulário de 3 campos**, `max-width: 560px`: input sobre `--card`, borda `--border`,
  `--r-btn` 10px, altura 48px, texto 15px, placeholder `--ink-3`.
  Foco `outline: 2px solid var(--bronze); outline-offset: 2px`.
- 🔴 **O mapa da §5 chega aqui preenchido.** É o furo de conversão nº 1 de `ARQUITETURA-SECOES` §4.4.
  Visualmente: um bloco `--surf` com filete esquerdo `2px --bronze` acima do formulário, mono
  `--t-caption`, com um `editar` discreto que rola de volta para a §5.
- Botão primário bronze, largura total em mobile.
- 🔴 **Sem WhatsApp configurado, o botão avisa** — não finge que enviou. Aviso em `--ink-2` com
  filete `--border-strong` à esquerda; **não usar vermelho** (não existe `--red` no sistema, e o
  estado não é erro do usuário).

---

### §13 Rodapé

`.lw-footer` (`@39831`) traduzido: `padding: 0 24px 28px`, `isolation: isolate`, `overflow: hidden`.

- `__bg` (`z-index:-2`): `radial-gradient(ellipse 1200px 360px at 50% 0%, var(--bronze-soft), transparent 70%)`, `opacity: .55`
- `__dotgrid` (`z-index:-1`): passo **24px** (normalizado dos 28px da referência), `rgba(255,255,255,.035)`, máscara linear 0.45 → 0 em 70%
- `__top`: linha mono 10px/.16em caixa alta em **`--ink-3`** 🔧 (a referência usa `ink-4`, 2,39:1)
  — à esquerda um carimbo (`FLORIANÓPOLIS · GMT-3`) com ponto pulsante bronze; à direita
  `VOLTAR AO TOPO` com seta **SVG** que sobe 2px no hover.
- Colunas de links, `padding: 48px 0 36px`, `max-width: 1280px`. Título de coluna mono
  `--t-micro` 10px `--ink-3`; links `--t-body-sm` `--ink-2` → `--ink` no hover.
- Opcional: `fotos/oficina-960.webp` a `opacity: .04` sob as camadas — é a mais escura das seis
  (mediana L=0) e some naturalmente na base da página.

---

## PARTE 5 — O QUE NÃO SE COPIA DA REFERÊNCIA

Nove itens. Os seis primeiros são **defeitos verificados** (medidos ou lidos no markup dela);
os três últimos são **incompatibilidades de posição** — coisas certas para o leanware e erradas
para o Talos.

### Defeitos verificados

**1 · A escala de tinta, como está.** `--ink-3` mede **3,96:1** e `--ink-4` mede **2,39:1**; o
segundo é usado como ícone e reprova até o piso de 3:1. Corrigidos para `#fafafa7d` (4,62:1 no pior
caso) e `#fafafa5c` (3,15:1, proibido em texto). *Parte 2.1.*
→ **Efeito:** legenda, rótulo de métrica, meta de rodapé e o ícone "não" da matriz passam a ser legíveis.

**2 · `font-feature-settings:"tnum" on,"lnum" on` na fonte mono.** Aparece 4× e recai sempre sobre
JetBrains Mono, cuja GSUB tem só `calt ccmp frac locl` e cuja GPOS está **vazia**. Larguras de
avanço medidas: valor único (600) — já é tabular. **Declaração sem efeito.** A Inter, que tem `tnum`
(50 substituições), é onde a feature nunca é aplicada. *Parte 1.2.*
→ **Efeito:** `.tabular` passa a existir e a ser aplicado onde muda alguma coisa.

**3 · Seta e estrela como caractere de texto.** `→` aparece 9× e `★` 10× literais no markup.
**Nenhuma das duas fontes servidas contém `U+2192`**; a JetBrains Mono (aplicada às estrelas)
não tem `U+2605`. Ambas caem para fonte do sistema — forma, peso e alinhamento mudam entre
Windows, macOS e Android. *Parte 1.2.*
→ 🔴 **Regra Talos:** toda seta, check e marca é **SVG inline com `currentColor`**. Duas razões
somadas: renderização determinística **e** o `transform: translateX(3px)` do hover fica limpo,
o que num glifo de texto embola com o `letter-spacing`. Rede de segurança: incluir
`U+2192 U+2190 U+2191 U+2193 U+2605 U+2713 U+2248 U+2260` no subset próprio.

**4 · Tokens declarados e não usados.** `--ease-out` e `--ease-in-out` existem no `:root` e a curva
que roda é `cubic-bezier(.16,1,.3,1)` **hard-codada 38 vezes**. `--text-display` (62px) existe e o
hero trava **64px** na unha. `--radius-badge` e `--radius-card-xl` têm 1 uso cada; convivem quatro
raios de card diferentes (14, 16, 18, 20) sem regra. *Partes 1.2, 1.3, 1.5.*
→ **Efeito:** `--ease` único, display de 62px vindo do token, 4 raios com regra semântica.

**5 · `html{scroll-behavior:smooth}` global.** Com Lenis no build (decisão de motion de 27/Jul),
as duas suavizações disputam a posição do scroll. *Gotcha já registrado.*
→ **Efeito:** a declaração vai para dentro de `@media (scripting: none)`.

**6 · `--color-lw-gray-500` como `--color-brand-muted`.** Mede **3,99:1** — reprova AA. No leanware
sobrevive porque a home não o usa em texto; herdá-lo é herdar uma armadilha carregada.
→ **Efeito:** o token não existe no Talos. Texto secundário é `--ink-2`/`--ink-3`, medidos.

### Incompatibilidades de posição

**7 · 🔴 Toda a prova social — e ela é 29,7% da página.** Logos de cliente (290px), Recent Work com
quatro clientes nomeados (840px), track record Clutch `5.0 /5 · 24 reviews · 6 yrs` (405px) e
depoimentos (770px) somam **2.305px**. Mais o fecho da dobra: o último objeto do hero é
`★★★★★ 5/5 — VERIFIED ON CLUTCH`. *`ARQUITETURA-SECOES` §0.*
→ **Efeito visual:** não sobra buraco. Os slots são reocupados com objetos de **mesmo peso visual**
— a §2 no lugar dos logos, a §5 no lugar dos cases, a §10 no lugar do track record, a §9 no lugar
dos depoimentos. 🔴 **Regra de arte:** nenhuma dessas substituições pode ser mais tímida que o que
substitui. Faixa de compromissos com peso menor que a faixa Clutch **lê como ausência**, não como
posição — e aí a página inteira admite o que a §6.2 do doc de UX tenta transformar em credencial.

**8 · 🔴 O painel de chat do hero.** `data-lw-placeholder="hero-chat"` · `role="img"` ·
`<div class="thinking">` com respostas hard-codadas em `<span class="tok">`. A referência **declara
no próprio markup** que aquilo é um placeholder e uma imagem. *Parte 4, §1.*
→ **Efeito:** o Talos ocupa o mesmo slot com o `mapear.ts` rodando de verdade. E **o spinner falso
não vem junto** — é exatamente o que `ARQUITETURA-SECOES` §4.3 proíbe. Copiar o gesto por simetria
visual seria trocar a única vantagem do projeto por semelhança.

**9 · A duração `171s` do marquee.** É função do comprimento da faixa deles. Duração = largura da
track ÷ 40px/s, calculada no build. *Parte 4, §2.*

### E o que se copia sem hesitar

Para não ficar só a lista do que não: **filete de 1px como estrutura** (10 fronteiras de seção,
enquanto a diferença de fundo é 1,04:1) · **quatro brilhos radiais** com a geometria exata ·
**malha de pontos mascarada** · **par sans/mono** com o mono reservado a rótulo de máquina ·
**display 800 com tracking −.035em** · **hover de card que acende a borda no acento** ·
**botão de 48px, raio 10, sombra colorida** · **`prefers-reduced-motion` em 5 blocos** ·
**a curva `cubic-bezier(.16,1,.3,1)`** · **`scroll-mt-24` de 96px** nas âncoras (sem isso o menu
para embaixo do nav sticky). Isso é o que faz o leanware ser bom, e nada disso é a cor dele.

---

## PARTE 6 — HANDOFFS E ESTADO DOS GATES

### 6.1 HANDOFF: @design-chief → @peter-mckinnon

**Projeto:** Talos · **Fase concluída:** F2 (sistema visual)
**Entregue:** matiz, saturação e luminosidade-alvo do sistema; estatística de cor medida das 6 fotos.
**Contexto:** 2,2 MB de fotografia real em `03-assets/fotos/` (Unsplash, crédito em `CREDITOS.md`).
Três entram na §6 como mídia de card `3:2`, uma no hero a 6% de opacidade, uma no rodapé a 4%.
**Critérios de aceite (mensuráveis, não opinativos):**
- matiz médio em `36° ± 8` · saturação média `≤ 18%` · mediana de L entre `10%` e `20%` · p98 de L `< 70%`
- 🔴 `placa-metal` sai de `h182` (ciano) — é a única que hoje briga com o acento
- `ferreiro` (`h39 s21% l13%`) é a régua: já está no ponto; as outras duas vão até ela
- saída `.webp` em 960 e 1920 · vinheta 12% · sem estourar branco
**Fora de escopo:** gerar imagem. Nenhuma foto é criada, só graduada.

### 6.2 HANDOFF: @design-chief → @aaron-draplin

**Entregue:** slot da marca no nav (18/24/28px), regra de `currentColor`, hover para `--bronze`.
**Pedido:** a marca do Talos como **SVG monocromático de traço**, legível a 18px de altura.
Referência conceitual: o autômato de bronze — não robô genérico, não engrenagem de banco de imagem.
A do leanware é um wordmark com `{}` num quadro; o equivalente aqui é a **cabeça/perfil do
autômato**, e o wordmark ao lado.
**Aceite:** legível a 18px em `--ink` sobre `--bg`; funciona em 1 cor; sem gradiente; sem PNG.

### 6.3 Decisões que são do founder, não minhas

| # | decisão | recomendação | custo de reverter |
|---|---|---|---|
| D-A | **bronze `#E9A23B` ou verde `#3ecf8e`** | 🥉 **bronze** (Parte 3, 6 critérios a 1) | 1 linha de token + 3 derivados |
| D-B | fundo **neutro `#0f0f0f`** ou nogueira `#0d0a06` (R2) | **neutro** — nogueira mata a leitura de metal | 6 tokens de superfície |
| D-C | `cv05`+`cv08` da Inter (desambiguação de `l`/`I`) | **sim** para PT-BR, mas é gosto | 1 declaração |
| D-D | copy da **linha de honestidade** do hero | é a frase mais arriscada do site | — |
| D-E | display **62px** (leanware) vs 112px (R2) | **62px** — mantém o painel de prova na dobra | 1 token |

### 6.4 Estado dos gates

| gate | exigência | estado |
|---|---|---|
| **F1** referência | ≥5 capturas em disco, aprovadas | ✅ 15 capturas; leanware escolhido pelo founder |
| **F2** sistema visual | todo par com contraste **calculado**; nenhum token inventado | ✅ **este documento** — **51 pares medidos** (37 do sistema Talos + 14 de auditoria da referência), cada token com linha de origem |
| **F3** matéria-prima | `03-assets/ ≥ 1,5 MB` | ✅ **2,2 MB medidos** — e a Parte 4 §6 aloca o material, o que faltava |
| **F4** mockup | aprovação do founder, **seção por seção**, antes de qualquer `.tsx` | 🔴 **BLOQUEADO** — `05-build/mockup/` não existe |
| **F5** build | — | ⛔ não começa |
| **F6** A/B | — | ⛔ não começa |

🔴 **Nenhum `.tsx` até F4 passar.** `WORKFLOW-SITES.md` Parte 6, regra 1. Nem "só para testar o
layout" — foi assim que as três rodadas anteriores se perderam: 11 seções construídas sem uma tela
aprovada.

**Próximo passo:** produzir `05-build/mockup/` — HTML estático das 14 seções, com o seletor
bronze ↔ verde do §3.7 no canto, e capturar telas **por viewport** (nunca `fullPage`: com Lenis o
`page.screenshot({fullPage:true})` compõe quadros inconsistentes e mostra a página repetida —
gotcha já registrado).

---

## Apêndice — mapa de citações

Formato: `page.html:<linha> @<offset de caractere>`. O CSS está minificado em 8 linhas dentro de um
único bloco `<style>` que começa na linha 108, o que torna a linha pouco discriminante; o offset é
o localizador confiável. Arquivo:
`docs/projects/aiox-site/02-references/inputs/leanware/pages/home/page.html` (259,7 KB).

| o quê | linha | offset |
|---|---|---|
| `:root,:host` — bloco de tokens | 110 | 51253 |
| superfícies `--color-lw-dark…` | 110 | 52683 · 52736 |
| acento `--color-lw-accent` + soft/ring/glow | 110 | 52859 |
| tinta `--color-lw-ink…` | 110 | 53365 |
| escala tipográfica `--text-display…` | 110 | 53738 |
| `--text-label` | 110 | 54579 |
| raios `--radius-btn…` | 110 | 54812 |
| `--max-width-site` / `-wide` | 110 | 54972 |
| `html{scroll-behavior:smooth}` | 110 | 58529 |
| `body{}` + `::selection` + `:focus-visible` | 110 | 58626 · 58750 |
| `@font-face` Inter Variable | 110 | 112844 |
| `@font-face` JetBrains Mono | 110 | 113141 |
| `@keyframes lw-pulse` | 110 | 113401 |
| `.lw-eyebrow` | 110 | 113454 |
| `.lw-card` | 110 | 114151 |
| `.lw-mono` (tnum/lnum morto) | 110 | 114467 |
| `.homepage-hero` | 108 | 18437 |
| `.homepage-hero__bg` (brilho) | 108 | 18567 |
| `.homepage-hero__dotgrid` | 108 | 18787 |
| `.homepage-hero__inner` (grid) | 108 | 19121 |
| `.homepage-hero__headline` (64px hard-coded) | 108 | 19504 |
| `.homepage-hero__headline-accent` (gradiente) | 108 | 19786 |
| `.homepage-hero__btn` / `--primary` | 108 | 20316 · 20662 |
| `.hero-byline` (slot do selo Clutch) | 108 | 21317 |
| `"tnum" on,"lnum" on` (1ª ocorrência) | 108 | 21901 |
| `.services-dotgrid` | 108 | 24883 |
| `.service-card` (+ `__icon-wrap`) | 108 | 25205 · 25663 |
| `.differentiator-card__media` (slot das fotos) | 108 | 26791 |
| `.cmp-scroll` / `.cmp-matrix` | 108 | 27181 · 27616 |
| `.cmp-matrix__cell` / `--us` / `__mark--yes` | 108 | 28979 · 29482 · 29756 |
| `.faq-item` / `__question` | 108 | 30713 · 31399 |
| `.client-logos__heading` (22px) | 109 | 32488 |
| `.marquee` / `__track` (171s) | 109 | 32714 · 33330 |
| `.trust-strip` / `__cell` / `__value-num` | 109 | 35884 · 36985 · 38263 |
| `.lw-header` | 110 | 39630 |
| `.lw-footer` / `__bg` / `__dotgrid` / `__top` | 110 | 39831 · 40036 · 40257 · 40604 |
| `.case-card__metric-value` | 111 | 118523 |
| `.cta-section__glow` / `__dotgrid` | 113 | 119079 · 119275 |
| `class="hero-chat"` (markup do placeholder) | 121 | 163763 |

**Outras fontes de medição**
`pages/home/intel.json` — alturas de seção e tamanhos de heading no render real ·
`pages/home/screens/desktop-0..2.png`, `mobile-0..1.png` — leitura visual ·
`assets/fonts/InterVariable.woff2` (99,6 KB) e `JetBrainsMono.woff2` (36,7 KB) — parse com fontTools 4.62.1 ·
`03-assets/fotos/*-960.webp` — estatística de cor via Pillow ·
`mcp-design-studio` `dist/providers/{color,contrast}-provider.js` — handlers reais ·
`ui-ux-pro-max` `cip/search.py` — estilos e paletas de indústria.
