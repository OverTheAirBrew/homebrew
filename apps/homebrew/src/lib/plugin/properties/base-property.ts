type PropertyType = 'string' | 'number' | 'select-box';

export type AdditionalValidation = (value: any) => Promise<boolean>;

export abstract class Property {
  abstract required: boolean;
  abstract id: string;

  constructor(
    public type: PropertyType,
    private additionalValidation: AdditionalValidation = async () => {
      return true;
    },
  ) {}

  protected async runAdditionalValidation(value: any) {
    return await this.additionalValidation(value);
  }

  abstract validateProperty(param: any): Promise<boolean>;
}
