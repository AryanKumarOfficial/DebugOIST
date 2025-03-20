'use client'
import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import CustomTextArea from '@/src/components/ui/textarea'
import { FileUpload } from '@/src/components/ui/file-upload'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDataType, formSchema } from '@/src/Schema/Event'
import useEvent, { EventProps } from '@/src/store/Event'
import { useRouter } from 'next/navigation'
import { useModal } from '@/src/components/ui/animated-modal'
import { useToast } from '@/src/components/ui/toast'

interface EventFormProps {
  isEditing?: boolean;
  eventData?: EventProps | null;
  onSuccess?: () => void;
}

export default function EventForm({ isEditing = false, eventData = null, onSuccess }: EventFormProps) {
  const router = useRouter()
  const [preview, setPreview] = React.useState<string | null>(null);

  // Create a modified schema for editing where thumbnail is optional
  const formResolver = isEditing
    ? zodResolver(formSchema.omit({ thumbnail: true }))  // Remove thumbnail validation entirely when editing
    : zodResolver(formSchema);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormDataType>({
    resolver: formResolver,
    defaultValues: {
      name: '',
      description: '',
      thumbnail: undefined,
      date: '',
      time: '',
      registration: ''
    }
  })

  const { addEvent, updateEvent, loading } = useEvent()
  const { setOpen } = useModal()
  const { addToast } = useToast()

  // Pre-fill form with event data when editing
  useEffect(() => {
    if (isEditing && eventData) {
      setValue('name', eventData.title || '');
      setValue('description', eventData.description || '');

      // Convert timestamps to date strings if they exist
      if (eventData.date) {
        const dateObj = new Date(eventData.date);
        setValue('date', dateObj.toISOString().split('T')[0]);
      }

      if (eventData.time) {
        setValue('time', `${eventData.time}`);
      }

      if (eventData.registration) {
        const regObj = new Date(eventData.registration);
        setValue('registration', regObj.toISOString().split('T')[0]);
      }

      // We no longer need this since we've omitted thumbnail from the schema when editing
    }
  }, [isEditing, eventData, setValue]);

  const handleFileUpload = (files: File[]) => {
    setValue('thumbnail', files[0])
    console.log('Uploaded files:', files)
  }

  const onSubmit: SubmitHandler<FormDataType> = async data => {
    try {
      const formData = new FormData()
      formData.append('eventName', data.name)
      formData.append('description', data.description)

      // Only append thumbnail if it exists (it might not be updated when editing)
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail as File)
      }

      formData.append('eventDate', data.date)
      formData.append('eventTime', data.time)
      formData.append('registrationDate', data.registration)

      if (isEditing && eventData && eventData._id) {
        // Use the Zustand store's updateEvent function
        await updateEvent(eventData._id, formData);

        addToast({
          title: 'Event updated successfully',
          description: `"${data.name}" has been updated.`,
          variant: 'success',
          duration: 5000
        });

        // Clear any preview
        setPreview(null);
      } else {
        await addEvent(formData)
        addToast({
          title: 'Event created successfully',
          description: `"${data.name}" has been added to events.`,
          variant: 'success',
          duration: 5000
        })
      }

      if (onSuccess) {
        onSuccess();
      } else if (setOpen) {
        setOpen(false);
      }

      router.refresh()
    } catch (e: any) {
      console.log(e, isEditing ? 'Event update failed' : 'Event creation failed')
      addToast({
        title: isEditing ? 'Failed to update event' : 'Failed to create event',
        description: e.message || 'An unexpected error occurred',
        variant: 'error',
        duration: 5000
      })
    } finally {
      reset(); // Reset the form data

      // Only close modal after reset so we don't see blank data in the form momentarily
      if (onSuccess) {
        onSuccess();
      } else if (setOpen) {
        setOpen(false);
      }
    }
  }

  return (
    <div className='shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 dark:bg-black md:rounded-2xl md:p-8'>
      <form className='my-4 space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer>
          <Label htmlFor='name'>Event Name</Label>
          <Input
            id='name'
            placeholder='Name of the Event'
            type='text'
            {...register('name')}
          />
          {errors.name && (
            <span className='text-red-500'>{errors.name.message}</span>
          )}
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor='description'>Event Description</Label>
          <CustomTextArea
            id='description'
            nameField={'description'}
            placeholder='Description for the event'
            register={register}
          />
          {errors.description && (
            <span className='text-red-500'>{errors.description.message}</span>
          )}
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor='file-upload'>
            {isEditing ? 'Event Thumbnail (optional)' : 'Event Thumbnail'}
          </Label>

          {isEditing ? (
            <>
              <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 cursor-pointer">
                {/* Preview image - either existing or newly selected */}
                <img
                  src={preview || (eventData?.publicId
                    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${eventData.publicId}`
                    : "https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/placeholder-event")}
                  alt="Event thumbnail"
                  className="object-cover object-center w-full h-full transition-opacity hover:opacity-90"
                  onClick={() => document.getElementById('file-input')?.click()}
                />

                {/* Overlay with instructions */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <p className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-black bg-opacity-50">
                    Click to change image (optional)
                  </p>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload([e.target.files[0]]);
                    // Show preview of selected file
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setPreview(event.target.result as string);
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                Current thumbnail will be kept unless you choose a new one.
              </p>
            </>
          ) : (
            <div className='mx-auto min-h-10 w-full max-w-4xl rounded-lg border border-dashed border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black'>
              <FileUpload onChange={handleFileUpload} />
            </div>
          )}

          {errors.thumbnail && (
            <span className='text-red-500'>{errors.thumbnail.message}</span>
          )}
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor='date'>Event Date</Label>
          <Input
            id='date'
            placeholder='Event Date'
            type='date'
            {...register('date')}
          />
          {errors.date && (
            <span className='text-red-500'>{errors.date.message}</span>
          )}
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor='time'>Event Time</Label>
          <Input
            id='time'
            placeholder='Event Time'
            type='time'
            {...register('time')}
          />
          {errors.time && (
            <span className='text-red-500'>{errors.time.message}</span>
          )}
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor='registration'>Registration Ends</Label>
          <Input
            id='registration'
            placeholder='Event registration Date'
            type='date'
            {...register('registration')}
          />
          {errors.registration && (
            <span className='text-red-500'>{errors.registration.message}</span>
          )}
        </LabelInputContainer>
        <div className='flex justify-end pt-4'>
          <button
            type={'submit'}
            className='inline-flex h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-200 transition-colors hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,95%,#000103)] hover:bg-[length:150%_100%] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
            disabled={loading}
          >
            {loading
              ? (isEditing ? 'Updating Event...' : 'Creating Event...')
              : (isEditing ? 'Update Event' : 'Create Event')
            }
          </button>
        </div>
      </form>
    </div>
  )
}

const LabelInputContainer = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  )
}
