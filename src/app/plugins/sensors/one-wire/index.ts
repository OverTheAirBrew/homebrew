import Container from 'typedi';
import { SensorService } from '../../../lib/plugin';
import { Sensor } from '../../../lib/plugin/abstractions/sensor';
import {
  NumberProperty,
  SelectBoxProperty,
} from '../../../lib/plugin/properties';
import { IOneWireController } from './controllers';

export interface IOneWireParams {
  sensorAddress: string;
  offset: number;
}

const localizations = {
  en: {
    'sensor-address': 'Sensor Address',
    offset: 'Offset',
  },
  fr: {
    'sensor-address': 'Adresse du capteur',
    offset: 'Décalage',
  },
};

@SensorService()
export class OneWireSensor extends Sensor<IOneWireParams> {
  private oneWireController: IOneWireController;

  constructor() {
    super(
      'one-wire',
      [
        new SelectBoxProperty('sensor-address', true, () => this.getSensors()),
        new NumberProperty('offset', false),
      ],
      localizations,
    );

    this.oneWireController = Container.get(IOneWireController);
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
    if (!(await this.deviceExists(params.sensorAddress))) return null;

    const temperatureReading = await this.oneWireController.getCurrentValue(
      params.sensorAddress,
    );

    const offset = params.offset || 0;
    const tempWithOffset = temperatureReading.celcius + offset;

    return tempWithOffset;
  }
}
