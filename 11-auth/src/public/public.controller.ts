import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'

@Controller('/public', { tags: ['Public'] })
export class PublicController implements IController {
  @Route({
    response: object({ message: string() }),
    summary: 'Public endpoint (no auth required)',
  })
  index(ctx: RouterContext) {
    return ctx.json({ message: 'This endpoint is accessible without authentication.' })
  }
}
