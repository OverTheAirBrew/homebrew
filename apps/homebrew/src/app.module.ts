import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ActorTypesModule } from './app/actor-types/module';
import { ActorModule } from './app/actor/module';
import { KettleModule } from './app/kettle/module';
import { LogicTypesModule } from './app/logic-types/module';
import { SensorTypesModule } from './app/sensor-types/module';
import { SensorModule } from './app/sensor/module';
import { TelemetryModule } from './app/telemetry/module';
import { TranslationsModule } from './app/translations/module';
import { CronModule } from './cron/module';
import { PluginsModule } from './plugins';
import { SocketGateway } from './socket-gateway/gateway';
import { WorkersModule } from './workers/workers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PluginsModule.register(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ActorTypesModule,
    ActorModule,
    SensorTypesModule,
    LogicTypesModule,
    KettleModule,
    SensorModule,
    SocketGateway,
    TelemetryModule,
    WorkersModule,
    CronModule,
    TranslationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
