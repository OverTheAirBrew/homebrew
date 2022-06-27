import { Injectable } from '@nestjs/common';

import { IOneWireController } from '@ota-internal/one-wire-sensor';
import { Sensor } from '../../../../plugin/abstractions/sensor';
import {
  NumberProperty,
  SelectBoxProperty,
} from '../../../../plugin/properties';

export interface IOneWireParams {
  sensorAddress: string;
  offset: number;
}

@Injectable()
export class OneWireSensor extends Sensor<IOneWireParams> {
  constructor(private oneWireController: IOneWireController) {
    super(
      'one-wire',
      [
        new SelectBoxProperty('sensorAddress', true, () => this.getSensors()),
        new NumberProperty('offset', false),
      ],
      {
        en: {
          sensorAddress: 'Sensor address',
          offset: 'Offset',
        },
      },
    );
  }

  private async deviceExists(address: string) {
    const devices = await this.oneWireController.findDevices();
    return devices.includes(address);
  }

  private async getSensors() {
    const sensors = await this.oneWireController.findDevices();
    return sensors;
  }

  protected async process(params: IOneWireParams) {
    const sensorAddress = params.sensorAddress;

    if (!(await this.deviceExists(sensorAddress))) return null;

    const temperatureReading = await this.oneWireController.getCurrentValue(
      params.sensorAddress,
    );

    const offset = params.offset || 0;
    const tempWithOffset = temperatureReading.celcius + offset;

    return tempWithOffset;
  }
}
