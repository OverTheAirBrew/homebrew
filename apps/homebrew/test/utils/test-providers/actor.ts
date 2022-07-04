import { Actor, IActor } from '../../../src/lib/plugin/abstractions/actor';
import { NumberProperty } from '../../../src/lib/plugin/properties';

export class TestingActor extends Actor<any> implements IActor<any> {
  constructor(private validateFunc: () => Promise<boolean>) {
    super('testing', [new NumberProperty('number', true)], undefined);
  }

  public async validate(params: any): Promise<boolean> {
    return await this.validateFunc();
  }

  protected processOn(params: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  protected processOff(params: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
