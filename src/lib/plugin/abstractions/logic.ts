import { ClassType } from '../class-type';
import {
  IPeripheral,
  Peripheral,
  PeripheralLocalizations,
  Property,
} from '../properties';

export interface ILogic<T> extends IPeripheral {
  process: (params: T) => Promise<void>;
}

export const ILogic = class Dummy {} as ClassType<ILogic<any>>;

export abstract class Logic<T> extends Peripheral implements ILogic<T> {
  constructor(
    logicName: string,
    public properties: Property[],
    public localizations: PeripheralLocalizations,
  ) {
    super(`${logicName}-logic`, properties, localizations);
  }

  protected async run(params: T) {
    return await this.process(params);
  }

  public abstract process(params: T): Promise<void>;
}
