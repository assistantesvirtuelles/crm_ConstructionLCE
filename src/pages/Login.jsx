import React, { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/ui/Logo.jsx';

function TextField({ label, type, value, onChange, placeholder, autoComplete, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '12.5px',
        fontWeight: 600,
        color: 'var(--muted)',
        letterSpacing: '0.2px',
      }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: `1px solid ${focused ? 'rgba(46,204,82,0.4)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '13px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
          boxShadow: focused ? '0 0 0 3px rgba(46,204,82,0.08)' : 'none',
        }}
      />
    </label>
  );
}

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message || 'Connexion impossible. Veuillez réessayer.');
      setSubmitting(false);
    }
    // On success, the auth listener swaps the app over to the authed view,
    // so this component unmounts — no need to reset submitting.
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '40px 36px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        animation: 'fadeUp 0.45s ease both',
      }}>
        {/* Logo + tagline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <Logo constructionSize={24} lceSize={44} showTagline align="center" />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13.5px',
            color: 'var(--muted)',
            margin: 0,
          }}>
            Connectez-vous à votre espace de travail
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <TextField
            label="Courriel"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@entreprise.com"
            autoComplete="email"
            disabled={submitting}
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={submitting}
          />

          <button
            type="submit"
            disabled={submitting}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              marginTop: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '13px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.75 : 1,
              transform: btnHover && !submitting ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: btnHover && !submitting
                ? '0 6px 24px rgba(46,204,82,0.40)'
                : '0 4px 16px rgba(46,204,82,0.28)',
              transition: 'all 0.18s ease',
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
                Connexion…
              </>
            ) : (
              <>
                <LogIn size={16} />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(252,129,129,0.10)',
            border: '1px solid rgba(252,129,129,0.25)',
            color: '#fc8181',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            lineHeight: 1.5,
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
