import { InertiaGet } from '@stratal/inertia'
import { inject } from 'stratal/di'
import { Controller, type RouterContext } from 'stratal/router'
import { NotesService } from './notes/notes.service'

@Controller('/')
export class HomeController {
  constructor(
    @inject(NotesService) private readonly notes: NotesService,
  ) { }

  @InertiaGet('/')
  async index(ctx: RouterContext) {
    return ctx.inertia('Home', {
      message: 'Hello from Stratal!',
      noteCount: ctx.defer(() => this.notes.count(), 'stats'),
    }, { clearHistory: true })
  }
}
