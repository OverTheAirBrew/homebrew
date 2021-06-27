import { join } from 'path';
import {
  useExpressServer,
  useContainer,
  getMetadataArgsStorage,
} from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import 'reflect-metadata';
require('express-async-errors');
import * as express from 'express';
import { Container } from 'typedi';
import { json } from 'body-parser';
import { routingControllersToSpec } from 'routing-controllers-openapi';
const { defaultMetadataSrotage } = require('class-transformer/cjs/storage');
import { serve, setup } from 'swagger-ui-express';

import * as version from 'project-version';
import { ProgramaticMigate } from './orm/programatic-migrate';

import { Sequelize } from 'sequelize-typescript';
import { BASE_CONFIG } from './orm/config';

import { logger } from './lib/logger';

interface IOptions {
  port: number;
  database: {
    path: string;
  };
}

export class OtaHomebrewApp {
  public static sequelize: Sequelize = undefined;

  private readonly baseControllerPath: string = join(
    __dirname,
    'controllers',
    '**',
    '*.js',
  );

  public readonly expressApp: express.Express;

  private routingControllersOptions = {
    controllers: [this.baseControllerPath],
    routePrefix: '/server',
    middleware: [json()],
  };

  constructor(private options: IOptions) {
    this.expressApp = express();

    const ready = new Promise(async (resolve, reject) => {
      try {
        useContainer(Container);

        await this.runMigrations();
        await this.loadAllServerControllers();

        await this.createDocs();

        resolve(undefined);
      } catch (err) {
        reject(err);
      }
    });

    ready.then(() => {
      logger.info(`server listening on ${this.options.port}`);
      this.expressApp.listen(this.options.port);
    });
  }

  private async createDocs() {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataSrotage,
      refPointerPrefix: '#/components/schemas/',
    });

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(
      storage,
      this.routingControllersOptions,
      {
        components: {
          schemas,
        },
        info: {
          description: 'Api docs for this open source project',
          title: 'OverTheAir Homebrew',
          version,
        },
      },
    );

    this.expressApp.use('/docs', serve, setup(spec));
  }

  private async runMigrations() {
    OtaHomebrewApp.sequelize = new Sequelize({
      ...BASE_CONFIG,
      storage: this.options.database.path,
      models: [join(__dirname, 'orm', 'models', '**/*.js')],
    });

    const migration = new ProgramaticMigate(OtaHomebrewApp.sequelize, logger);

    await migration.up();
  }

  private async loadAllServerControllers() {
    useExpressServer(this.expressApp, this.routingControllersOptions);
  }
}
