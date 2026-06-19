# Rodada 2 ADVERSARIAL â€” Lente Fowler: o que os outros quatro erraram, e onde eu cedo

> **Conclave SOLID â€” Rodada 2 (adversarial)** Â· **Expert:** martin-fowler (arquitetura evolutiva, strangler fig, fitness functions, fronteiras)
> **Data:** 2026-06-15 Â· **Alvo:** `17-arquitetura-core-v1.md` (+ schema `02`) Â· **Insumo:** as 5 anÃ¡lises de R1.
> **Regra desta rodada:** refutar de verdade, citar pelo nome, achar o que ninguÃ©m viu, ceder onde fui vencido, e propor UM patch v1.1 concreto que eu defendo.

---

## 0. Onde a R1 convergiu (e por que isso Ã© um cheiro, nÃ£o um conforto)

Os cinco veredictos de R1 sÃ£o, sem exceÃ§Ã£o, "COM CORREÃ‡Ã•ES". Cinco especialistas independentes, zero "NÃƒO", zero "SIM puro". Isso deveria nos deixar **menos** confortÃ¡veis, nÃ£o mais. Quando todo mundo concorda que o documento Ã© bom "exceto pelas minhas correÃ§Ãµes", o que aconteceu foi que cada um projetou o seu artigo favorito no doc e o achou incompleto na exata medida do seu artigo. Beck achou que falta subtraÃ§Ã£o; Uncle Bob achou que faltam fronteiras de domÃ­nio; Kleppmann achou que faltam failure modes; Newman achou que falta information hiding; eu achei que faltam fitness functions. **Nenhum de nÃ³s revisou o doc â€” cada um revisou a si mesmo no espelho do doc.** O Beck pegou isso melhor que todos ("conclave que rejeita zero condiÃ§Ãµes nÃ£o revisa, acumula") â€” sÃ³ que ele o disse das 28 condiÃ§Ãµes do conclave anterior, sem notar que a R1 deste conclave fez exatamente a mesma coisa: 5 lentes, 0 discordÃ¢ncias estruturais entre si, ~50 patches somados. ComeÃ§o por aÃ­ porque Ã© o blind spot que contamina os outros (Â§2).

---

## 1. RefutaÃ§Ãµes nomeadas

### 1.1 Contra **Kent Beck** â€” cortar a F1 ao mÃ­nimo colide de frente com a minha tese de que defensabilidade Ã© propriedade contÃ­nua, e ele nÃ£o viu o custo do prÃ³prio corte

Beck propÃµe cortar RAG (K-1), PAdES em lote (K-2), parser EFD (K-3), billing-jobs, implantaÃ§Ã£o, white-label, e a decisÃ£o em lote â€” chegando a uma "F1-mÃ­nima de 16-20 semanas". A lÃ³gica do "o que muda contrato de dados nasce no dia 0, o resto espera o gatilho" Ã© correta e eu **assino**. Mas hÃ¡ um erro de categoria na lista de cortes dele, e Ã© grave.

**Beck trata fitness functions como comportamento adiÃ¡vel. NÃ£o sÃ£o. SÃ£o contrato.** Veja a contradiÃ§Ã£o interna do prÃ³prio Beck: ele mantÃ©m o hash-chain, mantÃ©m a bitemporalidade, mantÃ©m o ACT â€” porque "contrato de dados nÃ£o se back-filla". Correto. Mas uma fitness function de fronteira (a minha FF-1/FF-2) ou de imutabilidade (FF-6) **tambÃ©m nÃ£o se back-filla** â€” nÃ£o no sentido do dado, mas no sentido de que a fronteira que vocÃª nÃ£o enforÃ§ou no dia 0 jÃ¡ foi violada quando vocÃª tenta adicionÃ¡-la no mÃªs 6. O ciclo `coreâ†’gestao` que Uncle Bob e Newman acharam no DDL Ã© a prova viva: ele entrou na *migration 001*, antes de qualquer corte de Beck importar. Se a F1-mÃ­nima do Beck nasce sem FF-2 (fronteira de schema no CI), o primeiro `JOIN` cross-schema de conveniÃªncia num sÃ¡bado apertado calcifica, e nenhum corte de escopo desfaz isso.

O moat â€” a coisa que Beck mais quer proteger â€” **Ã© uma propriedade arquitetural contÃ­nua, nÃ£o uma feature**. Defensabilidade nÃ£o Ã© o ledger; Ã© o ledger *mais* a garantia, verificada a cada commit, de que ninguÃ©m escreveu estado sem evento (Kleppmann K-1), de que a fÃ³rmula de hash nÃ£o mudou (Kleppmann K-4), de que nenhuma tabela tenant nasceu sem RLS (minha FF-3). Tudo isso Ã© "comportamento" pela taxonomia do Beck, e portanto cortÃ¡vel. Mas Ã© exatamente o que erode em silÃªncio se nÃ£o houver gate desde o D0. **VocÃª pode adiar o RAG. VocÃª nÃ£o pode adiar a fitness function que protege o invariante, porque o invariante Ã© violado durante o adiamento.**

ConcessÃ£o real ao Beck dentro da refutaÃ§Ã£o: ele estÃ¡ certo que o *catÃ¡logo* de 12 FFs Ã© grande demais para a F1-mÃ­nima. Eu cedo no volume (Â§3). Mas o subconjunto FF-1/FF-2/FF-3/FF-6 Ã© D0 inegociÃ¡vel â€” custa "dias de setup e centavos de CI" (palavras minhas de R1) e protege precisamente o que ele nÃ£o quer perder. Cortar essas quatro para ganhar uma semana Ã© trocar o moat por uma sexta-feira.

### 1.2 Contra **Uncle Bob** â€” SOLID rÃ­gido num sistema prÃ©-cÃ³digo Ã© cerimÃ´nia, e o pacote de domÃ­nio `@contador/dominio` Ã© a sua maior YAGNI

Uncle Bob quer, como bloqueante de F1, um pacote TypeScript de domÃ­nio puro (P-UB6) com mÃ¡quina de estados, materialidade, ato privativo e semÃ¢ntica da trilha â€” e os triggers/RPCs do banco viram "backstop conferido contra o domÃ­nio por teste de equivalÃªncia". Isso Ã© Clean Architecture de manual, e para este sistema Ã© **a abstraÃ§Ã£o mais cara e mais especulativa do conclave inteiro**.

Aqui Newman me dÃ¡ muniÃ§Ã£o que reforÃ§a minha refutaÃ§Ã£o (e Ã© onde eu e Newman *concordamos contra* o Uncle Bob): Newman escreveu, na seÃ§Ã£o CUPID, "onde SOLID-compliance deixaria PIOR" â€” DIP no lookup da base, OCP no pipeline, ISP no laudo â€” e concluiu que a tabela versionada com EXCLUDE de vigÃªncia *Ã©* a abstraÃ§Ã£o, e pÃ´r uma interface na frente "seria cerimÃ´nia". Eu vou alÃ©m: o **teste de equivalÃªncia domÃ­nio-vs-trigger** que o Uncle Bob propÃµe Ã© dupla manutenÃ§Ã£o permanente. VocÃª mantÃ©m a mÃ¡quina de estados em TS *e* em plpgsql, e escreve um terceiro artefato (o teste de equivalÃªncia) para garantir que as duas concordam. TrÃªs lugares para mudar a cada estado novo â€” e o domÃ­nio (a transiÃ§Ã£o 2026-2033) vai inventar estados novos o tempo todo, como o prÃ³prio M-2 jÃ¡ provou. Isso nÃ£o Ã© defesa em profundidade; Ã© um custo de carregamento que cresce com a volatilidade do domÃ­nio.

A versÃ£o evolutiva, e a que eu defendo contra ele: **a regra de transiÃ§Ã£o vira dado, nÃ£o cÃ³digo duplicado** (era a minha F-7 de R1: `ref.transicao_permitida`). O trigger fica genÃ©rico e estÃ¡vel; a regra fica versionÃ¡vel e testÃ¡vel por pgTAP enumerando a tabela. Um lugar para a verdade, nÃ£o trÃªs. Uncle Bob acertou o *diagnÃ³stico* (V2: invariante que sÃ³ existe no framework Ã© frÃ¡gil) e errou o *remÃ©dio* (duplicar o invariante em duas linguagens). O remÃ©dio certo Ã© tornar o invariante **dado**, que Ã© simultaneamente testÃ¡vel fora do Postgres (atende a preocupaÃ§Ã£o dele) e impossÃ­vel de divergir (elimina o teste de equivalÃªncia).

Onde o Uncle Bob estÃ¡ irretocÃ¡vel e eu **nÃ£o** refuto: `ref.motor_versao` como entidade de primeira classe (P-UB1). Isso nÃ£o Ã© SOLID rÃ­gido â€” Ã© versionar o intÃ©rprete junto com o dicionÃ¡rio. ReforÃ§o no Â§3.

### 1.3 Contra **Kleppmann** â€” concordamos no ledger, mas divergimos na evoluÃ§Ã£o dele: o K-4 dele congela cedo demais e o K-3 ainda nÃ£o fecha o loop com a minha re-Ã¢ncora

Kleppmann e eu somos os dois "donos do ledger" deste conclave, e em R1 chegamos ao mesmo lugar por caminhos diferentes: eu via a trilha como "a Ãºnica parte nÃ£o-sacrificÃ¡vel que nasce na fase mais improvisada" (Â§5.1); ele via "verificabilidade de 7 anos nÃ£o Ã© propriedade do happy path". Mesma conclusÃ£o: contrato de payload Ã© bloqueante do C0. Onde divergimos Ã© na **evoluÃ§Ã£o** da fÃ³rmula de hash.

Kleppmann (K-4) quer `hash_ver` + fÃ³rmula congelada por versÃ£o + canonicalizaÃ§Ã£o com delimitadores **agora, antes do primeiro evento**. Concordo com a canonicalizaÃ§Ã£o (a concatenaÃ§Ã£o sem delimitadores do trigger atual Ã© higiene criptogrÃ¡fica ruim â€” ele tem razÃ£o factual). Mas o `hash_ver` com "fÃ³rmula v1 imutÃ¡vel por contrato, mudou nasce v2" Ã© onde a lente de dados dele e a minha lente evolutiva colidem. **Congelar a fÃ³rmula no D0 e proibir editÃ¡-la para sempre Ã© exatamente o oposto de arquitetura evolutiva â€” Ã© petrificar uma decisÃ£o tomada no momento de menor conhecimento.** O risco real nÃ£o Ã© a fÃ³rmula mudar; Ã© a fÃ³rmula de 2026, escrita por um dev sozinho com pressa, ter um defeito que sÃ³ aparece em 2029, e aÃ­ estar "imutÃ¡vel por contrato".

A sÃ­ntese evolutiva (que eu defendo *somando* ao K-4 dele, nÃ£o substituindo): o que precisa ser imutÃ¡vel nÃ£o Ã© a *fÃ³rmula* â€” Ã© o **verificador versionado capaz de recomputar qualquer geraÃ§Ã£o**. Isto Ã©, o `hash_ver` nÃ£o congela uma fÃ³rmula proibida de evoluir; ele marca qual `core.verificar_evento_vN()` recomputa aquele evento. A fÃ³rmula PODE evoluir (v2, v3) â€” o que nÃ£o pode Ã© o verificador da v1 deixar de existir. Ã‰ a diferenÃ§a entre "a fÃ³rmula Ã© eterna" (Kleppmann) e "a *capacidade de verificar cada geraÃ§Ã£o da fÃ³rmula* Ã© eterna" (Fowler). A segunda Ã© evolutiva; a primeira Ã© dÃ­vida petrificada. E ela se conecta diretamente Ã  minha FF-4 + o "verificador independente como CLI standalone" do Uncle Bob (P-UB7): o verificador multi-geraÃ§Ã£o nasce no D0, lidando com cadeias mistas â€” exatamente o que eu disse na Â§5.1 ("o verificador da cadeia nasce jÃ¡ lidando com geraÃ§Ãµes mistas").

Segundo ponto de divergÃªncia, mais sutil: o K-3 do Kleppmann (protocolo de restore, o "fork ancorado") Ã© a melhor coisa que ele achou e eu **endosso integralmente** â€” Ã© mais rigoroso que o meu prÃ³prio F-6 de R1 (eu propus `cadeia_restaurada`; ele detalhou TST em WORM fora do banco, salto de `seq_tenant`, RPO explÃ­cito). Mas hÃ¡ um furo de evoluÃ§Ã£o que nem ele fechou: o protocolo de restore dele assume que o **verificador** sobrevive ao restore. Se a fÃ³rmula de hash evoluiu entre o TST externo e o restore, o evento `restauracao_sistema` precisa declarar *qual versÃ£o do verificador* reconcilia a cabeÃ§a prÃ©-incidente. Sem isso, o restore de 2030 sobre uma cadeia que mudou de fÃ³rmula em 2028 nÃ£o reconcilia. Ã‰ o casamento do K-3 dele com o meu `hash_ver`-evolutivo â€” nenhum dos dois sozinho fecha.

### 1.4 Contra/com **Newman** â€” "componentes nÃ£o sÃ£o contextos" reforÃ§a meu "tem componentes mas nÃ£o tem contextos", mas Newman para no information hiding e nÃ£o chega ao mapa de contextos

Newman e eu chegamos ao **mesmo achado por vocabulÃ¡rios diferentes**, e isso vale registrar como convergÃªncia forte (nÃ£o como refutaÃ§Ã£o): meu "tem componentes mas nÃ£o tem contextos" (R1 Â§2) e o "schemas Postgres sÃ£o namespaces, nÃ£o fronteiras" dele (N Â§1.1) sÃ£o a mesma observaÃ§Ã£o. Ele a operacionaliza como "mÃ³dulo sÃ³ escreve nas prÃ³prias tabelas; cruzou de schema Ã© interface publicada" (N-W1) â€” que Ã© information hiding clÃ¡ssico, e estÃ¡ correto.

Mas aqui eu **avanÃ§o sobre o Newman**, nÃ£o o refuto: information hiding responde "quem pode ler/escrever o quÃª"; nÃ£o responde "**de quem Ã© este conceito quando a linguagem muda**". O vazamento que eu achei (`origem='documentize'` como valor de enum de domÃ­nio, `plano` de billing dentro de `escritorio`, `provider_meta` no core) nÃ£o Ã© resolvido por "mÃ³dulo sÃ³ escreve nas prÃ³prias tabelas" â€” Ã© resolvido por um **mapa de bounded contexts com a fronteira nomeada** (ACL vs Conformist vs Shared Kernel). Newman tem a disciplina de acesso (N-W1) mas nÃ£o tem o mapa de linguagem (minha F-2). Exemplo concreto onde a diferenÃ§a morde: o `core.escritorio.plano`. Pela regra do Newman, billing lÃª `escritorio` via view `api_` â€” resolvido? NÃ£o. O problema nÃ£o Ã© *acesso*; Ã© que `plano` (linguagem de Comercial/Billing) estÃ¡ fisicamente *dentro* da entidade de identidade do tenant. Nenhuma view conserta um campo que estÃ¡ na tabela errada. SÃ³ o mapa de contextos diz "isto pertence ao contexto Comercial, move para `core.assinatura`".

EntÃ£o: Newman *reforÃ§a* meu achado (dois especialistas vendo a mesma fronteira faltando Ã© sinal de que ela falta de verdade) e eu *completo* o dele â€” a disciplina de acesso dele (N-W1) + o meu mapa de contextos (F-2) sÃ£o complementares, e ambos baratos prÃ©-cÃ³digo. Onde discordo do Newman frontalmente: ele lista, na CUPID, que white-label theming e billing-jobs sÃ£o adiÃ¡veis (alinhado com Beck) â€” concordo do escopo â€”, mas ele nÃ£o percebe que **adiar o billing-job nÃ£o adia a decisÃ£o de ONDE mora `plano`**. O contrato de dados (onde vive a linguagem de cada contexto) Ã© D0 mesmo quando o comportamento Ã© F2. Beck pegou esse princÃ­pio; Newman aplicou-o ao motor (`ref.motor_versao` Ã© D0) mas esqueceu de aplicÃ¡-lo Ã s fronteiras de contexto.

---

## 2. Blind spots que NINGUÃ‰M viu nas 5 anÃ¡lises de R1

### 2.1 ðŸ”´ O blind spot mais grave: o conclave nÃ£o tem fitness function para si mesmo â€” nÃ£o hÃ¡ gate que impeÃ§a a R3 de acumular mais 50 patches

Este Ã© meta, e Ã© o mais grave porque Ã© o que produz todos os outros. Some os patches de R1: F-1â€¦F-10 (eu) + P-UB1â€¦P-UB10 (Uncle Bob) + K-1â€¦K-12 (Kleppmann) + N-W1â€¦N-W13 (Newman) + K-1â€¦K-11 (Beck). SÃ£o **~56 patches propostos**, muitos sobrepostos (4 de nÃ³s pedimos `ref.motor_versao`; 3 pedimos a quebra do ciclo `coreâ†’gestao`; 3 pedimos contrato de payload bloqueante do C0), mas o documento de sÃ­ntese vai herdar todos sem um critÃ©rio de **rejeiÃ§Ã£o**. Beck nomeou a doenÃ§a ("28 condiÃ§Ãµes, 0 rejeiÃ§Ãµes") e foi o Ãºnico â€” mas nem ele propÃ´s o antÃ­doto estrutural. O antÃ­doto Ã© uma fitness function de *processo*: **um patch sÃ³ entra na v1.1 se tiver (a) um gatilho objetivo de quando aplicar, (b) um custo estimado, e (c) um teste que prova que ele foi aplicado.** Sem (c), o patch Ã© intenÃ§Ã£o, e intenÃ§Ã£o nÃ£o Ã© arquitetura â€” Ã© a mesma falha que eu apontei nos checklists virando gates em R1, agora aplicada ao prÃ³prio conclave. Quem nÃ£o tem fitness function vira comitÃª; isto vale para o sistema *e* para o grupo que o desenha.

### 2.2 ðŸ”´ NinguÃ©m mediu a dÃ­vida de *coordenaÃ§Ã£o* das migrations entre os 4-5 schemas sob 1 dev

Newman chegou perto (expand/contract, freeze no pico) mas tratou como operabilidade de deploy. O blind spot real Ã© evolutivo: **com `core`, `gestao`, `ref`, `app` (+ meu `ingestao` proposto) e migrations "prÃ³prias por schema" (S2 do doc 02), quem garante a ORDEM de aplicaÃ§Ã£o entre schemas quando uma migration de `gestao` depende de uma coluna nova de `core`?** O ciclo `coreâ†’gestao` (que todos acharam) nÃ£o Ã© sÃ³ um problema de ADP â€” Ã© um problema de **ordenaÃ§Ã£o de migration**: para criar a FK `core.usuario.departamento_id â†’ gestao.departamento`, a migration de `core` precisa rodar *depois* da de `gestao`, mas `gestao` referencia `core.escritorio`, que roda *antes*. HÃ¡ uma dependÃªncia circular *no plano de migration*, nÃ£o sÃ³ no schema. Um dev sozinho descobre isso quando a migration falha em produÃ§Ã£o. NinguÃ©m em R1 olhou o grafo de dependÃªncia *temporal* das migrations â€” sÃ³ o grafo de dependÃªncia *estÃ¡tica* das tabelas.

### 2.3 ðŸŸ¡ NinguÃ©m perguntou se o golden-set Ã© versionado junto com a base E o motor â€” a tripla que define reprodutibilidade

Uncle Bob versionou o motor (`ref.motor_versao`). Kleppmann versionou base e motor e adicionou `golden_set_versao` no payload. Mas ninguÃ©m fechou o triÃ¢ngulo: **o golden-set que aprovou o motor v3 em 2027 precisa ser ele mesmo reconstituÃ­vel em 2031** para vocÃª provar "este motor passou neste eval com estes casos". O `core.golden_exemplo` do doc 02 tem `validado boolean` mas **nenhuma versÃ£o/snapshot** â€” Ã© uma tabela mutÃ¡vel. Se vocÃª adiciona casos ao golden-set ao longo de 2027 (e vai, via `apontamento_rejeitado` â€” estÃ¡ no schema), o "golden-set que liberou o motor v3" deixa de existir assim que o v4 Ã© avaliado contra um golden-set maior. A reprodutibilidade de Q1 tem trÃªs pernas (base, motor, eval) e o conclave sÃ³ blindou duas.

### 2.4 ðŸŸ¡ O Demo Kit do C0 e o "Documentize Ã© origem nÃ£o estÃ¡gio" sÃ£o o mesmo strangler fig mal-nomeado â€” e ninguÃ©m ligou os pontos

Beck propÃ´s Demo Kit standalone (matar o acoplamento ao Spike 5). Newman propÃ´s "Documentize Ã© origem, nÃ£o estÃ¡gio" (N-W3). Eu propus, em R1, declarar o Demo Kit sacrificial (F-8). **SÃ£o trÃªs faces do mesmo movimento de strangler fig e ninguÃ©m percebeu que sÃ£o UM patch**: o C0 nÃ£o estende o legado (Gestorize) â€” ele constrÃ³i um shell mÃ­nimo *ao lado* dele e o legado entra como uma origem plugÃ¡vel quando (se) o Spike 5 passar. Isso Ã© literalmente o padrÃ£o strangler fig aplicado corretamente (o oposto do "abraÃ§o de afogado" que eu critiquei em R1 Â§1.1): o novo nasce ao lado, intercepta o fluxo (upload de XML), e o legado Ã© incorporado como adapter â€” ou descartado â€” sem que o core dependa dele para nascer. Beck viu a economia, Newman viu a fronteira, eu vi o sacrifÃ­cio; ninguÃ©m viu que Ã© o mesmo padrÃ£o, e que nomeÃ¡-lo resolve o Q7 inteiro por construÃ§Ã£o.

---

## 3. Onde eu CONCORDO e somo argumento

- **`ref.motor_versao` (Uncle Bob P-UB1, Kleppmann K-8, Newman N-W11, eu F-10):** quatro lentes, mesmo patch. Isto nÃ£o Ã© mais proposta â€” Ã© consenso duro. **Somo:** a anatomia do motor (modelo+prompt_hash+embedding+params) deve incluir `golden_set_versao_id` por FK (meu blind spot Â§2.3), fechando a tripla de reprodutibilidade. E o enquadramento que Kleppmann, Beck e Newman todos defenderam â€” **re-verificaÃ§Ã£o, nÃ£o re-execuÃ§Ã£o** de LLM â€” Ã© a correÃ§Ã£o mais importante de prosa do doc 17 (Â§3.3). Assino sem reservas: prometer replay de LLM Ã© a frase que a perÃ­cia de 2031 usa contra o produto.

- **Quebrar o ciclo `coreâ†’gestao` (Uncle Bob V3/P-UB2, Newman N-W2, eu Â§2.2 R1):** consenso. **Somo o que ninguÃ©m disse:** a quebra do ciclo tambÃ©m resolve a dependÃªncia circular de *migration* que achei em Â§2.2 â€” mover `departamento_id` para `gestao.usuario_departamento` faz o grafo de migration ficar acÃ­clico (`core` â†’ `gestao`, nunca de volta). Dois problemas, um patch.

- **Contrato de payload versionado como bloqueante do C0 (Kleppmann K-4/K-6b, Beck Â§3, eu F-5):** consenso. **Somo:** o `payload_versao` e o `hash_ver` sÃ£o o *mesmo* eixo de versionamento e devem ser um sÃ³ campo, nÃ£o dois â€” senÃ£o vocÃª tem duas dimensÃµes de versÃ£o para reconciliar em 2031.

- **Captura seletiva / guardrail de COGS como cÃ³digo (Kleppmann K-2 como guardrail, eu FF-12, doc 17 jÃ¡ tem em prosa):** concordo, e somo que isto Ã© uma fitness function de *unit economics* â€” categoria que o conclave nÃ£o nomeou mas que Ã© tÃ£o arquitetural quanto isolamento de tenant, porque margem negativa mata o produto tÃ£o certo quanto uma falha de seguranÃ§a.

---

## 4. PATCH v1.1 que eu defendo (especÃ­fico)

Defendo UM patch como o mais alavancado da minha lente, porque ataca o blind spot-raiz (Â§2.1) e Ã© o que torna todos os outros patches *verificÃ¡veis* em vez de aspiracionais:

**PATCH F2-FOWLER â€” CatÃ¡logo de Fitness Functions com gate, em duas ondas, como nova Â§3-bis do doc 17; e a regra de que nenhum patch v1.1 entra sem teste que prove sua aplicaÃ§Ã£o.**

- **O que muda no doc 17:** inserir seÃ§Ã£o "Â§3-bis â€” Fitness Functions (arquitetura verificada, nÃ£o desenhada)" contendo:
  - **Onda D0 (bloqueante da migration 001, ~dias de setup):** FF-1 (fronteira de import no CI â€” dependency-cruiser), FF-2 (fronteira de schema via `pg_catalog` â€” nenhuma FK `coreâ†’gestao|billing|ecac`, nenhuma tabela tenant sem RLS), FF-3 (isolamento cross-tenant *generativo* â€” enumera tabelas, falha se faltar policy), FF-6 (imutabilidade do ledger sobrevive a migration â€” tenta UPDATE e exige exceÃ§Ã£o). Estas quatro protegem o moat *durante* os cortes do Beck.
  - **Onda por-fase (gatilho objetivo cada):** FF-4 (integridade hash-chain + verificador multi-geraÃ§Ã£o â€” Â§1.3), FF-7 (re-verificaÃ§Ã£o de laudo com motor+base+golden_set pinados â€” Â§2.3), FF-8 (contrato do provider), FF-9..FF-12 conforme suas fases.
- **Regra de processo anexa (o antÃ­doto do Â§2.1):** todo patch da v1.1 (os ~56 de R1) sÃ³ Ã© incorporado se a sÃ­ntese registrar, para ele, (a) gatilho, (b) custo, (c) **a fitness function ou teste que prova que foi aplicado**. Patch sem (c) vira "decisÃ£o aberta com dono", nÃ£o item do schema. Isto transforma a sÃ­ntese de uma lista de boas intenÃ§Ãµes num conjunto verificÃ¡vel â€” e impede a R3/sÃ­ntese de virar o comitÃª que o Beck (corretamente) temeu.
- **Custo:** Onda D0 = dias, centavos de CI (palavras minhas de R1, mantidas). A regra de processo = zero custo, Ã© disciplina de sÃ­ntese.
- **Por que este e nÃ£o outro:** porque sem ele, `ref.motor_versao`, a quebra do ciclo, o contrato de payload e o protocolo de restore entram como prosa no doc e erodem no primeiro mÃªs de pressÃ£o. Fitness function Ã© o que separa "fronteira desenhada" de "fronteira que existe" â€” e essa frase Ã© a minha tese inteira.

---

## 5. Veredito de R2

Mantenho o "COM CORREÃ‡Ã•ES" de R1, mas com uma correÃ§Ã£o sobre o prÃ³prio conclave: o risco nÃºmero um deste projeto **nÃ£o** Ã© mais nenhum dos achados tÃ©cnicos individuais â€” todos sÃ£o reais e baratos de corrigir prÃ©-cÃ³digo. O risco nÃºmero um passou a ser **o conclave incorporar os 56 patches sem um gate de rejeiÃ§Ã£o**, reproduzindo no nÃ­vel da revisÃ£o a exata doenÃ§a ("acumular sem subtrair") que Beck diagnosticou no nÃ­vel das features. A defesa contra isso Ã© a mesma em ambos os nÃ­veis: fitness function. O sistema precisa de FF-1â€¦FF-12 para que suas fronteiras existam; o conclave precisa da regra (c) para que sua sÃ­ntese seja arquitetura, e nÃ£o um acÃºmulo de espelhos.

First make the change easy, then make the easy change â€” e a mudanÃ§a mais fÃ¡cil de fazer agora, antes da migration 001, Ã© instalar os gates que tornam todas as outras mudanÃ§as verificÃ¡veis.

â€” Fowler. ðŸ“
