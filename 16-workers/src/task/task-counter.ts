import { LOGGER_TOKENS, type LoggerService } from 'stratal/logger'
import { StratalDurableObject } from 'stratal/workers'
import { TaskService } from './task.service'

export class TaskCounter extends StratalDurableObject {
  async increment(userId: string): Promise<number> {
    const next = ((await this.ctx.storage.get<number>('count')) ?? 0) + 1
    await this.ctx.storage.put('count', next)

    await this.runInScope(async (container) => {
      const taskService = container.resolve(TaskService)
      const logger = container.resolve<LoggerService>(LOGGER_TOKENS.LoggerService)

      logger.info(
        `[TaskCounter] User ${userId} now has ${next} tasks (${taskService.count()} in memory)`,
      )
    })

    return next
  }

  async getCount(): Promise<number> {
    return (await this.ctx.storage.get<number>('count')) ?? 0
  }

  async reset(): Promise<void> {
    await this.ctx.storage.put('count', 0)
  }
}
