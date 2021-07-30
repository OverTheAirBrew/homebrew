import { Container } from 'typedi';
import { Sensor } from '../../base-classes/sensor';
import { OneWireFactory } from '@overtheairbrew/raspberrypi-one-wire';

export interface IOneWireParams {
  sensor_id: string;
  sensorAddress: string;
}

export class OneWireSensor extends Sensor {
  private readonly factory: OneWireFactory;

  constructor(private params: IOneWireParams) {
    super();
    this.factory = Container.get<OneWireFactory>(OneWireFactory);
  }

  public async run(): Promise<number> {
    const device = await this.factory.fromDevice(this.params.sensorAddress);
    const tempReading = await device.current();
    await this.dataRecieved(this.params.sensor_id, tempReading.celcius);
    return tempReading.celcius;
  }
}
