import React from 'react';

// Construction LCE wordmark. On the dark CRM theme: "Construction" + the "C"
// are light, the "L" and "E" are brand green — matching the company logo.
export default function Logo({
  constructionSize = 18,
  lceSize = 30,
  showTagline = false,
  align = 'flex-start',
}) {
  const green = 'var(--orange)'; // brand green token
  const light = 'var(--text)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, lineHeight: 1 }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 400,
        fontSize: `${constructionSize}px`,
        color: light,
        letterSpacing: '0.5px',
      }}>
        Construction
      </span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: `${lceSize}px`,
        letterSpacing: '2px',
        marginTop: `${Math.round(lceSize * 0.06)}px`,
      }}>
        <span style={{ color: green }}>L</span>
        <span style={{ color: light }}>C</span>
        <span style={{ color: green }}>E</span>
      </span>
      {showTagline && (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: `${Math.max(11, Math.round(constructionSize * 0.6))}px`,
          color: 'var(--muted)',
          marginTop: '10px',
          letterSpacing: '0.4px',
        }}>
          Votre vision, notre expertise
        </span>
      )}
    </div>
  );
}
