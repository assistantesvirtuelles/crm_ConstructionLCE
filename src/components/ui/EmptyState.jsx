import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: '12px',
      textAlign: 'center',
    }}>
      {Icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'rgba(46,204,82,0.08)',
          border: '1px solid rgba(46,204,82,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '4px',
        }}>
          <Icon size={22} color="var(--orange)" strokeWidth={1.5} />
        </div>
      )}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '15px',
        fontWeight: 600,
        color: 'var(--text)',
      }}>
        {title}
      </div>
      {description && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--muted)',
          maxWidth: '280px',
          lineHeight: 1.6,
        }}>
          {description}
        </div>
      )}
      {action}
    </div>
  );
}
