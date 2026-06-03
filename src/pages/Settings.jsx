import React, { useEffect, useState } from 'react';
import { Plug, Loader2, CheckCircle2 } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Field from '../components/ui/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchUserSettings, upsertUserSettings } from '../lib/settings.js';

const STATIC_SECTIONS = [
  { label: 'Profil', description: 'Votre nom, votre courriel et votre avatar' },
  { label: 'Espace de travail', description: "Nom de l'équipe, logo et détails du forfait" },
  { label: 'Notifications', description: 'Configurez les alertes et les résumés' },
  { label: 'Sécurité', description: 'Mot de passe, 2FA et sessions actives' },
];

export default function Settings() {
  const { user } = useAuth();
  const [bookingUrl, setBookingUrl] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await fetchUserSettings(user.id);
      if (!mounted) return;
      if (data) {
        setBookingUrl(data.booking_url || '');
        setCalendarId(data.calendar_id || '');
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setSaved(false);
    const { error } = await upsertUserSettings(user.id, {
      booking_url: bookingUrl.trim() || null,
      calendar_id: calendarId.trim() || null,
    });
    if (error) {
      setError(error.message || "Une erreur s'est produite lors de l'enregistrement.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeUp 0.35s ease both' }}>
      {/* Integrations — Google Calendar (functional, per user) */}
      <Card style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'rgba(46,204,82,0.10)', border: '1px solid rgba(46,204,82,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Plug size={18} color="var(--orange)" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
              Intégrations — Google Agenda
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
              Connectez votre propre page de réservation et votre agenda. Chaque utilisateur configure les siens.
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '24px 0 4px', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
            <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
            Chargement…
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' }}>
            <Field
              label="Lien de réservation Google (page de rendez-vous)"
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              placeholder="https://calendar.app.google/…"
            />
            <Field
              label="ID de l'agenda Google"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              placeholder="vous@votredomaine.ca"
            />
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text)' }}>Où les trouver :</strong> l'ID de l'agenda se trouve dans
              Google Agenda → Paramètres → [votre agenda] → « Intégrer l'agenda » → ID de l'agenda. Le lien de
              réservation provient de votre planification de rendez-vous (Partager → copier le lien).
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button size="sm" onClick={save} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
              {saved && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#48c78e', fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Enregistré
                </span>
              )}
            </div>
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'rgba(252,129,129,0.10)', border: '1px solid rgba(252,129,129,0.25)',
                color: '#fc8181', fontFamily: 'var(--font-body)', fontSize: '13px',
              }}>
                {error}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Other settings (placeholder) */}
      {STATIC_SECTIONS.map((section) => (
        <Card
          key={section.label}
          hoverable
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>
              {section.label}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
              {section.description}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Card>
      ))}
    </div>
  );
}
