import { z } from 'zod'

export const formSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }),
  description: z.string().trim().min(1, { message: 'Description is required' }),
  image: z
    .instanceof(File, { message: 'Image must be a file' })
    .nullable()
    .refine(file => file != null, { message: 'Image is required' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date format'
  }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format'
  }),
  venue: z.string().trim().min(1, { message: 'Venue is required' }),
  category: z.string().trim().min(1, { message: 'Category is required' }),
  registration: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date format'
  })
})

export type FormDataType = z.infer<typeof formSchema>
