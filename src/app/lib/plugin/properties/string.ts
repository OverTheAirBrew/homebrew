import { Property } from './base-property';

export class StringProperty extends Property {
  constructor(public id: string, public required: boolean) {
    super('string');
  }

  public async validateProperty(param: string | undefined) {
    if (this.required && !param) {
      return false;
    }

    return true;
  }
}
