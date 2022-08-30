import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { PendingEndpoint } from '@interfaces/PendingEndpoint';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { PollingsService } from '@persistence/services/pollings.service';

const minutesDifference = (startDate: Date, endDate: Date) =>
  (endDate.getTime() - startDate.getTime()) / 60000;

@Injectable()
export class FetchPendingEndpointsJob {
  private readonly logger = new Logger(FetchPendingEndpointsJob.name);

  constructor(
    private readonly endpointsService: EndpointsService,
    private readonly pollingsService: PollingsService,
    @InjectQueue('pending-endpoints')
    private pollingsQueue: Queue<PendingEndpoint>,
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

    this.logger.log(`Polling ${toPoll.length} endpoints`);

    for (const endpoint of toPoll) {
      this.pollingsQueue.add({
        endpointId: endpoint.id,
        manual: false,
      });
    }
  }

  private async shouldPoll(now: Date, endpoint: Endpoint): Promise<boolean> {
    const lastPoll = await this.pollingsService.findLatest(endpoint.id);

    // TODO: Check if the endpoint is not timed-out

    if (lastPoll === null) {
      return true;
    }

    return endpoint.periodMinutes <= minutesDifference(lastPoll.createdAt, now);
  }
}