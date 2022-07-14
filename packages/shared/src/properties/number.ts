import { AdditionalValidation, Property } from './base-property';

export class NumberProperty extends Property {
  constructor(
    public id: string,
    public required: boolean,
    additionalValidation?: AdditionalValidation,
  ) {
    super('number', additionalValidation);
  }

  public async validateProperty(param: any) {
    if (this.required && !param) {
      return false;
    }

    if (!param) return true;

    const isInteger = Number.isInteger(param);

    if (!isInteger) return false;

    return await this.runAdditionalValidation(param);
  }
}
