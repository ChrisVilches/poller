import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { isProd } from '@util/env';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@WebSocketGateway(
  isProd()
    ? {}
    : {
        cors: {
          origin: '*',
        },
      },
)
export class Gateway implements OnGatewayConnection {
  handleConnection(socket: Socket, ..._args: any[]) {
    socket.emit('polling.initialize', {
      timestamp: new Date(),
      data: 'Listening to polling events...',
    });
  }
  @WebSocketServer()
  server: Server;

  // TODO: This should be done using Redis, or something like that.
  //       EventEmitter is only for one process.
  @OnEvent('polling.attempt')
  handlePollEvent(data: any) {
    this.server.emit('polling.attempt', { timestamp: new Date(), data });
  }

  @OnEvent('polling.success')
  handleSuccess(data: any) {
    this.server.emit('polling.success', { timestamp: new Date(), data });
  }
}
