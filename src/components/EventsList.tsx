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
import { createPortal } from 'react-dom'

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
  const [isBrowser, setIsBrowser] = useState(false)

  // Detect if we're in the browser environment for the portal
  useEffect(() => {
    setIsBrowser(true)
  }, [])

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

  // Function to close all modals
  const closeAllModals = () => {
    setActive(null);
    setShowRegistrations(null);
  };

  // Close modal when clicking outside
  useOutsideClick(ref, closeAllModals);

  // Also add an escape key handler
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

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

  // When an event is clicked, set it as active
  const handleEventClick = (event: EventProps) => {
    setActive(event)
  }

  return (
    <>
      {/* Global styles for animations and custom UI elements */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }
        
        @keyframes gradient-text {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .animate-gradient-text {
          animation: gradient-text 8s linear infinite;
        }
        .bg-size-200 {
          background-size: 200% auto;
        }
        
        /* Premium scrollbar styling */
        .customScrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .customScrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .customScrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5));
          border-radius: 10px;
        }
        .customScrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(139, 92, 246, 0.7), rgba(99, 102, 241, 0.7));
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.5) rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Event Details Modal moved to portal */}
      {isBrowser && active && createPortal(
        <AnimatePresence mode="wait">
          <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-[10vh] overflow-y-auto">
            {/* Backdrop with improved blur and animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-gradient-to-br from-black/80 via-black/85 to-purple-950/60 backdrop-blur-md"
              onClick={closeAllModals}
              style={{ touchAction: 'none' }}
            />

            {/* Floating close button with enhanced effects */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px 5px rgba(139, 92, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="fixed right-6 top-6 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-purple-700/30"
              onClick={(e) => {
                e.stopPropagation();
                closeAllModals();
              }}
            >
              <CloseIcon />
            </motion.button>

            {/* Main modal container with advanced animation */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-gradient-to-bl from-neutral-950 via-neutral-900 to-neutral-950 shadow-2xl shadow-purple-900/20 border border-white/5 mt-8 h-full"
              style={{ 
                maxHeight: 'calc(85vh - 100px)',
                boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated gradient spotlight effect */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none" 
                aria-hidden="true"
                style={{ 
                  background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.06), transparent 40%)'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }}
              />
              
              {/* Modal content with scrollable area */}
              <div className="flex flex-col h-full">
                {/* Modal header with image and title */}
                <div className="relative">
                  {/* Event image with parallax effect */}
                  <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src={getImageUrl(active._id || '', active.publicId)}
                        alt={active.title || 'Event'}
                        width={1200}
                        height={600}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(active._id || '')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/0" />
                    </motion.div>
                    
                    {/* Animated gradient overlays */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 mix-blend-overlay pointer-events-none" />
                  </div>

                  {/* Event title with animated entry */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-blue-200">
                      {active.title || 'Untitled Event'}
                    </h2>
                    <motion.div 
                      className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mt-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: 80 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    />
                  </motion.div>
                </div>

                {/* Modal body with scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 md:px-8 md:py-6 customScrollbar pb-20">
                  {/* Scroll indicator at the top */}
                  <div className="sticky top-0 left-0 right-0 z-10 flex justify-center pb-4 pointer-events-none">
                    <div className="px-4 py-2 bg-purple-900/60 rounded-full backdrop-blur-sm border border-purple-500/30 shadow-lg">
                      <div className="flex items-center gap-2 text-xs text-purple-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                        </svg>
                        <span>Scroll for actions</span>
                      </div>
                    </div>
                  </div>

                  {/* Description with animated entry */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="prose prose-sm md:prose-base prose-invert max-w-none mb-10"
                  >
                    <h3 className="text-xl text-purple-300 mb-4">About This Event</h3>
                    <div className="pl-3 border-l-2 border-purple-500/30">
                      {active.description || 'No description provided'}
                    </div>
                  </motion.div>

                  {/* Event details cards with animated entry */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
                  >
                    {/* Date Card */}
                    <div className="relative group overflow-hidden rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-500/20 backdrop-blur-sm z-0 
                        group-hover:border-purple-500/30 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300" />
                      <div className="relative z-10 flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-600/30 text-purple-400 backdrop-blur-sm shadow-inner border border-purple-500/30">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-purple-300/70 uppercase tracking-wide font-medium">Date</p>
                          <p className="text-white font-medium">{formatDate(active.date)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Time Card */}
                    <div className="relative group overflow-hidden rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-indigo-800/20 rounded-xl border border-indigo-500/20 backdrop-blur-sm z-0 
                        group-hover:border-indigo-500/30 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300" />
                      <div className="relative z-10 flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 text-indigo-400 backdrop-blur-sm shadow-inner border border-indigo-500/30">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-indigo-300/70 uppercase tracking-wide font-medium">Time</p>
                          <p className="text-white font-medium">{active.time || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Registration Card */}
                    <div className="relative group overflow-hidden rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl border border-blue-500/20 backdrop-blur-sm z-0 
                        group-hover:border-blue-500/30 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300" />
                      <div className="relative z-10 flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-600/30 text-blue-400 backdrop-blur-sm shadow-inner border border-blue-500/30">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-blue-300/70 uppercase tracking-wide font-medium">Registration</p>
                          <p className="text-white font-medium">{active.registration || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action buttons section - make it stand out and not scrollable */}
                  <div className="pt-10 pb-2 mb-4">
                    <div className="w-full max-w-xs mx-auto bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30 mb-10">
                      <div className="flex items-center justify-center gap-2 text-indigo-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Event actions are below</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons at the end of the modal content */}
                  <motion.div 
                    className="p-6 md:p-8 border-t border-white/5 bg-gradient-to-r from-purple-900/20 via-purple-800/20 to-purple-900/20 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="p-1 rounded bg-purple-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                      Available Actions
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {/* Registrations button */}
                      <motion.button
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRegistrations(active._id || null);
                        }}
                        className="relative overflow-hidden flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white font-medium transition-all duration-300 shadow-lg shadow-purple-700/20 hover:shadow-purple-700/40 hover:translate-y-[-2px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-700 before:to-purple-800 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:z-0"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>View Registrations</span>
                        </span>
                      </motion.button>
                      
                      {/* Edit button */}
                      <EditEventModal
                        eventId={active._id || ''}
                        triggerContent={
                          <span className="relative z-10 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Event</span>
                          </span>
                        }
                        triggerClassName="relative overflow-hidden flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-700/20 hover:shadow-blue-700/40 hover:translate-y-[-2px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-700 before:to-blue-800 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:z-0"
                      />
                      
                      {/* Delete button */}
                      <motion.button
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                            handleDeleteEvent(active._id || '');
                          }
                        }}
                        className="relative overflow-hidden flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white font-medium transition-all duration-300 shadow-lg shadow-red-700/20 hover:shadow-red-700/40 hover:translate-y-[-2px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-700 before:to-red-800 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:z-0"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete Event</span>
                        </span>
                      </motion.button>
                      
                      {/* Close button */}
                      <motion.button
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeAllModals();
                        }}
                        className="relative overflow-hidden flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neutral-500 to-neutral-600 px-6 py-4 text-white font-medium transition-all duration-300 shadow-lg shadow-neutral-700/20 hover:shadow-neutral-700/40 hover:translate-y-[-2px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-neutral-600 before:to-neutral-700 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:z-0"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Close</span>
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  {/* Extra space at the bottom for better scrolling */}
                  <div className="h-20"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* Registrations Modal - in a portal as well */}
      {isBrowser && showRegistrations && createPortal(
        <AnimatePresence mode="wait">
          <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-[10vh] overflow-y-auto">
            {/* Enhanced Backdrop with improved blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-gradient-to-br from-black/80 via-black/85 to-purple-950/60 backdrop-blur-md"
              onClick={() => setShowRegistrations(null)}
              style={{ touchAction: 'none' }}
            />

            {/* Premium floating close button with enhanced effects */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px 5px rgba(139, 92, 246, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="fixed right-6 top-6 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-purple-700/30"
              onClick={(e) => {
                e.stopPropagation();
                setShowRegistrations(null);
              }}
            >
              <CloseIcon className="w-4 h-4" />
            </motion.button>

            {/* Aceternity-inspired modal container with enhanced animations */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl mt-8 rounded-2xl overflow-hidden bg-gradient-to-bl from-neutral-950 via-neutral-900 to-neutral-950 shadow-2xl shadow-purple-900/20 border border-white/5"
              style={{ 
                maxHeight: 'calc(85vh - 100px)',
                boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated gradient spotlight effect */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none" 
                aria-hidden="true"
                style={{ 
                  background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.06), transparent 40%)'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }}
              />

              <div className="h-full max-h-[85vh] flex flex-col">
                {/* Header with animated title */}
                <div className="p-6 sm:p-8 border-b border-white/5 bg-gradient-to-b from-purple-900/20 to-transparent">
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-xl font-bold flex items-center gap-2"
                  >
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-600/30 backdrop-blur-sm shadow-inner">
                      <motion.svg 
                        initial={{ rotate: -10 }}
                        animate={{ rotate: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-5 h-5 text-purple-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </motion.svg>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-indigo-200 animate-gradient-slow">
                      Registrations for {events.find(e => e._id === showRegistrations)?.title || 'Event'}
                    </span>
                  </motion.h3>
                </div>

                {/* Registration content with improved scrolling */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto customScrollbar">
                    <EventRegistrations
                      eventId={showRegistrations}
                      eventTitle={events.find(e => e._id === showRegistrations)?.title || 'Event'}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* Search and filter controls - Enhanced with premium styling */}
      <div className="w-full mb-10 space-y-6 px-2">
        <div className="relative group max-w-3xl mx-auto transform transition-transform duration-300 hover:scale-[1.01]">
          {/* Animated glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
          
          <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg transition-all duration-300 group-hover:border-purple-500/30 overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-5 w-5 h-5 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              <input
                type="text"
                placeholder="Search events by title, description, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 pl-14 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-purple-300/40 text-lg transition-all duration-300"
              />
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-5 text-purple-400 hover:text-purple-200 transition-colors duration-200"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-3 text-sm">
            <span className="text-purple-200/70 font-medium">Sort by:</span>
            
            <button
              onClick={() => handleToggleSort('date')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 border overflow-hidden relative ${
                sortBy === 'date' 
                  ? 'border-purple-500/30 text-white' 
                  : 'border-white/10 text-purple-200/70 hover:border-purple-500/20 hover:text-white'
              }`}
            >
              {/* Active background with animated gradient */}
              {sortBy === 'date' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 animate-gradient-shift"></div>
              )}
              
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-all duration-300 ${sortBy === 'date' ? 'text-purple-400' : 'text-purple-400/50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              
              <span className="relative z-10">Date</span>
              
              {sortBy === 'date' && (
                <motion.svg 
                  animate={{ rotate: isAscending ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4 relative z-10" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </motion.svg>
              )}
            </button>
            
            <button
              onClick={() => handleToggleSort('title')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 border overflow-hidden relative ${
                sortBy === 'title' 
                  ? 'border-purple-500/30 text-white' 
                  : 'border-white/10 text-purple-200/70 hover:border-purple-500/20 hover:text-white'
              }`}
            >
              {/* Active background with animated gradient */}
              {sortBy === 'title' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 animate-gradient-shift"></div>
              )}
              
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-all duration-300 ${sortBy === 'title' ? 'text-purple-400' : 'text-purple-400/50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              
              <span className="relative z-10">Title</span>
              
              {sortBy === 'title' && (
                <motion.svg 
                  animate={{ rotate: isAscending ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4 relative z-10" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </motion.svg>
              )}
            </button>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
            <div className="text-purple-200/70 text-sm flex items-center gap-2">
              <span className="font-medium">{filteredAndSortedEvents.length}</span>
              <span>events found</span>
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {loading && events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 w-16 h-16 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute top-0 w-16 h-16 rounded-full border-4 border-t-transparent border-r-transparent border-b-purple-400/40 border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-purple-300/70 mt-4">Loading events...</p>
        </div>
      ) : (
        <motion.ul
          className="w-full gap-5 space-y-5"
          layout
        >
          {filteredAndSortedEvents.length > 0 ? (
            filteredAndSortedEvents.map(event => (
              <motion.li
                layoutId={`card-${event._id}-${id}`}
                key={`card-${event._id}-${id}`}
                onClick={() => setActive(event)}
                className='group relative flex flex-col sm:flex-row sm:items-center cursor-pointer rounded-xl bg-black/30 backdrop-blur-md border border-white/5 transition-all duration-500 overflow-hidden hover:border-purple-500/30'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 },
                  boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.4)'
                }}
              >
                {/* Premium animated gradient border on hover */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-[-2px] bg-gradient-to-r from-purple-500/0 via-indigo-500/0 to-pink-500/0 group-hover:from-purple-500/50 group-hover:via-indigo-500/50 group-hover:to-pink-500/50 opacity-0 group-hover:opacity-100 animate-gradient-shift transition-opacity duration-500 z-0"></div>
                </div>
                
                {/* Premium 3D parallax effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:via-purple-600/5 group-hover:to-purple-600/0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                
                {/* Dynamic inner glow effect on hover */}
                <div className="absolute inset-[-4px] rounded-xl group-hover:bg-purple-500/10 filter blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 z-0"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row gap-5 w-full p-5">
                  {/* Enhanced image container with parallax effect */}
                  <motion.div 
                    layoutId={`image-${event._id}-${id}`} 
                    className="w-full sm:w-auto flex-shrink-0 overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="relative h-48 sm:h-28 sm:w-28 rounded-lg overflow-hidden shadow-md transition-all duration-500 group-hover:shadow-purple-500/30">
                      {/* Shimmer effect on image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer z-10 opacity-0 group-hover:opacity-100" style={{ animationDuration: '1.5s' }}></div>
                      
                      <Image
                        fill
                        src={getImageUrl(event._id || '', event.publicId)}
                        alt={event.title || 'Event image'}
                        className='object-cover object-center transition-all duration-700 group-hover:scale-110'
                        onError={() => handleImageError(event._id || '')}
                      />
                      
                      {/* Elegant gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90 z-10"></div>
                      
                      {/* Date badge that appears on hover with glowing effect */}
                      {event.date && (
                        <div className="absolute bottom-2 left-2 right-2 z-20 bg-black/70 backdrop-blur-md rounded-md px-2 py-1 text-purple-300 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 border border-purple-500/0 group-hover:border-purple-500/30 group-hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(event.date)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Enhanced content with animated elements */}
                  <div className="flex-1 pl-0 sm:pl-2">
                    <div className="flex justify-between items-start">
                      <motion.h3
                        layoutId={`title-${event._id}-${id}`}
                        className='font-bold text-xl text-white transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-indigo-400 group-hover:to-pink-400 group-hover:animate-gradient-text group-hover:bg-size-200'
                      >
                        {event.title || 'Untitled Event'}
                      </motion.h3>
                    </div>
                    <motion.p
                      layoutId={`description-${event._id}-${id}`}
                      className='text-sm text-purple-200/60 line-clamp-2 mt-2 group-hover:text-purple-100/80 transition-colors duration-500'
                    >
                      {event.description || 'No description provided'}
                    </motion.p>
                    
                    {/* Tags and metadata with micro-animations */}
                    <div className="flex items-center flex-wrap gap-2 mt-3">
                      {event.time && (
                        <div className="inline-flex items-center gap-1 text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded-md transition-all duration-300 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.time}
                        </div>
                      )}
                      {event.registration && (
                        <div className="inline-flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded-md transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                          {event.registration}
                        </div>
                      )}
                    </div>
                  </div>
                
                  {/* Action buttons for event cards - simplified to only show Details button */}
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end sm:ml-auto">
                    {/* Details button */}
                    <motion.button
                      className='relative overflow-hidden rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(139,92,246,0.25)]'
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive(event);
                      }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 transition-transform duration-300 group-hover:scale-105"></span>
                      <span className="absolute inset-0 backdrop-blur-sm bg-black/10"></span>
                      <span className="relative z-10 text-white flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Details</span>
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.li>
            ))
          ) : (
            <motion.div
              className='text-center py-16 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>
                {searchTerm ? 'No matching events found' : 'No events yet'}
              </h3>
              <p className='text-purple-200/70 max-w-md mx-auto mb-4'>
                {searchTerm
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Create your first event to get started with event management.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-purple-500/20"
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
