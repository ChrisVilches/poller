import { TEST_QUEUE } from '@background-process/queues';
import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(TEST_QUEUE)
export class TestConsumer {
  private readonly logger = new Logger(this.constructor.name);

  @Process()
  execute(job: Job<any>) {
    const { env, date } = job.data;
    this.logger.debug(`Test queue OK (${env}, ${date})`);
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err);
  }
}
