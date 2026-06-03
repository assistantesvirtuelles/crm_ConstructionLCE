import { supabase } from './supabase.js';

// Canonical lead statuses. `value` is stored in the DB (English, matches the
// CHECK constraint); `label` is shown in the French UI; `pill` maps to the
// StatusPill color palette.
export const LEAD_STATUSES = [
  { value: 'new', label: 'Nouveau', pill: 'new' },
  { value: 'contacted', label: 'Contacté', pill: 'pending' },
  { value: 'qualified', label: 'Qualifié', pill: 'active' },
  { value: 'unqualified', label: 'Non qualifié', pill: 'closed' },
  { value: 'converted', label: 'Converti', pill: 'won' },
  { value: 'lost', label: 'Perdu', pill: 'lost' },
];

const STATUS_BY_VALUE = Object.fromEntries(LEAD_STATUSES.map((s) => [s.value, s]));

export function getStatusMeta(value) {
  return STATUS_BY_VALUE[value] ?? { value, label: value, pill: 'closed' };
}

// Columns the app is allowed to write. Anything else (e.g. stray CSV columns)
// is dropped so inserts don't fail on unknown fields.
const WRITABLE_COLUMNS = [
  'name', 'email', 'phone', 'company', 'title', 'status', 'source', 'notes', 'created_by',
];

function cleanLead(lead) {
  const out = {};
  for (const col of WRITABLE_COLUMNS) {
    if (lead[col] === undefined || lead[col] === null) continue;
    let v = lead[col];
    if (typeof v === 'string') {
      v = v.trim();
      if (v === '') continue; // skip empty strings -> column stays NULL / default
    }
    out[col] = v;
  }
  if (!out.status) out.status = 'new';
  return out;
}

export async function fetchLeads() {
  return supabase
    .from('crm_leads')
    .select('*')
    .order('created_at', { ascending: false });
}

// Live counts for the dashboard: total leads + a tally per status.
export async function fetchLeadStats() {
  const { data, error } = await supabase.from('crm_leads').select('status');
  if (error) return { error };
  const byStatus = {};
  for (const s of LEAD_STATUSES) byStatus[s.value] = 0;
  for (const row of data) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
  }
  return { total: data.length, byStatus };
}

export async function createLead(lead) {
  return supabase.from('crm_leads').insert(cleanLead(lead)).select().single();
}

export async function updateLeadStatus(id, status) {
  return supabase.from('crm_leads').update({ status }).eq('id', id).select().single();
}

// For edits: allowed columns; empty strings become NULL (so fields can be cleared).
const UPDATABLE_COLUMNS = ['name', 'email', 'phone', 'company', 'title', 'status', 'source', 'notes'];

function cleanLeadUpdate(fields) {
  const out = {};
  for (const col of UPDATABLE_COLUMNS) {
    if (fields[col] === undefined) continue;
    let v = fields[col];
    if (typeof v === 'string') {
      v = v.trim();
      if (v === '') v = null;
    }
    out[col] = v;
  }
  return out;
}

export async function updateLead(id, fields) {
  return supabase.from('crm_leads').update(cleanLeadUpdate(fields)).eq('id', id).select().single();
}

export async function deleteLead(id) {
  return supabase.from('crm_leads').delete().eq('id', id);
}

export async function bulkInsertLeads(leads) {
  return supabase.from('crm_leads').insert(leads.map(cleanLead)).select();
}

// ── CSV mapping ────────────────────────────────────────────
// Normalize a header: lowercase, strip accents, collapse spaces.
function normalizeKey(key) {
  return String(key)
    .replace(/﻿/g, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

// Known header aliases (French + English) -> canonical lead field.
const HEADER_ALIASES = {
  name: ['name', 'nom', 'full name', 'nom complet', 'prospect', 'contact'],
  email: ['email', 'e-mail', 'courriel', 'adresse courriel', 'mail'],
  phone: ['phone', 'telephone', 'tel', 'numero', 'numero de telephone', 'mobile', 'cellulaire'],
  company: ['company', 'entreprise', 'societe', 'compagnie', 'organisation'],
  title: ['title', 'titre', 'poste', 'fonction', 'job title'],
  source: ['source', 'provenance', 'origine'],
  status: ['status', 'statut', 'etat'],
  notes: ['notes', 'note', 'commentaires', 'commentaire', 'remarques'],
};

// Build a lookup: normalized header alias -> canonical field.
const ALIAS_LOOKUP = {};
for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
  for (const alias of aliases) ALIAS_LOOKUP[normalizeKey(alias)] = field;
}

// Try to interpret a status cell (French label, English value, etc.).
function normalizeStatus(raw) {
  if (!raw) return 'new';
  const n = normalizeKey(raw);
  for (const s of LEAD_STATUSES) {
    if (normalizeKey(s.value) === n || normalizeKey(s.label) === n) return s.value;
  }
  return 'new';
}

// Convert one parsed CSV row (object keyed by header) into a lead object.
export function mapCsvRowToLead(row) {
  const lead = {};
  for (const [header, value] of Object.entries(row)) {
    const field = ALIAS_LOOKUP[normalizeKey(header)];
    if (!field) continue;
    if (field === 'status') {
      lead.status = normalizeStatus(value);
    } else {
      lead[field] = typeof value === 'string' ? value.trim() : value;
    }
  }
  return lead;
}
