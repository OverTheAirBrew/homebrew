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

import {
  registerController as registerListeners,
  useContainer as useListenerContainer,
  Queues,
} from '@overtheairbrew/in-memory-queue';

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

import { Logger, logger } from './lib/logger';
import { SequelizeWrapper } from './orm/sequelize-wrapper';

import { createServer, Server } from 'http';
import { SocketIo } from '@overtheairbrew/socket-io';
import * as cors from 'cors';

// import { sync } from 'glob';
import * as fg from 'fast-glob';

import { IPackageConfig } from '@overtheairbrew/homebrew-plugin';
import { SensorTypeService } from './lib/sensor-types';

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
  private readonly workersPath: string = join(
    __dirname,
    'workers',
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
    this.expressApp.use(cors());

    const httpServer = createServer(this.expressApp);
    const queues = new Queues();

    const ready = new Promise(async (resolve, reject) => {
      try {
        const pluginConfig = await this.loadPlugins();

        await this.setupContainer(
          options,
          httpServer,
          logger,
          queues,
          pluginConfig,
        );

        useContainer(Container);
        cronUseContainer(Container);
        useListenerContainer(Container);

        await this.runMigrations();

        const sensorTypesService = Container.get(SensorTypeService);
        Container.set(
          'sensorTypes',
          await sensorTypesService.getSensorTypeIds(),
        );

        registerController([this.hooksPath]);
        registerListeners([this.workersPath], queues);

        await this.loadAllServerControllers();

        await this.createDocs();

        if (require.resolve(UI_PACKAGE)) {
          const { initUi } = require(UI_PACKAGE);
          initUi(this.expressApp);
        }

        Container.get(SocketIo);

        resolve(undefined);
      } catch (err) {
        reject(err);
      }
    });

    ready.then(() => {
      logger.info(`server listening on ${this.options.port}`);
      httpServer.listen(this.options.port);
    });
  }

  private async loadPlugins() {
    const pluginConfiguration: IPackageConfig = {
      sensors: [],
      actors: [],
      logics: [],
    };

    const plugins = await fg(
      [
        'node_modules/@overtheairbrew/homebrew-plugin-**',
        'node_modules/ota-homebrew-plugin-**',
      ],
      {
        onlyDirectories: true,
      },
    );

    for (const plugin of plugins) {
      const pluginPath = plugin.replace('node_modules/', '');
      const pluginConfig: IPackageConfig = require(pluginPath).default;

      pluginConfiguration.sensors = pluginConfiguration.sensors.concat(
        pluginConfig.sensors || [],
      );

      pluginConfiguration.actors = pluginConfiguration.actors.concat(
        pluginConfig.actors || [],
      );

      pluginConfiguration.logics = pluginConfiguration.logics.concat(
        pluginConfig.logics || [],
      );
    }

    return pluginConfiguration;
  }

  private async setupContainer(
    options: IOptions,
    httpServer: Server,
    logger: Logger,
    queues: Queues,
    pluginConfiguration: IPackageConfig,
  ) {
    Container.set('socket.io_cors_origin', `*`);

    Container.set('databasePath', options.database.path);
    Container.set('http_instance', httpServer);
    Container.set(Logger, logger);
    Container.set(Queues, queues);

    Container.import([
      ...pluginConfiguration.sensors,
      ...pluginConfiguration.actors,
      ...pluginConfiguration.logics,
    ]);
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
    logger.info('Running migrations');

    const wrapper = Container.get(SequelizeWrapper);
    const migration = new ProgramaticMigate(wrapper.sequelize as any, logger);

    const ranMigrations = await migration.up();
    logger.info('Migrations finished', ranMigrations);
  }

  private async loadAllServerControllers() {
    useExpressServer(this.expressApp, this.routingControllersOptions);
  }
}
