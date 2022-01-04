import { json } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import {
  RoutingControllersOptions,
  useContainer,
  useExpressServer,
} from 'routing-controllers';
import { Container } from 'typedi';

const PORT = parseInt(process.env.PORT) || 9090;

export async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  app.use(cors());

  useContainer(Container);

  const routerControllers: RoutingControllersOptions = {
    controllers: [join(__dirname, '**', '*.js')],
    routePrefix: '/api',
    middlewares: [json()],
  };

  useExpressServer(app, routerControllers);

  httpServer.listen(PORT, () => {
    console.log(`Application listening on ${PORT}`);
  });
}
