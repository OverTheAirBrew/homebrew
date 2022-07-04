import { ClassType } from '../class-type';
import { IPeripheral, Peripheral } from '../properties';
import { Property } from '../properties/base-property';

export interface ILogic<T> extends IPeripheral {
  run: (
    params: T,
    currentTemp: number,
    targetTemp: number,
  ) => Promise<{ heatTime: number; waitTime: number; nextParams: T }>;
}

export const ILogic = class Dummy {} as ClassType<ILogic<any>>;

export abstract class Logic<T> extends Peripheral implements ILogic<T> {
  constructor(logicName: string, public properties: Property[]) {
    super(`${logicName}-logic`, properties);
  }

  public async run(params: T, currentTemp: number, targetTemp: number) {
    return await this.process(params, currentTemp, targetTemp);
  }

  protected abstract process(
    params: T,
    currentTemp: number,
    targetTemp: number,
  ): Promise<{ heatTime: number; waitTime: number; nextParams: T }>;
}
