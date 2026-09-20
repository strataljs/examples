import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { number, object } from 'zod/mini'
import { StatsListener } from './stats.listener'

const statsSchema = object({
  data: object({ notify: number(), index: number(), webhook: number() }),
})

@Controller('/stats', { tags: ['Stats'] })
export class StatsController implements IController {
  @Route({ response: statsSchema, summary: 'Get event stats' })
  index(ctx: RouterContext) {
    return ctx.json({ data: StatsListener.counts })
  }
}
