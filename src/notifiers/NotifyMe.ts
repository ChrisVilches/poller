import { Logger } from '@nestjs/common';
import { spawnSync } from 'child_process';
import { Notifiable } from './Notifiable';

// Note: It seems https://ifttt.com also works.

// https://github.com/ChrisVilches/Notify-Me
export class NotifyMe implements Notifiable {
  private readonly logger = new Logger(NotifyMe.name);

  notify(title: string, content: string) {
    const args = [];

    if (title) {
      args.push(['-title', title]);
    }

    if (content) {
      args.push(['-content', content]);
    }

    const { stdout, stderr } = spawnSync('notify_me', args.flat());

    this.logger.debug(stdout);

    if (stderr !== null && stderr.toString().length) {
      this.logger.error(stderr);
    }
  }
}
