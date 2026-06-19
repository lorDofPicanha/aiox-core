-- Contract checks for 004_closeout_lote.sql.
-- Run after migrations on a disposable Postgres 15+ database.

do $$
declare
  v_escritorio_id uuid := '11111111-1111-4111-8111-111111111111';
  v_closeout_id uuid;
  v_rejected boolean := false;
begin
  insert into core.escritorio (id, nome, plano)
  values (v_escritorio_id, 'Contrato F1.3', 'smoke')
  on conflict (id) do nothing;

  perform set_config(
    'request.jwt.claims',
    '{"app_metadata":{"escritorio_id":"11111111-1111-4111-8111-111111111111","papel":"contador"},"sub":"55555555-5555-4555-8555-555555555555"}',
    true
  );

  if not exists (
    select 1
      from information_schema.tables
     where table_schema = 'core'
       and table_name = 'closeout_lote'
  ) then
    raise exception 'core.closeout_lote must exist';
  end if;

  if not exists (
    select 1
      from information_schema.columns
     where table_schema = 'core'
       and table_name = 'closeout_lote'
       and column_name = 'manifesto_hash'
  ) then
    raise exception 'closeout_lote must persist manifesto_hash';
  end if;

  if not exists (
    select 1
      from pg_policies
     where schemaname = 'core'
       and tablename = 'closeout_lote'
       and policyname = 'p_core_closeout_select'
  ) then
    raise exception 'closeout_lote must have tenant select policy';
  end if;

  if has_table_privilege('authenticated', 'core.closeout_lote', 'UPDATE') then
    raise exception 'authenticated must not update closeout_lote directly';
  end if;

  if has_table_privilege('authenticated', 'core.closeout_lote', 'INSERT') then
    raise exception 'authenticated must not insert closeout_lote directly';
  end if;

  if has_table_privilege('authenticated', 'core.closeout_lote', 'DELETE') then
    raise exception 'authenticated must not delete closeout_lote directly';
  end if;

  if not has_function_privilege(
    'authenticated',
    'core_api_v1.registrar_closeout(uuid, text, timestamp with time zone, timestamp with time zone, bigint, bigint, bigint, bigint, integer, bytea, bytea, bytea, text, smallint, text, jsonb, bytea, uuid, text, text)',
    'EXECUTE'
  ) then
    raise exception 'authenticated must execute registrar_closeout RPC';
  end if;

  v_closeout_id := core_api_v1.registrar_closeout(
    v_escritorio_id,
    'diario'::text,
    '2026-06-15T00:00:00Z'::timestamptz,
    '2026-06-16T00:00:00Z'::timestamptz,
    1::bigint,
    2::bigint,
    101::bigint,
    102::bigint,
    2,
    decode('8fbe9e741317bb721eab97c2337a3014ae587a010d7fdb25cddc66da86f9cbee', 'hex'),
    decode('fb7c850cf171a21e0bdc76e74607003b1db9d5096bfdf7336a1f424c9bc13e36', 'hex'),
    decode('b09b1bf3e488feeb4dc81ac05efc71e4fb974cdd903ee44bd1693da9da6638d3', 'hex'),
    'contador-trilha-verifier@0.1.0'::text,
    1::smallint,
    'pass'::text,
    '{"manifest_schema_version":"closeout.v1","time_stamp_provider":"none"}'::jsonb,
    decode('47a57e48b6f5d610030af1d80477bbd092acdfbdf98274f07d930ac1a9e2925e', 'hex'),
    null::uuid,
    'none'::text,
    null::text
  );

  if not exists (
    select 1
      from core.closeout_lote
     where id = v_closeout_id
       and escritorio_id = v_escritorio_id
       and resultado = 'pass'
       and time_stamp_provider = 'none'
       and time_stamp_token_ref is null
  ) then
    raise exception 'registrar_closeout must persist technical closeout without timestamp promise';
  end if;

  begin
    perform core_api_v1.registrar_closeout(
      v_escritorio_id,
      'diario'::text,
      '2026-06-16T00:00:00Z'::timestamptz,
      '2026-06-17T00:00:00Z'::timestamptz,
      1::bigint,
      2::bigint,
      101::bigint,
      102::bigint,
      2,
      decode('8fbe9e741317bb721eab97c2337a3014ae587a010d7fdb25cddc66da86f9cbee', 'hex'),
      decode('fb7c850cf171a21e0bdc76e74607003b1db9d5096bfdf7336a1f424c9bc13e36', 'hex'),
      null,
      'contador-trilha-verifier@0.1.0'::text,
      1::smallint,
      'pass'::text,
      '{"manifest_schema_version":"closeout.v1","time_stamp_provider":"none"}'::jsonb,
      decode('47a57e48b6f5d610030af1d80477bbd092acdfbdf98274f07d930ac1a9e2925e', 'hex'),
      null::uuid,
      'none'::text,
      'forbidden-token'::text
    );
  exception when others then
    v_rejected := true;
  end;

  if not v_rejected then
    raise exception 'registrar_closeout must reject timestamp token when provider is none';
  end if;
end $$;
