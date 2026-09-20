import { array, boolean, minLength, object, string } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'
import { named } from 'stratal/validation'

export const articleSchema = named(
  object({
    id: string(),
    title: string(),
    content: string(),
    published: boolean(),
    authorId: string(),
    createdAt: string(),
    updatedAt: string(),
  }),
  'Article',
)

export const createArticleSchema = object({
  title: string().check(minLength(1)),
  content: string().check(minLength(1)),
})

export const articleListSchema = object({ data: array(articleSchema) })
export const articleResponseSchema = object({ data: articleSchema })
export const deleteArticleSchema = object({ success: boolean() })

export type CreateArticleInput = Infer<typeof createArticleSchema>
