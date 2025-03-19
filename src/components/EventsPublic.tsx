'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useEvent, { EventProps } from '@/src/store/Event';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/src/components/ui/toast';
import { useRouter } from 'next/navigation';
import useEventRegistration from '@/src/store/EventRegistration';

export default function EventsPublic() {
  const { events, loading, getEvents } = useEvent();
  const { isSignedIn, userId } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const { registerForEvent, checkIfRegistered, registrations, getRegistrations } = useEventRegistration();
  const [registrationLoading, setRegistrationLoading] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  // Function to determine event status
  const getEventStatus = (event: EventProps) => {
    const now = new Date().getTime();
    const eventDate = new Date(event.date).getTime();
    const registrationDate = new Date(event.registration).getTime();

    if (now > eventDate) {
      return {
        status: 'completed',
        label: 'Event Completed',
        color: 'bg-gray-500 text-white'
      };
    } else if (now >= registrationDate && now <= eventDate) {
      return {
        status: 'ongoing',
        label: 'Ongoing Event',
        color: 'bg-green-500 text-white'
      };
    } else {
      return {
        status: 'upcoming',
        label: 'Upcoming Event',
        color: 'bg-blue-500 text-white'
      };
    }
  };

  // Filter events based on selected status
  const filteredEvents = events.filter(event => {
    if (selectedStatus === 'all') return true;
    return getEventStatus(event).status === selectedStatus;
  });

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    if (isSignedIn && userId) {
      getRegistrations(userId);
    }
  }, [isSignedIn, userId, getRegistrations]);

  // Format date for display
  const formatDate = (timestamp: number | string) => {
    if (!timestamp) return 'TBA';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (timestamp: number | string) => {
    if (!timestamp) return 'TBA';
    
    // If the time is in HH:MM format (string)
    if (typeof timestamp === 'string' && timestamp.includes(':')) {
      const [hours, minutes] = timestamp.split(':').map(part => parseInt(part, 10));
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    
    // If it's a timestamp number
    if (typeof timestamp === 'number') {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    return timestamp;
  };

  // Check if registration is still open
  const isRegistrationOpen = (event: EventProps) => {
    if (!event.registration) return false;
    const now = new Date().getTime();
    return now <= new Date(event.registration).getTime();
  };

  // Handle registration
  const handleRegister = async (event: EventProps) => {
    if (!isSignedIn) {
      addToast({
        title: 'Authentication required',
        description: 'Please sign in to register for this event',
        variant: 'warning',
        duration: 5000,
      });
      router.push('/sign-in');
      return;
    }

    if (!event._id) return;

    try {
      setRegistrationLoading(event._id);
      await registerForEvent(event._id, userId!);
      addToast({
        title: 'Registration successful',
        description: `You are now registered for "${event.title}"`,
        variant: 'success',
        duration: 5000,
      });
    } catch (error: any) {
      addToast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong',
        variant: 'error',
        duration: 5000,
      });
    } finally {
      setRegistrationLoading(null);
    }
  };

  // Check if user is registered for an event
  const isRegistered = (eventId: string) => {
    if (!userId || !isSignedIn) return false;
    
    // First check in the local state
    const isLocallyRegistered = checkIfRegistered(eventId, userId!);
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`Event ${eventId} registration status:`, {
        isLocallyRegistered,
        userId,
        storeRegistrations: registrations.length,
      });
    }
    
    // Return the result
    return isLocallyRegistered;
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 animate-spin"></div>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedStatus === 'all'
              ? 'bg-purple-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setSelectedStatus('upcoming')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedStatus === 'upcoming'
              ? 'bg-blue-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setSelectedStatus('ongoing')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedStatus === 'ongoing'
              ? 'bg-green-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          Ongoing
        </button>
        <button
          onClick={() => setSelectedStatus('completed')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedStatus === 'completed'
              ? 'bg-gray-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <motion.div
            key={event._id}
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Card hover effect shine */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            {/* Event image */}
            <div className="h-48 overflow-hidden">
              <img
                src={event.publicId 
                  ? `https://res.cloudinary.com/ducshmbin/image/upload/${event.publicId}`
                  : "https://res.cloudinary.com/ducshmbin/image/upload/v1/placeholder-event"}
                alt={event.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            {/* Event content */}
            <div className="p-6">
              {/* Status tag */}
              <div className="mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventStatus(event).color}`}>
                  {getEventStatus(event).label}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-neutral-800 dark:text-white">
                {event.title}
              </h3>
              
              <div className="flex flex-col space-y-2 mb-4">
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatTime(event.time)}</span>
                </div>
              </div>
              
              <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-5">
                {event.description}
              </p>
              
              <div className="mt-auto">
                {isRegistrationOpen(event) ? (
                  isRegistered(event._id!) ? (
                    <button
                      className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-md font-medium cursor-not-allowed"
                      disabled
                    >
                      Already Registered
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(event)}
                      disabled={registrationLoading === event._id}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-70"
                    >
                      {registrationLoading === event._id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registering...
                        </span>
                      ) : (
                        'Register Now'
                      )}
                    </button>
                  )
                ) : (
                  <button
                    className="w-full py-2 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-md font-medium cursor-not-allowed"
                    disabled
                  >
                    Registration Closed
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredEvents.length === 0 && !loading && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-neutral-700 dark:text-neutral-300 mb-2">No events found</h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              There are no upcoming events at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 