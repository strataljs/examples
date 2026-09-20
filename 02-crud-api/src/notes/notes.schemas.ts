import { array, boolean, maxLength, minLength, object, optional, string } from 'zod/mini'
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

export const createNoteSchema = named(object({
  title: string().check(minLength(1), maxLength(200)),
  content: string().check(minLength(1)),
}), 'CreateNote')

export const updateNoteSchema = named(object({
  title: optional(string().check(minLength(1), maxLength(200))),
  content: optional(string().check(minLength(1))),
}), 'UpdateNote')

export const noteListSchema = named(object({ data: array(noteSchema) }), 'NoteList')
export const noteResponseSchema = named(object({ data: noteSchema }), 'NoteResponse')
export const deleteNoteSchema = named(object({ success: boolean() }), 'DeleteNote')

export type CreateNoteInput = Infer<typeof createNoteSchema>
export type UpdateNoteInput = Infer<typeof updateNoteSchema>
export type Note = Infer<typeof noteSchema>
