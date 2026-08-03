# Avaliação de POSICIONAMENTO — 4 templates finalistas (site Talos)

**Consultor:** clone `april-dunford` (dossiê real: `D:\AIOS\.codex\agents\april-dunford.md`,
carregado via `self-consultation.js`, consultationId `a8fef830-769b-4f58-9732-e99a7289d87e`).
**Data:** 31/Jul/2026 · **Escopo:** só posicionamento. Não avalio gosto visual nem stack.
**Insumos lidos:** `BRIEFING-FINALISTAS.md`, `00-context/CONTEXT.md` (§3, §4, §5),
capturas `shots-finalistas/*-live-0.png` (as quatro, lidas como imagem — não como descrição do vendedor).

> Nota de método: cada conclusão abaixo vem etiquetada com **qual framework meu** a produziu.
> Se não tem etiqueta, é opinião — e opinião não decide isso.

---

## 0. Antes de responder qualquer pergunta: rodei as 5 Components

**Framework: 5 Components of Positioning.** A ordem importa. Quem começa pela categoria
("somos uma agência de IA") produz lixo. Começo por alternativas competitivas.

### Componente 1 — Alternativas competitivas
Pergunta: *o que o dono de PME brasileira faria se o Talos não existisse?*
Não "quem são os concorrentes". O que ele **faria**.

| # | Alternativa real | Frequência estimada | Preço que ele já conhece |
|---|---|---|---|
| 1 | **Status quo** — planilha, WhatsApp, caderno, "a Fulana faz e funciona" | altíssima | R$0 percebido |
| 2 | **Contratar mais uma pessoa** — assistente/estagiário | alta | R$2–3k/mês + encargos |
| 3 | **Comprar a ferramenta que o contador/o colega indicou** — módulo de ERP, Bling, etc. | média | mensalidade conhecida |
| 4 | **O sobrinho / o freela que "mexe com computador"** | média | R$800–2.500 uma vez |
| 5 | Outra agência de IA | **baixa** | desconhecido |

**Conclusão 1 (5 Components §1):** a alternativa competitiva do Talos **não é outra agência de IA.**
É a planilha e é a contratação. Perdi essa venda pra planilha — é literalmente o meu caso clássico.
O briefing e o CONTEXT nunca escreveram isso, e é o dado que muda tudo abaixo.

### Componente 2 — Atributos únicos
O que o Talos tem que a planilha, o funcionário novo e o Bling não têm:
`apps/talos/lib/mapear.ts` — **837 linhas, 34,6 KB, roda no navegador em ~2 ms, sem rede, sem chave.**
O visitante descreve o processo dele e recebe o mapa + as horas devolvidas. Verificado em disco.

Nenhuma das 5 alternativas faz diagnóstico antes de cobrar. O funcionário novo você contrata pra
descobrir. O Bling você assina pra descobrir. O freela você paga pra descobrir.

### Componente 3 — Valor
Não é "automação com IA". É: **você descobre quantas horas/mês o seu processo queima, em 2 minutos,
sem reunião, sem proposta e sem pagar.** Isso ataca diretamente o inimigo real do B2B — 40-60% dos
negócios morrem em **no decision**, não pra concorrente. Quem não tem número não decide.

### Componente 4 — Clientes best-fit
Aqui eu discordo do founder, e é a discordância mais cara deste documento. Ver §2 abaixo.

### Componente 5 — Categoria de mercado
**Framework: 3 Market Category Strategies.**

| Estratégia | Categoria | Veredito |
|---|---|---|
| Head-to-Head | "agência de automação com IA" | ❌ Oceano saturado em 2026. Dois templates grátis, de autores diferentes, já vendem essa frase. Se um template de prateleira consegue dizer o seu posicionamento, você não tem posicionamento — tem boilerplate de categoria. |
| **Big Fish, Small Pond** | "devolução de horas em processo de PME industrial brasileira" | ✅ **Recomendado.** O diferencial (diagnóstico grátis e instantâneo) é *obviamente awesome* nesse frame, e o adversário nomeado vira a contratação e a planilha — dois adversários que o Talos vence. |
| Create a New Game | categoria nova | ❌ Custa educação de mercado que um operador solo sem caixa não banca. |

**Consequência incômoda:** se a alternativa é "contratar uma pessoa" e "a planilha", então o
vocabulário **"IA" está trabalhando contra o Talos.** Dono de PME não quer IA. Quer a nota fiscal
saindo sexta sem ficar até as 20h. "IA" acrescenta risco percebido (novidade, dependência,
"e se der errado?") e zero valor percebido. Contratar gente, ele entende, precifica e sabe demitir.

---

## 1. Espinha de portfólio: erro recuperável por edição ou dívida estrutural?

### 🔴 Decisão: **dívida estrutural. Não se conserta editando seção.**

**Framework: categoria de mercado como contexto (metáfora da cena de abertura).** A navegação de um
site **é uma declaração de categoria**. `WORKS` / `PROJECTS` na nav diz ao visitante, antes de
qualquer copy: *"me julgue pelo acervo"*. Você acabou de entregar ao comprador um critério de
avaliação no qual sua nota é zero — e por decisão própria (§3 do CONTEXT), não por acaso.

Isso é jogar xadrez contra o Bobby Fischer. Só se joga onde se pode ganhar.

**Por que edição não resolve:** a premissa de portfólio não mora em *uma* seção. Ela está distribuída
por nav, hero, módulo above-the-fold, parede de logos, rodapé e — o mais difícil de ver — no **ritmo
de rolagem** (hero → obras → sobre → contato). Apagar o item "Works" do menu remove o rótulo, não
remove a promessa. Sobra o buraco no lugar mais nobre da página, exatamente como o briefing temeu.
Precedente citado no próprio briefing: 3 rodadas do Talos perdidas refinando sobre base errada.

**Teste executável, para não depender de opinião na próxima rodada:**
> Conte os *slots acima da dobra* que exigem prova-do-passado (obra, logo de cliente, case, número).
> **≥ 1 = dívida estrutural. Descarta.**

Medido nas capturas:
- `fr-agenciy`: **3** — módulo "Featured (02)", parede de logos (`hues` / `venice.` / `ca…`), lista "We do:" com 4 serviços.
- `wf-idesignerlite`: **1**, e é o pior tipo — o hero **é** o nome do operador em display de ~200px, com "WELCOME" em cima.
- `wf-conicorn`: **0**.
- `fr-stackgrid`: **0** acima da dobra (mas 2 na nav: Pricing, Case Studies).

---

## 2. "Processo é prova" — posicionamento defensável ou racionalização?

### 🟡 Decisão: **nem um nem outro. É um erro de camada.**

**Framework: hierarquia Positioning → Messaging → Branding.** "Processo é prova" **não é
posicionamento**. É o **Passo 6 (Proof) do Sales Pitch de 8 passos**. Chamar isso de posicionamento é
o erro clássico de fazer mensagem antes de posicionamento — pintar a parede antes da fundação.
O CONTEXT §3 registra isso como "saída adotada", como se estivesse fechado. Não está: é uma tática de
prova pendurada num Componente 4 que ninguém definiu.

**Como *prova*, é defensável — sob uma condição só:** a demonstração tem que rodar **no dado do
próprio comprador, ao vivo**. Aí ela deixa de ser afirmação sobre o passado e vira evidência no
presente — e é *mais forte* que depoimento, porque quem gerou o número foi o comprador.
`mapear.ts` cumpre isso (837 linhas, ~2 ms, sem rede). É o único ativo do projeto que prova o negócio,
e o CONTEXT já sabe disso.

**As três condições em que quebra** (todas falsificáveis, use como gate):

1. **Demo enlatada.** Se rodar exemplo pronto em vez do processo que o visitante digitou, degrada
   pra vídeo de produto. Vídeo é afirmação, não prova. Quebra imediatamente.
2. **Prova capacidade, não desfecho.** "Sei mapear seu processo" ≠ "sei automatizar e você recupera
   as horas." O vão entre o mapa e a entrega é **exatamente onde mora o no decision** (40-60%).
   O comprador ganha um mapa bonito, agradece e não faz nada. Este é o risco real, e **nenhuma
   escolha de template toca nele.**
3. **Fácil demais.** Se a reação for "que joguinho legal", virou isca de lead — e isca não confere
   credibilidade. A demonstração precisa custar especificidade ao visitante pra ser acreditada.

### 🔴 E aqui está a racionalização de verdade — não é "processo é prova", é a premissa

O CONTEXT §3 diz *"não tenho resultado real"*. O CONTEXT **§5, no mesmo arquivo**, lista: Noyce
entregue à ENIAC (6 estágios, eval gate PASS 20/21, decks entregues), Anipis em produção com 20
contas, ENIAC Financeiro (fases 1–3), Contador (31 commits, 16 módulos), meses de operação de tráfego
real. O próprio documento conclui: *"o que falta não é projeto, é case empacotado (~3-5 dias)"*.

**Framework: best-fit customers.** O founder não tem "zero resultado". Ele tem **trabalho entregue
sem permissão de citar o cliente e sem número empacotado**. São problemas completamente diferentes, e
o segundo tem saída honesta que ele não usou: **narrativa de processo anonimizada e quantificada,
em primeira pessoa.** *"Sistema de leitura de editais públicos para uma empresa de engenharia:
6 estágios, gate de qualidade 20/21."* Zero nome de cliente. Zero número inventado. Zero depoimento
fabricado. **Zero violação da regra inegociável.**

Confundir *"não posso citar o cliente"* com *"não tenho o que mostrar"* está custando ao projeto a
vitória de posicionamento mais barata disponível — 3 a 5 dias, pela estimativa do próprio repositório.

---

## 3. T1 continua aberta. A escolha de template resolve, agrava ou é neutra?

### 🟡 Decisão: **não pode resolver. Pode agravar. Nunca é neutra.**

**Framework: Positioning Before Messaging.** T1 é contradição de *posicionamento* (Componentes 4 e 5
+ estratégia de prova). Template é mobília da camada de mensagem. Não se conserta contradição de
posicionamento escolhendo pele.

**Mas agrava, e dá pra medir.** Template de espinha de portfólio **amplifica a exigência de "falar de
mim"** justamente enquanto o founder se recusa a falar. Ele cria buracos que só "eu" preencho.
`wf-idesignerlite` é o caso extremo: o hero é o nome do operador em display gigante com "WELCOME" em
cima. **É a contradição da T1 renderizada como layout** — 100% de "falar de mim" com 0% de material.

**E há uma saída que fecha a T1 — mas ela é uma decisão, não um template.** D2 diz "prioridade em
credencial: o site fecha a dúvida de quem já foi prospectado". Quem já foi prospectado **já falou com
o founder**. A dúvida que sobra na cabeça dele não é *"quem é você"* — é ***"você consegue mesmo
fazer isso?"***. Essa dúvida é fechável por demonstração.

**Recomendação executável:** redefinir *credencial* no CONTEXT como **capacidade demonstrada ao vivo**,
não como reputação acumulada, e marcar T1 como resolvida com essa redação. A contradição some — ela
só existia porque "credencial" estava sendo lida como "currículo".

---

## 4. Herdar o discurso "eliminamos trabalho manual com IA" ajuda ou apaga a diferenciação?

### 🔴 Decisão: **apaga. E é a armadilha mais perigosa das quatro, porque é invisível.**

O que os dois templates dizem, lido na captura:

- **conicorn:** *"We build AI-powered automation systems that **eliminate manual work**, reduce costs,
  and multiply your business performance."*
- **stackgrid:** *"Make custom AI agents and secure data pipelines to **eliminate your manual
  workflows**."*

**A medição está aí:** dois templates gratuitos, de autores diferentes, em plataformas diferentes,
convergem na mesma frase. É o meu diagnóstico de "AI-powered project management platform for modern
teams", palavra por palavra: **"AI-powered" não é diferenciador quando toda alternativa reivindica.**

**Framework: alternativas competitivas.** Pior: essa frase mira o adversário errado. Ela se posiciona
contra *outras ferramentas de automação* — a alternativa #5 da minha tabela, a de menor frequência.
O adversário real do Talos é a planilha (#1) e a contratação (#2). Um dono de PME lendo "AI-powered
automation systems" não pensa "melhor que minha planilha"; pensa "isso não é pra mim".

**Herdar esse discurso move o Talos de um lago onde ele seria peixe grande (tempo de processo de PME
industrial brasileira) para um oceano onde ele é invisível (automação com IA global).** É trocar Big
Fish Small Pond por Head-to-Head contra milhares, voluntariamente.

**A nuance que salva os dois templates mesmo assim:** o **esqueleto** deles está certo — acima da
dobra é *afirmação sobre o mundo do comprador → subhead de custo → duas CTAs*. Sem portfólio, sem
parede de logos, sem currículo. **A copy é 100% descartável em uma hora. O esqueleto não é
substituível de jeito nenhum.** Julgue o esqueleto, jogue a copy fora.

**Por que é a armadilha mais perigosa:** buraco de portfólio é *visível* — incomoda e é consertado.
Frase genérica de categoria **parece pronta** e nunca é consertada. Ela passa no review porque soa
profissional. Escreva isso no build: *nenhuma frase do hero dos templates sobrevive ao commit.*

---

## 5. Ranking dos 4 — puramente por posicionamento

### Critério explícito (declarado antes de olhar o resultado)

> **Qual esqueleto acima da dobra exige o MENOR número de afirmações que o founder não pode fazer
> honestamente, dedicando o MÁXIMO de área à dor do comprador e ao objeto vivo (§3, `mapear.ts`)?**

Subcritérios, na ordem das 5 Components:
- **(a)** o esqueleto exige prova-do-passado acima da dobra? → **peso desclassificatório**
- **(b)** a dobra fala do mundo do comprador ou do currículo do vendedor?
- **(c)** existe slot onde um objeto interativo vivo caiba sem destruir o layout?
- **(d)** a categoria implícita pela nav é um lago que o Talos ganha?

| # | Template | (a) slots de prova-do-passado ↓ | (b) dobra | (c) slot p/ demo | (d) categoria da nav |
|---|---|---|---|---|---|
| 🥇 1 | **wf-conicorn** | **0** | comprador | sim, 13.962 px de home | nav é hambúrguer = **não declara categoria** |
| 🥈 2 | **fr-stackgrid** | 0 na dobra, **2 na nav** | comprador | sim — o objeto ASCII central é literalmente a forma certa | ❌ Pricing + Case Studies = 2 categorias proibidas |
| 🥉 3 | **fr-agenciy** | **3** | currículo | espremido | ❌ Projects + Blog |
| 4 | **wf-idesignerlite** | 1, e é o hero inteiro | **currículo puro** | 6.287 px, o menor | ❌ Works |

### 🥇 1º — `wf-conicorn`
**Zero slots de prova-do-passado.** Dobra = afirmação sobre o mundo do comprador + subhead de custo +
duas CTAs, e uma delas ("Work with Us") **já é** a CTA-pra-conversa que o projeto exige (sem preço).
A nav em hambúrguer, que num briefing de design seria demérito, aqui é **ativo de posicionamento**:
não declara categoria nenhuma — não há o que remover nem o que deixar vazio. 13.962 px de home = a
maior área disponível pra construir narrativa liderada por demonstração.
**Custo de adaptação (tudo tinta, nada estrutura):** headline em degradê multicolor é *tell* de
IA-genérica 2026, sai; hero é cinza-claro e D3 pede escuro, troca de fundo; copy é boilerplate de
categoria, 100% descartada; headline já ocupa 2 linhas em inglês — testar com caixa alta PT-BR (+29%)
antes de fechar.

### 🥈 2º — `fr-stackgrid`
Esqueleto honesto e o único cujo **centro da dobra já tem a forma certa**: um artefato de máquina
renderizado ao vivo (o ASCII) exatamente onde `mapear.ts` deveria morar. Mas: **Pricing** e **Case
Studies** na nav não são decoração, são declarações de categoria que o projeto proibiu — removendo as
duas sobra uma nav de 2 itens e um vão na jornada esperada. Some a isso tema claro contra D3, ausência
de export de código (hospedar `mapear.ts` vira briga) e a marca d'água **Made in Framer** visível na
captura. Segundo porque o posicionamento do esqueleto está certo e as violações são enumeráveis —
mas são quatro.

### 🥉 3º — `fr-agenciy`
Visualmente o mais forte dos quatro e o mais próximo de D3 (dark elegante) — **e é exatamente por isso
que é o mais perigoso**. Medido na captura, a dobra contém: lista "We do:" com quatro serviços
(**reinstala a T2**, a tensão "4 ofertas lê como freelancer" que o CONTEXT deu por resolvida em
26/Jul), módulo **Featured (02)** e **parede de logos de cliente** (`hues` / `venice.` / `ca…`).
Nav: Services · About · **Projects** · **Blog** · Contact — e Blog é compromisso de cadência editorial
que ninguém planejou alimentar. Removendo tudo isso sobra uma palavra em serifa e muito preto.
Falha o critério (a) três vezes na primeira tela.

### 4º — `wf-idesignerlite`
Desclassificado por posicionamento, não por gosto. O hero **é** uma marca pessoal: "WELCOME" + o nome
do operador em display de ~200px, com WORKS na nav. É a T1 virada layout: máximo de "falar de mim",
zero material pra dizer. E o robô humanoide 3D preto é o visual mais genérico de "IA" do período
2024-2026 — pra dono de PME brasileira ele sinaliza *ficção científica*, o oposto exato de "a nota
sai sexta". Home de 6.287 px = a menor área pra narrativa de demonstração. Último, e não é perto.

---

## 6. Onde eu discordo do briefing (com o número)

1. **"2 de portfólio vs 2 de automação" está certo na forma e errado na conclusão.** O briefing
   sugere que a dupla de automação é a mais segura. Concordo quanto ao **esqueleto** e discordo
   quanto ao **discurso**: a herança de copy é a mais perigosa das duas, porque **buraco de portfólio
   é visível e frase genérica parece pronta**. Número que sustenta: duas frases quase idênticas em
   dois templates de autores independentes (§4 acima).
2. **O briefing subestima `fr-agenciy`.** Lista o problema como "nav inclui Projects e Blog". A
   captura mostra **três slots de prova-do-passado acima da dobra**, não itens de menu — e um deles
   reabre a T2 que o CONTEXT deu por resolvida.
3. **"Processo é prova" não é uma saída adotada, é uma tática de prova sem posicionamento embaixo.**
   Tem modo de falha nomeado (capacidade ≠ desfecho) que nenhuma escolha de template resolve.
4. **A premissa "não tenho resultado real" (CONTEXT §3) é contradita pelo CONTEXT §5, no mesmo
   arquivo.** É problema de posicionamento fantasiado de problema de prova.
5. **A pergunta 4 do briefing (Framer × Webflow) está formulada como decisão técnica e é decisão de
   posicionamento.** Ver §7.

## 7. Riscos que o briefing não listou

- **jQuery 3.5.1 (2020) nos dois Webflow.** Um site que vende "sistemas de automação modernos"
  carregando runtime de seis anos é contradição de credibilidade que o sobrinho-de-TI do prospect
  acha em 30 segundos no DevTools. Quando você vende engenharia, **a sua própria stack é artefato de
  prova.**
- **Marca d'água "Made in Framer" nos dois Framer** — visível nas duas capturas. É **vazamento de
  posicionamento**: se o site *é* o portfólio (CONTEXT §3, segundo pilar), ele está anunciando que
  foi feito num construtor no-code, no plano grátis. Pior assinatura possível pra quem só tem "olha o
  que eu construí" como prova. Só some pagando.
- **Reuso de template.** Template gratuito é usado por um número desconhecido de outras agências.
  Se o site é o portfólio, um prospect que já viu esse layout **já viu o seu portfólio em outro
  lugar**. Vale para os quatro e está sub-pesado no briefing.
- **D6 — o nome não está fechado.** Hero construído em torno de wordmark (`idesignerlite`, `agenciy`)
  fica refém de uma decisão que ainda não foi tomada. Mais um ponto pro conicorn, cujo hero é frase,
  não logotipo.
- **PT-BR na headline.** O briefing já registra +29% de altura em caixa alta portuguesa. Note que
  conicorn **já usa 2 linhas em inglês**. Testar a headline PT-BR real antes do commit, não depois.

---

## 8. Próximo passo concreto

Não é escolher template. É esta ordem, e ela não pode ser trocada:

1. **Fechar o Componente 4 (best-fit customer)** com os 5 ativos reais do CONTEXT §5, anonimizados e
   quantificados — 3 a 5 dias, sem violar nenhuma regra inegociável.
2. **Escrever a categoria escolhida numa linha** e colar no topo do build: *não é "agência de
   automação com IA"; é devolução de horas de processo pra PME industrial brasileira, contra a
   planilha e contra a contratação.*
3. **Só então** subir o `wf-conicorn`, apagar 100% da copy do hero no primeiro commit e colocar
   `mapear.ts` acima da dobra.

Mesmo produto, contexto diferente, resultado completamente diferente.

— Dunford. 🎯
