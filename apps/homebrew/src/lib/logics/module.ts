import { Module } from '@nestjs/common';
import { ILogic } from '@ota-internal/shared';
import { ILogics } from '../constants';

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
