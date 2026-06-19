# Revisão de Arquitetura — Lente Fowler: Evolução, Legado e Fitness Functions

> **Conclave SOLID — Rodada 1 (análise independente)** · **Expert:** martin-fowler (Director of Software Engineering Practices)
> **Data:** 2026-06-12 · **Alvo:** `17-arquitetura-core-v1.md` (+ schema `16-conclave-arquitetura/02-data-engineer-schema.md`)
> **Mandato:** S4 (evolução/legado), S1 (fronteiras), S7 (monolito modular nunca defendido) + Q1–Q8.
> **Não relitiguei** D1–D9 como decisões de negócio — mas a TÉCNICA por trás de D1 é exatamente o meu mandato, e é onde começo.

---

## 0. Posição em uma frase

Esta é uma arquitetura invulgarmente boa para um documento pré-código — a trilha transacional, a base bitemporal e o fase-gating são desenho de gente grande. Mas ela tem três pontos cegos clássicos de arquitetura evolutiva: **chama de "estender o legado" uma decisão tomada antes de alguém abrir o código** (D1 sem Spike 5 = aposta, não estratégia); **tem componentes mas não tem contextos** (a linguagem do provider já vazou para dentro do core, no schema, antes da primeira linha de produção); e **tem exatamente uma fitness function (golden-set) para um sistema cujo valor inteiro é uma propriedade arquitetural contínua** — defensabilidade. E há uma ironia estrutural que ninguém nomeou: o moat é um ledger imutável, ou seja, **a única parte do sistema onde arquitetura sacrificial é impossível** — e é justamente a parte que nasce na fase mais improvisada (C0 manual). Vamos por partes.

---

## 1. S4 — "Estender o Gestorize": strangler fig ou abraço de afogado?

### 1.1 Primeiro, a precisão terminológica (porque ela muda a análise de risco)

Let me define what I mean by strangler fig, porque o termo está sendo usado errado aqui — e o erro esconde o risco. O strangler fig ([martinfowler.com/bliki/StranglerFigApplication](https://martinfowler.com/bliki/StranglerFigApplication.html)) pressupõe um sistema legado **vivo, em produção, carregando carga**, que você envolve gradualmente, interceptando fluxos um a um, até a árvore hospedeira morrer. A graça do padrão é que o legado **paga as contas enquanto você o substitui** — cada passo entrega valor e o sistema funciona o tempo todo.

O Gestorize não é isso. É um codebase **herdado de uma tentativa anterior, sem usuários, sem produção, de qualidade desconhecida, cuja própria deployabilidade ainda não foi confirmada** (CONTEXT §8.5 — pendência aberta!). Você não pode estrangular uma árvore que não está plantada. O que D1 propõe não é strangler fig — é **adotar um legado como fundação no momento de máxima liberdade arquitetural**. O perfil de risco é o oposto: no strangler fig, o legado limita o seu downside; na adoção-como-fundação, o legado define o seu teto. Cada decisão de design dos autores originais — modelo de auth, gestão de estado React, modelo de dados, single vs multi-tenant — vira herança que um time de 1 dev carrega por 8 meses.

### 1.2 O problema não é o D1 — é a ordem

D1 ("core estende o Gestorize") foi travado em 10/Jun. O Spike 5 (Gestorize deployável) está **pendente** até hoje. Ou seja: a decisão de fundação foi tomada antes da única evidência capaz de validá-la. I've seen this go wrong many times — chama-se *sunk-cost architecture*: "já temos esse código, seria desperdício não usar". O custo afundado é dos sócios anteriores do código, não seu; usar código ruim para "não desperdiçar" é pagar duas vezes.

E há um cenário que ninguém estimou, e é o mais provável e o mais perigoso. O doc 17 só modela dois desfechos: código bom (segue D1) e código irrecuperável ("plano B = reuso de spec, +30-40%"). O desfecho intermediário — **código recuperável porém medíocre** — não tem plano. É o abraço de afogado clássico: o código builda, roda, "dá pra usar"… e cada feature da F1 custa 1,5× porque você está remando contra decisões de 2024 de um time que não está mais aqui. Código ruim que funciona é mais perigoso que código que não builda, porque o segundo te força a decidir e o primeiro te deixa afundar devagar.

### 1.3 "+30-40%" é desenho ou wishful thinking?

É wishful thinking, e digo por quê com precisão: **não há decomposição atrás do número**. +30-40% de QUÊ? Da F1 inteira? Só da camada Gestão (§4 do doc 17 mapeia 23 features de reuso)? O número não distingue o custo de reescrever o Documentize (pipeline com lógica real — extração, hash perceptual, dedup, feedback) do custo de reescrever CRUD de cadastros e agendas (que em 2026, com um stack moderno e a spec em mãos, é trabalho de dias, não semanas). Pior: a estimativa é **assimétrica** — estimou-se o custo do plano B, mas ninguém estimou o custo do plano A dar "certo" com código ruim. Minha experiência consultando equipes nessa situação: o reuso de um codebase mediano de terceiros, sem testes, num domínio que mudou, frequentemente custa MAIS que greenfield-de-spec — porque a spec (a matriz de 23 features + os fluxogramas) é o ativo real, e ela você já tem de graça nos dois cenários.

### 1.4 Proposta concreta: o gate objetivo do Spike 5 (o que a arquitetura não tem hoje)

O Spike 5 hoje é "ver se o Gestorize é deployável". Isso responde G0 e nada mais. Proponho um **scorecard de três gates com decisão mecânica** — sem ele, o resultado do spike será interpretado pelo viés de quem quer que D1 esteja certa:

**G0 — Gate de existência (eliminatório, dia 1-2 do spike):**
| # | Critério | Passa se |
|---|----------|----------|
| G0.1 | Código-fonte completo acessível (não só artefatos/builds) | 100% dos módulos, incl. Documentize |
| G0.2 | Builda do zero em ambiente limpo | ≤ 1 dia de esforço, dependências resolvíveis |
| G0.3 | Roda o fluxo Documentize ponta-a-ponta (upload→extração→tipo→feedback) | demo reproduzível local |
| G0.4 | Licenças de dependências limpas (sem GPL viral, sem libs abandonadas críticas) | auditoria `license-checker` sem vermelho |

**G1 — Gate de qualidade (dia 2-4):**
| # | Critério | Passa se |
|---|----------|----------|
| G1.1 | Testes existentes rodam OU characterization tests do Documentize são viáveis em ≤ 1 semana | estimativa fundamentada |
| G1.2 | Documentize é **separável**: grafo de imports (rodar dependency-cruiser no spike!) mostra o módulo extraível com acoplamento de saída baixo | ≤ ~10 imports cruzados p/ fora do módulo |
| G1.3 | Stack dentro do horizonte de manutenção: React/Node a ≤ 2 majors do LTS atual | custo de upgrade ≤ 1 semana |
| G1.4 | Tamanho × legibilidade: 1 dev consegue formar modelo mental do Documentize em ≤ 3 dias | julgamento documentado com exemplos |

**G2 — Gate de fit arquitetural (dia 4-5) — o que ninguém está olhando:**
| # | Critério | Passa se |
|---|----------|----------|
| G2.1 | **Modelo de tenancy**: o Gestorize foi desenhado multi-tenant? Se nasceu single-tenant (provável — era ferramenta de UM escritório), o retrofit de `escritorio_id` + RLS em código herdado é a migração mais cara que existe | retrofit estimado ≤ 2 semanas, senão FALHA |
| G2.2 | Auth compatível/migrável para Supabase Auth + claims `app_metadata` | caminho de migração desenhável |
| G2.3 | Schema do Gestorize × `gestao.*` do doc 02: migração de dados/modelo é mapeável | gap-analysis sem incompatibilidade estrutural |
| G2.4 | Das 23 features, % que serve o domínio atual SEM retrabalho (as 4 "aparentes" do §4.2 entram aqui) | ≥ 60% aproveitável as-is |

**Regra de decisão (mecânica, fechada ANTES do spike rodar):**
- **G0+G1+G2 passam** → D1 integral: estender o Gestorize.
- **G0 passa, G1.2 passa, mas G2 falha** → **strangler parcial invertido**: extrair SÓ o Documentize como biblioteca/serviço de extração (o órgão valioso), e construir o shell (cadastros, agendas, painéis) greenfield sobre o schema `gestao.*` que a Dara já desenhou — que, diga-se, já é uma reescrita da spec, não do código.
- **G0 falha OU G2.1 falha** → greenfield-de-spec declarado, e o "+30-40%" é re-estimado por decomposição real (Documentize-rebuild ≠ CRUD-rebuild).
- **Timebox: 5 dias úteis.** Se em 5 dias não dá pra preencher o scorecard, isso É o resultado: código que um dev sozinho não consegue avaliar em uma semana é código que ele não consegue manter em oito meses. Spike sem prazo é pesquisa; com prazo, é decisão.

E uma observação que vale ouro: **o schema `gestao.*` do doc 02 já é, na prática, o greenfield-de-spec da camada de dados**. A Dara modelou as 23 features do zero, em pt-BR, multi-tenant, com RLS — sem olhar o schema do Gestorize (a pendência (b) do doc 02 admite isso). Ou seja: metade do "plano B" já está feita e ninguém percebeu. O delta real do plano B é UI + pipeline Documentize. Isso provavelmente derruba o "+30-40%" para algo bem menor — ou o transforma no plano A.

---

## 2. S1 — Componentes não são contextos: o mapa que falta

### 2.1 O diagnóstico

O §2 do doc 17 é um C4 de contêineres competente. Mas contêiner é unidade de **deploy**; bounded context é unidade de **linguagem** ([martinfowler.com/bliki/BoundedContext](https://martinfowler.com/bliki/BoundedContext.html)). A arquitetura tem caixas, setas e fases — e não tem uma única declaração de onde uma linguagem ubíqua termina e outra começa, nem qual padrão DDD rege cada fronteira. Para um sistema que vai viver 7 anos de transição tributária com 1 dev, isso não é formalismo: é o mapa que decide, a cada feature, "isso pertence a quem?".

E a prova de que o mapa faz falta já está no schema. A linguagem do provider **vazou para dentro do core antes do primeiro deploy**:

- `core.nota.provider_meta jsonb` — comentado como "NSU, manifestação, ids do provider". NSU é dialeto do NFeDistribuicaoDFe; manifestação é protocolo SEFAZ-via-provider. Dentro de `core.nota`, a entidade mais central do domínio.
- `core.provider_conexao.ultimo_nsu` — cursor de sincronização do provider como coluna de uma tabela `core.*`.
- `core.nota.origem in (..., 'documentize', ...)` — **nome de marca de um módulo herdado como valor de enum do domínio**. Quando o Documentize for reescrito/renomeado (e será — ver §1), esse valor fica fossilizado em milhões de linhas e nos payloads imutáveis da trilha. O domínio deveria dizer `upload | email | captura_automatica`, nunca o nome do software que fez o upload.
- `core.escritorio.plano in ('concierge','starter','pro','scale')` — linguagem de billing/pricing dentro da tabela de identidade do tenant. Quando o pricing mudar (e o §9 do doc 17 mostra que ele JÁ mudou do corredor R$200-400 para tiers de R$249-999 em um conclave), é CHECK em tabela raiz que muda junto.

Nenhum desses é fatal hoje. Todos são baratos de corrigir hoje e caros de corrigir em 2028. The problem with this approach is que jsonb de provider dentro do core é o tipo de decisão que ninguém revisita — até o dia em que trocar de provider exige um UPDATE em `core.nota` inteira.

### 2.2 Proposta concreta: o mapa de contextos explícito

Seis contextos + um kernel, com as relações nomeadas:

```
                         ┌─────────────────────────────┐
                         │  IDENTIDADE & TENANCY        │
                         │  (escritorio, usuario,       │
                         │   cliente, papel/CRC)        │
                         │  SHARED KERNEL — pequeno,    │
                         │  congelado, mudança = rito   │
                         └──────┬──────────┬────────────┘
                                │          │
        ┌───────────────────────┤          ├──────────────────────┐
        ▼ (usa kernel)          ▼          ▼                      ▼
┌──────────────────┐   ┌─────────────────────┐          ┌─────────────────┐
│ INGESTÃO          │   │ ⭐ APURAÇÃO         │          │ GESTÃO          │
│ (Documentize,     │──▶│ (motor, apontamento,│─events──▶│ (obrigações,    │
│  adapter provider,│ PL│  base ref, vigência,│          │  tarefas, guias,│
│  parser EFD)      │   │  materialidade)     │          │  agenda)        │
│ ACL contra        │   │ CORE DOMAIN          │          │ SUPPORTING      │
│ Focus/PlugNotas + │   └─────┬───────────────┘          │ customer-       │
│ CONFORMIST c/     │         │ domain events            │ supplier        │
│ padrão XML SEFAZ  │         ▼ (published language)     │ (Apuração=      │
└──────────────────┘   ┌─────────────────────┐          │  supplier)      │
                       │ ⭐ TRILHA DE BOA-FÉ │          └─────────────────┘
                       │ (evento, cadeia,    │
                       │  âncora ACT, laudo) │   ┌──────────────────────┐
                       │ CORE DOMAIN —       │   │ COMERCIAL/BILLING    │
                       │ KERNEL TRANSACIONAL │   │ (metering, assinatura,│
                       │ com Apuração (§4.3) │   │  white-label, RdV)   │
                       └─────────────────────┘   │ downstream CONFORMIST│
┌──────────────────┐                             │ da view canônica de  │
│ e-CAC (add-on)    │                            │ medição — NUNCA lê   │
│ CONFORMIST c/     │── upsert via evento ──▶    │ apontamento direto   │
│ SERPRO (códigos   │   (gestao.alvara_certidao) └──────────────────────┘
│ 00006 etc. FICAM  │
│ DENTRO do contexto)│
└──────────────────┘
PL = published language (contrato neutro de "documento fiscal recebido")
```

As relações, uma a uma:

| Fronteira | Padrão DDD | Regra executável |
|-----------|-----------|------------------|
| Ingestão → Provider (Focus/PlugNotas) | **Anticorruption Layer** | NSU, manifestação, ids, cursores vivem em `ingestao.*` (staging) e NUNCA em `core.*`. O adapter traduz para a published language: "documento fiscal recebido {chave, xml_hash, classe_insumo, origem_neutra}" |
| Ingestão → SEFAZ/ADN (padrão XML, chave de acesso) | **Conformist** | Conformar com a linguagem do GOVERNO é correto — ela é a published language pública do domínio fiscal. Chave de acesso, NCM, CST são ubíquos de verdade. A distinção: conforma-se com o padrão público, nunca com o dialeto privado do fornecedor |
| Apuração → Trilha | **Kernel transacional** (shared kernel deliberado e nomeado) | Estado e prova na mesma transação é O mecanismo do moat — não separar, nunca distribuir (ver §4.3). Custo aceito: os dois evoluem juntos; payload da trilha é contrato versionado (§5) |
| Apuração → Gestão | **Customer-Supplier** (Apuração upstream) | Gestão consome eventos (`tarefa origem='auditoria'`); Apuração não conhece Gestão. Hoje há um ciclo no schema: `gestao.documento` FK→ `core.nota` E o core depende do Documentize como porta de entrada. Quebra-se movendo `documento` para o contexto Ingestão (é onde ele mora conceitualmente — é pipeline de entrada, não gestão) |
| Apuração → Comercial/Billing | **Customer-Supplier via published language** | Billing consome SÓ a view canônica de medição (M-10 já prevê — promover de "view" a CONTRATO: billing sem SELECT em `apontamento_auditoria`) |
| e-CAC → SERPRO | **Conformist** (dentro do contexto) | Códigos de serviço SERPRO são a linguagem DESTE contexto — corretos ali, proibidos fora. `gestao.alvara_certidao.ecac_consulta_id` cruza contexto: aceitável, mas trocar FK direta por upsert-via-evento quando o add-on ganhar vida própria |
| Identidade & Tenancy | **Shared Kernel** | `escritorio/usuario/cliente` são compartilhados por todos — ok, mas kernel compartilhado só funciona PEQUENO e ESTÁVEL. Tirar `plano` (billing) de `escritorio`; CRC/papel ficam (são identidade profissional, M-1 acertou) |

**Patches concretos no schema (baratos agora, caros depois):**
1. `core.nota.provider_meta` → mover para `ingestao.documento_recebido.meta` (staging); `core.nota` referencia o staging se precisar de forense.
2. `core.provider_conexao` inteiro → schema `ingestao.*` (já é F2, custo zero de mover agora).
3. Enum `origem`: `'documentize'` → `'upload_processado'` (ou similar neutro). Crítico fazer ANTES do C0: esse valor entra em payloads imutáveis da trilha.
4. `core.escritorio.plano` → `core.assinatura.plano` (M-10 já cria a tabela; a coluna na raiz vira redundância perigosa).
5. Schemas Postgres ganham um 5º: `ingestao` (hoje o staging está espremido em `core`). A Dara usou schemas como fronteira física (S2 dela) — ótimo; só faltou um para o contexto que mais conversa com o mundo externo.

---

## 3. S4/Q8 — Fitness functions: um sistema de defensabilidade com UMA verificação

O golden-set é uma excelente fitness function — para exatamente UMA característica (acurácia do motor). Mas o valor declarado desta arquitetura é **defensabilidade**, que é um feixe de características arquiteturais: integridade da prova, isolamento de tenant, reprodutibilidade, neutralidade de fornecedor, fronteiras intactas. Em arquitetura evolutiva, cada característica que importa precisa de uma função de aptidão executável e contínua — senão ela erode silenciosamente a cada commit ([martinfowler.com/articles/fitness-function-driven-development](https://www.thoughtworks.com/insights/articles/fitness-function-driven-development); Building Evolutionary Architectures, Ford/Parsons/Kua). O doc 17 tem várias dessas verificações ESPALHADAS como jobs e checklists — o que proponho é promovê-las a um **catálogo de fitness functions com gate**, porque checklist é intenção e gate é arquitetura.

**Catálogo proposto (FF-1…FF-12):**

| # | Fitness function | O que protege | Ferramenta | Frequência | Gate |
|---|------------------|---------------|------------|------------|------|
| FF-1 | **Ciclo e fronteira de módulos (app)** — proibir import de `core` interno por `gestao`, de adapter de provider por qualquer um exceto `ingestao`; zero ciclos | As fronteiras do §2 viram código, não diagrama | dependency-cruiser (regras `forbidden` + `no-circular`) no monorepo TS | todo PR | CI hard-fail |
| FF-2 | **Fronteira de schema (SQL)** — nenhuma FK nova `core.*`→`gestao.*` ou `core.*`→`ingestao.*` fora de whitelist; nenhuma tabela tenant-scoped sem `escritorio_id` | ADP no nível do banco | script sobre `pg_catalog`/`information_schema` rodando no banco de migration de CI | toda migration | CI hard-fail |
| FF-3 | **Isolamento cross-tenant GENERATIVO** — teste que ENUMERA as tabelas tenant-scoped e falha se alguma não tem RLS habilitada OU não tem teste de deny; + 2 tenants sintéticos com assert de vazamento zero por tabela; + teste de papel (analista não aprova, não-admin não vê preço — M-1/M-14) | Q5; white-label/opacidade de preço | pgTAP + basejump test helpers no `supabase test db` | toda migration (CI) + probe sintético semanal em prod | CI hard-fail; probe = sev1 |
| FF-4 | **Integridade do hash-chain + âncora** — recomputar cadeia por tenant, `seq_tenant` sem gaps, TST do último fecho ACT confere com a cabeça da cadeia | O moat prova a si mesmo continuamente, não no dia do auto de infração | job SQL + verificação do TST (RFC 3161) | incremental diário (junto do fecho); full semanal | alerta sev1 + bloqueio de emissão de laudo do tenant afetado |
| FF-5 | **Completude da trilha** — estado mudou sem evento correspondente = furo no moat | O risco 🔴 nº1 do doc 02 §11 | job de reconciliação (já previsto) — promover a gate | noturno | sev1; zero tolerância |
| FF-6 | **Imutabilidade sobrevive a migrations** — teste que TENTA `UPDATE/DELETE` em `evento_boa_fe`/`audit_log` como `service_role` e EXIGE exceção | Uma migration futura que recrie a tabela e esqueça o REVOKE destrói o moat em silêncio | pgTAP | toda migration | CI hard-fail |
| FF-7 | **Reprodutibilidade do laudo** — re-executar N laudos congelados contra `base_versao_id` + `motor_versao` + modelo/prompt/embedding pinados e exigir apontamentos idênticos | Q1 — a pergunta de 2031. Hoje NÃO passa: RAG sem pin de modelo/prompt/embedding não é reproduzível (furo S2, confirmo da minha lente) | harness de eval (replay) | semanal + a cada release do motor | bloqueia release do motor |
| FF-8 | **Contrato do provider** — payload do webhook validado contra schema versionado; replay de fixtures gravadas exige que o core receba SÓ published language (nenhum campo de dialeto NSU/etc. atravessa o ACL) | Q2 — a troca em 30 dias só é real se testada continuamente | contract tests (fixtures gravadas + sandbox Focus/PlugNotas; Pact se houver 2 providers) | nightly contra sandbox + a cada mudança no adapter | bloqueia deploy de `ingestao` |
| FF-9 | **Drift da base de referência** — idade da base vs última NT publicada; taxa de divergência oficial×licenciada; toda regra de camada licenciada cita linha oficial (constraint M-4 como TESTE) | Q3; "classificador apodrece em semanas" | job + assert na importação | a cada importação + semanal | regra divergente bloqueada (já previsto — virar gate formal) |
| FF-10 | **Banlist linguística** | Princípio 8 — já especificada como teste. Só registro: estender a strings de UI e mensagens de erro, não só templates | teste de CI sobre templates+locales | todo PR | CI hard-fail |
| FF-11 | **SLA de pico (D+1, 95% antes do 1º dia útil)** — simulação de carga dia-5: 200 CNPJs × alto SKU × competência cheia | Q4 — hoje o SLA é declarado, nunca medido | k6/script de carga sobre staging com dataset sintético | antes do go-live F2 + mensal | review de capacidade; sem gate duro |
| FF-12 | **Guardrail de COGS executável** — teto docs/mês/tenant e franquia testados como código (tenant sintético estoura o teto → captura suspensa + alerta) | Q6 — guardrail em comentário de adapter não é guardrail | teste de integração | todo PR que toca ingestão/billing | CI hard-fail |

Custo total disso: FF-1/2/3/6/10/12 são dias de setup e centavos de CI. FF-4/5 já estão 80% desenhadas no doc 02 — falta o gate. FF-7 e FF-8 são as únicas com esforço real (1-2 semanas somadas) e são precisamente as que protegem as duas perguntas existenciais do produto (Q1 e Q2). Good design pays for itself — esta tabela é o juro composto trabalhando a favor.

**Fontes de validação ao vivo (12/Jun):** dependency-cruiser segue o padrão da indústria para regras de fronteira e ciclos em CI ([rules reference](https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md), [Atomic Object](https://spin.atomicobject.com/dependency-cruiser-imports/), [DEV](https://dev.to/jacobandrewsky/avoid-cross-module-dependencies-with-dependency-cruiser-3b0b)); pgTAP + basejump test helpers é o caminho documentado pelo próprio Supabase para testar RLS por tenant em CI ([Supabase docs — Advanced pgTAP Testing](https://supabase.com/docs/guides/local-development/testing/pgtap-extended), [exemplo multi-tenant](https://blair-devmode.medium.com/testing-row-level-security-rls-policies-in-postgresql-with-pgtap-a-supabase-example-b435c1852602), [Makerkit](https://makerkit.dev/docs/next-supabase-turbo/development/database-tests)).

---

## 4. S7 — Monolito modular: defendo. Mas premissa defendida, não herdada

### 4.1 A defesa (que faltava fazer)

Almost all the successful microservice stories have started with a monolith that got too big and was broken up ([martinfowler.com/bliki/MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html)). Para ESTE caso, o monolito modular não é apenas aceitável — é a única escolha racional, por quatro razões específicas:

1. **You have to be this tall to ride.** Microservices exigem deploy automatizado por serviço, observabilidade distribuída, service discovery, times independentes. Time = 1 dev. A conta não fecha nem como aspiração.
2. **O moat EXIGE o monolito.** Estado + prova na mesma transação (RPC `aprovar_apontamento`) é o mecanismo central da trilha. Distribuir Apuração e Trilha em serviços separados converte essa garantia em dual-write — exatamente o furo que o S3 do brainstorm teme. O Postgres-only não é limitação a superar; é a fundação da propriedade mais valiosa do sistema.
3. **Fronteiras de serviço exigem conhecimento de domínio que ainda não existe.** O domínio (apuração defensável da Reforma) está sendo descoberto AGORA — o conclave mudou máquina de estados, materialidade e ciclo em uma rodada. Cortar serviços sobre um domínio em descoberta garante cortes errados, e fronteira de serviço errada custa 10× mais que fronteira de módulo errada.
4. **O custo de mudar de ideia é baixo SE as fronteiras de módulo forem reais.** E é aqui que a premissa vira tese: monolito modular sem enforcement é só monolito. FF-1/FF-2 são o que transforma o adjetivo "modular" em propriedade verificada. Sem elas, em 8 meses de pressão de entrega, `gestao` importa `core` interno na terceira sexta-feira apertada e ninguém nota até a extração ser impossível.

### 4.2 Sinais objetivos de extração (quando, se algum dia)

| Sinal | Métrica objetiva | O que extrair | Pela costura |
|-------|------------------|---------------|--------------|
| Eval do motor exige Python/runtime distinto (A8 já antecipa) | golden-set satura em Node OU time de ML entra | **Motor de auditoria** — 1º candidato natural | A fila (pgmq) JÁ é a costura desenhada — extrair vira trocar o consumidor. Bom desenho, registro o elogio |
| Pico dia 1-12 satura o banco compartilhado | CPU sustentado > 70% OU lag de fila > 30 min, por 2 ciclos mensais consecutivos, APÓS otimizar índice/query | **Worker de ingestão** (stateless, idempotente por design) | `ingestao_evento` staging |
| Time cresce | 3º dev com ownership de área | O que o ownership pedir — sinal organizacional, não técnico (Conway) | — |
| Cliente enterprise exige isolamento físico | contrato com requisito de single-tenant | **NADA** — resolver com cell-based: um stamp do monolito inteiro por cliente grande. Mais barato que extrair serviços e preserva a transacionalidade | deploy, não arquitetura |

E o anti-sinal, gravado em pedra: **a Trilha nunca se extrai.** Apuração+Trilha são um kernel transacional (§2.2) — é a única decomposição que destrói o produto. Se um dia alguém propuser "microserviço de auditoria/ledger", a resposta está neste parágrafo.

### 4.3 Um reparo ao "Postgres-only sob estresse" (S3, na parte que toca evolução)

OLTP+fila+vetor+ledger no mesmo banco está correto para o volume projetado (30M itens/ano é folga para Postgres bem particionado — a Dara fez a conta). O risco evolutivo real não é throughput: é **backup/restore vs cadeia**. Um PITR para T-1 trunca silenciosamente a cadeia de hashes — e o fecho diário ACT detecta (bom), mas detectar não é tratar. Falta o **runbook de restore como evento de primeira classe**: restore executado → evento `cadeia_restaurada` (novo tipo) com referência ao último TST válido → re-âncora imediata → laudos emitidos na janela perdida marcados para re-verificação. Sem isso, o primeiro incidente de infra vira crise jurídica. Custa uma página de runbook + um tipo de evento. Façam agora.

---

## 5. Sacrificial architecture — três gerações em 8 meses, e onde cada fase fossiliza a anterior

O fase-gating C0→F1→F2→F3 está certo como gestão de risco de negócio ([martinfowler.com/bliki/SacrificialArchitecture](https://martinfowler.com/bliki/SacrificialArchitecture.html) — desenhar para jogar fora é virtude, não falha). Mas cada gate é também um ponto de fossilização: o que a fase N improvisa, a fase N+1 herda como restrição. O mapa dos riscos, do mais grave ao menor:

### 5.1 🔴 O paradoxo do C0: a única parte não-sacrificável nasce na fase mais improvisada

A trilha nasce no Concierge, manual, "já no schema final" — o doc 17 trata isso como virtude (§2, ponto crítico do C0). É virtude E é a armadilha mais sutil do desenho inteiro: **um ledger append-only com hash-chain é o único componente do sistema onde arquitetura sacrificial é IMPOSSÍVEL**. Você não pode corrigir, migrar nem expurgar os eventos do C0 depois — eles são, por design, eternos e encadeados. Cada evento manual que o Breno inserir em julho de 2026 estará na cadeia que um perito examina em 2031.

E o que está frouxo hoje? Os **payloads**. São `jsonb` sem contrato versionado — a pendência (e) do doc 02 ("contrato dos payloads por tipo_evento") está classificada como melhoria de v1.1. Está errado de prioridade: eventos C0 com payload de um formato e eventos F1 do mesmo `tipo_evento` com payload de outro formato = cadeia heterogênea que a ferramenta de verificação de 2031 precisa entender para sempre. Proposta concreta:

- **`payload_versao` (ou `schema_versao` dentro do payload) obrigatório desde o PRIMEIRO evento do C0**, com os contratos por `tipo_evento` documentados ANTES do primeiro laudo manual — promover a pendência (e) de "v1.1" para **bloqueador do C0**.
- `analise_executada` do C0 manual deve gravar explicitamente `motor_versao: 'manual-c0'` + identificação do procedimento usado (qual checklist humano) — para que a geração-0 seja distinguível e auditável, não um buraco de proveniência.
- O verificador da cadeia (FF-4) nasce já lidando com gerações mistas.

### 5.2 🟡 Demo Kit: a UI temporária que nunca morre

Toda "UI mínima sobre o que já existe" tem a mesma biografia: vira o shell do produto porque "já funciona". Se o Demo Kit do C0 evoluir por acreção até ser a "fila do dia" da F1, vocês terão construído a tela mais usada do produto sobre o hack de 30 dias. Proposta: declarar o Demo Kit **explicitamente sacrificial** no doc 17, com critério de aceite da F1 dizendo "a fila do dia NÃO estende telas do Demo Kit" — e orçar a deleção (deletar código também é trabalho; quem não orça, não deleta).

### 5.3 🟡 A máquina de estados em plpgsql hardcoded vs 7 anos de transição

O trigger `tg_apontamento_transicao` codifica as transições em IFs de plpgsql. O M-2 já provou que estados crescem (adicionou `regularizado`, `acao_tipo`...). A transição 2026-2033 VAI inventar estados e motivos novos — é a natureza declarada do domínio (o doc 02 escolheu CHECK-text em vez de enum exatamente por isso, escolha certa). Mas o trigger hardcoded é o mesmo problema num lugar pior: cada estado novo = migration mexendo em função de gatilho que protege o moat. Proposta: **transições dirigidas por dados** — tabela `ref.transicao_permitida (de, para, exige_papel, exige_protocolo)` consultada pelo trigger genérico. O trigger vira estável (nunca mais muda); as regras viram dado versionável, testável (pgTAP enumera a tabela) e — bônus — a própria mudança de regra de transição pode virar evento da trilha.

### 5.4 🟢 F1→F2: a costura está bem desenhada (registro o que está certo)

Ingestão neutra + staging idempotente + origem como metadado + "XML bruto sempre nosso" é exatamente como se prepara uma fase futura sem construí-la antecipadamente. A fossilização aqui só acontece se o adapter F2 nascer sem o FF-8 (contract tests) — aí ele calcifica em torno das idiossincrasias do Focus e o "trocar em 30 dias" vira ficção. Gate: FF-8 existe antes do primeiro webhook de produção.

### 5.5 🟢 Medição do C0 como insumo da F1 — certo, com um adendo

"Horas de operação manual por laudo" (§11) decide o que automatizar primeiro — ótimo. Adendo: capturem também a **rubrica de decisão** dos humanos do C0 em forma estruturada (o dropdown de motivos curados JÁ no C0, não só na F1) — senão a F1 automatiza o gesto e perde o critério, e o golden-set nasce mais pobre do que podia.

---

## 6. Q1–Q8 pela lente da evolução

| # | Cenário | Veredicto da lente | O que falta (concreto) |
|---|---------|--------------------|------------------------|
| Q1 | Reconstituir laudo de 2027 em 2031 | **COM CORREÇÕES.** Bitemporal + ledger + âncora ACT é o melhor desenho que já vi num doc desta maturidade. Mas reconstituir exige reproduzir, e RAG sem pin não reproduz | Payload de `analise_executada` DEVE conter: `motor_versao`, modelo LLM+versão, hash do prompt, modelo+versão do embedding, temperatura/params. FF-7 como gate de release do motor. Runbook de restore (§4.3) |
| Q2 | Trocar Focus→outro provider em 30 dias | **COM CORREÇÕES.** Ingestão neutra + XML nosso = desenho certo; mas a alegação nunca foi testada e o dialeto já vazou pro core | Patches §2.2 (provider_meta/ultimo_nsu fora do core) + FF-8 + runbook de re-sync do cursor NSU na troca |
| Q3 | NT muda cClassTrib na 6ª; pico na 2ª | **COM CORREÇÕES.** Reconciliação + monitor cobrem a importação; ninguém olhou a CAPACIDADE da reanálise | Reanálise de impacto com backpressure: durante a janela dias 1-12, reanálise de carteira inteira é throttled/deferida salvo marco crítico (regra explícita, senão a NT de sexta vira auto-DoS na segunda) |
| Q4 | Pico dia 5, 200 CNPJs alto-SKU | **SIM, com medição.** Monolito+pgmq+índices parciais dão conta no papel; "no papel" não é fitness function | FF-11 (load test do dia-5) antes do go-live F2 |
| Q5 | Pen-test cross-tenant; cliente final vê preço | **SIM, com endurecimento.** RLS default-deny + claim imutável + 6 padrões é forte. Os furos possíveis são (a) tabela futura sem policy, (b) caminho service_role (edge functions) que bypassa RLS | FF-3 generativo (enumera tabelas — pega o (a) para sempre) + testes dedicados dos caminhos service_role + FF-6 |
| Q6 | Captura ligada pra carteira inteira por engano | **COM CORREÇÕES.** Guardrail está especificado em prosa ("teto no adapter") | FF-12: teto como código testado, suspensão automática + alerta. Guardrail sem teste é comentário |
| Q7 | Gestorize vem ruim | **NÃO — hoje não há resposta arquitetada.** "Plano B = spec, +30-40%" é uma frase, não um desenho | Scorecard G0/G1/G2 + regra de decisão mecânica + timebox 5 dias (§1.4). E reconhecer: o schema `gestao.*` da Dara JÁ é meio plano B pronto |
| Q8 | Falso-positivo +2pp após troca de embedding | **COM CORREÇÕES.** Golden-set como gate só funciona se a troca de embedding DISPARA o eval | Versão do embedding pinada e declarada; troca de modelo/embedding/prompt = trigger obrigatório do harness (FF-7); golden-set versionado e estratificado por setor, com piso de precision por banda de confiança como gate numérico |

---

## 7. Consolidação — patches propostos (F-1…F-10)

Para a síntese do conclave, minhas propostas em forma acionável (cada crítica com proposta, como pede o rito):

| # | Patch | Seção | Custo | Quando |
|---|-------|-------|-------|--------|
| F-1 | Scorecard objetivo do Spike 5 (G0/G1/G2 + regra de decisão mecânica + timebox 5 dias) anexado ao doc 17 §14 | §1.4 | 0 (é decisão) | antes do Spike 5 |
| F-2 | Mapa de bounded contexts (§2.2) como seção nova do doc 17; fronteiras com padrão DDD nomeado | §2.2 | 1 dia de doc | v1.1 |
| F-3 | Des-vazamento do provider: `provider_meta`/`ultimo_nsu`/`provider_conexao` → schema `ingestao.*`; enum `origem` sem 'documentize'; `plano` fora de `escritorio` | §2.2 | horas (pré-código!) | antes da migration 001 |
| F-4 | Catálogo de fitness functions FF-1…FF-12 com gates; FF-1/2/3/6/10 na primeira pipeline de CI | §3 | dias | FF-3/6 antes da migration 001; resto por fase |
| F-5 | Contrato versionado de payload por `tipo_evento` (`payload_versao`) — promovido de "pendência v1.1" a **bloqueador do C0** | §5.1 | 2-3 dias | antes do 1º evento real |
| F-6 | Runbook restore-vs-cadeia + tipo de evento `cadeia_restaurada` + re-âncora ACT pós-restore | §4.3 | 1 página + 1 tipo | antes da F1 |
| F-7 | Máquina de estados dirigida por dados (`ref.transicao_permitida`) no lugar do trigger hardcoded | §5.3 | 1-2 dias | migration 001 (barato agora) |
| F-8 | Demo Kit declarado sacrificial; critério de aceite F1: fila do dia não estende telas do C0 | §5.2 | 0 (é decisão) | doc 14/17 |
| F-9 | Sinais objetivos de extração de serviço + anti-sinal da Trilha (kernel transacional inextraível) registrados como seção "evolução" do doc 17 | §4.2 | 0 (é doc) | v1.1 |
| F-10 | Pin de modelo/prompt/embedding no payload de `analise_executada` + eval disparado por troca de qualquer um deles | §6 Q1/Q8 | dias | antes do motor (F1) |

---

## 8. Veredicto

**Esta arquitetura consegue evoluir pelos 8 meses e pelos 7 anos? COM CORREÇÕES — e as correções são baratas porque ainda não há código.**

A espinha está certa: monolito modular Postgres-only com kernel transacional estado+prova é a arquitetura correta para 1 dev construir um produto cujo moat é uma garantia transacional. O fase-gating é gestão de risco madura. O schema da Dara é, de fato, o melhor artefato do projeto.

O que NÃO está pronto para evoluir: (1) a fundação sobre legado não-inspecionado sem critério de decisão — Q7 hoje não tem resposta; (2) fronteiras que existem como desenho mas não como enforcement — e fronteira não-enforçada num time de 1 dev sob pressão é fronteira que não existe; (3) o componente eterno (trilha) nascendo com contratos de payload frouxos na fase mais improvisada — o único erro deste projeto que 2031 não perdoa.

Nenhuma das três exige redesenho. Todas exigem decisão agora, porque são da categoria de coisas que custam horas antes da migration 001 e meses depois dela. First make the change easy, then make the easy change — e o momento em que mudar é mais fácil é exatamente este: antes da primeira linha.

— Fowler. 📐
