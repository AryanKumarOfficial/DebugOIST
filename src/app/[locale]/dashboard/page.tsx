import React from 'react';
import { Metadata } from 'next';
import ProfileRegistrations from '@/src/components/ProfileRegistrations';

export const metadata: Metadata = {
  title: 'Debug Club - Dashboard',
  description: 'View your Debug Programming Club registrations and account details.',
};

export default function DashboardPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-600">
          Debug Club Dashboard
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
          Manage your event registrations and account details.
        </p>
      </div>

      {/* Centered Events Section */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          <ProfileRegistrations />
        </div>
      </div>
    </main>
  );
}
