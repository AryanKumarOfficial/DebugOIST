'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRef, useState } from 'react'
import useEvent from '@/src/store/Event'
import { useToast } from '@/src/components/ui/toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from '@/src/navigation'

// Define a schema that matches your UI fields and Store requirements
const eventFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date format' }),
  time: z.string().min(1, { message: 'Time is required' }),
  venue: z.string().min(1, { message: 'Venue is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  registration: z.string().optional(),
  image: z
    .any()
    .refine(file => file instanceof File, { message: 'Image is required' })
})

type EventFormType = z.infer<typeof eventFormSchema>

export default function NewEventPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<EventFormType>({
    resolver: zodResolver(eventFormSchema)
  })

  const { addEvent } = useEvent()
  const { addToast } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
      // Manually set the value in react-hook-form
      setValue('image', file, { shouldValidate: true })
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const onSubmit = async (data: EventFormType) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('date', data.date)
      formData.append('time', data.time)
      formData.append('venue', data.venue)
      formData.append('category', data.category)
      if (data.registration) {
        formData.append('registration', data.registration)
      }
      formData.append('image', data.image)

      await addEvent(formData)

      addToast({
        title: 'Success',
        description: 'Event created successfully',
        variant: 'success'
      })
      router.push('/admin/events')
    } catch (error: any) {
      console.error('Error creating event:', error)
      addToast({
        title: 'Error',
        description: error.message || 'Failed to create event',
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
        <div className='mx-auto my-16 max-w-2xl'>
          <Card className='border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md'>
            <CardHeader>
              <CardTitle className='bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent'>
                Create New Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Event Title */}
                <div className='space-y-2'>
                  <label
                    htmlFor='title'
                    className='text-sm font-medium text-zinc-300'
                  >
                    Event Title
                  </label>
                  <Input
                    id='title'
                    {...register('title')}
                    className='border-zinc-800 bg-zinc-900/50 text-zinc-100'
                  />
                  {errors.title && (
                    <p className='text-xs text-red-500'>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <label
                    htmlFor='description'
                    className='text-sm font-medium text-zinc-300'
                  >
                    Description
                  </label>
                  <Textarea
                    id='description'
                    {...register('description')}
                    className='min-h-[100px] border-zinc-800 bg-zinc-900/50 text-zinc-100'
                  />
                  {errors.description && (
                    <p className='text-xs text-red-500'>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Image Upload with Preview */}
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-300'>
                    Image
                  </label>
                  {/* Hidden Input for RHF registration ref is handled manually */}
                  <input
                    type='file'
                    accept='image/*'
                    ref={inputRef}
                    onChange={handleImageChange}
                    className='hidden'
                  />
                  <button
                    type='button'
                    onClick={handleButtonClick}
                    className='w-full cursor-pointer rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-zinc-100 transition duration-150 hover:bg-zinc-800'
                  >
                    Choose Image
                  </button>
                  <p className='text-sm text-gray-400'>
                    Image must be a JPG or PNG file
                  </p>
                  {errors.image && (
                    <p className='text-xs text-red-500'>
                      {String(errors.image.message)}
                    </p>
                  )}

                  {previewUrl && (
                    <div className='mt-4'>
                      <p className='text-sm font-medium text-gray-300'>
                        Image Preview:
                      </p>
                      <img
                        src={previewUrl}
                        alt='Selected Preview'
                        className='mt-2 h-auto w-full rounded-md border border-zinc-800'
                      />
                    </div>
                  )}
                </div>

                {/* Date and Time */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <label
                      htmlFor='date'
                      className='text-sm font-medium text-zinc-300'
                    >
                      Date
                    </label>
                    <Input
                      id='date'
                      type='date'
                      {...register('date')}
                      className='border-zinc-800 bg-zinc-900/50 text-zinc-100'
                    />
                    {errors.date && (
                      <p className='text-xs text-red-500'>
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label
                      htmlFor='time'
                      className='text-sm font-medium text-zinc-300'
                    >
                      Time
                    </label>
                    <Input
                      id='time'
                      type='time'
                      {...register('time')}
                      className='border-zinc-800 bg-zinc-900/50 text-zinc-100'
                    />
                    {errors.time && (
                      <p className='text-xs text-red-500'>
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Venue */}
                <div className='space-y-2'>
                  <label
                    htmlFor='venue'
                    className='text-sm font-medium text-zinc-300'
                  >
                    Venue
                  </label>
                  <Input
                    id='venue'
                    {...register('venue')}
                    className='border-zinc-800 bg-zinc-900/50 text-zinc-100'
                  />
                  {errors.venue && (
                    <p className='text-xs text-red-500'>
                      {errors.venue.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className='space-y-2'>
                  <label
                    htmlFor='category'
                    className='text-sm font-medium text-zinc-300'
                  >
                    Category
                  </label>
                  <Input
                    id='category'
                    {...register('category')}
                    className='border-zinc-800 bg-zinc-900/50 text-zinc-100'
                  />
                  {errors.category && (
                    <p className='text-xs text-red-500'>
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Registration Deadline */}
                <div className='space-y-2'>
                  <label
                    htmlFor='registration'
                    className='text-sm font-medium text-zinc-300'
                  >
                    Registration Deadline
                  </label>
                  <Input
                    id='registration'
                    type='date'
                    {...register('registration')}
                    className='border-zinc-800 bg-zinc-900/50 text-zinc-100'
                  />
                  {errors.registration && (
                    <p className='text-xs text-red-500'>
                      {errors.registration.message}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex gap-4 pt-4'>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-700/20 hover:from-purple-700 hover:to-blue-700'
                  >
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1 border-zinc-800 bg-zinc-900/50 text-zinc-100'
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
  )
}
