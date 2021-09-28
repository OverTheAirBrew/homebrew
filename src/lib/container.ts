import {
  ILogger,
  IMessagingManager,
  IPackageConfig,
} from '@overtheairbrew/homebrew-plugin';
import { Queues } from '@overtheairbrew/node-typedi-in-memory-queue';
import { Server } from 'http';
import Container from 'typedi';
import { DatabaseOptions } from '../orm/sequelize-wrapper';
import { Logger } from './logger';
import { MessagingManager } from './messaging-manager';
import { SensorTypeService } from './sensor-types';

export class OtaContainer {
  constructor() {}

  public static async setupContainer(
    httpServer: Server,
    database: DatabaseOptions,
    queues: Queues,
    pluginConfig: IPackageConfig,
  ) {
    Container.set('socket.io_cors_origin', `*`);

    Container.set('databaseOptions', database);
    Container.set('loggingOptions', {
      level: 'error',
      serviceName: 'homebrew',
      node_env: process.env.NODE_ENV || 'development',
    });

    Container.set('http_instance', httpServer);
    Container.set(Queues, queues);

    Container.set(IMessagingManager, Container.get(MessagingManager));
    Container.set(ILogger, Container.get(Logger));

    Container.import([
      ...pluginConfig.sensors,
      ...pluginConfig.actors,
      ...pluginConfig.logics,
    ]);

    const sensorTypesService = Container.get(SensorTypeService);
    Container.set('sensorTypes', await sensorTypesService.getSensorTypeIds());
  }
}
