import React from 'react';
import { Contact } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Contacts() {
  return (
    <PlaceholderPage
      icon={Contact}
      title="Contacts"
      description="Importez ou ajoutez manuellement des contacts pour développer votre réseau."
      ctaLabel="Ajouter un contact"
      emptyTitle="Aucun contact pour le moment"
    />
  );
}
