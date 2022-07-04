import { Test } from '@nestjs/testing';
import { Actor, NumberProperty } from '@ota-internal/shared';
import { InvalidActorTypeError } from '../../../lib/errors/invalid-actor-type';
import { PropertyMapper } from '../../../lib/property-mapper';
import { DeviceTypesService } from '../device-types/service';
import { ActorTypesService } from './service';

class TestingActorType extends Actor<any> {
  constructor() {
    super('testing', [new NumberProperty('number', true)], undefined);
  }

  protected processOn(params: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  protected processOff(params: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

describe('actor-types-service', () => {
  let service: ActorTypesService;
  let mapperSpy: PropertyMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ActorTypesService,
        {
          provide: PropertyMapper,
          useFactory: () => ({
            map: jest.fn(),
          }),
        },
        {
          provide: DeviceTypesService,
          useFactory: () => ({
            getRawDeviceTypeById: jest.fn().mockResolvedValue({
              actors: [new TestingActorType()],
            }),
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(ActorTypesService);
    mapperSpy = moduleRef.get(PropertyMapper);
  });

  describe('getActorTypes', () => {
    it('should map all the properties', async () => {
      await service.getActorTypes('testing-device');
      expect(mapperSpy.map).toHaveBeenCalled();
    });
  });

  describe('getRawActorTypeById', () => {
    it('should return the raw actor type', async () => {
      const actorType = await service.getRawActorTypeById(
        'testing-device',
        'testing-actor',
      );
      expect(actorType).toBeInstanceOf(TestingActorType);
    });

    it('should throw an error when the actor-type does not exist', async () => {
      try {
        await service.getRawActorTypeById('testing-device', 'unknown');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidActorTypeError);
      }
    });
  });

  // describe('getActorTypeById', () => {
  //   it('should return a mapped actor type', async () => {
  //     const actorType = await service.getActorTypeById('testing-actor');
  //     expect(actorType).toBeInstanceOf(ActorTypeDto);
  //   });
  // });

  describe('validateConfig', () => {
    it('should return true when the config is valid', async () => {
      const valid = await service.validateConfig(
        'testing-device',
        'testing-actor',
        {
          number: 1,
        },
      );

      expect(valid).toBeTruthy();
    });

    it('should return false when the config is invalid', async () => {
      const valid = await service.validateConfig(
        'testing-device',
        'testing-actor',
        {
          number: undefined,
        },
      );

      expect(valid).toBeFalsy();
    });
  });
});
