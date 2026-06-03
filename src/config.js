// App-wide configuration values.

// Google Calendar appointment-scheduling (booking) page — used by the
// "Réserver un rendez-vous" button to create new appointments.
// To change it: Google Calendar → Appointment schedule → Share → copy the link.
export const BOOKING_URL = 'https://calendar.app.google/SWivJdfgWp7vpEMFA';

// Google Calendar embed in AGENDA (list) mode — shows your upcoming
// appointments as a list on the Rendez-vous page. Visible to viewers signed
// into Google with access to this calendar.
// To change it: Google Calendar → Settings → [calendar] → Integrate calendar → Calendar ID.
export const CALENDAR_EMBED_URL =
  'https://calendar.google.com/calendar/embed' +
  '?src=ndupuis%40constructionlce.ca' +
  '&ctz=America%2FToronto' +
  '&mode=AGENDA' +
  '&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0';
