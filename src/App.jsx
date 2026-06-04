import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leads from './pages/Leads.jsx';
import Contacts from './pages/Contacts.jsx';
import Deals from './pages/Deals.jsx';
import Meetings from './pages/Meetings.jsx';
import Email from './pages/Email.jsx';
import Settings from './pages/Settings.jsx';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '40px',
        letterSpacing: '4px',
        animation: 'pulse 1.4s ease-in-out infinite',
      }}>
        <span style={{ color: 'var(--orange)' }}>L</span>
        <span style={{ color: 'var(--text)' }}>C</span>
        <span style={{ color: 'var(--orange)' }}>E</span>
      </div>
    </div>
  );
}

function AuthedApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="deals" element={<Deals />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="email" element={<Email />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AppGate() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!session) return <Login />;
  return <AuthedApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}
