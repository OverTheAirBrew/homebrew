import { Property } from '.';

export class NumberProperty extends Property {
  constructor(public id: string, public required: boolean) {
    super('number');
  }

  public async validateProperty(param: any) {
    if (this.required && !param) {
      return false;
    }

    if (!param) return true;

    const parsedValue = parseInt(param);
    return !!parsedValue;
  }
}
