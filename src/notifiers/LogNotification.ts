import { Notifiable } from './Notifiable';
import * as winston from 'winston';
import { isProd } from '@util/env';

export class LogNotification implements Notifiable {
  private readonly output: winston.Logger;

  constructor(filePath: string) {
    this.output = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: LogNotification.name },
      transports: [new winston.transports.File({ filename: filePath })],
    });

    if (!isProd()) {
      this.output.add(
        new winston.transports.Console({
          format: winston.format.prettyPrint(),
        }),
      );
    }
  }

  notify(title: string, content: string) {
    this.output.info({ title, content });
  }
}
