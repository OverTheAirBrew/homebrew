import { Service } from 'typedi';
import { Peripheral, PeripheralLocalizations, Property } from '../properties';

@Service()
export abstract class Logic<T> extends Peripheral {
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
