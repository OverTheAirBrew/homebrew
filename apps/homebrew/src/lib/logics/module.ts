import { Module } from '@nestjs/common';
import { ILogics } from '../constants';
import { ILogic } from '../plugin/abstractions/logic';
import { PidLogic } from './pid';

const Logics = [PidLogic];

@Module({
  providers: [
    {
      provide: ILogics,
      useFactory: (...logics: ILogic<any>[]) => {
        return logics;
      },
      inject: [...Logics],
    },
    ...Logics,
  ],
  exports: [ILogics],
})
export class LogicModule {}
