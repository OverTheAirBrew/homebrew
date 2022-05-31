import { Module } from '@nestjs/common';
import { SensorTypesModule } from '../app/sensor-types/module';
import { SensorModule } from '../app/sensor/module';
import { SensorReadingsService } from './sensor-readings/service';

@Module({
  providers: [SensorReadingsService],
  imports: [SensorTypesModule, SensorModule],
})
export class CronModule {}