import {
  Contract,
  ILogger,
  IMessagingManager,
} from '@overtheairbrew/homebrew-plugin';
import { Server as SocketServer } from 'socket.io';
import { Container, Service } from 'typedi';
import { Logger } from './lib/logger';
import { OtaSocketServer } from './lib/socket-io';
import { OneWireSensor } from './plugins/one-wire';
import {
  DS18B20Controller,
  IOneWireController,
  StreamController,
} from './plugins/one-wire/controllers';

export async function setupContainer() {
  Container.set('loggingOptions', {
    level: process.env.LOGGING_LEVEL || 'error',
    serviceName: 'homebrew',
    node_env: process.env.NODE_ENV || 'development',
  });

  Container.set(ILogger, Container.get(Logger));

  const socketIoServer = new SocketServer({
    path: '/socket.io',
    cors: {
      origin: '*',
    },
  });

  Container.set(OtaSocketServer, new OtaSocketServer(socketIoServer));

  Container.set(IMessagingManager, new MessagingManager());

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    Container.set(
      IOneWireController,
      new StreamController(true, [
        {
          address: '28-000004c8b8d3',
          expectedValues: [10, 11, 12, 13, 14, 15, 16],
        },
      ]),
    );
  } else {
    Container.set(IOneWireController, new DS18B20Controller());
  }

  Container.import([OneWireSensor]);
}

@Service()
class MessagingManager implements IMessagingManager {
  sendMessage<Data>(message: Contract<Data>): (message: Data) => Promise<void> {
    return;
  }
}
