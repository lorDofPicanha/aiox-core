-- Contract checks for G2/G3 runtime RLS and export boundaries.
-- Run after migrations on a disposable Postgres 15+ database.

begin;

do $$
declare
  v_tenant_a uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  v_tenant_b uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  v_user_a uuid := 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
  v_seen integer;
begin
  insert into core.escritorio (id, nome, plano)
  values
    (v_tenant_a, 'Tenant RLS A', 'smoke'),
    (v_tenant_b, 'Tenant RLS B', 'smoke')
  on conflict (id) do nothing;

  insert into core.evento_boa_fe (
    escritorio_id, tipo_evento, ator_tipo, referente_tipo, payload, ocorrido_em
  )
  values
    (v_tenant_a, 'base_referencia_atualizada', 'sistema', 'base', '{"tenant":"a"}'::jsonb, '2026-06-18T10:00:00Z'::timestamptz),
    (v_tenant_b, 'base_referencia_atualizada', 'sistema', 'base', '{"tenant":"b"}'::jsonb, '2026-06-18T10:01:00Z'::timestamptz);

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
    time_stamp_provider
  )
  values
    (
      v_tenant_a,
      'diario',
      '2026-06-18T00:00:00Z',
      '2026-06-19T00:00:00Z',
      1,
      1,
      1,
      1,
      1,
      public.digest('tenant-a-first', 'sha256'),
      public.digest('tenant-a-last', 'sha256'),
      public.digest('tenant-a-root', 'sha256'),
      'smoke@005',
      1,
      'pass',
      '{"tenant":"a","manifest_schema_version":"closeout.v1","time_stamp_provider":"none"}'::jsonb,
      public.digest('tenant-a-manifest', 'sha256'),
      'none'
    ),
    (
      v_tenant_b,
      'diario',
      '2026-06-18T00:00:00Z',
      '2026-06-19T00:00:00Z',
      1,
      1,
      2,
      2,
      1,
      public.digest('tenant-b-first', 'sha256'),
      public.digest('tenant-b-last', 'sha256'),
      public.digest('tenant-b-root', 'sha256'),
      'smoke@005',
      1,
      'pass',
      '{"tenant":"b","manifest_schema_version":"closeout.v1","time_stamp_provider":"none"}'::jsonb,
      public.digest('tenant-b-manifest', 'sha256'),
      'none'
    );

  set local role authenticated;

  perform set_config(
    'request.jwt.claims',
    jsonb_build_object(
      'sub', v_user_a::text,
      'app_metadata', jsonb_build_object('escritorio_id', v_tenant_a::text, 'papel', 'contador')
    )::text,
    true
  );

  select count(*) into v_seen from core.evento_boa_fe where escritorio_id = v_tenant_a;
  if v_seen <> 1 then
    raise exception 'authenticated tenant A must see exactly its own event, saw %', v_seen;
  end if;

  select count(*) into v_seen from core.evento_boa_fe where escritorio_id = v_tenant_b;
  if v_seen <> 0 then
    raise exception 'authenticated tenant A must not see tenant B events, saw %', v_seen;
  end if;

  select count(*) into v_seen from core.closeout_lote where escritorio_id = v_tenant_a;
  if v_seen <> 1 then
    raise exception 'authenticated tenant A must see exactly its own closeout, saw %', v_seen;
  end if;

  select count(*) into v_seen from core.closeout_lote where escritorio_id = v_tenant_b;
  if v_seen <> 0 then
    raise exception 'authenticated tenant A must not see tenant B closeouts, saw %', v_seen;
  end if;

  perform set_config('request.jwt.claims', '{}'::text, true);

  select count(*) into v_seen from core.evento_boa_fe;
  if v_seen <> 0 then
    raise exception 'authenticated without tenant claim must not see events, saw %', v_seen;
  end if;

  select count(*) into v_seen from core.closeout_lote;
  if v_seen <> 0 then
    raise exception 'authenticated without tenant claim must not see closeouts, saw %', v_seen;
  end if;
end $$;

rollback;
