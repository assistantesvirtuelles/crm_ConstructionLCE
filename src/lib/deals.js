import { supabase } from './supabase.js';

// Job types (Type de travaux) — shown in the Créer une opportunité form.
export const JOB_TYPES = [
  'Rénovation commerciale',
  'Construction multi-logement',
  'Agrandissement',
  'Services professionnels',
  'Après-sinistre',
  'Construction résidentielle',
];

// Pipeline stages. `value` is stored (matches the DB CHECK), `label` shown in the UI.
export const DEAL_STAGES = [
  { value: 'prospecting', label: 'Prospection', pill: 'new' },
  { value: 'qualified', label: 'Qualification', pill: 'pending' },
  { value: 'proposal', label: 'Proposition', pill: 'pending' },
  { value: 'negotiation', label: 'Négociation', pill: 'active' },
  { value: 'won', label: 'Gagné', pill: 'won' },
  { value: 'lost', label: 'Perdu', pill: 'lost' },
];

const STAGE_BY_VALUE = Object.fromEntries(DEAL_STAGES.map((s) => [s.value, s]));

export function getStageMeta(value) {
  return STAGE_BY_VALUE[value] ?? { value, label: value, pill: 'closed' };
}

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(n);
}

const WRITABLE_COLUMNS = [
  'name', 'company', 'job_type', 'value', 'stage', 'expected_close_date', 'notes', 'created_by',
];

function cleanDeal(deal) {
  const out = {};
  for (const col of WRITABLE_COLUMNS) {
    if (deal[col] === undefined || deal[col] === null) continue;
    let v = deal[col];
    if (typeof v === 'string') {
      v = v.trim();
      if (v === '') continue;
    }
    if (col === 'value') {
      const n = Number(String(v).replace(/[^0-9.,-]/g, '').replace(',', '.'));
      if (Number.isNaN(n)) continue;
      v = n;
    }
    out[col] = v;
  }
  if (!out.stage) out.stage = 'prospecting';
  return out;
}

export async function fetchDeals() {
  return supabase
    .from('crm_deals')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function createDeal(deal) {
  return supabase.from('crm_deals').insert(cleanDeal(deal)).select().single();
}

export async function updateDealStage(id, stage) {
  return supabase.from('crm_deals').update({ stage }).eq('id', id).select().single();
}

const UPDATABLE_DEAL_COLUMNS = ['name', 'company', 'job_type', 'value', 'stage', 'expected_close_date', 'notes'];

function cleanDealUpdate(fields) {
  const out = {};
  for (const col of UPDATABLE_DEAL_COLUMNS) {
    if (fields[col] === undefined) continue;
    let v = fields[col];
    if (typeof v === 'string') {
      v = v.trim();
      if (v === '') v = null;
    }
    if (col === 'value' && v !== null) {
      const n = Number(String(v).replace(/[^0-9.,-]/g, '').replace(',', '.'));
      v = Number.isNaN(n) ? null : n;
    }
    out[col] = v;
  }
  return out;
}

export async function updateDeal(id, fields) {
  return supabase.from('crm_deals').update(cleanDealUpdate(fields)).eq('id', id).select().single();
}

export async function deleteDeal(id) {
  return supabase.from('crm_deals').delete().eq('id', id);
}

// Dashboard stats: active (open) deals + won revenue.
export async function fetchDealStats() {
  const { data, error } = await supabase.from('crm_deals').select('stage, value');
  if (error) return { error };
  let active = 0;
  let revenue = 0;
  for (const d of data) {
    if (d.stage !== 'won' && d.stage !== 'lost') active += 1;
    if (d.stage === 'won') revenue += Number(d.value) || 0;
  }
  return { total: data.length, active, revenue };
}
