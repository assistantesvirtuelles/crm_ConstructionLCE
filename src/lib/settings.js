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

// Build a Google Calendar agenda (list) embed URL from a calendar ID / email.
export function buildCalendarEmbedUrl(calendarId, timezone = DEFAULT_TIMEZONE) {
  if (!calendarId) return '';
  const params = new URLSearchParams({
    src: calendarId,
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
