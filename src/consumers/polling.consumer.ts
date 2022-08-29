import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';
import { PollingsService } from '../endpoints/pollings.service';

@Processor('pollings')
export class PollingConsumer {
  private readonly logger = new Logger(PollingConsumer.name);

  constructor(
    private readonly pollingsService: PollingsService,
    private eventEmitter: EventEmitter2,
  ) {}

  // TODO: Don't use "unknown".
  @Process()
  async executePolling(job: Job<unknown>) {
    const { endpoint, manual } = job.data as any

    const result = await this.pollingsService.poll(endpoint, manual);

    if (result?.shouldNotify) {
      this.eventEmitter.emit('polling.success', result!);
    }

    if (result === null) return;
    const { shouldNotify, responseCode } = result;
    this.logger.log(
      `(${responseCode} | Notify? ${shouldNotify}) ${endpoint.url}`,
    );
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err)
  }
}
