import React from 'react';
import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import connect from '@/src/Backend/mongoose';
import Event from '@/src/Backend/Models/Event';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin - Events Management',
  description: 'Manage your programming club events',
};

async function getEvents() {
  await connect();
  return Event.find().sort({ date: -1 });
}

// Format date for display
function formatDate(timestamp: number | string) {
  if (!timestamp) return 'TBA';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function AdminEventsPage() {
  const session = await auth();
  const userId = session.userId;

  // Redirect if not logged in
  if (!userId) {
    redirect('/');
  }

  // In production, check if user is admin
  // const isAdmin = await checkIfUserIsAdmin(userId);
  // if (!isAdmin) {
  //   redirect('/dashboard');
  // }

  const events = await getEvents();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
            Events Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Create, edit and manage event registrations
          </p>
        </div>

        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-8 text-center">
          <svg
            className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            No events found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            You haven't created any events yet. Get started by creating your first event.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-300">
              <tr>
                <th className="px-6 py-3">Event Title</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Registration Deadline</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event._id.toString()}
                  className="border-b dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <td className="px-6 py-4 font-medium text-neutral-800 dark:text-white">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                    {formatDate(event.date)}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                    {event.registration ? formatDate(event.registration) : 'Closed'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/events/${event._id.toString()}/edit`}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/events/${event._id.toString()}`}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        Registrations
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
} 