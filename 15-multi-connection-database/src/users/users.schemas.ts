import { array, boolean, email, maxLength, minLength, nullable, object, optional, string } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'
import { named } from 'stratal/validation'

export const userSchema = named(
  object({
    id: string(),
    email: string(),
    name: string(),
    createdAt: string(),
    updatedAt: string(),
  }),
  'User',
)

export const postSchema = named(
  object({
    id: string(),
    title: string(),
    content: nullable(string()),
    published: boolean(),
    userId: string(),
    createdAt: string(),
    updatedAt: string(),
  }),
  'Post',
)

export const createUserSchema = object({
  email: email(),
  name: string().check(minLength(1), maxLength(200)),
})

export const updateUserSchema = object({
  email: optional(email()),
  name: optional(string().check(minLength(1), maxLength(200))),
})

export const createPostSchema = object({
  title: string().check(minLength(1), maxLength(200)),
  content: optional(string()),
  published: optional(boolean()),
})

export const userListSchema = object({ data: array(userSchema) })
export const userResponseSchema = object({ data: userSchema })
export const postListSchema = object({ data: array(postSchema) })
export const postResponseSchema = object({ data: postSchema })
export const deleteUserSchema = object({ success: boolean() })

export type CreateUserInput = Infer<typeof createUserSchema>
export type UpdateUserInput = Infer<typeof updateUserSchema>
export type CreatePostInput = Infer<typeof createPostSchema>
