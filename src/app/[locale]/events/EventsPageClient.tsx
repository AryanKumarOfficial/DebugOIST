'use client';

import React, { useRef, useEffect, useState } from 'react';
import EventsPublic from '@/src/components/EventsPublic';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function EventsPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxX1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const parallaxX2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.8], [1, 1, 0.8, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 90,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  // Floating circles for background
  const generateFloatingElements = (count: number) => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 140 + 40,
      delay: Math.random() * 5,
      duration: Math.random() * 20 + 15,
      opacity: Math.random() * 0.12 + 0.03,
    }));
  };

  const [floatingElements] = useState(generateFloatingElements(8));

  return (
    <main 
      ref={containerRef} 
      className="relative min-h-screen py-16 md:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-gray-950 to-black"
    >
      {/* 3D Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent opacity-70" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Animated subtle floating circles */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: element.size,
              height: element.size,
              background: "radial-gradient(circle, rgba(56,182,255,0.15) 0%, rgba(124,58,237,0.03) 70%, rgba(0,0,0,0) 100%)",
              opacity: element.opacity,
              x: parallaxX1,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [element.opacity, element.opacity * 1.4, element.opacity],
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: element.duration,
                ease: "easeInOut",
                delay: element.delay,
              },
              opacity: {
                repeat: Infinity,
                duration: element.duration / 2,
                ease: "easeInOut",
                delay: element.delay,
              }
            }}
          />
        ))}

        {/* Top horizontal glowing line */}
        <div
          className="absolute top-0 w-full h-px opacity-70"
          style={{
            background: "linear-gradient(90deg, rgba(59, 130, 246, 0) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(59, 130, 246, 0) 100%)"
          }}
        />
        
        {/* Glow effect responsive to mouse position */}
        <div
          className="absolute pointer-events-none opacity-40 blur-[80px] -z-10 transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(139,92,246,0.18) 45%, rgba(0,0,0,0) 70%)",
            left: `${mousePosition.x / 10}px`,
            top: `${mousePosition.y / 10}px`,
            width: "600px",
            height: "600px",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Main content with enhanced animations */}
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ opacity, scale }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge + Header Section */}
        <motion.div 
          className="mb-16 text-center relative z-10"
          variants={itemVariants}
        >
          {/* Floating Badge */}
          <div className="inline-block relative mb-5 mx-auto">
            <motion.div
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/90 to-violet-600/90 shadow-lg shadow-blue-500/30 border border-white/10 backdrop-blur-md relative overflow-hidden group"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -2 }}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shine effect */}
              <motion.div 
                className="absolute inset-0 w-full h-full"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 75%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0) 85%, rgba(255,255,255,0) 100%)",
                    "linear-gradient(45deg, rgba(255,255,255,0) 15%, rgba(255,255,255,0) 90%, rgba(255,255,255,0.2) 95%, rgba(255,255,255,0) 100%, rgba(255,255,255,0) 100%)"
                  ],
                  backgroundSize: "200% 200%",
                  backgroundPosition: ["0% 0%", "100% 100%"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
              
              <motion.span
                className="text-sm uppercase tracking-widest font-bold text-white relative z-10 inline-flex items-center"
                animate={{ textShadow: ["0 0 8px rgba(255,255,255,0.7)", "0 0 2px rgba(255,255,255,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <svg 
                  className="w-4 h-4 mr-2 text-yellow-300" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" />
                </svg>
                Programming Club Events
              </motion.span>
            </motion.div>
          </div>

          {/* Main Title with 3D effect */}
          <motion.div 
            className="mb-6 relative"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-2 drop-shadow-xl"
              style={{ 
                textShadow: "0 10px 30px rgba(0,0,0,0.5)",
                transform: `perspective(1000px) rotateX(${scrollY * 0.01}deg)`,
              }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 relative">
                Explore Our Events
              </span>
            </motion.h1>
            
            {/* Animated underline */}
            <motion.div 
              className="w-full sm:w-1/2 h-1 mx-auto mt-2 rounded-full bg-gradient-to-r from-blue-500/60 via-indigo-500/80 to-purple-500/60"
              initial={{ width: "0%" }}
              animate={{ width: "50%" }}
              transition={{ 
                duration: 1.2,
                delay: 0.5,
                ease: [0.25, 1, 0.5, 1]
              }}
            />
          </motion.div>
          
          {/* Description with glass effect */}
          <motion.div
            className="max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <motion.p 
              className="text-lg text-neutral-300 px-6 py-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl"
              whileHover={{ 
                backgroundColor: "rgba(255,255,255,0.07)",
                transition: { duration: 0.2 }
              }}
            >
              Discover our programming events ranging from workshops to competitions. 
              Join ongoing events, register for upcoming ones, or explore our past achievements 
              to enhance your programming journey.
            </motion.p>
          </motion.div>
        </motion.div>
        
        {/* Events listing with enhanced container */}
        <motion.div 
          className="relative z-10 rounded-2xl backdrop-blur-sm bg-white/[0.02] border border-white/10 shadow-2xl p-4 md:p-8"
          variants={itemVariants}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            backgroundColor: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.15)",
            transition: { duration: 0.3 }
          }}
        >
          <EventsPublic />
        </motion.div>
      </motion.div>
    </main>
  );
} 