import { join } from 'path';
import { OtaHomebrewApp } from '../src/application';

new OtaHomebrewApp({
  database: {
    dialect: 'sqlite',
    storage: join(__dirname, 'database.db'),
  },
  port: 9000,
});

setTimeout(() => {
  process.exit(0);
}, 20000);
