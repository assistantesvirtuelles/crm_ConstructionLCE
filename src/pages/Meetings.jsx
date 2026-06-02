import React from 'react';
import { CalendarDays } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Meetings() {
  return (
    <PlaceholderPage
      icon={CalendarDays}
      title="Rendez-vous"
      description="Planifiez et suivez vos appels et rendez-vous avec vos contacts."
      ctaLabel="Planifier un rendez-vous"
      emptyTitle="Aucun rendez-vous pour le moment"
    />
  );
}
