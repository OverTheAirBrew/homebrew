import { Test } from '@nestjs/testing';
import { LogicTypesService } from '../services/logic-types/service';
import { ValidLogicConfig } from './validate-logic-config';

describe('lib/validation/valid-actor-config', () => {
  let service: ValidLogicConfig;

  let validateConfigStub: jest.Mock;

  beforeEach(async () => {
    validateConfigStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidLogicConfig],
    })
      .useMocker((token) => {
        if (token === LogicTypesService) {
          return {
            validateConfig: validateConfigStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidLogicConfig);
  });

  describe('validate', () => {
    it('should return true if there is no logic_type in the request', async () => {
      const response = await service.validate('test', { object: {} } as any);
      expect(response).toBeTruthy();
    });

    it('should return true if the config is valid', async () => {
      validateConfigStub.mockReturnValue(true);

      const response = await service.validate('test', {
        object: {
          logic_id: 'testing',
        },
      } as any);

      expect(response).toBeTruthy();
    });

    it('should return false if the config is invalid', async () => {
      validateConfigStub.mockReturnValue(false);

      const response = await service.validate('test', {
        object: {
          logic_id: 'testing',
        },
      } as any);

      expect(response).toBeFalsy();
    });

    it('should return false if something happens while validating the config', async () => {
      validateConfigStub.mockImplementation(() => {
        throw new Error();
      });

      const response = await service.validate('test', {
        object: {
          logic_id: 'testing',
        },
      } as any);

      expect(response).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      const response = service.defaultMessage({
        property: 'test-property',
      } as any);

      expect(response).toBe('Config is not valid for the logic type');
    });
  });
});
