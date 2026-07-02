# Conclave R2 — Martin Fowler (Adversarial Round)

> R1 recap: (A) partida dobrada append-only, inequívoca; (C) single-stack Postgres com costura de posting-RPC, Formance rejeitado por ora. Flag de fraqueza própria: a "cauda longa contábil" e o cenário fintech.
> Esta rodada: Heleno injetou direito posto que minha otimização single-stack precisa **absorver de verdade** — eliminação intercompany rastreável, DDL, preços de transferência (Lei 14.596/2023), regime/anexo por entidade, livros segregados como defesa jurídica, IBS/CBS, CNPJ alfanumérico-string. Vou atacar meu próprio consenso onde ele é mais frágil.

---

## Attack

Vou fazer o trabalho que ninguém aqui fez: **steelman do Formance usando o Heleno como munição contra mim mesmo.** Werner e eu construímos um consenso confortável — "Postgres absorve a complexidade, Formance só a realoca pro gap entre dois sistemas." O voto do Heleno é a primeira coisa nesta sala que ameaça esse consenso de verdade, e eu fui desonesto comigo em R1 ao tratar a cauda contábil como uma nota de rodapé ("admito que é mais longa que 5 tabelas"). Vou destrinchar.

**O ataque mais forte contra minha posição não é "Postgres não aguenta" — é "a complexidade que o Heleno descreveu não é de ledger, é de modelagem de domínio, e Formance NÃO resolve nada dela."** Deixe-me ser brutal com os dois lados.

### 1. A cauda do Heleno quebra meu "~5 tabelas, invariante simples"? Parcialmente sim — e é importante admitir onde.

Listei em R1 "~5 tabelas e uma RPC de posting". Isso era otimismo. A lista do Heleno adiciona, no mínimo:

- **`regime_tributario` + `anexo` por entidade** — não é tabela nova, é coluna em `company`, mas governa *qual* obrigação acessória e *qual* layout de export se aplica. Barato. Não move a agulha do Formance.
- **`intercompany` flag + contraparte por lançamento** — coluna em `journal_entry` (`is_intercompany`, `counterparty_company_id`). Barato no schema. **Caro na semântica.**
- **Eliminação intercompany com "antes/depois" rastreável** — esta é a que dói. Não é uma coluna; é uma *operação de consolidação* que precisa: (a) identificar pares de lançamentos intercompany entre os 3 CNPJs, (b) casá-los (a receita de A contra a despesa de B), (c) produzir um conjunto de *lançamentos de eliminação* que zeram o par no nível grupo, (d) preservar o "antes" (livros individuais intactos) e o "depois" (visão consolidada) como **dois estados auditáveis e reconciliáveis**.
- **Competência ≠ caixa** como campos distintos — `accrual_date` vs `cash_date`. Coluna. Barato. Mas reintroduz a noção de *fechamento de período por competência*, que é justamente uma das "features de ledger" que eu disse no MVP que podíamos pular.
- **Campos IBS/CBS capturados separadamente** + lastro fiscal cru linkado — tabela `fiscal_document` adjacente ao ledger, com campos duais. Não é ledger, é ingestão. Barato-médio.
- **CNPJ como string com DV alfanumérico** — trivial, e eu errei em não ter cravado isso em R1. É `varchar` + validador, dia 1. Inegociável e barato.

**Veredito honesto do ataque:** "~5 tabelas" estava errado por *minimização retórica*. O número real é mais perto de 8-10 tabelas e — crucialmente — **a eliminação intercompany é a primeira coisa neste projeto que NÃO é "invariante simples enforçável por CHECK".** É um algoritmo de consolidação com correção contábil própria. Concedo o ponto: minha estimativa de esforço de R1 foi otimista, e fui preguiçoso ao empacotar isso em "long tail" sem olhar pra dentro.

### 2. MAS — e aqui o ataque vira contra o Formance — nada disso é o que o Formance faz.

Agora o steelman ao contrário, que é o teste decisivo. Pergunta certa: **das coisas que o Heleno adicionou, quantas o Formance/Numscript resolveria pra mim?**

- Eliminação intercompany com antes/depois? **Não.** Formance é um ledger de *postings atômicos balanceados*. Ele não tem conceito de "grupo econômico", "perímetro de consolidação art. 249", ou "eliminação de partes relacionadas". Eu teria que modelar exatamente a mesma lógica de consolidação *por cima* do Formance — e agora num segundo sistema, sem o `JOIN` transacional contra a tabela `company` e o CoA que vivem no Supabase.
- DDL / preço de transferência / radar de partes relacionadas? **Não.** Isso é flagging de domínio: marcar transações intercompany e alimentar um alerta. Formance não tem opinião sobre Lei 14.596/2023. É lógica de aplicação que eu escrevo de qualquer jeito.
- Regime/anexo por entidade, segregação por `company_id` como defesa de confusão patrimonial? **Não — e aqui Formance até atrapalha.** A defesa jurídica do Heleno é "livros separados por CNPJ com RLS provam segregação patrimonial". No Supabase isso é RLS por `company_id` na mesma base. No Formance, a segregação vira "um ledger por empresa" (Formance suporta múltiplos ledgers nomeados) — *mas a prova de segregação patrimonial agora vive num sistema separado do RLS LGPD, do CoA e do lastro fiscal.* A peça de defesa jurídica fica **fragmentada entre dois stores**, que é exatamente o oposto do que o Heleno quer (uma cadeia auditável coerente).
- IBS/CBS, CNPJ alfanumérico, NFS-e Nacional? **Não, e é ortogonal.** Isso é ingestão de documento fiscal. Formance é indiferente.

**Conclusão do ataque, e é a descoberta desta rodada:** a cauda do Heleno *aumenta* o custo de modelagem (concedo a Werner e a mim que subestimamos), mas ela **aumenta igualmente — ou mais — no Formance**, porque toda essa lógica é *domínio brasileiro de grupo econômico* que nenhum ledger genérico modela, e colocá-la num segundo sistema custa o `JOIN` transacional que é justamente o que torna a eliminação *rastreável e auditável numa transação só*. O Heleno, sem querer, **fortaleceu o single-stack**: ele exige "antes/depois rastreável" e "cadeia auditável coerente entre livro financeiro, CoA, lastro fiscal e RLS" — e isso é mais fácil de garantir em uma base ACID do que entre duas.

O ataque que eu temia (cauda longa → Formance) **falha**. A cauda longa é real, mas é cauda de *domínio*, não de *infra de ledger*. Formance resolve o problema que a ENIAC não tem (postings programáveis em alto volume) e não resolve nenhum dos que o Heleno levantou.

### 3. O ataque que SOBREVIVE: o reframe "export ou ledger?" muda o ESCOPO da dupla entrada no MVP.

Este é o golpe do Heleno que eu *não* posso refutar, e ele muda minha posição mais do que qualquer coisa nesta sala. O "Where I could be wrong" #1 dele: *"o contador quer um export reconciliável ou um livro?"*

Em R1 eu argumentei dupla entrada como **fundação inegociável** com o argumento da assimetria ("migrar caixa→dupla entrada com 18 meses de dados é cirurgia de coração aberto"). Esse argumento continua válido para a *estrutura de dados*. Mas o Heleno expôs que eu confundi duas coisas:

- **A estrutura de armazenamento** (dupla entrada append-only) — fundação, inegociável, concordo comigo de R1.
- **O escopo funcional** (ser "a contabilidade" vs ser "fonte financeira de verdade reconciliável") — e *aqui* eu estava implicitamente sobre-escopando.

O reframe muda o MVP assim: a dupla entrada no MVP **não precisa ser uma escrituração ECD/ECF completa** (CoA fiscal completo, fechamento de período, razões auxiliares, demonstração consolidada societária). Ela precisa ser o **lastro financeiro append-only, balanceado, segregado por CNPJ, com lançamentos de eliminação intercompany marcados e exportável num layout reconciliável** que o contador casa com a ECD que *ele* assina. Isso é *menos* do que eu deixei no ar em R1 ("CoA por empresa com mapeamento consolidado") e *mais* preciso: a consolidação é **view gerencial rotulada com disclaimer**, nunca peça societária.

Ou seja: o reframe do Heleno **encolhe** a ambição do MVP (não somos a contabilidade) ao mesmo tempo que **adiciona** rigor de modelagem (eliminação rastreável, segregação como defesa). As duas coisas juntas *reforçam* o single-stack: um "export reconciliável com lastro auditável" é precisamente um caso de leitura sobre uma base ACID única — pôr um Formance no meio só adiciona uma fronteira de consistência entre o lastro e o export. **Se o produto é fundamentalmente um motor de reconciliação + export + radar, e não um banco de movimentação de dinheiro, a justificativa do Formance evapora ainda mais do que em R1.**

### Onde eu ainda concedo que um core mais pesado (não Formance) ganha espaço

Sendo intelectualmente honesto: a eliminação intercompany com "antes/depois" e o fechamento por competência **não cabem na minha frase de R1 "invariante simples enforçável por CHECK".** Isso não pede Formance — pede *disciplina de modelagem* que eu minimizei. O "core mais pesado" que eu concedo é:
- uma camada de **consolidação como conjunto de lançamentos de eliminação derivados e versionados** (não um SELECT SUM ingênuo), com sua própria suíte de testes de correção contábil (o par intercompany zera; o grupo não infla receita);
- competência vs caixa modelados desde o dia 1 (não retrofit).

Isso é "heavier ledger core" no sentido de *mais lógica de domínio testada*, dentro do mesmo Postgres — não "heavier ledger *infrastructure*" (Formance/TigerBeetle). A distinção é o ponto inteiro.

---

## Update

**Quem mudou minha cabeça e como:**

- **Heleno — mudou de verdade, em dois eixos.** (1) Meu "~5 tabelas, invariante simples" era minimização desonesta; a eliminação intercompany rastreável é a primeira peça do projeto que é *algoritmo de consolidação com correção própria*, não constraint. Subi minha estimativa de esforço e adicionei testes de correção contábil de consolidação como item de primeira classe. (2) O reframe "export ou ledger?" me fez separar **estrutura de armazenamento** (dupla entrada, inegociável) de **escopo funcional** (não-somos-a-contabilidade), o que eu havia embaçado. Isso *encolhe* a ambição do MVP e *aumenta* o rigor de segregação — net-net, reforça o single-stack, não o Formance. Concedo também o CNPJ-string-alfanumérico como erro de omissão meu em R1.

- **Werner — confirmou, não mudou.** O argumento dele de dual-write/outbox e DR cross-store é o complemento operacional exato do meu argumento de acoplamento de consistência. A novidade que ele me deu: a *prova de segregação patrimonial* (defesa jurídica do Heleno) é mais um ativo que você teria que restaurar a um ponto-no-tempo *consistente* entre dois stores. Adiciona peso ao single-stack sob a ótica de defesa legal, não só de uptime.

- **Simon — mudou minha cabeça sobre ONDE mora o risco residual do meu próprio veredito B-adjacente.** Ele cravou que "predefined tools garante o SQL certo, não que o SQL certo foi chamado com os args certos". Isso bate direto na minha RPC `post_entry`: a costura de posting garante que *toda escrita é balanceada*, mas não garante que a *conta* certa do CoA por empresa, o `company_id` certo, ou o flag `intercompany` certo foram passados. **A correção contábil mora na extração de argumentos da posting, não na constraint.** Vou incorporar: a RPC valida balanceamento (banco) *e* valida que `company_id` da linha bate com a entidade do documento, que intercompany exige contraparte preenchida, que competência e caixa são ambos presentes. Isso é mitigação que eu não tinha explicitado.

- **Cassie — não muda A/C, mas muda meu ADR.** O ponto dela de que prov2eniência/freshness/confiança precisam viajar com o número até a tela reforça por que o lastro cru (linha OF, NF-e) tem que estar *linkado na mesma base* que o lançamento — outro prego no single-stack. Um número consolidado que esconde "company B não sincronizou há 14h" é o Sev-1 dela; com dois stores, a freshness do ledger e a freshness do app divergem por construção.

**Resumo:** ninguém me moveu em A ou C na *direção* — fui movido em *precisão e honestidade de esforço*. Minha posição saiu mais forte porque o teste mais sério (Heleno) atacou o eixo errado para derrubar o single-stack.

---

## Final A

**Partida dobrada append-only. Mantida, inequívoca — agora com escopo cirurgicamente cortado pelo reframe do Heleno.**

- **Estrutura de armazenamento:** dupla entrada append-only é fundação inegociável. O argumento da assimetria de R1 (caixa→dupla entrada depois = rewrite doloroso) sobrevive intacto. Aqui eu *não* cedo.
- **Escopo funcional (revisado):** o ledger é a **fonte financeira de verdade reconciliável**, não a escrituração ECD/ECF oficial. Não somos "a contabilidade do grupo". A consolidação é **view gerencial rotulada com disclaimer**, com eliminação intercompany rastreável, jamais peça societária do art. 249.
- **Implicações de modelagem concretas (absorvendo o Heleno):**
  1. `company.regime_tributario` + `company.anexo` por entidade; alíquota nunca global.
  2. **Segregação por `company_id` desde o lançamento** (RLS), CoA por empresa — esta é a defesa de confusão patrimonial/desconsideração (CTN art. 50, 124 I), não só uma escolha técnica.
  3. `journal_entry` append-only com `reverses_entry_id` (estorno, nunca update); `is_intercompany` + `counterparty_company_id`.
  4. `accrual_date` ≠ `cash_date` como campos distintos desde o dia 1.
  5. **Consolidação = conjunto de lançamentos de eliminação derivados e versionados** ("antes/depois" auditável), com testes de correção contábil (par intercompany zera; grupo não infla receita/despesa). Esta é a peça que eu **deixo de chamar de "invariante simples"** — é algoritmo de domínio testado.
  6. `fiscal_document` adjacente com campos **IBS/CBS capturados separadamente** + lastro cru (NF-e/NFS-e) linkado ao lançamento.
  7. **CNPJ como `varchar` com validador de DV alfanumérico** desde o dia 1 (IN RFB 2.229/2024). Erro de omissão meu em R1, corrigido.
  8. Flag intercompany alimenta **radar de DDL/preço-de-transferência como alerta para humano**, nunca recomendação de movimentação (o copiloto sinaliza, não aconselha — respeitando o limite do Heleno e do ato privativo do contador).

## Final C

**Ledger de partida dobrada DENTRO do Supabase Postgres, atrás de uma RPC de posting única. Formance rejeitado para o dia 1 — e a cauda do Heleno fortaleceu, não enfraqueceu, essa posição. Mantida com convicção *aumentada*.**

A descoberta desta rodada: a complexidade que eu temia que empurrasse pro Formance é **complexidade de domínio brasileiro de grupo econômico** (eliminação intercompany, DDL, segregação como defesa, IBS/CBS), e **Formance não modela nada disso.** Colocá-la num segundo store custa exatamente o `JOIN`/transação ACID que torna a eliminação *rastreável* e a segregação *uma cadeia auditável coerente* — os dois requisitos que o Heleno declarou inegociáveis. Formance resolveria o problema que a ENIAC não tem (postings programáveis, alto volume) e nenhum dos que ela tem.

**Como a RPC de posting + schema absorvem intercompany + segregação SEM Formance:**
- **Segregação:** RLS por `company_id` + CoA por empresa na mesma base. A prova de segregação patrimonial é uma propriedade *enforçada pelo banco*, restaurável a um ponto-no-tempo único (não skew entre dois stores).
- **Intercompany:** a RPC `post_entry` exige, para `is_intercompany=true`, contraparte preenchida e valida balanceamento na transação. A eliminação é um *segundo conjunto de lançamentos derivados* sobre os livros segregados, dentro do mesmo Postgres — "antes" (livros individuais) e "depois" (consolidado eliminado) são dois estados na mesma base ACID, ambos auditáveis num `JOIN`.
- **Costura preservada:** a RPC `post_entry` continua sendo o *único* caminho de escrita = a seam de strangler fig. Se um dia a ENIAC virar movimentação de dinheiro programável em escala (meu único cenário de cessão, de R1), reimplementa-se o *corpo* da RPC para escrever num ledger dedicado. A porta do Formance fica documentada no ADR, destravada pela seam — não paga antecipado.

**Onde eu concedo um core mais pesado (mas NÃO Formance):** a consolidação com eliminação rastreável e a competência≠caixa são *lógica de domínio testada* que minha frase de R1 ("invariante simples") minimizou. O core é mais pesado em *testes de correção contábil*, não em *infraestrutura de ledger distribuído*. Essa é a distinção que carrega o veredito: heavier domain modeling, single ACID store.

**Condição de reabertura (inalterada de R1, agora mais estreita):** só reabro Formance/TigerBeetle se o conhecimento de negócio disser que infra de ledger é o *produto* (Pix em escala, contas internas multi-moeda, ledger-as-a-service). A cauda do Heleno **não** é esse gatilho — é cauda de domínio, e domínio mora melhor numa base só.
