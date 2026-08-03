# ARQUITETURA DE SEÇÕES — Talos

**Autor:** Uma (UX) · **Data:** 2026-07-28
**Escopo deste documento:** ordem das seções, função de cada uma no funil, objeção que cada uma
derruba, CTA de cada uma, e a hierarquia da dobra. **Não é direção de arte e não é código.**

**Base:**
- `01-research/01-ux-conversao-fontes-primarias.md` — toda estatística citada aqui vem daí.
  Nenhum número novo foi inventado.
- `02-references/inputs/leanware/pages/home/intel.json` — alturas em px medidas no render real
  da referência (documentHeight 7.764px, bodyBg `rgb(14,14,16)`).
- `apps/talos/components/*` e `apps/talos/lib/mapear.ts` — a copy já existe e é boa; este
  documento reordena e realoca, não reescreve.
- `00-context/CONTEXT.md` §3 — 🔴 zero número inventado, zero logo de cliente, zero depoimento.

---

## 0. O diagnóstico que muda tudo

Antes de mapear seção a seção, o achado que reorganiza o problema.

Medi as 11 seções de conteúdo do leanware por altura:

| # | seção leanware | classe medida | altura | % da página |
|---|---|---|---|---|
| 1 | hero | `.homepage-hero` | 667px | 8,6% |
| 2 | **logos de cliente** | `bg-lw-dark px-0 pt-2 pb-20` | 290px | 3,7% |
| 3 | o que fazemos (4 ofertas) | — | 669px | 8,6% |
| 4 | por que nós (3 diferenciais) | — | 976px | 12,6% |
| 5 | como se compara (matriz 5×4) | — | 963px | 12,4% |
| 6 | **trabalhos recentes** (4 cases) | — | 840px | 10,8% |
| 7 | **track record** (Clutch 5.0 · 24 reviews) | `.trust-strip` | 405px | 5,2% |
| 8 | **depoimentos** (3, Clutch verified) | — | 770px | 9,9% |
| 9 | FAQ (6 perguntas) | — | 777px | 10,0% |
| 10 | CTA final | `.cta-section` | 715px | 9,2% |
| 11 | rodapé | `.lw-footer` | 616px | 7,9% |

**Não são 3 seções que o Talos não pode ter. São 4, e elas somam 2.305px = 29,7% da página.**
O brief listou logos, track record e depoimentos; o quarto é *Recent Work* — quatro cases com
nome de cliente (University of Colorado, GloFlow, Notary.io, Groundlight).

E tem mais: a dobra do leanware também termina em prova social. No `screens/desktop-0.png`, logo
abaixo dos dois botões, está `★★★★★ 5/5 — VERIFIED ON CLUTCH · 24 REVIEWS`. **O último objeto do
hero é um selo de terceiro.**

Ou seja: **quase um terço da página do leanware, mais o fecho da dobra, é prova-do-passado.**
Copiar a arquitetura dele e apagar essas seções não produz "o mesmo site com quatro buracos" —
produz um site cuja espinha dorsal foi retirada. O trabalho não é preencher buracos; é **trocar o
tempo verbal da prova**.

### A troca

| leanware prova… | tempo verbal | Talos prova… | tempo verbal |
|---|---|---|---|
| que outros já contrataram (logos) | passado | o que a máquina faz, em dez verbos | presente |
| o que já construiu (cases) | passado | **o que a máquina faz com o SEU processo, agora** | presente |
| que durou e foi avaliado (Clutch, 6 anos) | passado | o que está combinado antes de você pagar | futuro |
| que outros ficaram satisfeitos (depoimentos) | passado | *não substituída — a fatia vira comparação* | — |

Essa é a leitura operacional de "processo é prova" (`CONTEXT.md` §3). E ela não é um remendo:
a pesquisa em `01-research/` registra que, para serviços, o usuário quer ver **os trabalhadores em
ação e todos os estágios**, não só o resultado final. Um case escrito é o quarto limpo. O painel do
`mapear.ts` mostrando o critério e o tempo de cada operação é **o trabalhador trabalhando**.

### Os 4 fatores de credibilidade — o Talos consegue 4 de 4 sem um único case

| fator (NN/g, estudo EUA/UK/Singapura) | como o Talos pontua sem case |
|---|---|
| 1. Design quality | build inteiro + zero typo (gate de revisão de copy) |
| 2. Upfront disclosure | §Como funciona (escopo e prazo) + §Por onde começa (o que está incluso) + FAQ que responde preço sem dar preço |
| 3. Conteúdo completo/correto/atual, **todos os estágios** | §O mapa ao vivo — painel de trace exposto |
| 4. Conexão com o resto da web | §Quem faz, com rosto e link externo verificável |

O fator 4 é o único que **nenhuma seção pode substituir**: exige um dado sobre uma pessoa real
(`apps/talos/lib/perfil.ts`, hoje `PREENCHER: nome`). É o único bloqueio de credibilidade que
arquitetura não resolve.

### E a segunda diferença estrutural: o visitante não é o mesmo

O comprador do leanware chega do Clutch ou de busca, comparando três fornecedores. O do Talos chega
**depois de já ter falado com o founder** — `CONTEXT.md` D2: *"o site fecha a dúvida de quem já foi
prospectado"*.

Consequência de arquitetura, não de copy:

| | leanware | Talos |
|---|---|---|
| pergunta do visitante | "vocês entram na minha shortlist?" | "esse cara é real e vai entregar?" |
| trabalho do site | ganhar a comparação | **não perder a conversa que já começou** |
| seção mais crítica | depoimentos / track record | **quem faz + a máquina rodando** |
| CTA que ele quer | "get in touch" (frio) | voltar pra conversa (quente) |

Por isso o nav precisa manter `falar comigo` sempre visível — e o `Nav.tsx` já faz isso, em ghost,
com o comentário certo no código ("no A/B a CTA do nav competia com a do hero"). Mas falta no nav um
link para **`quem faz`**: para o visitante prospectado essa é a pergunta nº 1, e hoje ela está no
10º bloco da página.

---

## 1. Mapa seção a seção — leanware → Talos

Legenda: ✅ vira · 🔁 vira outra coisa · ✂ sai · ➕ o Talos adiciona.

| leanware | h | → | Talos | por quê |
|---|---|---|---|---|
| **hero** | 667 | ✅ | **§1 Hero** | mesma função. Muda o último objeto: onde o leanware põe o selo Clutch, o Talos põe uma linha de honestidade declarada (§6 deste doc) |
| **logos de cliente** | 290 | 🔁 | **§2 Faixa de verbos** (`Marquee.tsx`) | o componente já existe e está no lugar errado (hoje é "respiro" na posição 8). O slot pós-hero é o mais valioso da página depois da dobra; para um público não-técnico, dez verbos em português ("responde · registra · confere · calcula · avisa · arquiva…") explicam mais que sete logos de empresas que ele não conhece. E não finge prova social nenhuma |
| **o que fazemos** (4 ofertas) | 669 | ✅ | **§8 Por onde começa** | mesma função (a oferta concreta), posição diferente — ver §2 deste doc |
| **por que nós** (3 diferenciais) | 976 | ✅ | **§6 Como funciona** | o leanware diferencia por *forma comercial* ("milestone-billed, not hourly"); o Talos diferencia por *método verificável* (escopo fechado, prazo, você vê antes de aprovar). Mesmo papel: dar razão de escolha sem depender de portfólio |
| **como se compara** (matriz 5×4) | 963 | ✅ | **§9 Como se compara** ➕ | **é a seção que o leanware tem, que o Talos NÃO tem, e que o Talos precisa mais que o leanware.** Detalhe em §5 deste doc |
| **trabalhos recentes** (4 cases) | 840 | 🔁 | **§5 O mapa ao vivo** | a troca central. "O que construímos e para quem" (passado, verificado por terceiro) vira "o que ela faz com o seu processo, agora" (presente, verificado por você). O `mapear.ts` é o único ativo do projeto que faz isso sem mentir |
| **track record** (Clutch 5.0 · 24 reviews · 6 yrs · GMT-5) | 405 | 🔁 | **§10 Compromissos** | mesmo objeto visual (faixa horizontal de 3 células tipo "stat"), tempo verbal invertido: o leanware certifica o passado, o Talos **vincula o futuro**. É o conteúdo do estado vazio de `Prova.tsx`, promovido de rodapé de página a faixa |
| **depoimentos** (3, Clutch verified) | 770 | ✂ | *sem substituto direto* | não existe versão honesta e mais fraca de um depoimento. Um "depoimento" sem cliente é fraude ou é vazio. A fatia de página que ela ocupava é absorvida pela §9 Como se compara — que responde a mesma pergunta de fundo ("estou cometendo um erro?") com material que não depende de terceiro |
| **FAQ** (6) | 777 | ✅ | **§11 FAQ** | `FAQ.tsx` já tem 7 perguntas e já responde preço sem dar preço. Mantém |
| **CTA final** | 715 | ✅ | **§12 Contato** | mantém. O leanware pede "tell us what you're working on"; o Talos pede a mesma coisa em 3 campos |
| **rodapé** | 616 | ✅ | **§13 Rodapé** | mantém |
| — | — | ➕ | **§3 O problema** | o leanware não precisa: o comprador dele já sabe que quer "AI engineering". O dono de PME brasileiro **não chega sabendo que quer automação** — ele chega com dor. Reconhecimento é o mecanismo de conversão aqui |
| — | — | ➕ | **§4 Casos de uso por ramo** | mesma razão, um grau mais concreto. E tem função mecânica no demo — ver §4 deste doc |
| — | — | ➕ | **§7 Quem faz** | o leanware manda "About" para outra página porque "LEANWARE S.A.S. · EST. 2020 · BOGOTÁ · 24 reviews" já respondeu quem é. O Talos é **uma pessoa sem review nenhum**: identidade É a credencial, não pode ficar fora da home |
| — | — | ✂ | *§Escada sai* | ver §2.3 deste doc — sobreposição verbatim com a coluna "o que vem depois" de `PorOndeComeca.tsx` |

**Contagem final:** 12 seções de conteúdo (leanware: 10). As 3 a mais são todas trabalho de
**reconhecimento e identidade** que o leanware não precisa fazer, menos 1 corte por redundância.
**12 é o teto: seção nova daqui pra frente substitui uma, não soma.**

---

## 2. Ordem final

### 2.1 A ordem

| pos | seção | componente | equivalente leanware |
|---|---|---|---|
| 0 | Nav (sticky, CTA persistente) | `Nav.tsx` | nav |
| 1 | **Hero** | `Hero.tsx` | hero |
| 2 | **Faixa de verbos** | `Marquee.tsx` | logos de cliente |
| 3 | **O problema** | `Problema.tsx` | — |
| 4 | **Casos de uso por ramo** | `CasosDeUso.tsx` | — |
| 5 | **O mapa ao vivo** | `Demo.tsx` + `lib/mapear.ts` | recent work |
| 6 | **Como funciona** | `ComoFunciona.tsx` | why us |
| 7 | **Quem faz** | `QuemFaz.tsx` | (about, fora da home) |
| 8 | **Por onde começa** | `PorOndeComeca.tsx` (absorve `Escada.tsx`) | what we do |
| 9 | **Como se compara** | 🆕 a construir | how we compare |
| 10 | **Compromissos** | `Prova.tsx` (vira faixa) | track record |
| 11 | **FAQ** | `FAQ.tsx` | FAQ |
| 12 | **Contato** | `Contato.tsx` | CTA |
| 13 | Rodapé | `Contato.tsx > Footer` | footer |

### 2.2 O que muda em relação ao `app/page.tsx` de hoje

Ordem atual: Hero → Problema → Demo → ComoFunciona → PorOndeComeca → Escada → **Marquee** →
CasosDeUso → **QuemFaz** → **Prova** → FAQ → Contato.

Quatro movimentos, cada um com razão de conversão:

**M1 — `Marquee` sobe de 7 para 2.**
Hoje ela é declarada "respiro" no comentário do `page.tsx`. Respiro é função legítima, mas é a
função de menor valor que se pode dar ao slot imediatamente pós-dobra — que no leanware carrega
prova social. Na posição 2 a faixa passa a fazer trabalho: traduz "automação de processos" (abstrato
e caro para um dono de PME) em dez verbos que ele reconhece. É a resposta mais rápida possível para
"mas o que exatamente isso faz?".
⚠️ Ajuste obrigatório: hoje o `<div class="marquee">` é `aria-hidden` e puramente decorativo. Na
posição 2 ela precisa de um rótulo curto acima (algo como `o que a máquina faz`) para ler como
informação, não como ornamento. Sem isso, ocupa o slot dos logos e parece o lugar onde os logos
deveriam estar.

**M2 — `CasosDeUso` sobe de 8 para 4, antes do demo.**
Essa é a mudança com mais efeito medível, e o argumento é mecânico, não estético.

`Problema.tsx` e `CasosDeUso.tsx` fazem **o mesmo trabalho** — reconhecimento — e hoje estão
separados por cinco seções. Quem não se reconheceu nas 3 cenas já saiu antes de chegar nos 4 ramos.
Juntas, elas formam uma rampa: *cena universal → o meu ramo, literalmente → agora escreve o seu*.

E o motivo mecânico: `lib/mapear.ts` classifica por **dicionário de verbos calibrado no jeito que
dono de PME brasileiro fala** — `'joga na planilha'`, `'passa pro financeiro'`, `'cai no'`, `'manda
pro'`. Os 16 processos de `CasosDeUso.tsx` estão escritos exatamente nesse registro
("Pedido chega por e-mail ou WhatsApp e alguém **redigita** no ERP"). Ler esses 16 exemplos antes de
encarar o textarea faz duas coisas ao mesmo tempo:

1. mata o custo da página em branco (o visitante aprende o formato e a granularidade esperados);
2. **aumenta a taxa de acerto do motor** — mais etapas classificadas, menos `'não reconheci o verbo'`,
   que é o único resultado ruim que o demo pode produzir.

Um demo interativo que devolve "não li 3 de 5 etapas" é pior que demo nenhum. O priming não é
enfeite narrativo: é redução da taxa de falha da única prova que o site tem.

⚠️ Edição de copy que decorre: a última linha de `CasosDeUso.tsx` diz *"O mapa da seção **anterior**
lê qualquer processo em texto livre"*. Vira "aqui embaixo". Uma linha.

**M3 — `QuemFaz` sobe de 9 para 7.**
Para o visitante do D2 (já prospectado, checando credencial), "quem é esse cara" é a pergunta nº 1 e
hoje ela é respondida no 10º bloco. Ele não chega lá — ele sai ou usa o nav, e o nav não tem esse
link.
Além disso a §7 é o **fiador da §5**: "isso rodou agora, no seu navegador" é uma afirmação; demo
anônimo é suspeito, demo assinado é credencial. Duas seções depois é perto o bastante.
Complemento barato que fecha a distância sem custar momento: **uma assinatura de uma linha no rodapé
do resultado do demo**, ligando para `#quem`. Assim a §5 fica assinada sem interromper a sequência
"vi o número → como você resolve isso? (§6) → quem é você (§7) → o que custa em escopo (§8)".

**M4 — `Prova` desce de 10 para 10-como-faixa, entre a comparação e o FAQ.**
Não é rebaixamento: `Prova.tsx` hoje **não é uma seção de prova**, é uma seção de garantias
(escopo e prazo fechados · você vê antes de aprovar). Isso é tratamento de objeção, e tratamento de
objeção pertence ao bloco de decisão, colado no CTA. É o mesmo lugar relativo do `.trust-strip` do
leanware (7º de 11 = 64% da página; aqui 10º de 13 = 77%).

### 2.3 O corte: `Escada.tsx` sai

Comparação literal entre os dois arquivos:

| `Escada.tsx` → DEGRAUS | `PorOndeComeca.tsx` → DEPOIS |
|---|---|
| "Atendimento — responde na hora, entende o que a pessoa quer, pega os dados que faltam e registra" | "agente que atende e qualifica quem chega" |
| "Processos internos — o que sai de um sistema e entra em outro pela mão de alguém" | "automação dos processos internos" + "integração com WhatsApp e com o seu CRM" |
| "Sistema sob medida — quando não existe ferramenta de prateleira que sirva" | "sistema sob medida, **quando nada de prateleira serve**" |

3 de 3 degraus já estão na coluna direita da §8, o terceiro quase palavra por palavra. São ~700px de
página e um ponto de abandono a mais para dizer duas vezes a mesma coisa.

**Como preservar o que a §Escada protegia** (o achado NN/g de que cobertura estreita afasta cliente
— "a empresa de mudança que parecia só fazer corporativo espantou o residencial"):

1. a coluna "o que vem depois" da §8 **deixa de ser um card tracejado secundário** e passa a ser
   metade legítima da seção, com o mesmo peso da coluna "o que está incluso". A amplitude fica
   visível, no lugar certo (depois da porta), sem seção própria;
2. cada processo da §4 ganha uma **etiqueta de categoria** (atendimento · processo interno · sistema
   sob medida). A taxonomia vira propriedade dos exemplos concretos em vez de virar manchete —
   ninguém se reconhece numa categoria, mas todo mundo entende uma etiqueta.

Isso contraria a regra do `WIREFRAME.md` PARTE 3 de que amplitude nunca aparece antes da prova. A
regra continua valendo para o **hero** (lista de serviços no topo = leitura de freelancer, e isso é
a tensão T2 do `CONTEXT.md`). Etiqueta em cima de um processo concreto na posição 4 não é lista de
serviços — é o vocabulário da dor do próprio visitante. Revisão deliberada, reversível: se o founder
preferir, mantém-se a §Escada e a página fica ~700px mais longa.

### 2.4 Por que essa ordem, e não a do leanware

| decisão | leanware | Talos | razão |
|---|---|---|---|
| reconhecimento antes de qualquer coisa | não tem | §3 e §4 | o comprador do leanware já sabe o que quer comprar. O do Talos chega com dor, sem vocabulário |
| prova no meio, não no fim | cases na 6ª de 10 | demo na 5ª de 12 | mesma posição relativa (~50%). A prova precisa de contexto antes e de oferta depois |
| método antes da oferta | oferta (3ª) antes de método (4ª) | método (§6) antes de oferta (§8) | **quando não há portfólio, o método É o diferencial.** Vender pacote antes de mostrar como se trabalha exige credencial que o Talos ainda não tem |
| comparação tarde, não cedo | 5ª de 10 | 9ª de 12 | em ambos, a comparação vem **2 slots depois da oferta**. Sem entender a oferta, as linhas da matriz não significam nada ("escopo fechado antes de começar" só faz sentido depois da §6 e da §8) |
| identidade na home | fora (página About) | §7 | pessoa sem review: identidade é credencial |
| bloco de objeção colado no CTA | compara(5) longe / FAQ(9) perto | compara(9) → compromissos(10) → FAQ(11) → CTA(12) | funil de objeção escalonado: *contra as alternativas* → *contra o risco* → *contra a dúvida residual* → *ação* |

**Comprimento.** leanware = 7.764px. Talos com 12 seções ≈ 10.000–10.700px (medido em
`RETOMAR-AQUI.md`: 10.006px com 11 seções, 10.771px no mockup de 13). É ~35% mais longo que a
referência. Aceitável — a pesquisa registra que a média de visita a um site inteiro é < 2 minutos, e
o que mata não é comprimento e sim ponto de abandono. Mas o teto de 12 seções é para valer, e o
corte da §Escada existe justamente para pagar a entrada da §9.

---

## 3. Seção a seção: função · objeção · CTA

> "Objeção que derruba" = a frase que o visitante diria em voz alta e que faria ele fechar a aba.
> Se uma seção não derruba nenhuma, ela não deveria existir.

### §1 Hero
- **Função no funil:** triagem em 10s + primeira exibição do entregável.
- **Objeção:** *"isso é pra empresa grande / não é pro meu caso"* e *"que empresa é essa?"*
- **CTA primário:** `mapear meu processo` → `#demo`. Custo baixo, sem cadastro, sem falar com gente.
- **CTA secundário:** `por onde começa` → `#comeco`.
- **CTA persistente (nav):** `falar comigo` → `#contato`. É o atalho do visitante já prospectado; não
  pode ser promovido a primary, senão compete com o demo (o comentário no `Nav.tsx` registra que o
  A/B já mostrou isso).
- ➕ **Adicionar ao nav:** link `quem faz`. Hoje o nav tem problema / como funciona / por onde começa —
  e omite exatamente o que o visitante do D2 mais procura.

### §2 Faixa de verbos
- **Função:** comprimir a oferta em um olhar e dar respiro entre a dobra e o argumento.
- **Objeção:** *"automação de processos é jargão — o que isso faz na prática?"*
- **CTA:** nenhum, deliberadamente. Faixa com link compete com a CTA do hero, que está a 200px dela.

### §3 O problema
- **Função:** reconhecimento universal. Três cenas com carimbo (`22:14` · `3×` · `toda segunda`).
- **Objeção:** *"meu problema não é de tecnologia"* — e a seção concorda com ele, e é isso que
  converte: *"Nenhum desses é problema de tecnologia. São de processo — e processo se automatiza."*
- **CTA:** nenhum. A frase-ponte é o CTA cognitivo. Botão aqui interromperia a rampa para a §4.
- **Restrição de leitura:** os 3 cards precisam ser lidos em < 10s somados. Teto de ~25 palavras por
  card (hoje: 23, 20 e 22 — está dentro).

### §4 Casos de uso por ramo
- **Função:** reconhecimento específico + **priming do vocabulário do demo** (§2.2 M2).
- **Objeção:** *"ele não entende o meu negócio"* — a mais letal para prestador sem case.
- **CTA:** 🆕 por linha, `usar este exemplo` → pré-preenche o textarea da §5 e rola até lá. Converte
  16 blocos de texto em 16 rampas de entrada para a única prova do site. É o CTA de maior alavancagem
  da página inteira.
- **Restrição:** a aba padrão precisa render conteúdo **sem clique**. Valor atrás de interação, na
  posição 4, é valor perdido.

### §5 O mapa ao vivo — **a seção que carrega o site**
- **Função:** a prova de execução. Substitui os 840px de case do leanware.
- **Objeção:** *"todo mundo promete automação; ninguém mostra"* e *"não tenho como saber se funciona
  antes de pagar"*.
- **CTA primário:** 🆕 `quero esse número virar realidade` → `#contato`, **levando o mapa junto**
  (ver §4 deste doc — é o furo de conversão nº 1 hoje).
- **CTA secundário:** assinatura de uma linha ligando a `#quem` (o fiador).
- **Regra dura:** nada de spinner falso, nada de delay. O painel mostra o tempo real (~2ms). Já está
  certo no código e no comentário do `mapear.ts`; registrado aqui para não ser "melhorado" depois.

### §6 Como funciona
- **Função:** upfront disclosure do método. Com portfólio vazio, *como você trabalha* vende mais que
  *o que você construiu*.
- **Objeção:** *"vai virar projeto de seis meses que nunca entrega"* — o medo real do empresário, e o
  que os três passos atacam (escopo fechado antes · prazo definido · você vê antes de aprovar).
- **CTA:** fraco e opcional — `ver o que está incluso` → `#comeco`. Não competir com §5 e §8.
- ⚠️ **Alerta de disclosure:** a pesquisa registra rejeição **em 35 segundos** por uma empresa não
  informar a taxa. O Talos decidiu não expor preço (`CONTEXT.md` T4). Essa decisão **custa**, e o que
  paga a conta é a densidade de escopo desta seção + a §8 + a pergunta de preço no FAQ. Se o founder
  algum dia quiser reduzir esse risco sem publicar tabela, o caminho é faixa com itens de linha —
  não "consulte-nos".

### §7 Quem faz
- **Função:** procedência. 4º fator de credibilidade — conexão com o resto da web. Site isolado de
  redes, review ou imprensa lê como **não-estabelecido ou suspeito**, e todos os participantes do
  estudo disseram que pesquisariam antes de contratar.
- **Objeção:** *"quem é esse cara? existe? some depois?"*
- **CTA:** links externos LinkedIn/GitHub. **É um CTA de saída, e é proposital** — a checagem externa
  é o que converte esse visitante. `target="_blank"` obrigatório para não perder a sessão.
- **Regra já implementada e que deve ser preservada:** campo vazio não renderiza o botão. Link para
  perfil vazio pontua pior que link nenhum.
- 🔴 **Bloqueio real:** `lib/perfil.ts` está com `PREENCHER: nome`. Nenhuma decisão de arquitetura
  desbloqueia isso.
- ➕ **Recomendação de conteúdo (gate do founder):** ver §5.4 deste doc — o bloco "o que eu já
  construí".

### §8 Por onde começa
- **Função:** a oferta concreta + a escada (agora absorvida).
- **Objeção:** *"site é commodity — por que com ele?"* e *"quanto custa?"*
- **CTA:** `quero começar por aqui` → `#contato`. Já existe.
- **Regra:** 🔴 nenhum valor nesta seção. Decisão do founder.

### §9 Como se compara 🆕
- **Função:** reenquadrar a decisão de *"quem é o melhor?"* (precisa de prova) para *"que forma de
  contrato eu quero?"* (não precisa de prova nenhuma). E ser **o artefato que o contato encaminha
  para o sócio** — o relatório B2B da NN/g (419 páginas, 188 guidelines, 293 sites) diz para projetar
  para o usuário **e** para o decisor, e que o site precisa dar ao seu contato o material para
  justificar a contratação internamente. Hoje o Talos não tem nenhuma seção que sirva a isso.
- **Objeção:** *"posso fazer com um freelancer / no Wix / com meu sobrinho / posso deixar como está"*.
- **CTA:** 🆕 `mandar isso pro meu sócio` — copia link com âncora `#compara` ou abre share. Custa
  quase nada e é o único CTA da página que serve ao segundo público.
- **Detalhe em §5.3 deste doc.**

### §10 Compromissos
- **Função:** prova de contrato. Reversão de risco sem inventar garantia.
- **Objeção:** *"e se der errado?"* / *"e se você sumir depois de entregar?"*
- **CTA:** nenhum. Antecede o FAQ, que é onde a dúvida vira pergunta.
- **Regra rígida (Baymard):** 3 itens, nunca mais. 1–3 tipos de sinal convertem **+23%** contra
  nenhum; **7+ convertem −8%** contra 1–3. Hoje `Prova.tsx` tem 2 — cabe um terceiro
  (candidato natural: manutenção mensal prevista no combinado, não venda separada depois; é fato do
  método, já dito na §6 e no FAQ). **Quarto item = tirar um.**

### §11 FAQ
- **Função:** derrubar a objeção residual de quem já quer e está procurando motivo para não.
- **Objeção:** as 7 já mapeadas — incluindo preço, respondida sem preço.
- **CTA:** `não achou a sua pergunta? me manda` → `#contato`.
- **Acerto que deve ser preservado:** `<details>/<summary>` nativos — teclado, leitor de tela e
  indexação de graça, e funciona com JS desligado.

### §12 Contato
- **Função:** conversão.
- **Objeção:** *"não sei nem o que pedir"* — resolvida pelo terceiro campo ("o que mais consome tempo
  hoje?"), que não exige que o visitante formule uma demanda técnica.
- **CTA:** form de 3 campos + WhatsApp direto. Três campos, não sete.
- **Acerto que deve ser preservado:** sem número configurado, o form **avisa** em vez de fingir que
  enviou. Botão que engole lead em silêncio é pior que botão que não existe.
- 🔴 **Bloqueio real:** `PERFIL.whatsapp` vazio.

---

## 4. Onde entra o `mapear.ts` — e por quê

`lib/mapear.ts` é o maior ativo de prova do projeto. Não porque é bonito, e sim porque é **a única
coisa da página que o visitante pode verificar sozinho, com os dados dele, sem pedir permissão,
sem cadastro e sem confiar em ninguém.**

### 4.1 Três aparições, **um único tipo de sinal**

| onde | o que aparece | o que prova |
|---|---|---|
| §1 dobra — `HeroPreview` | o **formato** do entregável (3 etapas + selo "automatizável"), estático | "existe um entregável concreto e ele cabe na tela" |
| §5 — `Demo` | o motor rodando no texto do visitante + painel de trace com tempo real | "a máquina faz, agora, com o meu processo" |
| §12 — mensagem de contato | o mapa viaja junto | "a conversa começa três passos à frente" |

**Isso conta como UM tipo de sinal de confiança, não três.** A régua Baymard (1–3 tipos = +23%;
7+ = −8%) é sobre **variedade empilhada**, não sobre repetição do mesmo sinal em pontos diferentes do
funil. Os três tipos que o Talos usa, e o teto:

1. **demonstração ao vivo** (dobra + §5 + §12)
2. **procedência da pessoa** (§7: rosto, nome, links externos)
3. **compromisso contratual** (§10)

🔴 **Explicitamente proibidos** (cada um empurra a página para o −8% e alguns violam o `CONTEXT.md`
§3): selo genérico de "empresa verificada" · contador de clientes · nota/estrelas · badge de stack
tecnológica · "desde 20XX" · bandeira de garantia · logo de ferramenta parceira.
**Quando o primeiro case real chegar, ele substitui um tipo — não soma um quarto.**

### 4.2 Por que ele substitui o case, tecnicamente

O achado central da pesquisa para serviços: as fotos precisam mostrar **todos os estágios**, não só o
resultado — no teste com empresa de limpeza os usuários queriam ver **os trabalhadores em ação**, não
só o quarto impecável.

- Um case escrito = o quarto impecável.
- Um chatbot que responde = o quarto impecável, animado.
- **O painel direito do §5 — cada operação, o critério aplicado e o tempo medido — é o trabalhador
  trabalhando.** É a tradução literal do achado.

### 4.3 As quatro regras que tornam a seção crível (e que não podem ser "melhoradas")

Estão no `mapear.ts` e devem ser tratadas como restrição de produto, não como detalhe de
implementação:

1. **Zero delay artificial.** O trace mostra o tempo real (~2ms). Um spinner de dois segundos aqui
   destrói exatamente a única coisa que a seção existe para provar.
2. **Etapa não reconhecida vale 0 minuto** e é marcada como "não li". Somar tempo ao que a máquina
   não entendeu transformaria o resultado em chute — a coisa exata que o projeto proíbe.
3. **A premissa aparece junto do número.** A conta inteira fica escrita embaixo do resultado.
4. **A frequência quem informa é o visitante.** O número é dele, não meu — e isso o torna
   indefensável de contestar e impossível de acusar de inventado.

Consequência de arquitetura: **essa é a razão pela qual o resultado do demo é forte o suficiente para
ocupar o slot de 840px que no leanware é preenchido por quatro cases com nome de universidade.**
Quebrar qualquer uma das quatro regras rebaixa a §5 de prova a animação, e aí a página fica sem prova
nenhuma.

### 4.4 🔴 O furo de conversão nº 1 da arquitetura atual

Hoje o visitante mapeia o processo na §5, rola até a §12 e encontra **um formulário vazio**. O card
lateral do `Contato.tsx` pede educadamente: *"Se você já mapeou o seu processo lá em cima, cola o
resultado aqui na mensagem."*

**Copiar e colar manualmente é atrito puro sobre o lead de maior intenção da página.** O site produz
o artefato mais valioso que ele é capaz de produzir e depois pede para o visitante transportá-lo à
mão.

Correção arquitetural (não é código, é requisito):
- o resultado do `mapear()` **persiste** entre a §5 e a §12 na mesma sessão;
- ao chegar na §12 com um mapa em memória, a mensagem já sai montada: processo descrito + nº de
  etapas automatizáveis + horas/mês + a premissa;
- o card lateral deixa de pedir cópia manual e passa a **mostrar** que o mapa já está anexado —
  transparência, não mágica silenciosa;
- se não houver mapa, o comportamento é exatamente o de hoje.

### 4.5 O laço que fecha o modelo de negócio

`CONTEXT.md` D5: *site é a porta, automação de workflow é o negócio*. O laço que prova isso na
própria página: o visitante **vê a máquina funcionando na §5 e é atendido por ela na §12**.
Demonstração e entrega viram o mesmo objeto. Hoje o `abrirWhatsapp` monta a mensagem; trocar por um
POST na rota do agente é a única mudança necessária, e está corretamente registrada em
`RETOMAR-AQUI.md` como próximo passo de engenharia.

Ordem de prioridade, do ponto de vista de conversão: **4.4 antes de 4.5.** Persistir o mapa vale mais
que trocar o canal de envio.

### 4.6 Onde o `mapear.ts` **não** deve entrar

- **Não é o objeto principal da dobra.** Exige digitação; a janela é de 10s. Na dobra entra só o
  formato do entregável.
- **Não é o CTA padrão do nav.** O visitante já prospectado quer voltar pra conversa, não fazer um
  exercício.
- **Não vira "chat".** A saída é diagrama + números. Um chat no lugar disso reintroduz exatamente o
  problema do painel do hero do leanware, que é um loop de conversa falsa.

---

## 5. As seções que dependem de prova social inexistente

### 5.1 Logos de cliente (290px, slot pós-dobra) → **faixa de verbos**

- **Por que não dá para reproduzir:** não existe cliente. `CONTEXT.md` §3 é inegociável.
- **Por que não vale deixar vazio:** o slot pós-dobra é o segundo mais valioso da página. Um pulo
  direto do hero para "você reconhece algum desses?" faz o argumento começar antes de o visitante
  respirar.
- **Substituto:** `Marquee.tsx` na posição 2, com rótulo.
- **Por que é honesto:** verbo não é prova social. Não afirma que alguém contratou; afirma o que a
  máquina faz — e cada um dos dez verbos é verificável na §5.
- **Por que é melhor que a alternativa óbvia:** a saída padrão de agência sem cliente é a fileira de
  logos de ferramentas ("construído com…"). Para um dono de metalúrgica em Santa Catarina, logo de
  ferramenta não significa nada e ainda sinaliza "isso é coisa de TI" — o oposto do posicionamento.
- **Risco declarado:** na posição dos logos, uma faixa pode ser lida como "o lugar onde os logos
  deveriam estar". Mitigação: rótulo + tratamento tipográfico de faixa, não de mural. Se na revisão
  ainda ler como buraco, o plano B é cortar a posição 2 e ir direto ao §3 — **nunca** preenchê-la com
  qualquer coisa que finja terceiro.

### 5.2 Track record / Clutch 5.0 · 24 reviews · 6 anos (405px) → **faixa de compromissos**

Esta é a mais difícil, porque é a única que é **puramente numérica**: nota, contagem, anos, fuso. Não
há número honesto disponível para nenhuma das quatro células.

- **Substituto:** mesmo objeto visual (faixa horizontal, 3 células curtas com hierarquia de "stat"),
  **tempo verbal invertido**. O leanware certifica o passado; o Talos vincula o futuro.
- **Conteúdo:** os itens de `Prova.tsx` (escopo e prazo fechados · você vê antes de aprovar) + um
  terceiro (manutenção mensal prevista no combinado).
- **Por que funciona:** cada célula é **falseável agora**. O visitante pode exigir o escopo por
  escrito na primeira conversa e verificar. Compromisso verificável é o análogo honesto de
  verificação por terceiro — muda quem carrega o ônus da prova, do passado (que não existe) para o
  contrato (que existe antes de qualquer pagamento).
- **Teto rígido:** 3 células. Baymard.
- ⚠️ **Limite de escopo:** "não gostou, não paga" foi corretamente deixado de fora do código porque
  cria obrigação comercial que só o founder pode assumir. Continua fora até ele decidir. Se entrar,
  **substitui** uma das três.

### 5.3 Depoimentos (770px) → **cortada; a fatia vira §9 Como se compara**

- **Por que não tem substituto direto:** não existe versão honesta e mais fraca de um depoimento.
  "O que meus clientes dizem" sem clientes é fraude; "o que eu acredito" no lugar disso é ruído.
- **Por que a comparação ocupa a fatia:** o depoimento responde *"alguém como eu ficou satisfeito?"*.
  A pergunta de fundo é *"estou prestes a cometer um erro?"*. A matriz responde a mesma pergunta de
  fundo **sem depender de terceiro nenhum** — e faz duas coisas a mais que o depoimento não faz:
  (a) reenquadra a decisão de "quem é melhor" (precisa de prova) para "que forma de contrato eu
  quero" (não precisa); (b) é o único artefato da página que serve ao **decisor**, atendendo à
  diretriz B2B de projetar para o usuário e para quem assina.

**Esqueleto proposto — 5 linhas × 5 colunas**, espelhando a matriz do leanware
(*"Same question, different answers"*, 5 perguntas × 4 concorrentes):

Colunas — o conjunto competitivo **real** do Talos, não o do leanware:
`agência de marketing` · `freelancer de site` · `plataforma DIY (Wix/Squarespace)` ·
`ficar como está` · **`Talos`**

> A quarta coluna é a mais importante e é a que quase todo site esquece: **o concorrente real do
> Talos é a inércia**, não outro fornecedor. `CasosDeUso.tsx` já assume isso ("Se você leu algum e
> pensou 'é exatamente isso aqui'").

Linhas — **todas sobre forma de trabalho e forma de contrato; nenhuma sobre resultado**, porque
resultado exige prova que não existe:

| pergunta | o que ela mata |
|---|---|
| quem conversou com você é quem constrói? | agência (atendimento ≠ produção) |
| o escopo e o prazo entram por escrito antes de começar? | freelancer e "quando ficar pronto" |
| o site já nasce ligado ao WhatsApp e ao processo? | DIY e agência |
| manutenção mensal está no combinado ou é venda depois? | freelancer e DIY |
| dá pra ver funcionando antes de aprovar? | todos |

Cada célula do Talos é **um fato do método já publicado na §6 e na §8** — não uma promessa nova.
Zero número, zero superlativo, zero nome de concorrente específico.

⚠️ **Duas armadilhas conhecidas de tabela comparativa**, ambas evitáveis:
1. **coluna própria toda verde e as outras todas vermelhas lê como propaganda e queima confiança.**
   Pelo menos duas células precisam ser honestamente favoráveis ao concorrente (ex.: plataforma DIY
   *é* mais barata na entrada; agência *tem* equipe maior). Concessão explícita é o que faz o resto
   da tabela ser lido como informação em vez de vitrine — e a pesquisa registra que uma única quebra
   de confiança tem efeito assimétrico: **19% abandonam permanentemente.**
2. **não citar concorrente pelo nome** além de categorias de plataforma genéricas.

### 5.4 Bônus honesto — Recent Work (840px) → `o que eu já construí`, dentro da §7

A quarta seção de prova do leanware é a que tem a saída mais fácil, e ela está subutilizada.

`CONTEXT.md` §5 levanta que o founder **tem software real construído** — Noyce (6 estágios, app
rodando, 120+ docs), Anipis (closed beta em produção, 20 contas), Contador (31 commits, 16 módulos),
ENIAC Financeiro (Next 16 + Supabase, fases 1–3), além de meses de operação de tráfego real. A
conclusão registrada lá: *"o que falta não é projeto, é case empacotado"*.

**Mostrar software que existe não é afirmar resultado de cliente.** A restrição do founder é *"não
tenho resultado real"* — e ela continua respeitada se a regra for:

- ✅ descrever **o que o sistema faz**, no presente;
- ✅ print da interface, se houver;
- ❌ **nenhum** número de resultado (economia, %, tempo, receita);
- ❌ **nenhum** nome de cliente sem autorização por escrito;
- ❌ nenhuma palavra que sugira encomenda paga onde não houve.

Isso resolve a tensão **T1** do `CONTEXT.md` (*"prioridade em credencial" + "não falar de mim" é
contraditório*), hoje marcada como "mitigado, não resolvido". Procedência de construtor é credencial
sem ser vaidade — é a resposta a "esse cara sabe construir?" que nem o demo nem os compromissos dão.

🔴 **Gate do founder.** Eu não decido isso por ele. Três perguntas objetivas, e enquanto não houver
resposta o bloco simplesmente não existe:
1. quais desses sistemas podem aparecer publicamente?
2. algum tem autorização de nome de cliente? (se não: descrever sem nomear)
3. tem print apresentável, ou o bloco é só texto?

---

## 6. Hierarquia de leitura na dobra — a regra dos 10 segundos

**A régua.** O estudo da NN/g modelou **205.000 páginas** com 10.000+ visitas cada, mais de **2
bilhões de durações de visita**, com distribuição Weibull. Resultado: 0–10s é triagem impiedosa;
10–30s é avaliação secundária; passados 30s a curva **achata** e quem ficou tende a ficar 2+ minutos.
Recomendação literal do estudo: *"para ganhar vários minutos de atenção do usuário, você precisa
comunicar sua proposta de valor em 10 segundos."*

Logo: **a dobra tem um orçamento de 10 segundos e ele é finito.** Objeto que entra tem que tirar
outro.

### 6.1 Ordem de leitura e orçamento

| # | objeto | orçamento | pergunta que responde | referência leanware |
|---|---|---|---|---|
| 1 | eyebrow de categoria — `automação de processos · construção de sites` | 0,5s | "que tipo de coisa é isso?" | `— AI ENGINEERING COMPANY` |
| 2 | **H1** — *O trabalho repetitivo da sua empresa não precisa de gente.* | 2,5s | "o que eu ganho?" | *Making AI Actually Useful.* (64px) |
| 3 | **subhead, 2 linhas** — *…e a primeira delas é o seu site.* | 2,5s | "por que um site, se o assunto é automação?" | parágrafo de 4 linhas |
| 4 | **CTA primário** (+ secundário ao lado) | 1,0s | "o que eu faço agora?" | *Get in touch* / *See how we can help* |
| 5 | **linha de honestidade** | 1,0s | "cadê a prova de que ele já fez isso?" | ★★★★★ 5/5 · VERIFIED ON CLUTCH |
| 6 | **topo do card de mapa** | 2,5s | "como é o entregável?" | painel de chat à direita |
| | | **10,0s** | | |

Três observações sobre o mapeamento:

- **O H1 do Talos tem 9 palavras contra 4 do leanware.** É mais caro de ler, e é o preço de nomear a
  dor na língua do dono em vez de vender categoria. Vale a pena — mas significa que o orçamento é mais
  apertado e que **nenhum objeto extra cabe na dobra**.
- **O objeto 6 do leanware é um loop de conversa falsa; o do Talos é o formato real do entregável.**
  Mesma posição, credibilidade oposta. É a vantagem mais barata que este projeto tem sobre a
  referência e não deve ser desperdiçada com um chat decorativo.
- **O objeto 5 é o único que o leanware resolve com terceiro e o Talos não pode.**

### 6.2 O objeto 5 — a linha que ocupa o slot do selo Clutch

A escolha aqui decide como a ausência de prova social é lida na página inteira.

- **Se o visitante notar a falta antes de você nomeá-la, é um buraco.**
- **Se você nomear primeiro, vira posição.**

Duas famílias de solução, e a recomendação:

| opção | forma | o que ganha | o que arrisca |
|---|---|---|---|
| **A — declaração** | *"Nenhum logo de cliente nesta página. A máquina roda aqui embaixo, no seu processo, em vez disso." →* | desarma a objeção antes de ela nascer; transforma o disclaimer em credencial | pode soar defensivo se for escrito com desculpa em vez de afirmação |
| **B — afirmação verificável** | *"roda no seu navegador · sem cadastro · resultado em 2 ms"* | claim falseável em 5 segundos de scroll — análogo honesto de "verified by" | não menciona a ausência; o visitante pode notar sozinho depois |

**Recomendação: A + B na mesma linha** — a declaração como texto e as três checagens como micro-selos
ao lado, num único bloco de uma linha. A declara a posição, B dá o que verificar.

🔴 **Regras de escrita para a opção A** (é a linha mais arriscada do site inteiro):
- declarativa, nunca apologética. Sem "ainda", sem "por enquanto", sem "infelizmente";
- ela **aponta imediatamente para o substituto** — nunca fica na negação sozinha;
- máximo uma linha em desktop, duas em mobile;
- 🔴 **é decisão do founder e deve entrar em A/B quando houver tráfego.** É a única frase da página
  que pode ler como fraqueza se sair errada.

A copy dessa família já existe e é a melhor do projeto para esse fim: o título do estado vazio de
`Prova.tsx` — *"Sem case ainda. E eu não vou inventar um."* Hoje ela está na 10ª seção, onde quase
ninguém chega. É copy de dobra presa no rodapé da página.

### 6.3 Restrições duras da dobra

1. **Nada na dobra pode ser revelado depois de 500ms.** O `Hero.tsx` já cumpre (entrada em 0,5s,
   stagger de 30ms por palavra, sem delay). Queimar 3s revelando texto é queimar 30% da janela.
2. **O objeto 3D nunca precede nem atrasa o H1.** Se o WebGL falhar, a dobra continua completa. Já
   garantido (`ssr:false`, `loading: () => null`).
3. **O topo do card de mapa precisa estar visível em 1440×900 e em 1366×768** (o notebook de
   escritório comum). Isso já foi descoberto empiricamente e registrado no `RETOMAR-AQUI.md`: a 132px
   a headline comia a dobra inteira e o card sumia; 112px resolve em 3 linhas com o topo do card
   aparecendo. **Fica como regra, não como acidente.**
4. **Ordem de corte quando a dobra estourar:** primeiro o eyebrow (objeto 1), depois o CTA secundário.
   **Nunca o subhead** (é a ponte site↔automação, e sem ela a oferta fica incoerente) e **nunca o
   card** (é a prova).
5. **Terço direito é da cena 3D.** Nada com função de leitura pode morar lá acima da dobra — em
   telas menores ele colapsa por cima do texto.
6. **Mobile (390×844): a dobra termina nos CTAs.** O card precisa começar **no máximo ~120px abaixo
   da borda** para que a pista de scroll seja inequívoca. Se o card ficar a 400px, o visitante de
   celular decide sem ter visto a prova.
7. **Contraste do H1 sobre o pior frame da cena precisa ser medido, não estimado** — a régua do
   projeto é WCAG AA e o `RETOMAR-AQUI.md` mostra que aqui se calcula contraste por script, não por
   olho. O texto em `--ink-3` do leanware reprova AA — **3,96:1** (corrigido em 28/Jul; o 3,78:1 que
constava aqui veio de aproximar o alfa por hex chapado em vez de compor sobre o fundo). Não herdar
esse erro, nem o de método.
8. **Nenhuma linha de badge acima do H1.** É o padrão de SaaS 2023 ("★ Product Hunt #1") e é
   exatamente o tipo de sinal que o Talos não pode ter — e que empurraria a página para o −8% do
   Baymard mesmo se pudesse.

---

## 7. Resumo executivo das mudanças

| # | mudança | esforço | por quê |
|---|---|---|---|
| 1 | 🆕 **§9 Como se compara** (matriz 5×5) | alto — seção nova | única seção do leanware que não exige prova social e que o Talos não tem. Serve ao decisor (B2B) e mata "meu sobrinho faz" |
| 2 | 🔴 **Persistir o mapa da §5 até a §12** | médio | furo de conversão nº 1: o lead de maior intenção é obrigado a copiar e colar à mão |
| 3 | `CasosDeUso` 8 → 4 (antes do demo) | baixo — reordenar + 1 linha de copy | junta o reconhecimento e aumenta a taxa de acerto do `mapear.ts` |
| 4 | 🆕 CTA `usar este exemplo` nos 16 processos da §4 | médio | 16 rampas de entrada para a única prova do site |
| 5 | `Marquee` 7 → 2, com rótulo | baixo | ocupa o slot dos logos com algo honesto e útil |
| 6 | `QuemFaz` 9 → 7 + assinatura no demo | baixo | identidade é a credencial de quem não tem review |
| 7 | `Prova` vira **faixa de compromissos** na posição 10, 3 células | baixo/médio | tratamento de objeção colado no CTA; teto Baymard |
| 8 | ✂ `Escada` sai, absorvida pela §8 e por etiquetas na §4 | baixo | 3 de 3 degraus já estão duplicados; −700px, −1 ponto de abandono |
| 9 | 🆕 Linha de honestidade na dobra (A+B) | baixo | ocupa o slot do selo Clutch; nomeia a ausência antes de ela virar buraco |
| 10 | ➕ Link `quem faz` no nav | trivial | é a pergunta nº 1 do visitante prospectado (D2) |
| 11 | ➕ Bloco `o que eu já construí` na §7 | baixo — **gate do founder** | resolve a tensão T1; procedência sem afirmar resultado |

**Ordem de execução recomendada:** 3 → 5 → 6 → 8 → 10 (reordenação, ~1 sessão) · 2 → 4 (conversão) ·
1 (seção nova) · 9 → 11 (dependem de decisão do founder).

---

## 8. O que só o founder decide

| # | decisão | bloqueia |
|---|---|---|
| D-A | texto exato da linha de honestidade da dobra (opção A) | §1, item 5 da hierarquia |
| D-B | quais sistemas construídos podem aparecer, e se algum tem nome de cliente autorizado | §7 bloco "o que eu já construí" · tensão T1 |
| D-C | assumir ou não "não gostou, não paga" como 3ª célula de compromisso | §10 |
| D-D | quais categorias entram nas colunas da comparação, e se aceita conceder 2 células ao concorrente | §9 |
| D-E | manter a §Escada ou aceitar o corte | §8 e §4 |
| D-F | `perfil.ts`: nome, bio, foto, LinkedIn, GitHub, WhatsApp | §7 e §12 — **bloqueio de publicação, não de arquitetura** |

Nada em D-A…D-E impede começar por 3 → 5 → 6 → 8 → 10, que são reordenações puras.

---

## Fontes usadas

Todas as estatísticas vieram de `01-research/01-ux-conversao-fontes-primarias.md`:
NN/g *How Long Do Users Stay on Web Pages?* (205k páginas, 2bi durações, Weibull) ·
NN/g *Trustworthiness in Web Design: 4 Credibility Factors* (EUA/UK/Singapura; rejeição em 35s por
falta de taxa; fotos de todos os estágios; cobertura estreita afasta) ·
NN/g *Trust or Bust* (quebra de confiança assimétrica: 29% / 52% / 19%) ·
NN/g *B2B Website Usability Report* (419pp, 188 guidelines, 293 sites; usuário ≠ decisor) ·
Baymard (densidade de sinais: 1–3 tipos +23%; 7+ −8%).

Medições da referência: `02-references/inputs/leanware/pages/home/intel.json` (alturas, headings,
copy) e `screens/desktop-0..2.png`.

⚠️ Nenhum número de conversão foi estimado, arredondado ou criado neste documento. Onde não havia
evidência — notadamente sobre efeito de motion — a pesquisa já registra que o material disponível é
marketing de conteúdo de agência, e este documento não o usa.

— Uma, desenhando com empatia 💝
