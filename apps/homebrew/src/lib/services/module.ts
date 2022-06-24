import { Module } from '@nestjs/common';
import { Actor } from '../../database/models/actor';
import { Kettle } from '../../database/models/kettle';
import { Sensor } from '../../database/models/sensor';
import { Telemetry } from '../../database/models/telemetry';
import {
  ActorRepository,
  KettleRepository,
  SensorRepository,
  TelemetryRepository,
} from '../constants';
import { PropertyMapper } from '../property-mapper';
import { ValidActor } from '../validation/valid-actor';
import { ValidActorType } from '../validation/valid-actor-type';
import { ValidLogicType } from '../validation/valid-logic-type';
import { ValidSensor } from '../validation/valid-sensor';
import { ValidSensorType } from '../validation/valid-sensor-type';
import { ValidActorConfig } from '../validation/validate-actor-config';
import { ValidLogicConfig } from '../validation/validate-logic-config';
import { ValidSensorConfig } from '../validation/validate-sensor-config';
import { ActorTypesService } from './actor-types/service';
import { ActorService } from './actor/service';
import { KettleService } from './kettle/service';
import { LogicTypesService } from './logic-types/service';
import { SensorTypesService } from './sensor-types/service';
import { SensorService } from './sensor/service';
import { TelemetryService } from './telemetry/service';
import { TranslationsService } from './translations/service';

@Module({
  providers: [
    ActorService,
    ValidActorType,
    ValidActorConfig,
    {
      provide: ActorRepository,
      useValue: Actor,
    },
    ActorTypesService,
    PropertyMapper,
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
    SensorTypesService,
    TelemetryService,
    {
      provide: TelemetryRepository,
      useValue: Telemetry,
    },
    TranslationsService,
  ],
  exports: [
    ActorService,
    ActorTypesService,
    KettleService,
    LogicTypesService,
    SensorService,
    SensorTypesService,
    TelemetryService,
    TranslationsService,
  ],
})
export class ServicesModule {}
