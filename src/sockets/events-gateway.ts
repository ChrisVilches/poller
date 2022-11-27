import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

// TODO: Rename this file?

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {
  handleConnection(socket: Socket, ..._args: any[]) {
    socket.emit('polling.initialize', {
      timestamp: new Date(),
      data: 'Listening to polling events...',
    });
  }
  @WebSocketServer()
  server: Server;

  @OnEvent('polling.attempt')
  handlePollEvent(data: any) {
    this.server.emit('polling.attempt', { timestamp: new Date(), data });
  }

  @OnEvent('polling.success')
  handleSuccess(data: any) {
    this.server.emit('polling.success', { timestamp: new Date(), data });
  }
}
