import { exports } from 'cloudflare:workers'
import type { StratalEnv } from 'stratal'
import { DI_TOKENS, inject } from 'stratal/di'
import { HttpException } from 'stratal/errors'
import { Controller, type IController, Route, type RouterContext, uuidParamSchema } from 'stratal/router'
import { object, string } from 'zod/mini'
import {
  createTaskSchema,
  createdTaskSchema,
  taskCountSchema,
  taskListSchema,
  taskLookupSchema,
  workflowStartedSchema,
} from './task.schemas'
import { TaskService } from './task.service'

@Controller('/tasks', { tags: ['Tasks'] })
export class TaskController implements IController {
  constructor(@inject(TaskService) private readonly taskService: TaskService) {}

  @Route({
    query: object({ userId: string() }),
    response: taskListSchema,
    summary: 'List tasks for a user',
  })
  index(ctx: RouterContext) {
    return ctx.json({ tasks: this.taskService.findByUserId(ctx.query('userId') as string) })
  }

  @Route({
    params: uuidParamSchema,
    response: taskLookupSchema,
    summary: 'Get a task by ID through the RPC entrypoint',
  })
  async show(ctx: RouterContext) {
    const task = await exports.TaskRpc.getTask(ctx.param('id'))
    return ctx.json({ task: task ?? null })
  }

  @Route({
    body: createTaskSchema,
    response: createdTaskSchema,
    summary: 'Create a task and increment the per-user Durable Object counter',
  })
  async create(ctx: RouterContext) {
    const { title, userId } = await ctx.body<{ title: string; userId: string }>()
    const task = this.taskService.create(title, userId)

    const counter = exports.TaskCounter.get(exports.TaskCounter.idFromName(userId))
    const counterValue = await counter.increment(userId)

    return ctx.json({ task, counterValue }, 201)
  }
}

@Controller('/tasks/:id/process', { tags: ['Tasks'] })
export class TaskProcessController implements IController {
  constructor(
    @inject(TaskService) private readonly taskService: TaskService,
    @inject(DI_TOKENS.CloudflareEnv) private readonly env: StratalEnv,
  ) {}

  @Route({
    params: uuidParamSchema,
    response: workflowStartedSchema,
    summary: 'Start the task processing workflow',
  })
  async create(ctx: RouterContext) {
    const id = ctx.param('id')
    if (!this.taskService.findById(id)) throw new HttpException(404, `Task ${id} not found`)

    const instance = await this.env.TASK_WORKFLOW.create({ params: { taskId: id } })
    return ctx.json({ instanceId: instance.id }, 201)
  }
}

@Controller('/tasks/user/:userId/count', { tags: ['Tasks'] })
export class TaskCountController implements IController {
  constructor(@inject(DI_TOKENS.CloudflareEnv) private readonly env: StratalEnv) {}

  @Route({
    params: object({ userId: string() }),
    response: taskCountSchema,
    summary: 'Read the per-user count from Durable Object storage',
  })
  async index(ctx: RouterContext) {
    const userId = ctx.param('userId')
    const counter = this.env.TASK_COUNTER.get(this.env.TASK_COUNTER.idFromName(userId))

    return ctx.json({ count: await counter.getCount() })
  }
}
