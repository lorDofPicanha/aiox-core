-- Noyce Sprint 0 canonical schema
-- ADR-001: equal-priority multi-source canonical model
-- Target: PostgreSQL / Supabase

create extension if not exists pgcrypto;
create extension if not exists vector;

create type source_access_mode as enum ('public_api', 'public_web', 'authenticated', 'manual_export', 'email_feed', 'unknown');
create type source_tos_risk as enum ('low', 'medium', 'high', 'unknown');
create type workflow_stage as enum ('monitorar', 'analisar', 'indicar', 'habilitar', 'acompanhar', 'recorrer', 'arquivar');
create type confidence_level as enum ('confirmed', 'strong', 'inferred', 'weak', 'conflicting', 'missing');
create type dedupe_decision as enum ('auto_merge', 'candidate_link', 'keep_separate', 'rejected');
create type event_status as enum ('future', 'in_progress', 'done', 'changed', 'missed', 'cancelled', 'unknown');
create type deadline_status as enum ('open', 'due_soon', 'missed', 'done', 'cancelled', 'unknown');
create type competitor_signal_level as enum ('confirmed', 'probable', 'possible', 'no_evidence');

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organization_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('admin', 'operator', 'analyst', 'viewer')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  cnpj text not null,
  legal_name text not null,
  trade_name text,
  is_primary_bidder boolean not null default false,
  default_radius_km integer not null default 500 check (default_radius_km > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, cnpj)
);

create table sources (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  access_mode source_access_mode not null default 'unknown',
  requires_auth boolean not null default false,
  tos_risk source_tos_risk not null default 'unknown',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

insert into sources (code, name, access_mode, requires_auth, tos_risk)
values
  ('pncp', 'PNCP', 'public_api', false, 'low'),
  ('pcp', 'Portal de Compras Publicas', 'public_api', false, 'medium'),
  ('bll', 'BLL', 'public_web', true, 'unknown'),
  ('bnc', 'BNC', 'public_web', true, 'unknown'),
  ('comprasgov', 'ComprasGov', 'public_api', true, 'unknown'),
  ('sislog', 'SISLOG', 'public_web', true, 'unknown')
on conflict (code) do nothing;

create table source_candidates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  base_url text,
  portal_url_example text,
  city_ibge_code text,
  uf char(2),
  buyer_name text,
  buyer_cnpj text,
  example_opportunity_url text,
  example_object text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  seen_count integer not null default 1 check (seen_count > 0),
  access_mode source_access_mode not null default 'unknown',
  requires_auth boolean not null default false,
  has_api_signal boolean not null default false,
  tos_risk source_tos_risk not null default 'unknown',
  adapter_priority integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  source_id uuid references sources(id),
  source_candidate_id uuid references source_candidates(id),
  run_type text not null,
  params jsonb not null default '{}'::jsonb,
  status text not null check (status in ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  error_message text,
  stats jsonb not null default '{}'::jsonb,
  check ((source_id is not null) or (source_candidate_id is not null))
);

create table source_records (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  source_id uuid references sources(id),
  source_candidate_id uuid references source_candidates(id),
  ingestion_run_id uuid references ingestion_runs(id),
  external_id text,
  external_url text,
  raw_payload jsonb not null,
  raw_hash text not null,
  fetched_at timestamptz not null default now(),
  published_at timestamptz,
  adapter_version text,
  normalization_warnings jsonb not null default '[]'::jsonb,
  unique (org_id, source_id, external_id, raw_hash),
  check ((source_id is not null) or (source_candidate_id is not null))
);

create table buyers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  cnpj text,
  name text not null,
  city_ibge_code text,
  city_name text,
  uf char(2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, cnpj)
);

create table suppliers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  cnpj text,
  name text not null,
  city_ibge_code text,
  city_name text,
  uf char(2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, cnpj)
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  canonical_key text not null,
  title text,
  object text not null,
  modality text,
  dispute_mode text,
  status text,
  buyer_id uuid references buyers(id),
  city_ibge_code text,
  city_name text,
  uf char(2),
  estimated_value numeric(16,2),
  currency char(3) not null default 'BRL',
  publication_date date,
  proposal_deadline timestamptz,
  dispute_date timestamptz,
  workflow_stage workflow_stage not null default 'monitorar',
  assigned_user_id uuid,
  stage_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, canonical_key)
);

create table opportunity_source_records (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  source_record_id uuid not null references source_records(id) on delete cascade,
  link_confidence confidence_level not null default 'strong',
  link_reason text,
  created_at timestamptz not null default now(),
  unique (opportunity_id, source_record_id)
);

create table opportunity_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  item_number text,
  description text not null,
  quantity numeric(16,4),
  unit text,
  estimated_unit_value numeric(16,2),
  estimated_total_value numeric(16,2),
  cnae_guess text,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table notice_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid references opportunities(id) on delete cascade,
  source_record_id uuid references source_records(id) on delete set null,
  document_type text not null,
  url text,
  storage_path text,
  sha256 text,
  mime_type text,
  parsed_status text not null default 'pending' check (parsed_status in ('pending', 'parsed', 'failed', 'skipped')),
  parser text,
  parsed_at timestamptz,
  created_at timestamptz not null default now()
);

create table process_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  source_id uuid references sources(id),
  source_candidate_id uuid references source_candidates(id),
  event_type text not null,
  event_status event_status not null default 'unknown',
  occurred_at timestamptz,
  detected_at timestamptz not null default now(),
  title text,
  description text,
  external_url text,
  created_at timestamptz not null default now(),
  check ((source_id is not null) or (source_candidate_id is not null))
);

create table deadlines (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  deadline_type text not null,
  starts_at timestamptz,
  ends_at timestamptz not null,
  source text,
  confidence confidence_level not null default 'inferred',
  status deadline_status not null default 'open',
  created_at timestamptz not null default now()
);

create table price_references (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid references opportunities(id) on delete cascade,
  item_id uuid references opportunity_items(id) on delete set null,
  source_id uuid references sources(id),
  source_candidate_id uuid references source_candidates(id),
  reference_type text not null,
  description text,
  unit_value numeric(16,2),
  total_value numeric(16,2),
  reference_date date,
  buyer_id uuid references buyers(id),
  supplier_id uuid references suppliers(id),
  confidence confidence_level not null default 'inferred',
  evidence_id uuid,
  created_at timestamptz not null default now()
);

create table competitor_signals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  supplier_id uuid references suppliers(id),
  signal_type text not null,
  signal_level competitor_signal_level not null default 'possible',
  source_id uuid references sources(id),
  source_candidate_id uuid references source_candidates(id),
  value jsonb not null default '{}'::jsonb,
  occurred_at timestamptz,
  confidence confidence_level not null default 'inferred',
  evidence_id uuid,
  created_at timestamptz not null default now()
);

create table analysis_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  run_type text not null,
  model_version text not null,
  input_hash text not null,
  score_total numeric(5,2),
  confidence_total numeric(5,2),
  score_components jsonb not null default '{}'::jsonb,
  top_reasons jsonb not null default '[]'::jsonb,
  missing_data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table field_evidence (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  field_name text not null,
  source_record_id uuid references source_records(id),
  document_id uuid references notice_documents(id),
  page integer,
  text_span text,
  raw_value text,
  normalized_value text,
  extraction_method text not null,
  extracted_at timestamptz not null default now(),
  check ((source_record_id is not null) or (document_id is not null))
);

alter table field_evidence
  add constraint field_evidence_org_id_id_unique
  unique (org_id, id);

alter table price_references
  add constraint price_references_evidence_fk
  foreign key (org_id, evidence_id) references field_evidence(org_id, id);

alter table competitor_signals
  add constraint competitor_signals_evidence_fk
  foreign key (org_id, evidence_id) references field_evidence(org_id, id);

create table field_confidence (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  field_name text not null,
  confidence_score numeric(5,2) not null check (confidence_score >= 0 and confidence_score <= 100),
  confidence_level confidence_level not null,
  reason text,
  last_evidence_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, entity_type, entity_id, field_name)
);

alter table field_confidence
  add constraint field_confidence_last_evidence_fk
  foreign key (org_id, last_evidence_id) references field_evidence(org_id, id);

create table dedupe_links (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  left_entity_type text not null,
  left_entity_id uuid not null,
  right_entity_type text not null,
  right_entity_id uuid not null,
  link_type text not null,
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  decision dedupe_decision not null,
  reason text,
  created_at timestamptz not null default now(),
  check (left_entity_id <> right_entity_id)
);

create table document_chunks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  document_id uuid not null references notice_documents(id) on delete cascade,
  chunk_index integer not null,
  section_title text,
  page_start integer,
  page_end integer,
  content text not null,
  embedding vector(1024),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  actor_user_id uuid,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index organization_members_user_idx on organization_members(user_id);
create index companies_org_idx on companies(org_id);
create index source_candidates_org_idx on source_candidates(org_id);
create index source_records_org_source_idx on source_records(org_id, source_id, fetched_at desc);
create unique index source_records_known_source_dedupe_idx
  on source_records(org_id, source_id, coalesce(external_id, ''), raw_hash)
  where source_id is not null;
create unique index source_records_candidate_dedupe_idx
  on source_records(org_id, source_candidate_id, coalesce(external_id, ''), raw_hash)
  where source_candidate_id is not null;
create index buyers_org_cnpj_idx on buyers(org_id, cnpj);
create index suppliers_org_cnpj_idx on suppliers(org_id, cnpj);
create index opportunities_org_stage_idx on opportunities(org_id, workflow_stage, proposal_deadline);
create index opportunities_org_city_idx on opportunities(org_id, city_ibge_code, publication_date desc);
create index opportunity_items_org_opportunity_idx on opportunity_items(org_id, opportunity_id);
create index documents_org_opportunity_idx on notice_documents(org_id, opportunity_id);
create index events_org_opportunity_idx on process_events(org_id, opportunity_id, detected_at desc);
create index deadlines_org_status_idx on deadlines(org_id, status, ends_at);
create index price_refs_org_opportunity_idx on price_references(org_id, opportunity_id);
create index competitor_signals_org_opportunity_idx on competitor_signals(org_id, opportunity_id);
create index analysis_runs_org_opportunity_idx on analysis_runs(org_id, opportunity_id, created_at desc);
create index field_evidence_entity_idx on field_evidence(org_id, entity_type, entity_id, field_name);
create index field_confidence_entity_idx on field_confidence(org_id, entity_type, entity_id, field_name);
create index dedupe_links_org_idx on dedupe_links(org_id, link_type, decision);
create index document_chunks_document_idx on document_chunks(org_id, document_id, chunk_index);
create index audit_events_org_created_idx on audit_events(org_id, created_at desc);

-- Enable RLS on tenant-scoped tables.
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table companies enable row level security;
alter table source_candidates enable row level security;
alter table ingestion_runs enable row level security;
alter table source_records enable row level security;
alter table buyers enable row level security;
alter table suppliers enable row level security;
alter table opportunities enable row level security;
alter table opportunity_source_records enable row level security;
alter table opportunity_items enable row level security;
alter table notice_documents enable row level security;
alter table process_events enable row level security;
alter table deadlines enable row level security;
alter table price_references enable row level security;
alter table competitor_signals enable row level security;
alter table analysis_runs enable row level security;
alter table field_evidence enable row level security;
alter table field_confidence enable row level security;
alter table dedupe_links enable row level security;
alter table document_chunks enable row level security;
alter table audit_events enable row level security;

-- Sources are global reference data. Authenticated users may read them.
alter table sources enable row level security;
create policy sources_read on sources for select to authenticated using (true);

create or replace function is_org_member(target_org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from organization_members m
    where m.org_id = target_org_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function is_org_admin(target_org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from organization_members m
    where m.org_id = target_org_id
      and m.user_id = auth.uid()
      and m.role = 'admin'
  );
$$;

-- Organization access helpers are written inline to keep this file portable.
create policy organizations_member_read on organizations
  for select to authenticated
  using (is_org_member(organizations.id));

create policy organization_members_read on organization_members
  for select to authenticated
  using (is_org_member(organization_members.org_id));

create policy organization_members_admin_write on organization_members
  for all to authenticated
  using (is_org_admin(organization_members.org_id))
  with check (is_org_admin(organization_members.org_id));

-- Repeatable tenant policy pattern. Service-role workers bypass RLS in Supabase;
-- application users are constrained by org membership. Worker code must validate
-- org_id before every write because service-role bypasses these policies.
create policy companies_member_all on companies for all to authenticated
  using (is_org_member(companies.org_id))
  with check (is_org_member(companies.org_id));

create policy source_candidates_member_all on source_candidates for all to authenticated
  using (is_org_member(source_candidates.org_id))
  with check (is_org_member(source_candidates.org_id));

create policy ingestion_runs_member_all on ingestion_runs for all to authenticated
  using (is_org_member(ingestion_runs.org_id))
  with check (is_org_member(ingestion_runs.org_id));

create policy source_records_member_all on source_records for all to authenticated
  using (is_org_member(source_records.org_id))
  with check (is_org_member(source_records.org_id));

create policy buyers_member_all on buyers for all to authenticated
  using (is_org_member(buyers.org_id))
  with check (is_org_member(buyers.org_id));

create policy suppliers_member_all on suppliers for all to authenticated
  using (is_org_member(suppliers.org_id))
  with check (is_org_member(suppliers.org_id));

create policy opportunities_member_all on opportunities for all to authenticated
  using (is_org_member(opportunities.org_id))
  with check (is_org_member(opportunities.org_id));

create policy opportunity_source_records_member_all on opportunity_source_records for all to authenticated
  using (is_org_member(opportunity_source_records.org_id))
  with check (is_org_member(opportunity_source_records.org_id));

create policy opportunity_items_member_all on opportunity_items for all to authenticated
  using (is_org_member(opportunity_items.org_id))
  with check (is_org_member(opportunity_items.org_id));

create policy notice_documents_member_all on notice_documents for all to authenticated
  using (is_org_member(notice_documents.org_id))
  with check (is_org_member(notice_documents.org_id));

create policy process_events_member_all on process_events for all to authenticated
  using (is_org_member(process_events.org_id))
  with check (is_org_member(process_events.org_id));

create policy deadlines_member_all on deadlines for all to authenticated
  using (is_org_member(deadlines.org_id))
  with check (is_org_member(deadlines.org_id));

create policy price_references_member_all on price_references for all to authenticated
  using (is_org_member(price_references.org_id))
  with check (is_org_member(price_references.org_id));

create policy competitor_signals_member_all on competitor_signals for all to authenticated
  using (is_org_member(competitor_signals.org_id))
  with check (is_org_member(competitor_signals.org_id));

create policy analysis_runs_member_all on analysis_runs for all to authenticated
  using (is_org_member(analysis_runs.org_id))
  with check (is_org_member(analysis_runs.org_id));

create policy field_evidence_member_all on field_evidence for all to authenticated
  using (is_org_member(field_evidence.org_id))
  with check (is_org_member(field_evidence.org_id));

create policy field_confidence_member_all on field_confidence for all to authenticated
  using (is_org_member(field_confidence.org_id))
  with check (is_org_member(field_confidence.org_id));

create policy dedupe_links_member_all on dedupe_links for all to authenticated
  using (is_org_member(dedupe_links.org_id))
  with check (is_org_member(dedupe_links.org_id));

create policy document_chunks_member_all on document_chunks for all to authenticated
  using (is_org_member(document_chunks.org_id))
  with check (is_org_member(document_chunks.org_id));

create policy audit_events_member_read on audit_events for select to authenticated
  using (is_org_member(audit_events.org_id));

create policy audit_events_member_insert on audit_events for insert to authenticated
  with check (is_org_member(audit_events.org_id));
