import { json } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { createServer } from 'http';
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
  const app = express();
  const httpServer = createServer(app);

  app.use(cors());

  if (testMode) {
    await setupContainer();
  }

  useContainer(Container);

  const routerControllers: RoutingControllersOptions = {
    controllers: [join(__dirname, '**', '*.js')],
    middlewares: [json()],
  };

  useExpressServer(app, routerControllers);

  if (!testMode) {
    httpServer.listen(PORT, () => {
      console.log(`Application listening on ${PORT}`);
    });
  }

  return app;
}
