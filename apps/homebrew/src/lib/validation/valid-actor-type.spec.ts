import { Test } from '@nestjs/testing';
import { DeviceTypesService } from '../services/device-types/service';
import { DeviceService } from '../services/device/service';
import { ValidActorType } from './valid-actor-type';

describe('lib/validation/valid-actor-type', () => {
  let service: ValidActorType;

  let getRawActorTypeByIdStub: jest.Mock;

  beforeEach(async () => {
    getRawActorTypeByIdStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidActorType],
    })
      .useMocker((token) => {
        if (token === DeviceService) {
          return {
            getDeviceById: jest.fn().mockReturnValue({ type_id: 1 }),
          };
        }

        if (token === DeviceTypesService) {
          return {
            getRawActorTypeById: getRawActorTypeByIdStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidActorType);
  });

  describe('validate', () => {
    it('should return true if the actor-type is valid', async () => {
      getRawActorTypeByIdStub.mockReturnValue({});
      const valid = await service.validate('', { object: {} } as any);
      expect(valid).toBeTruthy();
    });

    it('should return false if the actor-type is invalid', async () => {
      getRawActorTypeByIdStub.mockImplementation(() => {
        throw new Error('');
      });

      const valid = await service.validate('', { object: {} } as any);
      expect(valid).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should generate the correct message', () => {
      const message = service.defaultMessage({
        property: 'test-property',
      } as any);

      expect(message).toBe('test-property is not a valid actor type');
    });
  });
});
