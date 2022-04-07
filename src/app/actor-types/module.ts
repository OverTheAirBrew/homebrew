import { Module } from '@nestjs/common';
import { PropertyMapper } from 'src/lib/property-mapper';
import { ActorTypesController } from './controller';
import { ActorTypesService } from './service';

@Module({
  imports: [],
  providers: [ActorTypesService, PropertyMapper],
  controllers: [ActorTypesController],
  exports: [ActorTypesService],
})
export class ActorTypesModule {}
