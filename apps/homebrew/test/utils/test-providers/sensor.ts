import { ISensor, NumberProperty, Sensor } from '@ota-internal/shared';

export class TestingSensor extends Sensor<any> implements ISensor<any> {
  constructor(private validateFunc: () => Promise<boolean>) {
    super('testing', [new NumberProperty('number', true)]);
  }

  public async validate(params: any): Promise<boolean> {
    return await this.validateFunc();
  }

  public async process() {
    return 1;
  }
}
