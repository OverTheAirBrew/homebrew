import Container from 'typedi';
import { SensorReading } from '../messages/events/sensor-reading';
import { Property, Validatable } from '../properties';
import { IMessagingManager } from './messaging-manager';

export abstract class Sensor<T> extends Validatable {
  private messagingManager: IMessagingManager;

  constructor(public sensorName: string, public properties: Property[]) {
    super(properties);
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
