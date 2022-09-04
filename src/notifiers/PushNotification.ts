import { Logger } from '@nestjs/common';
import { limitMessageLength } from '@util/strings';
import axios from 'axios';
import { Notifiable } from './Notifiable';

// Get API KEY
// https://play.google.com/store/apps/details?id=net.xdroid.pn
export class PushNotification implements Notifiable {
  private readonly logger = new Logger(PushNotification.name);

  constructor(private readonly apiKey: string) {
    this.apiKey = this.apiKey.trim();
  }

  buildParams(title?: string, content?: string, url?: string) {
    const queryParams = {
      k: this.apiKey,
    } as any;

    if (title) {
      queryParams.t = title;
    }

    if (content) {
      queryParams.c = content;
    }

    if (url) {
      queryParams.u = url;
    }

    return queryParams;
  }

  async notify(title: string, content: string, url?: string) {
    content = limitMessageLength(
      content,
      Number(process.env.PUSH_NOTIFICATION_MESSAGE_MAX_LENGTH),
    );

    const params = this.buildParams(title, content, url);

    const debugMessage = `${title} | ${content}`;

    try {
      const res = await axios.get('https://xdroid.net/api/message', { params });
      this.logger.debug(
        `${debugMessage} | Push Notification API status: ${res.statusText}`,
      );
    } catch (e) {
      this.logger.error('Push notification failed');
      this.logger.error(debugMessage);
      this.logger.error(e);
    }
  }
}