-- ============================================================
-- Construction LCE CRM — email connection (per-user)
-- Adds email provider + address to crm_user_settings.
-- RLS already applies to the table; new columns are covered.
-- Safe to re-run.
-- ============================================================

alter table public.crm_user_settings
  add column if not exists email_provider text,
  add column if not exists email_address  text;
