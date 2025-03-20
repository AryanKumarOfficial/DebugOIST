'use client'
import { motion } from "framer-motion";
import { GridBackground } from "./spotlight-new";

const testimonials = [
  {
    author: {
      name: "Aryan Gupta",
      handle: "@aryan_code",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Debug Club has enhanced my problem-solving skills and helped me crack coding challenges effortlessly!",
    href: "https://twitter.com/aryan_code"
  },
  {
    author: {
      name: "Sneha Verma",
      handle: "@sneha_dev",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The hands-on coding sessions and peer reviews at Debug Club have boosted my confidence in competitive programming.",
    href: "https://twitter.com/sneha_dev"
  },
  {
    author: {
      name: "Kunal Sharma",
      handle: "@kunal_debug",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Being part of Debug Club has improved my coding logic and introduced me to real-world projects.",
    href: "https://twitter.com/kunal_debug"
  },
  {
    author: {
      name: "Priya Singh",
      handle: "@priya_code",
      avatar: "https://images.unsplash.com/photo-1518481612320-6c6b791b82f2?w=150&h=150&fit=crop&crop=face"
    },
    text: "Debug Club’s collaborative environment and coding challenges have sharpened my problem-solving skills.",
    href: "https://twitter.com/priya_code"
  }
];


export function TestimonialsSectionDemo() {
  return (
    <div className="overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02] py-10 text-white relative">
      <GridBackground />
      <div className="relative z-10">
        <h2 className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Trusted by coders from OIST
        </h2>
        <p className="text-center text-neutral-400 mb-6">
          Join a community of OIST developers and sharpen your coding skills with real-world challenges.
        </p>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex space-x-8"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 bg-black/[0.8] border border-white/[0.1] rounded-lg min-w-[300px] shadow-lg"
              >
                <img
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                  className="w-16 h-16 rounded-full mb-2"
                />
                <p className="text-sm text-neutral-300 italic">"{testimonial.text}"</p>
                <h3 className="text-neutral-50 font-semibold mt-2">
                  {testimonial.author.name}
                </h3>
                <a
                  href={testimonial.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs"
                >
                  {testimonial.author.handle}
                </a>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

