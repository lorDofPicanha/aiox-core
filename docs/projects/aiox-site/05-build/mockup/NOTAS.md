# NOTAS — mockup de aprovação (gate F4)

**Data:** 2026-07-28 · **Artefato:** `05-build/mockup/index.html` (89,9 KB, HTML estático)
**Telas:** `05-build/shots/mk-1440-*.png` (14) · `mk-390-*.png` (22) · `mk-semjs-*.png` (14)
**Régua deste build:** `05-build/squad/SINTESE.md`. Onde a `DIRECAO-ARTE.md` e a `SINTESE` divergem,
**vale a SINTESE** — está tudo listado em §2.

> 🔴 Nenhum `.tsx` foi tocado. `apps/talos/` está exatamente como estava.

---

## 1. Como abrir

O `index.html` carrega o motor como **módulo ES**, então `file://` não serve (o Chrome bloqueia
por CORS). Suba um servidor estático:

```bash
cd docs/projects/aiox-site/05-build/mockup
npx --yes serve .          # ou: python -m http.server 8080
```

**O conteúdo funciona com JavaScript desligado** — só o demo interativo precisa de JS, e mesmo ele
já vem com o resultado renderizado (veja §4).

---

## 2. O que foi acatado dos vereditos

| # | veredito da `SINTESE` / do coordenador | o que foi feito |
|---|---|---|
| 1 | **Fotografia: máximo 2, cada uma com função nomeada** | **Zero fotos.** `imgs: 0` medido no render. Raciocínio em §3 — é a decisão que mais precisa do seu aval |
| 2 | **Ponto pulsante + `FLORIANÓPOLIS · GMT-3`: cortado** | Não existem no arquivo. Zero `@keyframes` de pulso. O rodapé diz `mockup de aprovação · não é o site` |
| 3 | **Camadas de fundo: reduzir (ref. 8, proposta 12)** | **8 camadas**, medidas no render — a mesma contagem da referência. **2 atrás do H1** (brilho + malha), não 4 |
| 4 | **`--ink-4` proibido em texto de leitura** | `--ink-4` saiu de **todos** os usos textuais (matriz, numeração do painel, artefato, linha de ramo). Sobrou num ponto separador de 3px. Todo texto restante mede **≥ 4,91:1** |
| 5 | **Contraste sempre com composição de alfa** | O script de medição compõe alfa do texto **e** empilha os fundos semitransparentes até achar o opaco. Tabela em §5 |
| 6 | `line-height` de rótulo 1.2 → **1.45** | `--t-label`: `11px / 1.45 / .12em`. `AUTOMAÇÃO` já não encosta na linha de cima |
| 7 | tracking mono `.16em` → **`.12em`** | aplicado em todo rótulo mono |
| 8 | corpo 15px → **16–17px** | `body` a 17px desktop, **16px piso no mobile** |
| 9 | `font-optical-sizing: auto` **explícito** | está no `html`. E **nenhum** `font-variation-settings` no arquivo inteiro — grep confirma 0 ocorrências |
| 10 | degrau de 10px eliminado; 52px e 32px não são níveis | escala de **7 níveis** do Spiekermann. `--t-section` é 32/40/44 responsivo; **não existe 52px** e não voltou por `clamp` |
| 11 | Setas: **SVG inline** | 77 `<svg>` no render. `U+2192/2605/2713` como caractere de texto: **0 ocorrências medidas** |
| 12 | Bronze fica, sem gastar espaço | ficou. Sem seletor de tema, sem discussão no arquivo |
| 13 | **Planilha é orgulho** | ela aparece 6× e **nunca** como vilã: card 3 da §3 (*“A planilha está certa”*), e no demo ela é onde o dado **já está**, não o problema |
| 14 | `trabalho repetitivo` · `mapear` · `automatizável` proibidos | **0 ocorrências**. `automatizável` só aparece no `trace` técnico do motor (`5 automatizáveis`), não em copy de venda |
| 15 | **Mecanismo é contratual, não tecnológico** | §10 tem filete bronze e faixa própria com borda dupla; §9 dedica **4 das 7 linhas** a forma de contrato; a §11 fecha com a pergunta *“e se eu já tentei com outro”* ligando aos 3 compromissos |
| 16 | Setor-âncora comércio/serviços; H1 **com o dado** | H1 = `Quem responde o seu cliente quando você não pode?` · subhead = variante com **82% Sebrae, mar/2026, n=8.273** |
| 17 | ME **e** EPP | `mandar isso pro meu sócio` ficou (copia link com âncora `#compara`), **e** o mapa vira artefato: o resumo chega na §12 sozinho |
| 18 | Nome provisório — não investir em wordmark nem no autômato 3D | marca = quadrado tracejado neutro + `NOME PROVISÓRIO`. **Zero WebGL, zero three.js, zero `TalosCore`.** A palavra “Talos” não aparece na página |
| 19 | Capturar **por viewport**, nunca `fullPage` | o script rola e captura tela a tela |

---

## 3. 🔴 A decisão que mais precisa do seu aval: zero fotografia

O veredito autorizava **até 2** fotos, cada uma com função nomeada. Não consegui nomear a função
de nenhuma — e forçar duas para preencher a cota seria repetir o erro que o Rams apontou, com
número menor.

O raciocínio, para você derrubar se discordar:

1. **O setor-âncora mudou para comércio e serviços.** A justificativa que a `DIRECAO-ARTE` dava
   para a forja era *reconhecimento de público* — dono de metalúrgica se vê. Dono de loja e dona
   de clínica **não se veem numa bigorna**. A função evaporou com a decisão de setor.
2. **A marca é provisória.** A outra justificativa era etimológica: Talos, o autômato de bronze de
   Hefesto. Você vai trocar o nome. Não posso ancorar identidade visual num nome que sai.
3. **O que sobra é decoração**, e o payload da referência inteira é 83 KB.

**Sobrou espaço vazio?** Não. `imgs: 0`, mas **77 SVG**, o painel do demo com 7 etapas
classificadas, matriz de 7×6, faixa corrida, 16 cards de processo, 8 perguntas. A §6, que na
referência tem 3 ilustrações AVIF, ganhou **painéis de artefato**: cada passo mostra a *forma do
que ele entrega* (o documento de escopo, a coisa rodando, o aviso mensal). Segue a regra do
`COPY-V2` §7.5 — *mostre a cena, não a categoria* — e custa 0 KB.

**Como isto volta atrás em um passo:**
- se você ancorar em **indústria**, `ferreiro-1920.webp` volta pra §6 passo 02 (medido em
  `h39 s21% l13%` — matiz a 3° do bronze, mediana de luminosidade igual à do fundo);
- quando houver **retrato seu**, ele entra na §7, que já tem a coluna reservada e marcada.

Ficam **fora em qualquer cenário**: `textura-metal` (878 KB para viver a 6% de opacidade),
`fabrica` (sem destino), `placa-metal` (mede `h182` — ciano; precisaria de 146° de rotação para
pertencer ao sistema).

---

## 4. O demo é o motor real, e ele falha à vista

`js/mapear.js` é `apps/talos/lib/mapear.ts` **compilado**, não reescrito:

```bash
node node_modules/typescript/bin/tsc lib/mapear.ts --target ES2022 --module ES2022 \
  --moduleResolution bundler --outDir .../05-build/mockup/js
```

Consequências que importam:

- **Nenhum número do HTML foi digitado.** O `build.mjs` importa o motor, roda o exemplo e injeta o
  resultado no HTML. Por isso o demo **funciona com JS desligado**: `mk-semjs-*.png` mostra
  7 etapas e o total `17,3` renderizados.
- **Ao carregar, o JS reroda** e substitui pelo tempo medido *naquela* máquina. Não há número
  congelado ao lado de contador ao vivo — o defeito que a `SINTESE` P0-9 registra.
- **Zero espera fingida.** Sem spinner, sem delay. O `trace` mostra `0,1 ms`, `1 ms`, `0 ms` porque
  é o que foi medido.
- **O exemplo padrão traz de propósito uma etapa que o motor NÃO lê** (*“Eu paro o que tô
  fazendo”*). Ela renderiza com borda tracejada, selo `NÃO LI`, `—` no lugar do tempo, e dispara o
  aviso *“ficam de fora da conta, não entram como chute”*. **É o oposto exato do painel da
  referência**, que se autodeclara `data-lw-placeholder="hero-chat"` com `role="img"` e tem um
  `<div class="thinking">` falso.
- **P0-6 resolvido:** o campo de frequência tem seletor `semana` / `mês`. No mês, passo
  `vezes / 4,33` ao motor — o resultado é exato, sem o inflacionamento 4,33× que a `SINTESE`
  apontou. O rótulo do `trace` é reetiquetado para `N×/mês` (só o rótulo; o número por trás é o
  exato).
- **P0-7 resolvido:** o mapa **persiste até o formulário**. O bloco *“O seu mapa já vai junto”*
  aparece sozinho na §12 com o resumo, e o campo *“o que mais consome tempo hoje?”* já vem
  preenchido — até você digitar nele, aí ele para de sobrescrever. **Ninguém copia e cola nada.**

### 🔴 Achado: os `motivo` do motor são copy visível e nunca passaram pelo veredito de vocabulário

O texto cinza embaixo de cada etapa (*“consulta a dado que já existe em algum sistema”*) sai de
`mapear.ts`. É **a copy mais lida da §5** — uma linha por etapa — e ninguém a rodou contra o
glossário do `COPY-V2` §7. Auditei os **12 `motivo` únicos**. Três reprovam:

| `motivo` do motor | veredito | corrigido para |
|---|---|---|
| “mesmo dado sendo **redigitado** em outro lugar” | 🔴 §7.1 — `redigitar` tem frequência **0** no corpus | “mesmo dado **passando de um lugar pro outro na mão**” |
| “aviso de rotina — dispara **sozinho** quando o gatilho acontece” | 🔴 §7.4 — no corpus `sozinho` significa **abandono** (*“estou sozinho, vou embalar e enviar sozinho”*), nunca autonomia | “dispara **sem você** quando o gatilho acontece” |
| “a agenda recebe **sozinha** e confirma **sozinha**” | 🔴 §7.4, idem | “a agenda recebe e confirma **sem você**” |

Um quarto foi avaliado e **fica**: *“decisão de negócio — automatizar isso seria terceirizar
critério”*. `automatizar` é 🟠, permitido no corpo depois de uma cena (§7.2) — e aqui chega depois
de 5 etapas concretas. O `COPY-V2` §11 elogia essa frase pelo nome.

Corrigi na **camada de apresentação** do mockup (um mapa `MOTIVO_PTBR`), não no motor:
`lib/mapear.ts` tem suíte de teste presa a ele e não é deste gate. **Quem for encostar no motor
precisa levar as três correções para lá**, senão elas voltam no port.

### ⚠️ Contradição interna do `COPY-V2` que eu não resolvi sozinho

`alguém` está na lista de 🔴 **banidos** (§7.1, “como sujeito”). Mas o próprio `COPY-V2` mantém
quatro ocorrências, e todas as quatro estão na página:

1. §4 Indústria — “Follow-up de entrega que depende de **alguém** lembrar” *(marcada “mantém”)*
2. §4 Serviços — “Cobrança que depende de **alguém** olhar a planilha” *(“mantém”)*
3. §4 Projeto e obra — “Foto de obra que **alguém** precisa baixar…” *(“mantém”)*
4. §8 — “**alguém** que responde primeiro, 24 h por dia” *(copy **nova** do próprio COPY-V2)*

Leitura possível: o ban é do `alguém` **agente impessoal no lugar do leitor** (*“alguém copia pra
planilha”*), e nos casos 1–3 o `alguém` é justamente **a dor sendo nomeada** — o processo depende
de uma pessoa. No caso 4 é a máquina descrita como gente, de propósito.
**Não reescrevi por conta própria** — o `COPY-V2` é a fonte de verdade da copy e aprovou os quatro
explicitamente. Fica para a sua revisão da §4 e da §8.

### 🔎 Um achado novo sobre o motor — para quem for mexer nele

Medi 49 verbos de 1ª pessoa que um dono usa (`vejo, olho, confiro, anoto, lanço, mando, aviso…`):
**49/49 são lidos.** O conserto do B2 funcionou.

**Mas `ver` está registrado com `exige: SISTEMA`** — só conta quando um objeto da lista de sistemas
cai numa janela de 4 tokens. Efeito medido:

| entrada | resultado |
|---|---|
| `eu vejo no sistema` | consulta · 4 min ✅ |
| `eu vejo o pedido` | recebimento · 2 min ✅ |
| `vejo quem não pagou` | **não li · 0 min** 🔴 |
| `vejo o que está atrasado` | **não li · 0 min** 🔴 |
| `eu vejo a lista` | **não li · 0 min** 🔴 |

`vejo quem não pagou` é uma das formas mais naturais de descrever conferência. Também não cobertos:
`faz a medição`, `faço a medição`.

**Não contornei isso escrevendo os exemplos para agradar o motor** — isso seria maquiar a única
prova do site. Os 16 textos do botão `esse é o meu` estão em português natural; onde precisei
ajustar, acrescentei o objeto que a pessoa diria de qualquer jeito (`confiro quem não pagou na
planilha`). Com isso, **16/16 rodam limpos: 2–4 etapas, 0 “não li”, 0 aviso.**

---

## 5. Contraste medido **no render** (composição de alfa, não hex de token)

30 pares, Chrome real, `getComputedStyle` → composição de alfa → fórmula WCAG 2.1.
**0 falhas AA em texto de leitura.**

| elemento | px | peso | alfa | composto | fundo | ratio | AA | AAA |
|---|---|---|---|---|---|---|---|---|
| H1 display | 62 | 800 | 1,00 | `rgb(250,250,250)` | `rgb(15,15,15)` | **18,36:1** | ✅ | ✅ |
| subhead do hero | 18 | 500 | 0,66 | `rgb(170,170,170)` | `rgb(15,15,15)` | **8,25:1** | ✅ | ✅ |
| eyebrow bronze | 11 | 700 | 1,00 | `rgb(233,162,59)` | `rgb(15,15,15)` | **8,85:1** | ✅ | ✅ |
| linha de honestidade | 15 | 600 | 1,00 | `rgb(250,250,250)` | `rgb(15,15,15)` | 18,36:1 | ✅ | ✅ |
| micro-checks | 11 | 600 | 0,49 | `rgb(130,130,130)` | `rgb(15,15,15)` | **4,99:1** | ✅ | — |
| H2 de seção | 44 | 800 | 1,00 | `rgb(250,250,250)` | `rgb(15,15,15)` | 18,36:1 | ✅ | ✅ |
| corpo de card | 17 | 400 | 0,66 | `rgb(174,174,174)` | `rgb(26,26,26)` | **7,84:1** | ✅ | ✅ |
| carimbo bronze | 11 | 700 | 1,00 | `rgb(233,162,59)` | `rgb(26,26,26)` | 8,04:1 | ✅ | ✅ |
| ponte da §3 | 18 | 500 | 1,00 | `rgb(250,250,250)` | `rgb(15,15,15)` | 18,36:1 | ✅ | ✅ |
| tag de card | 11 | 600 | 0,49 | `rgb(136,136,136)` | `rgb(26,26,26)` | **4,91:1** | ✅ | — |
| texto de etapa | 16 | 400 | 1,00 | `rgb(250,250,250)` | `rgb(20,20,20)` | 17,65:1 | ✅ | ✅ |
| motivo da etapa | 14 | 400 | 0,49 | `rgb(133,133,133)` | `rgb(20,20,20)` | 4,99:1 | ✅ | — |
| minutos da etapa | 12 | 700 | 0,66 | `rgb(172,172,172)` | `rgb(20,20,20)` | 8,12:1 | ✅ | ✅ |
| **total em bronze** | 44 | 800 | 1,00 | `rgb(233,162,59)` | `rgb(20,20,20)` | **8,51:1** | ✅ | ✅ |
| premissa da conta | 14 | 400 | 0,49 | `rgb(133,133,133)` | `rgb(20,20,20)` | 4,99:1 | ✅ | — |
| ponte de dinheiro | 18 | 500 | 1,00 | `rgb(250,250,250)` | `rgb(20,20,20)` | 17,65:1 | ✅ | ✅ |
| trace detalhe | 14 | 400 | 0,66 | `rgb(170,170,170)` | `rgb(15,15,15)` | 8,25:1 | ✅ | ✅ |
| trace ms | 12 | 400 | 0,49 | `rgb(130,130,130)` | `rgb(15,15,15)` | 4,99:1 | ✅ | — |
| pergunta do FAQ | 17 | 600 | 1,00 | `rgb(250,250,250)` | `rgb(26,26,26)` | 16,67:1 | ✅ | ✅ |
| resposta do FAQ | 17 | 400 | 0,66 | `rgb(174,174,174)` | `rgb(26,26,26)` | 7,84:1 | ✅ | ✅ |
| célula da matriz | 15 | 500 | 1,00 | `rgb(250,250,250)` | `rgb(20,20,20)` | 17,65:1 | ✅ | ✅ |
| rótulo da matriz | 10 | 600 | 0,49 | `rgb(133,133,133)` | `rgb(20,20,20)` | 4,99:1 | ✅ | — |
| texto da matriz | 15 | 400 | 0,66 | `rgb(172,172,172)` | `rgb(20,20,20)` | 8,12:1 | ✅ | ✅ |
| **texto no botão bronze** | 15 | 700 | 1,00 | `rgb(25,15,0)` | `rgb(233,162,59)` | **8,74:1** | ✅ | ✅ |
| botão contornado | 15 | 600 | 1,00 | `rgb(250,250,250)` | `rgb(15,15,15)` | 18,36:1 | ✅ | ✅ |
| CTA mini bronze | 11 | 700 | 1,00 | `rgb(233,162,59)` | `rgb(26,26,26)` | 8,04:1 | ✅ | ✅ |
| legal do rodapé | 11 | 600 | 0,49 | `rgb(130,130,130)` | `rgb(15,15,15)` | 4,99:1 | ✅ | — |
| link do rodapé | 15 | 400 | 0,66 | `rgb(170,170,170)` | `rgb(15,15,15)` | 8,25:1 | ✅ | ✅ |
| frase do rodapé | 18 | 500 | 1,00 | `rgb(250,250,250)` | `rgb(15,15,15)` | 18,36:1 | ✅ | ✅ |
| “não se aplica” (matriz) | 10 | 600 | 0,49 | `rgb(133,133,133)` | `rgb(20,20,20)` | **4,99:1** | ✅ | — |

**A última linha era o furo.** No primeiro render ela media **3,26:1** — porque `--ink-4` ainda
carregava as palavras `NÃO SE APLICA`. É texto, não decoração. Corrigido para `--ink-3`.
Só descobri porque medi **no render**, com composição; pelo hex do token o erro não aparece.

Foco: `outline: 2px solid var(--br)` — bronze mede de 6,99:1 a 8,85:1 sobre todas as superfícies,
contra o piso de 3:1 do SC 1.4.11.

---

## 6. Estado do render

| medida | 1440×900 | 390×844 | sem JS (1440) |
|---|---|---|---|
| altura da página | **12.282px** | 18.565px | 11.854px |
| telas capturadas | 14 | 22 | 14 |
| `<section>` | 12 | 12 | 12 |
| seções invisíveis | **0** | 0 | **0** |
| `<h1>` | 1 | 1 | 1 |
| `bodyBg` | `rgb(15,15,15)` | idem | idem |
| camadas de fundo | **8** | 8 | 8 |
| `<svg>` | **77** | 77 | 77 |
| `<img>` | **0** | 0 | 0 |
| seta/estrela/check como **caractere de texto** | **0** | 0 | 0 |
| falhas AA em texto | **0** | — | — |

**Sem JavaScript:** 8.992 caracteres visíveis · **0 elementos escondidos** · faixa com 20 itens ·
FAQ com 8 itens abríveis (`<details>` nativo) · 1 painel de aba visível (abas são rádio + CSS, não
JS) · 16 processos no HTML · **demo com 7 etapas e total `17,3` renderizados**.

**Console:** 1 ocorrência — `404 /favicon.ico`. É do servidor estático do teste, não da página.
Zero exceção, zero erro de script.

**A página é 58% mais alta que a referência** (12.282 contra 7.764px). São 12 seções contra 11,
mas o peso está no demo (~1.900px com 7 etapas abertas) e na matriz de 7×6. Se você achar longo,
o corte mais barato é a §4 (casos de uso) virar 2 processos por aba em vez de 4 — mas ela é a
rampa de entrada do demo, então prefiro que você decida vendo.

---

## 7. Decisões que tomei sozinho — e onde eu posso estar errado

| # | decidi | por quê | como reverter |
|---|---|---|---|
| 1 | **Zero fotos** | §3 | 1 arquivo + 1 bloco na §6 |
| 2 | **Card 2 da §3 na variante de risco zero** | O `COPY-V2` recomenda *“Você já respondeu isso vinte vezes essa semana”* e marca o “vinte” como `[JULGAMENTO]`, não `[MEDIDO]`. A regra fundadora do projeto é zero número inventado. Usei a alternativa que o próprio documento oferece: **“Você já respondeu isso hoje. Vai responder de novo antes do almoço.”** Carimbo: `de novo, hoje` | trocar 2 strings |
| 3 | **Número grande em Inter, não em mono** | A JetBrains Mono **não tem `tnum`** (GSUB só `calt ccmp frac locl`, GPOS vazia) e, sendo monoespaçada, a vírgula ocupa um avanço inteiro: `17 , 3`. A Inter **tem** `tnum` (50 substituições, medidas). Fica `17,3` justo | 1 declaração |
| 4 | **Vírgula decimal** | O motor devolve `17.3`. Em pt-BR o número é **17,3**. `toLocaleString('pt-BR')` na camada de apresentação — o valor não muda | — |
| 5 | **Título do FAQ alinhado às outras seções** | No primeiro render o `.wrap--estreito` centralizava o H2 e criava um degrau contra os outros 11 títulos. Agora só a **lista** é estreita | — |
| 6 | **“Coluna inteira marcada a favor é propaganda”** | O `COPY-V2` escreve *“coluna toda verde”* — herança do acento da referência. Num site bronze, “verde” não quer dizer nada | 1 string |
| 7 | **Exemplo do demo com uma etapa não lida** | É a única forma de o visitante ver a máquina admitir erro antes de confiar nela. Se preferir uma primeira impressão limpa, troco por um exemplo 100% lido — mas perdemos a prova de honestidade | 1 string |
| 8 | **§6 com painel de artefato no lugar da mídia** | O slot equivalente da referência tem 3 ilustrações. Sem foto, ele ficaria vazio | — |
| 9 | **Faixa a 42s, não 171s** | 171s é função do comprimento da faixa **deles**. Calculei pela nossa | 1 número |

---

## 8. O que continua bloqueado — e não é decisão de arte

1. **`lib/perfil.ts` está com `PREENCHER: nome`.** A §7 renderiza os campos vazios **à vista**, em
   caixa tracejada bronze. É impossível publicar sem notar.
2. **Sem WhatsApp configurado**, o formulário da §12 **avisa que não enviou**, em vez de fingir.
3. **Nome e domínio.** O INPI classe 42 está bloqueado (Cisco, Progress Rail —
   `00-context/MARCA-TALOS-VERIFICACAO.md`). A palavra “Talos” **não aparece** na página; a marca é
   um placeholder neutro. Quando o nome fechar, muda 1 SVG e 1 string.
4. **`ver` com qualificador obrigatório** no motor (§4). É do dono do `mapear.ts`, não deste gate.
5. **Ninguém falou com um dono de PME** (`SINTESE` §5). Continua sendo o maior furo do conjunto, e
   nenhum pixel deste mockup resolve isso.

---

## 9. Para a revisão seção por seção

Ordem sugerida — as três primeiras decidem o resto:

| ordem | seção | a pergunta que só você responde |
|---|---|---|
| 1 | **§1 Hero** | O H1 com o dado do Sebrae soa forte ou soa relatório? E a linha *“Sem case ainda. E eu não vou inventar um.”* — orgulho ou desculpa? É a frase mais arriscada da página |
| 2 | **§5 O mapa ao vivo** | Rode com um processo **real** de cliente seu. Se o número sair errado, nada mais importa |
| 3 | **§3 O problema** | Os 3 cards descrevem o seu cliente ou o cliente que eu imaginei? |
| 4 | §4 Casos de uso | Clique `esse é o meu` nos 4 do Comércio e veja se o mapa faz sentido |
| 5 | §9 Como se compara | As 2 linhas em que eu perco: aceitáveis ou tiro no pé? |
| 6 | §10 Compromissos | As 3 são obrigação comercial. Você assina? |
| 7 | §6, §8, §11, §12 | escopo, oferta, objeções, conversão |
| 8 | §2, §7, §13 | faixa, quem faz (bloqueada), rodapé |

**Aprovação registra-se em `05-build/mockup/APROVADO.md`**, seção a seção. Sem esse arquivo o gate
F4 continua fechado e nenhum `.tsx` pode ser tocado (`WORKFLOW-SITES.md` Parte 6, regra 1).

---

## 10. Arquivos

```
05-build/mockup/
├── index.html        89,9 KB  ← a página (CSS inline, como a referência)
├── build.mjs         66,6 KB  ← gera o index; importa o motor real
├── NOTAS.md                   ← este arquivo
├── fonts/
│   ├── InterVariable.woff2    99,6 KB  (OFL 1.1)
│   └── JetBrainsMono.woff2    36,7 KB  (OFL 1.1)
└── js/
    └── mapear.js     29,4 KB  ← tsc de apps/talos/lib/mapear.ts

05-build/shots/mk-1440-00..13.png · mk-390-00..21.png · mk-semjs-00..13.png
```

⚠️ As `.woff2` foram copiadas da captura da referência para o mockup rodar hoje. **Antes de
qualquer publicação, gerar subset próprio a partir do upstream**, incluindo
`U+2192 U+2190 U+2191 U+2193 U+2605 U+2713 U+2248 U+2260` — os subsets da referência não têm esses
codepoints. Neste mockup isso não morde ninguém porque todo símbolo já é SVG.

`shoot-mockup.cjs` está na raiz do repositório (precisa do `puppeteer-core` de lá). Ele serve,
captura por viewport, mede contraste no render e testa sem JS.
