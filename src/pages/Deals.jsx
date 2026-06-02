import React from 'react';
import { Handshake } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Deals() {
  return (
    <PlaceholderPage
      icon={Handshake}
      title="Opportunités"
      description="Suivez vos opportunités, du premier contact jusqu'à la conclusion."
      ctaLabel="Créer une opportunité"
      emptyTitle="Aucune opportunité pour le moment"
    />
  );
}
