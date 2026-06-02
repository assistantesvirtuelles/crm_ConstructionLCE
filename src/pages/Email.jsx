import React from 'react';
import { Mail } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Email() {
  return (
    <PlaceholderPage
      icon={Mail}
      title="Email"
      description="Connect your inbox to send and track emails from within the CRM."
      ctaLabel="Compose Email"
    />
  );
}
