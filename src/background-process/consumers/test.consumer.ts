import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('test')
export class TestConsumer {
  private readonly logger = new Logger(TestConsumer.name);

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
