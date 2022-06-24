import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ActorTypesController } from './app/actor-types';
import { ActorController } from './app/actors';
import { KettleController } from './app/kettles';
import { LogicTypesController } from './app/logic-types';
import { SensorTypesController } from './app/sensor-types';
import { SensorController } from './app/sensors';
import { TranslationsController } from './app/translations';
import { SensorReadingsCronService } from './cron/sensor-readings';
import { ServicesModule } from './lib/services/module';
import { PluginsModule } from './plugins';
import { SocketGateway } from './socket-gateway/gateway';
import { SensorReadingWorkerService } from './workers/sensor-reading';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PluginsModule.register(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    SocketGateway,
    ServicesModule,

    SensorReadingWorkerService,
    SensorReadingsCronService,
  ],
  controllers: [
    ActorTypesController,
    ActorController,
    KettleController,
    LogicTypesController,
    SensorTypesController,
    SensorController,
    TranslationsController,
  ],
  providers: [],
})
export class AppModule {}
