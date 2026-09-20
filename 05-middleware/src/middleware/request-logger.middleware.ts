import { Transient } from 'stratal/di'
import type { Middleware, Next, RouterContext } from 'stratal/router'

@Transient()
export class RequestLoggerMiddleware implements Middleware {
  async handle(ctx: RouterContext, next: Next): Promise<void> {
    const start = Date.now()
    const { method, path } = ctx.c.req

    console.log(`--> ${method} ${path}`)
    await next()
    console.log(`<-- ${method} ${path} ${ctx.c.res.status} (${Date.now() - start}ms)`)
  }
}
