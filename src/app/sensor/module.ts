import { Module } from '@nestjs/common';
import Sensor from '../../database/models/sensor';
import { DatabaseModule } from '../../database/module';
import { SensorRepository } from '../../lib/constants';
import { ValidSensorType } from '../../lib/validation/valid-sensor-type';
import { SensorTypesModule } from '../sensor-types/module';
import { SensorService } from './service';

@Module({
  imports: [SensorTypesModule, DatabaseModule],
  providers: [
    SensorService,
    ValidSensorType,
    {
      provide: SensorRepository,
      useValue: Sensor,
    },
  ],
})
export class SensorModule {}
