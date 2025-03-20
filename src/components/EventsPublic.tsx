'use client';

import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import useEvent, { EventProps } from '@/src/store/Event';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/src/components/ui/toast';
import useEventRegistration from '@/src/store/EventRegistration';
import gsap from 'gsap';

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

// Function to determine event status
const getEventStatus = (event: EventProps) => {
  const now = new Date().getTime();
  const eventDate = new Date(event.date).getTime();
  const registrationDate = new Date(event.registration).getTime();

  if (now > eventDate) {
    return {
      status: 'completed',
      label: 'Event Completed',
      color: 'bg-gray-500 text-white',
      glow: 'shadow-gray-500/20'
    };
  } else if (now >= registrationDate && now <= eventDate) {
    return {
      status: 'ongoing',
      label: 'Ongoing Event',
      color: 'bg-green-500 text-white',
      glow: 'shadow-green-500/20'
    };
  } else {
    return {
      status: 'upcoming',
      label: 'Upcoming Event',
      color: 'bg-blue-500 text-white',
      glow: 'shadow-blue-500/20'
    };
  }
};

// Event Card Component
const EventCard = ({ 
  event, 
  index, 
  handleRegisterForEvent, 
  isRegistered, 
  isRegistering 
}: { 
  event: EventProps & { location?: string }; // Add optional location property 
  index: number; 
  handleRegisterForEvent: (eventId: string) => void; 
  isRegistered: (eventId: string) => boolean; 
  isRegistering: string | null;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const eventStatus = getEventStatus(event);
  const router = useRouter();

  // Track mouse position for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleViewDetails = () => {
    // Navigate to event detail page
    if (event._id) {
      router.push(`/events/${event._id}`);
    }
  };

  return (
    <motion.div
      key={event._id || `event-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-xl overflow-hidden perspective"
    >
      {/* Card background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl -z-10" />

      {/* Mousefollow spotlight effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 duration-500 transition-opacity rounded-xl overflow-hidden -z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
        }}
      />

      {/* Event image */}
      <div className="h-48 overflow-hidden">
        <motion.img
          src={event.publicId
            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${event.publicId}`
            : "https://res.cloudinary.com/ducshmbin/image/upload/v1/placeholder-event"}
          alt={event.title}
          className="w-full h-full object-cover object-center"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7 }}
        />
        <div className="absolute top-0 right-0 inset-x-0 h-48 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex justify-between items-start">
            <StatusBadge status={eventStatus} />

            {/* Registration status indicator */}
            {event._id && isRegistered(event._id) && (
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg bg-green-600 text-white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Registered
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Event content */}
      <div className="p-6">
        <motion.h3
          className="text-xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors"
          layout
        >
          {event.title}
        </motion.h3>

        <div className="flex flex-col space-y-2 mb-4 text-sm">
          {/* Date */}
          <motion.div
            className="flex items-center text-neutral-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)}</span>
          </motion.div>

          {/* Time */}
          {event.time && (
            <motion.div
              className="flex items-center text-neutral-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(event.time)}</span>
            </motion.div>
          )}

          {/* Location - Only render if location exists */}
          {'location' in event && event.location && (
            <motion.div
              className="flex items-center text-neutral-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </motion.div>
          )}
        </div>

        <motion.p
          className="text-neutral-500 text-sm line-clamp-2 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {event.description}
        </motion.p>

        <div className="flex flex-col gap-2">
          <RegisterButton 
            eventId={event._id} 
            eventStatus={eventStatus} 
            isRegistered={isRegistered} 
            isRegistering={isRegistering}
            handleRegisterForEvent={handleRegisterForEvent}
          />

          {/* View Details button */}
          <motion.button
            onClick={handleViewDetails}
            className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300 border border-white/5 overflow-hidden relative"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">View Details</span>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-r from-blue-500 to-violet-500"
              transition={{ duration: 0.3 }}
              initial={{ height: 0 }}
              whileHover={{ height: '100%' }}
            />
          </motion.button>
        </div>
      </div>

      {/* Animated corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/30 via-blue-500/10 to-transparent transform rotate-45 translate-x-8 -translate-y-8"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: ReturnType<typeof getEventStatus> }) => {
  return (
    <motion.span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg ${status.color}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {status.label}
    </motion.span>
  );
};

// Register Button Component
const RegisterButton = ({ 
  eventId, 
  eventStatus, 
  isRegistered, 
  isRegistering,
  handleRegisterForEvent
}: { 
  eventId: string | undefined; 
  eventStatus: ReturnType<typeof getEventStatus>;
  isRegistered: (eventId: string) => boolean;
  isRegistering: string | null;
  handleRegisterForEvent: (eventId: string) => void;
}) => {
  if (eventStatus.status === 'completed') {
    return (
      <button
        disabled
        className="w-full py-2.5 px-4 bg-gray-700/50 text-gray-400 rounded-lg font-medium border border-gray-600/30 cursor-not-allowed"
      >
        <span className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Event Completed
        </span>
      </button>
    );
  }

  if (!eventId) return null;

  return (
    <motion.button
      onClick={() => !isRegistered(eventId) && handleRegisterForEvent(eventId)}
      disabled={isRegistering === eventId || isRegistered(eventId)}
      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300 overflow-hidden relative ${
        isRegistered(eventId)
          ? 'bg-green-600/20 text-green-400 border border-green-500/30'
          : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/20'
      }`}
      whileHover={!isRegistered(eventId) ? { y: -2 } : {}}
      whileTap={!isRegistered(eventId) ? { scale: 0.98 } : {}}
    >
      <span className="relative z-10 flex items-center justify-center">
        {isRegistering === eventId ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : isRegistered(eventId) ? (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            You're Registered
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Register Now
          </>
        )}
      </span>
      {!isRegistered(eventId) && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-r from-violet-600 to-blue-600"
          transition={{ duration: 0.3 }}
          initial={{ height: 0 }}
          whileHover={{ height: '100%' }}
        />
      )}
    </motion.button>
  );
};

// Event Filter Tabs Component
const EventFilterTabs = ({
  activeStatus,
  handleTabClick
}: {
  activeStatus: 'all' | 'upcoming' | 'ongoing' | 'completed';
  handleTabClick: (status: 'all' | 'upcoming' | 'ongoing' | 'completed') => void;
}) => {
  // Active tab line animation
  const tabIndicatorWidth = useMotionValue(0);
  const tabIndicatorLeft = useMotionValue(0);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  
  // Status icons and colors for each tab
  const tabProperties = {
    upcoming: {
      icon: (
        <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      gradient: "from-blue-500 via-cyan-400 to-blue-600",
      hoverGlow: "shadow-blue-500/50",
      particleColor: "rgba(59, 130, 246, 0.7)"
    },
    ongoing: {
      icon: (
        <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      gradient: "from-green-500 via-emerald-400 to-green-600",
      hoverGlow: "shadow-green-500/50",
      particleColor: "rgba(34, 197, 94, 0.7)" 
    },
    completed: {
      icon: (
        <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: "from-violet-500 via-purple-400 to-violet-600",
      hoverGlow: "shadow-violet-500/50",
      particleColor: "rgba(139, 92, 246, 0.7)"
    },
    all: {
      icon: (
        <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gradient: "from-indigo-500 via-sky-400 to-indigo-600",
      hoverGlow: "shadow-indigo-500/50",
      particleColor: "rgba(99, 102, 241, 0.7)"
    }
  };
  
  // Update tab indicator (animated underline)
  const updateTabIndicator = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const { width, left } = button.getBoundingClientRect();
    const parentLeft = button.parentElement?.getBoundingClientRect().left || 0;

    tabIndicatorWidth.set(width);
    tabIndicatorLeft.set(left - parentLeft);
  };

  // Set initial tab indicator position
  useEffect(() => {
    // Set initial indicator position after component mounts
    const tabsContainer = document.querySelector('.tabs-container');
    if (tabsContainer) {
      const activeTab = tabsContainer.querySelector(`[data-status="${activeStatus}"]`) as HTMLElement;
      if (activeTab) {
        const { width, left } = activeTab.getBoundingClientRect();
        const parentLeft = tabsContainer.getBoundingClientRect().left || 0;
        
        tabIndicatorWidth.set(width);
        tabIndicatorLeft.set(left - parentLeft);
      }
    }
  }, [activeStatus, tabIndicatorWidth, tabIndicatorLeft]);

  // Animation for flying particles when tab is clicked
  const generateParticles = (status: string, e: React.MouseEvent) => {
    // Get the color for the particles based on the tab
    const particleColor = tabProperties[status as keyof typeof tabProperties]?.particleColor || "rgba(99, 102, 241, 0.7)";
    
    // Create a container for the particles
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = `${e.clientX}px`;
    container.style.top = `${e.clientY}px`;
    container.style.width = '0';
    container.style.height = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '100';
    document.body.appendChild(container);
    
    // Create and animate particles
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Set particle styles
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 6 + 4}px`;
      particle.style.height = particle.style.width;
      particle.style.background = particleColor;
      particle.style.borderRadius = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.opacity = '1';
      
      // Add particle to container
      container.appendChild(particle);
      
      // Animate with variable directions, distances, and timing
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 40;
      const destinationX = Math.cos(angle) * distance;
      const destinationY = Math.sin(angle) * distance;
      
      gsap.to(particle, {
        x: destinationX,
        y: destinationY,
        opacity: 0,
        duration: Math.random() * 0.8 + 0.6,
        ease: "power2.out",
        onComplete: () => {
          particle.remove();
        }
      });
    }
    
    // Remove container after animation completes
    setTimeout(() => {
      container.remove();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="container mx-auto flex justify-center mb-12 relative"
    >
      <div className="relative flex flex-wrap gap-2 p-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 shadow-xl shadow-black/20 tabs-container overflow-hidden">
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        {/* Light streak effect */}
        <motion.div 
          className="absolute top-[-100%] left-0 w-[20px] h-[200%] bg-white/20 pointer-events-none skew-x-[-20deg]"
          initial={{ left: "-10%" }}
          animate={{ left: "110%" }}
          transition={{ 
            repeat: Infinity,
            repeatType: "loop",
            duration: 3,
            ease: "linear",
            delay: 1
          }}
        />
        
        {/* Animated active indicator with glass effect and glow */}
        <motion.div
          className={`absolute top-0 h-full rounded-full shadow-lg z-0 backdrop-blur-sm ${
            activeStatus && tabProperties[activeStatus]?.hoverGlow
          }`}
          style={{
            width: useMotionTemplate`${tabIndicatorWidth}px`,
            left: useMotionTemplate`${tabIndicatorLeft}px`,
            background: activeStatus ? `linear-gradient(to right, var(--${activeStatus}-gradient-start), var(--${activeStatus}-gradient-end))` : 'linear-gradient(to right, #4f46e5, #3b82f6)'
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            boxShadow: activeStatus === 'upcoming' 
              ? '0 0 20px 0 rgba(59, 130, 246, 0.5)' 
              : activeStatus === 'ongoing' 
                ? '0 0 20px 0 rgba(34, 197, 94, 0.5)' 
                : activeStatus === 'completed' 
                  ? '0 0 20px 0 rgba(139, 92, 246, 0.5)' 
                  : '0 0 20px 0 rgba(99, 102, 241, 0.5)'
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Inner gradient */}
          <div className={`absolute inset-0.5 rounded-full bg-gradient-to-r ${
            activeStatus && `${tabProperties[activeStatus]?.gradient}`
          } opacity-90`} />
          
          {/* Inner glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/10"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {['upcoming', 'ongoing', 'completed', 'all'].map((status) => (
          <motion.button
            key={status}
            data-status={status}
            onClick={(e) => {
              handleTabClick(status as any);
              updateTabIndicator(e);
              generateParticles(status, e);
            }}
            onMouseEnter={(e) => {
              setHoveredTab(status);
              updateTabIndicator(e);
            }}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 min-w-[120px]`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Icon and text */}
            <div className="flex items-center justify-center relative">
              {/* Status Icon */}
              {tabProperties[status as keyof typeof tabProperties]?.icon}
              
              {/* Text with masking effect */}
              <span
                className={`relative ${
                  activeStatus === status
                    ? 'text-white'
                    : hoveredTab === status 
                      ? 'text-white'
                      : 'text-blue-100/70 group-hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              
              {/* The glow dot that appears on hover for inactive tabs */}
              {activeStatus !== status && (
                <motion.span
                  className={`absolute right-[-8px] top-[1px] h-1.5 w-1.5 rounded-full bg-white`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: hoveredTab === status ? 1 : 0,
                    opacity: hoveredTab === status ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            
            {/* Subtle hover glow for inactive tabs */}
            {activeStatus !== status && (
              <motion.div
                className={`absolute inset-0 rounded-full opacity-0 transition-opacity duration-300`}
                style={{
                  boxShadow: `0 0 15px 2px ${tabProperties[status as keyof typeof tabProperties]?.particleColor || "rgba(59, 130, 246, 0.3)"}`,
                  opacity: hoveredTab === status ? 0.3 : 0
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Style variables for gradient colors based on status */}
      <style jsx global>{`
        :root {
          --upcoming-gradient-start: #3b82f6;
          --upcoming-gradient-end: #0ea5e9;
          --ongoing-gradient-start: #22c55e;
          --ongoing-gradient-end: #10b981;
          --completed-gradient-start: #8b5cf6;
          --completed-gradient-end: #a855f7;
          --all-gradient-start: #6366f1;
          --all-gradient-end: #a855f7;
        }
      `}</style>
    </motion.div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative flex items-center justify-center">
        {/* Animated loading spinner */}
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-blue-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-transparent border-r-blue-300 border-b-blue-400 border-l-blue-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Loading text with typing effect */}
        <motion.p
          className="absolute mt-28 text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading events
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
          >
            .
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ activeStatus }: { activeStatus: string }) => {
  return (
    <motion.div
      className="text-center py-16 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.svg
        className="w-16 h-16 text-blue-500/30 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </motion.svg>
      <motion.h3
        className="text-xl font-medium text-white mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        No {activeStatus !== 'all' ? activeStatus : ''} events found
      </motion.h3>
      <motion.p
        className="text-neutral-400 max-w-md mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {activeStatus === 'upcoming'
          ? 'There are no upcoming events scheduled at the moment. Please check back later.'
          : `There are no ${activeStatus} events to display.`}
      </motion.p>
    </motion.div>
  );
};

// Background Animation Component
const AnimatedBackground = () => {
  return (
    <motion.div 
      className="absolute inset-0 -z-10"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(25, 30, 45, 0.3), rgba(10, 10, 15, 0.5)), radial-gradient(circle at 80% 20%, rgba(100, 100, 255, 0.08), transparent 25%), radial-gradient(circle at 20% 80%, rgba(155, 100, 255, 0.08), transparent 25%)'
      }}
      animate={{
        background: [
            'radial-gradient(circle at 50% 50%, rgba(25, 30, 45, 0.3), rgba(10, 10, 15, 0.5)), radial-gradient(circle at 80% 20%, rgba(100, 100, 255, 0.08), transparent 25%), radial-gradient(circle at 20% 80%, rgba(155, 100, 255, 0.08), transparent 25%)',
            'radial-gradient(circle at 50% 50%, rgba(25, 30, 45, 0.3), rgba(10, 10, 15, 0.5)), radial-gradient(circle at 70% 30%, rgba(100, 100, 255, 0.08), transparent 25%), radial-gradient(circle at 30% 70%, rgba(155, 100, 255, 0.08), transparent 25%)',
            'radial-gradient(circle at 50% 50%, rgba(25, 30, 45, 0.3), rgba(10, 10, 15, 0.5)), radial-gradient(circle at 80% 20%, rgba(100, 100, 255, 0.08), transparent 25%), radial-gradient(circle at 20% 80%, rgba(155, 100, 255, 0.08), transparent 25%)'
        ]
      }}
      transition={{
        background: {
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
        }
      }}
    />
  );
};

// Main Component
export default function EventsPublic() {
  const { events, loading, getEvents } = useEvent();
  const { isSignedIn, userId } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const { registerForEvent, checkIfRegistered, registrations, getRegistrations } = useEventRegistration();
  const [registrationLoading, setRegistrationLoading] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  // Fetch events when component mounts
  useEffect(() => {
    getEvents();
  }, [getEvents]);

  // Fetch user registrations when user is authenticated
  useEffect(() => {
    if (isSignedIn && userId) {
      getRegistrations(userId);
    }
  }, [isSignedIn, userId, getRegistrations]);

  // Visibility change effect to refresh registrations
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userId && isSignedIn) {
        getRegistrations(userId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, isSignedIn, getRegistrations]);

  // Filter events based on selected status
  const filteredEvents = events.filter(event => {
    if (selectedStatus === 'all') return true;
    return getEventStatus(event).status === selectedStatus;
  });

  // Check if user is registered for an event
  const isRegistered = (eventId: string) => {
    if (!userId || !isSignedIn) return false;
    return checkIfRegistered(eventId, userId!);
  };

  // Handle registration
  const handleRegister = async (eventId: string) => {
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

    try {
      setRegistrationLoading(eventId);
      await registerForEvent(eventId, userId!);
      addToast({
        title: 'Registration successful',
        description: `You are now registered for the event`,
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

  return (
    <motion.div 
      className="relative py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background */}
      <AnimatedBackground />

      {/* Status filter tabs */}
      <EventFilterTabs 
        activeStatus={selectedStatus} 
        handleTabClick={(status) => setSelectedStatus(status)} 
      />

      {/* Events grid */}
      <div className="container mx-auto px-4">
        {loading ? (
          <LoadingSpinner />
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event._id || `event-${index}`}
                  event={event}
                  index={index}
                  handleRegisterForEvent={handleRegister}
                  isRegistered={isRegistered}
                  isRegistering={registrationLoading}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState activeStatus={selectedStatus} />
        )}
      </div>
    </motion.div>
  );
} 