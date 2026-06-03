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
