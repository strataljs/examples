import type { CronJob, ScheduledController } from 'stratal/cron'
import { inject, Transient } from 'stratal/di'
import { LOGGER_TOKENS, type LoggerService } from 'stratal/logger'

@Transient()
export class CleanupJob implements CronJob {
  static schedule = '0 2 * * *'

  constructor(@inject(LOGGER_TOKENS.LoggerService) private readonly logger: LoggerService) {}

  async execute(_controller: ScheduledController): Promise<void> {
    this.logger.info('[CleanupJob] purging expired records')
  }

  async onError(error: Error): Promise<void> {
    this.logger.error('[CleanupJob] failed', { error: error.message })
  }
}
