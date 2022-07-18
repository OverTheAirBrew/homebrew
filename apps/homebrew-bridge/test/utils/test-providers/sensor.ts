import { ISensor, SelectBoxProperty, Sensor } from '@ota-internal/shared';

export class TestingSensor extends Sensor<any> implements ISensor<any> {
  constructor(
    private validateFunc: () => Promise<boolean>,
    private processFunc: () => Promise<number>,
  ) {
    super('testing', [
      new SelectBoxProperty('sensorAddress', true, () => ['12']),
    ]);
  }

  public async validate(params: any): Promise<boolean> {
    return await this.validateFunc();
  }

  public async process() {
    return await this.processFunc();
  }
}
