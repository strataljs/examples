import { HttpException } from 'stratal/errors'

export class UserNotFoundError extends HttpException {
  constructor(id: string) {
    super(404, `User ${id} not found`)
  }
}
