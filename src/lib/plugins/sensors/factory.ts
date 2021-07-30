import { Service } from 'typedi';
import { SensorType } from '../../../orm/models/sensor';
import { Sensor } from '../../base-classes/sensor';
import { IOneWireParams, OneWireSensor } from './one-wire';

type ImplementationParams = IOneWireParams;

@Service()
export class SensorFactory {
  public async getSensorImplementation(
    type: SensorType,
    params: ImplementationParams,
  ): Promise<Sensor> {
    switch (type) {
      case 'one-wire':
        return new OneWireSensor(params as IOneWireParams);
    }
  }
}
