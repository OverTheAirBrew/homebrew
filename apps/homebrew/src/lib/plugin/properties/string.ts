import { AdditionalValidation, Property } from './base-property';

export class StringProperty extends Property {
  constructor(
    public id: string,
    public required: boolean,
    additionalValidation?: AdditionalValidation,
  ) {
    super('string', additionalValidation);
  }

  public async validateProperty(param: string | undefined) {
    if (this.required && !param) {
      return false;
    }

    return await this.runAdditionalValidation(param);
  }
}
