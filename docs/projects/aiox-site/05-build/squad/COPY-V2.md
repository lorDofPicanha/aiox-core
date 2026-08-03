# COPY V2 — reescrita completa do site

**Data:** 2026-07-28 · **Autor:** Copy Chief (orquestração de Tier)
**Insumo que manda neste documento:** `01-research/02-dores-pme-brasileira.md` (52 fontes, corpus de 5.100 comentários)
**Substitui:** toda a copy de `apps/talos/components/*.tsx`
**Não decide:** nome da marca (ordem do founder — ignorado de propósito), preço, direção de arte.

> **Regra de leitura deste documento.** Toda escolha de palavra vem marcada assim:
> `[MEDIDO: n]` = frequência espontânea no universo operador (n=3.320 comentários) ou dado de instituto com fonte.
> `[JULGAMENTO]` = decisão minha sem dado por trás. Se você discordar de uma dessas, discorde à vontade — não tem pesquisa defendendo.

---

## 0. TIER 0 — Diagnóstico antes da caneta

### 0.1 Nível de consciência (@eugene-schwartz)

O erro estrutural da copy atual é ter sido escrita para um público **Solution Aware** — alguém que já sabe que existe uma coisa chamada automação e está escolhendo fornecedor. A pesquisa mede o contrário.

| Eixo | Nível real | Evidência |
|---|---|---|
| **Falta de cliente** | **Problem Aware forte** — ele nomeia a dor sozinho | 33% no Sebrae Pulso 12ª ed. (n=8.273), líder há 12 edições |
| **Custo / dívida** | **Problem Aware** | custos 31% · dívidas 21% · 28% com dívida em atraso (recorde da série) |
| **Trabalho repetitivo / processo** | 🔴 **UNAWARE** | `"trabalho repetitivo"` 0 · `redigit*` 0 · `"duas vezes"` 1 · `"três vezes"` 2 · `digitar` 1, em 5.100 comentários |
| **Automação como categoria** | 🔴 **UNAWARE** | `automação` 3 · `automatizar` 3 · `workflow` 0 · `chatbot` 1 |
| **Talos como fornecedor** | **Product Aware** — mas só porque já falou com o founder | `CONTEXT.md` D2 |

**A regra de Schwartz para Problem Aware é dura e não tem exceção: a headline nomeia o problema que ele já nomeia, nunca a solução e nunca o produto.**

O H1 atual — *"O trabalho repetitivo da sua empresa não precisa de gente"* — nomeia uma dor de nível **Unaware** usando duas palavras de frequência zero. Ele não está discordando dessa frase. Ele não está processando essa frase. É pior que uma objeção: é ausência de reconhecimento.

E há um segundo público na mesma página: o visitante do D2, que já falou com o founder e chegou para checar se o cara é real. Esse é Product Aware e quer credencial. **A dobra serve o Problem Aware; a espinha da página (§6, §7, §9, §10) serve o Product Aware.** Nenhum dos dois pode ser servido pelo outro.

> 🔴 **Ressalva de peso (28/Jul).** O D2 é **intenção**, não estado atual: o founder confirmou que
> **ainda não tem cliente nenhum**. Logo esse segundo público **hoje é de tamanho zero** — não
> existe fluxo de prospecção alimentando a página. Consequência prática: **o site precisa
> funcionar FRIO.** Onde este documento oferece variante "sem dado, para quem já falou com você",
> vale a variante **com dado**. Reavaliar quando houver prospecção real rodando.

### 0.2 Sofisticação de mercado (@eugene-schwartz) — o achado que decide a estratégia

A sofisticação aqui é **assimétrica**, e essa assimetria é a coisa mais aproveitável do diagnóstico inteiro.

| Mercado | Estágio | Evidência |
|---|---|---|
| **Solução** (automação de processo para PME) | **Estágio 1–2** — quase virgem | ele produz `automação` 3× em 3.320 comentários. Não há claim gasta porque não há claim |
| **Fornecedor** (agência, software de gestão, "cara de TI") | **Estágio 5 — exausto e queimado** | 4 padrões de falha medidos, todos comerciais: promessa não bateu (Omie) · quem construiu nunca operou · preço subiu depois (Conta Azul 100→500) · sumiram na implantação (TOTVS) |

Traduzindo: **ele não está cético quanto ao que a tecnologia faz. Ele está cético quanto a você.** As três falhas que ele conta na voz crua não são "o software não funcionava" — são "vocês mentiram", "vocês mudaram o preço" e "vocês sumiram".

> **Consequência estratégica nº 1 deste documento.**
> O mecanismo único do Talos **não é tecnológico. É contratual.**
> Todd Brown ensina a construir mecanismo único quando o mercado está saturado. O mercado saturado aqui é o de *fornecedor*, não o de *promessa*. Logo, o mecanismo único é: **escopo por escrito antes de pagar · preço que não muda no meio · manutenção já no combinado · você vê rodando antes de aprovar.**
> Isso não é "seção de garantias". É a oferta. E é exatamente por isso que a §9 (comparação) e a §10 (compromissos) desenhadas pela Uma são as duas seções que mais vendem nesta página — elas atacam a objeção medida, não a objeção imaginada.

### 0.3 A conversa mental (@robert-collier)

O Sebrae fez a pergunta aberta certa para 8.273 pessoas: *"defina em uma frase a situação atual do seu negócio."* Sentimento: 42% neutro, 29% negativo, 27% positivo. As frases publicadas:

> "Estamos sobrevivendo." · "Fazendo o melhor possível." · "Cada dia mais difícil de manter." · "Razoável." · "Precisando de socorro."

**Esse é o volume da voz que ele consegue ouvir.** Contido, resignado, defensivo. Não é o registro de quem quer ler "revolucione sua operação", "escale seu negócio" ou "transformação digital". É o registro de quem quer ler *isso aqui para de doer*.

A conversa que já está rolando na cabeça dele, montada das falas cruas:

> *"o cliente visualizou e não respondeu"* · *"eu tenho que mastigar as informações"* · *"estou esperando ela me responder até hoje, já faz três meses"* · *"no meu caso estou sozinho"*

**A frase que a copy tem que entrar continuando:** *"eu tô perdendo cliente e não dou conta de tudo sozinho."*
Metade 1 é a dor urgente (33%). Metade 2 é o que a Talos resolve (3,9h/dia). **A copy entra pela primeira e sai pela segunda. Nunca ao contrário.**

### 0.4 Escalação do time

| Copywriter | Onde ele assina | Por quê |
|---|---|---|
| **@eugene-schwartz** | Tier 0 + H1 | Problem Aware exige headline que nomeia o problema. Ele é quem sabe disso |
| **@gary-halbert** | §1 dobra · §3 problema · §4 casos | Cenas viscerais na língua exata do sujeito. E é o único que nunca ofende o leitor — regra crítica aqui por causa da planilha |
| **@gary-bencivenga** | §5 demo · linha de honestidade · §10 | *"Believability is the new persuasion."* Projeto com zero prova social é literalmente o problema que ele passou a carreira resolvendo: quando não há prova do passado, você usa **evidência verificável agora** |
| **@dan-kennedy** | Arco de preço inteiro | A declaração do founder (*"se eu só falar o preço ela não fecha; se eu construir ganho, vira investimento"*) é a tese de Kennedy palavra por palavra. Ele desenha a sequência |
| **@todd-brown** | §9 comparação · §10 compromissos | Mecanismo único num mercado exausto — e aqui o mecanismo é a forma de contrato (§0.2) |
| **@claude-hopkins** | Auditoria de entrada e de saída (§7 deste doc) | Specifics, reason-why, e a régua de 85 |
| ~~@david-ogilvy~~ | **DESCARTADO** | Registro premium/elegante. O público rejeita "tecniquês" com 122 curtidas e responde "estamos sobrevivendo". Elegância aqui lê como *não é pra mim* |
| ~~@jon-benson · @jeff-walker · @ry-schwartz~~ | **N/A** | Não há VSL, não há lançamento, não há cohort |

---

## 1. DIAGNÓSTICO — o que cai da copy atual, e por quê

### 1.1 As três frases que carregam a página têm frequência zero

| Onde | Frase atual | Frequência medida | Veredito |
|---|---|---|---|
| **H1** | "O **trabalho repetitivo** da sua empresa não precisa de gente." | `trabalho repetitivo` **0** em 5.100 · `repetitiv*` 1 no universo operador | 🔴 **CAI** |
| **CTA primária** | "**mapear** meu processo" | `mapear` **0** no universo operador · 1 no corpus inteiro | 🔴 **CAI** |
| **Selo do demo e do hero** | "3 de 3 etapas **automatizáveis**" | `automatizável` **0** · `etapa` 7 | 🔴 **CAI** |
| **Eyebrow** | "**automação** de processos · construção de sites" | `automação` **3** contra `tempo` 67 — 22× menos | 🔴 **CAI** |
| **Rodapé** | "máquinas que fazem o **trabalho repetitivo** da sua empresa" | idem H1 | 🔴 **CAI** |

Não é questão de gosto. É que a manchete, o botão principal e o rótulo da prova são **as três únicas coisas que o visitante lê em 10 segundos**, e as três estão escritas num vocabulário que este público não produz.

### 1.2 `Problema.tsx` card #2 está refutado — e o motivo importa mais que o corte

Card atual: *"A mesma informação, três vezes — alguém lê no e-mail, digita no sistema e repete na planilha."*

| termo | ocorrências em 5.100 comentários |
|---|---|
| `redigit*` | **0** |
| `"duas vezes"` | 1 |
| `"três vezes"` | 2 |
| `digitar` | 1 |

O processo existe — é o que os 47% que compraram software integrativo estão tentando resolver. **Mas ele não o nomeia e não o sente como dor.** É dor tolerada, e a §4.2 da pesquisa é categórica: dor tolerada não abre nem sustenta seção.

> ⚠️ **A distinção que salva metade do card.** O que está refutado é a repetição de **digitação** (0 ocorrências). A repetição de **atendimento** está confirmada e é urgente: 3,9 h/dia de jornada, e a voz crua produz exatamente esse enquadramento — *"eu tenho que mastigar as informações"* (28 curtidas), *"eu pergunto o preço, disponibilidade e prazo e respondem só a primeira pergunta"*.
> Mesma forma retórica, dor completamente diferente. **A repetição continua sendo um card. Só muda quem repete: não é o funcionário digitando, é você respondendo.** Detalhe em §5.

### 1.3 🔴 A planilha é orgulho. A copy atual zomba dela.

441 comentários mencionam planilha/Excel. Uma parte grande deles é gente **comemorando ter conseguido montar a sua**:

> *"Foi cansativo, mas consegui fazer a minha planilha."* · *"consegui fazer minha planilha com sucesso"* · *"minha planilha esta perfeita"*

O `HeroPreview` diz **"alguém copia pra planilha"** com um selo bronze de `automatizável` ao lado. Lido do lugar dele: *a coisa que eu construí e da qual eu tenho orgulho é a etapa que esse cara quer apagar.*

Isso não é um problema de tom. É um tiro no pé de posicionamento, e não estava mapeado em lugar nenhum do projeto até a pesquisa deste mês.

**Regra derivada, inegociável na V2:** a planilha nunca é o defeito. **A planilha está certa. O que está errado é ela depender de você lembrar de abrir.** A frase da pesquisa (§9 item 5) — *"a planilha continua sendo sua — ela só para de ser digitada por você"* — é a formulação correta e vai para dentro da copy.

`consegui` aparece **52 vezes** contra `conseguiu` 11 — é o verbo do orgulho dele. Copy que ataca a planilha ataca a única vitória de gestão que esse sujeito teve.

### 1.4 O sujeito da copy está na pessoa errada

`HeroPreview`, `Problema`, `CasosDeUso`, `Demo` e o `EXEMPLO` do motor usam **"alguém"** como sujeito. Ele fala em **1ª pessoa do singular**, com folga: 762 ocorrências contra 520 em 3ª pessoa — e excluindo os pares impessoais (`tem`/`faz`), **607 contra 250**.

Possessivo que ele usa: `minha empresa` 16 · `meu negócio` 9 · `minha loja` 9. `nossa empresa` **2**.
Quando fala em grupo: `a gente` 21 · `temos` 19 · `fazemos` **5**.

**Regra derivada:**

| Quem fala | Pessoa correta | Onde se aplica |
|---|---|---|
| **Eu (Talos) → ele** | 2ª pessoa: *você, o seu cliente* | H1, subhead, leads de seção, corpo |
| **Ele → o mundo** (descrição de processo, botão, campo) | **1ª pessoa singular: eu, meu, minha** | texto dos botões, exemplos do demo, `EXEMPLO` do motor, placeholders |
| **Nunca** | *alguém* · *nós* · *nossa empresa* | banido |

O botão é fala dele. Por isso `quero isso rodando na minha empresa` é medido e `nossa solução` é indefensável.

### 1.5 "sozinho" tem sentido invertido no subhead

O subhead atual: *"Eu construo as máquinas que fazem esse trabalho **sozinhas**."*

No corpus dele, `sozinho` é palavra de **abandono**, não de autonomia:

> *"No meu caso estou sozinho, vou fazer divulgação, embalar produtos e enviar sozinho!"*

Colisão semântica real: a promessa "a máquina faz sozinha" pode ser lida como "e você continua sozinho". `[JULGAMENTO]` — não há teste que prove isso, mas o custo de trocar o verbo é zero e o custo de errar é a linha mais importante depois do H1.

### 1.6 O que **sobrevive** da copy atual (e é bom)

Copy Chief não corta por esporte. Isto aqui está certo e fica:

| Onde | Frase | Por quê fica |
|---|---|---|
| `Prova.tsx` | **"Sem case ainda. E eu não vou inventar um."** | É a melhor linha do projeto inteiro. Está enterrada na 10ª seção. **Sobe para a dobra** (§4 abaixo) |
| `Demo.tsx` | "Não vou te contar. Olha acontecendo." | Bencivenga puro. Fica |
| `Demo.tsx` | "Não dá para estimar horas com o que você escreveu ainda — e eu prefiro não te dar um número inventado." | Integridade operante, não declarada. Fica |
| `Demo.tsx` | A premissa da conta escrita embaixo do número | Hopkins: reason-why em cada claim. Fica intocável |
| `FAQ.tsx` | "Quanto custa? Depende do tamanho, e eu prefiro dizer isso a colocar um número na página que não vale para o seu caso." | Resposta correta ao gate de preço. Fica |
| `Contato.tsx` | O aviso de "número não configurado" em vez de fingir que enviou | Fica |
| `CasosDeUso.tsx` | Aba **Comércio** inteira | A pesquisa aponta como o melhor conjunto do site: `estoque` 38, `orçamento` 34, e a linha do orçamento no WhatsApp fora do horário é a de maior lastro da página |
| `ComoFunciona.tsx` | Os 3 passos e os 9 itens | `escopo fechado`, `prazo definido`, `você vê antes de aprovar` — é o mecanismo único (§0.2). Só o rótulo muda |

---

## 2. NOVO H1 + SUBHEAD — 3 opções

### Restrições que as 3 respeitam

- ≤ 3 linhas a 112px / 16ch (regra medida em `RETOMAR-AQUI.md` — a 132px a headline comia a dobra)
- orçamento de leitura: H1 2,5s + subhead 2,5s (`ARQUITETURA-SECOES` §6.1)
- o subhead **nunca** pode sair: é a ponte site↔automação, e sem ela a oferta fica incoerente (§6.3-4)
- zero jargão 🔴/🟠 do veredito de vocabulário
- abre por dor **urgente**, nunca por dor tolerada

---

### ▸ OPÇÃO 1 — "quem responde" · **RECOMENDADA**

> # Quem responde o seu cliente quando você não pode?
>
> No WhatsApp, quem responde primeiro leva. Eu construo a máquina que responde por você — e o lugar dela é o seu site.

**Palavras ancoradas:**
- `cliente` — **[MEDIDO: 84]**, a palavra mais produzida do corpus depois de `tempo`
- `responde` — é o 1º verbo da faixa (§2) e é verificável no demo (§5). Nenhum verbo do site é mais falseável que esse
- `WhatsApp` — **[MEDIDO: 82% do canal de venda de pequenos negócios, Sebrae Pulso 12ª ed., mar/2026, n=8.273]**, contra loja virtual própria 10%
- zero palavra do veredito 🔴/🟠

**Por que funciona (@eugene-schwartz + @gary-halbert):**
É a única formulação em que **a dor que ele nomeia (falta de cliente, 33%) e a dor que a Talos resolve (3,9 h/dia de atendimento) são literalmente a mesma frase**. A pesquisa chama isso de "a ponte" e ela é a recomendação nº 1 do documento (§9.1).

A pergunta não é retórica de agência. A resposta honesta dele é *"ninguém"* ou *"eu, quando dá"* — e as duas doem sem que eu precise acusá-lo de nada. Halbert: nunca diga ao leitor que ele está errado; faça ele dizer sozinho.

**Riscos declarados:**
1. `[JULGAMENTO]` "quem responde primeiro leva" é folclore de vendas, não dado. Se você quiser 100% de lastro, a variante abaixo troca a frase por número com fonte:
   > *82% dos pequenos negócios vendem pelo WhatsApp (Sebrae, mar/2026). Eu construo a máquina que responde por você — e o lugar dela é o seu site.*
   Custa 1 segundo a mais de leitura e ganha um claim verificável. **Recomendo a versão com o dado** se o tráfego for frio; a sem dado se o visitante já falou com você.
2. Headline em pergunta pode ser respondida *"minha secretária"* e ele sai. Mitigação: o card #2 da §3 (a mesma pergunta pela vigésima vez) pega exatamente esse caso — quem tem secretária tem o problema do mesmo jeito.
3. ⚠️ **Os 82% são do agregado de pequenos negócios, com peso de comércio.** Se o setor-âncora virar indústria, este H1 perde força — metalúrgica B2B não fecha orçamento às 22h no zap. Ver §8, item 3.

---

### ▸ OPÇÃO 2 — "nem sempre é o preço" · reenquadramento de causa

> # Nem sempre é o preço. Muitas vezes é a demora.
>
> Falta de cliente é a dificuldade nº 1 de 33% dos pequenos negócios (Sebrae, mar/2026). Eu construo a máquina que responde antes de o cliente desistir — e ela mora no seu site.

**Palavras ancoradas:**
- `preço` / `orçamento` **[MEDIDO: 34]**
- `cliente` **[MEDIDO: 84]**
- 33% **[MEDIDO: Sebrae Pulso 12ª ed., n=8.273, erro 1,1%]**

**Por que funciona (@eugene-schwartz):**
É o movimento clássico para Problem Aware: **redefinir a causa de um problema que ele já sente para uma causa que o seu produto resolve.** Ele atribui a falta de cliente a preço e a mercado. A copy reatribui a tempo de resposta. Só 8 palavras — o H1 mais barato dos três na janela de 10s.

**Riscos declarados:**
1. É uma afirmação sobre o negócio *dele*, que eu não posso provar. `"Nem sempre"` e `"muitas vezes"` já suavizam, mas Bencivenga cortaria qualquer claim mais forte que isso. **Não escreva "não é o preço, é a demora" — vira arrogância e ele fecha a aba.**
2. Toca em preço na dobra. Isso contraria a arquitetura de Kennedy (§6 deste doc: nenhuma menção a valor antes da §5). Aqui é o *preço dele*, não o meu — mas é uma nuance fina que o leitor de celular pode não fazer. **É a opção mais arriscada das três.**

---

### ▸ OPÇÃO 3 — "o sistema é você" · a solidão do dono

> # A sua empresa funciona porque você está nela o tempo inteiro.
>
> O preço está na sua cabeça, o controle está na sua planilha, e o cliente espera você acordar. Eu construo a máquina que segura isso quando você não está — e o começo dela é o seu site.

**Palavras ancoradas:**
- `tempo` **[MEDIDO: 67]** — a palavra mais produzida do corpus inteiro
- `cliente` **[MEDIDO: 84]** · `controle` **[MEDIDO: 22]** · `planilha` **[MEDIDO: 441 comentários]**
- `minha empresa` **[MEDIDO: 16]** — o possessivo dominante, aqui na 2ª pessoa

**Por que funciona (@gary-halbert):**
É a opção que **valida a planilha em vez de atacá-la** — ela aparece como prova de que ele deu conta, não como atraso. Resolve o risco da §1.3 dentro do próprio H1.

E é a que melhor casa com o registro medido do público: "estamos sobrevivendo", "fazendo o melhor possível". É um elogio que vira diagnóstico — abre reconhecendo o esforço dele e fecha nomeando o preço desse esforço. Também é a única das três que tem lastro em **indústria**: FDC (n=491) registra *"dependência maior em relação às pessoas do que a processos"* e 85% das médias industriais com dificuldade de mão de obra qualificada.

**Riscos declarados:**
1. Não nomeia a dor nº 1 (cliente) na headline — ela só chega na 2ª frase do subhead. Custa reconhecimento na janela de 10s.
2. 11 palavras contra 8 da Opção 1. É o H1 mais caro de ler dos três.

---

### Recomendação de uso

| Cenário | H1 |
|---|---|
| Setor-âncora = **comércio / serviços** (recomendado pela pesquisa) | **Opção 1** |
| Setor-âncora = **indústria** | **Opção 3** |
| Quando houver tráfego para A/B | **1 vs 3.** A Opção 2 entra na terceira rodada, nunca na primeira |

**Todas as três mantêm o subhead fazendo a ponte para o site.** Isso é obrigatório: o modelo de negócio (D5: *site é a porta, automação é o negócio*) morre se a dobra não amarrar os dois. E a pesquisa registra o contra-argumento certo em §1-D3: 47% das pequenas não têm site e o indicador está estagnado há 6 anos — **isso não é mercado subatendido por preço, é mercado que não comprou o argumento.** Vender "site" não funciona. Vender "o lugar onde a máquina que atende mora" funciona.

---

### A quarta linha da dobra: honestidade no lugar do selo Clutch

A arquitetura (§6.2) pede um objeto no slot onde a referência põe `★★★★★ VERIFIED ON CLUTCH`. A melhor copy do projeto para isso já existe, presa na 10ª seção. Sobe:

> **Sem case ainda. E eu não vou inventar um.**
> `roda no seu navegador · sem cadastro · resultado em milissegundos`

- Declarativa, nunca apologética. Sem *"ainda estou começando"*, sem *"infelizmente"*, sem *"por enquanto"*.
- Aponta imediatamente para o substituto — a segunda linha é o que ele pode verificar rolando 3 seções.
- ⚠️ **"em 2 ms" não pode ser escrito na dobra**: a `SINTESE` P0-9 registra que o valor real do painel é 0,15 ms. Número congelado ao lado de contador ao vivo é um erro de credibilidade que a página inteira paga. Use `em milissegundos`, sem número, ou leia o valor do motor.
- ⚠️ Se o tráfego virar **frio** (anúncio, busca), essa linha sai. Bencivenga: nunca levante uma objeção que o prospect ainda não tem. Ela só faz sentido para o visitante do D2, que chegou justamente para checar credencial.

---

## 3. CTA PRINCIPAL E SECUNDÁRIA

### Por que a atual cai

`mapear meu processo` — **[MEDIDO: `mapear` 0 no universo operador, 1 no corpus inteiro de 5.100]**. É verbo de consultor. E além da frequência, ele **esconde o custo**: o botão não avisa que do outro lado vai ter um campo de texto para preencher. Botão que esconde esforço produz abandono no textarea, que é o pior lugar possível para perder um lead de alta intenção.

### As novas

| Posição | Copy | Âncora |
|---|---|---|
| **Primária (hero)** | **`ver quanto tempo isso me custa`** | `tempo` **[MEDIDO: 67]** — a palavra nº 1 do corpus. `custa` liga à dor nº 2 (custos, 31%). 1ª pessoa: o botão é a fala dele **[MEDIDO: 607 vs 250]** |
| Primária, variante mobile | `quanto tempo isso me custa` | idem, 1 palavra a menos |
| **Secundária (hero)** | **`o que está incluso`** | Responde a pergunta que ele vai fazer logo depois de "quanto custa" — e que a página decidiu não responder. Substitui `por onde começa`, que era neutro mas não tratava nenhuma objeção |
| **Persistente (nav)** | `falar comigo` | **Mantém.** Já está certo, e em ghost — o comentário do `Nav.tsx` registra que no A/B a CTA do nav competia com a do hero |
| **Nav — adicionar** | `quem faz` | É a pergunta nº 1 do visitante do D2 e hoje só é respondida no 10º bloco |

### As outras CTAs da página

| Onde | Atual | Nova | Por quê |
|---|---|---|---|
| §4, por linha de processo | *(não existe)* | **`esse é o meu`** | Pré-preenche o textarea da §5 e rola até lá. 16 rampas de entrada para a única prova do site. `[JULGAMENTO]` de registro: "esse é o meu" é como ele responderia em voz alta |
| §5, botão do demo | `mapear` | **`ver o meu`** | Sem `mapear`. Curto, 1ª pessoa |
| §5, botão de exemplo | `usar um exemplo` | **`usar um exemplo pronto`** | `pronto` avisa que não precisa digitar. Reduz o custo percebido |
| §5, CTA do resultado | `quero a versão grande` | **`quero isso rodando na minha empresa`** | `minha empresa` **[MEDIDO: 16]**, o possessivo dominante. "versão grande" é jargão de produto |
| §8 | `quero começar por aqui` | **Mantém** | `começar` é neutro e claro |
| §9 (nova) | — | **`mandar isso pro meu sócio`** | Único CTA da página que serve ao segundo decisor (regra B2B da NN/g) |
| §11 FAQ | — | **`minha dúvida não tá aqui`** | Registro falado, 1ª pessoa |
| §12 form | `enviar` | **`mandar pro seu WhatsApp`** | O botão hoje abre o WhatsApp. Dizer isso antes é honestidade e elimina a surpresa que faz gente abandonar |

---

## 4. COPY SEÇÃO A SEÇÃO — as 12 seções

> Ordem conforme `ARQUITETURA-SECOES.md` §2.1. Onde a copy atual está certa, está escrito **mantém** — não reescrevo por reescrever.

---

### §0 — NAV

```
[marca]    o problema · como funciona · quem faz · por onde começa    [ falar comigo ]
```
Mudança: **adicionar `quem faz`**, remover nada. 4 links + CTA ghost.

---

### §1 — HERO

**Eyebrow:** 🔴 o atual (`automação de processos · construção de sites`) cai — abre com a palavra que ele produz 3× em 3.320 comentários.

Substituto:
```
sites e máquinas que atendem quem chega
```
`[MEDIDO: cliente 84]` no conceito, `[JULGAMENTO]` na forma. **Alternativa: cortar o eyebrow.** A `ARQUITETURA-SECOES` §6.3-4 já define que o eyebrow é o primeiro objeto a sair quando a dobra estoura. Se ele custa 0,5s para dizer menos que o H1, corte-o — não é obrigatório.

**H1 + subhead:** ver §2 deste documento (Opção 1 recomendada).

**CTAs:** `ver quanto tempo isso me custa` · `o que está incluso`

**Linha de honestidade:** ver §2, quarto bloco.

**HeroPreview — reescrito na pessoa certa e sem ofender a planilha:**

| Atual | 🔴 Problema | Novo |
|---|---|---|
| `pedido chega no e-mail` | sujeito ausente, canal errado (e-mail vs 82% WhatsApp) | **`o cliente me chama no WhatsApp`** |
| `alguém copia pra planilha` | "alguém" impessoal + zomba da planilha (441 comentários de orgulho) | **`eu paro o que tô fazendo pra responder`** |
| `alguém avisa o financeiro` | "alguém" impessoal | **`eu passo pro financeiro`** |

Cabeçalho do card: `exemplo · um processo de verdade` (era `exemplo · processo mapeado`)
Selo: `automatizável` 🔴 **[MEDIDO: 0]** → **`dá pra tirar da sua mão`** — `manual` **[MEDIDO: 6]**, "na mão" é forma nativa, e o selo já usado no `CasosDeUso.tsx` é `dá pra tirar da mão`. Unificar os dois.
Contador: `3 de 3 etapas automatizáveis` → **`3 de 3 passos saem da sua mão`** (`etapa` **[MEDIDO: 7]** é fraco; `passo` é palavra comum)
Rodapé do card: `Logo abaixo você descreve o processo da sua empresa e recebe esse mapa na hora.` → **`Mais abaixo você escreve o seu, do seu jeito, e recebe isso na hora.`** — *"do seu jeito"* é a promessa que o motor tem que cumprir (ver §8, bloqueio 1).

> 🔴 **Note o que mudou de fundo no preview:** o processo deixou de ser sobre **uma informação sendo digitada duas vezes** (refutado, 0 ocorrências) e passou a ser sobre **você largando o que estava fazendo para atender**. Mesmo objeto visual, dor medida no lugar de dor imaginada.

---

### §2 — FAIXA DE VERBOS

A arquitetura (M1) exige um rótulo acima, senão a faixa lê como "o lugar onde os logos deveriam estar".

**Rótulo:** `o que a máquina faz`

**Verbos — 2 trocas:**

| Atual | Ação |
|---|---|
| responde · registra · confere · calcula · avisa · **arquiva** · **integra** · cobra · agenda · emite | |
| `integra` | 🔴 **SAI** — `integração` **[MEDIDO: 4]**, veredito 🟠 alto risco. É a palavra que faz o dono de metalúrgica pensar "isso é coisa de TI" |
| `arquiva` | 🟠 **TROCA** por **`organiza`** — `organizar` **[MEDIDO: 9]** |
| ➕ | **`lembra`** — `lembro` **[MEDIDO: 2]** e é o verbo da falha que ele conta ("follow-up que depende de alguém lembrar") |

**Faixa final:** `responde · registra · confere · calcula · avisa · lembra · organiza · cobra · agenda · emite`

Todos os dez são verificáveis na §5. Nenhum é prova social. É o único conteúdo honesto possível para esse slot.

---

### §3 — O PROBLEMA

Reescrita completa em **§5 deste documento** (é um dos entregáveis pedidos).

---

### §4 — CASOS DE USO POR RAMO

**Label:** `casos de uso` — **mantém**

**Título:** `Escolhe o seu ramo. Vê se reconhece.` — **mantém.** Imperativo curto, 2ª pessoa, registro falado. Está certo.

**Lead — 1 correção:**
> Nenhum destes é case de cliente — são processos que existem em quase toda empresa desse porte. Se você leu algum e pensou *"é exatamente isso aqui"*, ~~é por aí que a gente começa~~ → **é por aí que começa.**

`a gente` está **[MEDIDO: 21]** e é a forma correta de 1ª pessoa plural — mas aqui quem fala sou eu com ele, e "a gente" mistura os dois sujeitos. `[JULGAMENTO]`

**Rodapé da seção — correção obrigatória da arquitetura (M2):**
> ~~O mapa da seção **anterior**~~ → **O mapa aqui embaixo** lê qualquer processo em texto livre.

⚠️ **Essa frase é promessa falsa hoje** — `SINTESE` §1 mediu 16/16 processos desta seção colapsando em 1 etapa no motor. **Não publique essa linha antes do P0.** Enquanto isso: *"Não achou o seu? Escreve ele aqui embaixo com as suas palavras."*

**Correções de língua por aba:**

| Aba | Linha atual | Correção | Motivo |
|---|---|---|---|
| Indústria | "Pedido chega por e-mail ou WhatsApp e alguém **redigita no ERP**" | **"O pedido chega por WhatsApp e eu passo pro sistema na mão"** | `redigita` **[MEDIDO: 0]** · `ERP` **[MEDIDO: 2 espontâneas]** contra `sistema` **[MEDIDO: 54]**. E ERP aparece 105× no corpus, mas **93 delas (89%) sob vídeos cujo título já dizia ERP** — é palavra que ele devolve, não que produz |
| Indústria | "Ordem de produção montada à mão a partir da carteira" | **mantém** — mas ver alerta abaixo | `monta` quebra o motor (`SINTESE` §1: classifica como "mundo físico") |
| Indústria | *(falta)* | ➕ **"A pessoa que sabe fazer isso é uma só — e quando ela falta, para"** | **[MEDIDO: 85% das médias industriais têm dificuldade para encontrar mão de obra qualificada — FDC, n=491]** e barreira externa nº 1 da CNI (37%). É a dor declarada nº 1 do setor e não estava no site |
| Comércio | todas as 4 | **MANTÉM INTEGRALMENTE** | A pesquisa aponta como o melhor conjunto do site. `estoque` **[MEDIDO: 38]**, `orçamento` **[MEDIDO: 34]**, e a linha do orçamento fora do horário é a de maior lastro da página inteira |
| Serviços | todas as 4 | mantém | `[JULGAMENTO]` — a pesquisa registra em L6 que **não há voz crua de clínica/escritório**. É hipótese, e está declarada como tal |
| Projeto e obra | todas as 4 | mantém, com ressalva | L7: o corpus de obra capturado é de **engenheiro**, não de dono de construtora. Hipótese |

**Etiquetas de categoria** (absorvendo a §Escada cortada, conforme `ARQUITETURA-SECOES` §2.3): cada processo ganha `atendimento` · `processo interno` · `sistema sob medida`.
⚠️ `processo interno` usa `processo` **[MEDIDO: 27]**, que é neutro e ele usa. `sistema sob medida` usa `sistema` **[MEDIDO: 54]**. As três etiquetas passam no veredito de vocabulário.

**Selo por linha:** `dá pra tirar da mão` → **`dá pra tirar da sua mão`** (unifica com o hero, e o possessivo é dele)

**CTA nova por linha:** `esse é o meu`

---

### §5 — O MAPA AO VIVO (o demo)

**Label:** `a prova` — **mantém**
**Título:** `Não vou te contar. Olha acontecendo.` — **mantém.** É a melhor linha de transição do site.

**Lead — 1 correção:**
> Descreve aí, com as suas palavras, um processo que se repete na sua empresa. O que aparece em seguida é o mesmo diagnóstico que eu faço no primeiro dia de um projeto — só que agora, e de graça.

**Mantém.** `com as suas palavras` é a promessa certa e é exatamente o que o público premia — a evidência de §7.3 da pesquisa é que o que ganha 122 curtidas é *"citou exemplos de sistema e como usar"* e *"sem tecniquês"*.
⚠️ Mas é promessa falsa até o P0 do motor. Bloqueio registrado em §8.

**Rótulos dos campos:**

| Atual | Novo | Motivo |
|---|---|---|
| `você escreve` | **mantém** | |
| placeholder: `Ex.: chega um pedido no WhatsApp, alguém copia pra planilha, depois avisa o financeiro...` | **`Ex.: o cliente me chama no zap pedindo orçamento, eu confiro o preço na tabela e mando pro vendedor...`** | 🔴 **CRÍTICO.** O placeholder **ensina o visitante a escrever no formato que o motor entende**. O atual está em 3ª pessoa com "alguém" — ensina errado E zomba da planilha. `zap` é a forma falada; `orçamento` **[MEDIDO: 34]** |
| `acontece [n] vezes por semana` | **`isso acontece [n] vezes por semana`** | ⚠️ `SINTESE` P0-6: `min={1}` semanal torna processo mensal inexprimível e infla 4,33×. **É o único ponto da interface que obriga o visitante a inventar número** — viola a regra fundadora. Precisa de opção `por mês` |
| `a máquina por dentro` | **mantém** | É o "trabalhador trabalhando" da NN/g. Melhor rótulo do site |
| `etapas que saem da mão de alguém` | **`passos que saem da sua mão`** | "alguém" banido; `etapa` **[MEDIDO: 7]** é fraco |
| `por mês, de volta pra equipe` | **`por mês, de volta pra você`** | O público-alvo é o dono, que trabalha 9,3 h/dia e 78% dos sábados. "equipe" pressupõe EPP; "você" serve ME e EPP |
| selo `não li` | **mantém** | Honestidade operante. Bencivenga aprovaria e Hopkins também |

**A premissa da conta:** **mantém integralmente.** É o único parágrafo do site que faz reason-why à altura de Hopkins.

**➕ A LINHA QUE FALTA — e é a mais importante do arco de preço:**

O demo devolve **horas**. Ele pensa em **dinheiro** — `dinheiro` **[MEDIDO: 45]**, a 4ª palavra mais produzida, e o site inteiro hoje não fala dela. Sem a ponte, o ganho não fica construído e o preço, quando aparecer na conversa, vai bater em vazio.

Não posso pôr calculadora de reais: exigiria custo/hora, que ele teria que inventar, e a regra fundadora do projeto proíbe interface que obriga o visitante a inventar número. **A ponte tem que ser uma frase que ele completa sozinho.** Kennedy: deixe o prospect fazer a aritmética do ganho — o número dele é sempre maior que o seu e é impossível de contestar.

Linha nova, logo abaixo do total de horas:

> **Quanto vale essa hora na sua empresa, você sabe melhor do que eu.**

Zero número. Zero claim. E é o mecanismo inteiro do arco de preço numa linha.

**CTA do resultado:** `quero isso rodando na minha empresa`
**Assinatura de 1 linha** (fiador da §7, conforme M3): `quem escreveu essa máquina · [nome] →` ligando para `#quem`.

---

### §6 — COMO FUNCIONA

**Label:** `como funciona` — mantém
**Título:** `Três passos. Sem mistério.` — mantém
**Lead:** mantém integralmente. `"o que você não vai ter é aquele projeto que nunca termina"` ataca a objeção medida (TOTVS: *"ATRASO E SUMIÇO NA IMPLEMENTAÇÃO"*).

**Passos — 2 correções de sujeito:**

| Atual | Novo | Motivo |
|---|---|---|
| `01 — A gente olha a sua operação` | **`01 — Eu olho a sua operação`** | `a gente` **[MEDIDO: 21]** é a forma dele, mas aqui quem fala sou eu — e eu sou uma pessoa. "A gente" sugere equipe que não existe. Honestidade estrutural |
| `o que dá pra tirar da mão de alguém` | **`o que dá pra tirar da sua mão`** | "alguém" banido |
| `02 — Eu construo a máquina` | mantém | |
| `03 — Roda sozinho e eu cuido` | **`03 — Roda sem você e eu cuido`** | §1.5: `sozinho` **[MEDIDO como palavra de abandono: 7]** no corpus dele. `sem você` é o benefício, não o abandono |
| `você recebe o que ela fez, não o que ela é` | **mantém** | Linha excelente. Antijargão puro |

---

### §7 — QUEM FAZ

🔴 **Bloqueado por `lib/perfil.ts` (`PREENCHER: nome`).** Nenhuma decisão de copy destrava isso.

**Regra de escrita para quando o founder preencher:**

- ❌ Nada de *"apaixonado por tecnologia"*, *"há X anos no mercado"*, *"especialista em"*. Superlativo sem prova é o que Hopkins chamava de brag.
- ✅ Bio de **procedência de construtor**: o que ele construiu, no presente, sem número de resultado.
- ✅ Links externos verificáveis (4º fator de credibilidade da NN/g) com `target="_blank"`.

**Esqueleto:**
> **[nome]**
> Eu construo software. Já construí [sistema A: o que ele faz, no presente] e [sistema B: idem]. Aqui eu faço a mesma coisa para empresa que não tem time de TI — e o primeiro pedaço, quase sempre, é o site.

**➕ Bloco `o que eu já construí`** (`ARQUITETURA-SECOES` §5.4) — resolve a tensão T1 do CONTEXT.
Regra de copy: **descrever o que o sistema faz, no presente. Zero número de resultado. Zero nome de cliente sem autorização escrita. Zero palavra que sugira encomenda paga onde não houve.**

Formulação segura para os ativos reais listados no `CONTEXT.md` §5:
> *"Um sistema que lê edital de licitação e diz se a empresa pode participar."*
> *"Um livro-caixa que puxa extrato de banco e fecha o mês."*
> — sem nome de cliente, sem "economizou X%", sem "para o cliente Y".

🔴 **Gate do founder** — as 3 perguntas já estão em `ARQUITETURA-SECOES` §5.4. Sem resposta, o bloco não existe.

---

### §8 — POR ONDE COMEÇA

**Label:** `por onde começa` — mantém
**Título:** `Começa pelo seu site.` — mantém

**Lead — reescrito:**
> Atual: *"Porque é onde o cliente entra — e o primeiro **trabalho repetitivo** de qualquer empresa é atender quem chega."*
> 🔴 `trabalho repetitivo` **[MEDIDO: 0]**
>
> **Novo:** *"Porque é onde o cliente entra — e a primeira coisa que consome o seu dia é atender quem chega. Resolvido isso, o resto da operação fica visível."*

`tempo`/`dia` **[MEDIDO: tempo 67]** · `cliente` **[MEDIDO: 84]** · e "atender quem chega" tem lastro forte: 3,9 h de uma jornada de 9,3 h.

**`o que está incluso` — 5 itens:**

| Atual | Ação |
|---|---|
| site completo, escrito e montado do zero | mantém |
| funciona no celular — que é onde o seu cliente está | mantém. Correto e ancorado |
| **SEO técnico: o Google consegue ler e indexar** | 🟠 **REESCREVE** — `SEO` e `indexar` são jargão. → **"o Google acha ele"** |
| formulário que chega em você de verdade, não some | mantém. Ataca a objeção medida do "sumiram" |
| manutenção mensal — o site não envelhece sozinho | mantém |
| ➕ | **"ligado no seu WhatsApp, que é onde a venda acontece"** — **[MEDIDO: 82% Sebrae · 80-81% CGI.br para empresas 10+]**. É o item que tira o produto da categoria commodity e prova a tese do D5 |

**`o que vem depois` — 4 itens, 2 correções:**

| Atual | Novo |
|---|---|
| agente que atende e qualifica quem chega | **`alguém que responde primeiro, 24 h por dia, e te passa só o que precisa de você`** — `agente` e `qualifica` são jargão |
| **integração** com WhatsApp e com o seu **CRM** | **`fazer os seus sistemas conversarem entre si`** — `integração` **[MEDIDO: 4]** · `CRM` **[MEDIDO: 2]** · `sistema` **[MEDIDO: 54]** |
| **automação** dos processos internos | **`o caminho do pedido, do começo ao fim, sem passar pela sua mão`** — `automação` **[MEDIDO: 3]** · `pedido` **[MEDIDO: 12]** |
| sistema sob medida, quando nada de prateleira serve | **mantém.** `sistema` **[MEDIDO: 54]** e a metáfora de prateleira é nativa |

> ⚠️ **A ordem desses 4 itens importa.** O Sebrae mede o que ele **declara** querer automatizar: chatbot no WhatsApp **41%** e chatbot de vendas **30%** entre quem usa IA; e entre empresas 10+, "automatização de fluxos de trabalho" é a aplicação nº 1 com **68%**. **O degrau que ele não pede é "sistema sob medida".** Os dois primeiros itens são mercado validado; o quarto é upside. Ordem atual está certa — não inverta.

**Rodapé:** *"Nada disso é obrigatório e nada disso entra sem você pedir."* — **mantém.** Ataca o Padrão 3 (preço que muda depois) antes de ele nascer.

**CTA:** `quero começar por aqui` — mantém
🔴 **Nenhum valor nesta seção.**

---

### §9 — COMO SE COMPARA 🆕

**Label:** `como se compara`
**Título:** `As suas quatro opções, escritas do jeito que elas são.`
**Lead:**
> Você não está escolhendo entre mim e ninguém. Está escolhendo entre quatro caminhos, e três deles são legítimos. Aqui está a diferença sem enfeite — inclusive onde eu perco.

`[JULGAMENTO]` na forma. A função é a da NN/g: dar ao seu contato o material para justificar a contratação internamente.

**Colunas:** `agência` · `freelancer` · `eu mesmo no Wix` · `deixar como está` · **`comigo`**

> A quarta coluna é a que quase todo site esquece e é a mais importante: **o concorrente real é a inércia.** E "eu mesmo no Wix" é a coluna que mais respeita o público — 47% das pequenas não têm site e o indicador está estagnado há 6 anos.

**6 linhas — e duas delas eu perco, de propósito:**

| pergunta | agência | freelancer | eu mesmo | deixar como está | comigo |
|---|---|---|---|---|---|
| quem conversou com você é quem constrói? | ✕ | ✓ | ✓ | — | ✓ |
| você sabe o que vai receber e quando, por escrito, antes de pagar? | ~ | ✕ | — | — | ✓ |
| já nasce ligado ao seu WhatsApp? | ~ | ✕ | ✕ | ✕ | ✓ |
| manutenção está no combinado ou é venda depois? | venda depois | venda depois | é com você | — | no combinado |
| dá pra ver funcionando antes de aprovar? | ✕ | ~ | ✓ | — | ✓ |
| **sai mais barato na entrada?** | ✕ | ✓ | **✓✓** | **✓✓** | **✕** |
| **tem equipe pra tocar várias frentes ao mesmo tempo?** | **✓✓** | ✕ | — | — | **✕** |

⚠️ São 7 linhas, não 5. **As duas últimas são as concessões honestas e não são negociáveis:** coluna própria toda verde lê como propaganda, e a pesquisa registra que quebra de confiança tem efeito assimétrico — **19% abandonam permanentemente**. Duas células perdidas compram a leitura das outras cinco.

Cada célula da coluna "comigo" é **fato já publicado na §6 e na §8** — nenhuma promessa nova. Zero número, zero superlativo, zero nome de concorrente.

**CTA:** `mandar isso pro meu sócio`
⚠️ Só faz sentido se o alvo for **EPP**. Se for ME, o leitor **é** o decisor e essa CTA é peso morto. Ver §8, item 2.

---

### §10 — COMPROMISSOS

**Label:** `o que fica combinado`
**Título:** `Três coisas que entram por escrito antes de você pagar qualquer coisa.`

**3 células — e uma troca em relação ao `Prova.tsx` atual:**

| # | Copy | Por quê |
|---|---|---|
| 1 | **Escopo e prazo fechados.** Você sabe o que vai receber e quando, por escrito, antes de qualquer coisa começar. Sem "projeto em andamento" por seis meses. | mantém. Ataca o Padrão 4 (*"ATRASO E SUMIÇO NA IMPLEMENTAÇÃO"* — TOTVS) |
| 2 | 🆕 **O preço não muda no meio.** O que a gente combinar no começo é o que você paga no fim. Se o escopo mudar, quem decide é você, antes. | 🆕 **entra no lugar de "você vê antes de aprovar".** Ataca o Padrão 3, que é a objeção mais específica do corpus inteiro: *"Conta azul tá de sacanagem! Era 100,0 agora meu plano vai para 500,00... Aonde um pequeno empresário tem condições de pagar 500 por mês?"* |
| 3 | **Manutenção mensal já está no combinado.** Não é venda separada depois. Sistema que conversa com outro sistema quebra quando um deles muda — isso é rotina, não acidente, e está previsto. | promovido do FAQ |

**Por que "você vê antes de aprovar" sai daqui:** já está dito na §6 (passo 02) e na §9 (linha 5). Repetir gastaria uma das 3 células — e o teto de 3 é rígido (Baymard: 1–3 tipos +23%; 7+ −8%).

⚠️ **Gate do founder:** a célula 2 é obrigação comercial. **Precedente:** o `FAQ.tsx` atual já diz *"o preço não muda no meio"*. Se o founder mantiver o FAQ, ele já assumiu — promover a compromisso não cria obrigação nova, só a torna visível.

---

### §11 — FAQ

**Label:** `perguntas`
**Título:** `O que costumam me perguntar antes de fechar.` — mantém
**Lead:** `Se a sua dúvida não estiver aqui, é só mandar — respondo eu.` — mantém

**7 perguntas — 3 correções e 1 adição:**

| # | Ação |
|---|---|
| 1. Quanto tempo leva? | 🟠 corrigir: `automação de processo` → **`tirar um processo da mão`**. `diagnóstico` é 🟠 → **`o primeiro olhar sai em dias`** |
| 2. Preciso trocar os sistemas que já uso? | ✅ **mantém integralmente.** `sistema` **[MEDIDO: 54]**, `ERP` aparece 1× e no lugar certo (ele devolve o termo). *"o problema não é o sistema, é o vão entre um sistema e outro"* é a melhor frase técnica do site |
| 3. E se eu não souber o que automatizar? | 🟠 `automatizar` **[MEDIDO: 3]** → **"E se eu não souber por onde começar?"**. Resposta: trocar `linguagem técnica` por **"não precisa chegar com o problema pronto"** |
| 4. Isso vai substituir a minha equipe? | 🟠 *"digitar duas vezes"* **[MEDIDO: `"duas vezes"` 1]** → **"responder a mesma pergunta pela vigésima vez, conferir se o pedido entrou, avisar o setor do lado"**. O resto **mantém** — *"automatizar decisão seria terceirizar critério"* é excelente e tem lastro: o Sebrae registra que o empreendedor quer preservar o humano para relacionamento, caso complexo e negociação |
| 5. Quanto custa? | ✅ **mantém integralmente.** É a resposta correta ao gate. E note que ela só funciona porque chega **6 seções depois** do número que ele produziu na §5 (ver §6 deste doc) |
| 6. E se parar de funcionar depois de pronto? | 🟠 promovida para compromisso §10. **Mantém no FAQ também** — quem lê FAQ não leu a faixa |
| 7. Você trabalha com empresa do meu tamanho? | ✅ **mantém.** É a única linha do site que faz `desire to belong` |
| 8 🆕 | **"E se eu já tentei com outro e não deu certo?"** — **[MEDIDO: `tentei` 12 · `tentou` 0]**, e é o Padrão 5 inteiro: *"contratei algumas agências de Marketing digital e até agora não consegui nada, mais sei que a culpa é minha, não consegui entender como funciona, acho que sou rude"*. **Essa pessoa está lendo o seu site.** Resposta: *"É comum, e quase nunca a culpa é sua. As três coisas que mais quebram são: prometeram o que o produto não fazia, o preço mudou no caminho, ou sumiram na hora de instalar. É por isso que as três coisas que eu ponho por escrito antes de começar são exatamente essas."*
Essa pergunta liga o Padrão 5 aos 3 compromissos da §10 e fecha o arco de objeção da página inteira. **É a adição de maior valor deste documento depois do H1.** |

---

### §12 — CONTATO

**Label:** `contato`
**Título:** `Me conta o que se repete na sua empresa.` — 🟠 **corrigir**

> `se repete` carrega o eixo refutado. Novo: **`Me conta o que mais come o seu dia.`**
> `tempo`/`dia` **[MEDIDO: tempo 67]**. E é literalmente o rótulo do 3º campo, que já está certo.

**Lead:** *"Não precisa saber o que quer construir. Descreve o que te consome tempo — o resto é comigo. Respondo eu, não um formulário."* — ✅ **mantém.** `tempo` **[MEDIDO: 67]** e "respondo eu, não um formulário" é o trigger de relacionamento humano do jeito certo.

**Campos:** `seu nome` · `whatsapp` · `o que mais consome tempo hoje?` — mantém os três.

**Botão:** `enviar` → **`mandar pro seu WhatsApp`**

**Card lateral 1:** *"Ou chama direto"* — mantém.

**Card lateral 2 — 🔴 REESCRITA OBRIGATÓRIA:**

> Atual: *"Se você já mapeou o seu processo lá em cima, cola o resultado aqui na mensagem."*

Isso é o **furo de conversão nº 1** (`ARQUITETURA-SECOES` §4.4) e é pior que um problema de UX: **o site comete, na frente do visitante, exatamente o erro que ele cobra da empresa dele.** A página inteira vende "pare de passar informação de um lugar pro outro na mão" e depois pede para ele copiar e colar na mão. A `SINTESE` P0-7 registra isso.

Copy nova, para depois de o mapa persistir:
> **O seu mapa já vai junto.**
> Aquele que você fez ali em cima — os passos, as horas, a conta inteira. Você não precisa copiar nada. A conversa começa três passos à frente.

Se não houver mapa em memória, o card simplesmente não renderiza. **Nunca peça cópia manual.**

---

### §13 — RODAPÉ

| Atual | Novo |
|---|---|
| `máquinas que fazem o trabalho repetitivo da sua empresa.` 🔴 **[MEDIDO: 0]** | **`máquinas que atendem, registram e avisam — pra isso não depender de você.`** |
| links: o problema · ver rodando · por onde começa | ➕ adicionar `quem faz` |

---

## 5. COMO REESCREVER `Problema.tsx`

### O que muda de fundo

O eixo da seção deixa de ser **"trabalho se repete"** (0 ocorrências, dor tolerada) e passa a ser **"tudo depende de você estar lá"** — que é dor urgente por três caminhos independentes:

1. **Cliente** — 33% (dor nº 1 há 12 edições) via o canal onde ela acontece (82% WhatsApp)
2. **Tempo do dono** — 3,9 h de atendimento numa jornada de 9,3 h, 78% trabalhando sábado
3. **Dependência de pessoa** — FDC (n=491): *"dependência maior em relação às pessoas do que a processos"*, 25% em maturidade não estruturada; e 85% das médias industriais com dificuldade de mão de obra qualificada

### Os três cards novos

**Label:** `o problema` · **Título:** `Você reconhece algum desses?` — **os dois mantêm.** Pergunta de reconhecimento, 2ª pessoa, custo de leitura mínimo.

> **Teto rígido:** 3 cards, ≤ 25 palavras cada, ≤ 10 s somados (`ARQUITETURA-SECOES` §3). Os três abaixo têm 24, 25 e 25.

---

#### CARD 1 — `22:14` · **Chega orçamento fora do horário**

> O cliente pede o preço à noite. Você vê às oito da manhã. Às vezes ele já fechou com outro.

- ✅ **Promovido a primeiro** — é a cena mais confirmada do site inteiro
- `cliente` **[MEDIDO: 84]** · `orçamento`/`preço` **[MEDIDO: 34]**
- Lastro institucional: WhatsApp = 82% do canal de venda · falta de clientes = 33%
- Voz crua que sustenta o enquadramento: *"o cliente visualizou e não respondeu"* · *"estou esperando ela me responder até hoje. Já faz três meses."* (36 curtidas)
- Mudanças em relação ao atual: `pedido` → `orçamento` (mais medido e é a etapa em que se perde a venda) · "Ninguém vê" → **"Você vê"** (o sujeito é ele, não "ninguém") · **"já resolveu com outro"** → **"já fechou com outro"** — é dinheiro, e `dinheiro` **[MEDIDO: 45]** é a 4ª palavra mais produzida e não aparecia em lugar nenhum do site

---

#### CARD 2 — `20ª vez essa semana` · **A mesma pergunta, de novo**

> Preço, prazo, se tem no estoque. Você já respondeu isso vinte vezes essa semana — e vai responder de novo agora.

- 🔴 **Substitui o card refutado** (`redigit*` 0 · `"três vezes"` 2 · `digitar` 1)
- **A troca de fundo:** a repetição continua sendo a cena. Muda **quem repete**. Não é o funcionário digitando três vezes (dor tolerada, 0 ocorrências); é **você respondendo a mesma coisa** — dor urgente, 3,9 h/dia
- `estoque` **[MEDIDO: 38]** · `orçamento`/`preço` **[MEDIDO: 34]** · `pedido` **[MEDIDO: 12]**
- Voz crua direta: *"Trabalho na área da comunicação... temos um site montado com todas as informações, mesmo assim vem gente no WhatsApp, eu tenho que mastigar as informações"* (28 curtidas) · *"eu estava mandando 'ficou alguma dúvida' o dia todo sem resposta sendo visualizado"* (117 curtidas)
- `[JULGAMENTO]` no "vinte vezes": não é dado, é ordem de grandeza. Se preferir zero risco: **"Você já respondeu isso hoje. Vai responder de novo antes do almoço."**

---

#### CARD 3 — `só você sabe` · **O sistema é você**

> A planilha está certa, o caderno está certo, o preço tá na sua cabeça. Funciona — enquanto você estiver lá.

- 🔴 **Este é o card que resolve o tiro no pé da planilha.** Ela aparece como **prova de que ele deu conta**, não como atraso. É o inverso exato de `alguém copia pra planilha`
- `sistema` **[MEDIDO: 54]** — 2ª palavra mais produzida, usada no sentido dele, não no sentido de software
- `planilha`/`excel` **[MEDIDO: 441 comentários]**, muitos de gente comemorando ter montado a sua: *"consegui fazer minha planilha com sucesso"* · *"minha planilha esta perfeita"*
- `caderno` **[MEDIDO: 9]** · `papel` **[MEDIDO: 5]** · `controle` **[MEDIDO: 22]**
- Lastro institucional: FDC (n=491) — *"dependência maior em relação às pessoas do que a processos"*; 85% das médias industriais com dificuldade de mão de obra qualificada; 73% das médias empresas com mais de 20 anos de mercado (ou seja: **isso funcionou por décadas, e dizer o contrário é mentir**)
- @gary-halbert: você nunca diz ao leitor que ele é burro. Este card diz que ele é **insubstituível**, e mostra a conta disso.

---

### O fecho da seção

| Atual | Veredito | Novo |
|---|---|---|
| *"Nenhum desses é problema de tecnologia. São de processo — e processo se **automatiza**."* | 🟠 metade sobrevive: `processo` **[MEDIDO: 27]** ok · `automatiza` **[MEDIDO: 3]** cai | **"Nenhum desses é problema de tecnologia. É trabalho que ainda depende da sua mão — e não precisa depender."** |

Ancoragem: `manual` **[MEDIDO: 6]**, "na mão" é forma nativa, e o selo `dá pra tirar da sua mão` já circula em três seções.

---

### `[AUTO-DECISION]` — as três decisões que tomei sozinho aqui

1. **`[AUTO-DECISION]` Cortar a cena "toda segunda / o relatório" → CORTADA.**
   Motivo: 🟡 não confirmada nem refutada pela pesquisa (§11-L1: *não existe métrica brasileira de horas gastas com retrabalho em PME*), `relatório` tem presença baixa no corpus, e é cena de empresa que **já tem alguém para fazer relatório** — ou seja, EPP, não ME. Enquanto o porte-alvo não estiver decidido, ela exclui metade do público.

2. **`[AUTO-DECISION]` Dinheiro entra como consequência, não como 4º card → CONSEQUÊNCIA.**
   A pesquisa recomenda adicionar cena de dinheiro (§9 item 7). Mas o teto é 3 cards e < 10s de leitura. E, mais importante: **a dor de dinheiro dele é falta de receita, não custo de processo** — falta de clientes 33% e faturamento −10% a/a, contra "custos" que é dor genérica de insumo. Logo o dinheiro entra onde é receita: no card 1 (*"já fechou com outro"*) e no arco inteiro do demo. Se o founder quiser cena própria de dinheiro, ela **substitui** o card 3 — não soma um quarto.

3. **`[AUTO-DECISION]` Não usar as frases cruas do YouTube na página → NÃO USAR.**
   São falas públicas de terceiros na internet, não clientes. Usá-las na página com aspas seria depoimento fabricado por omissão de contexto — viola `CONTEXT.md` §3. **Elas alimentam o vocabulário da copy; nunca aparecem entre aspas no site.** Registrado aqui porque a tentação é enorme e o material é bom demais.

---

## 6. O ARCO DE PREÇO (@dan-kennedy) — porque a ordem das seções é a copy

A declaração do founder é a tese inteira:

> *"se eu só [falar] o preço, muito provavelmente ela não irá fechar; porém se eu conseguir construir ganho, passa a ser investimento"*

Isso não se resolve com uma frase. Se resolve com **sequência**. Onde o ganho fica construído:

| # | Seção | O que ela adiciona ao "ganho" | Menção a dinheiro permitida? |
|---|---|---|---|
| 1–4 | dobra → problema → casos | **Custo do problema**, na moeda dele: cliente perdido, dia perdido, dependência dele | 🔴 **NÃO.** Falar de valor aqui é falar antes de a dor estar dimensionada |
| **5** | **demo** | 🔴 **O PONTO DE VIRADA.** O número de horas/mês é **dele**, não meu — informado por ele, com a premissa aberta, verificável, impossível de acusar de inventado. É aqui que o ganho existe | 🟢 **SÓ a linha "quanto vale essa hora na sua empresa, você sabe melhor do que eu"** — sem número |
| 6–7 | método → quem faz | **Redução do risco percebido**, que é a outra metade da equação de preço | 🔴 não |
| 8 | por onde começa | **Escopo tangível** — ele finalmente vê o que compra | 🔴 nenhum valor. Regra do founder |
| 9–10 | comparação → compromissos | **O mecanismo único** (§0.2): forma de contrato. É o que faz o preço parecer justo antes de ser dito | 🟢 "o preço não muda no meio" — sobre estabilidade, não sobre valor |
| 11 | FAQ | **Onde o preço é finalmente nomeado — e não dito.** *"Depende do tamanho, e eu prefiro dizer isso a colocar um número que não vale para o seu caso."* | 🟢 sim, sem número |
| 12 | contato | conversão | — |

**Regra dura derivada:** 🔴 **nenhuma palavra de investimento, valor, custo ou preço pode aparecer antes da §5.** Se aparecer, o número da §11 bate em vazio e o founder perde a venda exatamente do jeito que ele descreveu.

⚠️ **A fragilidade honesta do arco:** o demo devolve **horas** e ele decide em **reais**. A ponte é a frase da §5 (*"quanto vale essa hora na sua empresa, você sabe melhor do que eu"*) e ela transfere a aritmética para ele — o que é o certo do ponto de vista de Kennedy e o único caminho que respeita "zero número inventado". **Mas é uma frase carregando um degrau inteiro.** Se na prática as conversas mostrarem que ele não faz essa conta sozinho, o degrau precisa virar interface — e aí entra decisão do founder, não de copy. Registrado em §8.

---

## 7. GLOSSÁRIO DE SUBSTITUIÇÃO

> Base: universo operador, n=3.320 comentários, contagem de palavra inteira, excluindo ocorrências em que o termo já estava no título do vídeo — ou seja, só o que ele **produz**, não o que ele **devolve**.

### 7.1 🔴 Proibidos — banimento total da página

| Termo proibido | Freq. | Substituto | Freq. do substituto |
|---|---|---|---|
| **trabalho repetitivo** | **0** | *a mesma pergunta de novo* · *o que já te tomou o dia* | `tempo` 67 · `cliente` 84 |
| **mapear** | **0** | *ver* · *escrever* · *mostrar* | — |
| **automatizável** | **0** | *dá pra tirar da sua mão* | `manual` 6 |
| **redigitar** | **0** | *passar de um lugar pro outro na mão* | — |
| **workflow** | **0** | *o caminho do pedido* | `pedido` 12 |
| **webhook** | **0** | (nunca aparece) | — |
| **KPI** | **0** | *o número* | — |
| **API** | 1 | (nunca aparece) | — |
| **chatbot** | 1 | *quem responde primeiro* | `responde` (verbo da faixa) |
| **dashboard** | 2 | *a tela onde você vê* | — |
| **CRM** | 2 | *onde ficam os seus clientes* | `cliente` 84 |
| **agente de IA** · **no-code** · **low-code** | ~0 | (nunca aparecem) | — |
| **transformação digital** · **escalar** · **otimizar** · **eficiência** | — | (nunca aparecem) | — |
| **alguém** (como sujeito) | — | *eu* · *você* · *a gente* | 1ª pessoa 607 vs 250 |
| **nossa empresa** · **nós** · **fazemos** | 2 · — · 5 | *minha empresa* · *eu* · *a gente* | 16 · — · 21 |
| **leads** · **onboarding** · **setup** · **entregável** | — | *quem te chama* · *o começo* · *o que você recebe* | `cliente` 84 |

### 7.2 🟠 Alto risco — só depois de um exemplo concreto, nunca em manchete

| Termo | Freq. | Substituto padrão | Quando o original é aceitável |
|---|---|---|---|
| **automação / automatizar** | 3 | *sair da sua mão* · *responder por você* | Nunca em H1, CTA ou título de seção. No corpo, depois de uma cena |
| **integração / integrar** | 4 | *fazer os seus sistemas conversarem* | Nunca. `sistema` **[54]** resolve sempre |
| **ERP** | 2 espontâneas (105 no corpus, **89% sob vídeos com "ERP" no título**) | *o sistema que você já usa* | Só na resposta do FAQ, quando ele já trouxe a palavra |
| **inteligência artificial / IA** | 2 | *a máquina* | Praticamente nunca. É o `current fad` que este público não produz |
| **plataforma / solução** | — | *site* · *máquina* · *sistema* | Nunca |
| **diagnóstico** | — | *o primeiro olhar* | No corpo, ok |
| **SEO / indexar** | — | *o Google acha ele* | Nunca |
| **escopo** | — | *o que você vai receber* | Ok em §6/§9/§10, onde o registro já é contratual |
| **etapa** | 7 | *passo* | Ok em corpo técnico do demo |

### 7.3 🟢 Nativo — a língua dele, use sem medo

`tempo` **67** · `cliente/clientes` **84** · `sistema` **54** · `dinheiro` **45** · `estoque` **38** · `orçamento` **34** · `ferramenta` **30** · `processo/processos` **27** · `controle` **22** · `software` **18** · `excel` **16** · `minha empresa` **16** · `pedido` **12** · `errado` **12** · `a gente` **21** · `caderno` **9** · `organizar` **9** · `meu negócio` **9** · `minha loja` **9** · `sozinho` **7** · `manual` **6** · `máquina` **6** · `papel` **5** · `planilha/excel` **441 comentários** · `nota fiscal` · `na mão` · `esqueci` · `perdi` · `consegui` **52**

### 7.4 ⚠️ Três armadilhas de palavra nativa

| Palavra | Armadilha |
|---|---|
| **`sozinho`** **[7]** | No corpus significa **abandono** (*"no meu caso estou sozinho, vou fazer divulgação, embalar e enviar sozinho"*), não autonomia. 🔴 Nunca escrever "a máquina faz sozinha" → **"a máquina faz sem você"** |
| **`planilha`** **[441]** | É **orgulho**, não vergonha. 🔴 Nunca é o vilão. Ela está certa; o que está errado é depender de você lembrar de abrir |
| **`processo`** **[27]** | Neutro, ele usa — mas **sem carga emocional nenhuma**. 🔴 Nunca em H1 nem em CTA. Ótimo em corpo |

### 7.5 A regra que vale mais que a tabela inteira

A evidência qualitativa de §7.3 da pesquisa é uma só, repetida em três comentários com 122, 63 e dezenas de curtidas:

> *"os professores de ERP levam 50 minutos explicando o que significa a sigla... seu vídeo foi o primeiro que fez algo simples: **citou exemplos** de sistema e como usar"*
> *"foi um dos poucos vídeos que a mensagem foi clara e objetiva sem 'tecniquês'"*

**O que ele premia não é palavra simples. É exemplo concreto no lugar de definição de categoria.**
Sempre que você tiver que escolher entre nomear a categoria e mostrar a cena — **mostre a cena.** Vale para o H1, para os cards, para o FAQ e para a §8.

### 7.6 Uma distinção que a página precisa manter

**Estatística de instituto sobre o MERCADO ≠ prova social sobre o FORNECEDOR.**

- ✅ Permitido: *"82% dos pequenos negócios vendem pelo WhatsApp (Sebrae, mar/2026)"* — é argumento, verificável, e não afirma nada sobre o Talos
- 🔴 Proibido: qualquer número, selo, contagem, nota ou "desde 20XX" sobre o Talos

Citar Sebrae **não** conta como um 4º tipo de sinal de confiança no teto do Baymard. Os três tipos continuam sendo: demonstração ao vivo · procedência da pessoa · compromisso contratual.

⚠️ **Mas dado de instituto na página tem regra:** fonte nomeada + data, sempre. E **nunca** dado com metodologia não publicada (L2/L3 da pesquisa — as 3,9 h e a jornada de 9,3 h estão nessa categoria). **Não escreva "3,9 horas por dia" na página.** Use na sua cabeça para escrever; não use como claim.

---

## 8. AUDITORIA — Tier 0 de saída

### 8.1 @claude-hopkins — Scientific Advertising

| # | Critério | Nota | Justificativa |
|---|---|---|---|
| 1 | Salesmanship in print (vende, não entretém) | 9/10 | Cada seção derruba uma objeção nomeada. Zero seção decorativa |
| 2 | **Specificity** | 9/10 | `22:14`, a premissa da conta escrita embaixo do número, `não li` em vez de chute. Perde 1 pelo "vinte vezes" do card 2, que é ordem de grandeza |
| 3 | Service, not brag | 10/10 | Zero superlativo. A §7 é bio de procedência, não de vaidade |
| 4 | **Tell the full story** | 10/10 | *"Sem case ainda. E eu não vou inventar um."* + as 2 células perdidas da §9. Hopkins pagaria para escrever isso |
| 5 | Headline seleciona o público certo | 9/10 | Opção 1 seleciona por canal (WhatsApp) e por dor nº 1. Perde 1 porque exclui parcialmente a indústria B2B |
| 6 | **Testability de cada claim** | 7/10 | 🔴 **A nota mais baixa, e é justa.** "Quem responde primeiro leva" é folclore; "a máquina lê do seu jeito" é **falso hoje** (motor quebrado). Sobe a 10 quando o P0 fechar e o subhead usar o dado do Sebrae |
| 7 | Reason-why em cada claim | 9/10 | A premissa da conta, o "por que um site", o "por que não tem preço na página" |
| 8 | Sem superlativo vazio | 10/10 | Glossário §7 elimina a categoria inteira |
| 9 | **Sampling / try before buy** | 10/10 | O demo é amostra grátis do produto real, sem cadastro. É a coisa mais Hopkins do projeto |
| 10 | Mensurabilidade | 8/10 | CTAs distintas e rastreáveis. Perde 2 porque não há tráfego para A/B ainda |

### **NOTA HOPKINS: 91/100** ✅ (piso: 85)

🔴 **Ressalva que a nota esconde:** o critério 6 é o único que **cai para 4/10 se o site publicar antes do P0 do motor.** Nota condicional. Ver §9, bloqueio 1.

### 8.2 30 Triggers (@joe-sugarman — ferramenta de validação, não copywriter)

| Trigger | Estado | Onde |
|---|---|---|
| 1. Envolvimento / senso de posse | ✅ | O demo roda com o texto **dele**; botões em 1ª pessoa |
| 2. Honestidade | ✅✅ | "Sem case ainda. E eu não vou inventar um." |
| 3. Integridade | ✅✅ | "não li" · "prefiro não te dar um número inventado" · 2 células perdidas na §9 |
| 4. Credibilidade | ✅ | Demo verificável + §7 com link externo + Sebrae com fonte |
| 5. Valor e prova de valor | ✅ | Horas/mês **informadas por ele**, premissa aberta |
| 6. Justificar com lógica | ✅ | A conta inteira escrita embaixo do resultado |
| 7. Ganância | ❌ **deliberado** | Sem preço, sem desconto, sem "economize X%" — regra do founder e do projeto |
| 8. Estabelecer autoridade | 🟡 | Bloqueado por `perfil.ts` vazio |
| 9. Convicção de satisfação | 🟡 | §10 é o análogo honesto. "Não gostou, não paga" fora — gate do founder |
| 10. Natureza do produto | ✅ | §8 `o que está incluso`, item por item |
| 11. **Natureza do prospect** | ✅✅ | É a espinha desta V2 inteira: léxico medido em 3.320 comentários |
| 12. Modismos atuais | ❌ **deliberado** | "IA" é o modismo e ele produz 2 ocorrências. Evitar é a decisão certa |
| 13. Timing | 🟡 | O único honesto é "estou começando agora", que já está na dobra |
| 14. **Linking** | ✅✅ | Liga o novo (máquina) ao que ele já conhece: WhatsApp, planilha, site, caderno |
| 15. Consistência | ✅ | Micro-compromisso: ele escreve o processo (§5) antes de dar o contato (§12) |
| 16. Harmonizar | ✅ | O registro contido casa com "estamos sobrevivendo" |
| 17. Desejo de pertencer | 🟡 | FAQ #7 ("empresa do meu tamanho") — única aparição |
| 18. Desejo de colecionar | ❌ n/a | Não aplicável a serviço |
| 19. Curiosidade | ✅ | "Não vou te contar. Olha acontecendo." |
| 20. Urgência | 🟡 **deliberadamente fraca** | Urgência falsa aqui é fraude. A única honesta é o cliente que fecha com outro enquanto ele dorme (card 1) |
| 21. Gratificação instantânea | ✅✅ | Resultado em milissegundos, sem cadastro, sem falar com ninguém |
| 22. Exclusividade / raridade | ❌ **deliberado** | Não há escassez real. Inventar uma quebraria a página inteira |
| 23. Simplicidade | ✅✅ | 3 passos, 3 campos, 3 compromissos, glossário sem jargão |
| 24. Relacionamento humano | ✅ | "respondo eu, não um formulário" + §7 com rosto |
| 25. Storytelling | ✅ | As 3 cenas com carimbo |
| 26. Engajamento mental | ✅✅ | Ele digita; e a conta de "quanto vale essa hora" ele completa sozinho |
| 27. Culpa | 🔴 **PROIBIDO** | Zombar da planilha é o trigger de culpa e é o tiro no pé identificado em §1.3. Banido |
| 28. Especificidade | ✅✅ | `22:14`, premissa aberta, item por item na §8 |
| 29. Familiaridade | 🟡 | Marca nova, zero reconhecimento. Compensado por léxico familiar |
| 30. Esperança | ✅ | "Resolvido isso, o resto da operação fica visível" |

**Contagem:** 17 plenos ✅ · 7 parciais 🟡 · 5 excluídos por decisão fundamentada ❌ · 1 não aplicável.

**COBERTURA: 24/30 = 80,0%** ✅ (piso: 80%)
Sobre a base de triggers aplicáveis (24, excluindo "colecionar" e os 5 vetados pelas regras do projeto): **100% tocados, 71% plenos.**

🔴 **Os 5 excluídos são exclusão consciente, não falha:** ganância, modismo, exclusividade, colecionar e **culpa**. Os quatro primeiros exigiriam preço, escassez ou fad que não existem. O quinto é o erro que a pesquisa acabou de flagrar na copy atual — e ele fica banido em definitivo.

---

## 9. O QUE EU NÃO CONSEGUI RESOLVER

### 🔴 Bloqueios que impedem publicação

**1. O motor `mapear.ts` está quebrado e a §5 é a única prova do site.**
`SINTESE` §1 mediu: dicionário inteiro em 3ª pessoa, `indexOf` sem fronteira de palavra, `eu confiro` → "não li", `monta a proposta` → "mundo físico", `geralmente faço` → cálculo 12 min. E **16/16 processos da §4 colapsam em 1 etapa.**
**Toda copy que promete "escreve do seu jeito" é falsa até o P0 fechar.** Não é problema de copy — é o que decide se a §5 é prova ou prova contra. **Nenhuma linha deste documento que use "com as suas palavras" pode ir ao ar antes disso.**

**2. `lib/perfil.ts` vazio.** §7 não tem copy possível sem nome, bio, foto e link. §12 não tem destino sem WhatsApp. É bloqueio de publicação, não de arquitetura.

### 🟡 Decisões que só o founder toma, e que mudam a copy

**3. Porte-alvo: ME ou EPP?**
Muda três coisas concretas: (a) a CTA `mandar isso pro meu sócio` da §9 é peso morto se for ME — o leitor **é** o decisor; (b) o rótulo `de volta pra você` vs `pra equipe` no demo; (c) o registro. **Não dá para atender os dois na mesma dobra.**
Dados: EPP tem 96% com computador, 78% com software integrativo, menor mortalidade (17%) e a maior jornada do dono (9,9 h). É o ICP mais provável.

**4. Setor-âncora: comércio ou indústria?** 🔴 **Essa é a que mais mexe no H1.**
O H1 recomendado (Opção 1) é construído sobre os 82% do WhatsApp — que vêm do agregado Sebrae de pequenos negócios, com peso de comércio. **Metalúrgica B2B não fecha orçamento às 22h no zap.** Se o âncora for indústria, o H1 passa a ser a **Opção 3** ("A sua empresa funciona porque você está nela o tempo inteiro"), que tem lastro em FDC e CNI. Não é ajuste — é outro H1.

**5. A ponte horas → reais.**
O demo devolve horas; ele decide em reais. Resolvi com a frase *"quanto vale essa hora na sua empresa, você sabe melhor do que eu"* — que é a solução correta de Kennedy e a única que respeita "zero número inventado". **Mas é uma frase carregando um degrau inteiro do arco.** Você é a única pessoa que já teve essa conversa com um dono. Se ele não faz a conta sozinho, o degrau precisa virar interface — e aí é decisão sua, não minha.

**6. Preço R$750 vs sinal premium da página.**
Não é problema de copy e não tem solução de copy. Neumeier já levantou (`SINTESE` §4, pergunta 2). Toda a §6 deste documento constrói o ganho para que o preço vire investimento — mas se o número que sai da sua boca no fim for R$750 depois de um site com esse acabamento, o efeito é o inverso: **preço baixo demais depois de sinal alto lê como "tem alguma coisa errada"**. Registro e passo.

**7. Texto exato da linha de honestidade da dobra.**
`ARQUITETURA-SECOES` D-A já marca como decisão sua. Minha recomendação está em §2, e a regra de escrita é: declarativa, nunca apologética; sem "ainda", "por enquanto" ou "infelizmente"; aponta imediatamente para o substituto. **É a única frase da página que pode ler como fraqueza se sair errada.**

### ⚪ Limites da própria pesquisa que a copy herda

**8. Abas Serviços e Projeto/obra da §4 são hipótese.** L6: voz crua de clínica/escritório é quase nula (os vídeos capturados têm 3 e 0 comentários). L7: o corpus de obra é de **engenheiro**, não de dono de construtora. Escrevi as duas no registro certo, mas **sem lastro**. Se você tem uma conversa real com dono de clínica ou de construtora, ela vale mais que tudo que eu escrevi nessas 8 linhas.

**9. Ninguém falou com um dono de PME neste projeto.** `SINTESE` §5 registra: 51 pares de contraste medidos, motor executado contra 70 entradas sintéticas, **zero contato humano**. A copy V2 é a melhor inferência possível sobre 5.100 comentários e 52 fontes — e continua sendo inferência.

🔴 **CORREÇÃO (28/Jul) — a amostra NÃO é grátis, porque ela não existe.** O founder respondeu
literalmente: *"eu não sei, estou começando e ainda não tenho clientes"*. Este é o **segundo**
agente a afirmar que ele já teria falado com dezenas de donos; a premissa vem de ler o D2 do
`CONTEXT.md` como fato consumado quando ele é **intenção de projeto**. Nenhum agente deve
reafirmar isso. Se for preciso contato humano, ele terá que ser produzido do zero — não colhido.

**10. O veredito de vocabulário é proxy, não volume de busca.** L10: Google Trends e Keyword Planner não foram obtidos. Produção espontânea em corpus é um proxy bom, mas é proxy. Se alguma vez houver acesso ao Keyword Planner, as tabelas de §7 devem ser reconferidas.

### 🚫 O que eu deliberadamente não fiz

**11. Não usei nenhuma frase crua do corpus como depoimento.** São falas públicas de terceiros, não clientes. Aspas na página seriam depoimento fabricado por omissão de contexto. **Elas alimentaram o vocabulário; nenhuma aparece entre aspas no site.**

**12. Não escrevi as 3,9 h nem as 9,3 h na página.** L2: a metodologia da pesquisa Sebrae *Tempo do Empreendedor* não foi encontrada em fonte pública — os números só existem em cobertura de imprensa de dez/2021. Usei para escrever; não uso como claim. Mesmo tratamento para o "44% usam IA" (L3) e para as 1.958 h de burocracia (indicador do Banco Mundial descontinuado, dado de 2018).

**13. Não toquei no nome.** Ordem sua.

---

## 10. ORDEM DE EXECUÇÃO RECOMENDADA

| # | O quê | Bloqueia? |
|---|---|---|
| 1 | 🔴 **P0 do motor** (`SINTESE` §3 itens 1–7) | Bloqueia a §5 inteira e o critério 6 do Hopkins |
| 2 | Escolher **setor-âncora** → trava o H1 (Opção 1 ou 3) | Bloqueia a dobra |
| 3 | Escolher **porte-alvo** → trava a §9 e os rótulos do demo | Bloqueia a §9 |
| 4 | Aplicar o **glossário §7** em todos os `.tsx` — é achar-e-substituir | Nada. Pode começar hoje |
| 5 | Reescrever **`Problema.tsx`** conforme §5 | Nada |
| 6 | Reescrever **`HeroPreview`** + placeholder do demo (a pessoa gramatical) | Depende do item 1 para o placeholder funcionar |
| 7 | Preencher **`perfil.ts`** | Bloqueia publicação |
| 8 | Escrever a **§9 comparação** e a **§10 compromissos** | Depende do item 3 |
| 9 | **Persistir o mapa §5 → §12** e reescrever o card lateral | Furo de conversão nº 1 |

**Os itens 4 e 5 não dependem de nada e valem sozinhos.** São as duas coisas que tiram do ar as frases de frequência zero.

---

*Copy Chief · Tier 0 (Schwartz/Collier) → Tier 1-2 (Halbert/Bencivenga/Kennedy/Brown) → Auditoria Hopkins 91/100 → 30 Triggers 80,0%.*
*Toda palavra marcada `[MEDIDO]` sai de `01-research/02-dores-pme-brasileira.md`. Toda palavra marcada `[JULGAMENTO]` é minha e não tem pesquisa defendendo.*
