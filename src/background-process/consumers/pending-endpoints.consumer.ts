import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';
import { PendingEndpoint } from '@interfaces/PendingEndpoint';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { PollingsService } from '@persistence/services/pollings.service';

@Processor('pending-endpoints')
export class PendingEndpointsConsumer {
  private readonly logger = new Logger(PendingEndpointsConsumer.name);

  constructor(
    private readonly pollingsService: PollingsService,
    private readonly endpointsService: EndpointsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Process()
  async executePolling(job: Job<PendingEndpoint>) {
    const { endpointId, manual } = job.data;

    const endpoint = (await this.endpointsService.findOne(
      endpointId,
    )) as Endpoint;
    const result = await this.pollingsService.poll(endpoint, manual);

    if (result?.shouldNotify) {
      this.eventEmitter.emit('polling.success', result);
    }

    if (result === null) return;
    const { shouldNotify, responseCode } = result;
    this.logger.log(
      `(${responseCode} | Notify? ${shouldNotify}) ${endpoint.url}`,
    );
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err);
  }
}