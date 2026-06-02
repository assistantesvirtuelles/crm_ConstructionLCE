import React from 'react';
import { Users } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Leads() {
  return (
    <PlaceholderPage
      icon={Users}
      title="Prospects"
      description="Ajoutez votre premier prospect pour commencer à construire votre pipeline de ventes."
      ctaLabel="Ajouter un prospect"
      emptyTitle="Aucun prospect pour le moment"
    />
  );
}
