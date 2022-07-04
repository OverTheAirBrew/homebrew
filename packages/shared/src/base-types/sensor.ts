import { ClassType } from '../class-type';
import { IPeripheral, Peripheral } from '../properties';
import { Property } from '../properties/base-property';

export interface ISensor<T> extends IPeripheral {
  run(sensor_id: string, params: T): Promise<number>;
}

export const ISensor = class Dummy {} as ClassType<ISensor<any>>;

export abstract class Sensor<T> extends Peripheral implements ISensor<T> {
  constructor(sensorName: string, public properties: Property[]) {
    super(`${sensorName}-sensor`, properties);
  }

  public async run(sensor_id: string, params: T) {
    return await this.process(params);
  }

  protected abstract process(params: T): Promise<number>;
}
