import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const styles = {
  shell: {
    display: 'flex',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

export default function AppShell() {
  return (
    <div style={styles.shell}>
      <Sidebar />
      <div style={styles.main}>
        <Header />
        <div style={styles.content}>
          <div style={styles.inner}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
