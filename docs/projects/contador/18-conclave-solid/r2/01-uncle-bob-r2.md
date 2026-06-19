# Conclave SOLID — Rodada 2 ADVERSARIAL · Uncle Bob Martin 🧹

> **Agente:** uncle-bob-martin (mind clone — SOLID, Component Principles, Clean Architecture)
> **Data:** 2026-06-12 · **Alvo:** `17-arquitetura-core-v1.md` + `16/02-data-engineer-schema.md`
> **Insumos R1:** minha análise (`01`), Fowler (`02`), Kleppmann (`03`), Newman (`04`), Beck (`05`)
> **Regra de engajamento R2:** refutar de verdade, citar pelo nome, ceder onde devo, e fechar com UM patch v1.1 que eu defendo no voto.

---

## 0. Onde estamos depois da Rodada 1

A R1 produziu uma convergência incomum: **cinco lentes diferentes apontaram para os mesmos quatro furos**. Isso não é coincidência — é o sintoma de uma arquitetura cuja espinha está certa e cujas *fronteiras* não foram traçadas. Os quatro pontos de consenso, traduzidos para a minha linguagem:

1. **O ciclo `core → gestao` (V3 / N-W2 / Newman §1.2)** — todos viram a FK `core.usuario.departamento_id`.
2. **O motor sem versão de primeira classe (V6/§4 / K-8 / N-W11 / F-10 / Beck §3)** — todos viram que `motor_versao` é uma string num jsonb.
3. **O dialeto do fornecedor dentro do `core` (Fowler §2.1 / N-W4 / K-12)** — `provider_meta`, `ultimo_nsu`, enum `'documentize'`.
4. **A re-executabilidade do §3.3 é uma alegação falsa (todos)** — RAG não re-executa.

Cinco pessoas independentes batendo no mesmo prego significa que o prego existe. Mas a R2 não é para celebrar consenso — é para **brigar onde discordamos**, porque é nas discordâncias que mora o que o conclave ainda não decidiu. E há três brigas reais.

---

## 1. REFUTAÇÕES — onde os outros estão errados, ou perigosamente incompletos

### 1.1 Beck quer cortar o RAG da F1 (K-1) — e ao fazê-lo, ENFRAQUECE a minha correção mais cara. REFUTO.

Beck (`05` §2, corte K-1) propõe: *"RAG/embeddings saem da F1; motor determinístico de regras puras resolve o grosso; RAG adiciona não-determinismo ANTES de provarmos o determinístico."* É um argumento de simplicidade sedutor, e ele está **metade certo e metade perigoso**.

Onde Beck está certo, e eu **cedo** (ver §3): separar a camada determinística da camada RAG é a coisa correta — eu mesmo pedi isso (§4, movimento 2: "Classificador determinístico" vs "Sugestor RAG"). Beck e eu convergimos na *fronteira*.

Onde Beck está perigosamente errado: ele trata "cortar o RAG da F1" como se isso **dispensasse** versionar o motor. Não dispensa — e o próprio Beck reconhece isso no §3 dele ("Achado de contrato de dados") ao exigir que o payload de `analise_executada` carregue versão completa do motor *"mesmo que o RAG só exista depois"*. Então o que eu quero que o conclave entenda: **`P-UB1` (`ref.motor_versao` como entidade) NÃO depende do RAG existir na F1.** O motor determinístico TAMBÉM tem versão: o código que interpreta as regras, o `regras_pacote_hash`, os thresholds de materialidade, a lógica de desempate. Beck adia o RAG; Beck **não** pode adiar a anatomia da versão, porque é contrato de dados — e contrato de dados não-capturado é, nas palavras do próprio Beck, *"irrecuperável"*.

A refutação precisa, então: cortar o RAG é decisão de **escopo/calendário** (território do Beck, e ele provavelmente tem razão na aritmética). Versionar o motor é decisão de **contrato de dados** (meu território), e ela é **ortogonal** ao corte. Se o conclave aceitar K-1 e rejeitar P-UB1 achando que "sem RAG não precisa", terá cometido o erro de confundir as duas. O motor determinístico de 2027 também será refatorado até 2031; o laudo precisa saber qual versão dele rodou. **Beck me ajuda a simplificar o QUE versiono; ele não me autoriza a NÃO versionar.**

### 1.2 Newman diz que "schema Postgres não é fronteira" (§1.1) — isso parece invalidar minha análise de módulos. NÃO invalida; REFORÇA. Mas Newman para cedo demais.

Newman (`04` §1.1) escreve: *"schema Postgres não esconde nada... schema é organização de armário; information hiding é porta com fechadura."* Lido superficialmente, isso parece dizer que minha seção 3.1 (SRP/CCP sobre os schemas) ataca uma fronteira que nem existe — logo, por que insistir em descer billing/e-CAC do `core` se nenhum dos schemas é fronteira de verdade?

**REFUTO a leitura, e estendo o Newman.** Newman está certo sobre o mecanismo (schema não impõe encapsulamento) e **errado na conclusão implícita** de que isso torna a organização em schemas irrelevante. A Dependency Rule não fala de mecanismos de *enforcement* — fala de **direção de dependência de código-fonte**. Um schema mal-cortado (o god-schema `core`) é uma violação de CCP *independentemente* de o Postgres permitir ou não o JOIN cross-schema. A diferença entre nós é de ênfase, não de substância:

- Newman diz: "a fronteira não é real até ter fitness function" → e propõe N-W1 (lint de quem-lê-o-quê).
- Eu digo: "mesmo COM fitness function, se você cortou os schemas errado (billing dentro de core), a fitness function vai *proteger a fronteira errada*."

Ou seja: **a fitness function do Newman protege a direção; o meu corte de CCP define ONDE a fronteira deve estar.** Sem o meu corte (P-UB4: schemas `billing`/`ecac` próprios), o lint do Newman vai alegremente permitir `core → billing` porque ambos são "core". Newman precisa do meu corte de componentes ANTES de o lint dele ter o que defender. Os dois são complementares, e o conclave deve travar **os dois**, nesta ordem: primeiro corta (CCP), depois enforça (fitness function). Newman parou no enforcement e pulou o corte.

E há um ponto onde Newman está **simplesmente certo e eu subestimei**: roles de banco por módulo (§6, Q5 dele). Eu tratei a fronteira de schema como questão de *design* (ADP/CCP); Newman aponta que ela pode virar fronteira de *segurança* barata — um role Postgres por módulo que só recebe grant nas próprias tabelas transforma a convenção em mecanismo real. Isso é information hiding com fechadura, no banco, sem custo de runtime. **Incorporo ao meu patch.** É a "porta com fechadura" que Newman cobrou e que nem ele desenhou.

### 1.3 Kleppmann tem RAZÃO sobre K-1 (a porta lateral do PostgREST) — e isso EXPÕE um furo na MINHA própria correção. CEDO e corrijo a mim mesmo.

Kleppmann (`03` §1.2) achou algo que eu **não vi** e que destrói parte do meu pacote de domínio se eu não o endereçar. Eu propus (P-UB6) que as RPCs sejam cascas finas delegando ao domínio TypeScript, e que os triggers sejam o backstop. Bonito. Mas Kleppmann mostra que **existe uma policy de UPDATE direto em `apontamento_auditoria` para `authenticated`** — ou seja, há um caminho de escrita de estado que **não passa pela minha RPC nem pelo meu domínio**. PATCH via PostgREST muda `status` sem invocar `core.aprovar_apontamento`, e o domínio TypeScript inteiro fica *by-passed*.

Isto é devastador para a minha tese e eu **cedo sem reservas**: de nada adianta o pacote `@contador/dominio` ser a "fonte única da política do ato privativo" (V5) se há uma porta de banco que pula o pacote. O Kleppmann encontrou o buraco na minha própria Dependency Rule: **a política inverte corretamente para o domínio só se TODO caminho de escrita passar pela porta certa.** A correção dele (K-1: matar a policy de UPDATE direto; escrita só por RPC `security definer`; constraint trigger que aborta UPDATE sem evento na mesma transação) é **pré-condição** da minha P-UB6. Sem K-1, minha P-UB6 é teatro de arquitetura limpa por cima de um banco que não a respeita.

Reconheço a hierarquia: **K-1 (Kleppmann) é mais fundamental que P-UB6 (minha).** A minha correção assume um banco que só aceita escrita pela porta da frente; o Kleppmann provou que o banco hoje tem porta dos fundos. Cedo a precedência.

---

## 2. BLIND SPOTS — o que NINGUÉM viu nas cinco análises de R1

### 2.1 🔴 O Stable Abstractions Principle invertido: as RPCs `security definer` são o componente mais ESTÁVEL e mais CONCRETO ao mesmo tempo — e ninguém olhou para a anatomia delas.

Os cinco revisores discutiram *onde* a lógica mora (banco vs domínio), mas ninguém aplicou o SAP (Stable Abstractions Principle) ao artefato que vai ser o mais reusado de todos: **a assinatura das RPCs transacionais** (`core.aprovar_apontamento`, e as futuras `core.rejeitar_*`, `core.regularizar_*`, `core.emitir_laudo`).

O SAP diz: componentes estáveis devem ser abstratos. Uma RPC é, por definição de banco, **maximamente concreta** — é uma função `plpgsql` com corpo. E ela é, simultaneamente, **maximamente estável**: cada tela, cada worker, cada teste, cada futuro adapter Node vai depender da assinatura dela. Componente estável + concreto = **a pior posição na sequência principal de Martin** ("zona da dor"). Quando vocês precisarem mudar a *assinatura* de `aprovar_apontamento` (e vão — Kleppmann já mostrou que ela precisa ganhar uma checagem de idempotência K-7, eu mostrei que ela precisa receber `Usuario` de domínio e não `auth.uid()` V1), TODOS os dependentes quebram de uma vez, sem aviso de compilador, porque `plpgsql` não tem tipo estático na borda.

Ninguém viu isto porque todos pararam em "estado+prova na mesma transação = bom" (e é bom). Mas o **contrato** dessas RPCs nunca foi declarado como artefato versionado. Beck pediu contrato de *payload de evento*; Newman pediu contrato de *motor* (N-W13) e de *fronteira de módulo*; ninguém pediu **contrato da camada de RPCs** — que é a interface pública do core inteiro.

**A correção (entra no patch):** declarar o conjunto de RPCs de escrita como uma **API publicada e versionada** (`core.api_v1`), com:
- assinaturas tipadas geradas para o cliente TS (supabase-js gera tipos — *usar* esse gerador como gate);
- regra additive-only (igual à que Kleppmann pede para o ledger em K-4): nunca mudar assinatura, só adicionar `aprovar_apontamento_v2`;
- um teste de contrato que falha se uma RPC pública sumir ou mudar de assinatura sem bump de versão.

Sem isso, a "casca fina que delega ao domínio" (minha P-UB6) é uma casca fina **sem contrato** — e casca sem contrato é exatamente o acoplamento difuso que a Dependency Rule combate.

### 2.2 🔴 Ninguém auditou a DIREÇÃO de dependência da camada `app.*` — o helper schema é um vetor de acoplamento invisível.

Os cinco focaram em `core ↔ gestao`, `core → ref`, `billing → core`. Ninguém olhou para `app.*` — o schema de helpers (`app.current_escritorio_id()`, `app.current_papel()`, `app.tg_block_mutation()`, `app.tg_set_updated_at()`).

Olhem o que `app.current_papel()` faz: lê `app_metadata.papel` do JWT do **Supabase Auth**. E quem chama isso? As RLS policies do `core` e do `gestao` (V1, que eu já apontei para `auth.uid()`, mas não tinha rastreado a cadeia inteira). Isso significa: **`core.*` (o moat) depende de `app.*` (helper) que depende do mecanismo de Auth do framework.** A direção de dependência do componente mais estável do sistema atravessa um schema "utilitário" e desemboca no vendor. `app.*` parece inócuo — é "só helpers" — mas é exatamente o tipo de componente que, por não ter dono nem disciplina de dependência, vira o cano por onde o detalhe do framework sobe até a política.

Pior: `app.*` não tem nível arquitetural declarado. É invocado por `ref` (não), por `core` (sim), por `gestao` (sim). Um schema sem nível na hierarquia é um schema que **fura qualquer hierarquia** — é o equivalente SQL de uma classe `Utils` estática que toda camada importa. Eu próprio, na R1, citei `auth.uid()` como V1 mas não percebi que o problema era estrutural: **não é uma chamada pontual, é um schema inteiro sem governança de dependência.**

**A correção (entra no patch):** `app.*` precisa de uma regra de nível: ele só pode contornar a Dependency Rule se for **puramente mecânico e sem política** (set_updated_at, block_mutation — OK, são infraestrutura). As funções que leem identidade/papel (`current_papel`, `current_escritorio_id`) NÃO são mecânicas — elas carregam a semântica de "quem é o ator", que é política de domínio. Essas devem (a) ter um nome que grita domínio, não framework, e (b) ser as ÚNICAS que conhecem o formato do JWT — de modo que trocar Supabase Auth toque uma função, não 30 policies. Isto é o Single Choice Principle aplicado ao acoplamento com Auth: *deve haver um e apenas um lugar no sistema que sabe como o ator atual é descoberto.*

---

## 3. ONDE EU CEDO (explicitamente)

Profissionalismo inclui admitir quando o outro está certo. Quatro concessões:

1. **Para Kleppmann (K-1):** cedo a precedência. Minha P-UB6 (domínio como fonte única da política) **pressupõe** a porta única de escrita dele. Sem matar a policy de UPDATE direto, meu pacote de domínio é contornável. K-1 vem antes de P-UB6.

2. **Para Beck (separação determinístico/RAG):** cedo que a *fronteira de inferência* que pedi (§4 mov.2) é, na verdade, a mesma fronteira que ele propõe — e que a versão dele (camada determinística re-executável + RAG como artefato registrado, não computação reproduzível) é o enquadramento **mais honesto** do que "re-verificação" que eu e Kleppmann tateamos. Adoto a formulação de Beck/Kleppmann: a defensabilidade repousa na **decisão humana registrada**, não no determinismo da máquina. Minha §4-movimento-3 já dizia isso; Beck e Kleppmann disseram melhor.

3. **Para Newman (roles de banco por módulo):** cedo que minha fronteira de schema (CCP) era *design sem mecanismo*. O role-por-módulo do Newman dá a ela a "fechadura" que eu não desenhei. Incorporo.

4. **Para Fowler (o schema `gestao.*` já é o plano-B):** cedo um ponto retórico. Eu tratei V4 (porta de entrada no módulo volátil) como risco existencial. Fowler mostrou que o schema `gestao.*` foi modelado da *spec*, não do *código Gestorize* — logo metade do plano-B já existe e o acoplamento ao legado é menos profundo do que minha V4 implicava. Mantenho que a porta de ingestão deve ser nomeada (P-UB8/N-W3), mas concedo que a gravidade que atribuí a V4 estava inflada.

O que **NÃO** cedo: que versionar o motor (P-UB1) é opcional, ou adiável, ou dependente do RAG. Não é. É contrato de dados, nasce no dia 0, e os cinco revisores — incluindo o Beck que quer cortar o RAG — concordam que a anatomia da versão precisa existir desde já.

---

## 4. PATCH v1.1 QUE EU DEFENDO NO VOTO

Consolido o meu pacote da R1 com as correções da R2. Ordem reflete dependência (o que habilita o quê):

| # | Patch | Seção do doc | O que muda concretamente | Origem |
|---|-------|--------------|--------------------------|--------|
| **P-UB1** | `ref.motor_versao` como **entidade versionada** (anatomia: `codigo_versao` git-sha, `regras_pacote_hash`, `modelo_llm`, `prompt_hash`, `embedding_modelo`, `params`, `golden_set_versao`, `hash_manifesto`); FK obrigatória em `analise_executada` e `apontamento_gerado`; coluna `origem_inferencia (regra_deterministica\|sugestao_rag)` no apontamento. **Independe do RAG estar na F1.** | doc 02 §3.3/§3.5; doc 17 §3.1 | §4 R1 + refuta Beck §1.1 |
| **P-UB1b** | **Corrigir a frase falsa do §3.3** ("qualquer laudo re-executável contra base_versao_id"): re-execução só para a camada determinística; RAG = re-verificação de evidência registrada + decisão humana. Validar com Heleno no Spike 6. | doc 17 §3.3 | cede a Beck/Kleppmann §3.2 |
| **P-UB2** | **Quebrar o ciclo `core→gestao`:** remover `core.usuario.departamento_id`; criar `gestao.usuario_departamento`. Direção única enforced: `gestao\|billing\|ecac → core → ref`; nunca o inverso. | doc 02 §3.1/§4 | V3 (=N-W2) |
| **P-UB3** | **Fitness function de fronteira** sobre `pg_constraint`/`pg_depend`: CI falha se `core.*` referenciar `gestao\|billing\|ecac`. **+ roles Postgres por módulo** (grant só nas próprias tabelas — a "fechadura" do Newman). dependency-cruiser quando houver Node. | CI / doc 17 §10 | §3.1 R1 + cede a Newman §1.2 |
| **P-UB4** | Descer **`billing`** e **`ecac`** do god-schema `core` para schemas próprios; `implantacao` → `gestao`/`billing`. Define ONDE a fronteira é, antes do lint do P-UB3 defendê-la. | doc 02 §3.7, M-10/M-11 | CCP (refuta Newman §1.1) |
| **P-UB5** | **Contrato da camada de RPCs como API publicada `core.api_v1`** (BLIND SPOT 2.1): assinaturas tipadas geradas para o cliente como gate de CI; regra additive-only (nunca muda assinatura, só `_v2`); teste de contrato. **Pré-requisito: K-1 (Kleppmann) — escrita SÓ por RPC.** | doc 02 §3.5 | NOVO R2 (SAP) |
| **P-UB6** | **Governança do schema `app.*`** (BLIND SPOT 2.2): funções *mecânicas* (set_updated_at/block_mutation) ficam; funções de *identidade/papel* (`current_papel`, `current_escritorio_id`) são o **único** lugar que conhece o formato do JWT — trocar Auth toca 1 função, não 30 policies (Single Choice Principle). | doc 02 §2 | NOVO R2 (DIP) |
| **P-UB7** | **Pacote de domínio `@contador/dominio`** (TS, zero framework): máquina de estados, materialidade, ato privativo (`podeAprovar(Usuario, Apontamento)` — nunca `auth.uid()`), semântica da trilha; RPCs delegam, triggers viram backstop conferido por teste de equivalência. **Pressupõe K-1.** | doc 17 §3 (novo) | V1/V2/V5 (cede precedência a Kleppmann) |
| **P-UB8** | **Verificador independente da cadeia como CLI standalone, dia 0** — spec executável do hash-chain + artefato pericial de 2031. | doc 17 §14 | V7/SAP R1 |
| **P-UB9** | **Port de Ingestão:** contrato `InsumoNormalizado` no domínio; `ingestao_evento` antecipado p/ F1 como porta única; worker único escritor; Documentize = adapter, não estágio. | doc 02 §3.8, doc 17 §2 | V4/OCP (gravidade ajustada — cede a Fowler) |

**Defesa de uma linha (a que levo ao voto):** *Travar P-UB1 (motor versionado, independente do RAG) + P-UB2/P-UB4 (matar o ciclo e o god-schema) + P-UB5/P-UB6 (contrato das RPCs e governança do `app.*` — os dois blind spots) — tudo sobre a base do K-1 do Kleppmann (escrita só pela porta da frente), porque sem a porta única toda inversão de dependência que eu proponho é contornável.*

---

## 5. Veredito R2

A R1 já tinha o diagnóstico certo. A R2 acrescenta três coisas que mudam o voto: (a) **versionar o motor não depende do RAG** — Beck pode cortar o RAG e ainda assim P-UB1 nasce no dia 0, são decisões ortogonais; (b) os dois furos que ninguém viu — **o contrato das RPCs (SAP invertido)** e **a governança do schema `app.*` (o cano invisível até o Auth)** — são tão baratos quanto os outros e tão impossíveis de retrofitar; (c) o **Kleppmann está acima de mim na pilha**: a porta lateral do PostgREST (K-1) é pré-condição de toda inversão de dependência que proponho, e eu cedo essa precedência sem reservas.

A boa notícia não mudou: nada disso está em produção. P-UB1 a P-UB6 são horas em DDL e documento não-aplicado. The only way to go fast is to go well — e ainda dá tempo de ir bem, porque o moat ainda é papel.

— Uncle Bob. Keep your code clean. It's a matter of professional survival. 🧹
