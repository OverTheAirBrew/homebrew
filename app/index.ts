// require('source-map-support/register');

import { join } from 'path';
import { OtaHomebrewApp } from '../package/application';

const app = new OtaHomebrewApp({
  port: 9000,
  database: { path: join(__dirname, 'ota.db') },
});
