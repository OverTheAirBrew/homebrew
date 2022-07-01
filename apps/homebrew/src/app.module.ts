import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LockModule, LockService } from '@s1seven/nestjs-tools-lock';
import { ActorController } from './app/controllers/actors';
import { DeviceTypesController } from './app/controllers/device-types';
import { DeviceController } from './app/controllers/devices';
import { KettleController } from './app/controllers/kettles';
import { LogicTypesController } from './app/controllers/logic-types';
import { SensorController } from './app/controllers/sensors';
import { SensorReadingsCronService } from './app/cron/sensor-readings';
import { StartupEvents } from './app/cron/startup';
import { KettleWorkingService } from './app/workers/kettle-working';
import { SensorReadingWorkerService } from './app/workers/sensor-reading';
import { DatabaseModule } from './database/module';
import { ServicesModule } from './lib/services/module';
import { SocketGatewayModule } from './socket-gateway/module';

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
