-- ============================================================
-- Construction LCE CRM — per-user settings
-- Table: crm_user_settings (one row per user; their own Google links)
-- RLS: each user can only read/write THEIR OWN row (auth.uid() = user_id).
-- Safe to re-run.
-- ============================================================

create table if not exists public.crm_user_settings (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  booking_url text,
  calendar_id text,
  updated_at  timestamptz not null default now()
);

alter table public.crm_user_settings enable row level security;

drop policy if exists "crm_user_settings_select_own" on public.crm_user_settings;
create policy "crm_user_settings_select_own"
  on public.crm_user_settings for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "crm_user_settings_insert_own" on public.crm_user_settings;
create policy "crm_user_settings_insert_own"
  on public.crm_user_settings for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "crm_user_settings_update_own" on public.crm_user_settings;
create policy "crm_user_settings_update_own"
  on public.crm_user_settings for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "crm_user_settings_delete_own" on public.crm_user_settings;
create policy "crm_user_settings_delete_own"
  on public.crm_user_settings for delete to authenticated
  using (auth.uid() = user_id);
