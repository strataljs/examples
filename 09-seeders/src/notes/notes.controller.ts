import { inject } from 'stratal/di'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { type CreateNoteInput, createNoteSchema, noteListSchema, noteResponseSchema } from './notes.schemas'
import { NotesService } from './notes.service'

@Controller('/notes', { tags: ['Notes'] })
export class NotesController implements IController {
  constructor(@inject(NotesService) private readonly notesService: NotesService) {}

  @Route({
    response: noteListSchema,
    summary: 'List all notes',
  })
  async index(ctx: RouterContext) {
    return ctx.json({ data: await this.notesService.findAll() })
  }

  @Route({
    body: createNoteSchema,
    response: noteResponseSchema,
    summary: 'Create a new note',
  })
  async create(ctx: RouterContext) {
    const note = await this.notesService.create(await ctx.body<CreateNoteInput>())
    return ctx.json({ data: note }, 201)
  }
}
