import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'

@Controller('/hello', { tags: ['Hello'] })
export class HelloController implements IController {
  @Route({
    response: object({ message: string() }),
    summary: 'Say hello',
  })
  index(ctx: RouterContext) {
    return ctx.json({ message: 'Hello World' })
  }
}
