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
              expectedValues: [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
                35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
                51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
                67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
                83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98,
                99, 100,
              ],
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
