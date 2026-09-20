import { InjectDB, type DatabaseService } from '@stratal/framework/database'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { object, string } from 'zod/mini'
import { TaskNotFoundError } from './task-not-found.error'
import {
  type CreateTaskInput,
  type UpdateTaskInput,
  createTaskSchema,
  deleteTaskSchema,
  taskListSchema,
  taskResponseSchema,
  updateTaskSchema,
} from './tasks.schemas'

const taskParams = object({ id: string() })

@Controller('/tasks', { tags: ['Tasks'] })
export class TasksController implements IController {
  constructor(@InjectDB('main') private readonly db: DatabaseService<'main'>) {}

  @Route({ response: taskListSchema, summary: 'List all tasks' })
  async index(ctx: RouterContext) {
    const tasks = await this.db.task.findMany({ orderBy: { createdAt: 'desc' } })
    return ctx.json({ data: tasks })
  }

  @Route({ params: taskParams, response: taskResponseSchema, summary: 'Get a task by ID' })
  async show(ctx: RouterContext) {
    const id = ctx.param('id')
    const task = await this.db.task.findUnique({ where: { id } })
    if (!task) throw new TaskNotFoundError(id)
    return ctx.json({ data: task })
  }

  @Route({ body: createTaskSchema, response: taskResponseSchema, summary: 'Create a new task' })
  async create(ctx: RouterContext) {
    const task = await this.db.task.create({ data: await ctx.body<CreateTaskInput>() })
    return ctx.json({ data: task }, 201)
  }

  @Route({
    params: taskParams,
    body: updateTaskSchema,
    response: taskResponseSchema,
    summary: 'Update a task',
  })
  async update(ctx: RouterContext) {
    const id = ctx.param('id')
    if (!(await this.db.task.findUnique({ where: { id } }))) throw new TaskNotFoundError(id)

    const task = await this.db.task.update({ where: { id }, data: await ctx.body<UpdateTaskInput>() })
    return ctx.json({ data: task })
  }

  @Route({ params: taskParams, response: deleteTaskSchema, summary: 'Delete a task' })
  async destroy(ctx: RouterContext) {
    const id = ctx.param('id')
    if (!(await this.db.task.findUnique({ where: { id } }))) throw new TaskNotFoundError(id)

    await this.db.task.delete({ where: { id } })
    return ctx.json({ success: true })
  }
}
