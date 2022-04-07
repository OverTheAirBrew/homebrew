import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ActorTypesModule } from './app/actor-types/module';
import { ActorModule } from './app/actor/module';
import { SensorTypesModule } from './app/sensor-types/module';
import { SensorModule } from './app/sensor/module';
import { TelemetryModule } from './app/telemetry/module';
import { SensorReadingsModule } from './cron/sensor-readings/module';
import { PluginsModule } from './plugins';
import { SocketGateway } from './socket-gateway/gateway';
import { SensorReadingsToSocketModule } from './workers/sensor-readings-to-socket/module';
import { WorkerTelemetryModule } from './workers/telemetry/module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PluginsModule.register(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ActorTypesModule,
    ActorModule,
    SensorTypesModule,
    SensorModule,
    SensorReadingsModule,
    WorkerTelemetryModule,
    SocketGateway,
    SensorReadingsToSocketModule,
    TelemetryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
