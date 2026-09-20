import { HttpException } from 'stratal/errors'

export class NoteNotFoundError extends HttpException {
  constructor(id: string) {
    super(404, `Note ${id} not found`)
  }
}
