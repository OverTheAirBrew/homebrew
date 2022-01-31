import { Property } from '.';
import { ILocale } from '../abstractions/locale-type';

export abstract class BaseType {
  constructor(
    public properties: Property[],
    public localizations: Record<ILocale, Record<string, string>>,
  ) {}

  public async validate(params: any): Promise<boolean> {
    const validationResults = await Promise.all(
      this.properties.map((prop) => prop.validateProperty(params[prop.id])),
    );

    return !validationResults.some((res) => !res);
  }

  public async generateLocalizations() {}
}
