# NOTAS — mockup-v2 (gate F4)

**Data:** 2026-07-31 · **Autor:** `@design-chief`
**Artefato:** `05-build/mockup-v2/` — HTML estático, 465 KB, 14 seções, zero CDN
**Telas:** `05-build/shots-v2/` — 14 quadros a 1440×900 · 22 a 390×844 · 14 sem JavaScript

> 🔴 **Nenhum `.tsx` foi tocado.** `apps/talos/` está exatamente como estava.
> 🔴 **Não criei `APROVADO.md`.** O gate F4 continua fechado e quem o abre é o founder.

---

## 0. O que este mockup é, em uma frase

**Espinha do `wf-conicorn`, gesto do `fr-stackgrid`, tokens do `DIRECAO-ARTE.md`, copy do `COPY-V2.md`.**
Levei do conicorn a *sequência numerada de argumento*; **não** levei um pixel da pele dele.

### Como abrir

O `index.html` carrega o motor como módulo ES — `file://` não serve (CORS). Suba um servidor:

```bash
cd docs/projects/aiox-site/05-build          # ← a partir de 05-build, não de mockup-v2
npx --yes serve .                            # as fotos vivem em ../03-assets/
# depois: /mockup-v2/index.html        → a página inteira
#         /mockup-v2/secoes/index.html → aprovar uma seção de cada vez
```

**O conteúdo funciona com JavaScript desligado.** Os 14 quadros `v2-semjs-*` provam: o mapa da §5 já
vem renderizado no HTML com a saída real do motor; o JS só o recalcula quando o visitante escreve.

### Aprovação seção a seção (o que o gate F4 pede)

`secoes/index.html` lista as 14 seções. Cada linha abre **um arquivo isolado**, no sistema real, com
uma barra no topo dizendo de qual seção do conicorn aquele bloco veio. Aprovar ou reprovar uma
não trava as outras. Os arquivos são gerados por `build.mjs` a partir da **mesma fonte** do
`index.html` — não existe divergência possível entre a seção isolada e a página inteira.

---

## 1. De qual seção do conicorn veio cada bloco

Base medida: `02-references/inputs/conicorn/pages/home/intel.json` — 14.307px, `bodyBg rgb(255,255,255)`,
11 seções numeradas `001`…`010` + footer com CTA.

**O achado que decidiu o encaixe:** o conicorn tem **10 seções numeradas + 1 CTA de rodapé sem número**.
A `ARQUITETURA-SECOES.md` §2.1 tem **10 seções entre a dobra e o FAQ + contato + rodapé**.
A cardinalidade bate exatamente. A numeração `001`…`010` não precisou ser esticada nem cortada.

| # | mockup-v2 | ← seção do conicorn | tipo de herança |
|---|---|---|---|
| §0 | Nav | pílula flutuante `☰ Menu` + `Get this Template` | 🔴 **refeita** — ver §2, corte 5 |
| §1 | Hero | `section.hero` (h 988px, H1 80px centrado) | 🔁 **recomposto** de centrado para 2 colunas — ver §3 |
| §2 | `001` O que a máquina faz | `001 WHO WE ARE` + a faixa de stat/vídeo logo abaixo | 🔁 mesmo slot, conteúdo trocado |
| §3 | `002` O problema | `002 ● VALUES` — “Why Choose Us?”, 3 cards com número `01/02/03` | ✅ geometria idêntica |
| §4 | `003` Casos de uso | `003 ● CAPABILITIES` — “Our AI-Driven Services”, 3 cards grandes | ⚠️ 3 cards → 4 abas × 4 processos |
| §5 | `004` O mapa ao vivo | `005 ● CASE STUDIES` — “What We’ve Built”, container largo mídia+copy a 5.934px (≈43%) | ✅ **a troca central**: o case sai, o motor entra, mesmo container |
| §6 | `005` Como funciona | `004 ● PROCESS` — “How We Work”, trilho vertical, nós alternando lado, 5 passos | ✅ **melhor encaixe da página**. 5 → 3 |
| §7 | `006` Quem faz | `009 ● TEAM` — “Meet the Conicorn’s Minds”, 4 rostos | 🔁 4 rostos → **uma** pessoa |
| §8 | `007` Por onde começa | geometria de `002`/`003` | ⚠️ vira 2 colunas de peso igual |
| §9 | `008` Como se compara | 🔴 **não existe no conicorn** | ➕ construída do zero, **na gramática dele** |
| §10 | `009` O que fica combinado | grade `Your Data. Protected. Always.` — 4 células horizontais | ✅ 4 → 3 (teto Baymard) |
| §11 | `010` Perguntas | `010 ● FAQS` — “Common Questions”, acordeão numerado | ✅ numeração mantida |
| §12 | Contato | bloco de CTA do rodapé (“Your Competitors Are Automating. Are you?”) | ✅ **sem número, como lá** |
| §13 | Rodapé | `footer` — colunas de link + carimbo | ✅ |

### A espinha propriamente dita — o que foi copiado como *sistema*, não como seção

Do markup real (`page.html`, `.eye-brow` > `.eye-brow-number` + `.eye-brow-dot` + `.eye-brow-text`,
`padding:.6em 1em`, `border-radius:round`, `text-transform:uppercase`, `container-medium: 65rem`):

1. **A pílula numerada.** Toda seção abre com `NNN ● RÓTULO` numa pílula centrada. É o objeto que faz
   a página ler como **argumento em ordem** e não como folheto com blocos. É a coisa mais barata e
   mais estrutural que o conicorn tem, e é achromática.
2. **Cabeçalho centrado de três degraus:** pílula → H2 → subhead com medida contida.
   Repetido 12 vezes sem exceção — a repetição *é* a gramática.
3. **Contêiner de 65rem** para o cabeçalho, com o conteúdo abrindo mais largo abaixo.
4. **Card com número no canto** (`.value-card-number`) na §3.
5. **Trilho vertical com nós alternando lado** (`004 PROCESS`) na §6.
6. **Container largo, no meio da página, reservado para o objeto que carrega a credibilidade** —
   no conicorn é o case; aqui é o motor rodando. Mesmo slot, mesma posição relativa, credibilidade oposta.

---

## 2. O que foi deletado, e por quê

### 2.1 As quatro proibições do `CONTEXT.md` §3 — saíram, não foram adaptadas

| corte | onde estava no conicorn | por que sai |
|---|---|---|
| **1 · logo de cliente “LGPSM”** | sob o título “What We’ve Built” (`005`) | logo de cliente que não é cliente. `CONTEXT.md` §3, inegociável. Não existe versão suave disso |
| **2 · números de vitrine “50” e “X FASTER”** | faixa de stat pós-hero | não há número honesto para nenhuma célula. O slot foi ocupado pelos **dez verbos**, que não afirmam prova social nenhuma e são todos verificáveis na §5 |
| **3 · vídeo corporativo com *tells* de IA** | mesma faixa, com botão de play | três pessoas numa sala branca **afirma equipe sem escrever uma palavra**. O Talos é uma pessoa. Além disso, NN/g: para serviço converte *trabalhador em ação em todos os estágios*, não reunião genérica |
| **4 · seção inteira de depoimento** | `007 ● TESTIMONIAL` (1.904px, a maior da página) | não existe versão honesta e mais fraca de um depoimento. A fatia virou a §9 (Como se compara), que responde a mesma pergunta de fundo — *“estou cometendo um erro?”* — sem depender de terceiro |

### 2.2 Cortes adicionais, com o motivo

| corte | por quê |
|---|---|
| **5 · nav com hamburger em desktop** | o conicorn esconde a navegação inteira atrás de `☰ Menu`. A arquitetura §1 exige `quem faz` e `falar comigo` **visíveis** — o visitante do D2 já falou com o founder e a pergunta nº 1 dele é “quem é esse cara”. Enterrar isso num hamburger é enterrar a única credencial que existe |
| **6 · `008 PRICING` inteira (1.533px)** | `CONTEXT.md` T4: nenhum preço na página. A seção não foi substituída por “consulte-nos” — a ausência é deliberada e a arte não a compensa com selo. O que paga a conta é a densidade de escopo da §8 + a pergunta de preço no FAQ |
| **7 · `006 INTEGRATIONS` — “HubSpot Salesforce Zoho Mailchimp”** | fileira de logo de ferramenta é a saída padrão de agência sem cliente. Para um dono de metalúrgica em Santa Catarina isso não significa nada e ainda sinaliza *“isso é coisa de TI”* — o oposto exato do posicionamento |
| **8 · card de chat com a bolha “Can you tell me more about pricing?”** | viola duas regras de uma vez: `ARQUITETURA-SECOES` §4.6 (*“não vira chat”*) e a proibição de preço |
| **9 · preloader de 900px** | tela de espera antes do H1 queima a janela de 10 segundos inteira. `ARQUITETURA-SECOES` §6.3-1: nada na dobra pode ser revelado depois de 500ms |
| **10 · ícones 3D vidrados** | é a pele. Aqui todo ícone é SVG de traço, `stroke: currentColor` — ver §8 |

### 2.3 🔴 O corte que não é de conteúdo, e é o mais importante

**A iridescência policromática.**

Medido nas 16 capturas (`shots-completo/wf-conicorn-*.png`), o croma do conicorn se espalha por
**seis buckets de matiz** — 210°, 195°, 15°, 45°, 30°, 225°. Isso não é decoração: é a identidade.
E a `DIRECAO-ARTE` Parte 3.2 já resolveu essa classe de pergunta — escolher o default da categoria é
a **definição operacional de “genérico”**, que é literalmente a palavra com que o founder rejeitou
três builds. Verde é *um* default de 2026; iridescência é *o* default.

Consequência medida: sobre o branco `#ffffff` do conicorn o bronze `#E9A23B` mede **2,17:1**; sobre o
card `#f2f2f2`, **1,93:1**. Reprova AA, AAA **e o piso de 3:1 de componente**. Sobre `#0f0f0f` mede
**8,85:1**. Escuro não é gosto: é a única faixa onde o acento aprovado sobrevive.

**Neste mockup existe exatamente um matiz cromático — bronze, h36.** Tudo o mais é `hsl(0,0%,L)`.

---

## 3. Onde o gesto de linha do stackgrid foi aplicado

O stackgrid é o único dos quatro finalistas cujo gesto é feito de **linha, não de campo**
(0,89% de superfície cromática, o menor do grupo). É também literalmente a Regra de forma nº 1 da
`DIRECAO-ARTE` §1.3: *“a estrutura é desenhada com linha de 1px, não com bloco de cor”*.

Seis objetos colhidos. Todos achromáticos, todos sobrevivem à inversão.

| # | gesto | CSS | onde aparece |
|---|---|---|---|
| 1 | **moldura de folha** — dois filetes verticais fixos emoldurando a página como folha sobre a mesa | `.folha` · `position:fixed` · 1px `--border` em `calc(50% ∓ 640px)` | página inteira (some abaixo de 1360px). O **hero sangra até os filetes** (max-width 1280) e as seções ficam **por dentro** (max-width 1080) — é isso que dá o ritmo |
| 2 | **marca de corte `+`** ladeando a etiqueta | `.crop::before/::after` — duas hairlines cruzadas de 9px, `--border-strong` | as 12 pílulas numeradas de seção |
| 3 | **chip sólido de rótulo** | `.chip` — retângulo `--card` + filete `--border-strong` + mono caixa alta | etiqueta de categoria dos 16 processos (§4) · `o que eu li` (§5) · `o que está incluso` / `o que vem depois` (§8) · `bloqueio real` (§7) |
| 4 | **borda tracejada** = *o que ainda não existe* | `.card--tracejado` · `.etapa--naoli` · `.sn-meio` | coluna “o que vem depois” da §8 (a borda tracejada é **literal**: isto ainda não está no seu contrato) · etapa “não li” do mapa · marca “às vezes” da matriz |
| 5 | **linha-guia com etiqueta** | `.guia .traco` | cabeçalho do painel de saída da §5, ligando `o que eu li` ao resumo da classificação |
| 6 | **grafo de nós no trilho** | `.trilho::before` + `.passo::after` | §6 — o nó ativo acende em bronze e acompanha o scroll |

> **O encaixe não é decorativo.** A §5 pede *etapa · filete de 2px · ícone de forma distinta · rótulo*
> — três sinais, nunca só cor (SC 1.4.1). O stackgrid já fala essa língua; o conicorn teria que aprender.
> É por isso que a espinha vem de um e o gesto do outro, e não o contrário.

---

## 4. Contraste — 46 pares, todos MEDIDOS

**Método.** Cada linha passou pelo handler **`contrast_check` real do `mcp-design-studio`**, carregado
como módulo ES a partir de `D:/jarvis/mcp-design-studio/dist/providers/contrast-provider.js`. Não é
reimplementação — é o mesmo caminho de código que a tool MCP expõe (a superfície MCP não está
disponível para subagente; mesmo método declarado na `DIRECAO-ARTE` Parte 0.2).

Tokens com alfa foram **compostos sobre o fundo real** antes da medição; a coluna `composto` mostra o
hex resultante. Sem isso o número não significa nada.

**Reprodutível:** `node medir-contraste.mjs` (na pasta deste mockup).

**Placar: 46 pares · 0 reprovações não-intencionais.**
A única reprova da tabela é o par `ink / bronze` (2,08:1), medido de propósito para ficar registrado
como **proibido** — branco nunca vai sobre fill bronze.

| par | fg | composto | fundo | ratio | AA | AAA | UI 3:1 | veredito | uso |
|---|---|---|---|---|---|---|---|---|---|
| ink / bg | `#fafafa` | — | `#0f0f0f` | **18.36:1** | ✅ | ✅ | ✅ | AAA | H1, H2 de seção, título de card |
| ink / surf | `#fafafa` | — | `#141414` | **17.65:1** | ✅ | ✅ | ✅ | AAA | H2 em faixa alternada |
| ink / card | `#fafafa` | — | `#1a1a1a` | **16.67:1** | ✅ | ✅ | ✅ | AAA | título de card, pergunta do FAQ |
| ink / card-hover | `#fafafa` | — | `#212121` | **15.43:1** | ✅ | ✅ | ✅ | AAA | título de card sob hover |
| ink-2 / bg | `#fafafaa8` | `#aaaaaa` | `#0f0f0f` | **8.25:1** | ✅ | ✅ | ✅ | AAA | subhead centrado da gramática conicorn |
| ink-2 / surf | `#fafafaa8` | `#acacac` | `#141414` | **8.12:1** | ✅ | ✅ | ✅ | AAA | corpo em faixa alternada |
| ink-2 / card | `#fafafaa8` | `#aeaeae` | `#1a1a1a` | **7.84:1** | ✅ | ✅ | ✅ | AAA | corpo de card |
| ink-2 / card-hover | `#fafafaa8` | `#b0b0b0` | `#212121` | **7.42:1** | ✅ | ✅ | ✅ | AAA | corpo de card sob hover |
| ink-2 / border | `#fafafaa8` | `#b2b2b2` | `#262626` | **7.14:1** | ✅ | ✅ | ✅ | AAA | célula da matriz §9 — **pior caso** |
| ink-3 / bg | `#fafafa7d` | `#828282` | `#0f0f0f` | **4.99:1** | ✅ | ❌ | ✅ | AA | legenda, premissa da conta, meta |
| ink-3 / surf | `#fafafa7d` | `#858585` | `#141414` | **4.99:1** | ✅ | ❌ | ✅ | AA | legenda em faixa alternada |
| ink-3 / card | `#fafafa7d` | `#888888` | `#1a1a1a` | **4.91:1** | ✅ | ❌ | ✅ | AA | rótulo de card, placeholder do textarea |
| ink-3 / card-hover | `#fafafa7d` | `#8b8b8b` | `#212121` | **4.73:1** | ✅ | ❌ | ✅ | AA | rótulo sob hover |
| ink-3 / border | `#fafafa7d` | `#8e8e8e` | `#262626` | **4.62:1** | ✅ | ❌ | ✅ | AA | glifo “não” da matriz — **pior caso** |
| ink-4 / bg | `#fafafa5c` | `#646464` | `#0f0f0f` | **3.24:1** | ❌ | ❌ | ✅ | OK | SÓ decoração (marca de corte, filete) |
| ink-3 / chip@bg | `#fafafa7d` | `#868686` | `#171717` | **4.92:1** | ✅ | ❌ | ✅ | AA | número `001`…`010` da pílula (gesto conicorn) |
| ink-3 / chip@surf | `#fafafa7d` | `#888888` | `#1b1b1b` | **4.86:1** | ✅ | ❌ | ✅ | AA | número da pílula em faixa alternada |
| ink-4 / chip@bg | `#fafafa5c` | `#696969` | `#171717` | **3.27:1** | ❌ | ❌ | ✅ | OK | SÓ decoração dentro da pílula |
| ink-4 / card | `#fafafa5c` | `#6b6b6b` | `#1a1a1a` | **3.27:1** | ❌ | ❌ | ✅ | OK | número `01/02/03` do card da §3 — decorativo |
| ink-3 / soft@bg | `#fafafa7d` | `#8d8a84` | `#251e13` | **4.79:1** | ✅ | ❌ | ✅ | AA | legenda sobre brilho radial |
| bronze / bg | `#E9A23B` | — | `#0f0f0f` | **8.85:1** | ✅ | ✅ | ✅ | AAA | rótulo do eyebrow, número, CTA mono, foco |
| bronze / surf | `#E9A23B` | — | `#141414` | **8.51:1** | ✅ | ✅ | ✅ | AAA | eyebrow em faixa alternada |
| bronze / card | `#E9A23B` | — | `#1a1a1a` | **8.04:1** | ✅ | ✅ | ✅ | AAA | CTA de card, ícone, carimbo da §3 |
| bronze / card-hover | `#E9A23B` | — | `#212121` | **7.43:1** | ✅ | ✅ | ✅ | AAA | CTA de card sob hover |
| bronze / border | `#E9A23B` | — | `#262626` | **6.99:1** | ✅ | ❌ | ✅ | AA | marca “sim” da matriz — **pior caso** |
| bronze / chip@bg | `#E9A23B` | — | `#171717` | **8.28:1** | ✅ | ✅ | ✅ | AAA | rótulo + ponto da pílula (gesto conicorn) |
| bronze / chip@surf | `#E9A23B` | — | `#1b1b1b` | **7.95:1** | ✅ | ✅ | ✅ | AAA | pílula em faixa alternada |
| bronze / wash@bg | `#E9A23B` | — | `#1a1611` | **8.31:1** | ✅ | ✅ | ✅ | AAA | coluna “comigo” da matriz sobre bg |
| bronze / wash@surf | `#E9A23B` | — | `#1f1b16` | **7.90:1** | ✅ | ✅ | ✅ | AAA | coluna “comigo” da matriz sobre surf |
| bronze / wash@card | `#E9A23B` | — | `#25211c` | **7.38:1** | ✅ | ✅ | ✅ | AAA | etapa automatizável do mapa §5 |
| bronze / soft@card | `#E9A23B` | — | `#2f281d` | **6.72:1** | ✅ | ❌ | ✅ | AA | ícone dentro do chip |
| bronze-2 / bg | `#de9517` | — | `#0f0f0f` | **7.68:1** | ✅ | ✅ | ✅ | AAA | base do gradiente do H1 |
| bronze-hover / bg | `#df9320` | — | `#0f0f0f` | **7.61:1** | ✅ | ✅ | ✅ | AAA | link em hover |
| ink-2 / wash@surf | `#fafafaa8` | `#afaeac` | `#1f1b16` | **7.72:1** | ✅ | ✅ | ✅ | AAA | corpo na coluna destacada da matriz |
| ink-2 / wash@card | `#fafafaa8` | `#b1b0ae` | `#25211c` | **7.38:1** | ✅ | ✅ | ✅ | AAA | texto da etapa automatizável §5 |
| on-bronze / bronze | `#190f00` | — | `#E9A23B` | **8.74:1** | ✅ | ✅ | ✅ | AAA | texto do botão primário |
| on-bronze / bronze-hover | `#190f00` | — | `#df9320` | **7.51:1** | ✅ | ✅ | ✅ | AAA | botão primário **em hover — mantém AAA** |
| **ink / bronze** | `#fafafa` | — | `#E9A23B` | **2.08:1** | ❌ | ❌ | ❌ | 🔴 **PROIBIDO** | branco sobre fill bronze — medido para ficar registrado |
| border / bg | `#262626` | — | `#0f0f0f` | **1.27:1** | — | — | — | isenta (SC 1.4.11) | filete de seção, **moldura de folha** |
| border-strong / bg | `#303030` | — | `#0f0f0f` | **1.45:1** | — | — | — | isenta | **borda tracejada** (gesto stackgrid) |
| border-strong / surf | `#303030` | — | `#141414` | **1.40:1** | — | — | — | isenta | tracejado em faixa alternada |
| border / card | `#262626` | — | `#1a1a1a` | **1.15:1** | — | — | — | isenta | borda de card |
| ring@card / card | `#E9A23B38` | `#473821` | `#1a1a1a` | **1.54:1** | — | — | — | isenta | borda de card ativo/hover |
| foco bronze / bg | `#E9A23B` | — | `#0f0f0f` | **8.85:1** | — | — | ✅ | OK | `outline 2px` (SC 1.4.11, piso 3:1) |
| foco bronze / card | `#E9A23B` | — | `#1a1a1a` | **8.04:1** | — | — | ✅ | OK | idem sobre card |
| foco bronze / border | `#E9A23B` | — | `#262626` | **6.99:1** | — | — | ✅ | OK | idem sobre borda — **pior caso do foco** |

### Regras que saem da tabela e estão implementadas no CSS

1. 🔴 `--ink-4` **nunca carrega texto.** Só marca de corte, filete, número decorativo. Se precisa ser
   lido, é `--ink-3`.
2. 🔴 `--ink` branco **nunca** vai sobre fill bronze. Sobre bronze só `--on-bronze`.
3. **A borda de 1px é decorativa e isenta de 1.4.11 — por isso mesmo nunca é o único portador de
   informação.** Estado ativo = borda bronze **+** um segundo sinal (fundo `--bronze-wash`, ícone, peso).
4. **SC 1.4.1 (uso de cor):** as três marcas da matriz e os quatro estados do mapa têm **forma
   distinta + rótulo textual**, não só cor. `sim/não/às vezes` e `sai da sua mão / fica pela metade /
   fica com você / não li` estão escritos, em mono, ao lado do glifo.

---

## 5. PT-BR — o que foi medido nos `.woff2` que este mockup serve

`fontTools 4.62.1` sobre `fonts/InterVariable.woff2` (99,6 KB) e `fonts/JetBrainsMono.woff2` (36,7 KB),
ambos self-hosted, SIL OFL 1.1. **Reprodutível:** `python medir-ptbr.py`.

| medição | Inter (upm 2048) | JetBrains Mono (upm 1000) |
|---|---|---|
| altura de caixa alta inglesa (`H`) | **0,7275 em** | 0,7300 em |
| topo da caixa alta acentuada (`Ã`) | **0,9424 em** | 0,9500 em |
| base da caixa alta acentuada (`Ç`) | **−0,2095 em** | −0,2030 em |
| **vão vertical total da caixa alta PT-BR** | **1,1519 em** | **1,1530 em** |
| **acréscimo sobre a caixa alta inglesa** | **+58,3%** | +57,9% |
| vão da caixa **baixa** acentuada (`ã` sobre `g/p/ç`) | **0,9604 em** | — |

> 🔧 **Correção ao número do briefing.** Os **29%** citados são só o lado de cima:
> `Ã` a 0,9424 contra `H` a 0,7275 = **+29,5%**. Medindo a caixa inteira — que é o que a entrelinha
> tem de acomodar, porque o `Ç` desce **0,2095 em** abaixo da linha de base — o acréscimo é
> **+58,3%**. Dimensionar entrelinha de caixa alta pelos 29% erra por um fator de dois.

### O que isso mudou no sistema

| token | valor da `DIRECAO-ARTE` | aqui | por quê |
|---|---|---|---|
| `--t-label` (mono, **CAIXA ALTA**) | lh **1,20** | **1,45** | 1,20 deixa **0,5 px** de folga a 11px. `Ç` e `Ã` empilhados encostam. 1,45 dá **3,3 px** |
| `--t-micro` (mono, **CAIXA ALTA**) | lh **1,20** | **1,45** | idem, a 10px |
| H2 de seção | lh **1,06** | **1,10** | 1,06 dava 4,4 px de folga sobre o vão de caixa baixa (0,9604 em). 1,10 dá **6,2 px** — acomoda `ç/ã/ê` de “começa”, “opções”, “Três” sem colisão |
| `--t-display` (H1, 62px) | lh **1,08** | **1,08** ✅ | folga medida **+7,4 px**. Não precisou mexer |

Tracking: `.16em` na caixa alta mantido — o til e a cedilha vivem dentro do avanço do glifo, então
tracking não os salva; entrelinha salva. Mas `.16em` continua sendo o que torna caixa alta acentuada
legível em 11px, e o mockup usa **caixa alta só em rótulo mono**, nunca em título.

🔴 **Zero Lorem ipsum.** Toda a copy é PT-BR do `COPY-V2.md` — H1 Opção 1, os 3 cards da §3
reescritos, os 16 processos da §4 com as correções de língua por aba, os 8 FAQs, as 7 linhas da §9.

⚠️ **Pendência de subset herdada.** Nenhuma das duas fontes contém `U+2192 →`, `U+2605 ★`,
`U+2713 ✓`. Por isso **todo ícone deste mockup é SVG inline com `stroke: currentColor`** — nenhuma
seta, estrela ou check aparece como caractere de texto. Quando o build real gerar o subset próprio,
incluir esses codepoints fecha o defeito na origem; até lá a regra do SVG resolve.

---

## 6. A §3 (demo ao vivo) — o lugar e o dimensionamento

**Lugar:** slot `005 CASE STUDIES` do conicorn — container largo, no meio da página, a ≈43% da altura.
É o mesmo movimento que a arquitetura já tinha projetado contra o leanware (840px de case viram o
demo). O container que o conicorn reserva para *“o que já construímos”* é exatamente o container que o
Talos precisa para *“o que ela faz com o seu processo, agora”*.

**O motor roda de verdade.** `js/mapear.js` é cópia de `apps/talos/lib/mapear.ts` compilada. Os
números do HTML estático **não foram digitados à mão** — saíram da execução real no build
(`node build.mjs --motor` reimprime a saída inteira).

**Dimensionamento — medido, não estimado.** Rodei o motor sobre **7 textos em PT-BR** no registro do
público (orçamento por WhatsApp, pedido → ERP, relatório de segunda, recepção de clínica, etc.):

| medição | valor |
|---|---|
| etapas devolvidas por texto | 6 · 6 · 3 · 5 · 3 · 4 · 2 |
| **mediana** | **4** |
| **máximo** | **6** |
| altura renderizada de uma linha de etapa | **72 px** (medida no DOM, 1440×900) |
| gap entre linhas | 10 px |

→ `.etapas-lista { min-height: 482px }` = **6 × 72 + 5 × 10**.

**Por que isso importa e não é detalhe:** sem a reserva, o painel salta de altura entre um processo
curto e um longo — e o salto acontece **exatamente no clique que carrega a única prova do site**.
Verificado no navegador: com 6 etapas o painel mede **1201 px**; ao reduzir para 2 etapas, **1199 px**.
Delta de 2 px. Acima de 6 etapas o painel **cresce**; nunca rola dentro de si.

**As quatro regras de credibilidade estão implementadas e não podem ser “melhoradas”:**

1. **Zero delay artificial, zero spinner.** O painel “a máquina por dentro” mostra o tempo real,
   por operação. O total medido nas execuções deste build ficou entre **0,32 ms e 1,8 ms**.
2. **Etapa não reconhecida vale 0 minuto** e é marcada `não li`, com borda **tracejada** (gesto
   stackgrid nº 4) — a forma diz que aquilo está fora da conta.
3. **A premissa aparece junto do número**, e a conta inteira fica escrita embaixo.
4. **A frequência quem informa é o visitante** — e o seletor tem `por semana` **e** `por mês`
   (a `SINTESE` P0-6 registra que só semanal torna processo mensal inexprimível e infla 4,33×).

**O furo de conversão nº 1 está fechado.** O mapa persiste em `sessionStorage` da §5 até a §12; o card
lateral do contato **mostra** que o mapa já vai anexado (passos, quantos saem da mão, horas), em vez
de pedir cópia manual. Sem mapa em memória o card **não renderiza** — nunca pede cópia.

🔴 **Pendência do motor, declarada:** a `SINTESE` §1 registra que 16/16 processos da §4 colapsam em 1
etapa. O CTA `esse é o meu` da §4 já está ligado ao textarea da §5 neste mockup, mas **a promessa
“o mapa lê qualquer processo em texto livre” não pode ir ao ar antes do P0 do motor.** Por isso o
rodapé da §4 diz *“Não achou o seu? Escreve ele aqui embaixo com as suas palavras.”* e não a frase
mais forte.

---

## 7. Fotografia — o que está aplicado e o que ainda falta

`03-assets/` pesa **2,20 MB** (gate F3 pede ≥1,5 MB). Três das seis fotos entram na §6, uma no hero:

| slot | foto | por quê |
|---|---|---|
| §6 passo 01 | `placa-metal` | superfície plana, marcada, medida — é a mesa de trabalho |
| §6 passo 02 | `ferreiro` | `h39 s21% l13%` — matiz a **3°** do bronze, mediana de luminância igual ao fundo |
| §6 passo 03 | `esmerilhadeira` | a única com faísca; encerra a sequência com energia |
| §1 hero (fundo) | `textura-metal` | `opacity .06` + máscara linear — grão real onde a referência tem vazio |

⚠️ **A grade está aproximada em CSS, não no arquivo.** Apliquei
`filter: sepia(.34) saturate(.72) contrast(1.06) brightness(.82)` para (a) rodar a `placa-metal` de
`h182` (ciano — a única que brigava com o acento) para o quente, (b) conter a saturação e (c) baixar
o p98 de luminância, porque num sistema em que `#fafafa` é `--ink` nenhum objeto pode chegar perto da
tinta. **Isto é aproximação de mockup.** O tratamento real é handoff `@peter-mckinnon`: matiz
`36° ± 8`, saturação `≤18%`, mediana de L entre 10% e 20%, p98 de L abaixo de 70%, vinheta de 12%,
`srcset` 960/1920.

🔴 **`alt` descreve a cena e nada mais** — *“Bigorna e martelo numa forja acesa”*. Nunca “nossa
oficina”, nunca “projeto entregue”. E a §6 traz a legenda dizendo isso em português, na página.

---

## 8. Verificações que rodaram

| verificação | resultado |
|---|---|
| console do navegador | **0 erros, 0 requests falhados** em 1440×900, 390×844 e sem JS |
| funciona com JavaScript desligado | ✅ 14 quadros `v2-semjs-*` — o mapa da §5 já vem renderizado com a saída real |
| altura do documento | 12.450 px a 1440 · 18.095 px a 390 |
| **card do mapa visível em 1366×768** (restrição dura §6.3-3) | ✅ topo do card em **y=253**; os 6 objetos da dobra terminam em **y=727** contra 768 de altura |
| **mobile: card ≤120px abaixo da borda** (§6.3-6) | ✅ card em **y=856** contra borda em 844 → **12 px** |
| foco visível | `outline: 2px solid var(--bronze); outline-offset: 2px`, pior caso **6,99:1** contra piso de 3:1 |
| `prefers-reduced-motion` | bloco implementado; a faixa de verbos para |
| fontes | 2 `.woff2` self-hosted, `preload` + `font-display:swap`, **zero CDN** |
| favicon | SVG inline em data-URI — zero request |
| gate `node tools/gate.cjs F4` | ❌ **por design** — “falta APROVADO.md com o aval do founder”. Correto |

⚠️ **`tools/gate.cjs` linha 98 aponta para `05-build/mockup`, que é o mockup reprovado.** Não alterei:
mudar um gate para apontar para o meu próprio output é exatamente a coisa errada a fazer sozinho.
Decisão do lead — ver §9, item 6.

---

## 9. Decisões abertas — o que eu preciso que o founder confirme

| # | decisão | o que está no mockup hoje | o custo de mudar |
|---|---|---|---|
| **1** | **Tamanho do H2 de seção.** O conicorn usa **72px**; o token `--t-h2` da `DIRECAO-ARTE` diz **44px** (derivado do render medido do leanware). Mantive 44px porque a instrução trava os tokens — mas 44px centrado num quadro de 1280 entrega **menos presença** que o gesto original do conicorn | 44px | uma linha de CSS. Se subir, sobe junto o `line-height` (PT-BR: `Três passos`, `opções`, `começa`) |
| **2** | **A ordem da §5 e da §6.** O conicorn põe `PROCESS` **antes** de `CASE STUDIES`. A `ARQUITETURA-SECOES` §2.1 põe o demo **antes** do método. Segui a arquitetura (não reabri decisão travada), mas isso **inverte a espinha do conicorn** exatamente uma vez | demo (§5) → método (§6) | trocar dois blocos. Renumera `004`↔`005` |
| **3** | **A linha de honestidade da dobra** — *“Sem case ainda. E eu não vou inventar um.”* + `roda no seu navegador · sem cadastro · resultado em milissegundos`. É a frase mais arriscada da página inteira e a `ARQUITETURA-SECOES` §8 (D-A) já a marcava como decisão sua | está na dobra, no slot exato do selo Clutch | é copy — troca direta |
| **4** | **A célula 2 dos compromissos** — *“O preço não muda no meio”*. É obrigação comercial. Precedente: o `FAQ.tsx` atual **já diz isso**; promover a compromisso não cria obrigação nova, só a torna visível | está na §10 | tirar ou trocar por outra. **Teto rígido de 3 células** — a quarta não soma, substitui |
| **5** | **`perfil.ts` e `PERFIL.whatsapp`.** Bloqueio de publicação, não de arquitetura. Estão **visíveis na página de propósito**, marcados `[PREENCHER]`, para você ver o buraco em vez de eu escondê-lo com placeholder | §7 e §12 com os campos expostos | nome, bio, foto 4:5, LinkedIn, GitHub, WhatsApp |
| **6** | **`tools/gate.cjs` aponta para `05-build/mockup`** — a pasta do mockup que você reprovou. Enquanto apontar para lá, o gate mede o artefato errado | não alterei | uma linha. Decisão do lead, não minha |
| **7** | **O bloco “o que eu já construí”** (§7). Escrevi dois itens sem número, sem nome de cliente e sem sugerir encomenda paga — *“Um sistema que lê edital de licitação e diz se a empresa pode participar”* e *“Um livro-caixa que puxa extrato de banco e fecha o mês”*. Quais outros podem aparecer publicamente? Algum tem nome de cliente autorizado por escrito? | dois itens + um marcado como gate | é copy |

---

## 10. O que eu não fiz, e declaro

- **Não gerei nenhuma imagem por IA.** `mcp-image-studio` está com token inválido (401) e o `status`
  mente — `WORKFLOW-SITES` Parte 2. Stitch, nano-banana-2 e `@21st-dev/magic` não estão instalados.
- **Não usei `refero`** — não está declarado no `.mcp.json` deste projeto.
- **Não empacotei arquivo do conicorn.** Nem CSS, nem imagem, nem fonte, nem ícone. Colhi **gramática
  de layout**, que é o que não se protege como se protegem render, foto e tipo. As duas `.woff2` deste
  mockup são Inter e JetBrains Mono, SIL OFL 1.1, vindas do próprio projeto.
- **Não escrevi um `.tsx`.** O gate proíbe até você aprovar, seção por seção.
- **Não criei `APROVADO.md`.**

---

*Reprodutível inteiro:* `node build.mjs` regenera `index.html`, `secoes/*.html`, `css/` e `js/` a
partir de uma fonte única. `node medir-contraste.mjs` refaz a tabela §4. `python medir-ptbr.py`
refaz as medições §5.
