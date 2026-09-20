import { _default, array, boolean, email, enum as enum_, maxLength, minLength, object, optional, string } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'
import { describe, named } from 'stratal/validation'

const role = enum_(['admin', 'member', 'viewer'])

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

export const createUserSchema = named(
  object({
    name: describe(string().check(minLength(1), maxLength(100)), 'Display name'),
    email: describe(email(), 'Unique email address'),
    role: _default(role, 'member'),
  }),
  'CreateUser',
)

export const updateUserSchema = named(
  object({
    name: optional(string().check(minLength(1), maxLength(100))),
    email: optional(email()),
    role: optional(role),
  }),
  'UpdateUser',
)

export const userListSchema = named(object({ data: array(userSchema) }), 'UserList')
export const userResponseSchema = named(object({ data: userSchema }), 'UserResponse')
export const deleteUserSchema = named(object({ success: boolean() }), 'DeleteUser')

export type User = Infer<typeof userSchema>
export type CreateUserInput = Infer<typeof createUserSchema>
export type UpdateUserInput = Infer<typeof updateUserSchema>
