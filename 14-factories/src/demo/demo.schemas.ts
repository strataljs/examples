import { array, boolean, enum as enum_, number, object, optional, string } from 'zod/mini'
import { describe, named } from 'stratal/validation'

export const userSchema = named(
  object({
    email: string(),
    name: string(),
    role: enum_(['user', 'admin']),
    emailVerified: boolean(),
  }),
  'FakeUser',
)

export const productSchema = named(
  object({
    sku: string(),
    name: string(),
    price: number(),
    category: string(),
    inStock: boolean(),
  }),
  'FakeProduct',
)

export const countQuerySchema = object({
  count: optional(describe(string(), 'Number of items to generate')),
})

export const usersResponseSchema = object({ data: array(userSchema) })
export const productsResponseSchema = object({ data: array(productSchema) })
export const mixedResponseSchema = object({
  data: object({ users: array(userSchema), products: array(productSchema) }),
})
