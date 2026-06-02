import React from 'react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function PlaceholderPage({ icon: Icon, title, description, ctaLabel, emptyTitle }) {
  return (
    <div style={{ animation: 'fadeUp 0.35s ease both' }}>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Fake toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Fake search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '7px 14px',
              minWidth: '220px',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)' }}>
                Rechercher des {title.toLowerCase()}…
              </span>
            </div>
            {/* Fake filter pill */}
            <div style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--muted)',
              cursor: 'pointer',
            }}>
              Tous
            </div>
          </div>
          <Button size="sm" icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }>
            {ctaLabel}
          </Button>
        </div>

        {/* Empty state body */}
        <EmptyState
          icon={Icon}
          title={emptyTitle ?? `Aucun élément pour le moment`}
          description={description}
          action={
            <Button size="sm" style={{ marginTop: '4px' }} icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            }>
              {ctaLabel}
            </Button>
          }
        />

        {/* Fake column headers */}
        <div style={{
          display: 'flex',
          padding: '10px 24px',
          borderTop: '1px solid var(--border)',
          gap: '16px',
        }}>
          {['Nom', 'Statut', 'Créé le', 'Dernière mise à jour', 'Responsable'].map((col) => (
            <div key={col} style={{
              flex: col === 'Nom' ? 2 : 1,
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {col}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
