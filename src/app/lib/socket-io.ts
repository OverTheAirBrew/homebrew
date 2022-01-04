import { Server as SocketServer } from 'socket.io';
import { Service } from 'typedi';

export interface SocketContract<Data extends Object> {
  EventName: string;
  Data: Data;
}

export interface ISocketListener<Data> {
  (message: Data): void | PromiseLike<void>;
}

@Service()
export class OtaSocketServer {
  private server: SocketServer;

  constructor(server: SocketServer) {
    this.server = server;
    this.server.removeAllListeners();
  }

  public sendMessage<Data>(message: SocketContract<Data>) {
    return async (request: Data) => {
      this.server.emit(message.EventName, request);
    };
  }
}
