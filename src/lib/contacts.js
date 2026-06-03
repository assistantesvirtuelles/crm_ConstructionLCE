import { supabase } from './supabase.js';

// Columns the app is allowed to write to crm_contacts.
const WRITABLE_COLUMNS = ['name', 'email', 'phone', 'company', 'title', 'industry', 'notes'];

function cleanContact(contact) {
  const out = {};
  for (const col of WRITABLE_COLUMNS) {
    if (contact[col] === undefined || contact[col] === null) continue;
    let v = contact[col];
    if (typeof v === 'string') {
      v = v.trim();
      if (v === '') continue;
    }
    out[col] = v;
  }
  return out;
}

export async function fetchContacts() {
  return supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function createContact(contact) {
  return supabase.from('crm_contacts').insert(cleanContact(contact)).select().single();
}

// Create a contact from a prospect's info, then mark the prospect as "converted".
// The status update is treated as non-fatal: if it fails, the contact still exists.
export async function convertLeadToContact(lead) {
  const { data, error } = await createContact({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    title: lead.title,
    notes: lead.notes,
  });
  if (error) return { error };

  const { error: statusError } = await supabase
    .from('crm_leads')
    .update({ status: 'converted' })
    .eq('id', lead.id);

  return { data, statusError: statusError ?? null };
}
