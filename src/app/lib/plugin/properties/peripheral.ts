import { Property } from '.';

export type PeripheralLocalizations = Record<'en', Record<string, string>> &
  Record<string, Record<string, string>>;

export abstract class Peripheral {
  constructor(
    public name: string,
    public properties: Property[],
    public localizations: PeripheralLocalizations,
  ) {}

  public async validate(params: any): Promise<boolean> {
    const validationResults = await Promise.all(
      this.properties.map(
        async (prop) => await prop.validateProperty(params[prop.id]),
      ),
    );

    return !validationResults.some((res) => !res);
  }
}
