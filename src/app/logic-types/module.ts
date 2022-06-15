import { Module } from '@nestjs/common';
import { PropertyMapper } from '../../lib/property-mapper';
import { LogicTypesController } from './controller';
import { LogicTypesService } from './service';

@Module({
  providers: [LogicTypesService, PropertyMapper],
  controllers: [LogicTypesController],
  exports: [LogicTypesService],
})
export class LogicTypesModule {}
