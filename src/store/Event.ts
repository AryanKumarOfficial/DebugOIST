import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import axios from 'axios'

export type EventProps = {
  _id?: string
  title: string
  description: string
  date: string
  time: string
  registration: string
  publicId: string
  location?: string
}

interface EventStoreProps {
  events: EventProps[]
  loading: boolean
  error: string | null
  hydrated: boolean
  setHydrated: () => void
  addEvent: (event: FormData) => Promise<void>
  updateEvent: (eventId: string, newEvent: FormData) => Promise<void>
  getEvents: () => Promise<void>
  deleteEvent: (publicId: string) => Promise<void>
  getEventById: (id: string) => EventProps | undefined
}

const useEvent = create<EventStoreProps>()(
  devtools(
    persist(
      immer((set, get) => {
        const setLoading = (loading: boolean) => set({ loading })

        return {
          events: [],
          loading: false,
          error: null,
          hydrated: false,
          setHydrated: () => set({ hydrated: true }),

          addEvent: async (event: FormData) => {
            setLoading(true)
            try {
              const { data } = await axios.post('/api/events', event, {
                headers: { 'Content-Type': 'multipart/form-data' }
              })
              // Push new event into state
              set(state => {
                state.events.push(data)
                state.error = null
              })
              get().getEvents()
            } catch (error: any) {
              set({ error: error.message })
            } finally {
              setLoading(false)
            }
          },

          updateEvent: async (eventId: string, newEvent: FormData) => {
            setLoading(true)
            try {
              console.log('Updating event with _id:', eventId);
              
              // Using MongoDB _id for update
              const response = await fetch(`/api/events/${eventId}`, {
                method: 'PATCH',
                body: newEvent,
                // Let browser handle Content-Type for FormData
                headers: {
                  'Cache-Control': 'no-cache'
                }
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                
                let errorMessage = `Failed to update event (${response.status})`;
                try {
                  const errorData = JSON.parse(errorText);
                  if (errorData.error) {
                    errorMessage = errorData.error;
                  }
                } catch (e) {
                  // If JSON parsing fails, use the error text directly
                  if (errorText) errorMessage = errorText;
                }
                
                throw new Error(errorMessage);
              }
              
              const data = await response.json();
              
              // Update the event in state using _id
              set(state => {
                const index = state.events.findIndex(
                  event => event._id === eventId
                )
                if (index !== -1) {
                  state.events[index] = data
                }
                state.error = null
              })
              // Refresh the events list
              get().getEvents()
            } catch (error: any) {
              console.error('Event update failed:', error);
              set({ error: error.message })
            } finally {
              setLoading(false)
            }
          },

          getEvents: async () => {
            setLoading(true)
            try {
              const { data } = await axios.get('/api/events')
              set(state => {
                state.events = data.events
                state.error = null
              })
            } catch (error: any) {
              set({ error: error.message })
            } finally {
              setLoading(false)
            }
          },

          deleteEvent: async (publicId: string) => {
            setLoading(true)
            try {
              console.log('Deleting event with publicId:', publicId)
              await axios.delete('/api/events', {
                headers: { 'Content-Type': 'application/json' },
                data: { eventId: publicId }
              })
              console.log('Deleted event with publicId:', publicId)
              set(state => {
                state.events = state.events.filter(
                  event => event.publicId !== publicId
                )
                state.error = null
              })
              get().getEvents()
            } catch (error: any) {
              set({ error: error.message })
            } finally {
              setLoading(false)
            }
          },

          getEventById: (id: string) => {
            return get().events.find(event => event._id === id)
          }
        }
      }),
      {
        name: 'event-storage',
        version: 1,
        onRehydrateStorage: () => state => {
          state?.setHydrated()
        },
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
)

export default useEvent
