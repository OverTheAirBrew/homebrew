import { ClassType } from '@ota-internal/shared';
import { Temperature } from './models/temperature';

export interface IOneWireController {
  findDevices(hint?: string): Promise<string[]>;
  getCurrentValue(deviceName: string): Promise<Temperature>;
}

export const IOneWireController =
  class Dummy {} as ClassType<IOneWireController>;
