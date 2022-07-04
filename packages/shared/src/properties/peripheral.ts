import { IProperty } from './base-property';

export interface IPeripheral {
  validate(params: any): Promise<boolean>;
  name: string;
  properties: IProperty[];
}

export abstract class Peripheral {
  constructor(public name: string, public properties: IProperty[]) {}

  public async validate(params: any): Promise<boolean> {
    const validationResults = await Promise.all(
      this.properties.map(
        async (prop) => await prop.validateProperty(params[prop.id]),
      ),
    );

    return !validationResults.some((res) => !res);
  }
}
