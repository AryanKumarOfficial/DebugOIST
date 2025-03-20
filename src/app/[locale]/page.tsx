'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SplineSceneBasic } from '@/components/ModelThreeD';
import FeaturedEvents from '@/src/components/FeaturedEvents';
import { useEffect, useRef, useState } from 'react';

export default function DashboardPage() {
  const t = useTranslations('');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const [mounted, setMounted] = useState(false);

  // Particles effect state
  const [particles, setParticles] = useState<Array<{ x: number, y: number, size: number, speed: number, opacity: number }>>([]);

  useEffect(() => {
    setMounted(true);

    // Generate random particles
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1
    }));

    setParticles(newParticles);

    // Clean up function
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Animated particles background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {mounted && particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-blue-400"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: ["0%", `${particle.speed * 100}%`],
              opacity: [particle.opacity, particle.opacity * 0.4, particle.opacity],
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 10 / particle.speed,
                ease: "linear",
                repeatType: "reverse"
              },
              opacity: {
                repeat: Infinity,
                duration: 3 / particle.speed,
                ease: "easeInOut"
              }
            }}
          />
        ))}
      </div>

      {/* Hero section with 3D model */}
      <SplineSceneBasic />


      {/* Featured Events Component */}
      <FeaturedEvents />

      {/* Add necessary global styles */}
      <style jsx global>{`
        body {
          background-color: #030014;
          color: white;
          overflow-x: hidden;
        }

        /* Add smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom cursor effect */
        .custom-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          position: fixed;
          transform: translate(-50%, -50%);
          pointer-events: none;
          transition: width 0.3s, height 0.3s, border-color 0.3s;
          z-index: 9999;
          backdrop-filter: invert(100%);
          mix-blend-mode: difference;
        }
        
        .custom-cursor.hover {
          width: 40px;
          height: 40px;
          border-color: rgba(255, 255, 255, 1);
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
