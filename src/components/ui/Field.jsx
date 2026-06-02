import React, { useState } from 'react';

export default function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  options,      // if provided -> renders a <select>
  textarea,     // if true -> renders a <textarea>
  required,
  disabled,
  autoComplete,
}) {
  const [focused, setFocused] = useState(false);

  const controlStyle = {
    width: '100%',
    background: 'var(--surface-2)',
    color: 'var(--text)',
    border: `1px solid ${focused ? 'rgba(46,204,82,0.4)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '11px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: '13.5px',
    outline: 'none',
    transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
    boxShadow: focused ? '0 0 0 3px rgba(46,204,82,0.08)' : 'none',
    opacity: disabled ? 0.6 : 1,
  };

  const sharedProps = {
    value: value ?? '',
    onChange,
    placeholder,
    disabled,
    autoComplete,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--muted)',
          letterSpacing: '0.2px',
        }}>
          {label}
          {required && <span style={{ color: 'var(--orange)' }}> *</span>}
        </span>
      )}

      {options ? (
        <select {...sharedProps} style={{ ...controlStyle, cursor: 'pointer' }}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea {...sharedProps} rows={3} style={{ ...controlStyle, resize: 'vertical', minHeight: '72px' }} />
      ) : (
        <input {...sharedProps} type={type} style={controlStyle} />
      )}
    </label>
  );
}
