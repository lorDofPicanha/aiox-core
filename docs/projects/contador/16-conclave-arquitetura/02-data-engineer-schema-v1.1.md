# Modelo de Dados v1.1 — Core "Apuração Defensável" (Contador)

> **Autor:** Dara (@data-engineer) · **Data:** 2026-06-15 · **Status:** Patches do Conclave SOLID aplicados (ratificados pelo founder)
> **Base:** `02-data-engineer-schema.md` (v1.0) + `18-conclave-solid/99-sintese-conclave-solid.md` §5.1 (fonte de verdade dos patches) + `17-arquitetura-core-v1.md` (M-1…M-15 do conclave Fable).
> **Esta versão NÃO substitui o v1.0** — é o v1.0 com os patches P1…P23 da §5.1 aplicados. Onde um patch é decisão de arquitetura (não DDL), aponta para o doc 17 v1.1.
> **Stack-alvo:** PostgreSQL 15+ / Supabase (RLS, Storage, pgmq/pg-boss, pgvector).
> ⚠️ Consulta aos mind clones indisponível nesta sessão (brain-bridge offline) — patches já carregam o DNA dos 5 experts SOLID (uncle-bob/fowler/kleppmann/newman/beck) via a síntese do conclave, que é o output deles. Os M-1…M-15 do conclave Fable (Heleno/Roberto/Anderson) continuam válidos e foram preservados; este doc adiciona a camada SOLID por cima.

---

## CHANGELOG v1.0 → v1.1 (cada DDL rastreável a um patch)

| Patch | O que mudou concretamente no schema |
|-------|-------------------------------------|
| **P1** | Nova `ref.motor_versao` (entidade versionada: codigo_versao git-sha, regras_pacote_hash, modelo_llm, prompt_hash, embedding_modelo, params, golden_set_versao_id FK, hash_manifesto). FK `motor_versao_id` **NOT NULL** em `analise_execucao` e em `apontamento_auditoria`. Coluna discriminadora `tipo_inferencia` CHECK ∈ {humano_concierge, regra_deterministica, rag} no apontamento. |
| **P2** | Nova `core.analise_execucao` (materializa o evento `analise_executada`) com TODOS os campos de proveniência computacional desde a F1: prompt_hash, embedding_modelo, retrieval_set jsonb, resposta_bruta jsonb — `null` enquanto só-regras, populam quando o RAG entrar. |
| **P4** | `hash_ver smallint NOT NULL` em `evento_boa_fe` desde o gênese. Trigger reescrito: canonicalização com **delimitadores `\x1f`** entre campos canônicos **nomeados** (não `payload::text` blob). Comentário fixa a fórmula da geração 1. |
| **P5** | Nova `core.trilha_cabeca(escritorio_id PK, seq, hash, hash_ver)` = fonte única de seq+cabeça (row-lock single-writer via `FOR UPDATE`). Trigger `tg_evento_boa_fe_chain` **substitui** o `MAX(seq_tenant)`-via-SELECT pelo lock na cabeça. Réplica é read-only para sempre (doc). |
| **P6** | `apontamento_auditoria`: `UNIQUE(item_id, tipo_divergencia, base_versao_id, motor_versao_id)` + novo estado `superado` na máquina de estados. `analise_execucao` UNIQUE por (item, motor_versao, base_versao). Materialização SÓ pela RPC (grants P15/P20). |
| **P7** | `evento_boa_fe`: índice UNIQUE parcial por referente (`referente_tipo`, `referente_id`, `tipo_evento`) p/ idempotência da trilha. |
| **P8** | Removida `core.usuario.departamento_id` + a FK `fk_usuario_departamento`. Nova `gestao.usuario_departamento` (N:N). FF documentada: **FK core→gestao PROIBIDA**; gestao→core permitida (ACL contra Gestorize). |
| **P9** | `provider_meta`/`ultimo_nsu` saem do `core` → schema novo `ingestao`. Enum `origem` da nota neutro (`provider_ocr` no lugar de `documentize`). Nova `ref.ecac_servico_map`. Schemas novos `ecac` e `billing`. View `billing.nota_auditada_para_billing` versionada (contrato). |
| **P10** | (já em v1.0) `nota` particionada — reafirmado; `nota_item` ganha comentário de herança de partição via FK composta. Nota: particionar `nota_item` em si = doc 17 v1.1 (decisão de operação, não bloqueante). |
| **P11** | Nova `core.base_adocao(escritorio_id, base_versao_id, adotada_em, status)` — estado de adoção de base por tenant; FK do evento `base_referencia_atualizada` aponta para cá. |
| **P12** | Nova função `core.competencia_de(emitida_em date)`; `nota.competencia` documentada como derivada. Novo `nota.competencia_fiscal date` separado (apuração ≠ emissão). `nota.chave_acesso` agora **nullable** + nova `nota.chave_dedup text NOT NULL` (chave OU hash sintético) — dedup tolerante a nota sem chave (manual). |
| **P13** | `tipo_evento` ganha `restauracao_sistema` no CHECK (só o contrato). TSTs/laudos WORM fora do banco = doc 17 v1.1 (storage). |
| **P15** | Grants: role `motor` SEM INSERT em `core.*` (só SELECT em ref/core + EXECUTE nas RPCs). |
| **P18** | `app.current_papel`/`app.current_escritorio_id` marcadas como **único lugar que conhece o formato do JWT** (comentário governança + nenhuma outra fn lê `request.jwt.claims`). |
| **P20** | RLS: removida policy de UPDATE direto em `apontamento_auditoria`. Escrita só via RPC `security definer`. `constraint trigger tg_apont_exige_evento` aborta UPDATE sem evento correspondente na mesma tx. Roles Postgres por módulo (`core_rw`, `gestao_rw`, `motor`, `billing_ro`). |
| **P22** | Evento `superado` carrega AMBOS os eixos no payload (`conhecida_em` + `vigencia`) — contrato do payload fixado + CHECK. |
| **P23** | `ref.golden_set_versao` (snapshot imutável versionado) + `core.golden_exemplo.golden_set_versao_id` FK. `motor_versao.golden_set_versao_id` referencia o snapshot que liberou o motor. |

**Decisões que vivem no doc 17 v1.1 (não-DDL, apenas nota aqui):** P3 (frase re-verificação≠re-execução, §3.3), P14 (carimbo Merkle-por-tenant), P16 (verificador CLI dia-0), P17 (forma manual-conforme do C0), P19 (`core.api_v1` como API publicada/CI), P21 (FF-1/2/3/6 como gates de CI). **Ver doc 17 v1.1.**

---

## 0. Decisões de schema (sumário) — adições v1.1

Mantém S1–S12 do v1.0. Adiciona:

| # | Decisão | Racional curto |
|---|---------|----------------|
| S13 | **Motor é entidade, não string** (`ref.motor_versao`) — toda inferência referencia a versão exata (código+regras+LLM+prompt+embedding+golden-set) | **[P1]** Reprodutibilidade da DECISÃO: o laudo aponta para QUAL motor decidiu (não "motor v3" num jsonb). |
| S14 | **Seq+cabeça da trilha em `core.trilha_cabeca`** (single-writer com row-lock), não `MAX(seq_tenant)` | **[P5]** `MAX(SELECT)`+advisory lock = contador distribuído fingindo local; quebra no 1º failover/réplica. Cabeça materializada elimina a corrida. |
| S15 | **Dialeto do fornecedor fora do core** (schema `ingestao`; enum `origem` neutro) | **[P9]** Enum `'documentize'` em payload imutável = veneno de proveniência; NSU/provider_meta são detalhe de adapter. |
| S16 | **Escrita do core SÓ via RPC** — role do motor e PostgREST não fazem INSERT/UPDATE direto | **[P15][P20]** A RPC é a fronteira; faltava proibir o bypass. Grant por módulo + constraint trigger fecham a porta lateral. |
| S17 | **3ª perna da reprodutibilidade versionada** (`ref.golden_set_versao`) | **[P23]** base + motor + **eval**; o golden-set que liberou o motor v3 não pode evaporar quando o v4 é avaliado. |
| S18 | **Hash digere campos canônicos NOMEADOS com delimitador**, não `payload::text` | **[P4]** `payload::text` muda com reordenação de chaves jsonb → hash instável; campos nomeados + `hash_ver` = fórmula evolutiva, verificador multi-geração é o eterno. |

---

## 1. Diagrama de entidades (visão) — deltas v1.1

```
ref.* (global, read-only p/ tenants, SEM RLS)
  base_versao ──< cclasstrib_regra ──< cclasstrib_embedding (F1, pgvector)
  golden_set_versao ──< (snapshot)                              ⭐ [P23]
  motor_versao >── golden_set_versao                            ⭐ [P1]
  ecac_servico_map                                              ⭐ [P9]

core.* (tenant-scoped, RLS por escritorio_id)
  escritorio ─┬─< usuario (papel)                  -- SEM departamento_id [P8]
              ├─< cliente ─┬─< nota (particionada) ──< nota_item ──< apontamento_auditoria
              │            │                            >── ref.cclasstrib_regra
              │            │                            >── ref.motor_versao        [P1]
              │            ├─< laudo
              │            └─< base_adocao (estado de adoção de base/tenant)         [P11]
              ├─< analise_execucao (proveniência computacional)                      [P2]
              ├─< golden_exemplo >── ref.golden_set_versao                           [P23]
              ├─< trilha_cabeca (seq+hash, single-writer)        ⭐ [P5]
              ├─< evento_boa_fe ⭐ (append-only, hash-chain, hash_ver)   ← o moat
              └─< audit_log (LGPD, append-only)

ingestao.* (dialeto do provider — fora do core)                  ⭐ [P9]
  provider_conexao · ingestao_evento (provider_meta, ultimo_nsu aqui)

ecac.* / billing.* (schemas próprios)                            ⭐ [P9]
  ecac.consulta · ecac.procuracao  ·  billing.consumo_mensal · billing.assinatura
  billing.nota_auditada_para_billing (VIEW = contrato versionado)

gestao.* (tenant-scoped, módulo separado — D1; gestao→core OK, core→gestao PROIBIDA [P8])
  departamento · usuario_departamento (N:N) [P8] · obrigacao_modelo ──< obrigacao ──< guia
  tarefa · alvara_certidao · tag/cliente_tag · documento ──< documento_feedback · envio
```

---

## 2. Fundação: extensões, schemas, helpers — deltas v1.1

```sql
-- ============================================================
-- MIGRATION 000 — fundação (v1.1)
-- ============================================================
create extension if not exists pgcrypto;      -- digest() p/ hash-chain
create extension if not exists btree_gist;    -- EXCLUDE de vigência
create extension if not exists citext;        -- e-mail case-insensitive

create schema if not exists core;     -- ciclo da nota / moat
create schema if not exists gestao;   -- camada Gestorize (D1)
create schema if not exists ref;      -- bases de referência públicas (sem tenant)
create schema if not exists app;      -- funções utilitárias
create schema if not exists ingestao; -- [P9] dialeto do provider (fora do core)
create schema if not exists ecac;     -- [P9] add-on e-CAC (schema próprio)
create schema if not exists billing;  -- [P9] metering/assinatura (schema próprio)

comment on schema core     is 'Core fiscal: nota, auditoria, trilha de boa-fé, laudo. Tenant-scoped + RLS.';
comment on schema gestao   is 'Camada Gestão (Gestorize estendido). Mesmo tenant, módulo separado (D1). gestao→core permitida; core→gestao PROIBIDA [P8].';
comment on schema ref      is 'Bases de referência (cClassTrib/NCM/motor/golden-set). Públicas, globais, SEM RLS — só leitura para tenants.';
comment on schema ingestao is '[P9] Dialeto do provider de captura: NSU, provider_meta, staging. O core não conhece o fornecedor — só recebe nota neutra.';
comment on schema ecac     is '[P9] Add-on e-CAC (SERPRO Integra Contador). Schema próprio, migration própria, não bloqueia o core.';
comment on schema billing  is '[P9] Metering/assinatura. A definição de "nota auditada para faturar" vive aqui (view versionada), não na máquina de estados do core.';

-- ------------------------------------------------------------
-- [P18] GOVERNANÇA DO app.* — ÚNICO LUGAR QUE CONHECE O FORMATO DO JWT (Single Choice)
-- Nenhuma outra função/policy lê request.jwt.claims diretamente. Mudou o formato do
-- claim Supabase? Muda AQUI e em lugar nenhum mais. Teste de CI verifica isso.
-- ------------------------------------------------------------
create or replace function app.current_escritorio_id()
returns uuid language sql stable
as $$
  select nullif(
    coalesce(
      current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'escritorio_id',
      ''
    ), ''
  )::uuid
$$;
comment on function app.current_escritorio_id is
  '[P18] Tenant da sessão, lido do claim app_metadata.escritorio_id do JWT Supabase. '
  'ÚNICO ponto (com current_papel) que conhece o formato do JWT — Single Choice Principle. NULL fora de sessão.';

create or replace function app.current_papel()
returns text language sql stable
as $$
  select current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'papel'
$$;
comment on function app.current_papel is
  '[P18] Papel da sessão. ÚNICO ponto (com current_escritorio_id) que lê o JWT. '
  'Qualquer outra fn que precise do papel CHAMA esta — nunca relê o claim.';

create or replace function app.tg_set_updated_at()
returns trigger language plpgsql
as $$ begin new.updated_at := now(); return new; end $$;

create or replace function app.tg_block_mutation()
returns trigger language plpgsql
as $$ begin
  raise exception 'Tabela %.% é append-only (imutável por design — trilha de boa-fé/LGPD)',
    tg_table_schema, tg_table_name;
end $$;

-- ------------------------------------------------------------
-- [P12] competência derivada por função no banco (não decidida pelo app)
-- ------------------------------------------------------------
create or replace function core.competencia_de(p_emitida_em date)
returns date language sql immutable
as $$ select date_trunc('month', p_emitida_em)::date $$;
comment on function core.competencia_de is
  '[P12] Competência = mês da emissão, derivada NO BANCO (uma única definição). '
  'competencia_fiscal (mês de apuração) é coisa separada e mora numa coluna própria da nota.';
```

---

## 3. Núcleo `core` — deltas v1.1

### 3.1 Usuários — remoção do ciclo core→gestao [P8]

```sql
-- core.escritorio: inalterada vs v1.0 (+ M-1/M-14 do conclave Fable seguem valendo)

create table core.usuario (
  id              uuid primary key,              -- = auth.users.id (Supabase Auth)
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  nome            text not null,
  email           citext not null,
  papel           text not null default 'analista'
                  check (papel in ('admin','gestor','contador','analista','leitura')),  -- 'contador' = M-1
  -- [P8] departamento_id REMOVIDO. Era FK core→gestao = ciclo + ACL ausente contra Gestorize.
  --      O vínculo usuário↔departamento agora vive em gestao.usuario_departamento (gestao→core).
  cpf             char(11) check (cpf ~ '^[0-9]{11}$'),  -- M-1 (ato privativo)
  crc             text,                          -- M-1
  crc_uf          char(2),                       -- M-1
  crc_situacao    text check (crc_situacao in ('ativo','suspenso','baixado','sem_registro')), -- M-1
  ativo           boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (escritorio_id, email)
);
comment on table core.usuario is
  'Perfil do colaborador (espelha auth.users 1:1). [P8] SEM FK para gestao — core não depende de gestao. '
  'Papel contador (M-1): CRC ativo é pré-req do ato que sustenta laudo.';

create trigger tg_upd before update on core.usuario
  for each row execute function app.tg_set_updated_at();
```

### 3.2 Nota — competência derivada, chave nullable, dialeto fora [P9][P12]

```sql
create table core.nota (
  id              uuid not null default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  competencia     date not null                  -- [P12] derivável via core.competencia_de(emitida_em)
                  check (competencia = date_trunc('month', competencia)),
  competencia_fiscal date                         -- [P12] mês de APURAÇÃO (≠ emissão); null = usa competencia
                  check (competencia_fiscal is null or competencia_fiscal = date_trunc('month', competencia_fiscal)),
  tipo            text not null check (tipo in ('nfe','nfce','nfse','cte','mdfe')),
  direcao         text not null check (direcao in ('compra','venda')),
  chave_acesso    text                            -- [P12] AGORA NULLABLE (manual/OCR pode não ter chave)
                  check (chave_acesso is null or length(chave_acesso) between 40 and 54),
  chave_dedup     text not null,                  -- [P12] chave_acesso OU hash sintético (cnpj+num+serie+valor)
                                                  --       — dedup determinístico mesmo sem chave de acesso
  numero          text,
  serie           text,
  emitida_em      date not null,
  emitente_cnpj   char(14) not null,
  destinatario_doc text,                          -- CNPJ ou CPF (NFC-e) — PII! ver v1.0 §7.2
  valor_total     numeric(15,2) not null check (valor_total >= 0),
  origem          text not null check (origem in ('upload','provider_ocr','provider','manual')),
                  -- [P9] 'documentize' VIROU 'provider_ocr' (enum neutro; sem nome de fornecedor no core)
  -- [P9] provider_meta / ultimo_nsu / NSU NÃO ficam aqui → ingestao.ingestao_evento
  xml_storage_path text,
  xml_hash        bytea,
  status_auditoria text not null default 'nao_analisada'
                  check (status_auditoria in ('nao_analisada','em_analise','analisada','sem_divergencia')),
  capturada_em    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  primary key (id, competencia),
  -- ⭐ IDEMPOTÊNCIA [P12]: dedup por chave_dedup (tolera nota sem chave_acesso)
  unique (escritorio_id, chave_dedup, competencia)
) partition by range (competencia);  -- [P10] particionada desde o dia 0 (v1.0 S5)

comment on table core.nota is
  'Documento fiscal. [P10] PARTICIONADA por competência. [P12] competencia derivada por core.competencia_de(); '
  'competencia_fiscal separada; chave_acesso nullable + chave_dedup obrigatória. [P9] dialeto do provider mora em ingestao.*.';
comment on column core.nota.chave_dedup is
  '[P12] Chave de dedup determinística: = chave_acesso quando existe; senão hash(emitente+numero+serie+valor+emitida_em). '
  'Resolve o dedup da fronteira upload×provider sem depender de chave de acesso (nem toda NFS-e/manual tem).';

-- Partições anuais 2021..2027 (idênticas ao v1.0; criar a do ano seguinte em dezembro)
create table core.nota_2021 partition of core.nota for values from ('2021-01-01') to ('2022-01-01');
create table core.nota_2022 partition of core.nota for values from ('2022-01-01') to ('2023-01-01');
create table core.nota_2023 partition of core.nota for values from ('2023-01-01') to ('2024-01-01');
create table core.nota_2024 partition of core.nota for values from ('2024-01-01') to ('2025-01-01');
create table core.nota_2025 partition of core.nota for values from ('2025-01-01') to ('2026-01-01');
create table core.nota_2026 partition of core.nota for values from ('2026-01-01') to ('2027-01-01');
create table core.nota_2027 partition of core.nota for values from ('2027-01-01') to ('2028-01-01');

create trigger tg_upd before update on core.nota
  for each row execute function app.tg_set_updated_at();

-- core.nota_item: idêntica ao v1.0 (carrega competencia p/ FK composta — herda partição da mãe [P10]).
-- [P10] particionar nota_item por competência em si = decisão de operação → doc 17 v1.1 (não bloqueante D0).
```

### 3.3 Apontamento — motor versionado, tipo_inferencia, novos estados [P1][P6][P20]

```sql
create table core.apontamento_auditoria (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  item_id         uuid not null references core.nota_item(id) on delete restrict,
  -- proveniência da regra (S4)
  base_versao_id  uuid references ref.base_versao(id),
  regra_id        uuid references ref.cclasstrib_regra(id),
  -- ⭐ [P1] MOTOR VERSIONADO: qual motor exato produziu este apontamento (NOT NULL)
  motor_versao_id uuid not null references ref.motor_versao(id),
  -- ⭐ [P1] DISCRIMINADOR de como a inferência foi feita
  tipo_inferencia text not null
                  check (tipo_inferencia in ('humano_concierge','regra_deterministica','rag')),
  origem          text not null default 'manual'
                  check (origem in ('manual','motor')),
  tipo_divergencia text not null
                  check (tipo_divergencia in
                    ('cclasstrib_divergente','ncm_suspeito','monofasico_tributado',
                     'aliquota_divergente','cst_divergente','credito_potencial','outro')),
  cclasstrib_referencia text,
  campo_corrigir  text,
  descricao       text not null,
  valor_envolvido numeric(15,2),
  confianca       numeric(4,3) check (confianca between 0 and 1),
  banda_confianca text not null default 'disputado'
                  check (banda_confianca in ('alta','media','baixa','disputado')),
  status_controversia text check (status_controversia in ('pacifico','controvertido','judicializado')), -- M-2
  risco_juridico  text check (risco_juridico in ('administrativo_seguro','borderline','judicial')),
  qualidade_insumo text not null default 'xml' check (qualidade_insumo in ('xml','documento_extraido')), -- M-2/§3.6
  fundamento      jsonb not null default '[]',
  fato_gerador_em date,                          -- M-2/C4 (vigência pelo fato gerador)
  criterios_desempate jsonb not null default '{}', -- M-2
  -- HUMANO NO LOOP (D8) + ciclo fechado (M-2)
  status          text not null default 'pendente'
                  check (status in ('pendente','aprovado','rejeitado','retificado','regularizado','superado')),
                  -- [P6] 'superado' = apontamento substituído por re-análise (motor/base nova)
                  -- 'regularizado' = M-2 (estado terminal com ação+protocolo)
  acao_tipo       text check (acao_tipo in ('retificacao','recolhimento','denuncia_espontanea','justificativa_mantida')), -- M-2
  acao_protocolo  text,                          -- M-2 (obrig. em retificado/regularizado)
  decidir_ate     date,                          -- M-2 (SLA)
  revisor_id      uuid references core.usuario(id),
  revisado_em     timestamptz,
  motivo_codigo   text,                          -- M-2 (dropdown curado)
  motivo_texto    text,                          -- M-2 (opcional)
  laudo_id        uuid,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint ck_revisao_completa check (
    (status = 'pendente' and revisor_id is null)
    or (status <> 'pendente' and revisor_id is not null and revisado_em is not null)
  ),
  constraint ck_rejeicao_motivada check (status <> 'rejeitado' or motivo_codigo is not null),
  constraint ck_acao_protocolada check (
    status not in ('retificado','regularizado') or acao_protocolo is not null
  ),  -- M-2: retificação sem protocolo é alegação, não fato
  -- ⭐ [P6] UNICIDADE: um apontamento por (item, tipo, base, motor). Re-análise com motor/base
  --     nova NÃO duplica — gera novo registro só se a chave mudar; gêmeos do mesmo motor são barrados.
  constraint uq_apont_dedup unique (item_id, tipo_divergencia, base_versao_id, motor_versao_id)
);
comment on table core.apontamento_auditoria is
  'Um indício por item. [P1] motor_versao_id NOT NULL + tipo_inferencia discriminam QUEM/COMO decidiu. '
  '[P6] uq_apont_dedup impede gêmeos no retry; estado superado materializa a substituição POR RPC (nunca pelo motor).';
comment on column core.apontamento_auditoria.tipo_inferencia is
  '[P1] humano_concierge (C0, decisão humana) · regra_deterministica (motor de regras F1) · rag (RAG F1+). '
  'Discrimina a CLASSE de inferência — re-verificação ≠ re-execução depende disto (ver doc 17 v1.1 §3.3 / P3).';

create trigger tg_upd before update on core.apontamento_auditoria
  for each row execute function app.tg_set_updated_at();

-- Máquina de estados [P6]: + transições para 'superado' e 'regularizado'
create or replace function core.tg_apontamento_transicao()
returns trigger language plpgsql
as $$
begin
  if old.status <> new.status then
    if not (
      (old.status = 'pendente'  and new.status in ('aprovado','rejeitado','superado')) or
      (old.status = 'aprovado'  and new.status in ('retificado','regularizado','superado')) or
      (old.status = 'rejeitado' and new.status in ('retificado','superado')) or
      (old.status = 'retificado' and new.status = 'regularizado')
      -- [P6] 'superado': re-análise por motor/base nova pode superar qualquer estado não-terminal
    ) then
      raise exception 'Transição de status ilegal: % → %', old.status, new.status;
    end if;
  elsif old.status not in ('pendente')
    and (old.confianca, old.descricao, old.fundamento)
        is distinct from (new.confianca, new.descricao, new.fundamento) then
    raise exception 'Apontamento revisado é imutável; crie retificação ou supere com nova análise.';
  end if;
  return new;
end $$;
create trigger tg_transicao before update on core.apontamento_auditoria
  for each row execute function core.tg_apontamento_transicao();

-- ⭐ [P20] CONSTRAINT TRIGGER: aborta UPDATE de apontamento que NÃO tenha evento na MESMA tx.
-- Fecha a porta lateral do PostgREST (UPDATE direto sem passar pela RPC = sem trilha = furo do moat).
create or replace function core.tg_apont_exige_evento()
returns trigger language plpgsql
as $$
declare v_tem_evento boolean;
begin
  -- só exige evento quando o status muda (mudança de estado = ato que precisa de prova)
  if old.status is distinct from new.status then
    select exists(
      select 1 from core.evento_boa_fe e
       where e.referente_tipo = 'apontamento'
         and e.referente_id = new.id
         and e.xmin = (txid_current()::text::xid)  -- inserido nesta transação
    ) into v_tem_evento;
    if not v_tem_evento then
      raise exception '[P20] UPDATE de apontamento % sem evento de boa-fé na mesma transação. '
        'Escrita de estado só via RPC security definer (core.aprovar_apontamento etc.).', new.id;
    end if;
  end if;
  return new;
end $$;
create constraint trigger tg_apont_exige_evento
  after update on core.apontamento_auditoria
  deferrable initially deferred
  for each row execute function core.tg_apont_exige_evento();
-- NB: a comparação por xmin é heurística defensiva; a garantia forte vem do grant (P15/P20):
-- authenticated NÃO tem UPDATE nesta tabela (RLS §6), só a RPC security definer escreve.
```

### 3.4 Laudo — inalterado (M-15 do conclave Fable segue: + assinatura_pades_ref, carimbo_tempo_ref). Sem patch SOLID novo aqui.

### 3.5 ⭐ Trilha de boa-fé — cabeça única, hash_ver, campos canônicos [P4][P5][P7][P13][P22]

```sql
-- ============================================================
-- [P5] FONTE ÚNICA DE SEQ + CABEÇA DA CADEIA (single-writer, row-lock)
-- Substitui o MAX(seq_tenant)-via-SELECT do v1.0, que era contador distribuído
-- fingindo ser local (quebra no 1º failover/réplica — B1/K-13).
-- ============================================================
create table core.trilha_cabeca (
  escritorio_id   uuid primary key references core.escritorio(id) on delete restrict,
  seq             bigint not null default 0,     -- último seq emitido para o tenant
  hash            bytea  not null default '\x00',-- hash do último evento (cabeça da cadeia)
  hash_ver        smallint not null default 1,   -- [P4] versão da fórmula de hash da cabeça
  atualizada_em   timestamptz not null default now()
);
comment on table core.trilha_cabeca is
  '[P5] Cabeça da hash-chain por tenant. UMA linha por escritório = fonte única de seq+hash. '
  'O trigger faz SELECT ... FOR UPDATE aqui (row-lock single-writer) — réplica é READ-ONLY para sempre. '
  'Doc 17 v1.1: nunca escrever a trilha de uma réplica.';

create table core.evento_boa_fe (
  id              bigint generated always as identity primary key,
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  seq_tenant      bigint not null,
  hash_ver        smallint not null default 1,   -- [P4] versão da fórmula de canonicalização/hash
  tipo_evento     text not null check (tipo_evento in (
                    'nota_recebida',
                    'analise_executada',
                    'apontamento_gerado',
                    'apontamento_aprovado',
                    'apontamento_rejeitado',
                    'apontamento_retificado',
                    'apontamento_regularizado',   -- M-3
                    'apontamento_escalado',        -- M-3
                    'apontamento_superado',        -- [P6] re-análise superou
                    'decisao_lote',                -- M-3
                    'laudo_emitido',
                    'laudo_substituido',
                    'ajuste_exportado',            -- M-3
                    'base_referencia_atualizada',
                    'ancora_temporal',             -- M-3 (carimbo ACT)
                    'restauracao_sistema',         -- [P13] restore de backup é evento (só o contrato; runbook → doc 17)
                    'xml_expurgado'
                  )),
  ator_tipo       text not null check (ator_tipo in ('usuario','motor','sistema')),
  ator_id         uuid,
  -- [P7] REFERENTE GENÉRICO (idempotência por referente): tipo+id do objeto que o evento descreve
  referente_tipo  text check (referente_tipo in ('nota','apontamento','laudo','base','analise','sistema')),
  referente_id    uuid,
  -- refs específicas mantidas p/ índices/joins quentes:
  nota_id         uuid,
  apontamento_id  uuid references core.apontamento_auditoria(id),
  laudo_id        uuid references core.laudo(id),
  payload         jsonb not null default '{}',
  ocorrido_em     timestamptz not null default now(),
  hash_anterior   bytea not null,
  hash_evento     bytea not null,
  -- [P22] bitemporalidade na DECISÃO: evento 'superado'/'apontamento_superado' DEVE carregar
  --       ambos os eixos no payload (conhecida_em + vigencia) — senão perde-se "o que sabíamos quando decidimos".
  constraint ck_superado_bitemporal check (
    tipo_evento <> 'apontamento_superado'
    or (payload ? 'conhecida_em' and payload ? 'vigencia')
  )
);
comment on table core.evento_boa_fe is
  '⭐ O MOAT. [P4] hash_ver versiona a fórmula; o VERIFICADOR multi-geração é o eterno (não a fórmula). '
  '[P5] seq/hash vêm de core.trilha_cabeca (single-writer). [P7] (referente_tipo,referente_id,tipo_evento) é idempotente. '
  '[P22] eventos de supersedência carregam conhecida_em + vigencia.';
comment on column core.evento_boa_fe.hash_evento is
  '[P4] sha256 de CAMPOS CANÔNICOS NOMEADOS separados por \x1f (unit separator), não payload::text blob. '
  'Fórmula da geração 1 documentada no trigger. Calculado por trigger — nunca pelo app.';

-- [P4][P5] Trigger reescrito: cabeça via FOR UPDATE + canonicalização nomeada com delimitador
create or replace function core.tg_evento_boa_fe_chain()
returns trigger language plpgsql
as $$
declare
  v_prev  bytea;
  v_seq   bigint;
  sep     constant text := chr(31);   -- \x1f unit separator entre campos canônicos [P4]
begin
  -- [P5] cabeça única do tenant com ROW LOCK (single-writer; sem MAX(SELECT), sem advisory lock).
  -- upsert garante a linha-cabeça na 1ª escrita do tenant (gênese).
  insert into core.trilha_cabeca (escritorio_id) values (new.escritorio_id)
    on conflict (escritorio_id) do nothing;

  select seq, hash into v_seq, v_prev
    from core.trilha_cabeca
   where escritorio_id = new.escritorio_id
   for update;                          -- serializa a cadeia do tenant (lock na cabeça, não global)

  new.seq_tenant    := v_seq + 1;
  new.hash_anterior := v_prev;          -- '\x00' no gênese (default da cabeça)
  new.hash_ver      := coalesce(new.hash_ver, 1);
  new.ocorrido_em   := coalesce(new.ocorrido_em, now());

  -- [P4] CAMPOS CANÔNICOS NOMEADOS, ordem fixa, separados por \x1f. Fórmula = hash_ver 1.
  new.hash_evento := digest(
      encode(new.hash_anterior, 'hex')                                            || sep ||
      'escritorio='   || new.escritorio_id::text                                  || sep ||
      'seq='          || new.seq_tenant::text                                     || sep ||
      'hash_ver='     || new.hash_ver::text                                       || sep ||
      'tipo='         || new.tipo_evento                                          || sep ||
      'ator_tipo='    || new.ator_tipo                                            || sep ||
      'ator_id='      || coalesce(new.ator_id::text, '')                          || sep ||
      'ref_tipo='     || coalesce(new.referente_tipo, '')                         || sep ||
      'ref_id='       || coalesce(new.referente_id::text, '')                     || sep ||
      'nota='         || coalesce(new.nota_id::text, '')                          || sep ||
      'apontamento='  || coalesce(new.apontamento_id::text, '')                   || sep ||
      'laudo='        || coalesce(new.laudo_id::text, '')                         || sep ||
      'payload='      || new.payload::text                                        || sep ||
      'ocorrido='     || to_char(new.ocorrido_em at time zone 'UTC',
                                 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
      'sha256');

  -- [P5] avança a cabeça na MESMA tx (single-writer)
  update core.trilha_cabeca
     set seq = new.seq_tenant, hash = new.hash_evento, hash_ver = new.hash_ver, atualizada_em = now()
   where escritorio_id = new.escritorio_id;

  return new;
end $$;
create trigger tg_chain before insert on core.evento_boa_fe
  for each row execute function core.tg_evento_boa_fe_chain();

-- Imutabilidade (igual v1.0): trigger + REVOKE
create trigger tg_immutable before update or delete on core.evento_boa_fe
  for each row execute function app.tg_block_mutation();
revoke update, delete on core.evento_boa_fe from authenticated, anon, service_role;

create unique index uq_evento_seq on core.evento_boa_fe (escritorio_id, seq_tenant);

-- [P7] IDEMPOTÊNCIA POR REFERENTE: um evento de cada tipo por referente (quando aplicável).
-- Parcial: só onde a regra de negócio é "no máximo um" (ex.: laudo_emitido por laudo).
-- Eventos repetíveis (decisao_lote, ancora_temporal) ficam de fora do índice.
create unique index uq_evento_referente on core.evento_boa_fe (referente_tipo, referente_id, tipo_evento)
  where tipo_evento in ('nota_recebida','laudo_emitido','apontamento_aprovado',
                        'apontamento_rejeitado','apontamento_regularizado','apontamento_superado');
```

> **Nota de design (P4/P5):** a fórmula do hash é versionada (`hash_ver`), mas o que defende em 2031 é o **verificador multi-geração** (CLI standalone — P16, doc 17 v1.1), que sabe recomputar cada geração. A cabeça única (`trilha_cabeca`) elimina a corrida do `MAX(SELECT)`: no failover, a réplica promovida lê o último `seq`/`hash` materializados, sem janela de duplicação. **Réplica é read-only para sempre.**

### 3.6 Análise executada — proveniência computacional contratada [P2]

```sql
-- ⭐ [P2] Materializa o evento 'analise_executada' com TODOS os campos de proveniência
-- computacional JÁ na F1. Null enquanto for só-regras; populam quando o RAG entrar.
-- Contrato de dados não se back-filla num ledger append-only (C5).
create table core.analise_execucao (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  item_id         uuid not null references core.nota_item(id) on delete restrict,
  motor_versao_id uuid not null references ref.motor_versao(id),  -- [P1]
  base_versao_id  uuid references ref.base_versao(id),
  tipo_inferencia text not null
                  check (tipo_inferencia in ('humano_concierge','regra_deterministica','rag')),  -- [P1]
  -- proveniência computacional (null até o RAG; CONTRATO nasce na F1):
  prompt_hash     bytea,                          -- [P2] hash do prompt exato enviado ao LLM
  embedding_modelo text,                          -- [P2] modelo de embedding usado no retrieval
  retrieval_set   jsonb not null default '[]',    -- [P2] [{regra_id, score, rank}] recuperados
  resposta_bruta  jsonb,                          -- [P2] saída crua do LLM (auditoria forense)
  params          jsonb not null default '{}',    -- temperatura, top_k, etc.
  executada_em    timestamptz not null default now(),
  -- [P6] uma execução por (item, motor, base) — retry não duplica
  constraint uq_analise unique (item_id, motor_versao_id, base_versao_id)
);
comment on table core.analise_execucao is
  '[P2] Proveniência computacional de cada análise (o lado-máquina do que apontamento é o lado-decisão). '
  'Campos de RAG nullable até o RAG existir, mas o CONTRATO nasce na F1 — append-only não aceita back-fill de schema. '
  '[P1] motor_versao_id NOT NULL liga a inferência à versão exata do motor.';

create trigger tg_immutable before update or delete on core.analise_execucao
  for each row execute function app.tg_block_mutation();  -- proveniência é imutável
```

### 3.6 Base de referência cClassTrib — inalterada vs v1.0 §3.6 (base_versao + cclasstrib_regra com vigência). M-4 (camada oficial/licenciada/curadoria) e M-5 (lookup pelo fato gerador) do conclave Fable seguem.

### 3.7 ⭐ [P1] Motor versionado + [P23] golden-set versionado (schema `ref`)

```sql
-- ============================================================
-- [P23] GOLDEN-SET VERSIONADO — a 3ª perna da reprodutibilidade (base + motor + EVAL)
-- ============================================================
create table ref.golden_set_versao (
  id              uuid primary key default gen_random_uuid(),
  rotulo          text not null unique,          -- 'golden-2026.06-v1'
  descricao       text,
  n_exemplos      integer not null default 0,
  hash_snapshot   bytea not null,                -- sha256 do conjunto de exemplos congelado
  congelada_em    timestamptz not null default now(),
  status          text not null default 'ativo' check (status in ('rascunho','ativo','superado'))
);
comment on table ref.golden_set_versao is
  '[P23] Snapshot IMUTÁVEL do golden-set. O eval que liberou o motor vX referencia ESTE snapshot — '
  'quando o vX+1 é avaliado contra um set maior, o set que liberou o vX não evapora (B8/Fowler). Append-only.';
create trigger tg_immutable before update or delete on ref.golden_set_versao
  for each row execute function app.tg_block_mutation();

-- ============================================================
-- ⭐ [P1] MOTOR COMO ENTIDADE VERSIONADA (não string num jsonb)
-- ============================================================
create table ref.motor_versao (
  id                    uuid primary key default gen_random_uuid(),
  rotulo                text not null unique,            -- 'motor-2026.06-rc3'
  codigo_versao         text not null,                   -- [P1] git-sha do código do motor
  regras_pacote_hash    bytea not null,                  -- [P1] hash do pacote de regras determinísticas
  modelo_llm            text,                            -- [P1] id do LLM (null se só-regras)
  prompt_hash           bytea,                           -- [P1] hash do template de prompt
  embedding_modelo      text,                            -- [P1] modelo de embedding do RAG
  params                jsonb not null default '{}',     -- [P1] hiperparâmetros (temperatura, top_k...)
  golden_set_versao_id  uuid references ref.golden_set_versao(id),  -- [P1][P23] eval que liberou
  hash_manifesto        bytea not null,                  -- [P1] hash de TUDO acima (identidade canônica do motor)
  tipo_inferencia       text not null
                        check (tipo_inferencia in ('humano_concierge','regra_deterministica','rag')),
  status                text not null default 'rascunho'
                        check (status in ('rascunho','vigente','superado')),
  criada_em             timestamptz not null default now()
);
comment on table ref.motor_versao is
  '[P1] O motor é ENTIDADE versionada. Anatomia completa: código (git-sha) + regras-hash + LLM + prompt-hash + '
  'embedding + params + golden-set + hash_manifesto. apontamento.motor_versao_id e analise_execucao.motor_versao_id '
  'apontam pra cá (NOT NULL). hash_manifesto = identidade canônica reproduzível.';
comment on column ref.motor_versao.hash_manifesto is
  '[P1] sha256(codigo_versao ‖ regras_pacote_hash ‖ modelo_llm ‖ prompt_hash ‖ embedding_modelo ‖ params ‖ golden_set). '
  'Dois motores com o mesmo manifesto SÃO o mesmo motor. É a chave de reprodutibilidade da DECISÃO.';
create trigger tg_immutable before update or delete on ref.motor_versao
  for each row execute function app.tg_block_mutation();  -- versão de motor é imutável

-- Semente C0 (Concierge): motor "humano" para o apontamento manual referenciar (P17/doc 17)
insert into ref.motor_versao (rotulo, codigo_versao, regras_pacote_hash, hash_manifesto, tipo_inferencia, status)
values ('motor-c0-concierge-humano', 'manual', '\x00', digest('motor-c0-concierge-humano','sha256'),
        'humano_concierge', 'vigente')
on conflict (rotulo) do nothing;
-- [P1] No C0 o apontamento é humano_concierge, mas FK NOT NULL exige uma linha de motor — esta é ela.

-- ============================================================
-- [P9] ref.ecac_servico_map — traduz códigos SERPRO na BORDA (dialeto fora do core)
-- ============================================================
create table ref.ecac_servico_map (
  codigo_serpro   text primary key,              -- '00006','00002'...
  nome            text not null,
  exige_outorga   boolean not null default true,
  custo_centavos_ref integer,
  notas           text
);
comment on table ref.ecac_servico_map is
  '[P9] Mapa de serviços do Integra Contador (SERPRO). Tradução do dialeto do fornecedor mora aqui, '
  'não espalhada no core. Consumida pelo schema ecac.* na borda.';
```

### 3.8 [P11] Estado de adoção de base por tenant

```sql
-- ⭐ [P11] core.base_adocao — o evento 'base_referencia_atualizada' já PRESSUPÕE este estado.
create table core.base_adocao (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  base_versao_id  uuid not null references ref.base_versao(id),
  adotada_em      timestamptz not null default now(),  -- quando ESTE tenant passou a usar a versão
  status          text not null default 'vigente'
                  check (status in ('vigente','superada')),
  created_at      timestamptz not null default now(),
  unique (escritorio_id, base_versao_id)
);
comment on table core.base_adocao is
  '[P11] Estado de adoção de base de referência POR TENANT. A versão é global (ref.base_versao); '
  'QUANDO cada escritório passou a usá-la é tenant-scoped — é o que o evento base_referencia_atualizada registra.';

create trigger tg_upd_marker before update on core.base_adocao
  for each row execute function app.tg_set_updated_at();  -- (coluna updated_at se necessária; ver nota)
-- NB: base_adocao só transiciona vigente→superada; sem updated_at no v1.0-style. Trigger acima é opcional —
--     removível se a tabela ficar append-mostly. Mantido alinhado ao padrão das outras tabelas core.
```

---

## 4. Dialeto do provider — schema `ingestao` [P9]

```sql
-- ============================================================
-- [P9] MIGRATION ingestao (Fase 2) — TUDO que é dialeto do fornecedor SAI do core
-- ============================================================
create table ingestao.provider_conexao (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,  -- ingestao→core OK [P8]
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  provider        text not null check (provider in ('plugnotas','focus')),
  provider_ref    text not null,
  cert_fingerprint text,                          -- S7: só metadado, nunca custódia
  cert_validade   date,
  cert_status     text check (cert_status in ('valido','expirando','expirado','revogado','ausente')),
  ultimo_heartbeat timestamptz,
  ultimo_nsu      text,                           -- [P9] NSU mora AQUI, não em core.nota
  provider_meta   jsonb not null default '{}',    -- [P9] dialeto do fornecedor mora AQUI
  captura_ativa   boolean not null default false, -- M-9 (captura seletiva)
  status          text not null default 'ativa'
                  check (status in ('ativa','pausada','erro','encerrada')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (escritorio_id, cliente_id, provider)
);
comment on table ingestao.provider_conexao is
  '[P9] Conexão de captura comprada. Movida de core.* para ingestao.* — o core não conhece o fornecedor. '
  'provider_meta/ultimo_nsu (dialeto) vivem aqui. Certificado: metadado de saúde apenas (S7/D2).';

create table ingestao.ingestao_evento (
  id              bigint generated always as identity primary key,
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  provider        text not null,
  dedup_key       text not null,
  payload         jsonb not null,                 -- webhook bruto (dialeto do provider)
  status          text not null default 'recebido'
                  check (status in ('recebido','processado','duplicado','erro')),
  erro            text,
  tentativas      smallint not null default 0,
  recebido_em     timestamptz not null default now(),
  processado_em   timestamptz,
  unique (escritorio_id, provider, dedup_key)
);
comment on table ingestao.ingestao_evento is
  '[P9] Staging de ingestão (Werner: everything fails). Webhook do provider cai aqui (dialeto bruto); '
  'worker traduz para core.nota NEUTRA (origem=provider) + core.evento_boa_fe. O core recebe nota limpa.';
```

---

## 5. e-CAC e billing — schemas próprios [P9]

```sql
-- ============================================================
-- [P9] schema ecac (add-on) — migration própria, não bloqueia o core
-- ============================================================
create table ecac.procuracao (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,  -- ecac→core OK
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  codigo_serpro   text not null references ref.ecac_servico_map(codigo_serpro),  -- M-8 (por serviço)
  outorgada_em    date not null,
  validade        date not null,
  status          text not null default 'ativa'
                  check (status in ('ativa','vencida','revogada')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
  -- M-8: SEM unique(escritorio,cliente) — procuração é POR SERVIÇO
);
comment on table ecac.procuracao is
  '[P9][M-8] Procuração RFB por serviço (código SERPRO). Movida de core.procuracao_eletronica → ecac.*. '
  'Habilita o Integra Contador server-side (D2). Metadados da outorga, nunca credencial.';

create table ecac.consulta (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  procuracao_id   uuid not null references ecac.procuracao(id),  -- M-8 (FK NOT NULL: consulta cita a outorga)
  tipo_consulta   text not null check (tipo_consulta in
                    ('caixa_postal','situacao_fiscal','cnd_federal','cnd_fgts',
                     'cnd_trabalhista','cnd_estadual','pgfn','declaracoes_ausentes','outro')),
  origem          text not null default 'serpro' check (origem in ('serpro','infosimples')),
  requisicao      jsonb not null default '{}',
  resposta        jsonb,
  status          text not null default 'ok' check (status in ('ok','erro','timeout')),
  custo_centavos  integer not null default 0 check (custo_centavos >= 0),
  consultado_em   timestamptz not null default now(),
  valido_ate      timestamptz not null
);
comment on table ecac.consulta is
  '[P9] Cache + ledger de custo do Integra Contador. Movida de core.ecac_consulta → ecac.*. '
  '[M-8] procuracao_id NOT NULL: consulta pós-revogação = CTN 198 + COGS SERPRO na mesma coluna.';

create index ix_ecac_cache on ecac.consulta (escritorio_id, cliente_id, tipo_consulta, consultado_em desc);
create index ix_ecac_custo on ecac.consulta (escritorio_id, consultado_em);

-- ============================================================
-- [P9] schema billing — metering/assinatura (M-10) + VIEW de medição como CONTRATO versionado
-- ============================================================
create table billing.assinatura (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  plano           text not null check (plano in ('concierge','starter','pro','scale')),
  franquia_notas  integer not null default 0,
  preco_excedente_centavos integer not null default 0,
  status          text not null default 'ativa' check (status in ('ativa','suspensa','cancelada')),
  vigente_desde   date not null default current_date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table billing.consumo_mensal (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  competencia     date not null check (competencia = date_trunc('month', competencia)),
  notas_auditadas integer not null default 0,
  franquia        integer not null default 0,
  excedente       integer not null default 0,
  fechado_em      timestamptz,
  unique (escritorio_id, competencia)
);
comment on table billing.consumo_mensal is '[P9][M-10] Metering D7. Fechado por job mensal a partir da view de medição.';

-- ⭐ [P9] CONTRATO VERSIONADO DE MEDIÇÃO. A definição de "nota auditada para faturar" vive AQUI,
-- não na máquina de estados do core. Estados novos do Heleno (regularizado/superado) não podem
-- mudar a métrica de cobrança sem um bump explícito desta view (B11 — vazamento reverso do billing).
create or replace view billing.nota_auditada_para_billing as
  -- CONTRATO v1: nota auditada = nota com ≥1 apontamento REVISADO (aprovado/rejeitado/regularizado)
  --              na competência. 'superado' NÃO conta (re-análise não é nova cobrança).
  select n.escritorio_id,
         n.competencia,
         count(distinct n.id) as notas_auditadas
    from core.nota n
    join core.nota_item ni on ni.nota_id = n.id and ni.competencia = n.competencia
    join core.apontamento_auditoria a on a.item_id = ni.id
   where a.status in ('aprovado','rejeitado','regularizado')  -- contrato explícito
   group by n.escritorio_id, n.competencia;
comment on view billing.nota_auditada_para_billing is
  '[P9][B11] CONTRATO DE MEDIÇÃO v1 (versionado). Mudar esta definição = mudar a fatura → exige bump de versão '
  'e aviso. Isola a métrica de cobrança da evolução da máquina de estados do core.';
```

---

## 6. Grants por módulo + RLS — porta lateral fechada [P15][P20]

```sql
-- ============================================================
-- [P20] ROLES POSTGRES POR MÓDULO (grant por schema)
-- ============================================================
create role core_rw    nologin;   -- escrita do core: SÓ as RPCs security definer assumem
create role gestao_rw  nologin;
create role motor      nologin;   -- [P15] o motor
create role billing_ro nologin;

-- [P15] O MOTOR NÃO ESCREVE NO CORE. Lê referência e core; escreve SÓ via RPC (EXECUTE).
grant usage on schema ref, core to motor;
grant select on all tables in schema ref to motor;
grant select on core.nota, core.nota_item to motor;
-- SEM grant de INSERT/UPDATE/DELETE em core.* para motor. A RPC (security definer) é o único caminho.
-- grant execute on function core.registrar_apontamento(...) to motor;  -- F1, quando a RPC existir

-- billing só lê
grant usage on schema billing, core to billing_ro;
grant select on all tables in schema billing to billing_ro;

-- ============================================================
-- [P20] RLS — escrita de apontamento SÓ via RPC. SEM policy de UPDATE direto.
-- ============================================================
alter table core.apontamento_auditoria enable row level security;

create policy p_sel on core.apontamento_auditoria for select to authenticated
  using (escritorio_id = app.current_escritorio_id());

-- [P20] policy de UPDATE direto REMOVIDA (era p_upd_revisao no v1.0).
-- authenticated NÃO faz UPDATE nesta tabela. A RPC core.aprovar_apontamento (security definer)
-- valida papel='contador'+CRC (M-1), escreve estado E evento na mesma tx, e a constraint trigger
-- tg_apont_exige_evento (§3.3) aborta qualquer UPDATE sem evento. Porta lateral do PostgREST morta.
revoke insert, update, delete on core.apontamento_auditoria from authenticated, anon;

-- evento_boa_fe: SELECT do tenant; INSERT só via RPC/security definer; UPDATE/DELETE inexistem (v1.0 Padrão 4)
alter table core.evento_boa_fe enable row level security;
create policy p_sel on core.evento_boa_fe for select to authenticated
  using (escritorio_id = app.current_escritorio_id());

-- trilha_cabeca: NUNCA acessível via API (estado interno do trigger). Sem policy = sem acesso.
alter table core.trilha_cabeca enable row level security;
revoke all on core.trilha_cabeca from authenticated, anon;
comment on table core.trilha_cabeca is
  '[P5][P20] Estado interno do hash-chain. Sem policy RLS = inacessível via PostgREST. '
  'Só o trigger (definer) e jobs (service_role) tocam.';

-- demais padrões (1,5,6) idênticos ao v1.0 §6.
-- [P8] gestao.* mantém RLS por escritorio_id; FKs gestao→core OK; nenhuma FK core→gestao existe.
```

---

## 7. Camada Gestão — fim do ciclo core→gestao [P8]

```sql
-- ============================================================
-- [P8] gestao.departamento + N:N usuario_departamento (substitui core.usuario.departamento_id)
-- ============================================================
create table gestao.departamento (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,  -- gestao→core OK
  nome            text not null,
  created_at      timestamptz not null default now(),
  unique (escritorio_id, nome)
);

-- ⭐ [P8] N:N: o vínculo usuário↔departamento mora EM gestao (gestao→core permitida),
-- nunca o contrário. Não existe mais FK core.usuario→gestao.departamento.
create table gestao.usuario_departamento (
  usuario_id      uuid not null references core.usuario(id) on delete cascade,       -- gestao→core OK
  departamento_id uuid not null references gestao.departamento(id) on delete cascade,
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,   -- denorm. RLS
  principal       boolean not null default false,  -- depto principal do usuário (substitui o 1:1 antigo)
  created_at      timestamptz not null default now(),
  primary key (usuario_id, departamento_id)
);
comment on table gestao.usuario_departamento is
  '[P8] Vínculo usuário↔departamento. Mata o ciclo core→gestao (era core.usuario.departamento_id). '
  'gestao referencia core; core NUNCA referencia gestao = ACL contra o Gestorize (B6): se o Spike 5 '
  'trouxer dívida do legado, ela contamina gestao, não a tabela de identidade do moat.';

-- demais tabelas de gestao (obrigacao_modelo, obrigacao, guia, tarefa, alvara_certidao, tag,
-- cliente_tag, documento, documento_feedback, envio): idênticas ao v1.0 §4, EXCETO:
--   - obrigacao_modelo.departamento_id e tarefa.departamento_id continuam (gestao→gestao, OK)
--   - NENHUMA tabela core referencia gestao.* (FF-2 do conclave: pg_catalog deve retornar 0 FK core→gestao)
```

**[P8] Fitness function (doc 17 v1.1 / P21 — gate de CI):**
```sql
-- FF-2: zero FK de core.* apontando para gestao.* (deve retornar 0 linhas, senão CI falha)
select conrelid::regclass as tabela_core, confrelid::regclass as aponta_para
  from pg_constraint
 where contype = 'f'
   and connamespace = 'core'::regnamespace
   and confrelid::regclass::text like 'gestao.%';
```

---

## 8. Resumo das mudanças por seção (mapa rápido)

| Seção | v1.0 | v1.1 |
|-------|------|------|
| Schemas | core/gestao/ref/app | + ingestao, ecac, billing [P9] |
| `core.usuario` | tem `departamento_id` (FK→gestao) | sem `departamento_id`; +cpf/crc (M-1); vínculo em gestao.usuario_departamento [P8] |
| `core.nota` | chave_acesso NOT NULL | chave_acesso nullable + chave_dedup; competencia_fiscal; origem neutra [P9][P12] |
| `apontamento` | sem motor; UPDATE via policy | +motor_versao_id +tipo_inferencia; estados superado; uq_apont_dedup; UPDATE só RPC [P1][P6][P20] |
| trilha seq | MAX(seq_tenant)+advisory lock | core.trilha_cabeca single-writer [P5] |
| hash | payload::text blob | campos canônicos nomeados + \x1f + hash_ver [P4] |
| análise | só no payload do evento | core.analise_execucao com proveniência computacional [P2] |
| motor | string em jsonb | ref.motor_versao entidade [P1] |
| golden-set | core.golden_exemplo (sem versão) | + ref.golden_set_versao snapshot + FK [P23] |
| provider | core.provider_conexao | ingestao.provider_conexao [P9] |
| e-CAC | core.procuracao/ecac_consulta | ecac.procuracao/ecac.consulta [P9] |
| billing | (ausente) | billing.* + view-contrato [P9] |
| evento `superado` | (ausente) | bitemporal: conhecida_em+vigencia [P22] |

---

— Dara (@data-engineer) · 2026-06-15 · v1.1 = v1.0 + 23 patches SOLID ratificados. Cada DDL carrega seu `-- [Pxx]`. Decisões não-DDL (P3/P14/P16/P17/P19/P21) ficam no doc 17 v1.1. Recomendo `db-rls-audit` + rodar a FF-2 no CI antes da migration 001.
