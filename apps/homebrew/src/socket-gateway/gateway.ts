import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer() server: any;

  public sendMessage<TMessage extends { constructor: Function }>(
    event: any,
    message: TMessage,
  ) {
    this.server.emit(event, message);
  }
}
