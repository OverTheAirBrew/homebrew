import {
  NumberProperty,
  SelectBoxProperty,
  Sensor,
} from '@overtheairbrew/homebrew-plugin';
import Container, { Service } from 'typedi';
import { IOneWireController } from './controllers';

export interface IOneWireParams {
  sensor_id: string;
  sensorAddress: string;
  offset: number;
}

@Service({ id: 'sensor', multiple: true })
export class OneWireSensor extends Sensor {
  private oneWireController: IOneWireController;

  constructor() {
    super('one-wire', [
      new SelectBoxProperty('one-wire.sensorAddress', undefined, true, () =>
        this.getSensors(),
      ),
      new NumberProperty('one-wire.offset', false),
    ]);

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

  public async run(params: IOneWireParams) {
    if (!(await this.deviceExists(params.sensorAddress))) return null;

    const temperatureReading = await this.oneWireController.getCurrentValue(
      params.sensorAddress,
    );

    const offset = params.offset || 0;
    const tempWithOffset = temperatureReading.celcius + offset;

    return tempWithOffset;
  }
}
