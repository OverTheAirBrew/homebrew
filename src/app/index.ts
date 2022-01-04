import { setupContainer } from './container';
import { startServer } from './controllers';
import { startHooks } from './hooks';
import { startDatabaseConnection } from './orm/config';
import { startWorkers } from './workers';

(async () => {
  await startDatabaseConnection();

  await setupContainer();

  await startServer();
  await startHooks();
  await startWorkers();
})();
