import { Module } from '@nestjs/common';
import { Kettle } from '../../database/models/kettle';
import { KettleRepository } from '../../lib/constants';
import { ValidActor } from '../../lib/validation/valid-actor';
import { ValidLogicType } from '../../lib/validation/valid-logic-type';
import { ValidSensor } from '../../lib/validation/valid-sensor';
import { ValidLogicConfig } from '../../lib/validation/validate-logic-config';
import { ActorModule } from '../actor/module';
import { LogicTypesModule } from '../logic-types/module';
import { SensorModule } from '../sensor/module';
import { KettleController } from './controller';
import { KettleService } from './service';

@Module({
  imports: [ActorModule, SensorModule, LogicTypesModule],
  providers: [
    KettleService,
    ValidSensor,
    ValidActor,
    ValidLogicConfig,
    ValidLogicType,
    {
      provide: KettleRepository,
      useValue: Kettle,
    },
  ],
  controllers: [KettleController],
})
export class KettleModule {}
