import { array, boolean, maxLength, minLength, object, optional, string } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'
import { named } from 'stratal/validation'

// `named()` is reserved for schemas referenced from inside other schemas. A
// named schema used directly as a body or response is emitted as a $ref to
// itself in stratal 0.1.0, so the wrappers below stay anonymous and inline.
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

export const updateNoteSchema = object({
  title: optional(string().check(minLength(1), maxLength(200))),
  content: optional(string().check(minLength(1))),
})

export const noteListSchema = object({ data: array(noteSchema) })
export const noteResponseSchema = object({ data: noteSchema })
export const deleteNoteSchema = object({ success: boolean() })

export type CreateNoteInput = Infer<typeof createNoteSchema>
export type UpdateNoteInput = Infer<typeof updateNoteSchema>
export type Note = Infer<typeof noteSchema>
