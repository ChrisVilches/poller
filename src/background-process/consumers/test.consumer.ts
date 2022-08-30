import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('test')
export class TestConsumer {
  private readonly logger = new Logger(TestConsumer.name);

  @Process()
  execute(job: Job<Date>) {
    this.logger.debug(`Test queue OK (event date ${job.data})`);
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err);
  }
}
