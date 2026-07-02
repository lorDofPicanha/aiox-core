begin;

create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(12);

select has_function(
  'public', 'has_company_role', array['uuid', 'text[]'],
  'role helper exists'
);
select has_function(
  'public', 'post_scheduled_payment', array['uuid', 'date'],
  'transactional payment RPC exists'
);
select has_table('public', 'audit_events', 'audit table exists');
select has_column('public', 'entries', 'voided_at', 'entries support voiding');
select has_column('public', 'scheduled', 'voided_at', 'scheduled supports voiding');
select hasnt_trigger(
  'auth', 'users', 'on_auth_user_created',
  'new auth users are not granted every company'
);
select ok(
  not has_table_privilege('authenticated', 'public.entries', 'DELETE'),
  'authenticated users cannot delete entries'
);
select ok(
  not has_table_privilege('authenticated', 'public.scheduled', 'DELETE'),
  'authenticated users cannot delete scheduled rows'
);

-- Deterministic fixture identities used only inside this rolled-back transaction.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@test.local', crypt('test', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'operator@test.local', crypt('test', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'viewer@test.local', crypt('test', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

insert into public.companies (id, name) values
  ('20000000-0000-0000-0000-000000000001', 'Tenant A'),
  ('20000000-0000-0000-0000-000000000002', 'Tenant B');

insert into public.company_members (user_id, company_id, role) values
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'admin'),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'operator'),
  ('10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'viewer');

insert into public.entries (id, company_id, type, amount, description) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'in', 100, 'A'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'in', 200, 'B');

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000003', true);

select results_eq(
  'select count(*)::bigint from public.entries',
  array[1::bigint],
  'viewer reads only its tenant'
);

select throws_ok(
  $$insert into public.entries (company_id, type, amount, created_by)
    values ('20000000-0000-0000-0000-000000000001', 'out', 10,
      '10000000-0000-0000-0000-000000000003')$$,
  'viewer cannot create entries'
);

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select lives_ok(
  $$insert into public.entries (company_id, type, amount, created_by)
    values ('20000000-0000-0000-0000-000000000001', 'out', 10,
      '10000000-0000-0000-0000-000000000002')$$,
  'operator creates entries in its tenant'
);

select throws_ok(
  $$insert into public.entries (company_id, type, amount, created_by)
    values ('20000000-0000-0000-0000-000000000002', 'out', 10,
      '10000000-0000-0000-0000-000000000002')$$,
  'operator cannot create entries in another tenant'
);

select * from finish();
rollback;
