import { ClassType } from '../class-type';
import { IPeripheral, Peripheral, Property } from '../properties';

export interface ILogic<T> extends IPeripheral {
  process: (params: T) => Promise<void>;
}

export const ILogic = class Dummy {} as ClassType<ILogic<any>>;

export abstract class Logic<T> extends Peripheral implements ILogic<T> {
  constructor(logicName: string, public properties: Property[]) {
    super(`${logicName}-logic`, properties);
  }

  protected async run(params: T) {
    return await this.process(params);
  }

  public abstract process(params: T): Promise<void>;
}
