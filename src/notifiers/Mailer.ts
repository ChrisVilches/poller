import { Logger } from '@nestjs/common';
import { Notifiable } from './Notifiable';

export class Mailer implements Notifiable {
  private readonly logger = new Logger(this.constructor.name);

  notify() {
    this.logger.warn('Delivering e-mail (TODO)');
  }
}
