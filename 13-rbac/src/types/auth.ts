import type {} from '@stratal/framework/context'

declare module '@stratal/framework/context' {
  interface AuthUser {
    role: string
  }
}
