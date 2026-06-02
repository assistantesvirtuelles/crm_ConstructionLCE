import React, { useState } from 'react';

const variants = {
  primary: {
    background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 16px rgba(46,204,82,0.28)',
  },
  secondary: {
    background: 'var(--surface-2)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--muted)',
    border: '1px solid var(--border)',
    boxShadow: 'none',
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  style,
  icon,
  disabled = false,
}) {
  const [hovered, setHovered] = useState(false);

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px', gap: '6px' },
    md: { padding: '9px 18px', fontSize: '13.5px', gap: '7px' },
    lg: { padding: '12px 24px', fontSize: '14px', gap: '8px' },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: hovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
        outline: 'none',
        ...variants[variant],
        ...sizeStyles[size],
        ...(hovered && variant === 'primary' && !disabled
          ? { boxShadow: '0 6px 24px rgba(46,204,82,0.40)' }
          : {}),
        ...style,
      }}
    >
      {icon && React.cloneElement(icon, { size: 14 })}
      {children}
    </button>
  );
}
