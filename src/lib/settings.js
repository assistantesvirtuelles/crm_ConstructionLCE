import { supabase } from './supabase.js';

export const DEFAULT_TIMEZONE = 'America/Toronto';

// Fetch the current user's settings row (or null if none yet).
export async function fetchUserSettings(userId) {
  return supabase
    .from('crm_user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
}

// Create or update the current user's settings row.
export async function upsertUserSettings(userId, values) {
  return supabase
    .from('crm_user_settings')
    .upsert(
      { user_id: userId, ...values, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select()
    .single();
}

// Remove the current user's settings row (disconnect their calendar/booking).
export async function deleteUserSettings(userId) {
  return supabase.from('crm_user_settings').delete().eq('user_id', userId);
}

// Accept either a bare calendar ID/email OR a pasted Google Calendar URL,
// and return just the calendar ID. This makes the Settings field forgiving:
// pasting the full embed URL (…/embed?src=you%40domain.ca&ctz=…) still works.
export function extractCalendarId(input) {
  if (!input) return '';
  let v = String(input).trim();
  const match = v.match(/[?&]src=([^&\s]+)/i);
  if (match) {
    try {
      v = decodeURIComponent(match[1]);
    } catch (e) {
      v = match[1];
    }
  }
  return v.trim();
}

// ── Email ──────────────────────────────────────────────────
export const EMAIL_PROVIDERS = [
  { value: 'gmail', label: 'Gmail / Google Workspace' },
  { value: 'outlook', label: 'Outlook / Microsoft 365' },
  { value: 'other', label: 'Autre (application par défaut)' },
];

const EMAIL_PROVIDER_LABELS = Object.fromEntries(EMAIL_PROVIDERS.map((p) => [p.value, p.label]));

export function getEmailProviderLabel(value) {
  return EMAIL_PROVIDER_LABELS[value] ?? value;
}

// Webmail inbox URL for a provider (empty for "other" / default mail app).
// `account` (the connected email) targets a specific Google account via authuser,
// so multi-account users open the right inbox.
export function buildInboxUrl(provider, account = '') {
  if (provider === 'gmail') {
    return account
      ? `https://mail.google.com/mail/?authuser=${encodeURIComponent(account)}`
      : 'https://mail.google.com/mail/';
  }
  if (provider === 'outlook') return 'https://outlook.office.com/mail/';
  return '';
}

// Compose URL for a provider, optionally pre-addressed/pre-filled.
// `account` targets a specific Google account (authuser) for multi-account users.
export function buildComposeUrl(provider, { to = '', subject = '', body = '' } = {}, account = '') {
  if (provider === 'gmail') {
    const p = new URLSearchParams({ view: 'cm', fs: '1' });
    if (account) p.set('authuser', account);
    if (to) p.set('to', to);
    if (subject) p.set('su', subject);
    if (body) p.set('body', body);
    return `https://mail.google.com/mail/?${p.toString()}`;
  }
  if (provider === 'outlook') {
    const p = new URLSearchParams();
    if (to) p.set('to', to);
    if (subject) p.set('subject', subject);
    if (body) p.set('body', body);
    return `https://outlook.office.com/mail/deeplink/compose?${p.toString()}`;
  }
  // default mail app
  const parts = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to}${parts.length ? '?' + parts.join('&') : ''}`;
}

// Build a Google Calendar agenda (list) embed URL from a calendar ID / email.
export function buildCalendarEmbedUrl(calendarId, timezone = DEFAULT_TIMEZONE) {
  const id = extractCalendarId(calendarId);
  if (!id) return '';
  const params = new URLSearchParams({
    src: id,
    ctz: timezone,
    mode: 'AGENDA',
    showTitle: '0',
    showPrint: '0',
    showTabs: '0',
    showCalendars: '0',
    showTz: '0',
  });
  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}
