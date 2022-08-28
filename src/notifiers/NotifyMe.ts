import { Logger } from '@nestjs/common';
import { execSync } from 'child_process';
import { Notifiable } from './Notifiable';

// Note: It seems https://ifttt.com also works.

// https://github.com/ChrisVilches/Notify-Me
export class NotifyMe implements Notifiable {
  private readonly logger = new Logger(NotifyMe.name);

  notify(title: string, content: string) {
    title = title.replace(/"/g, '"');
    content = content.replace(/"/g, '"');
    const cmd = `notify_me -title "${title}" -content "${content}"`;

    this.logger.debug(cmd);

    const stdout = execSync(cmd);
    this.logger.debug(stdout.toString());
  }
}
