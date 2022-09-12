import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    // TODO: Should be more restrictive.
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  handleConnection(socket: Socket, ..._args: any[]) {
    socket.emit('pong', { type: 'Welcome. New connection received! (initialize)' });
  }
  @WebSocketServer()
  server: Server;

  @OnEvent('polling.attempt')
  handlePollEvent(data: any) {
    this.server.emit("pong", { type: "normal", data })
  }

  @OnEvent('polling.success')
  handleSuccess(data: any) {
    this.server.emit("pong", { type: "success", data })
  }
}
