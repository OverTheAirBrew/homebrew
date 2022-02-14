import { json } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { createServer, Server } from 'http';
import { join } from 'path';
import 'reflect-metadata';
import {
  RoutingControllersOptions,
  useContainer,
  useExpressServer,
} from 'routing-controllers';
import { Container } from 'typedi';
import { setupContainer } from '../container';

const PORT = parseInt(process.env.PORT) || 9090;

export async function startServer(testMode: boolean = false) {
  let app: express.Application;
  let httpServer: Server;

  if (testMode) {
    app = express();
    httpServer = createServer(app);
  } else {
    app = Container.get<express.Application>('expressApp');
    httpServer = Container.get<Server>('httpApp');
  }

  app.use(cors());
  app.use(json());

  if (testMode) {
    await setupContainer();
  }

  useContainer(Container);

  const routerControllers: RoutingControllersOptions = {
    controllers: [join(__dirname, '**', '*.js')],
    middlewares: [json()],
    validation: false,
  };

  useExpressServer(app, routerControllers);

  if (!testMode) {
    httpServer.listen(PORT, () => {
      console.log(`Application listening on ${PORT}`);
    });
  }

  return app;
}
