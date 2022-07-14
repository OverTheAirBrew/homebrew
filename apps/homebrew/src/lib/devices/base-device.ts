import {
  ClassType,
  IActor,
  IPeripheral,
  IProperty,
  ISensor,
  Peripheral,
} from '@ota-internal/shared';

export interface IDevice<T> extends IPeripheral {
  actors: IActor<any>[];
  sensors: ISensor<any>[];
}

export const IDevice = class Dummy {} as ClassType<IDevice<any>>;

export abstract class Device<T> extends Peripheral implements IDevice<T> {
  constructor(
    name: string,
    properties: IProperty[],
    public actors: IActor<any>[],
    public sensors: ISensor<any>[],
  ) {
    super(`${name}-device`, properties);
  }
}
