# Fase 1c — Dores do dono de PME e indústria brasileira

**Data:** 2026-07-28 · **Para:** site Talos (automação de processos + construção de sites)
**Público investigado:** dono de PME / indústria pequena e média brasileira, não-técnico.

---

## 0. Como este documento foi feito (e o que ele não é)

Esta pesquisa existe porque o founder respondeu, literalmente: *"eu não sei, estou começando e
ainda não tenho clientes, mas você poderia buscar as dores dos empresários na internet para
termos uma noção desse assunto."*

**Não há observação de campo.** Nenhum dono de PME foi entrevistado por este projeto. Um
documento anterior partiu da premissa de que dezenas haviam sido observados — a premissa é falsa
e está formalmente revogada aqui. Tudo abaixo é (a) estatística de instituto com metodologia
publicada ou (b) fala pública espontânea capturada da internet. Onde falta, está escrito que falta.

### Método

**Camada A — institucional (fonte primária com metodologia).**
Sebrae (Pulso dos Pequenos Negócios 12ª ed. e Transformação Digital 2025), CGI.br/NIC.br
(TIC Empresas 2025), Fundação Dom Cabral (Centro de Inteligência em Médias Empresas), CNI,
FGV EAESP (36ª Pesquisa Anual de Uso de TI). Todos os PDFs foram baixados e extraídos localmente
— os percentuais abaixo saem do documento, não de release de imprensa, salvo onde indicado.

**Camada B — voz crua (corpus construído para esta pesquisa).**

| Corpus | Volume | Como foi obtido |
|---|---|---|
| Comentários de YouTube BR | **5.100 comentários · 67 vídeos** | `yt-dlp --write-comments` sobre 22 buscas dirigidas (planilha, ERP, nota fiscal, WhatsApp, obra, PCP, agência, preço de site, n8n) |
| Avaliações B2B Stack | 45 avaliações com cargo declarado | raspagem HTML dos perfis de produto |
| Reclame Aqui | 5 reclamações TOTVS (amostra) | `__NEXT_DATA__` da página de lista |
| Respostas abertas Sebrae | frases de 8.273 respondentes | pergunta "defina em uma frase a situação do seu negócio", Pulso 12ª ed. |

**Camada C — teste de código.** O dicionário de verbos de `apps/talos/lib/mapear.ts` foi portado
para Python e rodado contra o corpus. Os resultados estão na §2.4 e são o achado de maior valor
técnico imediato.

### Limites que você precisa carregar ao ler

1. **Comentário de YouTube não é amostra probabilística.** Quem comenta é minoria autosselecionada.
   Serve para **léxico** (que palavras existem) e para **existência** (essa dor é dita?), não para
   **prevalência** (que % sente).
2. **Ausência no corpus não prova ausência no mundo.** Prova ausência *no vocabulário público
   espontâneo* — que é exatamente o que um site precisa saber.
3. Onde a busca falhou, está na §11 (Lacunas), explicitamente.

---

## 1. Sumário executivo — as 5 dores mais fortes

### D1. Falta de cliente é a dor #1 declarada. Processo não aparece na lista.

Sebrae, *Pulso dos Pequenos Negócios* 12ª edição (campo 19/02/2026 a 18/03/2026, **n = 8.273
respondentes**, 26 estados + DF, erro amostral 1,1%, IC 95%, ponderado por UF e porte). Pergunta:
*"Hoje o que mais traz dificuldades para o seu negócio?"*

| Resposta | mar/26 | ago/25 | mai/25 |
|---|---|---|---|
| **Falta de clientes** | **33%** | 35% | 34% |
| Aumento dos custos | 31% | 31% | 32% |
| Dívidas | 21% | 18% | 18% |
| Funcionários afastados por saúde | 1% | 1% | 1% |
| Outros | 15% | 16% | 15% |

Em **doze edições consecutivas desde ago/2022**, as opções são as mesmas quatro. *Tempo*,
*processo*, *retrabalho*, *burocracia* e *gestão* **não estão no questionário e não emergem em
"Outros" com peso**. Isso é decisivo: a dor que a Talos vende (trabalho repetitivo) não é a dor
que o dono **nomeia**. A ponte tem que ser construída — e o material para construí-la está em D2.

### D2. A ponte existe e é o WhatsApp: é onde a falta de cliente vira problema de processo.

- **82%** dos pequenos negócios vendem pelo WhatsApp — contra Instagram 57%, Facebook 30%,
  **loja virtual própria 10%** (Sebrae, Pulso 12ª ed., mar/26).
- Entre empresas com 10+ empregados que vendem pela internet, o canal WhatsApp/chat é **80% do
  total e 81% das pequenas**, enquanto o **site da própria empresa é 32% (30% nas pequenas)**
  (CGI.br/NIC.br, TIC Empresas 2025, n = 4.174, CATI, campo fev/2025–jan/2026).
- O empreendedor gasta **3,9 horas por dia com atendimento ao cliente** — a maior fatia da sua
  jornada de 9,3 h (Sebrae, *Tempo do Empreendedor*, 2021).

Ou seja: o canal onde ele perde cliente e o canal que consome 40% do seu dia são **o mesmo canal**.
Essa é a única dor em que "perder cliente" e "trabalho repetitivo" são literalmente a mesma frase.

### D3. Ele não tem site — e não é falta de dinheiro, é irrelevância percebida.

TIC Empresas 2025 (CGI.br/NIC.br): empresas **com 10 ou mais empregados** que possuem website:

| Porte | 2019 | 2021 | 2023 | 2024 | 2025 |
|---|---|---|---|---|---|
| Total | 54% | 58% | 56% | 53% | 56% |
| **Pequena** | 51% | 54% | 52% | **49%** | **53%** |
| Média | 77% | 79% | 77% | 76% | 76% |
| Grande | 89% | 89% | 85% | 81% | 87% |

**Quase metade das pequenas empresas formais brasileiras não tem site, e o indicador não cresceu
em seis anos.** Isso não é um mercado subatendido por preço — é um mercado que não comprou o
argumento. O site atual da Talos vende "site" para quem já decidiu que site não resolve.
O contra-argumento correto não é preço nem beleza: é que **o site dele hoje seria a máquina que
atende no WhatsApp** (D2), não um folheto.

### D4. Ele já tentou, e a falha que ele conta não é técnica — é de promessa quebrada e de preço que muda.

Voz crua, B2B Stack, Diretor/C-Level na JJ Info, sobre o Omie:
> *"O Omie diz que tem CRM, mas não tem, diz que tem integração com marketplaces e etc, mas não
> tem, alias, eles possuem sim, mas não funciona. (...) Quem desenvolveu, provavelmente nunca
> trabalho realmente com venda, nunca emitiu uma nota. não sabe como é o processo dentro de uma
> loja."*

Voz crua, YouTube (comentário em vídeo de comparação de ERP para pequena empresa):
> *"Conta azul tá de sacanagem! Era 100,0 agora meu plano vai para 500,00 a justificativa deles é
> que aumentou meu faturamento, olha o absurdo! Aonde um pequeno empresário tem condições de pagar
> 500 por mês?"*

Reclame Aqui, TOTVS, título de reclamação: **"ATRASO E SUMIÇO NA IMPLEMENTAÇÃO"** —
*"Desde quando a empresa adquiriu o serviço, não foi feito a disponibilização dele, temos outro
ERP, que eles disseram que conseguiriam..."*

O padrão é consistente: **o produto foi vendido como algo que ele não era, o preço subiu depois, e
sumiram na implantação.** Nenhuma das três falhas é sobre a tecnologia funcionar.

### D5. O motor do site não entende como ele fala. Isso é bug medido, não hipótese.

Rodando o dicionário real de `mapear.ts` contra o próprio texto de exemplo do site, em três pessoas
verbais:

| Versão | Etapas lidas | Etapas perdidas |
|---|---|---|
| 3ª pessoa (o `EXEMPLO` que está no código) | **5 de 5** | 0 |
| 1ª pessoa singular ("eu confiro", "eu jogo na planilha") | **3 de 5** | 2 |
| 1ª pessoa plural ("a gente põe na planilha") | 4 de 5 | 1 — e 1 classificada errado |

E a 1ª pessoa é a forma dominante: no corpus de 5.100 comentários, verbos em **1ª pessoa do
singular somam 762 ocorrências contra 520 em 3ª pessoa** entre pares do mesmo verbo. Detalhe na §2.4.

---

## 2. Corpus de frases cruas — como ele descreve o próprio problema

> Esta é a seção de maior valor técnico do documento. Tudo aqui é transcrição literal, com link.
> Erros de digitação foram **preservados** de propósito: eles fazem parte do registro.

### 2.1 A pergunta central: 1ª ou 3ª pessoa?

**Resposta: 1ª pessoa do singular, com folga.** Medição sobre os 5.100 comentários, contando pares
do mesmo verbo (1ª sing. vs 3ª sing.):

| Verbo | 1ª pessoa | 3ª pessoa |
|---|---|---|
| tenho / tem | 110 | 197 |
| faço / faz | 45 | 73 |
| trabalho | 74 | — |
| fiz / fez | 50 | 21 |
| consegui / conseguiu | 52 | 11 |
| uso / usa | 40 | 13 |
| passo / passa | 48 | 5 |
| aprendi / aprendeu | 35 | 5 |
| tentei / tentou | 12 | 0 |
| **TOTAL (todos os pares)** | **762** | **520** |

*Ressalva honesta:* "tem" e "faz" em 3ª pessoa aparecem inflados porque também são impessoais
("tem gente que…", "isso faz…"). Excluindo esses dois pares, a razão fica ainda mais desequilibrada:
**607 (1ª) contra 250 (3ª)**.

**1ª pessoa do plural existe, mas é minoritária e tem forma preferida.** Contagens:

| Forma | Ocorrências |
|---|---|
| "a gente" (todas as formas) | 21 |
| "temos" | 19 |
| "minha empresa" | 16 |
| "meu negócio" | 9 |
| "minha loja" | 9 |
| "fazemos" | 5 |
| "usamos" | 3 |
| "nossa empresa" | 2 |

**Regra prática derivada:** ele diz **"eu"**. Quando fala em grupo, diz **"a gente faz"** (3
ocorrências) mais do que **"fazemos"** — e "a gente" bate "nós" em todas as formas. O possessivo
que ele usa é **"minha empresa" / "minha loja" / "meu negócio"**, quase nunca "nossa empresa".

### 2.2 Frases literais — tempo, sobrecarga, fazer tudo

> *"Sou artesã e também estou achando uma dificuldade enorme em emitir nota fiscal o meu produto é
> feiro a mão, mas acho mais fácil passar horas fazendo uma peça que emitir nota"*
> — [Universidade Ecommerce](https://www.youtube.com/watch?v=jxkAlcKwpLY)

> *"O mei vei pra simplificar e ajuda pesoas simples tralhador agora tão complicando tudo. Veja se
> uma pessoa quê mal saber mexe no celular vai acertar fazer tudo isso"* (80 curtidas)
> — [Monetizando Negócios](https://www.youtube.com/watch?v=pdIa09O6YjY)

> *"Por isso eu sou a favor de sonegar. Olha que inferno pra fazer tudo certo"*
> — [Monetizando Negócios](https://www.youtube.com/watch?v=pdIa09O6YjY)

> *"No meu caso estou sozinho, vou fazer divulgação, embalar produtos e enviar sozinho!"*
> — [Leandro Silva](https://www.youtube.com/watch?v=nlbpTLIL3e0)

> *"Imagina o dono de um negócio cheio de coisas pra resolver e ainda ter tempo de gerenciar de
> forma profissional o perfil no Google??"*
> — [Adriano Gianini](https://www.youtube.com/watch?v=mvuIH3AdUPI)

> *"Verdade meu maior inimigo foi eu mesmo, abri uma empresa faturava quase 2k por dia, e não tive
> uma boa administração, gastei o que não podia e acabei fechando as portas da mesma"* (74 curtidas)
> — [Irmãos Dias Podcast](https://www.youtube.com/watch?v=SvT6kOjwyRw)

### 2.3 Frases literais — WhatsApp, orçamento, cliente que some

> *"Frustrante quando o cliente não responde às perguntas no whats."*
> — [Thiago Concer](https://www.youtube.com/watch?v=B337-JzY6wc)

> *"Fui fazer um pós venda, a cliente visualizou e não respondeu. Passou uma semana entrei em
> contato novamente e estou esperando ela me responder até hoje. Já faz três meses."* (36 curtidas)
> — [Thiago Concer](https://www.youtube.com/watch?v=B337-JzY6wc)

> *"eu estava mandando ficou alguma dúvida o dia todo sem resposta sendo visualizado"* (117 curtidas)
> — [Thiago Concer](https://www.youtube.com/watch?v=B337-JzY6wc)

> *"Trabalho na área da comunicação e posso afirmar que as pessoas não leem, temos um site montado
> com todas as informações, mesmo assim vem gente no WhatsApp, eu tenho que mastigar as
> informações, isso e péssimo haha."* (28 curtidas)
> — [Guilherme Machado](https://www.youtube.com/watch?v=Umxjo4W0iAE)

> *"Eu pergunto o preço, disponibilidade de estoque pra 500 unidades e prazo de entrega (...) e
> respondem só a primeira pergunta"*
> — [Thiago Concer](https://www.youtube.com/watch?v=B337-JzY6wc)

**Leitura:** a frase que ele produz não é "meu atendimento é lento". É **"o cliente visualizou e
não respondeu"** e **"eu tenho que mastigar as informações"**. A dor é enquadrada como *o cliente
some* e *eu sou o gargalo*, não como *meu processo é ineficiente*.

### 2.4 O teste do dicionário — o achado de código

Portei as `REGRAS` de `apps/talos/lib/mapear.ts` para Python e rodei contra o corpus.

**Achado 1 — o dicionário é escrito em 3ª pessoa e falha na 1ª.**
Verbos de processo em 1ª pessoa **presentes no corpus e não reconhecidos** pelo motor:

| Verbo (1ª pessoa) | Ocorrências no corpus | Radical que existe no dicionário |
|---|---|---|
| retorno | 26 | `retorna` |
| registro | 9 | `registra` |
| busco | 5 | `busca` |
| salvo | 5 | `salva` |
| atendo | 5 | `atende` |
| entrego | 5 | `entrega` |
| fabrico | 4 | `fabrica` |
| colo | 3 | `cola` |
| vou até | 3 | `vai ate` |
| alimento | 2 | `alimenta` |
| cobro | 2 | `cobra` |
| lembro | 2 | `lembra` |
| anoto, insiro, levanto, somo, gero, explico, apresento, julgo, monto, mando para | 1 cada | idem |

E os que a §1 do briefing citou se confirmam por inspeção do código: `'confer'` casa em *confere*
mas **não** em *confiro*; `'anota'` não casa em *anoto*; `'olha no'` não casa em *olho no*;
`'joga na planilha'` não casa em *jogo na planilha*; `'manda pro'` não casa em *mando pro*.

**Achado 2 — falso-positivo grave: `'negoci'` captura o substantivo "negócio".**
O termo `'negoci'` está na regra `decisao / humana`. No corpus, **92% dos disparos desse termo são
a palavra "negócio(s)"** — 138 ocorrências do substantivo contra 12 de qualquer forma verbal.
Consequência prática: **qualquer etapa que contenha "meu negócio" é classificada como decisão
humana e sai da conta de horas.** Como "meu negócio" é uma das expressões mais frequentes desse
público (§2.1), o motor se sabota exatamente na frase mais típica.

**Achado 3 — outros falso-positivos por substring** (contagem de ocorrências no corpus):

| Termo do dicionário | Categoria que dispara | Palavras inocentes que casam |
|---|---|---|
| `cola` | transcrição | escola (16), escolas (6), escolar (4), chocolate (1) — **28** |
| `guarda` | arquivamento | aguardando (3), aguardam (3), aguardar (2), resguardado (1) — **9** |
| `carrega` | presencial | encarregado (2), encarregados (2), sobrecarregado (1) — **6** |
| `entra` | recebimento | central, centralizadora, concentrar, concentrada — **4** |
| `obra` | presencial | cobrar (15), cobrança (4) — mitigado, porque `cobra` casa na posição 0 e vence o desempate |

**Achado 4 — a reprodução em três pessoas.** Rodando o próprio `EXEMPLO` do site:

```
3ª pessoa (código atual):
  [recebimento ] O cliente manda mensagem no WhatsApp pedindo orçamento.
  [resposta    ] Alguém lê e responde perguntando o que ele precisa.
  [transcricao ] Depois copia os dados pra planilha de leads.
  [consulta    ] Aí confere o preço na tabela e monta a proposta no Word.
  [notificacao ] Por fim avisa o vendedor que tem proposta nova.
  → 5 de 5 lidas

1ª pessoa (como ele falaria):
  [recebimento ] O cliente me manda mensagem no zap pedindo orçamento.
  [resposta    ] Eu leio e respondo perguntando o que ele precisa.
  [INDEFINIDA  ] Depois eu jogo os dados na minha planilha.        ← não leu
  [INDEFINIDA  ] Aí eu confiro o preço na tabela e monto a proposta. ← não leu
  [notificacao ] Por fim eu aviso o vendedor que tem proposta nova.
  → 3 de 5 lidas

1ª pessoa plural:
  [recebimento ] A gente recebe o pedido no zap.
  [INDEFINIDA  ] A gente põe na planilha.                          ← não leu
  [consulta    ] A gente confere o preço.
  [PRESENCIAL  ] A gente monta a proposta.        ← classificação ERRADA: 'monta'
                                                     está na lista "acontece no mundo
                                                     físico" e joga a etapa para "fica
                                                     com você"
  [notificacao ] A gente avisa o vendedor.
```

O bug de `monta` estava **mascarado** no exemplo do site: na frase em 3ª pessoa, `confer` aparece
antes de `monta` na mesma sentença e vence o desempate por posição. Reescreva a frase e o bug
aparece.

**Achado 5 — taxa de não-reconhecimento em frases reais.** Sobre 242 frases do corpus que contêm
pronome de 1ª pessoa **e** um substantivo de processo, **42,6% caíram em `indefinida`**. Esse
número está inflado (o filtro pega agradecimentos e perguntas junto), mas serve de teto: mesmo com
correção generosa, o motor deixa de ler entre um terço e dois quintos do que esse público escreve.

### 2.5 Frases de 8.273 respondentes (fonte institucional, não YouTube)

O Sebrae fez, no Pulso 12ª edição, uma pergunta aberta: *"Defina em uma frase a situação atual do
seu negócio."* Distribuição de sentimento: **42% neutro, 29% negativo, 27% positivo, 2% indefinido.**
As frases publicadas no relatório, por faixa:

| Positivo | Neutro | Negativo |
|---|---|---|
| "Em crescimento" | "Estável" | "Está muito fraco" |
| "Funcionando perfeitamente" | "Estamos sobrevivendo" | "Precisando de Socorro" |
| "Cada vez melhor" | "Razoável" | "Cada dia mais difícil de manter" |
| "Estamos indo bem, apesar de todas as dificuldades" | "Fazendo o melhor possível" | "Falindo" · "De portas fechadas" |

Este é o registro emocional real do público, validado em n = 8.273: **contido, resignado, na
terceira pessoa do plural sem sujeito** ("estamos sobrevivendo", "fazendo o melhor possível"). Não
é o registro de quem quer ouvir "revolucione sua operação". É o registro de quem quer ouvir
"isso aqui para de doer".

---

## 3. Processos repetitivos que mais consomem tempo, por setor

### 3.1 O que é medido

**Atendimento é a maior fatia da jornada do dono.** Sebrae, *Tempo do Empreendedor* (divulgado
dez/2021 — sem tamanho de amostra publicado nas fontes acessíveis; ver §11):

| Indicador | Valor |
|---|---|
| Jornada média, seg–sex | **9,3 h/dia** |
| MEI / Microempresa / EPP | 9,2 h · 9,7 h · **9,9 h** |
| Trabalham aos sábados | **78%** (~7 h) · MEI sobe a 82% |
| Trabalham aos domingos | **33%** (~6,3 h) |
| **Atendimento ao cliente** | **3,9 h/dia** |
| Horas de sono | 6,7 h/noite |
| Dizem faltar tempo para a empresa | **45%** (Sebrae-SP, 2022) |

**Quanto maior a empresa, maior a jornada do dono.** Isso importa: o dono de EPP (R$ 360 mil a
R$ 4,8 milhões/ano) — o ICP real da Talos — é o que trabalha **mais**, não menos.

**Burocracia fiscal é medida em horas por ano.** Banco Mundial/*Doing Business*, referência 2018,
via IBPT: empresa brasileira gasta em média **1.958 horas/ano** com obrigações acessórias — contra
Argentina 312,5 h, México 240,5 h e média OCDE 160,7 h. O IBPT estima **mais de 3.790 normas** por
empresa e ~**30 novas regras ou atualizações tributárias por dia**. A Fecomercio estima o custo da
burocracia para PMEs nacionais em **R$ 79 bilhões/ano**.
*Ressalva de qualidade:* o indicador *Doing Business* foi descontinuado pelo Banco Mundial e o dado
é de 2018. Use como ordem de grandeza, não como número corrente.

### 3.2 Por setor — o que a estatística mostra

| Setor | Achado | Fonte |
|---|---|---|
| **Indústria** | 69% usam ao menos 1 de 18 tecnologias digitais, mas a maioria usa poucas — "fase inicial de digitalização". **Só 7% adotam 10 ou mais.** Barreira interna nº 1 = alto custo de implantação (66%); barreira externa nº 1 = falta de profissional qualificado (37%) | CNI, Sondagem Especial Indústria 4.0 |
| **Indústria (média empresa)** | **85% das médias empresas industriais têm dificuldade para encontrar mão de obra qualificada** | FDC, n = 491 médias empresas |
| **Comércio** | 58% apontam falta de capital próprio como maior desafio. Gasto em TI = **4,8% do faturamento líquido** (o menor de todos os setores) | FDC · FGV EAESP 36ª Pesq. |
| **Serviços** | Investimento em tecnologia = **6,6% do faturamento**. No agregado FGV (médias/grandes), serviços gasta 14,8% — a distância entre PME de serviço e o benchmark é enorme | FDC · FGV EAESP |
| **Construção** | Menor uso de internet entre os pequenos negócios: **75,9%**, junto com agropecuária (59,3%) e indústria (75,6%) | Sebrae, TD 2025 |
| **Construção (10+ empregados)** | Fibra ótica saltou de 51% (2024) para 61% (2025); LinkedIn de 29% para 40% | CGI.br, TIC Empresas 2025 |

### 3.3 O que ele diz que quer automatizar (declarado, não inferido)

Sebrae, *Transformação Digital nos Pequenos Negócios 2025* — entre quem usa IA:

| Aplicação | % dos que usam IA |
|---|---|
| Textos generativos (ChatGPT, Gemini, Copilot, DeepSeek) | 51% |
| Geração de imagem | 44% |
| **Chatbot com robô no WhatsApp** | **41%** |
| **Chatbot de vendas** | **30%** |
| Dispositivos inteligentes (luz, temperatura) | 22% |
| Robô que tira dúvida financeira | 20% |

E a direção de uso: **74% dos MEIs e 59% das MPEs que usam IA direcionam para marketing e
divulgação.** O Sebrae registra ainda que os empreendedores priorizam automatizar
*tarefas repetitivas — FAQ, agendamento, dúvidas básicas, pedidos simples* — e **preservar o humano
para relacionamento, caso complexo, personalização e negociação**.

Entre empresas com 10+ empregados que usam IA, a aplicação nº 1 é **"automatização de processos de
fluxos de trabalho": 68%** (CGI.br, TIC Empresas 2025) — acima de mineração de texto (38%),
reconhecimento de imagem (31%) e ML (25%).

**Tradução para a oferta:** o mercado já validou dois produtos concretos — **robô que responde no
WhatsApp** e **automação de fluxo entre sistemas**. São exatamente os dois primeiros degraus da
`Escada.tsx`. O degrau que ele **não** pede é "sistema sob medida".

---

## 4. Dor urgente vs. dor tolerada

### 4.1 O que ele trata como urgente

| Dor | Evidência | Por que é urgente |
|---|---|---|
| **Não entra cliente** | 33% no Pulso 12ª, líder do ranking há 12 edições | Ameaça a receita hoje |
| **Custo subiu** | 31% no Pulso 12ª | Ameaça a margem hoje |
| **Dívida / inadimplência** | 21% (subiu de 18%); **28% têm dívida em atraso** — era 21% em ago/25, é o maior valor da série de 12 edições. O Sebrae registra ainda, textualmente, que *"a proporção de empresas com 30% ou mais dos seus custos mensais comprometidos com pagamentos aumentou expressivamente"* ⚠️ | Ameaça a existência |

> ⚠️ **Ressalva de leitura de gráfico.** No slide 24 do Pulso 12ª, a série "30% ou mais dos custos
> comprometidos com dívida" é uma barra empilhada cujo texto extraído do PDF é ambíguo entre **54%**
> e **40%** para mar/26 (as anotações de recorte no mesmo slide são MEI 59% / MPE 48%, o que sugere
> 54%). **Não use um número específico aqui sem abrir o PDF e conferir visualmente.** A afirmação
> qualitativa do próprio Sebrae — "aumentou expressivamente" — é segura; o percentual não é.
| **Faturamento caindo** | Variação média **−10%** em fev/26 vs fev/25; setores mais atingidos: Energia −17,7%, Moda −15,9%, Oficinas −14,0%, Casa e Construção −11,2% | Já está doendo |

### 4.2 O que ele tolera (e por quê)

| Dor tolerada | Evidência de que existe | Evidência de que ele tolera |
|---|---|---|
| Jornada de 9,3 h + 78% trabalhando sábado | Sebrae, Tempo do Empreendedor | Não aparece em nenhuma das 12 edições do Pulso como "dificuldade" |
| Retrabalho / redigitação | Existe na literatura de gestão | **0 ocorrências de "redigit\*", "trabalho repetitivo"; 1 de "duas vezes"; 2 de "três vezes"** em 5.100 comentários |
| Falta de site | 47% das pequenas não têm | Indicador estagnado há 6 anos → ninguém está reclamando disso |
| Processos não estruturados | **25% das médias empresas ainda estão em maturidade de gestão "não estruturada ou emergente"; só 28% são avançadas** (FDC, n=491) | Convivem com isso há décadas — **73% das médias empresas têm mais de 20 anos de mercado** |

**Consequência de projeto — a mais importante deste documento:** a dobra do site **não pode abrir
por uma dor tolerada.** "Trabalho repetitivo" é dor tolerada com 0 ocorrências espontâneas. A dobra
tem que abrir por **cliente perdido no WhatsApp** — que é dor urgente (33%) *e* trabalho repetitivo
(3,9 h/dia) na mesma frase.

---

## 5. O que ele já tentou — e por que falhou

### 5.1 O que ele tem hoje

| Ferramenta | Adoção | Fonte |
|---|---|---|
| Internet | 98% dos pequenos negócios | Sebrae TD 2025 |
| Computador | 76% (EPP 96%, ME 92%, MEI 62%) | Sebrae TD 2025 |
| Aplicativo/software integrativo | **47%** (era 27% em 2018; EPP 78%) | Sebrae TD 2025 |
| **ERP** (empresas 10+ empregados) | **36%** | CGI.br TIC 2025 |
| **CRM** (empresas 10+) | 31% total, **29% pequenas** | CGI.br TIC 2025 |
| Software de finanças/contabilidade em nuvem | 46% | CGI.br TIC 2025 |
| IA | **15% das pequenas** (10+ empregados) | CGI.br TIC 2025 |
| IA (autodeclarado, todos os portes) | **44%** | Sebrae TD 2025 |

> ⚠️ **Os dois números de IA não são comparáveis e a diferença é metodológica, não factual.**
> O Sebrae mede **menção espontânea** e depois estimula com exemplos — quando cita GPS, o número
> vai a **80%**; reconhecimento facial, 77%. Ou seja: o "44%" inclui quem usa Waze. O CGI.br mede
> uso declarado por módulo estruturado em empresas com 10+ empregados via CATI. **Não use "44% dos
> pequenos negócios usam IA" como prova de maturidade.** Se for citar no site, cite o 15%/17%.

### 5.2 Por que falhou — a voz de quem tentou

**Padrão 1 — a promessa não bateu com o produto.**
> *"O Omie diz que tem CRM, mas não tem, diz que tem integração com marketplaces e etc, mas não
> tem, alias, eles possuem sim, mas não funciona."* — Diretor/C-Level, JJ Info
> ([B2B Stack](https://www.b2bstack.com.br/produto/omie))

**Padrão 2 — quem construiu nunca operou.**
> *"Quem desenvolveu, provavelmente nunca trabalho realmente com venda, nunca emitiu uma nota. não
> sabe como é o processo dentro de uma loja que vende online."* — mesmo autor

**Padrão 3 — o preço mudou depois.**
> *"Conta azul tá de sacanagem! Era 100,0 agora meu plano vai para 500,00... Aonde um pequeno
> empresário tem condições de pagar 500 por mês?"*
> ([Smart Planilhas](https://www.youtube.com/watch?v=7vaI_fVM-4w))
> *"preço poderia ser mais adequado a realidade das pequenas empresas"* — Sócio/Proprietário,
> Grupo W&A ([B2B Stack, Agendor](https://www.b2bstack.com.br/produto/agendor))

**Padrão 4 — sumiram na implantação.**
> **"ATRASO E SUMIÇO NA IMPLEMENTAÇÃO"** — reclamação contra a TOTVS
> ([Reclame Aqui](https://www.reclameaqui.com.br/empresa/totvs/lista-reclamacoes/))
> *"Tivemos problemas nas configurações e integrações, patinamos muito para tentar ajustar com o
> suporte mas acabamos por buscar outra ferramenta."* — Analista, BITIS
> ([B2B Stack, Zapier](https://www.b2bstack.com.br/produto/zapier))

**Padrão 5 — a agência não entregou, e ele culpa a si mesmo.**
> *"sou Vera L. de J. Melo, contratei algumas agências de Marketing digital e até agora não
> consegui nada, mais sei que a culpa é minha, não consegui entender como funciona, acho que sou
> rude"* — [Tiago Tessmann](https://www.youtube.com/watch?v=rW_X1ANyZEs)

> *"Nenhum dos prestadores de serviço foram de fato parceiros. Mas claro. Eles não sonham o meu
> sonho."* — [Universidade Ecommerce](https://www.youtube.com/watch?v=H3m9VdZbcIw)

**Padrão 6 — a planilha resiste porque é dele.** No corpus, "planilha"/"excel" aparecem em **441
comentários**, muitos deles celebrando ter conseguido montar a sua:
> *"Foi cansativo, mas consegui fazer a minha planilha. Vai me ajudar muito numa feira de
> artesanato"* · *"consegui fazer minha planilha com sucesso"* · *"minha planilha esta perfeita"*
> — [Excelente João](https://www.youtube.com/watch?v=8vqdRJWJbmo)

A planilha não é uma solução pobre que ele tolera. **É um objeto de orgulho que ele construiu.**
Copy que ataca a planilha ataca o brio dele. Isso não está no `Problema.tsx` hoje e é um risco real.

**Contexto acadêmico:** a literatura brasileira sobre fracasso de ERP (Malanovicz, *Lições
aprendidas em casos de fracasso na implantação de sistemas ERP no Brasil*, RACEF/Fundace) aponta
como causas gestão de projeto e de pessoas, integração, escopo funcional e customizações — não
falha técnica isolada. **Não encontrei taxa percentual de fracasso de ERP em PME brasileira** (§11).

---

## 6. Como ele decide, e quem decide

**O founder respondeu "provavelmente o dono, mas depende do tamanho". O dado confirma — com um
recorte que muda a arquitetura do site.**

### Evidência a favor do dono como decisor único

- **90% das empresas brasileiras têm perfil familiar** (IBGE, citado por CartaCapital); empregam
  75% da força de trabalho e respondem por mais da metade do PIB.
- Empresas familiares de pequeno e médio porte são caracterizadas por **capital fechado e controle
  centralizado** (Sebrae, *Vantagens e desafios na gestão das empresas familiares*).
- A FDC, sobre médias empresas (n = 491), registra **"dependência maior em relação às pessoas do
  que a processos"** e **"falta de informações confiáveis como insumo para tomada de decisão"** —
  isto é: a decisão mora numa cabeça, não num comitê nem num sistema.
- **25% das médias empresas estão em maturidade de gestão não estruturada ou emergente; 47%
  estabelecida; apenas 28% avançada.**

### Evidência contrária (e por que ela não se aplica direto)

A literatura comercial B2B brasileira repete que "a média é de 4 a 6 pessoas envolvidas na decisão,
mesmo em empresas menores". **Não achei fonte primária brasileira com metodologia para esse número**
— ele circula em blogs de ferramentas de venda (Leads2b, Zendesk, Meetime). Tratar como não
verificado. O número análogo com metodologia é do relatório B2B da NN/g já citado no doc 01
(293 sites testados), que estabelece a regra estrutural — projete para o **usuário** e para o
**decisor** — sem cravar quantidade.

### Recorte que muda a arquitetura

Não existe *um* dono de PME. Existem três, e eles decidem diferente:

| Porte | Quem decide | Sinal | O que o site precisa entregar |
|---|---|---|---|
| **MEI** (35% usam IA, 62% têm computador) | Ele, sozinho, no celular | Menor digitalização, maior mortalidade (**29% fecham em 5 anos**) | Não é ICP da Talos. Não gastar dobra com ele |
| **ME** (até R$ 360 mil/ano) | Dono, eventualmente com o cônjuge/sócio | 92% têm computador; 21,6% fecham em 5 anos | Decisão de uma pessoa, ticket baixo, ciclo curto |
| **EPP** (R$ 360 mil–4,8 mi/ano) | Dono + alguém que opera (financeiro, produção) | **96% têm computador, 78% usam software integrativo, menor mortalidade (17%)**, maior jornada do dono (9,9 h) | **ICP real.** Precisa de material que o contato mande pro dono — a regra dos "dois públicos" da NN/g se aplica aqui e só aqui |

**Decisão derivada:** a seção "para mandar pro sócio" só faz sentido se o alvo for EPP. Se o alvo
for ME, ela é peso morto — o leitor **é** o decisor.

---

## 7. Vocabulário — o que afasta, medido

### 7.1 Método

Dividi os 5.100 comentários em dois universos: **A) técnico** (canais e vídeos de n8n, Python,
Power BI, SAP, chatbot, criação de site — 1.742 comentários) e **B) operador de PME** (planilha,
nota fiscal, ERP para leigo, vendas, obra, PCP, gestão — 3.320 comentários). Contei cada termo
**como palavra inteira** e **excluí ocorrências em que o termo já estava no título do vídeo** —
isto é, contei só o que ele **produz**, não o que ele **repete de volta**.

### 7.2 Resultado (universo operador, n = 3.320)

**Palavras que ele produz sozinho:**

| Termo | Ocorrências espontâneas |
|---|---|
| tempo | 67 |
| sistema | 54 |
| cliente / clientes | 48 + 36 = **84** |
| dinheiro | 45 |
| estoque | 38 |
| orçamento | 34 |
| ferramenta | 30 |
| controle | 22 |
| processo / processos | 21 + 6 = **27** |
| software | 18 |
| excel | 16 |
| pedido | 12 |
| errado | 12 |
| caderno | 9 · organizar 9 · sozinho 7 · manual 6 · papel 5 |

**Palavras que ele praticamente não produz:**

| Termo | Ocorrências espontâneas | Razão vs. "tempo" |
|---|---|---|
| integração | 4 | 17× menos |
| automação | 3 | 22× menos |
| automatizar | 3 | 22× menos |
| ERP | **2** | 34× menos |
| CRM | 2 | — |
| inteligência artificial | 2 | — |
| dashboard | 2 | — |
| API | 1 | — |
| chatbot | 1 | — |
| **workflow** | **0** | — |
| **webhook** | **0** | — |
| **KPI** | **0** | — |

**O caso do ERP é instrutivo.** No corpus inteiro, "ERP" aparece 105 vezes — mas **93 delas (89%)
são em comentários sob vídeos cujo título já dizia "ERP"**. Espontâneo: 12 no corpus inteiro, 2 no
universo operador. **ERP não é palavra que ele produz; é palavra que ele devolve.**

Contraste com o universo técnico, por 1.000 comentários: automação 32,1 (vs. 0,9 no operador),
API 21,2 (vs. 0,9), chatbot 13,2 (vs. 0,6), CRM 5,7 (vs. 0,6), workflow 2,9 (vs. 0).
*Ressalva:* "WhatsApp" aparece como se fosse jargão técnico nessa comparação — é artefato, porque o
universo técnico inclui vídeos de automação de WhatsApp. Desconsiderar.

### 7.3 Evidência qualitativa de rejeição a jargão

> *"os profesores de ERP levam 50 minutos explicando o que significa a sigla, um bla bla bla da
> po....., bla bla bla sem fim e ninguem explica nada, por isso eu jamais faço curso online! mas
> seu video foi o primeiro (...) que fez algo simples: citou exemplos de sistema e como usar"*
> (122 curtidas) — [Pluga](https://www.youtube.com/watch?v=soNITNkItP4)

> *"foi um dos poucos vídeos que a mensagem foi clara e objetiva sem 'tecniquês'"* (63 curtidas)
> — [Luciana Papini](https://www.youtube.com/watch?v=A7QYXmZ9hA8)

> *"É por que é 'fácil' para nós que trabalhamos diariamente construindo sites/LPs, mas para o
> cliente leigo é algo de outro mundo."* — [Gabriel Miranda](https://www.youtube.com/watch?v=6-fLPgv2IQg)

**O padrão premiado é o mesmo nos três: exemplo concreto no lugar de definição de categoria.**

### 7.4 Veredito de vocabulário

| Status | Termos |
|---|---|
| 🔴 **Proibido** — zero ou quase-zero produção espontânea | workflow, webhook, KPI, API, no-code, low-code, agente de IA, dashboard, chatbot, CRM |
| 🟠 **Alto risco** — só use depois de explicar com exemplo | automação, automatizar, integração, ERP, inteligência artificial, IA, plataforma, transformação digital |
| 🟡 **Neutro** — ele usa, mas sem carga | sistema, software, ferramenta, processo, controle, organizar |
| 🟢 **Nativo** — a língua dele | tempo, cliente, dinheiro, pedido, orçamento, estoque, nota fiscal, planilha, caderno, papel, na mão, manual, errado, esqueci, perdi, sozinho, minha empresa, meu negócio, minha loja, a gente |

---

## 8. O que isso muda no site — confronto com o código atual

### 8.1 `Hero.tsx`

| Elemento atual | Veredito | Evidência |
|---|---|---|
| Eyebrow: `automação de processos · construção de sites` | 🔴 **CAI.** Abre com a palavra que ele produz 3× em 3.320 comentários | §7.2 |
| H1: `O trabalho repetitivo da sua empresa não precisa de gente.` | 🔴 **CAI.** "trabalho repetitivo" = **0 ocorrências** em 5.100 comentários. "repetitiv\*" = 1 no universo operador | §7.2 · §4.2 |
| Sub: `Eu construo as máquinas que fazem esse trabalho sozinhas — e a primeira delas é o seu site.` | 🟡 **SOBREVIVE.** "eu" é a pessoa certa (§2.1). "máquina" tem 6 ocorrências — baixo, mas concreto e não-jargão | §2.1 |
| CTA: `mapear meu processo` | 🔴 **CAI.** "mapear" = **0 ocorrências** no universo operador, 1 no corpus inteiro. É verbo de consultor | §7.2 |
| Selo: `automatizável` / `3 de 3 etapas automatizáveis` | 🔴 **CAI.** "automatizável" = **0 ocorrências**. "etapa" = 7 | §7.2 |
| HeroPreview: `pedido chega no e-mail` / `alguém copia pra planilha` / `alguém avisa o financeiro` | 🟠 **REESCREVE A PESSOA.** O sujeito é "alguém" (impessoal); ele fala em 1ª pessoa (762 vs 520). Deveria ser "o pedido cai no meu zap / eu jogo na planilha / eu aviso o financeiro" — **e o motor precisa ler isso primeiro** (§2.4) | §2.1 · §2.4 |

**Recomendação de dobra:** trocar o eixo de *trabalho repetitivo* (dor tolerada, 0 ocorrências) para
*cliente que some no WhatsApp* (dor urgente 33% + 3,9 h/dia + 82% do canal de venda). É a única
formulação em que a dor que ele nomeia e a dor que a Talos resolve são a mesma frase.

### 8.2 `Problema.tsx`

| Cena atual | Veredito | Evidência |
|---|---|---|
| **22:14 — "Chega pedido fora do horário"** · *"Ninguém vê até as oito da manhã seguinte — e às vezes ele já resolveu com outro"* | 🟢 **CONFIRMADA E PROMOVIDA A PRIMEIRA.** WhatsApp = 82% do canal de venda; atendimento = 3,9 h/dia; falta de cliente = dor nº 1 (33%). A voz crua confirma o enquadramento: *"o cliente visualizou e não respondeu"*, *"estou esperando ela me responder até hoje, já faz três meses"* | §1-D2 · §2.3 |
| **3× — "A mesma informação, três vezes"** · *"Alguém lê no e-mail, digita no sistema e repete na planilha"* | 🔴 **REFUTADA COMO ABERTURA.** "redigit\*" = 0; "trabalho repetitivo" = 0; "duas vezes" = 1; "três vezes" = 2; "digitar" = 1 em 5.100 comentários. O processo existe (é o que 47% que usam software integrativo compraram), mas **ele não o nomeia** e não o sente como dor. Mantém como cena secundária, nunca como gancho | §4.2 · §7.2 |
| **toda segunda — "A manhã que o relatório come"** | 🟡 **NÃO CONFIRMADA, NÃO REFUTADA.** Não encontrei dado brasileiro sobre tempo gasto com relatório em PME (§11). "relatório" tem presença baixa no corpus. Risco: é uma cena de empresa que já tem alguém para fazer relatório — ou seja, EPP, não ME | §11 |
| Fecho: *"Nenhum desses é problema de tecnologia. São de processo — e processo se automatiza."* | 🟠 **METADE SOBREVIVE.** "processo" é neutro e ele usa (27 espontâneas) — ok. **"automatiza" é alto risco** (3 espontâneas). Reescrever o verbo, manter o substantivo | §7.4 |
| **O que falta inteiramente** | 🔴 **A planilha é orgulho, não vergonha.** 441 comentários mencionam planilha/Excel, muitos comemorando ter feito a sua. Nenhuma cena do `Problema.tsx` respeita isso. Copy que trate planilha como atraso ofende o leitor | §5.2-Padrão 6 |
| **O que falta inteiramente** | 🔴 **Dívida e caixa.** 28% com dívida em atraso (recorde da série), faturamento −10% a/a. Nenhuma cena toca no dinheiro — que é a palavra nº 4 mais produzida (45 ocorrências) | §4.1 |

### 8.3 `CasosDeUso.tsx`

O comentário no topo do arquivo diz: *"O dono de metalúrgica se reconhece em 'a ordem de produção
que alguém redigita do e-mail para o ERP'."* **A pesquisa contradiz duas coisas nessa frase:**
"redigita" = 0 ocorrências, e "ERP" = 2 espontâneas no universo operador.

| Aba | Veredito |
|---|---|
| **Indústria** | 🟠 Boa cobertura, língua errada em 2 de 4 itens. "Pedido chega por e-mail ou WhatsApp e alguém redigita no ERP" → trocar "redigita no ERP" por "passa pro sistema". Falta o item que a CNI e a FDC dizem ser o nº 1: **mão de obra qualificada** (85% das médias industriais). Uma linha do tipo *"a pessoa que sabe fazer isso é uma só — e quando ela falta, para"* casaria com dado real |
| **Comércio** | 🟢 O melhor conjunto. "Orçamento pedido no WhatsApp fora do horário e respondido no dia seguinte" é a linha com mais lastro do site inteiro. "Estoque" é palavra nativa (38 espontâneas), "orçamento" também (34) |
| **Serviços** | 🟡 Plausível, sem lastro no corpus. Não encontrei voz crua de clínica/escritório (§11) — o único vídeo de gestão de clínica capturado tinha 3 comentários |
| **Projeto e obra** | 🟡 Plausível, lastro parcial. "obra" é nativa (83 menções no universo operador). Mas o corpus de obra que capturei é de **engenheiro**, não de dono de construtora — falam de cronograma e curva ABC, não de "foto que alguém precisa renomear" |
| Rodapé: *"O mapa da seção anterior lê qualquer processo em texto livre"* | 🔴 **É promessa falsa hoje.** Em frases de 1ª pessoa o motor perde 2 de 5 etapas; "meu negócio" cai em decisão humana; 42,6% das frases reais do corpus caem em `indefinida`. **Corrigir o dicionário antes de manter essa frase no ar** |

### 8.4 Correções de código derivadas (prioridade)

**P0 — dicionário de `mapear.ts`:**
1. Adicionar todas as formas de 1ª pessoa singular listadas em §2.4 (`confiro`, `verifico`, `checo`,
   `anoto`, `lanço`, `jogo na planilha`, `mando pro`, `passo pro`, `salvo`, `guardo`, `organizo`,
   `respondo`, `atendo`, `entrego`, `monto`, `emito`, `gero`, `cobro`, `aviso`, `retorno`…).
2. **Remover `'negoci'`** ou substituir por `'negocia'` + `'negociar'` — hoje 92% dos disparos são o
   substantivo "negócio" e ele joga a etapa para "fica com você".
3. Trocar `'cola'` por `'cola '` / `'colar'` / `'colei'` (casa em *escola*, 28 ocorrências);
   `'guarda'` → `'guardar'`/`'guardo'`/`'guardei'` (casa em *aguardando*);
   `'carrega'` → `'carregar'`/`'carrego'` (casa em *encarregado*).
4. Exigir fronteira de palavra no matching (`(?<![a-zà-ú])termo`) em vez de `indexOf` cru.

**P1 — desempate:** hoje ganha o termo de menor índice na frase. Isso mascarou o bug de `monta`
(§2.4, achado 4). Considerar peso por especificidade do termo, não só posição.

**P2 — copy do exemplo:** o `EXEMPLO` do site está em 3ª pessoa e **ensina o visitante a escrever
errado para o motor**. Depois de corrigir o dicionário, reescrever em 1ª pessoa — que é a forma
natural dele — e usar isso como prova de que o motor entende a língua dele.

---

## 9. Recomendações objetivas para a próxima etapa

1. **Trocar o eixo da dobra:** de "trabalho repetitivo" (0 ocorrências, dor tolerada) para
   "cliente que chega no WhatsApp e some" (33% dor nº 1, 82% do canal, 3,9 h/dia).
2. **Reescrever toda a copy de exemplo em 1ª pessoa do singular**, com "a gente" como segunda voz.
   Banir "alguém".
3. **Corrigir o dicionário antes de publicar a promessa "lê qualquer processo".**
4. **Definir o porte-alvo.** EPP e ME decidem diferente (§6). A seção "para mandar pro sócio" só
   existe se o alvo for EPP.
5. **Não atacar a planilha.** Posicionar como "a planilha continua sendo sua — ela só para de ser
   digitada por você".
6. **Substituir vocabulário 🔴 e 🟠** por exemplo concreto: a evidência de §7.3 é que o que ganha
   elogio é "citou exemplos de sistema e como usar", não a definição da categoria.
7. **Adicionar uma cena de dinheiro.** Dívida em atraso 28% (recorde da série), faturamento −10% a/a,
   "dinheiro" é a 4ª palavra mais produzida. O site inteiro hoje não fala de dinheiro do cliente.

---

## 10. O que fica em aberto para o founder decidir

1. **Porte-alvo:** MEI está fora (mortalidade 29%, 62% têm computador). Entre ME e EPP, a diferença
   muda a arquitetura da página. Não dá para atender os dois na mesma dobra.
2. **Setor-âncora:** o comércio tem a melhor aderência de linguagem e o pior gasto em TI (4,8% do
   faturamento); a indústria tem a maior dor declarada (85% mão de obra) e a menor digitalização.
3. **Se a dobra virar WhatsApp**, o produto de entrada declarado ("site") precisa ser reposicionado
   como *a máquina que atende*, não como *presença digital* — senão a promessa e a entrada
   descolam.

---

## 11. Lacunas — o que procurei e não achei

| # | O que procurei | Resultado | Impacto |
|---|---|---|---|
| L1 | Métrica brasileira de **horas/mês gastas com retrabalho ou redigitação** em PME | **Não encontrado.** Nenhum instituto mede isso | A cena "3×" do `Problema.tsx` fica sem lastro quantitativo, além de sem lastro linguístico |
| L2 | Metodologia completa da pesquisa Sebrae **"Tempo do Empreendedor"** (n, campo, método) | **Não encontrado** nas fontes públicas acessíveis. Os números (9,3 h, 3,9 h, 78%) só aparecem em cobertura de imprensa | Os números mais úteis do documento estão em fonte secundária. Recomendo confirmar com o Sebrae antes de usar no site |
| L3 | Metodologia da **Sebrae Transformação Digital 2025** (n, campo, parceiros) | **Não encontrado.** As matérias citam FGV/IBRE e Google como parceiros, mas nenhuma publica n nem período | O "44% usam IA" é citável só com a ressalva de §5.1 |
| L4 | **Taxa percentual de fracasso de implantação de ERP em PME brasileira** | **Não encontrado.** Só estudos de caso qualitativos (Malanovicz/RACEF, RARR) | Não dá para dizer "X% dos projetos de ERP falham" no site |
| L5 | **Dado brasileiro com metodologia sobre número de decisores em compra B2B de PME** | **Não encontrado.** O "4 a 6 pessoas" circula só em blog de fornecedor de CRM | §6 fica apoiada em estrutura (empresa familiar, controle centralizado), não em contagem |
| L6 | Voz crua de **dono de clínica, escritório e consultoria** | **Quase nula.** Os vídeos do segmento capturados têm 3 e 0 comentários | A aba "Serviços" do `CasosDeUso.tsx` continua sendo hipótese |
| L7 | Voz crua de **dono de construtora** (o corpus de obra é de engenheiro/PCP) | **Parcial** | A aba "Projeto e obra" continua sendo hipótese |
| L8 | **Reddit BR** (r/empreendedorismo etc.) | **Bloqueado — HTTP 403** em `reddit.com` e `old.reddit.com`, com e sem User-Agent. O IP desta máquina está marcado | Perdi a fonte com o melhor sinal de desabafo anônimo. Vale tentar de outro IP |
| L9 | **Reclame Aqui em escala** | **Parcial.** A API `iosearch` devolveu 200 na primeira chamada e 403 depois. Ficaram 5 reclamações da TOTVS | A amostra de falha de fornecedor é fina; o padrão foi confirmado por triangulação com B2B Stack |
| L10 | **Volume de busca real** (Google Trends / Keyword Planner) para "sistema de gestão" vs "ERP" vs "automação" | **Não obtido** — Trends é JS-only e não há acesso a Keyword Planner | O veredito de vocabulário (§7) usa produção espontânea em corpus, que é um proxy, não volume de busca. É um proxy bom, mas é proxy |
| L11 | Grupos de Facebook / WhatsApp de empresários | **Não acessível** sem autenticação | — |
| L12 | Recorte da **TIC Empresas para empresas com menos de 10 empregados** | **Não existe.** A população-alvo da pesquisa é "empresas com 10 pessoas empregadas ou mais" | Todo número do CGI.br neste documento exclui a maior parte das MEs e todos os MEIs |

---

## 12. Fontes

| # | Fonte | Tipo | Data | Por que é confiável |
|---|---|---|---|---|
| 1 | [Sebrae — Pulso dos Pequenos Negócios, 12ª edição (PDF)](https://static.poder360.com.br/2026/04/Pulso-dos-Peq-Neg-12-ed_Principais-Resultados-v4.1.pdf) | Survey institucional | campo 19/02–18/03/2026 | n=8.273, 26 UF+DF, erro 1,1%, IC 95%, ponderado por UF e porte. Metodologia publicada na p.2. Série de 12 edições comparáveis |
| 2 | [CGI.br/NIC.br — TIC Empresas 2025, principais resultados (PDF)](https://cetic.br/media/analises/TIC-Empresas-2025-lancamento.pdf) | Survey oficial | campo fev/2025–jan/2026, lançado 15/06/2026 | n=4.174, CATI, população-alvo definida, série histórica desde 2017, microdados públicos |
| 3 | [CGI.br — TIC Empresas 2024, resumo executivo (PDF)](https://cetic.br/media/docs/publicacoes/2/20250512121759/tic_empresas_2024_resumo_executivo.pdf) | Survey oficial | 2025 | Edição anterior da mesma série |
| 4 | [Cetic.br — indicadores TIC Empresas](https://cetic.br/pt/pesquisa/empresas/indicadores/) | Base de indicadores | contínua | Tabelas por porte e setor |
| 5 | [Sebrae/ASN — Transformação Digital 2025: uso de IA](https://agenciasebrae.com.br/inovacao-e-tecnologia/de-gps-a-chat-gpt-maioria-dos-pequenos-negocios-abraca-a-inteligencia-artificial-para-aumentar-resultados/) | Divulgação de pesquisa | 2025 | Agência oficial do Sebrae; percentuais por porte, escolaridade, gênero. Metodologia não publicada (L3) |
| 6 | [Sebrae/ASN — Digitalização recorde 2025](https://agenciasebrae.com.br/inovacao-e-tecnologia/digitalizacao-recorde-pequenos-negocios-no-brasil-atingem-nivel-historico-em-2025/) | Divulgação de pesquisa | 2025 | Fonte dos indicadores de computador (76%), internet (98%), software integrativo (47%) |
| 7 | [Sebrae/PR — Pesquisa TIC 2025](https://sebraepr.com.br/impulsiona/pesquisa-tic-2025-transformacao-digital-nos-pequenos-negocios/) | Síntese regional | 2025 | Recorte setorial (indústria 75,6%, construção 75,9%, agro 59,3%) |
| 8 | [DataSebrae — Transformação Digital](https://datasebrae.com.br/transformacao-digital/) | Portal de dados | atualização prevista 30/08/2026 | Série 2015–2025, parceria Sebrae-NA + FGV/IBRE + Google |
| 9 | [CNN Brasil — 44% dos pequenos negócios usam IA](https://www.cnnbrasil.com.br/economia/macroeconomia/44-dos-pequenos-negocios-usam-inteligencia-artificial-diz-sebrae/) | Imprensa sobre pesquisa | jun/2025 | Cobertura independente do mesmo estudo, útil para triangular o número |
| 10 | [Exame — Quase metade dos empreendedores reclama de falta de tempo](https://exame.com/pme/quase-metade-dos-empreendedores-reclama-de-falta-de-tempo-para-empresa/) | Imprensa sobre pesquisa Sebrae-SP | jan/2022 | Fonte do "45% dizem faltar tempo" e das 9,3 h |
| 11 | [Diário da Região — Empreendedores trabalham mais de 9 horas por dia](https://www.diariodaregiao.com.br/economia/empreendedores-que-gerenciam-seu-negocio-trabalham-mais-de-9-horas-por-dia-1.837030) | Imprensa sobre Sebrae *Tempo do Empreendedor* | dez/2021 | Quebra por porte (9,2/9,7/9,9 h), sábado 78%, domingo 33%, atendimento 3,9 h |
| 12 | [Startupi — Estudo FDC revela desafios de produtividade em médias empresas](https://startupi.com.br/estudo-revela-desafios-em-medias-empresas/) | Divulgação de pesquisa acadêmica | 2025 | FDC/Centro de Inteligência em Médias Empresas, n=491, 3 macrossetores, EBITDA/colaborador como métrica |
| 13 | [Ásense — Caos na gestão: médias empresas brasileiras](https://asense.com.br/2235-2/) | Análise sobre o mesmo estudo FDC | 2025 | Fonte dos 73% com 20+ anos e da distribuição de maturidade (25%/47%/28%) |
| 14 | [FDC — Relatórios de pesquisa](https://www.fdc.org.br/conhecimento/publicacoes/relatorio-de-pesquisa-24170) | Instituição de pesquisa | contínua | Sede institucional dos estudos citados |
| 15 | [CNI — Sondagem Especial Indústria 4.0, cinco anos depois (PDF)](https://static.portaldaindustria.com.br/media/filer_public/7d/d9/7dd92b31-8860-4ca7-b921-b28fec0a68bc/sondespecial_industria40_cincoanosdepois_abril2022.pdf) | Survey setorial | abr/2022 | Barreiras: custo 66%, mão de obra 37%. **Dado de 2021 — mais antigo do documento** |
| 16 | [CNI — 69% das indústrias usam tecnologia digital](https://noticias.portaldaindustria.com.br/noticias/inovacao-e-tecnologia/industria-40-69-das-industrias-brasileiras-fazem-uso-de-tecnologia-digital-no-brasil/) | Divulgação CNI | 2022 | Fonte do "31% não adotaram nenhuma; só 7% adotam 10+" |
| 17 | [CNI — Carga tributária e mão de obra no Custo Brasil](https://noticias.portaldaindustria.com.br/noticias/politica-industrial/para-70-dos-empresarios-carga-tributaria-e-o-maior-problema-do-custo-brasil-revela-pesquisa-inedita-da-cni/) | Survey CNI | set/2025 | Tributo 70%, mão de obra qualificada 62%, financiamento 27% |
| 18 | [CNI — Sondagem Especial (índice)](https://www.portaldaindustria.com.br/cni/estatisticas/sondagem-especial/) | Série estatística | contínua | Metodologia publicada por edição |
| 19 | [FGV EAESP — 36ª Pesquisa Anual do Uso de TI (PDF, 204 pp.)](https://eaesp.fgv.br/sites/eaesp.fgv.br/files/u68/pesti_fgvcia_2025.pdf) | Survey acadêmico | 2025 | 36 edições anuais; gasto em TI % do faturamento líquido 2024: média 10,0%, comércio 4,8%, indústria 5,4%, serviços 14,8%. **Viés para médias/grandes** |
| 20 | [Contábeis — Brasil é o país onde empresas mais gastam tempo com obrigações acessórias](https://www.contabeis.com.br/noticias/69103/brasil-e-o-pais-onde-empresas-mais-gastam-tempo-com-obrigacoes-acessorias/) | Imprensa especializada sobre IBPT/IDV | 2025 | Fonte do 97 obrigações e do comparativo internacional |
| 21 | [Jornal Contábil — 1.958 horas/ano com burocracia](https://www.jornalcontabil.com.br/pesquisas-apontam-que-empresas-gastam-1-958-horas-por-ano-com-burocracia-e-tributos/) | Imprensa especializada | — | Cita Banco Mundial 2018 e IBPT (3.790 normas, 30 novas/dia). **Dado de 2018, indicador descontinuado** |
| 22 | [Fecomercio — Burocracia custa R$ 79 bilhões/ano às PMEs](https://www.fecomercio.com.br/noticia/burocracia-custa-r-79-bilhoes-por-ano-as-pequenas-e-medias-empresas-nacionais) | Federação empresarial | — | Estimativa de custo agregado |
| 23 | [Sebrae — Sobrevivência das Empresas no Brasil (PDF)](https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/06d11457d15140966a4e33ee19a31991/$File/5607.pdf) | Estudo com base em RFB | série 2017–2022 | Base cadastral completa, não amostra |
| 24 | [Sebrae/ASN RJ — MEIs têm a maior taxa de mortalidade](https://rj.agenciasebrae.com.br/cultura-empreendedora/pesquisa-do-sebrae-aponta-que-microempreendedores-individuais-tem-a-maior-taxa-de-mortalidade-no-brasil/) | Divulgação Sebrae | — | Mortalidade em 5 anos: MEI 29%, ME 21,6%, EPP 17%; comércio 30,2% |
| 25 | [Sebrae — Vantagens e desafios na gestão das empresas familiares](https://sebrae.com.br/sites/PortalSebrae/ufs/am/artigos/vantagens-e-desafios-na-gestao-das-empresas-familiares,5d776f10703bd810VgnVCM1000001b00320aRCRD) | Conteúdo institucional | — | Caracterização de controle centralizado em PME familiar |
| 26 | [CartaCapital — Pequenas empresas familiares impulsionam o PIB](https://www.cartacapital.com.br/do-micro-ao-macro/pequenas-empresas-familiares-impulsionam-o-pib-e-enfrentam-desafios-para-sobreviver/) | Imprensa citando IBGE | — | Fonte do "90% das empresas são familiares" |
| 27 | [Malanovicz — Lições aprendidas em casos de fracasso na implantação de ERP no Brasil (RACEF/Fundace)](https://racef.fundace.org.br/index.php/racef/article/view/636) | Artigo acadêmico revisado | 2021 | Análise de conteúdo de casos brasileiros; qualitativo, sem percentual |
| 28 | [B2B Stack — perfil Omie](https://www.b2bstack.com.br/produto/omie) | Reviews B2B verificados | 2022–2023 | Avaliações com cargo e empresa declarados; equivalente brasileiro do G2 |
| 29 | [B2B Stack — perfil Agendor](https://www.b2bstack.com.br/produto/agendor) · [Zapier](https://www.b2bstack.com.br/produto/zapier) · [Conta Azul](https://www.b2bstack.com.br/produto/conta-azul) · [Pipedrive](https://www.b2bstack.com.br/produto/pipedrive) · [Nibo](https://www.b2bstack.com.br/produto/nibo) | Reviews B2B | 2019–2025 | 45 avaliações raspadas; usadas para triangular padrões de objeção |
| 30 | [Reclame Aqui — TOTVS](https://www.reclameaqui.com.br/empresa/totvs/lista-reclamacoes/) | Reclamações públicas | jul/2026 | 3.732 reclamações registradas; amostra de 5 extraída (L9) |
| 31 | Corpus YouTube — 67 vídeos, 5.100 comentários | Voz crua espontânea | 2018–2026 | Coletado com `yt-dlp` para esta pesquisa. Vídeos-chave citados no corpo: [Thiago Concer](https://www.youtube.com/watch?v=B337-JzY6wc) · [Pluga/ERP](https://www.youtube.com/watch?v=soNITNkItP4) · [Ecommerce Free/ERP](https://www.youtube.com/watch?v=tg6MPXgXOMQ) · [Excelente João/planilha](https://www.youtube.com/watch?v=8vqdRJWJbmo) · [Universidade Ecommerce/NF](https://www.youtube.com/watch?v=jxkAlcKwpLY) · [Guilherme Machado/WhatsApp](https://www.youtube.com/watch?v=Umxjo4W0iAE) · [Tiago Tessmann/agência](https://www.youtube.com/watch?v=rW_X1ANyZEs) · [Larissa Kich/preço de site](https://www.youtube.com/watch?v=WXfxCQrDjg4) · [Sensio/PCP indústria](https://www.youtube.com/watch?v=XmMyt71xWsI) · [EAG/gestão de processos](https://www.youtube.com/watch?v=kaNYre2h8Hk) |
| 32 | `apps/talos/lib/mapear.ts` | Código do próprio projeto | 2026 | Objeto do teste da §2.4 |

---

*Documento produzido por Atlas (@analyst) em 28/07/2026. Sem entrevista de campo — ver §0.*
