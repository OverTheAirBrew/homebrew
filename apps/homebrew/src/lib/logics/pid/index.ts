import { Injectable } from '@nestjs/common';
import { Logic } from '../../plugin/abstractions/logic';
import { NumberProperty } from '../../plugin/properties';

export interface IPidLogicParams {
  p: number;
  i: number;
  d: number;
}

@Injectable()
export class PidLogic extends Logic<IPidLogicParams> {
  constructor() {
    super('pid', [
      new NumberProperty('p', true),
      new NumberProperty('i', true),
      new NumberProperty('d', true),
      new NumberProperty('maxOutput', false),
    ]);
  }

  public async process(params: IPidLogicParams) {
    return;
  }
}
