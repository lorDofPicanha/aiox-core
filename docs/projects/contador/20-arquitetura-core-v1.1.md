# Arquitetura Core v1.1 — Apuração Defensável (Contador)

> ⚠️ **Este documento INCORPORA o conclave SOLID ao `17-arquitetura-core-v1.md` (v1.0).** É uma evolução editorial do v1.0 — NÃO o substitui no histórico: o v1.0 segue válido como linha de base. Aqui aplicam-se APENAS os patches de arquitetura/prosa ratificados; os patches de schema vivem no doc `02` (schema v1.1).
>
> **Autor:** Aria (@architect), versionando o v1.0 com os achados do **conclave SOLID (2 rodadas adversariais)** — síntese em `18-conclave-solid/99-sintese-conclave-solid.md`.
> **Data:** 2026-06-15 · **Status:** v1.1 — **incorpora conclave SOLID, ratificado pelo founder 15/Jun/2026.**
> **Painel SOLID (HYDRA real, DNA via `self-consultation.js`):** uncle-bob-martin · martin-fowler · martin-kleppmann · sam-newman · kent-beck.
> **Base v1.0:** conclave de arquitetura Fable (2 rodadas) — `16-conclave-arquitetura/09-sintese-conclave.md`. As 28 condições do Fable seguem incorporadas (§15); o SOLID adiciona as **fronteiras** que faltavam e tapa **2 furos de dados** que só apareceram no cruzamento adversarial.
> **Modelo de dados:** `16-conclave-arquitetura/02-data-engineer-schema.md` é a referência canônica de DDL. Os patches de schema do SOLID (P1…P23) vivem no **schema v1.1 (doc 02)** — aqui são apenas referenciados, nunca duplicados em DDL.

---

## v1.1 — Changelog (patch → seção alterada)

> **Regra de processo adotada (Fowler, B7 / §6):** nenhum patch entra na v1.1 sem **(a) gatilho/onde · (b) custo · (c) teste/fitness function que prova a aplicação.** Patch sem (c) = "decisão aberta com dono", não item de arquitetura. Toda a tabela abaixo respeita esse contrato.

| Patch | Origem (conclave) | Onde mudou nesta v1.1 |
|-------|-------------------|------------------------|
| **P3** | C2 (5× consenso) — "o achado mais importante" | §3.3 reescrito: re-verificação ≠ re-execução; corrige frase falsa do laudo "re-executável". Marcado p/ Spike 6 (Heleno) |
| **P14** | B2 (Kleppmann K-14) | §3.2: carimbo ACT = Merkle-por-tenant; §9 COGS recalculado como custo variável por-tenant |
| **P15** | NW13·UB9·A8 | §3 (novo §3.7) + §3.5: contrato escrito do motor (fila in / RPC out / INSERT proibido); motor extraível por troca de runtime |
| **P16** | UB7·K4·F4 | §14: verificador da cadeia como CLI standalone dia 0 (spec executável do hash + artefato pericial 2031 + multi-geração) |
| **P17** | B3 (Beck R2) | §2: forma manual-mas-conforme dos invariantes no C0; endereça o paradoxo do C0 |
| **P19** | B4 (Uncle Bob R2, SAP) | §3.5: camada de RPCs como API publicada versionada `core.api_v1` (additive-only, assinaturas tipadas = gate de CI) |
| **P21 + §3-bis** | Fowler (F-4) | **Nova §3-bis — Fitness Functions** (Onda D0 bloqueante + Onda por-fase) |
| **Mapa de contextos** | Dissenso §3 + corolário Newman/Fowler | **Nova §2-bis — Mapa de Bounded Contexts**: ACL/Conformist/Shared Kernel; `gestao`=ACL contra Gestorize; kernel Apuração+Trilha=Shared Kernel whitelisted |
| **Dissenso resolvido** | DISSENT §3 | §2-bis + §12: pacote `@contador/dominio` TS REJEITADO como D0 (YAGNI com gatilho); no lugar → regra de transição como DADO + motor puro (P15) + verificador CLI (P16) |
| **Regra de processo** | B7 (Fowler) | **Nova §6** (renumera as antigas §6→§6.1… preservadas): "nenhum patch sem gatilho+custo+teste" |

> **Schema-only (não duplicados aqui — ver schema v1.1, doc 02):** P1 (`ref.motor_versao`), P2 (payload proveniência), P4 (`hash_ver`/canonicalização), P5 (`trilha_cabeca`), P6/P7 (idempotência), P8 (matar ciclo `core→gestao`), P9 (dialeto fora do core), P10–P13, P18 (`app.*`), P20 (porta lateral PostgREST), P22 (bitemporalidade na decisão), P23 (golden-set versionado). Onde um desses toca prosa de arquitetura, ele é citado nesta v1.1 com referência ao doc 02.

---

## 0. O que mudou vs o draft (`16-conclave-arquitetura/01-architect-draft-v1.md`)

A espinha do draft sobreviveu à rodada adversarial intacta — comprar a commodity, construir o moat, trilha first-class, fase-gating, pipeline único. O que o conclave **Fable** corrigiu foi de três naturezas:

| Eixo | O que faltava no draft | Quem pegou | Onde está agora |
|------|------------------------|------------|-----------------|
| **Prova** | Âncora "mensal por e-mail" era fabricável e autorreferente; assinatura ICP adiada por um atrito que não existe; aprovação sem habilitação profissional no DDL; trilha que prova ciência sem cobrar conduta ("**aprovado inerte**") | Heleno (C1–C3) | §3.2, §3.4, §3.5, §5 M-1/M-2 |
| **Operação** | Sem saída pro ERP contábil (re-digitação = churn mês 3); sem EFD como insumo; COGS da captura fora do desenho (R$6,35/CNPJ quebra o corredor flat); pico do dia 1-12 ignorado | Roberto (R1–R3, R5–R6) | §7, §3.5, §9, §5 M-9/M-12/M-13 |
| **Negócio** | C0 invendável (sem tela, Renan venderia consultoria); sem metering (D7 era slide); sem implantação; sem Relatório de Valor; white-label como adjetivo | Anderson (R1–R5) | §8, §6.1, §5 M-10/M-11/M-14 |

Decisões do draft revisadas: **A2** (pg-boss → **pgmq**), **A5** (REVERTIDA — carimbo ACT + assinatura PAdES entram no MVP, na "versão barata"), **A6** (fechada com hierarquia de fontes), **A7** (sinal pró-PlugNotas → **Focus como hipótese primária**, por previsibilidade de COGS). Detalhe em §12.

> **v1.1 (conclave SOLID):** sobre essa base, o SOLID não mudou o paradigma — adicionou **as fronteiras** (mapa de contextos §2-bis), **as verificações contínuas** (fitness functions §3-bis), e corrigiu **2 furos de dados** que só apareceram no cruzamento das recomendações dos próprios experts (carimbo ACT × hash-chain por-tenant; paradoxo da geração-0 do C0). Veredito coletivo SOLID: **APROVADA COM CORREÇÕES** — todas baratas porque ainda estamos no papel.

---

## 1. Princípios arquiteturais (v1.0 FINAL — mantidos)

1. **Comprar a commodity, construir o moat.** Runway de 8 meses vai para motor de auditoria + trilha de boa-fé. Captura (provider), e-CAC (Integra Contador) e emissão (NFS-e Nacional) são alugados/oficiais. *(D2)*
2. **A trilha de boa-fé é cidadã de primeira classe — e fecha o ciclo.** Não é log: é ledger imutável com proveniência normativa, âncora temporal externa (ACT ICP-Brasil) e assinatura qualificada. E ela só protege se registrar **conduta**, não só ciência: o ciclo indício→decisão→ação→protocolo é parte da trilha, não feature à parte. *(moat — §3; Heleno C1/C3)*
3. **Humano no loop é design — e o humano é QUALIFICADO.** O ato que sustenta o laudo é privativo de contabilista: papel `contador` com CRC ativo no schema; analista tria e prepara, não pratica o ato. O laudo sai assinado (PAdES, e-CPF que o contador já tem) em nome dele, nunca da plataforma. *(D8; Heleno C2/C9)*
4. **Pipeline único de ingestão, com DUAS classes de qualidade de insumo.** Upload manual, e-Contínuo e provider convergem no mesmo pipeline; origem é metadado. Mas XML ≠ documento extraído (PDF/OCR); a classe de insumo que sustentou cada apontamento fica gravada na trilha. *(Roberto 1.1b)*
5. **Fase-gating: nada nasce antes do sinal verde (D4).** Dia-0 = zero infra nova de backend — mas **com Demo Kit** (UI mínima sobre o que já existe). *(Anderson R1)*
6. **Captura é SELETIVA por design — gestão de margem E de risco.** `captura_ativa` default OFF por CNPJ; liga por decisão explícita do escritório. Franquia ≥2-3× o custo variável; teto de docs/mês por tenant. *(Roberto R3 + Heleno 1.3 + Anderson R6)*
7. **Postgres-only no início.** Supabase (Postgres + RLS + Storage + pgvector) + **pgmq** como fila. Uma peça de infra, multi-tenant por RLS.
8. **Linguagem jurídica defensiva é TESTE DE SISTEMA, não convenção.** Banlist executável rodando como teste automatizado sobre todo template. Nenhuma data-marco hard-coded: calendário normativo é dado versionado (`ref.marco_normativo`). *(Heleno C8/C10)*
9. **O produto que apura não basta: vende, implanta, prova valor e fatura.** Demo Kit, módulo de Implantação, Relatório de Valor mensal nas duas pontas e metering de nota auditada são componentes de arquitetura com o mesmo status do motor. *(Anderson R1–R5)*

> **v1.1 — princípio 10 (conclave SOLID):** **Fronteira não-enforçada é só uma sugestão (Newman).** O monolito modular Postgres-only é a arquitetura certa para 1 dev construir um moat transacional (Fowler S7 defendeu por 4 razões) — mas "modular" é adjetivo até existir gate. As fronteiras do §2-bis só são reais porque a §3-bis as transforma em fitness function de CI. Sem FF-1/FF-2, na terceira sexta-feira apertada `gestao` importa `core` interno e ninguém nota até a extração ser impossível.

---

## 2. Visão de componentes — C4 nível contêiner, com fase-gating

Etiquetas: `[C0]` Concierge (dia-0) · `[F1]` após Concierge pago · `[F2]` após F1 validada · `[F3]` recuperação/emissor · `[A]` add-on e-CAC (linha paralela).

```
                ESCRITÓRIO CONTÁBIL (tenant)                      CLIENTE FINAL (indireto)
                sócio/gestor · CONTADOR (CRC) · analista          NUNCA é usuário; recebe
                      │ HTTPS                                     Relatório de Valor white-label
┌─────────────────────▼────────────────────────────────────────────────────────────────────┐
│  WEB APP — Gestorize React estendido                                                      │
│  [C0: DEMO KIT — upload→divergências c/ R$→laudo brandado→painel semáforo]                │
│  [F1: fila de revisão c/ materialidade ("fila do dia") · assinatura em lote · laudos      │
│       · IMPLANTAÇÃO (import carteira em lote + checklist) · admin/billing (admin-only)]   │
└───────┬──────────────────────┬──────────────────────────────┬─────────────────────────────┘
        │                      │                              │
┌───────▼───────────┐ ┌────────▼───────────────┐ ┌────────────▼───────────────────────┐
│ INGESTÃO [C0/F1]  │ │ ⭐ MOTOR DE AUDITORIA  │ │ ⭐ TRILHA DE BOA-FÉ [C0 manual/F1] │
│ • upload/Documen- │ │    [F1]                │ │ ledger append-only hash-encadeado  │
│   tize (XML, PDF  │ │ regras + RAG cClass-   │ │ • proveniência por apontamento     │
│   extraído — 2    │─▶ Trib (fato gerador!)  │─▶ • aprovações assinadas (CRC)       │
│   classes insumo) │ │ confidence calibrada   │ │ • ciclo decisão→ação→protocolo     │
│ • PARSER EFD [F1] │ │ golden-set/eval        │ │ • ÂNCORA ACT ICP-Brasil            │
│ • webhook provider│ │ ── contrato P15 ──     │ │   (Merkle-por-tenant — P14)        │
│   [F2]            │ │ fila in / RPC out      │ └────────────┬───────────────────────┘
└───────┬───────────┘ └────────┬───────────────┘              │
        │             ┌────────▼────────────────┐ ┌───────────▼───────────────────────┐
┌───────▼───────────┐ │ BASE DE REFERÊNCIA [F1] │ │ SAÍDAS [C0 manual → F1]           │
│ FILA pgmq [F2]    │ │ cClassTrib×NCM×CST      │ │ • Gerador de Laudo (PAdES e-CPF   │
│ retry · idempot.  │ │ bitemporal + vigência   │ │   do contador + carimbo ACT)      │
│ backpressure      │ │ pelo FATO GERADOR       │ │ • RELATÓRIO DE VALOR mensal       │
└───────────────────┘ │ camadas: oficial (fund.)│ │   (dono + white-label) [F1]       │
                      │ licenciada (sugestão)   │ │ • EXPORT DE AJUSTES → ERP         │
┌───────────────────┐ │ + ref.marco_normativo   │ │   Domínio/Alterdata (CSV) [F1]    │
│ STORAGE XML       │ │ + ref.politica_retencao │ │   gate: só a jusante de aprovação │
│ matriz de retenção│ └─────────────────────────┘ │   qualificada; evento na trilha   │
│ tenant→CNPJ→comp. │                             └───────────────────────────────────┘
└───────────────────┘  POSTGRES multi-tenant      ┌───────────────────────────────────┐
                       (RLS em tudo) [C0/F1]      │ METERING & BILLING [F1 dia-0]     │
┌───────────────────┐  + RPCs core.api_v1 (P19)   │ consumo_mensal · assinatura       │
│ OBSERVABILIDADE   │                             │ franquia/excedente (D7)           │
│ [F1→F2] heartbeat │                             └───────────────────────────────────┘
│ custo e-CAC ·     │
│ aprovação cega ·  │
│ SLA pendências ·  │
│ FITNESS FUNCTIONS │  ◀── §3-bis: FF-1..FF-12 (D0 bloqueante + por-fase)
└───────────────────┘
═══════════════════════════ fronteira da nossa nuvem ══════════════════════════════════════
   ▲ XML+meta (webhook)        ▲ consultas (cache+gate)        ▲ emissão [F3]   ▲ carimbo
┌──┴─────────────────┐ ┌───────┴──────────────────┐ ┌──────────┴──────────┐ ┌───┴────────┐
│ PROVIDER CAPTURA   │ │ SERPRO INTEGRA CONTADOR  │ │ ADN/SEFIN NFS-e     │ │ ACT ICP-   │
│ [F2] Focus (hipót. │ │ [A] gate PROCURACOES     │ │ NACIONAL [F3]       │ │ Brasil     │
│ primária)/PlugNotas│ │ antes de chamada cobrada │ │ (DANFSe próprio —   │ │ (carimbo   │
│ • custodia A1 (DPA)│ │ • toda consulta ref. a   │ │ API nacional morre  │ │ do tempo)  │
│ • seletivo, teto   │ │   procuração que autoriza│ │ 01/07/2026)         │ │ [C0/F1]    │
│   docs/mês/tenant  │ │ • R$0,24–0,40/consulta   │ └─────────────────────┘ └────────────┘
│ ACL — dialeto fica │ │ Conformist — códigos     │
│ em ingestao.* (P9) │ │ SERPRO ficam no contexto │
└────────────────────┘ └──────────────────────────┘
```

**O que existe em cada fase:**

| Fase | O que existe | Infra nova |
|------|--------------|-----------|
| **C0 Concierge** | **Demo Kit** (upload via Documentize → divergências com R$/confiança → laudo PDF brandado → painel semáforo); análise manual nos bastidores (Breno+AIOS) = **dossiê de evidências = insumo interno do escritório**; o **contador do escritório revisa, decide e assina** (nome + CRC + PAdES); **trilha preenchida manualmente JÁ no schema final, manual-mas-conforme (P17)**; **carimbo ACT manual avulso sobre o hash de cada laudo** | **ZERO backend novo** — Demo Kit é UI sobre Documentize/Gestorize |
| **F1** | Motor (regras+RAG) **com contrato P15 (fila in / RPC out)**, base de referência bitemporal em camadas, golden-set/eval, trilha automatizada + fecho diário carimbado (**Merkle-por-tenant, P14**), fila de revisão com materialidade, gerador de laudo (PAdES em lote), **Export ERP**, **parser EFD**, **Relatório de Valor**, **Metering/assinatura**, **Implantação**, **RPCs `core.api_v1` versionadas (P19)** | Supabase + pgvector (+ migrations 001/002) + **fitness functions D0 no CI (§3-bis)** |
| **F2** | Captura comprada SELETIVA (provider+DPA, `captura_ativa` por CNPJ, teto/tenant), webhook, pgmq, observabilidade de captura | Conta no provider + webhook + pgmq |
| **F3** | Recuperação industrializada (dossiê PER/DCOMP referenciando linha de EFD) + emissor NFS-e Nacional (DANFSe próprio) | API ADN/SEFIN |
| **A (paralelo)** | Conector e-CAC com gate de procuração first-class; tela 1 = auditoria de procurações da carteira | Contrato SERPRO |

### 2.1 [P17] O paradoxo do C0 — a geração-0 nasce MANUAL, mas DEVE nascer CONFORME

> **Origem:** B3 (Beck R2, §5.1) cruzado com Fowler §5.1 e Newman §2.3. **Gravidade: 🔴.**

O conclave SOLID nomeou a armadilha mais sutil do desenho inteiro: **a única parte não-sacrificável do sistema nasce na fase mais improvisada.** Um ledger append-only com hash-chain é o único componente onde arquitetura sacrificial é IMPOSSÍVEL — não se corrige, migra nem expurga depois. Cada evento manual que o Breno inserir em julho/2026 estará na cadeia que um perito examina em 2031. Mas o C0 ("zero backend novo") não tem código para impor os invariantes que os 5 experts exigiram.

**Resolução (a geração-0 é manual de operação, mas conforme de contrato):** o C0 não pode escolher entre "ter código" e "ser conforme". Os invariantes são impostos pelo **schema final + RPCs** que já existem desde o C0 (a trilha "nasce no schema final" — v1.0 §2); a operação é que é manual. Concretamente, todo evento do C0 DEVE respeitar:

- **`payload_versao` (ou `schema_versao`) desde o PRIMEIRO evento** — promovido de "pendência v1.1 do doc 02" a **bloqueador do C0** (Fowler F-5). Eventos C0 e F1 do mesmo `tipo_evento` com payloads de formatos diferentes = cadeia heterogênea que o verificador de 2031 precisa entender para sempre. O contrato de payload por `tipo_evento` é documentado ANTES do primeiro laudo manual.
- **`tipo_inferencia = 'humano_concierge'`** — a geração-0 tem anatomia própria (Newman §2.3). `ref.motor_versao` carrega o discriminador `tipo_inferencia ∈ {humano_concierge, regra_deterministica, rag}` desde a primeira linha; a análise C0 grava `motor_versao` = entrada "manual-c0" com identificação do procedimento humano usado (qual checklist), NÃO 80% de colunas NULL. A geração-0 é a que mais importa juridicamente (provou a tese) — não pode ser um buraco de proveniência.
- **`ator` = contador-CRC nos atos privativos** — a transição que sustenta laudo exige `papel='contador'` com CRC ativo já no C0 (na RPC e na RLS, M-1). O dossiê é insumo do escritório; o contador do escritório assina. O ato privativo nasce conforme, não é retrofitado na F1.
- **hash desde o gênese** (`hash_ver`, canonicalização com delimitadores — P4, doc 02) — o verificador da cadeia (P16/FF-4) nasce já lidando com gerações mistas (humano_concierge + regra + RAG na mesma cadeia do mesmo tenant).

- **(a) gatilho/onde:** §2 (C0), §6.1; antes do 1º evento real do Concierge.
- **(b) custo:** ~1 dia (é disciplina + contrato de payload já desenhado no doc 02).
- **(c) prova:** teste de conformidade do evento C0 (todo evento C0 tem `payload_versao` não-nulo, `tipo_inferencia='humano_concierge'`, e atos privativos com `ator` de CRC ativo).

> **Ponto crítico do C0 (inalterado e reforçado):** a trilha NASCE no Concierge, manual-mas-conforme, no schema final. O Demo Kit não viola o "zero infra": é a tela que faz o C0 validar a hipótese certa. E o desenho jurídico do C0 é fixo: **nós produzimos dossiê; o contador do escritório assina o laudo** — canal, não fachada (Heleno C9). O Demo Kit é declarado **explicitamente sacrificial** (Fowler F-8): a "fila do dia" da F1 NÃO estende telas do Demo Kit (critério de aceite da F1).

---

## 2-bis. [Mapa de Contextos] Bounded Contexts — a fronteira que faltava (resolução do dissenso)

> **Origem:** dissenso estrutural §3 da síntese SOLID + corolário Newman cede a Fowler (§1.4 do Newman R2) + Fowler F-2. **Esta seção É a resolução do único dissenso real do conclave.**

A v1.0 §2 é um C4 de contêineres competente. Mas contêiner é unidade de **deploy**; bounded context é unidade de **linguagem** (Fowler). A v1.0 tinha caixas, setas e fases — não tinha uma declaração de onde uma linguagem ubíqua termina e outra começa, nem qual padrão DDD rege cada fronteira. Para um sistema que vai viver 7 anos de transição tributária com 1 dev, isso não é formalismo: é o mapa que decide, a cada feature, "isso pertence a quem?". A prova de que o mapa fazia falta já estava no schema — a linguagem do provider vazou para dentro do `core` antes do primeiro deploy (P9 corrige no doc 02).

### 2-bis.1 O mapa (seis contextos + um kernel)

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
│ Focus/PlugNotas + │   └─────┬───────────────┘          │ ❗ ACL CONTRA   │
│ CONFORMIST c/     │         │ domain events            │ GESTORIZE       │
│ padrão XML SEFAZ  │         ▼ (published language)     │ (3º não-nosso)  │
└──────────────────┘   ┌─────────────────────┐          └─────────────────┘
                       │ ⭐ TRILHA DE BOA-FÉ │
                       │ (evento, cadeia,    │
                       │  âncora ACT, laudo) │   ┌──────────────────────┐
                       │ CORE DOMAIN —       │   │ COMERCIAL/BILLING    │
                       │ KERNEL TRANSACIONAL │   │ (metering, assinatura,│
                       │ com Apuração        │   │  white-label, RdV)   │
                       │ (whitelist §2-bis.3)│   │ downstream CONFORMIST│
                       └─────────────────────┘   │ da view canônica de  │
┌──────────────────┐                             │ medição — NUNCA lê   │
│ e-CAC (add-on)    │                            │ apontamento direto   │
│ CONFORMIST c/     │── upsert via evento ──▶    └──────────────────────┘
│ SERPRO (códigos   │   (gestao.alvara_certidao)
│ 00006 etc. FICAM  │
│ DENTRO do contexto)│
└──────────────────┘
PL = published language (contrato neutro de "documento fiscal recebido")
```

### 2-bis.2 As fronteiras, uma a uma (padrão DDD nomeado + regra executável)

| Fronteira | Padrão DDD | Regra executável |
|-----------|-----------|------------------|
| Ingestão → Provider (Focus/PlugNotas) | **Anticorruption Layer** | NSU, manifestação, ids, cursores vivem em `ingestao.*` (staging) e NUNCA em `core.*`. O adapter traduz para a published language: "documento fiscal recebido {chave, xml_hash, classe_insumo, origem_neutra}". *(P9, doc 02)* |
| Ingestão → SEFAZ/ADN (padrão XML público) | **Conformist** | Conformar com a linguagem do GOVERNO é correto — é a published language pública do domínio fiscal (chave de acesso, NCM, CST são ubíquos de verdade). A distinção: conforma-se com o padrão público, NUNCA com o dialeto privado do fornecedor |
| **Apuração → Trilha** | **Kernel transacional (Shared Kernel deliberado e WHITELISTED)** | Estado e prova na MESMA transação é O mecanismo do moat — não separar, nunca distribuir. A RPC que cruza estado→evento é **fronteira nomeada, não violação** (§2-bis.3). Custo aceito: os dois evoluem juntos; payload da trilha é contrato versionado |
| Apuração → Gestão | **Customer-Supplier** (Apuração upstream) | Gestão consome eventos (`tarefa origem='auditoria'`); Apuração não conhece Gestão. O ciclo `core→gestao` é quebrado movendo `departamento` para `gestao.usuario_departamento` *(P8, doc 02)* |
| Apuração → Comercial/Billing | **Customer-Supplier via published language** | Billing consome SÓ a view canônica de medição (M-10/P9) — promovida de "view" a CONTRATO versionado: billing sem SELECT em `apontamento_auditoria`. Resolve o vazamento reverso (Newman §2.2): cada estado novo do Heleno (`regularizado`, `superado`) NÃO pode mudar a métrica de cobrança do Anderson em silêncio |
| e-CAC → SERPRO | **Conformist** (dentro do contexto) | Códigos de serviço SERPRO (`00006`, `00002`…) são a linguagem DESTE contexto — corretos ali, proibidos fora. `ref.ecac_servico_map` traduz na borda *(P9)* |
| **Gestão → Gestorize (terceiro)** | **❗ Anticorruption Layer contra terceiro** | **O Gestorize é o MAIOR terceiro do projeto** (Newman §2.1) — codebase herdado, qualidade desconhecida (Spike 5 pendente). A arquitetura v1.0 lhe deu FK direta para o core; isso é ACL, não shared kernel. **FK `core→gestao` PROIBIDA; FK `gestao→core` permitida** (gestao é downstream). Sem isso, quando o Spike 5 falhar, a dívida do legado contamina a tabela de identidade do moat pelo canal `departamento_id` *(P8 ganha 2º motivo decisivo, doc 02)* |
| Identidade & Tenancy | **Shared Kernel** | `escritorio/usuario/cliente` são compartilhados por todos — mas kernel compartilhado só funciona PEQUENO e ESTÁVEL. `plano` (billing) sai de `escritorio` → `core.assinatura`; CRC/papel ficam (identidade profissional, M-1 acertou) |

### 2-bis.3 A whitelist do kernel transacional — por que a fitness function NÃO o proíbe

> **Esta subseção resolve a divergência fina Newman↔Fowler (§1.4 do Newman R2) e é o pré-requisito conceitual da FF-2.**

A regra mecânica "módulo só escreve nas próprias tabelas; cruzou de schema = violação" (Newman N-W1), levada ao pé da letra, **proibiria o kernel transacional Apuração+Trilha** — porque a RPC `core.aprovar_apontamento` escreve estado (`apontamento_auditoria`) E evento (`evento_boa_fe`) na mesma transação, "cruzando" da máquina de estados para o ledger. Esse cruzamento é o coração do moat (estado + prova atômicos), não uma violação.

Newman cedeu a Fowler: a fitness function de fronteira (FF-2) precisa do mapa de contextos para saber **onde ela NÃO se aplica**. Logo, a FF-2 carrega uma **whitelist explícita e comentada** do kernel Apuração+Trilha:

- A RPC `core.aprovar_apontamento` (e as demais RPCs `security definer` do kernel) é a ÚNICA fronteira autorizada a escrever estado+evento na mesma transação. Está nomeada na whitelist.
- Qualquer OUTRA escrita cross-tabela estado→evento (ex.: motor inserindo direto, edge function bypassando a RPC) é violação e FF-2 falha.
- **A fitness function IMPLEMENTA o mapa de contextos** — ela não o substitui. Um dev futuro que aplique a FF cega veria o kernel como "violação" e quebraria o moat para "respeitar a fronteira"; a whitelist nomeada impede isso.

- **(a) gatilho/onde:** doc 02 (DDL) + CI (FF-2); migration 001.
- **(b) custo:** 1 dia de doc (o diagrama é adotado as-is do Fowler §2.2 com a adição Gestorize=ACL do Newman).
- **(c) prova:** FF-1 (fronteira de import) + FF-2 (fronteira de schema via `pg_catalog`, com whitelist do kernel) — ver §3-bis.

### 2-bis.4 Dissenso resolvido — o pacote `@contador/dominio` foi REJEITADO como D0

> **Origem:** DISSENT §3 da síntese SOLID — o único dissenso estrutural real do conclave.

Uncle Bob propôs portar TODA a lógica de domínio (máquina de estados, materialidade, ato privativo, semântica da trilha) para um pacote TS puro, com os triggers/RPCs virando "backstop conferido por teste de equivalência". **Três experts atacaram independentemente e venceram:**

- **Newman:** duas cópias do invariante = **dual-write de lógica** — Bob caçou dual-write de *dados* na R1 e prescreveu dual-write de *comportamento*. A RPC já É a fronteira; falta proibir o bypass (P20), não escrever 2ª cópia.
- **Fowler:** dupla manutenção permanente num domínio que inventa estados o tempo todo. Remédio evolutivo: **a regra de transição vira DADO** (`ref.transicao_permitida`), não código duplicado — um lugar para a verdade, não três.
- **Beck:** "twice, and prove it's once" para 1 dev. Só o motor puro + o verificador CLI valem o D0.

**Resolução (o que o Uncle Bob cedeu — o pacote completo vira YAGNI com gatilho):** sobrevivem ao ataque e entram no lugar do pacote →
1. **A regra de transição como DADO** — `ref.transicao_permitida (de, para, exige_papel, exige_protocolo)` consultada por um trigger genérico e estável; testável por pgTAP enumerando a tabela. O trigger nunca mais muda; a regra fica versionável (Fowler §5.3). *(schema, doc 02)*
2. **O motor puro com contrato (P15)** — §3.7.
3. **O verificador da cadeia como CLI standalone (P16)** — §14.

- **Gatilho de re-adição do pacote completo:** ≥2 regras de negócio (além do motor) precisarem de teste unitário rápido que pgTAP não cobre; OU 2º dev entra.

---

## 3. ⭐ Trilha de Boa-fé — mecânica FECHADA (o moat)

Cinco propriedades, cada uma com mecanismo concreto. As três primeiras vinham do draft; as duas últimas são o que a rodada adversarial Fable acrescentou — e são as que transformam "registro interno com hash" em prova.

### 3.1 Proveniência imutável (ledger append-only hash-encadeado)

- `core.evento_boa_fe` append-only: imutabilidade tripla (REVOKE UPDATE/DELETE até para service_role + trigger bloqueante + hash-chain). Hash-chain **por tenant**; **o `seq`+cabeça vêm de fonte única `core.trilha_cabeca` (row-lock, single-writer) — NÃO mais de `MAX(SELECT)`+advisory lock** (P5, doc 02 — corrige o contador-distribuído-fingindo-ser-local que duplicaria `seq_tenant` no 1º failover). Mecânica completa no doc `02` §3.5.
- Cada apontamento grava: norma + NT + **fato gerador** + versão da base + camada da fonte + **critérios de desempate** do NCM→cClassTrib + **classe de insumo** + input/output + confiança + **versão do motor (FK `ref.motor_versao` — P1)**.
- Estado e prova na MESMA transação (RPCs `core.aprovar_apontamento` etc. — **materializadas pela RPC, nunca pelo motor**, P15/P6); job noturno de reconciliação (estado sem evento = alerta, promovido a fitness function FF-5).

### 3.2 [P14] Âncora temporal externa — carimbo ACT ICP-Brasil = Merkle-por-tenant

> **Origem:** B2 (Kleppmann K-14). **Gravidade: 🔴** — um furo de dados que só apareceu quando o "carimbo diário" (Anderson) cruzou com o "hash-chain por-tenant" (todos).

A verificação interna da cadeia é autorreferente. A presunção legal vem da MP 2.200-2/2001 (art. 10, §1º): **carimbo do tempo de ACT credenciada.** A v1.0 fechou "fecho diário carimbado por ACT" — mas o conclave SOLID achou que **o carimbo diário e o hash-chain por-tenant se mordem**:

- **1 carimbo/dia para N tenants** quebra a COGS — a conta de custo de ACT errava por um fator ~12× ao tratar o carimbo como único; e
- **1 carimbo de Merkle de TODOS os tenants** quebra o isolamento — a prova de integridade de um tenant revelaria a existência (e a contagem de eventos) dos irmãos. Vazamento cross-tenant pela própria peça que deveria provar integridade.

**Decisão (ratificada pelo founder): carimbo ACT = Merkle-por-tenant.**

- O fecho diário computa, **por tenant**, a raiz de Merkle dos eventos do dia daquele tenant. As raízes diárias de todos os tenants formam uma **floresta**; o que vai ao ACT é **um único carimbo da floresta de raízes** (eficiência de custo — 1 chamada de ACT/dia, não N).
- Mas a **prova do tenant X é o caminho de Merkle da raiz de X até a raiz da floresta** — e esse caminho **nunca inclui os dados (nem a contagem) dos irmãos**, apenas hashes-irmãos opacos. Isolamento preservado: o tenant X prova sua própria integridade sem expor a existência do tenant Y.
- **Custo recalculado como variável por-tenant** (não fixo) — ver §9: o carimbo da floresta é 1 chamada/dia (custo fixo baixo), mas a COGS de ACT por tenant é a fração de Merkle atribuível, modelada como custo variável que entra na franquia. Isso conserta o erro ~12× da v1.0 que tratava ACT como custo único.
- **C0:** carimbo ACT manual avulso sobre o `hash_laudo` de cada laudo (centavos). **F1:** job server-side de fecho DIÁRIO Merkle-por-tenant. **NUNCA por evento** (milhares/mês — mataria margem e acoplaria o moat a fornecedor no caminho crítico).
- Novo `tipo_evento='ancora_temporal'`; o recibo do carimbo (TST) fica no storage WORM e é referenciado no evento.

- **(a) gatilho/onde:** §3.2 + §9; F1 (job de fecho). C0 sem job (carimbo por laudo).
- **(b) custo:** decisão + doc + a aritmética de Merkle no job de fecho (~horas além do que a v1.0 já previa).
- **(c) prova:** teste de isolamento do caminho de prova (a prova de Merkle do tenant X não contém nenhum byte identificável dos irmãos; FF-4 verifica a raiz da floresta contra o TST).

> **Dissenso resolvido (v1.0, mantido):** Anderson propôs fecho mensal; Heleno exigiu por laudo + no mínimo diário em F1; Roberto endossou diário. **Decisão: diário em F1** — a disputa da denúncia espontânea (CTN art. 138) é de DIAS, e fecho mensal abre janela de 30 dias em que a cadeia é fabricável. O SOLID **não relitiga** o "diário"; apenas corrige a FORMA do carimbo (Merkle-por-tenant) para que o diário não quebre nem a COGS nem o isolamento.

### 3.3 [P3] Re-verificação ≠ re-execução — a correção mais importante do conclave

> **Origem:** C2 — **5× consenso** (UB·Kleppmann·Newman·Beck·Fowler). Newman: *"o achado mais importante do conclave."* **Tratado com cuidado: este patch corrige uma frase FALSA que, deixada no doc, viraria a frase que a perícia de 2031 usa contra o produto.**

**A frase da v1.0 §3.3 estava errada e foi REMOVIDA:**

> ~~"Reprodutibilidade: qualquer laudo re-executável contra `base_versao_id` exato."~~ ❌ (v1.0 — FALSA para a camada RAG)

A frase prometia **re-execução** — rodar o sistema de novo e obter o mesmo resultado. Isso é verdade para a **camada determinística** (regras), e FALSO para a **camada RAG**: um LLM de 2027 está morto/alterado em 2031 (modelo descontinuado, pesos mudados, prompt/embedding versionados de forma instável). Prometer "replay do LLM" é fabricar uma expectativa que a perícia desmonta — e a defensabilidade desmorona junto.

**A correção (a verdade desconfortável que os 5 experts convergiram):**

- **Camada determinística (regras):** **re-execução** É legítima. Dado `base_versao_id` + `motor_versao` (FK P1) + a regra como dado (`ref.transicao_permitida`, `ref.cclasstrib_regra`), o resultado é reproduzível bit-a-bit. FF-7 (re-verificação de laudo) cobre esta camada com pin de `base_versao_id` + `motor_versao` + `golden_set_versao_id`.
- **Camada RAG (sugestão por LLM):** NÃO é re-execução. A defensabilidade é **re-verificação de evidência registrada + decisão humana registrada**, não determinismo de máquina. O que se reconstitui em 2031 é:
  1. **a evidência que foi apresentada** ao humano na data (input/output do RAG, snapshot do contexto recuperado, modelo+prompt_hash+embedding+params gravados no payload — P2, doc 02);
  2. **a decisão humana qualificada** sobre aquela evidência (contador-CRC, registrada na trilha com assinatura);
  3. **a re-verificação** de que a evidência registrada é íntegra (hash-chain + ACT) e de que a decisão foi tomada por quem podia (ato privativo).
  Defensabilidade = **decisão humana registrada sobre evidência íntegra**, não "a máquina dá a mesma resposta de novo".

**Consequência arquitetural:** o moat NÃO promete que o RAG de 2027 roda igual em 2031. Promete que a *evidência e a decisão* daquela data são íntegras, atribuíveis e re-verificáveis. O verificador CLI (P16) re-verifica integridade; ele NÃO re-executa LLM.

- **(a) gatilho/onde:** §3.3 (prosa) + §14 (o verificador); validar com **Heleno no Spike 6** ("isto te defende num auto de infração quando a defesa não é 'a máquina repete', mas 'o contador decidiu sobre evidência íntegra'?").
- **(b) custo:** 0 (correção de prosa) — mas é a correção de maior alavancagem do conclave.
- **(c) prova:** sign-off do Heleno no Spike 6; e FF-7 que prova re-execução SÓ da camada determinística (e NÃO tenta — nem promete — re-executar RAG).

### 3.3-mantido Bitemporalidade + vigência pelo FATO GERADOR + hierarquia de fontes

- **Dois eixos temporais:** `vigencia` (quando a regra valia no mundo) e `conhecida_em`/`importada_em` (quando NÓS soubemos). Boa-fé = estado de conhecimento na data da decisão. **A bitemporalidade desce para a DECISÃO** (P22, doc 02): o evento `superado` carrega AMBOS os eixos, senão perde-se "o que sabíamos quando decidimos" quando uma NT reabre apontamento carimbado.
- **Vigência pela data do fato gerador** (`vigencia @> nota.emitida_em`), não pela competência (Heleno C4). O apontamento grava `fato_gerador_em` + `criterios_desempate`.
- **Hierarquia de fontes (Heleno C5):** `ref.base_versao.camada in ('oficial','licenciada','curadoria')`. A tabela oficial do Portal Nacional da NF-e é a referência primária — fundamento normativo não se terceiriza. Apontamento fundado em camada não-oficial DEVE citar a linha oficial no `fundamento` (constraint testável, FF-9). Job de reconciliação oficial×licenciada a cada importação; regra divergente bloqueada até curadoria.

### 3.4 Assinatura qualificada — papel `contador`, CRC, PAdES em lote

- `core.usuario` ganha `cpf`, `crc`, `crc_uf`, `crc_situacao`; papel `contador` no CHECK. A transição `pendente→aprovado/rejeitado` que sustenta laudo exige `papel='contador'` com CRC ativo (na RPC e na RLS). Analista tria e prepara; não pratica o ato. *(DL 9.295/46; CC art. 1.177)*
- O PDF do laudo sai **assinado PAdES com o e-CPF do contador** — certificado que ele JÁ tem. **Formato operacional (Roberto):** assinatura **em lote** no fechamento da competência, nunca cerimônia por laudo.
- `laudo.emitido_por` só aceita usuário com CRC; o laudo sai em nome do contador, nunca da plataforma.

### 3.5 Ciclo fechado indício→decisão→ação→protocolo, COM limiar de materialidade

O achado mais valioso do conclave Fable (Heleno 1.2): **trilha que prova ciência sem cobrar conduta é prova CONTRA o cliente** ("aprovado inerte"). O ciclo fecha:

- **Máquina de estados estendida:** `pendente → aprovado|rejeitado → regularizado` (+ `superado`, K-7), com `acao_tipo` e `acao_protocolo` obrigatório em retificado/regularizado. **As transições são dirigidas por DADO** (`ref.transicao_permitida`, P-dissenso §2-bis.4) — trigger genérico estável, regra versionável; cada novo estado da transição 2026-2033 é dado, não migration em função de gatilho.
- **SLA e escalonamento:** `decidir_ate`; evento `apontamento_escalado`; view "passivo de pendências e aprovados inertes"; aprovado sem ação após N dias = alerta escalonado.
- **Limiar de materialidade configurável (R$ × confiança):** acima = ciclo completo individual com SLA; abaixo = **decisão em lote com regra documentada NA trilha** (evento `decisao_lote`). Decisão em lote documentada também é conduta.
- **Telemetria de teatro:** lote aprovado < N segundos/item dispara alerta de "aprovação cega".
- **Rejeição motivada:** dropdown de 6-8 motivos curados juridicamente + texto opcional (tabulável > dissertação).
- **Enquadramento comercial:** a UI chama isso de **"fila do dia"** — hábito diário, anti-churn.
- **Captura seletiva como contenção do ciclo:** só entra ciência que o escritório DECIDIU monitorar; cobertura parcial declarada por CNPJ.

### 3.5-bis [P19] Camada de RPCs como API publicada versionada `core.api_v1`

> **Origem:** B4 (Uncle Bob R2 — Stable Abstractions Principle invertido). **Gravidade: 🔴.**

O conclave SOLID achou que **o contrato da camada de RPCs nunca foi declarado**. As RPCs `security definer` são, simultaneamente, o componente mais **estável** E mais **concreto** do sistema (a "zona da dor" do SAP): mudar a assinatura de `core.aprovar_apontamento` quebra todos os chamadores **sem aviso de compilador** — não há tipo estático que pegue a quebra. Para um componente que é a única porta de escrita do moat, isso é uma bomba-relógio.

**Decisão: a camada de RPCs do core é uma API publicada e versionada — `core.api_v1`.**

- Toda escrita no core passa por RPCs `security definer` agrupadas sob o namespace lógico `core.api_v1` (escrita direta via PostgREST proibida — P20, doc 02: sem policy de UPDATE direto; escrita só via RPC).
- **Additive-only:** evolução só adiciona (nova RPC, novo parâmetro opcional, nova `api_v2` coexistindo). Mudança incompatível de assinatura de uma RPC publicada = **bump de versão**, nunca mutação in-place.
- **Assinaturas tipadas como gate de CI:** um teste de contrato congela a assinatura de cada RPC `core.api_v1` (nome, parâmetros, tipos, retorno). Mudar a assinatura sem bump de versão **falha o CI** — o aviso de compilador que o SAP-invertido tirou, recolocado como fitness function.
- O motor (P15) é um consumidor desta API, NUNCA um escritor direto.

- **(a) gatilho/onde:** doc 02 §3.5 (DDL das RPCs) + CI; F1 (pré-requisito: P20).
- **(b) custo:** ~dias (definir o namespace + escrever o teste de contrato).
- **(c) prova:** teste de contrato — mudança de assinatura de RPC publicada sem bump de versão falha o CI.

### 3.6 Duas classes de qualidade de insumo

XML estruturado ≠ PDF extraído por OCR. Pipeline único, mas: `apontamento.qualidade_insumo in ('xml','documento_extraido')` gravado na trilha; classe `documento_extraido` carrega confiança por campo e materialidade limitada; o laudo declara qual classe sustentou cada apontamento.

### 3.7 [P15] Contrato escrito do motor — fila in / RPC out / INSERT direto PROIBIDO

> **Origem:** NW13·UB9·A8. Substitui (com P16 e a regra-como-dado) o pacote de domínio rejeitado em §2-bis.4.

O motor de auditoria é a peça que a v1.0 (A8) planeja extrair para Python "se o eval exigir". Para que essa extração seja **troca de runtime, não cirurgia**, o motor precisa de um contrato escrito ao nível de arquitetura:

- **Entrada (in): por FILA.** O motor consome trabalho de `pgmq` (F2) / da fila lógica (F1): `{item_ids, base_versao_id, motor_versao_id}`. Nunca lê estado do core por dentro.
- **Saída (out): por RPC.** O motor devolve **candidatos com proveniência** (apontamentos sugeridos + confiança + input/output + criterios_desempate). Quem **materializa** estado+evento é a RPC `core.api_v1` (`core.registrar_analise(...)`), na mesma transação (casa a `UNIQUE analise_execucao` do Kleppmann K-7 com a fronteira de extração do Newman N-13).
- **INSERT direto PROIBIDO por grant.** A role do motor NÃO tem permissão de INSERT/UPDATE em `core.*`. A fronteira limpa via fila/RPC deixa de ser aspiração e vira grant verificável.
- **Consequência:** o motor é extraível para Python por troca de runtime (o consumidor da fila muda; o contrato não). E o golden-set roda contra o motor isolado (Q8) de graça.

- **(a) gatilho/onde:** §3 + §3.5; doc 02 (grants); F1.
- **(b) custo:** 1 página de contrato + grants.
- **(c) prova:** teste de grant — a role do motor não consegue fazer INSERT em `core.*` (falha esperada); FF-2 confirma que apenas as RPCs whitelisted escrevem estado+evento.

---

## 3-bis. [P21] Fitness Functions — arquitetura VERIFICADA, não desenhada

> **Origem:** Fowler (F-4, PATCH F2-FOWLER). **Esta seção é o que separa "fronteira desenhada" de "fronteira que existe".** Checklist é intenção; gate é arquitetura. Fronteira não-enforçada num time de 1 dev sob pressão é fronteira que não existe (Newman).

O valor declarado deste sistema é **defensabilidade** — um feixe de características arquiteturais contínuas (integridade da prova, isolamento de tenant, reprodutibilidade, neutralidade de fornecedor, fronteiras intactas). Cada uma precisa de uma função de aptidão executável, senão erode silenciosamente a cada commit. O conclave Fable tinha UMA fitness function (golden-set, acurácia do motor); o SOLID promove as verificações espalhadas em jobs/checklists a um **catálogo com gate**, em **duas ondas**.

### 3-bis.1 Onda D0 — BLOQUEANTE da migration 001 (~dias de setup, centavos de CI)

Estas quatro protegem o moat *durante* os cortes de escopo do Beck. Não se back-fillam: a fronteira que você não enforçou no dia 0 já foi violada quando você tenta adicioná-la no mês 6 (o ciclo `core→gestao` na migration 001 é a prova viva).

| # | Fitness function | O que protege | Ferramenta | Gate |
|---|------------------|---------------|------------|------|
| **FF-1** | **Fronteira de import (app)** — proibir import de `core` interno por `gestao`; adapter de provider só importável por `ingestao`; zero ciclos | As fronteiras do §2-bis viram código, não diagrama | dependency-cruiser (`forbidden` + `no-circular`) | CI hard-fail / todo PR |
| **FF-2** | **Fronteira de schema (SQL)** — nenhuma FK `core.*`→`gestao/ingestao/billing/ecac` **fora da whitelist**; nenhuma tabela tenant-scoped sem `escritorio_id`. **Carrega a whitelist nomeada do kernel transacional (§2-bis.3)** | ADP no nível do banco; **implementa o mapa de contextos** | script sobre `pg_catalog`/`pg_constraint` no banco de migration de CI | CI hard-fail / toda migration |
| **FF-3** | **Isolamento cross-tenant GENERATIVO** — ENUMERA as tabelas tenant-scoped e falha se alguma não tem RLS OU teste de deny; 2 tenants sintéticos com assert de vazamento zero; teste de papel (analista não aprova; não-admin não vê preço) | Q5; white-label/opacidade de preço; pega "tabela futura sem policy" para sempre | pgTAP + basejump helpers no `supabase test db` | CI hard-fail / toda migration; probe sintético semanal em prod = sev1 |
| **FF-6** | **Imutabilidade sobrevive a migrations** — tenta `UPDATE/DELETE` em `evento_boa_fe`/`audit_log` como `service_role` e EXIGE exceção | Uma migration futura que recrie a tabela e esqueça o REVOKE destrói o moat em silêncio | pgTAP | CI hard-fail / toda migration |

### 3-bis.2 Onda por-fase — gatilho objetivo cada (NÃO entram no D0)

| # | Fitness function | Gatilho de ativação |
|---|------------------|---------------------|
| **FF-4** | **Integridade hash-chain + âncora** — recomputa cadeia por tenant, `seq` (de `trilha_cabeca`) sem gaps, raiz Merkle-por-tenant confere com o TST do fecho ACT (P14). É o par de produção do verificador CLI (P16) | F1 — quando o fecho diário existir. Incremental diário + full semanal; sev1 + bloqueio de emissão de laudo do tenant afetado |
| **FF-7** | **Re-verificação de laudo** — re-executa N laudos congelados **SÓ na camada determinística** (`base_versao_id` + `motor_versao` + `golden_set_versao_id` pinados) e exige apontamentos idênticos. **NÃO re-executa RAG** (P3) — re-verifica evidência+decisão | F1 — quando o motor existir; a cada release do motor; bloqueia release |
| **FF-8** | **Contrato do provider** — payload do webhook validado contra schema versionado; replay de fixtures exige que o core receba SÓ published language (nenhum dialeto NSU atravessa o ACL) | F2 — quando o adapter existir; nightly contra sandbox; bloqueia deploy de `ingestao` |
| **FF-9** | **Drift da base** — idade da base vs última NT; taxa de divergência oficial×licenciada; regra de camada licenciada cita linha oficial (constraint M-4 como teste) | F1 — a cada importação + semanal; regra divergente bloqueada |
| **FF-11** | **SLA de pico (D+1, 95% antes do 1º dia útil)** — simulação de carga dia-5: 200 CNPJs × alto SKU × competência cheia | F2 — antes do go-live + mensal; review de capacidade |
| **FF-12** | **Guardrail de COGS executável** — teto docs/mês/tenant + franquia testados como código (tenant sintético estoura o teto → captura suspensa + alerta) | F2 — todo PR que toca ingestão/billing; CI hard-fail |

> FF-5 (completude da trilha: estado mudou sem evento) e FF-10 (banlist linguística) já estão desenhadas na v1.0 como job/teste — promovidas a gate formal (FF-5 noturno sev1; FF-10 CI hard-fail em templates+locales). Custo: FF-1/2/3/6/10/12 = dias e centavos; FF-4/5 = 80% já no doc 02 (falta o gate); FF-7/FF-8 = único esforço real (1-2 semanas somadas) — e são as que protegem as duas perguntas existenciais (Q1 reprodutibilidade, Q2 troca de provider).

---

## 4. Mapa de cobertura — Gestorize × Core × Concorrentes

> **Nota v1.1:** todo o §4 da v1.0 segue válido (23 features ✓ + 21 lacunas: core 8 / add-on 4 / aparentes 4 / fora 5). **Mudança de moldura conceitual (§2-bis):** o Gestorize NÃO é "código nosso a estender" — é o **MAIOR terceiro do projeto**, território alugado, atrás de um **ACL** (`gestao` = contexto ACL contra terceiro). A condição de tudo segue sendo o **Spike 5** (Gestorize deployável); o que mudou é que, deployável ou não, ele entra como **origem plugável atrás de fronteira nomeada**, não como fundação com FK direta no coração do core. *(O conteúdo das tabelas 4.1/4.2 da v1.0 permanece inalterado — ver doc 17 §4.)*

---

## 5. Modelo de dados — resumo executivo + correções obrigatórias

> **A referência canônica de DDL é o doc `02-data-engineer-schema.md`.** A v1.0 listou as correções M-1…M-15 do conclave Fable (todas mantidas). O conclave SOLID adiciona os patches de schema **P1…P23**, que vivem no **schema v1.1 (doc 02)** — NÃO duplicados aqui. Mapeamento dos patches SOLID de schema (referência rápida; DDL no doc 02):

| Patch | Resumo (DDL no doc 02) | Toca prosa nesta v1.1? |
|-------|------------------------|------------------------|
| P1 | `ref.motor_versao` entidade versionada + discriminador `tipo_inferencia` + FK | §2.1, §3.1 (citado) |
| P2 | payload de `analise_executada` nasce com proveniência computacional completa | §3.3 (citado) |
| P4 | `hash_ver` desde o gênese + canonicalização com delimitadores | §2.1, §14 (citado) |
| P5 | `core.trilha_cabeca` (seq+cabeça single-writer) substitui `MAX(SELECT)` | §3.1 (citado) |
| P6/P7 | idempotência (UNIQUE materializado pela RPC; unicidade parcial de evento) | §3.1, §3.7 (citado) |
| **P8** | **matar ciclo `core→gestao`; FK `core→gestao` proibida = ACL Gestorize** | §2-bis (incorporado) |
| **P9** | **dialeto fora do core (`ingestao`); enum `origem` neutro; `ref.ecac_servico_map`; view de medição = contrato versionado** | §2-bis (incorporado) |
| P10–P13 | partição `nota_item`; `base_adocao`; `competencia` por função; WORM | — (schema) |
| **P18** | governança do `app.*` (único lugar que conhece o JWT) | §10 (citado) |
| **P20** | matar porta lateral PostgREST (escrita só via RPC) | §3.5-bis (pré-req de P19) |
| **P22** | bitemporalidade na DECISÃO (evento `superado` com 2 eixos) | §3.3-mantido (citado) |
| P23 | golden-set versionado/snapshot (FK do `motor_versao`) | §3-bis FF-7 (citado) |

As correções **M-1…M-15** do conclave Fable seguem obrigatórias antes da migration 001 ir a produção (tabela completa no doc 17 §5 — inalterada).

---

## 6. [Regra de processo] Nenhum patch sem gatilho + custo + teste

> **Origem:** B7 (Fowler) — o blind spot mais grave do conclave: a revisão não tinha fitness function para si mesma. 56 patches entrariam sem gate de rejeição, reproduzindo no nível da revisão a doença que Beck diagnosticou nas features.

**Regra adotada permanentemente:**

> **Nenhum patch entra na v1.1 (ou em qualquer versão futura) sem (a) um gatilho objetivo de quando aplicar, (b) um custo estimado, e (c) um teste/fitness function que prova que foi aplicado. Patch sem (c) vira "decisão aberta com dono", não item de arquitetura.**

Isto transforma a síntese de lista de boas intenções em conjunto verificável — e impede a próxima rodada de virar comitê. Toda mudança desta v1.1 (changelog do topo + cada §) respeita o contrato (a)/(b)/(c). Quem não tem fitness function vira comitê; isto vale para o sistema E para o grupo que o desenha.

---

## 6.1 Fluxos principais

> *(As §6.1–§6.4 da v1.0 — Concierge dia-0, F1 motor+trilha+saídas, F2 captura seletiva, A add-on e-CAC — seguem válidas inalteradas; ver doc 17 §6. Ajuste de prosa v1.1: no fluxo F1, o motor consome fila e devolve candidatos por RPC `core.api_v1` (P15/P19), nunca faz INSERT direto; o fecho diário é Merkle-por-tenant (P14); a geração-0 do C0 nasce manual-mas-conforme (P17).)*

### 6.1.1 `[C0]` Concierge dia-0 (atualizado P17)

```
Contador exporta XMLs ──▶ DEMO KIT: tela de upload (Documentize) ──▶ lista de divergências
                          com R$ + confiança + "onde NÃO sei" (análise MANUAL nos bastidores,
                          copy honesta: "análise assistida pelo nosso time nesta fase")
  ──▶ DOSSIÊ DE EVIDÊNCIAS (insumo interno do escritório)
  ──▶ trilha à mão no schema final, MANUAL-MAS-CONFORME (P17): payload_versao desde o 1º
      evento, tipo_inferencia='humano_concierge', ator=contador-CRC nos atos privativos, hash desde o gênese
  ──▶ CONTADOR DO ESCRITÓRIO revisa, decide e ASSINA o laudo (nome + CRC + PAdES e-CPF)
  ──▶ carimbo ACT manual avulso sobre o hash_laudo
  ──▶ laudo white-label no TEMPLATE do Relatório de Valor + painel semáforo da carteira
  ──▶ conta de padaria na demo (nunca "evita multa")
  ──▶ cobrança real → critério ≥3/5 escritórios pagam (doc 14)
```

---

## 7. Ponte ERP + EFD — as duas fronteiras onde o produto vive ou morre

> *(Inalterada vs v1.0 — ver doc 17 §7. Reforço conceitual v1.1: a EFD, quando entrar (F1), atravessa o ACL de Ingestão — o layout do SPED é dialeto da Receita e NÃO pode vazar para `core.apuracao_declarada` cru, exatamente como o NSU do provider não vaza para `core.nota` (Newman §1.2). O ponto de entrada já está definido hoje justamente porque a peça será construída amanhã sob pressão.)*

---

## 8. O produto que vende, implanta, prova valor e fatura (camada Anderson)

> *(Inalterada vs v1.0 — ver doc 17 §8. Reforço v1.1: o §8.6 Metering/Billing consome a view canônica de medição como **contrato versionado** (`nota_auditada_para_billing`), estável mesmo quando a máquina de estados do Heleno cresce — Newman §2.2; cada estado novo (`regularizado`, `superado`) NÃO muda a métrica de cobrança em silêncio.)*

---

## 9. Unit economics e guardrails de COGS

> **Atualização v1.1 (P14):** a estrutura de pricing da v1.0 (tiers Entrada R$249-299 / Típico R$849-999 / Add-on e-CAC) segue válida — ver doc 17 §9. **Correção do conclave SOLID:** o custo de ACT **não é fixo** como a v1.0 implicitamente tratava. Com Merkle-por-tenant (P14), há **1 carimbo de ACT/dia da floresta de raízes** (custo fixo baixo), mas a **COGS de ACT por tenant é a fração de Merkle atribuível, modelada como custo VARIÁVEL por-tenant** que entra na franquia. Isso conserta o erro ~12× que apareceria ao tratar "1 carimbo/dia" como custo único quando há N tenants.

**Guardrails (mantidos da v1.0):** franquia ≥2-3× custo variável; `captura_ativa` default OFF + teto docs/mês/tenant (agora com **FF-12** como prova executável, não comentário de adapter); excedente repassado; carimbo ACT nunca por evento; cotações de ACT/Infosimples seguem a cotar (decisão aberta N-2).

> **A descoberta do conclave Fable permanece:** captura indiscriminada é o assassino de margem — não o rigor jurídico. O rigor do Heleno custa R$15-60/mês; o provider full-capture custava R$6,35/CNPJ contra corredor flat. O SOLID adiciona: **o custo de ACT é variável por-tenant** (P14), e a margem é uma fitness function (FF-12), não uma promessa.

---

## 10. Segurança & LGPD by design

> *(Inalterada vs v1.0 — ver doc 17 §10. Reforço v1.1: **governança do `app.*` (P18)** — `app.current_papel()`/`app.current_escritorio_id()` são o **único lugar que conhece o formato do JWT do Supabase** (Single Choice Principle); são chamadas por TODAS as RLS do core, então o moat depende delas. Teste: só essas funções leem o JWT. E **FF-3 generativo** enumera as tabelas tenant-scoped — pega a "tabela futura sem policy" para sempre, fechando o furo (a) do Q5.)*

---

## 11. Observabilidade

> *(Inalterada vs v1.0 — ver doc 17 §11. Adição v1.1: a camada de observabilidade ganha o **catálogo de fitness functions (§3-bis)** como instrumentação de primeira classe — FF-4 (integridade hash-chain + raiz Merkle vs TST), FF-5 (completude da trilha), FF-3 (probe de isolamento semanal em prod = sev1). Checklist virou gate; gate virou sinal.)*

---

## 12. Decisões — fechadas vs abertas

### Fechadas pelo conclave Fable (mantidas — A2 pgmq, A4 pgvector, A5 ACT+PAdES revertida, A6 hierarquia, A8 motor Node→Python, materialidade, WhatsApp). Ver doc 17 §12.

### Fechadas pelo conclave SOLID (novas — ratificadas pelo founder 15/Jun)

| # | Decisão | Resolução |
|---|---------|-----------|
| S-1 | Carimbo ACT diário × hash-chain por-tenant | **Merkle-por-tenant** (P14): 1 carimbo da floresta; prova do tenant X nunca inclui irmãos; COGS de ACT = variável por-tenant |
| S-2 | Pacote `@contador/dominio` TS completo como D0 | **REJEITADO** — vira YAGNI com gatilho (≥2 regras + teste fora do pgTAP, ou 2º dev). No lugar: regra de transição como DADO + motor puro (P15) + verificador CLI (P16) |
| S-3 | Re-execução do laudo (frase falsa da v1.0 §3.3) | **Re-verificação ≠ re-execução** (P3): re-execução só para a camada determinística; RAG = re-verificação de evidência+decisão humana. Validar Heleno no Spike 6 |
| S-4 | Fronteiras do sistema | **Mapa de bounded contexts (§2-bis)** com padrões DDD nomeados; `gestao`=ACL contra Gestorize; kernel Apuração+Trilha=Shared Kernel whitelisted; fitness functions implementam o mapa |
| S-5 | Contrato da camada de RPCs | **`core.api_v1`** (P19): API publicada, additive-only, assinaturas tipadas como gate de CI |
| S-6 | Verificação de fronteiras/moat | **Catálogo de fitness functions (§3-bis)**: Onda D0 bloqueante (FF-1/2/3/6) + Onda por-fase |
| S-7 | Processo de revisão | **Regra (a)+(b)+(c)** (§6): nenhum patch sem gatilho + custo + teste |

### Abertas (com dono e gatilho) — herdadas da v1.0 + novas do SOLID

> A3 (reuso Gestorize, Spike 5), A7 (provider, Spike 3), N-1 (formato decisão em lote, Heleno Spike 6), N-2 (cotação ACT — **agora ainda mais relevante com COGS variável de Merkle, P14**), N-3 (matriz de retenção, @legal-chief), N-4 (DANFSe), N-5 (layouts ERP, C0), N-6 (elasticidade R$849-999). Ver doc 17 §12.

| # (novo) | Decisão aberta do SOLID | Dono | Gatilho |
|----------|--------------------------|------|---------|
| **S-N1** | **Re-verificação ≠ re-execução defende juridicamente?** A defesa muda de "a máquina repete" para "o contador decidiu sobre evidência íntegra" — isto sustenta num auto de infração? | **Heleno** | **Spike 6** (validação do P3) |
| S-N2 | Scorecard objetivo do Spike 5 (G0/G1/G2 + decisão mecânica + timebox 5 dias — Fowler F-1) anexado ao §14? | @architect/@po | antes do Spike 5 |
| S-N3 | Protocolo de restore-vs-cadeia (evento `restauracao_sistema` + re-âncora + qual verificador reconcilia geração mista) — Fowler §4.3 / Kleppmann K-3 | @data-engineer | antes da F1 (é runbook, YAGNI com gatilho do 1º restore) |

---

## 13. Riscos técnicos & mitigação

> *(Tabela da v1.0 mantida — ver doc 17 §13. Adições v1.1:)*

| Risco (novo, SOLID) | Mitigação |
|---------------------|-----------|
| Carimbo ACT quebra COGS ou isolamento | Merkle-por-tenant (P14); FF de isolamento do caminho de prova; COGS variável por-tenant (§9) |
| Frase "re-executável" usada pela perícia contra o produto | P3: re-verificação ≠ re-execução; Spike 6 com Heleno; FF-7 re-executa SÓ determinístico |
| Geração-0 do C0 nasce frouxa e é inexpurgável | P17: manual-mas-conforme (payload_versao + tipo_inferencia + ator-CRC desde o 1º evento) |
| RPC `security definer` muda assinatura sem aviso | P19: `core.api_v1` additive-only + teste de contrato como gate de CI |
| Fronteira desenhada mas não enforçada (1 dev sob pressão) | §3-bis: FF-1/FF-2/FF-3/FF-6 como gates D0 da migration 001 |
| Gestorize (3º) contamina o core via FK | P8: `gestao`=ACL; FK `core→gestao` proibida (FF-2 com whitelist do kernel) |
| Motor faz INSERT direto → extração vira cirurgia | P15: fila in / RPC out / INSERT proibido por grant; teste de grant |

---

## 14. Spikes (revisados — ordem importa)

> *(Os 7 spikes da v1.0 seguem válidos — ver doc 17 §14. O conclave SOLID adiciona um artefato dia-0 e reforça o Spike 6.)*

### 14.1 [P16] Verificador da cadeia como CLI standalone — dia 0

> **Origem:** UB7·K4·F4. **Não é spike — é artefato de produção que nasce no dia 0** (fora do Supabase, executável independente).

O moat prova a própria integridade. Mas a verificação interna é autorreferente; a prova pericial precisa de um **verificador independente, fora do banco, que um perito (ou um juiz) possa rodar em 2031 sem acesso ao nosso ambiente.** Especificação:

- **CLI standalone** (binário/script sem dependência do Supabase) que recebe um dump da cadeia de um tenant + os TSTs do ACT e **recomputa a cadeia inteira**, verificando hash-encadeamento, `seq` sem gaps (de `trilha_cabeca`), e a raiz Merkle-por-tenant contra o carimbo ACT (P14).
- **Spec executável do hash:** o CLI É a especificação canônica da fórmula de hash — embute os **golden hashes** (vetores de teste conhecidos) e roda contra a cadeia de teste. A fórmula PODE evoluir (`hash_ver` v1, v2…); o que é eterno NÃO é a fórmula, é a **capacidade de verificar qualquer geração** — o CLI carrega `verificar_evento_vN()` para cada versão e nasce já lidando com **cadeias mistas** (humano_concierge + regra + RAG; e gerações de fórmula misturadas após um restore — S-N3).
- **Artefato pericial 2031:** é a peça que se entrega à perícia. Re-verifica integridade; **NÃO re-executa LLM** (P3) — coerente com re-verificação ≠ re-execução.
- **Par de produção:** a FF-4 (§3-bis) é o mesmo verificador rodando contínuo no CI/job; o CLI é a versão entregável/auditável.

- **(a) gatilho/onde:** §14; dia 0 (antes do 1º evento real, junto com o contrato de payload).
- **(b) custo:** ~dias.
- **(c) prova:** é a própria prova — roda contra a cadeia de teste e contra os golden hashes; FF-4 o exercita continuamente.

### 14.2 Spike 6 reforçado (P3)

O Spike 6 (Trilha + Prova com o tributarista) ganha a pergunta central do P3: **"a defesa não é 'a máquina repete', mas 'o contador decidiu sobre evidência íntegra e re-verificável' — isto te defende num auto de infração?"** É o sign-off (c) do P3 e a decisão aberta S-N1.

---

## 15. TABELA DE RASTREABILIDADE

> As **28 condições do conclave Fable** seguem rastreadas no doc 17 §15 (26 incorporadas · 2 adaptadas · 0 rejeitadas — inalterado). Abaixo, a rastreabilidade dos **patches do conclave SOLID** aplicados nesta v1.1.

### Patches de arquitetura/prosa (aplicados NESTE doc)

| Patch | Condição | Seção desta v1.1 | Status |
|-------|----------|------------------|--------|
| P3 | Re-verificação ≠ re-execução (corrige frase falsa) | §3.3, §14.2, S-3, S-N1 | ✅ (validação Heleno Spike 6 pendente) |
| P14 | Carimbo ACT = Merkle-por-tenant + COGS variável | §3.2, §9, §13, S-1 | ✅ |
| P15 | Contrato do motor (fila in / RPC out / INSERT proibido) | §3.7, §3.1, §13, S-2 | ✅ |
| P16 | Verificador CLI standalone dia 0 | §14.1, §3-bis FF-4, S-2 | ✅ |
| P17 | Geração-0 do C0 manual-mas-conforme | §2.1, §6.1.1, §13, S-N1 | ✅ |
| P19 | `core.api_v1` versionada | §3.5-bis, §13, S-5 | ✅ (pré-req P20 no doc 02) |
| P21+§3-bis | Catálogo de fitness functions | §3-bis, §11, §13, S-6 | ✅ |
| Mapa de contextos | Bounded contexts (ACL/Conformist/Shared Kernel) | §2-bis, S-4 | ✅ |
| Dissenso resolvido | `@contador/dominio` rejeitado → regra-dado + P15 + P16 | §2-bis.4, S-2 | ✅ |
| Regra de processo | (a)+(b)+(c) por patch | §6, S-7 | ✅ |

### Patches de schema (aplicados no doc 02 — schema v1.1; aqui só referenciados)

P1·P2·P4·P5·P6·P7·P8·P9·P10·P11·P12·P13·P18·P20·P22·P23 → ver schema v1.1 (doc 02). Os que tocam prosa de arquitetura estão citados nas seções correspondentes (tabela §5).

---

## 16. Próximos passos

1. **@data-engineer aplica P1…P23 no doc 02** → schema v1.1 (DDL canônica; esta v1.1 só referencia).
2. **@pm atualiza o PRD** com os patches P-1…P-9 pendentes (já anotados em memória) + os achados de fronteira (mapa de contextos, fitness functions D0).
3. **Spike 6 (Heleno):** validar o P3 (re-verificação ≠ re-execução) e o formato da decisão em lote (N-1) — sign-off jurídico das duas frases que a perícia de 2031 lê. **Decisão aberta S-N1.**
4. **Dia 0:** verificador CLI (P16) + contrato de payload por `tipo_evento` (P17) + fitness functions Onda D0 (FF-1/2/3/6) ANTES da migration 001.
5. **Commit** dos dirs 10-20 do contador (atualmente untracked).
6. **Sequenciar o golden-set com o tributarista externo** (Spike 2) — caminho crítico real (Beck).

---

*Versão produzida por Aria (@architect) em 15/Jun/2026, incorporando o conclave SOLID (2 rodadas adversariais, painel HYDRA real via `self-consultation.js`: uncle-bob-martin · martin-fowler · martin-kleppmann · sam-newman · kent-beck). Onde os cinco convergiram, a decisão está fechada; o único dissenso estrutural (pacote de domínio) e os 2 furos de dados (Merkle-ACT, geração-0 do C0) estão resolvidos e registrados. Ratificada pelo founder 15/Jun/2026. A v1.0 (doc 17) permanece como linha de base; esta v1.1 é a evolução verificada — arquitetura que existe porque tem fitness function, não porque tem diagrama.*
