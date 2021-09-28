import { join } from 'path';
import { OtaHomebrewApp } from '../../../src/application';

export class TestApplication extends OtaHomebrewApp {
  public readonly server: Express.Application;

  constructor() {
    super({
      database: {
        dialect: 'mysql',
        url: process.env.DB_URL || 'mysql://root:@localhost/homebrew',
      },
      port: 9090,
      pluginPatterns: ['../test/testing-plugin'],
      cwd: join(__dirname, '..', '..', '..', 'src'),
    });

    this.disableMigrations = true;
    this.server = this.expressApp;
  }
}

export const application = new TestApplication();

export async function applicationReady() {
  return await new Promise((resolve) => {
    if (application.isListening) resolve(undefined);

    application.on('application-started', () => {
      resolve(undefined);
    });
  });
}
