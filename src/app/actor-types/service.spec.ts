import { Test } from '@nestjs/testing';
import { InvalidActorTypeError } from '../lib/errors/invalid-sensor-type';
import { Actor, IActor } from '../lib/plugin/abstractions/actor';
import { NumberProperty } from '../lib/plugin/properties';
import { PropertyMapper } from '../lib/property-mapper';
import { ActorTypeDto } from '../models/dto/actor-type.dto';
import { ActorTypesService } from './service';

class TestingActorType extends Actor<any> implements IActor<any> {
  constructor() {
    super('testing', [new NumberProperty('number', true)], {
      en: {},
    });
  }

  async processOn(params: any): Promise<void> {
    return;
  }

  protected async processOff(params: any): Promise<void> {
    return;
  }
}

describe('actor-types-service', () => {
  let service: ActorTypesService;
  let mapperSpy: PropertyMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ActorTypesService,
        TestingActorType,
        {
          provide: 'IActors',
          useFactory: (...actors: any) => {
            return actors;
          },
          inject: [TestingActorType],
        },
        {
          provide: PropertyMapper,
          useFactory: () => ({
            map: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(ActorTypesService);
    mapperSpy = moduleRef.get(PropertyMapper);
  });

  describe('getActorTypes', () => {
    it('should map all the properties', async () => {
      await service.getActorTypes();
      expect(mapperSpy.map).toHaveBeenCalled();
    });
  });

  describe('getRawActorTypeById', () => {
    it('should return the raw actor type', async () => {
      const actorType = await service.getRawActorTypeById('testing-actor');
      expect(actorType).toBeInstanceOf(TestingActorType);
    });

    it('should throw an error when the actor-type does not exist', async () => {
      try {
        await service.getRawActorTypeById('unknown');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidActorTypeError);
      }
    });
  });

  describe('getActorTypeById', () => {
    it('should return a mapped actor type', async () => {
      const actorType = await service.getActorTypeById('testing-actor');
      expect(actorType).toBeInstanceOf(ActorTypeDto);
    });
  });

  describe('validateConfig', () => {
    it('should return true when the config is valid', async () => {
      const valid = await service.validateConfig('testing-actor', {
        number: 1,
      });

      expect(valid).toBeTruthy();
    });

    it('should return false when the config is invalid', async () => {
      const valid = await service.validateConfig('testing-actor', {
        number: undefined,
      });

      expect(valid).toBeFalsy();
    });
  });
});
