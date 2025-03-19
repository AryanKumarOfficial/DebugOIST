'use client'
import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
  useModal
} from '@/src/components/ui/animated-modal'
import EventForm from '@/src/components/EventForm'
import { EventProps } from '@/src/store/Event'
import { useToast } from '@/src/components/ui/toast'

type EditEventModalProps = {
  eventId: string
  children?: React.ReactNode
  triggerContent?: React.ReactNode
  triggerClassName?: string
}

const EditEventContent = ({ eventId }: { eventId: string }) => {
  const [event, setEvent] = useState<EventProps | null>(null)
  const [loading, setLoading] = useState(true)
  const { setOpen } = useModal()
  const { addToast } = useToast()

  // Fetch event data when component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        // Using the events API to fetch the specific event
        const response = await fetch(`/api/events/${eventId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }
        const data = await response.json()
        // API returns the event directly, not wrapped in an object
        setEvent(data)
      } catch (error) {
        console.error('Error fetching event:', error)
        addToast({
          title: 'Error',
          description: 'Failed to load event data. Please try again.',
          variant: 'error',
          duration: 5000
        })
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId, addToast])

  return (
    <>
      <h4 className='mb-8 text-center text-lg font-bold text-neutral-600 dark:text-neutral-100 md:text-2xl'>
        Edit Event
      </h4>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-purple-500 mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading event data...</p>
        </div>
      ) : (
        <EventForm isEditing eventData={event} onSuccess={() => setOpen(false)} />
      )}
    </>
  )
}

const EditEventModal: React.FC<EditEventModalProps> = ({ 
  eventId,
  children,
  triggerContent,
  triggerClassName = 'rounded-full bg-green-500 hover:bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors'
}) => {
  return (
    <Modal>
      <ModalTrigger className={triggerClassName}>
        {triggerContent || children || 'Edit Event'}
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          <EditEventContent eventId={eventId} />
        </ModalContent>
      </ModalBody>
    </Modal>
  )
}

export default EditEventModal 