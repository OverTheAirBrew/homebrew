import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DS18B20Controller,
  IOneWireController,
  StreamController,
} from '@ota-internal/one-wire-sensor';
import { LocalDevice } from '.';
import { IActors, ISensors } from '../../constants';
import { Actor } from '../../plugin/abstractions/actor';
import { Sensor } from '../../plugin/abstractions/sensor';
import { PropertyMapper } from '../../property-mapper';

import { GpioActor } from './actors/gpio';
import { OneWireSensor } from './sensors/one-wire';

const Actors = [GpioActor];

const Sensors = [OneWireSensor];

@Module({
  providers: [
    ConfigService,
    {
      provide: IOneWireController,
      useFactory: (config: ConfigService) => {
        if (
          config.get('NODE_ENV') === 'development' ||
          config.get('CI') == 'true'
        ) {
          return new StreamController(true, [
            {
              address: 'ABCD',
              expectedValues: [1, 2, 3, 4, 5, 6, 7],
            },
          ]);
        }

        return new DS18B20Controller();
      },
      inject: [ConfigService],
    },
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
