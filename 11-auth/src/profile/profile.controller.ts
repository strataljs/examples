import type { AuthContext } from '@stratal/framework/context'
import { AuthGuard } from '@stratal/framework/guards'
import { DI_TOKENS, inject } from 'stratal/di'
import { UseGuards } from 'stratal/guards'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { boolean, object, string } from 'zod/mini'

@Controller('/profile', { tags: ['Profile'], security: ['sessionCookie'] })
@UseGuards(AuthGuard())
export class ProfileController implements IController {
  constructor(@inject(DI_TOKENS.AuthContext) private readonly authContext: AuthContext) {}

  @Route({
    response: object({
      data: object({ userId: string(), email: string(), authenticated: boolean() }),
    }),
    summary: 'Get the signed-in user profile',
  })
  index(ctx: RouterContext) {
    const user = this.authContext.requireUser()

    return ctx.json({
      data: { userId: user.id, email: user.email, authenticated: true },
    })
  }
}
