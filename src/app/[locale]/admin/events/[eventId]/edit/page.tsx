"use client"
import { IEvent } from '@/src/Backend/Models/Event';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateEvent } from "../../actions";
import { useEffect, useState } from 'react';


export default function EditEventPage({ params }: { params: { eventId: string } }) {
    const [event, setEvent] = useState<IEvent | null>(null)
    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/event/${params.eventId}`)
            const e = await res.json();
            if (e.success) {
                console.log("Event: ", e.event);

            }
            setEvent(e.event);
        })()
    }, [])

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
                <div className="max-w-2xl mx-auto">
                    <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/50">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                                Edit Event
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={updateEvent} className="space-y-6">
                                <input type="hidden" name="eventId" value={event?._id?.toString()} />

                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm font-medium text-zinc-300">
                                        Event Title
                                    </label>
                                    <Input
                                        id="title"
                                        name="title"
                                        defaultValue={event?.title}
                                        className="bg-zinc-900/50 border-zinc-800 text-zinc-100"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium text-zinc-300">
                                        Description
                                    </label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        defaultValue={event?.description}
                                        className="bg-zinc-900/50 border-zinc-800 text-zinc-100 min-h-[100px]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="date" className="text-sm font-medium text-zinc-300">
                                            Date
                                        </label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            defaultValue={event?.date.split('T')[0]}
                                            className="bg-zinc-900/50 border-zinc-800 text-zinc-100"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="time" className="text-sm font-medium text-zinc-300">
                                            Time
                                        </label>
                                        <Input
                                            id="time"
                                            name="time"
                                            type="time"
                                            defaultValue={event?.time}
                                            className="bg-zinc-900/50 border-zinc-800 text-zinc-100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="venue" className="text-sm font-medium text-zinc-300">
                                        Venue
                                    </label>
                                    <Input
                                        id="venue"
                                        name="venue"
                                        defaultValue={event?.venue}
                                        className="bg-zinc-900/50 border-zinc-800 text-zinc-100"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-sm font-medium text-zinc-300">
                                        Category
                                    </label>
                                    <Input
                                        id="category"
                                        name="category"
                                        defaultValue={event?.category}
                                        className="bg-zinc-900/50 border-zinc-800 text-zinc-100"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="registrationDeadline" className="text-sm font-medium text-zinc-300">
                                        Registration Deadline (Optional)
                                    </label>
                                    <Input
                                        id="registrationDeadline"
                                        name="registrationDeadline"
                                        type="datetime-local"
                                        defaultValue={event?.registration ? new Date(event.registration).toISOString().slice(0, 16) : ''}
                                        className="bg-zinc-900/50 border-zinc-800 text-zinc-100"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-700/20"
                                    >
                                        Update Event
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 