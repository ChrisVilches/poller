import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { Endpoint } from '../endpoints/entities/endpoint.entity';
import { Polling } from '../endpoints/entities/polling.entity';

@Injectable()
export class PollingSuccessListener {
  constructor(@InjectQueue('notifications') private notificationsQueue: Queue) {}
  // TODO: Async set to false, to avoid abusing the Push Notification API
  // One "Nest" way of dealing with this is by creating a queue (may require Redis)
  // and setup just one worker. Don't use RxJS for this.
  @OnEvent('polling.success', { async: false })
  handlePollingSuccess(polling: Polling) {
    const endpoint: Endpoint = polling.endpoint;

    const title = endpoint.title || 'Poll result!';
    const msg = endpoint.notificationMessage || '';

    this.notificationsQueue.add({
      title, msg
    })
  }
}
