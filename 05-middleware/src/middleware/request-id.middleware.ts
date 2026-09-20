import { Transient } from 'stratal/di'
import type { Middleware, Next, RouterContext } from 'stratal/router'

@Transient()
export class RequestIdMiddleware implements Middleware {
  async handle(ctx: RouterContext, next: Next): Promise<void> {
    await next()
    ctx.c.res.headers.set('x-request-id', crypto.randomUUID())
  }
}
