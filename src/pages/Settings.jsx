import React from 'react';
import Card from '../components/ui/Card.jsx';

const SECTIONS = [
  { label: 'Profil', description: 'Votre nom, votre courriel et votre avatar' },
  { label: 'Espace de travail', description: "Nom de l'équipe, logo et détails du forfait" },
  { label: 'Intégrations', description: 'Connectez votre courriel, votre calendrier et vos outils' },
  { label: 'Notifications', description: 'Configurez les alertes et les résumés' },
  { label: 'Sécurité', description: 'Mot de passe, 2FA et sessions actives' },
  { label: 'Facturation', description: 'Abonnement et moyens de paiement' },
];

export default function Settings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeUp 0.35s ease both' }}>
      {SECTIONS.map((section, i) => (
        <Card
          key={section.label}
          hoverable
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            animationDelay: `${i * 50}ms`,
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
