import { Server as SocketServer } from 'socket.io';
import { SocketContract } from './contracts';

export class OtaSocketServer {
  constructor(private server: SocketServer) {}

  public sendMessage<Data>(message: SocketContract<Data>) {
    return async (request: Data) => {
      this.server.emit(message.EventName, request);
    };
  }
}
