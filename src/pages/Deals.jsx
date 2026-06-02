import React from 'react';
import { Handshake } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Deals() {
  return (
    <PlaceholderPage
      icon={Handshake}
      title="Deals"
      description="Track opportunities from first contact to closed won."
      ctaLabel="Create Deal"
    />
  );
}
