import { InjectQueue, type IQueueSender } from 'stratal/queue'
import { Controller, type IController, Route, type RouterContext } from 'stratal/router'
import { boolean, email, object, string } from 'zod/mini'
import type { NotificationPayload } from './notification.payload'

const createNotificationSchema = object({ to: email(), subject: string(), body: string() })

@Controller('/notifications', { tags: ['Notifications'] })
export class NotificationsController implements IController {
  constructor(
    @InjectQueue('NOTIFICATIONS_QUEUE') private readonly queue: IQueueSender,
  ) {}

  @Route({
    body: createNotificationSchema,
    response: object({ queued: boolean() }),
    summary: 'Queue a notification',
  })
  async create(ctx: RouterContext) {
    await this.queue.dispatch({
      type: 'notification.send',
      payload: await ctx.body<NotificationPayload>(),
    })

    return ctx.json({ queued: true }, 201)
  }
}
