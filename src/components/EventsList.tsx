'use client'
import Image from 'next/image'
import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/src/hooks/use-outside-click'
import useEvent, { EventProps } from '@/src/store/Event'
import { useRouter } from 'next/navigation'
import { useToast } from '@/src/components/ui/toast'
import EditEventModal from './EditEventModal'
import EventRegistrations from '@/src/components/admin/EventRegistrations'

// Icon components
const CloseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Default image URL for when publicId is missing
const DEFAULT_IMAGE_URL = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/placeholder-event`

export function ExpandableEvents() {
  const router = useRouter()
  const { deleteEvent, events, loading, getEvents } = useEvent()
  const [active, setActive] = useState<EventProps | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [isAscending, setIsAscending] = useState(false)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  const [showRegistrations, setShowRegistrations] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const { addToast } = useToast()

  // Close modal on 'Escape' key press and manage body overflow
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null)
        setShowRegistrations(null)
      }
    }

    document.body.style.overflow = (active || showRegistrations) ? 'hidden' : 'auto'
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, showRegistrations])

  // Fetch events once on component mount
  useEffect(() => {
    ; (async () => {
      try {
        await getEvents()
      } catch (error) {
        console.error("Failed to fetch events:", error)
      }
    })()
  }, [getEvents])

  // Close modal when clicking outside
  useOutsideClick(ref, () => {
    setActive(null)
    setShowRegistrations(null)
  })

  // Function to format date for display
  const formatDate = (dateStr: string | number | undefined) => {
    if (!dateStr) return 'Not specified'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return dateStr.toString()
    }
  }

  // Function to handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId)
      setActive(null)
      addToast({
        title: 'Event deleted',
        description: 'The event has been successfully deleted',
        variant: 'success',
        duration: 5000,
      })
    } catch (error: any) {
      addToast({
        title: 'Failed to delete event',
        description: error.message || 'An error occurred while deleting the event',
        variant: 'error',
        duration: 5000,
      })
    }
  }

  // Handle image loading error
  const handleImageError = (eventId: string) => {
    setImageError(prev => ({
      ...prev,
      [eventId]: true
    }))
  }

  // Get proper image URL (with fallback)
  const getImageUrl = (eventId: string, publicId?: string) => {
    if (imageError[eventId] || !publicId) {
      return DEFAULT_IMAGE_URL
    }
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/${publicId}`
  }

  // Toggle showing registrations for an event
  const toggleRegistrations = (eventId: string | null) => {
    if (eventId && !showRegistrations) {
      // Don't close active event if we're showing registrations
      setShowRegistrations(eventId)
    } else {
      setShowRegistrations(null)
    }
    // Prevent event click propagation
    return false
  }

  // Filter and sort events - ensure date values exist before sorting 
  const filteredAndSortedEvents = events
    .filter(event =>
      (event.title ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (typeof event.description === 'string' ? event.description.toLowerCase().includes(searchTerm.toLowerCase()) : false)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        // Handle missing dates gracefully
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return isAscending ? dateA - dateB : dateB - dateA
      } else {
        // Handle possible undefined titles
        const titleA = a.title || '';
        const titleB = b.title || '';
        return isAscending
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA)
      }
    })

  const handleToggleSort = (field: 'date' | 'title') => {
    if (sortBy === field) {
      setIsAscending(!isAscending)
    } else {
      setSortBy(field)
      setIsAscending(true)
    }
  }

  return (
    <>
      <AnimatePresence>
        {(active || showRegistrations) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-10 h-full w-full bg-black/40 backdrop-blur-sm'
          />
        )}
      </AnimatePresence>

      {/* Search and filter controls */}
      <div className="w-full mb-6 space-y-3 px-2" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-black dark:bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-neutral-500 dark:text-white pt-1">Sort by:</span>
          <button
            onClick={() => handleToggleSort('date')}
            className={`px-3 py-1 rounded-full flex items-center gap-1 ${sortBy === 'date'
              ? 'bg-purple-700 text-purple-100 dark:bg-purple-900 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
          >
            Date
            {sortBy === 'date' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAscending ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            )}
          </button>
          <button
            onClick={() => handleToggleSort('title')}
            className={`px-3 py-1 rounded-full flex items-center gap-1 ${sortBy === 'title'
              ? 'bg-purple-700 text-purple-100 dark:bg-purple-900 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
          >
            Title
            {sortBy === 'title' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAscending ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {active ? (
          <div className='fixed inset-0 z-[100] grid place-items-center p-4'>
            <motion.button
              key={`button-${active._id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className='absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-md'
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active._id}-${id}`}
              ref={ref}
              className='flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white dark:bg-neutral-900 sm:rounded-3xl md:h-fit md:max-h-[90%] shadow-2xl'
            >
              <motion.div layoutId={`image-${active._id}-${id}`}>
                <div className="relative w-full h-60 sm:h-80">
                  <Image
                    priority
                    fill
                    src={getImageUrl(active._id || '', active.publicId)}
                    alt={active.title || 'Event image'}
                    className='object-cover object-top sm:rounded-tl-lg sm:rounded-tr-lg dark:bg-neutral-900 '
                    onError={() => handleImageError(active._id || '')}
                  />
                </div>
              </motion.div>
              <div className='relative flex-1 overflow-auto'>
                <div className='p-6 sm:p-8'>
                  <motion.h3
                    layoutId={`title-${active._id}-${id}`}
                    className='text-xl sm:text-2xl font-semibold leading-tight text-neutral-900 dark:text-white'
                  >
                    {active.title || 'Untitled Event'}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${active._id}-${id}`}
                    className='mt-4 text-base text-neutral-700 dark:text-neutral-300'
                  >
                    {active.description || 'No description provided'}
                  </motion.p>
                </div>
                <div className='relative px-6 pt-4 pb-6'>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-col items-start gap-4 overflow-auto pb-6 text-sm text-neutral-600 dark:text-neutral-400'
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">Date</p>
                          <p>{active.date || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">Time</p>
                          <p>{active.time || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500">Registration Deadline</p>
                          <p>{active.registration || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="px-6 pb-6 flex flex-wrap gap-3 mt-auto">
                  <EditEventModal
                    eventId={active._id || ''}
                    triggerContent={
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Event
                      </div>
                    }
                    triggerClassName="flex items-center gap-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-3 py-2 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRegistrations(active._id || null);
                    }}
                    className="flex items-center gap-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-3 py-2 text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    View Registrations
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                        handleDeleteEvent(active._id || '')
                      }
                    }}
                    className="flex items-center gap-1 rounded-md bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-3 py-2 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Event
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Registrations Modal */}
      <AnimatePresence>
        {showRegistrations && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4'>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className='absolute right-3 sm:right-6 top-3 sm:top-6 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-md z-[101]'
              onClick={() => setShowRegistrations(null)}
            >
              <CloseIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              ref={ref}
              className='w-full h-[95vh] max-w-5xl flex flex-col overflow-hidden bg-white dark:bg-neutral-900 rounded-xl sm:rounded-3xl shadow-2xl'
            >
              {/* Get event title based on showRegistrations ID */}
              <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white truncate">
                  Registrations for {events.find(e => e._id === showRegistrations)?.title || 'Event'}
                </h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <EventRegistrations
                  eventId={showRegistrations}
                  eventTitle={events.find(e => e._id === showRegistrations)?.title || 'Event'}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading && events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-purple-500 mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading events...</p>
        </div>
      ) : (
        <motion.ul
          className="w-full gap-4 divide-y divide-gray-100 dark:divide-neutral-800"
          style={{ width: '100%', maxWidth: '100%' }}
          layout
        >
          {filteredAndSortedEvents.length > 0 ? (
            filteredAndSortedEvents.map(event => (
              <motion.li
                layoutId={`card-${event._id}-${id}`}
                key={`card-${event._id}-${id}`}
                onClick={() => setActive(event)}
                className='flex cursor-pointer flex-col items-start justify-between rounded-xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 md:flex-row md:items-center transition-colors group'
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <div className='flex flex-col gap-4 md:flex-row md:items-center w-full'>
                  <motion.div layoutId={`image-${event._id}-${id}`} className="w-full md:w-auto">
                    <div className="relative h-40 w-full md:h-20 md:w-20 rounded-lg overflow-hidden">
                      <Image
                        fill
                        src={getImageUrl(event._id || '', event.publicId)}
                        alt={event.title || 'Event image'}
                        className='object-cover object-top'
                        onError={() => handleImageError(event._id || '')}
                      />
                    </div>
                  </motion.div>
                  <div className="w-full pl-0 md:pl-4">
                    <div className="flex justify-between items-start">
                      <motion.h3
                        layoutId={`title-${event._id}-${id}`}
                        className='font-medium text-neutral-300 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-black'
                      >
                        {event.title || 'Untitled Event'}
                      </motion.h3>
                    </div>
                    <motion.p
                      layoutId={`description-${event._id}-${id}`}
                      className='text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1'
                    >
                      {event.description || 'No description provided'}
                    </motion.p>
                    {event.date && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.date)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 md:mt-0 w-full md:w-auto justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRegistrations(event._id || null);
                    }}
                    className='rounded bg-purple-100 dark:bg-purple-900/40 px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors'
                  >
                    <span className="hidden sm:inline">Registrations</span>
                    <span className="sm:hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  </button>
                  {/* <EditEventModal
                    eventId={event._id || ''}
                    triggerContent={
                      <div className="flex items-center">
                        <span className="hidden sm:inline">Edit</span>
                        <span className="sm:hidden">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </span>
                      </div>
                    }
                    triggerClassName="rounded bg-blue-100 dark:bg-blue-900/40 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                  /> */}
                  <motion.button
                    layoutId={`button-${event._id}-${id}`}
                    className='rounded bg-gray-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-medium text-black dark:text-white group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-600 transition-colors'
                  >
                    Details
                  </motion.button>
                </div>
              </motion.li>
            ))
          ) : (
            <motion.div
              className='text-center py-12 rounded-lg bg-neutral-50 dark:bg-neutral-800/50'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className='text-lg text-neutral-600 dark:text-neutral-400 mb-2'>
                {searchTerm ? 'No matching events found' : 'No events found'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </motion.ul>
      )}
    </>
  )
}
