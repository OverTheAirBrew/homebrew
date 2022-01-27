import {
  Queues,
  registerController as registerWorkers,
  useContainer as workerUseContainer,
} from '@overtheairbrew/node-typedi-in-memory-queue';
import {
  registerController as registerHooks,
  useContainer as cronUseContainer,
} from 'cron-typedi-decorators';
import { join } from 'path';
import { useContainer as httpUseContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { setupContainer } from './container';
import { startServer } from './controllers';
import { startDatabaseConnection } from './orm/config';

(async () => {
  await startDatabaseConnection();
  await setupContainer();

  cronUseContainer(Container);
  workerUseContainer(Container);
  httpUseContainer(Container);

  await startServer();

  registerHooks([join(__dirname, 'hooks', '**', '*.js')]);
  registerWorkers(
    [join(__dirname, 'workers', '**', '*.js')],
    Container.get(Queues),
  );
})();
