import { InjectQueue } from '@nestjs/bull';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { NotificationArguments } from '@interfaces/NotificationArguments';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Polling } from '@persistence/entities/polling.entity';
import { NOTIFICATIONS_QUEUE } from '@background-process/queues';

export class PollingSuccessListener {
  constructor(
    @InjectQueue(NOTIFICATIONS_QUEUE)
    private notificationsQueue: Queue<NotificationArguments>,
  ) {}

  @OnEvent('polling.success')
  async handlePollingSuccess(polling: Polling) {
    const endpoint: Endpoint = polling.endpoint;

    const title = endpoint.formattedTitle();
    const content = polling.computedMessage || '';
    const url = polling.endpoint.url;

    this.notificationsQueue.add({
      title,
      content,
      url,
    });
  }
}
