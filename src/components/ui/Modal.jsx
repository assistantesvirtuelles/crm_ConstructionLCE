import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, children, footer, width = 520 }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 20px',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: `${width}px`,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          animation: 'fadeUp 0.25s ease both',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--muted)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
