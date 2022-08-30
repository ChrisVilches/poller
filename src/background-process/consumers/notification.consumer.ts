import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationArguments } from '@interfaces/NotificationArguments';
import { LogNotification } from '@notifiers/LogNotification';
import { Mailer } from '@notifiers/Mailer';
import { Notifiable } from '@notifiers/Notifiable';
import { NotifyMe } from '@notifiers/NotifyMe';

@Processor('notifications')
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  @Process()
  sendNotifications(job: Job<NotificationArguments>) {
    const { title, content } = job.data;

    const notifiers: Notifiable[] = [
      new NotifyMe(),
      new Mailer(),
      new LogNotification(),
    ];

    notifiers.forEach((notif: Notifiable) => {
      notif.notify(title, content);
    });
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err);
  }
}
