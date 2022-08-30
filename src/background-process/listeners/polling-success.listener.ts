import { InjectQueue } from '@nestjs/bull';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { NotificationArguments } from '@interfaces/NotificationArguments';
import { EndpointsService } from '@persistence/services/endpoints.service';
import { Endpoint } from '@persistence/entities/endpoint.entity';
import { Polling } from '@persistence/entities/polling.entity';

export class PollingSuccessListener {
  constructor(
    @InjectQueue('notifications')
    private notificationsQueue: Queue<NotificationArguments>,
    private endpointsService: EndpointsService,
  ) {}
  @OnEvent('polling.success')
  async handlePollingSuccess(polling: Polling) {
    const endpoint: Endpoint = polling.endpoint;

    const title = endpoint.title || endpoint.url;
    const content = endpoint.notificationMessage || '';

    await this.endpointsService.updateTimeout(endpoint);

    this.notificationsQueue.add({
      title,
      content,
    });
  }
}
