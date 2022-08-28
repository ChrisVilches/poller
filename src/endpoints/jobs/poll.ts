import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotifyMe } from '../../notifiers/NotifyMe';
import { EndpointsService } from '../endpoints.service';
import { Endpoint } from '../entities/endpoint.entity';
import { Polling } from '../entities/polling.entity';
import { PollingsService } from '../pollings.service';

const minutesDifference = (startDate: Date, endDate: Date) =>
  (endDate.getTime() - startDate.getTime()) / 60000;

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);

  constructor(
    private readonly endpointsService: EndpointsService,
    private readonly pollingsService: PollingsService,
    private eventEmitter: EventEmitter2
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const endpoints = await this.endpointsService.findEnabled();

    const toPoll: Endpoint[] = [];

    for (const endpoint of endpoints) {
      if (await this.shouldPoll(new Date(), endpoint)) {
        toPoll.push(endpoint);
      }
    }

    this.logger.debug(`Polling ${toPoll.length} endpoints`);

    for (const endpoint of toPoll) {
      const result = await this.pollingsService.poll(endpoint, false);

      if (result?.shouldNotify) {
        this.eventEmitter.emit(
          'polling.success',
          result!
        );
      }

      if (result === null) continue
      const { shouldNotify } = result
      this.logger.debug(`(Notify? ${shouldNotify}) ${endpoint.url}`);
    }
  }

  private async shouldPoll(now: Date, endpoint: Endpoint): Promise<boolean> {
    const lastPoll = await this.pollingsService.findLatest(endpoint.id);

    if (lastPoll === null) {
      return true;
    }

    return endpoint.periodMinutes <= minutesDifference(lastPoll.createdAt, now);
  }
}
