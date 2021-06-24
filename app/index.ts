import { join } from 'path';
import { useExpressServer, useContainer } from 'routing-controllers';
import 'reflect-metadata';
require('express-async-errors');
import { exec } from 'child_process';
import * as express from 'express';
import { Container } from 'typedi';
import { json } from 'body-parser';

interface IOptions {
  port: number;
}

export class OtaHomebrewApp {
  private readonly baseControllerPath: string = join(
    __dirname,
    'controllers',
    '**',
    '*.js',
  );

  public readonly expressApp: express.Express;

  constructor(private options: IOptions) {
    this.expressApp = express();

    const ready = new Promise(async (resolve, reject) => {
      try {
        useContainer(Container);

        await this.runMigrations();
        await this.loadAllServerControllers();

        resolve(undefined);
      } catch (err) {
        reject(err);
      }
    });

    ready.then(() => {
      this.expressApp.listen(this.options.port);
    });
  }

  private async runMigrations() {
    await new Promise((resolve, reject) => {
      const migrate = exec(
        'node_modules/sequelize-cli/lib/sequelize db:migrate',
        { env: process.env },
        (err) => (err ? reject(err) : resolve(undefined)),
      );

      // Forward stdout+stderr to this process
      migrate.stdout.pipe(process.stdout);
      migrate.stderr.pipe(process.stderr);
    });
  }

  private async loadAllServerControllers() {
    useExpressServer(this.expressApp, {
      routePrefix: '/server',
      controllers: [this.baseControllerPath],
      middlewares: [json()],
    });
  }
}

require('source-map-support/register');

const app = new OtaHomebrewApp({
  port: 8081,
});
