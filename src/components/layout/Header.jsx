import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, ChevronDown } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/contacts': 'Contacts',
  '/deals': 'Deals',
  '/meetings': 'Meetings',
  '/email': 'Email',
  '/settings': 'Settings',
};

const PAGE_SUBTITLES = {
  '/dashboard': "Here's what's happening today",
  '/leads': 'Track and manage your pipeline',
  '/contacts': 'Your network in one place',
  '/deals': 'Monitor deals and revenue',
  '/meetings': 'Scheduled calls and meetings',
  '/email': 'Inbox and outreach',
  '/settings': 'Preferences and configuration',
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '68px',
    flexShrink: 0,
    borderBottom: '1px solid var(--border)',
    background: 'rgba(17, 17, 18, 0.6)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 5,
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--muted)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '7px 14px',
    cursor: 'text',
    minWidth: '200px',
  },
  searchText: {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    color: 'var(--muted)',
    userSelect: 'none',
  },
  iconBtn: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--muted)',
    transition: 'all var(--transition)',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: '7px',
    right: '7px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--orange)',
    border: '1.5px solid var(--surface)',
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 10px 4px 4px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    cursor: 'pointer',
    transition: 'all var(--transition)',
  },
  avatarImg: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontSize: '11px',
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },
  avatarName: {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text)',
  },
};

export default function Header() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'ClaudeCRM';
  const subtitle = PAGE_SUBTITLES[pathname] ?? '';

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.title}>{title}</span>
        <span style={styles.subtitle}>{subtitle}</span>
      </div>
      <div style={styles.right}>
        <div style={styles.searchBox}>
          <Search size={13} color="var(--muted)" />
          <span style={styles.searchText}>Search anything…</span>
        </div>
        <div style={styles.iconBtn}>
          <Bell size={15} />
          <span style={styles.notifDot} />
        </div>
        <div style={styles.avatar}>
          <div style={styles.avatarImg}>N</div>
          <span style={styles.avatarName}>You</span>
          <ChevronDown size={12} color="var(--muted)" />
        </div>
      </div>
    </header>
  );
}
