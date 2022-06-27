import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IActors, ILogics, ISensors } from '../lib/constants';
import { IActor } from '../lib/plugin/abstractions/actor';
import { ILogic } from '../lib/plugin/abstractions/logic';
import { ClassType } from '../lib/plugin/class-type';
import { logics } from './logic';
export { logics } from './logic';

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
    const allLogics = [...logics];

    return {
      module: PluginsModule,
      providers: [
        ...allLogics,
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
