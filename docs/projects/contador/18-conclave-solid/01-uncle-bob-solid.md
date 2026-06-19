# Conclave SOLID — Rodada 1 (independente) · Uncle Bob Martin 🧹

> **Agente:** uncle-bob-martin (mind clone — autor do SOLID, dos Component Principles e de Clean Architecture)
> **Data:** 2026-06-12 · **Alvo:** `17-arquitetura-core-v1.md` + `16-conclave-arquitetura/02-data-engineer-schema.md`
> **Pauta:** `18-conclave-solid/00-brainstorm-superficies-ataque.md` (S1–S7, Q1–Q8)
> **Regra de engajamento:** decisões de NEGÓCIO (D1–D9) não são relitigadas; a implementação técnica delas é toda minha.
> **Fontes citadas:** *Clean Architecture* (2017) — caps. 12–14 (Component Principles), 17–19 (Boundaries/Policy/Level), 22 (The Clean Architecture), 30 ("The Database Is a Detail"); "Screaming Architecture" (blog, 2011); *Clean Code* (2008).

---

## 0. Preâmbulo — o que estou olhando, e com que olhos

Let me tell you what I see. Vocês me entregaram um documento de arquitetura que é, em ~70% do seu volume, um schema de banco de dados. Excelente schema, diga-se — Dara fez trabalho de craftsmanship real, e vou reconhecer isso por escrito antes de desmontar o resto. Mas a primeira pergunta que faço a qualquer arquitetura é a do "Screaming Architecture": **quando eu olho pra estrutura, o que ela grita?**

Esta arquitetura não grita "apuração defensável". Ela grita **"Supabase"**.

As entidades são DDL. Os use cases são funções plpgsql e edge functions. A política de autorização — incluindo um **ato privativo de contabilista regulado pelo DL 9.295/46** — é RLS policy. A máquina de estados do apontamento mora num trigger. A regra mais alta do sistema (quem pode praticar o ato que sustenta o laudo) está expressa exclusivamente em artefatos do framework. The Dependency Rule tells us que dependências de código-fonte apontam pra dentro, do detalhe pra política. Aqui a política **mora dentro** do detalhe.

Vou ser justo: há um argumento profissional legítimo para parte disso, e vou separá-lo do que é violação pura. Mas o veredito de uma linha é: **a espinha estratégica está certa; as fronteiras que o moat de 15 anos exige ainda não foram traçadas — e duas delas estão furadas no DDL que vocês já aprovaram.**

---

## 1. O elogio que precisa ser dito (para calibrar a crítica)

Profissionalismo se reconhece. Antes das violações, o que está **certo** — e que muitos times de 50 devs não fazem:

1. **Estado e prova na mesma transação** (RPC `aprovar_apontamento`: update + evento juntos ou nada). É o padrão correto contra dual-write interno.
2. **`ref.base_versao` — snapshot imutável com hash, vigência por `daterange` com EXCLUDE anti-sobreposição, lookup pelo fato gerador.** Isso é *entity thinking* de verdade: a regra tributária tratada como entidade bitemporal, não como linha de tabela. Guardem este padrão — ele vai reaparecer na violação nº 1.
3. **Banlist como teste de CI sobre templates** (§1.8 do doc 17). Isso é uma *fitness function* arquitetural de verdade — política jurídica transformada em teste executável. É exatamente o que prego: regra de negócio que importa vira teste, não convenção.
4. **Fase-gating (D4) com "nenhuma tabela nasce antes da fase que a usa".** "A good architecture allows major decisions to be deferred" — vocês estão deferindo de fato (provider, fila, pgvector). Correto.
5. **Trade-offs documentados com custo declarado** (doc 02 §10: 3NF violada de propósito, CHECK vs enum, hash-chain por tenant). Engenheiro que escreve o custo da própria decisão é engenheiro em quem confio.

Agora vamos ao que não passa.

---

## 2. The Dependency Rule — o mapa desta arquitetura

### 2.1 Onde as coisas DEVERIAM estar

```
            A REGRA: dependências de código-fonte apontam PARA DENTRO.
            Nada num círculo interno sabe que um círculo externo existe.

  ┌───────────────────────────────────────────────────────────────────────┐
  │  FRAMEWORKS & DRIVERS (detalhes — substituíveis)                      │
  │  Supabase (Postgres · RLS · Auth · Storage · pgmq · pgvector · edge)  │
  │  React/Gestorize UI · LLM+embeddings · Focus/PlugNotas · SERPRO       │
  │  ACT ICP-Brasil · ADN/SEFIN · layouts Domínio/Alterdata               │
  │   ┌───────────────────────────────────────────────────────────────┐   │
  │   │  INTERFACE ADAPTERS                                           │   │
  │   │  parser Documentize · parser EFD · adapter webhook provider   │   │
  │   │  gateway SERPRO · gateway ACT · escritor CSV ERP              │   │
  │   │  renderer PDF/PAdES/DANFSe · controllers/presenters da UI     │   │
  │   │   ┌───────────────────────────────────────────────────────┐   │   │
  │   │   │  USE CASES (regras da aplicação)                      │   │   │
  │   │   │  IngerirInsumo · ExecutarAnalise · DecidirApontamento │   │   │
  │   │   │  (individual/lote c/ materialidade) · EmitirLaudo ·   │   │   │
  │   │   │  AncorarTempo · ExportarAjustes · GerarRelatorioValor │   │   │
  │   │   │  · FecharConsumoMensal · ReanalisarImpactoNT          │   │   │
  │   │   │   ┌───────────────────────────────────────────────┐   │   │   │
  │   │   │   │  ENTITIES (regras de empresa — o MOAT)        │   │   │   │
  │   │   │   │  Nota/Item · Apontamento (máquina de estados, │   │   │   │
  │   │   │   │  materialidade, classe de insumo) · Laudo ·   │   │   │   │
  │   │   │   │  EventoBoaFé (semântica da cadeia) ·          │   │   │   │
  │   │   │   │  RegraVigente (fato gerador, hierarquia de    │   │   │   │
  │   │   │   │  fontes) · AtoPrivativo (contador+CRC)        │   │   │   │
  │   │   │   └───────────────────────────────────────────────┘   │   │   │
  │   │   └───────────────────────────────────────────────────────┘   │   │
  │   └───────────────────────────────────────────────────────────────┘   │
  └───────────────────────────────────────────────────────────────────────┘
```

### 2.2 Onde elas ESTÃO — e cada violação, nomeada

Na arquitetura v1.0, os dois círculos internos **moram fisicamente no anel externo**. Entities = DDL + CHECKs + triggers. Use cases = RPCs plpgsql + edge functions. Não é metáfora — é localização de código-fonte, que é do que a Dependency Rule trata.

| # | Violação | Evidência concreta | Gravidade |
|---|----------|--------------------|-----------|
| **V1** | Use case conhece o mecanismo de Auth do framework | `core.aprovar_apontamento` chama **`auth.uid()`** (Supabase Auth) dentro da regra de negócio (doc 02 §3.5). O ato privativo de contabilista depende, no código, de um detalhe de vendor | 🔴 |
| **V2** | Entity rule existe SÓ no framework | A máquina de estados do apontamento (`tg_apontamento_transicao`) e o congelamento pós-revisão existem **apenas** como trigger. Não há objeto de domínio testável sem um Postgres de pé | 🔴 |
| **V3** | **Ciclo de dependência core → gestao** | `core.usuario.departamento_id` → FK para **`gestao.departamento`** (doc 02 §4). Como todo `gestao.*` referencia `core.*` (escritorio, cliente, nota), isto fecha um **ciclo entre componentes**. O moat depende do módulo mais volátil | 🔴 |
| **V4** | A porta de entrada do core mora no módulo volátil | A ingestão dia-0/F1 entra por `gestao.documento` (Documentize), que então cria `core.nota`. O pipeline do core tem sua boca no schema de Gestão — e o plano B do Spike 5 ("Gestorize ruim") vira reescrita do funil de entrada do CORE | 🔴 |
| **V5** | Autorização-que-é-lei expressa só em RLS/RPC | M-1: "exige `papel='contador'` com CRC ativo **na RPC e na RLS policy**". DL 9.295/46 virou policy de framework; nenhum objeto de domínio chamado `AtoPrivativo` existe pra ser testado em isolamento | 🟠 |
| **V6** | Motor depende da tabela concreta e de detalhes de inferência não-versionados | "Regras + RAG sobre base@versão" lê `ref.cclasstrib_regra` via SQL direto; modelo/prompt/embedding não têm cidadania no schema (ver §4 — a violação mais cara do documento) | 🔴 |
| **V7** | O componente mais estável é o menos portável | A mecânica da trilha (advisory lock, `digest()`, REVOKE até de service_role) é 100% amarrada à plataforma. Se em 2031 (ano 6 de 15) o Supabase forçar migração, o código menos portável do sistema é exatamente o moat | 🟠 |

**A nuance profissional que devo a vocês (V2/V5/V7):** constraints, triggers e RLS como **última linha de defesa** são prática correta — num sistema adversarial-forense, EU QUERO o banco recusando mutação da trilha mesmo que o app esteja comprometido. A violação não é o banco defender o invariante. A violação é o invariante **não existir em nenhum outro lugar**. Defense-in-depth exige as duas cópias: a do domínio (testável em milissegundos, portável, legível por auditor) e a do banco (inviolável). Hoje só existe a segunda.

**Correção (V1–V5, V7) — o pacote de domínio:**
A decisão A8 já diz "Node no F1". Então: criem **um pacote TypeScript de domínio** (`@contador/dominio` — zero dependência de Supabase, React, fetch, qualquer coisa) contendo: máquina de estados do apontamento; regra de materialidade; regra do ato privativo (`podeAprovar(usuario, apontamento)` recebendo um `Usuario` do domínio, nunca `auth.uid()`); semântica do evento de boa-fé (tipos + contratos de payload + função pura `hashEvento(...)`); lookup de vigência pelo fato gerador como função pura sobre um snapshot de regras. As RPCs viram cascas finas que delegam; os triggers viram a cópia-backstop **gerada/conferida contra o domínio** (um teste de CI executa a mesma transição nas duas implementações e exige o mesmo resultado). E escrevam **dia 0 o verificador independente da cadeia** como ferramenta standalone (CLI, sem Supabase): ele é simultaneamente (a) a especificação executável do hash-chain, (b) o artefato que o escritório leva pro perito em 2031, (c) a prova de que V7 está mitigada. O verificador É o produto no tribunal — não pode nascer por último.

---

## 3. SOLID no nível de fronteira de módulo

### 3.1 SRP/CCP — "Gestorize estendido": quantos atores, quantas razões de mudança?

A Single Responsibility Principle, no nível de componente, pergunta: **quem é o ator que pede mudança?** O core fiscal muda quando a Receita publica NT, quando jurisprudência vira, quando o Heleno aponta risco — ator: o direito tributário. A camada Gestão muda quando o escritório quer um dashboard novo ou o Nibo lança feature — ator: a operação comercial. Dois atores, duas velocidades, **um deploy** ("Gestorize React estendido", um app React, schemas no mesmo banco com migrations "próprias" mas mesmo release).

O doc 17 acerta a metade dos pontos: schemas separados são fronteira real (grants, RLS, migrations). Mas fronteira sem **direção enforced** é cosmética — e o DDL prova (V3) que a direção já furou antes do primeiro release. Pior: olhem o que o schema `core` contém depois das correções M-10/M-11:

- nota/auditoria/laudo/trilha — **o moat** (ator: direito tributário; estabilidade máxima exigida)
- `consumo_mensal`/`assinatura` (M-10) — **billing** (ator: comercial; muda a cada experimento de pricing do Anderson)
- `implantacao` (M-11) — **onboarding** (ator: CS/implantação)
- `procuracao_eletronica`/`ecac_consulta` — **o add-on e-CAC**, que a D9 define como "produto e bolso SEPARADOS"

Isso é a Common Closure Principle violada por rótulo: coisas que mudam por razões diferentes, no mesmo componente. O negócio decidiu (D9) que e-CAC é produto à parte — e a arquitetura o colocou dentro do componente do moat. Your architecture doesn't scream "apuração defensável"; ela sussurra "tudo é core".

**Correção:**
1. Schemas `billing` e `ecac` próprios (o e-CAC já tem até migration própria, `010` — a fronteira já existe no tempo, falta existir no espaço). `implantacao` vai para `gestao` ou `billing`.
2. **Direção única de dependência, enforced:** `gestao → core → ref`, `billing → core`, `ecac → core`. **NUNCA** `core → gestao|billing|ecac`. Resolver V3: `departamento` é conceito de Gestão — remover `core.usuario.departamento_id` e criar `gestao.usuario_departamento(usuario_id, departamento_id)`. O core não sabe que departamentos existem.
3. **Fitness function de fronteira** (responde S4 do brainstorm): teste de CI que consulta `pg_constraint`/`pg_depend` e **falha** se qualquer objeto de `core.*` referenciar `gestao|billing|ecac`. São ~20 linhas de SQL. Sem isso, a "fronteira" é um comentário. Quando houver código Node, o mesmo pra imports (dependency-cruiser). Monolito modular sem dependency-check em CI não é modular — é um monolito com pastas bonitas.

### 3.2 OCP — novo tipo de insumo entra sem modificar o pipeline?

O princípio: aberto para extensão, fechado para modificação. O doc 17 declara "pipeline único, origem é metadado" — mas desçam ao código e contem os caminhos:

- **Upload (C0/F1):** UI → edge function `service_role` → grava `gestao.documento` → parser → `core.nota` + evento, **síncrono, sem staging**.
- **Provider (F2):** webhook → `core.ingestao_evento` (staging idempotente) → pgmq → worker → `core.nota` + evento, **assíncrono, com staging**.
- **EFD (F1):** parser → `core.apuracao_declarada` — **nem passa por `core.nota`**; é um terceiro pipeline com outro destino.

Três fontes, três topologias transacionais, zero abstração nomeada. "Pipeline único" hoje é uma frase, não uma estrutura. Quando o CT-e de verdade chegar, ou quando entrar a 4ª fonte (e vai entrar — API do ADN no F3), alguém vai modificar a edge function de upload E o worker E o CHECK de `origem`. Isso é o oposto de fechado para modificação.

**Correção — o Port de Ingestão:**
1. Definam **um contrato de domínio `InsumoNormalizado`**: `{classe_qualidade: xml|documento_extraido|efd, dedup_key (regra por classe: chave_acesso | sha256 | cnpj+competencia+bloco), origem, payload_normalizado, referencias_storage}`. Este contrato mora no pacote de domínio (§2.2), não num jsonb.
2. **Antecipem `ingestao_evento` da F2 para a F1** e façam dela a ÚNICA porta: upload, Documentize, EFD e (depois) webhook são todos *produtores* que escrevem no staging; UM worker é o único escritor de `core.nota`/`apuracao_declarada` + evento. Custo: uma tabela que já está desenhada, antecipada uma fase. Ganho: fonte nova = produtor novo, pipeline intocado — OCP de verdade — e o dual-write inbound (S3 do brainstorm) morre por construção, porque só há um caminho transacional.
3. EFD continua tendo destino próprio (`apuracao_declarada`) — destinos podem variar; a **porta** é uma.

### 3.3 LSP — os adapters de origem são substituíveis DE VERDADE?

Substituibilidade não é intenção, é contrato testado. Evidências de que hoje ela é coincidência:

- `provider_conexao.provider check (provider in ('plugnotas','focus'))` — os nomes dos fornecedores **hard-coded num CHECK do core**. Trocar de provider (cenário Q2, 30 dias) começa com um `ALTER TABLE` no componente que não deveria saber que a Focus existe. `ingestao_evento.provider` é `text` livre — nem internamente os dois concordam.
- O "adapter neutro" e a "ingestão neutra" são citados (§12-A7, riscos), mas o contrato neutro **não está definido em lugar nenhum** — é exatamente o `InsumoNormalizado` do §3.2 que falta.

**Correção:** (1) provider vira `text` + tabela `ref.provider_homologado` (dado, não DDL); (2) escrevam a **suíte de testes de conformidade do adapter** — um conjunto de casos (nota nova, reenvio idêntico, NSU duplicado, XML corrompido, evento de cancelamento, webhook fora de ordem) que QUALQUER adapter de captura deve passar produzindo os mesmos `InsumoNormalizado`. Isso é a LSP transformada em executável: o dia em que a Focus descontinuar, a migração é "escrever um adapter que passa na suíte", não uma arqueologia. O Spike 3 deve **entregar essa suíte**, não só a matriz comparativa.

### 3.4 ISP — o laudo e seus 4 consumidores

Aqui vocês estão melhor do que o brainstorm temia — reconheço: o export ERP consome **apontamentos aprovados** (M-13), não o laudo; o Relatório de Valor é **view sobre a trilha** (§8.3). Dois consumidores já segregados. O risco residual é real e tem nome: **`laudo.resumo jsonb`** e os payloads jsonb da trilha são interfaces sem compilador. O Demo Kit lê `resumo`, o template do Relatório lê `resumo`, o PDF lê `resumo` — três clientes acoplados a um saco de campos sem contrato, e o próprio doc 02 lista "jsonb virar lixão" como risco 🟡 e deixa "contrato dos payloads por tipo_evento" como *pendência (e)*.

**Correção:** (1) promover a pendência (e) a **bloqueante de F1**: contrato (JSON Schema ou tipos no pacote de domínio) por `tipo_evento` e para `laudo.resumo`, validado na borda E testado; (2) um **read-model nomeado por consumidor** — views `app.laudo_demo_kit`, `app.relatorio_valor_dono`, `app.relatorio_valor_whitelabel`, `app.export_erp_linha` — cada uma com as colunas que aquele consumidor usa e nada mais (No client should be forced to depend on methods it doesn't use). Bônus: a banlist do §1.8 passa a rodar **por view de consumidor**, que é onde a linguagem aparece.

### 3.5 DIP — o motor depende de abstração ou da tabela?

A decisão A8 ("Node no F1; extrair Python depois se o eval exigir — **fronteira limpa via fila**") contém um autoengano que preciso apontar: **fila é transporte, não fronteira.** Se o código do motor embute SQL contra `ref.cclasstrib_regra` e chamadas diretas ao pgvector, "extrair pra Python" significa reescrever todo o acesso a dados — a fila só carrega a mensagem até o código acoplado. A fronteira limpa é um **contrato em termos de domínio**: o motor recebe `{item, regras_vigentes_no_fato_gerador (snapshot hidratado), parametros_motor}` e devolve `{apontamentos_candidatos com proveniência completa}`. Quem hidrata o snapshot é um adapter. Com esse contrato, o motor é (a) extraível pra Python sem tocar em dados, (b) testável contra o golden-set **sem banco**, (c) versionável — o que conecta à violação seguinte, a mais grave de todas.

---

## 4. A violação mais cara: o motor não é uma entidade versionada (Q1 + S2)

§3.3 do doc 17 afirma: *"Reprodutibilidade: qualquer laudo re-executável contra `base_versao_id` exato."*

**Essa frase é falsa, e é perigoso que ela esteja num documento aprovado.** Ela é verdadeira para a camada de REGRAS determinísticas. Para a camada RAG, re-executar contra a mesma `base_versao` com modelo/prompt/embedding/parâmetros diferentes — ou iguais, dado que LLM não garante determinismo — produz apontamentos diferentes. Em 2031, num auto de infração, o perito da outra parte vai pedir exatamente isso: "re-execute". Se a resposta do sistema divergir do laudo de 2027, a frase do §3.3 vira a arma contra vocês.

Olhem a assimetria no próprio schema: a BASE tem `ref.base_versao` — snapshot imutável, `hash_conteudo`, rótulo, status. O MOTOR tem... uma string `motor_versao` dentro de um payload jsonb do evento `analise_executada`. **Vocês versionaram o dicionário e esqueceram de versionar o intérprete.** E o evento `apontamento_gerado` (payload: `regra_id, confianca, fundamento`) não carrega modelo, prompt, embedding — a proveniência da inferência não existe.

**Correção em três movimentos — e ela define o que "defensável" significa:**

1. **`ref.motor_versao` como entidade de primeira classe**, espelhando o padrão `base_versao` que vocês já acertaram: `{id, rotulo, codigo_versao (git sha), modelo_llm (id+versão do vendor), prompt_hash (prompt no storage), embedding_modelo, embedding_index_hash, parametros (top_k, threshold, temperatura, seed), publicada_em, hash_manifesto}`. Todo `analise_executada` e todo `apontamento_gerado` referenciam `motor_versao_id` por FK — não por string em jsonb. Q8 (troca de embedding sobe falso-positivo 2pp) ganha resposta estrutural de graça: **trocar qualquer campo do manifesto = nova `motor_versao` = gate de golden-set obrigatório no CI antes de ela receber `status='vigente'`**. Hoje esse gatilho é implícito; com a FK ele é mecânico.

2. **Fronteira do determinismo dentro do motor (responde S2):** dois componentes com contratos distintos —
   - **Classificador determinístico (regras):** função pura `(item, snapshot_regras) → candidatos`. ESTE é re-executável, e só sobre ele a palavra "re-executável" pode aparecer em documento ou proposta comercial.
   - **Sugestor RAG (não-determinístico):** produz **sugestões** com proveniência total gravada (motor_versao_id, chunks/regra_ids recuperados, output bruto). Sua saída jamais sustenta laudo diretamente; sustenta o apontamento-candidato que o contador decide. As "duas classes de insumo" do princípio 4 ganham a irmã que faltava: **duas classes de inferência** (`origem_inferencia: regra_deterministica | sugestao_rag`), gravadas no apontamento e declaradas no laudo — prova de primeira e de segunda, cada uma com seu rótulo, como vocês mesmos escreveram no §3.6.

3. **Reposicionar a alegação jurídica (Q1):** a defensabilidade do laudo de 2027 questionado em 2031 **não pode** repousar em "re-execute e obterá o mesmo resultado". Ela repousa no que a trilha já faz bem: **registro íntegro, hash-encadeado e carimbado por ACT do que foi sugerido (com proveniência completa de base E motor), do que o contador qualificado decidiu, e da conduta que se seguiu**. Re-executabilidade fica restrita à camada determinística. Troquem a frase do §3.3 — e validem a formulação nova com o Heleno no Spike 6, porque é ela que o tributarista vai defender num auto.

Sem o movimento 1, o moat tem um furo datado: a primeira perícia séria pergunta "qual prompt gerou isto?" e a resposta é "não guardamos". Isso não é dívida técnica. É dívida probatória.

---

## 5. Component Principles — REP/CCP/CRP · ADP/SDP/SAP

| Princípio | Achado | Severidade |
|-----------|--------|------------|
| **REP** (granule de release) | Schemas como componentes: granularidade razoável. Mas sem versionamento de release por schema (migrations "próprias" sem pipeline próprio), o granule de RELEASE real é o monolito inteiro | 🟡 |
| **CCP** (common closure) | `core` é um god-component: moat + billing + implantação + add-on e-CAC (§3.1). Quatro razões de mudança, um componente | 🔴 |
| **CRP** (common reuse) | Consumidores do laudo acoplados ao `resumo` jsonb inteiro (§3.4) | 🟠 |
| **ADP** (acyclic dependencies) | **Ciclo core↔gestao provado no DDL** (V3) + porta de ingestão dentro de gestao (V4) | 🔴 |
| **SDP** (stable dependencies) | A trilha — o componente mais estável e valioso — está bem isolada de billing/UI ✅; mas depende estruturalmente da plataforma menos garantida em horizonte de 15 anos (V7) e, via V3/V4, o core inteiro depende do módulo mais volátil (Gestorize, qualidade desconhecida, Spike 5 pendente) | 🔴 |
| **SAP** (stable abstractions) | O componente mais estável (trilha) é 100% concreto — zero abstração publicada. A semântica da cadeia (tipos de evento, contratos de payload, algoritmo de verificação) deveria ser a abstração estável publicada; hoje é trigger + jsonb + pendência (e) | 🟠 |

Sobre o ponto S7 do brainstorm ("o monolito modular nunca foi defendido como tese"): eu **defendo** o monolito para este time e este momento — microservices para 1 dev seria malpractice, e a Dependency Rule não exige processos separados, exige *fronteiras de código respeitadas*. Mas um monolito só é modular se a estrutura de dependências for **verificada por máquina** (fitness function do §3.1-3). Hoje não é — e o V3 mostra que, sem verificação, a fronteira furou na primeira semana de DDL. "If you don't enforce the boundary, you don't have a boundary. You have a suggestion."

E uma nota sobre o pico (Q4) que ninguém levantou: o hash-chain serializa inserts **por tenant** via advisory lock — decisão correta. Mas a reanálise de impacto de NT (Q3) numa carteira de 200 CNPJs, no dia 5, vai disputar essa serialização com as aprovações dos operadores humanos. No volume projetado (milhares de eventos/dia) cabe; apenas declarem isso como ponto de sensibilidade e considerem evento agregado de reanálise (1 evento por lote com manifest, não 1 por item) — o que, aliás, o padrão `decisao_lote` do §3.5 já inventou para decisões. Reusem o próprio padrão.

---

## 6. Cenários Q1–Q8 pela minha lente (síntese)

| # | Cenário | Resposta da arquitetura v1.0 | Com minhas correções |
|---|---------|------------------------------|----------------------|
| Q1 | Reconstituir laudo 2027 em 2031 | ❌ Versiona a BASE, não o MOTOR; "re-executável" é falso p/ RAG | ✅ `ref.motor_versao` + proveniência de inferência + alegação reposicionada (§4) |
| Q2 | Trocar Focus em 30 dias | 🟡 XML nosso + staging ok; mas contrato neutro implícito e provider em CHECK do core | ✅ `InsumoNormalizado` + suíte de conformidade (LSP executável, §3.3) |
| Q3 | NT na 6ª, pico na 2ª | 🟡 base_versao + monitor cobrem o dado; reanálise disputa o lock da cadeia | ✅ evento agregado de reanálise + sensibilidade declarada (§5) |
| Q4 | Pico dia 1-12, 200 CNPJs | 🟡 D+1 + fila ok; cadeia serializada por tenant é o ponto de sensibilidade | ✅ idem Q3; staging único desde F1 simplifica backpressure |
| Q5 | Pen-test cross-tenant / preço vazando | ✅ RLS default-deny + claim não-editável + teste por tabela no CI — desenho correto | ➕ fitness function de fronteira de schema pega o vazamento ESTRUTURAL (core→gestao) que RLS não vê |
| Q6 | Captura ligada por engano | 🟡 Teto no ADAPTER = política no detalhe | ✅ limite é regra de negócio: vive no use case `AtivarCaptura` (domínio), adapter apenas reforça |
| Q7 | Gestorize vem ruim (Spike 5 falha) | ❌ "Plano B = +30-40%" é estimativa, não desenho; com V3/V4, trocar Gestão = cirurgia no core | ✅ com direção única + Documentize atrás do Port de Ingestão, plano B = trocar adapters; o core não sabe |
| Q8 | Falso-positivo +2pp pós-troca de embedding | 🟡 golden-set existe, gatilho implícito | ✅ embedding no manifesto → nova motor_versao → gate de eval mecânico (§4-1) |

---

## 7. Lista consolidada de correções (candidatas a patch v1.1 — founder ratifica)

**Bloqueantes antes da migration 001 (custo baixo, são mudanças de DDL/doc que ainda não existem em produção):**

1. **P-UB1 · `ref.motor_versao`** como entidade versionada (manifesto: código+modelo+prompt_hash+embedding+params) + FK em `analise_executada`/`apontamento_gerado` + `origem_inferencia` no apontamento + **corrigir a frase de re-executabilidade do §3.3** (validar formulação com Heleno no Spike 6). *(§4 — Q1/S2/Q8)*
2. **P-UB2 · Quebrar o ciclo core→gestao:** remover `core.usuario.departamento_id`; criar `gestao.usuario_departamento`. Direção única: `gestao|billing|ecac → core → ref`. *(V3)*
3. **P-UB3 · Fitness function de fronteira:** teste de CI sobre `pg_constraint`/`pg_depend` que falha em qualquer referência `core → gestao|billing|ecac`; dependency-cruiser quando houver Node. *(S4)*
4. **P-UB4 · Descer billing/implantação/e-CAC do core:** schemas `billing` e `ecac`; `implantacao` → gestao/billing. *(CCP)*
5. **P-UB5 · `provider` deixa de ser CHECK hard-coded** (text + `ref.provider_homologado`). *(LSP)*

**Bloqueantes de F1 (antes do motor existir):**

6. **P-UB6 · Pacote de domínio `@contador/dominio`** (TS, zero framework): máquina de estados, materialidade, ato privativo, semântica/contratos da trilha, lookup de vigência — RPCs/triggers viram backstop conferido contra o domínio por teste de equivalência. *(V1/V2/V5)*
7. **P-UB7 · Verificador independente da cadeia como CLI standalone, dia 0** — é a spec executável do hash-chain e o artefato pericial. *(V7/SAP)*
8. **P-UB8 · Port de Ingestão:** contrato `InsumoNormalizado` + `ingestao_evento` antecipado pra F1 como porta única + worker único escritor + suíte de conformidade de adapter (entregável do Spike 3). *(V4/OCP/LSP/S3)*
9. **P-UB9 · Contrato de motor em termos de domínio** (snapshot hidratado entra, candidatos com proveniência saem) — a "fronteira via fila" do A8 só é real com isso. *(DIP)*
10. **P-UB10 · Contratos de payload jsonb promovidos a bloqueante** (por `tipo_evento` + `laudo.resumo`) + read-model view por consumidor do laudo, banlist rodando por view. *(ISP)*

---

## 8. Veredito

**A arquitetura respeita as fronteiras que o moat exige? AINDA NÃO — COM CORREÇÕES, SIM.**

A estratégia está certa: comprar a commodity, construir o moat, trilha como cidadã de primeira classe, fase-gating, humano qualificado no loop. O schema é trabalho de profissional. Mas o documento confunde **ter schemas** com **ter fronteiras**, e confunde **versionar a base** com **versionar o sistema que a interpreta**. O ciclo core↔gestao já está furado no DDL aprovado; o domínio inteiro mora dentro do framework; e a alegação central do produto — reprodutibilidade — é hoje indefensável para a camada RAG, que é exatamente onde a perícia vai atacar.

A boa notícia: TODAS as correções são baratas AGORA, porque nada disso está em produção. P-UB1 a P-UB5 são horas de trabalho em documentos e DDL não-aplicado. Daqui a oito meses, são semanas; daqui a três anos, são a história triste que eu conto no próximo livro. The only way to go fast is to go well — e neste caso, "well" custa quase nada porque vocês ainda estão no papel. Não há desculpa profissional para não fazer.

— Uncle Bob. Keep your code clean. It's a matter of professional survival. 🧹
