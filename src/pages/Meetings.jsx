import React from 'react';
import { ExternalLink, CalendarDays } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { BOOKING_URL, CALENDAR_EMBED_URL } from '../config.js';

function openBooking() {
  window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
}

export default function Meetings() {
  return (
    <div style={{ animation: 'fadeUp 0.35s ease both', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Intro + book button */}
      <Card style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(46,204,82,0.10)',
            border: '1px solid rgba(46,204,82,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
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
        <Button icon={<ExternalLink />} onClick={openBooking}>
          Réserver un rendez-vous
        </Button>
      </Card>

      {/* Appointments list (Google Calendar agenda view) */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '10px 24px',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--muted)',
        }}>
          Liste de vos prochains rendez-vous. Vous devez être connecté à votre compte Google
          (ndupuis@constructionlce.ca) pour les voir. Pour en ajouter un, cliquez sur « Réserver un rendez-vous ».
        </div>
        <iframe
          title="Rendez-vous à venir — Google Agenda"
          src={CALENDAR_EMBED_URL}
          style={{ width: '100%', height: '640px', border: 'none', display: 'block', background: '#fff' }}
        />
      </Card>
    </div>
  );
}
