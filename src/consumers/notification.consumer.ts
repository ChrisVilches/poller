import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotifyMe } from '../notifiers/NotifyMe';

interface QueueJob {
  title: string
  msg: string
}

// TODO: No visible error when Redis is not connected correctly.
@Processor('notifications')
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  @Process()
  // sendNotifications({ title, msg }: QueueJob) {
  sendNotifications(job: Job<unknown>) {
    const { title, msg } = job.data as any
    const notifier = new NotifyMe();
    this.logger.warn(title)
    this.logger.warn(msg)
    notifier.notify(title, msg);
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err)
  }
}
