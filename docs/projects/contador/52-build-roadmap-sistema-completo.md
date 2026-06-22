# 52 — Build Roadmap: Sistema Completo (fundação F1 → end-to-end)

> **Autor:** Aria (@architect) · **Data:** 2026-06-20 · **Status:** roadmap de build — proposta para ratificação do founder.
> **Gatilho:** founder decidiu **CONSTRUIR O SISTEMA INTEIRO agora**, invertendo o D4 ("Concierge primeiro"). Decisão registrada do founder; este doc assume a inversão como premissa e desenha o caminho honesto a partir dela.
> **Fontes de verdade:** `00-context/CONTEXT.md` (D1–D9, dead-ends, constraints §5) · `20-arquitetura-core-v1.1.md` (técnica) · `10-prd-core-ciclo-nota-fiscal.md` (PRD) · `21-handoff-codex-build-f1.md` + `27-story-f1-foundation.md` + `48-checkpoint-save-2026-06-18.md` (o que F1 escopou/entregou) · `DESIGN.md` (telas).
> **Não-código:** este doc é plano. Nenhuma implementação aqui.

---

## ⚠️ Leitura honesta antes do roadmap (o que "construir tudo agora" significa de verdade)

A arquitetura v1.1 NÃO é greenfield: ela foi desenhada como **fase-gated por dois motivos que continuam válidos mesmo construindo tudo**:

1. **Risco de margem (COGS):** captura indiscriminada custa ~R$6,35/CNPJ e quebra o corredor de pricing flat. Isso é física do negócio, não cautela de produto. → Captura SELETIVA (F2) com `captura_ativa` default OFF e FF-12 continua obrigatória.
2. **Risco de confiança (falso-positivo):** um motor que erra em silêncio destrói a relação com o contador. O motor só escala depois do golden-set rotulado por tributarista real (Spike 2). → Esse gate é **insumo externo do founder/Renan**, não código. Nenhuma quantidade de build o destrava.

**Conclusão arquitetural:** "construir o sistema inteiro" é legítimo e desejável para tudo que NÃO depende de insumo externo (schema, motor, trilha, verificador, UI, billing-lógica, demo). Mas há um teto duro: **três componentes não "ativam" só com código** — captura real (provider + DPA), acurácia fiscal real (golden-set rotulado), e a camada jurídica/probatória (e-CPF/ACT formal + parecer Heleno). Construir tudo = construir até a borda desses três gates com dados sintéticos/seed, e parar limpo na borda. É exatamente isso que o roadmap abaixo faz.

> **Reframe do D4, não revogação:** o Concierge deixa de ser pré-requisito de build e passa a ser **canal de validação comercial rodando em PARALELO** ao build (Renan testa a tese com 5 escritórios enquanto o time constrói). O que NÃO muda: a geração-0 (manual-mas-conforme, P17), a captura seletiva, a aprovação CRC individualizada, a linguagem G6. Construir não relaxa nenhuma constraint do §5.

---

## 1. Mapa do sistema-alvo

```
                    ESCRITÓRIO CONTÁBIL (tenant)                    CLIENTE FINAL
                    sócio · CONTADOR(CRC) · analista                (indireto — só recebe RdV white-label)
                                  │ HTTPS
┌─────────────────────────────────▼──────────────────────────────────────────────────┐
│  APP WEB (Next.js 15 / React 19 — ver §4 decisão de stack)                          │
│  • Carteira (semáforo) • Fila do dia • LAUDO • Trilha • Aprovação CRC • Admin/Billing │
└──────┬──────────────────────┬───────────────────────────┬───────────────────────────┘
       │                      │                           │
┌──────▼─────────┐  ┌─────────▼──────────┐  ┌─────────────▼──────────────────┐
│ INGESTÃO       │  │ ⭐ MOTOR AUDITORIA │  │ ⭐ TRILHA DE BOA-FÉ            │
│ upload/seed →  │─▶│ regras (det.) +RAG │─▶│ ledger append-only hash-chain  │
│ EFD → provider │  │ confiança/golden   │  │ proveniência · ACT · CRC       │
│ [ACL]          │  │ [fila in / RPC out]│  │ ciclo decisão→ação→protocolo   │
└──────┬─────────┘  └─────────┬──────────┘  └─────────────┬──────────────────┘
       │            ┌─────────▼──────────┐  ┌──────────────▼──────────────────┐
       │            │ BASE REFERÊNCIA    │  │ SAÍDAS                          │
┌──────▼─────────┐  │ cClassTrib×NCM×CST │  │ Laudo PAdES+ACT · RdV mensal    │
│ FILA pgmq      │  │ bitemporal/vigência│  │ Export ERP (CSV) · Verificador  │
└────────────────┘  └────────────────────┘  └─────────────────────────────────┘
        POSTGRES multi-tenant (RLS) · core.api_v1 (RPCs) · METERING/BILLING · OBSERVABILIDADE+FITNESS FF
══════════════════ fronteira da nuvem ════════════════════════════════════════════════
   ▲ webhook XML        ▲ consultas gated      ▲ emissão        ▲ carimbo
 PROVIDER CAPTURA     SERPRO INTEGRA(e-CAC)   ADN/SEFIN NFS-e   ACT ICP-Brasil
```

| Módulo | Classificação | Depende de insumo externo? |
|---|---|---|
| Schema multi-tenant + RLS + core.api_v1 | **CORE** | não (construído — F1) |
| Motor de auditoria (regras determinísticas) | **CORE** | não p/ construir; **golden-set real p/ ativar** |
| Motor — camada RAG | **CORE** | não p/ construir; precisa base licenciada + eval |
| Trilha de boa-fé (ledger + verificador) | **CORE** | não (construído — F1) |
| Carimbo ACT formal (TST real) | **CORE** | **SIM — contrato Serpro/Bry + e-CPF** |
| Laudo PAdES assinado | **CORE** | **SIM — e-CPF do contador (cliente provê)** |
| App/UI (Carteira, Fila, Laudo, Trilha, Aprovação) | **CORE** | não (seed/sintético) |
| Auth multi-tenant (Supabase) | **CORE** | **SIM — projeto/keys Supabase do founder** |
| Captura automática via provider | **CORE (F2)** | **SIM — conta provider + DPA assinado** |
| Parser EFD | CORE (F1+) | não p/ construir; arquivos EFD reais p/ validar |
| Metering/Billing | CORE | não p/ lógica; gateway de pagamento p/ ativar |
| e-CAC (diagnóstico em lote) | **ADD-ON** (D9) | **SIM — contrato SERPRO + procurações** |
| Emissor NFS-e Nacional | **ADD-ON / F3** | SIM — credenciamento ADN |
| Recuperação PIS/COFINS (overlay) | **ADD-ON / F3** | SIM — estrutura jurídica + tributarista |
| Gestorize (estender) | **FORA até Spike 5** | **SIM — código-fonte deployável (pendência §8.5 CONTEXT)** |

---

## 2. Tabela de gap — SPEC (arquitetura v1.1) × CONSTRUÍDO (F1) × FALTA

Legenda: ✅ existe e testado · 🟡 parcial · ❌ não existe · 🔒 bloqueado por insumo externo.

| # | Componente (spec) | Construído? | Testado? | O que FALTA para ficar "ativo" ponta-a-ponta |
|---|---|---|---|---|
| 1 | **Schema 8 contextos** (core/ref/gestao/ingestao/ecac/billing/app) — migration 001 | ✅ | ✅ smoke PG15 + pgTAP/SQL contracts | Aplicar num **Supabase real** (hoje só Postgres descartável) → 🔒 keys |
| 2 | **Trilha ledger** (`evento_boa_fe` append-only, hash-chain, `trilha_cabeca` P5, imutabilidade tripla) | ✅ | ✅ | RLS runtime real (FF-3 num Supabase) → 🔒 keys |
| 3 | **RPCs `core.api_v1`** (registrar_analise, aprovar/rejeitar/superar, decision_evidence, closeout) — migrations 001–004 | ✅ | ✅ G7 PASS | Chamadas a partir de uma UI/edge real (hoje só via SQL/teste) |
| 4 | **Decisão humana individualizada** (P6/P17, parecer Heleno doc 22) | ✅ migr. 002/003 | ✅ | UI que force revisão item-a-item (cerimônia graduada DESIGN §6.4) — ❌ UI |
| 5 | **Motor determinístico puro** `classificar(item,base)→[]` | ✅ | ✅ golden-set **sintético** | **Regras cClassTrib REAIS** (roberto/heleno autoram) + **golden-set rotulado** (Spike 2) → 🔒 tributarista |
| 6 | **Motor — camada RAG** | ❌ | — | base licenciada + embeddings + eval + proveniência P2 preenchida. Fora da F1 (portão doc 21) |
| 7 | **Verificador CLI** (P16, multi-geração, Merkle, closeout manifest) | ✅ | ✅ detecta adulteração + mudança de fórmula | Carimbo ACT **real** no manifest (hoje `time_stamp_provider:"none"`) → 🔒 ACT |
| 8 | **Fitness functions D0** (FF-1 import; FF-2/3/6 contract SQL) | 🟡 FF-1 ✅; FF-2/3/6 = SQL exposto pelo db | 🟡 | FF-2/3/6 como **gate de CI real** (hoje contrato SQL existe, falta pipeline) + dependency-cruiser plugado no CI |
| 9 | **Base de referência** `ref.cclasstrib_regra` bitemporal/vigência por fato gerador | 🟡 tabela existe (schema) | — | **Conteúdo** (regras reais), camadas oficial/licenciada, job reconciliação (FF-9) → 🔒 fonte licenciada |
| 10 | **Carimbo ACT** (Merkle-por-tenant, fecho diário, P14) | 🟡 Merkle computado no verificador; manifest pronto | ✅ lógica | **Provider ACT contratado** (Serpro/Bry) + job de fecho server-side → 🔒 contrato |
| 11 | **Laudo gerador** (PAdES + ACT, DESIGN §6.1) | ❌ | — | Template + render PDF + assinatura e-CPF → 🔒 e-CPF; UI ❌ |
| 12 | **App/UI** (Carteira, Fila do dia, Laudo, Trilha, Aprovação, Admin) | ❌ (só radar-fiscal, periferia) | — | Construir telas do DESIGN.md ligadas ao core via RPC — ❌ UI inteira |
| 13 | **Auth multi-tenant** (Supabase Auth, `app.current_*`, JWT P18) | 🟡 funções `app.*` no schema | — | Projeto Supabase + Auth configurado → 🔒 keys |
| 14 | **Ingestão upload** (Documentize-like) | ❌ | — | UI upload + parser XML NF-e → published language (ACL) — ❌ |
| 15 | **Parser EFD** | ❌ | — | Parser SPED → ACL ingestão. F1+ |
| 16 | **Captura provider** (webhook, pgmq, seletiva, FF-12) | ❌ | — | Conta provider + DPA + webhook → 🔒 contrato+DPA. **F2** |
| 17 | **Metering/Billing** (view canônica, assinatura, consumo) | 🟡 schema + view `nota_auditada_para_billing` | — | Job de metering + gateway pagamento → 🔒 gateway. Lógica construível |
| 18 | **e-CAC add-on** (Integra Contador, gate procuração) | 🟡 schema `ecac` + `ecac_servico_map` | — | Contrato SERPRO + procurações + conector → 🔒. **Linha paralela** |
| 19 | **Emissor / Recuperação** | ❌ | — | F3 — fora de escopo agora |
| 20 | **LGPD operacional** (DPA v1, matriz retenção, suboperadores, G6 linguagem) | ✅ artefatos v1 (docs 41–45) | 🟡 jurídico pendente | Revisão jurídica antes de dado real → 🔒 founder/legal |
| 21 | **Pacote auth/data client** (acesso do app ao core) | ❌ | — | `@contador/api-client` (typed RPC wrapper) — construível |

**Resumo do gap:** a **fundação irrecuperável está pronta e verde** (schema/contrato de dados, ledger, motor puro, verificador, decisão individualizada — os componentes que ficam 10–100× mais caros depois). O que falta para um **sistema funcional end-to-end** é, em ordem de valor: (a) **toda a camada de aplicação/UI** ligada ao core via `core.api_v1`; (b) um **deploy real** (Supabase) para sair do Postgres descartável; (c) o **conteúdo** das regras + golden-set rotulado para o motor virar real; (d) os **insumos externos** (provider+DPA, ACT, e-CPF, SERPRO) que destravam captura/laudo-assinado/e-CAC. Nada do que falta invalida o construído; é continuação reta.

---

## 3. Roadmap faseado (fundação → end-to-end)

> Cada fase: **objetivo · deliverables como stories @dev · dependências · bloqueios externos (founder).** Fases 1–3 são quase 100% desbloqueadas (construíveis com seed/sintético). Fases 4+ dependem de insumo externo nominalmente identificado.

### FASE 1 — "Core ligado": motor + trilha + db numa UI funcional com seed (DESBLOQUEADA — começar JÁ)
**Objetivo:** transformar os 4 packages em um sistema que um humano usa de ponta a ponta com dados sintéticos: subir itens (seed) → motor classifica → apontamentos na fila → contador aprova (cerimônia + CRC) → evento na trilha → laudo render → verificador valida. Zero provider, zero RAG, zero pagamento real. **É o "construir tudo" começando pelo coração já existente.**
**Deliverables (stories):** ver §6.
**Dependências:** os 4 packages (✅). Supabase local (Docker) suficiente; Supabase real só para FASE 2.
**Bloqueios externos:** nenhum para começar. Para deploy real ao fim: 🔒 keys Supabase.

### FASE 2 — "Deploy real + multi-tenant + auth": sair do descartável
**Objetivo:** aplicar a migration 001–005 num Supabase real, ligar Supabase Auth, validar RLS/FF-3 runtime com 2 tenants, plugar FF no CI. Sistema da Fase 1 acessível por login real, isolado por tenant.
**Deliverables:** S-F2.1 provisionar Supabase + aplicar migrations + seed; S-F2.2 Supabase Auth + `app.current_*` ligado ao JWT real (P18); S-F2.3 FF-2/3/6 + FF-1 como gate de CI (GitHub Actions); S-F2.4 typed API client `@contador/api-client`; S-F2.5 teste de isolamento cross-tenant em prod-like (FF-3 generativo).
**Dependências:** Fase 1.
**Bloqueios externos:** 🔒 **projeto/keys Supabase (founder)** · 🔒 decisão de hosting (Vercel já em uso no monorepo) · CI: @devops.

### FASE 3 — "Motor real + base de referência + LGPD-ready"
**Objetivo:** substituir o golden-set sintético por regras cClassTrib reais + golden-set rotulado; popular `ref.cclasstrib_regra` bitemporal; ligar FF-7/FF-9; fechar a revisão jurídica dos artefatos LGPD/G6.
**Deliverables:** S-F3.1 ingestão da base oficial cClassTrib×NCM (camada oficial); S-F3.2 regras determinísticas reais (roberto/heleno autoram); S-F3.3 golden-set rotulado (harness + protocolo doc 24); S-F3.4 FF-7 (re-verificação determinística) + FF-9 (drift da base); S-F3.5 calibração de confiança/threshold (cassie anti-viés); S-F3.6 revisão jurídica DPA/retenção/G6.
**Dependências:** Fase 1 (motor puro), Fase 2 (CI para FF-7/9).
**Bloqueios externos:** 🔒 **tributarista rotulador (founder/Renan — caminho crítico)** · 🔒 **fonte da base cClassTrib licenciada** · 🔒 revisão jurídica (legal/Heleno).

### FASE 4 — "Prova formal: ACT + PAdES + carimbo real"
**Objetivo:** ligar o carimbo ACT real (fecho diário Merkle-por-tenant) e a assinatura PAdES do laudo com e-CPF. O moat passa de "lógica pronta" para "prova juridicamente válida".
**Deliverables:** S-F4.1 contrato ACT + job de fecho diário server-side (FF-4); S-F4.2 assinatura PAdES e-CPF no gerador de laudo; S-F4.3 manifest de closeout com TST real (sai do `provider:"none"`); S-F4.4 Spike 6 sign-off Heleno (re-verificação ≠ re-execução defende no auto?).
**Dependências:** Fase 1 (verificador/closeout), Fase 3 (laudo com conteúdo real).
**Bloqueios externos:** 🔒 **contrato ACT (Serpro/Bry)** · 🔒 **e-CPF do contador** · 🔒 sign-off Heleno (Spike 6).

### FASE 5 — "Captura automática (F2 da arquitetura)"
**Objetivo:** ligar captura comprada SELETIVA via provider, webhook, pgmq, observabilidade de captura, guardrail de COGS (FF-12). Sistema deixa de depender de upload manual.
**Deliverables:** S-F5.1 adapter ACL do provider (dialeto fica em `ingestao.*`, P9); S-F5.2 webhook + pgmq + idempotência; S-F5.3 `captura_ativa` por CNPJ + teto docs/mês + FF-12; S-F5.4 FF-8 (contrato do provider); S-F5.5 observabilidade de captura + SLA de pico (FF-11).
**Dependências:** Fases 1–4.
**Bloqueios externos:** 🔒 **conta no provider (Focus hipótese primária) + DPA assinado (Art. 39 LGPD)**.

### FASE 6 — "Billing ativo + Implantação + Relatório de Valor"
**Objetivo:** a camada Anderson — vender, implantar, provar valor, faturar.
**Deliverables:** S-F6.1 metering job sobre view canônica; S-F6.2 assinatura/franquia/excedente (D7); S-F6.3 gateway de pagamento; S-F6.4 módulo Implantação (import carteira em lote); S-F6.5 Relatório de Valor mensal (dono + white-label).
**Dependências:** Fases 2–3.
**Bloqueios externos:** 🔒 gateway de pagamento · 🔒 pricing final ratificado.

### FASE 7 — "Add-ons (linha paralela): e-CAC · Emissor · Recuperação"
**Objetivo:** D9 (e-CAC add-on premium), F3 da arquitetura (emissor/recuperação). **Linha paralela — não bloqueia o core.**
**Deliverables:** S-F7.1 conector e-CAC + gate procuração; S-F7.2 emissor NFS-e Nacional (DANFSe); S-F7.3 dossiê recuperação PER/DCOMP.
**Bloqueios externos:** 🔒 contrato SERPRO · 🔒 procurações · 🔒 credenciamento ADN · 🔒 estrutura jurídica recuperação.

### Gestorize (transversal, gated)
A decisão de **estender o Gestorize** (D1) está suspensa pelo **portão Spike 5** (avaliar qualidade do código herdado). Enquanto o Spike 5 não rodar, o Gestorize entra como **origem plugável atrás de ACL** (`gestao` = contexto ACL contra terceiro), nunca com FK no core (FF-2). 🔒 **insumo: código-fonte deployável do Gestorize (pendência §8.5 CONTEXT).**

---

## 4. Decisão de stack do app — RECOMENDAÇÃO

**Recomendação: APP NOVO** — `apps/contador` (Next.js 15 / React 19 / TS), consumindo o core via `@contador/api-client` (typed RPC wrapper sobre `core.api_v1`/Supabase). **NÃO estender o `apps/radar-fiscal`.**

**Justificativa (trade-offs):**

| Critério | Estender radar-fiscal | App novo `apps/contador` (recomendado) |
|---|---|---|
| Alinhamento com D1 (estende Gestorize/reaproveita) | ⚠️ falso reaproveitamento — radar-fiscal é **periferia/Gestor**, explicitamente **NÃO o core** (CONTEXT §6, dead-end ⚠️). D1 fala em estender **Gestorize**, não radar-fiscal | ✅ honra D1: o core nasce limpo; o reaproveitamento previsto por D1 é do **Gestorize** (gated por Spike 5), não do radar-fiscal |
| Bounded contexts (§2-bis) | ❌ radar-fiscal é o contexto **GESTÃO** (obrigações/prazos). Misturar a UI do **CORE** (apuração) dentro dele viola a fronteira logo no D0 — exatamente o que FF-1 existe para impedir | ✅ separação física do contexto Apuração; FF-1 (import boundary) fica trivial de respeitar |
| Domínio do radar-fiscal | ❌ `lib/domain.ts` declara explicitamente: *"NUNCA calcula imposto, apuração, crédito"* — o core É apuração. Conflito de propósito no próprio modelo | ✅ sem conflito; cada app tem seu domínio |
| Reaproveitamento real | 🟡 stack (Next 15/React 19/TS), tokens, status-map | ✅ **mesmo reaproveitamento sem o acoplamento** — copiar tokens DESIGN.md, padrão de Nav/StatusBadge, convenções; o radar-fiscal vira **referência de padrão**, não base |
| Risco de churn de refactor | ❌ alto — o radar-fiscal teria que ser re-arquitetado para hospedar o core | ✅ baixo — começa do DESIGN.md, sem dívida herdada |
| Futuro: unificação | as duas vivem no monorepo; podem compartilhar um `packages/ui` depois (YAGNI com gatilho) | ✅ idem; melhor caminho para um `packages/contador-ui` compartilhado quando 2 apps justificarem |

**Síntese:** o radar-fiscal é o contexto **Gestão** e o DESIGN.md/§2-bis tratam Apuração como contexto separado. Estender o radar-fiscal não é "reaproveitar" — é fundir dois bounded contexts no primeiro dia, a violação que a FF-1 existe para barrar. Reaproveite o que é barato e seguro (tokens, stack, padrão de componentes, convenção de RLS-por-`escritorio_id` que o `domain.ts` já modela) e construa as telas-herói do DESIGN.md (Laudo, Trilha, Carteira, Fila, Aprovação) em `apps/contador` novo. Quando 2 apps justificarem, extraia `packages/contador-ui`.

---

## 5. Constraints que NÃO mudam (mesmo construindo tudo) — e ONDE entram no build

| Constraint (CONTEXT §5 / D-decisions) | Onde entra no build |
|---|---|
| **Humano no loop — aprovação CRC individualizada** (parecer Heleno doc 22: requisito JURÍDICO, não UX) | RPC `core.api_v1.aprovar_apontamento` exige `ator`=contador-CRC + evidência por apontamento (✅ migr. 002/003). UI: cerimônia graduada item-a-item, **proibido aprovar em lote silencioso** (DESIGN §6.4). FF: telemetria de "aprovação cega" (FF-5/telemetria de teatro). **Fase 1 já constrói isso.** |
| **LGPD by design** (não custodiar A1; DPA+operador; matriz retenção) | Schema com RLS default-deny + `app.*` único leitor do JWT (P18). DPA/retenção/suboperadores = docs 42–44 (revisão jurídica = bloqueio Fase 3). Captura comprada com DPA = Fase 5. **Sem XML real até gate LGPD.** |
| **Linguagem segura G6** (sem "crédito garantido", "apuração correta", "elimina multa") | Banlist executável FF-10 sobre TODO template (CI hard-fail). Disclaimer-credencial (DESIGN §6.6) ancorado em doc 45. Entra na **Fase 1** (qualquer texto de laudo/UI passa pela banlist desde o 1º). |
| **Captura SELETIVA** (`captura_ativa` OFF default, teto docs/mês, FF-12) | Coluna no schema + FF-12 guardrail de COGS. Construída na **Fase 5** (captura), mas o schema já carrega o flag desde a migration 001. |
| **Sem XML real até gates LGPD** | Fases 1–4 usam **seed/sintético**. XML real só após revisão jurídica (Fase 3) + DPA (Fase 5). O verificador/motor não distinguem origem além do metadado `qualidade_insumo` — seguro com sintético. |
| **Re-verificação ≠ re-execução** (P3) | Verificador re-verifica integridade; NUNCA promete replay de LLM. FF-7 re-executa SÓ camada determinística. Sign-off Heleno = Spike 6 (Fase 4). |
| **Geração-0 manual-mas-conforme** (P17) | Todo evento (inclusive seed da Fase 1) nasce com `payload_versao`, `tipo_inferencia`, `ator`-CRC nos atos privativos. Já no schema. |

---

## 6. FASE 1 — stories concretas para começar AGORA (em ordem)

> **Objetivo da fase:** um humano usa o sistema ponta-a-ponta com dados sintéticos — seed → motor → fila → aprovação CRC → trilha → laudo → verificação. **Zero insumo externo. Tudo construível hoje.** Esta é a fatia de maior valor desbloqueado: prova a tese visualmente e dá ao Renan algo demonstrável (vira o Demo Kit do Concierge, rodando em paralelo).

| Ordem | Story | Descrição | DoD | Dependência |
|---|---|---|---|---|
| **F1.1** | **`apps/contador` scaffold + tokens + api-client** | App Next.js 15 novo; tokens do DESIGN.md (Verde-Petróleo); `@contador/api-client` typed wrapper sobre `core.api_v1` (mocável); layout/Nav reusando padrão radar-fiscal | App roda; typecheck verde; client tipado chama as RPCs (mock em PG local) | 4 packages (✅) |
| **F1.2** | **Seed sintético end-to-end** | Script de seed: 1 escritório, 1 contador-CRC, 1 cliente, N notas/itens, base de referência sintética → roda o motor → `registrar_analise` → apontamentos pendentes na fila | Seed popula PG local; apontamentos aparecem via api-client; trilha tem eventos conformes (P17) | F1.1; motor (✅); migr. 001 (✅) |
| **F1.3** | **Tela Carteira (semáforo) + Fila do dia** | Carteira = painel semáforo por cliente (status DESIGN §3 map); Fila do dia = tabela data-dense de apontamentos pendentes com materialidade (DESIGN §6.5) | Listas reais do seed; status redundante (cor+ícone+label); ordenação por materialidade | F1.1, F1.2 |
| **F1.4** | **Tela Aprovação CRC (cerimônia graduada)** | Revisão item-a-item; ato privativo chama `aprovar/rejeitar_apontamento` com `ator`=contador-CRC; cerimônia pesada (digitar p/ confirmar); rejeição motivada (dropdown curado) | Aprovação grava evento na trilha via RPC; aprovação em lote silenciosa **bloqueada**; CRC carimbado na UI (DESIGN §6.4) | F1.3; RPCs (✅) |
| **F1.5** | **Tela Trilha de boa-fé (timeline append-only)** | Timeline vertical por dia; cada nó = ator+CRC, ação, timestamp absoluto, badge classe insumo, hash copiável; visualmente "selada" (DESIGN §6.2) | Renderiza a cadeia do seed; hashes batem com o verificador; sem botão editar/excluir | F1.4 |
| **F1.6** | **Tela LAUDO + banlist G6 + verificador no loop** | Laudo render (DESIGN §6.1, sem PAdES/ACT real ainda — placeholder honesto "carimbo pendente"); FF-10 banlist linguística no CI sobre o template; botão "verificar cadeia" roda o verificador CLI e mostra resultado | Laudo gera do seed; FF-10 falha se aparecer termo proibido; verificador confirma integridade na UI | F1.5; verificador (✅) |

**Sequência de ataque:** F1.1 → F1.2 (desbloqueiam tudo) → F1.3/F1.4/F1.5 (o ciclo humano) → F1.6 (a prova visível). Ao fim da Fase 1: **o Demo Kit existe**, roda com sintético, e é exatamente o que o Concierge precisa — build e validação comercial deixam de ser sequenciais e passam a ser paralelos.

> **Aviso honesto gravado:** o laudo da Fase 1 NÃO está juridicamente válido (sem ACT/PAdES real — Fase 4) e o motor classifica com regras sintéticas (sem golden-set rotulado — Fase 3). A UI deve dizer isso explicitamente (placeholder "carimbo de tempo pendente", badge "base sintética") — coerente com G6: nunca performar prova que não existe.

---

*— Aria, arquitetando o futuro 🏗️*
