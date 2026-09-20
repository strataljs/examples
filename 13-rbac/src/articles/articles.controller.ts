import { InjectDB, type DatabaseService } from '@stratal/framework/database'
import { AuthGuard } from '@stratal/framework/guards'
import { HttpException } from 'stratal/errors'
import { UseGuards } from 'stratal/guards'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'
import {
  type CreateArticleInput,
  articleListSchema,
  articleResponseSchema,
  createArticleSchema,
  deleteArticleSchema,
} from './articles.schemas'

const articleParams = object({ id: string() })

@Controller('/articles', { tags: ['Articles'], security: ['sessionCookie'] })
export class ArticlesController implements IController {
  constructor(@InjectDB('main') private readonly db: DatabaseService<'main'>) {}

  @UseGuards(AuthGuard({ permissions: 'articles:read' }))
  @Route({ response: articleListSchema, summary: 'List articles (articles:read)' })
  async index(ctx: RouterContext) {
    return ctx.json({ data: await this.db.article.findMany({ orderBy: { createdAt: 'desc' } }) })
  }

  @UseGuards(AuthGuard({ permissions: 'articles:create' }))
  @Route({
    body: createArticleSchema,
    response: articleResponseSchema,
    summary: 'Create an article (articles:create)',
  })
  async create(ctx: RouterContext) {
    const article = await this.db.article.create({
      data: { ...(await ctx.body<CreateArticleInput>()), authorId: ctx.user().id },
    })
    return ctx.json({ data: article }, 201)
  }

  @UseGuards(AuthGuard({ permissions: 'articles:delete' }))
  @Route({ params: articleParams, response: deleteArticleSchema, summary: 'Delete an article (articles:delete)' })
  async destroy(ctx: RouterContext) {
    const id = ctx.param('id')
    if (!(await this.db.article.findUnique({ where: { id } }))) {
      throw new HttpException(404, `Article ${id} not found`)
    }

    await this.db.article.delete({ where: { id } })
    return ctx.json({ success: true })
  }
}
