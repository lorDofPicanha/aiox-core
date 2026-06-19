# Síntese do Conclave SOLID — Findings + Lista de Patches v1.1

> **Data:** 2026-06-15 · **Autor:** Orion (aios-master) — síntese pós Rodada 2 adversarial
> **Alvo da revisão:** `../17-arquitetura-core-v1.md` + schema `../16-conclave-arquitetura/02-data-engineer-schema.md`
> **Painel (HYDRA real, DNA via `self-consultation.js`):** uncle-bob-martin · martin-fowler · martin-kleppmann · sam-newman · kent-beck
> **Processo:** Rodada 1 (5 análises independentes, ~160KB) → Rodada 2 adversarial (cada expert refutou os outros 4, ~180KB) → esta síntese.
> **Insumos R2:** `r2/01-uncle-bob-r2.md` · `r2/02-fowler-r2.md` · `r2/03-kleppmann-r2.md` · `r2/04-newman-r2.md` · `r2/05-kent-beck-r2.md`
> **Status:** ⏳ AGUARDA RATIFICAÇÃO DO FOUNDER antes de aplicar ao doc 17 (regra doc 04: arquitetura = decisão humana; NÃO reescrever o 17 direto).

---

## 0. Veredito em uma frase

A arquitetura v1.0 tem **a espinha certa** (ledger transacional, base bitemporal, fase-gating Concierge) — os 5 especialistas convergiram nisso. O que falta são **as fronteiras**, e há **2 furos de dados que só apareceram quando as recomendações dos próprios experts se cruzaram** na Rodada 2. Nenhum achado muda o paradigma; todos custam **dias, não meses** — *porque ainda estamos no papel, e papel é o único lugar onde reconciliar 5 bons conselhos é de graça.* **Veredito coletivo: APROVADA COM CORREÇÕES.**

---

## 1. CONSENSUS — convergência dura (4-5 lentes no mesmo prego)

Quando 4-5 revisores independentes que não se falaram apontam o mesmo buraco, o buraco é real. Cinco consensos sobredeterminados:

| # | Achado | Quem convergiu | Patch |
|---|--------|----------------|-------|
| **C1** | **Motor versionado como entidade**, não string em jsonb. Anatomia: código/regras-hash/modelo-LLM/prompt-hash/embedding/params/golden-set. | UB·Kleppmann·Newman·Fowler (4×) | **P1** |
| **C2** | **Re-verificação ≠ re-execução.** A frase do §3.3 ("laudo re-executável") é FALSA para a camada RAG — um LLM de 2027 está morto em 2031. Defensabilidade = decisão humana registrada, não determinismo de máquina. *"O achado mais importante do conclave" (Newman).* | UB·Kleppmann·Newman·Beck·Fowler (5×) | **P3** |
| **C3** | **Matar o ciclo `core→gestao`** (FK `core.usuario.departamento_id`). | UB·Newman·Fowler (3×) | **P8** |
| **C4** | **Dialeto do fornecedor fora do `core`** (`provider_meta`, `ultimo_nsu`, enum `'documentize'` em payload imutável = veneno de proveniência). | Newman·Fowler·UB (3×) | **P9** |
| **C5** | **Contrato de payload + hash versionado é bloqueante do C0** — contrato de dados não se back-filla num ledger append-only. | Kleppmann·Beck·Fowler (3×) | **P2·P4** |

---

## 2. O FRAME-MESTRE (Kent Beck) — a régua que decide tudo

A R1 produziu **~56 patches somados, 0 cortados** — o mesmo erro de "comitê" que o conclave anterior cometeu (28 condições, 0 rejeições). Beck foi o padrinho do calendário e deu a régua que organiza a síntese inteira:

> **Contrato de dados (irrecuperável se não nascer agora) → entra no D0.**
> **Comportamento / operação / job → espera o gatilho objetivo.**

Conta refeita: o D0 reconciliado é **~15 itens de contrato (~2-2,5 semanas de DDL/doc)**, que **não move** a conta da F1 (16-20 semanas) porque é quase tudo DDL barato. O que **não** entra (pacotes de domínio, protocolos operacionais, 8 fitness functions de features futuras) é o que teria estourado o cronograma de 1 dev.

**A v1.1 é construível por 1 dev SE E SOMENTE SE a régua for respeitada.** Se a síntese aceitar os 56 patches como "todos antes da F1", a conta volta a 32-45 semanas — pior que a R1.

---

## 3. DISSENT resolvido — a única briga estrutural real

**O pacote `@contador/dominio` (P-UB6 do Uncle Bob): REJEITADO como bloqueante do D0.**

Uncle Bob propôs portar TODA a lógica de domínio (máquina de estados, materialidade, ato privativo, semântica da trilha) para um pacote TS puro, com triggers virando backstop conferido por teste de equivalência. **Três experts atacaram, independentemente:**

- **Newman:** "duas cópias do invariante é **dual-write de lógica** — Bob caçou dual-write de *dados* na R1 e prescreveu dual-write de *comportamento*. A RPC já É a fronteira; falta proibir o bypass, não escrever 2ª cópia."
- **Fowler:** "dupla manutenção permanente num domínio que inventa estados o tempo todo. O remédio evolutivo: **a regra de transição vira DADO** (`ref.transicao_permitida`), não código duplicado — um lugar para a verdade, não três."
- **Beck:** "'twice, and prove it's once' para 1 dev. Só o motor puro + o verificador CLI valem o D0."

**Resolução (o que o Uncle Bob cedeu):** sobrevivem ao ataque → **(a)** o verificador da cadeia como CLI standalone (P16), **(b)** o contrato do motor puro (P15), **(c)** a regra de transição como dado versionável (`ref.transicao_permitida`, testável por pgTAP). O pacote de domínio *completo* vira **YAGNI com gatilho** (≥2 regras precisando de teste unitário rápido, ou 2º dev).

**Corolário (Newman cede a Fowler):** a fitness function de fronteira (N-W1) não pode ser regra mecânica cega — ela **proibiria o kernel transacional Apuração+Trilha**, que é o coração do moat. Precisa do **mapa de contextos DDD do Fowler** com *whitelist explícita* do kernel (a RPC que cruza estado→evento é fronteira nomeada, não violação).

---

## 4. BLIND SPOTS — o que NINGUÉM viu na R1 (emergiram do cruzamento na R2)

Estes são o real valor da rodada adversarial: não estavam em nenhuma das 28 condições nem nos K's individuais — **estavam nas interações entre as recomendações dos próprios experts.**

| # | Blind spot | Descoberto por | Gravidade | Patch |
|---|-----------|----------------|-----------|-------|
| **B1** | **`seq_tenant` via `MAX(SELECT)` + advisory lock = contador distribuído fingindo ser local.** No 1º failover/réplica (a própria rota de escala sugerida): `seq_tenant` duplicado → `uq_evento_seq` derruba a aprovação no pico do dia 5. | Kleppmann (K-13) | 🔴 | **P5** |
| **B2** | **Carimbo ACT diário × hash-chain por-tenant se mordem.** 1 carimbo/dia × N tenants quebra a COGS (erro 12×); 1 carimbo de Merkle de todos quebra o isolamento (prova de um tenant revela existência de outros). | Kleppmann (K-14) | 🔴 | **P14** |
| **B3** | **A geração-0 da cadeia nasce MANUAL no C0 e é eterna/inexpurgável** — mas o C0 ("zero backend novo") não tem código pra impor os invariantes que os 5 exigiram (motor_versao, ato-privativo-CRC, hash, escrita-só-RPC). Ou nasce conforme, ou é permanentemente mais fraca. | Beck (2.1) | 🔴 | **P17** |
| **B4** | **Contrato da camada de RPCs nunca foi declarado (SAP invertido):** as RPCs `security definer` são o componente mais *estável* E mais *concreto* (zona da dor) — mudar a assinatura quebra todos sem aviso de compilador. | Uncle Bob (2.1) | 🔴 | **P19** |
| **B5** | **O schema `app.*` é o cano invisível até o Auth do vendor:** `app.current_papel()` lê o JWT do Supabase e é chamado por TODAS as RLS do core — o moat depende de um schema "utilitário" sem governança de dependência. | Uncle Bob (2.2) | 🔴 | **P18** |
| **B6** | **O Gestorize é o MAIOR terceiro do projeto** e a arquitetura lhe deu FK direta para o core em vez de um **ACL**. Quando o Spike 5 falhar, a dívida do legado contamina a tabela de identidade do moat por esse canal. | Newman (2.1) | 🔴 | **P8** (2º motivo) |
| **B7** | **O conclave não tem fitness function para si mesmo** — 56 patches entram na síntese sem gate de rejeição, reproduzindo no nível da revisão a doença que Beck diagnosticou nas features. | Fowler (2.1) | 🔴 META | **Regra §6** |
| **B8** | **Golden-set não é versionado** — a 3ª perna da reprodutibilidade (base + motor + eval). O golden-set que liberou o motor v3 deixa de existir quando o v4 é avaliado contra um set maior. | Fowler (2.3) | 🟡 | **P23** |
| **B9** | **Dependência circular no PLANO de migration** (não só no schema): ordem de aplicação entre os 4-5 schemas. O ciclo core→gestao também trava o grafo temporal de migrations. | Fowler (2.2) | 🟡 | resolvido por **P8** |
| **B10** | **Bitemporalidade está na base, não na DECISÃO.** Quando uma NT reabre apontamento carimbado, qual `conhecida_em` do sucessor? Sem os 2 eixos no evento `superado`, perde-se "o que sabíamos quando decidimos" = a defesa de boa-fé inteira. | Kleppmann (2.3) | 🟡 | **P22** |
| **B11** | **Vazamento reverso do billing:** a definição de "nota auditada para faturar" vive na máquina de estados do core. Cada estado novo do Heleno (`regularizado`, `superado`) muda a métrica de cobrança do Anderson. | Newman (2.2) | 🟡 | **P9** (view versionada) |

---

## 5. LISTA DE PATCHES v1.1 — para ratificação

Cada patch segue a **regra de Fowler (B7):** só entra com **(a) gatilho/onde · (b) custo · (c) teste que prova a aplicação.** Patch sem (c) = "decisão aberta com dono", não item de schema.

### 5.1 ✅ ENTRA NO D0 — contrato de dados (irrecuperável; ~2-2,5 semanas)

| # | Patch | Onde (doc/§) | Custo | Prova (teste) | Origem |
|---|-------|--------------|-------|---------------|--------|
| **P1** | `ref.motor_versao` entidade versionada (anatomia completa) + FK em `analise_executada`/`apontamento` + discriminador `tipo_inferencia ∈ {humano_concierge, regra_deterministica, rag}` + FK `golden_set_versao_id` | 02 §3.3/3.5; 17 §3.1 | ~1 dia | FK NOT NULL + CHECK no discriminador | UB1·NW11·K8·F10 + Newman + Fowler |
| **P2** | Payload de `analise_executada` nasce com TODOS os campos de proveniência computacional (K8) na F1 — `null` enquanto for só-regras, populam quando o RAG entrar | 02 §3.5 | ~0 | Validação de schema do payload | Kleppmann (reconcilia Beck K-1) |
| **P3** | Corrigir frase falsa §3.3 → **re-verificação ≠ re-execução**. Validar com Heleno (Spike 6) | 17 §3.3 | 0 (doc) | Sign-off Heleno | 5× consenso |
| **P4** | `hash_ver` desde o gênese + canonicalização com delimitadores + **hash digere campos canônicos nomeados, não `payload::text`**. Fórmula evolutiva; **verificador multi-geração é o eterno** (não a fórmula) | 02 §3.5 | ~horas | Recompute do hash entre versões de fórmula | K4 + Fowler |
| **P5** | `core.trilha_cabeca(escritorio_id PK, seq, hash, hash_ver)` = fonte única de seq+cabeça (row-lock, single-writer). Substitui `seq_tenant`-via-MAX. Doc: réplica é read-only para sempre | 02 §3.5 | ~horas | Teste de concorrência (zero seq duplicado) | **B1** (K-13/K-10a) |
| **P6** | `UNIQUE(item_id, tipo_divergencia, base_versao_id, motor_versao)` + estado `superado` + `analise_execucao` UNIQUE — **materializado pela RPC, nunca pelo motor** | 02 §3.5 | ~½ dia | Teste de idempotência (retry → sem gêmeos) | K7 (Beck cedeu) + Newman |
| **P7** | Unicidade parcial de evento por referente (idempotência da trilha) | 02 §3.5 | ~horas | Rejeição de evento duplicado | K6b |
| **P8** | **Matar ciclo `core→gestao`** (`departamento_id` → `gestao.usuario_departamento`); FK `core→gestao` PROIBIDA, `gestao→core` permitida = **ACL contra Gestorize** | 02 §3.1/4 | 10 min | FF-2 (pg_catalog: zero FK core→gestao) | C3 + **B6** + **B9** |
| **P9** | Dialeto fora do core: `provider_meta`/`ultimo_nsu`→`ingestao`; enum `origem` neutro (sem `documentize`); `ref.ecac_servico_map` traduz SERPRO na borda; schemas `ecac`/`billing` próprios; **view de medição como contrato versionado** | 02 §3.7/3.8 | ~horas | CHECK do enum + teste de localização de schema | C4 + **B11** |
| **P10** | Particionar `nota_item` por competência (acompanha a mãe `nota`) | 02 §3 | ~horas | Teste de existência de partição | K10.2 |
| **P11** | `core.base_adocao` (estado de adoção de base por tenant — o evento já pressupõe) | 02 §3 | 1 tabela | FK do evento → tabela | NW8 (Beck cedeu) |
| **P12** | `competencia` derivada por função no banco; `competencia_fiscal` separada; `chave_acesso` nullable + `chave_dedup` | 02 §3 | ~½ dia | Teste de dedup na fronteira upload×provider | K5·K6a |
| **P13** | TSTs/laudos em storage WORM fora do banco + tipo `restauracao_sistema` no CHECK (**só o contrato**; runbook → §5.2) | 02 §3.5 | ~horas | Teste do CHECK constraint | K3 parcial |
| **P14** | Decidir carimbo ACT = **Merkle-por-tenant** (1 carimbo da floresta de raízes; prova do tenant X nunca inclui irmãos) + recalcular COGS como variável por-tenant | 17 §3.2 | decisão + doc | Teste de isolamento do caminho de prova | **B2** (K-14) |
| **P15** | Contrato escrito do motor: fila in / RPC out / **INSERT direto proibido por grant** (motor extraível p/ Python por troca de runtime) | 02 §3.5; 17 §3 | 1 pág + grants | Teste de grant (role do motor não faz INSERT em core) | NW13·UB9·A8 |
| **P16** | Verificador da cadeia como **CLI standalone, dia 0** — spec executável do hash + artefato pericial 2031 + embute golden hashes + multi-geração | 17 §14 | ~dias | É a própria prova (roda contra cadeia de teste) | UB7·K4·F4 |
| **P17** | **Forma manual-mas-conforme dos invariantes no C0**: `tipo_inferencia='humano_concierge'`, payload_versao desde o 1º evento, `ator` = contador-CRC nos atos privativos | 17 §2 | ~1 dia | Teste de conformidade do evento C0 | **B3** (Beck R2) |
| **P18** | Governança do `app.*`: fns mecânicas ficam; `current_papel`/`current_escritorio_id` = **único lugar que conhece o formato do JWT** (Single Choice) | 02 §2 | ~horas | Teste (só essas fns leem JWT) | **B5** (UB R2) |
| **P19** | Camada de RPCs como **API publicada `core.api_v1`**: assinaturas tipadas como gate de CI, additive-only, teste de contrato. **Pré-req: P20** | 02 §3.5 | ~dias | Teste de contrato (mudança de assinatura sem bump falha) | **B4** (UB R2, SAP) |
| **P20** | Matar porta lateral do PostgREST: sem policy de UPDATE direto; escrita só via RPC `security definer`; constraint trigger aborta UPDATE sem evento (D0: policy SELECT-only; trigger quando PostgREST exposto) | 02 §3.5 | ~horas | Teste de rejeição da porta lateral | K-1 (UB cedeu precedência) |
| **P21** | **FF-1/FF-2/FF-3/FF-6 como gates de CI no D0** (fronteira de import, fronteira de schema, RLS tenant generativa, imutabilidade sobrevive a migration) — protegem o moat *durante* os cortes do Beck | CI; 17 §3-bis | ~dias + centavos CI | São as próprias provas | Fowler |
| **P22** | Bitemporalidade desce para a DECISÃO: evento `superado` carrega AMBOS os eixos (`conhecida_em` + `vigencia`) | 02 §3 | 1 col + 2 campos | Teste de consulta temporal | **B10** (K R2) |
| **P23** | Golden-set versionado/snapshot (`core.golden_exemplo` ganha versão/snapshot, FK do `motor_versao`) | 02 §3 | ~horas | Teste de imutabilidade do snapshot | **B8** (Fowler) |

### 5.2 ⏳ YAGNI COM GATILHO — comportamento/operação (espera a realidade pedir)

| Patch adiado | Gatilho objetivo de re-adição |
|--------------|-------------------------------|
| Pacote `@contador/dominio` TS completo + teste de equivalência | ≥2 regras de negócio (além do motor) precisarem de teste unitário que pgTAP não cobre; ou 2º dev entra |
| Protocolo operacional de restore (replay automatizado, RPO contínuo, runbook) | 1º tenant com volume real; ou 1º restore de verdade |
| `trilha_cabeca` materializada + lote com Merkle root | p95 do fecho de fila > SLA D+1 em 2 picos; ou tenant full-capture 200 CNPJs |
| Job automatizado de monitor de NT + reanálise de impacto | 2+ atualizações de base/mês; ou 1ª NT perdida |
| FF-7 (replay do laudo), FF-8 (contract tests provider), FF-11 (load test dia-5), FF-12 (guardrail COGS) | A peça que cada uma protege existir (F2) |
| Schemas `ecac`/`billing` com migration própria · `ref.ecac_servico_map` populado | Migration do add-on e-CAC/billing nascer |
| Suíte de conformidade de adapter (LSP executável) | Entregável do Spike 3 (provider) |
| Crypto-shredding de PII em payload | 1º campo de payload com dado pessoal (teste anti-PII no CI entra antes — barato) |
| RAG, PAdES em lote, parser EFD, white-label, decisão em lote | Gatilhos individuais do doc R1 do Beck §2 |

---

## 6. REGRA DE PROCESSO (antídoto de Fowler ao B7) — adotar permanentemente

> **Nenhum patch entra na v1.1 sem (a) gatilho objetivo, (b) custo estimado, (c) um teste/fitness function que prova que foi aplicado. Patch sem (c) vira "decisão aberta com dono", não item de schema.**

Isto transforma a síntese de lista de boas intenções em conjunto verificável — e impede a próxima rodada de virar comitê. A tabela §5.1 já está formatada nesse contrato.

---

## 7. Próximos passos (pós-ratificação)

1. **Founder ratifica** quais patches D0 entram (recomendação: todos os 23 da §5.1 — são contrato de dados barato-agora, irrecuperável-depois).
2. **@architect/@data-engineer** aplica os patches ratificados ao doc 17 + schema doc 02 → gera **doc 17 v1.1**.
3. **@pm** atualiza o PRD com os patches P-1..P-9 pendentes (já anotados em memória).
4. **Commit** dos dirs 10-18 do contador (atualmente todos untracked — ~400KB fora de versão).
5. Sequenciar o **golden-set com o tributarista externo** (Spike 2) — Beck identificou que é o caminho crítico real e ninguém o tinha agendado.

---

*Síntese produzida por Orion via conclave HYDRA real (DNA de 5 experts via `self-consultation.js`), Rodada 2 adversarial independente, fechada conforme a regra "conclave nunca meia-boca".*
