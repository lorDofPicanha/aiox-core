-- Contract checks for the incident/expurgo runbook (doc 49).
-- Proves the DB-enforced controls that freeze evidence and hold the export
-- boundary during an incident: tenant isolation on export-shaped reads,
-- immutability of core.evento_boa_fe and the closeout manifest, and the
-- "no direct closeout write" boundary for the non-privileged role.
-- Run after migrations on a disposable Postgres 15+ database.

begin;

do $$
declare
  v_tenant_a uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  v_tenant_b uuid := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  v_user_a uuid := 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
  v_event_a bigint;
  v_event_b bigint;
  v_closeout_a uuid;
  v_seen integer;
  v_blocked boolean;
begin
  -- Two synthetic tenants, same pattern as 005.
  insert into core.escritorio (id, nome, plano)
  values
    (v_tenant_a, 'Tenant Incident A', 'smoke'),
    (v_tenant_b, 'Tenant Incident B', 'smoke')
  on conflict (id) do nothing;

  insert into core.evento_boa_fe (
    escritorio_id, tipo_evento, ator_tipo, referente_tipo, payload, ocorrido_em
  )
  values
    (v_tenant_a, 'base_referencia_atualizada', 'sistema', 'base', '{"tenant":"a"}'::jsonb, '2026-06-20T10:00:00Z'::timestamptz)
  returning id into v_event_a;

  insert into core.evento_boa_fe (
    escritorio_id, tipo_evento, ator_tipo, referente_tipo, payload, ocorrido_em
  )
  values
    (v_tenant_b, 'base_referencia_atualizada', 'sistema', 'base', '{"tenant":"b"}'::jsonb, '2026-06-20T10:01:00Z'::timestamptz)
  returning id into v_event_b;

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
      '2026-06-20T00:00:00Z',
      '2026-06-21T00:00:00Z',
      1,
      1,
      v_event_a,
      v_event_a,
      1,
      public.digest('tenant-a-first', 'sha256'),
      public.digest('tenant-a-last', 'sha256'),
      public.digest('tenant-a-root', 'sha256'),
      'smoke@006',
      1,
      'pass',
      '{"tenant":"a","manifest_schema_version":"closeout.v1","time_stamp_provider":"none"}'::jsonb,
      public.digest('tenant-a-manifest', 'sha256'),
      'none'
    ),
    (
      v_tenant_b,
      'diario',
      '2026-06-20T00:00:00Z',
      '2026-06-21T00:00:00Z',
      1,
      1,
      v_event_b,
      v_event_b,
      1,
      public.digest('tenant-b-first', 'sha256'),
      public.digest('tenant-b-last', 'sha256'),
      public.digest('tenant-b-root', 'sha256'),
      'smoke@006',
      1,
      'pass',
      '{"tenant":"b","manifest_schema_version":"closeout.v1","time_stamp_provider":"none"}'::jsonb,
      public.digest('tenant-b-manifest', 'sha256'),
      'none'
    );

  select id into v_closeout_a
    from core.closeout_lote
   where escritorio_id = v_tenant_a;

  -- Become the authenticated app role scoped to tenant A.
  set local role authenticated;

  perform set_config(
    'request.jwt.claims',
    jsonb_build_object(
      'sub', v_user_a::text,
      'app_metadata', jsonb_build_object('escritorio_id', v_tenant_a::text, 'papel', 'contador')
    )::text,
    true
  );

  -- ============================================================
  -- Scenario 1: Tenant mismatch on export holds the boundary.
  -- An incident where tenant A's export-shaped read leaks tenant B
  -- must be impossible: RLS returns zero of tenant B's rows.
  -- ============================================================
  select count(*) into v_seen from core.evento_boa_fe where escritorio_id = v_tenant_b;
  if v_seen <> 0 then
    raise exception 'incident export: tenant A must not see tenant B events, saw %', v_seen;
  end if;

  select count(*) into v_seen from core.closeout_lote where escritorio_id = v_tenant_b;
  if v_seen <> 0 then
    raise exception 'incident export: tenant A must not see tenant B closeouts, saw %', v_seen;
  end if;

  -- Sanity: tenant A still sees its own row, so the boundary is selective, not blanket-deny.
  select count(*) into v_seen from core.evento_boa_fe where escritorio_id = v_tenant_a;
  if v_seen <> 1 then
    raise exception 'incident export: tenant A must still see exactly its own event, saw %', v_seen;
  end if;

  -- ============================================================
  -- Scenario 2: Tampering / immutability freezes the evidence.
  -- A direct UPDATE/DELETE on core.evento_boa_fe and on the closeout
  -- manifest must fail, proving the append-only/immutable control.
  -- The contract PASSES when the mutation is correctly blocked.
  -- ============================================================

  -- 2a. UPDATE on the good-faith ledger must be blocked.
  v_blocked := false;
  begin
    update core.evento_boa_fe
       set payload = '{"tampered":true}'::jsonb
     where id = v_event_a;
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'tampering: direct UPDATE on core.evento_boa_fe must be blocked (append-only)';
  end if;

  -- 2b. DELETE on the good-faith ledger must be blocked.
  v_blocked := false;
  begin
    delete from core.evento_boa_fe where id = v_event_a;
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'tampering: direct DELETE on core.evento_boa_fe must be blocked (append-only)';
  end if;

  -- 2c. UPDATE on the closeout manifest must be blocked.
  v_blocked := false;
  begin
    update core.closeout_lote
       set manifesto = '{"tampered":true}'::jsonb
     where id = v_closeout_a;
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'tampering: direct UPDATE on core.closeout_lote manifest must be blocked (immutable)';
  end if;

  -- 2d. DELETE on the closeout manifest must be blocked.
  v_blocked := false;
  begin
    delete from core.closeout_lote where id = v_closeout_a;
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'tampering: direct DELETE on core.closeout_lote manifest must be blocked (immutable)';
  end if;

  -- ============================================================
  -- Scenario 3: No direct closeout write by the non-privileged role.
  -- A direct INSERT into core.closeout_lote by authenticated must be
  -- rejected; writes flow only through core_api_v1.registrar_closeout.
  -- ============================================================
  v_blocked := false;
  begin
    insert into core.closeout_lote (
      escritorio_id,
      tipo,
      periodo_inicio,
      periodo_fim,
      evento_count,
      verifier_version,
      hash_ver,
      resultado,
      manifesto,
      manifesto_hash,
      time_stamp_provider
    )
    values (
      v_tenant_a,
      'diario',
      '2026-06-21T00:00:00Z',
      '2026-06-22T00:00:00Z',
      0,
      'smoke@006-direct',
      1,
      'pass',
      '{"forged":true}'::jsonb,
      public.digest('forged-manifest', 'sha256'),
      'none'
    );
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'no direct closeout write: authenticated must not INSERT into core.closeout_lote directly (write only via RPC)';
  end if;
end $$;

rollback;
