import React from 'react';
import { Mail } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Email() {
  return (
    <PlaceholderPage
      icon={Mail}
      title="Courriels"
      description="Connectez votre boîte de réception pour envoyer et suivre vos courriels depuis le CRM."
      ctaLabel="Rédiger un courriel"
      emptyTitle="Aucun courriel pour le moment"
    />
  );
}
