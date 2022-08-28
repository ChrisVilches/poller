import { Injectable, Logger } from '@nestjs/common';
import { Notifiable } from './Notifiable';

@Injectable()
export class Mailer implements Notifiable {
  private readonly logger = new Logger(Mailer.name);

  notify() {
    this.logger.warn('Delivering e-mail (TODO)');
  }
}
