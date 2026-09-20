import { array, boolean, maxLength, minLength, nullable, object, optional, string } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'
import { named } from 'stratal/validation'

export const taskSchema = named(
  object({
    id: string(),
    title: string(),
    description: nullable(string()),
    completed: boolean(),
    createdAt: string(),
    updatedAt: string(),
  }),
  'Task',
)

export const createTaskSchema = object({
  title: string().check(minLength(1), maxLength(200)),
  description: optional(string()),
})

export const updateTaskSchema = object({
  title: optional(string().check(minLength(1), maxLength(200))),
  description: optional(string()),
  completed: optional(boolean()),
})

export const taskListSchema = object({ data: array(taskSchema) })
export const taskResponseSchema = object({ data: taskSchema })
export const deleteTaskSchema = object({ success: boolean() })

export type CreateTaskInput = Infer<typeof createTaskSchema>
export type UpdateTaskInput = Infer<typeof updateTaskSchema>
