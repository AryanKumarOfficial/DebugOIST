'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger
} from '@/src/components/ui/animated-modal';
import EventForm from '@/src/components/EventForm';
import { ExpandableEvents } from '@/src/components/EventsList';

// Add shimmer animation that can be used in EventsList
const ShimmerStyles = () => (
  <style jsx global>{`
    @keyframes floating {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-floating {
      animation: floating 3s ease-in-out infinite;
    }
    
    @keyframes pulse-glow {
      0%, 100% {
        opacity: 0.6;
        filter: saturate(1);
      }
      50% {
        opacity: 1;
        filter: saturate(1.5);
      }
    }
    .animate-pulse-glow {
      animation: pulse-glow 4s ease-in-out infinite;
    }
    
    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out forwards;
    }
    
    @keyframes scale-up {
      0% {
        transform: scale(0.95);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .animate-scale-up {
      animation: scale-up 0.4s ease-out forwards;
    }
    
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
  `}</style>
);

const EventsComponent: React.FC = () => {
  return (
    <div className="w-full bg-transparent text-white relative events-component">
      {/* Add shimmer styles */}
      <ShimmerStyles />

      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-20"></div>
      </div>
      
      {/* Create Event Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-center mb-10 relative z-10"
      >
        <Modal>
          <ModalTrigger className="group relative overflow-hidden flex h-14 px-6 items-center justify-center gap-2 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 text-white transition-all duration-300">
            {/* Premium background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-indigo-600/0 to-pink-600/0 group-hover:from-purple-600/50 group-hover:via-indigo-600/50 group-hover:to-pink-600/50 transition-all duration-500"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            
            {/* Inner glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-indigo-500/10 to-purple-500/0"></div>
            </div>
            
            <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="relative z-10 font-medium">Create New Event</span>
          </ModalTrigger>
          <ModalBody>
            <ModalContent className="bg-transparent text-white">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-6 text-center">
                Create a new event
              </h3>
              <div className="overflow-hidden">
                <EventForm />
              </div>
            </ModalContent>
          </ModalBody>
        </Modal>
      </motion.div>

      {/* Events List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 backdrop-blur-xl bg-black/20 rounded-2xl p-6 border border-white/10 shadow-xl"
      >
        <ExpandableEvents />
      </motion.div>
      
      {/* Add additional styles to ensure modals work properly */}
      <style jsx global>{`
        /* Ensure modals are rendered at the root level */
        #__next {
          position: relative;
          z-index: 1;
        }
        
        /* Prevent stacking context issues */
        .events-component {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default EventsComponent;
