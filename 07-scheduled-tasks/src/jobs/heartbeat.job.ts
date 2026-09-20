import type { CronJob, ScheduledController } from 'stratal/cron'
import { Transient } from 'stratal/di'

@Transient()
export class HeartbeatJob implements CronJob {
  static schedule = '*/5 * * * *'

  async execute(_controller: ScheduledController): Promise<void> {
    console.log(`[HeartbeatJob] heartbeat at ${new Date().toISOString()}`)
  }
}
