import { Test } from '@nestjs/testing';
import { PidLogic } from '.';

describe('plugins/logic/pid', () => {
  let service: PidLogic;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PidLogic],
    }).compile();

    service = moduleRef.get(PidLogic);
  });

  it('should process the logic', async () => {
    await service.process({
      p: 1,
      i: 1,
      d: 1,
    });
  });
});
