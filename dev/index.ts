import { join } from 'path';
import { OtaHomebrewApp } from '../src/application';

Promise.resolve()
  .then(async () => {
    new OtaHomebrewApp({
      port: 9090,
      database: {
        path: join(__dirname, 'database.db'),
      },
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
