import { Sensor, StringProperty } from '@overtheairbrew/homebrew-plugin';
import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { PropertyMapper } from '../../../src/app/lib/property-mapper';
import { SensorTypesService } from '../../../src/app/lib/sensor-types';

class TestSensor extends Sensor {
  constructor() {
    super('testing-sensor', [new StringProperty('test', 'test', true)]);
  }

  public async run(params: any): Promise<number> {
    return 1;
  }
}

describe('lib/sensor-types', () => {
  let sensorTypesService: SensorTypesService;

  let propertyMapper: StubbedInstance<PropertyMapper>;

  before(() => {
    propertyMapper = stubConstructor(PropertyMapper);
    propertyMapper.map.resolves({} as any);

    sensorTypesService = new SensorTypesService(
      [new TestSensor()],
      propertyMapper,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getSensorTypes', () => {
    it('should map all the properties', async () => {
      await sensorTypesService.getSensorTypes();
      expect(propertyMapper.map.callCount).to.eq(1);
    });
  });
});
