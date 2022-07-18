import { Injectable } from '@nestjs/common';

import { DS18B20Controller } from '@ota-internal/one-wire-sensor';
import {
  NumberProperty,
  SelectBoxProperty,
  Sensor,
} from '@ota-internal/shared';

export interface IOneWireParams {
  sensorAddress: string;
  offset: number;
}

@Injectable()
export class OneWireSensor extends Sensor<IOneWireParams> {
  constructor(private oneWireController: DS18B20Controller) {
    super('one-wire', [
      new SelectBoxProperty('sensorAddress', true, () => this.getSensors()),
      new NumberProperty('offset', false),
    ]);
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
