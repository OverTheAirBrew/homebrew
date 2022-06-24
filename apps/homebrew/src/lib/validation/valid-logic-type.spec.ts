import { Test } from '@nestjs/testing';
import { LogicTypesService } from '../services/logic-types/service';
import { ValidLogicType } from './valid-logic-type';

describe('lib/validation/valid-logic-type', () => {
  let service: ValidLogicType;

  let getRawLogicTypeByIdStub: jest.Mock;

  beforeEach(async () => {
    getRawLogicTypeByIdStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidLogicType],
    })
      .useMocker((token) => {
        if (token === LogicTypesService) {
          return {
            getRawLogicTypeById: getRawLogicTypeByIdStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidLogicType);
  });

  describe('validate', () => {
    it('should return true if there is no value specified', async () => {
      const valid = await service.validate('');
      expect(valid).toBeTruthy();
    });

    it('should return true of the logic type is valid', async () => {
      getRawLogicTypeByIdStub.mockReturnValue({});

      const valid = await service.validate('1');
      expect(valid).toBeTruthy();
    });

    it('should return false if the logic type is invalid', async () => {
      getRawLogicTypeByIdStub.mockImplementation(() => {
        throw new Error('');
      });

      const valid = await service.validate('1');
      expect(valid).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should generate the correct message', () => {
      const message = service.defaultMessage({
        property: 'test-property',
      } as any);

      expect(message).toBe('test-property is not a valid logic type');
    });
  });
});
