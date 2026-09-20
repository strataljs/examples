import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'
import { UserNotFoundError } from './user-not-found.error'
import {
  type CreateUserInput,
  type UpdateUserInput,
  type User,
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
  userListSchema,
  userResponseSchema,
} from './users.schemas'

const users = new Map<string, User>()
const userParams = object({ id: string() })

@Controller('/users', { tags: ['Users'] })
export class UsersController implements IController {
  @Route({
    response: userListSchema,
    summary: 'List all users',
    description: 'Returns every registered user.',
  })
  index(ctx: RouterContext) {
    return ctx.json({ data: Array.from(users.values()) })
  }

  @Route({
    params: userParams,
    response: userResponseSchema,
    summary: 'Get user by ID',
    description: 'Returns a single user by their unique identifier.',
  })
  show(ctx: RouterContext) {
    const id = ctx.param('id')
    const user = users.get(id)
    if (!user) throw new UserNotFoundError(id)
    return ctx.json({ data: user })
  }

  @Route({
    body: createUserSchema,
    response: userResponseSchema,
    summary: 'Create a user',
    description: 'Creates a new user. `role` defaults to `member`.',
  })
  async create(ctx: RouterContext) {
    const body = await ctx.body<CreateUserInput>()
    const user: User = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...body }
    users.set(user.id, user)
    return ctx.json({ data: user }, 201)
  }

  @Route({
    params: userParams,
    body: updateUserSchema,
    response: userResponseSchema,
    summary: 'Update a user',
    description: 'Updates an existing user. Only provided fields change.',
  })
  async update(ctx: RouterContext) {
    const id = ctx.param('id')
    const user = users.get(id)
    if (!user) throw new UserNotFoundError(id)

    const updated = { ...user, ...(await ctx.body<UpdateUserInput>()) }
    users.set(id, updated)
    return ctx.json({ data: updated })
  }

  @Route({
    params: userParams,
    response: deleteUserSchema,
    summary: 'Delete a user',
    description: 'Permanently removes a user by their ID.',
  })
  destroy(ctx: RouterContext) {
    const id = ctx.param('id')
    if (!users.delete(id)) throw new UserNotFoundError(id)
    return ctx.json({ success: true })
  }
}
