# Handoff Codex — Build F1 "Foundation" (Projeto Contador)

> **De:** Orion (Claude, arquitetura) → **Para:** Codex (execução/código)
> **Data:** 2026-06-15 · **Branch sugerida:** `feat/contador-foundation`
> **Autoridade:** arquitetura v1.1 ratificada pelo founder em 15/Jun (conclave SOLID, 23 patches D0).
> **Regra-mãe:** este handoff descreve a fatia que é SEGURO codar AGORA. Há portões estratégicos (§3) que limitam o escopo — **não os ultrapasse sem ratificação do founder.**

---

## 1. TL;DR — o que construir nesta primeira leva

Você vai construir a **Fundação (F1-D0)**: a fatia que o Kent Beck abençoou no conclave — *"escreva o primeiro teste do motor esta semana; ele continua pronto pra ficar vermelho hoje"*. São 4 entregas, todas **greenfield** (NÃO dependem do Gestorize nem de validação do Concierge), porque são **contrato de dados irrecuperável** + **função pura**:

1. **Migration 001** — o schema v1.1 (23 patches de contrato de dados).
2. **Motor de classificação puro** — função pura `(item, base) → apontamentos[]`, com harness de golden-set, em TDD.
3. **Verificador da cadeia (CLI standalone)** — a spec executável do hash-chain + artefato pericial.
4. **Fitness functions D0** (FF-1/2/3/6) como gates de CI.

**Por que essa fatia e não a plataforma inteira:** ver §3. Em uma frase: o contrato de dados fica 10-100× mais caro depois da migration 001 ir a produção, então nasce agora; o resto (captura, UI, RAG, e-CAC) espera os portões.

---

## 2. Leia ANTES de codar (nesta ordem)

| # | Doc | Por quê |
|---|-----|---------|
| 1 | `18-conclave-solid/99-sintese-conclave-solid.md` | Os 23 patches D0 com gatilho/custo/teste. **Sua fonte de verdade do escopo.** |
| 2 | `16-conclave-arquitetura/02-data-engineer-schema-v1.1.md` | O DDL alvo da Migration 001 (marcações `[Pxx]`). |
| 3 | `20-arquitetura-core-v1.1.md` | Arquitetura: contrato do motor (§3.7), verificador (§14), §3-bis fitness functions, §2-bis mapa de contextos. |
| 4 | `00-context/CONTEXT.md` | Glossário, IDs, dead-ends. Carregar pra não driftar nomenclatura. |
| 5 | `14-concierge-mvp-spec.md` | Entender por que o build é limitado (estratégia Concierge-first). |

---

## 3. 🚦 PORTÕES — o que você NÃO deve construir (e por quê)

Estes limites são decisão **ratificada do founder**. Respeite-os; se um item te bloquear, pare e reporte.

| Portão | Regra | Origem |
|--------|-------|--------|
| **Concierge-first** | NÃO construir pipeline de captura, UI de produto, nem onboarding até o Concierge validar (≥3 de 5 escritórios pagando). | Eric Ries venceu o conclave (D4 ratificado) |
| **Gestorize travado** | NÃO forkar/estender o Gestorize. A decisão de estender depende do **Spike 5** (avaliação da qualidade do código herdado) que ainda não rodou. A Fundação é greenfield. | Fowler R2: "estender sem Spike 5 = aposta, não estratégia" |
| **RAG fora da F1** | O motor desta leva é **só-regras determinístico**. NÃO integrar LLM/embeddings. Mas o **contrato de payload** já nasce com os campos de proveniência RAG (`null` por ora — patch P2). | Beck K-1 (corte) + Kleppmann (contrato nasce já) |
| **Sem add-ons** | e-CAC, billing-jobs, emissor, white-label = fases futuras. Schemas `ecac`/`billing` existem no DDL mas SEM jobs/comportamento. | Beck frame-mestre |

**Reconciliação honesta:** construir a Fundação NÃO viola o Concierge-first porque não é "infra de produto" — é o contrato de dados irrecuperável + a função pura testável. É exatamente o "go well" que o Beck mandou fazer já. Qualquer coisa além disso espera os portões.

---

## 4. ENTREGA 1 — Migration 001 (schema v1.1)

**Alvo:** Postgres 15+ (Supabase). Aplique o DDL de `02-data-engineer-schema-v1.1.md`. Cada item abaixo mapeia a um patch ratificado — comente `-- [Pxx]` no SQL.

**Setup:** local via Docker (`postgres:15`) é suficiente para a migration + testes. Projeto Supabase real só é necessário para testar RLS de verdade (FF-3) — peça as creds ao founder quando chegar nesse teste.

**Itens críticos (não improvise — siga o DDL do doc 02 v1.1):**
- `ref.motor_versao` entidade versionada + FK NOT NULL + `tipo_inferencia` CHECK ∈ {humano_concierge, regra_deterministica, rag} **[P1]**
- `core.analise_execucao` com campos de proveniência (nullable até RAG) **[P2]**
- Trigger de hash reescrito: digere **campos canônicos nomeados** (separador `\x1f`), NÃO `payload::text`; `hash_ver` desde o gênese **[P4]**
- `core.trilha_cabeca(escritorio_id PK, seq, hash, hash_ver)` com `SELECT ... FOR UPDATE` — fonte única de seq (substitui `MAX(seq_tenant)`) **[P5]**
- `UNIQUE(item, tipo, base, motor)` + estado `superado` + `analise_execucao` UNIQUE — **materializado pela RPC, nunca pelo motor** **[P6]**
- Idempotência de evento por referente **[P7]**
- **Sem** `core.usuario.departamento_id`; criar `gestao.usuario_departamento`; FK `core→gestao` PROIBIDA **[P8]**
- Dialeto fora do core: `ingestao.*`, enum `origem` neutro (sem `documentize`), `ref.ecac_servico_map`, schemas `ecac`/`billing`, view `billing.nota_auditada_para_billing` **[P9]**
- Partição de `nota_item` por competência **[P10]** *(⚠️ ver decisão aberta §7.4)*
- `core.base_adocao` **[P11]** · `competencia` derivada por função + `chave_dedup` **[P12]** · `restauracao_sistema` no CHECK **[P13]**
- Roles por módulo: role `motor` SEM INSERT em `core.*`; `authenticated` sem UPDATE direto em apontamento; constraint trigger exige evento **[P15/P18/P20]**
- Bitemporalidade na decisão: evento `superado` carrega `conhecida_em` + `vigencia` **[P22]** · golden-set versionado/snapshot **[P23]**

**DoD:** migration aplica limpa num Postgres vazio; rollback funciona; `pgTAP` (ou test runner SQL) verde para cada constraint chave.

---

## 5. ENTREGA 2 — Motor de classificação puro (TDD)

**O que é:** função PURA, zero I/O, zero framework: `classificar(item: Item, base: BaseReferencia): Apontamento[]`. É a única peça que o Beck mandou ter cópia em TS (as outras regras viram dado/pgTAP).

- TS puro, pacote isolado (ex.: `packages/motor-fiscal/` ou `apps/contador-core/src/motor/`). Sem dependência de Supabase.
- Entrada: `{ item_ids, base_versao_id, motor_versao_id }`. Saída: candidatos de apontamento com proveniência (`tipo_inferencia='regra_deterministica'`).
- **Golden-set harness:** estrutura de fixtures `(item, base) → apontamentos_esperados`. Comece com casos SINTÉTICOS (o tributarista vai rotular os reais depois — ver §7.5). O harness roda como teste e como gate de CI.
- **Contrato (P15):** o motor NUNCA escreve no banco. Devolve candidatos; a RPC `core.registrar_analise(...)` materializa em `analise_execucao` + apontamento + evento na MESMA transação. Desenhe o motor já assim (extraível pra Python por troca de runtime, não cirurgia).

**DoD:** `vitest`/`jest` verde; golden-set harness rodando; cobertura da lógica de materialidade/desempate; primeiro teste vermelho→verde commitado.

---

## 6. ENTREGA 3 — Verificador da cadeia (CLI) + ENTREGA 4 — Fitness functions

**Verificador (P16):** CLI standalone (ex.: `packages/trilha-verifier/`) que lê eventos, recomputa o hash (mesma fórmula canônica do trigger P4), confere contra `trilha_cabeca` e contra os TSTs/golden-hashes. É a spec executável do hash-chain e o artefato pericial de 2031. **Multi-geração:** capaz de verificar eventos de fórmulas v1/v2 (carrega `hash_ver`). NÃO re-executa LLM — só re-verifica integridade (coerente com P3).

**Fitness functions D0 como CI (P21):**
- **FF-1** — fronteira de import (dependency-cruiser): nada do `core` importa de `gestao|billing|ecac`.
- **FF-2** — fronteira de schema (query `pg_constraint`/`pg_depend`): zero FK `core→gestao|billing|ecac`; toda tabela tenant tem RLS. **Com whitelist do kernel Apuração+Trilha** (a RPC que cruza estado→evento é fronteira nomeada, não violação — ver §2-bis do doc 17 v1.1).
- **FF-3** — isolamento cross-tenant generativo: enumera tabelas, falha se faltar policy RLS.
- **FF-6** — imutabilidade do ledger: tenta UPDATE num evento, exige que falhe.

**DoD:** as 4 FFs rodam no CI e falham quando deveriam (teste do teste); verificador roda contra uma cadeia de fixtures e detecta adulteração + mudança de fórmula.

---

## 7. ✅ Decisões resolvidas (ratificadas pelo founder 15/Jun) + requisitos que entram no build

1. **S-N1 — RESOLVIDO (conclave Heleno, `22-parecer-heleno-defesa-boafe.md`):** a defesa de boa-fé via re-verificação **SUSTENTA, com condições** — mitiga (escudo contra multa qualificada 150%), NÃO imuniza o tributo. Confirma P22/P3/P16/P17 como juridicamente indispensáveis. **NOVO REQUISITO DE SCHEMA →** o evento de aprovação deve registrar **decisão humana INDIVIDUALIZADA, não clique em lote** (requisito jurídico, não UX) — o ato privativo precisa de `ator`=contador-CRC + evidência de decisão individual por apontamento. Reforça P6/P17/P20. **NÃO prometer:** re-execução da IA, apuração/crédito garantidos, ausência de multa, decisão fiscal automática.
2. **P14 (ACT) — RESOLVIDO (`23-pesquisa-custo-act-carimbo.md`):** custo desprezível (R$1,32–6,60/mês/tenant base). Merkle-por-dia confirmado (RFC 4998 — cobra por carimbo, não por evento). Validade jurídica confirmada (MP 2.200-2 + STJ REsp 1.495.920). Não bloqueia. **Follow-up founder/ops:** cotar formal Serpro/Bry antes do 1º cliente pago.
3. **B11 (billing) — RESOLVIDO: `superado` NÃO conta como nota faturada.** Construa a view `billing.nota_auditada_para_billing` SEM o marcador pendente — é decisão ratificada.
4. **P10 (item-partition) — RESOLVIDO: SIM, entra na Migration 001 (D0).** Particionar `nota_item` por competência no D0.
5. **Golden-set (Spike 2) — protocolo desenhado (`24-golden-set-protocolo-rotulagem.md`):** construa o harness com casos SINTÉTICOS no formato do schema do §3 daquele doc. ⚠️ **Recrutar o tributarista rotulador é caminho crítico do founder/Renan** — em paralelo ao código. Não vender acurácia sintética como real.

---

## 8. Stack & convenções (do doc 11/17)

- **Backend:** Postgres/Supabase, RLS por `escritorio_id`, **pgmq** (não pg-boss), RPCs `security definer` como única porta de escrita.
- **App:** Next.js 15 + React 19 + TS (mesmo padrão do `apps/radar-fiscal`, que é o módulo OPERACIONAL/periferia — **não** é o core; não construa em cima dele).
- **Multi-tenant:** default-deny RLS; nada de bypass via PostgREST (P20).
- **Testes:** `vitest` para o motor; `pgTAP` (ou equivalente) para constraints; dependency-cruiser para FF-1.
- **Provider de captura:** Focus é hipótese primária — mas captura é F2, **fora desta leva**.

---

## 9. Sequência sugerida & primeiro commit

1. `git checkout -b feat/contador-foundation`
2. **Commitar primeiro os docs do contador** (10-21 estão untracked, ~400KB) como checkpoint da arquitetura — antes de qualquer código.
3. Entrega 1 (migration 001) → Entrega 4 (FF como CI, em paralelo) → Entrega 2 (motor TDD) → Entrega 3 (verificador).
4. Cada entrega = um commit atômico com seu teste verde.

**Definition of Done da Fundação:** migration aplica + 4 FFs no CI + motor com golden-set sintético verde + verificador detecta adulteração. Zero captura, zero UI, zero RAG, zero Gestorize.

---

## 10. EPIC `CONTADOR-F1-FOUNDATION` — quem faz o quê (RACI)

> **Meta da Epic:** entregar a Fundação (schema + motor puro + verificador + gates) com qualidade verificável, sem violar os portões da §3.
> **Modelo de time (expertise na ORIGEM):** quem sabe a matéria **AUTORA a substância**; o agente da área **IMPLEMENTA/INTEGRA e REVISA** implementabilidade; o **Codex é a mão** que digita o código sob a persona do agente (clone não escreve TypeScript — escreve a verdade de domínio que o código tem que honrar); **@qa é o gate**. Review flui nos DOIS sentidos: o agente revisa se a spec do clone é implementável; o clone revisa se a implementação é fiel ao domínio. **Founder ratifica** arquitetura/negócio (doc 04).
>
> **Dois tipos de clone:** **fiscais** (🏛️heleno/📡roberto/📈anderson/cassie) **autoram substância NOVA** no build (regras cClassTrib reais, spec do evento jurídico, rótulos) — porque o conclave produziu *arquitetura*, não as regras fiscais. **Arquitetura** (uncle-bob/fowler/kleppmann/newman/kent-beck) **já autoraram** (os patches do conclave) → agora **revisam** a implementação contra o que defenderam.
>
> **Como consultar/encomendar substância a um clone:** `node .aios-core/core/jarvis/self-consultation.js consult --expert {id} --question "..." --project contador` (CLI, nunca MCP — regra `feedback_mcp_fragile`). Trabalho profundo de clone = agente independente que puxa dado ao vivo (regra `feedback_conclave_must_be_deep`), não eu/Codex escrevendo a opinião dele.

### 10.1 Stories da Epic (fluxo: Autor → Implementa → Revisa → Gate)

| Story | AUTOR da substância (clone) | IMPLEMENTA/integra (agente + Codex) | REVISA fidelidade | DoD |
|-------|------------------------------|--------------------------------------|-------------------|-----|
| **S1 — Migration 001 (schema v1.1)** | 🏛️heleno (o que a trilha precisa conter p/ boa-fé) + 📡roberto (formato fiscal/SPED) — substância nova; kleppmann/newman/uncle-bob já autoraram (patches) | `@data-engineer` escreve o DDL | os clones revisam fidelidade; `@architect` revisa contra mapa §2-bis | migration aplica + pgTAP verde por constraint |
| **S2 — RPC `core.api_v1` + decisão individualizada** | 🏛️heleno autora a spec do **evento de decisão individualizada** (o que um ato privativo CRC tem que registrar p/ valer juridicamente) | `@data-engineer`+`@dev` implementam RPC + grants | 🏛️heleno revisa (vale no auto?); uncle-bob revisa SAP/additive-only | porta lateral morta; evento grava decisão individual; teste de contrato |
| **S3 — Motor de classificação puro (TDD)** | 📡roberto + 🏛️heleno **autoram as regras cClassTrib** (a lógica fiscal é deles, não do dev) | `@dev` implementa a função pura + harness | roberto/heleno revisam acurácia; kent-beck revisa simplicidade/TDD | função pura, zero I/O; golden-set sintético verde; não escreve no banco |
| **S4 — Verificador da cadeia (CLI)** | kleppmann (spec do hash/multi-geração — já autorada no conclave) | `@dev` implementa o CLI | kleppmann + uncle-bob revisam; 🏛️heleno revisa valor pericial | detecta adulteração + mudança de fórmula contra fixtures |
| **S5 — Fitness functions D0 (CI)** | fowler + newman (specs FF + whitelist do kernel — já autoradas) | `@devops`+`@qa` implementam no CI | fowler/newman revisam; gene-kim revisa pipeline | FF-1/2/3/6 rodam e falham quando deveriam |
| **S6 — Golden-set harness** | 🏛️heleno + 📡roberto + **tributarista externo** rotulam os itens (a substância É o rótulo) | `@data-engineer` constrói o harness (formato sintético até os reais chegarem) | cassie revisa viés de rótulo; `@qa` calibra threshold do gate | harness no formato `24-...md` §3; gate calibrado pós-rótulos reais |
| **S0 — Governança & sequência** | 📈anderson (pricing/ICP/posicionamento) | `@pm` integra no PRD + recruta tributarista | founder ratifica | tributarista recrutado (caminho crítico); P-1..P-9 no PRD; promessa "datada" |

### 10.2 Responsabilidade de cada AGENTE (implementa + revisa — não autora domínio)

- **Orion (aios-master)** — orquestra a Epic, guarda as decisões do conclave, gate de ratificação founder↔build.
- **`@data-engineer`** 🗄️ — implementa schema/migrations/RLS/RPC/views/ledger (S1/S2/S6) a partir da substância dos clones; guardião de que o contrato de dados é implementável e KISS.
- **`@dev`** 💻 — implementa o código TS (motor S3, verificador S4) a partir das regras dos clones; co-implementa S2.
- **`@architect`** 📐 — revisa que a implementação bate com o mapa de contextos §2-bis e a semântica das fitness functions. Não escreve código.
- **`@qa`** 🧪 — gate de qualidade, security scan, DoD, calibra threshold do golden-set. **Bloqueante antes de merge.**
- **`@devops`** ⚙️ — CI/CD, fitness functions no pipeline, branch/PR (S5).
- **`@pm`** 📋 — integra a substância do anderson no PRD, sequencia recrutamento do tributarista, dono do posicionamento datado (S0).
- **`@po`/`@sm`** — formalizam/validam as stories em `docs/stories/` se quiser rastreio formal de sprint (opcional).
- **`@ux`** — **fora de escopo** nesta leva (zero UI até o Concierge validar).

### 10.3 Responsabilidade de cada CLONE (autora substância + revisa fidelidade)

> Regra `mind-clone-auto-consult`: o clone entra ANTES (autorando) e na revisão de fidelidade; pular só edição trivial/build/teste de rotina. Logar o que o clone produziu e como entrou.

| Clone | AUTORA (a substância que vira código) | + REVISA |
|-------|----------------------------------------|----------|
| 🏛️ **heleno-taveira-torres** | spec da trilha de boa-fé · spec do evento de decisão individualizada (ato privativo CRC) · "o que prometer/NÃO prometer" | toda implementação que toca defensabilidade jurídica; linhas vermelhas (IA não decide matéria fiscal) |
| 📡 **roberto-dias-duarte** | regras de classificação cClassTrib · formato do dado fiscal/SPED que o EFD futuro vai usar | acurácia fiscal do motor (S3) e do schema (S1) |
| 📈 **anderson-hernandes** | semântica da view de billing · pricing/ICP/posicionamento (S0) | impacto comercial das decisões de produto |
| 📈 **cassie-kozyrkov** | protocolo anti-viés da rotulagem do golden-set | qualidade do eval/labeling (lição Noyce) |
| 🧹 uncle-bob · 📐 fowler · 📊 kleppmann · 🏗️ newman · 🟢 kent-beck | **já autoraram** (patches do conclave) | revisam a implementação contra Component Principles/SAP · fitness functions · ledger · fronteiras/CUPID · simplicidade-TDD |

### 10.4 Dependências (ordem de ataque)

```
S0 (recrutar tributarista) ──────────────► roda em paralelo, é caminho crítico do founder
S1 (schema) ──┬──► S2 (RPC) ──► S3 (motor) ──► S4 (verificador)
              └──► S5 (fitness functions, em paralelo após S1)
S6 (golden-set harness) ──► acopla a S3; ground-truth real entra quando S0 entregar
```
**@qa (S5/gate)** valida o conjunto antes de qualquer merge na branch.

---

*Handoff produzido por Orion. Escopo limitado à fatia "go well" do Beck — segura sob os portões ratificados. Qualquer expansão além da §4-6 exige nova ratificação do founder.*
