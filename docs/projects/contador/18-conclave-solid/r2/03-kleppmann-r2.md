# Kleppmann — Rodada 2 ADVERSARIAL: o que sobra quando os cinco se cruzam

> **Revisor:** martin-kleppmann (Distributed Data Systems) · **Data:** 2026-06-13
> **Rodada:** 2 (adversarial) · **Alvo:** `17-arquitetura-core-v1.md` + `16-conclave-arquitetura/02-data-engineer-schema.md`
> **Insumos R1 lidos integralmente:** Uncle Bob (`01`), Fowler (`02`), eu (`03`), Newman (`04`), Kent Beck (`05`)
> **Mandato:** refutar/endereçar os outros quatro pela lente de dados (ledger, dual-write, idempotência, determinismo); blind spots não vistos; onde cedo; patch v1.1 concreto.

---

## 0. Posição de partida da R2

Líamos o mesmo documento e chegamos, quase todos, ao mesmo veredito de uma palavra — "COM CORREÇÕES". Isso é suspeito. Quando cinco revisores independentes convergem no diagnóstico macro, ou o documento é muito bom (é) ou estamos todos com o mesmo ponto cego. A R2 existe para encontrar o ponto cego coletivo, não para reescrever a R1 com mais ênfase.

Minha R1 entregou K-1…K-12. Nada nas quatro análises dos colegas refuta um único K. Mas três delas — Beck, Uncle Bob e Newman — propõem coisas que **interagem** com os meus failure modes de formas que nenhum de nós nomeou, e em dois casos a proposta do colega **agrava** silenciosamente um cenário meu. É aí que vou bater. Make the trade-offs explicit — inclusive os trade-offs *entre as nossas próprias recomendações*.

---

## 1. REFUTAÇÕES e cruzamentos

### 1.1 🔴 Beck — o corte do RAG (K-1 dele) NÃO neutraliza meu K-8; ele o ADIA para o pior momento possível

Beck corta RAG/embeddings da F1 (o K-1 dele) e argumenta, com razão, que regra determinística sustenta o laudo e RAG é assistente. Eu **concordo com o corte** — e disse na minha R1 §5.2 que prometer re-execução do RAG é promessa falsa. Mas há um non-sequitur perigoso na consequência operacional que Beck tira disso.

Beck escreve (tabela §3): proveniência computacional "espera o gatilho — RAG (se a trilha grava `motor_versao`, o motor é plugável)". **Isso está errado pela minha lente, e é o cruzamento mais grave da R2.** O registro de proveniência computacional (meu K-8: prompt_hash, embedding_modelo, retrieval_set, resposta_bruta) não é uma propriedade do *motor RAG* — é uma propriedade do **contrato do evento `analise_executada`**. Se a F1 nasce só com a camada determinística (Beck) e o payload de `analise_executada` é desenhado *para a camada determinística apenas*, então quando o RAG entrar pelo gatilho de Beck (K-1: "recall insuficiente em NCM ambíguo"), os campos de proveniência computacional **não existirão no contrato** — e adicioná-los depois é uma migração de contrato de payload **num ledger append-only que já tem eventos C0 e F1 gravados**. Beck mesmo escreveu (§5.1) que a defensabilidade depende de contrato de dados que "não se reconstitui". Ele aplicou a regra à bitemporalidade e à trilha, mas **não a aplicou ao próprio K-8 que cita aprovadamente na §3**. O corte do comportamento (RAG) é correto; o corte do *contrato de dados que o RAG vai exigir* é exatamente o erro que o framework dele proíbe.

**Refutação concreta:** o contrato de payload de `analise_executada` precisa nascer com TODOS os campos de proveniência computacional (K-8) **na F1, mesmo com o RAG cortado** — os campos de RAG ficam `null` enquanto o motor é só-regras, e populam quando o RAG entra. Custo: zero comportamento novo, só colunas/chaves num jsonb contratado. Isso reconcilia o K-1 de Beck com o meu K-8 sem perder nenhum dos dois. É a aplicação literal da regra "contrato de dados nasce dia-0, comportamento espera" — à qual o próprio Beck deu exceção indevida.

### 1.2 🔴 Kent Beck — "Postgres-only mínimo" e o `motor-versao` como string: o corte simplifica o happy path e AGRAVA meu K-4

Beck (e o doc 17 §3.1) tratam a versão do motor como um campo. Uncle Bob (P-UB1) e Newman (N-W11) querem `ref.motor_versao` como entidade. Eu fico **com Uncle Bob e Newman contra Beck aqui**, mas por um motivo que nenhum dos três deu: não é sobre limpeza arquitetural (Bob) nem sobre anatomia da versão (Newman) — é sobre **a fórmula do hash da cadeia (meu K-4)**.

Veja a interação que ninguém viu. Beck mantém a simplicidade dizendo "trigger impõe invariante, nunca computa decisão". Mas o `tg_evento_boa_fe_chain` (doc 02 §3.5) **computa** o hash concatenando `payload::text`. Se `motor_versao` é uma string solta dentro do payload de `analise_executada`, e amanhã alguém promove para FK `motor_versao_id` (como Bob/Newman pedem), o **payload muda de forma** → o `payload::text` concatenado muda → e qualquer recomputação futura da cadeia precisa saber qual era a forma do payload em cada época. A "simplificação" de Beck (string no jsonb) e a "limpeza" de Bob/Newman (promover a entidade) **colidem na minha cadeia de hash**: a migração de uma para a outra altera a entrada do digest de eventos que ainda não foram migrados, mas cujos vizinhos na cadeia já estão carimbados pela ACT.

**Refutação dupla:** (a) contra Beck — string solta no payload não é simples, é dívida na fórmula do hash; (b) contra Bob/Newman — promover a FK *depois* de eventos carimbados exige que o `hash_ver` do meu K-4 já exista, senão a promoção quebra a verificabilidade dos eventos antigos. A reconciliação: `ref.motor_versao` nasce como entidade JÁ na F1 (Bob/Newman vencem), E o hash da cadeia inclui `hash_ver` desde o evento gênese (meu K-4), E — adendo novo da R2 — **o hash NÃO deve digerir `payload::text` inteiro, e sim um conjunto canônico explícito de campos** (meu K-4 já pedia delimitadores; estendo: digerir campos nomeados, não o blob jsonb). Assim mudar o *formato* do payload (acrescentar `motor_versao_id`) não muda o hash dos eventos que não usam aquele campo. Sem isso, toda evolução de payload é uma bomba-relógio na cadeia.

### 1.3 🔴 Newman — "se falam por JOIN, há ciclo core↔gestao com FK" interage com meu dual-write, e a correção dele (N-W2) tem um efeito colateral no meu K-1

Newman (N-W1/N-W2) e Uncle Bob (V3/P-UB2) querem matar o ciclo `core.usuario.departamento_id → gestao.departamento` e proibir escrita cross-schema fora de RPC. **Concordo com a direção e ela REFORÇA meu K-1** (a porta lateral do PostgREST): se módulo só escreve nas próprias tabelas via RPC `security definer`, a policy de UPDATE direto que eu quero matar morre pela regra do Newman também. Bom — duas lentes, mesma trava.

Mas há um efeito colateral que Newman não viu e que é da minha alçada. A regra "escrita cross-módulo só via RPC" (N-W1) **muda a topologia transacional do meu K-2** (consumo pgmq na mesma transação). Hoje o worker da F2 faz `pgmq.read → INSERT nota → INSERT eventos → pgmq.delete` numa transação. Se a regra do Newman vira lei e a ingestão é um "módulo" que não pode escrever direto em `core.nota` (que conceitualmente Newman/Fowler querem mover para o contexto Ingestão), então o INSERT passa a ser uma chamada RPC `security definer` — e RPC em Postgres **abre subtransação implícita por bloco de exceção, mas commita no mesmo xact do chamador**. Isso ainda é atômico (bom), mas se alguém, seguindo Newman ao pé da letra, transformar a fronteira em **chamada de rede entre serviços** (o que Newman explicitamente NÃO recomenda, mas que a "regra" sugere a um dev apressado), o meu exactly-once transacional vira dual-write distribuído — exatamente o que o Postgres-only existe para evitar.

**Refutação/aviso:** a regra do Newman é boa SE e SOMENTE SE "interface publicada" significa **view/RPC no mesmo banco e mesma transação**, nunca chamada HTTP. Newman diz isso (§1.1: "não recomendo API HTTP interna"). Mas a regra escrita N-W1 ("cruzou de schema = interface publicada") precisa de uma cláusula que eu adiciono: **a porta de ingestão (K-2) é a exceção nomeada onde a "interface" é a RPC transacional, não o staging de outro módulo** — porque o meu mandamento "ler+efetivar+ackar na mesma transação" é incompatível com qualquer fronteira que não seja in-process/in-transaction. Sem essa cláusula explícita, Newman e eu nos contradizemos no único ponto onde a corretude do moat está em jogo.

### 1.4 🟡 Uncle Bob — o ledger como "módulo mais estável": concordo que é inextraível, mas ele NÃO é o mais estável; é o mais ANTI-FRÁGIL-DEPENDENTE

Uncle Bob (SDP, §5) e Fowler (§4.2, "a Trilha nunca se extrai") colocam a trilha como o componente mais estável e o kernel transacional inextraível. **Concordo que é sacrifício impossível** — disse na minha R1 §9 que hash-chain por tenant e estado+prova transacionais estão corretos e não os ataco. Mas refuto a caracterização de "mais estável".

A trilha é o componente cuja *interface* (tipos de evento, contrato de payload, fórmula de hash) é a mais estável — concordo. Mas a trilha é simultaneamente o componente **mais dependente de propriedades operacionais externas que ninguém no conclave controla**: o RPO do plano Supabase (meu K-3, fork ancorado), a estabilidade da serialização `jsonb→text` através de major versions do Postgres (meu K-4), a durabilidade do storage WORM dos TSTs (meu K-3.1). Uncle Bob trata estabilidade como propriedade de *código* (Dependency Rule, source-code dependencies). Pela minha lente, a trilha é o componente onde a estabilidade é uma propriedade de **operação e de dados ao longo do tempo**, não de código. O ledger "mais estável" do Bob é o ledger que um PITR mal feito transforma em prova de adulteração numa tarde (K-3). Estável no grafo de dependências ≠ estável sob restore.

**Não é refutação do "inextraível" — é refutação do "estável".** O componente mais estável de um sistema data-intensive não é o que tem menos dependências de código; é o que tem o **protocolo operacional mais explícito para seus próprios failure modes**. A trilha hoje tem o melhor *desenho de código* e o **pior** *desenho operacional* (zero menção a restore, RPO, durabilidade de TST) — o paradoxo que Fowler tocou (§5.1, "única parte não-sacrificável nasce na fase mais improvisada") e que eu nomeei em K-3. Uncle Bob, ao chamá-la de "mais estável", reforça o ponto cego coletivo: estamos todos admirando o código da trilha e ninguém — exceto Fowler de raspão e eu — olhou o que acontece com ela quando a infra falha.

---

## 2. BLIND SPOTS que NINGUÉM viu nas 5 análises de R1

### 2.1 🔴 O `seq_tenant` é atribuído por trigger lendo MAX — e isso é uma corrida sob concorrência que nenhum de nós tratou

Olhem o `tg_evento_boa_fe_chain` (doc 02 §3.5) de novo, agora pela lente de concorrência pura. Ele faz `pg_advisory_xact_lock(tenant)` → `SELECT ... ORDER BY seq_tenant DESC LIMIT 1` → `seq := v_seq + 1`. O advisory lock serializa **dentro de uma instância Postgres**. Mas eis o blind spot: **read replica + failover**. Se a F2 escala (minha própria rota de saída, R1 §6.4: "réplica de leitura para painéis"), e um dia um failover promove uma réplica com lag, há uma janela onde dois nós podem ter visto `MAX(seq_tenant)` diferentes. O advisory lock NÃO atravessa instâncias. Resultado: dois eventos com o mesmo `seq_tenant`, ou um gap — e o `uq_evento_seq` (UNIQUE em `escritorio_id, seq_tenant`) **falha o INSERT**, derrubando a transação de aprovação do contador no pico do dia 5.

Ninguém viu isso porque todos tratamos o advisory lock como suficiente (eu inclusive, na R1 — assumi single-writer por instância como dado). É suficiente HOJE (instância única). Vira bug de corrupção silenciosa OU de disponibilidade no exato momento em que a minha própria recomendação de escala (réplica) é seguida. O `seq_tenant` derivado de `MAX()` é um **contador distribuído fingindo ser local** — o anti-padrão clássico de sistemas de dados.

**Correção (novo, K-13):** `seq_tenant` não deve ser derivado de `MAX(SELECT)`. Deve vir de uma **sequência materializada com row-lock** — exatamente a `core.trilha_cabeca (escritorio_id PK, seq, hash)` que propus em K-10a, agora com função dupla: ela é a fonte ÚNICA do próximo `seq` (UPDATE ... RETURNING seq+1), e o `UPDATE` da linha é o que serializa (row-lock natural, que o failover respeita porque é estado commitado, não lock em memória). Mata K-13 e K-10a com a mesma tabela. Documentar: **a trilha só pode ter um primary writer; réplica é read-only para sempre; promover réplica a writer exige protocolo de re-âncora (K-3)**.

### 2.2 🔴 O carimbo ACT diário cria uma DEPENDÊNCIA DE ORDENAÇÃO entre tenants que o hash-chain por-tenant nega — ninguém viu a tensão

Todos elogiamos duas decisões como independentes: (a) hash-chain **por tenant** (verificação isolada — eu, Bob, Fowler, Newman concordamos) e (b) fecho **diário** carimbado por ACT (Heleno/Beck mantêm, eu mantenho em R1 §9). Blind spot: **elas interagem e a interação não está desenhada.**

O fecho diário carimba *o quê*, exatamente? Se carimba a cabeça da cadeia de **cada tenant** separadamente, são N carimbos ACT/dia (N = tenants) — o custo R$9-30/mês do doc 17 §3.2 está calculado para **um** carimbo/dia, não N. Com 50 tenants, são 50 carimbos/dia = ~1500/mês, e a aritmética de COGS do Anderson (§9) quebra silenciosamente — o mesmo tipo de erro 12× que peguei no K-9. Se, para economizar, carimba **uma raiz de Merkle de todas as cabeças de todos os tenants** num carimbo só, então o carimbo passa a **ordenar tenants entre si** (a raiz depende de quais tenants existiam e em que estado naquele dia) — e isso contradiz a decisão "ordem entre tenants é juridicamente irrelevante" (minha R1 §9). Pior: a prova de um tenant para o perito passa a exigir revelar a existência/estado de outros tenants (caminho de Merkle), violando o isolamento que a RLS toda do doc existe para garantir.

Ninguém viu porque tratamos "diário" e "por-tenant" como ortogonais. São acoplados pela mecânica do carimbo.

**Correção (novo, K-14):** decidir explicitamente e escrever no doc 17 §3.2 — **um carimbo ACT por tenant por dia** (custo recalculado: ~R$9-30/mês × tenants, entra na planilha de COGS do §9 como custo variável por tenant, não fixo) OU **árvore de Merkle por tenant** (uma raiz por tenant/dia, caminho de inclusão só dentro do próprio tenant, isolamento preservado) com **um** carimbo da floresta de raízes — mas então o caminho de prova de um tenant **nunca inclui nós de outro tenant** (a raiz da floresta é carimbada, mas a inclusão do tenant X prova-se contra a raiz-de-X, e a raiz-de-X contra a raiz-da-floresta sem revelar irmãos). A segunda opção é a correta (custo de carimbo O(1), isolamento O(1)), mas exige desenho de Merkle que o doc não tem. Isto é uma decisão de arquitetura de dados, não um detalhe — e é o único lugar onde duas decisões que TODOS aprovamos se mordem.

### 2.3 🟡 Bitemporalidade da base × bitemporalidade da DECISÃO: o doc tem uma, presume duas

Fowler, Beck e eu elogiamos a bitemporalidade da `ref.base_versao` (`vigencia` + `conhecida_em`). Blind spot coletivo: a bitemporalidade está na **base de regras**, não na **decisão**. O apontamento grava `fato_gerador_em` (tempo de validade) e `created_at`/`revisado_em` (tempo de sistema) — ok. Mas a *reanálise* (meu K-7, estado `superado`) cria um terceiro problema temporal que ninguém modelou: quando uma NT nova (Q3) reabre um apontamento já aprovado e carimbado, qual é o `conhecida_em` do apontamento sucessor? O do fato gerador (passado) ou o da NT (presente)? Se o sistema grava o presente, perde-se a capacidade de responder "o que sabíamos quando decidimos a primeira vez" — que é a defesa de boa-fé inteira. A bitemporalidade precisa descer da base para a **decisão**, e o evento de sucessão (`superado`) precisa carregar AMBOS os eixos. Custo: uma coluna no apontamento + dois campos no payload do evento de sucessão. Já cabe no meu K-7, mas ninguém — eu incluso na R1 — explicitou que a sucessão é um evento *bitemporal*.

---

## 3. Onde CONCORDO (e reforço com a lente de dados)

- **Beck, o corte do RAG da F1 (K-1 dele):** correto, e reforço — a camada determinística é a única re-executável (minha R1 §5.2), então cortá-la-primeiro-RAG-depois alinha o que é vendável ("re-executável") com o que é tecnicamente verdadeiro. Só não cortem o *contrato de dados* junto (minha §1.1 acima).
- **Newman/Bob, matar o ciclo core↔gestao e escrita só-via-RPC:** reforça meu K-1 (porta lateral). Duas lentes batendo na mesma trava = trava forte. Façam.
- **Fowler, runbook de restore como evento de primeira classe (§4.3, `cadeia_restaurada`):** é o meu K-3, e Fowler chegou nele por outra porta (sacrificial architecture). Convergência independente de dois revisores no MESMO failure mode mais grave = sinal forte de que é real. Promovam a bloqueante.
- **Newman, `core.base_adocao` (N-W8) — "evento sem estado é história sem presente":** excelente frase e achado real. Reforço pela minha lente: sem a tabela de adoção por tenant, o evento `base_referencia_atualizada` é um fato sem agregado consultável — e a reanálise de impacto (K-7) não tem de onde saber *quais* tenants estão em qual versão. N-W8 é pré-condição do meu K-7.
- **Uncle Bob/Newman, verificador de cadeia standalone (P-UB7):** é o que eu chamei de re-verificação (R1 §5.2) virado em ferramenta. Concordo que nasce dia-0. Adendo: o verificador precisa embutir os **golden hashes** do meu K-4, senão ele verifica a cadeia mas não detecta que a *fórmula* mudou.

---

## 4. Onde CEDO

**Cedo a Beck na priorização, contra a minha própria R1 implícita.** Minha R1 listou K-1…K-12 todos como "antes da migration 001" com tom de urgência uniforme. Beck está certo: razoabilidade não é aditiva, e empilhar 12 correções minhas + as dos outros quatro na F1 de 1 dev é o mesmo erro de soma que ele denuncia. **Reconheço que nem todos os meus K são dia-0.** Separo agora, cedendo o que é comportamento:

- **Contrato de dados (irreversível) — dia-0 inegociável:** K-3 (protocolo restore + TST fora do banco), K-4 (`hash_ver` + fórmula congelada + golden hashes + hash de campos canônicos, não blob), K-5 (`competencia` derivada por função), K-6a (`chave_dedup`), K-8 (contrato de payload de proveniência computacional COMPLETO, mesmo com RAG cortado), K-13 (`trilha_cabeca` como fonte de `seq`), K-14 (decisão Merkle-por-tenant do carimbo). Estes não se retrofitam num ledger vivo — é a regra do próprio Beck.
- **Comportamento (adiável com gatilho) — cedo:** K-7 (estado `superado` + sucessão) só vira urgente quando o RAG/reanálise entrar — que é o gatilho de Beck para o RAG. K-1 (constraint trigger anti-porta-lateral) pode ser policy SELECT-only dia-0 + constraint trigger quando houver PostgREST exposto. K-10 (Merkle de lote, fila separada) é F2. K-11 (crypto-shredding) é convenção dia-0 mas implementação no gatilho de PII real.

Cedo também a Newman/Beck que **não devo prescrever réplica de leitura como rota de saída sem o protocolo de K-13** — minha própria R1 §6.4 sugeriu réplica casualmente, e o blind spot K-13 mostra que réplica sem disciplina de single-writer corrompe o `seq_tenant`. Retiro a sugestão de réplica como "rota fácil"; ela exige K-13 primeiro.

---

## 5. PATCH v1.1 (em uma linha, como manda o rito)

**No doc 02 §3.5: substituir o `seq_tenant`-via-`MAX(SELECT)` e o hash-de-`payload::text` por `core.trilha_cabeca(escritorio_id PK, seq, hash, hash_ver)` como fonte única de sequência+cabeça (row-lock, single-writer, mata K-10a/K-13), com hash digerindo campos canônicos nomeados + `hash_ver` (K-4) — e contratar o payload de `analise_executada` com TODOS os campos de proveniência computacional (K-8) já na F1, RAG cortado ou não (K-1 do Beck); fora do schema, decidir em §3.2 do doc 17 o carimbo ACT como Merkle-por-tenant com isolamento de caminho de prova (K-14) e o restore como evento de primeira classe (K-3, convergente com Fowler).**

---

## 6. Veredito da R2

O documento continua "COM CORREÇÕES" — mas a R2 revelou que o ponto cego coletivo não estava em nenhuma das 28 condições nem nos meus 12 K's individuais. Estava nas **interações entre as nossas próprias recomendações**: o corte de RAG do Beck que adia meu contrato de dados (§1.1), a string-vs-entidade de Beck×Bob×Newman que detona minha fórmula de hash (§1.2), a regra de fronteira do Newman que pode quebrar meu exactly-once se mal lida (§1.3), e duas decisões que TODOS aprovamos — hash por-tenant e carimbo diário — que se mordem na mecânica do carimbo (§2.2). Mais o `seq_tenant`-via-MAX que é um contador distribuído disfarçado esperando o primeiro failover (§2.1).

Nenhum desses muda o paradigma. Todos exigem que o que está *implícito na soma das nossas recomendações* vire *explícito antes da migration 001*. O custo continua sendo dias, não meses — mas só porque ainda estamos no papel, e papel é o único lugar onde a interação entre cinco bons conselhos é grátis de reconciliar.

Data outlives code — e, nesta R2, data também precisa sobreviver às nossas próprias correções. Make the trade-offs explicit, inclusive os nossos entre si. 📊

-- Kleppmann.
