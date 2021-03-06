import { Module } from '@nestjs/common';
import { Actor } from '../../database/models/actor';
import { Device } from '../../database/models/device';
import { Kettle } from '../../database/models/kettle';
import { Sensor } from '../../database/models/sensor';
import { Telemetry } from '../../database/models/telemetry';
import {
  ActorRepository,
  DeviceRepository,
  KettleRepository,
  SensorRepository,
  TelemetryRepository,
} from '../constants';
import { DeviceModule } from '../devices/module';
import { LogicModule } from '../logics/module';
import { PropertyMapper } from '../property-mapper';
import { ValidActor } from '../validation/valid-actor';
import { ValidActorType } from '../validation/valid-actor-type';
import { ValidDevice } from '../validation/valid-device';
import { ValidLogicType } from '../validation/valid-logic-type';
import { ValidSensor } from '../validation/valid-sensor';
import { ValidSensorType } from '../validation/valid-sensor-type';
import { ValidActorConfig } from '../validation/validate-actor-config';
import { ValidLogicConfig } from '../validation/validate-logic-config';
import { ValidSensorConfig } from '../validation/validate-sensor-config';
import { ActorTypesService } from './actor-types/service';
import { ActorService } from './actor/service';
import { DeviceTypesService } from './device-types/service';
import { DeviceService } from './device/service';
import { KettleService } from './kettle/service';
import { LogicTypesService } from './logic-types/service';
import { ProcessService } from './process/service';
import { SensorTypesService } from './sensor-types/service';
import { SensorService } from './sensor/service';
import { TelemetryService } from './telemetry/service';

@Module({
  providers: [
    ActorService,
    ValidActorType,
    ValidActorConfig,
    {
      provide: ActorRepository,
      useValue: Actor,
    },
    KettleService,
    ValidSensor,
    ValidActor,
    ValidLogicConfig,
    ValidLogicType,
    {
      provide: KettleRepository,
      useValue: Kettle,
    },
    LogicTypesService,
    SensorService,
    ValidSensorType,
    ValidSensorConfig,
    {
      provide: SensorRepository,
      useValue: Sensor,
    },
    TelemetryService,
    {
      provide: TelemetryRepository,
      useValue: Telemetry,
    },

    DeviceTypesService,
    {
      provide: DeviceRepository,
      useValue: Device,
    },
    ValidDevice,
    DeviceService,
    PropertyMapper,
    SensorTypesService,
    ActorTypesService,
    ProcessService,
  ],
  imports: [DeviceModule, LogicModule],
  exports: [
    ActorService,
    KettleService,
    LogicTypesService,
    SensorService,
    TelemetryService,
    DeviceTypesService,
    DeviceService,
    SensorTypesService,
    ActorTypesService,
    ProcessService,
  ],
})
export class ServicesModule {}
