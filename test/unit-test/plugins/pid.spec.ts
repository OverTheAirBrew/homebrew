import { PidLogic } from '../../../src/app/plugins/logic/pid';

describe('plugins/lib', () => {
  let pidLogic: PidLogic;

  beforeEach(() => {
    pidLogic = new PidLogic();
  });

  afterEach(() => {});

  it('should return', async () => {
    await pidLogic.process({ p: 1, i: 2, d: 3 });
  });
});
