import { InjectQueue } from '@nestjs/bull';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { NotificationArguments } from '@interfaces/NotificationArguments';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Polling } from '@persistence/entities/polling.entity';

export class PollingSuccessListener {
  constructor(
    @InjectQueue('notifications')
    private notificationsQueue: Queue<NotificationArguments>,
  ) {}

  @OnEvent('polling.success')
  async handlePollingSuccess(polling: Polling) {
    const endpoint: Endpoint = polling.endpoint;

    const title = endpoint.formattedTitle();
    const content = polling.computedMessage || '';

    /**
     * TODO: With the rule "content-equals", the message content may get
     * huge in some cases, so it's necessary to trim the message. Then, the user
     * can read the whole message in the UI.
     */

    this.notificationsQueue.add({
      title,
      content,
    });
  }
}
