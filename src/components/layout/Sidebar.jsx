import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Contact,
  Handshake,
  CalendarDays,
  Mail,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../ui/Logo.jsx';

const NAV_ITEMS = [
  { label: 'Tableau de bord', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Prospects', icon: Users, to: '/leads' },
  { label: 'Contacts', icon: Contact, to: '/contacts' },
  { label: 'Opportunités', icon: Handshake, to: '/deals' },
  { label: 'Rendez-vous', icon: CalendarDays, to: '/meetings' },
  { label: 'Courriels', icon: Mail, to: '/email' },
];

const styles = {
  sidebar: {
    width: '220px',
    flexShrink: 0,
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 20px 20px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '15px',
    color: 'var(--text)',
    letterSpacing: '-0.3px',
    lineHeight: 1.15,
  },
  logoSub: {
    fontFamily: 'var(--font-body)',
    fontSize: '10px',
    color: 'var(--muted)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginTop: '-2px',
  },
  nav: {
    flex: 1,
    padding: '4px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sectionLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--muted)',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    padding: '12px 10px 6px',
  },
  footer: {
    padding: '10px',
    borderTop: '1px solid var(--border)',
  },
};

function NavItem({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        fontFamily: 'var(--font-display)',
        fontSize: '13.5px',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--orange)' : 'var(--muted)',
        background: isActive ? 'rgba(46,204,82, 0.10)' : 'transparent',
        transition: 'all var(--transition)',
        cursor: 'pointer',
        position: 'relative',
      })}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '3px',
              height: '18px',
              background: 'var(--orange)',
              borderRadius: '0 2px 2px 0',
            }} />
          )}
          <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
          {item.label}
        </>
      )}
    </NavLink>
  );
}

function SignOutButton() {
  const { signOut } = useAuth();
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={() => signOut()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        marginTop: '6px',
        padding: '9px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        color: hover ? 'var(--text)' : 'var(--muted)',
        fontFamily: 'var(--font-display)',
        fontSize: '13.5px',
        fontWeight: 600,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all var(--transition)',
      }}
    >
      <LogOut size={16} strokeWidth={1.8} />
      Déconnexion
    </button>
  );
}

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <Logo constructionSize={13} lceSize={22} />
      </div>

      <nav style={styles.nav}>
        <div style={styles.sectionLabel}>Principal</div>
        {NAV_ITEMS.slice(0, 4).map((item) => (
          <NavItem key={item.to} item={item} />
        ))}
        <div style={styles.sectionLabel}>Communication</div>
        {NAV_ITEMS.slice(4).map((item) => (
          <NavItem key={item.to} item={item} />
        ))}
      </nav>

      <div style={styles.footer}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: '13.5px',
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--orange)' : 'var(--muted)',
            background: isActive ? 'rgba(46,204,82, 0.10)' : 'transparent',
            transition: 'all var(--transition)',
          })}
        >
          <Settings size={16} strokeWidth={1.8} />
          Paramètres
        </NavLink>
        <SignOutButton />
      </div>
    </aside>
  );
}
