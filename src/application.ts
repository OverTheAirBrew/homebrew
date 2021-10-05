import { IPackageConfig } from '@overtheairbrew/homebrew-plugin';
import {
  Queues,
  registerController as registerListeners,
  useContainer as useListenerContainer,
} from '@overtheairbrew/node-typedi-in-memory-queue';
import { SocketIo } from '@overtheairbrew/socket-io';
import { json } from 'body-parser';
import { defaultMetadataSrotage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as cors from 'cors';
import {
  registerController,
  useContainer as cronUseContainer,
} from 'cron-typedi-decorators';
import * as express from 'express';
// import { sync } from 'glob';
import * as fg from 'fast-glob';
import { createServer, Server } from 'http';
import { join } from 'path';
import * as version from 'project-version';
import 'reflect-metadata';
import {
  getMetadataArgsStorage,
  useContainer,
  useExpressServer,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import 'source-map-support/register';
import { EventEmitter } from 'stream';
import { serve, setup } from 'swagger-ui-express';
import { Container } from 'typedi';
import { OtaContainer } from './lib/utils/container';
import { logger } from './lib/utils/logger';
import { ProgramaticMigate } from './orm/programatic-migrate';
import { DatabaseOptions, SequelizeWrapper } from './orm/sequelize-wrapper';

require('express-async-errors');

interface IOptions {
  port: number;
  database: DatabaseOptions;
  pluginPatterns?:
    | string[]
    | [
        'node_modules/@overtheairbrew/homebrew-plugin-**',
        'node_modules/ota-homebrew-plugin-**',
      ];
  cwd?: string;
}

const UI_PACKAGE = '@overtheairbrew/homebrew-ui';

export class OtaHomebrewApp extends EventEmitter {
  protected disableMigrations: boolean = false;
  public isListening: boolean = false;

  private paths: { hooks: string; controllers: string; workers: string } = {
    hooks: '',
    controllers: '',
    workers: '',
  };

  protected readonly expressApp: express.Express;

  private routingControllersOptions: {
    controllers: string[];
    routePrefix: string;
    middleware: any[];
  };

  private pluginConfiguration: IPackageConfig = {
    sensors: [],
    actors: [],
    logics: [],
  };

  constructor(private options: IOptions) {
    super();

    this.expressApp = express();
    this.expressApp.use(cors());

    this.paths['controllers'] = join(
      this.options.cwd || __dirname,
      'controllers',
      '**',
      '*.js',
    );

    this.paths['hooks'] = join(
      this.options.cwd || __dirname,
      'hooks',
      '**',
      '*.js',
    );

    this.paths['workers'] = join(
      this.options.cwd || __dirname,
      'workers',
      '**',
      '*.js',
    );

    this.routingControllersOptions = {
      controllers: [this.paths['controllers']],
      routePrefix: '/server',
      middleware: [json()],
    };

    const httpServer = createServer(this.expressApp);
    const queues = new Queues();

    const ready = new Promise(async (resolve, reject) => {
      try {
        await this.loadPlugins(this.options.pluginPatterns, this.options.cwd);

        await this.setupContainer(
          options,
          httpServer,
          queues,
          this.pluginConfiguration,
        );

        useContainer(Container);
        cronUseContainer(Container);
        useListenerContainer(Container);

        await this.runMigrations();

        registerController([this.paths['hooks']]);
        registerListeners([this.paths['workers']], queues);

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

      this.emit('application-started');
      this.isListening = true;
    });
  }

  private async loadPlugins(patterns: string[], cwd: string) {
    const plugins = await fg(patterns, {
      onlyDirectories: true,
      cwd,
    });

    for (const plugin of plugins) {
      const pluginPath = plugin.replace('node_modules/', '');
      const pluginConfig: IPackageConfig = require(pluginPath).default;

      this.pluginConfiguration.sensors =
        this.pluginConfiguration.sensors.concat(pluginConfig.sensors || []);

      this.pluginConfiguration.actors = this.pluginConfiguration.actors.concat(
        pluginConfig.actors || [],
      );

      this.pluginConfiguration.logics = this.pluginConfiguration.logics.concat(
        pluginConfig.logics || [],
      );
    }
  }

  private async setupContainer(
    options: IOptions,
    httpServer: Server,
    queues: Queues,
    pluginConfiguration: IPackageConfig,
  ) {
    await OtaContainer.setupContainer(
      httpServer,
      options.database,
      queues,
      pluginConfiguration,
    );
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
    if (this.disableMigrations) return;

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
