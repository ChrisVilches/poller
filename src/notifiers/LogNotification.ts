import { Logger } from '@nestjs/common';
import { Notifiable } from './Notifiable';

export class LogNotification implements Notifiable {
  private readonly logger = new Logger(LogNotification.name);

  notify(title: string, content: string) {
    this.logger.log([title, content].filter((x) => x).join(' | '));
  }
}
