import { Actor, IActor, NumberProperty } from '@ota-internal/shared';

export class TestingActor extends Actor<any> implements IActor<any> {
  constructor(
    private validateFunc: () => Promise<boolean>,
    private onFunc: () => Promise<void>,
    private offFunc: () => Promise<void>,
  ) {
    super('testing', [new NumberProperty('number', true)], undefined);
  }

  public async validate(params: any): Promise<boolean> {
    return await this.validateFunc();
  }

  protected async processOn(params: any): Promise<void> {
    return await this.onFunc();
  }

  protected async processOff(params: any): Promise<void> {
    return await this.offFunc();
  }
}
