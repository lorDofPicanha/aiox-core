-- =============================================================================
-- ENIAC Financeiro P0 — security, auditability and transactional integrity.
-- Additive migration: preserves every existing financial row.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- Explicit roles. Preserve current legitimate access by mapping member->operator.
-- -----------------------------------------------------------------------------
update public.company_members set role = 'operator' where role = 'member';

alter table public.company_members alter column role set default 'viewer';
alter table public.company_members drop constraint if exists company_members_role_check;
alter table public.company_members
  add constraint company_members_role_check
  check (role in ('admin', 'operator', 'viewer'));

-- Account creation must never imply authorization.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.add_user_to_all_companies();

-- Central role check used by policies and security-definer RPCs. The function
-- returns only a boolean and has a fixed search_path to avoid object shadowing.
create or replace function public.has_company_role(p_company uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.company_members membership
    where membership.company_id = p_company
      and membership.user_id = auth.uid()
      and membership.role = any (p_roles)
  );
$$;

revoke all on function public.has_company_role(uuid, text[]) from public;
grant execute on function public.has_company_role(uuid, text[]) to authenticated;

-- -----------------------------------------------------------------------------
-- Auditable voiding. Application users no longer delete ledger history.
-- -----------------------------------------------------------------------------
alter table public.entries add column if not exists voided_at timestamptz;
alter table public.entries add column if not exists voided_by uuid references auth.users(id);
alter table public.entries add column if not exists void_reason text;

alter table public.entries drop constraint if exists entries_void_consistency_check;
alter table public.entries
  add constraint entries_void_consistency_check check (
    (voided_at is null and voided_by is null and void_reason is null)
    or
    (voided_at is not null and voided_by is not null and nullif(btrim(void_reason), '') is not null)
  );

alter table public.scheduled add column if not exists voided_at timestamptz;
alter table public.scheduled add column if not exists voided_by uuid references auth.users(id);
alter table public.scheduled add column if not exists void_reason text;

alter table public.scheduled drop constraint if exists scheduled_status_check;
alter table public.scheduled
  add constraint scheduled_status_check check (status in ('open', 'paid', 'void'));

alter table public.scheduled drop constraint if exists scheduled_void_consistency_check;
alter table public.scheduled
  add constraint scheduled_void_consistency_check check (
    (status <> 'void' and voided_at is null and voided_by is null and void_reason is null)
    or
    (status = 'void' and voided_at is not null and voided_by is not null
      and nullif(btrim(void_reason), '') is not null)
  );

create table if not exists public.audit_events (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.companies(id) on delete restrict,
  actor_id    uuid references auth.users(id) on delete set null,
  entity_type text not null check (entity_type in ('entry', 'scheduled', 'membership', 'bank_connection')),
  entity_id   uuid not null,
  action      text not null check (action in ('created', 'updated', 'voided', 'paid', 'role_changed')),
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_audit_events_company_created
  on public.audit_events (company_id, created_at desc);

alter table public.audit_events enable row level security;

-- Minimal metadata only: no descriptions, bank payloads or credentials.
create or replace function public.record_financial_audit_event()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_action text;
  v_company uuid;
  v_entity uuid;
  v_metadata jsonb := '{}'::jsonb;
begin
  v_company := new.company_id;
  v_entity := new.id;

  if tg_op = 'INSERT' then
    v_action := 'created';
  elsif tg_table_name = 'entries' and old.voided_at is null and new.voided_at is not null then
    v_action := 'voided';
  elsif tg_table_name = 'scheduled' and old.status <> 'void' and new.status = 'void' then
    v_action := 'voided';
    v_metadata := jsonb_build_object('status', 'void');
  elsif tg_table_name = 'scheduled' and old.status <> 'paid' and new.status = 'paid' then
    v_action := 'paid';
    v_metadata := jsonb_build_object('status', 'paid', 'entry_id', new.entry_id);
  else
    v_action := 'updated';
  end if;

  insert into public.audit_events (
    company_id, actor_id, entity_type, entity_id, action, metadata
  ) values (
    v_company, auth.uid(),
    case when tg_table_name = 'entries' then 'entry' else 'scheduled' end,
    v_entity, v_action, v_metadata
  );

  return new;
end;
$$;

revoke all on function public.record_financial_audit_event() from public;

create or replace function public.enforce_financial_immutability()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.company_id <> old.company_id or new.created_by is distinct from old.created_by then
    raise exception 'financial ownership is immutable';
  end if;

  if tg_table_name = 'entries' and old.voided_at is not null then
    raise exception 'voided entry is immutable';
  end if;

  if tg_table_name = 'scheduled' and old.status in ('paid', 'void') then
    raise exception 'closed scheduled item is immutable';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_financial_immutability() from public;

drop trigger if exists protect_entries_immutability on public.entries;
create trigger protect_entries_immutability
  before update on public.entries
  for each row execute function public.enforce_financial_immutability();

drop trigger if exists protect_scheduled_immutability on public.scheduled;
create trigger protect_scheduled_immutability
  before update on public.scheduled
  for each row execute function public.enforce_financial_immutability();

drop trigger if exists audit_entries_changes on public.entries;
create trigger audit_entries_changes
  after insert or update on public.entries
  for each row execute function public.record_financial_audit_event();

drop trigger if exists audit_scheduled_changes on public.scheduled;
create trigger audit_scheduled_changes
  after insert or update on public.scheduled
  for each row execute function public.record_financial_audit_event();

-- -----------------------------------------------------------------------------
-- Replace broad membership-only policies with tenant + role policies.
-- -----------------------------------------------------------------------------
drop policy if exists "members read their companies" on public.companies;
drop policy if exists "user reads own memberships" on public.company_members;
drop policy if exists "members read entries" on public.entries;
drop policy if exists "members insert entries" on public.entries;
drop policy if exists "members update entries" on public.entries;
drop policy if exists "members delete entries" on public.entries;
drop policy if exists "members read scheduled" on public.scheduled;
drop policy if exists "members insert scheduled" on public.scheduled;
drop policy if exists "members update scheduled" on public.scheduled;
drop policy if exists "members delete scheduled" on public.scheduled;
drop policy if exists "members read bank_connections" on public.bank_connections;
drop policy if exists "members insert bank_connections" on public.bank_connections;
drop policy if exists "members update bank_connections" on public.bank_connections;
drop policy if exists "members delete bank_connections" on public.bank_connections;

create policy "members read their companies" on public.companies
  for select using (public.has_company_role(id, array['admin', 'operator', 'viewer']));

create policy "members read memberships" on public.company_members
  for select using (
    user_id = auth.uid() or public.has_company_role(company_id, array['admin'])
  );
create policy "admins insert memberships" on public.company_members
  for insert with check (public.has_company_role(company_id, array['admin']));
create policy "admins update memberships" on public.company_members
  for update using (public.has_company_role(company_id, array['admin']))
  with check (public.has_company_role(company_id, array['admin']));
create policy "admins delete memberships" on public.company_members
  for delete using (public.has_company_role(company_id, array['admin']));

create policy "members read entries" on public.entries
  for select using (public.has_company_role(company_id, array['admin', 'operator', 'viewer']));
create policy "operators insert entries" on public.entries
  for insert with check (
    created_by = auth.uid()
    and voided_at is null
    and public.has_company_role(company_id, array['admin', 'operator'])
  );
create policy "operators update entries" on public.entries
  for update using (public.has_company_role(company_id, array['admin', 'operator']))
  with check (public.has_company_role(company_id, array['admin', 'operator']));

create policy "members read scheduled" on public.scheduled
  for select using (public.has_company_role(company_id, array['admin', 'operator', 'viewer']));
create policy "operators insert scheduled" on public.scheduled
  for insert with check (
    created_by = auth.uid()
    and status = 'open'
    and public.has_company_role(company_id, array['admin', 'operator'])
  );
create policy "operators update scheduled" on public.scheduled
  for update using (public.has_company_role(company_id, array['admin', 'operator']))
  with check (public.has_company_role(company_id, array['admin', 'operator']));

create policy "members read bank connections" on public.bank_connections
  for select using (public.has_company_role(company_id, array['admin', 'operator', 'viewer']));
create policy "operators insert bank connections" on public.bank_connections
  for insert with check (
    created_by = auth.uid()
    and public.has_company_role(company_id, array['admin', 'operator'])
  );
create policy "operators update bank connections" on public.bank_connections
  for update using (public.has_company_role(company_id, array['admin', 'operator']))
  with check (public.has_company_role(company_id, array['admin', 'operator']));
create policy "operators delete bank connections" on public.bank_connections
  for delete using (public.has_company_role(company_id, array['admin', 'operator']));

create policy "admins read audit events" on public.audit_events
  for select using (public.has_company_role(company_id, array['admin']));

-- Explicit table privileges reinforce RLS and avoid relying on platform defaults.
grant select on public.companies, public.company_members, public.entries,
  public.scheduled, public.bank_connections, public.audit_events to authenticated;
grant insert on public.entries, public.scheduled, public.bank_connections to authenticated;
grant insert, update, delete on public.company_members to authenticated;
grant update, delete on public.bank_connections to authenticated;

revoke update, delete on public.entries, public.scheduled from anon, authenticated;
revoke insert, update, delete on public.audit_events from anon, authenticated;

-- -----------------------------------------------------------------------------
-- Aggregates ignore voided ledger rows.
-- -----------------------------------------------------------------------------
create or replace function public.company_balance(p_company uuid)
returns numeric
language sql stable
as $$
  select coalesce(sum(case when type = 'in' then amount else -amount end), 0)
  from public.entries
  where company_id = p_company and voided_at is null;
$$;

create or replace function public.company_month_totals(
  p_company uuid, p_year int, p_month int
)
returns table (total_in numeric, total_out numeric)
language sql stable
as $$
  select
    coalesce(sum(amount) filter (where type = 'in'), 0)  as total_in,
    coalesce(sum(amount) filter (where type = 'out'), 0) as total_out
  from public.entries
  where company_id = p_company
    and voided_at is null
    and extract(year from entry_date) = p_year
    and extract(month from entry_date) = p_month;
$$;

-- -----------------------------------------------------------------------------
-- Atomic and idempotent scheduled posting.
-- -----------------------------------------------------------------------------
create or replace function public.post_scheduled_payment(
  p_scheduled_id uuid,
  p_paid_at date
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_scheduled public.scheduled%rowtype;
  v_entry_id uuid;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  select * into v_scheduled
  from public.scheduled
  where id = p_scheduled_id
  for update;

  if not found then
    raise exception 'scheduled item not found';
  end if;

  if not public.has_company_role(v_scheduled.company_id, array['admin', 'operator']) then
    raise exception 'insufficient permission';
  end if;

  if v_scheduled.status = 'paid' and v_scheduled.entry_id is not null then
    return v_scheduled.entry_id;
  end if;

  if v_scheduled.status <> 'open' or p_paid_at is null then
    raise exception 'scheduled item is not open';
  end if;

  insert into public.entries (
    company_id, entry_date, type, amount, category, description,
    created_by, source, external_ref
  ) values (
    v_scheduled.company_id,
    p_paid_at,
    case when v_scheduled.direction = 'receivable' then 'in' else 'out' end,
    v_scheduled.amount,
    v_scheduled.category,
    v_scheduled.description,
    auth.uid(),
    'scheduled',
    'scheduled:' || v_scheduled.id::text
  ) returning id into v_entry_id;

  update public.scheduled
  set status = 'paid', paid_at = p_paid_at, entry_id = v_entry_id
  where id = v_scheduled.id;

  return v_entry_id;
end;
$$;

revoke all on function public.post_scheduled_payment(uuid, date) from public;
grant execute on function public.post_scheduled_payment(uuid, date) to authenticated;

create or replace function public.void_entry(p_entry_id uuid, p_reason text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_entry public.entries%rowtype;
begin
  select * into v_entry from public.entries where id = p_entry_id for update;
  if not found then return false; end if;

  if not public.has_company_role(v_entry.company_id, array['admin', 'operator']) then
    raise exception 'insufficient permission';
  end if;
  if v_entry.voided_at is not null then return true; end if;
  if nullif(btrim(p_reason), '') is null or length(p_reason) > 500 then
    raise exception 'invalid void reason';
  end if;

  update public.entries
  set voided_at = now(), voided_by = auth.uid(), void_reason = btrim(p_reason)
  where id = v_entry.id;
  return true;
end;
$$;

revoke all on function public.void_entry(uuid, text) from public;
grant execute on function public.void_entry(uuid, text) to authenticated;

create or replace function public.void_scheduled(p_scheduled_id uuid, p_reason text)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_scheduled public.scheduled%rowtype;
begin
  select * into v_scheduled from public.scheduled where id = p_scheduled_id for update;
  if not found then return false; end if;

  if not public.has_company_role(v_scheduled.company_id, array['admin', 'operator']) then
    raise exception 'insufficient permission';
  end if;
  if v_scheduled.status = 'void' then return true; end if;
  if v_scheduled.status <> 'open' then raise exception 'scheduled item is not open'; end if;
  if nullif(btrim(p_reason), '') is null or length(p_reason) > 500 then
    raise exception 'invalid void reason';
  end if;

  update public.scheduled
  set status = 'void', voided_at = now(), voided_by = auth.uid(), void_reason = btrim(p_reason)
  where id = v_scheduled.id;
  return true;
end;
$$;

revoke all on function public.void_scheduled(uuid, text) from public;
grant execute on function public.void_scheduled(uuid, text) to authenticated;

grant execute on function public.company_balance(uuid) to authenticated;
grant execute on function public.company_month_totals(uuid, int, int) to authenticated;
grant execute on function public.scheduled_open_totals(uuid) to authenticated;

commit;
