import { Test } from '@nestjs/testing';
import { ActorService } from '../services/actor/service';
import { ValidActor } from './valid-actor';

describe('lib/validation/valid-actor', () => {
  let service: ValidActor;

  let getActorByIdStub: jest.Mock;

  beforeEach(async () => {
    getActorByIdStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidActor],
    })
      .useMocker((token) => {
        if (token === ActorService) {
          return {
            getActorById: getActorByIdStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidActor);
  });

  describe('validate', () => {
    it('should return true if the actor exists', async () => {
      getActorByIdStub.mockReturnValue({});

      const result = await service.validate('test');
      expect(result).toBeTruthy();
    });

    it('should return false if the actor doesnt exists', async () => {
      getActorByIdStub.mockImplementation(() => {
        throw new Error('');
      });

      const result = await service.validate('test');
      expect(result).toBeFalsy();
    });

    it('should return true of there is no value', async () => {
      const result = await service.validate('');
      expect(result).toBeTruthy();
    });
  });

  describe('defaultMessage', () => {
    it('should return the correct message', () => {
      const message = service.defaultMessage({
        property: 'test-property',
      } as any);

      expect(message).toBe('test-property is not a valid actor');
    });
  });
});
