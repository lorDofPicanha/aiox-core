# CRÍTICA ADVERSARIAL — don-norman

**Clone:** don-norman (Tier 1) · **Consulta:** `266ea881-3d06-444b-827b-c2b165650e98`
**Alvo:** `05-build/squad/ARQUITETURA-SECOES.md` (Uma, 28/Jul) · secundário `DIRECAO-ARTE.md`
**Data:** 2026-07-28

**Base declarada.** Princípios e frameworks vêm de `.codex/agents/don-norman.md` (Nível 2,
`operational_frameworks`) e do extrato do motor em `scratchpad/conclave/don-norman.md`. Toda
conclusão abaixo nomeia o princípio que a sustenta — nenhuma é preferência pessoal
(`anti_patterns.never_do`: *"Never critique based on personal preference — always reference a
named principle"*).

**O que eu rodei, e por que isso importa.** `always_do`: *"Always ask 'have you watched real
people use this?' before prescribing"*. Eu não pude observar pessoas. Então fiz a coisa mais
próxima que estava ao meu alcance: **executei o `lib/mapear.ts` de verdade**, com `jiti`, contra
cerca de 70 entradas escritas no registro do público-alvo — inclusive os 16 processos literais de
`CasosDeUso.tsx` e o texto do próprio `placeholder` do `textarea`. Tudo que está marcado como
*medido* abaixo saiu dessa execução e é reproduzível. Tudo que é inferência está marcado como
inferência. Isto **não substitui** observar cinco pessoas usando a §5 — ver "Onde eu estou
errado", item 2.

---

## VEREDITO 1 — O demo da §5

# REPROVA. E o documento diagnosticou o risco errado.

`ARQUITETURA-SECOES.md` §2.2 M2 afirma, em duas ocorrências:

> *"menos `'não reconheci o verbo'`, que é o único resultado ruim que o demo pode produzir"*
> *"Um demo interativo que devolve 'não li 3 de 5 etapas' é pior que demo nenhum."*

A segunda frase está certa. A primeira está errada, e o erro é estrutural: **"não li" é o
segundo pior resultado. O pior é o acerto aparente** — a máquina lê um processo de quatro etapas
como uma, não avisa nada, e devolve um número pequeno com uma marca de confirmação ao lado.

### O que eu medi

**(a) Sub-segmentação silenciosa.** Entrada escrita como um dono de metalúrgica escreve — sem
ponto final, sem conector:

> *"o vendedor manda o pedido por email a gente ve se tem material no estoque monta a ordem de
> producao e o PCP programa a maquina"* (126 caracteres, quatro etapas reais)

Saída: **1 etapa**, categoria `recebimento`, 2 min, **0,7 h/mês**, zero "não li". E o painel
"a máquina por dentro" exibe `✓ separação · 1 etapa identificada`.

Isso é uma falha de **feedback** no sentido técnico do termo (Six Design Principles →
*feedback*: "Does the system communicate what happened and what resulted?"). O sistema comunicou
que aconteceu uma coisa que não aconteceu. Não é ausência de feedback — é feedback falso, e
feedback falso é pior que silêncio, porque remove do visitante a chance de perceber o problema.
Em `Demo.tsx` cada linha do trace recebe um `✓` em bronze. **Um signifier de sucesso aplicado a
uma falha.**

**(b) Os 16 exemplos que a arquitetura quer injetar no campo não funcionam.** O item 4 do resumo
executivo — *"CTA `usar este exemplo` nos 16 processos da §4… 16 rampas de entrada para a única
prova do site"*, descrito como *"o CTA de maior alavancagem da página inteira"* — foi medido
processo a processo:

| resultado | contagem |
|---|---|
| colapsam em **1 etapa** | **16 de 16** |
| voltam **"não li"** com 0 h/mês | **5 de 16** |
| voltam classificados como **`presencial` / "acontece no mundo físico"** | **4 de 16** |

Os cinco "não li": *Cliente que comprou uma vez e nunca mais foi contatado* · *Nota emitida
manualmente a cada venda* · *Agendamento por telefone que ocupa a recepção o dia inteiro* ·
*Fornecedor cotado por três canais diferentes sem histórico* · *Cronograma atualizado à mão
quando algo atrasa*.

Os quatro "acontece no mundo físico" incluem *Ordem de produção **montada** à mão* e *Documento
**montado** a partir de um modelo* — trabalho de escritório que a máquina anuncia como físico.

Isto é a **inversão exata do argumento do M2**. O documento move a §4 para antes da §5 porque o
priming *"aumenta a taxa de acerto do motor"*. Medido: o priming ensina o formato que o motor lê
pior — frases-título de uma etapa só — e o CTA de maior alavancagem da página é, hoje, uma rampa
para o resultado mais fraco que o motor consegue produzir.

**(c) O placeholder do próprio campo não passa no motor.** `Demo.tsx` sugere
*"chega um pedido no WhatsApp, alguém copia pra planilha,\ndepois avisa o financeiro..."* — três
etapas. Medido: **2 etapas**. A vírgula não separa; só o `depois` separou. A variante só com
vírgulas (quatro etapas escritas) devolve **1 etapa**. O exemplo que o site dá ao visitante já
demonstra o formato errado.

**(d) O dicionário está na pessoa errada.** O comentário do arquivo diz que os verbos vêm *"do
jeito que dono de PME brasileiro descreve processo"*. Mas ele descreve o **próprio** trabalho, na
primeira pessoa. Medido, oito pares mínimos:

| terceira pessoa | primeira pessoa |
|---|---|
| "ele confere a nota" → consulta, 4 min | "eu confiro a nota" → **não li**, 0 min |
| "ela manda pro contador" → notificação, 3 min | "eu mando pro contador" → **não li**, 0 min |
| "alguém fecha o mês" → cálculo, 12 min | "eu fecho o mês" → **não li**, 0 min |
| "ela busca no sistema" → consulta, 4 min | "eu busco no sistema" → **não li**, 0 min |
| "ele salva no drive" → arquivamento, 3 min | "eu salvo no drive" → **não li**, 0 min |

**0 de 8 falhas em terceira pessoa. 5 de 8 em primeira.** O registro que o projeto acha que
capturou é o do consultor descrevendo o cliente, não o do cliente descrevendo a si mesmo.

**(e) O casamento é `indexOf` sem fronteira de palavra.** Consequências medidas, com o motivo que
aparece na tela ao lado:

| o visitante escreve | a máquina responde |
|---|---|
| "**geralmente** o cliente pede orçamento por telefone" | cálculo, **12 min** — *"número derivado de dado que a operação já produziu"* (`gera`) |
| "o que **sobra** do lote vai pro estoque" | presencial — *"acontece no mundo físico"* (`obra`) |
| "a **balança** pesa e o operador marca o peso" | transcrição, 6 min — *"mesmo dado sendo redigitado em outro lugar"* (`lanca`) |
| "a **informação** vem do vendedor" | notificação, 3 min — *"aviso de rotina — dispara sozinho"* (`inform`) |
| "**monta** a proposta no Word e manda pro cliente" | presencial, 0 min — *"acontece no mundo físico"* |

**(f) O teto de 12 etapas corta em silêncio.** 15 etapas escritas → 12 no mapa, e o trace anuncia
`12 etapas identificadas`, sem qualquer menção ao corte.

**(g) A frequência não aceita "por mês".** O `input` tem `min={1}` e a unidade é fixa em *vezes
por semana*. Um processo mensal — fechamento, faturamento, o *"toda segunda"* que a própria §3
usa como carimbo — é **inexprimível**. Quem digita `1` infla o resultado em 4,33×. Num site cuja
regra-mãe é *zero número inventado* (`CONTEXT.md` §3), o único campo numérico que o visitante
controla **obriga** o visitante a inventar. Isso não é um bug menor; é a regra fundadora do
projeto violada pela interface, não pelo motor.

**(h) A dor que o brief atribui ao visitante produz um anti-argumento.** Medido:

| entrada | saída |
|---|---|
| "perco cliente no whatsapp" | 1 etapa · **≈ 0,7 h/mês** |
| "o whatsapp da empresa fica sem resposta à noite e no fim de semana" | 1 etapa · **≈ 0,7 h/mês** |
| "tô perdendo venda porque ninguém responde o whatsapp a tempo" | 1 etapa · **≈ 1,4 h/mês** |

O site promete *"o trabalho repetitivo da sua empresa não precisa de gente"* e, para a frase que
o próprio briefing diz ser a que o dono tem na cabeça, responde com **42 minutos por mês** — em
tipografia de 44px, em bronze, com um contador animado subindo até lá.

### O diagnóstico, nos termos do framework

**Gulf of evaluation, entre os Estágios 5 e 6.** O visitante *percebe* o resultado (Estágio 5 —
o número está lá, grande, legível). Ele não consegue *interpretar* (Estágio 6): não há nada na
tela que explique **por que** o processo dele virou uma etapa, ou por que "monta a proposta"
acontece no mundo físico. E no Estágio 7 (*compare*) o resultado colide com o que ele sabe: ele
perde meio dia por semana com aquilo, e a máquina disse 42 minutos por mês.

**A classificação do erro determina o remédio, e o documento escolheu o remédio errado.**
`error_classification`: *slips* são intenção certa com execução errada — previnem-se com
**constraints e forcing functions**. *Mistakes* são plano errado a partir de modelo errado —
previnem-se com **modelo conceitual melhor e disclosure progressiva**. O que acontece aqui não é
slip do visitante; ele escreveu exatamente o que queria escrever. É um **mistake da máquina**,
que produz no visitante um mistake derivado ("então meu processo não dá tanto trabalho assim").
O M2 tenta resolver com priming — que é uma tentativa de constraint. Remédio de slip aplicado a
mistake. E medido: não funciona, porque o priming ensina o formato errado.

**O `mapear()` não tem estado de erro. Nenhum.** Toda entrada retorna um `Mapa` bem-formado. Um
sistema incapaz de detectar a própria falha é incapaz de preveni-la e de repará-la. O princípio
*"The best error message is the one that never shows up — prevent the error through design"* não
autoriza um sistema sem erro; ele exige um design em que o erro não chegue a acontecer. Aqui o
erro acontece e é **declarado como sucesso**.

### E quando a máquina erra na frente dele — o custo

`01-research/01-ux-conversao-fontes-primarias.md` §5 mede: após uma quebra de confiança, **19%
abandonam permanentemente**. A §5 não é uma seção qualquer: `ARQUITETURA-SECOES` §4.2 e
`DIRECAO-ARTE` Parte 5 §7 a instalam no slot dos 840px de case do leanware. É a única prova do
site.

Um erro visível ali não fica ali. Ele contamina para trás e para a frente:

- contra a §4, cuja objeção declarada é *"ele não entende o meu negócio"* — e a máquina acabou de
  demonstrar que não entende;
- contra a §6, que vende método;
- contra a §10, que promete escopo fechado — prometido por quem lê "montar a proposta" como
  trabalho de fábrica.

**Três levels of emotional design.** No *visceral*, a §5 ganha: existe uma coisa que roda, o
painel é bonito, o número é grande. No *behavioral*, ela falha pelas sete razões medidas acima.
E o *reflective* inverte — que é o padrão que descrevi como "seduction without delivery" no
termostato: o objeto foi desenhado para o visitante pensar *"esse cara é sério"* e entrega
*"escrevi errado?"* ou *"que máquina burra"*. As duas leituras custam a venda; a primeira custa
mais, porque quando uma pessoa se sente burra na frente de um produto, ela não reclama — ela sai.

**O que está certo e não pode ser tocado.** As quatro regras do §4.3 são o melhor trabalho do
projeto e eu as endosso sem reserva, em especial a regra 3 (*a premissa aparece junto do
número*). Só que ela tem um preço que ninguém contabilizou: **transparência não é neutra**. Ela
troca "erro invisível" por "erro visível". Isso é a decisão certa — e ela só se paga se a taxa de
erro cair. Hoje a taxa é alta e agora está exposta.

---

## VEREDITO 2 — Pedir texto livre a um não-técnico

# NÃO RESOLVIDO. A proposta melhora a rampa e ignora o formato.

Você está certo em chamar isto de a maior aposta de interação do site. Um campo vazio é o
equivalente digital de uma porta lisa sem maçaneta e sem placa: ela *aceita* qualquer coisa, o
que significa que ela não *comunica* nada. `six_design_principles → signifiers`: "Are there clear
cues indicating where and how to act?" Aqui a resposta é não, e é não de três maneiras.

**Primeiro: o placeholder não é um signifier, é uma armadilha conhecida.** Ele desaparece no
instante exato em que a pessoa mais precisa dele — no primeiro caractere digitado. Isso é mover
*knowledge in the world* para *knowledge in the head* precisamente no momento de maior carga.
Instrução nunca vai em placeholder. Vai em rótulo permanente.

**Segundo: o formato que o motor exige não está escrito em lugar nenhum.** Medido: quebra de
linha separa · ponto final separa · marcador de lista separa · 16 conectores separam · **vírgula
não separa** · **"e" não separa**. O visitante não tem como descobrir isso. Ele não tem nem como
suspeitar que exista uma regra. É `discoverability` zero — e discoverability é, junto com
understanding, uma das duas características que eu chamo de mais importantes em qualquer coisa
desenhada.

**Terceiro: a saída proposta ensina o formato errado.** Já medido no Veredito 1(b): os 16
exemplos são frases-título de uma etapa. Injetar um deles no campo mostra ao visitante que o
esperado é uma linha curta — e uma linha curta é o que produz 0,7 h/mês ou "não li".

O botão *"usar um exemplo"* que já existe em `Demo.tsx` (que carrega o `EXEMPLO` de cinco etapas
e é o único texto do projeto que o motor lê bem: 5 etapas, 4 automatizáveis, 6,9 h/mês) é
**melhor** que os 16 propostos, e está enterrado como botão fantasma ao lado do primário. É o
único lugar da tela onde o formato correto aparece.

A correção não é dar mais exemplo. É trocar o affordance do campo — ver Correção A1.

---

## VEREDITO 3 — O mapa não persiste até o formulário

# PROCEDE, e o documento SUBDIMENSIONA o dano.

`ARQUITETURA-SECOES` §4.4 chama isso de *"atrito puro sobre o lead de maior intenção"*. Está
certo e é insuficiente. Atrito é uma medida de custo. O que está acontecendo aqui é uma **quebra
do modelo conceitual do site inteiro** (`complexity_distinction → key_tool`: o conceptual model é
a imagem mental que a pessoa forma de como o sistema funciona).

Leia o que a página afirma sobre si mesma, em sequência:

- §3, via `Escada.tsx`: o problema é *"o que sai de um sistema e entra em outro pela mão de
  alguém"*;
- §5: uma máquina que lê o seu processo em 0,15 ms;
- §4.5 do documento: *"o visitante vê a máquina funcionando na §5 e é atendido por ela na §12"*;
- §12, `Contato.tsx`, hoje: *"Se você já mapeou o seu processo lá em cima, cola o resultado aqui
  na mensagem."*

**O site comete, na frente do visitante, exatamente o erro que ele cobra da empresa dele.** Um
dado que sai de um lugar e entra em outro pela mão de uma pessoa. Isso não é atrito; é o produto
se autodesmentindo na última seção, e é a diferença entre "esse site tem uma fricção" e "essa
demonstração era um truque".

Dois agravantes que o documento não registra:

1. **O pedido de trabalho manual está no objeto de menor peso visual da página.** Em
   `Contato.tsx` ele mora num `card` com `background: 'transparent'` e `borderStyle: 'dashed'` —
   o tratamento reservado a nota secundária. Uma instrução que exige trabalho da pessoa,
   apresentada com o peso de um rodapé. A maioria não vai ler; quem ler vai ignorar.
2. **`Contato.tsx` não tem nem campo para o mapa.** A mensagem montada em `enviar()` tem três
   linhas (`nome`, `dor`, `zap`). Mesmo quem copiar e colar vai colar no campo *"o que mais
   consome tempo hoje?"*, que tem `minHeight: 104` — um mapa de cinco etapas com a premissa não
   cabe visualmente ali.

A correção arquitetural proposta em §4.4 está certa em todos os quatro pontos. Eu acrescento dois
requisitos e uma reordenação — Correção E.

---

## VEREDITO 4 — A matriz 5×5 com quarta coluna "ficar como está"

# A IDEIA É BOA, A QUARTA COLUNA É A MELHOR PARTE, E O TAMANHO ESTÁ ERRADO.

**O que está certo, e por um princípio.** Reenquadrar a decisão de *"quem é o melhor?"* (que
exige prova) para *"que forma de contrato eu quero?"* (que não exige) é a manobra mais
inteligente dos dois documentos. É a aplicação correta de *"A brilliant solution to the wrong
problem can be worse than no solution at all"* — lido ao contrário: você trocou o problema por um
que você consegue resolver com o material que tem. E a coluna *"ficar como está"* é a única
honesta sobre quem realmente ganha essa disputa. Mantenha-a mesmo que corte todas as outras.

**O que está errado — a carga, contada.** 5 linhas × 5 colunas = 25 células. Mais 5 rótulos de
linha e 5 cabeçalhos = **35 objetos de leitura**. E `DIRECAO-ARTE` §9 exige, corretamente por SC
1.4.1, que cada marca tenha *"forma distinta + rótulo textual"* — o que leva os elementos
perceptíveis a **até 50**. Numa seção que vive na posição 9 de 13, depois de aproximadamente
7.000px de rolagem, para um leitor não-técnico.

Aqui é preciso ser preciso, porque a resposta fácil ("simplifique") é a errada.
`complexity_distinction`: **complexidade é aceitável; confusão não é.** Eu nunca peço para
remover capacidade. A pergunta certa é: *o objeto complexo é a matriz ou é a decisão?* A decisão
é complexa — quatro alternativas reais, cinco critérios legítimos. A matriz é uma **forma de
organização**, e uma matriz é a forma certa quando o leitor precisa comparar **pares de células**
("como o freelancer se sai nisso *versus* a agência?"). Não é isso que ele está fazendo. Ele
precisa de **uma** conclusão sobre **uma** coluna: a do Talos. Ele está usando uma tabela de
dupla entrada para responder a uma pergunta de entrada única. Isso é confusão desenhada, não
complexidade herdada.

**O que está errado — o canal.** `DIRECAO-ARTE` §9 especifica, em ≤720px, rolagem horizontal com
a primeira coluna congelada, e proíbe corretamente virar acordeão (*"comparação que não deixa ver
duas colunas ao mesmo tempo deixa de ser comparação"* — concordo). O problema é que rolagem
horizontal aninhada dentro de rolagem vertical está entre os gestos de pior descoberta que
existem em web. O leitor de celular verá duas das cinco colunas e não descobrirá que há mais três
— e no perfil "dono de PME olhando no celular entre uma reunião e outra", esse é o leitor
majoritário (inferência: não tenho analytics deste site). O documento acertou ao proibir o
acordeão e não resolveu o que sobra.

**O que está errado — o público.** §5.3 invoca a diretriz B2B da NN/g: *o site precisa dar ao seu
contato o material para justificar a contratação internamente*. Certo. Mas o artefato do
**decisor** foi instalado dentro da página do **contato**, e o transporte foi resolvido com um
CTA que *"copia link com âncora `#compara`"*. Uma âncora não é um artefato: o sócio recebe um
link, cai no meio de uma página escura de 10.000px, sem contexto, sem saber o que aconteceu antes
nem o que se espera dele. O que a diretriz pede é uma coisa que **sobreviva fora do site**.

**As duas armadilhas que o documento já mapeou (coluna toda verde; nomear concorrente) estão
corretas e as concessões honestas ao concorrente são a parte mais importante da seção.** Manter
sem alteração.

Correções em D.

---

## VEREDITO 5 — Ausência total de prova social

# DUAS DAS TRÊS SUBSTITUIÇÕES SÃO REAIS. UMA É TEATRO. E A MAIS BARATA É A QUE NÃO FOI FEITA.

### O que efetivamente substitui

**1. A §5 — mas só se ela funcionar, e hoje ela não funciona.**

Isto merece ser dito com força, porque o documento está sendo modesto demais sobre o próprio
argumento. Um depoimento exige que a pessoa confie em um terceiro que ela não conhece, sobre um
projeto que ela não viu, avaliado por um critério que ela não escolheu. O demo não exige confiar
em ninguém: ele roda com o dado dela, no equipamento dela, sob o critério que está escrito na
tela. Isso é **knowledge in the world** no sentido mais literal do termo, e é
**epistemicamente superior a um depoimento** — não um substituto de segunda linha.

E é exatamente por isso que ele é binário. Um instrumento que prova competência com esse rigor
prova incompetência com o mesmo rigor. Hoje, medido, ele erra. **Portanto hoje o site não tem
prova nenhuma — tem uma aposta em aberto.** Consertar o motor não é uma tarefa de engenharia
paralela ao design: é a condição de existência da tese central dos dois documentos.

**2. A §7 Quem faz — e é o único substituto que funciona sozinho.**

`ARQUITETURA-SECOES` §0 já diz a coisa certa: o fator 4 (conexão com o resto da web) *"é o único
que nenhuma seção pode substituir"*. Correto. Registro a consequência que o documento não tira:
**o ativo de confiança mais barato do projeto inteiro é o único que não foi feito.** `perfil.ts`
está com `PREENCHER: nome`. Nome, foto, bio, LinkedIn, GitHub, WhatsApp — isso é uma tarde de
trabalho e não depende de nenhuma decisão de arquitetura, de nenhum mockup, de nenhum gate. Está
listado como D-F, o último da tabela de decisões do founder. Pela minha leitura da pesquisa que o
próprio projeto reuniu, ele é o primeiro.

**3. O bloco "o que eu já construí" (§5.4) — endosso integral.**

Descrever software que existe, no presente, sem número de resultado, é procedência de construtor,
e procedência é a resposta a *"esse cara sabe construir?"* que nem o demo nem os compromissos
dão. A regra proposta (o que pode / o que não pode) está correta e é aplicável sem ambiguidade. E
`DIRECAO-ARTE` §7 acerta ao especificar **formato de nota técnica, não de card de case** — a
diferença de forma é a diferença de alegação, e isso é design como comunicação no sentido exato.

### O que só parece substituir

**A §10 Compromissos. Aqui eu discordo do documento.**

§5.2 argumenta: *"cada célula é falseável agora… Compromisso verificável é o análogo honesto de
verificação por terceiro."* Não é, e a diferença importa.

Um review de terceiro é uma afirmação sobre o **passado**, feita por **outra pessoa**,
verificável **antes** de você se comprometer. Um compromisso é uma afirmação sobre o **futuro**,
feita pelo **próprio interessado**, verificável **depois** que você já entrou na conversa. A
única coisa que um compromisso prova sozinho é que o autor sabe o que deveria prometer — e saber
o que prometer é exatamente o que todo vendedor ruim também sabe.

Isto não derruba a seção. A §10 é **boa** — como tratamento de objeção, que é precisamente o que
o M4 diz que ela é (*"Prova.tsx hoje não é uma seção de prova, é uma seção de garantias"*). O
documento acerta no M4 e escorrega no §5.2 ao promovê-la de volta a prova. É o rótulo que precisa
cair, não a seção. E o rótulo importa: chamar promessa de prova é o primeiro passo do caminho que
termina em selo inventado — o caminho que `CONTEXT.md` §3 proíbe.

**A §2 Faixa de verbos no slot dos logos — risco corretamente declarado, mitigação incompleta.**

§5.1 já registra o risco (*"pode ser lida como 'o lugar onde os logos deveriam estar'"*) e propõe
rótulo mais tratamento tipográfico de faixa. Concordo. Falta o **teste**, e ele é barato:
mostre a dobra mais a §2 a cinco pessoas por 10 segundos e pergunte *"o que estava logo abaixo do
título?"*. Se alguém responder "empresas", "clientes" ou "parceiros", a faixa falhou e o plano B
do §5.1 (cortar a posição 2) entra. Se responderem "coisas que ele faz", passou. Isso é
observação, não opinião, e cabe em uma tarde.

**A linha de honestidade da dobra (§6.2) — apoio, com duas correções.**

A copy *"Sem case ainda. E eu não vou inventar um."* é o melhor texto do projeto e está preso na
décima seção. Promovê-lo à dobra é certo: *design is an act of communication*, e o único
movimento que transforma uma ausência em posição é nomeá-la antes que o outro a note.

Correção 1 — **cuidado com o peso**. `DIRECAO-ARTE` §1 manda *"mesmo peso visual do selo que ela
substitui, nunca menos"*. Isso está certo para o bloco inteiro e errado para a metade A: peso
visual alto sobre uma negação amplifica a negação. Dentro do bloco, quem carrega o peso é a
metade **B** — a alegação falseável. A declaração é a moldura, não o objeto.

Correção 2 — **o "2 ms" é um número congelado ao lado de um contador ao vivo.** `DIRECAO-ARTE` §1
e `ARQUITETURA-SECOES` §6.2 fixam o micro-selo `roda no seu navegador · sem cadastro · resultado
em 2 ms`. Medido (Node/V8, não navegador — a ordem de grandeza é a mesma, o valor exato não):
`totalMs` variou entre **0,03 e 0,98** em oito execuções por amostra, e `Demo.tsx` renderiza esse
valor com duas casas decimais. Ou seja: a dobra promete 2 ms e o painel,
três seções abaixo, mostra `0,15 ms`. O visitante que rolar desmente o site em cinco segundos —
e o custo disso está medido na pesquisa do próprio projeto em 19% de abandono permanente. Ou o
número da dobra é lido do mesmo `totalMs`, ou a copy perde o número (*"sem servidor · sem
cadastro · roda no seu navegador"*). **Nunca um número fixo ao lado de um número medido.**

Nota menor de mesma família: `0,15 milissegundos` é uma unidade de engenheiro. O documento já
antecipa isso (*"Se 2 ms parecer pouco impressionante, o problema é de copy"*) e a saída não é
inflar — é dizer as duas coisas: a frase carrega o sentido, o algarismo carrega a auditoria.

---

# CORREÇÕES CONCRETAS

Ordenadas por sequência de execução. **B vem antes de tudo**: consertar a interface de um motor
que erra só torna o erro mais fácil de alcançar.

## A · Estado inicial e affordance de entrada

**A1 — Uma etapa por linha, e o campo mostra isso.**
Substituir o `textarea` único por um campo estruturado: três linhas numeradas visíveis
(`01` `02` `03`) com "+ adicionar etapa". Continua texto livre — a pessoa escreve o que quiser em
cada linha — mas o formato deixa de ser regra oculta e vira **constraint física**
(`six_design_principles → constraints`: "Do physical/logical/cultural restrictions prevent
errors?"). Constraint é sempre superior a instrução, porque não depende de a pessoa ter lido.

Efeito medido que isso elimina de uma vez: a sub-segmentação silenciosa (falha nº 1), a
dependência de pontuação, o teto de 12 invisível (vira contagem visível) e a ambiguidade de
formato dos 16 exemplos.

Guarda-corpo obrigatório: manter **"colar tudo de uma vez"**, que aceita texto corrido e roda o
`separarEtapas` atual — para quem já tem o processo escrito em algum lugar. Ver a ressalva séria
em "Onde eu estou errado", item 1.

**A2 — A instrução sai do placeholder e vira rótulo permanente.**
Uma linha acima do campo, sempre visível: *"Uma etapa por linha — do jeito que você contaria para
um funcionário no primeiro dia."* Placeholder some no primeiro caractere; instrução não pode
sumir.

**A3 — O botão desabilitado precisa dizer por quê.**
Hoje: `disabled={texto.trim().length < 12}` com `opacity: 0.45` e nenhuma explicação; e `rodar()`
ainda retorna em silêncio se a condição não passar. Controle inerte sem signifier de causa é gulf
of execution puro — a pessoa forma a intenção, não consegue especificar a ação e não descobre o
motivo. Corrigir com micro-rótulo permanente ao lado do botão (*"escreva pelo menos uma etapa"*)
que troca para a contagem viva de A/C1 assim que houver conteúdo.

**A4 — A frequência precisa aceitar "por mês".**
Trocar `número + "vezes por semana"` por `número + seletor de unidade (por dia · por semana · por
mês)`. Hoje o `min={1}` semanal torna o processo mensal inexprimível e infla 4,33× quem tenta.
Este é o único ponto da interface que **obriga** o visitante a produzir um número que não é o
dele — e a regra fundadora do projeto é exatamente essa.

## B · Prevenir o erro no motor — antes de qualquer redesenho

**B1 — Fronteira de palavra no casamento.** `plano.indexOf(termo)` sem `\b` produz, medido:
`geralmente`→cálculo/12min · `sobra`→presencial · `balança`→transcrição · `informação`→
notificação. Custo: uma função. Efeito: uma classe inteira de erro visível deixa de existir.

**B2 — Primeira pessoa no dicionário.** Medido: 5 de 8 pares falham. Reduzir os termos ao radical
(`confir`, `mand`, `busc`, `salv`, `fech`, `envi`) ou listar as duas conjugações. Hoje `copia`
tem o par `copio` e `lanca` tem `lanco` — a intenção existia e ficou pela metade.

**B3 — `monta` · `entrega` · `produz` não são presenciais em fala de PME.**
Medido: *"monta a proposta no Word"*, *"montamos o orçamento à mão"*, *"faço a entrega do
relatório por e-mail"*, *"produzimos o relatório mensal"* — todas voltam **"acontece no mundo
físico", 0 minuto**. Ou qualificar por objeto (`monta` + proposta|orçamento|relatório|planilha →
cálculo), ou esvaziar `presencial` para os inequívocos (`visita`, `vai até`, `instala`, `carrega`,
`medição no local`) e deixar `obra` só com fronteira de palavra.

**B4 — Vírgula e "e" como separadores fracos.** Secundário se A1 entrar; **obrigatório** se não
entrar. Medido: quatro etapas separadas só por vírgula viram uma.

**B5 — O teto de 12 precisa falar.** `separarEtapas` faz `.slice(0, 12)` e o trace ainda anuncia
`12 etapas identificadas`. Ou o teto sobe, ou o trace diz *"li as 12 primeiras de 15 — o resto
entra na conversa"*.

## C · Feedback, e o que fazer quando a máquina não reconhece

**C1 — Contagem de etapas ao vivo, antes de rodar.** Enquanto a pessoa digita: *"3 etapas até
agora"*. Esta é a correção mais barata de todo o documento e a de maior efeito sobre o gulf of
evaluation, porque **acontece antes do erro**: o visitante vê o modelo da máquina se formando e
corrige o próprio texto sem nunca receber um número errado. É o princípio *"the best error
message is the one that never shows up"* aplicado onde ele de fato cabe.

**C2 — O `✓` do trace não pode marcar uma falha.** Hoje toda linha do trace recebe `✓` em bronze.
Regra: o `✓` só na operação que produziu resultado utilizável. Separação que devolve 1 etapa para
texto acima de ~15 palavras vira `!` em `--ink-3`, com o detalhe *"li tudo como uma etapa só —
separa por linha que eu leio melhor"*. Um trace que só sabe dizer "deu certo" não é
transparência; é vitrine.

**C3 — "Não li" deixa de ser veredito e vira pergunta. Esta é a correção mais importante da lista.**

O motivo atual — *"não reconheci o verbo — isso é conversa, não chute"* — é honesto e é a melhor
copy do projeto. O que falta é **recuperação** (`error_classification → recovery`): a saída tem
que estar oferecida no mesmo lugar onde a falha aconteceu.

Concretamente: ao lado de cada etapa marcada "não li", quatro ou cinco chips —
`é digitação?` · `é aviso?` · `é consulta?` · `é resposta ao cliente?` · `fica comigo`. Um toque
reclassifica, o total recalcula na frente dela, a premissa continua visível.

Três razões, cada uma com princípio:

1. **Recovery.** A falha da máquina vira participação da pessoa, no ponto exato do erro.
2. **Nada é inventado.** Os minutos continuam sendo a premissa declarada da categoria — só que
   agora a categoria foi escolhida por **ela**. Isso fortalece a regra 4 do §4.3 (*"a frequência
   quem informa é o visitante"*) em vez de contorná-la: mais do número passa a ser dela.
3. **Nunca culpar a pessoa.** *"When people have trouble with things, it is not their fault — it
   is the fault of the design."* Hoje a única saída oferecida a quem recebeu "não li" é reescrever
   o próprio texto até a máquina gostar. Isso é pedir à pessoa que se adapte ao dicionário. Chip
   de reclassificação inverte o ônus para onde ele pertence.

Efeito colateral valioso: cada reclassificação é um dado real de calibração do dicionário, com um
contador e nada mais.

**C4 — Hoje "não li" e "parcial" têm o mesmo selo.** Em `Demo.tsx`, `SELO[e.veredito]` recebe
`indefinida → parcial → .selo-parcial`; o rótulo textual muda ("não li") mas a forma, a cor e a
borda são idênticas às de uma etapa lida pela metade. `DIRECAO-ARTE` §5 já corrige (tracejado,
sem preenchimento) — registro aqui que isso é **requisito, não estilo**: sem distinção de forma,
a pessoa não descobre que a máquina falhou, e a marcação honesta é literalmente a única coisa que
o projeto tem para oferecer no lugar da prova que não tem.

**C5 — O feedback nasce fora do campo de visão e fora da região viva.**
Em `Demo.tsx`, `aria-live="polite"` envolve **apenas** o painel de trace; o `<Resultado>` — o
número de horas, as etapas, a premissa — é renderizado depois do `grid-demo`, fora de qualquer
região viva, e nada no código move o foco nem rola até ele. Isso é verificável no código. O que
eu **não** medi em navegador, e portanto declaro como risco a confirmar: em 1366×768 (a régua que
o próprio projeto adota em §6.3.3) é provável que a pessoa que clicou "mapear" veja os dois cards
aparentemente inalterados. Corrigir com `aria-live` no resultado + foco programático no cabeçalho
do resultado + `scrollIntoView` suave. **Feedback que acontece fora do campo de visão não é
feedback.**

## D · O resultado

**D1 — Piso de dignidade do número.**
Medido: *"perco cliente no whatsapp"* → 0,7 h/mês, exibido em 44px com contador animado. Regra:
com **uma única etapa** identificada, ou abaixo de um piso (sugiro 2 h/mês), o resultado **não
lidera com o número**. Lidera com a pergunta que falta: *"isso é o começo do processo ou o
processo inteiro? Me conta o que acontece depois que a mensagem chega."*

Isto não viola nenhuma das quatro regras do §4.3: nada é inventado, nada é inflado. Apenas um
input incompleto deixa de ser promovido a manchete de uma oferta minúscula. E tem efeito de
conversão direto: a pergunta puxa a segunda rodada de digitação, que é onde o número bom mora.

**D2 — A conta vira conta, não parágrafo.**
Hoje a premissa é um bloco de 13px com os números embutidos na prosa. Ela é o segundo objeto mais
importante da seção, porque é o que torna o número **contestável** — e contestável é a tese.
Vira três linhas de aritmética alinhadas (`min por execução × vezes por período × 4,33 = X h/mês`),
para que a pessoa possa discordar de **uma linha**, não do parágrafo inteiro.

## E · Persistência (§4.4) — dois requisitos e uma reordenação

**E1 — Editável e removível, não só visível.** O documento pede *"transparência, não mágica
silenciosa"* — concordo e endureço: sem `editar` e `remover` visíveis no bloco anexado, quem sabe
que o mapa saiu errado tem uma única saída, que é **não enviar**. Anexo irremovível transforma um
erro do motor em abandono de lead.

**E2 — Ordem correta: B (motor) → C (feedback) → E (persistência) → §4.5 (canal).**
O documento prioriza 4.4 antes de 4.5 e está certo. Acrescento que B e C vêm antes das duas:
transportar um mapa errado com mais eficiência é acelerar o dano.

## F · A matriz (§9)

**F1 — Conclusão primeiro, matriz como evidência.** Uma frase acima da tabela dizendo o que a
tabela conclui. O teste de um bom conceptual model é: *uma pessoa nova consegue dizer, em 10
segundos, o que isto está dizendo?* Uma matriz sem manchete obriga o leitor a derivar a conclusão
a partir de 25 células. Isso é `progressive disclosure`: manchete → evidência → detalhe.

**F2 — 4 colunas, não 5.** Cortar `plataforma DIY (Wix/Squarespace)` — para dono de indústria
pequena é a alternativa menos real, e o *"meu sobrinho faz"* já está coberto por `freelancer`.
Ficam: `agência` · `freelancer` · **`ficar como está`** · `Talos`. De 25 células para 20. A
quarta coluna **nunca** sai; é a única que fala do concorrente que realmente ganha.

**F3 — Se o founder insistir em 5×5, então 3 linhas.** As três que mais matam: *quem conversou
com você é quem constrói?* · *o escopo e o prazo entram por escrito antes de começar?* · *dá pra
ver funcionando antes de aprovar?* — esta última é a única que aponta de volta para a §5, e é a
mais forte por isso.

**F4 — O CTA do decisor não pode ser uma âncora.** *"mandar isso pro meu sócio"* copiando
`#compara` entrega ao sócio um link para o meio de uma página de 10.000px, sem contexto. O que a
diretriz B2B pede é um artefato que sobreviva fora do site. A versão mínima e barata: o botão
copia **o texto da comparação** (mais o mapa da §5, se houver) para a área de transferência,
pronto para colar num WhatsApp. Zero backend, zero PDF, e o sócio recebe a coisa em vez do
endereço da coisa.

**F5 — Manter sem tocar:** as duas concessões honestas ao concorrente e a proibição de nomear
concorrente. São o que faz a seção ser lida como informação.

---

# ONDE EU ESTOU ERRADO

Cinco lugares em que o rigor de usabilidade que eu acabei de aplicar pode custar mais venda do
que compra. `security.boundaries` do meu próprio arquivo: *"Expert analysis complements but does
not replace observation of real users."*

**1 · A correção A1 pode matar a seção que ela conserta.**
O `textarea` nu tem uma virtude que o campo por linhas destrói: ele parece **conversa**, não
formulário. O posicionamento inteiro do site é *"descreve aí, com as suas palavras"* e
*"respondo eu, não um formulário"*. Se a §5 virar um formulário de etapas numeradas, ela ganha
precisão e perde a coisa que ela vende — que a máquina entende gente falando. Eu não tenho
certeza de que, para este público, um demo preciso vale mais do que um demo que parece humano. A
saída provável é A1 como padrão com "colar tudo de uma vez" muito visível, mas **isso é uma
hipótese minha, não um resultado**, e é a primeira coisa que eu testaria com gente de verdade.

**2 · Eu ataquei a cauda; talvez a venda esteja inteira na cabeça.**
Quase todo o Veredito 1 é sobre o que acontece **quando alguém digita**. Mas o visitante-alvo do
D2 já foi prospectado: ele chegou para checar se o cara é real, não para usar um brinquedo. É
inteiramente possível que a §5 seja lida em oito segundos, sem ninguém digitar nada, e que o
trabalho dela seja **visceral** — "existe uma coisa aqui que roda de verdade". Nesse cenário,
oitenta por cento das minhas correções não movem a receita, e o único item que move é o `perfil.ts`
preenchido. Eu não tenho dado de comportamento deste site; eu tenho o motor. **Antes de gastar
uma semana no dicionário de verbos, alguém precisa assistir cinco pessoas usarem a §5 em
silêncio.** Se três das cinco não digitarem nada, minha lista inteira muda de prioridade.

**3 · Eu apertei uma régua que já era mais rigorosa do que a venda exige.**
D1 (piso de dignidade) e A4 (unidade de frequência) tornam o número mais honesto e mais raro. Um
site que se recusa a afirmar não vende. Existe um ponto em que honestidade vira timidez, e eu não
sei onde ele fica neste mercado — o founder sabe.

**4 · Sobre a §10, eu posso estar aplicando um rigor que ninguém aplica.**
Eu tirei da faixa de compromissos o rótulo "prova". Comercialmente isso pode ser um erro: o slot
é o mesmo, o objeto visual é o mesmo, e chamar de prova pode ser exatamente o que faz o visitante
tratar como prova. Estou aplicando uma distinção epistemológica que talvez nenhum dono de PME
faça. Registro a discordância e não morro nela.

**5 · Sobre a matriz, existe um argumento que eu não consigo refutar.**
Eu recomendo encolher. Mas uma tabela grande **parece trabalho feito**, e um site sem case
precisa parecer que alguém pensou muito. Uma matriz 4×4 é mais legível e menos impressionante. Se
a §9 for lida sobretudo por um decisor que passa vinte segundos e nunca lê célula nenhuma, o
volume é parte da mensagem e eu estou otimizando a leitura de um objeto que ninguém lê.

---

# UMA PERGUNTA — só o founder responde

> **Você já faz esse diagnóstico ao vivo, na primeira conversa de todo projeto. Quando você pede
> para a pessoa descrever o processo dela: quantas etapas ela te dá antes de você precisar
> perguntar, e em que ponto exatamente ela para de descrever o processo e começa a reclamar da
> vida?**

Por que só ele: `always_do` — *"Always ask 'have you watched real people use this?' before
prescribing"*. **Ele é a única pessoa deste projeto que já observou dezenas de donos de PME
executando exatamente esta tarefa.** Esse dado existe, é primário, não custa nada e não foi usado
em nenhum dos dois documentos.

E ele calibra, de uma vez, quase tudo que está em aberto acima:

- **quantas etapas ela dá sozinha** → quantas linhas o campo de A1 nasce mostrando (três é chute
  meu);
- **em que palavras ela dá** → se o dicionário deve ir para a primeira pessoa (B2) e quais verbos
  faltam;
- **quando ela troca descrição por desabafo** → se o "não li" é falha do dicionário ou o momento
  legítimo em que a máquina deve parar de mapear e chamar uma pessoa (C3);
- **se ela dá uma etapa ou cinco** → se o piso de dignidade (D1) é um caso de borda ou é o caso
  comum.

Se a resposta for *"ela me dá uma frase e eu puxo o resto com perguntas"*, então o desenho certo
da §5 não é um campo — é **uma pergunta de cada vez**, e metade deste documento precisa ser
reescrita. Essa possibilidade é séria o bastante para eu recomendar que a resposta venha **antes**
de qualquer implementação da lista B–F.

---

## Reprodutibilidade

Toda medição deste documento saiu de execução direta de `apps/talos/lib/mapear.ts` via `jiti`
(Node 24), com cerca de 70 entradas: os 16 processos literais de `CasosDeUso.tsx` · 3 variantes do
`placeholder` do próprio `textarea` · 8 pares mínimos de conjugação (3ª vs 1ª pessoa) · 8
armadilhas de substring · 3 formulações da dor do briefing · teto de etapas (15 escritas) ·
frequência mensal · variância de `totalMs` em 8 execuções por amostra · 19 processos livres de
indústria, comércio, clínica e obra.

Nenhum número aqui foi estimado, arredondado ou inferido. Onde eu não medi — a posição do
resultado na dobra de 1366×768, o comportamento de leitura em celular, a taxa de digitação real —
está escrito que não medi.

---

-- Don Norman, designing for people as they are, not as we wish them to be
