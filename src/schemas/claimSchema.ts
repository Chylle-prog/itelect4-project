import { z } from 'zod'

export const claimSchema = z
  .object({
    itemId: z.string().min(1, 'Choose an item to claim'),
    notes: z
      .string()
      .min(10, 'Evidence must be at least 10 characters')
      .max(500, 'Evidence must be 500 characters or fewer'),
  })
  .refine(
    (values) => values.notes.trim().split(/\s+/).length >= 3,
    {
      message: 'Evidence must contain at least three words',
      path: ['notes'],
    }
  )

export type ClaimFormValues = z.infer<typeof claimSchema>
