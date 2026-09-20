import { StratalWorkerEntrypoint } from 'stratal/workers'
import type { Task } from './task.service'
import { TaskService } from './task.service'

export class TaskRpc extends StratalWorkerEntrypoint {
  async getTask(id: string): Promise<Task | undefined> {
    return this.runInScope(async (container) => container.resolve(TaskService).findById(id))
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return this.runInScope(async (container) => container.resolve(TaskService).findByUserId(userId))
  }

  async getTaskCount(): Promise<number> {
    return this.runInScope(async (container) => container.resolve(TaskService).count())
  }
}
