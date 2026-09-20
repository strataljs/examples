import { array, enum as enum_, nullable, number, object, string } from 'zod/mini'
import { named } from 'stratal/validation'

export const taskSchema = named(
  object({
    id: string(),
    title: string(),
    userId: string(),
    status: enum_(['pending', 'processing', 'completed']),
    createdAt: string(),
  }),
  'Task',
)

export const taskListSchema = object({ tasks: array(taskSchema) })
export const taskLookupSchema = object({ task: nullable(taskSchema) })
export const createTaskSchema = object({ title: string(), userId: string() })
export const createdTaskSchema = object({ task: taskSchema, counterValue: number() })
export const workflowStartedSchema = object({ instanceId: string() })
export const taskCountSchema = object({ count: number() })
