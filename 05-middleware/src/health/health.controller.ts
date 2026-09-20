import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'

@Controller('/health', { tags: ['Health'] })
export class HealthController implements IController {
  @Route({ response: object({ status: string() }) })
  index(ctx: RouterContext) {
    return ctx.json({ status: 'ok' })
  }
}
