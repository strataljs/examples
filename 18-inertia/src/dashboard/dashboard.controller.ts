import { InertiaGet } from '@stratal/inertia'
import { Controller, type RouterContext } from 'stratal/router'

@Controller('/dashboard')
export class DashboardController {
  @InertiaGet('/')
  async index(ctx: RouterContext) {
    return ctx.inertia('Dashboard', {
      stats: { total: 42, recent: 7 },
      activeUsers: 15,
    })
  }
}
