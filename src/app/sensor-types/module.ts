import { Module } from '@nestjs/common';
import { PropertyMapper } from '../../lib/property-mapper';
import { SensorTypesController } from './controller';
import { SensorTypesService } from './service';

@Module({
  imports: [],
  providers: [SensorTypesService, PropertyMapper],
  controllers: [SensorTypesController],
})
export class SensorTypesModule {}
