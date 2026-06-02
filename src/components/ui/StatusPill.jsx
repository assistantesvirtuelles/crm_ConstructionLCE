import React from 'react';

const COLOR_MAP = {
  new: { bg: 'rgba(99,179,237,0.12)', color: '#63b3ed', dot: '#63b3ed' },
  active: { bg: 'rgba(72,199,142,0.12)', color: '#48c78e', dot: '#48c78e' },
  won: { bg: 'rgba(72,199,142,0.12)', color: '#48c78e', dot: '#48c78e' },
  lost: { bg: 'rgba(252,129,129,0.12)', color: '#fc8181', dot: '#fc8181' },
  pending: { bg: 'rgba(46,204,82,0.12)', color: 'var(--orange)', dot: 'var(--orange)' },
  closed: { bg: 'rgba(107,107,114,0.15)', color: 'var(--muted)', dot: 'var(--muted)' },
};

export default function StatusPill({ status, label }) {
  const colors = COLOR_MAP[status?.toLowerCase()] ?? COLOR_MAP.closed;
  const text = label ?? status;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: colors.bg,
      color: colors.color,
      border: `1px solid ${colors.color}22`,
      borderRadius: 'var(--radius-pill)',
      padding: '3px 10px',
      fontSize: '11.5px',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: '0.2px',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: colors.dot,
        flexShrink: 0,
      }} />
      {text}
    </span>
  );
}
