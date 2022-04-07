import { Module } from '@nestjs/common';
import Sensor from '../../database/models/sensor';
import { DatabaseModule } from '../../database/module';
import { SensorRepository } from '../../lib/constants';
import { ValidSensorType } from '../../lib/validation/valid-sensor-type';
import { ValidSensorConfig } from '../../lib/validation/validate-sensor-config';
import { SensorTypesModule } from '../sensor-types/module';
import { SensorController } from './controller';
import { SensorService } from './service';

@Module({
  imports: [SensorTypesModule, DatabaseModule],
  providers: [
    SensorService,
    ValidSensorType,
    ValidSensorConfig,
    {
      provide: SensorRepository,
      useValue: Sensor,
    },
  ],
  exports: [SensorService],
  controllers: [SensorController],
})
export class SensorModule {}
