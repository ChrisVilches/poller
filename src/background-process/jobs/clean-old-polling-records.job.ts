import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { PollingsService } from '@persistence/services/pollings.service';

@Injectable()
export class CleanOldPollingRecordsJob {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly pollingsService: PollingsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const date = moment().subtract(
      process.env.CLEAN_POLLING_OLDER_THAN_DAYS,
      'days',
    );
    this.logger.log(
      `Starting cleaning job. Clean older than ${date} (older than ${process.env.CLEAN_POLLING_OLDER_THAN_DAYS} days)`,
    );
    const result = await this.pollingsService.removeOlderThan(date.toDate());

    this.logger.log(
      `Polling records cleaned. Affected rows: ${result.affected}`,
    );
  }
}
