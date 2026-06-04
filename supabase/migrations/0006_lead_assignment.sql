-- ============================================================
-- Construction LCE CRM — assign prospects to a team member
-- Adds an assigned_to field to crm_leads.
-- RLS already applies to the table; the new column is covered.
-- Safe to re-run.
-- ============================================================

alter table public.crm_leads
  add column if not exists assigned_to text;
