import { InjectDB, type DatabaseService } from '@stratal/framework/database'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'
import { UserNotFoundError } from './user-not-found.error'
import {
  type CreateUserInput,
  type UpdateUserInput,
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
  userListSchema,
  userResponseSchema,
} from './users.schemas'

const userParams = object({ id: string() })

@Controller('/users', { tags: ['Users'] })
export class UsersController implements IController {
  constructor(@InjectDB('main') private readonly db: DatabaseService<'main'>) {}

  @Route({ response: userListSchema, summary: 'List all users' })
  async index(ctx: RouterContext) {
    return ctx.json({ data: await this.db.user.findMany({ orderBy: { createdAt: 'desc' } }) })
  }

  @Route({ params: userParams, response: userResponseSchema, summary: 'Get a user by ID' })
  async show(ctx: RouterContext) {
    const id = ctx.param('id')
    const user = await this.db.user.findUnique({ where: { id } })
    if (!user) throw new UserNotFoundError(id)
    return ctx.json({ data: user })
  }

  @Route({ body: createUserSchema, response: userResponseSchema, summary: 'Create a new user' })
  async create(ctx: RouterContext) {
    const user = await this.db.user.create({ data: await ctx.body<CreateUserInput>() })
    return ctx.json({ data: user }, 201)
  }

  @Route({
    params: userParams,
    body: updateUserSchema,
    response: userResponseSchema,
    summary: 'Update a user',
  })
  async update(ctx: RouterContext) {
    const id = ctx.param('id')
    if (!(await this.db.user.findUnique({ where: { id } }))) throw new UserNotFoundError(id)

    const user = await this.db.user.update({ where: { id }, data: await ctx.body<UpdateUserInput>() })
    return ctx.json({ data: user })
  }

  @Route({ params: userParams, response: deleteUserSchema, summary: 'Delete a user' })
  async destroy(ctx: RouterContext) {
    const id = ctx.param('id')
    if (!(await this.db.user.findUnique({ where: { id } }))) throw new UserNotFoundError(id)

    await this.db.user.delete({ where: { id } })
    return ctx.json({ success: true })
  }
}
