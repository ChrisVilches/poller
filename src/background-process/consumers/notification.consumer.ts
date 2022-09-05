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
import { getSendinblueConfig } from '@util/getSendinblueConfig';
import { SendinblueAPI, SendinblueConfig } from '@notifiers/SendinblueAPI';

@Processor(NOTIFICATIONS_QUEUE)
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  @Process()
  sendNotifications(job: Job<NotificationArguments>) {
    const { title, content, url } = job.data;

    const notifiers: Notifiable[] = this.getEnabledNotifiers()

    this.logger.debug('Enabled notifiers:')
    this.logger.debug(notifiers.map((cls: any) => cls.constructor.name).join(', '))

    notifiers.forEach((notif: Notifiable) => {
      try {
        notif.notify(title, content, url);
      } catch (e) {
        this.logger.error(`Error while notifying: ${e}`);
        this.logger.error(e.stack);
      }
    });
  }

  private getEnabledNotifiers(): Notifiable[] {
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

    const sendinblueConfig: SendinblueConfig | null = getSendinblueConfig()

    if (sendinblueConfig) {
      notifiers.push(new SendinblueAPI(sendinblueConfig))
    }

    return notifiers
  }

  @OnQueueError()
  onError(err: Error) {
    this.logger.error(err);
  }
}
