-- Contract checks for 001_foundation.sql.
-- Run after migration on a disposable Postgres 15+ database.

begin;

do $$
begin
  if not exists (select 1 from pg_namespace where nspname = 'core_api_v1') then
    raise exception 'core_api_v1 schema missing';
  end if;

  if not exists (
    select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'core_api_v1'
       and p.proname = 'registrar_analise'
  ) then
    raise exception 'core_api_v1.registrar_analise missing';
  end if;

  if exists (
    select 1
      from pg_inherits i
      join pg_class child on child.oid = i.inhrelid
      join pg_class parent on parent.oid = i.inhparent
      join pg_namespace n on n.oid = child.relnamespace
     where n.nspname = 'core'
       and parent.relname = 'nota_item'
  ) then
    raise exception 'nota_item must not be physically partitioned in D0';
  end if;

  if exists (
    select 1
      from pg_constraint c
      join pg_class src on src.oid = c.conrelid
      join pg_namespace srcn on srcn.oid = src.relnamespace
      join pg_class dst on dst.oid = c.confrelid
      join pg_namespace dstn on dstn.oid = dst.relnamespace
     where c.contype = 'f'
       and srcn.nspname = 'core'
       and dstn.nspname in ('gestao', 'ingestao', 'billing', 'ecac')
  ) then
    raise exception 'forbidden FK from core to outer schema';
  end if;

  if exists (
    select 1
      from information_schema.role_table_grants
     where grantee = 'motor'
       and table_schema = 'core'
       and privilege_type in ('INSERT', 'UPDATE', 'DELETE')
  ) then
    raise exception 'motor role must not write core tables directly';
  end if;

  if exists (
    select 1
      from information_schema.role_routine_grants
     where grantee = 'motor'
       and routine_schema = 'core_api_v1'
       and routine_name in ('aprovar_apontamento', 'rejeitar_apontamento', 'superar_apontamento')
  ) then
    raise exception 'motor role must not execute human decision RPCs';
  end if;

  if exists (
    select 1
      from information_schema.role_routine_grants
     where grantee = 'PUBLIC'
       and routine_schema = 'core_api_v1'
  ) then
    raise exception 'core_api_v1 functions must not be executable by PUBLIC';
  end if;

  if not exists (
    select 1 from pg_tables
     where schemaname = 'core'
       and tablename = 'trilha_cabeca'
       and rowsecurity = true
  ) then
    raise exception 'core.trilha_cabeca must have RLS enabled';
  end if;

  if not exists (
    select 1 from pg_trigger
     where tgname = 'tg_evento_immutable'
  ) then
    raise exception 'ledger immutability trigger missing';
  end if;

  if not exists (
    select 1 from pg_trigger
     where tgname = 'tg_apont_exige_evento'
  ) then
    raise exception 'P20 apontamento state changes must require ledger event';
  end if;

  if exists (
    select 1
      from information_schema.columns
     where table_schema = 'core'
       and table_name in ('analise_execucao', 'apontamento_auditoria')
       and column_name = 'base_versao_id'
       and is_nullable = 'YES'
  ) then
    raise exception 'base_versao_id must be NOT NULL for idempotent uniqueness';
  end if;
end $$;

rollback;
