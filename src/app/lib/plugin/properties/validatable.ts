import { Property } from '.';

export abstract class Validatable {
  constructor(public properties: Property[]) {}

  public async validate(params: any): Promise<boolean> {
    const validationResults = await Promise.all(
      this.properties.map((prop) => prop.validateProperty(params[prop.id])),
    );

    return !validationResults.some((res) => !res);
  }
}
