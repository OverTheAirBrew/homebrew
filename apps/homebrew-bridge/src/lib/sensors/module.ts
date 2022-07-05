import { Module } from '@nestjs/common';
import { DS18B20Controller } from '@ota-internal/one-wire-sensor/dist';
import { ISensor } from '@ota-internal/shared';
import { ISensors } from '../constants';
import { OneWireSensor } from './one-wire';
import { SensorService } from './service';

const Sensors = [OneWireSensor];

@Module({
  providers: [
    ...Sensors,
    DS18B20Controller,
    {
      provide: ISensors,
      useFactory: (...sensors: ISensor<any>[]) => {
        return sensors;
      },
      inject: [...Sensors],
    },
    SensorService,
  ],
  exports: [SensorService],
})
export class SensorModule {}
