import { Logic } from '../../../src/lib/plugin/abstractions/logic';
import { NumberProperty } from '../../../src/lib/plugin/properties';

export class TestingLogicType extends Logic<any> {
  constructor() {
    super('testing', [new NumberProperty('number', true)]);
  }

  public async process() {
    return;
  }
}
