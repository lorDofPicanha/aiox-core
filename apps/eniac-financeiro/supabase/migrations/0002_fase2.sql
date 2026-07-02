-- =============================================================================
-- Livro Caixa ENIAC — Fase 2
-- Contas a pagar/receber (scheduled) + import (external_ref/source) +
-- conexões bancárias (Open Finance / Pluggy).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- entries: origem do lançamento + referência externa (dedup de import/OF)
-- -----------------------------------------------------------------------------
alter table entries add column if not exists source text not null default 'manual';
alter table entries add column if not exists external_ref text;

-- Evita lançar o mesmo item de extrato/OF duas vezes na mesma empresa.
create unique index if not exists uq_entries_company_extref
  on entries (company_id, external_ref)
  where external_ref is not null;

-- -----------------------------------------------------------------------------
-- Contas a pagar / a receber (vencimentos)
-- -----------------------------------------------------------------------------
create table if not exists scheduled (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references companies(id) on delete cascade,
  direction   text not null check (direction in ('receivable', 'payable')), -- a receber / a pagar
  description text,
  category    text,
  amount      numeric(15, 2) not null check (amount > 0),
  due_date    date not null,
  status      text not null default 'open' check (status in ('open', 'paid')),
  paid_at     date,
  entry_id    uuid references entries(id) on delete set null, -- lançamento gerado na baixa
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

create index if not exists idx_scheduled_company_due
  on scheduled (company_id, status, due_date);

-- -----------------------------------------------------------------------------
-- Conexões bancárias (Open Finance via agregador, ex.: Pluggy)
-- -----------------------------------------------------------------------------
create table if not exists bank_connections (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references companies(id) on delete cascade,
  provider       text not null default 'pluggy',
  item_id        text not null,            -- id do item no agregador
  institution    text,
  status         text not null default 'active',
  last_synced_at timestamptz,
  created_by     uuid references auth.users(id),
  created_at     timestamptz not null default now(),
  unique (company_id, item_id)
);

create index if not exists idx_bank_connections_company
  on bank_connections (company_id);

-- -----------------------------------------------------------------------------
-- RLS — mesmo padrão de membership das entries
-- -----------------------------------------------------------------------------
alter table scheduled        enable row level security;
alter table bank_connections enable row level security;

create policy "members read scheduled" on scheduled
  for select using (
    exists (select 1 from company_members m
            where m.company_id = scheduled.company_id and m.user_id = auth.uid())
  );
create policy "members insert scheduled" on scheduled
  for insert with check (
    created_by = auth.uid()
    and exists (select 1 from company_members m
                where m.company_id = scheduled.company_id and m.user_id = auth.uid())
  );
create policy "members update scheduled" on scheduled
  for update using (
    exists (select 1 from company_members m
            where m.company_id = scheduled.company_id and m.user_id = auth.uid())
  );
create policy "members delete scheduled" on scheduled
  for delete using (
    exists (select 1 from company_members m
            where m.company_id = scheduled.company_id and m.user_id = auth.uid())
  );

create policy "members read bank_connections" on bank_connections
  for select using (
    exists (select 1 from company_members m
            where m.company_id = bank_connections.company_id and m.user_id = auth.uid())
  );
create policy "members insert bank_connections" on bank_connections
  for insert with check (
    created_by = auth.uid()
    and exists (select 1 from company_members m
                where m.company_id = bank_connections.company_id and m.user_id = auth.uid())
  );
create policy "members update bank_connections" on bank_connections
  for update using (
    exists (select 1 from company_members m
            where m.company_id = bank_connections.company_id and m.user_id = auth.uid())
  );
create policy "members delete bank_connections" on bank_connections
  for delete using (
    exists (select 1 from company_members m
            where m.company_id = bank_connections.company_id and m.user_id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- Totais de vencimentos em aberto (a pagar / a receber) por empresa
-- -----------------------------------------------------------------------------
create or replace function public.scheduled_open_totals(p_company uuid)
returns table (to_receive numeric, to_pay numeric)
language sql stable
as $$
  select
    coalesce(sum(amount) filter (where direction = 'receivable'), 0) as to_receive,
    coalesce(sum(amount) filter (where direction = 'payable'), 0)    as to_pay
  from scheduled
  where company_id = p_company and status = 'open';
$$;
