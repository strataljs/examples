import { AUTH_SERVICE, type AuthService } from '@stratal/framework/auth'
import { inject } from 'stratal/di'
import { All, Controller, type IController, type RouterContext, VERSION_NEUTRAL } from 'stratal/router'
import { any } from 'zod/mini'

@Controller('/api/auth', { version: VERSION_NEUTRAL, tags: ['Auth'] })
export class AuthController implements IController {
  constructor(@inject(AUTH_SERVICE) private readonly authService: AuthService) {}

  @All('/*', { response: any(), hideFromDocs: true })
  handle(ctx: RouterContext) {
    return this.authService.auth.handler(ctx.c.req.raw)
  }
}
