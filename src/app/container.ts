import { ILogger } from '@overtheairbrew/homebrew-plugin';
import { Server as SocketServer } from 'socket.io';
import { Container } from 'typedi';
import { Logger } from './lib/logger';
import { OtaSocketServer } from './lib/socket-io';

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
}
