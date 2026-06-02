import React from 'react';
import { Users } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Leads() {
  return (
    <PlaceholderPage
      icon={Users}
      title="Leads"
      description="Add your first lead to start building your sales pipeline."
      ctaLabel="Add Lead"
    />
  );
}
