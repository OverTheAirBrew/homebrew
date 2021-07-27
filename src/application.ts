import { join } from 'path';

import {
  useExpressServer,
  useContainer,
  getMetadataArgsStorage,
} from 'routing-controllers';

import {
  useContainer as cronUseContainer,
  registerController,
} from 'cron-typedi-decorators';

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import 'reflect-metadata';
require('express-async-errors');
import * as express from 'express';
import { Container } from 'typedi';
import { json } from 'body-parser';
import { routingControllersToSpec } from 'routing-controllers-openapi';

import { defaultMetadataSrotage } from 'class-transformer/cjs/storage';
import { serve, setup } from 'swagger-ui-express';

import * as version from 'project-version';
import { ProgramaticMigate } from './orm/programatic-migrate';

import { logger } from './lib/logger';
import { SequelizeWrapper } from './orm/sequelize-wrapper';

interface IOptions {
  port: number;
  database: {
    path: string;
  };
}

const UI_PACKAGE = '@overtheairbrew/homebrew-ui';

export class OtaHomebrewApp {
  private readonly baseControllerPath: string = join(
    __dirname,
    'controllers',
    '**',
    '*.js',
  );

  private readonly hooksPath: string = join(__dirname, 'hooks', '**', '*.js');

  public readonly expressApp: express.Express;

  private routingControllersOptions = {
    controllers: [this.baseControllerPath],
    routePrefix: '/server',
    middleware: [json()],
  };

  constructor(private options: IOptions) {
    this.expressApp = express();

    Container.set('databasePath', this.options.database.path);

    const ready = new Promise(async (resolve, reject) => {
      try {
        useContainer(Container);
        cronUseContainer(Container);

        registerController([this.hooksPath]);

        await this.runMigrations();
        await this.loadAllServerControllers();

        await this.createDocs();

        if (require.resolve(UI_PACKAGE)) {
          const { initUi } = require(UI_PACKAGE);
          initUi(this.expressApp);
        }

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
    const wrapper = Container.get(SequelizeWrapper);
    const migration = new ProgramaticMigate(wrapper.sequelize as any, logger);

    await migration.up();
  }

  private async loadAllServerControllers() {
    useExpressServer(this.expressApp, this.routingControllersOptions);
  }
}
