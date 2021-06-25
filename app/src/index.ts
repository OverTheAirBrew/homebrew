require('source-map-support/register');

import { join } from 'path';

import { OtaHomebrewApp } from '@overtheairbrew/homebrew';

const app = new OtaHomebrewApp({
  port: 9000,
  database: { path: join(__dirname, 'ota.db') },
});
