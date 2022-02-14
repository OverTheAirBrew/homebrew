import { expect } from 'chai';
import { StubbedInstance, stubConstructor } from 'ts-sinon';
import { InvalidLogicTypeError } from '../../../src/app/lib/errors/invalid-logic-type';
import { LogicTypesService } from '../../../src/app/lib/logic-types';
import { Logic } from '../../../src/app/lib/plugin/abstractions/logic';
import { StringProperty } from '../../../src/app/lib/plugin/properties';
import { PropertyMapper } from '../../../src/app/lib/property-mapper';

class TestLogic extends Logic<any> {
  constructor() {
    super('testing', [new StringProperty('test', true)], { en: {} });
  }

  public async process(params: any): Promise<void> {
    return;
  }
}

describe('lib/logic-types', () => {
  let logicTypesService: LogicTypesService;

  let propertyMapperStub: StubbedInstance<PropertyMapper>;

  beforeEach(() => {
    propertyMapperStub = stubConstructor(PropertyMapper);
    propertyMapperStub.map.resolves({} as any);

    logicTypesService = new LogicTypesService(
      [new TestLogic()],
      propertyMapperStub,
    );
  });

  describe('getLogicTypes', () => {
    it('should map all the logic types', async () => {
      await logicTypesService.getLogicTypes();
      expect(propertyMapperStub.map.callCount).to.eq(1);
    });
  });

  describe('getRawLogicTypeById', () => {
    it('should return the logic type', async () => {
      const logicType = await logicTypesService.getRawLogicTypeById(
        'testing-logic',
      );
      expect(logicType).to.not.be.undefined;
      expect(logicType).to.be.instanceOf(TestLogic);
    });

    it('should throw an error if the type does not exist', async () => {
      try {
        await logicTypesService.getLogicTypeById('unknown-logic');
      } catch (err) {
        expect(err).to.be.instanceOf(InvalidLogicTypeError);
      }
    });
  });

  describe('getLogicTypeById', () => {
    it('should map the logic type', async () => {
      await logicTypesService.getLogicTypeById('testing-logic');
      expect(propertyMapperStub.map.callCount).to.eq(1);
    });
  });
});
