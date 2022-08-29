import { InjectQueue } from '@nestjs/bull';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { NotificationArguments } from 'src/interfaces/NotificationArguments';
import { Endpoint } from '../endpoints/entities/endpoint.entity';
import { Polling } from '../endpoints/entities/polling.entity';

export class PollingSuccessListener {
  constructor(@InjectQueue('notifications') private notificationsQueue: Queue<NotificationArguments>) {}
  @OnEvent('polling.success')
  handlePollingSuccess(polling: Polling) {
    const endpoint: Endpoint = polling.endpoint;

    const title = endpoint.title || endpoint.url;
    const content = endpoint.notificationMessage || '';

    this.notificationsQueue.add({
      title, content
    })
  }
}
