import { Test } from '@nestjs/testing';
import { IPidLogicParams, PidLogic } from '.';

const globalParams: IPidLogicParams = {
  p: 25,
  i: 1000,
  d: 9,
  max: 4000,
};

describe('plugins/logic/pid', () => {
  let service: PidLogic;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PidLogic],
    }).compile();

    service = moduleRef.get(PidLogic);
  });

  it('should not overheat', async () => {
    let temp: number = 18;
    const target: number = 40;

    let params: IPidLogicParams = globalParams;

    for (let i = 0; i < 150; i++) {
      const { heatTime, nextParams } = await service.run(params, temp, target);

      if (heatTime > 0) {
        temp += (40 - 18) / 100;
      }

      params = nextParams;
    }

    expect(temp).toBeLessThanOrEqual(41);
  });

  it('should have a heat time of 0 when the temps are the same', async () => {
    const { heatTime } = await service.run(globalParams, 10, 10);
    expect(heatTime).toBe(0);
  });

  it('should be 0 when the temp is higher than the target', async () => {
    const { heatTime } = await service.run(globalParams, 100, 10);
    expect(heatTime).toBe(0);
  });

  it('should reach the required temp', async () => {
    let temp = 18;
    let targetTemp = 40;

    let params = globalParams;

    for (let i = 0; i < 100; i++) {
      const { heatTime, nextParams } = await service.run(
        params,
        temp,
        targetTemp,
      );

      if (heatTime > 0) {
        temp += (40 - 18) / 100;
      }

      params = nextParams;
    }

    expect(temp).toBeLessThan(41);
    expect(temp).toBeGreaterThan(39);
  });

  it('should set max to 4000 if one isnt provided', async () => {
    const { nextParams } = await service.run(
      {
        ...globalParams,
        max: undefined,
      },
      10,
      10,
    );

    expect(nextParams.max).toBe(4000);
  });

  it('should work with a p > 1000', async () => {
    const { heatTime } = await service.run(
      {
        ...globalParams,
        p: 1001,
      },
      10,
      100,
    );

    expect(heatTime).toBe(4000);
  });

  it('should work with a d > 1000', async () => {
    const { heatTime } = await service.run(
      {
        ...globalParams,
        d: 1001,
      },
      10,
      100,
    );

    expect(heatTime).toBe(4000);
  });

  it('should work with a negative d', async () => {
    const { heatTime } = await service.run(
      {
        ...globalParams,
        d: -1,
        e: -1000,
      },
      10,
      100,
    );

    expect(heatTime).toBe(4000);
  });
});
