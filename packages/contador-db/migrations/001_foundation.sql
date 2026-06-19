-- Contador F1-D0 foundation
-- Migration: 001_foundation.sql
-- Target: PostgreSQL 15+ / Supabase-compatible Postgres
-- Scope: schema v1.1 core contracts, RPC published language, and D0 boundaries.

begin;

create extension if not exists pgcrypto;
create extension if not exists btree_gist;
create extension if not exists citext;

create schema if not exists app;
create schema if not exists ref;
create schema if not exists core;
create schema if not exists core_api_v1;
create schema if not exists gestao;
create schema if not exists ingestao;
create schema if not exists ecac;
create schema if not exists billing;

comment on schema core_api_v1 is
  'Published write API for Contador core. Versioned RPC boundary for P19/P20.';
comment on schema core is
  'Core fiscal storage and invariants. Internal tables are not the public API.';

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'core_rw') then
    create role core_rw nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'gestao_rw') then
    create role gestao_rw nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'motor') then
    create role motor nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'billing_ro') then
    create role billing_ro nologin;
  end if;
end $$;

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
  '[P18] Single place that knows Supabase JWT tenant claim format.';

create or replace function app.current_papel()
returns text language sql stable
as $$
  select current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'papel'
$$;
comment on function app.current_papel is
  '[P18] Single place that knows Supabase JWT role claim format.';

create or replace function app.tg_set_updated_at()
returns trigger language plpgsql
as $$ begin new.updated_at := now(); return new; end $$;

create or replace function app.tg_block_mutation()
returns trigger language plpgsql
as $$
begin
  raise exception 'Table %.% is append-only', tg_table_schema, tg_table_name;
end $$;

create or replace function core.competencia_de(p_emitida_em date)
returns date language sql immutable
as $$ select date_trunc('month', p_emitida_em)::date $$;
comment on function core.competencia_de is
  '[P12] Competencia is derived in the database from emission date.';

create table if not exists core.escritorio (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  plano text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists core.cliente (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  nome text not null,
  documento text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (escritorio_id, documento)
);

create table if not exists core.usuario (
  id uuid primary key,
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  nome text not null,
  email citext not null,
  papel text not null default 'analista'
    check (papel in ('admin', 'gestor', 'contador', 'analista', 'leitura')),
  cpf char(11) check (cpf ~ '^[0-9]{11}$'),
  crc text,
  crc_uf char(2),
  crc_situacao text check (crc_situacao in ('ativo', 'suspenso', 'baixado', 'sem_registro')),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (escritorio_id, email)
);
comment on table core.usuario is
  '[P8] No FK from core.usuario to gestao. Department membership lives in gestao.usuario_departamento.';

create trigger tg_usuario_updated_at
  before update on core.usuario
  for each row execute function app.tg_set_updated_at();

create table if not exists ref.base_versao (
  id uuid primary key default gen_random_uuid(),
  rotulo text not null unique,
  fonte text not null default 'oficial',
  vigente_desde date not null,
  conhecida_em timestamptz not null default now(),
  hash_conteudo bytea not null default public.digest('', 'sha256'),
  created_at timestamptz not null default now()
);

create table if not exists ref.cclasstrib_regra (
  id uuid primary key default gen_random_uuid(),
  base_versao_id uuid not null references ref.base_versao(id) on delete restrict,
  cclasstrib text not null,
  ncm text,
  descricao text not null,
  vigencia daterange not null,
  fundamento jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists ref.golden_set_versao (
  id uuid primary key default gen_random_uuid(),
  rotulo text not null unique,
  descricao text,
  n_exemplos integer not null default 0,
  hash_snapshot bytea not null,
  congelada_em timestamptz not null default now(),
  status text not null default 'ativo' check (status in ('rascunho', 'ativo', 'superado'))
);
comment on table ref.golden_set_versao is
  '[P23] Immutable golden-set snapshot. Base + motor + eval are all versioned.';
create trigger tg_golden_set_immutable
  before update or delete on ref.golden_set_versao
  for each row execute function app.tg_block_mutation();

create table if not exists ref.motor_versao (
  id uuid primary key default gen_random_uuid(),
  rotulo text not null unique,
  codigo_versao text not null,
  regras_pacote_hash bytea not null,
  modelo_llm text,
  prompt_hash bytea,
  embedding_modelo text,
  params jsonb not null default '{}',
  golden_set_versao_id uuid references ref.golden_set_versao(id) on delete restrict,
  hash_manifesto bytea not null,
  tipo_inferencia text not null
    check (tipo_inferencia in ('humano_concierge', 'regra_deterministica', 'rag')),
  status text not null default 'rascunho'
    check (status in ('rascunho', 'vigente', 'superado')),
  criada_em timestamptz not null default now()
);
comment on table ref.motor_versao is
  '[P1] Versioned motor entity. Inferences reference exact code, rules, prompt, params, and eval snapshot.';
create trigger tg_motor_versao_immutable
  before update or delete on ref.motor_versao
  for each row execute function app.tg_block_mutation();

insert into ref.motor_versao (
  rotulo,
  codigo_versao,
  regras_pacote_hash,
  hash_manifesto,
  tipo_inferencia,
  status
)
values (
  'motor-c0-concierge-humano',
  'manual',
  '\x00',
  public.digest('motor-c0-concierge-humano', 'sha256'),
  'humano_concierge',
  'vigente'
)
on conflict (rotulo) do nothing;

create table if not exists ref.ecac_servico_map (
  codigo_serpro text primary key,
  nome text not null,
  exige_outorga boolean not null default true,
  custo_centavos_ref integer,
  notas text
);
comment on table ref.ecac_servico_map is
  '[P9] SERPRO service dialect map lives at the boundary, not inside core nota/apontamento.';

create table if not exists core.nota (
  id uuid not null default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  cliente_id uuid not null references core.cliente(id) on delete restrict,
  competencia date not null check (competencia = date_trunc('month', competencia)::date),
  competencia_fiscal date check (competencia_fiscal is null or competencia_fiscal = date_trunc('month', competencia_fiscal)::date),
  tipo text not null check (tipo in ('nfe', 'nfce', 'nfse', 'cte', 'mdfe')),
  direcao text not null check (direcao in ('compra', 'venda')),
  chave_acesso text check (chave_acesso is null or length(chave_acesso) between 40 and 54),
  chave_dedup text not null,
  numero text,
  serie text,
  emitida_em date not null,
  emitente_cnpj char(14) not null,
  destinatario_doc text,
  valor_total numeric(15,2) not null check (valor_total >= 0),
  origem text not null check (origem in ('upload', 'provider_ocr', 'provider', 'manual')),
  xml_storage_path text,
  xml_hash bytea,
  status_auditoria text not null default 'nao_analisada'
    check (status_auditoria in ('nao_analisada', 'em_analise', 'analisada', 'sem_divergencia')),
  capturada_em timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id, competencia),
  unique (escritorio_id, chave_dedup, competencia)
) partition by range (competencia);
comment on table core.nota is
  '[P10][P12] Partitioned by competencia. chave_acesso nullable, chave_dedup required. Provider dialect lives in ingestao.';

create table if not exists core.nota_2021 partition of core.nota for values from ('2021-01-01') to ('2022-01-01');
create table if not exists core.nota_2022 partition of core.nota for values from ('2022-01-01') to ('2023-01-01');
create table if not exists core.nota_2023 partition of core.nota for values from ('2023-01-01') to ('2024-01-01');
create table if not exists core.nota_2024 partition of core.nota for values from ('2024-01-01') to ('2025-01-01');
create table if not exists core.nota_2025 partition of core.nota for values from ('2025-01-01') to ('2026-01-01');
create table if not exists core.nota_2026 partition of core.nota for values from ('2026-01-01') to ('2027-01-01');
create table if not exists core.nota_2027 partition of core.nota for values from ('2027-01-01') to ('2028-01-01');

create trigger tg_nota_updated_at
  before update on core.nota
  for each row execute function app.tg_set_updated_at();

create table if not exists core.nota_item (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  nota_id uuid not null,
  competencia date not null,
  numero_item integer not null,
  descricao text not null,
  ncm text,
  cfop text,
  cst text,
  cclasstrib_informado text,
  quantidade numeric(18,4),
  valor_item numeric(15,2) not null default 0,
  created_at timestamptz not null default now(),
  foreign key (nota_id, competencia) references core.nota(id, competencia) on delete restrict,
  unique (nota_id, competencia, numero_item)
);
comment on table core.nota_item is
  '[P10] Not physically partitioned in D0. Carries competencia for composite FK to partitioned core.nota.';

create table if not exists core.analise_execucao (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  item_id uuid not null references core.nota_item(id) on delete restrict,
  motor_versao_id uuid not null references ref.motor_versao(id) on delete restrict,
  base_versao_id uuid not null references ref.base_versao(id) on delete restrict,
  tipo_inferencia text not null
    check (tipo_inferencia in ('humano_concierge', 'regra_deterministica', 'rag')),
  prompt_hash bytea,
  embedding_modelo text,
  retrieval_set jsonb not null default '[]',
  resposta_bruta jsonb,
  params jsonb not null default '{}',
  executada_em timestamptz not null default now(),
  constraint uq_analise unique (item_id, motor_versao_id, base_versao_id)
);
comment on table core.analise_execucao is
  '[P2][P6] Immutable computational provenance. Nullable RAG fields are part of the F1 contract.';
create trigger tg_analise_execucao_immutable
  before update or delete on core.analise_execucao
  for each row execute function app.tg_block_mutation();

create table if not exists core.apontamento_auditoria (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  cliente_id uuid not null references core.cliente(id) on delete restrict,
  item_id uuid not null references core.nota_item(id) on delete restrict,
  base_versao_id uuid not null references ref.base_versao(id) on delete restrict,
  regra_id uuid references ref.cclasstrib_regra(id) on delete restrict,
  motor_versao_id uuid not null references ref.motor_versao(id) on delete restrict,
  analise_execucao_id uuid unique references core.analise_execucao(id) on delete restrict,
  tipo_inferencia text not null
    check (tipo_inferencia in ('humano_concierge', 'regra_deterministica', 'rag')),
  origem text not null default 'manual' check (origem in ('manual', 'motor')),
  tipo_divergencia text not null
    check (tipo_divergencia in ('cclasstrib_divergente', 'ncm_suspeito', 'monofasico_tributado', 'aliquota_divergente', 'cst_divergente', 'credito_potencial', 'outro')),
  cclasstrib_referencia text,
  campo_corrigir text,
  descricao text not null,
  valor_envolvido numeric(15,2),
  confianca numeric(4,3) check (confianca between 0 and 1),
  banda_confianca text not null default 'disputado'
    check (banda_confianca in ('alta', 'media', 'baixa', 'disputado')),
  fundamento jsonb not null default '[]',
  fato_gerador_em date,
  criterios_desempate jsonb not null default '{}',
  status text not null default 'pendente'
    check (status in ('pendente', 'aprovado', 'rejeitado', 'retificado', 'regularizado', 'superado')),
  acao_tipo text check (acao_tipo in ('retificacao', 'recolhimento', 'denuncia_espontanea', 'justificativa_mantida')),
  acao_protocolo text,
  decidir_ate date,
  revisor_id uuid references core.usuario(id),
  revisado_em timestamptz,
  motivo_codigo text,
  motivo_texto text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ck_revisao_completa check (
    (status = 'pendente' and revisor_id is null)
    or (status <> 'pendente' and revisor_id is not null and revisado_em is not null)
  ),
  constraint ck_rejeicao_motivada check (status <> 'rejeitado' or motivo_codigo is not null),
  constraint ck_acao_protocolada check (
    status not in ('retificado', 'regularizado') or acao_protocolo is not null
  ),
  constraint uq_apont_dedup unique (item_id, tipo_divergencia, base_versao_id, motor_versao_id)
);
comment on table core.apontamento_auditoria is
  '[P1][P6][P20] One finding per item/type/base/motor. State changes are materialized by RPC, never by the motor.';

create trigger tg_apontamento_updated_at
  before update on core.apontamento_auditoria
  for each row execute function app.tg_set_updated_at();

create table if not exists core.trilha_cabeca (
  escritorio_id uuid primary key references core.escritorio(id) on delete restrict,
  seq bigint not null default 0,
  hash bytea not null default '\x00',
  hash_ver smallint not null default 1,
  atualizada_em timestamptz not null default now()
);
comment on table core.trilha_cabeca is
  '[P5] Single row per tenant for sequence and hash head. Trigger uses SELECT FOR UPDATE.';

create table if not exists core.evento_boa_fe (
  id bigint generated always as identity primary key,
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  seq_tenant bigint not null,
  hash_ver smallint not null default 1,
  tipo_evento text not null check (tipo_evento in (
    'nota_recebida',
    'analise_executada',
    'apontamento_gerado',
    'apontamento_aprovado',
    'apontamento_rejeitado',
    'apontamento_retificado',
    'apontamento_regularizado',
    'apontamento_escalado',
    'apontamento_superado',
    'decisao_lote',
    'laudo_emitido',
    'laudo_substituido',
    'ajuste_exportado',
    'base_referencia_atualizada',
    'ancora_temporal',
    'restauracao_sistema',
    'xml_expurgado'
  )),
  ator_tipo text not null check (ator_tipo in ('usuario', 'motor', 'sistema')),
  ator_id uuid,
  referente_tipo text check (referente_tipo in ('nota', 'apontamento', 'laudo', 'base', 'analise', 'sistema')),
  referente_id uuid,
  nota_id uuid,
  apontamento_id uuid references core.apontamento_auditoria(id) on delete restrict,
  laudo_id uuid,
  payload jsonb not null default '{}',
  ocorrido_em timestamptz not null default now(),
  hash_anterior bytea not null,
  hash_evento bytea not null,
  constraint ck_superado_bitemporal check (
    tipo_evento <> 'apontamento_superado'
    or (payload ? 'conhecida_em' and payload ? 'vigencia')
  )
);
comment on table core.evento_boa_fe is
  '[P4][P5][P7][P13][P22] Append-only good-faith ledger with versioned hash formula.';

create or replace function core.tg_evento_boa_fe_chain()
returns trigger language plpgsql
as $$
declare
  v_prev bytea;
  v_seq bigint;
  sep constant text := chr(31);
begin
  insert into core.trilha_cabeca (escritorio_id)
  values (new.escritorio_id)
  on conflict (escritorio_id) do nothing;

  select seq, hash
    into v_seq, v_prev
    from core.trilha_cabeca
   where escritorio_id = new.escritorio_id
   for update;

  new.seq_tenant := v_seq + 1;
  new.hash_anterior := v_prev;
  new.hash_ver := coalesce(new.hash_ver, 1);
  new.ocorrido_em := coalesce(new.ocorrido_em, now());

  new.hash_evento := public.digest(
    encode(new.hash_anterior, 'hex') || sep ||
    'escritorio=' || new.escritorio_id::text || sep ||
    'seq=' || new.seq_tenant::text || sep ||
    'hash_ver=' || new.hash_ver::text || sep ||
    'tipo=' || new.tipo_evento || sep ||
    'ator_tipo=' || new.ator_tipo || sep ||
    'ator_id=' || coalesce(new.ator_id::text, '') || sep ||
    'ref_tipo=' || coalesce(new.referente_tipo, '') || sep ||
    'ref_id=' || coalesce(new.referente_id::text, '') || sep ||
    'nota=' || coalesce(new.nota_id::text, '') || sep ||
    'apontamento=' || coalesce(new.apontamento_id::text, '') || sep ||
    'laudo=' || coalesce(new.laudo_id::text, '') || sep ||
    'payload=' || jsonb_strip_nulls(new.payload)::text || sep ||
    'ocorrido=' || to_char(new.ocorrido_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
    'sha256'
  );

  update core.trilha_cabeca
     set seq = new.seq_tenant,
         hash = new.hash_evento,
         hash_ver = new.hash_ver,
         atualizada_em = now()
   where escritorio_id = new.escritorio_id;

  return new;
end $$;

create trigger tg_evento_chain
  before insert on core.evento_boa_fe
  for each row execute function core.tg_evento_boa_fe_chain();

create trigger tg_evento_immutable
  before update or delete on core.evento_boa_fe
  for each row execute function app.tg_block_mutation();

create unique index if not exists uq_evento_seq
  on core.evento_boa_fe (escritorio_id, seq_tenant);

create unique index if not exists uq_evento_referente
  on core.evento_boa_fe (referente_tipo, referente_id, tipo_evento)
  where tipo_evento in (
    'nota_recebida',
    'laudo_emitido',
    'apontamento_aprovado',
    'apontamento_rejeitado',
    'apontamento_regularizado',
    'apontamento_superado'
  );

create or replace function core.tg_apont_exige_evento()
returns trigger language plpgsql
as $$
declare
  v_tipo_evento text;
  v_tem_evento boolean;
begin
  if old.status is distinct from new.status then
    v_tipo_evento := case new.status
      when 'aprovado' then 'apontamento_aprovado'
      when 'rejeitado' then 'apontamento_rejeitado'
      when 'retificado' then 'apontamento_retificado'
      when 'regularizado' then 'apontamento_regularizado'
      when 'superado' then 'apontamento_superado'
      else null
    end;

    if v_tipo_evento is null then
      raise exception '[P20] Unsupported apontamento status transition to %', new.status;
    end if;

    select exists(
      select 1
        from core.evento_boa_fe e
       where e.referente_tipo = 'apontamento'
         and e.referente_id = new.id
         and e.tipo_evento = v_tipo_evento
         and e.apontamento_id = new.id
    ) into v_tem_evento;

    if not v_tem_evento then
      raise exception '[P20] Apontamento % changed to % without matching event % in the same transaction boundary',
        new.id, new.status, v_tipo_evento;
    end if;
  end if;

  return new;
end $$;

create constraint trigger tg_apont_exige_evento
  after update on core.apontamento_auditoria
  deferrable initially deferred
  for each row execute function core.tg_apont_exige_evento();

create table if not exists core.base_adocao (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  base_versao_id uuid not null references ref.base_versao(id) on delete restrict,
  adotada_em timestamptz not null default now(),
  status text not null default 'vigente' check (status in ('vigente', 'superada')),
  created_at timestamptz not null default now(),
  unique (escritorio_id, base_versao_id)
);
comment on table core.base_adocao is
  '[P11] Tenant-scoped adoption state for a global reference base.';

create table if not exists gestao.departamento (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  nome text not null,
  created_at timestamptz not null default now(),
  unique (escritorio_id, nome)
);

create table if not exists gestao.usuario_departamento (
  usuario_id uuid not null references core.usuario(id) on delete cascade,
  departamento_id uuid not null references gestao.departamento(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (usuario_id, departamento_id)
);
comment on table gestao.usuario_departamento is
  '[P8] Gestao can reference core users; core must not reference gestao.';

create table if not exists ingestao.provider_conexao (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  cliente_id uuid not null references core.cliente(id) on delete restrict,
  provider text not null check (provider in ('plugnotas', 'focus')),
  provider_ref text not null,
  ultimo_nsu text,
  provider_meta jsonb not null default '{}',
  captura_ativa boolean not null default false,
  status text not null default 'ativa' check (status in ('ativa', 'pausada', 'erro', 'encerrada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (escritorio_id, cliente_id, provider)
);
comment on table ingestao.provider_conexao is
  '[P9] Provider dialect lives outside core.';

create table if not exists ingestao.ingestao_evento (
  id bigint generated always as identity primary key,
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  provider text not null,
  dedup_key text not null,
  payload jsonb not null,
  status text not null default 'recebido' check (status in ('recebido', 'processado', 'duplicado', 'erro')),
  erro text,
  tentativas smallint not null default 0,
  recebido_em timestamptz not null default now(),
  processado_em timestamptz,
  unique (escritorio_id, provider, dedup_key)
);

create table if not exists ecac.procuracao (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  cliente_id uuid not null references core.cliente(id) on delete restrict,
  codigo_serpro text not null references ref.ecac_servico_map(codigo_serpro) on delete restrict,
  outorgada_em date not null,
  validade date not null,
  status text not null default 'ativa' check (status in ('ativa', 'vencida', 'revogada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists billing.assinatura (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  plano text not null check (plano in ('concierge', 'starter', 'pro', 'scale')),
  franquia_notas integer not null default 0,
  preco_excedente_centavos integer not null default 0,
  status text not null default 'ativa' check (status in ('ativa', 'suspensa', 'cancelada')),
  vigente_desde date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists billing.consumo_mensal (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  competencia date not null check (competencia = date_trunc('month', competencia)::date),
  notas_auditadas integer not null default 0,
  franquia integer not null default 0,
  excedente integer not null default 0,
  fechado_em timestamptz,
  unique (escritorio_id, competencia)
);

create or replace view billing.nota_auditada_para_billing as
select n.escritorio_id,
       n.competencia,
       count(distinct n.id) as notas_auditadas
  from core.nota n
  join core.nota_item ni
    on ni.nota_id = n.id
   and ni.competencia = n.competencia
  join core.apontamento_auditoria a
    on a.item_id = ni.id
 where a.status in ('aprovado', 'rejeitado', 'regularizado')
 group by n.escritorio_id, n.competencia;
comment on view billing.nota_auditada_para_billing is
  '[P9][B11] Billing contract v1. superado does not count as a billed audited note.';

create or replace function core_api_v1.registrar_analise(
  p_escritorio_id uuid,
  p_cliente_id uuid,
  p_item_id uuid,
  p_motor_versao_id uuid,
  p_base_versao_id uuid,
  p_tipo_divergencia text,
  p_descricao text,
  p_confianca numeric default null,
  p_fundamento jsonb default '[]',
  p_cclasstrib_referencia text default null,
  p_valor_envolvido numeric default null,
  p_criterios_desempate jsonb default '{}',
  p_regra_id uuid default null,
  p_prompt_hash bytea default null,
  p_embedding_modelo text default null,
  p_retrieval_set jsonb default '[]',
  p_resposta_bruta jsonb default null,
  p_params jsonb default '{}',
  p_tipo_inferencia text default 'regra_deterministica'
)
returns uuid
language plpgsql
security definer
set search_path = core_api_v1, core, ref, app, pg_catalog
as $$
declare
  v_analise_id uuid;
  v_apontamento_id uuid;
  v_current_tenant uuid;
begin
  v_current_tenant := app.current_escritorio_id();
  if v_current_tenant is not null and v_current_tenant <> p_escritorio_id then
    raise exception '[P20] tenant mismatch for registrar_analise';
  end if;

  if p_tipo_inferencia not in ('regra_deterministica', 'rag') then
    raise exception '[P15] motor registrar_analise cannot materialize human inference: %', p_tipo_inferencia;
  end if;

  insert into core.analise_execucao (
    escritorio_id,
    item_id,
    motor_versao_id,
    base_versao_id,
    tipo_inferencia,
    prompt_hash,
    embedding_modelo,
    retrieval_set,
    resposta_bruta,
    params
  )
  values (
    p_escritorio_id,
    p_item_id,
    p_motor_versao_id,
    p_base_versao_id,
    p_tipo_inferencia,
    p_prompt_hash,
    p_embedding_modelo,
    p_retrieval_set,
    p_resposta_bruta,
    p_params
  )
  on conflict (item_id, motor_versao_id, base_versao_id)
  do nothing
  returning id into v_analise_id;

  if v_analise_id is null then
    select id into v_analise_id
      from core.analise_execucao
     where item_id = p_item_id
       and motor_versao_id = p_motor_versao_id
       and base_versao_id = p_base_versao_id;
  end if;

  insert into core.apontamento_auditoria (
    escritorio_id,
    cliente_id,
    item_id,
    base_versao_id,
    regra_id,
    motor_versao_id,
    analise_execucao_id,
    tipo_inferencia,
    origem,
    tipo_divergencia,
    cclasstrib_referencia,
    descricao,
    valor_envolvido,
    confianca,
    fundamento,
    criterios_desempate
  )
  values (
    p_escritorio_id,
    p_cliente_id,
    p_item_id,
    p_base_versao_id,
    p_regra_id,
    p_motor_versao_id,
    v_analise_id,
    p_tipo_inferencia,
    'motor',
    p_tipo_divergencia,
    p_cclasstrib_referencia,
    p_descricao,
    p_valor_envolvido,
    p_confianca,
    p_fundamento,
    p_criterios_desempate
  )
  on conflict (item_id, tipo_divergencia, base_versao_id, motor_versao_id)
  do nothing
  returning id into v_apontamento_id;

  if v_apontamento_id is null then
    select id into v_apontamento_id
      from core.apontamento_auditoria
     where item_id = p_item_id
       and tipo_divergencia = p_tipo_divergencia
       and base_versao_id = p_base_versao_id
       and motor_versao_id = p_motor_versao_id;
  end if;

  insert into core.evento_boa_fe (
    escritorio_id,
    tipo_evento,
    ator_tipo,
    referente_tipo,
    referente_id,
    apontamento_id,
    payload
  )
  values (
    p_escritorio_id,
    'analise_executada',
    'motor',
    'analise',
    v_analise_id,
    v_apontamento_id,
    jsonb_build_object(
      'analise_execucao_id', v_analise_id,
      'apontamento_id', v_apontamento_id,
      'motor_versao_id', p_motor_versao_id,
      'base_versao_id', p_base_versao_id,
      'tipo_inferencia', p_tipo_inferencia
    )
  );

  return v_apontamento_id;
end $$;
comment on function core_api_v1.registrar_analise is
  '[P15][P19][P20] Published API v1. Motor returns candidates; this RPC materializes analysis + finding + event.';

create or replace function core_api_v1.aprovar_apontamento(
  p_apontamento_id uuid,
  p_revisor_id uuid,
  p_motivo_codigo text default 'aprovado',
  p_motivo_texto text default null
)
returns uuid
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
declare
  v_escritorio_id uuid;
begin
  select escritorio_id
    into v_escritorio_id
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status = 'pendente'
   for update;

  if v_escritorio_id is null then
    raise exception 'apontamento not found or not pending: %', p_apontamento_id;
  end if;

  perform 1
    from core.usuario u
   where u.id = p_revisor_id
     and u.escritorio_id = v_escritorio_id
     and u.ativo = true
     and u.papel = 'contador'
     and u.crc is not null
     and u.crc_situacao = 'ativo';
  if not found then
    raise exception '[P17] reviewer % is not an active contador with CRC for escritorio %', p_revisor_id, v_escritorio_id;
  end if;

  if app.current_escritorio_id() is not null and app.current_escritorio_id() <> v_escritorio_id then
    raise exception '[P20] tenant mismatch for aprovar_apontamento';
  end if;

  insert into core.evento_boa_fe (
    escritorio_id,
    tipo_evento,
    ator_tipo,
    ator_id,
    referente_tipo,
    referente_id,
    apontamento_id,
    payload
  )
  values (
    v_escritorio_id,
    'apontamento_aprovado',
    'usuario',
    p_revisor_id,
    'apontamento',
    p_apontamento_id,
    p_apontamento_id,
    jsonb_build_object(
      'decisao_individualizada', true,
      'motivo_codigo', p_motivo_codigo,
      'motivo_texto', p_motivo_texto,
      'revisor_crc_validado', true
    )
  );

  update core.apontamento_auditoria
     set status = 'aprovado',
         revisor_id = p_revisor_id,
         revisado_em = now(),
         motivo_codigo = p_motivo_codigo,
         motivo_texto = p_motivo_texto
   where id = p_apontamento_id;

  return p_apontamento_id;
end $$;
comment on function core_api_v1.aprovar_apontamento is
  '[P17][P20] Individualized human decision RPC. Must be reviewed by legal/fiscal clones before production use.';

create or replace function core_api_v1.rejeitar_apontamento(
  p_apontamento_id uuid,
  p_revisor_id uuid,
  p_motivo_codigo text,
  p_motivo_texto text default null
)
returns uuid
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
declare
  v_escritorio_id uuid;
begin
  select escritorio_id into v_escritorio_id
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status = 'pendente'
   for update;

  if v_escritorio_id is null then
    raise exception 'apontamento not found or not pending: %', p_apontamento_id;
  end if;

  perform 1
    from core.usuario u
   where u.id = p_revisor_id
     and u.escritorio_id = v_escritorio_id
     and u.ativo = true
     and u.papel = 'contador'
     and u.crc is not null
     and u.crc_situacao = 'ativo';
  if not found then
    raise exception '[P17] reviewer % is not an active contador with CRC for escritorio %', p_revisor_id, v_escritorio_id;
  end if;

  if app.current_escritorio_id() is not null and app.current_escritorio_id() <> v_escritorio_id then
    raise exception '[P20] tenant mismatch for rejeitar_apontamento';
  end if;

  insert into core.evento_boa_fe (
    escritorio_id,
    tipo_evento,
    ator_tipo,
    ator_id,
    referente_tipo,
    referente_id,
    apontamento_id,
    payload
  )
  values (
    v_escritorio_id,
    'apontamento_rejeitado',
    'usuario',
    p_revisor_id,
    'apontamento',
    p_apontamento_id,
    p_apontamento_id,
    jsonb_build_object(
      'decisao_individualizada', true,
      'motivo_codigo', p_motivo_codigo,
      'motivo_texto', p_motivo_texto,
      'revisor_crc_validado', true
    )
  );

  update core.apontamento_auditoria
     set status = 'rejeitado',
         revisor_id = p_revisor_id,
         revisado_em = now(),
         motivo_codigo = p_motivo_codigo,
         motivo_texto = p_motivo_texto
   where id = p_apontamento_id;

  return p_apontamento_id;
end $$;

create or replace function core_api_v1.superar_apontamento(
  p_apontamento_id uuid,
  p_revisor_id uuid,
  p_conhecida_em timestamptz,
  p_vigencia daterange
)
returns uuid
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
declare
  v_escritorio_id uuid;
begin
  select escritorio_id into v_escritorio_id
    from core.apontamento_auditoria
   where id = p_apontamento_id
     and status <> 'superado'
   for update;

  if v_escritorio_id is null then
    raise exception 'apontamento not found or already superado: %', p_apontamento_id;
  end if;

  perform 1
    from core.usuario u
   where u.id = p_revisor_id
     and u.escritorio_id = v_escritorio_id
     and u.ativo = true
     and u.papel = 'contador'
     and u.crc is not null
     and u.crc_situacao = 'ativo';
  if not found then
    raise exception '[P17] reviewer % is not an active contador with CRC for escritorio %', p_revisor_id, v_escritorio_id;
  end if;

  if app.current_escritorio_id() is not null and app.current_escritorio_id() <> v_escritorio_id then
    raise exception '[P20] tenant mismatch for superar_apontamento';
  end if;

  insert into core.evento_boa_fe (
    escritorio_id,
    tipo_evento,
    ator_tipo,
    ator_id,
    referente_tipo,
    referente_id,
    apontamento_id,
    payload
  )
  values (
    v_escritorio_id,
    'apontamento_superado',
    'usuario',
    p_revisor_id,
    'apontamento',
    p_apontamento_id,
    p_apontamento_id,
    jsonb_build_object(
      'conhecida_em', p_conhecida_em,
      'vigencia', p_vigencia::text,
      'decisao_individualizada', true,
      'revisor_crc_validado', true
    )
  );

  update core.apontamento_auditoria
     set status = 'superado',
         revisor_id = p_revisor_id,
         revisado_em = now(),
         motivo_codigo = 'superado'
   where id = p_apontamento_id;

  return p_apontamento_id;
end $$;

revoke all on all functions in schema core_api_v1 from public;
revoke all on schema core_api_v1 from public;

grant usage on schema ref, core, core_api_v1 to motor;
grant select on all tables in schema ref to motor;
grant select on core.nota, core.nota_item to motor;
grant execute on function core_api_v1.registrar_analise(
  uuid, uuid, uuid, uuid, uuid, text, text, numeric, jsonb, text, numeric, jsonb, uuid, bytea, text, jsonb, jsonb, jsonb, text
) to motor;
revoke insert, update, delete on all tables in schema core from motor;

grant usage on schema core, ref, core_api_v1 to authenticated;
grant select on core.escritorio, core.cliente, core.usuario, core.nota, core.nota_item,
  core.analise_execucao, core.apontamento_auditoria, core.evento_boa_fe, core.base_adocao to authenticated;
grant execute on function core_api_v1.aprovar_apontamento(uuid, uuid, text, text) to authenticated;
grant execute on function core_api_v1.rejeitar_apontamento(uuid, uuid, text, text) to authenticated;
grant execute on function core_api_v1.superar_apontamento(uuid, uuid, timestamptz, daterange) to authenticated;

grant usage on schema billing to billing_ro;
grant select on all tables in schema billing to billing_ro;

alter table core.escritorio enable row level security;
alter table core.cliente enable row level security;
alter table core.usuario enable row level security;
alter table core.nota enable row level security;
alter table core.nota_item enable row level security;
alter table core.analise_execucao enable row level security;
alter table core.apontamento_auditoria enable row level security;
alter table core.evento_boa_fe enable row level security;
alter table core.trilha_cabeca enable row level security;
alter table core.base_adocao enable row level security;

create policy p_core_cliente_select on core.cliente for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_core_escritorio_select on core.escritorio for select to authenticated
  using (id = app.current_escritorio_id());
create policy p_core_usuario_select on core.usuario for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_core_nota_select on core.nota for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_core_nota_item_select on core.nota_item for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_core_analise_select on core.analise_execucao for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_core_apont_select on core.apontamento_auditoria for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_core_evento_select on core.evento_boa_fe for select to authenticated
  using (escritorio_id = app.current_escritorio_id());
create policy p_core_base_adocao_select on core.base_adocao for select to authenticated
  using (escritorio_id = app.current_escritorio_id());

revoke insert, update, delete on core.apontamento_auditoria from authenticated, anon;
revoke all on core.trilha_cabeca from authenticated, anon;
revoke update, delete on core.evento_boa_fe from authenticated, anon, service_role;

commit;
