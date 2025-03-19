import React from 'react';
import type { Metadata } from 'next';
import EventDetailsClient from './EventDetailsClient';

export const metadata: Metadata = {
  title: 'Event Details',
  description: 'Detailed information about the event',
};

export default function EventDetailsPage({ params }: { params: { eventId: string } }) {
  return <EventDetailsClient eventId={params.eventId} />;
} 