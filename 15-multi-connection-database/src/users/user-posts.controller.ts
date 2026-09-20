import { InjectDB, type DatabaseService } from '@stratal/framework/database'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'
import { type CreatePostInput, createPostSchema, postListSchema, postResponseSchema } from './users.schemas'

const userParams = object({ userId: string() })

@Controller('/users/:userId/posts', { tags: ['Posts'] })
export class UserPostsController implements IController {
  constructor(@InjectDB('main') private readonly db: DatabaseService<'main'>) {}

  @Route({ params: userParams, response: postListSchema, summary: 'List posts for a user' })
  async index(ctx: RouterContext) {
    const posts = await this.db.post.findMany({
      where: { userId: ctx.param('userId') },
      orderBy: { createdAt: 'desc' },
    })
    return ctx.json({ data: posts })
  }

  @Route({
    params: userParams,
    body: createPostSchema,
    response: postResponseSchema,
    summary: 'Create a post for a user',
  })
  async create(ctx: RouterContext) {
    const post = await this.db.post.create({
      data: { ...(await ctx.body<CreatePostInput>()), userId: ctx.param('userId') },
    })
    return ctx.json({ data: post }, 201)
  }
}
