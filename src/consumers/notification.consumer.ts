import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { LogNotification } from '../notifiers/LogNotification';
import { Mailer } from '../notifiers/Mailer';
import { Notifiable } from '../notifiers/Notifiable';
import { NotifyMe } from '../notifiers/NotifyMe';

@Processor('notifications')
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  // TODO: Can I use something different from "unknown"??
  @Process()
  sendNotifications(job: Job<unknown>) {
    const { title, msg } = job.data as any

    const notifiers: Notifiable[] = [
      new NotifyMe(),
      new Mailer(),
      new LogNotification()
    ]

    notifiers.forEach((notif: Notifiable) => {
      notif.notify(title, msg)
    });
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err)
  }
}
