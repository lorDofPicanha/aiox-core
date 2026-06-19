-- Migration: 004_closeout_lote.sql
-- Story: CONTADOR-F1.3-CLOSEOUT
-- Target: PostgreSQL 15+ / Supabase-compatible Postgres

create table if not exists core.closeout_lote (
  id uuid primary key default gen_random_uuid(),
  escritorio_id uuid not null references core.escritorio(id) on delete restrict,
  tipo text not null check (tipo in ('diario', 'mensal', 'corretivo')),
  periodo_inicio timestamptz not null,
  periodo_fim timestamptz not null,
  evento_primeiro_seq bigint,
  evento_ultimo_seq bigint,
  evento_primeiro_id bigint,
  evento_ultimo_id bigint,
  evento_count integer not null check (evento_count >= 0),
  hash_primeiro bytea,
  hash_ultimo bytea,
  merkle_root bytea,
  manifest_schema_version text not null default 'closeout.v1',
  verifier_version text not null,
  hash_ver smallint not null default 1,
  resultado text not null check (resultado in ('pass', 'fail', 'superseded')),
  manifesto jsonb not null,
  manifesto_hash bytea not null,
  time_stamp_provider text not null default 'none' check (time_stamp_provider in ('none', 'act_icp_brasil')),
  time_stamp_token_ref text,
  executado_por uuid,
  executado_em timestamptz not null default now(),
  superseded_by uuid references core.closeout_lote(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint ck_closeout_periodo check (periodo_fim > periodo_inicio),
  constraint ck_closeout_evento_range check (
    evento_count = 0
    or (
      evento_primeiro_seq is not null
      and evento_ultimo_seq is not null
      and evento_primeiro_id is not null
      and evento_ultimo_id is not null
      and hash_primeiro is not null
      and hash_ultimo is not null
      and evento_ultimo_seq >= evento_primeiro_seq
    )
  ),
  constraint ck_closeout_timestamp_none check (
    time_stamp_provider <> 'none'
    or time_stamp_token_ref is null
  ),
  constraint ck_closeout_external_timestamp_requires_token check (
    time_stamp_provider = 'none'
    or time_stamp_token_ref is not null
  )
);

comment on table core.closeout_lote is
  '[F1.3] Technical closeout manifest for good-faith ledger windows. No ICP-Brasil/PAdES promise while time_stamp_provider=none.';

create unique index if not exists uq_closeout_lote_window
  on core.closeout_lote (escritorio_id, tipo, periodo_inicio, periodo_fim)
  where resultado <> 'superseded';

create index if not exists idx_closeout_lote_escritorio_periodo
  on core.closeout_lote (escritorio_id, periodo_inicio, periodo_fim);

create trigger tg_closeout_lote_immutable
  before update or delete on core.closeout_lote
  for each row execute function app.tg_block_mutation();

alter table core.closeout_lote enable row level security;

create policy p_core_closeout_select on core.closeout_lote for select to authenticated
  using (escritorio_id = app.current_escritorio_id());

create or replace function core_api_v1.registrar_closeout(
  p_escritorio_id uuid,
  p_tipo text,
  p_periodo_inicio timestamptz,
  p_periodo_fim timestamptz,
  p_evento_primeiro_seq bigint,
  p_evento_ultimo_seq bigint,
  p_evento_primeiro_id bigint,
  p_evento_ultimo_id bigint,
  p_evento_count integer,
  p_hash_primeiro bytea,
  p_hash_ultimo bytea,
  p_merkle_root bytea,
  p_verifier_version text,
  p_hash_ver smallint,
  p_resultado text,
  p_manifesto jsonb,
  p_manifesto_hash bytea,
  p_executado_por uuid default null,
  p_time_stamp_provider text default 'none',
  p_time_stamp_token_ref text default null
)
returns uuid
language plpgsql
security definer
set search_path = core_api_v1, core, app, pg_catalog
as $$
declare
  v_id uuid;
begin
  if app.current_escritorio_id() is null then
    raise exception 'tenant claim required';
  end if;

  if app.current_escritorio_id() <> p_escritorio_id then
    raise exception 'tenant mismatch for closeout';
  end if;

  if p_time_stamp_provider = 'none' and p_time_stamp_token_ref is not null then
    raise exception 'time_stamp_token_ref must be null when provider is none';
  end if;

  insert into core.closeout_lote (
    escritorio_id,
    tipo,
    periodo_inicio,
    periodo_fim,
    evento_primeiro_seq,
    evento_ultimo_seq,
    evento_primeiro_id,
    evento_ultimo_id,
    evento_count,
    hash_primeiro,
    hash_ultimo,
    merkle_root,
    verifier_version,
    hash_ver,
    resultado,
    manifesto,
    manifesto_hash,
    time_stamp_provider,
    time_stamp_token_ref,
    executado_por
  )
  values (
    p_escritorio_id,
    p_tipo,
    p_periodo_inicio,
    p_periodo_fim,
    p_evento_primeiro_seq,
    p_evento_ultimo_seq,
    p_evento_primeiro_id,
    p_evento_ultimo_id,
    p_evento_count,
    p_hash_primeiro,
    p_hash_ultimo,
    p_merkle_root,
    p_verifier_version,
    p_hash_ver,
    p_resultado,
    p_manifesto,
    p_manifesto_hash,
    p_time_stamp_provider,
    p_time_stamp_token_ref,
    p_executado_por
  )
  returning id into v_id;

  return v_id;
end $$;

comment on function core_api_v1.registrar_closeout is
  '[F1.3] Published RPC to persist technical closeout manifests. Requires tenant claim; does not create ICP-Brasil/PAdES timestamp.';

revoke all on core.closeout_lote from anon;
revoke insert, update, delete on core.closeout_lote from authenticated, anon, service_role;
grant select on core.closeout_lote to authenticated;
revoke all on function core_api_v1.registrar_closeout(
  uuid, text, timestamptz, timestamptz, bigint, bigint, bigint, bigint, integer, bytea, bytea, bytea, text, smallint, text, jsonb, bytea, uuid, text, text
) from public, anon, motor;
grant execute on function core_api_v1.registrar_closeout(
  uuid, text, timestamptz, timestamptz, bigint, bigint, bigint, bigint, integer, bytea, bytea, bytea, text, smallint, text, jsonb, bytea, uuid, text, text
) to authenticated;
