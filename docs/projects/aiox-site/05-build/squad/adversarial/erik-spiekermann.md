# REVISÃO ADVERSARIAL — TIPOGRAFIA
## erik-spiekermann · Talos / aiox-site · 2026-07-28

**Alvos:** `05-build/squad/DIRECAO-ARTE.md` §1.2 e §4 · `05-build/squad/ARQUITETURA-SECOES.md` §6.3
**Matéria-prima verificada:** `02-references/inputs/leanware/pages/home/page.html` (265.812 chars) ·
`assets/fonts/InterVariable.woff2` (v4.001) · `assets/fonts/JetBrainsMono.woff2` (v2.211) ·
`pages/home/intel.json` (23 headings medidos)
**Método:** `fontTools` sobre os dois `.woff2` reais + extração de token com offset de origem.
Cada número abaixo foi medido nesta sessão. Onde eu não medi, eu digo.

> Nota de método, antes de qualquer veredito. O `DIRECAO-ARTE.md` fez a coisa certa: foi ao disco
> em vez de opinar. É por isso que vale atacá-lo — um documento que inventa não merece auditoria,
> merece descarte. Este aqui merece auditoria. E a auditoria encontra **três erros de medição**,
> não de gosto.

---

## SUMÁRIO EXECUTIVO — o que muda

| # | item | veredito | custo |
|---|---|---|---|
| 1 | teto de display 62px | ✅ **mantém 62px** — mas por motivo diferente do que o doc alegou | 0 |
| 2 | Inter 800 / −.035em como display | ⚠️ **aguenta, sob uma condição não-opcional** | 1 linha de CSS |
| 3 | escala de 11–12 degraus | 🔴 **quebrada** — 3 degraus mortos + 2 níveis lidos errado | refatoração de token |
| 4 | rótulos mono caixa alta .16em @ 10–11px | 🔴 **defeito medido em PT-BR** — colisão vertical | 2 valores |
| 5 | `U+2192` / `U+2605` ausentes | ✅ **confirmado** — com uma correção na prescrição | muda o fix |

**O erro mais caro do documento não é nenhum dos cinco.** É o corpo de texto a 15px, herdado sem
questionamento de um site B2B em inglês que vende para CTO. Está no item 3 e é o único ponto onde
eu paro o build.

---

## ITEM 1 — TETO DE DISPLAY: 62px vs 112px

### Veredito: **62px. E o `DIRECAO-ARTE.md` acertou pela razão errada.**

O documento justifica assim (linha 259):

> *"Isto também derruba o teto de 112px da rodada R2: com a régua do leanware, 62px é o teto, e é
> o que mantém o card de prova visível na dobra."*

Dois argumentos, nenhum tipográfico. O primeiro é **obediência à referência** — se o leanware
tivesse posto 90px, o documento defenderia 90px. O segundo é **layout**. Nenhum dos dois sobrevive
à pergunta "e se a dobra tivesse 200px a mais?". Eu preciso de um motivo que continue verdadeiro
quando o layout mudar.

Há dois, e ambos são medidos.

### 1.1 · O motivo estrutural: 112px estoura a medida em português

Princípio: **"The measure (line length) determines readability more than the typeface itself."**

A coluna de texto do hero é fixa e verificável. `--max-width-site-wide: 1280px`
(`page.html @51xxx`), grid `minmax(0,1fr) 560px` com `gap: 56px` (`@19122`).
**1280 − 560 − 56 = 664px.** O documento chegou ao mesmo número; confirmado.

Medi a Inter Variable instanciada em `wght 800 / opsz 32` e apliquei `letter-spacing: −.035em`:

| medição | valor |
|---|---|
| avanço médio de caixa baixa, Inter 800 | **0,5467 em** |
| idem, com −.035em de tracking | **0,5117 em** |
| avanço médio real medido em frases PT-BR (caixa mista) | **~0,48 em** |

| tamanho | caracteres por linha em 664px |
|---|---|
| **62px** | **20,9** (caixa baixa) · **22,3** (frase real) |
| **112px** | **11,6** (caixa baixa) · **12,4** (frase real) |

Onze caracteres. Agora as larguras reais que medi, dos dois candidatos de headline em português:

| string | @62px + tracking | @112px + tracking | cabe em 664px? |
|---|---|---|---|
| `Seu processo,` | 387,4px | 699,8px | **@112 NÃO** |
| `automatizado.` | 396,1px | 715,5px | **@112 NÃO** |
| `Menos trabalho` | 428,4px | 774,0px | **@112 NÃO** |
| `realmente funciona.` | 546,4px | 987,1px | **@112 NÃO — estoura 48%** |
| `Automação` | 322,9px | 583,2px | @112 sim, sozinha |

**Uma única palavra composta em português já excede a medida a 112px.** `automatizado.` são treze
caracteres e não cabe. `implementação` e `acompanhamento` são piores. E não há saída: o H1 do
leanware é `display:flex; flex-direction:column` com **um `<span>` por linha** (`@19504`) — as
quebras são autorais, não automáticas. `text-wrap: balance` não salva uma linha que não tem ponto
de quebra. A alternativa é hifenizar um display de peso 800, o que é um defeito, não uma solução.

Isso não é preferência. **É que o inglês da referência (`Making AI` = 9 caracteres,
`Actually Useful.` = 16) tem palavras mais curtas que o português.** Copiar o tamanho sem
recalcular a medida é o erro clássico de traduzir um layout.

### 1.2 · O motivo que ninguém no projeto encontrou: o eixo `opsz` da Inter para em 32

Este é o argumento decisivo e ele está **dentro do arquivo que a própria referência serve**.

```
InterVariable.woff2 — eixos variáveis medidos com fontTools:
  opsz   14 → 32     (padrão 14)
  wght  100 → 900    (padrão 400)
```

A Inter 4.x tem um eixo de **tamanho óptico**, e ele termina em **32**. Significa que a Rasmus
Andersson desenhou correções de forma até 32px e não além. Acima disso, o navegador serve o
desenho de 32 esticado.

- A **62px** você está a **1,94×** do topo do eixo óptico. É um esticão tolerável — a diferença
  entre o desenho de 32 e um desenho ideal de 62 é sutil o bastante para passar.
- A **112px** você está a **3,50×** do topo. Aí a Inter deixa de parecer uma display e passa a
  parecer **uma fonte de interface ampliada** — juntas grossas demais, aberturas largas demais,
  x-height alto demais para o corpo do glifo.

Medi essa deriva: a razão x-height/cap-height da Inter cai de **0,750** (opsz 14, wght 400) para
**0,709** (opsz 32, wght 800). A fonte *sabe* estreitar a caixa baixa quando cresce — mas ela para
de saber em 32.

**Conclusão do item 1.** 62px não é o teto porque o leanware disse. É o teto porque
(a) em português, 664px de coluna a 112px comportam 12 caracteres, e nenhuma headline decente cabe
nisso; e (b) a própria Inter para de ter desenho para o tamanho muito antes de 112. Os dois motivos
continuam verdadeiros se o layout mudar amanhã. O do documento, não.

### 1.3 · Onde 62px também está errado: é um número mágico

Aceito 62px. **Não aceito 62px como constante em `px`.** É uma decisão para 1280–1440 que vai
governar telas de 2560. E a régua responsiva herdada (`48px` ≤1100 · `40px` ≤640) são mais dois
números mágicos.

A regra defensável não é um pixel, é uma **contagem de caracteres**. Alvo: **16–22 caracteres por
linha de display em português.**

```
664px / (18 chars × 0,5117em) = 72px   ← limite superior
664px / (22 chars × 0,5117em) = 59px   ← limite inferior
```

**Banda defensável no desktop: 59–72px.** 62px está dentro. Mantém.

E acrescenta-se o que falta: **um gate de copy, não de CSS.**

> 🔴 **Regra do H1:** nenhuma linha autoral do H1 pode passar de **20 caracteres**.
> Verificável em revisão, sem abrir o navegador. É o único gate tipográfico do hero que um
> não-designer consegue aplicar sozinho.

---

## ITEM 2 — INTER 800 A −.035em COMO DISPLAY: aguenta ou está sendo torturada?

### Veredito: **aguenta — e só aguenta por causa de uma linha que o documento classificou como refinamento opcional.**

### 2.1 · A condição

O `DIRECAO-ARTE.md` linha 273 lista `font-optical-sizing: auto` como a primeira de "três declarações
que separam este Inter do Inter genérico", ao lado de `cv05/cv08` marcado **OPCIONAL**. Isso
subestima o que a declaração faz.

Sem `font-optical-sizing: auto`, o navegador serve **opsz 14** — o desenho da Inter para **14px** —
ampliado 4,4× até 62px, e depois você aperta mais 0,035em em cima. **Isso é tortura, e é
exatamente o que a referência faz** (busca por `opsz` / `font-optical-sizing` no `page.html`:
zero ocorrências — confirmei).

Com `font-optical-sizing: auto` você recebe opsz 32: espacejamento já de display, juntas mais
finas, x/cap 0,709 em vez de 0,750. Aí o −.035em vira **uma correção pequena sobre um desenho já
espaçado para display** — que é a definição de tracking bem aplicado.

> **`font-optical-sizing: auto` não é refinamento. É a premissa que torna a spec de display legítima.**
> Sem ela, o spec `62px / 800 / −.035em` é indefensável e eu reprovo.
> Custa 1 linha e 0 KB — o eixo já está no arquivo.

**Armadilha de implementação, e é séria:** `font-variation-settings` é **tudo-ou-nada**. Se
qualquer seletor do build declarar `font-variation-settings: 'wght' 800`, ele **zera o `opsz` de
volta para 14** e derruba silenciosamente a correção da página inteira.

```css
/* ✅ correto */
.display { font-weight: 800; }

/* 🔴 proibido no projeto inteiro — reseta opsz para 14 */
.display { font-variation-settings: "wght" 800; }
```

### 2.2 · O tracking está certo em 62 e errado em 44

A referência aplica **o mesmo `−.035em` em 62px, 52px e 44px** (`--text-display`, `--text-h1`,
`--text-h2`, todos em `@53738`–`@54053`; verificado). Depois pula para `−.02em` em 32px e some em
21px.

Isso é meia-régua. Tracking negativo deve **diminuir junto com o tamanho**, porque tipo menor
precisa de mais ar, não do mesmo ar proporcional. Manter `−.035em` de 62 até 44 significa que o
H2 está proporcionalmente tão apertado quanto o H1 — e o H2 é lido em 6 seções, não em 1.

Princípio: **"Kerning and spacing separate professionals from amateurs."**

Grade correta:

| tamanho | tracking |
|---|---|
| 62px | −.035em |
| 52px | −.030em |
| 44px | −.025em |
| 32px | −.020em |
| 21px | −.010em |
| ≤18px | 0 |

*(Ver "ONDE EU ESTOU ERRADO" §3 — esta grade de seis passos é correta e provavelmente não vale a
cerimônia. Há uma versão de dois valores lá.)*

### 2.3 · Inter é a fonte certa para esse papel?

Resposta honesta: **a Inter é uma neo-grotesca de texto para UI**, x-height/em = **0,546** — altíssimo.
Foi desenhada para caber legível em 13px numa tabela, não para monumentalidade. A 62px/800 ela lê
como *uma fonte de interface gritando*. Essa crítica é legítima e eu a faria em qualquer outro
projeto.

O que a desarma aqui: a **v4.001 no disco tem o eixo `opsz`** — que a Andersson acrescentou
precisamente para responder essa crítica. Com opsz 32 a Inter tem, sim, um desenho de display.
Limitado (para em 32, ver §1.2), mas real.

Se fosse para trocar, as candidatas OFL, self-hostáveis, com desenho de display de verdade seriam
**Instrument Sans**, **Archivo** (tem eixo `wdth`, o que resolveria a medida do item 1 de outro
jeito) ou **Geist**. Eu **não recomendo a troca**, e o motivo não é tipográfico: o projeto tem
três builds rejeitados por "parecer genérico", tem os `.woff2` da referência auditados em disco,
tem licença OFL conferida, e tem um founder que pediu *"faça igual"*. Trocar a fonte é gastar o
único capital de fidelidade que o build 4 tem. **A Inter passa, condicionada ao opsz.**

---

## ITEM 3 — A ESCALA INTEIRA

### Veredito: 🔴 **quebrada. E não pelo motivo que se vê olhando a tabela.**

Os 11 degraus propostos (`DIRECAO-ARTE.md` linhas 240–252):
**62 · 44 · 32 · 21 · 18 · 17 · 15 · 14 · 13 · 11 · 10**

### 3.1 · A progressão, medida

| passo | razão | veredito |
|---|---|---|
| 62 → 44 | 1,409 | ✅ |
| 44 → 32 | 1,375 | ✅ |
| 32 → 21 | 1,524 | ⚠️ maior salto da escala |
| 21 → 18 | 1,167 | ⚠️ fraco (mesmo peso 700 nos dois) |
| 18 → 17 | **1,059** | 🔴 |
| 17 → 15 | 1,133 | ⚠️ |
| 15 → 14 | **1,071** | 🔴 **mesmo peso, mesmo papel** |
| 14 → 13 | **1,077** | ⚠️ salvo pelo peso (400→600) |
| 13 → 11 | 1,182 | ✅ |
| 11 → 10 | **1,100** | 🔴 |

Cinco degraus de 1px na metade de baixo (18/17 · 15/14 · 14/13 · 11/10). **Isso não é escala,
é ruído.** Princípio do framework: **`hierarchy_levels: 6-8 levels maximum — more creates confusion`.**
O documento propõe 11 e comemora ter cortado de 12 para 11.

Mas esse nem é o problema principal.

### 3.2 · O erro estrutural: 32px e 52px foram lidos errado — prova no markup

O documento trata `--t-h3` (32px) como **um nível de hierarquia independente** e elimina
`--t-h1` (52px) como "uma ocorrência que não se justifica" (linha 262).

**Os dois estão errados, e a prova está no markup capturado.** Todas as sete ocorrências de
`.text-h3` no markup são assim:

```html
<h2 class="text-h3 text-lw-ink md:text-h2">Applied AI in the shape of</h2>
<h2 class="mt-4 text-h3 text-lw-ink md:text-h2">Not a consulting firm. Not staff aug. Not a dev shop.</h2>
<h2 class="mt-4 text-h3 text-lw-ink md:text-h2">Same question, different answers.</h2>
<h2 class="text-h3 text-lw-ink md:text-h2">What we built, and for whom.</h2>
<h2 class="mt-4 text-h3 text-lw-ink md:text-h2">In their words.</h2>
<h2 class="mt-4 text-h3 text-lw-ink md:text-h2">What people ask before they call.</h2>
<h2 class="mx-auto mt-5 max-w-[680px] text-h3 text-lw-ink md:text-h2 lg:text-h1">Talk to someone who gets your business.</h2>
```

**`--text-h3` (32px) não é um nível. É o valor mobile do H2.**
**`--text-h1` (52px) não é uma exceção. É o valor `lg:` do H2 de fechamento.**

O leanware não construiu 12 níveis. Construiu **um nível de título de seção com três valores
responsivos: 32 / 44 / 52**. O documento leu a escala como *níveis* quando a referência a
construiu como *níveis × breakpoints*.

Consequência direta e verificável: ao matar 52px, o documento diz *"o CTA final usa `--t-display`
com um `clamp` para baixo"* (linha 264). Isso **reintroduz 52px como valor ad-hoc não-tokenizado**
— que é exatamente o pecado que o próprio documento condena três parágrafos acima, quando acusa
`.homepage-hero__headline` de hard-codar 64px ignorando o token. **Mesmo defeito, autoria própria.**

### 3.3 · O degrau que está de fato morto — e que o documento manteve

Contagem literal no markup (146.164 chars após o último `</style>`):

| classe | ocorrências no markup |
|---|---|
| `.text-h4` (21px) | **0** |
| `.text-label` (11px) | **0** — o eyebrow usa `.lw-eyebrow`, que hard-coda |
| `.text-display` (62px) | **0** — o H1 hard-coda 64px |

Confirmado de forma independente pelo `intel.json`: dos 23 headings renderizados, os tamanhos
medidos são **64 (×1) · 52 (×1) · 44 (×6) · 22 (×1) · 18 (×11) · 10 (×3)**. **Nada renderiza a
32px nem a 21px como heading.**

Pela própria regra do documento — *"token declarado e não usado é como o build vira inconsistente
com o tempo"* — `--t-h4` (21px, zero usos) deveria ter morrido, e 52px (um uso real e semântico)
deveria ter vivido. Ele fez o inverso nos dois.

### 3.4 · O erro que me faz parar o build: corpo a 15px

Este é o mais caro do documento, e é o único que não é sobre elegância.

**A justificativa está errada por artefato de medição.** Linha 248:

> `--t-body` | 15px | ... | `--text-body` — **61 usos, o corpo real do site**

`text-body` é **substring** de `text-body-lg` e `text-body-sm`. Contei:

| string | total no arquivo | no markup |
|---|---|---|
| `text-body-lg` | 19 | 11 |
| `text-body-sm` | 30 | 22 |
| `text-body` (bruto, inclui as duas acima) | **61** | 40 |
| **`text-body` isolado (61 − 19 − 30)** | **12** | **7** |

Os "61 usos" são 19 + 30 + 12. **O corpo real da referência não é 15px — é `.text-body-sm`, a
14px, com 22 usos no markup contra 7 de `.text-body`.** Corrigir a medição piora a situação:
a referência roda texto corrido a **14px**.

**Anti-padrão do framework, textual:**
> `"Never set body text below 16px on screen (14px only for dense data interfaces)"`

Uma home de marketing para **dono de PME brasileiro não-técnico** (`ARQUITETURA-SECOES.md` linha
117: *"o dono de PME brasileiro não chega sabendo que quer automação — ele chega com dor"*) é o
oposto exato de uma dense data interface. O leanware é B2B em inglês vendendo "AI engineering"
para quem já sabe o que quer; ele pode se dar ao luxo de 14–15px. O Talos, não.

Três medições que fecham o argumento:

1. **x-height da Inter em pixels reais** (o que o olho de fato lê, não o `font-size`):

   | font-size | x-height renderizada |
   |---|---|
   | 15px | **8,19px** |
   | 16px | 8,73px |
   | 17px | **9,28px** |

2. **A medida melhora ao subir de tamanho**, porque a coluna é fixa em 560px:

   | corpo | caracteres por linha em 560px | banda 45–75 |
   |---|---|---|
   | 15px | **69,6** | topo da banda |
   | 17px | **61,4** | **centro da banda** |

   Ou seja: subir de 15 para 17px **não custa legibilidade de medida — melhora**. Não há
   trade-off aqui. É ganho puro.

3. **Modo escuro cobra juros.** Texto claro sobre fundo escuro sofre irradiação óptica: aparenta
   mais peso e borra nas bordas, e o efeito é pior com astigmatismo (que é comum e aumenta com a
   idade). O documento ainda serve corpo em `--ink-2` = `#fafafaa8` — **66% de alfa**. Corpo a 15px,
   66% de opacidade, sobre `#0f0f0f`, para um leitor de 45+ no celular. Cada um desses fatores é
   defensável isolado. Os três juntos, não.

**Prescrição:** promover `--t-body-lg` (17px) a **corpo**, com piso de 16px no mobile, e **apagar
o 15px**. A referência já usa `.text-body-lg` 11× no markup para parágrafos de abertura de seção —
não é invenção, é escolher a melhor das duas que ela já tem.

---

## ESCALA CORRIGIDA

**7 níveis semânticos** (dentro da regra de 6–8), cada um com valores responsivos em vez de degraus
paralelos. Base 16px. Razão ~1,4 no topo, contraste por **peso** onde o tamanho não tem trabalho a
fazer — *"Hierarchy is established through size, weight, and spacing — not through decoration."*

| token | ≤640 | ≤1100 | desktop | line-height | tracking | peso | face | por que este degrau existe |
|---|---|---|---|---|---|---|---|---|
| `--t-display` | 40px | 48px | **62px** | 1.05 / 1.05 / **1.08** | **−.035em** | 800 | Inter | H1 do hero, **e nada mais**. 62px = topo da banda de 16–22 caracteres em 664px (§1.3) e 1,94× o topo do eixo `opsz` (§1.2). Ladder herdada verbatim de `@19504` — os únicos breakpoints tipográficos que a referência tem, e funcionam. |
| `--t-section` | 32px | 40px | **44px** | 1.10 | **−.025em** | 800 | Inter | H2 de **todas** as seções, incluindo o CTA de fechamento. Um nível, três valores — como a referência de fato faz (`text-h3 md:text-h2`), não como o documento leu. **52px morre e não volta por clamp.** 62/44 = **1,41**. |
| `--t-lead` | 18px | 18px | **18px** | **1.55** | −.01em | **500** | Inter | Subhead do hero + parágrafo de abertura de seção. Funde `.homepage-hero__subhead` (18/1.55/500, `@20039`) com `--text-body-lg` (17/1.7/400) — eram duas coisas a 1px de distância fazendo o mesmo trabalho. Peso 500 é o que separa do corpo, não o tamanho. |
| `--t-card-title` | 18px | 18px | **18px** | **1.30** | −.01em | **700** | Inter | Título de card. **Mesmo tamanho do lead, peso e leading diferentes** — é assim que hierarquia se faz quando não sobra tamanho. Métricas do `.service-card__title` real (`@26067`), **não** do token `--text-h5` (ver nota ⚠️ abaixo). 11 dos 23 headings medidos vivem aqui. |
| `--t-body` | **16px** | 17px | **17px** | **1.65** | 0 | 400 | Inter | Texto corrido. **Sobe de 15 → 17px.** x-height 9,28px em vez de 8,19px; medida melhora de 69,6 → 61,4 caracteres em 560px. Leading 1.65 (não 1.7) porque tipo maior precisa proporcionalmente de menos entrelinha. Piso de 16px no mobile é inegociável. |
| `--t-small` | 14px | 14px | **14px** | 1.55 | 0 | **500** | Inter | Metadado, célula de matriz, nota de rodapé. **Nunca prosa corrida.** Absorve `--t-caption` (13px): 14 vs 13 é 1,077 e não sobrevive a teste cego. Peso 500 compensa o tamanho no fundo escuro. |
| `--t-label` | 11px | 11px | **11px** | **1.45** | **.12em** | 700 · 600 | **Mono, caixa alta** | Eyebrow, CTA de card, carimbo, rótulo de máquina. **Leading sobe de 1.2 → 1.45 (defeito PT-BR medido, item 4).** Tracking cai de .16 → .12em (mono já traz sidebearing, item 4). Absorve `--t-micro` (10px): **mesmo tamanho, peso 600 + `--ink-3`** faz o degrau que 1px não faz. |

**Eliminados e por quê:**

| token | motivo |
|---|---|
| `--t-h1` 52px | não é nível, é o `lg:` do `--t-section`. Morre — e **não volta como clamp** |
| `--t-h3` 32px | não é nível, é o mobile do `--t-section`. Vira valor, não token |
| `--t-h4` 21px | **0 usos no markup da referência.** Morto por evidência |
| `--t-h5` 18px | absorvido por `--t-card-title`, com as métricas reais |
| `--t-body-lg` 17px | vira `--t-body` (promovido) |
| `--t-body` 15px | 🔴 **apagado.** Abaixo do piso para este público |
| `--t-caption` 13px | absorvido por `--t-small` |
| `--t-micro` 10px | absorvido por `--t-label` @600. 7,3px de altura de caixa alta é decoração |

**12 tokens → 7.** E os 7 têm papel declarado, o que os 12 não tinham.

> ⚠️ **Erro factual a corrigir no `DIRECAO-ARTE.md` linha 246.** O documento afirma
> `--t-h5 | 18px | 1.40 | — | 700 | ... · = .service-card__title`. Medi: `.service-card__title`
> (`@26067`) é `font-size:18px; font-weight:700; letter-spacing:-.01em; **line-height:1.25**`.
> O token `--text-h5--line-height` é **1.4** e não tem tracking. **Não são a mesma coisa** — 0,15
> de leading e 0,01em de tracking de diferença. A equivalência declarada é falsa; a métrica que
> vale é a do componente, porque é ela que renderiza nos 11 cards medidos.

**Buraco conhecido, declarado de propósito:** entre `--t-section` (44px) e `--t-card-title` (18px)
há um vão de 2,44×. É aceitável **porque a arquitetura de informação tem só duas profundidades de
título**. Se `§5` ou `§7` introduzirem uma terceira, o valor correto é **26–28px** (1,41 abaixo de
44, ~1,5 acima de 18) — **e não 32px**, que agora é o valor mobile de `--t-section` e criaria um
subtítulo do mesmo tamanho de um H2 no celular. Registrado para o próximo que for tentado.

**Medida — a regra que falta no documento:**

```css
/* nenhum bloco de prosa sem teto de medida */
.prose, p { max-inline-size: 62ch; }   /* ≈565px a 17px — centro da banda 45–75 */
```

---

## ITEM 4 — RÓTULOS MONO, CAIXA ALTA, `.16em` A 10–11px

### Veredito: **o gesto está certo, o número está calibrado para a fonte errada, e o leading tem um defeito medido em português.**

### 4.1 · Espacejar caixa alta é craft, não maneirismo — isso o documento acertou

Versaletes e caixa alta foram desenhados como letras monumentais isoladas, com ar generoso entre
si. Setadas com espacejamento de texto, elas empastam. O corolário do velho aforismo de Goudy
(*"anyone who would letterspace lowercase would steal sheep"*) é que espacejar **caixa alta** não é
só permitido — é obrigatório. **Tracking positivo em caixa alta: aprovado.**

### 4.2 · Mas `.16em` foi calibrado para uma fonte proporcional, e isto aqui é monoespaçada

Medi a JetBrains Mono:

```
advance de TODO glifo: 600/1000 = 0,600em
glifo 'A' — ink de 35,4 até 564,6  →  35,4 unidades (0,035em) de sidebearing embutido de cada lado
glifos estreitos ('I', 'i', 'l')   →  sidebearing muito maior, pela construção monoespaçada
```

**Monoespaçada já é espacejada por construção.** Cada glifo mora numa caixa de 0,6em
independentemente da largura da tinta. Empilhar `.16em` em cima disso, num `I` ou num `1`, produz
algo perto de **0,3em de branco** ao redor de uma haste de ~2px. A 11px, as letras param de ler
como palavra e passam a ler como uma fileira de caracteres. É o ponto exato em que craft vira
maneirismo — e é aqui, não no gesto.

**E não há socorro óptico disponível:**

```
JetBrains Mono — GPOS: NENHUMA feature.  (sem 'kern', sem 'cpsp')
Inter          — GPOS: 'kern', 'cpsp'    ('cpsp' = capital spacing, a feature desenhada exatamente para isto)
```

A JetBrains Mono não tem **nem kerning nem capital spacing**. O que a régua mecânica produzir é o
que vai ao ar. A Inter tem `cpsp` — e não é onde o rótulo está.

**Correção derivada, não opinada:** `.16em` é o valor certo para caixa alta **proporcional**.
A monoespaçada entrega ~0,05em de sidebearing extra de graça. **`.16 − 0,05 ≈ .12em`.**

| | referência | Talos corrigido |
|---|---|---|
| `--t-label` tracking | `.16em` | **`.12em`** |
| `--t-micro` tracking | `.06em` | absorvido — `.12em` @ peso 600 |

Mantenho a mono. O documento está certo no ponto mais importante do item (linha 288–291): a divisão
Inter-para-frase / mono-para-rótulo-de-máquina **é o ativo que faz a página parecer instrumento em
vez de folheto**, e é isso que um produto de automação precisa parecer. Não se troca isso por 0,04em.

### 4.3 · O defeito que ninguém viu: caixa alta portuguesa não cabe no leading de 1.2

Este é o achado mais concreto do meu lado da auditoria. Medi as caixas de tinta reais dos glifos
da JetBrains Mono em `wght 700`:

| glifo | topo | base | altura de tinta |
|---|---|---|---|
| `A` (inglês) | 0,730em | 0,000em | 0,730em |
| `C` (inglês) | 0,740em | −0,010em | 0,750em |
| **`Ã`** | **0,954em** | 0,000em | **0,954em** |
| **`Ç`** | 0,740em | **−0,216em** | **0,956em** |
| `Õ` | 0,954em | −0,010em | 0,964em |
| `É` | 0,950em | 0,000em | 0,950em |

**Caixa alta portuguesa é 29% mais alta que a inglesa** (0,954 / 0,740 = 1,289).

Agora a caixa de linha que o documento especifica — `--t-label` **11px × line-height 1.2 = 13,2px**:

| rótulo | tinta ocupa | sobra de entrelinha |
|---|---|---|
| `AUTOMATION` (inglês, referência) | 8,14px | **5,06px** ✅ |
| **`AUTOMAÇÃO`** (PT-BR, com `Ç` **e** `Ã`) | **12,86px** (de −2,37 a +10,49) | **0,34px** 🔴 |

E `--t-micro` a **10px × 1.2 = 12px** de caixa, contra **11,7px** de tinta de caixa alta portuguesa:
**0,3px de sobra.**

**Dois rótulos empilhados em português se tocam.** O `line-height: 1.2` da referência foi afinado
contra um idioma cujas maiúsculas nunca passam de 0,74em. Copiar 1.2 verbatim para o português é
o mesmo erro de tradução do item 1, só que invisível — porque quem comparar o build contra o
leanware **em inglês** não vai ver nada errado.

**Correção obrigatória: `--t-label` line-height ≥ 1.45.** (11 × 1,45 = 15,95px de caixa, 3,1px de
entrelinha real.) Já está na escala corrigida.

### 4.4 · O 10px morre

Altura de caixa alta a 10px na JetBrains Mono: **0,730 × 10 = 7,30px de tinta.**
Sobre `--ink-3` (`#fafafa7d`, medido em **4,62:1** — passa AA raspando), em fundo `#0f0f0f`,
tracked, em caixa alta, para um leitor de 45+.

**"Legibility is not a style choice — it is a requirement."** 7,3px de altura de caixa alta em
condições dessas é decoração se passando por informação. O papel do micro (carimbo `22:14`, `3×`,
`toda segunda`, a linha de honestidade) vai para **11px @ peso 600 em `--ink-3`** — o degrau de
peso e cor faz o trabalho que 1px de tamanho nunca fez.

---

## ITEM 5 — `U+2192` E `U+2605`: o achado da direção de arte

### Veredito: ✅ **CONFIRMADO, com uma correção de precisão e uma correção de prescrição.**

Abri os dois `.woff2` reais da captura com `fontTools` e enumerei os `cmap`:

| | Inter Variable 4.001 | JetBrains Mono 2.211 |
|---|---|---|
| glifos / codepoints | 901 / **343** | 371 / **206** |
| `U+2192 →` | 🔴 **AUSENTE** | 🔴 **AUSENTE** |
| `U+2605 ★` | ✅ **PRESENTE** | 🔴 **AUSENTE** |
| `U+2190 ←` `U+2191 ↑` `U+2193 ↓` | 🔴 ausentes | 🔴 ausentes |
| `U+2713 ✓` `U+2714 ✔` `U+2197 ↗` | 🔴 ausentes | 🔴 ausentes |
| `U+2248 ≈` `U+2260 ≠` `U+2606 ☆` | 🔴 ausentes | 🔴 ausentes |
| `ç ã õ á é í ó ú â ê ô à` | ✅ completos | ✅ completos |
| `R$` `%` `º` `ª` `—` `·` | ✅ completos | ✅ completos |

Ocorrências no markup: **`→` 9×** · **`★` 10×**, ambos como **caractere literal de texto**.

**Correção de precisão (o documento está certo, mas a nuance importa).** A estrela **existe na
Inter**. Ela cai em fallback por **atribuição de família**, não por ausência de glifo:

```css
.hero-byline__stars { font-family: var(--font-mono); font-size:14px; letter-spacing:.04em; }   /* @21558 */
--font-mono: "JetBrains Mono","IBM Plex Mono","SF Mono",Menlo,ui-monospace,monospace;
```

O navegador percorre a cadeia **por caractere**: JetBrains (não tem) → IBM Plex Mono (não instalada
na maioria) → SF Mono / Menlo (**só macOS**) → `ui-monospace` → `monospace` genérica. No Windows
isso aterrissa em Consolas/Courier New; no Android, em Droid Sans Mono. **Forma, peso e alinhamento
vertical da estrela mudam por sistema operacional** — exatamente como o documento diz.
Mesma mecânica para a seta em `--font-sans`, que cai em `system-ui`: Segoe UI Variable no Win11,
SF no macOS, Roboto no Android. **Três desenhos de seta diferentes na mesma página.**

### 5.1 · Correção de prescrição — o documento pede o subset errado

`DIRECAO-ARTE.md` linha 296–298 prescreve gerar subset próprio
*"incluindo `U+2192 U+2190 U+2191 U+2193 U+2605 U+2713 U+2248 U+2260`"*. Três problemas.

**(a) A estrela não precisa de subset e nem de existir.** Já está na Inter. E o Talos **não tem
estrelas** — o próprio documento substitui o `★★★★★` do leanware pela "linha de honestidade"
(`DIRECAO-ARTE.md` linha 792: *"Zero estrela, zero número de terceiro"*). Carregar `U+2605` no
subset é carregar um requisito de uma página que não vai existir. **Corta.**

**(b) A seta não deve virar glifo de texto, subsetada ou não.** O documento tangencia isso
(linha 1143: *"o que num glifo de texto embola com o `letter-spacing`"*) mas mantém o subset como
correção primária. São três razões independentes, todas tipográficas:

1. **Herda `letter-spacing`.** A seta aparece justamente nos CTA de card em mono, que a spec do
   Talos manda com `.12em`. O tracking empurra a seta para longe da palavra e os sidebearings dela
   não foram desenhados contando com isso. Você teria que anular tracking num `<span>` — e se já é
   um elemento, faça um SVG.
2. **Não há seta certa para escolher.** O rótulo é **JetBrains Mono**; a seta viria da Inter (peso
   e traço de outro desenho) ou de um glifo que a mono não tem em desenho nenhum. Setas de fonte
   variável interpolam com o `wght` das letras — ótimo, se fossem da mesma família. Não são.
3. **Micro-animação.** `translateX(3px)` no hover é o padrão deste componente e é impossível num
   glifo dentro de nó de texto sem envolver em elemento. Envolveu → já é elemento → seja SVG.

```html
<!-- 🔴 proibido: caractere literal, 9 ocorrências na referência -->
<span aria-hidden>→</span>

<!-- ✅ Talos: um asset, um peso, idêntico em Windows/macOS/Android -->
<svg class="arrow" viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true" focusable="false">
  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```
```css
.arrow { vertical-align: -.125em; letter-spacing: normal; transition: translate .18s var(--ease); }
a:hover .arrow, button:hover .arrow { translate: 3px 0; }
@media (prefers-reduced-motion: reduce) { .arrow { transition: none; } }
```

**(c) O risco de subset que o documento não checou, e que é o único que pode quebrar a página.**
A lista de glifos exóticos distrai do que importa. Verifiquei: **`ç ã õ á é í ó ú â ê ô à`, `º`,
`ª`, `—`, `·`, `R$` estão completos nas duas fontes.** Isso só continua verdade se o subset for
gerado com **Latin-1 Supplement + Latin Extended-A**. Vários pipelines de subset (incluindo fatias
`latin` de CDN) derrubam `ã õ ç`.

> 🔴 **Gate de build, executável:** depois de gerar o subset, rodar
> `python -c "from fontTools.ttLib import TTFont; f=TTFont('out.woff2'); c=set().union(*[t.cmap for t in f['cmap'].tables]); print([hex(x) for x in (0xE3,0xF5,0xE7,0xC3,0xD5,0xC7,0xAA,0xBA,0x2014) if x not in c])"`
> e exigir **lista vazia**. Uma home em português com `ç` em fallback é um defeito visível para
> 100% do público — a seta ausente é visível para quem repara.

### 5.2 · Uma consequência de `font-display: swap` que ninguém levantou

Os três `@font-face` da referência declaram `font-display: swap` (confirmado, `@112844`/`@113141`).
Com o H1 a **62px / peso 800**, o swap é **o FOUT mais visível da página inteira** — o título
inteiro remonta e realinha depois do carregamento.

Isso colide direto com `ARQUITETURA-SECOES.md` §6.3 restrição 1: *"Nada na dobra pode ser revelado
depois de 500ms."* Um H1 que troca de fonte aos 900ms viola a restrição por um caminho que ninguém
mapeou, porque não é animação — é font loading.

Mínimo: `<link rel="preload" as="font" type="font/woff2" crossorigin>` nas duas famílias, e um
`@font-face` de fallback local com `size-adjust` / `ascent-override` casando as métricas da Inter.
*(Ver "ONDE EU ESTOU ERRADO" §6 — isto pode não valer o esforço agora.)*

---

## ONDE EU ESTOU ERRADO

Rigor tipográfico tem custo. Seis lugares onde o meu custa mais do que entrega neste negócio.

**1 · `cv05` / `cv08` — não é opcional, é para cortar.**
O documento marca como "OPCIONAL — decisão de gosto do founder" (linha 282). Eu vou além: **corta
de vez.** Essas features desambiguam `l` de `I`. Isso importa em código, ID, senha e número de
série — **nada disso está nesta página.** Nenhum dono de PME deixou de contratar por causa de um
`l`. E a declaração `font-feature-settings` no `:root` é perigosa: ela é substituída inteira por
qualquer `font-feature-settings` mais específico, então o `.tabular { "tnum" 1 }` do §1.2 **apaga o
`cv05/cv08`** naquele escopo sem avisar ninguém. Custo real > zero, benefício = zero. Fora.

**2 · A minha grade de tracking de seis passos é ceremônia.**
A diferença entre `−.035em` liso e a grade correta, a 44px, é **0,44px por par de caracteres**.
Ninguém vai perceber numa página vista por 40 segundos, e são 6 tokens a manter. Se o time é
pequeno e o que importa é embarcar:

```css
/* versão de dois valores — pega ~80% do ganho, custa 2 tokens */
--track-display: -.03em;   /* tudo ≥32px */
--track-text:     0;       /* tudo <32px */
```

Embarque essa. Minha grade de seis está tecnicamente certa e não vale a burocracia.

**3 · A briga 62 vs 112 é a menos importante das cinco, e eu ganhei ela cedo demais.**
Argumentei duro pelo 62 porque foi o que me pediram. Mas seja honesto sobre a ordem de grandeza:
**este site não perde venda por tamanho de display.** Ele perde porque não tem case, não tem
depoimento e não tem logo de cliente — e a peça que carrega esse peso sozinha é a **"linha de
honestidade"**, que `ARQUITETURA-SECOES.md` §6.2 marca como a copy mais arriscada da página e que
**segue travada em gate do founder**. Aquele gate vale 10× o token de display. Se sobrar uma hora
esta semana, gaste na frase, não no pixel.

**4 · Eu chamei `font-optical-sizing: auto` de load-bearing. É — e também é invisível.**
A diferença visível entre Inter opsz 14 e opsz 32 a 62px é sutil: espacejamento um pouco mais
apertado, juntas marginalmente mais leves. **Ninguém vai ver num print lado a lado.** É grátis,
então faça. Mas o documento vende como *"o diferencial tipográfico mais barato disponível neste
projeto"* (linha 219) e isso é superdimensionar. **Barato não é o mesmo que diferenciador.** O que
diferencia esta página é o painel que roda de verdade em 2ms contra um `role="img"` com spinner
falso — não o eixo óptico.

**5 · Fundir 13px em 14px pode ser um degrau que vou ter que devolver.**
FAQ, rodapé e nota de tabela às vezes precisam mesmo de algo entre 14 e 11. Estou removendo por
princípio de escala e posso estar errado no concreto. Se o conteúdo real pedir, **acrescente 12px
— quando um pedaço de conteúdo real pedir, não preventivamente.** Escala se conquista com conteúdo
na mão, não com planilha. *"Test with real content, never Lorem Ipsum."*

**6 · O parágrafo de `size-adjust` / `ascent-override` do §5.2 é engenharia cara.**
Casar métricas de fallback são ~30 minutos de tentativa e erro e um número de CLS que só importa se
houver tráfego pago batendo nesta página. **Se ainda não há campanha apontando para o site, faça só
o `preload` e siga.** O `font-display: swap` da referência é aceitável até existir mídia paga.

**7 · Onde eu posso estar simplesmente errado.**
Não medi renderização real — não abri navegador, não tirei print, não vi o hinting da JetBrains Mono
a 11px no Windows com ClearType, que é onde a maioria do público vai ler. Minhas medições são de
**contorno de fonte e caixa de linha**, e são exatas nesse plano. Rasterização a 10–11px pode
melhorar ou piorar o quadro do item 4. **A colisão vertical de `AUTOMAÇÃO` a 13,2px de caixa é
geometria e não muda com rasterizador. O julgamento de "letras param de ler como palavra" a
`.16em` é meu olho, não meu paquímetro — teste num print antes de aceitar cegamente.**

---

## A PERGUNTA QUE SÓ O FOUNDER RESPONDE

Toda a metade de baixo da escala corrigida — corpo a 17px em vez de 15px, piso de 16px no celular,
entrelinha de rótulo 29% maior, morte do 10px — vem de **uma única premissa que eu assumi e não
posso verificar**: que quem abre este site é o **dono**, 45+, lendo no celular, provavelmente em
condição ruim (chão de fábrica, balcão, no fim do dia).

Se essa premissa estiver errada, a régua inteira muda — e muda **na direção da referência**, ou seja,
o site pode ficar mais denso, mais próximo do leanware, e eu passo a estar recomendando o pior dos
dois mundos.

> ### **Quem abre este site e decide: o dono, ou alguém que ele manda olhar?**
>
> Se for o **dono** (45+, não-técnico, celular): a escala corrigida vale inteira. Corpo 17px, e
> a página vai parecer ~10% mais "espaçada" que o leanware. É de propósito.
>
> Se for **quem ele manda olhar** — o filho que cuida do sistema, o gerente de operações, o cara
> de TI, 28–35, desktop, confortável com densidade: eu recuo o corpo para 16px, aperto o leading
> para 1.55, e a página fica visivelmente mais próxima da referência que ele pediu para copiar.
>
> Se forem **os dois** (mais provável, e a resposta mais cara): quem decide é o dono, quem avalia
> é o técnico. Aí manda o dono e vale a escala corrigida — mas eu preciso ouvir isso dele, porque
> significa aceitar de propósito que o site **não vai ficar idêntico ao leanware**, e essa foi a
> instrução original.

Não é pergunta de gosto. É a variável que determina três tokens e o quanto o resultado vai poder
parecer com a referência. Nenhuma medição minha responde.

---

## RESUMO DE MUDANÇAS PARA O `DIRECAO-ARTE.md`

| # | onde | mudança | severidade |
|---|---|---|---|
| 1 | §1.2, linha 248 | 🔴 **Corpo 15px → 17px** (16px piso mobile). Justificativa dos "61 usos" é artefato de substring: o isolado é 12, não 61 | **bloqueante** |
| 2 | §1.2, linhas 240–252 | 🔴 Escala 11 degraus → **7 níveis semânticos com valores responsivos**. `--t-h3` (32) e `--t-h1` (52) não são níveis, são breakpoints do `--t-section` — provado no markup | **bloqueante** |
| 3 | §1.2 / §1 tabela | 🔴 **`--t-label` line-height 1.2 → 1.45.** `Ç`+`Ã` ocupam 12,86px numa caixa de 13,2px | **bloqueante** |
| 4 | §1.2, linha 274 | 🔴 `font-optical-sizing: auto` promovido de "refinamento" a **premissa**. Proibir `font-variation-settings` para peso | **bloqueante** |
| 5 | §1.2, linha 251 | `--t-label` tracking `.16em` → **`.12em`** (mono já traz sidebearing; GPOS vazia, sem `cpsp`) | alta |
| 6 | §1.2, linha 252 | **`--t-micro` 10px eliminado** → 11px @600 + `--ink-3`. Caixa alta de 7,3px | alta |
| 7 | §1.2, linha 246 | Corrigir: `--t-h5` ≠ `.service-card__title` (1.4 vs **1.25**, e o componente tem `−.01em`) | alta |
| 8 | §1.2, linha 297 | Subset: **tirar `U+2605`** (já na Inter, e o Talos não tem estrelas) · **tirar a seta** (vira SVG) · **acrescentar gate de Latin-1/Ext-A** | alta |
| 9 | §1.2, linha 262 | 52px morre **e não volta** como `clamp` ad-hoc no CTA — é o mesmo defeito que o doc acusa em `@19504` | média |
| 10 | §1.2, linha 245 | `--t-h4` 21px eliminado — **0 usos no markup da referência** | média |
| 11 | §1.2, linha 282 | `cv05`/`cv08` **cortados**, não "opcionais" — `font-feature-settings` mais específico os apaga | média |
| 12 | §1.2 (novo) | Regra de medida: `max-inline-size: 62ch` em prosa · **gate de copy: nenhuma linha do H1 acima de 20 caracteres** | média |
| 13 | §4 §1, linha 788 | 62px **mantido** — reargumentado por medida (22 chars) e por eixo óptico (opsz para em 32), não por obediência | ✅ confirmado |
| 14 | §5, defeito nº 3 | Achado da seta/estrela **confirmado por fontTools**; nuance: `U+2605` existe na Inter, cai por atribuição de família em `@21558` | ✅ confirmado |
| 15 | §1.2 / ARQ §6.3 | `font-display: swap` no H1 de 62px/800 = FOUT que viola a restrição dos 500ms por caminho não mapeado. `preload` no mínimo | baixa |

---

*Tudo acima foi medido em `InterVariable.woff2` v4.001 e `JetBrainsMono.woff2` v2.211 da captura em
`02-references/inputs/leanware/assets/fonts/`, e em `pages/home/page.html` (265.812 chars) e
`pages/home/intel.json` (23 headings). Nenhum valor foi estimado. Onde eu não medi — rasterização
em tela real — está declarado em "ONDE EU ESTOU ERRADO" §7.*

*Boa tipografia é invisível. Você só repara quando está ruim. O `line-height: 1.2` dos rótulos ia
passar despercebido em inglês e ia empastar em português — e ninguém saberia dizer por que a página
parecia amadora.*

— Erik Spiekermann, making words visible
