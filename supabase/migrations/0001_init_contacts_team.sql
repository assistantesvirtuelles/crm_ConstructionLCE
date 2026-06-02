-- ============================================================
-- Construction LCE CRM — initial schema
-- Tables: crm_contacts, crm_team_members
-- Includes Row Level Security (RLS) policies for authenticated users.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Table 1: crm_contacts
-- ─────────────────────────────────────────────────────────────
create table if not exists public.crm_contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  phone       text,
  company     text,
  title       text,
  industry    text,
  notes       text,
  created_at  timestamptz not null default now()
);

-- Index on email for lookups
create index if not exists crm_contacts_email_idx
  on public.crm_contacts (email);

-- Enable Row Level Security
alter table public.crm_contacts enable row level security;

-- Policies: allow any authenticated user full access
drop policy if exists "crm_contacts_select_authenticated" on public.crm_contacts;
create policy "crm_contacts_select_authenticated"
  on public.crm_contacts
  for select
  to authenticated
  using (true);

drop policy if exists "crm_contacts_insert_authenticated" on public.crm_contacts;
create policy "crm_contacts_insert_authenticated"
  on public.crm_contacts
  for insert
  to authenticated
  with check (true);

drop policy if exists "crm_contacts_update_authenticated" on public.crm_contacts;
create policy "crm_contacts_update_authenticated"
  on public.crm_contacts
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "crm_contacts_delete_authenticated" on public.crm_contacts;
create policy "crm_contacts_delete_authenticated"
  on public.crm_contacts
  for delete
  to authenticated
  using (true);


-- ─────────────────────────────────────────────────────────────
-- Table 2: crm_team_members
-- ─────────────────────────────────────────────────────────────
create table if not exists public.crm_team_members (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users (id) on delete cascade,
  email        text not null,
  name         text,
  role         text default 'admin' check (role in ('owner', 'admin')),
  permissions  text[] not null default '{}'::text[],
  created_at   timestamptz not null default now()
);

-- Index on user_id for lookups / joins to auth.users
create index if not exists crm_team_members_user_id_idx
  on public.crm_team_members (user_id);

-- Enable Row Level Security
alter table public.crm_team_members enable row level security;

-- Policies: allow any authenticated user full access
drop policy if exists "crm_team_members_select_authenticated" on public.crm_team_members;
create policy "crm_team_members_select_authenticated"
  on public.crm_team_members
  for select
  to authenticated
  using (true);

drop policy if exists "crm_team_members_insert_authenticated" on public.crm_team_members;
create policy "crm_team_members_insert_authenticated"
  on public.crm_team_members
  for insert
  to authenticated
  with check (true);

drop policy if exists "crm_team_members_update_authenticated" on public.crm_team_members;
create policy "crm_team_members_update_authenticated"
  on public.crm_team_members
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "crm_team_members_delete_authenticated" on public.crm_team_members;
create policy "crm_team_members_delete_authenticated"
  on public.crm_team_members
  for delete
  to authenticated
  using (true);
