import { Property } from './base-property';

export class SelectBoxProperty<T extends string | number> extends Property {
  constructor(
    public id: string,
    public required: boolean,
    public values: () => Promise<T[]> | T[],
  ) {
    super('select-box');
  }

  public async getValues(): Promise<T[]> {
    if (typeof this.values === 'function') {
      return await this.values();
    }

    return this.values;
  }

  public async validateProperty(value: T | undefined) {
    if (this.required && !value) {
      return false;
    }

    if (!value) {
      return true;
    }

    const values = await this.getValues();
    return values.includes(value);
  }
}
