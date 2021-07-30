import { Service, Container } from 'typedi';
import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';

@Service()
export class SocketIo {
  private server: SocketServer;

  constructor() {
    const http: Server = Container.get('http_instance');
    this.server = new SocketServer(http, {
      path: '/server/socket',
      cors: {
        origin: 'https://amritb.github.io',
      },
    });
  }

  public send<Data>(contract: Contract<Data>) {
    return async (message: Data) => {
      this.server.emit(contract.EventName, message);
    };
  }

  public listenForMessage<Data>(
    contract: Contract<Data>,
    listener: IQueueListener<Data>,
  ) {
    this.server.on(contract.EventName, async (data) => {
      await listener(data);
    });
  }
}

export interface Contract<Data extends Object> {
  EventName: string;
  Data: Data;
}

export interface IQueueListener<Data> {
  (message: Data): void | PromiseLike<void>;
}
