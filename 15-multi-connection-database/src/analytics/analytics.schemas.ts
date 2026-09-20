import { array, minLength, nullable, object, optional, string } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'
import { named } from 'stratal/validation'

export const pageViewSchema = named(
  object({
    id: string(),
    path: string(),
    userId: nullable(string()),
    createdAt: string(),
  }),
  'PageView',
)

export const eventSchema = named(
  object({
    id: string(),
    name: string(),
    payload: nullable(string()),
    userId: nullable(string()),
    createdAt: string(),
  }),
  'AnalyticsEvent',
)

export const recordPageViewSchema = object({
  path: string().check(minLength(1)),
  userId: optional(string()),
})

export const recordEventSchema = object({
  name: string().check(minLength(1)),
  payload: optional(string()),
  userId: optional(string()),
})

export const pageViewListSchema = object({ data: array(pageViewSchema) })
export const pageViewResponseSchema = object({ data: pageViewSchema })
export const eventListSchema = object({ data: array(eventSchema) })
export const eventResponseSchema = object({ data: eventSchema })

export type RecordPageViewInput = Infer<typeof recordPageViewSchema>
export type RecordEventInput = Infer<typeof recordEventSchema>
