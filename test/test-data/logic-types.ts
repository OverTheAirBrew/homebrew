import { Logic, StringProperty } from '@overtheairbrew/homebrew-plugin';

export class TestLogicType extends Logic {
  constructor() {
    super('test-logic', [new StringProperty('testingprop', 'data', true)]);
  }

  public async run(params: any) {
    return {
      heatTime: 1,
      waitTime: 1,
      opts: {},
    };
  }
}
