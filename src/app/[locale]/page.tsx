'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Code,
  Lightbulb
} from 'lucide-react';
import { SplineScene } from "@/components/ui/splite";
import { Link } from '@/src/navigation';
import useEvent from '@/src/store/Event';
import { Modal, ModalBody, ModalContent, ModalTrigger } from '@/src/components/ui/animated-modal';
import RegistraionModal from './components/Registration';
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import * as z from "zod"
import { EventProps } from "@/src/store/Event"
import { format, parse } from 'date-fns';


export default function DashboardPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className="w-full min-h-screen bg-black text-white">
      <main className="w-full">
        <HeroSection />
        <FeaturesSection />

        <EventsSection />
        <ProjectsSection />

        <JoinSection />
      </main>

      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="bg-neutral-900 border-none max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <RegistraionModal event={selectedEvent} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HeroSection() {
  // Container and item variants for text animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="relative w-full min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Elements with pointer events disabled */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-violet-900/10 to-transparent"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative w-full flex flex-col lg:flex-row items-center justify-between">
        {/* Left: Text Content with higher z-index */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:w-1/2 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left px-8"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
              Oriental Institute of Science and Technology
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400">
              Debug Programming Club
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-zinc-300/90 mb-8 leading-relaxed"
          >
            Join a community of passionate developers and innovators. Build real-world projects and solve creative challenges alongside like-minded peers.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <Button disabled className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-6 py-3 rounded-md text-base font-medium">
              Join Club
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-6 py-3 rounded-md text-base font-medium"
            >
              <Link href="/events">View Events</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex items-center gap-6"
          >
            <div className="flex -space-x-3 z-10">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 border-2 border-black flex items-center justify-center text-white text-xs font-bold"
                >
                  {i}
                </div>
              ))}
            </div>
            <p className="text-zinc-400 text-sm">
              Join <span className="text-white font-medium">15+</span> core members
            </p>
          </motion.div>
        </motion.div>

        {/* Right: Robot Spline Scene with pointer events disabled */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:w-1/2 relative pointer-events-none"
        >
          <div className="w-full h-[500px] md:h-[600px]">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Hands-on Workshops",
      description: "Weekly coding sessions focused on practical skills and modern technologies",
      icon: <Code className="w-6 h-6 text-blue-400" />
    },
    {
      title: "Hackathons",
      description: "Collaborative events to build innovative solutions for real-world problems",
      icon: <Lightbulb className="w-6 h-6 text-violet-400" />
    },
    {
      title: "Mentorship",
      description: "Connect with industry professionals and experienced developers",
      icon: <Users className="w-6 h-6 text-purple-400" />
    }
  ];

  return (
    <div className="py-24 w-full">
      <div className="w-full text-center px-8">
        <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6">
          What We Offer
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            Programming Experiences
          </span>
        </h2>
        <p className="mt-4 text-zinc-400 max-w-3xl mx-auto">
          Dive into a world of coding excellence with our curated experiences designed to elevate your skills.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-violet-500/30 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative">
                <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-zinc-800 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 text-base leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProjectsSection() {
  const projects = [
    {
      title: "LightUI",
      description: "A Light Weight UI to use Local LLM models.",
      tech: ["Python", "Javascript"],
      progress: 85,
      link: "https://github.com/Nev-Labs/LightUI"
    },
    {
      title: "ACM Club Website",
      description: "A website for ACM Club of Oriental Institute of Science and Technology.",
      tech: ["Typescript", "Node.js", "React"],
      progress: 70,
      link: "https://github.com/Nev-Labs/ACM_OIST"
    },
    {
      title: "Debug Oist Website",
      description: "Debug Programming Club Website for Oriental Institute of Science and Technology.",
      tech: ["NextJS", "RestApi", "ReactThreeFiber"],
      progress: 60,
      link: "https://github.com/Nev-Labs/DebugOIST"
    }
  ];

  return (
    <div className="py-24 w-full bg-gradient-to-b from-black to-zinc-900/50">
      <div className="w-full text-center px-8">
        <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6">
          Our Work
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            Featured Projects
          </span>
        </h2>
        <p className="mt-4 text-zinc-400 max-w-3xl mx-auto">
          Explore some of our ongoing development projects and contribute to open-source innovation.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group"
          >
            <Card className="h-full bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
              <CardContent className="p-8 flex flex-col h-full">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-zinc-400 text-base mb-6">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-800/70 text-zinc-300 rounded-full text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-zinc-500">Progress</span>
                    <span className="text-sm text-blue-400">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                      style={{ width: `${project.progress}% `}}
                    ></div>
                  </div>
                </div>

                <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-6">
                  <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 hover:text-white px-6 py-3 rounded-md text-base font-medium">
                    View Project
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center px-8">
        <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 hover:text-white px-6 py-3 rounded-md text-base font-medium">
          View All Projects
        </Button>
      </div>
    </div>
  );
}

function EventsSection() {
  const { events, getEvents } = useEvent();
  useEffect(() => {
    getEvents();
  }, []);

  const upcomingEvents = events.filter(
    (event) => new Date(event.registration) > new Date()
  );

  if (!upcomingEvents.length) {
    return (
      <div className="py-24 w-full px-8 text-center text-zinc-400">
        No events found.
      </div>
    );
  }

  return (
    <div className="py-24 w-full px-8">
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6">
          Calendar
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            Upcoming Events
          </span>
        </h2>
        <p className="mt-4 text-zinc-400 max-w-3xl mx-auto">
          Mark your calendar for these exciting opportunities to learn and
          collaborate.
        </p>
      </div>

      <div className="mt-16 space-y-6 max-w-4xl mx-auto">
        {upcomingEvents.map((event, index) => (
          <motion.div
            key={event._id || index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-blue-500/30 transition-all duration-300 group">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    {event.publicId ? (
                      <>
                        <div className="w-full aspect-square bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center h-full p-0 group-hover:bg-zinc-800 transition-colors duration-300">
                          <img
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${event.publicId}`}
                            alt={event.title}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="w-full aspect-square bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center p-4 group-hover:bg-zinc-800 transition-colors duration-300">
                        <Calendar className="w-6 h-6 text-blue-400 mb-2" />
                        <div className="text-center">
                          <div className="text-sm text-zinc-400">
                            {new Date(event.date).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-lg font-bold text-white">
                            {new Date(event.date).getDate()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-zinc-400 mb-4 truncate">{event.description}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      {event.date && (
                        <div className="flex items-center">
                          <span className="text-zinc-500 text-sm mr-2">
                            Date:
                          </span>
                          <span className="text-zinc-300 text-sm">
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-zinc-500 text-sm mr-2">
                          Time:
                        </span>
                        <span className="text-zinc-300 text-sm uppercase">
                          {format(parse(event.time, "HH:mm", new Date()), "hh:mm a")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-zinc-500 text-sm mr-2">
                          Registration Ends:
                        </span>
                        <span className="text-zinc-300 text-sm">
                          {new Date(event.registration).toLocaleDateString("en-IN", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Modal>
                        <ModalTrigger>
                          <Button className="bg-gradient-to-r from-blue-600/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium" disabled={event.registration < new Date().toISOString()}>
                            Register
                          </Button>
                        </ModalTrigger>
                        <ModalBody className='bg-neutral-900 border-none max-h-[90vh] overflow-y-auto'>
                          <ModalContent className="p-6">
                            <RegistraionModal event={event} />
                          </ModalContent>
                        </ModalBody>
                      </Modal>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href={"/events"}
          className="border-zinc-700 bg-zinc-700 hover:bg-zinc-800/50 text-zinc-300 hover:text-white px-6 py-3 rounded-md text-base font-medium"
        >
          View All Events
        </Link>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      text: "Debug Programming Club completely transformed my coding skills. The mentorship and projects gave me real-world experience that helped me land my dream job.",
      author: "Alex Chen",
      role: "Software Engineer"
    },
    {
      text: "The collaborative environment at Debug is incredible. I've made lifelong friends while building amazing projects together.",
      author: "Priya Sharma",
      role: "Full Stack Developer"
    },
    {
      text: "As someone who was self-taught, Debug filled the gaps in my knowledge and connected me with mentors who helped guide my career.",
      author: "Marcus Johnson",
      role: "Data Scientist"
    }
  ];

  return (
    <div className="py-24 w-full bg-gradient-to-b from-zinc-900/50 to-black px-8">
      <div className="text-center">
        <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium mb-6">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            What Our Members Say
          </span>
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-violet-500/30 transition-all duration-300 overflow-hidden">
              <CardContent className="p-8">
                <p className="text-zinc-400 italic mb-6">"{testimonial.text}"</p>
                <div className="text-right">
                  <p className="text-white font-bold">{testimonial.author}</p>
                  <p className="text-sm text-zinc-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function JoinSection() {
  return (
    <div className="py-24 w-full bg-black px-8">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            Ready to Level Up?
          </span>
        </h2>
        <p className="text-lg text-zinc-400 max-w-3xl mx-auto mb-12">
          Join Debug Programming Club today and start collaborating with top developers and innovators.
        </p>
        <Button disabled className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8 py-4 rounded-md text-xl font-semibold">
          Join Now
        </Button>
      </div>
    </div>
  );
}
