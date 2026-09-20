import type { InertiaService } from '@stratal/inertia'
import { INERTIA_TOKENS, InertiaDelete, InertiaGet, InertiaPost, InertiaPut } from '@stratal/inertia'
import { abort } from 'stratal/errors'
import { inject } from 'stratal/di'
import { Controller, Get, type RouterContext } from 'stratal/router'
import { _default, coerce, int, minimum, object, optional, string } from 'zod/mini'
import { NotesService } from './notes.service'

@Controller('/notes')
export class NotesController {
  constructor(
    @inject(NotesService) private readonly notes: NotesService,
    @inject(INERTIA_TOKENS.InertiaService) private readonly inertia: InertiaService,
  ) { }

  @InertiaGet('/', {
    query: object({ page: _default(optional(coerce.number().check(int(), minimum(1))), 1) }),
  })
  async index(ctx: RouterContext) {
    const page = Number(ctx.query('page') ?? 1)

    return ctx.inertia('notes/Index', {
      notes: ctx.merge(() => this.notes.findAll(page)),
      stats: ctx.optional(() => this.notes.getStats()),
      categories: ctx.once(() => ['general', 'work', 'personal'] as const),
      timestamp: ctx.always(() => Date.now()),
      page,
    })
  }

  @InertiaGet('/:id', { params: object({ id: string() }) })
  async show(ctx: RouterContext) {
    const id = ctx.param('id')
    const note = await this.notes.findById(id)

    if (!note) {
      abort(404, 'Note not found')
    }

    this.inertia.share('currentNote', note.title)

    return ctx.inertia('notes/Show', {
      note,
      comments: ctx.defer(() => this.notes.getComments(id), 'comments'),
      metadata: ctx.merge(() => ({ viewCount: 1, lastViewed: new Date().toISOString() }), { strategy: 'deep' }),
    }, { encryptHistory: true })
  }

  @InertiaGet('/create')
  async createForm(ctx: RouterContext) {
    return ctx.inertia('notes/Create')
  }

  @InertiaGet('/:id/edit', { params: object({ id: string() }) })
  async editForm(ctx: RouterContext) {
    const id = ctx.param('id')
    const note = await this.notes.findById(id)

    if (!note) {
      abort(404, 'Note not found')
    }

    return ctx.inertia('notes/Edit', { note })
  }

  @InertiaPost('/', { body: object({ title: string(), content: string() }) })
  async create(ctx: RouterContext) {
    const { title, content } = await ctx.body<{ title: string; content: string }>()
    const note = await this.notes.create({ title, content })
    ctx.flash('success', 'Note created successfully')
    return ctx.redirect(`/notes/${note.id}`)
  }

  @InertiaPut('/:id', {
    params: object({ id: string() }),
    body: object({ title: optional(string()), content: optional(string()) }),
  })
  async update(ctx: RouterContext) {
    const id = ctx.param('id')
    const { title, content } = await ctx.body<{ title?: string; content?: string }>()
    const note = await this.notes.update(id, { title, content })

    if (!note) {
      abort(404, 'Note not found')
    }

    ctx.flash('success', 'Note updated')
    return ctx.redirect(`/notes/${id}`)
  }

  @InertiaDelete('/:id', { params: object({ id: string() }) })
  async destroy(ctx: RouterContext) {
    const id = ctx.param('id')
    const deleted = await this.notes.delete(id)

    if (!deleted) {
      ctx.flash('error', 'Failed to delete note')
      return ctx.redirect('/notes')
    }

    ctx.flash('success', 'Note deleted')
    return ctx.redirect('/notes')
  }

  @Get('/export')
  export(_ctx: RouterContext) {
    return this.inertia.location('https://example.com/export')
  }
}
