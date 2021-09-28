import { Actor, StringProperty } from '@overtheairbrew/homebrew-plugin';

export class TestingActor extends Actor {
  constructor() {
    super('testing-actor', [new StringProperty('testingprop', 'data', true)]);
  }

  public async on(params: any) {}
  public async off(params: any) {}
}
