import { Module } from '@nestjs/common';
import { Actor } from '../../database/models/actor';
import { DatabaseModule } from '../../database/module';
import { ActorRepository } from '../../lib/constants';
import { ValidActorType } from '../../lib/validation/valid-actor-type';
import { ValidActorConfig } from '../../lib/validation/validate-actor-config';
import { ActorTypesModule } from '../actor-types/module';
import { ActorController } from './controller';
import { ActorService } from './service';

@Module({
  imports: [ActorTypesModule, DatabaseModule],
  providers: [
    ActorService,
    ValidActorType,
    ValidActorConfig,
    {
      provide: ActorRepository,
      useValue: Actor,
    },
  ],
  controllers: [ActorController],
})
export class ActorModule {}
