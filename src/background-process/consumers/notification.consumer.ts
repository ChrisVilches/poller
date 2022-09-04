import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationArguments } from '@interfaces/NotificationArguments';
import { LogNotification } from '@notifiers/LogNotification';
import { Mailer } from '@notifiers/Mailer';
import { Notifiable } from '@notifiers/Notifiable';
import { PushNotification } from '@notifiers/PushNotification';
import { NOTIFICATIONS_QUEUE } from '@background-process/queues';
import { isStringPresent } from '@util/strings';

@Processor(NOTIFICATIONS_QUEUE)
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  @Process()
  sendNotifications(job: Job<NotificationArguments>) {
    const { title, content } = job.data;

    const notifiers: Notifiable[] = [new Mailer()];

    if (isStringPresent(process.env.LOG_NOTIFICATION_FILE_PATH)) {
      notifiers.push(
        new LogNotification(process.env.LOG_NOTIFICATION_FILE_PATH as string),
      );
    }

    if (isStringPresent(process.env.PUSH_NOTIFICATION_API_KEY)) {
      notifiers.push(
        new PushNotification(process.env.PUSH_NOTIFICATION_API_KEY as string),
      );
    }

    notifiers.forEach((notif: Notifiable) => {
      try {
        notif.notify(title, content);
      } catch (e) {
        this.logger.error(`Error while notifying: ${e}`);
        this.logger.error(e.stack);
      }
    });
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err);
  }
}
