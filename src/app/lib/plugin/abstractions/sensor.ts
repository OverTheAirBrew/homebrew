import Container from 'typedi';
import { SensorReading } from '../messages/events/sensor-reading';
import { Peripheral, PeripheralLocalizations, Property } from '../properties';
import { IMessagingManager } from './messaging-manager';

export abstract class Sensor<T> extends Peripheral {
  private messagingManager: IMessagingManager;

  constructor(
    sensorName: string,
    public properties: Property[],
    public localizations: PeripheralLocalizations,
  ) {
    super(`${sensorName}-sensor`, properties, localizations);
    this.messagingManager = Container.get(IMessagingManager);
  }

  public async run(sensor_id: string, params: T) {
    const value = await this.process(params);

    if (value) {
      await this.messagingManager.sendEvent(SensorReading)({
        sensor_id,
        value,
      });
    }

    return value;
  }

  protected abstract process(params: T): Promise<number>;
}
