import React from 'react';
import { CalendarDays } from 'lucide-react';
import PlaceholderPage from './_PlaceholderPage.jsx';

export default function Meetings() {
  return (
    <PlaceholderPage
      icon={CalendarDays}
      title="Meetings"
      description="Schedule and track calls and meetings with your contacts."
      ctaLabel="Schedule Meeting"
    />
  );
}
