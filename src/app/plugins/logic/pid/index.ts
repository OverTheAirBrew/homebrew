import { LogicService } from '../../../lib/plugin';
import { Logic } from '../../../lib/plugin/abstractions/logic';
import { NumberProperty } from '../../../lib/plugin/properties';

export interface IPidLogicParams {
  p: number;
  i: number;
  d: number;
}

@LogicService()
export class PidLogic extends Logic<IPidLogicParams> {
  constructor() {
    super(
      'pid',
      [
        new NumberProperty('p', true),
        new NumberProperty('i', true),
        new NumberProperty('d', true),
        new NumberProperty('maxOutput', false),
      ],
      {
        en: {
          p: 'P',
          i: 'I',
          d: 'D',
          maxOutput: 'Max Output',
        },
      },
    );
  }

  public async process(params: IPidLogicParams) {
    return;
  }
}