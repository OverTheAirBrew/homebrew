import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LockModule, LockService } from '@s1seven/nestjs-tools-lock';
import { ActorController } from './app/actors';
import { DeviceTypesController } from './app/device-types';
import { DeviceController } from './app/devices';
import { KettleController } from './app/kettles';
import { LogicTypesController } from './app/logic-types';
import { SensorController } from './app/sensors';
import { SensorReadingsCronService } from './cron/sensor-readings';
import { StartupEvents } from './cron/startup';
import { DatabaseModule } from './database/module';
import { ServicesModule } from './lib/services/module';
import { SocketGatewayModule } from './socket-gateway/module';
import { KettleWorkingService } from './workers/kettle-working';
import { SensorReadingWorkerService } from './workers/sensor-reading';

export const controllersList = [
  ActorController,
  KettleController,
  LogicTypesController,
  SensorController,
  DeviceTypesController,
  DeviceController,
];

const cronList = [SensorReadingsCronService, StartupEvents];

const workersList = [SensorReadingWorkerService, KettleWorkingService];

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    LockModule.forRoot({}),
    DatabaseModule,
    SocketGatewayModule,
    ServicesModule,
  ],
  controllers: [...controllersList],
  providers: [...cronList, ...workersList, LockService],
})
export class AppModule {}
