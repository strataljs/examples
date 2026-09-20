import { AC_TOKENS, type AccessService } from '@stratal/framework/access-control'
import { AuthGuard } from '@stratal/framework/guards'
import { inject } from 'stratal/di'
import { UseGuards } from 'stratal/guards'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { array, object, record, string } from 'zod/mini'

@Controller('/me', { tags: ['Access'], security: ['sessionCookie'] })
@UseGuards(AuthGuard())
export class MyAccessController implements IController {
  constructor(@inject(AC_TOKENS.AccessService) private readonly access: AccessService) {}

  @Route({
    response: object({
      data: object({
        role: string(),
        permissions: record(string(), array(string())),
      }),
    }),
    summary: 'Role and permissions of the signed-in user',
  })
  async index(ctx: RouterContext) {
    return ctx.json({
      data: {
        role: ctx.user().role,
        permissions: await this.access.getCurrentUserPermissions(),
      },
    })
  }
}
