import { Transient } from 'stratal/di'
import type { IQueueConsumer, QueueMessage } from 'stratal/queue'
import type { NotificationPayload } from './notification.payload'

@Transient()
export class NotificationConsumer implements IQueueConsumer<NotificationPayload> {
  readonly messageTypes = ['notification.send']

  async handle(message: QueueMessage<NotificationPayload>): Promise<void> {
    const { to, subject, body } = message.payload
    console.log(`[NotificationConsumer] ${message.id} -> ${to}: [${subject}] ${body}`)
  }

  async onError(error: Error, message: QueueMessage<NotificationPayload>): Promise<void> {
    console.error(`[NotificationConsumer] ${message.id} failed:`, error.message)
  }
}
