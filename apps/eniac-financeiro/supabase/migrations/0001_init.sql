-- =============================================================================
-- Livro Caixa ENIAC — schema inicial (v1 Núcleo Stafeni)
-- Entradas/saídas multi-empresa, isolamento por RLS via company_members.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Empresas do grupo ENIAC
-- -----------------------------------------------------------------------------
create table if not exists companies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- Vínculo usuário ↔ empresas que pode ver/lançar (base do RLS)
create table if not exists company_members (
  user_id    uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  role       text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (user_id, company_id)
);

-- -----------------------------------------------------------------------------
-- Lançamentos do livro-caixa (entradas e saídas)
-- -----------------------------------------------------------------------------
create table if not exists entries (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references companies(id) on delete cascade,
  entry_date  date not null default current_date,
  type        text not null check (type in ('in', 'out')),  -- entrada / saída
  amount      numeric(15, 2) not null check (amount > 0),
  category    text,
  description text,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

create index if not exists idx_entries_company_date
  on entries (company_id, entry_date desc, created_at desc);

-- -----------------------------------------------------------------------------
-- RLS — usuário só enxerga o que pertence às empresas em que é membro
-- -----------------------------------------------------------------------------
alter table companies       enable row level security;
alter table company_members enable row level security;
alter table entries         enable row level security;

create policy "members read their companies" on companies
  for select using (
    exists (
      select 1 from company_members m
      where m.company_id = companies.id and m.user_id = auth.uid()
    )
  );

create policy "user reads own memberships" on company_members
  for select using (user_id = auth.uid());

create policy "members read entries" on entries
  for select using (
    exists (
      select 1 from company_members m
      where m.company_id = entries.company_id and m.user_id = auth.uid()
    )
  );

create policy "members insert entries" on entries
  for insert with check (
    created_by = auth.uid()
    and exists (
      select 1 from company_members m
      where m.company_id = entries.company_id and m.user_id = auth.uid()
    )
  );

create policy "members update entries" on entries
  for update using (
    exists (
      select 1 from company_members m
      where m.company_id = entries.company_id and m.user_id = auth.uid()
    )
  );

create policy "members delete entries" on entries
  for delete using (
    exists (
      select 1 from company_members m
      where m.company_id = entries.company_id and m.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- Agregados (números SEMPRE computados — princípio do CONTEXT).
-- Funções SQL `stable` rodam com direitos do invocador → RLS continua valendo.
-- -----------------------------------------------------------------------------
create or replace function public.company_balance(p_company uuid)
returns numeric
language sql stable
as $$
  select coalesce(sum(case when type = 'in' then amount else -amount end), 0)
  from entries
  where company_id = p_company;
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
  from entries
  where company_id = p_company
    and extract(year  from entry_date) = p_year
    and extract(month from entry_date) = p_month;
$$;

-- -----------------------------------------------------------------------------
-- Provisionamento: todo novo usuário entra como membro de todas as empresas
-- (ferramenta interna do grupo ENIAC — todos veem as 3). Ajustável depois.
-- -----------------------------------------------------------------------------
create or replace function public.add_user_to_all_companies()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.company_members (user_id, company_id, role)
  select new.id, c.id, 'member' from public.companies c
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.add_user_to_all_companies();

-- -----------------------------------------------------------------------------
-- Seed das empresas (nomes editáveis; só "Sentinela" confirmado)
-- -----------------------------------------------------------------------------
insert into companies (name) values
  ('Sentinela'),
  ('ENIAC 2'),
  ('ENIAC 3')
on conflict do nothing;
