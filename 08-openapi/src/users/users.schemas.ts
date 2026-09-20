import { _default, array, boolean, email, enum as enum_, maxLength, minLength, object, optional, string } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'
import { describe, named } from 'stratal/validation'

const role = enum_(['admin', 'member', 'viewer'])

// `named()` is reserved for schemas referenced from inside other schemas. A
// named schema used directly as a body or response is emitted as a $ref to
// itself in stratal 0.1.0, so the wrappers below stay anonymous and inline.
export const userSchema = named(
  object({
    id: string(),
    name: string(),
    email: email(),
    role,
    createdAt: string(),
  }),
  'User',
  'A registered user',
)

export const createUserSchema = object({
  name: describe(string().check(minLength(1), maxLength(100)), 'Display name'),
  email: describe(email(), 'Unique email address'),
  role: _default(role, 'member'),
})

export const updateUserSchema = object({
  name: optional(string().check(minLength(1), maxLength(100))),
  email: optional(email()),
  role: optional(role),
})

export const userListSchema = object({ data: array(userSchema) })
export const userResponseSchema = object({ data: userSchema })
export const deleteUserSchema = object({ success: boolean() })

export type User = Infer<typeof userSchema>
export type CreateUserInput = Infer<typeof createUserSchema>
export type UpdateUserInput = Infer<typeof updateUserSchema>
