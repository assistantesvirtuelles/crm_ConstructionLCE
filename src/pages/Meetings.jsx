import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CalendarDays, Loader2, Settings as SettingsIcon } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchUserSettings, buildCalendarEmbedUrl } from '../lib/settings.js';

export default function Meetings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await fetchUserSettings(user.id);
      if (!mounted) return;
      setSettings(data || {});
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <Card style={{ padding: 0, animation: 'fadeUp 0.35s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
          Chargement…
        </div>
      </Card>
    );
  }

  const bookingUrl = settings?.booking_url;
  const calendarId = settings?.calendar_id;
  const embedUrl = buildCalendarEmbedUrl(calendarId);

  // Not connected yet
  if (!bookingUrl && !calendarId) {
    return (
      <div style={{ animation: 'fadeUp 0.35s ease both' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <EmptyState
            icon={CalendarDays}
            title="Connectez votre Google Agenda"
            description="Ajoutez votre lien de réservation et l'ID de votre agenda dans les paramètres pour planifier et afficher vos rendez-vous ici."
            action={
              <Button size="sm" icon={<SettingsIcon />} onClick={() => navigate('/settings')} style={{ marginTop: '4px' }}>
                Aller aux paramètres
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeUp 0.35s ease both', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Intro + book button */}
      <Card style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'rgba(46,204,82,0.10)', border: '1px solid rgba(46,204,82,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CalendarDays size={18} color="var(--orange)" strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '2px' }}>
              Rendez-vous à venir
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
              Votre liste de rendez-vous, synchronisée depuis Google Agenda.
            </div>
          </div>
        </div>
        {bookingUrl ? (
          <Button icon={<ExternalLink />} onClick={() => window.open(bookingUrl, '_blank', 'noopener,noreferrer')}>
            Réserver un rendez-vous
          </Button>
        ) : (
          <Button variant="secondary" icon={<SettingsIcon />} onClick={() => navigate('/settings')}>
            Ajouter un lien de réservation
          </Button>
        )}
      </Card>

      {/* Appointments list (Google Calendar agenda view) */}
      {embedUrl ? (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '10px 24px',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--muted)',
          }}>
            Liste de vos prochains rendez-vous. Vous devez être connecté à votre compte Google
            pour les voir. Pour en ajouter un, cliquez sur « Réserver un rendez-vous ».
          </div>
          <iframe
            title="Rendez-vous à venir — Google Agenda"
            src={embedUrl}
            style={{ width: '100%', height: '640px', border: 'none', display: 'block', background: '#fff' }}
          />
        </Card>
      ) : (
        <Card style={{ padding: '24px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
            Ajoutez l'ID de votre agenda dans les{' '}
            <span
              onClick={() => navigate('/settings')}
              style={{ color: 'var(--orange)', cursor: 'pointer', fontWeight: 600 }}
            >
              paramètres
            </span>{' '}
            pour afficher la liste de vos rendez-vous.
          </div>
        </Card>
      )}
    </div>
  );
}
