import { Button } from '@/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { format, parse } from 'date-fns'
import axios from 'axios'
import Link from 'next/link'

interface PageProps {
  params: {
    eventId: string
  }
}

async function getEvent(eventId: string) {
  try {
    const { data: event } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${eventId}`
    )
    return event
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const event = await getEvent(params.eventId)
  if (!event) {
    return (
      <div className='flex min-h-screen w-full flex-col items-center justify-center py-10 text-center text-white'>
        <h2 className='mb-4 text-2xl'>Event Not Found!</h2>
        <Button className='w-fit rounded-md bg-gradient-to-r from-blue-600/80 to-blue-600/80 px-6 py-3 text-lg font-medium text-white hover:from-blue-600 hover:to-blue-600'>
          <Link href={'/events'}>Go To Events</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='relative min-h-screen bg-black text-zinc-100'>
      {/* Background Decorations */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -left-4 top-0 h-72 w-72 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter'></div>
        <div className='absolute -right-4 top-32 h-72 w-72 rounded-full bg-blue-500 opacity-15 mix-blend-multiply blur-3xl filter'></div>
        <div className='absolute -bottom-32 left-1/2 h-72 w-72 rounded-full bg-indigo-500 opacity-15 mix-blend-multiply blur-3xl filter'></div>
      </div>

      {/* Hero Banner Section */}
      <section
        className='relative flex h-[60vh] w-full items-center justify-center'
        style={{
          backgroundImage: event.publicId
            ? `url(https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${event.publicId})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-black bg-opacity-60'></div>
        <div className='relative z-10 px-4 text-center'>
          <h1 className='text-4xl font-bold text-white md:text-6xl'>
            {event.title}
          </h1>
          <div className='mt-4 flex justify-center gap-4'>
            {new Date(event.date) > new Date() && (
              <Badge variant='default' className='bg-green-600 text-white'>
                Upcoming
              </Badge>
            )}
            {event.category && (
              <Badge variant='default' className='bg-blue-600 text-white'>
                {event.category}
              </Badge>
            )}
          </div>
          <p className='mt-4 text-lg text-zinc-300'>
            {format(new Date(event.date), 'PPP')} at{' '}
            {format(parse(event.time, 'HH:mm', new Date()), 'hh:mm a')}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className='container mx-auto px-4 py-10 sm:px-6 lg:px-8'>
        <div className='grid gap-8 md:grid-cols-2'>
          {/* Left Column: Event Description & Registration Deadline */}
          <div className='space-y-6'>
            <div className='rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6'>
              <h2 className='mb-4 text-2xl font-bold text-white'>
                About the Event
              </h2>
              <pre className='whitespace-pre-wrap break-words text-zinc-400'>
                {event.description}
              </pre>
            </div>
            <div className='rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6'>
              <h2 className='mb-2 text-xl font-bold text-white'>
                Registration Deadline
              </h2>
              <p className='text-zinc-300'>
                {format(new Date(event.registration), 'PPP')}
              </p>
            </div>
          </div>

          {/* Right Column: Date, Time, Venue & Call-to-Action */}
          <div className='space-y-6'>
            <div className='rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6'>
              <h2 className='mb-2 text-xl font-bold text-white'>
                Event Details
              </h2>
              <div className='space-y-4 text-zinc-300'>
                <div>
                  <span className='text-sm text-zinc-500'>Date: </span>
                  <span>{format(new Date(event.date), 'PPP')}</span>
                </div>
                <div>
                  <span className='text-sm text-zinc-500'>Time: </span>
                  <span>
                    {format(parse(event.time, 'HH:mm', new Date()), 'hh:mm a')}
                  </span>
                </div>
                <div>
                  <span className='text-sm text-zinc-500'>Venue: </span>
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
            <div className='flex items-center justify-center rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6'>
              <Button className='w-fit rounded-md bg-gradient-to-r from-blue-600/80 to-blue-600/80 px-6 py-3 text-lg font-medium text-white hover:from-blue-600 hover:to-blue-600'>
                <Link href={'/events'}>Go To Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
