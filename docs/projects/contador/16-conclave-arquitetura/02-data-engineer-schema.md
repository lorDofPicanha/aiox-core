# Modelo de Dados v1.0 — Core "Apuração Defensável" (Contador)

> **Autor:** Dara (@data-engineer) · **Data:** 2026-06-11 · **Status:** Proposta para validação do conclave
> **Base:** `00-context/CONTEXT.md` (D1-D9), `10-prd-core-ciclo-nota-fiscal.md`, `11-arquitetura-core.md` §4 (esboço v0.1 — **corrigido aqui**: `certificado_ref` do esboço mencionava "A1 vive no agente local"; a D2 revertida manda modelar o certificado como **metadado do provider**, nunca custódia nossa), `_tmp-comparativo-dump.txt` (23 features Gestorize), `14-concierge-mvp-spec.md` (dia-0 manual).
> **Stack-alvo:** PostgreSQL 15+ / Supabase (RLS, Storage, pgmq/pg-boss, pgvector).
> ⚠️ Consulta aos mind clones (martin-fowler/chip-huyen) indisponível nesta sessão (brain-bridge offline) — design ancorado nas posições deles já registradas no conclave de 10/Jun (`11-arquitetura-core.md` §6, `13-conclave-validacao-features.md`). Recomendo revisão com os clones antes da migration 001 ir pra produção.

---

## 0. Decisões de schema (sumário)

| # | Decisão | Racional curto |
|---|---------|----------------|
| S1 | **Tenant raiz = `escritorio`**, `escritorio_id uuid NOT NULL` **denormalizado em TODA tabela tenant-scoped** | RLS barata (sem join na policy), índices compostos naturais. Denormalização documentada (3NF violada de propósito). |
| S2 | **4 schemas Postgres**: `core` (fiscal/moat) · `gestao` (Gestorize) · `ref` (bases públicas, sem tenant) · `app` (helpers) | Fronteira de módulo física (D1: Gestão é módulo separado, mesmo tenant). `ref` fica fora de RLS — cClassTrib não é dado pessoal. |
| S3 | **`core.evento_boa_fe` = append-only com hash-chain por tenant** (event-sourcing leve) | O moat. Imutabilidade tripla: REVOKE UPDATE/DELETE + trigger bloqueante + hash encadeado verificável. |
| S4 | **`ref.cclasstrib_regra` versionada por snapshot (`base_versao`) + vigência `daterange` por competência** com EXCLUDE anti-sobreposição | Mesmo NCM muda de cClassTrib 2026→2033. Laudo referencia (versao, regra) exatos = reproduzível. |
| S5 | **`core.nota` particionada por RANGE(competencia), partições anuais, desde o dia 0** | 15 anos de retenção; migrar tabela viva pra particionada depois é a migration mais cara que existe. UNIQUE inclui a partition key (competência é derivável da chave de acesso). |
| S6 | **Idempotência = `UNIQUE (escritorio_id, chave_acesso, competencia)`** + staging `core.ingestao_evento` (Fase 2) | Reenvio do provider/upload = no-op (`ON CONFLICT DO NOTHING`). |
| S7 | **Certificado A1: NUNCA bytes, NUNCA custódia.** `core.provider_conexao` guarda só fingerprint/validade/status reportados pelo provider (DPA/Art. 39) | D2. Não existe coluna capaz de receber um PFX em lugar nenhum do schema. |
| S8 | **XML em Supabase Storage** (bucket `xml-fiscal`, path `{escritorio_id}/{cnpj}/{aaaa}/{mm}/{chave}.xml`) + `xml_hash` sha256 na nota | Banco guarda ponteiro+hash (integridade pra trilha); Storage tem RLS própria por prefixo de tenant. |
| S9 | **Humano-no-loop como constraint**: `apontamento_auditoria.status` com transições guardadas por trigger; aprovação/rejeição exige `revisor_id` e gera evento na trilha | D8. O banco impede laudo sem revisor. |
| S10 | **pgvector no próprio Postgres** para o RAG cClassTrib (Fase 1) | Base de regras é pequena (10³-10⁴ linhas); vector DB dedicado é overkill (KISS, A4 do doc 11). |
| S11 | **Fila: nada no dia 0 → pgmq (Supabase Queues) na Fase 2**; pg-boss só se nascer worker Node dedicado | pg-boss exige conexão session-mode (LISTEN/NOTIFY quebra no pooler transaction-mode do Supabase). Ver §10.2. |
| S12 | **`DocumentFeedback` (Documentize) é insumo, não o golden-set**: `core.golden_exemplo` é tabela própria curada, alimentada por feedback + revisões humanas | Golden-set precisa de curadoria (Chip); feedback cru tem ruído. |

---

## 1. Diagrama de entidades (visão)

```
ref.* (global, read-only p/ tenants, SEM RLS)
  base_versao ──< cclasstrib_regra ──< cclasstrib_embedding (F1, pgvector)

core.* (tenant-scoped, RLS por escritorio_id)
  escritorio ─┬─< usuario (papel)
              ├─< cliente (CNPJ, regime) ─┬─< nota (particionada) ──< nota_item ──< apontamento_auditoria >── ref.cclasstrib_regra
              │                           ├─< laudo (hash, white-label)
              │                           ├─< procuracao_eletronica (add-on e-CAC)
              │                           └─< ecac_consulta (cache + custo)
              ├─< provider_conexao (F2 — metadado do cert, nunca custódia)
              ├─< ingestao_evento (F2 — staging idempotente)
              ├─< golden_exemplo (F1)
              ├─< evento_boa_fe ⭐ (append-only, hash-chain)   ← o moat
              └─< audit_log (LGPD, append-only)

gestao.* (tenant-scoped, mesmo tenant, módulo separado — D1)
  departamento · obrigacao_modelo ──< obrigacao ──< guia
  tarefa · alvara_certidao · tag/cliente_tag
  documento (Documentize) ──< documento_feedback → alimenta core.golden_exemplo
  envio (guias/docs por email/área VIP)
```

---

## 2. Fundação: extensões, schemas, helpers

```sql
-- ============================================================
-- MIGRATION 000 — fundação
-- ============================================================
create extension if not exists pgcrypto;      -- digest() p/ hash-chain
create extension if not exists btree_gist;    -- EXCLUDE de vigência
create extension if not exists citext;        -- e-mail case-insensitive
-- create extension if not exists vector;     -- FASE 1 (pgvector)
-- pgmq via dashboard Supabase                -- FASE 2

create schema if not exists core;    -- ciclo da nota / moat
create schema if not exists gestao;  -- camada Gestorize (D1)
create schema if not exists ref;     -- bases de referência públicas (sem tenant)
create schema if not exists app;     -- funções utilitárias

comment on schema core   is 'Core fiscal: nota, auditoria, trilha de boa-fé, laudo. Tenant-scoped + RLS.';
comment on schema gestao is 'Camada Gestão (Gestorize estendido): obrigações, guias, tarefas, documentos. Mesmo tenant, módulo separado (D1).';
comment on schema ref    is 'Bases de referência (cClassTrib/NCM). Dados públicos, globais, SEM RLS — só leitura para tenants.';

-- ------------------------------------------------------------
-- Tenant do JWT (Supabase: escritorio_id em app_metadata,
-- gravado no signup/convite via service_role — usuário não edita)
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
  'Tenant da sessão, lido do claim app_metadata.escritorio_id do JWT Supabase. NULL fora de sessão autenticada.';

create or replace function app.current_papel()
returns text language sql stable
as $$
  select current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'papel'
$$;

-- updated_at automático
create or replace function app.tg_set_updated_at()
returns trigger language plpgsql
as $$ begin new.updated_at := now(); return new; end $$;

-- Bloqueio de mutação (tabelas append-only)
create or replace function app.tg_block_mutation()
returns trigger language plpgsql
as $$ begin
  raise exception 'Tabela %.% é append-only (imutável por design — trilha de boa-fé/LGPD)',
    tg_table_schema, tg_table_name;
end $$;
```

---

## 3. (A) Schema multi-tenant — núcleo `core`

### 3.1 Tenant raiz, usuários, clientes

```sql
-- ============================================================
-- MIGRATION 001 — dia 0 (Concierge)
-- ============================================================

create table core.escritorio (
  id              uuid primary key default gen_random_uuid(),
  razao_social    text not null,
  cnpj            char(14) not null unique
                  check (cnpj ~ '^[0-9]{14}$'),
  crc             text,                          -- registro no conselho (white-label do laudo)
  marca           jsonb not null default '{}',   -- logo/cores p/ laudo white-label (Concierge §4.6)
  plano           text not null default 'concierge'
                  check (plano in ('concierge','starter','pro','scale')),  -- D7: tiers por nota auditada
  status          text not null default 'ativo'
                  check (status in ('ativo','suspenso','encerrado')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table core.escritorio is
  'TENANT RAIZ. O escritório contábil (o canal). Todo dado tenant-scoped referencia escritorio_id.';
comment on column core.escritorio.plano is
  'D7: value metric = nota auditada/mês. A medição vem de core.apontamento/laudo, não daqui — aqui só o tier contratado.';

create trigger tg_upd before update on core.escritorio
  for each row execute function app.tg_set_updated_at();

-- ------------------------------------------------------------
create table core.usuario (
  id              uuid primary key,              -- = auth.users.id (Supabase Auth)
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  nome            text not null,
  email           citext not null,
  papel           text not null default 'analista'
                  check (papel in ('admin','gestor','analista','leitura')),
  departamento_id uuid,                          -- FK adicionada na migration da camada gestao
  ativo           boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (escritorio_id, email)
);
comment on table core.usuario is
  'Perfil do colaborador (espelha auth.users 1:1). Papel único por usuário (KISS dia-0; multi-papel = tabela usuario_papel futura, trade-off §10.5). É o "Cadastro de Colaboradores" do Gestorize também.';
comment on column core.usuario.papel is
  'admin: gerencia tenant/billing · gestor: dashboards+aprova · analista: revisa auditoria (humano-no-loop) · leitura: consulta.';

create trigger tg_upd before update on core.usuario
  for each row execute function app.tg_set_updated_at();

-- ------------------------------------------------------------
create table core.cliente (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cnpj            char(14) not null check (cnpj ~ '^[0-9]{14}$'),
  razao_social    text not null,
  nome_fantasia   text,
  regime          text not null
                  check (regime in ('mei','simples','presumido','real')),
  setor           text,                          -- farmácia/posto/mercado — prioriza alto-SKU (PRD §5.2)
  uf              char(2),
  municipio_ibge  char(7),                       -- NFS-e Nacional usa código IBGE
  alto_sku        boolean not null default false,
  status          text not null default 'ativo'
                  check (status in ('prospect','ativo','pausado','encerrado')),
  onboarding      jsonb not null default '{}',   -- checklist de implantação
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz,                   -- soft-delete: cliente sai, notas ficam (retenção legal)
  unique (escritorio_id, cnpj)
);
comment on table core.cliente is
  'Empresa atendida pelo escritório (cliente final indireto). O escritório é CONTROLADOR dos dados dela; nós somos OPERADOR (DPA).';
comment on column core.cliente.deleted_at is
  'Soft-delete. Hard-delete proibido enquanto houver nota dentro do prazo de guarda legal (§7.3).';

create trigger tg_upd before update on core.cliente
  for each row execute function app.tg_set_updated_at();
```

### 3.2 Nota (particionada) e itens

```sql
create table core.nota (
  id              uuid not null default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  competencia     date not null
                  check (competencia = date_trunc('month', competencia)),  -- sempre dia 1
  tipo            text not null check (tipo in ('nfe','nfce','nfse','cte','mdfe')),
  direcao         text not null check (direcao in ('compra','venda')),
  chave_acesso    text not null check (length(chave_acesso) between 40 and 54),
                  -- NF-e/CT-e = 44 dígitos; NFS-e Nacional = 50. Validação fina no app.
  numero          text,
  serie           text,
  emitida_em      date not null,
  emitente_cnpj   char(14) not null,
  destinatario_doc text,                         -- CNPJ ou CPF (NFC-e) — PII! ver §7.2
  valor_total     numeric(15,2) not null check (valor_total >= 0),
  origem          text not null check (origem in ('upload','documentize','provider','manual')),
                  -- dia-0: upload/documentize/manual · Fase 2: provider
  provider_meta   jsonb,                         -- NSU, manifestação, ids do provider (F2)
  xml_storage_path text,                         -- ponteiro Supabase Storage (§7.1); NULL só em 'manual'
  xml_hash        bytea,                         -- sha256 do XML — integridade p/ trilha de boa-fé
  status_auditoria text not null default 'nao_analisada'
                  check (status_auditoria in ('nao_analisada','em_analise','analisada','sem_divergencia')),
  capturada_em    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  primary key (id, competencia),
  -- ⭐ IDEMPOTÊNCIA: reenvio da mesma nota = no-op (ON CONFLICT DO NOTHING).
  -- Competência na unique por exigência do particionamento; é DERIVÁVEL da
  -- chave de acesso (posições AAMM) → dedup continua determinístico.
  unique (escritorio_id, chave_acesso, competencia)
) partition by range (competencia);

comment on table core.nota is
  'Documento fiscal. PARTICIONADA por ano de competência (15 anos de retenção legal — §7.3, §10.3). XML não fica aqui: ponteiro + hash (S8). Acesso SEMPRE via tabela-pai (RLS aplica no pai; grants diretos nas partições são revogados).';
comment on column core.nota.xml_hash is
  'sha256 do XML bruto. Entra no payload do evento de boa-fé "nota_recebida" → prova que o laudo analisou ESTE arquivo.';

-- Partições anuais (job/migration cria a do ano seguinte em dezembro)
create table core.nota_2021 partition of core.nota for values from ('2021-01-01') to ('2022-01-01');
create table core.nota_2022 partition of core.nota for values from ('2022-01-01') to ('2023-01-01');
create table core.nota_2023 partition of core.nota for values from ('2023-01-01') to ('2024-01-01');
create table core.nota_2024 partition of core.nota for values from ('2024-01-01') to ('2025-01-01');
create table core.nota_2025 partition of core.nota for values from ('2025-01-01') to ('2026-01-01');
create table core.nota_2026 partition of core.nota for values from ('2026-01-01') to ('2027-01-01');
create table core.nota_2027 partition of core.nota for values from ('2027-01-01') to ('2028-01-01');
-- 2021-2025 existem por causa da RECUPERAÇÃO retroativa 5 anos (D6/isca).

create trigger tg_upd before update on core.nota
  for each row execute function app.tg_set_updated_at();

-- ------------------------------------------------------------
create table core.nota_item (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict, -- denorm. p/ RLS (S1)
  nota_id         uuid not null,
  competencia     date not null,                 -- carrega a partition key p/ a FK composta
  foreign key (nota_id, competencia) references core.nota(id, competencia) on delete cascade,
  n_item          smallint not null check (n_item > 0),
  descricao       text not null,
  codigo_produto  text,
  ean             text,
  ncm             char(8) check (ncm ~ '^[0-9]{8}$'),
  cfop            char(4),
  -- tributação APLICADA (como veio no XML) — o que será comparado com a referência
  cclasstrib_aplicado text,
  cst_aplicado    jsonb not null default '{}',   -- {icms, pis, cofins, ibs, cbs} flexível na transição 26-33
  quantidade      numeric(15,4) not null,
  valor_unitario  numeric(15,6) not null,
  valor_total     numeric(15,2) not null,
  tributos        jsonb not null default '{}',   -- valores destacados por tributo
  created_at      timestamptz not null default now(),
  unique (nota_id, competencia, n_item)
);
comment on table core.nota_item is
  'Item da nota = unidade de auditoria ("quanto mais SKU, melhor"). cst_aplicado/tributos em jsonb: o conjunto de campos muda ao longo da transição 2026-2033 — schema rígido aqui quebraria a cada NT da Receita.';
```

### 3.3 Apontamento de auditoria (humano-no-loop)

```sql
create table core.apontamento_auditoria (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  item_id         uuid not null references core.nota_item(id) on delete restrict,
  -- proveniência da regra (S4): laudo reproduzível
  base_versao_id  uuid references ref.base_versao(id),       -- NULL apenas em origem='manual' (Concierge)
  regra_id        uuid references ref.cclasstrib_regra(id),
  origem          text not null default 'manual'
                  check (origem in ('manual','motor')),       -- dia-0: manual · Fase 1: motor
  tipo_divergencia text not null
                  check (tipo_divergencia in
                    ('cclasstrib_divergente','ncm_suspeito','monofasico_tributado',
                     'aliquota_divergente','cst_divergente','credito_potencial','outro')),
  cclasstrib_referencia text,
  campo_corrigir  text,                          -- "o campo exato a corrigir" (estilo Analisador Fortes)
  descricao       text not null,                 -- linguagem "indício", NUNCA "garantido" (constraint nº4)
  valor_envolvido numeric(15,2),                 -- "R$X em divergência POTENCIAL"
  confianca       numeric(4,3) check (confianca between 0 and 1),
  banda_confianca text not null default 'disputado'
                  check (banda_confianca in ('alta','media','baixa','disputado')),
                  -- ⭐ "onde NÃO sei" calibrado (Chip+Heleno): disputado é marcado, não afirmado
  risco_juridico  text check (risco_juridico in ('administrativo_seguro','borderline','judicial')),
  fundamento      jsonb not null default '[]',   -- [{norma, artigo, nota_tecnica, data, fonte_url}]
  -- HUMANO NO LOOP (D8)
  status          text not null default 'pendente'
                  check (status in ('pendente','aprovado','rejeitado','retificado')),
  revisor_id      uuid references core.usuario(id),
  revisado_em     timestamptz,
  motivo_revisao  text,                          -- obrigatório na rejeição (alimenta golden-set)
  laudo_id        uuid,                          -- FK adicionada após core.laudo
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint ck_revisao_completa check (
    (status = 'pendente' and revisor_id is null)
    or (status <> 'pendente' and revisor_id is not null and revisado_em is not null)
  ),
  constraint ck_rejeicao_motivada check (status <> 'rejeitado' or motivo_revisao is not null)
);
comment on table core.apontamento_auditoria is
  'Um indício de divergência por item. IA sugere, contador assina (D8): impossível sair de pendente sem revisor_id (constraint). Rejeição exige motivo → vira exemplo do golden-set.';

create trigger tg_upd before update on core.apontamento_auditoria
  for each row execute function app.tg_set_updated_at();

-- Máquina de estados: só transições legais, e revisor ≠ máquina
create or replace function core.tg_apontamento_transicao()
returns trigger language plpgsql
as $$
begin
  if old.status <> new.status then
    if not (
      (old.status = 'pendente'  and new.status in ('aprovado','rejeitado')) or
      (old.status = 'aprovado'  and new.status = 'retificado') or
      (old.status = 'rejeitado' and new.status = 'retificado')
    ) then
      raise exception 'Transição de status ilegal: % → %', old.status, new.status;
    end if;
  elsif old.status <> 'pendente'
    and (old.confianca, old.descricao, old.fundamento)
        is distinct from (new.confianca, new.descricao, new.fundamento) then
    -- depois de revisado, o conteúdo técnico congela (a história fica na trilha)
    raise exception 'Apontamento revisado é imutável; crie retificação.';
  end if;
  return new;
end $$;
create trigger tg_transicao before update on core.apontamento_auditoria
  for each row execute function core.tg_apontamento_transicao();
```

### 3.4 Laudo (o artefato que vende)

```sql
create table core.laudo (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  periodo         daterange not null,            -- competências cobertas
  versao          smallint not null default 1,
  status          text not null default 'rascunho'
                  check (status in ('rascunho','em_revisao','emitido','substituido')),
  base_versao_id  uuid references ref.base_versao(id),  -- snapshot da referência usado (S4)
  resumo          jsonb not null default '{}',   -- nº divergências, valor potencial, distrib. confiança
  pdf_storage_path text,
  hash_laudo      bytea,                         -- sha256 do PDF emitido — entra na trilha ⭐
  disclaimer_versao text not null default 'v1',  -- prova de QUAL disclaimer estava no laudo (Heleno)
  emitido_por     uuid references core.usuario(id),
  emitido_em      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint ck_emissao check (
    status <> 'emitido'
    or (emitido_por is not null and emitido_em is not null and hash_laudo is not null)
  ),
  unique (escritorio_id, cliente_id, periodo, versao)
);
comment on table core.laudo is
  'O produto (Concierge §4). White-label (marca do escritório). hash_laudo + base_versao_id + eventos = laudo REPRODUZÍVEL e verificável anos depois (defesa em auto de infração).';

alter table core.apontamento_auditoria
  add constraint fk_apontamento_laudo foreign key (laudo_id) references core.laudo(id) on delete set null;

create trigger tg_upd before update on core.laudo
  for each row execute function app.tg_set_updated_at();
```

### 3.5 ⭐ Trilha de boa-fé (o moat) — append-only + hash-chain

```sql
create table core.evento_boa_fe (
  id              bigint generated always as identity primary key,
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  seq_tenant      bigint not null,               -- sequência POR TENANT (gaps detectáveis na verificação)
  tipo_evento     text not null check (tipo_evento in (
                    'nota_recebida',             -- payload: chave, xml_hash, origem
                    'analise_executada',         -- payload: base_versao_id, motor_versao, params
                    'apontamento_gerado',        -- payload: regra_id, confianca, fundamento
                    'apontamento_aprovado',      -- payload: revisor, justificativa
                    'apontamento_rejeitado',     -- payload: revisor, motivo
                    'apontamento_retificado',
                    'laudo_emitido',             -- payload: hash_laudo, base_versao_id, disclaimer_versao
                    'laudo_substituido',
                    'base_referencia_atualizada',-- payload: versao_de → versao_para (por tenant: quando passou a valer)
                    'xml_expurgado'              -- fim da retenção legal (§7.3) — o expurgo também é evento
                  )),
  ator_tipo       text not null check (ator_tipo in ('usuario','motor','sistema')),
  ator_id         uuid,                          -- usuario.id quando ator_tipo='usuario'
  nota_id         uuid,
  apontamento_id  uuid references core.apontamento_auditoria(id),
  laudo_id        uuid references core.laudo(id),
  payload         jsonb not null default '{}',
  ocorrido_em     timestamptz not null default now(),
  hash_anterior   bytea not null,
  hash_evento     bytea not null
);
comment on table core.evento_boa_fe is
  '⭐ O MOAT. Trilha imutável de proveniência: qual versão da base, qual regra, quem aprovou, quando, hash do laudo. Event-sourcing LEVE: as tabelas de estado (apontamento/laudo) são a leitura; isto é a prova. Hash-chain por tenant: adulterar 1 evento quebra todos os seguintes. Verificação: recomputar a cadeia e conferir seq_tenant sem gaps.';
comment on column core.evento_boa_fe.hash_evento is
  'sha256(hash_anterior ‖ escritorio_id ‖ seq_tenant ‖ tipo ‖ ator ‖ refs ‖ payload ‖ ocorrido_em). Calculado por trigger — nunca pelo app.';

create or replace function core.tg_evento_boa_fe_chain()
returns trigger language plpgsql
as $$
declare
  v_prev  bytea;
  v_seq   bigint;
begin
  -- serializa a cadeia do tenant (lock por tenant, não global → tenants não se bloqueiam)
  perform pg_advisory_xact_lock(hashtext('boa_fe:' || new.escritorio_id::text));

  select hash_evento, seq_tenant into v_prev, v_seq
    from core.evento_boa_fe
   where escritorio_id = new.escritorio_id
   order by seq_tenant desc limit 1;

  new.seq_tenant    := coalesce(v_seq, 0) + 1;
  new.hash_anterior := coalesce(v_prev, '\x00');  -- gênese do tenant
  new.ocorrido_em   := coalesce(new.ocorrido_em, now());
  new.hash_evento   := digest(
      encode(new.hash_anterior, 'hex')
      || new.escritorio_id::text
      || new.seq_tenant::text
      || new.tipo_evento
      || new.ator_tipo || coalesce(new.ator_id::text, '')
      || coalesce(new.nota_id::text, '') || coalesce(new.apontamento_id::text, '')
      || coalesce(new.laudo_id::text, '')
      || new.payload::text
      || to_char(new.ocorrido_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
      'sha256');
  return new;
end $$;
create trigger tg_chain before insert on core.evento_boa_fe
  for each row execute function core.tg_evento_boa_fe_chain();

-- Imutabilidade em 2 camadas (a 3ª é a RLS sem policy de update/delete, §6):
create trigger tg_immutable before update or delete on core.evento_boa_fe
  for each row execute function app.tg_block_mutation();
revoke update, delete on core.evento_boa_fe from authenticated, anon, service_role;

create unique index uq_evento_seq on core.evento_boa_fe (escritorio_id, seq_tenant);
```

> **Nota de design (event-sourcing leve, não full):** o estado canônico continua nas tabelas relacionais (`apontamento`, `laudo`) — não reconstruímos estado por replay. A trilha é **prova**, não fonte de verdade operacional. Full event-sourcing foi descartado: complexidade não "earned" (Chip) para um time de 1 dev. Os inserts na trilha são feitos **na mesma transação** da mutação de estado (função RPC `core.aprovar_apontamento(...)` etc. — app nunca escreve estado sem evento).

```sql
-- Exemplo do padrão transacional (estado + prova juntos ou nada):
create or replace function core.aprovar_apontamento(p_apontamento_id uuid, p_justificativa text default null)
returns void language plpgsql security invoker
as $$
declare v_apt core.apontamento_auditoria;
begin
  update core.apontamento_auditoria
     set status = 'aprovado', revisor_id = auth.uid(), revisado_em = now(),
         motivo_revisao = p_justificativa
   where id = p_apontamento_id and status = 'pendente'
   returning * into v_apt;
  if not found then raise exception 'Apontamento inexistente, de outro tenant ou já revisado'; end if;

  insert into core.evento_boa_fe
    (escritorio_id, tipo_evento, ator_tipo, ator_id, apontamento_id, laudo_id, payload, hash_anterior, hash_evento)
  values
    (v_apt.escritorio_id, 'apontamento_aprovado', 'usuario', auth.uid(), v_apt.id, v_apt.laudo_id,
     jsonb_build_object('justificativa', p_justificativa, 'confianca', v_apt.confianca,
                        'regra_id', v_apt.regra_id, 'base_versao_id', v_apt.base_versao_id),
     '\x00', '\x00');  -- placeholders: trigger recalcula
end $$;
```

### 3.6 Base de referência cClassTrib — versionada por competência (schema `ref`)

```sql
create table ref.base_versao (
  id              uuid primary key default gen_random_uuid(),
  rotulo          text not null unique,          -- ex.: 'receita-nt-2026.001-v3'
  fonte           text not null,                 -- 'Receita/NT', 'licenciada:tecnospeed', 'curadoria interna'
  publicada_em    date not null,
  importada_em    timestamptz not null default now(),
  hash_conteudo   bytea not null,                -- sha256 do dataset importado — prova de integridade
  status          text not null default 'rascunho'
                  check (status in ('rascunho','vigente','superada')),
  notas           text
);
comment on table ref.base_versao is
  'Snapshot imutável da base NCM↔cClassTrib. O laudo aponta para UMA versão (boa-fé: "analisei com a base X de DD/MM"). Nunca se edita uma versão vigente/superada — importa-se outra.';

create table ref.cclasstrib_regra (
  id              uuid primary key default gen_random_uuid(),
  base_versao_id  uuid not null references ref.base_versao(id) on delete restrict,
  ncm             char(8) not null check (ncm ~ '^[0-9]{8}$'),
  ncm_ex          text,                          -- exceção TIPI (Ex 01...)
  cclasstrib      text not null,
  cst_ibs_cbs     text,
  descricao       text not null,
  tratamento      text,                          -- monofasico | reducao | isencao | padrao...
  aliquotas       jsonb not null default '{}',   -- {ibs, cbs, reducao_pct...} — muda a cada ano da transição
  -- ⭐ VIGÊNCIA POR COMPETÊNCIA: o MESMO NCM muda de cClassTrib na transição 2026-2033
  vigencia        daterange not null,
  fundamento      jsonb not null default '[]',   -- [{norma, artigo, anexo, url}] — alimenta a trilha
  -- dentro de uma versão, um NCM(+ex) não pode ter regras com vigências sobrepostas:
  constraint ex_vigencia exclude using gist (
    base_versao_id with =,
    ncm with =,
    coalesce(ncm_ex, '') with =,
    vigencia with &&
  )
);
comment on table ref.cclasstrib_regra is
  'Regra de referência: para o NCM X, na competência dentro de `vigencia`, o cClassTrib correto é Y. Lookup canônico: WHERE base_versao_id = :versao AND ncm = :ncm AND vigencia @> :competencia.';

create index ix_regra_lookup on ref.cclasstrib_regra using gist (ncm, vigencia)
  where true;  -- consulta do motor: ncm + competência
create index ix_regra_versao on ref.cclasstrib_regra (base_versao_id, ncm);

-- FASE 1 (motor RAG): create extension vector;
-- create table ref.cclasstrib_embedding (
--   regra_id   uuid primary key references ref.cclasstrib_regra(id) on delete cascade,
--   modelo     text not null,
--   embedding  vector(1536) not null
-- );
-- create index on ref.cclasstrib_embedding using hnsw (embedding vector_cosine_ops);
```

### 3.7 e-CAC (add-on, D9) — consultas com cache e custo

```sql
-- ============================================================
-- MIGRATION add-on e-CAC (próprio tempo, não bloqueia o core)
-- ============================================================
create table core.procuracao_eletronica (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  outorgada_em    date not null,
  validade        date not null,
  escopo          text[] not null default '{}',  -- serviços autorizados no e-CAC
  status          text not null default 'ativa'
                  check (status in ('ativa','vencida','revogada')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (escritorio_id, cliente_id)
);
comment on table core.procuracao_eletronica is
  'Procuração eletrônica RFB que habilita o Integra Contador server-side (D2: NÃO precisa do A1 do cliente). Guardamos METADADOS da procuração, não credencial.';

create table core.ecac_consulta (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  tipo_consulta   text not null check (tipo_consulta in
                    ('caixa_postal','situacao_fiscal','cnd_federal','cnd_fgts',
                     'cnd_trabalhista','cnd_estadual','pgfn','declaracoes_ausentes','outro')),
  origem          text not null default 'serpro' check (origem in ('serpro','infosimples')),
  requisicao      jsonb not null default '{}',
  resposta        jsonb,
  status          text not null default 'ok' check (status in ('ok','erro','timeout')),
  custo_centavos  integer not null default 0 check (custo_centavos >= 0),
  consultado_em   timestamptz not null default now(),
  valido_ate      timestamptz not null            -- TTL do cache por tipo (situação fiscal muda devagar)
);
comment on table core.ecac_consulta is
  'Cache + ledger de custo do Integra Contador. Unit economics do add-on (~R$2k/mês de preço vs centavos/consulta): SUM(custo_centavos) por tenant/mês é a métrica. Antes de consultar o SERPRO, buscar resposta com valido_ate > now().';

create index ix_ecac_cache on core.ecac_consulta
  (escritorio_id, cliente_id, tipo_consulta, consultado_em desc);
create index ix_ecac_custo on core.ecac_consulta (escritorio_id, consultado_em);
```

### 3.8 Provider de captura (Fase 2) — certificado como METADADO, nunca custódia

```sql
-- ============================================================
-- MIGRATION Fase 2 — ingestão via provider (PlugNotas/Focus)
-- ============================================================
create table core.provider_conexao (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  provider        text not null check (provider in ('plugnotas','focus')),
  provider_ref    text not null,                 -- id da empresa NO provider
  -- ⭐ D2: o A1 vive NO PROVIDER sob DPA/Art. 39 LGPD. Aqui, SÓ o que o provider
  -- reporta sobre ele. NÃO existe coluna para bytes/PFX/senha — por design.
  cert_fingerprint text,                         -- sha1/sha256 reportado pelo provider
  cert_validade   date,                          -- alimenta alerta "A1 vence em 30d" (observabilidade)
  cert_status     text check (cert_status in ('valido','expirando','expirado','revogado','ausente')),
  ultimo_heartbeat timestamptz,                  -- saúde da captura por CNPJ (queixa nº1 do mercado: suporte)
  ultimo_nsu      text,                          -- cursor NFeDistribuicaoDFe (gerido pelo provider; espelho)
  status          text not null default 'ativa'
                  check (status in ('ativa','pausada','erro','encerrada')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (escritorio_id, cliente_id, provider)
);
comment on table core.provider_conexao is
  'Conexão de captura comprada (D2). Certificado A1: custódia do PROVIDER (DPA + cláusula de operador Art. 39). Esta tabela guarda apenas metadados de saúde — fingerprint, validade, heartbeat — para o painel de observabilidade.';

create table core.ingestao_evento (
  id              bigint generated always as identity primary key,
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  provider        text not null,
  dedup_key       text not null,                 -- chave_acesso (ou id do evento do provider)
  payload         jsonb not null,                -- webhook bruto — staging antes de virar core.nota
  status          text not null default 'recebido'
                  check (status in ('recebido','processado','duplicado','erro')),
  erro            text,
  tentativas      smallint not null default 0,
  recebido_em     timestamptz not null default now(),
  processado_em   timestamptz,
  unique (escritorio_id, provider, dedup_key)    -- idempotência ANTES de tocar core.nota
);
comment on table core.ingestao_evento is
  'Staging de ingestão (Werner: everything fails). Webhook do provider cai aqui (rápido, idempotente); worker da fila (pgmq) transforma em core.nota + core.evento_boa_fe. Falha transitória nunca perde nota: o evento fica em erro e o retry relê o payload.';
```

### 3.9 Audit log LGPD (acesso a dados, não só mutação)

```sql
create table core.audit_log (
  id              bigint generated always as identity primary key,
  escritorio_id   uuid,                           -- NULL para eventos de plataforma
  ator_id         uuid,                           -- usuario.id ou NULL (sistema)
  ator_papel      text,
  acao            text not null,                  -- 'login','export_xml','view_laudo','dsr_recebida','expurgo'...
  recurso         text not null,                  -- 'core.nota','storage:xml-fiscal','core.laudo'...
  recurso_id      text,
  detalhe         jsonb not null default '{}',
  ip              inet,
  user_agent      text,
  ocorrido_em     timestamptz not null default now()
);
comment on table core.audit_log is
  'Trilha LGPD (Art. 37/46): quem acessou/exportou qual dado de qual titular, quando, de onde. Difere da trilha de boa-fé: esta é sobre ACESSO A DADOS (compliance), aquela é sobre DECISÃO FISCAL (moat). Append-only. Inclui registro de DSRs (pedidos de titular) e expurgos.';

create trigger tg_immutable before update or delete on core.audit_log
  for each row execute function app.tg_block_mutation();
revoke update, delete on core.audit_log from authenticated, anon, service_role;

create index ix_audit_tenant_tempo on core.audit_log (escritorio_id, ocorrido_em desc);
create index ix_audit_brin on core.audit_log using brin (ocorrido_em);
```

### 3.10 Golden-set (Fase 1) — curado, não cru

```sql
-- ============================================================
-- MIGRATION Fase 1 — motor
-- ============================================================
create table core.golden_exemplo (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid references core.escritorio(id),  -- NULL = exemplo global (anonimizado)
  ncm             char(8) not null,
  descricao_produto text not null,
  competencia     date not null,
  cclasstrib_correto text not null,
  tratamento      text,
  fonte           text not null check (fonte in
                    ('rotulagem_tributarista',          -- spike do motor (doc 11 §10.2)
                     'apontamento_aprovado',            -- revisão humana confirmou o motor
                     'apontamento_rejeitado',           -- revisão humana corrigiu o motor (ouro!)
                     'documento_feedback')),            -- ciclo Documentize (D1/S12)
  origem_ref      jsonb not null default '{}',          -- {apontamento_id | documento_feedback_id}
  rotulado_por    uuid references core.usuario(id),
  validado        boolean not null default false,       -- curadoria: só validado=true entra no eval
  created_at      timestamptz not null default now()
);
comment on table core.golden_exemplo is
  'Golden-set do motor (constraint nº3: evaluation antes de escalar). Alimentado por DocumentFeedback (Gestorize) e revisões humanas, mas CURADO (validado=true) — feedback cru tem ruído. Falso-positivo do motor é medido contra esta tabela ANTES de liberar pra carteira.';
```

---

## 4. (C) Camada Gestão — schema `gestao` (reuso Gestorize/Documentize, D1)

Módulo **separado** (schema próprio, deploy de migrations próprio) mas **mesmo tenant** (`escritorio_id` → `core.escritorio`). Mapeia as 23 features da planilha Comparativo Gestor.

```sql
-- ============================================================
-- MIGRATION gestao 001 — espelha o domínio do Gestorize React Web
-- ============================================================

create table gestao.departamento (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  nome            text not null,                 -- Fiscal, Contábil, DP, Societário ("Configuração de Departamentos")
  created_at      timestamptz not null default now(),
  unique (escritorio_id, nome)
);
alter table core.usuario
  add constraint fk_usuario_departamento
  foreign key (departamento_id) references gestao.departamento(id) on delete set null;

-- ------------------------------------------------------------
-- "Agenda de Tributações (Obrigações e Guias)" + "Modelos de Configuração Tributária"
-- + "Parâmetros de Competência e Antecipação" + "Parâmetros de Entrega"
create table gestao.obrigacao_modelo (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  nome            text not null,                 -- DAS, DCTFWeb, EFD-Reinf, FGTS Digital...
  esfera          text not null check (esfera in ('federal','estadual','municipal','trabalhista')),
  periodicidade   text not null check (periodicidade in ('mensal','trimestral','anual','eventual')),
  regra_vencimento jsonb not null default '{}',  -- {dia: 20, antecipa_nao_util: true} (param. antecipação)
  regimes_aplicaveis text[] not null default '{}', -- quais regimes geram esta obrigação (modelo tributário)
  departamento_id uuid references gestao.departamento(id) on delete set null,
  parametros_entrega jsonb not null default '{}', -- canal/template ("Parâmetros de Entrega de Obrigações")
  ativo           boolean not null default true,
  created_at      timestamptz not null default now(),
  unique (escritorio_id, nome)
);

create table gestao.obrigacao (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  modelo_id       uuid not null references gestao.obrigacao_modelo(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  competencia     date not null check (competencia = date_trunc('month', competencia)),
  vencimento      date not null,
  responsavel_id  uuid references core.usuario(id) on delete set null,
  status          text not null default 'pendente'
                  check (status in ('pendente','em_andamento','entregue','atrasada','dispensada')),
  entregue_em     timestamptz,
  protocolo       text,                          -- "Protocolo Automático de Envio" (gap vs concorrentes)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (cliente_id, modelo_id, competencia)    -- instância única por cliente/competência
);
comment on table gestao.obrigacao is
  'Instância mensal da obrigação por cliente (gerada de obrigacao_modelo por job de virada de competência). Alimenta "Relatórios de Obrigações e Pendências" e o dashboard por colaborador/departamento.';

-- ------------------------------------------------------------
create table gestao.guia (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  obrigacao_id    uuid references gestao.obrigacao(id) on delete set null,
  tipo            text not null,                 -- DAS, DARF, GPS, FGTS...
  competencia     date not null,
  valor           numeric(15,2),
  vencimento      date not null,
  arquivo_storage_path text,                     -- bucket 'gestao-docs' (RLS por tenant, §7.1)
  status          text not null default 'gerada'
                  check (status in ('gerada','enviada','visualizada','paga','vencida')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table gestao.guia is '"Envio de Guias e Documentos" + Área VIP. Visualizada/paga vem do portal do cliente final.';

-- ------------------------------------------------------------
-- "Gerenciamento de Tarefas e Rotinas Mensais" + "Dashboard Operacional por Colaborador/Departamento"
create table gestao.tarefa (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  titulo          text not null,
  cliente_id      uuid references core.cliente(id) on delete set null,
  departamento_id uuid references gestao.departamento(id) on delete set null,
  responsavel_id  uuid references core.usuario(id) on delete set null,
  recorrencia     jsonb,                         -- {freq:'mensal', dia: 5} → job instancia rotinas
  prazo           date,
  status          text not null default 'aberta'
                  check (status in ('aberta','em_andamento','concluida','cancelada')),
  origem          text not null default 'manual'
                  check (origem in ('manual','rotina','documentize','auditoria')),
                  -- 'documentize': doc reconhecido cria atividade automática (fluxo existente)
                  -- 'auditoria': apontamento aprovado pode virar tarefa de correção no cliente
  concluida_em    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ------------------------------------------------------------
create table gestao.alvara_certidao (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  tipo            text not null check (tipo in ('alvara','certidao')),
  subtipo         text not null,                 -- alvará funcionamento/bombeiros · CND federal/FGTS/trabalhista...
  orgao           text,
  numero          text,
  emissao         date,
  validade        date,
  arquivo_storage_path text,
  status          text not null default 'vigente'
                  check (status in ('vigente','vencendo','vencida','em_renovacao')),
  ecac_consulta_id uuid references core.ecac_consulta(id) on delete set null,
                  -- ⭐ ponte com o add-on e-CAC: CND obtida em lote preenche/renova esta linha
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table gestao.alvara_certidao is
  '"Controle de Alvarás e Certidões" (Gestorize). O add-on e-CAC (D9) industrializa: consulta em lote → upsert aqui → alerta de vencimento.';

-- ------------------------------------------------------------
create table gestao.tag (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  nome            text not null,
  cor             text,
  unique (escritorio_id, nome)
);
create table gestao.cliente_tag (
  cliente_id      uuid not null references core.cliente(id) on delete cascade,
  tag_id          uuid not null references gestao.tag(id) on delete cascade,
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict, -- denorm. RLS
  primary key (cliente_id, tag_id)
);

-- ------------------------------------------------------------
-- DOCUMENTIZE — esqueleto da Captura no dia 0 (upload manual) e do e-Contínuo
create table gestao.documento (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid references core.cliente(id) on delete set null,
  storage_path    text not null,
  nome_original   text not null,
  mime_type       text not null,
  hash_sha256     bytea not null,                -- dedup exato
  hash_perceptual text,                          -- dedup de re-scan/foto (feature existente do Documentize)
  tipo_detectado  text,                          -- 'xml_nfe','recibo','guia','contrato','desconhecido'...
  extracao        jsonb not null default '{}',   -- texto + coordenadas (pipeline existente)
  status          text not null default 'recebido'
                  check (status in ('recebido','processando','classificado','reenviado','erro')),
                  -- 'reenviado' = "Tratamento de Documentos Reenviados" (feature da planilha)
  origem          text not null default 'upload'
                  check (origem in ('upload','email','econtinuo','area_vip')),
  nota_id         uuid,                          -- preenchido se o doc virou core.nota (XML fiscal)
  nota_competencia date,
  enviado_por     uuid references core.usuario(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (escritorio_id, hash_sha256)            -- dedup por tenant (mesmo arquivo 2x = no-op)
);
comment on table gestao.documento is
  'Pipeline Documentize (D1: reusar, não reescrever). No dia 0 é a PORTA DE ENTRADA do XML (Concierge): upload → tipo_detectado=xml_nfe → parser cria core.nota (origem=documentize) + evento nota_recebida na trilha.';

alter table gestao.documento
  add constraint fk_documento_nota
  foreign key (nota_id, nota_competencia) references core.nota(id, competencia) on delete set null;

create table gestao.documento_feedback (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  documento_id    uuid not null references gestao.documento(id) on delete cascade,
  usuario_id      uuid not null references core.usuario(id),
  campo           text not null,                 -- 'tipo_detectado','cliente_id','competencia','ncm'...
  valor_sugerido  text,
  valor_corrigido text not null,
  created_at      timestamptz not null default now()
);
comment on table gestao.documento_feedback is
  'DocumentFeedback do Gestorize (ciclo de feedback existente). É INSUMO do core.golden_exemplo (S12): job da Fase 1 promove feedbacks de classificação fiscal a exemplos candidatos (validado=false até curadoria).';

-- ------------------------------------------------------------
create table gestao.envio (
  id              uuid primary key default gen_random_uuid(),
  escritorio_id   uuid not null references core.escritorio(id) on delete restrict,
  cliente_id      uuid not null references core.cliente(id) on delete restrict,
  guia_id         uuid references gestao.guia(id) on delete set null,
  documento_id    uuid references gestao.documento(id) on delete set null,
  canal           text not null check (canal in ('email','area_vip','whatsapp')),
  destinatario    text not null,
  template        text,                          -- "Personalização de E-mails de Entrega"
  status          text not null default 'enfileirado'
                  check (status in ('enfileirado','enviado','falhou','aberto')),
  enviado_em      timestamptz,
  created_at      timestamptz not null default now()
);
```

**Cobertura das 23 features Gestorize:** Agenda de Tributações → `obrigacao_modelo/obrigacao/guia` · Cadastros (clientes/colaboradores/usuários+permissões) → `core.cliente/core.usuario(papel)` · Alvarás e Certidões → `alvara_certidao` · Modelos de Config. Tributária → `obrigacao_modelo.regimes_aplicaveis` · Tarefas e Rotinas → `tarefa(recorrencia)` · Área VIP/App + Envio de Guias → `guia/envio` · Dashboards (gerencial/operacional/equipe) → views sobre `obrigacao/tarefa` (sem tabela própria) · Tags → `tag/cliente_tag` · Reconhecimento de Documentos/Padrões + e-Contínuo + Reenviados → `documento` · Parâmetros competência/antecipação/entrega → `obrigacao_modelo.regra_vencimento/parametros_entrega` · Departamentos → `departamento` · Configurações pessoais/segurança → `core.usuario` + Supabase Auth · Logs e Auditoria → `core.audit_log` · Consulta e Relatórios → views. **Lacunas vs concorrentes (21)** que o core já endereça: Recálculo Automático → `apontamento_auditoria` (motor) · Diagnóstico e-CAC → `ecac_consulta` · Robôs de leitura/recibos → pipeline `documento` · Recebimento de documentos → `documento.origem` · Controle/gestão de tarefas + monitoramento por depto/colaborador → `tarefa`. (Fluxo de caixa/Open Finance/BPO = fora de escopo, beco "não brigar com Conta Azul".)

---

## 5. (B) Índices críticos

```sql
-- core.nota — padrões: carteira por cliente/competência; fila de auditoria; dedup
create index ix_nota_cliente_comp   on core.nota (escritorio_id, cliente_id, competencia desc);
create index ix_nota_fila_auditoria on core.nota (escritorio_id, status_auditoria, competencia)
  where status_auditoria in ('nao_analisada','em_analise');          -- parcial: fila enxuga sozinha
create index ix_nota_emitente       on core.nota (escritorio_id, emitente_cnpj, competencia);

-- core.nota_item — motor: lookup por NCM dentro do tenant; drill-down da nota
create index ix_item_nota on core.nota_item (nota_id, competencia);
create index ix_item_ncm  on core.nota_item (escritorio_id, ncm);

-- core.apontamento_auditoria — A TELA mais usada (fila de revisão pendente)
create index ix_apont_fila on core.apontamento_auditoria (escritorio_id, created_at)
  where status = 'pendente';                                          -- parcial = pequena e quente
create index ix_apont_item  on core.apontamento_auditoria (item_id);
create index ix_apont_laudo on core.apontamento_auditoria (laudo_id) where laudo_id is not null;
create index ix_apont_metrica on core.apontamento_auditoria (escritorio_id, status, revisado_em);
  -- billing D7 (notas auditadas/mês) + taxa de aprovação do motor (eval)

-- core.evento_boa_fe — leitura é "linha do tempo do laudo/nota"
create index ix_evento_laudo on core.evento_boa_fe (laudo_id) where laudo_id is not null;
create index ix_evento_nota  on core.evento_boa_fe (nota_id)  where nota_id  is not null;
create index ix_evento_brin  on core.evento_boa_fe using brin (ocorrido_em);

-- gestao — dashboards operacionais
create index ix_obrig_vencimento on gestao.obrigacao (escritorio_id, vencimento)
  where status in ('pendente','em_andamento','atrasada');
create index ix_obrig_responsavel on gestao.obrigacao (escritorio_id, responsavel_id, competencia);
create index ix_tarefa_painel on gestao.tarefa (escritorio_id, responsavel_id, status, prazo);
create index ix_doc_cliente on gestao.documento (escritorio_id, cliente_id, created_at desc);
create index ix_alvara_validade on gestao.alvara_certidao (escritorio_id, validade)
  where status in ('vigente','vencendo');
```

Regra: todo índice composto começa com `escritorio_id` (RLS filtra por ele em 100% das queries de tenant). FKs sem índice automático (Postgres não cria) foram cobertas onde há join real; não indexei FK que nunca aparece em WHERE/JOIN (anti over-indexing).

---

## 6. (B) RLS — policies por tenant (exemplos concretos)

Modelo: claim `app_metadata.escritorio_id` (gravado por service_role no convite — usuário **não** consegue editar `app_metadata`). Helper `app.current_escritorio_id()` (§2). `service_role` bypassa RLS (jobs/ingestão), **exceto** nas append-only onde o REVOKE de UPDATE/DELETE vale até para ele.

```sql
-- Habilitar em TODAS as tabelas tenant-scoped (core e gestao):
alter table core.escritorio            enable row level security;
alter table core.usuario               enable row level security;
alter table core.cliente               enable row level security;
alter table core.nota                  enable row level security;  -- no PAI: vale p/ partições via pai
alter table core.nota_item             enable row level security;
alter table core.apontamento_auditoria enable row level security;
alter table core.laudo                 enable row level security;
alter table core.evento_boa_fe         enable row level security;
alter table core.ecac_consulta         enable row level security;
alter table core.audit_log             enable row level security;
-- ... (todas de gestao.*) — checklist de migration: nenhuma tabela nova sem RLS.

-- ⚠️ Partições: RLS do pai só vale acessando via pai → revogar acesso direto:
revoke all on core.nota_2021, core.nota_2022, core.nota_2023, core.nota_2024,
              core.nota_2025, core.nota_2026, core.nota_2027 from authenticated, anon;

-- ------------------------------------------------------------
-- Padrão 1 — isolamento simples (maioria das tabelas)
create policy p_sel on core.cliente for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_ins on core.cliente for insert to authenticated
  with check (escritorio_id = app.current_escritorio_id());
create policy p_upd on core.cliente for update to authenticated
  using (escritorio_id = app.current_escritorio_id())
  with check (escritorio_id = app.current_escritorio_id());
-- DELETE: sem policy = ninguém deleta cliente via API (soft-delete only).

-- Padrão 2 — nota: leitura tenant; escrita só pipeline (não há policy de INSERT
-- para authenticated → upload passa pela RPC/edge function com service_role,
-- que valida + grava nota e evento na MESMA transação)
create policy p_sel on core.nota for select to authenticated
  using (escritorio_id = app.current_escritorio_id());

-- Padrão 3 — humano-no-loop com papel: só admin/gestor/analista revisam
create policy p_sel on core.apontamento_auditoria for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_upd_revisao on core.apontamento_auditoria for update to authenticated
  using (escritorio_id = app.current_escritorio_id()
         and app.current_papel() in ('admin','gestor','analista'))
  with check (escritorio_id = app.current_escritorio_id());

-- Padrão 4 — trilha de boa-fé: SELECT do próprio tenant; INSERT só via RPC; UPDATE/DELETE inexistem
create policy p_sel on core.evento_boa_fe for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
-- (sem policy de insert/update/delete p/ authenticated; insert via security definer RPC
--  ou service_role; update/delete bloqueados por trigger + REVOKE mesmo p/ service_role)

-- Padrão 5 — tenant raiz: usuário vê só o próprio escritório; só admin edita
create policy p_sel on core.escritorio for select to authenticated
  using (id = app.current_escritorio_id());
create policy p_upd on core.escritorio for update to authenticated
  using (id = app.current_escritorio_id() and app.current_papel() = 'admin')
  with check (id = app.current_escritorio_id());

-- Padrão 6 — schema ref: público fiscal, sem tenant → sem RLS; só leitura
grant usage on schema ref to authenticated;
grant select on all tables in schema ref to authenticated;
-- escrita em ref.* só por service_role (job de importação de base) — nenhum grant a authenticated.
```

### 6.1 Storage (XML 15 anos) — particionamento e RLS

- **Bucket `xml-fiscal`** (privado). Path: `{escritorio_id}/{cnpj_cliente}/{aaaa}/{mm}/{chave_acesso}.xml`. O 1º segmento = tenant → policy por prefixo; `{aaaa}/{mm}` = "particionamento" físico do storage por competência, espelhando as partições da tabela (expurgo por prefixo no fim da retenção).
- **Bucket `gestao-docs`** (guias, alvarás, docs Documentize) e **`laudos`** (PDFs emitidos), mesma convenção.

```sql
create policy "xml_select_tenant" on storage.objects for select to authenticated
  using (bucket_id = 'xml-fiscal'
         and (storage.foldername(name))[1] = app.current_escritorio_id()::text);
-- INSERT/UPDATE/DELETE no bucket: NENHUMA policy p/ authenticated.
-- Upload entra pela edge function (service_role) que grava objeto + core.nota + evento
-- na mesma operação e registra em audit_log. Delete: SÓ o job de expurgo (§7.3).
```

---

## 7. LGPD by design

### 7.1 Papéis
Escritório = **controlador** dos dados dos clientes dele; nós = **operador** (DPA com cada escritório). Provider de captura = **suboperador** nosso (DPA + Art. 39) — cadeia documentada em contrato, refletida em `core.provider_conexao` (metadados apenas, S7).

### 7.2 PII no domínio
| Dado | Onde | Tratamento |
|------|------|------------|
| CPF de destinatário (NFC-e) | `nota.destinatario_doc`, XML no storage | Minimização: não extrair p/ `nota_item`; não indexar; mascarar na UI por padrão; acesso logado em `audit_log` |
| Nome/e-mail de colaborador | `core.usuario` | Base legal: execução de contrato |
| Dados do XML (endereços, nomes) | Storage | Criptografia at-rest (Supabase) + RLS por prefixo + acesso só via URL assinada de curta duração |

### 7.3 Retenção 15 anos × direito de exclusão (a tensão, documentada)
- **Base legal de retenção:** guarda de documento fiscal eletrônico = **obrigação legal/regulatória** (LGPD Art. 7º, II e Art. 16, I — conservação para cumprimento de obrigação legal **prevalece sobre o pedido de exclusão** durante o prazo). Âncoras fiscais: CTN Art. 195 §ún. (guarda até prescrição dos créditos tributários) e prazos decadenciais/prescricionais aplicáveis.
- ⚠️ **Flag pro @legal-chief:** o requisito de produto diz **15 anos** (PRD §5.1); o piso legal típico de documento fiscal é 5-6 anos (+ teses de interrupção). Confirmar com a Patrícia Peck se 15 é exigência real ou margem de segurança — **retenção além do necessário também é violação LGPD** (princípio da necessidade). O schema não trava: `app_config.retencao_xml_anos` parametriza.
- **Mecânica:** pedido de exclusão (DSR) → registra em `audit_log (acao='dsr_recebida')` → o que NÃO é guarda obrigatória é apagado/anonimizado → XML/nota ficam até o fim do prazo → **job de expurgo** mensal apaga objetos do prefixo `{aaaa}/{mm}` vencido + `DROP PARTITION` da `core.nota` do ano vencido → evento `xml_expurgado` na trilha + `audit_log (acao='expurgo')`. O expurgo é **auditável**, não silencioso.
- **Trilha de boa-fé vs exclusão:** eventos não carregam PII de titular pessoa física (payloads referenciam ids/hashes) → a cadeia sobrevive ao expurgo sem quebrar compliance.

---

## 8. (D) Estratégia de evolução por fase

| Fase | Migration | Tabelas/objetos | O que NÃO existe ainda |
|------|-----------|-----------------|------------------------|
| **Dia 0 — Concierge** (`14`) | `000` + `001` | `app.*` helpers · `escritorio, usuario, cliente` · `nota` (+partições, origem=upload/documentize/manual) · `nota_item` · `apontamento_auditoria` (origem='manual') · `laudo` · **`evento_boa_fe`** · `audit_log` · `ref.base_versao/cclasstrib_regra` (importada à mão — mesmo o laudo manual já referencia versão da base!) · `gestao.documento(+feedback)` p/ upload · buckets + RLS | Motor, fila, pgvector, provider, e-CAC, resto da camada gestão. **A trilha nasce no dia 0**: o laudo manual do Concierge já sai com proveniência — é o que está sendo vendido. |
| **Fase 1 — Motor** (gate: ≥3/5 pagam) | `002` | `vector` ext + `ref.cclasstrib_embedding` (HNSW) · `core.golden_exemplo` · `apontamento.origem='motor'` ativo · views de eval (taxa falso-positivo por setor) · job promove `documento_feedback` → golden candidato | Provider, e-CAC. |
| **Fase 2 — Ingestão provider** | `003` | `provider_conexao` · `ingestao_evento` · pgmq (filas `ingestao`, `analise`) · views de observabilidade (heartbeat por CNPJ, cert expirando, fila de retry — "suporte é a queixa nº1") | e-CAC. |
| **Add-on e-CAC** (próprio tempo) | `010` | `procuracao_eletronica` · `ecac_consulta` (cache+custo) · ponte `gestao.alvara_certidao.ecac_consulta_id` · view unit-economics (custo SERPRO × tenant × mês) | — |
| **Camada Gestão completa** (Fase 3 / conforme reuso Gestorize) | `g001+` | `departamento, obrigacao_modelo, obrigacao, guia, tarefa, alvara_certidao, tag, envio` (o `documento` já entrou no dia 0) | — |

Princípio: **nenhuma tabela nasce antes da fase que a usa** (YAGNI), com duas exceções deliberadas: (1) partições da `nota` (migração tardia caríssima, S5); (2) `evento_boa_fe` no dia 0 (é o produto).

---

## 9. (B/E) Particionamento, fila, pgvector — trade-offs

### 9.1 pgvector para o RAG (Fase 1) — ✅ recomendado
- **A favor:** base cClassTrib é pequena (10³–10⁴ regras × transição = ainda trivial); embedding mora **ao lado** da regra relacional → o RAG retorna `regra_id` e o apontamento já referencia a linha exata (proveniência grátis pra trilha); zero infra nova; HNSW no Supabase é maduro.
- **Contra (quando rever):** se virar RAG sobre corpus normativo gigante (íntegras de NTs, pareceres, 10⁶+ chunks) ou precisar de filtros vetoriais complexos com latência <50ms — aí avaliar dedicado. Não é o caso por anos.
- **Decisão:** pgvector (A4 do doc 11 confirmada). Embeddings ficam em `ref` (globais), nunca por tenant.

### 9.2 Fila: pgmq vs pg-boss vs Redis/SQS
| Opção | Prós | Contras |
|-------|------|---------|
| **pgmq (Supabase Queues)** ✅ | Nativo do Supabase, sem infra, transacional com o dado (enfileirar nota + gravar staging na mesma tx), visibilidade via SQL | Throughput menor que Redis (irrelevante: XML ~7KB, milhares/dia, não milhões) |
| pg-boss | Rico (retry/backoff/cron), Node-friendly | ⚠️ Precisa conexão **session-mode** (LISTEN/NOTIFY morre no pooler transaction-mode do Supabase) — gotcha real de produção; exige worker Node dedicado com conexão direta |
| Redis (Upstash) / SQS | Escala brutal | Infra extra + **perde a transacionalidade com o Postgres** (nota gravada e job perdido, ou vice-versa) → contra o "everything fails" |
- **Decisão:** dia 0 **sem fila** (Concierge é manual). Fase 2: **pgmq**; worker (edge function agendada ou Node) consome `ingestao_evento` → `nota` + `evento_boa_fe` em uma transação. pg-boss só se nascer um backend Node persistente com conexão direta (porta 5432, não 6543).

### 9.3 Particionamento de `core.nota` por competência
- **A favor (decisivo):** retenção de 15 anos ⇒ a tabela só cresce; **expurgo = `DROP PARTITION`** (instantâneo, sem bloat, auditável) vs `DELETE` de milhões de linhas; queries são 99% "competências recentes" → partition pruning; partição anual mantém nº de partições baixo (~15-20).
- **Contra:** PK/UNIQUE precisam incluir a partition key (resolvido: competência é derivável da chave de acesso → dedup determinístico); FKs compostas (`nota_item` carrega `competencia`); RLS via tabela-pai exige revogar acesso direto às partições (feito §6).
- **Alternativa rejeitada:** tabela plana + particionar "quando doer" — migrar tabela viva multi-GB pra particionada = downtime/pg_dump+reload ou pglogical; custo absurdo vs ~30 linhas de DDL agora. **Mensal** também rejeitado: 180 partições em 15 anos sem ganho (pruning anual + índice por competência basta no nosso volume).
- **`evento_boa_fe`/`audit_log`:** NÃO particionar por ora (BRIN em `ocorrido_em` resolve; trilha não expurga). Rever se passar de ~50M linhas.

---

## 10. Outras decisões com trade-off (registro)

1. **`escritorio_id` denormalizado em tudo** (viola 3NF de propósito): RLS sem subquery/join (performance + simplicidade de policy auditável) e índices compostos naturais. Custo: 16 bytes/linha + integridade garantida por trigger/RPC de escrita (o risco de divergência `item.escritorio_id ≠ nota.escritorio_id` é fechado porque escrita passa por pipeline, não por INSERT livre).
2. **Schemas separados vs prefixo de tabela:** schemas dão fronteira de módulo real (grants por schema, `ref` sem RLS, migrations independentes p/ gestao). Custo: PostgREST precisa expor `core,gestao` em `db_schemas` (config 1 linha) — aceito.
3. **Enums via CHECK (text) e não `CREATE TYPE`:** todos os domínios listados evoluem (transição 2026-33 vai inventar status novos); `ALTER TYPE` é chato em migration, CHECK é um `ALTER TABLE` trivial. Custo: sem reuso de tipo entre tabelas — aceito.
4. **Hash-chain por tenant (não global):** verificação independente por escritório (entregável de defesa: "aqui está a cadeia íntegra do SEU laudo") + advisory lock por tenant (sem serialização global de inserts). Custo: não prova ordem ENTRE tenants — irrelevante juridicamente.
5. **Papel único em `usuario.papel`** (não N:N): KISS dia-0; o Gestorize tem permissões finas, mas a matriz real cabe em 4 papéis + departamento. Se o reuso do Gestorize (pendência §8.5 do CONTEXT) trouxer ACL granular, evolui pra `usuario_papel` sem quebrar RLS (helper `app.current_papel()` isola).
6. **`cst_aplicado/tributos/aliquotas` em jsonb:** o conjunto de campos tributários MUDA a cada NT durante a transição. Colunas rígidas = migration a cada mudança da Receita. Custo: validação app-side + sem constraint relacional nesses campos — mitigado porque a comparação (motor) é sempre interpretada contra `ref.cclasstrib_regra` versionada.
7. **Sem `deleted_at` generalizado:** soft-delete só em `cliente` (exigência de retenção). Nota/apontamento/laudo **nunca** deletam (história fiscal); gestão usa status. Menos um eixo de bug em policy.

---

## 11. Riscos de dados (visão @data-engineer)

| Sev | Risco | Mitigação no schema |
|-----|-------|---------------------|
| 🔴 | **Trilha de boa-fé com furo** (estado mudou sem evento → o moat vira promessa furada) | Escrita de estado SÓ via RPCs transacionais (§3.5); job noturno de reconciliação (apontamento revisado sem evento correspondente = alerta); `seq_tenant` denuncia gap |
| 🔴 | **Base cClassTrib errada/desatualizada** — o motor herda o erro e o laudo "defensável" induz o contador | Versão imutável + `hash_conteudo` + vigência com EXCLUDE anti-sobreposição; laudo aponta a versão (erro é rastreável e retificável via `laudo_substituido`); processo de importação com diff humano-aprovado |
| 🔴 | **Vazamento cross-tenant** (o produto é dado fiscal do cliente do cliente) | RLS default-deny + claim em `app_metadata` (não editável) + partições sem grant direto + storage por prefixo + teste automatizado de isolamento por tabela no CI (recomendo `db-rls-audit` a cada migration) |
| 🟡 | Retenção 15 anos sem confirmação jurídica (reter demais TAMBÉM é passivo LGPD) | Parametrizado; flag aberta pro @legal-chief (§7.3) |
| 🟡 | CPF em NFC-e tratado como "dado fiscal qualquer" | Minimização §7.2 + acesso a XML sempre via URL assinada + `audit_log` |
| 🟡 | jsonb virar lixão (provider_meta/extracao/payload sem contrato) | Contratos de payload documentados por `tipo_evento`; validação na borda (edge function); nunca decidir negócio lendo jsonb cru — promover a coluna quando virar filtro |
| 🟡 | Billing D7 (nota auditada) sem fonte limpa | `ix_apont_metrica` + view canônica de medição (`count(distinct nota)` com apontamento revisado no mês) definida ANTES do primeiro tier cobrado |
| 🟢 | Volume (alto-SKU: mercado = 10³ itens/nota) | Particionamento + índices parciais; 1 escritório 500 CNPJs × 2k notas/mês × 30 itens ≈ 30M itens/ano — Postgres dá conta com folga nesse desenho |

---

## 12. Checklist de design (database-design-checklist)

1. **Domain model alignment** — [x] Entidades do PRD/arquitetura todas representadas; cardinalidades 1:N (escritório→cliente→nota→item→apontamento) e N:N (cliente↔tag); regras de negócio críticas no banco (humano-no-loop por constraint, idempotência por UNIQUE, vigência por EXCLUDE); naming pt-BR snake_case consistente com o glossário canônico do CONTEXT.
2. **Table design** — [x] PK uuid (trilhas usam bigint identity: ordem importa); created/updated_at + trigger; soft-delete só onde faz sentido (decisão §10.7, documentada); tipos apropriados (numeric p/ dinheiro, char(14) CNPJ, daterange vigência, bytea hash).
3. **Relationships & constraints** — [x] FKs com ON DELETE explícito (RESTRICT como default consciente — dado fiscal não cascateia, exceto item←nota e dedup de N:N); UNIQUEs de negócio; CHECKs em todos os domínios.
4. **Indexing** — [x] §5; parciais nas filas quentes; BRIN nas séries temporais; todos justificados.
5. **Normalization** — [x] 3NF com 2 desvios documentados (tenant denormalizado §10.1; jsonb tributário §10.6).
6. **Security** — [x] Sensibilidade mapeada (§7.2); RLS default-deny + 6 padrões de policy; append-only triplo na trilha; audit_log LGPD.
7. **Performance** — [x] Volumetria estimada (§11 último item); particionamento decidido com trade-off; arquivamento = expurgo legal auditável.
8. **Documentation** — [x] ERD §1; COMMENT ON em tudo que é não-óbvio; decisões §0/§9/§10.

**Pendências pra v1.1:** (a) confirmar prazo de retenção com @legal-chief; (b) validar reuso real do Gestorize (pendência CONTEXT §8.5) — se o código vier com schema próprio, este `gestao.*` vira o alvo da migração de dados; (c) revisão dos clones martin-fowler/chip-huyen quando o brain-bridge voltar; (d) view canônica de billing D7; (e) contrato dos payloads jsonb por `tipo_evento`.

— Dara (@data-engineer) · confirmo que o design passou pelo checklist e está pronto para virar migrations (`000`/`001` no dia 0).
