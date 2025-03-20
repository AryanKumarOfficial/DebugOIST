import React from 'react';
import { Metadata } from 'next';
import EventsPageClient from './EventsPageClient';

export const metadata: Metadata = {
  title: 'OIST - Programming Club Events',
  description: 'Browse upcoming, ongoing, and past events from the OIST Programming Club. Register for upcoming events and stay updated with our latest programming activities.',
};

export default function EventsPage() {
  return <EventsPageClient />;
} 