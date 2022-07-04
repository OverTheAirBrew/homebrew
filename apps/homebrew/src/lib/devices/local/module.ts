import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DS18B20Controller } from '@ota-internal/one-wire-sensor';
import { Actor, Sensor } from '@ota-internal/shared';
import { LocalDevice } from '.';
import { IActors, ISensors } from '../../constants';
import { PropertyMapper } from '../../property-mapper';
import { DummyActor } from './actors/dummy';

import { GpioActor } from './actors/gpio';
import { DummySensor } from './sensors/dummy';
import { OneWireSensor } from './sensors/one-wire';

const Actors = [GpioActor, DummyActor];

const Sensors = [OneWireSensor, DummySensor];

@Module({
  providers: [
    ConfigService,
    DS18B20Controller,
    ...Actors,
    ...Sensors,
    {
      provide: IActors,
      useFactory: (...actors: Actor<any>[]) => {
        return actors;
      },
      inject: [...Actors],
    },
    {
      provide: ISensors,
      useFactory: (...sensors: Sensor<any>[]) => {
        return sensors;
      },
      inject: [...Sensors],
    },
    LocalDevice,
    PropertyMapper,
  ],
  exports: [LocalDevice],
  imports: [],
})
export class LocalDeviceModule {}
