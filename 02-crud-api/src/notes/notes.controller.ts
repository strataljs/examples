import { inject } from 'stratal/di'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'
import { NoteNotFoundError } from './note-not-found.error'
import {
  type CreateNoteInput,
  type UpdateNoteInput,
  createNoteSchema,
  deleteNoteSchema,
  noteListSchema,
  noteResponseSchema,
  updateNoteSchema,
} from './notes.schemas'
import { NotesService } from './notes.service'

const noteParams = object({ id: string() })

@Controller('/notes', { tags: ['Notes'] })
export class NotesController implements IController {
  constructor(@inject(NotesService) private readonly notesService: NotesService) {}

  @Route({
    response: noteListSchema,
    summary: 'List all notes',
  })
  index(ctx: RouterContext) {
    return ctx.json({ data: this.notesService.findAll() })
  }

  @Route({
    params: noteParams,
    response: noteResponseSchema,
    summary: 'Get a note by ID',
  })
  show(ctx: RouterContext) {
    const id = ctx.param('id')
    const note = this.notesService.findById(id)
    if (!note) throw new NoteNotFoundError(id)
    return ctx.json({ data: note })
  }

  @Route({
    body: createNoteSchema,
    response: noteResponseSchema,
    summary: 'Create a new note',
  })
  async create(ctx: RouterContext) {
    const note = this.notesService.create(await ctx.body<CreateNoteInput>())
    return ctx.json({ data: note }, 201)
  }

  @Route({
    params: noteParams,
    body: updateNoteSchema,
    response: noteResponseSchema,
    summary: 'Update a note',
  })
  async update(ctx: RouterContext) {
    const id = ctx.param('id')
    const note = this.notesService.update(id, await ctx.body<UpdateNoteInput>())
    if (!note) throw new NoteNotFoundError(id)
    return ctx.json({ data: note })
  }

  @Route({
    params: noteParams,
    response: deleteNoteSchema,
    summary: 'Delete a note',
  })
  destroy(ctx: RouterContext) {
    const id = ctx.param('id')
    if (!this.notesService.delete(id)) throw new NoteNotFoundError(id)
    return ctx.json({ success: true })
  }
}
