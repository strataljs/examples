import { UseGuards } from 'stratal/guards'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { named } from 'stratal/validation'
import { array, object, string } from 'zod/mini'
import { ApiKeyGuard } from '../auth/api-key.guard'

const articleSummary = named(object({ id: string(), title: string() }), 'ArticleSummary')
const article = named(
  object({ id: string(), title: string(), content: string() }),
  'Article',
)

@Controller('/articles', { tags: ['Articles'], security: ['apiKey'] })
@UseGuards(ApiKeyGuard)
export class ArticlesController implements IController {
  @Route({
    response: object({ data: array(articleSummary) }),
    summary: 'List articles (protected)',
  })
  index(ctx: RouterContext) {
    return ctx.json({
      data: [
        { id: '1', title: 'Getting Started with Stratal' },
        { id: '2', title: 'Building APIs with Guards' },
      ],
    })
  }

  @Route({
    params: object({ id: string() }),
    response: object({ data: article }),
    summary: 'Get article by ID (protected)',
  })
  show(ctx: RouterContext) {
    return ctx.json({
      data: {
        id: ctx.param('id'),
        title: 'Getting Started with Stratal',
        content: 'This is a protected article.',
      },
    })
  }
}
