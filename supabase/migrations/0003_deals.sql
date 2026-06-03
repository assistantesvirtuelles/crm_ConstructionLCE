-- ============================================================
-- Construction LCE CRM — deals / opportunities table
-- Table: crm_deals (opportunités)
-- Includes Row Level Security (RLS) policies for authenticated users.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.
-- ============================================================

create table if not exists public.crm_deals (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  company             text,
  job_type            text,
  value               numeric(14,2),
  stage               text not null default 'prospecting'
                       check (stage in ('prospecting','qualified','proposal','negotiation','won','lost')),
  expected_close_date date,
  notes               text,
  created_by          uuid references auth.users (id) on delete set null,
  created_at          timestamptz not null default now()
);

create index if not exists crm_deals_stage_idx      on public.crm_deals (stage);
create index if not exists crm_deals_created_at_idx  on public.crm_deals (created_at desc);

alter table public.crm_deals enable row level security;

drop policy if exists "crm_deals_select_authenticated" on public.crm_deals;
create policy "crm_deals_select_authenticated"
  on public.crm_deals for select to authenticated using (true);

drop policy if exists "crm_deals_insert_authenticated" on public.crm_deals;
create policy "crm_deals_insert_authenticated"
  on public.crm_deals for insert to authenticated with check (true);

drop policy if exists "crm_deals_update_authenticated" on public.crm_deals;
create policy "crm_deals_update_authenticated"
  on public.crm_deals for update to authenticated using (true) with check (true);

drop policy if exists "crm_deals_delete_authenticated" on public.crm_deals;
create policy "crm_deals_delete_authenticated"
  on public.crm_deals for delete to authenticated using (true);
