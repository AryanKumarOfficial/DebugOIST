"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalBody, ModalTrigger } from '@/src/components/ui/animated-modal';
import RegistrationModal from '../components/Registration';
import useEvent from '@/src/store/Event';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { format, parse } from "date-fns";
import Link from "next/link";

export default function EventsPage() {
    const { getEvents, events } = useEvent();

    useEffect(() => {
        (async () => {
            await getEvents();
        })();
    }, []);

    return (
        <div className="relative min-h-screen bg-black text-zinc-100">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-32 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
                <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
            </div>

            {/* Content container */}
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="space-y-8">
                    {/* Header section */}
                    <div className="bg-zinc-900/50 backdrop-blur-lg border border-zinc-800/50 rounded-xl p-6 shadow-lg my-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                                    Our Events
                                </h1>
                                <p className="text-zinc-400 mt-2">Discover and participate in exciting events</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="outline" className="text-sm py-1.5 bg-zinc-900/70 border-zinc-700">
                                    Total Events: {events.length}
                                </Badge>
                                <Badge variant="outline" className="text-sm py-1.5 bg-zinc-900/70 border-zinc-700">
                                    Upcoming: {events.filter(e => new Date(e.date) > new Date()).length}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Empty state */}
                    {events.length === 0 && (
                        <div className="text-center py-20 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl">
                            <h3 className="text-xl font-medium text-zinc-300">No events available</h3>
                            <p className="text-zinc-500 mt-2">Check back later for upcoming events.</p>
                        </div>
                    )}

                    {/* Events grid */}
                    {events.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event, index) => (
                                <motion.div
                                    key={event._id || index}
                                    initial={{ opacity: 0, y: -20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-blue-500/30 transition-all duration-300 group hover:shadow-xl">
                                        <CardContent className="p-4 sm:p-6 md:p-8">
                                            <div className="flex flex-col gap-4">
                                                {/* Image Section with left/right banner badges */}
                                                <div className="relative w-full">
                                                    {event.publicId ? (
                                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden group-hover:brightness-90 transition-all duration-300">
                                                            <img
                                                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${event.publicId}`}
                                                                alt={event.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {/* Left Banner: Upcoming */}
                                                            {new Date(event.date) > new Date() && (
                                                                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                                                                    Upcoming
                                                                </div>
                                                            )}
                                                            {/* Right Banner: Category */}
                                                            {event.category && (
                                                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                                                                    {event.category}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative w-full aspect-square rounded-xl bg-zinc-800/50 flex items-center justify-center p-4 group-hover:brightness-90 transition-all duration-300">
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

                                                {/* Details Section */}
                                                <div className="w-full">
                                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                                    <p className="text-zinc-400 mb-4 line-clamp-4">{event.description}</p>

                                                    {/* Banner Row for details */}
                                                    <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-800/70 p-4 rounded-xl">
                                                        <div className="flex flex-col space-y-1">
                                                            <span className="text-zinc-500 text-sm">Date & Time</span>
                                                            <span className="text-zinc-300 text-sm">
                                                                {new Date(event.date).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}{" "}
                                                                @{" "}
                                                                {format(parse(event.time, "HH:mm", new Date()), "hh:mm a")}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col space-y-1 mt-2 sm:mt-0">
                                                            <span className="text-zinc-500 text-sm">Registration Ends</span>
                                                            <span className="text-zinc-300 text-sm">
                                                                {new Date(event.registration).toLocaleDateString("en-IN", {
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex flex-col w-full justify-between sm:flex-row gap-4">
                                                        {!(new Date().toISOString() > event.registration) ? (
                                                            <Modal>
                                                                <ModalTrigger>
                                                                    <Button className="w-full bg-gradient-to-r from-blue-600/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-600 text-white px-4 rounded-md text-sm font-medium">
                                                                        Register
                                                                    </Button>
                                                                </ModalTrigger>
                                                                <ModalBody className="bg-neutral-900 border-none max-h-[90vh] overflow-y-auto">
                                                                    <ModalContent className="p-6">
                                                                        <RegistrationModal event={event} />
                                                                    </ModalContent>
                                                                </ModalBody>
                                                            </Modal>
                                                        ) : (
                                                            <Button className="w-full bg-gradient-to-r from-blue-600/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-600 text-white px-4 rounded-md text-sm font-medium" disabled>
                                                                Registeration closed
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant={"ghost"}
                                                            className="w-fit mt-1 bg-gradient-to-r from-black via-zinc-600/80 to-black hover:from-zinc-600/80 hover:to-zinc-600/80 hover:via-black text-white px-4 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                                                            <Link href={`/events/${event?._id}`}>
                                                                View Details
                                                            </Link>
                                                        </Button>

                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}