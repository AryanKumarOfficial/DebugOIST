import connect from '@/src/Backend/mongoose'
import IndividualRegistration from '@/src/Backend/Models/TeamRegistration'
import Event from '@/src/Backend/Models/Event'
import { ObjectId } from 'mongodb'
import { Button } from '@/components/ui/button'
import { updateRegistrationStatus } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { format } from 'date-fns'

interface PageProps {
  params: {
    eventId: string
  }
}

async function getRegistrations(eventId: string) {
  const registrations = await IndividualRegistration.find({
    eventId: new ObjectId(eventId)
  }).sort({ createdAt: -1 })
  return registrations
}

async function getEvent(eventId: string) {
  const event = await Event.findById(eventId)
  return event
}

export default async function RegistrationsPage({ params }: PageProps) {
  await connect()
  const [registrations, event] = await Promise.all([
    getRegistrations(params.eventId),
    getEvent(params.eventId)
  ])

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
          <div className='my-16 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-lg'>
            <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
              <div>
                <h1 className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl'>
                  {event?.title} Registrations
                </h1>
                <p className='mt-2 text-zinc-400'>
                  Manage registrations and approve participants
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-3'>
                <Badge
                  variant='outline'
                  className='border-zinc-700 bg-zinc-900/70 py-1.5 text-sm'
                >
                  Total Registrations: {registrations.length}
                </Badge>
                <Badge
                  variant='outline'
                  className='border-zinc-700 bg-zinc-900/70 py-1.5 text-sm'
                >
                  Pending:{' '}
                  {registrations.filter(r => r.status === 'pending').length}
                </Badge>
                <Badge
                  variant='outline'
                  className='border-zinc-700 bg-zinc-900/70 py-1.5 text-sm'
                >
                  Approved:{' '}
                  {registrations.filter(r => r.status === 'approved').length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {registrations.length === 0 && (
            <div className='rounded-xl border border-zinc-800/50 bg-zinc-900/30 py-20 text-center backdrop-blur-sm'>
              <h3 className='text-xl font-medium text-zinc-300'>
                No registrations yet
              </h3>
              <p className='mt-2 text-zinc-500'>
                When individuals register for this event, they will appear here.
              </p>
            </div>
          )}

          {/* Registrations list */}
          {registrations.length > 0 && (
            <ScrollArea className='h-[calc(100vh-250px)]'>
              <div className='grid gap-6'>
                {registrations.map(registration => (
                  <Card
                    key={registration._id.toString()}
                    className='group overflow-hidden border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50'
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>

                    <CardHeader className='relative z-10 flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent'>
                        {registration.name}
                      </CardTitle>
                      <Badge
                        variant={
                          registration.status === 'approved'
                            ? 'success'
                            : registration.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className='px-3 py-1 capitalize'
                      >
                        {registration.status}
                      </Badge>
                    </CardHeader>

                    <CardContent className='relative z-10'>
                      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {/* Registrant Info */}
                        <div className='rounded-lg border border-zinc-800/50 bg-black/20 p-4'>
                          <h3 className='mb-3 flex items-center text-lg font-semibold text-purple-400'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='mr-2 h-5 w-5'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                              <circle cx='12' cy='7' r='4'></circle>
                            </svg>
                            Registrant Info
                          </h3>
                          <div className='space-y-2 text-zinc-300'>
                            <p>
                              <span className='text-zinc-500'>Name:</span>{' '}
                              {registration.name}
                            </p>
                            <p>
                              <span className='text-zinc-500'>Email:</span>{' '}
                              {registration.email}
                            </p>
                            <p>
                              <span className='text-zinc-500'>Phone:</span>{' '}
                              {registration.phone}
                            </p>
                            <p>
                              <span className='text-zinc-500'>Roll:</span>{' '}
                              {registration.roll}
                            </p>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className='rounded-lg border border-zinc-800/50 bg-black/20 p-4'>
                          <h3 className='mb-3 flex items-center text-lg font-semibold text-purple-400'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='mr-2 h-5 w-5'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <path d='M21 7v12H3'></path>
                              <path d='M3 3h18'></path>
                              <path d='M3 7h18'></path>
                              <path d='M3 11h18'></path>
                            </svg>
                            Event Details
                          </h3>
                          <div className='space-y-2 text-zinc-300'>
                            <p>
                              <span className='text-zinc-500'>Event:</span>{' '}
                              {event?.title}
                            </p>
                            <p>
                              <span className='text-zinc-500'>Date:</span>{' '}
                              {event?.date
                                ? format(new Date(event.date), 'PPP')
                                : 'TBA'}
                            </p>
                            <p>
                              <span className='text-zinc-500'>Time:</span>{' '}
                              {event?.time ? event.time : 'TBA'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Registration Metadata */}
                      <div className='mt-4 rounded-lg border border-zinc-800/50 bg-black/20 p-4'>
                        <h3 className='mb-3 flex items-center text-lg font-semibold text-purple-400'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='mr-2 h-5 w-5'
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
                          Registration Details
                        </h3>
                        <div className='space-y-2 text-zinc-300'>
                          <p>
                            <span className='text-zinc-500'>
                              Registered On:
                            </span>{' '}
                            {format(new Date(registration.createdAt), 'PPP')}
                          </p>
                          <p>
                            <span className='text-zinc-500'>Status:</span>
                            <span
                              className={`ml-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                registration.status === 'approved'
                                  ? 'bg-green-500/20 text-green-400'
                                  : registration.status === 'rejected'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {registration.status.charAt(0).toUpperCase() +
                                registration.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='mt-4 rounded-lg border border-zinc-800/50 bg-black/20 p-4'>
                        <h3 className='mb-3 flex items-center text-lg font-semibold text-purple-400'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='mr-2 h-5 w-5'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path d='M12 20h9'></path>
                            <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'></path>
                          </svg>
                          Actions
                        </h3>
                        <form
                          action={updateRegistrationStatus}
                          className='flex gap-3'
                        >
                          <input
                            type='hidden'
                            name='registrationId'
                            value={registration._id.toString()}
                          />
                          <input
                            type='hidden'
                            name='eventId'
                            value={params.eventId}
                          />
                          <Button
                            type='submit'
                            name='status'
                            value='approved'
                            className='flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-700/20 hover:from-green-700 hover:to-emerald-700'
                            disabled={registration.status === 'approved'}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='mr-1 h-5 w-5'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <polyline points='20 6 9 17 4 12'></polyline>
                            </svg>
                            Approve
                          </Button>
                          <Button
                            type='submit'
                            name='status'
                            value='rejected'
                            className='flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-700/20 hover:from-red-700 hover:to-rose-700'
                            disabled={registration.status === 'rejected'}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='mr-1 h-5 w-5'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <line x1='18' y1='6' x2='6' y2='18'></line>
                              <line x1='6' y1='6' x2='18' y2='18'></line>
                            </svg>
                            Reject
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}
