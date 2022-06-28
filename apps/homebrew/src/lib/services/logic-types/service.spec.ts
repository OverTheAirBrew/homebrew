import { Test } from '@nestjs/testing';
import { ILogics } from '../../../lib/constants';
import { InvalidLogicTypeError } from '../../../lib/errors/invalid-logic-type';
import { Logic } from '../../../lib/plugin/abstractions/logic';
import { NumberProperty } from '../../../lib/plugin/properties';
import { PropertyMapper } from '../../../lib/property-mapper';
import { LogicTypeDto } from '../../../models/dto/logic-type.dto';
import { LogicTypesService } from './service';

class TestingLogicType extends Logic<any> {
  constructor() {
    super('testing', [new NumberProperty('number', true)]);
  }

  public async process() {
    return;
  }
}

describe('logic-types-service', () => {
  let service: LogicTypesService;
  let mapperSpy: PropertyMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LogicTypesService,
        TestingLogicType,
        {
          provide: ILogics,
          useFactory: (...logics: any) => {
            return logics;
          },
          inject: [TestingLogicType],
        },
        {
          provide: PropertyMapper,
          useFactory: () => ({
            map: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(LogicTypesService);
    mapperSpy = moduleRef.get(PropertyMapper);
  });

  describe('getLogicTypes', () => {
    it('should map all the properties', async () => {
      await service.getLogicTypes();
      expect(mapperSpy.map).toHaveBeenCalled();
    });
  });

  describe('getRawLogicTypeById', () => {
    it('should return the raw logic type', async () => {
      const logicType = await service.getRawLogicTypeById('testing-logic');
      expect(logicType).toBeInstanceOf(TestingLogicType);
    });

    it('should throw an error if the logic type does not exist', async () => {
      try {
        await service.getRawLogicTypeById('invalid-logic');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidLogicTypeError);
      }
    });
  });

  describe('getLogicTypeById', () => {
    it('should return a mapped logic type', async () => {
      const logicType = await service.getLogicTypeById('testing-logic');
      expect(logicType).toBeInstanceOf(LogicTypeDto);
    });
  });

  describe('validateConfig', () => {
    it('should return true when the config is valid', async () => {
      const valid = await service.validateConfig('testing-logic', {
        number: 1,
      });

      expect(valid).toBeTruthy();
    });

    it('should return false when the config is invalid', async () => {
      const valid = await service.validateConfig('testing-logic', {
        number: undefined,
      });

      expect(valid).toBeFalsy();
    });
  });
});
