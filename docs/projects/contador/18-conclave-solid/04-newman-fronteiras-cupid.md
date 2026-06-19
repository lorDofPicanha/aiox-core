# 04 — Newman: Fronteiras de Módulo, Information Hiding e a Lente CUPID

> **Autor:** Sam Newman (mind clone) · **Conclave SOLID — Rodada 1 (análise independente)** · **Data:** 2026-06-12
> **Alvo:** `17-arquitetura-core-v1.md` + `16-conclave-arquitetura/02-data-engineer-schema.md`
> **Pauta:** S1 (fronteiras de módulo), S6 (acoplamento a terceiros), CUPID sobre tudo, Q1–Q8.
> **Lente:** Building Microservices / Monolith to Microservices + CUPID (Dan North — propriedades, não princípios).

---

## 0. Posição de partida — para constar

A pergunta que eu sempre faço primeiro é: *por que vocês querem microservices?* E aqui ninguém quer — o que é, francamente, refrescante. Modular monolith em Postgres, time de 1 dev, tecnologia entediante, fase-gating com Concierge manual antes de construir qualquer coisa. Se todo cliente meu chegasse assim, eu teria que arrumar outro emprego.

Então registro logo: **a decisão macro está certa.** Monolith first não é consolação — é a arquitetura correta para este time, este prazo e este domínio. Minha crítica não é "deveria ser distribuído". É o oposto: **um monolith modular só permanece modular se as fronteiras internas forem reais.** E é exatamente aí que encontrei os furos. Um monolith com fronteiras furadas não vira microservices ruim — vira *big ball of mud* com schemas decorativos, que é pior, porque parece organizado.

Vamos aos furos. Cada um com a correção mínima, porque crítica sem correção é só reclamação com diploma.

---

## 1. S1 — Information hiding entre módulos: os módulos se falam por JOIN, e há um ciclo

### 1.1 Schemas Postgres são namespaces, não fronteiras

O doc 02 (S2) vende os 4 schemas (`core/gestao/ref/app`) como "fronteira de módulo física". Preciso ser o chato que aponta: **schema Postgres não esconde nada.** Qualquer código com uma conexão pode dar `SELECT` em qualquer schema, fazer JOIN cross-schema, e construir dependência que nenhum diagrama registra. Schema é organização de armário; information hiding é porta com fechadura. O clássico assassino de monolitos modulares não é o código — é o banco compartilhado, porque o acoplamento pelo banco é invisível até o dia em que você tenta mudar uma tabela e descobre quem mais lia ela.

A pergunta de teste: *se eu renomear uma coluna de `gestao.tarefa`, o que quebra em `core`?* Hoje a resposta honesta é "ninguém sabe, vai descobrir em produção". Isso é a definição de fronteira que não existe.

**A regra que falta (correção mínima, N-W1):**

> **Módulo só escreve nas próprias tabelas. Cruzou de schema, é interface publicada** — view com prefixo `api_` ou RPC. Exceção única e nomeada: o **kernel de identidade** (`core.escritorio`, `core.usuario`, `core.cliente`) é compartilhado por FK — é o vocabulário de tenancy, todo mundo pode referenciar.

Custo: zero infra. É uma convenção + uma fitness function: um teste de CI que parseia as migrations/queries e grita quando um módulo toca tabela alheia fora do kernel (o equivalente SQL do dependency-cruiser que o brainstorm S4 já pedia e ninguém desenhou). Para 1 dev, isso é MAIS importante do que para um time de 50 — porque o dev solo não tem colega para dizer "ei, você não devia ler essa tabela".

O que **não** recomendo: API HTTP interna entre módulos, camada de serviços, mediator. Isso é pagar o imposto de sistema distribuído dentro do próprio processo. Views e RPCs com nome de contrato bastam — e o doc já tem o instinto certo em dois lugares (a "view canônica de medição" do billing M-10 e as RPCs `core.aprovar_apontamento`). O instinto existe; falta promovê-lo a regra.

### 1.2 O ciclo core↔gestao — ADP violado no dia 0, com FK e tudo

Aqui o achado concreto. No doc 02:

- `gestao.*` inteiro depende de `core` (todas as tabelas têm FK para `core.escritorio`, `core.cliente`, `core.usuario`) — esperado, kernel de identidade.
- **Mas `core.usuario.departamento_id` tem FK para `gestao.departamento`** (§3.1 + §4: `alter table core.usuario add constraint fk_usuario_departamento foreign key (departamento_id) references gestao.departamento(id)`).

Resultado: **core → gestao → core. Ciclo de dependência entre módulos, materializado em DDL, na migration 001.** O módulo mais estável do sistema (identidade, que sustenta o moat) depende de um conceito organizacional do módulo mais volátil (a camada Gestorize, cujo próprio código-fonte ainda é uma incógnita — Spike 5). Se o Spike 5 falhar e a camada Gestão mudar de forma, a tabela `core.usuario` participa do estrago. É exatamente o cenário SDP/SAP que o brainstorm S1 suspeitava — e está confirmado.

Tem um segundo tentáculo do mesmo ciclo: `gestao.alvara_certidao.ecac_consulta_id → core.ecac_consulta`. Menos grave (é `set null`, e a direção gestao→core é a tolerada), mas note que a "ponte" acopla a camada Gestão a uma tabela do **add-on** e-CAC — produto vendido à parte (D9). A Gestão de quem não comprou o add-on carrega FK para a tabela dele.

**Correção mínima (N-W2):** inverter a posse. "A qual departamento o usuário pertence" é um fato da **Gestão**, não da identidade. Remover `core.usuario.departamento_id`; criar `gestao.usuario_departamento (usuario_id, departamento_id)` no schema gestao. O ciclo morre, `core.usuario` volta a ser estável, e o custo é um JOIN a mais nas telas de dashboard — que já são da Gestão mesmo. Dez minutos de DDL agora; uma migração de dados chata daqui a 18 meses.

### 1.3 A porta de entrada do core mora na casa da Gestão

Sutil, mas estrutural: **o caminho canônico de entrada de uma nota fiscal no core é `gestao.documento`** (doc 02 §4: "No dia 0 é a PORTA DE ENTRADA do XML: upload → tipo_detectado=xml_nfe → parser cria core.nota"). Ou seja, o fluxo mais crítico do produto — ingestão do insumo que alimenta motor, trilha e laudo — **atravessa o módulo Gestão para nascer**. O princípio 4 do doc 17 declara "pipeline único de ingestão" como componente do core, mas no schema o primeiro estágio desse pipeline é uma tabela de outro módulo, com FK `gestao.documento.nota_id → core.nota` amarrando os dois.

Eu entendo o porquê (D1: reusar Documentize, não reescrever — decisão certa). O problema não é reusar; é **não nomear a fronteira**. Do jeito que está, Documentize não é um *adapter de origem* do pipeline — é um pedaço do pipeline que por acaso mora em outro módulo. Quando a F2 chegar com o webhook do provider entrando por `core.ingestao_evento`, vocês terão **duas portas de entrada com contratos diferentes em módulos diferentes** para o mesmo conceito ("chegou documento fiscal").

**Correção mínima (N-W3):** declarar (no doc 17 §2 e no contrato de código) que **Documentize é uma ORIGEM, não um estágio**: o pipeline de ingestão é do core, e toda origem — upload/Documentize, provider, EFD — entrega no MESMO ponto de entrada (na F1/F2, o staging `core.ingestao_evento`, que já existe e está bem desenhado; no dia 0, a RPC que cria `core.nota`+evento). Documentize vira o primeiro adapter do pipeline, não o vestíbulo dele. Custo: zero código novo no dia 0 — é uma frase de arquitetura que evita que o acoplamento calcifique.

### 1.4 Onde o desenho ACERTA (para a rodada adversarial não me acusar de só reclamar)

- **RPCs transacionais como única escrita de estado** (`core.aprovar_apontamento`) — isso É information hiding no banco: o app não conhece a mecânica estado+evento. Padrão correto, estender a TODA escrita cross-módulo.
- **`ref` sem tenant, read-only, escrita só por job** — fronteira limpa, contrato claro (Padrão 6 de RLS). Sem reparos.
- **Billing medido por view canônica** (M-10/doc 02 §11) — view como interface publicada é exatamente o que prego no 1.1. Só falta dar nome de contrato e proibir o billing de ler `core.apontamento_auditoria` direto.

---

## 2. S6 — Anti-corruption layer: meio ACL, e o dialeto vaza em três lugares

Quatro terceiros: provider de captura (Focus/PlugNotas), SERPRO, ACT, base licenciada. A pergunta: o "adapter por origem" traduz na borda para um modelo de domínio próprio, ou o domínio fala o dialeto deles? Resposta: **dois traduzem bem, dois vazam.** Vazamentos concretos, coluna por coluna:

### 2.1 ✅ Base licenciada — ACL de verdade
O job de importação traduz o dataset licenciado para `ref.cclasstrib_regra` (modelo nosso), com `base_versao.fonte` registrando a origem e a hierarquia de camadas (M-4) subordinando a licenciada à oficial. O domínio nunca fala "tecnospeed" — fala `camada='licenciada'`. É o padrão a copiar.

### 2.2 ✅ (com um furo) Provider de captura — staging certo, mas `provider_meta` em `core.nota`
`core.ingestao_evento` é um ACL canônico: payload bruto na borda, idempotência por `dedup_key`, worker normaliza para `core.nota`. Bonito. **E então `core.nota.provider_meta jsonb` ("NSU, manifestação, ids do provider") estraga a festa**: o dialeto do provider atravessa a tradução e se aloja NA tabela de domínio central. NSU é conceito do NFeDistribuicaoDFe (SEFAZ), defensável como metadado regulatório; "ids do provider" não é — é exatamente o tipo de coluna que daqui a um ano alguma query de suporte lê, e quando vocês trocarem Focus→outro (cenário Q2!), descobrirão consumidores do jsonb que ninguém mapeou. O próprio doc 02 §11 avisa: "nunca decidir negócio lendo jsonb cru" — então não dê ao negócio um jsonb cru para ler.

**Correção (N-W4):** `core.nota` carrega só proveniência neutra (`origem` + `ingestao_evento_id`). O bruto do provider já mora no staging — quem precisar do NSU/manifestação segue a referência. Apagar a coluna `provider_meta` antes da migration da F2. Bônus: o CHECK `provider in ('plugnotas','focus')` em `provider_conexao` transforma "adicionar provider" em migration; trocar por tabela `ref.provider` ou soltar o CHECK — adapter que exige ALTER TABLE para conhecer um fornecedor novo não está escondendo o fornecedor.

### 2.3 ❌ SERPRO — códigos de serviço do fornecedor batizando o domínio
M-8 manda remodelar `core.procuracao_eletronica` **"por serviço (código SERPRO: 00006, 00002…)"**. Isso é o dialeto do SERPRO virando chave primária semântica do NOSSO conceito de procuração. O domínio deveria falar a língua do negócio — `caixa_postal`, `situacao_fiscal`, `cnd_federal` (que `ecac_consulta.tipo_consulta` já fala!) — e um mapa de adapter deveria traduzir para 00006/00002 na borda. Do jeito do M-8, quando o SERPRO renumerar o catálogo (e catálogos de estatal renumeram), ou quando o fallback Infosimples (que já está no CHECK de `origem`!) usar outra taxonomia, a tradução acontece... onde? Em todo lugar. Ou seja, em nenhum.

**Correção (N-W5):** `procuracao_eletronica.servico` usa a taxonomia interna (a mesma de `tipo_consulta`); tabela de mapa `ref.ecac_servico_map (servico_interno, origem, codigo_externo, vigencia)` traduz na borda do conector. O gate "consulta referencia a procuração que a autoriza" (M-8, correto e importante) fica intacto — só muda o idioma da chave. Uma tabela e um JOIN; é o ACL inteiro do add-on.

### 2.4 🟡 ACT — pequeno, mas registre o formato
O carimbo entra como `tipo_evento='ancora_temporal'` com o recibo TST no storage. Razoável. Só garanta que o payload do evento guarde **emissor da ACT + algoritmo + referência do TST em formato neutro** — se a ACT contratada mudar (N-2 ainda vai cotar), a verificação de 2031 não pode depender de saber qual fornecedor era. Custo: definição de payload, zero schema.

**Veredito S6:** a arquitetura tem *instinto* de ACL (staging, importação traduzida, "ingestão neutra" como mitigação de lock-in no §13) mas não tem a *disciplina* — e ACL é 100% disciplina: a regra é "o modelo deles para de existir na borda", e hoje ela é violada por 3 colunas nomeáveis. Todas corrigíveis antes da migration 001/F2 por um custo que arredonda para zero.

---

## 3. Deploy e operabilidade — a lacuna real do documento (não é YAGNI)

1 dev, 1 monolith, 4 superfícies de produto (core, Gestão, add-on e-CAC, Demo Kit), 1 banco, e um pico de carga mensal previsível e brutal (dias 1–12, SLA "95% antes do 1º dia útil"). O doc 17 tem §11 inteiro de observabilidade (bom!) e **zero linhas sobre como uma release chega em produção**. Vamos separar o que é YAGNI legítimo do que é lacuna:

**YAGNI legítimo (não construam):** blue/green, canary, k8s, feature-flag-as-a-service, deploy independente por módulo. Monolith de 1 dev deploya inteiro e está ótimo — *desde que deployar seja entediante*.

**Lacuna (barato demais para não ter):**

1. **(N-W6) Migrations expand/contract como regra escrita.** O banco é o substrato compartilhado das 4 superfícies — uma migration destrutiva derruba tudo junto, e `core.nota` particionada com RLS não é tabela que se restaura às pressas. Regra: toda migration em duas fases (expandir: adicionar coluna/tabela/view nova → código novo passa a usar → contrair: remover o velho N dias depois). Custo: um parágrafo no doc + disciplina. Sem isso, "zero-downtime" é sorte, não propriedade.
2. **(N-W7) Janela de congelamento no pico: nenhuma migration nos dias 1–7.** Deploy de código tudo bem; DDL na semana em que 200 CNPJs × alto SKU estão sendo apurados com SLA D+1 é roleta. É um `if` no CI olhando o calendário. O doc desenha o pico (§6.2, R6) e não desenha a consequência operacional dele.
3. **(N-W8) Flag mínima para a peça não-determinística: versão do motor por tenant.** Não é feature flag genérica — é UMA alavanca: `motor_versao` ativo por tenant (ou global com rollout por tenant), para que (a) uma versão nova do motor que passou no golden-set possa subir para 2 tenants antes de 200, e (b) reverter motor seja UPDATE, não deploy. Detalhe que descobri lendo o schema: o evento `base_referencia_atualizada` comenta "(por tenant: quando passou a valer)" — **o desenho já PRESSUPÕE adoção de base por tenant, mas não existe tabela de estado para isso.** Evento sem estado é história sem presente. Falta `core.base_adocao (escritorio_id, base_versao_id, vigente_desde)` — e a mesma tabela resolve a Q3 (NT na sexta-feira: importa a base nova, adota tenant a tenant, reanálise de impacto controlada, pico protegido).
4. **(N-W9) O pipeline de CI é o mecanismo de segurança da release — nomeá-lo assim.** Os ingredientes já existem espalhados: golden-set como gate (Q8), banlist como teste (§1.8), teste de isolamento RLS por tabela (§10). Falta juntar numa frase: *nenhum deploy sem os três verdes* + o linter de fronteira do N-W1. Para um monolith de 1 dev, o deployment pipeline É o colega de review.

Com esses quatro, "uma release quebra tudo junto" vira "uma release é um evento sem graça" — que é o único tipo aceitável de release.

---

## 4. CUPID sobre a arquitetura inteira

Propriedades, não regras — a escola do Dan. Nota por propriedade:

### Composable — scope sucinto? **Quase.**
Os módulos conceituais (Ingestão, Motor, Trilha, Saídas, Gestão) têm scope claro. Mas o schema `core` virou o armário de tudo que não é Gestão: nota+auditoria+laudo+trilha **e também** e-CAC (`procuracao_eletronica`, `ecac_consulta`), provider (`provider_conexao`, `ingestao_evento`), billing (`consumo_mensal`, `assinatura` — M-10) e implantação (M-11). O e-CAC é **produto vendido à parte, com bolso separado, por decisão de negócio travada (D9)** — e mora dentro do schema do core como se fosse fígado. Billing idem: metering é preocupação de plataforma, não de apuração. `core` está no caminho de virar o "god schema" — o mesmo defeito do god-component, um nível abaixo.
**Correção (N-W10):** schemas `ecac` e `billing` desde a migration que os criar (a do e-CAC já é separada — "MIGRATION add-on", então o corte é natural; só mudar o prefixo). Custo agora: um `create schema`. Custo em 18 meses: reescrever FKs, RLS, e cada query do add-on.

### Unix philosophy — o pipeline faz UMA coisa bem? **Sim — proteger isso.**
"Pipeline único, origem é metadado, duas classes de insumo" é Unix de verdade: uma coisa (normalizar documento fiscal em nota auditável), composição na entrada (adapters) e na saída (motor consome, trilha registra). O risco não é o desenho — é a erosão do §1.3 (a porta de entrada no módulo errado) e a tentação futura de o pipeline "já aproveitar e" classificar/notificar/faturar. A resposta para todo "já aproveitar e" é: outra peça, composta depois.

### Predictable — **aqui mora o S2, e a resposta do doc está incompleta.**
Produto cuja promessa é *previsibilidade jurídica* com um motor *regras+RAG* no meio. O doc acerta ao gravar `base_versao_id` + `motor_versao` + params no evento `analise_executada`. Mas:
- **`motor_versao` é um string sem anatomia.** Motor RAG = modelo LLM + prompt + modelo de embedding + thresholds + código. Se qualquer um desses muda sem girar a versão, a reprodutibilidade de 2031 é teatro. **Correção (N-W11):** tabela `ref.motor_versao (id, codigo_versao, modelo_llm, prompt_hash, embedding_modelo, config jsonb, criada_em)` — a versão vira um FATO com componentes, não uma etiqueta. Vinte linhas de DDL que transformam o S2 de furo em resposta.
- **Proveniência por método.** `apontamento.origem in ('manual','motor')` não distingue *regra determinística* de *sugestão RAG* — e a defesa jurídica das duas é diferente (a regra cita a linha da base; o RAG cita uma similaridade). **Correção (N-W12):** `apontamento.metodo in ('regra','rag','hibrido')` + o evento carrega qual. Espelha as "duas classes de insumo" (§3.6) no lado da inferência — mesma lógica, mesmo custo: uma coluna.
- E a verdade desconfortável que ninguém escreveu: **um LLM re-executado em 2031 não reproduz o output de 2027 byte a byte, com ou sem versão pinada.** A defensabilidade real do laudo NÃO é "podemos re-rodar o motor" — é "registramos o que o motor disse, com que insumos, e um contador habilitado DECIDIU". O moat é a trilha da decisão humana, não o determinismo da máquina. O doc já construiu isso (§3.4/§3.5) — só precisa parar de implicar reprodutibilidade de máquina onde o que existe (e basta) é reprodutibilidade de *evidência*. Uma frase de honestidade no §3.3 evita uma perícia constrangedora.

### Idiomatic — Supabase/pgmq/RLS para 1 dev BR? **Sim, francamente exemplar.**
Tecnologia entediante, um fornecedor, SQL em todo lugar, RLS como mecanismo nativo, fila no mesmo banco preservando transacionalidade (a análise pgmq vs pg-boss vs Redis no doc 02 §9.2 está correta — o gotcha do pooler é real). Sobre limites: pgmq aguenta milhares de mensagens/minuto com folga; o ponto de virada para broker dedicado fica na casa de >10k msg/s sustentado — vocês estão 4 ordens de grandeza abaixo (milhares/dia). Fontes: [Supabase Queues (pgmq) — docs oficiais](https://supabase.com/docs/guides/queues/pgmq), [Supabase Queues — anúncio/garantias](https://supabase.com/blog/supabase-queues), [análise de limites práticos pgmq em produção](https://www.supascale.app/blog/background-jobs-and-queues-for-selfhosted-supabase-with-pgmq). Única ressalva idiomática: `revoke ... from service_role` na trilha é heterodoxo no Supabase (muita lib assume service_role onipotente) — está CERTO para o moat, mas documentem, porque o Breno-de-2027 vai tropeçar nisso às 23h.

### Domain-based — o código fala a língua do negócio? **Melhor schema que já revisei nesse quesito.**
`apontamento_auditoria`, `evento_boa_fe`, `competencia`, `laudo`, `fato_gerador_em`, `decisao_lote`, `aprovado inerte` — o domínio fiscal brasileiro está NO schema, em pt-BR, alinhado ao glossário do CONTEXT. Sem ironia: isso vale dinheiro. A exceção que confirma: `ingestao_evento.payload/status` genéricos — aceitável, staging é borda.

### Onde SOLID-compliance deixaria PIOR (a pergunta do mandato)
- **OCP no pipeline:** "novo insumo entra sem modificar o pipeline" levado a sério = registry de plugins, interfaces de estágio, indireção. Para 1 dev, **modificar o pipeline é barato e óbvio**; a abstração é cara e especulativa. CUPID-Predictable > OCP: pipeline linear que se lê de cima a baixo.
- **ISP no laudo:** 4 consumidores (Demo Kit, Relatório de Valor, export ERP, PDF) → 4 contratos segregados → 4 DTOs para sincronizar. Melhor: **um laudo canônico + uma view por consumidor** (e a banlist testando todas). Views são ISP de gente pragmática.
- **DIP no lookup da base:** port/adapter sobre `ref.cclasstrib_regra` para "trocar a implementação"? A implementação é uma tabela versionada com EXCLUDE de vigência — ela É a abstração. Interface na frente seria cerimônia.
- O lugar onde DIP **vale**: a borda dos 4 terceiros (§2) e o contrato do motor (§5). Dependência invertida onde há fornecedor de verdade do outro lado; nada de interface onde só há SQL nosso.

---

## 5. A fronteira que ninguém desenhou — quem sai do monolith em 18 meses?

Pergunta de teste de fronteira: *se UM módulo tiver que sair, qual, e dói quanto?* Três candidatos:

1. **Motor de auditoria — o mais provável, e o doc JÁ admite** (A8: "Node no F1; extrair Python depois se o eval exigir — fronteira limpa via fila"). Ótimo. Exceto que... **o contrato do motor não está escrito em lugar nenhum.** Como o motor recebe trabalho? Como devolve apontamentos? Se a resposta de fato for "consome batch da fila pgmq, lê `ref` pinada por `base_versao_id`, escreve via RPC `core.criar_apontamento` que grava estado+evento" — então a extração futura é realocar um worker: troca-se o runtime, o contrato fica. Se o motor for funções Node fazendo INSERT direto no meio da transação de ingestão, a "fronteira limpa via fila" do A8 é aspiração, e a extração é cirurgia. **Correção (N-W13): escrever o contrato do motor AGORA** (entrada: mensagem com `item_ids + base_versao_id + motor_versao_id`; saída: RPC; proibido: motor escrever em qualquer tabela que não seja via RPC). É uma página. É também o que torna o golden-set executável contra o motor isolado — Q8 de graça.
2. **Add-on e-CAC — o mais provável comercialmente** (produto à parte, comprador à parte, bolso à parte — D9; e se a "mina" de R$2k/mês decolar, é o primeiro candidato a virar produto independente ou a ser vendido para quem já tem outro core). Hoje a extração seria coração aberto: tabelas no schema `core`, FK direta de `gestao.alvara_certidao`. Com N-W5 + N-W10 (taxonomia própria + schema `ecac`), a extração vira "mover um schema e trocar uma FK por referência fraca". Pagamento agora: trocadilho de prefixo.
3. **Ingestão — improvável e desnecessário.** Volume está ordens de grandeza abaixo de qualquer limite (§4-Idiomatic), e a transacionalidade nota+evento+trilha no mesmo banco é uma PROPRIEDADE do moat, não uma dívida. Extrair ingestão seria trocar consistência transacional por dual-write — pioraria o produto. Não desenhem para isso.

**Resposta direta à pergunta do mandato:** a arquitetura atual permite a extração do motor *se e só se* o contrato N-W13 for escrito antes do F1; e a do e-CAC *se e só se* ele nascer no próprio schema. Ambas as condições custam um dia de trabalho somadas. Sem elas, em 18 meses ambas são cirurgias.

---

## 6. Q1–Q8 pela minha lente

| # | Cenário | Resposta da arquitetura hoje | Veredito Newman |
|---|---------|------------------------------|-----------------|
| Q1 | Reconstituir laudo de 2027 em 2031 | base pinada + trilha + carimbo ACT ✅; mas `motor_versao` sem anatomia (modelo/prompt/embedding) e expectativa implícita de re-execução de LLM | **PARCIAL** → N-W11/N-W12 + reframe honesto: reprodutibilidade de *evidência e decisão*, não de inferência |
| Q2 | Trocar Focus→outro em 30 dias | staging neutro + XML bruto nosso ✅; `provider_meta` em `core.nota` + CHECK enum de provider são o atrito escondido | **SIM, com N-W4** — sem ela, os 30 dias viram caça a consumidores de jsonb |
| Q3 | NT muda na 6ª, pico na 2ª | importação versionada + reconciliação ✅; **falta o estado de adoção por tenant** (o evento pressupõe, a tabela não existe) e falta freeze de DDL no pico | **PARCIAL** → N-W7 + `core.base_adocao` (N-W8) |
| Q4 | Dia 5, 200 CNPJs alto-SKU, 95% antes do 1º dia útil | pgmq folgado (4 ordens de magnitude — fontes no §4); partições+índices parciais corretos | **SIM** para carga; o risco do pico é release, não throughput → N-W6/N-W7 |
| Q5 | Pen-test cross-tenant / preço vazando | RLS default-deny, claim não-editável, partições sem grant, teste de isolamento no CI | **SIM** no desenho (defiro detalhe ao especialista de dados); acrescento: roles de banco POR MÓDULO seriam a 2ª linha barata — a fronteira do §1.1 vira também fronteira de segurança |
| Q6 | Captura ligada por engano na carteira toda | default OFF + decisão explícita + teto/tenant **no adapter** | **SIM** — guardrail no lugar certo (a borda); só torná-lo dado (config por tenant), não constante no código |
| Q7 | Gestorize vem ruim (Spike 5 falha) | "plano B = reuso de spec, +30-40%" | **MELHOR do que o doc admite**: o schema `gestao.*` foi desenhado da matriz de features, NÃO do código Gestorize — o modelo de dados do plano B JÁ EXISTE. O que falta estimar é só UI. Reescrevam o risco §13 com essa precisão; e N-W2/N-W3 valem dobrado se o código vier ruim |
| Q8 | Falso-positivo +2pp após troca de embedding | golden-set como gate de CI | **SIM, com N-W11** — sem anatomia de versão, o gate não sabe O QUE mudou; com ela + contrato do motor (N-W13), o eval roda contra o motor isolado |

---

## 7. Lista consolidada de correções mínimas (para a síntese)

| # | Correção | Custo | Quando |
|---|----------|-------|--------|
| N-W1 | Regra de fronteira: módulo só escreve nas próprias tabelas; cruzou schema = view `api_`/RPC; kernel de identidade é a exceção nomeada. Fitness function no CI | Convenção + script de lint | Antes do F1 |
| N-W2 | Matar o ciclo core↔gestao: remover `core.usuario.departamento_id`; criar `gestao.usuario_departamento` | 10 min de DDL | Migration 001 |
| N-W3 | Documentize = ORIGEM (adapter), não estágio do pipeline; toda origem entrega no mesmo ponto de entrada do core | 1 parágrafo no doc 17 | Agora |
| N-W4 | Remover `core.nota.provider_meta`; proveniência neutra (`origem` + ref ao staging); CHECK de provider → tabela | DDL trivial | Antes da F2 |
| N-W5 | e-CAC: taxonomia interna de serviço + `ref.ecac_servico_map` traduzindo códigos SERPRO na borda (M-8 revisada) | 1 tabela + 1 JOIN | Migration do add-on |
| N-W6 | Migrations expand/contract como regra escrita | 1 parágrafo | Agora |
| N-W7 | Freeze de DDL nos dias 1–7 do mês | 1 check no CI | Antes do F1 |
| N-W8 | `core.base_adocao` (estado de adoção de base por tenant — o evento já pressupõe) + rollout de motor por tenant | 1 tabela | F1 |
| N-W9 | Nomear o pipeline de CI como gate de release: golden-set + banlist + isolamento RLS + lint de fronteira | Junção do que existe | F1 |
| N-W10 | Schemas `ecac` e `billing` próprios (tirar do `core`) | Prefixo nas migrations | Migration que os criar |
| N-W11 | `ref.motor_versao` com anatomia (LLM, prompt_hash, embedding, config) | ~20 linhas DDL | F1, antes do 1º eval |
| N-W12 | `apontamento.metodo ('regra','rag','hibrido')` — proveniência por método de inferência | 1 coluna | F1 |
| N-W13 | Contrato escrito do motor: fila in / RPC out / proibido INSERT direto | 1 página | Antes do F1 |

Nenhuma exige infra nova. Nenhuma atrasa o Concierge. Todas ficam 10–100× mais caras se esperarem 18 meses.

---

## 8. Veredito

**As fronteiras internas aguentam 18 meses de evolução? COM CORREÇÕES.**

O esqueleto está certo — monolith first de verdade, tecnologia idiomática, domínio na língua do negócio, trilha com mecânica séria. Mas o que separa um monolith *modular* de um monolith *com schemas bonitos* são exatamente as coisas pequenas que este documento ainda não tem: a regra de quem pode ler o quê (N-W1), o ciclo de dependência já materializado em FK (N-W2), o dialeto de três fornecedores alojado no domínio (N-W4/5), o contrato da única peça que o próprio doc planeja extrair (N-W13), e uma história de release para um sistema cujo pico mensal é conhecido com antecedência de anos (N-W6–8).

A boa notícia, e digo isso com o entusiasmo contido de quem já viu o filme terminar mal dezenas de vezes: **todas as correções cabem numa semana e nenhuma conflita com decisão de negócio travada.** O barato de consertar fronteira é consertá-la enquanto ela é uma linha num documento. Depois vira uma linha num auto de infração — e aí já não é comigo, é com o Heleno.

— Newman. Model around business domains, not technical boundaries. 🏗

**Sources (dado ao vivo, §4-Idiomatic):**
- [Supabase Queues / pgmq — documentação oficial](https://supabase.com/docs/guides/queues/pgmq)
- [Supabase Queues — anúncio e garantias de entrega](https://supabase.com/blog/supabase-queues)
- [pgmq em produção self-hosted — limites práticos de throughput](https://www.supascale.app/blog/background-jobs-and-queues-for-selfhosted-supabase-with-pgmq)
