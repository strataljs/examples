import { HttpException } from 'stratal/errors'

export class TaskNotFoundError extends HttpException {
  constructor(id: string) {
    super(404, `Task ${id} not found`)
  }
}
