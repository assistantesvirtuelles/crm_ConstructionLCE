-- ============================================================
-- Construction LCE CRM — leads table
-- Table: crm_leads (prospects)
-- Includes Row Level Security (RLS) policies for authenticated users.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.
-- ============================================================

create table if not exists public.crm_leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  phone       text,
  company     text,
  title       text,
  status      text not null default 'new'
               check (status in ('new','contacted','qualified','unqualified','converted','lost')),
  source      text,
  notes       text,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Indexes for common lookups / sorting
create index if not exists crm_leads_email_idx      on public.crm_leads (email);
create index if not exists crm_leads_status_idx     on public.crm_leads (status);
create index if not exists crm_leads_created_at_idx on public.crm_leads (created_at desc);

-- Enable Row Level Security
alter table public.crm_leads enable row level security;

-- Policies: allow any authenticated user full access (matches the other CRM tables)
drop policy if exists "crm_leads_select_authenticated" on public.crm_leads;
create policy "crm_leads_select_authenticated"
  on public.crm_leads for select to authenticated using (true);

drop policy if exists "crm_leads_insert_authenticated" on public.crm_leads;
create policy "crm_leads_insert_authenticated"
  on public.crm_leads for insert to authenticated with check (true);

drop policy if exists "crm_leads_update_authenticated" on public.crm_leads;
create policy "crm_leads_update_authenticated"
  on public.crm_leads for update to authenticated using (true) with check (true);

drop policy if exists "crm_leads_delete_authenticated" on public.crm_leads;
create policy "crm_leads_delete_authenticated"
  on public.crm_leads for delete to authenticated using (true);
