import { Peripheral, PeripheralLocalizations, Property } from '../properties';

export abstract class Sensor<T> extends Peripheral {
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
