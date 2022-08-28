import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Endpoint } from "../endpoints/entities/endpoint.entity";
import { Polling } from "../endpoints/entities/polling.entity";
import { NotifyMe } from "../notifiers/NotifyMe";

@Injectable()
export class PollingSuccessListener {
  // TODO: Async set to false, to avoid abusing the Push Notification API
  // One "Nest" way of dealing with this is by creating a queue (may require Redis)
  // and setup just one worker. Don't use RxJS for this.
  @OnEvent('polling.success', { async: false })
  handlePollingShouldNotify(polling: Polling) {
    const notifier = new NotifyMe()
    const endpoint: Endpoint = polling.endpoint
    
    const title = endpoint.title || 'Poll result!'
    const msg = endpoint.notificationMessage || ''
    notifier.notify(title, msg)
  }
}
