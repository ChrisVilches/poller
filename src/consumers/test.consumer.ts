import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

@Processor('test')
export class TestConsumer {
  private readonly logger = new Logger(TestConsumer.name);

  @Process()
  execute() {
    this.logger.debug('Test queue OK');
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err);
  }
}
