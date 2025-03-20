'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import useEvent, { EventProps } from '@/src/store/Event';
import useEventRegistration from '@/src/store/EventRegistration';
import { useToast } from '@/src/components/ui/toast';
import gsap from 'gsap';

// Type augmentation for EventProps to include location
interface EventWithLocation extends EventProps {
  location?: string;
}

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
      glow: 'shadow-gray-500/20',
      gradientFrom: 'from-gray-600',
      gradientTo: 'to-gray-800'
    };
  } else if (now >= registrationDate && now <= eventDate) {
    return {
      status: 'ongoing',
      label: 'Ongoing Event',
      color: 'bg-green-500 text-white',
      glow: 'shadow-green-500/30',
      gradientFrom: 'from-green-600',
      gradientTo: 'to-green-800'
    };
  } else {
    return {
      status: 'upcoming',
      label: 'Upcoming Event',
      color: 'bg-blue-500 text-white',
      glow: 'shadow-blue-500/30',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-blue-800'
    };
  }
};

// Shimmer effect component
const ShimmerButton = ({ 
  children, 
  onClick,
  disabled = false,
  className = ""
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <motion.button
      disabled={disabled}
      onClick={onClick}
      className={`relative overflow-hidden py-3 px-6 rounded-lg font-medium 
                ${disabled 
                  ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white'} 
                ${className}`}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {!disabled && (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
            transform: "translateX(-100%)"
          }}
          animate={{ x: ["0%", "100%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// 3D parallax floating element
const ParallaxElement = ({ 
  children, 
  depth = 1, 
  className = "" 
}: { 
  children: React.ReactNode; 
  depth?: number;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
        
        // Calculate mouse position relative to the center of the element
        const x = (ev.clientX - rect.left - rect.width / 2) / 20;
        const y = (ev.clientY - rect.top - rect.height / 2) / 20;
        
        setMousePosition({ x: x / depth, y: y / depth });
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [depth]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform: `translateX(${mousePosition.x}px) translateY(${mousePosition.y}px)`
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// Floating orbs background component
const FloatingOrbs = () => {
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orbsRef.current) return;

    const orbs = Array.from(orbsRef.current.children);
    
    orbs.forEach((orb, index) => {
      const delay = index * 0.2;
      const duration = 20 + Math.random() * 20;
      
      gsap.to(orb, {
        y: -30,
        repeat: -1,
        yoyo: true,
        duration: duration,
        ease: "sine.inOut",
        delay: delay,
      });
      
      gsap.to(orb, {
        x: 20,
        repeat: -1,
        yoyo: true,
        duration: duration * 1.3,
        ease: "sine.inOut",
        delay: delay,
      });
    });
  }, []);

  const orbs = [
    { size: 300, color: "rgba(59, 130, 246, 0.08)", top: "5%", left: "10%" },
    { size: 450, color: "rgba(124, 58, 237, 0.07)", top: "30%", right: "5%" },
    { size: 250, color: "rgba(16, 185, 129, 0.06)", bottom: "10%", left: "20%" },
    { size: 280, color: "rgba(220, 38, 38, 0.04)", top: "15%", right: "20%" },
  ];

  return (
    <div 
      ref={orbsRef} 
      className="fixed inset-0 overflow-hidden pointer-events-none"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl opacity-80"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
          }}
        />
      ))}
    </div>
  );
};

// EventDetailsClient component
export default function EventDetailsClient({ eventId }: { eventId: string }) {
  const eventStore = useEvent();
  const { isSignedIn, userId } = useAuth();
  const { registerForEvent, checkIfRegistered, getRegistrations } = useEventRegistration();
  const { addToast } = useToast();
  const router = useRouter();
  const [event, setEvent] = useState<EventWithLocation | null>(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Header animations based on scroll
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const contentScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.98]);

  // Fetch event data
  useEffect(() => {
    if (eventId && eventStore) {
      // Find the event by ID using the getEventById function
      const foundEvent = eventStore.getEventById(eventId);
      if (foundEvent) {
        setEvent(foundEvent as EventWithLocation);
      }
    }
  }, [eventId, eventStore]);

  // Fetch user registrations
  useEffect(() => {
    if (isSignedIn && userId) {
      getRegistrations(userId);
    }
  }, [isSignedIn, userId, getRegistrations]);

  const eventStatus = event ? getEventStatus(event) : null;
  const isEventCompleted = eventStatus?.status === 'completed';
  
  // Check if user is registered for this event
  const userIsRegistered = (userId && event?._id) 
    ? checkIfRegistered(event._id, userId) 
    : false;

  // Handle event registration
  const handleRegisterForEvent = async () => {
    if (!event?._id) return;
    
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
      setRegistrationLoading(true);
      await registerForEvent(event._id, userId!);
      addToast({
        title: 'Registration successful',
        description: `You are now registered for ${event.title}`,
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
      setRegistrationLoading(false);
    }
  };

  if (eventStore.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-transparent border-r-blue-300 border-b-transparent border-l-blue-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.p
            className="mt-8 text-blue-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading event details...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <motion.svg
            className="w-20 h-20 mx-auto text-blue-500/50 mb-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
          
          <motion.h1
            className="text-2xl font-bold text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Event Not Found
          </motion.h1>
          
          <motion.p
            className="text-neutral-400 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            We couldn't find the event you're looking for. It may have been removed or the link might be incorrect.
          </motion.p>
          
          <ShimmerButton
            onClick={() => router.push('/events')}
          >
            View All Events
          </ShimmerButton>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white relative overflow-hidden"
    >
      {/* Floating orbs background */}
      <FloatingOrbs />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
      
      {/* Hero section with image and title */}
      <motion.div 
        className="relative h-[40vh] md:h-[50vh] overflow-hidden"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        {/* Event image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10" />
          <motion.img
            src={event.publicId
              ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${event.publicId}`
              : "https://res.cloudinary.com/ducshmbin/image/upload/v1/placeholder-event"}
            alt={event.title}
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-20">
          <div className="max-w-3xl">
            {/* Event status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${eventStatus?.color} ${eventStatus?.glow}`}>
                {eventStatus?.label}
              </span>
            </motion.div>
            
            {/* Event title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 tracking-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {event.title}
            </motion.h1>
            
            {/* Basic event info */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mt-6 text-neutral-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(event.date)}</span>
              </div>
              
              {event.time && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatTime(event.time)}</span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 bg-gradient-to-b from-black to-gray-900 pt-12 pb-24 rounded-t-[40px] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)]"
        style={{ scale: contentScale }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Event details */}
            <div className="lg:col-span-2">
              {/* About section */}
              <motion.section
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ParallaxElement depth={2} className="mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 inline-block">
                    About This Event
                  </h2>
                </ParallaxElement>
                
                <motion.div 
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
                  whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="prose prose-invert max-w-none">
                    <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              </motion.section>
              
              {/* Event highlights */}
              <motion.section
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <ParallaxElement depth={2.5} className="mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 inline-block">
                    Event Highlights
                  </h2>
                </ParallaxElement>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: "🚀", title: "Learn new skills", description: "Enhance your programming knowledge" },
                    { icon: "👨‍💻", title: "Hands-on experience", description: "Work on real-world projects" },
                    { icon: "🏆", title: "Win prizes", description: "Compete for exciting rewards" },
                    { icon: "🌐", title: "Networking", description: "Connect with like-minded individuals" }
                  ].map((highlight, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10"
                      whileHover={{ 
                        y: -5, 
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
                        borderColor: "rgba(255, 255, 255, 0.2)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl bg-white/10 rounded-lg mr-4">
                          {highlight.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-white mb-1">{highlight.title}</h3>
                          <p className="text-sm text-neutral-400">{highlight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>
            
            {/* Right column - Registration and additional info */}
            <div>
              {/* Registration card */}
              <motion.div
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-xl sticky top-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)" }}
              >
                <h3 className="text-xl font-semibold mb-4">Registration</h3>
                
                {/* Registration opens date */}
                <div className="flex items-center mb-4 text-neutral-300">
                  <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-neutral-400">Registration opens</div>
                    <div>{formatDate(event.registration)}</div>
                  </div>
                </div>
                
                {/* Registration status */}
                <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  {userIsRegistered ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-green-500 rounded-full p-2 mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">You're registered</div>
                          <div className="text-sm text-neutral-400">We look forward to seeing you!</div>
                        </div>
                      </div>
                    </div>
                  ) : isEventCompleted ? (
                    <div className="flex items-center">
                      <div className="bg-gray-700 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Event completed</div>
                        <div className="text-sm text-neutral-400">This event has already happened</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">Registration is open</div>
                      <div className="text-sm text-neutral-400 mb-3">
                        Secure your spot in this exciting event!
                      </div>
                      <ShimmerButton
                        onClick={handleRegisterForEvent}
                        disabled={isEventCompleted || registrationLoading}
                        className="w-full"
                      >
                        {registrationLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </div>
                        ) : (
                          <>Register Now</>
                        )}
                      </ShimmerButton>
                    </div>
                  )}
                </div>
                
                {/* Event info */}
                <div className="space-y-4">
                  <h4 className="font-medium">Event Information</h4>
                  
                  {/* Duration info if available */}
                  <div className="flex">
                    <svg className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm text-neutral-400">Duration</div>
                      <div className="text-white">Approximately 2 hours</div>
                    </div>
                  </div>
                  
                  {/* Skill level */}
                  <div className="flex">
                    <svg className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <div className="text-sm text-neutral-400">Skill Level</div>
                      <div className="text-white">All levels welcome</div>
                    </div>
                  </div>
                  
                  {/* Format */}
                  <div className="flex">
                    <svg className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="text-sm text-neutral-400">Format</div>
                      <div className="text-white">In-person</div>
                    </div>
                  </div>
                  
                  {/* Language */}
                  <div className="flex">
                    <svg className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <div>
                      <div className="text-sm text-neutral-400">Language</div>
                      <div className="text-white">English</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Back button */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ShimmerButton
              onClick={() => router.push('/events')}
              className="bg-white/10 hover:bg-white/20 from-transparent to-transparent"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Events
              </div>
            </ShimmerButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
