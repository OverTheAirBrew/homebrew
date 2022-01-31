import { Queues } from '@overtheairbrew/node-typedi-in-memory-queue';
import * as express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import Container from 'typedi';
import { HttpClient } from './lib/http-client';
import { Logger } from './lib/logger';
import { MessagingManager } from './lib/messaging-manager';
import { ILogger } from './lib/plugin/abstractions/logger';
import { IMessagingManager } from './lib/plugin/abstractions/messaging-manager';
import { IHttpClient } from './lib/plugin/http-client';
import { OtaSocketServer } from './lib/socket-io';
import { actors, sensors } from './plugins';
import {
  DS18B20Controller,
  IOneWireController,
  StreamController,
} from './plugins/sensors/one-wire/controllers';

export async function setupContainer() {
  const expressApp = express();
  const httpApp = createServer(expressApp);

  Container.set('loggingOptions', {
    level: process.env.LOGGING_LEVEL || 'error',
    serviceName: 'homebrew',
    node_env: process.env.NODE_ENV || 'development',
  });

  Container.set(ILogger, Container.get(Logger));

  const queues = new Queues();
  Container.set(Queues, queues);

  const socketServer = new SocketServer(httpApp, {
    cors: {
      credentials: true,
    },
  });

  Container.set('expressApp', expressApp);
  Container.set('httpApp', httpApp);
  Container.set(IHttpClient, new HttpClient());

  Container.set(
    IMessagingManager,
    new MessagingManager(queues, new OtaSocketServer(socketServer)),
  );

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

  Container.import([...actors, ...sensors]);
}
