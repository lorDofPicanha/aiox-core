# DESIGN.md — sistema visual derivado de leanware.co

**Criado:** 2026-07-28 · **Gate:** F2 do `WORKFLOW-SITES.md`
**Origem:** `02-references/inputs/leanware/pages/home/page.html` — 107.607 caracteres de CSS
**inline** extraídos do capture real. Nenhum token abaixo foi estimado por leitura de tela.

> Este documento existe porque o founder escolheu **uma** referência concreta
> (`https://leanware.co/`) e pediu o site nesse molde. Ele substitui, para este build, a
> rodada de 7 referências da R2 — que continua válida como acervo, mas não é mais a régua.

---

## 0. Teste de forkabilidade — PASSA

`reference_forkability_test` manda sondar antes de construir: CSS externo minúsculo indica
layout JS-driven que colapsa sem os bundles.

| medida | valor | veredito |
|---|---|---|
| `<link rel=stylesheet>` | **0** | — |
| blocos `<style>` inline | **1**, com 107.607 chars | ✅ o CSS inteiro está no HTML |
| `class=` no documento | 793 | ✅ layout declarado em CSS, não montado por JS |
| `<script>` | 16 | interação, não layout |
| stack | Astro (`_astro/*.avif`), estático | ✅ forkável |

Peso total do capture: **1,03 MB** (10 PNG, 3 AVIF, 4 SVG, 2 WOFF2, 1 HTML, 1 intel.json).

⚠️ **Consequência para o gate F3.** O `WORKFLOW-SITES.md` exige `03-assets/` ≥ 1,5 MB,
número calibrado contra a mediana de 6 MB dos 100 premiados do Awwwards. **O leanware não
joga esse jogo**: a matéria-prima dele são 3 ilustrações de linha em AVIF (11 KB somados),
dot grids em `radial-gradient` e dois glows. Copiar o leanware significa adotar a economia
de material dele. O gate F3 **não passa** neste build, e isso é uma escolha declarada, não
um esquecimento — ver §6.

---

## 1. Cor

### Superfícies — 1:1 do capture

| token Talos | valor | origem no leanware |
|---|---|---|
| `--dark` | `#0e0e10` | `--color-lw-dark` · confirmado por `bodyBg: rgb(14,14,16)` |
| `--surf` | `#131316` | `--color-lw-dark-surf` — seções alternadas |
| `--card` | `#18181c` | `--color-lw-dark-card` |
| `--card-hover` | `#1e1e22` | `--color-lw-dark-card-hover` |
| `--raised` | `#232328` | `--color-lw-dark-raised` — botão secundário |
| `--top` | `#2e2e33` | `--color-lw-dark-top` |
| `--border-dark` | `#232328` | `--color-lw-border-dark` — divisor entre seções |
| `--border-light` | `#2e2e33` | `--color-lw-border-light` |

### Tinta — 1:1 do capture

`--ink #fafafa` · `--ink-2 #fafafaa8` · `--ink-3 #fafafa6b` · `--ink-4 #fafafa47`
(`--color-lw-ink*`)

### Acento — **o único desvio deliberado**

O leanware usa verde `#3ecf8e`. O Talos mantém o **bronze `#E9A23B`**, já aprovado, porque
o nome da marca é o autômato de bronze de Hefesto — trocar por verde entregaria o leanware
em português, não o Talos. A *estrutura* de tons do leanware foi copiada exatamente:

| token | Talos (bronze) | leanware (verde) | papel |
|---|---|---|---|
| `--accent` | `#e9a23b` | `#3ecf8e` | fill do botão primário, eyebrow, números |
| `--accent-light` | `#c9862c` | `#35b47a` | hover do primário |
| `--accent-soft` | `#e9a23b1a` (10%) | `#3ecf8e1a` | fundo de selo, glow da CTA |
| `--accent-ring` | `#e9a23b38` (22%) | `#3ecf8e38` | contorno de selo e de aba ativa |
| `--accent-glow` | `#e9a23b66` (40%) | `#3ecf8e66` | brilho |

O mockup traz um **seletor no canto inferior direito** que troca entre os dois. É uma
variável de CSS: decidir bronze ou verde não custa retrabalho nenhum.

### Contraste — calculado por WCAG 2.1, não estimado

| par | razão | veredito |
|---|---|---|
| `--ink` sobre `--dark` | **18,48:1** | AA texto normal |
| `--ink` sobre `--card` | **16,96:1** | AA texto normal |
| `--ink-2` sobre `--dark` | **8,11:1** | AA texto normal |
| `--ink-2` sobre `--surf` | **7,80:1** | AA texto normal |
| bronze sobre `--dark` | **8,90:1** | AA texto normal |
| bronze sobre `--card` | **8,17:1** | AA texto normal |
| `--on-accent` `#0e0e10` sobre bronze | **8,90:1** | AA — texto do botão primário |
| verde sobre `--dark` | **9,66:1** | AA (se a variante verde for escolhida) |
| 🔴 `--ink-3` sobre `--dark` | **3,78:1** | **REPROVA** para texto de leitura |

**Correção aplicada:** o leanware usa `--ink-3` em texto de apoio. Medido, ele reprova AA.
No Talos, `.small` e as células do comparativo — que carregam conteúdo que a pessoa
realmente lê — foram subidas para `--ink-2` (8,11:1). `--ink-3` ficou só em rótulo mono
decorativo. **Pendência herdada:** os rótulos `.micro` em `--ink-4` (10-11px) também
reprovam; o leanware faz igual. Decisão do founder se sobe ou aceita.

---

## 2. Tipografia

Duas famílias, ambas **já capturadas em disco** (`02-references/inputs/leanware/assets/fonts/`,
copiadas para `05-build/mockup/fonts/`):

- `Inter Variable` — `InterVariable.woff2`, 99,6 KB, peso 100–900
- `JetBrains Mono` — `JetBrainsMono.woff2`, 36,7 KB, peso 400–700

O display do leanware **não é uma fonte exótica**: é Inter no peso 800 com `letter-spacing:
-.035em`. Foi o que gerou a dúvida ao olhar a tela — resolvida lendo o `@font-face`.

### Escala — 1:1 dos tokens `--text-*`

| papel | tamanho | line-height | tracking | peso |
|---|---|---|---|---|
| display | `3.875rem` (62px) | 1.08 | −.035em | 800 |
| h1 | `3.25rem` | 1.06 | −.035em | 800 |
| h2 | `2.75rem` | 1.06 | −.035em | 800 |
| h3 | `2rem` | 1.1 | −.02em | 800 |
| h4 | `1.3125rem` | 1.3 | — | 700 |
| h5 | `1.125rem` | 1.4 | — | 700 |
| body-lg | `1.0625rem` | 1.7 | — | 400 |
| body | `.9375rem` | 1.7 | — | 400 |
| body-sm | `.875rem` | 1.6 | — | 400 |
| caption | `.8125rem` | 1.4 | — | 600 |
| label | `.6875rem` | 1.2 | **.16em** | 700 |
| micro | `.625rem` | 1.2 | .06em | 600 |

**Medido no render:** `h1` = 62px, família `"Inter Variable", Inter, system-ui`.

⚠️ **Isto revoga a escala de 112px da R2.** O leanware para em 62px e compensa com peso 800
e tracking negativo. Manter 112px sobre a grade dele quebraria o ritmo — é a decisão de
escala inteira, não um número solto.

### O *eyebrow* — assinatura do leanware

Mono, 11px, peso 600, `letter-spacing: .16em`, caixa alta, na cor do acento, precedido de
um filete de **14×1px** na mesma cor. Regra copiada literalmente. É o que dá o ar de
documento técnico em vez de landing page.

---

## 3. Forma e espaço

| token | valor | origem |
|---|---|---|
| `--r-btn` | `.625rem` | `--radius-btn` |
| `--r-card` / `-lg` / `-xl` | `1rem` / `1.25rem` / `1.375rem` | `--radius-card*` |
| `--r-pill` | `1.75rem` | `--radius-pill` |
| largura do conteúdo | **1280px** | `--max-width-site-wide` |
| respiro de seção | `24px / 72px` → `64px / 128px` em ≥768px | `px-6 py-28 md:px-16 md:py-32` |
| divisor | `border-top: 1px solid --border-dark` | toda `<section>` |

**Ritmo de fundo:** alterna `--dark` e `--surf` a cada seção. É o que separa os blocos sem
precisar de card em volta de tudo.

---

## 4. Textura — os quatro dot grids (valores exatos)

Nenhum é imagem. Todos são `radial-gradient` + `mask-image`, copiados caractere a caractere:

| onde | ponto | passo | máscara |
|---|---|---|---|
| hero | `rgba(255,255,255,.04)` 1px | 24px | `linear-gradient(180deg, rgba(0,0,0,.6), transparent 80%)` |
| seção | `rgba(255,255,255,.03)` 1px | 32px | `radial-gradient(ellipse at 50% 30%, rgba(0,0,0,.8), transparent 75%)` |
| CTA | `rgba(255,255,255,.05)` 1px | 24px | `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.7), transparent 60%)` |
| rodapé | `rgba(255,255,255,.035)` 1px | 28px | `linear-gradient(180deg, rgba(0,0,0,.45), transparent 70%)` |

**Glows:**

- hero — `radial-gradient(ellipse 720px 460px at 92% -8%, accent 5%, accent 2% 50%, transparent 78%)`
- CTA — `radial-gradient(ellipse 700px 400px at 50% 50%, accent-soft, transparent 65%)`
- rodapé — `radial-gradient(ellipse 1200px 360px at 50% 0%, accent-soft, transparent 70%)`, `opacity .55`
- faixa de prova — `radial-gradient(circle at 50% 0%, accent-soft, transparent 45%)`, `opacity .7`

**Faixa corrida:** `border-top`/`border-bottom` em `--border-dark`, fades laterais de 120px
em `linear-gradient` para `--dark`, deslocamento de `-50%` com duas cópias do conteúdo.

---

## 5. Botões — a regra que inverte a R2

O leanware usa o acento como **fill** do botão primário, com texto escuro por cima
(`#0e0e10` sobre verde). O secundário é `--raised` com contorno `--border-light`.

🔴 Isso **contradiz a regra da R2** (`REFERENCIAS-R2.md`: *"reserve o bronze para contorno,
sublinhado e filete — nunca fill"*, vinda do Mesh e do ORYZO). As duas regras não podem
valer ao mesmo tempo. Como o founder escolheu o leanware como a referência deste build,
**vale a do leanware** e a da R2 fica suspensa para este projeto. Registrado aqui para não
virar inconsistência silenciosa depois.

Contraste do par verificado: `#0e0e10` sobre `#e9a23b` = **8,90:1**.

---

## 6. O que este sistema NÃO resolve

1. **Gate F3 (matéria-prima ≥ 1,5 MB) não passa.** O leanware pesa 1,03 MB inteiro.
   Seguir a referência e cumprir o gate são coisas incompatíveis. Se o founder quiser o
   patamar dos premiados, a referência precisa mudar — não o build.
2. **As 3 ilustrações de linha** do leanware são AVIF autorais. As do Talos foram
   desenhadas como **SVG inline** no mesmo idioma visual (traço 1,2px, rótulo mono em caixa
   alta, acento à esquerda / neutro à direita), mas dizendo coisas do Talos. Não são cópia
   dos arquivos dele.
3. **Rótulos `.micro` em `--ink-4`** reprovam AA (herdado). Decisão pendente.
4. **`--ink-3` em 3,78:1** continua definido, só não é mais usado em texto de leitura.
