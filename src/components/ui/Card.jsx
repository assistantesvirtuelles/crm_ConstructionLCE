import React, { useState } from 'react';

export default function Card({ children, style, hoverable = false, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'rgba(46,204,82,0.25)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: hovered
          ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(46,204,82,0.1)'
          : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.22s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
