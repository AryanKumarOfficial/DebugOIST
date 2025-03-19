'use client';

import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import useEvent, { EventProps } from '@/src/store/Event';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/src/components/ui/toast';
import useEventRegistration from '@/src/store/EventRegistration';

// Event Card Component
const EventCard = ({ 
    event, 
    index, 
    handleRegisterForEvent, 
    isRegistered, 
    isRegistering, 
    handleViewAllEvents 
}: { 
    event: EventProps; 
    index: number; 
    handleRegisterForEvent: (eventId: string | undefined) => void; 
    isRegistered: (eventId: string | undefined) => boolean; 
    isRegistering: boolean;
    handleViewAllEvents: () => void;
}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const eventStatus = getEventStatus(event);

    // Track mouse position for spotlight effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
                </div>

                <motion.p
                    className="text-neutral-500 text-sm line-clamp-2 mb-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
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
                        onClick={handleViewAllEvents}
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
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
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
    isRegistered: (eventId: string | undefined) => boolean;
    isRegistering: boolean;
    handleRegisterForEvent: (eventId: string | undefined) => void;
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
            disabled={isRegistering || isRegistered(eventId)}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-300 overflow-hidden relative ${
                isRegistered(eventId)
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/20'
            }`}
            whileHover={!isRegistered(eventId) ? { y: -2 } : {}}
            whileTap={!isRegistered(eventId) ? { scale: 0.98 } : {}}
        >
            <span className="relative z-10 flex items-center justify-center">
                {isRegistering ? (
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="container mx-auto flex justify-center mb-12 relative"
        >
            <div className="relative flex flex-wrap gap-2 p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-lg shadow-black/30 tabs-container">
                {/* Animated active indicator with stronger glow */}
                <motion.div
                    className="absolute top-0 h-full rounded-full bg-gradient-to-r from-blue-700/90 to-violet-700/90 shadow-lg shadow-blue-500/30 z-0"
                    style={{
                        width: useMotionTemplate`${tabIndicatorWidth}px`,
                        left: useMotionTemplate`${tabIndicatorLeft}px`,
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />

                {['upcoming', 'ongoing', 'completed', 'all'].map((status) => (
                    <button
                        key={status}
                        data-status={status}
                        onClick={(e) => {
                            handleTabClick(status as any);
                            updateTabIndicator(e);
                        }}
                        onMouseEnter={updateTabIndicator}
                        className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 ${
                            activeStatus === status
                                ? 'text-white'
                                : 'text-blue-200 hover:text-white'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
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

// View All Button Component
const ViewAllButton = ({ onClick }: { onClick: () => void }) => {
    const magneticRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Magnetic button effect 
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const magneticButton = magneticRef.current;

            if (magneticButton) {
                const { left, top, width, height } = magneticButton.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;

                // Check if we're hovering the magnetic button
                const isHovering =
                    clientX >= left &&
                    clientX <= left + width &&
                    clientY >= top &&
                    clientY <= top + height;

                if (isHovering) {
                    // Calculate distance from center
                    const offsetX = clientX - centerX;
                    const offsetY = clientY - centerY;

                    // Gradually move toward the mouse with spring physics
                    x.set(offsetX * 0.3);
                    y.set(offsetY * 0.3);
                } else {
                    // Reset when not hovering
                    x.set(0);
                    y.set(0);
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [x, y]);

    return (
        <motion.div
            ref={magneticRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-10 flex justify-center"
            style={{ 
                x, 
                y,
                transition: 'transform 0.2s ease-out' 
            }}
        >
            <motion.button
                onClick={onClick}
                className="group relative px-10 py-4 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-violet-700 text-white font-bold text-lg shadow-xl shadow-blue-700/20"
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
            >
                <span className="relative z-10 tracking-wide">View All Events</span>
                
                {/* Button hover effects */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-700 to-blue-700 opacity-0"
                    variants={{
                        hover: { opacity: 1 }
                    }}
                    transition={{ duration: 0.3 }}
                />
                
                {/* Hover glow effect */}
                <motion.div
                    className="absolute -inset-1 rounded-full opacity-0 blur-md"
                    style={{ background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)' }}
                    variants={{
                        hover: { opacity: 0.6 }
                    }}
                    transition={{ duration: 0.3 }}
                />
                
                {/* Button shine effect */}
                <motion.div
                    className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/30 skew-x-12 z-0"
                    variants={{
                        hover: { left: '150%' }
                    }}
                    transition={{ duration: 1 }}
                />
            </motion.button>
        </motion.div>
    );
};

// Title Section Component
const TitleSection = ({ activeStatus }: { activeStatus: string }) => {
    // Staggered animation for elements
    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            }
        }
    };

    const staggerItem = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.7,
                ease: [0.25, 1, 0.5, 1],
            }
        }
    };
    
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="container mx-auto text-center mb-16 relative z-30 p-8 rounded-xl"
        >
            {/* Main Title - Elegant with Better Visibility */}
            <motion.h2 
                variants={staggerItem}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8"
            >
                <motion.span 
                    className="relative inline-block"
                >
                    {/* Semi-solid background for better text visibility */}
                    <span className="absolute inset-0 bg-black/50 rounded-lg -z-5"></span>
                    
                    <motion.span 
                        className="bg-gradient-to-r from-blue-200 via-violet-200 to-pink-200 bg-clip-text text-transparent drop-shadow-xl relative"
                        style={{
                            textShadow: "0 2px 4px rgba(0,0,0,0.9)"
                        }}
                        animate={{ 
                            filter: [
                                "drop-shadow(0 0 4px rgba(255,255,255,0.5))", 
                                "drop-shadow(0 0 10px rgba(255,255,255,0.7))",
                                "drop-shadow(0 0 4px rgba(255,255,255,0.5))"
                            ] 
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        {activeStatus} Events
                    </motion.span>
                </motion.span>
            </motion.h2>

            {/* Description - Elegant with Better Visibility */}
            <motion.p
                variants={staggerItem}
                className="max-w-2xl mx-auto text-white text-base font-medium px-4 py-2 bg-black/30 backdrop-blur-sm rounded-xl"
            >
                Discover programming workshops, competitions, and meetups. Filter by status to find what interests you.
            </motion.p>
        </motion.div>
    );
};

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

// Main FeaturedEvents Component
export default function FeaturedEvents() {
    const { events, loading, getEvents } = useEvent();
    const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('upcoming');
    const router = useRouter();
    const sectionRef = useRef(null);
    const { userId, isSignedIn } = useAuth();
    const { addToast } = useToast();
    
    const { 
        registrations, 
        getRegistrations, 
        registerForEvent, 
        checkIfRegistered, 
        registering: isRegistering,
        loading: registrationsLoading 
    } = useEventRegistration();

    // Fetch events when component mounts
    useEffect(() => {
        getEvents();
    }, [getEvents]);

    // Fetch user registrations when user is authenticated
    useEffect(() => {
        if (userId && isSignedIn) {
            getRegistrations(userId);
        }
    }, [userId, isSignedIn, getRegistrations]);

    // This visibility change effect ensures we refresh registrations when returning to the tab
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

    // Method to handle event registration with toast notifications
    const handleRegisterForEvent = async (eventId: string | undefined) => {
        if (!eventId) {
            console.error('Missing event ID');
            return;
        }

        if (!userId || !isSignedIn) {
            addToast({
                title: 'Authentication Required',
                description: 'Please sign in to register for events',
                variant: 'error',
            });
            return;
        }

        try {
            await registerForEvent(eventId, userId);
            addToast({
                title: 'Success!',
                description: 'Successfully registered for event!',
                variant: 'success',
            });
        } catch (error: any) {
            addToast({
                title: 'Registration Failed',
                description: error.message || 'Failed to register for event',
                variant: 'error',
            });
            console.error('Registration error:', error);
        }
    };

    // Function to check if user is registered for an event
    const isRegistered = (eventId: string | undefined): boolean => {
        if (!eventId || !userId) return false;
        return checkIfRegistered(eventId, userId);
    };

    // Filter events based on selected status
    const filteredEvents = events.filter(event => {
        if (activeStatus === 'all') return true;
        return getEventStatus(event).status === activeStatus;
    });

    // View all events handler
    const handleViewAllEvents = () => {
        router.push('/events');
    };

    // Handle tab click
    const handleTabClick = (status: 'all' | 'upcoming' | 'ongoing' | 'completed') => {
        setActiveStatus(status);
    };

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative py-20 overflow-hidden"
        >
            {/* Animated gradient background */}
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

            <div className="container mx-auto px-4">
                {/* Title Section */}
                <TitleSection activeStatus={activeStatus} />

                {/* Events filter tabs */}
                <EventFilterTabs activeStatus={activeStatus} handleTabClick={handleTabClick} />

                {/* Events cards */}
                <div className="container mx-auto">
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
                                        handleRegisterForEvent={handleRegisterForEvent}
                                        isRegistered={isRegistered}
                                        isRegistering={isRegistering}
                                        handleViewAllEvents={handleViewAllEvents}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <EmptyState activeStatus={activeStatus} />
                    )}

                    {/* View all events button */}
                    {filteredEvents.length > 0 && (
                        <ViewAllButton onClick={handleViewAllEvents} />
                    )}
                </div>
            </div>
        </motion.section>
    );
} 