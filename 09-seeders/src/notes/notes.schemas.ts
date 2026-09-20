import { array, maxLength, minLength, object, string } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'
import { named } from 'stratal/validation'

export const noteSchema = named(
  object({
    id: string(),
    title: string(),
    content: string(),
    createdAt: string(),
    updatedAt: string(),
  }),
  'Note',
)

export const createNoteSchema = object({
  title: string().check(minLength(1), maxLength(200)),
  content: string().check(minLength(1)),
})

export const noteListSchema = object({ data: array(noteSchema) })
export const noteResponseSchema = object({ data: noteSchema })

export type CreateNoteInput = Infer<typeof createNoteSchema>
export type Note = Infer<typeof noteSchema>
