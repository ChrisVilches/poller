import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { PendingEndpoint } from '@interfaces/PendingEndpoint';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { PENDING_ENDPOINTS_QUEUE } from '@background-process/queues';

@Injectable()
export class FetchPendingEndpointsJob {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly endpointsService: EndpointsService,
    @InjectQueue(PENDING_ENDPOINTS_QUEUE)
    private pendingEndpointsQueue: Queue<PendingEndpoint>,
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

    this.logger.log(
      `Sending ${toPoll.length} endpoints to the pending queue, IDs: [${toPoll
        .map((p) => p.id)
        .join(', ')}]`,
    );

    for (const endpoint of toPoll) {
      this.pendingEndpointsQueue.add({
        endpointId: endpoint.id,
        manual: false,
      });
    }
  }

  isTimedOut(now: Date, endpoint: Endpoint): boolean {
    if (endpoint.timeout === null || typeof endpoint.timeout === 'undefined') {
      return false;
    }

    return now < (endpoint.timeout as Date);
  }

  private async shouldPoll(now: Date, endpoint: Endpoint): Promise<boolean> {
    if (this.isTimedOut(now, endpoint)) {
      return false;
    }

    return true;
  }
}
