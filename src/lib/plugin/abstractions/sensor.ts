import { ClassType } from '../class-type';
import {
  IPeripheral,
  Peripheral,
  PeripheralLocalizations,
  Property,
} from '../properties';

export interface ISensor<T> extends IPeripheral {
  run(sensor_id: string, params: T): Promise<number>;
}

export const ISensor = class Dummy {} as ClassType<ISensor<any>>;

export abstract class Sensor<T> extends Peripheral implements ISensor<T> {
  constructor(
    sensorName: string,
    public properties: Property[],
    public localizations: PeripheralLocalizations,
  ) {
    super(`${sensorName}-sensor`, properties, localizations);
  }

  public async run(sensor_id: string, params: T) {
    return await this.process(params);
  }

  protected abstract process(params: T): Promise<number>;
}
