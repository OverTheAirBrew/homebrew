import { Test } from '@nestjs/testing';
import { ActorTypesService } from '../services/actor-types/service';
import { ValidActorConfig } from './validate-actor-config';

describe('lib/validation/valid-actor-config', () => {
  let service: ValidActorConfig;

  let validateConfigStub: jest.Mock;

  beforeEach(async () => {
    validateConfigStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidActorConfig],
    })
      .useMocker((token) => {
        if (token === ActorTypesService) {
          return {
            validateConfig: validateConfigStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidActorConfig);
  });

  describe('validate', () => {
    it('should return true if there is no type_id in the request', async () => {
      const response = await service.validate('test', { object: {} } as any);
      expect(response).toBeTruthy();
    });

    it('should return true of the config is valid', async () => {
      validateConfigStub.mockReturnValue(true);

      const response = await service.validate('test', {
        object: {
          type_id: 'testing',
        },
      } as any);

      expect(response).toBeTruthy();
    });

    it('should return false if the config is invalid', async () => {
      validateConfigStub.mockReturnValue(false);

      const response = await service.validate('test', {
        object: {
          type_id: 'testing',
        },
      } as any);

      expect(response).toBeFalsy();
    });

    it('should return false if there is an error validating the config', async () => {
      validateConfigStub.mockImplementation(() => {
        throw new Error();
      });

      const response = await service.validate('test', {
        object: {
          type_id: 'testing',
        },
      } as any);

      expect(response).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should generate the correct message', () => {
      const message = service.defaultMessage({
        property: 'test-property',
      } as any);

      expect(message).toBe('The config is invalid for the actor type');
    });
  });
});
