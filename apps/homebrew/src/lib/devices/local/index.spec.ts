import { Test } from '@nestjs/testing';
import { LocalDevice } from '.';
import { TestingActor } from '../../../../test/utils/test-providers/actor';
import { TestingSensor } from '../../../../test/utils/test-providers/sensor';
import { IActors, ISensors } from '../../constants';
import { PropertyMapper } from '../../property-mapper';

describe('lib/devices/local', () => {
  let service: LocalDevice;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocalDevice,
        TestingSensor,
        TestingActor,
        {
          provide: ISensors,
          useFactory: (...sensors: any) => {
            return sensors;
          },
          inject: [TestingSensor],
        },
        {
          provide: IActors,
          useFactory: (...actors: any) => {
            return actors;
          },
          inject: [TestingActor],
        },
        PropertyMapper,
      ],
    }).compile();

    service = moduleRef.get(LocalDevice);
  });

  // Fake test as there is technically nothing to test atm
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
