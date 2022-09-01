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

    // TODO: This could be implemented as entity method.
    const title = endpoint.title || endpoint.url;
    const content = polling.computedMessage || '';

    this.notificationsQueue.add({
      title,
      content,
    });
  }
}
