import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DS18B20Controller,
  IOneWireController,
  StreamController,
} from '@ota-internal/one-wire-sensor';
import { IActors, ILogics, ISensors } from '../lib/constants';
import { IActor } from '../lib/plugin/abstractions/actor';
import { ILogic } from '../lib/plugin/abstractions/logic';
import { ISensor } from '../lib/plugin/abstractions/sensor';
import { ClassType } from '../lib/plugin/class-type';
import { actors } from './actors';
import { logics } from './logic';
import { sensors } from './sensors';

export { actors } from './actors';
export { logics } from './logic';
export { sensors } from './sensors';

export interface IPlugins {
  actors: IActor<any>[];
  logics: any[];
  sensors: any[];
}

export const IPlugins = class Dummy {} as ClassType<IPlugins>;

@Global()
@Module({
  providers: [ConfigService],
})
export class PluginsModule {
  public static async register(): Promise<DynamicModule> {
    const allActors = [...actors];
    const allLogics = [...logics];
    const allSensors = [...sensors];

    return {
      module: PluginsModule,
      providers: [
        {
          provide: IOneWireController,
          useFactory: (config: ConfigService) => {
            if (config.get('NODE_ENV') === 'development') {
              return new StreamController(true, [
                {
                  address: 'ABCD',
                  expectedValues: [1, 2, 3, 4, 5, 6, 7],
                },
              ]);
            }

            return new DS18B20Controller();
          },
          inject: [ConfigService],
        },
        ...allActors,
        ...allLogics,
        ...allSensors,
        {
          provide: IActors,
          useFactory: (...actors: IActor<any>[]) => {
            return actors;
          },
          inject: allActors,
        },
        {
          provide: ISensors,
          useFactory: (...sensors: ISensor<any>[]) => {
            return sensors;
          },
          inject: allSensors,
        },
        {
          provide: ILogics,
          useFactory: (...logics: ILogic<any>[]) => {
            return logics;
          },
          inject: allLogics,
        },
      ],
      exports: [IActors, ISensors, ILogics],
    };
  }
}
