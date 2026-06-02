import React from 'react';
import { Contact } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Contacts() {
  return (
    <PlaceholderPage
      icon={Contact}
      title="Contacts"
      description="Import or manually add contacts to grow your network."
      ctaLabel="Add Contact"
    />
  );
}
