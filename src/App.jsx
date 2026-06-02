import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leads from './pages/Leads.jsx';
import Contacts from './pages/Contacts.jsx';
import Deals from './pages/Deals.jsx';
import Meetings from './pages/Meetings.jsx';
import Email from './pages/Email.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
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
