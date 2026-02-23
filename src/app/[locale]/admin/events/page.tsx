'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import useEvent, { EventProps } from '@/src/store/Event'
import { useToast } from '@/src/components/ui/toast'

export default function AdminEventsPage() {
  const { addToast } = useToast()
  const { events, deleteEvent, getEvents } = useEvent()

  useEffect(() => {
    getEvents()
  }, [])

  console.log('Events: ', events)
  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return 'No date set'
    const dateObj = new Date(dateString)
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    return format(dateObj, 'PPP')
  }

  async function handleDelete(eventId: string) {
    try {
      await deleteEvent(eventId)
      addToast({
        title: 'Deleted successfully',
        description: `Event with ID: ${eventId} has beed Deleted.`,
        variant: 'success'
      })
    } catch (e: any) {
      console.log('Error deleting event')
      addToast({
        title: 'Failed to delete',
        description: `Failed to delete Event with ID: ${eventId}\nTry Again.`,
        variant: 'error'
      })
    }
  }

  return (
    <div className='relative min-h-screen bg-black text-zinc-100'>
      {/* Background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -left-4 top-0 h-72 w-72 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter'></div>
        <div className='absolute -right-4 top-32 h-72 w-72 rounded-full bg-blue-500 opacity-15 mix-blend-multiply blur-3xl filter'></div>
        <div className='absolute -bottom-32 left-1/2 h-72 w-72 rounded-full bg-indigo-500 opacity-15 mix-blend-multiply blur-3xl filter'></div>
      </div>

      {/* Content container */}
      <div className='container relative z-10 mx-auto px-4 py-10 sm:px-6 lg:px-8'>
        <div className='space-y-8'>
          {/* Header section */}
          <div className='my-10 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-lg'>
            <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
              <div>
                <h1 className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl'>
                  Manage Events
                </h1>
                <p className='mt-2 text-zinc-400'>
                  Create and manage all events
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex flex-wrap items-center gap-3'>
                  <Badge
                    variant='outline'
                    className='border-zinc-700 bg-zinc-900/70 py-1.5 text-sm'
                  >
                    Total Events: {events.length}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='border-zinc-700 bg-zinc-900/70 py-1.5 text-sm'
                  >
                    Upcoming:{' '}
                    {events.filter(e => new Date(e.date) > new Date()).length}
                  </Badge>
                </div>
                <Link href='/admin/events/new'>
                  <Button className='bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-700/20 hover:from-purple-700 hover:to-blue-700'>
                    <Plus className='mr-2 h-4 w-4' />
                    New Event
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {events.length === 0 && (
            <div className='rounded-xl border border-zinc-800/50 bg-zinc-900/30 py-20 text-center backdrop-blur-sm'>
              <h3 className='text-xl font-medium text-zinc-300'>
                No events available
              </h3>
              <p className='mt-2 text-zinc-500'>
                Create your first event to get started.
              </p>
              <Link href='/admin/events/new'>
                <Button className='mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-700/20 hover:from-purple-700 hover:to-blue-700'>
                  <Plus className='mr-2 h-4 w-4' />
                  Create Event
                </Button>
              </Link>
            </div>
          )}

          {/* Events grid */}
          {events.length > 0 && (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {events.map((event: EventProps) => {
                const isUpcoming = new Date(event.date) > new Date()
                return (
                  <Card
                    key={event?._id?.toString()}
                    className='group overflow-hidden border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50'
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>

                    {/* Display event image if available */}
                    {event?.publicId && (
                      <img
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${event?.publicId}.jpg`}
                        alt={event.title}
                        className='h-48 w-full object-cover'
                      />
                    )}

                    <CardHeader className='relative z-10'>
                      <div className='mb-2 flex items-center justify-between'>
                        <Badge
                          variant={isUpcoming ? 'success' : 'secondary'}
                          className='px-3 py-1 capitalize'
                        >
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </Badge>
                        <div className='flex items-center gap-2'>
                          <Link href={`/admin/events/${event._id}/edit`}>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-zinc-400 hover:text-purple-400'
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-zinc-400 hover:text-red-400'
                            type='button'
                            onClick={() =>
                              handleDelete(event?._id?.toString() || '')
                            }
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent'>
                        {event.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className='relative z-10'>
                      <div className='space-y-4'>
                        <div className='space-y-2 text-zinc-300'>
                          <p className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='mr-2 h-4 w-4 text-purple-400'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <rect
                                x='3'
                                y='4'
                                width='18'
                                height='18'
                                rx='2'
                                ry='2'
                              ></rect>
                              <line x1='16' y1='2' x2='16' y2='6'></line>
                              <line x1='8' y1='2' x2='8' y2='6'></line>
                              <line x1='3' y1='10' x2='21' y2='10'></line>
                            </svg>
                            {safeFormatDate(event.date)}
                          </p>
                          <p className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='mr-2 h-4 w-4 text-purple-400'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <circle cx='12' cy='12' r='10'></circle>
                              <polyline points='12 6 12 12 16 14'></polyline>
                            </svg>
                            {event.time}
                          </p>
                          <p className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='mr-2 h-4 w-4 text-purple-400'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
                              <circle cx='12' cy='10' r='3'></circle>
                            </svg>
                            {event?.venue}
                          </p>
                        </div>

                        <div className='prose prose-invert max-w-none'>
                          <p className='line-clamp-3 text-zinc-400'>
                            {event.description}
                          </p>
                        </div>

                        <div className='flex items-center justify-between border-t border-zinc-800 pt-4'>
                          <Link
                            href={`/admin/events/${event._id}/registrations`}
                          >
                            <Button
                              variant='default'
                              className='bg-gradient-to-r from-purple-600 to-blue-600 text-sm text-white shadow-lg shadow-purple-700/20 hover:from-purple-700 hover:to-blue-700'
                            >
                              View Registrations{' '}
                              {(event as any).participants
                                ? `(${(event as any).participants})`
                                : ``}
                            </Button>
                          </Link>
                          <Link href={`/admin/events/${event._id}/edit`}>
                            <Button className='bg-gradient-to-r from-purple-600 to-blue-600 text-sm text-white shadow-lg shadow-purple-700/20 hover:from-purple-700 hover:to-blue-700'>
                              Edit Event
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
